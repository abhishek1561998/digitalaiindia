"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";
import { CelebrateButton } from "./CelebrateButton";
import { AccountMenu } from "./AccountMenu";
import { Playground } from "./Playground";
import js from "./learn-js-landing.module.css";
import { AWS_STAGES } from "@/lib/tracks/aws-track";

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

export function LearnAwsLanding({ isLoggedIn, userName }: { isLoggedIn: boolean; userName: string | null }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/learn/progress?trackId=aws")
      .then((r) => r.json())
      .then((data) => {
        if (!data.enrollment) return;
        const sp = data.enrollment.stageProgress as Record<string, number>;
        const sum = Array.from({ length: AWS_STAGES.length }, (_, i) => sp[String(i)] || 0).reduce((a, b) => a + b, 0);
        setProgress({ percent: Math.round(sum / AWS_STAGES.length), completed: Boolean(data.enrollment.completedAt) });
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
          <Link href="/learn" style={{ color: "inherit" }}>DigitalAIIndia Learn</Link> — Track 08
        </div>
        <h1 className={styles.sectionTitle}>AWS, without the fog.</h1>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          AWS has 200+ services and almost all of them are noise when you&apos;re starting. This path takes the
          dozen that actually matter — IAM, EC2, VPC, Docker, ECS/Fargate, Lambda, EventBridge, S3, RDS,
          CodeArtifact — in the order they make sense, with every step written out click by click.
        </p>
        <div className={js.facts}>
          <div className={js.fact}><div className={js.factK}>Duration</div><div className={js.factV}>6–7 weeks</div></div>
          <div className={js.fact}><div className={js.factK}>Format</div><div className={js.factV}>Step-by-step</div></div>
          <div className={js.fact}><div className={js.factK}>Prerequisite</div><div className={js.factV}>Comfortable in a terminal</div></div>
          <div className={js.fact}><div className={js.factK}>You&apos;ll build</div><div className={js.factV}>A deployed containerised app</div></div>
        </div>

        <div className={js.ctaRow}>
          {!isLoggedIn && (
            <Link href="/auth?redirect=/learn/aws/course&mode=signup" className={`${styles.btn} ${styles.btnPrimary}`}>Sign in to start →</Link>
          )}
          {isLoggedIn && progress?.completed && (
            <>
              <Link href="/learn/aws/certificate" className={`${styles.btn} ${styles.btnPrimary}`}>View certificate →</Link>
              <Link href="/learn/aws/course" className={`${styles.btn} ${styles.btnGhost}`}>Review course</Link>
            </>
          )}
          {isLoggedIn && progress && !progress.completed && progress.percent > 0 && (
            <Link href="/learn/aws/course" className={`${styles.btn} ${styles.btnPrimary}`}>Continue — {progress.percent}% complete →</Link>
          )}
          {isLoggedIn && (!progress || progress.percent === 0) && (
            <Link href="/learn/aws/course" className={`${styles.btn} ${styles.btnPrimary}`}>Start the course →</Link>
          )}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div className={styles.sectionLabel}>How this path works</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>Every step written out, in order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          No &quot;just configure the VPC&quot; hand-waving. Each stage is numbered steps — which console screen,
          which button, which command — plus the reason behind it, so you can adapt when your screen looks
          slightly different.
        </p>
        <ul className={js.learnList} style={{ marginTop: "1.25rem", gap: "0.6rem" }}>
          <li><strong style={{ color: "var(--text)" }}>Billing safety in Stage 00.</strong> Budget alarm before your first instance — no horror stories.</li>
          <li><strong style={{ color: "var(--text)" }}>Security early, not bolted on.</strong> IAM comes second, before you build habits you&apos;d have to unlearn.</li>
          <li><strong style={{ color: "var(--text)" }}>Every stage ends deletable.</strong> You always know how to tear it down, so nothing bills forever.</li>
        </ul>
      </section>

      {/* ── Playground ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
        <div className={styles.sectionLabel}>Try before you commit</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>A live playground, right here</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px", marginBottom: "1.25rem" }}>
          No AWS account needed for this one. It&apos;s the bill for a &quot;small&quot; project that nobody cleaned up —
          the single most common thing that ends a side project on AWS. Edit the numbers and see what
          idle infrastructure really costs.
        </p>
        <Playground
          title="playground.js"
          initialCode={`// A "small" project bill, itemised. Guess the total first.\nconst monthly = [\n  { item: "t3.micro EC2 (always on)", usd: 7.59 },\n  { item: "30GB gp3 volume",          usd: 2.40 },\n  { item: "NAT Gateway",              usd: 32.40 },\n  { item: "Idle load balancer",       usd: 18.00 },\n  { item: "2 unattached EIPs",        usd: 7.20 },\n  { item: "Forgotten RDS db.t3.micro",usd: 15.33 },\n];\n\nlet total = 0;\nfor (const m of monthly) {\n  total += m.usd;\n  console.log(m.item.padEnd(30), "$" + m.usd.toFixed(2));\n}\n\nconsole.log("".padEnd(30, "-"), "-------");\nconsole.log("TOTAL".padEnd(30), "$" + total.toFixed(2), "= about Rs" + Math.round(total * 88));\n\nconst actuallyServingTraffic = monthly[0].usd + monthly[1].usd;\nconsole.log("\\nActually serving traffic: $" + actuallyServingTraffic.toFixed(2));\nconsole.log("Pure waste:               $" + (total - actuallyServingTraffic).toFixed(2));\n`}
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
            <div className={js.certPreviewLine}>has completed AWS, Without the Fog — 11 stages, 11 passed quizzes</div>
            <div className={js.certPreviewBadges}>
              <span>11 / 11 stages</span>
              <span>Deployed on AWS</span>
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
          <Link href="/learn/aws/certificate" className={`${styles.btn} ${styles.btnPrimary}`} style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            View your certificate →
          </Link>
        )}
      </section>

      {/* ── Stages ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>Eleven stages, in this order</h2>
        <p className={styles.sectionSub} style={{ maxWidth: "640px" }}>
          Each stage leans on the one before it — EC2 makes no sense without IAM, containers on AWS make no
          sense without Docker, and none of it is safe without the billing alarm from Stage 00.
        </p>

        <div className={js.stageList}>
          {AWS_STAGES.map((s) => (
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
        <div className={styles.sectionLabel}>Week 7</div>
        <h2 className={styles.sectionTitle} style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}>The capstone: your app, live on AWS</h2>
        <article className={styles.card}>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
            Take any app you&apos;ve built, containerise it, and run it on AWS properly — IAM roles instead of
            keys, a private subnet for the database, a scheduled Lambda, a budget alarm, and a documented
            teardown. &quot;I deployed it on AWS&quot; is common; being able to explain every one of those choices
            is not.
          </p>
          <div className={js.capstoneReqs}>
            <div>Containerised, pushed to ECR, running on Fargate</div>
            <div>IAM roles — zero long-lived access keys anywhere</div>
            <div>Database in a private subnet, not publicly reachable</div>
            <div>One scheduled Lambda via EventBridge</div>
            <div>Budget alarm + CloudWatch alarm on 5xx</div>
            <div>A written teardown checklist that zeroes the bill</div>
          </div>
        </article>
      </section>

      {/* ── Pitfalls / Resources ── */}
      <section className={styles.section + " " + js.tight} style={{ paddingTop: "1rem" }}>
        <div className={js.twoCol}>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Common pitfalls</h2>
            <ul className={js.pitList}>
              <li><strong>Access keys in code.</strong> Use IAM roles for services. A key committed to git is someone else mining crypto on your card.</li>
              <li><strong>AdministratorAccess on everything.</strong> It works, so nobody fixes it — until one leaked credential owns the whole account.</li>
              <li><strong>Forgetting the NAT Gateway.</strong> ~$32/month whether or not a single byte flows. The classic surprise bill.</li>
              <li><strong>0.0.0.0/0 on port 22.</strong> Bots find open SSH within minutes. Restrict it to your IP.</li>
            </ul>
          </div>
          <div>
            <h2 className={styles.sectionTitle} style={{ fontSize: "1.3rem" }}>Resources worth your time</h2>
            <ul className={js.resList}>
              <li><span className={js.resName}>AWS Free Tier page</span><span className={js.resTag}>check limits</span></li>
              <li><span className={js.resName}>AWS Well-Architected</span><span className={js.resTag}>the framework</span></li>
              <li><span className={js.resName}>AWS Skill Builder</span><span className={js.resTag}>free courses</span></li>
              <li><span className={js.resName}>Docker docs</span><span className={js.resTag}>reference</span></li>
              <li><span className={js.resName}>AWS Pricing Calculator</span><span className={js.resTag}>estimate first</span></li>
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
