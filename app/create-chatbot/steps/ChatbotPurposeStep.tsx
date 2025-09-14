"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  MessageSquare, 
  Globe, 
  Smile, 
  Volume2,
  Check,
  AlertCircle,
  Lightbulb,
  Target,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatbotPurposeStepProps {
  config: any;
  updateConfig: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const categories = [
  { id: "customer-support", name: "Customer Support", icon: "🎧" },
  { id: "sales", name: "Sales & Lead Generation", icon: "💼" },
  { id: "education", name: "Education & Training", icon: "📚" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "ecommerce", name: "E-commerce", icon: "🛒" },
  { id: "hr", name: "Human Resources", icon: "👥" },
  { id: "finance", name: "Finance & Banking", icon: "💰" },
  { id: "real-estate", name: "Real Estate", icon: "🏠" },
  { id: "travel", name: "Travel & Hospitality", icon: "✈️" },
  { id: "other", name: "Other", icon: "🔧" },
];

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

const personalities = [
  { id: "professional", name: "Professional", description: "Formal and business-like", icon: "💼" },
  { id: "friendly", name: "Friendly", description: "Warm and approachable", icon: "😊" },
  { id: "expert", name: "Expert", description: "Knowledgeable and authoritative", icon: "🎓" },
  { id: "casual", name: "Casual", description: "Relaxed and informal", icon: "😎" },
  { id: "helpful", name: "Helpful", description: "Supportive and caring", icon: "🤝" },
  { id: "enthusiastic", name: "Enthusiastic", description: "Energetic and positive", icon: "🚀" },
];

const tones = [
  { id: "formal", name: "Formal", description: "Professional and structured" },
  { id: "conversational", name: "Conversational", description: "Natural and flowing" },
  { id: "concise", name: "Concise", description: "Brief and to the point" },
  { id: "detailed", name: "Detailed", description: "Comprehensive and thorough" },
  { id: "encouraging", name: "Encouraging", description: "Motivating and supportive" },
  { id: "neutral", name: "Neutral", description: "Balanced and objective" },
];

export default function ChatbotPurposeStep({
  config,
  updateConfig,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: ChatbotPurposeStepProps) {
  const updatePurpose = (field: string, value: string) => {
    updateConfig({
      purpose: {
        ...config.purpose,
        [field]: value,
      },
    });
  };

  const isStepComplete = config.purpose.name.trim() !== "" && 
                        config.purpose.description.trim() !== "" &&
                        config.purpose.category !== "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Define Your Chatbot's Purpose
        </h3>
        <p className="text-slate-400">
          Tell us about your chatbot's role, personality, and how it should interact with users
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Bot className="w-5 h-5 mr-2 text-orange-400" />
          Basic Information
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Chatbot Name *
            </label>
            <Input
              value={config.purpose.name}
              onChange={(e) => updatePurpose("name", e.target.value)}
              placeholder="e.g., Customer Support Bot"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Language
            </label>
            <select
              value={config.purpose.language}
              onChange={(e) => updatePurpose("language", e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description *
          </label>
          <Textarea
            value={config.purpose.description}
            onChange={(e) => updatePurpose("description", e.target.value)}
            placeholder="Describe what your chatbot does, its main goals, and how it helps users..."
            className="min-h-[100px] bg-white/5 border-white/20 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Target className="w-5 h-5 mr-2 text-orange-400" />
          Choose Category *
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updatePurpose("category", category.id)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                config.purpose.category === category.id
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                  : "border-white/20 hover:border-white/40 text-slate-300 hover:text-white"
              )}
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Personality Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Smile className="w-5 h-5 mr-2 text-cyan-400" />
          Personality
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {personalities.map((personality) => (
            <button
              key={personality.id}
              onClick={() => updatePurpose("personality", personality.id)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                config.purpose.personality === personality.id
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                  : "border-white/20 hover:border-white/40 text-slate-300 hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{personality.icon}</div>
                <div>
                  <div className="font-medium">{personality.name}</div>
                  <div className="text-xs opacity-75">{personality.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
          Communication Tone
        </h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => updatePurpose("tone", tone.id)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                config.purpose.tone === tone.id
                  ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                  : "border-white/20 hover:border-white/40 text-slate-300 hover:text-white"
              )}
            >
              <div>
                <div className="font-medium">{tone.name}</div>
                <div className="text-xs opacity-75">{tone.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-white mb-3">Chatbot Preview</h5>
        <div className="space-y-2">
          <div className="text-sm text-slate-300">
            <span className="font-medium">Name:</span> {config.purpose.name || "Untitled Bot"}
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-medium">Category:</span> {categories.find(c => c.id === config.purpose.category)?.name || "Not selected"}
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-medium">Language:</span> {languages.find(l => l.code === config.purpose.language)?.name || "English"}
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-medium">Personality:</span> {personalities.find(p => p.id === config.purpose.personality)?.name || "Not selected"}
          </div>
          <div className="text-sm text-slate-300">
            <span className="font-medium">Tone:</span> {tones.find(t => t.id === config.purpose.tone)?.name || "Not selected"}
          </div>
          {config.purpose.description && (
            <div className="text-sm text-slate-300 mt-3">
              <span className="font-medium">Description:</span>
              <div className="mt-1 p-2 bg-white/5 rounded text-xs">
                {config.purpose.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <h5 className="text-sm font-medium text-cyan-400 mb-2">💡 Tips for Better Results</h5>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Choose a category that best matches your use case</li>
          <li>• Select a personality that aligns with your brand</li>
          <li>• Use a clear, descriptive name for your chatbot</li>
          <li>• Write a detailed description to help the AI understand its role</li>
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
              <span className="text-sm text-yellow-400">Complete required fields</span>
            </>
          )}
        </div>
        
        <Button
          onClick={onNext}
          disabled={!isStepComplete}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
        >
          Continue to Form Setup
        </Button>
      </div>
    </div>
  );
}
