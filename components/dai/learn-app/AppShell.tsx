"use client";

import Link from "next/link";
import { useState } from "react";

import css from "./learn-app.module.css";
import { learnFonts } from "./fonts";
import { AccountMenu } from "../AccountMenu";
import { BrandMark } from "../BrandLogo";
import {
  HomeIcon, CoursesIcon, YouIcon, FlameIcon, BoltIcon, SunIcon, MoonIcon,
} from "./icons";
import { PreferencesProvider, usePreferences } from "./PreferencesProvider";
import { SignInModal } from "./SignInModal";
import type { Preferences } from "@/lib/learn/preferences";
import type { LearnerState } from "@/lib/server/learn-state";


export type ShellUser = { name: string; email: string } | null;

const TABS = [
  { href: "/", label: "Home", key: "home", Icon: HomeIcon },
  { href: "/learn/courses", label: "Courses", key: "courses", Icon: CoursesIcon },
  { href: "/learn/you", label: "You", key: "you", Icon: YouIcon },
] as const;

export function AppShell({
  active,
  user,
  state,
  promo,
  minimal,
  preferences,
  children,
}: {
  active: "home" | "courses" | "you" | "none";
  user: ShellUser;
  state: LearnerState | null;
  /** Set false on pages that shouldn't be interrupted by an upsell banner. */
  promo?: boolean;
  /**
   * Strips the nav back to identity and sign-in. Used by the signed-out
   * landing page, where an empty streak pill and a "You" tab are furniture
   * for an app the visitor hasn't joined yet.
   */
  minimal?: boolean;
  preferences: Preferences;
  children: React.ReactNode;
}) {
  return (
    <PreferencesProvider initial={preferences} signedIn={Boolean(user)}>
      <Chrome active={active} user={user} state={state} promo={promo} minimal={minimal}>
        {children}
      </Chrome>
    </PreferencesProvider>
  );
}

function Chrome({
  active,
  user,
  state,
  promo,
  minimal,
  children,
}: {
  active: "home" | "courses" | "you" | "none";
  user: ShellUser;
  state: LearnerState | null;
  promo?: boolean;
  minimal?: boolean;
  children: React.ReactNode;
}) {
  const { theme, update } = usePreferences();
  const [signInOpen, setSignInOpen] = useState(false);

  function toggleTheme() {
    void update({ theme: theme === "dark" ? "light" : "dark" });
  }

  const showPromo = promo !== false && !minimal && !state?.premium.active;

  return (
    <div
      className={`${css.app} ${learnFonts}`}
      data-theme={theme}
    >
      <nav className={css.nav} data-minimal={minimal || undefined}>
        <Link href="/" className={css.navLogo}>
          <span className={css.navLogoMark}><BrandMark size={16} color="#fff" /></span>
          <span className={css.navLogoWord}>DigitalAI<span className={css.navLogoIndia}>India</span></span>
        </Link>

        {!minimal && (
        <div className={css.navTabs}>
          {TABS.map(({ href, label, key, Icon }) => (
            <Link key={key} href={href} className={css.navTab} data-active={active === key}>
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
        )}

        <div className={css.navSpacer} />

        <div className={css.navRight}>
          {!minimal && !state?.premium.active && (
            <Link href="/learn/premium" className={`${css.pill} ${css.pillTrial}`}>
              Start trial
            </Link>
          )}
          {!minimal && state && (
            <>
              <span className={css.pill} title={`${state.streak}-day streak`}>
                {state.streak}
                <span style={{ color: "var(--streak)", display: "flex" }}><FlameIcon size={17} /></span>
                <span className={css.srOnly}>day streak</span>
              </span>
              <span className={css.pill} title={`${state.xp} XP`}>
                {state.xp}
                <span style={{ color: "var(--xp)", display: "flex" }}><BoltIcon size={17} /></span>
                <span className={css.srOnly}>XP</span>
              </span>
            </>
          )}
          <button
            type="button"
            className={css.iconBtn}
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {user ? (
            <AccountMenu userName={user.name} />
          ) : (
            <button
              type="button"
              className={minimal ? css.navSignIn : css.pill}
              onClick={() => setSignInOpen(true)}
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {showPromo && (
        <div className={css.promo}>
          <span>
            Try Premium free for 7 days — every track, every project, unlimited practice.{" "}
            <Link href="/learn/premium" className={css.promoLink}>Start trial</Link>
          </span>
        </div>
      )}

      {children}

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />

      {!minimal && (
      <nav className={css.mobileTabs} aria-label="Sections">
        {TABS.map(({ href, label, key, Icon }) => (
          <Link key={key} href={href} className={css.mobileTab} data-active={active === key}>
            <Icon size={21} />
            {label}
          </Link>
        ))}
      </nav>
      )}
    </div>
  );
}
