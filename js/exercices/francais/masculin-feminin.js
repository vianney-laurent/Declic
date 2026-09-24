/**
 * Masculin ou féminin ?
 * Données : data/francais/genre-des-noms.json — des noms masculins et féminins par niveau.
 * Niveau 1 : avec le petit mot (le chat, une pomme)
 * Niveau 2 : le nom tout seul (chaise → féminin)
 * Niveau 3 : accorder un adjectif (une … souris : petit ou petite ?)
 */
import { choisir, itemsDuNiveau, melanger } from '../outils.js';

const ADJECTIFS = [
  { masculin: 'petit', feminin: 'petite' },
  { masculin: 'grand', feminin: 'grande' },
  { masculin: 'joli', feminin: 'jolie' },
  { masculin: 'gros', feminin: 'grosse' },
];

const LIBELLES = { masculin: 'masculin', feminin: 'féminin' };

/** Devant une voyelle ou un h, « le / la » devient « l' » : on garde alors « un / une ». */
function determinant(genre, nom) {
  const elision = /^[aeiouyéèêâîôh]/i.test(nom);
  const articles = genre === 'masculin' ? ['le', 'un'] : ['la', 'une'];
  return elision ? articles[1] : choisir(articles);
}

function indefini(genre) {
  return genre === 'masculin' ? 'un' : 'une';
}

function avecDeterminant(genre, nom) {
  const det = determinant(genre, nom);
  return {
    consigne: 'Masculin ou féminin ?',
    lecture: `Masculin ou féminin ? ${det} ${nom}.`,
    visuel: { type: 'mot', texte: `${det} ${nom}` },
    reponse: { mode: 'choix', options: ['masculin', 'féminin'], attendu: LIBELLES[genre] },
    explication: {
      texte: `« ${det} » : c'est ${LIBELLES[genre]}.`,
      visuel: { type: 'mot', texte: `${det} ${nom}`, surligne: det, position: 0 },
    },
    resume: `${det} ${nom}`,
  };
}

function nomSeul(genre, nom) {
  const det = indefini(genre);
  return {
    consigne: 'Masculin ou féminin ?',
    lecture: `Masculin ou féminin ? ${nom}.`,
    visuel: { type: 'mot', texte: nom },
    reponse: { mode: 'choix', options: ['masculin', 'féminin'], attendu: LIBELLES[genre] },
    explication: {
      texte: `On dit « ${det} ${nom} » : c'est ${LIBELLES[genre]}.`,
      visuel: { type: 'mot', texte: `${det} ${nom}`, surligne: det, position: 0 },
    },
    resume: nom,
  };
}

function accorderAdjectif(genre, nom) {
  const det = indefini(genre);
  const adjectif = choisir(ADJECTIFS);
  const bon = adjectif[genre];
  return {
    consigne: 'Choisis le bon mot.',
    lecture: `${det}, ${nom}. Choisis le bon mot.`,
    visuel: { type: 'mot', texte: `${det} _ ${nom}` },
    reponse: { mode: 'choix', options: melanger([adjectif.masculin, adjectif.feminin]), attendu: bon },
    explication: {
      texte: `« ${nom} » est ${LIBELLES[genre]} : on écrit ${det} ${bon} ${nom}.`,
      visuel: { type: 'mot', texte: `${det} ${bon} ${nom}`, surligne: bon },
    },
    resume: `${det} … ${nom}`,
  };
}

export default {
  id: 'masculin-feminin',
  matiere: 'francais',
  titre: 'Masculin ou féminin',
  donnees: 'genre-des-noms',

  generer({ niveau, donnees }) {
    // Au niveau 3, tous les noms servent pour l'accord de l'adjectif.
    const groupe = niveau === 3 ? choisir(donnees) : choisir(itemsDuNiveau(donnees, niveau));
    const genre = choisir(['masculin', 'feminin']);
    const nom = choisir(groupe[genre]);
    if (niveau === 1) return avecDeterminant(genre, nom);
    if (niveau === 2) return nomSeul(genre, nom);
    return accorderAdjectif(genre, nom);
  },
};
