// Fragmentos HTML editoriales (artículos de las calculadoras y textos de páginas). Funciones PURAS y
// sin Vite: la lectura de los archivos está en src/locales/fragments.js (build) y en los scripts (Node).
//
// Marcadores admitidos en los fragmentos (así ningún enlace interno va escrito a mano):
//   {{home}} {{tools}} {{methodology}}        URL de esas páginas, en el idioma de la página
//   {{tool:ID}} {{category:ID}}               URL de una calculadora / categoría
//   {{tool.title:ID}} {{category.title:ID}}   su título en el idioma de la página
// Un marcador que no se pueda resolver detiene el build (nunca se publica un enlace roto).

const PLACEHOLDER = /\{\{([\w.-]+)(?::([\w-]+))?\}\}/g;

/**
 * @param {string} html
 * @param {{ path:(pageKey:string)=>string, title:(kind:'tool'|'category', id:string)=>string }} ctx
 */
export function applyPlaceholders(html, ctx) {
  return html.replace(PLACEHOLDER, (all, name, id) => {
    if (name === 'home' || name === 'tools' || name === 'methodology') return ctx.path(name);
    if (name === 'tool' || name === 'category') return ctx.path(`${name}:${id}`);
    if (name === 'tool.title') return ctx.title('tool', id);
    if (name === 'category.title') return ctx.title('category', id);
    throw new Error(`Marcador desconocido en un fragmento: ${all}`);
  });
}

/** Marcadores presentes en un fragmento (para validarlos sin renderizar). */
export const placeholdersIn = (html) => [...html.matchAll(PLACEHOLDER)].map((m) => m[0]);

/**
 * Prepara un fragmento para la página: jerarquía semántica (el H1 es el título de la página, los apartados
 * son H2/H3 con las clases visuales .sec/.sub), enlaces automáticos y marcadores.
 * @param {{ currentToolId?:string, autolinks?:[string,string][] }} opts
 */
export function renderFragment(html, ctx, { currentToolId, autolinks = [] } = {}) {
  let out = html
    .replace(/<h3>/g, '<h2 class="sec">').replace(/<\/h3>/g, '</h2>')
    .replace(/<h4>/g, '<h3 class="sub">').replace(/<\/h4>/g, '</h3>');
  // Enlaza la primera mención de cada calculadora publicada (salvo la propia página).
  for (const [phrase, id] of autolinks) {
    if (id === currentToolId) continue;
    let href;
    try { href = ctx.path('tool:' + id); } catch { continue; } // calculadora no disponible en este idioma
    out = out.replace(phrase, `<a href="${href}">${phrase}</a>`);
  }
  return applyPlaceholders(out, ctx);
}
