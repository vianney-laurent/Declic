/**
 * Réglages généraux de l'application.
 * Tout ce qui peut être ajusté sans toucher à la logique est ici.
 */
export const CONFIG = {
  prenom: 'Auguste',

  /** Une session = au plus ce nombre de tours (français puis maths). */
  toursParSession: 2,

  francais: {
    questions: 5,
    /** Nombre de bonnes réponses pour débloquer les maths directement. */
    seuilDeblocage: 4,
    /** Questions en plus si le seuil n'est pas atteint (déblocage ensuite). */
    rattrapage: 3,
  },

  maths: {
    questions: 8,
  },

  /** Difficulté adaptative, calculée type par type. */
  adaptatif: {
    niveauMax: 3,
    fenetre: 10, // on regarde les 10 dernières réponses du type
    seuilMonter: 0.8, // ≥ 80 % → niveau supérieur
    seuilDescendre: 0.5, // < 50 % → niveau inférieur
    /** Montée rapide : ce nombre de bonnes réponses d'affilée suffit pour monter. */
    monteeRapide: 6,
    /** Poids en plus pour un type raté à 100 % (1 = revient 2× plus souvent). */
    poidsEchec: 1,
  },

  etoiles: {
    parBonneReponse: 1,
    serie: 5, // toutes les 5 bonnes réponses d'affilée…
    bonusSerie: 2, // …2 étoiles en plus
  },

  /** Durées en millisecondes. */
  delais: {
    apresBonneReponse: 900,
  },

  voix: {
    langue: 'fr-FR',
    vitesse: 0.9,
  },
};
