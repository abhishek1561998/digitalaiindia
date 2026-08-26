"use client";

import Link from "next/link";
import css from "./about.module.css";
import shell from "./learn-app.module.css";
import { CourseGlyph } from "./CourseGlyph";
import type { CourseSummary } from "@/lib/learn/catalog";

const PRINCIPLES = [
  {
    num: "01",
    title: "Price is the barrier, not ability",
    body:
      "Nobody in India lacks the ability to learn this material. What they lack is a subscription priced for a different economy. So we priced ours for this one, and kept a lesson a day free forever — no trial clock, no card.",
  },
  {
    num: "02",
    title: "You build, or you didn't learn it",
    body:
      "Every lesson ends with something you have to make — run the code, break it, ship the thing. Watching a video and nodding is not learning, and we refuse to pretend otherwise.",
  },
  {
    num: "03",
    title: "Explain the why, not just the how",
    body:
      "Most tutorials teach you the incantation. We teach you what's underneath it, so the next unfamiliar bug is a problem you can reason about rather than one you have to search for.",
  },
  {
    num: "04",
    title: "A certificate has to mean something",
    body:
      "Ours is issued against work you actually finished — every lesson passed, every quiz answered. It's tied to a verified identity, and it stays valid whether or not you're still subscribed.",
  },
];

// Published list prices, for context on where ours sits. Update these if the
// comparison stops being true — a stale price is worse than no chart.
const PRICE_ROWS = [
  { name: "Global learning subscriptions", value: "₹8,000–10,000 / year", width: 100 },
  { name: "Typical Indian bootcamp", value: "₹40,000+ one-off", width: 100 },
  { name: "DigitalAIIndia Learn", value: "₹499 / year", width: 6, ours: true },
];

export function LearnAbout({
  courses,
  totalLessons,
}: {
  courses: CourseSummary[];
  totalLessons: number;
}) {
  return (
    <main>
      <section className={css.hero}>
        <p className={css.eyebrow}>Our mission</p>
        <h1 className={css.heroTitle}>Make the good version affordable</h1>
        <p className={css.heroSub}>
          World-class technical education already exists. It just costs more than most people
          in India can justify. We build the same standard of course and price it so that
          stops being the deciding factor.
        </p>
        <div className={css.heroArt}>
          <CourseGlyph courseId="mern" color="#6C5CE7" size={200} />
        </div>
      </section>

      <div className={css.quoteBand}>
        <p className={css.quote}>
          Learning to build should cost{" "}
          <span className={css.mark} style={{ ["--markColor" as string]: "rgba(240, 180, 41, 0.45)" }}>
            less than lunch
          </span>
          , not less than a laptop
        </p>
      </div>

      <div className={css.numbers}>
        <div className={css.number}>
          <div className={css.numberValue}>{courses.length}</div>
          <p className={css.numberLabel}>tracks, from JavaScript to AWS</p>
        </div>
        <div className={css.number}>
          <div className={css.numberValue}>{totalLessons}</div>
          <p className={css.numberLabel}>interactive lessons, each ending in something you build</p>
        </div>
        <div className={css.number}>
          <div className={css.numberValue}>₹499</div>
          <p className={css.numberLabel}>for a year of all of it — about ₹42 a month</p>
        </div>
        <div className={css.number}>
          <div className={css.numberValue}>₹0</div>
          <p className={css.numberLabel}>for a lesson every day, forever</p>
        </div>
      </div>

      <section className={css.section}>
        <div className={css.sectionSplit}>
          <div>
            <h2 className={css.h2}>What we do</h2>
            <p className={css.body}>
              We build project-based tracks in the things that actually get people hired —
              JavaScript, data structures, the MERN stack, AI engineering, AWS, system design,
              UI/UX, and shipping a real project end to end.
            </p>
            <p className={css.body}>
              Each track is a sequence of lessons. A lesson opens with{" "}
              <strong>why the idea exists</strong>, shows you the code, hands you a playground
              to break it in, gives you something to build, and then asks you a question you
              can only answer if you understood it. Pass every lesson and the certificate is
              yours.
            </p>
            <p className={css.body}>
              Everything is interactive in the browser. There is nothing to install before you
              can start, and nothing to buy before you can find out whether this is for you.
            </p>
          </div>

          <div>
            <h2 className={css.h2}>What it costs</h2>
            <div className={css.bars}>
              {PRICE_ROWS.map((row) => (
                <div key={row.name} className={css.bar}>
                  <div className={css.barHead}>
                    <span className={css.barName}>{row.name}</span>
                    <span className={css.barValue}>{row.value}</span>
                  </div>
                  <span className={css.barTrack}>
                    <span
                      className={`${css.barFill} ${row.ours ? css.barFillOurs : ""}`}
                      style={{ width: `${row.width}%` }}
                    />
                  </span>
                </div>
              ))}
            </div>
            <p className={css.barNote}>
              Bars are relative, not to scale — the annual plan is roughly a twentieth of the
              global comparables. We can do this because we run on infrastructure we already
              built for our own products, and because we would rather have many learners at
              ₹499 than a few at ₹9,000.
            </p>
          </div>
        </div>
      </section>

      <section className={css.section} style={{ paddingTop: 0 }}>
        <h2 className={css.h2}>What we believe</h2>
        <div className={css.principles}>
          {PRINCIPLES.map((p) => (
            <article key={p.num} className={css.principle}>
              <p className={css.principleNum}>{p.num}</p>
              <h3 className={css.principleTitle}>{p.title}</h3>
              <p className={css.principleBody}>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={css.section} style={{ paddingTop: 0 }}>
        <h2 className={css.h2}>The tracks</h2>
        <p className={css.body} style={{ marginBottom: "1.75rem" }}>
          Every one is live today, and a lesson a day is free.
        </p>
        <div className={css.wall}>
          {courses.map((c) => (
            <Link key={c.id} href={`/learn/${c.slug}`} className={css.wallItem}>
              <CourseGlyph courseId={c.id} color={c.color} size={72} plinth={false} />
              <span className={css.wallName}>{c.short}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={css.section} style={{ paddingTop: 0 }}>
        <h2 className={css.h2}>Who we are</h2>
        <p className={css.body}>
          DigitalAIIndia is an India-first AI company. Alongside Learn we build developer
          products — chat, voice and design APIs priced and localised for India rather than
          adapted for it later.
        </p>
        <p className={css.body}>
          Learn came out of that work. The generative AI track teaches the same RAG pipelines
          and voice integrations that run inside our own platform, because the most honest
          thing we can teach is what we actually had to figure out.
        </p>
        <p className={css.body}>
          Questions, corrections, or you want to teach with us —{" "}
          <Link href="/contact" style={{ color: "var(--accent)", fontWeight: 550 }}>
            get in touch
          </Link>
          .
        </p>
      </section>

      <section className={css.closing}>
        <h2 className={css.h2}>Start with the free level</h2>
        <p className={css.body} style={{ margin: "0 auto", textAlign: "center" }}>
          A lesson a day, free forever. No card, no trial clock.
        </p>
        <div className={css.closingActions}>
          <Link href="/learn/courses" className={`${shell.btn} ${shell.btnPrimary}`}>
            Browse the tracks
          </Link>
          <Link href="/learn/premium" className={`${shell.btn} ${shell.btnGhost}`}>
            See Premium
          </Link>
        </div>
      </section>
    </main>
  );
}
