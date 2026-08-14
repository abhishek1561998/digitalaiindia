// Server-only quiz bank for the UI/UX track. Correct answers never ship to
// the client — routes import this via quiz-registry.ts.

export type QuizQuestion = {
  stage: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const UIUX_TRACK_QUIZ: QuizQuestion[] = [
  {
    stage: 0,
    question: "A client says your design 'looks boring' but users complete tasks 40% faster on it. What does that most likely mean?",
    options: ["The client is right — redesign it to look more exciting", "You've probably succeeded at the actual job; 'boring' often describes an interface that isn't fighting the user for attention, and taste feedback shouldn't override measured outcomes", "Speed doesn't matter in design", "The measurement must be wrong"],
    correctIndex: 1,
    explanation: "Interfaces optimize for task completion, not admiration. A UI that gets out of the way often looks unremarkable in a screenshot — which is exactly why measured outcomes should outrank a stakeholder's aesthetic reaction.",
  },
  {
    stage: 1,
    question: "You have a rough idea for a new screen. Why is opening Figma immediately usually the slower path?",
    options: ["Figma is a slow application", "Polished tools invite polishing — you start picking colors and radii before the layout is decided, and the sunk cost makes you defend a structure you haven't actually questioned yet", "Figma can't do layouts", "You should never use Figma"],
    correctIndex: 1,
    explanation: "High-fidelity tools make everything look decided. Sketching is faster precisely because it's ugly — you'll throw away five rough layouts without hesitation, but you'll defend one you already spent an hour styling.",
  },
  {
    stage: 2,
    question: "Two elements are 8px apart; a third is 40px away from them. What does a user assume before reading a single word?",
    options: ["Nothing — spacing carries no meaning", "That the first two belong together and the third is separate — proximity groups elements more powerfully than borders, colors, or labels", "That the third element is more important", "That the layout is broken"],
    correctIndex: 1,
    explanation: "Proximity is the strongest grouping signal in visual perception — it registers pre-attentively, before reading. It's why a label 6px from its input reads as attached, and why equal spacing everywhere makes a form feel ambiguous.",
  },
  {
    stage: 3,
    question: "Why does a line of body text running the full width of a 27-inch monitor get harder to read, even at a comfortable font size?",
    options: ["The font renders differently at that width", "The eye loses its place returning to the start of the next line — readable measure is roughly 45–75 characters regardless of how much width is available", "Wide text uses more memory", "It doesn't — wider is always better"],
    correctIndex: 1,
    explanation: "The return sweep from the end of one line to the start of the next gets error-prone as lines lengthen — readers re-read or skip lines. That's why max-width on text containers matters even when there's screen space to spare.",
  },
  {
    stage: 4,
    question: "Your error message is red text on a white background and passes contrast. Why is that still not sufficient for conveying 'error'?",
    options: ["It is sufficient — red universally means error", "Roughly 1 in 12 men has some form of color vision deficiency, so color alone carries no information for them — the meaning needs a second channel like an icon or explicit text", "Red is the wrong color for errors", "White backgrounds are inaccessible"],
    correctIndex: 1,
    explanation: "Passing contrast means the text is legible, not that its meaning is conveyed. If red is the only thing marking it as an error, that meaning disappears entirely for color-blind users — hence icon plus the word 'Error'.",
  },
  {
    stage: 5,
    question: "Why does an arbitrary spacing value like 13px cause problems even though it looks fine in isolation?",
    options: ["Odd numbers render blurry", "Consistency is what makes an interface feel designed rather than assembled — once values are arbitrary, every future spacing decision is a fresh guess and the whole UI drifts", "13px is too small to see", "It doesn't cause any problem"],
    correctIndex: 1,
    explanation: "13px isn't wrong on its own — the problem is that it belongs to no system, so the next developer guesses again. Dozens of independent guesses is precisely what makes a UI read as unpolished, even when no single value is bad.",
  },
  {
    stage: 6,
    question: "You've designed a button's default and hover states. Which commonly-forgotten state most often makes an interface feel broken to real users?",
    options: ["The italic state", "Loading — without it, a user who clicks and sees nothing happen will click again, often submitting twice", "The printed state", "There are no other states"],
    correctIndex: 1,
    explanation: "On a slow connection, a click with no feedback looks like a failure — so the user clicks again. Missing loading states cause duplicate submissions and are the most common reason a working app feels broken.",
  },
  {
    stage: 7,
    question: "Why is removing the focus outline (outline: none) one of the most damaging single lines of CSS you can write?",
    options: ["It isn't damaging, it just looks cleaner", "Keyboard and screen-reader users navigate by focus — with no visible indicator they cannot tell where they are on the page, making the interface effectively unusable for them", "It breaks the hover state", "It only affects older browsers"],
    correctIndex: 1,
    explanation: "The focus ring is a keyboard user's cursor. Deleting it doesn't remove focus — it removes their ability to see it, so they're tabbing blind. Restyle it with :focus-visible instead of removing it.",
  },
  {
    stage: 8,
    question: "You watch 5 users struggle with the same step. Your PM says 'we need 100 users before we act.' What's the flaw in that reasoning?",
    options: ["No flaw — 100 users is the right sample", "Usability problems aren't statistical claims; if 5 of 5 people hit the same wall, the wall exists — you need large samples to measure preference, not to discover a broken flow", "5 users is already too many", "Usability testing is never reliable"],
    correctIndex: 1,
    explanation: "Discovering that something is broken and measuring how many people prefer A over B are different questions. Five users consistently failing the same step is direct evidence of a defect, not a sample too small to trust.",
  },
  {
    stage: 9,
    question: "Why does 'the developer will figure out the spacing' cause the built UI to drift from the design?",
    options: ["Developers are careless", "Undocumented values become guesses at build time, and dozens of small guesses compound into an interface that matches the design nowhere — tokens and specs remove the guessing", "Spacing doesn't matter in code", "It doesn't drift in practice"],
    correctIndex: 1,
    explanation: "Each individual guess is reasonable and slightly different from the design. Across a whole screen those small deviations accumulate into something visibly off — which is exactly what shared tokens prevent.",
  },
  {
    stage: 10,
    question: "Two portfolios show the same quality of visual work. One is a grid of polished screenshots; the other walks through a problem, two rejected approaches, and what changed after testing. Why does the second get hired?",
    options: ["It has more images", "It shows judgment — anyone can produce one nice screen, but evidence that you can define a problem, weigh alternatives, and respond to feedback is what a team is actually buying", "Longer portfolios always win", "The first one is better, actually"],
    correctIndex: 1,
    explanation: "A screenshot proves you can execute once; it can't distinguish a considered decision from a lucky one. Showing what you rejected and why is the only way to demonstrate the judgment that separates a junior from someone who can be trusted with ambiguity.",
  },
];
