import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser, isAdminEmail } from "@/lib/server/auth";
import { getAdminStats } from "@/lib/server/admin-stats";
import { AdminStatsView } from "@/components/dai/learn-app/AdminStatsView";

export const metadata: Metadata = {
  title: "Stats | DigitalAIIndia",
  robots: { index: false, follow: false },
};

export default async function AdminStatsPage() {
  const user = await getCurrentUser();
  // 404 rather than 403: an admin page shouldn't confirm it exists to
  // someone who isn't one.
  if (!user || !isAdminEmail(user.email)) notFound();

  const stats = await getAdminStats(30);
  return <AdminStatsView stats={stats} />;
}
