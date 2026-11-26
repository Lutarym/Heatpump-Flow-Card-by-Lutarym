# Profils d'appareil

[English](GERAETEPROFIL.md) · [Deutsch](GERAETEPROFIL.de.md) · **Français** · [日本語](GERAETEPROFIL.ja.md)

Un profil d'appareil indique à la carte quelle entité de Home Assistant appartient à quelle valeur. Les valeurs portent les noms de la [liste des noms](NAMENSLISTE.fr.md), par exemple TOP14 pour la température extérieure. Avec le profil, la carte trouve elle-même les entités.

À partir de la version 6.0.0, la carte ne contient plus de profil. Tous les profils sont des fichiers dans le dossier `dist/Profile`, un fichier par fabricant. Chaque intégration ou firmware y est une variante, pour Panasonic Aquarea par exemple HeishaMon by Lutarym, HeishaMon (MQTT), HeishaMon de kamaradclimber et Aquarea Smart Cloud. HACS installe le dossier avec la carte. Les profils personnels s'ajoutent par import.

## Où le trouver

Modifier la carte. Dans la section **Intégration** :

- **Fabricant** : « Détection automatique », un fabricant du dossier Profile ou de GitHub, « Profils personnels » (s'il y en a) ou « Aucun profil, saisir les entités moi-même »
- **Intégration / appareil** : apparaît quand un fabricant a plusieurs variantes, avec le nom du développeur
- **Plusieurs intégrations détectées** : apparaît avec « Détection automatique » quand plusieurs variantes correspondent
- **Voulez-vous charger un profil précis ?** : apparaît avec « Détection automatique » quand aucune variante ne correspond. Choisissez-y le fabricant et l'intégration puis appuyez sur **Charger le profil**. Avec **Non, saisir les entités moi-même**, la carte passe à « Aucun profil, saisir les entités moi-même » et l'éditeur affiche les champs des entités.
- **Reprendre de l'intégration** : inscrit durablement les entités trouvées dans les champs
- **Rechercher à nouveau** : passe à « Détection automatique » et recherche à nouveau dans tous les profils. Si les profils n'ont pas pu être chargés auparavant, la carte les recharge.
- **Mettre à jour les profils** : charge les profils nouveaux et plus récents depuis GitHub, voir [Charger des profils depuis GitHub](#charger-des-profils-depuis-github)
- **Saisir les noms par défaut** (éditeur en **Avancé**) : inscrit les ID d'entité que le profil indique exactement ou avec le modèle `*.nom` (par exemple `sensor.heishamon_top14`)
- **À propos de ce profil** : intégration, développeur avec lien vers la source, version, dernière modification de l'intégration et jour de la vérification, domaines couverts, ce qui a été trouvé dans Home Assistant, si la carte peut commander, si l'aide existe et si le profil est testé. Version et dates se trouvent dans le fichier de profil et ne changent pas toutes seules. En dessous **Retour sur GitHub** et **Copier le rapport** : le rapport contient les valeurs attribuées, manquantes et modifiées à la main ainsi que les entités inutilisées de l'intégration. Cela aide à améliorer un profil. Il contient des ID d'entités et des valeurs actuelles ; sur GitHub, vous le voyez et le modifiez avant l'envoi.

Dans la section **Import, export et personnalisation** (éditeur en **Avancé**) :

- **Exporter le profil** : enregistre la variante choisie ou détectée comme fichier dans le dossier des téléchargements
- **Importer un profil** : lit un fichier de profil et sélectionne la (première) variante
- **Supprimer le profil personnel** : n'apparaît que pour un profil personnel, modifié ou chargé depuis GitHub

## Comment la carte charge et cherche

1. La configuration de la carte contient sous `profil` l'identifiant de la variante, par exemple `heishamon_lutarym`. Les identifiants jusqu'à 5.33.8 restent valables.
2. Variante choisie : la carte charge `liste.json` et exactement le fichier de cette variante.
3. `auto` (« Détection automatique », par défaut) : la carte charge `liste.json` et une fois tous les fichiers. Elle vérifie toutes les variantes et prend celle qui a le plus de valeurs correspondantes. Une variante compte comme trouvée quand au moins deux valeurs correspondent. Quand une variante cherche par l'ID d'entité (sans intégration), les entités qui appartiennent selon le registre à l'intégration d'une autre variante ne comptent pas.
4. Aucune variante ne correspond : la carte affiche « Aucun profil correspondant trouvé. Voulez-vous charger un profil précis ? Modifiez la carte et choisissez le fabricant et l'intégration en haut. » Sans profil, la carte ne suppose aucun fabricant.
5. `keins` : pas de profil, la carte n'utilise que les entités inscrites.
6. Le navigateur charge les fichiers une fois par page. La carte ajoute sa version à la requête ; après une mise à jour, le navigateur récupère les nouveaux fichiers.
7. Si les profils n'ont pas pu être chargés, la carte affiche « Les profils d'appareil n'ont pas pu être chargés. Veuillez recharger la page. »
8. Si Home Assistant a plusieurs appareils de la même intégration (par exemple deux pompes à chaleur), la carte cherche les valeurs non inscrites sur l'appareil de ses entités inscrites.

## Démarrage rapide : profil personnel

1. Choisissez une variante qui convient ou une variante proche, par exemple **Panasonic Aquarea, HeishaMon by Lutarym**, et appuyez sur **Exporter le profil**. Le fichier sert de modèle.
2. Cherchez les entités de votre pompe dans Home Assistant : **Developer tools → States** (noms du menu en anglais), filtrer par exemple avec le nom de l'appareil.
3. Ouvrez le fichier dans un éditeur de texte. Modifiez les identifiants (`id` du fichier et de la variante), les noms et `suche`, et indiquez vos entités sous `werte`. Supprimez simplement les valeurs que vous n'avez pas.
4. Appuyez sur **Importer un profil** et choisissez le fichier. La carte indique combien de valeurs sont décrites et combien elle en a trouvé dans Home Assistant.
5. Appuyez sur **Reprendre de l'intégration** si les entités trouvées doivent être inscrites durablement dans les champs.
6. Vérifiez les champs dans l'éditeur et corrigez-les à la main si nécessaire.

## Structure du fichier

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 2,
  "id": "beispiel",
  "name": "Beispiel",
  "karte_ab": "6.0.0",
  "varianten": [
    {
      "id": "beispiel_wp",
      "name": "Beispiel WP",
      "geraete": [{ "hersteller": ["Beispiel"], "reihe": "", "modelle": [], "hinweis": "" }],
      "quelle": {
        "entwickler": "jemand",
        "adresse": "https://github.com/jemand/beispiel-wp",
        "version": "1.0.0",
        "aktualisiert": "2026-11-20",
        "abgelesen": "2026-11-26"
      },
      "suche": { "art": "integration", "integration": "beispiel_wp", "namensteil": "" },
      "werte": {
        "TOP14": ["outdoor_temperature"],
        "TOP6": ["sensor.*_vorlauf"],
        "TOP1": { "suche": ["sensor.*_durchfluss"], "einheit": "l/h" },
        "TOP26": { "suche": ["sensor.*_betrieb"], "zustaende": { "abtauen": 1, "*": 0 } }
      }
    }
  ]
}
```

Le fichier :

| Entrée | Obligatoire | Signification |
|---|---|---|
| `format`, `version` | oui | toujours `"lutarym-geraeteprofil"` et `2` |
| `id` | oui | identifiant du fichier, égal au nom du fichier sans `.json`. 2 à 40 caractères, seulement minuscules a à z, chiffres, `_` et `-`. `liste` est réservé. |
| `name` | oui | nom du fabricant tel qu'il apparaît dans l'éditeur |
| `karte_ab` | oui | plus petite version de la carte qui comprend le fichier, par exemple `6.0.0`. Si elle est plus récente que la carte, la carte refuse le fichier. |
| `varianten` | oui | une ou plusieurs variantes |

Chaque variante :

| Entrée | Obligatoire | Signification |
|---|---|---|
| `id` | oui | identifiant de la variante, unique dans tous les fichiers. Les identifiants jusqu'à 5.33.8 restent. |
| `name` | oui | nom de l'intégration ou du firmware |
| `geraete` | oui | liste avec `hersteller` (liste), `reihe`, `modelle` (liste) et `hinweis` |
| `quelle` | oui dans le dossier Profile | `entwickler`, `adresse` (avec https://), `version`, `aktualisiert` (dernière modification de l'intégration), `abgelesen` (jour de la vérification) |
| `suche` | oui | `art` : `integration`, `core` ou `firmware`. `integration` : domaine dans le registre de Home Assistant. `namensteil` : partie de l'ID d'entité quand on cherche sans le registre. |
| `heishamon` | non | `true` si les valeurs viennent de HeishaMon ([indicateur heishamon](#indicateur-heishamon)) |
| `getestet` | non | `true` si vérifié sur une vraie installation |
| `werte` | oui | nom de la liste des noms et comment la carte trouve l'entité correspondante |

Une valeur en forme courte est une liste de règles de recherche, par exemple `"TOP14": ["outdoor_temperature"]`. La forme longue ajoute des indications de conversion : `"TOP1": { "suche": [...], "einheit": "l/h" }`.

## Règles de recherche

| Règle | Exemple | Correspond à |
|---|---|---|
| clé | `"top14"` | les entités de l'intégration avec cette clé interne (translation_key) ou les ID d'entité se terminant par `_top14` |
| domaine et clé | `"number:top27"` | comme ci-dessus, seulement les entités de ce type |
| modèle avec étoile | `"sensor.*boiler_fanspd"` | tout ID d'entité suivant ce modèle, l'étoile remplace n'importe quel texte |
| entité exacte | `"sensor.exterieur"` | exactement cette entité |

Autres règles :

- Un nom, une entité. Plusieurs règles sont des alternatives, la carte ne combine pas les valeurs de deux entités.
- Chaque nom n'accepte que certains types d'entité (colonne « Types d'entité » de la [liste des noms](NAMENSLISTE.fr.md)). Si le type ne convient pas, l'entité n'est pas inscrite.
- Si une entité en lecture seule et une entité réglable correspondent au même nom, l'entité réglable l'emporte, afin que la valeur puisse être réglée dans la carte.
- Si un nom a plusieurs règles, la première qui trouve quelque chose l'emporte. Une correspondance exacte (clé interne ou ID complet) passe avant une correspondance par la terminaison ou un modèle.
- Majuscules et minuscules ne comptent pas pour les modèles et terminaisons.

## Comment la recherche fonctionne

- **Avec `integration`** : la carte ne cherche que parmi les entités de cette intégration. Le nom apparaît dans la barre d'adresse quand vous ouvrez l'intégration sous **Settings → Devices & services** (noms du menu en anglais) : la partie après `/integration/`. Si rien n'est trouvé, la carte ne continue comme sans `integration` que si `namensteil` est aussi renseigné. Ainsi, des clés générales comme `"outdoor_temperature"` ne touchent pas d'autres entités.
- **Sans `integration`** : la carte cherche parmi toutes les entités. Avec `namensteil`, seulement celles dont l'ID contient ce texte. Sans `namensteil`, une terminaison peut aussi toucher d'autres entités ; utilisez alors des ID exacts ou des modèles.

## Unités et états

- `einheit` : ce que fournit l'intégration si ce n'est pas l'unité de HeishaMon. Si les règles trouvent des choses différentes, les unités sont données sous forme de liste. Si l'entité indique elle-même une unité, celle-ci s'applique. Sinon, celle du profil s'applique, seulement pour l'entité que le profil trouve lui-même et seulement si le profil indique exactement une unité (choix personnel).
- `zustaende` : textes et leur valeur comme chez HeishaMon, `"*"` représente tous les autres textes. La carte comprend les nombres et les mots comme on et off même sans cette indication. La carte ne convertit les textes que pour l'entité que le profil trouve lui-même, aussi dans l'historique. Sans indication, elle reconnaît aussi un dégivrage à « defrost » ou « abtau » dans le texte. Pour EMS-ESP, le profil contient les mots du dégivrage dans les 12 langues d'EMS-ESP.

| Noms | La carte convertit en | Le profil peut indiquer |
|---|---|---|
| TOP62, TOP63, TOP65 (ventilateur, pompe) | tr/min | tr/min ou %. En % : 0 % à l'arrêt, 100 % tourne le plus vite (comme 900 tr/min, choix personnel, seulement pour le mouvement). |
| TOP11, TOP90, TOP91 (heures de fonctionnement) | h | h, min, s, ms, d |
| TOP1 (débit) | l/min | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min |
| EXT1, EXT3, EXT4 (puissance) | W | W, kW, MW |
| EXT2 (énergie) | kWh | Wh, kWh, MWh |
| TOP8 (compresseur) | Hz | Hz ou %. La carte affiche l'unité reçue. |
| TOP26 et toutes les valeurs marche/arrêt | 0 et 1 | nombres, marche et arrêt, textes propres via `zustaende` |
| TOP20 (vanne 3 voies) | 0 chauffage, 1 eau chaude | nombres, marche et arrêt, textes avec des mots d'eau chaude, textes propres via `zustaende` |

Le build signale comme erreur une unité absente du tableau. La carte attend les températures en °C et la pression en bar.

## Indicateur heishamon

Avec `"heishamon": true` dans une variante :

1. La fenêtre d'aide avec les valeurs et commandes de HeishaMon est disponible.
2. Si une valeur n'est sinon qu'en lecture seule, la carte envoie la commande à HeishaMon par MQTT (par exemple SET16 pour la courbe de chauffe).
3. Si TOP95, TOP99 et TOP100 n'ont pas de valeur alors que HeishaMon fournit des données, la carte affiche l'indication sur le groupe « Installer settings ».
4. Poêle sur l'entrée solaire : si seul un poêle est choisi, TOP47 et OPT5 appartiennent au poêle (EXT300 et EXT301).

La série Panasonic issue de TOP92 suit le fabricant indiqué dans `geraete`.

## Profils intégrés

Les règles de recherche viennent du code source de chaque intégration, vérifié au jour indiqué dans `abgelesen`. Seuls HeishaMon by Lutarym et HeishaMon (MQTT) ont été testés sur de vraies installations, tous les autres sont marqués « non testé ». Les retours aident à les améliorer. Les modèles ne sont indiqués pour l'instant que pour HeishaMon (d'après HeatPumpType.md de HeishaMon) et EMS-ESP (d'après device_library.h d'EMS-ESP).

| Fichier | Fabricant | Variante | Développeur | Domaine | Valeurs |
|---|---|---|---|---|---|
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| `batavia_heat.json` | Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| `bosch_buderus.json` | Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| `bosch_buderus.json` | Bosch, Buderus | [EMS-ESP (MQTT)](https://github.com/emsesp/EMS-ESP32) | emsesp |  | 41 |
| `daikin.json` | Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| `daikin.json` | Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| `daikin.json` | Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| `daikin.json` | Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| `dewarmte.json` | DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| `heliotherm.json` | Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| `hitachi.json` | Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| `idm.json` | iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| `keba.json` | KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| `kronoterm.json` | Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| `lambda.json` | Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| `nibe.json` | NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 127 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon (MQTT)](https://github.com/heishamon/HeishaMon) |  |  | 105 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| `qube.json` | Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| `remeha.json` | Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| `solarfocus.json` | Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| `thermia.json` | Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| `vaillant.json` | Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| `viessmann.json` | Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| `waterkotte.json` | Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| `weishaupt.json` | Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| `wolf.json` | Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

EMS-ESP n'a pas besoin d'intégration : le firmware crée ses entités dans Home Assistant via MQTT Discovery. Les règles correspondent au réglage EMS-ESP « Entity ID format » avec noms courts (une ou plusieurs instances, actuel ou v3.5), pas à « Single instance, long name (v3.4) ».

Sans profil, avec la raison :

- `myuplink`: les noms d'entités viennent dynamiquement de l'appareil
- `wolflink`: les noms d'entités viennent dynamiquement de l'appareil
- `ebusd`: les noms dépendent de votre configuration ebusd
- `stiebel_eltron`: ne fournit qu’une entité climat
- `bosch`: les noms d'entités viennent dynamiquement de l'appareil
- `tuya_heat_pump`: points de données différents selon l’appareil
- `toshiba_modbus`: climatiseur
- `midea_heatpump_hws`: pompe à chaleur eau chaude uniquement
- `dimplex`: ne fournit pas de valeurs de PAC comme départ, retour ou compresseur

## Ajouter un profil au dossier

1. Créer le fichier `dist/Profile/<id>.json`, un fichier par fabricant. Si le fabricant existe déjà, la nouvelle variante va dans son fichier.
2. `npm run build` : le build lit tous les fichiers du dossier, les vérifie et écrit `dist/Profile/liste.json`. Pour ajouter un profil, il suffit de déposer le fichier et de construire.
3. Le build vérifie `format` et `version`, si `id` correspond au nom du fichier, les entrées obligatoires, si tous les identifiants sont uniques dans tous les fichiers, si chaque nom figure dans la liste des noms, si les règles de recherche ne sont pas vides, les unités (tableau ci-dessus), `zustaende` (nombres seulement), si `karte_ab` n'est pas plus récent que la carte, et `quelle` avec une adresse https et une date de vérification. En cas d'erreur, il s'arrête et indique l'endroit.

## Charger des profils depuis GitHub

1. Bouton **Mettre à jour les profils** dans la section **Intégration** à côté de **Rechercher à nouveau**, avec l'éditeur sur **Simple** et **Avancé**. La carte n'interroge GitHub que lorsque vous appuyez sur le bouton, pas à chaque ouverture du tableau de bord.
2. La carte lit `liste.json` dans le dossier `dist/Profile` de la branche main du dépôt de la carte et compare avec ce qu'elle a : le dossier Profile et les profils déjà chargés depuis GitHub. Plus récent signifie : date de vérification plus tardive (`abgelesen`), modification plus tardive de l'intégration (`aktualisiert`) ou version plus élevée.
3. La carte charge en une fois toutes les variantes nouvelles ou plus récentes et les vérifie comme lors du chargement depuis son propre dossier. Ne sont pas chargées les variantes qui nécessitent une carte plus récente (`karte_ab`) et celles qui sont erronées. Si GitHub n'est pas joignable pendant ce temps, la carte n'enregistre rien.
4. La carte enregistre les variantes comme des profils importés dans la configuration de la carte. La sélection reste, ensuite la carte recherche à nouveau. Ensuite, les profils fonctionnent aussi sans internet. Dans la liste, ils apparaissent avec « (depuis GitHub) », un nouveau fabricant sous son propre nom (choix personnel).
5. Sous les boutons, la carte indique ce qui a été chargé, par exemple « Profils depuis GitHub : 1 mis à jour (Wolf, Wolf ISM8), 1 ajouté(s) (…). Enregistrés dans cette carte. » S'il n'y a rien de nouveau, elle indique « Tous les profils sont à jour. »
6. Un profil personnel avec le même identifiant (importé, « (modifié) ») n'est pas remplacé ; la carte le mentionne dans le message (choix personnel). Pour que la version de GitHub s'applique : d'abord **Supprimer le profil personnel**, puis **Mettre à jour les profils**.
7. Si une mise à jour via HACS apporte dans le dossier Profile la même version ou une version plus récente d'une variante chargée depuis GitHub, celle du dossier s'applique. La copie enregistrée ne s'applique plus, et le prochain **Mettre à jour les profils** la retire aussi de la configuration (choix personnel).
8. La carte ne charge que des données, aucun code de programme.

## Adapter un profil intégré

1. Choisir la variante puis **Exporter le profil**.
2. Modifier les valeurs souhaitées dans le fichier. L'`id` de la variante reste la même.
3. **Importer un profil**. La liste affiche maintenant la variante avec « (modifié) ».
4. **Supprimer le profil personnel** rétablit la variante du dossier Profile.

Avec une nouvelle `id`, un profil personnel supplémentaire est créé à la place sous « Profils personnels ».

## Où les profils personnels sont enregistrés

Les profils importés et chargés depuis GitHub sont enregistrés dans la configuration de cette carte sous `profile_custom`. Ils ne valent que pour cette carte. **Enregistrer dans un fichier** dans la section Import, export et personnalisation inclut le profil, et **Charger un fichier** dans une autre carte l'y transfère. Sinon, importez le fichier de profil dans chaque carte.

## Anciens fichiers de profil

L'import lit encore les fichiers de profil au format 1 (jusqu'à 5.33.8, avec `felder` et les anciens noms de champ). La carte traduit les noms de champ d'après la [liste des noms](NAMENSLISTE.fr.md). Un profil pour HeishaMon garde l'indicateur heishamon (choix personnel : intégration `heishamon_lutarym`, partie de nom ou identifiant contenant `heishamon`). L'export fournit toujours le format 2.

## Ce qu'un profil ne change pas

- L'aide (« ? ») explique les valeurs de HeishaMon. Elle n'apparaît que pour les variantes avec l'indicateur heishamon et en mode démo.
- Le coefficient annuel derrière la porte utilise les puissances de HeishaMon (TOP15, TOP16, TOP40, TOP41 ou XTOP0, XTOP2, XTOP3, XTOP5). Si un profil ne les fournit pas, il reste vide.

## Messages à l'import

| Message | Cause |
|---|---|
| Ce n'est pas un JSON valide. Veuillez coller le texte exporté. | le fichier n'est pas du JSON, souvent une virgule ou une accolade manque |
| Ce n'est pas un fichier de profil (format doit être « lutarym-geraeteprofil »). | `format` manque ou est faux |
| Cette version de profil n'est pas prise en charge (attendu : version 2 ou 1). | `version` n'est pas `2` ou `1` |
| L'identifiant (id) manque ou n'est pas valide : 2 à 40 caractères, seulement a à z, 0 à 9, _ et -. | `id` ne respecte pas les règles ci-dessus |
| Le profil ne décrit aucune valeur connue (werte). | `werte` (format 1 : `felder`) manque ou ne contient que des noms inconnus |
| noms inconnus ignorés : … | ces noms ne figurent pas dans la liste des noms, les autres ont été repris |
| Ce profil nécessite la carte à partir de la version x.y.z. Veuillez d'abord mettre à jour la carte. | `karte_ab` est plus récent que la carte |
