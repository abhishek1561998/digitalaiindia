import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnJsCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "JavaScript Course — DigitalAIIndia Learn",
  description: "Work through the JavaScript track stage by stage — content, quizzes, and points.",
};

export default async function LearnJsCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/javascript/course");
  }

  return <LearnJsCourseLanding userName={user.name} />;
}
