/**
 * Lire l'heure sur une horloge à aiguilles.
 * Niveau 1 : heures pile (3 h)
 * Niveau 2 : heures et demie (3 h 30)
 * Niveau 3 : quarts d'heure (3 h 15, 3 h 45)
 */
import { choisir, entier, optionsAvec } from '../outils.js';

const MINUTES = { 1: [0], 2: [0, 30, 30], 3: [15, 45, 30] };

/** 3 h, 3 h 30… (affichage). */
function ecrire(heures, minutes) {
  return minutes === 0 ? `${heures} h` : `${heures} h ${minutes}`;
}

/** 3 heures, 3 heures 30… (lecture à voix haute). */
function dire(heures, minutes) {
  const h = `${heures} heure${heures > 1 ? 's' : ''}`;
  return minutes === 0 ? h : `${h} ${minutes}`;
}

/** L'heure suivante ou précédente sur le cadran (12 → 1, 1 → 12). */
function suivante(heures) {
  return (heures % 12) + 1;
}

function precedente(heures) {
  return ((heures + 10) % 12) + 1;
}

/**
 * Erreurs de lecture fréquentes, adaptées à ce que l'enfant sait déjà lire :
 * - l'heure d'à côté (la petite aiguille est entre deux chiffres) ;
 * - heure pile : lire la grande aiguille (12 h) ;
 * - demie : oublier les 30 minutes ;
 * - quarts : confondre « et quart » et « moins le quart ».
 */
function pieges(heures, minutes) {
  const autres = [ecrire(suivante(heures), minutes), ecrire(precedente(heures), minutes)];
  if (minutes === 0) autres.push('12 h');
  if (minutes === 30) autres.push(ecrire(heures, 0));
  if (minutes === 15 || minutes === 45) autres.push(ecrire(heures, 60 - minutes));
  return autres.filter((p) => p !== ecrire(heures, minutes));
}

export default {
  id: 'heure',
  matiere: 'maths',
  titre: "Lire l'heure",

  generer({ niveau }) {
    const heures = entier(1, 12);
    const minutes = choisir(MINUTES[niveau]);
    const bonne = ecrire(heures, minutes);
    return {
      consigne: 'Quelle heure est-il ?',
      visuel: { type: 'horloge', heures, minutes },
      reponse: { mode: 'choix', options: optionsAvec(bonne, pieges(heures, minutes), 3), attendu: bonne },
      explication: {
        texte: `La petite aiguille montre l'heure, la grande les minutes : ${bonne}.`,
        lecture: `La petite aiguille montre l'heure, la grande les minutes. Il est ${dire(heures, minutes)}.`,
        visuel: { type: 'horloge', heures, minutes },
      },
      resume: bonne,
    };
  },
};
