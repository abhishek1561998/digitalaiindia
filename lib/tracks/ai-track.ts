// Shared content for the AI Engineering track — used by both /learn/ai
// and /learn/ai/course.

import type { Stage, QuizQuestion } from "./types";

export const AI_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?", options: ["It's a bug in the model", "The model samples the next token from a probability distribution rather than always picking the top one — temperature controls how much randomness is allowed in that sampling", "The model is learning from your previous questions", "Network latency changes the answer"] },
  { stage: 1, question: "You give a model a 50-page document and ask a question about page 40, but it answers about page 2. What's the most likely cause?", options: ["The model is broken", "The relevant content fell outside the effective context the model attends to, or was truncated — models degrade on retrieval from the middle/end of very long contexts", "Page 40 was written badly", "The model only reads page 2 by design"] },
  { stage: 2, question: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?", options: ["It doesn't — character splitting is better", "A fixed cut can slice a sentence or idea in half, so neither resulting chunk carries a complete thought — the embedding of a half-idea matches poorly against a real question", "Character splitting is slower", "Semantic splitting uses fewer tokens"] },
  { stage: 3, question: "Two sentences with no words in common can still have very similar embeddings. Why?", options: ["That's impossible — embeddings are based on words", "Embeddings encode meaning in vector space, so \"the cat sat on the mat\" and \"a feline rested on the rug\" land close together despite zero shared words", "It's a flaw in embedding models", "Because both sentences are the same length"] },
  { stage: 4, question: "Your RAG app retrieves the right chunk but the model still answers incorrectly. Where's the bug most likely to be?", options: ["The vector database", "The prompt/generation step — the retrieved context may be poorly formatted, buried, contradicted by the model's training, or the instructions may not tell the model to prefer the provided context", "The embedding model", "The user's question"] },
  { stage: 5, question: "Why is streaming a response mostly a UX improvement rather than a speed improvement?", options: ["It genuinely makes the model faster", "Total generation time is roughly the same — streaming just shows tokens as they're produced instead of waiting for all of them, so perceived latency drops dramatically", "Streaming reduces token costs", "It isn't a UX improvement at all"] },
  { stage: 6, question: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?", options: ["It makes the bundle larger", "Anything shipped to the browser is fully readable by any user — the key can be extracted and used to run up unlimited charges on your account", "Frontend code runs slower with keys", "It's only a problem for public apps"] },
  { stage: 7, question: "Why is 'the output looked good when I tried it' an unreliable way to evaluate an LLM feature?", options: ["It's actually a reliable method", "A handful of manual spot-checks can't catch regressions, edge cases, or the model's variance across runs — you need a repeatable eval set with expected behaviors to know if a prompt change made things better or worse", "Manual testing is too slow, but otherwise fine", "Because outputs are always correct anyway"] },
  { stage: 8, question: "You ship an LLM feature and costs are 10x your estimate. What are the most likely causes?", options: ["The provider is overcharging", "Sending far more context than necessary on every call (whole documents instead of retrieved chunks), no caching of repeated queries, retry loops on failures, or using a larger model than the task needs", "LLMs are just inherently unaffordable", "Users are calling the API too politely"] },
];

export const AI_STAGES: Stage[] = [
  {
    num: "00",
    title: "How LLMs actually work (enough to build with)",
    time: "Week 1",
    why: "You don't need to train models to build with them — but you DO need a working mental model of tokens, context, and sampling, or every weird output looks like magic instead of something you can debug.",
    learn: [
      "Tokens, context windows, and why they cost money and impose limits",
      "Temperature and sampling — why the same prompt gives different answers",
      "What models genuinely can't do — no real-time knowledge, no persistent memory between calls",
    ],
    code: `<KW>// The same prompt, two very different behaviors</KW>
const factual = { temperature: 0, prompt: "What is 2+2?" };
<KW>// → "4" every single time (greedy: always picks the top token)</KW>

const creative = { temperature: 0.9, prompt: "Write a tagline for a chai brand" };
<KW>// → different output each run (samples across likely tokens)</KW>

<KW>// Rule of thumb: ~1 token ≈ 4 characters of English</KW>
<KW>// A 4,000-word document ≈ 5,000+ tokens of context you're paying for</KW>`,
    build: "Call an LLM API at temperature 0 and at 0.9 with the same prompt, five times each. Write down what changes and what doesn't.",
    check: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?",
  },
  {
    num: "01",
    title: "Prompt engineering that isn't guesswork",
    time: "Week 1–2",
    why: "Most “prompt engineering” advice is folklore passed around as magic phrases. The actual skill is structuring instructions, examples, and constraints — and knowing why each part helps.",
    learn: [
      "System vs. user messages, and what each is genuinely for",
      "Few-shot examples, and why showing beats telling for format control",
      "Structured output (JSON) and validating it instead of trusting it",
    ],
    code: `const messages = [
  { role: "system", content: "You extract structured data. Reply with JSON only, no prose." },
  { role: "user", content: "Order: 2 chai, 1 samosa, table 4" },
  { role: "assistant", content: '{"items":[{"name":"chai","qty":2},{"name":"samosa","qty":1}],"table":4}' },
  { role: "user", content: "Order: 3 coffee, 2 vada pav, table 7" },
];
<KW>// The example turn teaches the shape better than describing it ever could</KW>

<KW>// Never trust the output is valid — parse defensively</KW>
try { data = JSON.parse(response); } catch { /* retry or fail loudly */ }`,
    build: "Build a structured extractor — messy free-text input in, validated JSON out, with a retry when parsing fails.",
    check: "You give a model a 50-page document and ask about page 40, but it answers about page 2. What's the most likely cause?",
  },
  {
    num: "02",
    title: "Chunking — the step that quietly decides RAG quality",
    time: "Week 2",
    why: "Chunking is the least glamorous part of RAG and the single biggest determinant of whether retrieval works. Most tutorials use a fixed character split and never explain what that costs you.",
    learn: [
      "Fixed-size vs. recursive vs. semantic chunking, and the tradeoffs",
      "Chunk overlap — why it exists and what breaks without it",
      "Preserving metadata (source, page, section) alongside each chunk",
    ],
    code: `<KW>// Naive: can slice a sentence — or an idea — clean in half</KW>
const chunks = text.match(/.{1,1000}/g);

<KW>// Better: split on structure first, fall back to size</KW>
function recursiveSplit(text, maxLen = 1000, overlap = 100) {
  const paragraphs = text.split(/\\n\\n+/);
  const out = [];
  let current = "";
  for (const p of paragraphs) {
    if ((current + p).length > maxLen) {
      out.push(current);
      current = current.slice(-overlap) + p; <KW>// carry context across the seam</KW>
    } else {
      current += "\\n\\n" + p;
    }
  }
  if (current.trim()) out.push(current);
  return out;
}`,
    build: "Chunk the same document three ways (fixed, recursive, paragraph-aware) and compare which chunks actually contain complete, answerable ideas.",
    check: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?",
  },
  {
    num: "03",
    title: "Embeddings & vector search",
    time: "Week 3",
    why: "Embeddings are where “search by meaning instead of keywords” becomes real — and understanding vector similarity is what lets you debug retrieval instead of just hoping it works.",
    learn: [
      "What an embedding vector actually represents",
      "Cosine similarity, and why it's the standard distance measure here",
      "Vector databases vs. a simple in-memory array (and when you truly need one)",
    ],
    code: `<KW>// Cosine similarity — the whole mechanism, in 6 lines</KW>
function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
<KW>// 1.0 = identical meaning, 0 = unrelated, -1 = opposite</KW>

<KW>// Retrieval is just: embed the question, score every chunk, take the top k</KW>`,
    build: "Implement semantic search over ~50 chunks using only an array and cosine similarity — no vector database, so the mechanism stays visible.",
    check: "Two sentences with no words in common can still have very similar embeddings. Why?",
  },
  {
    num: "04",
    title: "Building a real RAG pipeline",
    time: "Week 3–4",
    why: "This is where the previous three stages combine into the pattern behind most production LLM apps — and where you learn that retrieval failures and generation failures need completely different fixes.",
    learn: [
      "The full pipeline: ingest → chunk → embed → store → retrieve → generate",
      "Prompt construction with retrieved context, and instructing the model to prefer it",
      "Debugging: separating “retrieved the wrong chunk” from “retrieved right, answered wrong”",
    ],
    code: `async function answerWithRag(question) {
  const questionEmbedding = await embed(question);
  const topChunks = store
    .map(c => ({ ...c, score: cosineSimilarity(questionEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  <KW>// Log scores — this is how you tell retrieval bugs from generation bugs</KW>
  console.log(topChunks.map(c => c.score));

  const context = topChunks.map(c => \`[\${c.source}] \${c.text}\`).join("\\n\\n");
  return callLlm([
    { role: "system", content: "Answer using ONLY the context below. If it's not there, say you don't know." },
    { role: "user", content: \`Context:\\n\${context}\\n\\nQuestion: \${question}\` },
  ]);
}`,
    build: "A working RAG app over your own documents — with retrieval scores logged so you can actually diagnose bad answers.",
    check: "Your RAG app retrieves the right chunk but still answers incorrectly. Where's the bug most likely to be?",
  },
  {
    num: "05",
    title: "Streaming, latency & real UX",
    time: "Week 4–5",
    why: "An LLM feature that makes users stare at a spinner for 8 seconds feels broken even when it's working perfectly. Streaming is the difference between “slow” and “alive.”",
    learn: [
      "Server-sent events and streaming responses token by token",
      "Perceived vs. actual latency, and why streaming fixes the first not the second",
      "Handling partial responses, cancellation, and mid-stream errors",
    ],
    code: `<KW>// Server: stream tokens as they arrive instead of buffering the whole reply</KW>
export async function POST(req) {
  const stream = await llm.chat({ messages, stream: true });
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(new TextEncoder().encode(chunk.text));
        }
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream" } }
  );
}`,
    build: "Add streaming to the Stage 4 RAG app — tokens appear as they generate, with a working cancel button.",
    check: "Why is streaming mostly a UX improvement rather than a genuine speed improvement?",
  },
  {
    num: "06",
    title: "Production LLM APIs — keys, limits, failures",
    time: "Week 5–6",
    why: "The gap between a working demo and a real product is almost entirely error handling, key security, and rate limits — the parts no tutorial covers because they're not exciting.",
    learn: [
      "Never exposing API keys client-side, and proxying through your own backend",
      "Rate limits, retries with exponential backoff, and graceful degradation",
      "Token budgeting and cost estimation before you ship",
    ],
    code: `<KW>// Retry with exponential backoff — rate limits are normal, not exceptional</KW>
async function callWithRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (err.status !== 429 || attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, 2 ** attempt * 1000)); <KW>// 2s, 4s, 8s</KW>
    }
  }
}

<KW>// The key lives ONLY on the server — the browser never sees it</KW>
const apiKey = process.env.LLM_API_KEY;`,
    build: "Harden the RAG app — server-side key handling, retry with backoff, per-user rate limiting, and a real fallback when the provider is down.",
    check: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?",
  },
  {
    num: "07",
    title: "Evaluation — knowing if it actually works",
    time: "Week 6–7",
    why: "This is the stage that separates AI engineers from people who prompt-and-hope. Without evals, every prompt change is a guess and every regression ships silently.",
    learn: [
      "Building a small eval set of real questions with expected behaviors",
      "Automated checks: does it cite sources, refuse when it should, stay in format",
      "LLM-as-judge — where it's useful and where it quietly misleads you",
    ],
    code: `const evalSet = [
  { q: "What's the refund window?", mustContain: ["30 days"], mustCite: true },
  { q: "Who won the 2026 election?", shouldRefuse: true }, <KW>// not in our docs</KW>
];

for (const test of evalSet) {
  const answer = await answerWithRag(test.q);
  const passed =
    (!test.mustContain || test.mustContain.every(s => answer.includes(s))) &&
    (!test.shouldRefuse || /don't know|not in|no information/i.test(answer));
  console.log(passed ? "PASS" : "FAIL", test.q);
}`,
    build: "Write a 15-question eval set for your RAG app and run it before and after a prompt change — measure whether you actually improved anything.",
    check: "Why is “the output looked good when I tried it” an unreliable way to evaluate an LLM feature?",
  },
  {
    num: "08",
    title: "Cost, caching & shipping something real",
    time: "Week 7–8",
    why: "LLM features can quietly cost 10–100x more than expected. Cost engineering isn't premature optimization here — it's the difference between a product you can afford to run and one you shut down.",
    learn: [
      "Where tokens actually go, and cutting context without hurting quality",
      "Caching embeddings and repeated queries",
      "Choosing the right model size per task instead of defaulting to the largest",
    ],
    code: `<KW>// Embeddings for unchanged documents never need recomputing — cache them</KW>
const cacheKey = hash(chunkText);
let embedding = await cache.get(cacheKey);
if (!embedding) {
  embedding = await embed(chunkText);
  await cache.set(cacheKey, embedding);
}

<KW>// Cheapest possible win: don't send what you don't need</KW>
<KW>// Whole 50-page doc every call → thousands of tokens per request</KW>
<KW>// Top 4 retrieved chunks → a few hundred, usually a better answer too</KW>`,
    build: "Instrument your RAG app for cost — log tokens per request, add embedding caching, and measure the before/after difference.",
    check: "You ship an LLM feature and costs come in 10x your estimate. What are the most likely causes?",
  },
];
