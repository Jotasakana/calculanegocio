// Capturas de pantalla (página completa) de las páginas principales a 320, 375, 390, 768 y 1440 px,
// más la portada con el menú móvil abierto y en modo RTL simulado. Sirve de evidencia visual en cada compilación.
// Uso: node scripts/screenshots.mjs [dist=dist] [salida=screenshots]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { buildContext } from '../src/lib/context.js';

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

const ctx = buildContext('es');
const pages = [
  ['portada', ctx.path('home')],
  ['catalogo', ctx.path('tools')],
  ['categoria', ctx.categories[0].path],
  ['ficha-margen', ctx.toolById.margen.path],
  ['ficha-iva', ctx.toolById.iva.path],
  ['metodologia', ctx.path('methodology')],
  ['404', '/404.html'],
];
const widths = [320, 375, 390, 768, 1440];
const browser = await chromium.launch();
let n = 0;
try {
  for (const [name, url] of pages) for (const w of widths) {
    const c = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await c.newPage();
    await page.goto(base + url, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(out, `${name}-${w}.png`), fullPage: true });
    n++;
    await c.close();
  }
  // Menú móvil abierto y RTL simulado (la portada)
  for (const w of [320, 390]) {
    const c = await browser.newContext({ viewport: { width: w, height: 800 } });
    const page = await c.newPage();
    await page.goto(base + ctx.path('home'), { waitUntil: 'networkidle' });
    await page.click('#mobileToggle');
    await page.screenshot({ path: path.join(out, `portada-menu-${w}.png`) });
    await page.evaluate(() => { document.documentElement.dir = 'rtl'; document.documentElement.lang = 'ar'; });
    await page.click('#mobileToggle');
    await page.screenshot({ path: path.join(out, `portada-rtl-${w}.png`), fullPage: true });
    n += 2;
    await c.close();
  }
} finally { await browser.close(); server.close(); }
console.log(`OK · ${n} capturas en ${out}`);
