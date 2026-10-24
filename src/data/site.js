// Configuración global del sitio (solo se usa en build, nunca en el navegador).
// Textos y URLs por idioma: src/locales/ y src/i18n/. Aquí solo lo que no depende del idioma.
const siteUrl = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');

export const SITE = {
  url: siteUrl,
  // Modo desarrollo por defecto: noindex + robots.txt con Disallow. No activar sin autorización.
  indexable: process.env.SITE_INDEXABLE !== 'false',
};

export const absoluteUrl = (path) => siteUrl + path;
