# Fase 4 · De 4 a 8 calculadoras (v0.10.0)

Rama: `fase4-cuatro-calculadoras` (no se ha tocado `main`). Modo desarrollo intacto: `SITE_INDEXABLE=false`, `noindex,nofollow` y `robots.txt` con `Disallow: /`.
No se ha modificado Cloudflare, DNS ni AdSense. Sin páginas legales ni consentimiento (otra fase).

## Qué se ha añadido

| Calculadora | Entradas | Resultado | Control |
|---|---|---|---|
| **Descuentos y precio final** | precio, descuento, segundo descuento (opcional) | precio final, ahorro, descuento efectivo, precio si se sumaran los porcentajes (error habitual) | 100 € con 20 % y 10 % → **72 €**, ahorro **28 €**, efectivo **28 %** |
| **Recargo sobre coste** | coste, recargo | precio sin impuestos, beneficio bruto, margen equivalente sobre ventas, precio que saldría si el mismo % fuera margen | 100 € al 25 % → **125 €**, **25 €**, margen **20 %** |
| **Punto de equilibrio** | costes fijos, precio, coste variable, unidades esperadas (opcional) | margen de contribución, unidades (redondeo hacia arriba), facturación, ratio de contribución, resultado esperado | 2.000 / 50 / 30 → **100 unidades**, 5.000 € |
| **ROI** | inversión inicial, retorno total (con la inversión recuperada) | beneficio/pérdida neta, ROI %, interpretación, multiplicador | 1.000 → 1.300 → **300** y **30 %** |

Cada una tiene ficha propia en los seis idiomas (24 fichas nuevas, además de las 24 existentes): calculadora interactiva, resultado destacado, desglose con barra,
fórmulas, ejemplos verificables, errores frecuentes, preguntas frecuentes y enlaces relacionados. Casos controlados con avisos comprensibles (nunca una división por cero ni
NaN/Infinity en pantalla): precio ≤ coste variable, costes fijos = 0, inversión = 0, resultados negativos, texto no numérico, porcentajes fuera de rango, importes por encima del límite del modelo.
El ROI aclara que no es ROAS, TIR ni rentabilidad anualizada y expone sus límites (no incluye el tiempo).

## Integración

- **Registro central** (`src/domain/registry.js`): las cuatro herramientas dejan de ser «Próximamente»; se añade el helper de campos opcionales y una **tercera categoría**,
  *Rentabilidad y crecimiento* (`/es/rentabilidad-y-crecimiento/`), con punto de equilibrio y ROI. Recargo y descuentos van en *Márgenes y precios*.
- **Fórmulas** (`src/domain/formulas.js`): una sola implementación compartida por el build, el navegador y las pruebas; no se ha cambiado ninguna fórmula existente.
  Se añaden `clean()` (elimina el ruido de coma flotante: 0,3 ÷ 0,1 = 3 y no 3,0000000000000004), campos opcionales y límites del modelo
  (importes hasta 10¹², recargos hasta 10⁶ %, resultados hasta 10¹⁵).
- **Catálogo, buscador, filtros, relacionadas, navegación, SEO y sitemap**: salen del registro. Las cuatro entradas «en desarrollo» correspondientes desaparecen
  del catálogo; el catálogo pasa de 4 a **8 disponibles** (de 16 anunciadas).
- **Rutas**: 6 idiomas × 14 páginas = **84 URLs** (antes 54). Las 54 URLs anteriores no cambian. Cada página nueva tiene `canonical` propio y `hreflang` recíproco.
- **Seis idiomas**: textos, etiquetas, resultados, validaciones, FAQ, metadatos (títulos ≤ 60 y descripciones ≤ 165 caracteres) y mensajes del catálogo.
  Slugs localizados, p. ej. `/de/aufschlagsrechner/`, `/fr/calculatrice-seuil-de-rentabilite/`, `/hi/break-even-calculator/`.
  Los idiomas no españoles conservan el estado editorial **sin revisión nativa (`unreviewed`)**; no se ha inventado ningún autor, experiencia ni revisión humana.
- **Formatos**: cada idioma usa su separador decimal y moneda; hindi con agrupación india (1,25,000) y entrada de dígitos devanagari (`१३००`).
- **Logotipo**: corregido el recorte del nombre en móviles de 320 a 414 px sin ocultar el selector de idioma ni el menú: de 320 a 480 px el icono de búsqueda cede su sitio
  (la búsqueda sigue en el catálogo, accesible desde el menú) y el nombre se ajusta con `clamp()`. En escritorio ancho (≥ 1601 px) se estrecha ligeramente el
  espaciado de los enlaces para que la barra con tres categorías quepa también con textos un 45 % más largos.

Diseño: no hay rediseño. Se usan los componentes y colores existentes.

## Pruebas realizadas (todas en verde)

| Prueba | Resultado |
|---|---|
| `npm test` (fórmulas previas con sus fixtures, nuevas de Fase 4, i18n, idiomas, catálogo, contenidos, código fuente) | 133 + **456** + 207 + 868 + 72 comprobaciones; contenidos coherentes en 6 idiomas; código fuente (84 URLs) |
| `scripts/test-fase4.mjs` (nuevo) | Ejemplos de control y resueltos, decimales, ceros, extremos, porcentajes negativos o >100 %, división por cero, no finitos, redondeo (437,5 → 438), límites del modelo, entradas erróneas, entrada numérica en los 6 idiomas (incluida agrupación india y devanagari) y presentación en 6 idiomas × 4 herramientas × varios casos sin `NaN`, `Infinity`, `undefined` ni marcadores sin sustituir |
| Cuatro calculadoras anteriores | Mismos resultados (fixtures y pruebas previas sin tocar). Comparado el HTML de las 24 fichas antiguas con el anterior: formulario y textos idénticos (solo se añaden claves nuevas al JSON) |
| `check-site` · `check-languages` | 84 páginas, metadatos, enlaces, sitemap con hreflang, `noindex` y bloqueo de `robots.txt`; 5.552 comprobaciones de idioma, selector, hreflang recíproco y canonical |
| Chromium · selector de idioma | 2.023 comprobaciones (6 idiomas × 14 páginas, escritorio y móvil, teclado, sin JS) |
| Chromium · comportamiento | 438 comprobaciones: buscador, filtros del catálogo, menú compacto, calculadoras y botón de copiar |
| Chromium · accesibilidad y contraste | 510 mediciones en 85 páginas |
| Chromium · maquetación | Sin desplazamiento horizontal a 320, 375, 390, 768, 1024, 1440 y 1920 px, en RTL simulado y con textos +45 % (ver nota) |
| Logotipo | Sin recorte a 320, 340, 360, 375, 390 y 414 px en los 6 idiomas |
| Consola | 0 errores en las 32 páginas capturadas |

Las pruebas de navegador usan solo elementos visibles y se adaptan al menú compacto.

## Limitación del entorno

`npm` estaba bloqueado (HTTP 403 del proxy al registro), por lo que **no se pudo ejecutar `astro build`**. Las comprobaciones de navegador se hicieron sobre la salida de
`tools/render-preview.mjs`, que replica las plantillas sin Astro (es una aproximación, no la salida real). **GitHub Actions debe confirmar**:

1. `npm ci` y `npm run build` sin errores.
2. `npm run test:dist` (`check-site`, `check-languages`) sobre el HTML real de Astro: 84 páginas, canonical, hreflang, sitemap, `noindex`.
3. `npm run test:layout`, `test:switcher` y las comprobaciones de comportamiento/accesibilidad sobre `dist/`.
4. Que los artefactos `screenshots` y `dist` se vean como las capturas adjuntas (el CSS de Astro lo empaqueta distinto).

## Pendiente (otras fases)

Revisión nativa de los textos de en, pt-br, de, fr y hi; páginas legales; consentimiento; activar la indexación (`SITE_INDEXABLE=true`).
