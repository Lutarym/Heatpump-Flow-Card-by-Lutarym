/**
 * Werte fuer die Analyse: Namen ohne Editorfeld aus dem Profil.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Die Analyse liest Werte, die es nicht im Editor gibt, etwa die SG Ready
 * Einstellungen (TOP154 bis TOP157) oder die Auswertungen einer
 * Integration (EXT405 bis EXT418, EXT700 bis EXT706). Woher sie kommen,
 * sagt allein das Profil. Ein Wert, den das Profil nicht kennt, fehlt.
 */
import { LADESTART } from "../namen.js";

const UNGUELTIG = ["unavailable", "unknown", "none", "", "null"];

/**
 * Topic-Gruppe "Installer settings" in HeishaMon ab 4.4.0, ab Werk aus
 * (decode.h: TOPIC_GROUPS_DEFAULT ohne TG_INSTALLER). Daraus nutzt die
 * Karte TOP95, TOP99 und TOP100.
 */
export const INSTALLER_TOPS = ["TOP95", "TOP99", "TOP100"];

export const integrationKarte = {
  /** Entitaet zu einem Namen, sonst null. */
  _intId(name) {
    return this._e(name) || null;
  },

  /**
   * Zustand eines Werts: roh, als Zahl und Attribute. null, wenn es den
   * Wert nicht gibt; roh ist null, wenn er ungueltig ist.
   */
  _int(name) {
    const id = this._intId(name);
    const q = this._quelle;
    const st = id && q && q.states && q.states[id];
    if (!st) return null;
    const gueltig = !UNGUELTIG.includes(String(st.state).toLowerCase());
    const zahl = gueltig ? parseFloat(st.state) : NaN;
    return { id, roh: gueltig ? String(st.state) : null, zahl: Number.isFinite(zahl) ? zahl : null, attr: st.attributes || {} };
  },

  /** Zahl eines Werts oder null. */
  _intZahl(name) {
    const w = this._int(name);
    return w ? w.zahl : null;
  },

  /**
   * TOP95, TOP99 und TOP100 haben keinen gueltigen Wert, obwohl HeishaMon
   * Daten liefert (TOP0). Ist die Gruppe "Installer settings" in HeishaMon
   * 4.4.0 und neuer aus, sind sie nicht verfuegbar. Nur bei Varianten mit
   * dem Merkmal heishamon und nur fuer Namen, die das Profil oder die
   * Konfiguration kennt. Liefert die fehlenden Namen.
   */
  _intInstallerFehlt() {
    if (this._config && this._config.demo) return [];
    const v = typeof this._variante === "function" ? this._variante() : null;
    if (!v || !v.heishamon) return [];
    const st = (this._hass && this._hass.states) || {};
    const gueltig = (id) => Boolean(id && st[id] && !UNGUELTIG.includes(String(st[id].state).toLowerCase()));
    if (!gueltig(this._e("TOP0"))) return [];
    const eigen = (this._config && this._config.entities) || {};
    return INSTALLER_TOPS.filter((n) => (v.werte[n] || eigen[n]) && !gueltig(this._e(n)));
  },
};

/**
 * Nachbildung der Werte fuer die Analyse im Demomodus. Erfundene Werte,
 * wie alle Werte im Demomodus.
 */
export function demoIntegration(states) {
  const s = (name, state, attributes = {}) => {
    states[`demo.${name}`] = { state: String(state), attributes };
  };
  s("EXT700", 9, {
    mittlere_laufzeit_min: 46.2, kurze_laeufe_24h: 1, laengster_lauf_min: 142, starts_je_tag_7d: 8.4,
    starts_warmwasser_24h: 2, zaehler_waermepumpe: 2381,
  });
  s("EXT406", 3.1, { start: "13:58", dauer_min: 52, aussentemperatur: 9.2, strom_kwh: 1.21, waerme_kwh: 3.75, pv_anteil_prozent: 64 });
  s("EXT407", "14:00", {
    cop_je_startstunde: { "04:00": 2.6, "06:00": 2.7, "08:00": 2.9, "10:00": 3.1, "12:00": 3.3, "14:00": 3.5, "16:00": 3.3, "18:00": 3.0 },
    ladungen_je_startstunde: { "04:00": 3, "06:00": 4, "08:00": 2, "10:00": 2, "12:00": 3, "14:00": 6, "16:00": 2, "18:00": 2 },
    ladungen_ausgewertet: 24,
  });
  s("EXT408", 0.39, { strom_kwh: 1.21, preis_ct_kwh: 32 });
  s("EXT409", 0.62, { kwh_je_tag: 1.94, preis_ct_kwh: 32 });
  s("EXT704", 3, {
    dauer_gesamt_min: 17, mittlere_dauer_min: 5.7, strom_kwh_24h: 0.21, je_tag_7d: 2.6,
    anzahl_7d_je_aussentemperatur: { "-2 °C": 3, "0 °C": 5, "2 °C": 6, "4 °C": 3, "6 °C": 1 },
  });
  s("EXT703", 0.8, {
    heizstunden_7d: 61.5,
    vorlauf_je_aussentemperatur: {
      "-2 °C": { ist: 41.6, soll: 40.9, stunden: 6.1 }, "0 °C": { ist: 40.2, soll: 39.5, stunden: 12.4 },
      "2 °C": { ist: 38.9, soll: 38.0, stunden: 17.8 }, "4 °C": { ist: 37.6, soll: 36.6, stunden: 14.2 },
      "6 °C": { ist: 36.0, soll: 35.1, stunden: 8.3 }, "8 °C": { ist: 34.4, soll: 33.7, stunden: 2.7 },
    },
  });
  s("EXT701", 3.8, { durchfluss_l_min: 18.6 });
  s("EXT702", 5.6, { durchfluss_l_min: 19.4 });
  s("EXT5", 42, { pv_anteil_7_tage: 37, strom_kwh_heute: 8.4, netz_kwh_heute: 4.9 });
  s("EXT705", 0, { "7d_min": 0, zuletzt_aktiv: null, betriebsstunden_heizstab_warmwasser: 11 });
  s("EXT405", 2, { erzwungen_24h: 1, ladungen_gesamt: 118, typische_ladedauer_min: 52, daten_ab: "2026-09-26" });
  s("EXT410", 18.2, { median_h: 18.6, anzahl: 41, nachladetemperatur_mittel: 42.3 });
  s("EXT411", 42.1, { mittel: 42.3 });
  ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].forEach((tag, i) => {
    s(LADESTART[tag], ["05:45", "05:45", "06:00", "05:45", "06:15", "07:30", "07:45"][i], { ausgewertete_tage: 7 });
  });
  s("EXT706", "off", { installed_version: "v4.4.1", latest_version: "v4.4.1", title: "HeishaMon" });
  s("TOP147", 3);
  s("TOP149", 1);
  s("TOP154", 120); s("TOP155", 120); s("TOP156", 150); s("TOP157", 150);
  s("TOP184", 3); s("TOP185", 3); s("TOP187", 6); s("TOP188", 6);
  s("TOP159", 60);
  s("TOP169", 40);
  s("TOP177", 0); s("TOP178", 0); s("TOP193", 0); s("TOP195", 0); s("TOP196", 0);
}
