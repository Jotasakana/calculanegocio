// Redaktioneller Status der deutschen Inhalte.
//
// 'unreviewed' = KI-gestützte Übersetzung, die noch NICHT von einer Person mit Deutsch als Muttersprache geprüft wurde.
// Sie wird nur in der privaten, nicht indexierbaren Demo angezeigt. Hier ist kein Prüfer eingetragen: Eine Seite wird
// erst dann auf 'reviewed' gesetzt (mit reviewer, date und scope), wenn tatsächlich eine Person sie geprüft hat.
// Es werden niemals Prüfungen eingetragen, die nicht stattgefunden haben.
export const review = {
  default: { status: 'unreviewed' },
  pages: {},
};
