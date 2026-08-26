import { JS_TRACK_QUIZ } from "./js-track-quiz";
import { PYTHON_TRACK_QUIZ } from "./python-track-quiz";
import { DSA_TRACK_QUIZ } from "./dsa-track-quiz";
import { GENAI_TRACK_QUIZ } from "./genai-track-quiz";
import { PROMPTING_TRACK_QUIZ } from "./prompting-track-quiz";
import { RAG_TRACK_QUIZ } from "./rag-track-quiz";
import { LLMAPPS_TRACK_QUIZ } from "./llmapps-track-quiz";

export type ServerQuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QUIZ_BANKS: Record<string, ServerQuizQuestion[]> = {
  js: JS_TRACK_QUIZ,
  python: PYTHON_TRACK_QUIZ,
  dsa: DSA_TRACK_QUIZ,
  genai: GENAI_TRACK_QUIZ,
  prompting: PROMPTING_TRACK_QUIZ,
  rag: RAG_TRACK_QUIZ,
  llmapps: LLMAPPS_TRACK_QUIZ,
};

export function getQuizBank(trackId: string) {
  return QUIZ_BANKS[trackId] ?? null;
}

export function checkAnswer(trackId: string, stage: number, selectedIndex: number) {
  const bank = getQuizBank(trackId);
  const q = bank?.find((item) => item.stage === stage);
  if (!q) return null;
  return {
    correct: q.correctIndex === selectedIndex,
    explanation: q.explanation,
    correctIndex: q.correctIndex,
  };
}

export function getTrackStageCount(trackId: string) {
  return QUIZ_BANKS[trackId]?.length ?? 0;
}
