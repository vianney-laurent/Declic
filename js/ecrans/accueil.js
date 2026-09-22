/**
 * Écran d'accueil : « Bonjour Auguste », un grand bouton, la série et les étoiles.
 */
import { CONFIG } from '../config.js';
import { serieDeJours, totalEtoiles } from '../moteur/journal.js';
import { h } from '../ui/dom.js';
import { icone } from '../ui/icones.js';
import { sons } from '../ui/sons.js';
import { lire } from '../ui/voix.js';

export function ecranAccueil(racine) {
  return new Promise((resoudre) => {
    const serie = serieDeJours();

    function partir() {
      // Ce premier toucher autorise le son et la voix sur tablette.
      sons.preparer();
      lire("C'est parti !");
      resoudre('jouer');
    }

    racine.append(
      h(
        'div',
        { class: 'accueil' },
        h('h1', { class: 'accueil__titre' }, `Bonjour ${CONFIG.prenom}`),
        h('button', { class: 'bouton bouton--geant', type: 'button', onclick: partir }, "C'est parti"),
        h(
          'div',
          { class: 'accueil__stats' },
          h('div', { class: 'pastille' }, icone('serie'), `${serie} jour${serie > 1 ? 's' : ''} de suite`),
          h('div', { class: 'pastille' }, icone('etoile', 'icone--etoile'), totalEtoiles()),
        ),
      ),
    );
  });
}
