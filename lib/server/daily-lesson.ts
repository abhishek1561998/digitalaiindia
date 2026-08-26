// Free access is one lesson a day.
//
// Premium removes the limit entirely. For everyone else the rule is: you may
// open a lesson you've already passed (review is always free), or the one
// lesson you claimed today, or — if you haven't claimed one yet — any lesson,
// which then becomes today's.
//
// The claim is stored rather than derived so a refresh, a second tab, or
// bouncing between courses can't buy a second lesson.

import { prisma } from "@/lib/prisma";
import { toDay } from "./learn-state";

export type DailyAccess =
  | { allowed: true; reason: "premium" | "review" | "today" | "claimed" }
  | { allowed: false; reason: "used"; claimed: { trackId: string; stage: number } | null; nextAt: string };

function keyFor(trackId: string, stage: number) {
  return `${trackId}:${stage}`;
}

function parseKey(key: string | null) {
  if (!key) return null;
  const [trackId, raw] = key.split(":");
  const stage = Number(raw);
  if (!trackId || Number.isNaN(stage)) return null;
  return { trackId, stage };
}

/** UTC midnight tomorrow — when the next lesson becomes available. */
function nextReset(today: Date) {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString();
}

export async function checkDailyAccess({
  userId,
  trackId,
  stage,
  premium,
  alreadyPassed,
}: {
  userId: string;
  trackId: string;
  stage: number;
  premium: boolean;
  alreadyPassed: boolean;
}): Promise<DailyAccess> {
  if (premium) return { allowed: true, reason: "premium" };
  // Revisiting work you've already done costs nothing — the limit is on new
  // ground, not on going back over old ground.
  if (alreadyPassed) return { allowed: true, reason: "review" };

  const today = toDay(new Date());
  const profile = await prisma.learnProfile.findUnique({
    where: { userId },
    select: { dailyLessonKey: true, dailyLessonOn: true },
  });

  const claimedToday =
    profile?.dailyLessonOn && toDay(profile.dailyLessonOn).getTime() === today.getTime();

  if (claimedToday) {
    if (profile!.dailyLessonKey === keyFor(trackId, stage)) {
      return { allowed: true, reason: "today" };
    }
    return {
      allowed: false,
      reason: "used",
      claimed: parseKey(profile!.dailyLessonKey),
      nextAt: nextReset(today),
    };
  }

  // Nothing claimed today — this lesson becomes it.
  await prisma.learnProfile.upsert({
    where: { userId },
    create: { userId, dailyLessonKey: keyFor(trackId, stage), dailyLessonOn: today },
    update: { dailyLessonKey: keyFor(trackId, stage), dailyLessonOn: today },
  });

  return { allowed: true, reason: "claimed" };
}

/** What the roadmap needs to grey out the lessons today's quota won't cover. */
export async function getDailyClaim(userId: string) {
  const today = toDay(new Date());
  const profile = await prisma.learnProfile.findUnique({
    where: { userId },
    select: { dailyLessonKey: true, dailyLessonOn: true },
  });

  const claimedToday =
    profile?.dailyLessonOn && toDay(profile.dailyLessonOn).getTime() === today.getTime();

  return {
    used: Boolean(claimedToday),
    claimed: claimedToday ? parseKey(profile!.dailyLessonKey) : null,
    nextAt: nextReset(today),
  };
}
