"use client";

import { useState } from "react";
import VoicePerformanceBenchmark from "@/components/VoicePerformanceBenchmark";
import VoiceSystemOptimizer from "@/components/VoiceSystemOptimizer";
import VoiceAccessibility from "@/components/VoiceAccessibility";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Settings, 
  Accessibility, 
  BarChart3, 
  Zap, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Database,
  Network,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SystemHealthDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "benchmark" | "optimizer" | "accessibility">("overview");

  const systemHealth = {
    overall: 95,
    voiceProcessing: 98,
    aiConversation: 92,
    database: 96,
    network: 89,
    security: 100,
    accessibility: 85,
    performance: 91,
  };

  const recentTests = [
    { name: "Speech-to-Text Latency", result: "1.2s", status: "passed", time: "2 min ago" },
    { name: "Text-to-Speech Generation", result: "2.1s", status: "passed", time: "5 min ago" },
    { name: "Voice Chat Response", result: "3.8s", status: "passed", time: "8 min ago" },
    { name: "Audio Processing", result: "0.8s", status: "passed", time: "12 min ago" },
    { name: "Voice Settings", result: "0.3s", status: "passed", time: "15 min ago" },
  ];

  const optimizationResults = [
    { category: "Audio Processing", score: 95, issues: 1 },
    { category: "Network Optimization", score: 87, issues: 2 },
    { category: "Memory Management", score: 92, issues: 0 },
    { category: "Performance", score: 89, issues: 1 },
  ];

  const accessibilityFeatures = [
    { name: "High Contrast", enabled: true },
    { name: "Large Text", enabled: false },
    { name: "Reduced Motion", enabled: true },
    { name: "Screen Reader", enabled: true },
    { name: "Keyboard Navigation", enabled: true },
    { name: "Voice Guidance", enabled: true },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "failed": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return CheckCircle;
      case "warning": return AlertTriangle;
      case "failed": return AlertTriangle;
      default: return Clock;
    }
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
                System Health Dashboard
              </h1>
              <p className="text-slate-400 mt-1">
                Monitor, test, and optimize your voice AI system
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>System Healthy</span>
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
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              onClick={() => setActiveTab("benchmark")}
              variant={activeTab === "benchmark" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "benchmark"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Benchmark
            </Button>
            <Button
              onClick={() => setActiveTab("optimizer")}
              variant={activeTab === "optimizer" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "optimizer"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Settings className="w-4 h-4 mr-2" />
              Optimizer
            </Button>
            <Button
              onClick={() => setActiveTab("accessibility")}
              variant={activeTab === "accessibility" ? "default" : "ghost"}
              className={cn(
                "px-6 py-3",
                activeTab === "accessibility"
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Accessibility className="w-4 h-4 mr-2" />
              Accessibility
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 p-6">
        {activeTab === "overview" && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.overall}%</div>
                <div className="text-xs text-slate-400">Overall Health</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.voiceProcessing}%</div>
                <div className="text-xs text-slate-400">Voice Processing</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.aiConversation}%</div>
                <div className="text-xs text-slate-400">AI Conversation</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.database}%</div>
                <div className="text-xs text-slate-400">Database</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Network className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.network}%</div>
                <div className="text-xs text-slate-400">Network</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.security}%</div>
                <div className="text-xs text-slate-400">Security</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Accessibility className="w-8 h-8 mx-auto mb-2 text-pink-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.accessibility}%</div>
                <div className="text-xs text-slate-400">Accessibility</div>
              </Card>
              
              <Card className="p-4 bg-white/5 border-white/10 text-center">
                <Cpu className="w-8 h-8 mx-auto mb-2 text-orange-400" />
                <div className="text-2xl font-bold text-white">{systemHealth.performance}%</div>
                <div className="text-xs text-slate-400">Performance</div>
              </Card>
            </div>

            {/* Recent Tests */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Performance Tests</h3>
                <div className="space-y-3">
                  {recentTests.map((test, index) => {
                    const StatusIcon = getStatusIcon(test.status);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className={cn("w-5 h-5", getStatusColor(test.status))} />
                          <div>
                            <div className="text-sm font-medium text-white">{test.name}</div>
                            <div className="text-xs text-slate-400">{test.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">{test.result}</div>
                          <div className={cn("text-xs font-medium", getStatusColor(test.status))}>
                            {test.status}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Optimization Status</h3>
                <div className="space-y-3">
                  {optimizationResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-white">{result.category}</div>
                        <div className="text-xs text-slate-400">
                          {result.issues} {result.issues === 1 ? 'issue' : 'issues'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{result.score}%</div>
                        <div className="text-xs text-slate-400">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Accessibility Status */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Accessibility Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {accessibilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
                    <CheckCircle className={cn(
                      "w-4 h-4",
                      feature.enabled ? "text-green-400" : "text-slate-400"
                    )} />
                    <span className="text-sm text-white">{feature.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "benchmark" && (
          <div className="max-w-4xl mx-auto">
            <VoicePerformanceBenchmark className="h-full" />
          </div>
        )}

        {activeTab === "optimizer" && (
          <div className="max-w-4xl mx-auto">
            <VoiceSystemOptimizer className="h-full" />
          </div>
        )}

        {activeTab === "accessibility" && (
          <div className="max-w-4xl mx-auto">
            <VoiceAccessibility className="h-full" />
          </div>
        )}
      </div>
    </main>
  );
}
