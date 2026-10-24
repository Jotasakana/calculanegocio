// Registro de idiomas. Un idioma NO es un país: la moneda y las reglas fiscales se configuran aparte.
//
// status:
//   'enabled' -> se genera y se publica (selector, sitemap, hreflang).
//   'draft'   -> existe en el registro para preparar la arquitectura, pero NO genera ninguna página.
// defaultCurrency: solo cuando la combinación idioma-región apunta a una moneda de forma inequívoca;
// null = no se asume ninguna moneda (el usuario la elige; nunca se presupone USD por hablar inglés).
// Solo se activa un idioma cuando sus contenidos están en estado 'reviewed' (ver src/i18n/review.js).

/** @typedef {{code:string, hreflang:string, prefix:string, dir:'ltr'|'rtl', intl:string, script:string,
 *   name:string, defaultCurrency:string, status:'enabled'|'draft', ogLocale:string}} LocaleConfig */

/** @type {Record<string, LocaleConfig>} */
export const LOCALES = {
  es: { code: 'es', hreflang: 'es', prefix: 'es', dir: 'ltr', intl: 'es-ES', script: 'latin', name: 'Español', defaultCurrency: 'EUR', status: 'enabled', ogLocale: 'es_ES' },
  en: { code: 'en', hreflang: 'en', prefix: 'en', dir: 'ltr', intl: 'en', script: 'latin', name: 'English', defaultCurrency: null, status: 'draft', ogLocale: 'en_US' },
  'pt-br': { code: 'pt-br', hreflang: 'pt-BR', prefix: 'pt-br', dir: 'ltr', intl: 'pt-BR', script: 'latin', name: 'Português (Brasil)', defaultCurrency: 'BRL', status: 'draft', ogLocale: 'pt_BR' },
  fr: { code: 'fr', hreflang: 'fr', prefix: 'fr', dir: 'ltr', intl: 'fr-FR', script: 'latin', name: 'Français', defaultCurrency: null, status: 'draft', ogLocale: 'fr_FR' },
  de: { code: 'de', hreflang: 'de', prefix: 'de', dir: 'ltr', intl: 'de-DE', script: 'latin', name: 'Deutsch', defaultCurrency: null, status: 'draft', ogLocale: 'de_DE' },
  hi: { code: 'hi', hreflang: 'hi', prefix: 'hi', dir: 'ltr', intl: 'hi-IN', script: 'devanagari', name: 'हिन्दी', defaultCurrency: 'INR', status: 'draft', ogLocale: 'hi_IN' },
  ar: { code: 'ar', hreflang: 'ar', prefix: 'ar', dir: 'rtl', intl: 'ar-u-nu-latn', script: 'arabic', name: 'العربية', defaultCurrency: null, status: 'draft', ogLocale: 'ar_AR' },
  id: { code: 'id', hreflang: 'id', prefix: 'id', dir: 'ltr', intl: 'id-ID', script: 'latin', name: 'Bahasa Indonesia', defaultCurrency: 'IDR', status: 'draft', ogLocale: 'id_ID' },
  ja: { code: 'ja', hreflang: 'ja', prefix: 'ja', dir: 'ltr', intl: 'ja-JP', script: 'cjk', name: '日本語', defaultCurrency: 'JPY', status: 'draft', ogLocale: 'ja_JP' },
  zh: { code: 'zh', hreflang: 'zh-Hans', prefix: 'zh', dir: 'ltr', intl: 'zh-CN', script: 'cjk', name: '简体中文', defaultCurrency: 'CNY', status: 'draft', ogLocale: 'zh_CN' },
};

/** Idioma por defecto (x-default y destino de la redirección temporal de "/"). */
export const DEFAULT_LOCALE = 'es';

export const ALL_LOCALE_CODES = Object.keys(LOCALES);

/** Idiomas con contenido publicado. */
export const enabledLocales = () => Object.values(LOCALES).filter((l) => l.status === 'enabled');

export function getLocale(code) {
  const l = LOCALES[code];
  if (!l) throw new Error(`Idioma desconocido: ${code}`);
  return l;
}

/** Ruta pública de una URL ya traducida: "/es/" + "calculadora-margen-comercial/". */
export const localePath = (code, rest = '') => `/${getLocale(code).prefix}/${rest}`;
