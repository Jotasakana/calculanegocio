// Ergebnis- und Fehlermeldungen auf Deutsch. Jeder Schlüssel muss in ALLEN Sprachen vorhanden sein (geprüft von
// scripts/check-i18n.mjs). Werte erlauben {Platzhalter} und für Plurale ein Objekt { one, other, ... }.
// Die internen Kennungen „iva“ und „precio“ bleiben für die beiden steuerbezogenen Rechner erhalten, sind auf Deutsch
// aber GENERISCH: Die Person gibt den Steuersatz selbst ein, Vorschriften eines Landes werden nicht vorausgesetzt.

export const errors = {
  'invalid-number': 'Geben Sie in jedes Feld eine gültige Zahl ein.',
  negative: 'Beträge und Prozentsätze dürfen nicht negativ sein.',
  'percent-over-100': 'Prüfen Sie die Prozentsätze: Sie dürfen 100 % nicht überschreiten.',
  'quantity-positive': 'Die Menge muss größer als null sein.',
  'quantities-positive': 'Die Mengen müssen positiv sein.',
  'margin-under-100': 'Die Marge muss unter 100 % liegen.',
  'margin-plus-commission': 'Marge und Provision ergeben zusammen 100 % oder mehr: Ein solcher Preis ist nicht möglich.',
  'discount-under-100': 'Der Rabatt muss unter 100 % liegen.',
  'returns-over-sales': 'Retouren dürfen den Umsatz nicht übersteigen.',
};

export const messages = {
  'common.notComputable': 'Nicht berechenbar',
  'common.checkData': 'Prüfen Sie Ihre Angaben.',
  'common.assumption.noVat': 'Alle Handelsbeträge werden ohne Steuer berechnet.',

  'margen.label.margin': 'Marge auf den Umsatz',
  'margen.label.price': 'Verkaufspreis ohne Steuer',
  'margen.label.cost': 'Empfohlene Kostenobergrenze',
  'margen.note': 'Marge auf den Umsatz und Aufschlag auf die Kosten sind verschiedene Prozentsätze.',
  'margen.note.below': 'Achtung: Der Verkaufspreis liegt unter den Kosten.',
  'margen.line.benefit': 'Gewinn pro Einheit',
  'margen.line.margin': 'Marge auf den Umsatz',
  'margen.line.markup': 'Aufschlag auf die Kosten',
  'margen.bar.cost': 'Kosten',
  'margen.bar.profit': 'Gewinn',
  'margen.line.total': { one: 'Gesamtgewinn ({units} Einheit)', other: 'Gesamtgewinn ({units} Einheiten)' },

  'precio.label': 'Verkaufspreis inklusive Steuer',
  'precio.note': 'Preis ohne Steuer: {price}',
  'precio.line.totalCost': 'Gesamtkosten',
  'precio.line.fee': 'Provision',
  'precio.line.profit': 'Gewinn pro Einheit',
  'precio.line.margin': 'Tatsächliche Marge',
  'precio.line.markup': 'Tatsächlicher Aufschlag',
  'precio.line.vat': 'Steuer',
  'precio.line.listNet': 'Listenpreis vor Rabatt (ohne Steuer)',
  'precio.line.listGross': 'Listenpreis vor Rabatt (inklusive Steuer)',
  'precio.bar.cost': 'Kosten',
  'precio.bar.fee': 'Provision',
  'precio.bar.profit': 'Gewinn',
  'precio.bar.vat': 'Steuer',
  'precio.assumption': 'Die Provision wird auf den Preis ohne Steuer berechnet. Die Steuer wird getrennt ausgewiesen und gehört nicht zum Gewinn. Der Steuersatz ist der von Ihnen eingegebene Prozentsatz; dieses Werkzeug kennt keine Vorschriften eines Landes.',

  'rentabilidad.label': 'Nettoergebnis des Zeitraums',
  'rentabilidad.note': 'Nettomarge: {rate}',
  'rentabilidad.line.revenue': 'Nettoumsatz',
  'rentabilidad.line.gross': 'Rohgewinn',
  'rentabilidad.line.operating': 'Betriebsergebnis',
  'rentabilidad.line.pretax': 'Vor Steuern',
  'rentabilidad.line.net': 'Nettomarge',
  'rentabilidad.bar.cogs': 'Wareneinsatz',
  'rentabilidad.bar.operating': 'Betriebsausgaben',
  'rentabilidad.bar.other': 'Finanzierungskosten und Steuern',
  'rentabilidad.bar.net': 'Nettoergebnis',
  'rentabilidad.assumption': 'Die angegebene Steuer ist ein von Ihnen manuell eingegebener Betrag; wir schätzen keine Steuerschuld. Ohne Steuerbetrag ist das Endergebnis ein Ergebnis vor Steuern.',

  'iva.label': 'Gesamtbetrag inklusive Steuer',
  'iva.note': 'Steuerbetrag: {vat}',
  'iva.line.base': 'Nettobetrag (Betrag ohne Steuer)',
  'iva.line.vat': 'Steuer',
  'iva.line.groupBase': 'Nettobetrag zu {rate} %',
  'iva.line.groupVat': 'Steuer zu {rate} %',
  'iva.bar.base': 'Nettobetrag',
  'iva.bar.vat': 'Steuer',
  'iva.assumption': 'Orientierende Berechnung mit dem von Ihnen eingegebenen Prozentsatz. Die Beträge werden auf die kleinste Währungseinheit gerundet, und der Gesamtbetrag ist die Summe aus Nettobetrag und Steuer. Bei mehreren Positionen ergibt sich die Steuer, indem der Nettobetrag je Satz zusammengefasst wird. Prüfen Sie Satz und Berechnungsweise, die für Sie gelten, bevor Sie Rechnungen ausstellen.',
};
