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
import { PROJECT_STAGES } from "@/lib/tracks/project-track";

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

export function LearnProjectLanding({ isLoggedIn, userName }: { isLoggedIn: boolean; userName: string | null }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/learn/progress?trackId=project")
      .then((r) => r.json())
      .then((data) => {
        if (!data.enrollment) return;
        const sp = data.enrollment.stageProgress as Record<string, number>;
        const sum = Array.from({ length: PROJECT_STAGES.length }, (_, i) => sp[String(i)] || 0).reduce((a, b) => a + b, 0);
        setProgress({ percent: Math.round(sum / PROJECT_STAGES.length), completed: Boolean(data.enrollment.completedAt) });
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
          <Link href="/learn" style={{ color: "inherit" }}>DigitalAIIndia Learn</Link> — Track 06
        </div>
        <h1 className={styles.sectionTitle}>Finish something real.</h1>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Most side projects die at 60% — not from a technical wall, but from scope, setup, or never
          shipping. This path is the process: choose something worth building, cut it until it fits, ship
          it live, document it, and be able to talk about it without saying &quot;I used React and Node.&quot;
        </p>
        <div className={js.facts}>
          <div className={js.fact}><div className={js.factK}>Duration</div><div className={js.factV}>6 weeks</div></div>
          <div className={js.fact}><div className={js.factK}>Format</div><div className={js.factV}>Your own idea</div></div>
          <div className={js.fact}><div className={js.factK}>Prerequisite</div><div className={js.factV}>Any one build track</div></div>
          <div className={js.fact}><div className={js.factK}>You&apos;ll build</div><div className={js.factV}>A shipped, documented project</div></div>
        </div>

        <div className={js.ctaRow}>
          {!isLoggedIn && (
            <Link href="/auth?redirect=/learn/project-building/course&mode=signup" className={`${styles.btn} ${styles.btnPrimary}`}>Sign in to start →</Link>
          )}
          {isLoggedIn && progress?.completed && (
            <>
              <Link href="/learn/project-building/certificate" className={`${styles.btn} ${styles.btnPrimary}`}>View certificate →</Link>
              <Link href="/learn/project-building/course" className={`${styles.btn} ${styles.btnGhost}`}>Review course</Link>
            </>
          )}
          {isLoggedIn && progress && !progress.completed && progress.percent > 0 && (
            <Link href="/learn/project-building/course" className={`${styles.btn} ${styles.btnPrimary}`}>Continue — {progress.percent}% complete →</Link>
          )}
          {isLoggedIn && (!progress || progress.percent === 0) && (
            <Link href="/learn/project-building/course" className={`${styles.btn} ${styles.btnPrimary}`}>Start the course →</Link>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className={styles.sectionLabel}>How this path works</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Each stage is where projects usually die</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage targets one specific reason side projects fail — wrong idea, too much scope, bad setup,
          designing too early, ignoring edge cases, never deploying, no README, can&apos;t explain it.
        </p>
        <ul className={js.learnList} style={{ marginTop: "1.25rem", gap: "0.6rem" }}>
          <li><strong style={{ color: "var(--text)" }}>Finished beats ambitious.</strong> A small working project outperforms an abandoned impressive one, every time.</li>
          <li><strong style={{ color: "var(--text)" }}>Deploy in week one.</strong> Not when it&apos;s ready — production bugs are a separate class and you want them early.</li>
          <li><strong style={{ color: "var(--text)" }}>Ugly and working first.</strong> You can&apos;t design a UI for a flow that doesn&apos;t exist yet.</li>
        </ul>
      </section>

      {/* ── Playground ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Try before you commit</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>A live playground, right here</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          No setup, no account. This is Stage 1&apos;s scope-cutting exercise as code — move features between
          the lists and see what actually ships in three weeks.
        </p>
        <Playground
          title="playground.js"
          initialCode={`const everythingIThoughtOf = [\n  "auth", "reminders", "calendar sync", "mobile app",\n  "sharing", "dark mode", "notifications", "export", "teams",\n];\n\nconst weeksAvailable = 3;\nconst realisticFeaturesPerWeek = 1; // be honest\n\nconst mustHave = everythingIThoughtOf.slice(0, weeksAvailable * realisticFeaturesPerWeek);\nconst later = everythingIThoughtOf.slice(mustHave.length);\n\nconsole.log("SHIPPING:", mustHave);\nconsole.log("LATER:   ", later);\n`}
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
            <div className={js.certPreviewLine}>has completed Finish Something Real — 9 stages, 9 passed quizzes</div>
            <div className={js.certPreviewBadges}>
              <span>9 / 9 stages</span>
              <span>Shipped project</span>
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
          <Link href="/learn/project-building/certificate" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            View your certificate →
          </Link>
        )}
      </section>

      {/* ── Stages ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>Nine stages, in this order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage leans on the one before it — you can&apos;t scope an idea you haven&apos;t chosen, and you
          can&apos;t document a project you never shipped.
        </p>

        <div className={js.stageList}>
          {PROJECT_STAGES.map((s) => (
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
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>The capstone: your project, actually shipped</h2>
        <article className={styles.card}>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
            The project you carried through all 9 stages IS the deliverable — your own idea, scoped down,
            built ugly first, hardened, deployed to a real URL, documented, and used by at least three real
            people whose confusion you watched and fixed.
          </p>
          <div className={js.capstoneReqs}>
            <div>Live URL — anyone can try it without cloning</div>
            <div>Your own idea, not a tutorial clone</div>
            <div>All four states handled on every screen</div>
            <div>README with live link, screenshot, and the why</div>
            <div>3 real people have used it</div>
            <div>A rehearsed 2-minute walkthrough you can give cold</div>
          </div>
        </article>
      </section>

      {/* ── Pitfalls / Resources ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={js.twoCol}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Common pitfalls</h2>
            <ul className={js.pitList}>
              <li><strong>Restarting instead of finishing.</strong> The third abandoned repo teaches less than one finished small thing.</li>
              <li><strong>Polishing before it works.</strong> Perfecting a login screen for an app with no core flow is procrastination wearing a productive hat.</li>
              <li><strong>Deploying last.</strong> Production bugs are their own category. Find them in week two, not the night before a demo.</li>
              <li><strong>Never showing anyone.</strong> One confused real user teaches more than a week of features nobody asked for.</li>
            </ul>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Resources worth your time</h2>
            <ul className={js.resList}>
              <li><span className={js.resName}>Vercel / Netlify docs</span><span className={js.resTag}>deploy</span></li>
              <li><span className={js.resName}>Render / Railway docs</span><span className={js.resTag}>deploy</span></li>
              <li><span className={js.resName}>Makeareadme.com</span><span className={js.resTag}>README</span></li>
              <li><span className={js.resName}>Shape Up (Basecamp)</span><span className={js.resTag}>scoping</span></li>
              <li><span className={js.resName}>Conventional Commits</span><span className={js.resTag}>git hygiene</span></li>
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
