import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LessonPlayer } from "@/components/dai/learn-app/LessonPlayer";
import { PreferencesProvider } from "@/components/dai/learn-app/PreferencesProvider";
import { getCurrentUser } from "@/lib/server/auth";
import { LessonLocked } from "@/components/dai/learn-app/LessonLocked";
import { getCourse, locateLesson, XP_PER_LESSON } from "@/lib/learn/catalog";
import { checkDailyAccess } from "@/lib/server/daily-lesson";
import { getLearnerState } from "@/lib/server/learn-state";
import { getExercises } from "@/lib/server/exercise-registry";
import { getPreferences } from "@/lib/server/learn-preferences";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; stage: string }>;
}): Promise<Metadata> {
  const { slug, stage } = await params;
  const course = getCourse(slug);
  const n = Number(stage);
  if (!course || Number.isNaN(n) || !course.stages[n]) return {};
  return {
    title: `${course.stages[n].title} — ${course.title} | DigitalAIIndia Learn`,
    description: course.stages[n].why.slice(0, 160),
    // Lessons are the app, not landing pages: keep them out of the index and
    // point crawlers at the course page instead.
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; stage: string }>;
}) {
  const { slug, stage } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const n = Number(stage);
  if (!Number.isInteger(n) || n < 0 || n >= course.stages.length) notFound();

  const user = await getCurrentUser();
  // This is the one gate in the whole app. Everything up to here — the home
  // screen, the catalogue, a course's whole roadmap — is browsable signed
  // out; we ask for an account at the moment someone actually starts, because
  // that's the first point where there's progress worth saving.
  if (!user) redirect(`/auth?redirect=/learn/${course.slug}/lesson/${n}`);

  const located = locateLesson(course, n);
  const [enrollment, state, preferences] = await Promise.all([
    prisma.trackEnrollment.findUnique({
      where: { userId_trackId: { userId: user.id, trackId: course.id } },
      select: { stageProgress: true },
    }),
    getLearnerState(user.id),
    getPreferences(user.id),
  ]);
  const sp = (enrollment?.stageProgress as Record<string, number>) ?? {};

  // One lesson a day on the free plan. Checking here (rather than on the
  // roadmap) is what makes the claim happen at the moment of opening.
  const access = await checkDailyAccess({
    userId: user.id,
    trackId: course.id,
    stage: n,
    premium: state.premium.active,
    alreadyPassed: (sp[String(n)] ?? 0) >= 100,
  });

  if (!access.allowed) {
    const claimedCourse = access.claimed ? getCourse(access.claimed.trackId) : null;
    return (
      <LessonLocked
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
        courseColor={course.color}
        lessonTitle={course.stages[n].title}
        nextAt={access.nextAt}
        trialUsed={state.premium.status !== "none"}
        claimed={
          claimedCourse && access.claimed
            ? {
                title: claimedCourse.stages[access.claimed.stage]?.title ?? "today's lesson",
                href: `/learn/${claimedCourse.slug}/lesson/${access.claimed.stage}`,
              }
            : null
        }
      />
    );
  }

  return (
    <PreferencesProvider initial={preferences} signedIn>
      <LessonPlayer
        courseId={course.id}
        courseSlug={course.slug}
        courseTitle={course.title}
        courseColor={course.color}
        practiceTool={course.practiceTool}
        stage={n}
        lessonTitle={course.stages[n].title}
        levelTitle={located?.level.title ?? "Foundations"}
        totalLessons={course.stages.length}
        content={course.stages[n]}
        question={course.quizQuestions.find((q) => q.stage === n) ?? null}
        alreadyPassed={(sp[String(n)] ?? 0) >= 100}
        exercises={getExercises(course.id, n)}
        xpPerLesson={XP_PER_LESSON}
      />
    </PreferencesProvider>
  );
}
