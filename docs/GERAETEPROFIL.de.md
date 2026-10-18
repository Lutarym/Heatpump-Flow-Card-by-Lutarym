# Geräteprofile

[English](GERAETEPROFIL.md) · **Deutsch** · [Français](GERAETEPROFIL.fr.md) · [日本語](GERAETEPROFIL.ja.md)

Ein Geräteprofil sagt der Karte, wie die Entitäten deiner Wärmepumpe in Home Assistant heißen. Damit kann die Karte die Entitäten selbst finden und den Feldern zuordnen. So lassen sich Wärmepumpen anderer Hersteller anbinden, und das eingebaute Panasonic-Profil lässt sich anpassen.

Ein Profil ist eine kleine Textdatei im JSON-Format. Du kannst sie exportieren, mit einem Texteditor ändern und wieder importieren.

## Wo du es findest

Karte bearbeiten, Editor auf **Erweitert** stellen. Die Auswahl steht im Abschnitt **Integration**, die Knöpfe im Abschnitt **Import, Export und Anpassungen**:

- **Herstellerprofil**: Auswahl des Profils
- **Profil exportieren**: speichert das gewählte Profil als Datei im Download-Ordner
- **Profil importieren**: liest eine Profildatei ein und wählt das Profil aus
- **Eigenes Profil entfernen**: erscheint nur bei einem eigenen oder angepassten Profil

## Schnellstart

1. Wähle **Panasonic Aquarea, HeishaMon by Lutarym** und drücke **Profil exportieren**. Die Datei dient als Vorlage.
2. Suche in Home Assistant die Entitäten deiner Wärmepumpe: **Entwicklerwerkzeuge → Zustände**, Filter zum Beispiel mit dem Gerätenamen.
3. Öffne die Datei in einem Texteditor. Ändere `id`, `name`, `hersteller`, `integration` und `namensteil` und trage unter `felder` deine Entitäten ein. Felder, die es bei dir nicht gibt, löschst du einfach.
4. Drücke **Profil importieren** und wähle die Datei. Die Karte meldet, wie viele Felder beschrieben sind und wie viele davon sie in Home Assistant gefunden hat.
5. Drücke **Aus Integration übernehmen**. Erst dann werden die gefundenen Entitäten den Feldern fest zugeordnet.
6. Prüfe im Editor die einzelnen Felder und korrigiere sie bei Bedarf von Hand.

## Aufbau der Datei

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

| Angabe | Pflicht | Bedeutung |
|---|---|---|
| `format` | ja | immer `"lutarym-geraeteprofil"` |
| `version` | ja | immer `1` |
| `id` | ja | Kennung, 2 bis 40 Zeichen, nur Kleinbuchstaben a bis z, Ziffern, `_` und `-` |
| `name` | nein | Name in der Auswahlliste |
| `hersteller` | nein | nur zur Information |
| `integration` | nein | Name der Integration in Home Assistant (siehe unten) |
| `namensteil` | nein | Textteil, den alle Entity-IDs der Wärmepumpe enthalten, zum Beispiel `"vaillant"` |
| `felder` | ja | je Feld der Karte eine Liste von Suchregeln |

## Suchregeln

Zu jedem Feld gehört eine Liste von Regeln. Eine einzelne Regel darf auch ohne eckige Klammern stehen. Es gibt drei Arten:

| Regel | Beispiel | Passt auf |
|---|---|---|
| mit Punkt | `"sensor.wp_vorlauf"` | genau diese Entität |
| mit Stern `*` | `"sensor.*_vorlauf"` | jede Entity-ID nach diesem Muster, der Stern steht für beliebigen Text |
| ohne Punkt und Stern | `"vorlauf"` | Entity-IDs, die auf `_vorlauf` enden, oder Entitäten der Integration mit diesem internen Schlüssel (translation_key) |

Am verlässlichsten ist die genaue Entity-ID. Muster und Endungen sind praktisch, wenn ein Profil auch bei anderen funktionieren soll, deren Entity-IDs zum Beispiel eine andere IP-Adresse enthalten.

Weitere Regeln:

- Jedes Feld nimmt nur bestimmte Entitätsarten an (Spalte „Erlaubte Entitätsarten“ in der Feldliste). Passt die Art nicht, wird die Entität dort nicht eingetragen.
- Passen auf ein Feld eine nur lesbare und eine stellbare Entität, gewinnt die stellbare, damit sich der Wert in der Karte einstellen lässt.
- Groß- und Kleinschreibung spielt bei Mustern und Endungen keine Rolle.

## Wie gesucht wird

- **Mit `integration`**: Die Karte durchsucht nur die Entitäten dieser Integration. Den Namen siehst du in der Adresszeile, wenn du die Integration unter **Einstellungen → Geräte & Dienste** öffnest: der Teil nach `/integration/`. Findet die Karte dort nichts, sucht sie wie ohne `integration` weiter.
- **Ohne `integration`**: Die Karte durchsucht alle Entitäten. Mit `namensteil` nur die, deren Entity-ID diesen Text enthält. Ohne `namensteil` kann eine Endung wie `"vorlauf"` auch fremde Entitäten treffen, dann besser genaue Entity-IDs oder Muster verwenden.

## Panasonic anpassen

1. **Panasonic Aquarea, HeishaMon by Lutarym** wählen und **Profil exportieren**.
2. In der Datei die gewünschten Felder ändern. Die `id` bleibt `heishamon_lutarym`.
3. **Profil importieren**. In der Auswahl steht jetzt dein Name mit dem Zusatz „(angepasst)“.
4. Mit **Eigenes Profil entfernen** gilt wieder das eingebaute Profil.

Gibst du eine neue `id`, entsteht stattdessen ein zusätzliches eigenes Profil.

## Wo das Profil gespeichert wird

Importierte Profile stehen in der Konfiguration dieser Karte unter `profile_custom`. Sie gelten nur für diese Karte. Mit **Als Datei speichern** im Abschnitt Import, Export und Anpassungen wird das Profil mitgespeichert, und mit **Aus Datei laden** in einer anderen Karte kommt es dort wieder an. Alternativ importierst du die Profildatei in jeder Karte einzeln.

## Was ein Profil nicht ändert

- Die Hilfe („?“) erklärt die Werte von HeishaMon. Bei anderen Herstellern passen diese Erklärungen nicht.
- Die Jahresarbeitszahl hinter der Tür rechnet mit den Leistungswerten von HeishaMon. Bei anderen Herstellern bleibt sie leer.
- Die Karte erwartet die Werte so, wie HeishaMon sie liefert: Temperaturen in °C, Leistung in W, Energie in kWh, Durchfluss in l/min und Druck in bar.

## Meldungen beim Import

| Meldung | Ursache |
|---|---|
| kein gültiges JSON | Die Datei ist kein JSON, oft fehlt ein Komma oder eine Klammer |
| keine Geräteprofil-Datei | `format` fehlt oder ist falsch |
| Profilversion nicht unterstützt | `version` ist nicht `1` |
| Kennung fehlt oder ist ungültig | `id` verletzt die Regeln oben |
| kein bekanntes Feld | `felder` fehlt oder enthält nur unbekannte Feldnamen |
| unbekannte Felder ignoriert | Diese Feldnamen gibt es in der Karte nicht, die übrigen wurden übernommen |

## Feldliste

Die Spalte „Panasonic (HeishaMon)“ zeigt die Schlüssel aus dem eingebauten Profil, das hilft beim Zuordnen.

**Außenfühler**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `outside_temp` | Außentemperatur | alle | `top14` |

**Außengerät**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `power_state` | Wärmepumpe Status, grüne LED | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `setheatpump` |
| `compressor` | Verdichterdrehzahl | alle | `top8` |
| `fan1_rpm` | Lüfter 1 Drehzahl | alle | `top62` |
| `fan2_rpm` | Lüfter 2 Drehzahl | alle | `top63` |
| `defrost` | Abtauung läuft | alle | `top26` |
| `error` | Fehlercode | alle | `top44` |
| `heatpump_state` | Betriebszustand | alle | `top0` |
| `force_defrost` | Abtauen erzwingen | `switch`, `input_boolean` | `setforcedefrost` |
| `powerful_mode` | Turbomodus | `select`, `input_select` | `setpowerfulmode` |
| `quiet_mode` | Leisemodus | `select`, `input_select` | `setquietmode` |
| `power_now` | Aktuelle Leistungsaufnahme | alle | (keins) |
| `energy_today` | Energiezähler | alle | (keins) |

**SG Ready**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `pv_power` | PV Leistung aktuell | alle | (keins) |
| `sg_k1` | Kontakt K1 Sperre | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (keins) |
| `sg_k2` | Kontakt K2 Anlauf | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (keins) |

**Primärkreis**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `flow_temp` | Vorlauftemperatur | alle | `top6` |
| `return_temp` | Rücklauftemperatur | alle | `top5` |
| `pump_speed` | Primärpumpe Drehzahl | alle | `top65` |
| `pump_flow` | Durchflussmenge | alle | `top1` |
| `three_way_valve` | 3-Wege-Umschaltventil | alle | `top20` |
| `water_pressure` | Wasserdruck | alle | `top115` |
| `heater_internal` | Heizstab intern läuft | alle | `top60` |
| `heater_external` | Heizstab extern läuft | alle | `top61` |

**Heizungspuffer**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_temp` | Puffertemperatur | alle | `top46` |
| `buffer_installed` | Puffer vorhanden | alle | `top99` |
| `buffer_switch` | Pufferbetrieb ein und aus | `switch`, `input_boolean` | `setbuffer` |

**Heizkurve**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `curve_t_high` | HK1 Heizkurve Vorlauf oben | alle | `top29` |
| `curve_t_low` | HK1 Heizkurve Vorlauf unten | alle | `top30` |
| `curve_o_high` | HK1 Heizkurve Außen oben | alle | `top31` |
| `curve_o_low` | HK1 Heizkurve Außen unten | alle | `top32` |
| `curve2_t_high` | HK2 Heizkurve Vorlauf oben | alle | `top82` |
| `curve2_t_low` | HK2 Heizkurve Vorlauf unten | alle | `top83` |
| `curve2_o_high` | HK2 Heizkurve Außen oben | alle | `top84` |
| `curve2_o_low` | HK2 Heizkurve Außen unten | alle | `top85` |

**Heizungspuffer**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_delta` | Puffer Hysterese | alle | `top113` |
| `buffer_target` | Puffer Zieltemperatur | alle | `top7` |
| `cop_heating` | COP Heizen | alle | `cop_heating` |
| `room_heater` | Heizstab Heizung freigegeben | alle | `top59` |
| `room_heater_switch` | Heizstab Heizung freigeben | `switch`, `input_boolean` | `setroomheaterstate` |

**Heizkreis 1**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `zones_state` | Aktivierte Zonen | alle | `top94` |
| `zones_select` | Zonen umschalten | `select`, `input_select` | `setzones` |
| `hk1_water` | HK1 Wassertemperatur | alle | `top36` |
| `hk1_water_target` | HK1 Wasser Sollwert | alle | `top42` |
| `hk1_pump` | HK1 Pumpe läuft | alle | `top124` |
| `hk1_setpoint` | HK1 Sollwert einstellbar | `number`, `input_number` | `top27` |
| `hk1_switch` | HK1 ein und aus | `switch`, `input_boolean` | (keins) |

**Heizkreis 2**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `hk2_water` | HK2 Wassertemperatur | alle | `top37` |
| `hk2_water_target` | HK2 Wasser Sollwert | alle | `top43` |
| `hk2_pump` | HK2 Pumpe läuft | alle | `top123` |
| `hk2_setpoint` | HK2 Sollwert einstellbar | `number`, `input_number` | `top34` |
| `hk2_switch` | HK2 ein und aus | `switch`, `input_boolean` | (keins) |

**Warmwasser**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `dhw_installed` | Warmwasser vorhanden | alle | `top100` |
| `dhw_temp` | Warmwasser Isttemperatur | alle | `top10` |
| `dhw_heat_delta` | Warmwasser Hysterese | alle | `top22` |
| `dhw_setpoint` | Warmwasser Sollwert | `number`, `input_number` | `top9` |
| `cop_dhw` | COP Warmwasser | alle | `cop_dhw` |
| `dhw_heater` | Heizstab Warmwasser freigegeben | alle | `top58` |
| `dhw_force` | Einmalig aufheizen | `switch`, `input_boolean` | `setforcedhw` |
| `dhw_force_state` | Aufheizen läuft | alle | `top2` |
| `force_sterilization` | Legionellenschutz starten | `switch`, `input_boolean` | `setforcesterilization` |
| `sterilization_state` | Legionellenschutz läuft | alle | `top69` |
| `dhw_heater_switch` | Heizstab Warmwasser freigeben | `switch`, `input_boolean` | `setdhwheaterstate` |
| `circulation_pump` | Zirkulationspumpe läuft | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (keins) |
| `circ_switch` | Zirkulation Schalter (klickbar) | `switch`, `input_boolean` | (keins) |

**Steuerung**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `mode_select` | Betriebsart umschalten | `select`, `input_select` | `setoperationmode` |

**Erweiterte Einstellungen**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `heating_off_temp` | Heizen aus ab Außentemperatur | alle | `top77` |
| `heater_on_temp` | Heizstab ein unter Außentemperatur | alle | `top78` |
| `heat_delta` | Spreizung Heizen | alle | `top23` |
| `heating_control` | Regelung | `select`, `input_select` | `setheatingcontrol` |
| `steril_temp` | Legionellen Temperatur | alle | `top70` |
| `steril_time` | Legionellen Haltezeit | alle | `top71` |
| `pump_flow_mode` | Pumpenregelung | `select`, `input_select` | `setpumpflowratemode` |
| `pump_max_duty` | Max. Pumpenleistung | alle | `top95` |
| `quiet_priority` | Leisemodus Vorrang | `select`, `input_select` | `setquietmodepriority` |
| `holiday_mode` | Urlaubsmodus | `switch`, `input_boolean` | `setholidaymode` |
| `main_schedule` | Wochenprogramm | `switch`, `input_boolean` | `setmainschedule` |
| `smart_dhw` | Smart DHW Warmwasser | `select`, `input_select` | `setsmartdhw` |
| `operating_hours` | Betriebsstunden | alle | `top11` |
| `compressor_starts` | Verdichterstarts | alle | `top12` |
| `room_heater_hours` | Heizstab Heizen Betriebsstunden | alle | `top90` |
| `dhw_heater_hours` | Heizstab Warmwasser Betriebsstunden | alle | `top91` |

**Steuerung**

| Feld | Bedeutung | Erlaubte Entitätsarten | Panasonic (HeishaMon) |
|---|---|---|---|
| `operating_mode` | Betriebsart (Anzeige) | alle | `top4` |
