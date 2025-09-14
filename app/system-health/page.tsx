import type { Metadata } from "next";
import SystemHealthDashboard from "./SystemHealthDashboard";

export const metadata: Metadata = {
  title: "System Health — Voice AI System",
  description: "Comprehensive system health monitoring, testing, and optimization dashboard",
};

export default function SystemHealthPage() {
  return <SystemHealthDashboard />;
}
