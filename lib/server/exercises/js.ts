// Exercises for the JavaScript track, with answers. Server-only.
//
// Each lesson carries two or three, and the player interleaves them with the
// explanation. The wrong options in a `predict` are deliberately the answers
// people actually give — "421" for string concatenation, "5" for hoisting —
// because an exercise whose distractors are obviously silly teaches nothing.

import type { TrackExercises } from "../exercise-registry";

export const JS_EXERCISES: TrackExercises = {
  0: [
    {
      kind: "predict",
      prompt: "Read it, decide, then check. What does this print?",
      code: 'console.log("A");\nconsole.log(1 + 1);\nconsole.log("B");',
      options: ["A\\n2\\nB", "A\\nB\\n2", "A\\n11\\nB", "Nothing — console.log isn't a function"],
      correctIndex: 0,
      explanation:
        "Statements run top to bottom, and `1 + 1` is evaluated before it's printed. That sounds too obvious to state — but every later surprise in this language is a departure from it, so it's worth being certain about now.",
    },
  ],
  1: [
    {
      kind: "predict",
      prompt: "What happens on the last line?",
      code: 'const city = "Pune";\ncity = "Mumbai";\nconsole.log(city);',
      options: [
        "TypeError: Assignment to constant variable",
        '"Mumbai" — const only stops redeclaring',
        '"Pune" — the assignment is silently ignored',
        "SyntaxError on line 1",
      ],
      correctIndex: 0,
      explanation:
        "`const` fixes the binding, so pointing the name at something else throws. Note what it does *not* do: a const array can still be pushed to, because that changes the object, not which object the name points at.",
    },
    {
      kind: "fill",
      prompt: "Pick the right keyword for each. One changes, one doesn't.",
      template: "{0} PI = 3.14159;\n{1} attempts = 0;\nattempts = attempts + 1;",
      tiles: ["const", "let", "var"],
      answers: ["const", "let"],
      explanation:
        "PI never changes, so const. `attempts` is reassigned on the next line, so it has to be let — const would throw there.",
    },
  ],
  2: [
    {
      kind: "predict",
      prompt: "This one catches nearly everybody. What prints?",
      code: 'console.log("42" + 1);\nconsole.log("42" - 1);',
      options: ["43\\n41", '"421"\\n41', '"421"\\n"421"', "43\\n43"],
      correctIndex: 1,
      explanation:
        "`+` is overloaded: with a string on either side it joins instead of adding, so you get \"421\". `-` has no string meaning, so it converts and gives 41. That asymmetry is exactly why `+` on untrusted input is a bug waiting to happen.",
    },
    {
      kind: "fill",
      prompt: "Turn minutes into hours and leftover minutes.",
      template: "const hours = total {0} 60;\nconst mins  = total {1} 60;",
      tiles: ["/", "%", "*", "//"],
      answers: ["/", "%"],
      explanation:
        "`/` gives how many whole hours fit (before flooring), `%` gives what's left over. JavaScript has no `//` operator — that's Python.",
    },
  ],
  3: [
    {
      kind: "predict",
      prompt: "What does the second line print?",
      code: 'const name = "asha";\nname.toUpperCase();\nconsole.log(name);',
      options: ['"ASHA"', '"asha"', "undefined", "TypeError — name is const"],
      correctIndex: 1,
      explanation:
        "Strings are immutable. `toUpperCase()` returns a new string and throws it away here, because nothing captured the result. You have to assign it somewhere for it to matter.",
    },
  ],
  4: [
    {
      kind: "predict",
      prompt: "Two comparisons, one difference.",
      code: 'console.log("5" == 5);\nconsole.log("5" === 5);',
      options: ["true\\nfalse", "false\\nfalse", "true\\ntrue", "false\\ntrue"],
      correctIndex: 0,
      explanation:
        "`==` coerces first — the string becomes a number, so they match. `===` compares type as well as value, and a string is never a number. This is the whole reason `===` is the default worth reaching for.",
    },
    {
      kind: "spot",
      prompt: "One line here treats an empty name as valid. Which?",
      lines: [
        "function isValid(name) {",
        "  if (name == null) return false;",
        "  if (name) return true;",
        "  return false;",
        "}",
      ],
      buggyLine: 2,
      explanation:
        "Line 3 looks right but a string of spaces is truthy, so \"   \" passes. It needs `name.trim()` — the check that reads most naturally is the one that lets whitespace through.",
    },
  ],
  5: [
    {
      kind: "predict",
      prompt: "The branches are in this order. What prints for a score of 95?",
      code: 'const score = 95;\nif (score >= 60) console.log("Passed");\nelse if (score >= 90) console.log("Excellent");',
      options: ['"Excellent"', '"Passed"', "Both lines print", "Nothing"],
      correctIndex: 1,
      explanation:
        "A chain stops at the first branch that matches, and 95 matches `>= 60`. The `>= 90` branch is now unreachable for every score. Broader conditions must come last, or they swallow the narrower ones.",
    },
  ],
  6: [
    {
      kind: "predict",
      prompt: "How many numbers does this print, and which?",
      code: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}",
      options: ["0, 1, 2", "1, 2, 3", "0, 1, 2, 3", "1, 2"],
      correctIndex: 0,
      explanation:
        "It starts at 0 and stops *before* 3, so three numbers: 0, 1, 2. Reading `i < 3` as \"up to but not including 3\" is the habit that prevents most off-by-one bugs.",
    },
    {
      kind: "spot",
      prompt: "This loop never ends. Which line is responsible?",
      lines: [
        "let left = 3;",
        "while (left > 0) {",
        '  console.log("tick");',
        "}",
      ],
      buggyLine: 2,
      explanation:
        "Nothing inside the loop changes `left`, so the condition stays true forever. Line 3 is where the decrement should have been — a while loop needs its body to move the condition towards false.",
    },
  ],
  7: [
    {
      kind: "predict",
      prompt: "What comes back from this call?",
      code: "function double(n) {\n  n * 2;\n}\nconsole.log(double(4));",
      options: ["8", "undefined", "null", "NaN"],
      correctIndex: 1,
      explanation:
        "The multiplication happens and the result is discarded — there's no `return`. Computing a value and handing it back are two separate things, and forgetting the second is the single most common beginner bug.",
    },
    {
      kind: "fill",
      prompt: "Complete the function so it returns a greeting with a default.",
      template: 'function greet(name, greeting {0} "Hi") {\n  {1} `${greeting}, ${name}!`;\n}',
      tiles: ["=", "return", ":", "=>"],
      answers: ["=", "return"],
      explanation:
        "`=` sets a default parameter, and `return` hands the string back. Without the return you get undefined however good the template literal is.",
    },
  ],
  8: [
    {
      kind: "predict",
      prompt: "The array has four items. What does the last line print?",
      code: 'const t = ["a", "b", "c", "d"];\nconsole.log(t.length);\nconsole.log(t[4]);',
      options: ["4\\nundefined", "4\\nRangeError", "3\\nundefined", '4\\n"d"'],
      correctIndex: 0,
      explanation:
        "Length is 4, but indexes run 0-3, so index 4 is past the end. JavaScript doesn't throw for that — it returns undefined, which is why off-by-one bugs surface later and somewhere else entirely.",
    },
  ],
  9: [
    {
      kind: "predict",
      prompt: "The user has no address. What happens?",
      code: 'const user = { name: "Asha" };\nconsole.log(user.address?.pin);',
      options: ["undefined", "TypeError: Cannot read properties of undefined", "null", 'Empty string'],
      correctIndex: 0,
      explanation:
        "`?.` short-circuits: the moment `user.address` is undefined it stops and yields undefined instead of trying to read `.pin` from nothing. Drop the `?.` and that same line throws.",
    },
  ],
  10: [
    {
      kind: "fill",
      prompt: "Complete the line that logs a value declared later in the same scope.",
      template: "console.log(a);\n{0} a = 5;",
      tiles: ["var", "const", "let", "return"],
      answers: ["var"],
      explanation: "`var` declarations are hoisted and initialised to `undefined`, so reading `a` before the assignment logs `undefined`. `let` and `const` are hoisted too, but stay in the temporal dead zone until the declaration runs — reading them first throws a ReferenceError.",
    },
  ],
  12: [
    {
      kind: "fill",
      prompt: "Complete the counter so each call remembers the previous count.",
      template: "function makeCounter() {\n  let n = 0;\n  {0} function () {\n    return {1}n;\n  };\n}",
      tiles: ["return", "++", "const", "--"],
      answers: ["return", "++"],
      explanation: "The inner function closes over `n`, so returning it keeps `n` alive between calls. `++n` increments first and returns the new value — the closure is what makes the count persist, not the operator.",
    },
    {
      kind: "predict",
      prompt: "Each call to the returned function does what?",
      code: "function makeCounter() {\n  let n = 0;\n  return () => ++n;\n}\nconst next = makeCounter();\nconsole.log(next(), next(), next());",
      options: ["1 1 1", "1 2 3", "0 1 2", "undefined undefined undefined"],
      correctIndex: 1,
      explanation:
        "The inner function closes over `n`, so `n` survives between calls instead of being recreated. That persistence is the closure — the arrow syntax has nothing to do with it.",
    },
  ],
  13: [
    {
      kind: "fill",
      prompt: "Complete the expression that doubles every number in the array.",
      template: "const doubled = nums.{0}((n) => n {1} 2);",
      tiles: ["filter", "map", "+", "*", "reduce"],
      answers: ["map", "*"],
      explanation: "`map` returns a new array of the same length with each element transformed. `filter` would keep or drop elements rather than change them, and `reduce` would collapse the array to a single value.",
    },
    {
      kind: "fill",
      prompt: "Complete the expression that doubles every number.",
      template: "const doubled = nums.{0}((n) => n {1} 2);",
      tiles: ["filter", "map", "+", "*", "reduce"],
      answers: ["map", "*"],
      explanation:
        "`map` returns a new array of the same length with each element transformed. `filter` keeps or drops elements rather than changing them, and `reduce` collapses the array to a single value.",
    },
  ],
  14: [
    {
      kind: "fill",
      prompt: "One handler, every row. Complete the delegation.",
      template: 'list.addEventListener("click", (e) => {\n  const row = e.{0}.closest("li");\n  if (row) select(row);\n});',
      tiles: ["target", "currentTarget", "parentNode", "detail"],
      answers: ["target"],
      explanation:
        "`e.target` is the element actually clicked, so `closest(\"li\")` walks up from it to the row. `e.currentTarget` is always the list itself, which would defeat the delegation.",
    },
  ],
  15: [
    {
      kind: "predict",
      prompt: "The second await is missing. What comes back?",
      code: "async function load(url) {\n  const res = await fetch(url);\n  return res.json();\n}\nconst data = await load(u);\nconsole.log(typeof data);",
      options: ['"object" — it works fine', '"object", but only because of the outer await', '"undefined"', "It throws"],
      correctIndex: 1,
      explanation:
        "`res.json()` returns a promise, and returning a promise from an async function makes the outer `await` resolve it — so this happens to work. Remove the caller's await and you get a pending promise instead of data.",
    },
  ],
  17: [
    {
      kind: "fill",
      prompt: "Make `this` survive being passed around.",
      template: "class Timer {\n  constructor() {\n    this.tick = this.tick.{0}(this);\n  }\n}",
      tiles: ["bind", "call", "apply", "valueOf"],
      answers: ["bind"],
      explanation:
        "`bind` returns a new function permanently attached to `this`, which is what you want when the method is handed to something else to call later. `call` and `apply` invoke it immediately instead.",
    },
  ],
  18: [
    {
      kind: "spot",
      prompt: "This test passes no matter what add() returns. Which line is the problem?",
      lines: [
        'test("adds", () => {',
        "  const result = add(2, 2);",
        "  result === 4;",
        "});",
      ],
      buggyLine: 2,
      explanation:
        "Line 3 computes a boolean and discards it — nothing asserts. It needs `expect(result).toBe(4)`. A test that cannot fail is worse than no test, because it reports green.",
    },
  ],
};
