// Numbers for the admin dashboard, from data the app already stores.
//
// This answers "who is actually learning" — signed-in people completing
// lessons. It cannot answer "how many people visited", because an anonymous
// visitor who bounces never touches the database. That needs a web analytics
// tool; see the Analytics component in app/layout.tsx.

import { prisma } from "@/lib/prisma";
import { COURSES } from "@/lib/learn/catalog";
import { toDay } from "./learn-state";

export type DayPoint = { date: string; learners: number; lessons: number; xp: number };

export type AdminStats = {
  totals: { users: number; enrolled: number; lessonsPassed: number };
  today: { activeLearners: number; lessonsCompleted: number };
  /** Signups and activity, one entry per day, oldest first. */
  days: DayPoint[];
  signupsByDay: { date: string; count: number }[];
  courses: { id: string; title: string; learners: number; lessonsPassed: number }[];
  retention: { returnedNextDay: number; ofCohort: number };
};

function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setUTCDate(out.getUTCDate() + n);
  return out;
}

export async function getAdminStats(windowDays = 30): Promise<AdminStats> {
  const today = toDay(new Date());
  const from = addDays(today, -(windowDays - 1));

  const [users, enrollments, activity, signups] = await Promise.all([
    prisma.user.count(),
    prisma.trackEnrollment.findMany({ select: { userId: true, trackId: true, stageProgress: true } }),
    prisma.learnActivity.findMany({
      where: { day: { gte: from } },
      select: { day: true, userId: true, lessons: true, xp: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: from } },
      select: { createdAt: true },
    }),
  ]);

  // One bucket per day, so a day with no activity still shows as a zero
  // rather than vanishing from the chart.
  const byDay = new Map<string, { learners: Set<string>; lessons: number; xp: number }>();
  for (let i = 0; i < windowDays; i++) {
    byDay.set(addDays(from, i).toISOString().slice(0, 10), {
      learners: new Set(),
      lessons: 0,
      xp: 0,
    });
  }

  for (const a of activity) {
    const key = toDay(a.day).toISOString().slice(0, 10);
    const bucket = byDay.get(key);
    if (!bucket) continue;
    bucket.learners.add(a.userId);
    bucket.lessons += a.lessons;
    bucket.xp += a.xp;
  }

  const days: DayPoint[] = [...byDay.entries()].map(([date, b]) => ({
    date,
    learners: b.learners.size,
    lessons: b.lessons,
    xp: b.xp,
  }));

  const signupBuckets = new Map<string, number>(
    [...byDay.keys()].map((d) => [d, 0]),
  );
  for (const u of signups) {
    const key = toDay(u.createdAt).toISOString().slice(0, 10);
    if (signupBuckets.has(key)) signupBuckets.set(key, signupBuckets.get(key)! + 1);
  }

  // Per-course: learners enrolled, and lessons actually passed.
  const byCourse = new Map(COURSES.map((c) => [c.id, { learners: 0, lessonsPassed: 0 }]));
  let lessonsPassed = 0;
  for (const e of enrollments) {
    const bucket = byCourse.get(e.trackId);
    const sp = (e.stageProgress as Record<string, number>) || {};
    const passed = Object.values(sp).filter((v) => v >= 100).length;
    lessonsPassed += passed;
    if (bucket) {
      bucket.learners += 1;
      bucket.lessonsPassed += passed;
    }
  }

  // Did the people active yesterday come back today? The single most useful
  // number here — everything else can grow while this quietly stays at zero.
  const yesterdayKey = addDays(today, -1).toISOString().slice(0, 10);
  const todayKey = today.toISOString().slice(0, 10);
  const yesterdaySet = byDay.get(yesterdayKey)?.learners ?? new Set<string>();
  const todaySet = byDay.get(todayKey)?.learners ?? new Set<string>();
  let returned = 0;
  for (const id of yesterdaySet) if (todaySet.has(id)) returned += 1;

  return {
    totals: {
      users,
      enrolled: new Set(enrollments.map((e) => e.userId)).size,
      lessonsPassed,
    },
    today: {
      activeLearners: todaySet.size,
      lessonsCompleted: byDay.get(todayKey)?.lessons ?? 0,
    },
    days,
    signupsByDay: [...signupBuckets.entries()].map(([date, count]) => ({ date, count })),
    courses: COURSES.map((c) => ({
      id: c.id,
      title: c.title,
      ...byCourse.get(c.id)!,
    })),
    retention: { returnedNextDay: returned, ofCohort: yesterdaySet.size },
  };
}
