import Link from "next/link";
import { AuthForm } from "@/components/dai/auth-form";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const hasGoogleError = Boolean(params.error);
  const googleReason = params.reason;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_45%,#020617_100%)] px-4 py-16">
      <div className="mx-auto mb-8 flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="text-sm text-slate-300 hover:text-white">
          ← Back to home
        </Link>
      </div>
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">DigitalAIIndia Dashboard Access</h1>
          <p className="mt-4 max-w-md text-slate-300">
            Create an account to generate API keys, test Chat/Voice/3D/Design endpoints, and track monthly usage.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li>JWT-based authentication</li>
            <li>PostgreSQL + Prisma data layer</li>
            <li>Free-tier guardrails (1,000 requests/month)</li>
            <li>Google OAuth sign in supported</li>
          </ul>
          {hasGoogleError ? (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              Google sign-in failed{googleReason ? `: ${googleReason}` : ""}. Please check OAuth config and try again.
            </p>
          ) : null}
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
