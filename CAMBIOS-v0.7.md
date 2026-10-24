# CalculaNegocio v0.7.0 · Fase 2B · rediseño visual

Rama de trabajo: `fase2b-rediseno-visual` (base: `fase2a-i18n-validacion`). No toca `main`, Cloudflare ni el dominio.
El bloqueo de indexación se mantiene (`noindex` + `robots.txt` con `Disallow: /` mientras `SITE_INDEXABLE` no sea `true`).

## Qué cambia

- **Portada nueva**: cabecera con buscador, calculadora protagonista (pestañas «Precio de venta» / «Margen comercial», resultado grande, desglose, barra apilada, botón *Copiar resultado* y enlace a la fórmula), ventajas, catálogo, comparación margen/recargo con cifras calculadas por el motor, método, transparencia, preguntas frecuentes y llamada final.
- **Catálogo de 18 calculadoras** (`src/domain/catalog.js`) en 4 temas (6/4/4/4) con buscador, filtro por tema y filtro por estado.
  - **Disponibles (4)**: las que existen en `TOOL_REGISTRY` (fórmula + pruebas + página). Tarjeta-enlace.
  - **En desarrollo (14)**: tarjetas sin enlace, con distintivo «En desarrollo» y sin botón de acción. No tienen URL, slug, entrada en el sitemap ni en el buscador.
  - El estado **se deduce del registro**: no se escribe a mano. Para publicar una calculadora nueva basta añadirla al registro y mover su texto de `src/locales/<idioma>/catalog.js` a `tools.js`.
- **Fichas**: cabecera con estado y distintivo fiscal, calculadora, bloque de **fórmulas**, contenido editorial, **preguntas frecuentes** (con datos estructurados `FAQPage`), **índice lateral**, **herramientas relacionadas** y aviso de revisión fiscal pendiente para las calculadoras fiscales.
- **Páginas de categoría, catálogo, metodología y 404** con el mismo sistema visual.
- **Identidad propia**: azul noche `#0C1B2E`, verde lima `#D2F55A`, verde azulado `#0B6B5C`. Iconos propios en SVG (`src/lib/icons.js`). Fuentes del sistema (ver *Limitaciones*).

## Internacionalización (sin cambios de arquitectura)

- Las mismas vistas y componentes sirven a todos los idiomas; ninguna plantilla contiene texto escrito a mano (lo comprueba `check-source`).
- Todo texto nuevo está en `src/locales/es/` (`ui.js`, `tools.js`, `catalog.js`). Un idioma nuevo debe traducir las mismas claves; `check-i18n` valida estructura, marcadores `{x}`, fórmulas, preguntas y textos del catálogo.
- CSS con propiedades lógicas (RTL), pilas tipográficas por escritura, flechas por CSS reflejadas en RTL, números aislados con `unicode-bidi`.
- Las calculadoras fiscales pendientes (IRPF, recargo de equivalencia) solo aparecen en los idiomas de su mercado.
- El selector de idioma solo se muestra cuando la página existe en más de un idioma publicado.
- URLs españolas intactas (las 9 de la Fase 2A).

## Verificación

| Prueba | Qué comprueba | Resultado en este entorno |
|---|---|---|
| `npm test` → `test-calculators` | fórmulas | 133 OK |
| `test-i18n` | formato, rutas, regresión v0.5 | 177 OK |
| `test-catalog` (**nueva**) | 18 = 4 + 14, categorías 6/4/4/4, sin URLs para «en desarrollo», mercados fiscales, estado derivado del registro, ayudantes, fichas | 56 OK |
| `check-i18n`, `check-source` | coherencia de idiomas; sin texto ni enlaces escritos a mano, CSS lógico, robots | OK |
| `npm run test:layout` | sin desplazamiento horizontal: 10 páginas × 320/360/390/768/1024/1280 px × normal / RTL / textos +45 % / menú abierto | OK (330 mediciones) |
| `npm run test:a11y` (**nueva**) | ids únicos, un h1, orden de encabezados, nombres accesibles, objetivos táctiles, contraste 4,5:1 | OK |
| `npm run test:behavior` (**nueva**) | ninguna tarjeta enlaza a una página inexistente, «en desarrollo» sin enlace, buscador, filtros, pestañas, recálculo, copiar, menú móvil, página sin JavaScript | OK (73 comprobaciones) |
| `npm run screenshots` (**nueva**) | capturas a 320/375/390/768/1440 px, menú móvil y RTL | 39 capturas |

Los problemas que estas pruebas detectaron y se corrigieron: botón *Copiar* oculto en la portada (faltaba cargar el script de la calculadora), cabecera que se salía de la ventana con textos largos, barra de navegación de escritorio desbordada a 1024 px con textos +45 %, texto con contraste 1,79:1 en el cuadro margen/recargo, enlaces de sección y logotipo con zona táctil insuficiente, guionización que partía «euros».

## Limitaciones (importante)

1. **Astro no se pudo compilar aquí** (el registro de npm está bloqueado). Para ver y medir el HTML real se creó `tools/render-preview.mjs`, que convierte las plantillas `.astro` en HTML y lo sirve a Chromium. Es una **aproximación**: no es la salida de Astro (no empaqueta ni minifica CSS/JS, ni genera `robots.txt`/`sitemap.xml`). El flujo de GitHub Actions ejecuta `astro build` y repite layout, accesibilidad, comportamiento y capturas sobre el `dist/` real: **esa ejecución es la comprobación definitiva**.
2. **Fuentes del sistema**: las fuentes del mockup (Bricolage Grotesque, Inter) no se pudieron descargar. Cuando se decida, se alojan en el propio sitio (con su licencia) solo para los alfabetos que las necesiten.
3. **Solo español publicado**: el resto de idiomas están preparados pero sin traducir ni revisar; el RTL se ha probado de forma simulada.
4. **Revisión fiscal pendiente** (IVA, IRPF, recargo): las fichas lo indican. Las páginas legales (aviso legal, privacidad, contacto) siguen pendientes y el pie lo dice.
5. **SEO**: las 14 calculadoras nuevas no se desarrollan todavía. No hay datos de SEMrush conectados y no se ha inventado ningún volumen ni dificultad: su prioridad se decidirá con los datos que aportes.
6. Sin testimonios, valoraciones, estadísticas, revisores ni certificaciones inventados.

## Cómo comprobarlo

```bash
npm ci
npm test                    # fórmulas, idiomas, catálogo, código fuente
npm run build               # Astro
npm run test:dist           # estructura del HTML, enlaces, robots, sitemap
npx playwright-core install chromium   # (o: npm i --no-save playwright-core)
npm run test:layout && npm run test:a11y && npm run test:behavior
npm run screenshots dist screenshots
```

Sin poder instalar Astro: `node tools/render-preview.mjs preview-dist` y pasar `preview-dist` a las pruebas anteriores.

## Siguiente paso propuesto

Primer bloque de 4 calculadoras (por ejemplo recargo sobre coste, descuentos, variación porcentual y punto de equilibrio: universales, sin dependencia fiscal), cada una con fórmula en `src/domain`, pruebas, texto, ficha y ejemplos resueltos. Antes, conviene elegir el orden con los datos de SEMrush.
