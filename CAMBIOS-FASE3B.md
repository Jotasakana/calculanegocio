# CAMBIOS — Fase 3B: alemán, francés e hindi (v0.9)

Rama: `fase3b-idiomas-de-fr-hi`, creada desde el `main` actual (`16efb2d`, fusión de la Fase 3A; el ZIP recibido es idéntico a ese commit).
No se ha tocado `main`, no se ha publicado nada en Cloudflare Pages y no se ha subido nada a GitHub.

## Qué se ha hecho

- **Tres idiomas nuevos y completos**: `/de/` (Deutsch), `/fr/` (Français) y `/hi/` (हिन्दी). Cada uno con las **9 páginas** (portada, catálogo,
  metodología, 2 categorías y las 4 calculadoras): 27 páginas nuevas, 54 en total. Textos de interfaz, campos, resultados, mensajes de error,
  fórmulas, ejemplos, preguntas frecuentes, metodología, pie, etiquetas de accesibilidad, títulos SEO y metadescripciones.
  Una sola aplicación Astro: mismas plantillas, mismas fórmulas, mismos componentes. **No se ha modificado ninguna plantilla `.astro` ni el diseño.**
- **Selector de idioma** con los seis idiomas (Español, English, Português (Brasil), Deutsch, Français, हिन्दी) en ese orden. Ya era un componente
  con enlaces reales; solo ha hecho falta registrar los idiomas. Escritorio: globo + nombre del idioma; móvil: globo + abreviatura (ES, EN, PT, DE, FR, HI).
  Lleva a la página equivalente y, si no existe, a la portada. Sin JavaScript funciona (es un `<details>`). Sin redirecciones por IP ni por idioma del navegador.
  Cambio mínimo de CSS: el desplegable no puede ser más alto que la ventana (`max-block-size`) y se desplaza por dentro en móviles horizontales.
- **Impuestos**: `de`, `fr` y `hi` usan el **mercado genérico** (el de `en` y `pt-br`): el usuario escribe el porcentaje, ejemplo del 10 %, aviso visible de que no
  equivale a un cálculo fiscal local, moneda elegible y sin insignia de país. **No hay calculadora de Umsatzsteuer/MwSt, TVA ni GST**, ni tipos ni autoridades de
  esos países en los textos. IRPF y recargo de equivalencia (solo España) no aparecen fuera de `es`. Las cuatro calculadoras no han cambiado de fórmulas.
- **Monedas y formatos**: `de` y `fr` no presuponen moneda (se elige en el selector; EUR, CHF, CAD… están en la lista). `hi` usa INR por defecto.
  Alemán `1.250,50 €` · francés `1 250,50 €` (espacio fino insécable) · hindi `₹12,34,567.50` (agrupación india, dígitos latinos, punto decimal).
  **Lectura de números nueva**: en hindi se acepta `12,34,567.50` y también `1,250,000.50` y dígitos devanagari (`१२,३४,५६७`); en francés, el espacio fino
  U+202F y el de no ruptura U+00A0 (por si se pega un resultado copiado); en alemán el apóstrofo suizo (`1’250,50`). Función `usesIndianGrouping` en `src/i18n/numbers.js`.
- **Hindi**: escritura devanagari de izquierda a derecha (`dir="ltr"`, sin invertir la interfaz). CSS `:lang(hi)`: más altura de línea en títulos (1,38), botones, pestañas,
  etiquetas y tarjetas para que no se corten matras ni líneas superiores; las cifras y fórmulas no se parten. Pila de fuentes del sistema ampliada
  (Noto Sans Devanagari, Nirmala UI, Kohinoor Devanagari, Devanagari Sangam MN, Mangal). No se descarga ninguna fuente. Alemán: guionado automático y `overflow-wrap` en títulos y botones.
- **SEO internacional**: `lang`, canonical propio, `hreflang` recíproco (`es, en, pt-BR, de, fr, hi, x-default = es`), `og:locale`, sitemap con las seis versiones (54 URLs, 7 enlaces
  alternativos por URL). Slugs ASCII traducidos (alemán: ä→ae; hindi: romanizado). **`SITE_INDEXABLE=false`, `noindex,nofollow` y `robots.txt` con `Disallow: /` se mantienen. No se ha solicitado AdSense.**
- **Estado editorial**: las tres traducciones son `unreviewed` (hechas con IA, **sin revisión nativa**; no se registra ningún revisor). Se publican **solo** mientras `SITE_INDEXABLE` ≠ `true`;
  al activar la indexación desaparecen solas hasta que una persona nativa las revise y se anote como `reviewed` en `src/locales/<idioma>/review.js`. El cartel de la demo lo indica en cada idioma.
- **Corrección de un fallo latente de la 3A** (`src/i18n/publish.js`): con `SITE_INDEXABLE=true` los idiomas sin revisar no generan páginas, pero el selector los seguía listando y habría
  llevado a 404 (y hreflang/sitemap apuntaban a páginas inexistentes). Ahora `publishedLocales` exige al menos una página publicada: con la indexación activada solo queda `es`, sin selector ni hreflang.
  Con la indexación desactivada (el modo actual) no cambia nada. Está cubierto por pruebas nuevas.
- Versión `v0.9` (cartel de la demo y `package.json`). En `es`, `en` y `pt-br` solo cambian dos cadenas: el cartel de la demo (`v0.9`) y la frase «Disponible en varios idiomas» de la portada, que ahora enumera los seis idiomas.
- Las **14 herramientas restantes** del catálogo siguen como «En desarrollo», sin enlace, en los seis idiomas. No se ha desarrollado ninguna calculadora nueva.

## Archivos
Nuevos: `src/locales/de/`, `src/locales/fr/`, `src/locales/hi/` (cada uno: `ui.js`, `tools.js`, `messages.js`, `catalog.js`, `review.js`, `index.js`, 4 `articles/*.html`, 3 `pages/*.html`).
Modificados: `src/i18n/locales.js` (de, fr y hi pasan a `enabled`; orden del selector), `src/locales/index.js`, `src/markets/es.js` (mercado genérico), `src/i18n/numbers.js` y `src/lib/present.js` (agrupación india),
`src/i18n/publish.js` (corrección anterior), `src/styles/site.css`, pruebas (`test-i18n`, `test-languages`, `check-languages`, `check-site`, `check-switcher`, `check-layout`), `.github/workflows/build.yml` (límite de 10 → 30 min),
`README.md`, `docs/INTERNACIONALIZACION.md`, `INSTRUCCIONES-GITHUB-DESKTOP.md`, `package.json`, y la cadena `devLabel` de `es`, `en` y `pt-br`.

## Pruebas: qué se ha ejecutado de verdad
**No se pudo ejecutar `npm ci`, `astro build` ni `npm run build`**: en este entorno el registro de npm no resuelve (DNS bloqueado). Por eso **la validación definitiva de la compilación real de Astro queda
para GitHub Actions**. No se ha modificado ningún archivo `.astro`, así que el riesgo se limita a la compilación de los CSS/JS y de los HTML de contenido nuevos. En su lugar se usó `tools/render-preview.mjs`
(el renderizador sin Astro del propio proyecto: genera el mismo HTML con otra herramienta, **no** es salida de Astro) y Chromium/Playwright reales sobre esas 54 páginas + 404:

| Prueba | Resultado |
|---|---|
| `npm test` (fórmulas, i18n, idiomas, catálogo, coherencia de contenidos, código fuente) | 133 + 197 + 628 + 56 comprobaciones, contenidos de 6 idiomas coherentes, 54 URLs |
| `check-site` (metadatos, h1, enlaces internos, anclas, robots, sitemap) | OK · 54 páginas |
| `check-languages` (lang, canonical, hreflang recíproco, selector, enlaces dentro del idioma, restos de otro idioma, devanagari en hindi) | OK · 3.162 comprobaciones |
| `check-switcher` (Chromium: visible 320–1440, abrir/cerrar con clic/Escape/fuera, teclado, sin JS, pantallas bajas, 6×9×6 cambios de idioma sin 404, idioma persistente, sin detección automática) | OK · 1.483 comprobaciones |
| `check-a11y` (nombres accesibles, ids, encabezados, objetivos táctiles, contraste) | OK · 330 mediciones en 55 páginas |
| `check-behavior` (buscador, filtros, tarjetas, calculadoras, botón copiar, en los 6 idiomas) | OK · 408 comprobaciones |
| `check-layout`: 55 páginas × 7 anchos (320, 375, 390, 768, 1024, 1440, 1920) × normal y textos +45 %, con menú móvil y selector abiertos (RTL simulado solo en español) | OK · 2.400 mediciones sin desbordamiento horizontal |
| URLs anteriores | las 27 URLs de `es`, `en` y `pt-br` se conservan (comparado con el ZIP original) |
| Cifras de los ejemplos | las cifras de los 12 artículos de `de`, `fr` y `hi` coinciden con las del inglés (comprobado por script) |

Las pruebas de navegador esperan al menú compacto (el menú horizontal pasa a hamburguesa por debajo de 1600 px) y solo pulsan enlaces visibles. `check-layout` ahora mide varias páginas a la vez (≈2 min en lugar de >10).
**Hindi en las capturas**: este entorno no tiene fuentes devanagari «oficiales»; Chromium usó FreeSans de reserva. En tu móvil o PC se verá con la fuente del sistema (Nirmala UI, Noto, Kohinoor…), con trazos algo distintos pero la misma maquetación.
Las capturas de este paquete son de ese renderizado; las oficiales saldrán del artefacto `screenshots` de GitHub Actions.

## Pendiente / a tener en cuenta
1. **Revisión nativa** de las tres traducciones antes de indexar (alemán, francés, hindi), con una persona que lo apruebe y se registre en `review.js`. Puntos que conviene mirar: en francés, «taux de marque» (margen sobre ventas)
   frente a «taux de marge» (recargo sobre coste); en hindi «परिचालन ख़र्च», «सकल लाभ» y «कर आधार»; en alemán «Nettobetrag» como nombre genérico de la base imponible.
   El ejemplo del 10 % coincide con un tipo real de TVA en Francia; solo se presenta como cifra de ejemplo editable.
2. **GitHub Actions** debe validar `npm ci`, `npm test`, `npm run build`, `npm run test:dist` y las pruebas de navegador. Si el job de capturas tarda mucho (ahora genera ~240 capturas) se puede reducir en `scripts/screenshots.mjs`.
3. **Cabecera en móvil**: en todos los idiomas (también `es`, `en`, `pt-br`, ya en la 3A) el logotipo se recorta con puntos suspensivos («CalculaN…») entre 320 y 414 px porque la cabecera lleva buscador, selector y menú.
   No se ha tocado para respetar el diseño aprobado. Si quieres evitarlo basta ocultar el icono de búsqueda por debajo de 480 px (una línea de CSS).
4. `/` sigue redirigiendo (302) a `/es/`; con seis idiomas lo recomendable es una página de elección de idioma sin redirección automática (decisión para una fase posterior).
5. Fuentes propias para devanagari alojadas en el sitio (opcional) y el banner de consentimiento antes de AdSense, como ya estaba anotado en `docs/INTERNACIONALIZACION.md`.
6. Las páginas legales y de contacto siguen pendientes (marcadas «pendiente» en el pie en los seis idiomas).
