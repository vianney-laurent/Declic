/**
 * Nombre juste avant, juste après, ou entre deux nombres.
 * Niveau 1 : avant / après jusqu'à 100
 * Niveau 2 : avant / après avec passage de dizaine (39 → 40, 60 ← 59)
 * Niveau 3 : le nombre entre deux autres, ou passage de dizaine
 */
import { choisir, entier } from '../outils.js';

function droite(n, attendu) {
  const debut = Math.max(0, Math.min(n, attendu) - 3);
  return { type: 'droite', debut, fin: debut + 6, etiquettes: [n, attendu], surligne: attendu };
}

function avantOuApres(niveau) {
  const sens = choisir(['avant', 'apres']);
  const passage = niveau >= 2;
  // Avec passage de dizaine, on se place sur …9 (après) ou …0 (avant).
  const n = !passage ? entier(1, 98) : sens === 'apres' ? entier(1, 9) * 10 + 9 : entier(1, 9) * 10;
  const attendu = sens === 'apres' ? n + 1 : n - 1;
  const mot = sens === 'apres' ? 'après' : 'avant';
  return {
    consigne: `Quel nombre vient juste ${mot} ?`,
    lecture: `Quel nombre vient juste ${mot} ${n} ?`,
    visuel: { type: 'equation', parties: sens === 'apres' ? [n, '→', '?'] : ['?', '←', n] },
    reponse: { mode: 'pave', attendu },
    explication: { texte: `Juste ${mot} ${n}, il y a ${attendu}.`, visuel: droite(n, attendu) },
    resume: `${mot} ${n}`,
  };
}

function entreDeux() {
  const milieu = choisir([entier(2, 98), entier(1, 9) * 10, entier(1, 9) * 10 + 9]);
  return {
    consigne: 'Quel nombre est entre les deux ?',
    lecture: `Quel nombre est entre ${milieu - 1} et ${milieu + 1} ?`,
    visuel: { type: 'suite', termes: [milieu - 1, '?', milieu + 1] },
    reponse: { mode: 'pave', attendu: milieu },
    explication: { texte: `Entre ${milieu - 1} et ${milieu + 1}, il y a ${milieu}.`, visuel: droite(milieu - 1, milieu) },
    resume: `entre ${milieu - 1} et ${milieu + 1}`,
  };
}

export default {
  id: 'avant-apres',
  matiere: 'maths',
  titre: 'Nombre avant, après, entre',

  generer({ niveau }) {
    if (niveau === 3 && Math.random() < 0.5) return entreDeux();
    return avantOuApres(niveau);
  },
};
