# Device profiles

**English** · [Deutsch](GERAETEPROFIL.de.md) · [Français](GERAETEPROFIL.fr.md) · [日本語](GERAETEPROFIL.ja.md)

A device profile tells the card which entity in Home Assistant belongs to which value. The values are named as in the [name list](NAMENSLISTE.md), for example TOP14 for the outdoor temperature. With the profile the card finds the entities itself.

From version 6.0.0 the card no longer contains a profile itself. All profiles are files in the folder `dist/Profile`, one file per manufacturer. Each integration or firmware is a variant in it, for Panasonic Aquarea for example HeishaMon by Lutarym, HeishaMon (MQTT), HeishaMon by kamaradclimber and Aquarea Smart Cloud. HACS installs the folder together with the card. Own profiles are added by import.

## Where to find it

Edit the card. In the section **Integration**:

- **Manufacturer**: “Detect automatically”, a manufacturer from the Profile folder, “Own profiles” (if any) or “No profile, enter entities myself”
- **Integration / device**: appears when a manufacturer has several variants, with the developer name
- **Several integrations detected**: appears with “Detect automatically” when several variants match
- **Would you like to load a specific profile?**: appears with “Detect automatically” when no variant matches. Choose manufacturer and integration there and press **Load profile**. With **No, enter entities myself** the card switches to “No profile, enter entities myself” and the editor shows the fields for the entities.
- **Take over from integration**: enters the found entities into the fields permanently
- **Search again**: switches to “Detect automatically” and searches all profiles again. If the profiles could not be loaded before, the card loads them again.
- **Fill in default names** (editor set to **Advanced**): enters entity IDs that the profile states exactly or with the pattern `*.name` (for example `sensor.heishamon_top14`)
- **About this profile**: integration, developer with a link to the source, version, last change of the integration and day of the check, the areas covered, what was found in Home Assistant, whether the card can control, whether help exists and whether the profile is tested. Version and dates are stored in the profile file and do not change by themselves. Below it **Feedback on GitHub** and **Copy report**: the report contains assigned, missing and hand-changed values and the unused entities of the integration. This helps to improve a profile. It contains entity IDs and current values; on GitHub you see and edit it before submitting.

In the section **Import, export and customisation** (editor set to **Advanced**):

- **Export profile**: saves the selected or detected variant as a file in your downloads folder
- **Import profile**: reads a profile file and selects the (first) variant
- **Search profiles on GitHub**: see [Loading profiles from GitHub](#loading-profiles-from-github)
- **Remove own profile**: only appears for an own, customised or GitHub-loaded profile

## How the card loads and searches

1. The card configuration holds the identifier of the variant under `profil`, for example `heishamon_lutarym`. The identifiers up to 5.33.8 keep working.
2. Variant selected: the card loads `liste.json` and exactly the file of this variant.
3. `auto` (“Detect automatically”, default): the card loads `liste.json` and all files once. It checks all variants and takes the one with the most matching values. A variant counts as found when at least two values match. When a variant searches by entity ID (without integration), entities that belong to the integration of another variant according to the registry do not count.
4. No variant matches: the card shows “No matching profile found. Would you like to load a specific profile? Edit the card and choose manufacturer and integration at the top.” Without a profile the card assumes no manufacturer.
5. `keins`: no profile, the card only uses the entities you entered.
6. The browser loads the files once per page. The card appends its version to the request, after an update the browser fetches the new files.
7. If the profiles could not be loaded, the card shows “The device profiles could not be loaded. Please reload the page.”
8. If Home Assistant has several devices of the same integration (for example two heat pumps), the card looks for the values not entered at the device of its entered entities.

## Quick start: own profile

1. Select a fitting or similar variant, for example **Panasonic Aquarea, HeishaMon by Lutarym**, and press **Export profile**. The file serves as a template.
2. Find the entities of your heat pump in Home Assistant: **Developer tools → States**, filter for example by the device name.
3. Open the file in a text editor. Change the identifiers (`id` of the file and of the variant), the names and `suche` and enter your entities under `werte`. Simply delete values you do not have.
4. Press **Import profile** and choose the file. The card reports how many values are described and how many of them it found in Home Assistant.
5. Press **Take over from integration** if the found entities should be entered into the fields permanently.
6. Check the individual fields in the editor and correct them by hand if needed.

## File structure

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 2,
  "id": "beispiel",
  "name": "Beispiel",
  "karte_ab": "6.0.0",
  "varianten": [
    {
      "id": "beispiel_wp",
      "name": "Beispiel WP",
      "geraete": [{ "hersteller": ["Beispiel"], "reihe": "", "modelle": [], "hinweis": "" }],
      "quelle": {
        "entwickler": "jemand",
        "adresse": "https://github.com/jemand/beispiel-wp",
        "version": "1.0.0",
        "aktualisiert": "2026-11-20",
        "abgelesen": "2026-11-26"
      },
      "suche": { "art": "integration", "integration": "beispiel_wp", "namensteil": "" },
      "werte": {
        "TOP14": ["outdoor_temperature"],
        "TOP6": ["sensor.*_vorlauf"],
        "TOP1": { "suche": ["sensor.*_durchfluss"], "einheit": "l/h" },
        "TOP26": { "suche": ["sensor.*_betrieb"], "zustaende": { "abtauen": 1, "*": 0 } }
      }
    }
  ]
}
```

The file:

| Entry | Required | Meaning |
|---|---|---|
| `format`, `version` | yes | always `"lutarym-geraeteprofil"` and `2` |
| `id` | yes | identifier of the file, equal to the file name without `.json`. 2 to 40 characters, only lower case a to z, digits, `_` and `-`. `liste` is taken. |
| `name` | yes | name of the manufacturer as shown in the editor |
| `karte_ab` | yes | lowest card version that understands the file, for example `6.0.0`. If it is newer than the card, the card rejects the file. |
| `varianten` | yes | one or more variants |

Each variant:

| Entry | Required | Meaning |
|---|---|---|
| `id` | yes | identifier of the variant, unique across all files. The identifiers up to 5.33.8 stay. |
| `name` | yes | name of the integration or firmware |
| `geraete` | yes | list with `hersteller` (list), `reihe`, `modelle` (list) and `hinweis` |
| `quelle` | yes in the Profile folder | `entwickler`, `adresse` (with https://), `version`, `aktualisiert` (last change of the integration), `abgelesen` (day of the check) |
| `suche` | yes | `art`: `integration`, `core` or `firmware`. `integration`: domain in the Home Assistant registry. `namensteil`: part of the entity ID when searching without the registry. |
| `heishamon` | no | `true` if the values come from HeishaMon ([heishamon flag](#heishamon-flag)) |
| `getestet` | no | `true` if checked on a real system |
| `werte` | yes | name from the name list and how the card finds the entity for it |

A value in short form is a list of search rules, for example `"TOP14": ["outdoor_temperature"]`. The long form adds conversion details: `"TOP1": { "suche": [...], "einheit": "l/h" }`.

## Search rules

| Rule | Example | Matches |
|---|---|---|
| key | `"top14"` | entities of the integration with this internal key (translation_key) or entity IDs ending in `_top14` |
| domain and key | `"number:top27"` | as above, only entities of this kind |
| pattern with star | `"sensor.*boiler_fanspd"` | every entity ID following this pattern, the star stands for any text |
| exact entity | `"sensor.outdoor"` | exactly this entity |

Further rules:

- One name, one entity. Several rules are alternatives, the card does not combine values from two entities.
- Each name only accepts certain entity types (column “Entity types” in the [name list](NAMENSLISTE.md)). If the type does not fit, the entity is not entered.
- If a read-only and a settable entity both match a name, the settable one wins so that the value can be set in the card.
- If a name has several rules, the first one that finds something wins. An exact hit (internal key or full entity ID) beats a hit by ending or pattern.
- Upper and lower case do not matter for patterns and endings.

## How the search works

- **With `integration`**: the card only searches the entities of this integration. You see the name in the address bar when you open the integration under **Settings → Devices & services**: the part after `/integration/`. If nothing is found there, the card only continues as without `integration` when `namensteil` is set as well. This way general keys such as `"outdoor_temperature"` do not hit unrelated entities.
- **Without `integration`**: the card searches all entities. With `namensteil` only those whose entity ID contains this text. Without `namensteil` an ending can also hit unrelated entities; use exact entity IDs or patterns instead.

## Units and states

- `einheit`: what the integration delivers if it is not the HeishaMon unit. If the rules find different things, the units are given as a list. If the entity reports a unit itself, that one applies. Otherwise the one from the profile applies, only for the entity the profile finds itself and only if the profile names exactly one unit (my own decision).
- `zustaende`: texts and their value as with HeishaMon, `"*"` stands for all other texts. The card understands numbers and words such as on and off even without it. The card converts the texts only for the entity the profile finds itself, also in the history. Without it the card also recognises defrost from “defrost” or “abtau” in the text. For EMS-ESP the profile holds the defrost words in all 12 EMS-ESP languages.

| Names | The card converts to | The profile may state |
|---|---|---|
| TOP62, TOP63, TOP65 (fan, pump) | rpm | rpm or %. With %: 0 % stands still, 100 % turns fastest (like 900 rpm, my own decision, only for the motion). |
| TOP11, TOP90, TOP91 (operating hours) | h | h, min, s, ms, d |
| TOP1 (flow) | l/min | l/min, l/h, l/s, ml/s, m3/h, gal/min, ft3/min |
| EXT1, EXT3, EXT4 (power) | W | W, kW, MW |
| EXT2 (energy) | kWh | Wh, kWh, MWh |
| TOP8 (compressor) | Hz | Hz or %. The card shows the unit it receives. |
| TOP26 and all on/off values | 0 and 1 | numbers, on and off, own texts via `zustaende` |
| TOP20 (3-way valve) | 0 heating, 1 hot water | numbers, on and off, texts with hot water words, own texts via `zustaende` |

The build reports a unit that is not in the table as an error. The card expects temperatures in °C and pressure in bar.

## heishamon flag

With `"heishamon": true` in a variant:

1. The help window with the HeishaMon values and commands is available.
2. If a value is otherwise read-only, the card sends the command to HeishaMon via MQTT (for example SET16 for the heating curve).
3. If TOP95, TOP99 and TOP100 have no value although HeishaMon delivers data, the card shows the hint about the group “Installer settings”.
4. Stove at the solar input: if only a stove is selected, TOP47 and OPT5 belong to the stove (EXT300 and EXT301).

The Panasonic series from TOP92 follows the manufacturer in `geraete`.

## Built-in profiles

The search rules come from the source code of each integration, checked on the day in `abgelesen`. Only HeishaMon by Lutarym and HeishaMon (MQTT) have been tested on real systems so far, all others are marked “untested”. Feedback helps to improve them. Models are listed so far only for HeishaMon (from HeatPumpType.md of HeishaMon) and EMS-ESP (from device_library.h of EMS-ESP).

| File | Manufacturer | Variant | Developer | Domain | Values |
|---|---|---|---|---|---|
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| `batavia_heat.json` | Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| `bosch_buderus.json` | Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| `bosch_buderus.json` | Bosch, Buderus | [EMS-ESP (MQTT)](https://github.com/emsesp/EMS-ESP32) | emsesp |  | 41 |
| `daikin.json` | Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| `daikin.json` | Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| `daikin.json` | Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| `daikin.json` | Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| `dewarmte.json` | DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| `heliotherm.json` | Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| `hitachi.json` | Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| `idm.json` | iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| `keba.json` | KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| `kronoterm.json` | Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| `lambda.json` | Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| `nibe.json` | NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 127 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon (MQTT)](https://github.com/heishamon/HeishaMon) |  |  | 105 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| `qube.json` | Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| `remeha.json` | Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| `solarfocus.json` | Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| `thermia.json` | Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| `vaillant.json` | Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| `viessmann.json` | Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| `waterkotte.json` | Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| `weishaupt.json` | Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| `wolf.json` | Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

EMS-ESP needs no integration: the firmware creates its entities in Home Assistant via MQTT Discovery. The rules fit the EMS-ESP setting “Entity ID format” with short names (single or multiple instances, latest or v3.5), not “Single instance, long name (v3.4)”.

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

## Adding a profile to the folder

1. Create the file `dist/Profile/<id>.json`, one file per manufacturer. If the manufacturer exists already, the new variant goes into its file.
2. `npm run build`: the build reads all files in the folder, checks them and writes `dist/Profile/liste.json`. To add a profile, just place the file and build.
3. The build checks `format` and `version`, whether `id` matches the file name, the required entries, whether all identifiers are unique across all files, whether every name is in the name list, whether the search rules are not empty, the units (table above), `zustaende` (numbers only), whether `karte_ab` is not newer than the card and `quelle` with an https address and check date. On an error it stops and names the place.

## Loading profiles from GitHub

1. Button **Search profiles on GitHub** in the section **Import, export and customisation**. The card only asks GitHub when you press the button, not every time the dashboard opens.
2. The card reads `liste.json` from the folder `dist/Profile` in the branch main of the card's repository and shows variants that are new or newer than the installed ones. Newer means: later check date (`abgelesen`), later change of the integration (`aktualisiert`) or higher version.
3. **Load** fetches the file and checks it as when loading from its own folder. If `karte_ab` is newer than the card, the card rejects it with a hint.
4. The card stores the variant like an imported profile in the card configuration and selects it. After that it also works without internet. In the selection it is shown with “(from GitHub)”.
5. The card only loads data, no program code.

## Customising a built-in profile

1. Select the variant and **Export profile**.
2. Change the desired values in the file. The `id` of the variant stays the same.
3. **Import profile**. The selection now shows the variant with “(customised)”.
4. **Remove own profile** brings back the variant from the Profile folder.

If you give a new `id`, an additional own profile is created instead under “Own profiles”.

## Where own profiles are stored

Imported and GitHub-loaded profiles are stored in the configuration of this card under `profile_custom`. They apply to this card only. **Save as file** in the section Import, export and customisation includes the profile, and **Load from file** in another card brings it there. Alternatively, import the profile file in each card.

## Older profile files

The import still reads profile files in format 1 (up to 5.33.8, with `felder` and the former field names). The card translates the field names according to the [name list](NAMENSLISTE.md). A profile for HeishaMon keeps the heishamon flag (my own decision: integration `heishamon_lutarym`, name part or identifier with `heishamon`). The export always delivers format 2.

## What a profile does not change

- The help (“?”) explains the values of HeishaMon. It only appears for variants with the heishamon flag and in demo mode.
- The seasonal performance factor behind the door uses the HeishaMon power values (TOP15, TOP16, TOP40, TOP41 or XTOP0, XTOP2, XTOP3, XTOP5). If a profile does not provide them, it stays empty.

## Messages when importing

| Message | Cause |
|---|---|
| This is not valid JSON. Please paste the exported text. | the file is not JSON, often a comma or bracket is missing |
| This is not a device profile file (format must be “lutarym-geraeteprofil”). | `format` is missing or wrong |
| This profile version is not supported (expected: version 2 or 1). | `version` is not `2` or `1` |
| The identifier (id) is missing or invalid: 2 to 40 characters, only a to z, 0 to 9, _ and -. | `id` breaks the rules above |
| The profile does not describe any known value (werte). | `werte` (format 1: `felder`) is missing or only contains unknown names |
| unknown names ignored: … | these names are not in the name list, the others were taken over |
| This profile requires card version x.y.z or later. Please update the card first. | `karte_ab` is newer than the card |
