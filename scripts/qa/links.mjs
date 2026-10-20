#!/usr/bin/env node
// Static checks over dist/: every internal href/src resolves to a file, and every
// page's hreflang alternates point back to it (reciprocity).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');
const SITE = (process.env.VITE_SITE_URL || 'https://test2drive.example').replace(/\/$/, '');
const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const exists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const f = path.join(dist, clean);
  if (fs.existsSync(f) && fs.statSync(f).isFile()) return true;
  return fs.existsSync(path.join(f, 'index.html'));
};
const pages = walk(dist).filter((f) => f.endsWith('index.html'));
let broken = 0;
let hreflangErrors = 0;
const alternatesByUrl = new Map();
for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const self = '/' + path.relative(dist, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//')) continue;
    if (!exists(m[1])) {
      broken++;
      if (broken <= 20) console.log(`broken: ${self} -> ${m[1]}`);
    }
  }
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2].replace(SITE, '')]);
  if (alts.length) alternatesByUrl.set(self, Object.fromEntries(alts));
}
for (const [url, alts] of alternatesByUrl) {
  for (const [lang, target] of Object.entries(alts)) {
    if (lang === 'x-default') continue;
    const back = alternatesByUrl.get(target);
    if (!back || !Object.values(back).includes(url)) {
      hreflangErrors++;
      if (hreflangErrors <= 20) console.log(`hreflang not reciprocal: ${url} -[${lang}]-> ${target}`);
    }
    if (!exists(target)) {
      hreflangErrors++;
      console.log(`hreflang target missing: ${url} -> ${target}`);
    }
  }
}
console.log(`${pages.length} pages · ${broken} broken internal links · ${alternatesByUrl.size} pages with hreflang · ${hreflangErrors} hreflang errors`);
process.exit(broken || hreflangErrors ? 1 : 0);
