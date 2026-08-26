"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import css from "./lesson-player.module.css";
import { learnFonts } from "./fonts";
import { CourseGlyph } from "./CourseGlyph";
import { COURSE_SUMMARIES } from "@/lib/learn/catalog";
import { CloseIcon, LockIcon, CheckIcon } from "./icons";
import { play } from "@/lib/learn/sound";


const PERKS = [
  "As many lessons a day as you want",
  `Every lesson in all ${COURSE_SUMMARIES.length} tracks`,
  "Playgrounds, build challenges and quizzes",
];

/** "in 7 hours" / "in 40 minutes" — how long until the next free lesson. */
function untilLabel(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "any moment now";
  const hours = Math.floor(ms / 3_600_000);
  if (hours >= 1) return `in ${hours} ${hours === 1 ? "hour" : "hours"}`;
  const minutes = Math.max(1, Math.round(ms / 60_000));
  return `in ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

export function LessonLocked({
  courseId,
  courseSlug,
  courseTitle,
  courseColor,
  lessonTitle,
  nextAt,
  trialUsed,
  claimed,
}: {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseColor: string;
  lessonTitle: string;
  /** ISO timestamp when the next free lesson unlocks. */
  nextAt: string;
  trialUsed: boolean;
  /** The lesson today's free slot was spent on, if it's still unfinished. */
  claimed: { title: string; href: string } | null;
}) {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTheme(window.localStorage.getItem("theme") === "dark" ? "dark" : "light");
  }, []);

  async function startTrial() {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch("/api/learn/subscription/trial", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        setError(data.message ?? "Couldn't start the trial. Try again.");
        return;
      }
      if (data.alreadyUsed) {
        setError(data.message);
        return;
      }
      play("unlock");
      // A hard reload, not router.refresh(): the gate is decided server-side
      // and the whole shell (nav pills included) needs the new state.
      window.location.reload();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className={`${css.player} ${learnFonts}`} data-theme={theme}>
      <header className={css.top}>
        <Link href={`/learn/${courseSlug}`} className={css.close} aria-label="Exit lesson">
          <CloseIcon />
        </Link>
        <div className={css.segs} />
      </header>

      <div className={css.body}>
        <div className={css.sheet} style={{ textAlign: "center" }}>
          <div className={css.doneArt} style={{ position: "relative" }}>
            <div style={{ opacity: 0.35, filter: "grayscale(0.6)" }}>
              <CourseGlyph courseId={courseId} color={courseColor} size={140} />
            </div>
            <span
              style={{
                position: "absolute", inset: 0, display: "grid", placeItems: "center",
                color: "var(--text2)",
              }}
            >
              <span
                style={{
                  width: 62, height: 62, display: "grid", placeItems: "center",
                  borderRadius: 999, background: "var(--surface)",
                  border: "2px solid var(--line)",
                }}
              >
                <LockIcon size={28} />
              </span>
            </span>
          </div>

          <span className={css.eyebrow}>That\u2019s today\u2019s lesson done</span>
          <h1 className={css.h1}>Come back tomorrow for this one</h1>
          <p className={css.lead}>
            The free plan is one lesson a day, every day, forever — and you\u2019ve used
            today\u2019s. <strong style={{ color: "var(--text)" }}>{lessonTitle}</strong> unlocks{" "}
            {untilLabel(nextAt)}. Premium lifts the limit entirely.
          </p>

          {claimed && (
            <p className={css.lead} style={{ marginTop: "-0.75rem" }}>
              Still finishing today\u2019s?{" "}
              <Link href={claimed.href} style={{ color: "var(--accent)", fontWeight: 550 }}>
                {claimed.title}
              </Link>
            </p>
          )}

          <ul className={css.list} style={{ textAlign: "left", maxWidth: 420, margin: "0 auto 1.75rem" }}>
            {PERKS.map((perk) => (
              <li key={perk} className={css.listItem}>
                <span
                  className={css.listBullet}
                  style={{ background: "color-mix(in srgb, var(--done) 16%, transparent)", color: "var(--done)" }}
                >
                  <CheckIcon size={13} />
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>

          {error && (
            <div className={css.verdict} data-ok="false" style={{ textAlign: "left" }}>
              <span className={css.verdictIcon} style={{ background: "var(--wrong)" }}>
                <CloseIcon size={16} />
              </span>
              <span>
                <p className={css.verdictText}>{error}</p>
              </span>
            </div>
          )}

          <div className={css.foot}>
            <Link href={`/learn/${courseSlug}`} className={css.back} style={{ display: "grid", placeItems: "center" }}>
              Back to course
            </Link>
            {trialUsed ? (
              <Link href="/learn/premium" className={`${css.cta} ${css.ctaGo}`}>
                See Premium plans
              </Link>
            ) : (
              <button type="button" className={`${css.cta} ${css.ctaGo}`} onClick={startTrial} disabled={starting}>
                {starting ? "Starting…" : "Start 7-day free trial"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
