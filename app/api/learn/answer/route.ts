import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, LEARN_REQUIRES_GOOGLE_ERROR } from "@/lib/server/auth";
import { checkAnswer, JS_TRACK_QUIZ } from "@/lib/server/js-track-quiz";

const POINTS_PER_STAGE = 10;

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
  const selectedIndex = Number(body.selectedIndex);
  if (!trackId || Number.isNaN(stage) || Number.isNaN(selectedIndex)) {
    return NextResponse.json({ error: "trackId, stage and selectedIndex are required" }, { status: 400 });
  }

  const result = checkAnswer(stage, selectedIndex);
  if (!result) {
    return NextResponse.json({ error: "Unknown stage" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId } },
  });
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
  }

  if (!result.correct) {
    return NextResponse.json({ correct: false, explanation: result.explanation, correctIndex: result.correctIndex });
  }

  const stageProgress = (enrollment.stageProgress as Record<string, number>) || {};
  const alreadyPassed = stageProgress[String(stage)] === 100;
  stageProgress[String(stage)] = 100;

  const totalStages = JS_TRACK_QUIZ.length;
  const allDone = Array.from({ length: totalStages }, (_, i) => stageProgress[String(i)] === 100).every(Boolean);

  const updated = await prisma.trackEnrollment.update({
    where: { id: enrollment.id },
    data: {
      stageProgress,
      currentStage: Math.max(enrollment.currentStage, Math.min(stage + 1, totalStages - 1)),
      points: alreadyPassed ? enrollment.points : enrollment.points + POINTS_PER_STAGE,
      completedAt: allDone ? (enrollment.completedAt ?? new Date()) : enrollment.completedAt,
    },
  });

  return NextResponse.json({ correct: true, explanation: result.explanation, enrollment: updated });
}
