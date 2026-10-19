# Informe v0.4 · migración a Astro

## Comprobaciones realizadas (ejecutadas en esta sesión)
- **Fórmulas (`npm run test` → `scripts/test-calculators.mjs`)**: 48 comprobaciones superadas, usando como referencia los ejemplos resueltos de las explicaciones (margen, precio con comisión y descuento, analizar precio, rentabilidad con devoluciones y pérdidas, IVA añadir/quitar, redondeo, factura de varias líneas) y los mensajes de validación.
- **Código fuente (`scripts/check-source.mjs`)**: cada URL del mapa tiene su página y viceversa; formato de URLs (minúsculas, barra final); todos los enlaces internos literales apuntan a URLs existentes; los textos editoriales no contienen `\` sueltas ni referencias a páginas inexistentes; no quedan menciones a guías ni a "Demo"; longitud de títulos y descripciones.
- Revisión manual del equilibrio de etiquetas de las plantillas `.astro`.

## Pendiente de ejecutar (no se ha podido hacer aquí: el registro npm está bloqueado en esta sesión)
- `npm install` y `npm run build`: **las plantillas `.astro` no se han compilado nunca**. Pueden aparecer errores de sintaxis o de importación al primer build.
- `npm run test:dist` (`scripts/check-site.mjs`): escrito pero sin ejecutar. Comprueba en `dist/` canonical, Open Graph, h1 único, enlaces y anclas, resultado inicial y texto editorial en HTML estático, robots y sitemap.
- Prueba en navegador de las calculadoras (pestañas, recálculo, restablecer, teclado), menú móvil y buscador. La lógica de cálculo sí está probada; el cableado del DOM (`src/scripts/calculator.js`) no.
- Comparación visual con la Home v0.3 (el CSS es el original, pero no se ha renderizado).
- Lighthouse / accesibilidad / contraste.

## Errores del prototipo corregidos
1. Barras `\` sueltas visibles en 6 fórmulas (rentabilidad e IVA).
2. Textos que citaban páginas inexistentes (markup, margen de beneficio, factura con IVA e IRPF, "Cómo hacer una factura"): reescritos o eliminados; "Herramientas relacionadas" ahora enlaza solo a páginas reales.
3. Sección "Guías" de la Home enlazaba a calculadoras: sustituida por "Explicaciones incluidas" (misma maquetación); se quitan "Guías" del menú, el botón "Ver guías prácticas" y las entradas "Guía:" del buscador.
4. Contenido cargado por JavaScript y navegación por `#hash`: ahora HTML estático con URLs reales; resultado inicial calculado en build.
5. Título "Demo Home", descripción "Demo privada" y nota que mencionaba a Claude: solo visibles en modo desarrollo o eliminados.
6. Menú móvil: a ≤620 px los enlaces quedaban ocultos con el menú abierto.
7. Importes de 4 cifras sin separador de miles (1512,50 €) frente a los textos (1.512,50 €): ahora 1.512,50 €.
8. Jerarquía de títulos (h1 → h3): ahora h1 → h2 → h3, con el mismo tamaño visual.
9. Accesibilidad: enlace "Saltar al contenido", pestañas con roles ARIA y teclado, foco visible, migas reales.

## Decisiones que necesito de ti
- **Parseo de importes**: escribir `1.250` se interpreta como 1,25 (comportamiento del prototipo). En España suele significar 1250. No lo he cambiado; propongo tratar `1.250` como miles.
- **Campo vacío** se calcula como 0 (prototipo). ¿Prefieres mostrar error?
- **Imagen Open Graph**: no existe; requiere diseño. Hay `twitter:card=summary` sin imagen.
- **Textos legales** (privacidad, aviso legal, contacto): pendientes, sin página.
- **Revisión fiscal** de tipos de IVA, retenciones e impuesto sobre beneficios, antes de publicar.
- El buscador de la Home requiere JavaScript (sin JS el campo no hace nada).
- La Home actualmente enlaza a las 2 categorías y a las 4 calculadoras; la sección "Explicaciones incluidas" es informativa (sin enlaces salvo la calculadora de margen).
