"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "signup";

export function AuthForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }

      if (data.apiKey) {
        setSuccess(`Account created. Save your first API key: ${data.apiKey}`);
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
      <div className="mb-4 grid grid-cols-2 rounded-xl border border-white/10 bg-slate-950 p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg px-3 py-2 ${mode === "login" ? "bg-blue-500 text-white" : "text-slate-300"}`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`rounded-lg px-3 py-2 ${mode === "signup" ? "bg-blue-500 text-white" : "text-slate-300"}`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" ? (
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-slate-950 px-3 py-2"
          />
        ) : null}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-slate-950 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-slate-950 px-3 py-2"
          required
        />

        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-white/10" />
        or
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <a
        href="/api/auth/google/start"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-white/10"
      >
        <span aria-hidden>G</span>
        Continue with Google
      </a>
    </div>
  );
}
