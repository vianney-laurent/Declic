/**
 * DÉROULÉ D'UNE SESSION
 *
 * Pour chaque tour (2 au maximum) :
 *   1. bloc de français (5 questions)
 *      → moins de 4 justes : 3 questions de rattrapage, puis déblocage quand même
 *   2. « Maths débloquées »
 *   3. bloc de maths (8 questions)
 * Puis l'écran de fin. L'enfant peut s'arrêter après le premier tour.
 */
import { CONFIG } from './config.js';
import { ecranBloc } from './ecrans/bloc.js';
import { afficher } from './ecrans/afficher.js';
import { ecranFin } from './ecrans/fin.js';
import { ecranMessage } from './ecrans/message.js';
import { terminerTour } from './moteur/journal.js';
import { sons } from './ui/sons.js';

function nouvelleSession() {
  return {
    etoiles: 0, // gagnées pendant la session
    serie: 0, // bonnes réponses d'affilée
    dejaVues: new Set(), // pour ne pas reposer la même question
    resultats: {
      francais: { justes: 0, total: 0 },
      maths: { justes: 0, total: 0 },
    },
  };
}

/** Joue une session complète. Se termine si l'enfant quitte en cours de route. */
export async function jouerSession() {
  const session = nouvelleSession();

  for (let tour = 1; tour <= CONFIG.toursParSession; tour++) {
    const termine = await jouerTour(session);
    if (!termine) return;
    terminerTour();

    const dernierTour = tour === CONFIG.toursParSession;
    if (!dernierTour && !(await proposerUnAutreTour(session))) break;
  }

  await afficher(ecranFin, { session });
}

/** @returns {Promise<boolean>} false si l'enfant a quitté */
async function jouerTour(session) {
  const { francais, maths } = CONFIG;

  const blocFrancais = await afficher(ecranBloc, { session, matiere: 'francais', nombre: francais.questions });
  if (blocFrancais.quitte) return false;

  if (blocFrancais.justes < francais.seuilDeblocage) {
    await afficher(ecranMessage, {
      titre: `Encore ${francais.rattrapage} questions`,
      texte: 'Et les maths seront débloquées.',
      actions: [{ libelle: "D'accord", valeur: true }],
    });
    const rattrapage = await afficher(ecranBloc, { session, matiere: 'francais', nombre: francais.rattrapage });
    if (rattrapage.quitte) return false;
  }

  await afficher(ecranMessage, {
    titre: 'Maths débloquées !',
    icone: 'cadenas',
    animation: 'ouverture',
    son: sons.deblocage,
    actions: [{ libelle: 'On y va', valeur: true }],
  });

  const blocMaths = await afficher(ecranBloc, { session, matiere: 'maths', nombre: maths.questions });
  return !blocMaths.quitte;
}

function proposerUnAutreTour(session) {
  return afficher(ecranMessage, {
    titre: 'Premier tour terminé !',
    texte: `Tu as déjà ${session.etoiles} étoiles.`,
    actions: [
      { libelle: 'Encore un tour', valeur: true },
      { libelle: "J'ai fini", valeur: false, secondaire: true },
    ],
  });
}
