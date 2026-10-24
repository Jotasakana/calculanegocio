// Contexto de una página: todo lo que las plantillas necesitan de UN idioma (textos, URLs, calculadoras
// publicadas, calculador con su moneda por defecto). Función pura y probada en scripts/test-pages.mjs;
// las plantillas .astro solo pintan lo que devuelve.

import { REAL_WORLD, isPublished, publishedLocales, marketFor } from '../i18n/publish.js';
import { pathFor } from '../i18n/routes.js';
import { createCalculator } from './present.js';
import { currencyOptions } from '../i18n/currencies.js';
import { buildCatalog } from './catalog.js';
import { FEATURED_TOOLS } from '../domain/catalog.js';
import { fill } from './fill.js';
import { withToc } from './toc.js';

export function buildContext(localeCode, world = REAL_WORLD) {
  const loc = world.locales[localeCode];
  const content = world.content[localeCode];
  if (!loc || !content) throw new Error(`Idioma sin contenidos: ${localeCode}`);

  const published = (key) => isPublished(localeCode, key, world);
  const path = (key) => {
    if (!published(key)) throw new Error(`Página no publicada en ${localeCode}: ${key}`);
    return pathFor(localeCode, key, world);
  };

  const toolView = (id) => {
    const reg = world.tools[id];
    const txt = content.tools[id];
    // Mercado que habilita la calculadora en este idioma (null en las universales). El genérico no es un país.
    const market = marketFor(localeCode, id, world);
    const generic = market?.kind === 'generic';
    return {
      id, key: 'tool:' + id, path: path('tool:' + id), scope: reg.scope, category: reg.category, symbol: reg.symbol,
      article: reg.article, related: reg.related.filter((r) => published('tool:' + r)), ...txt,
      // `modes`/`fields` del texto son etiquetas; las especificaciones de los campos (tipo, valor inicial) son neutrales.
      specs: reg.modes, modeLabels: txt.modes, labels: txt.fields,
      // Las calculadoras de un país tienen moneda fija (la de su mercado); las universales y las genéricas permiten elegirla.
      currency: market && !generic ? market.currency : null,
      currencyFixed: Boolean(market) && !generic,
      // Ligada a la normativa de un país (insignia «España»). La versión genérica no lo está.
      countryBound: reg.scope === 'fiscal' && !generic,
      // Versión genérica: aplica el porcentaje que escribe la persona, sin normas de ningún país.
      generic,
      // Calculadora de un país que aún no está verificado con fuentes oficiales: se avisa en la ficha.
      fiscalPending: Boolean(market) && !generic && !market.verified,
    };
  };
  const tools = Object.keys(world.tools).filter((id) => published('tool:' + id)).map(toolView);
  const toolById = Object.fromEntries(tools.map((t) => [t.id, t]));

  const categories = Object.values(world.categories)
    .filter((c) => published('category:' + c.id))
    .map((c) => ({ id: c.id, key: 'category:' + c.id, path: path('category:' + c.id), ...content.categories[c.id], tools: c.tools.filter((t) => toolById[t]).map((t) => toolById[t]) }));
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const defaultCurrency = loc.defaultCurrency;
  const catalog = buildCatalog(world, localeCode, published, path);
  const featuredTools = FEATURED_TOOLS.filter((id) => toolById[id]).map((id) => toolById[id]);

  /**
   * Opciones del selector de idioma: TODOS los idiomas publicados. Cada una lleva a la página equivalente si existe en
   * ese idioma (`equivalent: true`) y, si no, a su portada: nunca a una URL inexistente. Fuera de la tabla de rutas
   * (404) todas llevan a la portada. Solo hay selector si hay más de un idioma publicado.
   */
  const versions = (pageKey) =>
    publishedLocales(world).map((l) => {
      const equivalent = Boolean(pageKey) && isPublished(l, pageKey, world);
      return { code: l, name: world.locales[l].name, hreflang: world.locales[l].hreflang, href: pathFor(l, equivalent ? pageKey : 'home', world), current: l === localeCode, equivalent };
    });

  return {
    locale: localeCode,
    loc,
    ui: content.ui,
    content,
    published,
    path,
    versions,
    tools, toolById, categories, categoryById,
    catalog, featuredTools,
    /** Rellena los marcadores {x} de un texto de interfaz. */
    fill,
    /** Añade ids a los apartados de un fragmento y devuelve el índice: { html, toc:[{id,title}] }. */
    withToc,
    defaultCurrency,
    currencies: currencyOptions(loc.intl),
    /** Calculador del idioma con la moneda dada (por defecto, la del idioma; null = sin símbolo). */
    calculator: (currency = defaultCurrency) => createCalculator(content, currency),
    /** Contexto para los fragmentos HTML. */
    fragmentCtx: {
      path,
      title: (kind, id) => (kind === 'tool' ? toolById[id] : categoryById[id]).title,
    },
    /** Solo lo que necesita el navegador para calcular: nada de textos de página. */
    clientI18n: {
      code: localeCode, errors: content.errors, messages: content.messages, selectOptions: content.selectOptions ?? {},
      ui: { copy: content.ui.tool.copy, copied: content.ui.tool.copied, copyFailed: content.ui.tool.copyFailed },
    },
    nav: [
      { key: 'home', label: content.ui.nav.home },
      { key: 'tools', label: content.ui.nav.tools },
      ...categories.map((c) => ({ key: c.key, label: c.title })),
      { key: 'methodology', label: content.ui.nav.methodology },
    ].map((n) => ({ ...n, href: path(n.key) })),
    searchIndex: [
      ...tools.map((t) => ({ title: t.title, kind: content.ui.search.kindTool, url: t.path, terms: t.search })),
      ...categories.map((c) => ({ title: c.title, kind: content.ui.search.kindCategory, url: c.path, terms: c.title + ' ' + c.short })),
    ],
  };
}
