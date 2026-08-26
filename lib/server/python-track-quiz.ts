// Correct answers for the Python track quiz. Server-only.
//
// Mirrors lib/tracks/python-track.ts — same stages, same questions, plus the
// index of the right option and why it's right.

import type { ServerQuizQuestion } from "./quiz-registry";

export const PYTHON_TRACK_QUIZ: ServerQuizQuestion[] = [
  {
    stage: 0,
    question: "Why does Python not need a semicolon at the end of a line, and what takes its place as the thing that groups code?",
    options: [
      "Semicolons are optional everywhere in every language",
      "A newline ends a statement, and indentation — not braces — is what groups a block. Indentation is syntax in Python, not style",
      "Python uses braces like JavaScript",
      "The interpreter guesses",
    ],
    correctIndex: 1,
    explanation: "A newline ends a statement, and indentation — not braces — is what groups a block. Indentation is syntax in Python, not style",
  },
  {
    stage: 1,
    question: "What does `type(3) is type(3.0)` evaluate to, and why does it matter?",
    options: [
      "True — all numbers are one type",
      "False — `3` is an int and `3.0` is a float. Integer division, precision and how a value prints all follow from which one you have",
      "It raises an error",
      "True, but only in Python 2",
    ],
    correctIndex: 1,
    explanation: "False — `3` is an int and `3.0` is a float. Integer division, precision and how a value prints all follow from which one you have",
  },
  {
    stage: 2,
    question: "What's the difference between `7 / 2` and `7 // 2` in Python?",
    options: [
      "Nothing — both give 3.5",
      "`/` always gives a float (3.5); `//` floors to a whole number (3). Reaching for the wrong one is a classic off-by-one source in index maths",
      "`//` is a comment",
      "`//` raises an error on integers",
    ],
    correctIndex: 1,
    explanation: "`/` always gives a float (3.5); `//` floors to a whole number (3). Reaching for the wrong one is a classic off-by-one source in index maths",
  },
  {
    stage: 3,
    question: "Why is an f-string better than `\"Hi \" + name` for building text?",
    options: [
      "It's shorter to type and nothing more",
      "Expressions go inline and non-strings are converted for you — `+` raises TypeError the moment one side isn't a string",
      "f-strings are faster to parse",
      "They're identical",
    ],
    correctIndex: 1,
    explanation: "Expressions go inline and non-strings are converted for you — `+` raises TypeError the moment one side isn't a string",
  },
  {
    stage: 4,
    question: "Which of these is falsy in Python?",
    options: [
      "Any non-zero number",
      "`, `{}`, `None` and `False`. Every other object is truthy unless it says otherwise",
      "`",
      "A list containing zero: `[0]`",
    ],
    correctIndex: 1,
    explanation: "`, `{}`, `None` and `False`. Every other object is truthy unless it says otherwise",
  },
  {
    stage: 5,
    question: "What's the practical difference between a chain of `if` statements and `if / elif / else`?",
    options: [
      "None, elif is just shorthand",
      "Separate `if`s are all evaluated, so more than one branch can run; an `elif` chain stops at the first match, which is usually what you meant",
      "elif is faster",
      "elif can only be used once",
    ],
    correctIndex: 1,
    explanation: "Separate `if`s are all evaluated, so more than one branch can run; an `elif` chain stops at the first match, which is usually what you meant",
  },
  {
    stage: 6,
    question: "You pass a list to a function and the function appends to it. What does the caller see afterwards?",
    options: [
      "Nothing — the function got a copy",
      "The change. Lists are mutable and passed by reference, so a function that mutates its argument changes the caller's object too",
      "A TypeError",
      "A copy is made only for long lists",
    ],
    correctIndex: 1,
    explanation: "The change. Lists are mutable and passed by reference, so a function that mutates its argument changes the caller's object too",
  },
  {
    stage: 7,
    question: "Why is `for item in items:` usually better than looping over `range(len(items))`?",
    options: [
      "It's the same thing written differently",
      "It states the intent — you want each item — and removes the index arithmetic that off-by-one bugs live in. Use `enumerate` when you genuinely need the index too",
      "range is deprecated",
      "It's faster in every case",
    ],
    correctIndex: 1,
    explanation: "It states the intent — you want each item — and removes the index arithmetic that off-by-one bugs live in. Use `enumerate` when you genuinely need the index too",
  },
  {
    stage: 8,
    question: "What happens when you read a dictionary key that doesn't exist with `d[\"missing\"]` versus `d.get(\"missing\")`?",
    options: [
      "Both return None",
      "]` raises KeyError; `.get()` returns None (or a default you pass). Which you want depends on whether a missing key is a bug or an expected case",
      "Both raise KeyError",
      "`.get()` raises, brackets return None",
    ],
    correctIndex: 1,
    explanation: "]` raises KeyError; `.get()` returns None (or a default you pass). Which you want depends on whether a missing key is a bug or an expected case",
  },
  {
    stage: 9,
    question: "A function computes a value but the caller keeps getting `None`. What's missing?",
    options: [
      "A type hint",
      "`return` — a Python function without one implicitly returns None, no matter what it computed inside",
      "The function needs to be async",
      "A docstring",
    ],
    correctIndex: 1,
    explanation: "`return` — a Python function without one implicitly returns None, no matter what it computed inside",
  },
  {
    stage: 10,
    question: "Why is a mutable default argument like `def add(item, bucket=[])` a trap?",
    options: [
      "It's a style preference",
      "The default list is created once, when the function is defined — so every call that omits the argument shares and grows the same list",
      "Python forbids it",
      "It only matters with dictionaries",
    ],
    correctIndex: 1,
    explanation: "The default list is created once, when the function is defined — so every call that omits the argument shares and grows the same list",
  },
  {
    stage: 11,
    question: "What does `[n * 2 for n in nums if n > 0]` do, and when should you not use a comprehension?",
    options: [
      "It mutates nums in place",
      "It builds a new list of doubled positive numbers. Reach for a plain loop instead once the logic needs several statements — a comprehension you have to decode isn't an improvement",
      "It's slower than a loop in all cases",
      "It returns a generator",
    ],
    correctIndex: 1,
    explanation: "It builds a new list of doubled positive numbers. Reach for a plain loop instead once the logic needs several statements — a comprehension you have to decode isn't an improvement",
  },
  {
    stage: 12,
    question: "What does `if __name__ == \"__main__\":` actually guard against?",
    options: [
      "Nothing, it's boilerplate",
      "Code running on import. The block runs only when the file is executed directly, so importing the module for its functions doesn't also fire its script behaviour",
      "Syntax errors",
      "Circular imports",
    ],
    correctIndex: 1,
    explanation: "Code running on import. The block runs only when the file is executed directly, so importing the module for its functions doesn't also fire its script behaviour",
  },
  {
    stage: 13,
    question: "Why open a file with `with open(path) as f:` rather than `f = open(path)`?",
    options: [
      "It's shorter",
      "`with` closes the file even if the block raises, which a bare `open` doesn't — leaked handles are the kind of bug that only shows up under load",
      "It's the only way to read files",
      "It makes reading faster",
    ],
    correctIndex: 1,
    explanation: "`with` closes the file even if the block raises, which a bare `open` doesn't — leaked handles are the kind of bug that only shows up under load",
  },
  {
    stage: 14,
    question: "What's wrong with `except:` on its own?",
    options: [
      "Nothing, it's the safe choice",
      "It swallows everything — including KeyboardInterrupt and genuine programming errors — so real bugs disappear silently. Catch the exception you actually expect",
      "It's a syntax error",
      "It only catches ValueError",
    ],
    correctIndex: 1,
    explanation: "It swallows everything — including KeyboardInterrupt and genuine programming errors — so real bugs disappear silently. Catch the exception you actually expect",
  },
  {
    stage: 15,
    question: "What is `self` in a Python method?",
    options: [
      "A reserved keyword the interpreter injects",
      "Just the first parameter, by convention named `self`, holding the instance the method was called on — Python passes it explicitly where other languages hide it",
      "A copy of the class",
      "The parent class",
    ],
    correctIndex: 1,
    explanation: "Just the first parameter, by convention named `self`, holding the instance the method was called on — Python passes it explicitly where other languages hide it",
  },
  {
    stage: 16,
    question: "Why create a virtual environment per project instead of installing packages globally?",
    options: [
      "It's faster",
      "Projects pin different, often conflicting versions. A venv gives each one its own site-packages, so upgrading a library for one project can't break another",
      "pip requires it",
      "It reduces disk usage",
    ],
    correctIndex: 1,
    explanation: "Projects pin different, often conflicting versions. A venv gives each one its own site-packages, so upgrading a library for one project can't break another",
  },
  {
    stage: 17,
    question: "You call an API and get a 200 response, but `response.json()` raises. What's the most likely cause?",
    options: [
      "The API is down",
      "The body isn't JSON — an HTML error page, an empty body, or a different content type. A 200 status says the request arrived, not that the body is what you assumed",
      "You need to await it",
      "The API key is wrong",
    ],
    correctIndex: 1,
    explanation: "The body isn't JSON — an HTML error page, an empty body, or a different content type. A 200 status says the request arrived, not that the body is what you assumed",
  },
  {
    stage: 18,
    question: "Why does the AI ecosystem care so much about iterating over data in batches rather than one item at a time?",
    options: [
      "It looks tidier",
      "Every API call and model pass has fixed overhead. Batching amortises it, and it's also where rate limits, cost and memory pressure are actually controlled",
      "One at a time is impossible",
      "Batches are more accurate",
    ],
    correctIndex: 1,
    explanation: "Every API call and model pass has fixed overhead. Batching amortises it, and it's also where rate limits, cost and memory pressure are actually controlled",
  },
];
