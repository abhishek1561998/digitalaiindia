import { redirect } from "next/navigation";
import { Metadata } from "next";
import { LearnCourseLanding } from "@/components/dai/learn-js-course-landing";
import { getCurrentUser } from "@/lib/server/auth";
import { AWS_STAGES, AWS_QUIZ_QUESTIONS } from "@/lib/tracks/aws-track";

export const metadata: Metadata = {
  title: "AWS Course — DigitalAIIndia Learn",
  description: "Work through the AWS track stage by stage — every step written out, with quizzes and points.",
};

export default async function LearnAwsCoursePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/aws/course");
  }

  return (
    <LearnCourseLanding
      trackId="aws"
      trackTitle="AWS, without the fog."
      overviewPath="/learn/aws"
      certificatePath="/learn/aws/certificate"
      stages={AWS_STAGES}
      quizQuestions={AWS_QUIZ_QUESTIONS}
      userName={user.name}
    />
  );
}
