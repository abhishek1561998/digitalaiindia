"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceConversationProps {
  onMessage: (message: string) => void;
  onResponse: (response: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function VoiceConversation({ 
  onMessage, 
  onResponse, 
  isProcessing = false,
  className 
}: VoiceConversationProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        if (analyserRef.current && isRecording) {
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
  }, [isRecording]);

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
      setIsRecording(true);
      setIsListening(true);
      await initializeAudio();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [initializeAudio]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
      setAudioLevel(0);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isRecording]);

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
        onMessage(result.text);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  // Convert text to speech
  const speakText = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const response = await fetch('/api/voice/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
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
  }, []);

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
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      {/* Audio element for playback */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Voice visualization */}
      <div className="relative w-32 h-32 rounded-full border-4 border-cyan-400/30 bg-black/50 flex items-center justify-center">
        <div 
          className={cn(
            "absolute inset-0 rounded-full transition-all duration-300",
            isRecording ? "bg-cyan-400/20 animate-pulse" : "bg-transparent"
          )}
          style={{
            transform: `scale(${1 + audioLevel * 0.5})`,
          }}
        />
        
        {/* Microphone icon */}
        <div className="relative z-10">
          {isListening ? (
            <MicOff className="w-8 h-8 text-red-400" />
          ) : (
            <Mic className="w-8 h-8 text-cyan-400" />
          )}
        </div>
        
        {/* Audio level indicator */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/50 animate-ping" />
        )}
      </div>

      {/* Controls */}
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
        
        {isProcessing && (
          <div className="flex items-center space-x-2 text-yellow-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Processing...</span>
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
  );
}
