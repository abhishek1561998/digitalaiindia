"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import css from "./premium-flow.module.css";
import { CloseIcon, CheckIcon, LockIcon, BoltIcon, TrophyIcon } from "./icons";
import { play } from "@/lib/learn/sound";
import { PLANS, TRIAL_DAYS, type PlanId } from "@/lib/learn/pricing";
import { COURSE_SUMMARIES } from "@/lib/learn/catalog";
import { NARRATOR } from "@/lib/learn/preferences";

const BENEFITS: { name: string; free: boolean }[] = [
  { name: "One lesson a day", free: true },
  { name: "Daily streak, XP, badges and leagues", free: true },
  { name: `${NARRATOR.name} reading every step aloud`, free: true },
  { name: "Unlimited lessons — go as fast as you like", free: false },
  { name: `Every lesson in all ${COURSE_SUMMARIES.length} tracks, today`, free: false },
  { name: "Playgrounds and build challenges", free: false },
  { name: "New tracks the day they ship", free: false },
];

/** The date the trial would end, formatted the way a receipt would say it. */
function trialEndLabel() {
  const d = new Date(Date.now() + TRIAL_DAYS * 86_400_000);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function PremiumFlow({
  premiumActive,
  signedIn,
  trialUsed,
}: {
  premiumActive: boolean;
  signedIn: boolean;
  trialUsed: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<PlanId>("annual");
  const [starting, setStarting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const steps = ["benefits", "plans", "timeline"] as const;
  const kind = steps[step];

  async function startTrial() {
    if (!signedIn) {
      router.push("/auth?redirect=/learn/premium");
      return;
    }
    setStarting(true);
    setNotice(null);
    try {
      const res = await fetch("/api/learn/subscription/trial", { method: "POST" });
      const data = await res.json();
      if (data.error || data.alreadyUsed) {
        setNotice(data.message ?? "Couldn't start the trial. Try again.");
        return;
      }
      play("unlock");
      window.location.href = "/";
    } catch {
      setNotice("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setStarting(false);
    }
  }

  function advance() {
    if (step < steps.length - 1) {
      play("tap");
      setStep((s) => s + 1);
      return;
    }
    void startTrial();
  }

  if (premiumActive) {
    return (
      <div className={css.flow}>
        <Link href="/" className={css.close} aria-label="Close"><CloseIcon /></Link>
        <div className={css.stage}>
          <span className={css.crest}><Crest /></span>
          <h1 className={css.headline}>
            You&apos;re on <span className={css.shine}>Premium</span>
          </h1>
          <p className={css.sub}>
            Every track, every lesson and every certificate is unlocked. Go and use it.
          </p>
        </div>
        <div className={css.foot}>
          <Link href="/learn/courses" className={css.cta} style={{ display: "grid", placeItems: "center", textDecoration: "none" }}>
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  const annual = PLANS.annual;
  const monthly = PLANS.monthly;

  return (
    <div className={css.flow}>
      <Link href="/" className={css.close} aria-label="Close"><CloseIcon /></Link>

      <div className={css.stage}>
        <div className={css.stepIn} key={kind}>
          {kind === "benefits" && (
            <>
              <h1 className={css.headline}>
                Unlock the whole thing with <span className={css.shine}>Premium</span>
              </h1>
              <p className={css.sub}>
                The free plan is a real plan — one lesson every day, forever, with no cap
                on how far it takes you. Premium is the same thing without the wait.
              </p>

              <table className={css.table}>
                <thead>
                  <tr>
                    <th scope="col">Benefits</th>
                    <th scope="col" className={css.colFree}>Free</th>
                    <th scope="col" className={css.colPremium}>Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {BENEFITS.map((b) => (
                    <tr key={b.name}>
                      <td className={css.benefitName}>{b.name}</td>
                      <td className={css.colFree}>
                        <span className={`${css.mark} ${b.free ? css.markYes : css.markNo}`}>
                          {b.free ? <CheckIcon size={13} /> : <CloseIcon size={13} />}
                        </span>
                      </td>
                      <td className={css.colPremium}>
                        <span className={`${css.mark} ${css.markYes}`}><CheckIcon size={13} /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {kind === "plans" && (
            <>
              <span className={css.crest}><Crest /></span>
              <h1 className={css.headline}>
                <span className={css.shine}>Premium</span>, at an Indian price
              </h1>
              <p className={css.sub}>
                Every track, every certificate. Less than one month of most courses — for a year.
              </p>

              <div className={css.plans}>
                <button
                  type="button"
                  aria-pressed={plan === "annual"}
                  className={css.planPick}
                  onClick={() => { setPlan("annual"); play("tap"); }}
                >
                  <span className={css.planFlag}>Best value</span>
                  <p className={css.planPickName}>Annual</p>
                  <div className={css.planPickPrice}>
                    ₹{annual.perMonth}<span className={css.planPickPer}>/month</span>
                  </div>
                  <p className={css.planPickNote}>₹{annual.amount} billed once a year</p>
                  <span className={css.planSave}>Save {annual.savingPercent}%</span>
                </button>

                <button
                  type="button"
                  aria-pressed={plan === "monthly"}
                  className={css.planPick}
                  onClick={() => { setPlan("monthly"); play("tap"); }}
                >
                  <p className={css.planPickName}>Monthly</p>
                  <div className={css.planPickPrice}>
                    ₹{monthly.amount}<span className={css.planPickPer}>/month</span>
                  </div>
                  <p className={css.planPickNote}>Cancel any time</p>
                </button>
              </div>

              <p className={css.fineprint}>
                {TRIAL_DAYS} days free first. We ask before any charge — nothing is taken
                automatically.
              </p>
            </>
          )}

          {kind === "timeline" && (
            <>
              <h1 className={css.headline}>
                How your <span className={css.shine}>Premium</span> free trial works
              </h1>

              <div className={css.timeline} style={{ marginTop: "2.5rem" }}>
                <div className={css.stop} data-now="true">
                  <span className={css.stopMark}><LockIcon size={26} /></span>
                  <p className={css.stopWhen}>Today</p>
                  <p className={css.stopWhat}>
                    Every track, every lesson and {NARRATOR.name}&apos;s narration unlock right away
                  </p>
                </div>
                <div className={css.stop}>
                  <span className={css.stopMark}><BoltIcon size={26} /></span>
                  <p className={css.stopWhen}>In {TRIAL_DAYS - 2} days</p>
                  <p className={css.stopWhat}>
                    We email you a reminder that the trial is nearly up
                  </p>
                </div>
                <div className={css.stop}>
                  <span className={css.stopMark}><TrophyIcon size={26} /></span>
                  <p className={css.stopWhen}>On {trialEndLabel()}</p>
                  <p className={css.stopWhat}>
                    The trial ends and you drop back to free — we only charge you if you
                    choose to subscribe
                  </p>
                </div>
              </div>

              <p className={css.fineprint} style={{ marginTop: "2rem" }}>
                No card needed to start. You keep every lesson you finished, your XP and your
                streak either way.
              </p>
            </>
          )}

          {notice && <p className={css.notice} style={{ marginTop: "1.25rem" }}>{notice}</p>}
        </div>
      </div>

      <div className={css.foot}>
        <button type="button" className={css.cta} onClick={advance} disabled={starting}>
          {starting
            ? "Starting…"
            : kind === "timeline"
              ? trialUsed ? "Choose a plan" : "Start my free week"
              : "Continue"}
        </button>

        <div className={css.dots} aria-hidden="true">
          {steps.map((s, i) => <span key={s} className={css.dot} data-on={i === step} />)}
        </div>

        {step > 0 && (
          <button type="button" className={css.back} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}

// The Premium mark: three interlocking blocks, same isometric language as the
// course glyphs so the upsell still looks like it belongs to this app.
const Crest = () => (
  <svg width="92" height="92" viewBox="0 0 92 92" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="crestA" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6C5CE7" />
        <stop offset="100%" stopColor="#9B8BFF" />
      </linearGradient>
      <linearGradient id="crestB" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E85D9E" />
        <stop offset="100%" stopColor="#FF9AC6" />
      </linearGradient>
      <linearGradient id="crestC" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0B429" />
        <stop offset="100%" stopColor="#FFD980" />
      </linearGradient>
    </defs>
    <polygon points="46,8 72,23 46,38 20,23" fill="url(#crestC)" />
    <polygon points="20,23 46,38 46,68 20,53" fill="url(#crestA)" />
    <polygon points="72,23 72,53 46,68 46,38" fill="url(#crestB)" />
    <polygon points="46,38 58,45 46,52 34,45" fill="#fff" opacity="0.9" />
  </svg>
);
