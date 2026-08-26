"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import css from "./learn-app.module.css";
import { CheckIcon, LockIcon } from "./icons";

export type StopState = "done" | "current" | "open" | "ahead" | "tomorrow";

export type RoadStop = {
  stage: number;
  title: string;
  time: string;
  state: StopState;
  href: string;
  note?: string;
};

// The wave the trail snakes through, as offsets from the wave column's
// centre. Kept narrow on purpose: the trail is a texture, not the subject.
const OFFSETS = [0, 1, 2, 1, 0, -1, -2, -1];

// labelX has to clear the widest the wave ever gets:
//   waveCentre + (max offset x unit) + node radius + a real gap.
// Desktop: 62 + 44 + 23 + 23 = 152. Mobile: 42 + 30 + 23 + 17 = 112.
// Getting this wrong by a pixel is exactly how the labels were clipping
// the rings, so the numbers are spelled out rather than eyeballed.
const NODE_RADIUS = 23;
const DESKTOP = { unit: 22, row: 86, waveCentre: 62, labelX: 152, top: 36 };
// Mobile labels get a narrower column, so titles wrap to three lines and
// need noticeably more vertical room than the desktop rows do.
const MOBILE = { unit: 15, row: 108, waveCentre: 42, labelX: 112, top: 34 };

/** Smooth S-curve between consecutive stops. */
function buildPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const midY = (a.y + b.y) / 2;
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`;
  }
  return d;
}

export function LessonRoad({
  stops,
  color,
}: {
  stops: RoadStop[];
  /** The course accent, used for the travelled part of the trail. */
  color: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(max-width: 720px)");
    setNarrow(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const geo = narrow ? MOBILE : DESKTOP;

  const points = useMemo(
    () =>
      stops.map((_, i) => ({
        x: geo.waveCentre + OFFSETS[i % OFFSETS.length] * geo.unit,
        y: geo.top + i * geo.row,
      })),
    [stops, geo],
  );

  const height = geo.top + Math.max(0, stops.length - 1) * geo.row + geo.top;

  const travelledTo = stops.reduce(
    (last, s, i) => (s.state === "done" || s.state === "current" ? i : last),
    -1,
  );

  const fullPath = buildPath(points);
  const donePath = travelledTo > 0 ? buildPath(points.slice(0, travelledTo + 1)) : "";

  return (
    <div ref={boxRef} className={css.road} style={{ height }}>
      {width > 0 && (
        <svg className={css.roadPath} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <path className={css.roadTrack} d={fullPath} />
          {donePath && <path className={css.roadDone} d={donePath} stroke={color} />}
        </svg>
      )}

      {stops.map((stop, i) => {
        const locked = stop.state === "tomorrow";
        const point = points[i];

        // A ring holds a symbol, not a number — the number reads better as a
        // quiet "Lesson 03" above the title, where it doesn't compete with
        // the state the ring is trying to communicate.
        const symbol =
          stop.state === "done" ? <CheckIcon size={20} />
          : locked ? <LockIcon size={17} />
          : <span className={css.nodeDot} />;

        const node = (
          <span
            className={css.node}
            data-state={stop.state}
            style={{ ["--nodeColor" as string]: color }}
          >
            {symbol}
            {stop.state === "current" && <span className={css.flag}>Start</span>}
          </span>
        );

        const label = (
          <>
            <p className={css.roadNum}>Lesson {String(stop.stage + 1).padStart(2, "0")}</p>
            <p className={css.roadTitle}>{stop.title}</p>
            <p className={css.roadMeta}>
              {stop.time}
              {stop.note ? ` · ${stop.note}` : ""}
            </p>
          </>
        );

        const nodeStyle = { left: `${point.x}px`, top: `${point.y}px` };
        const labelStyle = { left: `${geo.labelX}px`, top: `${point.y}px` };

        return (
          <div key={stop.stage}>
            {locked ? (
              <span className={css.roadStop} data-locked="true" style={nodeStyle} title="Unlocks tomorrow">
                {node}
              </span>
            ) : (
              <Link href={stop.href} className={css.roadStop} style={nodeStyle} aria-hidden="true" tabIndex={-1}>
                {node}
              </Link>
            )}

            {locked ? (
              <span className={css.roadLabel} data-locked="true" data-state={stop.state} style={labelStyle}>
                {label}
              </span>
            ) : (
              <Link href={stop.href} className={css.roadLabel} data-state={stop.state} style={labelStyle}>
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
