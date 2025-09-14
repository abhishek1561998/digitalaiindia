"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Volume2, 
  VolumeX, 
  Play, 
  Settings, 
  Check,
  AlertCircle,
  Mic,
  MicOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { avatars } from "@/app/ai-machine-agent/avatars";

interface AvatarVoiceStepProps {
  config: any;
  updateConfig: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const voices = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "Male", accent: "American" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", gender: "Female", accent: "American" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Arnold", gender: "Male", accent: "American" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", gender: "Female", accent: "American" },
  { id: "ErXwobaYiN019PkySvjV", name: "Elli", gender: "Female", accent: "American" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Josh", gender: "Male", accent: "American" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Rachel", gender: "Female", accent: "American" },
  { id: "VR6AewLTigWG4xSOukaG", name: "Sam", gender: "Male", accent: "American" },
];

export default function AvatarVoiceStep({
  config,
  updateConfig,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: AvatarVoiceStepProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [voiceSettingsOpen, setVoiceSettingsOpen] = useState(false);

  const updateAvatar = (avatarId: string) => {
    updateConfig({
      avatar: {
        ...config.avatar,
        avatarId,
      },
    });
  };

  const updateVoice = (voiceId: string) => {
    updateConfig({
      avatar: {
        ...config.avatar,
        voiceId,
      },
    });
  };

  const updateVoiceSettings = (settings: any) => {
    updateConfig({
      avatar: {
        ...config.avatar,
        voiceSettings: {
          ...config.avatar.voiceSettings,
          ...settings,
        },
      },
    });
  };

  const toggleVoiceEnabled = () => {
    updateConfig({
      avatar: {
        ...config.avatar,
        enableVoice: !config.avatar.enableVoice,
      },
    });
  };

  const playVoiceSample = async (voiceId: string) => {
    if (playingVoice === voiceId) return;
    
    setPlayingVoice(voiceId);
    
    try {
      const response = await fetch('/api/voice/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'Hello! This is a sample of my voice. How do you like it?',
          voiceId,
          voiceSettings: config.avatar.voiceSettings,
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setPlayingVoice(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing voice sample:', error);
      setPlayingVoice(null);
    }
  };

  const isStepComplete = config.avatar.avatarId !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Choose Avatar & Voice
        </h3>
        <p className="text-slate-400">
          Select an avatar and voice that represents your chatbot's personality
        </p>
      </div>

      {/* Voice Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
        <div>
          <div className="text-sm font-medium text-white flex items-center">
            <Volume2 className="w-4 h-4 mr-2" />
            Voice Capabilities
          </div>
          <div className="text-xs text-slate-400">Enable voice interaction for your chatbot</div>
        </div>
        <button
          onClick={toggleVoiceEnabled}
          className="flex items-center space-x-2"
        >
          {config.avatar.enableVoice ? (
            <>
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-cyan-400">Enabled</span>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400">Disabled</span>
            </>
          )}
        </button>
      </div>

      {/* Avatar Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-cyan-400" />
          Choose Avatar
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => updateAvatar(avatar.id)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-center group",
                config.avatar.avatarId === avatar.id
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                  : "border-white/20 hover:border-white/40 text-slate-300 hover:text-white"
              )}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                {avatar.name.charAt(0)}
              </div>
              <div className="text-sm font-medium">{avatar.name}</div>
              <div className="text-xs opacity-75 mt-1">{avatar.language}</div>
              {avatar.language && (
                <div className="text-xs bg-white/10 rounded-full px-2 py-1 mt-2">
                  {avatar.language}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      {config.avatar.enableVoice && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center">
            <Volume2 className="w-5 h-5 mr-2 text-cyan-400" />
            Choose Voice
          </h4>
          
          <div className="grid md:grid-cols-2 gap-3">
            {voices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => updateVoice(voice.id)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  config.avatar.voiceId === voice.id
                    ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                    : "border-white/20 hover:border-white/40 text-slate-300 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-sm opacity-75">
                      {voice.gender} • {voice.accent}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(voice.id);
                    }}
                    variant="ghost"
                    size="sm"
                    disabled={playingVoice === voice.id}
                    className="text-slate-400 hover:text-white"
                  >
                    {playingVoice === voice.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Settings */}
      {config.avatar.enableVoice && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-cyan-400" />
              Voice Settings
            </h4>
            <Button
              onClick={() => setVoiceSettingsOpen(!voiceSettingsOpen)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              {voiceSettingsOpen ? "Hide" : "Show"} Settings
            </Button>
          </div>
          
          {voiceSettingsOpen && (
            <div className="p-4 bg-white/5 rounded-lg space-y-4">
              {/* Stability */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Stability: {config.avatar.voiceSettings.stability}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.avatar.voiceSettings.stability}
                  onChange={(e) => updateVoiceSettings({ stability: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Variable</span>
                  <span>Stable</span>
                </div>
              </div>

              {/* Similarity Boost */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Similarity Boost: {config.avatar.voiceSettings.similarity_boost}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.avatar.voiceSettings.similarity_boost}
                  onChange={(e) => updateVoiceSettings({ similarity_boost: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Different</span>
                  <span>Similar</span>
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Style: {config.avatar.voiceSettings.style}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.avatar.voiceSettings.style}
                  onChange={(e) => updateVoiceSettings({ style: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Neutral</span>
                  <span>Expressive</span>
                </div>
              </div>

              {/* Speaker Boost */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Speaker Boost</span>
                <button
                  onClick={() => updateVoiceSettings({ use_speaker_boost: !config.avatar.voiceSettings.use_speaker_boost })}
                  className="flex items-center space-x-2"
                >
                  {config.avatar.voiceSettings.use_speaker_boost ? (
                    <>
                      <Mic className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-cyan-400">Enabled</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">Disabled</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-white mb-3">Chatbot Preview</h5>
        <div className="flex items-center space-x-4">
          {config.avatar.avatarId ? (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
              {avatars.find(a => a.id === config.avatar.avatarId)?.name.charAt(0)}
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-8 h-8 text-slate-400" />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-white">
              {avatars.find(a => a.id === config.avatar.avatarId)?.name || "No Avatar Selected"}
            </div>
            <div className="text-xs text-slate-400">
              Voice: {config.avatar.enableVoice 
                ? voices.find(v => v.id === config.avatar.voiceId)?.name || "No Voice Selected"
                : "Disabled"
              }
            </div>
            {config.avatar.enableVoice && config.avatar.voiceId && (
              <Button
                onClick={() => playVoiceSample(config.avatar.voiceId)}
                variant="ghost"
                size="sm"
                className="text-xs text-cyan-400 hover:text-cyan-300 p-0 h-auto"
                disabled={playingVoice === config.avatar.voiceId}
              >
                {playingVoice === config.avatar.voiceId ? "Playing..." : "Test Voice"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <h5 className="text-sm font-medium text-cyan-400 mb-2">💡 Avatar & Voice Tips</h5>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Choose an avatar that matches your brand personality</li>
          <li>• Test different voices to find the perfect match</li>
          <li>• Adjust voice settings to fine-tune the speaking style</li>
          <li>• Consider your target audience when selecting voice characteristics</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <div className="flex items-center space-x-2">
          {isStepComplete ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Step Complete</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">Select an avatar to continue</span>
            </>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={!isStepComplete}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
        >
          Continue to Creation
        </Button>
      </div>
    </div>
  );
}
