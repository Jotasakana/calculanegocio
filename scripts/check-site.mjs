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
const indexed = process.env.SITE_INDEXABLE !== 'false';
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
  if (indexed && r.key.startsWith('page:') && !/noindex/i.test(robots)) fail(`${r.path}: página legal debe llevar noindex`);
  if (indexed && !r.key.startsWith('page:') && /noindex/i.test(robots)) fail(`${r.path}: contenido debe ser indexable`);
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
  if (indexed && !/Allow:\s*\//i.test(robots)) fail('robots.txt debe permitir el rastreo');
}
if (!fs.existsSync(path.join(root, 'sitemap.xml'))) fail('falta sitemap.xml');

// ---- Comprobaciones de la Fase 7A (estado real: 114 páginas, 84 indexables, 30 legales noindex) ----
{
  const sitemapFile = path.join(root, 'sitemap.xml');
  if (fs.existsSync(sitemapFile) && indexed) {
    const locs = [...fs.readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (locs.length !== 84) fail(`sitemap: se esperaban exactamente 84 URL indexables y hay ${locs.length}`);
    if (new Set(locs).size !== locs.length) fail('sitemap: URL duplicadas');
    const legalPaths = new Set(routes.filter((r) => r.key.startsWith('page:')).map((r) => site + r.path));
    for (const l of locs) if (legalPaths.has(l)) fail(`sitemap: incluye una página legal (${l})`);
  }
  if (indexed) {
    let noindexCount = 0, indexFollow = 0;
    for (const r of routes) {
      const robots = pages.get(r.path)?.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || '';
      if (/noindex/i.test(robots)) noindexCount++;
      else if (/content=["']index,follow/i.test(robots)) indexFollow++;
    }
    if (routes.length !== 114) fail(`se esperaban 114 páginas y hay ${routes.length}`);
    if (noindexCount !== 30) fail(`se esperaban 30 páginas legales noindex y hay ${noindexCount}`);
    if (indexFollow !== 84) fail(`se esperaban 84 páginas index,follow y hay ${indexFollow}`);
  }
  // Textos obsoletos que no deben verse en ninguna página (marcadores «pendiente», demo, borradores, «en desarrollo»…)
  const obsolete = [
    /legal-pending/, /class=["'][^"']*\bdevnote\b/, /DEMO PRIVADA|PRIVATE DEMO|DÉMO PRIVÉE|निजी डेमो/i,
    /Borrador pendiente|Draft pending/i, /\[PENDIENTE|\[PENDENTE|\[BESTÄTIGUNG|\[PRÜFUNG|\[CONFIRMATION|\[VÉRIFICATION|\[पुष्टि|\[PENDING/,
    /En desarrollo|In development|Em desenvolvimento|In Entwicklung|En développement|विकास में/,
    /antes de la publicaci[oó]n|before the site is launched|antes da publicaç|vor dem Start der Website|avant le lancement du site/i,
    /correo de contacto esté operativo|contact email is (not yet )?operational|e-mail de contato estiver operacional|Kontakt-E-Mail in Betrieb|e-mail de contact sera opérationnel|संपर्क ईमेल चालू होने/i,
  ];
  for (const [p, html] of pages) for (const re of obsolete) if (re.test(html)) fail(`${p}: contiene texto obsoleto (${re})`);
  // Señales de confianza reales en las calculadoras y la metodología
  for (const r of routes) {
    const needs = r.key.startsWith('tool:') || r.key === 'methodology';
    const html = pages.get(r.path) || '';
    if (needs && !/class=["']trustbar["']/.test(html)) fail(`${r.path}: falta la franja de confianza (fecha, metodología, titular y contacto)`);
    if (needs && !/<time datetime=["']\d{4}-\d{2}-\d{2}["']/.test(html)) fail(`${r.path}: falta la fecha de actualización verificable`);
  }
  // Portada y catálogo: solo las 8 calculadoras que funcionan, sin tarjetas «en desarrollo»
  for (const r of routes.filter((x) => x.key === 'home' || x.key === 'tools')) {
    const html = pages.get(r.path) || '';
    const cards = (html.match(/class=["']card[ "']/g) || []).length;
    if (/<button\b[^>]*\bdata-filter-status\s*=/.test(html)) fail(`${r.path}: aparece el filtro de estado (solo debería haber calculadoras disponibles)`);
    if (cards && cards !== 8) fail(`${r.path}: se esperaban 8 tarjetas de calculadoras y hay ${cards}`);
  }
}
if (issues.length) { console.error(issues.join('\n')); console.error(`FALLO: ${issues.length} incidencias`); process.exit(1); }
console.log(`OK: ${routes.length} páginas compiladas, metadatos, enlaces, sitemap y bloqueo SEO verificados`);
