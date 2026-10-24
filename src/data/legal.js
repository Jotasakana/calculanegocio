// Datos legales del sitio (solo se usan en el build, nunca en el navegador).
// ÚNICA fuente: los textos de las páginas legales usan marcadores {{legal:...}} y no repiten estos datos a mano.
//
// Datos confirmados por la persona titular (24-10-2026). Se usan los mismos que en Hogar-Soluciones.es.
// NO añadir aquí datos que no estén confirmados. Lo pendiente está en DATOS-LEGALES-PENDIENTES.md.
export const LEGAL = {
  // 'draft'  -> las páginas legales muestran un aviso visible de "borrador pendiente de revisión".
  // 'final'  -> solo cuando TODO lo de DATOS-LEGALES-PENDIENTES.md esté resuelto y revisado.
  status: 'draft',
  owner: 'Micaela Huarte',
  tradeName: 'Comercial Arbil Suministros',
  taxId: '29150333H',
  address: 'Calle Urbasa 2, 1.º D, 31800 Alsasua, Navarra, España',
  domain: 'calculanegocio.com',
  hosting: 'Cloudflare Pages',
  email: {
    address: 'admin@calculanegocio.com',
    // false = propuesta: todavía no se ha comprobado que reciba y responda correo.
    // Mientras sea false NO se muestra como enlace ni como canal de contacto disponible.
    verified: false,
  },
  // Fecha del borrador de los textos (AAAA-MM-DD).
  updated: '2026-10-24',
};
