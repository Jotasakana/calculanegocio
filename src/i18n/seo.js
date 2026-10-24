// Metadatos de <head> de una página: idioma, dirección, canonical, hreflang, robots y Open Graph.
// Función pura: el layout solo imprime lo que devuelve.

import { REAL_WORLD, reviewOf, PUBLISHABLE } from './publish.js';
import { alternatesFor, pathFor } from './routes.js';

/**
 * @param {{ locale:string, key:string|null, path?:string, siteUrl:string, indexable:boolean, robots?:string }} p
 *   `key` = clave de página de la tabla de rutas (null en páginas fuera de ella: 404, redirección).
 */
export function headModel({ locale, key, path, siteUrl, indexable, robots }, world = REAL_WORLD) {
  const loc = world.locales[locale];
  const own = key ? pathFor(locale, key, world) : path;
  const site = siteUrl.replace(/\/+$/, '');
  return {
    lang: loc.hreflang,
    dir: loc.dir,
    ogLocale: loc.ogLocale,
    canonical: site + own,
    alternates: key ? alternatesFor(key, world).map((a) => ({ hreflang: a.hreflang, href: site + a.path })) : [],
    // Modo desarrollo: nunca se indexa nada hasta que se autorice la publicación (SITE_INDEXABLE=true).
    robots: robots ?? (indexable && key
      ? 'index,follow,max-image-preview:large' : 'noindex,follow'),
  };
}
