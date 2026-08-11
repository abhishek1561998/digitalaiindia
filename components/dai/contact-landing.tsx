"use client";

import Link from "next/link";
import { Syne, Outfit, JetBrains_Mono } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import styles from "./marketing-landing.module.css";
import contact from "./contact-landing.module.css";

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

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  service: string;
}

const services = [
  { value: "voice-ai", label: "Voice AI / TTS" },
  { value: "chat-api", label: "Chat API" },
  { value: "3d-design", label: "3D & Design API" },
  { value: "learn", label: "Learn — notify me" },
  { value: "consultation", label: "General consultation" },
];

export function ContactLanding({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const authLink = useMemo(() => (isLoggedIn ? "/dashboard" : "/auth?mode=signup"), [isLoggedIn]);

  const [formData, setFormData] = useState<ContactFormData>({
    name: "", email: "", phone: "", company: "", subject: "", message: "", service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const next: Partial<ContactFormData> = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) next.email = "Email is invalid";
    if (!formData.subject.trim()) next.subject = "Subject is required";
    if (!formData.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "", service: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button type="button" className={`${styles.btn} ${styles.themeToggle}`} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link href={isLoggedIn ? "/dashboard" : "/auth"} className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Sign In</Link>
          <Link href={authLink} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>Get API Key</Link>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.jaliPattern} />
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
        </div>
        <div className={styles.heroGrid} />
        <div className={styles.heroBadge}><span className={styles.dot} /> We usually reply within 24 hours</div>
        <h1 className={styles.heroTitle}>Let&apos;s talk</h1>
        <p className={styles.heroSub}>
          Questions about the Platform, Learn, or a partnership — reach out and a real person will get back to you.
        </p>
      </section>

      {/* ── Contact layout ── */}
      <section className={styles.section}>
        <div className={contact.layout}>
          {/* Info panel */}
          <div className={contact.panel}>
            <h2 className={contact.panelTitle}>Get in touch</h2>

            <div className={contact.infoRow}>
              <div className={contact.infoIcon}><MailIcon /></div>
              <div>
                <div className={contact.infoLabel}>Email</div>
                <div className={contact.infoValue}><a href="mailto:info.digitalaiindia@gmail.com">info.digitalaiindia@gmail.com</a></div>
              </div>
            </div>

            <div className={contact.infoRow}>
              <div className={contact.infoIcon}><PhoneIcon /></div>
              <div>
                <div className={contact.infoLabel}>Phone</div>
                <div className={contact.infoValue}><a href="tel:+918770609976">+91 87706 09976</a></div>
              </div>
            </div>

            <div className={contact.infoRow}>
              <div className={contact.infoIcon}><PinIcon /></div>
              <div>
                <div className={contact.infoLabel}>Based in</div>
                <div className={contact.infoValue}>India</div>
              </div>
            </div>

            <div className={contact.infoRow}>
              <div className={contact.infoIcon}><ClockIcon /></div>
              <div>
                <div className={contact.infoLabel}>Response time</div>
                <div className={contact.infoValue}>Within 24 hours, Mon–Sat</div>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className={contact.panel}>
            <h2 className={contact.panelTitle}>Send a message</h2>

            {submitStatus === "success" && (
              <div className={`${contact.banner} ${contact.bannerSuccess}`}>
                <CheckIcon />
                <div>
                  <strong>Message sent.</strong> We&apos;ll get back to you within 24 hours.
                </div>
              </div>
            )}
            {submitStatus === "error" && (
              <div className={`${contact.banner} ${contact.bannerError}`}>
                <AlertIcon />
                <div>
                  <strong>Something went wrong.</strong> Please try again or email us directly.
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={contact.formRow}>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="name">Full name *</label>
                  <input
                    id="name" name="name" value={formData.name} onChange={handleChange}
                    className={`${contact.input} ${errors.name ? contact.inputError : ""}`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className={contact.errorText}>{errors.name}</p>}
                </div>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="email">Email *</label>
                  <input
                    id="email" name="email" type="email" value={formData.email} onChange={handleChange}
                    className={`${contact.input} ${errors.email ? contact.inputError : ""}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className={contact.errorText}>{errors.email}</p>}
                </div>
              </div>

              <div className={contact.formRow}>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="phone">Phone</label>
                  <input
                    id="phone" name="phone" value={formData.phone} onChange={handleChange}
                    className={contact.input} placeholder="+91 98765 43210"
                  />
                </div>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="company">Company</label>
                  <input
                    id="company" name="company" value={formData.company} onChange={handleChange}
                    className={contact.input} placeholder="Optional"
                  />
                </div>
              </div>

              <div className={contact.formRow}>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="service">What&apos;s this about</label>
                  <select id="service" name="service" value={formData.service} onChange={handleChange} className={contact.select}>
                    <option value="">Select one</option>
                    {services.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className={contact.field}>
                  <label className={contact.label} htmlFor="subject">Subject *</label>
                  <input
                    id="subject" name="subject" value={formData.subject} onChange={handleChange}
                    className={`${contact.input} ${errors.subject ? contact.inputError : ""}`}
                    placeholder="What's this about?"
                  />
                  {errors.subject && <p className={contact.errorText}>{errors.subject}</p>}
                </div>
              </div>

              <div className={contact.field}>
                <label className={contact.label} htmlFor="message">Message *</label>
                <textarea
                  id="message" name="message" value={formData.message} onChange={handleChange}
                  className={`${contact.textarea} ${errors.message ? contact.inputError : ""}`}
                  placeholder="Tell us what you need..."
                />
                {errors.message && <p className={contact.errorText}>{errors.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}>
                {isSubmitting ? "Sending..." : <>Send message <SendIcon /></>}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Why here ── */}
      <section className={styles.section}>
        <div className={styles.sectionLabel}>Why DigitalAIIndia</div>
        <h2 className={styles.sectionTitle}>Built for real conversations</h2>
        <div className={styles.buildGrid}>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Real replies</strong><span>No ticket black hole</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>India-first</strong><span>Timezone &amp; pricing that fit</span></div>
          <div className={styles.buildCard}><span className={styles.buildArrow}>→</span><strong>Free to start</strong><span>Talk to us before you commit</span></div>
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
