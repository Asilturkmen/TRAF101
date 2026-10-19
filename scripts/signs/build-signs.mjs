#!/usr/bin/env node
// Writes every sign in signs.mjs to public/signs/<category>/<file>.svg.
// Usage: node scripts/signs/build-signs.mjs [--check]   (--check only reports sizes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIGNS } from './signs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const outDir = path.join(root, 'public', 'signs');
const check = process.argv.includes('--check');
let big = 0;
for (const [key, draw] of Object.entries(SIGNS)) {
  const svg = draw();
  if (/<text[\s>]|href=|<svg[^>]*\swidth=/.test(svg)) throw new Error(`${key}: forbidden markup`);
  const file = path.join(outDir, `${key}.svg`);
  if (!check) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, svg + '\n');
  }
  if (svg.length > 4096) {
    big++;
    console.warn(`over 4 kB: ${key} (${svg.length} bytes)`);
  }
}
console.log(`${Object.keys(SIGNS).length} signs${check ? ' checked' : ` written to ${path.relative(root, outDir)}`}, ${big} over 4 kB`);
