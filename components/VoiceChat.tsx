"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import { streamMessageType, streamMessage } from "@/lib/types";
import VoiceSettings from "./VoiceSettings";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

interface VoiceChatProps {
  chatId: Id<"chats">;
  initialMessages?: Message[];
  className?: string;
}

export default function VoiceChat({ 
  chatId, 
  initialMessages = [],
  className 
}: VoiceChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
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
    <div className={cn("flex flex-col h-full max-w-4xl mx-auto bg-black/50 rounded-2xl border border-white/10", className)}>
      {/* Audio element for playback */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Voice Assistant</h2>
            <p className="text-sm text-slate-400">
              {isVoiceMode ? "Voice mode enabled" : "Text mode"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <VoiceSettings onSettingsChange={setVoiceSettings} />
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
            {isVoiceMode ? "Voice On" : "Voice Off"}
          </Button>
        </div>
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

      {/* Voice Controls */}
      {isVoiceMode && (
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-col items-center space-y-4">
            {/* Voice visualization */}
            <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400/30 bg-black/50 flex items-center justify-center">
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
            <div className="flex items-center space-x-4">
              {!isListening ? (
                <Button
                  onClick={startRecording}
                  disabled={isProcessing || isSpeaking}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-full"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Voice Chat
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-full"
                >
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}
              
              {isSpeaking && (
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Volume2 className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">Speaking...</span>
                </div>
              )}
            </div>

            {/* Status text */}
            <div className="text-center text-sm text-slate-400">
              {isListening && "Listening... Speak now"}
              {isSpeaking && "AI is speaking"}
              {isProcessing && "Processing your message..."}
              {!isListening && !isSpeaking && !isProcessing && "Click to start voice conversation"}
            </div>
          </div>
        </div>
      )}

      {/* Text Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-cyan-400"
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
  );
}
