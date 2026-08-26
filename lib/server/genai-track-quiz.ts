// Correct answers for the genai track. Server-only.

import type { ServerQuizQuestion } from "./quiz-registry";

export const GENAI_TRACK_QUIZ: ServerQuizQuestion[] = [
  {
    stage: 0,
    question: "Why does a model state an invented fact with the same confidence as a real one?",
    options: [
      "It's a bug in newer models",
      "It predicts the next likely token either way — it has no internal marker separating 'learned' from 'plausible', so fluency and truth are produced by the same mechanism",
      "It was trained on unreliable data",
      "Confidence is random",
    ],
    correctIndex: 1,
    explanation: "It predicts the next likely token either way — it has no internal marker separating 'learned' from 'plausible', so fluency and truth are produced by the same mechanism",
  },
  {
    stage: 1,
    question: "Why is `messages` a list even when you're asking a single question?",
    options: [
      "Backwards compatibility",
      "The model is always completing a conversation — one turn is just the shortest one, and the same shape carries system prompts, examples and history",
      "It's faster to parse",
      "So you can send several questions at once",
    ],
    correctIndex: 1,
    explanation: "The model is always completing a conversation — one turn is just the shortest one, and the same shape carries system prompts, examples and history",
  },
  {
    stage: 2,
    question: "Why does the same meaning cost more in Hindi than in English?",
    options: [
      "Indic languages need more words",
      "The tokeniser was trained mostly on English, so Devanagari text splits into far more tokens for the same content — often two to three times as many",
      "Providers charge a language surcharge",
      "It doesn't — cost is per character",
    ],
    correctIndex: 1,
    explanation: "The tokeniser was trained mostly on English, so Devanagari text splits into far more tokens for the same content — often two to three times as many",
  },
  {
    stage: 3,
    question: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?",
    options: ["It's a bug in the model", "The model samples the next token from a probability distribution rather than always picking the top one — temperature controls how much randomness is allowed in that sampling", "The model is learning from your previous questions", "Network latency changes the answer"],
    correctIndex: 1,
    explanation: "At each step the model produces probabilities over possible next tokens. Temperature 0 always takes the most likely one (deterministic); higher temperatures sample more freely from the distribution, producing variation run to run.",
  },
  {
    stage: 4,
    question: "Does `temperature=0` guarantee identical output every time?",
    options: [
      "Yes, that's exactly what it means",
      "No — it makes sampling greedy, but batching, hardware differences and model updates can still shift a result. The only real determinism is caching the answer",
      "Yes, unless the prompt changes",
      "No, because temperature is ignored below 0.1",
    ],
    correctIndex: 1,
    explanation: "No — it makes sampling greedy, but batching, hardware differences and model updates can still shift a result. The only real determinism is caching the answer",
  },
  {
    stage: 5,
    question: "Why is asking a model to add up numbers a bad idea, even though it usually gets it right?",
    options: [
      "It's slower than a calculator",
      "'Usually' is the problem — arithmetic has one correct answer and a probabilistic system can't guarantee it, while `sum()` is correct, instant and free",
      "Models can't parse numbers",
      "It costs too many tokens",
    ],
    correctIndex: 1,
    explanation: "'Usually' is the problem — arithmetic has one correct answer and a probabilistic system can't guarantee it, while `sum()` is correct, instant and free",
  },
];
