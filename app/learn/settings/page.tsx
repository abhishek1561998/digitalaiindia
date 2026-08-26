import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/dai/learn-app/AppShell";
import { LearnSettings } from "@/components/dai/learn-app/LearnSettings";
import { getCurrentUser } from "@/lib/server/auth";
import { getLearnerState } from "@/lib/server/learn-state";
import { getPreferences } from "@/lib/server/learn-preferences";

export const metadata: Metadata = {
  title: "Settings | DigitalAIIndia Learn",
  description: "Appearance, sound, narration and email preferences for DigitalAIIndia Learn.",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth?redirect=/learn/settings");

  const [state, preferences] = await Promise.all([
    getLearnerState(user.id),
    getPreferences(user.id),
  ]);

  return (
    <AppShell
      active="none"
      user={{ name: user.name, email: user.email }}
      state={state}
      preferences={preferences}
      promo={false}
    >
      <LearnSettings
        name={user.name}
        email={user.email}
        premiumActive={state.premium.active}
        premiumStatus={state.premium.status}
      />
    </AppShell>
  );
}
