// Pruebas de la Fase 4: las cuatro calculadoras nuevas (recargo, descuento, equilibrio, ROI).
// Fórmulas puras (src/domain), validación de entrada en los seis idiomas y presentación sin NaN/Infinity/«undefined».
import { calculate, MODEL_LIMITS } from '../src/domain/formulas.js';
import { parseDecimal, decimalSeparator, usesIndianGrouping } from '../src/i18n/numbers.js';
import { createCalculator } from '../src/lib/present.js';
import es from '../src/locales/es/index.js';
import en from '../src/locales/en/index.js';
import ptBr from '../src/locales/pt-br/index.js';
import de from '../src/locales/de/index.js';
import fr from '../src/locales/fr/index.js';
import hi from '../src/locales/hi/index.js';

let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  const g = typeof got === 'string' ? got : JSON.stringify(got);
  const w = typeof want === 'string' ? want : JSON.stringify(want);
  if (g !== w) { fails++; console.error(`✗ ${name}\n   obtenido: ${g}\n   esperado: ${w}`); }
}
const near = (name, got, want, eps = 1e-9) => { total++; if (!(Math.abs(got - want) <= eps)) { fails++; console.error(`✗ ${name}\n   obtenido: ${got}\n   esperado: ${want}`); } };

// Entrada «como la escribe la persona» con coma decimal (español); los valores se pasan como cadenas.
const ctx = { parse: (s) => parseDecimal(String(s), ','), exponent: 2 };
const calc = (tool, raw) => calculate(tool, 0, Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v).replace('.', ',')])), ctx);
const ok = (tool, raw) => { const r = calc(tool, raw); if (!r.ok) throw new Error(`${tool}: ${r.code}`); return r.data; };
const err = (tool, raw) => { const r = calc(tool, raw); return r.ok ? "ok" : r.code; };

// ---------------------------------------------------------------- RECARGO
{
  const d = ok('recargo', { cost: 100, markup: 25 });
  check('recargo control: precio 125', d.price, 125);
  check('recargo control: beneficio 25', d.benefit, 25);
  near('recargo control: margen 20 %', d.margin, 20);
  near('recargo: precio si fuera margen (133,33)', d.priceIfMargin, 133.3333333333333, 1e-9);
  const t = ok('recargo', { cost: 60, markup: 40 });
  near('recargo 60 al 40 %: precio 84', t.price, 84);
  near('recargo 60 al 40 %: margen 28,57', t.margin, 28.571428571, 1e-6);
  const dec = ok('recargo', { cost: '12,40', markup: 35 });
  near('recargo decimales: 16,74', dec.price, 16.74, 1e-9);
  near('recargo decimales: margen 25,93', dec.margin, 25.9259, 1e-3);
  // tabla de equivalencias recargo -> margen
  for (const [m, g] of [[10, 9.0909], [20, 16.6667], [25, 20], [30, 23.0769], [50, 33.3333], [100, 50]]) near(`equivalencia ${m} %`, ok('recargo', { cost: 100, markup: m }).margin, g, 1e-3);
  // recargo 0, coste 0, recargo > 100 %
  const z = ok('recargo', { cost: 100, markup: 0 });
  check('recargo 0 %: precio = coste', z.price, 100); near('recargo 0 %: margen 0', z.margin, 0);
  const c0 = ok('recargo', { cost: 0, markup: 25 });
  check('coste 0: precio 0', c0.price, 0); check('coste 0: sin margen (nulo, no NaN)', c0.margin, null);
  const big = ok('recargo', { cost: 100, markup: 150 });
  check('recargo 150 %: precio 250', big.price, 250); near('recargo 150 %: margen 60', big.margin, 60);
  check('recargo 100 %: no hay «precio si fuera margen»', ok('recargo', { cost: 100, markup: 100 }).priceIfMargin, null);
  check('recargo 100 % -> margen 50 %', ok('recargo', { cost: 100, markup: 100 }).margin, 50);
  // errores
  check('recargo negativo', err('recargo', { cost: 100, markup: -5 }), 'negative');
  check('coste negativo', err('recargo', { cost: -1, markup: 5 }), 'negative');
  check('recargo texto', err('recargo', { cost: 'abc', markup: 5 }), 'invalid-number');
  check('recargo vacío', err('recargo', { cost: '', markup: 5 }), 'invalid-number');
  check('recargo desorbitado', err('recargo', { cost: 100, markup: 1e7 }), 'out-of-range');
  check('coste desorbitado', err('recargo', { cost: 1e13, markup: 5 }), 'out-of-range');
  check('recargo en el límite (10^6 %)', err('recargo', { cost: 100, markup: 1e6 }), 'ok');
}

// ---------------------------------------------------------------- DESCUENTO
{
  const d = ok('descuento', { price: 100, first: 20, second: 10 });
  check('descuento control: final 72', d.final, 72);
  check('descuento control: ahorro 28', d.saving, 28);
  check('descuento control: efectivo 28 %', d.effective, 28);
  check('descuento: la suma (errónea) daría 70', d.priceIfSummed, 70);
  check('descuento: 1.º 20 y 2.º 8', [d.firstSaving, d.secondSaving], [20, 8]);
  const e = ok('descuento', { price: 80, first: 15, second: 5 });
  near('descuento 80/15/5: final 64,60', e.final, 64.6); near('descuento: ahorro 15,40', e.saving, 15.4); near('descuento: efectivo 19,25', e.effective, 19.25);
  for (const [a, b, eff] of [[10, 10, 19], [20, 10, 28], [30, 20, 44], [50, 20, 60], [50, 50, 75]]) check(`efectivo ${a}+${b}`, ok('descuento', { price: 100, first: a, second: b }).effective, eff);
  // el orden no cambia el resultado
  check('el orden de los descuentos no importa', ok('descuento', { price: 250, first: 10, second: 20 }).final, ok('descuento', { price: 250, first: 20, second: 10 }).final);
  // segundo descuento vacío o 0 -> solo el primero
  const solo = ok('descuento', { price: 100, first: 20, second: '' });
  check('segundo vacío: final 80', solo.final, 80); check('segundo vacío: efectivo 20', solo.effective, 20); check('segundo vacío: hasSecond false', solo.hasSecond, false);
  check('segundo 0 = segundo vacío', ok('descuento', { price: 100, first: 20, second: 0 }).final, 80);
  check('descuento 0 %', ok('descuento', { price: 100, first: 0, second: 0 }).final, 100);
  check('descuento 100 %', ok('descuento', { price: 100, first: 100, second: 0 }).final, 0);
  check('100 % + 100 %', ok('descuento', { price: 100, first: 100, second: 100 }).effective, 100);
  check('50 % + 50 % -> paga el 25 %', ok('descuento', { price: 100, first: 50, second: 50 }).final, 25);
  check('suma >= 100: sin «precio si se sumara»', ok('descuento', { price: 100, first: 60, second: 50 }).priceIfSummed, null);
  check('precio 0', ok('descuento', { price: 0, first: 20, second: 10 }).final, 0);
  near('decimales: 19,99 con 12,5 %', ok('descuento', { price: '19,99', first: '12,5', second: 0 }).final, 17.49125, 1e-9);
  near('ruido de coma flotante: 0,3 y 0,1', ok('descuento', { price: 100, first: '33,3', second: '10,1' }).effective, 100 - 66.7 * 89.9 / 100, 1e-9);
  // errores
  check('descuento > 100 %', err('descuento', { price: 100, first: 101, second: 0 }), 'percent-over-100');
  check('segundo descuento > 100 %', err('descuento', { price: 100, first: 10, second: 100.5 }), 'percent-over-100');
  check('descuento negativo', err('descuento', { price: 100, first: -10, second: 0 }), 'negative');
  check('precio negativo', err('descuento', { price: -100, first: 10, second: 0 }), 'negative');
  check('descuento texto', err('descuento', { price: 100, first: 'diez', second: 0 }), 'invalid-number');
  check('segundo descuento texto (no vacío)', err('descuento', { price: 100, first: 10, second: 'x' }), 'invalid-number');
  check('precio desorbitado', err('descuento', { price: 1e13, first: 10, second: 0 }), 'out-of-range');
}

// ---------------------------------------------------------------- PUNTO DE EQUILIBRIO
{
  const d = ok('equilibrio', { fixed: 2000, price: 50, variable: 30, units: '' });
  check('equilibrio control: margen unitario 20', d.unitMargin, 20);
  check('equilibrio control: 100 unidades', d.units, 100);
  check('equilibrio control: facturación 5000', d.revenue, 5000);
  check('equilibrio control: estado ok', d.status, 'ok');
  check('equilibrio: ratio de contribución 40 %', d.contributionRatio, 40);
  check('equilibrio sin unidades esperadas: nulo', d.expected, null);
  const e = ok('equilibrio', { fixed: 2000, price: 50, variable: 30, units: 150 });
  check('esperado 150: resultado +1000', e.expected.profit, 1000); check('esperado 150: ingresos 7500', e.expected.revenue, 7500);
  check('esperado 50: pérdida -1000', ok('equilibrio', { fixed: 2000, price: 50, variable: 30, units: 50 }).expected.profit, -1000);
  check('esperado 100: exactamente 0', ok('equilibrio', { fixed: 2000, price: 50, variable: 30, units: 100 }).expected.profit, 0);
  check('unidades esperadas = 0 se calcula (no es vacío)', ok('equilibrio', { fixed: 2000, price: 50, variable: 30, units: 0 }).expected.profit, -2000);
  // redondeo hacia arriba
  const r = ok('equilibrio', { fixed: 3500, price: '12,5', variable: '4,5', units: '' });
  check('3500/12,5/4,5: 437,5 sin redondear', r.exactUnits, 437.5); check('…se redondea a 438', r.units, 438); check('…facturación 5475', r.revenue, 5475);
  check('con 437 unidades aún hay pérdida', ok('equilibrio', { fixed: 3500, price: '12,5', variable: '4,5', units: 437 }).expected.profit < 0, true);
  check('con 438 unidades hay beneficio', ok('equilibrio', { fixed: 3500, price: '12,5', variable: '4,5', units: 438 }).expected.profit >= 0, true);
  // ruido de coma flotante: 0,3 / 0,1 es 3 y no 3,0000000000000004 -> no debe subir a 4
  check('0,3 / 0,1 = 3 unidades (sin ruido)', ok('equilibrio', { fixed: '0,3', price: '0,5', variable: '0,4', units: '' }).units, 3);
  check('panadería 1800/24/9: 120 uds', ok('equilibrio', { fixed: 1800, price: 24, variable: 9, units: '' }).units, 120);
  check('panadería con precio 27: 100 uds', ok('equilibrio', { fixed: 1800, price: 27, variable: 9, units: '' }).units, 100);
  check('panadería 100 uds: -300', ok('equilibrio', { fixed: 1800, price: 24, variable: 9, units: 100 }).expected.profit, -300);
  // fijos = 0
  const f0 = ok('equilibrio', { fixed: 0, price: 50, variable: 30, units: '' });
  check('fijos 0: estado no-fixed', f0.status, 'no-fixed'); check('fijos 0: 0 unidades', f0.units, 0); check('fijos 0: sin NaN', JSON.stringify(f0).includes('null') && !/NaN|Infinity/.test(JSON.stringify(f0)), true);
  // precio <= coste variable
  for (const [p, v] of [[30, 30], [20, 30], [0, 0], [0, 5]]) {
    const n = ok('equilibrio', { fixed: 2000, price: p, variable: v, units: '' });
    check(`precio ${p} / variable ${v}: sin equilibrio`, [n.status, n.units, n.revenue], ['no-margin', null, null]);
  }
  check('sin margen y con unidades esperadas: pierde los fijos y más', ok('equilibrio', { fixed: 1000, price: 10, variable: 15, units: 10 }).expected.profit, -1050);
  check('fijos y variable 0, precio > 0', ok('equilibrio', { fixed: 100, price: 10, variable: 0, units: '' }).units, 10);
  // extremos
  check('fijos enormes pero dentro del límite', err('equilibrio', { fixed: 1e12, price: 50, variable: 30, units: '' }), 'ok');
  check('unidades que superan el límite del modelo', err('equilibrio', { fixed: 1e12, price: '0,0000001', variable: 0, units: '' }), 'out-of-range');
  check('fijos fuera del límite', err('equilibrio', { fixed: 1e13, price: 50, variable: 30, units: '' }), 'out-of-range');
  // errores
  check('fijos negativos', err('equilibrio', { fixed: -1, price: 50, variable: 30, units: '' }), 'negative');
  check('precio texto', err('equilibrio', { fixed: 10, price: 'x', variable: 30, units: '' }), 'invalid-number');
  check('unidades texto', err('equilibrio', { fixed: 10, price: 50, variable: 30, units: 'muchas' }), 'invalid-number');
  check('unidades negativas', err('equilibrio', { fixed: 10, price: 50, variable: 30, units: -3 }), 'negative');
  check('campo obligatorio vacío', err('equilibrio', { fixed: '', price: 50, variable: 30, units: '' }), 'invalid-number');
}

// ---------------------------------------------------------------- ROI
{
  const d = ok('roi', { investment: 1000, total: 1300 });
  check('ROI control: beneficio 300', d.net, 300); check('ROI control: 30 %', d.roi, 30); check('ROI control: veredicto gain', d.verdict, 'gain'); near('ROI múltiplo 1,3', d.multiple, 1.3);
  for (const [i, t, net, roi, v] of [[800, 2000, 1200, 150, 'gain'], [2500, 2500, 0, 0, 'even'], [5000, 4000, -1000, -20, 'loss'], [1000, 0, -1000, -100, 'total-loss'], [4500, 6300, 1800, 40, 'gain']]) {
    const x = ok('roi', { investment: i, total: t });
    check(`ROI ${i}->${t}: neto`, x.net, net); near(`ROI ${i}->${t}: %`, x.roi, roi); check(`ROI ${i}->${t}: veredicto`, x.verdict, v);
  }
  check('error típico: 300 en vez de 1300 -> -70 %', Math.round(ok('roi', { investment: 1000, total: 300 }).roi), -70);
  near('ROI con decimales', ok('roi', { investment: '1234,56', total: '1500,10' }).roi, ((1500.10 - 1234.56) / 1234.56) * 100, 1e-9);
  check('ROI sin ruido: 0,3 - 0,1', ok('roi', { investment: '0,1', total: '0,3' }).net, 0.2);
  near('ROI muy grande pero dentro del límite', ok('roi', { investment: 1, total: 1e12 }).roi, (1e12 - 1) * 100, 1);
  check('ROI por encima del límite de resultados: aviso, no cifra', err('roi', { investment: '0,01', total: 1e12 }), 'out-of-range');
  // inversión cero
  check('inversión 0', err('roi', { investment: 0, total: 100 }), 'investment-positive');
  check('inversión 0 y retorno 0', err('roi', { investment: 0, total: 0 }), 'investment-positive');
  check('inversión negativa', err('roi', { investment: -5, total: 100 }), 'negative');
  check('retorno negativo', err('roi', { investment: 100, total: -5 }), 'negative');
  check('inversión texto', err('roi', { investment: 'mil', total: 100 }), 'invalid-number');
  check('inversión vacía', err('roi', { investment: '', total: 100 }), 'invalid-number');
  check('retorno fuera del límite', err('roi', { investment: 100, total: 1e13 }), 'out-of-range');
  check('inversión fuera del límite', err('roi', { investment: 1e13, total: 1 }), 'out-of-range');
}

// ---------------------------------------------------------------- ENTRADA NUMÉRICA EN LOS SEIS IDIOMAS
{
  const cases = [
    ['es', '1.234,5', 1234.5], ['es', '0,3', 0.3], ['en', '1,234.5', 1234.5], ['en', '0.3', 0.3],
    ['pt-br', '1.234,5', 1234.5], ['de', '1.234,5', 1234.5], ['fr', '1 234,5', 1234.5], ['fr', '1 234,5', 1234.5],
    ['hi', '1,23,456.5', 123456.5], ['hi', '१२३.५', 123.5], ['hi', '१,२३,४५६.५', 123456.5], ['hi', '2,000', 2000],
  ];
  for (const [loc, s, want] of cases) {
    const v = parseDecimal(s, decimalSeparator(loc), { indian: usesIndianGrouping(loc) });
    check(`parse ${loc} «${s}»`, v, want);
  }
  for (const loc of ['es', 'en', 'pt-br', 'de', 'fr', 'hi']) {
    for (const bad of ['abc', '', '1e5x', '12,34,56,7a', '--5']) {
      const v = parseDecimal(bad, decimalSeparator(loc), { indian: usesIndianGrouping(loc) });
      check(`parse ${loc} «${bad}» no es un número válido`, Number.isFinite(v), false);
    }
  }
}

// ---------------------------------------------------------------- PRESENTACIÓN EN LOS SEIS IDIOMAS
{
  const L = { es, en, 'pt-br': ptBr, de, fr, hi };
  const curr = { es: 'EUR', en: 'USD', 'pt-br': 'BRL', de: 'EUR', fr: 'EUR', hi: 'INR' };
  const bad = /NaN|Infinity|undefined|\[object|\{[a-z]+\}/;
  const tools = ['recargo', 'descuento', 'equilibrio', 'roi'];
  for (const [code, content] of Object.entries(L)) {
    const c = createCalculator(content, curr[code]);
    for (const tool of tools) {
      const base = c.defaults(tool, 0);
      const variants = [base];
      if (tool === 'equilibrio') variants.push({ ...base, units: '' }, { ...base, price: base.variable }, { ...base, fixed: '0' }, { ...base, units: '10' }, { ...base, units: '1' });
      if (tool === 'descuento') variants.push({ ...base, second: '' }, { ...base, second: '0' }, { ...base, first: '100', second: '100' });
      if (tool === 'roi') variants.push({ ...base, total: '0' }, { ...base, total: base.investment }, { ...base, total: '1' });
      if (tool === 'recargo') variants.push({ ...base, cost: '0' }, { ...base, markup: '0' }, { ...base, markup: '100' }, { ...base, markup: '500' });
      for (const [i, raw] of variants.entries()) {
        const r = c.compute(tool, 0, raw);
        if (!r.ok) { check(`${code}/${tool}#${i}: error legible`, typeof r.error === 'string' && r.error.length > 3 && !bad.test(r.error), true); continue; }
        const text = [r.label, r.main, r.note, r.assumption, ...r.lines.flat(), ...r.bar.flatMap((b) => [b.label, b.text])].join(' | ');
        check(`${code}/${tool}#${i}: sin NaN/Infinity/undefined/marcadores`, bad.test(text), false);
        check(`${code}/${tool}#${i}: resultado principal visible`, r.main.length > 0, true);
      }
      for (const bad2 of [{ ...base, [Object.keys(base)[0]]: 'abc' }, { ...base, [Object.keys(base)[1]]: '-5' }]) {
        const r = c.compute(tool, 0, bad2);
        check(`${code}/${tool}: entrada inválida da error y no cifras`, r.ok === false && !bad.test(r.error), true);
      }
    }
  }
  // Ejemplos de control localizados
  const fmt = (code, tool, raw) => createCalculator(L[code], curr[code]).compute(tool, 0, { ...createCalculator(L[code], curr[code]).defaults(tool, 0), ...raw });
  const norm = (s) => String(s).replace(/[  ]/g, ' ');
  check('es descuento 100/20/10', norm(fmt('es', 'descuento', { price: '100', first: '20', second: '10' }).main), '72,00 €');
  check('en descuento', norm(fmt('en', 'descuento', { price: '100', first: '20', second: '10' }).main), '$72.00');
  check('de descuento', norm(fmt('de', 'descuento', { price: '100', first: '20', second: '10' }).main), '72,00 €');
  check('hi roi principal con %', /30/.test(fmt('hi', 'roi', { investment: '1,000', total: '1,300' }).main), true);
  check('hi: dígitos devanagari aceptados', fmt('hi', 'roi', { investment: '१०००', total: '१३००' }).ok, true);
  check('hi: agrupación india en 1,00,000', norm(fmt('hi', 'recargo', { cost: '1,00,000', markup: '25' }).main).includes('1,25,000'), true);
  check('hi: devanagari y latín dan lo mismo', fmt('hi', 'roi', { investment: '१०००', total: '१३००' }).main, fmt('hi', 'roi', { investment: '1000', total: '1300' }).main);
}

if (fails) { console.error(`\n${fails} de ${total} comprobaciones de la Fase 4 FALLAN`); process.exit(1); }
console.log(`OK · ${total} comprobaciones de la Fase 4 superadas (fórmulas, límites, entrada en 6 idiomas, presentación)`);
