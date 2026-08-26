"use client";

import { AuthForm } from "@/components/dai/auth-form";
import { ThemeToggle } from "@/components/dai/theme-toggle";
import { Syne, Outfit } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BrandMark } from "@/components/dai/BrandLogo";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const LogoIcon = () => <BrandMark size={18} />;

const errorMessages: Record<string, string> = {
  google_oauth_state_invalid:    "Session expired. Please try Google sign-in again.",
  google_token_exchange_failed:  "Google rejected the callback. Check the configured redirect URI.",
  google_identity_invalid:       "Your Google account could not be verified.",
  google_oauth_missing_config:   "Google OAuth environment variables are incomplete.",
  google_oauth_internal_error:   "Unexpected server error during Google sign-in.",
};

function AuthPageInner() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") ?? "";
  const isLearn = redirectParam.startsWith("/learn");
  const homeUrl = isLearn ? "https://learn.digitalaiindia.com" : "https://digitalaiindia.com";
  const copy = isLearn
    ? {
        badge: "Free to learn",
        titleTop: "Start building",
        titleAccent: "real skills today",
        sub: "Seven project-based tracks — JavaScript, Python, DSA, and a four-course generative AI path. Every lesson ends with something you build.",
        points: [
          { icon: "🧭", label: "One lesson a day, free forever" },
          { icon: "🛠️", label: "Real projects, not just videos" },
          { icon: "✅", label: "Quizzes that check you understood" },
          { icon: "🔥", label: "Streaks, XP, badges and weekly leagues" },
        ],
      }
    : {
        badge: "Free to start",
        titleTop: "Build your first",
        titleAccent: "AI app today",
        sub: "One account. One API key. Access to Chat, Voice, 3D, and Design APIs — all free up to 1,000 requests a month.",
        points: [
          { icon: "⚡", label: "API key ready in 30 seconds" },
          { icon: "🔑", label: "1 key for all 4 AI APIs" },
          { icon: "📊", label: "Usage dashboard included" },
          { icon: "🇮🇳", label: "Built & priced for India — from ₹0" },
        ],
      };
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
        <a href={homeUrl} style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <div style={{
            width: 34, height: 34, flexShrink: 0, borderRadius: 10,
            background: "linear-gradient(135deg,#FF7500,#FF3D6B)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LogoIcon />
          </div>
          <span style={{
            fontFamily: "var(--font-syne,sans-serif)", fontWeight: 700,
            fontSize: "1.05rem", letterSpacing: "-0.02em", color: "var(--dai-text)",
          }}>
            DigitalAI<span style={{ color: "#FF7500" }}>India</span>
          </span>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          <a href={homeUrl} style={{
            fontSize: "0.8125rem", color: "var(--dai-text3)",
            textDecoration: "none", transition: "color 0.2s",
            padding: "6px 12px", borderRadius: 8,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--dai-text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--dai-text3)")}
          >
            {isLearn ? "← Learn" : "← Home"}
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
              {copy.badge}
            </div>

            <h1 style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontSize: "clamp(1.875rem, 3.5vw, 2.625rem)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1,
              color: "var(--dai-text)", marginBottom: "1rem",
            }}>
              {copy.titleTop}<br />
              <span style={{
                background: "linear-gradient(130deg, #FF7500, #FF3D6B)",
                WebkitBackgroundClip: "text", backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>{copy.titleAccent}</span>
            </h1>

            <p style={{
              color: "var(--dai-text2)", fontSize: "1rem", lineHeight: 1.75,
              marginBottom: "2rem", maxWidth: 400,
            }} className="auth-sub">
              {copy.sub}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }} className="auth-points">
              {copy.points.map(({ icon, label }) => (
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
        @media (max-width: 860px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            max-width: 460px !important;
          }
        }
        /* On phones the long paragraph goes, but the badge, headline and the
           four benefit lines stay — they're compact and they're the reason
           someone completes the signup. */
        @media (max-width: 560px) {
          .auth-sub { display: none; }
          .auth-grid { gap: 1.5rem !important; }
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
