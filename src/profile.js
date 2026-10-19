/**
 * Geraeteprofile: eingebaute Profile, Pruefung, Erkennung nach Profil.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { COMMAND_TO_FIELD, COP_TO_FIELD, FIELD_DOMAIN, INTEGRATION_DOMAIN, TOPIC_TO_FIELD } from "./erkennung.js";
import { ENTITY_FIELDS } from "./felder.js";
import { stellbar } from "./hilfsfunktionen.js";

/**
 * Herstellerprofile. Jedes Profil beschreibt, wie die Entitaeten einer
 * Integration heissen. Umgesetzt ist bisher HeishaMon, die uebrigen
 * sind vorgemerkt und werden ergaenzt, sobald die Namensschemata
 * geklaert sind.
 */
export const PROFILE = [
  {
    id: "heishamon_lutarym",
    name: "Panasonic Aquarea, HeishaMon by Lutarym",
    fertig: true,
  },
  {
    id: "heishamon",
    name: "Panasonic Aquarea, HeishaMon über MQTT-Namensschema",
    fertig: true,
  },
  { id: "vaillant", name: "Vaillant, in Vorbereitung", fertig: false },
  { id: "bosch", name: "Bosch, in Vorbereitung", fertig: false },
  { id: "viessmann", name: "Viessmann, in Vorbereitung", fertig: false },
  { id: "stiebel", name: "Stiebel Eltron, in Vorbereitung", fertig: false },
];

/* ------------------------------------------------------------------ *
 *  Geraeteprofile zum Exportieren und Importieren
 * ------------------------------------------------------------------ */
export const PROFIL_FORMAT = "lutarym-geraeteprofil";

export const PROFIL_VERSION = 1;

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

/** Profil fuer die Erkennung: eigenes Objekt oder Kennung des eingebauten. */
export function profilFuer(config) {
  return eigenesProfil(config) || (config && config.profil);
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
  Object.keys(p.felder).forEach((feld) =>
    [].concat(p.felder[feld]).forEach((w) => {
      if (typeof w !== "string" || !w.trim()) return;
      const r = { feld, w: w.trim(), klein: w.trim().toLowerCase() };
      if (r.w.includes("*")) {
        r.re = new RegExp(
          "^" + r.w.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$",
          "i"
        );
      }
      regeln.push(r);
    })
  );
  const passt = (r, id, eintrag) => {
    if (r.re) return r.re.test(id);
    if (r.w.includes(".")) return id === r.w;
    const klein = id.toLowerCase();
    return (
      Boolean(eintrag && eintrag.translation_key === r.w) ||
      klein.endsWith(`_${r.klein}`) ||
      klein.split(".")[1] === r.klein
    );
  };
  const assign = (feld, entityId) => {
    const allowed = FIELD_DOMAIN[feld];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    const bisher = result.entities[feld];
    if (bisher && stellbar(bisher) && !stellbar(entityId)) return;
    result.entities[feld] = entityId;
  };
  const pruefe = (id, eintrag) => {
    let treffer = false;
    regeln.forEach((r) => {
      if (passt(r, id, eintrag)) {
        assign(r.feld, id);
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
