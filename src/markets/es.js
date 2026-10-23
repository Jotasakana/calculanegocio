// Configuración del mercado fiscal de España. Solo contiene lo que ya usan las calculadoras.
// Pendiente antes de publicar (no verificado en esta fase): validar los tipos con fuentes oficiales
// (Agencia Tributaria) y registrar aquí `sources` y `verifiedAt`. Hasta entonces, `verified: false`.

export const MARKET_ES = {
  id: 'es',
  country: 'ES',
  locales: ['es'],
  currency: 'EUR',
  verified: false,
  sources: [],
  verifiedAt: null,
  vat: {
    // Valores iniciales de los campos de IVA de las calculadoras (los mismos del prototipo aprobado).
    defaultRate: 21,
    exampleReducedRate: 10,
  },
};

export const MARKETS = { es: MARKET_ES };
