# Profils d'appareil

[English](GERAETEPROFIL.md) · [Deutsch](GERAETEPROFIL.de.md) · **Français** · [日本語](GERAETEPROFIL.ja.md)

Un profil d'appareil indique à la carte comment s'appellent les entités de votre pompe à chaleur dans Home Assistant. La carte peut alors trouver elle-même les entités et les attribuer à ses champs. Cela permet de raccorder des pompes à chaleur d'autres fabricants et d'adapter le profil Panasonic intégré.

Un profil est un petit fichier texte au format JSON. Vous pouvez l'exporter, le modifier avec un éditeur de texte et l'importer de nouveau.

## Où le trouver

Modifier la carte et passer l'éditeur en **Avancé**. Le choix se trouve dans la section **Intégration**, les boutons dans la section **Import, export et personnalisation** :

- **Profil du fabricant** : choix du profil
- **Exporter le profil** : enregistre le profil choisi comme fichier dans le dossier des téléchargements
- **Importer un profil** : lit un fichier de profil et sélectionne le profil
- **Supprimer le profil personnel** : n'apparaît que pour un profil personnel ou modifié

## Démarrage rapide

1. Choisissez **Panasonic Aquarea, HeishaMon by Lutarym** et appuyez sur **Exporter le profil**. Le fichier sert de modèle.
2. Cherchez les entités de votre pompe dans Home Assistant : **Developer tools → States** (noms du menu en anglais), filtrer par exemple avec le nom de l'appareil.
3. Ouvrez le fichier dans un éditeur de texte. Modifiez `id`, `name`, `hersteller`, `integration` et `namensteil` et indiquez vos entités sous `felder`. Supprimez simplement les champs que vous n'avez pas.
4. Appuyez sur **Importer un profil** et choisissez le fichier. La carte indique combien de champs sont décrits et combien elle en a trouvé dans Home Assistant.
5. Appuyez sur **Reprendre de l'intégration**. C'est seulement alors que les entités trouvées sont attribuées aux champs.
6. Vérifiez les champs dans l'éditeur et corrigez-les à la main si nécessaire.

## Structure du fichier

Les clés sont en allemand et doivent rester exactement ainsi.

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 1,
  "id": "meine_waermepumpe",
  "name": "Meine Wärmepumpe",
  "hersteller": "Beispiel",
  "integration": "",
  "namensteil": "waermepumpe",
  "felder": {
    "outside_temp": ["sensor.waermepumpe_aussentemperatur"],
    "flow_temp": ["sensor.*_vorlauf"],
    "return_temp": ["ruecklauf"],
    "dhw_temp": ["sensor.waermepumpe_warmwasser_ist"],
    "dhw_target": ["number.waermepumpe_warmwasser_soll"]
  }
}
```

| Clé | Obligatoire | Signification |
|---|---|---|
| `format` | oui | toujours `"lutarym-geraeteprofil"` |
| `version` | oui | toujours `1` |
| `id` | oui | identifiant, 2 à 40 caractères, seulement lettres minuscules a à z, chiffres, `_` et `-` |
| `name` | non | nom dans la liste de choix |
| `hersteller` | non | fabricant, pour information |
| `integration` | non | nom de l'intégration dans Home Assistant (voir plus bas) |
| `namensteil` | non | texte contenu dans tous les ID d'entité de la pompe, par exemple `"vaillant"` |
| `felder` | oui | pour chaque champ de la carte une liste de règles de recherche |

## Règles de recherche

Chaque champ a une liste de règles. Une règle seule peut aussi s'écrire sans crochets. Il en existe trois sortes :

| Règle | Exemple | Correspond à |
|---|---|---|
| avec un point | `"sensor.pac_depart"` | exactement cette entité |
| avec une étoile `*` | `"sensor.*_depart"` | tout ID d'entité suivant ce modèle, l'étoile remplace n'importe quel texte |
| sans point ni étoile | `"depart"` | les ID d'entité se terminant par `_depart`, ou les entités de l'intégration avec cette clé interne (translation_key) |

L'ID d'entité exact est le plus fiable. Les modèles et terminaisons sont utiles si un profil doit aussi fonctionner chez d'autres, dont les ID d'entité contiennent par exemple une autre adresse IP.

Autres règles :

- Chaque champ n'accepte que certains types d'entité (colonne « Types d'entité autorisés » de la liste des champs). Si le type ne convient pas, l'entité n'y est pas inscrite.
- Si une entité en lecture seule et une entité réglable correspondent au même champ, l'entité réglable l'emporte, afin que la valeur puisse être réglée dans la carte.
- Majuscules et minuscules ne comptent pas pour les modèles et terminaisons.

## Comment la recherche fonctionne

- **Avec `integration`** : la carte ne cherche que parmi les entités de cette intégration. Le nom apparaît dans la barre d'adresse quand vous ouvrez l'intégration sous **Settings → Devices & services** (noms du menu en anglais) : la partie après `/integration/`. Si rien n'est trouvé, la carte continue comme sans `integration`.
- **Sans `integration`** : la carte cherche parmi toutes les entités. Avec `namensteil`, seulement celles dont l'ID contient ce texte. Sans `namensteil`, une terminaison comme `"depart"` peut aussi toucher d'autres entités ; utilisez alors des ID exacts ou des modèles.

## Adapter Panasonic

1. Choisir **Panasonic Aquarea, HeishaMon by Lutarym** puis **Exporter le profil**.
2. Modifier les champs souhaités dans le fichier. L'`id` reste `heishamon_lutarym`.
3. **Importer un profil**. La liste affiche maintenant votre nom avec « (modifié) ».
4. **Supprimer le profil personnel** rétablit le profil intégré.

Avec une nouvelle `id`, un profil personnel supplémentaire est créé à la place.

## Où le profil est enregistré

Les profils importés sont enregistrés dans la configuration de cette carte sous `profile_custom`. Ils ne valent que pour cette carte. **Enregistrer dans un fichier** dans la section Import, export et personnalisation inclut le profil, et **Charger un fichier** dans une autre carte l'y transfère. Sinon, importez le fichier de profil dans chaque carte.

## Ce qu'un profil ne change pas

- L'aide (« ? ») explique les valeurs de HeishaMon. Pour d'autres fabricants, ces explications ne conviennent pas.
- Le coefficient annuel derrière la porte utilise les puissances de HeishaMon. Pour d'autres fabricants, il reste vide.
- La carte attend les valeurs comme HeishaMon les fournit : températures en °C, puissance en W, énergie en kWh, débit en l/min et pression en bar.

## Messages à l'import

| Message | Cause |
|---|---|
| JSON non valide | le fichier n'est pas du JSON, souvent une virgule ou une accolade manque |
| pas un fichier de profil | `format` manque ou est faux |
| version de profil non prise en charge | `version` n'est pas `1` |
| identifiant manquant ou non valide | `id` ne respecte pas les règles ci-dessus |
| aucun champ connu | `felder` manque ou ne contient que des noms de champ inconnus |
| champs inconnus ignorés | ces noms de champ n'existent pas dans la carte, le reste a été repris |

## Liste des champs

La colonne « Panasonic (HeishaMon) » montre les clés du profil intégré, ce qui aide à l'attribution.

**Sonde extérieure**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `outside_temp` | Température extérieure | tous | `top14` |

**Unité extérieure**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `power_state` | État de la pompe à chaleur, LED verte | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `setheatpump` |
| `compressor` | Fréquence du compresseur | tous | `top8` |
| `fan1_rpm` | Vitesse ventilateur 1 | tous | `top62` |
| `fan2_rpm` | Vitesse ventilateur 2 | tous | `top63` |
| `defrost` | Dégivrage en cours | tous | `top26` |
| `error` | Code d'erreur | tous | `top44` |
| `heatpump_state` | État de fonctionnement | tous | `top0` |
| `force_defrost` | Forcer le dégivrage | `switch`, `input_boolean` | `setforcedefrost` |
| `powerful_mode` | Mode puissance | `select`, `input_select` | `setpowerfulmode` |
| `quiet_mode` | Mode silencieux | `select`, `input_select` | `setquietmode` |
| `power_now` | Puissance absorbée actuelle | tous | (aucun) |
| `energy_today` | Compteur d'énergie | tous | (aucun) |

**SG Ready**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `pv_power` | Puissance PV actuelle | tous | (aucun) |
| `sg_k1` | Contact K1, blocage | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (aucun) |
| `sg_k2` | Contact K2, démarrage | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (aucun) |

**Circuit primaire**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `flow_temp` | Température de départ | tous | `top6` |
| `return_temp` | Température de retour | tous | `top5` |
| `pump_speed` | Vitesse de la pompe primaire | tous | `top65` |
| `pump_flow` | Débit | tous | `top1` |
| `three_way_valve` | Vanne trois voies | tous | `top20` |
| `water_pressure` | Pression d'eau | tous | `top115` |
| `heater_internal` | Appoint interne en marche | tous | `top60` |
| `heater_external` | Appoint externe en marche | tous | `top61` |

**Ballon tampon**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_temp` | Température du ballon tampon | tous | `top46` |
| `buffer_installed` | Ballon tampon présent | tous | `top99` |
| `buffer_switch` | Mode tampon marche et arrêt | `switch`, `input_boolean` | `setbuffer` |

**Courbe de chauffe**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `curve_t_high` | Circuit 1 courbe, départ haut | tous | `top29` |
| `curve_t_low` | Circuit 1 courbe, départ bas | tous | `top30` |
| `curve_o_high` | Circuit 1 courbe, extérieur haut | tous | `top31` |
| `curve_o_low` | Circuit 1 courbe, extérieur bas | tous | `top32` |
| `curve2_t_high` | Circuit 2 courbe, départ haut | tous | `top82` |
| `curve2_t_low` | Circuit 2 courbe, départ bas | tous | `top83` |
| `curve2_o_high` | Circuit 2 courbe, extérieur haut | tous | `top84` |
| `curve2_o_low` | Circuit 2 courbe, extérieur bas | tous | `top85` |

**Ballon tampon**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_delta` | Hystérésis du ballon tampon | tous | `top113` |
| `buffer_target` | Température cible du ballon tampon | tous | `top7` |
| `cop_heating` | COP chauffage | tous | `cop_heating` |
| `room_heater` | Appoint chauffage autorisé | tous | `top59` |
| `room_heater_switch` | Autoriser l'appoint chauffage | `switch`, `input_boolean` | `setroomheaterstate` |

**Circuit 1**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `zones_state` | Zones actives | tous | `top94` |
| `zones_select` | Changer de zones | `select`, `input_select` | `setzones` |
| `hk1_water` | Circuit 1 température d'eau | tous | `top36` |
| `hk1_water_target` | Circuit 1 consigne d'eau | tous | `top42` |
| `hk1_pump` | Circuit 1 pompe en marche | tous | `top124` |
| `hk1_setpoint` | Circuit 1 consigne réglable | `number`, `input_number` | `top27` |
| `hk1_switch` | Circuit 1 marche et arrêt | `switch`, `input_boolean` | (aucun) |

**Circuit 2**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `hk2_water` | Circuit 2 température d'eau | tous | `top37` |
| `hk2_water_target` | Circuit 2 consigne d'eau | tous | `top43` |
| `hk2_pump` | Circuit 2 pompe en marche | tous | `top123` |
| `hk2_setpoint` | Circuit 2 consigne réglable | `number`, `input_number` | `top34` |
| `hk2_switch` | Circuit 2 marche et arrêt | `switch`, `input_boolean` | (aucun) |

**Eau chaude**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `dhw_installed` | Eau chaude présente | tous | `top100` |
| `dhw_temp` | Température de l'eau chaude | tous | `top10` |
| `dhw_heat_delta` | Hystérésis de l'eau chaude | tous | `top22` |
| `dhw_setpoint` | Consigne eau chaude | `number`, `input_number` | `top9` |
| `cop_dhw` | COP eau chaude | tous | `cop_dhw` |
| `dhw_heater` | Appoint eau chaude autorisé | tous | `top58` |
| `dhw_force` | Chauffe unique | `switch`, `input_boolean` | `setforcedhw` |
| `dhw_force_state` | Chauffe en cours | tous | `top2` |
| `force_sterilization` | Démarrer le cycle légionelles | `switch`, `input_boolean` | `setforcesterilization` |
| `sterilization_state` | Cycle légionelles en cours | tous | `top69` |
| `dhw_heater_switch` | Autoriser l'appoint eau chaude | `switch`, `input_boolean` | `setdhwheaterstate` |
| `circulation_pump` | Pompe de circulation en marche | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (aucun) |
| `circ_switch` | Interrupteur de circulation (cliquable) | `switch`, `input_boolean` | (aucun) |

**Commande**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `mode_select` | Changer de mode | `select`, `input_select` | `setoperationmode` |

**Réglages avancés**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `heating_off_temp` | Arrêt chauffage au-dessus de | tous | `top77` |
| `heater_on_temp` | Appoint actif en dessous de | tous | `top78` |
| `heat_delta` | Écart chauffage (ΔT) | tous | `top23` |
| `heating_control` | Régulation | `select`, `input_select` | `setheatingcontrol` |
| `steril_temp` | Température anti-légionelles | tous | `top70` |
| `steril_time` | Durée anti-légionelles | tous | `top71` |
| `pump_flow_mode` | Régulation de pompe | `select`, `input_select` | `setpumpflowratemode` |
| `pump_max_duty` | Puissance max. pompe | tous | `top95` |
| `quiet_priority` | Priorité mode silencieux | `select`, `input_select` | `setquietmodepriority` |
| `holiday_mode` | Mode vacances | `switch`, `input_boolean` | `setholidaymode` |
| `main_schedule` | Programme hebdomadaire | `switch`, `input_boolean` | `setmainschedule` |
| `smart_dhw` | Smart DHW eau chaude | `select`, `input_select` | `setsmartdhw` |
| `operating_hours` | Heures de fonctionnement | tous | `top11` |
| `compressor_starts` | Démarrages du compresseur | tous | `top12` |
| `room_heater_hours` | Heures appoint chauffage | tous | `top90` |
| `dhw_heater_hours` | Heures appoint eau chaude | tous | `top91` |

**Commande**

| Champ | Signification | Types d'entité autorisés | Panasonic (HeishaMon) |
|---|---|---|---|
| `operating_mode` | Mode de fonctionnement (affichage) | tous | `top4` |
