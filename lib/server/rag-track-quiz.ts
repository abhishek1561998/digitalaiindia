// Correct answers for the rag track. Server-only.

import type { ServerQuizQuestion } from "./quiz-registry";

export const RAG_TRACK_QUIZ: ServerQuizQuestion[] = [
  {
    stage: 0,
    question: "Why is RAG usually right for factual questions where fine-tuning is wrong?",
    options: [
      "Fine-tuning is more expensive",
      "Facts change. RAG looks them up at answer time, so updating a document updates the answer — fine-tuning bakes them in and needs retraining to correct",
      "Fine-tuning doesn't work on facts",
      "RAG is newer",
    ],
    correctIndex: 1,
    explanation: "Facts change. RAG looks them up at answer time, so updating a document updates the answer — fine-tuning bakes them in and needs retraining to correct",
  },
  {
    stage: 1,
    question: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?",
    options: ["It doesn't — character splitting is better", "A fixed cut can slice a sentence or idea in half, so neither resulting chunk carries a complete thought — the embedding of a half-idea matches poorly against a real question", "Character splitting is slower", "Semantic splitting uses fewer tokens"],
    correctIndex: 1,
    explanation: "Embeddings encode meaning, so a chunk needs to contain a coherent, self-contained idea to embed usefully. Cutting mid-sentence produces two fragments that each represent the full idea poorly — and neither will score well against a question about it.",
  },
  {
    stage: 2,
    question: "Two sentences with no words in common can still have very similar embeddings. Why?",
    options: ["That's impossible — embeddings are based on words", "Embeddings encode meaning in vector space, so \"the cat sat on the mat\" and \"a feline rested on the rug\" land close together despite zero shared words", "It's a flaw in embedding models", "Because both sentences are the same length"],
    correctIndex: 1,
    explanation: "That's exactly the point of semantic search — embeddings map meaning to position in vector space, not words to words. It's why semantic search finds relevant results that pure keyword matching would completely miss.",
  },
  {
    stage: 3,
    question: "What does an approximate nearest-neighbour index give up, and what does it buy?",
    options: [
      "Nothing — it's strictly better",
      "It gives up guaranteed-exact results and buys sublinear search, which is the only way querying millions of vectors stays fast enough to use",
      "It gives up metadata filtering",
      "It gives up memory in exchange for accuracy",
    ],
    correctIndex: 1,
    explanation: "It gives up guaranteed-exact results and buys sublinear search, which is the only way querying millions of vectors stays fast enough to use",
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
    question: "Why does semantic search miss an exact error code like 'PX-4471'?",
    options: [
      "The code isn't in the documents",
      "Embeddings encode meaning, and a rare identifier carries almost none — so it lands near 'errors in general'. Keyword search matches the literal token, which is why hybrid retrieval fixes it",
      "Codes need to be lowercased first",
      "The chunk was too long",
    ],
    correctIndex: 1,
    explanation: "Embeddings encode meaning, and a rare identifier carries almost none — so it lands near 'errors in general'. Keyword search matches the literal token, which is why hybrid retrieval fixes it",
  },
  {
    stage: 6,
    question: "Why verify the citations a model produced rather than just displaying them?",
    options: [
      "To make the UI tidier",
      "A citation can be invented, and a fabricated source is worse than none — it makes an ungrounded answer look verified. Checking the indexes exist is a few lines and catches it",
      "Because users don't read citations",
      "To reduce token cost",
    ],
    correctIndex: 1,
    explanation: "A citation can be invented, and a fabricated source is worse than none — it makes an ungrounded answer look verified. Checking the indexes exist is a few lines and catches it",
  },
];
