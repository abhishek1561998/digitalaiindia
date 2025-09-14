"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accessibility, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Eye, 
  EyeOff,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioDescriptions: boolean;
  voiceGuidance: boolean;
  focusIndicators: boolean;
}

interface VoiceAccessibilityProps {
  className?: string;
  onSettingsChange?: (settings: AccessibilitySettings) => void;
}

export default function VoiceAccessibility({ 
  className, 
  onSettingsChange 
}: VoiceAccessibilityProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    audioDescriptions: false,
    voiceGuidance: true,
    focusIndicators: true,
  });

  const [announcements, setAnnouncements] = useState<string[]>([]);
  const announcementRef = useRef<HTMLDivElement>(null);

  // Detect screen reader
  useEffect(() => {
    const detectScreenReader = () => {
      const hasScreenReader = 
        window.speechSynthesis ||
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver');
      
      setSettings(prev => ({ ...prev, screenReader: !!hasScreenReader }));
    };

    detectScreenReader();
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    if (settings.focusIndicators) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }

    onSettingsChange?.(settings);
  }, [settings, onSettingsChange]);

  // Announce changes to screen readers
  const announceToScreenReader = (message: string) => {
    if (settings.screenReader && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = 0.8;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
    
    setAnnouncements(prev => [...prev.slice(-2), message]);
  };

  const handleSettingChange = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const settingNames = {
      highContrast: "High contrast mode",
      largeText: "Large text mode",
      reducedMotion: "Reduced motion",
      screenReader: "Screen reader support",
      keyboardNavigation: "Keyboard navigation",
      audioDescriptions: "Audio descriptions",
      voiceGuidance: "Voice guidance",
      focusIndicators: "Focus indicators",
    };

    announceToScreenReader(`${settingNames[key]} ${value ? 'enabled' : 'disabled'}`);
  };

  const accessibilityFeatures = [
    {
      key: "highContrast" as keyof AccessibilitySettings,
      name: "High Contrast",
      description: "Increase color contrast for better visibility",
      icon: Eye,
    },
    {
      key: "largeText" as keyof AccessibilitySettings,
      name: "Large Text",
      description: "Increase text size for better readability",
      icon: Accessibility,
    },
    {
      key: "reducedMotion" as keyof AccessibilitySettings,
      name: "Reduced Motion",
      description: "Minimize animations and transitions",
      icon: VolumeX,
    },
    {
      key: "screenReader" as keyof AccessibilitySettings,
      name: "Screen Reader",
      description: "Enable screen reader announcements",
      icon: Volume2,
    },
    {
      key: "keyboardNavigation" as keyof AccessibilitySettings,
      name: "Keyboard Navigation",
      description: "Enable keyboard-only navigation",
      icon: Keyboard,
    },
    {
      key: "audioDescriptions" as keyof AccessibilitySettings,
      name: "Audio Descriptions",
      description: "Provide audio descriptions for visual elements",
      icon: Volume2,
    },
    {
      key: "voiceGuidance" as keyof AccessibilitySettings,
      name: "Voice Guidance",
      description: "Provide spoken instructions and feedback",
      icon: Volume2,
    },
    {
      key: "focusIndicators" as keyof AccessibilitySettings,
      name: "Focus Indicators",
      description: "Show clear focus indicators",
      icon: Eye,
    },
  ];

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Accessibility className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Accessibility Settings</h3>
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
            aria-label={isExpanded ? "Collapse accessibility settings" : "Expand accessibility settings"}
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {isExpanded ? "Hide" : "Show"}
          </Button>
        </div>

        {/* Quick Status */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-green-400">
              {Object.values(settings).filter(Boolean).length}
            </div>
            <div className="text-xs text-slate-400">Enabled</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-blue-400">
              {settings.screenReader ? "Yes" : "No"}
            </div>
            <div className="text-xs text-slate-400">Screen Reader</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-purple-400">
              {settings.voiceGuidance ? "On" : "Off"}
            </div>
            <div className="text-xs text-slate-400">Voice Guide</div>
          </div>
        </div>

        {/* Expanded Settings */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Accessibility Features */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Accessibility Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {accessibilityFeatures.map((feature) => {
                  const Icon = feature.icon;
                  const isEnabled = settings[feature.key];
                  
                  return (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{feature.name}</div>
                          <div className="text-xs text-slate-400">{feature.description}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSettingChange(feature.key, !isEnabled)}
                        variant={isEnabled ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "min-w-[60px]",
                          isEnabled
                            ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                            : "border-white/20 text-slate-300 hover:bg-white/10"
                        )}
                        aria-label={`${isEnabled ? 'Disable' : 'Enable'} ${feature.name}`}
                      >
                        {isEnabled ? "On" : "Off"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Keyboard Shortcuts</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Start/Stop Voice Recording</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-slate-300">Space</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Toggle Voice Mode</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-slate-300">V</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Open Settings</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-slate-300">S</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Focus Next Element</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-slate-300">Tab</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Activate Element</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-slate-300">Enter</kbd>
                </div>
              </div>
            </div>

            {/* Screen Reader Announcements */}
            {settings.screenReader && (
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Screen Reader Announcements</h4>
                <div 
                  ref={announcementRef}
                  className="p-3 bg-slate-800/50 rounded-lg min-h-[60px] text-xs text-slate-400"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {announcements.length === 0 ? (
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-blue-400" />
                      <span>Screen reader announcements will appear here</span>
                    </div>
                  ) : (
                    announcements.map((announcement, index) => (
                      <div key={index} className="mb-1">
                        {announcement}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Accessibility Tips */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Accessibility Tips</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use keyboard navigation for better accessibility</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Enable voice guidance for spoken instructions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>High contrast mode improves visibility</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Large text mode enhances readability</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const newSettings = {
                highContrast: true,
                largeText: true,
                reducedMotion: false,
                screenReader: true,
                keyboardNavigation: true,
                audioDescriptions: true,
                voiceGuidance: true,
                focusIndicators: true,
              };
              setSettings(newSettings);
              announceToScreenReader("All accessibility features enabled");
            }}
            variant="outline"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            Enable All
          </Button>
          <Button
            onClick={() => {
              const newSettings = {
                highContrast: false,
                largeText: false,
                reducedMotion: false,
                screenReader: false,
                keyboardNavigation: true,
                audioDescriptions: false,
                voiceGuidance: false,
                focusIndicators: true,
              };
              setSettings(newSettings);
              announceToScreenReader("Accessibility features reset to defaults");
            }}
            variant="outline"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
