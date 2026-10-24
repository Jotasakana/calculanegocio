# Cómo incorporar la Fase 4 (ocho calculadoras) con GitHub Desktop

No necesitas terminal ni instalar nada. Son unos 10 minutos.

1. Abre **GitHub Desktop** → repositorio `calculanegocio` → **Fetch origin** y comprueba que estás en `main` actualizado.
2. Menú **Branch → New branch…** → nombre `fase4-cuatro-calculadoras` → **Create branch**.
3. Descomprime `calculanegocio-fase4-calculadoras.zip`. Dentro hay una carpeta `calculanegocio/`.
4. Abre la carpeta local del repositorio (en GitHub Desktop: **Repository → Show in Explorer / Finder**) y **copia el contenido** de
   `calculanegocio/` sobre ella, aceptando **Reemplazar** los archivos que ya existan.
   No borres la carpeta oculta `.git` (el ZIP no la incluye, así que no se toca).
5. Vuelve a GitHub Desktop: verás los archivos cambiados (textos nuevos en `src/locales/*`, fórmulas en `src/domain`, pruebas en `scripts`,
   un ajuste de CSS y documentación). Escribe el resumen: «Fase 4: recargo, descuentos, punto de equilibrio y ROI en seis idiomas».
6. **Commit to fase4-cuatro-calculadoras** → **Publish branch**.
7. Pulsa **Create Pull Request** (hacia `main`). **No la fusiones todavía**: abre la pestaña **Checks** y espera a que *Build y pruebas* termine en verde
   (de 10 a 25 minutos). Es la comprobación definitiva con Astro real (`npm run build` y `npm run test:dist`). Al final descarga los artefactos
   `screenshots` y `dist` para revisarlos.
8. Cuando lo apruebes, fusiona. Cloudflare Pages publicará `main`. Mientras no fusiones, la web pública no cambia.

**Importante**: no cambies `SITE_INDEXABLE`. Debe seguir en `false` (la web sigue con `noindex` y `robots.txt` bloqueado) hasta que se revisen los contenidos
y las páginas legales. No se ha tocado Cloudflare, DNS ni AdSense.

**Alternativa con Git**: `calculanegocio-fase4.bundle` contiene el historial con dos commits (la base `main` del ZIP y la fase 4 en la rama
`fase4-cuatro-calculadoras`). Para traer solo la rama a tu repositorio: `git fetch calculanegocio-fase4.bundle fase4-cuatro-calculadoras:fase4-cuatro-calculadoras`.
Si tu `main` real tiene commits que no están en el ZIP, usa mejor el método del ZIP.

**Si algo falla en GitHub Actions**: abre el paso en rojo, copia el mensaje y pégamelo en un hilo nuevo, junto con este ZIP.
