// v1.1 warning, priority and temporary signs (artist A).
// Same frames, palette and stroke weights as signs.mjs; small helpers are copied, not imported.
// KKTC drives on the left: your own lane is the left-hand one, overtaking happens on the right.
import {
  C, G, n, poly, fill, stroke, circle, rect, group, roundedPolygon, text, arrow,
  walker, carRear, carSide, compose, triangleFrame, rectFrame,
} from '../lib.mjs';

const K = C.black;
const W = C.white;
const tri = (p) => compose(triangleFrame(), p);
const mirror = (body) => group('matrix(-1 0 0 1 200 0)', body);
const road = (d, w = G.road) => stroke(d, K, w);
const minor = (d) => stroke(d, K, G.minor);

// ---------- junctions ----------
const staggered = road('M100 162V74') + minor('M100 140H56') + minor('M100 108H130');
// Main road bending left; the minor road either carries straight on (outside of the bend) or leaves on the inside.
const bendMain = road('M112 162V124C112 104 100 94 80 90');
const jbOutside = bendMain + minor('M112 128V74');
const jbInside = bendMain + minor('M112 138H64');
const angled = road('M110 162V74') + minor('M110 134L70 104');

// ---------- traffic ----------
const TA = { shaft: 9, len: 24, width: 24, color: K };
const twoWayCrossing = () => arrow([64, 112], [136, 112], TA) + arrow([136, 142], [64, 142], TA);
// Two road edges with a central reservation that stops part-way up.
const dualEnds = () => road('M74 162V86', 12) + road('M126 162V86', 12) + fill('M93 162V128A7 7 0 0 1 107 128V162Z', K);
const laneEnds = () => {
  const edges = road('M76 162V86', 12) + road('M124 162V140L106 116V86', 12);
  let dashes = '';
  for (const y of [148, 126]) dashes += `M100 ${y + 14}V${y}`;
  return edges + stroke(dashes, K, 7);
};
const queues = () => carRear(100, 162, 0.8, K) + carRear(100, 124, 0.66, K) + carRear(100, 93, 0.52, K);

// ---------- surface and surroundings ----------
const chip = (x, y, s) => roundedPolygon([[x - s, y - s * 0.3], [x - s * 0.2, y - s], [x + s, y - s * 0.6], [x + s * 0.8, y + s * 0.7], [x - s * 0.5, y + s]], s * 0.3);
const looseChippings = () =>
  carRear(100, 132, 0.95, K) +
  fill(chip(66, 136, 5) + chip(56, 152, 4.5) + chip(74, 156, 5.5) + chip(134, 136, 5) + chip(144, 152, 4.5) + chip(126, 156, 5.5) + chip(100, 154, 4), K);
// Drawn with the verge on the right; the sign mirrors it so the soft verge is on the near (left) side.
const softVerge = () => {
  const ground = fill('M48 162V152H116L152 162Z', K);
  const car = group('rotate(12 112 150)', carRear(104, 150, 0.9, K));
  return ground + car;
};
const windsock = () => {
  const pole = rect(62, 104, 7, 58, 1.5, K);
  // the sock tapers from height 24 at the pole to 12 at its tip, sagging slightly
  const top = (x) => 106 + ((x - 70) / 66) * 9;
  const bot = (x) => 130 - ((x - 70) / 66) * 3;
  const sock = (x0, x1) => poly([[x0, top(x0)], [x1, top(x1)], [x1, bot(x1)], [x0, bot(x0)]]);
  return pole + fill(sock(70, 84) + sock(97, 110) + sock(123, 136), K) + stroke(poly([[69, 106], [136, 115], [136, 127], [69, 130]]), K, 2.5);
};
const tunnel = () =>
  `<path fill="${K}" fill-rule="evenodd" d="M62 162V112Q62 102 72 102H128Q138 102 138 112V162ZM74 162V140A26 26 0 0 1 126 140V162Z"/>`;
const humpBridge = () =>
  `<path fill="${K}" fill-rule="evenodd" d="M46 160V150H60C76 150 84 122 100 122C116 122 124 150 140 150H154V160ZM78 160A22 22 0 0 1 122 160Z"/>`;
const quayside = () => {
  const quay = fill('M50 162V120H88V162Z', K);
  let waves = '';
  for (const y of [148, 159]) waves += `M96 ${y}q6 -6 12 0t12 0t12 0t12 0`;
  const car = group('rotate(32 110 138)', group('matrix(-1 0 0 1 220 0)', carSide(110, 138, 0.48, K)));
  return quay + car + stroke(waves, K, 4, { cap: 'round' });
};
const snowflake = () => {
  const cx = 100;
  const cy = 122;
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 - Math.PI / 2;
    const p = (r, da = 0) => [cx + r * Math.cos(a + da), cy + r * Math.sin(a + da)];
    d += poly([[cx, cy], p(36)], false);
    for (const r of [16, 27]) {
      const base = p(r);
      const ax = Math.cos(a), ay = Math.sin(a);
      const len = r === 16 ? 11 : 9;
      for (const s of [1, -1]) {
        const b = a + s * (Math.PI / 4);
        d += poly([base, [base[0] + len * Math.cos(b) + 0 * ax, base[1] + len * Math.sin(b) + 0 * ay]], false);
      }
    }
  }
  return stroke(d, K, 6, { cap: 'round' });
};
const aircraft = () => {
  // top view, nose up and to the right
  const body =
    roundedPolygon([[97, 72], [103, 72], [105, 84], [105, 150], [100, 160], [95, 150], [95, 84]], 4) +
    poly([[95, 104], [52, 128], [52, 136], [95, 124]]) +
    poly([[105, 104], [148, 128], [148, 136], [105, 124]]) +
    poly([[95, 146], [80, 156], [80, 160], [96, 156]]) +
    poly([[105, 146], [120, 156], [120, 160], [104, 156]]);
  return group('translate(100 124) rotate(28) scale(0.84) translate(-100 -116)', fill(body, K));
};

// ---------- people and animals ----------
const stripes = (y) => fill(`M58 ${y}H74V${y + 8}H58ZM80 ${y}H96V${y + 8}H80ZM104 ${y}H120V${y + 8}H104ZM126 ${y}H142V${y + 8}H126Z`, K);
const elderly = () => {
  const lean = (x, y, h, deg) => group(`rotate(${deg} ${x} ${y})`, walker(x, y, h, K, { flip: true }));
  const stick = stroke(poly([[64, 130], [58, 160]], false), K, 4, { cap: 'round' });
  return lean(80, 160, 70, -8) + stick + lean(122, 160, 64, -4);
};
const deer = () => {
  // leaping deer facing right; local unit = 1, origin at the body centre
  const x = 98;
  const y = 128;
  const k = 0.82;
  const P = (px, py) => [x + px * k, y + py * k];
  const body = roundedPolygon([P(-30, -6), P(-18, -14), P(16, -14), P(26, -8), P(28, 4), P(16, 10), P(-20, 10), P(-32, 4)], 6);
  const neck = poly([P(16, -12), P(28, -32), P(36, -30), P(28, -2)]);
  const headD = roundedPolygon([P(26, -34), P(34, -40), P(46, -30), P(44, -26), P(32, -26)], 2);
  const legs =
    poly([P(18, 2), P(38, 22), P(52, 28)], false) + poly([P(14, 6), P(28, 28), P(40, 38)], false) +
    poly([P(-22, 4), P(-40, 18), P(-52, 36)], false) + poly([P(-18, 6), P(-30, 26), P(-44, 40)], false);
  const antlers = poly([P(30, -36), P(26, -50), P(20, -56)], false) + poly([P(26, -48), P(34, -56)], false) + poly([P(28, -42), P(18, -46)], false);
  const tail = poly([P(-30, -4), P(-38, -12)], false);
  return fill(body + neck + headD, K) + stroke(legs, K, 5.5, { cap: 'round' }) + stroke(antlers + tail, K, 3.2, { cap: 'round' });
};

// ---------- priority ----------
function octPoints(cx, cy, apothem) {
  const R = apothem / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = -Math.PI / 2 - Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
}
const distancePlate = (label) =>
  `<rect x="44.6" y="206.6" width="110.8" height="56.8" rx="8" fill="${W}" stroke="${C.outline}" stroke-width="1.2"/>` +
  `<rect x="49" y="211" width="102" height="48" rx="5" fill="none" stroke="${K}" stroke-width="4"/>` +
  text(label, { cx: 100, y: 245, cap: 20, weight: 800, maxWidth: 84 });
const stopAhead = () => {
  const t = triangleFrame({ up: false });
  const oct = fill(roundedPolygon(octPoints(100, 76, 27), 2.5), C.red) + text('DUR', { cx: 100, y: 83, cap: 14, weight: 800, track: 1.5, color: W });
  return compose({ w: 200, h: 266, before: t.before, after: '' }, oct + distancePlate('100 m'));
};

// ---------- boards: chevrons and hazard markers ----------
const chevronBoard = () => {
  const w = 300;
  const h = 150;
  const fr = rectFrame({ w, h, color: W, r: 12 });
  let d = '';
  for (let i = 0; i < 3; i++) {
    const x = 52 + i * 74;
    d += poly([[x, 75], [x + 44, 26], [x + 74, 26], [x + 30, 75], [x + 74, 124], [x + 44, 124]]);
  }
  return compose(fr, fill(d, K));
};
// Clip a convex polygon to an axis-aligned box (Sutherland-Hodgman).
function clipBox(pts, x0, y0, x1, y1) {
  const edges = [
    (p) => p[0] >= x0, (p) => p[0] <= x1, (p) => p[1] >= y0, (p) => p[1] <= y1,
  ];
  const cut = [
    (a, b) => { const t = (x0 - a[0]) / (b[0] - a[0]); return [x0, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (x1 - a[0]) / (b[0] - a[0]); return [x1, a[1] + t * (b[1] - a[1])]; },
    (a, b) => { const t = (y0 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y0]; },
    (a, b) => { const t = (y1 - a[1]) / (b[1] - a[1]); return [a[0] + t * (b[0] - a[0]), y1]; },
  ];
  let out = pts;
  for (let e = 0; e < 4; e++) {
    const inp = out;
    out = [];
    for (let i = 0; i < inp.length; i++) {
      const a = inp[i];
      const b = inp[(i + 1) % inp.length];
      const ia = edges[e](a);
      const ib = edges[e](b);
      if (ia) out.push(a);
      if (ia !== ib) out.push(cut[e](a, b));
    }
    if (!out.length) break;
  }
  return out;
}
// Tall hazard marker; stripes slope down towards the side on which you pass.
const hazardMarker = () => {
  const w = 100;
  const h = 200;
  const fr = rectFrame({ w, h, color: W, r: 10 });
  const x0 = 12, y0 = 12, x1 = w - 12, y1 = h - 12;
  const step = 34;
  const band = 17;
  let d = '';
  // each stripe runs from upper right to lower left, so it descends towards the left
  for (let a = y0 - (x1 - x0); a < y1 + 4; a += step) {
    const s = [[x0, a + (x1 - x0)], [x1, a], [x1, a + band], [x0, a + band + (x1 - x0)]];
    const cpts = clipBox(s, x0, y0, x1, y1);
    if (cpts.length > 2) d += poly(cpts);
  }
  const border = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" stroke="${K}" stroke-width="3"/>`;
  return compose(fr, fill(d, K) + border);
};
const flipBoard = (svg, w) => svg.replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/, (_, a, body, c) => `${a}<g transform="matrix(-1 0 0 1 ${w} 0)">${body}</g>${c}`);

export const SIGNS = {
  // junctions
  'warning/staggered-junction--right-first': () => tri(mirror(staggered)),
  'warning/junction-on-bend--left-outside': () => tri(jbOutside),
  'warning/junction-on-bend--left-inside': () => tri(jbInside),
  'warning/junction-on-bend--right-outside': () => tri(mirror(jbOutside)),
  'warning/junction-on-bend--right-inside': () => tri(mirror(jbInside)),
  'warning/side-road-angled--left': () => tri(angled),
  'warning/side-road-angled--right': () => tri(mirror(angled)),
  // traffic
  'warning/two-way-traffic-crossing': () => tri(twoWayCrossing()),
  'warning/dual-carriageway-ends': () => tri(dualEnds()),
  'warning/lane-ends--right': () => tri(laneEnds()),
  'warning/lane-ends--left': () => tri(mirror(laneEnds())),
  'warning/traffic-queues': () => tri(queues()),
  // surface and surroundings
  'warning/loose-chippings': () => tri(looseChippings()),
  'warning/soft-verges': () => tri(mirror(softVerge())), // near-side (left) verge
  'warning/cross-wind': () => tri(windsock()),
  'warning/tunnel': () => tri(tunnel()),
  'warning/hump-bridge': () => tri(humpBridge()),
  'warning/quayside': () => tri(quayside()),
  'warning/ice': () => tri(snowflake()),
  'warning/low-flying-aircraft': () => tri(aircraft()),
  // people and animals
  'warning/pedestrians': () => tri(walker(100, 160, 84, K)),
  'warning/elderly-people': () => tri(elderly()),
  'warning/school-crossing': () =>
    tri(walker(86, 146, 56, K, { flip: true, child: true }) + walker(116, 146, 44, K, { flip: true, child: true }) + stripes(152)),
  'warning/wild-animals': () => tri(deer()),
  // temporary boards
  'warning/sharp-deviation--left': () => chevronBoard(),
  'warning/sharp-deviation--right': () => flipBoard(chevronBoard(), 300),
  'warning/hazard-marker--pass-left': () => hazardMarker(),
  'warning/hazard-marker--pass-right': () => flipBoard(hazardMarker(), 100),
  // priority
  'priority/stop-ahead': () => stopAhead(),
};
