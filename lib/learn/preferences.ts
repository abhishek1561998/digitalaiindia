// The shape of a learner's preferences, shared by the server, the settings
// screen, and the client provider. Defaults live here so a signed-out
// visitor and a learner with no row behave identically.

export const NARRATOR = {
  /** Rename here and the whole app follows. */
  name: "Tara",
  voices: [
    { id: "melodic", label: "Melodic", note: "Warmer and higher, a little quicker" },
    { id: "deep", label: "Deep", note: "Lower and steadier, a little slower" },
  ],
} as const;

export type Preferences = {
  theme: "auto" | "light" | "dark";
  reduceMotion: "auto" | "on" | "off";
  narrationEnabled: boolean;
  narratorVoice: "melodic" | "deep";
  soundEffects: boolean;
  emailStreakReminders: boolean;
  emailStreakAlerts: boolean;
  emailLeagueReminders: boolean;
  emailLeagueAlerts: boolean;
  emailDailyPractice: boolean;
  emailRecommendations: boolean;
  emailNewsletter: boolean;
  emailContentLaunches: boolean;
  emailPromotions: boolean;
  emailOptOutAll: boolean;
};

export const DEFAULT_PREFERENCES: Preferences = {
  theme: "auto",
  reduceMotion: "auto",
  // Off by default. Audio that starts on its own is an interruption, and a
  // learner who wants it will turn it on — the reverse is not true.
  narrationEnabled: false,
  narratorVoice: "melodic",
  soundEffects: true,
  emailStreakReminders: true,
  emailStreakAlerts: true,
  emailLeagueReminders: true,
  emailLeagueAlerts: true,
  emailDailyPractice: true,
  emailRecommendations: true,
  emailNewsletter: true,
  emailContentLaunches: true,
  emailPromotions: false,
  emailOptOutAll: false,
};

const BOOLEAN_KEYS = Object.entries(DEFAULT_PREFERENCES)
  .filter(([, v]) => typeof v === "boolean")
  .map(([k]) => k) as (keyof Preferences)[];

const ENUMS: Partial<Record<keyof Preferences, readonly string[]>> = {
  theme: ["auto", "light", "dark"],
  reduceMotion: ["auto", "on", "off"],
  narratorVoice: ["melodic", "deep"],
};

/**
 * Narrows an untrusted patch to keys and values the model actually accepts —
 * the settings endpoint takes arbitrary JSON, so nothing else may.
 */
export function sanitizePatch(input: unknown): Partial<Preferences> {
  if (!input || typeof input !== "object") return {};
  const raw = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const key of BOOLEAN_KEYS) {
    if (typeof raw[key] === "boolean") out[key] = raw[key];
  }
  for (const [key, allowed] of Object.entries(ENUMS)) {
    const value = raw[key];
    if (typeof value === "string" && allowed!.includes(value)) out[key] = value;
  }
  return out as Partial<Preferences>;
}
