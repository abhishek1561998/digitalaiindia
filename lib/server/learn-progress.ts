// Per-course progress for one learner, in the shape the Learn app renders.
//
// TrackEnrollment.stageProgress maps stage index -> 0 | 50 | 100 (50 =
// content viewed, 100 = quiz passed). Percent is the mean across the
// course's real stage count — the old hub hard-coded 9, which under-reported
// AWS and UI/UX and over-reported nothing.

import { prisma } from "@/lib/prisma";
import { COURSES } from "@/lib/learn/catalog";

export type CourseProgress = {
  percent: number;
  /** Stages at 100. */
  lessonsDone: number;
  /** Stage the learner should land on next. */
  nextStage: number;
  started: boolean;
  completed: boolean;
  points: number;
  /** Raw stage-index -> 0 | 50 | 100 map, for screens that show per-lesson state. */
  stageProgress: Record<string, number>;
};

export type ProgressMap = Record<string, CourseProgress>;

const EMPTY: CourseProgress = {
  percent: 0,
  lessonsDone: 0,
  nextStage: 0,
  started: false,
  completed: false,
  points: 0,
  stageProgress: {},
};

export function emptyProgress(): ProgressMap {
  return Object.fromEntries(COURSES.map((c) => [c.id, { ...EMPTY, stageProgress: {} }]));
}

export async function getCourseProgress(userId: string): Promise<ProgressMap> {
  const enrollments = await prisma.trackEnrollment.findMany({ where: { userId } });
  const byTrack = new Map(enrollments.map((e) => [e.trackId, e]));

  return Object.fromEntries(
    COURSES.map((course) => {
      const e = byTrack.get(course.id);
      if (!e) return [course.id, { ...EMPTY, stageProgress: {} }];

      const sp = (e.stageProgress as Record<string, number>) || {};
      const total = course.lessonCount;
      let sum = 0;
      let done = 0;
      for (let i = 0; i < total; i++) {
        const v = sp[String(i)] || 0;
        sum += v;
        if (v >= 100) done += 1;
      }

      // Next up is the first stage that isn't finished; if all are, stay on
      // the last one rather than pointing past the end of the course.
      let nextStage = total - 1;
      for (let i = 0; i < total; i++) {
        if ((sp[String(i)] || 0) < 100) { nextStage = i; break; }
      }

      return [course.id, {
        percent: Math.round(sum / total),
        lessonsDone: done,
        nextStage,
        started: true,
        completed: Boolean(e.completedAt),
        points: e.points,
        stageProgress: sp,
      }];
    }),
  );
}

/**
 * The course the Home screen should put in front of the learner: the one
 * they're furthest into but haven't finished, else the first unstarted
 * course in catalog order.
 */
export function pickNextCourse(progress: ProgressMap): string {
  const inFlight = COURSES
    .filter((c) => progress[c.id]?.started && !progress[c.id]?.completed)
    .sort((a, b) => progress[b.id].percent - progress[a.id].percent);
  if (inFlight.length) return inFlight[0].id;

  const unstarted = COURSES.find((c) => !progress[c.id]?.started);
  return (unstarted ?? COURSES[0]).id;
}
