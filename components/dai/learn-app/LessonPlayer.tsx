"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import css from "./lesson-player.module.css";
import { learnFonts } from "./fonts";
import { CourseGlyph } from "./CourseGlyph";
import { ExerciseStep } from "./ExerciseStep";
import { Playground } from "../Playground";
import { WireframeCanvas } from "../WireframeCanvas";
import { CloseIcon, BoltIcon, CheckIcon, TrophyIcon } from "./icons";
import { play } from "@/lib/learn/sound";
import { isSupported, loadVoices, speak, stop } from "@/lib/learn/narrator";
import { usePreferences } from "./PreferencesProvider";
import { NARRATOR } from "@/lib/learn/preferences";
import { prose } from "./prose";
import { BadgeMedal } from "./BadgeMedal";
import type { Badge } from "@/lib/learn/badges";
import type { Stage, QuizQuestion, Exercise } from "@/lib/tracks/types";


/** The lesson is split into steps so one screen holds exactly one idea. */
// "do:N" is the Nth exercise of this lesson. Encoding the index in the step
// keeps the sequence a flat list, which is what the segmented progress bar
// and the Back button both walk.
type StepKind = "why" | "learn" | "code" | `do:${number}` | "practice" | "build" | "quiz" | "done";

const KEYS = ["A", "B", "C", "D", "E", "F"];

const EXERCISE_LABEL: Record<Exercise["kind"], string> = {
  predict: "Predict the output",
  fill: "Fill it in",
  spot: "Spot the bug",
};

function kindIsExercise(kind: string): kind is `do:${number}` {
  return kind.startsWith("do:");
}

function renderCode(code: string) {
  return code.split(/(<KW>.*?<\/KW>)/g).map((part, i) => {
    const m = part.match(/^<KW>([\s\S]*)<\/KW>$/);
    return m ? <span className={css.codeComment} key={i}>{m[1]}</span> : <span key={i}>{part}</span>;
  });
}

function stripMarkup(code: string) {
  return code.replace(/<KW>([\s\S]*?)<\/KW>/g, "$1");
}

type Props = {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseColor: string;
  practiceTool: "code" | "canvas" | "none";
  stage: number;
  lessonTitle: string;
  levelTitle: string;
  totalLessons: number;
  content: Stage;
  question: QuizQuestion | null;
  /** True when this stage was already passed — no XP, and the quiz replays. */
  alreadyPassed: boolean;
  /** Things to do, interleaved after the code. May be empty. */
  exercises: Exercise[];
  xpPerLesson: number;
};

export function LessonPlayer({
  courseId, courseSlug, courseTitle, courseColor, practiceTool,
  stage, lessonTitle, levelTitle, totalLessons, content, question,
  alreadyPassed, xpPerLesson, exercises,
}: Props) {
  const router = useRouter();
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ correct: boolean; explanation: string; correctIndex?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awarded, setAwarded] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [burst, setBurst] = useState(false);
  const [wonBadges, setWonBadges] = useState<Badge[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const { prefs } = usePreferences();

  useEffect(() => {
    setTheme(window.localStorage.getItem("theme") === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!isSupported()) return;
    void loadVoices().then((voices) => setCanSpeak(voices.length > 0));
    // Leaving the lesson mid-sentence should stop the sentence.
    return () => stop();
  }, []);

  // Enrolment is idempotent and also what flips the stage to "viewed", so it
  // runs once on open rather than behind a Start button.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/learn/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: courseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (data.error === "learn_requires_google") {
        setError("Sign in with Google to track progress — certificates are tied to a verified identity.");
        return;
      }
      fetch("/api/learn/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: courseId, stage }),
      }).catch(() => {});
    })();
    return () => { cancelled = true; };
  }, [courseId, stage]);

  const practiceCode = content.playground ?? stripMarkup(content.code);
  const hasPractice = practiceTool !== "none";

  const steps: StepKind[] = useMemo(() => {
    const s: StepKind[] = ["why", "learn", "code"];
    // Exercises go straight after the code they're drawn from, while the
    // example is still fresh — reading, then doing, then reading again.
    exercises.forEach((_, i) => s.push(`do:${i}` as StepKind));
    if (hasPractice) s.push("practice");
    s.push("build");
    if (question) s.push("quiz");
    s.push("done");
    return s;
  }, [hasPractice, question, exercises]);



  const kind = steps[step];
  const isLast = stage >= totalLessons - 1;
  const exerciseIndex = kindIsExercise(kind) ? Number(kind.slice(3)) : null;

  const script = useMemo(() => {
    if (kindIsExercise(kind)) {
      const ex = exercises[Number(kind.slice(3))];
      return ex ? ex.prompt : "";
    }
    switch (kind) {
      case "why":
        return `${lessonTitle}. ${content.why}`;
      case "learn":
        return `In this lesson: ${content.learn.join(". ")}.`;
      case "code":
        return "Here's the idea in code. Read it line by line — the highlighted comments say what each part is doing, and why.";
      case "practice":
        return practiceTool === "canvas"
          ? "Your turn. Sketch it out — there's no wrong answer here, only a clearer one."
          : "Your turn. Run the code, change something, and see what breaks. Breaking it on purpose is how you find out what it was doing.";
      case "build":
        return `Build challenge. ${content.build}`;
      case "quiz":
        return question ? question.question : "";
      case "done":
        return isLast
          ? `That's the last lesson in ${courseTitle}. Well done.`
          : "Lesson complete. Nicely done.";
      default:
        return "";
    }
  }, [kind, lessonTitle, content, exercises, practiceTool, question, isLast, courseTitle]);

  function toggleNarration() {
    if (speaking) {
      stop();
      setSpeaking(false);
      return;
    }
    speak(script, prefs.narratorVoice, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    });
  }

  // Autoplay per step, but only when the learner has narration switched on.
  // Browsers require a gesture before the first utterance; opening a lesson
  // is one, so by the time this runs the synth is unlocked.
  useEffect(() => {
    if (!canSpeak || !prefs.narrationEnabled || !script) return;
    const t = setTimeout(() => {
      speak(script, prefs.narratorVoice, {
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
      });
    }, 260);
    return () => {
      clearTimeout(t);
      stop();
      setSpeaking(false);
    };
  }, [script, canSpeak, prefs.narrationEnabled, prefs.narratorVoice]);

  function next() {
    setStep((s) => {
      const to = Math.min(s + 1, steps.length - 1);
      // The last step is the celebration; everything before it gets the
      // quiet tick so advancing never feels like an event of its own.
      play(steps[to] === "done" ? "complete" : "tap");
      return to;
    });
  }

  async function submitAnswer() {
    if (selected === null || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/learn/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId: courseId, stage, selectedIndex: selected }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.message || "Something went wrong. Try again.");
        return;
      }
      setResult({ correct: data.correct, explanation: data.explanation, correctIndex: data.correctIndex });
      play(data.correct ? "correct" : "wrong");
      // The answer endpoint reports any badge this lesson pushed over the
      // line, so the done screen can name it rather than the learner finding
      // out on the profile page later.
      if (Array.isArray(data.newBadges) && data.newBadges.length) {
        setWonBadges(data.newBadges);
      }
      if (data.correct && data.awardedXp > 0) {
        setAwarded(data.awardedXp);
        setSessionXp(data.awardedXp);
        setBurst(true);
        // The XP sparkle lands just after the correct chime resolves, so the
        // two read as one phrase rather than as two overlapping sounds.
        setTimeout(() => play("xp"), 340);
        setTimeout(() => setBurst(false), 1600);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function retry() {
    setResult(null);
    setSelected(null);
  }

  const passed = result?.correct || alreadyPassed;
  // Steps completed so far; the quiz only counts once it's actually passed.
  const filledSegs = kind === "quiz" && !result?.correct ? step : step + (kind === "done" ? 1 : 0);

  return (
    <div
      className={`${css.player} ${learnFonts}`}
      data-theme={theme}
    >
      {burst && (
        <div className={css.burst} role="status">
          +{awarded} <BoltIcon size={22} /> XP
        </div>
      )}

      <header className={css.top}>
        <Link href={`/learn/${courseSlug}`} className={css.close} aria-label="Exit lesson">
          <CloseIcon />
        </Link>
        <div className={css.segs} role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={filledSegs}>
          {steps.map((s, i) => (
            <span key={s + i} className={css.seg}>
              <span className={css.segFill} style={{ width: i < filledSegs ? "100%" : "0%" }} />
            </span>
          ))}
        </div>
        {canSpeak && script && (
          <button
            type="button"
            className={css.narrate}
            data-speaking={speaking}
            onClick={toggleNarration}
            aria-label={speaking ? `Stop ${NARRATOR.name}` : `Have ${NARRATOR.name} read this`}
          >
            <span className={css.wave} aria-hidden="true">
              <span className={css.waveBar} />
              <span className={css.waveBar} />
              <span className={css.waveBar} />
            </span>
            <span className={css.narrateLabel}>{NARRATOR.name}</span>
          </button>
        )}

        <span className={css.topXp}>
          {sessionXp}
          <span style={{ color: "var(--xp)", display: "flex" }}><BoltIcon size={19} /></span>
        </span>
      </header>

      <div className={css.body}>
        <div className={css.sheet} key={kind}>
          {kind === "why" && (
            <>
              <span className={css.eyebrow}>Lesson {stage + 1} · {levelTitle}</span>
              <h1 className={css.h1}>{lessonTitle}</h1>
              <p className={css.lead}>{prose(content.why)}</p>
            </>
          )}

          {kind === "learn" && (
            <>
              <span className={css.eyebrow}>What you'll learn</span>
              <h2 className={css.h2}>{lessonTitle}</h2>
              <ul className={css.list}>
                {content.learn.map((item, i) => (
                  <li key={i} className={css.listItem}>
                    <span className={css.listBullet}>{i + 1}</span>
                    <span>{prose(item)}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {kind === "code" && (
            <>
              <span className={css.eyebrow}>In code</span>
              <h2 className={css.h2}>Read this closely</h2>
              <pre className={css.code}><code>{renderCode(content.code)}</code></pre>
            </>
          )}

          {exerciseIndex !== null && exercises[exerciseIndex] && (
            <>
              <span className={css.eyebrow}>
                {EXERCISE_LABEL[exercises[exerciseIndex].kind]}
              </span>
              <ExerciseStep
                trackId={courseId}
                stage={stage}
                index={exerciseIndex}
                exercise={exercises[exerciseIndex]}
              />
            </>
          )}

          {kind === "practice" && (
            <>
              <span className={css.eyebrow}>Your turn</span>
              <h2 className={css.h2}>
                {practiceTool === "canvas" ? "Sketch it" : "Run it, break it, fix it"}
              </h2>
              <div className={css.practice}>
                {practiceTool === "canvas" ? (
                  <WireframeCanvas title={lessonTitle} starterHint={content.build} />
                ) : (
                  <Playground title="Try it yourself" initialCode={practiceCode} />
                )}
              </div>
            </>
          )}

          {kind === "build" && (
            <>
              <span className={css.eyebrow}>Build challenge</span>
              <h2 className={css.h2}>Make something with it</h2>
              <p className={css.note}>
                <span className={css.noteLabel}>Do this before moving on</span>
                {prose(content.build)}
              </p>
            </>
          )}

          {kind === "quiz" && question && (
            <>
              <span className={css.eyebrow}>Check yourself</span>
              <h2 className={css.h2}>{prose(question.question)}</h2>

              <div className={css.options}>
                {question.options.map((opt, i) => {
                  let state: string | undefined;
                  if (result) {
                    if (i === result.correctIndex || (result.correct && i === selected)) state = "correct";
                    else if (i === selected) state = "wrong";
                  } else if (i === selected) {
                    state = "selected";
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      className={css.option}
                      data-state={state}
                      disabled={Boolean(result)}
                      onClick={() => { setSelected(i); play("tap"); }}
                    >
                      <span className={css.optionKey}>{KEYS[i]}</span>
                      <span>{prose(opt)}</span>
                    </button>
                  );
                })}
              </div>

              {result && (
                <div className={css.verdict} data-ok={result.correct}>
                  <span
                    className={css.verdictIcon}
                    style={{ background: result.correct ? "var(--done)" : "var(--wrong)" }}
                  >
                    {result.correct ? <CheckIcon size={16} /> : <CloseIcon size={16} />}
                  </span>
                  <span>
                    <p className={css.verdictTitle}>
                      {result.correct ? "That's it." : "Not quite — here's why."}
                    </p>
                    <p className={css.verdictText}>{prose(result.explanation)}</p>
                  </span>
                </div>
              )}
            </>
          )}

          {kind === "done" && (
            <div className={css.done}>
              <div className={css.doneArt}>
                <CourseGlyph courseId={courseId} color={courseColor} size={150} />
              </div>
              <h2 className={css.h1}>Lesson complete</h2>
              <p className={css.lead}>
                {isLast
                  ? `That's the last lesson in ${courseTitle}.`
                  : `${totalLessons - stage - 1} ${totalLessons - stage - 1 === 1 ? "lesson" : "lessons"} left in ${courseTitle}.`}
              </p>
              {wonBadges.map((badge) => (
                <div key={badge.id} className={css.badgeWon}>
                  <BadgeMedal badge={badge} earned size={52} />
                  <span>
                    <p className={css.badgeWonLabel}>Badge earned</p>
                    <p className={css.badgeWonName}>{badge.name}</p>
                    <p className={css.badgeWonDesc}>{badge.description}</p>
                  </span>
                </div>
              ))}

              <div className={css.doneStats}>
                <div className={css.doneStat}>
                  <div className={css.doneStatValue}>+{sessionXp}</div>
                  <div className={css.doneStatLabel}>XP earned</div>
                </div>
                <div className={css.doneStat}>
                  <div className={css.doneStatValue}>{stage + 1}/{totalLessons}</div>
                  <div className={css.doneStatLabel}>Lessons done</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className={css.verdict} data-ok="false">
              <span className={css.verdictIcon} style={{ background: "var(--wrong)" }}>
                <CloseIcon size={16} />
              </span>
              <span>
                <p className={css.verdictTitle}>Couldn't save that</p>
                <p className={css.verdictText}>{error}</p>
              </span>
            </div>
          )}

          <div className={css.foot}>
            {step > 0 && kind !== "done" && (
              <button type="button" className={css.back} onClick={() => setStep((s) => s - 1)}>
                Back
              </button>
            )}

            {kind === "quiz" ? (
              result ? (
                result.correct ? (
                  <button type="button" className={`${css.cta} ${css.ctaGo}`} onClick={next}>
                    Continue
                  </button>
                ) : (
                  <button type="button" className={css.cta} onClick={retry}>
                    Try again
                  </button>
                )
              ) : (
                <button
                  type="button"
                  className={`${css.cta} ${selected !== null ? css.ctaGo : ""}`}
                  disabled={selected === null || submitting}
                  onClick={submitAnswer}
                >
                  {submitting ? "Checking…" : "Check answer"}
                </button>
              )
            ) : kind === "done" ? (
              isLast ? (
                <Link href={`/learn/${courseSlug}`} className={`${css.cta} ${css.ctaGo}`}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <TrophyIcon size={20} /> Back to the course
                  </span>
                </Link>
              ) : (
                <Link href={`/learn/${courseSlug}/lesson/${stage + 1}`} className={`${css.cta} ${css.ctaGo}`}>
                  Next lesson
                </Link>
              )
            ) : (
              <button type="button" className={css.cta} onClick={next}>
                Continue
              </button>
            )}
          </div>

          {passed && kind !== "done" && kind !== "quiz" && (
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text3)", textAlign: "center" }}>
              You've already passed this lesson — replaying it won't award XP again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
