# Cómo incorporar la Fase 3A con GitHub Desktop

1. Abre GitHub Desktop → repositorio `calculanegocio` → **Fetch origin** y comprueba que estás en `main` actualizado.
2. Menú **Branch → New branch…** → nombre `fase3a-idiomas-en-ptbr` → **Create branch**.
3. Cierra GitHub Desktop un momento. Descomprime `calculanegocio-fase3a-idiomas.zip` y **copia su contenido** (carpeta `calculanegocio/`)
   sobre la carpeta local del repositorio, aceptando **reemplazar** archivos. (No borres la carpeta `.git`; el ZIP no la incluye.)
4. Vuelve a GitHub Desktop: verás los archivos cambiados. Escribe un resumen: «Fase 3A: español, inglés y portugués de Brasil + selector de idioma».
5. **Commit to fase3a-idiomas-en-ptbr** → **Publish branch**.
6. Pulsa **Create Pull Request** (hacia `main`). **No la fusiones todavía**: espera a que GitHub Actions termine en verde (pestaña *Checks*).
   Descarga los artefactos `screenshots` y `dist` para revisarlos.
7. Cuando lo apruebes, fusiona. Cloudflare Pages publicará `main`. Mientras tanto la web pública no cambia.

Alternativa: `calculanegocio-fase3a.bundle` es un repositorio Git con el commit de la fase (`git pull` desde ese archivo en una rama nueva).
