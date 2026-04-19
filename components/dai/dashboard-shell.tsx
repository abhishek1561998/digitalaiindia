"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "keys", label: "API Keys" },
  { id: "playground", label: "Playground" },
  { id: "logs", label: "Request Logs" },
  { id: "billing", label: "Billing" },
  { id: "docs", label: "Docs" },
  { id: "settings", label: "Settings" },
];

export function DashboardShell({ user }: { user: DashboardUser }) {
  const params = useSearchParams();
  const initial = params.get("tab");
  const router = useRouter();

  const [tab, setTab] = useState<Tab>(tabs.some((tabItem) => tabItem.id === initial) ? (initial as Tab) : "overview");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [playgroundApi, setPlaygroundApi] = useState<"chat" | "voice" | "three-d" | "design">("chat");
  const [prompt, setPrompt] = useState("Explain what an API gateway does.");
  const [response, setResponse] = useState("Response will appear here...");
  const [working, setWorking] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [notice, setNotice] = useState<string>("");
  const [logs, setLogs] = useState<RequestLog[]>([]);

  const activeKey = useMemo(() => keys.find((key) => key.id === activeKeyId) || keys[0], [keys, activeKeyId]);
  const usagePercent = useMemo(() => {
    if (!summary || summary.limit === 0) return 0;
    return Math.min(100, Math.round((summary.usage / summary.limit) * 100));
  }, [summary]);

  async function loadStats() {
    const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/auth");
      return;
    }
    const data = await res.json();
    setSummary(data.summary);
  }

  async function loadKeys() {
    const res = await fetch("/api/keys", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/auth");
      return;
    }
    const data = await res.json();
    setKeys(data.keys || []);
    if (!activeKeyId && data.keys?.[0]?.id) {
      setActiveKeyId(data.keys[0].id);
    }
  }

  useEffect(() => {
    async function boot() {
      setLoading(true);
      await Promise.all([loadStats(), loadKeys()]);
      setLoading(false);
    }
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setNotice(""), 2400);
    return () => clearTimeout(timeout);
  }, [notice]);

  function selectTab(nextTab: Tab) {
    setTab(nextTab);
    router.replace(`/dashboard?tab=${nextTab}`);
  }

  async function createKey() {
    const keyName = newKeyName.trim() || `Key ${keys.length + 1}`;
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: keyName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setNotice(data.error || "Unable to create key");
      return;
    }
    setNewKeyName("");
    setNotice("API key generated successfully");
    await loadKeys();
    await loadStats();
  }

  async function deleteKey(id: string) {
    const res = await fetch(`/api/keys/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setNotice(data.error || "Unable to delete key");
      return;
    }
    setNotice("API key deleted");
    await loadKeys();
    await loadStats();
  }

  async function runPlayground() {
    if (!activeKey?.fullKey) {
      setNotice("Create an API key first");
      return;
    }

    setWorking(true);
    setResponse("Loading...");
    const startedAt = Date.now();

    try {
      const body =
        playgroundApi === "chat"
          ? { prompt }
          : playgroundApi === "voice"
            ? { text: prompt, voice: "Priya" }
            : { prompt };

      const res = await fetch(`/api/${playgroundApi}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeKey.fullKey}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const pretty = JSON.stringify(data, null, 2);
      const latencyMs = Date.now() - startedAt;
      setResponse(res.ok ? pretty : `Error:\n${pretty}`);
      setLogs((prev) => [
        {
          id: crypto.randomUUID(),
          api: playgroundApi,
          status: res.status,
          keyName: activeKey.name,
          latencyMs,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);

      await loadStats();
      await loadKeys();
    } catch {
      setResponse("Network error while testing API.");
    } finally {
      setWorking(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  function copyValue(value: string, label: string) {
    navigator.clipboard.writeText(value).then(() => setNotice(`${label} copied`));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight">platform.digitalaiindia.com</p>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Production Ready</span>
            <button onClick={logout} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
          <nav className="space-y-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                onClick={() => selectTab(item.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  tab === item.id ? "bg-blue-500 text-white" : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950 p-3">
            <p className="text-xs text-slate-400">Current Plan</p>
            <p className="mt-1 text-sm font-semibold">{summary?.plan || user.plan}</p>
            <div className="mt-3 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${usagePercent}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">{summary?.usage ?? 0} / {summary?.limit ?? user.monthlyLimit} requests</p>
          </div>
        </aside>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          {notice ? <div className="mb-4 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-200">{notice}</div> : null}
          {loading ? <p className="text-sm text-slate-300">Loading dashboard...</p> : null}

          {!loading && tab === "overview" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Welcome back, {user.name}</h2>
                  <p className="text-sm text-slate-400">Monitor usage, key health, and API performance from one place.</p>
                </div>
                <button
                  onClick={() => selectTab("playground")}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-400"
                >
                  Open Playground
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Monthly Usage</p>
                  <p className="mt-1 text-2xl font-semibold">{summary?.usage ?? 0}</p>
                  <p className="text-xs text-slate-500">of {summary?.limit ?? user.monthlyLimit}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Remaining</p>
                  <p className="mt-1 text-2xl font-semibold">{summary?.remaining ?? user.monthlyLimit}</p>
                  <p className="text-xs text-slate-500">resets monthly</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Active Keys</p>
                  <p className="mt-1 text-2xl font-semibold">{summary?.activeKeys ?? 0}</p>
                  <p className="text-xs text-slate-500">securely managed</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Success Rate</p>
                  <p className="mt-1 text-2xl font-semibold">{logs.length ? `${Math.round((logs.filter((l) => l.status < 400).length / logs.length) * 100)}%` : "100%"}</p>
                  <p className="text-xs text-slate-500">last {Math.max(logs.length, 1)} requests</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-sm font-medium">Usage Progress</p>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${usagePercent}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{usagePercent}% consumed in {summary?.period || "current month"}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-sm font-medium">Quick Actions</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <button onClick={() => selectTab("keys")} className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10">Generate API key</button>
                    <button onClick={() => selectTab("docs")} className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10">Open docs</button>
                    <button onClick={() => selectTab("billing")} className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10">Manage plan</button>
                    <button onClick={() => selectTab("logs")} className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10">View logs</button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!loading && tab === "keys" ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">API Key Management</h2>
                  <p className="text-sm text-slate-400">Create and rotate keys for services and environments.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="Key name (e.g. Production)"
                    className="rounded-lg border border-white/20 bg-slate-950 px-3 py-2 text-sm"
                  />
                  <button onClick={createKey} className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium hover:bg-blue-400">Generate</button>
                </div>
              </div>

              {keys.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-300">
                  No API keys yet. Create your first key to start calling APIs.
                </div>
              ) : (
                <div className="space-y-3">
                  {keys.map((key) => (
                    <div key={key.id} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{key.name}</p>
                            {activeKeyId === key.id ? (
                              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">Active</span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-400">Requests: {key.requests} · Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setActiveKeyId(key.id)} className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/10">Use</button>
                          <button onClick={() => setShow((prev) => ({ ...prev, [key.id]: !prev[key.id] }))} className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/10">{show[key.id] ? "Hide" : "Show"}</button>
                          <button onClick={() => copyValue(key.fullKey, "API key")} className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/10">Copy</button>
                          <button onClick={() => deleteKey(key.id)} className="rounded-lg border border-red-400/40 px-2 py-1 text-xs text-red-300">Delete</button>
                        </div>
                      </div>
                      <p className="mt-3 break-all rounded-lg bg-slate-900 px-3 py-2 font-mono text-xs text-slate-300">{show[key.id] ? key.fullKey : key.masked}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {!loading && tab === "playground" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">API Playground</h2>
                <span className="text-xs text-slate-400">Using key: {activeKey?.name || "None"}</span>
              </div>

              <div className="grid gap-2 sm:grid-cols-4">
                {(["chat", "voice", "three-d", "design"] as const).map((name) => (
                  <button
                    key={name}
                    onClick={() => setPlaygroundApi(name)}
                    className={`rounded-lg px-3 py-2 text-sm capitalize ${
                      playgroundApi === name ? "bg-blue-500 text-white" : "border border-white/20 text-slate-300"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-28 w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2" />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Endpoint: /api/{playgroundApi}</p>
                  <button onClick={runPlayground} disabled={working} className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-400 disabled:opacity-60">{working ? "Running..." : "Run request"}</button>
                </div>
              </div>

              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-4 text-xs text-slate-200">{response}</pre>
            </div>
          ) : null}

          {!loading && tab === "logs" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Request Logs</h2>
                <button onClick={() => setLogs([])} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Clear</button>
              </div>

              {logs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-300">
                  No request logs yet. Run requests from Playground to populate logs.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-950/80 text-slate-400">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Time</th>
                        <th className="px-4 py-3 text-left font-medium">API</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                        <th className="px-4 py-3 text-left font-medium">Latency</th>
                        <th className="px-4 py-3 text-left font-medium">Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log.id} className="border-t border-white/10">
                          <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="px-4 py-3 uppercase">{log.api}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded px-2 py-1 text-xs ${log.status < 400 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>{log.status}</span>
                          </td>
                          <td className="px-4 py-3">{log.latencyMs}ms</td>
                          <td className="px-4 py-3">{log.keyName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {!loading && tab === "billing" ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Billing & Plan</h2>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs text-slate-400">Current Plan</p>
                  <p className="mt-1 text-2xl font-semibold">{summary?.plan || user.plan}</p>
                  <p className="mt-1 text-xs text-slate-500">Monthly limit: {summary?.limit ?? user.monthlyLimit}</p>
                </div>
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4 lg:col-span-2">
                  <p className="text-sm font-medium">Upgrade to Pro</p>
                  <p className="mt-1 text-sm text-slate-300">Get higher limits, dedicated support, and team controls for production workloads.</p>
                  <button className="mt-3 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-400">Contact Sales</button>
                </div>
              </div>
            </div>
          ) : null}

          {!loading && tab === "docs" ? (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Developer Docs</h2>
              <p className="text-sm text-slate-300">Authentication Header</p>
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-4 text-xs text-slate-200">{`Authorization: Bearer dai_your_api_key`}</pre>
              <p className="text-sm text-slate-300">Chat API</p>
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-4 text-xs text-slate-200">{`POST /api/chat\n{ "prompt": "Explain transformers" }`}</pre>
              <p className="text-sm text-slate-300">Voice API</p>
              <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-4 text-xs text-slate-200">{`POST /api/voice\n{ "text": "Hello", "voice": "Priya" }`}</pre>
            </div>
          ) : null}

          {!loading && tab === "settings" ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Platform Settings</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-sm font-medium">Webhook Endpoint</p>
                  <p className="mt-1 text-xs text-slate-400">Use this URL to receive async event notifications.</p>
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 font-mono text-xs">
                    <span className="truncate">https://platform.digitalaiindia.com/webhooks/events</span>
                    <button onClick={() => copyValue("https://platform.digitalaiindia.com/webhooks/events", "Webhook URL")} className="rounded border border-white/20 px-2 py-1">Copy</button>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-sm font-medium">Allowed Origins</p>
                  <p className="mt-1 text-xs text-slate-400">For browser-based SDK requests.</p>
                  <textarea
                    defaultValue={"https://app.digitalaiindia.com\nhttps://admin.digitalaiindia.com"}
                    className="mt-3 h-24 w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
