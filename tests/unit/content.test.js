import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { signs, signQuestion, categories, signBySlug } from '../../src/content/signs.js';
import { allQuestions, writtenQuestions } from '../../src/content/questions.js';
import { lessons, pageById, PAGE_SLUGS } from '../../src/content/docs.js';
import { TABLE, pathFor } from '../../src/router/table.js';
import { proseToHtml } from '../../src/lib/text.js';
import { emptyState, exportJson, importJson } from '../../src/lib/storage.js';

describe('content validator', () => {
  it('passes in strict mode', () => {
    expect(() => execFileSync(process.execPath, ['scripts/validate-content.mjs', '--strict'], { stdio: 'pipe' })).not.toThrow();
  });
});

describe('generated sign questions', () => {
  it('have four distinct options, the right answer and no same-meaning distractor', () => {
    for (const s of signs) {
      const q = signQuestion(s);
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text.tr)).size).toBe(4);
      expect(new Set(q.options.map((o) => o.text.en)).size).toBe(4);
      expect(q.options.find((o) => o.id === q.answer).text).toBe(s.name);
    }
    const stop = signQuestion(signs.find((s) => s.id === 'priority.stop'));
    expect(stop.options.map((o) => o.text.tr)).not.toContain(signs.find((s) => s.id === 'priority.stop--dur-stop').name.tr);
  });

  it('spread the correct letter across a-d', () => {
    const counts = { a: 0, b: 0, c: 0, d: 0 };
    for (const s of signs) counts[signQuestion(s).answer]++;
    for (const n of Object.values(counts)) expect(n / signs.length).toBeGreaterThan(0.12);
  });
});

describe('question bank', () => {
  it('has unique ids across written and generated items', () => {
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(allQuestions.length);
    expect(writtenQuestions.length).toBeGreaterThan(300);
  });
});

describe('routes', () => {
  it('every route exists in both languages and English lives under /en/', () => {
    const seen = new Set();
    for (const [key, p] of Object.entries(TABLE)) {
      expect(p.tr.startsWith('/en')).toBe(false);
      expect(p.en.startsWith('/en/')).toBe(true);
      for (const l of ['tr', 'en']) {
        expect(seen.has(p[l]), `${key} ${p[l]}`).toBe(false);
        seen.add(p[l]);
      }
    }
  });
  it('guide page slugs match the route table', () => {
    const keyFor = { exam: 'exam', licence: 'licence', 'left-driving': 'leftDriving', sources: 'sources', about: 'about', privacy: 'privacy' };
    for (const [id, slug] of Object.entries(PAGE_SLUGS)) {
      expect(pathFor(keyFor[id], 'tr')).toBe(`/${slug.tr}/`);
      expect(pathFor(keyFor[id], 'en')).toBe(`/en/${slug.en}/`);
      expect(pageById(id)).toBeTruthy();
    }
  });
  it('sign and lesson slugs resolve back to their entity', () => {
    for (const s of signs) {
      const cat = categories.find((c) => c.id === s.category);
      for (const l of ['tr', 'en']) expect(signBySlug(l, cat.slug[l], s.slug[l])).toBe(s);
    }
    expect(lessons).toHaveLength(17);
  });
});

describe('prose rendering', () => {
  it('escapes HTML and supports bold and bullets only', () => {
    const html = proseToHtml('Bir <script>x</script> **kalın**\n\n- bir\n- iki');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>kalın</strong>');
    expect(html).toContain('<ul><li>bir</li><li>iki</li></ul>');
  });
});

describe('storage', () => {
  it('round-trips an export', () => {
    const state = { ...emptyState(), items: { a: { b: 2 } } };
    expect(importJson(exportJson(state)).items).toEqual({ a: { b: 2 } });
    expect(() => importJson('{"app":"other"}')).toThrow();
  });
});
