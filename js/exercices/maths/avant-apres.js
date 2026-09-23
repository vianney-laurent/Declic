/**
 * Nombre juste avant / juste après.
 * Niveau 1 : jusqu'à 20
 * Niveau 2 : jusqu'à 100
 * Niveau 3 : passages de dizaine (39 → 40, 60 ← 59)
 */
import { choisir, entier } from '../outils.js';

function nombre(niveau, sens) {
  if (niveau === 1) return entier(1, 19);
  if (niveau === 2) return entier(1, 98);
  // Niveau 3 : on se place juste avant (…9) ou juste sur (…0) une dizaine.
  return sens === 'apres' ? entier(1, 9) * 10 + 9 : entier(1, 9) * 10;
}

export default {
  id: 'avant-apres',
  matiere: 'maths',
  titre: 'Nombre avant, nombre après',

  generer({ niveau }) {
    const sens = choisir(['avant', 'apres']);
    const n = nombre(niveau, sens);
    const attendu = sens === 'apres' ? n + 1 : n - 1;
    const mot = sens === 'apres' ? 'après' : 'avant';

    return {
      consigne: `Quel nombre vient juste ${mot} ?`,
      lecture: `Quel nombre vient juste ${mot} ${n} ?`,
      visuel: {
        type: 'equation',
        parties: sens === 'apres' ? [n, '→', '?'] : ['?', '←', n],
      },
      reponse: { mode: 'pave', attendu },
      explication: {
        texte: `Juste ${mot} ${n}, il y a ${attendu}.`,
        visuel: {
          type: 'droite',
          debut: Math.max(0, n - 3),
          fin: Math.max(0, n - 3) + 6,
          etiquettes: [n, attendu],
          surligne: attendu,
        },
      },
      resume: `${mot} ${n}`,
    };
  },
};
