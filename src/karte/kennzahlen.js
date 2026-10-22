/**
 * COP von heute und Jahresarbeitszahl.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { copMittel, fmt, numState } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";

export const kennzahlenKarte = {
  /**
   * Tagesdurchschnitt der Leistungszahl seit Mitternacht. Ob der Wert
   * von der Waermepumpe oder vom externen Strommesser stammt, waehlt die
   * Integration ueber "COP Quelle". Im Demomodus gibt es keine Historie,
   * dort wird der aktuelle Wert gezeigt.
   */
  _cop(hass, basis) {
    const ids = [this._e(basis)];
    if (this._config && this._config.demo) {
      for (const id of ids) {
        const v = numState(hass, id);
        if (v !== null && v > 0) return v;
      }
      return null;
    }
    this._ladeCopTag();
    const tag = this._copTag || {};
    for (const id of ids) {
      if (id && typeof tag[id] === "number") return tag[id];
    }
    return null;
  },

  /**
   * Holt den Verlauf beider Leistungszahlen ab Mitternacht und bildet
   * je Entitaet den zeitgewichteten Mittelwert. Jeder Wert zaehlt so lange,
   * wie er galt. Unbekannt, nicht verfuegbar und Werte bis 0 bleiben
   * draussen, das sind Zeiten ohne Verdichterbetrieb.
   * Abgefragt wird hoechstens alle fuenf Minuten und sofort nach
   * Tageswechsel.
   */
  async _ladeCopTag() {
    const q = this._quelle;
    if (!q || typeof q.callWS !== "function" || this._copLaeuft) return;
    const ids = ["cop_heating", "cop_dhw"]
      .map((k) => this._e(k))
      .filter(Boolean);
    if (!ids.length) return;
    const jetzt = Date.now();
    const d = new Date(jetzt);
    const mitternacht = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const schluessel = ids.join("|");
    if (
      this._copTagStart === mitternacht &&
      this._copTagIds === schluessel &&
      this._copTagZeit &&
      jetzt - this._copTagZeit < 300000
    ) return;
    this._copLaeuft = true;
    this._copTagZeit = jetzt;
    try {
      const antwort = await q.callWS({
        type: "history/history_during_period",
        start_time: new Date(mitternacht).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: ids,
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      });
      const ergebnis = {};
      ids.forEach((id) => {
        ergebnis[id] = copMittel((antwort && antwort[id]) || [], mitternacht, jetzt);
      });
      this._copTag = ergebnis;
      this._copTagStart = mitternacht;
      this._copTagIds = schluessel;
      this._update();
    } catch {
      // Keine Historie verfuegbar, die Zeile bleibt leer.
    } finally {
      this._copLaeuft = false;
    }
  },

  /* -------------------- Jahresarbeitszahl -------------------- */

  /**
   * Entitaeten fuer die JAZ, ausschliesslich von HeishaMon: Heizen
   * (TOP15 Waerme, TOP16 Strom) und Warmwasser (TOP40, TOP41), Kuehlen
   * zaehlt nicht mit. Meldet die Waermepumpe den Zusatzblock (XTOP),
   * sind diese Werte laut HeishaMon ungueltig, dann gelten XTOP3/XTOP0
   * und XTOP5/XTOP2.
   */
  _jazQuellen() {
    if (this._config && this._config.demo) return { demo: true, heizen: true, ww: true };
    const q = this._hass;
    if (!q || !q.states) return null;
    // Die Suche geht ueber alle Entitaeten. Nur neu, wenn sich
    // Registrierung, Konfiguration oder die Anzahl der Entitaeten aendert.
    // Mit Registrierung reicht deren Kennung, sonst zaehlt die Anzahl.
    const anzahl = q.entities ? -1 : Object.keys(q.states).length;
    const c = this._jazCache;
    if (c && c.reg === q.entities && c.cfg === this._config && c.anzahl === anzahl) return c.wert;
    const wert = this._jazQuellenSuchen();
    this._jazCache = { reg: q.entities, cfg: this._config, anzahl, wert };
    return wert;
  },

  _jazQuellenSuchen() {
    const index = this._hilfeEntitaeten();
    const sensor = (k) => (index[k] || []).find((id) => id.startsWith("sensor."));
    const xtop = Boolean(sensor("xtop3") && sensor("xtop0"));
    const paar = (w, e) => (sensor(w) && sensor(e) ? { w: sensor(w), e: sensor(e) } : null);
    const heizen = xtop ? paar("xtop3", "xtop0") : paar("top15", "top16");
    const ww = xtop ? paar("xtop5", "xtop2") : paar("top40", "top41");
    if (!heizen && !ww) return null;
    return { heizen, ww };
  },

  /** Holt die Tageswerte seit dem 1. Januar aus der Langzeitstatistik. */
  async _ladeJaz() {
    const quellen = this._jazQuellen();
    if (!quellen || quellen.demo) return;
    const q = this._hass;
    if (typeof q.callWS !== "function" || this._jazLaeuft) return;
    const schluessel = JSON.stringify(quellen);
    const jetzt = Date.now();
    // Hoechstens einmal je Stunde neu rechnen.
    if (this._jazSchluessel === schluessel && this._jazZeit && jetzt - this._jazZeit < 3600000) return;
    this._jazLaeuft = true;
    const heute = new Date(jetzt);
    const startJahr = new Date(heute.getFullYear(), 0, 1).getTime();
    // Nur ganze Stunden, die laufende Stunde fehlt in der Statistik noch.
    const ende = Math.floor(jetzt / 3600000) * 3600000;
    const zeit = (w) => (typeof w === "number" ? w : Date.parse(w));
    const ids = [];
    ["heizen", "ww"].forEach((k) => {
      if (quellen[k]) ids.push(quellen[k].w, quellen[k].e);
    });
    try {
      const antwort = await q.callWS({
        type: "recorder/statistics_during_period",
        start_time: new Date(startJahr).toISOString(),
        end_time: new Date(ende).toISOString(),
        statistic_ids: ids,
        period: "day",
        types: ["mean"],
      });
      // Energie je Tag in kWh: Mittelwert in W mal Stunden. Negative Werte
      // meldet HeishaMon als ungueltig, sie zaehlen als 0.
      const tage = (id) => {
        const m = new Map();
        ((antwort && antwort[id]) || []).forEach((z) => {
          const a = zeit(z.start);
          const w = Number(z.mean);
          if (!Number.isFinite(a) || z.mean === null || !Number.isFinite(w)) return;
          const b = Math.min(Number.isFinite(zeit(z.end)) ? zeit(z.end) : a + 86400000, ende);
          m.set(a, (Math.max(w, 0) * (b - a)) / 3600000 / 1000);
        });
        return m;
      };
      const reihen = {};
      ["heizen", "ww"].forEach((k) => {
        if (quellen[k]) reihen[k] = { w: tage(quellen[k].w), e: tage(quellen[k].e) };
      });
      // Nur Tage, an denen alle beteiligten Werte vorliegen.
      const rechne = (arten, ab) => {
        const da = arten.filter((k) => reihen[k]);
        if (!da.length) return null;
        const tageListe = [...reihen[da[0]].w.keys()]
          .filter((t) => t >= ab && da.every((k) => reihen[k].w.has(t) && reihen[k].e.has(t)))
          .sort((x, y) => x - y);
        if (!tageListe.length) return null;
        let w = 0;
        let e = 0;
        tageListe.forEach((t) =>
          da.forEach((k) => {
            w += reihen[k].w.get(t);
            e += reihen[k].e.get(t);
          })
        );
        if (e <= 0) return null;
        return { jaz: w / e, waerme: w, strom: e, erster: tageListe[0], ab };
      };
      const ergebnis = {
        gesamt: rechne(["heizen", "ww"], startJahr),
        heizen: rechne(["heizen"], startJahr),
        ww: rechne(["ww"], startJahr),
      };
      this._jaz = ergebnis;
      this._jazSchluessel = schluessel;
      this._jazZeit = jetzt;
      if (this._tuerListe) this._tuerListe.forEach((f, i) => f.jaz && this._tuerZeige(i));
    } catch {
      // Keine Langzeitstatistik, die Zeilen bleiben bei "--".
      this._jaz = null;
    } finally {
      this._jazLaeuft = false;
    }
  },

  /** Fuellt die JAZ-Tabelle hinter der Tuer. */
  _jazZeige(f, el, seit) {
    // Erfundene Werte fuer den Demomodus, in sich stimmig.
    const demo = {
      heizen: { waerme: 17600, strom: 4000 },
      ww: { waerme: 3900, strom: 1000 },
      gesamt: { waerme: 21500, strom: 5000 },
    };
    let ganz;
    try {
      ganz = new Intl.NumberFormat(this._sp(), { maximumFractionDigits: 0 });
    } catch {
      ganz = { format: (v) => fmt(v, 0) };
    }
    let frueh = null;
    el.querySelectorAll("output[data-jaz]").forEach((o) => {
      const r = this._config.demo ? demo[o.dataset.jaz] : this._jaz && this._jaz[o.dataset.jaz];
      if (!r) {
        o.textContent = "--";
        return;
      }
      const w = o.dataset.w;
      o.textContent = w === "jaz" ? fmt(r.waerme / r.strom, 1) : ganz.format(r[w]);
      // Reicht die Statistik nicht bis zum 1. Januar zurueck, steht unter
      // der Tabelle, ab wann gerechnet wurde.
      if (r.erster && r.erster - r.ab > 86400000 && (frueh === null || r.erster < frueh)) frueh = r.erster;
    });
    if (seit) {
      seit.textContent =
        frueh === null
          ? ""
          : tf(this._t("j_seit"), {
              v: new Date(frueh).toLocaleDateString(this._sp(), { day: "2-digit", month: "2-digit", year: "numeric" }),
            });
    }
  },
};
