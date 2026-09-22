/**
 * Petit utilitaire pour créer des éléments sans framework.
 *
 *   h('button', { class: 'bouton', onclick: partir }, 'C\'est parti')
 *
 * - les clés commençant par "on" deviennent des écouteurs d'événements ;
 * - class, style (texte) et les autres clés deviennent des attributs ;
 * - les enfants peuvent être du texte, des nombres, des éléments ou des listes.
 */
export function h(balise, proprietes = {}, ...enfants) {
  const element = document.createElement(balise);
  appliquer(element, proprietes, enfants);
  return element;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Même chose pour les éléments SVG. */
export function s(balise, proprietes = {}, ...enfants) {
  const element = document.createElementNS(SVG_NS, balise);
  appliquer(element, proprietes, enfants);
  return element;
}

function appliquer(element, proprietes, enfants) {
  for (const [cle, valeur] of Object.entries(proprietes)) {
    if (valeur === undefined || valeur === null || valeur === false) continue;
    if (cle.startsWith('on')) element.addEventListener(cle.slice(2), valeur);
    else element.setAttribute(cle, valeur === true ? '' : valeur);
  }
  for (const enfant of enfants.flat(Infinity)) {
    if (enfant === undefined || enfant === null || enfant === false) continue;
    element.append(enfant instanceof Node ? enfant : String(enfant));
  }
}

/** Crée des éléments à partir d'un bout de HTML de confiance (icônes). */
export function depuisHTML(html) {
  const modele = document.createElement('template');
  modele.innerHTML = html.trim();
  return modele.content.firstElementChild;
}

/** Promesse résolue après un délai (en millisecondes). */
export function attendre(ms) {
  return new Promise((resoudre) => setTimeout(resoudre, ms));
}

/** Rejoue une animation CSS définie par une classe. */
export function animer(element, classe) {
  element.classList.remove(classe);
  void element.offsetWidth; // force le navigateur à repartir de zéro
  element.classList.add(classe);
}
