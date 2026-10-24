# Instrucciones sencillas · GitHub Desktop

1. Abre GitHub Desktop con el repositorio `Jotasakana/calculanegocio`, rama `main` actualizada (*Fetch origin* / *Pull*).
2. Menú **Branch → New branch…**, nombre `fase5a-preparacion-legal`, *Create branch*.
3. Descomprime `calculanegocio-fase5a.zip` y copia su contenido **sobre la carpeta del repositorio**, aceptando reemplazar archivos (no copies `node_modules`, `dist` ni `preview-dist`; el ZIP no los incluye).
4. GitHub Desktop mostrará los cambios. Resumen: «Fase 5A: páginas legales y preparación de privacidad». *Commit to fase5a-preparacion-legal*.
5. **Publish branch**. GitHub Actions ejecutará `npm ci`, pruebas, compilación y comprobaciones: esa ejecución es la prueba definitiva.
6. Si todo sale en verde, abre un *Pull Request* hacia `main` **pero no lo fusiones** hasta completar `DATOS-LEGALES-PENDIENTES.md`. Nota: Cloudflare Pages puede crear una vista previa de la rama; es normal y no cambia la configuración.
