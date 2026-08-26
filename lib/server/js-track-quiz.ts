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
    question: "A file has three `console.log` lines. In what order do they print?",
    options: [
      "In whatever order the engine decides is fastest",
      "Top to bottom, one line at a time — the engine runs statements in the order they appear",
      "Alphabetically by the text being printed",
      "All at once, so the order is unpredictable",
    ],
    correctIndex: 1,
    explanation: "JavaScript runs statements in source order. That sounds too obvious to state, but it's the assumption every later idea — hoisting, the event loop, async — is a departure from, so it's worth naming.",
  },
  {
    stage: 1,
    question: "Why is `const` a better default than `let`?",
    options: [
      "const is faster at runtime",
      "It says the name won't be pointed at something else, so a reader knows the value is stable — and reassigning it by accident becomes an error instead of a bug",
      "let is deprecated",
      "const uses less memory",
    ],
    correctIndex: 1,
    explanation: "const doesn't freeze the value — you can still push to a const array. What it fixes is the binding, which is what makes accidental reassignment loud instead of silent.",
  },
  {
    stage: 2,
    question: "What does `7 % 3` give you, and when is that what you want?",
    options: [
      "2.333 — it's just division",
      "1 — the remainder. It's how you get 'what's left over': pages, rows in a grid, minutes past the hour",
      "21 — it's a percentage",
      "0 — % only works on even numbers",
    ],
    correctIndex: 1,
    explanation: "% gives the remainder after division. It's the operator behind pagination, alternating row colours, and converting a total in minutes into hours plus minutes.",
  },
  {
    stage: 3,
    question: "You call `.toUpperCase()` on a string, but the original variable is still lowercase. Why?",
    options: [
      "You forgot to save the file",
      "Strings are immutable — every string method returns a new string and leaves the original untouched",
      "toUpperCase only works on template literals",
      "It's a bug in the browser",
    ],
    correctIndex: 1,
    explanation: "Nothing in JavaScript edits a string in place. Methods hand you a new one, which is why you have to assign the result somewhere for it to matter.",
  },
  {
    stage: 4,
    question: "Why does `\"5\" == 5` come out true while `\"5\" === 5` comes out false?",
    options: [
      "They're the same, one is just older syntax",
      "== converts one side before comparing, so the string becomes a number; === compares type as well as value, and the types differ",
      "=== is broken for numbers",
      "== only works on strings",
    ],
    correctIndex: 1,
    explanation: "== runs a coercion step first, and the rules for that step are long and surprising. === skips it entirely, which is why it's the default worth reaching for.",
  },
  {
    stage: 5,
    question: "In an `if / else if` chain testing `score >= 90` then `score >= 60`, what happens if you swap the two branches?",
    options: [
      "Nothing — order doesn't matter",
      "Every score of 90 or more now matches `>= 60` first, so nobody ever reaches the 'Excellent' branch",
      "It throws a syntax error",
      "Both branches run",
    ],
    correctIndex: 1,
    explanation: "A chain stops at the first branch that matches. Broader conditions must come last, or they swallow the narrower ones above them.",
  },
  {
    stage: 6,
    question: "Which missing line turns a `while` loop into a hung page?",
    options: [
      "The console.log",
      "The line that changes the variable the condition tests — without it the condition stays true forever",
      "The opening brace",
      "The semicolon after while",
    ],
    correctIndex: 1,
    explanation: "A while loop only ends when its condition goes false. If nothing inside the body moves the loop towards that, the browser's single thread never gets back to rendering.",
  },
  {
    stage: 7,
    question: "A function does its calculation, but the caller keeps getting `undefined`. What's missing?",
    options: [
      "A semicolon",
      "`return` — a function that doesn't return anything hands back undefined, however much work it did inside",
      "The function needs to be async",
      "The parameters need default values",
    ],
    correctIndex: 1,
    explanation: "Computing a value and returning it are two separate things. Without return, the result is calculated and then thrown away.",
  },
  {
    stage: 8,
    question: "An array has 4 items. What's the index of the last one, and what do you get for index 4?",
    options: [
      "4, and index 4 throws an error",
      "3, and index 4 gives `undefined` — reading past the end is quietly allowed",
      "4, and index 4 gives the first item",
      "3, and index 4 gives null",
    ],
    correctIndex: 1,
    explanation: "Indexes start at 0, so the last is length - 1. Reading past the end doesn't throw — it returns undefined, which is why off-by-one bugs surface later and somewhere else.",
  },
  {
    stage: 9,
    question: "When do you have to use bracket access instead of a dot, and what does `?.` protect you from?",
    options: [
      "Brackets are just an older style; ?. does nothing",
      "Brackets when the key is held in a variable or isn't a valid identifier; ?. stops a missing intermediate value from throwing when you reach through it",
      "Brackets only work on arrays",
      "?. converts undefined into an empty string",
    ],
    correctIndex: 1,
    explanation: "`user.key` looks for a property literally named \"key\". `user[key]` uses the variable's value. And `user.address.pin` throws when address is undefined, where `user.address?.pin` simply gives you undefined.",
  },
  {
    stage: 10,
    question: "What does console.log(a) print, given `console.log(a); var a = 5;`?",
    options: ["5", "undefined", "ReferenceError", "null"],
    correctIndex: 1,
    explanation: "var declarations are hoisted to the top of their scope, but the assignment (a = 5) stays where it is — so a exists but is still undefined at that point.",
  },
  {
    stage: 11,
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
    stage: 12,
    question: "If you call debounce(fn, 300) three times within 100ms of each other, how many times does fn run?",
    options: ["3 times", "0 times", "1 time, after the last call", "1 time, immediately on the first call"],
    correctIndex: 2,
    explanation: "Each call resets the timer via clearTimeout. Only the last call's timer survives to actually fire, 300ms after that last call.",
  },
  {
    stage: 13,
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
    stage: 14,
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
    stage: 15,
    question: "In `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);` — what's the logged order?",
    options: ["1, 2, 3, 4", "1, 4, 3, 2", "1, 4, 2, 3", "4, 1, 3, 2"],
    correctIndex: 1,
    explanation: "Synchronous code runs first (1, 4), then the microtask queue (Promises) before the macrotask queue (setTimeout) — even at 0ms delay.",
  },
  {
    stage: 16,
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
    stage: 17,
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
    stage: 18,
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
