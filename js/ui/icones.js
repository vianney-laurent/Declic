/**
 * Icônes SVG (trait simple, couleur héritée du texte).
 * Usage : icone('etoile')
 */
import { depuisHTML } from './dom.js';

const TRACES = {
  hautParleur:
    '<path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  etoile:
    '<path d="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83-5.38 2.83 1.03-6L3.3 9.6l6-.9z" fill="currentColor" stroke-linejoin="round"/>',
  cadenas: '<rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" stroke="none"/><path class="anse" d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  effacer: '<path d="M9 5h11v14H9l-6-7z" stroke-linejoin="round"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/>',
  valider: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  fermer: '<path d="M6 6l12 12M18 6L6 18"/>',
  serie: '<path d="M4 17l5-5 4 4 7-8"/><path d="M15 8h5v5"/>',
};

export function icone(nom, classe = '') {
  return depuisHTML(
    `<svg class="icone ${classe}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" aria-hidden="true">${TRACES[nom]}</svg>`,
  );
}
