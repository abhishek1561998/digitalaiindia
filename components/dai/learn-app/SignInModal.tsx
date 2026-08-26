"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import css from "./signin-modal.module.css";
import { CloseIcon } from "./icons";
import { BrandMark } from "../BrandLogo";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.16a5.27 5.27 0 0 1-2.29 3.46v2.87h3.7C21.72 18.8 23 15.8 23 12.27z" />
    <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1.03 7.6-2.79l-3.71-2.87c-1.03.69-2.35 1.1-3.89 1.1-2.99 0-5.52-2.02-6.43-4.73H1.73v2.96A11.5 11.5 0 0 0 12 23.5z" />
    <path fill="#FBBC05" d="M5.57 14.21a6.9 6.9 0 0 1 0-4.41V6.84H1.73a11.5 11.5 0 0 0 0 10.33l3.84-2.96z" />
    <path fill="#EA4335" d="M12 5.07c1.69 0 3.2.58 4.4 1.72l3.29-3.29C17.7 1.61 15.1.5 12 .5A11.5 11.5 0 0 0 1.73 6.84L5.57 9.8C6.48 7.09 9.01 5.07 12 5.07z" />
  </svg>
);

export function SignInModal({
  open,
  onClose,
  /** Where to land after Google hands the session back. Defaults to here. */
  redirectTo,
}: {
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}) {
  const pathname = usePathname();

  // Escape closes, and the page behind must not scroll while this is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const back = redirectTo ?? pathname ?? "/";
  const href = `/api/auth/google/start?redirect=${encodeURIComponent(back)}`;

  return (
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={css.card}>
        <button type="button" className={css.close} onClick={onClose} aria-label="Close">
          <CloseIcon size={20} />
        </button>

        <span className={css.mark}><BrandMark size={30} color="#fff" /></span>

        <h2 className={css.title}>Sign in</h2>
        <p className={css.sub}>
          Your streak, XP, badges and progress are saved to your account — pick up on any
          device, exactly where you left off.
        </p>

        {/* A plain link, not a fetch: the OAuth handshake is a full navigation
            and trying to do it in the background just breaks the redirect. */}
        <a className={css.provider} href={href}>
          <GoogleIcon />
          Continue with Google
        </a>

        <p className={css.note}>
          Google is the only way in right now — one account, nothing to remember, and no
          password of yours for us to lose.
        </p>
      </div>
    </div>
  );
}
