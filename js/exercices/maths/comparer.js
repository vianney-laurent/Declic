/**
 * Comparer deux nombres avec <, > ou =.
 * Niveau 1 : nombres ≤ 20
 * Niveau 2 : nombres ≤ 100
 * Niveau 3 : même dizaine ou chiffres inversés (47 et 43, 36 et 63)
 */
import { choisir, entier, illustrerNombres } from '../outils.js';

const PROBA_EGAL = 0.15;

function paire(niveau) {
  if (Math.random() < PROBA_EGAL) {
    const n = entier(1, niveau === 1 ? 20 : 99);
    return [n, n];
  }
  if (niveau === 1) return distincts(1, 20);
  if (niveau === 2) return distincts(1, 100);

  // Niveau 3 : pièges classiques, même dizaine (47 / 43) ou chiffres inversés (36 / 63).
  const [x, y] = distincts(1, 9);
  const dizaine = entier(1, 9) * 10;
  return choisir([
    [dizaine + x, dizaine + y],
    [x * 10 + y, y * 10 + x],
  ]);
}

function distincts(min, max) {
  const a = entier(min, max);
  let b = entier(min, max);
  while (b === a) b = entier(min, max);
  return [a, b];
}

function signe(a, b) {
  if (a < b) return '<';
  if (a > b) return '>';
  return '=';
}

function phrase(a, b) {
  if (a < b) return `${a} est plus petit que ${b}`;
  if (a > b) return `${a} est plus grand que ${b}`;
  return `${a} est égal à ${b}`;
}

export default {
  id: 'comparer',
  matiere: 'maths',
  titre: 'Comparer deux nombres',

  generer({ niveau }) {
    const [a, b] = paire(niveau);
    const s = signe(a, b);
    return {
      consigne: 'Choisis le bon signe.',
      visuel: { type: 'equation', parties: [a, '?', b] },
      reponse: { mode: 'choix', options: ['<', '=', '>'], attendu: s },
      explication: {
        texte: `${phrase(a, b)} : ${a} ${s} ${b}`,
        visuel: illustrerNombres([a, b], s),
      },
      resume: `${a} ? ${b}`,
    };
  },
};
