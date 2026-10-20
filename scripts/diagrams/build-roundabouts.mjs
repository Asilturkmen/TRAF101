#!/usr/bin/env node
// Top-down roundabout diagrams for the roundabout guide (content/lessons/roundabouts.json).
// Left-hand traffic, clockwise circulation. The learner's car is teal, other road users grey,
// indicators orange. Angles are screen angles: 0 = east, 90 = south; clockwise = increasing angle.
// Usage: node scripts/diagrams/build-roundabouts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { C, n, poly, fill, stroke, circle, ring, rect, roundedPolygon, head, walker, bicycle } from '../signs/lib.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = path.join(root, 'public', 'diagrams');

const K = {
  ground: '#E3EAE6',
  asphalt: '#A3ACB4',
  island: '#8FBF9C',
  learner: '#377272',
  learnerGlass: '#BFD9D9',
  other: '#E7EAED',
  otherEdge: '#5F6A74',
  otherGlass: '#8E98A2',
  blink: '#E67E22',
  person: '#3E4952',
};

const S = 400; // canvas
const c = 200; // centre
const O = [c, c];
const R = 108; // outer edge of the circulating carriageway
const ISLAND = 50;
const W = 36; // half-width of an arm
const L = 19; // lane centre offset from the arm centre line
const RP = 80; // radius of the learner's path on the roundabout

const rad = (a) => (a * Math.PI) / 180;
const at = (a, r) => [c + r * Math.cos(rad(a)), c + r * Math.sin(rad(a))];
const tan = (a) => [-Math.sin(rad(a)), Math.cos(rad(a))]; // clockwise direction of travel
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k];
const P = (p) => `${n(p[0])} ${n(p[1])}`;
const dashed = (svg, pattern) => svg.replace('/>', ` stroke-dasharray="${pattern}"/>`);
// Arm at angle a: outward unit u, and v pointing to the left of a driver heading in.
const arm = (a) => ({ u: [Math.cos(rad(a)), Math.sin(rad(a))], v: [-Math.sin(rad(a)), Math.cos(rad(a))] });
const entryLane = (a, d) => { const { u, v } = arm(a); return add(add(O, u, d), v, L); };
const exitLane = (a, d) => { const { u, v } = arm(a); return add(add(O, u, d), v, -L); };
const rotation = (dir) => (Math.atan2(dir[0], -dir[1]) * 180) / Math.PI;
const place = (p, dir, body) => `<g transform="translate(${P(p)}) rotate(${n(rotation(dir))})">${body}</g>`;

// ---------- road users ----------
// Cars are drawn once in <defs> and placed with <use>, which keeps each file small.
// Local frame: the front of the car points up (-y).
function defs() {
  const glass = (g) => rect(-5.5, -8.5, 11, 5, 1.5, g) + rect(-5, 7, 10, 3.5, 1.2, g);
  const flash = (s) => {
    let b = '';
    for (const y of [-12.5, 12.5]) {
      const o = y < 0 ? -1 : 1;
      b += circle(s * 7.5, y, 2.6, K.blink);
      b += stroke(`M${n(s * 11)} ${n(y + o)}l${n(s * 4)} ${n(o * 3)}M${n(s * 11.5)} ${n(y - o * 3)}h${n(s * 5)}`, K.blink, 1.8, { cap: 'round' });
    }
    return b;
  };
  return (
    '<defs>' +
    `<g id="m">${rect(-8.5, -15.5, 17, 31, 4.5, C.white)}${rect(-7, -14, 14, 28, 3.5, K.learner)}${glass(K.learnerGlass)}</g>` +
    `<g id="o"><rect x="-7" y="-14" width="14" height="28" rx="3.5" fill="${K.other}" stroke="${K.otherEdge}" stroke-width="1.6"/>${glass(K.otherGlass)}</g>` +
    `<g id="l">${flash(-1)}</g><g id="r">${flash(1)}</g>` +
    '</defs>'
  );
}
// Car centred on p, travelling along dir. blink: 'left' | 'right'.
const car = (p, dir, { me = false, blink = null } = {}) =>
  place(p, dir, `<use href="#${me ? 'm' : 'o'}"/>` + (blink ? `<use href="#${blink[0]}"/>` : ''));
const ringCar = (a, opts) => car(at(a, RP), tan(a), opts);

// People use the sign-set pictograms (side view) so they read at small sizes.
// Pedestrian standing with feet at p.
const person = ([x, y]) => walker(x, y, 30, K.person);
// Cyclist centred on p.
const cyclist = ([x, y]) => circle(x, y, 15, C.white) + bicycle(x, y - 2, 0.3, K.person);

// ---------- arrows ----------
function pathArrow(d, tip, dir, { arrowHead = true } = {}) {
  return (
    stroke(d, C.white, 9, { cap: 'round' }) +
    (arrowHead ? head(add(tip, dir, 2.5), dir, 15, 19, C.white) : '') +
    stroke(d, K.learner, 5, { cap: 'round' }) +
    (arrowHead ? head(tip, dir, 12, 14, K.learner) : '')
  );
}
// Thin grey arrow along the roundabout, from angle a to b at radius r.
function flowArrow(a, b, r = RP) {
  return stroke(`M${P(at(a, r))}A${r} ${r} 0 0 1 ${P(at(b - 4, r))}`, K.otherEdge, 3, { cap: 'round' }) + head(at(b + 3, r), tan(b), 9, 10, K.otherEdge);
}

// Learner's route from entry arm a to exit arm b (b > a, clockwise), ending `end` units from the centre.
function route(a, b, end = 182) {
  const j = a + 30;
  const q = b - 30;
  const J = at(j, RP);
  const Q = at(q, RP);
  const stop = exitLane(b, end);
  const d =
    `M${P(entryLane(a, R + 34))}C${P(entryLane(a, R + 4))} ${P(add(J, tan(j), -26))} ${P(J)}` +
    `A${RP} ${RP} 0 ${q - j > 180 ? 1 : 0} 1 ${P(Q)}` +
    `C${P(add(Q, tan(q), 26))} ${P(exitLane(b, R + 2))} ${P(exitLane(b, R + 30))}L${P(stop)}`;
  return { d, tip: add(stop, arm(b).u, 12), dir: arm(b).u, start: entryLane(a, R + 54) };
}

// ---------- scenery ----------
function roundabout({ crossing = null } = {}) {
  const arms = [0, 90, 180, 270];
  let road = circle(c, c, R, K.asphalt);
  for (const a of arms) {
    const { u, v } = arm(a);
    const far = add(O, u, 260);
    road += fill(poly([add(O, v, W), add(far, v, W), add(far, v, -W), add(O, v, -W)]), K.asphalt);
  }
  // rounded kerbs where an arm meets the ring: a fillet circle tangent to the arm edge and the ring
  const f = 26;
  const along = Math.sqrt((R + f) ** 2 - (W + f) ** 2);
  const meet = Math.sqrt(R ** 2 - W ** 2);
  let kerbs = '';
  for (const a of arms) {
    const { u, v } = arm(a);
    for (const side of [1, -1]) {
      const fc = add(add(O, u, along), v, side * (W + f));
      const t1 = add(fc, v, -side * f);
      const t2 = add(O, [(fc[0] - c) / (R + f), (fc[1] - c) / (R + f)], R);
      const x = add(add(O, u, meet), v, side * W);
      const ang = (p) => Math.atan2(p[1] - fc[1], p[0] - fc[0]);
      const turn = Math.atan2(Math.sin(ang(t1) - ang(t2)), Math.cos(ang(t1) - ang(t2)));
      kerbs += `M${P(t1)}L${P(x)}L${P(t2)}A${f} ${f} 0 0 ${turn > 0 ? 1 : 0} ${P(t1)}Z`;
    }
  }
  road += fill(kerbs, K.asphalt);
  let marks = '';
  let lines = '';
  let giveWay = '';
  for (const a of arms) {
    const { u, v } = arm(a);
    const tipD = R + 46;
    lines += `M${P(add(O, u, tipD + 6))}L${P(add(O, u, 260))}`;
    const sp = [add(add(O, u, R + 3), v, 9), add(add(O, u, tipD), v, 0.1), add(add(O, u, tipD), v, -0.1), add(add(O, u, R + 3), v, -9)];
    marks += `<path fill="${K.island}" stroke="${C.white}" stroke-width="2" d="${roundedPolygon(a % 180 ? sp.slice().reverse() : sp, 2)}"/>`;
    // give way line across the entry lane
    const g1 = add(add(O, u, R + 4), v, 10);
    const g2 = add(add(O, u, R + 4), v, W - 1);
    giveWay += `M${P(g1)}L${P(g2)}M${P(add(g1, u, 5))}L${P(add(g2, u, 5))}`;
  }
  marks += dashed(stroke(lines, C.white, 2.5), '10 9') + dashed(stroke(giveWay, C.white, 2.6), '5 4');
  if (crossing) {
    const { u, v } = arm(crossing.arm);
    let z = '';
    for (let k = -W + 3; k <= W - 6; k += 11) {
      const a1 = add(add(O, u, crossing.at), v, k);
      z += poly([a1, add(a1, u, 22), add(add(a1, u, 22), v, 6), add(a1, v, 6)]);
    }
    marks += fill(z, C.white);
  }
  return rect(0, 0, S, S, 0, K.ground) + road + marks + circle(c, c, ISLAND + 2, C.white) + circle(c, c, ISLAND, K.island);
}

const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">${defs()}${body}</svg>`;

// ---------- diagrams ----------
const D = {};

// Waiting at the give way line: traffic on the roundabout reaches you from the right.
D['roundabout-give-way'] = () => {
  const me = entryLane(90, R + 22);
  const eye = add(me, [0, -10]);
  const view = (deg, r) => add(eye, [Math.cos(rad(deg)), Math.sin(rad(deg))], r);
  const fan = `<path fill="${K.learner}" fill-opacity="0.15" d="M${P(eye)}L${P(view(-60, 100))}A100 100 0 0 1 ${P(view(-24, 100))}Z"/>`;
  return svg(S, S,
    roundabout() + fan +
    flowArrow(54, 82) + ringCar(38) + flowArrow(232, 258) + ringCar(215) +
    car(me, [0, -1], { me: true }) + car(entryLane(180, R + 22), [1, 0]));
};

// First exit: signal left on the approach and stay on the left.
D['roundabout-first-exit'] = () => {
  const r = route(90, 180);
  return svg(S, S, roundabout() + pathArrow(r.d, r.tip, r.dir) + car(r.start, [0, -1], { me: true, blink: 'left' }));
};

// Straight on: no signal on the approach, left signal once you pass the exit before yours.
D['roundabout-straight-on'] = () => {
  const r = route(90, 270);
  return svg(S, S, roundabout() + pathArrow(r.d, r.tip, r.dir) + car(r.start, [0, -1], { me: true }) + ringCar(212, { me: true, blink: 'left' }));
};

// Turning right: right signal on the approach and round, left signal after the exit before yours.
D['roundabout-right-turn'] = () => {
  const r = route(90, 360);
  return svg(S, S,
    roundabout() + pathArrow(r.d, r.tip, r.dir) + car(r.start, [0, -1], { me: true, blink: 'right' }) +
    ringCar(200, { me: true, blink: 'right' }) + ringCar(303, { me: true, blink: 'left' }));
};

// Leaving at the first exit: wait for a pedestrian on the crossing. A cyclist goes round on the outside.
D['roundabout-pedestrians'] = () => {
  const zebra = R + 50;
  const meAt = R + 26;
  const r = route(90, 180, meAt);
  return svg(S, S,
    roundabout({ crossing: { arm: 180, at: zebra } }) + pathArrow(r.d, r.tip, r.dir, { arrowHead: false }) +
    car(exitLane(180, meAt), [-1, 0], { me: true }) +
    person(add(exitLane(180, zebra + 11), [0, 8])) +
    flowArrow(352, 384, R - 14) + cyclist(at(334, R - 14)));
};

// Mini roundabout at a T-junction: drive round the painted disc, give way to the right.
D['mini-roundabout'] = () => {
  const H = 340;
  const cy = 150;
  let s = rect(0, 0, S, H, 0, K.ground);
  s += rect(0, cy - W, S, 2 * W, 0, K.asphalt) + rect(c - W, cy, 2 * W, H - cy, 0, K.asphalt);
  const f = 26;
  for (const sx of [-1, 1]) {
    const x0 = c + sx * W;
    s += `<path fill="${K.asphalt}" d="M${n(x0)} ${n(cy + W)}h${n(sx * f)}A${f} ${f} 0 0 ${sx > 0 ? 0 : 1} ${n(x0)} ${n(cy + W + f)}Z"/>`;
  }
  s += dashed(stroke(`M0 ${cy}H${c - 44}M${c + 44} ${cy}H${S}M${c} ${cy + 44}V${H}`, C.white, 2.5), '10 9');
  s += dashed(stroke(
    `M${c - W + 1} ${cy + W + 4}H${c - 2}M${c - W + 1} ${cy + W + 9}H${c - 2}` +
    `M${c - W - 4} ${cy - W + 1}V${cy - 2}M${c - W - 9} ${cy - W + 1}V${cy - 2}` +
    `M${c + W + 4} ${cy + 2}V${cy + W - 1}M${c + W + 9} ${cy + 2}V${cy + W - 1}`, C.white, 2.6), '5 4');
  s += ring(c, cy, 13, C.white, 5) + circle(c, cy, 6, C.white);
  const d = `M${c - L} ${cy + W + 52}V${cy + 22}C${c - L} ${cy - 8} ${c - 10} ${cy - 27} ${c + 8} ${cy - 27}C${c + 22} ${cy - 27} ${c + 30} ${cy - L} ${c + 46} ${cy - L}H${S - 32}`;
  s += pathArrow(d, [S - 20, cy - L], [1, 0]);
  s += car([c - L, cy + W + 70], [0, -1], { me: true, blink: 'right' });
  s += stroke(`M${c + W + 14} ${cy + L}H${c - 34}`, K.otherEdge, 3, { cap: 'round' }) + head([c - 46, cy + L], [-1, 0], 9, 10, K.otherEdge);
  s += car([c + W + 32, cy + L], [-1, 0]);
  return svg(S, H, s);
};

fs.mkdirSync(outDir, { recursive: true });
for (const [name, fn] of Object.entries(D)) {
  const out = fn();
  if (out.length >= 6000) throw new Error(`${name}.svg is ${out.length} bytes`);
  fs.writeFileSync(path.join(outDir, `${name}.svg`), out);
  console.log(`${name}.svg ${out.length} bytes`);
}
