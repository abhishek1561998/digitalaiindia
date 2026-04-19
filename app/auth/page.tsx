"use client";

import Link from "next/link";
import { AuthForm } from "@/components/dai/auth-form";
import { Syne, Outfit } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

function AuthPageInner() {
  const searchParams = useSearchParams();
  const hasGoogleError = Boolean(searchParams.get("error"));
  const googleReason = searchParams.get("reason") ?? "";

  return (
    <div
      className={`${syne.variable} ${outfit.variable}`}
      style={{
        minHeight: "100vh",
        background: "#04040E",
        fontFamily: "var(--font-outfit, sans-serif)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          top: -200, left: -100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,117,0,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400,
          bottom: -80, right: -60, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,176,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(240,232,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(240,232,255,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.018,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "relative", zIndex: 10,
        padding: "0 2rem", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,120,0,0.07)",
        backdropFilter: "blur(20px)", background: "rgba(4,4,14,0.85)",
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-syne, sans-serif)",
          fontSize: "1.05rem", fontWeight: 700, letterSpacing: "-0.02em",
          color: "#EDE8FF", textDecoration: "none",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg, #FF7500, #FF3D6B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px rgba(255,117,0,0.4)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          DigitalAI<span style={{ color: "#FF7500" }}>India</span>
        </Link>
        <Link href="/" style={{
          fontSize: "0.8125rem", color: "#6B6890",
          textDecoration: "none", transition: "color 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "#EDE8FF")}
          onMouseLeave={e => (e.currentTarget.style.color = "#6B6890")}
        >
          ← Back to home
        </Link>
      </nav>

      {/* Main */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 1.5rem", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", maxWidth: 960,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "5rem", alignItems: "center",
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#FF7500",
              border: "1px solid rgba(255,117,0,0.22)", background: "rgba(255,117,0,0.08)",
              borderRadius: 100, padding: "5px 14px",
              fontSize: "0.75rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5B0", display: "block" }} />
              Free to start
            </div>

            <h1 style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
              color: "#EDE8FF", marginBottom: "1rem",
            }}>
              Build your first<br />
              <span style={{
                background: "linear-gradient(130deg, #FF7500, #FF3D6B)",
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>AI app today</span>
            </h1>

            <p style={{
              color: "#6B6890", fontSize: "1rem", lineHeight: 1.75,
              marginBottom: "2rem", maxWidth: 400,
            }}>
              One account. One API key. Access to Chat, Voice, 3D, and Design APIs — all free up to 1,000 requests a month.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                { icon: "⚡", label: "API key ready in 30 seconds" },
                { icon: "🔑", label: "1 key for all 4 AI APIs" },
                { icon: "📊", label: "Usage dashboard included" },
                { icon: "🇮🇳", label: "Built & priced for India — from ₹0" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(255,117,0,0.08)", border: "1px solid rgba(255,117,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", flexShrink: 0,
                  }}>{icon}</div>
                  <span style={{ fontSize: "0.875rem", color: "#9090A8" }}>{label}</span>
                </div>
              ))}
            </div>

            {hasGoogleError && (
              <div style={{
                marginTop: "1.5rem", borderRadius: 12,
                border: "1px solid rgba(255,95,87,0.3)", background: "rgba(255,95,87,0.08)",
                padding: "10px 14px", fontSize: "0.8125rem", color: "#FF9B96",
              }}>
                Google sign-in failed{googleReason ? `: ${googleReason}` : ""}. Please try again.
              </div>
            )}
          </div>

          {/* Right: Form */}
          <AuthForm />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "1.5rem",
        fontSize: "0.75rem", color: "#38365A",
        position: "relative", zIndex: 1,
      }}>
        By signing up you agree to our terms · Made with ♥ for Indian developers
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}
