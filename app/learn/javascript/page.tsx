import { Metadata } from "next";
import { LearnJsLanding } from "@/components/dai/learn-js-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "JavaScript, Properly. — DigitalAIIndia Learn",
  description: "A 9-stage, project-based JavaScript curriculum — real code, real projects, real self-checks, no fluff.",
};

export default async function LearnJavaScriptPage() {
  const user = await getCurrentUser();
  return <LearnJsLanding isLoggedIn={Boolean(user)} />;
}
