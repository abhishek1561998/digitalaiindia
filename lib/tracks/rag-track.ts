// Content for the rag track.
//
// Split out of the old single "AI engineering" track: one 27-lesson course
// was harder to finish than four focused ones, and a lesson a day makes a
// six-lesson course a week's work rather than a month's.

import type { Stage, QuizQuestion } from "./types";

export const RAG_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why is RAG usually right for factual questions where fine-tuning is wrong?", options: ["Fine-tuning is more expensive", "Facts change. RAG looks them up at answer time, so updating a document updates the answer — fine-tuning bakes them in and needs retraining to correct", "Fine-tuning doesn't work on facts", "RAG is newer"] },
  { stage: 1, question: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?", options: ["It doesn't — character splitting is better", "A fixed cut can slice a sentence or idea in half, so neither resulting chunk carries a complete thought — the embedding of a half-idea matches poorly against a real question", "Character splitting is slower", "Semantic splitting uses fewer tokens"] },
  { stage: 2, question: "Two sentences with no words in common can still have very similar embeddings. Why?", options: ["That's impossible — embeddings are based on words", "Embeddings encode meaning in vector space, so \"the cat sat on the mat\" and \"a feline rested on the rug\" land close together despite zero shared words", "It's a flaw in embedding models", "Because both sentences are the same length"] },
  { stage: 3, question: "What does an approximate nearest-neighbour index give up, and what does it buy?", options: ["Nothing — it's strictly better", "It gives up guaranteed-exact results and buys sublinear search, which is the only way querying millions of vectors stays fast enough to use", "It gives up metadata filtering", "It gives up memory in exchange for accuracy"] },
  { stage: 4, question: "Your RAG app retrieves the right chunk but the model still answers incorrectly. Where's the bug most likely to be?", options: ["The vector database", "The prompt/generation step — the retrieved context may be poorly formatted, buried, contradicted by the model's training, or the instructions may not tell the model to prefer the provided context", "The embedding model", "The user's question"] },
  { stage: 5, question: "Why does semantic search miss an exact error code like 'PX-4471'?", options: ["The code isn't in the documents", "Embeddings encode meaning, and a rare identifier carries almost none — so it lands near 'errors in general'. Keyword search matches the literal token, which is why hybrid retrieval fixes it", "Codes need to be lowercased first", "The chunk was too long"] },
  { stage: 6, question: "Why verify the citations a model produced rather than just displaying them?", options: ["To make the UI tidier", "A citation can be invented, and a fabricated source is worse than none — it makes an ungrounded answer look verified. Checking the indexes exist is a few lines and catches it", "Because users don't read citations", "To reduce token cost"] },
];

export const RAG_STAGES: Stage[] = [
  {
    num: "00",
    title: "Why RAG exists",
    time: "10 min",
    why: "RAG is not a clever trick, it's the direct consequence of two facts: the model doesn't know your data, and you can't fit your data in the prompt. Everything in this course follows from those two sentences.",
    learn: [
      "The two problems RAG solves: no private knowledge, no room for all of it",
      "Retrieve-then-generate, as a shape",
      "Why RAG usually beats fine-tuning for factual, changing information",
    ],
    code: `<KW># Without RAG — the model invents an answer:</KW>
ask("What is our refund window?")   <KW># → plausible, unsourced, wrong</KW>

<KW># With RAG — three steps, always the same three:</KW>
<KW>#   1. RETRIEVE  find the few passages most likely to hold the answer</KW>
<KW>#   2. AUGMENT   put them in the prompt as context</KW>
<KW>#   3. GENERATE  ask the model to answer only from that context</KW>

def answer(question):
    chunks = retrieve(question, k=4)     <KW># search your data</KW>
    context = "\\\\n\\\\n".join(chunks)
    return ask(f"{context}\\\\n\\\\nQuestion: {question}")

<KW># Fine-tuning teaches style and format. RAG supplies facts —</KW>
<KW># and facts change, which is exactly why they shouldn't be baked in.</KW>`,
    build: "Ask a model a question only your organisation could answer. Then paste the relevant paragraph in and ask again. That difference is the entire value of RAG.",
    check: "Why is RAG usually the right answer for factual questions and fine-tuning the wrong one?",
  },
  {
    num: "01",
    title: "Chunking decides everything",
    time: "Week 2",
    why: "Chunking is the least glamorous part of RAG and the single biggest determinant of whether retrieval works. Most tutorials use a fixed character split and never explain what that costs you.",
    learn: [
      "Fixed-size vs. recursive vs. semantic chunking, and the tradeoffs",
      "Chunk overlap — why it exists and what breaks without it",
      "Preserving metadata (source, page, section) alongside each chunk",
    ],
    code: `import re

<KW># Naive: can slice a sentence — or an idea — clean in half</KW>
chunks = [text[i:i + 1000] for i in range(0, len(text), 1000)]

<KW># Better: split on structure first, fall back to size</KW>
def recursive_split(text, max_len=1000, overlap=100):
    paragraphs = re.split(r"\\n\\n+", text)
    out, current = [], ""
    for p in paragraphs:
        if len(current) + len(p) > max_len:
            out.append(current)
            current = current[-overlap:] + p   <KW># carry context across the seam</KW>
        else:
            current = f"{current}\\n\\n{p}" if current else p
    if current:
        out.append(current)
    return out`,
    build: "Chunk the same document three ways (fixed, recursive, paragraph-aware) and compare which chunks actually contain complete, answerable ideas.",
    check: "Why does splitting a document by fixed character count produce worse retrieval than splitting on semantic boundaries?",
  },
  {
    num: "02",
    title: "Embeddings & vector search",
    time: "Week 3",
    why: "Embeddings are where “search by meaning instead of keywords” becomes real — and understanding vector similarity is what lets you debug retrieval instead of just hoping it works.",
    learn: [
      "What an embedding vector actually represents",
      "Cosine similarity, and why it's the standard distance measure here",
      "Vector databases vs. a simple in-memory array (and when you truly need one)",
    ],
    code: `import math

<KW># Cosine similarity — the whole mechanism, in five lines</KW>
def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x * x for x in a))
    mag_b = math.sqrt(sum(y * y for y in b))
    return dot / (mag_a * mag_b)

<KW># 1.0 = identical meaning, 0 = unrelated, -1 = opposite</KW>

<KW># Retrieval is just: embed the question, score every chunk, take the top k</KW>
<KW># numpy does the same thing across thousands of vectors at once</KW>`,
    build: "Implement semantic search over ~50 chunks using only an array and cosine similarity — no vector database, so the mechanism stays visible.",
    check: "Two sentences with no words in common can still have very similar embeddings. Why?",
  },
  {
    num: "03",
    title: "Vector databases",
    time: "12 min",
    why: "Comparing a question against every chunk works until you have a hundred thousand of them. A vector database exists to make that search sublinear — and the price it charges is exactness, which is a trade worth understanding before you pick one.",
    learn: [
      "Why brute-force cosine similarity stops scaling, and roughly when",
      "Approximate nearest neighbour: HNSW and IVF, in plain terms",
      "Metadata filtering, and why it usually matters more than the index",
    ],
    code: `<KW># Brute force: exact, and O(n) per query.</KW>
<KW>#   1,000 chunks    → fine, use a list</KW>
<KW>#   100,000 chunks  → slow enough to notice</KW>
<KW>#   10,000,000      → not an option</KW>

<KW># ANN indexes trade a little recall for a lot of speed:</KW>
<KW>#   HNSW  a navigable graph — fast, memory-hungry</KW>
<KW>#   IVF   cluster first, then search a few clusters</KW>

results = collection.query(
    query_embeddings=[q_vec],
    n_results=4,
    where={"tenant": "acme", "lang": "en"},   <KW># filter, don't just rank</KW>
)

<KW># The filter is often the real win: searching one customer's 500</KW>
<KW># documents beats approximating across everyone's 5 million.</KW>`,
    build: "Load a few thousand chunks into a local vector store, run the same query with and without a metadata filter, and compare both speed and relevance.",
    check: "What does an approximate index give up, and what does it buy?",
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
    code: `def answer_with_rag(question):
    q_vec = embed(question)

    scored = [
        {**c, "score": cosine_similarity(q_vec, c["embedding"])}
        for c in store
    ]
    top = sorted(scored, key=lambda c: c["score"], reverse=True)[:4]

    <KW># Log the scores — this is how you tell a retrieval bug from a</KW>
    <KW># generation bug, and they need completely different fixes.</KW>
    print([round(c["score"], 3) for c in top])

    context = "\\n\\n".join(f'[{c["source"]}] {c["text"]}' for c in top)

    return call_llm([
        {"role": "system",
         "content": "Answer only from the context. If it isn't there, say so."},
        {"role": "user", "content": f"{context}\\n\\nQuestion: {question}"},
    ])`,
    build: "A working RAG app over your own documents — with retrieval scores logged so you can actually diagnose bad answers.",
    check: "Your RAG app retrieves the right chunk but still answers incorrectly. Where's the bug most likely to be?",
  },
  {
    num: "05",
    title: "Retrieval quality",
    time: "14 min",
    why: "Most RAG systems that answer badly are retrieving badly. Embeddings alone miss exact terms — product codes, names, error numbers — because semantic similarity isn't the same as containing the word.",
    learn: [
      "Where pure vector search fails: identifiers, rare words, negation",
      "Hybrid search — combining keyword (BM25) with vector scores",
      "Reranking: a slower, better model scoring the shortlist",
    ],
    code: `<KW># Vector search alone can miss an exact token entirely:</KW>
<KW>#   query "error PX-4471"  → returns chunks about errors in general</KW>

<KW># Hybrid: run both, fuse the ranks.</KW>
def hybrid(query, k=20):
    dense = vector_search(query, k)
    sparse = bm25_search(query, k)
    return reciprocal_rank_fusion(dense, sparse)   <KW># no score tuning</KW>

<KW># Then rerank the shortlist with a cross-encoder:</KW>
top = reranker.rank(query, hybrid(query, k=20))[:4]

<KW># Retrieve 20 cheaply, rerank to 4 carefully. Reranking all</KW>
<KW># 100,000 would be accurate and unusably slow.</KW>`,
    build: "Find a query your vector search gets wrong — try an exact product code. Add keyword search alongside it and check whether fusion fixes it.",
    check: "Why does semantic search miss an exact error code, and what fixes it?",
  },
  {
    num: "06",
    title: "Citations and grounding",
    time: "12 min",
    why: "An answer a user can't verify is an answer they shouldn't trust. Citations are the difference between a demo and something an organisation will actually put in front of customers — and they're also your best debugging tool.",
    learn: [
      "Carrying source metadata through chunking and retrieval",
      "Asking for citations in a form you can check programmatically",
      "Detecting an ungrounded answer, and refusing instead of guessing",
    ],
    code: `<KW># The source has to survive the whole pipeline, from chunk to prompt.</KW>
context = "\\\\n\\\\n".join(
    f"[{i}] ({c['source']} p{c['page']})\\\\n{c['text']}"
    for i, c in enumerate(top)
)

prompt = f"""{context}

Answer using only the passages above. Cite the ones you used as [0], [1].
If the passages do not contain the answer, say so and cite nothing."""

<KW># Then verify — a citation the model invented is worse than none:</KW>
cited = {int(n) for n in re.findall(r"\\\\[(\\\\d+)\\\\]", answer)}
if not cited or max(cited, default=-1) >= len(top):
    <KW># No citations, or one that doesn't exist. Don't ship this answer.</KW>
    return "I couldn't find that in the documents."`,
    build: "Add citations to your RAG pipeline and then write the check that rejects an answer citing a passage that wasn't retrieved.",
    check: "Why should you verify the citations the model produced rather than just displaying them?",
  },
];
