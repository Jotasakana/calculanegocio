// Comprobaciones sobre el sitio COMPILADO (dist/). Ejecutar tras `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { allPaths, TOOL_LIST } from '../src/data/tools.js';

const dist = path.resolve(import.meta.dirname, '..', 'dist');
if (!fs.existsSync(dist)) { console.error('No existe dist/. Ejecuta antes: npm run build'); process.exit(1); }
const problems = [];
const bad = (m) => problems.push(m);

const fileFor = (p) => path.join(dist, p.endsWith('/') ? p + 'index.html' : p);
const read = (p) => fs.readFileSync(fileFor(p), 'utf8');
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');

const site = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');
const indexable = process.env.SITE_INDEXABLE === 'true';
const pages = allPaths();
const ids = {};

for (const p of pages) {
  if (!fs.existsSync(fileFor(p))) { bad(`${p}: no se ha generado el HTML`); continue; }
  const html = read(p);
  const body = strip(html);
  ids[p] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) bad(`${p}: sin <title>`);
  else if (title.length > 70) bad(`${p}: <title> largo (${title.length})`);
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) bad(`${p}: sin meta description`);
  else if (desc.length > 170) bad(`${p}: meta description larga (${desc.length})`);
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canon !== site + p) bad(`${p}: canonical incorrecto (${canon})`);
  for (const og of ['og:title', 'og:description', 'og:url', 'og:type']) if (!html.includes(`property="${og}"`)) bad(`${p}: falta ${og}`);
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  if (!indexable && !/noindex/.test(robots || '')) bad(`${p}: en modo desarrollo debe llevar noindex (${robots})`);
  if (indexable && /noindex/.test(robots || '')) bad(`${p}: lleva noindex con SITE_INDEXABLE=true`);
  if (!/<html lang="es"/.test(html)) bad(`${p}: falta lang="es"`);
  const h1 = body.match(/<h1[\s>]/g) || [];
  if (h1.length !== 1) bad(`${p}: ${h1.length} etiquetas h1`);
  if (/ld\+json/.test(html) === false) bad(`${p}: sin datos estructurados`);
  if (/\\<\/|\s\\\s/.test(body)) bad(`${p}: barra invertida suelta en el HTML`);
  if (/gu[ií]as? pr[aá]cticas/i.test(body)) bad(`${p}: menciona guías prácticas`);
  if (/Demo (Home|profesional)/i.test(body)) bad(`${p}: texto de demo`);
}

// Enlaces internos
for (const p of pages.concat(['/404/'])) {
  const f = p === '/404/' ? path.join(dist, '404.html') : fileFor(p);
  if (!fs.existsSync(f)) { if (p === '/404/') bad('Falta 404.html'); continue; }
  const html = fs.readFileSync(f, 'utf8');
  if (p === '/404/') ids[p] = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [u, hash] = href.split('#');
    const target = u === '' ? p : u;
    if (!target.startsWith('/')) { bad(`${p}: enlace relativo ${href}`); continue; }
    if (target !== '/favicon.svg' && !fs.existsSync(fileFor(target))) { bad(`${p}: enlace roto ${href}`); continue; }
    if (hash && ids[target] && !ids[target].has(hash)) bad(`${p}: ancla inexistente ${href}`);
  }
}

// Calculadoras: contenido principal y resultado inicial en el HTML estático
for (const t of TOOL_LIST) {
  const html = fs.existsSync(fileFor(t.path)) ? read(t.path) : '';
  const body = strip(html);
  if (!/data-main[^>]*>[^<]*\d/.test(body)) bad(`${t.path}: el resultado inicial no está en el HTML`);
  if ((body.match(/<h2 class="sec"/g) || []).length < 4) bad(`${t.path}: el texto editorial no está en el HTML estático`);
  if ((body.match(/role="tab"/g) || []).length !== t.modes.length) bad(`${t.path}: nº de pestañas incorrecto`);
  if ((body.match(/data-key=/g) || []).length !== t.fields.flat().length) bad(`${t.path}: nº de campos incorrecto`);
  if (!/<script[^>]+type="module"/.test(html)) bad(`${t.path}: falta el script de la calculadora`);
  if (/data-calculator/.test(body) === false) bad(`${t.path}: falta el contenedor de la calculadora`);
}

// robots.txt y sitemap
const robots = fs.existsSync(path.join(dist, 'robots.txt')) ? fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
if (!robots) bad('Falta robots.txt');
else if (!indexable && !/Disallow: \//.test(robots)) bad('robots.txt debe bloquear todo en modo desarrollo');
else if (indexable && !robots.includes(`Sitemap: ${site}/sitemap.xml`)) bad('robots.txt sin línea Sitemap');
const sm = fs.existsSync(path.join(dist, 'sitemap.xml')) ? fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8') : '';
if (!sm) bad('Falta sitemap.xml');
else {
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length !== pages.length) bad(`sitemap: ${locs.length} URLs, se esperaban ${pages.length}`);
  for (const l of locs) if (!pages.includes(l.replace(site, ''))) bad(`sitemap: URL desconocida ${l}`);
}

console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · sitio compilado correcto (${pages.length} páginas + 404)`);
process.exit(problems.length ? 1 : 0);
