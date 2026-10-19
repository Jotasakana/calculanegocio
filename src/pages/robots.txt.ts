import { SITE } from '../data/site.js';

export function GET() {
  // Modo desarrollo (por defecto): bloquea todo. Con SITE_INDEXABLE=true se permite y se anuncia el sitemap.
  const body = SITE.indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
