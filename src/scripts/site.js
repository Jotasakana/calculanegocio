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
  document.addEventListener('click', (e) => { if (!e.target.closest('.herosearch')) out.hidden = true; });
}

// Calculadoras de la portada: pestañas entre las herramientas destacadas
for (const bench of document.querySelectorAll('[data-bench]')) {
  const tabs = [...bench.querySelectorAll('[data-bench-tab]')];
  const panels = [...bench.querySelectorAll('[data-bench-panel]')];
  const select = (i, focus) => {
    tabs.forEach((tab, j) => { tab.setAttribute('aria-selected', String(j === i)); tab.tabIndex = j === i ? 0 : -1; });
    panels.forEach((p, j) => { p.hidden = j !== i; });
    if (focus) tabs[i].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, false));
    tab.addEventListener('keydown', (e) => {
      const rtl = getComputedStyle(bench).direction === 'rtl';
      const next = rtl ? 'ArrowLeft' : 'ArrowRight';
      const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
      const last = tabs.length - 1;
      let to = null;
      if (e.key === next) to = i === last ? 0 : i + 1;
      if (e.key === prev) to = i === 0 ? last : i - 1;
      if (e.key === 'Home') to = 0;
      if (e.key === 'End') to = last;
      if (to !== null) { e.preventDefault(); select(to, true); }
    });
  });
  bench.classList.add('is-ready');
  if (tabs.length) select(0, false);
}

// Catálogo de calculadoras: filtros por tema y por estado + búsqueda en la propia página
for (const catalog of document.querySelectorAll('[data-catalog]')) {
  const topicChips = [...catalog.querySelectorAll('[data-filter-category]')];
  const statusChips = [...catalog.querySelectorAll('[data-filter-status]')];
  const cards = [...catalog.querySelectorAll('[data-filter-item]')];
  const groups = [...catalog.querySelectorAll('[data-filter-group]')];
  const search = catalog.querySelector('[data-catalog-search]');
  const empty = catalog.querySelector('[data-catalog-empty]');
  let category = '';
  let status = '';
  const apply = () => {
    const q = norm((search?.value || '').trim());
    let visible = 0;
    for (const c of cards) {
      const show = (!category || c.dataset.category === category) && (!status || c.dataset.status === status) && (!q || norm(c.dataset.terms || '').includes(q));
      c.classList.toggle('is-filtered-out', !show);
      if (show) visible++;
    }
    for (const g of groups) g.classList.toggle('is-filtered-out', !g.querySelector('[data-filter-item]:not(.is-filtered-out)'));
    if (empty) empty.hidden = visible > 0;
  };
  const wire = (chips, set) => {
    for (const chip of chips) {
      chip.addEventListener('click', () => {
        set(chip);
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        apply();
      });
    }
  };
  wire(topicChips, (chip) => { category = chip.dataset.filterCategory; });
  wire(statusChips, (chip) => { status = chip.dataset.filterStatus; });
  search?.addEventListener('input', apply);
  catalog.classList.add('is-ready');
}
