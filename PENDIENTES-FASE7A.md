# PENDIENTES tras la Fase 7A

Nada de esto se ha inventado ni resuelto «por suposición». Cada punto indica **quién** debe decidirlo o aportarlo y **qué** cambiaría en el código.

## A. Decisiones jurídicas o datos que debe aportar la persona titular

| ID | Qué falta | Dónde estaba | Qué pasa mientras tanto | Quién |
|---|---|---|---|---|
| L-1 | ¿Hay **datos registrales, autorizaciones administrativas o colegiación** que deban figurar en el aviso legal? ¿Y en qué condición actúa el titular (persona física/autónoma u otra)? | Viñeta con marcador en `legal-legal.html` DE/FR/HI (ES/EN/PT no la tienen). | El aviso legal **no afirma** ninguna condición ni registro en ningún idioma. Si procede, hay que dar el dato y añadirlo a los 6 idiomas por igual. | Titular + asesoría |
| L-2 | **Garantías de transferencia internacional de Cloudflare** (DPA, cláusulas contractuales tipo, marco de privacidad UE-EE. UU., etc.). | Marcador en `legal-privacy.html` DE/FR/HI. | La política dice, en los 6 idiomas, que el proveedor «se apoya en las garantías que él mismo publica». Concretarlas requiere leer la documentación vigente de Cloudflare. | Titular + asesoría |
| L-3 | **Cookies reales en `calculanegocio.com`** y funciones de medición de Cloudflare (Web Analytics, Zaraz): comprobar en el dominio publicado (DevTools → Application) y en el panel de Cloudflare. | Marcador en `legal-cookies.html` PT/DE/FR/HI. | La política dice que el sitio no usa cookies y que, si se detectara alguna, se informaría. El código no define ni lee cookies ni almacenamiento (`check-privacy` OK). **No he podido comprobar el dominio real ni el panel de Cloudflare.** | Titular |
| L-4 | Del archivo `DATOS-LEGALES-PENDIENTES.md`: confirmar que se puede mostrar el domicilio públicamente; titularidad de textos/diseño/código; **cláusulas de criterio jurídico** (prevalencia del español, legislación y foro, limitación de responsabilidad, bases RGPD 6.1.f/6.1.b, plazos de conservación). | Borrador redactado por el asistente. | Publicadas como borrador (`noindex`). `LEGAL.status` sigue `'draft'` (indicador interno, no visible). | Asesoría |
| L-5 | **Revisión jurídica final** de los 5 textos legales en español y, para los otros 5 idiomas, de una persona cualificada en cada uno. | — | Hasta entonces las traducciones son asistidas y sin revisión nativa. | Asesoría |
| L-6 | **Fiscalidad de España** en «Precio de venta» e «IVA»: validar tipos, redondeo por línea frente a total, cita de la Ley 37/1992, y alcance (IGIC, Ceuta y Melilla). | Auditoría Fase 7 (calculadoras). | Cada ficha lo indica al lector (`fiscalPending`). No se añadió ninguna norma ni tipo. | Asesoría fiscal |

## B. Decisiones de producto que quedan abiertas

1. **Datos personales en páginas indexables.** En 7A solo se muestran en páginas indexables el **nombre comercial** (Comercial Arbil Suministros) y el **correo** `admin@calculanegocio.com` (este último ahora en la metodología y en la ficha de contacto; antes solo en `noindex`). El nombre de la persona titular, NIF y domicilio siguen solo en las páginas legales. Si prefieres no exponer el correo en una página indexable, basta quitar `{{legal:email}}` de `methodology.html` (6 archivos) y dejar el enlace a «Contacto». El correo en texto/`mailto` puede recibir spam.
2. **«Contenido actualizado»** (`src/data/trust.js`, hoy 25-10-2026): hay que actualizarlo **a mano** cuando cambien fórmulas, artículos o páginas informativas. Es una fecha de actualización, no una revisión profesional; no se debe cambiar el texto a «revisado por…» salvo que ocurra de verdad. Cuando exista una revisión real (fiscal o nativa), se registraría con revisor, fecha y ámbito (`src/locales/*/review.js`) y recién entonces se podría mostrar.
3. **Fuentes oficiales por calculadora** (señal de confianza recomendada en la auditoría): no añadidas, porque requieren consultar y verificar cada fuente con su fecha de consulta.
4. **Calculadoras planificadas** (10): sus datos siguen en el código con `SHOW_PLANNED_TOOLS = false`. Decidir cuándo (y con qué fórmulas verificadas) se publicarán, o si se eliminan.
5. **Redirección `/` → `/es/` (302)**: se mantiene tal cual. Decidir si basta o si se desea una página de selección de idioma (cambiaría `_redirects`, canonical de `/` y `x-default`).

## C. Pendiente de la auditoría (no incluido en 7A, por orden de prioridad propuesto)

| Paquete | Contenido | Notas |
|---|---|---|
| **D — `SITE_INDEXABLE`** | Decidir el valor por defecto «seguro» (p. ej. indexar solo con `SITE_INDEXABLE=true`). | **Orden crítico: primero verificar y definir la variable en Cloudflare (Production y Preview) y después fusionar el cambio.** Hoy, sin variable, el entorno es indexable; las previsualizaciones de Cloudflare Pages (ramas/PR) también lo serían si no tienen `SITE_INDEXABLE=false`. No difundas la URL de previsualización de este PR. |
| C — `_headers` | HSTS, CSP, `X-Frame-Options`, `Permissions-Policy`, caché de `/_astro/*`. | Requiere comprobar el efecto en producción. |
| F — IVA «varias líneas» (E-04) | Exactamente 3 líneas; cantidad 0 → error. | Cambia el comportamiento de una calculadora: va en su fase, con pruebas propias. |
| G — Metadatos | 20 títulos de 66–72 caracteres, 6 descripciones > 165, `og:image`, `lastmod`/`dateModified`, favicon PNG. | |
| H — Accesibilidad | Objetivos táctiles (migas 18 px; la franja de confianza mide 27 px de alto: pasa WCAG 2.5.8 de 24 px, no el criterio AAA de 44 px que `check-a11y` solo anota), `aria-live`. | |
| J — Comisión | Selector «con/sin IVA» en «Precio de venta». | |
| Limpieza menor | `sitemap.js` y `seo.js` conservan imports/variables sin uso (`reviewOf`, `PUBLISHABLE`, `seoLaunch`); `package-lock.json` dice versión 0.5.0. No se tocaron para no mezclar con la lógica de indexación. | |
| Contenido | Elemento propio por calculadora, fuentes oficiales, categorías cortas, aviso visible de «traducción asistida» en idiomas no españoles. | |
| Revisión nativa | Encargarla (EN, PT-BR, DE, FR, HI). | No registrar `reviewed` sin revisor, fecha y ámbito reales. |
| AdSense | **No solicitar todavía** (ver informe de la Fase 7). Requiere además CMP certificada y actualizar privacidad/cookies. | |

## D. Comprobaciones que no se pudieron hacer en este entorno (declaradas expresamente)

* **No se ejecutó `npm ci` ni `astro build`** (el registro npm está bloqueado; no se eludió): el HTML probado es el de `tools/render-preview.mjs` (misma lógica de rutas, contexto, plantillas compiladas por un traductor propio de `.astro`), **no la salida real de Astro**. La comprobación definitiva es la acción «Build y pruebas» de GitHub al abrir el PR y la vista previa de Cloudflare.
* No se ejecutó `npm audit` ni se verificó el despliegue de Cloudflare, sus variables de entorno, cabeceras HSTS/CSP ni Web Analytics.
* No se pudo acceder a GitHub (SHA de `main`, estado de Actions tras esta fase).
* No se midió Lighthouse móvil, INP ni Core Web Vitals reales; no hay Search Console.
* No se hizo revisión lingüística nativa de ningún idioma (solo se redactaron las frases nuevas en los 5 idiomas no españoles con cuidado, pero siguen sin revisar por una persona nativa).
* Las pruebas en navegador se hicieron con Chromium de Playwright sobre la vista previa, no sobre el `dist/` de Astro.
