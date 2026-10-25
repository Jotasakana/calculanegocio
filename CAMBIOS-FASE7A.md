# CAMBIOS — Fase 7A (v0.11.0)

Alcance muy controlado, sobre el código de `main` (v0.10.0, el último ZIP; Actions «Build y pruebas» #83 en verde en la auditoría).
No se ha modificado ninguna fórmula, canonical, hreflang, redirección ni la lógica de `SITE_INDEXABLE`. No se ha hecho push ni publicado nada.

## Resumen en una frase por objetivo

| # | Objetivo | Resultado |
|---|---|---|
| 1 | Marcadores «pendiente» en PT-BR/DE/FR/HI | **Retirados los 10 marcadores visibles** (`legal-pending`). Lo que había detrás está identificado y documentado en `PENDIENTES-FASE7A.md` (no se inventó ni se suprimió ninguna afirmación jurídica). |
| 2 | Correo obsoleto | Las frases «cuando el correo esté operativo» (privacidad, 6 idiomas ×2 frases) y el texto «pendiente de verificación» de la meta descripción de Contacto (6 idiomas) se reformulan: `admin@calculanegocio.com` es el medio de contacto. |
| 3 | README/docs/comentarios | Alineados con el estado real: 114 páginas, 84 indexables (`index,follow`), 30 legales (`noindex`), sitemap de 84 URL. |
| 4 | `SITE_INDEXABLE` | **Sin cambios de lógica.** Solo comentarios y documentación que describen cómo funciona de verdad (indexable por defecto; solo `false` bloquea). |
| 5 | Portada y catálogo | El sitio muestra **solo las 8 calculadoras que funcionan**. Ya no hay «18 calculadoras», ni «10 en desarrollo», ni filtro de estado. |
| 6 | Textos obsoletos | Retirados «demo», «borrador», «antes de la publicación», «nota de desarrollo» y similares. |
| 7 | Señales de confianza | Franja verificable en cada calculadora y en Metodología + sección «Quién edita este sitio y cómo contactar». Sin experiencia, credenciales ni revisiones inventadas. |
| 8 | 6 idiomas, 8 calculadoras, URLs | Idénticos (114 URL; mismos slugs; mismo sitemap byte a byte). |

## 1. Páginas legales (PT-BR, DE, FR, HI)

Los 10 marcadores eran **tareas de verificación del titular**, no afirmaciones. ES y EN ya los habían retirado en fases anteriores; se igualan los otros cuatro idiomas a esa referencia:

| Archivo(s) | Qué había | Qué se hizo | Qué queda pendiente (ver `PENDIENTES-FASE7A.md`) |
|---|---|---|---|
| `legal-legal.html` DE, FR, HI | Viñeta «datos registrales y autorizaciones administrativas: [confirmación pendiente, si procede]» (ES/EN/PT no la tienen) | Viñeta retirada (no se afirma nada) | L-1: ¿hay datos registrales/autorizaciones/colegiación que mostrar? |
| `legal-privacy.html` DE, FR, HI | Tras «se apoya en las garantías que él mismo publica»: [confirmación pendiente de las garantías de transferencia] | Marcador retirado; la frase (idéntica a ES/EN/PT) queda | L-2: concretar garantías de Cloudflare (DPA/cláusulas tipo/marco de privacidad) |
| `legal-cookies.html` PT-BR, DE, FR, HI | [verificación pendiente en el dominio publicado de que no se define ninguna cookie] | Marcador retirado; el texto sigue siendo condicional («algunos proveedores pueden… si se detectara alguna, se informaría aquí») | L-3: comprobar en el dominio real (DevTools y panel de Cloudflare) |

Texto de correo (privacidad, 6 idiomas): «Cuando el correo de contacto esté operativo, si nos escribes…» → «Si nos escribes al correo de contacto…»; «o, cuando esté operativo, al correo electrónico» → «o al correo electrónico de contacto» (y equivalentes). No se tocó `src/data/legal.js` salvo comentarios: titular, nombre comercial, NIF, domicilio, correo y fecha **no se han modificado**.

## 2. Portada y catálogo (solo las 8 calculadoras que funcionan)

* `src/lib/catalog.js`: `buildCatalog(…, { includePlanned = true })`. El valor por defecto conserva el comportamiento histórico (las pruebas lo siguen verificando con 16/8 en idiomas genéricos y 18/8 en español).
* `src/domain/catalog.js`: nueva constante `SHOW_PLANNED_TOOLS = false`; `src/lib/context.js` la pasa a `buildCatalog`. Con ello:
  * Portada y Calculadoras: «Catálogo de 8 calculadoras para tu negocio · 8 calculadoras disponibles», sin tarjetas «En desarrollo», sin filtro de estado, sin nota «todavía no se pueden usar».
  * La categoría «Finanzas» (que solo tenía calculadoras planificadas) deja de aparecer; las tres categorías con página siguen igual.
  * Los datos de las 10 calculadoras planificadas **no se borran** (siguen en `CATALOG` y en `locales/*/catalog.js` para futuras fases); simplemente no se anuncian. Nunca tuvieron URL, sitemap ni hreflang.
* Textos: `home.catalogLead` y `toolsHub.metaDescription` reescritos en 6 idiomas (sin «en desarrollo»); `short` de «Rentabilidad y crecimiento» (ES/EN/PT/DE) ya no cita «variación» ni «publicidad»; el contador «N de N disponibles» solo aparece si falta alguna.
* Cambian las meta descripciones de 6 páginas «Calculadoras» y 6 de «Contacto» (12 en total); **ningún título** ni canonical/hreflang/robots cambia.

## 3. Textos obsoletos retirados

* `ui.js` (6 idiomas): eliminadas 8 claves sin uso o que solo se veían con `SITE_INDEXABLE=false`: `site.devLabel` («DEMO PRIVADA · v0.10»), `footer.status` («Proyecto en desarrollo»), `legal.draftTitle`, `legal.draftNotice`, `legal.devNote`, `tool.devNote`, `methodology.devNote`, `home.devNote`.
* `ToolView`, `MethodologyView`, `HomeView`: eliminados los bloques `devnote` condicionados a `!SITE.indexable` (y el import de `SITE`, ya sin uso). **No toca la lógica** de `SITE.indexable` (que sigue usándose en `site.js`, `sitemap.js`, `BaseLayout` y `robots.txt`).
* Metodología (6 idiomas): «requiere validación con fuentes oficiales antes de la publicación del sitio» → «es orientativa: antes de aplicarla, contrástala con fuentes oficiales o con tu asesoría». Se mantiene la frase real sobre la traducción sin revisión nativa en los idiomas no españoles.

## 4. Señales de confianza (solo datos verificables)

* `src/data/trust.js` (nuevo): `contentUpdated: '2026-10-25'` — fecha de la última actualización del contenido, comprobable en el repositorio. **No es una revisión profesional externa** y la web no lo afirma.
* `src/components/TrustStrip.astro` (nuevo) en las **8 calculadoras ×6 idiomas** y en **Metodología ×6**: «Contenido actualizado: <fecha> · Fórmulas comprobadas con pruebas automáticas · Cómo calculamos · Edita: Comercial Arbil Suministros (enlace al aviso legal) · Contacto». «Fórmulas comprobadas con pruebas automáticas» es cierto y reproducible (`npm test`).
* Metodología: nueva sección «Quién edita este sitio y cómo contactar» (6 idiomas): proyecto independiente editado por el nombre comercial, enlace al aviso legal/contacto, correo, y la advertencia de que el sitio no ofrece asesoramiento profesional individual ni afirma revisión por profesionales fiscales o contables.
* En páginas indexables solo se muestran el **nombre comercial** y el **correo** (los mismos que ya aparecían en el sitio); el nombre de la persona titular, NIF y domicilio siguen únicamente en las páginas legales (`noindex`). Decisión registrada en `PENDIENTES-FASE7A.md`.
* CSS: 2 reglas nuevas (`.trustbar`) con la paleta existente; sin cambio de diseño.
* Nuevas cadenas `trust.*` (5 por idioma) en los 6 idiomas; `check-i18n` valida que no falte ninguna.

## 5. Documentación y comentarios alineados

`README.md` (estado real, URL, despliegue), `DATOS-LEGALES-PENDIENTES.md`, `docs/INTERNACIONALIZACION.md`, `.env.example`, `astro.config.mjs`, `.github/workflows/build.yml`, `public/_redirects` (solo comentario; la regla `/ /es/ 302` no cambia), `src/data/site.js`, `src/data/legal.js` (solo comentarios), `src/i18n/{publish,seo,locales}.js`, `src/markets/es.js`, `src/locales/*/review.js`. Se ha comprobado con diff que los cambios en esos archivos **de código** son exclusivamente comentarios. `package.json`: versión 0.11.0 (el lockfile no se toca).
`INSTRUCCIONES-GITHUB-DESKTOP.md` se sustituye por la versión de esta fase (la anterior indicaba mantener `SITE_INDEXABLE=false`, que ya no describe la realidad).

## 6. Pruebas modificadas o añadidas

* `scripts/test-catalog.mjs`, `test-languages.mjs`: se adaptan a «8 visibles» y se añaden comprobaciones (8/8/0 en seis idiomas; `includePlanned:true` conserva 16/8 y 18/8; `SHOW_PLANNED_TOOLS` desactivado).
* `scripts/test-i18n.mjs`: usa `footer.market` en lugar de `footer.status` (retirada) y un `legal` ficticio en el contexto de fragmentos.
* `scripts/check-behavior.mjs`: si no hay calculadoras «en desarrollo», comprueba que no existe filtro de estado.
* `scripts/check-site.mjs`: 114 páginas; sitemap con **exactamente 84** URL y ninguna legal; **30** `noindex` y **84** `index,follow`; ausencia de textos obsoletos (marcadores, demo, «en desarrollo», «antes de la publicación», correo «cuando esté operativo») en las 114 páginas; franja de confianza con fecha en las 8 calculadoras y en Metodología; portada y catálogo sin filtro de estado.

## 7. Revisión previa de seguridad (indexación y calculadoras)

* **Indexación:** ninguna ruta, slug, sitemap, hreflang, canonical ni robots cambia (comprobado: canonical/hreflang/robots idénticos en las 114 páginas; `sitemap.xml` y `robots.txt` idénticos byte a byte). Lo que cambia es contenido visible, 12 meta descripciones y comentarios. Ocultar las calculadoras planificadas no puede afectar al índice: nunca tuvieron URL.
* **Calculadoras:** `formulas.js`, `registry.js`, `numbers.js` y `src/scripts/*` sin cambios. Las 48 páginas de calculadora (8 × 6) son **idénticas al HTML anterior** salvo la franja de confianza.
* **Riesgo residual:** la franja añade enlaces internos (metodología, aviso legal, contacto) en 54 páginas; son enlaces a páginas ya existentes, sin ancla nueva. Las páginas legales siguen `noindex`.

## 8. Lo que NO se ha tocado (fuera de alcance de 7A)

Cabeceras de seguridad/caché (`_headers`), IVA «varias líneas» (E-04), títulos largos, Open Graph, `lastmod`, accesibilidad de migas, revisión nativa, `SITE_INDEXABLE` por defecto seguro, redirección `/` (302), publicidad/analítica/cookies (siguen inexistentes). Ver `PENDIENTES-FASE7A.md`.
