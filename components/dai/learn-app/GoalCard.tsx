"use client";

import { useState } from "react";
import css from "./learn-app.module.css";
import { BadgeMedal } from "./BadgeMedal";
import { play } from "@/lib/learn/sound";
import { BADGES_BY_ID, GOAL_OPTIONS, type GoalDays } from "@/lib/learn/badges";

export function GoalCard({
  goalDays,
  streak,
  signedIn,
}: {
  goalDays: number | null;
  streak: number;
  signedIn: boolean;
}) {
  const [goal, setGoal] = useState<number | null>(goalDays);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(days: GoalDays) {
    if (saving) return;
    // Tapping the current goal clears it — a goal you can't put down is a
    // chore, not a goal.
    const next = goal === days ? null : days;
    const previous = goal;

    setGoal(next);
    play("tap");
    if (!signedIn) return;

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/learn/goal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalDays: next }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      setGoal(previous);
      setError("Couldn't save that. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const reward = goal ? BADGES_BY_ID[`goal-${goal}`] : null;
  const done = goal !== null && streak >= goal;
  const percent = goal ? Math.min(100, Math.round((streak / goal) * 100)) : 0;

  return (
    <section className={`${css.card} ${css.cardPad}`} aria-label="Learning goal">
      <h2 className={css.cardTitle}>Your goal</h2>

      {goal !== null && (
        <>
          <div className={css.goalTop}>
            <span className={css.goalCount}>
              {Math.min(streak, goal)}
              <span className={css.goalOf}> / {goal} days</span>
            </span>
            {done && <span className={css.badgeWhen}>Reached</span>}
          </div>
          <div className={css.bar}>
            <span
              className={css.barFill}
              style={{ width: `${percent}%`, background: done ? "var(--done)" : "var(--accent)" }}
            />
          </div>
        </>
      )}

      <div className={css.goalOptions} style={{ marginTop: goal !== null ? "1.1rem" : 0 }}>
        {GOAL_OPTIONS.map((days) => (
          <button
            key={days}
            type="button"
            aria-pressed={goal === days}
            className={css.goalOption}
            disabled={saving}
            onClick={() => choose(days)}
          >
            {days}
            <span className={css.goalUnit}>days</span>
          </button>
        ))}
      </div>

      {error ? (
        <p className={css.goalHint} style={{ color: "var(--wrong, #E23D5B)" }}>{error}</p>
      ) : goal === null ? (
        <p className={css.goalHint}>
          Pick a run to aim for. Finish one lesson a day and the badge is yours.
        </p>
      ) : done ? (
        <p className={css.goalHint}>
          You did it. Pick a longer one, or keep this streak going.
        </p>
      ) : (
        <p className={css.goalHint}>
          {goal - streak} more {goal - streak === 1 ? "day" : "days"} of one lesson each.
        </p>
      )}

      {reward && (
        <div className={css.goalReward}>
          <BadgeMedal badge={reward} earned={done} size={40} />
          <span className={css.goalRewardText}>
            <strong style={{ color: "var(--text)", fontWeight: 550 }}>{reward.name}</strong>
            {" — "}
            {reward.description.replace(/^Hit a /, "for a ")}
          </span>
        </div>
      )}
    </section>
  );
}
