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
  // Questions per lesson (generated sign questions belong to signs-basics).
  const byLesson = { 'signs-basics': signs.length };
  for (const q of written) byLesson[q.lesson] = (byLesson[q.lesson] || 0) + 1;
  // Small lookup tables so light pages need not import the full sign or lesson data.
  const catFile = 'content/signs/categories.json';
  const categorySlugs = fs.existsSync(path.join(root, catFile))
    ? Object.fromEntries(readJson(catFile).map((c) => [c.id, c.slug]))
    : {};
  const lessonTitles = {};
  for (const l of readJson('content/lessons.json')) {
    const f = path.join(root, 'content/lessons', `${l.id}.json`);
    if (fs.existsSync(f)) lessonTitles[l.id] = JSON.parse(fs.readFileSync(f, 'utf8')).title;
  }
  return { signs: signs.length, questions: written.length + signs.length, scenarios: scenarios.length, byLesson, categorySlugs, lessonTitles };
}

// TR <-> EN slug pairs for every route parameter, so the language switch can find
// the other language's URL from the route alone (no page data needed).
function slugMap() {
  const map = { category: { tr: {}, en: {} }, sign: { tr: {}, en: {} }, lesson: { tr: {}, en: {} }, track: { tr: {}, en: {} } };
  const add = (kind, slug) => {
    map[kind].tr[slug.tr] = slug.en;
    map[kind].en[slug.en] = slug.tr;
  };
  const catFile = 'content/signs/categories.json';
  if (fs.existsSync(path.join(root, catFile))) for (const c of readJson(catFile)) add('category', c.slug);
  for (const s of jsonFiles('content/signs').filter((f) => !f.endsWith('categories.json')).flatMap(readJson)) add('sign', s.slug);
  for (const l of readJson('content/lessons.json')) add('lesson', l.slug);
  for (const t of readJson('content/tracks.json')) add('track', t.slug);
  return map;
}

// virtual:questions/tr and virtual:questions/en: the written question bank with only
// one language's text, emitted as a JSON.parse string. Practice screens load the
// bank for their own language only, which halves the download and parse time.
function questionsByLang() {
  const isText = (o) => o && typeof o === 'object' && !Array.isArray(o) && typeof o.tr === 'string' && typeof o.en === 'string';
  const strip = (o, lang) => {
    if (Array.isArray(o)) return o.map((x) => strip(x, lang));
    if (isText(o)) return { [lang]: o[lang] };
    if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, strip(v, lang)]));
    return o;
  };
  return {
    name: 't2d-questions-by-lang',
    resolveId(id) {
      if (id.startsWith('virtual:questions/')) return '\0' + id;
    },
    load(id) {
      if (!id.startsWith('\0virtual:questions/')) return;
      const lang = id.split('/').pop();
      const files = jsonFiles('content/questions');
      for (const f of files) this.addWatchFile(path.join(root, f));
      const data = files.flatMap(readJson).map((q) => strip(q, lang));
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});`;
    },
  };
}

export default defineConfig({
  plugins: [vue(), questionsByLang()],
  define: {
    __CONTENT_STATS__: JSON.stringify(contentStats()),
    __SLUG_MAP__: JSON.stringify(slugMap()),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(!!process.env.HYDRATION_DEBUG),
  },
  // Large content JSON is emitted as JSON.parse("...") strings, which parse much
  // faster than the equivalent object literals.
  json: { stringify: true },
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
