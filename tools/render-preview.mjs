// Vista previa SIN Astro (solo para entornos donde no se puede instalar Astro, p. ej. sin acceso a npm).
// Convierte las plantillas .astro de este proyecto en funciones JavaScript y genera una carpeta tipo `dist/` con el HTML
// de cada página, para verlo en un navegador real. NO sustituye a `npm run build`: es una aproximación del HTML
// (Astro añade su propio empaquetado de CSS/JS). Soporta solo la sintaxis .astro que usa este proyecto.
//
// Uso: node tools/render-preview.mjs [carpetaSalida=preview-dist]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.resolve(process.argv[2] ?? path.join(root, 'preview-dist'));
const buildDir = path.join(outDir, '.build');

// ---------- compilador .astro → módulo JS ----------
const VOID = new Set(['meta', 'link', 'input', 'br', 'hr', 'img', 'source', 'path']);
const RAWTEXT = new Set(['script', 'style']);
const isLetter = (c) => /[A-Za-z]/.test(c ?? '');

function compile(src, file) {
  let fm = '';
  let tpl = src;
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (m) { fm = m[1]; tpl = src.slice(m[0].length); }
  const imports = [];
  fm = fm.replace(/^import[^;]*;[ \t]*$/gm, (l) => {
    if (/\.css['"]/.test(l)) return '';
    imports.push(l.replace(/\.astro(['"])/g, '.astro.mjs$1'));
    return '';
  });
  const relFromRoot = path.relative(root, path.dirname(file));

  let i = 0;
  function readName() { const s = i; while (i < tpl.length && /[\w:.\-]/.test(tpl[i])) i++; return tpl.slice(s, i); }
  function skipWs() { while (/\s/.test(tpl[i] ?? '')) i++; }

  // Lee una expresión {…} (i en la llave) y devuelve JS; sustituye el JSX embebido.
  function scanBraced() {
    let depth = 0, out = '';
    for (; i < tpl.length; ) {
      const c = tpl[i];
      if (c === '{') { depth++; out += c; i++; continue; }
      if (c === '}') { depth--; out += c; i++; if (depth === 0) return out.slice(1, -1); continue; }
      if (c === '"' || c === "'") { const q = c; let s = c; i++; while (tpl[i] !== q) { if (tpl[i] === '\\') { s += tpl[i++]; } s += tpl[i++]; } s += q; i++; out += s; continue; }
      if (c === '`') { out += scanTemplate(); continue; }
      if (c === '/' && tpl[i + 1] === '/') { while (tpl[i] !== '\n') out += tpl[i++]; continue; }
      if (c === '<' && isLetter(tpl[i + 1])) {
        const prev = out.replace(/\s+$/, '').slice(-1);
        if (prev === '' || '(,?:&|=>{'.includes(prev)) { out += parseElement(); continue; }
      }
      out += c; i++;
    }
    throw new Error('Llave sin cerrar en ' + file);
  }
  function scanTemplate() {
    let s = '`'; i++;
    while (tpl[i] !== '`') {
      if (tpl[i] === '\\') { s += tpl[i++] + tpl[i++]; continue; }
      if (tpl[i] === '$' && tpl[i + 1] === '{') { i++; s += '$' + '{' + scanBraced() + '}'; continue; }
      s += tpl[i++];
    }
    i++; return s + '`';
  }

  function parseChildren(stop) {
    const parts = [];
    while (i < tpl.length) {
      if (tpl.startsWith('</', i)) {
        const e = tpl.indexOf('>', i); const n = tpl.slice(i + 2, e).trim();
        if (stop && n === stop) { i = e + 1; return parts; }
        throw new Error(`Cierre inesperado </${n}> en ${file}`);
      }
      if (tpl.startsWith('<!--', i)) { i = tpl.indexOf('-->', i) + 3; continue; }
      if (tpl[i] === '<' && isLetter(tpl[i + 1])) { parts.push(parseElement()); continue; }
      if (tpl[i] === '{') { parts.push(`__r(${scanBraced()})`); continue; }
      let s = i;
      while (i < tpl.length && tpl[i] !== '{' && !(tpl[i] === '<' && (isLetter(tpl[i + 1]) || tpl[i + 1] === '/' || tpl.startsWith('<!--', i)))) i++;
      parts.push(JSON.stringify(tpl.slice(s, i)));
    }
    if (stop) throw new Error(`Falta </${stop}> en ${file}`);
    return parts;
  }

  function parseElement() {
    i++; // <
    const name = readName();
    const attrs = [];
    let selfClose = false;
    for (;;) {
      skipWs();
      if (tpl.startsWith('/>', i)) { selfClose = true; i += 2; break; }
      if (tpl[i] === '>') { i++; break; }
      const an = readName();
      if (!an) throw new Error(`Atributo ilegible en <${name}> de ${file}: ${tpl.slice(i, i + 40)}`);
      let val = 'true';
      if (tpl[i] === '=') {
        i++;
        if (tpl[i] === '{') val = '(' + scanBraced() + ')';
        else { const q = tpl[i]; const e = tpl.indexOf(q, i + 1); val = JSON.stringify(tpl.slice(i + 1, e)); i = e + 1; }
      }
      attrs.push(`${JSON.stringify(an)}:${val}`);
    }
    const a = `{${attrs.join(',')}}`;
    const dynamic = /^[A-Z]/.test(name);
    if (name === 'slot') return '__raw(Astro.slot ?? "")';
    if (RAWTEXT.has(name) && !selfClose) {
      const e = tpl.indexOf(`</${name}>`, i); const inner = tpl.slice(i, e); i = e + name.length + 3;
      if (name === 'script' && !attrs.some((x) => x.startsWith('"is:inline"')) && !attrs.length) {
        const mm = inner.match(/import\s+['"]([^'"]+)['"]/);
        const abs = '/' + path.posix.normalize(path.posix.join(relFromRoot.split(path.sep).join('/'), mm[1]));
        return `__t("script",{"type":"module","src":${JSON.stringify(abs)}},"")`;
      }
      return `__t(${JSON.stringify(name)},${a},${JSON.stringify(inner)})`;
    }
    const kids = selfClose || (VOID.has(name) && !dynamic) ? '""' : (parseChildren(name).join('+') || '""');
    return dynamic ? `__c(${name},${a},${kids})` : `__t(${JSON.stringify(name)},${a},${kids})`;
  }

  const body = parseChildren(null);
  return `${imports.join('\n')}
import { t as __t, c as __c, r as __r, raw as __raw } from '${pathToFileURL(path.join(buildDir, 'rt.mjs')).href}';
export default function (Astro) {
${fm}
return __raw(${body.join('+') || '""'});
}
${/export function getStaticPaths/.test(fm) ? '' : ''}`;
}

// ---------- ejecución ----------
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });
fs.writeFileSync(path.join(buildDir, 'rt.mjs'), `
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESC[c]);
export class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
export const raw = (s) => new Raw(String(s));
export function r(v) { if (v == null || v === false || v === true) return ''; if (v instanceof Raw) return v.s; if (Array.isArray(v)) return v.map(r).join(''); return esc(v); }
const VOID = new Set(['meta','link','input','br','hr','img','source','path']);
export function t(name, attrs, kids) {
  let s = '<' + name;
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'set:html' || k === 'is:inline') continue;
    if (v === false || v == null) continue;
    s += v === true ? ' ' + k : ' ' + k + '="' + esc(v) + '"';
  }
  s += '>';
  if (VOID.has(name)) return raw(s);
  const inner = 'set:html' in attrs ? String(attrs['set:html']) : String(kids);
  return raw(s + inner + '</' + name + '>');
}
export function c(C, props, kids) {
  if (typeof C === 'string') return t(C, props, kids);
  return C({ props, slot: kids });
}
`);

// Copia el proyecto (solo src/ y public/) y compila cada .astro junto a su fuente.
const work = path.join(buildDir, 'proj');
fs.cpSync(path.join(root, 'src'), path.join(work, 'src'), { recursive: true });
fs.cpSync(path.join(root, 'package.json'), path.join(work, 'package.json'));
function walk(d) { return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])); }
for (const f of walk(path.join(root, 'src')).filter((f) => f.endsWith('.astro'))) {
  const code = compile(fs.readFileSync(f, 'utf8'), f);
  fs.writeFileSync(path.join(work, path.relative(root, f)) + '.mjs', code);
}

// Sustituto de import.meta.glob (solo existe en Vite): carga los fragmentos HTML desde disco.
{
  const f = path.join(work, 'src/locales/fragments.js');
  const code = fs.readFileSync(f, 'utf8').replace(/const raw = import\.meta\.glob\([^\n]*\);/,
    `import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const raw = {};
for (const loc of fs.readdirSync(here, { withFileTypes: true }).filter((e) => e.isDirectory())) for (const kind of ['articles', 'pages']) {
  const d = path.join(here, loc.name, kind);
  if (fs.existsSync(d)) for (const n of fs.readdirSync(d).filter((n) => n.endsWith('.html'))) raw['./' + loc.name + '/' + kind + '/' + n] = fs.readFileSync(path.join(d, n), 'utf8');
}`);
  fs.writeFileSync(f, code);
}
const mod = (p) => import(pathToFileURL(path.join(work, p)).href);
const { routeTable } = await mod('src/i18n/routes.js');
const { buildContext } = await mod('src/lib/context.js');
const { DEFAULT_LOCALE } = await mod('src/i18n/locales.js');
const views = {
  home: (await mod('src/views/HomeView.astro.mjs')).default,
  tools: (await mod('src/views/ToolsHubView.astro.mjs')).default,
  methodology: (await mod('src/views/MethodologyView.astro.mjs')).default,
  category: (await mod('src/views/CategoryView.astro.mjs')).default,
  tool: (await mod('src/views/ToolView.astro.mjs')).default,
};
const notFound = (await mod('src/pages/404.astro.mjs')).default;
const index = (await mod('src/pages/index.astro.mjs')).default;

const write = (urlPath, html) => {
  const f = urlPath.endsWith('.html') ? path.join(outDir, urlPath) : path.join(outDir, urlPath, 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, '<!DOCTYPE html>' + html.replace(/^<!doctype html>/i, '').replace('</head>', '<link rel="stylesheet" href="/src/styles/site.css"></head>'));
};
for (const rt of routeTable()) {
  const ctx = buildContext(rt.locale);
  const [kind, id] = rt.key.split(':');
  const props = { ctx, ...(kind === 'category' ? { categoryId: id } : {}), ...(kind === 'tool' ? { toolId: id } : {}) };
  write(rt.path, views[kind]({ props }).s);
}
write('/404.html', notFound({ props: {} }).s);
write('/', index({ props: {} }).s);
fs.cpSync(path.join(root, 'public'), outDir, { recursive: true });
// Los módulos del navegador (src/scripts → ../lib/present.js …) se sirven tal cual desde /src
fs.cpSync(path.join(root, 'src'), path.join(outDir, 'src'), { recursive: true });
for (const f of walk(path.join(outDir, 'src')).filter((f) => f.endsWith('.astro'))) fs.rmSync(f);
fs.rmSync(buildDir, { recursive: true, force: true });
console.log(`Vista previa generada en ${outDir} (${routeTable().length} páginas + 404 + índice). Aproximación: no es salida de Astro.`);
