import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { getTrackStageCount } from "@/lib/server/quiz-registry";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

export const metadata: Metadata = {
  title: "Certificate — Design You Can Defend | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn UI/UX track.",
};

export default async function LearnUiuxCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/ui-ux/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "uiux" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/ui-ux/course");
  }

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-UX-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="uiux"
        coursePath="/learn/ui-ux/course"
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
      totalStages={getTrackStageCount("uiux")}
      trackTitle="Design You Can Defend."
      coursePath="/learn/ui-ux/course"
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
