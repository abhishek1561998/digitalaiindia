// Shared content for the UI/UX track — used by both /learn/ui-ux and
// /learn/ui-ux/course.

import type { Stage, QuizQuestion } from "./types";

export const UIUX_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "A client says your design 'looks boring' but users complete tasks 40% faster on it. What does that most likely mean?", options: ["The client is right — redesign it to look more exciting", "You've probably succeeded at the actual job; 'boring' often describes an interface that isn't fighting the user for attention, and taste feedback shouldn't override measured outcomes", "Speed doesn't matter in design", "The measurement must be wrong"] },
  { stage: 1, question: "Two elements are 8px apart; a third is 40px away from them. What does a user assume before reading a single word?", options: ["Nothing — spacing carries no meaning", "That the first two belong together and the third is separate — proximity groups elements more powerfully than borders, colors, or labels", "That the third element is more important", "That the layout is broken"] },
  { stage: 2, question: "Why does a line of body text running the full width of a 27-inch monitor get harder to read, even at a comfortable font size?", options: ["The font renders differently at that width", "The eye loses its place returning to the start of the next line — readable measure is roughly 45–75 characters regardless of how much width is available", "Wide text uses more memory", "It doesn't — wider is always better"] },
  { stage: 3, question: "Your error message is red text on a white background and passes contrast. Why is that still not sufficient for conveying 'error'?", options: ["It is sufficient — red universally means error", "Roughly 1 in 12 men has some form of color vision deficiency, so color alone carries no information for them — the meaning needs a second channel like an icon or explicit text", "Red is the wrong color for errors", "White backgrounds are inaccessible"] },
  { stage: 4, question: "Why does an arbitrary spacing value like 13px cause problems even though it looks fine in isolation?", options: ["Odd numbers render blurry", "Consistency is what makes an interface feel designed rather than assembled — once values are arbitrary, every future spacing decision is a fresh guess and the whole UI drifts", "13px is too small to see", "It doesn't cause any problem"] },
  { stage: 5, question: "You've designed a button's default and hover states. Which commonly-forgotten state most often makes an interface feel broken to real users?", options: ["The italic state", "Loading — without it, a user who clicks and sees nothing happen will click again, often submitting twice", "The printed state", "There are no other states"] },
  { stage: 6, question: "Why is removing the focus outline (outline: none) one of the most damaging single lines of CSS you can write?", options: ["It isn't damaging, it just looks cleaner", "Keyboard and screen-reader users navigate by focus — with no visible indicator they cannot tell where they are on the page, making the interface effectively unusable for them", "It breaks the hover state", "It only affects older browsers"] },
  { stage: 7, question: "You watch 5 users struggle with the same step. Your PM says 'we need 100 users before we act.' What's the flaw in that reasoning?", options: ["No flaw — 100 users is the right sample", "Usability problems aren't statistical claims; if 5 of 5 people hit the same wall, the wall exists — you need large samples to measure preference, not to discover a broken flow", "5 users is already too many", "Usability testing is never reliable"] },
  { stage: 8, question: "Why does 'the developer will figure out the spacing' cause the built UI to drift from the design?", options: ["Developers are careless", "Undocumented values become guesses at build time, and dozens of small guesses compound into an interface that matches the design nowhere — tokens and specs remove the guessing", "Spacing doesn't matter in code", "It doesn't drift in practice"] },
];

export const UIUX_STAGES: Stage[] = [
  {
    num: "00",
    title: "Design is decisions, not decoration",
    time: "Week 1",
    why: "Developers often treat design as a taste layer applied at the end — which is why 'make it look nicer' feels unanswerable. Design is a set of decisions about attention, priority, and clarity, and those have defensible right answers.",
    learn: [
      "What a design is actually optimizing for — task completion, not admiration",
      "Visual hierarchy: deciding what a user should see first, second, third",
      "Why 'clean' usually means 'nothing competing for attention', not 'empty'",
    ],
    code: `<KW>// Every screen answers three questions, in this order:</KW>
1. What is this?          <KW>// orientation — where am I?</KW>
2. What can I do here?    <KW>// the primary action, unmistakable</KW>
3. What else exists?      <KW>// secondary options, quieter</KW>

<KW>// A screen with three equally-loud buttons has answered #2 with</KW>
<KW>// "you decide" — which is the designer declining to design.</KW>

<KW>// Test: squint at your screen. Whatever survives is your hierarchy.</KW>`,
    build: "Take any screen you've built. Write down what you intended users to see 1st, 2nd, 3rd — then squint at it and write down what actually stands out. Fix the gap.",
    check: "A client says your design 'looks boring' but users complete tasks 40% faster on it. What does that most likely mean?",
  },
  {
    num: "01",
    title: "Layout & visual hierarchy",
    time: "Week 1–2",
    why: "Most 'it looks off but I don't know why' interfaces are alignment and proximity problems. These are learnable rules, not intuition — which is exactly why developers can pick them up quickly.",
    learn: [
      "Proximity and grouping — spacing communicates relationship before text does",
      "Alignment, and why inconsistent edges read as sloppy even unconsciously",
      "Size, weight, and position as hierarchy tools instead of color alone",
    ],
    code: `<KW>// Spacing tells the user what belongs together, before they read anything</KW>

<KW>// Ambiguous — is the label attached to the field above or below it?</KW>
label     margin-bottom: 16px
input     margin-bottom: 16px

<KW>// Clear — tight inside a group, loose between groups</KW>
label     margin-bottom: 6px    <KW>// bound to its own input</KW>
input     margin-bottom: 28px   <KW>// separated from the next field</KW>

<KW>// The rule: space WITHIN a group must be smaller than space BETWEEN groups.</KW>`,
    build: "Take a form you've built and fix only the spacing — tighten within groups, loosen between them. Change nothing else and compare screenshots.",
    check: "Two elements are 8px apart; a third is 40px away from them. What does a user assume before reading a single word?",
  },
  {
    num: "02",
    title: "Typography that carries meaning",
    time: "Week 2",
    why: "Type is most of what's on screen in almost every app, and it's the fastest lever for making an interface feel considered — but 'pick a nice font' is the least useful part of it.",
    learn: [
      "Type scale — a fixed set of sizes instead of arbitrary values",
      "Line height and measure (line length), and why both affect readability",
      "Weight and case as hierarchy tools, and when uppercase actively hurts",
    ],
    code: `<KW>// A type scale — pick from these, never invent a size mid-project</KW>
--text-xs:   12px   <KW>// captions, metadata</KW>
--text-sm:   14px   <KW>// secondary text</KW>
--text-base: 16px   <KW>// body — never smaller for real reading</KW>
--text-lg:   20px
--text-xl:   28px
--text-2xl:  40px   <KW>// page titles</KW>

<KW>// Line height: tighter for headings, looser for body</KW>
heading  line-height: 1.15   <KW>// large text needs less breathing room</KW>
body     line-height: 1.6    <KW>// small text needs more</KW>

<KW>// Measure: cap body text around 65 characters</KW>
max-width: 65ch;`,
    build: "Define a 6-step type scale for a project, then rebuild one page using only those sizes. Note every place you were tempted to invent a new one.",
    check: "Why does a line of body text running the full width of a 27-inch monitor get harder to read, even at a comfortable font size?",
  },
  {
    num: "03",
    title: "Color & contrast — the accessible way",
    time: "Week 2–3",
    why: "Color is where most developer-built UIs fail accessibility, and it fails silently — nothing errors, it just becomes unusable for a meaningful slice of your users.",
    learn: [
      "WCAG contrast ratios, and computing them instead of eyeballing",
      "Semantic color (success/warning/danger) kept separate from brand color",
      "Why color must never be the only carrier of meaning",
    ],
    code: `<KW>// WCAG AA minimums — these are the numbers that matter</KW>
Body text (< 18px):      4.5 : 1
Large text (>= 18px bold / 24px):  3 : 1
UI components & borders:  3 : 1

<KW>// Color alone fails ~1 in 12 men (color vision deficiency)</KW>

<KW>// Bad: only red distinguishes this from a normal message</KW>
<span style="color: red">Payment failed</span>

<KW>// Good: color + icon + explicit words — three channels</KW>
<span role="alert">⚠ Error: Payment failed — card declined</span>`,
    build: "Run every text/background pair in one of your projects through a contrast checker. Fix everything under 4.5:1, then re-check in dark mode too.",
    check: "Your error message is red text on a white background and passes contrast. Why is that still not sufficient for conveying 'error'?",
  },
  {
    num: "04",
    title: "Spacing systems & design tokens",
    time: "Week 3",
    why: "This is the stage that makes a developer-built UI stop looking developer-built. Consistency is more visible than any individual choice — and it's purely mechanical to achieve.",
    learn: [
      "A spacing scale (4/8pt) instead of arbitrary pixel values",
      "Design tokens as the shared vocabulary between design and code",
      "Why consistency beats perfection on any single value",
    ],
    code: `<KW>// A spacing scale — every gap comes from this list</KW>
--space-1:  4px
--space-2:  8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px

<KW>// Bad: three different "roughly medium" gaps, none intentional</KW>
padding: 13px;  margin: 18px;  gap: 22px;

<KW>// Good: chosen from the scale, instantly consistent with everything else</KW>
padding: var(--space-3);  margin: var(--space-4);  gap: var(--space-6);`,
    build: "Define a spacing scale, then refactor one component tree to use only those values. Count how many arbitrary values you had before.",
    check: "Why does an arbitrary spacing value like 13px cause problems even though it looks fine in isolation?",
  },
  {
    num: "05",
    title: "Components & every state they have",
    time: "Week 3–4",
    why: "Designing only the default state is the single most common reason a built UI feels broken. Real components live mostly in their non-default states.",
    learn: [
      "The full state set: default, hover, focus, active, disabled, loading, error",
      "Empty states as a design opportunity, not an oversight",
      "Skeletons vs. spinners, and what each communicates",
    ],
    code: `<KW>// A button has at least six states — designing one is designing 1/6</KW>
.btn                 <KW>// default</KW>
.btn:hover           <KW>// affordance — "this is clickable"</KW>
.btn:focus-visible   <KW>// keyboard position — NEVER remove this</KW>
.btn:active          <KW>// press feedback</KW>
.btn:disabled        <KW>// unavailable, and ideally why</KW>
.btn[data-loading]   <KW>// in progress — prevents double-submit</KW>

<KW>// Empty state: the user's first impression of a feature</KW>
<KW>// "No projects yet" + a button beats a blank rectangle every time</KW>`,
    build: "Take one button and one list component and design/build every state including loading and empty. Put them all on one page side by side.",
    check: "You've designed a button's default and hover states. Which commonly-forgotten state most often makes an interface feel broken to real users?",
  },
  {
    num: "06",
    title: "Accessibility as a build requirement",
    time: "Week 4–5",
    why: "Accessibility gets framed as a compliance chore, which is why it gets skipped. It's really about whether your interface works for people using it differently than you do — and most fixes are small.",
    learn: [
      "Keyboard navigation, focus order, and visible focus indicators",
      "Semantic HTML — why the right element beats ARIA in almost every case",
      "Labels, alt text, and testing with an actual screen reader",
    ],
    code: `<KW>// The worst line of CSS in common use</KW>
*:focus { outline: none; }  <KW>// keyboard users are now lost on your page</KW>

<KW>// Do this instead — style it, don't delete it</KW>
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

<KW>// A div with a click handler is invisible to keyboards and screen readers</KW>
<div onClick={save}>Save</div>          <KW>// unreachable by keyboard</KW>
<button onClick={save}>Save</button>    <KW>// focusable + announced, free</KW>`,
    build: "Navigate one of your projects using only the keyboard — no mouse at all. Write down every place you get stuck or lose track of focus, then fix them.",
    check: "Why is removing the focus outline (outline: none) one of the most damaging single lines of CSS you can write?",
  },
  {
    num: "07",
    title: "Testing with real users",
    time: "Week 5",
    why: "You cannot see your own interface with fresh eyes — you know where everything is. Five real users will find problems no amount of internal review surfaces.",
    learn: [
      "Running a simple usability test — tasks, not opinions",
      "Why watching silently beats asking 'do you like it?'",
      "Why ~5 users surfaces most usability problems",
    ],
    code: `<KW>// Bad prompt — invites politeness, produces flattery</KW>
"Do you like this design?"

<KW>// Good prompt — a task, then silence</KW>
"Sign up and create your first project."
<KW>// Then say nothing. Every hesitation is data.</KW>

<KW>// Record for each user:</KW>
- Where did they pause?
- What did they click that wasn't it?
- What did they say out loud while confused?

<KW>// 5 of 5 users hitting the same wall is not a small sample —</KW>
<KW>// it's a wall.</KW>`,
    build: "Run a usability test with 3 people on something you built. Give them a task, stay silent, and write down every hesitation.",
    check: "You watch 5 users struggle with the same step. Your PM says 'we need 100 users before we act.' What's the flaw in that reasoning?",
  },
  {
    num: "08",
    title: "From design to shipped interface",
    time: "Week 5–6",
    why: "The gap between a design and the built version is where most quality quietly leaks out. Closing it is a process problem with a concrete solution, not a talent problem.",
    learn: [
      "Reading a design spec: spacing, sizes, states, and behavior",
      "Translating designs into tokens and reusable components",
      "Design systems — and when building one is premature",
    ],
    code: `<KW>// A design hands over values; tokens make them enforceable in code</KW>
:root {
  --space-4: 16px;
  --radius-md: 10px;
  --text-base: 16px;
  --color-accent: #FF7500;
}

<KW>// Build the component once, with every state, then reuse it</KW>
<Button variant="primary" loading={saving}>Save</Button>

<KW>// A design system is worth it when you're reusing components,</KW>
<KW>// not before. Two screens don't need one; twenty do.</KW>`,
    build: "Take one design (yours or a public one), extract its tokens, and build one component from it with every state matching exactly.",
    check: "Why does 'the developer will figure out the spacing' cause the built UI to drift from the design?",
  },
];
