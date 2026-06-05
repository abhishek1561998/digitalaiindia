/**
 * /api/dashboard/integrations — manage a user's "bring your own key" TTS
 * provider connections (Sarvam AI / ElevenLabs), driven by the dashboard
 * Voice tab. Session-auth'd (not the public Bearer API).
 *
 *   GET    → list both providers with connection + active status (masked key)
 *   POST   → connect/replace a provider key (validated, encrypted, made active)
 *   PATCH  → switch the active provider or update its saved settings
 *   DELETE → disconnect a provider  (?provider=sarvam|elevenlabs)
 *
 * The raw key is AES-GCM encrypted at rest and never returned to the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { encryptApiKey } from "@/lib/server/api-keys";
import {
  TTS_PROVIDERS,
  validateProviderKey,
  type TtsProviderName,
} from "@/lib/server/tts-providers";

export const runtime = "nodejs";

function isProvider(v: any): v is TtsProviderName {
  return TTS_PROVIDERS.includes(v);
}

function shape(rows: any[]) {
  return TTS_PROVIDERS.map((provider) => {
    const row = rows.find((r) => r.provider === provider);
    return {
      provider,
      connected: Boolean(row),
      keyLastFour: row?.keyLastFour || null,
      isActive: Boolean(row?.isActive),
      settings: row?.settings || null,
      updatedAt: row?.updatedAt || null,
    };
  });
}

async function listRows(userId: string) {
  return prisma.voiceIntegration.findMany({
    where: { userId },
    select: { provider: true, keyLastFour: true, isActive: true, settings: true, updatedAt: true },
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ integrations: shape(await listRows(user.id)) });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const provider = body?.provider;
  const apiKey = String(body?.apiKey || "").trim();
  const settings = body?.settings && typeof body.settings === "object" ? body.settings : undefined;

  if (!isProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "API key is required" }, { status: 400 });
  }

  // Reject a bad key now, rather than failing silently on the first real call.
  const check = await validateProviderKey(provider, apiKey);
  if (!check.ok) {
    return NextResponse.json(
      { error: "Provider rejected this key", detail: check.detail || "" },
      { status: 400 }
    );
  }

  const keyLastFour = apiKey.slice(-4);
  const encryptedKey = encryptApiKey(apiKey);

  // Connecting/replacing makes this provider the active one (single active per
  // user), so it takes effect immediately with no extra step.
  await prisma.$transaction([
    prisma.voiceIntegration.updateMany({
      where: { userId: user.id },
      data: { isActive: false },
    }),
    prisma.voiceIntegration.upsert({
      where: { userId_provider: { userId: user.id, provider } },
      create: { userId: user.id, provider, encryptedKey, keyLastFour, isActive: true, settings },
      update: { encryptedKey, keyLastFour, isActive: true, ...(settings ? { settings } : {}) },
    }),
  ]);

  return NextResponse.json({ integrations: shape(await listRows(user.id)) }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const provider = body?.provider;
  if (!isProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const existing = await prisma.voiceIntegration.findUnique({
    where: { userId_provider: { userId: user.id, provider } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Provider not connected" }, { status: 404 });
  }

  const ops: any[] = [];
  if (body?.isActive === true) {
    ops.push(
      prisma.voiceIntegration.updateMany({
        where: { userId: user.id },
        data: { isActive: false },
      })
    );
    ops.push(
      prisma.voiceIntegration.update({
        where: { userId_provider: { userId: user.id, provider } },
        data: { isActive: true },
      })
    );
  }
  if (body?.settings && typeof body.settings === "object") {
    ops.push(
      prisma.voiceIntegration.update({
        where: { userId_provider: { userId: user.id, provider } },
        data: { settings: body.settings },
      })
    );
  }
  if (ops.length) await prisma.$transaction(ops);

  return NextResponse.json({ integrations: shape(await listRows(user.id)) });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const provider = req.nextUrl.searchParams.get("provider");
  if (!isProvider(provider)) {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const existing = await prisma.voiceIntegration.findUnique({
    where: { userId_provider: { userId: user.id, provider } },
  });
  if (existing) {
    await prisma.voiceIntegration.delete({
      where: { userId_provider: { userId: user.id, provider } },
    });
    // If we removed the active one, promote whatever remains so the user is
    // never left "connected but nothing active".
    if (existing.isActive) {
      const remaining = await prisma.voiceIntegration.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });
      if (remaining) {
        await prisma.voiceIntegration.update({
          where: { id: remaining.id },
          data: { isActive: true },
        });
      }
    }
  }

  return NextResponse.json({ integrations: shape(await listRows(user.id)) });
}
