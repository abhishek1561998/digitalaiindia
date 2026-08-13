"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";
import { CelebrateButton } from "./CelebrateButton";
import js from "./learn-js-landing.module.css";
import { JS_STAGES } from "@/lib/tracks/js-track";

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

const LogoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

type ProgressState = { percent: number; completed: boolean } | null;

export function LearnJsLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(null);

  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/learn/progress?trackId=js")
      .then((r) => r.json())
      .then((data) => {
        if (!data.enrollment) return;
        const sp = data.enrollment.stageProgress as Record<string, number>;
        const sum = Array.from({ length: JS_STAGES.length }, (_, i) => sp[String(i)] || 0).reduce((a, b) => a + b, 0);
        setProgress({ percent: Math.round(sum / JS_STAGES.length), completed: Boolean(data.enrollment.completedAt) });
      })
      .catch(() => {});
  }, [isLoggedIn]);

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
      <div className={styles.tricolorBar} />
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoIcon /></div>
          <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <Link href="/platform">Products</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/learn">Learn</Link>
        </div>
        <div className={styles.navRight}>
          <CelebrateButton />
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/auth"} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Sign In</Link>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Get API Key</Link>
          <button type="button" className={styles.navHamburger} onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/platform" onClick={() => setMobileOpen(false)}>Products</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/learn" onClick={() => setMobileOpen(false)}>Learn</Link>
          <div className={styles.mobileMenuActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { toggleTheme(); setMobileOpen(false); }}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <Link href={isLoggedIn ? "/dashboard" : "/auth"} onClick={() => setMobileOpen(false)} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Sign In</Link>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <section className={styles.section} style={{ paddingTop: "7.5rem", paddingBottom: "1.5rem" }}>
        <div className={styles.sectionLabel}>
          <Link href="/learn" style={{ color: "inherit" }}>DigitalAIIndia Learn</Link> — Track 01
        </div>
        <h1 className={styles.sectionTitle}>JavaScript, properly.</h1>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Most JavaScript courses teach you to recognize syntax. This one teaches you to predict what code
          will do before you run it — because that&apos;s the skill that separates someone who&apos;s
          &quot;done a JS course&quot; from someone who can debug a real bug. Nine stages, real code, projects
          you&apos;d actually put on a portfolio.
        </p>
        <div className={js.facts}>
          <div className={js.fact}><div className={js.factK}>Duration</div><div className={js.factV}>9–10 weeks</div></div>
          <div className={js.fact}><div className={js.factK}>Format</div><div className={js.factV}>Project-based</div></div>
          <div className={js.fact}><div className={js.factK}>Prerequisite</div><div className={js.factV}>None</div></div>
          <div className={js.fact}><div className={js.factK}>You&apos;ll build</div><div className={js.factV}>6 real projects</div></div>
        </div>

        <div className={js.ctaRow}>
          {!isLoggedIn && (
            <Link href="/auth?redirect=/learn/javascript/course&mode=signup" className={`${styles.btn} ${styles.btnPrimary}`}>Sign in to start →</Link>
          )}
          {isLoggedIn && progress?.completed && (
            <>
              <Link href="/learn/javascript/certificate" className={`${styles.btn} ${styles.btnPrimary}`}>View certificate →</Link>
              <Link href="/learn/javascript/course" className={`${styles.btn} ${styles.btnGhost}`}>Review course</Link>
            </>
          )}
          {isLoggedIn && progress && !progress.completed && progress.percent > 0 && (
            <Link href="/learn/javascript/course" className={`${styles.btn} ${styles.btnPrimary}`}>Continue — {progress.percent}% complete →</Link>
          )}
          {isLoggedIn && (!progress || progress.percent === 0) && (
            <Link href="/learn/javascript/course" className={`${styles.btn} ${styles.btnPrimary}`}>Start the course →</Link>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className={styles.sectionLabel}>How this path works</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Every stage follows the same shape</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Why it matters, specifically what to learn, a real code example, something to build, and one
          question to check you actually understood it — not just watched it.
        </p>
        <ul className={js.learnList} style={{ marginTop: "1.25rem", gap: "0.6rem" }}>
          <li><strong style={{ color: "var(--text)" }}>Type every line yourself.</strong> Copy-pasting teaches your fingers nothing about how the language behaves.</li>
          <li><strong style={{ color: "var(--text)" }}>Predict before you run.</strong> Guess the output out loud before checking — that&apos;s where the learning happens.</li>
          <li><strong style={{ color: "var(--text)" }}>Build before you feel ready.</strong> &quot;Ready&quot; is a feeling that never quite arrives.</li>
        </ul>
      </section>

      {/* ── Stages ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>Nine stages, in this order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage leans on the one before it — closures don&apos;t make sense until you understand scope,
          and async doesn&apos;t make sense until you understand the call stack.
        </p>

        <div className={js.stageList}>
          {JS_STAGES.map((s) => (
            <article className={styles.card} key={s.num}>
              <div className={js.stageTop}>
                <div>
                  <span className={js.stageNum}>STAGE {s.num}</span>
                  <h3 className={js.stageTitle}>{s.title}</h3>
                </div>
                <span className={js.stageTime}>{s.time}</span>
              </div>
              <p className={js.stageWhy}>{s.why}</p>

              <div className={js.miniLabel}>What you&apos;ll learn</div>
              <ul className={js.learnList}>
                {s.learn.map((l) => <li key={l}>{l}</li>)}
              </ul>

              <div className={js.miniLabel}>Code</div>
              <pre className={js.stageCode}>
                {s.code.split(/(<KW>.*?<\/KW>)/g).map((part, i) => {
                  const match = part.match(/^<KW>(.*)<\/KW>$/);
                  return match ? <span className="js-kw" style={{ color: "var(--accent)" }} key={i}>{match[1]}</span> : <span key={i}>{part}</span>;
                })}
              </pre>

              <div className={js.calloutRow}>
                <div className={js.callout}>
                  <span className={js.calloutLabel}>Build</span>
                  {s.build}
                </div>
                <div className={js.callout}>
                  <span className={js.calloutLabel}>Self-check</span>
                  {s.check}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Capstone ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>Weeks 9–10</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>The capstone: build one real thing</h2>
        <article className={styles.card}>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
            Pick one — an expense tracker with hand-drawn Canvas charts (no chart library, so you actually
            understand what one is doing), or a Markdown note-taking app with live preview. This is the
            artifact that goes on your resume, not a certificate.
          </p>
          <div className={js.capstoneReqs}>
            <div>Persists state to localStorage</div>
            <div>Makes at least one real fetch call</div>
            <div>Has tests for its core logic</div>
            <div>Forms are keyboard-accessible</div>
            <div>Deployed live — not just on your laptop</div>
            <div>Deliberately no framework — this track is JS fundamentals</div>
          </div>
        </article>
      </section>

      {/* ── Pitfalls / Resources ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={js.twoCol}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Common pitfalls</h2>
            <ul className={js.pitList}>
              <li><strong>Tutorial hell.</strong> Watching a course isn&apos;t the same skill as building. Cap video time at 20% of your hours.</li>
              <li><strong>Skipping the &quot;why.&quot;</strong> Memorizing that closures are &quot;functions with memory&quot; without ever needing one is why it doesn&apos;t stick.</li>
              <li><strong>Searching too fast.</strong> Stuck past 25 minutes? Write down exactly what you tried before you search.</li>
              <li><strong>Framework-first.</strong> Reaching for React before this path is finished means you&apos;ll never know which parts of your app are React and which are just JavaScript.</li>
            </ul>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Resources worth your time</h2>
            <ul className={js.resList}>
              <li><span className={js.resName}>MDN Web Docs</span><span className={js.resTag}>reference</span></li>
              <li><span className={js.resName}>javascript.info</span><span className={js.resTag}>deep dives</span></li>
              <li><span className={js.resName}>Eloquent JavaScript</span><span className={js.resTag}>free book</span></li>
              <li><span className={js.resName}>freeCodeCamp</span><span className={js.resTag}>practice</span></li>
              <li><span className={js.resName}>Vitest docs</span><span className={js.resTag}>testing</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoIcon /></div>
          <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/learn">All tracks</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.footerTagline}>Made with ♥ for Indian developers</p>
      </footer>
    </div>
  );
}
