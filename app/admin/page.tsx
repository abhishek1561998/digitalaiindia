import type { Metadata } from "next";
import VoiceAdminDashboard from "./VoiceAdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard — Voice AI System",
  description: "Administrative dashboard for monitoring and managing the voice AI system",
};

export default function AdminPage() {
  return <VoiceAdminDashboard />;
}
