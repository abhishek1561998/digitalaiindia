"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";
import { CelebrateButton } from "./CelebrateButton";
import { Reveal } from "./Reveal";

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

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export function AboutLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className={styles.tricolorBar} />

      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <div className={styles.logoIcon}><LogoIcon /></div>
          <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/">Home</Link>
          <a href="https://platform.digitalaiindia.com">Products</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <a href="https://blog.digitalaiindia.com">Blog</a>
          <a href="https://learn.digitalaiindia.com" className={styles.navLinkLearn}>Learn<span className={styles.navBadgeNew}>New</span></a>
        </div>
        <div className={styles.navRight}>
          <CelebrateButton />
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        <button type="button" className={styles.navHamburger} onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
          <a href="https://platform.digitalaiindia.com" onClick={() => setMobileOpen(false)}>Products</a>
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
          <a href="https://blog.digitalaiindia.com" onClick={() => setMobileOpen(false)}>Blog</a>
          <a href="https://learn.digitalaiindia.com" onClick={() => setMobileOpen(false)}>Learn</a>
          <div className={styles.mobileMenuActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { toggleTheme(); setMobileOpen(false); }}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <section className={styles.hero} style={{ minHeight: "auto", paddingBottom: "2rem" }}>
        <div className={styles.heroBg}>
          <div className={styles.jaliPattern} />
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
        </div>
        <div className={styles.heroGrid} />
        <span className={styles.indiaStamp}>
          <span className={styles.indiaStampFlag} /> Made in India, for India
        </span>
        <h1 className={styles.heroTitle} style={{ marginTop: "1.5rem" }}>About DigitalAIIndia</h1>
        <p className={styles.heroSub}>An AI company built the other way round — India-first, not India-adapted.</p>
      </section>

      {/* ── Story ── */}
      <Reveal className={styles.section}>
        <div className={styles.sectionLabel}>Our story</div>
        <h2 className={styles.sectionTitle}>Why we built it this way</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <p>
              Most AI infrastructure is built for the US market first and adapted for India later — wrong pricing, wrong latency, wrong language support. We built DigitalAIIndia the other way round: India-first pricing from day one, and Hindi-native voice AI as a core feature, not an afterthought.
            </p>
            <p>
              We also believe in bring-your-own-key by default — connect your own Sarvam or ElevenLabs account and stay in control of your own provider relationship, instead of being locked into ours.
            </p>
            <p>
              And we build in public. Every architecture decision, every integration, every mistake — it&apos;s written up on <Link href="/learn" style={{ color: "var(--accent)" }}>Learn</Link> so other developers don&apos;t have to start from zero.
            </p>
            <p>
              India-first isn&apos;t a tagline we bolted on — it&apos;s the reason the pricing is in rupees and the voice model speaks Hindi first.
            </p>
          </div>
          <div className={styles.aboutFacts}>
            <div className={styles.aboutFact}><CheckIcon /> India-first pricing, in rupees</div>
            <div className={styles.aboutFact}><CheckIcon /> BYOK — bring your own provider key</div>
            <div className={styles.aboutFact}><CheckIcon /> Hindi-native voice AI via Sarvam</div>
            <div className={styles.aboutFact}><CheckIcon /> Built in public on Learn</div>
          </div>
        </div>
      </Reveal>

      {/* ── What we're building ── */}
      <Reveal className={styles.section}>
        <div className={styles.sectionLabel}>What we&apos;re building</div>
        <h2 className={styles.sectionTitle}>A growing set of products</h2>
        <p className={styles.sectionSub}>One company, built one honest product at a time.</p>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>AI Platform</strong><span>Chat, Voice, 3D &amp; Design APIs</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Learn</strong><span>Build logs for developers</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>SEO Toolkit</strong><span>In development</span></div>
        </div>
      </Reveal>

      {/* ── Closing CTA ── */}
      <Reveal className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.sectionLabel} style={{ textAlign: "center" }}>Say hello</div>
          <h2 className={styles.ctaBannerTitle}>Want to know more,<br /><em className={styles.ctaBannerEm}>or just say hi?</em></h2>
          <div className={styles.heroCtas}>
            <Link href="/contact" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Talk to us <ArrowIcon />
            </Link>
            <Link href="/platform" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
              Explore the Platform
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ── Footer ── */}
      <div className={styles.footerMain}>
        <div className={styles.footerAbout}>
          <div className={styles.navLogo}>
            <div className={styles.logoIcon}><LogoIcon /></div>
            <span>DigitalAI<span className={styles.logoIndia}>India</span></span>
          </div>
          <p>An India-first AI company — one platform for Chat, Voice, 3D and Design, built and priced for Indian developers.</p>
        </div>
        <div>
          <div className={styles.footerColTitle}>Product</div>
          <div className={styles.footerColLinks}>
            <Link href="/platform">AI Platform</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
        <div>
          <div className={styles.footerColTitle}>Company</div>
          <div className={styles.footerColLinks}>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
              <MailIcon /> <a href="mailto:info.digitalaiindia@gmail.com">info.digitalaiindia@gmail.com</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <PhoneIcon /> <a href="tel:+918770609976">+91 87706 09976</a>
            </div>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <p className={styles.footerTagline}>© {new Date().getFullYear()} DigitalAIIndia. Made with ♥ for Indian developers.</p>
        <div className={styles.footerLinks}>
          <a href="/dashboard?tab=docs">Docs</a>
        </div>
      </footer>
    </div>
  );
}
