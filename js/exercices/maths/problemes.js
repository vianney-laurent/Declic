/**
 * Petits problèmes en une ou deux phrases.
 * Niveau 1 : gagner ou perdre, nombres jusqu'à 10
 * Niveau 2 : gagner, perdre ou réunir, jusqu'à 20
 * Niveau 3 : « de plus » et paquets (multiplication), jusqu'à 50
 *
 * Pour enrichir : ajouter des prénoms, des objets ou un nouveau modèle d'énoncé.
 */
import { choisir, entier, illustrerCalcul, tirer } from '../outils.js';

const ENFANTS = [
  { prenom: 'Léa', il: 'elle' },
  { prenom: 'Tom', il: 'il' },
  { prenom: 'Inès', il: 'elle' },
  { prenom: 'Noé', il: 'il' },
  { prenom: 'Jade', il: 'elle' },
  { prenom: 'Hugo', il: 'il' },
  { prenom: 'Lina', il: 'elle' },
  { prenom: 'Paul', il: 'il' },
];

const OBJETS = ['billes', 'bonbons', 'cartes', 'images', 'autocollants', 'coquillages'];

const MAX = { 1: 10, 2: 20, 3: 50 };

/** Commence une phrase par une majuscule. */
function majuscule(texte) {
  return texte[0].toUpperCase() + texte.slice(1);
}

function gagner(max) {
  const [enfant] = tirer(ENFANTS, 1);
  const objets = choisir(OBJETS);
  const a = entier(2, max - 2);
  const b = entier(1, max - a);
  return {
    enonce: `${enfant.prenom} a ${a} ${objets}. ${majuscule(enfant.il)} en gagne ${b}.`,
    question: `Combien en a-t-${enfant.il} maintenant ?`,
    calcul: [a, '+', b],
  };
}

function perdre(max) {
  const [enfant] = tirer(ENFANTS, 1);
  const objets = choisir(OBJETS);
  const a = entier(4, max);
  const b = entier(1, a - 1);
  return {
    enonce: `${enfant.prenom} a ${a} ${objets}. ${majuscule(enfant.il)} en donne ${b}.`,
    question: `Combien lui en reste-t-il ?`,
    calcul: [a, '−', b],
  };
}

function reunir(max) {
  const [e1, e2] = tirer(ENFANTS, 2);
  const objets = choisir(OBJETS);
  const a = entier(2, max - 2);
  const b = entier(1, max - a);
  const ensemble = e1.il === 'elle' && e2.il === 'elle' ? 'elles' : 'ils';
  return {
    enonce: `${e1.prenom} a ${a} ${objets}. ${e2.prenom} en a ${b}.`,
    question: `Combien en ont-${ensemble} ensemble ?`,
    calcul: [a, '+', b],
  };
}

function dePlus(max) {
  const [e1, e2] = tirer(ENFANTS, 2);
  const objets = choisir(OBJETS);
  const a = entier(5, max - 10);
  const b = entier(2, Math.min(9, max - a));
  return {
    enonce: `${e1.prenom} a ${a} ${objets}. ${e2.prenom} en a ${b} de plus.`,
    question: `Combien en a ${e2.prenom} ?`,
    calcul: [a, '+', b],
  };
}

function paquets() {
  const taille = choisir([2, 10]);
  const n = entier(2, 5);
  const contenant = choisir([
    { boites: 'boîtes', objets: 'œufs' },
    { boites: 'sachets', objets: 'bonbons' },
    { boites: 'paquets', objets: 'cartes' },
  ]);
  return {
    enonce: `Il y a ${n} ${contenant.boites} de ${taille} ${contenant.objets}.`,
    question: `Combien de ${contenant.objets} en tout ?`,
    calcul: [n, '×', taille],
  };
}

const MODELES = {
  1: [gagner, perdre],
  2: [gagner, perdre, reunir],
  3: [perdre, reunir, dePlus, paquets],
};

function resultat([a, operateur, b]) {
  if (operateur === '+') return a + b;
  if (operateur === '−') return a - b;
  return a * b;
}

function visuel([a, operateur, b]) {
  if (operateur === '×') return b === 2 ? { type: 'paquets', paquets: a, taille: 2 } : { type: 'cubes', groupes: [a * 10] };
  return illustrerCalcul(a, operateur, b);
}

export default {
  id: 'problemes',
  matiere: 'maths',
  titre: 'Petits problèmes',

  generer({ niveau }) {
    const { enonce, question, calcul } = choisir(MODELES[niveau])(MAX[niveau]);
    const [a, operateur, b] = calcul;
    const attendu = resultat(calcul);
    return {
      consigne: question,
      lecture: `${enonce} ${question}`,
      visuel: { type: 'phrase', texte: enonce },
      reponse: { mode: 'pave', attendu },
      explication: { texte: `${a} ${operateur} ${b} = ${attendu}`, visuel: visuel(calcul) },
      resume: enonce,
    };
  },
};
