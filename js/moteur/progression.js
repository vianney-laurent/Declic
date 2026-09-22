/**
 * Progression par type d'exercice : niveau adaptatif, statistiques, erreurs.
 *
 * État stocké pour chaque type (clé = id du type) :
 * {
 *   niveau: 1,                 // 1 à 3
 *   actif: true,               // désactivable depuis l'espace parent
 *   historique: [true, false], // dernières réponses depuis le dernier changement de niveau
 *   justes: 12, total: 15,     // depuis toujours
 *   erreurs: [{ resume, donne, attendu, date }], // les plus récentes
 * }
 */
import { CONFIG } from '../config.js';
import { lireEtat, modifierEtat } from './store.js';

const ERREURS_GARDEES = 30;

function etatParDefaut() {
  return { niveau: 1, actif: true, historique: [], justes: 0, total: 0, erreurs: [] };
}

/** État d'un type (valeurs par défaut s'il n'a jamais été joué). */
export function etatType(id) {
  return { ...etatParDefaut(), ...lireEtat().types[id] };
}

/** Modifie l'état d'un type en créant l'entrée si besoin. */
function modifierType(id, modification) {
  modifierEtat((etat) => {
    etat.types[id] = { ...etatParDefaut(), ...etat.types[id] };
    modification(etat.types[id]);
  });
}

/** Taux de réussite récent (0 à 1), ou null si le type n'a pas encore été joué. */
export function tauxRecent(id) {
  const { historique } = etatType(id);
  if (historique.length === 0) return null;
  return historique.filter(Boolean).length / historique.length;
}

/**
 * Enregistre une réponse et ajuste le niveau si besoin.
 * @returns {number} le niveau après ajustement
 */
export function enregistrerReponse(id, { juste, question, valeur }) {
  const { niveauMax, fenetre, seuilMonter, seuilDescendre } = CONFIG.adaptatif;
  let niveauFinal;

  modifierType(id, (type) => {
    type.total += 1;
    if (juste) type.justes += 1;

    if (!juste) {
      type.erreurs.unshift({
        resume: question.resume,
        donne: String(valeur),
        attendu: String(question.reponse.attendu),
        date: new Date().toISOString(),
      });
      type.erreurs.length = Math.min(type.erreurs.length, ERREURS_GARDEES);
    }

    type.historique = [...type.historique, juste].slice(-fenetre);

    // On ne change de niveau qu'avec assez de réponses pour juger.
    if (type.historique.length >= fenetre) {
      const taux = type.historique.filter(Boolean).length / type.historique.length;
      if (taux >= seuilMonter && type.niveau < niveauMax) changerNiveau(type, type.niveau + 1);
      else if (taux < seuilDescendre && type.niveau > 1) changerNiveau(type, type.niveau - 1);
    }
    niveauFinal = type.niveau;
  });

  return niveauFinal;
}

function changerNiveau(type, niveau) {
  type.niveau = niveau;
  type.historique = []; // on repart de zéro pour juger le nouveau niveau
}

/** Réglage manuel depuis l'espace parent. */
export function definirNiveau(id, niveau) {
  modifierType(id, (type) => changerNiveau(type, niveau));
}

/** Active ou désactive un type depuis l'espace parent. */
export function definirActif(id, actif) {
  modifierType(id, (type) => {
    type.actif = actif;
  });
}
