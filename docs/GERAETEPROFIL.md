# Device profiles

**English** · [Deutsch](GERAETEPROFIL.de.md) · [Français](GERAETEPROFIL.fr.md) · [日本語](GERAETEPROFIL.ja.md)

A device profile tells the card what the entities of your heat pump are called in Home Assistant. The card can then find the entities itself and assign them to its fields. This lets you connect heat pumps from other manufacturers and customise the built-in Panasonic profile.

A profile is a small text file in JSON format. You can export it, change it with a text editor and import it again.

## Where to find it

Edit the card and switch the editor to **Advanced**. The selection is in the section **Integration**, the buttons in the section **Import, export and customisation**:

- **Manufacturer**: “Detect automatically” or a manufacturer (also visible in simple mode)
- **Integration / device**: appears when a manufacturer has several integrations, with the developer name
- **Several integrations detected**: appears with “Detect automatically” when several match
- **Feedback on GitHub** and **Copy report** in the box “About this profile”: the report contains assigned, missing and hand-changed fields and the unused entities of the integration. This helps to improve a profile. It contains entity IDs and current values; on GitHub you see and edit it before submitting.
- **About this profile**: integration, developer with a link to the source, version, last change, the areas covered, what was found in Home Assistant, whether the card can control, whether help exists and whether the profile is tested. Version and last change were read when this card version was built and do not update by themselves.
- **Export profile**: saves the selected profile as a file in your downloads folder
- **Import profile**: reads a profile file and selects the profile
- **Remove own profile**: only appears for an own or customised profile

## Quick start

1. Select **Panasonic Aquarea, HeishaMon by Lutarym** and press **Export profile**. The file serves as a template.
2. Find the entities of your heat pump in Home Assistant: **Developer tools → States**, filter for example by the device name.
3. Open the file in a text editor. Change `id`, `name`, `hersteller`, `integration` and `namensteil` and enter your entities under `felder`. Simply delete fields you do not have.
4. Press **Import profile** and choose the file. The card reports how many fields are described and how many of them it found in Home Assistant.
5. Press **Take over from integration**. Only then are the found entities assigned to the fields.
6. Check the individual fields in the editor and correct them by hand if needed.

## File structure

The keys are German and must stay exactly as shown.

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

| Key | Required | Meaning |
|---|---|---|
| `format` | yes | always `"lutarym-geraeteprofil"` |
| `version` | yes | always `1` |
| `id` | yes | identifier, 2 to 40 characters, only lower-case letters a to z, digits, `_` and `-` |
| `name` | no | name in the selection list |
| `hersteller` | no | manufacturer, for information only |
| `integration` | no | name of the integration in Home Assistant (see below) |
| `namensteil` | no | text that all entity IDs of the heat pump contain, for example `"vaillant"` |
| `felder` | yes | for each field of the card a list of search rules |

## Built-in manufacturer profiles

The card ships profiles for the following integrations. The search rules come from the source code of each integration. So far only HeishaMon by Lutarym has been tested on real systems; all others are marked “untested”. Feedback helps to improve them.

**Detect automatically** (default) searches all profiles. If exactly one integration is found, it is used. If several are found, the editor asks which one the card should use. Until then the one with the most matching fields is used. An integration counts as found when at least two fields match.

| Manufacturer | Integration | Developer | Domain | Fields |
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

No profile, with reason:

- `myuplink`: entity names come dynamically from the device
- `wolflink`: entity names come dynamically from the device
- `ebusd`: names depend on your own ebusd configuration
- `stiebel_eltron`: only provides a climate entity
- `bosch`: entity names come dynamically from the device
- `tuya_heat_pump`: data points differ per device
- `toshiba_modbus`: room air conditioner
- `midea_heatpump_hws`: hot water heat pump only
- `dimplex`: provides no heat pump values such as flow, return or compressor

## Search rules

Each field has a list of rules. A single rule may also be written without square brackets. There are four kinds:

| Rule | Example | Matches |
|---|---|---|
| with a dot | `"sensor.hp_flow"` | exactly this entity |
| with a star `*` | `"sensor.*_flow"` | every entity ID following this pattern, the star stands for any text |
| without dot or star | `"flow"` | entity IDs ending in `_flow`, or entities of the integration with this internal key (translation_key) |
| with a domain in front | `"sensor:flow"` | like without dot or star, but only entities of this kind, here `sensor` |

The exact entity ID is the most reliable. Patterns and endings are useful when a profile should also work for others whose entity IDs contain, for example, a different IP address.

Further rules:

- Each field only accepts certain entity types (column "Allowed entity types" in the field list). If the type does not fit, the entity is not entered there.
- If a read-only and a settable entity both match a field, the settable one wins so that the value can be set in the card.
- If a field has several rules, the first one that finds something wins. An exact hit (internal key or full entity ID) beats a hit by ending.
- Upper and lower case do not matter for patterns and endings.

## How the search works

- **With `integration`**: the card only searches the entities of this integration. You see the name in the address bar when you open the integration under **Settings → Devices & services**: the part after `/integration/`. If nothing is found there, the card only continues as without `integration` when `namensteil` is set as well. This way general keys such as `"outdoor_temperature"` do not hit unrelated entities.
- **Without `integration`**: the card searches all entities. With `namensteil` only those whose entity ID contains this text. Without `namensteil` an ending such as `"flow"` can also hit unrelated entities; use exact entity IDs or patterns instead.

## Customising Panasonic

1. Select **Panasonic Aquarea, HeishaMon by Lutarym** and **Export profile**.
2. Change the desired fields in the file. The `id` stays `heishamon_lutarym`.
3. **Import profile**. The selection now shows your name with "(customised)".
4. **Remove own profile** brings back the built-in profile.

If you give a new `id`, an additional own profile is created instead.

## Where the profile is stored

Imported profiles are stored in the configuration of this card under `profile_custom`. They apply to this card only. **Save as file** in the section Import, export and customisation includes the profile, and **Load from file** in another card brings it there. Alternatively, import the profile file in each card.

## What a profile does not change

- The help ("?") explains the values of HeishaMon. For other manufacturers these explanations do not fit.
- The seasonal performance factor behind the door uses the power values of HeishaMon. For other manufacturers it stays empty.
- The card expects values as HeishaMon delivers them: temperatures in °C, power in W, energy in kWh, flow in l/min and pressure in bar.

## Messages when importing

| Message | Cause |
|---|---|
| not valid JSON | the file is not JSON, often a comma or bracket is missing |
| not a device profile file | `format` is missing or wrong |
| profile version not supported | `version` is not `1` |
| identifier missing or invalid | `id` breaks the rules above |
| no known field | `felder` is missing or only contains unknown field names |
| unknown fields ignored | these field names do not exist in the card, the rest was taken over |

## Field list

The column "Panasonic (HeishaMon)" shows the keys of the built-in profile, which helps with the assignment.

**Outdoor sensor**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `outside_temp` | Outdoor temperature | any | `top14` |

**Outdoor unit**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `power_state` | Heat pump status, green LED | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `setheatpump` |
| `compressor` | Compressor frequency | any | `top8` |
| `fan1_rpm` | Fan 1 speed | any | `top62` |
| `fan2_rpm` | Fan 2 speed | any | `top63` |
| `defrost` | Defrost running | any | `top26` |
| `error` | Error code | any | `top44` |
| `heatpump_state` | Operating state | any | `top0` |
| `force_defrost` | Force defrost | `switch`, `input_boolean` | `setforcedefrost` |
| `powerful_mode` | Powerful mode | `select`, `input_select` | `setpowerfulmode` |
| `quiet_mode` | Quiet mode | `select`, `input_select` | `setquietmode` |
| `power_now` | Current power draw | any | (none) |
| `energy_today` | Energy meter | any | (none) |

**SG Ready**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `pv_power` | Current PV power | any | (none) |
| `sg_k1` | Contact K1, block | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (none) |
| `sg_k2` | Contact K2, start | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (none) |

**Primary circuit**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `flow_temp` | Flow temperature | any | `top6` |
| `return_temp` | Return temperature | any | `top5` |
| `pump_speed` | Primary pump speed | any | `top65` |
| `pump_flow` | Flow rate | any | `top1` |
| `three_way_valve` | Three-way diverter valve | any | `top20` |
| `water_pressure` | Water pressure | any | `top115` |
| `heater_internal` | Internal heater running | any | `top60` |
| `heater_external` | External heater running | any | `top61` |

**Heating buffer**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_temp` | Buffer temperature | any | `top46` |
| `buffer_installed` | Buffer installed | any | `top99` |
| `buffer_switch` | Buffer mode on and off | `switch`, `input_boolean` | `setbuffer` |

**Heat curve**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `curve_t_high` | Circuit 1 heat curve, flow high | any | `top29` |
| `curve_t_low` | Circuit 1 heat curve, flow low | any | `top30` |
| `curve_o_high` | Circuit 1 heat curve, outdoor high | any | `top31` |
| `curve_o_low` | Circuit 1 heat curve, outdoor low | any | `top32` |
| `curve2_t_high` | Circuit 2 heat curve, flow high | any | `top82` |
| `curve2_t_low` | Circuit 2 heat curve, flow low | any | `top83` |
| `curve2_o_high` | Circuit 2 heat curve, outdoor high | any | `top84` |
| `curve2_o_low` | Circuit 2 heat curve, outdoor low | any | `top85` |

**Heating buffer**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `buffer_delta` | Buffer hysteresis | any | `top113` |
| `buffer_target` | Buffer target temperature | any | `top7` |
| `cop_heating` | COP heating | any | `cop_heating` |
| `room_heater` | Heating element, heating: allowed | any | `top59` |
| `room_heater_switch` | Allow heating element, heating | `switch`, `input_boolean` | `setroomheaterstate` |

**Circuit 1**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `zones_state` | Active zones | any | `top94` |
| `zones_select` | Switch zones | `select`, `input_select` | `setzones` |
| `hk1_water` | Circuit 1 water temperature | any | `top36` |
| `hk1_water_target` | Circuit 1 water target | any | `top42` |
| `hk1_pump` | Circuit 1 pump running | any | `top124` |
| `hk1_setpoint` | Circuit 1 adjustable target | `number`, `input_number` | `top27` |
| `hk1_switch` | Circuit 1 on and off | `switch`, `input_boolean` | (none) |

**Circuit 2**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `hk2_water` | Circuit 2 water temperature | any | `top37` |
| `hk2_water_target` | Circuit 2 water target | any | `top43` |
| `hk2_pump` | Circuit 2 pump running | any | `top123` |
| `hk2_setpoint` | Circuit 2 adjustable target | `number`, `input_number` | `top34` |
| `hk2_switch` | Circuit 2 on and off | `switch`, `input_boolean` | (none) |

**Hot water**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `dhw_installed` | Hot water installed | any | `top100` |
| `dhw_temp` | Hot water temperature | any | `top10` |
| `dhw_heat_delta` | Hot water hysteresis | any | `top22` |
| `dhw_setpoint` | Hot water target | `number`, `input_number` | `top9` |
| `cop_dhw` | COP hot water | any | `cop_dhw` |
| `dhw_heater` | Heating element, hot water: allowed | any | `top58` |
| `dhw_force` | Boost once | `switch`, `input_boolean` | `setforcedhw` |
| `dhw_force_state` | Boost running | any | `top2` |
| `force_sterilization` | Start legionella cycle | `switch`, `input_boolean` | `setforcesterilization` |
| `sterilization_state` | Legionella cycle running | any | `top69` |
| `dhw_heater_switch` | Allow heating element, hot water | `switch`, `input_boolean` | `setdhwheaterstate` |
| `circulation_pump` | Circulation pump running | `switch`, `input_boolean`, `binary_sensor`, `sensor` | (none) |
| `circ_switch` | Circulation switch (clickable) | `switch`, `input_boolean` | (none) |

**Control**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `mode_select` | Switch operating mode | `select`, `input_select` | `setoperationmode` |

**Advanced settings**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `heating_off_temp` | Heating off above outdoor temp. | any | `top77` |
| `heater_on_temp` | Heater on below outdoor temp. | any | `top78` |
| `heat_delta` | Heating spread (ΔT) | any | `top23` |
| `heating_control` | Heating control | `select`, `input_select` | `setheatingcontrol` |
| `steril_temp` | Legionella temperature | any | `top70` |
| `steril_time` | Legionella hold time | any | `top71` |
| `pump_flow_mode` | Pump control | `select`, `input_select` | `setpumpflowratemode` |
| `pump_max_duty` | Max. pump duty | any | `top95` |
| `quiet_priority` | Quiet mode priority | `select`, `input_select` | `setquietmodepriority` |
| `holiday_mode` | Holiday mode | `switch`, `input_boolean` | `setholidaymode` |
| `main_schedule` | Weekly schedule | `switch`, `input_boolean` | `setmainschedule` |
| `smart_dhw` | Smart DHW | `select`, `input_select` | `setsmartdhw` |
| `operating_hours` | Operating hours | any | `top11` |
| `compressor_starts` | Compressor starts | any | `top12` |
| `room_heater_hours` | Heater hours, heating | any | `top90` |
| `dhw_heater_hours` | Heater hours, hot water | any | `top91` |

**Control**

| Field | Meaning | Allowed entity types | Panasonic (HeishaMon) |
|---|---|---|---|
| `operating_mode` | Operating mode (display) | any | `top4` |
