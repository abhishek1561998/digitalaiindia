import { redirect } from "next/navigation";
import { getCurrentUser, isAdminEmail } from "@/lib/server/auth";
import { prisma } from "@/lib/prisma";
import { PaymentsAdmin } from "./PaymentsAdmin";

export default async function AdminPaymentsPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    redirect("/auth");
  }

  const pending = await prisma.trackEnrollment.findMany({
    where: { paymentStatus: "pending" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { paymentSubmittedAt: "asc" },
  });

  const serialized = pending.map((p) => ({
    id: p.id,
    trackId: p.trackId,
    paymentRef: p.paymentRef,
    paymentSubmittedAt: p.paymentSubmittedAt?.toISOString() ?? null,
    userName: p.user.name,
    userEmail: p.user.email,
  }));

  return <PaymentsAdmin initialPending={serialized} />;
}
