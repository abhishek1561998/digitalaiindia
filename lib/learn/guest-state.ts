// The zero state a signed-out visitor sees. Shaped exactly like a real
// LearnerState so every screen renders one way, not two.

import type { LearnerState } from "@/lib/server/learn-state";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function guestState(): LearnerState {
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const dow = todayUtc.getUTCDay();
  const monday = new Date(todayUtc);
  monday.setUTCDate(todayUtc.getUTCDate() + (dow === 0 ? -6 : 1 - dow));

  return {
    xp: 0,
    streak: 0,
    longestStreak: 0,
    freezes: 2,
    goalDays: null,
    week: Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setUTCDate(monday.getUTCDate() + i);
      const diff = d.getTime() - todayUtc.getTime();
      return {
        label: DAY_LABELS[i],
        date: d.toISOString().slice(0, 10),
        state: diff === 0 ? ("today" as const) : diff > 0 ? ("future" as const) : ("missed" as const),
        xp: 0,
      };
    }),
    premium: { active: false, status: "none", trialEndsAt: null, currentPeriodEnd: null },
  };
}
