# Heatpump Flow Card by Lutarym

**English** · [Deutsch](README.de.md) · [Français](README.fr.md) · [日本語](README.ja.md)

![Screenshot of the card](https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/docs/screenshot-en.png)

Animated Lovelace card for Home Assistant that shows a Panasonic Aquarea heat pump system as a live plant diagram, connected through HeishaMon.

## Features

- Plant diagram with outdoor unit, heating buffer, one or two heating circuits, hot water tank and circulation
- Flow animation that follows the real hydraulics: diverter valve, pumps, compressor and buffer
- Temperature colouring of tanks, radiators and pipes
- Heat curve for circuit 1 and 2 in its own window, with scale, operating point and adjustable corner points
- Door in the heat pump: the button at the bottom right opens the front like a door to the left, behind it are advanced settings (holiday mode, weekly schedule, Smart DHW, heating limits, spread, legionella protection, pump, quiet mode, today's COP for heating and hot water, seasonal performance factor (JAZ) for heating, hot water and total since 1 January with heat and electricity in kWh, from HeishaMon values, operating hours and starts); changes are sent with “Apply” and the door closes
- Help window (“?” at the bottom right): plain-language explanation of every value and command HeishaMon can read and write, with search and groups; for every TOP value the full entity ID, copyable with one click
- Device profiles: export the Panasonic profile as a file, adapt it or describe another manufacturer and import it again; see the [device profile guide](docs/GERAETEPROFIL.md)
- Language packs: export a language as a file, translate it yourself or adjust it and import it again; see the [language pack guide](docs/SPRACHPAKET.md)
- Energy chart for the past 24 hours, coloured by heating, hot water and standby, with the SG Ready history below
- Systems without a heating buffer, detected automatically from TOP99 or set manually
- Landscape and portrait layout
- Visual editor with automatic detection of the integration, import and export of the configuration
- Four languages: English, German, French and Japanese

## Requirements

- Home Assistant 2024.1.0 or later
- HeishaMon, connected either through the integration HeishaMon by Lutarym or through MQTT
- For writing the heat curve through MQTT: the MQTT integration in Home Assistant

## Installation

### HACS

1. Open HACS, menu with the three dots, Custom repositories
2. Repository: `https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`, category: **Dashboard**
3. Search for the card and download it
4. HACS registers the resource automatically. If your dashboards run in YAML mode, add it yourself, see below
5. Reload the browser without cache

### Manual

1. Download `heatpump-flow-card-by-lutarym.js` from the latest release
2. Copy it to `<config>/www/community/heatpump-flow-card-by-lutarym/`
3. Settings, Dashboards, menu with the three dots, Resources, add resource
4. URL `/local/community/heatpump-flow-card-by-lutarym/heatpump-flow-card-by-lutarym.js`, type **JavaScript module**

## Configuration

The easiest way is the visual editor: add the card, then press **Take over from integration**. The card detects the entities of HeishaMon by Lutarym on its own. Entities that are not found can be assigned by hand.

### Example in YAML

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

The entity IDs are the default names of the card. Your entities may be named differently, the editor assigns them automatically.

### Options

| Option | Default | Meaning |
|---|---|---|
| `layout` | `quer` | `quer` landscape, `hoch` portrait |
| `hk_count` | `2` | Number of heating circuits, 1 to 4. Circuits 3 and 4 need own entities, the Aquarea controls only two zones |
| `fan_count` | `2` | Number of fans, 1 or 2 |
| `language` | `auto` | `auto`, `de`, `en`, `fr` or `ja` |
| `profil` | `heishamon_lutarym` | `heishamon_lutarym` or `heishamon` for the MQTT naming scheme |
| `buffer_present` | `auto` | Heating buffer: `auto` from TOP99, `true` or `false` |
| `circulation_present` | `auto` | Circulation: `auto` once an entity is assigned, `true` or `false` |
| `show_history` | `knopf` | 24 hour charts: `knopf` three buttons at the top right open energy, SG Ready and temperatures in a window, `true` energy always in the card, `false` off |
| `show_target` | `true` | Show the “Target …” line in buffer and hot water |
| `show_reload` | `true` | Show the “Reloads at …” line in buffer and hot water |
| `show_help` | `true` | Show the “?” help button at the bottom right of the card |
| `show_door` | `true` | Show the advanced settings button at the bottom right of the heat pump |
| `theme` | `auto` | Colour scheme: `auto` (follows light/dark mode of Home Assistant), `dunkel` (dark), `hell` (light), `kontrast` (high contrast), `nacht` (night, dimmed), `ha` (colours of the Home Assistant theme) |
| `profile_custom` | `[]` | Imported device profiles (set by the editor, see [guide](docs/GERAETEPROFIL.md)) |
| `language_custom` | `[]` | Imported language packs (set by the editor, see [guide](docs/SPRACHPAKET.md)) |
| `history_width` | `450` | Width of the energy chart, 250 to 700 |
| `card_width` | `0` | Width in pixels, 0 is automatic |
| `card_height` | `0` | Height in pixels, 0 is automatic |
| `pipe_inner_mm` | `0` | Inner pipe diameter in mm, colours the flow rate, 0 is off |
| `mqtt_prefix` | `panasonic_heat_pump` | MQTT topic prefix of HeishaMon |
| `curve_x_min / curve_x_max` | `-20 / 20` | Outdoor scale of the heat curve in °C |
| `curve_y_min / curve_y_max` | `20 / 75` | Flow scale of the heat curve in °C |
| `scale_min / scale_max` | `20 / 60` | Colour scale for heating in °C |
| `outdoor_min / outdoor_max` | `-15 / 35` | Colour scale for the outdoor sensor in °C |
| `label_hk1` to `label_hk4`, `label_buffer, label_dhw, label_energy` | | Own names, empty uses the card language |
| `energy_daily` | `true` | Calculate daily energy from the meter reading |
| `animate` | `true` | Animation: `true` on, `false` off, `auto` the device decides (setting "reduce motion") |
| `hk1_style` to `hk4_style` | `platte` | Picture of the heating circuit: `platte` panel radiator, `glieder` column radiator, `fbh` underfloor heating |
| `extra_heat` | `aus` | Additional heat at the buffer: `aus` (off), `kamin` (stove), `solar`, `beide` (both). Only with a heating buffer |
| `demo` | `false` | Sample values for trying out |

### Entities

All fields are optional. A field without an entity is hidden on the card. Where a command name is given, the card can write the value through HeishaMon.

| Key | Meaning | Note |
|---|---|---|
| **Outdoor sensor** | | |
| `outside_temp` | Outdoor temperature | TOP14 |
| **Outdoor unit** | | |
| `power_state` | Heat pump status, green LED | SetHeatpump or TOP0 |
| `compressor` | Compressor frequency | TOP8 |
| `fan1_rpm` | Fan 1 speed | TOP62 |
| `fan2_rpm` | Fan 2 speed | TOP63 |
| `defrost` | Defrost running | TOP26 |
| `error` | Error code | TOP44 |
| `heatpump_state` | Operating state | TOP0 |
| `force_defrost` | Force defrost | SetForceDefrost, switch |
| `powerful_mode` | Powerful mode | SetPowerfulMode, select |
| `quiet_mode` | Quiet mode | SetQuietMode, select |
| `power_now` | Current power draw | Shelly PM, Watt |
| `energy_today` | Energy meter | Shelly PM, kWh |
| **SG Ready** | | |
| `pv_power` | Current PV power | own entity, watts |
| `sg_k1` | Contact K1, block | Shelly, relay or input |
| `sg_k2` | Contact K2, start | Shelly, relay or input |
| **Primary circuit** | | |
| `flow_temp` | Flow temperature | TOP6 |
| `return_temp` | Return temperature | TOP5 |
| `pump_speed` | Primary pump speed | TOP65 |
| `pump_flow` | Flow rate | TOP1 |
| `three_way_valve` | Three-way diverter valve | TOP20 |
| `water_pressure` | Water pressure | TOP115 |
| `heater_internal` | Internal heater running | TOP60 |
| `heater_external` | External heater running | TOP61 |
| **Heating buffer** | | |
| `buffer_temp` | Buffer temperature | TOP46 |
| `buffer_installed` | Buffer installed | TOP99 |
| `buffer_switch` | Buffer mode on and off | SetBuffer, switch |
| **Heat curve** | | |
| `curve_t_high` | Circuit 1 heat curve, flow high | TOP29 |
| `curve_t_low` | Circuit 1 heat curve, flow low | TOP30 |
| `curve_o_high` | Circuit 1 heat curve, outdoor high | TOP31 |
| `curve_o_low` | Circuit 1 heat curve, outdoor low | TOP32 |
| `curve2_t_high` | Circuit 2 heat curve, flow high | TOP82 |
| `curve2_t_low` | Circuit 2 heat curve, flow low | TOP83 |
| `curve2_o_high` | Circuit 2 heat curve, outdoor high | TOP84 |
| `curve2_o_low` | Circuit 2 heat curve, outdoor low | TOP85 |
| **Heating buffer** | | |
| `buffer_delta` | Buffer hysteresis | TOP113 |
| `buffer_target` | Buffer target temperature | TOP7, flow target |
| `cop_heating` | COP heating | HeishaMon by Lutarym, source selectable in the integration under COP source |
| `room_heater` | Heating element, heating: allowed | TOP59 |
| `room_heater_switch` | Allow heating element, heating | SetRoomHeaterState, switch |
| **Circuit 1** | | |
| `zones_state` | Active zones | TOP94, applies to both |
| `zones_select` | Switch zones | SetZones, applies to both |
| `hk1_water` | Circuit 1 water temperature | TOP36 |
| `hk1_water_target` | Circuit 1 water target | TOP42 |
| `hk1_pump` | Circuit 1 pump running | TOP124 |
| `hk1_setpoint` | Circuit 1 adjustable target | TOP27, number |
| `hk1_switch` | Circuit 1 on and off | own switch, optional |
| **Circuit 2** | | |
| `hk2_water` | Circuit 2 water temperature | TOP37 |
| `hk2_water_target` | Circuit 2 water target | TOP43 |
| `hk2_pump` | Circuit 2 pump running | TOP123 |
| `hk2_setpoint` | Circuit 2 adjustable target | TOP34, number |
| `hk2_switch` | Circuit 2 on and off | own switch, optional |
| `hk3_water, hk4_water` | Water temperature circuit 3, 4 | own entity, °C |
| `hk3_pump, hk4_pump` | Pump circuit 3, 4 running | own switch or sensor |
| `hk3_switch, hk4_switch` | Circuit 3, 4 on and off | own switch, optional |
| `kamin_temp` | Stove temperature | own entity, °C |
| `kamin_pump` | Stove pump running | own switch or sensor |
| `solar_temp` | Solar thermal temperature | TOP47 |
| `solar_pump` | Solar thermal pump running | OPT5 |
| **Hot water** | | |
| `dhw_installed` | Hot water installed | TOP100 |
| `dhw_temp` | Hot water temperature | TOP10 |
| `dhw_heat_delta` | Hot water hysteresis | TOP22 |
| `dhw_setpoint` | Hot water target | TOP9, number |
| `cop_dhw` | COP hot water | HeishaMon by Lutarym, source selectable in the integration under COP source |
| `dhw_heater` | Heating element, hot water: allowed | TOP58 |
| `dhw_force` | Boost once | SetForceDHW, switch |
| `dhw_force_state` | Boost running | TOP2 |
| `force_sterilization` | Start legionella cycle | SetForceSterilization, switch |
| `sterilization_state` | Legionella cycle running | TOP69 |
| `dhw_heater_switch` | Allow heating element, hot water | SetDHWHeaterState, switch |
| `circulation_pump` | Circulation pump running | Shelly or own switch |
| `circ_switch` | Circulation switch (clickable) | switch to turn circulation on and off |
| **Control** | | |
| `mode_select` | Switch operating mode | SetOperationMode, select |
| **Advanced settings** | | |
| `heating_off_temp` | Heating off above outdoor temp. | TOP77, number |
| `heater_on_temp` | Heater on below outdoor temp. | TOP78, number |
| `heat_delta` | Heating spread (ΔT) | TOP23, number |
| `heating_control` | Heating control | SetHeatingControl, select |
| `steril_temp` | Legionella temperature | TOP70, number |
| `steril_time` | Legionella hold time | TOP71, number |
| `pump_flow_mode` | Pump control | SetPumpFlowrateMode, select |
| `pump_max_duty` | Max. pump duty | TOP95, number |
| `quiet_priority` | Quiet mode priority | SetQuietModePriority, select |
| `holiday_mode` | Holiday mode | SetHolidayMode, switch |
| `main_schedule` | Weekly schedule | SetMainSchedule, switch |
| `smart_dhw` | Smart DHW | SetSmartDHW, select |
| `operating_hours` | Operating hours | TOP11 |
| `compressor_starts` | Compressor starts | TOP12 |
| `room_heater_hours` | Heater hours, heating | TOP90 |
| `dhw_heater_hours` | Heater hours, hot water | TOP91 |

## Languages

The card follows the language of Home Assistant. If it is not supported, English is used. A fixed language can be set with `language`.

## Changes

See [CHANGELOG.md](CHANGELOG.md).

## License

GNU General Public License v3.0, see [LICENSE](LICENSE).
