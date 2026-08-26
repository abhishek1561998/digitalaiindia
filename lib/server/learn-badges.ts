// Awarding and reading badges.
//
// Awarding runs on every lesson completion. It's a set difference against
// what's already stored, so it's idempotent and a badge added to the
// catalogue later is granted retroactively the next time the learner
// finishes anything.

import { prisma } from "@/lib/prisma";
import { prisma as db } from "@/lib/prisma";
import { BADGES_BY_ID, earnedBadgeIds, nextBadge, type Badge, type BadgeStats } from "@/lib/learn/badges";
import { cycleStart } from "./leagues";

export type EarnedBadgeView = Badge & { earnedAt: string; value: number | null };

/** Collects everything the badge rules measure, in one round trip. */
export async function badgeStats(userId: string): Promise<BadgeStats> {
  const [profile, enrollments, league] = await Promise.all([
    prisma.learnProfile.findUnique({ where: { userId } }),
    prisma.trackEnrollment.findMany({
      where: { userId },
      select: { stageProgress: true, completedAt: true },
    }),
    prisma.leagueEntry.findFirst({
      where: { userId, weekStart: cycleStart(new Date()) },
      select: { tier: true },
    }),
  ]);

  let lessons = 0;
  let courses = 0;
  for (const e of enrollments) {
    const sp = (e.stageProgress as Record<string, number>) || {};
    lessons += Object.values(sp).filter((v) => v >= 100).length;
    if (e.completedAt) courses += 1;
  }

  return {
    streak: profile?.streak ?? 0,
    goalDays: profile?.goalDays ?? null,
    xp: profile?.xp ?? 0,
    lessons,
    courses,
    leagueTier: league?.tier ?? 0,
  };
}

/**
 * Grants any badge the learner now qualifies for. Returns only the ones
 * newly granted, so the caller can celebrate exactly those.
 */
export async function awardBadges(userId: string): Promise<Badge[]> {
  const stats = await badgeStats(userId);
  const qualifies = earnedBadgeIds(stats);
  if (qualifies.length === 0) return [];

  const existing = await prisma.earnedBadge.findMany({
    where: { userId, badgeId: { in: qualifies } },
    select: { badgeId: true },
  });
  const have = new Set(existing.map((e) => e.badgeId));
  const fresh = qualifies.filter((id) => !have.has(id));
  if (fresh.length === 0) return [];

  const valueFor = (badgeId: string) => {
    const badge = BADGES_BY_ID[badgeId];
    switch (badge.metric) {
      case "streak":
      case "goal":
        return stats.streak;
      case "xp":
        return stats.xp;
      case "lessons":
        return stats.lessons;
      case "courses":
        return stats.courses;
      case "leagueTier":
        return stats.leagueTier;
    }
  };

  // skipDuplicates covers the race where two lessons finish at once and both
  // decide the same badge is new.
  await db.earnedBadge.createMany({
    data: fresh.map((badgeId) => ({ userId, badgeId, value: valueFor(badgeId) })),
    skipDuplicates: true,
  });

  return fresh.map((id) => BADGES_BY_ID[id]);
}

export async function getBadges(userId: string): Promise<{
  earned: EarnedBadgeView[];
  next: Badge | null;
  stats: BadgeStats;
}> {
  const [rows, stats] = await Promise.all([
    prisma.earnedBadge.findMany({ where: { userId }, orderBy: { earnedAt: "desc" } }),
    badgeStats(userId),
  ]);

  const earned = rows
    // A badge removed from the catalogue shouldn't crash the profile of
    // whoever already had it.
    .filter((r) => BADGES_BY_ID[r.badgeId])
    .map((r) => ({
      ...BADGES_BY_ID[r.badgeId],
      earnedAt: r.earnedAt.toISOString(),
      value: r.value,
    }));

  return {
    earned,
    next: nextBadge(stats, new Set(earned.map((b) => b.id))),
    stats,
  };
}
