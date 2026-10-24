// Rellena los marcadores {nombre} de un texto de interfaz. Función PURA y sin dependencias (también la usa el navegador).
// Un marcador sin valor es un error de programación: se lanza en vez de publicar «undefined».
export function fill(text, params = {}) {
  return String(text).replace(/\{(\w+)\}/g, (all, key) => {
    if (!(key in params)) throw new Error(`Falta el valor del marcador ${all} en: ${text}`);
    return String(params[key]);
  });
}
