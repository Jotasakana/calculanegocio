// Catálogo de UN idioma: calculadoras disponibles (con URL) y en desarrollo (sin URL), agrupadas por categoría.
// Función PURA (sin Astro): la usan context.js y las pruebas. Acepta un `world` sintético para poder probarla.
//
// Reglas:
//  · Una calculadora del registro se muestra «disponible» solo si está publicada en ese idioma; si no lo está
//    (p. ej. una fiscal fuera de su mercado) NO se muestra: no se promete algo que no existe en ese idioma.
//  · Una calculadora fuera del registro se muestra «en desarrollo», sin enlace, si el idioma tiene su texto
//    y (si es fiscal) pertenece al mercado de ese idioma.
//  · Con `includePlanned: false` (así lo usa el sitio desde la Fase 7A) las calculadoras «en desarrollo» NO se muestran:
//    el catálogo anuncia solo las que ya funcionan. No cambia rutas, sitemap ni hreflang (las planificadas nunca tuvieron URL).
//  · Las categorías sin ninguna tarjeta en ese idioma no aparecen. Solo tienen página las que publica la tabla de rutas.

import { marketFor } from '../i18n/publish.js';

export const STATUS = { available: 'available', planned: 'planned' };

/**
 * @param {object} world { locales, content, markets, tools, categories, catalog, catalogCategories }
 * @param {string} localeCode
 * @param {(pageKey:string)=>boolean} published
 * @param {(pageKey:string)=>string} pathOf
 * @param {{ includePlanned?: boolean }} [options] por defecto true (comportamiento histórico, usado por las pruebas)
 */
export function buildCatalog(world, localeCode, published, pathOf, { includePlanned = true } = {}) {
  const content = world.content[localeCode];
  const entries = world.catalog ?? [];
  const catIds = world.catalogCategories ?? Object.keys(world.categories);
  const items = [];

  for (const e of entries) {
    const reg = world.tools[e.id];
    if (reg) {
      if (!published('tool:' + e.id)) continue;
      const txt = content.tools[e.id];
      items.push({
        id: e.id, category: e.category, icon: e.icon, status: STATUS.available, fiscal: reg.scope === 'fiscal' && marketFor(localeCode, e.id, world)?.kind !== 'generic',
        title: txt.menuTitle, desc: txt.tileText, cta: txt.tileCta, search: `${txt.title} ${txt.search}`, path: pathOf('tool:' + e.id),
      });
      continue;
    }
    if (!includePlanned) continue;
    const txt = content.catalog?.planned?.[e.id];
    if (!txt) continue; // check-i18n avisa si falta el texto
    if (e.scope === 'fiscal' && !world.markets[e.market]?.locales.includes(localeCode)) continue;
    items.push({
      id: e.id, category: e.category, icon: e.icon, status: STATUS.planned, fiscal: e.scope === 'fiscal',
      title: txt.title, desc: txt.desc, cta: null, search: `${txt.title} ${txt.search}`, path: null,
    });
  }

  const categories = catIds
    .map((id) => {
      const txt = content.categories?.[id] ?? content.catalog?.categories?.[id];
      const own = items.filter((i) => i.category === id);
      const hasPage = Boolean(world.categories[id]) && published('category:' + id);
      return {
        id, title: txt?.title ?? id, short: txt?.short ?? '',
        path: hasPage ? pathOf('category:' + id) : null,
        total: own.length,
        available: own.filter((i) => i.status === STATUS.available).length,
        planned: own.filter((i) => i.status === STATUS.planned).length,
      };
    })
    .filter((c) => c.total > 0);

  return {
    items,
    categories,
    counts: {
      total: items.length,
      available: items.filter((i) => i.status === STATUS.available).length,
      planned: items.filter((i) => i.status === STATUS.planned).length,
    },
  };
}
