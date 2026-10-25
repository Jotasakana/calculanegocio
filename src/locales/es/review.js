// Estado editorial del contenido en español.
//
// Estados:
//   'source'   idioma original en el que se redacta el sitio; es la referencia para el resto de traducciones.
//   'draft'    traducción sin revisar: NO se publica (no se genera ninguna página).
//   'reviewed' revisada por una persona nativa o cualificada. Exige reviewer, date y scope (lo comprueba check-i18n).
//
// Se publican 'source', 'reviewed' y 'unreviewed' (ver UNREVIEWED_OK en src/i18n/publish.js); 'draft' no se publica.
// No se registran revisiones que no hayan ocurrido.
export const review = {
  default: { status: 'source' },
  // Excepciones por página: { 'tool:margen': { status: 'reviewed', reviewer: '...', date: 'AAAA-MM-DD', scope: '...' } }
  pages: {},
};
