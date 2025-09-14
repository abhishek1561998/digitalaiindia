"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import VoiceLoading from "./VoiceLoading";
import VoiceErrorBoundary from "./VoiceErrorBoundary";

interface VoiceMobileProps {
  onMessage: (message: string) => void;
  onResponse: (response: string) => void;
  isProcessing?: boolean;
  className?: string;
}

export default function VoiceMobile({ 
  onMessage, 
  onResponse, 
  isProcessing = false,
  className 
}: VoiceMobileProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStage, setInitStage] = useState<"initializing" | "checking-microphone" | "testing-audio" | "ready" | "error">("initializing");
  const [initError, setInitError] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize voice system
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        setInitStage("initializing");
        await new Promise(resolve => setTimeout(resolve, 1000));

        setInitStage("checking-microphone");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());

        setInitStage("testing-audio");
        await new Promise(resolve => setTimeout(resolve, 1000));

        setInitStage("ready");
        setIsInitializing(false);
      } catch (error) {
        console.error("Voice initialization error:", error);
        setInitError(error instanceof Error ? error.message : "Failed to initialize voice system");
        setInitStage("error");
        setIsInitializing(false);
      }
    };

    initializeVoice();
  }, []);

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
  const speakText = async (text: string) => {
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

  if (isInitializing) {
    return (
      <VoiceErrorBoundary>
        <VoiceLoading stage={initStage} error={initError} className={className} />
      </VoiceErrorBoundary>
    );
  }

  if (initStage === "error") {
    return (
      <VoiceErrorBoundary>
        <Card className={cn("p-6 bg-red-500/10 border-red-500/20 text-center", className)}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <MicOff className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Voice Not Available
          </h3>
          <p className="text-slate-400 mb-4">
            Voice features are not available on this device.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6"
          >
            Retry
          </Button>
        </Card>
      </VoiceErrorBoundary>
    );
  }

  return (
    <VoiceErrorBoundary>
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        {/* Audio element for playback */}
        <audio ref={audioRef} className="hidden" />
        
        {/* Mobile-optimized voice visualization */}
        <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400/30 bg-black/50 flex items-center justify-center">
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

        {/* Mobile-optimized controls */}
        <div className="flex flex-col items-center space-y-3">
          {!isListening ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing || isSpeaking}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-full text-lg font-semibold"
            >
              <Mic className="w-5 h-5 mr-2" />
              Tap to Speak
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold"
            >
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          )}
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4 text-sm">
            {isSpeaking && (
              <div className="flex items-center space-x-2 text-cyan-400">
                <Volume2 className="w-4 h-4 animate-pulse" />
                <span>Speaking...</span>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-optimized status text */}
        <div className="text-center text-sm text-slate-400 px-4">
          {isListening && "Listening... Speak clearly"}
          {isSpeaking && "AI is speaking"}
          {isProcessing && "Processing your message..."}
          {!isListening && !isSpeaking && !isProcessing && "Tap the microphone to start voice conversation"}
        </div>

        {/* Mobile tips */}
        <div className="text-xs text-slate-500 text-center px-4">
          <p>💡 Hold your device close and speak clearly</p>
          <p>🔊 Make sure your volume is up to hear responses</p>
        </div>
      </div>
    </VoiceErrorBoundary>
  );
}
