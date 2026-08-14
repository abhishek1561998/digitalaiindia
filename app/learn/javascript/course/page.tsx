import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { JS_STAGES, JS_QUIZ_QUESTIONS } from "@/lib/tracks/js-track";

export const metadata: Metadata = {
  title: "JavaScript Course — DigitalAIIndia Learn",
  description: "Work through the JavaScript track stage by stage — content, quizzes, and points.",
};

export default async function LearnJsCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/javascript/course");
  }

  return (
    <LearnCourseLanding
      trackId="js"
      trackTitle="JavaScript, properly."
      overviewPath="/learn/javascript"
      certificatePath="/learn/javascript/certificate"
      stages={JS_STAGES}
      quizQuestions={JS_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
