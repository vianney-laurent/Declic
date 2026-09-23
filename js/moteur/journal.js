/**
 * Journal des jours joués : étoiles, tours terminés, série de jours consécutifs.
 *
 * État stocké pour chaque jour (clé = date locale 'AAAA-MM-JJ') :
 * {
 *   tours: 1,                          // tours terminés ce jour-là
 *   etoiles: 9,
 *   francais: { justes: 4, total: 5 },
 *   maths:    { justes: 7, total: 8 },
 * }
 */
import { CONFIG } from '../config.js';
import { lireEtat, modifierEtat } from './store.js';

/** Date locale au format 'AAAA-MM-JJ' (pas toISOString, qui est en UTC). */
export function cleDuJour(date = new Date()) {
  const a = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const j = String(date.getDate()).padStart(2, '0');
  return `${a}-${m}-${j}`;
}

function jourVide() {
  return {
    tours: 0,
    etoiles: 0,
    francais: { justes: 0, total: 0 },
    maths: { justes: 0, total: 0 },
  };
}

function modifierAujourdhui(modification) {
  modifierEtat((etat) => {
    const cle = cleDuJour();
    etat.jours[cle] ??= jourVide();
    modification(etat.jours[cle], etat);
  });
}

export function jourDe(cle) {
  return lireEtat().jours[cle] ?? jourVide();
}

export function aujourdhui() {
  return jourDe(cleDuJour());
}

export function totalEtoiles() {
  return lireEtat().etoiles;
}

export function enregistrerReponse(matiere, juste) {
  modifierAujourdhui((jour) => {
    jour[matiere].total += 1;
    if (juste) jour[matiere].justes += 1;
  });
}

export function ajouterEtoiles(nombre) {
  modifierAujourdhui((jour, etat) => {
    jour.etoiles += nombre;
    etat.etoiles += nombre;
  });
}

export function terminerTour() {
  modifierAujourdhui((jour) => {
    jour.tours += 1;
  });
}

/** La session du jour est complète quand tous les tours sont faits. */
export function sessionDuJourComplete() {
  return aujourdhui().tours >= CONFIG.toursParSession;
}

/**
 * Nombre de jours consécutifs avec au moins un tour terminé.
 * Si aujourd'hui n'est pas encore joué, la série d'hier compte toujours.
 */
export function serieDeJours() {
  const date = new Date();
  if (aujourdhui().tours === 0) date.setDate(date.getDate() - 1);

  let serie = 0;
  while (jourDe(cleDuJour(date)).tours > 0) {
    serie += 1;
    date.setDate(date.getDate() - 1);
  }
  return serie;
}
