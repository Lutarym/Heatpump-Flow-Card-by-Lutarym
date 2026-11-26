# Entwicklung

**Deutsch** · [English](ENTWICKLUNG.md) · [Français](ENTWICKLUNG.fr.md) · [日本語](ENTWICKLUNG.ja.md)

Für die Installation über HACS ist nichts davon nötig. HACS lädt nur die fertigen Dateien aus `dist`: `heatpump-flow-card-by-lutarym.js`, die Hilfe `heatpump-flow-card-by-lutarym-hilfe.js`, die die Karte bei Bedarf nachlädt, und den Ordner `Profile` mit den Geräteprofilen.

## Aufbau

Der Code liegt in Modulen unter `src/`. Daraus wird die eine Datei in `dist/` gebaut.

| Datei | Inhalt |
|---|---|
| `src/index.js` | Einstiegspunkt, meldet Karte und Editor in Home Assistant an |
| `src/konstanten.js` | Version, Zeichenraster, Farbskalen, Zeiten |
| `src/texte.js` | Alle Texte in vier Sprachen |
| `src/sprachen.js` | Eigene Sprachpakete |
| `src/hilfe-daten.js` | Inhalt des Hilfefensters |
| `src/hilfsfunktionen.js` | Zustände lesen, Zahlen formatieren, Farben |
| `src/namen.js` | Namensliste (TOP, XTOP, OPT, SET, EXT), erlaubte Entitätsarten, Einheiten, Umstellung der früheren Feldnamen |
| `src/erkennung.js` | Erkennung der Entitäten über die Geräteprofile |
| `src/profile.js` | Laden und Prüfen der Geräteprofile, eigene Profile, Profile von GitHub |
| `src/felder.js` | Felder der Karte und Standardkonfiguration |
| `src/karte/` | Die Karte, aufgeteilt nach Bereichen (Grafik, Tür, Dialoge, Hilfe, Verlauf, Diagramme, Heizkurve, Demo, Stil) |
| `src/editor/` | Der Editor (Bedienung, Import und Export, Stil) |

## Bauen

Voraussetzung ist Node.js.

```
npm install
npm run build
```

`npm run watch` baut bei jeder Änderung neu.

Vor dem Bauen prüft `scripts/profile.mjs` alle Dateien in `dist/Profile` und schreibt `dist/Profile/liste.json`. Bei einem fehlerhaften Profil bricht der Build ab, siehe [Geräteprofile](GERAETEPROFIL.de.md#ein-profil-in-den-ordner-aufnehmen).

## Wichtig

- Nach jeder Änderung in `src/` oder `dist/Profile` neu bauen und `dist/` mit hochladen, auch `dist/Profile/liste.json`. HACS liest nur `dist/`.
- Die Versionsnummer steht in `src/konstanten.js` und in `package.json`.
