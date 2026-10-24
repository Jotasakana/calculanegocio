// Comprueba los archivos HTML reales después de compilar con Astro.
import fs from 'node:fs';
import path from 'node:path';
import { routeTable } from '../src/i18n/routes.js';
import { publishedLocales } from '../src/i18n/publish.js';
import { LOCALES } from '../src/i18n/locales.js';

const root = path.resolve('dist');
if (!fs.existsSync(root)) { console.error('No existe dist/. Ejecuta npm run build primero.'); process.exit(1); }
const issues = [];
const routes = routeTable();
const expected = new Set(routes.map(r => r.path));
const site = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/$/, '');
const indexed = process.env.SITE_INDEXABLE === 'true';
const getFile = p => path.join(root, p, 'index.html');
const pages = new Map();
const ids = new Map();
const fail = s => issues.push(s);
for (const r of routes) {
  const file = getFile(r.path);
  if (!fs.existsSync(file)) { fail(`${r.path}: falta index.html`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  pages.set(r.path, html);
  ids.set(r.path, new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1])));
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(html)) fail(`${r.path}: falta title`);
  if (!/<meta\s+name=["']description["']/i.test(html)) fail(`${r.path}: falta description`);
  if (!html.includes(site + r.path)) fail(`${r.path}: falta URL canónica esperada`);
  if (!new RegExp(`<html\\b[^>]*lang=["']${r.locale}["']`, 'i').test(html)) fail(`${r.path}: lang incorrecto`);
  const robots = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || '';
  if (!indexed && !/noindex/i.test(robots)) fail(`${r.path}: falta noindex en desarrollo`);
  if (indexed && /noindex/i.test(robots)) fail(`${r.path}: noindex con indexable=true`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) fail(`${r.path}: debe tener un solo h1`);
}
for (const [p, html] of pages) {
  for (const match of html.matchAll(/\bhref=["'](\/[\w\-/]*)(#[\w-]+)?["']/g)) {
    const href = match[1];
    if (!publishedLocales().some((l) => href.startsWith('/' + LOCALES[l].prefix + '/'))) continue;
    const target = href.endsWith('/') ? href : href + '/';
    if (!expected.has(target)) fail(`${p}: enlace interno roto ${href}`);
    if (match[2] && ids.has(target) && !ids.get(target).has(match[2].slice(1))) fail(`${p}: ancla rota ${href}${match[2]}`);
  }
}
const robotsPath = path.join(root, 'robots.txt');
if (!fs.existsSync(robotsPath)) fail('falta robots.txt');
else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!indexed && !/Disallow:\s*\//i.test(robots)) fail('robots.txt no bloquea rastreo durante desarrollo');
}
if (!fs.existsSync(path.join(root, 'sitemap.xml'))) fail('falta sitemap.xml');
if (issues.length) { console.error(issues.join('\n')); console.error(`FALLO: ${issues.length} incidencias`); process.exit(1); }
console.log(`OK: ${routes.length} páginas compiladas, metadatos, enlaces, sitemap y bloqueo SEO verificados`);
