// Capturas de pantalla (página completa) de las páginas principales de CADA idioma publicado a 320, 375, 390, 768 y 1440 px,
// más el selector de idioma abierto (ordenador y móvil), las calculadoras y el menú móvil abierto. Sirve de evidencia visual en cada compilación.
// Uso: node scripts/screenshots.mjs [dist=dist] [salida=screenshots]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { buildContext } from '../src/lib/context.js';
import { publishedLocales } from '../src/i18n/publish.js';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', 'dist'));
const out = path.resolve(process.argv[3] ?? 'screenshots');
if (!fs.existsSync(root)) { console.error(`No existe ${root}.`); process.exit(1); }
fs.mkdirSync(out, { recursive: true });
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

const locales = publishedLocales();
const pagesOf = (ctx) => [
  ['portada', ctx.path('home')],
  ['catalogo', ctx.path('tools')],
  ['categoria', ctx.categories[0].path],
  ['ficha-margen', ctx.toolById.margen.path],
  ['ficha-impuesto', ctx.toolById.iva.path],
  ['metodologia', ctx.path('methodology')],
];
const widths = [320, 375, 390, 768, 1440];
const browser = await chromium.launch();
let n = 0;
try {
  for (const locale of locales) {
    const ctx = buildContext(locale);
    for (const [name, url] of pagesOf(ctx)) for (const w of widths) {
      const c = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await c.newPage();
      await page.goto(base + url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(out, `${locale}-${name}-${w}.png`), fullPage: true });
      n++;
      await c.close();
    }
    // Selector de idioma abierto: ordenador (1440) y móvil (320, 375 y 390); solo la cabecera y el desplegable
    for (const [w, h, tag] of [[1440, 420, 'escritorio'], [390, 420, 'movil-390'], [375, 420, 'movil-375'], [320, 420, 'movil-320']]) {
      const c = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await c.newPage();
      await page.goto(base + ctx.path('home'), { waitUntil: 'networkidle' });
      await page.click('[data-langswitch] summary');
      await page.screenshot({ path: path.join(out, `selector-${locale}-${tag}.png`) });
      n++;
      await c.close();
    }
    // Calculadoras (resultado inicial) y menú móvil abierto
    for (const id of ['margen', 'precio', 'rentabilidad', 'iva']) {
      const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await c.newPage();
      await page.goto(base + ctx.toolById[id].path, { waitUntil: 'networkidle' });
      await (await page.$('.workspace')).screenshot({ path: path.join(out, `calculadora-${locale}-${id}.png`) });
      n++;
      await c.close();
    }
    for (const w of [320, 390]) {
      const c = await browser.newContext({ viewport: { width: w, height: 800 } });
      const page = await c.newPage();
      await page.goto(base + ctx.path('home'), { waitUntil: 'networkidle' });
      await page.click('#mobileToggle');
      await page.screenshot({ path: path.join(out, `${locale}-portada-menu-${w}.png`) });
      n++;
      await c.close();
    }
  }
  // 404 (único) y RTL simulado (la portada española)
  {
    const c = await browser.newContext({ viewport: { width: 390, height: 900 } });
    const page = await c.newPage();
    await page.goto(base + '/404.html', { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, '404-390.png'), fullPage: true });
    await page.click('[data-langswitch] summary');
    await page.screenshot({ path: path.join(out, '404-selector-390.png') });
    n += 2;
    await c.close();
  }
} finally { await browser.close(); server.close(); }
console.log(`OK · ${n} capturas en ${out}`);
