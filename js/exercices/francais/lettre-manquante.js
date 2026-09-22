/**
 * Retrouver la lettre qui manque dans un mot (ch_t → a).
 * Données : data/francais/lettres-manquantes.json
 *   { "trou": "ch_t", "lettre": "a", "pieges": ["o", "i"], "niveau": 1 }
 */
import { choisir, itemsDuNiveau, optionsAvec } from '../outils.js';

export default {
  id: 'lettre-manquante',
  matiere: 'francais',
  titre: 'Lettre manquante',
  donnees: 'lettres-manquantes',

  generer({ niveau, donnees }) {
    const { trou, lettre, pieges } = choisir(itemsDuNiveau(donnees, niveau));
    const mot = trou.replace('_', lettre);

    return {
      consigne: 'Quelle lettre manque ?',
      lecture: `Quelle lettre manque dans ${mot} ?`,
      visuel: { type: 'mot', texte: trou },
      reponse: { mode: 'choix', options: optionsAvec(lettre, pieges, 3), attendu: lettre },
      explication: {
        texte: `On écrit ${mot}.`,
        visuel: { type: 'mot', texte: mot, surligne: lettre, position: trou.indexOf('_') },
      },
      resume: trou,
    };
  },
};
