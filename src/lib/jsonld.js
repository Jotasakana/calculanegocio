import { absoluteUrl } from '../data/site.js';

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.label, item: absoluteUrl(it.path) })),
  };
}

/** `currency`: moneda por defecto de la página; si no hay ninguna (null) no se declara oferta de precio. */
export function webApplicationLd(tool, { lang, currency }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    description: tool.metaDescription,
    url: absoluteUrl(tool.path),
    inLanguage: lang,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    isAccessibleForFree: true,
    ...(currency ? { offers: { '@type': 'Offer', price: '0', priceCurrency: currency } } : {}),
  };
}

export function websiteLd({ name, path, lang }) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name, url: absoluteUrl(path), inLanguage: lang };
}
