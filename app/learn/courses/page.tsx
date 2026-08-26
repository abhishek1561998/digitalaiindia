import { Metadata } from "next";
import { AppShell } from "@/components/dai/learn-app/AppShell";
import { LearnCourses } from "@/components/dai/learn-app/LearnCourses";
import { getCurrentUser } from "@/lib/server/auth";
import { COURSE_SUMMARIES, PATHS } from "@/lib/learn/catalog";
import { getCourseProgress, emptyProgress } from "@/lib/server/learn-progress";
import { getLearnerState } from "@/lib/server/learn-state";
import { guestState } from "@/lib/learn/guest-state";
import { getPreferences } from "@/lib/server/learn-preferences";

export const metadata: Metadata = {
  title: "All Courses & Learning Paths | DigitalAIIndia Learn",
  description:
    "Every DigitalAIIndia Learn track and the paths that connect them — programming foundations and generative AI.",
  alternates: { canonical: "https://learn.digitalaiindia.com/learn/courses" },
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const user = await getCurrentUser();

  // Preferences don't depend on the other two, so all three go together.
  const [preferences, progress, state] = await Promise.all([
    getPreferences(user?.id ?? null),
    user ? getCourseProgress(user.id) : Promise.resolve(emptyProgress()),
    user ? getLearnerState(user.id) : Promise.resolve(guestState()),
  ]);

  return (
    <AppShell active="courses" user={user ? { name: user.name, email: user.email } : null} state={state} preferences={preferences}>
      <LearnCourses
        courses={COURSE_SUMMARIES}
        paths={PATHS}
        progress={progress}
        initialQuery={q ?? ""}
      />
    </AppShell>
  );
}
