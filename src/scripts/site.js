// Interacciones globales: menú móvil y buscador de la Home. Mejora progresiva: el sitio funciona sin JS.
const toggle = document.getElementById('mobileToggle');
const nav = document.getElementById('siteNav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    toggle.textContent = open ? '✕' : '☰';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

const input = document.getElementById('mainSearch');
const out = document.getElementById('searchResults');
const indexEl = document.getElementById('search-index');
if (input && out && indexEl) {
  let items = [];
  try { items = JSON.parse(indexEl.textContent || '[]'); } catch { items = []; }
  const norm = (x) => x.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const render = () => {
    const q = norm(input.value.trim());
    out.textContent = '';
    if (!q) { out.hidden = true; return; }
    const matches = items.filter((x) => norm(x.title + ' ' + x.terms).includes(q)).slice(0, 7);
    if (!matches.length) {
      const p = document.createElement('div');
      p.className = 'empty';
      p.textContent = 'No hay resultados. Prueba con «margen», «IVA» o «precio».';
      out.appendChild(p);
    } else {
      for (const x of matches) {
        const a = document.createElement('a');
        a.href = x.url;
        const st = document.createElement('strong');
        st.textContent = x.title;
        const sm = document.createElement('small');
        sm.textContent = x.kind;
        a.append(st, sm);
        out.appendChild(a);
      }
    }
    out.hidden = false;
  };
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { out.hidden = true; input.blur(); }
    if (e.key === 'Enter') { const a = out.querySelector('a'); if (a) location.href = a.getAttribute('href'); }
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.hero-search')) out.hidden = true; });
}
