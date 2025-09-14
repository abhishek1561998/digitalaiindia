"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { streamMessageType, streamMessage } from "@/lib/types";
import VoiceSettings from "./VoiceSettings";
import Image from "next/image";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface Avatar {
  id: string;
  name: string;
  src: string;
  language: string;
  audio: string;
}

interface VoiceAvatarChatProps {
  chatId: Id<"chats">;
  initialMessages?: Message[];
  avatars?: Avatar[];
  className?: string;
}

export default function VoiceAvatarChat({ 
  chatId, 
  initialMessages = [],
  avatars = [],
  className 
}: VoiceAvatarChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0] || null);
  const [voiceSettings, setVoiceSettings] = useState({
    voiceId: "pNInz6obpgDQGcFmaJgB",
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [isListening]);

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const chunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsListening(true);
      await initializeAudio();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [initializeAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setAudioLevel(0);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isListening]);

  // Process audio and convert to text
  const processAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/voice/speech-to-text', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.text) {
        await sendMessage(result.text, true);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  // Send message to chat API
  const sendMessage = async (messageText: string, isVoice: boolean = false) => {
    if (!messageText.trim()) return;

    setIsProcessing(true);
    
    // Add user message to UI immediately
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
      isVoice,
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/voice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          newMessage: messageText,
          chatId,
          isVoice: isVoiceMode,
          voiceSettings
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let messageId = `assistant-${Date.now()}`;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6)) as streamMessage;
                
                if (data.type === streamMessageType.Token) {
                  assistantMessage += data.token;
                  
                  // Update the assistant message in real-time
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage && lastMessage.role === "assistant") {
                      lastMessage.content = assistantMessage;
                    } else {
                      updated.push({
                        id: messageId,
                        role: "assistant",
                        content: assistantMessage,
                        timestamp: new Date(),
                        isVoice: isVoiceMode,
                      });
                    }
                    return updated;
                  });
                } else if (data.type === streamMessageType.Done) {
                  // Speak the response if in voice mode
                  if (isVoiceMode && assistantMessage) {
                    await speakText(assistantMessage);
                  }
                  break;
                } else if (data.type === streamMessageType.Error) {
                  console.error("Stream error:", data.error);
                  break;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert text to speech
  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const response = await fetch('/api/voice/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          voiceId: voiceSettings.voiceId,
          voiceSettings: {
            stability: voiceSettings.stability,
            similarity_boost: voiceSettings.similarity_boost,
            style: voiceSettings.style,
            use_speaker_boost: voiceSettings.use_speaker_boost
          }
        }),
      });
      
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
        }
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
    }
  };

  // Handle text input
  const handleSendText = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim(), false);
      setInputText("");
    }
  };

  // Toggle voice mode
  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={cn("flex h-full max-w-6xl mx-auto bg-black/50 rounded-2xl border border-white/10", className)}>
      {/* Audio element for playback */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Avatar Section */}
      <div className="w-1/3 border-r border-white/10 p-6">
        <div className="space-y-6">
          {/* Avatar Display */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-cyan-400/30">
              {selectedAvatar && (
                <Image
                  src={selectedAvatar.src}
                  alt={selectedAvatar.name}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Speaking animation */}
              {isSpeaking && (
                <div className="absolute inset-0 bg-cyan-400/20 animate-pulse" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{selectedAvatar?.name}</h3>
            <p className="text-sm text-slate-400">{selectedAvatar?.language}</p>
          </div>

          {/* Avatar Selector */}
          {avatars.length > 1 && (
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Choose Avatar</h4>
              <div className="grid grid-cols-2 gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={cn(
                      "relative rounded-lg overflow-hidden border transition-all",
                      selectedAvatar?.id === avatar.id
                        ? "border-cyan-400 ring-2 ring-cyan-400/50"
                        : "border-white/20 hover:border-white/40"
                    )}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={avatar.src}
                        alt={avatar.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                      <div className="text-xs text-white font-medium">{avatar.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Voice Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Voice Mode</span>
              <Button
                onClick={toggleVoiceMode}
                variant={isVoiceMode ? "default" : "outline"}
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  isVoiceMode 
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white" 
                    : "border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
                )}
              >
                {isVoiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>

            {isVoiceMode && (
              <div className="space-y-3">
                {/* Voice visualization */}
                <div className="relative w-20 h-20 mx-auto rounded-full border-4 border-cyan-400/30 bg-black/50 flex items-center justify-center">
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-300",
                      isListening ? "bg-cyan-400/20 animate-pulse" : "bg-transparent"
                    )}
                    style={{
                      transform: `scale(${1 + audioLevel * 0.5})`,
                    }}
                  />
                  
                  <div className="relative z-10">
                    {isListening ? (
                      <MicOff className="w-6 h-6 text-red-400" />
                    ) : (
                      <Mic className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-400/50 animate-ping" />
                  )}
                </div>

                {/* Voice controls */}
                <div className="flex justify-center">
                  {!isListening ? (
                    <Button
                      onClick={startRecording}
                      disabled={isProcessing || isSpeaking}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-full"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-full"
                    >
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </div>

                {/* Status */}
                <div className="text-center text-sm text-slate-400">
                  {isListening && "Listening... Speak now"}
                  {isSpeaking && "AI is speaking"}
                  {isProcessing && "Processing..."}
                  {!isListening && !isSpeaking && !isProcessing && "Click to start voice chat"}
                </div>
              </div>
            )}
          </div>

          {/* Voice Settings */}
          <VoiceSettings onSettingsChange={setVoiceSettings} />
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Conversation</h2>
          <p className="text-sm text-slate-400">
            {isVoiceMode ? "Voice mode enabled" : "Text mode"}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-slate-400 mb-6">
                {isVoiceMode 
                  ? "Click the microphone to start talking, or type a message below"
                  : "Type a message below or enable voice mode to start talking"
                }
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <Card
                    className={cn(
                      "max-w-[80%] p-4",
                      message.role === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                        : "bg-white/10 text-white border-white/20"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.isVoice && (
                            <span className="text-xs opacity-70 flex items-center">
                              <Mic className="w-3 h-3 mr-1" />
                              Voice
                            </span>
                          )}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Mic className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <Card className="bg-white/10 text-white border-white/20 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span className="text-sm text-slate-300">AI is thinking...</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center space-x-3">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400 rounded-lg px-4 py-2"
              onKeyPress={(e) => e.key === "Enter" && handleSendText()}
              disabled={isProcessing}
            />
            <Button
              onClick={handleSendText}
              disabled={!inputText.trim() || isProcessing}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
