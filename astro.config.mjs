import { defineConfig } from 'astro/config';

// SITE_URL define el dominio canónico (por defecto, el definitivo).
// El sitio sigue en modo desarrollo (noindex + robots Disallow) mientras
// SITE_INDEXABLE no valga "true". No activar hasta que se autorice la publicación.
const site = (process.env.SITE_URL || 'https://calculanegocio.com').replace(/\/+$/, '');

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
