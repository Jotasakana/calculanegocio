// Preparación técnica para una futura CMP (plataforma de gestión del consentimiento). Solo se usa en el build.
//
// ESTADO ACTUAL: no hay CMP. El sitio no instala cookies ni scripts de terceros, por lo que no hay nada que consentir.
// NO se incluye ninguna CMP propia ni se declara que exista una certificada.
//
// Para activar una CMP certificada por Google (compatible con TCF) en el futuro, ver docs/CMP-GOOGLE-TCF.md:
//   1. Elegir la CMP de la lista de Google, contratarla y obtener su script oficial.
//   2. Rellenar `scriptUrl` (y `provider`) y poner `enabled: true`. El layout la cargará la PRIMERA en <head>.
//   3. Solo después, y nunca antes, cargar cualquier script de medición o publicidad condicionado al consentimiento.
export const CONSENT = {
  enabled: false,
  provider: null,
  // URL del script oficial de la CMP (https://...). Debe ser null mientras enabled sea false.
  scriptUrl: null,
};
