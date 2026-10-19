// Lessons (Konular) and guide pages share one document shape.
import { lessonIndex } from './meta.js';

const lessonFiles = import.meta.glob('../../content/lessons/*.json', { eager: true, import: 'default' });
const pageFiles = import.meta.glob('../../content/pages/*.json', { eager: true, import: 'default' });
const glossaryFile = import.meta.glob('../../content/glossary.json', { eager: true, import: 'default' });

const lessonDocs = new Map(Object.values(lessonFiles).map((d) => [d.id, d]));

export const lessons = lessonIndex
  .map((meta) => ({ ...meta, doc: lessonDocs.get(meta.id) || null }))
  .filter((l) => l.doc);

export const lessonById = (id) => lessons.find((l) => l.id === id) || null;
export const lessonBySlug = (lang, slug) => lessons.find((l) => l.slug[lang] === slug) || null;

export const PAGE_SLUGS = {
  exam: { tr: 'sinav-nasil-yapilir', en: 'how-the-exam-works' },
  licence: { tr: 'ehliyet-nasil-alinir', en: 'getting-a-licence' },
  'left-driving': { tr: 'soldan-trafik', en: 'driving-on-the-left' },
  sources: { tr: 'kaynaklar', en: 'sources' },
  about: { tr: 'hakkinda', en: 'about' },
  privacy: { tr: 'gizlilik', en: 'privacy' },
};

const pages = new Map(
  Object.entries(pageFiles).map(([path, doc]) => [path.split('/').pop().replace('.json', ''), doc]),
);
export const pageById = (id) => pages.get(id) || null;

export const glossary = Object.values(glossaryFile)[0] || [];
