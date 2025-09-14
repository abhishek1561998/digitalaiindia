"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Clock, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceMetrics {
  totalMessages: number;
  voiceMessages: number;
  textMessages: number;
  totalDuration: number;
  averageResponseTime: number;
  voiceAccuracy: number;
  userSatisfaction: number;
}

interface VoiceAnalyticsProps {
  chatId: string;
  className?: string;
}

export default function VoiceAnalytics({ chatId, className }: VoiceAnalyticsProps) {
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    totalMessages: 0,
    voiceMessages: 0,
    textMessages: 0,
    totalDuration: 0,
    averageResponseTime: 0,
    voiceAccuracy: 0,
    userSatisfaction: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate metrics loading (in real app, fetch from API)
  useEffect(() => {
    const loadMetrics = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMetrics({
        totalMessages: 24,
        voiceMessages: 18,
        textMessages: 6,
        totalDuration: 1247, // seconds
        averageResponseTime: 2.3,
        voiceAccuracy: 94.2,
        userSatisfaction: 4.6,
      });
    };

    loadMetrics();
  }, [chatId]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const voicePercentage = metrics.totalMessages > 0 
    ? Math.round((metrics.voiceMessages / metrics.totalMessages) * 100)
    : 0;

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Voice Analytics</h3>
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white">{metrics.totalMessages}</div>
            <div className="text-xs text-slate-400">Total Messages</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{voicePercentage}%</div>
            <div className="text-xs text-slate-400">Voice Usage</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{formatDuration(metrics.totalDuration)}</div>
            <div className="text-xs text-slate-400">Duration</div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-600/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{metrics.voiceAccuracy}%</div>
            <div className="text-xs text-slate-400">Accuracy</div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Voice vs Text Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Message Types</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-slate-300">Voice Messages</span>
                  </div>
                  <span className="text-sm text-white">{metrics.voiceMessages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Text Messages</span>
                  </div>
                  <span className="text-sm text-white">{metrics.textMessages}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Performance</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Avg Response Time</span>
                  <span className="text-sm text-white">{metrics.averageResponseTime}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Voice Accuracy</span>
                  <span className="text-sm text-white">{metrics.voiceAccuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">User Satisfaction</span>
                  <span className="text-sm text-white">{metrics.userSatisfaction}/5</span>
                </div>
              </div>
            </div>

            {/* Voice Usage Chart */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Voice Usage</h4>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${voicePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Text</span>
                <span>{voicePercentage}% Voice</span>
              </div>
            </div>

            {/* Insights */}
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Insights</h4>
              <div className="space-y-1 text-xs text-slate-400">
                {voicePercentage > 70 && (
                  <p>🎤 High voice usage - users prefer voice interaction</p>
                )}
                {metrics.voiceAccuracy > 90 && (
                  <p>✅ Excellent voice recognition accuracy</p>
                )}
                {metrics.averageResponseTime < 3 && (
                  <p>⚡ Fast response times for good user experience</p>
                )}
                {metrics.userSatisfaction > 4 && (
                  <p>😊 High user satisfaction with voice features</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
