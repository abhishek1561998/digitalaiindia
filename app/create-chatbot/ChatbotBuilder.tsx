"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  Bot, 
  FileText, 
  Settings, 
  User, 
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import step components
import TrainingDataStep from "./steps/TrainingDataStep";
import ChatbotPurposeStep from "./steps/ChatbotPurposeStep";
import FormSetupStep from "./steps/FormSetupStep";
import AvatarVoiceStep from "./steps/AvatarVoiceStep";
import CreateChatbotStep from "./steps/CreateChatbotStep";
import FuturisticHeader from "@/components/FuturisticHeader";

interface ChatbotConfig {
  // Step 1: Training Data
  trainingData: {
    documents: File[];
    urls: string[];
    textContent: string;
  };
  
  // Step 2: Chatbot Purpose
  purpose: {
    name: string;
    description: string;
    category: string;
    language: string;
    personality: string;
    tone: string;
  };
  
  // Step 3: Form Setup
  form: {
    fields: Array<{
      id: string;
      label: string;
      type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
      required: boolean;
      options?: string[];
    }>;
    welcomeMessage: string;
    successMessage: string;
    collectUserInfo: boolean;
  };
  
  // Step 4: Avatar & Voice
  avatar: {
    avatarId: string;
    voiceId: string;
    voiceSettings: {
      stability: number;
      similarity_boost: number;
      style: number;
      use_speaker_boost: boolean;
    };
    enableVoice: boolean;
  };
  
  // Step 5: Creation
  deployment: {
    domain: string;
    embedCode: string;
    apiKey: string;
    status: 'draft' | 'published' | 'archived';
  };
}

const steps = [
  {
    id: 1,
    title: "Training Data",
    description: "Upload documents and data to train your chatbot",
    icon: Upload,
    component: TrainingDataStep,
  },
  {
    id: 2,
    title: "Chatbot Purpose",
    description: "Define your chatbot's purpose and personality",
    icon: Bot,
    component: ChatbotPurposeStep,
  },
  {
    id: 3,
    title: "Form Setup",
    description: "Configure forms and user interactions",
    icon: FileText,
    component: FormSetupStep,
  },
  {
    id: 4,
    title: "Avatar & Voice",
    description: "Choose avatar and voice settings",
    icon: User,
    component: AvatarVoiceStep,
  },
  {
    id: 5,
    title: "Create Chatbot",
    description: "Deploy and publish your chatbot",
    icon: Sparkles,
    component: CreateChatbotStep,
  },
];

export default function ChatbotBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<ChatbotConfig>({
    trainingData: {
      documents: [],
      urls: [],
      textContent: "",
    },
    purpose: {
      name: "",
      description: "",
      category: "",
      language: "en",
      personality: "",
      tone: "",
    },
    form: {
      fields: [],
      welcomeMessage: "",
      successMessage: "",
      collectUserInfo: false,
    },
    avatar: {
      avatarId: "",
      voiceId: "pNInz6obpgDQGcFmaJgB",
      voiceSettings: {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true,
      },
      enableVoice: true,
    },
    deployment: {
      domain: "",
      embedCode: "",
      apiKey: "",
      status: 'draft',
    },
  });

  const updateConfig = (stepData: Partial<ChatbotConfig>) => {
    setConfig(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return config.trainingData.documents.length > 0 || 
               config.trainingData.urls.length > 0 || 
               config.trainingData.textContent.trim() !== "";
      case 2:
        return config.purpose.name.trim() !== "" && 
               config.purpose.description.trim() !== "" &&
               config.purpose.category !== "";
      case 3:
        return config.form.welcomeMessage.trim() !== "";
      case 4:
        return config.avatar.avatarId !== "" && config.avatar.voiceId !== "";
      case 5:
        return true; // Always complete as it's the final step
      default:
        return false;
    }
  };

  const getCompletionPercentage = () => {
    const completedSteps = steps.filter(step => isStepComplete(step.id)).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <main className="min-h-screen bg-black text-white">

      <FuturisticHeader />
      <br/>
      <br/>
      <br/>
   
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
      
      {/* Header */}
      <div className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Create Your AI Chatbot
              </h1>
              <p className="text-slate-400 mt-2">
                Build a custom AI chatbot with voice capabilities in 5 easy steps
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Progress</div>
              <div className="text-2xl font-bold text-white">{getCompletionPercentage()}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className="w-80 h-full border-r border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Setup Steps</h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = isStepComplete(step.id);
                const isAccessible = step.id === 1 || isStepComplete(step.id - 1);
                
                return (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-lg transition-all duration-200",
                      isActive && "bg-cyan-500/20 border border-cyan-500/30",
                      !isActive && isAccessible && "hover:bg-white/5 cursor-pointer",
                      !isAccessible && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => isAccessible && setCurrentStep(step.id)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      isCompleted && "bg-green-500 text-white",
                      isActive && !isCompleted && "bg-cyan-500 text-white",
                      !isActive && !isCompleted && "bg-white/10 text-slate-400"
                    )}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">
                        {step.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Overall Progress</span>
                <span className="text-sm text-slate-400">{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Step Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                  {(() => {
                    const Icon = steps[currentStep - 1].icon;
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {steps[currentStep - 1].title}
                  </h2>
                  <p className="text-slate-400">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>
              
              {/* Step Progress */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-slate-400">
                  Step {currentStep} of {steps.length}
                </span>
              </div>
            </div>

            {/* Step Content */}
            <Card className="bg-black/50 border-white/10">
              <div className="p-6">
                <CurrentStepComponent
                  config={config}
                  updateConfig={updateConfig}
                  onNext={nextStep}
                  onPrev={prevStep}
                  isFirstStep={currentStep === 1}
                  isLastStep={currentStep === steps.length}
                />
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="border-white/20 text-slate-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>Step {currentStep} of {steps.length}</span>
                <span>•</span>
                <span>{getCompletionPercentage()}% Complete</span>
              </div>

              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white"
              >
                {currentStep === steps.length ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Chatbot
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
