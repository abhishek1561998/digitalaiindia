// Server-only quiz bank for the AI Engineering track. Correct answers never
// ship to the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const AI_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?",
    options: ["It's a bug in the model", "The model samples the next token from a probability distribution rather than always picking the top one — temperature controls how much randomness is allowed in that sampling", "The model is learning from your previous questions", "Network latency changes the answer"],
    correctIndex: 1,
    explanation: "At each step the model produces probabilities over possible next tokens. Temperature 0 always takes the most likely one (deterministic); higher temperatures sample more freely from the distribution, producing variation run to run.",
  },
  {
    stage: 1,
    question: "You give a model a 50-page document and ask a question about page 40, but it answers about page 2. What's the most likely cause?",
    options: ["The model is broken", "The relevant content fell outside the effective context the model attends to, or was truncated — models degrade on retrieval from the middle/end of very long contexts", "Page 40 was written badly", "The model only reads page 2 by design"],
    correctIndex: 1,
    explanation: "This is the well-documented \"lost in the middle\" effect — attention over very long contexts is uneven, and content can also be silently truncated at the context limit. It's the core reason RAG exists: retrieve the relevant few chunks instead of dumping everything in.",
  },
  {
    stage: 2,
    question: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?",
    options: ["It doesn't — character splitting is better", "A fixed cut can slice a sentence or idea in half, so neither resulting chunk carries a complete thought — the embedding of a half-idea matches poorly against a real question", "Character splitting is slower", "Semantic splitting uses fewer tokens"],
    correctIndex: 1,
    explanation: "Embeddings encode meaning, so a chunk needs to contain a coherent, self-contained idea to embed usefully. Cutting mid-sentence produces two fragments that each represent the full idea poorly — and neither will score well against a question about it.",
  },
  {
    stage: 3,
    question: "Two sentences with no words in common can still have very similar embeddings. Why?",
    options: ["That's impossible — embeddings are based on words", "Embeddings encode meaning in vector space, so \"the cat sat on the mat\" and \"a feline rested on the rug\" land close together despite zero shared words", "It's a flaw in embedding models", "Because both sentences are the same length"],
    correctIndex: 1,
    explanation: "That's exactly the point of semantic search — embeddings map meaning to position in vector space, not words to words. It's why semantic search finds relevant results that pure keyword matching would completely miss.",
  },
  {
    stage: 4,
    question: "Your RAG app retrieves the right chunk but the model still answers incorrectly. Where's the bug most likely to be?",
    options: ["The vector database", "The prompt/generation step — the retrieved context may be poorly formatted, buried, contradicted by the model's training, or the instructions may not tell the model to prefer the provided context", "The embedding model", "The user's question"],
    correctIndex: 1,
    explanation: "If retrieval scores show the right chunk was found, the retrieval half is working — the failure is downstream in generation. Common causes: no instruction to prefer context over prior knowledge, context buried among too many chunks, or formatting that makes it hard to attribute.",
  },
  {
    stage: 5,
    question: "Why is streaming a response mostly a UX improvement rather than a speed improvement?",
    options: ["It genuinely makes the model faster", "Total generation time is roughly the same — streaming just shows tokens as they're produced instead of waiting for all of them, so perceived latency drops dramatically", "Streaming reduces token costs", "It isn't a UX improvement at all"],
    correctIndex: 1,
    explanation: "The model generates at the same rate either way. Streaming changes time-to-first-token from ~8 seconds to ~200ms, which is what users actually perceive as responsiveness — the last token still arrives at roughly the same moment.",
  },
  {
    stage: 6,
    question: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?",
    options: ["It makes the bundle larger", "Anything shipped to the browser is fully readable by any user — the key can be extracted and used to run up unlimited charges on your account", "Frontend code runs slower with keys", "It's only a problem for public apps"],
    correctIndex: 1,
    explanation: "There is no such thing as a secret in client-side code — bundlers don't hide it, minification doesn't hide it, and \"private\" apps still ship JS to real browsers. Anyone who opens devtools has your key and your billing account.",
  },
  {
    stage: 7,
    question: "Why is 'the output looked good when I tried it' an unreliable way to evaluate an LLM feature?",
    options: ["It's actually a reliable method", "A handful of manual spot-checks can't catch regressions, edge cases, or the model's variance across runs — you need a repeatable eval set with expected behaviors to know if a prompt change made things better or worse", "Manual testing is too slow, but otherwise fine", "Because outputs are always correct anyway"],
    correctIndex: 1,
    explanation: "LLM outputs vary run to run, so a single good result proves very little. Without a repeatable eval set, you can't tell whether a prompt tweak genuinely improved things or you just got a lucky sample — and regressions ship silently.",
  },
  {
    stage: 8,
    question: "You ship an LLM feature and costs are 10x your estimate. What are the most likely causes?",
    options: ["The provider is overcharging", "Sending far more context than necessary on every call (whole documents instead of retrieved chunks), no caching of repeated queries, retry loops on failures, or using a larger model than the task needs", "LLMs are just inherently unaffordable", "Users are calling the API too politely"],
    correctIndex: 1,
    explanation: "Cost scales with tokens per call times number of calls. Sending a whole document instead of 4 retrieved chunks can be 10x alone; add uncached repeats, retry storms, and an oversized model, and the multiplier compounds fast.",
  },
];
