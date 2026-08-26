// Content for the genai track.
//
// Split out of the old single "AI engineering" track: one 27-lesson course
// was harder to finish than four focused ones, and a lesson a day makes a
// six-lesson course a week's work rather than a month's.

import type { Stage, QuizQuestion } from "./types";

export const GENAI_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why does a model state an invented fact with the same confidence as a real one?", options: ["It's a bug in newer models", "It predicts the next likely token either way — it has no internal marker separating 'learned' from 'plausible', so fluency and truth are produced by the same mechanism", "It was trained on unreliable data", "Confidence is random"] },
  { stage: 1, question: "Why is `messages` a list even when you're asking a single question?", options: ["Backwards compatibility", "The model is always completing a conversation — one turn is just the shortest one, and the same shape carries system prompts, examples and history", "It's faster to parse", "So you can send several questions at once"] },
  { stage: 2, question: "Why does the same meaning cost more in Hindi than in English?", options: ["Indic languages need more words", "The tokeniser was trained mostly on English, so Devanagari text splits into far more tokens for the same content — often two to three times as many", "Providers charge a language surcharge", "It doesn't — cost is per character"] },
  { stage: 3, question: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?", options: ["It's a bug in the model", "The model samples the next token from a probability distribution rather than always picking the top one — temperature controls how much randomness is allowed in that sampling", "The model is learning from your previous questions", "Network latency changes the answer"] },
  { stage: 4, question: "Does `temperature=0` guarantee identical output every time?", options: ["Yes, that's exactly what it means", "No — it makes sampling greedy, but batching, hardware differences and model updates can still shift a result. The only real determinism is caching the answer", "Yes, unless the prompt changes", "No, because temperature is ignored below 0.1"] },
  { stage: 5, question: "Why is asking a model to add up numbers a bad idea, even though it usually gets it right?", options: ["It's slower than a calculator", "'Usually' is the problem — arithmetic has one correct answer and a probabilistic system can't guarantee it, while `sum()` is correct, instant and free", "Models can't parse numbers", "It costs too many tokens"] },
];

export const GENAI_STAGES: Stage[] = [
  {
    num: "00",
    title: "What generative AI actually is",
    time: "8 min",
    why: "Before any code, one correction that saves months: a language model is not a database and not a search engine. It is a next-token predictor. Almost every surprise you will hit — hallucination, inconsistency, confident wrongness — follows directly from that one sentence.",
    learn: [
      "Next-token prediction, and why that makes fluency and truth separate things",
      "What the model genuinely doesn't have: live data, memory between calls, a source",
      "Where generative AI is the right tool, and where a database or a regex is",
    ],
    code: `<KW># A model completes text. That is the whole mechanism.</KW>
<KW>#</KW>
<KW>#   "The capital of France is" → " Paris"     (learned, reliable)</KW>
<KW>#   "Our refund window is"     → " 30 days"   (invented, plausible)</KW>
<KW>#</KW>
<KW># Both come out with identical confidence. The model has no way to</KW>
<KW># mark one as known and the other as guessed.</KW>

<KW># So: never ask it for a fact you own. Give it the fact and ask it</KW>
<KW># to use it. That single move is what the rest of this track builds.</KW>`,
    build: "Ask a model three questions about your own company or college. Note which answers are right, which are wrong, and how confident each one sounded. The lack of correlation is the lesson.",
    check: "Why does a model state an invented fact with the same confidence as a real one?",
  },
  {
    num: "01",
    title: "Your first API call",
    time: "10 min",
    why: "Everything after this is elaboration on one HTTP request. Making it yourself — key in the environment, messages in, text out — removes the mystique and gives you something concrete to modify.",
    learn: [
      "The request shape every provider shares: model, messages, parameters",
      "Reading the response, and where the text actually lives",
      "Keeping the key out of your code from the very first call",
    ],
    code: `import os
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=200,
    messages=[{"role": "user", "content": "Explain RAG in two sentences."}],
)

print(response.content[0].text)

<KW># Three things to notice:</KW>
<KW>#   the key comes from the environment, never the file</KW>
<KW>#   messages is a list — it always was, even with one turn</KW>
<KW>#   the text is nested, because a response can hold more than text</KW>`,
    build: "Make the call above with your own key. Then change max_tokens to 20 and watch the answer get cut off mid-sentence rather than shortened.",
    check: "Why is `messages` a list even when you're asking a single question?",
  },
  {
    num: "02",
    title: "What you're actually paying for",
    time: "10 min",
    why: "Tokens are the unit of cost, the unit of the context limit, and the unit of latency. Every optimisation later in this track is ultimately about sending fewer of them, so it's worth building an intuition for the count now.",
    learn: [
      "Roughly four characters per token in English, and much worse in Hindi",
      "Input tokens versus output tokens, and why they're priced differently",
      "Counting before you send, instead of discovering the bill later",
    ],
    code: `<KW># Rules of thumb, English:</KW>
<KW>#   1 token  ≈ 4 characters  ≈ 0.75 words</KW>
<KW>#   1 page   ≈ 500 tokens</KW>
<KW>#   50 pages ≈ 25,000 tokens — every single call</KW>

<KW># Indic scripts tokenise far worse — often 2-3x more tokens for the</KW>
<KW># same meaning, because the tokeniser was trained mostly on English.</KW>
<KW># A Hindi-language product costs more per answer for that reason alone.</KW>

def rough_tokens(text: str) -> int:
    return len(text) // 4

<KW># Output is usually several times the price of input, so a chatty</KW>
<KW># system prompt is cheap and a chatty answer is not.</KW>`,
    build: "Take a page of English and the same page translated to Hindi, and compare rough token counts. Work out what that difference costs over 10,000 calls.",
    check: "Why does the same meaning cost more in Hindi than in English?",
  },
  {
    num: "03",
    title: "How LLMs actually work (enough to build with)",
    time: "Week 1",
    why: "You don't need to train models to build with them — but you DO need a working mental model of tokens, context, and sampling, or every weird output looks like magic instead of something you can debug.",
    learn: [
      "Tokens, context windows, and why they cost money and impose limits",
      "Temperature and sampling — why the same prompt gives different answers",
      "What models genuinely can't do — no real-time knowledge, no persistent memory between calls",
    ],
    code: `<KW># The same prompt, two very different behaviours</KW>
factual = {"temperature": 0, "prompt": "What is 2+2?"}
<KW># → "4" every single time (greedy: always picks the top token)</KW>

creative = {"temperature": 0.9, "prompt": "Write a tagline for a chai brand"}
<KW># → different output each run (samples across likely tokens)</KW>

<KW># Rule of thumb: ~1 token ≈ 4 characters of English</KW>
<KW># A 4,000-word document ≈ 5,000+ tokens of context you're paying for</KW>`,
    build: "Call an LLM API at temperature 0 and at 0.9 with the same prompt, five times each. Write down what changes and what doesn't.",
    check: "Why does an LLM sometimes give a different answer to the exact same prompt, and which parameter most directly controls that?",
  },
  {
    num: "04",
    title: "Temperature and determinism",
    time: "10 min",
    why: "The same prompt giving different answers is the first thing that feels broken. It isn't — it's sampling, and once you know which knob controls it you can choose between reliable extraction and varied writing on purpose.",
    learn: [
      "Sampling from a distribution instead of always taking the top token",
      "temperature, top_p, and why you rarely want both",
      "Where determinism matters, and why temperature 0 still isn't a guarantee",
    ],
    code: `<KW># Extraction: you want the same answer every time.</KW>
client.messages.create(model=MODEL, temperature=0, messages=[...])

<KW># Writing: you want variety.</KW>
client.messages.create(model=MODEL, temperature=1.0, messages=[...])

<KW># temperature=0 is greedy — always the most likely next token.</KW>
<KW># It is NOT a promise of identical output: batching, hardware and</KW>
<KW># model updates can all still shift a result.</KW>

<KW># If you truly need identical output, cache the answer. The only</KW>
<KW># reliable determinism is not calling the model twice.</KW>`,
    build: "Run one extraction prompt five times at temperature 0 and five at 0.9. Record exactly what varies at each setting.",
    check: "Does temperature 0 guarantee the same output every time? Why or why not?",
  },
  {
    num: "05",
    title: "When not to use a model",
    time: "10 min",
    why: "The most expensive mistake in this field is reaching for a model where a query, a regex or a lookup table would have been faster, cheaper and correct. Knowing when not to use one is a senior skill and it costs nothing to learn now.",
    learn: [
      "Tasks models are genuinely good at: summarising, rewriting, classifying, extracting",
      "Tasks they're bad at: arithmetic, exact recall, anything needing a guarantee",
      "The question to ask first — would a deterministic solution do this?",
    ],
    code: `<KW># Bad fit — a model to compute a total:</KW>
<KW>#   "Add up these 40 invoice amounts"  → sometimes wrong, always slower</KW>
<KW>#   sum(amounts)                        → correct, instant, free</KW>

<KW># Bad fit — a model to check a fixed format:</KW>
<KW>#   "Is this a valid PIN code?"        → probabilistic</KW>
<KW>#   re.fullmatch(r"\\\\d{6}", pin)         → definitive</KW>

<KW># Good fit — anything where the input is messy and the output is</KW>
<KW># judgement: summarise this complaint, is this review angry,</KW>
<KW># pull the delivery address out of this WhatsApp message.</KW>

<KW># Rule: if you can write the rule, write the rule.</KW>`,
    build: "List five things you want your product to do. For each, decide model or code, and write one sentence on why. Be honest about the ones where code wins.",
    check: "Why is asking a model to add up numbers a bad idea, even though it usually gets it right?",
  },
];
