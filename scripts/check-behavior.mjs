// Comprobación de comportamiento en navegador real (Chromium) sobre dist/: buscador, filtros del catálogo,
// pestañas de la portada, recálculo, copiar, menú móvil y —sobre todo— que NINGUNA tarjeta enlace a una página inexistente
// y que las calculadoras «en desarrollo» no tengan enlace.
// Uso: node scripts/check-behavior.mjs [carpeta=dist]   (PLAYWRIGHT_MODULE_PATH si Playwright no está instalado)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { buildContext } from '../src/lib/context.js';
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
const problems = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) problems.push(msg); };
const known = new Set(routeTable().map((r) => r.path));

const locale = 'es';
const ctx = buildContext(locale);
const home = ctx.path('home');
const hub = ctx.path('tools');
const expected = ctx.catalog.counts;

const browser = await chromium.launch();
try {
  // 1. Enlaces de las tarjetas: todos existen; en desarrollo = sin enlace
  for (const url of [home, hub, ...ctx.categories.map((c) => c.path)]) {
    const page = await browser.newPage();
    await page.goto(base + url, { waitUntil: 'networkidle' });
    const cards = await page.$$eval('[data-filter-item]', (els) => els.map((e) => ({ status: e.dataset.status, href: e.getAttribute('href'), tag: e.tagName })));
    ok(cards.length > 0, `${url}: no hay tarjetas`);
    for (const c of cards) {
      if (c.status === 'available') ok(c.tag === 'A' && known.has(c.href), `${url}: tarjeta disponible con enlace no válido (${c.href})`);
      else ok(c.tag !== 'A' && !c.href, `${url}: tarjeta en desarrollo con enlace (${c.href})`);
    }
    await page.close();
  }

  // 2. Portada: contadores y calculadora
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto(base + home, { waitUntil: 'networkidle' });
    ok((await page.$$('[data-filter-item]')).length === expected.total, `portada: se esperaban ${expected.total} tarjetas`);
    // pestañas de la calculadora destacada
    const tabs = await page.$$('[data-bench-tab]');
    ok(tabs.length === ctx.featuredTools.length, 'portada: faltan pestañas de calculadoras destacadas');
    if (tabs.length > 1) {
      await tabs[1].click();
      const visible = await page.$$eval('[data-bench-panel]', (els) => els.map((e) => !e.hidden));
      ok(visible.join() === [false, true].join(), `portada: la pestaña no cambia de panel (${visible})`);
      ok((await tabs[1].getAttribute('aria-selected')) === 'true', 'portada: aria-selected no se actualiza');
    }
    // recálculo al escribir
    const panel = await page.$('[data-bench-panel]:not([hidden])');
    const before = await panel.$eval('[data-main]', (e) => e.textContent);
    const input = await panel.$('.tabpanel:not([hidden]) input[data-key]');
    await input.fill('80');
    const after = await panel.$eval('[data-main]', (e) => e.textContent);
    ok(before !== after && after.trim().length > 0, `portada: el resultado no se recalcula (${before} → ${after})`);
    // copiar
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: base });
    const copyBtn = await panel.$('[data-copy]');
    ok(copyBtn && (await copyBtn.isVisible()), 'portada: no se ve el botón de copiar');
    await copyBtn.click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    ok(clip.includes(after.trim()), `portada: lo copiado no contiene el resultado (${clip.slice(0, 50)})`);
    ok((await copyBtn.textContent()).includes(ctx.ui.tool.copied), 'portada: el botón no confirma la copia');
    // buscador de la portada
    await page.fill('#mainSearch', 'iva');
    const hit = await page.$$eval('#searchResults a', (as) => as.map((a) => a.getAttribute('href')));
    ok(hit.length > 0 && hit.every((h) => known.has(h)), `portada: el buscador no devuelve enlaces válidos (${hit})`);
    await page.fill('#mainSearch', 'xyzxyzxyz');
    ok((await page.$$('#searchResults .empty')).length === 1, 'portada: el buscador no avisa de «sin resultados»');
    // filtros del catálogo
    const count = async () => (await page.$$('[data-filter-item]:not(.is-filtered-out)')).length;
    await page.click('[data-filter-status="planned"]');
    ok((await count()) === expected.planned, `filtro «en desarrollo»: ${await count()} ≠ ${expected.planned}`);
    await page.click('[data-filter-status="available"]');
    ok((await count()) === expected.available, `filtro «disponibles»: ${await count()} ≠ ${expected.available}`);
    await page.click('[data-filter-status=""]');
    await page.click(`[data-filter-category="${ctx.catalog.categories[0].id}"]`);
    ok((await count()) === ctx.catalog.categories[0].total, 'filtro por tema: recuento incorrecto');
    await page.click('[data-filter-category=""]');
    await page.fill('[data-catalog-search]', 'xyzxyzxyz');
    ok((await count()) === 0 && (await page.isVisible('[data-catalog-empty]')), 'catálogo: no muestra el aviso de «sin resultados»');
    await page.fill('[data-catalog-search]', 'margen');
    ok((await count()) > 0, 'catálogo: la búsqueda «margen» no encuentra nada');
    ok(errs.length === 0, `portada: errores de JavaScript: ${errs.join(' | ')}`);
    await page.close();
  }

  // 3. Móvil: menú y sin errores
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    await page.goto(base + home, { waitUntil: 'networkidle' });
    ok(!(await page.isVisible('#siteNav')), 'móvil: el menú debería estar cerrado');
    await page.click('#mobileToggle');
    ok(await page.isVisible('#siteNav'), 'móvil: el menú no se abre');
    ok((await page.getAttribute('#mobileToggle', 'aria-expanded')) === 'true', 'móvil: aria-expanded no se actualiza');
    await page.keyboard.press('Escape');
    ok(!(await page.isVisible('#siteNav')), 'móvil: Escape no cierra el menú');
    await page.close();
  }

  // 4. Sin JavaScript: todo se ve y los enlaces funcionan
  {
    const c = await browser.newContext({ javaScriptEnabled: false });
    const page = await c.newPage();
    await page.goto(base + home);
    ok((await page.$$('[data-filter-item]')).length === expected.total, 'sin JS: faltan tarjetas');
    ok((await page.$$('[data-main]')).length === ctx.featuredTools.length, 'sin JS: falta el resultado de alguna calculadora');
    ok(!(await page.isVisible('[data-catalog-search]')), 'sin JS: el buscador del catálogo no debería mostrarse');
    await c.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · comportamiento en navegador (${checks} comprobaciones)`);
process.exit(problems.length ? 1 : 0);
