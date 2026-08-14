import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdminEmail } from "@/lib/server/auth";
import { sendCertificateReadyEmail } from "@/lib/server/email";

const TRACK_META: Record<string, { title: string; certPath: string }> = {
  js: { title: "JavaScript, Properly.", certPath: "/learn/javascript/certificate" },
  dsa: { title: "Patterns, Not Problems.", certPath: "/learn/dsa/certificate" },
  mern: { title: "A Real App, End to End.", certPath: "/learn/mern/certificate" },
  ai: { title: "Ship AI That Actually Works.", certPath: "/learn/ai/certificate" },
  sysdesign: { title: "Defend Every Box You Draw.", certPath: "/learn/system-design/certificate" },
  project: { title: "Finish Something Real.", certPath: "/learn/project-building/certificate" },
  uiux: { title: "Design You Can Defend.", certPath: "/learn/ui-ux/certificate" },
  aws: { title: "AWS, Without the Fog.", certPath: "/learn/aws/certificate" },
};

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
    include: { user: { select: { name: true, email: true } } },
  });

  const meta = TRACK_META[updated.trackId];
  if (meta) {
    await sendCertificateReadyEmail({
      userName: updated.user.name,
      userEmail: updated.user.email,
      trackTitle: meta.title,
      certificateUrl: `https://learn.digitalaiindia.com${meta.certPath.replace("/learn", "")}`,
    });
  }

  return NextResponse.json({ enrollment: updated });
}
