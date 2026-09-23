/**
 * Réponse par choix : 2 à 4 gros boutons.
 */
import { h } from '../dom.js';

export default {
  monter(zone, reponse, repondre) {
    const boutons = reponse.options.map((option) =>
      h('button', { class: 'option', type: 'button', onclick: () => choisir(option) }, option),
    );
    // Les textes longs passent en colonne pour rester très lisibles.
    const long = reponse.options.some((o) => String(o).length > 6);
    zone.append(h('div', { class: `choix ${long ? 'choix--colonne' : ''}` }, boutons));

    function choisir(option) {
      boutons.forEach((b) => (b.disabled = true));
      repondre(option);
    }

    return {
      reveler(juste, valeur) {
        reponse.options.forEach((option, i) => {
          const choisi = String(option) === String(valeur);
          const bon = String(option) === String(reponse.attendu);
          if (bon) boutons[i].classList.add(juste ? 'option--juste' : 'option--bonne');
          else boutons[i].classList.add(choisi ? 'option--choisie' : 'option--estompee');
        });
      },
    };
  },
};
