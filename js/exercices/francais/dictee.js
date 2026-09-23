/**
 * Dictée de mots : l'application dit le mot, on choisit la bonne écriture.
 * Données : data/francais/dictee.json
 *   { "mot": "maison", "pieges": ["maizon", "mèson"], "niveau": 2 }
 */
import { choisir, itemsDuNiveau, optionsAvec } from '../outils.js';

export default {
  id: 'dictee',
  matiere: 'francais',
  titre: 'Dictée de mots',
  donnees: 'dictee',

  generer({ niveau, donnees }) {
    const { mot, pieges } = choisir(itemsDuNiveau(donnees, niveau));
    return {
      consigne: 'Écoute et choisis le bon mot.',
      lecture: `Choisis le mot : ${mot}. ${mot}.`,
      visuel: { type: 'ecoute' },
      reponse: { mode: 'choix', options: optionsAvec(mot, pieges, 3), attendu: mot },
      explication: {
        texte: `On écrit : ${mot}`,
        visuel: { type: 'mot', texte: mot },
      },
      resume: mot,
    };
  },
};
