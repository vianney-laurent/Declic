/**
 * Multiplications : tables de 2 et de 10.
 * Niveau 1 : des paquets à compter (3 paquets de 2), jusqu'à 5 paquets
 * Niveau 2 : le calcul seul (7 × 2), jusqu'à 10
 * Niveau 3 : le calcul ou le nombre qui manque (? × 2 = 14)
 * Pour ajouter une table (5 par exemple) : l'ajouter à TABLES.
 */
import { choisir, entier } from '../outils.js';

const TABLES = [2, 10];

/** 3 paquets de 2 → des points ; 3 paquets de 10 → des barres de dix. */
function paquets(n, table) {
  return table === 10 ? { type: 'cubes', groupes: [n * 10] } : { type: 'paquets', paquets: n, taille: table };
}

/** Une phrase courte qui relie la multiplication à ce que l'enfant connaît déjà. */
function explication(n, table) {
  const resultat = n * table;
  let texte = `${n} × ${table} = ${resultat}`;
  if (table === 10) texte = `${n} × 10, c'est ${n} dizaine${n > 1 ? 's' : ''} : ${resultat}`;
  else if (n <= 5) texte = `${n} × ${table} = ${Array(n).fill(table).join(' + ')} = ${resultat}`;
  else if (table === 2) texte = `${n} × 2, c'est le double de ${n} : ${resultat}`;
  return { texte, visuel: paquets(n, table) };
}

function compterLesPaquets(n, table) {
  return {
    consigne: 'Combien en tout ?',
    lecture: `${n} paquets de ${table}. Combien en tout ?`,
    visuel: paquets(n, table),
    reponse: { mode: 'pave', attendu: n * table },
    explication: explication(n, table),
    resume: `${n} × ${table}`,
  };
}

function calcul(n, table) {
  return {
    consigne: 'Calcule.',
    lecture: `Combien font ${n} × ${table} ?`,
    visuel: { type: 'equation', parties: [n, '×', table, '=', '?'] },
    reponse: { mode: 'pave', attendu: n * table },
    explication: explication(n, table),
    resume: `${n} × ${table}`,
  };
}

function nombreQuiManque(n, table) {
  return {
    consigne: 'Quel nombre manque ?',
    lecture: `Combien de fois ${table} pour faire ${n * table} ?`,
    visuel: { type: 'equation', parties: ['?', '×', table, '=', n * table] },
    reponse: { mode: 'pave', attendu: n },
    explication: explication(n, table),
    resume: `? × ${table} = ${n * table}`,
  };
}

export default {
  id: 'multiplication',
  matiere: 'maths',
  titre: 'Multiplications (tables de 2 et 10)',

  generer({ niveau }) {
    const table = choisir(TABLES);
    if (niveau === 1) return compterLesPaquets(entier(2, 5), table);
    if (niveau === 2) return calcul(entier(1, 10), table);
    return choisir([calcul, nombreQuiManque])(entier(2, 10), table);
  },
};
