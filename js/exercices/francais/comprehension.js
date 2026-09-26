/**
 * Comprendre un petit texte : on lit 1 à 3 phrases, puis on répond à une question.
 * Données : data/francais/comprehension.json
 *   { "texte": "…", "question": "…", "reponse": "…", "pieges": ["…"], "indice": "…", "niveau": 1 }
 *   « indice » est le passage du texte qui donne la réponse ; il est surligné dans l'explication.
 * Niveau 1 : texte lu à voix haute, réponse écrite dans le texte
 * Niveau 2 : l'enfant lit le texte seul (seule la question est lue)
 * Niveau 3 : textes plus longs, questions « pourquoi », « qui »
 */
import { choisir, itemsDuNiveau, melanger, optionsAvec } from '../outils.js';

export default {
  id: 'comprehension',
  matiere: 'francais',
  titre: 'Comprendre un texte',
  donnees: 'comprehension',

  generer({ niveau, donnees }) {
    const { texte, question, reponse, pieges, indice } = choisir(itemsDuNiveau(donnees, niveau));
    const vraiOuFaux = pieges.length === 1 && ['vrai', 'faux'].includes(reponse);
    const options = vraiOuFaux ? ['vrai', 'faux'] : optionsAvec(reponse, pieges, 3);
    return {
      consigne: question,
      // Au niveau 1, on lit aussi le texte : il découvre l'exercice en l'écoutant.
      lecture: niveau === 1 ? `${texte} ${question}` : question,
      visuel: { type: 'phrase', texte },
      reponse: { mode: 'choix', options: vraiOuFaux ? options : melanger(options), attendu: reponse },
      explication: {
        texte: `Le texte dit : « ${indice} »`,
        visuel: { type: 'phrase', texte, surligne: indice },
      },
      resume: question,
    };
  },
};
