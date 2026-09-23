/**
 * Petits outils partagés par les générateurs d'exercices.
 * Aucun accès à l'écran ici : uniquement du calcul, pour pouvoir tester.
 */

/** Entier aléatoire entre min et max inclus. */
export function entier(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Un élément au hasard d'une liste. */
export function choisir(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}

/** Copie mélangée d'une liste (Fisher-Yates). */
export function melanger(liste) {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

/** n éléments distincts au hasard d'une liste. */
export function tirer(liste, n) {
  return melanger(liste).slice(0, n);
}

/**
 * Items d'un fichier de données pour un niveau donné.
 * Un item sans champ "niveau" est de niveau 1.
 * On prend les items du niveau exact ; s'il n'y en a pas, ceux des niveaux inférieurs.
 */
export function itemsDuNiveau(items, niveau) {
  const exacts = items.filter((item) => (item.niveau ?? 1) === niveau);
  if (exacts.length > 0) return exacts;
  return items.filter((item) => (item.niveau ?? 1) <= niveau);
}

/**
 * Options de réponse pour un choix : la bonne réponse + des pièges, mélangés.
 * Les doublons et les pièges égaux à la bonne réponse sont écartés.
 */
export function optionsAvec(bonne, pieges, total = 3) {
  const autres = [...new Set(pieges)].filter((p) => p !== bonne);
  return melanger([bonne, ...tirer(autres, total - 1)]);
}

/**
 * Visuel adapté pour montrer des nombres côte à côte :
 * des points jusqu'à 20, des cubes (dizaines + unités) au-delà.
 * Exemple : illustrerNombres([7, 5], '+') → 7 points + 5 points.
 */
export function illustrerNombres(nombres, separateur) {
  const type = Math.max(...nombres) <= 20 ? 'points' : 'cubes';
  return { type, groupes: nombres, separateur };
}

/**
 * Visuel d'explication d'un calcul à deux nombres.
 *   '+' : les deux nombres côte à côte
 *   '−' : jusqu'à 20, des points dont on barre ceux qu'on enlève ; au-delà, les cubes du résultat
 */
export function illustrerCalcul(a, operateur, b) {
  if (operateur === '+') return illustrerNombres([a, b], '+');
  if (a <= 20) return { type: 'points', groupes: [{ n: a - b }, { n: b, style: 'barre' }], continu: true };
  return { type: 'cubes', groupes: [a - b] };
}

/**
 * Nombres proches pour servir de pièges : ±1, ±2, ±10, chiffres inversés.
 * Seulement des nombres positifs et ≤ max.
 */
export function nombresProches(n, max = 100) {
  const inverse = n >= 10 && n % 10 !== 0 ? Number(String(n).split('').reverse().join('')) : null;
  const candidats = [n + 1, n - 1, n + 2, n - 2, n + 10, n - 10, inverse];
  return candidats.filter((c) => c !== null && c >= 0 && c <= max && c !== n);
}
