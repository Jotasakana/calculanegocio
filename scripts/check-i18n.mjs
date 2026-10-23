// Comprobaciones de integridad de los idiomas y los contenidos (no requiere Astro).
import fs from 'node:fs';
import path from 'node:path';
import { REAL_WORLD } from '../src/i18n/publish.js';
import { validateLocale, validateWorld } from '../src/i18n/validate.js';

const root = path.resolve(import.meta.dirname, '..');
const readFragment = (locale, kind, key) => {
  const f = path.join(root, 'src/locales', locale, kind, key + '.html');
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
};

const problems = [...validateWorld(REAL_WORLD)];
const locales = Object.keys(REAL_WORLD.content);
for (const code of locales) problems.push(...validateLocale(code, REAL_WORLD, { readFragment }));

// Carpetas de idioma sin registrar (contenido huérfano)
for (const d of fs.readdirSync(path.join(root, 'src/locales'), { withFileTypes: true }))
  if (d.isDirectory() && !REAL_WORLD.content[d.name]) problems.push(`src/locales/${d.name}: carpeta no registrada en src/locales/index.js`);

console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : `OK · contenidos de ${locales.length} idioma(s) coherentes (${locales.join(', ')})`);
process.exit(problems.length ? 1 : 0);
