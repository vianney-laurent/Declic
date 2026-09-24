/**
 * Suites logiques : trouver le nombre qui manque.
 * Niveau 1 : on avance de 2, 5 ou 10, le trou est à la fin
 * Niveau 2 : on avance de 3 ou 10, on recule de 1 ou 2, le trou peut être au milieu
 * Niveau 3 : on avance de 4 ou 5, on recule de 5 ou 10, le trou peut être au milieu
 */
import { choisir, entier } from '../outils.js';

const PAS = {
  1: [2, 5, 10],
  2: [3, 10, -1, -2],
  3: [4, 5, -5, -10],
};
const LONGUEUR = 4;

export default {
  id: 'suite-logique',
  matiere: 'maths',
  titre: 'Suites logiques',

  generer({ niveau }) {
    const pas = choisir(PAS[niveau]);
    const etendue = Math.abs(pas) * (LONGUEUR - 1);
    const max = 99;
    // Premier terme choisi pour que toute la suite reste entre 0 et max.
    const debut = pas > 0 ? entier(0, max - etendue) : entier(etendue, max);
    const termes = Array.from({ length: LONGUEUR }, (_, i) => debut + i * pas);

    const trou = niveau === 1 ? LONGUEUR - 1 : entier(1, LONGUEUR - 1);
    const attendu = termes[trou];
    const affiches = termes.map((t, i) => (i === trou ? '?' : t));
    const regle = pas > 0 ? `On ajoute ${pas} à chaque fois.` : `On enlève ${-pas} à chaque fois.`;

    return {
      consigne: 'Quel nombre manque ?',
      visuel: { type: 'suite', termes: affiches },
      reponse: { mode: 'pave', attendu },
      explication: {
        texte: regle,
        visuel: { type: 'suite', termes, sauts: pas > 0 ? `+${pas}` : `−${-pas}`, surligne: trou },
      },
      resume: affiches.join(', '),
    };
  },
};
