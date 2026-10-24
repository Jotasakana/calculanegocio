// Pruebas de la Fase 3A sobre los idiomas REALES (es, en, pt-br): publicación, selector, mercado genérico,
// hreflang recíproco, formatos y calculadoras en cada idioma. No requiere Astro.
import { REAL_WORLD, isPublished, marketFor, publishedLocales } from '../src/i18n/publish.js';
import { routeTable, pathFor, alternatesFor } from '../src/i18n/routes.js';
import { buildContext } from '../src/lib/context.js';
import { createCalculator } from '../src/lib/present.js';
import { TOOL_REGISTRY } from '../src/domain/registry.js';
import { validateWorld } from '../src/i18n/validate.js';
import { sitemapXml } from '../src/i18n/sitemap.js';
import { headModel } from '../src/i18n/seo.js';

let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  if (String(got) !== String(want)) { fails++; console.error(`✗ ${name}\n   obtenido: ${got}\n   esperado: ${want}`); }
}
const LANGS = ['es', 'en', 'pt-br'];
const ALL_KEYS = ['home', 'tools', 'methodology', ...Object.keys(REAL_WORLD.categories).map((c) => 'category:' + c), ...Object.keys(REAL_WORLD.tools).map((t) => 'tool:' + t)];
const nb = (s) => s.replace(/[  ]/g, ' ');

// 1. Publicación: los tres idiomas con las mismas 9 páginas, y nada más
check('idiomas publicados', publishedLocales().join(), LANGS.join());
for (const l of LANGS) {
  check(`${l}: publica las ${ALL_KEYS.length} páginas`, ALL_KEYS.every((k) => isPublished(l, k)), true);
  check(`${l}: tabla de rutas`, routeTable().filter((r) => r.locale === l).length, ALL_KEYS.length);
}
check('mundo real válido', validateWorld(REAL_WORLD).join('; ') || 'ok', 'ok');
check('prefijos de URL', LANGS.map((l) => pathFor(l, 'home')).join(' '), '/es/ /en/ /pt-br/');
check('URL ES conservada', pathFor('es', 'tool:precio'), '/es/calculadora-precio-de-venta/');
const paths = routeTable().map((r) => r.path);
check('sin URLs duplicadas', new Set(paths).size, paths.length);
check('todas las URLs bajo su prefijo', routeTable().every((r) => r.path.startsWith('/' + REAL_WORLD.locales[r.locale].prefix + '/')), true);

// 2. Mercados: ES sigue ligada a España; en y pt-br usan la versión genérica (sin normas locales)
check('es: precio/iva pertenecen al mercado de España', ['precio', 'iva'].every((t) => marketFor('es', t).id === 'es'), true);
check('en/pt-br: precio/iva usan el mercado genérico', ['en', 'pt-br'].every((l) => ['precio', 'iva'].every((t) => marketFor(l, t).kind === 'generic')), true);
check('universales no necesitan mercado', marketFor('en', 'margen'), null);
check('el mercado genérico no fija moneda ni se declara verificado', `${REAL_WORLD.markets.generic.currency}/${REAL_WORLD.markets.generic.verified}`, 'null/false');
{
  const w = structuredClone(REAL_WORLD);
  w.markets.generic.locales = [];
  check('sin mercado genérico, en no publica precio/iva', ['precio', 'iva'].some((t) => isPublished('en', 'tool:' + t, w)), false);
  const w2 = structuredClone(REAL_WORLD); w2.tools.precio.genericRate = false;
  check('una calculadora sin genericRate no sale fuera de su mercado', isPublished('en', 'tool:precio', w2), false);
}

// 3. Estado editorial: 'unreviewed' solo se publica en modo desarrollo; nunca se simula una revisión
for (const l of ['en', 'pt-br']) {
  const r = REAL_WORLD.content[l].review;
  check(`${l}: estado 'unreviewed' sin revisor inventado`, `${r.default.status}/${r.default.reviewer ?? '-'}/${Object.keys(r.pages).length}`, 'unreviewed/-/0');
  const strict = { ...REAL_WORLD, allowUnreviewed: false };
  check(`${l}: con indexación activada no se publica sin revisión`, ALL_KEYS.some((k) => isPublished(l, k, strict)), false);
  check(`${l}: con indexación activada no genera rutas`, routeTable(strict).filter((r2) => r2.locale === l).length, 0);
}
check('es sigue publicado con la indexación activada', isPublished('es', 'home', { ...REAL_WORLD, allowUnreviewed: false }), true);

// 4. Selector de idioma (contexto): todos los idiomas, página equivalente, sin 404
for (const l of LANGS) {
  const ctx = buildContext(l);
  for (const key of ALL_KEYS) {
    const v = ctx.versions(key);
    check(`${l}/${key}: el selector lista los 3 idiomas`, v.map((x) => x.code).join(), LANGS.join());
    check(`${l}/${key}: marca el idioma actual`, v.filter((x) => x.current).map((x) => x.code).join(), l);
    check(`${l}/${key}: cada opción es una página publicada`, v.every((x) => paths.includes(x.href)), true);
    check(`${l}/${key}: la página equivalente existe en todos los idiomas`, v.every((x) => x.equivalent), true);
    check(`${l}/${key}: el enlace conserva la página`, v.map((x) => x.href).join(), LANGS.map((c) => pathFor(c, key)).join());
  }
  const v404 = ctx.versions(null);
  check(`${l}: sin página equivalente (404) el selector lleva a las portadas`, v404.map((x) => x.href).join(), LANGS.map((c) => pathFor(c, 'home')).join());
}
{
  // Respaldo a la portada cuando un idioma no tiene la página
  const w = structuredClone(REAL_WORLD);
  w.content.en.review.pages = { 'tool:rentabilidad': { status: 'draft' } };
  const v = buildContext('es', w).versions('tool:rentabilidad');
  check('sin equivalente: lleva a la portada del idioma, no a una URL inexistente', v.map((x) => `${x.code}${x.equivalent ? '=' : '!'}${x.href}`).join(' '), 'es=/es/margen-bruto-y-margen-neto/ en!/en/ pt-br=/pt-br/margen-bruta-e-margem-liquida/'.replace('margen-bruta-e-margem-liquida', REAL_WORLD.content['pt-br'].slugs.toolPages.rentabilidad));
}
check('nombres de idioma en su propio idioma', buildContext('es').versions('home').map((x) => x.name).join(' | '), 'Español | English | Português (Brasil)');

// 5. hreflang, canonical y sitemap
for (const key of ALL_KEYS) {
  const alts = alternatesFor(key);
  check(`hreflang ${key}`, alts.map((a) => a.hreflang).join(), 'es,en,pt-BR,x-default');
  check(`hreflang ${key}: x-default = español`, alts.find((a) => a.hreflang === 'x-default').path, pathFor('es', key));
}
{
  let nonRecip = 0;
  const table = routeTable();
  for (const r of table) for (const a of alternatesFor(r.key).filter((x) => x.hreflang !== 'x-default')) {
    const other = table.find((t) => t.path === a.path);
    if (!other || !alternatesFor(other.key).some((b) => b.path === r.path)) nonRecip++;
  }
  check('hreflang recíproco', nonRecip, 0);
  const xml = sitemapXml('https://calculanegocio.com');
  check('sitemap: una URL por página', (xml.match(/<loc>/g) || []).length, table.length);
  check('sitemap: 4 alternativas por página (3 idiomas + x-default)', (xml.match(/xhtml:link/g) || []).length, table.length * 4);
  check('sitemap: incluye pt-BR', xml.includes('hreflang="pt-BR"'), true);
  for (const l of LANGS) {
    const h = headModel({ locale: l, key: 'tool:margen', siteUrl: 'https://calculanegocio.com', indexable: false });
    check(`${l}: canonical propio`, h.canonical, 'https://calculanegocio.com' + pathFor(l, 'tool:margen'));
    check(`${l}: noindex,nofollow en desarrollo`, h.robots, 'noindex,nofollow');
    check(`${l}: lang`, h.lang, REAL_WORLD.locales[l].hreflang);
  }
}

// 6. Contexto por idioma: calculadoras, aviso genérico y monedas
{
  const es = buildContext('es'), en = buildContext('en'), pt = buildContext('pt-br');
  check('es: IVA con moneda fija EUR y etiqueta de España', `${es.toolById.iva.currencyFixed}/${es.toolById.iva.currency}/${es.toolById.iva.countryBound}/${es.toolById.iva.generic}`, 'true/EUR/true/false');
  check('en: IVA genérico, moneda elegible, sin etiqueta de país', `${en.toolById.iva.currencyFixed}/${en.toolById.iva.currency}/${en.toolById.iva.countryBound}/${en.toolById.iva.generic}`, 'false/null/false/true');
  check('pt-br: genérico, moneda elegible (BRL por defecto del idioma)', `${pt.toolById.precio.currencyFixed}/${pt.toolById.precio.generic}/${pt.defaultCurrency}`, 'false/true/BRL');
  check('en: no se presupone ninguna moneda', en.defaultCurrency, null);
  check('en/pt-br: sin aviso de normativa pendiente de un país', `${en.toolById.iva.fiscalPending}/${pt.toolById.precio.fiscalPending}`, 'false/false');
  check('es: aviso fiscal pendiente conservado', es.toolById.iva.fiscalPending, true);
  check('en/pt-br: el catálogo no muestra la insignia de país', [en, pt].every((c) => c.catalog.items.every((i) => !i.fiscal)), true);
  check('es: el catálogo conserva la insignia «España»', es.catalog.items.filter((i) => i.fiscal).map((i) => i.id).sort().join(), 'equivalencia,irpf,iva,precio');
  check('en/pt-br: sin IRPF ni recargo de equivalencia (solo España)', [en, pt].every((c) => !c.catalog.items.some((i) => ['irpf', 'equivalencia'].includes(i.id))), true);
  check('en/pt-br: 16 en el catálogo, 4 disponibles', `${en.catalog.counts.total}/${en.catalog.counts.available}-${pt.catalog.counts.total}/${pt.catalog.counts.available}`, '16/4-16/4');
}

// 7. Calculadoras en cada idioma: valores iniciales, formatos y errores
const SPANISH_LEAK = /\b(IVA|margen|recargo|coste|descuento|Agencia Tributaria|España|IRPF)\b/i;
for (const l of LANGS) {
  const ctx = buildContext(l);
  const cur = l === 'pt-br' ? 'BRL' : l === 'es' ? 'EUR' : null;
  const calc = createCalculator(ctx.content, cur);
  for (const [id, reg] of Object.entries(TOOL_REGISTRY)) {
    reg.modes.forEach((_, mode) => {
      const r = calc.compute(id, mode, calc.defaults(id, mode));
      check(`${l}/${id}/${mode}: los valores iniciales calculan`, r.ok, true);
      if (r.ok) {
        const text = [r.label, r.main, r.note, r.assumption, ...r.lines.flat(), ...r.bar.map((b) => b.label)].join(' ');
        check(`${l}/${id}/${mode}: sin «undefined» ni «NaN»`, /undefined|NaN/.test(text), false);
        if (l !== 'es') check(`${l}/${id}/${mode}: sin textos españoles en el resultado`, SPANISH_LEAK.test(text), false);
      }
    });
  }
  // Errores traducidos
  const e = calc.compute('margen', 0, { cost: 'abc', price: '100', quantity: '1' });
  check(`${l}: error de número inválido en su idioma`, e.ok === false && e.error === ctx.content.errors['invalid-number'], true);
  if (l !== 'es') check(`${l}: el error no es el texto español`, e.error !== REAL_WORLD.content.es.errors['invalid-number'], true);
}
{
  // Mismo cálculo, formato propio: 60 → 100 da 40 % y 66,67 % en todos los idiomas
  const get = (l, cur, cost, price) => createCalculator(REAL_WORLD.content[l], cur).compute('margen', 0, { cost, price, quantity: '1' });
  check('es 60→100', nb(get('es', 'EUR', '60', '100').lines.map((x) => x[1]).join('|')), '40,00 €|40,00 %|66,67 %|40,00 €');
  check('en 60→100', nb(get('en', null, '60', '100').lines.map((x) => x[1]).join('|')), '40.00|40.00%|66.67%|40.00');
  check('en 60→100 con moneda elegida (GBP)', nb(get('en', 'GBP', '60', '100').lines[0][1]), '£40.00');
  check('pt-br 60→100', nb(get('pt-br', 'BRL', '60', '100').lines.map((x) => x[1]).join('|')), 'R$ 40,00|40,00%|66,67%|R$ 40,00');
  check('pt-br acepta coma decimal', get('pt-br', 'BRL', '60,50', '100,25').ok, true);
  check('pt-br miles con punto', nb(get('pt-br', 'BRL', '1.250,50', '2.000').lines[0][1]), 'R$ 749,50');
  check('en miles con coma', nb(get('en', null, '1,250.50', '2,000').lines[0][1]), '749.50');
  check('en no acepta negativos', get('en', null, '-1', '2').ok, false);
}
{
  // Impuesto genérico: el mismo cálculo matemático en los tres idiomas, con el tipo que escribe la persona
  const iva = (l, cur) => createCalculator(REAL_WORLD.content[l], cur).compute('iva', 0, { base: l === 'en' ? '1000.00' : '1000,00', vat: '15' });
  check('base 1000 + 15 % = 1150 (es/en/pt-br)', [iva('es', 'EUR'), iva('en', null), iva('pt-br', 'BRL')].map((r) => r.data.total).join(), '1150,1150,1150');
  const sin = createCalculator(REAL_WORLD.content.en, null).compute('iva', 1, { total: '1,150', vat: '15' });
  check('quitar un 15 % a 1150 deja 1000', sin.data.base, 1000);
}
for (const l of ['en', 'pt-br']) {
  const d = REAL_WORLD.content[l].tools;
  check(`${l}: tipo de ejemplo genérico (no el 21 % español)`, JSON.stringify([d.precio.defaults, d.iva.defaults]), '[{"vat":10},{"vat":10,"vat1":10,"vat2":10,"vat3":5}]');
  const calc = createCalculator(REAL_WORLD.content[l], null);
  check(`${l}: el campo de impuesto arranca en 10`, calc.defaults('precio', 0).vat.replace(',', '.'), '10');
}
check('es conserva su 21 %', createCalculator(REAL_WORLD.content.es, 'EUR').defaults('precio', 0).vat, '21');

console.log(fails ? `${fails} de ${total} comprobaciones de idiomas FALLAN` : `OK · ${total} comprobaciones de idiomas superadas`);
process.exit(fails ? 1 : 0);
