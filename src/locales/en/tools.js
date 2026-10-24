// English texts for the calculators and categories (no logic). Keys match src/domain/registry.js.
// Field labels carry no unit: the presentation layer adds it according to the field type and the chosen currency
// ("Purchase cost" + $ -> "Purchase cost ($)").
//
// The tools with ids "precio" and "iva" are GENERIC tax calculators in English: the person types the tax percentage
// (VAT, sales tax, GST...) and no country's rates or rules are assumed. `defaults` overrides the registry's initial
// values for this language; the rates are only editable illustrations.

export const slugs = {
  tools: 'calculators',
  methodology: 'methodology',
  categories: { 'margenes-y-precios': 'margins-and-pricing', facturacion: 'invoicing-and-tax' },
  toolPages: {
    margen: 'profit-margin-calculator',
    precio: 'selling-price-calculator',
    rentabilidad: 'gross-and-net-margin-calculator',
    iva: 'tax-base-calculator',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Margins and pricing',
    kicker: 'CATEGORY',
    short: 'Margin, markup, selling price and profitability',
    description:
      'Calculators to set prices, understand the difference between margin and markup and analyse the profitability of your business.',
  },
  facturacion: {
    title: 'Invoicing and tax',
    kicker: 'CATEGORY',
    short: 'Tax base and tax breakdown',
    description:
      'Tools to work with the tax base and tax amount on your invoices: add or remove tax and break down several lines, using the percentage you type.',
  },
};

export const tools = {
  margen: {
    title: 'Profit margin calculator',
    menuTitle: 'Profit margin',
    metaTitle: 'Profit margin and markup calculator',
    metaDescription:
      'Calculate margin on sales, markup on cost and profit per unit. With formulas, worked examples and common mistakes. Free, no sign-up.',
    kicker: 'MARGINS AND PRICING',
    desc: 'Work out how much you earn per sale, the margin on the price and the markup on your cost, without mixing in tax.',
    tileText: 'See how much you earn per product and the difference between margin and markup.',
    tileCta: 'Calculate margin',
    search: 'profit margin markup benefit percentage gross',
    formulas: [
      ['Profit', 'Selling price − cost'],
      ['Margin on sales', 'Profit ÷ selling price × 100'],
      ['Markup on cost', 'Profit ÷ cost × 100'],
    ],
    faq: [
      ['What is the difference between margin and markup?', 'Margin is calculated on the selling price and markup on the cost. With a cost of 60 and a price of 100, the profit is 40: a 40% margin and a 66.67% markup.'],
      ['Does the margin include tax?', 'No. Enter amounts before tax, because sales tax is neither a cost nor a profit for your business.'],
      ['What does a negative margin mean?', 'That you are selling below cost: the profit per unit is negative and the calculator warns you.'],
      ['Can I work out the price from a margin?', 'Yes. Use the “I want a margin” tab with the cost and the margin you are aiming for. If you already have the price and want the highest cost you can pay, use “Maximum cost”.'],
    ],
    modes: ['I have cost and price', 'I want a margin', 'Maximum cost'],
    fields: [
      { cost: 'Purchase cost', price: 'Price before tax', quantity: 'Quantity' },
      { cost: 'Unit cost', margin: 'Target margin', quantity: 'Quantity' },
      { price: 'Price before tax', margin: 'Target margin', quantity: 'Quantity' },
    ],
  },
  precio: {
    title: 'Selling price calculator with tax',
    menuTitle: 'Selling price with tax',
    metaTitle: 'Selling price calculator with tax and commission',
    metaDescription:
      'Work out a selling price from cost, margin or markup, commission, discount and a tax percentage you choose. With worked examples. Free.',
    kicker: 'PRICING AND MARGINS',
    desc: 'Set the selling price with a margin or markup and see the effect of commissions, discounts and a tax rate you type.',
    tileText: 'Work out a price from your costs, margin, discounts and tax.',
    tileCta: 'Calculate price',
    search: 'selling price retail price discount cost commission fees tax vat sales tax',
    defaults: { vat: 10 },
    formulas: [
      ['Total cost', 'Unit cost + additional costs'],
      ['Price before tax (target margin)', 'Total cost ÷ (1 − commission − margin)'],
      ['Price before tax (markup)', 'Total cost × (1 + markup)'],
      ['Price including tax', 'Price before tax × (1 + tax rate)'],
    ],
    faq: [
      ['Is the margin calculated on the cost or on the price?', 'With “Target margin” it is calculated on the selling price before tax. If you prefer a percentage on the cost, use “Markup on cost”.'],
      ['What should I put under “Additional costs”?', 'Any cost you pay for each unit sold that is not already in the unit cost: shipping, packaging, personalisation…'],
      ['Why does the price jump when I add a commission?', 'Because the commission is paid on the selling price, not on the cost. Margin and commission are taken together from 100% of the price, so their sum must be below 100%.'],
      ['Can I analyse a price I already have?', 'Yes, with “Analyse a price”: enter the price, say whether it includes tax, then the cost and the commission, and the calculator shows the real margin it leaves.'],
      ['Which tax rate should I use?', 'The calculator applies the percentage you type and knows no country’s rules. The initial value is only an editable illustration; check the right rate with official sources or your adviser.'],
    ],
    modes: ['Target margin', 'Markup on cost', 'Analyse a price'],
    fields: [
      { cost: 'Unit cost', extra: 'Additional costs', margin: 'Target margin', commission: 'Commission', discount: 'Planned discount', vat: 'Tax rate' },
      { cost: 'Unit cost', extra: 'Additional costs', markup: 'Markup', commission: 'Commission', discount: 'Planned discount', vat: 'Tax rate' },
      { cost: 'Unit cost', extra: 'Additional costs', given: 'Selling price entered', commission: 'Commission', vat: 'Tax rate', included: 'Price entered includes tax' },
    ],
  },
  rentabilidad: {
    title: 'Gross and net margin calculator',
    menuTitle: 'Gross and net margin',
    metaTitle: 'Gross margin and net margin calculator',
    metaDescription:
      'Calculate your gross, operating and net margin from sales, costs and expenses for the same period. With worked examples. Free, no sign-up.',
    kicker: 'BUSINESS PROFITABILITY',
    desc: 'Break down your sales, costs and expenses for the same period to see the gross, operating and net margin.',
    tileText: 'Analyse revenue, costs, expenses and the profitability of your business.',
    tileCta: 'See profitability',
    search: 'gross margin net margin expenses profit profitability',
    formulas: [
      ['Net revenue', 'Sales − returns and discounts'],
      ['Gross margin', '(Net revenue − cost of sales) ÷ net revenue × 100'],
      ['Operating result', 'Net revenue − cost of sales − operating expenses'],
      ['Net profit', 'Operating result − financial costs − income tax'],
    ],
    faq: [
      ['What is net revenue?', 'The period’s sales minus returns and discounts. It is the base for all the percentages.'],
      ['Are gross margin and profit margin the same thing?', 'No. The profit margin of a product uses its price and its cost; gross margin is for the whole business over a period, on net revenue.'],
      ['What goes under operating expenses?', 'Running costs for the period that are not cost of sales: rent, utilities, staff, advertising… Always use amounts from the same period.'],
      ['Can the result be negative?', 'Yes. If costs and expenses exceed sales, the result is a loss and the calculator shows it with a minus sign.'],
    ],
    modes: ['Result for the period'],
    fields: [
      { sales: 'Sales for the period', returns: 'Returns and discounts', cogs: 'Cost of sales', operating: 'Operating expenses', finance: 'Financial costs', tax: 'Income tax' },
    ],
  },
  iva: {
    title: 'Tax base calculator',
    menuTitle: 'Tax base and tax amount',
    metaTitle: 'Tax base calculator: add and remove tax',
    metaDescription:
      'Find the tax base from a total including tax, add tax to a base or break down an invoice with several lines, using the rates you type. Free.',
    kicker: 'INVOICING',
    desc: 'Get the tax amount and total from the base, or find the tax base when an amount already includes tax. You type the percentage.',
    tileText: 'Add or remove tax and check the breakdown of the amounts.',
    tileCta: 'Calculate tax',
    search: 'tax base add remove vat sales tax gst invoice breakdown',
    defaults: { vat: 10, vat1: 10, vat2: 10, vat3: 5 },
    formulas: [
      ['Tax', 'Tax base × tax rate'],
      ['Total', 'Tax base + tax'],
      ['Base from the total', 'Total ÷ (1 + tax rate)'],
    ],
    faq: [
      ['What is the tax base?', 'It is the amount of the transaction before tax is applied, after any discounts that reduce the price.'],
      ['How do I remove tax from an amount?', 'Divide the total by 1 plus the tax rate written as a fraction: with 10%, divide by 1.10. The “Remove tax” tab does it for you.'],
      ['How is rounding handled?', 'Calculations are done in the smallest currency unit and the tax is rounded to the nearest unit, so base plus tax always adds up to the total.'],
      ['Does this calculator tell me which tax rate to apply?', 'No. It applies the rate you type; which rate applies to each transaction depends on your country’s rules and on each case.'],
    ],
    modes: ['Add tax', 'Remove tax', 'Several lines'],
    fields: [
      { base: 'Tax base (amount before tax)', vat: 'Tax rate' },
      { total: 'Total including tax', vat: 'Tax rate' },
      { qty1: 'Line 1 quantity', unit1: 'Line 1 unit price', disc1: 'Line 1 discount', vat1: 'Line 1 tax rate', qty2: 'Line 2 quantity', unit2: 'Line 2 unit price', vat2: 'Line 2 tax rate', qty3: 'Line 3 quantity', unit3: 'Line 3 unit price', vat3: 'Line 3 tax rate' },
    ],
  },
};

/** Labels for the values of closed-list fields. */
export const selectOptions = { included: { no: 'No', yes: 'Yes' } };

/** Phrases in the editorial text that are automatically linked to their calculator. */
export const autolinkPhrases = [
  ['profit margin calculator', 'margen'],
  ['selling price calculator', 'precio'],
  ['gross and net margin calculator', 'rentabilidad'],
  ['tax base calculator', 'iva'],
];
