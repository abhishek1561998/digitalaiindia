// Shared content for the Python track — the foundation for AI engineering.
//
// The arc deliberately ends where the AI track begins: virtual environments,
// HTTP, JSON and iterating over data are exactly what the first AI lesson
// assumes you already have.

import type { Stage, QuizQuestion } from "./types";

export const PYTHON_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why does Python not need a semicolon at the end of a line, and what takes its place as the thing that groups code?", options: ["Semicolons are optional everywhere in every language", "A newline ends a statement, and indentation — not braces — is what groups a block. Indentation is syntax in Python, not style", "Python uses braces like JavaScript", "The interpreter guesses"] },
  { stage: 1, question: "What does `type(3) is type(3.0)` evaluate to, and why does it matter?", options: ["True — all numbers are one type", "False — `3` is an int and `3.0` is a float. Integer division, precision and how a value prints all follow from which one you have", "It raises an error", "True, but only in Python 2"] },
  { stage: 2, question: "What's the difference between `7 / 2` and `7 // 2` in Python?", options: ["Nothing — both give 3.5", "`/` always gives a float (3.5); `//` floors to a whole number (3). Reaching for the wrong one is a classic off-by-one source in index maths", "`//` is a comment", "`//` raises an error on integers"] },
  { stage: 3, question: "Why is an f-string better than `\"Hi \" + name` for building text?", options: ["It's shorter to type and nothing more", "Expressions go inline and non-strings are converted for you — `+` raises TypeError the moment one side isn't a string", "f-strings are faster to parse", "They're identical"] },
  { stage: 4, question: "Which of these is falsy in Python?", options: ["Any non-zero number", "An empty list `[]` — along with `0`, `\"\"`, `{}`, `None` and `False`. Every other object is truthy unless it says otherwise", "The string `\"False\"`", "A list containing zero: `[0]`"] },
  { stage: 5, question: "What's the practical difference between a chain of `if` statements and `if / elif / else`?", options: ["None, elif is just shorthand", "Separate `if`s are all evaluated, so more than one branch can run; an `elif` chain stops at the first match, which is usually what you meant", "elif is faster", "elif can only be used once"] },
  { stage: 6, question: "You pass a list to a function and the function appends to it. What does the caller see afterwards?", options: ["Nothing — the function got a copy", "The change. Lists are mutable and passed by reference, so a function that mutates its argument changes the caller's object too", "A TypeError", "A copy is made only for long lists"] },
  { stage: 7, question: "Why is `for item in items:` usually better than looping over `range(len(items))`?", options: ["It's the same thing written differently", "It states the intent — you want each item — and removes the index arithmetic that off-by-one bugs live in. Use `enumerate` when you genuinely need the index too", "range is deprecated", "It's faster in every case"] },
  { stage: 8, question: "What happens when you read a dictionary key that doesn't exist with `d[\"missing\"]` versus `d.get(\"missing\")`?", options: ["Both return None", "`d[\"missing\"]` raises KeyError; `.get()` returns None (or a default you pass). Which you want depends on whether a missing key is a bug or an expected case", "Both raise KeyError", "`.get()` raises, brackets return None"] },
  { stage: 9, question: "A function computes a value but the caller keeps getting `None`. What's missing?", options: ["A type hint", "`return` — a Python function without one implicitly returns None, no matter what it computed inside", "The function needs to be async", "A docstring"] },
  { stage: 10, question: "Why is a mutable default argument like `def add(item, bucket=[])` a trap?", options: ["It's a style preference", "The default list is created once, when the function is defined — so every call that omits the argument shares and grows the same list", "Python forbids it", "It only matters with dictionaries"] },
  { stage: 11, question: "What does `[n * 2 for n in nums if n > 0]` do, and when should you not use a comprehension?", options: ["It mutates nums in place", "It builds a new list of doubled positive numbers. Reach for a plain loop instead once the logic needs several statements — a comprehension you have to decode isn't an improvement", "It's slower than a loop in all cases", "It returns a generator"] },
  { stage: 12, question: "What does `if __name__ == \"__main__\":` actually guard against?", options: ["Nothing, it's boilerplate", "Code running on import. The block runs only when the file is executed directly, so importing the module for its functions doesn't also fire its script behaviour", "Syntax errors", "Circular imports"] },
  { stage: 13, question: "Why open a file with `with open(path) as f:` rather than `f = open(path)`?", options: ["It's shorter", "`with` closes the file even if the block raises, which a bare `open` doesn't — leaked handles are the kind of bug that only shows up under load", "It's the only way to read files", "It makes reading faster"] },
  { stage: 14, question: "What's wrong with `except:` on its own?", options: ["Nothing, it's the safe choice", "It swallows everything — including KeyboardInterrupt and genuine programming errors — so real bugs disappear silently. Catch the exception you actually expect", "It's a syntax error", "It only catches ValueError"] },
  { stage: 15, question: "What is `self` in a Python method?", options: ["A reserved keyword the interpreter injects", "Just the first parameter, by convention named `self`, holding the instance the method was called on — Python passes it explicitly where other languages hide it", "A copy of the class", "The parent class"] },
  { stage: 16, question: "Why create a virtual environment per project instead of installing packages globally?", options: ["It's faster", "Projects pin different, often conflicting versions. A venv gives each one its own site-packages, so upgrading a library for one project can't break another", "pip requires it", "It reduces disk usage"] },
  { stage: 17, question: "You call an API and get a 200 response, but `response.json()` raises. What's the most likely cause?", options: ["The API is down", "The body isn't JSON — an HTML error page, an empty body, or a different content type. A 200 status says the request arrived, not that the body is what you assumed", "You need to await it", "The API key is wrong"] },
  { stage: 18, question: "Why does the AI ecosystem care so much about iterating over data in batches rather than one item at a time?", options: ["It looks tidier", "Every API call and model pass has fixed overhead. Batching amortises it, and it's also where rate limits, cost and memory pressure are actually controlled", "One at a time is impossible", "Batches are more accurate"] },
];

export const PYTHON_STAGES: Stage[] = [
  {
    num: "00",
    title: "Running your first Python",
    time: "8 min",
    why: "Python is the language most of the AI ecosystem is written in. Before syntax, one structural idea that separates it from almost everything else: indentation isn't formatting here — it's how the language knows what belongs to what.",
    learn: [
      "Running code two ways: a .py file, and the interactive REPL",
      "print() and why the REPL echoes values but a script doesn't",
      "Indentation as syntax — the single rule that surprises everyone arriving from another language",
    ],
    code: `print("Hello")
print("This runs second")

<KW># Indentation decides what's inside the block:</KW>
if True:
    print("inside")     <KW># 4 spaces — this belongs to the if</KW>
print("outside")        <KW># back to column 0 — this always runs</KW>

<KW># Mixing tabs and spaces is the classic first-week error.</KW>`,
    build: "Install Python, open the REPL with `python3`, and print your name. Then put the same line in a file and run it with `python3 file.py`. Notice what the REPL shows that the file doesn't.",
    check: "Why doesn't Python need semicolons or braces — and what does the work instead?",
  },
  {
    num: "01",
    title: "Variables and types",
    time: "10 min",
    why: "Python won't make you declare a type, which is comfortable right up until an int and a float behave differently and you can't see why. Knowing what you're holding is the whole game.",
    learn: [
      "int, float, str, bool — and type() to ask what you've got",
      "Dynamic typing: names point at objects, and can be re-pointed",
      "Type hints — optional, ignored at runtime, and worth writing anyway",
    ],
    code: `name = "Abhishek"      <KW># str</KW>
score = 10             <KW># int</KW>
ratio = 0.5            <KW># float</KW>
active = True          <KW># bool — capital T</KW>

print(type(score))     <KW># <class 'int'></KW>
print(type(3) is type(3.0))   <KW># False</KW>

<KW># A hint documents intent; Python doesn't enforce it.</KW>
def greet(name: str) -> str:
    return f"Hi {name}"`,
    build: "Make one of each type, print its type(), then reassign a variable to a different type and print it again. Watch Python let you.",
    check: "Is `3` the same type as `3.0`, and where does that difference actually bite you?",
  },
  {
    num: "02",
    title: "Numbers and maths",
    time: "10 min",
    why: "Two division operators, and picking the wrong one is a quiet source of off-by-one bugs — especially in the index maths you'll do constantly when chunking text for a model.",
    learn: [
      "/ vs // vs %, and when each is the one you meant",
      "** for powers, and round() versus int()",
      "Why floats aren't exact, and what to use when that matters",
    ],
    code: `print(7 / 2)     <KW># 3.5 — always a float</KW>
print(7 // 2)    <KW># 3   — floor division</KW>
print(7 % 2)     <KW># 1   — remainder</KW>
print(2 ** 10)   <KW># 1024</KW>

print(0.1 + 0.2)         <KW># 0.30000000000000004</KW>
print(round(0.1 + 0.2, 2))  <KW># 0.3</KW>

print(int(3.9))  <KW># 3 — truncates, doesn't round</KW>`,
    build: "Given a total number of characters and a chunk size, work out how many chunks you need — including the partial last one. (Hint: // and % together, or -(-a // b).)",
    check: "What's the difference between `7 / 2` and `7 // 2`, and which one do you want for an index?",
  },
  {
    num: "03",
    title: "Strings and f-strings",
    time: "10 min",
    why: "Prompts are strings. Every prompt you ever build for a model is string assembly, so the difference between readable interpolation and a pile of concatenation matters more here than in most languages.",
    learn: [
      "f-strings: expressions inline, and automatic conversion",
      "strip, split, join, replace, startswith — the ones you'll reach for",
      "Triple-quoted strings for multi-line prompts",
    ],
    code: `name = "Asha"
turns = 3

<KW># Concatenation breaks the moment a value isn't a string:</KW>
<KW># "turns: " + turns  → TypeError</KW>

print(f"{name} has taken {turns} turns")
print(f"Half: {turns / 2:.1f}")   <KW># formatting inside the braces</KW>

prompt = f"""You are a helpful tutor.
The learner is called {name}.
Keep answers under three sentences."""

print(" | ".join(["a", "b", "c"]))   <KW># a | b | c</KW>`,
    build: "Write a function that takes a name and a question and returns a formatted prompt using a triple-quoted f-string.",
    check: "Why does `\"turns: \" + turns` fail where an f-string doesn't?",
  },
  {
    num: "04",
    title: "Booleans and truthiness",
    time: "10 min",
    why: "Python lets you test a list, a string or a dict directly for emptiness. That's elegant and it's also where a subtle bug hides: an empty result and a missing result look identical to an `if`.",
    learn: [
      "== vs is — value equality against identity",
      "Falsy values: 0, \"\", [], {}, None, False",
      "and / or returning operands, not just True and False",
    ],
    code: `print(5 == 5.0)     <KW># True — same value</KW>
print(5 is 5.0)     <KW># False — different objects</KW>

items = []
if not items:
    print("empty")   <KW># empty list is falsy</KW>

<KW># The trap: None and [] are both falsy, but they mean</KW>
<KW># "nothing came back" and "it came back empty".</KW>
if items is None:
    print("no result at all")

name = "" or "anonymous"   <KW># "anonymous"</KW>`,
    build: "Write a check that distinguishes 'the API returned nothing' from 'the API returned an empty list'. Make the difference visible in the output.",
    check: "Which of `0`, `[]`, `\"False\"` and `[0]` are falsy?",
  },
  {
    num: "05",
    title: "if, elif, else",
    time: "10 min",
    why: "The chain is the point. Beginners often write several separate `if`s and are surprised when two branches both run — which is a bug that only shows up on the input where both conditions happen to be true.",
    learn: [
      "elif: stopping at the first match, and why order matters",
      "The conditional expression — Python's ternary, in reading order",
      "Guard clauses: returning early instead of nesting",
    ],
    code: `score = 72

if score >= 90:
    grade = "Excellent"
elif score >= 60:
    grade = "Passed"      <KW># this one</KW>
else:
    grade = "Try again"

<KW># Same decision, as an expression:</KW>
grade = "Passed" if score >= 60 else "Try again"

<KW># Guard clause keeps the happy path flat:</KW>
def check(n):
    if n is None:
        return "missing"
    return "ok" if n >= 60 else "low"`,
    build: "Write a grader that handles a missing score, a negative score, and the normal range — with the guards first.",
    check: "What breaks if you swap the `>= 90` and `>= 60` branches?",
  },
  {
    num: "06",
    title: "Lists",
    time: "12 min",
    why: "Nearly all data you'll handle arrives as a list — chunks of a document, messages in a conversation, rows from a database. The one thing to internalise now is that lists are mutable and shared.",
    learn: [
      "Indexing from 0, negative indexing, and slicing",
      "append, extend, pop, sort — and which mutate in place",
      "Mutability: why passing a list to a function can change the caller's list",
    ],
    code: `chunks = ["intro", "body", "end"]

print(chunks[0])     <KW># intro</KW>
print(chunks[-1])    <KW># end — negative counts back</KW>
print(chunks[0:2])   <KW># ['intro', 'body'] — stop is exclusive</KW>

def add_footer(items):
    items.append("footer")   <KW># mutates the caller's list</KW>

add_footer(chunks)
print(chunks)        <KW># footer is now in there</KW>

safe = chunks[:]     <KW># a copy, if you didn't want that</KW>`,
    build: "Write a function that returns a new list with an item added, leaving the original untouched. Prove it by printing both.",
    check: "You pass a list to a function that appends to it. What does the caller see afterwards?",
  },
  {
    num: "07",
    title: "Loops",
    time: "12 min",
    why: "Python's for loop iterates over things, not over counters. Once that clicks, most of the index arithmetic other languages need simply disappears — and so do the bugs that lived in it.",
    learn: [
      "for over a sequence, and enumerate when you need the index too",
      "while, and the condition that has to change",
      "zip, break and continue",
    ],
    code: `names = ["Asha", "Ravi", "Meera"]

for name in names:
    print(name)

<KW># Index only when you actually need it:</KW>
for i, name in enumerate(names):
    print(i, name)

<KW># Two sequences together:</KW>
for name, score in zip(names, [8, 6, 9]):
    print(f"{name}: {score}")

for name in names:
    if name.startswith("R"):
        continue     <KW># skip this one</KW>
    print(name)`,
    build: "Given a long string, split it into chunks of N characters using a loop, and print how many chunks you got.",
    check: "Why is `for item in items:` usually better than looping over `range(len(items))`?",
  },
  {
    num: "08",
    title: "Dictionaries",
    time: "12 min",
    why: "Every JSON response, every model config, every message you send to an LLM API is a dict. This is the single most-used shape in Python AI work, so the missing-key behaviour is worth knowing cold.",
    learn: [
      "Key-value pairs, and why d[k] and d.get(k) fail differently",
      "Iterating keys, values and items",
      "Nesting: dicts inside lists inside dicts, which is what JSON is",
    ],
    code: `message = {"role": "user", "content": "Hello"}

print(message["role"])          <KW># user</KW>
print(message.get("name"))      <KW># None — no error</KW>
<KW># print(message["name"])     → KeyError</KW>

print(message.get("name", "anonymous"))   <KW># a default</KW>

for key, value in message.items():
    print(key, "=", value)

<KW># The shape every chat API expects:</KW>
messages = [
    {"role": "system", "content": "Be concise."},
    {"role": "user", "content": "What is RAG?"},
]`,
    build: "Build a list of message dicts for a three-turn conversation, then loop over it and print each turn as `role: content`.",
    check: "What's the difference between `d[\"missing\"]` and `d.get(\"missing\")`, and when do you want each?",
  },
  {
    num: "09",
    title: "Functions",
    time: "12 min",
    why: "One function, one job. The habit worth building now is naming the thing you're returning — because a function that does three things is the one you'll be unable to test later.",
    learn: [
      "Positional and keyword arguments, and default values",
      "return, and the implicit None when you forget it",
      "Docstrings, and why a one-line one earns its keep",
    ],
    code: `def chunk(text, size=500, overlap=50):
    """Split text into overlapping chunks of roughly 'size' characters."""
    out = []
    start = 0
    while start < len(text):
        out.append(text[start:start + size])
        start += size - overlap
    return out

<KW># Keyword arguments make the call readable at a glance:</KW>
pieces = chunk(document, size=1000, overlap=100)

def broken(n):
    n * 2        <KW># computed, then thrown away</KW>
print(broken(4)) <KW># None</KW>`,
    build: "Write the chunk() function above yourself, then check that overlapping chunks really do share text at the boundary.",
    check: "A function computes a value but the caller gets None. What's missing?",
  },
  {
    num: "10",
    title: "The mutable default trap",
    time: "10 min",
    why: "This one deserves its own lesson because it catches everybody once, it produces a bug that looks like memory corruption, and the explanation is a single sentence about when defaults are created.",
    learn: [
      "Default arguments are evaluated once, at definition time",
      "Why that makes a mutable default shared across calls",
      "The None sentinel pattern that fixes it",
    ],
    code: `<KW># Broken — the list is created once, at def time:</KW>
def add(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add("a"))   <KW># ['a']</KW>
print(add("b"))   <KW># ['a', 'b']  ← the same list</KW>

<KW># Fixed — a fresh list per call:</KW>
def add(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket`,
    build: "Reproduce the bug, then fix it with the None sentinel. Call each version three times and print the result each time.",
    check: "Why is `def add(item, bucket=[])` a trap, and what exactly is shared?",
  },
  {
    num: "11",
    title: "Comprehensions",
    time: "12 min",
    why: "Comprehensions are the most Python-looking thing in Python, and they're genuinely clearer for a transform-and-filter. They're also the most over-used feature in the language, so the judgement matters as much as the syntax.",
    learn: [
      "List, dict and set comprehensions",
      "Transform, filter, or both — in one readable line",
      "When to stop and write a loop instead",
    ],
    code: `nums = [1, -2, 3, -4, 5]

doubled = [n * 2 for n in nums]
positives = [n for n in nums if n > 0]
both = [n * 2 for n in nums if n > 0]

<KW># Dict comprehension — useful for lookup tables:</KW>
lengths = {word: len(word) for word in ["rag", "embedding"]}

<KW># Past this point, a loop is kinder to the reader:</KW>
<KW># [transform(x) for x in xs if check(x) and other(x) or fallback(x)]</KW>`,
    build: "Take a list of message dicts and build a list of just the user messages' content, in one comprehension.",
    check: "What does `[n * 2 for n in nums if n > 0]` produce, and when should you use a plain loop instead?",
  },
  {
    num: "12",
    title: "Modules and imports",
    time: "10 min",
    why: "One file becomes several the moment a project is real. The `__main__` guard is the piece nobody explains, and skipping it means importing your module also runs your script.",
    learn: [
      "import, from ... import, and aliasing with as",
      "Your own modules: a .py file is a module",
      "if __name__ == \"__main__\": and what it actually guards",
    ],
    code: `import json
from pathlib import Path
import numpy as np       <KW># the conventional alias</KW>

<KW># chunker.py</KW>
def chunk(text, size=500):
    ...

if __name__ == "__main__":
    <KW># Runs only when you execute this file directly.</KW>
    <KW># Importing chunk() from elsewhere won't fire this.</KW>
    print(chunk("some text"))`,
    build: "Split your chunk() function into its own module, import it from a second file, and add a __main__ block that demos it.",
    check: "What does `if __name__ == \"__main__\":` protect you from?",
  },
  {
    num: "13",
    title: "Files and JSON",
    time: "12 min",
    why: "The documents you'll retrieve over, the configs you'll load, the responses you'll cache — all of it is reading and writing. `with` is not a style choice; it's what guarantees the handle closes when something throws.",
    learn: [
      "with open(...) as f — and why the context manager matters",
      "Reading whole files versus line by line",
      "json.load / json.dumps, and encoding gotchas",
    ],
    code: `from pathlib import Path
import json

<KW># The handle closes even if the block raises:</KW>
with open("notes.txt", encoding="utf-8") as f:
    text = f.read()

<KW># Line by line, for a file too big to hold in memory:</KW>
with open("big.txt", encoding="utf-8") as f:
    for line in f:
        process(line.rstrip())

with open("config.json", encoding="utf-8") as f:
    config = json.load(f)      <KW># file → dict</KW>

payload = json.dumps(config)   <KW># dict → str</KW>`,
    build: "Read a text file, chunk it with your function from lesson 09, and write the chunks out as JSON.",
    check: "Why `with open(...)` rather than a bare `open()`?",
  },
  {
    num: "14",
    title: "Errors and exceptions",
    time: "12 min",
    why: "Anything that touches a network fails eventually. How you catch matters: a bare `except` turns every bug in your own code into a silent shrug, which is worse than crashing.",
    learn: [
      "try / except / else / finally",
      "Catching the specific exception, and why bare except is harmful",
      "Raising your own, with a message that helps the next person",
    ],
    code: `import json

try:
    data = json.loads(body)
except json.JSONDecodeError as e:
    <KW># Specific: we expected this one and can handle it.</KW>
    print(f"Not JSON: {e}")
    data = None

<KW># Harmful — swallows typos, KeyboardInterrupt, everything:</KW>
<KW># try: ...</KW>
<KW># except: pass</KW>

def load(path):
    if not path.endswith(".json"):
        raise ValueError(f"Expected a .json file, got {path}")`,
    build: "Wrap a JSON parse so a malformed body is handled but a typo in your own code still crashes loudly. Test both.",
    check: "What's wrong with a bare `except:`?",
  },
  {
    num: "15",
    title: "Classes, briefly",
    time: "12 min",
    why: "You'll read far more classes than you write — every library you use is full of them. Enough to navigate one confidently is the goal here, not object-oriented design.",
    learn: [
      "__init__, instance attributes, and what self actually is",
      "Methods versus functions",
      "When a dict or a function is the better answer",
    ],
    code: `class Retriever:
    def __init__(self, chunks, top_k=3):
        self.chunks = chunks      <KW># stored on the instance</KW>
        self.top_k = top_k

    def search(self, query):
        <KW># self is just the first parameter — Python passes</KW>
        <KW># the instance explicitly where others hide it.</KW>
        return self.chunks[: self.top_k]

r = Retriever(["a", "b", "c"], top_k=2)
print(r.search("anything"))     <KW># ['a', 'b']</KW>

<KW># If it has no state and one method, it wanted to be a function.</KW>`,
    build: "Turn your chunker into a small class with configurable size and overlap, then argue with yourself about whether it was better as a function.",
    check: "What is `self`, really?",
  },
  {
    num: "16",
    title: "Virtual environments and pip",
    time: "10 min",
    why: "The AI ecosystem moves fast and pins hard. Two projects will want incompatible versions of the same library within a month of each other, and a global install is how you end up unable to run either.",
    learn: [
      "python3 -m venv, activating, and what it actually changes",
      "pip install, requirements.txt, and pinning versions",
      "Why you never commit the venv folder",
    ],
    code: `<KW># One environment per project:</KW>
python3 -m venv .venv
source .venv/bin/activate     <KW># Windows: .venv\\Scripts\\activate</KW>

pip install requests
pip freeze > requirements.txt

<KW># Someone else, later:</KW>
pip install -r requirements.txt

<KW># .gitignore</KW>
.venv/`,
    build: "Create a venv for a scratch project, install requests inside it, freeze the requirements, then deactivate and confirm requests isn't available globally.",
    check: "Why one environment per project rather than installing globally?",
  },
  {
    num: "17",
    title: "Talking to APIs",
    time: "14 min",
    why: "Every model you'll use is behind an HTTP call. The habit that saves you: check the status before you touch the body, and never assume a 200 means the body is the shape you expected.",
    learn: [
      "requests.get / post, headers, and JSON bodies",
      "Status codes, and why 200 doesn't mean 'correct'",
      "Keeping the API key out of your source",
    ],
    code: `import os
import requests

<KW># Never hard-code a key. Read it from the environment.</KW>
key = os.environ["API_KEY"]

response = requests.post(
    "https://api.example.com/v1/chat",
    headers={"Authorization": f"Bearer {key}"},
    json={"messages": [{"role": "user", "content": "Hi"}]},
    timeout=30,        <KW># always set one</KW>
)

if response.status_code != 200:
    raise RuntimeError(f"{response.status_code}: {response.text[:200]}")

data = response.json()   <KW># raises if the body isn't JSON</KW>`,
    build: "Call any free public JSON API, handle a non-200 explicitly, and print one field from the response.",
    check: "You get a 200 but `.json()` raises. What's the most likely reason?",
  },
  {
    num: "18",
    title: "Working with data, in batches",
    time: "14 min",
    why: "This is the bridge into AI engineering. Every embedding call, every model pass, every rate limit and every rupee of cost is decided by how you group work — one at a time is almost never the right answer.",
    learn: [
      "Batching a long sequence, and why overhead is fixed per call",
      "Generators and yield, for data too big to hold at once",
      "Where rate limits, retries and cost actually get controlled",
    ],
    code: `def batched(items, size):
    """Yield lists of at most 'size' items."""
    for i in range(0, len(items), size):
        yield items[i:i + size]

<KW># One call per batch, not one per item:</KW>
for group in batched(chunks, 100):
    vectors = embed(group)      <KW># 100 chunks, one request</KW>

<KW># A generator holds one batch at a time, not the whole list:</KW>
total = sum(len(g) for g in batched(chunks, 100))

<KW># 10,000 chunks: 10,000 calls, or 100. Same work, very different bill.</KW>`,
    build: "Write batched() yourself, then use it to count how many API calls 10,000 items would take at batch sizes of 1, 20 and 100.",
    check: "Why does batching matter so much once you're calling a model API?",
  },
];
