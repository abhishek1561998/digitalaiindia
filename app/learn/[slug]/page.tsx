import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/dai/learn-app/AppShell";
import { CourseRoadmap } from "@/components/dai/learn-app/CourseRoadmap";
import { getCurrentUser } from "@/lib/server/auth";
import { COURSES, getCourse, toSummary, canonicalSlug } from "@/lib/learn/catalog";
import { getDailyClaim } from "@/lib/server/daily-lesson";
import { getCourseProgress, emptyProgress } from "@/lib/server/learn-progress";
import { getLearnerState } from "@/lib/server/learn-state";
import { guestState } from "@/lib/learn/guest-state";
import { getPreferences } from "@/lib/server/learn-preferences";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};

  const title = `${course.title} — ${course.lessonCount} interactive lessons | DigitalAIIndia Learn`;
  return {
    title,
    description: course.tagline,
    keywords: [course.title, ...course.tags, "online course", "learn to code", "interactive lessons"],
    alternates: { canonical: `https://learn.digitalaiindia.com/learn/${course.slug}` },
    openGraph: {
      title,
      description: course.tagline,
      url: `https://learn.digitalaiindia.com/learn/${course.slug}`,
      siteName: "DigitalAIIndia Learn",
      type: "website",
      images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: course.title }],
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  // A legacy URL resolves, then redirects — one canonical address per course.
  const canonical = canonicalSlug(slug);
  if (canonical) redirect(`/learn/${canonical}`);

  const user = await getCurrentUser();

  const [preferences, progressMap, state] = await Promise.all([
    getPreferences(user?.id ?? null),
    user ? getCourseProgress(user.id) : Promise.resolve(emptyProgress()),
    user ? getLearnerState(user.id) : Promise.resolve(guestState()),
  ]);

  const progress = progressMap[course.id];

  // Free learners see which lesson today's quota is already spent on, so the
  // roadmap can mark the rest as tomorrow's rather than as locked forever.
  const daily = user && !state.premium.active ? await getDailyClaim(user.id) : null;

  return (
    <AppShell active="courses" user={user ? { name: user.name, email: user.email } : null} state={state} preferences={preferences}>
      <CourseRoadmap
        course={toSummary(course)}
        levels={course.levels}
        progress={progress}
        stageProgress={progress.stageProgress}
        signedIn={Boolean(user)}
        premiumActive={state.premium.active}
        daily={daily}
      />
    </AppShell>
  );
}
