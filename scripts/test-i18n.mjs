// Pruebas de la arquitectura internacional: regresión frente al v0.5, lectura y formato por idioma,
// monedas, rutas/hreflang y pureza de las fórmulas. No requiere Astro.
import fs from 'node:fs';
import path from 'node:path';
import { createCalculator } from '../src/lib/present.js';
import { calculate, ERROR_CODES } from '../src/domain/formulas.js';
import { TOOL_REGISTRY } from '../src/domain/registry.js';
import { parseDecimal, makeFormatter, toMinor, currencyExponent, normalizeDigits, decimalSeparator, usesIndianGrouping } from '../src/i18n/numbers.js';
import { LOCALES, enabledLocales, DEFAULT_LOCALE } from '../src/i18n/locales.js';
import { REAL_WORLD, isPublished } from '../src/i18n/publish.js';
import { routeTable, alternatesFor, pathFor } from '../src/i18n/routes.js';
import es from '../src/locales/es/index.js';
import { validateLocale, validateWorld, untranslatedRatio, flatten } from '../src/i18n/validate.js';
import { applyPlaceholders, renderFragment, placeholdersIn } from '../src/lib/fragments.js';
import { sitemapXml } from '../src/i18n/sitemap.js';
import { headModel } from '../src/i18n/seo.js';

const root = path.resolve(import.meta.dirname, '..');
let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  if (String(got) !== String(want)) { fails++; console.error(`✗ ${name}\n   obtenido: ${got}\n   esperado: ${want}`); }
}
const nb = (s) => String(s).replace(/[  ]/g, ' ');

// ---------------------------------------------------------------------------
// 1. Regresión: la salida en español es la del v0.5 (guardada antes del refactor)
// ---------------------------------------------------------------------------
const golden = JSON.parse(fs.readFileSync(path.join(root, 'scripts/fixtures/golden-es-v0.5.json'), 'utf8'));
const calcEs = createCalculator(es, 'EUR');
const esInt = new Intl.NumberFormat('es-ES', { useGrouping: 'always', maximumFractionDigits: 6 });
// Mejoras intencionadas respecto al v0.5 (únicas diferencias admitidas):
//  · "1 unidades" -> "1 unidad" y cantidades con separador de miles / decimal español en la etiqueta.
//  · tipos de IVA con decimales en las líneas de varias líneas: "7.5 %" -> "7,5 %", y los tipos se muestran
//    siempre de menor a mayor (antes, un tipo con decimales salía al final).
const upgradeOld = (label) =>
  label
    .replace(/^Beneficio total \((\S+) unidades\)$/, (_, q) => `Beneficio total (${esInt.format(Number(q))} ${Number(q) === 1 ? 'unidad' : 'unidades'})`)
    .replace(/^(Base|IVA) al ([\d.]+) %$/, (_, w, r) => `${w} al ${r.replace('.', ',')} %`);
const sameLines = (a, b, unordered) => {
  const enc = (l) => l.map(([k, v]) => k + '=' + nb(v));
  return unordered ? enc(a).sort().join('|') === enc(b).sort().join('|') : enc(a).join('|') === enc(b).join('|');
};
let diffs = 0, firstDiff = '';
for (const c of golden.cases) {
  const now = calcEs.compute(c.tool, c.mode, c.raw);
  const old = c.out;
  const same =
    now.ok === old.ok &&
    (old.ok
      ? ['label', 'main', 'note', 'assumption'].every((k) => nb(now[k]) === nb(old[k])) &&
        now.lines.length === old.lines.length &&
        sameLines(now.lines, old.lines.map(([k, v]) => [upgradeOld(k), v]), c.tool === 'iva')
      : now.error === old.error);
  if (!same) { diffs++; firstDiff ||= JSON.stringify({ case: c.tool + '/' + c.mode, raw: c.raw, now, old }); }
}
check(`regresión v0.5: ${golden.cases.length} casos idénticos`, diffs ? `${diffs} difieren: ${firstDiff}` : 'ok', 'ok');
for (const [input, want] of golden.parse) check(`parseDecimal v0.5 ${JSON.stringify(input)}`, String(parseDecimal(input, ',')), want);

// ---------------------------------------------------------------------------
// 2. Lectura de números por idioma
// ---------------------------------------------------------------------------
const P = (s, l) => String(parseDecimal(s, decimalSeparator(l)));
// español / portugués / francés / alemán / indonesio: coma decimal
for (const l of ['es', 'pt-br', 'fr', 'de', 'id']) {
  check(`${l} "1.250" = 1250`, P('1.250', l), '1250');
  check(`${l} "1,25" = 1.25`, P('1,25', l), '1.25');
  check(`${l} "0.125" = 0.125`, P('0.125', l), '0.125');
}
// inglés / japonés / chino / hindi / árabe: punto decimal
for (const l of ['en', 'ja', 'zh', 'hi', 'ar']) {
  check(`${l} "1,250" = 1250`, P('1,250', l), '1250');
  check(`${l} "1.25" = 1.25`, P('1.25', l), '1.25');
  check(`${l} "0,125" = 0.125`, P('0,125', l), '0.125');
  check(`${l} "1,234,567.89"`, P('1,234,567.89', l), '1234567.89');
}
// Hindi: agrupación india (12,34,567.50), además de la occidental; en los demás idiomas la india NO se acepta
check('hi agrupación india "12,34,567.50"', String(parseDecimal('12,34,567.50', '.', { indian: usesIndianGrouping('hi') })), '1234567.5');
check('hi agrupación india "1,25,000"', String(parseDecimal('1,25,000', '.', { indian: true })), '125000');
check('hi "1,250,000.5" (occidental) también', String(parseDecimal('1,250,000.5', '.', { indian: true })), '1250000.5');
check('hi dígitos devanagari con agrupación india', String(parseDecimal('१२,३४,५६७', '.', { indian: true })), '1234567');
check('hi grupos mal formados "1,2,000"', String(parseDecimal('1,2,000', '.', { indian: true })), 'NaN');
check('hi grupos mal formados "12,345,67"', String(parseDecimal('12,345,67', '.', { indian: true })), 'NaN');
check('hi rupias y espacios "₹ 1,25,000.00"', String(parseDecimal('₹ 1,25,000.00', '.', { indian: true })), '125000');
check('en sigue sin aceptar la agrupación india', String(parseDecimal('1,25,000.5', '.', { indian: usesIndianGrouping('en') })), 'NaN');
check('usesIndianGrouping: hi sí; en, de, fr, es, pt-br no', ['hi', 'en', 'de', 'fr', 'es', 'pt-br'].map((l) => usesIndianGrouping(l)).join(), 'true,false,false,false,false,false');
// Francés: espacio fino insécable (U+202F) y de no ruptura (U+00A0) como separador de miles
check('fr "1 250,5" con U+202F', String(parseDecimal('1\u202f250,5', ',')), '1250.5');
check('fr "1 250,5" con U+00A0', String(parseDecimal('1\u00a0250,5', ',')), '1250.5');
// Alemán: formatos de importes
check('de importe EUR', nb(makeFormatter('de', 'EUR').money(1512.5)), '1.512,50 €');
check('de porcentaje', nb(makeFormatter('de').percent(40)), '40,00 %');
check('fr importe EUR', nb(makeFormatter('fr', 'EUR').money(1512.5)), '1 512,50 €');
check('fr porcentaje', nb(makeFormatter('fr').percent(66.67)), '66,67 %');
check('hi importe INR con agrupación india', nb(makeFormatter('hi', 'INR').money(1234567.5)), '₹12,34,567.50');
check('hi importe 1 lakh', nb(makeFormatter('hi', 'INR').money(100000)), '₹1,00,000.00');
check('hi porcentaje', makeFormatter('hi').percent(40), '40.00%');
check('hi dígitos latinos en los resultados', /^[0-9.,₹]+$/.test(makeFormatter('hi', 'INR').money(1234.5)), 'true');
check('en "1.250" = 1.25 (no miles)', P('1.250', 'en'), '1.25');
check('es "1.250" = 1250', P('1.250', 'es'), '1250');
check('fr espacio fino "1 234,5"', P('1 234,5', 'fr'), '1234.5');
check('fr espacio duro "1 234,5"', P('1 234,5', 'fr'), '1234.5');
check('de apóstrofo suizo no rompe', P("1'250", 'de'), '1250');
check('ar dígitos árabe-índicos', P('١٢٫٥', 'ar'), '12.5');
check('ar dígitos árabe-índicos con miles', P('١٬٢٥٠٫٥٠', 'ar'), '1250.5');
check('hi dígitos devanagari', P('१२.५', 'hi'), '12.5');
check('ja números de ancho completo', P('１２３．４', 'ja'), '123.4');
check('zh símbolo ¥ ignorado', P('¥1,250', 'zh'), '1250');
check('normalizeDigits mixto', normalizeDigits('٣x٤'), '3x4');
check('texto no numérico', P('abc', 'en'), 'NaN');
check('separadores mal agrupados', P('1,25,000.5', 'en'), 'NaN');

// ---------------------------------------------------------------------------
// 3. Formato por idioma (estructura estable; el glifo exacto depende de la versión de ICU)
// ---------------------------------------------------------------------------
check('es importe', nb(makeFormatter('es', 'EUR').money(1512.5)), '1.512,50 €');
check('es porcentaje', nb(makeFormatter('es', 'EUR').percent(66.666)), '66,67 %');
check('en importe EUR', nb(makeFormatter('en', 'EUR').money(1512.5)), '€1,512.50');
check('en porcentaje', makeFormatter('en').percent(40), '40.00%');
check('de importe', nb(makeFormatter('de', 'EUR').money(1512.5)), '1.512,50 €');
check('fr separador de miles', makeFormatter('fr').number(1234567.891).replace(/[  ]/g, ' '), '1 234 567,89');
check('pt-br importe BRL', nb(makeFormatter('pt-br', 'BRL').money(1512.5)), 'R$ 1.512,50');
check('hi agrupación india', makeFormatter('hi').number(1234567.89), '12,34,567.89');
check('ja JPY sin decimales', makeFormatter('ja', 'JPY').money(1500.4).replace(/[^\d]/g, ''), '1500');
check('ar usa dígitos latinos (configuración)', /^[0-9.,]+$/.test(makeFormatter('ar').number(1234.5)), 'true');
check('fecha es', makeFormatter('es').date(new Date('2026-10-22T12:00:00Z')), '22 de octubre de 2026');
check('fecha en', makeFormatter('en').date(new Date('2026-10-22T12:00:00Z')), 'October 22, 2026');

// ---------------------------------------------------------------------------
// 4. Monedas: independientes del idioma
// ---------------------------------------------------------------------------
check('en no presupone ninguna moneda', LOCALES.en.defaultCurrency, 'null');
check('ningún idioma presupone USD', Object.values(LOCALES).filter((l) => l.defaultCurrency === 'USD').length, '0');
check('en sin moneda: importes sin símbolo', makeFormatter('en', null).money(1234.5), '1,234.50');
check('exponente EUR', currencyExponent('EUR'), '2');
check('exponente JPY', currencyExponent('JPY'), '0');
check('exponente sin moneda', currencyExponent(null), '2');
check('toMinor half-up 1.005', toMinor(1.005, 2), '101');
check('toMinor JPY', toMinor(1500, 0), '1500');
const jpy = createCalculator(es, 'JPY'); // español con yenes: idioma y moneda son independientes
const rj = jpy.compute('iva', 0, { base: '1000', vat: '10' });
check('IVA en JPY (0 decimales): total', rj.main.replace(/[^\d]/g, ''), '1100');
check('IVA en JPY: cuota entera', rj.note.replace(/[^\d]/g, ''), '100');
const noCur = createCalculator(es, null);
check('sin moneda: etiquetas sin símbolo', noCur.fieldLabel('margen', 0, 'cost'), 'Coste de compra');
check('con EUR: etiquetas con símbolo', calcEs.fieldLabel('margen', 0, 'cost'), 'Coste de compra (€)');
check('porcentaje: etiqueta', calcEs.fieldLabel('margen', 1, 'margin'), 'Margen deseado (%)');

// ---------------------------------------------------------------------------
// 5. Fórmulas puras: independientes del idioma
// ---------------------------------------------------------------------------
const parseEn = (s) => parseDecimal(s, '.');
const rEn = calculate('margen', 0, { cost: '60', price: '100', quantity: '1' }, { parse: parseEn });
check('núcleo: margen 40', rEn.data.margin, '40');
check('núcleo: recargo', rEn.data.markup.toFixed(2), '66.67');
check('núcleo: devuelve códigos, no texto', calculate('iva', 0, { base: 'x', vat: '21' }, { parse: parseEn }).code, 'invalid-number');
check('núcleo: pestaña inexistente lanza error', (() => { try { calculate('margen', 9, {}, { parse: parseEn }); return 'no'; } catch { return 'lanza'; } })(), 'lanza');
check('núcleo: mismo resultado con "1,250.50" que con "1250.5"', calculate('iva', 0, { base: '1,250.50', vat: '21' }, { parse: parseEn }).data.total, calculate('iva', 0, { base: '1250.5', vat: '21' }, { parse: parseEn }).data.total);
for (const code of ERROR_CODES) check(`mensaje de error en es: ${code}`, typeof es.errors[code], 'string');
{ // pureza: ningún texto de idioma en el dominio
  const bad = [];
  for (const f of ['src/domain/formulas.js', 'src/domain/registry.js']) {
    const code = fs.readFileSync(path.join(root, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    for (const m of code.matchAll(/(['"])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) if (/[^\x00-\x7f]/.test(m[2]) && !/^[%€↗≡]$/.test(m[2])) bad.push(`${f}: ${m[2]}`);
    for (const m of code.matchAll(/(['"])((?:(?!\1)[^\\\n]|\\.)*)\1/g)) if (/\s/.test(m[2]) && !/^Calculadora/.test(m[2])) bad.push(`${f}: ${m[2]}`);
  }
  check('dominio sin texto de ningún idioma', bad.join(' | ') || 'ok', 'ok');
}
check('toda calculadora tiene texto en es', Object.keys(TOOL_REGISTRY).filter((t) => !es.tools[t]).join() || 'ok', 'ok');
for (const [id, tool] of Object.entries(TOOL_REGISTRY)) {
  tool.modes.forEach((fields, i) => {
    const labels = es.tools[id].fields[i];
    check(`${id}/${i}: etiquetas de campos`, fields.map((f) => f.key).sort().join() === Object.keys(labels).sort().join(), 'true');
  });
  check(`${id}: pestañas con nombre`, es.tools[id].modes.length, tool.modes.length);
}

// ---------------------------------------------------------------------------
// 6. Rutas: URLs españolas intactas
// ---------------------------------------------------------------------------
const SPANISH_V05 = [
  '/es/herramientas/', '/es/metodologia/', '/es/margenes-y-precios/', '/es/facturacion/',
  '/es/calculadora-margen-comercial/', '/es/calculadora-precio-de-venta/', '/es/margen-bruto-y-margen-neto/', '/es/calculadora-base-imponible/',
]; // la portada "/" pasa a redirigir a /es/ (decisión aprobada)
const table = routeTable();
for (const p of SPANISH_V05) check(`URL española conservada ${p}`, table.some((r) => r.path === p), 'true');
check('portada nueva en /es/', table.some((r) => r.key === 'home' && r.path === '/es/'), 'true');
check('idiomas publicados: es, en, pt-br, de, fr y hi', [...new Set(table.map((r) => r.locale))].join(), 'es,en,pt-br,de,fr,hi');
check('sin duplicados', new Set(table.map((r) => r.path)).size, table.length);
check('formato de URL', table.every((r) => /^\/(?:[a-z0-9-]+\/)+$/.test(r.path)), 'true');
check('hreflang recíproco real en margen', alternatesFor('tool:margen').map((a) => a.hreflang).join(), 'es,en,pt-BR,de,fr,hi,x-default');
check('idiomas habilitados', enabledLocales().map((l) => l.code).join(), 'es,en,pt-br,de,fr,hi');
check('ningún borrador publica páginas', Object.keys(LOCALES).filter((c) => LOCALES[c].status === 'draft' && table.some((r) => r.locale === c)).length, '0');

// ---------------------------------------------------------------------------
// 7. Activación progresiva con datos sintéticos (nada de esto se publica)
// ---------------------------------------------------------------------------
const mkEn = (status, extra = {}) => ({
  ...es, code: 'en',
  slugs: { tools: 'tools', methodology: 'methodology', pages: { contact: 'contact', legal: 'legal-notice', privacy: 'privacy-policy', cookies: 'cookie-policy', terms: 'terms-of-use' }, categories: { 'margenes-y-precios': 'margins-and-pricing', facturacion: 'invoicing', crecimiento: 'growth' }, toolPages: { margen: 'profit-margin-calculator', precio: 'selling-price-calculator', rentabilidad: 'gross-and-net-margin', iva: 'vat-calculator', recargo: 'markup-calculator', descuento: 'discount-calculator', equilibrio: 'break-even-calculator', roi: 'roi-calculator' } },
  review: { default: { status }, pages: extra },
});
// Mundo sintético SOLO con es + un `en` de prueba; el mercado genérico real (en, pt-br) se vacía para conservar la semántica original.
const NO_GENERIC = { ...REAL_WORLD.markets, generic: { ...REAL_WORLD.markets.generic, locales: [] } };
const world = (status, extra) => ({ ...REAL_WORLD, locales: { ...LOCALES, en: { ...LOCALES.en, status: 'enabled' }, 'pt-br': { ...LOCALES['pt-br'], status: 'draft' }, de: { ...LOCALES.de, status: 'draft' }, fr: { ...LOCALES.fr, status: 'draft' }, hi: { ...LOCALES.hi, status: 'draft' } }, content: { es, en: mkEn(status, extra) }, markets: NO_GENERIC });
const wDraft = world('draft');
check('traducción en borrador: no genera páginas', routeTable(wDraft).filter((r) => r.locale === 'en').length, '0');
check('borrador: no genera hreflang', JSON.stringify(alternatesFor('tool:margen', wDraft)), '[]');
const wLocaleDraft = { ...world('source'), locales: { ...LOCALES, en: { ...LOCALES.en, status: 'draft' } } };
check('idioma en borrador aunque el contenido exista: no publica', routeTable(wLocaleDraft).filter((r) => r.locale === 'en').length, '0');
const wEn = world('reviewed', { 'tool:margen': { status: 'draft' } });
check('página en borrador dentro de un idioma revisado no se publica', isPublished('en', 'tool:margen', wEn), 'false');
check('…y tampoco su hreflang', JSON.stringify(alternatesFor('tool:margen', wEn)), '[]');
const wOk = world('reviewed');
const tEn = routeTable(wOk).filter((r) => r.locale === 'en');
check('inglés revisado: solo universales (margen, rentabilidad, recargo, descuento, equilibrio, roi)', tEn.filter((r) => r.key.startsWith('tool:')).map((r) => r.key).join(), 'tool:margen,tool:rentabilidad,tool:recargo,tool:descuento,tool:equilibrio,tool:roi');
check('calculadoras fiscales no se traducen sin mercado', isPublished('en', 'tool:iva', wOk), 'false');
check('categoría sin calculadoras disponibles no se publica', isPublished('en', 'category:facturacion', wOk), 'false');
check('URLs traducidas', pathFor('en', 'tool:margen', wOk), '/en/profit-margin-calculator/');
check('URL española intacta con inglés activo', pathFor('es', 'tool:margen', wOk), '/es/calculadora-margen-comercial/');
{
  const alts = alternatesFor('tool:margen', wOk);
  check('hreflang margen', alts.map((a) => `${a.hreflang}=${a.path}`).join(' '), 'es=/es/calculadora-margen-comercial/ en=/en/profit-margin-calculator/ x-default=/es/calculadora-margen-comercial/');
  check('hreflang de una página solo española', JSON.stringify(alternatesFor('tool:iva', wOk)), '[]');
  // reciprocidad: toda página que aparece como alternativa devuelve a la original
  let nonRecip = 0;
  for (const r of routeTable(wOk)) {
    const mine = alternatesFor(r.key, wOk);
    for (const a of mine.filter((x) => x.hreflang !== 'x-default')) {
      const other = routeTable(wOk).find((t) => t.path === a.path);
      if (!alternatesFor(other.key, wOk).some((b) => b.path === r.path)) nonRecip++;
    }
  }
  check('hreflang recíproco', nonRecip, '0');
}

// ---------------------------------------------------------------------------
// 8. Validación de contenidos de un idioma nuevo (datos sintéticos)
// ---------------------------------------------------------------------------
const io = { readFragment: (l, kind, key) => fs.readFileSync(path.join(root, 'src/locales/es', kind, key + '.html'), 'utf8') };
const clone = (o) => JSON.parse(JSON.stringify(o));
const enBase = () => ({ ...clone(es), code: 'en', ...clone({ slugs: mkEn('source').slugs }), review: { default: { status: 'draft' } } });
const vw = (en) => ({ ...REAL_WORLD, locales: { ...LOCALES, en: { ...LOCALES.en, status: 'enabled' } }, content: { es, en } });
const probs = (en) => validateLocale('en', vw(en), io);
check('es válido', validateLocale('es', REAL_WORLD, io).join('; ') || 'ok', 'ok');
check('copia literal del español: detecta traducción sin hacer', probs(enBase()).some((p) => /idénticos|sin hacer/.test(p)), 'true');
{ const en = enBase(); delete en.messages['iva.label']; en.ui.home.metaTitle = ''; delete en.ui.footer.status;
  const p = probs(en).join('|'); check('detecta claves ausentes y vacías', /falta la clave "iva.label"/.test(p) && /falta la clave "footer.status"/.test(p) && /home.metaTitle.*vacío/.test(p), 'true'); }
{ const en = enBase(); en.messages['iva.note'] = 'VAT'; check('detecta marcadores {x} perdidos', probs(en).some((p) => /iva\.note.*marcadores/.test(p)), 'true'); }
{ const en = enBase(); delete en.errors.negative; check('detecta falta de un mensaje de error', probs(en).some((p) => /negative/.test(p)), 'true'); }
{ const en = enBase(); en.slugs.toolPages.margen = 'Margin Calc'; check('detecta slugs no válidos', probs(en).some((p) => /slug no válido/.test(p)), 'true'); }
{ const en = enBase(); en.slugs.toolPages.margen = en.slugs.toolPages.precio; check('detecta slugs repetidos', probs(en).some((p) => /repetidos/.test(p)), 'true'); }
{ const en = enBase(); en.review = { default: { status: 'reviewed' } }; check('una revisión exige revisor, fecha y alcance', probs(en).filter((p) => /una revisión exige/.test(p)).length, '3'); }
{ const en = enBase(); en.review = { default: { status: 'source' } }; check('solo el idioma de referencia puede ser "source"', probs(en).some((p) => /solo el idioma de referencia/.test(p)), 'true'); }
{ const en = enBase(); en.review = { default: { status: 'reviewed', reviewer: 'Persona X', date: '2026-01-01', scope: 'todo' } }; check('revisión completa se acepta', probs(en).filter((p) => /revisión|review/.test(p)).length, '0'); }
check('mundo: USD por defecto rechazado', validateWorld({ ...REAL_WORLD, locales: { ...LOCALES, en: { ...LOCALES.en, defaultCurrency: 'USD' } } }).some((p) => /USD/.test(p)), 'true');
check('mundo: mercado verificado sin fuentes rechazado', validateWorld({ ...REAL_WORLD, markets: { es: { ...REAL_WORLD.markets.es, verified: true } } }).some((p) => /sin fuentes/.test(p)), 'true');
check('mundo real válido', validateWorld(REAL_WORLD).join('; ') || 'ok', 'ok');
check('untranslatedRatio: iguales = 1', untranslatedRatio({ a: 'Hola mundo' }, { a: 'Hola mundo' }), '1');
check('flatten indexa arrays', Object.keys(flatten({ a: ['x', 'y'] })).join(), 'a.0,a.1');

// ---------------------------------------------------------------------------
// 9. Fragmentos, sitemap y metadatos de cabecera
// ---------------------------------------------------------------------------
const ctxF = { path: (k) => '/p/' + k, title: (kind, id) => kind + '-' + id };
check('marcadores de fragmento', applyPlaceholders('<a href="{{tool:iva}}">{{tool.title:iva}}</a>{{methodology}}', ctxF), '<a href="/p/tool:iva">tool-iva</a>/p/methodology');
check('marcador desconocido detiene el build', (() => { try { applyPlaceholders('{{nope:x}}', ctxF); return 'no'; } catch { return 'lanza'; } })(), 'lanza');
check('autolink omite la propia calculadora', renderFragment('<p>mira la calc A y la calc B</p>', ctxF, { currentToolId: 'a', autolinks: [['calc A', 'a'], ['calc B', 'b']] }), '<p>mira la calc A y la <a href="/p/tool:b">calc B</a></p>');
check('autolink omite calculadoras no disponibles', renderFragment('<p>calc B</p>', { path: () => { throw new Error('x'); } }, { autolinks: [['calc B', 'b']] }), '<p>calc B</p>');
check('h3 -> h2.sec y h4 -> h3.sub', renderFragment('<h3>A</h3><h4>B</h4>', ctxF), '<h2 class="sec">A</h2><h3 class="sub">B</h3>');
{
  const readAll = (kind, key) => fs.readFileSync(path.join(root, 'src/locales/es', kind, key + '.html'), 'utf8');
  const ctxReal = { path: (k) => pathFor('es', k), title: (kind, id) => es.tools[id]?.title ?? es.categories[id].title };
  let unresolved = 0;
  for (const [kind, key] of [['pages', 'methodology'], ['pages', 'category-facturacion'], ['pages', 'category-margenes-y-precios'], ...Object.values(TOOL_REGISTRY).map((t) => ['articles', t.article])]) {
    const out = renderFragment(readAll(kind, key), ctxReal, { autolinks: es.autolinkPhrases });
    if (placeholdersIn(out).length) unresolved++;
  }
  check('fragmentos reales sin marcadores sin resolver', unresolved, '0');
}
{
  const xml = sitemapXml('https://calculanegocio.com/');
  check('sitemap: 84 páginas de contenido', (xml.match(/<loc>/g) || []).length, 84);
  check('sitemap real: hreflang seis idiomas', ['en', 'pt-BR', 'de', 'fr', 'hi'].every((h) => xml.includes(`hreflang="${h}"`)), 'true');
  const onlyEs = { ...REAL_WORLD, locales: Object.fromEntries(Object.entries(LOCALES).map(([c, l]) => [c, c === 'es' ? l : { ...l, status: 'draft' }])) };
  check('sitemap: sin hreflang con un solo idioma', sitemapXml('https://x.test', onlyEs).includes('xhtml:link'), 'false');
  check('sitemap: no incluye "/" (redirige)', xml.includes('<loc>https://calculanegocio.com/</loc>'), 'false');
  const xml2 = sitemapXml('https://x.test', wOk);
  check('sitemap multilingüe: alternativas recíprocas', xml2.includes('hreflang="en" href="https://x.test/en/profit-margin-calculator/"') && xml2.includes('hreflang="x-default"'), 'true');
  check('sitemap multilingüe: página solo española sin alternativas', /<loc>https:\/\/x\.test\/es\/calculadora-base-imponible\/<\/loc>\s*<\/url>/.test(xml2), 'true');
}
{
  const h = headModel({ locale: 'es', key: 'tool:margen', siteUrl: 'https://calculanegocio.com', indexable: false });
  check('head: canonical', h.canonical, 'https://calculanegocio.com/es/calculadora-margen-comercial/');
  check('head: modo desarrollo = noindex', h.robots, 'noindex,follow');
  check('head: indexable', headModel({ locale: 'es', key: 'home', siteUrl: 'https://a.b', indexable: true }).robots.startsWith('index,follow'), 'true');
  check('head: lang y dir', `${h.lang}/${h.dir}`, 'es/ltr');
  const hAr = headModel({ locale: 'ar', key: null, path: '/ar/', siteUrl: 'https://a.b', indexable: false }, { ...REAL_WORLD, locales: LOCALES });
  check('head: árabe es RTL', hAr.dir, 'rtl');
  const hZh = headModel({ locale: 'zh', key: null, path: '/zh/', siteUrl: 'https://a.b', indexable: false }, { ...REAL_WORLD, locales: LOCALES });
  check('head: chino usa zh-Hans', hZh.lang, 'zh-Hans');
  const hEn = headModel({ locale: 'en', key: 'tool:margen', siteUrl: 'https://x.test', indexable: true }, wOk);
  check('head: hreflang con canonical propio', `${hEn.canonical} ${hEn.alternates.map((a) => a.hreflang).join()}`, 'https://x.test/en/profit-margin-calculator/ es,en,x-default');
}

console.log(fails ? `\n${fails} de ${total} comprobaciones de i18n FALLAN` : `OK · ${total} comprobaciones de i18n superadas`);
process.exit(fails ? 1 : 0);
