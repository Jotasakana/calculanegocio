// Capa de presentación: convierte los números y códigos de src/domain/formulas.js en texto de un idioma.
// No contiene fórmulas. Toda frase sale de los mensajes del idioma (src/locales/<idioma>/messages.js).

import { calculate } from '../domain/formulas.js';
import { TOOL_REGISTRY } from '../domain/registry.js';
import { getLocale } from '../i18n/locales.js';
import { makeFormatter, parseDecimal, decimalSeparator, usesIndianGrouping, currencyExponent, toInputString } from '../i18n/numbers.js';

/** Traductor: t('clave', { marcador: 'valor' }, cantidad?) con plurales según las reglas del idioma. */
export function makeTranslator(localeCode, messages) {
  const rules = new Intl.PluralRules(getLocale(localeCode).intl);
  return (key, params = {}, count) => {
    let msg = messages[key];
    if (msg === undefined) throw new Error(`Falta el mensaje "${key}" (${localeCode})`);
    if (typeof msg === 'object') msg = msg[rules.select(count ?? 0)] ?? msg.other;
    return msg.replace(/\{(\w+)\}/g, (_, k) => {
      if (!(k in params)) throw new Error(`Falta el marcador {${k}} en "${key}" (${localeCode})`);
      return params[k];
    });
  };
}

/** Unidad que se añade a la etiqueta de un campo: " (€)" para importes (si hay moneda), " (%)" para porcentajes. */
export function unitSuffix(kind, formatter) {
  if (kind === 'pct' || kind === 'rate') return ' (%)';
  if (kind === 'money' && formatter.symbol) return ` (${formatter.symbol})`;
  return '';
}

/**
 * Barra de composición del resultado. parts: [id, etiqueta, valor]. Se omiten los valores no positivos.
 * `share` suma 100 (en %); el texto del importe lo pone quien llama.
 */
export function stackBar(parts, fmt) {
  const pos = parts.map(([id, label, v], slot) => ({ id, label, v, slot })).filter((p) => p.v > 0);
  const total = pos.reduce((t, p) => t + p.v, 0);
  if (!total) return [];
  // `slot` = posición en la lista original: el color de cada concepto no cambia aunque otro valga 0.
  return pos.map((p) => ({ id: p.id, slot: p.slot, label: p.label, text: fmt(p.v), share: Math.round((p.v / total) * 10000) / 100 }));
}

/**
 * Calculadoras de un idioma + una moneda.
 * @param {{code:string, errors:Record<string,string>, messages:Record<string,any>, selectOptions?:Record<string,Record<string,string>>}} content
 * @param {string|null} currency código ISO 4217, o null si no se ha elegido ninguna (importes sin símbolo)
 */
export function createCalculator(content, currency) {
  const localeCode = content.code;
  const f = makeFormatter(localeCode, currency);
  const t = makeTranslator(localeCode, content.messages);
  const dec = decimalSeparator(localeCode);
  const indian = usesIndianGrouping(localeCode);
  const parse = (s) => parseDecimal(s, dec, { indian });
  const exponent = currencyExponent(currency);

  // Acepta tanto el valor neutro ('yes') como la etiqueta visible del idioma ('Sí').
  const labelToValue = {};
  for (const [field, opts] of Object.entries(content.selectOptions ?? {}))
    for (const [value, label] of Object.entries(opts)) (labelToValue[field] ??= {})[label] = value;
  const normalize = (raw) =>
    Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, labelToValue[k]?.[v] ?? v]));

  const na = (v, fn) => (v === null ? t('common.notComputable') : fn(v));

  const PRESENT = {
    margen(mode, d) {
      return {
        label: t(mode === 1 ? 'margen.label.price' : mode === 2 ? 'margen.label.cost' : 'margen.label.margin'),
        main: mode === 1 ? f.money(d.price) : mode === 2 ? f.money(d.cost) : na(d.margin, f.percent),
        note: t(d.sellsBelowCost ? 'margen.note.below' : 'margen.note'),
        lines: [
          [t('margen.line.benefit'), f.money(d.benefit)],
          [t('margen.line.margin'), na(d.margin, f.percent)],
          [t('margen.line.markup'), na(d.markup, f.percent)],
          [t('margen.line.total', { units: f.integer(d.units) }, d.units), f.money(d.totalBenefit)],
        ],
        assumption: t('common.assumption.noVat'),
        bar: stackBar([['cost', t('margen.bar.cost'), d.cost], ['profit', t('margen.bar.profit'), d.benefit]], f.money),
      };
    },
    precio(mode, d) {
      const lines = [
        [t('precio.line.totalCost'), f.money(d.totalCost)],
        [t('precio.line.fee'), f.money(d.fee)],
        [t('precio.line.profit'), f.money(d.profit)],
        [t('precio.line.margin'), na(d.margin, f.percent)],
        [t('precio.line.markup'), na(d.markup, f.percent)],
        [t('precio.line.vat'), f.money(d.vatAmount)],
      ];
      if (d.list) lines.push([t('precio.line.listNet'), f.money(d.list.net)], [t('precio.line.listGross'), f.money(d.list.gross)]);
      return {
        label: t('precio.label'),
        main: f.money(d.priceGross),
        note: t('precio.note', { price: f.money(d.priceNet) }),
        lines,
        assumption: t('precio.assumption'),
        bar: stackBar([['cost', t('precio.bar.cost'), d.totalCost], ['fee', t('precio.bar.fee'), d.fee], ['profit', t('precio.bar.profit'), d.profit], ['vat', t('precio.bar.vat'), d.vatAmount]], f.money),
      };
    },
    rentabilidad(mode, d) {
      const rate = (v) => na(v, f.percent);
      return {
        label: t('rentabilidad.label'),
        main: f.money(d.net),
        note: t('rentabilidad.note', { rate: rate(d.rates.net) }),
        lines: [
          [t('rentabilidad.line.revenue'), f.money(d.revenue)],
          [t('rentabilidad.line.gross'), f.money(d.gross) + ' · ' + rate(d.rates.gross)],
          [t('rentabilidad.line.operating'), f.money(d.operating) + ' · ' + rate(d.rates.operating)],
          [t('rentabilidad.line.pretax'), f.money(d.pretax) + ' · ' + rate(d.rates.pretax)],
          [t('rentabilidad.line.net'), rate(d.rates.net)],
        ],
        assumption: t('rentabilidad.assumption'),
        bar: stackBar([
          ['cogs', t('rentabilidad.bar.cogs'), d.costOfSales],
          ['operating', t('rentabilidad.bar.operating'), d.operatingExpenses],
          ['other', t('rentabilidad.bar.other'), d.financeAndTax],
          ['net', t('rentabilidad.bar.net'), d.net],
        ], f.money),
      };
    },
    recargo(mode, d) {
      return {
        label: t('recargo.label'),
        main: f.money(d.price),
        note: d.margin === null ? t('recargo.note.free') : t('recargo.note', { markup: f.percentCompact(d.markup), margin: f.percentCompact(d.margin) }),
        lines: [
          [t('recargo.line.cost'), f.money(d.cost)],
          [t('recargo.line.benefit'), f.money(d.benefit)],
          [t('recargo.line.markup'), f.percent(d.markup)],
          [t('recargo.line.margin'), na(d.margin, f.percent)],
          [t('recargo.line.ifMargin', { markup: f.percentCompact(d.markup) }), na(d.priceIfMargin, f.money)],
        ],
        assumption: t('recargo.assumption'),
        bar: stackBar([['cost', t('recargo.bar.cost'), d.cost], ['profit', t('recargo.bar.profit'), d.benefit]], f.money),
      };
    },
    descuento(mode, d) {
      const lines = [
        [t('descuento.line.price'), f.money(d.price)],
        [t('descuento.line.first', { rate: f.percentCompact(d.first) }), f.money(d.firstSaving)],
      ];
      if (d.hasSecond) lines.push([t('descuento.line.second', { rate: f.percentCompact(d.second) }), f.money(d.secondSaving)]);
      lines.push([t('descuento.line.saving'), f.money(d.saving)], [t('descuento.line.effective'), f.percent(d.effective)]);
      if (d.hasSecond && d.priceIfSummed !== null) lines.push([t('descuento.line.summed', { rate: f.percentCompact(d.summed) }), f.money(d.priceIfSummed)]);
      return {
        label: t('descuento.label'),
        main: f.money(d.final),
        note: t('descuento.note', { saving: f.money(d.saving), effective: f.percentCompact(d.effective) }),
        lines,
        assumption: t('descuento.assumption'),
        bar: stackBar([['final', t('descuento.bar.final'), d.final], ['saving', t('descuento.bar.saving'), d.saving]], f.money),
      };
    },
    equilibrio(mode, d) {
      const lines = [
        [t('equilibrio.line.unitMargin'), f.money(d.unitMargin)],
        [t('equilibrio.line.ratio'), na(d.contributionRatio, f.percent)],
      ];
      if (d.status === 'ok') lines.push([t('equilibrio.line.exact'), f.integer(d.exactUnits)], [t('equilibrio.line.revenue'), f.money(d.revenue)]);
      if (d.expected) {
        const state = t(d.expected.profit > 0 ? 'equilibrio.state.profit' : d.expected.profit < 0 ? 'equilibrio.state.loss' : 'equilibrio.state.even');
        lines.push([t('equilibrio.line.expected', { units: f.integer(d.expected.units) }, d.expected.units), `${f.money(d.expected.profit)} · ${state}`]);
      }
      const note = d.status === 'no-margin'
        ? t('equilibrio.note.noMargin', { margin: f.money(d.unitMargin) })
        : d.status === 'no-fixed'
          ? t('equilibrio.note.noFixed', { margin: f.money(d.unitMargin) })
          : t('equilibrio.note', { revenue: f.money(d.revenue) });
      return {
        label: t('equilibrio.label'),
        main: d.status === 'no-margin' ? t('common.notComputable') : f.integer(d.units),
        note,
        lines,
        assumption: t('equilibrio.assumption'),
        bar: d.bar ? stackBar([['variable', t('equilibrio.bar.variable'), d.bar.variable], ['fixed', t('equilibrio.bar.fixed'), d.bar.fixed], ['surplus', t('equilibrio.bar.surplus'), d.bar.surplus]], f.money) : [],
      };
    },
    roi(mode, d) {
      const loss = d.verdict === 'loss' || d.verdict === 'total-loss';
      const verdictKey = { gain: 'roi.verdict.gain', even: 'roi.verdict.even', loss: 'roi.verdict.loss', 'total-loss': 'roi.verdict.totalLoss' }[d.verdict];
      return {
        label: t('roi.label'),
        main: f.percent(d.roi),
        note: t(verdictKey, { roi: f.percentCompact(Math.abs(d.roi)) }),
        lines: [
          [t('roi.line.investment'), f.money(d.investment)],
          [t('roi.line.total'), f.money(d.total)],
          [t('roi.line.net'), f.money(d.net)],
          [t('roi.line.roi'), f.percent(d.roi)],
          [t('roi.line.multiple'), f.number(d.multiple)],
        ],
        assumption: t('roi.assumption'),
        bar: stackBar([
          ['base', t(loss ? 'roi.bar.recovered' : 'roi.bar.invested'), loss ? d.total : d.investment],
          ['gain', t('roi.bar.gain'), d.net > 0 ? d.net : 0],
          ['loss', t('roi.bar.loss'), d.net < 0 ? -d.net : 0],
        ], f.money),
      };
    },
    iva(mode, d) {
      const groupLines = d.groups.flatMap((g) => [
        [t('iva.line.groupBase', { rate: f.integer(g.rate) }), f.money(g.base)],
        [t('iva.line.groupVat', { rate: f.integer(g.rate) }), f.money(g.vat)],
      ]);
      return {
        label: t('iva.label'),
        main: f.money(d.total),
        note: t('iva.note', { vat: f.money(d.vat) }),
        lines: [[t('iva.line.base'), f.money(d.base)], [t('iva.line.vat'), f.money(d.vat)], ...groupLines],
        assumption: t('iva.assumption'),
        bar: stackBar([['base', t('iva.bar.base'), d.base], ['vat', t('iva.bar.vat'), d.vat]], f.money),
      };
    },
  };

  return {
    locale: localeCode,
    currency,
    formatter: f,
    t,
    parse,

    /** Resultado listo para mostrar. En error: { ok:false, code, error }. */
    compute(tool, mode, raw) {
      const r = calculate(tool, mode, normalize(raw), { parse, exponent });
      if (!r.ok) return { ok: false, code: r.code, error: content.errors[r.code] };
      return { ok: true, ...PRESENT[tool](mode, r.data), data: r.data };
    },

    /** Valores iniciales (como texto, con el decimal del idioma) de una pestaña. El idioma puede sustituir los del registro (`tools.<id>.defaults`, p. ej. el tipo de ejemplo de la versión genérica). */
    defaults(tool, mode) {
      const out = {};
      for (const fld of TOOL_REGISTRY[tool].modes[mode]) out[fld.key] = fld.kind === 'select' ? fld.def : toInputString(content.tools?.[tool]?.defaults?.[fld.key] ?? fld.def, localeCode);
      return out;
    },

    /** Etiqueta visible de un campo, con su unidad: "Coste de compra (€)", "Margen deseado (%)", "Cantidad". */
    fieldLabel(tool, mode, key) {
      const fld = TOOL_REGISTRY[tool].modes[mode].find((x) => x.key === key);
      return content.tools[tool].fields[mode][key] + unitSuffix(fld.kind, f);
    },
  };
}
