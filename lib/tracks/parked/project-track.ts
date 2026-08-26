// Shared content for the Project Building track — used by both
// /learn/project-building and /learn/project-building/course.

import type { Stage, QuizQuestion } from "../types";

export const PROJECT_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "Why does 'build a clone of a popular app' usually make a weaker portfolio piece than a smaller original idea?", options: ["Clones are technically harder", "Every reviewer has seen the same clone dozens of times, the product decisions were already made for you, and it demonstrates following rather than thinking", "Clones are illegal to put on a resume", "There's no difference at all"] },
  { stage: 1, question: "What actually makes a scope 'too big' for a portfolio project?", options: ["More than 1,000 lines of code", "It can't reach a working, demonstrable state in the time you have — an unfinished ambitious project shows less than a finished modest one", "Anything with a database", "More than three screens"] },
  { stage: 2, question: "Why commit and push on day one, before the project does anything useful?", options: ["To inflate your commit count", "Because it forces the repo, .gitignore, and deploy path to exist while the project is trivial — discovering a secret got committed or the build fails is far cheaper now than in week three", "Git requires it", "It doesn't matter when you start"] },
  { stage: 3, question: "Why build the ugliest working version first instead of designing the UI upfront?", options: ["Because design doesn't matter", "Because until the core flow works end to end you don't yet know what the UI needs to accommodate — designing first means redesigning after the first real constraint appears", "Because ugly apps are more authentic", "You should always design first"] },
  { stage: 4, question: "Your app works perfectly for you but breaks for the first real user. What's the most likely category of cause?", options: ["They used it wrong", "Assumptions you never noticed you made — empty states, slow networks, unexpected input, a different screen size, or not being already logged in", "Their device is broken", "Random chance"] },
  { stage: 5, question: "Why deploy before the project feels finished?", options: ["To rush it out", "Deployment surfaces an entirely different class of bug (env vars, build config, CORS, cold starts) — finding those in week two is far cheaper than discovering them the night before you need to share the link", "Deployed apps develop faster", "It's not a good idea"] },
  { stage: 6, question: "What does a good README do that a reviewer actually cares about?", options: ["List every dependency version", "Show what the project does and why it exists in the first few lines — ideally with a live link and a screenshot — because most reviewers decide whether to look deeper within about 30 seconds", "Explain every function in the codebase", "Nothing — nobody reads READMEs"] },
  { stage: 7, question: "Why is 'I built a full-stack app with React and Node' a weak way to describe your project?", options: ["It's a strong description", "It describes the tools, not the problem you solved or the decisions you made — every candidate says this, so it distinguishes you from nobody", "React and Node are unpopular", "It's too long"] },
  { stage: 8, question: "What makes a project genuinely worth continuing after it's 'done'?", options: ["Nothing — move on immediately to a new project", "That someone (even one real person, including you) actually uses it — real usage generates real feedback and real problems, which is where the interesting engineering starts", "That it has the most stars", "That it uses the newest framework"] },
];

export const PROJECT_STAGES: Stage[] = [
  {
    num: "00",
    title: "Choosing something worth building",
    time: "Week 1",
    why: "The single biggest reason portfolio projects fail isn't technical — it's picking a project you don't care about, or one that's been built ten thousand times identically.",
    learn: [
      "Why clones make weak portfolio pieces (and the narrow case where they don't)",
      "Finding problems from your own life — the ones you can evaluate honestly",
      "Judging an idea by whether it's demonstrable, not by whether it's impressive",
    ],
    code: `<KW>// Weak: no decisions of yours are visible in this</KW>
"A Netflix clone"

<KW>// Stronger: a real problem, a scope you can finish, decisions you must make</KW>
"A tool that tracks which of my college assignments are due,
 pulls deadlines from a shared class calendar, and nags me
 at a time I actually choose."

<KW>// The test: can you explain, in one sentence, who it's for</KW>
<KW>// and what specifically it makes easier?</KW>`,
    build: "Write down 5 problems you personally have. For each, one sentence on who else has it and what the smallest useful version looks like.",
    check: "Why does “build a clone of a popular app” usually make a weaker portfolio piece than a smaller original idea?",
  },
  {
    num: "01",
    title: "Scoping — cutting to something you'll actually finish",
    time: "Week 1",
    why: "Ambition is why most side projects die at 60%. A finished modest project beats an abandoned ambitious one every single time, in a portfolio and in your own confidence.",
    learn: [
      "Defining the smallest version that's genuinely useful to one person",
      "Ruthless feature triage: must-have vs. nice-to-have vs. never",
      "Time-boxing, and planning for the fact that everything takes longer",
    ],
    code: `<KW>// Everything you thought of</KW>
[auth, reminders, calendar sync, mobile app, sharing,
 dark mode, notifications, analytics, export, teams]

<KW>// The version that ships in 3 weeks</KW>
[auth, reminders, calendar sync]

<KW>// Everything else goes in a "later" list — visible, but not blocking.</KW>
<KW>// Cutting scope is a skill, not an admission of defeat.</KW>`,
    build: "Take your chosen idea and write the must-have list. If it's more than 3–4 items, cut again until it isn't.",
    check: "What actually makes a scope “too big” for a portfolio project?",
  },
  {
    num: "02",
    title: "Setting up like it matters",
    time: "Week 1–2",
    why: "Ten minutes of setup on day one prevents the specific disasters — committed secrets, unreproducible environments, a broken deploy discovered too late — that kill projects in week three.",
    learn: [
      "Git from commit one: .gitignore, meaningful commit messages",
      "Environment variables and .env.example from the start",
      "A README written before the code, not after",
    ],
    code: `<KW>// .gitignore — before your first commit, not after the leak</KW>
node_modules/
.env
.DS_Store
dist/

<KW>// .env.example — committed, documents what's needed without leaking it</KW>
DATABASE_URL=
JWT_SECRET=

<KW>// A secret that reaches git history isn't fixed by deleting the file —</KW>
<KW>// it's in the history. You have to rotate the key.</KW>`,
    build: "Initialize the repo properly, push a working “hello world” to production on day one, and confirm the deploy pipeline runs.",
    check: "Why commit and push on day one, before the project does anything useful?",
  },
  {
    num: "03",
    title: "Building the ugly version first",
    time: "Week 2–3",
    why: "Designing before the core flow works means designing for a product you don't understand yet. Make it work, then make it good — in that order, always.",
    learn: [
      "Vertical slices — one complete flow beats five half-finished features",
      "Deliberately deferring styling until the flow is proven",
      "Committing at every working state so you can always retreat to one",
    ],
    code: `<KW>// Vertical slice: one flow, working end to end, ugly but real</KW>
User submits form → API saves to DB → list shows it back

<KW>// NOT: build all the UI, then all the API, then hope they connect</KW>

<KW>// Once one slice works, the next is far easier —</KW>
<KW>// the hard integration questions are already answered.</KW>`,
    build: "Build one complete vertical slice of your app — unstyled, but genuinely working end to end.",
    check: "Why build the ugliest working version first instead of designing the UI upfront?",
  },
  {
    num: "04",
    title: "Making it real — edge cases and honest states",
    time: "Week 3–4",
    why: "The difference between a demo and a product is entirely in what happens when things go wrong — and things go wrong constantly for real users on real networks.",
    learn: [
      "Loading, empty, and error states as required work, not polish",
      "Input validation on both sides, and what each side is actually for",
      "Testing on a slow connection and a real phone, not just your laptop",
    ],
    code: `<KW>// The four states every data-driven view actually has</KW>
if (loading) return <Spinner />;
if (error)   return <ErrorMessage retry={refetch} />;
if (!items.length) return <EmptyState hint="Add your first task" />;
return <List items={items} />;

<KW>// Skipping the middle two is why demos break in front of people.</KW>`,
    build: "Go through every screen and handle all four states properly. Then throttle your network to 3G in devtools and use the app.",
    check: "Your app works perfectly for you but breaks for the first real user. What's the most likely category of cause?",
  },
  {
    num: "05",
    title: "Shipping it live",
    time: "Week 4",
    why: "A project only on localhost effectively doesn't exist — nobody will clone your repo to try it. The live URL is what makes it real to anyone else.",
    learn: [
      "Deploying frontend and backend, and wiring production config",
      "Production environment variables and secrets handling",
      "Custom domains, and why a real URL changes how the project is perceived",
    ],
    code: `<KW>// Fail loudly at startup if config is missing —</KW>
<KW>// far better than a mysterious 500 an hour into debugging</KW>
const required = ["DATABASE_URL", "JWT_SECRET"];
for (const key of required) {
  if (!process.env[key]) throw new Error(\`Missing env var: \${key}\`);
}

<KW>// Deploy early and often. The first deploy always surprises you;</KW>
<KW>// better it surprises you in week 2 than the night before a demo.</KW>`,
    build: "Deploy the app to a real URL. Send it to one friend on their phone and watch them use it without helping.",
    check: "Why deploy before the project feels finished?",
  },
  {
    num: "06",
    title: "Documenting it so people care",
    time: "Week 5",
    why: "A reviewer gives your project about 30 seconds before deciding whether to look closer. A bad README wastes work you already did.",
    learn: [
      "A README that leads with what it does and why it exists",
      "Screenshots and a live link above the fold",
      "Documenting the interesting decision, not every function",
    ],
    code: `# TaskNudge

Tracks college assignment deadlines from a shared class calendar
and reminds you at a time you actually choose.

**[Live demo](https://tasknudge.example.com)** · [Screenshot below]

## Why I built it
I kept missing deadlines that were technically "on the calendar."

## Interesting bit
Reminder scheduling runs in a queue worker so a failed
notification retries without blocking anything else.

<KW>// Lead with what and why. Setup instructions go further down.</KW>`,
    build: "Write the README: one-line description, live link, screenshot, why you built it, and one genuinely interesting technical decision.",
    check: "What does a good README do that a reviewer actually cares about?",
  },
  {
    num: "07",
    title: "Talking about your work",
    time: "Week 5–6",
    why: "In an interview, your project is only as good as your ability to explain the decisions inside it. “I used React and Node” tells them nothing that distinguishes you.",
    learn: [
      "Framing: problem → your approach → tradeoffs → what you'd change",
      "Discussing what you'd do differently without undermining yourself",
      "Turning a bug you fixed into evidence of how you debug",
    ],
    code: `<KW>// Weak — describes tools, identical to every other candidate</KW>
"I built a full-stack app with React and Node."

<KW>// Strong — problem, decision, tradeoff, reflection</KW>
"I kept missing assignment deadlines, so I built something that
 pulls them from our class calendar and nags me on my schedule.
 The interesting part was reminders — I moved them to a queue
 worker so a failed send retries without blocking signup.
 If I rebuilt it, I'd add proper timezone handling from the start;
 I hardcoded IST and that bit me the moment a friend traveled."`,
    build: "Write and rehearse a 2-minute spoken walkthrough of your project using that structure. Record it and listen back.",
    check: "Why is “I built a full-stack app with React and Node” a weak way to describe your project?",
  },
  {
    num: "08",
    title: "Keeping it alive",
    time: "Week 6",
    why: "A project with real users — even one — generates real feedback and real problems, and that's where genuinely interesting engineering starts. It also proves you finish things.",
    learn: [
      "Getting the first real user and gathering honest feedback",
      "Deciding what to fix versus what to ignore",
      "Knowing when a project is genuinely done versus abandoned",
    ],
    code: `<KW>// The most valuable feedback loop there is:</KW>
1. Watch someone use it without helping them
2. Write down every moment they hesitate
3. Fix the top hesitation
4. Repeat

<KW>// You will learn more from one confused real user</KW>
<KW>// than from a week of adding features nobody asked for.</KW>`,
    build: "Get 3 people to use your project. Sit with them silently, write down every point of confusion, then fix the most common one.",
    check: "What makes a project genuinely worth continuing after it's “done”?",
  },
];
