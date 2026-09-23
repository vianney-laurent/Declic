/**
 * Choix des questions : quel type d'exercice, puis quelle question.
 *
 * - Chaque type a un poids de base (facultatif, 1 par défaut) : 2 = deux fois plus fréquent.
 * - Les types les plus ratés récemment reviennent un peu plus souvent.
 * - Dans un même bloc, un type déjà tiré devient beaucoup moins probable (variété).
 * - Jamais deux fois de suite le même type.
 * - On évite de reposer une question déjà vue dans la session.
 */
import { CONFIG } from '../config.js';
import { typesDe } from '../exercices/registre.js';
import { donneesDe } from './donnees.js';
import { etatType, tauxRecent } from './progression.js';

/** Chaque tirage précédent du même type dans le bloc multiplie son poids par ce facteur. */
const FACTEUR_DEJA_TIRE = 0.2;
const ESSAIS_QUESTION_INEDITE = 10;

export function typesActifs(matiere) {
  return typesDe(matiere).filter((type) => etatType(type.id).actif);
}

function poidsDuType(type) {
  const taux = tauxRecent(type.id);
  const bonusEchec = CONFIG.adaptatif.poidsEchec * (taux === null ? 0 : 1 - taux);
  return (type.poids ?? 1) * (1 + bonusEchec);
}

function tirageAuPoids(elements, poids) {
  const valeurs = elements.map(poids);
  let reste = Math.random() * valeurs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < elements.length; i++) {
    reste -= valeurs[i];
    if (reste <= 0) return elements[i];
  }
  return elements[elements.length - 1];
}

/**
 * Prépare le tirage des types pour un bloc de questions.
 * @returns {() => object} une fonction qui renvoie le type suivant
 */
export function creerTirage(matiere) {
  const tirages = new Map(); // type → nombre de fois tiré dans ce bloc
  let precedent = null;

  return function typeSuivant() {
    const actifs = typesActifs(matiere);
    if (actifs.length === 0) throw new Error(`Aucun type actif en ${matiere}`);
    const candidats = actifs.length > 1 ? actifs.filter((t) => t !== precedent) : actifs;

    const type = tirageAuPoids(candidats, (t) => poidsDuType(t) * FACTEUR_DEJA_TIRE ** (tirages.get(t) ?? 0));
    tirages.set(type, (tirages.get(type) ?? 0) + 1);
    precedent = type;
    return type;
  };
}

/**
 * Génère une question du type donné, au niveau actuel de l'enfant.
 * @param {Set<string>} dejaVues questions déjà posées dans la session (mis à jour)
 */
export function fabriquerQuestion(type, dejaVues = new Set()) {
  const { niveau } = etatType(type.id);
  let question;
  for (let essai = 0; essai < ESSAIS_QUESTION_INEDITE; essai++) {
    question = type.generer({ niveau, donnees: donneesDe(type.donnees) });
    if (!dejaVues.has(`${type.id}:${question.resume}`)) break;
  }
  dejaVues.add(`${type.id}:${question.resume}`);
  return question;
}
