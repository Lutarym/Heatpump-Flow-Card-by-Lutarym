# Sprachpakete

[English](SPRACHPAKET.md) · **Deutsch** · [Français](SPRACHPAKET.fr.md) · [日本語](SPRACHPAKET.ja.md)

Mit einem Sprachpaket kannst du die Karte selbst in eine weitere Sprache übersetzen oder eine eingebaute Übersetzung anpassen. Ein Sprachpaket ist eine Textdatei im JSON-Format mit allen Texten der Karte und der Hilfe.

## Wo du es findest

Karte bearbeiten, Editor auf **Erweitert** stellen, Abschnitt **Import, Export und Anpassungen**, unter **Sprache**:

- **Sprache exportieren**: speichert die gerade angezeigte Sprache als Datei im Download-Ordner
- **Sprache importieren**: liest eine Sprachdatei ein und wählt die Sprache aus
- **Eigene Sprache entfernen**: erscheint nur bei einer eigenen oder angepassten Sprache

## Neue Sprache übersetzen

1. Unter **Sprache** die Sprache wählen, von der aus du übersetzt, zum Beispiel English, und **Sprache exportieren** drücken.
2. Die Datei in einem Texteditor öffnen und oben `code` (zum Beispiel `"nl"` oder `"pt-br"`), `name` (zum Beispiel `"Nederlands"`) und `dezimal` (`","` oder `"."`) ändern. `basis` bleibt die Sprache, aus der du exportiert hast.
3. Unter `texte` und `hilfe` nur die Texte rechts vom Doppelpunkt übersetzen. Die Schlüssel links bleiben unverändert.
4. Platzhalter in geschweiften Klammern wie `{v}`, `{n}` oder `{liste}` müssen genau so im übersetzten Text stehen bleiben. Dort setzt die Karte Zahlen oder Namen ein.
5. **Sprache importieren** drücken und die Datei wählen. Die Karte meldet, wie viele Texte übernommen wurden.
6. Im Editor auf **Speichern** drücken, damit die Sprache dauerhaft bleibt.

Du musst nicht alles auf einmal übersetzen. Fehlende oder leere Texte zeigt die Karte in der Grundsprache (`basis`).

## Eingebaute Sprache anpassen

Exportiere zum Beispiel Deutsch, ändere einzelne Texte und importiere die Datei mit `"code": "de"`. In der Auswahl steht dann „(angepasst)“. **Eigene Sprache entfernen** stellt die eingebaute Übersetzung wieder her.

## Aufbau der Datei

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

| Angabe | Bedeutung |
|---|---|
| `format` | immer `"lutarym-sprachpaket"` |
| `version` | immer `1` |
| `karte` | Kartenversion beim Export, nur zur Information |
| `code` | Sprachcode: 2 oder 3 Kleinbuchstaben, optional mit Region, zum Beispiel `"nl"` oder `"pt-br"` |
| `name` | Name in der Auswahlliste |
| `basis` | Grundsprache für fehlende Texte: `de`, `en`, `fr` oder `ja` |
| `dezimal` | Dezimalzeichen: `","` oder `"."` |
| `texte` | alle Texte der Karte und des Editors |
| `hilfe` | Gruppentitel (`grundlagen`) sowie Name (`.n`) und Erklärung (`.t`) jedes Hilfeeintrags |

## Prüfung beim Import

- Unbekannte Schlüssel werden ignoriert und gemeldet.
- Stimmen die Platzhalter eines Textes nicht mit dem Original überein, nimmt die Karte dort die Grundsprache und nennt die betroffenen Schlüssel.
- Fehlende Texte werden gezählt und gemeldet.
- Texte mit spitzen Klammern `< >`, geraden Anführungszeichen `"` oder Backticks werden abgelehnt, dort gilt die Grundsprache. Typografische Anführungszeichen wie „ “ oder « » sind erlaubt.

## Wo die Sprache gespeichert wird

Importierte Sprachen stehen in der Konfiguration dieser Karte unter `language_custom` und gelten nur für diese Karte. Mit **Als Datei speichern** und **Aus Datei laden** im Abschnitt Import, Export und Anpassungen lässt sich die ganze Konfiguration samt Sprache auf eine andere Karte übertragen. Steht die Sprache auf **Automatisch** und hat Home Assistant denselben Sprachcode, nimmt die Karte die eigene Sprache automatisch.

Bei einer kompletten Übersetzung samt Hilfe wird die Konfiguration der Karte deutlich größer.

## Nach einem Update der Karte

Neue Texte einer neueren Kartenversion fehlen in älteren Sprachdateien und erscheinen in der Grundsprache. Exportiere deine Sprache dann erneut. Die Datei enthält wieder alle Texte, die neuen in der Grundsprache, und du übersetzt nur diese.
