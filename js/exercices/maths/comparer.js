/**
 * Comparer avec <, > ou =.
 * Niveau 1 : deux nombres ≤ 100
 * Niveau 2 : pièges classiques, même dizaine ou chiffres inversés (47 et 43, 36 et 63)
 * Niveau 3 : un calcul et un nombre (20 + 5 et 24)
 */
import { choisir, entier, illustrerNombres } from '../outils.js';

const PROBA_EGAL = 0.15;

function distincts(min, max) {
  const a = entier(min, max);
  let b = entier(min, max);
  while (b === a) b = entier(min, max);
  return [a, b];
}

function pieges() {
  const [x, y] = distincts(1, 9);
  const dizaine = entier(1, 9) * 10;
  return choisir([
    [dizaine + x, dizaine + y],
    [x * 10 + y, y * 10 + x],
  ]);
}

function signe(a, b) {
  if (a < b) return '<';
  if (a > b) return '>';
  return '=';
}

function phrase(a, b) {
  if (a < b) return `${a} est plus petit que ${b}`;
  if (a > b) return `${a} est plus grand que ${b}`;
  return `${a} est égal à ${b}`;
}

/** Deux nombres : a ? b */
function comparerNombres(niveau) {
  const egal = Math.random() < PROBA_EGAL;
  const [a, b] = egal ? [entier(10, 99), null] : niveau === 1 ? distincts(1, 100) : pieges();
  const droite = egal ? a : b;
  const s = signe(a, droite);
  return {
    parties: [a, '?', droite],
    attendu: s,
    explication: { texte: `${phrase(a, droite)} : ${a} ${s} ${droite}`, visuel: illustrerNombres([a, droite], s) },
    resume: `${a} ? ${droite}`,
  };
}

/** Un calcul et un nombre : 20 + 5 ? 24 */
function comparerCalcul() {
  const a = entier(1, 8) * 10;
  const b = entier(1, 9);
  const resultat = a + b;
  const nombre = resultat + choisir([-2, -1, 0, 1, 2]);
  const s = signe(resultat, nombre);
  return {
    parties: [`${a} + ${b}`, '?', nombre],
    attendu: s,
    explication: { texte: `${a} + ${b} = ${resultat}, donc ${resultat} ${s} ${nombre}`, visuel: illustrerNombres([resultat, nombre], s) },
    resume: `${a} + ${b} ? ${nombre}`,
  };
}

export default {
  id: 'comparer',
  matiere: 'maths',
  titre: 'Comparer',

  generer({ niveau }) {
    const { parties, attendu, explication, resume } = niveau === 3 ? comparerCalcul() : comparerNombres(niveau);
    return {
      consigne: 'Choisis le bon signe.',
      visuel: { type: 'equation', parties },
      reponse: { mode: 'choix', options: ['<', '=', '>'], attendu },
      explication,
      resume,
    };
  },
};
