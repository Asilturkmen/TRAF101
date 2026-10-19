// The same page in the other language, computed from the route alone. Used by the
// header's language switch, so it is correct in the prerendered HTML too.
import { TABLE, fill } from '../router/table.js';

// eslint-disable-next-line no-undef
const SLUGS = typeof __SLUG_MAP__ !== 'undefined' ? __SLUG_MAP__ : {};
const KEEP_QUERY = { mockResult: 'id', signExam: 'c' };

export function otherLanguagePath(route) {
  const lang = route.meta?.lang || 'tr';
  const other = lang === 'tr' ? 'en' : 'tr';
  const key = route.meta?.key;
  const entry = TABLE[key];
  if (!entry || key === 'notFound') return TABLE.home[other];
  const params = {};
  for (const [name, value] of Object.entries(route.params || {})) {
    const translated = SLUGS[name]?.[lang]?.[value];
    if (!translated) return TABLE.home[other];
    params[name] = translated;
  }
  let path;
  try {
    path = fill(entry[other], params);
  } catch {
    return TABLE.home[other];
  }
  const q = KEEP_QUERY[key];
  const value = q ? route.query?.[q] : undefined;
  return value == null ? path : `${path}?${q}=${encodeURIComponent(String(value))}`;
}
