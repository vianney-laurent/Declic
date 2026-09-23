# Ajouter des exercices

Il y a deux façons de faire évoluer l'application :

- **ajouter des items** (mots, phrases…) à un type de français existant : on modifie un fichier JSON, sans coder ;
- **ajouter un nouveau type d'exercice** : on crée un fichier JavaScript et on l'enregistre.

Dans les deux cas, lancez ensuite `npm test` : le test génère des centaines de questions pour chaque type et chaque niveau, et signale tout problème (bonne réponse absente des choix, consigne trop longue, JSON invalide…).

---

## 1. Ajouter des items de français (sans coder)

Les données sont dans `data/francais/`, un fichier par type :

| Fichier                    | Exemple d'item                                                            |
| -------------------------- | ------------------------------------------------------------------------- |
| `sons.json`                | ajouter un mot dans la liste `mots` du son voulu                          |
| `syllabes.json`            | `{ "mot": "tortue", "syllabes": ["tor", "tue"] }`                         |
| `lettres-manquantes.json`  | `{ "trou": "p_mme", "lettre": "o", "pieges": ["a", "u"], "niveau": 1 }`   |
| `dictee.json`              | `{ "mot": "girafe", "pieges": ["giraffe", "jirafe"], "niveau": 2 }`       |
| `un-une.json`              | ajouter le mot dans la liste `un` ou `une` du bon niveau                  |
| `singulier-pluriel.json`   | `{ "singulier": "le loup", "pluriel": "les loups", "niveau": 1 }`         |
| `rimes.json`               | ajouter un mot dans une famille, ou une nouvelle famille                  |

Règles simples :

- `niveau` vaut 1, 2 ou 3 (1 si absent). Chaque niveau pioche en priorité dans ses propres items.
- Les `pieges` sont les mauvaises réponses proposées : ils doivent être plausibles mais faux.
- Syllabes : on découpe **à l'oral**. Mieux vaut éviter les mots terminés par un « e » muet (« lune » : 1 ou 2 ?).
- Sons : un mot ne doit pas contenir le son d'une autre liste s'il risque de servir de piège ambigu. Le test vérifie que chaque mot contient bien une écriture de son son.

---

## 2. Ajouter un nouveau type d'exercice

### Étape 1 — créer le fichier

Dans `js/exercices/maths/` ou `js/exercices/francais/`. Exemple complet, `js/exercices/maths/dizaines-unites.js` :

```js
/**
 * Dizaines et unités : combien de dizaines dans 47 ?
 * Niveau 1 : jusqu'à 30   Niveau 2 : jusqu'à 60   Niveau 3 : jusqu'à 99
 */
import { entier, nombresProches, optionsAvec } from '../outils.js';

const MAX = { 1: 30, 2: 60, 3: 99 };

export default {
  id: 'dizaines-unites',        // unique, ne plus le changer ensuite (clé de sauvegarde)
  matiere: 'maths',             // 'maths' ou 'francais'
  titre: 'Dizaines et unités',  // affiché dans l'espace parent

  generer({ niveau }) {
    const n = entier(11, MAX[niveau]);
    const dizaines = Math.floor(n / 10);
    return {
      consigne: `Combien de dizaines dans ${n} ?`,       // 8 mots maximum
      visuel: { type: 'cubes', groupes: [n] },
      reponse: {
        mode: 'choix',
        options: optionsAvec(dizaines, nombresProches(dizaines, 9), 3),
        attendu: dizaines,
      },
      explication: {
        texte: `${n}, c'est ${dizaines} dizaines et ${n % 10} unités.`,
        visuel: { type: 'cubes', groupes: [n] },
      },
      resume: `dizaines de ${n}`,  // identifie la question (répétitions, erreurs fréquentes)
    };
  },
};
```

### Étape 2 — l'enregistrer

Dans `js/exercices/registre.js`, ajouter l'import et l'entrée dans la liste `TYPES` :

```js
import dizainesUnites from './maths/dizaines-unites.js';

export const TYPES = [
  // …
  dizainesUnites,
];
```

C'est tout : le type entre dans le tirage des sessions, avec sa propre difficulté adaptative.

### Étape 3 — vérifier

```bash
npm test     # génère 300 questions par niveau et contrôle leur forme
npm start    # ouvre l'application sur http://localhost:8080
```

---

## Mémo

**Ce que reçoit `generer`** : `{ niveau, donnees }`. `donnees` est le contenu du fichier JSON si le type déclare `donnees: 'nom-du-fichier'`.

**Outils de `js/exercices/outils.js`** :

| Outil                                  | Rôle                                                        |
| -------------------------------------- | ----------------------------------------------------------- |
| `entier(min, max)`                     | entier au hasard, bornes incluses                           |
| `choisir(liste)` / `tirer(liste, n)`   | un élément / n éléments distincts au hasard                 |
| `melanger(liste)`                      | copie mélangée                                              |
| `optionsAvec(bonne, pieges, total)`    | choix mélangés : la bonne réponse + des pièges distincts    |
| `nombresProches(n)`                    | pièges numériques crédibles (±1, ±2, ±10, chiffres inversés) |
| `itemsDuNiveau(items, niveau)`         | filtre les items JSON selon leur champ `niveau`             |
| `illustrerNombres([7, 5], '+')`        | points jusqu'à 20, cubes au-delà                            |

**Modes de réponse** (`js/ui/reponses/`) : `choix` (2 à 4 gros boutons), `pave` (pavé numérique, réponse entière).

**Visuels** (`js/ui/visuels.js`, liste détaillée en haut du fichier) :
`equation`, `suite`, `mot` (avec `_` pour un trou, `syllabes`, `surligne`), `son`, `ecoute`, `points`, `cubes`, `droite`.

**Texte lu à voix haute** : par défaut la consigne. Ajouter `lecture` pour lire autre chose (le mot à écrire d'une dictée, par exemple). Les signes `+ − = < >` sont lus en toutes lettres automatiquement.
