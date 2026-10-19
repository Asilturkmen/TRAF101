// Helpers for bilingual content objects ({ tr, en }) and the small prose format
// used in content files: blank-line paragraphs, "- " bullets and **bold**.

export const LANGS = ['tr', 'en'];
export const DEFAULT_LANG = 'tr';

export function tx(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value[DEFAULT_LANG] ?? '';
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ESCAPES[c]);

function inline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function proseToHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (!lines.length) return '';
      if (lines.every((l) => l.startsWith('- '))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`;
      }
      // Mixed block: leading paragraph lines, then bullets.
      const firstBullet = lines.findIndex((l) => l.startsWith('- '));
      if (firstBullet > 0) {
        const para = lines.slice(0, firstBullet).join(' ');
        const items = lines.slice(firstBullet).map((l) => `<li>${inline(l.replace(/^- /, ''))}</li>`).join('');
        return `<p>${inline(para)}</p><ul>${items}</ul>`;
      }
      return `<p>${inline(lines.join(' '))}</p>`;
    })
    .join('');
}

export function plain(text) {
  return String(text || '').replace(/\*\*/g, '').replace(/^- /gm, '').replace(/\s+/g, ' ').trim();
}

export function truncate(text, max = 155) {
  const s = plain(text);
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

// Turkish-aware number and percentage formatting.
export function fmtPercent(value, lang) {
  const n = Math.round(value);
  return lang === 'tr' ? `%${n}` : `${n}%`;
}

export function fmtDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function fmtDuration(seconds, lang) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (lang === 'tr') return m ? `${m} dk ${s} sn` : `${s} sn`;
  return m ? `${m} min ${s} s` : `${s} s`;
}
