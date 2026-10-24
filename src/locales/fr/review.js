// Statut éditorial du contenu en français.
//
// 'unreviewed' = traduction assistée par IA qui n’a PAS encore été relue par une personne de langue maternelle. Elle n’est
// affichée que dans la démo privée non indexable. Aucun relecteur n’est enregistré ici : passez une page à 'reviewed'
// (avec reviewer, date et scope) uniquement lorsqu’une personne l’a réellement relue. N’enregistrez jamais une relecture qui n’a pas eu lieu.
export const review = {
  default: { status: 'unreviewed' },
  pages: {},
};
