// Sitemap multilingüe: una <url> por página publicada, con sus alternativas hreflang (xhtml:link) solo
// cuando existen y son recíprocas. Devuelve el XML completo.
import { REAL_WORLD } from './publish.js';
import { routeTable, alternatesFor } from './routes.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function sitemapXml(siteUrl, world = REAL_WORLD) {
  const site = siteUrl.replace(/\/+$/, '');
  const urls = routeTable(world).map((r) => {
    const alts = alternatesFor(r.key, world)
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(site + a.path)}"/>`)
      .join('\n');
    return `  <url>\n    <loc>${esc(site + r.path)}</loc>${alts ? '\n' + alts : ''}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}
