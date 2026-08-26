import { Metadata } from "next";
import { LearnHomeScreen } from "@/components/dai/learn-app/LearnHomeScreen";

// The main domain now leads with Learn. The marketing site, platform,
// pricing and dashboard routes are all still live and unchanged — they're
// just no longer what "/" lands on. To put the marketing page back, restore
// the two lines in git history; nothing was deleted.
export const metadata: Metadata = {
  title: "Learn to Code — JavaScript, DSA & Generative AI | DigitalAIIndia",
  description:
    "Seven project-based tracks with interactive lessons, daily streaks, XP, badges and weekly leagues — JavaScript, Python, data structures & algorithms, and a four-course generative AI path.",
  alternates: { canonical: "https://digitalaiindia.com" },
};

export default async function HomePage() {
  return <LearnHomeScreen />;
}
