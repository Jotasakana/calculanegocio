// Configuración de consentimiento para CalculaNegocio.com.
// La CMP de Google se configura y publica en AdSense > Privacidad y mensajes.
// Importante: mientras esta opción sea false NO se carga el código publicitario.
// La activación requiere ANTES publicar el mensaje de Google y actualizar políticas de privacidad/cookies.
const enabled = process.env.GOOGLE_CMP_READY === 'true';

export const CONSENT = {
  enabled,
  provider: enabled ? 'google-adsense' : null,
  // No se utiliza URL de un proveedor inventada: Google sirve su CMP a través de la etiqueta AdSense.
  scriptUrl: null,
  publisherId: 'ca-pub-9242108088602528',
};
