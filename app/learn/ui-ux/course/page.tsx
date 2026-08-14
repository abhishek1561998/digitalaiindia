import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { UIUX_STAGES, UIUX_QUIZ_QUESTIONS } from "@/lib/tracks/uiux-track";

export const metadata: Metadata = {
  title: "UI/UX Course — DigitalAIIndia Learn",
  description: "Work through the UI/UX track stage by stage — with quizzes and points.",
};

export default async function LearnUiuxCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/ui-ux/course");
  }

  return (
    <LearnCourseLanding
      trackId="uiux"
      trackTitle="Design you can defend."
      overviewPath="/learn/ui-ux"
      certificatePath="/learn/ui-ux/certificate"
      stages={UIUX_STAGES}
      quizQuestions={UIUX_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
