import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const found = await prisma.apiKey.findFirst({
    where: {
      id,
      userId: user.id,
      isActive: true,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!found) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  await prisma.apiKey.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}

/**
 * PATCH /api/keys/:id
 *
 * Update key metadata: rename, edit voice settings preset.
 * Body: { name?, settings?: { voiceId?, modelId?, stability?, similarityBoost? } }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const found = await prisma.apiKey.findFirst({
    where: { id, userId: user.id, isActive: true },
    select: { id: true },
  });
  if (!found) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  // Whitelist + sanitize the settings shape so we don't store arbitrary JSON
  const settingsIn = body?.settings;
  let cleanSettings: any = undefined;
  if (settingsIn && typeof settingsIn === "object") {
    cleanSettings = {};
    if (typeof settingsIn.voiceId === "string" && settingsIn.voiceId.trim()) {
      cleanSettings.voiceId = settingsIn.voiceId.trim();
    }
    if (typeof settingsIn.modelId === "string" && settingsIn.modelId.trim()) {
      cleanSettings.modelId = settingsIn.modelId.trim();
    }
    if (typeof settingsIn.stability === "number" && Number.isFinite(settingsIn.stability)) {
      cleanSettings.stability = Math.max(0, Math.min(1, settingsIn.stability));
    }
    if (
      typeof settingsIn.similarityBoost === "number" &&
      Number.isFinite(settingsIn.similarityBoost)
    ) {
      cleanSettings.similarityBoost = Math.max(0, Math.min(1, settingsIn.similarityBoost));
    }
  }

  const data: any = {};
  if (typeof body?.name === "string" && body.name.trim()) {
    data.name = body.name.trim().slice(0, 80);
  }
  if (cleanSettings !== undefined) {
    data.settings = cleanSettings;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const updated = await prisma.apiKey.update({
    where: { id },
    data,
    select: { id: true, name: true, settings: true },
  });

  return NextResponse.json({ ok: true, key: updated });
}
