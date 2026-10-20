// Entity-aware links. Every view builds URLs through these helpers. Category
// slugs come from a build-time table, so this module (used by the app shell) does
// not pull the sign data into every page.
import { pathFor } from '../router/table.js';
import { lessonMetaById, trackById } from '../content/meta.js';

// eslint-disable-next-line no-undef
const STATS = typeof __CONTENT_STATS__ !== 'undefined' ? __CONTENT_STATS__ : { categorySlugs: {}, lessonTitles: {} };

export const to = (name, lang, params) => pathFor(name, lang, params);

export function signPath(sign, lang) {
  const slug = STATS.categorySlugs[sign.category];
  return pathFor('sign', lang, { category: slug[lang], sign: sign.slug[lang] });
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

// A lesson's title without loading the lesson documents.
export const lessonTitle = (id) => STATS.lessonTitles[id] || null;

// Both language versions of the same page, for the language switch and hreflang.
export const both = (fn) => ({ tr: fn('tr'), en: fn('en') });
