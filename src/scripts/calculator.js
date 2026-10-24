// Interactividad de las calculadoras: pestañas, recálculo, moneda y restablecer.
// Las fórmulas y el formato son los mismos módulos que usa el build (src/domain, src/lib/present.js);
// los textos del idioma llegan en el JSON de la página (data-calc-i18n). Aquí no hay ningún texto.
import { createCalculator, unitSuffix } from '../lib/present.js';

for (const root of document.querySelectorAll('[data-calculator]')) {
  const tool = root.dataset.calculator;
  let content;
  try { content = JSON.parse(root.querySelector('[data-calc-i18n]').textContent); } catch { continue; }

  let calc = createCalculator(content, root.dataset.currency || null);
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

  const renderBar = (bar) => {
    const strip = $('[data-bar]');
    const legend = $('[data-legend]');
    strip.textContent = '';
    legend.textContent = '';
    for (const b of bar) {
      const seg = document.createElement('i');
      seg.className = 's' + b.slot;
      seg.style.width = b.share + '%';
      strip.appendChild(seg);
      const li = document.createElement('li');
      li.className = 's' + b.slot;
      const val = document.createElement('span');
      val.dir = 'auto';
      val.textContent = b.text;
      li.append(b.label + ' · ', val);
      legend.appendChild(li);
    }
  };

  const showError = (msg) => {
    err.hidden = false;
    err.textContent = msg;
    $('[data-main]').textContent = '—';
    $('[data-lines]').textContent = '';
    $('[data-note]').textContent = calc.t('common.checkData');
    renderBar([]);
  };

  const calculate = () => {
    const r = calc.compute(tool, mode, read());
    if (!r.ok) return showError(r.error);
    err.hidden = true;
    err.textContent = '';
    $('[data-label]').textContent = r.label;
    $('[data-main]').textContent = r.main;
    $('[data-note]').textContent = r.note;
    $('[data-assumption]').textContent = r.assumption;
    renderBar(r.bar);
    const box = $('[data-lines]');
    box.textContent = '';
    for (const [k, v] of r.lines) {
      const row = document.createElement('div');
      row.className = 'resultline';
      const a = document.createElement('span');
      a.textContent = k;
      const b = document.createElement('strong');
      b.dir = 'auto';
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
      // En idiomas RTL las flechas se invierten (la siguiente pestaña queda a la izquierda).
      const rtl = getComputedStyle(root).direction === 'rtl';
      const next = rtl ? 'ArrowLeft' : 'ArrowRight';
      const prev = rtl ? 'ArrowRight' : 'ArrowLeft';
      let to = null;
      if (e.key === next) to = i === last ? 0 : i + 1;
      if (e.key === prev) to = i === 0 ? last : i - 1;
      if (e.key === 'Home') to = 0;
      if (e.key === 'End') to = last;
      if (to !== null) { e.preventDefault(); select(to, true); }
    });
  });

  root.addEventListener('input', (e) => { if (e.target.closest('[data-key]')) calculate(); });

  // Moneda (solo calculadoras universales): cambia el símbolo de los importes, no los números.
  const currencySelect = $('[data-currency-select]');
  if (currencySelect) {
    currencySelect.addEventListener('change', () => {
      calc = createCalculator(content, currencySelect.value || null);
      root.dataset.currency = currencySelect.value;
      for (const label of root.querySelectorAll('label[data-base]')) {
        label.textContent = label.dataset.base + unitSuffix(label.dataset.kind, calc.formatter);
      }
      calculate();
    });
  }

  // Copiar el resultado (texto plano: etiqueta, cifra principal y desglose). Los textos del botón vienen del idioma.
  const copyBtn = $('[data-copy]');
  if (copyBtn) {
    const labelEl = copyBtn.querySelector('[data-copy-label]');
    const ui = content.ui ?? {};
    const lastText = () => {
      const lines = [...root.querySelectorAll('[data-lines] .resultline')].map((row) => row.children[0].textContent + ': ' + row.children[1].textContent);
      return [$('[data-label]').textContent + ': ' + $('[data-main]').textContent, ...lines].join('\n');
    };
    let timer;
    const flash = (msg) => {
      labelEl.textContent = msg;
      clearTimeout(timer);
      timer = setTimeout(() => { labelEl.textContent = ui.copy; }, 1800);
    };
    copyBtn.hidden = !navigator.clipboard;
    copyBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(lastText()); flash(ui.copied); } catch { flash(ui.copyFailed); }
    });
  }

  const reset = $('[data-reset]');
  if (reset) {
    reset.addEventListener('click', () => {
      for (const el of panels[mode].querySelectorAll('[data-key]')) {
        if (el.tagName === 'SELECT') el.selectedIndex = Math.max(0, [...el.options].findIndex((o) => o.defaultSelected));
        else el.value = el.defaultValue;
      }
      calculate();
    });
  }

  root.classList.add('is-ready');
  calculate();
}
