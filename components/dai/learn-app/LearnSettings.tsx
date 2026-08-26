"use client";

import Link from "next/link";
import css from "./settings.module.css";
import shell from "./learn-app.module.css";
import { usePreferences } from "./PreferencesProvider";
import { NARRATOR, type Preferences } from "@/lib/learn/preferences";
import { play } from "@/lib/learn/sound";
import { isSupported, loadVoices, speak, stop } from "@/lib/learn/narrator";
import { useEffect, useState } from "react";

function Toggle({
  checked, onChange, label, disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={css.toggle}
      disabled={disabled}
      onClick={() => { onChange(!checked); play("tap"); }}
    >
      <span className={css.toggleKnob} />
    </button>
  );
}

function Segmented<T extends string>({
  value, options, onChange, label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className={css.segmented} role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          className={css.segmentedItem}
          onClick={() => { onChange(o.value); play("tap"); }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({
  label, note, children, disabled,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={css.row} data-disabled={disabled}>
      <div className={css.rowBody}>
        <p className={css.rowLabel}>{label}</p>
        {note && <p className={css.rowNote}>{note}</p>}
      </div>
      <div className={css.rowControl}>{children}</div>
    </div>
  );
}

const EMAIL_SECTIONS: {
  heading: string;
  rows: { key: keyof Preferences; label: string; note?: string }[];
}[] = [
  {
    heading: "Streaks",
    rows: [
      { key: "emailStreakReminders", label: "Reminders", note: "A nudge during the day if you haven't practised yet" },
      { key: "emailStreakAlerts", label: "Alerts", note: "A warning when your streak is about to expire" },
    ],
  },
  {
    heading: "Leagues",
    rows: [
      { key: "emailLeagueReminders", label: "Reminders", note: "How your league is going, through the week" },
      { key: "emailLeagueAlerts", label: "Alerts", note: "When a league is closing, or you're at risk of demotion" },
    ],
  },
  {
    heading: "Learning reminders",
    rows: [
      { key: "emailDailyPractice", label: "Daily practice" },
      { key: "emailRecommendations", label: "Personalised course recommendations" },
    ],
  },
  {
    heading: "News and announcements",
    rows: [
      { key: "emailNewsletter", label: "Monthly newsletter" },
      { key: "emailContentLaunches", label: "Content launches" },
      { key: "emailPromotions", label: "Promotions" },
    ],
  },
];

export function LearnSettings({
  name, email, premiumActive, premiumStatus,
}: {
  name: string | null;
  email: string | null;
  premiumActive: boolean;
  premiumStatus: string;
}) {
  const { prefs, update, saving, signedIn } = usePreferences();
  const [canSpeak, setCanSpeak] = useState(false);
  const [previewing, setPreviewing] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupported()) return;
    void loadVoices().then((voices) => setCanSpeak(voices.length > 0));
    return () => stop();
  }, []);

  function previewVoice(id: "melodic" | "deep") {
    if (previewing === id) {
      stop();
      setPreviewing(null);
      return;
    }
    speak(
      `Hello, I'm ${NARRATOR.name}. I'll read each step aloud and explain what's going on as you work through it.`,
      id,
      { onStart: () => setPreviewing(id), onEnd: () => setPreviewing(null) },
    );
  }

  const set = <K extends keyof Preferences>(key: K) => (value: Preferences[K]) =>
    void update({ [key]: value } as Partial<Preferences>);

  // The master opt-out doesn't clear the individual flags — it overrides
  // them, so turning it back off restores what the learner had chosen.
  const emailOff = prefs.emailOptOutAll;

  return (
    <main className={css.wrap}>
      <h1 className={css.title}>Settings</h1>

      <section className={css.group}>
        <h2 className={css.groupTitle}>Account</h2>
        <div className={css.panel}>
          <Row label="Name">
            <span className={css.accountValue}>{name ?? "Not signed in"}</span>
          </Row>
          <Row label="Email">
            <span className={css.accountValue}>{email ?? "—"}</span>
          </Row>
          {signedIn && (
            <Row label="Sign out" note="You'll keep your streak, XP and progress.">
              <Link href="/api/auth/logout" className={css.linkBtn}>Sign out</Link>
            </Row>
          )}
        </div>
      </section>

      <section className={css.group}>
        <h2 className={css.groupTitle}>Premium</h2>
        <div className={css.panel}>
          <Row
            label={premiumActive ? "Premium is active" : "You're on the free plan"}
            note={
              premiumActive
                ? premiumStatus === "trialing"
                  ? "Your free trial is running."
                  : "Every track and certificate is unlocked."
                : "One lesson a day is free. Premium lifts the limit."
            }
          >
            <Link href="/learn/premium" className={css.linkBtn}>
              {premiumActive ? "Manage" : "See plans"}
            </Link>
          </Row>
        </div>
      </section>

      <section className={css.group}>
        <h2 className={css.groupTitle}>Appearance</h2>
        <p className={css.groupNote}>Choose your preferred colour mode.</p>
        <div className={css.panel}>
          <Row label="Colour mode">
            <Segmented
              label="Colour mode"
              value={prefs.theme}
              onChange={set("theme")}
              options={[
                { value: "auto", label: "Auto" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </Row>
          <Row
            label="Reduce motion"
            note="Turns off animations across lessons and the roadmap. Auto follows your system setting."
          >
            <Segmented
              label="Reduce motion"
              value={prefs.reduceMotion}
              onChange={set("reduceMotion")}
              options={[
                { value: "on", label: "On" },
                { value: "off", label: "Off" },
                { value: "auto", label: "Auto" },
              ]}
            />
          </Row>
        </div>
      </section>

      <section className={css.group}>
        <h2 className={css.groupTitle}>Sound</h2>
        <div className={css.panel}>
          <Row
            label={`Enable ${NARRATOR.name} narration in lessons`}
            note={
              canSpeak
                ? `${NARRATOR.name} reads each step aloud and explains it as you go, using your device\u2019s own voices.`
                : "Your browser doesn\u2019t offer speech, so narration is unavailable here. Try Chrome, Edge or Safari."
            }
          >
            <Toggle
              label={`${NARRATOR.name} narration`}
              checked={prefs.narrationEnabled && canSpeak}
              disabled={!canSpeak}
              onChange={set("narrationEnabled")}
            />
          </Row>

          <p className={css.subhead}>Choose {NARRATOR.name}&apos;s voice</p>
          <div className={css.voices}>
            {NARRATOR.voices.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={prefs.narratorVoice === v.id}
                className={css.voice}
                onClick={() => { set("narratorVoice")(v.id); play("tap"); }}
              >
                <span className={css.voiceName}>{v.label}</span>
                <span className={css.voiceNote}>{v.note}</span>
                {canSpeak && (
                  // A span, not a button: nesting one button inside another
                  // is invalid HTML and breaks the outer one's keyboard
                  // behaviour.
                  <span
                    role="button"
                    tabIndex={0}
                    className={css.voicePreview}
                    onClick={(e) => { e.stopPropagation(); previewVoice(v.id); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        previewVoice(v.id);
                      }
                    }}
                  >
                    {previewing === v.id ? "Stop" : "Hear it"}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Row
            label="Enable sound effects in lessons"
            note="Short cues when you answer, earn XP, or finish a lesson."
          >
            <Toggle
              label="Sound effects"
              checked={prefs.soundEffects}
              onChange={(v) => {
                set("soundEffects")(v);
                // Play the confirmation after the setting lands, so turning
                // sound on demonstrates itself.
                if (v) setTimeout(() => play("correct"), 60);
              }}
            />
          </Row>
        </div>
      </section>

      <section className={css.group}>
        <h2 className={css.groupTitle}>Email notifications</h2>
        <div className={css.panel}>
          {EMAIL_SECTIONS.map((section) => (
            <div key={section.heading}>
              <p className={css.subhead}>{section.heading}</p>
              {section.rows.map((row) => (
                <Row key={row.key} label={row.label} note={row.note} disabled={emailOff}>
                  <Toggle
                    label={`${section.heading}: ${row.label}`}
                    checked={!emailOff && Boolean(prefs[row.key])}
                    disabled={emailOff}
                    onChange={set(row.key) as (v: boolean) => void}
                  />
                </Row>
              ))}
            </div>
          ))}

          <p className={css.subhead}>Global</p>
          <Row
            label="Don't send me anything"
            note="Aside from vital account email such as password resets and payment receipts."
          >
            <Toggle
              label="Opt out of all email"
              checked={prefs.emailOptOutAll}
              onChange={set("emailOptOutAll")}
            />
          </Row>
        </div>
      </section>

      <footer className={css.footer}>
        <Link href="/about" className={css.footerLink}>About us</Link>
        <Link href="/contact" className={css.footerLink}>Careers</Link>
        <Link href="/contact" className={css.footerLink}>Educators</Link>
        <Link href="/contact" className={css.footerLink}>Help</Link>
        <Link href="/contact" className={css.footerLink}>Legal</Link>
      </footer>

      {saving && <p className={`${css.saving} ${shell.srOnly ? "" : ""}`}>Saving…</p>}
    </main>
  );
}
