/**
 * Doubles et moitiés.
 * Niveau 1 : doubles de 1 à 5
 * Niveau 2 : doubles jusqu'à 10, moitiés jusqu'à 10
 * Niveau 3 : doubles jusqu'à 10, moitiés jusqu'à 20
 */
import { choisir, entier } from '../outils.js';

function double(n) {
  return {
    consigne: `Quel est le double de ${n} ?`,
    visuel: { type: 'points', groupes: [n] },
    reponse: { mode: 'pave', attendu: 2 * n },
    explication: {
      texte: `Le double de ${n}, c'est ${n} + ${n} = ${2 * n}`,
      visuel: { type: 'points', groupes: [n, n], separateur: '+' },
    },
    resume: `double de ${n}`,
  };
}

function moitie(total) {
  const m = total / 2;
  return {
    consigne: `Quelle est la moitié de ${total} ?`,
    visuel: { type: 'points', groupes: [total] },
    reponse: { mode: 'pave', attendu: m },
    explication: {
      texte: `${total}, c'est ${m} + ${m}. La moitié est ${m}.`,
      visuel: { type: 'points', groupes: [m, m], separateur: '+' },
    },
    resume: `moitié de ${total}`,
  };
}

export default {
  id: 'doubles-moities',
  matiere: 'maths',
  titre: 'Doubles et moitiés',

  generer({ niveau }) {
    if (niveau === 1) return double(entier(1, 5));
    const maxMoitie = niveau === 2 ? 5 : 10;
    return choisir([
      () => double(entier(2, 10)),
      () => moitie(2 * entier(1, maxMoitie)),
    ])();
  },
};
