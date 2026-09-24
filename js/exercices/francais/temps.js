/**
 * Passé, présent ou futur ?
 * Données : data/francais/temps.json
 *   { "phrase": "Hier, j'ai joué.", "temps": "passé", "indice": "Hier", "niveau": 1 }
 *   « indice » est le mot qui aide à trouver ; il est surligné dans l'explication.
 * Niveau 1 : un mot du temps aide (hier, demain, aujourd'hui…)
 * Niveau 2 : seul le verbe aide (a mangé, chanterai, jouons)
 * Niveau 3 : formes plus difficiles (dormait, va pleuvoir, est tombée)
 */
import { choisir, itemsDuNiveau } from '../outils.js';

const EXPLICATIONS = {
  passé: "c'est déjà fait : c'est le passé.",
  présent: "c'est maintenant : c'est le présent.",
  futur: "ça va arriver : c'est le futur.",
};

export default {
  id: 'temps',
  matiere: 'francais',
  titre: 'Passé, présent ou futur',
  donnees: 'temps',

  generer({ niveau, donnees }) {
    const { phrase, temps, indice } = choisir(itemsDuNiveau(donnees, niveau));
    return {
      consigne: 'Passé, présent ou futur ?',
      lecture: `${phrase} Passé, présent ou futur ?`,
      visuel: { type: 'phrase', texte: phrase },
      reponse: { mode: 'choix', options: ['passé', 'présent', 'futur'], attendu: temps },
      explication: {
        texte: `« ${indice} » : ${EXPLICATIONS[temps]}`,
        visuel: { type: 'phrase', texte: phrase, surligne: indice },
      },
      resume: phrase,
    };
  },
};
