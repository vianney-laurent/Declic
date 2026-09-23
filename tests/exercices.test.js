/**
 * Vérifie tous les types d'exercices : pour chaque type et chaque niveau,
 * on génère beaucoup de questions et on contrôle leur forme.
 * Lancer : npm test
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TYPES, fichiersDeDonnees } from '../js/exercices/registre.js';
import { MODES } from '../js/ui/reponses/index.js';

const ESSAIS = 300;
const MOTS_MAX_CONSIGNE = 8;

const donnees = Object.fromEntries(
  fichiersDeDonnees().map((nom) => [
    nom,
    JSON.parse(readFileSync(new URL(`../data/francais/${nom}.json`, import.meta.url), 'utf8')),
  ]),
);

function verifierQuestion(q) {
  assert.ok(q.consigne, 'consigne manquante');
  const mots = q.consigne.split(/\s+/).filter((m) => /\p{L}|\d/u.test(m));
  assert.ok(mots.length <= MOTS_MAX_CONSIGNE, `consigne trop longue : "${q.consigne}"`);

  const { mode, attendu, options } = q.reponse ?? {};
  assert.ok(MODES[mode], `mode de réponse inconnu : ${mode}`);
  assert.ok(attendu !== undefined && attendu !== null && attendu !== '', 'réponse attendue manquante');

  if (mode === 'choix') {
    assert.ok(options.length >= 2 && options.length <= 4, `2 à 4 options attendues : ${options}`);
    assert.equal(new Set(options).size, options.length, `options en double : ${options}`);
    assert.ok(options.includes(attendu), `la bonne réponse ${attendu} n'est pas dans ${options}`);
  }
  if (mode === 'pave') {
    assert.ok(Number.isInteger(attendu) && attendu >= 0 && attendu <= 999, `nombre invalide : ${attendu}`);
  }

  assert.ok(q.explication?.texte, 'explication manquante');
  assert.ok(q.resume, 'resume manquant');
}

for (const type of TYPES) {
  for (const niveau of [1, 2, 3]) {
    test(`${type.id} — niveau ${niveau}`, () => {
      for (let i = 0; i < ESSAIS; i++) {
        const question = type.generer({ niveau, donnees: donnees[type.donnees] });
        try {
          verifierQuestion(question);
        } catch (erreur) {
          erreur.message += `\n  question : ${JSON.stringify(question)}`;
          throw erreur;
        }
      }
    });
  }
}

test('sons.json : chaque mot contient une écriture de son son', () => {
  for (const son of donnees.sons) {
    for (const mot of son.mots) {
      assert.ok(son.graphies.some((g) => mot.includes(g)), `« ${mot} » ne contient pas ${son.graphies}`);
    }
    assert.ok(!son.mots.includes(son.exemple), `l'exemple ${son.exemple} ne doit pas être une réponse`);
  }
});

test('lettres-manquantes.json : un seul trou par mot', () => {
  for (const item of donnees['lettres-manquantes']) {
    assert.equal(item.trou.split('_').length, 2, `« ${item.trou} » doit avoir un seul _`);
  }
});

test('syllabes.json : le découpage recompose le mot', () => {
  for (const { mot, syllabes } of donnees.syllabes) {
    assert.equal(syllabes.join(''), mot, `découpage incorrect pour « ${mot} »`);
  }
});
