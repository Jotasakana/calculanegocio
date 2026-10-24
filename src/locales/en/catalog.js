// Catalogue in English: categories with no available calculator yet and the text of calculators IN DEVELOPMENT.
// Keys match src/domain/catalog.js. Country-specific tax tools (withholding on invoices, retail surcharge) are not
// offered in English and therefore have no entry here.

export const catalog = {
  categories: {
    crecimiento: {
      title: 'Profitability and growth',
      short: 'Percentage change, break-even, ROI and advertising',
    },
    finanzas: {
      title: 'Business finance',
      short: 'Loans, depreciation, stock and cash reserves',
    },
  },
  planned: {
    recargo: { title: 'Markup on cost', desc: 'Convert between markup and margin without mixing them up.', search: 'markup cost margin percentage' },
    descuento: { title: 'Discounts and final price', desc: 'Apply one or several discounts and check the margin you keep.', search: 'discount sale final price offer' },
    marketplace: { title: 'Marketplace fees', desc: 'Work out the minimum price to sell on a platform without losing margin.', search: 'marketplace fee commission platform online selling' },
    hora: { title: 'Hourly rate', desc: 'Estimate what to charge per hour from your costs and billable hours.', search: 'hourly rate freelance fees pricing billable hours' },
    variacion: { title: 'Percentage change', desc: 'Compare two periods and measure how much a figure went up or down.', search: 'percentage change increase decrease growth' },
    equilibrio: { title: 'Break-even point', desc: 'Find out how many units you must sell to cover your fixed costs.', search: 'break-even point fixed costs units profitability' },
    roi: { title: 'Return on investment (ROI)', desc: 'Measure the return on an investment relative to what you put in.', search: 'roi return on investment profitability' },
    roas: { title: 'Ad campaign return (ROAS)', desc: 'See the revenue you earn for every unit spent on advertising (ROAS).', search: 'roas advertising campaign ads return' },
    prestamo: { title: 'Loan payment', desc: 'Calculate the periodic payment, the interest and the total to repay.', search: 'loan payment interest credit financing' },
    amortizacion: { title: 'Straight-line depreciation', desc: 'Spread the cost of an asset over its useful life.', search: 'straight-line depreciation asset useful life amortization' },
    stock: { title: 'Stock turnover', desc: 'Measure how many times you renew your inventory in a period.', search: 'stock turnover inventory' },
    tesoreria: { title: 'Cash reserve', desc: 'Calculate how many months of expenses your available cash covers.', search: 'cash reserve runway liquidity months expenses' },
  },
};
