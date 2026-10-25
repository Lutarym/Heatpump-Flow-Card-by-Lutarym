/**
 * Zeitraum der Diagramme und Auswertungen im Fenster: 24 Stunden bis
 * 1 Jahr. Ein gemeinsamer Zeitraum fuer alle Reiter.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Datenquellen in Home Assistant (Stand 25.10.2026, home-assistant.io,
 * "Long-term statistics" und "Recorder"):
 *  - Der Verlauf mit jedem Zustandswechsel wird standardmaessig nach
 *    10 Tagen geloescht (purge_keep_days).
 *  - Die Langzeitstatistik mit Stundenwerten bleibt erhalten, gibt es aber
 *    nur fuer Zahlensensoren mit state_class.
 * Darum: bis 3 Tage der Verlauf, ab 7 Tagen Mittelwerte aus der
 * Langzeitstatistik (Stunden bis 1 Monat, darueber Tage). Laeufe,
 * SG Ready und Abtauungen brauchen den Verlauf; dieser wird hoechstens
 * fuer 31 Tage abgefragt, damit der Browser nicht an einem Jahr voller
 * Einzelwerte haengt (eigene Grenze der Karte).
 */
import { escapeHtml } from "../hilfsfunktionen.js";

const ZEITRAEUME = ["24h", "3d", "7d", "1m", "3m", "6m", "1j"];

/** Hoechstens so weit zurueck wird der Verlauf abgefragt. */
const VERLAUF_MAX = 31 * 86400000;

const TAG = 86400000;

/** Mitternacht des Tages von t in Ortszeit. */
function tagesbeginn(t) {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Teilt einen Zeitraum in Faecher fuer Balken und Ampeln. Bis 3 Tage
 * 24 gleiche Teile, bis gut einen Monat ganze Tage, bis ein halbes Jahr
 * Wochen ab Montag, darueber Monate.
 */
export function zeitRaster(t0, t1) {
  const spanne = t1 - t0;
  const grenzen = [];
  let art;
  if (spanne <= 3.05 * TAG) {
    art = spanne <= 1.05 * TAG ? "stunde" : "drei";
    for (let i = 0; i <= 24; i++) grenzen.push(t0 + (i * spanne) / 24);
    return { art, grenzen };
  }
  let t;
  let weiter;
  if (spanne <= 35 * TAG) {
    art = "tag";
    t = tagesbeginn(t0);
    weiter = (x) => {
      const d = new Date(x);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    };
  } else if (spanne <= 190 * TAG) {
    art = "woche";
    const d = new Date(tagesbeginn(t0));
    t = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)).getTime();
    weiter = (x) => {
      const e = new Date(x);
      return new Date(e.getFullYear(), e.getMonth(), e.getDate() + 7).getTime();
    };
  } else {
    art = "monat";
    const d = new Date(t0);
    t = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    weiter = (x) => {
      const e = new Date(x);
      return new Date(e.getFullYear(), e.getMonth() + 1, 1).getTime();
    };
  }
  grenzen.push(t0);
  t = weiter(t);
  while (t < t1) {
    grenzen.push(t);
    t = weiter(t);
  }
  grenzen.push(t1);
  return { art, grenzen };
}

export const zeitraumKarte = {
  /** Gewaehlter Zeitraum. Ohne Fenster (Verlauf fest in der Karte) immer 24 Stunden. */
  _zrSchluessel() {
    return this._verlaufAlsKnopf() && ZEITRAEUME.includes(this._zr) ? this._zr : "24h";
  },

  /**
   * Beginn und Ende des Zeitraums, ob die Langzeitstatistik genutzt wird
   * und in welcher Aufloesung.
   */
  _zrSpanne() {
    const k = this._zrSchluessel();
    const t1 = Date.now();
    const d = new Date(t1);
    const monate = { "1m": 1, "3m": 3, "6m": 6, "1j": 12 }[k];
    // Monate nach Kalender; am 31. wird auf den letzten Tag des Zielmonats
    // gekuerzt, sonst liefe der 31. Maerz minus 1 Monat in den Maerz.
    let t0;
    if (monate) {
      const letzter = new Date(d.getFullYear(), d.getMonth() - monate + 1, 0).getDate();
      t0 = new Date(d.getFullYear(), d.getMonth() - monate, Math.min(d.getDate(), letzter), d.getHours(), d.getMinutes()).getTime();
    } else {
      t0 = t1 - { "24h": 1, "3d": 3, "7d": 7 }[k] * TAG;
    }
    const statistik = !["24h", "3d"].includes(k);
    const periode = k === "7d" || k === "1m" ? "hour" : "day";
    return { k, t0, t1, statistik, periode, tVerlauf: Math.max(t0, t1 - VERLAUF_MAX) };
  },

  /** Kurzes Datum im Format der Sprache. */
  _zrDatum(t, mitJahr) {
    try {
      return new Date(t).toLocaleDateString(this._sp(), mitJahr
        ? { day: "2-digit", month: "2-digit", year: "numeric" }
        : { day: "2-digit", month: "2-digit" });
    } catch {
      const d = new Date(t);
      return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.`;
    }
  },

  /** Beschriftung eines Zeitpunkts passend zur Spanne. */
  _zrMarke(t, spanne) {
    const d = new Date(t);
    const uhr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    if (spanne <= 1.05 * TAG) return uhr;
    if (spanne <= 3.05 * TAG) {
      try {
        return `${d.toLocaleDateString(this._sp(), { weekday: "short" })} ${uhr}`;
      } catch {
        return uhr;
      }
    }
    if (spanne <= 190 * TAG) return this._zrDatum(t, false);
    try {
      return d.toLocaleDateString(this._sp(), { month: "short", year: "2-digit" });
    } catch {
      return this._zrDatum(t, true);
    }
  },

  /** Zeitachse mit fuenf Marken, die letzte heisst "jetzt". */
  _zrAchse(links, rechts, y, t0, t1, attr) {
    const spanne = t1 - t0 || 1;
    let out = "";
    for (let i = 0; i <= 4; i++) {
      const x = links + (i / 4) * (rechts - links);
      const text = i === 4 ? this._t("jetzt") : this._zrMarke(t0 + (i * spanne) / 4, spanne);
      const anker = i === 0 ? "start" : i === 4 ? "end" : "middle";
      out += `<text ${attr} x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}">${escapeHtml(text)}</text>`;
    }
    return out;
  },

  /** Auswahlliste im Fenstertitel. */
  _zrAuswahl() {
    const k = this._zrSchluessel();
    return `<select id="dia-zeitraum" class="lhc-zr-wahl" aria-label="${escapeHtml(this._t("z_zeitraum"))}">${ZEITRAEUME
      .map((z) => `<option value="${z}"${z === k ? " selected" : ""}>${escapeHtml(this._t(`z_${z}`))}</option>`)
      .join("")}</select>`;
  },

  /** Neuer Zeitraum: alle Daten neu holen und die offene Ansicht zeichnen. */
  _zrWechsel(k) {
    if (!ZEITRAEUME.includes(k) || k === this._zr) return;
    this._zr = k;
    this._verlaufZeit = 0;
    this._tempZeit = 0;
    this._auswertungZeit = 0;
    this._verlauf = null;
    this._verlaufStat = null;
    this._sgVerlauf = null;
    this._tempVerlauf = null;
    this._auswertung = null;
    if (this._diaArt) this._zeigeDia(this._diaArt);
  },

  /**
   * Hinweis unter dem Titel, woher die Werte kommen und ab wann Daten
   * vorliegen. Jede Ansicht meldet ihren eigenen Stand.
   */
  _zrHinweis(teile) {
    const el = this.shadowRoot && this.shadowRoot.getElementById("dia-zr-hinweis");
    if (!el) return;
    const text = (teile || []).filter(Boolean).join(" · ");
    el.textContent = text;
    el.hidden = !text;
  },

  /**
   * Hinweis, wenn der Verlauf spaeter beginnt als der Zeitraum: entweder
   * wegen der Grenze von 31 Tagen oder weil Home Assistant nicht mehr hat.
   */
  _zrLueckeText(ersterPunkt, sp) {
    if (ersterPunkt === null || ersterPunkt === undefined || ersterPunkt - sp.t0 <= 3600000) return "";
    const datum = this._zrDatum(ersterPunkt, true);
    if (sp.tVerlauf > sp.t0 && ersterPunkt - sp.tVerlauf <= 3600000) return this._t("z_grenze").replace("{d}", datum);
    return this._t("z_ab").replace("{d}", datum);
  },

  /** Text zur Quelle bei Langzeitstatistik. */
  _zrStatText(periode) {
    return this._t(periode === "hour" ? "z_stat_stunde" : "z_stat_tag");
  },

  /**
   * Holt Mittelwerte (und auf Wunsch Kleinst- und Groesstwerte) aus der
   * Langzeitstatistik. Ergebnis je Kennung: [{ t0, t1, v, min, max }].
   */
  async _zrStatistik(ids, sp, mitBereich) {
    const zeit = (w) => (typeof w === "number" ? w : Date.parse(w));
    const antwort = await this._hass.callWS({
      type: "recorder/statistics_during_period",
      start_time: new Date(sp.t0).toISOString(),
      end_time: new Date(sp.t1).toISOString(),
      statistic_ids: ids,
      period: sp.periode,
      types: mitBereich ? ["mean", "min", "max"] : ["mean"],
    });
    const out = {};
    const schritt = sp.periode === "hour" ? 3600000 : TAG;
    ids.forEach((id) => {
      out[id] = ((antwort && antwort[id]) || [])
        .map((z) => {
          const a = zeit(z.start);
          const e = zeit(z.end);
          return {
            t0: a,
            t1: Math.min(Number.isFinite(e) ? e : a + schritt, sp.t1),
            v: z.mean === null || z.mean === undefined ? NaN : Number(z.mean),
            min: z.min === null || z.min === undefined ? NaN : Number(z.min),
            max: z.max === null || z.max === undefined ? NaN : Number(z.max),
          };
        })
        .filter((z) => Number.isFinite(z.t0) && Number.isFinite(z.v) && z.t1 > z.t0);
    });
    return out;
  },
};
