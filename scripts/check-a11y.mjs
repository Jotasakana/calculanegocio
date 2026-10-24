// Comprobación de accesibilidad básica en navegador real (Chromium) sobre dist/ (o la vista previa de tools/render-preview.mjs):
//  · ids duplicados · un único h1 · saltos de nivel de encabezado · idioma y dirección declarados
//  · controles (botones, campos, enlaces, resúmenes) con nombre accesible
//  · tamaño táctil: error por debajo de 24×24 px (WCAG 2.2 AA, 2.5.8) y aviso por debajo de 44 px en móvil
//    (los enlaces dentro de un párrafo están exentos)
//  · contraste del texto: 4,5:1 (3:1 en texto grande)
// Uso: node scripts/check-a11y.mjs [carpeta=dist]   (PLAYWRIGHT_MODULE_PATH si Playwright no está instalado en el proyecto)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { routeTable } from '../src/i18n/routes.js';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', 'dist'));
if (!fs.existsSync(root)) { console.error(`No existe ${root}. Ejecuta antes: npm run build`); process.exit(1); }
async function loadPlaywright() {
  for (const name of ['playwright', 'playwright-core']) { try { return await import(name); } catch { /* siguiente */ } }
  if (process.env.PLAYWRIGHT_MODULE_PATH) return createRequire(path.join(process.env.PLAYWRIGHT_MODULE_PATH, 'x.js'))('playwright');
  throw new Error('Falta Playwright (define PLAYWRIGHT_MODULE_PATH o instala playwright-core).');
}
const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const urls = [...routeTable().map((r) => r.path), '/404.html'];
const errors = [];
const warnings = [];

function audit() {
  const out = { errors: [], warnings: [] };
  const visible = (el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const label = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '.' + String(el.className || '').split(' ')[0];
  // ids duplicados
  const seen = new Map();
  for (const el of document.querySelectorAll('[id]')) seen.set(el.id, (seen.get(el.id) || 0) + 1);
  for (const [id, n] of seen) if (n > 1) out.errors.push(`id duplicado: ${id} (${n})`);
  // encabezados
  const hs = [...document.querySelectorAll('h1,h2,h3,h4')].filter(visible);
  if (hs.filter((h) => h.tagName === 'H1').length !== 1) out.errors.push(`debe haber un único h1 (hay ${hs.filter((h) => h.tagName === 'H1').length})`);
  let prev = 0;
  for (const h of hs) { const l = Number(h.tagName[1]); if (prev && l > prev + 1) out.errors.push(`salto de encabezado h${prev} → h${l}: ${h.textContent.trim().slice(0, 40)}`); prev = l; }
  if (!document.documentElement.lang || !document.documentElement.dir) out.errors.push('falta lang o dir en <html>');
  // nombres accesibles y tamaño táctil
  const name = (el) => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') && document.getElementById(el.getAttribute('aria-labelledby'))?.textContent || el.labels?.[0]?.textContent || el.textContent || el.getAttribute('title') || '').trim();
  for (const el of document.querySelectorAll('a[href],button,input:not([type=hidden]),select,summary')) {
    if (!visible(el)) continue;
    if (!name(el)) out.errors.push(`sin nombre accesible: ${label(el)}`);
    const b = el.getBoundingClientRect();
    const inline = el.tagName === 'A' && (el.closest('h1,h2,h3') || (el.closest('p,li,td') && getComputedStyle(el).display === 'inline'));
    if (inline) continue;
    if (b.width < 24 || b.height < 24) out.errors.push(`objetivo táctil de ${Math.round(b.width)}×${Math.round(b.height)} px: ${label(el)}`);
    else if (innerWidth <= 768 && (b.height < 44) && !el.closest('.toc,.footer,.faq-item summary')) out.warnings.push(`objetivo táctil bajo 44 px (${Math.round(b.width)}×${Math.round(b.height)}): ${label(el)} "${name(el).slice(0, 24)}"`);
  }
  // contraste
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r, g, b, a }; };
  const over = (top, bottom) => ({ r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1 });
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => { const stack = []; for (let a = el; a; a = a.parentElement) { const c = parse(getComputedStyle(a).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; } } let base = { r: 255, g: 255, b: 255, a: 1 }; for (const c of stack.reverse()) base = over(c, base); return base; };
  const bad = new Set();
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('script,style,svg')) continue;
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim().length > 1);
    if (!direct) continue;
    const cs = getComputedStyle(el);
    const fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el);
    const f = over(fg, bg);
    const l1 = lum(f), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize); const bold = Number(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (ratio < need) { const k = `${label(el)} ${ratio.toFixed(2)}:1 (mín. ${need}) "${el.textContent.trim().slice(0, 28)}"`; if (!bad.has(k)) { bad.add(k); out.errors.push('contraste ' + k); } }
  }
  return out;
}

const browser = await chromium.launch();
let n = 0;
try {
  for (const url of urls) for (const w of [390, 1280]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(base + url, { waitUntil: 'networkidle' });
    const r = await page.evaluate(audit);
    n++;
    for (const e of r.errors) errors.push(`${url} · ${w}px: ${e}`);
    for (const e of r.warnings) warnings.push(`${url} · ${w}px: ${e}`);
    await ctx.close();
  }
} finally { await browser.close(); server.close(); }
if (warnings.length) console.log(`AVISOS (${warnings.length}):\n - ` + [...new Set(warnings)].slice(0, 25).join('\n - '));
console.log(errors.length ? 'PROBLEMAS:\n - ' + [...new Set(errors)].join('\n - ') : `OK · accesibilidad básica (${n} mediciones en ${urls.length} páginas)`);
process.exit(errors.length ? 1 : 0);
