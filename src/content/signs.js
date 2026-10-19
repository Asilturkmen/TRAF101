import { hashString, mulberry32, shuffle } from '../lib/random.js';

const categoryFile = import.meta.glob('../../content/signs/categories.json', { eager: true, import: 'default' });
const signFiles = import.meta.glob(['../../content/signs/*.json', '!../../content/signs/categories.json'], {
  eager: true,
  import: 'default',
});

const ORDER = ['warning', 'priority', 'prohibitory', 'mandatory', 'information', 'additional'];

export const categories = (Object.values(categoryFile)[0] || [])
  .slice()
  .sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

export const signs = Object.values(signFiles)
  .flat()
  .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category));

const byId = new Map(signs.map((s) => [s.id, s]));
export const signById = (id) => byId.get(id) || null;
export const categoryById = (id) => categories.find((c) => c.id === id) || null;
export const categoryBySlug = (lang, slug) => categories.find((c) => c.slug[lang] === slug) || null;
export const signsInCategory = (id) => signs.filter((s) => s.category === id);
export const signBySlug = (lang, categorySlug, slug) => {
  const cat = categoryBySlug(lang, categorySlug);
  if (!cat) return null;
  return signs.find((s) => s.category === cat.id && s.slug[lang] === slug) || null;
};

// A representative sign for each category, used as the category icon.
const ICON = {
  warning: 'warning.other-danger',
  priority: 'priority.give-way',
  prohibitory: 'prohibitory.no-entry',
  mandatory: 'mandatory.ahead-only',
  information: 'information.parking',
};
export const categoryIcon = (id) => signById(ICON[id]) || signsInCategory(id)[0] || null;

// Variants that mean the same thing must never be offered as each other's distractor.
const SAME_MEANING = [['priority.stop', 'priority.stop--dur-stop']];
const sameMeaning = (a, b) => SAME_MEANING.some((g) => g.includes(a.id) && g.includes(b.id));

// "What does this sign mean?" questions are generated from the sign data so the
// study pages and the quizzes can never disagree. Distractors prefer the signs the
// data lists as easily confused, then signs of the same category.
export function signQuestion(sign) {
  const rand = mulberry32(hashString(sign.id));
  const confusions = (sign.confusions || []).map((c) => signById(c.with)).filter(Boolean);
  const sameCategory = shuffle(signsInCategory(sign.category).filter((s) => s.id !== sign.id), rand);
  const others = shuffle(signs.filter((s) => s.id !== sign.id && s.category !== sign.category), rand);
  const pool = [];
  for (const s of [...confusions, ...sameCategory, ...others]) {
    if (pool.length === 3) break;
    if (!pool.includes(s) && s.name.tr !== sign.name.tr && !sameMeaning(s, sign)) pool.push(s);
  }
  const ordered = shuffle([sign, ...pool], rand);
  const letters = ['a', 'b', 'c', 'd'];
  return {
    id: `sign:${sign.id}`,
    rev: 1,
    generated: true,
    topic: 'rules',
    lesson: 'signs-basics',
    tracks: ['car', 'moto', 'heavy'],
    difficulty: sign.examPriority === 'core' ? 'easy' : 'medium',
    prompt: { tr: 'Bu levha ne anlama gelir?', en: 'What does this sign mean?' },
    options: ordered.map((s, i) => ({ id: letters[i], text: s.name })),
    answer: letters[ordered.indexOf(sign)],
    why: sign.meaning,
    signId: sign.id,
    basis: 'sign',
  };
}

export const signQuestions = () => signs.map(signQuestion);
