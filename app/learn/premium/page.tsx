import { Metadata } from "next";
import { PremiumFlow } from "@/components/dai/learn-app/PremiumFlow";
import { PreferencesProvider } from "@/components/dai/learn-app/PreferencesProvider";
import { learnFonts } from "@/components/dai/learn-app/fonts";
import shell from "@/components/dai/learn-app/learn-app.module.css";
import { getCurrentUser } from "@/lib/server/auth";
import { getLearnerState } from "@/lib/server/learn-state";
import { getPreferences } from "@/lib/server/learn-preferences";
import { guestState } from "@/lib/learn/guest-state";
import { PLANS, TRIAL_DAYS } from "@/lib/learn/pricing";

export const metadata: Metadata = {
  title: `Premium — every track for ₹${PLANS.annual.amount} a year | DigitalAIIndia Learn`,
  description:
    `One subscription unlocks every DigitalAIIndia Learn track, every interactive lesson and project, ₹${PLANS.annual.amount} a year, ${TRIAL_DAYS} days free.`,
  alternates: { canonical: "https://learn.digitalaiindia.com/learn/premium" },
};

// The upsell runs without the app chrome on purpose — it's a takeover, so
// there's nowhere to wander off to except the close button.
export default async function PremiumPage() {
  const user = await getCurrentUser();
  const [state, preferences] = user
    ? await Promise.all([getLearnerState(user.id), getPreferences(user.id)])
    : [guestState(), await getPreferences(null)];

  return (
    <div className={`${shell.app} ${learnFonts}`}>
      <PreferencesProvider initial={preferences} signedIn={Boolean(user)}>
        <PremiumFlow
          premiumActive={state.premium.active}
          signedIn={Boolean(user)}
          trialUsed={state.premium.status !== "none"}
        />
      </PreferencesProvider>
    </div>
  );
}
