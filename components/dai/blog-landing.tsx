"use client";

import Link from "next/link";
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

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
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

export function BlogLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.posts) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
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

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesTag = tagFilter === "all" || p.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase());
    return matchesSearch && matchesTag;
  });

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
        </div>
      </nav>

      {/* ── Featured ── */}
      {!loading && posts.length > 0 && (() => {
        const featuredPosts = posts.slice(0, 5);
        const sidePosts = posts.slice(5, 8).length ? posts.slice(5, 8) : posts.slice(1, 4);
        const current = featuredPosts[featuredIndex] ?? featuredPosts[0];
        return (
          <section className={styles.section} style={{ paddingTop: "7.5rem", paddingBottom: "2rem" }}>
             <div className={styles.heroTitle} />
                <div className={styles.heroBadge}><span className={styles.dot} /> The DigitalAIIndia blog</div>
                <h1 className={styles.heroTitle}>Ideas, updates<br />&amp; AI insights</h1>
                <p className={styles.heroSub}>What we&apos;re building, what we&apos;re learning, and where AI is headed.</p>
              <div className={blog.featuredGrid}>
              <Link href={`/blog/${current.id}`} className={blog.featuredCard}>
                {current.imageUrl && <img src={current.imageUrl} alt={current.title} className={blog.featuredImg} />}
                <div className={blog.featuredOverlay} />
                <div className={blog.featuredContent}>
                  <div className={blog.featuredMeta}>
                    <span>{current.author}</span>
                    <span>·</span>
                    <span>{current.readTime} min read</span>
                  </div>
                  <div className={blog.featuredTitle}>{current.title}</div>
                  <div className={blog.featuredExcerpt}>{current.excerpt}</div>
                </div>
                {featuredPosts.length > 1 && (
                  <div className={blog.featuredNav}>
                    <span
                      role="button"
                      tabIndex={0}
                      className={blog.featuredArrow}
                      onClick={(e) => { e.preventDefault(); setFeaturedIndex((i) => (i - 1 + featuredPosts.length) % featuredPosts.length); }}
                      aria-label="Previous featured post"
                    >
                      <ArrowLeftIcon />
                    </span>
                    <span className={blog.featuredIndex}>{featuredIndex + 1} / {featuredPosts.length}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className={blog.featuredArrow}
                      onClick={(e) => { e.preventDefault(); setFeaturedIndex((i) => (i + 1) % featuredPosts.length); }}
                      aria-label="Next featured post"
                    >
                      <ArrowRightIcon />
                    </span>
                  </div>
                )}
              </Link>

              <div className={blog.sideList}>
                {sidePosts.map((post) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className={blog.sideCard}>
                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} className={blog.sideThumb} />}
                    <div className={blog.sideBody}>
                      <div className={blog.sideTitle}>{post.title}</div>
                      <div className={blog.sideMeta}>{post.author} · {post.readTime} min read</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── Toolbar + Grid ── */}
      <section className={styles.section} style={{ paddingTop: loading || posts.length === 0 ? "7.5rem" : "2rem" }}>
        <div className={styles.sectionLabel}>All articles</div>
        <h2 className={styles.sectionTitle}>Browse everything</h2>
        <div className={blog.toolbar}>
          <div className={blog.searchWrap}>
            <span className={blog.searchIcon}><SearchIcon /></span>
            <input
              className={blog.searchInput}
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={blog.select} value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="all">All topics</option>
            {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div className={blog.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div className={blog.skeletonCard} key={i}>
                <div className={blog.skeletonImg} />
                <div className={blog.skeletonBody}>
                  <div className={blog.skeletonLine} />
                  <div className={blog.skeletonLine} />
                  <div className={blog.skeletonLine} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={blog.empty}>No articles match your search.</div>
        ) : (
          <div className={blog.postGrid}>
            {filtered.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className={blog.postCard}>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className={blog.postImage} />}
                <div className={blog.postBody}>
                  <div className={blog.postMeta}>
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                  </div>
                  <div className={blog.postTitle}>{post.title}</div>
                  <div className={blog.postExcerpt}>{post.excerpt}</div>
                  <div className={blog.tagRow}>
                    {post.tags.slice(0, 3).map((t) => <span className={blog.tag} key={t}>{t}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
