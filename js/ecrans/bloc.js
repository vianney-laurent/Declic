/**
 * Écran de jeu : une série de questions d'une matière.
 * En haut : quitter, la progression, les étoiles gagnées dans la session.
 *
 * Paramètres : { session, matiere, nombre }
 * Résout avec { justes, total } ou { quitte: true }.
 */
import { CONFIG } from '../config.js';
import * as journal from '../moteur/journal.js';
import * as progression from '../moteur/progression.js';
import { recompenser } from '../moteur/recompenses.js';
import { creerTirage, fabriquerQuestion } from '../moteur/selection.js';
import { animer, h } from '../ui/dom.js';
import { icone } from '../ui/icones.js';
import { poserQuestion } from '../ui/question.js';
import { sons } from '../ui/sons.js';

const QUITTE = Symbol('quitte');

export async function ecranBloc(racine, { session, matiere, nombre }) {
  const points = Array.from({ length: nombre }, () => h('span', { class: 'progression__point' }));
  const compteur = h('span', {}, session.etoiles);
  const etoiles = h('div', { class: 'barre__etoiles' }, icone('etoile', 'icone--etoile'), compteur);
  const bonus = h('div', { class: 'bonus', 'aria-live': 'polite' });

  let quitter;
  const quitte = new Promise((resoudre) => (quitter = () => resoudre(QUITTE)));

  const zone = h('div', { class: 'jeu__zone' });
  racine.append(
    h(
      'div',
      { class: 'jeu' },
      h(
        'header',
        { class: 'barre' },
        h('button', { class: 'bouton-discret', type: 'button', 'aria-label': 'Quitter', onclick: quitter }, icone('fermer')),
        h('div', { class: `progression progression--${matiere}` }, points),
        etoiles,
      ),
      zone,
      bonus,
    ),
  );

  const typeSuivant = creerTirage(matiere);
  let justes = 0;

  for (let i = 0; i < nombre; i++) {
    points[i].classList.add('progression__point--actuel');
    const type = typeSuivant();
    const question = fabriquerQuestion(type, session.dejaVues);

    const resultat = await Promise.race([
      poserQuestion(zone, question, {
        surReponse: (juste) => {
          const gain = recompenser(session, juste);
          if (gain.etoiles > 0) {
            compteur.textContent = session.etoiles;
            animer(etoiles, 'rebond');
          }
          if (gain.bonus) {
            sons.bonus();
            bonus.textContent = `Série de ${session.serie} ! +${CONFIG.etoiles.bonusSerie}`;
            animer(bonus, 'bonus--visible');
          }
        },
      }),
      quitte,
    ]);
    if (resultat === QUITTE) return { quitte: true };

    progression.enregistrerReponse(type.id, { ...resultat, question });
    journal.enregistrerReponse(matiere, resultat.juste);
    if (resultat.juste) justes += 1;

    points[i].classList.replace('progression__point--actuel', 'progression__point--fait');
  }

  session.resultats[matiere].justes += justes;
  session.resultats[matiere].total += nombre;
  return { justes, total: nombre };
}
