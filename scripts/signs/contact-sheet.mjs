#!/usr/bin/env node
// Renders contact sheets of the generated signs at 48 px and 300 px for visual review.
// Usage: node scripts/signs/contact-sheet.mjs <output dir> [filter,filter,...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { SIGNS } from './signs.mjs';

const out = process.argv[2];
const filter = process.argv[3] || '';
if (!out) throw new Error('usage: contact-sheet.mjs <output dir> [filter]');
fs.mkdirSync(out, { recursive: true });
const keys = Object.keys(SIGNS).filter((k) => filter.split(',').some((f) => k.includes(f)));

function sheet(size, cols, name, bg = '#FFFFFF', labels = true) {
  const cellW = size + 24;
  const cellH = size + (labels ? 34 : 16);
  const rows = Math.ceil(keys.length / cols);
  let body = '';
  keys.forEach((k, i) => {
    const svg = SIGNS[k]();
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const scale = size / Math.max(vb[2], vb[3]);
    const w = vb[2] * scale;
    const h = vb[3] * scale;
    const x = (i % cols) * cellW + 12 + (size - w) / 2;
    const y = Math.floor(i / cols) * cellH + 8 + (size - h) / 2;
    const inner = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    body += `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb.join(' ')}">${inner}</svg>`;
    if (labels) body += `<text x="${(i % cols) * cellW + cellW / 2}" y="${Math.floor(i / cols) * cellH + size + 24}" font-family="Arial" font-size="${size > 100 ? 13 : 9}" text-anchor="middle" fill="#333">${k.split('/')[1]}</text>`;
  });
  const W = cols * cellW;
  const H = rows * cellH;
  const doc = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${bg}"/>${body}</svg>`;
  const png = new Resvg(doc, { font: { loadSystemFonts: true } }).render().asPng();
  fs.writeFileSync(path.join(out, name), png);
  console.log('wrote', path.join(out, name));
}
sheet(48, 12, 'sheet-48.png');
sheet(48, 12, 'sheet-48-dark.png', '#1E2A30', false);
sheet(300, 5, 'sheet-300.png');
