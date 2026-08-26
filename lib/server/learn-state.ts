// Learner state for the Learn app — XP, streak, week strip, premium access.
//
// The header renders on every page, so this is deliberately one query set
// and nothing derived from scanning enrollments.

import { prisma } from "@/lib/prisma";
import { creditLeagueXp } from "./leagues";
import { awardBadges } from "./learn-badges";

export type WeekDay = {
  /** "M" | "T" | "W" ... — the initial shown under the dot. */
  label: string;
  /** ISO date, so the client never has to do timezone maths. */
  date: string;
  state: "done" | "today" | "future" | "missed";
  xp: number;
};

export type LearnerState = {
  xp: number;
  streak: number;
  longestStreak: number;
  freezes: number;
  /**
   * The streak goal the learner set, if any. Carried here because this
   * function already reads the whole LearnProfile row — the home screen was
   * issuing a second identical query just for this field.
   */
  goalDays: number | null;
  week: WeekDay[];
  premium: {
    active: boolean;
    status: string;
    trialEndsAt: string | null;
    currentPeriodEnd: string | null;
  };
};

/** UTC midnight for a given instant — the canonical "day" key everywhere here. */
export function toDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

/** Monday of the week containing `day`. */
function weekStart(day: Date): Date {
  const dow = day.getUTCDay(); // 0 = Sunday
  return addDays(day, dow === 0 ? -6 : 1 - dow);
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function isPremiumActive(sub: {
  status: string;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
} | null): boolean {
  if (!sub) return false;
  const now = Date.now();
  if (sub.status === "trialing") {
    return Boolean(sub.trialEndsAt && sub.trialEndsAt.getTime() > now);
  }
  if (sub.status === "active" || sub.status === "past_due") {
    // No period end means a manually granted subscription with no expiry.
    return !sub.currentPeriodEnd || sub.currentPeriodEnd.getTime() > now;
  }
  return false;
}

export async function getLearnerState(userId: string): Promise<LearnerState> {
  const today = toDay(new Date());
  const start = weekStart(today);

  const [profile, activity, sub] = await Promise.all([
    prisma.learnProfile.findUnique({ where: { userId } }),
    prisma.learnActivity.findMany({
      where: { userId, day: { gte: start, lte: addDays(start, 6) } },
      select: { day: true, xp: true },
    }),
    prisma.subscription.findUnique({ where: { userId } }),
  ]);

  const xpByDay = new Map(activity.map((a) => [toDay(a.day).getTime(), a.xp]));

  const week: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(start, i);
    const xp = xpByDay.get(day.getTime()) ?? 0;
    const isToday = day.getTime() === today.getTime();
    let state: WeekDay["state"];
    if (xp > 0) state = "done";
    else if (isToday) state = "today";
    else if (day.getTime() > today.getTime()) state = "future";
    else state = "missed";
    return { label: DAY_LABELS[i], date: day.toISOString().slice(0, 10), xp, state };
  });

  // A streak that ended yesterday-or-earlier is stale: it should read 0 in
  // the header even though the row still holds the old number until the next
  // completion rewrites it.
  const last = profile?.lastActiveOn ? toDay(profile.lastActiveOn) : null;
  const staleBy = last ? Math.round((today.getTime() - last.getTime()) / 86_400_000) : Infinity;
  const graceDays = 1 + (profile?.freezes ?? 0);
  const liveStreak = staleBy <= graceDays ? (profile?.streak ?? 0) : 0;

  return {
    xp: profile?.xp ?? 0,
    streak: liveStreak,
    longestStreak: profile?.longestStreak ?? 0,
    freezes: profile?.freezes ?? 0,
    goalDays: profile?.goalDays ?? null,
    week,
    premium: {
      active: isPremiumActive(sub),
      status: sub?.status ?? "none",
      trialEndsAt: sub?.trialEndsAt?.toISOString() ?? null,
      currentPeriodEnd: sub?.currentPeriodEnd?.toISOString() ?? null,
    },
  };
}

/**
 * Credits a finished lesson: bumps XP, rolls the streak forward, and records
 * the day. Idempotency is the caller's job — this always adds XP, so only
 * call it the first time a given lesson is completed.
 */
export async function creditLesson(userId: string, xp: number) {
  const today = toDay(new Date());

  const profile = await prisma.learnProfile.findUnique({ where: { userId } });
  const last = profile?.lastActiveOn ? toDay(profile.lastActiveOn) : null;
  const gap = last ? Math.round((today.getTime() - last.getTime()) / 86_400_000) : null;

  let streak = profile?.streak ?? 0;
  let freezes = profile?.freezes ?? 2;

  if (gap === 0) {
    // Already active today — the streak is already counted.
  } else if (gap === 1) {
    streak += 1;
  } else if (gap !== null && gap > 1 && freezes >= gap - 1) {
    // Freezes cover the missed days rather than resetting the run.
    freezes -= gap - 1;
    streak += 1;
  } else {
    streak = 1;
  }

  const longestStreak = Math.max(profile?.longestStreak ?? 0, streak);

  const [, updated] = await Promise.all([
    // The league entry is credited alongside the profile: same XP, but scoped
    // to this week's cycle rather than the lifetime total.
    creditLeagueXp(userId, xp),
    prisma.learnProfile.upsert({
      where: { userId },
      create: { userId, xp, streak, longestStreak, freezes, lastActiveOn: today },
      update: {
        xp: { increment: xp },
        streak,
        longestStreak,
        freezes,
        lastActiveOn: today,
      },
    }),
    prisma.learnActivity.upsert({
      where: { userId_day: { userId, day: today } },
      create: { userId, day: today, xp, lessons: 1 },
      update: { xp: { increment: xp }, lessons: { increment: 1 } },
    }),
  ]);

  // Badges are evaluated after the write, so the rules see the new streak
  // and XP rather than the values from before this lesson.
  const newBadges = await awardBadges(userId);

  return { xp: updated.xp, streak: updated.streak, awarded: xp, newBadges };
}
