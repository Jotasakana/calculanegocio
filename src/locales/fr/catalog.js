// Catalogue en français : catégories qui n’ont encore aucune calculatrice disponible et textes des calculatrices
// EN DÉVELOPPEMENT. Les clés correspondent à src/domain/catalog.js. Les outils fiscaux propres à un pays (retenue sur
// facture, recargo de equivalencia) ne sont pas proposés en français et n’ont donc aucune entrée ici.

export const catalog = {
  categories: {
    finanzas: {
      title: 'Finances de l’entreprise',
      short: 'Prêts, amortissement, stock et trésorerie',
    },
  },
  planned: {
    marketplace: { title: 'Commission de place de marché', desc: 'Calculez le prix minimal pour vendre sur une plateforme sans perdre de marge.', search: 'commission place de marché marketplace plateforme vente en ligne frais' },
    hora: { title: 'Tarif horaire', desc: 'Estimez combien facturer de l’heure selon vos charges et vos heures facturables.', search: 'tarif horaire taux journalier freelance honoraires heures facturables' },
    variacion: { title: 'Variation en pourcentage', desc: 'Comparez deux périodes et mesurez de combien un chiffre a augmenté ou baissé.', search: 'variation pourcentage augmentation baisse évolution croissance' },
    roas: { title: 'Rentabilité des campagnes (ROAS)', desc: 'Voyez le chiffre d’affaires généré pour chaque unité dépensée en publicité (ROAS).', search: 'roas publicité campagne annonces retour' },
    prestamo: { title: 'Mensualité d’un prêt', desc: 'Calculez la mensualité, les intérêts et le total à rembourser.', search: 'prêt mensualité intérêts crédit financement emprunt' },
    amortizacion: { title: 'Amortissement linéaire', desc: 'Répartissez le coût d’un bien sur sa durée d’utilisation.', search: 'amortissement linéaire immobilisation durée d’utilisation dépréciation' },
    stock: { title: 'Rotation des stocks', desc: 'Mesurez combien de fois vous renouvelez votre stock sur une période.', search: 'rotation stock inventaire marchandises' },
    tesoreria: { title: 'Réserve de trésorerie', desc: 'Calculez combien de mois de charges la trésorerie disponible permet de couvrir.', search: 'trésorerie réserve liquidités mois de charges' },
  },
};
