// Shared shapes for every Learn track's content — one track = one file in
// lib/tracks/ (client-safe) plus one in lib/server/ (correct quiz answers,
// never shipped to the client).

export type Stage = {
  num: string;
  title: string;
  time: string;
  why: string;
  learn: string[];
  code: string;
  // Optional runnable JS for the playground. Tracks whose `code` block is
  // reference material (CLI commands, config) supply a separate executable
  // exercise here instead of trying to run the reference as JavaScript.
  playground?: string;
  build: string;
  check: string;
};

export type QuizQuestion = { stage: number; question: string; options: string[] };

/**
 * Something the learner does, rather than reads.
 *
 * A lesson carries a list of these, interleaved with the explanation — the
 * previous shape allowed exactly one exercise per lesson, which is how the
 * lessons ended up being mostly prose.
 *
 * This is the client-safe half of each kind. Answers live in
 * lib/server/exercise-banks/ and are never shipped.
 */
export type Exercise =
  /** An expression with holes and a bank of tiles to drop into them. */
  | {
      kind: "fill";
      prompt: string;
      /** `{0}`, `{1}` … mark the slots; everything else is fixed code. */
      template: string;
      /** Correct tiles and distractors together, in a stable order. */
      tiles: string[];
    }
  /**
   * Read code, commit to what it does, then find out. Predicting before
   * revealing is the single highest-value thing a programming course can
   * ask for, and it needs no runtime — the answer is authored.
   */
  | {
      kind: "predict";
      prompt: string;
      code: string;
      /** Candidate outputs. Wrong ones should be the mistakes people make. */
      options: string[];
    }
  /** Working code with one thing wrong in it — find the line. */
  | {
      kind: "spot";
      prompt: string;
      /** One entry per line, rendered numbered and selectable. */
      lines: string[];
    };

export type ExerciseKind = Exercise["kind"];

/**
 * @deprecated The standalone fill registry predates `Exercise`. Kept until
 * every track's exercises move over.
 */
export type FillExercise = {
  stage: number;
  /** What the learner is being asked to complete. */
  prompt: string;
  /**
   * The expression, with `{0}`, `{1}` … marking slots. Everything outside a
   * placeholder renders as fixed code.
   */
  template: string;
  /**
   * Every tile offered, correct ones and distractors together, already in
   * the order they should appear. Deliberately not shuffled at runtime: a
   * stable order means the exercise looks the same each time a learner
   * returns to it, and the distractors can be arranged to sit next to the
   * answers they're meant to be confused with.
   */
  tiles: string[];
};
