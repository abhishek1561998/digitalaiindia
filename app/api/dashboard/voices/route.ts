/**
 * GET /api/dashboard/voices
 *
 * Returns the curated list of TTS voices available on this platform,
 * for rendering inside the dashboard Voice Library page.
 *
 * Auth: Clerk session (dashboard-only — not the public Bearer API).
 *
 * Source: ElevenLabs /v1/voices (server-side call, xi-api-key stays
 * on this server — never exposed to the customer).
 *
 * Why curate: ElevenLabs returns the account's full voice catalog
 * (premade + cloned + shared). We normalize the shape, attach a
 * stable preview URL, and pass through useful labels (gender, accent,
 * age, use_case) so the UI can build filter chips.
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { envProvider, SARVAM_SPEAKERS } from "@/lib/server/tts-providers";
import { getActiveIntegration } from "@/lib/server/voice-integrations";

export const runtime = "nodejs";
// Cache the voice list for 1 hour — it rarely changes and ElevenLabs
// rate-limits the /voices endpoint.
const REVALIDATE_SECONDS = 3600;
let cache: { at: number; key: string; voices: NormalizedVoice[] } | null = null;

interface NormalizedVoice {
  voiceId: string;
  name: string;
  category: string; // "premade" | "cloned" | "generated" | "professional" | etc.
  description: string;
  previewUrl: string | null;
  labels: {
    gender?: string;
    accent?: string;
    age?: string;
    useCase?: string;
    descriptive?: string;
  };
}

function normalize(raw: any): NormalizedVoice | null {
  if (!raw?.voice_id) return null;
  return {
    voiceId: raw.voice_id,
    name: raw.name || "(unnamed)",
    category: raw.category || "premade",
    description: raw.description || "",
    previewUrl: raw.preview_url || null,
    labels: {
      gender: raw.labels?.gender,
      accent: raw.labels?.accent,
      age: raw.labels?.age,
      useCase: raw.labels?.use_case || raw.labels?.["use case"],
      descriptive: raw.labels?.descriptive || raw.labels?.description,
    },
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prefer the user's connected integration; fall back to platform env.
  const resolved = (await getActiveIntegration(user.id).catch(() => null)) || envProvider();

  // No provider connected anywhere → guide the user to the Integrations panel.
  if (!resolved) {
    return NextResponse.json(
      {
        error: "voice_provider_not_configured",
        message:
          "Koi TTS provider connect nahi hai. Upar Integrations me Sarvam AI ya ElevenLabs ki API key paste karke connect karo.",
      },
      { status: 503 }
    );
  }

  const provider = resolved.provider;

  // Sarvam has a fixed speaker catalog (no remote /voices endpoint), so we
  // serve it statically. No preview URLs — the cards just expose the speaker
  // id to copy into voiceId.
  if (provider === "sarvam") {
    const voices: NormalizedVoice[] = SARVAM_SPEAKERS.map((s) => ({
      voiceId: s.id,
      name: s.id.charAt(0).toUpperCase() + s.id.slice(1),
      category: "sarvam",
      description: "",
      previewUrl: null,
      labels: { gender: s.gender, accent: "indian", useCase: "news" },
    }));
    return NextResponse.json({ voices, provider, cached: false });
  }

  // ElevenLabs — fetch its remote catalog using the resolved key.
  const key = resolved.apiKey;

  // Cache hit? Keyed by provider key so two users' catalogs don't mix.
  if (cache && cache.key === key && Date.now() - cache.at < REVALIDATE_SECONDS * 1000) {
    return NextResponse.json({ voices: cache.voices, provider, cached: true });
  }

  try {
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      method: "GET",
      headers: {
        "xi-api-key": key,
        Accept: "application/json",
      },
      // Defensive: don't let a slow ElevenLabs call hang the dashboard
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: "elevenlabs_error",
          status: res.status,
          detail: text.slice(0, 300),
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const voices: NormalizedVoice[] = Array.isArray(data?.voices)
      ? data.voices
          .map((v: any) => normalize(v))
          .filter((v: NormalizedVoice | null): v is NormalizedVoice => !!v)
      : [];

    cache = { at: Date.now(), key, voices };

    return NextResponse.json({ voices, provider, cached: false });
  } catch (err: any) {
    return NextResponse.json(
      { error: "voices_fetch_failed", message: err?.message || String(err) },
      { status: 500 }
    );
  }
}
