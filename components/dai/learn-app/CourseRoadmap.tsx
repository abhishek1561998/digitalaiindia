"use client";

import Link from "next/link";
import css from "./learn-app.module.css";
import { CourseGlyph } from "./CourseGlyph";
import { CheckIcon, BoltIcon } from "./icons";
import { LessonRoad, type StopState } from "./LessonRoad";
import type { CourseSummary } from "@/lib/learn/catalog";
import type { CourseProgress } from "@/lib/server/learn-progress";

export type RoadmapLevel = {
  index: number;
  title: string;
  lessons: { stage: number; num: string; title: string; time: string }[];
};

type Props = {
  course: CourseSummary;
  levels: RoadmapLevel[];
  progress: CourseProgress;
  /** Stage-index -> 0 | 50 | 100, so a viewed-but-unpassed lesson reads as in progress. */
  stageProgress: Record<string, number>;
  signedIn: boolean;
  premiumActive: boolean;
  /** Free plan only: whether today's one lesson has been spent, and on what. */
  daily: {
    used: boolean;
    claimed: { trackId: string; stage: number } | null;
    nextAt: string;
  } | null;
};

export function CourseRoadmap({
  course, levels, progress, stageProgress, signedIn,
  premiumActive, daily,
}: Props) {
  const next = progress.nextStage;

  // Today's free lesson, if it was claimed in this course.
  const claimedHere =
    daily?.claimed && daily.claimed.trackId === course.id ? daily.claimed.stage : null;

  // Three states that all look "not now", kept apart because they mean
  // different things: `tomorrow` is a wait, `ahead` is only visual quiet.
  function stateOf(stage: number): StopState {
    if ((stageProgress[String(stage)] ?? 0) >= 100) return "done";
    // A free learner who has spent today's lesson elsewhere can still finish
    // the one they claimed; everything else waits for the reset.
    if (daily?.used && claimedHere !== stage) return "tomorrow";
    if (stage === next) return "current";
    return stage < next ? "open" : "ahead";
  }

  return (
    <main className={css.page}>
      <div className={css.courseGrid}>
        <aside className={css.courseAside}>
          <div className={css.courseAsideArt}>
            <CourseGlyph courseId={course.id} color={course.color} size={150} />
          </div>
          <h1 className={css.courseAsideTitle}>{course.title}</h1>
          <p className={css.courseAsideDesc}>{course.tagline}</p>

          <div className={css.courseTags}>
            {course.tags.map((t) => <span key={t} className={css.tag}>{t}</span>)}
          </div>

          {progress.started && (
            <>
              <div className={css.bar}>
                <span
                  className={css.barFill}
                  style={{ width: `${progress.percent}%`, background: course.color }}
                />
              </div>
              <p className={css.roadMeta} style={{ marginTop: "0.6rem" }}>
                {progress.lessonsDone} of {course.lessonCount} lessons complete · {progress.percent}%
              </p>
            </>
          )}

          <div className={css.courseStats}>
            <span className={css.courseStat}>
              <CheckIcon size={16} /> {course.lessonCount} lessons
            </span>
            <span className={css.courseStat}>
              <BoltIcon size={16} /> {course.exerciseCount} exercises
            </span>
          </div>

          <Link
            href={`/learn/${course.slug}/lesson/${next}`}
            className={css.courseCta}
            style={{ background: course.color }}
          >
            {progress.started ? "Continue" : "Start course"}
          </Link>

          {daily && (
            <p className={css.roadMeta} style={{ marginTop: "0.85rem", textAlign: "center" }}>
              {daily.used
                ? "Today's free lesson is done — the next one unlocks tomorrow."
                : "One free lesson a day. Today's is still available."}
            </p>
          )}
        </aside>

        <div>
          {levels.map((level) => {
            const isCurrent = level.lessons.some((l) => l.stage === next);
            return (
              <section key={level.index} className={css.level}>
                <header className={css.levelHead} data-current={isCurrent}>
                  <span className={css.levelNum}>Level {level.index + 1}</span>
                  <span className={css.levelName}>{level.title}</span>
                  <span className={css.levelCount}>
                    {level.lessons.filter((l) => (stageProgress[String(l.stage)] ?? 0) >= 100).length}
                    /{level.lessons.length}
                  </span>
                </header>

                <LessonRoad
                  color={course.color}
                  stops={level.lessons.map((lesson) => {
                    const state = stateOf(lesson.stage);
                    const viewed = (stageProgress[String(lesson.stage)] ?? 0) === 50;
                    return {
                      stage: lesson.stage,
                      title: lesson.title,
                      time: lesson.time,
                      state,
                      href: `/learn/${course.slug}/lesson/${lesson.stage}`,
                      note:
                        state === "tomorrow" ? "tomorrow"
                        : state === "current" ? "up next"
                        : viewed ? "in progress"
                        : undefined,
                    };
                  })}
                />
              </section>
            );
          })}

        </div>
      </div>
    </main>
  );
}
