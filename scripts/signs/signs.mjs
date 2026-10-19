// Pictogram definitions. Key = public/signs/<category>/<file>.svg (without extension).
// KKTC drives on the left: roundabouts run clockwise, overtaking happens on the right,
// your own lane is the left-hand one in two-way pictograms.
import {
  C, G, n, poly, fill, stroke, circle, rect, group, roundedPolygon, text, head, arrow, pathArrow,
  walker, bicycle, carRear, lorryRear, carSide, lorrySide, busSide, motorcycle,
  compose, triangleFrame, ringFrame, endFrame, discFrame, redDiscFrame, octagonFrame, rectFrame, diamondFrame,
} from './lib.mjs';

const K = C.black;
const W = C.white;
const tri = (p) => compose(triangleFrame(), p);
const prohib = (p, opt) => compose(ringFrame(opt), p);
const blue = (p) => compose(discFrame(), p);
const info = (p, opt) => compose(rectFrame(opt), p);
const mirror = (body) => group('matrix(-1 0 0 1 200 0)', body);

// ---------- warning pictograms ----------
const road = (d, w = G.road) => stroke(d, K, w);
const bend = road('M111 162V124C111 104 100 94 82 90');
const doubleBend = road('M114 162V150C114 134 88 136 88 118C88 102 112 102 112 86');
const narrowsL = 'M76 162V140L90 118V86';
const straightR = 'M124 162V86';
const roundaboutArrows = (cx, cy, R, w, color, hl, hw) => {
  let out = '';
  for (let i = 0; i < 3; i++) {
    const a0 = (-80 + i * 120) * (Math.PI / 180);
    const a1 = a0 + (72 * Math.PI) / 180;
    const p0 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)];
    const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)];
    const tipA = a1 + hl / R;
    const tip = [cx + R * Math.cos(tipA), cy + R * Math.sin(tipA)];
    const dir = [-Math.sin(tipA - hl / (2 * R)), Math.cos(tipA - hl / (2 * R))];
    out += stroke(`M${n(p0[0])} ${n(p0[1])}A${R} ${R} 0 0 1 ${n(p1[0])} ${n(p1[1])}`, color, w) + head(tip, dir, hl, hw, color);
  }
  return out;
};
const hump = (bumps) => {
  if (bumps === 1) return fill('M50 160V150H68C80 150 82 120 100 120C118 120 120 150 132 150H150V160Z', K);
  return fill('M50 160V150H56C64 150 66 124 77 124C88 124 90 150 100 150C110 150 112 124 123 124C134 124 136 150 144 150H150V160Z', K);
};
const hill = (descent) => {
  const wedge = fill('M46 160H154L64 128Z', K);
  return descent ? wedge + text('10%', { cx: 112, y: 132, cap: 18, weight: 800 }) : mirror(wedge) + text('10%', { cx: 88, y: 132, cap: 18, weight: 800 });
};
const cow = (x, y, k) => {
  const P = (px, py) => [x + px * k, y + py * k];
  const body = roundedPolygon([P(-27, -44), P(28, -42), P(33, -34), P(32, -18), P(-24, -18), P(-29, -30)], 7 * k);
  const head = roundedPolygon([P(-26, -44), P(-38, -46), P(-46, -44), P(-54, -30), P(-52, -25), P(-45, -24), P(-32, -30), P(-26, -26)], 2.5 * k);
  const legs = [-21, -12, 19, 27].map((lx) => poly([P(lx - 3, -22), P(lx + 3, -22), P(lx + 2.5, 0), P(lx - 2.5, 0)])).join('');
  const udder = roundedPolygon([P(8, -20), P(16, -20), P(15, -13), P(9, -13)], 2 * k);
  return (
    fill(body + head + legs + udder, K) +
    stroke(poly([P(-38, -45), P(-36, -53), P(-31, -56)], false) + poly([P(31, -38), P(36, -28), P(36, -12)], false), K, 3.2 * k, { cap: 'round' }) +
    stroke(poly([P(-44, -43), P(-50, -47)], false), K, 5 * k, { cap: 'round' })
  );
};
const rocks = () => {
  const cliff = fill('M37 162L71 98H78L84 108L80 122L88 132L84 146L92 154L90 162Z', K);
  const rock = (x, y, s) =>
    roundedPolygon([[x - s, y - s * 0.3], [x - s * 0.2, y - s], [x + s, y - s * 0.6], [x + s * 0.8, y + s * 0.7], [x - s * 0.5, y + s]], s * 0.3);
  return cliff + fill(rock(110, 104, 9) + rock(126, 124, 7.5) + rock(108, 136, 6.5) + rock(124, 154, 6) + rock(142, 156, 5), K);
};
const roadworks = () => {
  const P = (x, y) => [x, y];
  const legs = poly([P(84, 160), P(90, 140), P(96, 122)], false) + poly([P(70, 158), P(78, 140), P(96, 122)], false);
  const torso = poly([P(96, 122), P(108, 96)], false);
  const arms = poly([P(108, 98), P(116, 112), P(124, 116)], false) + poly([P(106, 100), P(102, 116), P(112, 128)], false);
  const shovel = poly([P(126, 104), P(116, 130)], false);
  return (
    stroke(legs + arms, K, 7.5, { cap: 'round' }) +
    stroke(torso, K, 11, { cap: 'round' }) +
    circle(115, 85, 7.5, K) +
    stroke(poly([P(130, 96), P(113, 140)], false), K, 4) +
    fill('M108 136L120 140L116 150L106 147Z', K) +
    fill('M114 162C118 148 130 140 142 142C152 144 160 154 162 162Z', K)
  );
};
const signals = () =>
  rect(86, 72, 28, 88, 6, K) + circle(100, 88, 9.5, C.red) + circle(100, 116, 9.5, C.yellow) + circle(100, 144, 9.5, C.green);
const skid = () => {
  const car = group('rotate(-6 100 112)', carRear(100, 122, 0.95, K));
  const tracks = stroke('M86 124C76 136 100 144 88 160M114 124C104 136 128 144 116 160', K, 4.5, { cap: 'round' });
  return car + tracks;
};
const exclamation = () => fill(roundedPolygon([[92, 70], [108, 70], [104.5, 132], [95.5, 132]], 3), K) + circle(100, 149, 9, K);
const twoWay = () =>
  arrow([88, 162], [88, 86], { shaft: 9, len: 24, width: 24, color: K }) + arrow([112, 86], [112, 162], { shaft: 9, len: 24, width: 24, color: K });

// ---------- shared arrows on blue discs ----------
const A = { shaft: 22, len: 38, width: 56, color: W };
const turnAhead = (dir) => {
  const body = pathArrow('M112 166V112Q112 88 88 88H76', [40, 88], [-1, 0], A);
  return dir === 'left' ? body : mirror(body);
};

// ---------- prohibitory pictograms ----------
const BA = { shaft: 16, len: 30, width: 40, color: K };
const noTurn = (dir) => {
  const body = pathArrow('M114 156V112Q114 92 94 92H86', [56, 92], [-1, 0], BA);
  return dir === 'left' ? body : mirror(body);
};
const uTurn = () => pathArrow('M64 162V102A20 20 0 0 1 104 102V132', [104, 162], [0, 1], { ...BA, width: 36 });
const limitTri = (tip, dir) => {
  const [dx, dy] = dir; // dir points from base to tip
  const base = [tip[0] - dx * 16, tip[1] - dy * 16];
  return fill(poly([tip, [base[0] - dy * 15, base[1] + dx * 15], [base[0] + dy * 15, base[1] - dx * 15]]), K);
};
const horn = () =>
  fill('M58 92H76L124 70V130L76 108H58Z', K) + fill(roundedPolygon([[124, 66], [142, 60], [142, 140], [124, 134]], 3), K) + rect(64, 108, 10, 18, 2, K);
const speed = (v, color = K) => text(String(v), { cx: 100, y: 133, cap: 66, weight: 800, maxWidth: 124, track: 2, color });

// ---------- information pictograms ----------
const camera = () =>
  rect(30, 30, 140, 140, 8, W) +
  fill(roundedPolygon([[48, 66], [124, 66], [124, 136], [48, 136]], 9), K) +
  circle(80, 101, 20, W) + circle(80, 101, 11, K) +
  fill(poly([[124, 76], [152, 70], [152, 132], [124, 126]]), K) +
  stroke('M134 82V120M142 80V122', W, 3);
const pump = () =>
  rect(30, 30, 140, 140, 8, W) +
  fill(roundedPolygon([[58, 50], [112, 50], [112, 150], [58, 150]], 6), K) + rect(50, 144, 70, 10, 2, K) +
  rect(67, 60, 36, 24, 3, W) +
  stroke('M112 96H124Q132 96 132 104V138Q132 146 140 146Q148 146 148 138V78L136 64', K, 6, { cap: 'round' });
const crescent = (cx, cy, r) => {
  // Red crescent opening to the right: outer disc minus an offset inner disc.
  const r2 = r * 0.84;
  const off = r * 0.42;
  const a = (r * r - r2 * r2 + off * off) / (2 * off);
  const h = Math.sqrt(r * r - a * a);
  const top = [cx + a, cy - h];
  const bot = [cx + a, cy + h];
  const large = a > off ? 1 : 0;
  return fill(`M${n(top[0])} ${n(top[1])}A${n(r)} ${n(r)} 0 1 0 ${n(bot[0])} ${n(bot[1])}A${n(r2)} ${n(r2)} 0 ${large} 1 ${n(top[0])} ${n(top[1])}Z`, C.red);
};
const crossingPanel = () =>
  fill(roundedPolygon([[100, 26], [176, 162], [24, 162]], 6), W) +
  fill('M56 146H72V154H56ZM80 146H96V154H80ZM104 146H120V154H104ZM128 146H144V154H128Z', K) +
  walker(100, 140, 82, K);
const townPanel = (name, end) => {
  const w = 320;
  const h = 120;
  const fr = rectFrame({ w, h, r: 12 });
  const border = `<rect x="12" y="12" width="${w - 24}" height="${h - 24}" rx="6" fill="none" stroke="${W}" stroke-width="4"/>`;
  const label = text(name, { cx: w / 2, y: 80, cap: 40, weight: 700, track: 4, color: W });
  const bar = end ? stroke(`M30 ${h - 24}L${w - 30} 24`, C.red, 10, { cap: 'round' }) : '';
  return compose(fr, border + label + bar);
};

export const SIGNS = {
  // ---------------- warning ----------------
  'warning/bend--left': () => tri(bend),
  'warning/bend--right': () => tri(mirror(bend)),
  'warning/double-bend--left-first': () => tri(doubleBend),
  'warning/double-bend--right-first': () => tri(mirror(doubleBend)),
  'warning/crossroads': () => tri(road('M100 162V74') + road('M62 124H138', G.minor)),
  'warning/junction-priority-right': () => tri(stroke('M74 100L126 152M126 100L74 152', K, 15)),
  'warning/side-road--left': () => tri(road('M108 162V74') + road('M108 124H62', G.minor)),
  'warning/side-road--right': () => tri(mirror(road('M108 162V74') + road('M108 124H62', G.minor))),
  'warning/staggered-junction': () => tri(road('M100 162V74') + road('M100 140H56', G.minor) + road('M100 108H130', G.minor)),
  'warning/t-junction': () => tri(road('M62 112H138') + road('M100 162V112', 12)),
  'warning/traffic-merging--left': () => tri(road('M112 162V74') + road('M64 160Q72 134 108 112', 11)),
  'warning/traffic-merging--right': () => tri(mirror(road('M112 162V74') + road('M64 160Q72 134 108 112', 11))),
  'warning/roundabout-ahead': () => tri(roundaboutArrows(100, 124, 27, 9, K, 15, 22)),
  'warning/pedestrian-crossing': () =>
    tri(walker(100, 142, 70, K) + fill('M58 150H74V158H58ZM80 150H96V158H80ZM104 150H120V158H104ZM126 150H142V158H126Z', K)),
  'warning/children': () => tri(walker(86, 160, 68, K, { flip: true, child: true }) + walker(120, 160, 54, K, { flip: true, child: true })),
  'warning/road-narrows--both': () => tri(road(narrowsL, 12) + mirror(road(narrowsL, 12))),
  'warning/road-narrows--left': () => tri(road(narrowsL, 12) + road(straightR, 12)),
  'warning/road-narrows--right': () => tri(mirror(road(narrowsL, 12) + road(straightR, 12))),
  'warning/slippery-road': () => tri(skid()),
  'warning/road-works': () => tri(roadworks()),
  'warning/traffic-signals': () => tri(signals()),
  'warning/two-way-traffic': () => tri(twoWay()),
  'warning/steep-descent': () => tri(hill(true)),
  'warning/steep-ascent': () => tri(hill(false)),
  'warning/uneven-road': () => tri(hump(2)),
  'warning/road-hump': () => tri(hump(1)),
  'warning/falling-rocks': () => tri(rocks()),
  'warning/domestic-animals': () => tri(cow(106, 160, 0.95)),
  'warning/cyclists': () => tri(bicycle(100, 132, 0.95, K)),
  'warning/other-danger': () => tri(exclamation()),

  // ---------------- priority ----------------
  'priority/stop': () => compose(octagonFrame(), text('DUR', { cx: 100, y: 124, cap: 48, weight: 800, track: 6, color: W })),
  'priority/stop--dur-stop': () =>
    compose(
      octagonFrame(),
      text('DUR', { cx: 100, y: 92, cap: 40, weight: 800, track: 9, color: W }) + text('STOP', { cx: 100, y: 146, cap: 40, weight: 800, track: 5, color: W }),
    ),
  'priority/give-way': () => compose(triangleFrame({ up: false })),
  'priority/give-way-ahead': () => {
    const t = triangleFrame({ up: false });
    const plate =
      `<rect x="44.6" y="206.6" width="110.8" height="56.8" rx="8" fill="${W}" stroke="${C.outline}" stroke-width="1.2"/>` +
      `<rect x="49" y="211" width="102" height="48" rx="5" fill="none" stroke="${K}" stroke-width="4"/>` +
      text('100 m', { cx: 100, y: 245, cap: 20, weight: 800, maxWidth: 84 });
    return compose({ w: 200, h: 266, before: t.before, after: '' }, plate);
  },
  'priority/give-way-to-oncoming': () =>
    prohib(arrow([78, 150], [78, 52], { shaft: 12, len: 28, width: 32, color: C.red }) + arrow([122, 50], [122, 148], { shaft: 12, len: 28, width: 32, color: K })),
  'priority/priority-over-oncoming': () =>
    info(arrow([76, 166], [76, 34], { shaft: 18, len: 36, width: 46, color: W }) + arrow([128, 54], [128, 150], { shaft: 12, len: 26, width: 32, color: C.red })),
  'priority/box-junction': () => {
    const d = diamondFrame();
    const { io, inner } = d;
    const lines = [];
    const step = inner / 5;
    for (let i = 1; i < 5; i++) {
      lines.push(`M${n(io + i * step)} ${n(io)}V${n(io + inner)}`, `M${n(io)} ${n(io + i * step)}H${n(io + inner)}`);
    }
    const field = rect(io + 6, io + 6, inner - 12, inner - 12, 2, C.yellow) + stroke(lines.join(''), K, 5);
    return compose(d, group('rotate(45 100 100)', field));
  },

  // ---------------- prohibitory ----------------
  'prohibitory/no-entry': () => compose(redDiscFrame(), rect(38, 86, 124, 28, 2, W)),
  'prohibitory/no-vehicles': () => prohib(''),
  'prohibitory/no-overtaking': () => prohib(carRear(69, 130, 1.1, K) + carRear(131, 130, 1.1, C.red)),
  'prohibitory/no-overtaking-goods-vehicles': () => prohib(carRear(68, 130, 1.05, K) + lorryRear(130, 132, 1.02, C.red)),
  'prohibitory/end-of-no-overtaking': () => compose(endFrame(), carRear(69, 130, 1.1, C.faded) + carRear(131, 130, 1.1, C.faded)),
  'prohibitory/no-left-turn': () => prohib(noTurn('left'), { bar: true }),
  'prohibitory/no-right-turn': () => prohib(noTurn('right'), { bar: true }),
  'prohibitory/no-u-turn': () => prohib(uTurn(), { bar: true }),
  'prohibitory/no-parking': () => prohib('', { bar: true, field: C.blue }),
  'prohibitory/no-stopping': () => prohib('', { cross: true, field: C.blue }),
  'prohibitory/no-motor-vehicles': () =>
    prohib(carSide(100, 100, 1, K) + text('ARAÇ', { cx: 100, y: 124, cap: 15, weight: 800 }) + text('GİREMEZ', { cx: 100, y: 146, cap: 15, weight: 800 })),
  'prohibitory/no-motorcycles': () => prohib(motorcycle(100, 140, 1, K)),
  'prohibitory/no-goods-vehicles': () => prohib(lorrySide(100, 132, 0.98, K)),
  'prohibitory/no-pedestrians': () => prohib(walker(100, 152, 98, K)),
  'prohibitory/no-cycling': () => prohib(bicycle(100, 98, 1.12, K)),
  'prohibitory/no-horns': () => prohib(horn(), { bar: true }),
  'prohibitory/speed-limit--20': () => prohib(speed(20)),
  'prohibitory/speed-limit--30': () => prohib(speed(30)),
  'prohibitory/speed-limit--50': () => prohib(speed(50)),
  'prohibitory/speed-limit--65': () => prohib(speed(65)),
  'prohibitory/speed-limit--80': () => prohib(speed(80)),
  'prohibitory/speed-limit--100': () => prohib(speed(100)),
  'prohibitory/end-of-speed-limit--50': () => compose(endFrame(), speed(50, C.faded)),
  'prohibitory/end-of-restrictions': () => compose(endFrame()),
  'prohibitory/height-limit': () => prohib(limitTri([100, 64], [0, 1]) + limitTri([100, 136], [0, -1]) + text('3,5m', { cx: 100, y: 116, cap: 34, weight: 800 })),
  'prohibitory/width-limit': () => prohib(limitTri([58, 100], [1, 0]) + limitTri([142, 100], [-1, 0]) + text('2m', { cx: 100, y: 118, cap: 38, weight: 800 })),
  'prohibitory/weight-limit': () => prohib(text('7,5t', { cx: 100, y: 120, cap: 44, weight: 800, track: 1 })),

  // ---------------- mandatory ----------------
  'mandatory/ahead-only': () => blue(arrow([100, 168], [100, 32], A)),
  'mandatory/turn-left': () => blue(arrow([164, 100], [34, 100], A)),
  'mandatory/turn-right': () => blue(arrow([36, 100], [166, 100], A)),
  'mandatory/turn-left-ahead': () => blue(turnAhead('left')),
  'mandatory/turn-right-ahead': () => blue(turnAhead('right')),
  'mandatory/ahead-or-left': () =>
    blue(arrow([116, 168], [116, 32], A) + pathArrow('M116 132Q116 110 92 110H84', [46, 110], [-1, 0], A)),
  'mandatory/ahead-or-right': () =>
    blue(mirror(arrow([116, 168], [116, 32], A) + pathArrow('M116 132Q116 110 92 110H84', [46, 110], [-1, 0], A))),
  'mandatory/keep-left': () => blue(arrow([142, 58], [52, 148], A)),
  'mandatory/keep-right': () => blue(arrow([58, 58], [148, 148], A)),
  'mandatory/pass-either-side': () =>
    blue(arrow([100, 46], [50, 134], { ...A, shaft: 18, width: 46, len: 32 }) + arrow([100, 46], [150, 134], { ...A, shaft: 18, width: 46, len: 32 }) + circle(100, 46, 9, W)),
  'mandatory/roundabout': () => blue(roundaboutArrows(100, 100, 46, 17, W, 28, 44)),
  'mandatory/cycle-route': () => blue(bicycle(100, 98, 1.2, W)),
  'mandatory/pedestrian-route': () => blue(walker(100, 156, 112, W)),

  // ---------------- information ----------------
  'information/parking': () => info(text('P', { cx: 100, y: 164, cap: 128, weight: 800, color: W })),
  'information/hospital': () => info(text('H', { cx: 100, y: 160, cap: 120, weight: 800, color: W })),
  'information/pedestrian-crossing': () => info(crossingPanel()),
  'information/one-way-street': () => info(arrow([100, 172], [100, 28], A)),
  'information/dead-end': () => info(rect(80, 70, 40, 104, 0, W) + rect(42, 34, 116, 36, 0, C.red)),
  'information/first-aid': () =>
    info(rect(42, 24, 116, 116, 6, W) + crescent(92, 82, 42) + text('İLK YARDIM', { cx: 100, y: 175, cap: 19, weight: 800, track: 1, maxWidth: 164, color: W })),
  'information/bus-stop': () => info(rect(24, 50, 152, 100, 8, W) + busSide(100, 140, 1.15, K, W)),
  'information/town-start': () => townPanel('GİRNE', false),
  'information/town-end': () => townPanel('GİRNE', true),
  'information/speed-camera': () => info(camera()),
  'information/petrol-station': () => info(pump()),
  'information/taxi-rank': () => info(text('TAKSİ', { cx: 100, y: 122, cap: 44, weight: 800, track: 2, maxWidth: 160, color: W })),
};
