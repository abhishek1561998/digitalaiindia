import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/auth";
import { getUserUsageSummary } from "@/lib/server/usage";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getUserUsageSummary(user.id);
  if (!summary) {
    return NextResponse.json({ error: "Summary unavailable" }, { status: 404 });
  }

  return NextResponse.json({ user, summary });
}
