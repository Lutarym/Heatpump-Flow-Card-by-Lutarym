/**
 * Erkennung der Integration HeishaMon by Lutarym und Zuordnung der Entitaeten.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { stellbar } from "./hilfsfunktionen.js";
import { erkenneMitProfil } from "./profile.js";

/* ------------------------------------------------------------------ *
 *  Erkennung der Integration "Heishamon by Lutarym"
 * ------------------------------------------------------------------ */
export const INTEGRATION_DOMAIN = "heishamon_lutarym";

export const TOPIC_TO_FIELD = {
  top0: "heatpump_state",
  top82: "curve2_t_high",
  top83: "curve2_t_low",
  top84: "curve2_o_high",
  top85: "curve2_o_low",
  top29: "curve_t_high",
  top30: "curve_t_low",
  top31: "curve_o_high",
  top32: "curve_o_low",
  top22: "dhw_heat_delta",
  top2: "dhw_force_state",
  top69: "sterilization_state",
  top14: "outside_temp",
  top4: "operating_mode",
  top8: "compressor",
  top1: "pump_flow",
  top44: "error",
  top115: "water_pressure",
  top113: "buffer_delta",
  top62: "fan1_rpm",
  top63: "fan2_rpm",
  top26: "defrost",
  top6: "flow_temp",
  top5: "return_temp",
  top65: "pump_speed",
  top20: "three_way_valve",
  top59: "room_heater",
  top60: "heater_internal",
  top77: "heating_off_temp",
  top78: "heater_on_temp",
  top23: "heat_delta",
  top70: "steril_temp",
  top71: "steril_time",
  top95: "pump_max_duty",
  top11: "operating_hours",
  top12: "compressor_starts",
  top90: "room_heater_hours",
  top91: "dhw_heater_hours",
  top61: "heater_external",
  top46: "buffer_temp",
  top94: "zones_state",
  top99: "buffer_installed",
  top100: "dhw_installed",
  top7: "buffer_target",
  top36: "hk1_water",
  top42: "hk1_water_target",
  top124: "hk1_pump",
  top27: "hk1_setpoint",
  top37: "hk2_water",
  top43: "hk2_water_target",
  top123: "hk2_pump",
  top34: "hk2_setpoint",
  top10: "dhw_temp",
  top9: "dhw_setpoint",
  top58: "dhw_heater",
  top47: "solar_temp",
  opt5: "solar_pump",
};

export const COMMAND_TO_FIELD = {
  setheatpump: "power_state",
  setoperationmode: "mode_select",
  setforcedhw: "dhw_force",
  setforcesterilization: "force_sterilization",
  setforcedefrost: "force_defrost",
  setdhwheaterstate: "dhw_heater_switch",
  setroomheaterstate: "room_heater_switch",
  setpowerfulmode: "powerful_mode",
  setquietmode: "quiet_mode",
  setzones: "zones_select",
  setbuffer: "buffer_switch",
  setheatingcontrol: "heating_control",
  setpumpflowratemode: "pump_flow_mode",
  setquietmodepriority: "quiet_priority",
  setholidaymode: "holiday_mode",
  setmainschedule: "main_schedule",
  setsmartdhw: "smart_dhw",
  setreset: "fault_reset",
};

/**
 * Leistungszahlen aus HeishaMon by Lutarym. Die Integration liefert je
 * Betriebsart einen berechneten und einen gemessenen Wert. Gemessen
 * nutzt einen externen Strommesser und ist genauer.
 */
export const COP_TO_FIELD = {
  cop_heating: "cop_heating",
  cop_dhw: "cop_dhw",
};

export const COP_MUSTER = /_(cop_(?:heating|dhw))$/;

export const FIELD_DOMAIN = {
  hk1_setpoint: ["number", "input_number"],
  hk2_setpoint: ["number", "input_number"],
  dhw_setpoint: ["number", "input_number"],
  power_state: ["switch", "input_boolean", "binary_sensor", "sensor"],
  mode_select: ["select", "input_select"],
  dhw_force: ["switch", "input_boolean"],
  hk1_switch: ["switch", "input_boolean"],
  hk2_switch: ["switch", "input_boolean"],
  hk3_switch: ["switch", "input_boolean"],
  hk4_switch: ["switch", "input_boolean"],
  force_sterilization: ["switch", "input_boolean"],
  force_defrost: ["switch", "input_boolean"],
  dhw_heater_switch: ["switch", "input_boolean"],
  room_heater_switch: ["switch", "input_boolean"],
  powerful_mode: ["select", "input_select"],
  quiet_mode: ["select", "input_select"],
  zones_select: ["select", "input_select"],
  buffer_switch: ["switch", "input_boolean"],
  heating_control: ["select", "input_select"],
  pump_flow_mode: ["select", "input_select"],
  quiet_priority: ["select", "input_select"],
  holiday_mode: ["switch", "input_boolean"],
  main_schedule: ["switch", "input_boolean"],
  smart_dhw: ["select", "input_select"],
  fault_reset: ["button", "input_button"],
  circulation_pump: ["switch", "input_boolean", "binary_sensor", "sensor"],
  circ_switch: ["switch", "input_boolean"],
  sg_k1: ["switch", "input_boolean", "binary_sensor", "sensor"],
  sg_k2: ["switch", "input_boolean", "binary_sensor", "sensor"],
};

export function detectIntegration(hass, profil) {
  // Eigenes oder angepasstes Geraeteprofil: allgemeine Erkennung.
  if (profil && typeof profil === "object") return erkenneMitProfil(hass, profil);
  const result = { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
  if (!hass) return result;

  const assign = (key, entityId) => {
    const field = TOPIC_TO_FIELD[key] || COMMAND_TO_FIELD[key] || COP_TO_FIELD[key];
    if (!field || !entityId) return;
    const allowed = FIELD_DOMAIN[field];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    // Liefert die Integration zum selben Wert einen Sensor und eine
    // stellbare Entitaet, gewinnt die stellbare. Sonst waere der Wert
    // nur lesbar, obwohl er sich einstellen liesse.
    const bisher = result.entities[field];
    if (bisher && stellbar(bisher) && !stellbar(entityId)) return;
    result.entities[field] = entityId;
  };

  // Das Profil entscheidet, welcher Weg zuerst versucht wird. Findet er
  // nichts, wird der andere trotzdem probiert.
  const nurNamen = profil === "heishamon";
  const registry = nurNamen ? null : hass.entities;
  if (registry && typeof registry === "object") {
    const deviceIds = new Set();
    let hits = 0;
    Object.keys(registry).forEach((entityId) => {
      const entry = registry[entityId];
      if (!entry || entry.platform !== INTEGRATION_DOMAIN) return;
      hits++;
      if (entry.device_id) deviceIds.add(entry.device_id);
      const key =
        (entityId.match(COP_MUSTER) || [])[1] ||
        entry.translation_key ||
        (entityId.match(/_(top\d+)$/) || [])[1] ||
        (entityId.match(/heishamon_(set\w+)$/) || [])[1] ||
        null;
      if (key) assign(key, entityId);
    });
    if (hits > 0) {
      result.found = true;
      result.source = "register";
      result.count = hits;
      result.devices = deviceIds.size;
      return result;
    }
  }

  let hits = 0;
  Object.keys(hass.states || {}).forEach((entityId) => {
    if (/^sensor\.heishamon_/.test(entityId)) {
      const c = entityId.match(COP_MUSTER);
      if (c) assign(c[1], entityId);
    }
    const m = entityId.match(
      /^(?:sensor|number|switch|select)\.heishamon_((?:top\d+)|(?:set\w+))$/
    );
    if (!m) return;
    hits++;
    assign(m[1], entityId);
  });
  if (hits > 0) {
    result.found = true;
    result.source = "namensschema";
    result.count = hits;
    result.devices = 1;
  }
  return result;
}

export function defaultEntityMap() {
  const map = {};
  Object.keys(TOPIC_TO_FIELD).forEach((topic) => {
    const field = TOPIC_TO_FIELD[topic];
    const allowed = FIELD_DOMAIN[field];
    map[field] = `${allowed ? allowed[0] : "sensor"}.heishamon_${topic}`;
  });
  Object.keys(COMMAND_TO_FIELD).forEach((cmd) => {
    const field = COMMAND_TO_FIELD[cmd];
    map[field] = `${FIELD_DOMAIN[field][0]}.heishamon_${cmd}`;
  });
  return map;
}
