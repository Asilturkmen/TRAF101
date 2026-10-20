#!/usr/bin/env node
// Minimal static server for the production build, behaving like a typical static
// host: nested index.html, real 404 status with 404.html, long cache for assets.
import http from 'node:http';
import zlib from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', process.env.DIST || 'dist');
const port = Number(process.argv[2] || process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

// Text files are gzip-compressed like on any production static host
// (Cloudflare, Netlify, nginx); without this, measurements overstate transfer time.
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.svg', '.xml', '.txt', '.md']);

function send(res, status, file, req) {
  const ext = path.extname(file);
  const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream', Vary: 'Accept-Encoding' };
  if (file.includes(`${path.sep}assets${path.sep}`)) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  else headers['Cache-Control'] = 'no-cache';
  const gzip = COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req?.headers['accept-encoding'] || '') && !process.env.NO_GZIP;
  const stream = fs.createReadStream(file);
  stream.on('error', () => {
    if (!res.headersSent) res.writeHead(500);
    res.end();
  });
  stream.on('open', () => {
    if (gzip) {
      res.writeHead(status, { ...headers, 'Content-Encoding': 'gzip' });
      stream.pipe(zlib.createGzip({ level: 6 })).pipe(res);
    } else {
      res.writeHead(status, headers);
      stream.pipe(res);
    }
  });
}

process.on('uncaughtException', (e) => console.error('[serve]', e.message));

http
  .createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, url);
    if (!file.startsWith(root)) return send(res, 404, path.join(root, '404.html'), req);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!url.endsWith('/')) {
        res.writeHead(301, { Location: url + '/' });
        return res.end();
      }
      file = path.join(file, 'index.html');
    }
    if (fs.existsSync(file)) return send(res, 200, file, req);
    return send(res, 404, path.join(root, '404.html'), req);
  })
  .listen(port, () => console.log(`serving ${root} on http://localhost:${port}`));
