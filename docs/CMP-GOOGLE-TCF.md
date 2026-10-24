# Preparación para una CMP certificada por Google (TCF)

**Estado actual:** no hay CMP, y no hace falta: el sitio no instala cookies, almacenamiento local, analítica, publicidad ni scripts de terceros (`npm test` lo vigila con `scripts/check-privacy.mjs`). No se ha creado ninguna CMP propia ni se declara que exista una certificada.

## Qué está preparado
- `src/data/consent.js`: interruptor `enabled` (false), `provider` y `scriptUrl` (null).
- `src/components/ConsentSlot.astro`: si `enabled` es true y `scriptUrl` es una URL https, la inserta **la primera en `<head>`**. Si no, no renderiza nada.
- Pie de página: si `enabled` es true aparece un botón «Preferencias de cookies» (`data-cmp-open`, traducido a los 6 idiomas) para que la CMP lo enlace a su panel de preferencias.
- `scripts/check-privacy.mjs`: falla si aparecen `document.cookie`, `localStorage`, `fetch`, scripts o recursos externos, o si `enabled` es true sin `scriptUrl` https.

## Pasos futuros (antes de pedir AdSense o cargar anuncios)
1. Elegir una CMP de la lista de CMP certificadas por Google (compatible con TCF) y contratarla. Comprobar en la documentación vigente de Google los requisitos para el EEE, Reino Unido y Suiza.
2. Configurarla con los idiomas del sitio (es, en, pt-BR, de, fr, hi) y sus textos.
3. Rellenar `consent.js` con su script oficial, poner `enabled: true`, y adaptar `check-privacy.mjs` (la comprobación de `enabled` pasará a exigir la URL del proveedor concreto).
4. Solo entonces añadir scripts de medición o publicidad, **condicionados al consentimiento** (ninguna cookie no esencial antes de aceptar).
5. Actualizar la política de privacidad y la de cookies (tabla de cookies: nombre, proveedor, finalidad, duración) y poner `LEGAL.status` a `final` solo tras revisarlas.
6. Probar en un navegador limpio (sin consentimiento: cero cookies y cero peticiones a terceros; tras aceptar/rechazar: comportamiento correcto; revocación desde el pie de página).
