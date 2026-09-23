/**
 * Point d'entrée : charge les données puis enchaîne accueil → session, sans fin.
 */
import { afficher } from './ecrans/afficher.js';
import { ecranAccueil } from './ecrans/accueil.js';
import { ecranMessage } from './ecrans/message.js';
import { chargerDonnees } from './moteur/donnees.js';
import { jouerSession } from './parcours.js';

async function demarrer() {
  try {
    await chargerDonnees();
  } catch (erreur) {
    console.error(erreur);
    await afficher(ecranMessage, {
      titre: 'Oups, un souci de chargement',
      texte: erreur.message,
      actions: [{ libelle: 'Réessayer', valeur: true }],
    });
    location.reload();
    return;
  }

  for (;;) {
    await afficher(ecranAccueil);
    await jouerSession();
  }
}

demarrer();
