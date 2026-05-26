"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Voice Library — dashboard tab where the customer picks a TTS voice
 * without ever needing to think about the underlying provider.
 *
 * Flow:
 *   1. Fetch /api/dashboard/voices (curated ElevenLabs catalog)
 *   2. Show filter chips (gender, accent, use case)
 *   3. Render voice cards — name, traits, ▶ preview, 📋 copy voiceId
 *   4. Single hidden <audio> element so only one preview plays at a time
 *
 * NO API key needed in the browser — the GET endpoint is dashboard-auth'd.
 */

interface Voice {
  voiceId: string;
  name: string;
  category: string;
  description: string;
  previewUrl: string | null;
  labels: {
    gender?: string;
    accent?: string;
    age?: string;
    useCase?: string;
    descriptive?: string;
  };
}

export function VoiceLibrary() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterUseCase, setFilterUseCase] = useState<string>("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dashboard/voices", { cache: "no-store" })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.message || data?.error || `HTTP ${r.status}`);
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setVoices(Array.isArray(data.voices) ? data.voices : []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || String(err));
        setLoading(false);
      });
    return () => {
      cancelled = true;
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {}
      }
    };
  }, []);

  // Build filter options from the live data — no hardcoded enum that
  // could drift from ElevenLabs' actual label vocabulary.
  const genderOptions = useMemo(() => {
    const set = new Set<string>();
    voices.forEach((v) => v.labels.gender && set.add(v.labels.gender));
    return ["all", ...Array.from(set).sort()];
  }, [voices]);

  const useCaseOptions = useMemo(() => {
    const set = new Set<string>();
    voices.forEach((v) => v.labels.useCase && set.add(v.labels.useCase));
    return ["all", ...Array.from(set).sort()];
  }, [voices]);

  const filtered = useMemo(() => {
    return voices.filter((v) => {
      if (filterGender !== "all" && v.labels.gender !== filterGender) return false;
      if (filterUseCase !== "all" && v.labels.useCase !== filterUseCase) return false;
      return true;
    });
  }, [voices, filterGender, filterUseCase]);

  function togglePreview(voice: Voice) {
    if (!voice.previewUrl) return;
    // Stop any current playback
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {}
    }
    // Toggle off if same voice
    if (playingId === voice.voiceId) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(voice.previewUrl);
    audio.onended = () => setPlayingId((p) => (p === voice.voiceId ? null : p));
    audio.onerror = () => setPlayingId((p) => (p === voice.voiceId ? null : p));
    audioRef.current = audio;
    audio.play().catch(() => setPlayingId(null));
    setPlayingId(voice.voiceId);
  }

  async function copyId(voice: Voice) {
    try {
      await navigator.clipboard.writeText(voice.voiceId);
      setCopiedId(voice.voiceId);
      setTimeout(() => setCopiedId((c) => (c === voice.voiceId ? null : c)), 1500);
    } catch {}
  }

  if (loading) {
    return <div style={loadingStyle}>Voices load ho rahi hain…</div>;
  }
  if (error) {
    return (
      <div style={errorStyle}>
        <strong>Voice Library unavailable.</strong>
        <br />
        <span style={{ opacity: 0.8 }}>{error}</span>
        <br />
        <span style={{ fontSize: 12, opacity: 0.6, marginTop: 8, display: "block" }}>
          (Sirf admin: ELEVENLABS_API_KEY check karo Vercel env me.)
        </span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>🎙️ Voice Library</h2>
        <p style={{ margin: "4px 0 0", opacity: 0.7, fontSize: 14 }}>
          Voice select karo → preview play karke sun lo → ID copy karke apne SDK call me daalo.
          Yahaan se chuni hui ID seedhi <code style={codeStyle}>/api/v1/voice/tts</code> me{" "}
          <code style={codeStyle}>voiceId</code> ke saath bhej do.
        </p>
      </header>

      {/* Filter chips */}
      <div style={filterRowStyle}>
        <FilterGroup
          label="Gender"
          value={filterGender}
          options={genderOptions}
          onChange={setFilterGender}
        />
        <FilterGroup
          label="Use case"
          value={filterUseCase}
          options={useCaseOptions}
          onChange={setFilterUseCase}
        />
        <div style={{ marginLeft: "auto", fontSize: 13, opacity: 0.7 }}>
          {filtered.length} / {voices.length} voices
        </div>
      </div>

      {/* Card grid */}
      <div style={gridStyle}>
        {filtered.map((v) => {
          const isPlaying = playingId === v.voiceId;
          const wasCopied = copiedId === v.voiceId;
          return (
            <div key={v.voiceId} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{v.name}</h3>
                <span style={categoryStyle}>{v.category}</span>
              </div>

              <div style={labelsRowStyle}>
                {v.labels.gender && <span style={chipStyle}>{v.labels.gender}</span>}
                {v.labels.accent && <span style={chipStyle}>{v.labels.accent}</span>}
                {v.labels.useCase && <span style={chipStyle}>{v.labels.useCase}</span>}
                {v.labels.descriptive && <span style={chipStyle}>{v.labels.descriptive}</span>}
              </div>

              {v.description && (
                <p style={descStyle}>
                  {v.description.length > 110 ? v.description.slice(0, 107) + "…" : v.description}
                </p>
              )}

              <code style={voiceIdStyle}>{v.voiceId}</code>

              <div style={buttonRowStyle}>
                <button
                  onClick={() => togglePreview(v)}
                  disabled={!v.previewUrl}
                  style={{
                    ...primaryBtnStyle,
                    background: isPlaying ? "#1ebe5b" : "#dc2626",
                    opacity: v.previewUrl ? 1 : 0.4,
                    cursor: v.previewUrl ? "pointer" : "not-allowed",
                  }}
                >
                  {isPlaying ? "⏸ Stop" : "▶ Preview"}
                </button>
                <button onClick={() => copyId(v)} style={secondaryBtnStyle}>
                  {wasCopied ? "✓ Copied" : "📋 Copy ID"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={emptyStyle}>
          Is filter ke saath koi voice nahi mili. Filter reset karo.
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{label}:</span>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${active ? "#dc2626" : "rgba(0,0,0,0.15)"}`,
              background: active ? "#dc2626" : "transparent",
              color: active ? "#fff" : "inherit",
              fontSize: 12,
              fontWeight: active ? 600 : 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Styles (kept inline so this component can drop into any dashboard
//    layout without depending on css modules). ─────────────────────────────
const containerStyle: React.CSSProperties = {
  padding: 16,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const headerStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  paddingBottom: 12,
};
const codeStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.06)",
  padding: "2px 6px",
  borderRadius: 4,
  fontSize: 12,
};
const filterRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  alignItems: "center",
};
const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 12,
};
const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  background: "rgba(255,255,255,0.5)",
};
const categoryStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  fontWeight: 600,
  opacity: 0.6,
};
const labelsRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
};
const chipStyle: React.CSSProperties = {
  padding: "2px 8px",
  background: "rgba(220,38,38,0.08)",
  color: "#dc2626",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  textTransform: "capitalize",
};
const descStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.5,
  opacity: 0.8,
  minHeight: 18,
};
const voiceIdStyle: React.CSSProperties = {
  fontSize: 11,
  background: "rgba(0,0,0,0.05)",
  padding: "4px 8px",
  borderRadius: 6,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  wordBreak: "break-all",
};
const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: 4,
};
const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 12px",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  transition: "all 0.15s ease",
};
const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px 12px",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 8,
  background: "transparent",
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
};
const loadingStyle: React.CSSProperties = {
  padding: 40,
  textAlign: "center",
  opacity: 0.7,
};
const errorStyle: React.CSSProperties = {
  padding: 20,
  background: "rgba(220,38,38,0.08)",
  border: "1px solid rgba(220,38,38,0.3)",
  borderRadius: 12,
  color: "#dc2626",
};
const emptyStyle: React.CSSProperties = {
  padding: 30,
  textAlign: "center",
  opacity: 0.6,
};
