"use client";

import { useEffect, useState } from "react";

/**
 * Voice Integrations — the dashboard panel where a user connects a TTS
 * provider with their own API key (BYOK). Pick Sarvam AI or ElevenLabs, paste
 * the key, and the voice/tts API immediately uses it — no Vercel env editing.
 *
 * The raw key is sent once over HTTPS to /api/dashboard/integrations, validated
 * against the provider, encrypted server-side, and never returned to the
 * browser (we only ever show the last 4 chars).
 */

type Provider = "sarvam" | "elevenlabs";

interface Integration {
  provider: Provider;
  connected: boolean;
  keyLastFour: string | null;
  isActive: boolean;
  settings: Record<string, any> | null;
  updatedAt: string | null;
}

const META: Record<
  Provider,
  { name: string; tag: string; blurb: string; placeholder: string; help: string }
> = {
  sarvam: {
    name: "Sarvam AI",
    tag: "Hindi-native · recommended",
    blurb: "India ke liye bana TTS — Hindi pronunciation aur prosody sabse natural (bulbul voices).",
    placeholder: "Sarvam API subscription key",
    help: "https://dashboard.sarvam.ai",
  },
  elevenlabs: {
    name: "ElevenLabs",
    tag: "Multilingual",
    blurb: "High-quality multilingual voices, English-first. Hindi multilingual model se chalta hai.",
    placeholder: "ElevenLabs API key (xi-api-key)",
    help: "https://elevenlabs.io/app/settings/api-keys",
  },
};

export function VoiceIntegrations({ onChange }: { onChange?: () => void }) {
  const [items, setItems] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/dashboard/integrations", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems(data.integrations || []);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function connect(provider: Provider) {
    const apiKey = (drafts[provider] || "").trim();
    if (!apiKey) return;
    setBusy(provider);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.detail ? `${data.error}: ${data.detail}` : data?.error || `HTTP ${res.status}`
        );
      }
      setItems(data.integrations || []);
      setDrafts((d) => ({ ...d, [provider]: "" }));
      setEditing((e) => ({ ...e, [provider]: false }));
      onChange?.();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  async function setActive(provider: Provider) {
    setBusy(provider);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/integrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems(data.integrations || []);
      onChange?.();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  async function disconnect(provider: Provider) {
    if (!confirm(`${META[provider].name} disconnect karein?`)) return;
    setBusy(provider);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/integrations?provider=${provider}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setItems(data.integrations || []);
      onChange?.();
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(null);
    }
  }

  const anyActive = items.some((i) => i.isActive);

  return (
    <div style={wrap}>
      <header style={{ marginBottom: 4 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🔌 Voice Integrations</h2>
        <p style={{ margin: "4px 0 0", opacity: 0.7, fontSize: 13 }}>
          Apni provider key connect karo → jo active hai usi se{" "}
          <code style={code}>/api/v1/voice/tts</code> audio banata hai. Koi Vercel env edit
          nahi.
        </p>
      </header>

      {error && <div style={errBox}>{error}</div>}
      {!loading && !anyActive && (
        <div style={hintBox}>
          Abhi koi provider active nahi hai — niche se ek connect karo. (Tab tak KhabarLoktantra
          jaisi sites free device-voice par chalti rahengi.)
        </div>
      )}

      <div style={grid}>
        {(["sarvam", "elevenlabs"] as Provider[]).map((p) => {
          const it = items.find((i) => i.provider === p);
          const m = META[p];
          const connected = Boolean(it?.connected);
          const isActive = Boolean(it?.isActive);
          const showInput = !connected || editing[p];
          const isBusy = busy === p;
          return (
            <div key={p} style={{ ...card, borderColor: isActive ? "#16a34a" : "rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{m.name}</div>
                  <div style={{ fontSize: 11, opacity: 0.65, fontWeight: 600 }}>{m.tag}</div>
                </div>
                {isActive ? (
                  <span style={activeBadge}>● Active</span>
                ) : connected ? (
                  <span style={connectedBadge}>Connected</span>
                ) : null}
              </div>

              <p style={{ margin: "8px 0 10px", fontSize: 12.5, lineHeight: 1.5, opacity: 0.8 }}>
                {m.blurb}
              </p>

              {connected && !showInput && (
                <div style={keyRow}>
                  Key: <code style={code}>••••••{it?.keyLastFour}</code>
                </div>
              )}

              {showInput && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input
                    type="password"
                    value={drafts[p] || ""}
                    placeholder={m.placeholder}
                    onChange={(e) => setDrafts((d) => ({ ...d, [p]: e.target.value }))}
                    style={input}
                    autoComplete="off"
                  />
                  <a href={m.help} target="_blank" rel="noopener noreferrer" style={helpLink}>
                    Key kahan se milegi? ↗
                  </a>
                </div>
              )}

              <div style={btnRow}>
                {showInput ? (
                  <>
                    <button
                      onClick={() => connect(p)}
                      disabled={isBusy || !(drafts[p] || "").trim()}
                      style={{ ...primaryBtn, opacity: isBusy || !(drafts[p] || "").trim() ? 0.6 : 1 }}
                    >
                      {isBusy ? "Checking…" : connected ? "Save key" : "Connect"}
                    </button>
                    {connected && (
                      <button
                        onClick={() => setEditing((e) => ({ ...e, [p]: false }))}
                        style={ghostBtn}
                        disabled={isBusy}
                      >
                        Cancel
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    {!isActive && (
                      <button onClick={() => setActive(p)} disabled={isBusy} style={primaryBtn}>
                        {isBusy ? "…" : "Set active"}
                      </button>
                    )}
                    <button
                      onClick={() => setEditing((e) => ({ ...e, [p]: true }))}
                      style={ghostBtn}
                      disabled={isBusy}
                    >
                      Replace key
                    </button>
                    <button onClick={() => disconnect(p)} style={dangerBtn} disabled={isBusy}>
                      Disconnect
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 16, display: "flex", flexDirection: "column", gap: 12 };
const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 12,
};
const card: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 14,
  padding: 16,
  background: "rgba(255,255,255,0.6)",
  display: "flex",
  flexDirection: "column",
};
const code: React.CSSProperties = {
  background: "rgba(0,0,0,0.06)",
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 12,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
};
const keyRow: React.CSSProperties = { fontSize: 12.5, opacity: 0.8, marginBottom: 4 };
const input: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.18)",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
};
const helpLink: React.CSSProperties = { fontSize: 11.5, color: "#2563eb", textDecoration: "none", fontWeight: 600 };
const btnRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };
const primaryBtn: React.CSSProperties = {
  padding: "8px 16px",
  border: "none",
  borderRadius: 8,
  background: "#dc2626",
  color: "#fff",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: "1px solid rgba(0,0,0,0.18)",
  borderRadius: 8,
  background: "transparent",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};
const dangerBtn: React.CSSProperties = {
  padding: "8px 14px",
  border: "1px solid rgba(220,38,38,0.4)",
  borderRadius: 8,
  background: "transparent",
  color: "#dc2626",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};
const activeBadge: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#16a34a",
  background: "rgba(34,197,94,0.12)",
  padding: "3px 10px",
  borderRadius: 999,
};
const connectedBadge: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#475569",
  background: "rgba(71,85,105,0.12)",
  padding: "3px 10px",
  borderRadius: 999,
};
const errBox: React.CSSProperties = {
  padding: "10px 14px",
  background: "rgba(220,38,38,0.08)",
  border: "1px solid rgba(220,38,38,0.3)",
  borderRadius: 10,
  color: "#dc2626",
  fontSize: 13,
};
const hintBox: React.CSSProperties = {
  padding: "10px 14px",
  background: "rgba(234,179,8,0.1)",
  border: "1px solid rgba(234,179,8,0.35)",
  borderRadius: 10,
  fontSize: 12.5,
};
