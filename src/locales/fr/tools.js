// Textes français des calculatrices et des catégories (sans logique). Les clés correspondent à src/domain/registry.js.
// Les libellés des champs n’incluent pas l’unité : la couche de présentation l’ajoute selon le type de champ et la devise
// choisie (« Coût d’achat » + € -> « Coût d’achat (€) »).
//
// Les outils d’identifiant « precio » et « iva » sont en français des calculatrices de taxe GÉNÉRIQUES : la personne saisit
// le pourcentage de taxe (TVA ou autre) et aucun taux ni aucune règle d’un pays n’est supposé. `defaults` remplace les
// valeurs initiales du registre pour cette langue ; les taux ne sont que des illustrations modifiables.

export const slugs = {
  tools: 'calculatrices',
  methodology: 'methodologie',
  categories: { 'margenes-y-precios': 'marges-et-prix', facturacion: 'facturation-et-taxes' },
  toolPages: {
    margen: 'calculatrice-marge-commerciale',
    precio: 'calculatrice-prix-de-vente',
    rentabilidad: 'calculatrice-marge-brute-et-nette',
    iva: 'calculatrice-montant-ht',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Marges et prix',
    kicker: 'CATÉGORIE',
    short: 'Marge, taux de marge, prix de vente et rentabilité',
    description:
      'Des calculatrices pour fixer vos prix, comprendre la différence entre taux de marque et taux de marge, et analyser la rentabilité de votre activité.',
  },
  facturacion: {
    title: 'Facturation et taxes',
    kicker: 'CATÉGORIE',
    short: 'Montant HT et détail de la taxe',
    description:
      'Des outils pour travailler le montant HT et la taxe de vos factures : ajouter ou retirer la taxe et détailler plusieurs lignes, avec le pourcentage que vous saisissez.',
  },
};

export const tools = {
  margen: {
    title: 'Calculatrice de marge commerciale',
    menuTitle: 'Marge commerciale',
    metaTitle: 'Calculatrice de marge commerciale et taux de marge',
    metaDescription:
      'Calculez la marge sur ventes (taux de marque), le taux de marge sur coût et le bénéfice par unité. Formules, exemples détaillés, erreurs courantes. Gratuit.',
    kicker: 'MARGES ET PRIX',
    desc: 'Calculez ce que vous gagnez par vente, la marge sur le prix et le taux de marge sur votre coût, sans y mêler la taxe.',
    tileText: 'Découvrez ce que vous gagnez par produit et la différence entre taux de marque et taux de marge.',
    tileCta: 'Calculer la marge',
    search: 'marge commerciale taux de marque taux de marge coefficient bénéfice pourcentage',
    formulas: [
      ['Bénéfice', 'Prix de vente − coût'],
      ['Marge sur ventes (taux de marque)', 'Bénéfice ÷ prix de vente × 100'],
      ['Taux de marge sur coût', 'Bénéfice ÷ coût × 100'],
    ],
    faq: [
      ['Quelle différence entre taux de marque et taux de marge ?', 'Le taux de marque (marge sur ventes) se calcule sur le prix de vente, le taux de marge sur le coût. Avec un coût de 60 et un prix de 100, le bénéfice est de 40 : un taux de marque de 40 % et un taux de marge de 66,67 %.'],
      ['La marge inclut-elle la taxe ?', 'Non. Saisissez les montants hors taxe, car la taxe sur les ventes n’est ni un coût ni un bénéfice pour votre activité.'],
      ['Que signifie une marge négative ?', 'Que vous vendez en dessous du coût : le bénéfice par unité est négatif et la calculatrice vous en avertit.'],
      ['Puis-je calculer le prix à partir d’une marge ?', 'Oui. Utilisez l’onglet « Je veux une marge » avec le coût et la marge visée. Si vous avez déjà le prix et cherchez le coût maximal à ne pas dépasser, utilisez « Coût maximal ».'],
    ],
    modes: ['J’ai le coût et le prix', 'Je veux une marge', 'Coût maximal'],
    fields: [
      { cost: 'Coût d’achat', price: 'Prix hors taxe', quantity: 'Quantité' },
      { cost: 'Coût unitaire', margin: 'Marge visée', quantity: 'Quantité' },
      { price: 'Prix hors taxe', margin: 'Marge visée', quantity: 'Quantité' },
    ],
  },
  precio: {
    title: 'Calculatrice de prix de vente avec taxe',
    menuTitle: 'Prix de vente avec taxe',
    metaTitle: 'Calculatrice de prix de vente avec taxe et commission',
    metaDescription:
      'Calculez un prix de vente à partir du coût, de la marge ou du taux de marge, de la commission, de la remise et d’un pourcentage de taxe de votre choix. Gratuit.',
    kicker: 'PRIX ET MARGES',
    desc: 'Fixez le prix de vente avec une marge ou un taux de marge et mesurez l’effet des commissions, des remises et d’un taux de taxe que vous saisissez.',
    tileText: 'Calculez un prix à partir de vos coûts, de la marge, des remises et de la taxe.',
    tileCta: 'Calculer le prix',
    search: 'prix de vente prix public remise coût commission frais taxe tva ht ttc',
    defaults: { vat: 10 },
    formulas: [
      ['Coût de revient total', 'Coût unitaire + coûts supplémentaires'],
      ['Prix hors taxe (marge visée)', 'Coût de revient total ÷ (1 − commission − marge)'],
      ['Prix hors taxe (taux de marge)', 'Coût de revient total × (1 + taux de marge)'],
      ['Prix taxe comprise', 'Prix hors taxe × (1 + taux de taxe)'],
    ],
    faq: [
      ['La marge se calcule-t-elle sur le coût ou sur le prix ?', 'Avec « Marge visée », elle se calcule sur le prix de vente hors taxe. Si vous préférez un pourcentage sur le coût, utilisez « Taux de marge sur le coût ».'],
      ['Que mettre dans « Coûts supplémentaires » ?', 'Tout coût que vous payez pour chaque unité vendue et qui n’est pas déjà dans le coût unitaire : expédition, emballage, personnalisation…'],
      ['Pourquoi le prix grimpe-t-il autant quand j’ajoute une commission ?', 'Parce que la commission est prélevée sur le prix de vente, pas sur le coût. La marge et la commission se retranchent ensemble des 100 % du prix : leur somme doit donc rester inférieure à 100 %.'],
      ['Puis-je analyser un prix que j’ai déjà ?', 'Oui, avec « Analyser un prix » : indiquez le prix, s’il inclut la taxe, le coût et la commission, et la calculatrice affiche la marge réelle qu’il laisse.'],
      ['Quel taux de taxe utiliser ?', 'La calculatrice applique le pourcentage que vous saisissez et ne connaît les règles d’aucun pays. La valeur initiale n’est qu’une illustration modifiable ; vérifiez le bon taux auprès de sources officielles ou de votre conseiller.'],
    ],
    modes: ['Marge visée', 'Taux de marge sur le coût', 'Analyser un prix'],
    fields: [
      { cost: 'Coût unitaire', extra: 'Coûts supplémentaires', margin: 'Marge visée', commission: 'Commission', discount: 'Remise prévue', vat: 'Taux de taxe' },
      { cost: 'Coût unitaire', extra: 'Coûts supplémentaires', markup: 'Taux de marge', commission: 'Commission', discount: 'Remise prévue', vat: 'Taux de taxe' },
      { cost: 'Coût unitaire', extra: 'Coûts supplémentaires', given: 'Prix de vente saisi', commission: 'Commission', vat: 'Taux de taxe', included: 'Le prix saisi inclut la taxe' },
    ],
  },
  rentabilidad: {
    title: 'Calculatrice de marge brute et nette',
    menuTitle: 'Marge brute et nette',
    metaTitle: 'Calculatrice de marge brute et de marge nette',
    metaDescription:
      'Calculez votre marge brute, d’exploitation et nette à partir des ventes, coûts et charges d’une même période. Exemples détaillés. Gratuit, sans inscription.',
    kicker: 'RENTABILITÉ DE L’ACTIVITÉ',
    desc: 'Détaillez vos ventes, coûts et charges d’une même période pour connaître la marge brute, d’exploitation et nette.',
    tileText: 'Analysez chiffre d’affaires, coûts, charges et rentabilité de votre activité.',
    tileCta: 'Voir la rentabilité',
    search: 'marge brute marge nette charges bénéfice rentabilité résultat',
    formulas: [
      ['Chiffre d’affaires net', 'Ventes − retours et remises'],
      ['Marge brute', '(Chiffre d’affaires net − coût des ventes) ÷ chiffre d’affaires net × 100'],
      ['Résultat d’exploitation', 'Chiffre d’affaires net − coût des ventes − charges d’exploitation'],
      ['Bénéfice net', 'Résultat d’exploitation − charges financières − impôt sur les bénéfices'],
    ],
    faq: [
      ['Qu’est-ce que le chiffre d’affaires net ?', 'Les ventes de la période moins les retours et les remises. C’est la base de tous les pourcentages.'],
      ['Marge brute et marge commerciale, est-ce la même chose ?', 'Non. La marge commerciale se calcule par produit avec son prix et son coût ; la marge brute concerne toute l’activité sur une période, rapportée au chiffre d’affaires net.'],
      ['Que mettre dans les charges d’exploitation ?', 'Les frais de fonctionnement de la période qui ne sont pas du coût des ventes : loyer, énergie, personnel, publicité… Utilisez toujours des montants d’une même période.'],
      ['Le résultat peut-il être négatif ?', 'Oui. Si les coûts et les charges dépassent les ventes, le résultat est une perte et la calculatrice l’affiche avec un signe moins.'],
    ],
    modes: ['Résultat de la période'],
    fields: [
      { sales: 'Ventes de la période', returns: 'Retours et remises', cogs: 'Coût des ventes', operating: 'Charges d’exploitation', finance: 'Charges financières', tax: 'Impôt sur les bénéfices' },
    ],
  },
  iva: {
    title: 'Calculatrice de montant HT',
    menuTitle: 'Montant HT et taxe',
    metaTitle: 'Calculatrice de montant HT : ajouter et retirer la taxe',
    metaDescription:
      'Retrouvez le montant HT à partir d’un total taxe comprise, ajoutez la taxe à une base ou détaillez une facture à plusieurs lignes avec les taux saisis. Gratuit.',
    kicker: 'FACTURATION',
    desc: 'Obtenez la taxe et le total à partir du montant HT, ou retrouvez le montant HT lorsqu’un montant inclut déjà la taxe. Vous saisissez le pourcentage.',
    tileText: 'Ajoutez ou retirez la taxe et vérifiez le détail des montants.',
    tileCta: 'Calculer la taxe',
    search: 'montant ht ttc base taxe ajouter retirer tva facture détail hors taxe',
    defaults: { vat: 10, vat1: 10, vat2: 10, vat3: 5 },
    formulas: [
      ['Taxe', 'Montant HT × taux de taxe'],
      ['Total', 'Montant HT + taxe'],
      ['Montant HT à partir du total', 'Total ÷ (1 + taux de taxe)'],
    ],
    faq: [
      ['Qu’est-ce que le montant HT ?', 'C’est le montant de l’opération avant application de la taxe, une fois déduites les remises qui réduisent le prix.'],
      ['Comment retirer la taxe d’un montant ?', 'Divisez le total par 1 plus le taux de taxe écrit en fraction : avec 10 %, divisez par 1,10. L’onglet « Retirer la taxe » le fait pour vous.'],
      ['Comment se font les arrondis ?', 'Les calculs sont faits dans la plus petite unité de la devise et la taxe est arrondie à l’unité la plus proche, de sorte que montant HT plus taxe donnent toujours le total.'],
      ['Cette calculatrice m’indique-t-elle quel taux de taxe appliquer ?', 'Non. Elle applique le taux que vous saisissez ; le taux qui s’applique à chaque opération dépend des règles de votre pays et de chaque cas.'],
    ],
    modes: ['Ajouter la taxe', 'Retirer la taxe', 'Plusieurs lignes'],
    fields: [
      { base: 'Montant HT (avant taxe)', vat: 'Taux de taxe' },
      { total: 'Total taxe comprise', vat: 'Taux de taxe' },
      { qty1: 'Quantité de la ligne 1', unit1: 'Prix unitaire de la ligne 1', disc1: 'Remise de la ligne 1', vat1: 'Taux de taxe de la ligne 1', qty2: 'Quantité de la ligne 2', unit2: 'Prix unitaire de la ligne 2', vat2: 'Taux de taxe de la ligne 2', qty3: 'Quantité de la ligne 3', unit3: 'Prix unitaire de la ligne 3', vat3: 'Taux de taxe de la ligne 3' },
    ],
  },
};

/** Libellés des valeurs des champs à liste fermée. */
export const selectOptions = { included: { no: 'Non', yes: 'Oui' } };

/** Expressions du texte éditorial qui sont liées automatiquement à leur calculatrice. */
export const autolinkPhrases = [
  ['calculatrice de marge commerciale', 'margen'],
  ['calculatrice de prix de vente', 'precio'],
  ['calculatrice de marge brute et nette', 'rentabilidad'],
  ['calculatrice de montant HT', 'iva'],
];
