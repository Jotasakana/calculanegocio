// Datos legales del sitio (solo se usan en el build, nunca en el navegador).
// ÚNICA fuente: los textos de las páginas legales usan marcadores {{legal:...}} y no repiten estos datos a mano.
//
// Datos confirmados por la persona titular (24-10-2026). Se usan los mismos que en Hogar-Soluciones.es.
// NO añadir aquí datos que no estén confirmados. Lo pendiente está en DATOS-LEGALES-PENDIENTES.md.
export const LEGAL = {
  // 'draft'  -> indica que falta la revisión jurídica final (ver PENDIENTES-FASE7A.md y DATOS-LEGALES-PENDIENTES.md).
  //             Desde la Fase 7A ya NO se muestra ningún aviso de borrador en las páginas (solo es un indicador interno).
  // 'final'  -> solo cuando TODO lo pendiente esté resuelto y revisado por quien asesore al titular.
  status: 'draft',
  owner: 'Micaela Huarte',
  tradeName: 'Comercial Arbil Suministros',
  taxId: '29150333H',
  address: 'Calle Urbasa 2, 1.º D, 31800 Alsasua, Navarra, España',
  domain: 'calculanegocio.com',
  hosting: 'Cloudflare Pages',
  email: {
    address: 'admin@calculanegocio.com',
    // Correo confirmado operativo por la persona responsable (24-10-2026).
    // Se presenta como medio de contacto y enlace de correo (mailto).
    verified: true,
  },
  // Fecha del borrador de los textos (AAAA-MM-DD).
  updated: '2026-10-24',
};
