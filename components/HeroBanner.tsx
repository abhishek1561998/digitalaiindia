"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignedIn } from "@clerk/nextjs";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  const [currentText, setCurrentText] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const texts = [
    "Future of AI Technology",
    "Intelligent Automation",
    "Digital Transformation",
    "AI-Powered Solutions"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 500); // Half of the transition duration
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Banner Background */}
      <div className="absolute inset-0">
        <Image
          src="/banner.png"
          alt="Digital AI India Banner"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 text-center">
        <div className="max-w-5xl mx-auto">
          {/* <div className="absolute -top-10 right-20 animate-bounce delay-2000">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Cpu className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="absolute top-20 -left-10 animate-bounce delay-3000">
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25">
              <Zap className="w-7 h-7 text-white" />
            </div>
          </div> */}

          {/* Main heading */}
          <div className="mb-8 mt-15">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Welcome to the
              </span>
              <br />
              <div className="relative h-24 md:h-32 lg:h-40 overflow-hidden">
                <span
                  className={`absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent transition-all duration-1000 ease-in-out ${
                    isAnimating
                      ? 'transform translate-y-full opacity-0'
                      : 'transform translate-y-0 opacity-100'
                  }`}
                >
                  {texts[currentText]}
                </span>
              </div>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-600 mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          {/* <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Experience the next generation of artificial intelligence with{" "}
            <span className="text-orange-400 font-semibold">Digitalaiindia.com</span>.
            Transform your business with cutting-edge AI solutions designed for the digital future.
          </p> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <SignedOut>
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/dashboard"
                forceRedirectUrl="/dashboard"
              >
                <Button
                  size="lg"
                  className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 border-0 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Your AI Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </SignInButton>
              {/* <Button
                variant="outline"
                size="lg"
                className="group px-8 py-4 text-lg font-semibold border-2 border-orange-400/50 text-orange-400 hover:bg-orange-400/10 hover:border-orange-400 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button> */}
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 border-0 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Access Dashboard
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="group px-8 py-4 text-lg font-semibold border-2 border-orange-400/50 text-orange-400 hover:bg-orange-400/10 hover:border-orange-400 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </SignedIn>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400 text-sm">AI Models Deployed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-400 text-sm">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-gray-400 text-sm">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-sm">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
