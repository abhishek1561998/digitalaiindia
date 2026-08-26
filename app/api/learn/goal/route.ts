import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { GOAL_OPTIONS } from "@/lib/learn/badges";

// Sets (or clears) the learner's streak goal. Changing goals restarts the
// clock: goalSetAt moves, so a 7-day badge can't be claimed by switching to
// a 7-day goal on day 30 of an existing streak.
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const raw = body.goalDays;

  if (raw === null) {
    const profile = await prisma.learnProfile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, goalDays: null },
      update: { goalDays: null, goalSetAt: null },
    });
    return NextResponse.json({ goalDays: profile.goalDays });
  }

  const goalDays = Number(raw);
  if (!GOAL_OPTIONS.includes(goalDays as (typeof GOAL_OPTIONS)[number])) {
    return NextResponse.json(
      { error: `goalDays must be one of ${GOAL_OPTIONS.join(", ")}` },
      { status: 400 },
    );
  }

  const profile = await prisma.learnProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id, goalDays, goalSetAt: new Date() },
    update: { goalDays, goalSetAt: new Date() },
  });

  return NextResponse.json({ goalDays: profile.goalDays });
}
