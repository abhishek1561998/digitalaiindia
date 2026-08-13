import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

// Learner submits their UPI transaction reference after paying — this
// marks the certificate as "pending" for manual verification. There's no
// payment-gateway webhook here (no gateway account exists yet), so a real
// human confirms the transfer landed before flipping it to "paid".
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const trackId = String(body.trackId || "").trim();
  const paymentRef = String(body.paymentRef || "").trim();
  if (!trackId || !paymentRef || paymentRef.length < 4) {
    return NextResponse.json({ error: "A valid transaction reference is required" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.findUnique({
    where: { userId_trackId: { userId: user.id, trackId } },
  });
  if (!enrollment || !enrollment.completedAt) {
    return NextResponse.json({ error: "Complete the course before submitting payment" }, { status: 400 });
  }
  if (enrollment.paymentStatus === "paid") {
    return NextResponse.json({ enrollment });
  }

  const updated = await prisma.trackEnrollment.update({
    where: { id: enrollment.id },
    data: { paymentStatus: "pending", paymentRef, paymentSubmittedAt: new Date() },
  });

  return NextResponse.json({ enrollment: updated });
}
