// Contexto de una página: todo lo que las plantillas necesitan de UN idioma (textos, URLs, calculadoras
// publicadas, calculador con su moneda por defecto). Función pura y probada en scripts/test-pages.mjs;
// las plantillas .astro solo pintan lo que devuelve.

import { REAL_WORLD, isPublished, publishedLocales } from '../i18n/publish.js';
import { pathFor } from '../i18n/routes.js';
import { createCalculator } from './present.js';
import { currencyOptions } from '../i18n/currencies.js';

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
    return {
      id, key: 'tool:' + id, path: path('tool:' + id), scope: reg.scope, category: reg.category, symbol: reg.symbol,
      article: reg.article, related: reg.related.filter((r) => published('tool:' + r)), ...txt,
      // `modes`/`fields` del texto son etiquetas; las especificaciones de los campos (tipo, valor inicial) son neutrales.
      specs: reg.modes, modeLabels: txt.modes, labels: txt.fields,
      // Las calculadoras fiscales tienen moneda fija (la de su mercado); las universales permiten elegirla.
      currency: reg.scope === 'fiscal' ? world.markets[reg.market].currency : null,
      currencyFixed: reg.scope === 'fiscal',
    };
  };
  const tools = Object.keys(world.tools).filter((id) => published('tool:' + id)).map(toolView);
  const toolById = Object.fromEntries(tools.map((t) => [t.id, t]));

  const categories = Object.values(world.categories)
    .filter((c) => published('category:' + c.id))
    .map((c) => ({ id: c.id, key: 'category:' + c.id, path: path('category:' + c.id), ...content.categories[c.id], tools: c.tools.filter((t) => toolById[t]).map((t) => toolById[t]) }));
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));

  const defaultCurrency = loc.defaultCurrency;

  /** Versiones publicadas de una página en todos los idiomas (para el selector de idioma). */
  const versions = (pageKey) =>
    pageKey
      ? publishedLocales(world).filter((l) => isPublished(l, pageKey, world)).map((l) => ({ code: l, name: world.locales[l].name, hreflang: world.locales[l].hreflang, href: pathFor(l, pageKey, world), current: l === localeCode }))
      : [];

  return {
    locale: localeCode,
    loc,
    ui: content.ui,
    content,
    published,
    path,
    versions,
    tools, toolById, categories, categoryById,
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
    clientI18n: { code: localeCode, errors: content.errors, messages: content.messages, selectOptions: content.selectOptions ?? {} },
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
