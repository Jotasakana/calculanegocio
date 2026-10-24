# Informe de pruebas · Fase 5A

## Limitación del entorno
`npm ci`/`npm install` **no pudieron ejecutarse**: el acceso a `registry.npmjs.org` está denegado (403) por la política de red del entorno donde se trabajó. Por tanto **no se ejecutó `astro build`**. Las pruebas definitivas de compilación quedan para GitHub Actions (`npm run check`, ya configurado en `.github/workflows/build.yml`).

Como alternativa se usó `tools/render-preview.mjs` (render de las plantillas sin Astro, incluido en el proyecto) y Chromium con Playwright sobre ese resultado. Es una aproximación: no es salida de Astro.

## Resultados (todos OK)
| Prueba | Resultado |
|---|---|
| `npm test` (fórmulas 133 + fase 4 456 + i18n 207 + idiomas 1028 + catálogo 72 + contenidos 6 idiomas + fuente 114 URL + privacidad) | OK |
| `test:dist` sobre la vista previa: 114 páginas, metadatos, canonical, hreflang recíproco, sitemap, noindex, enlaces, restos de otro idioma (8066 comprobaciones), sin recursos externos | OK |
| Layout: sin desplazamiento horizontal, 115 páginas × 7 anchos, también +45 % de texto y RTL (5250 mediciones) | OK |
| Accesibilidad básica (690 mediciones, 115 páginas) | OK |
| Comportamiento en navegador (438) y selector de idioma (2563; 6 idiomas × 19 páginas) | OK |
| Consola sin errores ni avisos y 0 cookies / 0 elementos de almacenamiento en 7 páginas legales muestreadas | OK |
| Revisión visual de `/es/aviso-legal/` (escritorio) y `/hi/gopaniyata-neeti/` (móvil 375 px) | Diseño conservado |

## No verificado
- Salida real de Astro (`dist/`), capturas de CI, rendimiento.
- Auditoría matemática y editorial nueva de las ocho calculadoras (solo las pruebas existentes).
- Cookies en el dominio publicado (ver `DATOS-LEGALES-PENDIENTES.md`).
- Calidad jurídica y revisión nativa de los textos.
