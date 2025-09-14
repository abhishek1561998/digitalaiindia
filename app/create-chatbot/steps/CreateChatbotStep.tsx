"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Code, 
  Settings,
  Globe,
  Key,
  Bot,
  Play,
  Download,
  Share2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateChatbotStepProps {
  config: any;
  updateConfig: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function CreateChatbotStep({
  config,
  updateConfig,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep,
}: CreateChatbotStepProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateApiKey = () => {
    return `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  const generateEmbedCode = () => {
    const apiKey = config.deployment.apiKey || generateApiKey();
    const domain = config.deployment.domain || `${config.purpose.name.toLowerCase().replace(/\s+/g, '-')}-bot`;
    
    return `<div id="ai-chatbot-widget"></div>
<script>
  window.AIChatbotConfig = {
    apiKey: '${apiKey}',
    domain: '${domain}',
    theme: 'dark',
    position: 'bottom-right',
    avatar: '${config.avatar.avatarId}',
    voiceEnabled: ${config.avatar.enableVoice},
    voiceId: '${config.avatar.voiceId}',
    welcomeMessage: '${config.form.welcomeMessage}',
    successMessage: '${config.form.successMessage}'
  };
</script>
<script src="https://your-domain.com/chatbot-widget.js"></script>`;
  };

  const createChatbot = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call to create chatbot
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const apiKey = generateApiKey();
      const domain = `${config.purpose.name.toLowerCase().replace(/\s+/g, '-')}-bot`;
      const embedCode = generateEmbedCode();
      
      updateConfig({
        deployment: {
          domain,
          embedCode,
          apiKey,
          status: 'published',
        },
      });
      
      setIsCreated(true);
    } catch (error) {
      console.error('Error creating chatbot:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openTestChat = () => {
    // In a real implementation, this would open the chatbot in a new tab
    window.open(`/chatbot/${config.deployment.domain}`, '_blank');
  };

  if (isCreated) {
    return (
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Chatbot Created Successfully!
          </h3>
          <p className="text-slate-400">
            Your AI chatbot is now live and ready to use
          </p>
        </div>

        {/* Chatbot Details */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bot className="w-5 h-5 mr-2 text-cyan-400" />
              Chatbot Details
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">Name:</span>
                <div className="text-white font-medium">{config.purpose.name}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Category:</span>
                <div className="text-white">{config.purpose.category}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Domain:</span>
                <div className="text-white">{config.deployment.domain}</div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Status:</span>
                <div className="text-green-400 font-medium">Published</div>
              </div>
            </div>
          </div>

          {/* Integration Info */}
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-cyan-400" />
              Integration
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-slate-400">API Key:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-black/50 px-2 py-1 rounded text-cyan-400 flex-1">
                    {config.deployment.apiKey.substring(0, 20)}...
                  </code>
                  <Button
                    onClick={() => copyToClipboard(config.deployment.apiKey, 'apiKey')}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    {copied === 'apiKey' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-400">Chat URL:</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs bg-black/50 px-2 py-1 rounded text-cyan-400 flex-1">
                    /chatbot/{config.deployment.domain}
                  </code>
                  <Button
                    onClick={openTestChat}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-cyan-400" />
              Embed Code
            </h4>
            <Button
              onClick={() => copyToClipboard(config.deployment.embedCode, 'embedCode')}
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300 hover:text-white"
            >
              {copied === 'embedCode' ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <pre className="bg-black/50 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto">
            <code>{config.deployment.embedCode}</code>
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={openTestChat}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Test Chatbot
          </Button>
          <Button
            onClick={() => copyToClipboard(config.deployment.embedCode, 'embedCode')}
            variant="outline"
            className="border-white/20 text-slate-300 hover:text-white"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Embed Code
          </Button>
          <Button
            variant="outline"
            className="border-white/20 text-slate-300 hover:text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Settings
          </Button>
        </div>

        {/* Next Steps */}
        <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <h5 className="text-lg font-semibold text-cyan-400 mb-3">🎉 Next Steps</h5>
          <div className="space-y-2 text-sm text-slate-300">
            <p>• Copy the embed code and add it to your website</p>
            <p>• Test your chatbot to ensure everything works correctly</p>
            <p>• Monitor conversations and analytics in the dashboard</p>
            <p>• Update training data and settings as needed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          Create Your Chatbot
        </h3>
        <p className="text-slate-400">
          Review your configuration and deploy your AI chatbot
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Configuration Summary</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Training Data */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h5 className="text-sm font-medium text-white mb-2">Training Data</h5>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Documents: {config.trainingData.documents.length}</div>
              <div>URLs: {config.trainingData.urls.length}</div>
              <div>Text: {config.trainingData.textContent.length > 0 ? "Yes" : "No"}</div>
            </div>
          </div>

          {/* Purpose */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h5 className="text-sm font-medium text-white mb-2">Purpose</h5>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Name: {config.purpose.name}</div>
              <div>Category: {config.purpose.category}</div>
              <div>Language: {config.purpose.language}</div>
            </div>
          </div>

          {/* Form */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h5 className="text-sm font-medium text-white mb-2">Form Setup</h5>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Fields: {config.form.fields.length}</div>
              <div>Welcome Message: {config.form.welcomeMessage.length > 0 ? "Yes" : "No"}</div>
              <div>Collect Info: {config.form.collectUserInfo ? "Yes" : "No"}</div>
            </div>
          </div>

          {/* Avatar & Voice */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h5 className="text-sm font-medium text-white mb-2">Avatar & Voice</h5>
            <div className="space-y-1 text-xs text-slate-400">
              <div>Avatar: {config.avatar.avatarId ? "Selected" : "None"}</div>
              <div>Voice: {config.avatar.enableVoice ? "Enabled" : "Disabled"}</div>
              <div>Voice ID: {config.avatar.voiceId}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Settings */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <Settings className="w-5 h-5 mr-2 text-cyan-400" />
          Deployment Settings
        </h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Custom Domain (Optional)
            </label>
            <Input
              value={config.deployment.domain}
              onChange={(e) => updateConfig({
                deployment: {
                  ...config.deployment,
                  domain: e.target.value,
                },
              })}
              placeholder="my-custom-chatbot"
              className="bg-white/5 border-white/20 text-white placeholder:text-slate-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Environment
            </label>
            <select
              value={config.deployment.status}
              onChange={(e) => updateConfig({
                deployment: {
                  ...config.deployment,
                  status: e.target.value as any,
                },
              })}
              className="w-full bg-white/5 border border-white/20 text-white rounded-md px-3 py-2"
            >
              <option value="draft" className="bg-slate-800">Draft (Testing)</option>
              <option value="published" className="bg-slate-800">Published (Live)</option>
              <option value="archived" className="bg-slate-800">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="p-4 bg-slate-800/50 rounded-lg">
        <h5 className="text-sm font-medium text-white mb-3">Included Features</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>AI Conversations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Form Collection</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Avatar Interface</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Voice Interaction</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Analytics Dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Custom Branding</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>API Access</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="w-3 h-3 text-green-400" />
            <span>Embed Widget</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <h5 className="text-sm font-medium text-cyan-400 mb-2">💡 Before You Create</h5>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Review your configuration to ensure everything is correct</li>
          <li>• Test your chatbot in draft mode before going live</li>
          <li>• Consider starting with a custom domain for better branding</li>
          <li>• You can always update settings after creation</li>
        </ul>
      </div>

      {/* Create Button */}
      <div className="text-center pt-6">
        <Button
          onClick={createChatbot}
          disabled={isCreating}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-3 text-lg"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
              Creating Chatbot...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create Chatbot
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
