// Comprobaciones sobre el CÓDIGO FUENTE (no requieren Astro instalado).
import fs from 'node:fs';
import path from 'node:path';
import { allPaths, TOOL_LIST, CATEGORY_LIST, TOOLS } from '../src/data/tools.js';

const root = path.resolve(import.meta.dirname, '..');
const problems = [];
const bad = (m) => problems.push(m);

// 1. Cada URL del mapa tiene su archivo de página
const pageFile = (p) => (p === '/' ? 'src/pages/index.astro' : `src/pages${p}index.astro`);
for (const p of allPaths()) if (!fs.existsSync(path.join(root, pageFile(p)))) bad(`Falta la página para ${p}: ${pageFile(p)}`);

// 2. Todas las páginas .astro tienen una URL del mapa (salvo 404)
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])); }
const known = new Set(allPaths());
for (const f of walk(path.join(root, 'src/pages')).filter((f) => f.endsWith('.astro'))) {
  const rel = '/' + path.relative(path.join(root, 'src/pages'), f).replace(/index\.astro$/, '').replace(/\\/g, '/');
  if (rel === '/404.astro') continue;
  if (!known.has(rel)) bad(`Página sin entrada en el mapa de URLs: ${rel}`);
}

// 3. Formato de URLs: minúsculas, trailing slash, sin hash
for (const p of allPaths()) if (!/^\/(?:[a-z0-9-]+\/)*$/.test(p)) bad(`URL con formato no válido: ${p}`);
if (new Set(allPaths()).size !== allPaths().length) bad('URLs duplicadas en el mapa');

// 4. Enlaces internos literales en fuentes y fragmentos
const srcFiles = walk(path.join(root, 'src')).filter((f) => /\.(astro|html|js|ts)$/.test(f));
for (const f of srcFiles) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) {
    if (!known.has(m[1]) && m[1] !== '/favicon.svg') bad(`${path.relative(root, f)}: enlace a URL inexistente ${m[1]}`);
  }
  if (/href="#(?!contenido")[a-z]+"/.test(text) && !f.endsWith('index.astro')) bad(`${path.relative(root, f)}: enlace hash inesperado`);
}

// 5. Contenido editorial: sin barras sueltas ni referencias a páginas inexistentes
for (const f of walk(path.join(root, 'src/content/articles'))) {
  const t = fs.readFileSync(f, 'utf8');
  if (/\\/.test(t)) bad(`${path.basename(f)}: contiene "\\" suelta`);
  for (const w of ['markup', 'margen de beneficio', 'factura con IVA e IRPF', 'cómo hacer una factura', 'Demo', 'Claude']) if (t.toLowerCase().includes(w.toLowerCase())) bad(`${path.basename(f)}: menciona "${w}"`);
  for (const k of ['Errores frecuentes', 'ejemplo']) if (!t.toLowerCase().includes(k.toLowerCase())) bad(`${path.basename(f)}: falta apartado "${k}"`);
}

// 6. Sin guías ni demo en las páginas
for (const f of walk(path.join(root, 'src/pages')).concat(walk(path.join(root, 'src/components')), walk(path.join(root, 'src/layouts')))) {
  const t = fs.readFileSync(f, 'utf8');
  if (/gu[ií]as?\b/i.test(t)) bad(`${path.relative(root, f)}: menciona "guía(s)"`);
  if (/Demo (Home|profesional)/i.test(t)) bad(`${path.relative(root, f)}: texto de demo`);
}

// 7. Datos de herramientas coherentes
for (const t of TOOL_LIST) {
  if (!fs.existsSync(path.join(root, `src/content/articles/${t.article}.html`))) bad(`Falta el artículo de ${t.id}`);
  if (!CATEGORY_LIST.some((c) => c.id === t.category && c.tools.includes(t.id))) bad(`${t.id} no figura en su categoría`);
  for (const r of t.related) if (!TOOLS[r]) bad(`${t.id}: relacionada inexistente ${r}`);
  if (t.metaTitle.length > 53) bad(`${t.id}: metaTitle largo (máx. 53 + marca) (${t.metaTitle.length})`);
  if (t.metaDescription.length > 165) bad(`${t.id}: metaDescription larga (${t.metaDescription.length})`);
}

console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · comprobaciones de código fuente superadas (${allPaths().length} URLs)`);
process.exit(problems.length ? 1 : 0);
