/**
 * Les nombres en lettres, jusqu'à 100.
 * Deux sens : lire (« trente-deux » → 32) et écrire (32 → choisir « trente-deux »).
 * Niveau 1 : de 0 à 20 et les dizaines jusqu'à 60
 * Niveau 2 : de 21 à 69 (vingt et un, trente-deux…)
 * Niveau 3 : de 70 à 100 (soixante-dix, quatre-vingts, quatre-vingt-onze…)
 */
import { choisir, entier, optionsAvec } from '../outils.js';

const JUSQUA_19 = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
];
const DIZAINES = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

/** Écrit un nombre de 0 à 100 en lettres (orthographe traditionnelle). */
export function enLettres(n) {
  if (n < 20) return JUSQUA_19[n];
  if (n === 100) return 'cent';
  const d = Math.floor(n / 10);
  const u = n % 10;
  if (d === 7) return u === 1 ? 'soixante et onze' : `soixante-${JUSQUA_19[10 + u]}`;
  if (d === 8) return u === 0 ? 'quatre-vingts' : `quatre-vingt-${JUSQUA_19[u]}`;
  if (d === 9) return `quatre-vingt-${JUSQUA_19[10 + u]}`;
  if (u === 0) return DIZAINES[d];
  if (u === 1) return `${DIZAINES[d]} et un`;
  return `${DIZAINES[d]}-${JUSQUA_19[u]}`;
}

/** Erreurs d'écriture fréquentes, pour servir de pièges. */
function erreursFrequentes(n) {
  const d = Math.floor(n / 10);
  const u = n % 10;
  const erreurs = [];
  if (d === 7 && u > 0) erreurs.push(`soixante-dix-${JUSQUA_19[u]}`);
  if (d === 9 && u > 0) erreurs.push(`quatre-vingt-dix-${JUSQUA_19[u]}`);
  if (n === 80) erreurs.push('quatre-vingt');
  if (u === 1 && d >= 2 && d <= 6) erreurs.push(`${DIZAINES[d]}-un`);
  return erreurs;
}

function nombre(niveau) {
  if (niveau === 1) return choisir([entier(0, 20), entier(2, 6) * 10]);
  if (niveau === 2) return entier(21, 69);
  return entier(70, 100);
}

/** « trente-deux » → taper 32 */
function lire(n) {
  const mots = enLettres(n);
  return {
    consigne: 'Écris ce nombre en chiffres.',
    visuel: { type: 'mot', texte: mots },
    reponse: { mode: 'pave', attendu: n },
    explication: { texte: `${mots} : ${n}`, lecture: `${mots}, c'est ${n}.` },
    resume: mots,
  };
}

/** 32 → choisir « trente-deux » */
function ecrire(n) {
  const bonne = enLettres(n);
  const voisins = [n + 1, n - 1, n + 10, n - 10].filter((v) => v >= 0 && v <= 100).map(enLettres);
  const pieges = [...erreursFrequentes(n), ...voisins];
  return {
    consigne: "Comment s'écrit ce nombre ?",
    lecture: `Comment s'écrit ${n} ?`,
    visuel: { type: 'equation', parties: [n] },
    reponse: { mode: 'choix', options: optionsAvec(bonne, pieges, 3), attendu: bonne },
    explication: { texte: `${n} s'écrit : ${bonne}` },
    resume: `${n} en lettres`,
  };
}

export default {
  id: 'nombres-en-lettres',
  matiere: 'francais',
  titre: 'Nombres en lettres',

  generer({ niveau }) {
    return choisir([lire, ecrire])(nombre(niveau));
  },
};
