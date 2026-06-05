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
import {
  synthesize,
  TtsNotConfiguredError,
  TtsUpstreamError,
} from "@/lib/server/tts-providers";

// We stream the audio response back to the caller, so this route must run
// on the Node runtime (Buffer + binary body), not Edge.
export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 5000;

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

  // Fallback chain: request body → key's saved preset → provider default.
  // Lets a customer save "use <voice> @ stability 0.6" on their key and
  // never repeat it on every TTS call. Undefined values let each provider
  // apply its own sensible default (e.g. Hindi speaker for Sarvam).
  const preset = (auth as any).keySettings || {};
  const opts = {
    text,
    voiceId: body?.voiceId || preset.voiceId || undefined,
    modelId: body?.modelId || preset.modelId || undefined,
    stability: body?.stability ?? preset.stability,
    similarityBoost: body?.similarityBoost ?? preset.similarityBoost,
    language: body?.language || preset.language || undefined,
  };

  // 3) Synthesize via whichever provider is configured (Sarvam | ElevenLabs).
  try {
    const { audio, contentType, provider } = await synthesize(opts);

    // Copy into a fresh, ArrayBuffer-backed view so the body type is a
    // concrete (non-shared) buffer that satisfies NextResponse's BodyInit.
    const body = new Uint8Array(audio);

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": audio.length.toString(),
        "Cache-Control": "no-store",
        // Expose how much quota the caller has left so SDKs can warn
        "X-DAI-Provider": provider,
        "X-DAI-Plan": auth.plan,
        "X-DAI-Usage": String(auth.usageCount),
        "X-DAI-Limit": String(auth.monthlyLimit),
        "X-DAI-Remaining": String(auth.remaining),
      },
    });
  } catch (err: any) {
    if (err instanceof TtsNotConfiguredError) {
      return NextResponse.json(
        { error: "TTS provider not configured" },
        { status: 503 }
      );
    }
    if (err instanceof TtsUpstreamError) {
      return NextResponse.json(
        { error: "TTS provider error", status: err.status, detail: err.detail },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "TTS call failed", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
