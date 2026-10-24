// Tabla de rutas: la ÚNICA fuente de las URLs públicas. Menús, enlaces, sitemap, hreflang, buscador y las
// páginas generadas salen de aquí. Solo contiene páginas publicadas (ver publish.js).
//
// URL = /<prefijo-de-idioma>/<slug traducido>/ . Los slugs viven en src/locales/<idioma>/tools.js.
// Las URLs españolas actuales no cambian (ver el snapshot en scripts/test-i18n.mjs).

import { DEFAULT_LOCALE } from './locales.js';
import { REAL_WORLD, isPublished, publishedLocales } from './publish.js';

export const pageKeys = (world = REAL_WORLD) => [
  'home',
  'tools',
  'methodology',
  ...Object.keys(world.categories).map((id) => 'category:' + id),
  ...Object.keys(world.tools).map((id) => 'tool:' + id),
];

export function pathFor(localeCode, pageKey, world = REAL_WORLD) {
  const prefix = world.locales[localeCode].prefix;
  const slugs = world.content[localeCode].slugs;
  const [kind, id] = pageKey.split(':');
  const slug = { home: '', tools: slugs.tools, methodology: slugs.methodology, category: slugs.categories?.[id], tool: slugs.toolPages?.[id] }[kind];
  if (slug === undefined) throw new Error(`Falta el slug de "${pageKey}" en "${localeCode}"`);
  return `/${prefix}/${slug ? slug + '/' : ''}`;
}

/** Todas las páginas publicadas: [{ key, locale, path }] */
export function routeTable(world = REAL_WORLD) {
  const out = [];
  for (const locale of publishedLocales(world))
    for (const key of pageKeys(world)) if (isPublished(locale, key, world)) out.push({ key, locale, path: pathFor(locale, key, world) });
  return out;
}

/**
 * Versiones alternativas de una página (hreflang). Solo se incluyen las publicadas; con una única versión
 * no se emite ninguna. x-default apunta al idioma por defecto si está publicado.
 * @returns {{hreflang:string, path:string}[]}
 */
export function alternatesFor(pageKey, world = REAL_WORLD) {
  const versions = publishedLocales(world).filter((l) => isPublished(l, pageKey, world));
  if (versions.length < 2) return [];
  const list = versions.map((l) => ({ hreflang: world.locales[l].hreflang, path: pathFor(l, pageKey, world) }));
  if (versions.includes(DEFAULT_LOCALE)) list.push({ hreflang: 'x-default', path: pathFor(DEFAULT_LOCALE, pageKey, world) });
  return list;
}
