// Shared drawing primitives for the Test2Drive sign set.
// Every sign is built from the same frames, palette, border ratios and stroke weights,
// so the whole set reads as one family. Output is plain SVG with no fonts and no references.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const C = {
  red: '#C1121F',
  blue: '#0B4EA2',
  yellow: '#F2C200',
  green: '#00754A',
  black: '#1A1A1A',
  white: '#FFFFFF',
  outline: '#B4BAC1', // light grey edge so white-edged signs show on white cards
  faded: '#9AA0A6', // struck-through pictograms on "end of" signs
};

// Geometry shared by every frame (units of the 200 x 200 viewBox).
export const G = {
  rim: 4, // white rim around every sign
  edge: 1.2, // grey outline stroke
  triBorder: 16, // red border of triangles
  ringWidth: 20, // red ring of prohibitory discs
  bar: 16, // red diagonal bar
  road: 16, // main road stroke in warning pictograms
  minor: 10, // minor road stroke
};

export const n = (x) => {
  const v = Math.round(x * 10) / 10;
  return Object.is(v, -0) ? '0' : String(v);
};
const pt = ([x, y]) => `${n(x)} ${n(y)}`;
export const poly = (pts, close = true) => pts.map((p, i) => (i ? 'L' : 'M') + pt(p)).join('') + (close ? 'Z' : '');
export const fill = (d, color) => `<path fill="${color}" d="${d}"/>`;
export const stroke = (d, color, w, { cap = 'butt', join = 'round' } = {}) =>
  `<path fill="none" stroke="${color}" stroke-width="${n(w)}"${cap !== 'butt' ? ` stroke-linecap="${cap}"` : ''}${join !== 'miter' ? ` stroke-linejoin="${join}"` : ''} d="${d}"/>`;
export const circle = (cx, cy, r, color) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${color}"/>`;
export const ring = (cx, cy, r, color, w) => `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="${color}" stroke-width="${n(w)}"/>`;
export const rect = (x, y, w, h, r, color) => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${r ? ` rx="${n(r)}"` : ''} fill="${color}"/>`;
export const group = (transform, body) => `<g transform="${transform}">${body}</g>`;
const circlePath = (cx, cy, r) => `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z`;

// Polygon with every corner rounded to radius r. Points must run clockwise on screen.
export function roundedPolygon(pts, r) {
  const len = pts.length;
  let d = '';
  for (let i = 0; i < len; i++) {
    const p0 = pts[(i - 1 + len) % len];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % len];
    const v1 = unit([p0[0] - p1[0], p0[1] - p1[1]]);
    const v2 = unit([p2[0] - p1[0], p2[1] - p1[1]]);
    const ang = Math.acos(v1[0] * v2[0] + v1[1] * v2[1]);
    const t = r / Math.tan(ang / 2);
    const a = [p1[0] + v1[0] * t, p1[1] + v1[1] * t];
    const b = [p1[0] + v2[0] * t, p1[1] + v2[1] * t];
    d += `${i ? 'L' : 'M'}${pt(a)}A${n(r)} ${n(r)} 0 0 1 ${pt(b)}`;
  }
  return d + 'Z';
}
const unit = ([x, y]) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};

function octPoints(cx, cy, apothem) {
  const R = apothem / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = -Math.PI / 2 - Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
}

// ---------- text as paths ----------
const glyphFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'glyphs.json');
const GLYPHS = JSON.parse(fs.readFileSync(glyphFile, 'utf8'));

function transformPath(d, s, sx, ox, oy) {
  let out = '';
  for (const [, cmd, args] of d.matchAll(/([MLQCZ])([^MLQCZ]*)/g)) {
    out += cmd;
    const nums = (args.match(/-?\d*\.?\d+/g) || []).map(Number);
    const parts = [];
    for (let i = 0; i < nums.length; i += 2) parts.push(`${n(ox + nums[i] * s * sx)} ${n(oy + nums[i + 1] * s)}`);
    out += parts.join(' ');
  }
  return out.replace(/ -/g, '-');
}

export function textWidth(str, { cap, weight = 700, track = 0, sx = 1 }) {
  const W = GLYPHS.weights[weight];
  const s = cap / W.capHeight;
  let w = 0;
  for (const ch of str) w += ch === ' ' ? 260 * s * sx : W.glyphs[ch].adv * s * sx;
  return w + track * (str.length - 1);
}

// Text centred on cx with its baseline at y; cap = cap height in viewBox units.
// maxWidth condenses the letters horizontally if the string would be wider.
export function text(str, { cx, y, cap, weight = 700, track = 0, sx = 1, maxWidth, color = C.black }) {
  const W = GLYPHS.weights[weight];
  const s = cap / W.capHeight;
  let width = textWidth(str, { cap, weight, track, sx });
  if (maxWidth && width > maxWidth) {
    sx *= (maxWidth - track * (str.length - 1)) / (width - track * (str.length - 1));
    width = maxWidth;
  }
  let x = cx - width / 2;
  let d = '';
  for (const ch of str) {
    if (ch === ' ') {
      x += 260 * s * sx + track;
      continue;
    }
    const g = W.glyphs[ch];
    if (!g) throw new Error(`glyph missing: ${ch}`);
    d += transformPath(g.d, s, sx, x, y);
    x += g.adv * s * sx + track;
  }
  return fill(d, color);
}

// ---------- frames ----------
// A frame returns { w, h, before, after }; the pictogram sits between before and after.
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}">${body}</svg>`;
export const compose = (frame, picto = '') => svgDoc(frame.w, frame.h, frame.before + picto + (frame.after || ''));
const edgeAttrs = `stroke="${C.outline}" stroke-width="${G.edge}"`;

// Warning triangle: red border, white field. Inner white triangle: apex y 41.5, base y 164.5, half-width 71 at the base.
export const TRI = { cx: 100, cy: 123.5, inr: 61, r: 14 };
export function triangleFrame({ up = true } = {}) {
  const { cx, inr, r } = TRI;
  const cy = up ? TRI.cy : 200 - TRI.cy;
  const pts = (k) => (up ? triPointsUp(cx, cy, k) : triPointsDown(cx, cy, k));
  const outer = roundedPolygon(pts(inr - G.edge / 2), r);
  const red = roundedPolygon(pts(inr - G.rim), r - G.rim);
  const inner = roundedPolygon(pts(inr - G.rim - G.triBorder), 3);
  return {
    w: 200,
    h: 200,
    before: `<path fill="${C.white}" ${edgeAttrs} d="${outer}"/>${fill(red + inner, C.red).replace('<path', '<path fill-rule="evenodd"')}`,
    after: '',
  };
}
function triPointsUp(cx, cy, inr) {
  const h = inr * Math.sqrt(3);
  return [[cx, cy - 2 * inr], [cx + h, cy + inr], [cx - h, cy + inr]];
}
function triPointsDown(cx, cy, inr) {
  const h = inr * Math.sqrt(3);
  return [[cx - h, cy - inr], [cx + h, cy - inr], [cx, cy + 2 * inr]];
}
// x-range of the white field of an upright triangle at height y (for layout checks).
export const triHalfWidth = (y) => (y - 41.5) * Math.tan(Math.PI / 6);

// Prohibitory disc: red ring, white field (inner radius 74). bar = red diagonal; field = inner colour.
export const RING = { r: 98, inner: 74 };
export function ringFrame({ bar = false, cross = false, field = C.white } = {}) {
  const outerR = RING.r - G.edge / 2;
  const redR = RING.r - G.rim;
  const inR = redR - G.ringWidth;
  const before = `<circle cx="100" cy="100" r="${n(outerR)}" fill="${C.white}" ${edgeAttrs}/>` + (field !== C.white ? circle(100, 100, inR + 1, field) : '');
  let after = '';
  const k = Math.SQRT1_2 * (inR + 2);
  if (bar || cross) after += stroke(`M${n(100 - k)} ${n(100 - k)}L${n(100 + k)} ${n(100 + k)}`, C.red, G.bar);
  if (cross) after += stroke(`M${n(100 + k)} ${n(100 - k)}L${n(100 - k)} ${n(100 + k)}`, C.red, G.bar);
  after += `<path fill="${C.red}" fill-rule="evenodd" d="${circlePath(100, 100, redR)}${circlePath(100, 100, inR)}"/>`;
  return { w: 200, h: 200, before, after };
}

// "End of" disc: white field, thin black ring, diagonal band of thin black lines (upper right to lower left).
export function endFrame() {
  const before = `<circle cx="100" cy="100" r="${n(RING.r - G.edge / 2)}" fill="${C.white}" ${edgeAttrs}/>` + ring(100, 100, RING.r - G.rim - 2, C.black, 3);
  const lines = [];
  for (let i = -2; i <= 2; i++) {
    const o = i * 9;
    const L = Math.sqrt(Math.max(0, 88 * 88 - o * o)) - 2;
    // direction (1,-1)/sqrt2 is the band axis; offset along (1,1)/sqrt2
    const cx = 100 + (o * Math.SQRT1_2);
    const cy = 100 + (o * Math.SQRT1_2);
    const dx = L * Math.SQRT1_2;
    lines.push(`M${n(cx - dx)} ${n(cy + dx)}L${n(cx + dx)} ${n(cy - dx)}`);
  }
  return { w: 200, h: 200, before, after: stroke(lines.join(''), C.black, 3.2) };
}

// Blue mandatory disc.
export function discFrame() {
  return {
    w: 200,
    h: 200,
    before: `<circle cx="100" cy="100" r="${n(RING.r - G.edge / 2)}" fill="${C.white}" ${edgeAttrs}/>` + circle(100, 100, RING.r - G.rim, C.blue),
    after: '',
  };
}

// Red disc for no entry.
export function redDiscFrame() {
  return {
    w: 200,
    h: 200,
    before: `<circle cx="100" cy="100" r="${n(RING.r - G.edge / 2)}" fill="${C.white}" ${edgeAttrs}/>` + circle(100, 100, RING.r - G.rim, C.red),
    after: '',
  };
}

export function octagonFrame() {
  return {
    w: 200,
    h: 200,
    before:
      `<path fill="${C.white}" ${edgeAttrs} d="${roundedPolygon(octPoints(100, 100, 98 - G.edge / 2), 6)}"/>` +
      fill(roundedPolygon(octPoints(100, 100, 98 - G.rim), 4), C.red),
    after: '',
  };
}

// Rectangle with a white rim; colour fills the inside. Default square 200 x 200.
export function rectFrame({ w = 200, h = 200, color = C.blue, r = 14 } = {}) {
  const e = G.edge / 2;
  return {
    w,
    h,
    before:
      `<rect x="${n(e)}" y="${n(e)}" width="${n(w - 2 * e)}" height="${n(h - 2 * e)}" rx="${r}" fill="${C.white}" ${edgeAttrs}/>` +
      rect(G.rim, G.rim, w - 2 * G.rim, h - 2 * G.rim, r - G.rim, color),
    after: '',
  };
}

// Diamond (box junction): yellow field with black criss-cross grid.
export function diamondFrame() {
  const e = G.edge / 2;
  const s = 141.4 - e; // side of the rotated square that fits 200 x 200
  const o = 100 - s / 2;
  const inner = s - 2 * G.rim;
  const io = 100 - inner / 2;
  return {
    w: 200,
    h: 200,
    before: group(
      'rotate(45 100 100)',
      `<rect x="${n(o)}" y="${n(o)}" width="${n(s)}" height="${n(s)}" rx="8" fill="${C.white}" ${edgeAttrs}/>` + rect(io, io, inner, inner, 5, C.black),
    ),
    after: '',
    inner,
    io,
  };
}

// ---------- arrows ----------
// Filled arrowhead with its tip at `tip`, pointing along unit vector dir.
export function head(tip, dir, len, width, color) {
  const [dx, dy] = unit(dir);
  const bx = tip[0] - dx * len;
  const by = tip[1] - dy * len;
  const px = -dy * (width / 2);
  const py = dx * (width / 2);
  return fill(poly([tip, [bx + px, by + py], [bx - px, by - py]]), color);
}
// Straight arrow from `from` to the tip.
export function arrow(from, tip, { shaft, len, width, color }) {
  const [dx, dy] = unit([tip[0] - from[0], tip[1] - from[1]]);
  const end = [tip[0] - dx * (len - 1), tip[1] - dy * (len - 1)];
  return stroke(poly([from, end], false), color, shaft) + head(tip, [dx, dy], len, width, color);
}
// Arrow whose shaft follows path d (ending where the head starts); head points along dir.
export function pathArrow(d, tip, dir, { shaft, len, width, color }) {
  return stroke(d, color, shaft) + head(tip, dir, len, width, color);
}

// ---------- figures (stroke built, consistent weight) ----------
// Walking person, feet at (x, y), height h, facing right unless flip.
export function walker(x, y, h, color, { flip = false, child = false } = {}) {
  const f = flip ? -1 : 1;
  const P = (px, py) => [x + px * h * f, y + py * h];
  const limb = h * 0.115;
  const legs = poly([P(0.2, -0.03), P(0.1, -0.22), P(-0.03, -0.43)], false) + poly([P(-0.22, -0.04), P(-0.12, -0.22), P(-0.03, -0.43)], false);
  const arms = poly([P(0.17, -0.45), P(0.12, -0.56), P(0.01, -0.7)], false) + poly([P(-0.18, -0.47), P(-0.12, -0.58), P(0.01, -0.7)], false);
  const torso = poly([P(0.015, -0.71), P(-0.03, -0.44)], false);
  const hr = child ? 0.12 : 0.105;
  const hc = P(0.06, child ? -0.86 : -0.885);
  return (
    stroke(legs + arms, color, limb, { cap: 'round' }) +
    stroke(torso, color, h * 0.17, { cap: 'round' }) +
    circle(hc[0], hc[1], hr * h, color)
  );
}

// Bicycle centred on (x, y), width about 92 * k.
export function bicycle(x, y, k, color) {
  const P = (px, py) => [x + px * k, y + py * k];
  const wheels = ring(...P(-28, 10), 17 * k, color, 6 * k) + ring(...P(28, 10), 17 * k, color, 6 * k);
  const frame =
    poly([P(-28, 10), P(-2, 10), P(-9, -16)], false) +
    poly([P(-28, 10), P(-8, -13), P(19, -13), P(-2, 10)], false) +
    poly([P(28, 10), P(17, -21)], false) +
    poly([P(15, -23), P(25, -25)], false) +
    poly([P(-17, -18), P(-3, -18)], false);
  return wheels + stroke(frame, color, 5.5 * k, { cap: 'round' });
}

// Car seen from behind, bottom centre at (x, y), width about 54 * k.
export function carRear(x, y, k, color, win = C.white) {
  const P = (px, py) => [x + px * k, y + py * k];
  return (
    fill(roundedPolygon([P(-15, -44), P(15, -44), P(22, -27), P(-22, -27)], 3 * k), color) +
    fill(roundedPolygon([P(-27, -29), P(27, -29), P(27, -9), P(-27, -9)], 4 * k), color) +
    fill(roundedPolygon([P(-25, -12), P(-14, -12), P(-14, 0), P(-25, 0)], 2 * k) + roundedPolygon([P(14, -12), P(25, -12), P(25, 0), P(14, 0)], 2 * k), color) +
    fill(roundedPolygon([P(-11.5, -40), P(11.5, -40), P(16, -30), P(-16, -30)], 1.5 * k) + poly([P(-23, -24), P(-14, -24), P(-14, -19), P(-23, -19)]) + poly([P(14, -24), P(23, -24), P(23, -19), P(14, -19)]), win)
  );
}

// Lorry seen from behind, bottom centre at (x, y).
export function lorryRear(x, y, k, color, win = C.white) {
  const P = (px, py) => [x + px * k, y + py * k];
  return (
    fill(roundedPolygon([P(-25, -60), P(25, -60), P(25, -10), P(-25, -10)], 2.5 * k), color) +
    fill(roundedPolygon([P(-24, -12), P(-12, -12), P(-12, 0), P(-24, 0)], 2 * k) + roundedPolygon([P(12, -12), P(24, -12), P(24, 0), P(12, 0)], 2 * k), color) +
    stroke(poly([P(0, -55), P(0, -17)], false) + poly([P(-21, -16), P(21, -16)], false), win, 2.2 * k)
  );
}

// Car in side view facing left, bottom centre at (x, y), length about 92 * k.
export function carSide(x, y, k, color, bg = C.white) {
  const P = (px, py) => [x + px * k, y + py * k];
  const body = roundedPolygon([P(-46, -24), P(-30, -27), P(-19, -42), P(17, -42), P(29, -27), P(44, -24), P(46, -9), P(-46, -9)], 3 * k);
  const win = roundedPolygon([P(-26, -28), P(-16, -38), P(-2, -38), P(-2, -28)], 1.5 * k) + roundedPolygon([P(3, -38), P(15, -38), P(24, -28), P(3, -28)], 1.5 * k);
  const wheel = (cx) => `<circle cx="${n(x + cx * k)}" cy="${n(y - 9 * k)}" r="${n(10.5 * k)}" fill="${color}" stroke="${bg}" stroke-width="${n(3 * k)}"/>`;
  return fill(body, color) + fill(win, bg) + wheel(-27) + wheel(27);
}

// Lorry in side view facing left.
export function lorrySide(x, y, k, color, bg = C.white) {
  const P = (px, py) => [x + px * k, y + py * k];
  const cab = roundedPolygon([P(-50, -30), P(-42, -44), P(-25, -44), P(-25, -12), P(-50, -12)], 3 * k);
  const box = roundedPolygon([P(-21, -56), P(50, -56), P(50, -16), P(-21, -16)], 2 * k);
  const chassis = poly([P(-50, -16), P(50, -16), P(50, -10), P(-50, -10)]);
  const win = roundedPolygon([P(-44, -31), P(-39, -40), P(-30, -40), P(-30, -31)], 1.5 * k);
  const wheel = (cx) => `<circle cx="${n(x + cx * k)}" cy="${n(y - 8 * k)}" r="${n(9 * k)}" fill="${color}" stroke="${bg}" stroke-width="${n(3 * k)}"/>`;
  return fill(cab + box + chassis, color) + fill(win, bg) + wheel(-37) + wheel(22) + wheel(39);
}

// Bus in side view facing left.
export function busSide(x, y, k, color, bg) {
  const P = (px, py) => [x + px * k, y + py * k];
  const body = roundedPolygon([P(-54, -52), P(54, -52), P(54, -10), P(-54, -10)], 6 * k);
  let win = '';
  for (let i = 0; i < 5; i++) win += roundedPolygon([P(-40 + i * 19, -45), P(-26 + i * 19, -45), P(-26 + i * 19, -31), P(-40 + i * 19, -31)], 1.5 * k);
  win += roundedPolygon([P(-50, -45), P(-44, -45), P(-44, -20), P(-50, -20)], 1.5 * k);
  const wheel = (cx) => `<circle cx="${n(x + cx * k)}" cy="${n(y - 9 * k)}" r="${n(9.5 * k)}" fill="${color}" stroke="${bg}" stroke-width="${n(3 * k)}"/>`;
  return fill(body, color) + fill(win, bg) + wheel(-32) + wheel(34);
}

// Motorcycle with rider, side view facing left, wheels' bottom at y.
export function motorcycle(x, y, k, color) {
  const P = (px, py) => [x + px * k, y + py * k];
  const wheels = ring(...P(-31, -14), 13 * k, color, 6.5 * k) + ring(...P(31, -14), 13 * k, color, 6.5 * k);
  const body = roundedPolygon([P(-14, -32), P(-4, -38), P(16, -36), P(34, -32), P(30, -24), P(10, -22), P(6, -12), P(-10, -12), P(-14, -24)], 3 * k);
  const fork = poly([P(-31, -14), P(-21, -40)], false) + poly([P(-24, -42), P(-14, -46)], false) + poly([P(31, -14), P(18, -28)], false);
  const rider = poly([P(2, -40), P(-10, -60)], false);
  const limbs = poly([P(-10, -58), P(-16, -48), P(-20, -44)], false) + poly([P(4, -38), P(-8, -30), P(-4, -18)], false);
  return (
    wheels +
    fill(body, color) +
    stroke(fork, color, 5.5 * k, { cap: 'round' }) +
    stroke(rider, color, 13 * k, { cap: 'round' }) +
    stroke(limbs, color, 7.5 * k, { cap: 'round' }) +
    circle(...P(-12, -71), 9 * k, color)
  );
}
