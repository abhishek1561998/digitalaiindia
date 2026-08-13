// Shared content for the JavaScript track — used by both the curriculum
// overview page (/learn/javascript) and the course stepper
// (/learn/javascript/course), so the two never drift out of sync.

// Client-safe quiz questions (no correct answers — those stay server-side
// in lib/server/js-track-quiz.ts and are checked via /api/learn/answer).
export type JsQuizQuestion = { stage: number; question: string; options: string[] };

export const JS_QUIZ_QUESTIONS: JsQuizQuestion[] = [
  { stage: 0, question: "What does console.log(a) print, given `console.log(a); var a = 5;`?", options: ["5", "undefined", "ReferenceError", "null"] },
  { stage: 1, question: "Why does 0 == \"0\" evaluate to true?", options: ["Because 0 and \"0\" are the same type", "Because == coerces one side so both sides can be compared as numbers", "It's actually false", "Because JavaScript ignores leading zeros"] },
  { stage: 2, question: "If you call debounce(fn, 300) three times within 100ms of each other, how many times does fn run?", options: ["3 times", "0 times", "1 time, after the last call", "1 time, immediately on the first call"] },
  { stage: 3, question: "When is reduce() the wrong tool for the job?", options: ["When you need to sum numbers", "When a simple map() or filter() already expresses the intent more clearly", "reduce() is always the best choice", "When the array has more than 100 items"] },
  { stage: 4, question: "Why does attaching a click listener to each .card break for cards added later?", options: ["It doesn't break, this is a myth", "Because addEventListener has a limit of 10 elements", "Because the listener was only ever attached to the cards that existed at that moment", "Because click events are deprecated"] },
  { stage: 5, question: "In the classic ordering example — console.log(1), setTimeout(...2, 0), Promise.resolve().then(...3), console.log(4) — what's the logged order?", options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "4, 1, 3, 2"] },
  { stage: 6, question: "What's the real difference between a default export and a named export?", options: ["No difference, they're aliases", "A module can have many named exports but only one default, and named exports must be imported with matching names", "Default exports are faster", "Named exports only work in Node.js"] },
  { stage: 7, question: "Why does greetFn() lose its `this` binding after `const greetFn = user.greet`?", options: ["It doesn't — this is a trick question", "Because this is set by how a function is called, and greetFn() is called with no object before the dot", "Because const variables can't hold functions", "Because greet() is an arrow function"] },
  { stage: 8, question: "What's a bug in debounce() that an automated test would catch but manual clicking often wouldn't?", options: ["Syntax errors", "Timing edge cases — e.g. calling it exactly at the delay boundary, or with 0 calls", "Automated tests can't catch more than manual testing", "Debounce functions can't have bugs"] },
];

export type JsStage = {
  num: string;
  title: string;
  time: string;
  why: string;
  learn: string[];
  code: string;
  build: string;
  check: string;
};

export const JS_STAGES: JsStage[] = [
  {
    num: "00",
    title: "How JavaScript actually runs",
    time: "Week 1",
    why: "Most courses jump straight into syntax and skip this — which is exactly why so many self-taught developers can write code that works but can't explain why a bug is happening.",
    learn: [
      "The call stack and execution context — what happens when a function runs",
      "Hoisting: why var, function declarations, and function expressions behave differently",
      "The two-pass way the engine reads your file before running it",
    ],
    code: `console.log(a); <KW>// undefined, not an error — why?</KW>
var a = 5;

sayHi(); <KW>// works — function declarations are fully hoisted</KW>
function sayHi() { console.log("hi"); }

sayBye(); <KW>// TypeError — sayBye is not a function</KW>
var sayBye = function() { console.log("bye"); };`,
    build: "No app this week — take 5 hoisting/scope snippets and write down what each one logs before running it. Score yourself. This is the single highest-leverage exercise in the whole path.",
    check: "What does the first line log — undefined, 5, or a ReferenceError? Explain hoisting in one sentence before you scroll up to check.",
  },
  {
    num: "01",
    title: "Values, types & coercion",
    time: "Week 1–2",
    why: "“Just use ===” is advice you can follow without understanding. This stage makes sure you know the actual coercion rules underneath it.",
    learn: [
      "Primitives vs. reference types — what “copied by value” means for objects and arrays",
      "Type coercion rules for +, -, and equality — not just that they exist, but why",
      "Template literals, and the real difference between == and ===",
    ],
    code: `console.log(1 + "1");   <KW>// "11" — number coerced to string</KW>
console.log("5" - 1);   <KW>// 4   — string coerced to number</KW>
console.log([] + []);   <KW>// ""  — both arrays stringify to empty</KW>
console.log(0 == "0");  <KW>// true  — coercion kicks in</KW>
console.log(0 === "0"); <KW>// false — no coercion, different types</KW>`,
    build: "A small validator library — validatePAN(), validateIndianPhone(), validatePinCode(). Real regex, real edge cases, something you'll reuse later.",
    check: "Why does 0 == [] evaluate to true? Trace the coercion steps by hand before looking it up.",
  },
  {
    num: "02",
    title: "Functions & closures",
    time: "Week 2–3",
    why: "Closures are usually taught as “a function remembers its outer variables,” which is true and useless until you build something that only works because of it.",
    learn: [
      "Function declarations vs. expressions vs. arrow functions — and where this differs",
      "Lexical scope and closures: what's actually being “remembered,” and why",
      "Higher-order functions: functions that take or return other functions",
    ],
    code: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
<KW>// The returned function "closes over" timer —</KW>
<KW>// every call shares that same variable, across calls.</KW>`,
    build: "Write your own debounce() and throttle() from scratch — not imported from lodash. This is the exercise that actually tests whether closures clicked.",
    check: "If you call debounce(fn, 300) three times in quick succession, how many times does fn actually run — and when?",
  },
  {
    num: "03",
    title: "Arrays, objects & shaping data",
    time: "Week 3",
    why: "Almost every real frontend task is “I have data shaped like X, I need it shaped like Y.” This stage makes that fast instead of painful.",
    learn: [
      "map / filter / reduce / find — and when reduce is the wrong tool",
      "Destructuring, spread/rest, and shallow vs. deep copy pitfalls",
      "Grouping, sorting, and flattening nested data",
    ],
    code: `const orders = [
  { city: "Pune", amount: 450 },
  { city: "Delhi", amount: 900 },
  { city: "Pune", amount: 220 },
];

const byCity = orders.reduce((acc, order) => {
  acc[order.city] = (acc[order.city] || 0) + order.amount;
  return acc;
}, {});
<KW>// { Pune: 670, Delhi: 900 }</KW>`,
    build: "Take a real messy dataset (weather or transit data works well) and write five data-transform functions: group by, sort by, top-N, average, flatten.",
    check: "When should you reach for reduce() instead of a plain for loop — and when does reduce actually make the code harder to read?",
  },
  {
    num: "04",
    title: "The DOM & events, done right",
    time: "Week 4",
    why: "Everyone eventually reaches for a framework — but if you've never manipulated the real DOM by hand, you won't understand what the framework is doing for you.",
    learn: [
      "DOM traversal and manipulation without a framework",
      "Event delegation, and why it matters once a list can grow",
      "Accessible forms — labels, focus states, keyboard navigation",
    ],
    code: `<KW>// Bad: one listener per card — breaks for cards added later</KW>
document.querySelectorAll(".card").forEach(card =>
  card.addEventListener("click", handleClick)
);

<KW>// Good: one listener on the parent, works for future cards too</KW>
document.querySelector(".board").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (card) handleClick(card);
});`,
    build: "A vanilla-JS Kanban board — three columns, drag cards between them with native drag events, persist state to localStorage. No framework.",
    check: "Why exactly does the “bad” example break when a new card is added to the board after the listeners were attached?",
  },
  {
    num: "05",
    title: "Async JavaScript",
    time: "Week 5",
    why: "Async/await hides the event loop from you — which is great, until a bug forces you to understand it anyway. This stage builds it the historical way so the “why” sticks.",
    learn: [
      "Callbacks → Promises → async/await, and why each one exists",
      "The event loop: microtasks vs. macrotasks (where most developers stay fuzzy)",
      "fetch, and error handling with try/catch",
    ],
    code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");

<KW>// Output: 1, 4, 3, 2</KW>
<KW>// Sync code first, then microtasks (Promises),</KW>
<KW>// then macrotasks (setTimeout) — even at 0ms.</KW>`,
    build: "A live weather dashboard hitting a real public API (no key required — Open-Meteo works well) with proper loading and error states, not just the happy path.",
    check: "Rewrite the code above using async/await instead of .then(). Does the logged order change? Why or why not?",
  },
  {
    num: "06",
    title: "Modules & modern tooling",
    time: "Week 6",
    why: "This is the stage that makes every tutorial you've seen with a vite.config.js or a package.json actually make sense, instead of being magic you copy.",
    learn: [
      "ES modules — import / export, default vs. named",
      "npm, package.json, and what a bundler like Vite is actually doing",
      "Environment variables, and the real difference between browser and Node",
    ],
    code: `<KW>// math.js</KW>
export function add(a, b) { return a + b; }
export const PI = 3.14159;

<KW>// main.js</KW>
import { add, PI } from "./math.js";
console.log(add(2, PI));`,
    build: "Refactor the Stage 5 weather dashboard into a proper Vite project — split it into modules, add a .env for config, deploy it.",
    check: "What's the actual difference between a default export and a named export — and when would you reach for each?",
  },
  {
    num: "07",
    title: "Prototypes, classes & this",
    time: "Week 7",
    why: "class syntax hides the prototype chain underneath it. Understanding what it compiles to is what lets you debug this-binding bugs instead of guessing.",
    learn: [
      "The prototype chain — what class actually is under the hood",
      "The four rules of this binding: implicit, explicit, new, arrow",
      "call, apply, and bind",
    ],
    code: `const user = {
  name: "Asha",
  greet() { console.log(\`Hi, I'm \${this.name}\`); },
};

const greetFn = user.greet;
greetFn();          <KW>// "Hi, I'm undefined" — lost its binding</KW>
user.greet();        <KW>// "Hi, I'm Asha" — called as a method</KW>
greetFn.call(user);  <KW>// "Hi, I'm Asha" — this restored explicitly</KW>`,
    build: "A tiny state-management library from scratch — subscribe() / publish(), ~40 lines. This teaches you what Redux or Zustand are doing underneath.",
    check: "Why does greetFn() lose its this binding, but user.greet() doesn't?",
  },
  {
    num: "08",
    title: "Testing & debugging like a professional",
    time: "Week 8",
    why: "This is the stage that's usually skipped entirely in beginner paths — and it's the single biggest tell of who's actually shipped production code.",
    learn: [
      "DevTools: breakpoints, conditional breakpoints, the network and performance tabs",
      "Writing unit tests with Vitest",
      "The TDD mindset — write the failing test first",
    ],
    code: `import { it, expect } from "vitest";
import { debounce } from "./debounce.js";

it("only calls fn once after rapid calls", async () => {
  let count = 0;
  const fn = debounce(() => count++, 100);
  fn(); fn(); fn();
  await new Promise(r => setTimeout(r, 150));
  expect(count).toBe(1);
});`,
    build: "Write real tests for the debounce, throttle, and state-library code you built in earlier stages.",
    check: "What's one real bug your debounce function might have that this test would catch — but clicking around manually never would?",
  },
];
