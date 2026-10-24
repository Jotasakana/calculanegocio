// Textos en español de las calculadoras y categorías (sin lógica). Las claves coinciden con src/domain/registry.js.
// Las etiquetas de los campos NO llevan la unidad: la añade la capa de presentación según el tipo de campo
// y la moneda elegida ("Coste de compra" + € -> "Coste de compra (€)").

export const slugs = {
  tools: 'herramientas',
  methodology: 'metodologia',
  categories: { 'margenes-y-precios': 'margenes-y-precios', facturacion: 'facturacion', crecimiento: 'rentabilidad-y-crecimiento' },
  toolPages: {
    margen: 'calculadora-margen-comercial',
    precio: 'calculadora-precio-de-venta',
    rentabilidad: 'margen-bruto-y-margen-neto',
    iva: 'calculadora-base-imponible',
    recargo: 'calculadora-recargo-sobre-coste',
    descuento: 'calculadora-descuentos-y-precio-final',
    equilibrio: 'calculadora-punto-de-equilibrio',
    roi: 'calculadora-roi',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Márgenes y precios',
    kicker: 'CATEGORÍA',
    short: 'Margen, recargo, descuentos, precio de venta y rentabilidad',
    description:
      'Calculadoras para fijar precios, entender la diferencia entre margen y recargo, aplicar descuentos y analizar la rentabilidad de tu negocio.',
  },
  facturacion: {
    title: 'Facturación',
    kicker: 'CATEGORÍA',
    short: 'Base imponible y desglose del IVA',
    description:
      'Herramientas para trabajar con la base imponible y el IVA de tus facturas: añadir o quitar IVA y desglosar varias líneas.',
  },

  crecimiento: {
    title: 'Rentabilidad y crecimiento',
    kicker: 'CATEGORÍA',
    short: 'Variación, punto de equilibrio, ROI y publicidad',
    description:
      'Calculadoras para saber cuántas unidades necesitas vender para cubrir tus costes fijos y qué retorno te deja una inversión.',
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
  recargo: {
    title: 'Calculadora de recargo sobre coste',
    menuTitle: 'Recargo sobre coste',
    metaTitle: 'Calculadora de recargo sobre coste y margen',
    metaDescription:
      'Calcula el precio de venta sin impuestos al aplicar un recargo sobre el coste y compáralo con el margen sobre ventas. Con ejemplos resueltos. Gratis.',
    kicker: 'MÁRGENES Y PRECIOS',
    desc: 'Aplica un recargo a tu coste y comprueba qué margen sobre ventas representa, para no confundir un porcentaje con el otro.',
    tileText: 'Pasa del coste al precio con un recargo y compáralo con el margen.',
    tileCta: 'Calcular recargo',
    search: 'recargo sobre coste markup precio de venta margen beneficio porcentaje',
    formulas: [
      ['Beneficio bruto por unidad', 'Coste × recargo'],
      ['Precio de venta sin impuestos', 'Coste × (1 + recargo)'],
      ['Margen sobre ventas equivalente', 'Beneficio ÷ precio de venta × 100 = recargo ÷ (1 + recargo)'],
      ['Recargo necesario para un margen', 'Margen ÷ (1 − margen)'],
    ],
    faq: [
      ['¿Qué diferencia hay entre recargo y margen?', 'El recargo se calcula sobre el coste y el margen sobre el precio de venta. Con un coste de 100 € y un recargo del 25 %, el precio es 125 €, el beneficio es 25 € y el margen es del 20 %.'],
      ['¿Cómo paso de recargo a margen, y al revés?', 'Margen = recargo ÷ (1 + recargo) y recargo = margen ÷ (1 − margen). Un recargo del 25 % equivale a un margen del 20 %; para conseguir un margen del 25 % hace falta un recargo del 33,33 %.'],
      ['¿Por qué un recargo del 100 % no da un margen del 100 %?', 'Porque duplicar el coste deja un beneficio igual al coste, que es la mitad del precio: un margen del 50 %. El recargo puede superar el 100 %; el margen sobre ventas nunca llega a él.'],
      ['¿El precio que calcula incluye IVA?', 'No. Es el precio de venta antes de impuestos. Si después necesitas añadir IVA, usa la calculadora de precio de venta o la de base imponible.'],
      ['¿El beneficio calculado es lo que me queda?', 'No. Es el beneficio bruto por unidad, antes de gastos generales, comisiones e impuestos.'],
    ],
    modes: ['Aplicar un recargo'],
    fields: [{ cost: 'Coste del producto', markup: 'Recargo sobre coste' }],
  },
  descuento: {
    title: 'Calculadora de descuentos y precio final',
    menuTitle: 'Descuentos y precio final',
    metaTitle: 'Calculadora de descuentos sucesivos y precio final',
    metaDescription:
      'Calcula el precio final tras uno o dos descuentos sucesivos, el ahorro total y el descuento efectivo. Con fórmulas y ejemplos resueltos. Gratis.',
    kicker: 'MÁRGENES Y PRECIOS',
    desc: 'Aplica uno o dos descuentos sucesivos y obtén el precio final, el ahorro y el descuento efectivo, sin sumar porcentajes por error.',
    tileText: 'Calcula el precio final, el ahorro y el descuento real de una o dos rebajas.',
    tileCta: 'Calcular descuento',
    search: 'descuento rebaja precio final oferta ahorro porcentaje sucesivo',
    formulas: [
      ['Precio final', 'Precio inicial × (1 − descuento 1) × (1 − descuento 2)'],
      ['Ahorro total', 'Precio inicial − precio final'],
      ['Descuento efectivo', '100 − (100 − descuento 1) × (100 − descuento 2) ÷ 100'],
    ],
    faq: [
      ['¿Por qué dos descuentos del 20 % y del 10 % no suman un 30 %?', 'Porque el segundo se aplica sobre el precio ya rebajado. Con 100 €: el 20 % deja 80 €, el 10 % de 80 € son 8 € y el precio final es 72 €. El ahorro total es 28 €, un descuento efectivo del 28 %.'],
      ['¿Importa el orden de los descuentos?', 'No. Multiplicar es conmutativo: aplicar primero el 10 % y después el 20 % da el mismo precio final. Lo que cambia es la rebaja en euros de cada paso, no el total.'],
      ['¿Cómo calculo el descuento efectivo?', 'Con 100 − (100 − d1) × (100 − d2) ÷ 100. Con un 20 % y un 10 %: 100 − 80 × 90 ÷ 100 = 28 %. Solo depende de los porcentajes, no del precio.'],
      ['¿Puedo usar un solo descuento?', 'Sí. Deja vacío el segundo descuento o escribe 0 y la calculadora aplicará solo el primero.'],
      ['¿Introduzco el precio con IVA o sin IVA?', 'El que quieras rebajar: el porcentaje se aplica sobre la cifra que escribas. El resultado conserva la misma base, con o sin IVA.'],
    ],
    modes: ['Descuentos sucesivos'],
    fields: [{ price: 'Precio inicial', first: 'Descuento', second: 'Segundo descuento (opcional)' }],
  },
  equilibrio: {
    title: 'Calculadora de punto de equilibrio',
    menuTitle: 'Punto de equilibrio',
    metaTitle: 'Calculadora de punto de equilibrio: unidades y ventas',
    metaDescription:
      'Calcula cuántas unidades debes vender para cubrir tus costes fijos, la facturación necesaria y el margen de contribución. Con ejemplos resueltos. Gratis.',
    kicker: 'RENTABILIDAD Y CRECIMIENTO',
    desc: 'Descubre cuántas unidades tienes que vender para cubrir tus costes fijos y qué facturación supone, a partir del margen de contribución de cada unidad.',
    tileText: 'Calcula cuántas unidades necesitas vender para empezar a ganar dinero.',
    tileCta: 'Calcular equilibrio',
    search: 'punto de equilibrio umbral de rentabilidad costes fijos costes variables margen de contribución break even',
    formulas: [
      ['Margen de contribución por unidad', 'Precio de venta − coste variable'],
      ['Unidades en el punto de equilibrio', 'Costes fijos ÷ margen de contribución (redondeado hacia arriba)'],
      ['Facturación en el punto de equilibrio', 'Unidades redondeadas × precio de venta'],
      ['Resultado con un volumen dado', 'Unidades × margen de contribución − costes fijos'],
    ],
    faq: [
      ['¿Qué es el punto de equilibrio?', 'Es el nivel de ventas en el que los ingresos igualan a los costes totales: ni hay beneficio ni hay pérdida. A partir de la unidad siguiente, cada venta aporta beneficio.'],
      ['¿Qué es el margen de contribución?', 'Es lo que queda de cada venta tras pagar los costes variables de esa unidad. Con un precio de 50 € y un coste variable de 30 €, cada unidad aporta 20 € para cubrir los costes fijos.'],
      ['¿Por qué se redondea hacia arriba?', 'Porque no se venden fracciones de unidad. Si el cálculo da 437,5 unidades, con 437 todavía hay pérdida y hace falta vender 438.'],
      ['¿Qué pasa si el precio es igual o inferior al coste variable?', 'Que cada unidad vendida deja cero o pierde dinero, así que ningún volumen cubre los costes fijos. La calculadora lo avisa en lugar de mostrar una cifra imposible.'],
      ['¿Qué es un coste fijo y qué es un coste variable?', 'Los fijos no cambian con las unidades vendidas en el período (alquiler, seguros, cuotas, sueldos fijos). Los variables sí dependen de ellas (materia prima, envío, comisiones por venta). Si un coste es mixto, reparte su parte fija y su parte variable.'],
    ],
    modes: ['Punto de equilibrio'],
    fields: [{ fixed: 'Costes fijos del período', price: 'Precio de venta por unidad', variable: 'Coste variable por unidad', units: 'Unidades que esperas vender (opcional)' }],
  },
  roi: {
    title: 'Calculadora de ROI',
    menuTitle: 'ROI de una inversión',
    metaTitle: 'Calculadora de ROI: retorno de una inversión',
    metaDescription:
      'Calcula el beneficio neto y el ROI porcentual de una inversión a partir de lo invertido y del retorno total. Con ejemplos resueltos y sus límites. Gratis.',
    kicker: 'RENTABILIDAD Y CRECIMIENTO',
    desc: 'Calcula el beneficio o la pérdida neta y el ROI porcentual de una inversión a partir de lo que invertiste y de lo que has recuperado en total.',
    tileText: 'Mide cuánto has ganado o perdido respecto a lo que invertiste.',
    tileCta: 'Calcular ROI',
    search: 'roi retorno de la inversión rentabilidad beneficio neto inversión porcentaje',
    formulas: [
      ['Beneficio o pérdida neta', 'Retorno total − inversión inicial'],
      ['ROI', '(Retorno total − inversión inicial) ÷ inversión inicial × 100'],
      ['Retorno por unidad invertida', 'Retorno total ÷ inversión inicial'],
    ],
    faq: [
      ['¿Qué debo escribir en «Retorno total obtenido»?', 'Todo lo que has recuperado, incluida la inversión. Si invertiste 1.000 € y hoy tienes 1.300 €, el retorno total es 1.300 €, no 300 €. La calculadora resta la inversión por ti.'],
      ['¿ROI y ROAS son lo mismo?', 'No. El ROAS divide los ingresos de una campaña entre su gasto en publicidad; el ROI usa el beneficio neto sobre lo invertido. Con 500 € de publicidad que generan 2.000 € de ventas el ROAS es 4, pero si los productos vendidos costaron 1.200 €, el beneficio es de 300 € y el ROI de esos 500 € es del 60 %.'],
      ['¿El ROI es una rentabilidad anual?', 'No: no tiene en cuenta el tiempo. Un 30 % obtenido en tres años equivale a un 9,14 % anual compuesto, y un 30 % obtenido en un año es muy distinto. Esta calculadora no anualiza el resultado.'],
      ['¿Qué significa un ROI negativo?', 'Que has recuperado menos de lo invertido. Si inviertes 5.000 € y recuperas 4.000 €, pierdes 1.000 € y el ROI es del −20 %. Un ROI del −100 % significa que no has recuperado nada.'],
      ['¿Qué pasa si la inversión inicial es cero?', 'El ROI no se puede calcular, porque habría que dividir entre cero. La calculadora te pide una inversión mayor que cero.'],
    ],
    modes: ['Retorno de una inversión'],
    fields: [{ investment: 'Inversión inicial', total: 'Retorno total obtenido (con la inversión)' }],
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
  ['calculadora de recargo sobre coste', 'recargo'],
  ['calculadora de descuentos y precio final', 'descuento'],
  ['calculadora de punto de equilibrio', 'equilibrio'],
  ['calculadora de ROI', 'roi'],
];
