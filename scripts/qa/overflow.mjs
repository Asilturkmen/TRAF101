#!/usr/bin/env node
// Lists elements wider than the viewport. Usage: node scripts/qa/overflow.mjs <url> [width]
import { chromium } from 'playwright-core';
const [url, width = '390'] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const page = await browser.newPage({ viewport: { width: Number(width), height: 844 } });
await page.goto(url, { waitUntil: 'networkidle' });
const res = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  return [...document.querySelectorAll('body *')]
    .map((el) => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.right > vw + 0.5 && r.width > 0)
    .slice(0, 15)
    .map(({ el, r }) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(r.right)} w=${Math.round(r.width)} "${(el.textContent || '').trim().slice(0, 40)}"`);
});
console.log(res.join('\n') || 'no overflow');
await browser.close();
