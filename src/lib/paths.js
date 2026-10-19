// Entity-aware links. Every view builds URLs through these helpers.
import { pathFor } from '../router/table.js';
import { categoryById } from '../content/signs.js';
import { lessonMetaById, trackById } from '../content/meta.js';

export const to = (name, lang, params) => pathFor(name, lang, params);

export function signPath(sign, lang) {
  const cat = categoryById(sign.category);
  return pathFor('sign', lang, { category: cat.slug[lang], sign: sign.slug[lang] });
}

export function categoryPath(cat, lang) {
  return pathFor('signCategory', lang, { category: cat.slug[lang] });
}

export function lessonPath(lessonOrId, lang) {
  const meta = typeof lessonOrId === 'string' ? lessonMetaById(lessonOrId) : lessonOrId;
  return pathFor('lesson', lang, { lesson: meta.slug[lang] });
}

export function lessonPracticePath(lessonOrId, lang) {
  const meta = typeof lessonOrId === 'string' ? lessonMetaById(lessonOrId) : lessonOrId;
  return pathFor('lessonPractice', lang, { lesson: meta.slug[lang] });
}

export function mockPath(trackOrId, lang) {
  const t = typeof trackOrId === 'string' ? trackById(trackOrId) : trackOrId;
  return pathFor('mockExam', lang, { track: t.slug[lang] });
}

// Both language versions of the same page, for the language switch and hreflang.
export const both = (fn) => ({ tr: fn('tr'), en: fn('en') });
