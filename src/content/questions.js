import { signQuestions } from './signs.js';

const files = import.meta.glob('../../content/questions/*.json', { eager: true, import: 'default' });

export const writtenQuestions = Object.values(files).flat();
export const allQuestions = [...writtenQuestions, ...signQuestions()];

const byId = new Map(allQuestions.map((q) => [q.id, q]));
export const questionById = (id) => byId.get(id) || null;

export const questionsFor = ({ track, topic, lesson } = {}) =>
  allQuestions.filter(
    (q) => (!track || q.tracks.includes(track)) && (!topic || q.topic === topic) && (!lesson || q.lesson === lesson),
  );

export const questionCount = (filter) => questionsFor(filter).length;
