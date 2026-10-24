// Valores de los marcadores {{legal:...}} de los textos legales. Función pura: devuelve HTML ya escapado.
import { LEGAL } from '../data/legal.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const LEGAL_FIELDS = ['owner', 'tradeName', 'taxId', 'address', 'domain', 'hosting', 'email', 'contactStatus', 'updated'];

/**
 * @param {string} id uno de LEGAL_FIELDS
 * @param {{ ui:object, intl:string }} loc textos de interfaz del idioma y su configuración regional
 * @param {typeof LEGAL} data
 */
export function legalField(id, { ui, intl }, data = LEGAL) {
  switch (id) {
    case 'owner': case 'tradeName': case 'taxId': case 'address': case 'domain': case 'hosting':
      return esc(data[id]);
    case 'email':
      // Pendiente de verificación: se muestra como texto, nunca como enlace mailto, con su marca visible.
      return data.email.verified
        ? `<a href="mailto:${esc(data.email.address)}">${esc(data.email.address)}</a>`
        : `${esc(data.email.address)} <mark class="legal-pending">${esc(ui.legal.emailPending)}</mark>`;
    case 'contactStatus':
      return esc(data.email.verified ? ui.legal.contactOperative : ui.legal.contactPending);
    case 'updated':
      return esc(new Intl.DateTimeFormat(intl, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(data.updated + 'T00:00:00Z')));
    default:
      throw new Error(`Marcador legal desconocido: ${id}`);
  }
}
