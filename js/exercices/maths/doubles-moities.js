/**
 * Doubles et moitiés.
 * Niveau 1 : doubles jusqu'à 10, moitiés jusqu'à 10
 * Niveau 2 : moitiés jusqu'à 20, doubles des dizaines (double de 30)
 * Niveau 3 : doubles de 11 à 25, moitiés jusqu'à 40 et des dizaines jusqu'à 100
 */
import { choisir, entier, illustrerNombres } from '../outils.js';

function double(n) {
  return {
    consigne: `Quel est le double de ${n} ?`,
    reponse: { mode: 'pave', attendu: 2 * n },
    explication: {
      texte: `Le double de ${n}, c'est ${n} + ${n} = ${2 * n}`,
      visuel: illustrerNombres([n, n], '+'),
    },
    resume: `double de ${n}`,
  };
}

function moitie(total) {
  const m = total / 2;
  return {
    consigne: `Quelle est la moitié de ${total} ?`,
    reponse: { mode: 'pave', attendu: m },
    explication: {
      texte: `${total}, c'est ${m} + ${m}. La moitié est ${m}.`,
      visuel: illustrerNombres([m, m], '+'),
    },
    resume: `moitié de ${total}`,
  };
}

const QUESTIONS = {
  1: [() => double(entier(2, 10)), () => moitie(2 * entier(1, 5))],
  2: [() => moitie(2 * entier(3, 10)), () => double(entier(1, 5) * 10)],
  3: [() => double(entier(11, 25)), () => moitie(2 * entier(11, 20)), () => moitie(entier(3, 10) * 10)],
};

export default {
  id: 'doubles-moities',
  matiere: 'maths',
  titre: 'Doubles et moitiés',

  generer({ niveau }) {
    return choisir(QUESTIONS[niveau])();
  },
};
