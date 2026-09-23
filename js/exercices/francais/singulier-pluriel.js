/**
 * Singulier et pluriel.
 * Données : data/francais/singulier-pluriel.json
 *   { "singulier": "le cheval", "pluriel": "les chevaux", "pieges": [...], "niveau": 3 }
 *
 * Deux formes d'exercice :
 * - « Un seul ou plusieurs ? » : on reconnaît le nombre grâce au petit mot (le / les…)
 * - « Et s'il y en a plusieurs ? » : on choisit la bonne écriture au pluriel
 */
import { choisir, itemsDuNiveau, optionsAvec } from '../outils.js';

/** Sépare le déterminant du reste : 'le petit chat' → ['le', 'petit chat']. */
function decouper(groupe) {
  const [determinant, ...reste] = groupe.split(' ');
  return [determinant, reste.join(' ')];
}

function reconnaitre(item) {
  const pluriel = Math.random() < 0.5;
  const texte = pluriel ? item.pluriel : item.singulier;
  const [determinant] = decouper(texte);
  const attendu = pluriel ? 'plusieurs' : 'un seul';

  return {
    consigne: 'Un seul ou plusieurs ?',
    lecture: `Un seul ou plusieurs ? ${texte}.`,
    visuel: { type: 'mot', texte },
    reponse: { mode: 'choix', options: ['un seul', 'plusieurs'], attendu },
    explication: {
      texte: `« ${determinant} » : il y en a ${pluriel ? 'plusieurs' : 'un seul'}.`,
      visuel: { type: 'mot', texte, surligne: determinant, position: 0 },
    },
    resume: texte,
  };
}

function mettreAuPluriel(item) {
  const [detS, resteS] = decouper(item.singulier);
  const [detP, resteP] = decouper(item.pluriel);
  const naif = `${detP} ${resteS.split(' ').map((m) => `${m}s`).join(' ')}`;
  const pieges = [`${detP} ${resteS}`, `${detS} ${resteP}`, naif, ...(item.pieges ?? [])];

  return {
    consigne: "Et s'il y en a plusieurs ?",
    lecture: `${item.singulier}. Et s'il y en a plusieurs ?`,
    visuel: { type: 'mot', texte: item.singulier },
    reponse: { mode: 'choix', options: optionsAvec(item.pluriel, pieges, 3), attendu: item.pluriel },
    explication: {
      texte: `${item.singulier} → ${item.pluriel}`,
      lecture: `${item.singulier}, ${item.pluriel}.`,
      visuel: { type: 'mot', texte: item.pluriel },
    },
    resume: item.singulier,
  };
}

export default {
  id: 'singulier-pluriel',
  matiere: 'francais',
  titre: 'Singulier et pluriel',
  donnees: 'singulier-pluriel',

  generer({ niveau, donnees }) {
    const item = choisir(itemsDuNiveau(donnees, niveau));
    if (niveau === 1) return reconnaitre(item);
    if (niveau === 2) return choisir([reconnaitre, mettreAuPluriel])(item);
    return mettreAuPluriel(item);
  },
};
