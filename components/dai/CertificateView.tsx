"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono, Caveat } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import cert from "./CertificateView.module.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-signature", weight: ["600", "700"] });

const LogoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export function CertificateView({
  userName,
  trackTitle,
  points,
  completedAt,
  certificateId,
}: {
  userName: string;
  trackTitle: string;
  points: number;
  completedAt: string;
  certificateId: string;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  const date = new Date(completedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const shortId = certificateId.slice(-10).toUpperCase();

  return (
    <div className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable} ${caveat.variable}`} data-theme={theme}>
      <div className={cert.page}>
        <div className={cert.actions}>
          <Link href="/learn/javascript/course" className={cert.backLink}>← Back to course</Link>
          <button type="button" className={cert.printBtn} onClick={() => window.print()}>Download / Print</button>
        </div>

        <div className={cert.cert}>
          <div className={cert.tricolor} />
          <div className={cert.frame} />
          <div className={cert.watermark} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => <LogoIcon key={i} />)}
          </div>

          <div className={cert.certHead}>
            <div className={cert.certLogo}>
              <span className={cert.certLogoIcon}><LogoIcon /></span>
              DigitalAI<span style={{ color: "var(--accent)" }}>India</span>
            </div>
            <div className={cert.certId}>CERT #{shortId}</div>
          </div>

          <div className={cert.certBody}>
            <div className={cert.certEyebrow}>Certificate of Completion</div>
            <div className={cert.certName}>{userName}</div>
            <p className={cert.certLine}>
              has successfully completed the <strong>{trackTitle}</strong> track on DigitalAIIndia Learn —
              nine stages, nine passed quizzes, {points} points earned.
            </p>
            <div className={cert.certBadgeRow}>
              <span className={cert.certBadge}>9 / 9 stages</span>
              <span className={cert.certBadge}>{points} points</span>
              <span className={cert.certBadge}>Project-based</span>
            </div>
          </div>

          <div className={cert.certFoot}>
            <div className={cert.certMeta}>
              <strong>{date}</strong>
              Certificate #{shortId}
            </div>
            <div className={cert.certSign}>
              <div className={cert.certSignName}>Abhishek Dandriyal</div>
              <div className={cert.certSignRule} />
              <div className={cert.certSignTitle}>Founder, DigitalAIIndia</div>
            </div>
            <div className={cert.seal} aria-hidden="true">
              <svg viewBox="0 0 100 100" width="64" height="64">
                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 3" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" />
                <path id="sealArc" d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0" fill="none" />
                <text fontSize="7.2" letterSpacing="2" fontFamily="var(--font-mono, monospace)">
                  <textPath href="#sealArc" startOffset="2%">DIGITALAIINDIA LEARN · VERIFIED ·</textPath>
                </text>
                <g transform="translate(50 50)">
                  <g transform="translate(-9 -9) scale(0.72)">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        <p className={cert.verifyHint}>
          Verify this certificate anytime by its ID above — issued to the account it was completed under.
        </p>
      </div>
    </div>
  );
}
