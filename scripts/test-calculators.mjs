// Pruebas de las fórmulas con los ejemplos resueltos de las explicaciones editoriales.
import { createCalculator } from '../src/lib/present.js';
import { parseDecimal } from '../src/i18n/numbers.js';
import es from '../src/locales/es/index.js';

const calc = createCalculator(es, 'EUR');
const compute = (tool, mode, raw) => calc.compute(tool, mode, raw);
const defaultsFor = (tool, mode) => calc.defaults(tool, mode);

const norm = (s) => String(s).replace(/[\u00a0\u202f]/g, ' ');
let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  if (norm(got) !== want) { fails++; console.error(`✗ ${name}\n   obtenido: ${norm(got)}\n   esperado: ${want}`); }
}
const run = (tool, mode, over = {}) => {
  const base = defaultsFor(tool, mode);
  const r = compute(tool, mode, { ...base, ...Object.fromEntries(Object.entries(over).map(([k, v]) => [k, String(v).replace('.', ',')])) });
  if (!r.ok) throw new Error(`${tool}/${mode}: ${r.error}`);
  return r;
};
const line = (r, k) => r.lines.find((l) => l[0] === k)?.[1];

// Margen comercial
let r = run('margen', 0);
check('margen 60/100 principal', r.main, '40,00 %');
check('margen beneficio', line(r, 'Beneficio por unidad'), '40,00 €');
check('margen recargo', line(r, 'Recargo sobre coste'), '66,67 %');
r = run('margen', 0, { quantity: 120 });
check('margen 120 uds', line(r, 'Beneficio total (120 unidades)'), '4.800,00 €');
r = run('margen', 1);
check('margen precio desde 25 %', r.main, '106,67 €');
check('margen beneficio 26,67', line(r, 'Beneficio por unidad'), '26,67 €');
r = run('margen', 2);
check('coste máximo 150/30 %', r.main, '105,00 €');
r = run('margen', 0, { cost: 60, price: 90 });
check('margen con descuento 10 %', r.main, '33,33 %');

// Precio de venta
r = run('precio', 0);
check('precio ej.1 PVP', r.main, '74,46 €');
check('precio ej.1 sin IVA', r.note, 'Precio antes de IVA: 61,54 €');
check('precio ej.1 beneficio', line(r, 'Beneficio unitario'), '21,54 €');
check('precio ej.1 IVA', line(r, 'IVA'), '12,92 €');
r = run('precio', 1);
check('precio ej.2 PVP', r.main, '50,82 €');
check('precio ej.2 margen real', line(r, 'Margen real'), '33,33 %');
r = run('precio', 0, { cost: 30, extra: 2, margin: 20, commission: 15, discount: 10 });
check('precio ej.3 PVP', r.main, '59,57 €');
check('precio ej.3 comisión', line(r, 'Comisión'), '7,38 €');
check('precio ej.3 beneficio', line(r, 'Beneficio unitario'), '9,85 €');
check('precio ej.3 lista sin IVA', line(r, 'Precio de lista previo a descuento (sin IVA)'), '54,70 €');
check('precio ej.3 lista con IVA', line(r, 'PVP de lista con IVA'), '66,19 €');
r = run('precio', 2);
check('precio analizar margen real', line(r, 'Margen real'), '20,00 %');
r = run('precio', 2, { given: 59.57, included: 'Sí' });
check('precio analizar con IVA incluido', line(r, 'Margen real'), '20,00 %');
r = run('precio', 2, { given: 45, included: 'No' });
check('precio analizar 45 €', line(r, 'Margen real'), '13,89 %');
check('precio imposible', compute('precio', 0, { ...defaultsFor('precio', 0), margin: '85', commission: '15' }).error, 'Margen y comisión suman el 100 % o más: precio imposible.');

// Rentabilidad
r = run('rentabilidad', 0);
check('rentab ej.1 neto', r.main, '14.000,00 €');
check('rentab ej.1 margen neto', line(r, 'Margen neto'), '14,00 %');
r = run('rentabilidad', 0, { sales: 260000, returns: 10000, cogs: 150000, operating: 70000, finance: 5000, tax: 6250 });
check('rentab ej.3 neto', r.main, '18.750,00 €');
check('rentab ej.3 margen neto', line(r, 'Margen neto'), '7,50 %');
check('rentab ej.3 bruto', line(r, 'Beneficio bruto'), '100.000,00 € · 40,00 %');
r = run('rentabilidad', 0, { sales: 48000, cogs: 18000, operating: 20000, finance: 0 });
check('rentab ej.2 operativo', line(r, 'Resultado operativo'), '10.000,00 € · 20,83 %');
r = run('rentabilidad', 0, { sales: 20000, cogs: 12000, operating: 10000, finance: 0 });
check('rentab pérdida', line(r, 'Resultado operativo'), '-2.000,00 € · -10,00 %');
check('rentab devoluciones > ventas', compute('rentabilidad', 0, { ...defaultsFor('rentabilidad', 0), returns: '999999' }).error, 'Las devoluciones no pueden superar las ventas.');

// Base imponible / IVA
r = run('iva', 0);
check('iva añadir total', r.main, '1.512,50 €');
check('iva añadir cuota', line(r, 'IVA'), '262,50 €');
r = run('iva', 1);
check('iva quitar base', line(r, 'Base imponible'), '500,00 €');
check('iva quitar cuota', line(r, 'IVA'), '105,00 €');
r = run('iva', 1, { total: 100 });
check('iva redondeo base', line(r, 'Base imponible'), '82,64 €');
check('iva redondeo cuota', line(r, 'IVA'), '17,36 €');
r = run('iva', 2);
check('iva líneas total', r.main, '1.048,74 €');
check('iva líneas base', line(r, 'Base imponible'), '876,00 €');
check('iva líneas cuota', line(r, 'IVA'), '172,74 €');
check('iva base 21 %', line(r, 'Base al 21 %'), '774,00 €');
check('iva cuota 21 %', line(r, 'IVA al 21 %'), '162,54 €');
check('iva cuota 10 %', line(r, 'IVA al 10 %'), '10,20 €');

// Validación y parseo
check('negativo', compute('iva', 0, { base: '-5', vat: '21' }).error, 'Los importes y porcentajes no pueden ser negativos.');
check('texto', compute('iva', 0, { base: 'abc', vat: '21' }).error, 'Introduce un número válido en todos los campos.');
check('porcentaje > 100', compute('iva', 0, { base: '5', vat: '150' }).error, 'Revisa los porcentajes: no pueden superar el 100 %.');
check('calcular con campo vacío', compute('iva', 0, { base: '', vat: '21' }).error, 'Introduce un número válido en todos los campos.');

// ---------------------------------------------------------------------------
// parseDecimal: separadores decimales y de miles (formato español)
// ---------------------------------------------------------------------------
const P = (s) => parseDecimal(s);
const parseCases = [
  // entrada, esperado (número) o 'NaN'
  ['8,5', 8.5], ['1,25', 1.25], ['1,250', 1.25], ['0,5', 0.5], ['0,125', 0.125],
  ['1.5', 1.5], ['12.50', 12.5], ['4.0', 4], ['21', 21], ['007', 7],
  // un punto con exactamente tres cifras: miles solo si la parte entera es 1-3 cifras sin cero inicial
  ['1.250', 1250], ['12.345', 12345], ['999.999', 999999], ['21.000', 21000],
  // ERROR REPRODUCIDO: antes 0.125 -> 125 y 0.500 -> 500
  ['0.125', 0.125], ['0.500', 0.5], ['00.500', 0.5], ['0.001', 0.001],
  ['1234.567', 1234.567], ['1234.500', 1234.5],            // parte entera > 3 cifras: nunca son miles
  // miles + decimal, en ambos órdenes
  ['1.250,50', 1250.5], ['1,250.50', 1250.5], ['1.234.567,89', 1234567.89], ['1,234,567.89', 1234567.89],
  ['0,50', 0.5], ['100.000,5', 100000.5],
  // varios separadores iguales: solo miles bien formados
  ['1.250.000', 1250000], ['1,250,000', 1250000],
  // espacios, símbolos y signo
  [' 1 250 ', 1250], ['1.250 €', 1250], ['21 %', 21], [' 1.250,50 €', 1250.5], ['+5', 5], ['-5', -5],
  // escritura en curso
  [',5', 0.5], ['.5', 0.5], ['5,', 5], ['5.', 5],
  // inválidos
  ['', 'NaN'], ['   ', 'NaN'], ['abc', 'NaN'], ['1e3', 'NaN'], ['1..2', 'NaN'], ['1.2.3', 'NaN'], ['1,2,3', 'NaN'],
  ['.', 'NaN'], [',', 'NaN'], ['-', 'NaN'], ['1.25.000,5', 'NaN'], ['0.500.000', 'NaN'], ['1.250,5,5', 'NaN'],
  ['1,250.50,3', 'NaN'], ['0.500,5', 'NaN'], ['1.2500.000', 'NaN'], ['12a', 'NaN'], ['1 2 a', 'NaN'], ['--5', 'NaN'],
];
for (const [input, want] of parseCases) {
  const got = P(input);
  check(`parse ${JSON.stringify(input)}`, Number.isNaN(got) ? 'NaN' : String(got), want === 'NaN' ? 'NaN' : String(want));
}
check('parse null', String(Number.isNaN(P(null))), 'true');
check('parse undefined', String(Number.isNaN(P(undefined))), 'true');
check('parse -0 no devuelve -0', String(Object.is(P('-0'), -0)), 'false');

// Efecto en las calculadoras: un porcentaje con decimales no se convierte en miles
check('iva 0.5 % no se multiplica', compute('iva', 0, { base: '1000', vat: '0.500' }).note, 'Cuota IVA: 5,00 €');
check('iva 4.000 -> error de porcentaje', compute('iva', 0, { base: '100', vat: '4.000' }).error, 'Revisa los porcentajes: no pueden superar el 100 %.');

// ---------------------------------------------------------------------------
// IVA: base + cuota = total mostrado (céntimos), en los tres modos
// ---------------------------------------------------------------------------
const toCents = (txt) => {
  const m = String(txt).replace(/[\u00a0\u202f]/g, ' ').match(/(-?[\d.]+,\d{2}) €/);
  if (!m) throw new Error('importe no reconocido: ' + txt);
  return Math.round(Number(m[1].replace(/\./g, '').replace(',', '.')) * 100);
};
const fmtIn = (c) => (c / 100).toFixed(2).replace('.', ',');
const ivaOut = (r) => ({ base: toCents(line(r, 'Base imponible')), iva: toCents(line(r, 'IVA')), total: toCents(r.main) });

// Casos concretos que fallaban antes (total mostrado 22,38 en lugar de 22,39, etc.)
for (const [base, cuota, total] of [['18,50', '3,89 €', '22,39 €'], ['49,50', '10,40 €', '59,90 €'], ['61,50', '12,92 €', '74,42 €']]) {
  const rr = compute('iva', 0, { base, vat: '21' });
  check(`iva añadir ${base}: cuota`, line(rr, 'IVA'), cuota);
  check(`iva añadir ${base}: total`, rr.main, total);
}
// Redondeo half-up de la cuota (…5 céntimos) y de una base con más de dos decimales
check('iva cuota 2,625 -> 2,63', line(compute('iva', 0, { base: '12,50', vat: '21' }), 'IVA'), '2,63 €');
check('iva base 10,005 -> 10,01', line(compute('iva', 0, { base: '10,005', vat: '0' }), 'Base imponible'), '10,01 €');
check('iva cero', compute('iva', 0, { base: '0', vat: '21' }).main, '0,00 €');
check('iva tipo 0 %', compute('iva', 0, { base: '100', vat: '0' }).main, '100,00 €');
check('iva tipo 100 %', compute('iva', 0, { base: '100', vat: '100' }).main, '200,00 €');
check('iva quitar total 0,01', String(ivaOut(compute('iva', 1, { total: '0,01', vat: '21' })).base + ivaOut(compute('iva', 1, { total: '0,01', vat: '21' })).iva), '1');

// Barrido: ningún importe de 0,01 a 300,00 € (varios tipos) puede descuadrar
const rates = ['21', '10', '4', '5', '0', '7,5'];
let badAdd = 0, badRemove = 0, firstBad = null;
for (const vat of rates) {
  for (let c = 1; c <= 30000; c++) {
    const txt = fmtIn(c);
    const a = ivaOut(compute('iva', 0, { base: txt, vat }));
    if (a.base !== c || a.base + a.iva !== a.total) { badAdd++; firstBad ??= `añadir ${txt} @${vat}`; }
    const q = ivaOut(compute('iva', 1, { total: txt, vat }));
    if (q.total !== c || q.base + q.iva !== q.total) { badRemove++; firstBad ??= `quitar ${txt} @${vat}`; }
  }
}
check('barrido añadir IVA: descuadres', `${badAdd}${firstBad ? ' (' + firstBad + ')' : ''}`, '0');
check('barrido quitar IVA: descuadres', String(badRemove), '0');

// Importes grandes (miles y millones)
for (const txt of ['1.250,50', '99.999,99', '123.456,78', '1.234.567,89']) {
  const a = ivaOut(compute('iva', 0, { base: txt, vat: '21' }));
  const q = ivaOut(compute('iva', 1, { total: txt, vat: '21' }));
  check(`grande añadir ${txt}`, String(a.base + a.iva === a.total), 'true');
  check(`grande quitar ${txt}`, String(q.base + q.iva === q.total), 'true');
}

// Varias líneas: base total + cuota total = total; y la suma de las líneas mostradas coincide
const ml = (o) => compute('iva', 2, { ...defaultsFor('iva', 2), ...o });
let badLines = 0;
for (const unit of ['0,01', '0,333', '1,005', '8,5', '19,99', '120', '1234,56']) {
  for (const disc of ['0', '5', '12,5', '33']) {
    for (const [v1, v3] of [['21', '10'], ['4', '21'], ['10', '10']]) {
      const rr = ml({ unit1: unit, disc1: disc, vat1: v1, vat2: '21', vat3: v3, qty1: '7', qty3: '3' });
      const base = toCents(line(rr, 'Base imponible')), iva = toCents(line(rr, 'IVA'));
      const sumBases = rr.lines.filter((l) => /^Base al /.test(l[0])).reduce((t, l) => t + toCents(l[1]), 0);
      const sumCuotas = rr.lines.filter((l) => /^IVA al /.test(l[0])).reduce((t, l) => t + toCents(l[1]), 0);
      if (base + iva !== toCents(rr.main) || sumBases !== base || sumCuotas !== iva) badLines++;
    }
  }
}
check('varias líneas: descuadres', String(badLines), '0');
check('varias líneas: cantidad cero', ml({ qty1: '0' }).error, 'Las cantidades deben ser positivas.');


console.log(fails ? `\n${fails} de ${total} comprobaciones FALLAN` : `OK · ${total} comprobaciones de fórmulas superadas`);
process.exit(fails ? 1 : 0);
