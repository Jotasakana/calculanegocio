// ¿Qué se publica? Un contenido se publica solo si su idioma está habilitado, su estado editorial es
// 'source' o 'reviewed' y, si la calculadora es fiscal, el idioma pertenece a un mercado verificado.
// Lo que no se publica no genera página, ni entrada en el selector, el sitemap o hreflang.
//
// Todas las funciones aceptan un `world` ({ locales, content, markets }) para poder probarlas con datos
// sintéticos; por defecto usan los reales.

import { LOCALES } from './locales.js';
import { CONTENT } from '../locales/index.js';
import { MARKETS } from '../markets/es.js';
import { TOOL_REGISTRY, CATEGORY_REGISTRY } from '../domain/registry.js';
import { CATALOG, CATALOG_CATEGORIES } from '../domain/catalog.js';

// Estados editoriales:
//   source / reviewed  -> se publican siempre.
//   unreviewed         -> traducción hecha pero SIN revisión nativa registrada: solo se publica en el modo de
//                         desarrollo (SITE_INDEXABLE distinto de "true"). Al activar la indexación desaparece sola
//                         hasta que una persona la revise y se registre como 'reviewed'. Nunca se simula una revisión.
// Páginas informativas y legales (clave 'page:<id>'). Cada idioma debe tener su slug y su fragmento pages/legal-<id>.html.
export const PAGE_IDS = ['contact', 'legal', 'privacy', 'cookies', 'terms'];

export const PUBLISHABLE = new Set(['source', 'reviewed']);
// Mantener idiomas sin revisión disponibles para los visitantes, independientemente de SEO.
// La etiqueta noindex se decide por página en seo.js; ninguna revisión se simula.
const UNREVIEWED_OK = true;
export const isPublishableStatus = (status, world) => PUBLISHABLE.has(status) || (status === 'unreviewed' && (world?.allowUnreviewed ?? UNREVIEWED_OK));

export const REAL_WORLD = { locales: LOCALES, content: CONTENT, markets: MARKETS, tools: TOOL_REGISTRY, categories: CATEGORY_REGISTRY, catalog: CATALOG, catalogCategories: CATALOG_CATEGORIES };

export function reviewOf(localeCode, pageKey, world = REAL_WORLD) {
  const r = world.content[localeCode]?.review;
  return r?.pages?.[pageKey] ?? r?.default ?? { status: 'draft' };
}

/**
 * Mercado que habilita una calculadora fiscal en un idioma: el suyo (p. ej. España) o, si la calculadora lo admite
 * (`genericRate`), el mercado genérico de porcentajes. null = no disponible en ese idioma. Las universales no necesitan mercado.
 */
export function marketFor(localeCode, toolId, world = REAL_WORLD) {
  const tool = world.tools[toolId];
  if (!tool || tool.scope === 'universal') return null;
  const own = world.markets[tool.market];
  if (own?.locales.includes(localeCode)) return own;
  if (tool.genericRate) return Object.values(world.markets).find((m) => m.kind === 'generic' && m.locales.includes(localeCode)) ?? null;
  return null;
}

/** ¿Está disponible la calculadora en ese idioma? (las fiscales solo en los idiomas de su mercado o del genérico). */
export function toolAvailable(localeCode, toolId, world = REAL_WORLD) {
  const tool = world.tools[toolId];
  if (!tool) return false;
  if (tool.scope === 'universal') return true;
  return marketFor(localeCode, toolId, world) !== null;
}

/** pageKey: 'home' | 'tools' | 'methodology' | 'page:<id>' | 'category:<id>' | 'tool:<id>' */
export function isPublished(localeCode, pageKey, world = REAL_WORLD) {
  if (world.locales[localeCode]?.status !== 'enabled' || !world.content[localeCode]) return false;
  if (!isPublishableStatus(reviewOf(localeCode, pageKey, world).status, world)) return false;
  if (pageKey.startsWith('tool:')) return toolAvailable(localeCode, pageKey.slice(5), world);
  if (pageKey.startsWith('category:')) {
    const cat = world.categories[pageKey.slice(9)];
    return cat.tools.some((t) => isPublished(localeCode, 'tool:' + t, world));
  }
  return true;
}

// Un idioma cuenta como publicado solo si tiene al menos UNA página publicada. Con la indexación activada (SITE_INDEXABLE=true)
// los idiomas 'unreviewed' no generan ninguna página: no deben aparecer en el selector, en hreflang ni en el sitemap
// (antes de la Fase 3B el selector habría enlazado entonces a páginas inexistentes).
const hasPublishedPage = (code, world) =>
  ['home', 'tools', 'methodology', ...PAGE_IDS.map((id) => 'page:' + id), ...Object.keys(world.categories).map((id) => 'category:' + id), ...Object.keys(world.tools).map((id) => 'tool:' + id)]
    .some((key) => isPublished(code, key, world));

export const publishedLocales = (world = REAL_WORLD) =>
  Object.values(world.locales).filter((l) => l.status === 'enabled' && world.content[l.code] && hasPublishedPage(l.code, world)).map((l) => l.code);
