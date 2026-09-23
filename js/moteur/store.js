/**
 * Sauvegarde locale de la progression (localStorage).
 *
 * Tout l'état persistant tient dans un seul objet JSON :
 * {
 *   version: 1,
 *   etoiles: 42,                       // total depuis le début
 *   jours:  { '2026-09-22': {...} },   // voir journal.js
 *   types:  { addition: {...} },       // voir progression.js
 *   parent: { code: '1234' },
 * }
 *
 * Les autres modules ne touchent jamais au localStorage directement :
 * ils passent par lireEtat() et modifierEtat().
 */

const CLE = 'declic';
const VERSION = 1;

function etatInitial() {
  return {
    version: VERSION,
    etoiles: 0,
    jours: {},
    types: {},
    parent: { code: '1234' },
  };
}

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return etatInitial();
    // On complète avec les valeurs par défaut au cas où des champs manqueraient.
    return { ...etatInitial(), ...JSON.parse(brut) };
  } catch {
    return etatInitial();
  }
}

let etat = charger();

/** Lecture seule : ne pas modifier l'objet retourné, utiliser modifierEtat(). */
export function lireEtat() {
  return etat;
}

/** Applique une modification puis sauvegarde immédiatement. */
export function modifierEtat(modification) {
  modification(etat);
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    // Stockage plein ou indisponible (navigation privée) : on continue sans sauver.
  }
}

/** Remplace tout l'état (import d'une sauvegarde). */
export function remplacerEtat(nouvelEtat) {
  modifierEtat((e) => {
    Object.keys(e).forEach((cle) => delete e[cle]);
    Object.assign(e, etatInitial(), nouvelEtat);
  });
}

/** Efface toute la progression. */
export function reinitialiserEtat() {
  remplacerEtat(etatInitial());
}
