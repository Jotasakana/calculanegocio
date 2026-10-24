// Comprobaciones sobre el CÓDIGO FUENTE (no requieren Astro instalado).
import fs from 'node:fs';
import path from 'node:path';
import { routeTable, pageKeys } from '../src/i18n/routes.js';
import { REAL_WORLD, PAGE_IDS } from '../src/i18n/publish.js';
import { TOOL_REGISTRY, CATEGORY_REGISTRY } from '../src/domain/registry.js';

const root = path.resolve(import.meta.dirname, '..');
const problems = [];
const bad = (m) => problems.push(m);
const rel = (f) => path.relative(root, f);
const read = (f) => fs.readFileSync(f, 'utf8');
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])); }

const table = routeTable();
const known = new Set(table.map((r) => r.path));

// 1. Toda página publicada se genera con la plantilla dinámica y su vista existe
const dispatcher = read(path.join(root, 'src/pages/[...slug].astro'));
const VIEWS = { home: 'HomeView', tools: 'ToolsHubView', methodology: 'MethodologyView', page: 'LegalView', category: 'CategoryView', tool: 'ToolView' };
for (const [kind, view] of Object.entries(VIEWS)) {
  if (!fs.existsSync(path.join(root, `src/views/${view}.astro`))) bad(`Falta la vista ${view}`);
  if (!dispatcher.includes(`<${view} `)) bad(`[...slug].astro no usa ${view}`);
}
for (const r of table) if (!VIEWS[r.key.split(':')[0]]) bad(`La ruta ${r.key} no tiene vista`);
if (!dispatcher.includes('routeTable()')) bad('[...slug].astro debe generar las rutas desde la tabla de rutas');
// No quedan páginas escritas a mano por idioma (cada URL sale de la tabla)
for (const f of walk(path.join(root, 'src/pages')).filter((f) => f.endsWith('.astro'))) {
  const r = '/' + path.relative(path.join(root, 'src/pages'), f).replace(/\\/g, '/');
  if (!['/[...slug].astro', '/index.astro', '/404.astro'].includes(r)) bad(`Página suelta fuera de la tabla de rutas: ${r}`);
}

// 2. Formato de URLs
for (const p of known) if (!/^\/(?:[a-z0-9-]+\/)+$/.test(p)) bad(`URL con formato no válido: ${p}`);
if (known.size !== table.length) bad('URLs duplicadas en la tabla de rutas');

// 3. Enlaces internos escritos a mano: ninguno, salvo los que existen. Y nada de rutas de idioma fijas fuera de la configuración.
const srcFiles = walk(path.join(root, 'src')).filter((f) => /\.(astro|html|js|ts)$/.test(f));
const hardcodedOk = (f) => /src\/(locales|i18n|markets)\//.test(rel(f)) && !/\.html$/.test(f);
for (const f of srcFiles) {
  const text = read(f);
  for (const m of text.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) {
    if (!known.has(m[1]) && m[1] !== '/favicon.svg') bad(`${rel(f)}: enlace escrito a mano a ${m[1]} (usa ctx.path o un marcador {{...}})`);
    else if (m[1] !== '/favicon.svg') bad(`${rel(f)}: enlace interno escrito a mano ${m[1]} (usa ctx.path o un marcador {{...}})`);
  }
  if (!hardcodedOk(f) && /['"`]\/(es|en|pt-br|fr|de|hi|ar|id|ja|zh)\//.test(text)) bad(`${rel(f)}: ruta de idioma escrita a mano`);
  if (/href="#(?!contenido")[a-z]+"/.test(text) && !f.endsWith('HomeView.astro')) bad(`${rel(f)}: enlace hash inesperado`);
}

// 4. Sin texto de interfaz escrito a mano en las plantillas ni en los scripts (todo sale de src/locales)
const TEMPLATE_DIRS = ['src/pages', 'src/views', 'src/components', 'src/layouts'];
const BRAND = /^(Calcula|Negocio|CalculaNegocio)$/;
for (const f of TEMPLATE_DIRS.flatMap((d) => walk(path.join(root, d))).filter((f) => f.endsWith('.astro'))) {
  const body = read(f).replace(/^---[\s\S]*?\n---/, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of body.matchAll(/>([^<>{}]*)</g)) {
    const t = m[1].trim();
    if (/\p{L}{2,}/u.test(t) && !BRAND.test(t)) bad(`${rel(f)}: texto escrito a mano en la plantilla: "${t.slice(0, 50)}"`);
  }
  for (const m of body.matchAll(/\s(aria-label|placeholder|alt|title)="([^"{]+)"/g)) if (/\p{L}{3,}/u.test(m[2])) bad(`${rel(f)}: atributo ${m[1]} con texto escrito a mano: "${m[2]}"`);
}
for (const f of walk(path.join(root, 'src/scripts')).filter((f) => f.endsWith('.js'))) {
  const code = read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  for (const m of code.matchAll(/(['"`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) if (/[À-ɏ¿¡«»]|\s[a-záéíóú]{4,}\s/i.test(m[2]) && !/^[\w\s.#\[\]=\-:>,'"*]+$/.test(m[2])) bad(`${rel(f)}: posible texto escrito a mano: ${m[0].slice(0, 50)}`);
}

// 5. CSS: solo propiedades lógicas (compatibles con RTL). Excepciones marcadas con "físico:" en el propio CSS.
{
  const css = read(path.join(root, 'src/styles/site.css'));
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = stripped.match(/[^{}]+\{[^{}]*\}/g) || [];
  for (const rule of rules) {
    if (/(?<![-\w])(left|right)\s*:|(margin|padding|border)-(left|right)|text-align\s*:\s*(left|right)|float\s*:\s*(left|right)/.test(rule) && !/\[dir=rtl\]\s+\.field input/.test(rule)) bad(`site.css: propiedad física de dirección en: ${rule.trim().slice(0, 80)}`);
  }
  if (!/físico: los campos numéricos/.test(css)) bad('site.css: falta la justificación de la excepción física');
}

// 6. Contenido editorial (por idioma): sin barras sueltas ni palabras prohibidas; el español exige apartados clave
for (const code of Object.keys(REAL_WORLD.content)) {
  const dir = path.join(root, 'src/locales', code, 'articles');
  for (const f of walk(dir)) {
    const t = read(f);
    if (/\\/.test(t)) bad(`${rel(f)}: contiene "\\" suelta`);
    for (const w of ['Demo', 'Claude']) if (t.includes(w)) bad(`${rel(f)}: menciona "${w}"`);
    if ((t.match(/<h3>/g) || []).length < 4) bad(`${rel(f)}: menos de 4 apartados`);
    if (code === 'es') {
      for (const w of ['markup', 'margen de beneficio', 'factura con IVA e IRPF', 'cómo hacer una factura']) if (t.toLowerCase().includes(w.toLowerCase())) bad(`${rel(f)}: menciona "${w}"`);
      for (const k of ['Errores frecuentes', 'ejemplo']) if (!t.toLowerCase().includes(k.toLowerCase())) bad(`${rel(f)}: falta apartado "${k}"`);
    }
  }
}
for (const f of TEMPLATE_DIRS.flatMap((d) => walk(path.join(root, d)))) {
  const t = read(f);
  if (/gu[ií]as?\b/i.test(t)) bad(`${rel(f)}: menciona "guía(s)"`);
  if (/Demo (Home|profesional)/i.test(t)) bad(`${rel(f)}: texto de demo`);
}

// 7. Datos coherentes
for (const [id, t] of Object.entries(TOOL_REGISTRY)) {
  if (!CATEGORY_REGISTRY[t.category]?.tools.includes(id)) bad(`${id} no figura en su categoría`);
  for (const r of t.related) if (!TOOL_REGISTRY[r]) bad(`${id}: relacionada inexistente ${r}`);
}
for (const l of Object.keys(REAL_WORLD.content)) {
  const ids = new Set(table.filter((r) => r.locale === l && r.key.startsWith('tool:')).map((r) => r.key.slice(5)));
  if (ids.size && !ids.has('margen')) bad(`[${l}] la portada usa la calculadora de margen: debe estar publicada`);
}
if (pageKeys().length !== 3 + PAGE_IDS.length + Object.keys(CATEGORY_REGISTRY).length + Object.keys(TOOL_REGISTRY).length) bad('pageKeys incoherente');

// 8. Modo desarrollo y despliegue: noindex + Disallow y redirección temporal de "/"
const robots = read(path.join(root, 'src/pages/robots.txt.ts'));
if (!/Disallow: \//.test(robots) || !/SITE\.indexable/.test(robots)) bad('robots.txt.ts debe bloquear todo mientras SITE.indexable sea false');
if (!/indexable:\s*process\.env\.SITE_INDEXABLE === 'true'/.test(read(path.join(root, 'src/data/site.js')))) bad('site.js: indexable debe depender de SITE_INDEXABLE === "true"');
const redirects = read(path.join(root, 'public/_redirects')).split('\n').filter((l) => l.trim() && !l.startsWith('#'));
if (redirects.length !== 1 || !/^\/\s+\/es\/\s+302$/.test(redirects[0])) bad('public/_redirects debe contener solo "/ /es/ 302"');

console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · comprobaciones de código fuente superadas (${table.length} URLs)`);
process.exit(problems.length ? 1 : 0);
