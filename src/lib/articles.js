import { TOOLS, AUTOLINK_PHRASES, PAGES } from '../data/tools.js';

// Los textos explicativos viven como fragmentos HTML en src/content/articles/.
// Se inyectan en BUILD (HTML estático): no hay carga de contenido desde JavaScript.
const raw = import.meta.glob('../content/articles/*.html', { query: '?raw', import: 'default', eager: true });

export function articleHtml(key, currentToolId) {
  const entry = Object.entries(raw).find(([p]) => p.endsWith('/' + key + '.html'));
  if (!entry) throw new Error('Falta el fragmento editorial: ' + key);
  let html = entry[1];

  // Jerarquía semántica: el H1 es el título de la página; los apartados son H2/H3.
  // (Se conservan los mismos tamaños visuales mediante las clases .sec / .sub.)
  html = html.replace(/<h3>/g, '<h2 class="sec">').replace(/<\/h3>/g, '</h2>');
  html = html.replace(/<h4>/g, '<h3 class="sub">').replace(/<\/h4>/g, '</h3>');

  // Enlaza la primera mención de cada calculadora existente (salvo la propia página).
  for (const [phrase, id] of AUTOLINK_PHRASES) {
    if (id === currentToolId) continue;
    html = html.replace(phrase, `<a href="${TOOLS[id].path}">${phrase}</a>`);
  }
  return html;
}

export { PAGES };
