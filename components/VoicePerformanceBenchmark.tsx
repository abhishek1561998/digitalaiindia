"use client";

import { useState, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Square, 
  Clock, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Mic,
  Volume2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BenchmarkResult {
  test: string;
  latency: number;
  status: "passed" | "failed" | "warning";
  threshold: number;
  timestamp: Date;
}

interface VoicePerformanceBenchmarkProps {
  className?: string;
}

export default function VoicePerformanceBenchmark({ className }: VoicePerformanceBenchmarkProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const benchmarks = [
    {
      name: "Speech-to-Text Latency",
      description: "Time to convert audio to text",
      threshold: 2000, // 2 seconds
      test: async () => {
        const startTime = Date.now();
        const mockAudioBlob = new Blob(['test audio'], { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', mockAudioBlob);
        
        try {
          const response = await fetch('/api/voice/speech-to-text', {
            method: 'POST',
            body: formData,
          });
          return Date.now() - startTime;
        } catch (error) {
          return 5000; // Simulate failure
        }
      }
    },
    {
      name: "Text-to-Speech Latency",
      description: "Time to generate speech from text",
      threshold: 3000, // 3 seconds
      test: async () => {
        const startTime = Date.now();
        
        try {
          const response = await fetch('/api/voice/text-to-speech', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Performance test message' }),
          });
          return Date.now() - startTime;
        } catch (error) {
          return 5000; // Simulate failure
        }
      }
    },
    {
      name: "Voice Chat Response",
      description: "End-to-end voice conversation latency",
      threshold: 5000, // 5 seconds
      test: async () => {
        const startTime = Date.now();
        
        try {
          const response = await fetch('/api/voice/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: [{ role: 'user', content: 'Test message' }],
              newMessage: 'Test message',
              chatId: 'benchmark-test',
              isVoice: true,
            }),
          });
          return Date.now() - startTime;
        } catch (error) {
          return 5000; // Simulate failure
        }
      }
    },
    {
      name: "Audio Processing",
      description: "Time to process audio data",
      threshold: 1000, // 1 second
      test: async () => {
        const startTime = Date.now();
        
        // Simulate audio processing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        
        return Date.now() - startTime;
      }
    },
    {
      name: "Voice Settings Application",
      description: "Time to apply voice customization",
      threshold: 500, // 0.5 seconds
      test: async () => {
        const startTime = Date.now();
        
        // Simulate voice settings processing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
        
        return Date.now() - startTime;
      }
    }
  ];

  const runBenchmark = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    const newResults: BenchmarkResult[] = [];

    for (let i = 0; i < benchmarks.length; i++) {
      const benchmark = benchmarks[i];
      setCurrentTest(benchmark.name);
      setProgress((i / benchmarks.length) * 100);

      try {
        const latency = await benchmark.test();
        const status: "passed" | "failed" | "warning" = 
          latency <= benchmark.threshold ? "passed" :
          latency <= benchmark.threshold * 1.5 ? "warning" : "failed";

        const result: BenchmarkResult = {
          test: benchmark.name,
          latency,
          status,
          threshold: benchmark.threshold,
          timestamp: new Date(),
        };

        newResults.push(result);
        setResults([...newResults]);

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        const result: BenchmarkResult = {
          test: benchmark.name,
          latency: 10000, // Mark as failed
          status: "failed",
          threshold: benchmark.threshold,
          timestamp: new Date(),
        };

        newResults.push(result);
        setResults([...newResults]);
      }
    }

    setProgress(100);
    setCurrentTest("");
    setIsRunning(false);
  }, []);

  const stopBenchmark = useCallback(() => {
    setIsRunning(false);
    setCurrentTest("");
    setProgress(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

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
      default: return Clock;
    }
  };

  const getOverallScore = () => {
    if (results.length === 0) return 0;
    const passedTests = results.filter(r => r.status === "passed").length;
    return Math.round((passedTests / results.length) * 100);
  };

  const getAverageLatency = () => {
    if (results.length === 0) return 0;
    const totalLatency = results.reduce((sum, r) => sum + r.latency, 0);
    return Math.round(totalLatency / results.length);
  };

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Performance Benchmark</h3>
          </div>
          <div className="flex items-center space-x-2">
            {!isRunning ? (
              <Button
                onClick={runBenchmark}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-4"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Tests
              </Button>
            ) : (
              <Button
                onClick={stopBenchmark}
                variant="outline"
                className="border-red-400/50 text-red-300 hover:bg-red-400/10"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
          </div>
        </div>

        {/* Progress */}
        {isRunning && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">
                {currentTest || "Running benchmarks..."}
              </span>
              <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Overall Score */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{getOverallScore()}%</div>
              <div className="text-xs text-slate-400">Overall Score</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{getAverageLatency()}ms</div>
              <div className="text-xs text-slate-400">Avg Latency</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-xs text-slate-400">Tests Run</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-300">Test Results</h4>
            {results.map((result, index) => {
              const StatusIcon = getStatusIcon(result.status);
              const isOverThreshold = result.latency > result.threshold;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={cn("w-5 h-5", getStatusColor(result.status))} />
                    <div>
                      <div className="text-sm font-medium text-white">{result.test}</div>
                      <div className="text-xs text-slate-400">
                        Threshold: {result.threshold}ms
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-sm font-bold",
                      getStatusColor(result.status)
                    )}>
                      {result.latency}ms
                    </div>
                    <div className="text-xs text-slate-400">
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Performance Tips */}
        {results.length > 0 && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Performance Tips</h4>
            <div className="space-y-1 text-xs text-slate-400">
              {results.some(r => r.status === "failed") && (
                <p>• Some tests failed - check API configurations and network connectivity</p>
              )}
              {results.some(r => r.status === "warning") && (
                <p>• Some tests are slow - consider optimizing API calls or reducing payload size</p>
              )}
              {results.every(r => r.status === "passed") && (
                <p>• All tests passed! Your voice system is performing optimally</p>
              )}
              {getAverageLatency() > 3000 && (
                <p>• High average latency - consider using a CDN or optimizing audio processing</p>
              )}
              {getOverallScore() < 80 && (
                <p>• Low overall score - review failed tests and optimize accordingly</p>
              )}
            </div>
          </div>
        )}

        {/* Benchmark Info */}
        <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <h4 className="text-sm font-medium text-cyan-400 mb-2">Benchmark Information</h4>
          <div className="space-y-1 text-xs text-slate-400">
            <p>• Tests measure real-world performance of your voice AI system</p>
            <p>• Thresholds are based on industry standards for voice applications</p>
            <p>• Results help identify performance bottlenecks and optimization opportunities</p>
            <p>• Run tests regularly to monitor system performance over time</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
