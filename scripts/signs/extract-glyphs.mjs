#!/usr/bin/env node
// Extracts the glyph outlines that the sign generator needs from Overpass (SIL OFL 1.1)
// into glyphs.json, so build-signs.mjs has no font or npm dependency.
// Run once from a scratch folder that has opentype.js and @fontsource/overpass installed:
//   NODE_PATH=<scratch>/node_modules node scripts/signs/extract-glyphs.mjs <scratch>/node_modules/@fontsource/overpass/files
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(process.env.NODE_PATH || '.', 'x.js'));
const opentype = require('opentype.js');
const dir = process.argv[2];
if (!dir) throw new Error('usage: extract-glyphs.mjs <fontsource files dir>');

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇĞİÖŞÜ0123456789%,.mtk';
const WEIGHTS = [700, 800];
const out = { font: 'Overpass', license: 'SIL Open Font License 1.1', unitsPerEm: 1000, weights: {} };

for (const w of WEIGHTS) {
  const fonts = ['latin', 'latin-ext'].map((s) => { const b = fs.readFileSync(path.join(dir, `overpass-${s}-${w}-normal.woff`)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); });
  const glyphs = {};
  for (const ch of CHARS) {
    const font = fonts.find((f) => f.charToGlyph(ch).index > 0);
    if (!font) throw new Error(`no glyph for ${ch}`);
    const g = font.charToGlyph(ch);
    const scale = 1000 / font.unitsPerEm;
    // y is flipped to SVG orientation: baseline at 0, cap height negative.
    const d = g.getPath(0, 0, 1000).toPathData(1);
    glyphs[ch] = { adv: Math.round(g.advanceWidth * scale), d };
  }
  const f0 = fonts[0];
  out.weights[w] = { capHeight: Math.round((f0.tables.os2.sCapHeight || 700) * 1000 / f0.unitsPerEm), glyphs };
}
const target = path.join(path.dirname(fileURLToPath(import.meta.url)), 'glyphs.json');
fs.writeFileSync(target, JSON.stringify(out));
console.log('wrote', target, fs.statSync(target).size, 'bytes');
