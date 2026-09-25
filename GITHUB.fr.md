# Publier sur GitHub

[English](GITHUB.md) · [Deutsch](GITHUB.de.md) · **Français** · [日本語](GITHUB.ja.md)

Ce guide mène le projet du fichier ZIP à un dépôt publié avec une version installable via HACS.

## 1. Créer le dépôt

Sur https://github.com/new, saisir :

| Champ | Valeur |
|---|---|
| Repository name | `Heatpump-Flow-Card-by-Lutarym` |
| Description | Animated plant diagram for Panasonic Aquarea heat pumps via HeishaMon |
| Visibilité | Public |
| Add a README file | ne pas cocher |
| Add .gitignore | ne pas cocher |
| Choose a license | ne pas cocher |

Le nom peut différer de celui du fichier, car `hacs.json` indique à HACS quel fichier utiliser grâce à l'entrée `filename`. Les trois cases restent vides, car le README, la licence et .gitignore font déjà partie du projet.

## 2. Téléverser

Dans le dossier décompressé, là où se trouve `README.md` :

```bash
git init
git branch -M main
git add .
git commit -m "v3.0.0"
git remote add origin https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym.git
git push -u origin main
```

Si Git demande des identifiants, le mot de passe est un jeton d'accès personnel, et non votre mot de passe GitHub. Il se trouve sous Settings, Developer settings, Personal access tokens. Le jeton a besoin de la portée `repo`.

## 3. Capture d'écran

Placer une image de la carte par langue dans `docs/` : `screenshot-en.png`, `screenshot-de.png`, `screenshot-fr.png` et `screenshot-ja.png`. Chaque README affiche l'image dans sa langue. Changer la langue de la carte avec l'option `language` avant chaque capture.

## 4. Topics

Sur la page du dépôt, l'engrenage à côté de **About**, puis sous **Topics** :

```
home-assistant  lovelace  lovelace-card  hacs  heishamon  panasonic-aquarea  heatpump
```

Les topics `home-assistant` et `lovelace` sont nécessaires pour une inclusion ultérieure dans le catalogue officiel de HACS.

## 5. Version publiée

HACS reconnaît les versions grâce aux versions publiées. Un tag seul ne suffit pas.

```bash
git tag v3.0.0
git push origin v3.0.0
```

Ensuite, sur GitHub sous **Releases**, **Draft a new release**, choisir le tag `v3.0.0`, le titre `v3.0.0` et une description comme :

```markdown
First public release. See CHANGELOG.md for all changes.
```

## 6. Ajouter à HACS

1. Ouvrir HACS, menu à trois points, Dépôts personnalisés
2. Dépôt : `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, catégorie : **Dashboard**
3. Rechercher la carte et la télécharger

HACS enregistre la ressource automatiquement. Recharger ensuite le navigateur sans cache.

## Mises à jour ultérieures

```bash
git add .
git commit -m "vX.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

Créer ensuite une nouvelle version publiée pour ce tag. La version dans `CARD_VERSION` en haut de `dist/heatpump-flow-card-by-lutarym.js` et le tag doivent correspondre.

## Catalogue officiel HACS

Facultatif, pour que d'autres trouvent la carte sans dépôt personnalisé. HACS effectue des vérifications automatiques, notamment l'action GitHub de HACS, au moins une version publiée complète et des images dans le README. Les captures dans `docs/` couvrent ce dernier point. Conditions et procédure : https://www.hacs.xyz/docs/publish/include/

## Structure du projet

```
Heatpump-Flow-Card-by-Lutarym/
├── dist/
│   └── heatpump-flow-card-by-lutarym.js
├── docs/
│   └── screenshot-en.png, screenshot-de.png, screenshot-fr.png, screenshot-ja.png
├── hacs.json
├── README.md, README.de.md, README.fr.md, README.ja.md
├── GITHUB.md, GITHUB.de.md, GITHUB.fr.md, GITHUB.ja.md
├── CHANGELOG.md
├── LICENSE
├── .github/workflows/validate.yml
├── .gitattributes
└── .gitignore
```

La licence est la GNU GPL v3.0.
