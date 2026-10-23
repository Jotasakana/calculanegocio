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

export const PUBLISHABLE = new Set(['source', 'reviewed']);

export const REAL_WORLD = { locales: LOCALES, content: CONTENT, markets: MARKETS, tools: TOOL_REGISTRY, categories: CATEGORY_REGISTRY };

export function reviewOf(localeCode, pageKey, world = REAL_WORLD) {
  const r = world.content[localeCode]?.review;
  return r?.pages?.[pageKey] ?? r?.default ?? { status: 'draft' };
}

/** ¿Está disponible la calculadora en ese idioma? (las fiscales solo en los idiomas de su mercado). */
export function toolAvailable(localeCode, toolId, world = REAL_WORLD) {
  const tool = world.tools[toolId];
  if (!tool) return false;
  if (tool.scope === 'universal') return true;
  return world.markets[tool.market]?.locales.includes(localeCode) ?? false;
}

/** pageKey: 'home' | 'tools' | 'methodology' | 'category:<id>' | 'tool:<id>' */
export function isPublished(localeCode, pageKey, world = REAL_WORLD) {
  if (world.locales[localeCode]?.status !== 'enabled' || !world.content[localeCode]) return false;
  if (!PUBLISHABLE.has(reviewOf(localeCode, pageKey, world).status)) return false;
  if (pageKey.startsWith('tool:')) return toolAvailable(localeCode, pageKey.slice(5), world);
  if (pageKey.startsWith('category:')) {
    const cat = world.categories[pageKey.slice(9)];
    return cat.tools.some((t) => isPublished(localeCode, 'tool:' + t, world));
  }
  return true;
}

export const publishedLocales = (world = REAL_WORLD) =>
  Object.values(world.locales).filter((l) => l.status === 'enabled' && world.content[l.code]).map((l) => l.code);
