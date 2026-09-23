/**
 * Trouver le mot qui contient un son (ou, on, an, in, oi, ch, gn…).
 * Données : data/francais/sons.json — une liste de mots par son.
 * Les pièges sont pris dans les mots des autres sons, en écartant
 * ceux qui contiennent une écriture du son cherché.
 */
import { choisir, itemsDuNiveau, optionsAvec } from '../outils.js';

/** Écriture du son présente dans le mot (la plus longue d'abord : « ain » avant « in »). */
function graphieDans(mot, graphies) {
  return [...graphies].sort((a, b) => b.length - a.length).find((g) => mot.includes(g));
}

export default {
  id: 'sons',
  matiere: 'francais',
  titre: 'Trouver le son',
  poids: 0.6, // bien maîtrisé : revient moins souvent
  donnees: 'sons',

  generer({ niveau, donnees }) {
    const son = choisir(itemsDuNiveau(donnees, niveau));
    const bonne = choisir(son.mots);
    const pieges = donnees
      .filter((autre) => autre !== son)
      .flatMap((autre) => autre.mots)
      .filter((mot) => !graphieDans(mot, son.graphies));

    return {
      consigne: `Quel mot a le son « ${son.son} » ?`,
      lecture: `Quel mot a le son ${son.prononcer}, comme dans ${son.exemple} ?`,
      visuel: { type: 'son', texte: son.son },
      reponse: { mode: 'choix', options: optionsAvec(bonne, pieges, 3), attendu: bonne },
      explication: {
        texte: `On entend « ${son.son} » dans ${bonne}.`,
        lecture: `On entend ${son.prononcer} dans ${bonne}.`,
        visuel: { type: 'mot', texte: bonne, surligne: graphieDans(bonne, son.graphies) },
      },
      resume: `son ${son.son} : ${bonne}`,
    };
  },
};
