# Geräteprofile

[English](GERAETEPROFIL.md) · **Deutsch** · [Français](GERAETEPROFIL.fr.md) · [日本語](GERAETEPROFIL.ja.md)

Ein Geräteprofil sagt der Karte, wie die Entitäten deiner Wärmepumpe in Home Assistant heißen. Damit kann die Karte die Entitäten selbst finden und den Feldern zuordnen. So lassen sich Wärmepumpen anderer Hersteller anbinden, und das eingebaute Panasonic-Profil lässt sich anpassen.

Ein Profil ist eine kleine Textdatei im JSON-Format. Du kannst sie exportieren, mit einem Texteditor ändern und wieder importieren.

## Wo du es findest

Karte bearbeiten, Editor auf **Erweitert** stellen. Die Auswahl steht im Abschnitt **Integration**, die Knöpfe im Abschnitt **Import, Export und Anpassungen**:

- **Hersteller**: „Automatisch erkennen“ oder ein Hersteller (auch im einfachen Modus sichtbar)
- **Integration / Gerät**: erscheint, wenn ein Hersteller mehrere Integrationen hat, mit dem Namen des Entwicklers
- **Mehrere Integrationen erkannt**: erscheint bei „Automatisch erkennen“, wenn mehrere passen
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

## Eingebaute Herstellerprofile

Die Karte bringt Profile für die folgenden Integrationen mit. Die Suchregeln stammen aus dem Quelltext der jeweiligen Integration. An echten Anlagen getestet ist bisher nur HeishaMon by Lutarym, alle anderen sind als „ungetestet“ markiert. Rückmeldungen helfen, sie zu verbessern.

**Automatisch erkennen** (Standard) sucht alle Profile ab. Wird genau eine Integration gefunden, gilt sie. Werden mehrere gefunden, fragt der Editor, welche die Karte verwenden soll. Bis dahin gilt die mit den meisten passenden Feldern. Eine Integration gilt als gefunden, wenn mindestens zwei Felder passen.

| Hersteller | Integration | Entwickler | Domain | Felder |
|---|---|---|---|---|
| Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 76 |
| Panasonic Aquarea | HeishaMon (MQTT) | | | 76 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

Ohne Profil, mit Grund:

- `myuplink`: Entitätsnamen kommen dynamisch vom Gerät
- `wolflink`: Entitätsnamen kommen dynamisch vom Gerät
- `ebusd`: Namen hängen von der eigenen ebusd-Konfiguration ab
- `stiebel_eltron`: liefert nur eine Klima-Entität
- `bosch`: Entitätsnamen kommen dynamisch vom Gerät
- `tuya_heat_pump`: Datenpunkte je Gerät verschieden
- `toshiba_modbus`: Raumklimagerät
- `midea_heatpump_hws`: nur Warmwasser-Wärmepumpe
- `dimplex`: liefert keine Wärmepumpenwerte wie Vorlauf, Rücklauf oder Verdichter

## Suchregeln

Zu jedem Feld gehört eine Liste von Regeln. Eine einzelne Regel darf auch ohne eckige Klammern stehen. Es gibt vier Arten:

| Regel | Beispiel | Passt auf |
|---|---|---|
| mit Punkt | `"sensor.wp_vorlauf"` | genau diese Entität |
| mit Stern `*` | `"sensor.*_vorlauf"` | jede Entity-ID nach diesem Muster, der Stern steht für beliebigen Text |
| ohne Punkt und Stern | `"vorlauf"` | Entity-IDs, die auf `_vorlauf` enden, oder Entitäten der Integration mit diesem internen Schlüssel (translation_key) |
| mit Domain davor | `"sensor:vorlauf"` | wie ohne Punkt und Stern, aber nur Entitäten dieser Art, hier `sensor` |

Am verlässlichsten ist die genaue Entity-ID. Muster und Endungen sind praktisch, wenn ein Profil auch bei anderen funktionieren soll, deren Entity-IDs zum Beispiel eine andere IP-Adresse enthalten.

Weitere Regeln:

- Jedes Feld nimmt nur bestimmte Entitätsarten an (Spalte „Erlaubte Entitätsarten“ in der Feldliste). Passt die Art nicht, wird die Entität dort nicht eingetragen.
- Passen auf ein Feld eine nur lesbare und eine stellbare Entität, gewinnt die stellbare, damit sich der Wert in der Karte einstellen lässt.
- Gibt es zu einem Feld mehrere Regeln, gilt die erste, die etwas findet. Ein genauer Treffer (interner Schlüssel oder ganze Entity-ID) geht vor einem Treffer über die Endung.
- Groß- und Kleinschreibung spielt bei Mustern und Endungen keine Rolle.

## Wie gesucht wird

- **Mit `integration`**: Die Karte durchsucht nur die Entitäten dieser Integration. Den Namen siehst du in der Adresszeile, wenn du die Integration unter **Einstellungen → Geräte & Dienste** öffnest: der Teil nach `/integration/`. Findet die Karte dort nichts, sucht sie nur dann wie ohne `integration` weiter, wenn auch `namensteil` gesetzt ist. So treffen allgemeine Schlüssel wie `"outdoor_temperature"` keine fremden Entitäten.
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
