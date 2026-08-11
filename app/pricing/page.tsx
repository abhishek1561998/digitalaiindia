import { Metadata } from "next";
import { PricingLanding } from "@/components/dai/pricing-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Pricing - DigitalAIIndia",
  description: "Simple, transparent pricing for the DigitalAIIndia AI Platform. Start free, upgrade when you're ready.",
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  return <PricingLanding isLoggedIn={Boolean(user)} />;
}
