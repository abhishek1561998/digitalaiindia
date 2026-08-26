// Shared content for the MERN track — used by both /learn/mern and
// /learn/mern/course.

import type { Stage, QuizQuestion } from "../types";

export const MERN_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why doesn't a single-threaded Node server fall over under 1,000 concurrent requests, when a single thread obviously can't run 1,000 things at once?", options: ["Node secretly uses multiple threads for every request", "Most of those requests are waiting on I/O (disk, network, database) — Node hands that waiting off and moves to the next request instead of blocking", "It does fall over — Node can't actually handle concurrency", "Because JavaScript is faster than other languages"] },
  { stage: 1, question: "What does calling next() in Express middleware actually do, and what happens if middleware forgets to call it?", options: ["It skips to the error handler", "It passes control to the next middleware/route handler in the chain — if you forget it, the request hangs forever with no response", "It restarts the request", "It's optional and does nothing important"] },
  { stage: 2, question: "You're modeling blog posts and comments in MongoDB. When would you embed comments inside the post document vs. reference them separately?", options: ["Always embed — MongoDB is document-based", "Always reference — it's more like SQL", "Embed if comments are few and always read with the post; reference if comments can grow unbounded or need independent queries", "It doesn't matter, MongoDB handles it automatically"] },
  { stage: 3, question: "Why can't you \"un-hash\" a bcrypt password, but you CAN decode a JWT's payload without any secret?", options: ["They're actually the same thing", "bcrypt is a one-way hash function by design; a JWT's payload is just base64-encoded (not encrypted) — the secret only verifies the signature wasn't tampered with", "JWTs are always encrypted, so this is false", "bcrypt is reversible if you know the algorithm"] },
  { stage: 4, question: "Why doesn't calling setState update the variable immediately within the same function call?", options: ["It's a bug in React", "React batches state updates and schedules a re-render — the new value is only available on the next render, not synchronously", "setState is asynchronous like a network call", "You have to use a special await keyword"] },
  { stage: 5, question: "Why does a useEffect data-fetch need a cleanup function to avoid a real bug — what bug specifically?", options: ["It doesn't need one, this is unnecessary caution", "If the component unmounts (or the effect re-runs) before the fetch resolves, calling setState on an unmounted component logs a warning and can cause stale data to overwrite newer data (a race condition)", "Cleanup functions are only for event listeners", "It prevents the fetch from being slow"] },
  { stage: 6, question: "What is CORS actually protecting against, and why does Access-Control-Allow-Origin: * defeat that protection for a login-protected API?", options: ["CORS prevents SQL injection", "CORS stops a malicious website from making authenticated requests to your API using a logged-in user's cookies/credentials from their browser — allowing '*' lets ANY website do exactly that", "CORS is just a formality with no real security purpose", "CORS only matters for GET requests"] },
  { stage: 7, question: "Your app works locally but the deployed frontend can't reach the deployed backend. What are the most likely causes?", options: ["The code is fundamentally broken and needs a rewrite", "CORS not configured for the production frontend URL, the frontend still pointing at a localhost API URL, or the backend not actually running/crashed on deploy", "Deployment never works for MERN apps", "You need a different framework"] },
  { stage: 8, question: "Why is client-side form validation not actually a security measure, even though it's still worth having?", options: ["It's not worth having at all", "Anyone can bypass client-side JS entirely (browser devtools, curl, Postman) and send whatever they want directly to your API — the server must validate independently or it's not actually protected", "Client-side validation is more secure than server-side", "Because JavaScript can be disabled"] },
];

export const MERN_STAGES: Stage[] = [
  {
    num: "00",
    title: "Node.js fundamentals & the event loop",
    time: "Week 1",
    why: "Most tutorials treat Node as “JavaScript but for servers” without explaining why it can handle thousands of concurrent connections on a single thread — that understanding is what separates someone who can debug a hanging server from someone who can't.",
    learn: [
      "The event loop, applied server-side this time — non-blocking I/O specifically",
      "CommonJS vs. ES modules in Node, and npm/package.json fundamentals",
      "What Express is actually abstracting away, by seeing what's underneath it first",
    ],
    code: `<KW>// Blocking — the whole process waits here</KW>
const data = fs.readFileSync("large-file.txt");
console.log("This waits for the read to finish");

<KW>// Non-blocking — Node moves on immediately</KW>
fs.readFile("large-file.txt", (err, data) => {
  console.log("This runs when the read finishes, later");
});
console.log("This logs FIRST, before the file is read");`,
    build: "A plain HTTP server using Node's built-in http module — no Express yet, so you see exactly what Express saves you from writing by hand.",
    check: "Why doesn't a single-threaded Node server fall over under 1,000 concurrent requests, when a single thread obviously can't run 1,000 things at once?",
  },
  {
    num: "01",
    title: "Express — building a real REST API",
    time: "Week 1–2",
    why: "Express tutorials usually show routes in isolation. Real APIs need middleware, error handling, and route organization from day one, or they become unmaintainable by the tenth route.",
    learn: [
      "Routing and middleware — what middleware actually is: a function with next()",
      "Centralized error-handling middleware instead of try/catch in every route",
      "Organizing routes into separate files as the API grows",
    ],
    code: `app.use(express.json());

<KW>// Middleware: runs before the route handler, calls next() to continue</KW>
function logRequest(req, res, next) {
  console.log(\`\${req.method} \${req.path}\`);
  next(); <KW>// forgetting this hangs the request forever</KW>
}

app.get("/api/todos", logRequest, (req, res) => {
  res.json(todos);
});

<KW>// Error-handling middleware — 4 arguments is what makes Express treat it specially</KW>
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});`,
    build: "A full REST API for a “todos” resource — GET/POST/PUT/DELETE, proper status codes, organized into its own router file.",
    check: "What does calling next() actually do, and what happens if middleware forgets to call it?",
  },
  {
    num: "02",
    title: "MongoDB & Mongoose — modeling data that isn't a spreadsheet",
    time: "Week 2–3",
    why: "Coming from SQL (or nothing), the instinct is to model MongoDB like relational tables. The actual skill is knowing when to embed vs. reference data — that decision reshapes your whole schema.",
    learn: [
      "Documents and collections, and how they differ from rows and tables",
      "Schema design: embedding vs. referencing, and the tradeoffs of each",
      "Mongoose schemas, validation, and basic queries",
    ],
    code: `const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, <KW>// reference</KW>
  createdAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", todoSchema);

<KW>// Basic query</KW>
const userTodos = await Todo.find({ userId: currentUserId }).sort({ createdAt: -1 });`,
    build: "Connect the Stage 1 todos API to a real MongoDB database via Mongoose — replace the in-memory array with real persistence.",
    check: "You're modeling blog posts and comments. When would you embed comments inside the post document, and when would you reference them separately?",
  },
  {
    num: "03",
    title: "Authentication — sessions, JWTs, and why passwords are hard",
    time: "Week 3–4",
    why: "“Just use bcrypt and JWT” is advice people follow without understanding what problem either one actually solves — which is exactly how security bugs happen.",
    learn: [
      "Password hashing — why plaintext or reversible encryption is always wrong",
      "JWT structure and what “stateless” authentication actually means",
      "Session vs. token tradeoffs, and protecting routes with middleware",
    ],
    code: `<KW>// Signup: hash before storing, never store plaintext</KW>
const hash = await bcrypt.hash(password, 10);
await User.create({ email, passwordHash: hash });

<KW>// Login: issue a JWT after verifying</KW>
const valid = await bcrypt.compare(password, user.passwordHash);
if (!valid) return res.status(401).json({ error: "Invalid credentials" });
const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

<KW>// Protect a route</KW>
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}`,
    build: "Add real signup/login to the todos API — hashed passwords, a JWT issued on login, and routes protected by auth middleware.",
    check: "Why can't you “un-hash” a bcrypt password to recover the original, but you CAN decode a JWT's payload without any secret?",
  },
  {
    num: "04",
    title: "React fundamentals — components, props, state",
    time: "Week 4–5",
    why: "You already understand closures and the DOM from the JavaScript track, so React's mental model — components as functions, state as “what triggers a re-render” — clicks fast. This stage moves quicker than a from-zero React course.",
    learn: [
      "Components as functions, and why props only flow one direction",
      "useState, and what “triggers a re-render” actually means",
      "Controlled inputs — the form pattern React expects",
    ],
    code: `function TodoInput({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}`,
    build: "A todo list UI — add, toggle, delete — using local state only, no API connection yet.",
    check: "Why doesn't calling setState update the variable immediately within the same function call?",
  },
  {
    num: "05",
    title: "React + API — data fetching, loading, errors",
    time: "Week 5–6",
    why: "Tutorials show the happy-path fetch() call. Real apps spend more code on loading and error states than on the actual data display — treating those as an afterthought is why demos feel broken in production.",
    learn: [
      "useEffect for data fetching, and the cleanup function that prevents a real race-condition bug",
      "Loading, error, and empty states as first-class UI, not edge cases",
      "Why fetching on every render would be a bug, and what dependency arrays actually control",
    ],
    code: `function TodoList() {
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setTodos(data); setStatus("done"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; }; <KW>// prevents setState after unmount</KW>
  }, []);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p>Something went wrong.</p>;
  return <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}`,
    build: "Connect the Stage 4 todo UI to the real backend API from Stages 1–3 — real loading and error states, not just the happy path.",
    check: "Why does a useEffect data-fetch need a cleanup function to avoid a real bug, and what bug specifically?",
  },
  {
    num: "06",
    title: "Connecting the stack — full CRUD end to end",
    time: "Week 6–7",
    why: "This is the stage where “I know React” and “I know Express” become “I can build a product” — integration is its own skill, not just the sum of the parts.",
    learn: [
      "Environment variables for API URLs across environments",
      "CORS — what it's actually protecting against, and configuring it correctly instead of allow-all",
      "Optimistic UI updates, and rolling back cleanly when a request fails",
    ],
    code: `<KW>// Correct CORS — allow only your real frontend origin</KW>
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

<KW>// Optimistic update — update UI immediately, roll back on failure</KW>
async function toggleTodo(id) {
  setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const res = await fetch(\`/api/todos/\${id}\`, { method: "PATCH" });
  if (!res.ok) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); <KW>// revert</KW>
  }
}`,
    build: "The full CRUD todo app, working end to end locally — React frontend, Express/MongoDB backend, JWT auth, all connected.",
    check: "What is CORS actually protecting against, and why does setting Access-Control-Allow-Origin: * defeat that protection for a login-protected API?",
  },
  {
    num: "07",
    title: "Deployment — getting it actually live",
    time: "Week 7",
    why: "A MERN app that only runs on localhost isn't a portfolio piece. Deployment has its own gotchas — env vars, build steps, production CORS — that “it works on my machine” never surfaces.",
    learn: [
      "Deploying the Express API to a free host (Render/Railway)",
      "Deploying the React frontend (Vercel/Netlify) and wiring the production API URL",
      "Connecting a hosted MongoDB (Atlas free tier) instead of a local database",
    ],
    code: `<KW>// .env (never committed) vs. .env.example (committed, documents what's needed)</KW>
<KW>// .env.example</KW>
MONGODB_URI=
JWT_SECRET=
FRONTEND_URL=

<KW>// Read once, fail loudly if missing — don't silently fall back in production</KW>
if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}`,
    build: "Deploy the full Stage 6 app — a real live URL your frontend and backend both actually run at, not localhost.",
    check: "Your app works locally but the deployed frontend can't reach the deployed backend. What are the most likely causes, in order of likelihood?",
  },
  {
    num: "08",
    title: "Production concerns — security, rate limiting, validation",
    time: "Week 8",
    why: "The gap between “a working demo” and “something you'd trust with real user data” is a specific, learnable checklist — not a vague feeling of needing more polish.",
    learn: [
      "Rate limiting — why it matters, and a basic implementation",
      "Common HTTP security headers (helmet.js) and what each actually prevents",
      "Server-side input validation — why client-side validation alone is not security",
    ],
    code: `<KW>// Basic rate limiting — cap requests per IP per window</KW>
const attempts = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const count = (attempts.get(ip) || 0) + 1;
  attempts.set(ip, count);
  setTimeout(() => attempts.set(ip, Math.max(0, (attempts.get(ip) || 1) - 1)), 60_000);
  if (count > 20) return res.status(429).json({ error: "Too many requests" });
  next();
}

<KW>// Server-side validation — never trust the client alone</KW>
if (!title || title.trim().length === 0 || title.length > 200) {
  return res.status(400).json({ error: "Invalid title" });
}`,
    build: "Harden the deployed app — add rate limiting, real server-side validation (not just frontend), and security headers via helmet.",
    check: "Why is client-side form validation not actually a security measure, even though it's still worth having?",
  },
];
