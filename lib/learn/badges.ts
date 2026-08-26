// The badge catalogue.
//
// Badges are content, so they live here rather than in a table — adding one
// is an edit to this file, not a migration. Each badge declares what it is
// measured against and the threshold, and one evaluator walks the whole list
// against a learner's stats. That means a new badge needs no new award code.

import { COURSES, TOTAL_LESSONS } from "./catalog";

export type BadgeMetric = "streak" | "goal" | "xp" | "lessons" | "courses" | "leagueTier";

export type Badge = {
  id: string;
  name: string;
  /** What the learner did. Written in past tense, addressed to them. */
  description: string;
  metric: BadgeMetric;
  /** Earned once the metric reaches this. */
  threshold: number;
  /** Groups badges on the profile. */
  family: "Consistency" | "Effort" | "Progress" | "Competition";
  color: string;
};

export const BADGES: Badge[] = [
  // ── Consistency: goals the learner opted into ──
  {
    id: "goal-7",
    name: "First week",
    description: "Hit a 7-day learning goal",
    metric: "goal",
    threshold: 7,
    family: "Consistency",
    color: "#F0B429",
  },
  {
    id: "goal-14",
    name: "Fortnight",
    description: "Hit a 14-day learning goal",
    metric: "goal",
    threshold: 14,
    family: "Consistency",
    color: "#E8890C",
  },
  {
    id: "goal-21",
    name: "Habit formed",
    description: "Hit a 21-day learning goal — the point most habits stick",
    metric: "goal",
    threshold: 21,
    family: "Consistency",
    color: "#E85D9E",
  },
  {
    id: "goal-30",
    name: "Full month",
    description: "Hit a 30-day learning goal",
    metric: "goal",
    threshold: 30,
    family: "Consistency",
    color: "#6C5CE7",
  },

  // ── Consistency: streaks reached without setting a goal ──
  {
    id: "streak-3",
    name: "Three in a row",
    description: "Practised three days running",
    metric: "streak",
    threshold: 3,
    family: "Consistency",
    color: "#00A97F",
  },
  {
    id: "streak-50",
    name: "Fifty days",
    description: "A 50-day streak",
    metric: "streak",
    threshold: 50,
    family: "Consistency",
    color: "#0FA3C7",
  },
  {
    id: "streak-100",
    name: "Century",
    description: "A 100-day streak",
    metric: "streak",
    threshold: 100,
    family: "Consistency",
    color: "#FF7500",
  },

  // ── Effort: XP banked ──
  { id: "xp-100", name: "Getting going", description: "Earned 100 XP", metric: "xp", threshold: 100, family: "Effort", color: "#7BC62D" },
  { id: "xp-500", name: "Five hundred", description: "Earned 500 XP", metric: "xp", threshold: 500, family: "Effort", color: "#00A97F" },
  { id: "xp-1000", name: "Four figures", description: "Earned 1,000 XP", metric: "xp", threshold: 1000, family: "Effort", color: "#0FA3C7" },
  { id: "xp-5000", name: "Five thousand", description: "Earned 5,000 XP", metric: "xp", threshold: 5000, family: "Effort", color: "#6C5CE7" },

  // ── Progress: work actually finished ──
  { id: "lessons-1", name: "First lesson", description: "Passed your first lesson", metric: "lessons", threshold: 1, family: "Progress", color: "#F0B429" },
  { id: "lessons-10", name: "Ten down", description: "Passed ten lessons", metric: "lessons", threshold: 10, family: "Progress", color: "#E8890C" },
  // Derived, not hard-coded: parking five tracks left "forty lessons" and
  // "every track" permanently out of reach, which is worse than no badge.
  {
    id: "lessons-half",
    name: "Halfway",
    description: `Passed ${Math.ceil(TOTAL_LESSONS / 2)} lessons — half of everything here`,
    metric: "lessons",
    threshold: Math.ceil(TOTAL_LESSONS / 2),
    family: "Progress",
    color: "#E85D9E",
  },
  { id: "courses-1", name: "Track finished", description: "Completed a whole track", metric: "courses", threshold: 1, family: "Progress", color: "#00A97F" },
  {
    id: "courses-all",
    name: "Everything",
    description: `Completed all ${COURSES.length} tracks on the platform`,
    metric: "courses",
    threshold: COURSES.length,
    family: "Progress",
    color: "#FF7500",
  },

  // ── Competition: leagues ──
  { id: "league-1", name: "Promoted", description: "Moved up a league", metric: "leagueTier", threshold: 1, family: "Competition", color: "#6B6559" },
  { id: "league-2", name: "Silicon", description: "Reached the Silicon league", metric: "leagueTier", threshold: 2, family: "Competition", color: "#0FA3C7" },
  { id: "league-4", name: "Diamond", description: "Reached the Diamond league", metric: "leagueTier", threshold: 4, family: "Competition", color: "#00A97F" },
];

export const BADGES_BY_ID: Record<string, Badge> = Object.fromEntries(
  BADGES.map((b) => [b.id, b]),
);

/** The goal lengths a learner can choose between. */
export const GOAL_OPTIONS = [7, 14, 21, 30] as const;
export type GoalDays = (typeof GOAL_OPTIONS)[number];

export type BadgeStats = {
  streak: number;
  /** The goal the learner set, if any — a goal badge needs both this and the streak. */
  goalDays: number | null;
  xp: number;
  lessons: number;
  courses: number;
  leagueTier: number;
};

/**
 * Every badge the stats currently justify. Awarding is the caller's job —
 * this is pure, so it can also drive "what's next" on the profile.
 */
export function earnedBadgeIds(stats: BadgeStats): string[] {
  return BADGES.filter((badge) => {
    switch (badge.metric) {
      case "streak":
        return stats.streak >= badge.threshold;
      // A goal badge needs the learner to have *chosen* that goal and then
      // reached it. Drifting past 21 days without setting a goal earns the
      // streak badges, not the goal ones.
      case "goal":
        return stats.goalDays === badge.threshold && stats.streak >= badge.threshold;
      case "xp":
        return stats.xp >= badge.threshold;
      case "lessons":
        return stats.lessons >= badge.threshold;
      case "courses":
        return stats.courses >= badge.threshold;
      case "leagueTier":
        return stats.leagueTier >= badge.threshold;
    }
  }).map((b) => b.id);
}

/** The closest badge the learner hasn't earned yet, for a "next up" hint. */
export function nextBadge(stats: BadgeStats, earned: Set<string>): Badge | null {
  const remaining = BADGES.filter((b) => !earned.has(b.id) && b.metric !== "goal");
  if (remaining.length === 0) return null;

  const progress = (b: Badge) => {
    const current =
      b.metric === "streak" ? stats.streak
      : b.metric === "xp" ? stats.xp
      : b.metric === "lessons" ? stats.lessons
      : b.metric === "courses" ? stats.courses
      : stats.leagueTier;
    return current / b.threshold;
  };

  return remaining.sort((a, b) => progress(b) - progress(a))[0];
}
