"use client";

import Link from "next/link";
import { DM_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const jetBrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const snippets: Record<string, string> = {
  curl: `curl -X POST https://api.digitalaiindia.com/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{\n    "prompt": "Explain quantum computing in simple terms",\n    "model": "dai-chat-v1",\n    "max_tokens": 500\n  }'`,
  javascript: `import { DigitalAI } from '@digitalaiindia/sdk';\n\nconst client = new DigitalAI({ apiKey: 'YOUR_API_KEY' });\n\nconst response = await client.chat.create({\n  prompt: 'Explain quantum computing in simple terms',\n  model: 'dai-chat-v1',\n  max_tokens: 500\n});`,
  python: `from digitalaiindia import DigitalAI\n\nclient = DigitalAI(api_key="YOUR_API_KEY")\n\nresponse = client.chat.create(\n  prompt="Explain quantum computing in simple terms",\n  model="dai-chat-v1",\n  max_tokens=500\n)`,
};

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
      className={`${styles.shell} ${dmSans.variable} ${fraunces.variable} ${jetBrains.variable}`}
      style={{ fontFamily: "var(--font-dm)" }}
      data-theme={theme}
    >
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}>D</div>
          DigitalAIIndia
        </div>
        <div className={styles.navLinks}>
          <a href="#">Home</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="/dashboard?tab=docs">Docs</a>
        </div>
        <div className={styles.navRight}>
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "🌙"}
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/auth"} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>
            Sign In
          </Link>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
            Get API Key
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroGrid} />
        <div className={styles.heroBadge}>
          <span className={styles.dot} /> Now in Public Beta - Free to use
        </div>
        <h1>
          Build AI Apps <em style={{ fontFamily: "var(--font-fraunces)" }}>Faster</em>
          <br />
          with DigitalAIIndia
        </h1>
        <p>Production-ready APIs for Chat, Voice, 3D and Design. Start building in minutes with a professional developer workflow.</p>
        <div className={styles.heroCtas}>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Get API Key - Free
          </Link>
          <Link href="/dashboard?tab=docs" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            View Docs
          </Link>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}><strong>10K+</strong><span>Developers</span></div>
          <div className={styles.heroStat}><strong>4</strong><span>AI APIs</span></div>
          <div className={styles.heroStat}><strong>99.9%</strong><span>Uptime</span></div>
          <div className={styles.heroStat}><strong>Free</strong><span>To Start</span></div>
        </div>
      </section>

      <section id="features" className={styles.section}>
        <div className={styles.sectionLabel}>APIs</div>
        <h2 className={styles.sectionTitle}>Everything you need to build</h2>
        <p className={styles.sectionSub}>Four powerful AI APIs, unified under one key. Ship faster with clean, consistent interfaces.</p>
        <div className={styles.grid4}>
          <article className={styles.card}><div className={styles.featureIcon} style={{ background: "rgba(79,124,255,0.12)" }}>💬</div><h3>Chat API</h3><p>State-of-the-art language model for conversational AI and content generation.</p><span className={styles.featureTag}>POST /api/chat</span></article>
          <article className={styles.card}><div className={styles.featureIcon} style={{ background: "rgba(0,212,170,0.12)" }}>🎙️</div><h3>Voice Agent API</h3><p>Transform text to natural voice output for bots, accessibility, and IVR systems.</p><span className={styles.featureTag}>POST /api/voice</span></article>
          <article className={styles.card}><div className={styles.featureIcon} style={{ background: "rgba(245,197,66,0.12)" }}>🧊</div><h3>3D Model API</h3><p>Generate and manipulate 3D assets from prompts for immersive product experiences.</p><span className={styles.featureTag}>POST /api/three-d</span></article>
          <article className={styles.card}><div className={styles.featureIcon} style={{ background: "rgba(124,92,255,0.12)" }}>🎨</div><h3>Design AI API</h3><p>Generate UI components, layouts, and design assets from natural language.</p><span className={styles.featureTag}>POST /api/design</span></article>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>Developer First</div>
        <h2 className={styles.sectionTitle}>Simple, predictable APIs</h2>
        <p className={styles.sectionSub}>Consistent request and response structures across all APIs.</p>
        <div className={styles.codeWrap}>
          <div className={styles.tabs}>
            {(["curl", "javascript", "python"] as const).map((item) => (
              <button type="button" key={item} className={`${styles.tab} ${tab === item ? styles.tabActive : ""}`} onClick={() => setTab(item)}>
                {item === "javascript" ? "JavaScript" : item === "python" ? "Python" : "cURL"}
              </button>
            ))}
          </div>
          <pre className={styles.code} style={{ fontFamily: "var(--font-mono)" }}>{snippets[tab]}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>Use Cases</div>
        <h2 className={styles.sectionTitle}>What you can build</h2>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><strong>Chat Apps</strong><span> Intelligent assistants</span></div>
          <div className={styles.buildCard}><strong>Voice Bots</strong><span> IVR and support agents</span></div>
          <div className={styles.buildCard}><strong>3D Generators</strong><span> Product visualizers</span></div>
          <div className={styles.buildCard}><strong>Design Tools</strong><span> UI and UX generators</span></div>
          <div className={styles.buildCard}><strong>Data Analysis</strong><span> Smart insights</span></div>
          <div className={styles.buildCard}><strong>Content Tools</strong><span> Writers and editors</span></div>
        </div>
      </section>

      <section id="pricing" className={styles.section}>
        <div className={styles.sectionLabel}>Pricing</div>
        <h2 className={styles.sectionTitle}>Simple, transparent pricing</h2>
        <p className={styles.sectionSub}>Start free. Upgrade when you're ready.</p>
        <div className={styles.pricingGrid}>
          <article className={styles.priceCard}>
            <h3>Free Tier</h3>
            <p className={styles.price}>₹0</p>
            <ul>
              <li>1,000 API requests/month</li>
              <li>All 4 APIs included</li>
              <li>1 API key</li>
              <li>Playground access</li>
            </ul>
          </article>
          <article className={`${styles.priceCard} ${styles.featured}`}>
            <h3>Pro</h3>
            <p className={styles.price}>₹999</p>
            <ul>
              <li>100,000 API requests/month</li>
              <li>Priority access and support</li>
              <li>5 API keys</li>
              <li>Usage analytics</li>
            </ul>
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
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.navLogo}><div className={styles.logoIcon}>D</div>DigitalAIIndia</div>
        <p style={{ color: "var(--text3)", fontSize: "0.8125rem" }}>Made for Indian developers</p>
      </footer>
    </div>
  );
}
