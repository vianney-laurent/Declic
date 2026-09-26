/**
 * Compter de l'argent : pièces de 1 et 2 €, billets de 5, 10 et 20 €.
 * Niveau 1 : pièces de 1 et 2 €, jusqu'à 10 €
 * Niveau 2 : avec des billets de 5 et 10 €, jusqu'à 30 €
 * Niveau 3 : avec des billets de 20 €, jusqu'à 60 €
 */
import { choisir, entier, melanger } from '../outils.js';

const VALEURS = { 1: [1, 2], 2: [1, 2, 5, 10], 3: [1, 2, 5, 10, 20] };
const MAX = { 1: 10, 2: 30, 3: 60 };
const NOMBRE = { 1: [3, 5], 2: [3, 5], 3: [4, 6] };

function tirerMonnaie(niveau) {
  const [min, max] = NOMBRE[niveau];
  const valeurs = [];
  const combien = entier(min, max);
  while (valeurs.length < combien) {
    const valeur = choisir(VALEURS[niveau]);
    const total = valeurs.reduce((a, b) => a + b, 0);
    if (total + valeur <= MAX[niveau]) valeurs.push(valeur);
    else if (total + 1 > MAX[niveau]) break;
  }
  // Au moins un billet dès le niveau 2, sinon l'exercice ressemble au niveau 1.
  if (niveau >= 2 && valeurs.every((v) => v <= 2)) valeurs[0] = 5;
  return valeurs;
}

export default {
  id: 'monnaie',
  matiere: 'maths',
  titre: 'La monnaie',

  generer({ niveau }) {
    const valeurs = tirerMonnaie(niveau);
    const total = valeurs.reduce((a, b) => a + b, 0);
    const ranges = [...valeurs].sort((a, b) => b - a);
    return {
      consigne: "Combien d'euros en tout ?",
      visuel: { type: 'monnaie', valeurs: melanger(valeurs) },
      reponse: { mode: 'pave', attendu: total },
      explication: {
        // On range du plus grand au plus petit : c'est plus facile à compter.
        texte: `${ranges.join(' + ')} = ${total} €`,
        lecture: `On commence par les plus gros : ${ranges.join(' + ')} = ${total} euros.`,
        visuel: { type: 'monnaie', valeurs: ranges },
      },
      resume: ranges.join(' + '),
    };
  },
};
