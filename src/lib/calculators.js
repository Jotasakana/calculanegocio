// Lógica de cálculo de las calculadoras. Módulo puro (sin DOM): se usa en el build
// para pintar el resultado inicial en el HTML estático y en el navegador para recalcular.
// Las fórmulas son las del prototipo aprobado, sin cambios.

const euroFmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', useGrouping: 'always' });
const pctFmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });

export const euro = (n) => euroFmt.format(n);
export const pct = (n) => pctFmt.format(n) + ' %';

/**
 * Interpreta un importe escrito en formato español (con tolerancia al formato inglés).
 *
 * Reglas:
 *  - La coma es siempre decimal: "1,250" -> 1,25.
 *  - Un único punto seguido de EXACTAMENTE tres cifras es separador de miles solo si la parte
 *    entera tiene 1-3 cifras y no empieza por 0: "1.250" -> 1250, "12.345" -> 12345.
 *    En cualquier otro caso el punto es decimal: "0.125" -> 0,125; "12.50" -> 12,5; "1.5" -> 1,5.
 *  - Con coma y punto a la vez, el último es el decimal y el otro debe agrupar de tres en tres:
 *    "1.250,50" y "1,250.50" -> 1250,5. Agrupaciones incorrectas ("1.25.000,5") -> NaN.
 *  - Varios separadores iguales solo se aceptan como miles bien formados: "1.250.000".
 *  - Se admite un separador decimal inicial o final mientras se escribe (",5", "5,").
 *  - Vacío, texto, notación científica y cualquier otro formato -> NaN.
 */
export function parseDecimal(s) {
  const raw = String(s ?? '').trim().replace(/[\s\u00a0\u202f€%]/g, '');
  if (!raw || !/^[+-]?[\d.,]+$/.test(raw)) return NaN;
  const sign = raw.startsWith('-') ? '-' : '';
  const x = raw.replace(/^[+-]/, '');
  if (!/\d/.test(x)) return NaN;

  // Grupos de miles válidos: el primero de 1-3 cifras sin cero inicial; el resto, de 3 cifras.
  const grouped = (g) => g.length >= 2 && /^[1-9]\d{0,2}$/.test(g[0]) && g.slice(1).every((v) => /^\d{3}$/.test(v));

  const hasComma = x.includes(',');
  const hasDot = x.includes('.');
  let normalized;
  if (hasComma && hasDot) {
    const decimal = x.lastIndexOf(',') > x.lastIndexOf('.') ? ',' : '.';
    const thousands = decimal === ',' ? '.' : ',';
    const pieces = x.split(decimal);
    if (pieces.length !== 2 || !/^\d*$/.test(pieces[1])) return NaN;
    const groups = pieces[0].split(thousands);
    if (!grouped(groups)) return NaN;
    normalized = groups.join('') + (pieces[1] ? '.' + pieces[1] : '');
  } else if (hasComma || hasDot) {
    const sep = hasComma ? ',' : '.';
    const parts = x.split(sep);
    if (parts.length === 2) {
      const [int, frac] = parts;
      if (sep === '.' && /^[1-9]\d{0,2}$/.test(int) && /^\d{3}$/.test(frac)) normalized = int + frac;
      else normalized = (int || '0') + (frac ? '.' + frac : '');
    } else if (grouped(parts)) normalized = parts.join('');
    else return NaN;
  } else normalized = x;

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return NaN;
  return Number(sign + normalized) + 0; // "+ 0" evita devolver -0
}

/** Céntimos enteros con redondeo "half-up" sobre la representación decimal (3.885 -> 389, 1.005 -> 101). */
function cents(x) {
  const t = String(x);
  return Math.round(t.includes('e') ? x * 100 : Number(t + 'e2'));
}
const fromCents = (c) => c / 100;

const fail = (error) => ({ ok: false, error });

/**
 * @param {'margen'|'precio'|'rentabilidad'|'iva'} tool
 * @param {number} mode índice de la pestaña activa
 * @param {Record<string,string>} raw valores tal y como los escribe el usuario
 */
export function compute(tool, mode, raw) {
  const n = {};
  for (const [k, v] of Object.entries(raw)) {
    if (k === 'included') {
      n[k] = v;
      continue;
    }
    const x = parseDecimal(v);
    if (!Number.isFinite(x)) return fail('Introduce un número válido en todos los campos.');
    n[k] = x;
  }
  for (const [k, v] of Object.entries(n)) {
    if (typeof v === 'number' && v < 0) return fail('Los importes y porcentajes no pueden ser negativos.');
    if ((k === 'vat' || k.startsWith('vat') || k === 'discount' || k.startsWith('disc') || k === 'commission' || k === 'margin') && v > 100)
      return fail('Revisa los porcentajes: no pueden superar el 100 %.');
  }

  let label = '';
  let main = '';
  let note = '';
  let lines = [];
  let assumption = 'Todos los importes comerciales se calculan sin IVA.';

  try {
    if (tool === 'margen') {
      let c = n.cost, p = n.price;
      const m = n.margin / 100, q = n.quantity;
      if (q !== undefined && q <= 0) throw 'La cantidad debe ser mayor que cero.';
      if (mode === 1) {
        if (m >= 1) throw 'El margen debe ser inferior al 100 %.';
        p = c / (1 - m);
      }
      if (mode === 2) {
        if (m >= 1) throw 'El margen debe ser inferior al 100 %.';
        c = p * (1 - m);
      }
      const benefit = p - c;
      const margin = p ? (100 * benefit) / p : null;
      const markup = c ? (100 * benefit) / c : null;
      label = mode === 1 ? 'Precio de venta sin IVA' : mode === 2 ? 'Coste máximo recomendado' : 'Margen sobre ventas';
      main = mode === 1 ? euro(p) : mode === 2 ? euro(c) : margin === null ? 'No calculable' : pct(margin);
      note = 'Margen sobre ventas y recargo sobre coste son porcentajes diferentes.';
      lines = [
        ['Beneficio por unidad', euro(benefit)],
        ['Margen sobre ventas', margin === null ? 'No calculable' : pct(margin)],
        ['Recargo sobre coste', markup === null ? 'No calculable' : pct(markup)],
        ['Beneficio total (' + (q || 1) + ' unidades)', euro(benefit * (q || 1))],
      ];
      if (benefit < 0) note = 'Atención: el precio de venta es inferior al coste.';
    }

    if (tool === 'precio') {
      const ct = n.cost + n.extra;
      const comm = n.commission / 100;
      const vat = n.vat / 100;
      const disc = n.discount / 100;
      let p;
      if (mode === 0) {
        if (1 - comm - n.margin / 100 <= 0) throw 'Margen y comisión suman el 100 % o más: precio imposible.';
        p = ct / (1 - comm - n.margin / 100);
      } else if (mode === 1) {
        p = ct * (1 + n.markup / 100);
      } else {
        p = n.given / (n.included === 'Sí' ? 1 + vat : 1);
      }
      const fee = p * comm;
      const profit = p - ct - fee;
      const m = p ? (100 * profit) / p : null;
      const markup = ct ? (100 * profit) / ct : null;
      if (disc >= 1) throw 'El descuento debe ser inferior al 100 %.';
      label = 'Precio de venta con IVA';
      main = euro(p * (1 + vat));
      note = 'Precio antes de IVA: ' + euro(p);
      lines = [
        ['Coste completo', euro(ct)],
        ['Comisión', euro(fee)],
        ['Beneficio unitario', euro(profit)],
        ['Margen real', m === null ? 'No calculable' : pct(m)],
        ['Recargo real', markup === null ? 'No calculable' : pct(markup)],
        ['IVA', euro(p * vat)],
      ];
      if (mode !== 2 && disc > 0) {
        lines.push(['Precio de lista previo a descuento (sin IVA)', euro(p / (1 - disc))], ['PVP de lista con IVA', euro((p / (1 - disc)) * (1 + vat))]);
      }
      assumption = 'La comisión se calcula sobre el precio sin IVA. El IVA se muestra aparte y no forma parte del beneficio.';
    }

    if (tool === 'rentabilidad') {
      if (n.returns > n.sales) throw 'Las devoluciones no pueden superar las ventas.';
      const rev = n.sales - n.returns;
      const gross = rev - n.cogs;
      const op = gross - n.operating;
      const pre = op - n.finance;
      const net = pre - n.tax;
      const rate = (v) => (rev ? pct((100 * v) / rev) : 'No calculable');
      label = 'Resultado neto del período';
      main = euro(net);
      note = 'Margen neto: ' + rate(net);
      lines = [
        ['Ingresos netos', euro(rev)],
        ['Beneficio bruto', euro(gross) + ' · ' + rate(gross)],
        ['Resultado operativo', euro(op) + ' · ' + rate(op)],
        ['Antes de impuestos', euro(pre) + ' · ' + rate(pre)],
        ['Margen neto', rate(net)],
      ];
      assumption = 'El impuesto indicado es un importe introducido manualmente; no estimamos cuotas fiscales. Sin impuesto, el resultado final es antes de impuestos.';
    }

    if (tool === 'iva') {
      // Todo el cálculo se hace en céntimos enteros: base + cuota = total, siempre y sin ruido de coma flotante.
      let baseC = 0, ivaC = 0, totalC = 0;
      if (mode === 0) {
        baseC = cents(n.base);
        ivaC = Math.round((baseC * n.vat) / 100);
        totalC = baseC + ivaC;
      } else if (mode === 1) {
        totalC = cents(n.total);
        baseC = Math.round((totalC * 100) / (100 + n.vat));
        ivaC = totalC - baseC; // la cuota se obtiene por diferencia
      } else {
        const groups = {};
        for (let i = 1; i <= 3; i++) {
          if (n['qty' + i] <= 0) throw 'Las cantidades deben ser positivas.';
          const b = cents((n['qty' + i] * n['unit' + i] * (100 - (n['disc' + i] || 0))) / 100);
          const rate = n['vat' + i];
          groups[rate] = (groups[rate] || 0) + b;
        }
        for (const [rate, b] of Object.entries(groups)) {
          const cuota = Math.round((b * Number(rate)) / 100);
          baseC += b;
          ivaC += cuota;
          lines.push(['Base al ' + rate + ' %', euro(fromCents(b))], ['IVA al ' + rate + ' %', euro(fromCents(cuota))]);
        }
        totalC = baseC + ivaC;
      }
      label = 'Total con IVA';
      main = euro(fromCents(totalC));
      note = 'Cuota IVA: ' + euro(fromCents(ivaC));
      lines = [['Base imponible', euro(fromCents(baseC))], ['IVA', euro(fromCents(ivaC))], ...lines];
      assumption = 'Cálculo orientativo. Los importes se redondean al céntimo y el total es la suma de la base y la cuota. En varias líneas, la cuota se obtiene agrupando la base de cada tipo. Comprueba el IVA aplicable antes de emitir facturas.';
    }
  } catch (e) {
    return fail(String(e));
  }

  return { ok: true, label, main, note, lines, assumption };
}

/** Valores por defecto (como texto, con coma decimal) de una pestaña. */
export function defaultsFor(fields) {
  const out = {};
  for (const [k, , v] of fields) out[k] = String(v).replace('.', ',');
  return out;
}
