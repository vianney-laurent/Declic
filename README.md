# Déclic

Application éducative pour Auguste (CE1), 5 à 10 minutes par jour.
Principe : **le français débloque les maths**.

Une session = 2 tours au maximum : 5 questions de français (rattrapage de 3 questions si besoin),
puis « Maths débloquées », puis 8 questions de maths.

## Lancer

Aucune installation : HTML, CSS et JavaScript natifs, sans dépendance ni étape de build.

```bash
npm start   # serveur local sur http://localhost:8080 (ou : python3 -m http.server 8080)
npm test    # vérifie tous les types d'exercices
```

## Organisation

```
index.html                  page unique
css/app.css                 tout le style (variables de couleurs et tailles en haut)
data/francais/*.json        contenu des exercices de français, modifiable sans coder
fonts/                      police Andika (hors-ligne)
js/
  app.js                    démarrage : accueil → session, en boucle
  config.js                 réglages (prénom, nombre de questions, seuils…)
  parcours.js               déroulé d'une session, écrit avec des await
  exercices/
    registre.js             liste des types d'exercices + format d'une question
    outils.js               hasard et aides pour les générateurs
    maths/  francais/       un fichier par type d'exercice
  moteur/                   logique sans affichage
    store.js                sauvegarde localStorage
    progression.js          niveau adaptatif et statistiques par type
    journal.js              jours joués, série, étoiles
    selection.js            choix du type suivant et de la question
    recompenses.js          étoiles et bonus de série
    donnees.js              chargement des JSON
  ui/                       briques d'affichage
    question.js             affiche une question et gère le retour (juste / explication)
    reponses/               modes de réponse : choix, pave, phrase
    visuels.js              illustrations SVG : points, cubes, paquets, droite graduée…
    voix.js  sons.js        lecture à voix haute, petits sons synthétisés
  ecrans/                   accueil, bloc de questions, messages, fin
tests/                      tests automatiques (node --test)
```

Ajouter du contenu ou un type d'exercice : voir [AJOUTER_UN_EXERCICE.md](AJOUTER_UN_EXERCICE.md).
