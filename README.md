# CalculaNegocio (Astro · HTML estático)

Calculadoras gratuitas para autónomos y pequeños negocios. Versión **v0.11** (Fase 7A): **ocho calculadoras** en **español, inglés, portugués de Brasil, alemán, francés e hindi**, con selector de idioma en la cabecera, sobre la arquitectura
internacional de la Fase 2A (fórmulas, textos, configuración regional y componentes separados).

**Estado real del sitio (publicado e indexable):**
* **114 páginas**: 84 indexables (14 por idioma × 6: portada, calculadoras, metodología, 3 categorías y 8 calculadoras) con `index,follow`, y **30 páginas legales** (5 por idioma × 6: contacto, aviso legal, privacidad, cookies y condiciones) con `noindex,follow`.
* `sitemap.xml` lista exactamente las **84 URL indexables** (cada una con sus 6 alternativas hreflang + `x-default`); las legales no entran.
* Inglés, portugués de Brasil, alemán, francés e hindi son traducciones asistidas **sin revisión nativa** (estado `unreviewed`); se publican igualmente y no se simula ninguna revisión (ver `src/locales/*/review.js`).
* `SITE_INDEXABLE`: sin definir (o con cualquier valor distinto de `false`) el sitio es indexable; solo el valor exacto `false` da `noindex` + `robots.txt` con `Disallow` (previews y pruebas locales). Está **pendiente** decidir un valor por defecto «seguro» tras verificar las variables de Cloudflare (ver `PENDIENTES-FASE7A.md`).
* No hay publicidad, analítica ni cookies. Antes de activar AdSense u otra medición: CMP certificada y actualizar privacidad/cookies (`docs/CMP-GOOGLE-TCF.md`).

Fase 4 (recargo, descuentos, punto de equilibrio y ROI): [`CAMBIOS-FASE4.md`](CAMBIOS-FASE4.md).
Detalles de la arquitectura: [`docs/INTERNACIONALIZACION.md`](docs/INTERNACIONALIZACION.md) · cambios: [`CAMBIOS-v0.6.md`](CAMBIOS-v0.6.md).

## Comandos

```bash
npm install          # instalar (Node 20.11+ ; recomendado 22)
npm run dev          # servidor local en http://localhost:4321
npm run build        # genera dist/ (HTML estático)
npm run preview      # sirve dist/ para revisar el resultado compilado
npm test             # fórmulas, idiomas, contenidos y código fuente (no necesita Astro)
npm run test:dist    # comprueba dist/ (enlaces, SEO, hreflang, contenido estático) tras el build
npm run test:layout  # Chromium: sin desplazamiento horizontal en móvil/escritorio, RTL y textos largos (requiere playwright-core)
npm run test:switcher # Chromium: selector de idioma (abrir/cerrar, página equivalente, teclado, sin JS, sin 404)
npm run check        # test + build + test:dist
```

`.github/workflows/build.yml` ejecuta todo en cada push. **No despliega nada**; guarda `dist/` como artefacto.

## Mapa de URLs

Se generan desde la tabla de rutas (`src/i18n/routes.js`): `/<idioma>/<slug>/`. Hoy:

| URL | Contenido |
|---|---|
| `/` | Redirección temporal (302) a `/es/` (sin detección de idioma) |
| `/en/…`, `/pt-br/…`, `/de/…`, `/fr/…`, `/hi/…` | Mismas 14 páginas indexables en inglés, portugués de Brasil, alemán, francés e hindi (slugs traducidos) |
| `…/contacto/`, aviso legal, privacidad, cookies y condiciones (cada idioma con sus slugs) | 5 páginas legales por idioma (30 en total), `noindex,follow`, fuera del sitemap |
| `/es/` | Portada (Home v0.3) |
| `/es/herramientas/` | Catálogo con filtros y búsqueda |
| `/es/metodologia/` | Criterios, redondeo, privacidad y límites |
| `/es/margenes-y-precios/`, `/es/facturacion/`, `/es/rentabilidad-y-crecimiento/` | Categorías |
| `/es/calculadora-margen-comercial/`, `/es/calculadora-precio-de-venta/`, `/es/margen-bruto-y-margen-neto/`, `/es/calculadora-base-imponible/`, `/es/calculadora-recargo-sobre-coste/`, `/es/calculadora-descuentos-y-precio-final/`, `/es/calculadora-punto-de-equilibrio/`, `/es/calculadora-roi/` | Calculadoras (8) |
| `/robots.txt`, `/sitemap.xml` (con hreflang cuando proceda), `404.html` | Generados en build |

## Estructura

```
src/domain/       registro neutral de calculadoras + fórmulas puras (sin texto)
src/i18n/         idiomas, números/monedas, rutas, hreflang, sitemap, publicación y validación
src/locales/es/   textos (ui, tools, messages), slugs, HTML editorial (articles/, pages/) y estado de revisión
src/markets/      configuración fiscal por país (hoy: es)
src/lib/          presentación (present.js), contexto de página, fragmentos, JSON-LD
src/views, components, layouts, pages   plantillas Astro (una plantilla dinámica para todas las páginas)
src/scripts/      JS mínimo: menú, buscador y filtros (site.js) y calculadoras (calculator.js)
src/styles/       site.css (propiedades lógicas, RTL)
scripts/          pruebas y comprobaciones
```

## Despliegue

Cloudflare Pages construye `main` con `npm run build` (salida `dist/`). `SITE_URL` por defecto es `https://calculanegocio.com`.
No hace falta definir `SITE_INDEXABLE` en producción (el sitio es indexable salvo que valga exactamente `false`). `robots.txt` anuncia el sitemap.
Pendiente de cerrar (no son parte de esta entrega de código): revisión jurídica final de las páginas legales, validación fiscal con fuentes oficiales,
revisión nativa de las traducciones y, si algún día se usa publicidad, CMP certificada. Detalle en `PENDIENTES-FASE7A.md` y `DATOS-LEGALES-PENDIENTES.md`.
