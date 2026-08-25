"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import { BrandLogo } from "./BrandLogo";
import { CelebrateButton } from "./CelebrateButton";
import { AccountMenu } from "./AccountMenu";
import { Playground } from "./Playground";
import js from "./learn-js-landing.module.css";
import { SYSDESIGN_STAGES } from "@/lib/tracks/sysdesign-track";

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

export function LearnSysdesignLanding({ isLoggedIn, userName }: { isLoggedIn: boolean; userName: string | null }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/learn/progress?trackId=sysdesign")
      .then((r) => r.json())
      .then((data) => {
        if (!data.enrollment) return;
        const sp = data.enrollment.stageProgress as Record<string, number>;
        const sum = Array.from({ length: SYSDESIGN_STAGES.length }, (_, i) => sp[String(i)] || 0).reduce((a, b) => a + b, 0);
        setProgress({ percent: Math.round(sum / SYSDESIGN_STAGES.length), completed: Boolean(data.enrollment.completedAt) });
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
        <BrandLogo />
        <div className={styles.navLinks}>
          <a href="https://digitalaiindia.com" className={styles.navBackLink}>← digitalaiindia.com</a>
          <Link href="/learn">All tracks</Link>
        </div>
        <div className={styles.navRight}>
          <CelebrateButton />
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {isLoggedIn && userName && <AccountMenu userName={userName} />}
          <button type="button" className={styles.navHamburger} onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <a href="https://digitalaiindia.com" onClick={() => setMobileOpen(false)}>← digitalaiindia.com</a>
          <Link href="/learn" onClick={() => setMobileOpen(false)}>All tracks</Link>
          <div className={styles.mobileMenuActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { toggleTheme(); setMobileOpen(false); }}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <section className={styles.section} style={{ paddingTop: "7.5rem", paddingBottom: "1.5rem" }}>
        <div className={styles.sectionLabel}>
          <Link href="/learn" style={{ color: "inherit" }}>DigitalAIIndia Learn</Link> — Track 05
        </div>
        <h1 className={styles.sectionTitle}>Defend every box you draw.</h1>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          System design gets taught as &quot;memorize these diagrams,&quot; which is why people can reproduce an
          architecture but can&apos;t defend one decision in it. This path is about tradeoffs under constraints —
          so a system you&apos;ve never designed before still has an obvious first question.
        </p>
        <div className={js.facts}>
          <div className={js.fact}><div className={js.factK}>Duration</div><div className={js.factV}>7–8 weeks</div></div>
          <div className={js.fact}><div className={js.factK}>Format</div><div className={js.factV}>Tradeoff-driven</div></div>
          <div className={js.fact}><div className={js.factK}>Prerequisite</div><div className={js.factV}>Built a real app before</div></div>
          <div className={js.fact}><div className={js.factK}>You&apos;ll build</div><div className={js.factV}>A design playbook</div></div>
        </div>

        <div className={js.ctaRow}>
          {!isLoggedIn && (
            <Link href="/auth?redirect=/learn/system-design/course&mode=signup" className={`${styles.btn} ${styles.btnPrimary}`}>Sign in to start →</Link>
          )}
          {isLoggedIn && progress?.completed && (
            <>
              <Link href="/learn/system-design/certificate" className={`${styles.btn} ${styles.btnPrimary}`}>View certificate →</Link>
              <Link href="/learn/system-design/course" className={`${styles.btn} ${styles.btnGhost}`}>Review course</Link>
            </>
          )}
          {isLoggedIn && progress && !progress.completed && progress.percent > 0 && (
            <Link href="/learn/system-design/course" className={`${styles.btn} ${styles.btnPrimary}`}>Continue — {progress.percent}% complete →</Link>
          )}
          {isLoggedIn && (!progress || progress.percent === 0) && (
            <Link href="/learn/system-design/course" className={`${styles.btn} ${styles.btnPrimary}`}>Start the course →</Link>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className={styles.sectionLabel}>How this path works</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Each stage is one real constraint</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage introduces one force that reshapes a design — scale, state, storage, staleness,
          coupling, partition, blindness — and what it actually costs you to handle it.
        </p>
        <ul className={js.learnList} style={{ marginTop: "1.25rem", gap: "0.6rem" }}>
          <li><strong style={{ color: "var(--text)" }}>Estimate before you architect.</strong> Peak QPS and storage math change the design more than any framework choice.</li>
          <li><strong style={{ color: "var(--text)" }}>Draw the diagram last.</strong> Boxes are the output of reasoning, not a substitute for it.</li>
          <li><strong style={{ color: "var(--text)" }}>Name your weaknesses first.</strong> Every design gives something up — knowing what is the whole skill.</li>
        </ul>
      </section>

      {/* ── Playground ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Try before you commit</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>A live playground, right here</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          No setup, no account. This is Stage 0&apos;s back-of-envelope estimate — the calculation that decides
          whether you need one server or fifty. Change the inputs and watch it move.
        </p>
        <Playground
          title="playground.js"
          initialCode={`const dailyActiveUsers = 100000;\nconst requestsPerUserPerDay = 20;\n\nconst totalDaily = dailyActiveUsers * requestsPerUserPerDay;\nconst avgPerSecond = totalDaily / 86400;\nconst peakPerSecond = avgPerSecond * 10; // traffic is never flat\n\nconsole.log("total/day: ", totalDaily.toLocaleString());\nconsole.log("avg  req/s:", Math.round(avgPerSecond));\nconsole.log("peak req/s:", Math.round(peakPerSecond));\n`}
        />
      </section>

      {/* ── Certificate preview ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>What you&apos;ll earn</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>
          {progress?.completed ? "Your certificate is ready" : "This is what's waiting at the end"}
        </h2>
        <div className={js.certPreviewWrap}>
          <div className={`${js.certPreview} ${!progress?.completed ? js.certPreviewLocked : ""}`}>
            <div className={js.certPreviewTricolor} />
            <div className={js.certPreviewEyebrow}>Certificate of Completion</div>
            <div className={js.certPreviewName}>{userName || "Your Name"}</div>
            <div className={js.certPreviewLine}>has completed Defend Every Box You Draw — 9 stages, 9 passed quizzes</div>
            <div className={js.certPreviewBadges}>
              <span>9 / 9 stages</span>
              <span>Design playbook</span>
              <span>Verified ID</span>
            </div>
          </div>
          {!progress?.completed && (
            <div className={js.certPreviewOverlay}>
              <span className={js.certPreviewLock}>🔒</span>
              <p>
                {progress && progress.percent > 0
                  ? `${progress.percent}% there — finish the remaining stages to unlock this.`
                  : "Complete all 9 stages and their quizzes to unlock this."}
              </p>
            </div>
          )}
        </div>
        {progress?.completed && (
          <Link href="/learn/system-design/certificate" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            View your certificate →
          </Link>
        )}
      </section>

      {/* ── Stages ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>Nine stages, in this order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage leans on the one before it — you can&apos;t reason about caching until you understand the
          database load it&apos;s relieving, or about queues until you&apos;ve felt synchronous coupling hurt.
        </p>

        <div className={js.stageList}>
          {SYSDESIGN_STAGES.map((s) => (
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
        <div className={styles.sectionLabel}>Weeks 7–8</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>The capstone: two designs, fully defended</h2>
        <article className={styles.card}>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
            Two systems designed end to end following all 8 steps — written out, not just imagined — plus three
            recorded 45-minute mock designs. The written designs are what you reread before an interview; the
            recordings are how you find out you jump to technologies too early.
          </p>
          <div className={js.capstoneReqs}>
            <div>Two full designs, written out in all 8 steps</div>
            <div>Back-of-envelope numbers with stated assumptions</div>
            <div>An explicit bottleneck, and how you&apos;d scale it</div>
            <div>Tradeoffs section — what you gave up, and why</div>
            <div>3 recorded 45-minute mock designs</div>
            <div>Notes on where you named tech before requirements</div>
          </div>
        </article>
      </section>

      {/* ── Pitfalls / Resources ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={js.twoCol}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Common pitfalls</h2>
            <ul className={js.pitList}>
              <li><strong>Technology-first answers.</strong> Naming Kafka before establishing requirements signals pattern-matching, not reasoning.</li>
              <li><strong>Designing for imaginary scale.</strong> Sharding a system with 200 users isn&apos;t foresight, it&apos;s a red flag.</li>
              <li><strong>Memorizing diagrams.</strong> You&apos;ll be asked &quot;why?&quot; about every box — a remembered picture has no answer.</li>
              <li><strong>Hiding the weaknesses.</strong> Every design has them. Naming yours first reads as senior; being caught out doesn&apos;t.</li>
            </ul>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Resources worth your time</h2>
            <ul className={js.resList}>
              <li><span className={js.resName}>Designing Data-Intensive Applications</span><span className={js.resTag}>the book</span></li>
              <li><span className={js.resName}>System Design Primer (GitHub)</span><span className={js.resTag}>free</span></li>
              <li><span className={js.resName}>High Scalability</span><span className={js.resTag}>case studies</span></li>
              <li><span className={js.resName}>AWS Architecture Center</span><span className={js.resTag}>patterns</span></li>
              <li><span className={js.resName}>Google SRE Book</span><span className={js.resTag}>free, ops</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <BrandLogo />
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
