// Catalogue in English: categories with no available calculator yet and the text of calculators IN DEVELOPMENT.
// Keys match src/domain/catalog.js. Country-specific tax tools (withholding on invoices, retail surcharge) are not
// offered in English and therefore have no entry here.

export const catalog = {
  categories: {
    finanzas: {
      title: 'Business finance',
      short: 'Loans, depreciation, stock and cash reserves',
    },
  },
  planned: {
    marketplace: { title: 'Marketplace fees', desc: 'Work out the minimum price to sell on a platform without losing margin.', search: 'marketplace fee commission platform online selling' },
    hora: { title: 'Hourly rate', desc: 'Estimate what to charge per hour from your costs and billable hours.', search: 'hourly rate freelance fees pricing billable hours' },
    variacion: { title: 'Percentage change', desc: 'Compare two periods and measure how much a figure went up or down.', search: 'percentage change increase decrease growth' },
    roas: { title: 'Ad campaign return (ROAS)', desc: 'See the revenue you earn for every unit spent on advertising (ROAS).', search: 'roas advertising campaign ads return' },
    prestamo: { title: 'Loan payment', desc: 'Calculate the periodic payment, the interest and the total to repay.', search: 'loan payment interest credit financing' },
    amortizacion: { title: 'Straight-line depreciation', desc: 'Spread the cost of an asset over its useful life.', search: 'straight-line depreciation asset useful life amortization' },
    stock: { title: 'Stock turnover', desc: 'Measure how many times you renew your inventory in a period.', search: 'stock turnover inventory' },
    tesoreria: { title: 'Cash reserve', desc: 'Calculate how many months of expenses your available cash covers.', search: 'cash reserve runway liquidity months expenses' },
  },
};
