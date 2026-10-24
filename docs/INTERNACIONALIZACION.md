# Arquitectura internacional de CalculaNegocio

Estado: **Fase 2A** (rama `fase2a-i18n-arquitectura`). Solo está publicado el español; el resto de idiomas están
registrados pero **no generan ninguna página**.

## Principio: tres capas que no se mezclan

| Capa | Dónde | Contiene | No contiene |
|---|---|---|---|
| Lógica | `src/domain/` | Registro neutral de calculadoras (`registry.js`) y fórmulas puras (`formulas.js`) | Texto, formato, moneda, URLs |
| Idioma | `src/locales/<código>/` | Textos de interfaz, calculadoras y mensajes, slugs, fragmentos HTML editoriales, estado de revisión | Fórmulas |
| Presentación | `src/lib/present.js`, `src/components`, `src/views` | Convierte números y códigos en texto con el formato del idioma | Fórmulas ni frases propias |

Reglas (las comprueba `npm test`):

* Las fórmulas devuelven **números y códigos** (`'margin-under-100'`), nunca frases.
* Ninguna plantilla ni script contiene texto de interfaz ni enlaces internos escritos a mano.
* El CSS usa solo propiedades lógicas (`inline-start/end`): el mismo CSS sirve para LTR y RTL.

## Idioma ≠ país ≠ moneda

* **Idioma** (`src/i18n/locales.js`): código, `hreflang`, prefijo de URL, dirección, formato `Intl`.
* **Moneda**: independiente. `defaultCurrency` solo se fija cuando idioma-región apunta a una moneda de forma inequívoca
  (es → EUR, pt-BR → BRL, ja → JPY…). En inglés, francés, alemán y árabe es `null`: **no se presupone ninguna moneda** (ni USD)
  y la persona elige en el selector. Los importes se calculan en unidades menores según la moneda (JPY: 0 decimales).
* **País / mercado fiscal** (`src/markets/`): reglas que dependen de la normativa. Las calculadoras con `scope: 'fiscal'`
  (hoy IVA y precio con IVA, mercado `es`) solo se publican en los idiomas de su mercado. Otros países necesitarían su
  propia calculadora, sus fuentes oficiales y su revisor.

## URLs

`/<prefijo>/<slug traducido>/`. Las URLs españolas no cambian (hay un snapshot en `scripts/test-i18n.mjs`).
Todas salen de la tabla de rutas (`src/i18n/routes.js`); una sola plantilla (`src/pages/[...slug].astro`) las genera.

* `/` redirige **temporalmente** (302, `public/_redirects`; respaldo meta-refresh) a `/es/`. No hay redirección por el idioma
  del navegador. Con varios idiomas publicados, `/` pasará a ser una página de elección de idioma.
* `hreflang` y sitemap incluyen **solo** páginas publicadas y recíprocas; con una única versión no se emite hreflang.
* Chino: `hreflang="zh-Hans"`, prefijo `/zh/`.

## Publicación progresiva y revisión

Un contenido se publica solo si **idioma `enabled`** + **estado `source` o `reviewed`** + (si es fiscal) **mercado del idioma**.
Estados en `src/locales/<código>/review.js`:

* `source`: idioma original (solo el idioma por defecto puede serlo).
* `draft`: traducción sin revisar → no se genera nada (ni página, ni selector, ni sitemap, ni hreflang).
* `reviewed`: exige `reviewer`, `date` y `scope`. **No se registran revisiones que no hayan ocurrido.** Hoy no hay ninguna.

`npm test` (`scripts/check-i18n.mjs`) comprueba: mismas claves y marcadores `{x}` que el español, mensajes de error completos,
campos de cada calculadora, slugs ASCII únicos, fragmentos presentes y con marcadores resolubles, fuentes obligatorias en
mercados "verificados", y detecta traducciones sin hacer (>15 % de textos idénticos al español).

## Cómo añadir un idioma (cuando haya revisores)

1. Copiar `src/locales/es/` a `src/locales/<código>/` y traducir `ui.js`, `tools.js`, `messages.js` y los HTML de `articles/` y `pages/`.
   Traducir también los slugs (`tools.js → slugs`, solo `a-z`, `0-9` y guiones).
2. Registrarlo en `src/locales/index.js`. Mientras `status` sea `draft` en `src/i18n/locales.js` no se publica nada.
3. `npm test` debe pasar. Pedir la revisión a una persona nativa; anotar `reviewer/date/scope` en `review.js` **solo** cuando ocurra.
4. Cambiar `status` a `enabled`. Aparecen páginas, selector de idioma, hreflang y sitemap; el español no cambia.
5. Pendiente por idioma antes de activarlo: fuentes propias para devanagari/árabe (alojadas en el sitio), lectura de la
   agrupación india (`12,34,567`) para hindi, y el banner de consentimiento (CMP certificado, EEE/Reino Unido) antes de AdSense.

## Escrituras y RTL

* `dir` sale del registro de idiomas; `:lang(ar|hi|ja|zh)` desactiva espaciado entre letras y mayúsculas, y asigna pilas de fuentes del sistema.
* Los campos numéricos son siempre LTR; las cifras de resultados van aisladas (`dir="auto"`); las flechas se dibujan con CSS y se reflejan en RTL.
* Lectura de números: dígitos árabe-índicos, persas, devanagari y de ancho completo se normalizan; separadores según el idioma.
* `npm run test:layout` mide en Chromium, en 6 anchos, la página normal, con `dir="rtl"` forzado y con los textos alargados un 45 %
  (simula alemán/pseudo-idioma). No se despliega nada de esto.

## Pendiente / límites conocidos

* No hay buscador por idioma con índices separados para CJK más allá de la coincidencia por subcadena.
* La fuente tipográfica de la web sigue siendo la pila del sistema (la Home v0.3 aprobada).
* El 404 es único (idioma por defecto), por limitación de Cloudflare Pages.
