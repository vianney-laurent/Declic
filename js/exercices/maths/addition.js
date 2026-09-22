/**
 * Additions.
 * Niveau 1 : résultat ≤ 20 (7 + 5)
 * Niveau 2 : deux nombres ≤ 100, sans retenue (34 + 25)
 * Niveau 3 : avec une retenue simple (27 + 5, 38 + 14)
 */
import { entier, illustrerNombres } from '../outils.js';

function nombres(niveau) {
  if (niveau === 1) {
    const a = entier(2, 12);
    return [a, entier(1, 20 - a)];
  }
  if (niveau === 2) {
    // Unités et dizaines additionnées sans dépasser 9 : pas de retenue.
    const ua = entier(0, 8);
    const ub = entier(0, 9 - ua);
    const da = entier(1, 7);
    const db = entier(0, 8 - da);
    return [da * 10 + ua, db * 10 + ub];
  }
  // Niveau 3 : les unités dépassent 10, une seule retenue.
  const ua = entier(3, 9);
  const ub = entier(10 - ua, 9);
  const da = entier(1, 7);
  const db = entier(0, 8 - da);
  return [da * 10 + ua, db * 10 + ub];
}

export default {
  id: 'addition',
  matiere: 'maths',
  titre: 'Additions',

  generer({ niveau }) {
    const [a, b] = nombres(niveau);
    const somme = a + b;
    return {
      consigne: 'Calcule.',
      lecture: `Combien font ${a} + ${b} ?`,
      visuel: { type: 'equation', parties: [a, '+', b, '=', '?'] },
      reponse: { mode: 'pave', attendu: somme },
      explication: {
        texte: `${a} + ${b} = ${somme}`,
        visuel: illustrerNombres([a, b], '+'),
      },
      resume: `${a} + ${b}`,
    };
  },
};
