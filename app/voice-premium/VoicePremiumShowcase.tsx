"use client";

import { useState } from "react";
import VoiceAvatarChat from "@/components/VoiceAvatarChat";
import VoiceAnalytics from "@/components/VoiceAnalytics";
import VoiceMobile from "@/components/VoiceMobile";
import { avatars } from "@/app/ai-machine-agent/avatars";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Volume2, Zap, Globe2, Settings, MessageSquare, BarChart3, Smartphone, Shield, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoicePremiumShowcase() {
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [activeTab, setActiveTab] = useState<"desktop" | "mobile" | "analytics">("desktop");
  const createChat = useMutation(api.chats.create);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChatId = await createChat({
        title: "Premium Voice Showcase Chat",
      });
      setChatId(newChatId);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (!chatId) {
    return (
      <main className="min-h-screen bg-black text-white">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  Premium Voice AI
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Advanced voice AI system with analytics, mobile optimization, error handling, 
                  and professional-grade features powered by ElevenLabs and LangGraph.
                </p>
              </div>
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="flex-1 py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Advanced Voice</h3>
                  <p className="text-slate-400 text-sm">
                    Professional-grade speech recognition and synthesis with real-time processing
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Voice Analytics</h3>
                  <p className="text-slate-400 text-sm">
                    Real-time metrics, accuracy tracking, and conversation insights
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mobile Optimized</h3>
                  <p className="text-slate-400 text-sm">
                    Touch-friendly interface with mobile-specific voice controls
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Error Handling</h3>
                  <p className="text-slate-400 text-sm">
                    Robust error boundaries and graceful fallbacks for reliability
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Voice Settings</h3>
                  <p className="text-slate-400 text-sm">
                    Professional voice customization with stability and similarity controls
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Production Ready</h3>
                  <p className="text-slate-400 text-sm">
                    Scalable architecture with monitoring and performance optimization
                  </p>
                </Card>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  onClick={handleCreateChat}
                  disabled={isCreatingChat}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  {isCreatingChat ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Creating Premium Chat...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      Start Premium Voice Experience
                    </>
                  )}
                </Button>
                
                <div className="mt-6 text-sm text-slate-500">
                  <p>Experience the complete premium voice AI system with all advanced features.</p>
                  <p>Includes analytics, mobile optimization, and professional error handling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <ConvexClientProvider>
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
                  Premium Voice AI Showcase
                </h1>
                <p className="text-slate-400 mt-1">
                  Advanced voice AI with analytics, mobile optimization, and professional features
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Premium Features Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex space-x-1">
              <Button
                onClick={() => setActiveTab("desktop")}
                variant={activeTab === "desktop" ? "default" : "ghost"}
                className={cn(
                  "px-6 py-3",
                  activeTab === "desktop"
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Desktop Experience
              </Button>
              <Button
                onClick={() => setActiveTab("mobile")}
                variant={activeTab === "mobile" ? "default" : "ghost"}
                className={cn(
                  "px-6 py-3",
                  activeTab === "mobile"
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : "text-slate-400 hover:text-white"
                )}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Optimized
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
                Voice Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 h-[calc(100vh-160px)] p-6">
          {activeTab === "desktop" && (
            <VoiceAvatarChat 
              chatId={chatId}
              avatars={[...avatars]}
              className="h-full" 
            />
          )}
          
          {activeTab === "mobile" && (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-md w-full">
                <VoiceMobile
                  onMessage={(message) => console.log("Mobile message:", message)}
                  onResponse={(response) => console.log("Mobile response:", response)}
                  className="h-full"
                />
              </div>
            </div>
          )}
          
          {activeTab === "analytics" && (
            <div className="h-full flex items-center justify-center">
              <div className="max-w-2xl w-full">
                <VoiceAnalytics chatId={chatId} className="h-full" />
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="text-center text-sm text-slate-400">
              <p>
                Premium Voice AI powered by ElevenLabs, LangGraph, and Convex.
                <br />
                Features advanced analytics, mobile optimization, and professional error handling.
              </p>
            </div>
          </div>
        </div>
      </main>
    </ConvexClientProvider>
  );
}
