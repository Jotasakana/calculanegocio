// Comprobación de maquetación en navegador real (Chromium) sobre dist/: ninguna página puede tener
// desplazamiento horizontal, en escritorio ni en móvil. Además simula, sin necesitar traducciones:
//   · RTL: pone dir="rtl" (como el árabe) y vuelve a medir;
//   · textos largos: alarga los textos un 45 % (como el alemán o un pseudo-idioma) y vuelve a medir.
// Uso: node scripts/check-layout.mjs [carpeta=dist]   (requiere `playwright` o `playwright-core` + Chromium)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { routeTable } from '../src/i18n/routes.js';

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, '..', 'dist'));
if (!fs.existsSync(root)) { console.error(`No existe ${root}. Ejecuta antes: npm run build`); process.exit(1); }

async function loadPlaywright() {
  for (const name of ['playwright', 'playwright-core']) {
    try { return await import(name); } catch { /* siguiente */ }
  }
  if (process.env.PLAYWRIGHT_MODULE_PATH) {
    const req = createRequire(path.join(process.env.PLAYWRIGHT_MODULE_PATH, 'x.js'));
    return req('playwright');
  }
  throw new Error('Falta Playwright: npm install --no-save playwright-core (y `npx playwright-core install chromium`), o define PLAYWRIGHT_MODULE_PATH.');
}
const pw = await loadPlaywright();
const chromium = pw.chromium ?? pw.default?.chromium;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/html' }).end('404'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }).end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const urls = (process.env.LAYOUT_URLS ? process.env.LAYOUT_URLS.split(',') : [...routeTable().map((r) => r.path), '/404.html']);
const widths = [320, 360, 390, 768, 1024, 1280];
const modes = [
  { name: 'normal', apply: () => {} },
  { name: 'RTL', apply: () => { document.documentElement.dir = 'rtl'; } },
  {
    name: 'textos +45 %',
    apply: () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const n of nodes) {
        const t = n.nodeValue;
        if (t.trim().length > 2 && !n.parentElement.closest('script,style,noscript')) n.nodeValue = t + ' ' + t.trim().slice(0, Math.ceil(t.trim().length * 0.45));
      }
    },
  },
];

const problems = [];
const browser = await chromium.launch();
let checks = 0;
try {
  for (const url of urls) {
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
      const page = await ctx.newPage();
      for (const mode of modes) {
        await page.goto(base + url, { waitUntil: 'load' });
        await page.evaluate(mode.apply);
        // En móvil, con el menú desplegado
        const toggle = await page.$('#mobileToggle');
        for (const menu of toggle && (await toggle.isVisible()) ? [false, true] : [false]) {
          if (menu) await toggle.click();
          const r = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const doc = document.documentElement.scrollWidth;
            const offenders = [];
            // Un elemento "desborda" si se sale de la ventana y ningún ancestro lo recorta o le da su propio scroll.
            // (html/body llevan overflow-x:clip como red de seguridad: no cuenta como solución, por eso se miden los elementos.)
            const contained = (el) => {
              for (let a = el.parentElement; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
                if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(a).overflowX)) return true;
              }
              return false;
            };
            for (const el of document.querySelectorAll('body *')) {
              const cs = getComputedStyle(el);
              const b = el.getBoundingClientRect();
              if (!b.width || cs.position === 'fixed' || cs.visibility === 'hidden' || el.classList.contains('skip-link')) continue;
              if (b.right > vw + 1 || b.left < -1) if (!contained(el)) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} [${Math.round(b.left)}..${Math.round(b.right)}]`);
            }
            return { vw, doc, offenders: offenders.slice(0, 4) };
          });
          checks++;
          if (r.doc > r.vw || r.offenders.length) problems.push(`${url} · ${w}px · ${mode.name}${menu ? ' · menú abierto' : ''}: desbordamiento horizontal (contenido ${r.doc}px, ventana ${r.vw}px) ${r.offenders.join('; ')}`);
        }
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · sin desplazamiento horizontal (${urls.length} páginas × ${widths.length} anchos × ${modes.length} modos; ${checks} mediciones)`);
process.exit(problems.length ? 1 : 0);
