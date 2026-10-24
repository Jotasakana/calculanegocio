// Comprobaciones multilingües sobre dist/ (HTML real): idioma de cada página, selector de idioma, hreflang recíproco,
// canonical, noindex, enlaces internos, URLs inexistentes y textos del idioma equivocado. Sin navegador.
// Uso: node scripts/check-languages.mjs [carpeta=dist]
import fs from 'node:fs';
import path from 'node:path';
import { routeTable, pathFor } from '../src/i18n/routes.js';
import { REAL_WORLD, publishedLocales } from '../src/i18n/publish.js';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', 'dist'));
if (!fs.existsSync(root)) { console.error(`No existe ${root}. Ejecuta antes: npm run build`); process.exit(1); }
const site = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/$/, '');
const indexed = process.env.SITE_INDEXABLE === 'true';
const problems = [];
const bad = (m) => problems.push(m);
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) bad(msg); };

const table = routeTable();
const locales = publishedLocales();
const byPath = new Map(table.map((r) => [r.path, r]));
const read = (p) => fs.readFileSync(path.join(root, p, 'index.html'), 'utf8');
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1];

// Texto visible + atributos accesibles, sin scripts ni estilos (para detectar restos de otro idioma)
const visibleText = (html) => {
  // El selector se excluye: sus nombres («Español», «English»…) están a propósito en su propio idioma.
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<details[^>]*data-langswitch[\s\S]*?<\/details>/gi, ' ');
  const attrs = [...body.matchAll(/\b(?:aria-label|placeholder|title|alt|content)="([^"]+)"/gi)].map((m) => m[1]);
  const text = body.replace(/<[^>]+>/g, ' ');
  return (text + ' ' + attrs.join(' ')).replace(/&[a-z]+;|&#\d+;/gi, ' ').replace(/CalculaNegocio/g, ' ').replace(/\s+/g, ' ');
};
const SPANISH = /\b(margen|recargo|coste|costes|precio|aut[oó]nomos?|descuentos?|herramientas?|Espa[ñn]a|IVA|IRPF|desarrollo|disponibles?)\b|[¿¡ñ]/i;
const ENGLISH = /\b(the|and|your|with|calculator|margin)\b/i;

for (const r of table) {
  const html = read(r.path);
  const loc = REAL_WORLD.locales[r.locale];
  ok(new RegExp(`<html\\b[^>]*\\blang="${loc.hreflang}"`, 'i').test(html), `${r.path}: lang debería ser ${loc.hreflang}`);
  ok(html.includes(`<link rel="canonical" href="${site}${r.path}"`), `${r.path}: canonical propio incorrecto`);
  const robots = html.match(/<meta\b[^>]*name="robots"[^>]*>/i)?.[0] ?? '';
  ok(indexed ? !/noindex/i.test(robots) : /noindex,nofollow/i.test(robots), `${r.path}: robots inesperado (${robots})`);
  ok(/<meta\b[^>]*property="og:locale"[^>]*content="[a-z]{2}_[A-Z]{2}"/i.test(html) || /content="[a-z]{2}_[A-Z]{2}"[^>]*property="og:locale"/i.test(html), `${r.path}: falta og:locale`);

  // hreflang: exactamente las versiones equivalentes, recíprocas y absolutas
  const alts = [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/gi)].map((m) => ({ hreflang: attr(m[0], 'hreflang'), href: attr(m[0], 'href') })).filter((a) => a.hreflang);
  const want = locales.filter((l) => REAL_WORLD.locales[l]).map((l) => [REAL_WORLD.locales[l].hreflang, site + pathFor(l, r.key)]).concat([['x-default', site + pathFor('es', r.key)]]);
  ok(JSON.stringify(alts.map((a) => [a.hreflang, a.href])) === JSON.stringify(want), `${r.path}: hreflang inesperado → ${JSON.stringify(alts.map((a) => a.hreflang))}`);
  for (const a of alts) {
    const p = a.href.replace(site, '');
    const t = byPath.get(p);
    ok(Boolean(t), `${r.path}: hreflang ${a.hreflang} apunta a una URL inexistente (${a.href})`);
    if (t && a.hreflang !== 'x-default') ok(read(p).includes(`hreflang="${loc.hreflang}" href="${site}${r.path}"`), `${r.path}: hreflang no recíproco con ${p}`);
  }

  // Selector de idioma: en la cabecera, con todos los idiomas, nombres propios y destinos reales
  const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? '';
  const sw = header.match(/<details[^>]*data-langswitch[\s\S]*?<\/details>/i)?.[0];
  ok(Boolean(sw), `${r.path}: no hay selector de idioma en la cabecera`);
  if (sw) {
    const links = [...sw.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
    ok(links.length === locales.length, `${r.path}: el selector tiene ${links.length} opciones, se esperaban ${locales.length}`);
    ok(links.map((l) => attr(l, 'hreflang')).join() === locales.map((l) => REAL_WORLD.locales[l].hreflang).join(), `${r.path}: idiomas del selector`);
    ok(links.map((l) => attr(l, 'href')).join() === locales.map((l) => pathFor(l, r.key)).join(), `${r.path}: destinos del selector (página equivalente)`);
    ok(links.filter((l) => /aria-current/.test(l)).length === 1 && /aria-current/.test(links[locales.indexOf(r.locale)]), `${r.path}: idioma actual mal marcado`);
    ok(links.every((l) => byPath.has(attr(l, 'href'))), `${r.path}: el selector enlaza a una URL inexistente`);
    for (const l of locales) ok(sw.includes(REAL_WORLD.locales[l].name), `${r.path}: falta el nombre «${REAL_WORLD.locales[l].name}»`);
  }

  // Enlaces internos: en una página de un idioma, todo enlace interno (salvo los del selector) queda en ese idioma
  const prefix = '/' + loc.prefix + '/';
  const noSwitch = html.replace(/<details[^>]*data-langswitch[\s\S]*?<\/details>/i, '').replace(/<link\b[^>]*>/gi, '');
  for (const m of noSwitch.matchAll(/\bhref="(\/[^"#]*)/g)) {
    if (m[1] === '/favicon.svg' || m[1].startsWith('/_astro/')) continue;
    ok(m[1].startsWith(prefix) && byPath.has(m[1]), `${r.path}: enlace interno fuera del idioma o inexistente (${m[1]})`);
  }

  // Idioma de los textos
  const text = visibleText(html);
  if (r.locale !== 'es') ok(!SPANISH.test(text), `${r.path}: restos de español → «${text.match(SPANISH)?.[0]}» …${text.slice(Math.max(0, text.search(SPANISH) - 30), text.search(SPANISH) + 40)}`);
  if (r.locale === 'pt-br') ok(!ENGLISH.test(text.replace(/\bmargem\b/gi, '')), `${r.path}: restos de inglés → «${text.match(ENGLISH)?.[0]}»`);
  if (r.locale === 'es') ok(!/\b(the|and|your|with)\b/i.test(text), `${r.path}: restos de inglés en español`);
  // La calculadora lleva el JSON de idioma correcto
  for (const m of html.matchAll(/data-calc-i18n[^>]*>(\{[\s\S]*?\})<\/script>/g)) ok(JSON.parse(m[1].replace(/&quot;/g, '"')).code === r.locale, `${r.path}: JSON de calculadora de otro idioma`);
}

// 404 único: también lleva el selector
{
  const f = path.join(root, '404.html');
  ok(fs.existsSync(f), 'falta 404.html');
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    ok(/data-langswitch/.test(html), '404: sin selector de idioma');
    const links = [...(html.match(/<details[^>]*data-langswitch[\s\S]*?<\/details>/i)?.[0] ?? '').matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
    ok(links.join() === locales.map((l) => pathFor(l, 'home')).join(), `404: el selector debe llevar a las portadas (${links})`);
    ok(/noindex/.test(html), '404: debe llevar noindex');
  }
}

// Raíz: redirección temporal a /es/ (sin detección automática del idioma)
{
  const idx = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  ok(/http-equiv="refresh"[^>]*url=\/es\//.test(idx), '/: la redirección debe ir a /es/');
  ok(!/navigator\.language|geoip|cf-ipcountry/i.test(idx), '/: no debe detectar idioma automáticamente');
}
// Sitemap multilingüe
{
  const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  ok((xml.match(/<loc>/g) || []).length === table.length, 'sitemap: número de URLs');
  for (const r of table) ok(xml.includes(`<loc>${site}${r.path}</loc>`), `sitemap: falta ${r.path}`);
  ok((xml.match(/hreflang="pt-BR"/g) || []).length === table.length / locales.length * locales.length, 'sitemap: hreflang pt-BR por cada URL');
  ok(!/\/(fr|de|it|nl|pl|ar|hi|id|ja|zh|ru|uk|cs)\//.test(xml), 'sitemap: contiene idiomas no publicados');
}
// No se generan carpetas de idiomas no publicados
for (const d of fs.readdirSync(root, { withFileTypes: true })) if (d.isDirectory() && /^(fr|de|it|nl|pl|ar|hi|id|ja|zh|ru|uk|cs)$/.test(d.name)) bad(`dist/${d.name}: idioma no publicado`);

console.log(problems.length ? 'PROBLEMAS:\n - ' + [...new Set(problems)].join('\n - ') : `OK · ${table.length} páginas en ${locales.length} idiomas: lang, selector, hreflang recíproco, canonical, enlaces y textos (${checks} comprobaciones)`);
process.exit(problems.length ? 1 : 0);
