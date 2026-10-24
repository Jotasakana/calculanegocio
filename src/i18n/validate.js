// Validación de los contenidos de un idioma frente al idioma de referencia (es). Funciones puras, usadas por
// scripts/check-i18n.mjs (CI) y probadas en scripts/test-i18n.mjs. Devuelven una lista de problemas (vacía = correcto).

import { ERROR_CODES } from '../domain/formulas.js';
import { placeholdersIn } from '../lib/fragments.js';
import { DEFAULT_LOCALE } from './locales.js';

/** Aplana un objeto anidado a { 'a.b.0': valor } (los arrays se indexan). */
export function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}

const markers = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

/** Claves y marcadores {x} idénticos a la referencia. */
function compareDictionaries(label, ref, cur, problems) {
  const a = flatten(ref), b = flatten(cur);
  for (const k of Object.keys(a)) if (!(k in b)) problems.push(`${label}: falta la clave "${k}"`);
  for (const k of Object.keys(b)) if (!(k in a)) problems.push(`${label}: clave sobrante "${k}"`);
  for (const k of Object.keys(a)) if (k in b) {
    if (typeof b[k] !== 'string' || !b[k].trim()) problems.push(`${label}: "${k}" vacío o no es texto`);
    else if (typeof a[k] === 'string' && markers(a[k]) !== markers(b[k])) problems.push(`${label}: "${k}" no conserva los marcadores {${markers(a[k])}}`);
  }
}

/** Porcentaje de textos idénticos a la referencia (para detectar traducciones sin hacer). */
export function untranslatedRatio(ref, cur, ignore = []) {
  const a = flatten(ref), b = flatten(cur);
  const keys = Object.keys(a).filter((k) => k in b && typeof a[k] === 'string' && a[k].length > 3 && !ignore.includes(a[k]));
  if (!keys.length) return 0;
  return keys.filter((k) => a[k] === b[k]).length / keys.length;
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * @param {string} code idioma a validar
 * @param {object} world { locales, content, markets, tools, categories }
 * @param {{ readFragment:(locale:string, kind:string, key:string)=>string|null }} io
 */
export function validateLocale(code, world, io) {
  const problems = [];
  const c = world.content[code];
  const ref = world.content[DEFAULT_LOCALE];
  const P = (m) => problems.push(`[${code}] ${m}`);
  if (!c) return [`[${code}] sin contenidos`];
  if (c.code !== code) P(`content.code es "${c.code}"`);

  // Textos: mismas claves y marcadores que el idioma de referencia
  if (code !== DEFAULT_LOCALE) {
    const sub = [];
    compareDictionaries('messages', ref.messages, c.messages, sub);
    compareDictionaries('ui', ref.ui, c.ui, sub);
    compareDictionaries('errors', ref.errors, c.errors, sub);
    sub.forEach(P);
    const ratio = untranslatedRatio({ ui: ref.ui, messages: ref.messages, tools: ref.tools }, { ui: c.ui, messages: c.messages, tools: c.tools }, ['CalculaNegocio']);
    if (ratio > 0.15) P(`${Math.round(ratio * 100)} % de los textos son idénticos al idioma de referencia: parece una traducción sin hacer`);
  }
  for (const e of ERROR_CODES) if (!c.errors?.[e]) P(`falta el mensaje de error "${e}"`);

  // Calculadoras y categorías
  for (const [id, tool] of Object.entries(world.tools)) {
    const t = c.tools?.[id];
    if (!t) { P(`falta el texto de la calculadora "${id}"`); continue; }
    for (const k of ['title', 'menuTitle', 'metaTitle', 'metaDescription', 'kicker', 'desc', 'tileText', 'tileCta', 'search']) if (!t[k]) P(`tools.${id}.${k} vacío`);
    if (t.modes?.length !== tool.modes.length) P(`tools.${id}: ${t.modes?.length} nombres de pestaña, se esperaban ${tool.modes.length}`);
    tool.modes.forEach((fields, i) => {
      const want = fields.map((f) => f.key).sort().join();
      const got = Object.keys(t.fields?.[i] ?? {}).sort().join();
      if (want !== got) P(`tools.${id}.fields[${i}]: campos "${got}", se esperaban "${want}"`);
    });
    if (!Array.isArray(t.formulas) || !t.formulas.length || t.formulas.some((x) => !Array.isArray(x) || x.length !== 2 || !x[0] || !x[1])) P(`tools.${id}.formulas: se esperaba una lista [nombre, expresión] no vacía`);
    if (!Array.isArray(t.faq) || t.faq.length < 2 || t.faq.some((x) => !Array.isArray(x) || x.length !== 2 || !x[0] || !x[1])) P(`tools.${id}.faq: se esperaban al menos 2 pares [pregunta, respuesta]`);
    for (const f of tool.modes.flat()) if (f.kind === 'select' && f.options.some((o) => !c.selectOptions?.[f.key]?.[o])) P(`falta la etiqueta de las opciones de "${f.key}"`);
    if (t.metaTitle && t.metaTitle.length > 60) P(`tools.${id}.metaTitle largo (${t.metaTitle.length})`);
    if (t.metaDescription && t.metaDescription.length > 165) P(`tools.${id}.metaDescription larga (${t.metaDescription.length})`);
  }
  for (const id of Object.keys(world.categories)) if (!c.categories?.[id]?.title) P(`falta la categoría "${id}"`);

  // Catálogo: texto de las calculadoras en desarrollo y de las categorías que aún no tienen página
  for (const e of world.catalog ?? []) {
    if (world.tools[e.id]) continue;
    if (e.scope === 'fiscal' && !world.markets[e.market]?.locales.includes(code)) continue; // no se ofrece en este idioma
    const p = c.catalog?.planned?.[e.id];
    if (!p) { P(`catalog.planned.${e.id}: falta el texto de la calculadora en desarrollo`); continue; }
    for (const k of ['title', 'desc', 'search']) if (!p[k]) P(`catalog.planned.${e.id}.${k} vacío`);
  }
  for (const id of world.catalogCategories ?? []) {
    if (world.categories[id]) continue;
    const cat = c.catalog?.categories?.[id];
    if (!cat?.title || !cat?.short) P(`catalog.categories.${id}: faltan título o descripción`);
  }
  for (const id of Object.keys(c.catalog?.planned ?? {})) if (!(world.catalog ?? []).some((e) => e.id === id) || world.tools[id]) P(`catalog.planned.${id}: sobrante (no está en desarrollo)`);

  // Slugs: ASCII, únicos y completos (las URLs de otros alfabetos se transliteran)
  const s = c.slugs ?? {};
  const all = [s.tools, s.methodology, ...Object.values(s.categories ?? {}), ...Object.values(s.toolPages ?? {})];
  for (const id of Object.keys(world.tools)) if (!s.toolPages?.[id]) P(`falta el slug de la calculadora "${id}"`);
  for (const id of Object.keys(world.categories)) if (!s.categories?.[id]) P(`falta el slug de la categoría "${id}"`);
  if (!s.tools || !s.methodology) P('faltan slugs de "tools" o "methodology"');
  for (const v of all) if (v && !SLUG.test(v)) P(`slug no válido "${v}" (solo a-z, 0-9 y guiones)`);
  if (new Set(all).size !== all.length) P('slugs repetidos dentro del idioma');

  // Fragmentos editoriales y sus marcadores
  const needs = [
    ...Object.values(world.tools).map((t) => ['articles', t.article]),
    ['pages', 'methodology'],
    ...Object.keys(world.categories).map((id) => ['pages', `category-${id}`]),
  ];
  for (const [kind, key] of needs) {
    const html = io.readFragment(code, kind, key);
    if (html == null) { P(`falta el fragmento ${kind}/${key}.html`); continue; }
    for (const ph of placeholdersIn(html)) {
      const m = ph.match(/^\{\{([\w.-]+)(?::([\w-]+))?\}\}$/);
      const [, name, pid] = m;
      const ok = ['home', 'tools', 'methodology'].includes(name) || ((name === 'tool' || name === 'tool.title') && world.tools[pid]) || ((name === 'category' || name === 'category.title') && world.categories[pid]);
      if (!ok) P(`${kind}/${key}.html: marcador no válido ${ph}`);
    }
    if (/\\/.test(html)) P(`${kind}/${key}.html: contiene "\\" suelta`);
    if (/\b(Demo|Claude)\b/.test(html)) P(`${kind}/${key}.html: menciona "Demo" o "Claude"`);
  }

  // Estado editorial
  const R = c.review ?? {};
  const entries = [['default', R.default], ...Object.entries(R.pages ?? {})];
  for (const [k, r] of entries) {
    if (!r || !['source', 'draft', 'unreviewed', 'reviewed'].includes(r.status)) { P(`review.${k}: estado no válido`); continue; }
    if (r.status === 'source' && code !== DEFAULT_LOCALE) P(`review.${k}: solo el idioma de referencia (${DEFAULT_LOCALE}) puede ser "source"`);
    if (r.status === 'unreviewed' && (r.reviewer || r.date)) P(`review.${k}: una traducción sin revisar no puede llevar revisor ni fecha`);
    if (r.status === 'reviewed') for (const f of ['reviewer', 'date', 'scope']) if (!r[f]) P(`review.${k}: una revisión exige "${f}" (no se aceptan revisiones sin registrar)`);
  }
  return problems;
}

/** Reglas globales del registro de idiomas y mercados. */
export function validateWorld(world) {
  const problems = [];
  for (const l of Object.values(world.locales)) {
    if (l.status === 'enabled' && !world.content[l.code]) problems.push(`[${l.code}] habilitado sin contenidos`);
    if (!['ltr', 'rtl'].includes(l.dir)) problems.push(`[${l.code}] dirección no válida`);
    if (l.defaultCurrency === 'USD') problems.push(`[${l.code}] no se presupone USD como moneda por defecto`);
  }
  for (const m of Object.values(world.markets)) {
    if (m.verified && (!m.sources?.length || !m.verifiedAt)) problems.push(`[mercado ${m.id}] marcado como verificado sin fuentes ni fecha`);
    for (const l of m.locales) if (!world.locales[l]) problems.push(`[mercado ${m.id}] idioma desconocido ${l}`);
  }
  if (world.catalog) {
    const ids = world.catalog.map((e) => e.id);
    if (new Set(ids).size !== ids.length) problems.push('catálogo: ids repetidos');
    for (const e of world.catalog) {
      if (!world.catalogCategories?.includes(e.category)) problems.push(`catálogo: ${e.id} tiene una categoría desconocida (${e.category})`);
      if (!world.tools[e.id] && !['universal', 'fiscal'].includes(e.scope)) problems.push(`catálogo: ${e.id} en desarrollo sin "scope"`);
      if (!world.tools[e.id] && e.scope === 'fiscal' && !world.markets[e.market]) problems.push(`catálogo: ${e.id} fiscal sin mercado`);
      if (world.tools[e.id] && world.tools[e.id].category !== e.category) problems.push(`catálogo: ${e.id} no coincide con la categoría del registro`);
    }
    for (const id of Object.keys(world.tools)) if (!ids.includes(id)) problems.push(`catálogo: la calculadora ${id} del registro no está en el catálogo`);
    for (const id of Object.keys(world.categories)) if (!world.catalogCategories?.includes(id)) problems.push(`catálogo: la categoría ${id} del registro no está en el catálogo`);
  }
  for (const t of Object.values(world.tools)) if (t.scope === 'fiscal' && !world.markets[t.market]) problems.push(`[${t.id}] calculadora fiscal sin mercado`);
  // Un idioma solo puede pertenecer a un mercado genérico, y este no puede tener moneda propia ni declararse verificado.
  const generic = Object.values(world.markets).filter((m) => m.kind === 'generic');
  const seen = new Map();
  for (const m of generic) {
    if (m.currency) problems.push(`[mercado ${m.id}] el mercado genérico no fija moneda`);
    if (m.verified) problems.push(`[mercado ${m.id}] el mercado genérico no puede marcarse como verificado`);
    for (const l of m.locales) {
      if (seen.has(l)) problems.push(`[mercado ${m.id}] el idioma ${l} ya está en el mercado genérico ${seen.get(l)}`);
      seen.set(l, m.id);
      for (const o of Object.values(world.markets)) if (o.kind !== 'generic' && o.locales.includes(l)) problems.push(`[mercado ${m.id}] el idioma ${l} también pertenece al mercado de ${o.id}`);
    }
  }
  return problems;
}
