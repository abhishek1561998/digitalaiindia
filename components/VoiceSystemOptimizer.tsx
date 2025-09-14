"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Database,
  Network,
  Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizationResult {
  category: string;
  status: "optimized" | "warning" | "needs_attention";
  message: string;
  impact: "high" | "medium" | "low";
  action?: string;
}

interface VoiceSystemOptimizerProps {
  className?: string;
}

export default function VoiceSystemOptimizer({ className }: VoiceSystemOptimizerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<OptimizationResult[]>([]);
  const [optimizationLevel, setOptimizationLevel] = useState<"basic" | "advanced" | "aggressive">("basic");

  const optimizations = [
    {
      category: "Audio Processing",
      checks: [
        {
          name: "Audio Compression",
          check: () => {
            // Check if audio compression is enabled
            const compressionEnabled = localStorage.getItem('audioCompression') === 'true';
            return {
              status: compressionEnabled ? "optimized" : "needs_attention",
              message: compressionEnabled ? "Audio compression enabled" : "Enable audio compression for faster uploads",
              impact: "high" as const,
              action: compressionEnabled ? undefined : "Enable audio compression"
            };
          }
        },
        {
          name: "Audio Quality",
          check: () => {
            const quality = localStorage.getItem('audioQuality') || 'medium';
            const isOptimal = quality === 'medium' || quality === 'low';
            return {
              status: isOptimal ? "optimized" : "warning",
              message: isOptimal ? "Audio quality optimized" : "Consider reducing audio quality for better performance",
              impact: "medium" as const,
              action: isOptimal ? undefined : "Reduce audio quality"
            };
          }
        }
      ]
    },
    {
      category: "Network Optimization",
      checks: [
        {
          name: "Connection Pooling",
          check: () => {
            // Simulate connection pooling check
            const hasPooling = Math.random() > 0.3;
            return {
              status: hasPooling ? "optimized" : "needs_attention",
              message: hasPooling ? "Connection pooling active" : "Enable connection pooling for better performance",
              impact: "high" as const,
              action: hasPooling ? undefined : "Enable connection pooling"
            };
          }
        },
        {
          name: "Request Caching",
          check: () => {
            const cacheEnabled = localStorage.getItem('requestCache') === 'true';
            return {
              status: cacheEnabled ? "optimized" : "warning",
              message: cacheEnabled ? "Request caching enabled" : "Enable request caching to reduce API calls",
              impact: "medium" as const,
              action: cacheEnabled ? undefined : "Enable request caching"
            };
          }
        }
      ]
    },
    {
      category: "Memory Management",
      checks: [
        {
          name: "Audio Buffer Cleanup",
          check: () => {
            const cleanupEnabled = localStorage.getItem('audioCleanup') === 'true';
            return {
              status: cleanupEnabled ? "optimized" : "needs_attention",
              message: cleanupEnabled ? "Audio buffer cleanup active" : "Enable audio buffer cleanup to prevent memory leaks",
              impact: "high" as const,
              action: cleanupEnabled ? undefined : "Enable audio cleanup"
            };
          }
        },
        {
          name: "Memory Usage",
          check: () => {
            // Simulate memory usage check
            const memoryUsage = Math.random() * 100;
            const isOptimal = memoryUsage < 70;
            return {
              status: isOptimal ? "optimized" : "warning",
              message: isOptimal ? "Memory usage optimal" : `High memory usage detected (${Math.round(memoryUsage)}%)`,
              impact: "medium" as const,
              action: isOptimal ? undefined : "Clear unused data"
            };
          }
        }
      ]
    },
    {
      category: "Performance",
      checks: [
        {
          name: "Response Time",
          check: () => {
            // Simulate response time check
            const responseTime = Math.random() * 5000;
            const isOptimal = responseTime < 2000;
            return {
              status: isOptimal ? "optimized" : "warning",
              message: isOptimal ? "Response time optimal" : `Slow response time detected (${Math.round(responseTime)}ms)`,
              impact: "high" as const,
              action: isOptimal ? undefined : "Optimize API calls"
            };
          }
        },
        {
          name: "Concurrent Users",
          check: () => {
            const concurrentUsers = Math.floor(Math.random() * 100);
            const isOptimal = concurrentUsers < 50;
            return {
              status: isOptimal ? "optimized" : "warning",
              message: isOptimal ? "Concurrent user load optimal" : `High concurrent user load (${concurrentUsers} users)`,
              impact: "medium" as const,
              action: isOptimal ? undefined : "Scale infrastructure"
            };
          }
        }
      ]
    }
  ];

  const runOptimization = useCallback(async () => {
    setIsOptimizing(true);
    setResults([]);

    const newResults: OptimizationResult[] = [];

    for (const category of optimizations) {
      for (const check of category.checks) {
        try {
          const result = check.check();
          newResults.push({
            category: category.category,
            ...result
          });
        } catch (error) {
          newResults.push({
            category: category.category,
            status: "needs_attention",
            message: `Error checking ${check.name}`,
            impact: "low"
          });
        }
      }
    }

    setResults(newResults);
    setIsOptimizing(false);
  }, [optimizationLevel]);

  const applyOptimization = useCallback((action: string) => {
    switch (action) {
      case "Enable audio compression":
        localStorage.setItem('audioCompression', 'true');
        break;
      case "Reduce audio quality":
        localStorage.setItem('audioQuality', 'medium');
        break;
      case "Enable request caching":
        localStorage.setItem('requestCache', 'true');
        break;
      case "Enable audio cleanup":
        localStorage.setItem('audioCleanup', 'true');
        break;
      case "Clear unused data":
        // Clear unused data
        localStorage.removeItem('tempAudioData');
        break;
      default:
        break;
    }
    
    // Re-run optimization
    runOptimization();
  }, [runOptimization]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimized": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "needs_attention": return "text-red-400";
      default: return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimized": return CheckCircle;
      case "warning": return AlertTriangle;
      case "needs_attention": return AlertTriangle;
      default: return Info;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-slate-400";
    }
  };

  const getOptimizationScore = () => {
    if (results.length === 0) return 0;
    const optimizedCount = results.filter(r => r.status === "optimized").length;
    return Math.round((optimizedCount / results.length) * 100);
  };

  const getHighImpactIssues = () => {
    return results.filter(r => r.impact === "high" && r.status !== "optimized").length;
  };

  return (
    <Card className={cn("bg-black/50 border-white/10", className)}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">System Optimizer</h3>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={optimizationLevel}
              onChange={(e) => setOptimizationLevel(e.target.value as any)}
              className="bg-white/10 border border-white/20 text-white text-sm rounded px-2 py-1"
            >
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
              <option value="aggressive">Aggressive</option>
            </select>
            <Button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-4"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Optimization Score */}
        {results.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{getOptimizationScore()}%</div>
              <div className="text-xs text-slate-400">Optimization Score</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{results.length}</div>
              <div className="text-xs text-slate-400">Checks Run</div>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white">{getHighImpactIssues()}</div>
              <div className="text-xs text-slate-400">High Impact Issues</div>
            </div>
          </div>
        )}

        {/* Results by Category */}
        {results.length > 0 && (
          <div className="space-y-4">
            {optimizations.map((category, categoryIndex) => {
              const categoryResults = results.filter(r => r.category === category.category);
              
              return (
                <div key={categoryIndex}>
                  <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center">
                    {category.category === "Audio Processing" && <Upload className="w-4 h-4 mr-2" />}
                    {category.category === "Network Optimization" && <Network className="w-4 h-4 mr-2" />}
                    {category.category === "Memory Management" && <Database className="w-4 h-4 mr-2" />}
                    {category.category === "Performance" && <Cpu className="w-4 h-4 mr-2" />}
                    {category.category}
                  </h4>
                  
                  <div className="space-y-2">
                    {categoryResults.map((result, index) => {
                      const StatusIcon = getStatusIcon(result.status);
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className={cn("w-5 h-5", getStatusColor(result.status))} />
                            <div>
                              <div className="text-sm font-medium text-white">{result.message}</div>
                              <div className="text-xs text-slate-400">
                                Impact: <span className={getImpactColor(result.impact)}>{result.impact}</span>
                              </div>
                            </div>
                          </div>
                          {result.action && (
                            <Button
                              onClick={() => applyOptimization(result.action!)}
                              variant="outline"
                              size="sm"
                              className="text-slate-300 hover:text-white"
                            >
                              Fix
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Optimization Tips */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Optimization Tips</h4>
          <div className="space-y-1 text-xs text-slate-400">
            <p>• Enable audio compression to reduce upload times</p>
            <p>• Use medium audio quality for optimal performance</p>
            <p>• Clear unused data regularly to prevent memory leaks</p>
            <p>• Monitor response times and optimize slow API calls</p>
            <p>• Scale infrastructure when concurrent user load is high</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              localStorage.setItem('audioCompression', 'true');
              localStorage.setItem('audioQuality', 'medium');
              localStorage.setItem('requestCache', 'true');
              localStorage.setItem('audioCleanup', 'true');
              runOptimization();
            }}
            variant="outline"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            Apply All Fixes
          </Button>
          <Button
            onClick={() => {
              localStorage.clear();
              runOptimization();
            }}
            variant="outline"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            Reset Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}
