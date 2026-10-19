import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import { TABLE, fill } from './src/router/table.js';

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const jsonFiles = (dir) =>
  fs.existsSync(path.join(root, dir))
    ? fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f))
    : [];

// Every concrete URL to prerender, in both languages.
function ssgPaths() {
  const out = [];
  const langs = ['tr', 'en'];
  const STATIC = Object.entries(TABLE).filter(([, p]) => !p.tr.includes(':'));
  for (const [, p] of STATIC) for (const l of langs) out.push(p[l]);

  const catFile = 'content/signs/categories.json';
  const categories = fs.existsSync(path.join(root, catFile)) ? readJson(catFile) : [];
  const signs = jsonFiles('content/signs').filter((f) => !f.endsWith('categories.json')).flatMap(readJson);
  for (const l of langs) {
    for (const c of categories) {
      out.push(fill(TABLE.signCategory[l], { category: c.slug[l] }));
      for (const s of signs.filter((s) => s.category === c.id)) {
        out.push(fill(TABLE.sign[l], { category: c.slug[l], sign: s.slug[l] }));
      }
    }
    const lessons = readJson('content/lessons.json');
    for (const meta of lessons) {
      if (!fs.existsSync(path.join(root, 'content/lessons', `${meta.id}.json`))) continue;
      out.push(fill(TABLE.lesson[l], { lesson: meta.slug[l] }));
      out.push(fill(TABLE.lessonPractice[l], { lesson: meta.slug[l] }));
    }
    for (const t of readJson('content/tracks.json')) out.push(fill(TABLE.mockExam[l], { track: t.slug[l] }));
  }
  return [...new Set(out)];
}

// Counts shown on the homepage, computed at build time so the page does not
// download the whole question bank just to print a number.
function contentStats() {
  const signs = jsonFiles('content/signs').filter((f) => !f.endsWith('categories.json')).flatMap(readJson);
  const written = jsonFiles('content/questions').flatMap(readJson);
  const scenarios = fs.existsSync(path.join(root, 'content/scenarios.json')) ? readJson('content/scenarios.json') : [];
  return { signs: signs.length, questions: written.length + signs.length, scenarios: scenarios.length };
}

export default defineConfig({
  plugins: [vue()],
  define: { __CONTENT_STATS__: JSON.stringify(contentStats()) },
  server: { port: Number(process.env.PORT) || 5173 },
  cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    beastiesOptions: { reduceInlineStyles: false },
    includedRoutes: () => ssgPaths(),
  },
});
