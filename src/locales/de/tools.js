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
  pages: { contact: 'kontakt', legal: 'impressum', privacy: 'datenschutz', cookies: 'cookie-richtlinie', terms: 'nutzungsbedingungen' },
  categories: { 'margenes-y-precios': 'marge-und-preise', facturacion: 'rechnungen-und-steuer', crecimiento: 'rentabilitaet-und-wachstum' },
  toolPages: {
    margen: 'gewinnmargenrechner',
    precio: 'verkaufspreisrechner',
    rentabilidad: 'brutto-und-nettomargenrechner',
    iva: 'nettobetragrechner',
    recargo: 'aufschlagsrechner',
    descuento: 'rabatt-und-endpreisrechner',
    equilibrio: 'gewinnschwellenrechner',
    roi: 'roi-rechner',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Marge und Preise',
    kicker: 'KATEGORIE',
    short: 'Marge, Aufschlag, Rabatte, Verkaufspreis und Rentabilität',
    description:
      'Rechner, um Preise festzulegen, den Unterschied zwischen Marge und Aufschlag zu verstehen, Rabatte anzusetzen und die Rentabilität Ihres Unternehmens zu analysieren.',
  },
  facturacion: {
    title: 'Rechnungen und Steuer',
    kicker: 'KATEGORIE',
    short: 'Nettobetrag und Aufschlüsselung der Steuer',
    description:
      'Werkzeuge für Nettobetrag und Steuerbetrag Ihrer Rechnungen: Steuer hinzufügen oder herausrechnen und mehrere Positionen aufschlüsseln – mit dem von Ihnen eingegebenen Prozentsatz.',
  },

  crecimiento: {
    title: 'Rentabilität und Wachstum',
    kicker: 'KATEGORIE',
    short: 'Gewinnschwelle und ROI einer Investition',
    description:
      'Rechner, um herauszufinden, wie viele Einheiten Sie verkaufen müssen, um Ihre Fixkosten zu decken, und welche Rendite eine Investition bringt.',
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
  recargo: {
    title: 'Aufschlagsrechner',
    menuTitle: 'Aufschlag auf die Kosten',
    metaTitle: 'Aufschlagsrechner: Verkaufspreis und Marge',
    metaDescription:
      'Berechnen Sie den Verkaufspreis ohne Steuer bei einem Aufschlag auf die Kosten und vergleichen Sie ihn mit der Marge auf den Umsatz. Mit Beispielen. Kostenlos.',
    kicker: 'MARGE UND PREISE',
    desc: 'Schlagen Sie einen Aufschlag auf Ihre Kosten auf und sehen Sie, welcher Marge auf den Umsatz er entspricht – damit Sie die beiden Prozentsätze nicht verwechseln.',
    tileText: 'Kommen Sie mit einem Aufschlag von den Kosten zum Preis und vergleichen Sie ihn mit der Marge.',
    tileCta: 'Aufschlag berechnen',
    search: 'aufschlag auf die kosten verkaufspreis marge gewinn prozent kalkulation zuschlag handelsspanne',
    formulas: [
      ['Bruttogewinn pro Einheit', 'Kosten × Aufschlag'],
      ['Verkaufspreis ohne Steuer', 'Kosten × (1 + Aufschlag)'],
      ['Entsprechende Marge auf den Umsatz', 'Gewinn ÷ Verkaufspreis × 100 = Aufschlag ÷ (1 + Aufschlag)'],
      ['Aufschlag für eine bestimmte Marge', 'Marge ÷ (1 − Marge)'],
    ],
    faq: [
      ['Was ist der Unterschied zwischen Aufschlag und Marge?', 'Der Aufschlag wird auf die Kosten berechnet, die Marge auf den Verkaufspreis. Bei Kosten von 100 und einem Aufschlag von 25 % beträgt der Preis 125, der Gewinn 25 und die Marge 20 %.'],
      ['Wie rechne ich Aufschlag in Marge um und umgekehrt?', 'Marge = Aufschlag ÷ (1 + Aufschlag) und Aufschlag = Marge ÷ (1 − Marge). Ein Aufschlag von 25 % entspricht einer Marge von 20 %; für eine Marge von 25 % brauchen Sie einen Aufschlag von 33,33 %.'],
      ['Warum ergibt ein Aufschlag von 100 % keine Marge von 100 %?', 'Weil eine Verdopplung der Kosten einen Gewinn in Höhe der Kosten lässt, also die Hälfte des Preises: eine Marge von 50 %. Der Aufschlag kann über 100 % liegen; die Marge auf den Umsatz erreicht diesen Wert nie.'],
      ['Enthält der berechnete Preis Steuer?', 'Nein. Es ist der Verkaufspreis vor Steuer. Wenn Sie anschließend Umsatzsteuer aufschlagen müssen, nutzen Sie den Verkaufspreisrechner oder den Nettobetragrechner.'],
      ['Ist der berechnete Gewinn das, was mir bleibt?', 'Nein. Es ist der Bruttogewinn pro Einheit, vor Gemeinkosten, Provisionen und Steuern.'],
    ],
    modes: ['Aufschlag anwenden'],
    fields: [{ cost: 'Kosten des Produkts', markup: 'Aufschlag auf die Kosten' }],
  },
  descuento: {
    title: 'Rabatt- und Endpreisrechner',
    menuTitle: 'Rabatte und Endpreis',
    metaTitle: 'Rabatt- und Endpreisrechner für mehrere Rabatte',
    metaDescription:
      'Berechnen Sie den Endpreis nach einem oder zwei aufeinanderfolgenden Rabatten, die Gesamtersparnis und den effektiven Rabatt. Mit Formeln und Beispielen. Kostenlos.',
    kicker: 'MARGE UND PREISE',
    desc: 'Wenden Sie einen oder zwei aufeinanderfolgende Rabatte an und erhalten Sie Endpreis, Ersparnis und effektiven Rabatt – ohne Prozentsätze versehentlich zu addieren.',
    tileText: 'Berechnen Sie Endpreis, Ersparnis und tatsächlichen Rabatt von ein oder zwei Preisnachlässen.',
    tileCta: 'Rabatt berechnen',
    search: 'rabatt preisnachlass endpreis angebot ersparnis prozent nachlass mehrere rabatte',
    formulas: [
      ['Endpreis', 'Ausgangspreis × (1 − Rabatt 1) × (1 − Rabatt 2)'],
      ['Gesamtersparnis', 'Ausgangspreis − Endpreis'],
      ['Effektiver Rabatt', '100 − (100 − Rabatt 1) × (100 − Rabatt 2) ÷ 100'],
    ],
    faq: [
      ['Warum ergeben zwei Rabatte von 20 % und 10 % nicht 30 %?', 'Weil der zweite auf den bereits gesenkten Preis angewendet wird. Bei 100: 20 % lassen 80, 10 % von 80 sind 8, und der Endpreis beträgt 72. Die Gesamtersparnis ist 28, ein effektiver Rabatt von 28 %.'],
      ['Spielt die Reihenfolge der Rabatte eine Rolle?', 'Nein. Die Multiplikation ist kommutativ: Erst 10 % und dann 20 % ergibt denselben Endpreis. Es ändert sich nur, wie viel jeder Schritt abzieht, nicht die Summe.'],
      ['Wie berechne ich den effektiven Rabatt?', 'Mit 100 − (100 − r1) × (100 − r2) ÷ 100. Bei 20 % und 10 %: 100 − 80 × 90 ÷ 100 = 28 %. Er hängt nur von den Prozentsätzen ab, nicht vom Preis.'],
      ['Kann ich nur einen Rabatt verwenden?', 'Ja. Lassen Sie den zweiten Rabatt leer oder geben Sie 0 ein; der Rechner wendet dann nur den ersten an.'],
      ['Gebe ich den Preis mit oder ohne Steuer ein?', 'Den, den Sie senken möchten: Der Prozentsatz wird auf die eingegebene Zahl angewendet. Das Ergebnis behält dieselbe Grundlage, mit oder ohne Steuer.'],
    ],
    modes: ['Aufeinanderfolgende Rabatte'],
    fields: [{ price: 'Ausgangspreis', first: 'Rabatt', second: 'Zweiter Rabatt (optional)' }],
  },
  equilibrio: {
    title: 'Gewinnschwellenrechner',
    menuTitle: 'Gewinnschwelle',
    metaTitle: 'Gewinnschwellenrechner: Break-even in Stück und Umsatz',
    metaDescription:
      'Berechnen Sie, wie viele Einheiten Sie verkaufen müssen, um die Fixkosten zu decken, den nötigen Umsatz und den Deckungsbeitrag. Mit Beispielen. Kostenlos.',
    kicker: 'RENTABILITÄT UND WACHSTUM',
    desc: 'Finden Sie heraus, wie viele Einheiten Sie verkaufen müssen, um Ihre Fixkosten zu decken und welcher Umsatz das ist – auf Basis des Deckungsbeitrags jeder Einheit.',
    tileText: 'Berechnen Sie, wie viele Einheiten Sie verkaufen müssen, um Geld zu verdienen.',
    tileCta: 'Gewinnschwelle berechnen',
    search: 'gewinnschwelle break-even punkt fixkosten variable kosten deckungsbeitrag stück menge',
    formulas: [
      ['Deckungsbeitrag pro Einheit', 'Verkaufspreis − variable Kosten'],
      ['Einheiten an der Gewinnschwelle', 'Fixkosten ÷ Deckungsbeitrag (aufgerundet)'],
      ['Umsatz an der Gewinnschwelle', 'Aufgerundete Einheiten × Verkaufspreis'],
      ['Ergebnis bei einer bestimmten Menge', 'Einheiten × Deckungsbeitrag − Fixkosten'],
    ],
    faq: [
      ['Was ist die Gewinnschwelle?', 'Es ist die Absatzmenge, bei der die Erlöse den Gesamtkosten entsprechen: weder Gewinn noch Verlust. Ab der nächsten Einheit bringt jeder Verkauf Gewinn.'],
      ['Was ist der Deckungsbeitrag?', 'Er ist das, was von jedem Verkauf übrig bleibt, nachdem die variablen Kosten dieser Einheit bezahlt sind. Bei einem Preis von 50 und variablen Kosten von 30 trägt jede Einheit 20 zur Deckung der Fixkosten bei.'],
      ['Warum wird aufgerundet?', 'Weil man keine Bruchteile einer Einheit verkaufen kann. Ergibt die Rechnung 437,5 Einheiten, bedeutet 437 noch Verlust, und Sie müssen 438 verkaufen.'],
      ['Was passiert, wenn der Preis gleich oder niedriger als die variablen Kosten ist?', 'Dann bringt jede verkaufte Einheit nichts oder verursacht Verlust, sodass keine Menge die Fixkosten deckt. Der Rechner weist darauf hin, statt eine unmögliche Zahl zu zeigen.'],
      ['Was sind Fixkosten und was variable Kosten?', 'Fixkosten ändern sich im Zeitraum nicht mit der verkauften Menge (Miete, Versicherungen, Beiträge, feste Gehälter). Variable Kosten hängen davon ab (Rohstoffe, Versand, Verkaufsprovisionen). Bei gemischten Kosten teilen Sie den fixen und den variablen Anteil auf.'],
    ],
    modes: ['Gewinnschwelle'],
    fields: [{ fixed: 'Fixkosten des Zeitraums', price: 'Verkaufspreis pro Einheit', variable: 'Variable Kosten pro Einheit', units: 'Einheiten, die Sie verkaufen wollen (optional)' }],
  },
  roi: {
    title: 'ROI-Rechner',
    menuTitle: 'ROI einer Investition',
    metaTitle: 'ROI-Rechner: Rendite einer Investition',
    metaDescription:
      'Berechnen Sie Nettogewinn und ROI in Prozent einer Investition aus dem eingesetzten Betrag und dem Gesamtrückfluss. Mit Beispielen und Grenzen. Kostenlos.',
    kicker: 'RENTABILITÄT UND WACHSTUM',
    desc: 'Berechnen Sie Nettogewinn oder -verlust und den ROI in Prozent einer Investition aus dem, was Sie eingesetzt, und dem, was Sie insgesamt zurückerhalten haben.',
    tileText: 'Messen Sie, wie viel Sie im Verhältnis zur Investition gewonnen oder verloren haben.',
    tileCta: 'ROI berechnen',
    search: 'roi kapitalrendite return on investment rentabilität nettogewinn investition prozent rendite',
    formulas: [
      ['Nettogewinn oder -verlust', 'Gesamtrückfluss − Anfangsinvestition'],
      ['ROI', '(Gesamtrückfluss − Anfangsinvestition) ÷ Anfangsinvestition × 100'],
      ['Rückfluss je investierter Einheit', 'Gesamtrückfluss ÷ Anfangsinvestition'],
    ],
    faq: [
      ['Was gebe ich bei „Gesamtrückfluss“ ein?', 'Alles, was Sie zurückerhalten haben, einschließlich der Investition. Haben Sie 1.000 investiert und besitzen jetzt 1.300, beträgt der Gesamtrückfluss 1.300, nicht 300. Der Rechner zieht die Investition für Sie ab.'],
      ['Sind ROI und ROAS dasselbe?', 'Nein. Der ROAS teilt den Umsatz einer Kampagne durch ihre Werbeausgaben; der ROI setzt den Nettogewinn ins Verhältnis zum Einsatz. Bei 500 Werbung, die 2.000 Umsatz bringen, liegt der ROAS bei 4. Kostete die verkaufte Ware 1.200, beträgt der Gewinn 300 und der ROI dieser 500 liegt bei 60 %.'],
      ['Ist der ROI eine Jahresrendite?', 'Nein: Er berücksichtigt die Zeit nicht. 30 % in drei Jahren entsprechen 9,14 % pro Jahr mit Zinseszins, und 30 % in einem Jahr sind etwas ganz anderes. Dieser Rechner rechnet das Ergebnis nicht auf ein Jahr um.'],
      ['Was bedeutet ein negativer ROI?', 'Dass Sie weniger zurückerhalten haben, als Sie investiert haben. Investieren Sie 5.000 und erhalten 4.000 zurück, verlieren Sie 1.000 und der ROI beträgt −20 %. Ein ROI von −100 % heißt, dass Sie nichts zurückerhalten haben.'],
      ['Was passiert, wenn die Anfangsinvestition null ist?', 'Der ROI lässt sich nicht berechnen, weil durch null geteilt werden müsste. Der Rechner verlangt eine Investition größer als null.'],
    ],
    modes: ['Rendite einer Investition'],
    fields: [{ investment: 'Anfangsinvestition', total: 'Gesamtrückfluss (inklusive Investition)' }],
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
  ['Aufschlagsrechner', 'recargo'],
  ['Rabatt- und Endpreisrechner', 'descuento'],
  ['Gewinnschwellenrechner', 'equilibrio'],
  ['ROI-Rechner', 'roi'],
];
