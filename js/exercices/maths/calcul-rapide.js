/**
 * Calcul rapide : les automatismes à connaître par cœur.
 * Revient deux fois plus souvent que les autres types (poids 2),
 * pour alterner calculs simples et calculs plus longs.
 * Niveau 1 : additions ≤ 10, compléments à 10, +1 / −1
 * Niveau 2 : additions jusqu'à 20 (7 + 8), soustractions ≤ 10, + 10
 * Niveau 3 : soustractions jusqu'à 20 (15 − 8), − 10, tables de 2 et 10
 */
import { choisir, entier, illustrerCalcul } from '../outils.js';

const FAITS = {
  1: [
    () => { const a = entier(1, 9); return [a, '+', entier(1, 10 - a)]; },
    () => { const a = entier(1, 9); return [a, '+', 10 - a]; },
    () => [entier(2, 30), choisir(['+', '−']), 1],
  ],
  2: [
    () => [entier(5, 9), '+', entier(5, 9)],
    () => { const a = entier(3, 10); return [a, '−', entier(1, a - 1)]; },
    () => [entier(1, 89), '+', 10],
  ],
  3: [
    () => { const b = entier(3, 9); return [entier(11, 9 + b), '−', b]; },
    () => [entier(11, 99), '−', 10],
    () => [entier(1, 10), '×', choisir([2, 10])],
  ],
};

function calculer(a, operateur, b) {
  if (operateur === '+') return a + b;
  if (operateur === '−') return a - b;
  return a * b;
}

function visuelExplication(a, operateur, b) {
  if (operateur === '×') return b === 2 ? { type: 'paquets', paquets: a, taille: 2 } : { type: 'cubes', groupes: [a * 10] };
  return illustrerCalcul(a, operateur, b);
}

export default {
  id: 'calcul-rapide',
  matiere: 'maths',
  titre: 'Calcul rapide',
  poids: 2,

  generer({ niveau }) {
    const [a, operateur, b] = choisir(FAITS[niveau])();
    const resultat = calculer(a, operateur, b);
    return {
      consigne: 'Vite, calcule !',
      lecture: `${a} ${operateur} ${b} ?`,
      visuel: { type: 'equation', parties: [a, operateur, b, '=', '?'] },
      reponse: { mode: 'pave', attendu: resultat },
      explication: { texte: `${a} ${operateur} ${b} = ${resultat}`, visuel: visuelExplication(a, operateur, b) },
      resume: `${a} ${operateur} ${b}`,
    };
  },
};
