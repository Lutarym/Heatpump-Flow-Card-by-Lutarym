# Heatpump Flow Card by Lutarym

[English](README.md) · **Deutsch** · [Français](README.fr.md) · [日本語](README.ja.md)

![Screenshot der Karte](https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/docs/screenshot-de.png)

Animierte Lovelace-Karte für Home Assistant, die eine Panasonic-Aquarea-Wärmepumpe als lebendiges Anlagenschema zeigt, angebunden über HeishaMon.

## Funktionen

- Anlagenschema mit Außengerät, Heizungspuffer, einem oder zwei Heizkreisen, Warmwasserspeicher und Zirkulation
- Fließanimation, die der tatsächlichen Hydraulik folgt: Umschaltventil, Pumpen, Verdichter und Puffer
- Temperaturabhängige Einfärbung von Speichern, Heizkörpern und Leitungen
- Heizkurve für Heizkreis 1 und 2 in einem eigenen Fenster, mit Skala, Betriebspunkt und einstellbaren Eckwerten
- Verbrauchsverlauf der letzten 24 Stunden, gefärbt nach Heizung, Warmwasser und Standby, darunter der SG-Ready-Verlauf
- Anlagen ohne Heizungspuffer, automatisch erkannt über TOP99 oder fest einstellbar
- Quer- und Hochformat
- Grafischer Editor mit automatischer Erkennung der Integration, Konfiguration aus- und einlesen
- Vier Sprachen: Englisch, Deutsch, Französisch und Japanisch

## Voraussetzungen

- Home Assistant 2024.1.0 oder neuer
- HeishaMon, angebunden entweder über die Integration HeishaMon by Lutarym oder über MQTT
- Zum Schreiben der Heizkurve über MQTT: die MQTT-Integration in Home Assistant

## Installation

### HACS

1. HACS öffnen, Menü mit den drei Punkten, Benutzerdefinierte Repositories
2. Repository: `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, Kategorie: **Dashboard**
3. Die Karte suchen und herunterladen
4. HACS legt die Ressource selbst an. Laufen deine Dashboards im YAML-Modus, trage sie selbst ein, siehe unten
5. Browser ohne Zwischenspeicher neu laden

### Manuell

1. `heatpump-flow-card-by-lutarym.js` aus dem neuesten Release herunterladen
2. Nach `<config>/www/community/heatpump-flow-card-by-lutarym/` kopieren
3. Einstellungen, Dashboards, Menü mit den drei Punkten, Ressourcen, Ressource hinzufügen
4. URL `/local/community/heatpump-flow-card-by-lutarym/heatpump-flow-card-by-lutarym.js`, Typ **JavaScript-Modul**

## Konfiguration

Am einfachsten über den grafischen Editor: Karte hinzufügen und **Aus Integration übernehmen** drücken. Die Karte erkennt die Entitäten von HeishaMon by Lutarym selbst. Nicht gefundene Entitäten lassen sich von Hand zuordnen.

### Beispiel in YAML

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

Die Entitäts-IDs sind die Standardnamen der Karte. Deine Entitäten können anders heißen, der Editor ordnet sie selbst zu.

### Optionen

| Option | Vorgabe | Bedeutung |
|---|---|---|
| `layout` | `quer` | `quer` Querformat, `hoch` Hochformat |
| `hk_count` | `2` | Anzahl der Heizkreise, 1 oder 2 |
| `fan_count` | `2` | Anzahl der Lüfter, 1 oder 2 |
| `language` | `auto` | `auto`, `de`, `en`, `fr` oder `ja` |
| `profil` | `heishamon_lutarym` | `heishamon_lutarym` oder `heishamon` für das MQTT-Namensschema |
| `buffer_present` | `auto` | Heizungspuffer: `auto` aus TOP99, `true` oder `false` |
| `circulation_present` | `auto` | Zirkulation: `auto` sobald eine Entität zugeordnet ist, `true` oder `false` |
| `show_history` | `true` | Verbrauchsverlauf anzeigen |
| `history_width` | `450` | Breite des Verbrauchsverlaufs, 250 bis 700 |
| `card_width` | `0` | Breite in Pixeln, 0 ist automatisch |
| `card_height` | `0` | Höhe in Pixeln, 0 ist automatisch |
| `pipe_inner_mm` | `0` | Rohrinnendurchmesser in mm, färbt den Durchfluss, 0 ist aus |
| `mqtt_prefix` | `panasonic_heat_pump` | MQTT-Präfix von HeishaMon |
| `curve_x_min / curve_x_max` | `-20 / 20` | Außenskala der Heizkurve in °C |
| `curve_y_min / curve_y_max` | `20 / 75` | Vorlaufskala der Heizkurve in °C |
| `scale_min / scale_max` | `20 / 60` | Farbskala der Heizung in °C |
| `outdoor_min / outdoor_max` | `-15 / 35` | Farbskala des Außenfühlers in °C |
| `label_hk1, label_hk2, label_buffer, label_dhw, label_energy` | | Eigene Namen, leer nimmt die Kartensprache |
| `energy_daily` | `true` | Tagesverbrauch aus dem Zählerstand rechnen |
| `animate` | `true` | Bewegung anzeigen |
| `demo` | `false` | Beispielwerte zum Ausprobieren |

### Entitäten

Alle Felder sind optional. Ein Feld ohne Entität wird auf der Karte ausgeblendet. Wo ein Befehlsname steht, kann die Karte den Wert über HeishaMon schreiben.

| Schlüssel | Bedeutung | Hinweis |
|---|---|---|
| **Außenfühler** | | |
| `outside_temp` | Außentemperatur | TOP14 |
| **Außengerät** | | |
| `power_state` | Wärmepumpe Status, grüne LED | SetHeatpump oder TOP0 |
| `compressor` | Verdichterdrehzahl | TOP8 |
| `fan1_rpm` | Lüfter 1 Drehzahl | TOP62 |
| `fan2_rpm` | Lüfter 2 Drehzahl | TOP63 |
| `defrost` | Abtauung läuft | TOP26 |
| `error` | Fehlercode | TOP44 |
| `heatpump_state` | Betriebszustand | TOP0 |
| `force_defrost` | Abtauen erzwingen | SetForceDefrost, switch |
| `powerful_mode` | Turbomodus | SetPowerfulMode, select |
| `quiet_mode` | Leisemodus | SetQuietMode, select |
| `power_now` | Aktuelle Leistungsaufnahme | Shelly PM, Watt |
| `energy_today` | Energiezähler | Shelly PM, kWh |
| **SG Ready** | | |
| `pv_power` | PV Leistung aktuell | eigene Entität, Watt |
| `sg_k1` | Kontakt K1 Sperre | Shelly, Relais oder Eingang |
| `sg_k2` | Kontakt K2 Anlauf | Shelly, Relais oder Eingang |
| **Primärkreis** | | |
| `flow_temp` | Vorlauftemperatur | TOP6 |
| `return_temp` | Rücklauftemperatur | TOP5 |
| `pump_speed` | Primärpumpe Drehzahl | TOP65 |
| `pump_flow` | Durchflussmenge | TOP1 |
| `three_way_valve` | 3-Wege-Umschaltventil | TOP20 |
| `water_pressure` | Wasserdruck | TOP115 |
| **Heizungspuffer** | | |
| `buffer_temp` | Puffertemperatur | TOP46 |
| `buffer_installed` | Puffer vorhanden | TOP99 |
| `buffer_switch` | Pufferbetrieb ein und aus | SetBuffer, switch |
| **Heizkurve** | | |
| `curve_t_high` | HK1 Heizkurve Vorlauf oben | TOP29 |
| `curve_t_low` | HK1 Heizkurve Vorlauf unten | TOP30 |
| `curve_o_high` | HK1 Heizkurve Außen oben | TOP31 |
| `curve_o_low` | HK1 Heizkurve Außen unten | TOP32 |
| `curve2_t_high` | HK2 Heizkurve Vorlauf oben | TOP82 |
| `curve2_t_low` | HK2 Heizkurve Vorlauf unten | TOP83 |
| `curve2_o_high` | HK2 Heizkurve Außen oben | TOP84 |
| `curve2_o_low` | HK2 Heizkurve Außen unten | TOP85 |
| **Heizungspuffer** | | |
| `buffer_delta` | Puffer Hysterese | TOP113 |
| `buffer_target` | Puffer Zieltemperatur | TOP7, Soll Vorlauf |
| `room_heater` | Heizstab Heizung | TOP59 |
| `room_heater_switch` | Heizstab Heizung schalten | SetRoomHeaterState, switch |
| **Heizkreis 1** | | |
| `zones_state` | Aktivierte Zonen | TOP94, gilt für beide |
| `zones_select` | Zonen umschalten | SetZones, gilt für beide |
| `hk1_water` | HK1 Wassertemperatur | TOP36 |
| `hk1_water_target` | HK1 Wasser Sollwert | TOP42 |
| `hk1_pump` | HK1 Pumpe läuft | TOP124 |
| `hk1_setpoint` | HK1 Sollwert einstellbar | TOP27, number |
| `hk1_switch` | HK1 ein und aus | eigener Schalter, optional |
| **Heizkreis 2** | | |
| `hk2_water` | HK2 Wassertemperatur | TOP37 |
| `hk2_water_target` | HK2 Wasser Sollwert | TOP43 |
| `hk2_pump` | HK2 Pumpe läuft | TOP123 |
| `hk2_setpoint` | HK2 Sollwert einstellbar | TOP34, number |
| `hk2_switch` | HK2 ein und aus | eigener Schalter, optional |
| **Warmwasser** | | |
| `dhw_installed` | Warmwasser vorhanden | TOP100 |
| `dhw_temp` | Warmwasser Isttemperatur | TOP10 |
| `dhw_heat_delta` | Warmwasser Hysterese | TOP22 |
| `dhw_setpoint` | Warmwasser Sollwert | TOP9, number |
| `dhw_heater` | Heizstab Warmwasser | TOP58 |
| `dhw_force` | Einmalig aufheizen | SetForceDHW, switch |
| `dhw_force_state` | Aufheizen läuft | TOP2 |
| `force_sterilization` | Legionellenschutz starten | SetForceSterilization, switch |
| `sterilization_state` | Legionellenschutz läuft | TOP69 |
| `dhw_heater_switch` | Heizstab Warmwasser schalten | SetDHWHeaterState, switch |
| `circulation_pump` | Zirkulationspumpe läuft | Shelly oder eigener Schalter |
| `circ_switch` | Zirkulation Schalter (klickbar) | Switch zum Ein/Ausschalten der Zirkulation |
| **Steuerung** | | |
| `mode_select` | Betriebsart umschalten | SetOperationMode, select |

## Sprachen

Die Karte folgt der Sprache von Home Assistant. Wird diese nicht unterstützt, erscheint Englisch. Mit `language` lässt sich eine Sprache fest einstellen.

## Änderungen

Siehe [CHANGELOG.md](CHANGELOG.md).

## Lizenz

GNU General Public License v3.0, siehe [LICENSE](LICENSE).
