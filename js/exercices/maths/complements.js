/**
 * Compléments.
 * Niveau 1 : à 10 (7 + ? = 10)
 * Niveau 2 : à 20 (13 + ? = 20)
 * Niveau 3 : à la dizaine suivante (47 + ? = 50)
 */
import { entier } from '../outils.js';

function nombres(niveau) {
  if (niveau === 1) return [entier(1, 9), 10];
  if (niveau === 2) return [entier(3, 19), 20];
  const dizaine = entier(2, 9) * 10;
  return [dizaine - entier(1, 9), dizaine];
}

export default {
  id: 'complements',
  matiere: 'maths',
  titre: 'Compléments à 10 et à 20',

  generer({ niveau }) {
    const [depart, cible] = nombres(niveau);
    const complement = cible - depart;
    // Points pleins pour le départ, points creux pour ce qui manque.
    const visuel =
      cible <= 20
        ? { type: 'points', groupes: [{ n: depart }, { n: complement, style: 'creux' }], continu: true }
        : { type: 'cubes', groupes: [depart, complement], separateur: '+' };
    return {
      consigne: 'Combien manque-t-il ?',
      lecture: `Combien manque-t-il à ${depart} pour faire ${cible} ?`,
      visuel: { type: 'equation', parties: [depart, '+', '?', '=', cible] },
      reponse: { mode: 'pave', attendu: complement },
      explication: { texte: `${depart} + ${complement} = ${cible}`, visuel },
      resume: `${depart} + ? = ${cible}`,
    };
  },
};
