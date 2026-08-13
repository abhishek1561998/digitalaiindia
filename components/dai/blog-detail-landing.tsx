"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";
import { CelebrateButton } from "./CelebrateButton";
import blog from "./blog-landing.module.css";

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

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  source: string;
  tags: string[];
  readTime: number;
  imageUrl?: string;
  url: string;
  views?: number;
}

export function BlogDetailLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const params = useParams();
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!params.slug) return;
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.posts) {
          const found = data.posts.find((p: BlogPost) => p.id === params.slug);
          setPost(found ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

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
          <Link href="/platform">Products</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/learn">Learn</Link>
          
        </div>
        <div className={styles.navRight}>
          <CelebrateButton />
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/auth"} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Sign In</Link>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Get API Key</Link>
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
            <Link href={isLoggedIn ? "/dashboard" : "/auth"} onClick={() => setMobileOpen(false)} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Sign In</Link>
          </div>
        </div>
      )}

      <section className={styles.section} style={{ paddingTop: "7.5rem" }}>
        {loading ? (
          <div className={blog.notFound}>Loading article…</div>
        ) : !post ? (
          <div className={blog.notFound}>
            <h2 className={styles.sectionTitle}>Post not found</h2>
            <p style={{ margin: "1rem 0" }}>This article doesn&apos;t exist or has been moved.</p>
            <Link href="/blog" className={`${styles.btn} ${styles.btnPrimary}`}>Back to blog</Link>
          </div>
        ) : (
          <article className={blog.article}>
            <Link href="/blog" className={blog.backLink}><ArrowLeftIcon /> Back to blog</Link>

            {post.imageUrl && (
              <div className={blog.articleHero}>
                <img src={post.imageUrl} alt={post.title} />
              </div>
            )}

            <div className={blog.postMeta}>
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.readTime} min read</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>

            <h1 className={blog.articleTitle}>{post.title}</h1>
            <p className={blog.articleExcerpt}>{post.excerpt}</p>

            <div className={blog.tagRow}>
              {post.tags.map((t) => <span className={blog.tag} key={t}>{t}</span>)}
            </div>

            <div className={blog.prose} dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className={blog.articleFooter}>
              <span>Originally from {post.source}</span>
              <Link href="/blog" className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>More articles</Link>
            </div>
          </article>
        )}
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
