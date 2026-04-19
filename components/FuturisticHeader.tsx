"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "PRO";
  monthlyLimit: number;
};

export default function FuturisticHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!active) {
          return;
        }

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data.user ?? null);
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  const PLATFORM = "https://platform.digitalaiindia.com";
  const primaryHref = user ? `${PLATFORM}/dashboard` : `${PLATFORM}/auth`;
  const secondaryHref = user ? `${PLATFORM}/dashboard` : `${PLATFORM}/auth`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-yellow-800/20 backdrop-blur-xl border-b border-yellow-400/30 shadow-lg shadow-yellow-500/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Futuristic Logo */}
          <Link
            href="/"
            className="flex items-center space-x-4 group relative z-20"
          >
            <div className="relative">
              {/* Main logo container with multiple layers */}
              <div className="relative w-12 h-12 group-hover:scale-105 transition-all duration-300">
                {/* Clean logo container */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Inner core */}
                <div className="absolute inset-1 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-yellow-400 group-hover:text-orange-300 transition-colors duration-300" />
                </div>

                {/* Subtle glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
            </div>

            <div className="hidden sm:block">
              {/* Company name with enhanced typography */}
              <div className="relative">
                <h1 className="text-xl xl:text-2xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300">
                    Digitalai
                  </span>
                  <span className="text-gray-400 group-hover:text-yellow-300 transition-colors duration-300">
                    India.com
                  </span>
                </h1>

                {/* Clean tagline */}
                <div className="flex items-center space-x-1 -mt-1">
                  <p className="text-xs text-gray-400 group-hover:text-yellow-400 transition-colors duration-300 font-medium">
                    Future of AI
                  </p>
                </div>

                {/* Subtle underline effect */}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/ai-machine-agent"
              className="relative text-gray-300 hover:text-yellow-400 transition-colors duration-300 group"
            >
              Machine Agent AI
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              {/* Clean "new" badge */}
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-yellow-500 rounded-full"></span>
            </Link>
            <Link
              href="#solutions"
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 relative group"
            >
              Solutions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#about"
              className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!user ? (
              <>
                <a href={secondaryHref}>
                  <Button
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400"
                  >
                    {authLoading ? "Loading..." : "Sign In"}
                  </Button>
                </a>
                <a href={primaryHref}>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-0 shadow-lg hover:shadow-yellow-500/25 group">
                    Get Started
                    <Sparkles className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </a>
              </>
            ) : (
              <a href={primaryHref}>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-0 shadow-lg hover:shadow-yellow-500/25 group">
                  Dashboard
                  <Zap className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-yellow-900/20 via-orange-900/20 to-yellow-800/20 backdrop-blur-xl border-b border-yellow-400/30 z-40">
            <nav className="flex flex-col space-y-4 p-6">
              <Link
                href="/ai-machine-agent"
                className="relative text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Machine Agent AI
                {/* Clean badge */}
                <span className="absolute -top-1 left-28 w-2 h-2 bg-yellow-500 rounded-full"></span>
              </Link>

              <Link
                href="#features"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#solutions"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="#about"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-700">
                {!user ? (
                  <>
                    <a href={secondaryHref} className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 w-full"
                      >
                        {authLoading ? "Loading..." : "Sign In"}
                      </Button>
                    </a>
                    <a href={primaryHref} className="w-full" onClick={() => setIsMenuOpen(false)}>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-0 w-full">
                        Get Started
                      </Button>
                    </a>
                  </>
                ) : (
                  <a href={primaryHref} className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white border-0 w-full">
                      Dashboard
                    </Button>
                  </a>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
