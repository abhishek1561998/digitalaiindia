"use client";

import { useState } from "react";

type PendingItem = {
  id: string;
  trackId: string;
  paymentRef: string | null;
  paymentSubmittedAt: string | null;
  userName: string;
  userEmail: string;
};

export function PaymentsAdmin({ initialPending }: { initialPending: PendingItem[] }) {
  const [items, setItems] = useState(initialPending);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function approve(id: string) {
    setBusyId(id);
    const res = await fetch("/api/learn/payment/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId: id }),
    });
    if (res.ok) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
    setBusyId(null);
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "2.5rem 1.5rem", fontFamily: "-apple-system, sans-serif" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>Pending certificate payments</h1>
      {items.length === 0 ? (
        <p style={{ color: "#888" }}>Nothing pending.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {items.map((p) => (
            <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{p.userName} <span style={{ fontWeight: 400, color: "#888", fontSize: "0.85rem" }}>({p.userEmail})</span></div>
                <div style={{ fontSize: "0.85rem", color: "#555", marginTop: 4 }}>
                  Track: {p.trackId} · UTR: <code>{p.paymentRef}</code> · Submitted: {p.paymentSubmittedAt ? new Date(p.paymentSubmittedAt).toLocaleString("en-IN") : "—"}
                </div>
              </div>
              <button
                onClick={() => approve(p.id)}
                disabled={busyId === p.id}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#FF7500", color: "#fff", fontWeight: 600, cursor: "pointer" }}
              >
                {busyId === p.id ? "Approving…" : "Approve"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
