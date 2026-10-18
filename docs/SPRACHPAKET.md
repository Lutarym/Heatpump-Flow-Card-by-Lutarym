# Language packs

**English** · [Deutsch](SPRACHPAKET.de.md) · [Français](SPRACHPAKET.fr.md) · [日本語](SPRACHPAKET.ja.md)

With a language pack you can translate the card into another language yourself or adjust a built-in translation. A language pack is a text file in JSON format with all texts of the card and the help.

## Where to find it

Edit the card, switch the editor to **Advanced**, section **Import, export and customisation**, below **Language**:

- **Export language**: saves the language currently shown as a file in your downloads folder
- **Import language**: reads a language file and selects the language
- **Remove own language**: only appears for an own or customised language

## Translating a new language

1. Under **Language** choose the language you translate from, for example English, and press **Export language**.
2. Open the file in a text editor and change `code` at the top (for example `"nl"` or `"pt-br"`), `name` (for example `"Nederlands"`) and `dezimal` (`","` or `"."`). `basis` stays the language you exported from.
3. Under `texte` and `hilfe` only translate the texts to the right of the colon. The keys on the left stay unchanged.
4. Placeholders in curly braces such as `{v}`, `{n}` or `{liste}` must remain exactly as they are in the translated text. The card inserts numbers or names there.
5. Press **Import language** and choose the file. The card reports how many texts were taken over.
6. Press **Save** in the editor so that the language is kept.

You do not have to translate everything at once. Missing or empty texts are shown in the base language (`basis`).

## Adjusting a built-in language

Export for example English, change individual texts and import the file with `"code": "en"`. The selection then shows "(customised)". **Remove own language** restores the built-in translation.

## File structure

The keys are German and must stay exactly as shown.

```json
{
  "format": "lutarym-sprachpaket",
  "version": 1,
  "karte": "4.2.0",
  "code": "nl",
  "name": "Nederlands",
  "basis": "en",
  "dezimal": ",",
  "texte": {
    "s_cop": "Gem. COP vandaag {v}",
    "t_jaz": "Jaarrendement (SPF)"
  },
  "hilfe": {
    "grundlagen": "Basis",
    "grundlagen.0.n": "Lezen en schrijven",
    "grundlagen.0.t": "Elke regel laat zien waar de waarde vandaan komt."
  }
}
```

| Key | Meaning |
|---|---|
| `format` | always `"lutarym-sprachpaket"` |
| `version` | always `1` |
| `karte` | card version at export, for information only |
| `code` | language code: 2 or 3 lower-case letters, optionally with region, for example `"nl"` or `"pt-br"` |
| `name` | name in the selection list |
| `basis` | base language for missing texts: `de`, `en`, `fr` or `ja` |
| `dezimal` | decimal separator: `","` or `"."` |
| `texte` | all texts of the card and the editor |
| `hilfe` | group titles (`grundlagen`) and name (`.n`) and explanation (`.t`) of every help entry |

## Checks when importing

- Unknown keys are ignored and reported.
- If the placeholders of a text do not match the original, the card uses the base language there and names the keys concerned.
- Missing texts are counted and reported.
- Texts containing angle brackets `< >`, straight double quotes `"` or backticks are rejected and the base language is used there. Typographic quotes such as “ ” or « » are allowed.

## Where the language is stored

Imported languages are stored in the configuration of this card under `language_custom` and apply to this card only. **Save as file** and **Load from file** in the section Import, export and customisation transfer the whole configuration including the language to another card. If the language is set to **Automatic** and Home Assistant uses the same language code, the card picks the own language automatically.

A complete translation including the help makes the card configuration considerably larger.

## After a card update

New texts of a newer card version are missing in older language files and appear in the base language. Export your language again then. The file contains all texts again, the new ones in the base language, and you only translate those.
