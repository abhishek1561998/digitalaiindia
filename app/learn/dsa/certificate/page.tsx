import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

export const metadata: Metadata = {
  title: "Certificate — Patterns, Not Problems | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn DSA track.",
};

export default async function LearnDsaCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/dsa/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "dsa" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/dsa/course");
  }

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-DSA-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="dsa"
        coursePath="/learn/dsa/course"
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
      trackTitle="Patterns, Not Problems."
      coursePath="/learn/dsa/course"
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
