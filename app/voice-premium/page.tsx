import type { Metadata } from "next";
import VoicePremiumShowcase from "./VoicePremiumShowcase";

export const metadata: Metadata = {
  title: "Premium Voice AI — AI Machine Agent",
  description: "Advanced voice AI showcase with analytics, mobile optimization, and professional features",
};

export default function VoicePremiumPage() {
  return <VoicePremiumShowcase />;
}
