#!/usr/bin/env node
// Validates every file under content/ against docs/CONTENT-SCHEMA.md.
// Default mode tolerates missing files so agents can check their own work early.
// --strict also enforces launch counts and the required sign list (used by the build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const C = (...p) => path.join(root, 'content', ...p);
const strict = process.argv.includes('--strict');
const errors = [];
const warnings = [];
const err = (file, id, msg) => errors.push(`${file}${id ? ` [${id}]` : ''}: ${msg}`);
const warn = (file, id, msg) => warnings.push(`${file}${id ? ` [${id}]` : ''}: ${msg}`);

function readJson(file, { optional = false } = {}) {
  if (!fs.existsSync(file)) {
    if (!optional) err(rel(file), null, 'missing file');
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    err(rel(file), null, `invalid JSON: ${e.message}`);
    return null;
  }
}
const rel = (f) => path.relative(root, f).replaceAll('\\', '/');
const listJson = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f)) : []);

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{FE0F}]/u;
const CJK = /[぀-ヿ㐀-鿿]/u;
const BANNED = /\b(ready to start your journey|our mission|unlock|seamless|empower|4-way stop|four-way stop|hazmat|EH licen[cs]e)\b/i;
const PRACTICE_NUMBER = /\d+([.,]\d+)?\s*(km|mg|%|tl|puan|point|points|yaş|years?|metre|meter|m\b|dakika|minutes?|saat|hours?|gün|days?|sn|saniye|seconds?)/i;

function checkText(file, id, field, value, { required = true } = {}) {
  if (value == null) {
    if (required) err(file, id, `${field}: missing`);
    return;
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    err(file, id, `${field}: must be {tr, en}`);
    return;
  }
  for (const lang of ['tr', 'en']) {
    const s = value[lang];
    if (typeof s !== 'string' || !s.trim()) {
      if (required) err(file, id, `${field}.${lang}: empty or missing`);
      continue;
    }
    if (EMOJI.test(s)) err(file, id, `${field}.${lang}: contains emoji`);
    if (CJK.test(s)) err(file, id, `${field}.${lang}: contains CJK characters`);
    if (/<[a-z/][^>]*>/i.test(s)) err(file, id, `${field}.${lang}: contains HTML`);
    if (s.includes('!')) err(file, id, `${field}.${lang}: exclamation mark`);
    if (BANNED.test(s)) err(file, id, `${field}.${lang}: banned phrase`);
  }
}
const heading = (file, id, field, v) => {
  checkText(file, id, field, v);
  for (const lang of ['tr', 'en']) if (v?.[lang]?.trim().endsWith('.')) err(file, id, `${field}.${lang}: heading ends with a full stop`);
};

// ---------- sources ----------
const sources = new Map();
for (const f of listJson(C('sources'))) {
  const arr = readJson(f) || [];
  for (const s of arr) {
    if (!s.id || !s.title || !s.url) err(rel(f), s.id, 'source needs id, title, url');
    if (!['official', 'secondary', 'reference'].includes(s.kind)) err(rel(f), s.id, `bad kind ${s.kind}`);
    if (sources.has(s.id)) err(rel(f), s.id, 'duplicate source id');
    sources.set(s.id, s);
  }
}

function checkBasis(file, id, obj, texts = []) {
  const { basis, sourceId } = obj;
  if (!['law', 'practice', 'secondary'].includes(basis)) {
    err(file, id, `basis must be law | practice | secondary (got ${basis})`);
    return;
  }
  if (basis !== 'practice') {
    if (!sourceId) err(file, id, `basis ${basis} needs a sourceId`);
    else if (!sources.has(sourceId)) err(file, id, `unknown sourceId ${sourceId}`);
    else if (basis === 'law' && sources.get(sourceId).kind !== 'official') warn(file, id, `basis law but source ${sourceId} is ${sources.get(sourceId).kind}`);
  } else {
    if (sourceId && !sources.has(sourceId)) err(file, id, `unknown sourceId ${sourceId}`);
    for (const t of texts) for (const lang of ['tr', 'en']) {
      const s = t?.[lang];
      if (s && PRACTICE_NUMBER.test(s)) err(file, id, `practice-basis text contains a numeric claim: "${s.match(PRACTICE_NUMBER)[0]}"`);
    }
  }
}

// ---------- core data ----------
const topics = readJson(C('topics.json')) || [];
const topicIds = new Set(topics.map((t) => t.id));
const lessons = readJson(C('lessons.json')) || [];
const lessonIds = new Set(lessons.map((l) => l.id));
const tracks = readJson(C('tracks.json')) || [];
const trackIds = new Set(tracks.map((t) => t.id));
const profile = readJson(C('exam-profile.json'));

// ---------- signs ----------
const REQUIRED_SIGNS = fs.readFileSync(path.join(root, 'docs', 'CONTENT-SCHEMA.md'), 'utf8')
  .split('### Zorunlu levha kimlikleri')[1].split('## Rehber')[0]
  .match(/`[a-z]+\.[a-z0-9-]+(--[a-z0-9-]+)?`/g).map((s) => s.slice(1, -1));
const signs = new Map();
const categories = readJson(C('signs', 'categories.json'), { optional: !strict }) || [];
const catIds = new Set(categories.map((c) => c.id));
for (const c of categories) {
  checkText('content/signs/categories.json', c.id, 'name', c.name);
  checkText('content/signs/categories.json', c.id, 'description', c.description);
  checkText('content/signs/categories.json', c.id, 'slug', c.slug);
}
const signSlugs = { tr: new Set(), en: new Set() };
for (const f of listJson(C('signs')).filter((f) => !f.endsWith('categories.json'))) {
  const file = rel(f);
  for (const s of readJson(f) || []) {
    const id = s.id;
    if (!id || !/^[a-z]+\.[a-z0-9-]+(--[a-z0-9-]+)?$/.test(id)) err(file, id, 'bad id');
    if (signs.has(id)) err(file, id, 'duplicate sign id');
    signs.set(id, s);
    if (!catIds.has(s.category)) err(file, id, `unknown category ${s.category}`);
    if (id && !id.startsWith(s.category + '.')) err(file, id, 'id must start with its category');
    const src = s.image?.src;
    if (!src || !fs.existsSync(path.join(root, 'public', src))) err(file, id, `image missing: ${src}`);
    else if (src.endsWith('.svg')) {
      const svg = fs.readFileSync(path.join(root, 'public', src), 'utf8');
      if (!/viewBox=/.test(svg)) err(file, id, 'svg has no viewBox');
      if (/<text[\s>]/.test(svg)) warn(file, id, 'svg contains <text>; convert text to paths');
      if (/(xlink:)?href="https?:/.test(svg)) err(file, id, 'svg references an external resource');
      if (svg.length > 12000) warn(file, id, `svg is ${svg.length} bytes`);
    }
    checkText(file, id, 'image.alt', s.image?.alt);
    checkText(file, id, 'slug', s.slug);
    for (const lang of ['tr', 'en']) {
      const sl = s.slug?.[lang];
      if (sl && !/^[a-z0-9-]+$/.test(sl)) err(file, id, `slug.${lang} must be ascii kebab-case`);
      if (sl && signSlugs[lang].has(sl)) err(file, id, `duplicate slug.${lang} ${sl}`);
      signSlugs[lang].add(sl);
    }
    checkText(file, id, 'name', s.name);
    checkText(file, id, 'meaning', s.meaning);
    checkText(file, id, 'driverAction', s.driverAction);
    if (!Array.isArray(s.confusions)) err(file, id, 'confusions must be an array');
    for (const c of s.confusions || []) checkText(file, id, 'confusions.tip', c.tip);
    if (!['core', 'common', 'rare'].includes(s.examPriority)) err(file, id, 'bad examPriority');
    if (!['seen', 'likely', 'unverified'].includes(s.kktc?.status)) err(file, id, 'bad kktc.status');
    if (s.examPriority === 'core' && !(s.confusions || []).length) warn(file, id, 'core sign without a confusion entry');
  }
}
for (const s of signs.values()) {
  for (const c of s.confusions || []) if (!signs.has(c.with)) err('content/signs', s.id, `confusion refers to unknown sign ${c.with}`);
  for (const r of s.related || []) if (!signs.has(r)) err('content/signs', s.id, `related refers to unknown sign ${r}`);
}
const signsReady = signs.size > 0;
const checkSignRef = (file, id, signId) => {
  if (!signId) return;
  if (!REQUIRED_SIGNS.includes(signId) && !signs.has(signId)) err(file, id, `signId ${signId} is not in the required list`);
  else if (signsReady && !signs.has(signId)) (strict ? err : warn)(file, id, `signId ${signId} not drawn yet`);
};
if (strict) for (const r of REQUIRED_SIGNS) if (!signs.has(r)) err('content/signs', r, 'required sign missing');

// ---------- questions ----------
const questions = new Map();
const letterStats = {};
for (const f of listJson(C('questions'))) {
  const file = rel(f);
  const prefix = path.basename(f, '.json');
  const arr = readJson(f) || [];
  const counts = { a: 0, b: 0, c: 0, d: 0 };
  for (const q of arr) {
    const id = q.id;
    if (!id || !id.startsWith(prefix + '.')) err(file, id, `id must start with "${prefix}."`);
    if (questions.has(id)) err(file, id, 'duplicate question id');
    questions.set(id, q);
    if (!Number.isInteger(q.rev) || q.rev < 1) err(file, id, 'rev must be a positive integer');
    if (!topicIds.has(q.topic)) err(file, id, `unknown topic ${q.topic}`);
    if (!lessonIds.has(q.lesson)) err(file, id, `unknown lesson ${q.lesson}`);
    if (!Array.isArray(q.tracks) || !q.tracks.length || q.tracks.some((t) => !trackIds.has(t))) err(file, id, 'tracks must be a non-empty subset of car, moto, heavy');
    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) err(file, id, 'bad difficulty');
    checkText(file, id, 'prompt', q.prompt);
    checkText(file, id, 'why', q.why);
    const ids = (q.options || []).map((o) => o.id).join('');
    if (ids !== 'abcd') err(file, id, 'options must be exactly a, b, c, d');
    for (const o of q.options || []) checkText(file, id, `option ${o.id}`, o.text);
    if (!'abcd'.includes(q.answer) || !q.answer) err(file, id, 'answer must be a, b, c or d');
    else counts[q.answer]++;
    const texts = new Set((q.options || []).map((o) => o.text?.tr));
    if (texts.size !== (q.options || []).length) err(file, id, 'duplicate option text');
    checkSignRef(file, id, q.signId);
    checkBasis(file, id, q, [q.prompt, q.why, ...(q.options || []).map((o) => o.text)]);
  }
  const n = arr.length;
  letterStats[file] = counts;
  if (n >= 12) for (const [l, c] of Object.entries(counts)) {
    const share = c / n;
    if (share < 0.15 || share > 0.35) err(file, null, `answer "${l}" is ${(share * 100).toFixed(0)}% of answers (allowed 15-35%)`);
  }
}

// ---------- scenarios ----------
const scenarios = readJson(C('scenarios.json'), { optional: !strict }) || [];
const scCounts = { a: 0, b: 0, c: 0 };
const scIds = new Set();
for (const s of scenarios) {
  const file = 'content/scenarios.json';
  const id = s.id;
  if (!id?.startsWith('sc.')) err(file, id, 'id must start with "sc."');
  if (scIds.has(id)) err(file, id, 'duplicate id');
  scIds.add(id);
  if (!lessonIds.has(s.lesson)) err(file, id, `unknown lesson ${s.lesson}`);
  if (!['urban', 'rural', 'weather', 'emergency', 'parking'].includes(s.category)) err(file, id, 'bad category');
  if (!['easy', 'medium', 'hard'].includes(s.difficulty)) err(file, id, 'bad difficulty');
  if (!Array.isArray(s.tracks) || !s.tracks.length) err(file, id, 'tracks missing');
  heading(file, id, 'title', s.title);
  checkText(file, id, 'situation', s.situation);
  checkText(file, id, 'explanation', s.explanation);
  if ((s.choices || []).map((c) => c.id).join('') !== 'abc') err(file, id, 'choices must be exactly a, b, c');
  const correct = (s.choices || []).filter((c) => c.correct === true);
  if (correct.length !== 1) err(file, id, 'exactly one correct choice');
  else scCounts[correct[0].id]++;
  for (const c of s.choices || []) {
    checkText(file, id, `choice ${c.id}`, c.text);
    checkText(file, id, `feedback ${c.id}`, c.feedback);
  }
  checkSignRef(file, id, s.signId);
  checkBasis(file, id, s, [s.situation, s.explanation, ...(s.choices || []).flatMap((c) => [c.text, c.feedback])]);
}
if (scenarios.length >= 9) for (const [l, c] of Object.entries(scCounts)) {
  const share = c / scenarios.length;
  if (share < 0.2 || share > 0.47) err('content/scenarios.json', null, `correct choice "${l}" is ${(share * 100).toFixed(0)}% (allowed 20-47%)`);
}

// ---------- lessons and pages ----------
function checkDoc(file, id, d) {
  heading(file, id, 'title', d.title);
  checkText(file, id, 'summary', d.summary);
  if (!Array.isArray(d.sections) || !d.sections.length) err(file, id, 'sections missing');
  for (const [i, s] of (d.sections || []).entries()) {
    heading(file, id, `sections[${i}].heading`, s.heading);
    checkText(file, id, `sections[${i}].body`, s.body);
    if (s.basis) checkBasis(file, `${id} §${i}`, s, [s.body]);
  }
  for (const [i, k] of (d.keyPoints || []).entries()) {
    checkText(file, id, `keyPoints[${i}]`, k.text);
    checkBasis(file, `${id} key ${i}`, k, [k.text]);
  }
  for (const s of d.relatedSigns || []) checkSignRef(file, id, s);
}
for (const l of lessons) {
  const f = C('lessons', `${l.id}.json`);
  const d = readJson(f, { optional: !strict });
  if (!d) continue;
  if (d.id !== l.id) err(rel(f), l.id, 'id does not match file name');
  checkDoc(rel(f), l.id, d);
}
const PAGES = ['exam', 'licence', 'left-driving', 'sources', 'about', 'privacy'];
for (const p of PAGES) {
  const f = C('pages', `${p}.json`);
  const d = readJson(f, { optional: !strict });
  if (!d) continue;
  checkText(rel(f), p, 'slug', d.slug);
  checkDoc(rel(f), p, d);
}
const glossary = readJson(C('glossary.json'), { optional: !strict }) || [];
for (const g of glossary) if (!g.id || !g.tr || !g.en) err('content/glossary.json', g.id, 'needs id, tr, en');

// ---------- exam profile coverage ----------
if (profile) {
  for (const fmt of profile.formats) {
    const sum = Object.values(fmt.split).reduce((a, b) => a + b, 0);
    if (sum !== fmt.questions) err('content/exam-profile.json', fmt.id, `split sums to ${sum}, not ${fmt.questions}`);
  }
  if (strict) {
    // Generated sign questions count toward "rules": one per drawn sign, all tracks.
    for (const t of tracks) {
      const fmt = profile.formats.find((f) => f.id === t.exam);
      for (const [topic, need] of Object.entries(fmt.split)) {
        let have = [...questions.values()].filter((q) => q.topic === topic && q.tracks.includes(t.id)).length;
        if (topic === 'rules') have += signs.size;
        if (have < need * 2) err('content/questions', `${t.id}/${topic}`, `pool ${have} is below twice the exam need ${need}`);
      }
    }
    const minimum = { rules: 70, safety: 75, vehicle: 20, environment: 15, personal: 15, firstaid: 15 };
    for (const [topic, n] of Object.entries(minimum)) {
      const have = [...questions.values()].filter((q) => q.topic === topic && q.tracks.length > 1).length;
      if (have < n) err('content/questions', topic, `shared pool has ${have}, plan needs ${n}`);
    }
    const moto = [...questions.values()].filter((q) => q.tracks.length === 1 && q.tracks[0] === 'moto').length;
    const heavy = [...questions.values()].filter((q) => q.tracks.length === 1 && q.tracks[0] === 'heavy').length;
    if (moto < 20) err('content/questions', 'moto', `moto-only questions ${moto} < 20`);
    if (heavy < 40) err('content/questions', 'heavy', `heavy-only questions ${heavy} < 40`);
    if (scenarios.length < 30) err('content/scenarios.json', null, `${scenarios.length} scenarios < 30`);
    if (signs.size < 85) err('content/signs', null, `${signs.size} signs < 85`);
  }
}

// ---------- report ----------
const summary = `signs ${signs.size} · questions ${questions.size} · scenarios ${scenarios.length} · sources ${sources.size}`;
for (const w of warnings) console.warn('warn  ' + w);
for (const e of errors) console.error('error ' + e);
console.log(`\n${summary}\n${errors.length} errors, ${warnings.length} warnings${strict ? ' (strict)' : ''}`);
process.exit(errors.length ? 1 : 0);
