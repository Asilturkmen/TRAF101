// Single localStorage key with a schema version. Every access is guarded: private
// windows, blocked storage and quota errors must never break the page.

export const STORAGE_KEY = 't2d.v1';
export const SCHEMA = 1;

export function emptyState() {
  return {
    schema: SCHEMA,
    items: {},
    attempts: [],
    mock: null,
    settings: { track: 'car', timeFactor: 1, lang: null, dismissedLangHint: false },
    stats: { days: [] },
  };
}

function migrate(raw) {
  if (!raw || typeof raw !== 'object') return emptyState();
  const base = emptyState();
  // Schema 1 is the first version; later versions add steps here.
  return {
    ...base,
    ...raw,
    settings: { ...base.settings, ...(raw.settings || {}) },
    stats: { ...base.stats, ...(raw.stats || {}) },
    items: raw.items && typeof raw.items === 'object' ? raw.items : {},
    attempts: Array.isArray(raw.attempts) ? raw.attempts : [],
    schema: SCHEMA,
  };
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
    return { state: raw ? migrate(JSON.parse(raw)) : emptyState(), ok: true };
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
  if (!parsed || parsed.app !== 'test2drive') throw new Error('not-a-test2drive-file');
  const { app, exportedAt, ...rest } = parsed;
  return migrate(rest);
}

export async function requestPersistence() {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* not supported */
  }
  return false;
}
