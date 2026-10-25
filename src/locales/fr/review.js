// Statut éditorial du contenu en français.
//
// 'unreviewed' = traduction assistée par IA qui n’a PAS encore été relue par une personne de langue maternelle. Elle est
// publiée et indexée comme le reste du site (voir UNREVIEWED_OK dans src/i18n/publish.js). Aucun relecteur n’est enregistré ici : passez une page à 'reviewed'
// (avec reviewer, date et scope) uniquement lorsqu’une personne l’a réellement relue. N’enregistrez jamais une relecture qui n’a pas eu lieu.
export const review = {
  default: { status: 'unreviewed' },
  pages: {},
};
