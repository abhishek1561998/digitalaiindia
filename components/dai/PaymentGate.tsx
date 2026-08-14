"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import css from "./PaymentGate.module.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export function PaymentGate({
  trackId,
  coursePath,
  qrDataUrl,
  upiId,
  amount,
  status,
}: {
  trackId: string;
  coursePath: string;
  qrDataUrl: string;
  upiId: string;
  amount: number;
  status: "unpaid" | "pending";
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [ref, setRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(status === "pending");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (ref.trim().length < 4) {
      setError("Enter the UPI transaction reference (UTR) from your payment app.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/learn/payment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, paymentRef: ref.trim() }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong — try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable}`} data-theme={theme}>
      <div className={css.page}>
        <Link href={coursePath} className={css.backLink}>← Back to course</Link>

        <div className={css.card}>
          <div className={css.eyebrow}>You&apos;ve completed the course 🎉</div>
          <h1 className={css.title}>One last step for your certificate</h1>
          <p className={css.sub}>
            The course itself is free — the printed/verified certificate has a one-time ₹{amount} fee to
            cover verification. Pay via UPI, then tell us the transaction reference so we can confirm it.
          </p>

          {submitted ? (
            <div className={css.pendingBox}>
              <div className={css.pendingTitle}>Payment submitted — under review</div>
              <p>
                We&apos;ll verify your transaction and unlock the certificate shortly. This page will show
                it automatically once approved — check back in a bit, or refresh.
              </p>
            </div>
          ) : (
            <div className={css.payGrid}>
              <div className={css.qrBox}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt={`UPI QR code to pay ₹${amount} to ${upiId}`} width={220} height={220} />
                <div className={css.upiId}>{upiId}</div>
                <div className={css.amount}>₹{amount}</div>
              </div>
              <form className={css.form} onSubmit={submit}>
                <label className={css.label}>UPI transaction reference (UTR)</label>
                <input
                  className={css.input}
                  placeholder="e.g. 402812345678"
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                />
                <p className={css.hint}>
                  Found in your payment app under this transaction&apos;s details — usually labeled
                  &quot;UTR&quot; or &quot;Ref No.&quot;
                </p>
                {error && <div className={css.error}>{error}</div>}
                <button type="submit" className={css.submitBtn} disabled={submitting}>
                  {submitting ? "Submitting…" : "I've paid — submit for verification"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
