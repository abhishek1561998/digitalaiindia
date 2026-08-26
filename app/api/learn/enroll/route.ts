import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, LEARN_REQUIRES_GOOGLE_ERROR } from "@/lib/server/auth";
import { validTrack } from "@/lib/server/validate";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.authProvider !== "google") {
    return NextResponse.json(
      { error: LEARN_REQUIRES_GOOGLE_ERROR, message: "Sign in with Google to enroll — certificates are tied to a verified identity." },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const trackId = validTrack(body.trackId);
  if (!trackId) {
    return NextResponse.json({ error: "Unknown track" }, { status: 400 });
  }

  const enrollment = await prisma.trackEnrollment.upsert({
    where: { userId_trackId: { userId: user.id, trackId } },
    update: {},
    create: { userId: user.id, trackId },
  });

  return NextResponse.json({ enrollment });
}
