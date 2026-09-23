/**
 * Dizaines et unités.
 * Niveau 1 : combien de dizaines (ou d'unités) dans 47 ?
 * Niveau 2 : 4 dizaines et 7 unités, quel nombre est-ce ?
 * Niveau 3 : avec échange, 3 dizaines et 14 unités, quel nombre est-ce ?
 */
import { choisir, entier } from '../outils.js';

function pluriel(n, mot) {
  return `${n} ${mot}${n > 1 ? 's' : ''}`;
}

function chiffreDuNombre() {
  const n = entier(11, 99);
  const dizaines = Math.floor(n / 10);
  const unites = n % 10;
  const demande = choisir(['dizaines', 'unités']);
  return {
    consigne: `Combien ${demande === 'dizaines' ? 'de dizaines' : "d'unités"} dans ${n} ?`,
    visuel: { type: 'equation', parties: [n] },
    reponse: { mode: 'pave', attendu: demande === 'dizaines' ? dizaines : unites },
    explication: {
      texte: `${n}, c'est ${pluriel(dizaines, 'dizaine')} et ${pluriel(unites, 'unité')}.`,
      visuel: { type: 'cubes', groupes: [n] },
    },
    resume: `${demande} de ${n}`,
  };
}

function nombreDepuisDecomposition(dizaines, unites) {
  const n = dizaines * 10 + unites;
  const decomposition = `${pluriel(dizaines, 'dizaine')} et ${pluriel(unites, 'unité')}`;
  const texte = unites >= 10
    ? `${unites} unités, c'est 1 dizaine et ${pluriel(unites - 10, 'unité')}. Donc ${n}.`
    : `${decomposition}, c'est ${n}.`;
  return {
    consigne: 'Quel est ce nombre ?',
    lecture: `${decomposition}. Quel est ce nombre ?`,
    visuel: { type: 'phrase', texte: decomposition },
    reponse: { mode: 'pave', attendu: n },
    explication: { texte, visuel: { type: 'cubes', groupes: [{ dizaines, unites }] } },
    resume: decomposition,
  };
}

export default {
  id: 'dizaines-unites',
  matiere: 'maths',
  titre: 'Dizaines et unités',

  generer({ niveau }) {
    if (niveau === 1) return chiffreDuNombre();
    if (niveau === 2) return nombreDepuisDecomposition(entier(1, 9), entier(0, 9));
    return nombreDepuisDecomposition(entier(1, 8), entier(10, 19));
  },
};
