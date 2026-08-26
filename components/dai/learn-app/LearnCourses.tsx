"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import css from "./learn-app.module.css";
import { CourseGlyph } from "./CourseGlyph";
import { SearchIcon, CheckIcon } from "./icons";
import type { CourseSummary, LearningPath } from "@/lib/learn/catalog";
import type { CourseProgress } from "@/lib/server/learn-progress";

type Props = {
  courses: CourseSummary[];
  paths: LearningPath[];
  progress: Record<string, CourseProgress>;
  initialQuery: string;
};

function ProgressRing({ percent, color }: { percent: number; color: string }) {
  return (
    <span
      className={css.ring}
      style={{
        background: `conic-gradient(${color} ${percent * 3.6}deg, var(--lineStrong) 0deg)`,
      }}
      aria-hidden="true"
    />
  );
}

export function LearnCourses({ courses, paths, progress, initialQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const byId = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c])) as Record<string, CourseSummary>,
    [courses],
  );

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return courses;
    return courses.filter((c) =>
      [c.title, c.short, c.tagline, c.level, ...c.tags]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [courses, q]);

  // A path's completion is the mean of its courses — the same weighting a
  // learner assumes when they look at the rail.
  function pathPercent(path: LearningPath) {
    const total = path.courseIds.reduce((n, id) => n + (progress[id]?.percent ?? 0), 0);
    return Math.round(total / path.courseIds.length);
  }

  return (
    <main className={css.page}>
      <div className={css.coursesHead}>
        <div>
          <h1 className={css.pageTitle}>Learning paths</h1>
          <p className={css.pageSub}>Step-by-step routes from first line of code to shipped product.</p>
        </div>
        <form
          className={`${css.search} ${css.coursesSearch}`}
          onSubmit={(e) => {
            e.preventDefault();
            router.replace(q ? `/learn/courses?q=${encodeURIComponent(q)}` : "/learn/courses");
          }}
        >
          <span style={{ color: "var(--text3)", display: "flex" }}><SearchIcon size={19} /></span>
          <input
            className={css.searchInput}
            placeholder="What do you want to learn?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search courses"
          />
          <button type="submit" className={css.searchGo} data-ready={q.length > 0}>Find</button>
        </form>
      </div>

      {q ? (
        <section>
          <h2 className={css.sectionTitle}>
            {matches.length} {matches.length === 1 ? "course" : "courses"} matching “{query.trim()}”
          </h2>
          {matches.length === 0 ? (
            <p className={css.empty}>
              Nothing here yet. Try “javascript”, “react”, “aws”, “design”, or “interview”.
            </p>
          ) : (
            <CourseGrid courses={matches} progress={progress} />
          )}
        </section>
      ) : (
        <>
          <h2 className={css.sectionTitle} style={{ marginBottom: "1.75rem" }}>
            Your learning paths
          </h2>
          {paths.map((path) => {
            const percent = pathPercent(path);
            return (
              <section key={path.id} className={css.path}>
                <div className={css.pathHead}>
                  <span className={css.pathGlyph}>
                    <CourseGlyph courseId={byId[path.courseIds[0]]?.id ?? "js"} color={path.color} size={92} plinth={false} />
                  </span>
                  <div>
                    <p className={css.pathTier}>{path.tier}</p>
                    <h2 className={css.pathTitle}>{path.title}</h2>
                    <p className={css.pathSub}>{path.subtitle}</p>
                  </div>
                  <div className={css.pathMeta}>
                    <span className={css.pathPercent}>
                      <ProgressRing percent={percent} color={path.color} />
                      {percent}% complete
                    </span>
                  </div>
                </div>

                <div className={css.pathRail}>
                  {path.courseIds.map((id) => {
                    const c = byId[id];
                    if (!c) return null;
                    const p = progress[id];
                    return (
                      <Link key={id} href={`/learn/${c.slug}`} className={css.railItem}>
                        <span className={css.railTile}>
                          <CourseGlyph courseId={c.id} color={c.color} size={152} plinth={false} />
                          {p?.completed && <span className={css.railDone}><CheckIcon size={13} /></span>}
                          {p?.started && !p.completed && (
                            <span className={css.railTileBar}>
                              <span
                                className={css.barFill}
                                style={{ width: `${p.percent}%`, background: c.color, display: "block", height: "100%" }}
                              />
                            </span>
                          )}
                        </span>
                        <span className={css.railLabel}>{c.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <section>
            <h2 className={css.sectionTitle}>All courses</h2>
            <CourseGrid courses={courses} progress={progress} />
          </section>
        </>
      )}
    </main>
  );
}

function CourseGrid({
  courses,
  progress,
}: {
  courses: CourseSummary[];
  progress: Record<string, CourseProgress>;
}) {
  return (
    <div className={css.grid}>
      {courses.map((c) => {
        const p = progress[c.id];
        return (
          <Link key={c.id} href={`/learn/${c.slug}`} className={css.courseCard}>
            <span className={css.courseCardArt}>
              <CourseGlyph courseId={c.id} color={c.color} size={70} plinth={false} />
            </span>
            <span className={css.courseCardBody}>
              <p className={css.courseCardLevel} style={{ color: c.color }}>{c.level}</p>
              <p className={css.courseCardTitle}>{c.title}</p>
              <p className={css.courseCardMeta}>
                {c.lessonCount} lessons · {c.exerciseCount} exercises
                {p?.started ? ` · ${p.percent}% done` : ""}
              </p>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
