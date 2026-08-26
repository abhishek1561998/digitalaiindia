import { Metadata } from "next";
import { AppShell } from "@/components/dai/learn-app/AppShell";
import { LearnYou } from "@/components/dai/learn-app/LearnYou";
import { getCurrentUser } from "@/lib/server/auth";
import { COURSE_SUMMARIES, TOTAL_LESSONS } from "@/lib/learn/catalog";
import { getCourseProgress, emptyProgress } from "@/lib/server/learn-progress";
import { getLearnerState } from "@/lib/server/learn-state";
import { guestState } from "@/lib/learn/guest-state";
import { getPreferences } from "@/lib/server/learn-preferences";
import { getBadges } from "@/lib/server/learn-badges";

export const metadata: Metadata = {
  title: "Your progress | DigitalAIIndia Learn",
  description: "Your streak, XP, badges and lessons completed across every DigitalAIIndia Learn track.",
  robots: { index: false, follow: true },
};

/** What a signed-out visitor's badge shelf looks like. */
const NO_BADGES: Awaited<ReturnType<typeof getBadges>> = {
  earned: [],
  next: null,
  stats: { streak: 0, goalDays: null, xp: 0, lessons: 0, courses: 0, leagueTier: 0 },
};

export default async function YouPage() {
  const user = await getCurrentUser();

  // Preferences don't depend on the rest, so everything goes in one batch
  // instead of a round trip for preferences and then another for the rest.
  const [preferences, progress, state, badges] = await Promise.all([
    getPreferences(user?.id ?? null),
    user ? getCourseProgress(user.id) : Promise.resolve(emptyProgress()),
    user ? getLearnerState(user.id) : Promise.resolve(guestState()),
    user ? getBadges(user.id) : Promise.resolve(NO_BADGES),
  ]);

  return (
    <AppShell active="you" user={user ? { name: user.name, email: user.email } : null} state={state} preferences={preferences}>
      <LearnYou
        courses={COURSE_SUMMARIES}
        progress={progress}
        state={state}
        name={user?.name ?? null}
        email={user?.email ?? null}
        totalLessons={TOTAL_LESSONS}
        badges={badges.earned}
        nextBadge={badges.next}
      />
    </AppShell>
  );
}
