"use client";

import { useEffect, useState } from "react";
import styles from "./CelebrationConfetti.module.css";

const COLORS = ["#FF9933", "#FFFFFF", "#138808"] as const;

const PIECES = Array.from({ length: 32 }, (_, i) => ({
  left: (i * 3.1) % 100,
  delay: (i % 10) * 0.35,
  duration: 5.5 + (i % 5) * 1.1,
  color: COLORS[i % 3],
  size: 6 + (i % 3) * 3,
}));

const BURST_DURATION_MS = 7000;

export function CelebrationConfetti() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function burst() {
      setActive(true);
      clearTimeout(timer);
      timer = setTimeout(() => setActive(false), BURST_DURATION_MS);
    }

    window.addEventListener("dai:celebrate", burst);

    const now = new Date();
    const inSeason = now.getMonth() === 7 && now.getDate() >= 10 && now.getDate() <= 17; // Aug 10–17
    const playedToday = sessionStorage.getItem("dai-celebrate-auto") === "1";

    // Only mark + fire once the timer actually elapses — avoids React
    // StrictMode's double-invoke poisoning the sessionStorage check.
    let startupTimer: ReturnType<typeof setTimeout> | undefined;
    if (inSeason && !playedToday) {
      startupTimer = setTimeout(() => {
        sessionStorage.setItem("dai-celebrate-auto", "1");
        burst();
      }, 900);
    }

    return () => {
      window.removeEventListener("dai:celebrate", burst);
      clearTimeout(timer);
      clearTimeout(startupTimer);
    };
  }, []);

  if (!active) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className={styles.piece}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: p.color,
            width: p.size,
            height: p.size * 2.2,
            boxShadow: p.color === "#FFFFFF" ? "0 0 0 1px rgba(0,0,0,0.06)" : "none",
          }}
        />
      ))}
    </div>
  );
}
