"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mic, Volume2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceLoadingProps {
  stage: "initializing" | "checking-microphone" | "testing-audio" | "ready" | "error";
  error?: string;
  className?: string;
}

const loadingMessages = {
  initializing: "Initializing voice system...",
  "checking-microphone": "Checking microphone access...",
  "testing-audio": "Testing audio capabilities...",
  ready: "Voice system ready!",
  error: "Voice system error"
};

const loadingIcons = {
  initializing: Loader2,
  "checking-microphone": Mic,
  "testing-audio": Volume2,
  ready: CheckCircle,
  error: XCircle
};

export default function VoiceLoading({ stage, error, className }: VoiceLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const progressMap = {
      initializing: 20,
      "checking-microphone": 40,
      "testing-audio": 70,
      ready: 100,
      error: 0
    };
    
    setProgress(progressMap[stage]);
  }, [stage]);

  useEffect(() => {
    if (stage === "ready" || stage === "error") return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    return () => clearInterval(interval);
  }, [stage]);

  const Icon = loadingIcons[stage];
  const message = loadingMessages[stage];

  return (
    <Card className={cn("p-6 bg-black/50 border-white/10 text-center", className)}>
      <div className="space-y-4">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
          <Icon 
            className={cn(
              "w-8 h-8",
              stage === "ready" ? "text-green-400" : 
              stage === "error" ? "text-red-400" : 
              "text-cyan-400",
              stage !== "ready" && stage !== "error" && "animate-spin"
            )} 
          />
        </div>

        {/* Message */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {message}
          </h3>
          {stage !== "ready" && stage !== "error" && (
            <p className="text-sm text-slate-400">
              Please wait{dots}
            </p>
          )}
          {stage === "error" && error && (
            <p className="text-sm text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        {stage !== "ready" && stage !== "error" && (
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status Messages */}
        <div className="text-xs text-slate-500 space-y-1">
          {stage === "initializing" && (
            <>
              <p>• Loading voice components</p>
              <p>• Connecting to audio services</p>
            </>
          )}
          {stage === "checking-microphone" && (
            <>
              <p>• Requesting microphone access</p>
              <p>• Testing audio input</p>
            </>
          )}
          {stage === "testing-audio" && (
            <>
              <p>• Verifying audio output</p>
              <p>• Testing voice synthesis</p>
            </>
          )}
          {stage === "ready" && (
            <>
              <p>✅ Microphone ready</p>
              <p>✅ Audio system ready</p>
              <p>✅ Voice synthesis ready</p>
            </>
          )}
          {stage === "error" && (
            <>
              <p>❌ Voice system unavailable</p>
              <p>Please check your microphone and audio settings</p>
            </>
          )}
        </div>

        {/* Tips */}
        {stage === "checking-microphone" && (
          <div className="text-xs text-slate-400 bg-slate-800/50 p-3 rounded-lg">
            <p className="font-medium mb-1">💡 Tips:</p>
            <p>• Allow microphone access when prompted</p>
            <p>• Ensure your microphone is not muted</p>
            <p>• Check browser permissions if needed</p>
          </div>
        )}
      </div>
    </Card>
  );
}
