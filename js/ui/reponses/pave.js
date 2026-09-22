/**
 * Réponse par pavé numérique géant (jamais le clavier système).
 * Au clavier d'ordinateur : chiffres, Retour arrière et Entrée fonctionnent aussi.
 */
import { h } from '../dom.js';
import { icone } from '../icones.js';

const CHIFFRES_MAX = 3;

export default {
  monter(zone, reponse, repondre) {
    let saisie = '';
    let termine = false;

    const ecran = h('div', { class: 'pave__ecran', 'aria-live': 'polite' });
    const valider = h('button', { class: 'touche touche--valider', type: 'button', 'aria-label': 'Valider', onclick: envoyer }, icone('valider'));
    const touches = [
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(toucheChiffre),
      h('button', { class: 'touche touche--effacer', type: 'button', 'aria-label': 'Effacer', onclick: effacer }, icone('effacer')),
      toucheChiffre(0),
      valider,
    ];
    zone.append(h('div', { class: 'pave' }, ecran, h('div', { class: 'pave__touches' }, touches)));
    afficher();

    function toucheChiffre(chiffre) {
      return h('button', { class: 'touche', type: 'button', onclick: () => taper(chiffre) }, chiffre);
    }

    function taper(chiffre) {
      if (termine || saisie.length >= CHIFFRES_MAX) return;
      saisie = saisie === '0' ? String(chiffre) : saisie + chiffre;
      afficher();
    }

    function effacer() {
      if (termine) return;
      saisie = saisie.slice(0, -1);
      afficher();
    }

    function envoyer() {
      if (termine || saisie === '') return;
      termine = true;
      document.removeEventListener('keydown', clavier);
      touches.forEach((t) => (t.disabled = true));
      repondre(Number(saisie));
    }

    function afficher() {
      ecran.textContent = saisie || '?';
      ecran.classList.toggle('pave__ecran--vide', saisie === '');
      valider.disabled = saisie === '';
    }

    function clavier(evenement) {
      if (!zone.isConnected) return document.removeEventListener('keydown', clavier);
      if (/^\d$/.test(evenement.key)) taper(Number(evenement.key));
      else if (evenement.key === 'Backspace') effacer();
      else if (evenement.key === 'Enter') envoyer();
    }
    document.addEventListener('keydown', clavier);

    return {
      reveler(juste) {
        if (juste) {
          ecran.classList.add('pave__ecran--juste');
        } else {
          ecran.replaceChildren(
            h('span', { class: 'pave__donne' }, saisie),
            h('span', { class: 'pave__attendu' }, reponse.attendu),
          );
        }
      },
    };
  },
};
