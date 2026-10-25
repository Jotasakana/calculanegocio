// Comprobación de privacidad y consentimiento (no requiere Astro para el código fuente; revisa también dist/ si existe).
// Garantiza que el sitio NO carga cookies, almacenamiento local, scripts de terceros ni publicidad mientras no exista una CMP
// certificada y activada (ver docs/CMP-GOOGLE-TCF.md y src/data/consent.js).
import fs from 'node:fs';
import path from 'node:path';
import { CONSENT } from '../src/data/consent.js';
import { LEGAL } from '../src/data/legal.js';

const root = path.resolve(import.meta.dirname, '..');
const problems = [];
const bad = (m) => problems.push(m);
function walk(d) { return fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])) : []; }
const rel = (f) => path.relative(root, f);

// 1. Estado de la CMP: inactiva y coherente
if (CONSENT.enabled) bad('consent.js: la CMP está activada; revisa docs/CMP-GOOGLE-TCF.md antes de publicar');
if (!CONSENT.enabled && (CONSENT.scriptUrl || CONSENT.provider)) bad('consent.js: scriptUrl/provider deben ser null mientras enabled sea false');
if (CONSENT.enabled && !/^https:\/\//.test(CONSENT.scriptUrl ?? '')) bad('consent.js: una CMP activada necesita una scriptUrl https');

// 2. Código fuente: nada de cookies, almacenamiento ni servicios de terceros
const FORBIDDEN = [
  [/document\.cookie/, 'document.cookie'],
  [/\b(localStorage|sessionStorage|indexedDB)\b/, 'almacenamiento del navegador'],
  [/\bnavigator\.sendBeacon\b|\bfetch\s*\(|XMLHttpRequest/, 'petición de red desde el navegador'],
  [/googlesyndication|adsbygoogle|doubleclick|googletagmanager|google-analytics|gtag\s*\(|\bfbq\s*\(|facebook\.net|hotjar|clarity\.ms|plausible\.io|matomo/i, 'servicio de publicidad o analítica'],
  [/fonts\.googleapis|fonts\.gstatic|cdnjs\.|unpkg\.com|jsdelivr/i, 'recurso externo (fuentes/CDN)'],
];
const srcFiles = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'public'))].filter((f) => /\.(astro|js|ts|css|html|svg)$/.test(f));
for (const f of srcFiles) {
  const text = fs.readFileSync(f, 'utf8');
  // Los textos legales mencionan localStorage/sessionStorage para explicar que NO se usan: se admiten solo en fragmentos HTML.
  if (/\.html$/.test(f)) continue;
  for (const [re, label] of FORBIDDEN) if (re.test(text)) bad(`${rel(f)}: contiene ${label}`);
  for (const m of text.matchAll(/<(?:script|link|img|iframe)\b[^>]*\b(?:src|href)=["'](https?:)?\/\/[^"']+["']/gi)) {
    if (/rel=["']canonical|rel=["']alternate/.test(m[0])) continue;
    bad(`${rel(f)}: recurso externo cargado: ${m[0].slice(0, 80)}`);
  }
}

// 3. dist/ (si se ha compilado): ningún script/estilo/imagen externo ni referencia a servicios de terceros
const dist = path.join(root, 'dist');
let htmlCount = 0;
for (const f of walk(dist).filter((f) => /\.(html|js|css)$/.test(f))) {
  htmlCount += f.endsWith('.html') ? 1 : 0;
  const text = fs.readFileSync(f, 'utf8');
  for (const [re, label] of FORBIDDEN.slice(0, 1).concat(FORBIDDEN.slice(3))) if (re.test(text)) bad(`${rel(f)}: contiene ${label}`);
  if (/\.html$/.test(f)) for (const m of text.matchAll(/<(?:script|link|img|iframe)\b[^>]*\b(?:src|href)=["'](https?:)?\/\/[^"']+["']/gi)) {
    if (/rel=["'](canonical|alternate)/.test(m[0])) continue;
    bad(`${rel(f)}: recurso externo cargado: ${m[0].slice(0, 80)}`);
  }
}

// 4. Datos legales: estado coherente
if (LEGAL.status === 'final' && !LEGAL.email.verified) bad('legal.js: no se puede marcar como "final" con el correo sin verificar');
if (!LEGAL.email.verified && !/^[^@\s]+@calculanegocio\.com$/.test(LEGAL.email.address)) bad('legal.js: dirección de correo inesperada');

console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · privacidad: sin cookies, almacenamiento ni recursos de terceros${htmlCount ? ` (dist/: ${htmlCount} páginas revisadas)` : ' (dist/ no compilado: solo código fuente)'}`);
process.exit(problems.length ? 1 : 0);
