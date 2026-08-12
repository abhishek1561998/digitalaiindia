"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";
import learn from "./learn-landing.module.css";

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

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const LogoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const MernIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <rect x="3" y="10" width="18" height="4" rx="1" />
    <rect x="3" y="16" width="18" height="4" rx="1" />
  </svg>
);

const JsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3C6 3 6 5 6 6.5S6 9 4 9M8 21c-2 0-2-2-2-3.5S6 15 4 15" />
    <path d="M16 3c2 0 2 2 2 3.5S18 9 20 9M16 21c2 0 2-2 2-3.5S18 15 20 15" />
  </svg>
);

const DsaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <circle cx="5" cy="14" r="2" />
    <circle cx="12" cy="14" r="2" />
    <circle cx="19" cy="14" r="2" />
    <circle cx="5" cy="20" r="1.5" />
    <circle cx="19" cy="20" r="1.5" />
    <path d="M12 6v6M12 6 5 12M12 6l7 6M5 16v2M19 16v2" />
  </svg>
);

const AiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const LayersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const RocketIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const snippets: Record<string, string> = {
  rag: `from langchain_experimental.text_splitter import SemanticChunker\nfrom langchain_openai import OpenAIEmbeddings\n\n# Split on meaning, not character count\nsplitter = SemanticChunker(\n  OpenAIEmbeddings(),\n  breakpoint_threshold_type="percentile"\n)\nchunks = splitter.create_documents([document_text])`,
  voice: `// tts-providers.ts — pluggable TTS backend\n// The public route doesn't care which vendor generates\n// the audio. It calls synthesize() and we resolve:\n//\n//   1. User's own BYOK integration (dashboard Voice tab)\n//   2. Platform env fallback (SARVAM_API_KEY, etc.)\n\nexport async function synthesize(\n  provider: ResolvedProvider,\n  options: SynthesizeOptions\n): Promise<AudioResult> { /* ... */ }`,
  architecture: `digitalaiindia/\n├── app/api/v1/voice/tts/   → public endpoint\n├── lib/server/\n│   ├── voice-integrations.ts → resolve active key\n│   └── tts-providers.ts      → call Sarvam/ElevenLabs\n└── prisma/schema.prisma      → VoiceIntegration model`,
};

const tracks = [
  {
    id: "js",
    icon: <JsIcon />,
    bg: "rgba(255,200,50,0.14)",
    fg: "#FFC832",
    title: "JavaScript fundamentals",
    level: "Beginner",
    desc: "From variables to closures, promises, and modern ES6+ patterns — the language behind everything else here.",
    build: "small interactive projects that lock in each concept as you go.",
    tags: ["ES6+", "Async", "DOM", "Closures"],
  },
  {
    id: "dsa",
    icon: <DsaIcon />,
    bg: "rgba(124,124,255,0.14)",
    fg: "#7C7CFF",
    title: "Data structures & algorithms",
    level: "Core CS",
    desc: "Pattern-based problem solving — arrays, trees, graphs, and dynamic programming, taught for interviews.",
    build: "a personal problem-solving playbook you can reuse in any interview.",
    tags: ["Arrays", "Trees", "Graphs", "DP"],
  },
  {
    id: "mern",
    icon: <MernIcon />,
    bg: "rgba(0,229,176,0.14)",
    fg: "#00E5B0",
    title: "MERN stack",
    level: "Intermediate",
    desc: "MongoDB, Express, React and Node — how a full-stack web app actually fits together in production.",
    build: "a full-stack app with auth, a database, and a deployed frontend.",
    tags: ["MongoDB", "Express", "React", "Node"],
  },
  {
    id: "ai",
    icon: <AiIcon />,
    bg: "rgba(255,117,0,0.16)",
    fg: "#FF7500",
    title: "AI engineering",
    level: "Advanced",
    desc: "RAG pipelines, LLM app patterns, and voice AI — how we build the AI features inside DigitalAIIndia itself.",
    build: "a real RAG pipeline and a voice AI integration, end to end.",
    tags: ["RAG", "LLMs", "Voice AI"],
  },
  {
    id: "sysdesign",
    icon: <LayersIcon />,
    bg: "rgba(255,61,107,0.14)",
    fg: "#FF3D6B",
    title: "System design",
    level: "Advanced",
    desc: "High-level and low-level design — how to structure a growing product so it doesn't fall over.",
    build: "HLD/LLD diagrams for a system that's designed to scale.",
    tags: ["HLD", "LLD", "Scaling"],
  },
  {
    id: "project",
    icon: <RocketIcon />,
    bg: "rgba(0,200,255,0.14)",
    fg: "#00C8FF",
    title: "Project building",
    level: "Intermediate",
    desc: "Turn what you've learned into something real — planned, built, deployed, and documented like a shipped product.",
    build: "a portfolio-ready project, deployed and documented.",
    tags: ["Git", "Deploy", "Portfolio"],
  },
];

const pathStages = [
  { n: "01", label: "Foundations", sub: "JavaScript & DSA" },
  { n: "02", label: "Pick a stack", sub: "MERN or AI engineering" },
  { n: "03", label: "Build", sub: "Real, deployed projects" },
  { n: "04", label: "Think in systems", sub: "System design" },
  { n: "05", label: "Job ready", sub: "Portfolio & interviews" },
];

export function LearnLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [tab, setTab] = useState<"rag" | "voice" | "architecture">("rag");
  const [waitName, setWaitName] = useState("");
  const [waitEmail, setWaitEmail] = useState("");
  const [waitStatus, setWaitStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  async function submitWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitName.trim() || !waitEmail.trim()) return;
    setWaitStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: waitName,
          email: waitEmail,
          subject: "Learn waitlist",
          message: `${waitName} wants to be notified when a Learn track launches.`,
          service: "learn",
        }),
      });
      setWaitStatus(res.ok ? "done" : "error");
    } catch {
      setWaitStatus("error");
    }
  }

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

  function scrollToPath(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("path")?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToWaitlist(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable}`}
      data-theme={theme}
    >
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
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/auth"} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>
            Sign In
          </Link>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
            Get API Key
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.jaliPattern} />
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.heroGrid} />
        <div className={learn.floaters} aria-hidden="true">
          <span className={`${learn.floater} ${learn.f1}`}>{"</>"}</span>
          <span className={`${learn.floater} ${learn.f2}`}>{"{ }"}</span>
          <span className={`${learn.floater} ${learn.f3}`}>O(log n)</span>
          <span className={`${learn.floater} ${learn.f4}`}>AI</span>
          <span className={`${learn.floater} ${learn.f5}`}>MERN</span>
        </div>

        <div className={styles.heroBadge}>
          <span className={styles.dot} /> For students — learn by building
        </div>

        <h1 className={`${styles.heroTitle} ${learn.glowTextTitle}`}>
          Become a developer,
          <br />
          not just a <em className={`${styles.heroEm} ${learn.glowText}`}>certificate</em>
        </h1>

        <p className={styles.heroSub}>
          MERN, JavaScript, DSA, AI engineering, project building, and system design —<br />
          one path, real projects, no fluff.
        </p>

        <div className={styles.heroCtas}>
          <button type="button" onClick={scrollToWaitlist} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Get notified when tracks launch <ArrowIcon />
          </button>
          <button type="button" onClick={scrollToPath} className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            See the path
          </button>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}><strong>6</strong><span>Tracks</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>Free</strong><span>During beta</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>Real</strong><span>Projects, not slides</span></div>
        </div>
      </section>

      {/* ── Who this is for ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Who this is for</div>
        <h2 className={styles.sectionTitle}>Built for people starting from different places</h2>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>College students</strong><span>No CS background needed to start</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Career switchers</strong><span>A structured path into tech</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Working developers</strong><span>Leveling up into AI engineering</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Self-taught coders</strong><span>Structure for what you already know</span></div>
        </div>
      </section>

      {/* ── Learning path ── */}
      <section className={styles.section} id="path">
        <div className={styles.sectionLabel}>The path</div>
        <h2 className={styles.sectionTitle}>One route from zero to job-ready</h2>
        <p className={styles.sectionSub}>Every track fits into the same journey — skip ahead if you already know a stage.</p>
        <div className={learn.path}>
          <div className={learn.pathLine} />
          {pathStages.map((stage) => (
            <div className={learn.pathStage} key={stage.n}>
              <div className={learn.pathDot}>{stage.n}</div>
              <div className={learn.pathLabel}>{stage.label}</div>
              <div className={learn.pathSub}>{stage.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stack Comparison ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>The Difference</div>
        <h2 className={styles.sectionTitle}>Not another generic coding course</h2>
        <p className={styles.sectionSub}>Most tutorials teach syntax. We show how real products get built and shipped.</p>
        <div className={styles.comparison}>
          <div className={`${styles.compareCard} ${styles.compareBad}`}>
            <div className={styles.compareHeader}>
              <span className={styles.compareDot} style={{ background: "#FF5F57" }} />
              Generic coding tutorials
            </div>
            <ul className={styles.compareList}>
              <li><span className={styles.xMark}>✗</span>Toy examples with fake data</li>
              <li><span className={styles.xMark}>✗</span>Syntax only, no system design</li>
              <li><span className={styles.xMark}>✗</span>No real deployment context</li>
              <li><span className={styles.xMark}>✗</span>Generic, not India-specific</li>
              <li><span className={styles.xMark}>✗</span>Written once, never updated</li>
            </ul>
          </div>
          <div className={styles.vsLabel}>vs</div>
          <div className={`${styles.compareCard} ${styles.compareGood}`}>
            <div className={styles.compareHeader}>
              <span className={styles.compareDot} style={{ background: "#28C840" }} />
              DigitalAIIndia Learn
            </div>
            <ul className={styles.compareList}>
              <li><span className={styles.checkMark}>✓</span>Real code from shipped systems</li>
              <li><span className={styles.checkMark}>✓</span>Full architecture, HLD to LLD</li>
              <li><span className={styles.checkMark}>✓</span>Pulled from our own production platform</li>
              <li><span className={styles.checkMark}>✓</span>Hindi voice AI, India-first case studies</li>
              <li><span className={styles.checkMark}>✓</span>Free while in beta</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Tracks</div>
        <h2 className={styles.sectionTitle}>What you&apos;ll learn</h2>
        <p className={styles.sectionSub}>Six tracks in progress. New write-ups publish here first.</p>
        <div className={learn.trackGrid}>
          {tracks.map((t) => (
            <article className={learn.trackCard} key={t.id}>
              <div className={learn.trackIconWrap} style={{ "--icon-bg": t.bg, "--icon-fg": t.fg } as React.CSSProperties}>
                {t.icon}
              </div>
              <div className={learn.trackHead}>
                <h3>{t.title}</h3>
                <span className={learn.trackLevel}>{t.level}</span>
              </div>
              <p>{t.desc}</p>
              <p><strong>You&apos;ll build:</strong> {t.build}</p>
              <div className={learn.trackTags}>
                {t.tags.map((tag) => (
                  <span className={learn.trackTag} key={tag}>{tag}</span>
                ))}
              </div>
              <div className={learn.trackFooter}>
                <span className={learn.trackStatus}>● Coming soon</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Code Preview ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>See it first</div>
        <h2 className={styles.sectionTitle}>Real snippets, not pseudocode</h2>
        <p className={styles.sectionSub}>A preview of the AI engineering track — pulled straight from our own codebase. More tracks are being written.</p>
        <div className={styles.codeWrap}>
          <div className={styles.codeHeader}>
            <div className={styles.codeDots}><span /><span /><span /></div>
            <div className={styles.tabs}>
              {(["rag", "voice", "architecture"] as const).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`${styles.tab} ${tab === item ? styles.tabActive : ""}`}
                  onClick={() => setTab(item)}
                >
                  {item === "rag" ? "RAG" : item === "voice" ? "Voice AI" : "Architecture"}
                </button>
              ))}
            </div>
          </div>
          <pre className={styles.code} style={{ fontFamily: "var(--font-mono)" }}>{snippets[tab]}</pre>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Real credentials</div>
        <h2 className={styles.sectionTitle}>Taught by someone who&apos;s actually trained in this</h2>
        <div className={learn.credGrid}>
          <div className={learn.credGlow}>
            <div className={learn.credOrb} />
            <div className={learn.credBadgeFloat} style={{ top: "8%", left: "6%" }}>JS</div>
            <div className={learn.credBadgeFloat} style={{ top: "62%", left: "2%" }}>DSA</div>
            <div className={learn.credBadgeFloat} style={{ top: "14%", right: "4%" }}>MERN</div>
            <div className={learn.credBadgeFloat} style={{ top: "68%", right: "8%" }}>AI</div>
            <div className={learn.credCenter}>AI</div>
          </div>
          <div className={learn.credCard}>
            <span className={learn.credTag}>Certificate of Participation</span>
            <h3 className={learn.credTitle}>AI For All — AI Appreciate</h3>
            <p className={learn.credIssuer}>Intel × CBSE, under India&apos;s Digital India digital-literacy initiative</p>
            <p className={learn.credDate}>Completed 11 August 2026 · Abhishek Dandriyal, Founder</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>FAQ</div>
        <h2 className={styles.sectionTitle}>Before you ask</h2>
        <div className={learn.faqList}>
          <div className={learn.faqItem}>
            <div className={learn.faqQ}>Is it really free?</div>
            <div className={learn.faqA}>Yes, free during beta — no credit card, no trial period that quietly starts charging you.</div>
          </div>
          <div className={learn.faqItem}>
            <div className={learn.faqQ}>Do I need prior coding experience?</div>
            <div className={learn.faqA}>No. JavaScript Fundamentals starts from zero. DSA, MERN, and AI Engineering assume you&apos;ve been through the earlier stages of the path.</div>
          </div>
          <div className={learn.faqItem}>
            <div className={learn.faqQ}>When does the first track launch?</div>
            <div className={learn.faqA}>We&apos;re writing it now. We&apos;d rather ship something good late than something thin on time — join the waitlist and you&apos;ll be the first to know.</div>
          </div>
          <div className={learn.faqItem}>
            <div className={learn.faqQ}>Is this only about AI?</div>
            <div className={learn.faqA}>No — MERN, JavaScript, DSA, project building, and system design are equally core to the path, not side content.</div>
          </div>
          <div className={learn.faqItem}>
            <div className={learn.faqQ}>How is this different from a typical bootcamp?</div>
            <div className={learn.faqA}>Every track is pulled from a system we&apos;ve actually shipped at DigitalAIIndia — not a generic curriculum written once and never touched again.</div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className={styles.ctaBanner} id="waitlist">
        <div className={styles.ctaBannerOrb} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.sectionLabel} style={{ textAlign: "center" }}>Coming soon</div>
          <h2 className={styles.ctaBannerTitle}>The first track is<br /><em className={styles.ctaBannerEm}>in progress</em></h2>
          <p className={styles.ctaBannerSub}>Want to know when it&apos;s live? Join the waitlist — no spam, just a heads-up.</p>

          {waitStatus === "done" ? (
            <p className={learn.waitlistNote} style={{ fontSize: "0.95rem" }}>You&apos;re on the list — we&apos;ll email you when the first track ships.</p>
          ) : (
            <form onSubmit={submitWaitlist} className={learn.waitlistForm}>
              <input
                className={learn.waitlistInput}
                placeholder="Your name"
                value={waitName}
                onChange={(e) => setWaitName(e.target.value)}
                required
              />
              <input
                className={learn.waitlistInput}
                type="email"
                placeholder="you@example.com"
                value={waitEmail}
                onChange={(e) => setWaitEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={waitStatus === "sending"} className={`${styles.btn} ${styles.btnPrimary}`}>
                {waitStatus === "sending" ? "Joining..." : "Join waitlist"}
              </button>
            </form>
          )}
          {waitStatus === "error" && <p className={learn.waitlistNote} style={{ color: "var(--accent2)" }}>Something went wrong — try again or email us directly.</p>}
          <p className={learn.waitlistNote}>Or <Link href="/blog" style={{ color: "var(--accent)" }}>read the blog</Link> while you wait.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoIcon /></div>
          <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/platform">Products</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.footerTagline}>Made with ♥ for Indian developers</p>
      </footer>
    </div>
  );
}
