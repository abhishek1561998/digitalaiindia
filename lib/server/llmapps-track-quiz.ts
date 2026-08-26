// Correct answers for the llmapps track. Server-only.

import type { ServerQuizQuestion } from "./quiz-registry";

export const LLMAPPS_TRACK_QUIZ: ServerQuizQuestion[] = [
  {
    stage: 0,
    question: "Why is streaming a response mostly a UX improvement rather than a speed improvement?",
    options: ["It genuinely makes the model faster", "Total generation time is roughly the same — streaming just shows tokens as they're produced instead of waiting for all of them, so perceived latency drops dramatically", "Streaming reduces token costs", "It isn't a UX improvement at all"],
    correctIndex: 1,
    explanation: "The model generates at the same rate either way. Streaming changes time-to-first-token from ~8 seconds to ~200ms, which is what users actually perceive as responsiveness — the last token still arrives at roughly the same moment.",
  },
  {
    stage: 1,
    question: "Why does a long conversation get expensive faster than you'd expect?",
    options: [
      "Providers raise the rate for long chats",
      "The API is stateless, so every turn re-sends the whole history — cost grows with the square of the conversation length unless you trim or summarise",
      "Long conversations use a bigger model",
      "Latency increases the per-token price",
    ],
    correctIndex: 1,
    explanation: "The API is stateless, so every turn re-sends the whole history — cost grows with the square of the conversation length unless you trim or summarise",
  },
  {
    stage: 2,
    question: "The model asks to call a tool with an argument. Why must your code validate it first?",
    options: [
      "To catch typos in the tool name",
      "Because the model proposes and your code executes — the argument is generated text, and anything you act on without checking is a hole an injected instruction can walk through",
      "Because the API requires a schema check",
      "To keep the tool result under the token limit",
    ],
    correctIndex: 1,
    explanation: "Because the model proposes and your code executes — the argument is generated text, and anything you act on without checking is a hole an injected instruction can walk through",
  },
  {
    stage: 3,
    question: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?",
    options: ["It makes the bundle larger", "Anything shipped to the browser is fully readable by any user — the key can be extracted and used to run up unlimited charges on your account", "Frontend code runs slower with keys", "It's only a problem for public apps"],
    correctIndex: 1,
    explanation: "There is no such thing as a secret in client-side code — bundlers don't hide it, minification doesn't hide it, and \"private\" apps still ship JS to real browsers. Anyone who opens devtools has your key and your billing account.",
  },
  {
    stage: 4,
    question: "Why is 'the output looked good when I tried it' an unreliable way to evaluate an LLM feature?",
    options: ["It's actually a reliable method", "A handful of manual spot-checks can't catch regressions, edge cases, or the model's variance across runs — you need a repeatable eval set with expected behaviors to know if a prompt change made things better or worse", "Manual testing is too slow, but otherwise fine", "Because outputs are always correct anyway"],
    correctIndex: 1,
    explanation: "LLM outputs vary run to run, so a single good result proves very little. Without a repeatable eval set, you can't tell whether a prompt tweak genuinely improved things or you just got a lucky sample — and regressions ship silently.",
  },
  {
    stage: 5,
    question: "You ship an LLM feature and costs are 10x your estimate. What are the most likely causes?",
    options: ["The provider is overcharging", "Sending far more context than necessary on every call (whole documents instead of retrieved chunks), no caching of repeated queries, retry loops on failures, or using a larger model than the task needs", "LLMs are just inherently unaffordable", "Users are calling the API too politely"],
    correctIndex: 1,
    explanation: "Cost scales with tokens per call times number of calls. Sending a whole document instead of 4 retrieved chunks can be 10x alone; add uncached repeats, retry storms, and an oversized model, and the multiplier compounds fast.",
  },
  {
    stage: 6,
    question: "What are the three ways an agent loop must be able to terminate?",
    options: [
      "Success, failure, timeout",
      "A step cap, a cost ceiling, and the model returning no tool call — without all three, one bad task can loop until it exhausts your budget",
      "User cancel, network error, and rate limit",
      "Only a step cap is needed",
    ],
    correctIndex: 1,
    explanation: "A step cap, a cost ceiling, and the model returning no tool call — without all three, one bad task can loop until it exhausts your budget",
  },
];
