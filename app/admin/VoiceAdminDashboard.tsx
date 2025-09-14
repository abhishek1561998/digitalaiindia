"use client";

import { useState } from "react";
import VoiceAnalytics from "@/components/VoiceAnalytics";
import VoicePerformanceMonitor from "@/components/VoicePerformanceMonitor";
import VoiceSecurityConfig from "@/components/VoiceSecurityConfig";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Activity, 
  Shield, 
  Settings, 
  Users, 
  MessageSquare, 
  Mic, 
  Volume2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoiceAdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "performance" | "security">("overview");

  const systemStats = {
    totalUsers: 1247,
    activeSessions: 89,
    totalMessages: 15632,
    voiceMessages: 11245,
    averageResponseTime: 2.3,
    systemUptime: 99.8,
    errorRate: 0.2,
    satisfactionScore: 4.6,
  };

  const recentActivity = [
    { type: "voice", user: "User_001", action: "Started voice chat", time: "2 min ago", status: "success" },
    { type: "text", user: "User_002", action: "Sent message", time: "3 min ago", status: "success" },
    { type: "voice", user: "User_003", action: "Voice processing", time: "4 min ago", status: "success" },
    { type: "error", user: "User_004", action: "API timeout", time: "5 min ago", status: "error" },
    { type: "voice", user: "User_005", action: "Completed session", time: "6 min ago", status: "success" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "voice": return Mic;
      case "text": return MessageSquare;
      case "error": return AlertTriangle;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    return status === "success" ? "text-green-400" : "text-red-400";
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
      
      {/* Header */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Voice AI Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Monitor and manage your voice AI system
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <Button
              onClick={() => setActiveTab("overview")}
              variant={activeTab === "overview" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "overview"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("analytics")}
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "analytics"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              onClick={() => setActiveTab("performance")}
              variant={activeTab === "performance" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "performance"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Activity className="w-4 h-4 mr-2" />
              Performance
            </Button>
            <Button
              onClick={() => setActiveTab("security")}
              variant={activeTab === "security" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "security"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Shield className="w-4 h-4 mr-2" />
              Security
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 p-6">
        {activeTab === "overview" && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-white">{systemStats.totalUsers.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Total Users</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{systemStats.activeSessions}</div>
                <div className="text-xs text-slate-400">Active Sessions</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{systemStats.totalMessages.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Total Messages</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Mic className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{systemStats.voiceMessages.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Voice Messages</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">{systemStats.averageResponseTime}s</div>
                <div className="text-xs text-slate-400">Avg Response</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{systemStats.systemUptime}%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <div className="text-2xl font-bold text-white">{systemStats.errorRate}%</div>
                <div className="text-xs text-slate-400">Error Rate</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">{systemStats.satisfactionScore}/5</div>
                <div className="text-xs text-slate-400">Satisfaction</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        <Icon className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{activity.user}</div>
                          <div className="text-xs text-slate-400">{activity.action}</div>
                        </div>
                        <div className="text-right">
                          <div className={cn("text-xs font-medium", getActivityColor(activity.status))}>
                            {activity.status}
                          </div>
                          <div className="text-xs text-slate-400">{activity.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Voice Processing</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">AI Conversation</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Database</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">External APIs</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="max-w-4xl mx-auto">
            <VoiceAnalytics chatId="admin-dashboard" className="h-full" />
          </div>
        )}

        {activeTab === "performance" && (
          <div className="max-w-4xl mx-auto">
            <VoicePerformanceMonitor realTime={true} className="h-full" />
          </div>
        )}

        {activeTab === "security" && (
          <div className="max-w-4xl mx-auto">
            <VoiceSecurityConfig className="h-full" />
          </div>
        )}
      </div>
    </main>
  );
}
