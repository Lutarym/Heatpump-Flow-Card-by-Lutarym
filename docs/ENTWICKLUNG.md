# Development

**English** · [Deutsch](ENTWICKLUNG.de.md) · [Français](ENTWICKLUNG.fr.md) · [日本語](ENTWICKLUNG.ja.md)

None of this is needed for installation via HACS. HACS only loads the finished file `dist/heatpump-flow-card-by-lutarym.js`.

## Structure

The code lives in modules under `src/`. The single file in `dist/` is built from them.

| File | Content |
|---|---|
| `src/index.js` | Entry point, registers card and editor in Home Assistant |
| `src/konstanten.js` | Version, drawing grid, colour scales, timings |
| `src/texte.js` | All texts in four languages |
| `src/sprachen.js` | Own language packs |
| `src/hilfe-daten.js` | Content of the help window |
| `src/hilfsfunktionen.js` | Reading states, formatting numbers, colours |
| `src/erkennung.js` | Detection of HeishaMon by Lutarym |
| `src/profile.js` | Device profiles |
| `src/felder.js` | Card fields and default configuration |
| `src/karte/` | The card, split by area (graphics, door, dialogs, help, history, charts, heating curve, demo, style) |
| `src/editor/` | The editor (operation, import and export, style) |

## Building

Node.js is required.

```
npm install
npm run build
```

`npm run watch` rebuilds on every change.

## Important

- Rebuild after every change in `src/` and commit the file in `dist/` as well. HACS only reads `dist/`.
- The version number is in `src/konstanten.js` and in `package.json`.
