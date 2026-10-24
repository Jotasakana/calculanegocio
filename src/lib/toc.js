// Índice de una página a partir de sus apartados. Función PURA: recibe el HTML ya preparado por renderFragment
// (apartados <h2 class="sec">) y devuelve el HTML con un id estable en cada uno, más la lista { id, title }.
// Los ids son secuenciales (sec-1, sec-2…) para que funcionen igual con cualquier alfabeto (hindi, árabe, chino…).

const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export function withToc(html, prefix = 'sec') {
  const toc = [];
  const out = html.replace(/<h2 class="sec">([\s\S]*?)<\/h2>/g, (_all, inner) => {
    const id = `${prefix}-${toc.length + 1}`;
    toc.push({ id, title: stripTags(inner) });
    return `<h2 class="sec" id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}
