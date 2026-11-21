/**
 * Werte der Integration HeishaMon by Lutarym fuer die Analyse.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Gesucht wird ohne Editorfeld beim Geraet der Karte: im Register von
 * Home Assistant ueber platform, device_id und translation_key, sonst
 * ueber das Namensschema der Integration (heishamon_<geraet>_<schluessel>).
 * Die Integration legt die Werte selbst an (ab 1.7.0: Betriebsanalyse,
 * Warmwasser-Auswertung, Firmware; ab HeishaMon 4.3.0: TOP144 bis TOP169,
 * ab 4.4.0: TOP170 bis TOP198, gezaehlt nach NUMBER_OF_TOPICS in decode.h).
 */
import { INTEGRATION_DOMAIN } from "../erkennung.js";

const UNGUELTIG = ["unavailable", "unknown", "none", "", "null"];

/**
 * Topic-Gruppe "Installer settings" in HeishaMon ab 4.4.0, ab Werk aus
 * (decode.h: TOPIC_GROUPS_DEFAULT ohne TG_INSTALLER). Daraus nutzt die
 * Karte TOP95, TOP99 und TOP100.
 */
export const INSTALLER_TOPS = { top95: "pump_max_duty", top99: "buffer_installed", top100: "dhw_installed" };

export const integrationKarte = {
  /**
   * Geraet der Karte: das haeufigste Geraet der eingetragenen Entitaeten.
   * Dazu alle Entitaeten dieses Geraets nach translation_key.
   */
  _intGeraet() {
    const hass = this._hass;
    const reg = hass && hass.entities && typeof hass.entities === "object" ? hass.entities : null;
    const ein = Object.values((this._config && this._config.entities) || {}).filter((v) => typeof v === "string");
    const k = `${ein.join(",")}|${reg ? Object.keys(reg).length : 0}`;
    if (this._intCache && this._intCache.k === k && this._intCache.reg === reg) return this._intCache;
    const zaehl = {};
    let praefix = null;
    ein.forEach((id) => {
      const e = reg && reg[id];
      if (e && e.platform === INTEGRATION_DOMAIN && e.device_id) zaehl[e.device_id] = (zaehl[e.device_id] || 0) + 1;
      const m = !praefix && String(id).match(/^[a-z_]+\.(heishamon_.+?)_top\d+$/);
      if (m) praefix = m[1];
    });
    const geraet = Object.keys(zaehl).sort((a, b) => zaehl[b] - zaehl[a])[0] || null;
    const ids = {};
    let anzahl = 0;
    if (reg) {
      Object.keys(reg).forEach((id) => {
        const e = reg[id];
        if (!e || e.platform !== INTEGRATION_DOMAIN) return;
        if (geraet && e.device_id !== geraet) return;
        anzahl++;
        if (!e.translation_key) return;
        // Gibt es zum selben Wert Sensor und Zahl, gilt der Sensor.
        if (!ids[e.translation_key] || id.startsWith("sensor.")) ids[e.translation_key] = id;
      });
    }
    this._intCache = { k, reg, geraet, praefix, ids, anzahl };
    return this._intCache;
  },

  /** Entitaet der Integration zu einem Schluessel (translation_key). */
  _intId(schluessel) {
    if (this._config && this._config.demo) return `demo.int_${schluessel}`;
    const g = this._intGeraet();
    if (g.ids[schluessel]) return g.ids[schluessel];
    const st = this._hass && this._hass.states;
    if (g.praefix && st) {
      for (const dom of ["sensor", "number", "update", "select", "switch"]) {
        const id = `${dom}.${g.praefix}_${schluessel}`;
        if (st[id]) return id;
      }
    }
    return null;
  },

  /**
   * Zustand eines Werts der Integration: roh, als Zahl und Attribute.
   * null, wenn es den Wert nicht gibt; roh ist null, wenn er ungueltig ist.
   */
  _int(schluessel) {
    const id = this._intId(schluessel);
    const q = this._quelle;
    const st = id && q && q.states && q.states[id];
    if (!st) return null;
    const gueltig = !UNGUELTIG.includes(String(st.state).toLowerCase());
    const zahl = gueltig ? parseFloat(st.state) : NaN;
    return { id, roh: gueltig ? String(st.state) : null, zahl: Number.isFinite(zahl) ? zahl : null, attr: st.attributes || {} };
  },

  /** Zahl eines Werts der Integration oder null. */
  _intZahl(schluessel) {
    const w = this._int(schluessel);
    return w ? w.zahl : null;
  },

  /** Ob die Integration fuer diese Karte erkannt ist. */
  _intDa() {
    if (this._config && this._config.demo) return true;
    const g = this._intGeraet();
    return g.anzahl > 0 || Boolean(g.praefix);
  },

  /**
   * TOP95, TOP99 und TOP100 haben keinen gueltigen Wert, obwohl die
   * Integration Daten liefert. Die Integration legt diese Entitaeten immer
   * an; ist die Gruppe "Installer settings" in HeishaMon 4.4.0 und neuer
   * aus, sind sie nicht verfuegbar. Ist HeishaMon ganz weg (auch TOP0 ohne
   * Wert), gibt es keinen Hinweis. Liefert die fehlenden Topics.
   */
  _intInstallerFehlt() {
    if ((this._config && this._config.demo) || !this._intDa()) return [];
    const st = (this._hass && this._hass.states) || {};
    const gueltig = (id) => Boolean(id && st[id] && !UNGUELTIG.includes(String(st[id].state).toLowerCase()));
    if (!gueltig(this._e("heatpump_state")) && !gueltig(this._intId("top0"))) return [];
    return Object.entries(INSTALLER_TOPS)
      .filter(([top, feld]) => !gueltig(this._e(feld)) && !gueltig(this._intId(top)))
      .map(([top]) => top.toUpperCase());
  },
};

/**
 * Nachbildung der Integrationswerte fuer den Demomodus. Erfundene Werte,
 * wie alle Werte im Demomodus.
 */
export function demoIntegration(states) {
  const s = (k, state, attributes = {}) => {
    states[`demo.int_${k}`] = { state: String(state), attributes };
  };
  s("compressor_starts_24h", 9, {
    mittlere_laufzeit_min: 46.2, kurze_laeufe_24h: 1, laengster_lauf_min: 142, starts_je_tag_7d: 8.4,
    starts_warmwasser_24h: 2, zaehler_waermepumpe: 2381,
  });
  s("compressor_runtime_avg", 46.2);
  s("compressor_short_runs_24h", 1, { grenze_min: 10 });
  s("dhw_cop_last", 3.1, { start: "13:58", dauer_min: 52, aussentemperatur: 9.2, strom_kwh: 1.21, waerme_kwh: 3.75, pv_anteil_prozent: 64 });
  s("dhw_best_hour", "14:00", {
    cop_je_startstunde: { "04:00": 2.6, "06:00": 2.7, "08:00": 2.9, "10:00": 3.1, "12:00": 3.3, "14:00": 3.5, "16:00": 3.3, "18:00": 3.0 },
    ladungen_je_startstunde: { "04:00": 3, "06:00": 4, "08:00": 2, "10:00": 2, "12:00": 3, "14:00": 6, "16:00": 2, "18:00": 2 },
    ladungen_ausgewertet: 24,
  });
  s("dhw_cost_last", 0.39, { strom_kwh: 1.21, preis_ct_kwh: 32 });
  s("dhw_cost_per_day", 0.62, { kwh_je_tag: 1.94, preis_ct_kwh: 32 });
  s("defrost_24h", 3, {
    dauer_gesamt_min: 17, mittlere_dauer_min: 5.7, strom_kwh_24h: 0.21, je_tag_7d: 2.6,
    anzahl_7d_je_aussentemperatur: { "-2 °C": 3, "0 °C": 5, "2 °C": 6, "4 °C": 3, "6 °C": 1 },
  });
  s("flow_over_target", 0.8, {
    heizstunden_7d: 61.5,
    vorlauf_je_aussentemperatur: {
      "-2 °C": { ist: 41.6, soll: 40.9, stunden: 6.1 }, "0 °C": { ist: 40.2, soll: 39.5, stunden: 12.4 },
      "2 °C": { ist: 38.9, soll: 38.0, stunden: 17.8 }, "4 °C": { ist: 37.6, soll: 36.6, stunden: 14.2 },
      "6 °C": { ist: 36.0, soll: 35.1, stunden: 8.3 }, "8 °C": { ist: 34.4, soll: 33.7, stunden: 2.7 },
    },
  });
  s("spread_heating", 3.8, { durchfluss_l_min: 18.6 });
  s("spread_dhw", 5.6, { durchfluss_l_min: 19.4 });
  s("pv_share_today", 42, { pv_anteil_7_tage: 37, strom_kwh_heute: 8.4, netz_kwh_heute: 4.9 });
  s("heater_runtime_today", 0, { "7d_min": 0, zuletzt_aktiv: null, betriebsstunden_heizstab_warmwasser: 11 });
  s("dhw_charges_24h", 2, { erzwungen_24h: 1, ladungen_gesamt: 118, typische_ladedauer_min: 52, daten_ab: "2026-09-26" });
  s("dhw_hold_last", 19.5, { ladetemperatur: 50, nachladetemperatur: 42 });
  s("dhw_hold_avg", 18.2, { median_h: 18.6, anzahl: 41, nachladetemperatur_mittel: 42.3 });
  s("dhw_reheat_temp", 42.1, { mittel: 42.3 });
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach((tag, i) => {
    s(`dhw_optimal_${tag}`, ["05:45", "05:45", "06:00", "05:45", "06:15", "07:30", "07:45"][i], { ausgewertete_tage: 7 });
  });
  s("firmware", "off", { installed_version: "v4.4.1", latest_version: "v4.4.1", title: "HeishaMon" });
  s("top147", 3);
  s("top149", 1);
  s("top154", 120); s("top155", 120); s("top156", 150); s("top157", 150);
  s("top184", 3); s("top185", 3); s("top187", 6); s("top188", 6); s("top190", 0);
  s("top158", 480);
  s("top159", 60);
  s("top169", 40);
  s("top177", 0); s("top178", 0); s("top193", 0); s("top195", 0); s("top196", 0);
  s("top197", 12);
  s("top198", 1);
}
