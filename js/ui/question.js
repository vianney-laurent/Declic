/**
 * Affiche UNE question, attend la réponse et gère le retour :
 * - bonne réponse : son doux + petit rebond, puis on continue tout seul ;
 * - erreur : on montre la bonne réponse et une explication visuelle, puis « Continuer ».
 *
 * Utilisé par l'écran de jeu et, plus tard, par l'aperçu de l'espace parent.
 */
import { CONFIG } from '../config.js';
import { attendre, h } from './dom.js';
import { icone } from './icones.js';
import { MODES, estJuste } from './reponses/index.js';
import { sons } from './sons.js';
import { typographie } from './typographie.js';
import { dessinerVisuel } from './visuels.js';
import { lire } from './voix.js';

/**
 * @param {HTMLElement} zone  élément où dessiner la question
 * @param {object} question   question produite par un type d'exercice
 * @param {object} [options]
 * @param {(juste: boolean) => void} [options.surReponse] appelé dès que l'enfant a répondu
 * @returns {Promise<{ juste: boolean, valeur: any }>}
 */
export async function poserQuestion(zone, question, { surReponse } = {}) {
  const texteLu = question.lecture ?? question.consigne;
  const relire = () => lire(texteLu);

  const zoneReponse = h('div', { class: 'question__reponse' });
  const carte = h(
    'section',
    { class: `question question--${question.reponse.mode}` },
    h(
      'header',
      { class: 'question__consigne' },
      h('h1', {}, typographie(question.consigne)),
      h('button', { class: 'bouton-voix', type: 'button', 'aria-label': 'Écouter la consigne', onclick: relire }, icone('hautParleur')),
    ),
    h('div', { class: 'question__visuel' }, question.visuel && dessinerVisuel(question.visuel, { relire })),
    zoneReponse,
  );
  zone.replaceChildren(carte);

  let repondre;
  const reponseDonnee = new Promise((resoudre) => (repondre = resoudre));
  const controle = MODES[question.reponse.mode].monter(zoneReponse, question.reponse, repondre);
  relire();

  const valeur = await reponseDonnee;
  const juste = estJuste(question.reponse, valeur);
  controle.reveler(juste, valeur);
  surReponse?.(juste);

  if (juste) {
    sons.bonneReponse();
    await attendre(CONFIG.delais.apresBonneReponse);
  } else {
    await montrerExplication(carte, question.explication);
  }
  return { juste, valeur };
}

/** Panneau d'explication après une erreur ; se ferme avec « Continuer ». */
function montrerExplication(carte, explication) {
  return new Promise((resoudre) => {
    const panneau = h(
      'div',
      { class: 'explication' },
      h('p', { class: 'explication__texte' }, typographie(explication.texte)),
      explication.visuel && dessinerVisuel(explication.visuel, { relire: () => lire(explication.texte) }),
      h('button', { class: 'bouton', type: 'button', onclick: resoudre }, 'Continuer'),
    );
    // Un voile clair calme l'arrière-plan pendant l'explication.
    carte.append(h('div', { class: 'voile' }, panneau));
    lire(explication.lecture ?? explication.texte);
  });
}
