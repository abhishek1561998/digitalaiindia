import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { CertificateView } from "@/components/dai/CertificateView";

export const metadata: Metadata = {
  title: "Certificate — JavaScript, Properly. | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn JavaScript track.",
};

export default async function LearnJsCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/javascript/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "js" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/javascript/course");
  }

  return (
    <CertificateView
      userName={user.name}
      trackTitle="JavaScript, Properly."
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
