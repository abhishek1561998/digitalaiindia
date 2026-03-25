import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dai/dashboard-shell";
import { getCurrentUser } from "@/lib/server/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }

  return <DashboardShell user={user} />;
}
