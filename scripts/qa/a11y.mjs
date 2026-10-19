#!/usr/bin/env node
// axe-core WCAG 2.2 AA scan at phone and desktop widths, including interactive
// states (an answered question, the open menu). Usage:
//   node scripts/qa/a11y.mjs <baseUrl> [path...]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const [base, ...rest] = process.argv.slice(2);
const paths = rest.length
  ? rest
  : ['/', '/en/', '/levhalar/', '/levhalar/oncelik/dur/', '/en/signs/warning/', '/konular/', '/konular/oncelik-kurallari/', '/calis/', '/calis/bugun/', '/calis/levha-sinavi/', '/senaryolar/', '/deneme-sinavi/', '/deneme-sinavi/otomobil/', '/ilerleme/', '/sinav-nasil-yapilir/', '/kaynaklar/', '/hakkinda/', '/gizlilik/', '/en/driving-on-the-left/', '/yok/'];

const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let total = 0;
async function scan(page, label) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () =>
    window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }),
  );
  for (const v of result.violations) {
    total += v.nodes.length;
    console.log(`${label} · ${v.id} (${v.impact}) × ${v.nodes.length}: ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(' ')} ${n.failureSummary?.split('\n')[1]?.trim() || ''}`);
  }
}
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await scan(page, `${width} ${p}`);
    if (p === '/levhalar/oncelik/dur/') {
      await page.locator('.quiz-card label.choice-option').first().click();
      await page.locator('.quiz-card button[type="submit"]').click();
      await scan(page, `${width} ${p} [answered]`);
    }
    if (p === '/' && width === 390) {
      await page.locator('.menu-button').click();
      await scan(page, `${width} ${p} [menu open]`);
      await page.keyboard.press('Escape');
    }
  }
  await page.close();
}
await browser.close();
console.log(`\n${total} violations`);
process.exit(total ? 1 : 0);
