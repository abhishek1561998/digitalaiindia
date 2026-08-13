import { Metadata } from "next";
import { LearnLanding } from "@/components/dai/learn-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Learn to Code Free — JavaScript, DSA, MERN & AI Engineering | DigitalAIIndia Learn",
  description:
    "Free, project-based coding tracks with a real certificate on completion — JavaScript, DSA, MERN stack, and AI engineering. Learn by building, not watching.",
  keywords: [
    "learn to code free",
    "free coding certificate",
    "JavaScript course free",
    "learn JavaScript India",
    "DSA course",
    "MERN stack course",
    "AI engineering course",
    "project based learning",
  ],
  alternates: { canonical: "https://learn.digitalaiindia.com" },
  openGraph: {
    title: "Learn to Code Free, Earn a Real Certificate — DigitalAIIndia Learn",
    description:
      "Project-based tracks in JavaScript, DSA, MERN, and AI engineering. Build real things, pass real quizzes, earn a real certificate.",
    url: "https://learn.digitalaiindia.com",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn to Code Free, Earn a Real Certificate — DigitalAIIndia Learn",
    description: "Project-based tracks in JavaScript, DSA, MERN, and AI engineering.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

export default async function LearnPage() {
  const user = await getCurrentUser();
  return <LearnLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />;
}
