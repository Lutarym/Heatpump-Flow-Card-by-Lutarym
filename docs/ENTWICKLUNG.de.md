# Entwicklung

**Deutsch** · [English](ENTWICKLUNG.md) · [Français](ENTWICKLUNG.fr.md) · [日本語](ENTWICKLUNG.ja.md)

Für die Installation über HACS ist nichts davon nötig. HACS lädt nur die fertige Datei `dist/heatpump-flow-card-by-lutarym.js`.

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
| `src/erkennung.js` | Erkennung von HeishaMon by Lutarym |
| `src/profile.js` | Geräteprofile |
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

## Wichtig

- Nach jeder Änderung in `src/` neu bauen und die Datei in `dist/` mit hochladen. HACS liest nur `dist/`.
- Die Versionsnummer steht in `src/konstanten.js` und in `package.json`.
