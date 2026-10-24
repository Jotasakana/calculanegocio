// Result and error messages in English. Every key must exist in ALL languages (checked by scripts/check-i18n.mjs).
// Values accept {placeholders} and, for plurals, an object { one, other, ... }.
// The internal ids "iva" and "precio" are kept for the two tax-related calculators, but in English they are
// GENERIC: the person types the tax percentage and no country's rules are assumed.

export const errors = {
  'invalid-number': 'Enter a valid number in every field.',
  negative: 'Amounts and percentages cannot be negative.',
  'percent-over-100': 'Check the percentages: they cannot exceed 100%.',
  'quantity-positive': 'The quantity must be greater than zero.',
  'quantities-positive': 'Quantities must be positive.',
  'margin-under-100': 'The margin must be below 100%.',
  'margin-plus-commission': 'Margin and commission add up to 100% or more: that price is impossible.',
  'discount-under-100': 'The discount must be below 100%.',
  'returns-over-sales': 'Returns cannot exceed sales.',
};

export const messages = {
  'common.notComputable': 'Not computable',
  'common.checkData': 'Check your figures.',
  'common.assumption.noVat': 'All commercial amounts are calculated before tax.',

  'margen.label.margin': 'Margin on sales',
  'margen.label.price': 'Selling price before tax',
  'margen.label.cost': 'Maximum recommended cost',
  'margen.note': 'Margin on sales and markup on cost are different percentages.',
  'margen.note.below': 'Warning: the selling price is below the cost.',
  'margen.line.benefit': 'Profit per unit',
  'margen.line.margin': 'Margin on sales',
  'margen.line.markup': 'Markup on cost',
  'margen.bar.cost': 'Cost',
  'margen.bar.profit': 'Profit',
  'margen.line.total': { one: 'Total profit ({units} unit)', other: 'Total profit ({units} units)' },

  'precio.label': 'Selling price including tax',
  'precio.note': 'Price before tax: {price}',
  'precio.line.totalCost': 'Total cost',
  'precio.line.fee': 'Commission',
  'precio.line.profit': 'Profit per unit',
  'precio.line.margin': 'Actual margin',
  'precio.line.markup': 'Actual markup',
  'precio.line.vat': 'Tax',
  'precio.line.listNet': 'List price before discount (before tax)',
  'precio.line.listGross': 'List price before discount (including tax)',
  'precio.bar.cost': 'Cost',
  'precio.bar.fee': 'Commission',
  'precio.bar.profit': 'Profit',
  'precio.bar.vat': 'Tax',
  'precio.assumption': 'The commission is calculated on the price before tax. Tax is shown separately and is not part of the profit. The tax rate is the percentage you type; this tool does not know any country’s rules.',

  'rentabilidad.label': 'Net result for the period',
  'rentabilidad.note': 'Net margin: {rate}',
  'rentabilidad.line.revenue': 'Net revenue',
  'rentabilidad.line.gross': 'Gross profit',
  'rentabilidad.line.operating': 'Operating result',
  'rentabilidad.line.pretax': 'Before tax',
  'rentabilidad.line.net': 'Net margin',
  'rentabilidad.bar.cogs': 'Cost of sales',
  'rentabilidad.bar.operating': 'Operating expenses',
  'rentabilidad.bar.other': 'Financial costs and tax',
  'rentabilidad.bar.net': 'Net result',
  'rentabilidad.assumption': 'The tax shown is an amount you enter manually; we do not estimate tax due. Without a tax amount, the final result is before tax.',

  'iva.label': 'Total including tax',
  'iva.note': 'Tax amount: {vat}',
  'iva.line.base': 'Tax base (amount before tax)',
  'iva.line.vat': 'Tax',
  'iva.line.groupBase': 'Base at {rate}%',
  'iva.line.groupVat': 'Tax at {rate}%',
  'iva.bar.base': 'Tax base',
  'iva.bar.vat': 'Tax',
  'iva.assumption': 'Indicative calculation using the percentage you type. Amounts are rounded to the smallest currency unit and the total is the base plus the tax. With several lines, tax is obtained by grouping the base of each rate. Check the rate and the calculation method that apply to you before issuing invoices.',
};
