/**
 * Écran de fin : « Bravo Auguste, à demain ! » et le bilan de la session.
 * Un seul bouton pour revenir à l'accueil : on ne pousse pas à continuer.
 */
import { CONFIG } from '../config.js';
import { serieDeJours } from '../moteur/journal.js';
import { h } from '../ui/dom.js';
import { icone } from '../ui/icones.js';
import { typographie } from '../ui/typographie.js';
import { lire } from '../ui/voix.js';

function ligneBilan(libelle, { justes, total }) {
  return h('div', { class: 'bilan__ligne' }, h('span', {}, libelle), h('strong', {}, `${justes} / ${total}`));
}

export function ecranFin(racine, { session }) {
  return new Promise((resoudre) => {
    const titre = `Bravo ${CONFIG.prenom}, à demain !`;
    const serie = serieDeJours();

    racine.append(
      h(
        'div',
        { class: 'message' },
        h('h1', { class: 'message__titre' }, typographie(titre)),
        h(
          'div',
          { class: 'bilan' },
          h('div', { class: 'bilan__etoiles' }, icone('etoile', 'icone--etoile'), `+${session.etoiles}`),
          ligneBilan('Français', session.resultats.francais),
          ligneBilan('Maths', session.resultats.maths),
          h('div', { class: 'bilan__ligne' }, h('span', {}, 'Série'), h('strong', {}, `${serie} jour${serie > 1 ? 's' : ''}`)),
        ),
        h('div', { class: 'message__actions' }, h('button', { class: 'bouton', type: 'button', onclick: resoudre }, 'Terminer')),
      ),
    );
    lire(`${titre} Tu as gagné ${session.etoiles} étoiles.`);
  });
}
