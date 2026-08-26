import { Metadata } from "next";
import { AppShell } from "@/components/dai/learn-app/AppShell";
import { LearnAbout } from "@/components/dai/learn-app/LearnAbout";
import { getCurrentUser } from "@/lib/server/auth";
import { COURSE_SUMMARIES, TOTAL_LESSONS } from "@/lib/learn/catalog";
import { getLearnerState } from "@/lib/server/learn-state";
import { getPreferences } from "@/lib/server/learn-preferences";
import { guestState } from "@/lib/learn/guest-state";
import { PLANS } from "@/lib/learn/pricing";

export const metadata: Metadata = {
  title: "About — why we price it this way | DigitalAIIndia Learn",
  description:
    `DigitalAIIndia Learn builds project-based technical tracks and prices them for India — ₹${PLANS.annual.amount} a year for every track, with one lesson a day free forever.`,
  alternates: { canonical: "https://digitalaiindia.com/about" },
  openGraph: {
    title: "About DigitalAIIndia Learn",
    description:
      "World-class technical education already exists. It just costs more than most people in India can justify. Here's what we did about it.",
    url: "https://digitalaiindia.com/about",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "DigitalAIIndia Learn" }],
  },
};

export default async function AboutPage() {
  const user = await getCurrentUser();

  const [preferences, state] = await Promise.all([
    getPreferences(user?.id ?? null),
    user ? getLearnerState(user.id) : Promise.resolve(guestState()),
  ]);

  return (
    <AppShell active="none" user={user ? { name: user.name, email: user.email } : null} state={state} preferences={preferences}>
      <LearnAbout courses={COURSE_SUMMARIES} totalLessons={TOTAL_LESSONS} />
    </AppShell>
  );
}
