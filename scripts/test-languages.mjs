// Pruebas de las Fases 3A y 3B sobre los idiomas REALES (es, en, pt-br, de, fr, hi): publicación, selector, mercado genérico,
// hreflang recíproco, formatos y calculadoras en cada idioma. No requiere Astro.
import { REAL_WORLD, PAGE_IDS, isPublished, marketFor, publishedLocales } from '../src/i18n/publish.js';
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
const LANGS = ['es', 'en', 'pt-br', 'de', 'fr', 'hi'];
const TRANSLATED = LANGS.filter((l) => l !== 'es');
const CURRENCY = { es: 'EUR', 'pt-br': 'BRL', hi: 'INR' }; // moneda por defecto del idioma (el resto: ninguna)
const ALL_KEYS = ['home', 'tools', 'methodology', ...PAGE_IDS.map((p) => 'page:' + p), ...Object.keys(REAL_WORLD.categories).map((c) => 'category:' + c), ...Object.keys(REAL_WORLD.tools).map((t) => 'tool:' + t)];
const nb = (s) => s.replace(/[  ]/g, ' ');

// 1. Publicación: los seis idiomas con las mismas 9 páginas, y nada más
check('idiomas publicados', publishedLocales().join(), LANGS.join());
for (const l of LANGS) {
  check(`${l}: publica las ${ALL_KEYS.length} páginas`, ALL_KEYS.every((k) => isPublished(l, k)), true);
  check(`${l}: tabla de rutas`, routeTable().filter((r) => r.locale === l).length, ALL_KEYS.length);
}
check('mundo real válido', validateWorld(REAL_WORLD).join('; ') || 'ok', 'ok');
check('prefijos de URL', LANGS.map((l) => pathFor(l, 'home')).join(' '), '/es/ /en/ /pt-br/ /de/ /fr/ /hi/');
check('URL ES conservada', pathFor('es', 'tool:precio'), '/es/calculadora-precio-de-venta/');
const paths = routeTable().map((r) => r.path);
check('sin URLs duplicadas', new Set(paths).size, paths.length);
check('todas las URLs bajo su prefijo', routeTable().every((r) => r.path.startsWith('/' + REAL_WORLD.locales[r.locale].prefix + '/')), true);

// 2. Mercados: ES sigue ligada a España; los demás idiomas usan la versión genérica (sin normas locales)
check('es: precio/iva pertenecen al mercado de España', ['precio', 'iva'].every((t) => marketFor('es', t).id === 'es'), true);
check('resto de idiomas: precio/iva usan el mercado genérico', TRANSLATED.every((l) => ['precio', 'iva'].every((t) => marketFor(l, t).kind === 'generic')), true);
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
for (const l of TRANSLATED) {
  const r = REAL_WORLD.content[l].review;
  check(`${l}: estado 'unreviewed' sin revisor inventado`, `${r.default.status}/${r.default.reviewer ?? '-'}/${Object.keys(r.pages).length}`, 'unreviewed/-/0');
  const strict = { ...REAL_WORLD, allowUnreviewed: false };
  check(`${l}: con indexación activada no se publica sin revisión`, ALL_KEYS.some((k) => isPublished(l, k, strict)), false);
  check(`${l}: con indexación activada no genera rutas`, routeTable(strict).filter((r2) => r2.locale === l).length, 0);
}
check('es sigue publicado con la indexación activada', isPublished('es', 'home', { ...REAL_WORLD, allowUnreviewed: false }), true);
{
  // Con la indexación activada solo queda el idioma original: nada de selector, hreflang ni sitemap hacia páginas inexistentes
  const strict = { ...REAL_WORLD, allowUnreviewed: false };
  check('indexación activada: solo se publica es', publishedLocales(strict).join(), 'es');
  check('indexación activada: sin hreflang (una sola versión)', JSON.stringify(alternatesFor('tool:margen', strict)), '[]');
  check('indexación activada: sin hreflang en el sitemap', sitemapXml('https://calculanegocio.com', strict).includes('xhtml:link'), false);
  check('indexación activada: 19 URLs, todas en /es/', routeTable(strict).map((r) => r.path.split('/')[1]).filter((v, i, a) => a.indexOf(v) === i).join() + '/' + routeTable(strict).length, 'es/19');
  check('indexación activada: el selector solo lista es (no se pinta con un único idioma)', buildContext('es', strict).versions('home').map((v) => v.code).join(), 'es');
}

// 4. Selector de idioma (contexto): todos los idiomas, página equivalente, sin 404
for (const l of LANGS) {
  const ctx = buildContext(l);
  for (const key of ALL_KEYS) {
    const v = ctx.versions(key);
    check(`${l}/${key}: el selector lista los 6 idiomas`, v.map((x) => x.code).join(), LANGS.join());
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
  check('sin equivalente: lleva a la portada del idioma, no a una URL inexistente', v.map((x) => `${x.code}${x.equivalent ? '=' : '!'}${x.href}`).join(' '), LANGS.map((c) => (c === 'en' ? 'en!/en/' : `${c}=${pathFor(c, 'tool:rentabilidad')}`)).join(' '));
}
check('nombres de idioma en su propio idioma', buildContext('es').versions('home').map((x) => x.name).join(' | '), 'Español | English | Português (Brasil) | Deutsch | Français | हिन्दी');

// 5. hreflang, canonical y sitemap
for (const key of ALL_KEYS) {
  const alts = alternatesFor(key);
  check(`hreflang ${key}`, alts.map((a) => a.hreflang).join(), 'es,en,pt-BR,de,fr,hi,x-default');
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
  check('sitemap: 84 páginas de contenido', (xml.match(/<loc>/g) || []).length, 84);
  check('sitemap: alternativas multilingües', (xml.match(/xhtml:link/g) || []).length, 84 * 7);
  check('sitemap: incluye los seis idiomas', ['pt-BR', 'de', 'fr', 'hi'].every((h) => xml.includes(`hreflang="${h}"`)), true);
  check('sitemap: 114 URLs (6 idiomas x 19 páginas)', table.length, 114);
  for (const l of LANGS) {
    const h = headModel({ locale: l, key: 'tool:margen', siteUrl: 'https://calculanegocio.com', indexable: false });
    check(`${l}: canonical propio`, h.canonical, 'https://calculanegocio.com' + pathFor(l, 'tool:margen'));
    check(`${l}: noindex,nofollow en desarrollo`, h.robots, 'noindex,follow');
    check(`${l}: lang`, h.lang, REAL_WORLD.locales[l].hreflang);
  }
}

// 6. Contexto por idioma: calculadoras, aviso genérico y monedas
{
  const es = buildContext('es'), en = buildContext('en'), pt = buildContext('pt-br');
  const others = TRANSLATED.map((l) => buildContext(l));
  check('es: IVA con moneda fija EUR y etiqueta de España', `${es.toolById.iva.currencyFixed}/${es.toolById.iva.currency}/${es.toolById.iva.countryBound}/${es.toolById.iva.generic}`, 'true/EUR/true/false');
  check('en: IVA genérico, moneda elegible, sin etiqueta de país', `${en.toolById.iva.currencyFixed}/${en.toolById.iva.currency}/${en.toolById.iva.countryBound}/${en.toolById.iva.generic}`, 'false/null/false/true');
  check('pt-br: genérico, moneda elegible (BRL por defecto del idioma)', `${pt.toolById.precio.currencyFixed}/${pt.toolById.precio.generic}/${pt.defaultCurrency}`, 'false/true/BRL');
  check('en: no se presupone ninguna moneda', en.defaultCurrency, null);
  check('idiomas genéricos: sin aviso de normativa pendiente de un país', others.map((c) => `${c.toolById.iva.fiscalPending}/${c.toolById.precio.fiscalPending}`).join(), TRANSLATED.map(() => 'false/false').join());
  check('de/fr/hi: genéricos, sin insignia de país', ['de', 'fr', 'hi'].map((l) => { const c = buildContext(l).toolById; return `${c.iva.generic}/${c.precio.generic}/${c.iva.countryBound}/${c.iva.currencyFixed}`; }).join(), 'true/true/false/false,true/true/false/false,true/true/false/false');
  check('moneda por defecto: de y fr ninguna (no se presupone), hi INR', ['de', 'fr', 'hi'].map((l) => buildContext(l).defaultCurrency).join(), ',,INR');
  check('es: aviso fiscal pendiente conservado', es.toolById.iva.fiscalPending, true);
  check('idiomas genéricos: el catálogo no muestra la insignia de país', others.every((c) => c.catalog.items.every((i) => !i.fiscal)), true);
  check('es: el catálogo conserva la insignia «España»', es.catalog.items.filter((i) => i.fiscal).map((i) => i.id).sort().join(), 'equivalencia,irpf,iva,precio');
  check('idiomas genéricos: sin IRPF ni recargo de equivalencia (solo España)', others.every((c) => !c.catalog.items.some((i) => ['irpf', 'equivalencia'].includes(i.id))), true);
  check('idiomas genéricos: 16 en el catálogo, 8 disponibles', others.map((c) => `${c.catalog.counts.total}/${c.catalog.counts.available}`).join(), TRANSLATED.map(() => '16/8').join());
  check('catálogo: las 12 calculadoras no españolas restantes y 4 disponibles (sin enlaces a páginas inexistentes)', others.every((c) => c.catalog.items.filter((i) => i.status === 'planned').every((i) => !i.href)), true);
}

// 7. Calculadoras en cada idioma: valores iniciales, formatos y errores
const SPANISH_LEAK = /\b(IVA|margen|recargo|coste|descuento|Agencia Tributaria|España|IRPF)\b/i;
const SPANISH_LEAK_DE = /\b(IVA|recargo|coste|descuento|Agencia Tributaria|España|IRPF)\b/i; // «Margen» también es alemán
const ENGLISH_LEAK = /\b(the|and|your|margin|price|cost|discount|total tax)\b/i;
for (const l of LANGS) {
  const ctx = buildContext(l);
  const cur = CURRENCY[l] ?? null;
  const calc = createCalculator(ctx.content, cur);
  for (const [id, reg] of Object.entries(TOOL_REGISTRY)) {
    reg.modes.forEach((_, mode) => {
      const r = calc.compute(id, mode, calc.defaults(id, mode));
      check(`${l}/${id}/${mode}: los valores iniciales calculan`, r.ok, true);
      if (r.ok) {
        const text = [r.label, r.main, r.note, r.assumption, ...r.lines.flat(), ...r.bar.map((b) => b.label)].join(' ');
        check(`${l}/${id}/${mode}: sin «undefined» ni «NaN»`, /undefined|NaN/.test(text), false);
        if (l !== 'es') check(`${l}/${id}/${mode}: sin textos españoles en el resultado`, (l === 'de' ? SPANISH_LEAK_DE : SPANISH_LEAK).test(text), false);
        if (['de', 'fr', 'hi'].includes(l)) check(`${l}/${id}/${mode}: sin textos ingleses en el resultado`, ENGLISH_LEAK.test(text), false);
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
  // Alemán: coma decimal y punto de miles
  check('de 60→100', nb(get('de', null, '60', '100').lines.map((x) => x[1]).join('|')), '40,00|40,00 %|66,67 %|40,00');
  check('de miles con punto', nb(get('de', null, '1.250,50', '2.000').lines[0][1]), '749,50');
  check('de con euro elegido', nb(get('de', 'EUR', '60', '100').lines[0][1]), '40,00 €');
  check('de acepta apóstrofo suizo', nb(get('de', 'CHF', '1’250,50', '2’000').lines[0][1]), '749,50 CHF');
  // Francés: coma decimal y espacio (fino o de no ruptura) como separador de miles
  check('fr 60→100', nb(get('fr', null, '60', '100').lines.map((x) => x[1]).join('|')), '40,00|40,00 %|66,67 %|40,00');
  check('fr miles con espacio normal', nb(get('fr', null, '1 250,50', '2 000').lines[0][1]), '749,50');
  check('fr miles con espacio fino insécable (copiado de un resultado)', nb(get('fr', null, '1\u202f250,50', '2\u00a0000').lines[0][1]), '749,50');
  check('fr importe grande con separador de miles', nb(get('fr', 'EUR', '1 000 000', '2 000 000').lines[0][1]), '1 000 000,00 €');
  // Hindi: punto decimal, agrupación india, rupias y dígitos devanagari
  check('hi 60→100', nb(get('hi', 'INR', '60', '100').lines.map((x) => x[1]).join('|')), '₹40.00|40.00%|66.67%|₹40.00');
  check('hi agrupación india en la lectura (12,50,000)', nb(get('hi', 'INR', '12,50,000', '20,00,000').lines[0][1]), '₹7,50,000.00');
  check('hi agrupación occidental también se acepta', nb(get('hi', 'INR', '1,250,000', '2,000,000').lines[0][1]), '₹7,50,000.00');
  check('hi dígitos devanagari', nb(get('hi', 'INR', '६०', '१००').lines[0][1]), '₹40.00');
  check('hi formato indio de salida', nb(get('hi', 'INR', '10000000', '12345678.5').lines[0][1]), '₹23,45,678.50');
  check('hi sin moneda: sin símbolo', nb(get('hi', null, '60', '100').lines[0][1]), '40.00');
}
{
  // Impuesto genérico: el mismo cálculo matemático en los tres idiomas, con el tipo que escribe la persona
  const iva = (l, cur) => createCalculator(REAL_WORLD.content[l], cur).compute('iva', 0, { base: ['en', 'hi'].includes(l) ? '1000.00' : '1000,00', vat: '15' });
  check('base 1000 + 15 % = 1150 (los seis idiomas)', LANGS.map((l) => iva(l, CURRENCY[l] ?? null).data.total).join(), '1150,1150,1150,1150,1150,1150');
  const sin = createCalculator(REAL_WORLD.content.en, null).compute('iva', 1, { total: '1,150', vat: '15' });
  check('quitar un 15 % a 1150 deja 1000', sin.data.base, 1000);
}
for (const l of TRANSLATED) {
  const d = REAL_WORLD.content[l].tools;
  check(`${l}: tipo de ejemplo genérico (no el 21 % español)`, JSON.stringify([d.precio.defaults, d.iva.defaults]), '[{"vat":10},{"vat":10,"vat1":10,"vat2":10,"vat3":5}]');
  const calc = createCalculator(REAL_WORLD.content[l], null);
  check(`${l}: el campo de impuesto arranca en 10`, calc.defaults('precio', 0).vat.replace(',', '.'), '10');
  check(`${l}: el aviso de versión genérica existe y no cita tipos ni autoridades de ningún país`, /\b(19|20|21|5,5|18|28|12)\s?%|Finanzamt|DGFiP|GSTN|Agencia Tributaria/i.test(REAL_WORLD.content[l].ui.tool.genericTax), false);
}
check('es conserva su 21 %', createCalculator(REAL_WORLD.content.es, 'EUR').defaults('precio', 0).vat, '21');

console.log(fails ? `${fails} de ${total} comprobaciones de idiomas FALLAN` : `OK · ${total} comprobaciones de idiomas superadas`);
process.exit(fails ? 1 : 0);
