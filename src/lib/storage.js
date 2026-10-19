// Single localStorage key with a schema version. Every access is guarded: private
// windows, blocked storage and quota errors must never break the page. Loaded and
// imported data is sanitised field by field, so a damaged or hand-edited file can
// never put the app into a state that throws later.

export const STORAGE_KEY = 't2d.v1';
export const SCHEMA = 1;

export function emptyState() {
  return {
    schema: SCHEMA,
    items: {},
    attempts: [],
    mock: {}, // unfinished mock exams by track id
    settings: { track: 'car', timeFactor: 1, dismissedLangHint: false },
    stats: { days: [] },
  };
}

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const int = (v, d = 0) => (Number.isInteger(v) ? v : d);
const ENTRY_KEYS = ['b', 'd', 's', 'w', 'l', 'p', 'm', 'h', 'r', 'f'];

function cleanEntry(e) {
  if (!isObj(e)) return null;
  const out = {};
  for (const k of ENTRY_KEYS) if (k in e) out[k] = int(e[k], k === 'r' ? 1 : -1);
  if (!Number.isInteger(out.b) || out.b < 0 || out.b > 6) return null;
  return { b: out.b, d: int(out.d, 0), s: Math.max(0, int(out.s, 0)), w: Math.max(0, int(out.w, 0)), l: int(out.l, -1), p: int(out.p, -1), m: int(out.m, -1), h: int(out.h, -1), r: int(out.r, 1), ...(Number.isInteger(out.f) ? { f: out.f } : {}) };
}

function cleanMock(m) {
  if (!isObj(m) || !Array.isArray(m.questionIds) || !isObj(m.answers) || typeof m.track !== 'string') return null;
  return {
    ...m,
    questionIds: m.questionIds.filter((x) => typeof x === 'string'),
    answers: Object.fromEntries(Object.entries(m.answers).filter(([, v]) => typeof v === 'string')),
    flagged: Array.isArray(m.flagged) ? m.flagged.filter((x) => typeof x === 'string') : [],
    key: isObj(m.key) ? m.key : {},
    index: int(m.index, 0),
    elapsed: Math.max(0, int(m.elapsed, 0)),
    limit: Math.max(0, int(m.limit, 0)),
    seed: int(m.seed, 1),
  };
}

export function sanitize(raw) {
  const base = emptyState();
  if (!isObj(raw)) return base;
  const items = {};
  if (isObj(raw.items)) {
    for (const [id, e] of Object.entries(raw.items)) {
      const c = cleanEntry(e);
      if (c) items[id] = c;
    }
  }
  const attempts = Array.isArray(raw.attempts)
    ? raw.attempts.filter((a) => isObj(a) && typeof a.id === 'string' && Number.isInteger(a.correct) && Number.isInteger(a.total) && Array.isArray(a.questionIds) && isObj(a.answers))
    : [];
  // Schema 1 first shipped with a single mock object; keep it under its track.
  let mockSource = raw.mock;
  if (isObj(mockSource) && Array.isArray(mockSource.questionIds)) mockSource = { [mockSource.track]: mockSource };
  const mock = {};
  if (isObj(mockSource)) {
    for (const [track, m] of Object.entries(mockSource)) {
      const c = cleanMock(m);
      if (c && c.track === track) mock[track] = c;
    }
  }
  const s = isObj(raw.settings) ? raw.settings : {};
  const settings = {
    track: ['car', 'moto', 'heavy'].includes(s.track) ? s.track : base.settings.track,
    timeFactor: [0, 1, 1.5, 2].includes(s.timeFactor) ? s.timeFactor : 1,
    dismissedLangHint: s.dismissedLangHint === true,
  };
  const days = Array.isArray(raw.stats?.days) ? raw.stats.days.filter(Number.isInteger).slice(-90) : [];
  return { schema: SCHEMA, items, attempts: attempts.slice(-50), mock, settings, stats: { days } };
}

export function storageAvailable() {
  try {
    const k = '__t2d_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { state: raw ? sanitize(JSON.parse(raw)) : emptyState(), ok: true };
  } catch {
    return { state: emptyState(), ok: false };
  }
}

export function save(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clear() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function exportJson(state) {
  return JSON.stringify({ app: 'test2drive', exportedAt: new Date().toISOString(), ...state }, null, 2);
}

export function importJson(text) {
  const parsed = JSON.parse(text);
  if (!isObj(parsed) || parsed.app !== 'test2drive') throw new Error('not-a-test2drive-file');
  if (parsed.schema !== SCHEMA) throw new Error('unsupported-schema');
  const { app, exportedAt, ...rest } = parsed;
  return sanitize(rest);
}

export async function requestPersistence() {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* not supported */
  }
  return false;
}
