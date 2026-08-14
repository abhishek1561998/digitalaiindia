import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { DSA_STAGES, DSA_QUIZ_QUESTIONS } from "@/lib/tracks/dsa-track";

export const metadata: Metadata = {
  title: "DSA Course — DigitalAIIndia Learn",
  description: "Work through the DSA track stage by stage — patterns, quizzes, and points.",
};

export default async function LearnDsaCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/dsa/course");
  }

  return (
    <LearnCourseLanding
      trackId="dsa"
      trackTitle="Patterns, not problems."
      overviewPath="/learn/dsa"
      certificatePath="/learn/dsa/certificate"
      stages={DSA_STAGES}
      quizQuestions={DSA_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
