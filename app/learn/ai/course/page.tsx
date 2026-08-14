import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { AI_STAGES, AI_QUIZ_QUESTIONS } from "@/lib/tracks/ai-track";

export const metadata: Metadata = {
  title: "AI Engineering Course — DigitalAIIndia Learn",
  description: "Work through the AI engineering track stage by stage — build a real RAG pipeline, with quizzes and points.",
};

export default async function LearnAiCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/ai/course");
  }

  return (
    <LearnCourseLanding
      trackId="ai"
      trackTitle="Ship AI that actually works."
      overviewPath="/learn/ai"
      certificatePath="/learn/ai/certificate"
      stages={AI_STAGES}
      quizQuestions={AI_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
