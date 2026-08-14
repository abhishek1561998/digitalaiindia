// Server-only quiz bank for the MERN track. Correct answers never ship to
// the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const MERN_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "Why doesn't a single-threaded Node server fall over under 1,000 concurrent requests, when a single thread obviously can't run 1,000 things at once?",
    options: ["Node secretly uses multiple threads for every request", "Most of those requests are waiting on I/O (disk, network, database) — Node hands that waiting off and moves to the next request instead of blocking", "It does fall over — Node can't actually handle concurrency", "Because JavaScript is faster than other languages"],
    correctIndex: 1,
    explanation: "The event loop lets Node start an I/O operation, immediately move on to handle other requests, and come back via a callback when that I/O finishes — so one thread juggles many in-flight requests without blocking on any single one.",
  },
  {
    stage: 1,
    question: "What does calling next() in Express middleware actually do, and what happens if middleware forgets to call it?",
    options: ["It skips to the error handler", "It passes control to the next middleware/route handler in the chain — if you forget it, the request hangs forever with no response", "It restarts the request", "It's optional and does nothing important"],
    correctIndex: 1,
    explanation: "Express middleware runs in a chain; next() is what tells Express to move to the next function in that chain. Without it, the request never reaches a handler that sends a response, so the client waits indefinitely.",
  },
  {
    stage: 2,
    question: "You're modeling blog posts and comments in MongoDB. When would you embed comments inside the post document vs. reference them separately?",
    options: ["Always embed — MongoDB is document-based", "Always reference — it's more like SQL", "Embed if comments are few and always read with the post; reference if comments can grow unbounded or need independent queries", "It doesn't matter, MongoDB handles it automatically"],
    correctIndex: 2,
    explanation: "MongoDB documents have a size limit and embedding is best for data that's always accessed together in bounded amounts. Comments on a viral post can grow into the thousands and might need pagination or independent moderation queries — that calls for referencing.",
  },
  {
    stage: 3,
    question: "Why can't you \"un-hash\" a bcrypt password, but you CAN decode a JWT's payload without any secret?",
    options: ["They're actually the same thing", "bcrypt is a one-way hash function by design; a JWT's payload is just base64-encoded (not encrypted) — the secret only verifies the signature wasn't tampered with", "JWTs are always encrypted, so this is false", "bcrypt is reversible if you know the algorithm"],
    correctIndex: 1,
    explanation: "bcrypt deliberately destroys the original input — that's what makes it safe to store. A JWT is signed, not encrypted, so anyone can read its payload; the secret key only lets the server verify no one tampered with it in transit.",
  },
  {
    stage: 4,
    question: "Why doesn't calling setState update the variable immediately within the same function call?",
    options: ["It's a bug in React", "React batches state updates and schedules a re-render — the new value is only available on the next render, not synchronously", "setState is asynchronous like a network call", "You have to use a special await keyword"],
    correctIndex: 1,
    explanation: "React intentionally batches updates for performance and consistency — calling setState schedules a re-render rather than mutating the variable in place, so the closure you're currently in still sees the old value.",
  },
  {
    stage: 5,
    question: "Why does a useEffect data-fetch need a cleanup function to avoid a real bug — what bug specifically?",
    options: ["It doesn't need one, this is unnecessary caution", "If the component unmounts (or the effect re-runs) before the fetch resolves, calling setState on an unmounted component logs a warning and can cause stale data to overwrite newer data (a race condition)", "Cleanup functions are only for event listeners", "It prevents the fetch from being slow"],
    correctIndex: 1,
    explanation: "If a user navigates away (or the effect re-runs on a dependency change) while a fetch is still in flight, the old fetch resolving later can overwrite state with stale data — the cleanup flag guards against acting on a request that's no longer relevant.",
  },
  {
    stage: 6,
    question: "What is CORS actually protecting against, and why does Access-Control-Allow-Origin: * defeat that protection for a login-protected API?",
    options: ["CORS prevents SQL injection", "CORS stops a malicious website from making authenticated requests to your API using a logged-in user's cookies/credentials from their browser — allowing '*' lets ANY website do exactly that", "CORS is just a formality with no real security purpose", "CORS only matters for GET requests"],
    correctIndex: 1,
    explanation: "Without CORS restrictions, a malicious site you visit could silently make requests to your bank's API using cookies your browser automatically attaches. Allowing '*' removes that protection entirely for any origin.",
  },
  {
    stage: 7,
    question: "Your app works locally but the deployed frontend can't reach the deployed backend. What are the most likely causes?",
    options: ["The code is fundamentally broken and needs a rewrite", "CORS not configured for the production frontend URL, the frontend still pointing at a localhost API URL, or the backend not actually running/crashed on deploy", "Deployment never works for MERN apps", "You need a different framework"],
    correctIndex: 1,
    explanation: "These three are by far the most common real causes — an env var still pointing at localhost, a CORS origin list that forgot the production URL, or the backend process itself failing to start (often from a missing env var it needed).",
  },
  {
    stage: 8,
    question: "Why is client-side form validation not actually a security measure, even though it's still worth having?",
    options: ["It's not worth having at all", "Anyone can bypass client-side JS entirely (browser devtools, curl, Postman) and send whatever they want directly to your API — the server must validate independently or it's not actually protected", "Client-side validation is more secure than server-side", "Because JavaScript can be disabled"],
    correctIndex: 1,
    explanation: "Client-side validation is a UX convenience — instant feedback without a round trip. But it runs entirely in an environment the user controls, so anyone can skip it and hit your API directly. Only server-side validation is a real boundary.",
  },
];
