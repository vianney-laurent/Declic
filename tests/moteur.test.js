/**
 * Tests de la logique sans affichage : niveaux adaptatifs, étoiles, série de jours.
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// Faux localStorage en mémoire, installé avant de charger les modules.
const memoire = new Map();
globalThis.localStorage = {
  getItem: (cle) => memoire.get(cle) ?? null,
  setItem: (cle, valeur) => memoire.set(cle, String(valeur)),
};

const { reinitialiserEtat, modifierEtat } = await import('../js/moteur/store.js');
const progression = await import('../js/moteur/progression.js');
const journal = await import('../js/moteur/journal.js');
const { recompenser } = await import('../js/moteur/recompenses.js');

const question = { resume: 'essai', reponse: { attendu: 1 } };
const repondre = (juste) => progression.enregistrerReponse('essai', { juste, question, valeur: juste ? 1 : 2 });

beforeEach(() => reinitialiserEtat());

test('6 bonnes réponses d\'affilée : montée rapide', () => {
  for (let i = 0; i < 5; i++) assert.equal(repondre(true), 1);
  assert.equal(repondre(true), 2);
});

test('80 % sur 10 réponses : niveau supérieur', () => {
  repondre(false);
  repondre(false);
  for (let i = 0; i < 7; i++) assert.equal(repondre(true), 1);
  assert.equal(repondre(true), 2); // 8/10
});

test('moins de 50 % sur 10 réponses : niveau inférieur', () => {
  progression.definirNiveau('essai', 3);
  for (let i = 0; i < 6; i++) repondre(false);
  for (let i = 0; i < 3; i++) repondre(true);
  assert.equal(repondre(true), 2); // 4/10 = 40 %
});

test('entre 50 % et 80 % : le niveau ne bouge pas', () => {
  for (let i = 0; i < 10; i++) repondre(i % 3 !== 0); // 6/10
  assert.equal(progression.etatType('essai').niveau, 1);
});

test('les erreurs sont gardées pour l\'espace parent', () => {
  repondre(false);
  const [erreur] = progression.etatType('essai').erreurs;
  assert.equal(erreur.resume, 'essai');
  assert.equal(erreur.donne, '2');
});

test('étoiles : 1 par bonne réponse, bonus à la 5e d\'affilée', () => {
  const session = { etoiles: 0, serie: 0 };
  for (let i = 0; i < 4; i++) assert.deepEqual(recompenser(session, true), { etoiles: 1, bonus: false });
  assert.deepEqual(recompenser(session, true), { etoiles: 3, bonus: true });
  recompenser(session, false);
  assert.equal(session.serie, 0);
  assert.equal(session.etoiles, 7);
  assert.equal(journal.totalEtoiles(), 7);
});

test('série de jours consécutifs', () => {
  const ilYA = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return journal.cleDuJour(d);
  };
  modifierEtat((etat) => {
    for (const n of [1, 2, 3, 5]) etat.jours[ilYA(n)] = { tours: 1 };
  });
  assert.equal(journal.serieDeJours(), 3); // hier, avant-hier, il y a 3 jours
  journal.terminerTour();
  assert.equal(journal.serieDeJours(), 4); // + aujourd'hui
});
