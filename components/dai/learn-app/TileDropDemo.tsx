"use client";

import { useEffect, useRef, useState } from "react";
import css from "./landing.module.css";
import { BoltIcon, FlameIcon, TrophyIcon } from "./icons";

// The hero's live exercise: an expression with blanks, a bank of tiles, and
// a cursor that fills them in on a loop. It is the same interaction the
// lessons use, so the landing page demonstrates the teaching model instead
// of describing it.

/** Positions are percentages of the card, so the cursor tracks on resize. */
type Point = { x: number; y: number };

const CURSOR_REST: Point = { x: 88, y: 88 };

type Step = {
  /** Which bank tile the cursor travels to, then which slot it fills. */
  tile: number;
  slot: number;
  from: Point;
  to: Point;
};

const EXPRESSION = [
  { text: "nums.", kind: "dim" as const },
  { kind: "slot" as const, index: 0 },
  { text: "((n) => n ", kind: "dim" as const },
  { kind: "slot" as const, index: 1 },
  { text: " 2)", kind: "dim" as const },
];

const SLOT_ANSWERS = ["map", "*"];
const BANK = ["filter", "map", "+", "*", "reduce"];

const STEPS: Step[] = [
  { tile: 1, slot: 0, from: { x: 36, y: 79 }, to: { x: 33, y: 40 } },
  { tile: 3, slot: 1, from: { x: 66, y: 79 }, to: { x: 62, y: 40 } },
];

// One cycle, in milliseconds from the start of the loop.
const T = {
  firstReach: 700,
  lift: 1250,
  drop: 2050,
  secondReach: 2900,
  lift2: 3450,
  drop2: 4250,
  xp: 4600,
  hold: 7200,
};

export function TileDropDemo({ motionOff }: { motionOff: boolean }) {
  // Static, solved state when motion is off — the point is the model, and
  // that survives without the animation.
  const [filled, setFilled] = useState<number[]>(motionOff ? [0, 1] : []);
  const [settled, setSettled] = useState<number[]>(motionOff ? [0, 1] : []);
  const [lifting, setLifting] = useState<number | null>(null);
  const [cursor, setCursor] = useState<Point>(CURSOR_REST);
  const [showXp, setShowXp] = useState(motionOff);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (motionOff) return;

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };

    function cycle() {
      setFilled([]);
      setSettled([]);
      setShowXp(false);
      setLifting(null);
      setCursor(CURSOR_REST);

      const [first, second] = STEPS;

      at(T.firstReach, () => setCursor(first.from));
      at(T.lift, () => setLifting(first.tile));
      at(T.lift + 250, () => setCursor(first.to));
      at(T.drop, () => {
        setLifting(null);
        setFilled([first.slot]);
      });
      at(T.drop + 380, () => setSettled([first.slot]));

      at(T.secondReach, () => setCursor(second.from));
      at(T.lift2, () => setLifting(second.tile));
      at(T.lift2 + 250, () => setCursor(second.to));
      at(T.drop2, () => {
        setLifting(null);
        setFilled([first.slot, second.slot]);
      });
      at(T.drop2 + 380, () => setSettled([first.slot, second.slot]));

      at(T.xp, () => {
        setShowXp(true);
        setCursor(CURSOR_REST);
      });

      at(T.hold, () => {
        // Clear the finished cycle's timers before queuing the next, or they
        // accumulate for as long as the tab stays open.
        timers.current.forEach(clearTimeout);
        timers.current = [];
        cycle();
      });
    }

    cycle();
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [motionOff]);

  const usedTiles = filled.map((slot) => STEPS.find((s) => s.slot === slot)!.tile);

  return (
    <div className={css.demoWrap}>
      <div className={css.demo}>
        <div className={css.demoBar}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={css.demoSeg} data-on={i < 3 + filled.length}>
              <span className={css.demoSegFill} />
            </span>
          ))}
        </div>

        <span className={css.demoEyebrow}>
          <BoltIcon size={11} /> JavaScript · Lesson 4
        </span>

        <p className={css.demoQ}>Complete the expression that doubles every number.</p>

        <div className={css.expr}>
          {EXPRESSION.map((part, i) =>
            part.kind === "slot" ? (
              <span
                key={i}
                className={css.slot}
                data-filled={filled.includes(part.index)}
                data-settled={settled.includes(part.index)}
              >
                {SLOT_ANSWERS[part.index]}
              </span>
            ) : (
              <span key={i} className={css.tokenDim}>{part.text}</span>
            ),
          )}
        </div>

        <div className={css.bank}>
          {BANK.map((tile, i) => (
            <span
              key={tile}
              className={css.tile}
              data-used={usedTiles.includes(i)}
              data-lifting={lifting === i}
            >
              {tile}
            </span>
          ))}
        </div>

        {!motionOff && (
          <span
            className={css.cursor}
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
            aria-hidden="true"
          >
            <CursorArrow />
          </span>
        )}

        {showXp && (
          <span className={css.xpPop} key={String(filled.length)}>
            +20 <BoltIcon size={17} />
          </span>
        )}
      </div>

      <span className={`${css.chip} ${css.chipStreak}`}>
        <span style={{ color: "var(--streak)", display: "flex" }}><FlameIcon size={17} /></span>
        12-day streak
      </span>

      <span className={`${css.chip} ${css.chipLeague}`}>
        <span style={{ color: "#E8890C", display: "flex" }}><TrophyIcon size={17} /></span>
        2nd in Hydrogen
      </span>
    </div>
  );
}

const CursorArrow = () => (
  <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
    <path
      d="M3 2.2 21.4 15.6l-7.9 1.1 4.2 8.4-3.3 1.7-4.2-8.4-5.3 5.4z"
      fill="#14120F"
      stroke="#fff"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);
