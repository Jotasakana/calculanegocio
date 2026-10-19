// Interactividad de las calculadoras: pestañas, recálculo y restablecer.
import { compute } from '../lib/calculators.js';

for (const root of document.querySelectorAll('[data-calculator]')) {
  const tool = root.dataset.calculator;
  const tabs = [...root.querySelectorAll('[role=tab]')];
  const panels = [...root.querySelectorAll('[role=tabpanel]')];
  const $ = (sel) => root.querySelector(sel);
  const err = $('[data-err]');
  let mode = Number(root.dataset.mode || 0);

  const read = () => {
    const raw = {};
    for (const el of panels[mode].querySelectorAll('[data-key]')) raw[el.dataset.key] = el.value;
    return raw;
  };

  const showError = (msg) => {
    err.hidden = false;
    err.textContent = msg;
    $('[data-main]').textContent = '—';
    $('[data-lines]').textContent = '';
    $('[data-note]').textContent = 'Revisa los datos.';
  };

  const calculate = () => {
    const r = compute(tool, mode, read());
    if (!r.ok) return showError(r.error);
    err.hidden = true;
    err.textContent = '';
    $('[data-label]').textContent = r.label;
    $('[data-main]').textContent = r.main;
    $('[data-note]').textContent = r.note;
    $('[data-assumption]').textContent = r.assumption;
    const box = $('[data-lines]');
    box.textContent = '';
    for (const [k, v] of r.lines) {
      const row = document.createElement('div');
      row.className = 'resultline';
      const a = document.createElement('span');
      a.textContent = k;
      const b = document.createElement('strong');
      b.textContent = v;
      row.append(a, b);
      box.appendChild(row);
    }
  };

  const select = (i, focus) => {
    mode = i;
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', String(j === i));
      t.tabIndex = j === i ? 0 : -1;
    });
    panels.forEach((p, j) => { p.hidden = j !== i; });
    if (focus) tabs[i].focus();
    calculate();
  };

  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i, false));
    t.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      let to = null;
      if (e.key === 'ArrowRight') to = i === last ? 0 : i + 1;
      if (e.key === 'ArrowLeft') to = i === 0 ? last : i - 1;
      if (e.key === 'Home') to = 0;
      if (e.key === 'End') to = last;
      if (to !== null) { e.preventDefault(); select(to, true); }
    });
  });

  root.addEventListener('input', (e) => { if (e.target.closest('[data-key]')) calculate(); });

  const reset = $('[data-reset]');
  if (reset) {
    reset.addEventListener('click', () => {
      for (const el of panels[mode].querySelectorAll('[data-key]')) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = el.defaultValue;
      }
      calculate();
    });
  }

  root.classList.add('is-ready');
  calculate();
}
