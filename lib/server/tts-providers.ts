/**
 * tts-providers.ts — pluggable Text-to-Speech backend.
 *
 * The public /api/v1/voice/tts endpoint doesn't care which vendor actually
 * generates the audio. It asks this module to `synthesize()`, and we route to
 * whichever provider the caller is configured for:
 *
 *   • Sarvam AI  — India-native, best Hindi prosody. WAV.
 *   • ElevenLabs — strong multilingual. MP3.
 *
 * Key resolution (in priority order):
 *   1. A per-user "bring your own key" integration connected from the
 *      dashboard Voice tab (passed in as a ResolvedProvider). This is the
 *      smooth path — the user pastes a key in the UI, picks the provider,
 *      and it just works. No Vercel env editing.
 *   2. Platform env fallback (SARVAM_API_KEY / ELEVENLABS_API_KEY, optional
 *      TTS_PROVIDER override) for callers with no connected integration.
 */

export type TtsProviderName = "sarvam" | "elevenlabs";

export const TTS_PROVIDERS: TtsProviderName[] = ["sarvam", "elevenlabs"];

// A fully-resolved provider choice: which vendor + the actual API key to use,
// plus any saved per-provider defaults. Produced either from a user's DB
// integration or from platform env.
export interface ResolvedProvider {
  provider: TtsProviderName;
  apiKey: string;
  settings?: Record<string, any> | null;
}

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

// Platform env fallback: which provider the deployment itself is keyed for,
// used only when a caller has no connected per-user integration.
export function envProvider(): ResolvedProvider | null {
  const sarvam = (process.env.SARVAM_API_KEY || "").trim();
  const eleven = (process.env.ELEVENLABS_API_KEY || "").trim();
  const override = (process.env.TTS_PROVIDER || "").trim().toLowerCase();

  if (override === "sarvam") return sarvam ? { provider: "sarvam", apiKey: sarvam } : null;
  if (override === "elevenlabs") return eleven ? { provider: "elevenlabs", apiKey: eleven } : null;

  if (sarvam) return { provider: "sarvam", apiKey: sarvam };
  if (eleven) return { provider: "elevenlabs", apiKey: eleven };
  return null;
}

/**
 * Generate audio. Prefer the caller's connected integration (BYOK); otherwise
 * fall back to the platform's env key. Throws TtsNotConfiguredError when
 * neither exists.
 */
export async function synthesize(
  opts: SynthesizeOptions,
  resolved?: ResolvedProvider | null
): Promise<SynthesizedAudio> {
  const r = resolved || envProvider();
  if (!r || !r.apiKey) throw new TtsNotConfiguredError();

  // Merge the integration's saved defaults under the per-request options.
  const merged: SynthesizeOptions = { ...opts };
  const s = r.settings || {};
  merged.voiceId = merged.voiceId ?? s.voiceId ?? s.speaker;
  merged.modelId = merged.modelId ?? s.modelId ?? s.model;
  merged.stability = merged.stability ?? s.stability;
  merged.similarityBoost = merged.similarityBoost ?? s.similarityBoost;
  merged.language = merged.language ?? s.language;

  return r.provider === "sarvam"
    ? synthSarvam(merged, r.apiKey)
    : synthEleven(merged, r.apiKey);
}

/**
 * Cheaply check that a provider key actually works, so the dashboard can
 * reject a bad key at connect-time instead of failing silently later.
 * ElevenLabs: GET /voices (free, no quota). Sarvam: a 1-char TTS (tiny).
 * Returns { ok } or { ok:false, detail }.
 */
export async function validateProviderKey(
  provider: TtsProviderName,
  apiKey: string
): Promise<{ ok: boolean; detail?: string }> {
  const key = (apiKey || "").trim();
  if (!key) return { ok: false, detail: "Empty key" };
  try {
    if (provider === "elevenlabs") {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": key, Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });
      return res.ok
        ? { ok: true }
        : { ok: false, detail: (await res.text().catch(() => "")).slice(0, 200) };
    }
    // Sarvam — no free validate endpoint; do a minimal synth.
    await synthSarvam({ text: "नमस्ते" }, key);
    return { ok: true };
  } catch (err: any) {
    if (err instanceof TtsUpstreamError) {
      return { ok: false, detail: `${err.status}: ${err.detail}` };
    }
    return { ok: false, detail: err?.message || String(err) };
  }
}

/* ----------------------------- ElevenLabs ------------------------------ */

const ELEVEN_BASE = "https://api.elevenlabs.io/v1/text-to-speech";
const ELEVEN_DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM"; // Rachel (multilingual)
const ELEVEN_DEFAULT_MODEL = "eleven_multilingual_v2";

async function synthEleven(o: SynthesizeOptions, apiKey: string): Promise<SynthesizedAudio> {
  const key = (apiKey || "").trim();
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

async function synthSarvam(o: SynthesizeOptions, apiKey: string): Promise<SynthesizedAudio> {
  const key = (apiKey || "").trim();
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
