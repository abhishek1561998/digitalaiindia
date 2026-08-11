import { Metadata } from "next";
import { PlatformLanding } from "@/components/dai/platform-landing";
import { getCurrentUser } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "AI Platform - Chat, Voice, 3D & Design APIs | DigitalAIIndia",
  description: "Production-ready APIs for Chat, Voice, 3D and Design. One key, four APIs, free to start.",
};

export default async function PlatformPage() {
  const user = await getCurrentUser();
  return <PlatformLanding isLoggedIn={Boolean(user)} />;
}
