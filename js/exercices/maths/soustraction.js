/**
 * Soustractions.
 * Niveau 1 : sans retenue, jusqu'à 20 (17 − 5) ou 48 − 3
 * Niveau 2 : passage de la dizaine jusqu'à 20 (13 − 5) ou 68 − 23 sans retenue
 * Niveau 3 : passage de la dizaine au-delà de 20 (42 − 5, 60 − 7)
 */
import { choisir, entier, illustrerCalcul } from '../outils.js';

/** 17 − 5 */
function jusqua20SansRetenue() {
  const u = entier(2, 9);
  return [10 + u, entier(1, u)];
}

/** 48 − 3 */
function moinsUnitesSansRetenue() {
  const u = entier(2, 9);
  return [entier(2, 9) * 10 + u, entier(1, u)];
}

/** 13 − 5 : on passe sous la dizaine. */
function passageDizaineJusqua20() {
  const u = entier(1, 8);
  return [10 + u, entier(u + 1, 9)];
}

/** 68 − 23 : chaque chiffre du second est plus petit. */
function deuxChiffresSansRetenue() {
  const da = entier(3, 9);
  const ua = entier(1, 9);
  return [da * 10 + ua, entier(1, da - 1) * 10 + entier(0, ua)];
}

/** 42 − 5 ou 60 − 7 : on passe sous la dizaine. */
function passageDizaine() {
  const u = entier(0, 8);
  return [entier(2, 9) * 10 + u, entier(u + 1, 9)];
}

const CALCULS = {
  1: [jusqua20SansRetenue, moinsUnitesSansRetenue],
  2: [passageDizaineJusqua20, deuxChiffresSansRetenue],
  3: [passageDizaine],
};

export default {
  id: 'soustraction',
  matiere: 'maths',
  titre: 'Soustractions',

  generer({ niveau }) {
    const [a, b] = choisir(CALCULS[niveau])();
    const difference = a - b;
    return {
      consigne: 'Calcule.',
      lecture: `Combien font ${a} − ${b} ?`,
      visuel: { type: 'equation', parties: [a, '−', b, '=', '?'] },
      reponse: { mode: 'pave', attendu: difference },
      explication: { texte: `${a} − ${b} = ${difference}`, visuel: illustrerCalcul(a, '−', b) },
      resume: `${a} − ${b}`,
    };
  },
};
