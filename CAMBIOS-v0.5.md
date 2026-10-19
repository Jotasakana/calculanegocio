# CalculaNegocio v0.5 — revisión de entrada numérica

- Conservada íntegramente la arquitectura Astro y el diseño de la v0.4 de Claude.
- Se interpreta `1.250` como 1250 en formato español; `1.250,50` como 1250.50.
- Las entradas vacías e inválidas no se calculan como cero. Un cero introducido explícitamente sí se acepta cuando la fórmula lo permite.
- Se incorporan seis pruebas automatizadas de regresión.
- Sigue bloqueada la indexación por defecto.

## Pendiente antes de publicar

- Ejecutar `npm install`, `npm run check`, probar interfaz real y responsive en navegador.
- Crear páginas legales y contacto con datos reales del titular; no inventar datos legales.
- Validar supuestos fiscales con fuentes oficiales y comprobar despliegue.
- Activar indexación únicamente después de autorización.
