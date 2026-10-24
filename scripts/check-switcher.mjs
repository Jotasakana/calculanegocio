// El selector de idioma, en navegador real (Chromium) sobre dist/: visible en la cabecera (ordenador y móvil), se abre y se cierra
// (clic, Escape, clic fuera), cada opción lleva a la página equivalente o a la portada, el idioma se mantiene al navegar,
// no hay redirección automática por idioma del navegador y nunca se llega a un 404.
// Uso: node scripts/check-switcher.mjs [carpeta=dist]   (PLAYWRIGHT_MODULE_PATH si Playwright no está instalado)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { routeTable, pathFor } from '../src/i18n/routes.js';
import { publishedLocales } from '../src/i18n/publish.js';
import { buildContext } from '../src/lib/context.js';

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
let notFound = 0;
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { notFound++; res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const problems = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) problems.push(m); };

const locales = publishedLocales();
const table = routeTable();
const keys = [...new Set(table.map((r) => r.key))];
const browser = await chromium.launch();
try {
  // 1. Visible en la cabecera, sin desplazarse, en ordenador y en móvil; con el desplegable cerrado y abierto
  for (const [w, kind] of [[1440, 'ordenador'], [1024, 'portátil'], [768, 'tableta'], [390, 'móvil'], [375, 'móvil'], [320, 'móvil']]) {
    for (const locale of locales) {
      const c = await browser.newContext({ viewport: { width: w, height: 800 } });
      const page = await c.newPage();
      await page.goto(base + pathFor(locale, 'home'), { waitUntil: 'networkidle' });
      const sum = page.locator('[data-langswitch] summary');
      ok(await sum.isVisible(), `${locale} ${w}px: el selector no está visible en la cabecera`);
      const box = await sum.boundingBox();
      ok(box && box.y >= 0 && box.y + box.height <= 120 && box.x >= 0 && box.x + box.width <= w, `${locale} ${w}px: el selector no cabe en la cabecera (${JSON.stringify(box)})`);
      ok(box && box.height >= 44, `${locale} ${w}px: objetivo táctil de menos de 44 px`);
      ok((await page.locator('[data-langswitch] ul').isVisible()) === false, `${locale} ${w}px: el desplegable debería empezar cerrado`);
      // Visible: el texto es el nombre del idioma (ordenador) o su abreviatura (móvil estrecho)
      const shown = (await sum.innerText()).trim();
      ok(w > 480 ? shown.includes({ es: 'Español', en: 'English', 'pt-br': 'Português' }[locale]) : /^(ES|EN|PT)$/.test(shown), `${locale} ${w}px: texto visible del selector inesperado («${shown}»)`);
      await sum.click();
      ok(await page.locator('[data-langswitch] ul').isVisible(), `${locale} ${w}px: el desplegable no se abre`);
      const ub = await page.locator('[data-langswitch] ul').boundingBox();
      ok(ub && ub.x >= -1 && ub.x + ub.width <= w + 1, `${locale} ${w}px: el desplegable se sale de la pantalla (${JSON.stringify(ub)})`);
      const names = await page.locator('[data-langswitch] li a span').allInnerTexts();
      ok(names.join() === 'Español,English,Português (Brasil)', `${locale} ${w}px: opciones del desplegable (${names})`);
      ok((await page.locator('[data-langswitch] a[aria-current]').getAttribute('data-lang-code')) === locale, `${locale} ${w}px: idioma actual mal marcado`);
      // Cierre: Escape devuelve el foco al botón; clic fuera lo cierra; abrir el menú móvil también
      await page.keyboard.press('Escape');
      ok(!(await page.locator('[data-langswitch] ul').isVisible()), `${locale} ${w}px: Escape no cierra el desplegable`);
      ok(await sum.evaluate((el) => document.activeElement === el), `${locale} ${w}px: Escape no devuelve el foco al selector`);
      await sum.click();
      await page.mouse.click(Math.min(w - 5, 40), 600);
      ok(!(await page.locator('[data-langswitch] ul').isVisible()), `${locale} ${w}px: un clic fuera no cierra el desplegable`);
      const noHscroll = await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);
      ok(noHscroll, `${locale} ${w}px: desplazamiento horizontal con el selector`);
      await c.close();
    }
  }

  // 2. Funciona con el teclado
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(base + pathFor('es', 'home'), { waitUntil: 'networkidle' });
    await page.locator('[data-langswitch] summary').focus();
    await page.keyboard.press('Enter');
    ok(await page.locator('[data-langswitch] ul').isVisible(), 'teclado: Enter no abre el selector');
    await page.keyboard.press('Tab');
    ok(await page.evaluate(() => document.activeElement?.closest('[data-langswitch]') !== null), 'teclado: el foco no entra en las opciones');
    await page.keyboard.press('Tab');
    await Promise.all([page.waitForURL((u) => u.pathname !== pathFor('es', 'home'), { timeout: 5000 }).catch(() => {}), page.keyboard.press('Enter')]);
    ok(new URL(page.url()).pathname === pathFor('en', 'home'), `teclado: Tab+Tab+Enter debería ir a English (${new URL(page.url()).pathname})`);
    await page.close();
  }

  // 3. Cambiar de idioma desde CADA página a CADA idioma: llega a la página equivalente, con el idioma correcto y sin 404
  for (const from of locales) for (const key of keys) {
    const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await c.newPage();
    for (const to of locales) {
      await page.goto(base + pathFor(from, key), { waitUntil: 'load' });
      await page.locator('[data-langswitch] summary').click();
      await Promise.all([page.waitForURL((u) => u.pathname === pathFor(to, key)), page.locator(`[data-langswitch] a[data-lang-code="${to}"]`).click()]);
      ok(new URL(page.url()).pathname === pathFor(to, key), `${from}/${key} → ${to}: URL inesperada ${page.url()}`);
      ok((await page.locator('html').getAttribute('lang')).toLowerCase() === (to === 'pt-br' ? 'pt-br' : to), `${from}/${key} → ${to}: lang incorrecto`);
      ok((await page.locator('h1').count()) === 1, `${from}/${key} → ${to}: no hay un único h1`);
    }
    await c.close();
  }
  ok(notFound === 0, `se produjeron ${notFound} peticiones 404 al cambiar de idioma`);

  // 4. El idioma se mantiene al navegar por la web (menú, catálogo, tarjetas, migas, logotipo)
  for (const locale of locales) {
    const ctx = buildContext(locale);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); // el menú horizontal solo se ve por encima de 1400 px
    await page.goto(base + pathFor(locale, 'home'), { waitUntil: 'networkidle' });
    const hrefs = await page.$$eval('header a[href], main a[href], footer a[href]', (as) => as.filter((a) => !a.closest('[data-langswitch]')).map((a) => a.getAttribute('href')).filter((h) => h.startsWith('/')));
    const prefix = '/' + ctx.loc.prefix + '/';
    ok(hrefs.every((h) => h === '/favicon.svg' || h.startsWith(prefix) || h.startsWith('/_astro/') || h.startsWith('/src/')), `${locale}: la portada enlaza fuera de su idioma: ${hrefs.filter((h) => !h.startsWith(prefix)).join(' ')}`);
    // Recorrido: portada → calculadora (menú) → categoría (migas) → inicio (logotipo)
    await page.click(`header nav a[href="${ctx.toolById.margen.path}"], header nav a[href="${ctx.path('tools')}"]`);
    ok(new URL(page.url()).pathname.startsWith(prefix), `${locale}: el menú cambió de idioma`);
    await page.goto(base + ctx.toolById.precio.path, { waitUntil: 'load' });
    await page.click('.logo');
    ok(new URL(page.url()).pathname === pathFor(locale, 'home'), `${locale}: el logotipo no lleva a la portada del mismo idioma`);
    await page.close();
  }

  // 5. Sin detección automática: un navegador con otro idioma NO cambia la página; y "/" lleva a /es/ (redirección temporal)
  for (const browserLang of ['en-US', 'pt-BR', 'fr-FR']) {
    const c = await browser.newContext({ locale: browserLang, viewport: { width: 1280, height: 800 } });
    const page = await c.newPage();
    await page.goto(base + pathFor('es', 'home'), { waitUntil: 'networkidle' });
    ok(new URL(page.url()).pathname === pathFor('es', 'home'), `navegador en ${browserLang}: la página española cambió de idioma por sí sola`);
    await page.goto(base + '/', { waitUntil: 'load' });
    await page.waitForURL((u) => u.pathname === '/es/', { timeout: 5000 }).catch(() => {});
    ok(new URL(page.url()).pathname === '/es/', `navegador en ${browserLang}: "/" debería ir a /es/ (${page.url()})`);
    await c.close();
  }

  // 6. Sin JavaScript también funciona (enlaces reales)
  {
    const c = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
    const page = await c.newPage();
    await page.goto(base + pathFor('es', 'tool:margen'), { waitUntil: 'load' });
    await page.locator('[data-langswitch] summary').click();
    await Promise.all([page.waitForURL((u) => u.pathname === pathFor('pt-br', 'tool:margen')), page.locator('[data-langswitch] a[data-lang-code="pt-br"]').click()]);
    ok(new URL(page.url()).pathname === pathFor('pt-br', 'tool:margen'), 'sin JavaScript: el selector no cambia de idioma');
    await c.close();
  }

  // 7. 404: selector disponible y lleva a las portadas
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    await page.goto(base + '/404.html', { waitUntil: 'load' });
    ok(await page.locator('[data-langswitch] summary').isVisible(), '404: el selector no está visible');
    const hs = await page.$$eval('[data-langswitch] a', (as) => as.map((a) => a.getAttribute('href')));
    ok(hs.join() === locales.map((l) => pathFor(l, 'home')).join(), `404: destinos ${hs}`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(problems.length ? 'PROBLEMAS:\n - ' + [...new Set(problems)].join('\n - ') : `OK · selector de idioma en navegador (${checks} comprobaciones, ${locales.length} idiomas × ${keys.length} páginas)`);
process.exit(problems.length ? 1 : 0);
