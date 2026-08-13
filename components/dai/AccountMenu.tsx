"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./marketing-landing.module.css";
import css from "./AccountMenu.module.css";

export function AccountMenu({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/learn";
  }

  const initial = (userName.trim()[0] || "?").toUpperCase();

  return (
    <div className={css.wrap} ref={ref}>
      <button
        type="button"
        className={css.avatar}
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div className={css.menu}>
          <div className={css.menuLabel}>Signed in as</div>
          <div className={css.menuName}>{userName}</div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
            style={{ width: "100%", justifyContent: "center", marginTop: "0.6rem" }}
            onClick={logout}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
          <p className={css.menuHint}>Logging out lets you sign in with a different Google account.</p>
        </div>
      )}
    </div>
  );
}
