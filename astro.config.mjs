import { defineConfig } from 'astro/config';

// SITE_URL define el dominio canónico (por defecto, el definitivo).
// SITE_INDEXABLE: por defecto el sitio es indexable (84 páginas index,follow; las 30 legales, noindex). Solo el valor
// exacto "false" activa noindex + robots Disallow (previews y pruebas locales). Ver src/data/site.js.
const site = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
