import type { Metadata } from "next";
import VoiceShowcase from "./VoiceShowcase";

export const metadata: Metadata = {
  title: "Voice Showcase — AI Machine Agent",
  description: "Complete showcase of voice AI capabilities with avatars, settings, and real-time conversation",
};

export default function VoiceShowcasePage() {
  return <VoiceShowcase />;
}
