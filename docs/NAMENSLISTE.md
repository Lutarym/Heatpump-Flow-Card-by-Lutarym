# Name list

**English** · [Deutsch](NAMENSLISTE.de.md) · [Français](NAMENSLISTE.fr.md) · [日本語](NAMENSLISTE.ja.md)

From version 6.0.0 the card uses only the names in this list internally: in the configuration under `entities` and in the [device profiles](GERAETEPROFIL.md). A profile only says which entity belongs to which name.

The HeishaMon names (TOP, XTOP, OPT and SET) come from MQTT-Topics.md in the repository heishamon/HeishaMon (commit e2b065e of 16 Nov 2026, HeishaMon 4.4.1). Everything HeishaMon does not provide is called EXT with a number.

Former field names such as `outside_temp` keep working. The card converts them to the names itself. The column "former" shows them.

## Rules

1. A displayed value is named like its TOP (or XTOP, OPT). If the entity can be set (number, select, switch), the card can also change the value.
2. A separate control (switch or select) is named like its SET command.
3. EXT: one block of 100 numbers per topic, the hundreds digit shows the topic (my own decision). Free numbers in a block are reserved for that topic.
4. Valid are TOP0 to TOP198, XTOP0 to XTOP5, OPT0 to OPT6, SET1 to SET55 and EXT1 to EXT999. The tables show the names the card uses. The other HeishaMon names are reserved for later extensions, their meaning is in MQTT-Topics.md.

Entity types: which kinds of entity the name accepts, "all" means any. Units: what a profile may state, the card converts it ([device profiles](GERAETEPROFIL.md#units-and-states)).

## HeishaMon values (TOP, XTOP, OPT)

| Name | Meaning | HeishaMon topic | Entity types | Units | former |
|---|---|---|---|---|---|
| TOP0 | Operating state | main/Heatpump_State | all |  | `heatpump_state` |
| TOP1 | Flow rate | main/Pump_Flow | all | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min | `pump_flow` |
| TOP2 | Boost running | main/Force_DHW_State | all |  | `dhw_force_state` |
| TOP4 | Operating mode (display) | main/Operating_Mode_State | all |  | `operating_mode` |
| TOP5 | Return temperature | main/Main_Inlet_Temp | all |  | `return_temp` |
| TOP6 | Flow temperature | main/Main_Outlet_Temp | all |  | `flow_temp` |
| TOP7 | Heat pump flow target | main/Main_Target_Temp | all |  | `buffer_target` |
| TOP8 | Compressor frequency | main/Compressor_Freq | all | Hz, % | `compressor` |
| TOP9 | Hot water target | main/DHW_Target_Temp | `number`, `input_number`, `sensor` |  | `dhw_setpoint` |
| TOP10 | Hot water temperature | main/DHW_Temp | all |  | `dhw_temp` |
| TOP11 | Operating hours | main/Operations_Hours | all | h, min, s, ms, d | `operating_hours` |
| TOP12 | Compressor starts | main/Operations_Counter | all |  | `compressor_starts` |
| TOP14 | Outdoor temperature | main/Outside_Temp | all |  | `outside_temp` |
| TOP15 | Heat output heating | main/Heat_Power_Production | all |  |  |
| TOP16 | Power consumption heating | main/Heat_Power_Consumption | all |  |  |
| TOP20 | Three-way diverter valve | main/ThreeWay_Valve_State | all |  | `three_way_valve` |
| TOP22 | Hot water hysteresis | main/DHW_Heat_Delta | all |  | `dhw_heat_delta` |
| TOP23 | Heating spread (ΔT) | main/Heat_Delta | all |  | `heat_delta` |
| TOP26 | Defrost running | main/Defrosting_State | all |  | `defrost` |
| TOP27 | Circuit 1 adjustable target | main/Z1_Heat_Request_Temp | `number`, `input_number` |  | `hk1_setpoint` |
| TOP29 | Circuit 1 heat curve, flow high | main/Z1_Heat_Curve_Target_High_Temp | all |  | `curve_t_high` |
| TOP30 | Circuit 1 heat curve, flow low | main/Z1_Heat_Curve_Target_Low_Temp | all |  | `curve_t_low` |
| TOP31 | Circuit 1 heat curve, outdoor high | main/Z1_Heat_Curve_Outside_High_Temp | all |  | `curve_o_high` |
| TOP32 | Circuit 1 heat curve, outdoor low | main/Z1_Heat_Curve_Outside_Low_Temp | all |  | `curve_o_low` |
| TOP34 | Circuit 2 adjustable target | main/Z2_Heat_Request_Temp | `number`, `input_number` |  | `hk2_setpoint` |
| TOP36 | Circuit 1 water temperature | main/Z1_Water_Temp | all |  | `hk1_water` |
| TOP37 | Circuit 2 water temperature | main/Z2_Water_Temp | all |  | `hk2_water` |
| TOP40 | Heat output hot water | main/DHW_Power_Production | all |  |  |
| TOP41 | Power consumption hot water | main/DHW_Power_Consumption | all |  |  |
| TOP42 | Circuit 1 water target | main/Z1_Water_Target_Temp | all |  | `hk1_water_target` |
| TOP43 | Circuit 2 water target | main/Z2_Water_Target_Temp | all |  | `hk2_water_target` |
| TOP44 | Error code | main/Error | all |  | `error` |
| TOP46 | Buffer temperature | main/Buffer_Temp | all |  | `buffer_temp`, `buffer_top` |
| TOP47 | Solar thermal temperature | main/Solar_Temp | all |  | `solar_temp` |
| TOP58 | Heating element, hot water: allowed | main/DHW_Heater_State | all |  | `dhw_heater` |
| TOP59 | Heating element, heating: allowed | main/Room_Heater_State | all |  | `room_heater` |
| TOP60 | Internal heater running | main/Internal_Heater_State | all |  | `heater_internal` |
| TOP61 | External heater running | main/External_Heater_State | all |  | `heater_external` |
| TOP62 | Fan 1 speed | main/Fan1_Motor_Speed | all | U/min, % | `fan1_rpm` |
| TOP63 | Fan 2 speed | main/Fan2_Motor_Speed | all | U/min, % | `fan2_rpm` |
| TOP65 | Primary pump speed | main/Pump_Speed | all | U/min, % | `pump_speed` |
| TOP69 | Legionella cycle running | main/Sterilization_State | all |  | `sterilization_state` |
| TOP70 | Legionella temperature | main/Sterilization_Temp | all |  | `steril_temp` |
| TOP71 | Legionella hold time | main/Sterilization_Max_Time | all |  | `steril_time` |
| TOP77 | Heating off above outdoor temp. | main/Heating_Off_Outdoor_Temp | all |  | `heating_off_temp` |
| TOP78 | Heater on below outdoor temp. | main/Heater_On_Outdoor_Temp | all |  | `heater_on_temp` |
| TOP82 | Circuit 2 heat curve, flow high | main/Z2_Heat_Curve_Target_High_Temp | all |  | `curve2_t_high` |
| TOP83 | Circuit 2 heat curve, flow low | main/Z2_Heat_Curve_Target_Low_Temp | all |  | `curve2_t_low` |
| TOP84 | Circuit 2 heat curve, outdoor high | main/Z2_Heat_Curve_Outside_High_Temp | all |  | `curve2_o_high` |
| TOP85 | Circuit 2 heat curve, outdoor low | main/Z2_Heat_Curve_Outside_Low_Temp | all |  | `curve2_o_low` |
| TOP90 | Heater hours, heating | main/Room_Heater_Operations_Hours | all | h, min, s, ms, d | `room_heater_hours` |
| TOP91 | Heater hours, hot water | main/DHW_Heater_Operations_Hours | all | h, min, s, ms, d | `dhw_heater_hours` |
| TOP92 | Heat pump model | main/Heat_Pump_Model | all |  |  |
| TOP94 | Active zones | main/Zones_State | all |  | `zones_state` |
| TOP95 | Max. pump duty | main/Max_Pump_Duty | all |  | `pump_max_duty` |
| TOP99 | Buffer installed | main/Buffer_Installed | all |  | `buffer_installed` |
| TOP100 | Hot water installed | main/DHW_Installed | all |  | `dhw_installed` |
| TOP113 | Buffer offset (ΔT) | main/Buffer_Tank_Delta | all |  | `buffer_delta` |
| TOP115 | Water pressure | main/Water_Pressure | all |  | `water_pressure` |
| TOP123 | Circuit 2 pump running | main/Z2_Pump_State | all |  | `hk2_pump` |
| TOP124 | Circuit 1 pump running | main/Z1_Pump_State | all |  | `hk1_pump` |
| TOP147 | Internal heater capacity | main/Internal_Heater_Capacity | all |  |  |
| TOP149 | SG Ready control enabled | main/SG_Ready_Control | all |  |  |
| TOP154 | SG Ready level 1, heating capacity (%) | main/SG_Ready_1_Heat_Capacity | all |  |  |
| TOP155 | SG Ready level 1, hot water capacity (%) | main/SG_Ready_1_DHW_Capacity | all |  |  |
| TOP156 | SG Ready level 2, heating capacity (%) | main/SG_Ready_2_Heat_Capacity | all |  |  |
| TOP157 | SG Ready level 2, hot water capacity (%) | main/SG_Ready_2_DHW_Capacity | all |  |  |
| TOP159 | Hot water maximum heat-up time | main/DHW_Heatup_Max_Time | all |  |  |
| TOP169 | Flow target with buffer increase | main/Heat_Request_Temp_With_Buffer | all |  |  |
| TOP177 | Sensor offset room | main/Sensor_Offset_Remote_Th1 | all |  |  |
| TOP178 | Sensor offset outdoor | main/Sensor_Offset_Outdoor | all |  |  |
| TOP184 | SG Ready level 1, hot water power (kW) | main/SG_Ready_1_DHW_Power | all |  |  |
| TOP185 | SG Ready level 1, heating power (kW) | main/SG_Ready_1_Heat_Power | all |  |  |
| TOP187 | SG Ready level 2, hot water power (kW) | main/SG_Ready_2_DHW_Power | all |  |  |
| TOP188 | SG Ready level 2, heating power (kW) | main/SG_Ready_2_Heat_Power | all |  |  |
| TOP193 | Sensor offset return | main/Sensor_Offset_Return | all |  |  |
| TOP195 | Sensor offset hot water tank | main/Sensor_Offset_DHW_Tank | all |  |  |
| TOP196 | Sensor offset flow | main/Sensor_Offset_Flow | all |  |  |
| XTOP0 | Power consumption heating, extra block (instead of TOP16) | extra/Heat_Power_Consumption_Extra | all |  |  |
| XTOP2 | Power consumption hot water, extra block (instead of TOP41) | extra/DHW_Power_Consumption_Extra | all |  |  |
| XTOP3 | Heat output heating, extra block (instead of TOP15) | extra/Heat_Power_Production_Extra | all |  |  |
| XTOP5 | Heat output hot water, extra block (instead of TOP40) | extra/DHW_Power_Production_Extra | all |  |  |
| OPT5 | Solar thermal pump running | optional/Solar_Water_Pump | all |  | `solar_pump` |

If the heat pump reports the extra block, TOP15, TOP16, TOP40 and TOP41 are invalid according to HeishaMon. The card then takes XTOP3, XTOP0, XTOP5 and XTOP2.

## Controls (SET)

| Name | Meaning | HeishaMon command | Feedback | Entity types | former |
|---|---|---|---|---|---|
| SET1 | Heat pump status, green LED | SetHeatpump | TOP0 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `power_state`, `power_switch` |
| SET2 | Holiday mode | SetHolidayMode | TOP19 | `switch`, `input_boolean` | `holiday_mode` |
| SET3 | Quiet mode | SetQuietMode | TOP18 | `select`, `input_select` | `quiet_mode` |
| SET4 | Powerful mode | SetPowerfulMode | TOP17 | `select`, `input_select` | `powerful_mode` |
| SET9 | Switch operating mode | SetOperationMode | TOP4 | `select`, `input_select` | `mode_select` |
| SET10 | Boost once | SetForceDHW | TOP2 | `switch`, `input_boolean` | `dhw_force` |
| SET12 | Force defrost | SetForceDefrost | none, trigger only. State: TOP26 | `switch`, `input_boolean`, `select` | `force_defrost` |
| SET13 | Start legionella cycle | SetForceSterilization | none, trigger only. State: TOP69 | `switch`, `input_boolean` | `force_sterilization` |
| SET17 | Switch zones | SetZones | TOP94 | `select`, `input_select` | `zones_select` |
| SET24 | Weekly schedule | SetMainSchedule | TOP13 | `switch`, `input_boolean` | `main_schedule` |
| SET28 | Buffer mode on and off | SetBuffer | TOP99 | `switch`, `input_boolean` | `buffer_switch` |
| SET39 | Heating control | SetHeatingControl | TOP139 | `select`, `input_select` | `heating_control` |
| SET40 | Smart DHW | SetSmartDHW | TOP140 | `select`, `input_select` | `smart_dhw` |
| SET41 | Quiet mode priority | SetQuietModePriority | TOP141 | `select`, `input_select` | `quiet_priority` |
| SET42 | Pump control | SetPumpFlowrateMode | TOP106 | `select`, `input_select` | `pump_flow_mode` |
| SET44 | Allow heating element, hot water | SetDHWHeaterState | TOP58 | `switch`, `input_boolean` | `dhw_heater_switch` |
| SET45 | Allow heating element, heating | SetRoomHeaterState | TOP59 | `switch`, `input_boolean` | `room_heater_switch` |

## Other values (EXT)

### EXT1 to EXT99: Power and PV

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT1 | Current power draw | all | W, kW, MW | `power_now` |
| EXT2 | Energy meter | all | Wh, kWh, MWh | `energy_today` |
| EXT3 | Current PV power | all | W, kW, MW | `pv_power` |
| EXT4 | Grid import | `sensor`, `input_number` | W, kW, MW | `grid_power` |
| EXT5 | PV share today | all |  | `pv_share_today` |

EXT6 to EXT99: reserved

### EXT100 to EXT199: SG Ready

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT100 | Contact K1, block | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k1` |
| EXT101 | Contact K2, start | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k2` |

EXT102 to EXT199: reserved

### EXT200 to EXT299: Heating circuits

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT200 | Circuit 1 on and off | `switch`, `input_boolean` |  | `hk1_switch` |
| EXT201 | Circuit 1 room temperature | `sensor`, `input_number` |  | `hk1_room_temp` |
| EXT202 | Circuit 2 on and off | `switch`, `input_boolean` |  | `hk2_switch` |
| EXT203 | Circuit 2 room temperature | `sensor`, `input_number` |  | `hk2_room_temp` |
| EXT204 | Circuit 3 water temperature | all |  | `hk3_water` |
| EXT205 | Circuit 3 pump running | all |  | `hk3_pump` |
| EXT206 | Circuit 3 on and off | `switch`, `input_boolean` |  | `hk3_switch` |
| EXT207 | Circuit 4 water temperature | all |  | `hk4_water` |
| EXT208 | Circuit 4 pump running | all |  | `hk4_pump` |
| EXT209 | Circuit 4 on and off | `switch`, `input_boolean` |  | `hk4_switch` |

EXT210 to EXT299: reserved

### EXT300 to EXT399: Additional heat

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT300 | Stove temperature | all |  | `kamin_temp` |
| EXT301 | Stove pump running | all |  | `kamin_pump` |

EXT302 to EXT399: reserved

### EXT400 to EXT499: Hot water

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT400 | Circulation pump running | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `circulation_pump` |
| EXT401 | Circulation switch (clickable) | `switch`, `input_boolean` |  | `circ_switch` |
| EXT402 | Hot water at the warmest time of day | `switch`, `input_boolean` |  | `dhw_warmest` |
| EXT403 | Planned hot water charge | `sensor` |  | `dhw_planned` |
| EXT404 | Last hot water charge | `sensor` |  | `dhw_last_charge` |
| EXT405 | Hot water charges in 24 h | all |  | `dhw_charges_24h` |
| EXT406 | COP of the last hot water charge | all |  | `dhw_cop_last` |
| EXT407 | Best start hour for hot water | all |  | `dhw_best_hour` |
| EXT408 | Cost of the last hot water charge | all |  | `dhw_cost_last` |
| EXT409 | Hot water cost per day | all |  | `dhw_cost_per_day` |
| EXT410 | Average holding time | all |  | `dhw_hold_avg` |
| EXT411 | Reheat temperature | all |  | `dhw_reheat_temp` |
| EXT412 | Charge start Monday | all |  | `dhw_optimal_monday` |
| EXT413 | Charge start Tuesday | all |  | `dhw_optimal_tuesday` |
| EXT414 | Charge start Wednesday | all |  | `dhw_optimal_wednesday` |
| EXT415 | Charge start Thursday | all |  | `dhw_optimal_thursday` |
| EXT416 | Charge start Friday | all |  | `dhw_optimal_friday` |
| EXT417 | Charge start Saturday | all |  | `dhw_optimal_saturday` |
| EXT418 | Charge start Sunday | all |  | `dhw_optimal_sunday` |

EXT419 to EXT499: reserved

### EXT500 to EXT599: Weather

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT500 | Weather forecast | `weather` |  | `weather` |

EXT501 to EXT599: reserved

### EXT600 to EXT699: Efficiency

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT600 | COP heating | all |  | `cop_heating` |
| EXT601 | COP hot water | all |  | `cop_dhw` |

EXT602 to EXT699: reserved

### EXT700 to EXT799: Operation and system

| Name | Meaning | Entity types | Units | former |
|---|---|---|---|---|
| EXT700 | Compressor starts in 24 h | all |  | `compressor_starts_24h` |
| EXT701 | Spread heating | all |  | `spread_heating` |
| EXT702 | Spread hot water | all |  | `spread_dhw` |
| EXT703 | Flow above target | all |  | `flow_over_target` |
| EXT704 | Defrosts in 24 h | all |  | `defrost_24h` |
| EXT705 | Backup heater today | all |  | `heater_runtime_today` |
| EXT706 | Firmware | all |  | `firmware` |

EXT707 to EXT799: reserved

### EXT800 to EXT999: free for new topics

No names assigned yet.

For the values of HeishaMon by Lutarym the card partly also reads attributes of the entity, for example the COP per start hour for EXT407.
