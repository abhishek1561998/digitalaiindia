"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_PREFERENCES, type Preferences } from "@/lib/learn/preferences";
import { setSoundEnabled } from "@/lib/learn/sound";

type Ctx = {
  prefs: Preferences;
  /** Applies locally at once, then persists. Reverts if the save fails. */
  update: (patch: Partial<Preferences>) => Promise<void>;
  /** Resolved from the theme preference plus the OS setting. */
  theme: "light" | "dark";
  /** Resolved from the motion preference plus prefers-reduced-motion. */
  motionOff: boolean;
  saving: boolean;
  signedIn: boolean;
};

const PreferencesContext = createContext<Ctx | null>(null);

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}

function systemPrefers(query: string) {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

export function PreferencesProvider({
  initial,
  signedIn,
  children,
}: {
  initial: Preferences;
  signedIn: boolean;
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<Preferences>(initial ?? DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [systemDark, setSystemDark] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);

  // Both media queries are read after mount and then watched, so "auto"
  // follows the OS live rather than only at page load.
  useEffect(() => {
    if (!window.matchMedia) return;
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemDark(dark.matches);
    setSystemReduced(reduced.matches);

    const onDark = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    const onReduced = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    dark.addEventListener("change", onDark);
    reduced.addEventListener("change", onReduced);
    return () => {
      dark.removeEventListener("change", onDark);
      reduced.removeEventListener("change", onReduced);
    };
  }, []);

  const theme: "light" | "dark" =
    prefs.theme === "auto" ? (systemDark ? "dark" : "light") : prefs.theme;

  const motionOff =
    prefs.reduceMotion === "auto" ? systemReduced : prefs.reduceMotion === "on";

  // The sound module is a plain singleton so any component can `play()`
  // without threading context through; this keeps it in sync.
  useEffect(() => {
    setSoundEnabled(prefs.soundEffects);
  }, [prefs.soundEffects]);

  // Theme lives on <html> too, so the pre-hydration script in the root layout
  // and the rest of the site agree with whatever the learner picked here.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // Private mode — the preference still applies for this session.
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-reduce-motion", motionOff);
  }, [motionOff]);

  const update = useCallback(
    async (patch: Partial<Preferences>) => {
      const previous = prefs;
      setPrefs((p) => ({ ...p, ...patch }));

      // A signed-out visitor still gets working toggles for the session;
      // there's just nowhere to persist them.
      if (!signedIn) return;

      setSaving(true);
      try {
        const res = await fetch("/api/learn/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("save failed");
        const data = await res.json();
        if (data.preferences) setPrefs(data.preferences);
      } catch {
        setPrefs(previous);
      } finally {
        setSaving(false);
      }
    },
    [prefs, signedIn],
  );

  const value = useMemo(
    () => ({ prefs, update, theme, motionOff, saving, signedIn }),
    [prefs, update, theme, motionOff, saving, signedIn],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
