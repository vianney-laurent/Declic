/**
 * Typographie française à l'écran : espace insécable avant ? ! : ; et dans les « guillemets »,
 * pour qu'un point d'interrogation ne se retrouve jamais seul sur une ligne.
 */
const INSECABLE = ' ';

export function typographie(texte) {
  return String(texte)
    .replace(/ ([?!:;»])/g, `${INSECABLE}$1`)
    .replace(/« /g, `«${INSECABLE}`);
}
