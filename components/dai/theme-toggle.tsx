"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [ready, setReady] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const useDark = stored ? stored === "dark" : true;
    document.documentElement.classList.toggle("dark", useDark);
    setDark(useDark);
    setReady(true);
  }, []);

  function onToggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={onToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-sm hover:bg-muted"
      aria-label="Toggle theme"
      type="button"
    >
      {ready ? (dark ? "☀" : "🌙") : "☼"}
    </button>
  );
}
