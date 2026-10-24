# Datos y comprobaciones pendientes para publicar las páginas legales como definitivas

Datos ya incorporados (confirmados por ti): titular Micaela Huarte · nombre comercial Comercial Arbil Suministros · NIF 29150333H · Calle Urbasa 2, 1.º D, 31800 Alsasua, Navarra, España · dominio calculanegocio.com · alojamiento Cloudflare Pages. Viven en `src/data/legal.js`.

Mientras falte algo de esta lista, `LEGAL.status` es `draft` y cada página legal muestra un aviso rojo «Borrador pendiente de revisión».

## A. Datos que debes facilitar o confirmar
1. **Correo admin@calculanegocio.com**: crearlo, comprobar que recibe y responde, y avisarme para poner `email.verified: true` en `src/data/legal.js` (entonces se muestra como enlace y desaparece la marca de pendiente). Sin correo operativo no se cumple bien el deber de ofrecer un medio de contacto directo.
2. **Condición del titular**: confirmar si actúas como persona física/autónoma o de otra forma, y si hay **datos registrales** (Registro Mercantil u otros) o **autorizaciones/colegiación**. El aviso legal tiene el marcador `[PENDIENTE DE CONFIRMAR si procede]` (en los 6 idiomas). No he escrito «autónoma» ni ninguna condición.
3. **Domicilio**: confirmar que es correcto mostrarlo públicamente para este sitio (es el mismo de Hogar-Soluciones.es).
4. **Propiedad del contenido y del código**: confirmar que eres titular de textos, diseño y código (el aviso legal lo afirma).
5. **Cláusulas de criterio jurídico** que he redactado como borrador y debe validar quien te asesore: prevalencia del español sobre las traducciones, legislación española/foro, limitación de responsabilidad, bases jurídicas del RGPD (art. 6.1.f / 6.1.b) y plazos de conservación.

## B. Comprobaciones técnicas
6. **Cookies reales en el dominio publicado**: con el sitio desplegado, abrir DevTools → Application y confirmar que Cloudflare no establece ninguna cookie (p. ej. de seguridad) ni se carga nada externo. Marcador `[PENDIENTE DE COMPROBAR…]` en la política de cookies (6 idiomas).
7. **Panel de Cloudflare** (solo consulta, no se ha tocado): confirmar que *Web Analytics*, Zaraz u otras funciones de medición **no** están activadas. La política afirma que no hay analítica.
8. **Transferencias internacionales de Cloudflare**: revisar su documentación/DPA y concretar las garantías en la política de privacidad (marcador `[PENDIENTE DE CONFIRMAR: garantías…]`).
9. **Correo y datos de contacto**: si activas formularios, boletín, analítica o publicidad, hay que actualizar privacidad y cookies antes (y la CMP: `docs/CMP-GOOGLE-TCF.md`).

## C. Revisión editorial
10. Las versiones en inglés, portugués de Brasil, alemán, francés e hindi son traducciones asistidas **sin revisión nativa** (estado `unreviewed`, como el resto del sitio). Con `SITE_INDEXABLE=true` esos idiomas dejan de publicarse automáticamente (comprobado en pruebas: solo quedarían 19 URL en `/es/`) hasta que se registren como revisados. Los textos legales deberían ser revisados por una persona cualificada en cada idioma que quieras publicar.
11. Revisión jurídica final de los 5 textos en español por tu asesor/a.

## D. Cuando todo esté resuelto
- Poner `LEGAL.status = 'final'` (solo es posible con `email.verified: true`; `check-privacy.mjs` lo exige), quitar los marcadores `legal-pending` de los 6 idiomas y volver a ejecutar `npm run check`.
