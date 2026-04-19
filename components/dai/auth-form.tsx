"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "signup";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const endpoint = useMemo(() => (mode === "signup" ? "/api/auth/signup" : "/api/auth/login"), [mode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Authentication failed"); return; }
      if (data.apiKey) setSuccess(`Account created! Your first API key: ${data.apiKey}`);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    border: "1px solid rgba(255,120,0,0.14)",
    background: "rgba(8,8,26,0.85)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    padding: "2rem",
    boxShadow: "0 0 0 1px rgba(255,117,0,0.06), 0 32px 80px rgba(0,0,0,0.4)",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(4,4,14,0.8)",
    color: "#EDE8FF",
    fontSize: "0.9rem",
    padding: "11px 14px",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div style={card}>
      {/* Mode toggle */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(4,4,14,0.6)",
        padding: 4,
        marginBottom: "1.75rem",
        gap: 4,
      }}>
        {(["login", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(null); setSuccess(null); }}
            style={{
              borderRadius: 9,
              padding: "9px 0",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.2s",
              background: mode === m
                ? "linear-gradient(135deg, #FF7500, #FF3D6B)"
                : "transparent",
              color: mode === m ? "#fff" : "#6B6890",
              boxShadow: mode === m ? "0 2px 14px rgba(255,117,0,0.3)" : "none",
            }}
          >
            {m === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {mode === "signup" && (
          <div>
            <label style={{ fontSize: "0.75rem", color: "#6B6890", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
              Full Name
            </label>
            <input
              placeholder="Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputBase}
              onFocus={e => { e.target.style.borderColor = "rgba(255,117,0,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,117,0,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        )}

        <div>
          <label style={{ fontSize: "0.75rem", color: "#6B6890", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputBase}
            onFocus={e => { e.target.style.borderColor = "rgba(255,117,0,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,117,0,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div>
          <label style={{ fontSize: "0.75rem", color: "#6B6890", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputBase, paddingRight: 42 }}
              onFocus={e => { e.target.style.borderColor = "rgba(255,117,0,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,117,0,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#6B6890", cursor: "pointer",
                padding: 0, display: "flex", alignItems: "center",
              }}
            >
              <EyeIcon open={showPw} />
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            borderRadius: 10, border: "1px solid rgba(255,95,87,0.3)",
            background: "rgba(255,95,87,0.08)", padding: "9px 12px",
            fontSize: "0.8125rem", color: "#FF9B96",
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            borderRadius: 10, border: "1px solid rgba(0,229,176,0.25)",
            background: "rgba(0,229,176,0.07)", padding: "9px 12px",
            fontSize: "0.8125rem", color: "#00E5B0",
          }}>
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            borderRadius: 12,
            padding: "12px 0",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.9375rem",
            fontWeight: 700,
            fontFamily: "inherit",
            background: loading
              ? "rgba(255,117,0,0.4)"
              : "linear-gradient(135deg, #FF7500 0%, #FF3D6B 100%)",
            color: "#fff",
            boxShadow: loading ? "none" : "0 4px 20px rgba(255,117,0,0.32)",
            transition: "all 0.2s",
            marginTop: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 14, height: 14, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }} />
              Please wait…
            </>
          ) : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        margin: "1.25rem 0",
        fontSize: "0.75rem", color: "#38365A",
      }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
        or continue with
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>

      <a
        href="/api/auth/google/start"
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "rgba(255,255,255,0.04)",
          padding: "11px 0",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#9090A8",
          textDecoration: "none",
          fontFamily: "inherit",
          transition: "all 0.2s",
          boxSizing: "border-box",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "#EDE8FF"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color = "#9090A8"; }}
      >
        <GoogleIcon />
        Continue with Google
      </a>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
