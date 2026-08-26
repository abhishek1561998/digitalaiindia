"use client";

import Link from "next/link";
import css from "./learn-app.module.css";
import { CourseGlyph } from "./CourseGlyph";
import { FlameIcon, BoltIcon, CheckIcon, TrophyIcon } from "./icons";
import { BadgeShelf } from "./BadgeShelf";
import type { CourseSummary } from "@/lib/learn/catalog";
import type { CourseProgress } from "@/lib/server/learn-progress";
import type { LearnerState } from "@/lib/server/learn-state";
import type { EarnedBadgeView } from "@/lib/server/learn-badges";
import type { Badge } from "@/lib/learn/badges";

export function LearnYou({
  courses,
  progress,
  state,
  name,
  email,
  totalLessons,
  badges,
  nextBadge,
}: {
  courses: CourseSummary[];
  progress: Record<string, CourseProgress>;
  state: LearnerState;
  name: string | null;
  email: string | null;
  totalLessons: number;
  badges: EarnedBadgeView[];
  nextBadge: Badge | null;
}) {
  const started = courses.filter((c) => progress[c.id]?.started);
  const lessonsDone = courses.reduce((n, c) => n + (progress[c.id]?.lessonsDone ?? 0), 0);
  const coursesDone = courses.filter((c) => progress[c.id]?.completed).length;
  const initials = (name ?? "?")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main className={css.page}>
      <div className={css.youHead}>
        <span className={css.avatar}>{initials || "?"}</span>
        <div>
          <h1 className={css.pageTitle} style={{ marginBottom: "0.15rem" }}>{name ?? "Your progress"}</h1>
          <p className={css.pageSub}>
            {email ?? "Sign in to keep your streak, XP and certificates."}
          </p>
        </div>
      </div>

      <div className={css.youGrid}>
        <section className={css.stat}>
          <div className={css.statValue}>
            {state.streak}
            <span style={{ color: "var(--streak)", display: "flex" }}><FlameIcon size={26} /></span>
          </div>
          <p className={css.statLabel}>
            day streak{state.longestStreak > 0 ? ` · best ${state.longestStreak}` : ""}
          </p>
        </section>
        <section className={css.stat}>
          <div className={css.statValue}>
            {state.xp}
            <span style={{ color: "var(--xp)", display: "flex" }}><BoltIcon size={26} /></span>
          </div>
          <p className={css.statLabel}>total XP</p>
        </section>
        <section className={css.stat}>
          <div className={css.statValue}>
            {lessonsDone}
            <span style={{ color: "var(--done)", display: "flex" }}><CheckIcon size={24} /></span>
          </div>
          <p className={css.statLabel}>of {totalLessons} lessons passed</p>
        </section>
        <section className={css.stat}>
          <div className={css.statValue}>
            {badges.length}
            <span style={{ color: "var(--accent)", display: "flex" }}><TrophyIcon size={26} /></span>
          </div>
          <p className={css.statLabel}>
            {badges.length === 1 ? "badge earned" : "badges earned"}
            {coursesDone > 0 ? ` · ${coursesDone} ${coursesDone === 1 ? "track" : "tracks"} finished` : ""}
          </p>
        </section>
      </div>

      <BadgeShelf earned={badges} next={nextBadge} />

      <section>
        <h2 className={css.sectionTitle}>
          {started.length ? "Courses in progress" : "Nothing started yet"}
        </h2>

        {started.length === 0 ? (
          <p className={css.empty}>
            Pick a track and finish one lesson — that's all it takes to start a streak.{" "}
            <Link href="/learn/courses" style={{ color: "var(--accent)", fontWeight: 700 }}>
              Browse courses
            </Link>
          </p>
        ) : (
          <div className={css.progressList}>
            {started.map((c) => {
              const p = progress[c.id];
              return (
                <Link key={c.id} href={`/learn/${c.slug}`} className={css.progressRow}>
                  <CourseGlyph courseId={c.id} color={c.color} size={44} plinth={false} />
                  <span className={css.progressBody}>
                    <p className={css.progressName}>
                      {c.title}
                      {p.completed && (
                        <span style={{ color: "var(--done)", marginLeft: 8, fontSize: "0.875rem" }}>
                          · complete
                        </span>
                      )}
                    </p>
                    <span className={css.bar}>
                      <span
                        className={css.barFill}
                        style={{ width: `${p.percent}%`, background: c.color, display: "block", height: "100%" }}
                      />
                    </span>
                  </span>
                  <span className={css.progressPct}>{p.percent}%</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
