#!/usr/bin/env node
// LCP, CLS and transfer size on a throttled phone (slow 4G, 4x CPU), cold cache.
// Usage: node scripts/qa/perf.mjs <baseUrl> [path...]
import { chromium } from 'playwright-core';

const [base, ...rest] = process.argv.slice(2);
const paths = rest.length ? rest : ['/', '/levhalar/', '/levhalar/oncelik/dur/', '/konular/oncelik-kurallari/', '/calis/bugun/', '/deneme-sinavi/otomobil/', '/en/'];
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let worst = 0;
for (const p of paths) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  let external = 0;
  page.on('response', async (r) => {
    if (!r.url().startsWith(base)) external++;
    const len = Number(r.headers()['content-length'] || 0);
    bytes += len;
  });
  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + p, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }));
  worst = Math.max(worst, lcp);
  console.log(`${p.padEnd(32)} LCP ${(lcp / 1000).toFixed(2)} s · CLS ${cls.toFixed(3)} · external requests ${external}`);
  await ctx.close();
}
await browser.close();
console.log(`worst LCP ${(worst / 1000).toFixed(2)} s`);
