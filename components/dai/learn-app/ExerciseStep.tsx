"use client";

import { useState } from "react";
import css from "./lesson-player.module.css";
import { prose } from "./prose";
import { play } from "@/lib/learn/sound";
import { FillExercise } from "./FillExercise";
import { CheckIcon, CloseIcon } from "./icons";
import type { Exercise } from "@/lib/tracks/types";

const KEYS = ["A", "B", "C", "D", "E", "F"];

type Result = { correct: boolean; explanation: string; correctIndex?: number };

/**
 * Renders whichever exercise kind this is and grades it.
 *
 * `fill` still routes to its own component — it has a drag-and-drop model
 * the choice kinds don't share. `predict` and `spot` are both "pick one of
 * n", so they share everything below the presentation.
 */
export function ExerciseStep({
  trackId,
  stage,
  index,
  exercise,
}: {
  trackId: string;
  stage: number;
  index: number;
  exercise: Exercise;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (exercise.kind === "fill") {
    return <FillExercise trackId={trackId} exercise={{ ...exercise, stage }} />;
  }

  const options = exercise.kind === "predict" ? exercise.options : exercise.lines;
  const locked = result?.correct === true;

  async function check() {
    if (picked === null || checking || locked) return;
    setChecking(true);
    setError(null);
    try {
      const res = await fetch("/api/learn/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, stage, index, answer: picked }),
      });
      const data: Result & { error?: string } = await res.json();
      if (data.error) {
        setError("Couldn't check that just now. Try again.");
        return;
      }
      setResult(data);
      play(data.correct ? "correct" : "wrong");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  function stateOf(i: number) {
    if (!result) return picked === i ? "picked" : undefined;
    if (i === result.correctIndex) return "right";
    if (i === picked) return "wrong";
    return undefined;
  }

  return (
    <div>
      <p className={css.exPrompt}>{prose(exercise.prompt)}</p>

      {exercise.kind === "predict" && (
        <pre className={css.exCode}><code>{exercise.code}</code></pre>
      )}

      {exercise.kind === "predict" ? (
        <div className={css.options}>
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className={css.exOption}
              data-state={stateOf(i)}
              disabled={Boolean(result)}
              onClick={() => { setPicked(i); play("tap"); }}
            >
              <span className={css.exKey}>{KEYS[i]}</span>
              {/* Authored with \n so a multi-line output stays readable. */}
              <span>{opt.replace(/\\n/g, "\n")}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={css.exLines}>
          {options.map((line, i) => (
            <button
              key={i}
              type="button"
              className={css.exLine}
              data-state={stateOf(i)}
              disabled={Boolean(result)}
              onClick={() => { setPicked(i); play("tap"); }}
              aria-label={`Line ${i + 1}`}
            >
              <span className={css.exLineNum}>{i + 1}</span>
              <span>{line}</span>
            </button>
          ))}
        </div>
      )}

      {error && <p className={css.fillHint} style={{ color: "var(--wrong)" }}>{error}</p>}

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
              {result.correct ? "That's it." : "Not that one — here's why."}
            </p>
            <p className={css.verdictText}>{prose(result.explanation)}</p>
          </span>
        </div>
      )}

      {!locked && (
        <button
          type="button"
          className={`${css.fillCheck} ${picked !== null ? css.fillCheckReady : ""}`}
          disabled={picked === null || checking}
          onClick={result ? () => { setResult(null); setPicked(null); } : check}
        >
          {checking ? "Checking…" : result ? "Try again" : "Check"}
        </button>
      )}
    </div>
  );
}
