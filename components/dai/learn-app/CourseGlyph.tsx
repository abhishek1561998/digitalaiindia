// Isometric course art, generated rather than drawn.
//
// Every course needs a piece of art that (a) reads instantly as *that*
// course and (b) belongs to the same family as the other seven. Hand-drawn
// illustrations give up (b) the moment a ninth course ships. So each glyph
// is a small composition of isometric cuboids tinted from the course's own
// accent — same light source, same projection, same plinth, different form.

const ISO_W = 15; // half-width of one grid cell, in px
const ISO_H = 8.6; // half-height of one grid cell
const UNIT_Z = 12; // one unit of height

function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * ISO_W, (x + y) * ISO_H - z * UNIT_Z];
}

function pts(list: [number, number][]) {
  return list.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * amount > 0 lightens toward white, < 0 darkens toward black.
 * Works on tuples, not strings, so shading can be composed (a tinted box's
 * faces are shaded again) without ever round-tripping through CSS syntax.
 */
function shade([r, g, b]: Rgb, amount: number): Rgb {
  const t = amount > 0 ? 255 : 0;
  const p = Math.abs(amount);
  const mix = (c: number) => Math.round((t - c) * p + c);
  return [mix(r), mix(g), mix(b)];
}

function toCss([r, g, b]: Rgb) {
  return `rgb(${r}, ${g}, ${b})`;
}

type Box = {
  /** grid position of the near corner */
  x: number;
  y: number;
  /** footprint, in grid cells */
  sx: number;
  sy: number;
  /** height, in z units */
  h: number;
  /** base height, in z units */
  z?: number;
  /** override colour — defaults to the course accent */
  c?: string;
  /** lighten/darken the whole box before face shading */
  tint?: number;
};

function Cuboid({ box, color }: { box: Box; color: string }) {
  const { x, y, sx, sy, h, z = 0, tint = 0 } = box;
  const base = hexToRgb(box.c ?? color);
  const body = tint === 0 ? base : shade(base, tint);

  const top = z + h;
  const p = (gx: number, gy: number, gz: number) => project(gx, gy, gz);

  const topFace: [number, number][] = [
    p(x, y, top),
    p(x + sx, y, top),
    p(x + sx, y + sy, top),
    p(x, y + sy, top),
  ];
  // The face at max-x catches the light; the face at max-y falls away.
  const rightFace: [number, number][] = [
    p(x + sx, y, top),
    p(x + sx, y + sy, top),
    p(x + sx, y + sy, z),
    p(x + sx, y, z),
  ];
  const leftFace: [number, number][] = [
    p(x, y + sy, top),
    p(x + sx, y + sy, top),
    p(x + sx, y + sy, z),
    p(x, y + sy, z),
  ];

  return (
    <g>
      <polygon points={pts(leftFace)} fill={toCss(shade(body, -0.34))} />
      <polygon points={pts(rightFace)} fill={toCss(shade(body, -0.12))} />
      <polygon points={pts(topFace)} fill={toCss(shade(body, 0.26))} />
    </g>
  );
}

// Painter's algorithm: things further from the camera draw first. In this
// projection "further" means a smaller x + y, with height breaking ties.
function depthSort(boxes: Box[]) {
  return [...boxes].sort(
    (a, b) => a.x + a.y + (a.z ?? 0) * 0.01 - (b.x + b.y + (b.z ?? 0) * 0.01),
  );
}

const PLINTH: Box[] = [{ x: -1.6, y: -1.6, sx: 3.2, sy: 3.2, h: 0.35, z: -0.35, tint: -0.05 }];

const COMPOSITIONS: Record<string, Box[]> = {
  // Braces stacked into a block — the language, compiled down.
  js: [
    { x: -1, y: -1, sx: 2, sy: 2, h: 0.5, z: 0.35 },
    { x: -0.7, y: -0.7, sx: 1.4, sy: 1.4, h: 0.5, z: 0.85, tint: 0.18 },
    { x: -0.4, y: -0.4, sx: 0.8, sy: 0.8, h: 0.7, z: 1.35, tint: 0.34 },
  ],
  // A binary tree: one root, two children, four leaves.
  dsa: [
    { x: -0.3, y: -0.3, sx: 0.6, sy: 0.6, h: 0.5, z: 1.6, tint: 0.3 },
    { x: -1.2, y: -0.2, sx: 0.6, sy: 0.6, h: 0.5, z: 0.85 },
    { x: -0.2, y: -1.2, sx: 0.6, sy: 0.6, h: 0.5, z: 0.85 },
    { x: -1.5, y: -1.5, sx: 0.55, sy: 0.55, h: 0.45, z: 0.1, tint: -0.12 },
    { x: 0.4, y: -1.5, sx: 0.55, sy: 0.55, h: 0.45, z: 0.1, tint: -0.12 },
    { x: -1.5, y: 0.4, sx: 0.55, sy: 0.55, h: 0.45, z: 0.1, tint: -0.12 },
    { x: 0.4, y: 0.4, sx: 0.55, sy: 0.55, h: 0.45, z: 0.1, tint: -0.12 },
  ],
  // Four tiers, fanned — database, server, API, client.
  mern: [
    { x: -1.3, y: -1.3, sx: 2.6, sy: 2.6, h: 0.3, z: 0.35 },
    { x: -1.05, y: -1.05, sx: 2.1, sy: 2.1, h: 0.3, z: 0.85, tint: 0.14 },
    { x: -0.8, y: -0.8, sx: 1.6, sy: 1.6, h: 0.3, z: 1.35, tint: 0.28 },
    { x: -0.5, y: -0.5, sx: 1.0, sy: 1.0, h: 0.35, z: 1.85, tint: 0.42 },
  ],
  // A dense core with satellites — weights around a model.
  genai: [
    { x: -0.55, y: -0.55, sx: 1.1, sy: 1.1, h: 1.2, z: 0.5, tint: 0.28 },
    { x: -1.6, y: -0.35, sx: 0.7, sy: 0.7, h: 0.45, z: 0.1 },
    { x: -0.35, y: -1.6, sx: 0.7, sy: 0.7, h: 0.45, z: 0.1 },
    { x: 0.85, y: -0.35, sx: 0.7, sy: 0.7, h: 0.7, z: 0.1, tint: -0.14 },
    { x: -0.35, y: 0.85, sx: 0.7, sy: 0.7, h: 0.7, z: 0.1, tint: -0.14 },
  ],
  // Prompt engineering: three stacked cards, the top one lifted and turned.
  prompting: [
    { x: -1.4, y: -1.2, sx: 2.4, sy: 1.9, h: 0.26, z: 0.3 },
    { x: -1.1, y: -0.9, sx: 2.2, sy: 1.9, h: 0.26, z: 0.8, tint: 0.18 },
    { x: -0.8, y: -0.6, sx: 2.0, sy: 1.9, h: 0.3, z: 1.3, tint: 0.36 },
  ],
  // RAG: a store of blocks feeding one raised answer.
  rag: [
    { x: -1.7, y: -1.7, sx: 0.9, sy: 0.9, h: 0.5, z: 0.1, tint: -0.16 },
    { x: -0.6, y: -1.7, sx: 0.9, sy: 0.9, h: 0.75, z: 0.1, tint: -0.08 },
    { x: -1.7, y: -0.6, sx: 0.9, sy: 0.9, h: 0.75, z: 0.1, tint: -0.08 },
    { x: -0.6, y: -0.6, sx: 0.9, sy: 0.9, h: 0.5, z: 0.1, tint: -0.16 },
    { x: 0.5, y: 0.5, sx: 1.1, sy: 1.1, h: 1.1, z: 0.1, tint: 0.34 },
  ],
  // Shipping LLM apps: a plinth with a tall stack — something deployed.
  llmapps: [
    { x: -1.5, y: -1.5, sx: 3.0, sy: 3.0, h: 0.3, z: 0, tint: -0.24 },
    { x: -0.9, y: -0.9, sx: 1.8, sy: 1.8, h: 0.42, z: 0.3 },
    { x: -0.6, y: -0.6, sx: 1.2, sy: 1.2, h: 0.42, z: 0.72, tint: 0.18 },
    { x: -0.32, y: -0.32, sx: 0.64, sy: 0.64, h: 0.7, z: 1.14, tint: 0.38 },
  ],
  // Distributed nodes on one plane, one raised — the coordinator.
  sysdesign: [
    { x: -1.5, y: -1.5, sx: 1.1, sy: 1.1, h: 0.55, z: 0.1, tint: -0.12 },
    { x: 0.4, y: -1.5, sx: 1.1, sy: 1.1, h: 0.85, z: 0.1 },
    { x: -1.5, y: 0.4, sx: 1.1, sy: 1.1, h: 0.85, z: 0.1 },
    { x: 0.4, y: 0.4, sx: 1.1, sy: 1.1, h: 0.55, z: 0.1, tint: -0.12 },
    { x: -0.45, y: -0.45, sx: 0.9, sy: 0.9, h: 0.6, z: 1.15, tint: 0.32 },
  ],
  // Overlapping artboards, one lifted off the canvas.
  uiux: [
    { x: -1.5, y: -1.4, sx: 2.2, sy: 1.7, h: 0.28, z: 0.35 },
    { x: -0.9, y: -0.6, sx: 1.9, sy: 1.9, h: 0.28, z: 0.85, tint: 0.2 },
    { x: -0.45, y: -1.5, sx: 1.0, sy: 1.0, h: 0.3, z: 1.5, tint: 0.4 },
  ],
  // A cloud built from blocks, floating over its region.
  aws: [
    { x: -1.7, y: -0.5, sx: 1.2, sy: 1.2, h: 0.7, z: 0.9 },
    { x: -0.6, y: -0.6, sx: 1.5, sy: 1.5, h: 1.0, z: 0.9, tint: 0.24 },
    { x: -0.5, y: -1.7, sx: 1.2, sy: 1.2, h: 0.7, z: 0.9 },
    { x: -1.1, y: -1.1, sx: 2.2, sy: 2.2, h: 0.22, z: 0, tint: -0.3 },
  ],
  // Two interlocking blocks, offset — the shape of the language's mark,
  // read as isometric solids like the rest of the family.
  python: [
    { x: -1.5, y: -1.5, sx: 1.7, sy: 1.7, h: 0.55, z: 0.9, tint: 0.2 },
    { x: -0.2, y: -0.2, sx: 1.7, sy: 1.7, h: 0.55, z: 0.35, tint: -0.14 },
    { x: -1.2, y: -1.2, sx: 2.4, sy: 2.4, h: 0.22, z: 0, tint: -0.3 },
  ],
  // A launch pad and the thing on top of it.
  project: [
    { x: -1.4, y: -1.4, sx: 2.8, sy: 2.8, h: 0.35, z: 0.35, tint: -0.16 },
    { x: -0.75, y: -0.75, sx: 1.5, sy: 1.5, h: 0.4, z: 0.7 },
    { x: -0.5, y: -0.5, sx: 1.0, sy: 1.0, h: 0.8, z: 1.1, tint: 0.2 },
    { x: -0.28, y: -0.28, sx: 0.56, sy: 0.56, h: 0.6, z: 1.9, tint: 0.4 },
  ],
};

export function CourseGlyph({
  courseId,
  color,
  size = 120,
  plinth = true,
}: {
  courseId: string;
  color: string;
  size?: number;
  plinth?: boolean;
}) {
  const boxes = COMPOSITIONS[courseId] ?? COMPOSITIONS.js;
  const all = depthSort([...(plinth ? PLINTH : []), ...boxes]);

  // The compositions are authored around the origin and never exceed ±3
  // grid cells or 3 z-units, so one viewBox fits them all.
  return (
    <svg
      width={size}
      height={size}
      viewBox="-60 -62 120 120"
      role="img"
      aria-label=""
      style={{ display: "block", overflow: "visible" }}
    >
      <ellipse cx="0" cy="30" rx="42" ry="13" fill={color} opacity="0.10" />
      {all.map((box, i) => (
        <Cuboid key={i} box={box} color={color} />
      ))}
    </svg>
  );
}
