// The question bank, loaded on demand and per language (see the questionsByLang
// plugin in vite.config.js). Only practice screens need it, and only in the
// browser, so it never enters the prerendered pages or the app shell.
import { signQuestions } from './signs.js';

const loaders = {
  tr: () => import('virtual:questions/tr'),
  en: () => import('virtual:questions/en'),
};
const cache = new Map();

function makeBank(written) {
  const all = [...written, ...signQuestions()];
  const byId = new Map(all.map((q) => [q.id, q]));
  return {
    writtenQuestions: written,
    allQuestions: all,
    questionById: (id) => byId.get(id) || null,
    questionsFor: ({ track, topic, lesson } = {}) =>
      all.filter((q) => (!track || q.tracks.includes(track)) && (!topic || q.topic === topic) && (!lesson || q.lesson === lesson)),
  };
}

export function loadQuestions(lang = 'tr') {
  const key = lang === 'en' ? 'en' : 'tr';
  if (!cache.has(key)) cache.set(key, loaders[key]().then((m) => makeBank(m.default)));
  return cache.get(key);
}
