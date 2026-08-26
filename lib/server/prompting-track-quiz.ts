// Correct answers for the prompting track. Server-only.

import type { ServerQuizQuestion } from "./quiz-registry";

export const PROMPTING_TRACK_QUIZ: ServerQuizQuestion[] = [
  {
    stage: 0,
    question: "You give a model a 50-page document and ask a question about page 40, but it answers about page 2. What's the most likely cause?",
    options: ["The model is broken", "The relevant content fell outside the effective context the model attends to, or was truncated — models degrade on retrieval from the middle/end of very long contexts", "Page 40 was written badly", "The model only reads page 2 by design"],
    correctIndex: 1,
    explanation: "This is the well-documented \"lost in the middle\" effect — attention over very long contexts is uneven, and content can also be silently truncated at the context limit. It's the core reason RAG exists: retrieve the relevant few chunks instead of dumping everything in.",
  },
  {
    stage: 1,
    question: "Why must user-supplied text never be interpolated into the system prompt?",
    options: [
      "It makes the prompt too long",
      "The system prompt carries your strongest instructions — putting user text there hands the user control of them",
      "System prompts don't support variables",
      "It breaks token counting",
    ],
    correctIndex: 1,
    explanation: "The system prompt carries your strongest instructions — putting user text there hands the user control of them",
  },
  {
    stage: 2,
    question: "Why put few-shot examples in as assistant turns rather than describing them in the system prompt?",
    options: [
      "It uses fewer tokens",
      "The model is completing a conversation, so a demonstrated turn shows the exact format and tone far more reliably than a description of them",
      "The system prompt has a length limit",
      "Assistant turns are cached",
    ],
    correctIndex: 1,
    explanation: "The model is completing a conversation, so a demonstrated turn shows the exact format and tone far more reliably than a description of them",
  },
  {
    stage: 3,
    question: "Why isn't 'reply with JSON only' enough on its own?",
    options: [
      "Models can't produce JSON",
      "It says nothing about the shape. You need the schema in the prompt, a defensive parse, and validation — because a syntactically valid object with the wrong keys still breaks your code",
      "JSON is too verbose",
      "You need a special API flag",
    ],
    correctIndex: 1,
    explanation: "It says nothing about the shape. You need the schema in the prompt, a defensive parse, and validation — because a syntactically valid object with the wrong keys still breaks your code",
  },
  {
    stage: 4,
    question: "Why can a model with a huge context window still miss something you definitely included?",
    options: [
      "The window is smaller than advertised",
      "Attention degrades in the middle of long inputs — models attend best to the start and the end, so position matters as much as inclusion",
      "Long inputs get truncated silently",
      "It only reads the first 1,000 tokens",
    ],
    correctIndex: 1,
    explanation: "Attention degrades in the middle of long inputs — models attend best to the start and the end, so position matters as much as inclusion",
  },
  {
    stage: 5,
    question: "Why can't prompt injection be fixed by writing a stricter system prompt?",
    options: [
      "It can, with enough rules",
      "Instructions and data travel in the same channel, so the model has no reliable way to tell yours from text inside a document. The fix is limiting what it's permitted to do, not what it's asked",
      "Because system prompts are optional",
      "Because delimiters aren't supported",
    ],
    correctIndex: 1,
    explanation: "Instructions and data travel in the same channel, so the model has no reliable way to tell yours from text inside a document. The fix is limiting what it's permitted to do, not what it's asked",
  },
];
