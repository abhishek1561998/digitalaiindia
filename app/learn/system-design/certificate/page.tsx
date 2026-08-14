import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { getTrackStageCount } from "@/lib/server/quiz-registry";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

export const metadata: Metadata = {
  title: "Certificate — Defend Every Box You Draw | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn track.",
};

export default async function LearnSysdesignCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/system-design/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "sysdesign" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/system-design/course");
  }

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-SD-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="sysdesign"
        coursePath="/learn/system-design/course"
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
      totalStages={getTrackStageCount("sysdesign")}
      trackTitle="Defend Every Box You Draw."
      coursePath="/learn/system-design/course"
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
