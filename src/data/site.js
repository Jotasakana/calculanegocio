// Configuración global del sitio (solo se usa en build, nunca en el navegador).
// Textos y URLs por idioma: src/locales/ y src/i18n/. Aquí solo lo que no depende del idioma.
const siteUrl = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');

export const SITE = {
  url: siteUrl,
  // Estado real (Fase 7A): el sitio es INDEXABLE por defecto. Solo el valor exacto "false" activa noindex + robots.txt con
  // Disallow (previews y pruebas locales). Las 30 páginas legales son siempre noindex y no entran en el sitemap.
  // Pendiente (fase posterior, tras verificar las variables de Cloudflare): valorar un valor por defecto «seguro».
  indexable: process.env.SITE_INDEXABLE !== 'false',
};

export const absoluteUrl = (path) => siteUrl + path;
