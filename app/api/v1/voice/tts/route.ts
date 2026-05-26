/**
 * POST /api/v1/voice/tts
 *
 * Public-facing Text-to-Speech endpoint. External sites (KhabarLoktantra,
 * other clients) call this with a Bearer API key obtained from their
 * DigitalAIIndia dashboard.
 *
 * Auth: Authorization: Bearer <api_key>   (or x-api-key header)
 *
 * Body:
 *   {
 *     text:           string  (required)  — the script to speak
 *     voiceId?:       string  — ElevenLabs voice id (default: Adam, English; for
 *                               Hindi prefer "21m00Tcm4TlvDq8ikWAM" or a custom voice)
 *     modelId?:       string  — default "eleven_multilingual_v2" (handles Hindi)
 *     stability?:     number  — 0..1 (default 0.5)
 *     similarityBoost?: number — 0..1 (default 0.75)
 *   }
 *
 * Response: audio/mpeg binary stream of the generated MP3.
 *
 * Quota: each successful call increments the API key's usage counter by 1.
 *        Free-plan accounts get 1000 requests/month per the DigitalAIIndia
 *        usage policy.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  validateApiKeyAndConsume,
  ApiAuthError,
} from "@/lib/server/usage";

// We stream the audio response back to the caller, so this route must run
// on the Node runtime (Buffer + binary body), not Edge.
export const runtime = "nodejs";

// Default voice: a multilingual one that handles Hindi reasonably.
// Customers can override per-request via the `voiceId` body field.
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // "Rachel"
const DEFAULT_MODEL_ID = "eleven_multilingual_v2"; // handles Hindi
const MAX_TEXT_LENGTH = 5000;
const ELEVEN_BASE = "https://api.elevenlabs.io/v1/text-to-speech";

export async function POST(req: NextRequest) {
  // 1) Validate API key + atomically increment usage counter
  let auth;
  try {
    auth = await validateApiKeyAndConsume(req.headers);
  } catch (err: any) {
    if (err instanceof ApiAuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }

  // 2) Parse body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body must be JSON" },
      { status: 400 }
    );
  }

  const text = String(body?.text || "").trim();
  if (!text) {
    return NextResponse.json(
      { error: "Field 'text' is required" },
      { status: 400 }
    );
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `Text exceeds ${MAX_TEXT_LENGTH} character limit` },
      { status: 413 }
    );
  }

  const voiceId = String(body?.voiceId || DEFAULT_VOICE_ID);
  const modelId = String(body?.modelId || DEFAULT_MODEL_ID);
  const stability = clamp01(body?.stability, 0.5);
  const similarityBoost = clamp01(body?.similarityBoost, 0.75);

  // 3) Check provider key
  const elevenKey = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!elevenKey) {
    return NextResponse.json(
      { error: "TTS provider not configured" },
      { status: 503 }
    );
  }

  // 4) Call ElevenLabs REST directly — no SDK = no build-time issues.
  try {
    const elevenRes = await fetch(`${ELEVEN_BASE}/${encodeURIComponent(voiceId)}`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    });

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      return NextResponse.json(
        {
          error: "TTS provider error",
          status: elevenRes.status,
          detail: errText.slice(0, 300),
        },
        { status: 502 }
      );
    }

    const arrayBuf = await elevenRes.arrayBuffer();
    const audio = Buffer.from(arrayBuf);

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audio.length.toString(),
        "Cache-Control": "no-store",
        // Expose how much quota the caller has left so SDKs can warn
        "X-DAI-Plan": auth.plan,
        "X-DAI-Usage": String(auth.usageCount),
        "X-DAI-Limit": String(auth.monthlyLimit),
        "X-DAI-Remaining": String(auth.remaining),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "TTS call failed", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}

function clamp01(v: any, fallback: number): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}
