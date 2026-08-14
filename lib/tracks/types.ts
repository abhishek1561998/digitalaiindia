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
