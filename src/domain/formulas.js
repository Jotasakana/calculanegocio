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
];

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
  const exp = ctx.exponent ?? 2;

  const n = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!isNumericKind(kindOf(k))) {
      n[k] = v;
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

  try {
    return { ok: true, tool, mode, data: FORMULAS[tool](mode, n, exp) };
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
        if (n['qty' + i] <= 0) stop('quantities-positive');
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
