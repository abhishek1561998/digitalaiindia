// The Learn catalog — one place that knows every course, how its stages roll
// up into levels, and which learning path it belongs to.
//
// Track content still lives in lib/tracks/*. This file is the *structure*
// layered on top: the course app needs levels and lessons (Brilliant-style
// roadmap), while the track files only know about a flat list of stages.
// Chunking happens here so adding a stage to a track never means editing a
// second file.

import { JS_STAGES, JS_QUIZ_QUESTIONS } from "@/lib/tracks/js-track";
import { DSA_STAGES, DSA_QUIZ_QUESTIONS } from "@/lib/tracks/dsa-track";
import { GENAI_STAGES, GENAI_QUIZ_QUESTIONS } from "@/lib/tracks/genai-track";
import { PROMPTING_STAGES, PROMPTING_QUIZ_QUESTIONS } from "@/lib/tracks/prompting-track";
import { RAG_STAGES, RAG_QUIZ_QUESTIONS } from "@/lib/tracks/rag-track";
import { LLMAPPS_STAGES, LLMAPPS_QUIZ_QUESTIONS } from "@/lib/tracks/llmapps-track";
import { PYTHON_STAGES, PYTHON_QUIZ_QUESTIONS } from "@/lib/tracks/python-track";
import type { Stage, QuizQuestion } from "@/lib/tracks/types";

export type Lesson = {
  /** Index into the track's flat stage array — the id every API already uses. */
  stage: number;
  num: string;
  title: string;
  time: string;
};

export type Level = {
  index: number;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  level: string;
  /** Track accent, used for the glyph and every progress affordance. */
  color: string;
  tags: string[];
  stages: Stage[];
  quizQuestions: QuizQuestion[];
  levels: Level[];
  lessonCount: number;
  /** Extra practice surface the course player offers. */
  practiceTool: "code" | "canvas" | "none";
  /** The line printed on the certificate, e.g. "JavaScript, Properly." */
  certTitle: string;
  /** Short code used in the UPI payment reference for this track. */
  payCode: string;
};

export type LearningPath = {
  id: string;
  title: string;
  subtitle: string;
  tier: string;
  color: string;
  courseIds: string[];
};

// Stages per level. Four keeps every course at 2–3 levels, which is the range
// where the roadmap reads as a journey rather than an endless scroll.
const STAGES_PER_LEVEL = 4;

// Long enough for a 40-lesson course. Past the end it falls back to
// "Level N", which is honest but dull — extend this rather than let a track
// grow into it.
const LEVEL_NAMES = [
  "Foundations",
  "Core skills",
  "Putting it together",
  "Going deeper",
  "Professional practice",
  "Mastery",
  "Advanced",
  "Frontier",
  "Capstone",
  "Beyond",
];

function buildLevels(stages: Stage[]): Level[] {
  const levels: Level[] = [];
  for (let i = 0; i < stages.length; i += STAGES_PER_LEVEL) {
    const slice = stages.slice(i, i + STAGES_PER_LEVEL);
    levels.push({
      index: levels.length,
      title: LEVEL_NAMES[levels.length] ?? `Level ${levels.length + 1}`,
      lessons: slice.map((s, j) => ({
        stage: i + j,
        num: s.num,
        title: s.title,
        time: s.time,
      })),
    });
  }
  return levels;
}

type CourseSeed = Omit<Course, "levels" | "lessonCount">;

const SEEDS: CourseSeed[] = [
  {
    id: "js",
    slug: "javascript",
    title: "JavaScript fundamentals",
    short: "JavaScript",
    tagline: "From your very first line to closures, async and modules — the whole language, starting from nothing.",
    level: "Beginner",
    color: "#F0B429",
    tags: ["ES6+", "Async", "DOM", "Closures"],
    stages: JS_STAGES,
    quizQuestions: JS_QUIZ_QUESTIONS,
    practiceTool: "code",
    certTitle: "JavaScript, Properly.",
    payCode: "JS",
  },
  {
    id: "dsa",
    slug: "dsa",
    title: "Data structures & algorithms",
    short: "DSA",
    tagline: "From what a data structure even is, to dynamic programming and greedy — the whole ladder, in order.",
    level: "Beginner to advanced",
    color: "#6C5CE7",
    tags: ["Arrays", "Trees", "Graphs", "DP"],
    stages: DSA_STAGES,
    quizQuestions: DSA_QUIZ_QUESTIONS,
    practiceTool: "code",
    certTitle: "Patterns, Not Problems.",
    payCode: "DSA",
  },
  {
    id: "python",
    slug: "python",
    title: "Python",
    short: "Python",
    tagline: "From your first print() to batching API calls — the language the whole AI ecosystem is written in.",
    level: "Beginner",
    color: "#2F8FD8",
    tags: ["Basics", "Data", "APIs", "Batching"],
    stages: PYTHON_STAGES,
    quizQuestions: PYTHON_QUIZ_QUESTIONS,
    // The in-browser playground executes JavaScript. Running Python would
    // need Pyodide, which is a ~10MB WASM download — worth doing, but not
    // something to pretend is already here.
    practiceTool: "none",
    certTitle: "Python, From Nothing.",
    payCode: "PY",
  },
  {
    id: "genai",
    slug: "generative-ai",
    title: "Generative AI foundations",
    short: "GenAI",
    tagline: "What a model actually does, your first API call, tokens, and where it fits — before any of the clever stuff.",
    level: "Beginner",
    color: "#FF7500",
    tags: ["LLMs", "Tokens", "Sampling"],
    stages: GENAI_STAGES,
    quizQuestions: GENAI_QUIZ_QUESTIONS,
    practiceTool: "none",
    certTitle: "Generative AI, From Nothing.",
    payCode: "GEN",
  },
  {
    id: "prompting",
    slug: "prompt-engineering",
    title: "Prompt engineering",
    short: "Prompting",
    tagline: "System prompts, few-shot, structured output, context limits — and why injection isn't a wording problem.",
    level: "Beginner",
    color: "#E85D9E",
    tags: ["Prompts", "JSON", "Injection"],
    stages: PROMPTING_STAGES,
    quizQuestions: PROMPTING_QUIZ_QUESTIONS,
    practiceTool: "none",
    certTitle: "Prompts That Hold.",
    payCode: "PRM",
  },
  {
    id: "rag",
    slug: "rag",
    title: "RAG — retrieval-augmented generation",
    short: "RAG",
    tagline: "Chunking, embeddings, vector search, reranking and citations — teaching a model your own data.",
    level: "Intermediate",
    color: "#6C5CE7",
    tags: ["Embeddings", "Chunking", "Reranking"],
    stages: RAG_STAGES,
    quizQuestions: RAG_QUIZ_QUESTIONS,
    practiceTool: "none",
    certTitle: "Answers You Can Cite.",
    payCode: "RAG",
  },
  {
    id: "llmapps",
    slug: "llm-apps",
    title: "Shipping LLM apps",
    short: "LLM apps",
    tagline: "Streaming, memory, tool use, evals, cost and agents — the part between a demo and something people use.",
    level: "Advanced",
    color: "#0FA3C7",
    tags: ["Streaming", "Tools", "Evals", "Cost"],
    stages: LLMAPPS_STAGES,
    quizQuestions: LLMAPPS_QUIZ_QUESTIONS,
    practiceTool: "none",
    certTitle: "Shipped, Not Demoed.",
    payCode: "APP",
  },
];

export const COURSES: Course[] = SEEDS.map((seed) => ({
  ...seed,
  levels: buildLevels(seed.stages),
  lessonCount: seed.stages.length,
}));

export const COURSES_BY_ID: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
);

export const COURSES_BY_SLUG: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c]),
);

/**
 * URLs that used to exist and shouldn't start 404ing because a course was
 * renamed or split. Keep entries here rather than deleting them — a link in
 * someone's bookmarks outlives our naming decisions.
 */
const LEGACY_SLUGS: Record<string, string> = {
  // The single "AI engineering" track became four focused courses; its old
  // URL lands on the first of them.
  ai: "genai",
};

export function getCourse(idOrSlug: string): Course | undefined {
  const key = LEGACY_SLUGS[idOrSlug] ?? idOrSlug;
  return COURSES_BY_ID[key] ?? COURSES_BY_SLUG[key];
}

/** The canonical slug for a possibly-legacy path segment, or null. */
export function canonicalSlug(idOrSlug: string): string | null {
  const course = getCourse(idOrSlug);
  if (!course) return null;
  return course.slug === idOrSlug ? null : course.slug;
}

export const PATHS: LearningPath[] = [
  {
    id: "foundations",
    title: "Programming foundations",
    subtitle: "Speak the language of computers",
    tier: "Foundational",
    color: "#6C5CE7",
    courseIds: ["js", "dsa"],
  },
  {
    id: "ai",
    title: "Generative AI",
    subtitle: "From what a model is, to something people can use",
    tier: "Career track",
    color: "#FF7500",
    courseIds: ["python", "genai", "prompting", "rag", "llmapps"],
  },
];

/**
 * Interactive exercises inside one lesson: the playground, the build
 * challenge, and the check question. Courses whose practiceTool is "none"
 * drop the playground.
 */
export function exerciseCount(course: Course): number {
  const perLesson = course.practiceTool === "none" ? 2 : 3;
  return course.lessonCount * perLesson;
}

/** Total lessons across the catalog — used for the "You" stats page. */
export const TOTAL_LESSONS = COURSES.reduce((n, c) => n + c.lessonCount, 0);

/** XP awarded per completed lesson. One knob, everywhere. */
export const XP_PER_LESSON = 20;

// Free access used to be "all of Level 1". It's now one lesson a day, with
// no cap on how far that eventually takes you — see lib/server/daily-lesson.ts.

/** The slice of a course that's safe and cheap to send to the client. */
export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  short: string;
  tagline: string;
  level: string;
  color: string;
  tags: string[];
  lessonCount: number;
  exerciseCount: number;
  levelCount: number;
  /** First lesson of each level, for the roadmap preview. */
  levels: { index: number; title: string; lessonCount: number }[];
};

export function toSummary(c: Course): CourseSummary {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    short: c.short,
    tagline: c.tagline,
    level: c.level,
    color: c.color,
    tags: c.tags,
    lessonCount: c.lessonCount,
    exerciseCount: exerciseCount(c),
    levelCount: c.levels.length,
    levels: c.levels.map((l) => ({ index: l.index, title: l.title, lessonCount: l.lessons.length })),
  };
}

export const COURSE_SUMMARIES: CourseSummary[] = COURSES.map(toSummary);

/** Which level a given stage index falls in, and the lesson's title. */
export function locateLesson(course: Course, stage: number) {
  for (const level of course.levels) {
    const lesson = level.lessons.find((l) => l.stage === stage);
    if (lesson) return { level, lesson };
  }
  return null;
}
