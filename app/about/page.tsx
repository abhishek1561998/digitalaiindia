import { Metadata } from "next";
import { AboutLanding } from "@/components/dai/about-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "About - DigitalAIIndia",
  description: "DigitalAIIndia is an India-first AI company — built with India-first pricing, BYOK by default, and Hindi-native voice AI.",
};

export default async function AboutPage() {
  const user = await getCurrentUser();
  return <AboutLanding isLoggedIn={Boolean(user)} />;
}
