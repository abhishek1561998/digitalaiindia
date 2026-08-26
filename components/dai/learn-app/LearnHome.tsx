"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import css from "./learn-app.module.css";
import { CourseGlyph } from "./CourseGlyph";
import { SearchIcon, FlameIcon, CheckIcon } from "./icons";
import { LeagueCard } from "./LeagueCard";
import { GoalCard } from "./GoalCard";
import type { CourseSummary } from "@/lib/learn/catalog";
import { PLANS } from "@/lib/learn/pricing";
import type { CourseProgress } from "@/lib/server/learn-progress";
import type { LearnerState } from "@/lib/server/learn-state";
import type { LeagueView } from "@/lib/server/leagues";

type Props = {
  courses: CourseSummary[];
  progress: Record<string, CourseProgress>;
  state: LearnerState;
  /** Course id the server picked as "next up". */
  featured: string;
  /** Title of the featured course's next lesson, resolved server-side. */
  nextLesson: { stage: number; title: string; levelTitle: string; time: string } | null;
  firstName: string | null;
  league: LeagueView;
  goalDays: number | null;
  signedIn: boolean;
};

export function LearnHome({
  courses, progress, state, featured, nextLesson, firstName, league, goalDays, signedIn,
}: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState(featured);
  const [query, setQuery] = useState("");

  const course = useMemo(
    () => courses.find((c) => c.id === selected) ?? courses[0],
    [courses, selected],
  );
  const p = progress[course.id];

  // The resolved lesson only matches the featured course; picking a
  // different thumb falls back to that course's own next stage.
  const lesson =
    course.id === featured && nextLesson
      ? nextLesson
      : {
          stage: p?.nextStage ?? 0,
          title: course.levels[0]?.title ?? "Get started",
          levelTitle: `Level ${Math.floor((p?.nextStage ?? 0) / 4) + 1}`,
          time: "",
        };

  const started = p?.started;

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/learn/courses?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <main className={css.page}>
      <div className={css.homeGrid}>
        {/* ── Rail: the habit column ─────────────────────────── */}
        <aside className={css.rail}>
          <form className={css.search} onSubmit={search}>
            <span style={{ color: "var(--text3)", display: "flex" }}><SearchIcon size={19} /></span>
            <input
              className={css.searchInput}
              placeholder="What do you want to learn?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search courses"
            />
            <button type="submit" className={css.searchGo} data-ready={query.trim().length > 0}>
              Find
            </button>
          </form>

          <section className={`${css.card} ${css.cardPad}`} aria-label="Your streak">
            <div className={css.streakTop}>
              <div>
                <div className={css.streakCount}>
                  {state.streak}
                  <span style={{ color: "var(--streak)", display: "flex" }}><FlameIcon size={30} /></span>
                </div>
                <p className={css.streakLabel}>
                  {state.streak === 0
                    ? "Finish a lesson to start your streak"
                    : `day streak${state.longestStreak > state.streak ? ` · best ${state.longestStreak}` : ""}`}
                </p>
              </div>
              <div className={css.streakFreezes} title={`${state.freezes} streak freezes left`}>
                {Array.from({ length: state.freezes }, (_, i) => (
                  <FreezeIcon key={i} />
                ))}
              </div>
            </div>

            <div className={css.week}>
              {state.week.map((d, i) => (
                <div key={d.date} className={css.day} data-state={d.state}>
                  <span className={css.dayDot} data-state={d.state} title={`${d.date} · ${d.xp} XP`}>
                    {d.state === "done" ? <CheckIcon size={18} /> : null}
                  </span>
                  <span className={css.dayName}>{d.label}</span>
                  <span className={css.srOnly}>
                    {d.date}: {d.state === "done" ? `${d.xp} XP` : d.state}
                  </span>
                  {/* Two Tuesdays and two Saturdays share an initial — index
                      disambiguates for anything reading the DOM. */}
                  <span className={css.srOnly}>day {i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          {!state.premium.active && (
            <section className={css.upsell}>
              <h2 className={css.upsellTitle}>Unlock every track</h2>
              <p className={css.upsellSub}>
                {courses.length} tracks, every lesson and every project — ₹{PLANS.annual.amount} a year.
              </p>
              <Link href="/learn/premium" className={css.upsellBtn}>Explore Premium</Link>
            </section>
          )}

          <GoalCard goalDays={goalDays} streak={state.streak} signedIn={signedIn} />

          <LeagueCard league={league} totalXp={state.xp} />

        </aside>

        {/* ── Stage: the single next action ──────────────────── */}
        <section>
          <div className={css.deck}>
            <article className={css.next}>
              <span className={css.nextBadge}>
                {started ? "Continue" : "Recommended"}
              </span>
              <h1 className={css.nextTitle}>{course.title}</h1>
              <p className={css.nextLevel}>
                {lesson.levelTitle} · {course.lessonCount} lessons
              </p>

              <div className={css.nextArt}>
                <CourseGlyph courseId={course.id} color={course.color} size={190} />
              </div>

              <div className={css.nextLesson}>
                <span
                  style={{
                    width: 34, height: 34, borderRadius: 999, flexShrink: 0,
                    display: "grid", placeItems: "center",
                    background: course.color, color: "#fff", fontWeight: 800, fontSize: 13,
                  }}
                >
                  {lesson.stage + 1}
                </span>
                <span className={css.nextLessonTitle}>{lesson.title}</span>
                {lesson.time && <span className={css.nextLessonMeta}>{lesson.time}</span>}
              </div>

              {started && (
                <div className={css.bar} style={{ width: "100%", marginBottom: "1.4rem" }}>
                  <span
                    className={css.barFill}
                    style={{ width: `${p.percent}%`, background: course.color }}
                  />
                </div>
              )}

              <Link
                href={`/learn/${course.slug}/lesson/${lesson.stage}`}
                className={css.nextCta}
                style={started ? undefined : { background: course.color, boxShadow: "none" }}
              >
                {started ? "Continue" : "Start"}
              </Link>
            </article>
          </div>

          <div className={css.thumbs} role="tablist" aria-label="Your courses">
            {courses.map((c) => {
              const cp = progress[c.id];
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={c.id === selected}
                  className={css.thumb}
                  data-active={c.id === selected}
                  onClick={() => setSelected(c.id)}
                  title={c.title}
                >
                  <CourseGlyph courseId={c.id} color={c.color} size={62} plinth={false} />
                  {cp?.completed && <span className={css.thumbCheck}><CheckIcon size={12} /></span>}
                  <span className={css.srOnly}>{c.title}</span>
                </button>
              );
            })}
          </div>

          {firstName && (
            <p style={{ marginTop: "1.5rem", color: "var(--text3)", fontSize: "0.9375rem" }}>
              Welcome back, {firstName}. {state.xp > 0 ? `${state.xp} XP so far.` : "Your first lesson is one click away."}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

const FreezeIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="2.5" y="2.5" width="11" height="15" rx="3" />
    <path d="M8 6v8M5 9l3-3 3 3" />
  </svg>
);
