// Fórmulas de las calculadoras. Módulo PURO: sin DOM, sin texto de ningún idioma y sin formato.
// Recibe lo que el usuario escribió, lo interpreta con la función `parse` del idioma y devuelve
// NÚMEROS y CÓDIGOS (de error o de aviso). La capa de presentación (src/lib/present.js) los traduce.
// Las fórmulas son las del prototipo aprobado, sin cambios.

import { TOOL_REGISTRY, isNumericKind } from './registry.js';
import { toMinor, fromMinor } from '../i18n/numbers.js';

const fail = (code, params) => ({ ok: false, code, ...(params ? { params } : {}) });

/** Códigos de error posibles (cada idioma debe traducirlos todos: lo comprueba check-i18n). */
export const ERROR_CODES = [
  'invalid-number',
  'negative',
  'percent-over-100',
  'quantity-positive',
  'quantities-positive',
  'margin-under-100',
  'margin-plus-commission',
  'discount-under-100',
  'returns-over-sales',
  'investment-positive',
  'out-of-range',
];

/**
 * Límites del modelo de las calculadoras con `bounded: true` en el registro: por encima de ellos la aritmética de coma
 * flotante deja de ser fiable para importes con céntimos, así que se avisa en vez de mostrar una cifra dudosa.
 * Importes y cantidades: hasta 10^12. Recargos (sin tope porcentual): hasta 10^6 %.
 */
export const MODEL_LIMITS = { amount: 1e12, rate: 1e6, result: 1e15 };

/** Elimina el ruido de coma flotante (0,3 − 0,1 = 0,19999999999999998) conservando 12 cifras significativas. */
const clean = (x) => (Number.isFinite(x) ? Number(x.toPrecision(12)) : x);

/** ¿Hay algún número no finito (NaN, Infinity) en el resultado? */
const hasNonFinite = (v) => (typeof v === 'number' ? !Number.isFinite(v) : v && typeof v === 'object' ? Object.values(v).some(hasNonFinite) : false);
/** ¿Hay algún número por encima del límite de resultados? */
const hasHuge = (v) => (typeof v === 'number' ? Math.abs(v) > MODEL_LIMITS.result : v && typeof v === 'object' ? Object.values(v).some(hasHuge) : false);

/**
 * @param {string} tool id de la calculadora
 * @param {number} mode índice de la pestaña activa
 * @param {Record<string,string>} raw valores tal y como los escribe el usuario
 * @param {{parse:(s:string)=>number, exponent?:number}} ctx `parse` del idioma; `exponent` de la moneda (2 por defecto)
 */
export function calculate(tool, mode, raw, ctx) {
  const spec = TOOL_REGISTRY[tool]?.modes[mode];
  if (!spec) throw new Error(`Calculadora o pestaña desconocida: ${tool}/${mode}`);
  const kindOf = (k) => spec.find((x) => x.key === k)?.kind ?? 'money';
  const optional = (k) => spec.find((x) => x.key === k)?.optional === true;
  const exp = ctx.exponent ?? 2;

  const n = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!isNumericKind(kindOf(k))) {
      n[k] = v;
      continue;
    }
    // Campo opcional vacío -> null (la fórmula decide qué hacer). Un 0 escrito sigue siendo 0.
    if (optional(k) && String(v ?? '').trim() === '') {
      n[k] = null;
      continue;
    }
    const x = ctx.parse(v);
    if (!Number.isFinite(x)) return fail('invalid-number');
    n[k] = x;
  }
  for (const [k, v] of Object.entries(n)) {
    if (typeof v !== 'number') continue;
    if (v < 0) return fail('negative');
    if (kindOf(k) === 'pct' && v > 100) return fail('percent-over-100');
  }

  if (TOOL_REGISTRY[tool].bounded) {
    for (const [k, v] of Object.entries(n)) {
      if (typeof v === 'number' && v > (kindOf(k) === 'rate' ? MODEL_LIMITS.rate : MODEL_LIMITS.amount)) return fail('out-of-range');
    }
  }

  try {
    const data = FORMULAS[tool](mode, n, exp);
    // Red de seguridad común: nunca se devuelve NaN ni Infinity, ni cifras fuera del límite del modelo.
    if (hasNonFinite(data) || (TOOL_REGISTRY[tool].bounded && hasHuge(data))) return fail('out-of-range');
    return { ok: true, tool, mode, data };
  } catch (e) {
    if (e instanceof Fail) return fail(e.code);
    throw e;
  }
}

class Fail extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}
const stop = (code) => {
  throw new Fail(code);
};

const FORMULAS = {
  margen(mode, n) {
    let c = n.cost, p = n.price;
    const m = n.margin / 100, q = n.quantity;
    if (q !== undefined && q <= 0) stop('quantity-positive');
    if (mode === 1) {
      if (m >= 1) stop('margin-under-100');
      p = c / (1 - m);
    }
    if (mode === 2) {
      if (m >= 1) stop('margin-under-100');
      c = p * (1 - m);
    }
    const benefit = p - c;
    const units = q || 1;
    return {
      price: p,
      cost: c,
      benefit,
      margin: p ? (100 * benefit) / p : null,
      markup: c ? (100 * benefit) / c : null,
      units,
      totalBenefit: benefit * units,
      sellsBelowCost: benefit < 0,
    };
  },

  precio(mode, n) {
    const ct = n.cost + n.extra;
    const comm = n.commission / 100;
    const vat = n.vat / 100;
    const disc = (n.discount ?? 0) / 100;
    let p;
    if (mode === 0) {
      if (1 - comm - n.margin / 100 <= 0) stop('margin-plus-commission');
      p = ct / (1 - comm - n.margin / 100);
    } else if (mode === 1) {
      p = ct * (1 + n.markup / 100);
    } else {
      p = n.given / (n.included === 'yes' ? 1 + vat : 1);
    }
    const fee = p * comm;
    const profit = p - ct - fee;
    if (disc >= 1) stop('discount-under-100');
    const out = {
      priceNet: p,
      priceGross: p * (1 + vat),
      vatAmount: p * vat,
      totalCost: ct,
      fee,
      profit,
      margin: p ? (100 * profit) / p : null,
      markup: ct ? (100 * profit) / ct : null,
      list: null,
    };
    if (mode !== 2 && disc > 0) out.list = { net: p / (1 - disc), gross: (p / (1 - disc)) * (1 + vat) };
    return out;
  },

  rentabilidad(mode, n) {
    if (n.returns > n.sales) stop('returns-over-sales');
    const revenue = n.sales - n.returns;
    const gross = revenue - n.cogs;
    const operating = gross - n.operating;
    const pretax = operating - n.finance;
    const net = pretax - n.tax;
    const rate = (v) => (revenue ? (100 * v) / revenue : null);
    return {
      revenue, gross, operating, pretax, net,
      costOfSales: n.cogs, operatingExpenses: n.operating, financeAndTax: n.finance + n.tax,
      rates: { gross: rate(gross), operating: rate(operating), pretax: rate(pretax), net: rate(net) },
    };
  },

  recargo(mode, n) {
    // Recargo (markup) = porcentaje que se añade al COSTE. Margen = parte del PRECIO que es beneficio.
    const benefit = (n.cost * n.markup) / 100;
    const price = n.cost + benefit;
    return {
      cost: n.cost,
      markup: n.markup,
      benefit,
      price,
      // margen sobre ventas equivalente = beneficio ÷ precio (= recargo ÷ (1 + recargo)); sin precio no existe
      margin: price ? (100 * benefit) / price : null,
      // Error habitual: tratar ese mismo porcentaje como si fuera un margen sobre ventas -> precio = coste ÷ (1 − margen)
      priceIfMargin: n.markup < 100 ? (n.cost * 100) / (100 - n.markup) : null,
    };
  },

  descuento(mode, n) {
    // Los descuentos sucesivos se multiplican: precio × (1 − d1) × (1 − d2). Nunca se suman los porcentajes.
    const d1 = n.first;
    const d2 = n.second ?? 0;
    const afterFirst = (n.price * (100 - d1)) / 100;
    const final = (n.price * (100 - d1) * (100 - d2)) / 10000;
    return {
      price: n.price,
      first: d1,
      second: d2,
      hasSecond: d2 > 0,
      firstSaving: n.price - afterFirst,
      afterFirst,
      secondSaving: afterFirst - final,
      final,
      saving: n.price - final,
      // El descuento efectivo solo depende de los porcentajes (no del precio): 100 − (100 − d1)(100 − d2) / 100
      effective: clean(100 - ((100 - d1) * (100 - d2)) / 100),
      // Lo que saldría (erróneamente) sumando los porcentajes; solo tiene sentido si la suma no llega al 100 %
      summed: d1 + d2,
      priceIfSummed: d1 + d2 < 100 ? (n.price * (100 - d1 - d2)) / 100 : null,
    };
  },

  equilibrio(mode, n) {
    const unitMargin = clean(n.price - n.variable);
    const base = {
      fixed: n.fixed,
      price: n.price,
      variable: n.variable,
      unitMargin,
      // ratio de contribución: parte de cada euro de venta que queda tras los costes variables
      contributionRatio: n.price > 0 ? clean((100 * unitMargin) / n.price) : null,
      expected: null,
    };
    let result;
    if (unitMargin <= 0) {
      // Cada unidad vendida aporta cero o pierde dinero: ningún volumen cubre los costes fijos. Sin división.
      result = { ...base, status: 'no-margin', exactUnits: null, units: null, revenue: null, bar: null };
    } else if (n.fixed === 0) {
      result = { ...base, status: 'no-fixed', exactUnits: 0, units: 0, revenue: 0, bar: { variable: 0, fixed: 0, surplus: 0 } };
    } else {
      const exactUnits = clean(n.fixed / unitMargin);
      if (exactUnits > MODEL_LIMITS.amount) stop('out-of-range');
      const units = Math.ceil(exactUnits); // unidades indivisibles: siempre hacia arriba
      const revenue = clean(units * n.price);
      const variableTotal = clean(units * n.variable);
      result = { ...base, status: 'ok', exactUnits, units, revenue, bar: { variable: variableTotal, fixed: n.fixed, surplus: Math.max(0, Number((revenue - variableTotal - n.fixed).toFixed(9))) } };
    }
    if (n.units !== null && n.units !== undefined) {
      const profit = clean(n.units * unitMargin - n.fixed);
      result.expected = { units: n.units, revenue: clean(n.units * n.price), profit };
    }
    return result;
  },

  roi(mode, n) {
    if (n.investment <= 0) stop('investment-positive');
    const net = clean(n.total - n.investment);
    return {
      investment: n.investment,
      total: n.total,
      net,
      roi: (100 * net) / n.investment,
      multiple: n.total / n.investment,
      verdict: n.total === 0 ? 'total-loss' : net > 0 ? 'gain' : net < 0 ? 'loss' : 'even',
    };
  },

  iva(mode, n, exp) {
    // Todo el cálculo en unidades menores enteras (céntimos): base + cuota = total siempre, sin ruido de coma flotante.
    let baseM = 0, vatM = 0, totalM = 0;
    const groups = [];
    if (mode === 0) {
      baseM = toMinor(n.base, exp);
      vatM = Math.round((baseM * n.vat) / 100);
      totalM = baseM + vatM;
    } else if (mode === 1) {
      totalM = toMinor(n.total, exp);
      baseM = Math.round((totalM * 100) / (100 + n.vat));
      vatM = totalM - baseM; // la cuota se obtiene por diferencia
    } else {
      const byRate = new Map();
      for (let i = 1; i <= 3; i++) {
        const qty = n['qty' + i];
        // La primera línea es obligatoria; las siguientes admiten cantidad vacía o cero.
        if (i > 1 && (qty === null || qty === 0)) continue;
        if (qty == null || qty <= 0) stop('quantities-positive');
        const b = toMinor((n['qty' + i] * n['unit' + i] * (100 - (n['disc' + i] || 0))) / 100, exp);
        const rate = n['vat' + i];
        byRate.set(rate, (byRate.get(rate) || 0) + b);
      }
      for (const [rate, b] of [...byRate].sort((a, c) => a[0] - c[0])) {
        const cuota = Math.round((b * rate) / 100);
        baseM += b;
        vatM += cuota;
        groups.push({ rate, base: fromMinor(b, exp), vat: fromMinor(cuota, exp) });
      }
      totalM = baseM + vatM;
    }
    return { base: fromMinor(baseM, exp), vat: fromMinor(vatM, exp), total: fromMinor(totalM, exp), groups };
  },
};
