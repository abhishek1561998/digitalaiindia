"use client";

import { useState } from "react";
import css from "./lesson-player.module.css";
import { play } from "@/lib/learn/sound";
import { prose } from "./prose";
import type { Exercise } from "@/lib/tracks/types";

type FillExerciseData = Extract<Exercise, { kind: "fill" }> & { stage: number };

type Result = { correct: boolean; explanation: string; slots: boolean[] };

/** Splits "a {0} b {1}" into fixed text and slot markers, in order. */
function parseTemplate(template: string) {
  return template.split(/(\{\d+\})/g).map((part) => {
    const m = part.match(/^\{(\d+)\}$/);
    return m ? { kind: "slot" as const, index: Number(m[1]) } : { kind: "text" as const, text: part };
  });
}

export function FillExercise({
  trackId,
  exercise,
  onSolved,
}: {
  trackId: string;
  exercise: FillExerciseData;
  /** Fires once, the first time every slot is right. */
  onSolved?: () => void;
}) {
  const parts = parseTemplate(exercise.template);
  const slotCount = parts.filter((p) => p.kind === "slot").length;

  // Slots hold the *bank index* of the tile placed in them, so the same
  // label can appear twice in the bank and still be tracked separately.
  const [slots, setSlots] = useState<(number | null)[]>(Array(slotCount).fill(null));
  const [picked, setPicked] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = result?.correct === true;
  const allFilled = slots.every((s) => s !== null);

  function placeTile(tileIndex: number, slotIndex: number) {
    if (locked) return;
    setSlots((prev) => {
      const next = [...prev];
      // A tile can only be in one place, so pull it out of wherever it was.
      const previous = next.indexOf(tileIndex);
      if (previous !== -1) next[previous] = null;
      next[slotIndex] = tileIndex;
      return next;
    });
    setPicked(null);
    // Re-answering clears the last verdict rather than leaving stale colours.
    setResult(null);
    play("tap");
  }

  function clearSlot(slotIndex: number) {
    if (locked) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = null;
      return next;
    });
    setResult(null);
  }

  function onSlotClick(slotIndex: number) {
    if (locked) return;
    if (picked !== null) placeTile(picked, slotIndex);
    else if (slots[slotIndex] !== null) clearSlot(slotIndex);
  }

  async function check() {
    if (!allFilled || checking || locked) return;
    setChecking(true);
    setError(null);
    try {
      const placed = slots.map((tileIndex) => exercise.tiles[tileIndex!]);
      const res = await fetch("/api/learn/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, stage: exercise.stage, placed }),
      });
      const data: Result & { error?: string } = await res.json();
      if (data.error) {
        // Silently doing nothing here left the learner tapping Check with no
        // idea whether they were wrong or the request had failed.
        setError("Couldn't check that just now. Try again.");
        return;
      }
      setResult(data);
      play(data.correct ? "correct" : "wrong");
      if (data.correct) onSolved?.();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setChecking(false);
    }
  }

  const usedTiles = new Set(slots.filter((s): s is number => s !== null));

  return (
    <div className={css.fill}>
      <p className={css.h2} style={{ fontSize: "1.125rem", marginBottom: "1.1rem" }}>
        {prose(exercise.prompt)}
      </p>

      <div className={css.fillExpr}>
        {parts.map((part, i) =>
          part.kind === "text" ? (
            <span key={i} className={css.fillToken}>{part.text}</span>
          ) : (
            <button
              key={i}
              type="button"
              className={css.fillSlot}
              data-filled={slots[part.index] !== null}
              data-armed={picked !== null && slots[part.index] === null}
              data-over={dragOver === part.index}
              data-result={
                result ? (result.slots[part.index] ? "right" : "wrong") : undefined
              }
              disabled={locked}
              onClick={() => onSlotClick(part.index)}
              onDragOver={(e) => { e.preventDefault(); setDragOver(part.index); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(null);
                const tileIndex = Number(e.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(tileIndex)) placeTile(tileIndex, part.index);
              }}
              aria-label={
                slots[part.index] === null
                  ? `Blank ${part.index + 1}, empty`
                  : `Blank ${part.index + 1}, ${exercise.tiles[slots[part.index]!]}`
              }
            >
              {slots[part.index] !== null ? exercise.tiles[slots[part.index]!] : " "}
            </button>
          ),
        )}
      </div>

      <p className={css.fillBankLabel}>Drag a tile in, or tap one then tap a blank</p>

      <div className={css.fillBank}>
        {exercise.tiles.map((tile, i) => (
          <button
            key={`${tile}-${i}`}
            type="button"
            className={css.fillTile}
            draggable={!locked && !usedTiles.has(i)}
            data-picked={picked === i}
            data-used={usedTiles.has(i)}
            disabled={locked || usedTiles.has(i)}
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(i));
              e.dataTransfer.effectAllowed = "move";
            }}
            onClick={() => {
              if (locked || usedTiles.has(i)) return;
              // Tapping the picked tile again puts it back down.
              setPicked((p) => (p === i ? null : i));
              play("tap");
            }}
          >
            {tile}
          </button>
        ))}
      </div>

      {error && (
        <p className={css.fillHint} style={{ color: "var(--wrong)" }}>{error}</p>
      )}

      {result && (
        <div className={css.verdict} data-ok={result.correct} style={{ marginTop: "1.25rem" }}>
          <span
            className={css.verdictIcon}
            style={{ background: result.correct ? "var(--done)" : "var(--wrong)" }}
          >
            {result.correct ? "✓" : "×"}
          </span>
          <span>
            <p className={css.verdictTitle}>
              {result.correct ? "That's it." : "Not quite — try the highlighted blank again."}
            </p>
            <p className={css.verdictText}>{prose(result.explanation)}</p>
          </span>
        </div>
      )}

      {!locked && (
        <button
          type="button"
          className={`${css.fillCheck} ${allFilled ? css.fillCheckReady : ""}`}
          disabled={!allFilled || checking}
          onClick={check}
        >
          {checking ? "Checking…" : "Check"}
        </button>
      )}
    </div>
  );
}
