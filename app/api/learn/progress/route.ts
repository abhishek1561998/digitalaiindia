import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, LEARN_REQUIRES_GOOGLE_ERROR } from "@/lib/server/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const trackId = searchParams.get("trackId") || "";
  if (!trackId) {
    return NextResponse.json({ error: "trackId is required" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId } },
  });

  return NextResponse.json({ enrollment });
}

// Marks a stage's content as viewed (50%) without requiring the quiz yet —
// lets the course UI show partial progress the moment a lesson is opened.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.authProvider !== "google") {
    return NextResponse.json({ error: LEARN_REQUIRES_GOOGLE_ERROR }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const trackId = String(body.trackId || "").trim();
  const stage = Number(body.stage);
  if (!trackId || Number.isNaN(stage)) {
    return NextResponse.json({ error: "trackId and stage are required" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
  }

  const stageProgress = (enrollment.stageProgress as Record<string, number>) || {};
  const existing = stageProgress[String(stage)] || 0;
  stageProgress[String(stage)] = Math.max(existing, 50);

  const updated = await prisma.trackEnrollment.update({
    where: { id: enrollment.id },
    data: {
      stageProgress,
      currentStage: Math.max(enrollment.currentStage, stage),
    },
  });

  return NextResponse.json({ enrollment: updated });
}
