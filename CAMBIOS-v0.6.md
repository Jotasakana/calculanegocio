# v0.6 · Fase 2A · Arquitectura internacional

Rama `fase2a-i18n-arquitectura`. **No se ha fusionado ni publicado.** Modo desarrollo intacto (noindex + `Disallow`).

## Qué cambia

* **Nueva arquitectura** (ver `docs/INTERNACIONALIZACION.md`): lógica pura (`src/domain`), idiomas (`src/i18n`, `src/locales`),
  mercados fiscales (`src/markets`), presentación (`src/lib/present.js`) y vistas compartidas (`src/views`, `src/components`).
* **Una plantilla** (`src/pages/[...slug].astro`) genera todas las páginas desde la tabla de rutas. Desaparecen las 8 páginas
  `src/pages/es/**`; las URLs españolas son idénticas.
* **`/` → `/es/`** (302 temporal en `public/_redirects`, con respaldo meta-refresh). `/es/` es la nueva portada (el diseño de la Home v0.3).
* **Catálogo** con filtros por categoría y búsqueda; **barra visual** de composición en cada resultado; **selector de moneda** en las
  calculadoras universales (margen, rentabilidad); selector de idioma que solo aparece si hay más de un idioma publicado.
* **CSS** (`src/styles/site.css`) convertido a propiedades lógicas, con soporte RTL, escrituras no latinas y sin desbordes.
* Las explicaciones se movieron a `src/locales/es/articles|pages/` y sus enlaces internos son marcadores `{{…}}`.

## Mejoras de comportamiento (únicas diferencias con v0.5 en la salida)

* "1 unidades" → "1 unidad"; cantidades con separador de miles en la etiqueta del beneficio total.
* Tipos de IVA con decimales: "7.5 %" → "7,5 %", y se listan de menor a mayor.
* Los porcentajes usan espacio de no ruptura (`66,67 %`) para no partirse al final de línea.
* Los campos de lista usan valores neutros (`yes`/`no`); la etiqueta ("Sí"/"No") es texto del idioma.

## Pruebas

Las **133 pruebas existentes se conservan** (adaptadas a la nueva API, sin quitar ninguna aserción) y se añaden:
`scripts/test-i18n.mjs` (regresión de 564 casos frente a la salida del v0.5 guardada antes del refactor, lectura/formato por
idioma, monedas, rutas, hreflang, sitemap, validación de idiomas), `scripts/check-i18n.mjs`, comprobaciones de fuente ampliadas
(`check-source`), comprobación de `dist/` (`check-site`) y de maquetación en navegador (`check-layout`).
