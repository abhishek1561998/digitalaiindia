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
import { Mic, Volume2, Zap, Globe2, Settings, MessageSquare } from "lucide-react";

export default function VoiceShowcase() {
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createChat = useMutation(api.chats.create);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChatId = await createChat({
        title: "Voice Showcase Chat",
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-red-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  AI Voice Showcase
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                  Experience the complete voice AI system with avatars, real-time conversation, 
                  and advanced voice settings powered by ElevenLabs and LangGraph.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="flex-1 py-12">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-time Voice</h3>
                  <p className="text-slate-400 text-sm">
                    Natural speech-to-text and text-to-speech with live audio visualization
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Conversation</h3>
                  <p className="text-slate-400 text-sm">
                    Powered by LangGraph with tool integration and conversation memory
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Voice Settings</h3>
                  <p className="text-slate-400 text-sm">
                    Customize voice parameters, stability, and similarity boost
                  </p>
                </Card>

                <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center mb-4">
                    <Globe2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Multilingual</h3>
                  <p className="text-slate-400 text-sm">
                    Support for multiple languages and regional accents
                  </p>
                </Card>
              </div>

              {/* Avatar Preview */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">Choose Your AI Avatar</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {avatars.map((avatar) => (
                    <Card key={avatar.id} className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-cyan-400/30">
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{avatar.name}</h3>
                      <p className="text-slate-400 text-sm mb-2">{avatar.language}</p>
                      <div className="flex items-center justify-center space-x-2 text-xs text-cyan-400">
                        <Volume2 className="w-3 h-3" />
                        <span>Voice Ready</span>
                      </div>
                    </Card>
                  ))}
                </div>
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
                      Creating Voice Chat...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-3" />
                      Start Voice Conversation
                    </>
                  )}
                </Button>
                
                <div className="mt-6 text-sm text-slate-500">
                  <p>Make sure your microphone is enabled for voice input.</p>
                  <p>This demo uses ElevenLabs for high-quality voice synthesis.</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-yellow-900/20 to-red-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
        
        {/* Header */}
        <div className="relative z-10 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  AI Voice Showcase
                </h1>
                <p className="text-slate-400 mt-1">
                  Complete voice AI experience with avatars and real-time conversation
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Live Voice Chat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 h-[calc(100vh-80px)] p-6">
          <VoiceAvatarChat 
            chatId={chatId}
            avatars={[...avatars]}
            className="h-full" 
          />
        </div>

        {/* Footer info */}
        <div className="relative z-10 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="text-center text-sm text-slate-400">
              <p>
                Powered by ElevenLabs voice AI, LangGraph conversation flow, and Convex database.
                <br />
                Experience natural voice conversation with customizable avatars and settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </ConvexClientProvider>
  );
}
