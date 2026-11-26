# 名前リスト

[English](NAMENSLISTE.md) · [Deutsch](NAMENSLISTE.de.md) · [Français](NAMENSLISTE.fr.md) · **日本語**

バージョン 6.0.0 以降、カードは内部でこのリストの名前だけを使います。設定の `entities` と [デバイスプロファイル](GERAETEPROFIL.ja.md) でも同じです。プロファイルは、どのエンティティがどの名前に対応するかだけを示します。

HeishaMon の名前（TOP、XTOP、OPT、SET）は、リポジトリ heishamon/HeishaMon の MQTT-Topics.md（2026/11/16 のコミット e2b065e、HeishaMon 4.4.1）に基づきます。HeishaMon が提供しない値は番号付きの EXT です。

`outside_temp` のような以前の項目名も引き続き使えます。カードが自動で名前に変換します。「以前」列に表示しています。

## ルール

1. 表示する値は、その TOP（または XTOP、OPT）の名前です。エンティティが設定可能（数値、選択、スイッチ）なら、カードから値を変更することもできます。
2. 独立した操作要素（スイッチまたは選択）は、その SET コマンドの名前です。
3. EXT：テーマごとに 100 番のブロックで、百の位がテーマを表します（独自の決定）。ブロック内の空き番号はそのテーマ用の予備です。
4. 有効なのは TOP0〜TOP198、XTOP0〜XTOP5、OPT0〜OPT6、SET1〜SET55、EXT1〜EXT999 です。表にはカードが使う名前を載せています。そのほかの HeishaMon の名前は将来の拡張用に予約されており、意味は MQTT-Topics.md にあります。

エンティティ種別：その名前が受け付けるエンティティの種類。「すべて」はどれでも可。単位：プロファイルで指定でき、カードが換算するもの（[デバイスプロファイル](GERAETEPROFIL.ja.md#単位と状態)）。

## HeishaMon の値（TOP、XTOP、OPT）

| 名前 | 意味 | HeishaMon トピック | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|---|
| TOP0 | 運転状態 | main/Heatpump_State | すべて |  | `heatpump_state` |
| TOP1 | 流量 | main/Pump_Flow | すべて | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min | `pump_flow` |
| TOP2 | 加熱中 | main/Force_DHW_State | すべて |  | `dhw_force_state` |
| TOP4 | 運転モード（表示） | main/Operating_Mode_State | すべて |  | `operating_mode` |
| TOP5 | 還り温度 | main/Main_Inlet_Temp | すべて |  | `return_temp` |
| TOP6 | 往き温度 | main/Main_Outlet_Temp | すべて |  | `flow_temp` |
| TOP7 | ヒートポンプ往き目標温度 | main/Main_Target_Temp | すべて |  | `buffer_target` |
| TOP8 | 圧縮機周波数 | main/Compressor_Freq | すべて | Hz, % | `compressor` |
| TOP9 | 給湯設定温度 | main/DHW_Target_Temp | `number`, `input_number`, `sensor` |  | `dhw_setpoint` |
| TOP10 | 給湯温度 | main/DHW_Temp | すべて |  | `dhw_temp` |
| TOP11 | 運転時間 | main/Operations_Hours | すべて | h, min, s, ms, d | `operating_hours` |
| TOP12 | 圧縮機起動回数 | main/Operations_Counter | すべて |  | `compressor_starts` |
| TOP14 | 外気温 | main/Outside_Temp | すべて |  | `outside_temp` |
| TOP15 | 暖房の熱出力 | main/Heat_Power_Production | すべて |  |  |
| TOP16 | 暖房の消費電力 | main/Heat_Power_Consumption | すべて |  |  |
| TOP20 | 三方弁 | main/ThreeWay_Valve_State | すべて |  | `three_way_valve` |
| TOP22 | 給湯のヒステリシス | main/DHW_Heat_Delta | すべて |  | `dhw_heat_delta` |
| TOP23 | 暖房温度差 (ΔT) | main/Heat_Delta | すべて |  | `heat_delta` |
| TOP26 | 除霜中 | main/Defrosting_State | すべて |  | `defrost` |
| TOP27 | 回路1 設定温度 | main/Z1_Heat_Request_Temp | `number`, `input_number` |  | `hk1_setpoint` |
| TOP29 | 回路1 暖房曲線 往き 高 | main/Z1_Heat_Curve_Target_High_Temp | すべて |  | `curve_t_high` |
| TOP30 | 回路1 暖房曲線 往き 低 | main/Z1_Heat_Curve_Target_Low_Temp | すべて |  | `curve_t_low` |
| TOP31 | 回路1 暖房曲線 外気 高 | main/Z1_Heat_Curve_Outside_High_Temp | すべて |  | `curve_o_high` |
| TOP32 | 回路1 暖房曲線 外気 低 | main/Z1_Heat_Curve_Outside_Low_Temp | すべて |  | `curve_o_low` |
| TOP34 | 回路2 設定温度 | main/Z2_Heat_Request_Temp | `number`, `input_number` |  | `hk2_setpoint` |
| TOP36 | 回路1 水温 | main/Z1_Water_Temp | すべて |  | `hk1_water` |
| TOP37 | 回路2 水温 | main/Z2_Water_Temp | すべて |  | `hk2_water` |
| TOP40 | 給湯の熱出力 | main/DHW_Power_Production | すべて |  |  |
| TOP41 | 給湯の消費電力 | main/DHW_Power_Consumption | すべて |  |  |
| TOP42 | 回路1 目標水温 | main/Z1_Water_Target_Temp | すべて |  | `hk1_water_target` |
| TOP43 | 回路2 目標水温 | main/Z2_Water_Target_Temp | すべて |  | `hk2_water_target` |
| TOP44 | エラーコード | main/Error | すべて |  | `error` |
| TOP46 | バッファー温度 | main/Buffer_Temp | すべて |  | `buffer_temp`, `buffer_top` |
| TOP47 | 太陽熱温度 | main/Solar_Temp | すべて |  | `solar_temp` |
| TOP58 | 給湯ヒーター許可 | main/DHW_Heater_State | すべて |  | `dhw_heater` |
| TOP59 | 暖房ヒーター許可 | main/Room_Heater_State | すべて |  | `room_heater` |
| TOP60 | 内部ヒーター運転中 | main/Internal_Heater_State | すべて |  | `heater_internal` |
| TOP61 | 外部ヒーター運転中 | main/External_Heater_State | すべて |  | `heater_external` |
| TOP62 | ファン1回転数 | main/Fan1_Motor_Speed | すべて | U/min, % | `fan1_rpm` |
| TOP63 | ファン2回転数 | main/Fan2_Motor_Speed | すべて | U/min, % | `fan2_rpm` |
| TOP65 | 一次ポンプ回転数 | main/Pump_Speed | すべて | U/min, % | `pump_speed` |
| TOP69 | レジオネラ運転中 | main/Sterilization_State | すべて |  | `sterilization_state` |
| TOP70 | レジオネラ対策温度 | main/Sterilization_Temp | すべて |  | `steril_temp` |
| TOP71 | レジオネラ対策保持時間 | main/Sterilization_Max_Time | すべて |  | `steril_time` |
| TOP77 | 暖房停止 外気温 | main/Heating_Off_Outdoor_Temp | すべて |  | `heating_off_temp` |
| TOP78 | ヒーター開始 外気温 | main/Heater_On_Outdoor_Temp | すべて |  | `heater_on_temp` |
| TOP82 | 回路2 暖房曲線 往き 高 | main/Z2_Heat_Curve_Target_High_Temp | すべて |  | `curve2_t_high` |
| TOP83 | 回路2 暖房曲線 往き 低 | main/Z2_Heat_Curve_Target_Low_Temp | すべて |  | `curve2_t_low` |
| TOP84 | 回路2 暖房曲線 外気 高 | main/Z2_Heat_Curve_Outside_High_Temp | すべて |  | `curve2_o_high` |
| TOP85 | 回路2 暖房曲線 外気 低 | main/Z2_Heat_Curve_Outside_Low_Temp | すべて |  | `curve2_o_low` |
| TOP90 | 暖房ヒーター運転時間 | main/Room_Heater_Operations_Hours | すべて | h, min, s, ms, d | `room_heater_hours` |
| TOP91 | 給湯ヒーター運転時間 | main/DHW_Heater_Operations_Hours | すべて | h, min, s, ms, d | `dhw_heater_hours` |
| TOP92 | ヒートポンプの機種 | main/Heat_Pump_Model | すべて |  |  |
| TOP94 | 有効なゾーン | main/Zones_State | すべて |  | `zones_state` |
| TOP95 | ポンプ最大出力 | main/Max_Pump_Duty | すべて |  | `pump_max_duty` |
| TOP99 | バッファーあり | main/Buffer_Installed | すべて |  | `buffer_installed` |
| TOP100 | 給湯あり | main/DHW_Installed | すべて |  | `dhw_installed` |
| TOP113 | バッファー上乗せ温度（ΔT） | main/Buffer_Tank_Delta | すべて |  | `buffer_delta` |
| TOP115 | 水圧 | main/Water_Pressure | すべて |  | `water_pressure` |
| TOP123 | 回路2 ポンプ運転中 | main/Z2_Pump_State | すべて |  | `hk2_pump` |
| TOP124 | 回路1 ポンプ運転中 | main/Z1_Pump_State | すべて |  | `hk1_pump` |
| TOP147 | 内部ヒーターの容量 | main/Internal_Heater_Capacity | すべて |  |  |
| TOP149 | SG Ready 制御が有効 | main/SG_Ready_Control | すべて |  |  |
| TOP154 | SG Ready レベル 1、暖房能力 (%) | main/SG_Ready_1_Heat_Capacity | すべて |  |  |
| TOP155 | SG Ready レベル 1、給湯能力 (%) | main/SG_Ready_1_DHW_Capacity | すべて |  |  |
| TOP156 | SG Ready レベル 2、暖房能力 (%) | main/SG_Ready_2_Heat_Capacity | すべて |  |  |
| TOP157 | SG Ready レベル 2、給湯能力 (%) | main/SG_Ready_2_DHW_Capacity | すべて |  |  |
| TOP159 | 給湯の最大加熱時間 | main/DHW_Heatup_Max_Time | すべて |  |  |
| TOP169 | バッファ上乗せ込みの送水目標 | main/Heat_Request_Temp_With_Buffer | すべて |  |  |
| TOP177 | 室内センサーの補正 | main/Sensor_Offset_Remote_Th1 | すべて |  |  |
| TOP178 | 外気センサーの補正 | main/Sensor_Offset_Outdoor | すべて |  |  |
| TOP184 | SG Ready レベル 1、給湯電力 (kW) | main/SG_Ready_1_DHW_Power | すべて |  |  |
| TOP185 | SG Ready レベル 1、暖房電力 (kW) | main/SG_Ready_1_Heat_Power | すべて |  |  |
| TOP187 | SG Ready レベル 2、給湯電力 (kW) | main/SG_Ready_2_DHW_Power | すべて |  |  |
| TOP188 | SG Ready レベル 2、暖房電力 (kW) | main/SG_Ready_2_Heat_Power | すべて |  |  |
| TOP193 | 戻りセンサーの補正 | main/Sensor_Offset_Return | すべて |  |  |
| TOP195 | 給湯タンクセンサーの補正 | main/Sensor_Offset_DHW_Tank | すべて |  |  |
| TOP196 | 送水センサーの補正 | main/Sensor_Offset_Flow | すべて |  |  |
| XTOP0 | 暖房の消費電力、追加ブロック（TOP16 の代わり） | extra/Heat_Power_Consumption_Extra | すべて |  |  |
| XTOP2 | 給湯の消費電力、追加ブロック（TOP41 の代わり） | extra/DHW_Power_Consumption_Extra | すべて |  |  |
| XTOP3 | 暖房の熱出力、追加ブロック（TOP15 の代わり） | extra/Heat_Power_Production_Extra | すべて |  |  |
| XTOP5 | 給湯の熱出力、追加ブロック（TOP40 の代わり） | extra/DHW_Power_Production_Extra | すべて |  |  |
| OPT5 | 太陽熱ポンプ運転中 | optional/Solar_Water_Pump | すべて |  | `solar_pump` |

ヒートポンプが追加ブロックを報告する場合、HeishaMon によると TOP15、TOP16、TOP40、TOP41 は無効です。そのときカードは XTOP3、XTOP0、XTOP5、XTOP2 を使います。

## 操作要素（SET）

| 名前 | 意味 | HeishaMon コマンド | フィードバック | エンティティ種別 | 以前 |
|---|---|---|---|---|---|
| SET1 | ヒートポンプ状態、緑LED | SetHeatpump | TOP0 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `power_state`, `power_switch` |
| SET2 | 休暇モード | SetHolidayMode | TOP19 | `switch`, `input_boolean` | `holiday_mode` |
| SET3 | 静音運転 | SetQuietMode | TOP18 | `select`, `input_select` | `quiet_mode` |
| SET4 | パワフル運転 | SetPowerfulMode | TOP17 | `select`, `input_select` | `powerful_mode` |
| SET9 | 運転モード切替 | SetOperationMode | TOP4 | `select`, `input_select` | `mode_select` |
| SET10 | 一回だけ加熱 | SetForceDHW | TOP2 | `switch`, `input_boolean` | `dhw_force` |
| SET12 | 強制除霜 | SetForceDefrost | なし（トリガーのみ）。状態：TOP26 | `switch`, `input_boolean` | `force_defrost` |
| SET13 | レジオネラ運転を開始 | SetForceSterilization | なし（トリガーのみ）。状態：TOP69 | `switch`, `input_boolean` | `force_sterilization` |
| SET17 | ゾーン切替 | SetZones | TOP94 | `select`, `input_select` | `zones_select` |
| SET24 | 週間スケジュール | SetMainSchedule | TOP13 | `switch`, `input_boolean` | `main_schedule` |
| SET28 | バッファー運転の入切 | SetBuffer | TOP99 | `switch`, `input_boolean` | `buffer_switch` |
| SET39 | 暖房制御 | SetHeatingControl | TOP139 | `select`, `input_select` | `heating_control` |
| SET40 | スマート給湯 | SetSmartDHW | TOP140 | `select`, `input_select` | `smart_dhw` |
| SET41 | 静音モード優先 | SetQuietModePriority | TOP141 | `select`, `input_select` | `quiet_priority` |
| SET42 | ポンプ制御 | SetPumpFlowrateMode | TOP106 | `select`, `input_select` | `pump_flow_mode` |
| SET44 | 給湯ヒーター許可の切替 | SetDHWHeaterState | TOP58 | `switch`, `input_boolean` | `dhw_heater_switch` |
| SET45 | 暖房ヒーター許可の切替 | SetRoomHeaterState | TOP59 | `switch`, `input_boolean` | `room_heater_switch` |

## その他の値（EXT）

### EXT1 〜 EXT99: 電力と PV

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT1 | 現在の消費電力 | すべて | W, kW, MW | `power_now` |
| EXT2 | 電力量計 | すべて | Wh, kWh, MWh | `energy_today` |
| EXT3 | 現在の太陽光出力 | すべて | W, kW, MW | `pv_power` |
| EXT4 | 系統受電 | `sensor`, `input_number` | W, kW, MW | `grid_power` |
| EXT5 | 今日の PV 比率 | すべて |  | `pv_share_today` |

EXT6〜EXT99：予備

### EXT100 〜 EXT199: SG Ready

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT100 | 接点K1 停止 | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k1` |
| EXT101 | 接点K2 起動 | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `sg_k2` |

EXT102〜EXT199：予備

### EXT200 〜 EXT299: 暖房回路

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT200 | 回路1 入切 | `switch`, `input_boolean` |  | `hk1_switch` |
| EXT201 | 回路1 室温 | `sensor`, `input_number` |  | `hk1_room_temp` |
| EXT202 | 回路2 入切 | `switch`, `input_boolean` |  | `hk2_switch` |
| EXT203 | 回路2 室温 | `sensor`, `input_number` |  | `hk2_room_temp` |
| EXT204 | 回路3 水温 | すべて |  | `hk3_water` |
| EXT205 | 回路3 ポンプ運転中 | すべて |  | `hk3_pump` |
| EXT206 | 回路3 入切 | `switch`, `input_boolean` |  | `hk3_switch` |
| EXT207 | 回路4 水温 | すべて |  | `hk4_water` |
| EXT208 | 回路4 ポンプ運転中 | すべて |  | `hk4_pump` |
| EXT209 | 回路4 入切 | `switch`, `input_boolean` |  | `hk4_switch` |

EXT210〜EXT299：予備

### EXT300 〜 EXT399: 補助熱源

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT300 | 薪ストーブ温度 | すべて |  | `kamin_temp` |
| EXT301 | 薪ストーブ ポンプ運転中 | すべて |  | `kamin_pump` |

EXT302〜EXT399：予備

### EXT400 〜 EXT499: 給湯

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT400 | 循環ポンプ運転中 | `switch`, `input_boolean`, `binary_sensor`, `sensor` |  | `circulation_pump` |
| EXT401 | 循環スイッチ（クリック可） | `switch`, `input_boolean` |  | `circ_switch` |
| EXT402 | 最も暖かい時間帯に給湯 | `switch`, `input_boolean` |  | `dhw_warmest` |
| EXT403 | 給湯の予定時刻 | `sensor` |  | `dhw_planned` |
| EXT404 | 前回の給湯運転 | `sensor` |  | `dhw_last_charge` |
| EXT405 | 24 時間の給湯加熱回数 | すべて |  | `dhw_charges_24h` |
| EXT406 | 直近の給湯加熱の COP | すべて |  | `dhw_cop_last` |
| EXT407 | 給湯の最適な開始時刻 | すべて |  | `dhw_best_hour` |
| EXT408 | 直近の給湯加熱のコスト | すべて |  | `dhw_cost_last` |
| EXT409 | 1 日あたりの給湯コスト | すべて |  | `dhw_cost_per_day` |
| EXT410 | 平均の保持時間 | すべて |  | `dhw_hold_avg` |
| EXT411 | 再加熱の温度 | すべて |  | `dhw_reheat_temp` |
| EXT412 | 月曜日の加熱開始 | すべて |  | `dhw_optimal_monday` |
| EXT413 | 火曜日の加熱開始 | すべて |  | `dhw_optimal_tuesday` |
| EXT414 | 水曜日の加熱開始 | すべて |  | `dhw_optimal_wednesday` |
| EXT415 | 木曜日の加熱開始 | すべて |  | `dhw_optimal_thursday` |
| EXT416 | 金曜日の加熱開始 | すべて |  | `dhw_optimal_friday` |
| EXT417 | 土曜日の加熱開始 | すべて |  | `dhw_optimal_saturday` |
| EXT418 | 日曜日の加熱開始 | すべて |  | `dhw_optimal_sunday` |

EXT419〜EXT499：予備

### EXT500 〜 EXT599: 天気

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT500 | 天気予報 | `weather` |  | `weather` |

EXT501〜EXT599：予備

### EXT600 〜 EXT699: 効率

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT600 | COP 暖房 | すべて |  | `cop_heating` |
| EXT601 | COP 給湯 | すべて |  | `cop_dhw` |

EXT602〜EXT699：予備

### EXT700 〜 EXT799: 運転と設備

| 名前 | 意味 | エンティティ種別 | 単位 | 以前 |
|---|---|---|---|---|
| EXT700 | 24 時間の圧縮機の起動回数 | すべて |  | `compressor_starts_24h` |
| EXT701 | 暖房の温度差 | すべて |  | `spread_heating` |
| EXT702 | 給湯の温度差 | すべて |  | `spread_dhw` |
| EXT703 | 目標を上回る送水温度 | すべて |  | `flow_over_target` |
| EXT704 | 24 時間の除霜回数 | すべて |  | `defrost_24h` |
| EXT705 | 今日のヒーター | すべて |  | `heater_runtime_today` |
| EXT706 | ファームウェア | すべて |  | `firmware` |

EXT707〜EXT799：予備

### EXT800 〜 EXT999: 新しいテーマ用に空き

まだ名前は割り当てられていません。

HeishaMon by Lutarym の値では、カードはエンティティの属性も一部読み取ります。たとえば EXT407 の開始時刻ごとの COP です。
