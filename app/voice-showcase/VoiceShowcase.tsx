"use client";

import { useState } from "react";
import VoiceAvatarChat from "@/components/VoiceAvatarChat";
import { avatars } from "@/app/ai-machine-agent/avatars";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  Volume2,
  Zap,
  Globe2,
  Settings,
  MessageSquare,
  RotateCcw,
} from "lucide-react";
import ThemeBackdrop from "../ai-machine-agent/ThemeBackdrop";
import FuturisticHeader from "@/components/FuturisticHeader";

export default function VoiceShowcase() {
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createChat = useMutation(api.chats.create);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChatId = await createChat({ title: "Voice Showcase Chat" });
      setChatId(newChatId);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  if (!chatId) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FuturisticHeader />
      <br/>
      <br/>
   
        <ThemeBackdrop />

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="max-w-6xl mx-auto px-8 py-12 text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-orange-400 bg-clip-text text-transparent tracking-tight">
                AI Voice Showcase
              </h1>
              <p className="text-lg md:text-xl text-amber-50/90 max-w-2xl mx-auto leading-relaxed">
                Experience natural voice conversations with AI avatars powered by ElevenLabs & LangGraph
              </p>
            </div>

          <div className="flex-1 py-16">
            <div className="max-w-6xl mx-auto px-8">
              {/* Avatars */}
              <div className="mb-14">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your AI Avatar</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {avatars.map((avatar) => (
                    <Card
                      key={avatar.id}
                      className="group relative p-8 bg-gradient-to-br from-white/5 to-white/3 border-2 border-amber-600/40 hover:border-amber-500/60 hover:bg-amber-500/10 transition-all duration-300 text-center backdrop-blur-sm shadow-lg shadow-amber-500/10"
                    >
                      <div className="relative mb-5">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-500/50 group-hover:border-amber-400 transition-colors">
                          <img
                            src={avatar.src}
                            alt={avatar.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-500/30 ring-2 ring-white/20">
                          <Volume2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white">{avatar.name}</h3>
                      <p className="text-slate-400 text-sm uppercase tracking-wide">{avatar.language}</p>

                      <div className="mt-4 inline-flex items-center gap-2 text-xs text-amber-300/90">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span>Voice Ready</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Button
                  onClick={handleCreateChat}
                  disabled={isCreatingChat}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ring-2 ring-amber-400/20 hover:ring-amber-400/40"
                >
                  {isCreatingChat ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Creating Voice Chat...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      Start Voice Conversation
                    </>
                  )}
                </Button>
              </div>
                <br/>
                <br/>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14">
                <Card className="p-6 bg-white/5 border border-amber-600/20 hover:bg-amber-500/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Real-time Voice</h3>
                  <p className="text-amber-100/80 text-sm">Low-latency STT & TTS</p>
                </Card>

                <Card className="p-6 bg-white/5 border border-amber-600/20 hover:bg-amber-500/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">AI Conversation</h3>
                  <p className="text-amber-100/80 text-sm">Tool-use & memory</p>
                </Card>

                <Card className="p-6 bg-white/5 border border-amber-600/20 hover:bg-amber-500/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Voice Settings</h3>
                  <p className="text-amber-100/80 text-sm">Timbre & stability</p>
                </Card>

                <Card className="p-6 bg-white/5 border border-amber-600/20 hover:bg-amber-500/10 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Globe2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">Multilingual</h3>
                  <p className="text-amber-100/80 text-sm">Global accents</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------ CHAT VIEW ------------------------------- */
  return (
    <ConvexClientProvider>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Dark base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Subtle AI glow effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-2xl" />
        </div>

        {/* Soft radial overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(251,191,36,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(249,115,22,0.15),transparent_50%)]" />

        {/* Header */}
        <div className="relative z-10 border-b border-amber-500/20">
          <div className="max-w-6xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Voice Showcase</h1>
                  <p className="text-amber-100/90 text-sm">Live voice conversation with AI avatars</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-amber-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Live Voice Chat</span>
                </div>
                <Button
                  onClick={() => setChatId(null)}
                  variant="outline"
                  className="border-amber-600/50 text-amber-200 hover:bg-amber-500/10 hover:border-amber-500"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Back to Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div className="relative z-10 flex-1 h-[calc(100vh-88px)] p-8">
          <div className="h-full max-w-6xl mx-auto">
            <VoiceAvatarChat
              chatId={chatId}
              avatars={[...avatars]}
              className="h-full rounded-xl border border-amber-500/20 bg-slate-800/30 backdrop-blur-sm"
            />
          </div>
        </div>
      </main>
    </ConvexClientProvider>
  );
}
