/**
 * Chargement des fichiers de données (data/francais/*.json) au démarrage.
 */
import { fichiersDeDonnees } from '../exercices/registre.js';

const cache = {};

export async function chargerDonnees() {
  await Promise.all(
    fichiersDeDonnees().map(async (nom) => {
      const reponse = await fetch(`data/francais/${nom}.json`);
      if (!reponse.ok) throw new Error(`Fichier de données introuvable : ${nom}.json`);
      cache[nom] = await reponse.json();
    }),
  );
}

export function donneesDe(nom) {
  return nom ? cache[nom] : undefined;
}
