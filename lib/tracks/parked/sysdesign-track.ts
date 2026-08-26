// Shared content for the System Design track — used by both
// /learn/system-design and /learn/system-design/course.

import type { Stage, QuizQuestion } from "../types";

export const SYSDESIGN_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Your API handles 100 requests/second fine but falls over at 500. Where do you look first?", options: ["Rewrite it in a faster language", "Measure first — find which resource saturates (CPU, memory, DB connections, disk I/O) before changing anything, because the bottleneck is rarely where you'd guess", "Add more servers immediately", "Switch databases"] },
  { stage: 1, question: "Why does adding a second server sometimes make a stateful app behave worse rather than better?", options: ["Two servers are always slower", "If session state lives in one server's memory, a user's next request may hit the other server and appear logged out — statefulness breaks horizontal scaling", "Servers conflict over the same port", "It doesn't — more servers is always better"] },
  { stage: 2, question: "When does adding a database index make things slower rather than faster?", options: ["Never — indexes always help", "On write-heavy tables — every INSERT/UPDATE must also update the index, so unused or redundant indexes add write cost for no read benefit", "Only on tables under 100 rows", "Indexes never affect writes"] },
  { stage: 3, question: "What's the hardest part of caching, and why is it hard?", options: ["Choosing a cache library", "Invalidation — knowing when cached data has become stale and clearing it at the right time, because being wrong means serving incorrect data confidently", "Installing Redis", "Deciding the cache size"] },
  { stage: 4, question: "Why does sending a welcome email inside the signup request handler hurt the user, not just the architecture?", options: ["It doesn't hurt anyone", "The user waits for the email service to respond before their signup completes — and if the email service is down or slow, signup fails or hangs for something that isn't essential to it", "Emails must legally be sent asynchronously", "It uses more memory"] },
  { stage: 5, question: "In CAP terms, what are you actually choosing between during a network partition?", options: ["Speed and cost", "Consistency (every read sees the latest write, some requests fail) vs. Availability (every request gets a response, some may be stale) — you cannot have both while partitioned", "Security and performance", "SQL and NoSQL"] },
  { stage: 6, question: "Why is 'we'll add monitoring later' a bigger problem than it sounds?", options: ["It isn't — monitoring can always be added later", "Without monitoring you don't know your system is broken until users tell you, you can't tell whether a change helped or hurt, and you'll debug outages blind under maximum pressure", "Monitoring is only needed for large companies", "It just costs more to add later"] },
  { stage: 7, question: "A junior asks why your design uses a queue instead of just calling the service directly. What's the strongest single reason?", options: ["Queues are the modern way to do things", "Decoupling — the producer doesn't have to wait for or even know about the consumer, so a slow or temporarily down consumer doesn't take the producer down with it", "Queues are always faster", "Direct calls don't work across servers"] },
  { stage: 8, question: "In a system design interview, why is starting by naming technologies ('I'll use Kafka and Redis') a weak opening?", options: ["It's actually the ideal opening", "You haven't yet established requirements, scale, or constraints — technology choices are only defensible as answers to a problem you've defined, and naming them first signals pattern-matching rather than reasoning", "Interviewers dislike those specific tools", "You should never mention technologies at all"] },
];

export const SYSDESIGN_STAGES: Stage[] = [
  {
    num: "00",
    title: "Thinking in constraints, not diagrams",
    time: "Week 1",
    why: "System design gets taught as “draw these boxes,” which is why people can reproduce a diagram but can't defend a single choice in it. Every real design decision is a tradeoff under constraints — start there.",
    learn: [
      "Latency vs. throughput vs. availability — what each actually means",
      "Back-of-envelope estimation: requests/sec, storage, bandwidth",
      "Why “it depends” is the correct answer, and what it depends ON",
    ],
    code: `<KW>// Back-of-envelope: can one server handle this?</KW>
const dailyActiveUsers = 100_000;
const requestsPerUserPerDay = 20;
const totalDaily = dailyActiveUsers * requestsPerUserPerDay; <KW>// 2,000,000</KW>

const avgPerSecond = totalDaily / 86_400;      <KW>// ~23 req/s — sounds easy</KW>
const peakPerSecond = avgPerSecond * 10;       <KW>// ~230 req/s — traffic isn't flat</KW>

<KW>// Peak, not average, is what your system must survive.</KW>
<KW>// This 10x rule of thumb catches most people out on the first estimate.</KW>`,
    build: "Estimate the infrastructure for a URL shortener at 10M links/month — storage, read/write ratio, peak QPS. Write down every assumption.",
    check: "Your API handles 100 requests/second fine but falls over at 500. Where do you look first, and why there?",
  },
  {
    num: "01",
    title: "Scaling — vertical, horizontal, and statelessness",
    time: "Week 1–2",
    why: "“Just add more servers” only works if your app is stateless — and most apps aren't, by accident. Understanding why is what makes horizontal scaling possible instead of theoretical.",
    learn: [
      "Vertical vs. horizontal scaling, and when each hits its ceiling",
      "Why statelessness is the precondition for horizontal scaling",
      "Load balancers, and what happens to in-flight requests during deploys",
    ],
    code: `<KW>// Stateful — breaks the moment you add a second server</KW>
const sessions = {}; <KW>// lives in THIS server's memory only</KW>
app.post("/login", (req, res) => {
  sessions[req.sessionId] = { userId };  <KW>// server B knows nothing about this</KW>
});

<KW>// Stateless — any server can handle any request</KW>
app.post("/login", (req, res) => {
  const token = jwt.sign({ userId }, SECRET); <KW>// state travels with the request</KW>
  res.json({ token });
});`,
    build: "Take a stateful in-memory-session app and convert it to stateless — then reason through what breaks if you run two instances of each version.",
    check: "Why does adding a second server sometimes make a stateful app behave worse rather than better?",
  },
  {
    num: "02",
    title: "Databases — indexing, replication, sharding",
    time: "Week 2–3",
    why: "The database is where most systems actually break under load. Knowing what an index costs, not just what it speeds up, is the difference between fixing and guessing.",
    learn: [
      "How indexes work, and their real write cost",
      "Read replicas, and the replication lag they introduce",
      "Sharding — and why it's a last resort, not a starting point",
    ],
    code: `<KW>// Without an index: full table scan, O(n)</KW>
SELECT * FROM orders WHERE user_id = 42;

<KW>// With an index on user_id: tree lookup, ~O(log n)</KW>
CREATE INDEX idx_orders_user ON orders(user_id);

<KW>// The cost nobody mentions: every write now maintains this index too.</KW>
<KW>// 10 indexes on a hot write table = 10 extra structures updated per INSERT.</KW>

<KW>// Replication lag is real — a read right after a write may not see it</KW>
await db.write("INSERT INTO orders ...");
const rows = await replica.read("SELECT ... "); <KW>// may be milliseconds stale</KW>`,
    build: "Load 100k rows into a local table, time a query without an index, add one, and time it again — then measure the insert slowdown.",
    check: "When does adding a database index make things slower rather than faster?",
  },
  {
    num: "03",
    title: "Caching — the biggest win and the sneakiest bugs",
    time: "Week 3",
    why: "Caching is the highest-leverage performance tool and the easiest way to serve confidently wrong data. Both halves matter equally.",
    learn: [
      "Cache layers: browser, CDN, application, database",
      "Invalidation strategies — TTL, write-through, explicit busting",
      "Cache stampede, and why a popular key expiring can take down a database",
    ],
    code: `async function getUser(id) {
  const cached = await cache.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  await cache.set(\`user:\${id}\`, JSON.stringify(user), { ttl: 300 });
  return user;
}

<KW>// The bug: update the DB, forget the cache, serve stale data for 5 minutes</KW>
async function updateUser(id, data) {
  await db.query("UPDATE users SET ... WHERE id = ?", [id]);
  await cache.del(\`user:\${id}\`); <KW>// this line is the whole ballgame</KW>
}`,
    build: "Add caching to a slow endpoint, then deliberately introduce the stale-data bug by removing the invalidation — and watch it serve wrong data.",
    check: "What's the hardest part of caching, and why specifically is it hard?",
  },
  {
    num: "04",
    title: "Async work — queues and background jobs",
    time: "Week 4",
    why: "The moment you make a user wait for something they don't need to wait for, you've built a fragile system. Queues are how you stop doing that.",
    learn: [
      "Sync vs. async work, and deciding which is which",
      "Message queues, workers, and retry semantics",
      "Idempotency — why a job must survive being run twice",
    ],
    code: `<KW>// Bad: user waits for email delivery to finish signing up</KW>
app.post("/signup", async (req, res) => {
  const user = await createUser(req.body);
  await sendWelcomeEmail(user);  <KW>// 2s — and fails signup if email is down</KW>
  res.json({ user });
});

<KW>// Good: enqueue and return immediately</KW>
app.post("/signup", async (req, res) => {
  const user = await createUser(req.body);
  await queue.add("send-welcome-email", { userId: user.id });
  res.json({ user });  <KW>// instant; email happens out of band</KW>
});

<KW>// Idempotent worker — safe if the queue delivers twice</KW>
if (await alreadySent(userId)) return;`,
    build: "Move a slow side-effect (email, image processing, report generation) out of a request handler into a queued worker with retries.",
    check: "Why does sending a welcome email inside the signup request handler hurt the user, not just the architecture?",
  },
  {
    num: "05",
    title: "Consistency, CAP, and honest tradeoffs",
    time: "Week 5",
    why: "CAP gets recited as trivia. What matters is recognizing which side of the tradeoff a given feature actually needs — a bank balance and a like count have genuinely different requirements.",
    learn: [
      "CAP theorem in practical terms, not just as a triangle",
      "Strong vs. eventual consistency, feature by feature",
      "Where eventual consistency is fine and where it's unacceptable",
    ],
    code: `<KW>// Eventual consistency is fine here — a slightly stale count harms nobody</KW>
likeCount: readFromReplica()

<KW>// Strong consistency required — stale data means real money moves wrongly</KW>
accountBalance: readFromPrimary()

<KW>// The design question is never "which is better" —</KW>
<KW>// it's "what does THIS feature actually require, and what does that cost?"</KW>`,
    build: "Take one product (a social feed, say) and classify every feature as needing strong or eventual consistency — and defend each call.",
    check: "In CAP terms, what are you actually choosing between during a network partition?",
  },
  {
    num: "06",
    title: "Observability — logs, metrics, traces",
    time: "Week 5–6",
    why: "You cannot fix what you cannot see. Observability is what turns “the site feels slow” into “this query on this endpoint regressed at 14:32.”",
    learn: [
      "The three pillars: logs, metrics, traces — and what each answers",
      "What to actually alert on (symptoms users feel, not every anomaly)",
      "Structured logging, and correlation IDs across services",
    ],
    code: `<KW>// Unstructured: unsearchable at 3am during an incident</KW>
console.log("User did something bad");

<KW>// Structured: filterable, aggregatable, correlatable</KW>
logger.info({
  event: "payment_failed",
  userId: user.id,
  amount,
  reason: err.code,
  requestId: req.id,   <KW>// ties every log line of one request together</KW>
});

<KW>// Alert on what users feel — error rate, p99 latency —</KW>
<KW>// not on every CPU spike that nobody noticed.</KW>`,
    build: "Add structured logging with request IDs to an existing app, then trace one request end to end through the logs.",
    check: "Why is “we'll add monitoring later” a bigger problem than it sounds?",
  },
  {
    num: "07",
    title: "Designing a real system, end to end",
    time: "Week 6–7",
    why: "This is where the pieces combine. A real design isn't a list of technologies — it's a sequence of decisions, each justified by a requirement you established first.",
    learn: [
      "A repeatable framework: requirements → estimates → API → data model → scale → tradeoffs",
      "Drawing the diagram last, after the reasoning, not first",
      "Naming your design's weaknesses before someone else does",
    ],
    code: `<KW>// The order that actually works, every time:</KW>
1. Functional requirements    <KW>// what must it do?</KW>
2. Non-functional            <KW>// scale, latency, availability targets</KW>
3. Back-of-envelope          <KW>// how big is this really?</KW>
4. API design                <KW>// the contract</KW>
5. Data model                <KW>// what's stored, how it's accessed</KW>
6. High-level architecture   <KW>// NOW you draw boxes</KW>
7. Scale the bottleneck      <KW>// cache/shard/queue where it hurts</KW>
8. Tradeoffs & weaknesses    <KW>// what you gave up, and why</KW>`,
    build: "Design a URL shortener and a rate limiter end to end, following all 8 steps in order — written out, not just in your head.",
    check: "A junior asks why your design uses a queue instead of just calling the service directly. What's the strongest single reason?",
  },
  {
    num: "08",
    title: "Communicating design under pressure",
    time: "Week 7–8",
    why: "System design interviews test how you think out loud, not whether you memorized an architecture. The best design communicated badly reads as a worse design.",
    learn: [
      "Structuring 45 minutes: clarify, estimate, design, scale, critique",
      "Asking clarifying questions that actually narrow the problem",
      "Handling “what if traffic 100x'd?” without abandoning your design",
    ],
    code: `<KW>// Weak opening — technology-first, requirements never established</KW>
"I'll use Kafka, Redis, and Cassandra."

<KW>// Strong opening — constraints first, technologies as consequences</KW>
"Before I design: is this read-heavy or write-heavy?
 Roughly how many daily active users?
 Is eventual consistency acceptable for the feed?"

<KW>// Every technology you name later should answer one of those.</KW>`,
    build: "Do 3 timed 45-minute mock designs out loud (record yourself) — then re-listen and mark where you jumped to a technology before establishing the requirement.",
    check: "In a system design interview, why is starting by naming technologies a weak opening?",
  },
];
