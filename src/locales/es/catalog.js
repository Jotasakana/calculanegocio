// Catálogo en español: categorías que aún no tienen ninguna calculadora disponible y textos de las calculadoras
// EN DESARROLLO. Las claves coinciden con src/domain/catalog.js. Una calculadora en desarrollo no tiene URL ni slug:
// cuando se publique, se añade a src/domain/registry.js, se mueve su texto a tools.js y se borra de aquí.

export const catalog = {
  categories: {
    crecimiento: {
      title: 'Rentabilidad y crecimiento',
      short: 'Variación, punto de equilibrio, ROI y publicidad',
    },
    finanzas: {
      title: 'Finanzas del negocio',
      short: 'Préstamos, amortización, stock y tesorería',
    },
  },
  planned: {
    recargo: { title: 'Recargo sobre coste', desc: 'Convierte entre recargo y margen sin confundirlos.', search: 'recargo markup coste margen' },
    descuento: { title: 'Descuentos y precio final', desc: 'Aplica uno o varios descuentos y comprueba el margen que te queda.', search: 'descuento rebaja precio final oferta' },
    marketplace: { title: 'Comisión de marketplace', desc: 'Calcula el precio mínimo para vender en una plataforma sin perder margen.', search: 'comision marketplace plataforma amazon venta online' },
    irpf: { title: 'Retención de IRPF en factura', desc: 'Calcula la retención y el total a cobrar de una factura.', search: 'irpf retencion factura autonomo profesional' },
    equivalencia: { title: 'Recargo de equivalencia', desc: 'Calcula el recargo que se suma al IVA en las compras de comercios minoristas.', search: 'recargo equivalencia iva comercio minorista' },
    hora: { title: 'Tarifa por hora', desc: 'Estima cuánto cobrar por hora según tus gastos y tus horas facturables.', search: 'tarifa hora precio hora freelance honorarios' },
    variacion: { title: 'Variación porcentual', desc: 'Compara dos periodos y mide cuánto ha subido o bajado una cifra.', search: 'variacion porcentual aumento descuento cambio' },
    equilibrio: { title: 'Punto de equilibrio', desc: 'Descubre cuántas unidades necesitas vender para cubrir tus costes fijos.', search: 'punto equilibrio umbral rentabilidad costes fijos' },
    roi: { title: 'ROI de una inversión', desc: 'Mide la rentabilidad de una inversión respecto a lo invertido.', search: 'roi retorno inversion rentabilidad' },
    roas: { title: 'Rentabilidad de campañas', desc: 'Calcula los ingresos obtenidos por cada euro invertido en publicidad (ROAS).', search: 'roas publicidad campaña anuncios retorno' },
    prestamo: { title: 'Cuota de un préstamo', desc: 'Calcula la cuota periódica, los intereses y el total a devolver.', search: 'prestamo cuota interes credito financiacion' },
    amortizacion: { title: 'Amortización lineal', desc: 'Reparte el coste de un activo a lo largo de su vida útil.', search: 'amortizacion lineal activo vida util depreciacion' },
    stock: { title: 'Rotación de stock', desc: 'Mide cuántas veces renuevas tu inventario en un periodo.', search: 'rotacion stock inventario existencias' },
    tesoreria: { title: 'Colchón de tesorería', desc: 'Calcula cuántos meses de gastos cubre el dinero que tienes disponible.', search: 'tesoreria caja colchon liquidez meses gastos' },
  },
};
