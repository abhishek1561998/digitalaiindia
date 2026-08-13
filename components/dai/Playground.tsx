"use client";

import { useState } from "react";
import css from "./Playground.module.css";

type LogLine = { type: "log" | "error" | "return"; text: string };

function formatValue(v: unknown): string {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  try {
    return JSON.stringify(v, null, 2) ?? String(v);
  } catch {
    return String(v);
  }
}

export function Playground({ title = "Try it yourself", initialCode }: { title?: string; initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [lines, setLines] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);

  function run() {
    setRunning(true);
    const captured: LogLine[] = [];
    const fakeConsole = {
      log: (...args: unknown[]) => captured.push({ type: "log", text: args.map(formatValue).join(" ") }),
      error: (...args: unknown[]) => captured.push({ type: "error", text: args.map(formatValue).join(" ") }),
      warn: (...args: unknown[]) => captured.push({ type: "log", text: args.map(formatValue).join(" ") }),
      info: (...args: unknown[]) => captured.push({ type: "log", text: args.map(formatValue).join(" ") }),
    };

    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", `"use strict";\n${code}`);
      fn(fakeConsole);
      if (captured.length === 0) {
        captured.push({ type: "log", text: "(no console output — try adding a console.log)" });
      }
    } catch (err) {
      captured.push({ type: "error", text: err instanceof Error ? `${err.name}: ${err.message}` : String(err) });
    }

    setLines(captured);
    setRunning(false);
  }

  function reset() {
    setCode(initialCode);
    setLines([]);
  }

  return (
    <div className={css.wrap}>
      <div className={css.header}>
        <span className={css.title}>{title}</span>
        <div className={css.actions}>
          <button type="button" className={css.resetBtn} onClick={reset}>Reset</button>
          <button type="button" className={css.runBtn} onClick={run} disabled={running}>
            {running ? "Running…" : "▶ Run"}
          </button>
        </div>
      </div>
      <div className={css.body}>
        <textarea
          className={css.editor}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
        <div className={css.output}>
          <div className={css.outputLabel}>Console</div>
          {lines.length === 0 ? (
            <div className={css.outputEmpty}>Run the code to see output here.</div>
          ) : (
            lines.map((l, i) => (
              <div key={i} className={l.type === "error" ? css.outputError : css.outputLine}>
                {l.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
