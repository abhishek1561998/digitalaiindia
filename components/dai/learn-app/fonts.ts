// The Learn app's typefaces, in one place.
//
// Inter throughout — one family for display and UI. It has a large x-height
// and unambiguous letterforms at small sizes, which is what a screen someone
// reads for an hour needs; personality is carried by layout and colour
// instead of by the typeface.
//
// Brilliant.org uses "CoFo Brilliant", a custom commission from Contrast
// Foundry that isn't licensable — so this is a deliberate choice, not an
// approximation of theirs.
//
// To swap in a licensed face later, change only this file — every component
// consumes `learnFonts` and the CSS reads `--font-display` / `--font-body`.

import { Inter, JetBrains_Mono } from "next/font/google";

// No `weight` — this pulls Inter's variable font, so the stylesheet can ask
// for 450 or 550 and get exactly that rather than snapping to a static cut.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/** Spread onto the root element of any Learn screen. */
export const learnFonts = `${inter.variable} ${interDisplay.variable} ${mono.variable}`;
