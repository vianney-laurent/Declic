/**
 * Soustractions sans retenue.
 * Niveau 1 : nombres ≤ 10 (8 − 3)
 * Niveau 2 : nombres ≤ 20 (17 − 5)
 * Niveau 3 : nombres ≤ 100 (47 − 23)
 */
import { entier } from '../outils.js';

function nombres(niveau) {
  if (niveau === 1) {
    const a = entier(3, 10);
    return [a, entier(1, a - 1)];
  }
  if (niveau === 2) {
    const u = entier(2, 9);
    return [10 + u, entier(1, u)];
  }
  // Niveau 3 : chaque chiffre du second est plus petit : pas d'emprunt.
  const da = entier(3, 9);
  const ua = entier(1, 9);
  return [da * 10 + ua, entier(1, da - 1) * 10 + entier(0, ua)];
}

export default {
  id: 'soustraction',
  matiere: 'maths',
  titre: 'Soustractions',

  generer({ niveau }) {
    const [a, b] = nombres(niveau);
    const difference = a - b;
    // Jusqu'à 20 on barre des points ; au-delà on montre les cubes du résultat.
    const visuel =
      a <= 20
        ? { type: 'points', groupes: [{ n: difference }, { n: b, style: 'barre' }], continu: true }
        : { type: 'cubes', groupes: [difference] };
    return {
      consigne: 'Calcule.',
      lecture: `Combien font ${a} − ${b} ?`,
      visuel: { type: 'equation', parties: [a, '−', b, '=', '?'] },
      reponse: { mode: 'pave', attendu: difference },
      explication: { texte: `${a} − ${b} = ${difference}`, visuel },
      resume: `${a} − ${b}`,
    };
  },
};
