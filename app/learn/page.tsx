import { Metadata } from "next";
import { LearnHomeScreen } from "@/components/dai/learn-app/LearnHomeScreen";
export const metadata: Metadata = {
  title: "Learn to Code — JavaScript, DSA & Generative AI | DigitalAIIndia Learn",
  description:
    "Seven project-based tracks with interactive lessons, daily streaks, XP, badges and weekly leagues — JavaScript, Python, data structures & algorithms, and a four-course generative AI path.",
  keywords: [
    "learn to code",
    "interactive coding course",
    "free coding course",
    "JavaScript course",
    "DSA course",
        "generative AI course",
    "GenAI course",
    "learn RAG",
          ],
  alternates: { canonical: "https://learn.digitalaiindia.com" },
  openGraph: {
    title: "Learn by building — DigitalAIIndia Learn",
    description:
      "Interactive tracks in JavaScript, data structures & algorithms, and generative AI. Build real things, keep a streak, climb the league.",
    url: "https://learn.digitalaiindia.com",
    siteName: "DigitalAIIndia Learn",
    type: "website",
    images: [{ url: "https://digitalaiindia.com/banner.png", width: 1200, height: 630, alt: "DigitalAIIndia Learn" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn by building — DigitalAIIndia Learn",
    description: "Interactive tracks in JavaScript, DSA and generative AI.",
    images: ["https://digitalaiindia.com/banner.png"],
  },
};

export default async function LearnPage() {
  return <LearnHomeScreen />;
}
