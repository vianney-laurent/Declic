/**
 * Compléments.
 * Niveau 1 : à 10 (7 + ? = 10) ou à 20 (13 + ? = 20)
 * Niveau 2 : à la dizaine suivante (47 + ? = 50) ou à 20 depuis moins de 10 (6 + ? = 20)
 * Niveau 3 : à 100 depuis une dizaine (30 + ? = 100) ou à la dizaine suivante
 */
import { choisir, entier } from '../outils.js';

const COMPLEMENTS = {
  1: [() => [entier(1, 9), 10], () => [entier(11, 19), 20]],
  2: [dizaineSuivante, () => [entier(2, 9), 20]],
  3: [() => [entier(1, 9) * 10, 100], dizaineSuivante],
};

function dizaineSuivante() {
  const dizaine = entier(2, 9) * 10;
  return [dizaine - entier(1, 9), dizaine];
}

function visuel(depart, complement, cible) {
  // Points pleins pour le départ, points creux pour ce qui manque.
  if (cible <= 20) {
    return { type: 'points', groupes: [{ n: depart }, { n: complement, style: 'creux' }], continu: true };
  }
  return { type: 'cubes', groupes: [depart, complement], separateur: '+' };
}

export default {
  id: 'complements',
  matiere: 'maths',
  titre: 'Compléments',

  generer({ niveau }) {
    const [depart, cible] = choisir(COMPLEMENTS[niveau])();
    const complement = cible - depart;
    return {
      consigne: 'Combien manque-t-il ?',
      lecture: `Combien manque-t-il à ${depart} pour faire ${cible} ?`,
      visuel: { type: 'equation', parties: [depart, '+', '?', '=', cible] },
      reponse: { mode: 'pave', attendu: complement },
      explication: { texte: `${depart} + ${complement} = ${cible}`, visuel: visuel(depart, complement, cible) },
      resume: `${depart} + ? = ${cible}`,
    };
  },
};
