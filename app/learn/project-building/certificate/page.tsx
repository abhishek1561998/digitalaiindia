import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { getTrackStageCount } from "@/lib/server/quiz-registry";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

export const metadata: Metadata = {
  title: "Certificate — Finish Something Real | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn track.",
};

export default async function LearnProjectCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/project-building/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "project" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/project-building/course");
  }

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-PRJ-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="project"
        coursePath="/learn/project-building/course"
        qrDataUrl={qrDataUrl}
        upiId={UPI_VPA}
        amount={CERT_AMOUNT_INR}
        status={enrollment.paymentStatus as "unpaid" | "pending"}
      />
    );
  }

  return (
    <CertificateView
      userName={user.name}
      totalStages={getTrackStageCount("project")}
      trackTitle="Finish Something Real."
      coursePath="/learn/project-building/course"
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
