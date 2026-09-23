/**
 * Étoiles : 1 par bonne réponse, bonus toutes les 5 bonnes réponses d'affilée.
 */
import { CONFIG } from '../config.js';
import { ajouterEtoiles } from './journal.js';

/**
 * Met à jour la session et le journal après une réponse.
 * @returns {{ etoiles: number, bonus: boolean }} ce qui vient d'être gagné
 */
export function recompenser(session, juste) {
  if (!juste) {
    session.serie = 0;
    return { etoiles: 0, bonus: false };
  }

  const { parBonneReponse, serie, bonusSerie } = CONFIG.etoiles;
  session.serie += 1;
  const bonus = session.serie % serie === 0;
  const etoiles = parBonneReponse + (bonus ? bonusSerie : 0);

  session.etoiles += etoiles;
  ajouterEtoiles(etoiles);
  return { etoiles, bonus };
}
