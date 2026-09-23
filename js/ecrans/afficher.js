/**
 * Navigation entre écrans.
 *
 * Un écran est une fonction (racine, parametres) → Promise.
 * Il dessine son contenu dans « racine » et résout sa promesse quand
 * il a terminé (par exemple avec le bouton choisi). Le déroulé d'une
 * session s'écrit alors simplement avec des await (voir parcours.js).
 */
import { h } from '../ui/dom.js';
import { arreterLecture } from '../ui/voix.js';

const app = document.getElementById('app');

export function afficher(ecran, parametres = {}) {
  arreterLecture();
  const racine = h('div', { class: 'ecran' });
  app.replaceChildren(racine);
  return ecran(racine, parametres);
}
