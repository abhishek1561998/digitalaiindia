"use client";

import Link from "next/link";
import { useState } from "react";
import css from "./landing.module.css";
import { CourseGlyph } from "./CourseGlyph";
import { SignInModal } from "./SignInModal";
import { TileDropDemo } from "./TileDropDemo";
import { usePreferences } from "./PreferencesProvider";
import { CheckIcon, BoltIcon, FlameIcon } from "./icons";
import type { CourseSummary } from "@/lib/learn/catalog";
import { PLANS } from "@/lib/learn/pricing";

export function LearnLanding({
  courses,
  totalLessons,
}: {
  courses: CourseSummary[];
  totalLessons: number;
}) {
  const [signInOpen, setSignInOpen] = useState(false);
  const { motionOff } = usePreferences();

  return (
    <div className={css.page}>
      {/* Ambient wash, behind everything and inert. */}
      <div className={css.field} aria-hidden="true">
        <span className={`${css.orb} ${css.orbA}`} />
        <span className={`${css.orb} ${css.orbB}`} />
        <span className={`${css.orb} ${css.orbC}`} />
      </div>
      <div className={css.grain} aria-hidden="true" />

      <div className={css.content}>
        <section className={css.hero}>
          <div>
            <h1 className={`${css.title} ${css.rise} ${css.rise1}`}>
              Learn to build. Not to watch.
            </h1>
            <p className={`${css.sub} ${css.rise} ${css.rise2}`}>
              {courses.length} project-based tracks in the things that actually get you hired.
              Every lesson ends with something you make.
            </p>

            <div className={`${css.rise} ${css.rise3}`}>
              <button type="button" className={css.cta} onClick={() => setSignInOpen(true)}>
                Start learning free
              </button>
            </div>

            <div className={`${css.proof} ${css.rise} ${css.rise4}`}>
              <span className={css.proofItem}>
                <CheckIcon size={15} /> A free lesson every day
              </span>
              <span className={css.proofItem}>
                <BoltIcon size={15} /> {totalLessons} interactive lessons
              </span>
              <span className={css.proofItem}>
                <FlameIcon size={15} /> ₹{PLANS.annual.amount} a year for all of it
              </span>
            </div>
          </div>

          <TileDropDemo motionOff={motionOff} />
        </section>

        <section className={css.section}>
          <div className={css.rowGrid}>
            <div className={css.rowArt}>
              <CourseGlyph courseId="dsa" color="#6C5CE7" size={200} />
            </div>
            <div>
              <h2 className={css.rowTitle}>You finish the thought, not a checkbox</h2>
              <p className={css.rowBody}>
                Instead of picking one of four answers, you complete the actual expression —
                drop the right piece into the right place, and find out immediately whether
                your model of what&apos;s happening was correct.
              </p>
            </div>
          </div>
        </section>

        <section className={css.section}>
          <div className={`${css.rowGrid} ${css.rowFlip}`}>
            <div className={css.rowArt}>
              <CourseGlyph courseId="ai" color="#FF7500" size={200} />
            </div>
            <div>
              <h2 className={css.rowTitle}>A streak worth keeping</h2>
              <p className={css.rowBody}>
                Set a goal of 7, 14, 21 or 30 days and earn a badge when you reach it. Every
                lesson banks XP, and that XP places you in a weekly league against thirty
                other people learning the same week you are.
              </p>
            </div>
          </div>
        </section>

        <section className={css.section}>
          <div className={css.rowGrid}>
            <div className={css.rowArt}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {courses.slice(0, 8).map((c) => (
                  <CourseGlyph key={c.id} courseId={c.id} color={c.color} size={68} plinth={false} />
                ))}
              </div>
            </div>
            <div>
              <h2 className={css.rowTitle}>Priced for here</h2>
              <p className={css.rowBody}>
                ₹{PLANS.annual.amount} a year — about ₹{PLANS.annual.perMonth} a month — for
                all {courses.length} tracks. The global equivalents cost roughly twenty times
                that. The free plan gives you a lesson a day, forever.
              </p>
            </div>
          </div>
        </section>

        <section className={css.closing}>
          <h2 className={css.closingTitle}>Your first lesson is one click away</h2>
          <p className={css.closingSub}>
            No card. No trial clock. One lesson a day is free forever — start now and
            decide later.
          </p>
          <button type="button" className={css.cta} onClick={() => setSignInOpen(true)}>
            Start learning free
          </button>
        </section>

        <footer className={css.footer}>
          <div className={css.footerLinks}>
            <Link href="/about" className={css.footerLink}>About</Link>
            <Link href="/learn/premium" className={css.footerLink}>Premium</Link>
            <Link href="/contact" className={css.footerLink}>Contact</Link>
          </div>
          <span className={css.copy}>© {new Date().getFullYear()} DigitalAIIndia</span>
        </footer>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} redirectTo="/" />
    </div>
  );
}
