import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const trackId = String(body.trackId || "").trim();
  if (!trackId) {
    return NextResponse.json({ error: "trackId is required" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.upsert({
    where: { userId_trackId: { userId: user.id, trackId } },
    update: {},
    create: { userId: user.id, trackId },
  });

  return NextResponse.json({ enrollment });
}
