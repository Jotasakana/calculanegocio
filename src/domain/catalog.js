// Catálogo NEUTRAL: qué calculadoras forman el plan y en qué orden. Sin texto de ningún idioma.
//
// El estado NO se escribe aquí: una calculadora está «disponible» si existe en TOOL_REGISTRY (tiene fórmula,
// pruebas y página) y «en desarrollo» si no. Así no puede haber una tarjeta que enlace a una herramienta inexistente.
//
// Las calculadoras en desarrollo no tienen URL, ni slug, ni entrada en el sitemap ni en el buscador.
// `scope`/`market` solo se declaran aquí para las que aún no están en el registro (las del registro ya los tienen).

/** Orden de las categorías del catálogo. Las que no tienen ninguna calculadora disponible no generan página propia. */
export const CATALOG_CATEGORIES = ['margenes-y-precios', 'facturacion', 'crecimiento', 'finanzas'];

/** `icon` es una clave de src/lib/icons.js. */
export const CATALOG = [
  // Márgenes y precios
  { id: 'margen', category: 'margenes-y-precios', icon: 'margin' },
  { id: 'precio', category: 'margenes-y-precios', icon: 'price' },
  { id: 'rentabilidad', category: 'margenes-y-precios', icon: 'trend' },
  { id: 'recargo', category: 'margenes-y-precios', icon: 'markup', scope: 'universal' },
  { id: 'descuento', category: 'margenes-y-precios', icon: 'discount', scope: 'universal' },
  { id: 'marketplace', category: 'margenes-y-precios', icon: 'store', scope: 'universal' },
  // Facturación e impuestos
  { id: 'iva', category: 'facturacion', icon: 'receipt' },
  { id: 'irpf', category: 'facturacion', icon: 'shield', scope: 'fiscal', market: 'es' },
  { id: 'equivalencia', category: 'facturacion', icon: 'layers', scope: 'fiscal', market: 'es' },
  { id: 'hora', category: 'facturacion', icon: 'clock', scope: 'universal' },
  // Rentabilidad y crecimiento
  { id: 'variacion', category: 'crecimiento', icon: 'change', scope: 'universal' },
  { id: 'equilibrio', category: 'crecimiento', icon: 'balance', scope: 'universal' },
  { id: 'roi', category: 'crecimiento', icon: 'coin', scope: 'universal' },
  { id: 'roas', category: 'crecimiento', icon: 'megaphone', scope: 'universal' },
  // Finanzas del negocio
  { id: 'prestamo', category: 'finanzas', icon: 'bank', scope: 'universal' },
  { id: 'amortizacion', category: 'finanzas', icon: 'steps', scope: 'universal' },
  { id: 'stock', category: 'finanzas', icon: 'box', scope: 'universal' },
  { id: 'tesoreria', category: 'finanzas', icon: 'wallet', scope: 'universal' },
];

/** Calculadoras que se ofrecen en la portada, por orden de pestaña. Solo se muestran las publicadas en el idioma. */
export const FEATURED_TOOLS = ['precio', 'margen'];
