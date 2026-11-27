# Namensliste

[English](NAMENSLISTE.md) · **Deutsch** · [Français](NAMENSLISTE.fr.md) · [日本語](NAMENSLISTE.ja.md)

Ab Version 6.0.0 benutzt die Karte intern nur noch die Namen aus dieser Liste: in der Konfiguration unter `entities` und in den [Geräteprofilen](GERAETEPROFIL.de.md). Ein Profil sagt nur, welche Entität zu welchem Namen gehört.

Die Namen von HeishaMon (TOP, XTOP, OPT und SET) stammen aus MQTT-Topics.md im Repository heishamon/HeishaMon (Commit e2b065e vom 16.11.2026, HeishaMon 4.4.1). Was HeishaMon nicht liefert, heißt EXT mit Nummer.

Frühere Feldnamen wie `outside_temp` gelten weiter. Die Karte stellt sie selbst auf die Namen um. Die Spalte „bisher“ zeigt sie.

## Regeln

1. Ein angezeigter Wert heißt wie sein TOP (oder XTOP, OPT). Ist die Entität stellbar (Zahl, Auswahl, Schalter), kann die Karte den Wert auch ändern.
2. Ein eigenes Bedienelement (Schalter oder Auswahl) heißt wie sein SET Befehl.
3. EXT: je Thema ein Block mit 100 Nummern, die Hunderterstelle zeigt das Thema (eigene Festlegung). Freie Nummern im Block sind Reserve für das Thema.
4. Gültig sind TOP0 bis TOP198, XTOP0 bis XTOP5, OPT0 bis OPT6, SET1 bis SET55 und EXT1 bis EXT999. Die Tabellen zeigen die Namen, die die Karte nutzt. Die übrigen Namen von HeishaMon sind für spätere Erweiterungen reserviert, ihre Bedeutung steht in MQTT-Topics.md.

Entitätsarten: welche Arten von Entitäten der Name annimmt, „alle“ heißt jede. Einheiten: was ein Profil angeben darf, die Karte rechnet es um ([Geräteprofile](GERAETEPROFIL.de.md#einheiten-und-zustände)).

## Werte von HeishaMon (TOP, XTOP, OPT)

| Name | Bedeutung | HeishaMon Topic | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|---|
| TOP0 | Betriebszustand | main/Heatpump_State | alle |  | `heatpump_state` |
| TOP1 | Durchflussmenge | main/Pump_Flow | alle | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min | `pump_flow` |
| TOP2 | Aufheizen läuft | main/Force_DHW_State | alle |  | `dhw_force_state` |
| TOP4 | Betriebsart (Anzeige) | main/Operating_Mode_State | alle |  | `operating_mode` |
| TOP5 | Rücklauftemperatur | main/Main_Inlet_Temp | alle |  | `return_temp` |
| TOP6 | Vorlauftemperatur | main/Main_Outlet_Temp | alle |  | `flow_temp` |
| TOP7 | Vorlauf-Soll Wärmepumpe | main/Main_Target_Temp | alle |  | `buffer_target` |
| TOP8 | Verdichterdrehzahl | main/Compressor_Freq | alle | Hz, % | `compressor` |
| TOP9 | Warmwasser Sollwert | main/DHW_Target_Temp | `number`, `input_number`, `sensor` |  | `dhw_setpoint` |
| TOP10 | Warmwasser Isttemperatur | main/DHW_Temp | alle |  | `dhw_temp` |
| TOP11 | Betriebsstunden | main/Operations_Hours | alle | h, min, s, ms, d | `operating_hours` |
| TOP12 | Verdichterstarts | main/Operations_Counter | alle |  | `compressor_starts` |
| TOP14 | Außentemperatur | main/Outside_Temp | alle |  | `outside_temp` |
| TOP15 | Wärmeleistung Heizen | main/Heat_Power_Production | alle |  |  |
| TOP16 | Stromaufnahme Heizen | main/Heat_Power_Consumption | alle |  |  |
| TOP20 | 3-Wege-Umschaltventil | main/ThreeWay_Valve_State | alle |  | `three_way_valve` |
| TOP22 | Warmwasser Hysterese | main/DHW_Heat_Delta | alle |  | `dhw_heat_delta` |
| TOP23 | Spreizung Heizen | main/Heat_Delta | alle |  | `heat_delta` |
| TOP26 | Abtauung läuft | main/Defrosting_State | alle |  | `defrost` |
| TOP27 | HK1 Sollwert einstellbar | main/Z1_Heat_Request_Temp | `number`, `input_number` |  | `hk1_setpoint` |
| TOP29 | HK1 Heizkurve Vorlauf oben | main/Z1_Heat_Curve_Target_High_Temp | alle |  | `curve_t_high` |
| TOP30 | HK1 Heizkurve Vorlauf unten | main/Z1_Heat_Curve_Target_Low_Temp | alle |  | `curve_t_low` |
| TOP31 | HK1 Heizkurve Außen oben | main/Z1_Heat_Curve_Outside_High_Temp | alle |  | `curve_o_high` |
| TOP32 | HK1 Heizkurve Außen unten | main/Z1_Heat_Curve_Outside_Low_Temp | alle |  | `curve_o_low` |
| TOP34 | HK2 Sollwert einstellbar | main/Z2_Heat_Request_Temp | `number`, `input_number` |  | `hk2_setpoint` |
| TOP36 | HK1 Wassertemperatur | main/Z1_Water_Temp | alle |  | `hk1_water` |
| TOP37 | HK2 Wassertemperatur | main/Z2_Water_Temp | alle |  | `hk2_water` |
| TOP40 | Wärmeleistung Warmwasser | main/DHW_Power_Production | alle |  |  |
| TOP41 | Stromaufnahme Warmwasser | main/DHW_Power_Consumption | alle |  |  |
| TOP42 | HK1 Wasser Sollwert | main/Z1_Water_Target_Temp | alle |  | `hk1_water_target` |
| TOP43 | HK2 Wasser Sollwert | main/Z2_Water_Target_Temp | alle |  | `hk2_water_target` |
| TOP44 | Fehlercode | main/Error | alle |  | `error` |
| TOP46 | Puffertemperatur | main/Buffer_Temp | alle |  | `buffer_temp`, `buffer_top` |
| TOP47 | Solarthermie Temperatur | main/Solar_Temp | alle |  | `solar_temp` |
| TOP58 | Heizstab Warmwasser freigegeben | main/DHW_Heater_State | alle |  | `dhw_heater` |
| TOP59 | Heizstab Heizung freigegeben | main/Room_Heater_State | alle |  | `room_heater` |
| TOP60 | Heizstab intern läuft | main/Internal_Heater_State | alle |  | `heater_internal` |
| TOP61 | Heizstab extern läuft | main/External_Heater_State | alle |  | `heater_external` |
| TOP62 | Lüfter 1 Drehzahl | main/Fan1_Motor_Speed | alle | U/min, % | `fan1_rpm` |
| TOP63 | Lüfter 2 Drehzahl | main/Fan2_Motor_Speed | alle | U/min, % | `fan2_rpm` |
| TOP65 | Primärpumpe Drehzahl | main/Pump_Speed | alle | U/min, % | `pump_speed` |
| TOP69 | Legionellenschutz läuft | main/Sterilization_State | alle |  | `sterilization_state` |
| TOP70 | Legionellen Temperatur | main/Sterilization_Temp | alle |  | `steril_temp` |
| TOP71 | Legionellen Haltezeit | main/Sterilization_Max_Time | alle |  | `steril_time` |
| TOP77 | Heizen aus ab Außentemperatur | main/Heating_Off_Outdoor_Temp | alle |  | `heating_off_temp` |
| TOP78 | Heizstab ein unter Außentemperatur | main/Heater_On_Outdoor_Temp | alle |  | `heater_on_temp` |
| TOP82 | HK2 Heizkurve Vorlauf oben | main/Z2_Heat_Curve_Target_High_Temp | alle |  | `curve2_t_high` |
| TOP83 | HK2 Heizkurve Vorlauf unten | main/Z2_Heat_Curve_Target_Low_Temp | alle |  | `curve2_t_low` |
| TOP84 | HK2 Heizkurve Außen oben | main/Z2_Heat_Curve_Outside_High_Temp | alle |  | `curve2_o_high` |
| TOP85 | HK2 Heizkurve Außen unten | main/Z2_Heat_Curve_Outside_Low_Temp | alle |  | `curve2_o_low` |
| TOP90 | Heizstab Heizen Betriebsstunden | main/Room_Heater_Operations_Hours | alle | h, min, s, ms, d | `room_heater_hours` |
| TOP91 | Heizstab Warmwasser Betriebsstunden | main/DHW_Heater_Operations_Hours | alle | h, min, s, ms, d | `dhw_heater_hours` |
| TOP92 | Modell der Wärmepumpe | main/Heat_Pump_Model | alle |  |  |
| TOP94 | Aktivierte Zonen | main/Zones_State | alle |  | `zones_state` |
| TOP95 | Max. Pumpenleistung | main/Max_Pump_Duty | alle |  | `pump_max_duty` |
| TOP99 | Puffer vorhanden | main/Buffer_Installed | alle |  | `buffer_installed` |
| TOP100 | Warmwasser vorhanden | main/DHW_Installed | alle |  | `dhw_installed` |
| TOP113 | Puffer Überhöhung (ΔT) | main/Buffer_Tank_Delta | alle |  | `buffer_delta` |
| TOP115 | Wasserdruck | main/Water_Pressure | alle |  | `water_pressure` |
| TOP123 | HK2 Pumpe läuft | main/Z2_Pump_State | alle |  | `hk2_pump` |
| TOP124 | HK1 Pumpe läuft | main/Z1_Pump_State | alle |  | `hk1_pump` |
| TOP147 | Leistung Heizstab intern | main/Internal_Heater_Capacity | alle |  |  |
| TOP149 | SG Ready Steuerung eingeschaltet | main/SG_Ready_Control | alle |  |  |
| TOP154 | SG Ready Stufe 1, Leistung Heizen (%) | main/SG_Ready_1_Heat_Capacity | alle |  |  |
| TOP155 | SG Ready Stufe 1, Leistung Warmwasser (%) | main/SG_Ready_1_DHW_Capacity | alle |  |  |
| TOP156 | SG Ready Stufe 2, Leistung Heizen (%) | main/SG_Ready_2_Heat_Capacity | alle |  |  |
| TOP157 | SG Ready Stufe 2, Leistung Warmwasser (%) | main/SG_Ready_2_DHW_Capacity | alle |  |  |
| TOP159 | Warmwasser maximale Ladezeit | main/DHW_Heatup_Max_Time | alle |  |  |
| TOP169 | Vorlauf Soll mit Puffer Überhöhung | main/Heat_Request_Temp_With_Buffer | alle |  |  |
| TOP177 | Fühlerkorrektur Raum | main/Sensor_Offset_Remote_Th1 | alle |  |  |
| TOP178 | Fühlerkorrektur Außen | main/Sensor_Offset_Outdoor | alle |  |  |
| TOP184 | SG Ready Stufe 1, Strom Warmwasser (kW) | main/SG_Ready_1_DHW_Power | alle |  |  |
| TOP185 | SG Ready Stufe 1, Strom Heizen (kW) | main/SG_Ready_1_Heat_Power | alle |  |  |
| TOP187 | SG Ready Stufe 2, Strom Warmwasser (kW) | main/SG_Ready_2_DHW_Power | alle |  |  |
| TOP188 | SG Ready Stufe 2, Strom Heizen (kW) | main/SG_Ready_2_Heat_Power | alle |  |  |
| TOP193 | Fühlerkorrektur Rücklauf | main/Sensor_Offset_Return | alle |  |  |
| TOP195 | Fühlerkorrektur Warmwasserspeicher | main/Sensor_Offset_DHW_Tank | alle |  |  |
| TOP196 | Fühlerkorrektur Vorlauf | main/Sensor_Offset_Flow | alle |  |  |
| XTOP0 | Stromaufnahme Heizen, Zusatzblock (statt TOP16) | extra/Heat_Power_Consumption_Extra | alle |  |  |
| XTOP2 | Stromaufnahme Warmwasser, Zusatzblock (statt TOP41) | extra/DHW_Power_Consumption_Extra | alle |  |  |
| XTOP3 | Wärmeleistung Heizen, Zusatzblock (statt TOP15) | extra/Heat_Power_Production_Extra | alle |  |  |
| XTOP5 | Wärmeleistung Warmwasser, Zusatzblock (statt TOP40) | extra/DHW_Power_Production_Extra | alle |  |  |
| OPT5 | Solarthermie Pumpe läuft | optional/Solar_Water_Pump | alle |  | `solar_pump` |

Meldet die Wärmepumpe den Zusatzblock, sind TOP15, TOP16, TOP40 und TOP41 laut HeishaMon ungültig. Dann nimmt die Karte XTOP3, XTOP0, XTOP5 und XTOP2.

## Bedienelemente (SET)

| Name | Bedeutung | HeishaMon Befehl | Rückmeldung | Entitätsarten | bisher |
|---|---|---|---|---|---|
| SET1 | Wärmepumpe Status, grüne LED | SetHeatpump | TOP0 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `power_state`, `power_switch` |
| SET2 | Urlaubsmodus | SetHolidayMode | TOP19 | `switch`, `input_boolean` | `holiday_mode` |
| SET3 | Leisemodus | SetQuietMode | TOP18 | `select`, `input_select` | `quiet_mode` |
| SET4 | Turbomodus | SetPowerfulMode | TOP17 | `select`, `input_select` | `powerful_mode` |
| SET9 | Betriebsart umschalten | SetOperationMode | TOP4 | `select`, `input_select` | `mode_select` |
| SET10 | Einmalig aufheizen | SetForceDHW | TOP2 | `switch`, `input_boolean` | `dhw_force` |
| SET12 | Abtauen erzwingen | SetForceDefrost | keine, nur Auslöser. Zustand: TOP26 | `switch`, `input_boolean`, `select` | `force_defrost` |
| SET13 | Legionellenschutz starten | SetForceSterilization | keine, nur Auslöser. Zustand: TOP69 | `switch`, `input_boolean` | `force_sterilization` |
| SET17 | Zonen umschalten | SetZones | TOP94 | `select`, `input_select` | `zones_select` |
| SET24 | Wochenprogramm | SetMainSchedule | TOP13 | `switch`, `input_boolean` | `main_schedule` |
| SET28 | Pufferbetrieb ein und aus | SetBuffer | TOP99 | `switch`, `input_boolean` | `buffer_switch` |
| SET39 | Regelung | SetHeatingControl | TOP139 | `select`, `input_select` | `heating_control` |
| SET40 | Smart DHW Warmwasser | SetSmartDHW | TOP140 | `select`, `input_select` | `smart_dhw` |
| SET41 | Leisemodus Vorrang | SetQuietModePriority | TOP141 | `select`, `input_select` | `quiet_priority` |
| SET42 | Pumpenregelung | SetPumpFlowrateMode | TOP106 | `select`, `input_select` | `pump_flow_mode` |
| SET44 | Heizstab Warmwasser freigeben | SetDHWHeaterState | TOP58 | `switch`, `input_boolean` | `dhw_heater_switch` |
| SET45 | Heizstab Heizung freigeben | SetRoomHeaterState | TOP59 | `switch`, `input_boolean` | `room_heater_switch` |

## Weitere Werte (EXT)

### EXT1 bis EXT99: Strom und PV

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT1 | Aktuelle Leistungsaufnahme | alle | W, kW, MW | `power_now` |
| EXT2 | Energiezähler | alle | Wh, kWh, MWh | `energy_today` |
| EXT3 | PV Leistung aktuell | alle | W, kW, MW | `pv_power` |
| EXT4 | Netzbezug | `sensor`, `input_number` | W, kW, MW | `grid_power` |
| EXT5 | PV Anteil heute | alle |  | `pv_share_today` |

EXT6 bis EXT99: Reserve

### EXT100 bis EXT199: SG Ready

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT100 | Kontakt K1 Sperre | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k1` |
| EXT101 | Kontakt K2 Anlauf | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k2` |

EXT102 bis EXT199: Reserve

### EXT200 bis EXT299: Heizkreise

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT200 | HK1 ein und aus | `switch`, `input_boolean` |  | `hk1_switch` |
| EXT201 | HK1 Raumtemperatur | `sensor`, `input_number` |  | `hk1_room_temp` |
| EXT202 | HK2 ein und aus | `switch`, `input_boolean` |  | `hk2_switch` |
| EXT203 | HK2 Raumtemperatur | `sensor`, `input_number` |  | `hk2_room_temp` |
| EXT204 | HK3 Wassertemperatur | alle |  | `hk3_water` |
| EXT205 | HK3 Pumpe läuft | alle |  | `hk3_pump` |
| EXT206 | HK3 ein und aus | `switch`, `input_boolean` |  | `hk3_switch` |
| EXT207 | HK4 Wassertemperatur | alle |  | `hk4_water` |
| EXT208 | HK4 Pumpe läuft | alle |  | `hk4_pump` |
| EXT209 | HK4 ein und aus | `switch`, `input_boolean` |  | `hk4_switch` |

EXT210 bis EXT299: Reserve

### EXT300 bis EXT399: Zusatzwärme

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT300 | Kamin Temperatur | alle |  | `kamin_temp` |
| EXT301 | Kamin Pumpe läuft | alle |  | `kamin_pump` |

EXT302 bis EXT399: Reserve

### EXT400 bis EXT499: Warmwasser

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT400 | Zirkulationspumpe läuft | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `circulation_pump` |
| EXT401 | Zirkulation Schalter (klickbar) | `switch`, `input_boolean` |  | `circ_switch` |
| EXT402 | Warmwasser zur wärmsten Tageszeit | `switch`, `input_boolean` |  | `dhw_warmest` |
| EXT403 | Geplante Warmwasserladung | `sensor` |  | `dhw_planned` |
| EXT404 | Letzte Warmwasserladung | `sensor` |  | `dhw_last_charge` |
| EXT405 | Warmwasserladungen in 24 h | alle |  | `dhw_charges_24h` |
| EXT406 | COP der letzten Warmwasserladung | alle |  | `dhw_cop_last` |
| EXT407 | Beste Startstunde für Warmwasser | alle |  | `dhw_best_hour` |
| EXT408 | Kosten der letzten Warmwasserladung | alle |  | `dhw_cost_last` |
| EXT409 | Warmwasserkosten pro Tag | alle |  | `dhw_cost_per_day` |
| EXT410 | Haltedauer im Mittel | alle |  | `dhw_hold_avg` |
| EXT411 | Nachladetemperatur | alle |  | `dhw_reheat_temp` |
| EXT412 | Ladestart Montag | alle |  | `dhw_optimal_monday` |
| EXT413 | Ladestart Dienstag | alle |  | `dhw_optimal_tuesday` |
| EXT414 | Ladestart Mittwoch | alle |  | `dhw_optimal_wednesday` |
| EXT415 | Ladestart Donnerstag | alle |  | `dhw_optimal_thursday` |
| EXT416 | Ladestart Freitag | alle |  | `dhw_optimal_friday` |
| EXT417 | Ladestart Samstag | alle |  | `dhw_optimal_saturday` |
| EXT418 | Ladestart Sonntag | alle |  | `dhw_optimal_sunday` |

EXT419 bis EXT499: Reserve

### EXT500 bis EXT599: Wetter

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT500 | Wettervorhersage | `weather` |  | `weather` |

EXT501 bis EXT599: Reserve

### EXT600 bis EXT699: Effizienz

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT600 | COP Heizen | alle |  | `cop_heating` |
| EXT601 | COP Warmwasser | alle |  | `cop_dhw` |

EXT602 bis EXT699: Reserve

### EXT700 bis EXT799: Betrieb und Anlage

| Name | Bedeutung | Entitätsarten | Einheiten | bisher |
|---|---|---|---|---|
| EXT700 | Verdichterstarts in 24 h | alle |  | `compressor_starts_24h` |
| EXT701 | Spreizung Heizen | alle |  | `spread_heating` |
| EXT702 | Spreizung Warmwasser | alle |  | `spread_dhw` |
| EXT703 | Vorlauf über Soll | alle |  | `flow_over_target` |
| EXT704 | Abtauungen in 24 h | alle |  | `defrost_24h` |
| EXT705 | Heizstab heute | alle |  | `heater_runtime_today` |
| EXT706 | Firmware | alle |  | `firmware` |

EXT707 bis EXT799: Reserve

### EXT800 bis EXT999: frei für neue Themen

Noch keine Namen vergeben.

Bei den Werten von HeishaMon by Lutarym liest die Karte zum Teil auch Attribute der Entität, zum Beispiel den COP je Startstunde bei EXT407.
