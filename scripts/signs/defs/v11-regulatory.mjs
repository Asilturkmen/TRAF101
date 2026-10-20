// v1.1 regulatory set (artist B): further prohibitory, mandatory and information signs,
// and the additional plates (ek levhalar). Same frames, palette and stroke weights as signs.mjs.
// KKTC drives on the left: the nearside lane is the left-hand one.
import {
  C, G, n, poly, fill, stroke, circle, ring, rect, group, roundedPolygon, text, textWidth, head, arrow,
  walker, bicycle, lorrySide, busSide, carSide, motorcycle,
  compose, ringFrame, endFrame, discFrame, rectFrame, RING,
} from '../lib.mjs';

const K = C.black;
const W = C.white;
const prohib = (p, opt) => compose(ringFrame(opt), p);
const blue = (p) => compose(discFrame(), p);
const info = (p, opt) => compose(rectFrame(opt), p);
const mirror = (body, w = 200) => group(`matrix(-1 0 0 1 ${w} 0)`, body);
const speed = (v, color = K) => text(String(v), { cx: 100, y: 133, cap: 66, weight: 800, maxWidth: 124, track: 2, color });
const A = { shaft: 22, len: 38, width: 56, color: W };
const servicePanel = (p) => rect(30, 30, 140, 140, 8, W) + p; // white panel on blue, as the petrol station sign
const edgeAttrs = `stroke="${C.outline}" stroke-width="${G.edge}"`;
const svgDoc = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(w)} ${n(h)}">${body}</svg>`;
const inner = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

// Red diagonal bar across a blue disc, same geometry as the prohibitory bar.
const discBar = () => {
  const k = Math.SQRT1_2 * (RING.r - G.rim - G.ringWidth + 2);
  return stroke(`M${n(100 - k)} ${n(100 - k)}L${n(100 + k)} ${n(100 + k)}`, C.red, G.bar);
};
// Red cancelling bar of a blue panel (as on the town-end sign), lower left to upper right.
const panelBar = (w, h, inset = 30) => stroke(`M${inset} ${h - inset}L${w - inset} ${inset}`, C.red, 10, { cap: 'round' });

// ---------- small pictograms ----------
const wheel = (c, r, color, bg, k = 1) => `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}" fill="${color}" stroke="${bg}" stroke-width="${n(3 * k)}"/>`;

// Tractor, side view facing left, ground at y.
function tractor(x, y, k, color, bg = W) {
  const P = (px, py) => [x + px * k, y + py * k];
  const hood = roundedPolygon([P(-46, -36), P(0, -36), P(0, -14), P(-46, -14)], 3 * k);
  const body = roundedPolygon([P(-2, -48), P(42, -48), P(42, -34), P(-2, -34)], 2 * k);
  const cab = stroke(poly([P(4, -48), P(8, -80), P(38, -80), P(38, -48)], false), color, 5 * k);
  const roof = roundedPolygon([P(2, -86), P(42, -86), P(42, -78), P(2, -78)], 2 * k);
  const pipe = stroke(poly([P(-28, -36), P(-28, -54)], false), color, 4.5 * k, { cap: 'round' });
  const rw = P(20, -24);
  const fw = P(-32, -12);
  return (
    fill(hood + body + roof, color) + cab + pipe +
    wheel(rw, 24 * k, color, bg, k) + circle(rw[0], rw[1], 8 * k, bg) + circle(rw[0], rw[1], 3.5 * k, color) +
    wheel(fw, 12 * k, color, bg, k) + circle(fw[0], fw[1], 4 * k, bg)
  );
}

// Horse, side view facing left, hooves at y.
function horse(x, y, k, color) {
  const P = (px, py) => [x + px * k, y + py * k];
  const body = roundedPolygon([P(-24, -50), P(22, -50), P(30, -44), P(30, -32), P(24, -28), P(-22, -28), P(-28, -36)], 7 * k);
  const neck = roundedPolygon([P(-12, -50), P(-26, -72), P(-33, -80), P(-40, -79), P(-54, -62), P(-52, -56), P(-46, -56), P(-38, -64), P(-28, -34)], 3 * k);
  const ear = poly([P(-34, -78), P(-31, -88), P(-27, -77)]);
  const legs =
    poly([P(-22, -32), P(-26, -16), P(-24, 0)], false) + poly([P(-14, -32), P(-12, -16), P(-14, 0)], false) +
    poly([P(18, -32), P(14, -16), P(16, 0)], false) + poly([P(26, -34), P(28, -16), P(26, 0)], false);
  const tail = poly([P(29, -46), P(36, -38), P(38, -22)], false);
  return fill(body, color) + fill(neck, color) + fill(ear, color) + stroke(legs, color, 5.5 * k, { cap: 'round' }) + stroke(tail, color, 5 * k, { cap: 'round' });
}

// Two-wheeled cart drawn by an animal (shafts to the left), wheel bottom at y.
function cart(x, y, k, color, bg = W) {
  const P = (px, py) => [x + px * k, y + py * k];
  const box = roundedPolygon([P(-14, -46), P(26, -46), P(26, -28), P(-14, -28)], 2 * k);
  const c = P(8, -16);
  return fill(box, color) + stroke(poly([P(-14, -38), P(-46, -42)], false), color, 4 * k, { cap: 'round' }) + wheel(c, 16 * k, color, bg, k) + circle(c[0], c[1], 5 * k, bg);
}

// Caravan trailer with its drawbar to the left, wheel bottom at y.
function caravan(x, y, k, color, bg = W) {
  const P = (px, py) => [x + px * k, y + py * k];
  const box = roundedPolygon([P(0, -50), P(44, -50), P(48, -42), P(48, -12), P(0, -12)], 6 * k);
  const win = roundedPolygon([P(8, -42), P(22, -42), P(22, -30), P(8, -30)], 1.5 * k);
  return fill(box, color) + fill(win, bg) + stroke(poly([P(0, -16), P(-12, -16)], false), color, 4 * k) + wheel(P(26, -9), 9 * k, color, bg, k);
}

// Hand cart: open box on one wheel with handles, side view, ground at y.
function handcart(x, y, k, color, bg = W) {
  const P = (px, py) => [x + px * k, y + py * k];
  const box = roundedPolygon([P(-40, -54), P(18, -54), P(12, -26), P(-34, -26)], 3 * k);
  const handles = poly([P(14, -44), P(46, -66)], false);
  const leg = poly([P(-30, -26), P(-32, 0)], false);
  const c = P(-6, -18);
  return fill(box, color) + stroke(handles + leg, color, 5 * k, { cap: 'round' }) + wheel(c, 18 * k, color, bg, k) + circle(c[0], c[1], 6 * k, bg);
}

// Moped: bicycle frame with a small engine block and fuel tank.
function moped(x, y, k, color, bg = W) {
  const P = (px, py) => [x + px * k, y + py * k];
  const engine = roundedPolygon([P(-14, -4), P(6, -4), P(6, 12), P(-14, 12)], 3 * k);
  const tank = roundedPolygon([P(-2, -20), P(16, -20), P(14, -10), P(0, -10)], 3 * k);
  return bicycle(x, y, k, color) + `<path fill="${color}" stroke="${bg}" stroke-width="${n(2.5 * k)}" d="${engine}"/>` + fill(tank, color);
}

// Axle seen from behind: two pairs of tyres on a bar.
function axle(cx, cy, color) {
  const tyre = (x) => roundedPolygon([[x - 9, cy - 20], [x + 9, cy - 20], [x + 9, cy + 20], [x - 9, cy + 20]], 5);
  return stroke(`M${cx - 40} ${cy}H${cx + 40}`, color, 8) + fill(tyre(cx - 50) + tyre(cx - 29) + tyre(cx + 29) + tyre(cx + 50), color);
}

// Bus seen from the front, bottom centre at (x, y).
function busFront(x, y, k, color, bg) {
  const P = (px, py) => [x + px * k, y + py * k];
  return (
    fill(roundedPolygon([P(-26, -84), P(26, -84), P(26, -10), P(-26, -10)], 7 * k), color) +
    fill(roundedPolygon([P(-24, -12), P(-12, -12), P(-12, 0), P(-24, 0)], 2 * k) + roundedPolygon([P(12, -12), P(24, -12), P(24, 0), P(12, 0)], 2 * k), color) +
    fill(roundedPolygon([P(-21, -68), P(21, -68), P(21, -38), P(-21, -38)], 2 * k) + roundedPolygon([P(-17, -79), P(17, -79), P(17, -73), P(-17, -73)], 1 * k), bg) +
    circle(...P(-15, -23), 5 * k, bg) + circle(...P(15, -23), 5 * k, bg)
  );
}

// Wheelchair symbol, wheel centre near (x, y), size factor k.
function wheelchair(x, y, k, color) {
  const P = (px, py) => [x + px * k, y + py * k];
  const body = poly([P(-8, -36), P(-6, -6), P(18, -6), P(26, 20), P(36, 20)], false);
  const arm = poly([P(-7, -26), P(12, -26)], false);
  const r = 24 * k;
  const c = P(-4, 14);
  const a0 = (-60 * Math.PI) / 180;
  const a1 = (210 * Math.PI) / 180;
  const p0 = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)];
  const p1 = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)];
  const arc = `M${n(p0[0])} ${n(p0[1])}A${n(r)} ${n(r)} 0 1 1 ${n(p1[0])} ${n(p1[1])}`;
  return stroke(body + arm, color, 9 * k, { cap: 'round' }) + stroke(arc, color, 7 * k, { cap: 'round' }) + circle(...P(-10, -50), 9 * k, color);
}

// Desk telephone.
function telephone(cx, cy, k, color, bg) {
  const P = (px, py) => [cx + px * k, cy + py * k];
  const base = roundedPolygon([P(-40, -2), P(40, -2), P(48, 32), P(-48, 32)], 6 * k);
  const grip = `M${P(-38, -16).map(n).join(' ')}Q${P(0, -42).map(n).join(' ')} ${P(38, -16).map(n).join(' ')}`;
  const ends = roundedPolygon([P(-58, -20), P(-36, -30), P(-28, -10), P(-50, 0)], 5 * k) + roundedPolygon([P(36, -30), P(58, -20), P(50, 0), P(28, -10)], 5 * k);
  return fill(base + ends, color) + stroke(grip, color, 13 * k, { cap: 'round' }) + ring(...P(0, 16), 9 * k, bg, 4 * k);
}

// Bed with a sleeper (hotel).
function bed() {
  return (
    rect(40, 66, 11, 96, 2, K) + rect(51, 124, 109, 14, 2, K) + rect(149, 112, 11, 50, 2, K) +
    circle(70, 108, 11, K) + fill(roundedPolygon([[86, 100], [146, 100], [146, 122], [86, 122]], 5), K)
  );
}

// Fork and knife (restaurant).
function cutlery() {
  let tines = '';
  for (let i = 0; i < 4; i++) tines += roundedPolygon([[60 + i * 9, 50], [65 + i * 9, 50], [65 + i * 9, 92], [60 + i * 9, 92]], 2);
  const forkHead = roundedPolygon([[58, 86], [92, 86], [85, 106], [65, 106]], 4);
  const forkHandle = roundedPolygon([[70, 100], [80, 100], [79, 158], [71, 158]], 4);
  const blade = 'M116 48C136 56 142 88 132 108H116Z';
  const knifeHandle = roundedPolygon([[116, 104], [130, 104], [129, 158], [117, 158]], 4);
  return fill(tines + forkHead + forkHandle + knifeHandle + blade, K);
}

// Picnic table with benches, side view.
const picnicTable = () => rect(44, 80, 112, 12, 2, K) + rect(30, 118, 140, 10, 2, K) + stroke('M74 90L126 158M126 90L74 158', K, 9, { cap: 'round' });

const tent = () =>
  fill(roundedPolygon([[100, 56], [160, 150], [40, 150]], 4), K) + fill(poly([[100, 98], [126, 152], [74, 152]]), W) +
  stroke('M100 42V62', K, 6, { cap: 'round' }) + rect(32, 148, 136, 8, 2, K);

const spanner = () =>
  group('rotate(45 100 104)', rect(91, 76, 18, 76, 7, K) + circle(100, 62, 26, K) + circle(100, 152, 15, K) + rect(91, 30, 18, 34, 2, W) + circle(100, 152, 6, W));

function airplane() {
  const fus = roundedPolygon([[94, 44], [106, 44], [107, 150], [93, 150]], 6) + roundedPolygon([[95, 36], [105, 36], [106, 60], [94, 60]], 5);
  const wings = poly([[100, 80], [164, 112], [164, 124], [100, 108], [36, 124], [36, 112]]);
  const tail = poly([[100, 136], [126, 150], [126, 158], [100, 152], [74, 158], [74, 150]]);
  return group('rotate(45 100 100)', fill(fus + wings + tail, K));
}

const infoLetter = () => circle(100, 58, 14, K) + rect(87, 82, 26, 66, 3, K) + rect(74, 82, 39, 13, 2, K) + rect(72, 140, 56, 12, 2, K);

// Staircase from (x0, y0) to (x1, y1), filled down to the floor line.
function stairs(x0, y0, x1, y1, count, color, floor = y0) {
  const pts = [[x0, floor], [x0, y0]];
  const dx = (x1 - x0) / count;
  const dy = (y1 - y0) / count;
  for (let i = 0; i < count; i++) pts.push([x0 + i * dx, y0 + (i + 1) * dy], [x0 + (i + 1) * dx, y0 + (i + 1) * dy]);
  pts.push([x1, floor]);
  return fill(poly(pts), color);
}

// House with a door; (x, y) is the lower left corner.
function house(x, y, w, color, bg) {
  const h = w * 0.9;
  return fill(poly([[x, y - h * 0.55], [x + w / 2, y - h], [x + w, y - h * 0.55], [x + w, y], [x, y]]), color) + rect(x + w * 0.4, y - h * 0.34, w * 0.22, h * 0.34, 0, bg);
}

// ---------- zone panels (prohibitory) ----------
// White panel with a black border; the disc at the top and the word BÖLGE below.
const ZONE = { w: 200, h: 244 };
function zonePanel(disc, { end = false } = {}) {
  const { w, h } = ZONE;
  const e = G.edge / 2;
  const tone = end ? C.faded : K;
  let body =
    `<rect x="${n(e)}" y="${n(e)}" width="${n(w - 2 * e)}" height="${n(h - 2 * e)}" rx="10" fill="${W}" ${edgeAttrs}/>` +
    `<rect x="7" y="7" width="${w - 14}" height="${h - 14}" rx="6" fill="none" stroke="${tone}" stroke-width="4"/>` +
    group('translate(32 18) scale(0.68)', disc) +
    text('BÖLGE', { cx: 100, y: 212, cap: 34, weight: 800, track: 2, color: tone });
  if (end) {
    const lines = [];
    for (let i = -2; i <= 2; i++) {
      const o = i * 9 * Math.SQRT1_2;
      lines.push(`M${n(26 + o)} ${n(h - 26 + o)}L${n(w - 26 + o)} ${n(26 + o)}`);
    }
    body += stroke(lines.join(''), K, 3.2);
  }
  return svgDoc(w, h, body);
}
// Prohibitory disc drawn in grey, for the end-of-zone panels.
function fadedDisc(picto, { bar = false } = {}) {
  const redR = RING.r - G.rim;
  const inR = redR - G.ringWidth;
  const k = Math.SQRT1_2 * (inR + 2);
  return (
    circle(100, 100, RING.r, W) + picto +
    (bar ? stroke(`M${n(100 - k)} ${n(100 - k)}L${n(100 + k)} ${n(100 + k)}`, C.faded, G.bar) : '') +
    ring(100, 100, redR - G.ringWidth / 2, C.faded, G.ringWidth)
  );
}

// ---------- additional plates ----------
// White plate with a black border. Height is always 100; the width follows the content.
const PH = 100;
function plate(w, body) {
  const e = G.edge / 2;
  return svgDoc(
    w,
    PH,
    `<rect x="${n(e)}" y="${n(e)}" width="${n(w - 2 * e)}" height="${n(PH - 2 * e)}" rx="8" fill="${W}" ${edgeAttrs}/>` +
      `<rect x="5" y="5" width="${w - 10}" height="${PH - 10}" rx="5" fill="none" stroke="${K}" stroke-width="4"/>` +
      body,
  );
}
const PT = { cap: 36, weight: 800 }; // plate lettering
const plateText = (str, w, opt = {}) => text(str, { cx: w / 2, y: 68, ...PT, maxWidth: w - 36, ...opt });
const PA = { shaft: 9, len: 22, width: 28, color: K }; // plate arrows
function vArrowPlate(kind) {
  const w = 140;
  if (kind === 'start') return plate(w, rect(44, 78, 52, 8, 1, K) + arrow([70, 80], [70, 16], PA));
  if (kind === 'end') return plate(w, rect(44, 78, 52, 8, 1, K) + arrow([70, 16], [70, 78], PA));
  return plate(w, arrow([70, 50], [70, 15], PA) + arrow([70, 50], [70, 85], PA));
}
function hArrowPlate(kind) {
  const w = 200;
  if (kind === 'left') return plate(w, arrow([164, 50], [36, 50], PA));
  if (kind === 'right') return plate(w, arrow([36, 50], [164, 50], PA));
  return plate(w, arrow([100, 50], [34, 50], PA) + arrow([100, 50], [166, 50], PA));
}
// Junction diagram: thick line = priority road (comes from below and turns left), thin lines = other roads.
const priorityDirection = () => stroke('M76 90V48H18', K, 11) + stroke('M76 48V12M76 48H122', K, 4);
function timeWindow() {
  const w = 300;
  const cap = 28;
  const wa = textWidth('08.00', { cap, weight: 800 });
  const gap = 34;
  const x0 = (w - (wa * 2 + gap)) / 2;
  return plate(
    w,
    text('08.00', { cx: x0 + wa / 2, y: 66, cap, weight: 800 }) + rect(x0 + wa + 9, 49, gap - 18, 6, 1, K) + text('18.00', { cx: x0 + wa + gap + wa / 2, y: 66, cap, weight: 800 }),
  );
}
const sectionLength = () => plate(200, arrow([40, 50], [40, 14], PA) + arrow([40, 50], [40, 86], PA) + text('2 km', { cx: 120, y: 68, ...PT, maxWidth: 120 }));

// ---------- information panels ----------
function oneWayPanel(dir) {
  const w = 300;
  const body = arrow([262, 60], [36, 60], { shaft: 26, len: 46, width: 64, color: W });
  return compose(rectFrame({ w, h: 120, r: 12 }), dir === 'left' ? body : mirror(body, w));
}
function directionPanel() {
  const w = 320;
  const h = 160;
  const border = `<rect x="12" y="12" width="${w - 24}" height="${h - 24}" rx="6" fill="none" stroke="${W}" stroke-width="4"/>`;
  const cap = 30;
  const left = (str, y) => text(str, { cx: 96 + textWidth(str, { cap, weight: 700, track: 2 }) / 2, y, cap, weight: 700, track: 2, color: W });
  const a = { shaft: 9, len: 20, width: 26, color: W };
  return compose(rectFrame({ w, h, r: 12 }), border + arrow([80, 55], [32, 55], a) + left('GİRNE', 70) + arrow([56, 128], [56, 88], a) + left('LEFKOŞA', 122));
}
function streetName() {
  const w = 360;
  const h = 90;
  const e = G.edge / 2;
  return svgDoc(
    w,
    h,
    `<rect x="${n(e)}" y="${n(e)}" width="${n(w - 2 * e)}" height="${n(h - 2 * e)}" rx="8" fill="${W}" ${edgeAttrs}/>` +
      rect(G.rim, G.rim, w - 2 * G.rim, h - 2 * G.rim, 5, C.yellow) +
      `<rect x="11" y="11" width="${w - 22}" height="${h - 22}" rx="3" fill="none" stroke="${K}" stroke-width="3"/>` +
      text('ARASTA SOKAK', { cx: w / 2, y: 59, cap: 28, weight: 800, track: 2, maxWidth: w - 44 }),
  );
}
const deadEndSide = () => rect(112, 24, 40, 152, 0, W) + rect(60, 82, 52, 38, 0, W) + rect(26, 64, 34, 74, 0, C.red);
const busLane = (end) =>
  info(stroke('M104 20V180', W, 6) + busFront(58, 150, 1.05, W, C.blue) + arrow([148, 168], [148, 40], { shaft: 18, len: 32, width: 44, color: W }) + (end ? panelBar(200, 200) : ''));
const homeZone = (end) =>
  info(
    house(28, 100, 64, W, C.blue) + walker(126, 110, 70, W) + walker(158, 110, 46, W, { flip: true, child: true }) + circle(143, 105, 6, W) +
      carSide(100, 172, 0.92, W, C.blue) + (end ? panelBar(200, 200) : ''),
  );
const overpass = () => info(stairs(34, 168, 84, 108, 5, W) + rect(84, 108, 82, 10, 0, W) + rect(150, 118, 10, 50, 0, W) + walker(124, 106, 64, W));
const underpass = () => info(rect(22, 50, 156, 12, 0, W) + stairs(34, 62, 84, 156, 5, W, 166) + rect(84, 156, 82, 10, 0, W) + walker(128, 154, 72, W));
const lengthLimit = () =>
  text('10m', { cx: 100, y: 82, cap: 26, weight: 800 }) + lorrySide(100, 128, 0.7, K) +
  stroke('M70 140H130', K, 4) + head([60, 140], [-1, 0], 12, 14, K) + head([140, 140], [1, 0], 12, 14, K);
const horseRider = () =>
  horse(104, 160, 1.15, W) +
  stroke(poly([[100, 92], [96, 70]], false), W, 12, { cap: 'round' }) + circle(94, 56, 8.5, W) +
  stroke(poly([[96, 74], [82, 86]], false) + poly([[100, 92], [104, 112]], false), W, 6, { cap: 'round' });

export const SIGNS = {
  // ---------------- prohibitory ----------------
  'prohibitory/no-goods-vehicles-over-weight': () => prohib(lorrySide(100, 106, 0.78, K) + text('7,5t', { cx: 100, y: 146, cap: 26, weight: 800 })),
  'prohibitory/axle-weight-limit': () => prohib(text('8t', { cx: 100, y: 100, cap: 42, weight: 800, track: 1 }) + axle(100, 132, K)),
  'prohibitory/length-limit': () => prohib(lengthLimit()),
  'prohibitory/no-towed-caravans': () => prohib(carSide(75, 120, 0.72, K) + caravan(118, 120, 0.86, K)),
  'prohibitory/no-hand-carts': () => prohib(handcart(98, 140, 1.05, K)),
  'prohibitory/no-buses': () => prohib(busSide(100, 128, 0.98, K, W)),
  'prohibitory/no-tractors': () => prohib(tractor(100, 142, 1.0, K)),
  'prohibitory/no-animal-drawn-vehicles': () => prohib(horse(84, 140, 0.9, K) + cart(134, 140, 0.92, K)),
  'prohibitory/no-mopeds': () => prohib(moped(100, 98, 1.08, K)),
  'prohibitory/no-motor-vehicles-except-motorcycles': () => prohib(carSide(100, 126, 1.1, K)),
  'prohibitory/speed-limit--10': () => prohib(speed(10)),
  'prohibitory/speed-limit--90': () => prohib(speed(90)),
  'prohibitory/end-of-speed-limit--20': () => compose(endFrame(), speed(20, C.faded)),
  'prohibitory/end-of-speed-limit--30': () => compose(endFrame(), speed(30, C.faded)),
  'prohibitory/end-of-speed-limit--65': () => compose(endFrame(), speed(65, C.faded)),
  'prohibitory/end-of-speed-limit--80': () => compose(endFrame(), speed(80, C.faded)),
  'prohibitory/speed-limit-zone--20': () => zonePanel(inner(prohib(speed(20)))),
  'prohibitory/end-of-speed-limit-zone--20': () => zonePanel(fadedDisc(speed(20, C.faded)), { end: true }),
  'prohibitory/no-parking-zone': () => zonePanel(inner(prohib('', { bar: true, field: C.blue }))),
  'prohibitory/end-of-no-parking-zone': () => zonePanel(fadedDisc('', { bar: true }), { end: true }),

  // ---------------- mandatory ----------------
  'mandatory/turn-left-or-right': () =>
    blue(stroke('M100 170V90', W, A.shaft) + stroke('M70 100H130', W, A.shaft) + head([34, 100], [-1, 0], A.len, A.width, W) + head([166, 100], [1, 0], A.len, A.width, W)),
  'mandatory/buses-only': () => blue(busSide(100, 128, 1.0, W, C.blue)),
  'mandatory/shared-path': () => blue(walker(100, 94, 66, W) + stroke('M26 104H174', W, 5) + bicycle(100, 140, 0.9, W)),
  'mandatory/segregated-path': () => blue(stroke('M100 6V194', W, 5) + bicycle(54, 104, 0.74, W) + walker(146, 144, 84, W)),
  'mandatory/minimum-speed--30': () => blue(speed(30, W)),
  'mandatory/end-of-minimum-speed--30': () => blue(speed(30, W) + discBar()),
  'mandatory/horse-riders': () => blue(horseRider()),

  // ---------------- information ----------------
  'information/information-point': () => info(servicePanel(infoLetter())),
  'information/telephone': () => info(servicePanel(telephone(100, 104, 1, K, W))),
  'information/emergency-telephone': () => info(servicePanel(telephone(100, 86, 0.82, K, W) + text('SOS', { cx: 100, y: 156, cap: 26, weight: 800, track: 2 }))),
  'information/hotel': () => info(servicePanel(bed())),
  'information/restaurant': () => info(servicePanel(cutlery())),
  'information/toilets': () => info(servicePanel(text('WC', { cx: 100, y: 130, cap: 60, weight: 800, track: 2 }))),
  'information/picnic-area': () => info(servicePanel(picnicTable())),
  'information/camping-site': () => info(servicePanel(tent())),
  'information/car-repair': () => info(servicePanel(spanner())),
  'information/airport': () => info(servicePanel(airplane())),
  'information/disabled-parking': () => info(text('P', { cx: 58, y: 150, cap: 100, weight: 800, color: W }) + wheelchair(136, 112, 1.22, W)),
  'information/bus-lane': () => busLane(false),
  'information/end-of-bus-lane': () => busLane(true),
  'information/pedestrian-overpass': () => overpass(),
  'information/pedestrian-underpass': () => underpass(),
  'information/one-way-street--left': () => oneWayPanel('left'),
  'information/one-way-street--right': () => oneWayPanel('right'),
  'information/dead-end--left': () => info(deadEndSide()),
  'information/dead-end--right': () => info(mirror(deadEndSide())),
  'information/recommended-speed--50': () => info(speed(50, W)),
  'information/home-zone': () => homeZone(false),
  'information/end-of-home-zone': () => homeZone(true),
  'information/direction-sign': () => directionPanel(),
  'information/street-name': () => streetName(),

  // ---------------- additional plates ----------------
  'additional/distance': () => plate(200, plateText('100 m', 200)),
  'additional/section-length': () => sectionLength(),
  'additional/restriction-start': () => vArrowPlate('start'),
  'additional/restriction-continues': () => vArrowPlate('continue'),
  'additional/restriction-end': () => vArrowPlate('end'),
  'additional/direction--left': () => hArrowPlate('left'),
  'additional/direction--right': () => hArrowPlate('right'),
  'additional/direction--both': () => hArrowPlate('both'),
  'additional/time-window': () => timeWindow(),
  'additional/vehicle--lorry': () => plate(200, lorrySide(100, 82, 1.0, K)),
  'additional/vehicle--bus': () => plate(200, busSide(100, 80, 0.98, K, W)),
  'additional/vehicle--motorcycle': () => plate(200, group('translate(100 90) scale(0.98) translate(-100 -140)', motorcycle(100, 140, 1, K))),
  'additional/slow': () => plate(240, plateText('YAVAŞ', 240, { cap: 40, track: 4 })),
  'additional/weight': () => plate(200, plateText('7,5t', 200, { cap: 40 })),
  'additional/priority-road-direction--left': () => plate(140, priorityDirection()),
  'additional/priority-road-direction--right': () => plate(140, mirror(priorityDirection(), 140)),
};
