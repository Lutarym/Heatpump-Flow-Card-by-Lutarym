# Développement

**Français** · [English](ENTWICKLUNG.md) · [Deutsch](ENTWICKLUNG.de.md) · [日本語](ENTWICKLUNG.ja.md)

Rien de tout cela n'est nécessaire pour l'installation via HACS. HACS ne charge que les fichiers finaux de `dist` : `heatpump-flow-card-by-lutarym.js`, l'aide `heatpump-flow-card-by-lutarym-hilfe.js`, que la carte charge en cas de besoin, et le dossier `Profile` avec les profils d'appareil.

## Structure

Le code se trouve dans des modules sous `src/`. Le fichier unique de `dist/` est construit à partir d'eux.

| Fichier | Contenu |
|---|---|
| `src/index.js` | Point d'entrée, enregistre la carte et l'éditeur dans Home Assistant |
| `src/konstanten.js` | Version, grille de dessin, échelles de couleur, durées |
| `src/texte.js` | Tous les textes en quatre langues |
| `src/sprachen.js` | Packs de langue personnels |
| `src/hilfe-daten.js` | Contenu de la fenêtre d'aide |
| `src/hilfsfunktionen.js` | Lecture des états, format des nombres, couleurs |
| `src/namen.js` | Liste des noms (TOP, XTOP, OPT, SET, EXT), types d'entité autorisés, unités, conversion des anciens noms de champ |
| `src/erkennung.js` | Détection des entités au moyen des profils d'appareil |
| `src/profile.js` | Chargement et vérification des profils d'appareil, profils personnels, profils depuis GitHub |
| `src/felder.js` | Champs de la carte et configuration par défaut |
| `src/karte/` | La carte, répartie par domaine (graphique, porte, fenêtres, aide, historique, graphiques, courbe de chauffe, démo, style) |
| `src/editor/` | L'éditeur (utilisation, import et export, style) |

## Construire

Node.js est nécessaire.

```
npm install
npm run build
```

`npm run watch` reconstruit à chaque modification.

Avant la construction, `scripts/profile.mjs` vérifie tous les fichiers de `dist/Profile` et écrit `dist/Profile/liste.json`. Si un profil est erroné, la construction s'arrête, voir [profils d'appareil](GERAETEPROFIL.fr.md#ajouter-un-profil-au-dossier).

## Important

- Reconstruire après chaque modification dans `src/` ou `dist/Profile` et publier aussi `dist/`, y compris `dist/Profile/liste.json`. HACS ne lit que `dist/`.
- Le numéro de version se trouve dans `src/konstanten.js` et dans `package.json`.
