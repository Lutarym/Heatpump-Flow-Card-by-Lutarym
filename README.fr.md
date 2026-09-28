# Heatpump Flow Card by Lutarym

[English](README.md) · [Deutsch](README.de.md) · **Français** · [日本語](README.ja.md)

![Capture d'écran de la carte](https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/docs/screenshot-fr.png)

Carte Lovelace animée pour Home Assistant qui affiche une pompe à chaleur Panasonic Aquarea sous forme de schéma d'installation vivant, reliée par HeishaMon.

## Fonctions

- Schéma de l'installation avec unité extérieure, ballon tampon, un ou deux circuits de chauffage, ballon d'eau chaude et circulation
- Animation du débit qui suit l'hydraulique réelle : vanne trois voies, pompes, compresseur et ballon tampon
- Coloration selon la température des ballons, radiateurs et tuyaux
- Courbe de chauffe des circuits 1 et 2 dans une fenêtre dédiée, avec échelle, point de fonctionnement et points réglables
- Graphique de consommation sur 24 heures, coloré selon chauffage, eau chaude et veille, avec l'historique SG Ready en dessous
- Installations sans ballon tampon, détectées automatiquement via TOP99 ou réglées manuellement
- Disposition paysage et portrait
- Éditeur visuel avec détection automatique de l'intégration, import et export de la configuration
- Quatre langues : anglais, allemand, français et japonais

## Prérequis

- Home Assistant 2024.1.0 ou plus récent
- HeishaMon, relié soit par l'intégration HeishaMon by Lutarym, soit par MQTT
- Pour écrire la courbe de chauffe via MQTT : l'intégration MQTT de Home Assistant

## Installation

### HACS

1. Ouvrir HACS, menu à trois points, Dépôts personnalisés
2. Dépôt : `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, catégorie : **Dashboard**
3. Rechercher la carte et la télécharger
4. HACS enregistre la ressource automatiquement. Si vos tableaux de bord sont en mode YAML, ajoutez-la vous-même, voir ci-dessous
5. Recharger le navigateur sans cache

### Manuelle

1. Télécharger `heatpump-flow-card-by-lutarym.js` depuis la dernière version publiée
2. La copier dans `<config>/www/community/heatpump-flow-card-by-lutarym/`
3. Paramètres, Tableaux de bord, menu à trois points, Ressources, ajouter une ressource
4. URL `/local/community/heatpump-flow-card-by-lutarym/heatpump-flow-card-by-lutarym.js`, type **module JavaScript**

## Configuration

Le plus simple est l'éditeur visuel : ajouter la carte, puis appuyer sur **Reprendre de l'intégration**. La carte détecte elle-même les entités de HeishaMon by Lutarym. Les entités non trouvées peuvent être attribuées à la main.

### Exemple en YAML

```yaml
type: custom:heatpump-flow-card-by-lutarym
layout: quer
hk_count: 2
language: auto
entities:
  outside_temp: sensor.heishamon_top14
  flow_temp: sensor.heishamon_top6
  return_temp: sensor.heishamon_top5
  compressor: sensor.heishamon_top8
  three_way_valve: sensor.heishamon_top20
  buffer_temp: sensor.heishamon_top46
  dhw_temp: sensor.heishamon_top10
  hk1_water: sensor.heishamon_top36
  hk1_water_target: sensor.heishamon_top42
```

Les identifiants sont les noms par défaut de la carte. Vos entités peuvent porter d'autres noms, l'éditeur les attribue automatiquement.

### Options

| Option | Défaut | Signification |
|---|---|---|
| `layout` | `quer` | `quer` paysage, `hoch` portrait |
| `hk_count` | `2` | Nombre de circuits, 1 ou 2 |
| `fan_count` | `2` | Nombre de ventilateurs, 1 ou 2 |
| `language` | `auto` | `auto`, `de`, `en`, `fr` ou `ja` |
| `profil` | `heishamon_lutarym` | `heishamon_lutarym` ou `heishamon` pour le nommage MQTT |
| `buffer_present` | `auto` | Ballon tampon : `auto` via TOP99, `true` ou `false` |
| `circulation_present` | `auto` | Circulation : `auto` dès qu'une entité est attribuée, `true` ou `false` |
| `show_history` | `true` | Afficher le graphique de consommation |
| `history_width` | `450` | Largeur du graphique, 250 à 700 |
| `card_width` | `0` | Largeur en pixels, 0 = automatique |
| `card_height` | `0` | Hauteur en pixels, 0 = automatique |
| `pipe_inner_mm` | `0` | Diamètre intérieur en mm, colore le débit, 0 = désactivé |
| `mqtt_prefix` | `panasonic_heat_pump` | Préfixe MQTT de HeishaMon |
| `curve_x_min / curve_x_max` | `-20 / 20` | Échelle extérieure de la courbe en °C |
| `curve_y_min / curve_y_max` | `20 / 75` | Échelle de départ de la courbe en °C |
| `scale_min / scale_max` | `20 / 60` | Échelle de couleur du chauffage en °C |
| `outdoor_min / outdoor_max` | `-15 / 35` | Échelle de couleur de la sonde extérieure en °C |
| `label_hk1, label_hk2, label_buffer, label_dhw, label_energy` | | Noms personnalisés, vide = langue de la carte |
| `energy_daily` | `true` | Calculer la consommation du jour à partir du compteur |
| `animate` | `true` | Afficher l'animation |
| `demo` | `false` | Valeurs d'exemple pour essayer |

### Entités

Tous les champs sont facultatifs. Un champ sans entité est masqué sur la carte. Lorsqu'un nom de commande est indiqué, la carte peut écrire la valeur via HeishaMon.

| Clé | Signification | Remarque |
|---|---|---|
| **Sonde extérieure** | | |
| `outside_temp` | Température extérieure | TOP14 |
| **Unité extérieure** | | |
| `power_state` | État de la pompe à chaleur, LED verte | SetHeatpump ou TOP0 |
| `compressor` | Fréquence du compresseur | TOP8 |
| `fan1_rpm` | Vitesse ventilateur 1 | TOP62 |
| `fan2_rpm` | Vitesse ventilateur 2 | TOP63 |
| `defrost` | Dégivrage en cours | TOP26 |
| `error` | Code d'erreur | TOP44 |
| `heatpump_state` | État de fonctionnement | TOP0 |
| `force_defrost` | Forcer le dégivrage | SetForceDefrost, switch |
| `powerful_mode` | Mode puissance | SetPowerfulMode, select |
| `quiet_mode` | Mode silencieux | SetQuietMode, select |
| `power_now` | Puissance absorbée actuelle | Shelly PM, Watt |
| `energy_today` | Compteur d'énergie | Shelly PM, kWh |
| **SG Ready** | | |
| `pv_power` | Puissance PV actuelle | entité propre, watts |
| `sg_k1` | Contact K1, blocage | Shelly, relais ou entrée |
| `sg_k2` | Contact K2, démarrage | Shelly, relais ou entrée |
| **Circuit primaire** | | |
| `flow_temp` | Température de départ | TOP6 |
| `return_temp` | Température de retour | TOP5 |
| `pump_speed` | Vitesse de la pompe primaire | TOP65 |
| `pump_flow` | Débit | TOP1 |
| `three_way_valve` | Vanne trois voies | TOP20 |
| `water_pressure` | Pression d'eau | TOP115 |
| **Ballon tampon** | | |
| `buffer_temp` | Température du ballon tampon | TOP46 |
| `buffer_installed` | Ballon tampon présent | TOP99 |
| `buffer_switch` | Mode tampon marche et arrêt | SetBuffer, switch |
| **Courbe de chauffe** | | |
| `curve_t_high` | Circuit 1 courbe, départ haut | TOP29 |
| `curve_t_low` | Circuit 1 courbe, départ bas | TOP30 |
| `curve_o_high` | Circuit 1 courbe, extérieur haut | TOP31 |
| `curve_o_low` | Circuit 1 courbe, extérieur bas | TOP32 |
| `curve2_t_high` | Circuit 2 courbe, départ haut | TOP82 |
| `curve2_t_low` | Circuit 2 courbe, départ bas | TOP83 |
| `curve2_o_high` | Circuit 2 courbe, extérieur haut | TOP84 |
| `curve2_o_low` | Circuit 2 courbe, extérieur bas | TOP85 |
| **Ballon tampon** | | |
| `buffer_delta` | Hystérésis du ballon tampon | TOP113 |
| `buffer_target` | Température cible du ballon tampon | TOP7, consigne départ |
| `room_heater` | Appoint électrique chauffage | TOP59 |
| `room_heater_switch` | Commande appoint chauffage | SetRoomHeaterState, switch |
| **Circuit 1** | | |
| `zones_state` | Zones actives | TOP94, vaut pour les deux |
| `zones_select` | Changer de zones | SetZones, vaut pour les deux |
| `hk1_water` | Circuit 1 température d'eau | TOP36 |
| `hk1_water_target` | Circuit 1 consigne d'eau | TOP42 |
| `hk1_pump` | Circuit 1 pompe en marche | TOP124 |
| `hk1_setpoint` | Circuit 1 consigne réglable | TOP27, number |
| `hk1_switch` | Circuit 1 marche et arrêt | interrupteur propre, facultatif |
| **Circuit 2** | | |
| `hk2_water` | Circuit 2 température d'eau | TOP37 |
| `hk2_water_target` | Circuit 2 consigne d'eau | TOP43 |
| `hk2_pump` | Circuit 2 pompe en marche | TOP123 |
| `hk2_setpoint` | Circuit 2 consigne réglable | TOP34, number |
| `hk2_switch` | Circuit 2 marche et arrêt | interrupteur propre, facultatif |
| **Eau chaude** | | |
| `dhw_installed` | Eau chaude présente | TOP100 |
| `dhw_temp` | Température de l'eau chaude | TOP10 |
| `dhw_heat_delta` | Hystérésis de l'eau chaude | TOP22 |
| `dhw_setpoint` | Consigne eau chaude | TOP9, number |
| `dhw_heater` | Appoint électrique eau chaude | TOP58 |
| `dhw_force` | Chauffe unique | SetForceDHW, switch |
| `dhw_force_state` | Chauffe en cours | TOP2 |
| `force_sterilization` | Démarrer le cycle légionelles | SetForceSterilization, switch |
| `sterilization_state` | Cycle légionelles en cours | TOP69 |
| `dhw_heater_switch` | Commande appoint eau chaude | SetDHWHeaterState, switch |
| `circulation_pump` | Pompe de circulation en marche | Shelly ou interrupteur propre |
| `circ_switch` | Interrupteur de circulation (cliquable) | interrupteur pour la circulation |
| **Commande** | | |
| `mode_select` | Changer de mode | SetOperationMode, select |

## Langues

La carte suit la langue de Home Assistant. Si elle n'est pas prise en charge, l'anglais est utilisé. Une langue fixe peut être définie avec `language`.

## Modifications

Voir [CHANGELOG.md](CHANGELOG.md).

## Licence

GNU General Public License v3.0, voir [LICENSE](LICENSE).
