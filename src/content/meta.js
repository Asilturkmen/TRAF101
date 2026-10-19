import tracks from '../../content/tracks.json';
import topics from '../../content/topics.json';
import lessonIndex from '../../content/lessons.json';
import examProfile from '../../content/exam-profile.json';

const sourceFiles = import.meta.glob('../../content/sources/*.json', { eager: true, import: 'default' });

export { tracks, topics, lessonIndex, examProfile };

export const sources = Object.values(sourceFiles).flat();
const sourceMap = new Map(sources.map((s) => [s.id, s]));
export const sourceById = (id) => sourceMap.get(id) || null;

export const trackById = (id) => tracks.find((t) => t.id === id) || null;
export const trackBySlug = (lang, slug) => tracks.find((t) => t.slug[lang] === slug) || null;
export const topicById = (id) => topics.find((t) => t.id === id) || null;
export const formatById = (id) => examProfile.formats.find((f) => f.id === id) || null;
export const formatForTrack = (trackId) => formatById(trackById(trackId)?.exam);

export const lessonMetaById = (id) => lessonIndex.find((l) => l.id === id) || null;
export const lessonMetaBySlug = (lang, slug) => lessonIndex.find((l) => l.slug[lang] === slug) || null;
