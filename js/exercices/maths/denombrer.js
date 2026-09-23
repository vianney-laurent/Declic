/**
 * Dénombrer une collection de cubes rangés par dizaines.
 * Niveau 1 : jusqu'à 20
 * Niveau 2 : jusqu'à 50
 * Niveau 3 : jusqu'à 99
 */
import { entier, nombresProches, optionsAvec } from '../outils.js';

const MAX = { 1: 20, 2: 50, 3: 99 };

export default {
  id: 'denombrer',
  matiere: 'maths',
  titre: 'Dénombrer une collection',

  generer({ niveau }) {
    const n = entier(niveau === 1 ? 6 : 15, MAX[niveau]);
    const dizaines = Math.floor(n / 10);
    const unites = n % 10;
    return {
      consigne: 'Combien de cubes ?',
      visuel: { type: 'cubes', groupes: [n] },
      reponse: { mode: 'choix', options: optionsAvec(n, nombresProches(n), 4), attendu: n },
      explication: {
        texte: `${dizaines} dizaine${dizaines > 1 ? 's' : ''} et ${unites} unité${unites > 1 ? 's' : ''} : ${n}`,
        visuel: { type: 'cubes', groupes: [n] },
      },
      resume: `${n} cubes`,
    };
  },
};
