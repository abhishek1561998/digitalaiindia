import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { SYSDESIGN_STAGES, SYSDESIGN_QUIZ_QUESTIONS } from "@/lib/tracks/sysdesign-track";

export const metadata: Metadata = {
  title: "Defend Every Box You Draw — Course | DigitalAIIndia Learn",
  description: "Work through the track stage by stage — with quizzes and points.",
};

export default async function LearnSysdesignCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/system-design/course");
  }

  return (
    <LearnCourseLanding
      trackId="sysdesign"
      trackTitle="Defend every box you draw."
      overviewPath="/learn/system-design"
      certificatePath="/learn/system-design/certificate"
      stages={SYSDESIGN_STAGES}
      quizQuestions={SYSDESIGN_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
