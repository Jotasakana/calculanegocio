// Messages de résultat et d’erreur en français. Chaque clé doit exister dans TOUTES les langues (vérifié par
// scripts/check-i18n.mjs). Les valeurs acceptent des {marqueurs} et, pour les pluriels, un objet { one, other, ... }.
// Les identifiants internes « iva » et « precio » sont conservés pour les deux calculatrices liées à la taxe, mais en
// français elles sont GÉNÉRIQUES : la personne saisit le pourcentage de taxe et aucune règle nationale n’est supposée.

export const errors = {
  'invalid-number': 'Saisissez un nombre valide dans chaque champ.',
  negative: 'Les montants et les pourcentages ne peuvent pas être négatifs.',
  'percent-over-100': 'Vérifiez les pourcentages : ils ne peuvent pas dépasser 100 %.',
  'quantity-positive': 'La quantité doit être supérieure à zéro.',
  'quantities-positive': 'Les quantités doivent être positives.',
  'margin-under-100': 'Le taux de marque doit être inférieur à 100 %.',
  'margin-plus-commission': 'Le taux de marque et la commission totalisent 100 % ou plus : ce prix est impossible.',
  'discount-under-100': 'La remise doit être inférieure à 100 %.',
  'returns-over-sales': 'Les retours ne peuvent pas dépasser les ventes.',
};

export const messages = {
  'common.notComputable': 'Calcul impossible',
  'common.checkData': 'Vérifiez vos chiffres.',
  'common.assumption.noVat': 'Tous les montants commerciaux sont calculés hors taxe.',

  'margen.label.margin': 'Marge sur ventes (taux de marque)',
  'margen.label.price': 'Prix de vente hors taxe',
  'margen.label.cost': 'Coût maximal recommandé',
  'margen.note': 'Le taux de marque (marge sur ventes) et le taux de marge sur le coût sont des pourcentages différents.',
  'margen.note.below': 'Attention : le prix de vente est inférieur au coût.',
  'margen.line.benefit': 'Bénéfice par unité',
  'margen.line.margin': 'Marge sur ventes (taux de marque)',
  'margen.line.markup': 'Taux de marge sur le coût',
  'margen.bar.cost': 'Coût',
  'margen.bar.profit': 'Bénéfice',
  'margen.line.total': { one: 'Bénéfice total ({units} unité)', other: 'Bénéfice total ({units} unités)' },

  'precio.label': 'Prix de vente taxe comprise',
  'precio.note': 'Prix hors taxe : {price}',
  'precio.line.totalCost': 'Coût de revient total',
  'precio.line.fee': 'Commission',
  'precio.line.profit': 'Bénéfice par unité',
  'precio.line.margin': 'Taux de marque réel',
  'precio.line.markup': 'Taux de marge réel',
  'precio.line.vat': 'Taxe',
  'precio.line.listNet': 'Prix catalogue avant remise (hors taxe)',
  'precio.line.listGross': 'Prix catalogue avant remise (taxe comprise)',
  'precio.bar.cost': 'Coût',
  'precio.bar.fee': 'Commission',
  'precio.bar.profit': 'Bénéfice',
  'precio.bar.vat': 'Taxe',
  'precio.assumption': 'La commission est calculée sur le prix hors taxe. La taxe est indiquée à part et ne fait pas partie du bénéfice. Le taux de taxe est le pourcentage que vous saisissez ; cet outil ne connaît les règles d’aucun pays.',

  'rentabilidad.label': 'Résultat net de la période',
  'rentabilidad.note': 'Marge nette : {rate}',
  'rentabilidad.line.revenue': 'Chiffre d’affaires net',
  'rentabilidad.line.gross': 'Marge brute',
  'rentabilidad.line.operating': 'Résultat d’exploitation',
  'rentabilidad.line.pretax': 'Avant impôt',
  'rentabilidad.line.net': 'Marge nette',
  'rentabilidad.bar.cogs': 'Coût des ventes',
  'rentabilidad.bar.operating': 'Charges d’exploitation',
  'rentabilidad.bar.other': 'Charges financières et impôt',
  'rentabilidad.bar.net': 'Résultat net',
  'rentabilidad.assumption': 'L’impôt indiqué est un montant saisi manuellement ; nous n’estimons pas l’impôt dû. Sans impôt, le résultat final est avant impôt.',

  'iva.label': 'Total taxe comprise',
  'iva.note': 'Montant de la taxe : {vat}',
  'iva.line.base': 'Montant HT (base de la taxe)',
  'iva.line.vat': 'Taxe',
  'iva.line.groupBase': 'Base à {rate} %',
  'iva.line.groupVat': 'Taxe à {rate} %',
  'iva.bar.base': 'Montant HT',
  'iva.bar.vat': 'Taxe',
  'iva.assumption': 'Calcul indicatif avec le pourcentage que vous saisissez. Les montants sont arrondis à la plus petite unité de la devise et le total est la somme de la base et de la taxe. Avec plusieurs lignes, la taxe est obtenue en regroupant la base de chaque taux. Vérifiez le taux et la méthode de calcul qui s’appliquent à votre cas avant d’émettre des factures.',
};
