// Exercises, with their answers.
//
// One registry for every kind, keyed by (track, stage), holding an ordered
// list. That ordering is what lets the lesson player interleave doing with
// reading instead of stacking all the prose first and one question last.
//
// Answers never leave this side — the client gets the prompt and the
// options, and grading happens here.

import { JS_EXERCISES } from "./exercises/js";
import type { Exercise } from "@/lib/tracks/types";

export type ServerExercise =
  | {
      kind: "fill";
      prompt: string;
      template: string;
      tiles: string[];
      /** One per slot, in slot order. */
      answers: string[];
      explanation: string;
    }
  | {
      kind: "predict";
      prompt: string;
      code: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      kind: "spot";
      prompt: string;
      lines: string[];
      /** Zero-based index of the line that's wrong. */
      buggyLine: number;
      explanation: string;
    };

/** stage index -> the exercises for that lesson, in order. */
export type TrackExercises = Record<number, ServerExercise[]>;

const BANKS: Record<string, TrackExercises> = {
  js: JS_EXERCISES,
};

/** The client-safe half: everything except the answer. */
export function getExercises(trackId: string, stage: number): Exercise[] {
  const list = BANKS[trackId]?.[stage] ?? [];
  return list.map((e) => {
    switch (e.kind) {
      case "fill":
        return { kind: "fill", prompt: e.prompt, template: e.template, tiles: e.tiles };
      case "predict":
        return { kind: "predict", prompt: e.prompt, code: e.code, options: e.options };
      case "spot":
        return { kind: "spot", prompt: e.prompt, lines: e.lines };
    }
  });
}

export type ExerciseResult = {
  correct: boolean;
  explanation: string;
  /** fill only: which slots were right. */
  slots?: boolean[];
  /** predict / spot: the index that was correct, revealed after an attempt. */
  correctIndex?: number;
};

export function checkExercise(
  trackId: string,
  stage: number,
  index: number,
  answer: unknown,
): ExerciseResult | null {
  const exercise = BANKS[trackId]?.[stage]?.[index];
  if (!exercise) return null;

  switch (exercise.kind) {
    case "fill": {
      if (!Array.isArray(answer) || answer.length !== exercise.answers.length) {
        return { correct: false, explanation: exercise.explanation, slots: [] };
      }
      const slots = exercise.answers.map((a, i) => answer[i] === a);
      return { correct: slots.every(Boolean), explanation: exercise.explanation, slots };
    }
    case "predict":
    case "spot": {
      const target = exercise.kind === "predict" ? exercise.correctIndex : exercise.buggyLine;
      return {
        correct: Number(answer) === target,
        explanation: exercise.explanation,
        correctIndex: target,
      };
    }
  }
}

/** How many exercises a lesson carries — used for the step count. */
export function exerciseCountFor(trackId: string, stage: number) {
  return BANKS[trackId]?.[stage]?.length ?? 0;
}
