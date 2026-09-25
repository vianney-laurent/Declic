/**
 * Homophones : et / est, a / à, son / sont, on / ont.
 * Données : data/francais/homophones.json
 *   { "phrase": "Le ciel _ bleu.", "reponse": "est", "choix": ["et", "est"], "niveau": 1 }
 * Niveau 1 : et / est
 * Niveau 2 : a / à
 * Niveau 3 : son / sont, on / ont
 */
import { choisir, itemsDuNiveau } from '../outils.js';

/** L'astuce de la classe pour chaque mot : on essaie de le remplacer. */
const ASTUCES = {
  est: 'on peut dire « était »',
  et: 'on peut dire « et puis »',
  a: 'on peut dire « avait »',
  à: 'on ne peut pas dire « avait »',
  sont: 'on peut dire « étaient »',
  son: 'on peut dire « mon »',
  ont: 'on peut dire « avaient »',
  on: 'on peut dire « il »',
};

export default {
  id: 'homophones',
  matiere: 'francais',
  titre: 'et / est, a / à, son / sont…',
  donnees: 'homophones',

  generer({ niveau, donnees }) {
    const { phrase, reponse, choix } = choisir(itemsDuNiveau(donnees, niveau));
    const complete = phrase.replace('_', reponse);
    return {
      consigne: `${choix[0]} ou ${choix[1]} ?`,
      // « et ou est » se prononcent pareil : on lit la phrase, pas les deux mots.
      lecture: `${complete} Choisis le bon mot.`,
      visuel: { type: 'phrase', texte: phrase },
      reponse: { mode: 'choix', options: choix, attendu: reponse },
      explication: {
        texte: `On écrit « ${reponse} » : ${ASTUCES[reponse]}.`,
        visuel: { type: 'phrase', texte: complete, surligne: reponse, position: phrase.indexOf('_') },
      },
      resume: phrase,
    };
  },
};
