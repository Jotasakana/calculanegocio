// Pruebas del catálogo de 18 calculadoras: estado derivado del registro, ausencia de URLs para las que están en
// desarrollo, mercados fiscales, marcadores de texto, índice de apartados y contexto de página. No requiere Astro.
import { REAL_WORLD, isPublished } from '../src/i18n/publish.js';
import { routeTable, pathFor } from '../src/i18n/routes.js';
import { CATALOG, CATALOG_CATEGORIES, FEATURED_TOOLS } from '../src/domain/catalog.js';
import { TOOL_REGISTRY } from '../src/domain/registry.js';
import { ICON_PATHS } from '../src/lib/icons.js';
import { buildCatalog, STATUS } from '../src/lib/catalog.js';
import { buildContext } from '../src/lib/context.js';
import { fill } from '../src/lib/fill.js';
import { withToc } from '../src/lib/toc.js';
import { validateLocale } from '../src/i18n/validate.js';

let fails = 0, total = 0;
function check(name, got, want) {
  total++;
  if (String(got) !== String(want)) { fails++; console.error(`✗ ${name}\n   obtenido: ${got}\n   esperado: ${want}`); }
}
const throws = (fn) => { try { fn(); return false; } catch { return true; } };

// 1. El plan: 18 calculadoras, ids únicos, icono válido, categorías conocidas
check('catálogo: 18 calculadoras', CATALOG.length, 18);
check('catálogo: ids únicos', new Set(CATALOG.map((e) => e.id)).size, 18);
check('catálogo: todos los iconos existen', CATALOG.every((e) => ICON_PATHS[e.icon]), true);
check('catálogo: categorías válidas', CATALOG.every((e) => CATALOG_CATEGORIES.includes(e.category)), true);
check('catálogo: las calculadoras del registro están en el plan', Object.keys(TOOL_REGISTRY).every((id) => CATALOG.some((e) => e.id === id)), true);
check('catálogo: la categoría del plan coincide con la del registro', Object.entries(TOOL_REGISTRY).every(([id, t]) => CATALOG.find((e) => e.id === id).category === t.category), true);
check('destacadas: existen en el registro', FEATURED_TOOLS.every((id) => TOOL_REGISTRY[id]), true);
check('plan: las pendientes declaran ámbito', CATALOG.filter((e) => !TOOL_REGISTRY[e.id]).every((e) => e.scope === 'universal' || (e.scope === 'fiscal' && e.market)), true);

// 2. Español real: 18 = 4 disponibles + 14 en desarrollo; categorías 6/4/4/4
const es = buildContext('es');
check('es: total', es.catalog.counts.total, 18);
check('es: disponibles', es.catalog.counts.available, Object.keys(TOOL_REGISTRY).length);
check('es: en desarrollo', es.catalog.counts.planned, 18 - Object.keys(TOOL_REGISTRY).length);
check('es: tamaños de categoría', es.catalog.categories.map((c) => c.total).join('/'), '6/4/4/4');
check('es: categorías con página = las del registro', es.catalog.categories.filter((c) => c.path).map((c) => c.id).join(), Object.keys(REAL_WORLD.categories).join());
check('es: las categorías sin calculadoras disponibles no tienen página', es.catalog.categories.filter((c) => c.available === 0).every((c) => c.path === null), true);
check('es: cada tarjeta tiene título, descripción e icono', es.catalog.items.every((i) => i.title && i.desc && ICON_PATHS[i.icon]), true);

// 3. Nada «en desarrollo» tiene URL, ni en el catálogo ni en la tabla de rutas, el buscador o el sitemap
const urls = new Set(routeTable().map((r) => r.path));
const planned = es.catalog.items.filter((i) => i.status === STATUS.planned);
const available = es.catalog.items.filter((i) => i.status === STATUS.available);
check('planned: sin ruta en el catálogo', planned.every((i) => i.path === null && i.cta === null), true);
check('planned: no existe su clave de página', planned.every((i) => !REAL_WORLD.tools[i.id] && !isPublished('es', 'tool:' + i.id)), true);
check('planned: pathFor falla (no hay slug)', planned.every((i) => throws(() => pathFor('es', 'tool:' + i.id))), true);
check('available: toda ruta existe en la tabla', available.every((i) => urls.has(i.path)), true);
check('buscador: solo contiene páginas publicadas', es.searchIndex.every((s) => urls.has(s.url)), true);
check('buscador: no incluye las calculadoras en desarrollo', planned.every((p) => !es.searchIndex.some((s) => s.title === p.title)), true);
check('URLs españolas conservadas', [...urls].filter((u) => u.startsWith('/es/') && /calculadora|margen|facturacion/.test(u)).sort().join(' '), '/es/calculadora-base-imponible/ /es/calculadora-margen-comercial/ /es/calculadora-precio-de-venta/ /es/facturacion/ /es/margen-bruto-y-margen-neto/ /es/margenes-y-precios/');

// 4. Estado derivado del registro y mercados (mundo sintético)
const synth = (extra = {}) => {
  const world = structuredClone(REAL_WORLD);
  world.locales.xx = { ...world.locales.es, code: 'xx', status: 'enabled' };
  world.content.xx = structuredClone(world.content.es);
  return Object.assign(world, extra);
};
const yes = () => true;
const at = (k) => '/p/' + k.replace(':', '-') + '/';
{
  const w = synth();
  const xx = buildCatalog(w, 'xx', yes, at);
  const fiscalPlanned = CATALOG.filter((e) => e.scope === 'fiscal' && !TOOL_REGISTRY[e.id]).map((e) => e.id);
  check('mercado: las fiscales pendientes no salen fuera de su mercado', fiscalPlanned.every((id) => !xx.items.some((i) => i.id === id)), true);
  check('mercado: las universales pendientes sí salen', xx.items.some((i) => i.id === 'recargo' && i.status === STATUS.planned), true);
  w.markets.es = { ...w.markets.es, locales: ['es', 'xx'] };
  const xx2 = buildCatalog(w, 'xx', yes, at);
  check('mercado: dentro de su mercado salen las fiscales pendientes', fiscalPlanned.every((id) => xx2.items.some((i) => i.id === id)), true);
}
{
  // Promocionar una calculadora = añadirla al registro: pasa a «disponible» sin tocar el catálogo
  const w = synth();
  w.tools.recargo = { ...structuredClone(w.tools.margen), id: 'recargo', category: 'margenes-y-precios', scope: 'universal' };
  w.content.es.tools.recargo = { ...structuredClone(w.content.es.tools.margen), menuTitle: 'Recargo', title: 'Recargo', tileText: 'x', tileCta: 'Ir', search: 'recargo' };
  const c = buildCatalog(w, 'es', yes, at);
  const item = c.items.find((i) => i.id === 'recargo');
  check('registro: una calculadora nueva pasa a disponible', item.status, STATUS.available);
  check('registro: y obtiene su ruta', item.path, at('tool:recargo'));
  check('registro: los contadores se actualizan', `${c.counts.available}/${c.counts.planned}`, `${es.catalog.counts.available + 1}/${es.catalog.counts.planned - 1}`);
}
{
  // Un idioma sin texto para una calculadora pendiente no la muestra (no se promete algo sin traducir)
  const w = synth();
  delete w.content.xx.catalog.planned.roi;
  const c = buildCatalog(w, 'xx', yes, at);
  check('idioma sin texto: la pendiente no se muestra', c.items.some((i) => i.id === 'roi'), false);
  // y la validación avisa
  const problems = validateLocale('xx', w, { readFragment: () => '' }).join('\n');
  check('validación: avisa del texto que falta', /roi/.test(problems), true);
}

// 5. Ayudantes
check('fill: sustituye marcadores', fill('{a} de {b}', { a: 4, b: 18 }), '4 de 18');
check('fill: repite un marcador', fill('{a}{a}', { a: 'x' }), 'xx');
check('fill: falla si falta un valor', throws(() => fill('{a} {b}', { a: 1 })), true);
{
  const r = withToc('<h2 class="sec">Uno &amp; dos</h2><p>x</p><h2 class="sec"><em>Tres</em></h2>');
  check('toc: ids secuenciales', r.toc.map((t) => t.id).join(), 'sec-1,sec-2');
  check('toc: títulos sin etiquetas', r.toc.map((t) => t.title).join('|'), 'Uno & dos|Tres');
  check('toc: el HTML lleva los ids', r.html.includes('<h2 class="sec" id="sec-2">'), true);
  check('toc: sin apartados, sin índice', withToc('<p>x</p>').toc.length, 0);
}

// 6. Contexto de las fichas: fórmulas, preguntas, aviso fiscal y moneda
for (const t of es.tools) {
  check(`ficha ${t.id}: fórmulas`, t.formulas.length >= 2 && t.formulas.every((f) => f.length === 2 && f[0] && f[1]), true);
  check(`ficha ${t.id}: preguntas frecuentes`, t.faq.length >= 3 && t.faq.every((f) => f.length === 2 && f[0] && f[1]), true);
  check(`ficha ${t.id}: la tarjeta del catálogo coincide`, es.catalog.items.find((i) => i.id === t.id).path, t.path);
  check(`ficha ${t.id}: relacionadas publicadas`, t.related.every((r) => es.toolById[r]), true);
}
check('fiscal pendiente: se avisa mientras el mercado no esté verificado', es.tools.filter((t) => t.scope === 'fiscal').every((t) => t.fiscalPending === !REAL_WORLD.markets.es.verified), true);
check('destacadas publicadas', es.featuredTools.map((t) => t.id).join(), FEATURED_TOOLS.join());
check('ejemplo de las fichas coincide con el motor (margen 60 → 100)', (() => {
  const calc = es.calculator('EUR');
  const r = calc.compute('margen', 0, { cost: '60', price: '100', quantity: '1' });
  return `${Math.round(r.data.margin * 100) / 100}/${Math.round(r.data.markup * 100) / 100}`;
})(), '40/66.67');

console.log(fails ? `${fails} de ${total} comprobaciones fallan` : `OK · ${total} comprobaciones del catálogo superadas`);
process.exit(fails ? 1 : 0);
