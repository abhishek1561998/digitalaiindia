"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import { BrandLogo } from "./BrandLogo";
import { CelebrateButton } from "./CelebrateButton";
import { AccountMenu } from "./AccountMenu";
import { WireframeCanvas } from "./WireframeCanvas";
import js from "./learn-js-landing.module.css";
import { UIUX_STAGES } from "@/lib/tracks/uiux-track";

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

export function LearnUiuxLanding({ isLoggedIn, userName }: { isLoggedIn: boolean; userName: string | null }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/learn/progress?trackId=uiux")
      .then((r) => r.json())
      .then((data) => {
        if (!data.enrollment) return;
        const sp = data.enrollment.stageProgress as Record<string, number>;
        const sum = Array.from({ length: UIUX_STAGES.length }, (_, i) => sp[String(i)] || 0).reduce((a, b) => a + b, 0);
        setProgress({ percent: Math.round(sum / UIUX_STAGES.length), completed: Boolean(data.enrollment.completedAt) });
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
          <Link href="/learn" style={{ color: "inherit" }}>DigitalAIIndia Learn</Link> — Track 07
        </div>
        <h1 className={styles.sectionTitle}>Design you can defend.</h1>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          &quot;Make it look nicer&quot; feels unanswerable if you think design is taste. It isn&apos;t — hierarchy,
          spacing, type, contrast and states are rules with defensible answers. This path is UI/UX for people
          who build the thing, so &quot;it looks off&quot; becomes something you can diagnose and fix.
        </p>
        <div className={js.facts}>
          <div className={js.fact}><div className={js.factK}>Duration</div><div className={js.factV}>5–6 weeks</div></div>
          <div className={js.fact}><div className={js.factK}>Format</div><div className={js.factV}>Rules, not taste</div></div>
          <div className={js.fact}><div className={js.factK}>Prerequisite</div><div className={js.factV}>Any HTML/CSS</div></div>
          <div className={js.fact}><div className={js.factK}>You&apos;ll build</div><div className={js.factV}>A redesigned real project</div></div>
        </div>

        <div className={js.ctaRow}>
          {!isLoggedIn && (
            <Link href="/auth?redirect=/learn/ui-ux/course&mode=signup" className={`${styles.btn} ${styles.btnPrimary}`}>Sign in to start →</Link>
          )}
          {isLoggedIn && progress?.completed && (
            <>
              <Link href="/learn/ui-ux/certificate" className={`${styles.btn} ${styles.btnPrimary}`}>View certificate →</Link>
              <Link href="/learn/ui-ux/course" className={`${styles.btn} ${styles.btnGhost}`}>Review course</Link>
            </>
          )}
          {isLoggedIn && progress && !progress.completed && progress.percent > 0 && (
            <Link href="/learn/ui-ux/course" className={`${styles.btn} ${styles.btnPrimary}`}>Continue — {progress.percent}% complete →</Link>
          )}
          {isLoggedIn && (!progress || progress.percent === 0) && (
            <Link href="/learn/ui-ux/course" className={`${styles.btn} ${styles.btnPrimary}`}>Start the course →</Link>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className={styles.sectionLabel}>How this path works</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Each stage is one rule you can apply today</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage takes one thing that makes developer-built UIs look developer-built — spacing, type,
          contrast, missing states, no focus ring — and gives you the concrete rule that fixes it.
        </p>
        <ul className={js.learnList} style={{ marginTop: "1.25rem", gap: "0.6rem" }}>
          <li><strong style={{ color: "var(--text)" }}>Rules over taste.</strong> Proximity, measure, contrast ratios — these have numbers, and numbers can be checked.</li>
          <li><strong style={{ color: "var(--text)" }}>Accessibility isn&apos;t a separate track.</strong> It&apos;s woven through every stage, because it&apos;s part of the design, not an audit afterward.</li>
          <li><strong style={{ color: "var(--text)" }}>Test on people, not opinions.</strong> Five silent observations beat any amount of internal debate.</li>
        </ul>
      </section>

      {/* ── Sketchpad ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Try before you commit</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>A sketchpad, right here</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          No setup, no account, no Figma login. Sketch a screen the way you would on paper — boxes, buttons,
          inputs, arrows. Deliberately rough, because rough is fast, and fast is the whole point of
          low-fidelity work.
        </p>
        <WireframeCanvas
          title="wireframe"
          starterHint="Try sketching a login screen — logo, two inputs, one primary button."
        />
      </section>

      {/* ── Tools ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Your toolkit</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Which tool, and when</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Tool confusion wastes weeks. Stage 01 covers this properly, but here&apos;s the short version so
          you don&apos;t invest in the wrong software.
        </p>
        <div className={js.toolGrid}>
          <article className={`${js.toolCard} ${js.toolCardPrimary}`}>
            <div className={js.toolName}>Figma <span className={`${js.toolTag} ${js.toolTagOn}`}>Learn this</span></div>
            <p>
              The current industry default, and the one worth real practice. Browser-based, free tier is
              genuinely enough to get hired on. Focus on four things: Auto Layout, Components, Variants,
              and Dev Mode.
            </p>
          </article>
          <article className={js.toolCard}>
            <div className={js.toolName}>Sketching <span className={js.toolTag}>Start here</span></div>
            <p>
              Paper or a rough canvas — like the sketchpad above. Deliberately ugly, therefore fast. You&apos;ll
              throw away five layouts in ten minutes, which is exactly what you want before committing.
            </p>
          </article>
          <article className={js.toolCard}>
            <div className={js.toolName}>Adobe XD <span className={js.toolTag}>Legacy</span></div>
            <p>
              Adobe moved XD into maintenance mode and stopped selling it standalone — it still opens old
              files, but new development stopped. Worth learning only if a specific employer already runs
              on it. Penpot is the open-source alternative worth knowing.
            </p>
          </article>
        </div>
      </section>

      {/* ── Career ladder ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Where this takes you</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>
          How you actually become a designer people hire
        </h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Knowing the rules doesn&apos;t make you hireable — showing judgment does. Stage 10 covers the
          portfolio format and how to get your first real work. This is the map.
        </p>
        <div className={js.ladder}>
          <div className={js.ladderRow}>
            <span className={js.ladderNum}>1</span>
            <div>
              <div className={js.ladderTitle}>Can use the tool</div>
              <p className={js.ladderDesc}>
                Knows Figma. Copies layouts that look nice. Not yet hireable as a designer — this is the
                level most tutorials leave you at.
              </p>
            </div>
          </div>
          <div className={js.ladderRow}>
            <span className={js.ladderNum}>2</span>
            <div>
              <div className={js.ladderTitle}>Can make it look good</div>
              <p className={js.ladderDesc}>
                Consistent spacing, a real type scale, decent taste. Hireable as a junior — the ceiling is
                that you still need someone else to tell you what to make.
              </p>
            </div>
          </div>
          <div className={`${js.ladderRow} ${js.ladderRowKey}`}>
            <span className={js.ladderNum}>3</span>
            <div>
              <div className={js.ladderTitle}>
                Can defend every decision <span className={js.ladderNote}>the jump that pays</span>
              </div>
              <p className={js.ladderDesc}>
                &quot;This is primary because it&apos;s the one action 90% of users came for — I tested the other
                way and completion dropped.&quot; Most people never make this jump, which is exactly why it&apos;s
                where the money is. Stages 00–10 are aimed squarely at getting you here.
              </p>
            </div>
          </div>
          <div className={js.ladderRow}>
            <span className={js.ladderNum}>4</span>
            <div>
              <div className={js.ladderTitle}>Can set direction</div>
              <p className={js.ladderDesc}>
                Decides what <em>not</em> to build. Owns the design system. Makes the other designers around
                them better. Years, not weeks — but the path runs through level 3, not around it.
              </p>
            </div>
          </div>
        </div>
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
            <div className={js.certPreviewLine}>has completed Design You Can Defend — 11 stages, 11 passed quizzes</div>
            <div className={js.certPreviewBadges}>
              <span>11 / 11 stages</span>
              <span>Accessible by default</span>
              <span>Verified ID</span>
            </div>
          </div>
          {!progress?.completed && (
            <div className={js.certPreviewOverlay}>
              <span className={js.certPreviewLock}>🔒</span>
              <p>
                {progress && progress.percent > 0
                  ? `${progress.percent}% there — finish the remaining stages to unlock this.`
                  : "Complete all 11 stages and their quizzes to unlock this."}
              </p>
            </div>
          )}
        </div>
        {progress?.completed && (
          <Link href="/learn/ui-ux/certificate" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            View your certificate →
          </Link>
        )}
      </section>

      {/* ── Stages ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>Eleven stages, in this order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage leans on the one before it — spacing systems only make sense once you&apos;ve felt
          arbitrary values drift, and component states only matter once hierarchy is settled.
        </p>

        <div className={js.stageList}>
          {UIUX_STAGES.map((s) => (
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
        <div className={styles.sectionLabel}>Weeks 5–6</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>The capstone: redesign something you built</h2>
        <article className={styles.card}>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
            Take a project you&apos;ve already built and redesign it applying every stage — real type scale, real
            spacing tokens, contrast that passes, every component state, full keyboard access. Keep a
            before/after screenshot pair: that comparison says more in an interview than any certificate.
          </p>
          <div className={js.capstoneReqs}>
            <div>Before/after screenshots of every screen</div>
            <div>A documented type scale and spacing scale</div>
            <div>Every text pair passes WCAG AA contrast</div>
            <div>All six states designed on every interactive component</div>
            <div>Fully usable with the keyboard alone</div>
            <div>Notes from watching 3 real people use it</div>
          </div>
        </article>
      </section>

      {/* ── Pitfalls / Resources ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={js.twoCol}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Common pitfalls</h2>
            <ul className={js.pitList}>
              <li><strong>Designing only the default state.</strong> Real components spend most of their life in loading, empty, error, and disabled.</li>
              <li><strong>outline: none.</strong> One line that makes your entire interface unusable by keyboard. Restyle the focus ring, never delete it.</li>
              <li><strong>Eyeballing contrast.</strong> Light grey on white looks elegant on your bright monitor and vanishes on a phone in sunlight. Compute it.</li>
              <li><strong>Asking &quot;do you like it?&quot;</strong> People are polite. Give them a task and watch silently instead.</li>
            </ul>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Resources worth your time</h2>
            <ul className={js.resList}>
              <li><span className={js.resName}>Refactoring UI</span><span className={js.resTag}>the book</span></li>
              <li><span className={js.resName}>WebAIM Contrast Checker</span><span className={js.resTag}>free tool</span></li>
              <li><span className={js.resName}>WCAG Quick Reference</span><span className={js.resTag}>standard</span></li>
              <li><span className={js.resName}>Nielsen Norman Group</span><span className={js.resTag}>UX research</span></li>
              <li><span className={js.resName}>Inclusive Components</span><span className={js.resTag}>a11y patterns</span></li>
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
