// Fuente única de verdad: URLs, categorías y especificación de las calculadoras.
// Cambiar una URL aquí actualiza menús, hubs, sitemap, buscador y enlaces internos.
// Las URLs siguen el Plan Maestro SEO: calculadoras directamente bajo /es/.

export const PAGES = {
  home: { path: '/', title: 'Inicio' },
  tools: { path: '/es/herramientas/', title: 'Calculadoras' },
  methodology: { path: '/es/metodologia/', title: 'Metodología' },
};

export const CATEGORIES = {
  'margenes-y-precios': {
    id: 'margenes-y-precios',
    path: '/es/margenes-y-precios/',
    title: 'Márgenes y precios',
    kicker: 'CATEGORÍA',
    short: 'Cálculo del margen, el recargo, el precio de venta y la rentabilidad',
    description:
      'Calculadoras para fijar precios, entender la diferencia entre margen y recargo y analizar la rentabilidad de tu negocio.',
    tools: ['margen', 'precio', 'rentabilidad'],
  },
  facturacion: {
    id: 'facturacion',
    path: '/es/facturacion/',
    title: 'Facturación',
    kicker: 'CATEGORÍA',
    short: 'Base imponible y desglose del IVA',
    description:
      'Herramientas para trabajar con la base imponible y el IVA de tus facturas: añadir o quitar IVA y desglosar varias líneas.',
    tools: ['iva'],
  },
};

const percent = 'Los porcentajes se introducen sin el símbolo %.';

export const TOOLS = {
  margen: {
    id: 'margen',
    path: '/es/calculadora-margen-comercial/',
    category: 'margenes-y-precios',
    title: 'Calculadora de margen comercial',
    menuTitle: 'Margen comercial',
    metaTitle: 'Calculadora de margen comercial y recargo',
    metaDescription:
      'Calcula el margen sobre ventas, el recargo sobre coste y el beneficio por unidad. Con fórmulas, ejemplos resueltos y errores frecuentes. Gratis y sin registro.',
    kicker: 'MÁRGENES Y PRECIOS',
    desc: 'Calcula cuánto ganas por venta, el margen sobre el precio y el recargo sobre tu coste, sin mezclar el IVA.',
    tileText: 'Descubre cuánto ganas por producto y la diferencia entre margen y recargo.',
    tileCta: 'Calcular margen',
    symbol: '%',
    article: 'margen',
    related: ['precio', 'rentabilidad'],
    modes: ['Tengo coste y precio', 'Quiero un margen', 'Coste máximo'],
    fields: [
      [['cost', 'Coste de compra (€)', 60], ['price', 'Precio sin IVA (€)', 100], ['quantity', 'Cantidad', 1]],
      [['cost', 'Coste unitario (€)', 80], ['margin', 'Margen deseado (%)', 25], ['quantity', 'Cantidad', 1]],
      [['price', 'Precio sin IVA (€)', 150], ['margin', 'Margen deseado (%)', 30], ['quantity', 'Cantidad', 1]],
    ],
    search: 'margen comercial recargo beneficio porcentaje markup',
  },
  precio: {
    id: 'precio',
    path: '/es/calculadora-precio-de-venta/',
    category: 'margenes-y-precios',
    title: 'Calculadora de precio de venta',
    menuTitle: 'Precio de venta',
    metaTitle: 'Calculadora de precio de venta con IVA y comisión',
    metaDescription:
      'Calcula el precio de venta de un producto a partir del coste, el margen o el recargo, la comisión, el descuento y el IVA. Con ejemplos resueltos. Gratis.',
    kicker: 'PRECIOS Y MÁRGENES',
    desc: 'Fija el precio de venta con margen o recargo y comprueba el efecto de comisiones, descuentos y del IVA.',
    tileText: 'Calcula un precio desde tus costes, el margen, los descuentos y el IVA.',
    tileCta: 'Calcular precio',
    symbol: '€',
    article: 'precio',
    related: ['margen', 'iva', 'rentabilidad'],
    modes: ['Margen objetivo', 'Recargo sobre coste', 'Analizar un precio'],
    fields: [
      [['cost', 'Coste unitario (€)', 40], ['extra', 'Costes adicionales (€)', 0], ['margin', 'Margen deseado (%)', 35], ['commission', 'Comisión (%)', 0], ['discount', 'Descuento previsto (%)', 0], ['vat', 'IVA (%)', 21]],
      [['cost', 'Coste unitario (€)', 25], ['extra', 'Costes adicionales (€)', 3], ['markup', 'Recargo (%)', 50], ['commission', 'Comisión (%)', 0], ['discount', 'Descuento previsto (%)', 0], ['vat', 'IVA (%)', 21]],
      [['cost', 'Coste unitario (€)', 30], ['extra', 'Costes adicionales (€)', 2], ['given', 'Precio de venta introducido (€)', 49.23], ['commission', 'Comisión (%)', 15], ['vat', 'IVA (%)', 21], ['included', 'Precio introducido con IVA', 'No', 'select']],
    ],
    search: 'pvp precio de venta descuento coste comisiones',
  },
  rentabilidad: {
    id: 'rentabilidad',
    path: '/es/margen-bruto-y-margen-neto/',
    category: 'margenes-y-precios',
    title: 'Calculadora de margen bruto y neto',
    menuTitle: 'Margen bruto y neto',
    metaTitle: 'Margen bruto y margen neto: calculadora',
    metaDescription:
      'Calcula el margen bruto, operativo y neto de tu negocio a partir de ventas, costes y gastos del mismo período. Con ejemplos resueltos. Gratis y sin registro.',
    kicker: 'RENTABILIDAD DEL NEGOCIO',
    desc: 'Desglosa tus ventas, costes y gastos del mismo período para conocer el margen bruto, operativo y neto.',
    tileText: 'Analiza ingresos, costes, gastos y rentabilidad de tu actividad.',
    tileCta: 'Ver rentabilidad',
    symbol: '↗',
    article: 'rentabilidad',
    related: ['margen', 'precio'],
    modes: ['Resultado del período'],
    fields: [
      [['sales', 'Ventas del período (€)', 100000], ['returns', 'Devoluciones y descuentos (€)', 0], ['cogs', 'Coste de ventas (€)', 60000], ['operating', 'Gastos de operación (€)', 25000], ['finance', 'Gastos financieros (€)', 1000], ['tax', 'Impuesto sobre beneficios (€)', 0]],
    ],
    search: 'margen bruto neto gastos beneficio rentabilidad',
  },
  iva: {
    id: 'iva',
    path: '/es/calculadora-base-imponible/',
    category: 'facturacion',
    title: 'Calculadora de base imponible',
    menuTitle: 'Base imponible e IVA',
    metaTitle: 'Calculadora de base imponible: añadir y quitar IVA',
    metaDescription:
      'Calcula la base imponible a partir de un total con IVA, añade IVA a una base o desglosa una factura con varias líneas. Con ejemplos resueltos. Gratis.',
    kicker: 'FACTURACIÓN',
    desc: 'Obtén el IVA y el total a partir de la base, o averigua la base imponible cuando el importe ya incluye IVA.',
    tileText: 'Añade o quita IVA y revisa el desglose de importes.',
    tileCta: 'Calcular IVA',
    symbol: '≡',
    article: 'iva',
    related: ['precio', 'margen'],
    modes: ['Añadir IVA', 'Quitar IVA', 'Varias líneas'],
    fields: [
      [['base', 'Base imponible (€)', 1250], ['vat', 'Tipo de IVA (%)', 21]],
      [['total', 'Total con IVA (€)', 605], ['vat', 'Tipo de IVA (%)', 21]],
      [['qty1', 'Cantidad línea 1', 3], ['unit1', 'Precio unitario línea 1 (€)', 120], ['disc1', 'Descuento línea 1 (%)', 10], ['vat1', 'IVA línea 1 (%)', 21], ['qty2', 'Cantidad línea 2', 1], ['unit2', 'Precio unitario línea 2 (€)', 450], ['vat2', 'IVA línea 2 (%)', 21], ['qty3', 'Cantidad línea 3', 12], ['unit3', 'Precio unitario línea 3 (€)', 8.5], ['vat3', 'IVA línea 3 (%)', 10]],
    ],
    search: 'iva base imponible quitar añadir impuestos factura',
  },
};

export const TOOL_LIST = Object.values(TOOLS);
export const CATEGORY_LIST = Object.values(CATEGORIES);

/** Páginas indexables del sitio (para sitemap). */
export function allPaths() {
  return [
    PAGES.home.path,
    PAGES.tools.path,
    PAGES.methodology.path,
    ...CATEGORY_LIST.map((c) => c.path),
    ...TOOL_LIST.map((t) => t.path),
  ];
}

/** Frases del texto editorial que se enlazan automáticamente a su calculadora. */
export const AUTOLINK_PHRASES = [
  ['calculadora de margen comercial', 'margen'],
  ['calculadora de precio de venta', 'precio'],
  ['calculadora de margen bruto y margen neto', 'rentabilidad'],
  ['calculadora de base imponible', 'iva'],
];
