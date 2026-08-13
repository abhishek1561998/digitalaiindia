import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminEmail } from "@/lib/server/auth";

// Owner-only: flips a pending certificate payment to "paid" after manually
// checking the UPI transaction reference actually landed. GET lists what's
// waiting; POST approves one.
export async function GET() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const pending = await prisma.trackEnrollment.findMany({
    where: { paymentStatus: "pending" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { paymentSubmittedAt: "asc" },
  });

  return NextResponse.json({ pending });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const enrollmentId = String(body.enrollmentId || "").trim();
  if (!enrollmentId) {
    return NextResponse.json({ error: "enrollmentId is required" }, { status: 400 });
  }

  const updated = await prisma.trackEnrollment.update({
    where: { id: enrollmentId },
    data: { paymentStatus: "paid" },
  });

  return NextResponse.json({ enrollment: updated });
}
