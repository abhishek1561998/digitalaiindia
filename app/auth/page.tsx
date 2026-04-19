"use client";

import { AuthForm } from "@/components/dai/auth-form";
import { ThemeToggle } from "@/components/dai/theme-toggle";
import { Syne, Outfit } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const LogoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);

const errorMessages: Record<string, string> = {
  google_oauth_state_invalid:    "Session expired. Please try Google sign-in again.",
  google_token_exchange_failed:  "Google rejected the callback. Check the configured redirect URI.",
  google_identity_invalid:       "Your Google account could not be verified.",
  google_oauth_missing_config:   "Google OAuth environment variables are incomplete.",
  google_oauth_internal_error:   "Unexpected server error during Google sign-in.",
};

function AuthPageInner() {
  const searchParams = useSearchParams();
  const errorCode  = searchParams.get("error") ?? "";
  const errorReason = searchParams.get("reason") ?? "";
  const hasError   = Boolean(errorCode);
  const errorMsg   = errorReason || errorMessages[errorCode] || "";

  return (
    <div
      className={`${syne.variable} ${outfit.variable}`}
      style={{
        minHeight: "100vh",
        background: "var(--dai-bg)",
        fontFamily: "var(--font-outfit, sans-serif)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "background .3s, color .3s",
      }}
    >
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", width: 600, height: 600,
          top: -200, left: -100, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,117,0,0.13) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", width: 400, height: 400,
          bottom: -80, right: -60, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,176,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(var(--dai-text) 1px, transparent 1px), linear-gradient(90deg, var(--dai-text) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.018,
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%)",
        }} />
      </div>

      {/* Nav */}
      <nav style={{
        position: "relative", zIndex: 10,
        padding: "0 2rem", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--dai-border)",
        backdropFilter: "blur(20px)",
        background: "var(--dai-navBg)",
      }}>
        <a href="https://digitalaiindia.com" style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          {/* Logo box — matches landing page */}
          <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#FACC15,#F97316)", borderRadius: 10, opacity: 0.85 }} />
            <div style={{ position: "absolute", inset: 2, background: "linear-gradient(135deg,#111827,#000)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoIcon />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span style={{ fontFamily: "var(--font-syne,sans-serif)", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>
              <span style={{ background: "linear-gradient(90deg,#FACC15,#F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Digitalai</span>
              <span style={{ color: "var(--dai-text2)" }}>India.com</span>
            </span>
            <span style={{ fontSize: "0.6rem", color: "var(--dai-text3)", fontWeight: 500 }}>Future of AI</span>
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          <a href="https://digitalaiindia.com" style={{
            fontSize: "0.8125rem", color: "var(--dai-text3)",
            textDecoration: "none", transition: "color 0.2s",
            padding: "6px 12px", borderRadius: 8,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--dai-text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--dai-text3)")}
          >
            ← Home
          </a>
        </div>
      </nav>

      {/* Main */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 1.5rem", position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: "100%", maxWidth: 960,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "4rem", alignItems: "center",
        }}
          className="auth-grid"
        >
          {/* Left panel */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: "#FF7500",
              border: "1px solid rgba(255,117,0,0.22)",
              background: "rgba(255,117,0,0.08)",
              borderRadius: 100, padding: "5px 14px",
              fontSize: "0.75rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E5B0", boxShadow: "0 0 8px #00E5B0", display: "block" }} />
              Free to start
            </div>

            <h1 style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
              color: "var(--dai-text)", marginBottom: "1rem",
            }}>
              Build your first<br />
              <span style={{
                background: "linear-gradient(130deg, #FF7500, #FF3D6B)",
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>AI app today</span>
            </h1>

            <p style={{
              color: "var(--dai-text2)", fontSize: "1rem", lineHeight: 1.75,
              marginBottom: "2rem", maxWidth: 400,
            }}>
              One account. One API key. Access to Chat, Voice, 3D, and Design APIs — all free up to 1,000 requests a month.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { icon: "⚡", label: "API key ready in 30 seconds" },
                { icon: "🔑", label: "1 key for all 4 AI APIs" },
                { icon: "📊", label: "Usage dashboard included" },
                { icon: "🇮🇳", label: "Built & priced for India — from ₹0" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(255,117,0,0.08)",
                    border: "1px solid rgba(255,117,0,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", flexShrink: 0,
                  }}>{icon}</div>
                  <span style={{ fontSize: "0.875rem", color: "var(--dai-text2)" }}>{label}</span>
                </div>
              ))}
            </div>

            {hasError && (
              <div style={{
                marginTop: "1.5rem", borderRadius: 12,
                border: "1px solid rgba(255,95,87,0.28)",
                background: "rgba(255,95,87,0.07)",
                padding: "10px 14px", fontSize: "0.8125rem", color: "#D93025",
              }}>
                Google sign-in failed{errorMsg ? `: ${errorMsg}` : ""}. Please try again.
              </div>
            )}
          </div>

          {/* Right: Form */}
          <AuthForm />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center", padding: "1.25rem",
        fontSize: "0.75rem", color: "var(--dai-text3)",
        position: "relative", zIndex: 1,
        borderTop: "1px solid var(--dai-border)",
      }}>
        By signing up you agree to our terms · Made with ♥ for Indian developers
      </div>

      {/* Responsive: collapse to single column on small screens */}
      <style>{`
        @media (max-width: 700px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .auth-grid > div:first-child {
            display: none;
          }
        }
      `}</style>
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
