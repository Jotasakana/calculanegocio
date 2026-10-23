# Recuperación asistida · Fase 2A

Este ZIP combina los archivos recuperados de la Fase 2A y los siguientes elementos restaurados:

- `scripts/test-calculators.mjs`: 133 aserciones originales de Fase 1, adaptadas a la API de v0.6; ejecutadas correctamente.
- `package-lock.json`: fichero original de la rama main, de GitHub / respaldo de Fase 1.
- `.github/workflows/build.yml`: flujo CI de Fase 1 restaurado.
- `scripts/check-site.mjs`: comprobación de la compilación escrita de nuevo para las rutas v0.6; pendiente verificar sobre `dist/` real. NO es el archivo original de la rama de Claude.

No se ha compilado Astro aquí por falta de dependencias descargables. La reconstrucción no es idéntica byte a byte a la rama perdida para los cuatro archivos anteriores. GitHub Actions debe validar `npm ci`, `npm test`, `npm run build` y `npm run test:dist` antes de aprobar o publicar.

El bloqueo de indexación sigue configurado por defecto.
