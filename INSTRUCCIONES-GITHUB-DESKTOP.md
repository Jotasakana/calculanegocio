# Cómo incorporar la Fase 3B con GitHub Desktop

No necesitas terminal ni instalar nada. Son unos 10 minutos.

1. Abre **GitHub Desktop** → repositorio `calculanegocio` → **Fetch origin** y comprueba que estás en `main` actualizado.
2. Menú **Branch → New branch…** → nombre `fase3b-idiomas-de-fr-hi` → **Create branch**.
3. Descomprime `calculanegocio-fase3b-idiomas.zip`. Dentro hay una carpeta `calculanegocio/`.
4. Abre la carpeta local del repositorio (en GitHub Desktop: **Repository → Show in Explorer / Finder**) y **copia el contenido** de
   `calculanegocio/` sobre ella, aceptando **Reemplazar** los archivos que ya existan.
   No borres la carpeta oculta `.git` (el ZIP no la incluye, así que no se toca).
5. Vuelve a GitHub Desktop: verás la lista de archivos cambiados (carpetas nuevas `src/locales/de`, `fr` y `hi`, y ajustes en pruebas, CSS y documentación).
   Escribe el resumen: «Fase 3B: alemán, francés e hindi + selector de seis idiomas».
6. **Commit to fase3b-idiomas-de-fr-hi** → **Publish branch**.
7. Pulsa **Create Pull Request** (hacia `main`). **No la fusiones todavía**: abre la pestaña **Checks** y espera a que *Build y pruebas* termine en verde
   (puede tardar de 10 a 20 minutos; ahora tiene un límite de 30). Al final descarga los artefactos `screenshots` y `dist` para revisarlos.
8. Cuando lo apruebes, fusiona. Cloudflare Pages publicará `main`. Mientras no fusiones, la web pública no cambia.

**Importante**: no cambies `SITE_INDEXABLE`. Debe seguir en `false` (la web sigue con `noindex` y `robots.txt` bloqueado) hasta que se revisen los contenidos
y las páginas legales.

**Alternativa**: `calculanegocio-fase3b.bundle` es un repositorio Git con el commit de la fase. Solo hace falta si prefieres traerlo con Git
(en una rama nueva: `git pull calculanegocio-fase3b.bundle fase3b-idiomas-de-fr-hi`).

**Si algo falla en GitHub Actions**: abre el paso en rojo, copia el mensaje y pégamelo en un hilo nuevo, junto con este ZIP.
