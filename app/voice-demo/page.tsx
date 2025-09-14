import type { Metadata } from "next";
import VoiceChatDemo from "./VoiceChatDemo";

export const metadata: Metadata = {
  title: "Voice Demo — AI Machine Agent",
  description: "Experience real-time voice conversation with our AI agent powered by ElevenLabs",
};

export default function VoiceDemoPage() {
  return <VoiceChatDemo />;
}