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
//
// Campo OPCIONAL (`optional: true`, ver `fo`): si la persona lo deja vacío, la fórmula recibe `null` en vez de un error
// de número inválido (p. ej. el segundo descuento o las unidades esperadas). Un cero escrito sigue siendo un cero.

const f = (key, kind, def, options) => ({ key, kind, def, ...(options ? { options } : {}) });
const fo = (key, kind, def) => ({ ...f(key, kind, def), optional: true });

export const CATEGORY_IDS = ['margenes-y-precios', 'facturacion', 'crecimiento'];

export const CATEGORY_REGISTRY = {
  'margenes-y-precios': { id: 'margenes-y-precios', tools: ['margen', 'precio', 'recargo', 'descuento', 'rentabilidad'] },
  facturacion: { id: 'facturacion', tools: ['iva'] },
  crecimiento: { id: 'crecimiento', tools: ['equilibrio', 'roi'] },
};

export const TOOL_REGISTRY = {
  margen: {
    id: 'margen',
    scope: 'universal',
    category: 'margenes-y-precios',
    symbol: '%',
    article: 'margen',
    related: ['recargo', 'precio', 'rentabilidad'],
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
    related: ['margen', 'recargo', 'descuento', 'iva'],
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
    related: ['margen', 'precio', 'equilibrio'],
    modes: [
      [f('sales', 'money', 100000), f('returns', 'money', 0), f('cogs', 'money', 60000), f('operating', 'money', 25000), f('finance', 'money', 1000), f('tax', 'money', 0)],
    ],
  },
  recargo: {
    id: 'recargo',
    scope: 'universal',
    bounded: true, // aplica los límites del modelo (MODEL_LIMITS en formulas.js)
    category: 'margenes-y-precios',
    symbol: '+%',
    article: 'recargo',
    related: ['margen', 'precio', 'descuento'],
    modes: [[f('cost', 'money', 100), f('markup', 'rate', 25)]],
  },
  descuento: {
    id: 'descuento',
    scope: 'universal',
    bounded: true, // aplica los límites del modelo (MODEL_LIMITS en formulas.js)
    category: 'margenes-y-precios',
    symbol: '-%',
    article: 'descuento',
    related: ['precio', 'margen', 'recargo'],
    // El segundo descuento es opcional: vacío o 0 = un solo descuento.
    modes: [[f('price', 'money', 100), f('first', 'pct', 20), fo('second', 'pct', 10)]],
  },
  equilibrio: {
    id: 'equilibrio',
    scope: 'universal',
    bounded: true, // aplica los límites del modelo (MODEL_LIMITS en formulas.js)
    category: 'crecimiento',
    symbol: '=',
    article: 'equilibrio',
    related: ['margen', 'rentabilidad', 'roi', 'precio'],
    // Las unidades esperadas son opcionales: vacío = no se calcula el resultado esperado.
    modes: [[f('fixed', 'money', 2000), f('price', 'money', 50), f('variable', 'money', 30), fo('units', 'qty', 150)]],
  },
  roi: {
    id: 'roi',
    scope: 'universal',
    bounded: true, // aplica los límites del modelo (MODEL_LIMITS en formulas.js)
    category: 'crecimiento',
    symbol: '%',
    article: 'roi',
    related: ['rentabilidad', 'equilibrio', 'margen'],
    modes: [[f('investment', 'money', 1000), f('total', 'money', 1300)]],
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
      [f('qty1', 'qty', 3), f('unit1', 'money', 120), f('disc1', 'pct', 10), f('vat1', 'pct', 21), fo('qty2', 'qty', 1), f('unit2', 'money', 450), f('vat2', 'pct', 21), fo('qty3', 'qty', 12), f('unit3', 'money', 8.5), f('vat3', 'pct', 10)],
    ],
  },
};

export const TOOL_IDS = Object.keys(TOOL_REGISTRY);

/** Tipos de campo cuyo valor no es un número. */
export const isNumericKind = (kind) => kind !== 'select';
