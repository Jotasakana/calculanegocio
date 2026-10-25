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
  pages: { contact: 'contact', legal: 'legal-notice', privacy: 'privacy-policy', cookies: 'cookie-policy', terms: 'terms-of-use' },
  categories: { 'margenes-y-precios': 'margins-and-pricing', facturacion: 'invoicing-and-tax', crecimiento: 'profitability-and-growth' },
  toolPages: {
    margen: 'profit-margin-calculator',
    precio: 'selling-price-calculator',
    rentabilidad: 'gross-and-net-margin-calculator',
    iva: 'tax-base-calculator',
    recargo: 'markup-calculator',
    descuento: 'discount-and-final-price-calculator',
    equilibrio: 'break-even-calculator',
    roi: 'roi-calculator',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Margins and pricing',
    kicker: 'CATEGORY',
    short: 'Margin, markup, discounts, selling price and profitability',
    description:
      'Calculators to set prices, understand the difference between margin and markup, apply discounts and analyse the profitability of your business.',
  },
  facturacion: {
    title: 'Invoicing and tax',
    kicker: 'CATEGORY',
    short: 'Tax base and tax breakdown',
    description:
      'Tools to work with the tax base and tax amount on your invoices: add or remove tax and break down several lines, using the percentage you type.',
  },

  crecimiento: {
    title: 'Profitability and growth',
    kicker: 'CATEGORY',
    short: 'Break-even point and ROI of an investment',
    description:
      'Calculators to find out how many units you need to sell to cover your fixed costs and what return an investment gives you.',
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
  recargo: {
    title: 'Markup calculator',
    menuTitle: 'Markup on cost',
    metaTitle: 'Markup calculator: selling price and margin',
    metaDescription:
      'Work out the selling price before tax when you add a markup to your cost, and compare the markup with the margin on sales. Worked examples. Free.',
    kicker: 'MARGINS AND PRICING',
    desc: 'Add a markup to your cost and see what margin on sales it represents, so you do not mix up one percentage with the other.',
    tileText: 'Go from cost to price with a markup and compare it with the margin.',
    tileCta: 'Calculate markup',
    search: 'markup on cost selling price margin profit percentage mark-up cost-plus',
    formulas: [
      ['Gross profit per unit', 'Cost × markup'],
      ['Selling price before tax', 'Cost × (1 + markup)'],
      ['Equivalent margin on sales', 'Profit ÷ selling price × 100 = markup ÷ (1 + markup)'],
      ['Markup needed for a margin', 'Margin ÷ (1 − margin)'],
    ],
    faq: [
      ['What is the difference between markup and margin?', 'Markup is calculated on the cost and margin on the selling price. With a cost of 100 and a markup of 25%, the price is 125, the profit is 25 and the margin is 20%.'],
      ['How do I convert markup to margin, and back?', 'Margin = markup ÷ (1 + markup) and markup = margin ÷ (1 − margin). A 25% markup equals a 20% margin; to reach a 25% margin you need a 33.33% markup.'],
      ['Why does a 100% markup not give a 100% margin?', 'Because doubling the cost leaves a profit equal to the cost, which is half of the price: a 50% margin. Markup can go above 100%; margin on sales never reaches it.'],
      ['Does the price it calculates include tax?', 'No. It is the selling price before tax. If you then need to add sales tax, use the selling price calculator or the tax base calculator.'],
      ['Is the profit it shows what I keep?', 'No. It is the gross profit per unit, before overheads, commissions and tax.'],
    ],
    modes: ['Apply a markup'],
    fields: [{ cost: 'Product cost', markup: 'Markup on cost' }],
  },
  descuento: {
    title: 'Discount and final price calculator',
    menuTitle: 'Discounts and final price',
    metaTitle: 'Successive discounts and final price calculator',
    metaDescription:
      'Work out the final price after one or two successive discounts, the total saving and the effective discount. With formulas and worked examples. Free.',
    kicker: 'MARGINS AND PRICING',
    desc: 'Apply one or two successive discounts and get the final price, the saving and the effective discount, without adding percentages by mistake.',
    tileText: 'Work out the final price, the saving and the real discount of one or two markdowns.',
    tileCta: 'Calculate discount',
    search: 'discount markdown final price sale saving percentage successive',
    formulas: [
      ['Final price', 'Initial price × (1 − discount 1) × (1 − discount 2)'],
      ['Total saving', 'Initial price − final price'],
      ['Effective discount', '100 − (100 − discount 1) × (100 − discount 2) ÷ 100'],
    ],
    faq: [
      ['Why do two discounts of 20% and 10% not add up to 30%?', 'Because the second applies to the price that is already reduced. With 100: 20% leaves 80, 10% of 80 is 8, and the final price is 72. The total saving is 28, an effective discount of 28%.'],
      ['Does the order of the discounts matter?', 'No. Multiplication is commutative: applying 10% first and then 20% gives the same final price. What changes is the amount taken off at each step, not the total.'],
      ['How do I work out the effective discount?', 'With 100 − (100 − d1) × (100 − d2) ÷ 100. With 20% and 10%: 100 − 80 × 90 ÷ 100 = 28%. It depends only on the percentages, not on the price.'],
      ['Can I use just one discount?', 'Yes. Leave the second discount empty or type 0 and the calculator applies only the first.'],
      ['Should I enter the price with or without tax?', 'The one you want to reduce: the percentage applies to the figure you type. The result keeps the same basis, with or without tax.'],
    ],
    modes: ['Successive discounts'],
    fields: [{ price: 'Initial price', first: 'Discount', second: 'Second discount (optional)' }],
  },
  equilibrio: {
    title: 'Break-even calculator',
    menuTitle: 'Break-even point',
    metaTitle: 'Break-even calculator: units and sales',
    metaDescription:
      'Work out how many units you must sell to cover your fixed costs, the sales needed and the contribution margin. With worked examples. Free.',
    kicker: 'PROFITABILITY AND GROWTH',
    desc: 'Find out how many units you have to sell to cover your fixed costs and what sales that means, based on the contribution margin of each unit.',
    tileText: 'Work out how many units you need to sell to start making money.',
    tileCta: 'Calculate break-even',
    search: 'break-even point breakeven fixed costs variable costs contribution margin units threshold',
    formulas: [
      ['Contribution margin per unit', 'Selling price − variable cost'],
      ['Units at break-even', 'Fixed costs ÷ contribution margin (rounded up)'],
      ['Sales at break-even', 'Rounded units × selling price'],
      ['Result at a given volume', 'Units × contribution margin − fixed costs'],
    ],
    faq: [
      ['What is the break-even point?', 'It is the sales level at which revenue equals total costs: no profit and no loss. From the next unit on, every sale adds profit.'],
      ['What is the contribution margin?', 'It is what is left of each sale after paying the variable costs of that unit. With a price of 50 and a variable cost of 30, each unit contributes 20 towards the fixed costs.'],
      ['Why is the result rounded up?', 'Because you cannot sell a fraction of a unit. If the calculation gives 437.5 units, 437 still means a loss and you need to sell 438.'],
      ['What happens if the price is equal to or below the variable cost?', 'Every unit sold earns nothing or loses money, so no volume will cover the fixed costs. The calculator warns you instead of showing an impossible figure.'],
      ['What is a fixed cost and what is a variable cost?', 'Fixed costs do not change with the units sold in the period (rent, insurance, subscriptions, fixed salaries). Variable costs do depend on them (raw materials, shipping, sales commissions). If a cost is mixed, split its fixed and variable parts.'],
    ],
    modes: ['Break-even point'],
    fields: [{ fixed: 'Fixed costs for the period', price: 'Selling price per unit', variable: 'Variable cost per unit', units: 'Units you expect to sell (optional)' }],
  },
  roi: {
    title: 'ROI calculator',
    menuTitle: 'ROI of an investment',
    metaTitle: 'ROI calculator: return on investment',
    metaDescription:
      'Work out the net profit and the ROI percentage of an investment from what you invested and the total return. With worked examples and limits. Free.',
    kicker: 'PROFITABILITY AND GROWTH',
    desc: 'Work out the net profit or loss and the ROI percentage of an investment from what you invested and what you have recovered in total.',
    tileText: 'Measure how much you have gained or lost compared with what you invested.',
    tileCta: 'Calculate ROI',
    search: 'roi return on investment profitability net profit investment percentage',
    formulas: [
      ['Net profit or loss', 'Total return − initial investment'],
      ['ROI', '(Total return − initial investment) ÷ initial investment × 100'],
      ['Return per unit invested', 'Total return ÷ initial investment'],
    ],
    faq: [
      ['What should I enter in “Total return”?', 'Everything you have recovered, including the investment. If you invested 1,000 and now have 1,300, the total return is 1,300, not 300. The calculator subtracts the investment for you.'],
      ['Are ROI and ROAS the same thing?', 'No. ROAS divides the revenue of a campaign by its advertising spend; ROI uses the net profit over what was invested. With 500 of advertising that generates 2,000 in sales the ROAS is 4, but if the goods sold cost 1,200, the profit is 300 and the ROI on that 500 is 60%.'],
      ['Is ROI an annual return?', 'No: it does not take time into account. A 30% return over three years is equivalent to 9.14% a year compounded, and 30% in one year is very different. This calculator does not annualise the result.'],
      ['What does a negative ROI mean?', 'That you recovered less than you invested. If you invest 5,000 and recover 4,000, you lose 1,000 and the ROI is −20%. An ROI of −100% means you recovered nothing.'],
      ['What happens if the initial investment is zero?', 'ROI cannot be calculated, because it would mean dividing by zero. The calculator asks for an investment greater than zero.'],
    ],
    modes: ['Return on an investment'],
    fields: [{ investment: 'Initial investment', total: 'Total return (including the investment)' }],
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
  ['markup calculator', 'recargo'],
  ['discount and final price calculator', 'descuento'],
  ['break-even calculator', 'equilibrio'],
  ['ROI calculator', 'roi'],
];
