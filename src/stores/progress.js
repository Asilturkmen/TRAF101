import { defineStore } from 'pinia';
import * as storage from '../lib/storage.js';
import { answer as leitnerAnswer, dayNumber, isDue, inMistakes, reconcile } from '../lib/leitner.js';

const MAX_ATTEMPTS = 50;
const PERSISTED = ['schema', 'items', 'attempts', 'mock', 'settings', 'stats'];

export const useProgress = defineStore('progress', {
  state: () => ({
    ...storage.emptyState(),
    loaded: false,
    canSave: true,
  }),
  getters: {
    hasProgress: (s) => Object.keys(s.items).length > 0 || s.attempts.length > 0,
    entry: (s) => (id) => s.items[id] || null,
    dueCount: (s) => (pool) => pool.filter((q) => isDue(s.items[q.id], dayNumber())).length,
    mistakeCount: (s) => (pool) => pool.filter((q) => inMistakes(s.items[q.id])).length,
    mockAttempts: (s) => s.attempts.filter((a) => a.kind === 'mock'),
    mockFor: (s) => (track) => s.mock?.[track] || null,
  },
  actions: {
    // Called on the client after mount, never during prerendering.
    load() {
      if (this.loaded || typeof window === 'undefined') return;
      const { state, ok } = storage.load();
      this.canSave = ok && storage.storageAvailable();
      Object.assign(this, state, { loaded: true });
      // Another tab changed progress: take its version.
      window.addEventListener('storage', (e) => {
        if (e.key !== storage.STORAGE_KEY) return;
        Object.assign(this, storage.load().state);
      });
    },
    // Every change is read-modify-write against the latest saved state, so two open
    // tabs add to each other's progress instead of overwriting it.
    mutate(fn) {
      if (typeof window === 'undefined') return;
      if (!this.loaded) this.load();
      const { state, ok } = storage.load();
      const base = ok ? state : this.snapshot();
      fn(base);
      this.canSave = storage.save(base);
      Object.assign(this, base);
    },
    snapshot() {
      return JSON.parse(JSON.stringify(Object.fromEntries(PERSISTED.map((k) => [k, this[k]]))));
    },
    record(item, correct, opts = {}) {
      const day = dayNumber();
      this.mutate((s) => {
        s.items[item.id] = leitnerAnswer(s.items[item.id], correct, day, item.rev || 1, opts);
        if (!s.stats.days.includes(day)) s.stats.days = [...s.stats.days.slice(-89), day];
      });
    },
    recordMany(list) {
      const day = dayNumber();
      this.mutate((s) => {
        for (const { item, correct } of list) s.items[item.id] = leitnerAnswer(s.items[item.id], correct, day, item.rev || 1);
        if (!s.stats.days.includes(day)) s.stats.days = [...s.stats.days.slice(-89), day];
      });
    },
    // Items whose content revision changed drop two boxes and become due now.
    reconcile(pool) {
      const day = dayNumber();
      const stale = pool.filter((q) => this.items[q.id] && this.items[q.id].r !== (q.rev || 1));
      if (!stale.length) return;
      this.mutate((s) => {
        for (const q of stale) {
          const e = s.items[q.id];
          if (e && e.r !== (q.rev || 1)) s.items[q.id] = { ...reconcile(e, q.rev || 1), d: Math.min(e.d, day) };
        }
      });
    },
    addAttempt(attempt) {
      const day = dayNumber();
      this.mutate((s) => {
        s.attempts = [...s.attempts, { ...attempt, day }].slice(-MAX_ATTEMPTS);
      });
    },
    setMock(track, mock) {
      this.mutate((s) => {
        const next = { ...(s.mock || {}) };
        if (mock) next[track] = mock;
        else delete next[track];
        s.mock = next;
      });
    },
    setSetting(key, value) {
      this.mutate((s) => {
        s.settings = { ...s.settings, [key]: value };
      });
    },
    reset() {
      storage.clear();
      Object.assign(this, storage.emptyState(), { loaded: true });
      this.canSave = storage.save(this.snapshot());
    },
    exportData() {
      return storage.exportJson(this.snapshot());
    },
    importData(text) {
      const state = storage.importJson(text);
      this.canSave = storage.save(state);
      Object.assign(this, state, { loaded: true });
    },
  },
});
