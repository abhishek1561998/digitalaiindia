"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import { BrandLogo } from "./BrandLogo";
import { CourseStepper } from "./CourseStepper";
import { AccountMenu } from "./AccountMenu";
import type { Stage, QuizQuestion } from "@/lib/tracks/types";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export function LearnCourseLanding({
  trackId,
  trackTitle,
  overviewPath,
  certificatePath,
  stages,
  quizQuestions,
  userName,
  practiceTool,
}: {
  trackId: string;
  trackTitle: string;
  overviewPath: string;
  certificatePath: string;
  stages: Stage[];
  quizQuestions: QuizQuestion[];
  userName: string;
  practiceTool?: "code" | "canvas" | "none";
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <div className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable}`} data-theme={theme}>
      <nav className={styles.nav}>
        <BrandLogo />
        <div className={styles.navRight}>
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <AccountMenu userName={userName} />
          <Link href={overviewPath} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Exit course</Link>
        </div>
      </nav>

      <CourseStepper
        trackId={trackId}
        trackTitle={trackTitle}
        overviewPath={overviewPath}
        certificatePath={certificatePath}
        stages={stages}
        quizQuestions={quizQuestions}
        userName={userName}
        practiceTool={practiceTool}
      />
    </div>
  );
}
