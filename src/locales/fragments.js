// Carga (en BUILD, con Vite) los fragmentos HTML de cada idioma: src/locales/<idioma>/articles|pages/*.html.
const raw = import.meta.glob('./*/{articles,pages}/*.html', { query: '?raw', import: 'default', eager: true });

/** kind: 'articles' | 'pages' */
export function fragment(locale, kind, key) {
  const html = raw[`./${locale}/${kind}/${key}.html`];
  if (html === undefined) throw new Error(`Falta el fragmento ${locale}/${kind}/${key}.html`);
  return html;
}
