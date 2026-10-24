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

// Mercado GENÉRICO: no es un país. Reúne los idiomas en los que las calculadoras de impuestos indirectos se ofrecen
// como aritmética de porcentajes (el usuario escribe el tipo; no se asume ninguna norma, tipo ni obligación local).
// Solo aplica a las calculadoras del registro marcadas con `genericRate: true`. Moneda: la elige la persona (o la del idioma).
export const MARKET_GENERIC = {
  id: 'generic',
  kind: 'generic',
  country: null,
  locales: ['en', 'pt-br'],
  currency: null,
  verified: false,
  sources: [],
  verifiedAt: null,
};

export const MARKETS = { es: MARKET_ES, generic: MARKET_GENERIC };
