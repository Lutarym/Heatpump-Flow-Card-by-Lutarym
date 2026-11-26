# Development

**English** · [Deutsch](ENTWICKLUNG.de.md) · [Français](ENTWICKLUNG.fr.md) · [日本語](ENTWICKLUNG.ja.md)

None of this is needed for installation via HACS. HACS only loads the finished files from `dist`: `heatpump-flow-card-by-lutarym.js`, the help `heatpump-flow-card-by-lutarym-hilfe.js`, which the card loads when needed, and the folder `Profile` with the device profiles.

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
| `src/namen.js` | Name list (TOP, XTOP, OPT, SET, EXT), allowed entity types, units, conversion of the former field names |
| `src/erkennung.js` | Detection of the entities through the device profiles |
| `src/profile.js` | Loading and checking the device profiles, own profiles, profiles from GitHub |
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

Before building, `scripts/profile.mjs` checks all files in `dist/Profile` and writes `dist/Profile/liste.json`. If a profile is faulty, the build stops, see [device profiles](GERAETEPROFIL.md#adding-a-profile-to-the-folder).

## Important

- Rebuild after every change in `src/` or `dist/Profile` and commit `dist/` as well, including `dist/Profile/liste.json`. HACS only reads `dist/`.
- The version number is in `src/konstanten.js` and in `package.json`.
