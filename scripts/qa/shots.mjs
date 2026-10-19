#!/usr/bin/env node
// Full-page screenshots of the given paths at phone and desktop widths, plus a
// horizontal-overflow check and console errors. Usage:
//   node scripts/qa/shots.mjs <baseUrl> <outDir> <path> [path...]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const [base, outDir, ...paths] = process.argv.slice(2);
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: EDGE });
const widths = (process.env.WIDTHS || '390,1440').split(',').map(Number);
const report = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 844 : 900 }, deviceScaleFactor: Number(process.env.DPR || 1), locale: 'tr-TR' });
  for (const p of paths) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(String(e)));
    const resp = await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${w}-${p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home'}.png`;
    await page.screenshot({ path: path.join(outDir, name), fullPage: !process.env.VIEWPORT_ONLY });
    report.push({ w, p, status: resp?.status(), overflow, errors: errors.slice(0, 5) });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
for (const r of report) {
  const flags = [r.status !== 200 ? `status ${r.status}` : '', r.overflow > 0 ? `OVERFLOW ${r.overflow}px` : '', r.errors.length ? `errors: ${r.errors.join(' | ')}` : ''].filter(Boolean);
  console.log(`${r.w} ${r.p} ${flags.join(' · ') || 'ok'}`);
}
