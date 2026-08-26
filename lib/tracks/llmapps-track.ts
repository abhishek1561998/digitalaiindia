// Content for the llmapps track.
//
// Split out of the old single "AI engineering" track: one 27-lesson course
// was harder to finish than four focused ones, and a lesson a day makes a
// six-lesson course a week's work rather than a month's.

import type { Stage, QuizQuestion } from "./types";

export const LLMAPPS_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why is streaming a response mostly a UX improvement rather than a speed improvement?", options: ["It genuinely makes the model faster", "Total generation time is roughly the same — streaming just shows tokens as they're produced instead of waiting for all of them, so perceived latency drops dramatically", "Streaming reduces token costs", "It isn't a UX improvement at all"] },
  { stage: 1, question: "Why does a long conversation get expensive faster than you'd expect?", options: ["Providers raise the rate for long chats", "The API is stateless, so every turn re-sends the whole history — cost grows with the square of the conversation length unless you trim or summarise", "Long conversations use a bigger model", "Latency increases the per-token price"] },
  { stage: 2, question: "The model asks to call a tool with an argument. Why must your code validate it first?", options: ["To catch typos in the tool name", "Because the model proposes and your code executes — the argument is generated text, and anything you act on without checking is a hole an injected instruction can walk through", "Because the API requires a schema check", "To keep the tool result under the token limit"] },
  { stage: 3, question: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?", options: ["It makes the bundle larger", "Anything shipped to the browser is fully readable by any user — the key can be extracted and used to run up unlimited charges on your account", "Frontend code runs slower with keys", "It's only a problem for public apps"] },
  { stage: 4, question: "Why is 'the output looked good when I tried it' an unreliable way to evaluate an LLM feature?", options: ["It's actually a reliable method", "A handful of manual spot-checks can't catch regressions, edge cases, or the model's variance across runs — you need a repeatable eval set with expected behaviors to know if a prompt change made things better or worse", "Manual testing is too slow, but otherwise fine", "Because outputs are always correct anyway"] },
  { stage: 5, question: "You ship an LLM feature and costs are 10x your estimate. What are the most likely causes?", options: ["The provider is overcharging", "Sending far more context than necessary on every call (whole documents instead of retrieved chunks), no caching of repeated queries, retry loops on failures, or using a larger model than the task needs", "LLMs are just inherently unaffordable", "Users are calling the API too politely"] },
  { stage: 6, question: "What are the three ways an agent loop must be able to terminate?", options: ["Success, failure, timeout", "A step cap, a cost ceiling, and the model returning no tool call — without all three, one bad task can loop until it exhausts your budget", "User cancel, network error, and rate limit", "Only a step cap is needed"] },
];

export const LLMAPPS_STAGES: Stage[] = [
  {
    num: "00",
    title: "Streaming, latency & real UX",
    time: "Week 4–5",
    why: "An LLM feature that makes users stare at a spinner for 8 seconds feels broken even when it's working perfectly. Streaming is the difference between “slow” and “alive.”",
    learn: [
      "Server-sent events and streaming responses token by token",
      "Perceived vs. actual latency, and why streaming fixes the first not the second",
      "Handling partial responses, cancellation, and mid-stream errors",
    ],
    code: `from fastapi.responses import StreamingResponse

<KW># Stream tokens as they arrive instead of buffering the whole reply</KW>
@app.post("/chat")
def chat(body: ChatRequest):
    def generate():
        for chunk in llm.chat(messages=body.messages, stream=True):
            yield chunk.text      <KW># each token leaves as soon as it exists</KW>

    return StreamingResponse(generate(), media_type="text/event-stream")

<KW># Total generation time is unchanged. Time to the first word is what</KW>
<KW># moved, and that is the number a user actually experiences.</KW>`,
    build: "Add streaming to the Stage 4 RAG app — tokens appear as they generate, with a working cancel button.",
    check: "Why is streaming mostly a UX improvement rather than a genuine speed improvement?",
  },
  {
    num: "01",
    title: "Conversation memory",
    time: "12 min",
    why: "The API is stateless. Every 'it remembers what I said' feature is you re-sending the history, which means memory is a cost and a context-budget problem long before it's a product feature.",
    learn: [
      "Statelessness: you send the whole conversation, every single turn",
      "Windowing, summarising, and what each one loses",
      "Separating durable facts from transient chat",
    ],
    code: `<KW># Turn 10 sends turns 1-10. Cost grows with the square of the</KW>
<KW># conversation length if you never trim.</KW>

def build_messages(history, system):
    recent = history[-6:]                  <KW># verbatim</KW>
    older = history[:-6]
    if older:
        summary = summarise(older)         <KW># one paragraph</KW>
        recent = [{"role": "user", "content": f"Earlier: {summary}"}] + recent
    return [{"role": "system", "content": system}, *recent]

<KW># Durable facts ("their name is Asha", "they're on the annual plan")</KW>
<KW># belong in your database and the system prompt — not in a summary</KW>
<KW># that will be re-summarised until it's wrong.</KW>`,
    build: "Build a chat loop that summarises anything older than six turns. Log the token count per turn and watch what the summarisation saves.",
    check: "Why does a long conversation get expensive faster than you'd expect?",
  },
  {
    num: "02",
    title: "Tool use",
    time: "14 min",
    why: "Tool use is how a model stops guessing and starts checking. You describe functions, the model asks you to run one, you run it and hand back the result. Crucially, you run it — which is where every safety decision lives.",
    learn: [
      "The loop: describe tools, receive a call, execute, return the result",
      "Writing a description the model can actually choose correctly from",
      "Why you validate arguments — the model proposes, your code disposes",
    ],
    code: `tools = [{
    "name": "get_order",
    "description": "Look up an order by its ID. Use when the user mentions an order number.",
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string"}},
        "required": ["order_id"],
    },
}]

response = client.messages.create(model=MODEL, tools=tools, messages=messages)

for block in response.content:
    if block.type == "tool_use":
        <KW># The model proposed this. Validate before you act on it.</KW>
        if not re.fullmatch(r"ORD-\\\\d{6}", block.input["order_id"]):
            result = {"error": "invalid order id"}
        else:
            result = get_order(block.input["order_id"])
        messages.append({"role": "user", "content": [
            {"type": "tool_result", "tool_use_id": block.id, "content": str(result)}
        ]})`,
    build: "Give a model one tool that looks something up in a dict. Then ask it something the tool can't answer, and watch whether it calls the tool anyway.",
    check: "The model asks to call a tool with an argument. Why must your code validate it first?",
  },
  {
    num: "03",
    title: "Keys, limits, and failure",
    time: "Week 5–6",
    why: "The gap between a working demo and a real product is almost entirely error handling, key security, and rate limits — the parts no tutorial covers because they're not exciting.",
    learn: [
      "Never exposing API keys client-side, and proxying through your own backend",
      "Rate limits, retries with exponential backoff, and graceful degradation",
      "Token budgeting and cost estimation before you ship",
    ],
    code: `import os
import time

<KW># Retry with exponential backoff — rate limits are normal, not exceptional</KW>
def call_with_retry(fn, max_attempts=3):
    for attempt in range(1, max_attempts + 1):
        try:
            return fn()
        except RateLimitError:
            if attempt == max_attempts:
                raise
            time.sleep(2 ** attempt)      <KW># 2s, 4s, 8s</KW>

<KW># The key lives ONLY on the server. Anything shipped to a browser is</KW>
<KW># readable by anyone who opens devtools.</KW>
api_key = os.environ["ANTHROPIC_API_KEY"]`,
    build: "Harden the RAG app — server-side key handling, retry with backoff, per-user rate limiting, and a real fallback when the provider is down.",
    check: "What's the most important reason to never put a provider API key in frontend code, even in a 'private' app?",
  },
  {
    num: "04",
    title: "Knowing if it works",
    time: "Week 6–7",
    why: "This is the stage that separates AI engineers from people who prompt-and-hope. Without evals, every prompt change is a guess and every regression ships silently.",
    learn: [
      "Building a small eval set of real questions with expected behaviors",
      "Automated checks: does it cite sources, refuse when it should, stay in format",
      "LLM-as-judge — where it's useful and where it quietly misleads you",
    ],
    code: `import re

eval_set = [
    {"q": "What's the refund window?", "must_contain": ["30 days"]},
    {"q": "Who won the 2026 election?", "should_refuse": True},   <KW># not in our docs</KW>
]

for test in eval_set:
    answer = answer_with_rag(test["q"])

    passed = all(s in answer for s in test.get("must_contain", []))
    if test.get("should_refuse"):
        passed = bool(re.search(r"don't know|not in|no information", answer, re.I))

    print("PASS" if passed else "FAIL", test["q"])

<KW># Run this on every prompt change. "It looked good when I tried it"</KW>
<KW># cannot tell you whether you just made things worse.</KW>`,
    build: "Write a 15-question eval set for your RAG app and run it before and after a prompt change — measure whether you actually improved anything.",
    check: "Why is “the output looked good when I tried it” an unreliable way to evaluate an LLM feature?",
  },
  {
    num: "05",
    title: "Cost, caching & shipping something real",
    time: "Week 7–8",
    why: "LLM features can quietly cost 10–100x more than expected. Cost engineering isn't premature optimization here — it's the difference between a product you can afford to run and one you shut down.",
    learn: [
      "Where tokens actually go, and cutting context without hurting quality",
      "Caching embeddings and repeated queries",
      "Choosing the right model size per task instead of defaulting to the largest",
    ],
    code: `import hashlib

<KW># Embeddings for unchanged documents never need recomputing — cache them</KW>
cache_key = hashlib.sha256(chunk_text.encode()).hexdigest()
embedding = cache.get(cache_key)
if embedding is None:
    embedding = embed(chunk_text)
    cache.set(cache_key, embedding)

<KW># Cheapest possible win: don't send what you don't need</KW>
<KW># Whole 50-page doc every call → thousands of tokens per request</KW>
<KW># Top 4 retrieved chunks → a few hundred, and usually a better answer</KW>`,
    build: "Instrument your RAG app for cost — log tokens per request, add embedding caching, and measure the before/after difference.",
    check: "You ship an LLM feature and costs come in 10x your estimate. What are the most likely causes?",
  },
  {
    num: "06",
    title: "When not to build an agent",
    time: "14 min",
    why: "An agent is a loop: call the model, run a tool, feed the result back, repeat until done. That's it. The engineering isn't the loop — it's the stopping condition, the cost ceiling, and honestly assessing whether a fixed pipeline would have been better.",
    learn: [
      "The loop, and the three ways it must be able to stop",
      "Cost and latency: every iteration is another full call",
      "The real question — is the sequence of steps actually unknown?",
    ],
    code: `def run_agent(task, max_steps=8, budget_tokens=50_000):
    messages = [{"role": "user", "content": task}]
    used = 0

    for step in range(max_steps):                 <KW># stop 1: step cap</KW>
        response = call_model(messages, tools=TOOLS)
        used += response.usage.total_tokens
        if used > budget_tokens:                  <KW># stop 2: cost cap</KW>
            return "Budget exhausted."
        if not has_tool_call(response):           <KW># stop 3: it's done</KW>
            return response.text
        messages += run_tools(response)

    return "Step limit reached."

<KW># Before writing this: if you already know the steps, write the</KW>
<KW># steps. A pipeline is cheaper, faster and debuggable. Agents earn</KW>
<KW># their cost only when the path genuinely can't be known in advance.</KW>`,
    build: "Write the loop above with all three stopping conditions, then deliberately give it a task it can't finish and confirm it stops.",
    check: "What are the three ways an agent loop must be able to terminate, and why does each one matter?",
  },
];
