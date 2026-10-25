# PRUEBAS — Fase 7A

**Límite principal, léelo primero:** en este entorno el registro npm está bloqueado, así que **no se pudo ejecutar `npm ci` ni `astro build`**. El HTML sobre el que se hicieron las pruebas lo genera `tools/render-preview.mjs` (mismas funciones de rutas, contexto, textos y plantillas `.astro` traducidas por un compilador propio), **no es la salida real de Astro**. La comprobación definitiva es la acción «Build y pruebas» de GitHub al abrir el PR.

## 1. Pruebas del repositorio (`npm test`, sin Astro) — todas OK

| Prueba | Resultado |
|---|---|
| Fórmulas (`test-calculators`) | 133 OK |
| Fase 4: fórmulas, límites, 6 idiomas (`test-fase4`) | 456 OK |
| i18n (`test-i18n`) | 207 OK |
| Idiomas (`test-languages`) | 1030 OK (incluye sitemap = 84, 114 rutas, catálogo 8/8/0 en los 6 idiomas) |
| Catálogo (`test-catalog`) | 75 OK |
| `check-i18n` | contenidos de 6 idiomas coherentes (incluye las 5 cadenas `trust.*`) |
| `check-source` | OK, 114 URL |
| `check-privacy` (código fuente) | sin cookies, almacenamiento ni recursos de terceros |

Las ocho calculadoras **mantienen sus resultados**: las pruebas de fórmulas con valores de referencia (133 + 456) pasan sin tocar `formulas.js`, `registry.js`, `numbers.js` ni `src/scripts/`; además las **48 páginas de calculadora (8 × 6 idiomas) son idénticas al HTML anterior** (comparación con espacios normalizados) salvo la franja de confianza añadida.

## 2. Sobre la vista previa (114 páginas + 404 + índice)

| Requisito | Resultado |
|---|---|
| Comprobación de las 114 URL (`check-site`) | OK: 114 páginas con title, description, canonical, lang, un h1, enlaces internos y anclas válidos |
| Sitemap con exactamente 84 URL | OK (84 `<loc>`, sin duplicados, ninguna legal); idéntico byte a byte al de la versión anterior |
| 30 legales con `noindex` | OK (`noindex,follow`; ninguna en el sitemap) |
| 84 contenidos con `index,follow` | OK (`index,follow,max-image-preview:large`, igual que antes) |
| hreflang | 7 por página (6 idiomas + x-default) en las 114; canonical/hreflang/robots **idénticos** a la versión anterior en las 114 |
| Sin enlaces rotos | OK (`check-site`, `check-languages`: 8210 comprobaciones) |
| Textos pendientes/obsoletos | 0 apariciones en las 114 páginas de: `legal-pending`, «[PENDIENTE…]» en 5 idiomas, demo/borrador, «en desarrollo» (6 idiomas), «antes de la publicación» (6 idiomas), «correo operativo» (6 idiomas), `devnote`, `{{`, `undefined`, `NaN` |
| Franja de confianza | presente con fecha `<time datetime>` en 8 calculadoras × 6 + Metodología × 6 (54 páginas) |
| Portada y catálogo | 8 tarjetas, sin filtro de estado ni «en desarrollo» |
| Privacidad (`check-privacy`) | sin cookies, almacenamiento ni terceros (218 archivos HTML revisados, incluye copias de la vista previa) |
| Inventario | `INVENTARIO-URL-FASE7A.csv` (114 filas: robots, sitemap, nº de hreflang, h1, franja) |

Comparación con la versión anterior: títulos idénticos en las 114; meta descripciones distintas solo en 12 páginas (6 «Calculadoras» y 6 «Contacto», cambio intencionado).

## 3. En navegador (Chromium de Playwright sobre la vista previa)

| Prueba | Resultado |
|---|---|
| Sin desplazamiento horizontal (`check-layout`) | OK: 115 páginas × 7 anchos (incluye 320 y 375/390 px) × modo normal y +45 % de texto (y RTL en español): 5250 mediciones |
| Comportamiento y errores de consola (`check-behavior`) | OK: 318 comprobaciones; calculadoras, copiar, buscador, filtros y **ningún error de JavaScript** |
| Accesibilidad básica (`check-a11y`) | OK (690 mediciones). 25 avisos informativos de objetivo táctil < 44 px en los enlaces de la franja de confianza (27 px de alto, cumplen los 24 px de WCAG 2.5.8; el umbral de 44 px es AAA). No bloquean. |
| Selector de idioma (`check-switcher`) | OK: 2563 comprobaciones. **Una primera ejecución falló** con un error puntual de lectura del atributo `lang` durante una navegación; se repitió 3 veces seguidas sin fallo (y pasa sobre la versión anterior): se considera intermitencia del arnés, no un defecto, pero queda declarado. |
| Capturas de revisión visual | portada/catálogo y ficha en móvil (390 px) revisadas a ojo: diseño azul oscuro/lima intacto |

Nota: tras estas ejecuciones solo se cambió el texto breve de la categoría «Rentabilidad y crecimiento» (ES/EN/PT/DE); se repitieron después `npm test`, `check-site`, `check-languages` y `check-privacy`, todos OK, pero **no** se repitieron las pruebas de navegador con ese último texto.

## 4. Comprobaciones de seguridad del cambio

* Archivos de código sin cambios: `formulas.js`, `registry.js`, `numbers.js`, `routes.js`, `sitemap.js`, `BaseLayout.astro`. Cambios **solo de comentarios** (verificado quitando comentarios y comparando): `publish.js`, `seo.js`, `site.js`, `locales.js`, `legal.js`, `markets/es.js`, `_redirects`, `build.yml`, `astro.config.mjs`, `*/review.js`.
* Control negativo: las nuevas comprobaciones de `check-site` **fallan con 192 incidencias** sobre la vista previa de la versión anterior y pasan sobre la nueva.

## 5. No realizado / imposible aquí

`npm ci`, `astro build`, `npm run test:dist` sobre el `dist/` real, `npm audit`; GitHub Actions de esta rama; vista previa y variables de Cloudflare; Lighthouse móvil/INP; Search Console; revisión lingüística nativa; comprobación de cookies en el dominio real.
