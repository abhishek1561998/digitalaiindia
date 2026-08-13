"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import cert from "./CertificateView.module.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

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
    <div className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable}`} data-theme={theme}>
      <div className={cert.page}>
        <div className={cert.actions}>
          <Link href="/learn/javascript/course" className={cert.backLink}>← Back to course</Link>
          <button type="button" className={cert.printBtn} onClick={() => window.print()}>Download / Print</button>
        </div>

        <div className={cert.cert}>
          <div className={cert.tricolor} />
          <div className={cert.frame} />

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
          </div>

          <div className={cert.certFoot}>
            <div className={cert.certMeta}>
              <strong>{date}</strong>
              Issued by DigitalAIIndia Learn
            </div>
            <div className={cert.certSign}>
              <div className={cert.certSignName}>DigitalAIIndia</div>
              <div className={cert.certSignTitle}>digitalaiindia.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
