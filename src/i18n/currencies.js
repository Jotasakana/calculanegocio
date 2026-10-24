// Monedas que se ofrecen en el selector de las calculadoras universales. La moneda NO depende del idioma.
// Lista inicial, ampliable; los nombres salen de Intl.DisplayNames en el idioma de la página.
export const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'CAD', 'AUD', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'BRL', 'INR', 'IDR', 'JPY', 'CNY', 'AED', 'SAR', 'EGP', 'MAD'];

export function currencyOptions(intl) {
  let names = null;
  try { names = new Intl.DisplayNames(intl, { type: 'currency' }); } catch { /* sin nombres: se muestra el código */ }
  return CURRENCIES.map((code) => ({ code, label: names ? `${code} · ${names.of(code)}` : code }));
}
