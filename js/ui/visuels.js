/**
 * VISUELS DES EXERCICES
 *
 * Une question décrit son illustration par un simple objet, par exemple
 *   { type: 'points', groupes: [7, 5], separateur: '+' }
 * et ce module la dessine. Visuels disponibles :
 *
 *   equation  { parties: [7, '+', 5, '=', '?'] }          '?' = case à trouver
 *   suite     { termes: [2, 4, '?'], sauts?: '+2', surligne?: index }
 *   mot       { texte: 'ch_t', syllabes?: [...], surligne?: 'ou', position?: index }
 *   phrase    { texte: 'Hier, Léo a joué.', surligne?: 'Hier' }  texte plus long, qui revient à la ligne
 *   son       { texte: 'ou' }
 *   ecoute    { texte?: 'maison' }                        gros bouton : relit ce texte (ou la consigne)
 *   points    { groupes: [7, { n: 3, style: 'creux' }], separateur?: '+', continu?: true }
 *             styles : 'plein' (défaut), 'creux', 'barre'
 *   cubes     { groupes: [34, 25], separateur?: '+' }     barres de dix + cubes
 *             un groupe peut aussi être { dizaines: 3, unites: 14 } (unités non regroupées)
 *   paquets   { paquets: 3, taille: 2 }                   3 paquets de 2 points (multiplication)
 *   droite    { debut: 0, fin: 6, etiquettes?: [n…], surligne?: n }
 *
 * Pour ajouter un visuel : écrire une fonction dessinerXxx(spec, contexte)
 * qui renvoie un élément, puis l'ajouter à DESSINS en bas du fichier.
 */
import { h, s } from './dom.js';
import { icone } from './icones.js';
import { lire } from './voix.js';

export function dessinerVisuel(spec, contexte = {}) {
  const dessin = DESSINS[spec.type];
  if (!dessin) throw new Error(`Visuel inconnu : ${spec.type}`);
  return h('div', { class: `visuel visuel--${spec.type}` }, dessin(spec, contexte));
}

// ─── Textes ─────────────────────────────────────────────────────────

function caseVide() {
  return h('span', { class: 'case-vide', 'aria-label': 'à trouver' });
}

function dessinerEquation({ parties }) {
  return h(
    'div',
    { class: 'equation' },
    parties.map((partie) => {
      if (partie === '?') return caseVide();
      const operateur = typeof partie === 'string' && !/\d/.test(partie);
      return h('span', { class: operateur ? 'equation__op' : 'equation__nombre' }, partie);
    }),
  );
}

function dessinerSuite({ termes, sauts, surligne }) {
  const elements = [];
  termes.forEach((terme, i) => {
    if (i > 0) elements.push(h('span', { class: 'suite__saut' }, sauts ?? ''));
    const classe = `suite__terme ${i === surligne ? 'suite__terme--surligne' : ''}`;
    elements.push(terme === '?' ? caseVide() : h('span', { class: classe }, terme));
  });
  return h('div', { class: 'suite' }, elements);
}

/** Découpe un texte en morceaux, en marquant le passage à surligner. */
function morceauxSurlignes(texte, surligne, position) {
  if (!surligne) return [texte];
  const debut = position ?? texte.indexOf(surligne);
  if (debut < 0) return [texte];
  const fin = debut + surligne.length;
  return [texte.slice(0, debut), h('mark', {}, texte.slice(debut, fin)), texte.slice(fin)];
}

function dessinerMot({ texte, syllabes, surligne, position }) {
  if (syllabes) {
    return h('div', { class: 'mot' }, syllabes.map((syl) => h('span', { class: 'syllabe' }, syl)));
  }
  // Le caractère _ devient une case vide.
  const morceaux = morceauxSurlignes(texte, surligne, position).flatMap((morceau) =>
    typeof morceau === 'string'
      ? morceau.split('_').flatMap((bout, i) => (i === 0 ? [bout] : [caseVide(), bout]))
      : [morceau],
  );
  return h('div', { class: 'mot' }, morceaux);
}

function dessinerPhrase({ texte, surligne }) {
  return h('p', { class: 'phrase' }, morceauxSurlignes(texte, surligne));
}

function dessinerSon({ texte }) {
  return h('div', { class: 'son' }, texte);
}

function dessinerEcoute({ texte }, { relire }) {
  const ecouter = texte ? () => lire(texte) : relire;
  return h('button', { class: 'ecoute', type: 'button', 'aria-label': 'Réécouter', onclick: ecouter }, icone('hautParleur'));
}

// ─── Dessins SVG ────────────────────────────────────────────────────

/** Assemble des blocs SVG côte à côte, avec un signe entre chaque bloc. */
function aligner(blocs, separateur) {
  const ESPACE_SIGNE = separateur ? 56 : 28;
  const hauteur = Math.max(...blocs.map((b) => b.hauteur));
  const elements = [];
  let x = 0;

  blocs.forEach((bloc, i) => {
    if (i > 0) {
      if (separateur) {
        elements.push(
          s('text', { x: x + ESPACE_SIGNE / 2, y: hauteur / 2, class: 'svg-signe', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, separateur),
        );
      }
      x += ESPACE_SIGNE;
    }
    elements.push(s('g', { transform: `translate(${x} ${(hauteur - bloc.hauteur) / 2})` }, bloc.contenu));
    x += bloc.largeur;
  });

  return s('svg', { viewBox: `-4 -4 ${x + 8} ${hauteur + 8}`, width: x + 8, class: 'dessin' }, elements);
}

/** Uniformise les groupes : 7 → { n: 7, style: 'plein' }. */
function normaliserGroupes(groupes) {
  return groupes.map((g) => (typeof g === 'number' ? { n: g, style: 'plein' } : { style: 'plein', ...g }));
}

const CELLULE = 36;
const RAYON = 13;

/** Points rangés dans des cadres de 10 (2 lignes de 5), comme à l'école. */
function blocDePoints(points) {
  const cadres = Math.max(1, Math.ceil(points.length / 10));
  const largeur = 5 * CELLULE;
  const hauteurCadre = 2 * CELLULE;
  const ECART = 10;
  const contenu = [];

  for (let c = 0; c < cadres; c++) {
    const y0 = c * (hauteurCadre + ECART);
    contenu.push(s('rect', { x: 0, y: y0, width: largeur, height: hauteurCadre, rx: 14, class: 'svg-cadre' }));
    for (let i = 0; i < 10; i++) {
      const point = points[c * 10 + i];
      const cx = (i % 5) * CELLULE + CELLULE / 2;
      const cy = y0 + Math.floor(i / 5) * CELLULE + CELLULE / 2;
      contenu.push(dessinerPoint(cx, cy, point));
    }
  }
  return { largeur, hauteur: cadres * hauteurCadre + (cadres - 1) * ECART, contenu };
}

function dessinerPoint(cx, cy, point) {
  if (!point) return s('circle', { cx, cy, r: 4, class: 'svg-emplacement' });
  const classe = `svg-point svg-point--${point.style} svg-couleur-${point.couleur}`;
  const cercle = s('circle', { cx, cy, r: RAYON, class: classe });
  if (point.style !== 'barre') return cercle;
  const d = RAYON + 3;
  return s('g', {}, cercle, s('line', { x1: cx - d, y1: cy + d, x2: cx + d, y2: cy - d, class: 'svg-barre' }));
}

function dessinerPoints({ groupes, separateur, continu }) {
  // Chaque groupe a sa couleur (alternée) pour bien voir « 7 et encore 5 ».
  const listes = normaliserGroupes(groupes).map((g, i) =>
    Array.from({ length: g.n }, () => ({ style: g.style, couleur: i % 2 })),
  );
  if (continu) return aligner([blocDePoints(listes.flat())]);
  return aligner(listes.map(blocDePoints), separateur);
}

const CUBE = 18;

/** Uniformise un groupe de cubes : 34 → { dizaines: 3, unites: 4 }. */
function normaliserCubes(groupe) {
  if (typeof groupe !== 'number') return groupe;
  return { dizaines: Math.floor(groupe / 10), unites: groupe % 10 };
}

/** Des barres de dix (dizaines) et des cubes isolés (unités), rangés par colonnes de 5. */
function blocDeCubes({ dizaines, unites }, couleur) {
  const ECART = 8;
  const contenu = [];
  let x = 0;

  for (let d = 0; d < dizaines; d++) {
    contenu.push(s('rect', { x, y: 0, width: CUBE, height: CUBE * 10, rx: 4, class: `svg-cube svg-couleur-${couleur}` }));
    for (let i = 1; i < 10; i++) {
      contenu.push(s('line', { x1: x, y1: i * CUBE, x2: x + CUBE, y2: i * CUBE, class: 'svg-joint' }));
    }
    x += CUBE + ECART;
  }
  // Les unités sont empilées par colonnes de 5, en bas.
  for (let u = 0; u < unites; u++) {
    const colonne = Math.floor(u / 5);
    const ligne = u % 5;
    contenu.push(
      s('rect', {
        x: x + colonne * (CUBE + 4),
        y: CUBE * 10 - (ligne + 1) * (CUBE + 4) + 4,
        width: CUBE,
        height: CUBE,
        rx: 4,
        class: `svg-cube svg-couleur-${couleur}`,
      }),
    );
  }
  const largeur = x + (unites > 0 ? Math.ceil(unites / 5) * (CUBE + 4) : -ECART);
  return { largeur: Math.max(largeur, CUBE), hauteur: CUBE * 10, contenu };
}

function dessinerCubes({ groupes, separateur }) {
  return aligner(groupes.map((g, i) => blocDeCubes(normaliserCubes(g), i % 2)), separateur);
}

/** Des paquets identiques (3 paquets de 2), rangés par lignes de 5 paquets. */
function dessinerPaquets({ paquets, taille }) {
  const PAR_LIGNE = 5;
  const colonnesPoints = Math.min(taille, 5);
  const lignesPoints = Math.ceil(taille / 5);
  const PAS = 44;
  const MARGE = 12;
  const largeurPaquet = colonnesPoints * PAS + 2 * MARGE;
  const hauteurPaquet = lignesPoints * PAS + 2 * MARGE;
  const ECART = 20;
  const contenu = [];

  for (let p = 0; p < paquets; p++) {
    const x0 = (p % PAR_LIGNE) * (largeurPaquet + ECART);
    const y0 = Math.floor(p / PAR_LIGNE) * (hauteurPaquet + ECART);
    contenu.push(s('rect', { x: x0, y: y0, width: largeurPaquet, height: hauteurPaquet, rx: 16, class: 'svg-cadre' }));
    for (let i = 0; i < taille; i++) {
      const cx = x0 + MARGE + (i % 5) * PAS + PAS / 2;
      const cy = y0 + MARGE + Math.floor(i / 5) * PAS + PAS / 2;
      contenu.push(s('circle', { cx, cy, r: 15, class: `svg-point svg-couleur-${p % 2}` }));
    }
  }
  const colonnes = Math.min(paquets, PAR_LIGNE);
  const lignes = Math.ceil(paquets / PAR_LIGNE);
  const largeur = colonnes * largeurPaquet + (colonnes - 1) * ECART;
  const hauteur = lignes * hauteurPaquet + (lignes - 1) * ECART;
  return s('svg', { viewBox: `-4 -4 ${largeur + 8} ${hauteur + 8}`, width: largeur + 8, class: 'dessin' }, contenu);
}

/** Droite graduée avec les nombres sous les graduations. */
function dessinerDroite({ debut, fin, etiquettes = [], surligne }) {
  const PAS = 64;
  const largeur = (fin - debut) * PAS;
  const Y = 30;
  const contenu = [s('line', { x1: -16, y1: Y, x2: largeur + 16, y2: Y, class: 'svg-droite' })];

  for (let n = debut; n <= fin; n++) {
    const x = (n - debut) * PAS;
    const important = etiquettes.includes(n);
    if (n === surligne) contenu.push(s('circle', { cx: x, cy: Y + 44, r: 26, class: 'svg-surligne' }));
    contenu.push(s('line', { x1: x, y1: Y - 12, x2: x, y2: Y + 12, class: 'svg-graduation' }));
    contenu.push(
      s('text', { x, y: Y + 44, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: `svg-nombre ${important ? 'svg-nombre--important' : ''}` }, n),
    );
  }
  return s('svg', { viewBox: `-24 0 ${largeur + 48} 104`, width: largeur + 48, class: 'dessin' }, contenu);
}

const DESSINS = {
  equation: dessinerEquation,
  suite: dessinerSuite,
  mot: dessinerMot,
  phrase: dessinerPhrase,
  son: dessinerSon,
  ecoute: dessinerEcoute,
  points: dessinerPoints,
  cubes: dessinerCubes,
  paquets: dessinerPaquets,
  droite: dessinerDroite,
};
