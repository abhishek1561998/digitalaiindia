// Server-only quiz bank for the Project Building track. Correct answers
// never ship to the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const PROJECT_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "Why does 'build a clone of a popular app' usually make a weaker portfolio piece than a smaller original idea?",
    options: ["Clones are technically harder", "Every reviewer has seen the same clone dozens of times, the product decisions were already made for you, and it demonstrates following rather than thinking", "Clones are illegal to put on a resume", "There's no difference at all"],
    correctIndex: 1,
    explanation: "A clone shows you can follow a spec someone else wrote. An original project — even a much smaller one — shows you can identify a problem, decide what to build, and cut what doesn't matter. That's the harder and rarer signal.",
  },
  {
    stage: 1,
    question: "What actually makes a scope 'too big' for a portfolio project?",
    options: ["More than 1,000 lines of code", "It can't reach a working, demonstrable state in the time you have — an unfinished ambitious project shows less than a finished modest one", "Anything with a database", "More than three screens"],
    correctIndex: 1,
    explanation: "Scope is only 'too big' relative to your available time. A half-built ambitious app can't be demoed, can't be deployed, and can't be discussed with confidence — so it communicates less than something small that actually works.",
  },
  {
    stage: 2,
    question: "Why commit and push on day one, before the project does anything useful?",
    options: ["To inflate your commit count", "Because it forces the repo, .gitignore, and deploy path to exist while the project is trivial — discovering a secret got committed or the build fails is far cheaper now than in week three", "Git requires it", "It doesn't matter when you start"],
    correctIndex: 1,
    explanation: "Every setup problem is easiest to fix when there's nothing to lose. A leaked secret on day one costs a key rotation; the same leak found in week three may be buried in dozens of commits of history.",
  },
  {
    stage: 3,
    question: "Why build the ugliest working version first instead of designing the UI upfront?",
    options: ["Because design doesn't matter", "Because until the core flow works end to end you don't yet know what the UI needs to accommodate — designing first means redesigning after the first real constraint appears", "Because ugly apps are more authentic", "You should always design first"],
    correctIndex: 1,
    explanation: "Real constraints — loading states, error cases, data shapes you didn't anticipate — only surface once the flow actually runs. Designing before that means designing for an imagined product, then reworking it.",
  },
  {
    stage: 4,
    question: "Your app works perfectly for you but breaks for the first real user. What's the most likely category of cause?",
    options: ["They used it wrong", "Assumptions you never noticed you made — empty states, slow networks, unexpected input, a different screen size, or not being already logged in", "Their device is broken", "Random chance"],
    correctIndex: 1,
    explanation: "You test the happy path on a fast laptop with seeded data and an active session. A real user arrives with none of that — empty database, slow phone network, and no idea what you assumed they'd click first.",
  },
  {
    stage: 5,
    question: "Why deploy before the project feels finished?",
    options: ["To rush it out", "Deployment surfaces an entirely different class of bug (env vars, build config, CORS, cold starts) — finding those in week two is far cheaper than discovering them the night before you need to share the link", "Deployed apps develop faster", "It's not a good idea"],
    correctIndex: 1,
    explanation: "Production is a genuinely different environment, and its failures don't appear locally. Deploying early converts those from a last-minute emergency into a routine fix while there's still time.",
  },
  {
    stage: 6,
    question: "What does a good README do that a reviewer actually cares about?",
    options: ["List every dependency version", "Show what the project does and why it exists in the first few lines — ideally with a live link and a screenshot — because most reviewers decide whether to look deeper within about 30 seconds", "Explain every function in the codebase", "Nothing — nobody reads READMEs"],
    correctIndex: 1,
    explanation: "Reviewers skim. If the top of your README doesn't answer 'what is this and why should I care', they won't scroll to the part where you explain your clever architecture — and the work you did goes unseen.",
  },
  {
    stage: 7,
    question: "Why is 'I built a full-stack app with React and Node' a weak way to describe your project?",
    options: ["It's a strong description", "It describes the tools, not the problem you solved or the decisions you made — every candidate says this, so it distinguishes you from nobody", "React and Node are unpopular", "It's too long"],
    correctIndex: 1,
    explanation: "Tool names are the least differentiated thing you can say — hundreds of candidates say the identical sentence. The problem you chose, the tradeoff you made, and what you'd change are what actually distinguish you.",
  },
  {
    stage: 8,
    question: "What makes a project genuinely worth continuing after it's 'done'?",
    options: ["Nothing — move on immediately to a new project", "That someone (even one real person, including you) actually uses it — real usage generates real feedback and real problems, which is where the interesting engineering starts", "That it has the most stars", "That it uses the newest framework"],
    correctIndex: 1,
    explanation: "Real usage produces problems you'd never invent yourself — edge cases, performance under real data, confusing flows. That's where a project stops being an exercise and starts teaching you things tutorials can't.",
  },
];
