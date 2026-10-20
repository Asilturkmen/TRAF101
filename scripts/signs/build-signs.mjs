#!/usr/bin/env node
// Writes every sign in signs.mjs and in scripts/signs/defs/*.mjs to
// public/signs/<category>/<file>.svg. Each defs module exports SIGNS, a map of
// "<category>/<file>" to a function returning the SVG string, built with lib.mjs.
// Usage: node scripts/signs/build-signs.mjs [--check]   (--check only reports sizes)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SIGNS as CORE } from './signs.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const outDir = path.join(root, 'public', 'signs');
const check = process.argv.includes('--check');

const all = { ...CORE };
const defsDir = path.join(here, 'defs');
if (fs.existsSync(defsDir)) {
  for (const f of fs.readdirSync(defsDir).filter((f) => f.endsWith('.mjs')).sort()) {
    const mod = await import(pathToFileURL(path.join(defsDir, f)).href);
    for (const [key, draw] of Object.entries(mod.SIGNS || {})) {
      if (all[key]) throw new Error(`${f}: duplicate sign key ${key}`);
      all[key] = draw;
    }
  }
}

let big = 0;
for (const [key, draw] of Object.entries(all)) {
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
console.log(`${Object.keys(all).length} signs${check ? ' checked' : ` written to ${path.relative(root, outDir)}`}, ${big} over 4 kB`);
