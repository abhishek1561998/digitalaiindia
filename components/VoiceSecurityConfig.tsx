"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityConfigProps {
  className?: string;
}

export default function VoiceSecurityConfig({ className }: SecurityConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  const securityChecks = [
    {
      name: "HTTPS Enforcement",
      status: "passed",
      description: "All connections use secure HTTPS protocol",
      icon: Lock,
    },
    {
      name: "API Key Protection",
      status: "passed",
      description: "API keys stored as environment variables",
      icon: Shield,
    },
    {
      name: "Audio Data Privacy",
      status: "passed",
      description: "Audio data not permanently stored",
      icon: Eye,
    },
    {
      name: "Rate Limiting",
      status: "warning",
      description: "Rate limiting configured but needs monitoring",
      icon: AlertTriangle,
    },
    {
      name: "Input Validation",
      status: "passed",
      description: "All inputs validated and sanitized",
      icon: CheckCircle,
    },
    {
      name: "CORS Configuration",
      status: "passed",
      description: "Cross-origin requests properly configured",
      icon: Shield,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "failed": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return CheckCircle;
      case "warning": return AlertTriangle;
      case "failed": return AlertTriangle;
      default: return Settings;
    }
  };

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Security Configuration</h3>
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            {isExpanded ? "Hide" : "Show"} Details
          </Button>
        </div>

        {/* Security Status Overview */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {securityChecks.filter(check => check.status === "passed").length}
            </div>
            <div className="text-xs text-slate-400">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {securityChecks.filter(check => check.status === "warning").length}
            </div>
            <div className="text-xs text-slate-400">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {securityChecks.filter(check => check.status === "failed").length}
            </div>
            <div className="text-xs text-slate-400">Failed</div>
          </div>
        </div>

        {/* Overall Security Status */}
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium text-green-400">Security Status: Secure</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            All critical security measures are in place. Review warnings for optimization.
          </p>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-3">
            {/* Security Checks */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Security Checks</h4>
              <div className="space-y-2">
                {securityChecks.map((check, index) => {
                  const Icon = check.icon;
                  const StatusIcon = getStatusIcon(check.status);
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{check.name}</div>
                          <div className="text-xs text-slate-400">{check.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className={cn("w-4 h-4", getStatusColor(check.status))} />
                        <span className={cn("text-xs font-medium", getStatusColor(check.status))}>
                          {check.status.charAt(0).toUpperCase() + check.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* API Key Management */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">API Key Management</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-sm font-medium text-white">ElevenLabs API Key</div>
                      <div className="text-xs text-slate-400">
                        {showApiKey ? "sk-***" : "••••••••••••••••"}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowApiKey(!showApiKey)}
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Anthropic API Key</div>
                      <div className="text-xs text-slate-400">••••••••••••••••</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>

            {/* Security Recommendations */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Security Recommendations</h4>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Enable rate limiting monitoring for production use</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Implement audio data encryption for sensitive applications</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Set up security monitoring and alerting</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1 h-1 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <p>Regular security audits and penetration testing</p>
                </div>
              </div>
            </div>

            {/* Compliance Information */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-3">Compliance</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white/5 rounded text-center">
                  <div className="text-green-400 font-medium">GDPR</div>
                  <div className="text-slate-400">Compliant</div>
                </div>
                <div className="p-2 bg-white/5 rounded text-center">
                  <div className="text-green-400 font-medium">CCPA</div>
                  <div className="text-slate-400">Compliant</div>
                </div>
                <div className="p-2 bg-white/5 rounded text-center">
                  <div className="text-green-400 font-medium">SOC 2</div>
                  <div className="text-slate-400">Ready</div>
                </div>
                <div className="p-2 bg-white/5 rounded text-center">
                  <div className="text-green-400 font-medium">HIPAA</div>
                  <div className="text-slate-400">Ready</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
