// Lectura y formato de números, importes y porcentajes según el idioma. Módulo puro (sin DOM):
// se usa en el build y en el navegador. La moneda es independiente del idioma.

import { getLocale } from './locales.js';

/* ------------------------------------------------------------------ lectura */

// Dígitos de otros sistemas de escritura -> ASCII, para poder escribir en árabe, hindi, chino, etc.
const DIGIT_BLOCKS = [0x0660, 0x06f0, 0x0966, 0xff10]; // árabe-índico, persa, devanagari, ancho completo
const SEPARATOR_MAP = { '٫': '.', '٬': ',', '．': '.', '，': ',', '。': '.' };

export function normalizeDigits(s) {
  let out = '';
  for (const ch of String(s)) {
    const cp = ch.codePointAt(0);
    const block = DIGIT_BLOCKS.find((b) => cp >= b && cp <= b + 9);
    out += block !== undefined ? String(cp - block) : (SEPARATOR_MAP[ch] ?? ch);
  }
  return out;
}

/** Separador decimal principal de un idioma ("," o "."), obtenido de Intl. */
const decimalCache = new Map();
export function decimalSeparator(localeCode) {
  if (!decimalCache.has(localeCode)) {
    const parts = new Intl.NumberFormat(getLocale(localeCode).intl).formatToParts(1.5);
    decimalCache.set(localeCode, parts.find((p) => p.type === 'decimal').value);
  }
  return decimalCache.get(localeCode);
}

/** ¿El idioma agrupa los miles a la manera india (12,34,567)? Se deduce de Intl (hi-IN, en-IN...). */
const indianCache = new Map();
export function usesIndianGrouping(localeCode) {
  if (!indianCache.has(localeCode)) {
    const sample = new Intl.NumberFormat(getLocale(localeCode).intl, { useGrouping: 'always' }).format(1234567);
    indianCache.set(localeCode, /^\d{2},\d{2},\d{3}$/.test(normalizeDigits(sample)));
  }
  return indianCache.get(localeCode);
}

/**
 * Interpreta un número escrito por una persona, según el idioma de la página.
 *
 * `decimal` es el separador decimal del idioma ("," en es/pt/fr/de/id; "." en en/ja/zh/hi/ar).
 * El otro símbolo es el separador de miles, pero se tolera como decimal cuando no puede ser un
 * separador de miles ("12.50" en español -> 12,5; "12,50" en inglés -> 12.5).
 *
 *  - El decimal del idioma es siempre decimal: es "1,250" -> 1,25 · en "1.250" -> 1,25.
 *  - El otro símbolo, solo y seguido de EXACTAMENTE tres cifras, es de miles si la parte entera tiene
 *    1-3 cifras y no empieza por 0: es "1.250" -> 1250 · en "1,250" -> 1250. Si no: es decimal.
 *  - Con los dos símbolos a la vez, el último es el decimal y el otro debe agrupar de tres en tres.
 *  - Varios símbolos iguales solo se aceptan como miles bien formados ("1.250.000").
 *  - Se admite un decimal inicial o final mientras se escribe (",5", "5,").
 *  - Vacío, texto, notación científica y cualquier otro formato -> NaN.
 *
 *  - Con `indian: true` (hi-IN) también se admite la agrupación india: "12,34,567.50" (último grupo de tres cifras y el resto de dos).
 *
 * Espacios (también los de no ruptura y estrechos de fr), %, € y otros símbolos de moneda comunes se ignoran.
 */
export function parseDecimal(s, decimal = ',', { indian = false } = {}) {
  const other = decimal === ',' ? '.' : ',';
  const raw = normalizeDigits(String(s ?? ''))
    .trim()
    .replace(/[\s  '’€$£¥₹%٪]/g, '');
  if (!raw || !/^[+-]?[\d.,]+$/.test(raw)) return NaN;
  const sign = raw.startsWith('-') ? '-' : '';
  const x = raw.replace(/^[+-]/, '');
  if (!/\d/.test(x)) return NaN;

  const groupedWestern = (g) => g.length >= 2 && /^[1-9]\d{0,2}$/.test(g[0]) && g.slice(1).every((v) => /^\d{3}$/.test(v));
  // Agrupación india: 12,34,567 (el último grupo de tres cifras; los anteriores, de dos; el primero de una o dos).
  const groupedIndian = (g) => g.length >= 3 && /^[1-9]\d?$/.test(g[0]) && g.slice(1, -1).every((v) => /^\d{2}$/.test(v)) && /^\d{3}$/.test(g[g.length - 1]);
  const grouped = (g) => groupedWestern(g) || (indian && groupedIndian(g));

  const hasDec = x.includes(decimal);
  const hasOther = x.includes(other);
  let normalized;
  if (hasDec && hasOther) {
    const dec = x.lastIndexOf(decimal) > x.lastIndexOf(other) ? decimal : other;
    const thousands = dec === decimal ? other : decimal;
    const pieces = x.split(dec);
    if (pieces.length !== 2 || !/^\d*$/.test(pieces[1])) return NaN;
    const groups = pieces[0].split(thousands);
    if (!grouped(groups)) return NaN;
    normalized = groups.join('') + (pieces[1] ? '.' + pieces[1] : '');
  } else if (hasDec || hasOther) {
    const sep = hasDec ? decimal : other;
    const parts = x.split(sep);
    if (parts.length === 2) {
      const [int, frac] = parts;
      if (sep === other && /^[1-9]\d{0,2}$/.test(int) && /^\d{3}$/.test(frac)) normalized = int + frac;
      else normalized = (int || '0') + (frac ? '.' + frac : '');
    } else if (grouped(parts)) normalized = parts.join('');
    else return NaN;
  } else normalized = x;

  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return NaN;
  return Number(sign + normalized) + 0; // "+ 0" evita devolver -0
}

/** Cadena con el decimal del idioma, para valores por defecto de los campos: 49.23 -> "49,23" (es). */
export const toInputString = (n, localeCode) => String(n).replace('.', decimalSeparator(localeCode));

/* ------------------------------------------------------------------ formato */

/** Decimales de una moneda (EUR 2, JPY 0, IDR 2 en Intl...). Sin moneda: 2. */
export function currencyExponent(currency) {
  if (!currency) return 2;
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits;
}

/**
 * Importe en unidades menores enteras (céntimos, yenes...) con redondeo "half-up" sobre la
 * representación decimal: toMinor(3.885, 2) -> 389 · toMinor(1.005, 2) -> 101.
 */
export function toMinor(x, exponent = 2) {
  const t = String(x);
  return Math.round(t.includes('e') ? x * 10 ** exponent : Number(t + 'e' + exponent));
}
export const fromMinor = (m, exponent = 2) => m / 10 ** exponent;

/**
 * Formateador de un idioma + una moneda (opcional). `currency` = null: importes como números sin símbolo.
 * Los números se muestran siempre con separador de miles.
 */
export function makeFormatter(localeCode, currency = null) {
  const intl = getLocale(localeCode).intl;
  const exp = currencyExponent(currency);
  const plain = new Intl.NumberFormat(intl, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
  const money = currency
    ? new Intl.NumberFormat(intl, { style: 'currency', currency, useGrouping: 'always' })
    : new Intl.NumberFormat(intl, { minimumFractionDigits: exp, maximumFractionDigits: exp, useGrouping: 'always' });
  const percent = new Intl.NumberFormat(intl, { style: 'unit', unit: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });
  const symbol = currency
    ? new Intl.NumberFormat(intl, { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).formatToParts(0).find((p) => p.type === 'currency').value
    : '';
  const percentCompact = new Intl.NumberFormat(intl, { style: 'unit', unit: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2, useGrouping: 'always' });
  return {
    locale: localeCode,
    currency,
    symbol,
    exponent: exp,
    number: (n) => plain.format(n),
    money: (n) => money.format(n),
    percent: (n) => percent.format(n),
    percentCompact: (n) => percentCompact.format(n), // 40 % · 66,67 %
    integer: (n) => new Intl.NumberFormat(intl, { useGrouping: 'always', maximumFractionDigits: 6 }).format(n),
    date: (d, opts = { dateStyle: 'long' }) => new Intl.DateTimeFormat(intl.replace(/-u-.*$/, '') + '-u-ca-gregory', opts).format(d),
  };
}
