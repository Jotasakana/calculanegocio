# CalculaNegocio (Astro · HTML estático)

Calculadoras gratuitas para autónomos y pequeños negocios. Versión **v0.10** (Fase 4: ocho calculadoras): **español, inglés, portugués de Brasil, alemán, francés e hindi** con selector de idioma en la cabecera, sobre la arquitectura
internacional de la Fase 2A (fórmulas, textos, configuración regional y componentes separados). Inglés, portugués, alemán, francés e hindi están
*sin revisión nativa*: solo se publican mientras el sitio esté en modo desarrollo (ver `CAMBIOS-FASE3A.md` y `CAMBIOS-FASE3B.md`).
**Modo desarrollo**: `noindex` en todas las páginas y `robots.txt` con `Disallow: /`. No publicar ni activar AdSense sin autorización.
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
| `/en/…`, `/pt-br/…`, `/de/…`, `/fr/…`, `/hi/…` | Mismas 14 páginas en inglés, portugués de Brasil, alemán, francés e hindi (slugs traducidos) |
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

## Para publicar (cuando se autorice)

Definir `SITE_URL` y `SITE_INDEXABLE=true` en el entorno de build. Con ello desaparecen `noindex`, la etiqueta "DEMO PRIVADA" y
los avisos de desarrollo, y `robots.txt` anuncia el sitemap. Antes: páginas legales, validación fiscal con fuentes oficiales y
consentimiento (CMP) si se usa AdSense.
