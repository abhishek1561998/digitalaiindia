// Server-only quiz bank for the System Design track. Correct answers never
// ship to the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const SYSDESIGN_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "Your API handles 100 requests/second fine but falls over at 500. Where do you look first?",
    options: ["Rewrite it in a faster language", "Measure first — find which resource saturates (CPU, memory, DB connections, disk I/O) before changing anything, because the bottleneck is rarely where you'd guess", "Add more servers immediately", "Switch databases"],
    correctIndex: 1,
    explanation: "Optimizing without measuring is guessing. In practice the limit is usually something unglamorous like an exhausted database connection pool — which no amount of rewriting or extra servers would fix.",
  },
  {
    stage: 1,
    question: "Why does adding a second server sometimes make a stateful app behave worse rather than better?",
    options: ["Two servers are always slower", "If session state lives in one server's memory, a user's next request may hit the other server and appear logged out — statefulness breaks horizontal scaling", "Servers conflict over the same port", "It doesn't — more servers is always better"],
    correctIndex: 1,
    explanation: "In-memory state is invisible to the other instance. Users get randomly logged out as the load balancer alternates between servers — which is why statelessness (JWTs, shared session store) is the precondition for scaling horizontally.",
  },
  {
    stage: 2,
    question: "When does adding a database index make things slower rather than faster?",
    options: ["Never — indexes always help", "On write-heavy tables — every INSERT/UPDATE must also update the index, so unused or redundant indexes add write cost for no read benefit", "Only on tables under 100 rows", "Indexes never affect writes"],
    correctIndex: 1,
    explanation: "An index is a second data structure the database maintains on every write. On a hot write path, a pile of unused indexes is pure overhead — indexes are a read/write tradeoff, not free speed.",
  },
  {
    stage: 3,
    question: "What's the hardest part of caching, and why is it hard?",
    options: ["Choosing a cache library", "Invalidation — knowing when cached data has become stale and clearing it at the right time, because being wrong means serving incorrect data confidently", "Installing Redis", "Deciding the cache size"],
    correctIndex: 1,
    explanation: "Reading and writing a cache is trivial. Knowing every code path that makes cached data stale — and clearing it in all of them — is the hard part, and getting it wrong means confidently serving wrong data with no error anywhere.",
  },
  {
    stage: 4,
    question: "Why does sending a welcome email inside the signup request handler hurt the user, not just the architecture?",
    options: ["It doesn't hurt anyone", "The user waits for the email service to respond before their signup completes — and if the email service is down or slow, signup fails or hangs for something that isn't essential to it", "Emails must legally be sent asynchronously", "It uses more memory"],
    correctIndex: 1,
    explanation: "You've coupled a critical path (signup) to a non-critical dependency (email). The user pays the latency, and an email provider outage becomes a signup outage — for a step that didn't need to be synchronous at all.",
  },
  {
    stage: 5,
    question: "In CAP terms, what are you actually choosing between during a network partition?",
    options: ["Speed and cost", "Consistency (every read sees the latest write, some requests fail) vs. Availability (every request gets a response, some may be stale) — you cannot have both while partitioned", "Security and performance", "SQL and NoSQL"],
    correctIndex: 1,
    explanation: "Partition tolerance isn't optional in a distributed system — networks fail. So during a partition you must choose: refuse requests you can't answer correctly (CP), or answer with possibly-stale data (AP).",
  },
  {
    stage: 6,
    question: "Why is 'we'll add monitoring later' a bigger problem than it sounds?",
    options: ["It isn't — monitoring can always be added later", "Without monitoring you don't know your system is broken until users tell you, you can't tell whether a change helped or hurt, and you'll debug outages blind under maximum pressure", "Monitoring is only needed for large companies", "It just costs more to add later"],
    correctIndex: 1,
    explanation: "Monitoring isn't a nice-to-have layer on top — it's how you find out there's a problem at all, and the only way to know whether your fix worked. Adding it during an incident is the worst possible time.",
  },
  {
    stage: 7,
    question: "A junior asks why your design uses a queue instead of just calling the service directly. What's the strongest single reason?",
    options: ["Queues are the modern way to do things", "Decoupling — the producer doesn't have to wait for or even know about the consumer, so a slow or temporarily down consumer doesn't take the producer down with it", "Queues are always faster", "Direct calls don't work across servers"],
    correctIndex: 1,
    explanation: "A queue turns a hard dependency into a soft one. The consumer can be slow, restarting, or briefly down, and the producer keeps working — the messages simply wait. That fault isolation is the core value, not speed.",
  },
  {
    stage: 8,
    question: "In a system design interview, why is starting by naming technologies ('I'll use Kafka and Redis') a weak opening?",
    options: ["It's actually the ideal opening", "You haven't yet established requirements, scale, or constraints — technology choices are only defensible as answers to a problem you've defined, and naming them first signals pattern-matching rather than reasoning", "Interviewers dislike those specific tools", "You should never mention technologies at all"],
    correctIndex: 1,
    explanation: "Those tools might be exactly right — but you can't justify them yet, and that's what's being assessed. Establishing requirements first means every technology you name afterward arrives as a conclusion rather than a guess.",
  },
];
