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

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

export function MarketingLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showIdBanner, setShowIdBanner] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    const now = new Date();
    const inSeason = now.getMonth() === 7 && now.getDate() >= 10 && now.getDate() <= 17; // Aug 10–17
    setShowIdBanner(inSeason);
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

  function scrollToProducts(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
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
          <a href="https://platform.digitalaiindia.com" target="_blank" rel="noopener noreferrer">Products</a>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <a href="https://blog.digitalaiindia.com" target="_blank" rel="noopener noreferrer">Blog</a>
          <a href="https://learn.digitalaiindia.com" target="_blank" rel="noopener noreferrer">Learn</a>
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
          <Link href="/platform" onClick={() => setMobileOpen(false)}>Products</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/learn" onClick={() => setMobileOpen(false)}>Learn</Link>
          <div className={styles.mobileMenuActions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => { toggleTheme(); setMobileOpen(false); }}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className={styles.hero}>

        {showIdBanner && (
        <div className={styles.idBannerOuter}>
          <div className={styles.idBanner}>
            <span className={styles.idBadge}>🇮🇳</span>
            <span className={styles.idBannerText}>
              <strong>India&apos;s 80th Independence Day</strong> — 79 years of freedom since 1947. This is why we build India-first, always.
            </span>
          </div>
        </div>
      )}

        <div className={styles.heroBg}>
          <div className={styles.jaliPattern} />
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.heroGrid} />

        {/* <span className={styles.indiaStamp}>
          <span className={styles.indiaStampFlag} /> Made in India, for India
        </span> */}

        <div className={styles.heroBadge} style={{ marginTop: "1.25rem" }}>
          <span className={styles.dot} /> India-first AI company
        </div>

        <h1 className={styles.heroTitle}>
          We build AI products,
          <br />
          <span className={styles.heroBrand}>for India first</span>
        </h1>

        <p className={styles.heroSub}>
          From developer APIs to AI education — every product we ship is priced,<br />
          localized, and designed for India first, not adapted for it later.
        </p>

        <div className={styles.heroCtas}>
          <button type="button" onClick={scrollToProducts} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
            Explore our products <ArrowIcon />
          </button>
          <Link href="/contact" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            Talk to us
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.heroStat}><strong>3</strong><span>Products</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>₹0</strong><span>Free to start</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>BYOK</strong><span>Across every product</span></div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}><strong>Hindi</strong><span>Native voice AI</span></div>
        </div>
      </section>

      {/* ── Our Products ── */}
      <Reveal id="products" className={styles.section}>
        <div className={styles.sectionLabel}>Our Products</div>
        <h2 className={styles.sectionTitle}>What DigitalAIIndia is building</h2>
        <p className={styles.sectionSub}>One company, a growing set of AI products for Indian developers and businesses.</p>
        <div className={styles.grid4}>
          <Link href="/platform" className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(255,117,0,0.14)", "--icon-fg": "#FF7500" } as React.CSSProperties}><BoxIcon /></div>
            <h3>AI Platform</h3>
            <p>Unified Chat, Voice, 3D and Design APIs behind one key. Free to start.</p>
            <span className={styles.featureTag}>Live — explore</span>
          </Link>
          <Link href="/learn" className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(0,229,176,0.12)", "--icon-fg": "#00E5B0" } as React.CSSProperties}><SparkleIcon /></div>
            <h3>Learn</h3>
            <p>Hands-on write-ups on building AI products — RAG, voice AI, and how we build DigitalAIIndia itself.</p>
            <span className={styles.featureTag}>Explore</span>
          </Link>
          <article className={styles.card}>
            <div className={styles.featureIcon} style={{ "--icon-color": "rgba(255,200,50,0.12)", "--icon-fg": "#FFC832" } as React.CSSProperties}><ChatIcon /></div>
            <h3>SEO Growth Toolkit</h3>
            <p>AI-assisted SEO to help Indian websites and apps grow discoverability.</p>
            <span className={styles.featureTag}>In development</span>
          </article>
        </div>
      </Reveal>

      {/* ── About teaser ── */}
      <Reveal className={styles.section}>
        <div className={styles.sectionLabel}>About</div>
        <h2 className={styles.sectionTitle}>Why DigitalAIIndia exists</h2>
        <div className={styles.aboutGrid}>
          <div className={styles.aboutText}>
            <p>
              Most AI infrastructure is built for the US market first and adapted for India later. We built DigitalAIIndia the other way round: India-first pricing from day one, bring-your-own-key by default, and Hindi-native voice AI as a core feature, not an afterthought.
            </p>
            <p className={styles.hindiAccent}>भारत के लिए, भारत में बनाया गया।</p>
            <Link href="/about" className={`${styles.btn} ${styles.btnGhost}`} style={{ marginTop: "0.5rem" }}>
              Read our full story <ArrowIcon />
            </Link>
          </div>
          <div className={styles.aboutFacts}>
            <div className={styles.aboutFact}><CheckIcon /> India-first pricing, in rupees</div>
            <div className={styles.aboutFact}><CheckIcon /> BYOK — bring your own provider key</div>
            <div className={styles.aboutFact}><CheckIcon /> Hindi-native voice AI via Sarvam</div>
            <div className={styles.aboutFact}><CheckIcon /> Built in public on Learn</div>
          </div>
        </div>
      </Reveal>

      {/* ── Learn preview ── */}
      <Reveal className={styles.section}>
        <div className={styles.sectionLabel}>From Learn</div>
        <h2 className={styles.sectionTitle}>Tracks in progress</h2>
        <p className={styles.sectionSub}>What we&apos;re writing up next on Learn — for students and developers alike.</p>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>AI Engineering</strong><span>RAG, LLMs, voice AI</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>MERN Stack</strong><span>Full-stack, deployed</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>System Design</strong><span>HLD, LLD, scaling</span></div>
        </div>
        <div className={styles.comparisonCta}>
          <Link href="/learn" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
            See all tracks <ArrowIcon />
          </Link>
        </div>
      </Reveal>

      {/* ── Closing CTA ── */}
      <Reveal className={styles.ctaBanner}>
        <div className={styles.ctaBannerOrb} />
        <div className={styles.ctaBannerContent}>
          <div className={styles.sectionLabel} style={{ textAlign: "center" }}>Start today</div>
          <h2 className={styles.ctaBannerTitle}>Ready to build<br /><em className={styles.ctaBannerEm}>with us?</em></h2>
          <p className={styles.ctaBannerSub}>Explore the Platform, read Learn, or just say hello — free to start, no credit card.</p>
          <div className={styles.heroCtas}>
            <Link href="/platform" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
              Explore the Platform <ArrowIcon />
            </Link>
            <Link href="/contact" className={`${styles.btn} ${styles.btnGhost} ${styles.btnLg}`}>
              Talk to us
            </Link>
          </div>
          <div className={styles.ctaTrustRow}>
            <span>✓ No credit card</span>
            <span>✓ BYOK support</span>
            <span>✓ Free tier included</span>
            <span>✓ Made for India</span>
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
