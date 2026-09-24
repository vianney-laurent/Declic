/**
 * Dénombrer une collection de cubes rangés par dizaines.
 * Niveau 1 : jusqu'à 50
 * Niveau 2 : jusqu'à 99
 * Niveau 3 : plus de 10 cubes isolés, à regrouper en une dizaine (4 barres + 13 cubes = 53)
 */
import { entier, nombresProches, optionsAvec } from '../outils.js';

function collection(niveau) {
  if (niveau === 1) return { dizaines: entier(1, 4), unites: entier(0, 9) };
  if (niveau === 2) return { dizaines: entier(3, 9), unites: entier(0, 9) };
  return { dizaines: entier(1, 8), unites: entier(11, 19) };
}

function pluriel(n, mot) {
  return `${n} ${mot}${n > 1 ? 's' : ''}`;
}

export default {
  id: 'denombrer',
  matiere: 'maths',
  titre: 'Dénombrer une collection',

  generer({ niveau }) {
    const { dizaines, unites } = collection(niveau);
    const n = dizaines * 10 + unites;
    const regroupe = unites >= 10
      ? `${pluriel(dizaines, 'dizaine')} et ${unites} unités, c'est ${pluriel(dizaines + 1, 'dizaine')} et ${pluriel(unites - 10, 'unité')} : ${n}`
      : `${pluriel(dizaines, 'dizaine')} et ${pluriel(unites, 'unité')} : ${n}`;
    // Au niveau 3, le piège classique est d'écrire 4 et 13 côte à côte.
    const pieges = unites >= 10 ? [n - 10, ...nombresProches(n)] : nombresProches(n);
    return {
      consigne: 'Combien de cubes ?',
      visuel: { type: 'cubes', groupes: [{ dizaines, unites }] },
      reponse: { mode: 'choix', options: optionsAvec(n, pieges, 4), attendu: n },
      explication: { texte: regroupe, visuel: { type: 'cubes', groupes: [n] } },
      resume: `${dizaines} dizaines et ${unites} unités`,
    };
  },
};
