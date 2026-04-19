"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const snippets: Record<string, string> = {
  curl: `curl -X POST https://api.digitalaiindia.com/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{\n    "prompt": "Explain quantum computing in simple terms",\n    "model": "dai-chat-v1",\n    "max_tokens": 500\n  }'`,
  javascript: `import { DigitalAI } from '@digitalaiindia/sdk';\n\nconst client = new DigitalAI({ apiKey: 'YOUR_API_KEY' });\n\nconst response = await client.chat.create({\n  prompt: 'Explain quantum computing in simple terms',\n  model: 'dai-chat-v1',\n  max_tokens: 500\n});`,
  python: `from digitalaiindia import DigitalAI\n\nclient = DigitalAI(api_key="YOUR_API_KEY")\n\nresponse = client.chat.create(\n  prompt="Explain quantum computing in simple terms",\n  model="dai-chat-v1",\n  max_tokens=500\n)`,
};

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

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

export function MarketingLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [tab, setTab] = useState<"curl" | "javascript" | "python">("curl");

  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  useEffect(() => {
    const saved = window.localStorage.getItem("dai-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("dai-theme", next);
  }

  return (
    <div
      className={`${styles.shell} ${syne.variable} ${outfit.variable} ${jetBrains.variable}`}
      data-theme={theme}
    >
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoIcon /></div>
          <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
        </div>
        <div className={styles.navLinks}>
          <a href="#">Home</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/dashboard?tab=docs">Docs</a>
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
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.heroGrid} />

        <div className={styles.heroBadge}>
          <span className={styles.dot} /> Now in Public Beta — Free to use
        </div>

        <h1 className={styles.heroTitle}>
          Build AI Apps{" "}
          <em className={styles.heroEm}>Faster</em>
          <br />
          <span className={styles.heroBrand}>with DigitalAIIndia</span>
        </h1>

        <p className={styles.heroSub}>
          Production-ready APIs for Chat, Voice, 3D and Design.<br />
          Start building in minutes with a professional developer workflow.
        </p>

        <div className={styles.heroCtas}>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Get API Key — Free <ArrowIcon />
          </Link>
          <Link href="/dashboard?tab=docs" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            View Docs
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}><strong>10K+</strong><span>Developers</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>4</strong><span>AI APIs</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>99.9%</strong><span>Uptime</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>Free</strong><span>To Start</span></div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>How It Works</div>
        <h2 className={styles.sectionTitle}>Zero to AI app in minutes</h2>
        <p className={styles.sectionSub}>No vendor wrangling, no complex setup. Pick up any language and ship the same day.</p>
        <div className={styles.stepsRow}>
          <div className={styles.step}>
            <div className={styles.stepNum}>01</div>
            <div className={styles.stepDot} />
            <div className={styles.stepTime}>30 seconds</div>
            <h3>Get your API key</h3>
            <p>Sign up free. Your key is ready in the dashboard instantly — no credit card required.</p>
          </div>
          <div className={styles.stepLine}><div className={styles.stepArrow}>→</div></div>
          <div className={styles.step}>
            <div className={styles.stepNum}>02</div>
            <div className={styles.stepDot} />
            <div className={styles.stepTime}>2 minutes</div>
            <h3>Make your first call</h3>
            <p>One consistent endpoint. POST your prompt, receive structured JSON — same pattern across all 4 APIs.</p>
          </div>
          <div className={styles.stepLine}><div className={styles.stepArrow}>→</div></div>
          <div className={styles.step}>
            <div className={styles.stepNum}>03</div>
            <div className={styles.stepDot} />
            <div className={styles.stepTime}>Same day</div>
            <h3>Ship to production</h3>
            <p>Rate limiting, uptime SLAs, and analytics are all built in. Nothing more to configure.</p>
          </div>
        </div>
      </section>

      {/* ── Stack Comparison ── */}
      <section className={`${styles.section} ${styles.comparisonSection}`}>
        <div className={styles.sectionLabel}>The Difference</div>
        <h2 className={styles.sectionTitle}>Replace five tools with one</h2>
        <p className={styles.sectionSub}>Stop juggling multiple AI providers, keys, and SDKs. DigitalAIIndia gives you everything under one roof.</p>
        <div className={styles.comparison}>
          <div className={`${styles.compareCard} ${styles.compareBad}`}>
            <div className={styles.compareHeader}>
              <span className={styles.compareDot} style={{ background: "#FF5F57" }} />
              Without DigitalAIIndia
            </div>
            <ul className={styles.compareList}>
              <li><span className={styles.xMark}>✗</span>OpenAI for chat</li>
              <li><span className={styles.xMark}>✗</span>ElevenLabs for voice</li>
              <li><span className={styles.xMark}>✗</span>Stability AI for design</li>
              <li><span className={styles.xMark}>✗</span>Separate provider for 3D</li>
              <li><span className={styles.xMark}>✗</span>4+ API keys to manage</li>
              <li><span className={styles.xMark}>✗</span>4 different SDKs &amp; docs</li>
              <li><span className={styles.xMark}>✗</span>Multiple billing dashboards</li>
              <li><span className={styles.xMark}>✗</span>Inconsistent response formats</li>
              <li><span className={styles.xMark}>✗</span>Weeks of integration work</li>
            </ul>
          </div>
          <div className={styles.vsLabel}>vs</div>
          <div className={`${styles.compareCard} ${styles.compareGood}`}>
            <div className={styles.compareHeader}>
              <span className={styles.compareDot} style={{ background: "#28C840" }} />
              With DigitalAIIndia
            </div>
            <ul className={styles.compareList}>
              <li><span className={styles.checkMark}>✓</span>Chat, Voice, 3D &amp; Design — all here</li>
              <li><span className={styles.checkMark}>✓</span>1 API key for everything</li>
              <li><span className={styles.checkMark}>✓</span>1 unified SDK &amp; doc set</li>
              <li><span className={styles.checkMark}>✓</span>1 bill — free to start at ₹0</li>
              <li><span className={styles.checkMark}>✓</span>Identical JSON request format</li>
              <li><span className={styles.checkMark}>✓</span>Built &amp; priced for India</li>
              <li><span className={styles.checkMark}>✓</span>Usage dashboard included</li>
              <li><span className={styles.checkMark}>✓</span>99.9% uptime SLA</li>
              <li><span className={styles.checkMark}>✓</span>Ship on day one</li>
            </ul>
          </div>
        </div>
        <div className={styles.comparisonCta}>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Get started free — it takes 30 seconds <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionLabel}>APIs</div>
        <h2 className={styles.sectionTitle}>Everything you need to build</h2>
        <p className={styles.sectionSub}>Four powerful AI APIs, unified under one key. Ship faster with clean, consistent interfaces.</p>
        <div className={styles.grid4}>
          <article className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(255,117,0,0.14)", "--icon-fg": "#FF7500" } as React.CSSProperties}><ChatIcon /></div>
            <h3>Chat API</h3>
            <p>State-of-the-art language model for conversational AI and content generation.</p>
            <span className={styles.featureTag}>POST /api/chat</span>
          </article>
          <article className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(0,229,176,0.12)", "--icon-fg": "#00E5B0" } as React.CSSProperties}><MicIcon /></div>
            <h3>Voice Agent API</h3>
            <p>Transform text to natural voice output for bots, accessibility, and IVR systems.</p>
            <span className={styles.featureTag}>POST /api/voice</span>
          </article>
          <article className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(255,200,50,0.12)", "--icon-fg": "#FFC832" } as React.CSSProperties}><BoxIcon /></div>
            <h3>3D Model API</h3>
            <p>Generate and manipulate 3D assets from prompts for immersive product experiences.</p>
            <span className={styles.featureTag}>POST /api/three-d</span>
          </article>
          <article className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(255,61,107,0.12)", "--icon-fg": "#FF3D6B" } as React.CSSProperties}><SparkleIcon /></div>
            <h3>Design AI API</h3>
            <p>Generate UI components, layouts, and design assets from natural language.</p>
            <span className={styles.featureTag}>POST /api/design</span>
          </article>
        </div>
      </section>

      {/* ── Code Block ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Developer First</div>
        <h2 className={styles.sectionTitle}>Simple, predictable APIs</h2>
        <p className={styles.sectionSub}>Consistent request and response structures across all APIs.</p>
        <div className={styles.codeWrap}>
          <div className={styles.codeHeader}>
            <div className={styles.codeDots}><span /><span /><span /></div>
            <div className={styles.tabs}>
              {(["curl", "javascript", "python"] as const).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`${styles.tab} ${tab === item ? styles.tabActive : ""}`}
                  onClick={() => setTab(item)}
                >
                  {item === "javascript" ? "JavaScript" : item === "python" ? "Python" : "cURL"}
                </button>
              ))}
            </div>
          </div>
          <pre className={styles.code} style={{ fontFamily: "var(--font-mono)" }}>{snippets[tab]}</pre>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Use Cases</div>
        <h2 className={styles.sectionTitle}>What you can build</h2>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Chat Apps</strong><span>Intelligent assistants</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Voice Bots</strong><span>IVR and support agents</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>3D Generators</strong><span>Product visualizers</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Design Tools</strong><span>UI and UX generators</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Data Analysis</strong><span>Smart insights</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Content Tools</strong><span>Writers and editors</span></div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className={styles.section}>
        <div className={styles.sectionLabel}>Pricing</div>
        <h2 className={styles.sectionTitle}>Simple, transparent pricing</h2>
        <p className={styles.sectionSub}>Start free. Upgrade when you're ready.</p>
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <h3>Free Tier</h3>
            <p className={styles.price}>₹0<span className={styles.pricePer}>/mo</span></p>
            <ul>
              <li>1,000 API requests/month</li>
              <li>All 4 APIs included</li>
              <li>1 API key</li>
              <li>Playground access</li>
            </ul>
            <Link href={authLink} className={`${styles.btn} ${styles.btnGhost} ${styles.btnFull}`}>Get Started</Link>
          </article>
          <article className={`${styles.priceCard} ${styles.featured}`}>
            <div className={styles.featuredBadge}>Most Popular</div>
            <h3>Pro</h3>
            <p className={styles.price}>₹999<span className={styles.pricePer}>/mo</span></p>
            <ul>
              <li>100,000 API requests/month</li>
              <li>Priority access and support</li>
              <li>5 API keys</li>
              <li>Usage analytics</li>
            </ul>
            <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}>Get Pro</Link>
          </article>
          <article className={styles.priceCard}>
            <h3>Enterprise</h3>
            <p className={styles.price}>Custom</p>
            <ul>
              <li>Unlimited requests</li>
              <li>Dedicated infrastructure</li>
              <li>99.99% SLA</li>
              <li>Dedicated manager</li>
            </ul>
            <Link href="/contact" className={`${styles.btn} ${styles.btnGhost} ${styles.btnFull}`}>Contact Us</Link>
          </article>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.sectionLabel} style={{ textAlign: "center" }}>Start today</div>
          <h2 className={styles.ctaBannerTitle}>Your first API call is<br /><em className={styles.ctaBannerEm}>30 seconds away</em></h2>
          <p className={styles.ctaBannerSub}>Free forever up to 1,000 requests. No credit card. No setup headaches.</p>
          <div className={styles.heroCtas}>
            <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Get API Key — Free <ArrowIcon />
            </Link>
            <Link href="/dashboard?tab=docs" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
              Read the Docs
            </Link>
          </div>
          <div className={styles.ctaTrustRow}>
            <span>✓ No credit card</span>
            <span>✓ 4 APIs, 1 key</span>
            <span>✓ 99.9% uptime</span>
            <span>✓ Made for India</span>
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
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/dashboard?tab=docs">Docs</a>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.footerTagline}>Made with ♥ for Indian developers</p>
      </footer>
    </div>
  );
}
