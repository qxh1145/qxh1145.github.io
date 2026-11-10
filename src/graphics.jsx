import { useId, useMemo } from "react";

// Stroke-letter glyphs on a 100-unit cap height: advance width `w` and path `d`.
const GLYPHS = {
  A: { w: 120, d: "M0 100 L60 0 L120 100 M22 64 H98" },
  B: {
    w: 99,
    d: "M0 0 V100 M0 0 H68 A25 25 0 0 1 68 50 H0 M0 50 H74 A25 25 0 0 1 74 100 H0",
  },
  C: { w: 118, d: "M109.5 17.9 A62 50 0 1 0 109.5 82.1" },
  D: { w: 104, d: "M0 0 V100 M0 0 H52 A52 50 0 0 1 52 100 H0" },
  Đ: { w: 118, d: "M14 0 V100 M14 0 H66 A52 50 0 0 1 66 100 H14 M0 50 H50" },
  E: { w: 100, d: "M100 0 H0 V100 H100 M0 50 H86" },
  F: { w: 100, d: "M100 0 H0 V100 M0 50 H86" },
  G: { w: 124, d: "M109.5 17.9 A62 50 0 1 0 124 50 H72" },
  H: { w: 110, d: "M0 0 V100 M110 0 V100 M0 50 H110" },
  I: { w: 0, d: "M0 0 V100" },
  J: { w: 90, d: "M90 0 V58 A42 42 0 0 1 6 58" },
  K: { w: 108, d: "M0 0 V100 M104 0 L0 60 M34 40 L108 100" },
  L: { w: 92, d: "M0 0 V100 H92" },
  M: { w: 132, d: "M0 100 V0 L66 70 L132 0 V100" },
  N: { w: 110, d: "M0 100 V0 L110 100 V0" },
  O: { w: 124, d: "M62 0 A62 50 0 1 1 62 100 A62 50 0 1 1 62 0" },
  P: { w: 97, d: "M0 100 V0 H70 A27 27 0 0 1 70 54 H0" },
  Q: {
    w: 124,
    d: "M62 0 A62 50 0 1 1 62 100 A62 50 0 1 1 62 0 M84 74 L124 104",
  },
  R: { w: 104, d: "M0 100 V0 H70 A27 27 0 0 1 70 54 H0 M60 54 L104 100" },
  S: {
    w: 116,
    d: "M112 18 C100 4 80 0 60 0 H52 C24 0 4 10 4 27 C4 44 22 50 56 50 H64 C98 50 116 58 116 74 C116 90 96 100 64 100 H54 C32 100 12 94 0 80",
  },
  T: { w: 116, d: "M0 0 H116 M58 0 V100" },
  U: { w: 110, d: "M0 0 V50 A55 50 0 0 0 110 50 V0" },
  V: { w: 120, d: "M0 0 L60 100 L120 0" },
  W: { w: 160, d: "M0 0 L40 100 L80 20 L120 100 L160 0" },
  X: { w: 112, d: "M0 0 L112 100 M112 0 L0 100" },
  Y: { w: 116, d: "M0 0 L58 52 L116 0 M58 52 V100" },
  Z: { w: 114, d: "M4 0 H112 L0 100 H114" },
  0: { w: 92, d: "M46 0 A46 50 0 1 1 46 100 A46 50 0 1 1 46 0" },
  1: { w: 44, d: "M6 22 L44 0 V100" },
  2: {
    w: 100,
    d: "M2 26 C6 8 26 0 50 0 C78 0 98 10 98 28 C98 50 70 56 40 70 C16 81 2 90 0 100 H100",
  },
  3: {
    w: 100,
    d: "M4 10 C16 3 32 0 50 0 C78 0 96 10 96 26 C96 42 78 48 48 48 M48 48 C82 48 100 58 100 74 C100 92 80 100 50 100 C30 100 12 96 0 88",
  },
  4: { w: 108, d: "M78 100 V0 L0 70 H108" },
  5: {
    w: 100,
    d: "M96 0 H12 L6 46 C20 40 34 38 52 38 C82 38 100 50 100 69 C100 88 80 100 52 100 C30 100 12 96 0 88",
  },
  6: {
    w: 102,
    d: "M88 6 C76 2 64 0 52 0 C20 0 0 22 0 52 C0 80 22 100 52 100 C82 100 102 86 102 66 C102 46 82 34 54 34 C30 34 8 44 0 58",
  },
  7: { w: 104, d: "M0 0 H104 L40 100" },
  8: {
    w: 100,
    d: "M50 0 A44 23 0 1 1 50 46 A44 23 0 1 1 50 0 M50 46 A50 27 0 1 1 50 100 A50 27 0 1 1 50 46",
  },
  9: {
    w: 102,
    d: "M14 94 C26 98 38 100 50 100 C82 100 102 78 102 48 C102 20 80 0 50 0 C20 0 0 14 0 34 C0 54 20 66 48 66 C72 66 94 56 102 42",
  },
  "#": { w: 96, d: "M34 6 L22 94 M78 6 L66 94 M6 34 H96 M0 66 H90" },
  "-": { w: 48, d: "M0 56 H48" },
  "–": { w: 64, d: "M0 56 H64" },
  ".": { w: 0, d: "M0 99.5 L0 100" },
  ",": { w: 6, d: "M6 96 L0 112" },
  ":": { w: 0, d: "M0 44 L0 44.5 M0 99.5 L0 100" },
  "'": { w: 0, d: "M0 0 V24" },
  "’": { w: 0, d: "M0 0 V24" },
  "/": { w: 70, d: "M70 -4 L0 104" },
  "+": { w: 76, d: "M0 50 H76 M38 12 V88" },
  "(": { w: 32, d: "M32 -8 Q-12 50 32 108" },
  ")": { w: 32, d: "M0 -8 Q44 50 0 108" },
  "!": { w: 0, d: "M0 0 V70 M0 99.5 V100" },
  "?": {
    w: 92,
    d: "M0 24 C4 8 22 0 46 0 C74 0 92 10 92 28 C92 48 50 50 50 72 M50 99.5 V100",
  },
  "&": {
    w: 104,
    d: "M100 100 L22 30 C10 18 18 0 42 0 C64 0 72 16 60 28 L14 62 C2 72 4 100 42 100 C66 100 84 88 98 66",
  },
};

// Advance used for characters without a glyph (spaces, unsupported characters).
const SPACE_WIDTH = 52;

// Two-letter ligatures used when the `ligatures` option is on.
const LIGATURES = {
  OO: { w: 210, d: "M50 0 H160 A50 50 0 0 1 160 100 H50 A50 50 0 0 1 50 0" },
};

// Vietnamese combining marks, drawn around x = 0 on the glyph's centre line (cap line y = 0, baseline y = 100).
const MARKS = {
  "\u0301": "M-9 -17 L9 -39", // acute
  "\u0300": "M9 -17 L-9 -39", // grave
  "\u0309": "M-9 -35 Q0 -47 9 -36 Q12 -26 1 -19", // hook above
  "\u0303": "M-16 -22 Q-8 -37 0 -28 Q8 -19 16 -33", // tilde
  "\u0302": "M-15 -16 L0 -33 L15 -16", // circumflex
  "\u0306": "M-14 -35 Q0 -11 14 -35", // breve
  "\u0323": "M0 121 L0 121.5", // dot below
};

// Where a tone mark moves, as [dx, dy], on a letter that already has a circumflex or a breve:
// to the upper right of a circumflex, and above a breve.
const SECOND_MARK_SHIFT = {
  "\u0302": { "\u0301": [30, -14], "\u0300": [14, -14], "\u0309": [22, -12], "\u0303": [0, -24] },
  "\u0306": { "\u0301": [6, -28], "\u0300": [-6, -28], "\u0309": [0, -24], "\u0303": [0, -28] },
};

// The horn of Ơ and Ư, drawn from where it joins each base letter.
const HORN = "M0 0 Q22 -2 19 -26";
const HORN_ANCHORS = { O: [105, 14], U: [110, 4] };

// Palette tone names, in the order random picks and index cycling use.
export const TONES = ["blue", "green", "orange", "yellow"];

// Rounds to one decimal place to keep SVG numbers short and stable.
export const round1 = (value) => Math.round(value * 10) / 10;

// Zero-pads a number to two digits.
export function pad2(n) {
  return (n < 10 ? "0" : "") + n;
}

// FNV-1a 32-bit string hash, used as a deterministic seed.
export function hashString(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

// Mulberry32 seeded PRNG: returns a function yielding floats in [0, 1).
function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 1831565813) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Scales a mark path around (0, originY), then moves it by (dx, dy).
// Reads the numbers as alternating x and y, so a mark path may only use M, L, Q and C
// with absolute coordinates separated by spaces.
function placeMark(path, dx, dy, scale, originY) {
  let isX = true;
  return path.replace(/-?\d+(\.\d+)?/g, (number) => {
    const value = Number(number);
    const placed = isX ? dx + value * scale : originY + (value - originY) * scale + dy;
    isX = !isX;
    return round1(placed);
  });
}

// Glyph for a letter with Vietnamese marks: the base letter's path plus one subpath per mark.
function accentedGlyph(char, markScale) {
  const [base, ...marks] = [...char.normalize("NFD")];
  const glyph = GLYPHS[base];
  if (!glyph || !marks.length) return undefined;
  const centre = glyph.w / 2;
  const shifts = SECOND_MARK_SHIFT[marks.find((mark) => SECOND_MARK_SHIFT[mark])] ?? {};
  let d = glyph.d;
  for (const mark of marks) {
    if (mark === "\u031B") {
      const [x, y] = HORN_ANCHORS[base] ?? [glyph.w, 4];
      d += " " + placeMark(HORN, x, y, markScale, 0);
    } else if (mark === "\u0323") {
      d += " " + placeMark(MARKS[mark], centre, 0, markScale, 100);
    } else if (MARKS[mark]) {
      const [dx, dy] = shifts[mark] ?? [0, 0];
      d += " " + placeMark(MARKS[mark], centre + dx * markScale, dy * markScale, markScale, 0);
    }
  }
  return { w: glyph.w, d };
}

// Lays out `text` as positioned glyph paths; returns the items and total width.
function layoutGlyphs(text, gap, useLigatures, markScale = 1) {
  const chars = [...text.normalize("NFC").toUpperCase()];
  const items = [];
  let x = 0;
  for (let n = 0; n < chars.length; n++) {
    const pair = chars[n] + (chars[n + 1] ?? "");
    if (useLigatures && LIGATURES[pair]) {
      items.push({ ch: pair, x, d: LIGATURES[pair].d });
      x += LIGATURES[pair].w + gap;
      n++;
      continue;
    }
    const glyph = GLYPHS[chars[n]] ?? accentedGlyph(chars[n], markScale);
    if (!glyph) {
      x += SPACE_WIDTH;
      continue;
    }
    items.push({ ch: chars[n], x, d: glyph.d });
    x += glyph.w + gap;
  }
  const width = Math.max(0, items.length ? x - gap : 0);
  return { items, width };
}

// Splits a path into its subpaths so each stroke animates separately.
function splitSubpaths(d) {
  return d
    .split(/(?=M)/)
    .map((part) => part.trim())
    .filter(Boolean);
}

// Builds a pseudo-handwritten signature path from the letters of `text`.
function signaturePath(text) {
  const letters = [...text.replace(/[^A-Za-z]/g, "")].slice(0, 12);
  const rand = mulberry32(hashString(text || "signature"));
  const baseline = 64;
  let x = 4;
  let d = `M0 ${baseline + 6} C1 ${baseline + 2} 2 ${baseline} ${x} ${baseline}`;
  const loop = (width, height) =>
    ` C${round1(x + width * 0.95)} ${round1(baseline - height * 0.5)} ${round1(x + width * 0.9)} ${round1(baseline - height)} ${round1(x + width * 0.55)} ${round1(baseline - height)}` +
    ` C${round1(x + width * 0.15)} ${round1(baseline - height)} ${round1(x + width * 0.3)} ${baseline} ${round1(x + width)} ${baseline}`;
  if (!letters.length) letters.push("s");
  letters.forEach((letter, index) => {
    const lower = letter.toLowerCase();
    const isCapital = letter !== lower || index === 0;
    let width = 16 + rand() * 10;
    if (isCapital) {
      width += 12;
      d += loop(width, 52 + rand() * 8);
    } else if (/[bdfhklt]/.test(lower)) {
      d += loop(width, 42 + rand() * 6);
    } else if (/[gjpqyz]/.test(lower)) {
      d += loop(width, -(30 + rand() * 6));
    } else if (rand() < 0.55) {
      const hump = 15 + rand() * 6;
      d += ` C${round1(x + width * 0.1)} ${round1(baseline - hump)} ${round1(x + width * 0.8)} ${round1(baseline - hump)} ${round1(x + width)} ${baseline}`;
    } else {
      d += loop(width, 16 + rand() * 5);
    }
    x += width;
  });
  d +=
    ` C${round1(x + 18)} ${baseline - 6} ${round1(x + 20)} ${baseline + 16} ${round1(x - 6)} ${baseline + 18}` +
    ` C${round1(x * 0.55)} ${baseline + 22} ${round1(x * 0.25)} ${baseline + 12} 4 ${baseline + 20}`;
  return { d, width: round1(x + 24) };
}

// Builds a palm frond: leaflets along a quadratic spine, scaled to `size`.
function palmFrondPath(seed, size = 400) {
  const rand = mulberry32(seed);
  const scale = size / 400;
  const spine = (t) => ({
    x: (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 110 + t * t * 370,
    y: (1 - t) * (1 - t) * 390 + 2 * (1 - t) * t * 110 + t * t * 60,
  });
  let d = "";
  for (let t = 0.08; t < 0.97; t += 0.05) {
    const point = spine(t);
    const ahead = spine(t + 0.01);
    const length = Math.hypot(ahead.x - point.x, ahead.y - point.y) || 1;
    const tx = (ahead.x - point.x) / length;
    const ty = (ahead.y - point.y) / length;
    const leaf =
      (40 + 120 * Math.pow(Math.sin(Math.PI * t), 0.8)) * (0.9 + rand() * 0.2);
    for (const side of [1, -1]) {
      const nx = -ty * side;
      const ny = tx * side;
      const tipX = point.x + (nx * 0.72 + tx * 0.7) * leaf;
      const tipY = point.y + (ny * 0.72 + ty * 0.7) * leaf;
      const bulge = 7 + 5 * Math.sin(Math.PI * t);
      const midX = (point.x + tipX) / 2;
      const midY = (point.y + tipY) / 2;
      d +=
        `M${round1(point.x * scale)} ${round1(point.y * scale)}` +
        ` Q${round1((midX + nx * bulge - tx * bulge) * scale)} ${round1((midY + ny * bulge - ty * bulge) * scale)} ${round1(tipX * scale)} ${round1(tipY * scale)}` +
        ` Q${round1((midX - nx * bulge * 0.4 + tx * bulge) * scale)} ${round1((midY - ny * bulge * 0.4 + ty * bulge) * scale)} ${round1(point.x * scale)} ${round1(point.y * scale)}Z`;
    }
  }
  return d;
}

// Text drawn with stroke glyphs, optionally outlined, with a draw-on animation.
export function StrokeText({
  text,
  weight = 8,
  outline = 0,
  tracking = 26,
  ligatures = true,
  color = "currentColor",
  inner = "var(--ftp-sheet)",
  delay = 0,
  className,
  label,
  decorative,
}) {
  // Heavier strokes need larger marks to stay readable.
  const markScale = 1 + Math.max(0, weight - 9) * 0.06;
  const layout = useMemo(
    () => layoutGlyphs(text, tracking + weight * 0.6, ligatures, markScale),
    [text, tracking, weight, ligatures, markScale],
  );
  const pad = weight / 2 + 2;
  const width = round1(layout.width + pad * 2);
  const height = round1(124 + pad * 2);
  const strokes =
    outline > 0
      ? [
          { color, width: weight },
          { color: inner, width: Math.max(0.5, weight - outline * 2) },
        ]
      : [{ color, width: weight }];
  return (
    <svg
      className={"ftp-st" + (className ? " " + className : "")}
      viewBox={round1(-pad) + " " + round1(-12 - pad) + " " + width + " " + height}
      width={width}
      height={height}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : (label ?? text)}
      aria-hidden={decorative ? true : undefined}
      style={{ "--d": delay + "ms" }}
    >
      {strokes.map((stroke, strokeIndex) => (
        <g
          key={strokeIndex}
          fill="none"
          stroke={stroke.color}
          strokeWidth={stroke.width}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {layout.items.map((glyph, glyphIndex) => (
            <g key={glyphIndex} transform={"translate(" + round1(glyph.x) + " 0)"}>
              <g className="ftp-gl" style={{ "--i": glyphIndex }}>
                {splitSubpaths(glyph.d).map((part, partIndex) => (
                  <path key={partIndex} d={part} pathLength={1} className="ftp-draw" />
                ))}
              </g>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

// Animated handwritten-style signature generated from `text`.
export function Signature({ text, className, delay = 0, weight = 3.2 }) {
  const path = useMemo(() => signaturePath(text), [text]);
  const width = path.width + 34;
  return (
    <svg
      className={"ftp-sig" + (className ? " " + className : "")}
      viewBox={"-30 -2 " + width + " 106"}
      width={width}
      height={106}
      aria-hidden="true"
      style={{ "--d": delay + "ms" }}
    >
      <path
        d={path.d}
        transform="skewX(-14)"
        fill="none"
        stroke="currentColor"
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="ftp-draw"
      />
    </svg>
  );
}

// Arrow icon pointing right, down, left, up or north-east.
export function Arrow({ size = 14, dir = "right" }) {
  const angle = { right: 0, down: 90, left: 180, up: -90, ne: -45 }[dir];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ transform: "rotate(" + angle + "deg)" }}
    >
      <path
        d="M2 8h11M9 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Small palm-leaf icon.
export function PalmLeaf({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M15.5 30c.6-6 .9-11 .2-17"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M16 13C12 7 6 7 2.5 10.5 7 9.5 11 10.5 16 13Zm0 0c1-6 6-10 11.5-8.5C22 5 18.5 8 16 13Zm0 0c4.5-3 10-2 13 2.5-4.5-2-8.5-2.5-13-2.5Zm0 0C10.5 11 5 14 4 19c3.5-4 7-5.5 12-6Zm0 0c-1-4.5-4-8.5-8.5-10C10 6 13 9 16 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

// Large swaying palm-frond decoration behind the cover wordmark.
export function PalmFronds({ className }) {
  const frond = useMemo(() => palmFrondPath(7), []);
  const smallFrond = useMemo(() => palmFrondPath(19, 300), []);
  return (
    <svg className={className} viewBox="0 0 420 420" width={420} height={420} aria-hidden="true">
      <path d={frond} fill="currentColor" />
      <g transform="translate(150 150) rotate(28 150 150)">
        <path d={smallFrond} fill="currentColor" opacity=".7" />
      </g>
      <path
        d="M40 390 Q110 110 370 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Placeholder portrait: a figure by the sea in front of a seeded dusk skyline.
export function PortraitIllustration({ label, seed }) {
  const uid = useId().replace(/:/g, "");
  const scene = useMemo(() => {
    const rand = mulberry32(seed);
    const buildings = [];
    let x = -6;
    while (x < 306) {
      const width = 14 + rand() * 26;
      const tall = rand() < 0.18;
      buildings.push({
        x,
        w: width,
        h: tall ? 90 + rand() * 40 : 26 + rand() * 52,
        spire: tall && rand() < 0.6,
      });
      x += width + (rand() < 0.3 ? 2 : 0);
    }
    const windows = [];
    for (const building of buildings)
      for (let y = 196 - building.h + 6; y < 190; y += 7)
        for (let wx = building.x + 3; wx < building.x + building.w - 4; wx += 6)
          if (rand() < 0.34) windows.push({ x: wx, y, on: rand() < 0.2, dl: rand() * 3 });
    const rocks = Array.from({ length: 14 }, () => ({
      x: rand() * 300,
      y: 300 + rand() * 56,
      rx: 4 + rand() * 12,
      ry: 2 + rand() * 5,
    }));
    return { buildings, windows, rocks };
  }, [seed]);
  return (
    <svg
      viewBox="0 0 300 360"
      width={300}
      height={360}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={uid + "-sky"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b4a8f" />
          <stop offset=".42" stopColor="#6d8ed2" />
          <stop offset=".72" stopColor="#d9b4c9" />
          <stop offset="1" stopColor="#f5d2b0" />
        </linearGradient>
        <linearGradient id={uid + "-sea"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7fb4" />
          <stop offset=".5" stopColor="#3a5288" />
          <stop offset="1" stopColor="#1f2f55" />
        </linearGradient>
        <linearGradient id={uid + "-coat"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#24252c" />
          <stop offset=".6" stopColor="#111217" />
          <stop offset="1" stopColor="#060608" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill={"url(#" + uid + "-sky)"} />
      <circle cx="232" cy="172" r="16" fill="#ffe2c2" opacity=".7" />
      <g fill="#273863">
        {scene.buildings.map((building, index) => (
          <g key={index}>
            <rect
              x={round1(building.x)}
              y={round1(196 - building.h)}
              width={round1(building.w)}
              height={round1(building.h)}
            />
            {building.spire && (
              <rect
                x={round1(building.x + building.w / 2 - 1)}
                y={round1(196 - building.h - 18)}
                width="2"
                height="18"
              />
            )}
          </g>
        ))}
      </g>
      <g>
        {scene.windows.map((win, index) => (
          <rect
            key={index}
            x={round1(win.x)}
            y={round1(win.y)}
            width="2.4"
            height="2.8"
            fill={index % 5 ? "#ffd68a" : "#a8dcff"}
            className={win.on ? "ftp-twinkle" : undefined}
            style={win.on ? { "--dl": round1(win.dl) + "s" } : undefined}
            opacity=".9"
          />
        ))}
      </g>
      <rect y="196" width="300" height="104" fill={"url(#" + uid + "-sea)"} />
      <g fill="#273863" opacity=".35" transform="translate(0 392) scale(1 -1)">
        {scene.buildings.map((building, index) => (
          <rect
            key={index}
            x={round1(building.x)}
            y={round1(196 - building.h * 0.6)}
            width={round1(building.w)}
            height={round1(building.h * 0.6)}
          />
        ))}
      </g>
      <g className="ftp-shimmer" stroke="#ffe0b0" strokeLinecap="round" opacity=".55">
        {[206, 214, 223, 233, 246, 262].map((y, index) => (
          <line
            key={y}
            x1={30 + ((index * 47) % 140)}
            x2={70 + ((index * 47) % 140) + index * 9}
            y1={y}
            y2={y}
            strokeWidth={1.2 + index * 0.2}
          />
        ))}
      </g>
      <g transform="translate(48 204)">
        <path d="M0 8 H58 L52 14 H6 Z" fill="#e9edf6" />
        <rect x="10" y="2" width="34" height="6" rx="1" fill="#f5f7fb" />
        <rect x="16" y="-3" width="16" height="5" rx="1" fill="#dfe6f3" />
        {[13, 19, 25, 31, 37].map((x) => (
          <rect
            key={x}
            x={x}
            y="4"
            width="3"
            height="2"
            fill="#ffcf7a"
            className="ftp-twinkle"
            style={{ "--dl": x / 20 + "s" }}
          />
        ))}
      </g>
      <path
        d="M0 296 C40 284 70 292 110 286 C160 278 200 290 240 282 C268 277 288 284 300 280 V360 H0Z"
        fill="#2a2522"
      />
      <g fill="#3b3430">
        {scene.rocks.map((rock, index) => (
          <ellipse
            key={index}
            cx={round1(rock.x)}
            cy={round1(rock.y)}
            rx={round1(rock.rx)}
            ry={round1(rock.ry)}
          />
        ))}
      </g>
      <g>
        <path
          d="M142 360 C138 316 140 262 152 236 C160 218 178 210 196 212 C214 214 226 228 232 254 C238 284 240 326 238 360 Z"
          fill={"url(#" + uid + "-coat)"}
        />
        <path
          d="M176 214 C180 224 186 230 194 232 C198 226 200 220 200 213 C192 210 184 210 176 214Z"
          fill="#0a0a0d"
        />
        <rect x="181" y="198" width="14" height="18" rx="5" fill="#d9b49a" />
        <ellipse cx="186" cy="184" rx="16" ry="19" fill="#e2bfa3" />
        <path
          d="M170 182 C166 160 182 152 198 157 C208 161 207 177 204 190 C200 182 196 176 188 172 C181 172 174 176 170 182Z"
          fill="#131315"
        />
        <path
          d="M171 186 C169 190 170 194 173 195"
          fill="none"
          stroke="#c99f84"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M156 262 C160 276 168 288 178 292"
          fill="none"
          stroke="#2c2d35"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="172"
          y="282"
          width="14"
          height="22"
          rx="3"
          fill="#d6393b"
          transform="rotate(-12 179 293)"
        />
      </g>
    </svg>
  );
}

// Generated cover art for a project card, styled by category kind and seeded per project.
export function ProjectArt({ kind, seed, mark, colors }) {
  const uid = useId().replace(/:/g, "");
  const rand = mulberry32(seed);
  const randomColor = () => colors[TONES[Math.floor(rand() * TONES.length)]];
  const font = "ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
  const svgProps = {
    viewBox: "0 0 320 220",
    width: 320,
    height: 220,
    preserveAspectRatio: "xMidYMid slice",
    "aria-hidden": true,
  };

  if (kind === "render") {
    const accent = randomColor();
    const ballX = 120 + rand() * 80;
    const cubeX = 40 + rand() * 30;
    return (
      <svg {...svgProps}>
        <defs>
          <linearGradient id={uid + "-bg"} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#eef2ff" />
            <stop offset="1" stopColor={accent} stopOpacity=".55" />
          </linearGradient>
          <radialGradient id={uid + "-ball"} cx=".35" cy=".3" r=".75">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".35" stopColor={accent} />
            <stop offset="1" stopColor="#1b2234" stopOpacity=".85" />
          </radialGradient>
          <linearGradient id={uid + "-pill"} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="1" stopColor={colors.blue} stopOpacity=".7" />
          </linearGradient>
        </defs>
        <rect width="320" height="220" fill={"url(#" + uid + "-bg)"} />
        <ellipse cx="160" cy="186" rx="150" ry="22" fill="#ffffff" opacity=".55" />
        <ellipse cx={round1(ballX)} cy="182" rx="52" ry="9" fill="#1b2234" opacity=".18" />
        <circle cx={round1(ballX)} cy="128" r="52" fill={"url(#" + uid + "-ball)"} />
        <ellipse
          cx={round1(ballX - 18)}
          cy="104"
          rx="16"
          ry="9"
          fill="#fff"
          opacity=".7"
          transform={"rotate(-30 " + round1(ballX - 18) + " 104)"}
        />
        <rect
          x={round1(ballX + 30)}
          y="62"
          width="96"
          height="34"
          rx="17"
          fill={"url(#" + uid + "-pill)"}
          transform={"rotate(-24 " + round1(ballX + 78) + " 79)"}
        />
        <g transform={"translate(" + round1(cubeX) + " 132)"}>
          <path d="M0 14 L22 0 L44 14 L22 28Z" fill="#ffffff" />
          <path d="M0 14 L22 28 V54 L0 40Z" fill={colors.green} />
          <path d="M44 14 L22 28 V54 L44 40Z" fill={colors.green} opacity=".7" />
        </g>
        <text
          x="18"
          y="30"
          fontFamily={font}
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
          fill="#1b2234"
          opacity=".7"
        >
          {mark} · APP
        </text>
      </svg>
    );
  }

  if (kind === "page") {
    const accent = randomColor();
    return (
      <svg {...svgProps}>
        <rect width="320" height="220" fill="#eef1f6" />
        <circle cx="262" cy="40" r="70" fill={accent} opacity=".22" />
        <g transform="translate(36 18)">
          <rect width="112" height="210" rx="16" fill="#ffffff" />
          <rect x="8" y="8" width="96" height="70" rx="10" fill={accent} opacity=".9" />
          <circle cx="56" cy="46" r="20" fill="#ffffff" opacity=".9" />
          <text
            x="56"
            y="51"
            textAnchor="middle"
            fontFamily={font}
            fontSize="11"
            fontWeight="800"
            fill={accent}
          >
            {mark.slice(0, 4)}
          </text>
          <rect x="10" y="88" width="64" height="7" rx="3.5" fill="#1b2234" />
          <rect x="10" y="100" width="88" height="5" rx="2.5" fill="#c6cad5" />
          <rect x="10" y="110" width="76" height="5" rx="2.5" fill="#c6cad5" />
          <rect x="10" y="124" width="42" height="34" rx="6" fill="#eef1f6" />
          <rect x="56" y="124" width="42" height="34" rx="6" fill="#eef1f6" />
          <rect x="10" y="168" width="92" height="18" rx="9" fill={accent} />
        </g>
        <g transform="translate(170 64)">
          <rect width="118" height="40" rx="12" fill="#ffffff" />
          <rect x="14" y="15" width="44" height="10" rx="5" fill="#1b2234" />
          <rect x="74" y="12" width="32" height="16" rx="8" fill={colors.orange} />
          <rect x="0" y="54" width="92" height="30" rx="10" fill="#ffffff" opacity=".85" />
          <rect x="12" y="66" width="56" height="6" rx="3" fill="#c6cad5" />
          <rect x="0" y="96" width="110" height="30" rx="10" fill={accent} opacity=".9" />
          <rect x="14" y="108" width="52" height="6" rx="3" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  if (kind === "sale") {
    const confetti = Array.from({ length: 22 }, () => ({
      x: rand() * 320,
      y: rand() * 220,
      rotate: rand() * 180,
      color: randomColor(),
    }));
    const starburst = Array.from({ length: 24 }, (_, n) => {
      const angle = (n / 24) * Math.PI * 2;
      const radius = n % 2 ? 54 : 68;
      return round1(236 + Math.cos(angle) * radius) + "," + round1(80 + Math.sin(angle) * radius);
    }).join(" ");
    return (
      <svg {...svgProps}>
        <rect width="320" height="220" fill={colors.yellow} />
        {confetti.map((piece, index) => (
          <rect
            key={index}
            x={round1(piece.x)}
            y={round1(piece.y)}
            width="8"
            height="3.5"
            rx="1.5"
            fill={piece.color}
            transform={
              "rotate(" + round1(piece.rotate) + " " + round1(piece.x) + " " + round1(piece.y) + ")"
            }
          />
        ))}
        <polygon points={starburst} fill={colors.orange} />
        <text
          x="236"
          y="76"
          textAnchor="middle"
          fontFamily={font}
          fontSize="18"
          fontWeight="900"
          fill="#ffffff"
        >
          SALE
        </text>
        <text
          x="236"
          y="96"
          textAnchor="middle"
          fontFamily={font}
          fontSize="10"
          fontWeight="700"
          letterSpacing="2"
          fill="#ffffff"
        >
          TODAY
        </text>
        <text
          x="20"
          y="168"
          fontFamily={font}
          fontSize="78"
          fontWeight="900"
          letterSpacing="-3"
          fill="#1b2234"
        >
          {mark}
        </text>
        <text
          x="22"
          y="196"
          fontFamily={font}
          fontSize="12"
          fontWeight="700"
          letterSpacing="4"
          fill="#1b2234"
          opacity=".6"
        >
          LIMITED · OFF
        </text>
        <g transform="translate(24 30) rotate(-8)">
          <path d="M0 0 H74 L90 16 L74 32 H0Z" fill={colors.blue} />
          <circle cx="76" cy="16" r="4" fill={colors.yellow} />
          <text x="10" y="21" fontFamily={font} fontSize="12" fontWeight="800" fill="#ffffff">
            DEALS
          </text>
        </g>
      </svg>
    );
  }

  if (kind === "brand") {
    const accent = randomColor();
    return (
      <svg {...svgProps}>
        <rect width="320" height="220" fill={accent === colors.yellow ? colors.orange : accent} />
        {[0, 1, 2, 3, 4, 5].map((cell) => {
          const x = 34 + (cell % 3) * 90;
          const y = 46 + Math.floor(cell / 3) * 92;
          const shape = Math.floor(rand() * 4);
          return (
            <g
              key={cell}
              transform={"translate(" + x + " " + y + ")"}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            >
              {shape === 0 && <circle cx="26" cy="26" r="22" />}
              {shape === 1 && <rect x="4" y="4" width="44" height="44" rx="12" />}
              {shape === 2 && <path d="M26 4 L48 46 H4Z" strokeLinejoin="round" />}
              {shape === 3 && <path d="M4 26 C14 4 38 4 48 26 C38 48 14 48 4 26Z" />}
              {cell === 4 && (
                <text
                  x="26"
                  y="33"
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize="18"
                  fontWeight="900"
                  fill="#ffffff"
                  stroke="none"
                >
                  {mark.slice(0, 1)}
                </text>
              )}
            </g>
          );
        })}
        <text
          x="300"
          y="206"
          textAnchor="end"
          fontFamily={font}
          fontSize="11"
          fontWeight="700"
          letterSpacing="3"
          fill="#ffffff"
          opacity=".8"
        >
          {mark}
        </text>
      </svg>
    );
  }

  const background = randomColor();
  const discColor = randomColor();
  const discX = 80 + rand() * 160;
  const discY = 50 + rand() * 70;
  const discRadius = 56 + rand() * 30;
  return (
    <svg {...svgProps}>
      <rect width="320" height="220" fill={background === colors.yellow ? colors.blue : background} />
      <circle
        cx={round1(discX)}
        cy={round1(discY)}
        r={round1(discRadius)}
        fill={discColor === background ? "#ffffff" : discColor}
        opacity=".9"
      />
      <g stroke="#ffffff" strokeWidth="2" opacity=".28">
        {Array.from({ length: 9 }, (_, n) => (
          <line key={n} x1={-40 + n * 44} y1="220" x2={60 + n * 44} y2="0" />
        ))}
      </g>
      <g fill="#ffffff" opacity=".8">
        {Array.from({ length: 20 }, (_, n) => (
          <circle key={n} cx={252 + (n % 4) * 12} cy={128 + Math.floor(n / 4) * 12} r="2" />
        ))}
      </g>
      <text
        x="14"
        y="200"
        fontFamily={font}
        fontSize="64"
        fontWeight="900"
        letterSpacing="-2"
        fill="#ffffff"
      >
        {mark}
      </text>
    </svg>
  );
}

// Line illustration for a process step, cycling through four motifs.
export function StepArt({ index }) {
  return (
    <svg
      className="ftp-step-art"
      viewBox="0 0 320 120"
      width={320}
      height={120}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {index % 4 === 0 && (
        <g>
          {Array.from({ length: 18 }, (_, n) => (
            <circle
              key={n}
              cx={20 + (n % 9) * 22}
              cy={30 + Math.floor(n / 9) * 40}
              r={n === 6 ? 6 : 3}
              fill={n === 6 ? "currentColor" : "none"}
            />
          ))}
          <circle cx="160" cy="44" r="30" />
          <path d="M182 66 L214 98" strokeWidth="5" />
        </g>
      )}
      {index % 4 === 1 && (
        <g>
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              <text
                x="10"
                y={22 + row * 28}
                fontSize="14"
                fontWeight="700"
                fill="currentColor"
                stroke="none"
              >
                {pad2(row + 1)}
              </text>
              <rect
                x="44"
                y={10 + row * 28}
                width={230 - row * 46}
                height="14"
                rx="7"
                fill={row === 0 ? "currentColor" : "none"}
              />
            </g>
          ))}
        </g>
      )}
      {index % 4 === 2 && (
        <g>
          {Array.from({ length: 12 }, (_, n) => (
            <rect
              key={n}
              x={10 + (n % 6) * 50}
              y={10 + Math.floor(n / 6) * 54}
              width="42"
              height="46"
              rx="8"
              fill={n === 3 || n === 8 ? "currentColor" : "none"}
            />
          ))}
        </g>
      )}
      {index % 4 === 3 && (
        <g>
          {[0, 1, 2].map((n) => (
            <g key={n} transform={"translate(" + (20 + n * 30) + " " + (40 - n * 12) + ")"}>
              <path d="M0 14 H24 L34 4 H70 V76 H0Z" fill={n === 2 ? "currentColor" : "none"} />
            </g>
          ))}
          <path d="M190 58 H290 M262 34 L292 58 L262 82" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}

// Sun/moon theme-toggle icon that morphs between the two states.
export function ThemeIcon({ dark }) {
  const maskId = useId().replace(/:/g, "") + "-moon";
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <mask id={maskId}>
        <rect width="24" height="24" fill="#fff" />
        <circle
          className="ftp-sun-moon"
          cx={dark ? 16 : 30}
          cy={dark ? 7 : -6}
          r="6.5"
          fill="#000"
        />
      </mask>
      <circle
        className="ftp-sun-core"
        cx="12"
        cy="12"
        r={dark ? 8 : 4.5}
        fill="currentColor"
        mask={"url(#" + maskId + ")"}
      />
      <g className="ftp-sun-rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
      </g>
    </svg>
  );
}
