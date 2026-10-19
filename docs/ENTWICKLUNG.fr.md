# Développement

**Français** · [English](ENTWICKLUNG.md) · [Deutsch](ENTWICKLUNG.de.md) · [日本語](ENTWICKLUNG.ja.md)

Rien de tout cela n'est nécessaire pour l'installation via HACS. HACS ne charge que le fichier final `dist/heatpump-flow-card-by-lutarym.js`.

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
| `src/erkennung.js` | Détection de HeishaMon by Lutarym |
| `src/profile.js` | Profils d'appareil |
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

## Important

- Reconstruire après chaque modification dans `src/` et publier aussi le fichier de `dist/`. HACS ne lit que `dist/`.
- Le numéro de version se trouve dans `src/konstanten.js` et dans `package.json`.
