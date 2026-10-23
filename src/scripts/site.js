// Interacciones globales: menú móvil, buscador de la portada y filtros del catálogo.
// Mejora progresiva: el sitio funciona sin JavaScript. Ningún texto está escrito aquí: salen de #page-i18n.
let t = { open: '', close: '', empty: '', noResults: '' };
try { t = { ...t, ...JSON.parse(document.getElementById('page-i18n')?.textContent || '{}') }; } catch { /* usa los valores vacíos */ }

// Texto en minúsculas y sin acentos; las lenguas sin mayúsculas ni acentos (ja, zh, ar...) no cambian.
const norm = (x) => x.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');

const toggle = document.getElementById('mobileToggle');
const nav = document.getElementById('siteNav');
if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? t.close : t.open);
    toggle.textContent = open ? '✕' : '☰';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

// Buscador de la portada
const input = document.getElementById('mainSearch');
const out = document.getElementById('searchResults');
const indexEl = document.getElementById('search-index');
if (input && out && indexEl) {
  let items = [];
  try { items = JSON.parse(indexEl.textContent || '[]'); } catch { items = []; }
  const render = () => {
    const q = norm(input.value.trim());
    out.textContent = '';
    if (!q) { out.hidden = true; return; }
    const matches = items.filter((x) => norm(x.title + ' ' + x.terms).includes(q)).slice(0, 7);
    if (!matches.length) {
      const p = document.createElement('div');
      p.className = 'empty';
      p.textContent = t.empty;
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

// Catálogo de calculadoras: filtro por categoría + búsqueda en la propia página
const catalog = document.querySelector('[data-catalog]');
if (catalog) {
  const chips = [...catalog.querySelectorAll('[data-filter]')];
  const cards = [...catalog.querySelectorAll('[data-filter-item]')];
  const groups = [...catalog.querySelectorAll('[data-filter-group]')];
  const search = catalog.querySelector('[data-catalog-search]');
  const empty = catalog.querySelector('[data-catalog-empty]');
  let category = '';
  const apply = () => {
    const q = norm((search?.value || '').trim());
    let visible = 0;
    for (const c of cards) {
      const show = (!category || c.dataset.category === category) && (!q || norm(c.dataset.terms || '').includes(q));
      c.classList.toggle('is-filtered-out', !show);
      if (show) visible++;
    }
    for (const g of groups) g.classList.toggle('is-filtered-out', !g.querySelector('[data-filter-item]:not(.is-filtered-out)'));
    if (empty) empty.hidden = visible > 0;
  };
  for (const chip of chips) {
    chip.addEventListener('click', () => {
      category = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      apply();
    });
  }
  search?.addEventListener('input', apply);
  catalog.classList.add('is-ready');
}
