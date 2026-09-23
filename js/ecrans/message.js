/**
 * Écran de message simple, lu à voix haute : titre, texte, un ou deux boutons.
 * Sert au déblocage des maths, au rattrapage, à la pause entre deux tours.
 *
 * Paramètres :
 *   titre, texte?, lecture?          textes (lecture = ce qui est lu, sinon titre + texte)
 *   icone?                           nom d'icône affichée en grand (ex. 'cadenas')
 *   animation?                       classe CSS jouée sur l'icône (ex. 'ouverture')
 *   son?                             fonction jouée à l'affichage
 *   actions: [{ libelle, valeur, secondaire? }]
 * Résout avec la « valeur » du bouton touché.
 */
import { h } from '../ui/dom.js';
import { icone } from '../ui/icones.js';
import { lire } from '../ui/voix.js';

export function ecranMessage(racine, { titre, texte, lecture, icone: nomIcone, animation, son, actions }) {
  return new Promise((resoudre) => {
    racine.append(
      h(
        'div',
        { class: 'message' },
        nomIcone && h('div', { class: `message__icone ${animation ?? ''}` }, icone(nomIcone)),
        h('h1', { class: 'message__titre' }, titre),
        texte && h('p', { class: 'message__texte' }, texte),
        h(
          'div',
          { class: 'message__actions' },
          actions.map(({ libelle, valeur, secondaire }) =>
            h('button', { class: `bouton ${secondaire ? 'bouton--secondaire' : ''}`, type: 'button', onclick: () => resoudre(valeur) }, libelle),
          ),
        ),
      ),
    );
    son?.();
    lire(lecture ?? [titre, texte].filter(Boolean).join('. '));
  });
}
