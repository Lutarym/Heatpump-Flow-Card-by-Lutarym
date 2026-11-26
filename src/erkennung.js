/**
 * Erkennung: welche Entitaet gehoert zu welchem Namen der Namensliste.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Gesucht wird nur ueber Profile (profile.js, Ordner Profile). Ohne
 * Profil nimmt die Karte keinen Hersteller an.
 */
import { ARTEN } from "./namen.js";
import { stellbar } from "./hilfsfunktionen.js";
import { AUTO_PROFIL, KEIN_PROFIL, alleVarianten, feldArten, profilKennung, regelnVon, varianteZu } from "./profile.js";

export { feldArten };

/** Wie viele Namen mindestens passen muessen, damit eine Variante als erkannt gilt. */
const MIN_TREFFER = 2;

function leer() {
  return { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
}

/**
 * Erkennung nach einer Variante. Je Name eine Liste von Suchregeln:
 *  - mit Punkt ("sensor.vorlauf") genau diese Entitaet,
 *  - mit Stern ("sensor.*_vorlauf") ein Muster ueber die Entity ID,
 *  - "domain:schluessel" wie ein Schluessel, nur in dieser Domain,
 *  - sonst ein Schluessel: translation_key der Integration oder das Ende
 *    der Entity ID nach einem Unterstrich ("top4" passt auf
 *    "sensor.heishamon_top4").
 * Stellbar gewinnt vor nur lesbar, dann die fruehere Regel, dann der
 * genauere Treffer. Mit geraet zaehlen im Register nur Entitaeten dieses
 * Geraets (die Karte nimmt das Geraet ihrer eingetragenen Entitaeten).
 */
export function erkenneMitProfil(hass, v, geraet) {
  const result = leer();
  if (!hass || !v || !v.werte) return result;
  const regeln = [];
  Object.keys(v.werte).forEach((name) => {
    regelnVon(v.werte[name]).forEach((w, i) => {
      if (typeof w !== "string" || !w.trim()) return;
      let wort = w.trim();
      let domain = "";
      const m = wort.match(/^([a-z_]+):(.+)$/);
      if (m) {
        domain = m[1];
        wort = m[2];
      }
      const r = { name, w: wort, klein: wort.toLowerCase(), domain, rang: i + 1 };
      if (r.w.includes("*")) {
        r.re = new RegExp(
          "^" + r.w.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$",
          "i"
        );
      }
      regeln.push(r);
    });
  });
  // 0 bei keinem Treffer, 2 bei genauem Treffer (Schluessel der
  // Integration, ganze Entity ID), 1 ueber das Ende der Entity ID oder ein Muster.
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
  const assign = (name, entityId, rang, art) => {
    const erlaubt = ARTEN[name];
    if (erlaubt && !erlaubt.includes(entityId.split(".")[0])) return;
    const bisher = result.entities[name];
    if (bisher) {
      const sb = stellbar(bisher);
      const sn = stellbar(entityId);
      if (sb && !sn) return;
      if (sb === sn) {
        const g = guete[name];
        if (rang > g.rang) return;
        if (rang === g.rang && art <= g.art) return;
      }
    }
    result.entities[name] = entityId;
    guete[name] = { rang, art };
  };
  const pruefe = (id, eintrag) => {
    let treffer = false;
    regeln.forEach((r) => {
      const art = passt(r, id, eintrag);
      if (art) {
        assign(r.name, id, r.rang, art);
        treffer = true;
      }
    });
    return treffer;
  };

  const suche = v.suche || {};
  const reg = hass.entities;
  if (suche.integration && reg && typeof reg === "object") {
    const geraete = new Set();
    let hits = 0;
    Object.keys(reg).forEach((id) => {
      const e = reg[id];
      if (!e || e.platform !== suche.integration) return;
      if (geraet && e.device_id !== geraet) return;
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
  const teil = String(suche.namensteil || "").toLowerCase();
  // Mit Integration, aber ohne Namensteil, wird nur im Register gesucht.
  // Sonst passten allgemeine Schluessel wie "outdoor_temperature" auf
  // fremde Entitaeten.
  if (suche.integration && !teil) return result;
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

/** Erkennung nach einer Variante, ohne Variante leer. */
export function detectIntegration(hass, v, geraet) {
  return v ? erkenneMitProfil(hass, v, geraet) : leer();
}

/**
 * Geraet der Karte im Register: das haeufigste Geraet der eingetragenen
 * Entitaeten, die zur Integration der Variante gehoeren, sonst null. Gibt
 * es mehrere Geraete (etwa zwei Waermepumpen), sucht die Karte die
 * uebrigen Werte bei diesem.
 */
export function geraetDerKarte(hass, v, entities) {
  const reg = hass && hass.entities && typeof hass.entities === "object" ? hass.entities : null;
  const integration = v && v.suche && v.suche.integration;
  if (!reg || !integration) return null;
  const zaehl = {};
  Object.values(entities || {}).forEach((id) => {
    const e = typeof id === "string" ? reg[id] : null;
    if (e && e.platform === integration && e.device_id) zaehl[e.device_id] = (zaehl[e.device_id] || 0) + 1;
  });
  return Object.keys(zaehl).sort((a, b) => zaehl[b] - zaehl[a])[0] || null;
}

/**
 * Sucht alle geladenen und eigenen Varianten ab. Liefert die erkannten,
 * sortiert nach der Zahl passender Namen. Sucht eine Variante ueber die
 * Entity ID (ohne Register), zaehlen dabei keine Entitaeten, die laut
 * Register zu der Integration einer anderen Variante gehoeren. Sonst
 * gaelte etwa HeishaMon ueber MQTT neben HeishaMon by Lutarym als
 * erkannt, nur weil einzelne Entity IDs gleich enden.
 */
export function erkenneAlle(hass, config) {
  if (!hass) return [];
  const varianten = alleVarianten(config);
  const integrationen = new Set(varianten.map((v) => v.suche && v.suche.integration).filter(Boolean));
  const reg = hass.entities && typeof hass.entities === "object" ? hass.entities : {};
  const fremd = (id) => Boolean(reg[id] && integrationen.has(reg[id].platform));
  const treffer = [];
  varianten.forEach((v) => {
    const r = erkenneMitProfil(hass, v);
    const namen = Object.keys(r.entities).filter((n) => r.source !== "namensschema" || !fremd(r.entities[n]));
    if (r.found && namen.length >= MIN_TREFFER) treffer.push({ id: v.id, felder: namen.length, count: r.count });
  });
  return treffer.sort((a, b) => b.felder - a.felder);
}

/**
 * Variante fuer die Erkennung. Bei "auto" die mit den meisten passenden
 * Namen. Ohne Treffer oder bei "keins" null: dann nimmt die Karte keinen
 * Hersteller an.
 */
export function profilFuer(config, hass) {
  const id = profilKennung(config);
  if (id === KEIN_PROFIL) return null;
  if (id === AUTO_PROFIL) {
    const liste = erkenneAlle(hass, config);
    return liste.length ? varianteZu(config, liste[0].id) : null;
  }
  return varianteZu(config, id);
}

/**
 * Die Aquarea kennt nur einen Solareingang (TOP47 Temperatur, OPT5 Pumpe).
 * Ist nur ein Kamin gewaehlt, haengt er an diesem Eingang. Dann gehoeren
 * die erkannten Solar-Entitaeten zum Kamin (EXT300, EXT301). Selbst
 * eingetragene Kamin-Entitaeten haben Vorrang. Das gilt nur fuer
 * Varianten mit dem Merkmal heishamon.
 */
export function quellenZuordnung(entities, extraHeat, v) {
  if (extraHeat !== "kamin" || !v || !v.heishamon) return entities;
  const out = { ...entities };
  if (out.TOP47 && !out.EXT300) out.EXT300 = out.TOP47;
  if (out.OPT5 && !out.EXT301) out.EXT301 = out.OPT5;
  delete out.TOP47;
  delete out.OPT5;
  return out;
}

/**
 * Standardnamen einer Variante: genaue Entitaeten und Muster der Form
 * "*.name" (dann mit der ersten erlaubten Art). Schluessel ohne Entity ID
 * lassen sich nicht vorschlagen.
 */
export function standardNamen(v) {
  const map = {};
  if (!v || !v.werte) return map;
  Object.keys(v.werte).forEach((name) => {
    for (const r of regelnVon(v.werte[name])) {
      const w = String(r || "").trim();
      if (w.includes(".") && !w.includes("*") && !/^[a-z_]+:/.test(w)) {
        map[name] = w;
        break;
      }
      const m = /^\*\.([a-z0-9_]+)$/i.exec(w);
      if (m) {
        const arten = ARTEN[name];
        map[name] = `${arten ? arten[0] : "sensor"}.${m[1]}`;
        break;
      }
    }
  });
  return map;
}
