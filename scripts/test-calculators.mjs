// Pruebas de las fórmulas con los ejemplos resueltos de las explicaciones editoriales.
import { compute, defaultsFor, parseDecimal } from '../src/lib/calculators.js';
import { TOOLS } from '../src/data/tools.js';

const norm = (s) => String(s).replace(/ /g, ' ');
let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  if (norm(got) !== want) { fails++; console.error(`✗ ${name}\n   obtenido: ${norm(got)}\n   esperado: ${want}`); }
}
const run = (tool, mode, over = {}) => {
  const base = defaultsFor(TOOLS[tool].fields[mode]);
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
check('precio imposible', compute('precio', 0, { ...defaultsFor(TOOLS.precio.fields[0]), margin: '85', commission: '15' }).error, 'Margen y comisión suman el 100 % o más: precio imposible.');

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
check('rentab devoluciones > ventas', compute('rentabilidad', 0, { ...defaultsFor(TOOLS.rentabilidad.fields[0]), returns: '999999' }).error, 'Las devoluciones no pueden superar las ventas.');

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
check('parse coma', String(parseDecimal('8,5')), '8.5');
check('parse miles+coma', String(parseDecimal('1.250,50')), '1250.5');
check('parse miles punto', String(parseDecimal('1.250')), '1250');
check('parse millones punto', String(parseDecimal('1.250.000')), '1250000');
check('parse decimal coma', String(parseDecimal('1,25')), '1.25');
check('rechazar campo vacío', String(Number.isNaN(parseDecimal(''))), 'true');
check('rechazar separadores inválidos', String(Number.isNaN(parseDecimal('1.2.3'))), 'true');
check('calcular con campo vacío', compute('iva', 0, { base: '', vat: '21' }).error, 'Introduce un número válido en todos los campos.');

console.log(fails ? `\n${fails} de ${total} comprobaciones FALLAN` : `OK · ${total} comprobaciones de fórmulas superadas`);
process.exit(fails ? 1 : 0);
