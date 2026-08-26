import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, LEARN_REQUIRES_GOOGLE_ERROR } from "@/lib/server/auth";
import { checkAnswer, getTrackStageCount } from "@/lib/server/quiz-registry";
import { creditLesson } from "@/lib/server/learn-state";
import { validLesson } from "@/lib/server/validate";
import { XP_PER_LESSON } from "@/lib/learn/catalog";

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
  const lesson = validLesson(body.trackId, body.stage);
  const selectedIndex = Number(body.selectedIndex);
  if (!lesson || !Number.isInteger(selectedIndex) || selectedIndex < 0) {
    return NextResponse.json({ error: "Unknown track, lesson or answer" }, { status: 400 });
  }
  const { trackId, stage } = lesson;

  const result = checkAnswer(trackId, stage, selectedIndex);
  if (!result) {
    return NextResponse.json({ error: "Unknown track or stage" }, { status: 400 });
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

  const totalStages = getTrackStageCount(trackId);
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

  // XP and the daily streak are credited once per lesson — re-answering a
  // stage you've already passed replays the explanation but pays nothing.
  const credited = alreadyPassed
    ? null
    : await creditLesson(user.id, XP_PER_LESSON);

  return NextResponse.json({
    correct: true,
    explanation: result.explanation,
    enrollment: updated,
    awardedXp: credited?.awarded ?? 0,
    xp: credited?.xp ?? null,
    streak: credited?.streak ?? null,
    courseCompleted: allDone,
    newBadges: credited?.newBadges ?? [],
  });
}
