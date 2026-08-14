import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { MERN_STAGES, MERN_QUIZ_QUESTIONS } from "@/lib/tracks/mern-track";

export const metadata: Metadata = {
  title: "MERN Course — DigitalAIIndia Learn",
  description: "Work through the MERN track stage by stage — build one real app in layers, with quizzes and points.",
};

export default async function LearnMernCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/mern/course");
  }

  return (
    <LearnCourseLanding
      trackId="mern"
      trackTitle="A real app, end to end."
      overviewPath="/learn/mern"
      certificatePath="/learn/mern/certificate"
      stages={MERN_STAGES}
      quizQuestions={MERN_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
