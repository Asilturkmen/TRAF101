// Road markings, traffic lights and police signals (v1.1).
// Markings are top-down road views with left-hand traffic: your car is teal, drives up the page
// and keeps to the left lane. Lights are signal heads seen from the driver's seat. Police signals
// are figures seen from the driver's seat. Only words painted on roads (DUR, OTOBÜS) appear, as paths.
import { C, n, poly, fill, stroke, circle, rect, group, roundedPolygon, text, head, walker, compose, rectFrame } from '../lib.mjs';

const W = C.white;
const K = C.black;
const ASPHALT = '#41474D'; // road surface; neutral grey between the palette black and the outline grey
const KERB = C.outline; // pavement, verge and island
const LENS_OFF = '#353A3F'; // unlit lamp inside a black signal head
const FIG_OFF = '#5A6066'; // unlit pedestrian figure

// ---------- shared road pieces ----------
const VW = 200;
const VH = 240;
// Portrait road scene: pavement-coloured plate, asphalt drawn on top.
const scene = (body, w = VW, h = VH) => compose(rectFrame({ w, h, color: KERB }), body);
const roadV = (x0, x1, y0 = 4, y1 = VH - 4) => rect(x0, y0, x1 - x0, y1 - y0, 0, ASPHALT);
const line = (d, w = 4, color = W) => stroke(d, color, w);
// Broken line from (x, y0) to (x, y1) along y (or along x if horizontal).
function dashes(x, y0, y1, { dash = 22, gap = 16, w = 4, color = W, horizontal = false } = {}) {
  let d = '';
  const dir = y1 > y0 ? 1 : -1;
  for (let p = y0; dir > 0 ? p < y1 : p > y1; p += dir * (dash + gap)) {
    const q = dir > 0 ? Math.min(p + dash, y1) : Math.max(p - dash, y1);
    d += horizontal ? `M${n(p)} ${n(x)}H${n(q)}` : `M${n(x)} ${n(p)}V${n(q)}`;
  }
  return stroke(d, color, w);
}
// Car seen from above, centred on (x, y), nose pointing up unless down.
// "Your car" uses the site teal, the same as in the roundabout diagrams.
const YOURS = '#377272';
function carTop(x, y, { color = YOURS, down = false, k = 1 } = {}) {
  const P = (px, py) => [x + px * k, y + (down ? -py : py) * k];
  const pts = [P(-12, -22), P(12, -22), P(13, 20), P(-13, 20)];
  const body = roundedPolygon(down ? [pts[1], pts[0], pts[3], pts[2]] : pts, 6 * k);
  const screen = poly([P(-9.5, -9), P(9.5, -9), P(8, -2), P(-8, -2)]);
  const rear = poly([P(-8.5, 11), P(8.5, 11), P(9, 15), P(-9, 15)]);
  return fill(body, color) + fill(screen + rear, W);
}
// Bus seen from above, nose up.
const busTop = (x, y) => fill(roundedPolygon([[x - 15, y - 44], [x + 15, y - 44], [x + 15, y + 44], [x - 15, y + 44]], 4), W) + rect(x - 11, y - 38, 22, 8, 1.5, ASPHALT);
// Crossroads layout: vertical road x 52..148, horizontal road y 72..168.
const crossroads = () => roadV(52, 148) + rect(4, 72, VW - 8, 96, 0, ASPHALT);
// T-junction layout: main road across the top (y 24..100), side road from the bottom (x 48..152).
const tJunction = () =>
  rect(4, 24, VW - 8, 76, 0, ASPHALT) + roadV(48, 152, 100) + dashes(62, 4, 196, { horizontal: true }) + dashes(100, 236, 128, { dash: 20, gap: 14 });

// Clip the line through p with direction d to a convex polygon (points clockwise or not).
function clipToConvex(p, d, pts) {
  let t0 = -1e4;
  let t1 = 1e4;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const e = [b[0] - a[0], b[1] - a[1]];
    const nrm = [-e[1], e[0]];
    const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length;
    const cy = pts.reduce((s, q) => s + q[1], 0) / pts.length;
    const side = Math.sign(nrm[0] * (cx - a[0]) + nrm[1] * (cy - a[1]));
    const num = side * (nrm[0] * (p[0] - a[0]) + nrm[1] * (p[1] - a[1]));
    const den = side * (nrm[0] * d[0] + nrm[1] * d[1]);
    if (Math.abs(den) < 1e-9) {
      if (num < 0) return null;
      continue;
    }
    const t = -num / den;
    if (den > 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
  }
  return t1 > t0 ? [[p[0] + d[0] * t0, p[1] + d[1] * t0], [p[0] + d[0] * t1, p[1] + d[1] * t1]] : null;
}
function hatch(pts, { step = 14, dir = [1, 1], inset = 0 } = {}) {
  const l = Math.hypot(...dir);
  const d = [dir[0] / l, dir[1] / l];
  const nv = [-d[1], d[0]];
  let out = '';
  for (let s = -300; s <= 300; s += step) {
    const p = [100 + nv[0] * s, 120 + nv[1] * s];
    const seg = clipToConvex(p, d, pts);
    if (!seg) continue;
    const [a, b] = seg;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len <= 2 * inset + 1) continue;
    out += `M${n(a[0] + d[0] * inset)} ${n(a[1] + d[1] * inset)}L${n(b[0] - d[0] * inset)} ${n(b[1] - d[1] * inset)}`;
  }
  return out;
}

// Elongated road arrows (painted in a lane), tip at the top.
const laneArrow = {
  ahead: (x, y0, y1) => fill(poly([[x - 4, y0], [x + 4, y0], [x + 4, y1 + 22], [x + 11, y1 + 22], [x, y1], [x - 11, y1 + 22], [x - 4, y1 + 22]]), W),
  turn(x, y0, yBend, side) {
    // shaft up to yBend, then a bend towards side (-1 left, 1 right) ending in a head
    const s = side;
    const d = `M${n(x)} ${n(y0)}V${n(yBend)}Q${n(x)} ${n(yBend - 16)} ${n(x + s * 12)} ${n(yBend - 24)}`;
    return stroke(d, W, 8) + head([x + s * 28, yBend - 36], [s, -0.75], 20, 22, W);
  },
};

// ---------- markings ----------
const yourCar = (x = 62, y = 196) => carTop(x, y);
const twoWay = (centre) => scene(roadV(24, 176) + centre + yourCar() + carTop(138, 64, { color: C.faded, down: true }));

const MARKINGS = {
  'marking/broken-centre-line': () => twoWay(dashes(100, 236, 4)),
  'marking/solid-centre-line': () => twoWay(line('M100 4V236')),
  'marking/double-solid-line': () => twoWay(line('M94.5 4V236M105.5 4V236')),
  // "near" = the line of the pair on your (left) side of the road
  'marking/solid-broken--broken-near': () => twoWay(dashes(94.5, 236, 4) + line('M105.5 4V236')),
  'marking/solid-broken--solid-near': () => twoWay(line('M94.5 4V236') + dashes(105.5, 236, 4)),
  'marking/lane-lines': () =>
    scene(roadV(24, 176) + line('M32 4V236') + line('M168 4V236') + dashes(100, 236, 4) + yourCar(66, 190) + carTop(134, 96, { color: C.faded })),
  'marking/edge-line': () => {
    // Rural two-way road with verges; a side road joins on the left, where the edge line is broken.
    const side = rect(4, 70, 30, 52, 0, ASPHALT);
    const edges = line('M36 4V70M36 122V236') + dashes(36, 74, 122, { dash: 8, gap: 8 }) + line('M164 4V236');
    return scene(roadV(30, 170) + side + edges + dashes(100, 236, 4) + yourCar(66, 196));
  },
  'marking/give-way-line': () => {
    const across = dashes(108, 50, 100, { dash: 9, gap: 7, w: 6, horizontal: true });
    const tri = stroke(poly([[56, 126], [92, 126], [74, 176]]), W, 4);
    return scene(tJunction() + across + tri + yourCar(74, 210));
  },
  'marking/stop-line': () => {
    const bar = rect(50, 104, 50, 8, 0, W);
    const word = text('DUR', { cx: 74, y: 172, cap: 46, weight: 800, maxWidth: 38, track: 1.5, color: W });
    return scene(tJunction() + bar + word + yourCar(74, 210));
  },
  'marking/zebra-crossing': () => {
    let bars = '';
    for (let x = 30; x + 10 <= 172; x += 20) bars += rect(x, 96, 11, 52, 0, W);
    return scene(roadV(24, 176) + bars + dashes(100, 4, 86, { dash: 20, gap: 14 }) + dashes(100, 236, 158, { dash: 20, gap: 14 }) + yourCar(62, 204));
  },
  'marking/hatched-area': () => {
    const island = [[100, 22], [124, 82], [124, 158], [100, 218], [76, 158], [76, 82]];
    const outline = line(poly(island), 4);
    const stripes = line(hatch(island, { step: 13, dir: [1, -1] }), 3.5);
    return scene(roadV(24, 176) + stripes + outline + line('M100 4V22M100 218V236') + yourCar(50, 196) + carTop(150, 60, { color: C.faded, down: true }));
  },
  'marking/box-junction': () => {
    const sq = [[52, 72], [148, 72], [148, 168], [52, 168]];
    const grid = hatch(sq, { step: 19, dir: [1, 1] }) + hatch(sq, { step: 19, dir: [1, -1] });
    const lines = dashes(100, 236, 172, { dash: 18, gap: 14 }) + dashes(100, 4, 68, { dash: 18, gap: 14 }) + dashes(120, 4, 48, { horizontal: true, dash: 18, gap: 14 }) + dashes(120, 196, 152, { horizontal: true, dash: 18, gap: 14 });
    return scene(crossroads() + lines + stroke(grid, C.yellow, 3.5) + stroke(poly(sq), C.yellow, 4) + yourCar(76, 208));
  },
  'marking/lane-arrows': () => {
    const stop = rect(24, 26, 152, 7, 0, W);
    const divider = line('M100 33V112') + dashes(100, 236, 120, { dash: 20, gap: 14 });
    const left = laneArrow.ahead(62, 168, 78) + laneArrow.turn(62, 168, 118, -1);
    const right = laneArrow.turn(138, 168, 118, 1);
    return scene(roadV(24, 176) + stop + divider + line('M30 4V236') + line('M170 4V236') + left + right + yourCar(62, 210));
  },
  'marking/bus-lane': () => {
    const word = text('OTOBÜS', { cx: 58, y: 156, cap: 40, weight: 800, maxWidth: 56, track: 1, color: W });
    return scene(roadV(24, 176) + line('M92 4V236', 7) + dashes(134, 236, 4) + word + busTop(58, 58) + carTop(134, 196));
  },
  'marking/parking-bays': () => {
    let ticks = '';
    for (const y of [20, 80, 140, 200]) ticks += `M24 ${y}H64`;
    const bays = line(`M64 20V200${ticks}`, 3.5);
    return scene(roadV(24, 176) + bays + dashes(122, 236, 4) + carTop(44, 110) + carTop(93, 214));
  },
};

// ---------- traffic lights ----------
// Three-aspect head: red on top, amber in the middle, green at the bottom.
const HEAD = { w: 100, h: 220, cx: 50, ys: [44, 110, 176], r: 23 };
const lamp = (cy, color) => circle(HEAD.cx, cy, HEAD.r, color);
function signalHead(on = {}, extra = '') {
  const [r, a, g] = HEAD.ys;
  const body = lamp(r, on.red ? C.red : LENS_OFF) + lamp(a, on.amber ? C.yellow : LENS_OFF) + lamp(g, on.green ? C.green : LENS_OFF);
  return compose(rectFrame({ w: HEAD.w, h: HEAD.h, color: K }), body + extra);
}
function rays(cx, cy, r0, r1, color, count = 8) {
  let d = '';
  for (let i = 0; i < count; i++) {
    const a = (i * 2 * Math.PI) / count + Math.PI / count;
    d += `M${n(cx + r0 * Math.cos(a))} ${n(cy + r0 * Math.sin(a))}L${n(cx + r1 * Math.cos(a))} ${n(cy + r1 * Math.sin(a))}`;
  }
  return stroke(d, color, 3.5, { cap: 'round' });
}
// Standing pedestrian, front view, feet at (x, y), height h.
function stander(x, y, h, color) {
  const P = (px, py) => [x + px * h, y + py * h];
  const limb = h * 0.115;
  const legs = poly([P(-0.07, -0.44), P(-0.08, -0.03)], false) + poly([P(0.07, -0.44), P(0.08, -0.03)], false);
  const arms = poly([P(-0.15, -0.68), P(-0.19, -0.42)], false) + poly([P(0.15, -0.68), P(0.19, -0.42)], false);
  const torso = roundedPolygon([P(-0.15, -0.73), P(0.15, -0.73), P(0.12, -0.42), P(-0.12, -0.42)], h * 0.04);
  return stroke(legs + arms, color, limb, { cap: 'round' }) + fill(torso, color) + circle(...P(0, -0.86), h * 0.1, color);
}
// Two-aspect pedestrian head: red standing figure above, green walking figure below.
function pedestrianHead(green) {
  const w = 100;
  const h = 190;
  const box = (y) => rect(14, y, 72, 76, 6, LENS_OFF);
  const top = stander(50, 16 + 70, 58, green ? FIG_OFF : C.red);
  const bottom = walker(50, 104 + 70, 60, green ? C.green : FIG_OFF);
  return compose(rectFrame({ w, h, color: K }), box(14) + box(100) + top + bottom);
}

const LIGHTS = {
  'light/red': () => signalHead({ red: true }),
  'light/amber': () => signalHead({ amber: true }),
  'light/green': () => signalHead({ green: true }),
  'light/amber-flashing': () => signalHead({ amber: true }, rays(HEAD.cx, HEAD.ys[1], HEAD.r + 4.5, HEAD.r + 10.5, C.yellow)),
  'light/green-filter-arrow': () => {
    // Main head showing red, with a filter aspect beside its bottom lamp showing a green arrow to the left.
    const w = 170;
    const h = 220;
    const main = group('translate(70 0)', rectFrame({ w: 100, h, color: K }).before + lamp(HEAD.ys[0], C.red) + lamp(HEAD.ys[1], LENS_OFF) + lamp(HEAD.ys[2], LENS_OFF));
    const filt = rectFrame({ w: 76, h: 76, color: K, r: 12 });
    const arrowBody = stroke('M50 38H30', C.green, 9) + head([12, 38], [-1, 0], 20, 26, C.green);
    const side = group('translate(0 138)', filt.before + circle(38, 38, HEAD.r + 3, LENS_OFF) + arrowBody);
    return compose({ w, h, before: '', after: '' }, side + main);
  },
  'light/pedestrian-red': () => pedestrianHead(false),
  'light/pedestrian-green': () => pedestrianHead(true),
};

// ---------- police signals ----------
// Officer seen from the driver's seat: blue uniform and cap, white gloves.
const U = C.blue;
const PW = 200;
const PH = 220;
const panel = (body) => compose(rectFrame({ w: PW, h: PH, color: W }), body);
const glove = (x, y, r = 7) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${W}" stroke="${U}" stroke-width="3"/>`;
// Palm turned towards the viewer: a white mitten shape with the thumb out.
const palm = (x, y) =>
  `<path fill="${W}" stroke="${U}" stroke-width="3" stroke-linejoin="round" d="${roundedPolygon([[x - 8, y - 12], [x + 8, y - 12], [x + 8, y + 9], [x - 8, y + 9]], 6)}"/>` +
  stroke(`M${n(x - 8)} ${n(y + 2)}L${n(x - 14)} ${n(y - 5)}`, U, 3, { cap: 'round' });
const SH = { l: [78, 84], r: [122, 84] }; // shoulders
const arm = (pts) => stroke(poly(pts, false), U, 13, { cap: 'round' });
function officer({ back = false, arms = '' } = {}) {
  const torso = roundedPolygon([[76, 78], [124, 78], [119, 146], [81, 146]], 8);
  const legs = stroke('M91 142L89 202M109 142L111 202', U, 15, { cap: 'round' });
  const belt = rect(81, 128, 38, 6, 0, W);
  const capCrown = roundedPolygon([[84, 34], [116, 34], [114, 47], [86, 47]], 4);
  const brim = back ? '' : rect(82, 46, 36, 4, 2, K);
  const neck = rect(94, 64, 12, 16, 3, U);
  const badge = back ? '' : fill(roundedPolygon([[106, 92], [114, 92], [114, 100], [110, 104], [106, 100]], 1.5), W);
  const seam = back ? stroke('M100 82V128', W, 2) : '';
  return legs + fill(torso, U) + belt + badge + seam + neck + circle(100, 58, 13, U) + fill(capCrown, U) + brim + arms;
}
const curvedArrow = (d, tip, dir) => stroke(d, K, 4, { cap: 'round' }) + head(tip, dir, 13, 14, K);

const POLICE = {
  // One arm straight up.
  'police/raised-arm': () => panel(officer({ arms: arm([SH.r, [126, 22]]) + glove(126, 16) + arm([SH.l, [72, 138]]) + glove(71, 143) })),
  // Facing you, hand raised with the palm towards you.
  'police/stop-from-front': () => panel(officer({ arms: arm([SH.r, [148, 96], [150, 58]]) + palm(150, 48) + arm([SH.l, [72, 138]]) + glove(71, 143) })),
  // Back to you, hand raised behind him with the palm towards you.
  'police/stop-from-behind': () => panel(officer({ back: true, arms: arm([SH.l, [52, 96], [50, 58]]) + palm(50, 48) + arm([SH.r, [128, 138]]) + glove(129, 143) })),
  // Facing you, both arms stretched out to the sides.
  'police/stop-front-and-behind': () => panel(officer({ arms: arm([SH.l, [30, 84]]) + glove(23, 84) + arm([SH.r, [170, 84]]) + glove(177, 84) })),
  // Facing you, forearm swinging towards his shoulder: come on.
  'police/beckon-from-front': () =>
    panel(
      officer({ arms: arm([SH.r, [146, 104], [150, 70]]) + glove(150, 63) + arm([SH.l, [72, 138]]) + glove(71, 143) }) +
        curvedArrow('M172 92Q176 60 160 46', [150, 40], [-0.85, -0.5]),
    ),
  // Back to you, arm swinging forward past his shoulder: come on.
  'police/beckon-from-behind': () =>
    panel(
      officer({ back: true, arms: arm([SH.l, [54, 104], [50, 70]]) + glove(50, 63) + arm([SH.r, [128, 138]]) + glove(129, 143) }) +
        curvedArrow('M28 92Q24 60 40 46', [50, 40], [0.85, -0.5]),
    ),
  // Facing you, arm out to the side, palm down, moving up and down.
  'police/slow-down': () =>
    panel(
      officer({ arms: arm([SH.r, [168, 96]]) + glove(174, 98) + arm([SH.l, [72, 138]]) + glove(71, 143) }) +
        stroke('M178 66V80M178 116V130', K, 4, { cap: 'round' }) + head([178, 54], [0, -1], 13, 14, K) + head([178, 142], [0, 1], 13, 14, K),
    ),
};

export const SIGNS = { ...MARKINGS, ...LIGHTS, ...POLICE };
