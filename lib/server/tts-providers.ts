/**
 * tts-providers.ts — pluggable Text-to-Speech backend.
 *
 * The public /api/v1/voice/tts endpoint doesn't care which vendor actually
 * generates the audio. It asks this module to `synthesize()`, and we route to
 * whichever provider is configured:
 *
 *   • Sarvam AI  (SARVAM_API_KEY)     — India-native, best Hindi prosody. WAV.
 *   • ElevenLabs (ELEVENLABS_API_KEY) — strong multilingual. MP3.
 *
 * Selection (no code change needed to switch):
 *   1. TTS_PROVIDER env ("sarvam" | "elevenlabs") forces a choice.
 *   2. Otherwise auto-detect: Sarvam preferred when its key is present,
 *      else ElevenLabs.
 *
 * This is what makes setup "smooth": the operator just pastes ONE key into
 * Vercel and the right adapter activates — no redeploy of code, no edits.
 */

export type TtsProviderName = "sarvam" | "elevenlabs";

export interface SynthesizeOptions {
  text: string;
  voiceId?: string; // ElevenLabs voice id OR Sarvam speaker name
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  language?: string; // BCP-47-ish, e.g. "hi-IN" (Sarvam)
}

export interface SynthesizedAudio {
  // Typed as Uint8Array (Buffer's supertype) so it's directly assignable to
  // Next's NextResponse BodyInit without a widened-Buffer variance error.
  audio: Uint8Array;
  contentType: string; // "audio/mpeg" | "audio/wav"
  provider: TtsProviderName;
}

export class TtsNotConfiguredError extends Error {
  constructor() {
    super("TTS provider not configured");
    this.name = "TtsNotConfiguredError";
  }
}

export class TtsUpstreamError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`TTS provider error (${status})`);
    this.name = "TtsUpstreamError";
    this.status = status;
    this.detail = (detail || "").slice(0, 300);
  }
}

export function activeProvider(): TtsProviderName | null {
  const hasSarvam = Boolean((process.env.SARVAM_API_KEY || "").trim());
  const hasEleven = Boolean((process.env.ELEVENLABS_API_KEY || "").trim());
  const override = (process.env.TTS_PROVIDER || "").trim().toLowerCase();

  if (override === "sarvam") return hasSarvam ? "sarvam" : null;
  if (override === "elevenlabs") return hasEleven ? "elevenlabs" : null;

  if (hasSarvam) return "sarvam";
  if (hasEleven) return "elevenlabs";
  return null;
}

export async function synthesize(opts: SynthesizeOptions): Promise<SynthesizedAudio> {
  const provider = activeProvider();
  if (!provider) throw new TtsNotConfiguredError();
  return provider === "sarvam" ? synthSarvam(opts) : synthEleven(opts);
}

/* ----------------------------- ElevenLabs ------------------------------ */

const ELEVEN_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVEN_DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel (multilingual)
const ELEVEN_DEFAULT_MODEL = "eleven_multilingual_v2";

async function synthEleven(o: SynthesizeOptions): Promise<SynthesizedAudio> {
  const key = (process.env.ELEVENLABS_API_KEY || "").trim();
  const voiceId = o.voiceId || ELEVEN_DEFAULT_VOICE;
  const modelId = o.modelId || ELEVEN_DEFAULT_MODEL;

  const res = await fetch(`${ELEVEN_BASE}/${encodeURIComponent(voiceId)}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: o.text,
      model_id: modelId,
      voice_settings: {
        stability: clamp01(o.stability, 0.5),
        similarity_boost: clamp01(o.similarityBoost, 0.75),
      },
    }),
  });

  if (!res.ok) {
    throw new TtsUpstreamError(res.status, await res.text().catch(() => ""));
  }
  const audio = Buffer.from(await res.arrayBuffer());
  return { audio, contentType: "audio/mpeg", provider: "elevenlabs" };
}

/* ------------------------------- Sarvam -------------------------------- */

const SARVAM_TTS = "https://api.sarvam.ai/text-to-speech";
const SARVAM_MAX_INPUT = 480; // provider caps each input at ~500 chars
const SARVAM_MAX_CHARS = 2400; // bound total work (latency/cost) per call

// bulbul:v2 speakers, used as the default catalog for the dashboard too.
export const SARVAM_SPEAKERS = [
  { id: "anushka", gender: "female" },
  { id: "manisha", gender: "female" },
  { id: "vidya", gender: "female" },
  { id: "arya", gender: "female" },
  { id: "abhilash", gender: "male" },
  { id: "karun", gender: "male" },
  { id: "hitesh", gender: "male" },
] as const;

async function synthSarvam(o: SynthesizeOptions): Promise<SynthesizedAudio> {
  const key = (process.env.SARVAM_API_KEY || "").trim();
  const speaker = o.voiceId || (process.env.SARVAM_SPEAKER || "").trim() || "anushka";
  const model = o.modelId || (process.env.SARVAM_MODEL || "").trim() || "bulbul:v2";
  const lang = o.language || (process.env.SARVAM_LANGUAGE || "").trim() || "hi-IN";

  const chunks = chunkText(o.text.slice(0, SARVAM_MAX_CHARS), SARVAM_MAX_INPUT);

  // One request per chunk, in parallel; order preserved by the array map.
  const wavs = await Promise.all(
    chunks.map(async (input) => {
      const res = await fetch(SARVAM_TTS, {
        method: "POST",
        headers: {
          "api-subscription-key": key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: [input],
          target_language_code: lang,
          speaker,
          model,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
        }),
      });
      if (!res.ok) {
        throw new TtsUpstreamError(res.status, await res.text().catch(() => ""));
      }
      const data: any = await res.json().catch(() => null);
      const b64 = Array.isArray(data?.audios) ? data.audios[0] : null;
      if (!b64) throw new TtsUpstreamError(502, "Sarvam returned no audio");
      return Buffer.from(b64, "base64");
    })
  );

  const audio = wavs.length === 1 ? wavs[0] : mergeWavs(wavs);
  return { audio, contentType: "audio/wav", provider: "sarvam" };
}

/* ------------------------------ helpers -------------------------------- */

function clamp01(v: unknown, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

// Split into provider-sized pieces, preferring sentence boundaries (Hindi
// danda "।" plus ASCII . ! ? and newlines) so a chunk never cuts mid-word.
function chunkText(text: string, max: number): string[] {
  const sentences = text
    .split(/(?<=[।.!?\n])/)
    .map((s) => s.trim())
    .filter(Boolean);

  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if (s.length > max) {
      // A single sentence longer than the cap — flush, then hard-split it.
      if (cur) {
        out.push(cur);
        cur = "";
      }
      for (let i = 0; i < s.length; i += max) out.push(s.slice(i, i + max));
      continue;
    }
    if ((cur ? cur.length + 1 + s.length : s.length) > max) {
      if (cur) out.push(cur);
      cur = s;
    } else {
      cur = cur ? `${cur} ${s}` : s;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [text.slice(0, max)];
}

// Concatenate canonical PCM WAV buffers into one: keep the first file's header
// (format is identical across chunks since params match), append every chunk's
// PCM data, then patch the RIFF + data sizes.
function mergeWavs(buffers: Buffer[]): Buffer {
  const pcms: Buffer[] = [];
  let header: Buffer | null = null;

  for (const buf of buffers) {
    const dataIdx = buf.indexOf(Buffer.from("data", "ascii"), 12);
    if (dataIdx < 0) {
      // Non-canonical container — best effort, append whole buffer.
      pcms.push(buf);
      continue;
    }
    const dataSize = buf.readUInt32LE(dataIdx + 4);
    const pcmStart = dataIdx + 8;
    pcms.push(buf.subarray(pcmStart, pcmStart + dataSize));
    if (!header) header = Buffer.from(buf.subarray(0, pcmStart));
  }

  if (!header) return Buffer.concat(buffers);
  const pcm = Buffer.concat(pcms);
  const out = Buffer.concat([header, pcm]);
  out.writeUInt32LE(out.length - 8, 4); // RIFF chunk size
  out.writeUInt32LE(pcm.length, header.length - 4); // data subchunk size
  return out;
}
