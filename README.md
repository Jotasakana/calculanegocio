# CalculaNegocio (Astro · HTML estático)

Calculadoras gratuitas para autónomos y pequeños negocios en España. Versión **v0.4**: migración de la Home v0.3 a Astro con URLs reales.
**Modo desarrollo**: `noindex` en todas las páginas y `robots.txt` con `Disallow: /`. No publicar ni activar AdSense sin autorización.

## Comandos

```bash
npm install          # instalar (Node 20.11+ ; recomendado 22)
npm run dev          # servidor local en http://localhost:4321
npm run build        # genera dist/ (HTML estático)
npm run preview      # sirve dist/ para revisar el resultado compilado
npm test             # fórmulas + comprobaciones de código fuente (no necesita Astro)
npm run test:dist    # comprueba dist/ (enlaces, SEO, contenido estático) tras el build
npm run check        # todo lo anterior en orden
```

`.github/workflows/build.yml` ejecuta instalación, pruebas, compilación y comprobación de `dist/` en cada push. **No despliega nada**; guarda `dist/` como artefacto descargable para revisar la demo.

## Mapa de URLs (Plan Maestro SEO)

| URL | Contenido |
|---|---|
| `/` | Home v0.3 |
| `/es/herramientas/` | Listado de calculadoras por categoría |
| `/es/metodologia/` | Criterios, redondeo, privacidad y límites |
| `/es/margenes-y-precios/` | Hub → margen comercial, precio de venta, margen bruto y neto |
| `/es/facturacion/` | Hub → base imponible |
| `/es/calculadora-margen-comercial/` | Calculadora |
| `/es/calculadora-precio-de-venta/` | Calculadora |
| `/es/margen-bruto-y-margen-neto/` | Calculadora |
| `/es/calculadora-base-imponible/` | Calculadora (añadir y quitar IVA, varias líneas) |
| `/robots.txt`, `/sitemap.xml`, `404.html` | Generados en build |

`/es/calculadora-iva/` **no existe**: se creará solo cuando esté justificada y desarrollada, sin duplicar la de base imponible.
Todas las URLs se definen en un único sitio: `src/data/tools.js`.

## Estructura

```
src/data/tools.js        URLs, categorías, campos y pestañas de cada calculadora
src/data/site.js         dominio, modo indexable
src/lib/calculators.js   fórmulas (módulo puro; se usa en build y en el navegador)
src/lib/articles.js      inyecta en BUILD los textos de src/content/articles/*.html
src/components, layouts  Header, Footer, Breadcrumbs, CalculatorPage, BaseLayout (SEO)
src/pages                una página por URL
src/scripts              JS mínimo: menú/buscador (site.js) y calculadoras (calculator.js)
src/styles/global.css    CSS aprobado de la Home v0.3 (sin cambios)
src/styles/additions.css solo accesibilidad, migas y avisos de desarrollo
scripts/                 pruebas y comprobaciones
```

## Para publicar (cuando se autorice)

Definir `SITE_URL` y `SITE_INDEXABLE=true` en el entorno de build. Con ello desaparecen `noindex`, la etiqueta "DEMO PRIVADA" y los avisos de desarrollo, y `robots.txt` anuncia el sitemap.
