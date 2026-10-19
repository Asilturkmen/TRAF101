#!/usr/bin/env node
// Runs after `vite-ssg build`: 404 page, sitemap, robots, Open Graph images and the
// service worker. Everything here works on any static host.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { generateSW } from 'workbox-build';
import { TABLE } from '../src/router/table.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://test2drive.example').replace(/\/$/, '');
const skipOg = process.argv.includes('--no-og');

if (!process.env.VITE_SITE_URL) {
  console.warn('[postbuild] VITE_SITE_URL is not set; canonical and sitemap URLs use the placeholder domain.');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const toUrlPath = (file) => {
  const rel = path.relative(dist, file).replaceAll('\\', '/');
  return '/' + rel.replace(/index\.html$/, '');
};

// 1. A root 404.html for static hosts (the prerendered /404/ page).
const notFound = path.join(dist, '404', 'index.html');
if (fs.existsSync(notFound)) fs.copyFileSync(notFound, path.join(dist, '404.html'));

// Legacy files from the course version are not part of the product.
for (const f of ['signs.json', 'scenarios.json']) fs.rmSync(path.join(dist, f), { force: true });

// 2. Collect pages.
const htmlFiles = walk(dist).filter((f) => f.endsWith('index.html'));
const pages = htmlFiles.map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const get = (re) => (html.match(re) || [])[1];
  const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)" href="([^"]+)"/g)].map((m) => ({ lang: m[1], href: m[2] }));
  return {
    file,
    path: toUrlPath(file),
    html,
    lang: get(/<html lang="([a-z]+)"/) || 'tr',
    title: (get(/<meta property="og:title" content="([^"]*)"/) || get(/<title>([^<]*)<\/title>/) || 'Test2Drive')
      .replace(/ \| Test2Drive$/, '')
      .replace(/&amp;/g, '&')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&quot;/g, '"'),
    noindex: /<meta name="robots" content="noindex"/.test(html),
    alternates,
  };
});
const indexable = pages.filter((p) => !p.noindex && !p.path.startsWith('/404') && !p.path.startsWith('/en/404'));

// 3. Sitemap with hreflang alternates, and robots.txt.
const today = new Date().toISOString().slice(0, 10);
const urls = indexable
  .sort((a, b) => a.path.localeCompare(b.path))
  .map((p) => {
    const links = p.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`).join('\n');
    return `  <url>\n    <loc>${SITE_URL}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n${links}\n  </url>`;
  })
  .join('\n');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`[postbuild] sitemap: ${indexable.length} pages`);

// 4. Open Graph cards: one template, the page title, the brand gradient.
if (!skipOg) {
  const font = (w, sub) => fs.readFileSync(path.join(root, `node_modules/@fontsource/inter/files/inter-${sub}-${w}-normal.woff`));
  const fonts = [
    { name: 'Inter', data: font(400, 'latin'), weight: 400, style: 'normal' },
    { name: 'Inter', data: font(800, 'latin'), weight: 800, style: 'normal' },
    // Turkish letters live in the latin-ext subset; as a separate fallback family
    // they render without taking over the line metrics.
    { name: 'InterExt', data: font(400, 'latin-ext'), weight: 400, style: 'normal' },
    { name: 'InterExt', data: font(800, 'latin-ext'), weight: 800, style: 'normal' },
  ];
  const logo = `data:image/png;base64,${fs.readFileSync(path.join(root, 'public/logo-320.png')).toString('base64')}`;
  const signImg = (p) => {
    const m = p.html.match(/<meta property="og:type" content="[^"]*"[^>]*>/) && p.html.match(/"image":"[^"]*(\/signs\/[^"]+\.svg)"/);
    if (!m) return null;
    const file = path.join(dist, m[1]);
    return fs.existsSync(file) ? `data:image/svg+xml;base64,${fs.readFileSync(file).toString('base64')}` : null;
  };
  const h = (type, style, children) => ({ type, props: { style, children } });
  let n = 0;
  for (const p of pages) {
    const out = path.join(dist, 'og', p.path.slice(1), 'card.png');
    const sign = signImg(p);
    const tagline = p.lang === 'tr' ? 'KKTC ehliyet sınavına hazırlık' : 'North Cyprus driving theory test practice';
    const tree = h(
      'div',
      {
        width: 1200,
        height: 630,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '64px 72px',
        backgroundImage: 'linear-gradient(135deg, #377272 0%, #2D6363 50%, #1F4545 100%)',
        fontFamily: 'Inter, InterExt',
        color: 'white',
      },
      [
        h('div', { display: 'flex' }, [
          h('div', { display: 'flex', background: 'white', borderRadius: 16, padding: '14px 22px' }, [
            { type: 'img', props: { src: logo, width: 192, height: 48 } },
          ]),
        ]),
        h('div', { display: 'flex', position: 'absolute', left: 72, top: 300, width: 1056, height: 266, alignItems: 'flex-end', justifyContent: 'space-between' }, [
          h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 266, width: sign ? 760 : 1056 }, [
            h('div', { display: 'flex', fontSize: p.title.length > 40 ? 54 : 66, fontWeight: 800 }, p.title),
            h('div', { display: 'flex', fontSize: 30, marginTop: 20, color: 'rgba(255,255,255,0.88)' }, tagline),
          ]),
          ...(sign ? [{ type: 'img', props: { src: sign, width: 240, height: 240 } }] : []),
        ]),
      ],
    );
    const svg = await satori(tree, { width: 1200, height: 630, fonts });
    if (process.env.OG_DEBUG && p.path === process.env.OG_DEBUG) fs.writeFileSync(path.join(root, 'og-debug.svg'), svg);
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, png);
    n++;
  }
  console.log(`[postbuild] og images: ${n}`);
}

// 5. Service worker: app shell, content, signs and the main pages offline.
const CORE = ['home', 'practise', 'review', 'signExam', 'mistakes', 'scenarios', 'signs', 'topics', 'mock', 'progress'];
const coreHtml = [
  '404.html',
  ...CORE.flatMap((k) => ['tr', 'en'].map((l) => `${TABLE[k][l].slice(1)}index.html`)),
].filter((f) => fs.existsSync(path.join(dist, f)));
const { count, size, warnings } = await generateSW({
  globDirectory: dist,
  globPatterns: ['assets/**/*.{js,css,woff2}', 'signs/**/*.svg', 'icons/*.png', 'logo-320.png', 'favicon.ico', 'manifest.webmanifest', ...coreHtml],
  globIgnores: ['og/**'],
  swDest: path.join(dist, 'sw.js'),
  skipWaiting: false,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
  navigateFallback: null,
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 4,
        expiration: { maxEntries: 200 },
        plugins: [
          {
            handlerDidError: async ({ request }) => {
              const url = new URL(request.url);
              const key = url.pathname.startsWith('/en/') ? '/en/' : '/';
              return (await caches.match(key, { ignoreSearch: true })) || Response.error();
            },
          },
        ],
      },
    },
    {
      urlPattern: ({ url }) => url.pathname.startsWith('/og/'),
      handler: 'CacheFirst',
      options: { cacheName: 'og', expiration: { maxEntries: 20 } },
    },
  ],
});
for (const w of warnings) console.warn('[postbuild] workbox:', w);
console.log(`[postbuild] service worker: ${count} files, ${(size / 1024).toFixed(0)} KiB precached`);
