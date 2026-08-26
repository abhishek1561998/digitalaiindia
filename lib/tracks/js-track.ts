// Shared content for the JavaScript track — used by both the curriculum
// overview page (/learn/javascript) and the course stepper
// (/learn/javascript/course), so the two never drift out of sync.

import type { Stage, QuizQuestion } from "./types";

// Client-safe quiz questions (no correct answers — those stay server-side
// in lib/server/js-track-quiz.ts and are checked via /api/learn/answer).
export const JS_QUIZ_QUESTIONS: QuizQuestion[] = [
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

export const JS_STAGES: Stage[] = [
  {
    num: "00",
    title: "Where your code actually runs",
    time: "8 min",
    why: "Before syntax, one idea: JavaScript is a set of instructions, and something has to read them. Knowing what that something is — a browser tab, or Node on a server — explains most of the confusion beginners hit in their first week.",
    learn: [
      "What a program actually is: instructions, run in order, by an engine",
      "The two places JavaScript runs — the browser and Node — and what changes between them",
      "console.log: how you get the machine to tell you what it's thinking",
    ],
    code: `console.log("Hello");
console.log("This runs second");

<KW>// Everything runs top to bottom, one line at a time.</KW>
<KW>// console.log doesn't change anything — it just reports.</KW>

console.log(2 + 2);   <KW>// 4 — it evaluates first, then prints</KW>`,
    build: "Open your browser's console (right-click, Inspect, Console) and print your own name. Then print a sum. That's a program.",
    check: "If a file has three console.log lines, in what order do they print — and why is that not obvious?",
  },
  {
    num: "01",
    title: "Giving values names",
    time: "10 min",
    why: "A program that can't remember anything can't do much. A variable is a name pointing at a value, and the difference between `let` and `const` is the first real decision you'll make in every file you write.",
    learn: [
      "let for values that change, const for values that don't",
      "Why const is the sensible default, and what it actually protects",
      "Naming: why a good name saves more time than a clever line of code",
    ],
    code: `const name = "Abhishek";   <KW>// won't be reassigned</KW>
let score = 0;             <KW>// will be</KW>

score = score + 10;
console.log(name, score);  <KW>// Abhishek 10</KW>

<KW>// name = "someone else";  ← TypeError: Assignment to constant</KW>`,
    build: "Make three constants about yourself and one let that you change twice. Print the result after each change.",
    check: "When would you reach for let instead of const, and why is const the better starting point?",
  },
  {
    num: "02",
    title: "Numbers that don't add up",
    time: "10 min",
    why: "Every counter, price, score and progress bar is arithmetic. The operators are obvious; the two things that catch people out are the remainder operator and the fact that decimals aren't exact.",
    learn: [
      "The five operators: + - * / and % (remainder)",
      "Why 0.1 + 0.2 isn't 0.3, and when that actually matters",
      "Turning a string like \"42\" into a real number",
    ],
    code: `const total = 7;
const perPage = 3;

console.log(total / perPage);   <KW>// 2.333...</KW>
console.log(total % perPage);   <KW>// 1 — what's left over</KW>

console.log(0.1 + 0.2);         <KW>// 0.30000000000000004</KW>
<KW>// Floats are approximations. Fine for a progress bar, not for money.</KW>

console.log(Number("42") + 1);  <KW>// 43</KW>
console.log("42" + 1);          <KW>// "421" — that's string joining</KW>`,
    build: "Write a snippet that takes a number of minutes and prints it as hours and minutes, using / and %.",
    check: "What does 7 % 3 give you, and what's a real situation where you'd want that instead of 7 / 3?",
  },
  {
    num: "03",
    title: "Text you can shape",
    time: "10 min",
    why: "Most of what a user sees is text you assembled. Template literals make that readable instead of a mess of plus signs, and the handful of string methods below cover almost everything you'll do to text.",
    learn: [
      "Template literals: backticks and ${} instead of concatenation",
      "length, toUpperCase, trim, includes, split — the ones you'll actually use",
      "Strings are immutable: methods return a new string, they don't edit the old one",
    ],
    code: `const first = "Abhishek";
const city = "Dehradun";

<KW>// Hard to read:</KW>
const a = "Hi " + first + ", from " + city + "!";

<KW>// Same thing, readable:</KW>
const b = \`Hi \${first}, from \${city}!\`;

console.log(b.toUpperCase());   <KW>// a NEW string</KW>
console.log(b);                 <KW>// unchanged</KW>
console.log(city.includes("Dehra"));  <KW>// true</KW>`,
    build: "Take a full name in one string and print the initials — split it, take the first letter of each part, and join them.",
    check: "After calling toUpperCase() on a string, why is the original variable still lowercase?",
  },
  {
    num: "04",
    title: "Comparing two things",
    time: "10 min",
    why: "Every decision a program makes comes down to a boolean. The trap here is JavaScript's willingness to compare things of different types — which is why one comparison operator is safe and the other quietly isn't.",
    learn: [
      "=== and !== compare without converting; == and != convert first",
      "Which values are 'falsy': 0, \"\", null, undefined, NaN, false",
      "&& and || — and how they short-circuit",
    ],
    code: `console.log(5 === 5);      <KW>// true</KW>
console.log("5" === 5);    <KW>// false — different types</KW>
console.log("5" == 5);     <KW>// true — == converted "5" to 5</KW>

<KW>// Use === unless you have a specific reason not to.</KW>

const name = "";
console.log(Boolean(name)); <KW>// false — empty string is falsy</KW>

const isReady = true && "go";   <KW>// "go"</KW>
const fallback = "" || "default"; <KW>// "default"</KW>`,
    build: "Write a check that treats an empty name and a name of only spaces as equally invalid. (Hint: trim first.)",
    check: "Why is === the safer default, and what is == actually doing before it compares?",
  },
  {
    num: "05",
    title: "Making the code choose",
    time: "10 min",
    why: "This is where a program stops being a list and starts being a decision. Most beginner bugs at this stage aren't syntax — they're conditions that are subtly wrong, so learn to read one out loud before you trust it.",
    learn: [
      "if / else if / else, and why order matters",
      "The ternary — a one-line if that returns a value",
      "Early return: leaving a function as soon as you know the answer",
    ],
    code: `const score = 72;

if (score >= 90) {
  console.log("Excellent");
} else if (score >= 60) {
  console.log("Passed");     <KW>// this one runs</KW>
} else {
  console.log("Try again");
}

<KW>// Same decision, as a value:</KW>
const label = score >= 60 ? "Passed" : "Try again";

<KW>// Early return keeps the happy path un-indented:</KW>
function grade(n) {
  if (n < 0) return "Invalid";
  return n >= 60 ? "Passed" : "Try again";
}`,
    build: "Write a function that turns a score out of 100 into a grade, and handle a negative or missing score before anything else.",
    check: "If you swap the first two branches of the chain above, what breaks — and why?",
  },
  {
    num: "06",
    title: "Doing it a thousand times",
    time: "12 min",
    why: "Anything you'd copy-paste is a loop. Once you can see the shape — start, condition, step — you'll spot it everywhere, and you'll stop writing the same three lines five times.",
    learn: [
      "for: when you know how many times, and for...of: when you just want each item",
      "while: when the end depends on something you discover",
      "break and continue, and why an infinite loop happens",
    ],
    code: `<KW>// Three parts: where to start, when to stop, how to step.</KW>
for (let i = 0; i < 3; i++) {
  console.log(i);   <KW>// 0, 1, 2</KW>
}

const names = ["Asha", "Ravi", "Meera"];
for (const n of names) {
  if (n === "Ravi") continue;   <KW>// skip this one</KW>
  console.log(n);
}

let left = 3;
while (left > 0) {
  left--;           <KW>// forget this line and it never ends</KW>
}`,
    build: "Print a times table for a number of your choice, 1 through 10, using a for loop.",
    check: "What is the one line in a while loop that, if you forget it, hangs the page — and why?",
  },
  {
    num: "07",
    title: "Naming a job",
    time: "12 min",
    why: "A function is how you stop repeating yourself and start naming ideas. The habit worth building now: one function, one job, and a name that says what it returns.",
    learn: [
      "Parameters and arguments, and default values",
      "return: why a function without it gives you undefined",
      "Arrow functions, and when the shorter form is genuinely clearer",
    ],
    code: `function greet(name, greeting = "Hi") {
  return \`\${greeting}, \${name}!\`;
}

console.log(greet("Asha"));          <KW>// Hi, Asha!</KW>
console.log(greet("Ravi", "Namaste"));

<KW>// No return means undefined comes back:</KW>
function silent(n) { n * 2; }
console.log(silent(4));              <KW>// undefined</KW>

<KW>// Same function, arrow form:</KW>
const double = (n) => n * 2;`,
    build: "Write a function that takes a price and a discount percent and returns the final price. Give the discount a sensible default.",
    check: "A function does its calculation but the caller keeps getting undefined. What's the one missing keyword?",
  },
  {
    num: "08",
    title: "Lists",
    time: "12 min",
    why: "Almost all real data is a list: rows, messages, products, search results. Arrays are how you hold one, and the indexing-from-zero convention is the source of a genuinely large share of off-by-one bugs.",
    learn: [
      "Index from 0, .length, and why the last item is length - 1",
      "push, pop, shift, unshift — adding and removing at each end",
      "indexOf, includes, slice — finding and copying without mutating",
    ],
    code: `const tasks = ["write", "test", "ship"];

console.log(tasks[0]);              <KW>// "write"</KW>
console.log(tasks[tasks.length - 1]); <KW>// "ship"</KW>
console.log(tasks[3]);              <KW>// undefined — not an error</KW>

tasks.push("deploy");               <KW>// adds to the end, changes the array</KW>
const firstTwo = tasks.slice(0, 2); <KW>// copies, leaves tasks alone</KW>

console.log(tasks.includes("test")); <KW>// true</KW>`,
    build: "Build a small to-do list: add three items, remove the middle one, and print what's left with a loop.",
    check: "An array has 4 items. What's the index of the last one, and what do you get if you ask for index 4?",
  },
  {
    num: "09",
    title: "Data with names on it",
    time: "12 min",
    why: "An array holds a list; an object holds one thing with named parts. Nearly every API response you'll ever handle is objects inside arrays, so this is the shape you'll be reading for the rest of your career.",
    learn: [
      "Key–value pairs, dot access, and bracket access when the key is a variable",
      "Nesting: objects inside arrays inside objects",
      "Optional chaining (?.) so a missing key doesn't crash the page",
    ],
    code: `const user = {
  name: "Asha",
  city: "Pune",
  skills: ["JS", "CSS"],
};

console.log(user.name);        <KW>// "Asha"</KW>
const key = "city";
console.log(user[key]);        <KW>// "Pune" — bracket, because key is a variable</KW>

console.log(user.address.pin);   <KW>// TypeError — address is undefined</KW>
console.log(user.address?.pin);  <KW>// undefined — safe</KW>

user.skills.push("React");`,
    build: "Model yourself as an object with a nested object inside it, then print one value from the nested part safely.",
    check: "When must you use bracket access instead of a dot — and what does ?. save you from?",
  },
  {
    num: "10",
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
    num: "11",
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
    num: "12",
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
    num: "13",
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
    num: "14",
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
    num: "15",
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
    num: "16",
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
    num: "17",
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
    num: "18",
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
