# CMP de Google para CalculaNegocio.com — preparación (NO activada)

## Estado técnico
- Publisher ID: `ca-pub-9242108088602528`.
- `public/ads.txt` y la metaetiqueta `google-adsense-account` ya verifican la propiedad.
- `src/data/consent.js`: `GOOGLE_CMP_READY` es **false por defecto**; no se descarga el script publicitario.
- `src/components/ConsentSlot.astro`: solo inserta el tag oficial de AdSense si `GOOGLE_CMP_READY=true`.
- `src/components/Footer.astro`: el enlace ya traducido **Preferencias de cookies** en los seis idiomas reaparece solo cuando la CMP está activa; usa `googlefc.showRevocationMessage()`, no un banner falso.
- No hay anuncios activados ni una CMP publicada por este cambio.

## Paso obligatorio dentro de AdSense (debe hacerlo el titular)
1. Abrir **Privacidad y mensajes → Normativas europeas → Crear mensaje**.
2. Seleccionar `calculanegocio.com`. Introducir la URL de política de privacidad pública, p. ej. `https://calculanegocio.com/es/privacidad/` **solo tras confirmar la ruta real en la web**.
3. Elegir las **tres opciones**: Aceptar, No aceptar y Administrar opciones.
4. Seleccionar **español** predeterminado e **inglés, alemán y francés** como adicionales. Google selecciona según el idioma del dispositivo, NO según la URL visitada.
5. Limitación oficial en 2026: los mensajes de normativa europea de la CMP de Google **no admiten hindi ni portugués de Brasil**. Para esos visitantes se usa el idioma predeterminado u otro compatible con su dispositivo; no afirmar cobertura de seis traducciones del banner.
6. Configurar socios y finalidades de anuncios, comprobar la política de privacidad, previsualizar y **publicar** el mensaje.
7. Antes de habilitar publicidad, actualizar las políticas de privacidad y cookies de los **seis idiomas**, incluyendo proveedores, finalidades, base jurídica, periodos de conservación e instrucciones para revisar el consentimiento. Confirmar que todo lo publicado es verdadero y que las versiones están revisadas.
8. Solo tras completar 1–7, activar `GOOGLE_CMP_READY=true` en Cloudflare Pages y desplegar. No hacerlo mientras AdSense siga en revisión sin las comprobaciones anteriores. El script oficial de AdSense es el encargado de desplegar el mensaje ya publicado.
9. Verificar en navegador limpio de España/EEE, Reino Unido y Suiza el mensaje real, Aceptar/No aceptar/Administrar opciones, ausencia de cookies no necesarias antes de consentimiento, revocación desde el pie, y páginas en todos los idiomas. Usar `?fc=alwaysshow&fctype=gdpr` como vista de prueba del mensaje ya publicado.
10. Después, volver a ejecutar las pruebas y adaptar su lista de excepciones solo a los recursos de Google efectivamente autorizados. **Nunca saltarse las pruebas de privacidad ni simular que Google ha publicado el mensaje**.

Referencias:
- https://support.google.com/adsense/answer/10960768
- https://support.google.com/adsense/answer/10924669
- https://developers.google.com/funding-choices/fc-api-docs
- https://support.google.com/adsense/answer/13554116

## SEO y experiencia
No modificar rutas, sitemap, hreflang, robots, funciones de calculadoras o el diseño. Este cambio está solo en modo de preparación.
