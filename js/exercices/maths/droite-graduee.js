/**
 * Droite graduée : quel nombre montre la flèche ?
 * Niveau 1 : de 0 à 10, seuls 0, 5 et 10 sont écrits
 * Niveau 2 : une dizaine au-delà de 10 (de 30 à 40), seuls les bouts et le milieu sont écrits
 * Niveau 3 : de 0 à 100, graduée de 10 en 10, seuls 0, 50 et 100 sont écrits
 */
import { entier } from '../outils.js';

function droiteDuNiveau(niveau) {
  if (niveau === 1) return { debut: 0, fin: 10, pas: 1 };
  if (niveau === 2) {
    const debut = entier(1, 9) * 10;
    return { debut, fin: debut + 10, pas: 1 };
  }
  return { debut: 0, fin: 100, pas: 10 };
}

export default {
  id: 'droite-graduee',
  matiere: 'maths',
  titre: 'Droite graduée',

  generer({ niveau }) {
    const { debut, fin, pas } = droiteDuNiveau(niveau);
    const milieu = (debut + fin) / 2;
    const visibles = [debut, milieu, fin];
    // La flèche ne pointe jamais sur un nombre déjà écrit.
    let cible;
    do cible = debut + entier(1, (fin - debut) / pas - 1) * pas;
    while (visibles.includes(cible));

    const depuis = cible < milieu ? debut : milieu;
    const sauts = (cible - depuis) / pas;
    return {
      consigne: 'Quel nombre montre la flèche ?',
      visuel: { type: 'droite', debut, fin, pas, visibles, fleche: cible },
      reponse: { mode: 'pave', attendu: cible },
      explication: {
        texte: `On part de ${depuis} et on avance de ${sauts} graduation${sauts > 1 ? 's' : ''} de ${pas} : ${cible}.`,
        visuel: { type: 'droite', debut, fin, pas, visibles: [...visibles, cible], surligne: cible },
      },
      resume: `${cible} sur ${debut}–${fin}`,
    };
  },
};
