// Weekly leagues — the competitive half of the habit loop.
//
// A league is a cohort of learners racing on XP earned inside one Monday-to-
// Sunday cycle. Nothing here is a background job: entries are created lazily
// when a learner first earns XP in a cycle, and the cycle a learner belongs
// to is derivable from the date, so a missed cron never leaves stale state.

import { prisma } from "@/lib/prisma";
import { toDay } from "./learn-state";

export const LEAGUE_TIERS = [
  { name: "Hydrogen", color: "#E8890C" },
  { name: "Carbon", color: "#6B6559" },
  { name: "Silicon", color: "#0FA3C7" },
  { name: "Titanium", color: "#6C5CE7" },
  { name: "Diamond", color: "#00A97F" },
] as const;

/** XP a learner must bank before leagues open up at all. */
export const LEAGUE_UNLOCK_XP = 175;

/** How many learners share one cohort. Small enough that a rank means something. */
const COHORT_SIZE = 30;

/** Top N of a cohort move up a tier next cycle; bottom N move down. */
export const PROMOTE_COUNT = 15;
const DEMOTE_COUNT = 5;

export type LeagueRow = {
  rank: number;
  userId: string;
  name: string;
  xp: number;
  isMe: boolean;
};

export type LeagueView = {
  unlocked: boolean;
  /** XP still needed to unlock, when locked. */
  xpToUnlock: number;
  tierName: string;
  tierColor: string;
  rows: LeagueRow[];
  myRank: number | null;
  promoteCount: number;
  demoteCount: number;
  daysLeft: number;
};

/** Monday (UTC midnight) of the cycle containing `day`. */
export function cycleStart(day: Date): Date {
  const d = toDay(day);
  const dow = d.getUTCDay(); // 0 = Sunday
  d.setUTCDate(d.getUTCDate() + (dow === 0 ? -6 : 1 - dow));
  return d;
}

function daysLeftInCycle(start: Date): number {
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  return Math.max(0, Math.ceil((end.getTime() - Date.now()) / 86_400_000));
}

/**
 * Adds XP to the learner's entry for the current cycle, creating it — and
 * placing them in a tier and cohort — the first time they earn XP this week.
 */
export async function creditLeagueXp(userId: string, xp: number) {
  const weekStart = cycleStart(new Date());

  const existing = await prisma.leagueEntry.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  if (existing) {
    return prisma.leagueEntry.update({
      where: { id: existing.id },
      data: { xp: { increment: xp } },
    });
  }

  // Carry last cycle's tier forward; a learner's first ever cycle starts at
  // Hydrogen. Promotion and demotion are settled here rather than by a job.
  const previous = await prisma.leagueEntry.findFirst({
    where: { userId, weekStart: { lt: weekStart } },
    orderBy: { weekStart: "desc" },
  });

  let tier = previous?.tier ?? 0;
  if (previous) {
    const betterInCohort = await prisma.leagueEntry.count({
      where: {
        weekStart: previous.weekStart,
        tier: previous.tier,
        cohort: previous.cohort,
        xp: { gt: previous.xp },
      },
    });
    const rank = betterInCohort + 1;
    const cohortSize = await prisma.leagueEntry.count({
      where: { weekStart: previous.weekStart, tier: previous.tier, cohort: previous.cohort },
    });
    if (rank <= PROMOTE_COUNT) tier = Math.min(tier + 1, LEAGUE_TIERS.length - 1);
    else if (rank > cohortSize - DEMOTE_COUNT) tier = Math.max(tier - 1, 0);
  }

  // Drop into the first cohort of this tier that still has room.
  const filled = await prisma.leagueEntry.groupBy({
    by: ["cohort"],
    where: { weekStart, tier },
    _count: { _all: true },
  });
  const counts = new Map(filled.map((f) => [f.cohort, f._count._all]));
  let cohort = 0;
  while ((counts.get(cohort) ?? 0) >= COHORT_SIZE) cohort += 1;

  return prisma.leagueEntry.create({
    data: { userId, weekStart, tier, cohort, xp },
  });
}

export async function getLeague(userId: string, totalXp: number): Promise<LeagueView> {
  const tierName = LEAGUE_TIERS[0].name;

  if (totalXp < LEAGUE_UNLOCK_XP) {
    return {
      unlocked: false,
      xpToUnlock: LEAGUE_UNLOCK_XP - totalXp,
      tierName,
      tierColor: LEAGUE_TIERS[0].color,
      rows: [],
      myRank: null,
      promoteCount: PROMOTE_COUNT,
      demoteCount: DEMOTE_COUNT,
      daysLeft: 0,
    };
  }

  const weekStart = cycleStart(new Date());
  const mine = await prisma.leagueEntry.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
  });

  // Unlocked but hasn't earned XP yet this cycle — show the empty board for
  // the tier they'd land in rather than pretending they're ranked.
  if (!mine) {
    return {
      unlocked: true,
      xpToUnlock: 0,
      tierName,
      tierColor: LEAGUE_TIERS[0].color,
      rows: [],
      myRank: null,
      promoteCount: PROMOTE_COUNT,
      demoteCount: DEMOTE_COUNT,
      daysLeft: daysLeftInCycle(weekStart),
    };
  }

  const entries = await prisma.leagueEntry.findMany({
    where: { weekStart, tier: mine.tier, cohort: mine.cohort },
    orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
    select: { userId: true, xp: true, user: { select: { name: true } } },
  });

  const rows: LeagueRow[] = entries.map((e, i) => ({
    rank: i + 1,
    userId: e.userId,
    // Surnames are trimmed to an initial: a leaderboard is public to the
    // cohort, and a full name is more than a rank needs.
    name: shortName(e.user.name),
    xp: e.xp,
    isMe: e.userId === userId,
  }));

  const tier = LEAGUE_TIERS[Math.min(mine.tier, LEAGUE_TIERS.length - 1)];

  return {
    unlocked: true,
    xpToUnlock: 0,
    tierName: tier.name,
    tierColor: tier.color,
    rows,
    myRank: rows.find((r) => r.isMe)?.rank ?? null,
    promoteCount: PROMOTE_COUNT,
    demoteCount: DEMOTE_COUNT,
    daysLeft: daysLeftInCycle(weekStart),
  };
}

function shortName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}`;
}
