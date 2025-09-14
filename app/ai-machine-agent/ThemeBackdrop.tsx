"use client";

import { useMemo } from "react";

export default function ThemeBackdrop() {
  // precompute particle positions client-side to avoid hydration mismatch
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`,
      })),
    []
  );

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-900" />

      {/* Floating particles */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/90 rounded-full animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 md:left-20 w-72 h-72 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mix-blend-screen blur-3xl animate-blob" />
      <div className="absolute top-40 right-10 md:right-20 w-72 h-72 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-r from-teal-600/30 to-green-600/30 rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-4000" />

      {/* Neon grid mask */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
}
