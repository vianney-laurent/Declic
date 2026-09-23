/**
 * Lecture à voix haute (Web Speech API, voix française).
 */
import { CONFIG } from '../config.js';

const synthese = window.speechSynthesis;
let voixFrancaise = null;

/** Choisit la meilleure voix française disponible (les listes arrivent parfois en retard). */
function choisirVoix() {
  const voix = synthese?.getVoices() ?? [];
  const francaises = voix.filter((v) => v.lang.replace('_', '-').startsWith('fr'));
  voixFrancaise =
    francaises.find((v) => v.lang === CONFIG.voix.langue && v.localService) ??
    francaises.find((v) => v.lang === CONFIG.voix.langue) ??
    francaises[0] ??
    null;
}

if (synthese) {
  choisirVoix();
  synthese.addEventListener?.('voiceschanged', choisirVoix);
}

/** Rend lisibles les symboles mathématiques. */
function prononcable(texte) {
  return texte
    .replace(/\s\+\s/g, ' plus ')
    .replace(/\s[−-]\s/g, ' moins ')
    .replace(/\s=\s/g, ' égale ')
    .replace(/\s×\s/g, ' fois ')
    .replace(/\s<\s/g, ' plus petit que ')
    .replace(/\s>\s/g, ' plus grand que ')
    .replace(/[«»·→_]/g, ' ');
}

/** Lit un texte (interrompt la lecture en cours). */
export function lire(texte) {
  if (!synthese || !texte) return;
  synthese.cancel();
  const enonce = new SpeechSynthesisUtterance(prononcable(texte));
  enonce.lang = CONFIG.voix.langue;
  enonce.rate = CONFIG.voix.vitesse;
  if (voixFrancaise) enonce.voice = voixFrancaise;
  synthese.speak(enonce);
}

export function arreterLecture() {
  synthese?.cancel();
}
