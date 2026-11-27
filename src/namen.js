/**
 * Namensliste der Karte (docs/NAMENSLISTE.md).
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Die Karte benutzt intern nur diese Namen. TOP, XTOP, OPT und SET heissen
 * wie in HeishaMon MQTT-Topics.md (heishamon/HeishaMon, Commit e2b065e vom
 * 16.11.2026). Was HeishaMon nicht liefert, heisst EXT mit Nummer. Jedes
 * Thema hat einen Block mit 100 Nummern, die Hunderterstelle zeigt das Thema
 * (eigene Festlegung): EXT1 Strom und PV, EXT100 SG Ready, EXT200 Heizkreise,
 * EXT300 Zusatzwaerme, EXT400 Warmwasser, EXT500 Wetter, EXT600 Effizienz,
 * EXT700 Betrieb und Anlage, EXT800 bis EXT999 frei. Ein Profil sagt nur,
 * welche Entitaet zu welchem Namen gehoert.
 */

/** Gueltiger Name: TOP0 bis TOP198, XTOP0 bis XTOP5, OPT0 bis OPT6, SET1 bis SET55, EXT1 bis EXT999. */
export function istName(n) {
  const m = /^(TOP|XTOP|OPT|SET|EXT)(\d+)$/.exec(String(n || ""));
  if (!m || String(Number(m[2])) !== m[2]) return false;
  const z = Number(m[2]);
  const grenzen = { TOP: [0, 198], XTOP: [0, 5], OPT: [0, 6], SET: [1, 55], EXT: [1, 999] };
  return z >= grenzen[m[1]][0] && z <= grenzen[m[1]][1];
}

/**
 * Frueherer Feldname der Karte (bis 5.33.8) zum Namen. Damit laufen
 * bestehende Konfigurationen und eigene Profile weiter.
 */
export const BISHER = {
  heatpump_state: "TOP0", pump_flow: "TOP1", dhw_force_state: "TOP2", operating_mode: "TOP4",
  return_temp: "TOP5", flow_temp: "TOP6", buffer_target: "TOP7", compressor: "TOP8",
  dhw_setpoint: "TOP9", dhw_temp: "TOP10", operating_hours: "TOP11", compressor_starts: "TOP12",
  outside_temp: "TOP14", three_way_valve: "TOP20", dhw_heat_delta: "TOP22", heat_delta: "TOP23",
  defrost: "TOP26", hk1_setpoint: "TOP27", curve_t_high: "TOP29", curve_t_low: "TOP30",
  curve_o_high: "TOP31", curve_o_low: "TOP32", hk2_setpoint: "TOP34", hk1_water: "TOP36",
  hk2_water: "TOP37", hk1_water_target: "TOP42", hk2_water_target: "TOP43", error: "TOP44",
  buffer_temp: "TOP46", solar_temp: "TOP47", dhw_heater: "TOP58", room_heater: "TOP59",
  heater_internal: "TOP60", heater_external: "TOP61", fan1_rpm: "TOP62", fan2_rpm: "TOP63",
  pump_speed: "TOP65", sterilization_state: "TOP69", steril_temp: "TOP70", steril_time: "TOP71",
  heating_off_temp: "TOP77", heater_on_temp: "TOP78", curve2_t_high: "TOP82", curve2_t_low: "TOP83",
  curve2_o_high: "TOP84", curve2_o_low: "TOP85", room_heater_hours: "TOP90", dhw_heater_hours: "TOP91",
  zones_state: "TOP94", pump_max_duty: "TOP95", buffer_installed: "TOP99", dhw_installed: "TOP100",
  buffer_delta: "TOP113", water_pressure: "TOP115", hk2_pump: "TOP123", hk1_pump: "TOP124",
  solar_pump: "OPT5", power_state: "SET1", holiday_mode: "SET2", quiet_mode: "SET3",
  powerful_mode: "SET4", mode_select: "SET9", dhw_force: "SET10", force_defrost: "SET12",
  force_sterilization: "SET13", zones_select: "SET17", main_schedule: "SET24", buffer_switch: "SET28",
  heating_control: "SET39", smart_dhw: "SET40", quiet_priority: "SET41", pump_flow_mode: "SET42",
  dhw_heater_switch: "SET44", room_heater_switch: "SET45", power_now: "EXT1", energy_today: "EXT2",
  pv_power: "EXT3", grid_power: "EXT4", pv_share_today: "EXT5", sg_k1: "EXT100",
  sg_k2: "EXT101", hk1_switch: "EXT200", hk1_room_temp: "EXT201", hk2_switch: "EXT202",
  hk2_room_temp: "EXT203", hk3_water: "EXT204", hk3_pump: "EXT205", hk3_switch: "EXT206",
  hk4_water: "EXT207", hk4_pump: "EXT208", hk4_switch: "EXT209", kamin_temp: "EXT300",
  kamin_pump: "EXT301", circulation_pump: "EXT400", circ_switch: "EXT401", dhw_warmest: "EXT402",
  dhw_planned: "EXT403", dhw_last_charge: "EXT404", dhw_charges_24h: "EXT405", dhw_cop_last: "EXT406",
  dhw_best_hour: "EXT407", dhw_cost_last: "EXT408", dhw_cost_per_day: "EXT409", dhw_hold_avg: "EXT410",
  dhw_reheat_temp: "EXT411", dhw_optimal_monday: "EXT412", dhw_optimal_tuesday: "EXT413", dhw_optimal_wednesday: "EXT414",
  dhw_optimal_thursday: "EXT415", dhw_optimal_friday: "EXT416", dhw_optimal_saturday: "EXT417", dhw_optimal_sunday: "EXT418",
  weather: "EXT500", cop_heating: "EXT600", cop_dhw: "EXT601", compressor_starts_24h: "EXT700",
  spread_heating: "EXT701", spread_dhw: "EXT702", flow_over_target: "EXT703", defrost_24h: "EXT704",
  heater_runtime_today: "EXT705", firmware: "EXT706", power_switch: "SET1", buffer_top: "TOP46",
};

/** Erlaubte Entitaetsarten je Name. Fehlt ein Name, sind alle erlaubt. */
export const ARTEN = {
  TOP9: ["number", "input_number", "sensor"], TOP27: ["number", "input_number"],
  TOP34: ["number", "input_number"], SET1: ["switch", "input_boolean", "binary_sensor", "sensor"],
  SET2: ["switch", "input_boolean"], SET3: ["select", "input_select"],
  SET4: ["select", "input_select"], SET9: ["select", "input_select"],
  SET10: ["switch", "input_boolean"], SET12: ["switch", "input_boolean", "select"],
  SET13: ["switch", "input_boolean"], SET17: ["select", "input_select"],
  SET24: ["switch", "input_boolean"], SET28: ["switch", "input_boolean"],
  SET39: ["select", "input_select"], SET40: ["select", "input_select"],
  SET41: ["select", "input_select"], SET42: ["select", "input_select"],
  SET44: ["switch", "input_boolean"], SET45: ["switch", "input_boolean"],
  EXT4: ["sensor", "input_number"], EXT100: ["switch", "input_boolean", "binary_sensor", "sensor"],
  EXT101: ["switch", "input_boolean", "binary_sensor", "sensor"], EXT200: ["switch", "input_boolean"],
  EXT201: ["sensor", "input_number"], EXT202: ["switch", "input_boolean"],
  EXT203: ["sensor", "input_number"], EXT206: ["switch", "input_boolean"],
  EXT209: ["switch", "input_boolean"], EXT400: ["switch", "input_boolean", "binary_sensor", "sensor"],
  EXT401: ["switch", "input_boolean"], EXT402: ["switch", "input_boolean"],
  EXT403: ["sensor"], EXT404: ["sensor"],
  EXT500: ["weather"],
};

/**
 * Einheiten, die die Karte je Name umrechnen kann (Angabe "einheit" im
 * Profil). Meldet die Entitaet selbst eine Einheit, gilt diese.
 */
export const EINHEITEN = {
  TOP62: ["U/min", "%"], TOP63: ["U/min", "%"], TOP65: ["U/min", "%"],
  TOP11: ["h", "min", "s", "ms", "d"], TOP90: ["h", "min", "s", "ms", "d"], TOP91: ["h", "min", "s", "ms", "d"],
  TOP1: ["l/min", "l/h", "l/s", "ml/s", "m3/h", "gal/min", "ft3/min"],
  EXT1: ["W", "kW", "MW"], EXT3: ["W", "kW", "MW"], EXT4: ["W", "kW", "MW"],
  EXT2: ["Wh", "kWh", "MWh"],
  TOP8: ["Hz", "%"],
};

/**
 * Namen ohne Feld im Editor, die "Aus Integration uebernehmen" trotzdem
 * eintraegt, wie bis 5.33.8 (operating_mode).
 */
export const UEBERNEHMEN_OHNE_FELD = ["TOP4"];

/** Namen je Heizkreis. HK3 und HK4 kommen aus eigenen Entitaeten. */
export const HK = {
  1: { wasser: "TOP36", soll: "TOP42", pumpe: "TOP124", sollwert: "TOP27", schalter: "EXT200", raum: "EXT201" },
  2: { wasser: "TOP37", soll: "TOP43", pumpe: "TOP123", sollwert: "TOP34", schalter: "EXT202", raum: "EXT203" },
  3: { wasser: "EXT204", pumpe: "EXT205", schalter: "EXT206" },
  4: { wasser: "EXT207", pumpe: "EXT208", schalter: "EXT209" },
};

/** Zusatzwaerme: Kamin (eigene Entitaeten) und Solarthermie (TOP47, OPT5). */
export const QUELLE = {
  kamin: { temp: "EXT300", pumpe: "EXT301" },
  solar: { temp: "TOP47", pumpe: "OPT5" },
};

/** Heizkurven: Punkte je Kreis. Gestellt werden alle mit SET16 (SetCurves). */
export const KURVE = {
  1: { t_high: "TOP29", t_low: "TOP30", o_high: "TOP31", o_low: "TOP32" },
  2: { t_high: "TOP82", t_low: "TOP83", o_high: "TOP84", o_low: "TOP85" },
};

/** Bester Ladestart fuer Warmwasser je Wochentag. */
export const LADESTART = {
  monday: "EXT412", tuesday: "EXT413", wednesday: "EXT414", thursday: "EXT415",
  friday: "EXT416", saturday: "EXT417", sunday: "EXT418",
};

/** Befehle von HeishaMon (MQTT-Topics.md), fuer die Hilfe. */
export const SET_BEFEHL = {
  SET1: "SetHeatpump", SET2: "SetHolidayMode", SET3: "SetQuietMode", SET4: "SetPowerfulMode",
  SET5: "SetZ1HeatRequestTemperature", SET6: "SetZ1CoolRequestTemperature", SET7: "SetZ2HeatRequestTemperature", SET8: "SetZ2CoolRequestTemperature",
  SET9: "SetOperationMode", SET10: "SetForceDHW", SET11: "SetDHWTemp", SET12: "SetForceDefrost",
  SET13: "SetForceSterilization", SET14: "SetPump", SET15: "SetMaxPumpDuty", SET16: "SetCurves",
  SET17: "SetZones", SET18: "SetFloorHeatDelta", SET19: "SetFloorCoolDelta", SET20: "SetDHWHeatDelta",
  SET21: "SetHeaterDelayTime", SET22: "SetHeaterStartDelta", SET23: "SetHeaterStopDelta", SET24: "SetMainSchedule",
  SET25: "SetAltExternalSensor", SET26: "SetExternalPadHeater", SET27: "SetBufferDelta", SET28: "SetBuffer",
  SET29: "SetHeatingOffOutdoorTemp", SET30: "SetExternalControl", SET31: "SetExternalError", SET32: "SetExternalCompressorControl",
  SET33: "SetExternalHeatCoolControl", SET34: "SetBivalentControl", SET35: "SetBivalentMode", SET36: "SetBivalentStartTemp",
  SET37: "SetBivalentAPStartTemp", SET38: "SetBivalentAPStopTemp", SET39: "SetHeatingControl", SET40: "SetSmartDHW",
  SET41: "SetQuietModePriority", SET42: "SetPumpFlowrateMode", SET43: "SetDHWSensorSelection", SET44: "SetDHWHeaterState",
  SET45: "SetRoomHeaterState", SET46: "SetHeaterOnOutdoorTemp", SET47: "SetForceHeater", SET48: "SetReset",
  SET49: "SetSterilizationTemp", SET50: "SetSterilizationMaxTime", SET51: "SetHeatToCoolTemp", SET52: "SetCoolToHeatTemp",
  SET53: "SetRoomOperationMaxTime", SET54: "SetDHWHeatupMaxTime", SET55: "SetQuietModeSchedule",
};

/** Name zu einem frueheren Feldnamen oder einem Namen, sonst null. */
export function nameVon(schluessel) {
  if (istName(schluessel)) return schluessel;
  return BISHER[schluessel] || null;
}

/**
 * Uebersetzt die Entitaeten einer Konfiguration in Namen. Steht ein Wert
 * unter altem und neuem Namen, gilt der neue. Unbekanntes bleibt stehen.
 */
export function migriereEntitaeten(entities) {
  const roh = entities && typeof entities === "object" ? entities : {};
  const out = {};
  Object.keys(roh).forEach((k) => {
    if (istName(k)) out[k] = roh[k];
  });
  Object.keys(roh).forEach((k) => {
    if (istName(k)) return;
    const n = BISHER[k];
    if (n) {
      if (!(n in out)) out[n] = roh[k];
    } else {
      out[k] = roh[k];
    }
  });
  return out;
}
