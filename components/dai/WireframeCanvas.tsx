"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import css from "./WireframeCanvas.module.css";

// A hand-drawn wireframing canvas — an Excalidraw-style sketchpad, but with
// UI-specific stamps (button/input/image) since this is used for teaching
// interface design rather than general diagramming.

type Tool = "select" | "rect" | "ellipse" | "line" | "arrow" | "draw" | "text" | "button" | "input" | "image";
type Pt = { x: number; y: number };

type El = {
  id: number;
  tool: Exclude<Tool, "select">;
  x: number;
  y: number;
  w: number;
  h: number;
  points?: Pt[];
  text?: string;
  accent?: boolean;
  seed: number;
};

// Seeded RNG so the hand-drawn jitter stays put across redraws instead of
// shimmering on every frame.
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

function roughLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, j: () => number) {
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    ctx.moveTo(x1 + j(), y1 + j());
    ctx.quadraticCurveTo((x1 + x2) / 2 + j() * 1.8, (y1 + y2) / 2 + j() * 1.8, x2 + j(), y2 + j());
    ctx.stroke();
  }
}

function roughRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, j: () => number) {
  roughLine(ctx, x, y, x + w, y, j);
  roughLine(ctx, x + w, y, x + w, y + h, j);
  roughLine(ctx, x + w, y + h, x, y + h, j);
  roughLine(ctx, x, y + h, x, y, j);
}

function roughEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, j: () => number) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const rx = Math.abs(w / 2);
  const ry = Math.abs(h / 2);
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const px = cx + Math.cos(a) * rx + j();
      const py = cy + Math.sin(a) * ry + j();
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

function drawElement(ctx: CanvasRenderingContext2D, el: El, ink: string, accent: string, font: string) {
  const rand = rng(el.seed);
  const j = () => (rand() - 0.5) * 2.2;
  ctx.strokeStyle = el.accent ? accent : ink;
  ctx.fillStyle = el.accent ? accent : ink;
  ctx.lineWidth = 1.7;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const x = el.w < 0 ? el.x + el.w : el.x;
  const y = el.h < 0 ? el.y + el.h : el.y;
  const w = Math.abs(el.w);
  const h = Math.abs(el.h);

  switch (el.tool) {
    case "rect":
      roughRect(ctx, x, y, w, h, j);
      break;
    case "ellipse":
      roughEllipse(ctx, x, y, w, h, j);
      break;
    case "line":
      roughLine(ctx, el.x, el.y, el.x + el.w, el.y + el.h, j);
      break;
    case "arrow": {
      roughLine(ctx, el.x, el.y, el.x + el.w, el.y + el.h, j);
      const ang = Math.atan2(el.h, el.w);
      const tipX = el.x + el.w;
      const tipY = el.y + el.h;
      const len = 12;
      roughLine(ctx, tipX, tipY, tipX - len * Math.cos(ang - 0.4), tipY - len * Math.sin(ang - 0.4), j);
      roughLine(ctx, tipX, tipY, tipX - len * Math.cos(ang + 0.4), tipY - len * Math.sin(ang + 0.4), j);
      break;
    }
    case "draw": {
      const pts = el.points || [];
      if (pts.length < 2) break;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const mid = { x: (pts[i - 1].x + pts[i].x) / 2, y: (pts[i - 1].y + pts[i].y) / 2 };
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, mid.x, mid.y);
      }
      ctx.stroke();
      break;
    }
    case "text":
      ctx.font = `16px ${font}`;
      ctx.textBaseline = "top";
      ctx.fillText(el.text || "", el.x, el.y);
      break;
    case "button": {
      roughRect(ctx, x, y, w, h, j);
      ctx.font = `13px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(el.text || "Button", x + w / 2, y + h / 2);
      ctx.textAlign = "start";
      break;
    }
    case "input": {
      roughRect(ctx, x, y, w, h, j);
      ctx.globalAlpha = 0.45;
      roughLine(ctx, x + 10, y + h / 2, x + Math.min(w - 14, 70), y + h / 2, j);
      ctx.globalAlpha = 1;
      break;
    }
    case "image": {
      roughRect(ctx, x, y, w, h, j);
      ctx.globalAlpha = 0.45;
      roughLine(ctx, x, y, x + w, y + h, j);
      roughLine(ctx, x + w, y, x, y + h, j);
      ctx.globalAlpha = 1;
      break;
    }
  }
}

const TOOLS: { id: Tool; label: string; hint: string }[] = [
  { id: "select", label: "Select", hint: "Select / move / delete" },
  { id: "draw", label: "Pencil", hint: "Freehand" },
  { id: "rect", label: "Box", hint: "Rectangle" },
  { id: "ellipse", label: "Oval", hint: "Ellipse" },
  { id: "line", label: "Line", hint: "Line" },
  { id: "arrow", label: "Arrow", hint: "Arrow" },
  { id: "text", label: "Text", hint: "Text label" },
  { id: "button", label: "Button", hint: "UI: button" },
  { id: "input", label: "Input", hint: "UI: text field" },
  { id: "image", label: "Image", hint: "UI: image placeholder" },
];

export function WireframeCanvas({ title = "sketch", starterHint }: { title?: string; starterHint?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("rect");
  const [accent, setAccent] = useState(false);
  const [els, setEls] = useState<El[]>([]);
  const [draft, setDraft] = useState<El | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [textDraft, setTextDraft] = useState<{ x: number; y: number; value: string } | null>(null);
  const [colors, setColors] = useState({ paper: "#ffffff", ink: "#17140F", accent: "#FF7500", grid: "#00000010" });

  const dragRef = useRef<{ mode: "create" | "move"; startX: number; startY: number; origX: number; origY: number } | null>(null);
  // The in-progress shape lives in a ref as well as state: state drives the
  // render, the ref is the source of truth on pointerup. Committing from
  // inside a setDraft updater instead would be a side effect in a function
  // React is free to call twice — which duplicated every shape.
  const draftRef = useRef<El | null>(null);

  const putDraft = useCallback((d: El | null) => {
    draftRef.current = d;
    setDraft(d);
  }, []);

  // Read palette from the surrounding shell so the canvas follows the site
  // theme instead of hardcoding a light-only look.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const read = () => {
      const s = getComputedStyle(el);
      const v = (n: string, f: string) => s.getPropertyValue(n).trim() || f;
      setColors({
        paper: v("--bg2", "#ffffff"),
        ink: v("--text", "#17140F"),
        accent: v("--accent", "#FF7500"),
        grid: v("--border", "#00000010"),
      });
    };
    read();
    const host = el.closest("[data-theme]");
    if (!host) return;
    const obs = new MutationObserver(read);
    obs.observe(host, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // dot grid
    ctx.fillStyle = colors.grid;
    for (let gx = 20; gx < rect.width; gx += 20) {
      for (let gy = 20; gy < rect.height; gy += 20) {
        ctx.fillRect(gx, gy, 1, 1);
      }
    }

    const font = getComputedStyle(document.body).fontFamily || "sans-serif";
    for (const el of els) drawElement(ctx, el, colors.ink, colors.accent, font);
    if (draft) drawElement(ctx, draft, colors.ink, colors.accent, font);

    if (selectedId !== null) {
      const sel = els.find((e) => e.id === selectedId);
      if (sel) {
        const x = sel.w < 0 ? sel.x + sel.w : sel.x;
        const y = sel.h < 0 ? sel.y + sel.h : sel.y;
        ctx.strokeStyle = colors.accent;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 6, y - 6, Math.abs(sel.w) + 12, Math.abs(sel.h) + 12);
        ctx.setLineDash([]);
      }
    }
  }, [els, draft, selectedId, colors]);

  useEffect(() => { redraw(); }, [redraw]);
  useEffect(() => {
    const onResize = () => redraw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [redraw]);

  function pos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function hitTest(p: Pt) {
    for (let i = els.length - 1; i >= 0; i--) {
      const el = els[i];
      const x = el.w < 0 ? el.x + el.w : el.x;
      const y = el.h < 0 ? el.y + el.h : el.y;
      const w = Math.abs(el.w) || 60;
      const h = Math.abs(el.h) || 20;
      if (p.x >= x - 8 && p.x <= x + w + 8 && p.y >= y - 8 && p.y <= y + h + 8) return el;
    }
    return null;
  }

  function onPointerDown(e: React.PointerEvent) {
    if (textDraft) return;
    const p = pos(e);
    try { (e.target as Element).setPointerCapture(e.pointerId); } catch { /* non-capturable pointer */ }

    if (tool === "select") {
      const hit = hitTest(p);
      setSelectedId(hit ? hit.id : null);
      if (hit) dragRef.current = { mode: "move", startX: p.x, startY: p.y, origX: hit.x, origY: hit.y };
      return;
    }

    if (tool === "text") {
      setTextDraft({ x: p.x, y: p.y, value: "" });
      return;
    }

    const seed = Math.floor(Math.random() * 100000) + 1;
    const base: El = { id: Date.now(), tool: tool as Exclude<Tool, "select">, x: p.x, y: p.y, w: 0, h: 0, accent, seed };
    if (tool === "draw") base.points = [p];
    if (tool === "button") { base.w = 110; base.h = 40; }
    if (tool === "input") { base.w = 180; base.h = 40; }
    if (tool === "image") { base.w = 140; base.h = 100; }
    putDraft(base);
    dragRef.current = { mode: "create", startX: p.x, startY: p.y, origX: p.x, origY: p.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    const p = pos(e);

    if (drag.mode === "move" && selectedId !== null) {
      setEls((prev) => prev.map((el) => el.id === selectedId
        ? { ...el, x: drag.origX + (p.x - drag.startX), y: drag.origY + (p.y - drag.startY) }
        : el));
      return;
    }

    const d = draftRef.current;
    if (!d) return;
    if (d.tool === "draw") {
      putDraft({ ...d, points: [...(d.points || []), p] });
    } else if (d.tool !== "button" && d.tool !== "input" && d.tool !== "image") {
      putDraft({ ...d, w: p.x - drag.startX, h: p.y - drag.startY });
    }
  }

  function onPointerUp() {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (drag.mode === "move") return;
    const d = draftRef.current;
    putDraft(null);
    if (!d) return;
    const tiny = Math.abs(d.w) < 4 && Math.abs(d.h) < 4 && (d.points?.length ?? 0) < 2;
    const isStamp = d.tool === "button" || d.tool === "input" || d.tool === "image";
    if (tiny && !isStamp) return;
    setEls((prev) => [...prev, d]);
  }

  function commitText() {
    if (!textDraft) return;
    const v = textDraft.value.trim();
    if (v) {
      setEls((prev) => [...prev, {
        id: Date.now(), tool: "text", x: textDraft.x, y: textDraft.y,
        w: v.length * 8, h: 18, text: v, accent, seed: 1,
      }]);
    }
    setTextDraft(null);
  }

  function undo() { setEls((p) => p.slice(0, -1)); setSelectedId(null); }
  function clearAll() { setEls([]); setSelectedId(null); putDraft(null); }
  function deleteSelected() {
    if (selectedId === null) return;
    setEls((p) => p.filter((e) => e.id !== selectedId));
    setSelectedId(null);
  }

  function exportPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${title.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (textDraft) return;
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId !== null) {
        e.preventDefault();
        deleteSelected();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, textDraft]);

  return (
    <div className={css.wrap} ref={wrapRef}>
      <div className={css.header}>
        <div className={css.titleRow}>
          <span className={css.title}>{title}</span>
          {starterHint && <span className={css.hint}>{starterHint}</span>}
        </div>
        <div className={css.actions}>
          <button type="button" className={`${css.chip} ${accent ? css.chipOn : ""}`} onClick={() => setAccent((v) => !v)}>
            {accent ? "Accent" : "Ink"}
          </button>
          <button type="button" className={css.chip} onClick={undo} disabled={!els.length}>Undo</button>
          <button type="button" className={css.chip} onClick={clearAll} disabled={!els.length}>Clear</button>
          <button type="button" className={css.primary} onClick={exportPng}>Export PNG</button>
        </div>
      </div>

      <div className={css.toolbar}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.hint}
            className={`${css.tool} ${tool === t.id ? css.toolOn : ""}`}
            onClick={() => { setTool(t.id); setSelectedId(null); }}
          >
            {t.label}
          </button>
        ))}
        {selectedId !== null && (
          <button type="button" className={css.danger} onClick={deleteSelected}>Delete</button>
        )}
      </div>

      <div className={css.canvasWrap}>
        <canvas
          ref={canvasRef}
          className={css.canvas}
          style={{ cursor: tool === "select" ? "default" : "crosshair" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
        {textDraft && (
          <input
            autoFocus
            className={css.textInput}
            style={{ left: textDraft.x, top: textDraft.y }}
            value={textDraft.value}
            onChange={(e) => setTextDraft({ ...textDraft, value: e.target.value })}
            onBlur={commitText}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitText();
              if (e.key === "Escape") setTextDraft(null);
            }}
            placeholder="Type, then Enter"
          />
        )}
      </div>
    </div>
  );
}
