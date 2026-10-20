import { describe, it, expect } from 'vitest';
import { shuffle, mulberry32, sample } from '../../src/lib/random.js';
import { buildMock, scoreAnswers, interleave, buildDailyReview, readiness } from '../../src/lib/sessions.js';
import { answer } from '../../src/lib/leitner.js';
import { loadQuestions } from '../../src/content/questions.js';

const { allQuestions } = await loadQuestions('tr');
import { examProfile, tracks, formatById } from '../../src/content/meta.js';

describe('random', () => {
  it('shuffles into a permutation', () => {
    const list = Array.from({ length: 50 }, (_, i) => i);
    const out = shuffle(list);
    expect(out).toHaveLength(50);
    expect([...out].sort((a, b) => a - b)).toEqual(list);
  });
  it('is deterministic with a seed', () => {
    const list = Array.from({ length: 20 }, (_, i) => i);
    expect(shuffle(list, mulberry32(7))).toEqual(shuffle(list, mulberry32(7)));
    expect(sample(list, 5, mulberry32(1))).toHaveLength(5);
  });
  it('places the first element evenly (no sort-based bias)', () => {
    const counts = [0, 0, 0, 0];
    const rand = mulberry32(42);
    for (let i = 0; i < 8000; i++) counts[shuffle([0, 1, 2, 3], rand)[0]]++;
    for (const c of counts) expect(c).toBeGreaterThan(1800);
  });
});

describe('mock exams', () => {
  for (const track of tracks) {
    it(`builds a full ${track.id} mock in the regulation split`, () => {
      const format = formatById(track.exam);
      const pool = allQuestions.filter((q) => q.tracks.includes(track.id));
      const { questions, missing } = buildMock(format, pool, mulberry32(3));
      expect(missing).toEqual({});
      expect(questions).toHaveLength(format.questions);
      expect(new Set(questions.map((q) => q.id)).size).toBe(format.questions);
      for (const [topic, n] of Object.entries(format.split)) {
        expect(questions.filter((q) => q.topic === topic)).toHaveLength(n);
      }
    });
  }

  it('keeps sign-identification questions to a share of the rules part', () => {
    const format = formatById('written-standard');
    const pool = allQuestions.filter((q) => q.tracks.includes('car'));
    const { questions } = buildMock(format, pool, mulberry32(11));
    const rules = questions.filter((q) => q.topic === 'rules');
    const signs = rules.filter((q) => q.generated);
    expect(signs.length).toBeLessThanOrEqual(Math.round(format.split.rules * 0.4));
    expect(signs.every((q) => q.examPriority !== 'rare')).toBe(true);
  });

  it('scores answers per topic', () => {
    const qs = allQuestions.slice(0, 4);
    const answers = { [qs[0].id]: qs[0].answer, [qs[1].id]: 'z' };
    const r = scoreAnswers(qs, answers);
    expect(r.correct).toBe(1);
    expect(r.total).toBe(4);
    expect(Object.values(r.byTopic).reduce((s, [, t]) => s + t, 0)).toBe(4);
  });

  it('profile splits add up', () => {
    for (const f of examProfile.formats) {
      expect(Object.values(f.split).reduce((a, b) => a + b, 0)).toBe(f.questions);
    }
  });
});

describe('daily review', () => {
  it('returns at most 20 unique items and avoids same-lesson neighbours', () => {
    const pool = allQuestions.filter((q) => q.tracks.includes('car'));
    const session = buildDailyReview(pool, {}, 1000, mulberry32(9));
    expect(session.length).toBeLessThanOrEqual(20);
    expect(new Set(session.map((q) => q.id)).size).toBe(session.length);
    const repeats = session.filter((q, i) => i > 0 && session[i - 1].lesson === q.lesson).length;
    expect(repeats).toBeLessThan(4);
  });

  it('puts due items and mistakes first', () => {
    const pool = allQuestions.filter((q) => q.tracks.includes('car'));
    const items = {};
    items[pool[0].id] = answer(null, false, 999); // wrong yesterday: due today and in mistakes
    const session = buildDailyReview(pool, items, 1000, mulberry32(2));
    expect(session.map((q) => q.id)).toContain(pool[0].id);
  });

  it('interleaves by key', () => {
    const out = interleave([{ lesson: 'a' }, { lesson: 'a' }, { lesson: 'b' }, { lesson: 'b' }]);
    expect(out.map((x) => x.lesson)).toEqual(['a', 'b', 'a', 'b']);
  });
});

describe('readiness', () => {
  it('starts at getting started and never claims ready without mocks', () => {
    const pool = allQuestions.filter((q) => q.tracks.includes('car'));
    const items = {};
    for (const q of pool) {
      let e = null;
      for (let d = 0; d < 6; d++) e = answer(e, true, d);
      items[q.id] = e;
    }
    expect(readiness({ pool, items: {}, attempts: [], day: 10, passMark: 40, total: 50 }).state).toBe('start');
    const r = readiness({ pool, items, attempts: [], day: 6, passMark: 40, total: 50 });
    expect(r.state).toBe('onTheWay');
  });
});
