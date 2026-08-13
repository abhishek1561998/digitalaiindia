// Server-only quiz bank for the JavaScript track. Correct answers never
// ship to the client — routes import this, check the submitted index, and
// only return { correct: boolean }.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const JS_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "What does console.log(a) print, given `console.log(a); var a = 5;`?",
    options: ["5", "undefined", "ReferenceError", "null"],
    correctIndex: 1,
    explanation: "var declarations are hoisted to the top of their scope, but the assignment (a = 5) stays where it is — so a exists but is still undefined at that point.",
  },
  {
    stage: 1,
    question: "Why does 0 == \"0\" evaluate to true?",
    options: [
      "Because 0 and \"0\" are the same type",
      "Because == coerces one side so both sides can be compared as numbers",
      "It's actually false",
      "Because JavaScript ignores leading zeros",
    ],
    correctIndex: 1,
    explanation: "The == operator coerces types before comparing — the string \"0\" is converted to the number 0, so 0 == 0 is true.",
  },
  {
    stage: 2,
    question: "If you call debounce(fn, 300) three times within 100ms of each other, how many times does fn run?",
    options: ["3 times", "0 times", "1 time, after the last call", "1 time, immediately on the first call"],
    correctIndex: 2,
    explanation: "Each call resets the timer via clearTimeout. Only the last call's timer survives to actually fire, 300ms after that last call.",
  },
  {
    stage: 3,
    question: "When is reduce() the wrong tool for the job?",
    options: [
      "When you need to sum numbers",
      "When a simple map() or filter() already expresses the intent more clearly",
      "reduce() is always the best choice",
      "When the array has more than 100 items",
    ],
    correctIndex: 1,
    explanation: "reduce() can technically do anything an array method can, but if map/filter/find say what you mean more clearly, forcing reduce() just makes the code harder to read.",
  },
  {
    stage: 4,
    question: "Why does attaching a click listener to each .card break for cards added later?",
    options: [
      "It doesn't break, this is a myth",
      "Because addEventListener has a limit of 10 elements",
      "Because the listener was only ever attached to the cards that existed at that moment",
      "Because click events are deprecated",
    ],
    correctIndex: 2,
    explanation: "Event delegation (one listener on the parent) works for future elements because it checks e.target on every click. Direct listeners only exist on the elements that were present when you attached them.",
  },
  {
    stage: 5,
    question: "In `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);` — what's the logged order?",
    options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "4, 1, 3, 2"],
    correctIndex: 1,
    explanation: "Synchronous code runs first (1, 4), then the microtask queue (Promises) before the macrotask queue (setTimeout) — even at 0ms delay.",
  },
  {
    stage: 6,
    question: "What's the real difference between a default export and a named export?",
    options: [
      "No difference, they're aliases",
      "A module can have many named exports but only one default, and named exports must be imported with matching names",
      "Default exports are faster",
      "Named exports only work in Node.js",
    ],
    correctIndex: 1,
    explanation: "A file can export one default (imported under any name you choose) plus any number of named exports (imported using their exact exported name, or renamed with `as`).",
  },
  {
    stage: 7,
    question: "Why does greetFn() lose its `this` binding after `const greetFn = user.greet`?",
    options: [
      "It doesn't — this is a trick question",
      "Because this is set by how a function is called, and greetFn() is called with no object before the dot",
      "Because const variables can't hold functions",
      "Because greet() is an arrow function",
    ],
    correctIndex: 1,
    explanation: "this is determined at call time, not at definition time. user.greet() has an object before the dot, so this = user. greetFn() is called plain, so this is undefined (or the global object in non-strict mode).",
  },
  {
    stage: 8,
    question: "What's a bug in debounce() that an automated test would catch but manual clicking often wouldn't?",
    options: [
      "Syntax errors",
      "Timing edge cases — e.g. calling it exactly at the delay boundary, or with 0 calls",
      "Automated tests can't catch more than manual testing",
      "Debounce functions can't have bugs",
    ],
    correctIndex: 1,
    explanation: "Manual testing tends to only exercise the 'happy path' at human typing speed. A test can precisely control timing to hit edge cases — like calls exactly at the delay boundary — that are hard to trigger by hand.",
  },
];

export function checkAnswer(stage: number, selectedIndex: number) {
  const q = JS_TRACK_QUIZ.find((item) => item.stage === stage);
  if (!q) return null;
  return {
    correct: q.correctIndex === selectedIndex,
    explanation: q.explanation,
    correctIndex: q.correctIndex,
  };
}
