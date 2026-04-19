"use client";

import { useState } from "react";
import VoiceAvatarChat from "@/components/VoiceAvatarChat";
import { avatars } from "@/app/ai-machine-agent/avatars";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";

export default function VoiceChatDemo() {
  return (
    <ConvexClientProvider>
      <VoiceChatDemoContent />
    </ConvexClientProvider>
  );
}

function VoiceChatDemoContent() {
  const [chatId, setChatId] = useState<Id<"chats"> | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const createChat = useMutation(api.chats.create);

  const handleCreateChat = async () => {
    setIsCreatingChat(true);
    try {
      const newChatId = await createChat({
        title: "Voice Demo Chat",
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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />

        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-cyan-400" />
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            AI Voice Assistant Demo
          </h1>

          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Experience real-time voice conversation with our AI agent powered by ElevenLabs and LangGraph.
            Click below to start a new voice chat session.
          </p>

          <Button
            onClick={handleCreateChat}
            disabled={isCreatingChat}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold"
          >
            {isCreatingChat ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Chat...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Voice Chat
              </>
            )}
          </Button>

          <div className="mt-6 text-sm text-slate-500">
            <p>Make sure your microphone is enabled for voice input.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />

      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                AI Voice Assistant Demo
              </h1>
              <p className="text-slate-400 mt-1">
                Real-time voice conversation powered by ElevenLabs & LangGraph
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Demo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 h-[calc(100vh-80px)] p-6">
        <VoiceAvatarChat
          chatId={chatId}
          avatars={[...avatars]}
          className="h-full"
        />
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="text-center text-sm text-slate-400">
            <p>
              This demo integrates ElevenLabs voice AI with LangGraph conversation flow.
              <br />
              Make sure your microphone is enabled for voice input.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
