"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import css from "./CourseStepper.module.css";
import { Playground } from "./Playground";
import { WireframeCanvas } from "./WireframeCanvas";
import type { Stage, QuizQuestion } from "@/lib/tracks/types";

function stripCodeMarkup(code: string) {
  return code.replace(/<KW>(.*?)<\/KW>/g, "$1");
}

type Enrollment = {
  currentStage: number;
  stageProgress: Record<string, number>;
  points: number;
  completedAt: string | null;
};

function renderCode(code: string) {
  return code.split(/(<KW>.*?<\/KW>)/g).map((part, i) => {
    const match = part.match(/^<KW>(.*)<\/KW>$/);
    return match ? <span className="kw" style={{ color: "var(--accent)" }} key={i}>{match[1]}</span> : <span key={i}>{part}</span>;
  });
}

export function CourseStepper({
  trackId,
  trackTitle,
  overviewPath,
  certificatePath,
  stages,
  quizQuestions,
  userName,
  practiceTool = "code",
}: {
  trackId: string;
  trackTitle: string;
  overviewPath: string;
  certificatePath: string;
  stages: Stage[];
  quizQuestions: QuizQuestion[];
  userName: string;
  practiceTool?: "code" | "canvas" | "none";
}) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; explanation: string; correctIndex?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const stageNavRef = useRef<HTMLElement>(null);

  const totalStages = stages.length;

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/learn/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      const data = await res.json();
      if (data.error === "learn_requires_google") {
        setBlocked(true);
        setLoading(false);
        return;
      }
      if (data.enrollment) {
        setEnrollment(data.enrollment);
        setActiveStage(data.enrollment.currentStage);
      }
      setLoading(false);
    })();
  }, [trackId]);

  useEffect(() => {
    if (!enrollment) return;
    const already = enrollment.stageProgress[String(activeStage)] || 0;
    if (already >= 50) return;
    fetch("/api/learn/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, stage: activeStage }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.enrollment) setEnrollment(data.enrollment);
      });
    setSelected(null);
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStage]);

  // On mobile the stage list is a horizontal strip; keep the active card
  // centred so it's never sitting half-clipped at an edge.
  useEffect(() => {
    const nav = stageNavRef.current;
    if (!nav || nav.scrollWidth <= nav.clientWidth) return;
    const active = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    nav.scrollTo({
      left: active.offsetLeft - nav.clientWidth / 2 + active.clientWidth / 2,
      behavior: "smooth",
    });
  }, [activeStage, enrollment]);

  const overallPercent = useMemo(() => {
    if (!enrollment) return 0;
    const sum = Array.from({ length: totalStages }, (_, i) => enrollment.stageProgress[String(i)] || 0).reduce((a, b) => a + b, 0);
    return Math.round(sum / totalStages);
  }, [enrollment, totalStages]);

  async function submitAnswer() {
    if (selected === null || submitting) return;
    setSubmitting(true);
    const res = await fetch("/api/learn/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, stage: activeStage, selectedIndex: selected }),
    });
    const data = await res.json();
    setResult({ correct: data.correct, explanation: data.explanation, correctIndex: data.correctIndex });
    if (data.enrollment) setEnrollment(data.enrollment);
    setSubmitting(false);
  }

  function goToStage(i: number) {
    if (!enrollment) return;
    if (i > enrollment.currentStage) return;
    setActiveStage(i);
  }

  if (blocked) {
    return (
      <div className={css.loadingState}>
        This course requires Google sign-in to verify identity for the certificate.
        <br />
        <a href="/api/auth/logout" onClick={async (e) => { e.preventDefault(); await fetch("/api/auth/logout", { method: "POST" }); window.location.href = `/auth?redirect=${encodeURIComponent(`${overviewPath}/course`)}`; }} style={{ color: "var(--accent)" }}>
          Log out and continue with Google →
        </a>
      </div>
    );
  }

  if (loading || !enrollment) {
    return <div className={css.loadingState}>Loading your course…</div>;
  }

  const stage = stages[activeStage];
  const quiz = quizQuestions[activeStage];
  const stagePassed = (enrollment.stageProgress[String(activeStage)] || 0) === 100;
  const isLastStage = activeStage === totalStages - 1;
  const courseComplete = Boolean(enrollment.completedAt);

  return (
    <div className={css.wrap}>
      {/* ── Sidebar ── */}
      <aside className={css.sidebar}>
        <div className={css.sideHead}>
          <div className={css.sideTitle}>{trackTitle}</div>
          <div className={css.overallBar}><div className={css.overallFill} style={{ width: `${overallPercent}%` }} /></div>
          <div className={css.overallMeta}>
            <span>{overallPercent}% complete</span>
            <span>{enrollment.points} pts</span>
          </div>
        </div>
        <nav className={css.stageNav} ref={stageNavRef}>
          {stages.map((s, i) => {
            const pct = enrollment.stageProgress[String(i)] || 0;
            const locked = i > enrollment.currentStage;
            return (
              <button
                type="button"
                key={s.num}
                className={`${css.stageRow} ${i === activeStage ? css.stageRowActive : ""}`}
                data-active={i === activeStage}
                disabled={locked}
                onClick={() => goToStage(i)}
              >
                <span className={`${css.stageBadge} ${pct === 100 ? css.stageBadgeDone : pct === 50 ? css.stageBadgeHalf : ""}`}>
                  {pct === 100 ? "✓" : `${pct}%`}
                </span>
                <span className={css.stageRowTitle}>{s.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className={css.main}>
        <Link href={overviewPath} className={css.backLink}>← Back to curriculum</Link>
        <div className={css.stageEyebrow}>Stage {stage.num} · {stage.time}</div>
        <h1 className={css.stageHeading}>{stage.title}</h1>
        <p className={css.stageWhy}>{stage.why}</p>

        <div className={css.miniLabel}>What you&apos;ll learn</div>
        <ul className={css.learnList}>
          {stage.learn.map((l) => <li key={l}>{l}</li>)}
        </ul>

        <div className={css.miniLabel}>{practiceTool === "canvas" ? "Reference" : "Code"}</div>
        <pre className={css.codeBlock}>{renderCode(stage.code)}</pre>

        {practiceTool === "none" ? null : practiceTool === "canvas" ? (
          <>
            <div className={css.miniLabel}>Sketchpad — try it yourself</div>
            <WireframeCanvas key={stage.num} title={`stage-${stage.num}`} starterHint={stage.build} />
          </>
        ) : (
          <>
            <div className={css.miniLabel}>Playground — edit and run it</div>
            <Playground
              key={stage.num}
              title={`stage-${stage.num}.js`}
              initialCode={stage.playground ?? stripCodeMarkup(stage.code)}
            />
          </>
        )}

        <div className={css.buildBox}>
          <strong>Build</strong>
          {stage.build}
        </div>

        {/* ── Quiz ── */}
        <div className={css.quiz}>
          <div className={css.quizLabel}>{stagePassed ? "Quiz — passed" : "Quiz — required to continue"}</div>
          <div className={css.quizQuestion}>{quiz.question}</div>
          <div className={css.quizOptions}>
            {quiz.options.map((opt, i) => {
              let cls = css.quizOption;
              if (result) {
                if (i === result.correctIndex) cls += ` ${css.quizOptionCorrect}`;
                else if (i === selected) cls += ` ${css.quizOptionWrong}`;
              } else if (i === selected) {
                cls += ` ${css.quizOptionSelected}`;
              }
              return (
                <button
                  type="button"
                  key={opt}
                  className={cls}
                  disabled={Boolean(result) || stagePassed}
                  onClick={() => setSelected(i)}
                >
                  <span className={css.quizLetter}>{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {!stagePassed && !result && (
            <div className={css.quizActions}>
              <button
                type="button"
                className="btn"
                style={{ padding: "9px 18px", borderRadius: "10px", border: "none", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: selected === null ? "not-allowed" : "pointer", opacity: selected === null ? 0.5 : 1 }}
                disabled={selected === null || submitting}
                onClick={submitAnswer}
              >
                {submitting ? "Checking…" : "Submit answer"}
              </button>
            </div>
          )}

          {result && (
            <div className={`${css.quizFeedback} ${result.correct ? css.quizFeedbackCorrect : css.quizFeedbackWrong}`}>
              <strong style={{ color: "var(--text)" }}>{result.correct ? "Correct — +10 points. " : "Not quite. "}</strong>
              {result.explanation}
              {!result.correct && (
                <div style={{ marginTop: "0.6rem" }}>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, padding: 0 }}
                    onClick={() => { setSelected(null); setResult(null); }}
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}

          {stagePassed && !result && (
            <div className={`${css.quizFeedback} ${css.quizFeedbackCorrect}`}>
              <strong style={{ color: "var(--text)" }}>Already passed.</strong> You can move on whenever you&apos;re ready.
            </div>
          )}
        </div>

        {courseComplete && (
          <div className={css.completeBanner}>
            <p><strong>{userName}</strong>, you&apos;ve completed this track — {enrollment.points} points earned.</p>
            <Link href={certificatePath} className="btn" style={{ padding: "9px 18px", borderRadius: "10px", background: "var(--accent)", color: "#fff", fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}>
              View certificate →
            </Link>
          </div>
        )}

        <div className={css.footNav}>
          <button
            type="button"
            style={{ padding: "9px 16px", borderRadius: "10px", border: "1px solid var(--border2)", background: "none", color: "var(--text2)", fontSize: "0.85rem", cursor: activeStage === 0 ? "not-allowed" : "pointer", opacity: activeStage === 0 ? 0.4 : 1 }}
            disabled={activeStage === 0}
            onClick={() => goToStage(activeStage - 1)}
          >
            ← Previous
          </button>
          {!isLastStage && (
            <button
              type="button"
              style={{ padding: "9px 16px", borderRadius: "10px", border: "1px solid var(--border2)", background: "none", color: "var(--text2)", fontSize: "0.85rem", cursor: !stagePassed ? "not-allowed" : "pointer", opacity: !stagePassed ? 0.4 : 1 }}
              disabled={!stagePassed}
              onClick={() => goToStage(activeStage + 1)}
            >
              Next →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
