# Veröffentlichen auf GitHub

[English](GITHUB.md) · **Deutsch** · [Français](GITHUB.fr.md) · [日本語](GITHUB.ja.md)

Diese Anleitung bringt das Projekt von der ZIP-Datei zu einem veröffentlichten Repository mit Release, das über HACS installierbar ist.

## 1. Repository anlegen

Auf https://github.com/new eintragen:

| Feld | Wert |
|---|---|
| Repository name | `Heatpump-Flow-Card-by-Lutarym` |
| Description | Animated plant diagram for Panasonic Aquarea heat pumps via HeishaMon |
| Sichtbarkeit | Public |
| Add a README file | nicht ankreuzen |
| Add .gitignore | nicht ankreuzen |
| Choose a license | nicht ankreuzen |

Der Name darf vom Dateinamen abweichen, weil `hacs.json` HACS über den Eintrag `filename` sagt, welche Datei gemeint ist. Die drei Häkchen bleiben leer, weil README, Lizenz und .gitignore bereits im Projekt enthalten sind.

## 2. Hochladen

Im entpackten Ordner, dort wo die `README.md` liegt:

```bash
git init
git branch -M main
git add .
git commit -m "v3.0.0"
git remote add origin https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym.git
git push -u origin main
```

Fragt Git nach Zugangsdaten, ist das Passwort ein Personal Access Token, nicht dein GitHub-Passwort. Zu finden unter Settings, Developer settings, Personal access tokens. Der Token braucht den Bereich `repo`.

## 3. Screenshot

Je Sprache ein Bild der Karte in `docs/` ablegen: `screenshot-en.png`, `screenshot-de.png`, `screenshot-fr.png` und `screenshot-ja.png`. Jede README zeigt das Bild in ihrer Sprache. Die Sprache der Karte vor jedem Bild mit der Option `language` umstellen.

## 4. Topics

Auf der Repository-Seite das Zahnrad neben **About**, dann unter **Topics**:

```
home-assistant  lovelace  lovelace-card  hacs  heishamon  panasonic-aquarea  heatpump
```

Die Topics `home-assistant` und `lovelace` sind Voraussetzung für eine spätere Aufnahme in den offiziellen HACS-Katalog.

## 5. Release

HACS erkennt Versionen über Releases. Ein Tag allein reicht nicht.

```bash
git tag v3.0.0
git push origin v3.0.0
```

Danach auf GitHub unter **Releases**, **Draft a new release** den Tag `v3.0.0` wählen, Titel `v3.0.0`, und eine Beschreibung wie:

```markdown
First public release. See CHANGELOG.md for all changes.
```

## 6. In HACS einbinden

1. HACS öffnen, Menü mit den drei Punkten, Benutzerdefinierte Repositories
2. Repository: `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, Kategorie: **Dashboard**
3. Die Karte suchen und herunterladen

HACS legt die Ressource selbst an. Danach den Browser ohne Zwischenspeicher neu laden.

## Spätere Aktualisierungen

```bash
git add .
git commit -m "vX.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

Anschließend zu diesem Tag ein neues Release anlegen. Die Version in `CARD_VERSION` ganz oben in `dist/heatpump-flow-card-by-lutarym.js` und der Tag sollten übereinstimmen.

## Offizieller HACS-Katalog

Optional, damit andere die Karte ohne benutzerdefiniertes Repository finden. HACS führt dabei automatische Prüfungen durch, unter anderem die HACS-GitHub-Action, mindestens ein vollständiges Release und Bilder in der README. Letzteres decken die Screenshots in `docs/` ab. Voraussetzungen und Ablauf: https://www.hacs.xyz/docs/publish/include/

## Projektstruktur

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

Die Lizenz ist die GNU GPL v3.0.
