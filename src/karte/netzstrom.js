/**
 * Netzstrom der Waermepumpe heute: der Teil ihres Stroms seit Mitternacht,
 * der aus dem Netz kam. Er ersetzt in der Grafik die PV-Leistung.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Gerechnet wird wie in HeishaMon by Lutarym 1.7.0 (analyse.py): je
 * Zeitabschnitt zaehlt min(Leistung der Waermepumpe, max(0, Netzbezug)).
 * Netzbezug 0 kW oder Einspeisung heisst: nichts aus dem Netz. Vorrang hat
 * der Wert der Integration (pv_share_today, Attribute netz_kwh_heute und
 * strom_kwh_heute, braucht dort die Option "Netzbezug-Sensor"). Fehlt er,
 * rechnet die Karte selbst aus dem Verlauf seit Mitternacht: Feld
 * grid_power (positiv Bezug, negativ Einspeisung) und power_now
 * (Leistung der Waermepumpe), hoechstens alle fuenf Minuten neu.
 */
import { fmt } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { verlaufsReihe } from "./auswertung.js";

const FUENF_MINUTEN = 300000;

/** Leistung in W, auch wenn die Entitaet in kW oder MW meldet. */
export function inWatt(wert, einheit) {
  const e = String(einheit || "").trim();
  if (e === "kW") return wert * 1000;
  if (e === "MW") return wert * 1e6;
  return wert;
}

/**
 * Netzanteil aus zwei Leistungsreihen in W ([{t, v}], aufsteigend, jeder
 * Wert gilt bis zum naechsten). Unbekannte Werte zaehlen nicht. Liefert
 * kWh gesamt, kWh aus dem Netz und den gedeckten Anteil der Zeit.
 */
export function netzAnteil(wp, netz, t0, t1) {
  if (!(t1 > t0)) return null;
  const zeiten = [...new Set([t0, t1, ...wp.map((p) => p.t), ...netz.map((p) => p.t)])]
    .filter((t) => t >= t0 && t <= t1)
    .sort((a, b) => a - b);
  let i = -1;
  let j = -1;
  let gesamt = 0;
  let ausNetz = 0;
  let gedeckt = 0;
  for (let k = 0; k < zeiten.length - 1; k++) {
    const t = zeiten[k];
    const dt = zeiten[k + 1] - t;
    while (i + 1 < wp.length && wp[i + 1].t <= t) i++;
    while (j + 1 < netz.length && netz[j + 1].t <= t) j++;
    const pw = i >= 0 ? wp[i].v : NaN;
    const pn = j >= 0 ? netz[j].v : NaN;
    if (!Number.isFinite(pw) || !Number.isFinite(pn)) continue;
    const w = Math.max(0, pw);
    gesamt += (w * dt) / 3600000;
    ausNetz += (Math.min(w, Math.max(0, pn)) * dt) / 3600000;
    gedeckt += dt;
  }
  if (!gedeckt) return null;
  return { gesamt: gesamt / 1000, netz: ausNetz / 1000, gedeckt: gedeckt / (t1 - t0) };
}

/** Beginn des heutigen Tages in Ortszeit. */
function mitternacht(t) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export const netzstromKarte = {
  /**
   * Netzstrom heute: { netz, gesamt, anteil, quelle, id } oder null.
   * quelle ist "integration" oder "karte"; id ist die Entitaet fuer den
   * Verlauf beim Klick.
   */
  _netzHeute() {
    const w = typeof this._int === "function" ? this._int("pv_share_today") : null;
    const netz = w ? parseFloat(w.attr.netz_kwh_heute) : NaN;
    if (w && Number.isFinite(netz)) {
      const gesamt = parseFloat(w.attr.strom_kwh_heute);
      const anteil = w.zahl !== null ? w.zahl : Number.isFinite(gesamt) && gesamt > 0 ? 100 * (1 - netz / gesamt) : null;
      return { netz, gesamt: Number.isFinite(gesamt) ? gesamt : null, anteil, quelle: "integration", id: w.id };
    }
    if (this._config.demo || !this._e("grid_power") || !this._e("power_now")) return null;
    this._ladeNetzHeute();
    const c = this._netzCache;
    if (!c || c.tag !== mitternacht(Date.now()) || !c.wert) return null;
    const { gesamt, netz: n } = c.wert;
    return { netz: n, gesamt, anteil: gesamt > 0 ? 100 * (1 - n / gesamt) : null, quelle: "karte", id: this._e("grid_power") };
  },

  /** Holt den Verlauf seit Mitternacht, hoechstens alle fuenf Minuten. */
  _ladeNetzHeute() {
    const jetzt = Date.now();
    const tag = mitternacht(jetzt);
    const wpId = this._e("power_now");
    const netzId = this._e("grid_power");
    const k = `${wpId}|${netzId}`;
    const c = this._netzCache;
    if (c && c.k === k && c.tag === tag && (c.laedt || jetzt - c.zeit < FUENF_MINUTEN)) return;
    if (!this._hass || typeof this._hass.callWS !== "function") return;
    this._netzCache = { ...(c && c.k === k && c.tag === tag ? c : {}), k, tag, zeit: jetzt, laedt: true };
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: new Date(tag).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: [wpId, netzId],
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        const st = (this._hass && this._hass.states) || {};
        const einheit = (id) => (st[id] && st[id].attributes ? st[id].attributes.unit_of_measurement : "");
        const reihe = (id) => verlaufsReihe(antwort, id).map((p) => ({ t: p.t, v: inWatt(p.v, einheit(id)) }));
        const wert = netzAnteil(reihe(wpId), reihe(netzId), tag, jetzt);
        this._netzCache = { k, tag, zeit: Date.now(), laedt: false, wert };
        this._zeigeNetz();
      })
      .catch(() => {
        this._netzCache = { k, tag, zeit: Date.now(), laedt: false, wert: null };
      });
  },

  /** Schreibt Netzstrom und PV-Anteil in die Grafik. */
  _zeigeNetz() {
    const n = this._netzHeute();
    const gruppe = this._animEl("pv-group");
    if (gruppe) gruppe.setAttribute("opacity", n ? "1" : "0");
    const wert = this._animEl("pv-v");
    if (wert) wert.textContent = n ? `${fmt(n.netz, 1)} kWh` : "--";
    const anteil = this._animEl("pv-anteil");
    if (anteil) {
      const a = n && Number.isFinite(n.anteil) ? Math.min(100, Math.max(0, n.anteil)) : null;
      anteil.textContent = a === null ? "" : tf(this._t("pv_anteil_kurz"), { p: fmt(a, 0) });
    }
    // Mittig zwischen den Trennlinien: Mit Untertext ruecken Beschriftung,
    // Wert und Untertext um den Versatz des Layouts nach oben, ohne stehen
    // Beschriftung und Wert wie bisher.
    const mitAnteil = Boolean(anteil && anteil.textContent);
    const versatz = gruppe ? Number(gruppe.getAttribute("data-versatz")) || 0 : 0;
    ["pv-label", "pv-v", "pv-anteil"].forEach((id) => {
      const el = this._animEl(id);
      const basis = el ? Number(el.getAttribute("data-y")) : NaN;
      if (Number.isFinite(basis)) el.setAttribute("y", String(basis + (mitAnteil ? versatz : 0)));
    });
  },

  /** Entitaet fuer den Verlauf beim Klick auf den Wert. */
  _netzKlickId() {
    const n = this._netzHeute();
    return n ? n.id : null;
  },
};
