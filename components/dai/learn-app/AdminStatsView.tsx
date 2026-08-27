"use client";

import css from "./admin-stats.module.css";
import shell from "./learn-app.module.css";
import { learnFonts } from "./fonts";
import type { AdminStats } from "@/lib/server/admin-stats";

function Bars({
  points,
  label,
}: {
  points: { date: string; value: number }[];
  label: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <>
      <div className={css.chart} role="img" aria-label={label}>
        {points.map((p) => (
          <div key={p.date} className={css.bar} title={`${p.date}: ${p.value}`}>
            <span
              className={css.barFill}
              data-zero={p.value === 0}
              style={{ height: `${p.value === 0 ? 2 : Math.round((p.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className={css.chartAxis}>
        <span>{points[0]?.date}</span>
        <span>{points[points.length - 1]?.date}</span>
      </div>
    </>
  );
}

export function AdminStatsView({ stats }: { stats: AdminStats }) {
  const { totals, today, days, signupsByDay, courses, retention } = stats;

  const retentionPct = retention.ofCohort
    ? Math.round((retention.returnedNextDay / retention.ofCohort) * 100)
    : null;

  return (
    <div className={`${shell.app} ${learnFonts}`}>
      <main className={css.wrap}>
        <div className={css.inner}>
          <h1 className={css.title}>Stats</h1>
          <p className={css.sub}>Signed-in learners, last 30 days.</p>

          <div className={css.cards}>
            <div className={css.card}>
              <div className={css.cardValue}>{today.activeLearners}</div>
              <p className={css.cardLabel}>learning today</p>
              <p className={css.cardNote}>finished at least one lesson</p>
            </div>
            <div className={css.card}>
              <div className={css.cardValue}>{today.lessonsCompleted}</div>
              <p className={css.cardLabel}>lessons completed today</p>
            </div>
            <div className={css.card}>
              <div className={css.cardValue}>{totals.users}</div>
              <p className={css.cardLabel}>accounts</p>
              <p className={css.cardNote}>{totals.enrolled} have started a track</p>
            </div>
            <div className={css.card}>
              <div className={css.cardValue}>
                {retentionPct === null ? "—" : `${retentionPct}%`}
              </div>
              <p className={css.cardLabel}>came back today</p>
              <p className={css.cardNote}>
                {retention.ofCohort === 0
                  ? "nobody was active yesterday"
                  : `${retention.returnedNextDay} of ${retention.ofCohort} active yesterday`}
              </p>
            </div>
          </div>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>Active learners per day</h2>
            <Bars
              label="Active learners per day"
              points={days.map((d) => ({ date: d.date, value: d.learners }))}
            />
          </section>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>Lessons completed per day</h2>
            <Bars
              label="Lessons completed per day"
              points={days.map((d) => ({ date: d.date, value: d.lessons }))}
            />
          </section>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>New accounts per day</h2>
            <Bars
              label="New accounts per day"
              points={signupsByDay.map((d) => ({ date: d.date, value: d.count }))}
            />
          </section>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>By course</h2>
            <table className={css.table}>
              <thead>
                <tr>
                  <th scope="col">Course</th>
                  <th scope="col" className={css.num}>Learners</th>
                  <th scope="col" className={css.num}>Lessons passed</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td className={css.num}>{c.learners}</td>
                    <td className={css.num}>{c.lessonsPassed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <p className={css.note}>
            These are signed-in learners only. Someone who lands on the site and leaves
            without an account never touches the database, so visitor counts, traffic
            sources and bounce rate live in the Vercel Analytics dashboard instead.
          </p>
        </div>
      </main>
    </div>
  );
}
