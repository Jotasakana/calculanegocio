// Deutsche Texte der Rechner und Kategorien (ohne Logik). Die Schlüssel entsprechen src/domain/registry.js.
// Die Feldbezeichnungen enthalten keine Einheit: Die Darstellungsschicht ergänzt sie je nach Feldtyp und gewählter
// Währung („Einkaufskosten“ + € -> „Einkaufskosten (€)“).
//
// Die Rechner mit den Kennungen „precio“ und „iva“ sind auf Deutsch GENERISCHE Steuerrechner: Die Person gibt den
// Steuersatz selbst ein, und es werden keine Sätze oder Vorschriften eines Landes vorausgesetzt. `defaults`
// überschreibt die Startwerte des Registers für diese Sprache; die Sätze sind nur veränderbare Beispiele.

export const slugs = {
  tools: 'rechner',
  methodology: 'methodik',
  categories: { 'margenes-y-precios': 'marge-und-preise', facturacion: 'rechnungen-und-steuer' },
  toolPages: {
    margen: 'gewinnmargenrechner',
    precio: 'verkaufspreisrechner',
    rentabilidad: 'brutto-und-nettomargenrechner',
    iva: 'nettobetragrechner',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Marge und Preise',
    kicker: 'KATEGORIE',
    short: 'Marge, Aufschlag, Verkaufspreis und Rentabilität',
    description:
      'Rechner, um Preise festzulegen, den Unterschied zwischen Marge und Aufschlag zu verstehen und die Rentabilität Ihres Unternehmens zu analysieren.',
  },
  facturacion: {
    title: 'Rechnungen und Steuer',
    kicker: 'KATEGORIE',
    short: 'Nettobetrag und Aufschlüsselung der Steuer',
    description:
      'Werkzeuge für Nettobetrag und Steuerbetrag Ihrer Rechnungen: Steuer hinzufügen oder herausrechnen und mehrere Positionen aufschlüsseln – mit dem von Ihnen eingegebenen Prozentsatz.',
  },
};

export const tools = {
  margen: {
    title: 'Gewinnmargenrechner',
    menuTitle: 'Gewinnmarge',
    metaTitle: 'Gewinnmargen- und Aufschlagsrechner',
    metaDescription:
      'Berechnen Sie Marge auf den Umsatz, Aufschlag auf die Kosten und Gewinn pro Einheit. Mit Formeln, Rechenbeispielen und häufigen Fehlern. Kostenlos, ohne Anmeldung.',
    kicker: 'MARGE UND PREISE',
    desc: 'Berechnen Sie, wie viel Sie pro Verkauf verdienen, die Marge auf den Preis und den Aufschlag auf Ihre Kosten – ohne Steuer einzurechnen.',
    tileText: 'Sehen Sie, wie viel Sie pro Produkt verdienen und worin sich Marge und Aufschlag unterscheiden.',
    tileCta: 'Marge berechnen',
    search: 'gewinnmarge handelsspanne aufschlag kalkulation gewinn prozent rohertrag',
    formulas: [
      ['Gewinn', 'Verkaufspreis − Kosten'],
      ['Marge auf den Umsatz', 'Gewinn ÷ Verkaufspreis × 100'],
      ['Aufschlag auf die Kosten', 'Gewinn ÷ Kosten × 100'],
    ],
    faq: [
      ['Was ist der Unterschied zwischen Marge und Aufschlag?', 'Die Marge wird auf den Verkaufspreis berechnet, der Aufschlag auf die Kosten. Bei Kosten von 60 und einem Preis von 100 beträgt der Gewinn 40: eine Marge von 40 % und ein Aufschlag von 66,67 %.'],
      ['Enthält die Marge die Steuer?', 'Nein. Geben Sie Beträge ohne Steuer ein, denn die Umsatzsteuer ist für Ihr Unternehmen weder Kosten noch Gewinn.'],
      ['Was bedeutet eine negative Marge?', 'Dass Sie unter den Kosten verkaufen: Der Gewinn pro Einheit ist negativ, und der Rechner weist Sie darauf hin.'],
      ['Kann ich den Preis aus einer Marge berechnen?', 'Ja. Nutzen Sie den Reiter „Ich will eine Marge“ mit den Kosten und der gewünschten Marge. Haben Sie bereits den Preis und suchen die höchsten tragbaren Kosten, nutzen Sie „Maximale Kosten“.'],
    ],
    modes: ['Ich habe Kosten und Preis', 'Ich will eine Marge', 'Maximale Kosten'],
    fields: [
      { cost: 'Einkaufskosten', price: 'Preis ohne Steuer', quantity: 'Menge' },
      { cost: 'Stückkosten', margin: 'Zielmarge', quantity: 'Menge' },
      { price: 'Preis ohne Steuer', margin: 'Zielmarge', quantity: 'Menge' },
    ],
  },
  precio: {
    title: 'Verkaufspreisrechner mit Steuer',
    menuTitle: 'Verkaufspreis mit Steuer',
    metaTitle: 'Verkaufspreisrechner mit Steuer und Provision',
    metaDescription:
      'Berechnen Sie einen Verkaufspreis aus Kosten, Marge oder Aufschlag, Provision, Rabatt und einem frei gewählten Steuersatz. Mit Rechenbeispielen. Kostenlos.',
    kicker: 'PREISE UND MARGE',
    desc: 'Legen Sie den Verkaufspreis mit Marge oder Aufschlag fest und sehen Sie die Wirkung von Provisionen, Rabatten und einem von Ihnen eingegebenen Steuersatz.',
    tileText: 'Berechnen Sie einen Preis aus Ihren Kosten, Ihrer Marge, Rabatten und Steuer.',
    tileCta: 'Preis berechnen',
    search: 'verkaufspreis preiskalkulation rabatt kosten provision gebühren steuer mwst umsatzsteuer bruttopreis',
    defaults: { vat: 10 },
    formulas: [
      ['Gesamtkosten', 'Stückkosten + Zusatzkosten'],
      ['Preis ohne Steuer (Zielmarge)', 'Gesamtkosten ÷ (1 − Provision − Marge)'],
      ['Preis ohne Steuer (Aufschlag)', 'Gesamtkosten × (1 + Aufschlag)'],
      ['Preis inklusive Steuer', 'Preis ohne Steuer × (1 + Steuersatz)'],
    ],
    faq: [
      ['Wird die Marge auf die Kosten oder auf den Preis berechnet?', 'Bei „Zielmarge“ wird sie auf den Verkaufspreis ohne Steuer berechnet. Wenn Sie einen Prozentsatz auf die Kosten bevorzugen, nutzen Sie „Aufschlag auf die Kosten“.'],
      ['Was gehört unter „Zusatzkosten“?', 'Alle Kosten, die Sie pro verkaufter Einheit zahlen und die nicht bereits in den Stückkosten stecken: Versand, Verpackung, Personalisierung …'],
      ['Warum steigt der Preis so stark, wenn ich eine Provision hinzufüge?', 'Weil die Provision auf den Verkaufspreis gezahlt wird, nicht auf die Kosten. Marge und Provision werden gemeinsam von 100 % des Preises abgezogen, ihre Summe muss also unter 100 % liegen.'],
      ['Kann ich einen bereits vorhandenen Preis analysieren?', 'Ja, mit „Preis analysieren“: Geben Sie den Preis ein, geben Sie an, ob er Steuer enthält, dazu die Kosten und die Provision – der Rechner zeigt die tatsächliche Marge, die bleibt.'],
      ['Welchen Steuersatz soll ich verwenden?', 'Der Rechner wendet den von Ihnen eingegebenen Prozentsatz an und kennt keine Vorschriften eines Landes. Der Startwert ist nur ein veränderbares Beispiel; den richtigen Satz klären Sie anhand amtlicher Quellen oder mit Ihrer Beratung.'],
    ],
    modes: ['Zielmarge', 'Aufschlag auf die Kosten', 'Preis analysieren'],
    fields: [
      { cost: 'Stückkosten', extra: 'Zusatzkosten', margin: 'Zielmarge', commission: 'Provision', discount: 'Geplanter Rabatt', vat: 'Steuersatz' },
      { cost: 'Stückkosten', extra: 'Zusatzkosten', markup: 'Aufschlag', commission: 'Provision', discount: 'Geplanter Rabatt', vat: 'Steuersatz' },
      { cost: 'Stückkosten', extra: 'Zusatzkosten', given: 'Eingegebener Verkaufspreis', commission: 'Provision', vat: 'Steuersatz', included: 'Eingegebener Preis enthält Steuer' },
    ],
  },
  rentabilidad: {
    title: 'Brutto- und Nettomargenrechner',
    menuTitle: 'Brutto- und Nettomarge',
    metaTitle: 'Rechner für Brutto- und Nettomarge',
    metaDescription:
      'Berechnen Sie Brutto-, Betriebs- und Nettomarge aus Umsatz, Kosten und Ausgaben desselben Zeitraums. Mit Rechenbeispielen. Kostenlos, ohne Anmeldung.',
    kicker: 'RENTABILITÄT DES UNTERNEHMENS',
    desc: 'Schlüsseln Sie Umsatz, Kosten und Ausgaben desselben Zeitraums auf, um Brutto-, Betriebs- und Nettomarge zu erhalten.',
    tileText: 'Analysieren Sie Erlöse, Kosten, Ausgaben und die Rentabilität Ihres Geschäfts.',
    tileCta: 'Rentabilität ansehen',
    search: 'bruttomarge nettomarge ausgaben gewinn rentabilität umsatzrendite',
    formulas: [
      ['Nettoumsatz', 'Umsatz − Retouren und Rabatte'],
      ['Bruttomarge', '(Nettoumsatz − Wareneinsatz) ÷ Nettoumsatz × 100'],
      ['Betriebsergebnis', 'Nettoumsatz − Wareneinsatz − Betriebsausgaben'],
      ['Nettogewinn', 'Betriebsergebnis − Finanzierungskosten − Ertragsteuer'],
    ],
    faq: [
      ['Was ist der Nettoumsatz?', 'Der Umsatz des Zeitraums abzüglich Retouren und Rabatten. Er ist die Bezugsgröße für alle Prozentsätze.'],
      ['Sind Bruttomarge und Gewinnmarge dasselbe?', 'Nein. Die Gewinnmarge eines Produkts verwendet seinen Preis und seine Kosten; die Bruttomarge gilt für das gesamte Unternehmen über einen Zeitraum, bezogen auf den Nettoumsatz.'],
      ['Was gehört in die Betriebsausgaben?', 'Die laufenden Kosten des Zeitraums, die nicht zum Wareneinsatz zählen: Miete, Nebenkosten, Personal, Werbung … Verwenden Sie immer Beträge desselben Zeitraums.'],
      ['Kann das Ergebnis negativ sein?', 'Ja. Übersteigen Kosten und Ausgaben den Umsatz, ist das Ergebnis ein Verlust, und der Rechner zeigt ihn mit Minuszeichen an.'],
    ],
    modes: ['Ergebnis des Zeitraums'],
    fields: [
      { sales: 'Umsatz des Zeitraums', returns: 'Retouren und Rabatte', cogs: 'Wareneinsatz', operating: 'Betriebsausgaben', finance: 'Finanzierungskosten', tax: 'Ertragsteuer' },
    ],
  },
  iva: {
    title: 'Nettobetragrechner',
    menuTitle: 'Nettobetrag und Steuerbetrag',
    metaTitle: 'Nettobetragrechner: Steuer hinzufügen und abziehen',
    metaDescription:
      'Ermitteln Sie den Nettobetrag aus einem Bruttobetrag, fügen Sie Steuer hinzu oder schlüsseln Sie eine Rechnung mit mehreren Positionen auf. Kostenlos.',
    kicker: 'RECHNUNGEN',
    desc: 'Ermitteln Sie Steuerbetrag und Gesamtbetrag aus dem Nettobetrag – oder den Nettobetrag, wenn ein Betrag bereits Steuer enthält. Den Prozentsatz geben Sie selbst ein.',
    tileText: 'Steuer hinzufügen oder herausrechnen und die Aufschlüsselung der Beträge prüfen.',
    tileCta: 'Steuer berechnen',
    search: 'nettobetrag bruttobetrag steuer hinzufügen herausrechnen mwst umsatzsteuer vat gst rechnung aufschlüsselung',
    defaults: { vat: 10, vat1: 10, vat2: 10, vat3: 5 },
    formulas: [
      ['Steuer', 'Nettobetrag × Steuersatz'],
      ['Gesamtbetrag', 'Nettobetrag + Steuer'],
      ['Nettobetrag aus dem Gesamtbetrag', 'Gesamtbetrag ÷ (1 + Steuersatz)'],
    ],
    faq: [
      ['Was ist der Nettobetrag?', 'Es ist der Betrag des Geschäftsvorfalls vor Anwendung der Steuer, nach Abzug aller Rabatte, die den Preis mindern.'],
      ['Wie rechne ich die Steuer aus einem Betrag heraus?', 'Teilen Sie den Gesamtbetrag durch 1 plus den Steuersatz als Bruch: bei 10 % durch 1,10. Der Reiter „Steuer abziehen“ erledigt das für Sie.'],
      ['Wie wird gerundet?', 'Es wird in der kleinsten Währungseinheit gerechnet und die Steuer auf die nächste Einheit gerundet, sodass Nettobetrag plus Steuer immer den Gesamtbetrag ergibt.'],
      ['Sagt mir dieser Rechner, welchen Steuersatz ich anwenden muss?', 'Nein. Er wendet den von Ihnen eingegebenen Satz an; welcher Satz für welchen Vorgang gilt, hängt von den Vorschriften Ihres Landes und vom Einzelfall ab.'],
    ],
    modes: ['Steuer hinzufügen', 'Steuer abziehen', 'Mehrere Positionen'],
    fields: [
      { base: 'Nettobetrag (Betrag ohne Steuer)', vat: 'Steuersatz' },
      { total: 'Gesamtbetrag inklusive Steuer', vat: 'Steuersatz' },
      { qty1: 'Menge Position 1', unit1: 'Stückpreis Position 1', disc1: 'Rabatt Position 1', vat1: 'Steuersatz Position 1', qty2: 'Menge Position 2', unit2: 'Stückpreis Position 2', vat2: 'Steuersatz Position 2', qty3: 'Menge Position 3', unit3: 'Stückpreis Position 3', vat3: 'Steuersatz Position 3' },
    ],
  },
};

/** Bezeichnungen der Werte von Feldern mit geschlossener Auswahl. */
export const selectOptions = { included: { no: 'Nein', yes: 'Ja' } };

/** Wendungen im redaktionellen Text, die automatisch mit ihrem Rechner verlinkt werden. */
export const autolinkPhrases = [
  ['Gewinnmargenrechner', 'margen'],
  ['Verkaufspreisrechner', 'precio'],
  ['Brutto- und Nettomargenrechner', 'rentabilidad'],
  ['Nettobetragrechner', 'iva'],
];
