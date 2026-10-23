/**
 * Geraeteprofile: eingebaute Profile, Pruefung, Erkennung nach Profil.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { COMMAND_TO_FIELD, COP_TO_FIELD, FIELD_DOMAIN, INTEGRATION_DOMAIN, TOPIC_TO_FIELD } from "./erkennung.js";
import { ENTITY_FIELDS } from "./felder.js";
import { stellbar } from "./hilfsfunktionen.js";
import { HERSTELLER_PROFILE } from "./hersteller.js";

/**
 * Auswahl der Profile. "auto" sucht alle bekannten Integrationen ab.
 * Die HeishaMon-Profile stehen hier, die Profile anderer Hersteller
 * kommen aus hersteller.js.
 */
export const AUTO_PROFIL = "auto";

export const PROFILE = [
  {
    id: "heishamon_lutarym",
    hersteller: "Panasonic Aquarea",
    name: "Panasonic Aquarea, HeishaMon by Lutarym",
    integrationName: "HeishaMon by Lutarym",
    entwickler: "Lutarym",
    quelle: "https://github.com/Lutarym/Heishamon-by-Lutarym",
    integration: "heishamon_lutarym",
    version: "1.3.1",
    aktualisiert: "2026-10-18",
    fertig: true,
    getestet: true,
    hilfe: true,
  },
  {
    id: "heishamon",
    hersteller: "Panasonic Aquarea",
    name: "Panasonic Aquarea, HeishaMon über MQTT-Namensschema",
    integrationName: "HeishaMon (MQTT)",
    entwickler: "",
    quelle: "https://github.com/heishamon/HeishaMon",
    mqtt: true,
    fertig: true,
    getestet: true,
    hilfe: true,
  },
].concat(
  HERSTELLER_PROFILE.map((p) => ({
    id: p.id,
    hersteller: p.hersteller,
    name: `${p.hersteller}, ${p.name}`,
    integrationName: p.name,
    entwickler: p.entwickler,
    quelle: p.quelle,
    integration: p.integration,
    version: p.version || "",
    aktualisiert: p.aktualisiert || "",
    core: Boolean(p.core),
    fertig: true,
    getestet: false,
    hilfe: p.id === "aquarea_heishamon",
  }))
);

/* ------------------------------------------------------------------ *
 *  Geraeteprofile zum Exportieren und Importieren
 * ------------------------------------------------------------------ */
const PROFIL_FORMAT = "lutarym-geraeteprofil";

const PROFIL_VERSION = 1;

/**
 * Beschreibt ein eingebautes Profil im Austauschformat. Je Feld der Karte
 * eine Liste von Suchregeln:
 *  - mit Punkt ("sensor.vorlauf") genau diese Entitaet,
 *  - mit Stern ("sensor.*_vorlauf") ein Muster ueber die Entity-ID,
 *  - sonst ein Schluessel: translation_key der Integration oder das
 *    Ende der Entity-ID nach einem Unterstrich ("top4" passt auf
 *    "sensor.heishamon_top4").
 */
export function eingebautesProfil(id) {
  const hp = HERSTELLER_PROFILE.find((x) => x.id === id);
  if (hp) {
    return {
      format: PROFIL_FORMAT,
      version: PROFIL_VERSION,
      id: hp.id,
      name: `${hp.hersteller}, ${hp.name}`,
      hersteller: hp.hersteller,
      entwickler: hp.entwickler,
      integration: hp.integration,
      namensteil: hp.namensteil || "",
      felder: JSON.parse(JSON.stringify(hp.felder)),
    };
  }
  const pr = PROFILE.find((x) => x.id === id);
  if (!pr || !pr.fertig) return null;
  const mqtt = id === "heishamon";
  const felder = {};
  const bekannt = profilFeldnamen();
  const dazu = (feld, regel) => {
    if (!bekannt.includes(feld)) return;
    if (!felder[feld]) felder[feld] = [];
    if (!felder[feld].includes(regel)) felder[feld].push(regel);
  };
  [TOPIC_TO_FIELD, COMMAND_TO_FIELD].forEach((tabelle) =>
    Object.keys(tabelle).forEach((k) => dazu(tabelle[k], mqtt ? `*.heishamon_${k}` : k))
  );
  Object.keys(COP_TO_FIELD).forEach((k) =>
    dazu(COP_TO_FIELD[k], mqtt ? `sensor.heishamon*_${k}` : k)
  );
  return {
    format: PROFIL_FORMAT,
    version: PROFIL_VERSION,
    id: pr.id,
    name: pr.name,
    hersteller: "Panasonic",
    integration: mqtt ? "" : INTEGRATION_DOMAIN,
    namensteil: "heishamon",
    felder,
  };
}

/**
 * Felder, die ein Profil beschreiben darf: alle Felder des Editors und
 * die Betriebsart (TOP4), die die Karte zusaetzlich liest.
 */
export function profilFeldnamen() {
  return ENTITY_FIELDS.map((f) => f.key).concat(["operating_mode"]);
}

/** Eigene Profile aus der Kartenkonfiguration. */
export function eigeneProfile(config) {
  const liste = config && Array.isArray(config.profile_custom) ? config.profile_custom : [];
  return liste.filter((p) => p && typeof p === "object" && typeof p.id === "string");
}

/** Eigenes Profil zur gewaehlten Kennung, sonst null. */
export function eigenesProfil(config) {
  const id = config && config.profil;
  return eigeneProfile(config).find((p) => p.id === id) || null;
}



/**
 * Prueft ein eingelesenes Profil. Unbekannte Felder werden gemeldet und
 * verworfen, damit fremder Inhalt nichts kaputt macht.
 */
export function pruefeProfil(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_p_format" };
  if (roh.format !== PROFIL_FORMAT) return { fehler: "m_p_format" };
  if (Number(roh.version) !== PROFIL_VERSION) return { fehler: "m_p_version" };
  const id = String(roh.id || "").trim();
  if (!/^[a-z0-9_-]{2,40}$/.test(id)) return { fehler: "m_p_id" };
  if (!roh.felder || typeof roh.felder !== "object" || Array.isArray(roh.felder)) {
    return { fehler: "m_p_felder" };
  }
  const bekannt = profilFeldnamen();
  const felder = {};
  const unbekannt = [];
  Object.keys(roh.felder).forEach((feld) => {
    if (!bekannt.includes(feld)) {
      unbekannt.push(feld);
      return;
    }
    const regeln = [].concat(roh.felder[feld])
      .filter((r) => typeof r === "string" && r.trim())
      .map((r) => r.trim());
    if (regeln.length) felder[feld] = regeln;
  });
  if (!Object.keys(felder).length) return { fehler: "m_p_felder" };
  const text = (w, max) => String(w === undefined || w === null ? "" : w).trim().slice(0, max);
  return {
    profil: {
      format: PROFIL_FORMAT,
      version: PROFIL_VERSION,
      id,
      name: text(roh.name, 80) || id,
      hersteller: text(roh.hersteller, 60),
      entwickler: text(roh.entwickler, 60),
      integration: text(roh.integration, 60),
      namensteil: text(roh.namensteil, 60),
      felder,
    },
    unbekannt,
  };
}

/** Erkennung nach einem Profil im Austauschformat. */
export function erkenneMitProfil(hass, p) {
  const result = { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
  if (!hass || !p || !p.felder) return result;
  const regeln = [];
  const rangZaehler = {};
  Object.keys(p.felder).forEach((feld) =>
    [].concat(p.felder[feld]).forEach((w) => {
      if (typeof w !== "string" || !w.trim()) return;
      let text = w.trim();
      let domain = "";
      const m = text.match(/^([a-z_]+):(.+)$/);
      if (m) {
        domain = m[1];
        text = m[2];
      }
      const r = { feld, w: text, klein: text.toLowerCase(), domain, rang: (rangZaehler[feld] = (rangZaehler[feld] || 0) + 1) };
      if (r.w.includes("*")) {
        r.re = new RegExp(
          "^" + r.w.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$",
          "i"
        );
      }
      regeln.push(r);
    })
  );
  // Liefert 0 bei keinem Treffer, 2 bei genauem Treffer (Schluessel
  // der Integration, ganze Entity-ID), 1 bei Treffer ueber das Ende
  // der Entity-ID oder ein Muster.
  const passt = (r, id, eintrag) => {
    if (r.domain && id.split(".")[0] !== r.domain) return 0;
    if (r.re) return r.re.test(id) ? 1 : 0;
    if (r.w.includes(".")) return id === r.w ? 2 : 0;
    const klein = id.toLowerCase();
    if (eintrag && eintrag.translation_key === r.w) return 2;
    if (klein.split(".")[1] === r.klein) return 2;
    return klein.endsWith(`_${r.klein}`) ? 1 : 0;
  };
  const guete = {};
  const assign = (feld, entityId, rang, art) => {
    const allowed = FIELD_DOMAIN[feld];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    const bisher = result.entities[feld];
    if (bisher) {
      // Stellbar vor nur lesbar, dann die fruehere Regel, dann der
      // genauere Treffer. Bei Gleichstand bleibt der erste.
      const sb = stellbar(bisher);
      const sn = stellbar(entityId);
      if (sb && !sn) return;
      if (sb === sn) {
        const g = guete[feld];
        if (rang > g.rang) return;
        if (rang === g.rang && art <= g.art) return;
      }
    }
    result.entities[feld] = entityId;
    guete[feld] = { rang, art };
  };
  const pruefe = (id, eintrag) => {
    let treffer = false;
    regeln.forEach((r) => {
      const art = passt(r, id, eintrag);
      if (art) {
        assign(r.feld, id, r.rang, art);
        treffer = true;
      }
    });
    return treffer;
  };

  const reg = hass.entities;
  if (p.integration && reg && typeof reg === "object") {
    const geraete = new Set();
    let hits = 0;
    Object.keys(reg).forEach((id) => {
      const e = reg[id];
      if (!e || e.platform !== p.integration) return;
      hits++;
      if (e.device_id) geraete.add(e.device_id);
      pruefe(id, e);
    });
    if (hits > 0) {
      result.found = true;
      result.source = "register";
      result.count = hits;
      result.devices = geraete.size;
      return result;
    }
  }
  const teil = String(p.namensteil || "").toLowerCase();
  // Ein Profil mit Integration, aber ohne Namensteil, sucht nur im
  // Register. Sonst passten allgemeine Schluessel wie
  // "outdoor_temperature" auf fremde Entitaeten.
  if (p.integration && !teil) return result;
  let hits = 0;
  Object.keys(hass.states || {}).forEach((id) => {
    if (teil && !id.toLowerCase().includes(teil)) return;
    if (pruefe(id, reg && reg[id])) hits++;
  });
  if (hits > 0) {
    result.found = true;
    result.source = "namensschema";
    result.count = hits;
    result.devices = 1;
  }
  return result;
}

/**
 * Bereiche der Karte, nach denen die Felder eines Profils zusammengefasst
 * werden. So bleibt die Profilinfo auch bei vielen Feldern kurz.
 */
const BEREICHE = [
  ["b_temp", /^(outside_temp|flow_temp|return_temp|dhw_temp)$/],
  ["b_verdichter", /^(compressor|fan\d_rpm)$/],
  ["b_ventil", /^three_way_valve$/],
  ["b_pumpe", /^(pump_flow|pump_speed|circulation_pump|circ_switch|pump_flow_mode|pump_max_duty)$/],
  ["b_heizkreise", /^(hk\d_|zones_)/],
  ["b_puffer", /^buffer_/],
  ["b_warmwasser", /^(dhw_|sterilization|force_sterilization|steril_)/],
  ["b_zusatz", /^(solar_|kamin_|heater_|room_heater)/],
  ["b_energie", /^(power_now|energy_today|pv_power|cop_|jaz)/],
  ["b_zaehler", /(_hours|_starts)$/],
  ["b_status", /^(error|defrost|water_pressure|heatpump_state|operating_mode|power_state|mode_select)$/],
  ["b_kurve", /^curve/],
  ["b_sg", /^sg_/],
];

/** Liefert die Bereiche (Textschluessel) zu einer Liste von Feldern. */
export function profilBereiche(felder) {
  const out = [];
  felder.forEach((f) => {
    const b = BEREICHE.find(([, re]) => re.test(f));
    const k = b ? b[0] : "b_sonstige";
    if (!out.includes(k)) out.push(k);
  });
  const reihe = BEREICHE.map((b) => b[0]).concat("b_sonstige");
  return out.sort((a, b) => reihe.indexOf(a) - reihe.indexOf(b));
}
