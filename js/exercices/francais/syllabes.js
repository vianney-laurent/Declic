/**
 * Compter les syllabes d'un mot entendu.
 * Données : data/francais/syllabes.json — le mot et son découpage oral.
 * Niveau 1 : mots de 1 ou 2 syllabes
 * Niveau 2 : mots de 2 ou 3 syllabes
 * Niveau 3 : mots de 3 ou 4 syllabes
 */
import { choisir } from '../outils.js';

const SYLLABES_PAR_NIVEAU = { 1: [1, 2], 2: [2, 3], 3: [3, 4] };

export default {
  id: 'syllabes',
  matiere: 'francais',
  titre: 'Compter les syllabes',
  donnees: 'syllabes',

  generer({ niveau, donnees }) {
    const [min, max] = SYLLABES_PAR_NIVEAU[niveau];
    const candidats = donnees.filter((d) => d.syllabes.length >= min && d.syllabes.length <= max);
    const { mot, syllabes } = choisir(candidats);
    const nombre = syllabes.length;

    return {
      consigne: 'Combien de syllabes ?',
      lecture: `Combien de syllabes dans ${mot} ?`,
      visuel: { type: 'mot', texte: mot },
      reponse: { mode: 'choix', options: [1, 2, 3, 4], attendu: nombre },
      explication: {
        texte: `${syllabes.join(' · ')} : ${nombre} syllabe${nombre > 1 ? 's' : ''}`,
        lecture: `${syllabes.join(', ')}. ${nombre} syllabe${nombre > 1 ? 's' : ''}.`,
        visuel: { type: 'mot', texte: mot, syllabes },
      },
      resume: mot,
    };
  },
};
