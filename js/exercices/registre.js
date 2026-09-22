/**
 * REGISTRE DES TYPES D'EXERCICES
 *
 * Pour ajouter un type : créer son fichier dans maths/ ou francais/,
 * puis l'importer et l'ajouter à la liste TYPES ci-dessous. C'est tout.
 * (Mode d'emploi complet : AJOUTER_UN_EXERCICE.md)
 *
 * ─── Format d'un type ───────────────────────────────────────────────
 * {
 *   id: 'addition',              // unique, sert de clé de sauvegarde
 *   matiere: 'maths',            // 'maths' ou 'francais'
 *   titre: 'Additions',          // affiché dans l'espace parent
 *   donnees: 'rimes',            // (facultatif) charge data/francais/rimes.json
 *   generer({ niveau, donnees }) // niveau = 1, 2 ou 3 → renvoie une question
 * }
 *
 * ─── Format d'une question (ce que renvoie generer) ────────────────
 * {
 *   consigne: 'Combien de points ?',   // affichée, 8 mots maximum
 *   lecture: '…',                      // (facultatif) texte lu à la place de la consigne
 *   visuel: { type: 'points', … },     // (facultatif) voir js/ui/visuels.js
 *   reponse: {
 *     mode: 'choix',                   // 'choix' ou 'pave' (voir js/ui/reponses/)
 *     options: [10, 12, 13],           // pour 'choix' uniquement
 *     attendu: 12,                     // la bonne réponse
 *   },
 *   explication: {                     // montrée après une erreur
 *     texte: '7 + 5 = 12',
 *     visuel: { … },                   // (facultatif)
 *   },
 *   resume: '7 + 5',                   // identifie la question (répétitions, erreurs fréquentes)
 * }
 */

// Maths
import addition from './maths/addition.js';
import soustraction from './maths/soustraction.js';
import complements from './maths/complements.js';
import doublesMoities from './maths/doubles-moities.js';
import denombrer from './maths/denombrer.js';
import comparer from './maths/comparer.js';
import suiteLogique from './maths/suite-logique.js';
import avantApres from './maths/avant-apres.js';

// Français
import sons from './francais/sons.js';
import syllabes from './francais/syllabes.js';
import lettreManquante from './francais/lettre-manquante.js';
import dictee from './francais/dictee.js';
import unUne from './francais/un-une.js';
import singulierPluriel from './francais/singulier-pluriel.js';
import rimes from './francais/rimes.js';

export const TYPES = [
  // Maths
  addition,
  soustraction,
  complements,
  doublesMoities,
  denombrer,
  comparer,
  suiteLogique,
  avantApres,
  // Français
  sons,
  syllabes,
  lettreManquante,
  dictee,
  unUne,
  singulierPluriel,
  rimes,
];

export const MATIERES = ['francais', 'maths'];

export function typeParId(id) {
  return TYPES.find((type) => type.id === id);
}

export function typesDe(matiere) {
  return TYPES.filter((type) => type.matiere === matiere);
}

/** Noms des fichiers de données nécessaires (sans doublon). */
export function fichiersDeDonnees() {
  return [...new Set(TYPES.map((type) => type.donnees).filter(Boolean))];
}

/** Vérifie la forme des types au démarrage : une erreur claire vaut mieux qu'un bug discret. */
function verifierTypes() {
  const ids = new Set();
  for (const type of TYPES) {
    const nom = type?.id ?? '(sans id)';
    if (!type?.id) throw new Error(`Type d'exercice sans id : ${JSON.stringify(type)}`);
    if (ids.has(type.id)) throw new Error(`Deux types ont le même id : ${type.id}`);
    if (!MATIERES.includes(type.matiere)) throw new Error(`${nom} : matière inconnue "${type.matiere}"`);
    if (typeof type.generer !== 'function') throw new Error(`${nom} : fonction generer manquante`);
    ids.add(type.id);
  }
}

verifierTypes();
