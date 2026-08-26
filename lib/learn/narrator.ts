// The narrator, on the browser's own speech synthesis.
//
// No API key, no cost, no rate limit, no network round trip — the voices
// ship with the operating system. The trade is that we don't control which
// voices exist, so "Melodic" and "Deep" are expressed as pitch and rate
// deltas on top of whichever English voice we can find, rather than as two
// specific named voices that might not be installed.
//
// Everything here degrades to silence rather than throwing: a browser
// without speechSynthesis, or with no voices, must still let a lesson run.

export type NarratorVoice = "melodic" | "deep";

type VoiceShape = { pitch: number; rate: number; /** Ranked name hints. */ prefer: string[] };

// Indian-English voice names across the platforms that ship them, ranked by
// timbre. These win over everything else: the audience is in India, and a
// narrator who sounds local is the whole point.
const INDIAN_HIGH = ["veena", "kalpana", "aditi", "heera", "swara", "neerja", "google हिन्दी"];
const INDIAN_LOW = ["rishi", "neel", "hemant", "madhur", "prabhat", "ravi"];

const SHAPES: Record<NarratorVoice, VoiceShape> = {
  // Slightly higher and a touch quicker — reads as warm rather than shrill.
  melodic: { pitch: 1.12, rate: 1.0, prefer: [...INDIAN_HIGH, ...INDIAN_LOW, "samantha", "aria", "zira", "female"] },
  // Lower and a little slower, which is what makes it read as considered.
  deep: { pitch: 0.82, rate: 0.94, prefer: [...INDIAN_LOW, ...INDIAN_HIGH, "daniel", "alex", "david", "male"] },
};

// Indian English first. Deliberately no hi-IN fallback: a Hindi voice reading
// English source code and technical terms pronounces them worse than a
// British one does, so the accent isn't worth the mangling.
const LANG_ORDER = ["en-IN", "en-GB", "en-AU", "en-US", "en"];

// macOS ships a set of joke voices that report themselves as en-US. Without
// this, a learner whose device lacks any of our preferred voices could get a
// lesson read to them by "Bad News" or "Boing".
const NOVELTY = [
  "bad news", "good news", "bahh", "bells", "boing", "bubbles", "cellos",
  "deranged", "hysterical", "jester", "organ", "trinoids", "whisper",
  "wobble", "zarvox", "albert", "superstar", "junior", "bahh", "grandma",
  "grandpa", "rocko", "shelley", "sandy", "flo", "eddy", "reed",
];

function isUsable(v: SpeechSynthesisVoice) {
  const name = v.name.toLowerCase();
  return !NOVELTY.some((n) => name.includes(n));
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

export function isSupported() {
  return synth() !== null;
}

/**
 * Voices load asynchronously in most browsers, and getVoices() returns an
 * empty array until they do. Resolves with whatever is available, including
 * nothing.
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const s = synth();
  if (!s) return Promise.resolve([]);

  const now = s.getVoices();
  if (now.length) {
    cachedVoices = now;
    return Promise.resolve(now);
  }

  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      cachedVoices = s.getVoices();
      resolve(cachedVoices);
    };
    s.addEventListener("voiceschanged", done, { once: true });
    // Some browsers never fire the event; don't hang a lesson on it.
    setTimeout(done, 1200);
  });
}

function pickVoice(voice: NarratorVoice): SpeechSynthesisVoice | null {
  if (!cachedVoices.length) return null;
  const english = cachedVoices.filter(
    (v) => v.lang.toLowerCase().startsWith("en") && isUsable(v),
  );
  if (!english.length) return null;

  const shape = SHAPES[voice];

  // A name hint is the strongest signal we get about timbre, and the Indian
  // names sit at the top of both lists.
  for (const hint of shape.prefer) {
    const match = english.find((v) => v.name.toLowerCase().includes(hint));
    if (match) return match;
  }

  // No name matched, but an Indian-English voice exists — take it. Both
  // options landing on the same voice is fine: pitch and rate still tell
  // them apart, and a local accent matters more than two distinct speakers.
  const indian = english.find((v) => v.lang.toLowerCase() === "en-in");
  if (indian) return indian;

  for (const lang of LANG_ORDER) {
    // Prefer the platform's default voice for a locale — it's the one the
    // OS considers presentable.
    const inLang = english.filter((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
    const preferred = inLang.find((v) => v.default) ?? inLang[0];
    if (preferred) return preferred;
  }

  return english[0];
}

/**
 * Strips authoring markup so the narrator reads prose rather than syntax.
 * Backticked code is spoken, but without the ticks — dropping it entirely
 * would leave sentences like "returns a new array" with no subject.
 */
export function speakable(text: string) {
  return text
    .replace(/<KW>([\s\S]*?)<\/KW>/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function stop() {
  const s = synth();
  if (!s) return;
  try {
    s.cancel();
  } catch {
    // Cancelling an idle synth throws in some browsers; nothing to do.
  }
}

/**
 * Speaks `text`, replacing anything currently being said.
 * Returns false when speech isn't available, so callers can hide the control.
 */
export function speak(
  text: string,
  voice: NarratorVoice,
  handlers?: { onStart?: () => void; onEnd?: () => void },
) {
  const s = synth();
  if (!s) return false;

  const body = speakable(text);
  if (!body) return false;

  stop();

  const utterance = new SpeechSynthesisUtterance(body);
  const shape = SHAPES[voice];
  const picked = pickVoice(voice);
  if (picked) utterance.voice = picked;
  utterance.pitch = shape.pitch;
  utterance.rate = shape.rate;
  utterance.volume = 1;

  if (handlers?.onStart) utterance.onstart = () => handlers.onStart!();
  // `end` fires on cancel too, which is what we want — either way it stopped.
  if (handlers?.onEnd) {
    utterance.onend = () => handlers.onEnd!();
    utterance.onerror = () => handlers.onEnd!();
  }

  try {
    s.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
