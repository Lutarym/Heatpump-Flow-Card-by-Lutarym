# Publishing on GitHub

**English** · [Deutsch](GITHUB.de.md) · [Français](GITHUB.fr.md) · [日本語](GITHUB.ja.md)

This guide takes the project from the ZIP file to a published repository with a release that can be installed through HACS.

## 1. Create the repository

On https://github.com/new enter:

| Field | Value |
|---|---|
| Repository name | `Heatpump-Flow-Card-by-Lutarym` |
| Description | Animated plant diagram for Panasonic Aquarea heat pumps via HeishaMon |
| Visibility | Public |
| Add a README file | leave unchecked |
| Add .gitignore | leave unchecked |
| Choose a license | leave unchecked |

The name may differ from the file name, because `hacs.json` tells HACS which file to use through the entry `filename`. The three boxes stay empty since README, license and .gitignore are already part of the project.

## 2. Upload

In the unpacked folder, where `README.md` is located:

```bash
git init
git branch -M main
git add .
git commit -m "v3.0.0"
git remote add origin https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym.git
git push -u origin main
```

If Git asks for credentials, the password is a personal access token, not your GitHub password. It is found under Settings, Developer settings, Personal access tokens. The token needs the scope `repo`.

## 3. Screenshot

Place one picture of the card per language in `docs/`: `screenshot-en.png`, `screenshot-de.png`, `screenshot-fr.png` and `screenshot-ja.png`. Each README shows the picture in its own language. Switch the card language with the option `language` before taking each picture.

## 4. Topics

On the repository page, the gear next to **About**, then under **Topics**:

```
home-assistant  lovelace  lovelace-card  hacs  heishamon  panasonic-aquarea  heatpump
```

The topics `home-assistant` and `lovelace` are needed for a later inclusion in the default HACS catalogue.

## 5. Release

HACS recognises versions through releases. A tag alone is not enough.

```bash
git tag v3.0.0
git push origin v3.0.0
```

Then on GitHub under **Releases**, **Draft a new release**, choose the tag `v3.0.0`, title `v3.0.0`, and a description such as:

```markdown
First public release. See CHANGELOG.md for all changes.
```

## 6. Add to HACS

1. Open HACS, menu with the three dots, Custom repositories
2. Repository: `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, category: **Dashboard**
3. Search for the card and download it

HACS registers the resource automatically. Reload the browser without cache afterwards.

## Later updates

```bash
git add .
git commit -m "vX.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

Then create a new release for this tag. The version in `CARD_VERSION` at the top of `dist/heatpump-flow-card-by-lutarym.js` and the tag should match.

## Default HACS catalogue

Optional, so that others find the card without adding a custom repository. HACS runs automated checks, among them the HACS GitHub action, at least one full release and images in the README. The screenshots in `docs/` cover the latter. Requirements and procedure: https://www.hacs.xyz/docs/publish/include/

## Project structure

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

The license is GNU GPL v3.0.
