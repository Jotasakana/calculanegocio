// Textos en español de las calculadoras y categorías (sin lógica). Las claves coinciden con src/domain/registry.js.
// Las etiquetas de los campos NO llevan la unidad: la añade la capa de presentación según el tipo de campo
// y la moneda elegida ("Coste de compra" + € -> "Coste de compra (€)").

export const slugs = {
  tools: 'herramientas',
  methodology: 'metodologia',
  categories: { 'margenes-y-precios': 'margenes-y-precios', facturacion: 'facturacion' },
  toolPages: {
    margen: 'calculadora-margen-comercial',
    precio: 'calculadora-precio-de-venta',
    rentabilidad: 'margen-bruto-y-margen-neto',
    iva: 'calculadora-base-imponible',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Márgenes y precios',
    kicker: 'CATEGORÍA',
    short: 'Cálculo del margen, el recargo, el precio de venta y la rentabilidad',
    description:
      'Calculadoras para fijar precios, entender la diferencia entre margen y recargo y analizar la rentabilidad de tu negocio.',
  },
  facturacion: {
    title: 'Facturación',
    kicker: 'CATEGORÍA',
    short: 'Base imponible y desglose del IVA',
    description:
      'Herramientas para trabajar con la base imponible y el IVA de tus facturas: añadir o quitar IVA y desglosar varias líneas.',
  },
};

export const tools = {
  margen: {
    title: 'Calculadora de margen comercial',
    menuTitle: 'Margen comercial',
    metaTitle: 'Calculadora de margen comercial y recargo',
    metaDescription:
      'Calcula el margen sobre ventas, el recargo sobre coste y el beneficio por unidad. Con fórmulas, ejemplos resueltos y errores frecuentes. Gratis y sin registro.',
    kicker: 'MÁRGENES Y PRECIOS',
    desc: 'Calcula cuánto ganas por venta, el margen sobre el precio y el recargo sobre tu coste, sin mezclar el IVA.',
    tileText: 'Descubre cuánto ganas por producto y la diferencia entre margen y recargo.',
    tileCta: 'Calcular margen',
    search: 'margen comercial recargo beneficio porcentaje markup',
    formulas: [
      ['Beneficio', 'Precio de venta − coste'],
      ['Margen sobre ventas', 'Beneficio ÷ precio de venta × 100'],
      ['Recargo sobre coste', 'Beneficio ÷ coste × 100'],
    ],
    faq: [
      ['¿Cuál es la diferencia entre margen y recargo?', 'El margen se calcula sobre el precio de venta y el recargo sobre el coste. Con un coste de 60 € y un precio de 100 €, el beneficio es de 40 €: un margen del 40 % y un recargo del 66,67 %.'],
      ['¿El margen incluye el IVA?', 'No. Los importes se introducen sin IVA, porque el IVA no es ni un coste ni un beneficio de tu negocio.'],
      ['¿Qué significa que el margen sea negativo?', 'Que vendes por debajo del coste: el beneficio por unidad es negativo y la calculadora te lo advierte.'],
      ['¿Puedo calcular el precio a partir de un margen?', 'Sí. Usa la pestaña «Quiero un margen» con el coste y el margen deseado. Si ya tienes el precio y buscas el coste máximo, usa «Coste máximo».'],
    ],
    modes: ['Tengo coste y precio', 'Quiero un margen', 'Coste máximo'],
    fields: [
      { cost: 'Coste de compra', price: 'Precio sin IVA', quantity: 'Cantidad' },
      { cost: 'Coste unitario', margin: 'Margen deseado', quantity: 'Cantidad' },
      { price: 'Precio sin IVA', margin: 'Margen deseado', quantity: 'Cantidad' },
    ],
  },
  precio: {
    title: 'Calculadora de precio de venta',
    menuTitle: 'Precio de venta',
    metaTitle: 'Calculadora de precio de venta con IVA y comisión',
    metaDescription:
      'Calcula el precio de venta de un producto a partir del coste, el margen o el recargo, la comisión, el descuento y el IVA. Con ejemplos resueltos. Gratis.',
    kicker: 'PRECIOS Y MÁRGENES',
    desc: 'Fija el precio de venta con margen o recargo y comprueba el efecto de comisiones, descuentos y del IVA.',
    tileText: 'Calcula un precio desde tus costes, el margen, los descuentos y el IVA.',
    tileCta: 'Calcular precio',
    search: 'pvp precio de venta descuento coste comisiones',
    formulas: [
      ['Coste total', 'Coste unitario + costes adicionales'],
      ['Precio sin IVA (margen objetivo)', 'Coste total ÷ (1 − comisión − margen)'],
      ['Precio sin IVA (recargo)', 'Coste total × (1 + recargo)'],
      ['PVP', 'Precio sin IVA × (1 + IVA)'],
    ],
    faq: [
      ['¿El margen se calcula sobre el coste o sobre el precio?', 'En «Margen objetivo» se calcula sobre el precio de venta sin IVA. Si prefieres un porcentaje sobre el coste, usa «Recargo sobre coste».'],
      ['¿Qué incluyo en «Costes adicionales»?', 'Cualquier coste que pagues por cada unidad vendida y que no esté ya en el coste unitario: envío, embalaje, personalización…'],
      ['¿Por qué sube tanto el precio al añadir una comisión?', 'Porque la comisión se paga sobre el precio de venta, no sobre el coste. Margen y comisión se restan juntos del 100 % del precio, así que su suma debe ser inferior al 100 %.'],
      ['¿Puedo analizar un precio que ya tengo?', 'Sí, con «Analizar un precio»: indicas el precio, si incluye IVA, el coste y la comisión, y la calculadora muestra el margen real que deja.'],
    ],
    modes: ['Margen objetivo', 'Recargo sobre coste', 'Analizar un precio'],
    fields: [
      { cost: 'Coste unitario', extra: 'Costes adicionales', margin: 'Margen deseado', commission: 'Comisión', discount: 'Descuento previsto', vat: 'IVA' },
      { cost: 'Coste unitario', extra: 'Costes adicionales', markup: 'Recargo', commission: 'Comisión', discount: 'Descuento previsto', vat: 'IVA' },
      { cost: 'Coste unitario', extra: 'Costes adicionales', given: 'Precio de venta introducido', commission: 'Comisión', vat: 'IVA', included: 'Precio introducido con IVA' },
    ],
  },
  rentabilidad: {
    title: 'Calculadora de margen bruto y neto',
    menuTitle: 'Margen bruto y neto',
    metaTitle: 'Margen bruto y margen neto: calculadora',
    metaDescription:
      'Calcula el margen bruto, operativo y neto de tu negocio a partir de ventas, costes y gastos del mismo período. Con ejemplos resueltos. Gratis y sin registro.',
    kicker: 'RENTABILIDAD DEL NEGOCIO',
    desc: 'Desglosa tus ventas, costes y gastos del mismo período para conocer el margen bruto, operativo y neto.',
    tileText: 'Analiza ingresos, costes, gastos y rentabilidad de tu actividad.',
    tileCta: 'Ver rentabilidad',
    search: 'margen bruto neto gastos beneficio rentabilidad',
    formulas: [
      ['Ventas netas', 'Ventas − devoluciones y descuentos'],
      ['Margen bruto', '(Ventas netas − coste de ventas) ÷ ventas netas × 100'],
      ['Resultado operativo', 'Ventas netas − coste de ventas − gastos de operación'],
      ['Beneficio neto', 'Resultado operativo − gastos financieros − impuesto sobre beneficios'],
    ],
    faq: [
      ['¿Qué son las ventas netas?', 'Las ventas del período menos las devoluciones y descuentos. Es la base sobre la que se calculan todos los porcentajes.'],
      ['¿Margen bruto y margen comercial son lo mismo?', 'No. El margen comercial se calcula por producto con su precio y su coste; el margen bruto es el de todo el negocio en un período, sobre las ventas netas.'],
      ['¿Qué incluyo en los gastos de operación?', 'Los gastos de funcionamiento del período que no son coste de ventas: alquiler, suministros, personal, publicidad… Usa siempre importes del mismo período.'],
      ['¿Puede salir un resultado negativo?', 'Sí. Si los costes y gastos superan las ventas, el resultado es una pérdida y la calculadora lo muestra con signo negativo.'],
    ],
    modes: ['Resultado del período'],
    fields: [
      { sales: 'Ventas del período', returns: 'Devoluciones y descuentos', cogs: 'Coste de ventas', operating: 'Gastos de operación', finance: 'Gastos financieros', tax: 'Impuesto sobre beneficios' },
    ],
  },
  iva: {
    title: 'Calculadora de base imponible',
    menuTitle: 'Base imponible e IVA',
    metaTitle: 'Calculadora de base imponible: añadir y quitar IVA',
    metaDescription:
      'Calcula la base imponible a partir de un total con IVA, añade IVA a una base o desglosa una factura con varias líneas. Con ejemplos resueltos. Gratis.',
    kicker: 'FACTURACIÓN',
    desc: 'Obtén el IVA y el total a partir de la base, o averigua la base imponible cuando el importe ya incluye IVA.',
    tileText: 'Añade o quita IVA y revisa el desglose de importes.',
    tileCta: 'Calcular IVA',
    search: 'iva base imponible quitar añadir impuestos factura',
    formulas: [
      ['IVA', 'Base imponible × tipo de IVA'],
      ['Total', 'Base imponible + IVA'],
      ['Base desde el total', 'Total ÷ (1 + tipo de IVA)'],
    ],
    faq: [
      ['¿Qué es la base imponible?', 'Es el importe de la operación antes de aplicar el IVA, ya con los descuentos que reduzcan el precio.'],
      ['¿Cómo quito el IVA a un importe?', 'Divide el total entre 1 más el tipo de IVA expresado como fracción: con un 21 %, entre 1,21. La pestaña «Quitar IVA» lo hace por ti.'],
      ['¿Cómo se redondea?', 'Los cálculos se hacen en céntimos y la cuota se redondea al céntimo más próximo, de modo que base más cuota siempre suman el total.'],
      ['¿Esta calculadora me dice qué tipo de IVA aplicar?', 'No. Aplica el tipo que tú introduces; cuál corresponde a cada operación depende de la normativa y de cada caso.'],
    ],
    modes: ['Añadir IVA', 'Quitar IVA', 'Varias líneas'],
    fields: [
      { base: 'Base imponible', vat: 'Tipo de IVA' },
      { total: 'Total con IVA', vat: 'Tipo de IVA' },
      { qty1: 'Cantidad línea 1', unit1: 'Precio unitario línea 1', disc1: 'Descuento línea 1', vat1: 'IVA línea 1', qty2: 'Cantidad línea 2', unit2: 'Precio unitario línea 2', vat2: 'IVA línea 2', qty3: 'Cantidad línea 3', unit3: 'Precio unitario línea 3', vat3: 'IVA línea 3' },
    ],
  },
};

/** Etiquetas de los valores de los campos de lista cerrada. */
export const selectOptions = { included: { no: 'No', yes: 'Sí' } };

/** Frases del texto editorial que se enlazan automáticamente a su calculadora. */
export const autolinkPhrases = [
  ['calculadora de margen comercial', 'margen'],
  ['calculadora de precio de venta', 'precio'],
  ['calculadora de margen bruto y margen neto', 'rentabilidad'],
  ['calculadora de base imponible', 'iva'],
];
