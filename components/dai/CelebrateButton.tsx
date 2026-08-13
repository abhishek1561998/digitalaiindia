"use client";

import { useEffect, useState } from "react";
import styles from "./marketing-landing.module.css";

export function CelebrateButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const now = new Date();
    const inSeason = now.getMonth() === 7 && now.getDate() >= 10 && now.getDate() <= 17; // Aug 10–17
    setShow(inSeason);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className={styles.celebrateBtn}
      onClick={() => window.dispatchEvent(new CustomEvent("dai:celebrate"))}
      title="Celebrate Independence Day"
      aria-label="Celebrate Independence Day"
    >
      🎉
    </button>
  );
}
