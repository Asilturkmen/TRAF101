import { describe, it, expect } from 'vitest';
import { answer, emptyEntry, reconcile, isDue, inMistakes, mastery, INTERVAL } from '../../src/lib/leitner.js';

describe('leitner schedule', () => {
  it('moves a new item to box 2 on a correct answer', () => {
    const e = answer(null, true, 100);
    expect(e.b).toBe(2);
    expect(e.d).toBe(100 + INTERVAL[2]);
    expect(e.s).toBe(1);
    expect(inMistakes(e)).toBe(false);
  });

  it('sends a wrong answer to box 1 and into the mistake bank', () => {
    const e = answer(answer(null, true, 100), false, 102);
    expect(e.b).toBe(1);
    expect(e.w).toBe(1);
    expect(inMistakes(e)).toBe(true);
  });

  it('promotes at most once per day', () => {
    let e = answer(null, true, 100);
    e = answer(e, true, 100);
    e = answer(e, true, 100);
    expect(e.b).toBe(2);
    e = answer(e, true, 101);
    expect(e.b).toBe(3);
  });

  it('leaves the mistake bank after correct answers on two different days', () => {
    let e = answer(null, false, 100);
    e = answer(e, true, 100); // same day as the mistake: does not count
    expect(inMistakes(e)).toBe(true);
    e = answer(e, true, 101);
    expect(inMistakes(e)).toBe(true);
    e = answer(e, true, 101); // same day again
    expect(inMistakes(e)).toBe(true);
    e = answer(e, true, 103);
    expect(inMistakes(e)).toBe(false);
  });

  it('caps the box at 6', () => {
    let e = null;
    for (let d = 0; d < 20; d++) e = answer(e, true, d);
    expect(e.b).toBe(6);
  });

  it('drops two boxes when the content revision changes', () => {
    let e = emptyEntry(1);
    for (let d = 0; d < 4; d++) e = answer(e, true, d, 1);
    expect(e.b).toBe(5);
    expect(reconcile(e, 2).b).toBe(3);
    expect(reconcile(emptyEntry(1), 2).b).toBe(0);
  });

  it('knows when an item is due and how well it is known', () => {
    const e = answer(null, true, 100);
    expect(isDue(e, 100)).toBe(false);
    expect(isDue(e, 101)).toBe(true);
    expect(mastery(null, 100)).toBe(0);
    expect(mastery(e, 101)).toBeGreaterThan(0);
    // Long overdue counts one box lower.
    expect(mastery(e, 200)).toBeLessThan(mastery(e, 101));
  });
});
