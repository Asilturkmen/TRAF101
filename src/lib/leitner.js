// Leitner review schedule kept per item in localStorage (see docs/research/benchmark.md §2).
// Entry shape (short keys keep storage small):
//   b  box 0..6 (0 = never seen, 1 = wrong or new, 6 = mastered)
//   d  next due day (local day number)
//   s  times seen, w times wrong
//   l  last day seen, p last day promoted (promotion at most once per day)
//   m  mistake-bank hits: -1 = not in the bank, 0..1 = correct days since entering
//   h  last day a mistake hit was counted
//   r  content revision the entry was recorded against
//   f  first day seen

export const INTERVAL = { 1: 1, 2: 1, 3: 3, 4: 7, 5: 14, 6: 30 };
export const MASTERY = [0, 0.1, 0.35, 0.6, 0.8, 0.95, 0.95];
const MISTAKE_EXIT_DAYS = 2;

export function dayNumber(date = new Date()) {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local / 86400000);
}

export function emptyEntry(rev = 1) {
  return { b: 0, d: 0, s: 0, w: 0, l: -1, p: -1, m: -1, h: -1, r: rev };
}

// Apply a content revision change: the item drops two boxes, but stays seen.
export function reconcile(entry, rev) {
  if (!entry) return emptyEntry(rev);
  if (entry.r === rev) return entry;
  const b = entry.b === 0 ? 0 : Math.max(1, entry.b - 2);
  return { ...entry, b, r: rev };
}

export function answer(entry, correct, day, rev = 1) {
  const e = { ...reconcile(entry, rev) };
  if (e.s === 0) e.f = day; // first day this item was seen (daily new-item limit)
  e.s += 1;
  e.l = day;
  if (correct) {
    if (e.p !== day) {
      e.b = e.b === 0 ? 2 : Math.min(6, e.b + 1);
      e.p = day;
    }
    e.d = day + INTERVAL[e.b];
    if (e.m >= 0 && e.h !== day) {
      e.m += 1;
      e.h = day;
      if (e.m >= MISTAKE_EXIT_DAYS) {
        e.m = -1;
        e.h = -1;
      }
    }
  } else {
    e.w += 1;
    e.b = 1;
    e.d = day + INTERVAL[1];
    e.m = 0;
    e.h = day;
  }
  return e;
}

// "I knew it" / "I didn't" from self-graded sign naming works like an answer.
export const selfGrade = answer;

export function isDue(entry, day) {
  return !!entry && entry.b >= 1 && entry.d <= day;
}

export function inMistakes(entry) {
  return !!entry && entry.m >= 0;
}

export function mastery(entry, day) {
  if (!entry || entry.b === 0) return 0;
  let b = entry.b;
  const overdue = day - entry.d;
  if (overdue > INTERVAL[b]) b = Math.max(1, b - 1);
  return MASTERY[b];
}
