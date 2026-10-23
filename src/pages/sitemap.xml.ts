import { SITE } from '../data/site.js';
import { sitemapXml } from '../i18n/sitemap.js';

export function GET() {
  return new Response(sitemapXml(SITE.url), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
