"use client";

import { useEffect, useState } from "react";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    applyTheme(isDark);
    setDark(isDark);
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      type="button"
      style={{
        width: 36,
        height: 36,
        borderRadius: 9,
        border: "1px solid var(--dai-border2)",
        background: "var(--dai-card)",
        color: "var(--dai-text2)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        flexShrink: 0,
        ...style,
      }}
    >
      {ready ? (dark ? <SunIcon /> : <MoonIcon />) : null}
    </button>
  );
}
