// Configuración global del sitio (solo se usa en build, nunca en el navegador).
const siteUrl = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');

export const SITE = {
  name: 'CalculaNegocio',
  url: siteUrl,
  locale: 'es_ES',
  lang: 'es',
  tagline: 'Calculadoras para autónomos y pequeños negocios',
  // Modo desarrollo por defecto: noindex + robots.txt con Disallow. No activar sin autorización.
  indexable: process.env.SITE_INDEXABLE === 'true',
  devLabel: 'DEMO PRIVADA · v0.5',
};

export const absoluteUrl = (path) => siteUrl + path;
