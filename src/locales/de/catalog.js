// Katalog auf Deutsch: Kategorien, die noch keinen verfügbaren Rechner haben, und Texte der Rechner IN ENTWICKLUNG.
// Die Schlüssel entsprechen src/domain/catalog.js. Länderspezifische Steuerwerkzeuge (Einbehalt auf Rechnungen,
// Aufschlag im Einzelhandel) werden auf Deutsch nicht angeboten und haben deshalb hier keinen Eintrag.

export const catalog = {
  categories: {
    crecimiento: {
      title: 'Rentabilität und Wachstum',
      short: 'Prozentuale Veränderung, Break-even, ROI und Werbung',
    },
    finanzas: {
      title: 'Unternehmensfinanzen',
      short: 'Darlehen, Abschreibung, Lagerbestand und Liquiditätsreserve',
    },
  },
  planned: {
    recargo: { title: 'Aufschlag auf die Kosten', desc: 'Rechnen Sie zwischen Aufschlag und Marge um, ohne beides zu verwechseln.', search: 'aufschlag kalkulation kosten marge prozent' },
    descuento: { title: 'Rabatte und Endpreis', desc: 'Wenden Sie einen oder mehrere Rabatte an und prüfen Sie, welche Marge Ihnen bleibt.', search: 'rabatt nachlass endpreis angebot aktion' },
    marketplace: { title: 'Marktplatzgebühren', desc: 'Berechnen Sie den Mindestpreis für den Verkauf auf einer Plattform, ohne Marge zu verlieren.', search: 'marktplatz gebühren provision plattform onlinehandel verkauf' },
    hora: { title: 'Stundensatz', desc: 'Schätzen Sie, was Sie pro Stunde verlangen sollten – aus Ihren Kosten und abrechenbaren Stunden.', search: 'stundensatz stundenlohn freelancer honorar abrechenbare stunden' },
    variacion: { title: 'Prozentuale Veränderung', desc: 'Vergleichen Sie zwei Zeiträume und messen Sie, wie stark eine Zahl gestiegen oder gesunken ist.', search: 'prozentuale veränderung zunahme abnahme wachstum' },
    equilibrio: { title: 'Break-even-Punkt', desc: 'Finden Sie heraus, wie viele Einheiten Sie verkaufen müssen, um Ihre Fixkosten zu decken.', search: 'break-even gewinnschwelle fixkosten stückzahl rentabilität' },
    roi: { title: 'Kapitalrendite (ROI)', desc: 'Messen Sie die Rendite einer Investition im Verhältnis zum eingesetzten Betrag.', search: 'roi kapitalrendite investition rentabilität' },
    roas: { title: 'Rendite von Werbekampagnen (ROAS)', desc: 'Sehen Sie, welchen Umsatz Sie pro ausgegebener Werbeeinheit erzielen (ROAS).', search: 'roas werbung kampagne anzeigen rendite' },
    prestamo: { title: 'Darlehensrate', desc: 'Berechnen Sie die regelmäßige Rate, die Zinsen und den insgesamt zurückzuzahlenden Betrag.', search: 'darlehen kredit rate zinsen finanzierung tilgung' },
    amortizacion: { title: 'Lineare Abschreibung', desc: 'Verteilen Sie die Kosten eines Vermögenswerts auf seine Nutzungsdauer.', search: 'lineare abschreibung afa anlagevermögen nutzungsdauer' },
    stock: { title: 'Lagerumschlag', desc: 'Messen Sie, wie oft Sie Ihren Lagerbestand in einem Zeitraum erneuern.', search: 'lagerumschlag lagerbestand inventar' },
    tesoreria: { title: 'Liquiditätsreserve', desc: 'Berechnen Sie, wie viele Monate an Ausgaben Ihr verfügbares Geld abdeckt.', search: 'liquiditätsreserve liquidität kasse monate ausgaben' },
  },
};
