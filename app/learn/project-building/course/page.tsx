import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { PROJECT_STAGES, PROJECT_QUIZ_QUESTIONS } from "@/lib/tracks/project-track";

export const metadata: Metadata = {
  title: "Finish Something Real — Course | DigitalAIIndia Learn",
  description: "Work through the track stage by stage — with quizzes and points.",
};

export default async function LearnProjectCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/project-building/course");
  }

  return (
    <LearnCourseLanding
      trackId="project"
      trackTitle="Finish something real."
      overviewPath="/learn/project-building"
      certificatePath="/learn/project-building/certificate"
      stages={PROJECT_STAGES}
      quizQuestions={PROJECT_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
