/**
 * Petits sons doux, synthétisés (aucun fichier audio à charger).
 */
let contexte = null;

function audio() {
  contexte ??= new (window.AudioContext || window.webkitAudioContext)();
  if (contexte.state === 'suspended') contexte.resume();
  return contexte;
}

/** Joue une suite de notes (fréquences en Hz), comme un petit carillon. */
function jouerNotes(frequences, { ecart = 0.09, duree = 0.35, volume = 0.12 } = {}) {
  try {
    const ctx = audio();
    frequences.forEach((frequence, i) => {
      const debut = ctx.currentTime + i * ecart;
      const oscillateur = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillateur.type = 'sine';
      oscillateur.frequency.value = frequence;
      gain.gain.setValueAtTime(0, debut);
      gain.gain.linearRampToValueAtTime(volume, debut + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, debut + duree);
      oscillateur.connect(gain).connect(ctx.destination);
      oscillateur.start(debut);
      oscillateur.stop(debut + duree);
    });
  } catch {
    // Pas de son disponible : ce n'est pas grave.
  }
}

export const sons = {
  bonneReponse: () => jouerNotes([659, 880]),
  bonus: () => jouerNotes([659, 784, 988, 1319], { ecart: 0.08 }),
  deblocage: () => jouerNotes([523, 659, 784, 1047], { ecart: 0.12, duree: 0.6 }),
  /** À appeler lors d'un premier toucher : les navigateurs exigent un geste pour le son. */
  preparer: () => audio(),
};
