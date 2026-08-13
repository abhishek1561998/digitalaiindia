import { redirect } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";
import { CertificateView } from "@/components/dai/CertificateView";
import { PaymentGate } from "@/components/dai/PaymentGate";
import { buildUpiQrDataUrl, UPI_VPA, CERT_AMOUNT_INR } from "@/lib/server/upi";

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

  if (enrollment.paymentStatus !== "paid") {
    const qrDataUrl = await buildUpiQrDataUrl(`DAI-JS-${user.id.slice(-6)}`);
    return (
      <PaymentGate
        trackId="js"
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
      trackTitle="JavaScript, Properly."
      points={enrollment.points}
      completedAt={enrollment.completedAt.toISOString()}
      certificateId={enrollment.id}
    />
  );
}
