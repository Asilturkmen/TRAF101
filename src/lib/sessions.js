// Builds practice sessions and mock exams from the item pool and the saved state.
// Pure functions: the store passes in state, the pool and the day.
import { isDue, inMistakes, mastery } from './leitner.js';
import { shuffle, sample } from './random.js';

export const DAILY_SIZE = 20;
export const NEW_PER_DAY = 20;

// Avoid two items of the same topic in a row when another topic is available.
export function interleave(items, key = (q) => q.lesson) {
  const rest = items.slice();
  const out = [];
  while (rest.length) {
    const last = out.length ? key(out[out.length - 1]) : null;
    let i = rest.findIndex((q) => key(q) !== last);
    if (i < 0) i = 0;
    out.push(rest.splice(i, 1)[0]);
  }
  return out;
}

export function topicMastery(pool, items, day) {
  const byTopic = {};
  for (const q of pool) {
    const t = (byTopic[q.lesson] ||= { sum: 0, n: 0 });
    t.sum += mastery(items[q.id], day);
    t.n += 1;
  }
  return Object.fromEntries(Object.entries(byTopic).map(([k, v]) => [k, v.n ? v.sum / v.n : 0]));
}

export function buildDailyReview(pool, items, day, rand = Math.random, size = DAILY_SIZE) {
  const due = pool
    .filter((q) => isDue(items[q.id], day))
    .sort((a, b) => items[a.id].d - items[b.id].d)
    .slice(0, Math.round(size * 0.6));
  const chosen = new Set(due.map((q) => q.id));
  const mistakes = shuffle(
    pool.filter((q) => !chosen.has(q.id) && inMistakes(items[q.id]) && items[q.id].l !== day),
    rand,
  ).slice(0, size - chosen.size);
  mistakes.forEach((q) => chosen.add(q.id));

  const mastered = topicMastery(pool, items, day);
  const unseen = pool.filter((q) => !chosen.has(q.id) && !(items[q.id]?.s > 0));
  const weakestFirst = shuffle(unseen, rand).sort((a, b) => (mastered[a.lesson] ?? 0) - (mastered[b.lesson] ?? 0));
  const fresh = [];
  const signQuota = Math.ceil(size / 3);
  // Keep at least a third sign items when possible: signs are the core of the oral exam.
  const signsFirst = weakestFirst.filter((q) => q.signId);
  const others = weakestFirst.filter((q) => !q.signId);
  const haveSigns = [...due, ...mistakes].filter((q) => q.signId).length;
  // The new-item limit is per day, not per round.
  const introducedToday = pool.filter((q) => items[q.id]?.f === day).length;
  const room = Math.max(0, Math.min(NEW_PER_DAY - introducedToday, size - chosen.size));
  for (const q of signsFirst.slice(0, Math.max(0, Math.min(room, signQuota - haveSigns)))) fresh.push(q);
  for (const q of others) {
    if (fresh.length >= room) break;
    fresh.push(q);
  }
  for (const q of signsFirst) {
    if (fresh.length >= room) break;
    if (!fresh.includes(q)) fresh.push(q);
  }
  let session = [...due, ...mistakes, ...fresh];
  // Fill with the least recently seen items if the day is light. Unseen items are
  // not used as filler, so the daily new-item limit holds.
  if (session.length < size) {
    const ids = new Set(session.map((q) => q.id));
    const filler = pool
      .filter((q) => !ids.has(q.id) && items[q.id]?.s > 0)
      .sort((a, b) => (items[a.id]?.l ?? -1) - (items[b.id]?.l ?? -1))
      .slice(0, size - session.length);
    session = session.concat(filler);
  }
  return interleave(shuffle(session, rand));
}

export function buildLessonPractice(pool, items, day, rand = Math.random, size = 15) {
  const sorted = shuffle(pool, rand).sort((a, b) => mastery(items[a.id], day) - mastery(items[b.id], day));
  return shuffle(sorted.slice(0, size), rand);
}

export function buildMistakes(pool, items, rand = Math.random) {
  return shuffle(pool.filter((q) => inMistakes(items[q.id])), rand);
}

export function buildMock(format, pool, rand = Math.random) {
  const picked = [];
  const missing = {};
  for (const [topic, need] of Object.entries(format.split)) {
    const candidates = pool.filter((q) => q.topic === topic);
    if (candidates.length < need) missing[topic] = need - candidates.length;
    picked.push(...sample(candidates, need, rand));
  }
  return { questions: shuffle(picked, rand), missing };
}

export function scoreAnswers(questions, answers) {
  const byTopic = {};
  let correct = 0;
  for (const q of questions) {
    const ok = answers[q.id] === q.answer;
    const t = (byTopic[q.topic] ||= [0, 0]);
    t[1] += 1;
    if (ok) {
      t[0] += 1;
      correct += 1;
    }
  }
  return { correct, total: questions.length, byTopic };
}

// Readiness as named states, never a pass probability (benchmark §2.6).
export function readiness({ pool, items, attempts, day, passMark, total }) {
  const n = pool.length || 1;
  const seen = pool.filter((q) => items[q.id]?.s > 0).length;
  const overall = pool.reduce((sum, q) => sum + mastery(items[q.id], day), 0) / n;
  const lessonsM = topicMastery(pool, items, day);
  const signPool = pool.filter((q) => q.signId && q.generated);
  const signM = signPool.length ? signPool.reduce((s, q) => s + mastery(items[q.id], day), 0) / signPool.length : 1;
  const recent = attempts.filter((a) => a.kind === 'mock' && day - a.day <= 14);
  const passed = recent.filter((a) => a.passed);
  const last3 = recent.slice(-3);
  const strongMocks = last3.length === 3 && last3.every((a) => a.correct >= Math.min(total, passMark + 1));
  const mockDays = new Set(last3.map((a) => a.day)).size;
  const weakLessons = Object.entries(lessonsM).filter(([, m]) => m < 0.7).map(([k]) => k);

  let state = 'start';
  if (seen / n >= 0.5) state = 'onTheWay';
  if (overall >= 0.7 && passed.length >= 2) state = 'close';
  if (overall >= 0.8 && !weakLessons.length && signM >= 0.8 && strongMocks && mockDays >= 2) state = 'ready';

  return {
    state,
    seen,
    total: pool.length,
    overall,
    signMastery: signM,
    weakLessons,
    recentMocks: recent.length,
    passedMocks: passed.length,
  };
}
