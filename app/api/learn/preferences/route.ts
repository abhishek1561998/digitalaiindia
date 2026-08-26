import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { DEFAULT_PREFERENCES, sanitizePatch } from "@/lib/learn/preferences";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ preferences: DEFAULT_PREFERENCES });

  const row = await prisma.learnPreferences.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ preferences: { ...DEFAULT_PREFERENCES, ...(row ?? {}) } });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patch = sanitizePatch(await req.json().catch(() => ({})));
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No recognised settings in request" }, { status: 400 });
  }

  const row = await prisma.learnPreferences.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...patch },
    update: patch,
  });

  return NextResponse.json({ preferences: { ...DEFAULT_PREFERENCES, ...row } });
}
