import { defineStore } from 'pinia';
import * as storage from '../lib/storage.js';
import { answer as leitnerAnswer, dayNumber, isDue, inMistakes } from '../lib/leitner.js';

const MAX_ATTEMPTS = 50;

export const useProgress = defineStore('progress', {
  state: () => ({
    ...storage.emptyState(),
    loaded: false,
    canSave: true,
  }),
  getters: {
    today: () => dayNumber(),
    hasProgress: (s) => Object.keys(s.items).length > 0 || s.attempts.length > 0,
    entry: (s) => (id) => s.items[id] || null,
    dueCount: (s) => (pool) => pool.filter((q) => isDue(s.items[q.id], dayNumber())).length,
    mistakeCount: (s) => (pool) => pool.filter((q) => inMistakes(s.items[q.id])).length,
    mockAttempts: (s) => s.attempts.filter((a) => a.kind === 'mock'),
  },
  actions: {
    // Called once on the client after mount. Never during prerendering.
    load() {
      if (this.loaded || typeof window === 'undefined') return;
      const { state, ok } = storage.load();
      this.canSave = ok && storage.storageAvailable();
      Object.assign(this, state, { loaded: true });
    },
    persist() {
      if (typeof window === 'undefined' || !this.loaded) return;
      const { loaded, canSave, ...data } = this.$state;
      this.canSave = storage.save(data);
    },
    markDay() {
      const d = dayNumber();
      if (!this.stats.days.includes(d)) this.stats.days = [...this.stats.days.slice(-89), d];
    },
    record(item, correct) {
      this.items[item.id] = leitnerAnswer(this.items[item.id], correct, dayNumber(), item.rev || 1);
      this.markDay();
      this.persist();
    },
    addAttempt(attempt) {
      this.attempts = [...this.attempts, { ...attempt, day: dayNumber() }].slice(-MAX_ATTEMPTS);
      this.persist();
    },
    setMock(mock) {
      this.mock = mock;
      this.persist();
    },
    setSetting(key, value) {
      this.settings = { ...this.settings, [key]: value };
      this.persist();
    },
    reset() {
      storage.clear();
      Object.assign(this, storage.emptyState(), { loaded: true });
      this.persist();
    },
    exportData() {
      const { loaded, canSave, ...data } = this.$state;
      return storage.exportJson(data);
    },
    importData(text) {
      const state = storage.importJson(text);
      Object.assign(this, state, { loaded: true });
      this.persist();
    },
  },
});
