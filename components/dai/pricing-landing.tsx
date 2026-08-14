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

export function PricingLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

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
      <section className={styles.hero} style={{ minHeight: "auto", paddingBottom: "1rem" }}>
        <div className={styles.heroBg}>
          <div className={styles.jaliPattern} />
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.heroGrid} />
        <span className={styles.indiaStamp}>
          <span className={styles.indiaStampFlag} /> Priced in rupees, from day one
        </span>
        <h1 className={styles.heroTitle} style={{ marginTop: "1.5rem" }}>Simple, transparent pricing</h1>
        <p className={styles.heroSub}>Start free. Upgrade when you&apos;re ready.</p>
      </section>

      {/* ── Pricing ── */}
      <Reveal className={styles.section}>
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
              <li>Custom SLA</li>
              <li>Dedicated manager</li>
            </ul>
            <Link href="/contact" className={`${styles.btn} ${styles.btnGhost} ${styles.btnFull}`}>Contact Us</Link>
          </article>
        </div>
      </Reveal>

      {/* ── Closing CTA ── */}
      <Reveal className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.sectionLabel} style={{ textAlign: "center" }}>Start today</div>
          <h2 className={styles.ctaBannerTitle}>Your first API call is<br /><em className={styles.ctaBannerEm}>30 seconds away</em></h2>
          <p className={styles.ctaBannerSub}>Free forever up to 1,000 requests. No credit card. No setup headaches.</p>
          <div className={styles.heroCtas}>
            <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Get API Key — Free
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
