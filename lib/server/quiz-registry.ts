import { JS_TRACK_QUIZ } from "./js-track-quiz";
import { DSA_TRACK_QUIZ } from "./dsa-track-quiz";

export type ServerQuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const QUIZ_BANKS: Record<string, ServerQuizQuestion[]> = {
  js: JS_TRACK_QUIZ,
  dsa: DSA_TRACK_QUIZ,
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
