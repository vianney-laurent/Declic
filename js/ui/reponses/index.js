/**
 * MODES DE RÉPONSE
 *
 * Chaque mode sait dessiner sa zone de réponse et montrer la correction :
 * {
 *   monter(zone, reponse, repondre) → { reveler(juste, valeur) }
 *     zone     : élément où dessiner
 *     reponse  : l'objet "reponse" de la question (mode, attendu, options…)
 *     repondre : fonction à appeler une seule fois avec la valeur choisie
 *   estJuste(reponse, valeur) → booléen   (facultatif, égalité par défaut)
 * }
 *
 * Pour ajouter un mode : créer son fichier ici et l'ajouter à MODES.
 */
import choix from './choix.js';
import pave from './pave.js';

export const MODES = { choix, pave };

export function estJuste(reponse, valeur) {
  const mode = MODES[reponse.mode];
  if (mode.estJuste) return mode.estJuste(reponse, valeur);
  return String(valeur) === String(reponse.attendu);
}
