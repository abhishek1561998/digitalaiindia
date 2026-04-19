"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Syne, Outfit } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import styles from "./dashboard-shell.module.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

/* ── Types ── */
type DashboardUser = {
  id: string;
  name: string;
  email: string;
  plan: "FREE" | "PRO";
  monthlyLimit: number;
};

type Summary = {
  plan: "FREE" | "PRO";
  usage: number;
  limit: number;
  remaining: number;
  activeKeys: number;
  period: string;
};

type ApiKeyItem = {
  id: string;
  name: string;
  fullKey: string;
  masked: string;
  requests: number;
  createdAt: string;
  lastUsedAt: string | null;
};

type RequestLog = {
  id: string;
  api: "chat" | "voice" | "three-d" | "design";
  status: number;
  keyName: string;
  latencyMs: number;
  timestamp: string;
};

type Tab = "overview" | "keys" | "playground" | "logs" | "billing" | "docs" | "settings";

/* ── Icons ── */
const OverviewIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const KeyIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const PlayIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const LogsIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const BillingIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const DocsIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg className={styles.sideTabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LogoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
);
const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/* ── Constants ── */
const tabs: { id: Tab; label: string; icon: () => React.ReactElement }[] = [
  { id: "overview",    label: "Overview",      icon: OverviewIcon },
  { id: "keys",        label: "API Keys",       icon: KeyIcon },
  { id: "playground",  label: "Playground",     icon: PlayIcon },
  { id: "logs",        label: "Request Logs",   icon: LogsIcon },
  { id: "billing",     label: "Billing",        icon: BillingIcon },
  { id: "docs",        label: "Docs",           icon: DocsIcon },
  { id: "settings",    label: "Settings",       icon: SettingsIcon },
];

const docsExamples = {
  chat: {
    endpoint: "POST /api/chat",
    body: `{\n  "prompt": "Explain transformer models in simple language"\n}`,
    response: `{\n  "id": "resp_x8k21a",\n  "content": "Transformer models understand context...",\n  "model": "dai-chat-v1-mock",\n  "tokens_used": 82\n}`,
  },
  voice: {
    endpoint: "POST /api/voice",
    body: `{\n  "text": "Welcome to DigitalAIIndia",\n  "voice": "Priya"\n}`,
    response: `{\n  "id": "voice_q1d9w2",\n  "audio_url": "https://...",\n  "duration_ms": 1840,\n  "voice": "Priya"\n}`,
  },
  design: {
    endpoint: "POST /api/design",
    body: `{\n  "prompt": "Generate a fintech app hero with saffron accents"\n}`,
    response: `{\n  "id": "design_1m0za9",\n  "asset_url": "https://...",\n  "format": "png",\n  "size": "1536x1024"\n}`,
  },
  threeD: {
    endpoint: "POST /api/three-d",
    body: `{\n  "prompt": "Create a 3D product pedestal for a smart speaker"\n}`,
    response: `{\n  "id": "three_d_0b4fkl",\n  "model_url": "https://...",\n  "format": "glb"\n}`,
  },
};

/* ══════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════ */
export function DashboardShell({ user }: { user: DashboardUser }) {
  const params = useSearchParams();
  const initial = params.get("tab");
  const router = useRouter();

  const [tab, setTab] = useState<Tab>(
    tabs.some((t) => t.id === initial) ? (initial as Tab) : "overview"
  );
  const [summary, setSummary]       = useState<Summary | null>(null);
  const [keys, setKeys]             = useState<ApiKeyItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [show, setShow]             = useState<Record<string, boolean>>({});
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [playgroundApi, setPlaygroundApi] = useState<"chat" | "voice" | "three-d" | "design">("chat");
  const [prompt, setPrompt]         = useState("Explain what an API gateway does.");
  const [response, setResponse]     = useState("Response will appear here...");
  const [working, setWorking]       = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [notice, setNotice]         = useState("");
  const [logs, setLogs]             = useState<RequestLog[]>([]);

  const activeKey = useMemo(
    () => keys.find((k) => k.id === activeKeyId) || keys[0],
    [keys, activeKeyId]
  );

  const launchChecklist = useMemo(
    () => [
      { label: "Create your first API key",        done: keys.length > 0 },
      { label: "Run a test request in Playground", done: logs.length > 0 },
      { label: "Verify usage reporting",           done: Boolean(summary) },
      { label: "Upgrade for production traffic",   done: (summary?.plan || user.plan) === "PRO" },
    ],
    [keys.length, logs.length, summary, user.plan]
  );

  const usagePercent = useMemo(() => {
    if (!summary || summary.limit === 0) return 0;
    return Math.min(100, Math.round((summary.usage / summary.limit) * 100));
  }, [summary]);

  /* ── Data ── */
  async function loadStats() {
    try {
      const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
      if (res.status === 401) { router.push("/auth"); return; }
      setSummary((await res.json()).summary);
    } catch { setNotice("Unable to load dashboard metrics"); }
  }

  async function loadKeys() {
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      if (res.status === 401) { router.push("/auth"); return; }
      const data = await res.json();
      setKeys(data.keys || []);
      if (!activeKeyId && data.keys?.[0]?.id) setActiveKeyId(data.keys[0].id);
    } catch { setNotice("Unable to load API keys"); }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadKeys()]);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  function selectTab(next: Tab) {
    setTab(next);
    router.replace(`/dashboard?tab=${next}`);
  }

  async function createKey() {
    const name = newKeyName.trim() || `Key ${keys.length + 1}`;
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) { setNotice(data.error || "Unable to create key"); return; }
    setNewKeyName("");
    setNotice("API key generated");
    await Promise.all([loadKeys(), loadStats()]);
    if (data.key?.id) setActiveKeyId(data.key.id);
  }

  async function deleteKey(id: string) {
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); setNotice(d.error || "Unable to delete key"); return; }
    setNotice("API key deleted");
    await Promise.all([loadKeys(), loadStats()]);
  }

  async function runPlayground() {
    if (!activeKey?.fullKey) { setNotice("Create an API key first"); return; }
    setWorking(true);
    setResponse("Loading...");
    const t0 = Date.now();
    try {
      const body =
        playgroundApi === "chat"  ? { prompt } :
        playgroundApi === "voice" ? { text: prompt, voice: "Priya" } :
        { prompt };
      const res = await fetch(`/api/${playgroundApi}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${activeKey.fullKey}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const latencyMs = Date.now() - t0;
      setResponse(res.ok ? JSON.stringify(data, null, 2) : `Error:\n${JSON.stringify(data, null, 2)}`);
      setLogs((prev) => [{
        id: crypto.randomUUID(), api: playgroundApi, status: res.status,
        keyName: activeKey.name, latencyMs, timestamp: new Date().toISOString(),
      }, ...prev]);
      await Promise.all([loadStats(), loadKeys()]);
    } catch { setResponse("Network error while testing API."); }
    finally { setWorking(false); }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setNotice(`${label} copied`); }
    catch { setNotice(`Unable to copy ${label.toLowerCase()}`); }
  }

  /* ─────────────── render ─────────────── */
  return (
    <div className={`${syne.variable} ${outfit.variable} ${styles.shell}`}>

      {/* ── Nav ── */}
      <header className={styles.nav}>
        <a href="https://digitalaiindia.com" className={styles.navLogo}>
          <div className={styles.navLogoIcon}><LogoIcon /></div>
          <span style={{ background: "linear-gradient(90deg,#FACC15,#F97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Digitalai</span><span style={{ color: "var(--text2)" }}>India.com</span>
        </a>

        <div className={styles.navRight}>
          <div className={styles.navUser}>
            <span className={styles.navUserName}>{user.name}</span>
            <span className={styles.navUserEmail}>{user.email}</span>
          </div>
          <span className={styles.navBadge}>Production Ready</span>
          <ThemeToggle />
          <button className={styles.btnGhost} onClick={logout}>Sign out</button>
        </div>
      </header>

      {/* ── Mobile tab bar ── */}
      <div className={styles.mobileTabs}>
        <div className={styles.mobileTabsInner}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.mobileTab} ${tab === t.id ? styles.mobileTabActive : ""}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile plan bar ── */}
      <div className={styles.mobilePlanBar}>
        <span className={styles.mobilePlanText}>
          {summary?.plan || user.plan} · {summary?.usage ?? 0}/{summary?.limit ?? user.monthlyLimit}
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
        </div>
        <span className={styles.mobilePlanText}>{usagePercent}%</span>
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <nav className={styles.sideNav}>
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`${styles.sideTab} ${tab === t.id ? styles.sideTabActive : ""}`}
                  onClick={() => selectTab(t.id)}
                >
                  <Icon />
                  {t.label}
                </button>
              );
            })}
          </nav>

          <div className={styles.planCard}>
            <p className={styles.planLabel}>Current Plan</p>
            <p className={styles.planName}>{summary?.plan || user.plan}</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
            </div>
            <p className={styles.planUsage}>
              {summary?.usage ?? 0} / {summary?.limit ?? user.monthlyLimit} requests
            </p>
          </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {notice && <div className={styles.notice}>{notice}</div>}

          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              Loading dashboard…
            </div>
          )}

          {/* ── Overview ── */}
          {!loading && tab === "overview" && (
            <div>
              <div className={styles.sectionHead}>
                <div>
                  <h2 className={styles.sectionTitle}>Welcome back, {user.name}</h2>
                  <p className={styles.sectionSub}>Monitor usage, key health, and API performance.</p>
                </div>
                <button className={styles.btnPrimary} onClick={() => selectTab("playground")}>
                  Open Playground
                </button>
              </div>

              {/* Stat cards */}
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Monthly Usage</p>
                  <p className={styles.statVal}>{summary?.usage ?? 0}</p>
                  <p className={styles.statSub}>of {summary?.limit ?? user.monthlyLimit}</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Remaining</p>
                  <p className={styles.statVal}>{summary?.remaining ?? user.monthlyLimit}</p>
                  <p className={styles.statSub}>resets monthly</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Active Keys</p>
                  <p className={styles.statVal}>{summary?.activeKeys ?? 0}</p>
                  <p className={styles.statSub}>securely managed</p>
                </div>
                <div className={styles.statCard}>
                  <p className={styles.statLabel}>Success Rate</p>
                  <p className={styles.statVal}>
                    {logs.length
                      ? `${Math.round((logs.filter((l) => l.status < 400).length / logs.length) * 100)}%`
                      : "100%"}
                  </p>
                  <p className={styles.statSub}>last {Math.max(logs.length, 1)} requests</p>
                </div>
              </div>

              {/* Usage + Quick actions */}
              <div className={styles.grid2}>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Usage Progress</p>
                  <div className={styles.progressBar} style={{ marginTop: "0.75rem", height: 7 }}>
                    <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
                  </div>
                  <p className={styles.statSub} style={{ marginTop: "0.5rem" }}>
                    {usagePercent}% consumed in {summary?.period || "current month"}
                  </p>
                </div>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Quick Actions</p>
                  <div className={styles.quickGrid}>
                    <button className={styles.quickBtn} onClick={() => selectTab("keys")}>Generate API key</button>
                    <button className={styles.quickBtn} onClick={() => selectTab("docs")}>Open docs</button>
                    <button className={styles.quickBtn} onClick={() => selectTab("billing")}>Manage plan</button>
                    <button className={styles.quickBtn} onClick={() => selectTab("logs")}>View logs</button>
                  </div>
                </div>
              </div>

              {/* Checklist + Platform status */}
              <div className={`${styles.grid2} ${styles.grid2Alt}`}>
                <div className={styles.card}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div>
                      <p className={styles.cardTitle}>Launch Checklist</p>
                      <p className={styles.cardMeta} style={{ marginBottom: 0 }}>Everything you need before production traffic.</p>
                    </div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--dai-text3)" }}>
                      {launchChecklist.filter((i) => i.done).length}/{launchChecklist.length} complete
                    </span>
                  </div>
                  <div className={styles.checklist}>
                    {launchChecklist.map((item) => (
                      <div key={item.label} className={styles.checkRow}>
                        <div className={styles.checkLeft}>
                          <span className={`${styles.checkDot} ${item.done ? styles.checkDotDone : styles.checkDotPending}`}>
                            {item.done ? "✓" : "·"}
                          </span>
                          <span className={styles.checkLabel}>{item.label}</span>
                        </div>
                        <span className={`${styles.checkStatus} ${item.done ? styles.checkStatusDone : styles.checkStatusPending}`}>
                          {item.done ? "Done" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitle}>Platform Status</p>
                  <div style={{ marginTop: "0.75rem" }}>
                    <div className={`${styles.statusItem} ${styles.cardOk}`}>
                      <p className={styles.statusTitle} style={{ color: "var(--dai-accent3)" }}>API Gateway</p>
                      <p className={styles.statusBody}>Healthy — accepting authenticated requests.</p>
                    </div>
                    <div className={`${styles.statusItem} ${styles.cardAccent}`}>
                      <p className={styles.statusTitle} style={{ color: "var(--dai-accent)" }}>Developer Experience</p>
                      <p className={styles.statusBody}>Auth, logging, playground, and key management are live.</p>
                    </div>
                    <div className={`${styles.statusItem} ${styles.cardWarn}`}>
                      <p className={styles.statusTitle} style={{ color: "#B87A00" }}>Next Step</p>
                      <p className={styles.statusBody}>
                        {keys.length === 0
                          ? "Generate your first key to begin integration."
                          : logs.length === 0
                          ? "Run a playground request to validate your stack."
                          : "Connect your app and monitor usage from Request Logs."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── API Keys ── */}
          {!loading && tab === "keys" && (
            <div>
              <div className={styles.keyHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>API Key Management</h2>
                  <p className={styles.sectionSub}>Create and rotate keys for services and environments.</p>
                </div>
                <div className={styles.keyForm}>
                  <input
                    className={`${styles.input} ${styles.keyFormInput}`}
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key name (e.g. Production)"
                    onKeyDown={(e) => e.key === "Enter" && createKey()}
                  />
                  <button className={styles.btnPrimary} onClick={createKey}>Generate</button>
                </div>
              </div>

              {keys.length === 0 ? (
                <div className={styles.emptyState}>
                  No API keys yet. Create your first key to start calling APIs.
                </div>
              ) : (
                <div>
                  {keys.map((key) => (
                    <div key={key.id} className={styles.keyCard}>
                      <div className={styles.keyCardTop}>
                        <div>
                          <div className={styles.keyName}>
                            {key.name}
                            {activeKeyId === key.id && <span className={styles.activeBadge}>Active</span>}
                          </div>
                          <p className={styles.keyMeta}>
                            {key.requests} requests · Created {new Date(key.createdAt).toLocaleDateString()}
                            {key.lastUsedAt ? ` · Last used ${new Date(key.lastUsedAt).toLocaleDateString()}` : ""}
                          </p>
                        </div>
                        <div className={styles.keyActions}>
                          <button className={styles.btnSm} onClick={() => setActiveKeyId(key.id)}>Use</button>
                          <button className={styles.btnSm} onClick={() => setShow((p) => ({ ...p, [key.id]: !p[key.id] }))}>
                            {show[key.id] ? "Hide" : "Show"}
                          </button>
                          <button className={styles.btnSm} onClick={() => copy(key.fullKey, "API key")}>
                            <CopyIcon />
                          </button>
                          <button className={styles.btnDanger} onClick={() => deleteKey(key.id)}>Delete</button>
                        </div>
                      </div>
                      <div className={styles.keyValue}>{show[key.id] ? key.fullKey : key.masked}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Playground ── */}
          {!loading && tab === "playground" && (
            <div>
              <div className={styles.sectionHead}>
                <div>
                  <h2 className={styles.sectionTitle}>API Playground</h2>
                  <p className={styles.sectionSub}>Using key: {activeKey?.name || "None selected"}</p>
                </div>
              </div>

              <div className={styles.apiTabs}>
                {(["chat", "voice", "three-d", "design"] as const).map((name) => (
                  <button
                    key={name}
                    className={`${styles.apiTab} ${playgroundApi === name ? styles.apiTabActive : ""}`}
                    onClick={() => setPlaygroundApi(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className={styles.card} style={{ marginBottom: "1rem" }}>
                <textarea
                  className={styles.textarea}
                  style={{ height: 112 }}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className={styles.playFooter}>
                  <span className={styles.playEndpoint}>POST /api/{playgroundApi}</span>
                  <button className={styles.btnPrimary} onClick={runPlayground} disabled={working}>
                    {working ? (
                      <><span className={styles.spinner} style={{ width: 13, height: 13, borderWidth: 2 }} /> Running…</>
                    ) : "Run request"}
                  </button>
                </div>
              </div>

              <pre className={styles.preBlock}>{response}</pre>
            </div>
          )}

          {/* ── Logs ── */}
          {!loading && tab === "logs" && (
            <div>
              <div className={styles.sectionHead}>
                <div>
                  <h2 className={styles.sectionTitle}>Request Logs</h2>
                  <p className={styles.sectionSub}>API requests made from Playground.</p>
                </div>
                {logs.length > 0 && (
                  <button className={styles.btnGhost} onClick={() => setLogs([])}>Clear logs</button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className={styles.emptyState}>
                  No request logs yet. Run requests from Playground to see logs here.
                </div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>API</th>
                        <th>Status</th>
                        <th>Latency</th>
                        <th>Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td style={{ fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase", fontSize: "0.75rem" }}>
                            {log.api}
                          </td>
                          <td>
                            <span className={log.status < 400 ? styles.statusOk : styles.statusErr}>
                              {log.status}
                            </span>
                          </td>
                          <td>{log.latencyMs}ms</td>
                          <td>{log.keyName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Billing ── */}
          {!loading && tab === "billing" && (
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: "1.25rem" }}>Billing & Plan</h2>
              <div className={styles.billingGrid}>
                <div className={styles.card}>
                  <p className={styles.rowLabel}>Current Plan</p>
                  <p style={{ fontFamily: "var(--font-syne, sans-serif)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--dai-text)", margin: "0.25rem 0 0.25rem" }}>
                    {summary?.plan || user.plan}
                  </p>
                  <p className={styles.statSub}>Monthly limit: {summary?.limit ?? user.monthlyLimit} requests</p>
                  <div className={styles.progressBar} style={{ marginTop: "0.875rem", height: 6 }}>
                    <div className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
                  </div>
                  <p className={styles.planUsage} style={{ marginTop: "0.375rem" }}>
                    {summary?.usage ?? 0} of {summary?.limit ?? user.monthlyLimit} used
                  </p>
                </div>

                <div className={`${styles.card} ${styles.cardAccent}`}>
                  <p className={styles.cardTitle}>Upgrade to Pro</p>
                  <p className={styles.cardMeta}>
                    Higher limits, dedicated support, and team controls for production workloads.
                  </p>
                  <ul style={{ margin: "0.75rem 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {["10,000 requests/month", "Priority support", "Team API key management", "Custom rate limits", "SLA guarantee"].map((f) => (
                      <li key={f} style={{ fontSize: "0.8125rem", color: "var(--dai-text2)", display: "flex", gap: "0.5rem" }}>
                        <span style={{ color: "var(--dai-accent3)", fontWeight: 700 }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={styles.btnPrimary} style={{ marginTop: "0.5rem" }}>Contact Sales</button>
                </div>
              </div>
            </div>
          )}

          {/* ── Docs ── */}
          {!loading && tab === "docs" && (
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: "0.375rem" }}>Developer Docs</h2>
              <p className={styles.sectionSub} style={{ marginBottom: "1.25rem" }}>
                All APIs use bearer auth and JSON-first requests.
              </p>

              <div className={styles.grid2} style={{ marginBottom: "1rem" }}>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Authentication Header</p>
                  <p className={styles.cardMeta}>Use your active API key in every request.</p>
                  <pre className={styles.preBlock}>{`Authorization: Bearer dai_your_api_key`}</pre>
                </div>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Base URL</p>
                  <p className={styles.cardMeta}>Call from frontend, backend, or internal tooling.</p>
                  <pre className={styles.preBlock}>{`https://platform.digitalaiindia.com`}</pre>
                </div>
              </div>

              <div className={styles.docsGrid}>
                {[
                  { title: "Chat API",   ex: docsExamples.chat },
                  { title: "Voice API",  ex: docsExamples.voice },
                  { title: "Design API", ex: docsExamples.design },
                  { title: "3D API",     ex: docsExamples.threeD },
                ].map(({ title, ex }) => (
                  <div key={title} className={styles.card}>
                    <p className={styles.cardTitle}>{title}</p>
                    <p className={styles.cardMeta}>{ex.endpoint}</p>
                    <p className={styles.rowLabel} style={{ marginBottom: "0.375rem" }}>Request</p>
                    <pre className={styles.preBlock} style={{ marginBottom: "0.75rem" }}>{ex.body}</pre>
                    <p className={styles.rowLabel} style={{ marginBottom: "0.375rem" }}>Response</p>
                    <pre className={styles.preBlock}>{ex.response}</pre>
                  </div>
                ))}
              </div>

              <div className={styles.card} style={{ marginTop: "1rem" }}>
                <p className={styles.cardTitle}>cURL Example</p>
                <pre className={styles.preBlock} style={{ marginTop: "0.75rem" }}>{`curl -X POST https://platform.digitalaiindia.com/api/chat \\
  -H "Authorization: Bearer dai_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "prompt": "Explain transformers" }'`}</pre>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {!loading && tab === "settings" && (
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: "1.25rem" }}>Platform Settings</h2>
              <div className={styles.settingsGrid}>
                <div className={styles.card}>
                  <p className={styles.cardTitle}>Webhook Endpoint</p>
                  <p className={styles.cardMeta}>Receive async event notifications at this URL.</p>
                  <div className={styles.inlineRow}>
                    <span>https://platform.digitalaiindia.com/webhooks/events</span>
                    <button
                      className={styles.btnSm}
                      onClick={() => copy("https://platform.digitalaiindia.com/webhooks/events", "Webhook URL")}
                    >
                      <CopyIcon />
                    </button>
                  </div>
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitle}>Allowed Origins</p>
                  <p className={styles.cardMeta}>For browser-based SDK requests (CORS).</p>
                  <textarea
                    className={styles.textarea}
                    style={{ height: 80, marginTop: "0.75rem" }}
                    defaultValue={"https://app.digitalaiindia.com\nhttps://admin.digitalaiindia.com"}
                  />
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitle}>Appearance</p>
                  <p className={styles.cardMeta}>Toggle between light and dark mode.</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.75rem" }}>
                    <ThemeToggle />
                    <span style={{ fontSize: "0.8125rem", color: "var(--dai-text2)" }}>Light / Dark</span>
                  </div>
                </div>

                <div className={styles.card}>
                  <p className={styles.cardTitle}>Account</p>
                  <p className={styles.cardMeta}>Signed in as {user.email}</p>
                  <button className={`${styles.btnGhost} ${styles.btnDanger}`} style={{ marginTop: "0.75rem" }} onClick={logout}>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
