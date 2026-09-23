/**
 * Additions.
 * Niveau 1 : passage de la dizaine jusqu'à 20 (7 + 5) ou 34 + 5 sans retenue
 * Niveau 2 : retenue simple (27 + 5) ou deux nombres à deux chiffres sans retenue (34 + 25)
 * Niveau 3 : deux nombres à deux chiffres avec retenue (38 + 24)
 */
import { choisir, entier, illustrerCalcul } from '../outils.js';

/** 7 + 5 : les unités dépassent 10. */
function passageDizaine() {
  const a = entier(3, 9);
  return [a, entier(11 - a, 9)];
}

/** 34 + 5 : les unités ne dépassent pas 9. */
function plusUnitesSansRetenue() {
  const u = entier(0, 8);
  return [entier(1, 8) * 10 + u, entier(1, 9 - u)];
}

/** 27 + 5 : les unités dépassent 9. */
function plusUnitesAvecRetenue() {
  const u = entier(2, 9);
  return [entier(1, 8) * 10 + u, entier(10 - u, 9)];
}

/** 34 + 25 : dizaines et unités sans dépasser 9. */
function deuxChiffresSansRetenue() {
  const ua = entier(0, 8);
  const da = entier(1, 7);
  return [da * 10 + ua, entier(1, 8 - da) * 10 + entier(0, 9 - ua)];
}

/** 38 + 24 : une retenue, résultat < 100. */
function deuxChiffresAvecRetenue() {
  const ua = entier(2, 9);
  const da = entier(1, 7);
  return [da * 10 + ua, entier(1, 8 - da) * 10 + entier(10 - ua, 9)];
}

const CALCULS = {
  1: [passageDizaine, plusUnitesSansRetenue],
  2: [plusUnitesAvecRetenue, deuxChiffresSansRetenue],
  3: [deuxChiffresAvecRetenue],
};

export default {
  id: 'addition',
  matiere: 'maths',
  titre: 'Additions',

  generer({ niveau }) {
    const [a, b] = choisir(CALCULS[niveau])();
    const somme = a + b;
    return {
      consigne: 'Calcule.',
      lecture: `Combien font ${a} + ${b} ?`,
      visuel: { type: 'equation', parties: [a, '+', b, '=', '?'] },
      reponse: { mode: 'pave', attendu: somme },
      explication: { texte: `${a} + ${b} = ${somme}`, visuel: illustrerCalcul(a, '+', b) },
      resume: `${a} + ${b}`,
    };
  },
};
