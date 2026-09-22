/**
 * « un » ou « une » ?
 * Données : data/francais/un-une.json — deux listes de mots par niveau.
 */
import { choisir, itemsDuNiveau } from '../outils.js';

export default {
  id: 'un-une',
  matiere: 'francais',
  titre: '« un » ou « une »',
  donnees: 'un-une',

  generer({ niveau, donnees }) {
    const groupe = choisir(itemsDuNiveau(donnees, niveau));
    const article = choisir(['un', 'une']);
    const mot = choisir(groupe[article]);

    return {
      consigne: 'Un ou une ?',
      lecture: `Un ou une ? ${mot}.`,
      visuel: { type: 'mot', texte: `_ ${mot}` },
      reponse: { mode: 'choix', options: ['un', 'une'], attendu: article },
      explication: {
        texte: `On dit : ${article} ${mot}.`,
        visuel: { type: 'mot', texte: `${article} ${mot}`, surligne: article, position: 0 },
      },
      resume: mot,
    };
  },
};
