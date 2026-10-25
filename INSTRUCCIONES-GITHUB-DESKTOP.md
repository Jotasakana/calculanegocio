# Cómo incorporar la Fase 7A con GitHub Desktop

No necesitas terminal ni instalar nada. Unos 10 minutos. **No se publica nada hasta que tú fusiones.**

1. Abre **GitHub Desktop** → repositorio `calculanegocio` → **Fetch origin**. Comprueba arriba que estás en la rama `main` y que no hay cambios pendientes.
2. Menú **Branch → New branch…** → nombre `fase7a-confianza-y-catalogo` → **Create branch**.
3. Descomprime `calculanegocio-fase7a.zip`. Dentro hay una carpeta `calculanegocio-fase7a/`.
4. En GitHub Desktop: **Repository → Show in Explorer** (Windows) o **Show in Finder** (Mac). Se abre la carpeta del repositorio.
5. **Copia todo el contenido** de `calculanegocio-fase7a/` y pégalo dentro de esa carpeta, aceptando **Reemplazar** los archivos existentes.
   No borres la carpeta oculta `.git` (el ZIP no la incluye, así que no se toca). Si tienes `node_modules` o `dist`, déjalos: no están en el ZIP.
6. Vuelve a GitHub Desktop. Verás unos 60 archivos cambiados (textos en `src/locales`, algo de código en `src/lib` y `src/views`,
   pruebas en `scripts` y documentación). Escribe el resumen: «Fase 7A: legales sin marcadores, catálogo con 8 calculadoras y señales de confianza».
7. **Commit to fase7a-confianza-y-catalogo** → **Publish branch** → **Create Pull Request** (hacia `main`).
8. **No fusiones todavía.** En GitHub abre la pestaña **Checks** y espera a que *Build y pruebas* termine en verde (10–25 minutos). Es la comprobación
   definitiva con Astro real: aquí no se pudo ejecutar el build.
   * Si sale **rojo**: abre el paso fallido, copia el mensaje y pégamelo.
   * Si sale **verde**: abre la vista previa que genera Cloudflare Pages (si la hay) y mira a mano la portada, una calculadora y Metodología en español y en otro idioma.
9. Si todo está bien, pulsa **Merge pull request**. Cloudflare Pages publicará `main` en unos minutos.

**Qué verás en la web después:** la portada y «Calculadoras» muestran solo las 8 calculadoras que funcionan; cada calculadora y la Metodología llevan una franja con la fecha de actualización,
un enlace a la metodología, al titular (aviso legal) y al contacto; las páginas legales ya no muestran marcadores «pendiente».

**Importante**
* No se ha cambiado `SITE_INDEXABLE` ni su lógica, ni canonicals, hreflang o redirecciones. No hay publicidad, analítica ni cookies.
* La **URL de previsualización** que Cloudflare crea para un PR puede ser indexable si la variable `SITE_INDEXABLE` no está definida allí: no la compartas públicamente (ver `PENDIENTES-FASE7A.md`, paquete D).
* Si algo no te convence después de fusionar: en GitHub abre el PR fusionado → **Revert** crea otro PR que deshace todo. Antes de eso, la web no cambia.
* Para actualizar la fecha «Contenido actualizado» en el futuro: edita `src/data/trust.js` (una sola línea).

**Si algo falla en GitHub Actions**: abre el paso en rojo, copia el mensaje y pégamelo en un hilo nuevo, junto con este ZIP.
