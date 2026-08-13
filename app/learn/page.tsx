import { Metadata } from "next";
import { LearnLanding } from "@/components/dai/learn-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Learn - DigitalAIIndia",
  description:
    "Hands-on tracks on RAG engineering, voice AI architecture, and product design — built from how DigitalAIIndia itself is built.",
};

export default async function LearnPage() {
  const user = await getCurrentUser();
  return <LearnLanding isLoggedIn={Boolean(user)} userName={user?.name ?? null} />;
}
