/**
 * Trouver le verbe dans une phrase : on touche le mot.
 * Données : data/francais/verbes.json
 *   { "phrase": "Le chat dort sur le lit.", "verbe": "dort", "infinitif": "dormir", "niveau": 1 }
 * Niveau 1 : phrases simples au présent
 * Niveau 2 : sujets au pluriel et pronoms (nous chantons)
 * Niveau 3 : phrases plus longues, autres temps (jouait, partirons)
 */
import { choisir, itemsDuNiveau } from '../outils.js';

/** Un mot de la phrase sans sa ponctuation : « lit. » → « lit ». */
export function sansPonctuation(mot) {
  return mot.replace(/[.,!?;:]/g, '');
}

export default {
  id: 'trouver-le-verbe',
  matiere: 'francais',
  titre: 'Trouver le verbe',
  donnees: 'verbes',

  generer({ niveau, donnees }) {
    const { phrase, verbe, infinitif } = choisir(itemsDuNiveau(donnees, niveau));
    const mots = phrase.split(' ');
    const attendu = mots.find((mot) => sansPonctuation(mot) === verbe);
    return {
      consigne: 'Touche le verbe.',
      lecture: `Touche le verbe. ${phrase}`,
      reponse: { mode: 'phrase', options: mots, attendu },
      explication: {
        texte: `Le verbe est « ${verbe} ». C'est le verbe ${infinitif}.`,
        visuel: { type: 'phrase', texte: phrase, surligne: verbe },
      },
      resume: phrase,
    };
  },
};
