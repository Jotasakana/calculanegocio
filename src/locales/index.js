// Contenidos disponibles por idioma. Para preparar un idioma nuevo: crear src/locales/<código>/ con la misma
// estructura que es/ y registrarlo aquí. Mientras su estado sea 'draft' en src/i18n/locales.js no se publica nada.
import es from './es/index.js';
import en from './en/index.js';
import ptBr from './pt-br/index.js';
import de from './de/index.js';
import fr from './fr/index.js';
import hi from './hi/index.js';

export const CONTENT = { es, en, 'pt-br': ptBr, de, fr, hi };

export function getContent(code) {
  const c = CONTENT[code];
  if (!c) throw new Error(`No hay contenidos para el idioma "${code}"`);
  return c;
}
