"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Mic, MicOff } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export default class VoiceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Voice Error Boundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-6 bg-red-500/10 border-red-500/20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Voice System Error
          </h3>
          
          <p className="text-slate-400 mb-4">
            Something went wrong with the voice system. This might be due to:
          </p>
          
          <ul className="text-sm text-slate-400 mb-6 text-left max-w-md mx-auto">
            <li className="flex items-center mb-2">
              <Mic className="w-4 h-4 mr-2 text-red-400" />
              Microphone permissions not granted
            </li>
            <li className="flex items-center mb-2">
              <MicOff className="w-4 h-4 mr-2 text-red-400" />
              Audio device not available
            </li>
            <li className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              Network connection issues
            </li>
            <li className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
              ElevenLabs API configuration
            </li>
          </ul>
          
          <div className="space-y-3">
            <Button
              onClick={this.handleRetry}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="text-xs text-slate-500">
              <p>If the problem persists, try:</p>
              <p>• Refreshing the page</p>
              <p>• Checking your microphone permissions</p>
              <p>• Verifying your internet connection</p>
            </div>
          </div>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-slate-400 cursor-pointer">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-red-400 bg-black/50 p-2 rounded overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </Card>
      );
    }

    return this.props.children;
  }
}
