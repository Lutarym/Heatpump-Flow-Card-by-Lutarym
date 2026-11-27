# Liste des noms

[English](NAMENSLISTE.md) · [Deutsch](NAMENSLISTE.de.md) · **Français** · [日本語](NAMENSLISTE.ja.md)

À partir de la version 6.0.0, la carte n'utilise en interne que les noms de cette liste : dans la configuration sous `entities` et dans les [profils d'appareil](GERAETEPROFIL.fr.md). Un profil indique seulement quelle entité appartient à quel nom.

Les noms de HeishaMon (TOP, XTOP, OPT et SET) viennent de MQTT-Topics.md dans le dépôt heishamon/HeishaMon (commit e2b065e du 16/11/2026, HeishaMon 4.4.1). Ce que HeishaMon ne fournit pas s'appelle EXT avec un numéro.

Les anciens noms de champ comme `outside_temp` restent valables. La carte les convertit elle-même en noms. La colonne « avant » les indique.

## Règles

1. Une valeur affichée porte le nom de son TOP (ou XTOP, OPT). Si l'entité est réglable (nombre, sélection, interrupteur), la carte peut aussi modifier la valeur.
2. Une commande à part (interrupteur ou sélection) porte le nom de sa commande SET.
3. EXT : un bloc de 100 numéros par thème, le chiffre des centaines indique le thème (choix personnel). Les numéros libres d'un bloc sont réservés à ce thème.
4. Sont valables TOP0 à TOP198, XTOP0 à XTOP5, OPT0 à OPT6, SET1 à SET55 et EXT1 à EXT999. Les tableaux montrent les noms utilisés par la carte. Les autres noms de HeishaMon sont réservés pour des extensions futures, leur signification se trouve dans MQTT-Topics.md.

Types d'entité : les types d'entité acceptés par le nom, « tous » signifie n'importe lequel. Unités : ce qu'un profil peut indiquer, la carte le convertit ([profils d'appareil](GERAETEPROFIL.fr.md#unités-et-états)).

## Valeurs de HeishaMon (TOP, XTOP, OPT)

| Nom | Signification | Topic HeishaMon | Types d'entité | Unités | avant |
|---|---|---|---|---|---|
| TOP0 | État de fonctionnement | main/Heatpump_State | tous |  | `heatpump_state` |
| TOP1 | Débit | main/Pump_Flow | tous | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min | `pump_flow` |
| TOP2 | Chauffe en cours | main/Force_DHW_State | tous |  | `dhw_force_state` |
| TOP4 | Mode de fonctionnement (affichage) | main/Operating_Mode_State | tous |  | `operating_mode` |
| TOP5 | Température de retour | main/Main_Inlet_Temp | tous |  | `return_temp` |
| TOP6 | Température de départ | main/Main_Outlet_Temp | tous |  | `flow_temp` |
| TOP7 | Consigne de départ de la PAC | main/Main_Target_Temp | tous |  | `buffer_target` |
| TOP8 | Fréquence du compresseur | main/Compressor_Freq | tous | Hz, % | `compressor` |
| TOP9 | Consigne eau chaude | main/DHW_Target_Temp | `number`, `input_number`, `sensor` |  | `dhw_setpoint` |
| TOP10 | Température de l'eau chaude | main/DHW_Temp | tous |  | `dhw_temp` |
| TOP11 | Heures de fonctionnement | main/Operations_Hours | tous | h, min, s, ms, d | `operating_hours` |
| TOP12 | Démarrages du compresseur | main/Operations_Counter | tous |  | `compressor_starts` |
| TOP14 | Température extérieure | main/Outside_Temp | tous |  | `outside_temp` |
| TOP15 | Puissance thermique chauffage | main/Heat_Power_Production | tous |  |  |
| TOP16 | Consommation électrique chauffage | main/Heat_Power_Consumption | tous |  |  |
| TOP20 | Vanne trois voies | main/ThreeWay_Valve_State | tous |  | `three_way_valve` |
| TOP22 | Hystérésis de l'eau chaude | main/DHW_Heat_Delta | tous |  | `dhw_heat_delta` |
| TOP23 | Écart chauffage (ΔT) | main/Heat_Delta | tous |  | `heat_delta` |
| TOP26 | Dégivrage en cours | main/Defrosting_State | tous |  | `defrost` |
| TOP27 | Circuit 1 consigne réglable | main/Z1_Heat_Request_Temp | `number`, `input_number` |  | `hk1_setpoint` |
| TOP29 | Circuit 1 courbe, départ haut | main/Z1_Heat_Curve_Target_High_Temp | tous |  | `curve_t_high` |
| TOP30 | Circuit 1 courbe, départ bas | main/Z1_Heat_Curve_Target_Low_Temp | tous |  | `curve_t_low` |
| TOP31 | Circuit 1 courbe, extérieur haut | main/Z1_Heat_Curve_Outside_High_Temp | tous |  | `curve_o_high` |
| TOP32 | Circuit 1 courbe, extérieur bas | main/Z1_Heat_Curve_Outside_Low_Temp | tous |  | `curve_o_low` |
| TOP34 | Circuit 2 consigne réglable | main/Z2_Heat_Request_Temp | `number`, `input_number` |  | `hk2_setpoint` |
| TOP36 | Circuit 1 température d'eau | main/Z1_Water_Temp | tous |  | `hk1_water` |
| TOP37 | Circuit 2 température d'eau | main/Z2_Water_Temp | tous |  | `hk2_water` |
| TOP40 | Puissance thermique eau chaude | main/DHW_Power_Production | tous |  |  |
| TOP41 | Consommation électrique eau chaude | main/DHW_Power_Consumption | tous |  |  |
| TOP42 | Circuit 1 consigne d'eau | main/Z1_Water_Target_Temp | tous |  | `hk1_water_target` |
| TOP43 | Circuit 2 consigne d'eau | main/Z2_Water_Target_Temp | tous |  | `hk2_water_target` |
| TOP44 | Code d'erreur | main/Error | tous |  | `error` |
| TOP46 | Température du ballon tampon | main/Buffer_Temp | tous |  | `buffer_temp`, `buffer_top` |
| TOP47 | Température solaire thermique | main/Solar_Temp | tous |  | `solar_temp` |
| TOP58 | Appoint eau chaude autorisé | main/DHW_Heater_State | tous |  | `dhw_heater` |
| TOP59 | Appoint chauffage autorisé | main/Room_Heater_State | tous |  | `room_heater` |
| TOP60 | Appoint interne en marche | main/Internal_Heater_State | tous |  | `heater_internal` |
| TOP61 | Appoint externe en marche | main/External_Heater_State | tous |  | `heater_external` |
| TOP62 | Vitesse ventilateur 1 | main/Fan1_Motor_Speed | tous | U/min, % | `fan1_rpm` |
| TOP63 | Vitesse ventilateur 2 | main/Fan2_Motor_Speed | tous | U/min, % | `fan2_rpm` |
| TOP65 | Vitesse de la pompe primaire | main/Pump_Speed | tous | U/min, % | `pump_speed` |
| TOP69 | Cycle légionelles en cours | main/Sterilization_State | tous |  | `sterilization_state` |
| TOP70 | Température anti-légionelles | main/Sterilization_Temp | tous |  | `steril_temp` |
| TOP71 | Durée anti-légionelles | main/Sterilization_Max_Time | tous |  | `steril_time` |
| TOP77 | Arrêt chauffage au-dessus de | main/Heating_Off_Outdoor_Temp | tous |  | `heating_off_temp` |
| TOP78 | Appoint actif en dessous de | main/Heater_On_Outdoor_Temp | tous |  | `heater_on_temp` |
| TOP82 | Circuit 2 courbe, départ haut | main/Z2_Heat_Curve_Target_High_Temp | tous |  | `curve2_t_high` |
| TOP83 | Circuit 2 courbe, départ bas | main/Z2_Heat_Curve_Target_Low_Temp | tous |  | `curve2_t_low` |
| TOP84 | Circuit 2 courbe, extérieur haut | main/Z2_Heat_Curve_Outside_High_Temp | tous |  | `curve2_o_high` |
| TOP85 | Circuit 2 courbe, extérieur bas | main/Z2_Heat_Curve_Outside_Low_Temp | tous |  | `curve2_o_low` |
| TOP90 | Heures appoint chauffage | main/Room_Heater_Operations_Hours | tous | h, min, s, ms, d | `room_heater_hours` |
| TOP91 | Heures appoint eau chaude | main/DHW_Heater_Operations_Hours | tous | h, min, s, ms, d | `dhw_heater_hours` |
| TOP92 | Modèle de la pompe à chaleur | main/Heat_Pump_Model | tous |  |  |
| TOP94 | Zones actives | main/Zones_State | tous |  | `zones_state` |
| TOP95 | Puissance max. pompe | main/Max_Pump_Duty | tous |  | `pump_max_duty` |
| TOP99 | Ballon tampon présent | main/Buffer_Installed | tous |  | `buffer_installed` |
| TOP100 | Eau chaude présente | main/DHW_Installed | tous |  | `dhw_installed` |
| TOP113 | Surélévation du ballon tampon (ΔT) | main/Buffer_Tank_Delta | tous |  | `buffer_delta` |
| TOP115 | Pression d'eau | main/Water_Pressure | tous |  | `water_pressure` |
| TOP123 | Circuit 2 pompe en marche | main/Z2_Pump_State | tous |  | `hk2_pump` |
| TOP124 | Circuit 1 pompe en marche | main/Z1_Pump_State | tous |  | `hk1_pump` |
| TOP147 | Puissance de la résistance interne | main/Internal_Heater_Capacity | tous |  |  |
| TOP149 | Commande SG Ready activée | main/SG_Ready_Control | tous |  |  |
| TOP154 | SG Ready niveau 1, puissance chauffage (%) | main/SG_Ready_1_Heat_Capacity | tous |  |  |
| TOP155 | SG Ready niveau 1, puissance eau chaude (%) | main/SG_Ready_1_DHW_Capacity | tous |  |  |
| TOP156 | SG Ready niveau 2, puissance chauffage (%) | main/SG_Ready_2_Heat_Capacity | tous |  |  |
| TOP157 | SG Ready niveau 2, puissance eau chaude (%) | main/SG_Ready_2_DHW_Capacity | tous |  |  |
| TOP159 | Durée maximale de chauffe de l'eau chaude | main/DHW_Heatup_Max_Time | tous |  |  |
| TOP169 | Consigne de départ avec surélévation du ballon tampon | main/Heat_Request_Temp_With_Buffer | tous |  |  |
| TOP177 | Correction de sonde pièce | main/Sensor_Offset_Remote_Th1 | tous |  |  |
| TOP178 | Correction de sonde extérieure | main/Sensor_Offset_Outdoor | tous |  |  |
| TOP184 | SG Ready niveau 1, puissance électrique eau chaude (kW) | main/SG_Ready_1_DHW_Power | tous |  |  |
| TOP185 | SG Ready niveau 1, puissance électrique chauffage (kW) | main/SG_Ready_1_Heat_Power | tous |  |  |
| TOP187 | SG Ready niveau 2, puissance électrique eau chaude (kW) | main/SG_Ready_2_DHW_Power | tous |  |  |
| TOP188 | SG Ready niveau 2, puissance électrique chauffage (kW) | main/SG_Ready_2_Heat_Power | tous |  |  |
| TOP193 | Correction de sonde retour | main/Sensor_Offset_Return | tous |  |  |
| TOP195 | Correction de sonde ballon d'eau chaude | main/Sensor_Offset_DHW_Tank | tous |  |  |
| TOP196 | Correction de sonde départ | main/Sensor_Offset_Flow | tous |  |  |
| XTOP0 | Consommation électrique chauffage, bloc supplémentaire (au lieu de TOP16) | extra/Heat_Power_Consumption_Extra | tous |  |  |
| XTOP2 | Consommation électrique eau chaude, bloc supplémentaire (au lieu de TOP41) | extra/DHW_Power_Consumption_Extra | tous |  |  |
| XTOP3 | Puissance thermique chauffage, bloc supplémentaire (au lieu de TOP15) | extra/Heat_Power_Production_Extra | tous |  |  |
| XTOP5 | Puissance thermique eau chaude, bloc supplémentaire (au lieu de TOP40) | extra/DHW_Power_Production_Extra | tous |  |  |
| OPT5 | Pompe solaire en marche | optional/Solar_Water_Pump | tous |  | `solar_pump` |

Si la pompe à chaleur fournit le bloc supplémentaire, TOP15, TOP16, TOP40 et TOP41 ne sont pas valables selon HeishaMon. La carte prend alors XTOP3, XTOP0, XTOP5 et XTOP2.

## Commandes (SET)

| Nom | Signification | Commande HeishaMon | Retour | Types d'entité | avant |
|---|---|---|---|---|---|
| SET1 | État de la pompe à chaleur, LED verte | SetHeatpump | TOP0 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `power_state`, `power_switch` |
| SET2 | Mode vacances | SetHolidayMode | TOP19 | `switch`, `input_boolean` | `holiday_mode` |
| SET3 | Mode silencieux | SetQuietMode | TOP18 | `select`, `input_select` | `quiet_mode` |
| SET4 | Mode puissance | SetPowerfulMode | TOP17 | `select`, `input_select` | `powerful_mode` |
| SET9 | Changer de mode | SetOperationMode | TOP4 | `select`, `input_select` | `mode_select` |
| SET10 | Chauffe unique | SetForceDHW | TOP2 | `switch`, `input_boolean` | `dhw_force` |
| SET12 | Forcer le dégivrage | SetForceDefrost | aucun, déclencheur seulement. État : TOP26 | `switch`, `input_boolean`, `select` | `force_defrost` |
| SET13 | Démarrer le cycle légionelles | SetForceSterilization | aucun, déclencheur seulement. État : TOP69 | `switch`, `input_boolean` | `force_sterilization` |
| SET17 | Changer de zones | SetZones | TOP94 | `select`, `input_select` | `zones_select` |
| SET24 | Programme hebdomadaire | SetMainSchedule | TOP13 | `switch`, `input_boolean` | `main_schedule` |
| SET28 | Mode tampon marche et arrêt | SetBuffer | TOP99 | `switch`, `input_boolean` | `buffer_switch` |
| SET39 | Régulation | SetHeatingControl | TOP139 | `select`, `input_select` | `heating_control` |
| SET40 | Smart DHW eau chaude | SetSmartDHW | TOP140 | `select`, `input_select` | `smart_dhw` |
| SET41 | Priorité mode silencieux | SetQuietModePriority | TOP141 | `select`, `input_select` | `quiet_priority` |
| SET42 | Régulation de pompe | SetPumpFlowrateMode | TOP106 | `select`, `input_select` | `pump_flow_mode` |
| SET44 | Autoriser l'appoint eau chaude | SetDHWHeaterState | TOP58 | `switch`, `input_boolean` | `dhw_heater_switch` |
| SET45 | Autoriser l'appoint chauffage | SetRoomHeaterState | TOP59 | `switch`, `input_boolean` | `room_heater_switch` |

## Autres valeurs (EXT)

### EXT1 à EXT99: Électricité et PV

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT1 | Puissance absorbée actuelle | tous | W, kW, MW | `power_now` |
| EXT2 | Compteur d'énergie | tous | Wh, kWh, MWh | `energy_today` |
| EXT3 | Puissance PV actuelle | tous | W, kW, MW | `pv_power` |
| EXT4 | Soutirage réseau | `sensor`, `input_number` | W, kW, MW | `grid_power` |
| EXT5 | Part PV aujourd'hui | tous |  | `pv_share_today` |

EXT6 à EXT99 : réserve

### EXT100 à EXT199: SG Ready

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT100 | Contact K1, blocage | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k1` |
| EXT101 | Contact K2, démarrage | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k2` |

EXT102 à EXT199 : réserve

### EXT200 à EXT299: Circuits de chauffage

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT200 | Circuit 1 marche et arrêt | `switch`, `input_boolean` |  | `hk1_switch` |
| EXT201 | Température ambiante circuit 1 | `sensor`, `input_number` |  | `hk1_room_temp` |
| EXT202 | Circuit 2 marche et arrêt | `switch`, `input_boolean` |  | `hk2_switch` |
| EXT203 | Température ambiante circuit 2 | `sensor`, `input_number` |  | `hk2_room_temp` |
| EXT204 | Circuit 3 température d'eau | tous |  | `hk3_water` |
| EXT205 | Circuit 3 pompe en marche | tous |  | `hk3_pump` |
| EXT206 | Circuit 3 marche et arrêt | `switch`, `input_boolean` |  | `hk3_switch` |
| EXT207 | Circuit 4 température d'eau | tous |  | `hk4_water` |
| EXT208 | Circuit 4 pompe en marche | tous |  | `hk4_pump` |
| EXT209 | Circuit 4 marche et arrêt | `switch`, `input_boolean` |  | `hk4_switch` |

EXT210 à EXT299 : réserve

### EXT300 à EXT399: Chaleur d'appoint

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT300 | Température du poêle | tous |  | `kamin_temp` |
| EXT301 | Pompe du poêle en marche | tous |  | `kamin_pump` |

EXT302 à EXT399 : réserve

### EXT400 à EXT499: Eau chaude

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT400 | Pompe de circulation en marche | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `circulation_pump` |
| EXT401 | Interrupteur de circulation (cliquable) | `switch`, `input_boolean` |  | `circ_switch` |
| EXT402 | Eau chaude à l'heure la plus chaude | `switch`, `input_boolean` |  | `dhw_warmest` |
| EXT403 | Charge d'eau chaude prévue | `sensor` |  | `dhw_planned` |
| EXT404 | Dernière charge d'eau chaude | `sensor` |  | `dhw_last_charge` |
| EXT405 | Charges d'eau chaude sur 24 h | tous |  | `dhw_charges_24h` |
| EXT406 | COP de la dernière charge d'eau chaude | tous |  | `dhw_cop_last` |
| EXT407 | Meilleure heure de démarrage de l'eau chaude | tous |  | `dhw_best_hour` |
| EXT408 | Coût de la dernière charge d'eau chaude | tous |  | `dhw_cost_last` |
| EXT409 | Coût de l'eau chaude par jour | tous |  | `dhw_cost_per_day` |
| EXT410 | Durée de maintien moyenne | tous |  | `dhw_hold_avg` |
| EXT411 | Température de recharge | tous |  | `dhw_reheat_temp` |
| EXT412 | Début de charge lundi | tous |  | `dhw_optimal_monday` |
| EXT413 | Début de charge mardi | tous |  | `dhw_optimal_tuesday` |
| EXT414 | Début de charge mercredi | tous |  | `dhw_optimal_wednesday` |
| EXT415 | Début de charge jeudi | tous |  | `dhw_optimal_thursday` |
| EXT416 | Début de charge vendredi | tous |  | `dhw_optimal_friday` |
| EXT417 | Début de charge samedi | tous |  | `dhw_optimal_saturday` |
| EXT418 | Début de charge dimanche | tous |  | `dhw_optimal_sunday` |

EXT419 à EXT499 : réserve

### EXT500 à EXT599: Météo

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT500 | Prévisions météo | `weather` |  | `weather` |

EXT501 à EXT599 : réserve

### EXT600 à EXT699: Efficacité

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT600 | COP chauffage | tous |  | `cop_heating` |
| EXT601 | COP eau chaude | tous |  | `cop_dhw` |

EXT602 à EXT699 : réserve

### EXT700 à EXT799: Fonctionnement et installation

| Nom | Signification | Types d'entité | Unités | avant |
|---|---|---|---|---|
| EXT700 | Démarrages du compresseur sur 24 h | tous |  | `compressor_starts_24h` |
| EXT701 | Écart chauffage | tous |  | `spread_heating` |
| EXT702 | Écart eau chaude | tous |  | `spread_dhw` |
| EXT703 | Départ au-dessus de la consigne | tous |  | `flow_over_target` |
| EXT704 | Dégivrages sur 24 h | tous |  | `defrost_24h` |
| EXT705 | Résistance aujourd'hui | tous |  | `heater_runtime_today` |
| EXT706 | Firmware | tous |  | `firmware` |

EXT707 à EXT799 : réserve

### EXT800 à EXT999: libre pour de nouveaux thèmes

Aucun nom attribué pour l'instant.

Pour les valeurs de HeishaMon by Lutarym, la carte lit en partie aussi des attributs de l'entité, par exemple le COP par heure de démarrage pour EXT407.
