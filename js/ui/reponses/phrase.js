/**
 * Réponse en touchant un mot dans une phrase (ex. : « Touche le verbe. »).
 * options : les mots de la phrase, dans l'ordre (ponctuation comprise).
 * attendu : le mot à toucher, tel qu'il apparaît dans options.
 * La phrase peut contenir deux fois le même mot : on repère le mot touché par sa position.
 */
import { h } from '../dom.js';

export default {
  monter(zone, reponse, repondre) {
    let indexTouche = -1;
    const mots = reponse.options.map((mot, i) =>
      h('button', { class: 'mot-a-toucher', type: 'button', onclick: () => toucher(i) }, mot),
    );
    zone.append(h('div', { class: 'phrase-a-toucher' }, mots));

    function toucher(i) {
      indexTouche = i;
      mots.forEach((m) => (m.disabled = true));
      repondre(reponse.options[i]);
    }

    return {
      reveler(juste) {
        const indexAttendu = reponse.options.indexOf(reponse.attendu);
        mots.forEach((mot, i) => {
          if (i === indexAttendu) mot.classList.add(juste ? 'mot-a-toucher--juste' : 'mot-a-toucher--bon');
          else if (i === indexTouche) mot.classList.add('mot-a-toucher--choisi');
        });
      },
    };
  },
};
