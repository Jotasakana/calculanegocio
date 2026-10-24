# CAMBIOS — Fase 3A: español, inglés y portugués de Brasil (v0.8)

Rama sugerida: `fase3a-idiomas-en-ptbr` (creada desde el `main` del ZIP recibido; no se ha tocado `main` ni la web pública).

## Qué se ha hecho
- **Idiomas publicados**: `es` (sin cambios de URL ni fórmulas), `en` → `/en/…`, `pt-br` → `/pt-br/…`. Las 9 páginas de cada idioma
  (portada, catálogo, metodología, 2 categorías, 4 calculadoras) con textos, fórmulas, ejemplos, FAQ, meta títulos/descripciones,
  etiquetas de accesibilidad y mensajes de error propios. Slugs traducidos. Una sola app Astro; mismas fórmulas y plantillas.
- **Selector de idioma** en la cabecera (🌐 Español ▾), a la derecha del menú; en móvil muestra la abreviatura (ES/EN/PT) junto al
  botón de menú, siempre visible. Lista los 3 idiomas con su nombre propio; lleva a la **página equivalente** y, si no existe, a la
  portada de ese idioma. Son enlaces reales (funciona sin JavaScript); se cierra con Escape/clic fuera; sin detección por IP ni navegador.
  También está en el 404.
- **SEO**: `lang`, canonical propio, `hreflang` recíproco (`es`, `en`, `pt-BR`, `x-default`=es) y sitemap con alternativas;
  `og:locale`; **`SITE_INDEXABLE=false`, `noindex,nofollow` y `robots.txt` Disallow se mantienen**. `/` sigue redirigiendo (302) a `/es/`.
- **Impuestos (decisión importante)**: *precio con IVA* y *base imponible* siguen siendo calculadoras de España en `es`. En `en` y `pt-br`
  se ofrecen como **versión genérica** (nuevo mercado `generic`): aplican el porcentaje que escribe la persona (ejemplo editable del 10 %),
  sin tipos ni normas de ningún país, con aviso visible, moneda elegible y sin insignia de país. **No hay herramientas fiscales brasileñas.**
  IRPF y recargo de equivalencia (solo España) no aparecen fuera de `es`. En pt-br el texto avisa de que tributos como ICMS/ISS tienen reglas propias.
- **Monedas/formatos**: `es` EUR; `en` sin moneda presupuesta (nunca USD; elegible); `pt-br` BRL. Separadores, % y lectura de números por idioma.
- **Estado editorial nuevo `unreviewed`**: traducciones hechas con IA, sin revisión nativa. Se publican **solo con `SITE_INDEXABLE` ≠ `true`**;
  al activar la indexación desaparecen solas hasta que una persona nativa las revise y se registre como `reviewed` (con revisor, fecha y
  alcance en `src/locales/<idioma>/review.js`). No se ha simulado ninguna revisión. El cartel de la demo lo indica.
- Cambios mínimos en español: versión `v0.8`, la 4ª ventaja de la portada («Disponible en varios idiomas»), la FAQ «fuera de España» y el
  aviso genérico (clave nueva `tool.genericTax`).
- Cabecera: el botón «Usar calculadoras» y el texto de «Buscar» ceden sitio por debajo de 1560 px y el menú pasa a hamburguesa por debajo de
  1400 px, para que ningún enlace quede recortado con el selector.

## Archivos principales
`src/locales/en/`, `src/locales/pt-br/` (nuevos) · `src/components/LanguageSwitcher.astro`, `Header.astro`, `site.css`, `site.js` ·
`src/i18n/publish.js` (`unreviewed`, `marketFor`) · `src/markets/es.js` (mercado `generic`) · `src/lib/context.js`, `catalog.js`, `present.js`
(`defaults` por idioma) · `registry.js` (`genericRate`) · pruebas: `test-languages.mjs`, `check-languages.mjs`, `check-switcher.mjs` (nuevas) y ajustes en el resto · `.github/workflows/build.yml`.

## Pruebas realizadas (en este entorno)
`npm` no puede descargar paquetes aquí (el registro está bloqueado), así que **no se pudo ejecutar `astro build`**. Se verificó con
`tools/render-preview.mjs` (aproximación del HTML, mejorada con robots/sitemap) + Chromium/Playwright reales:
- `npm test`: 133 fórmulas (las 4 calculadoras sin cambios) · 178 i18n · 306 idiomas · 56 catálogo · coherencia de contenidos · código fuente.
- Sobre el HTML generado: `check-site` (27 páginas) y `check-languages` (lang, selector, hreflang recíproco, canonical, enlaces, restos de otro idioma).
- Chromium: `check-behavior` (207, los 3 idiomas), `check-switcher` (499: visible 320–1440 px, abrir/cerrar, teclado, sin JS, 3×9 cambios de página sin 404,
  idioma persistente, sin cambio automático), `check-a11y` (168 mediciones, también con el selector abierto), `check-layout` (28 páginas × 8 anchos
  [320,360,375,390,768,1024,1280,1440] × normal/RTL/textos +45 % × menú y selector abiertos: 1932 mediciones sin desbordamiento).
- Capturas: portada, catálogo, categoría, fichas, metodología en 320/375/390/768/1440 px por idioma; selector abierto (escritorio, 320/375/390); calculadoras.

## Qué debe comprobar GitHub Actions (build real de Astro)
`npm ci && npm test && npm run build && npm run test:dist`, y los pasos de Chromium (layout, a11y, behavior, switcher). Puntos de atención posibles:
el empaquetado de CSS/JS de Astro (la lógica es la misma) y que `import.meta.glob` cargue `src/locales/{en,pt-br}/…` (mismo patrón que `es`).

## Limitaciones y pendientes
- **Traducciones sin revisión nativa** (en, pt-br): revisarlas antes de indexar; el pt-br de contenido fiscal/contable en particular.
- Calculadoras genéricas de impuesto: validar la redacción con un contador antes de lanzar en Brasil.
- Páginas legales (aviso legal, privacidad, contacto) y CMP para AdSense siguen pendientes.
- El 404 es único (idioma español) por limitación de Cloudflare Pages; lleva selector de idioma.
- `/` redirige a `/es/` (se mantiene la decisión previa); una página de elección de idioma es opcional más adelante.
- Fuera del alcance: las 14 calculadoras nuevas, más idiomas (fr, de, it…).
