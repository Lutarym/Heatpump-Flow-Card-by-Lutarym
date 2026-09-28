# Heatpump Flow Card by Lutarym

**English** · [Deutsch](README.de.md) · [Français](README.fr.md) · [日本語](README.ja.md)

![Screenshot of the card](https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/docs/screenshot-en.png)

Animated Lovelace card for Home Assistant that shows a Panasonic Aquarea heat pump system as a live plant diagram, connected through HeishaMon.

## Features

- Plant diagram with outdoor unit, heating buffer, one or two heating circuits, hot water tank and circulation
- Flow animation that follows the real hydraulics: diverter valve, pumps, compressor and buffer
- Temperature colouring of tanks, radiators and pipes
- Heat curve for circuit 1 and 2 in its own window, with scale, operating point and adjustable corner points
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
| `hk_count` | `2` | Number of heating circuits, 1 or 2 |
| `fan_count` | `2` | Number of fans, 1 or 2 |
| `language` | `auto` | `auto`, `de`, `en`, `fr` or `ja` |
| `profil` | `heishamon_lutarym` | `heishamon_lutarym` or `heishamon` for the MQTT naming scheme |
| `buffer_present` | `auto` | Heating buffer: `auto` from TOP99, `true` or `false` |
| `circulation_present` | `auto` | Circulation: `auto` once an entity is assigned, `true` or `false` |
| `show_history` | `true` | Show the energy chart |
| `history_width` | `450` | Width of the energy chart, 250 to 700 |
| `card_width` | `0` | Width in pixels, 0 is automatic |
| `card_height` | `0` | Height in pixels, 0 is automatic |
| `pipe_inner_mm` | `0` | Inner pipe diameter in mm, colours the flow rate, 0 is off |
| `mqtt_prefix` | `panasonic_heat_pump` | MQTT topic prefix of HeishaMon |
| `curve_x_min / curve_x_max` | `-20 / 20` | Outdoor scale of the heat curve in °C |
| `curve_y_min / curve_y_max` | `20 / 75` | Flow scale of the heat curve in °C |
| `scale_min / scale_max` | `20 / 60` | Colour scale for heating in °C |
| `outdoor_min / outdoor_max` | `-15 / 35` | Colour scale for the outdoor sensor in °C |
| `label_hk1, label_hk2, label_buffer, label_dhw, label_energy` | | Own names, empty uses the card language |
| `energy_daily` | `true` | Calculate daily energy from the meter reading |
| `animate` | `true` | Show the animation |
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
| `room_heater` | Heating element, heating | TOP59 |
| `room_heater_switch` | Switch heating element, heating | SetRoomHeaterState, switch |
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
| **Hot water** | | |
| `dhw_installed` | Hot water installed | TOP100 |
| `dhw_temp` | Hot water temperature | TOP10 |
| `dhw_heat_delta` | Hot water hysteresis | TOP22 |
| `dhw_setpoint` | Hot water target | TOP9, number |
| `dhw_heater` | Heating element, hot water | TOP58 |
| `dhw_force` | Boost once | SetForceDHW, switch |
| `dhw_force_state` | Boost running | TOP2 |
| `force_sterilization` | Start legionella cycle | SetForceSterilization, switch |
| `sterilization_state` | Legionella cycle running | TOP69 |
| `dhw_heater_switch` | Switch heating element, hot water | SetDHWHeaterState, switch |
| `circulation_pump` | Circulation pump running | Shelly or own switch |
| `circ_switch` | Circulation switch (clickable) | switch to turn circulation on and off |
| **Control** | | |
| `mode_select` | Switch operating mode | SetOperationMode, select |

## Languages

The card follows the language of Home Assistant. If it is not supported, English is used. A fixed language can be set with `language`.

## Changes

See [CHANGELOG.md](CHANGELOG.md).

## License

GNU General Public License v3.0, see [LICENSE](LICENSE).
