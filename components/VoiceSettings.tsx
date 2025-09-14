"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Volume2, Settings, Mic, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceSettings {
  voiceId: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface VoiceSettingsProps {
  onSettingsChange: (settings: VoiceSettings) => void;
  className?: string;
}

const VOICE_OPTIONS = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", description: "Professional, clear" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", description: "Friendly, warm" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", description: "Confident, strong" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", description: "Energetic, upbeat" },
  { id: "ErXwobaYiN019PkySvjV", name: "Elli", description: "Calm, soothing" },
];

export default function VoiceSettings({ onSettingsChange, className }: VoiceSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    voiceId: "pNInz6obpgDQGcFmaJgB",
    stability: 0.5,
    similarity_boost: 0.5,
    style: 0.0,
    use_speaker_boost: true,
  });

  const handleSettingChange = (key: keyof VoiceSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const selectedVoice = VOICE_OPTIONS.find(v => v.id === settings.voiceId);

  return (
    <div className={cn("relative", className)}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10"
      >
        <Settings className="w-4 h-4 mr-2" />
        Voice Settings
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 p-4 bg-black/90 border border-white/20 backdrop-blur-md z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Voice Settings</h3>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                ×
              </Button>
            </div>

            {/* Voice Selection */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Voice
              </label>
              <div className="grid grid-cols-1 gap-2">
                {VOICE_OPTIONS.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => handleSettingChange("voiceId", voice.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      settings.voiceId === voice.id
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-xs opacity-70">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stability */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Stability: {settings.stability.toFixed(1)}
              </label>
              <Slider
                value={[settings.stability]}
                onValueChange={([value]) => handleSettingChange("stability", value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                Higher values make voice more consistent
              </p>
            </div>

            {/* Similarity Boost */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Similarity Boost: {settings.similarity_boost.toFixed(1)}
              </label>
              <Slider
                value={[settings.similarity_boost]}
                onValueChange={([value]) => handleSettingChange("similarity_boost", value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                Higher values make voice more similar to original
              </p>
            </div>

            {/* Style */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Style: {settings.style.toFixed(1)}
              </label>
              <Slider
                value={[settings.style]}
                onValueChange={([value]) => handleSettingChange("style", value)}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-slate-400 mt-1">
                Higher values add more style variation
              </p>
            </div>

            {/* Speaker Boost */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Speaker Boost
                </label>
                <p className="text-xs text-slate-400">
                  Enhances voice clarity
                </p>
              </div>
              <Button
                onClick={() => handleSettingChange("use_speaker_boost", !settings.use_speaker_boost)}
                variant={settings.use_speaker_boost ? "default" : "outline"}
                size="sm"
                className={cn(
                  settings.use_speaker_boost
                    ? "bg-cyan-600 hover:bg-cyan-500"
                    : "border-white/20 text-slate-300"
                )}
              >
                {settings.use_speaker_boost ? "On" : "Off"}
              </Button>
            </div>

            {/* Current Selection */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Volume2 className="w-4 h-4" />
                <span>Selected: {selectedVoice?.name}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
