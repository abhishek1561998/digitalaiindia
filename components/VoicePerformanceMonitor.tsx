"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Zap, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceMetrics {
  speechToTextLatency: number;
  textToSpeechLatency: number;
  totalResponseTime: number;
  audioQuality: number;
  errorRate: number;
  successRate: number;
  averageSessionDuration: number;
  concurrentUsers: number;
}

interface VoicePerformanceMonitorProps {
  className?: string;
  realTime?: boolean;
}

export default function VoicePerformanceMonitor({ 
  className, 
  realTime = false 
}: VoicePerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    speechToTextLatency: 0,
    textToSpeechLatency: 0,
    totalResponseTime: 0,
    audioQuality: 0,
    errorRate: 0,
    successRate: 0,
    averageSessionDuration: 0,
    concurrentUsers: 0,
  });
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time metrics (in production, connect to your monitoring service)
  useEffect(() => {
    if (realTime && isMonitoring) {
      intervalRef.current = setInterval(() => {
        setMetrics(prev => ({
          speechToTextLatency: Math.max(0, prev.speechToTextLatency + (Math.random() - 0.5) * 100),
          textToSpeechLatency: Math.max(0, prev.textToSpeechLatency + (Math.random() - 0.5) * 200),
          totalResponseTime: Math.max(0, prev.totalResponseTime + (Math.random() - 0.5) * 300),
          audioQuality: Math.max(0, Math.min(100, prev.audioQuality + (Math.random() - 0.5) * 5)),
          errorRate: Math.max(0, Math.min(100, prev.errorRate + (Math.random() - 0.5) * 2)),
          successRate: Math.max(0, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2)),
          averageSessionDuration: Math.max(0, prev.averageSessionDuration + (Math.random() - 0.5) * 10),
          concurrentUsers: Math.max(0, prev.concurrentUsers + Math.floor((Math.random() - 0.5) * 5)),
        }));
        
        // Check for alerts
        checkAlerts();
      }, 2000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [realTime, isMonitoring]);

  const checkAlerts = () => {
    const newAlerts: string[] = [];
    
    if (metrics.speechToTextLatency > 3000) {
      newAlerts.push("High speech-to-text latency detected");
    }
    
    if (metrics.textToSpeechLatency > 5000) {
      newAlerts.push("High text-to-speech latency detected");
    }
    
    if (metrics.errorRate > 10) {
      newAlerts.push("High error rate detected");
    }
    
    if (metrics.audioQuality < 80) {
      newAlerts.push("Audio quality below threshold");
    }
    
    if (metrics.successRate < 90) {
      newAlerts.push("Success rate below target");
    }
    
    setAlerts(newAlerts);
  };

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-green-400";
    if (value >= thresholds.warning) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusIcon = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return CheckCircle;
    if (value >= thresholds.warning) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Performance Monitor</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isMonitoring ? "bg-green-400 animate-pulse" : "bg-slate-400"
            )} />
            <span className="text-sm text-slate-400">
              {isMonitoring ? "Live" : "Paused"}
            </span>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              {isMonitoring ? "Pause" : "Start"}
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">Active Alerts</span>
            </div>
            <div className="space-y-1">
              {alerts.map((alert, index) => (
                <p key={index} className="text-xs text-red-300">• {alert}</p>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Speech-to-Text Latency */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-cyan-400" />
            </div>
            <div className={cn(
              "text-xl font-bold",
              getStatusColor(metrics.speechToTextLatency, { good: 2000, warning: 3000 })
            )}>
              {Math.round(metrics.speechToTextLatency)}ms
            </div>
            <div className="text-xs text-slate-400">Speech-to-Text</div>
          </div>

          {/* Text-to-Speech Latency */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-green-400" />
            </div>
            <div className={cn(
              "text-xl font-bold",
              getStatusColor(metrics.textToSpeechLatency, { good: 3000, warning: 5000 })
            )}>
              {Math.round(metrics.textToSpeechLatency)}ms
            </div>
            <div className="text-xs text-slate-400">Text-to-Speech</div>
          </div>

          {/* Total Response Time */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className={cn(
              "text-xl font-bold",
              getStatusColor(metrics.totalResponseTime, { good: 5000, warning: 8000 })
            )}>
              {Math.round(metrics.totalResponseTime)}ms
            </div>
            <div className="text-xs text-slate-400">Total Response</div>
          </div>

          {/* Success Rate */}
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div className={cn(
              "text-xl font-bold",
              getStatusColor(metrics.successRate, { good: 95, warning: 90 })
            )}>
              {Math.round(metrics.successRate)}%
            </div>
            <div className="text-xs text-slate-400">Success Rate</div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">{Math.round(metrics.audioQuality)}%</div>
            <div className="text-xs text-slate-400">Audio Quality</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="text-lg font-bold text-white">{metrics.concurrentUsers}</div>
            <div className="text-xs text-slate-400">Concurrent Users</div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Speech-to-Text Performance</span>
            <div className="flex items-center space-x-1">
              {(() => {
                const Icon = getStatusIcon(metrics.speechToTextLatency, { good: 2000, warning: 3000 });
                return <Icon className="w-4 h-4" />;
              })()}
              <span className={cn(
                "text-xs",
                getStatusColor(metrics.speechToTextLatency, { good: 2000, warning: 3000 })
              )}>
                {metrics.speechToTextLatency < 2000 ? "Excellent" : 
                 metrics.speechToTextLatency < 3000 ? "Good" : "Poor"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Text-to-Speech Performance</span>
            <div className="flex items-center space-x-1">
              {(() => {
                const Icon = getStatusIcon(metrics.textToSpeechLatency, { good: 3000, warning: 5000 });
                return <Icon className="w-4 h-4" />;
              })()}
              <span className={cn(
                "text-xs",
                getStatusColor(metrics.textToSpeechLatency, { good: 3000, warning: 5000 })
              )}>
                {metrics.textToSpeechLatency < 3000 ? "Excellent" : 
                 metrics.textToSpeechLatency < 5000 ? "Good" : "Poor"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">Overall System Health</span>
            <div className="flex items-center space-x-1">
              {(() => {
                const Icon = getStatusIcon(metrics.successRate, { good: 95, warning: 90 });
                return <Icon className="w-4 h-4" />;
              })()}
              <span className={cn(
                "text-xs",
                getStatusColor(metrics.successRate, { good: 95, warning: 90 })
              )}>
                {metrics.successRate >= 95 ? "Healthy" : 
                 metrics.successRate >= 90 ? "Warning" : "Critical"}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Performance Tips</h4>
          <div className="space-y-1 text-xs text-slate-400">
            {metrics.speechToTextLatency > 3000 && (
              <p>• Consider reducing audio quality for faster processing</p>
            )}
            {metrics.textToSpeechLatency > 5000 && (
              <p>• Check ElevenLabs API response times</p>
            )}
            {metrics.errorRate > 10 && (
              <p>• Review error logs and check API configurations</p>
            )}
            {metrics.audioQuality < 80 && (
              <p>• Ensure microphone permissions and audio quality</p>
            )}
            {alerts.length === 0 && (
              <p>• All systems performing optimally</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
