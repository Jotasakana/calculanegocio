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
  pages: { contact: 'contact', legal: 'mentions-legales', privacy: 'politique-de-confidentialite', cookies: 'politique-de-cookies', terms: 'conditions-d-utilisation' },
  categories: { 'margenes-y-precios': 'marges-et-prix', facturacion: 'facturation-et-taxes', crecimiento: 'rentabilite-et-croissance' },
  toolPages: {
    margen: 'calculatrice-marge-commerciale',
    precio: 'calculatrice-prix-de-vente',
    rentabilidad: 'calculatrice-marge-brute-et-nette',
    iva: 'calculatrice-montant-ht',
    recargo: 'calculatrice-majoration-sur-cout',
    descuento: 'calculatrice-remise-et-prix-final',
    equilibrio: 'calculatrice-seuil-de-rentabilite',
    roi: 'calculatrice-roi',
  },
};

export const categories = {
  'margenes-y-precios': {
    title: 'Marges et prix',
    kicker: 'CATÉGORIE',
    short: 'Marge, majoration, remises, prix de vente et rentabilité',
    description:
      'Des calculatrices pour fixer vos prix, comprendre la différence entre taux de marque et taux de marge, appliquer des remises et analyser la rentabilité de votre activité.',
  },
  facturacion: {
    title: 'Facturation et taxes',
    kicker: 'CATÉGORIE',
    short: 'Montant HT et détail de la taxe',
    description:
      'Des outils pour travailler le montant HT et la taxe de vos factures : ajouter ou retirer la taxe et détailler plusieurs lignes, avec le pourcentage que vous saisissez.',
  },

  crecimiento: {
    title: 'Rentabilité et croissance',
    kicker: 'CATÉGORIE',
    short: 'Seuil de rentabilité, ROI et investissement',
    description:
      'Des calculatrices pour savoir combien d’unités vendre afin de couvrir vos charges fixes et quel rendement rapporte un investissement.',
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
  recargo: {
    title: 'Calculatrice de majoration sur coût',
    menuTitle: 'Majoration sur le coût',
    metaTitle: 'Calculatrice de majoration : prix de vente et marge',
    metaDescription:
      'Calculez le prix de vente HT à partir d’une majoration sur le coût et comparez-la au taux de marque sur les ventes. Avec exemples chiffrés. Gratuit.',
    kicker: 'MARGES ET PRIX',
    desc: 'Appliquez une majoration à votre coût et voyez à quel taux de marque sur les ventes elle correspond, pour ne plus confondre les deux pourcentages.',
    tileText: 'Passez du coût au prix avec une majoration et comparez-la au taux de marque.',
    tileCta: 'Calculer la majoration',
    search: 'majoration sur coût prix de vente taux de marge taux de marque coefficient bénéfice pourcentage',
    formulas: [
      ['Bénéfice brut par unité', 'Coût × majoration'],
      ['Prix de vente HT', 'Coût × (1 + majoration)'],
      ['Taux de marque équivalent sur les ventes', 'Bénéfice ÷ prix de vente × 100 = majoration ÷ (1 + majoration)'],
      ['Majoration pour un taux de marque donné', 'Taux de marque ÷ (1 − taux de marque)'],
    ],
    faq: [
      ['Quelle différence entre majoration et taux de marque ?', 'La majoration se calcule sur le coût, le taux de marque sur le prix de vente. Avec un coût de 100 et une majoration de 25 %, le prix est 125, le bénéfice 25 et le taux de marque 20 %.'],
      ['Comment passer de la majoration au taux de marque, et inversement ?', 'Taux de marque = majoration ÷ (1 + majoration) et majoration = taux de marque ÷ (1 − taux de marque). Une majoration de 25 % équivaut à un taux de marque de 20 % ; pour 25 % de taux de marque, il faut 33,33 % de majoration.'],
      ['Pourquoi une majoration de 100 % ne donne-t-elle pas un taux de marque de 100 % ?', 'Parce que doubler le coût laisse un bénéfice égal au coût, soit la moitié du prix : un taux de marque de 50 %. La majoration peut dépasser 100 % ; le taux de marque sur les ventes n’atteint jamais cette valeur.'],
      ['Le prix calculé inclut-il la taxe ?', 'Non. C’est le prix de vente avant taxe. Si vous devez ensuite ajouter la TVA ou une autre taxe, utilisez la calculatrice de prix de vente ou la calculatrice de montant HT.'],
      ['Le bénéfice calculé est-il ce qui me reste ?', 'Non. C’est le bénéfice brut par unité, avant frais généraux, commissions et impôts.'],
    ],
    modes: ['Appliquer une majoration'],
    fields: [{ cost: 'Coût du produit', markup: 'Majoration sur le coût' }],
  },
  descuento: {
    title: 'Calculatrice de remise et prix final',
    menuTitle: 'Remises et prix final',
    metaTitle: 'Calculatrice de remise et prix final (remises cumulées)',
    metaDescription:
      'Calculez le prix final après une ou deux remises successives, l’économie totale et la remise effective. Avec formules et exemples chiffrés. Gratuit.',
    kicker: 'MARGES ET PRIX',
    desc: 'Appliquez une ou deux remises successives et obtenez le prix final, l’économie et la remise effective, sans additionner les pourcentages par erreur.',
    tileText: 'Calculez le prix final, l’économie et la remise réelle d’une ou deux réductions.',
    tileCta: 'Calculer la remise',
    search: 'remise réduction prix final promotion économie pourcentage rabais soldes remises successives',
    formulas: [
      ['Prix final', 'Prix initial × (1 − remise 1) × (1 − remise 2)'],
      ['Économie totale', 'Prix initial − prix final'],
      ['Remise effective', '100 − (100 − remise 1) × (100 − remise 2) ÷ 100'],
    ],
    faq: [
      ['Pourquoi deux remises de 20 % et 10 % ne font-elles pas 30 % ?', 'Parce que la seconde s’applique au prix déjà réduit. Sur 100 : 20 % laissent 80, 10 % de 80 font 8, et le prix final est 72. L’économie totale est 28, soit une remise effective de 28 %.'],
      ['L’ordre des remises change-t-il le résultat ?', 'Non. La multiplication est commutative : 10 % puis 20 % donnent le même prix final. Seul le montant retiré à chaque étape change, pas le total.'],
      ['Comment calculer la remise effective ?', 'Avec 100 − (100 − r1) × (100 − r2) ÷ 100. Pour 20 % et 10 % : 100 − 80 × 90 ÷ 100 = 28 %. Elle ne dépend que des pourcentages, pas du prix.'],
      ['Puis-je n’utiliser qu’une seule remise ?', 'Oui. Laissez la seconde remise vide ou saisissez 0 : la calculatrice n’applique alors que la première.'],
      ['Dois-je saisir le prix avec ou sans taxe ?', 'Celui que vous voulez réduire : le pourcentage s’applique au chiffre saisi. Le résultat garde la même base, avec ou sans taxe.'],
    ],
    modes: ['Remises successives'],
    fields: [{ price: 'Prix initial', first: 'Remise', second: 'Seconde remise (facultatif)' }],
  },
  equilibrio: {
    title: 'Calculatrice de seuil de rentabilité',
    menuTitle: 'Seuil de rentabilité',
    metaTitle: 'Calculatrice de seuil de rentabilité en unités et CA',
    metaDescription:
      'Calculez combien d’unités vendre pour couvrir vos charges fixes, le chiffre d’affaires nécessaire et la marge sur coût variable. Exemples chiffrés. Gratuit.',
    kicker: 'RENTABILITÉ ET CROISSANCE',
    desc: 'Découvrez combien d’unités vous devez vendre pour couvrir vos charges fixes et quel chiffre d’affaires cela représente, à partir de la marge sur coût variable de chaque unité.',
    tileText: 'Calculez combien d’unités vendre pour commencer à gagner de l’argent.',
    tileCta: 'Calculer le seuil',
    search: 'seuil de rentabilité point mort charges fixes coûts variables marge sur coût variable unités chiffre d’affaires',
    formulas: [
      ['Marge sur coût variable par unité', 'Prix de vente − coût variable'],
      ['Unités au seuil de rentabilité', 'Charges fixes ÷ marge sur coût variable (arrondi au supérieur)'],
      ['Chiffre d’affaires au seuil', 'Unités arrondies × prix de vente'],
      ['Résultat pour une quantité donnée', 'Unités × marge sur coût variable − charges fixes'],
    ],
    faq: [
      ['Qu’est-ce que le seuil de rentabilité ?', 'C’est le volume de ventes pour lequel les recettes égalent les coûts totaux : ni bénéfice ni perte. Au-delà, chaque vente rapporte du bénéfice.'],
      ['Qu’est-ce que la marge sur coût variable ?', 'C’est ce qui reste de chaque vente une fois payé le coût variable de l’unité. Avec un prix de 50 et un coût variable de 30, chaque unité contribue 20 à la couverture des charges fixes.'],
      ['Pourquoi arrondir au supérieur ?', 'Parce qu’on ne vend pas une fraction d’unité. Si le calcul donne 437,5 unités, 437 laissent encore une perte : il faut en vendre 438.'],
      ['Que se passe-t-il si le prix est égal ou inférieur au coût variable ?', 'Chaque unité vendue ne rapporte rien ou fait perdre de l’argent : aucun volume ne couvre les charges fixes. La calculatrice vous en avertit au lieu d’afficher un chiffre impossible.'],
      ['Quelles sont les charges fixes et les coûts variables ?', 'Les charges fixes ne varient pas avec la quantité vendue sur la période (loyer, assurances, abonnements, salaires fixes). Les coûts variables en dépendent (matières, expédition, commissions). Pour un coût mixte, séparez sa part fixe et sa part variable.'],
    ],
    modes: ['Seuil de rentabilité'],
    fields: [{ fixed: 'Charges fixes de la période', price: 'Prix de vente par unité', variable: 'Coût variable par unité', units: 'Unités que vous comptez vendre (facultatif)' }],
  },
  roi: {
    title: 'Calculatrice de ROI',
    menuTitle: 'ROI d’un investissement',
    metaTitle: 'Calculatrice de ROI : rendement d’un investissement',
    metaDescription:
      'Calculez le bénéfice net et le ROI en pourcentage d’un investissement à partir du montant investi et du retour total. Exemples et limites. Gratuit.',
    kicker: 'RENTABILITÉ ET CROISSANCE',
    desc: 'Calculez le bénéfice ou la perte nette et le ROI en pourcentage d’un investissement, à partir de ce que vous avez investi et de ce que vous avez récupéré au total.',
    tileText: 'Mesurez combien vous avez gagné ou perdu par rapport à votre investissement.',
    tileCta: 'Calculer le ROI',
    search: 'roi retour sur investissement rentabilité bénéfice net investissement pourcentage rendement',
    formulas: [
      ['Bénéfice ou perte nette', 'Retour total − investissement initial'],
      ['ROI', '(Retour total − investissement initial) ÷ investissement initial × 100'],
      ['Retour par unité investie', 'Retour total ÷ investissement initial'],
    ],
    faq: [
      ['Que saisir dans « retour total » ?', 'Tout ce que vous avez récupéré, investissement compris. Si vous avez investi 1 000 et disposez maintenant de 1 300, le retour total est 1 300, pas 300. La calculatrice soustrait l’investissement pour vous.'],
      ['ROI et ROAS, est-ce la même chose ?', 'Non. Le ROAS divise le chiffre d’affaires d’une campagne par ses dépenses publicitaires ; le ROI rapporte le bénéfice net à la mise. Pour 500 de publicité qui génèrent 2 000 de ventes, le ROAS est de 4. Si la marchandise vendue a coûté 1 200, le bénéfice est de 300 et le ROI de ces 500 est de 60 %.'],
      ['Le ROI est-il un rendement annuel ?', 'Non : il ne tient pas compte du temps. 30 % en trois ans équivalent à 9,14 % par an en capitalisant, et 30 % en un an est tout autre chose. Cette calculatrice ne ramène pas le résultat à l’année.'],
      ['Que signifie un ROI négatif ?', 'Que vous avez récupéré moins que vous n’avez investi. Si vous investissez 5 000 et récupérez 4 000, vous perdez 1 000 et le ROI est de −20 %. Un ROI de −100 % signifie que vous n’avez rien récupéré.'],
      ['Que se passe-t-il si l’investissement initial est nul ?', 'Le ROI ne peut pas être calculé, car il faudrait diviser par zéro. La calculatrice demande un investissement supérieur à zéro.'],
    ],
    modes: ['Rendement d’un investissement'],
    fields: [{ investment: 'Investissement initial', total: 'Retour total (investissement inclus)' }],
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
  ['calculatrice de majoration sur coût', 'recargo'],
  ['calculatrice de remise et prix final', 'descuento'],
  ['calculatrice de seuil de rentabilité', 'equilibrio'],
  ['calculatrice de ROI', 'roi'],
];
