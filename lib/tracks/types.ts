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
  build: string;
  check: string;
};

export type QuizQuestion = { stage: number; question: string; options: string[] };
