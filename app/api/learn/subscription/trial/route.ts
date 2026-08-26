import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/auth";

const TRIAL_DAYS = 7;

// Starts the free trial. No card, no provider — the row simply flips to
// "trialing" with an end date, and every gate in the app reads that. A user
// who has already trialled or subscribed gets their existing state back
// rather than a fresh 7 days.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (existing && existing.status !== "none") {
    return NextResponse.json({
      subscription: existing,
      alreadyUsed: true,
      message:
        existing.status === "trialing"
          ? "Your trial is already running."
          : "You already have a subscription on this account.",
    });
  }

  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 86_400_000);

  const subscription = await prisma.subscription.upsert({
    where: { userId: user.id },
    create: { userId: user.id, status: "trialing", interval: "annual", trialEndsAt },
    update: { status: "trialing", trialEndsAt },
  });

  return NextResponse.json({ subscription, alreadyUsed: false });
}
