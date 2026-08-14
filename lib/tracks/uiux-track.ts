// Shared content for the UI/UX track — used by both /learn/ui-ux and
// /learn/ui-ux/course.

import type { Stage, QuizQuestion } from "./types";

export const UIUX_QUIZ_QUESTIONS: QuizQuestion[] = [
  { stage: 0, question: "A client says your design 'looks boring' but users complete tasks 40% faster on it. What does that most likely mean?", options: ["The client is right — redesign it to look more exciting", "You've probably succeeded at the actual job; 'boring' often describes an interface that isn't fighting the user for attention, and taste feedback shouldn't override measured outcomes", "Speed doesn't matter in design", "The measurement must be wrong"] },
  { stage: 1, question: "You have a rough idea for a new screen. Why is opening Figma immediately usually the slower path?", options: ["Figma is a slow application", "Polished tools invite polishing — you start picking colors and radii before the layout is decided, and the sunk cost makes you defend a structure you haven't actually questioned yet", "Figma can't do layouts", "You should never use Figma"] },
  { stage: 2, question: "Two elements are 8px apart; a third is 40px away from them. What does a user assume before reading a single word?", options: ["Nothing — spacing carries no meaning", "That the first two belong together and the third is separate — proximity groups elements more powerfully than borders, colors, or labels", "That the third element is more important", "That the layout is broken"] },
  { stage: 3, question: "Why does a line of body text running the full width of a 27-inch monitor get harder to read, even at a comfortable font size?", options: ["The font renders differently at that width", "The eye loses its place returning to the start of the next line — readable measure is roughly 45–75 characters regardless of how much width is available", "Wide text uses more memory", "It doesn't — wider is always better"] },
  { stage: 4, question: "Your error message is red text on a white background and passes contrast. Why is that still not sufficient for conveying 'error'?", options: ["It is sufficient — red universally means error", "Roughly 1 in 12 men has some form of color vision deficiency, so color alone carries no information for them — the meaning needs a second channel like an icon or explicit text", "Red is the wrong color for errors", "White backgrounds are inaccessible"] },
  { stage: 5, question: "Why does an arbitrary spacing value like 13px cause problems even though it looks fine in isolation?", options: ["Odd numbers render blurry", "Consistency is what makes an interface feel designed rather than assembled — once values are arbitrary, every future spacing decision is a fresh guess and the whole UI drifts", "13px is too small to see", "It doesn't cause any problem"] },
  { stage: 6, question: "You've designed a button's default and hover states. Which commonly-forgotten state most often makes an interface feel broken to real users?", options: ["The italic state", "Loading — without it, a user who clicks and sees nothing happen will click again, often submitting twice", "The printed state", "There are no other states"] },
  { stage: 7, question: "Why is removing the focus outline (outline: none) one of the most damaging single lines of CSS you can write?", options: ["It isn't damaging, it just looks cleaner", "Keyboard and screen-reader users navigate by focus — with no visible indicator they cannot tell where they are on the page, making the interface effectively unusable for them", "It breaks the hover state", "It only affects older browsers"] },
  { stage: 8, question: "You watch 5 users struggle with the same step. Your PM says 'we need 100 users before we act.' What's the flaw in that reasoning?", options: ["No flaw — 100 users is the right sample", "Usability problems aren't statistical claims; if 5 of 5 people hit the same wall, the wall exists — you need large samples to measure preference, not to discover a broken flow", "5 users is already too many", "Usability testing is never reliable"] },
  { stage: 9, question: "Why does 'the developer will figure out the spacing' cause the built UI to drift from the design?", options: ["Developers are careless", "Undocumented values become guesses at build time, and dozens of small guesses compound into an interface that matches the design nowhere — tokens and specs remove the guessing", "Spacing doesn't matter in code", "It doesn't drift in practice"] },
  { stage: 10, question: "Two portfolios show the same quality of visual work. One is a grid of polished screenshots; the other walks through a problem, two rejected approaches, and what changed after testing. Why does the second get hired?", options: ["It has more images", "It shows judgment — anyone can produce one nice screen, but evidence that you can define a problem, weigh alternatives, and respond to feedback is what a team is actually buying", "Longer portfolios always win", "The first one is better, actually"] },
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
    code: `Every screen answers three questions, in this order:

  1. What is this?          <KW>// orientation — where am I?</KW>
  2. What can I do here?    <KW>// the primary action, unmistakable</KW>
  3. What else exists?      <KW>// secondary options, quieter</KW>

<KW>A screen with three equally-loud buttons has answered #2 with
"you decide" — which is the designer declining to design.</KW>

THE SQUINT TEST
  Blur your eyes at the screen. Whatever still stands out
  IS your hierarchy — whether you intended it or not.`,
    build: "Sketch any screen you've built. Mark what you INTENDED users to see 1st, 2nd, 3rd — then squint at the real thing and mark what actually stands out. Fix the gap.",
    check: "A client says your design 'looks boring' but users complete tasks 40% faster on it. What does that most likely mean?",
  },
  {
    num: "01",
    title: "Your tools — Figma, XD, and why you sketch first",
    time: "Week 1",
    why: "Tool confusion wastes weeks. Knowing what each tool is actually for — and which one is worth learning deeply in 2026 — saves you from investing in the wrong software or from polishing pixels before the layout is even decided.",
    learn: [
      "Figma: the current industry default, and the four features that actually matter",
      "Adobe XD's status, and why it's no longer the tool to learn first",
      "Low-fidelity sketching (paper, Excalidraw) as a separate, faster thinking mode",
    ],
    code: `FIGMA — learn this one properly
  Free tier is genuinely enough to be hired on. Browser-based,
  so nothing to install. The four things worth real practice:
    Auto Layout  — flex/gap, but visual. Makes designs responsive.
    Components   — one source of truth, reused everywhere.
    Variants     — all six states of a button in ONE component.
    Dev Mode     — how developers read spacing/tokens from your file.

ADOBE XD — know what it is, don't start here
  Adobe moved XD into maintenance mode and stopped selling it
  standalone. It still opens old files, but new features stopped.
  <KW>Learn it only if a specific employer already runs on it.</KW>

PENPOT — the open-source alternative
  Free, self-hostable, Figma-like. Worth knowing it exists.

SKETCHING (paper / Excalidraw) — where you should START
  Deliberately ugly = fast. You throw away 5 layouts in 10 minutes
  because none of them cost anything to make.

<KW>The trap: polished tools invite polishing. Choosing a border
radius before the layout is settled is procrastination that
looks like progress.</KW>`,
    build: "Sketch three completely different layouts for the same screen in under 10 minutes — deliberately rough. Pick one, and only then open a real design tool.",
    check: "You have a rough idea for a new screen. Why is opening Figma immediately usually the slower path?",
  },
  {
    num: "02",
    title: "Layout & visual hierarchy",
    time: "Week 1–2",
    why: "Most 'it looks off but I don't know why' interfaces are alignment and proximity problems. These are learnable rules, not intuition — which is exactly why developers can pick them up quickly.",
    learn: [
      "Proximity and grouping — spacing communicates relationship before text does",
      "Alignment, and why inconsistent edges read as sloppy even unconsciously",
      "Size, weight, and position as hierarchy tools instead of color alone",
    ],
    code: `Spacing tells the user what belongs together,
before they read a single word.

AMBIGUOUS — is the label attached above or below?
  label     margin-bottom: 16px
  input     margin-bottom: 16px

CLEAR — tight inside a group, loose between groups
  label     margin-bottom: 6px    <KW>// bound to its own input</KW>
  input     margin-bottom: 28px   <KW>// separated from next field</KW>

<KW>THE RULE
Space WITHIN a group must be smaller than space BETWEEN groups.</KW>`,
    build: "Sketch a form twice: once with equal spacing everywhere, once with tight-within / loose-between. Compare how obvious the grouping becomes.",
    check: "Two elements are 8px apart; a third is 40px away from them. What does a user assume before reading a single word?",
  },
  {
    num: "03",
    title: "Typography that carries meaning",
    time: "Week 2",
    why: "Type is most of what's on screen in almost every app, and it's the fastest lever for making an interface feel considered — but 'pick a nice font' is the least useful part of it.",
    learn: [
      "Type scale — a fixed set of sizes instead of arbitrary values",
      "Line height and measure (line length), and why both affect readability",
      "Weight and case as hierarchy tools, and when uppercase actively hurts",
    ],
    code: `A TYPE SCALE — pick from these, never invent one mid-project
  --text-xs:   12px   <KW>// captions, metadata</KW>
  --text-sm:   14px   <KW>// secondary text</KW>
  --text-base: 16px   <KW>// body — never smaller for real reading</KW>
  --text-lg:   20px
  --text-xl:   28px
  --text-2xl:  40px   <KW>// page titles</KW>

LINE HEIGHT — tighter for headings, looser for body
  heading  line-height: 1.15   <KW>// large text needs less room</KW>
  body     line-height: 1.6    <KW>// small text needs more</KW>

MEASURE — cap body text around 65 characters
  max-width: 65ch;`,
    build: "Sketch the same article layout at 3 different measures — very narrow, ~65ch, and full-width. Note where reading starts to feel like work.",
    check: "Why does a line of body text running the full width of a 27-inch monitor get harder to read, even at a comfortable font size?",
  },
  {
    num: "04",
    title: "Color & contrast — the accessible way",
    time: "Week 2–3",
    why: "Color is where most developer-built UIs fail accessibility, and it fails silently — nothing errors, it just becomes unusable for a meaningful slice of your users.",
    learn: [
      "WCAG contrast ratios, and computing them instead of eyeballing",
      "Semantic color (success/warning/danger) kept separate from brand color",
      "Why color must never be the only carrier of meaning",
    ],
    code: `WCAG AA MINIMUMS — the numbers that matter
  Body text (< 18px)                4.5 : 1
  Large text (>= 24px, or 18px bold)  3 : 1
  UI components & borders             3 : 1

<KW>Color alone fails ~1 in 12 men (color vision deficiency).</KW>

BAD — only red distinguishes this from a normal message
  <span style="color: red">Payment failed</span>

GOOD — color + icon + explicit words: three channels
  <span role="alert">⚠ Error: Payment failed — card declined</span>`,
    build: "Sketch an error state twice: once relying on red alone, once with icon + word + color. Show both to someone in grayscale.",
    check: "Your error message is red text on a white background and passes contrast. Why is that still not sufficient for conveying 'error'?",
  },
  {
    num: "05",
    title: "Spacing systems & design tokens",
    time: "Week 3",
    why: "This is the stage that makes a developer-built UI stop looking developer-built. Consistency is more visible than any individual choice — and it's purely mechanical to achieve.",
    learn: [
      "A spacing scale (4/8pt) instead of arbitrary pixel values",
      "Design tokens as the shared vocabulary between design and code",
      "Why consistency beats perfection on any single value",
    ],
    code: `A SPACING SCALE — every gap comes from this list
  --space-1:   4px
  --space-2:   8px
  --space-3:  12px
  --space-4:  16px
  --space-6:  24px
  --space-8:  32px
  --space-12: 48px

BAD — three "roughly medium" gaps, none intentional
  padding: 13px;  margin: 18px;  gap: 22px;

GOOD — from the scale, consistent with everything else
  padding: var(--space-3);  margin: var(--space-4);  gap: var(--space-6);

<KW>In Figma this is exactly what Auto Layout gap values should be.</KW>`,
    build: "Sketch a card component twice — once with eyeballed gaps, once using only 4/8/16/24. Put them side by side.",
    check: "Why does an arbitrary spacing value like 13px cause problems even though it looks fine in isolation?",
  },
  {
    num: "06",
    title: "Components & every state they have",
    time: "Week 3–4",
    why: "Designing only the default state is the single most common reason a built UI feels broken. Real components live mostly in their non-default states.",
    learn: [
      "The full state set: default, hover, focus, active, disabled, loading, error",
      "Empty states as a design opportunity, not an oversight",
      "Skeletons vs. spinners, and what each communicates",
    ],
    code: `A BUTTON HAS AT LEAST SIX STATES
Designing one is designing 1/6 of a button.

  default            <KW>// resting</KW>
  :hover             <KW>// affordance — "this is clickable"</KW>
  :focus-visible     <KW>// keyboard position — NEVER remove</KW>
  :active            <KW>// press feedback</KW>
  :disabled          <KW>// unavailable, and ideally why</KW>
  [data-loading]     <KW>// in progress — prevents double-submit</KW>

<KW>In Figma: this is exactly what Variants are for — one component,
a State property, six values.</KW>

EMPTY STATE — a user's first impression of a feature
  "No projects yet" + a button
  beats a blank rectangle, every time.`,
    build: "Sketch all six states of one button side by side, plus the empty state of a list. Put them on one board.",
    check: "You've designed a button's default and hover states. Which commonly-forgotten state most often makes an interface feel broken to real users?",
  },
  {
    num: "07",
    title: "Accessibility as a build requirement",
    time: "Week 4–5",
    why: "Accessibility gets framed as a compliance chore, which is why it gets skipped. It's really about whether your interface works for people using it differently than you do — and most fixes are small.",
    learn: [
      "Keyboard navigation, focus order, and visible focus indicators",
      "Semantic HTML — why the right element beats ARIA in almost every case",
      "Labels, alt text, and testing with an actual screen reader",
    ],
    code: `THE WORST LINE OF CSS IN COMMON USE
  *:focus { outline: none; }
  <KW>// keyboard users are now lost on your page</KW>

DO THIS INSTEAD — style it, don't delete it
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

A div with a click handler is invisible to keyboards
and screen readers:
  <div onClick={save}>Save</div>       <KW>// unreachable</KW>
  <button onClick={save}>Save</button> <KW>// focusable + announced, free</KW>`,
    build: "Sketch the tab order of a form as numbered arrows. Then use a real form with only the keyboard and mark every place you get stuck.",
    check: "Why is removing the focus outline (outline: none) one of the most damaging single lines of CSS you can write?",
  },
  {
    num: "08",
    title: "Testing with real users",
    time: "Week 5",
    why: "You cannot see your own interface with fresh eyes — you know where everything is. Five real users will find problems no amount of internal review surfaces.",
    learn: [
      "Running a simple usability test — tasks, not opinions",
      "Why watching silently beats asking 'do you like it?'",
      "Why ~5 users surfaces most usability problems",
    ],
    code: `BAD PROMPT — invites politeness, produces flattery
  "Do you like this design?"

GOOD PROMPT — a task, then silence
  "Sign up and create your first project."
  <KW>Then say nothing. Every hesitation is data.</KW>

RECORD FOR EACH USER
  - Where did they pause?
  - What did they click that wasn't it?
  - What did they say out loud while confused?

<KW>5 of 5 users hitting the same wall is not a small sample.
It's a wall.</KW>`,
    build: "Sketch the flow you'll test as a simple 4-box journey, then run it past 3 people and mark on the sketch where each one hesitated.",
    check: "You watch 5 users struggle with the same step. Your PM says 'we need 100 users before we act.' What's the flaw in that reasoning?",
  },
  {
    num: "09",
    title: "From design to shipped interface",
    time: "Week 5–6",
    why: "The gap between a design and the built version is where most quality quietly leaks out. Closing it is a process problem with a concrete solution, not a talent problem.",
    learn: [
      "Reading a design spec: spacing, sizes, states, and behavior",
      "Translating designs into tokens and reusable components",
      "Design systems — and when building one is premature",
    ],
    code: `A design hands over values.
Tokens make them enforceable in code.

  :root {
    --space-4: 16px;
    --radius-md: 10px;
    --text-base: 16px;
    --color-accent: #FF7500;
  }

Build the component once, with every state, then reuse it:
  <Button variant="primary" loading={saving}>Save</Button>

<KW>A design system is worth it when you're reusing components,
not before. Two screens don't need one; twenty do.</KW>`,
    build: "Take one design (yours or a public Figma community file), extract its tokens onto a sketch, and label every spacing value.",
    check: "Why does 'the developer will figure out the spacing' cause the built UI to drift from the design?",
  },
  {
    num: "10",
    title: "Becoming a designer people hire",
    time: "Week 6",
    why: "Knowing the rules doesn't make you hireable — being able to show judgment does. This is the honest map from 'I can use Figma' to work people pay for, including what actually separates each level.",
    learn: [
      "The four levels, and what genuinely distinguishes each one",
      "Case studies over screenshots — the portfolio format that gets replies",
      "Getting real work with no experience, and what to charge first",
    ],
    code: `THE FOUR LEVELS

  1. CAN USE THE TOOL
     Knows Figma. Copies layouts that look nice.
     <KW>Not yet hireable as a designer.</KW>

  2. CAN MAKE IT LOOK GOOD
     Consistent spacing, type scale, decent taste.
     <KW>Hireable as a junior. Ceiling: needs direction.</KW>

  3. CAN DEFEND EVERY DECISION
     "This is primary because it's the one action
      90% of users came for. I tested the other way
      and completion dropped."
     <KW>This is the jump that pays. Most never make it.</KW>

  4. CAN SET DIRECTION
     Decides what NOT to build. Runs the system.
     Makes other designers better.

PORTFOLIO: case studies, not galleries
  ✗ 12 pretty screenshots
  ✓ 3 case studies, each:
      - the problem, and who had it
      - what you tried and REJECTED (and why)
      - what changed after testing
      - the outcome, measured if possible

<KW>Two rejected approaches say more about your judgment
than ten polished screens.</KW>

GETTING THE FIRST REAL WORK
  - Redesign something real and badly designed, publish
    the case study (a govt form, a local business site)
  - Offer one free/cheap project for a real person with
    a real deadline — constraints teach what practice can't
  - Contribute to open-source design systems
  - Start freelance small; raise rates every 2 projects`,
    build: "Write one full case study for something you've designed — problem, two rejected approaches, what changed after showing it to 3 people, and the outcome.",
    check: "Two portfolios show the same quality of visual work. One is a grid of polished screenshots; the other walks through a problem, two rejected approaches, and what changed after testing. Why does the second get hired?",
  },
];
