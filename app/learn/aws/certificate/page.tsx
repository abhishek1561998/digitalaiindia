import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

export const metadata: Metadata = {
  title: "Certificate — AWS, Without the Fog | DigitalAIIndia Learn",
  description: "Course completion certificate for the DigitalAIIndia Learn AWS track.",
};

export default async function LearnAwsCertificatePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth?redirect=/learn/aws/certificate");
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId: "aws" } },
  });

  if (!enrollment || !enrollment.completedAt) {
    redirect("/learn/aws/course");
  }

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-AWS-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="aws"
        coursePath="/learn/aws/course"
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
      trackTitle="AWS, Without the Fog."
      coursePath="/learn/aws/course"
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
