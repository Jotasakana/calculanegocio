// Editorial status of the English content.
//
// 'unreviewed' = AI-assisted translation that has NOT yet been reviewed by a native speaker. It is published and indexed
// like the rest of the site (see UNREVIEWED_OK in src/i18n/publish.js). No reviewer is recorded here: change a page to 'reviewed' (with reviewer, date and scope)
// only when a person has actually reviewed it. Never record a review that did not happen.
export const review = {
  default: { status: 'unreviewed' },
  pages: {},
};
