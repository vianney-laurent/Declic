/**
 * Rimes : quel mot rime avec… ?
 * Données : data/francais/rimes.json — des familles de mots qui riment entre eux.
 * Les pièges viennent des autres familles.
 */
import { choisir, itemsDuNiveau, optionsAvec, tirer } from '../outils.js';

export default {
  id: 'rimes',
  matiere: 'francais',
  titre: 'Rimes',
  poids: 0.6, // bien maîtrisé : revient moins souvent
  donnees: 'rimes',

  generer({ niveau, donnees }) {
    const famille = choisir(itemsDuNiveau(donnees, niveau));
    const [cible, bonne] = tirer(famille.mots, 2);
    const pieges = donnees.filter((f) => f !== famille).flatMap((f) => f.mots);

    return {
      consigne: `Quel mot rime avec ${cible} ?`,
      visuel: { type: 'mot', texte: cible },
      reponse: { mode: 'choix', options: optionsAvec(bonne, pieges, 3), attendu: bonne },
      explication: {
        texte: `${cible} et ${bonne} finissent par le même son.`,
        visuel: { type: 'mot', texte: `${cible} · ${bonne}` },
      },
      resume: `${cible} / ${bonne}`,
    };
  },
};
