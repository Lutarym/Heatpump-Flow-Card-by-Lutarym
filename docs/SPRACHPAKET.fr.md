# Packs de langue

[English](SPRACHPAKET.md) · [Deutsch](SPRACHPAKET.de.md) · **Français** · [日本語](SPRACHPAKET.ja.md)

Un pack de langue permet de traduire vous-même la carte dans une autre langue ou d'adapter une traduction intégrée. C'est un fichier texte au format JSON contenant tous les textes de la carte et de l'aide.

## Où le trouver

Modifier la carte, passer l'éditeur en **Avancé**, section **Import, export et personnalisation**, sous **Langue** :

- **Exporter la langue** : enregistre la langue affichée comme fichier dans le dossier des téléchargements
- **Importer une langue** : lit un fichier de langue et sélectionne la langue
- **Supprimer la langue personnelle** : n'apparaît que pour une langue personnelle ou modifiée

## Traduire une nouvelle langue

1. Sous **Langue**, choisissez la langue de départ, par exemple English, et appuyez sur **Exporter la langue**.
2. Ouvrez le fichier dans un éditeur de texte et modifiez en haut `code` (par exemple `"nl"` ou `"pt-br"`), `name` (par exemple `"Nederlands"`) et `dezimal` (`","` ou `"."`). `basis` reste la langue exportée.
3. Sous `texte` et `hilfe`, traduisez seulement les textes à droite des deux-points. Les clés à gauche restent inchangées.
4. Les espaces réservés entre accolades comme `{v}`, `{n}` ou `{liste}` doivent rester tels quels dans le texte traduit. La carte y insère des nombres ou des noms.
5. Appuyez sur **Importer une langue** et choisissez le fichier. La carte indique combien de textes ont été repris.
6. Appuyez sur le bouton d'enregistrement de l'éditeur de Home Assistant pour conserver la langue.

Inutile de tout traduire d'un coup. Les textes manquants ou vides s'affichent dans la langue de base (`basis`).

## Adapter une langue intégrée

Exportez par exemple Français, modifiez des textes et importez le fichier avec `"code": "fr"`. La liste affiche alors « (modifié) ». **Supprimer la langue personnelle** rétablit la traduction intégrée.

## Structure du fichier

Les clés sont en allemand et doivent rester exactement ainsi.

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

| Clé | Signification |
|---|---|
| `format` | toujours `"lutarym-sprachpaket"` |
| `version` | toujours `1` |
| `karte` | version de la carte à l'export, pour information |
| `code` | code de langue : 2 ou 3 lettres minuscules, éventuellement avec région, par exemple `"nl"` ou `"pt-br"` |
| `name` | nom dans la liste de choix |
| `basis` | langue de base pour les textes manquants : `de`, `en`, `fr` ou `ja` |
| `dezimal` | séparateur décimal : `","` ou `"."` |
| `texte` | tous les textes de la carte et de l'éditeur |
| `hilfe` | titres des groupes (`grundlagen`) ainsi que nom (`.n`) et explication (`.t`) de chaque entrée d'aide |

## Contrôles à l'import

- Les clés inconnues sont ignorées et signalées.
- Si les espaces réservés d'un texte ne correspondent pas à l'original, la carte utilise la langue de base et nomme les clés concernées.
- Les textes manquants sont comptés et signalés.
- Les textes contenant des chevrons `< >`, des guillemets droits `"` ou des accents graves isolés sont refusés, la langue de base s'applique. Les guillemets typographiques comme « » ou “ ” sont autorisés.

## Où la langue est enregistrée

Les langues importées sont enregistrées dans la configuration de cette carte sous `language_custom` et ne valent que pour cette carte. **Enregistrer dans un fichier** et **Charger un fichier** dans la section Import, export et personnalisation transfèrent toute la configuration, langue comprise, vers une autre carte. Si la langue est sur **Automatique** et que Home Assistant utilise le même code, la carte prend automatiquement la langue personnelle.

Une traduction complète avec l'aide agrandit nettement la configuration de la carte.

## Après une mise à jour de la carte

Les nouveaux textes d'une version plus récente manquent dans les anciens fichiers et apparaissent dans la langue de base. Exportez alors de nouveau votre langue. Le fichier contient à nouveau tous les textes, les nouveaux dans la langue de base, et vous ne traduisez que ceux-là.
