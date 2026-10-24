# Fase 5A (parcial) · Páginas legales y preparación de privacidad

Rama propuesta: `fase5a-preparacion-legal`. No toca `main`, Cloudflare, DNS, AdSense, la indexación (`SITE_INDEXABLE=false`), el diseño ni las calculadoras.

## Alcance de esta entrega
Datos legales confirmados (Micaela Huarte · Comercial Arbil Suministros · NIF 29150333H · Calle Urbasa 2, 1.º D, 31800 Alsasua, Navarra · calculanegocio.com · Cloudflare Pages) incorporados a 5 páginas nuevas en los 6 idiomas (30 URL nuevas; total 114 en lugar de 84):

| Página | es | en | pt-br | de | fr | hi |
|---|---|---|---|---|---|---|
| Contacto | contacto | contact | contato | kontakt | contact | sampark |
| Aviso legal | aviso-legal | legal-notice | aviso-legal | impressum | mentions-legales | kanooni-soochna |
| Privacidad | politica-de-privacidad | privacy-policy | politica-de-privacidade | datenschutz | politique-de-confidentialite | gopaniyata-neeti |
| Cookies | politica-de-cookies | cookie-policy | politica-de-cookies | cookie-richtlinie | politique-de-cookies | cookie-neeti |
| Condiciones de uso | condiciones-de-uso | terms-of-use | termos-de-uso | nutzungsbedingungen | conditions-d-utilisation | upyog-ki-shartein |

El aviso sobre cálculos orientativos y diferencias fiscales entre países es una sección de las condiciones de uso.

**Correo:** `admin@calculanegocio.com` aparece como texto (nunca como enlace) con la marca «propuesta, pendiente de verificación: todavía no es un canal de contacto disponible». Al poner `email.verified: true` pasa a enlace.

**Borrador visible:** mientras `LEGAL.status` sea `draft`, cada página muestra un aviso rojo de borrador, y los datos sin confirmar llevan marcadores `legal-pending` (datos registrales, garantías de transferencia de Cloudflare, comprobación de cookies en el dominio real). Lista completa: `DATOS-LEGALES-PENDIENTES.md`.

**No incluido todavía** (de la Fase 5A original): página «Sobre CalculaNegocio» (no hay datos acreditados sobre equipo o trayectoria; no se inventan), auditoría editorial profunda de las ocho calculadoras y de la terminología de los idiomas, y mejoras de contenido. Solo se han ejecutado las pruebas automáticas existentes de fórmulas (589 comprobaciones).

## Cambios técnicos
- `src/data/legal.js` (datos y estado), `src/lib/legal.js` (marcadores `{{legal:…}}`), `src/views/LegalView.astro` (vista única), rutas `page:<id>` (`publish.js`, `routes.js`, `validate.js`, `fragments.js`, `context.js`), textos en `src/locales/<idioma>/pages/legal-*.html`, `ui.js` (`legal`, `legalPages`, `footer.cookieSettings`) y `tools.js` (slugs `pages`).
- Pie de página: los tres «pendiente/antes del lanzamiento» pasan a enlaces reales a las 5 páginas.
- CSS: 3 reglas añadidas (aviso de borrador, marca de pendiente, fecha); diseño sin cambios.
- Gancho CMP inactivo: `src/data/consent.js`, `ConsentSlot.astro`, botón de preferencias solo si hay CMP; guía en `docs/CMP-GOOGLE-TCF.md`. No hay CMP propia ni se declara una certificada.
- Nueva prueba `scripts/check-privacy.mjs` (incluida en `npm test` y `test:dist`).
- Pruebas actualizadas a 114 URL; la comprobación de «restos de español» admite la dirección postal y la lista de nombres de impuestos.
- `tools/render-preview.mjs` reconoce la nueva vista.

## Auditoría de privacidad (qué existe realmente)
- Scripts: solo el JS propio (menú, buscador, filtros, calculadora) y JSON-LD/JSON inline. Sin analítica, publicidad, redes sociales, fuentes ni CDN externos.
- Cookies / `localStorage` / `sessionStorage` / `fetch` / `sendBeacon`: ninguno en el código. El selector de idioma no guarda preferencia.
- Formularios, cuentas, comentarios, boletín, pagos: no existen.
- Único tratamiento real: datos técnicos de la visita por el alojamiento (Cloudflare Pages) y, cuando haya correo operativo, los mensajes recibidos.
- Falta: CMP (innecesaria hoy), correo operativo, verificación en el dominio publicado y revisión del panel de Cloudflare.

## Indexación (`SITE_INDEXABLE`)
Con `false`: `noindex,nofollow` en todas las páginas, `robots.txt` con `Disallow: /`, sitemap generado pero no anunciado. Con `true` (probado en `test-languages`): solo el español está publicado (19 URL; antes 14) porque en, pt-br, de, fr y hi son `unreviewed` y desaparecen solas de páginas, selector, hreflang y sitemap hasta que se registre una revisión humana. Las páginas legales siguen esa misma regla. No se ha cambiado nada.

## Hallazgos para decidir
- `public/_redirects`: `/` → `/es/` con 302 temporal (el proyecto lo exige así en `check-source`).
- Etiqueta visible «DEMO PRIVADA · v0.10» en el pie: sigue igual.
