// Lesson sound effects, synthesised rather than shipped.
//
// Every cue here is a few oscillators and a gain envelope, so there are no
// audio files to load, licence, or cache — and a cue can be retuned by
// changing a number instead of re-recording. Total cost is a few hundred
// bytes of code against ~200KB of sprite audio.
//
// Browsers block audio until the user has interacted with the page, so the
// context is created lazily on the first cue and stays warm after that.

type Cue = "correct" | "wrong" | "xp" | "complete" | "tap" | "unlock";

let ctx: AudioContext | null = null;
let enabled = true;

/** Called by the preferences provider whenever the sound setting changes. */
export function setSoundEnabled(value: boolean) {
  enabled = value;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  // Autoplay policy suspends the context until a gesture; resuming is a
  // no-op once it's already running.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

type ToneOptions = {
  freq: number;
  /** Seconds from now. */
  at?: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
  /** Slide to this frequency across the tone. */
  glideTo?: number;
};

function tone(c: AudioContext, o: ToneOptions) {
  const {
    freq, at = 0, duration = 0.16, type = "sine", gain = 0.16, glideTo,
  } = o;
  const start = c.currentTime + at;

  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);

  // A short attack and an exponential tail: a linear fade reads as a click,
  // an exponential one reads as an instrument.
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(amp).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

// Frequencies, not note names, so the intervals are visible: these are all
// major-third / perfect-fifth stacks, which is why they read as "good".
const CUES: Record<Cue, (c: AudioContext) => void> = {
  // Rising major triad — the "yes" everyone already knows.
  correct: (c) => {
    tone(c, { freq: 523.25, duration: 0.13, gain: 0.15 });
    tone(c, { freq: 659.25, at: 0.075, duration: 0.13, gain: 0.15 });
    tone(c, { freq: 783.99, at: 0.15, duration: 0.26, gain: 0.17 });
  },
  // Soft and low, deliberately not harsh — a wrong answer is information,
  // not a punishment.
  wrong: (c) => {
    tone(c, { freq: 233.08, duration: 0.18, type: "triangle", gain: 0.13 });
    tone(c, { freq: 185.0, at: 0.09, duration: 0.22, type: "triangle", gain: 0.11 });
  },
  // Quick sparkle that sits under the +XP badge.
  xp: (c) => {
    tone(c, { freq: 880, duration: 0.07, type: "triangle", gain: 0.1 });
    tone(c, { freq: 1174.66, at: 0.05, duration: 0.09, type: "triangle", gain: 0.09 });
    tone(c, { freq: 1567.98, at: 0.1, duration: 0.14, type: "triangle", gain: 0.08 });
  },
  // Four notes, wider spacing — the only cue allowed to feel like an event.
  complete: (c) => {
    tone(c, { freq: 523.25, duration: 0.16, gain: 0.16 });
    tone(c, { freq: 659.25, at: 0.1, duration: 0.16, gain: 0.16 });
    tone(c, { freq: 783.99, at: 0.2, duration: 0.18, gain: 0.17 });
    tone(c, { freq: 1046.5, at: 0.32, duration: 0.42, gain: 0.18 });
  },
  // Barely there. Fires on step advance, so it must never become annoying.
  tap: (c) => {
    tone(c, { freq: 620, duration: 0.05, type: "sine", gain: 0.05 });
  },
  // Upward sweep for a paywall or level opening.
  unlock: (c) => {
    tone(c, { freq: 392, duration: 0.4, type: "sine", gain: 0.13, glideTo: 1046.5 });
  },
};

export function play(cue: Cue) {
  if (!enabled) return;
  try {
    const c = audio();
    if (c) CUES[cue](c);
  } catch {
    // Audio is a garnish — a browser that refuses it must not break a lesson.
  }
}
