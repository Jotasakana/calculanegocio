// Registro NEUTRAL de calculadoras y categorías: sin texto de ningún idioma ni importes de ningún país.
// Los textos viven en src/locales/<idioma>/ y las reglas fiscales en src/markets/<mercado>/.
//
// scope:
//   'universal' -> la fórmula es matemática pura; puede publicarse en cualquier idioma (con selector de moneda).
//   'fiscal'    -> depende de la normativa de un país (ver `market`); solo existe en los idiomas/mercados verificados.
//
// Tipos de campo (`kind`):
//   money  importe (≥ 0)            pct   porcentaje 0-100     rate  porcentaje sin tope (recargo)
//   qty    cantidad (≥ 0)           select  valor de una lista cerrada (`options`)

const f = (key, kind, def, options) => ({ key, kind, def, ...(options ? { options } : {}) });

export const CATEGORY_IDS = ['margenes-y-precios', 'facturacion'];

export const CATEGORY_REGISTRY = {
  'margenes-y-precios': { id: 'margenes-y-precios', tools: ['margen', 'precio', 'rentabilidad'] },
  facturacion: { id: 'facturacion', tools: ['iva'] },
};

export const TOOL_REGISTRY = {
  margen: {
    id: 'margen',
    scope: 'universal',
    category: 'margenes-y-precios',
    symbol: '%',
    article: 'margen',
    related: ['precio', 'rentabilidad'],
    modes: [
      [f('cost', 'money', 60), f('price', 'money', 100), f('quantity', 'qty', 1)],
      [f('cost', 'money', 80), f('margin', 'pct', 25), f('quantity', 'qty', 1)],
      [f('price', 'money', 150), f('margin', 'pct', 30), f('quantity', 'qty', 1)],
    ],
  },
  precio: {
    id: 'precio',
    // Incluye IVA (tipos y criterios de cada país): fiscal, solo en el mercado verificado. La aritmética del
    // margen y la comisión es universal y está en src/domain/formulas.js; una versión sin IVA podría ser universal.
    scope: 'fiscal',
    market: 'es',
    // Fuera de su mercado se ofrece una versión GENÉRICA: aplica el porcentaje que escribe la persona (ver MARKET_GENERIC).
    genericRate: true,
    category: 'margenes-y-precios',
    symbol: '€',
    article: 'precio',
    related: ['margen', 'iva', 'rentabilidad'],
    modes: [
      [f('cost', 'money', 40), f('extra', 'money', 0), f('margin', 'pct', 35), f('commission', 'pct', 0), f('discount', 'pct', 0), f('vat', 'pct', 21)],
      [f('cost', 'money', 25), f('extra', 'money', 3), f('markup', 'rate', 50), f('commission', 'pct', 0), f('discount', 'pct', 0), f('vat', 'pct', 21)],
      [f('cost', 'money', 30), f('extra', 'money', 2), f('given', 'money', 49.23), f('commission', 'pct', 15), f('vat', 'pct', 21), f('included', 'select', 'no', ['no', 'yes'])],
    ],
  },
  rentabilidad: {
    id: 'rentabilidad',
    scope: 'universal',
    category: 'margenes-y-precios',
    symbol: '↗',
    article: 'rentabilidad',
    related: ['margen', 'precio'],
    modes: [
      [f('sales', 'money', 100000), f('returns', 'money', 0), f('cogs', 'money', 60000), f('operating', 'money', 25000), f('finance', 'money', 1000), f('tax', 'money', 0)],
    ],
  },
  iva: {
    id: 'iva',
    // Los tipos de IVA, su aplicación y el redondeo de facturas son normativa de cada país: fiscal.
    scope: 'fiscal',
    market: 'es',
    genericRate: true,
    category: 'facturacion',
    symbol: '≡',
    article: 'iva',
    related: ['precio', 'margen'],
    modes: [
      [f('base', 'money', 1250), f('vat', 'pct', 21)],
      [f('total', 'money', 605), f('vat', 'pct', 21)],
      [f('qty1', 'qty', 3), f('unit1', 'money', 120), f('disc1', 'pct', 10), f('vat1', 'pct', 21), f('qty2', 'qty', 1), f('unit2', 'money', 450), f('vat2', 'pct', 21), f('qty3', 'qty', 12), f('unit3', 'money', 8.5), f('vat3', 'pct', 10)],
    ],
  },
};

export const TOOL_IDS = Object.keys(TOOL_REGISTRY);

/** Tipos de campo cuyo valor no es un número. */
export const isNumericKind = (kind) => kind !== 'select';
