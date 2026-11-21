/**
 * Reiter "Strom & PV" der Analyse: Strom der Waermepumpe, eigener Strom,
 * Netzstrom, PV und SG Ready im gewaehlten Zeitraum. Drei Darstellungen
 * sind waehlbar (Option power_style):
 *   verlauf  Sonnenverlauf: PV-Leistung und Strom der Waermepumpe ueber
 *            den Zeitraum, Nacht dunkel, darunter SG Ready als Band.
 *   bogen    Sonnenbogen: der Tag von Sonnenaufgang bis Sonnenuntergang
 *            als Bogen, gruen wo die Waermepumpe mit eigenem Strom lief,
 *            dazu SG Ready als Ring und die letzten 7 Tage.
 *   balken   Stundenbalken: Strom der Waermepumpe je Stunde (bei laengeren
 *            Zeitraeumen je 3 Stunden oder je Tag) mit der PV-Erzeugung,
 *            dazu ein Raster der letzten 7 Tage.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Gerechnet wird wie in netzstrom.js und in HeishaMon by Lutarym 1.7.0
 * (analyse.py): je Zeitabschnitt kommt min(Leistung der Waermepumpe,
 * max(0, Netzbezug)) aus dem Netz, der Rest ist eigener Strom (PV direkt
 * oder Batterie). Abschnitte, in denen einer der beiden Werte fehlt,
 * zaehlen fuer diese Aufteilung nicht. Quellen sind die Felder
 * power_now, grid_power und pv_power aus dem Verlauf von Home Assistant
 * (hoechstens 31 Tage wie die Analyse). Sonnenaufgang und Sonnenuntergang
 * stammen aus dem Verlauf von sun.sun (Zustand above_horizon und
 * below_horizon), ein noch kommender Untergang aus dem Attribut
 * next_setting. Die Laeufe fuer SG Ready kommen aus der Analyse
 * (Kontakte K1 und K2).
 *
 * Eigene Festlegungen der Karte:
 *  - Die Waermepumpe gilt in einem Abschnitt als laufend, wenn ihre
 *    mittlere Leistung dort mindestens 100 W betraegt (Bogen und Raster).
 *  - SG Ready "aktiv" heisst Stufe 3 oder 4 (Einschaltempfehlung oder
 *    Anlaufbefehl).
 */
import { escapeHtml, fmt, indexBis } from "../hilfsfunktionen.js";
import { SG_STATES } from "../konstanten.js";
import { tf } from "../texte.js";
import { verlaufsReihe } from "./auswertung.js";
import { inWatt } from "./netzstrom.js";

const STILE = ["verlauf", "bogen", "balken"];
const MINUTE = 60000;
const STUNDE = 3600000;
const TAG = 86400000;
const FUENF_MINUTEN = 5 * MINUTE;

/** Ab dieser mittleren Leistung laeuft die Waermepumpe (eigene Festlegung). */
const LAEUFT_W = 100;

/** Farben: PV, eigener Strom; Netz und neutrale Toene aus der Palette (Themen). */
const F = { pv: "#FBBF24", eigen: "#22C55E", netz: "#55637A" };
const NETZ_CSS = "var(--c-55637a)";

const e = escapeHtml;
const zwei = (n) => String(n).padStart(2, "0");

/** Mitternacht des Tages von t in Ortszeit. */
function tagesbeginn(t) {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Mitternacht n Tage nach dem Tag von t (Sommerzeit beachtet). */
function tagPlus(t, n) {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime();
}

/** Uhrzeit hh:mm in Ortszeit. */
function uhr(t) {
  const d = new Date(t);
  return `${zwei(d.getHours())}:${zwei(d.getMinutes())}`;
}

/** Dauer als "3 h 40 min" oder "25 min". */
export function dauerText(ms) {
  const min = Math.round(ms / MINUTE);
  const h = Math.floor(min / 60);
  return h ? `${h} h ${zwei(min % 60)} min` : `${min} min`;
}

function leer(von, bis) {
  return { von, bis, wp: 0, eigen: 0, netz: 0, pv: 0, dWp: 0, dBeide: 0, dPv: 0 };
}

/**
 * Energie je Abschnitt zwischen aufeinanderfolgenden Grenzen (aufsteigend).
 * r.wp, r.netz und r.pv sind Stufenreihen [{t, v}] in W (jeder Wert gilt
 * bis zum naechsten), eine fehlende Reihe ist null. Je Abschnitt in Wh:
 * wp (Leistung bekannt), eigen und netz (beide Werte bekannt) und pv, dazu
 * die Dauer mit bekannten Werten in ms.
 */
export function stromSummen(r, grenzen) {
  const out = [];
  if (!grenzen || grenzen.length < 2) return out;
  const reihen = [r.wp || [], r.netz || [], r.pv || []];
  const idx = reihen.map((x) => indexBis(x, grenzen[0]));
  const wert = (k) => (idx[k] >= 0 ? reihen[k][idx[k]].v : NaN);
  const ende = grenzen[grenzen.length - 1];
  let g = 1;
  let akt = leer(grenzen[0], grenzen[1]);
  let t = grenzen[0];
  const abschluss = () => {
    while (g < grenzen.length && grenzen[g] <= t) {
      ["wp", "eigen", "netz", "pv"].forEach((k) => {
        akt[k] /= STUNDE;
      });
      out.push(akt);
      g++;
      if (g < grenzen.length) akt = leer(grenzen[g - 1], grenzen[g]);
    }
  };
  abschluss();
  while (t < ende && g < grenzen.length) {
    let naechst = grenzen[g];
    for (let k = 0; k < 3; k++) {
      const n = idx[k] + 1;
      if (n < reihen[k].length && reihen[k][n].t < naechst) naechst = reihen[k][n].t;
    }
    const dt = naechst - t;
    if (dt > 0) {
      const pw = wert(0);
      const pn = wert(1);
      const pp = wert(2);
      if (Number.isFinite(pw)) {
        const w = Math.max(0, pw);
        akt.wp += w * dt;
        akt.dWp += dt;
        if (Number.isFinite(pn)) {
          const n = Math.min(w, Math.max(0, pn));
          akt.netz += n * dt;
          akt.eigen += (w - n) * dt;
          akt.dBeide += dt;
        }
      }
      if (Number.isFinite(pp)) {
        akt.pv += Math.max(0, pp) * dt;
        akt.dPv += dt;
      }
    }
    t = Math.max(t, naechst);
    for (let k = 0; k < 3; k++) {
      while (idx[k] + 1 < reihen[k].length && reihen[k][idx[k] + 1].t <= t) idx[k]++;
    }
    abschluss();
  }
  return out;
}

/** Summe mehrerer Stufenreihen [{t, v}] zu einer (fehlende Werte zaehlen 0). */
function summeReihen(reihen) {
  const zeiten = [...new Set(reihen.flatMap((r) => r.map((p) => p.t)))].sort((a, b) => a - b);
  return zeiten.map((t) => ({
    t,
    v: reihen.reduce((s, r) => {
      const i = indexBis(r, t);
      return s + (i >= 0 && Number.isFinite(r[i].v) ? r[i].v : 0);
    }, 0),
  }));
}

/**
 * Tageslicht aus dem Verlauf von sun.sun: [{auf, unter, angeschnitten}].
 * angeschnitten: Die Sonne stand schon zu Beginn des Verlaufs am Himmel,
 * auf ist dann kein Sonnenaufgang. unter ist null, wenn der Untergang noch
 * kommt und kein next_setting bekannt ist.
 */
function tageslicht(sonne, naechsterUntergang) {
  const out = [];
  if (!sonne || !sonne.length) return out;
  let auf = null;
  let angeschnitten = false;
  let zuletzt = null;
  sonne.forEach((p, i) => {
    if (p.oben === null) return;
    if (p.oben && zuletzt !== true) {
      auf = p.t;
      angeschnitten = i === 0;
    } else if (!p.oben && zuletzt === true && auf !== null) {
      out.push({ auf, unter: p.t, angeschnitten });
      auf = null;
    }
    zuletzt = p.oben;
  });
  if (auf !== null) out.push({ auf, unter: Number.isFinite(naechsterUntergang) ? naechsterUntergang : null, angeschnitten, offen: true });
  return out;
}

/** Abschnitte mit SG-Stufe zwischen t0 und t1 aus einer Reihe [{t, stufe}]. */
function sgAbschnitte(sg, t0, t1) {
  const out = [];
  if (!sg || !sg.length) return out;
  const start = Math.max(0, indexBis(sg, t0));
  for (let i = start; i < sg.length && sg[i].t < t1; i++) {
    const von = Math.max(sg[i].t, t0);
    const bis = Math.min(i + 1 < sg.length ? sg[i + 1].t : t1, t1);
    if (bis <= von || sg[i].stufe === null || sg[i].stufe === undefined) continue;
    const letzter = out[out.length - 1];
    if (letzter && letzter.stufe === sg[i].stufe && letzter.bis === von) letzter.bis = bis;
    else out.push({ stufe: sg[i].stufe, von, bis });
  }
  return out;
}

/** Huebsche Obergrenze einer Achse mit hoechstens vier Linien. */
function skala(max) {
  const roh = Math.max(max * 1.25, 0.5);
  const schritte = [0.25, 0.5, 1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500];
  const schritt = schritte.find((s) => roh / s <= 4) || 1000;
  return { oben: Math.ceil(roh / schritt) * schritt, schritt };
}

/** Farbe zwischen Netz (Anteil 0) und eigenem Strom (Anteil 1). */
function mische(anteil) {
  const a = [0x22, 0xc5, 0x5e];
  const b = [0x55, 0x63, 0x7a];
  const x = Math.min(1, Math.max(0, anteil));
  return `#${a.map((c, i) => Math.round(c * x + b[i] * (1 - x)).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

/** Kleine Sonne als Bild (Strahlen wie in der Karte). */
function sonnenBild() {
  const strahlen = [0, 45, 90, 135, 180, 225, 270, 315]
    .map((w) => `<line x1="0" y1="-10.5" x2="0" y2="-14.5" stroke="${F.pv}" stroke-width="2.2" stroke-linecap="round" transform="rotate(${w})"/>`)
    .join("");
  return `<svg viewBox="-16 -16 32 32" aria-hidden="true"><circle r="7" fill="${F.pv}"/>${strahlen}</svg>`;
}

export const stromReiterKarte = {
  /** Gewaehlte Darstellung, unbekannte Werte fallen auf den Sonnenverlauf zurueck. */
  _stromStil() {
    const s = this._config.power_style;
    return STILE.includes(s) ? s : "verlauf";
  },

  /** Entitaeten des Reiters. */
  _stromIds() {
    const q = this._hass;
    const sonne = this._config.demo ? "demo.sun" : q && q.states && q.states["sun.sun"] ? "sun.sun" : null;
    return { wp: this._e("power_now"), netz: this._e("grid_power"), pv: this._e("pv_power"), sonne };
  },

  /** Zeitraum der Analyse; Bogen und Balken brauchen dazu die letzten 7 Tage. */
  _stromFenster() {
    const sp = this._zrSpanne();
    const t0 = sp.tVerlauf;
    const ab = this._stromStil() === "verlauf" ? t0 : Math.min(t0, tagPlus(sp.t1, -6));
    return { k: sp.k, t0, t1: sp.t1, ab };
  },

  _stromSchluessel() {
    const ids = this._stromIds();
    return [this._zrSchluessel(), this._stromStil(), ids.wp, ids.netz, ids.pv, ids.sonne, this._config.demo ? "demo" : ""].join("|");
  },

  /** Berechnete Daten, wenn sie zum Zeitraum und zur Darstellung passen. */
  _stromDaten() {
    const c = this._stromCache;
    return c && c.schluessel === this._stromSchluessel() ? c.daten : null;
  },

  /** Holt den Verlauf hoechstens alle fuenf Minuten, wie die Analyse. */
  async _ladeStrom() {
    const schluessel = this._stromSchluessel();
    const jetzt = Date.now();
    const c = this._stromCache;
    if (c && c.schluessel === schluessel && (c.laedt || jetzt - c.zeit < FUENF_MINUTEN)) return;
    const ids = this._stromIds();
    const f = this._stromFenster();
    if (!ids.wp) {
      this._stromCache = { schluessel, zeit: jetzt, daten: null, fehlt: true };
      return;
    }
    if (this._config.demo) {
      this._stromCache = { schluessel, zeit: jetzt, daten: this._stromRechne(this._stromDemo(f), f) };
      return;
    }
    const q = this._hass;
    if (!q || typeof q.callWS !== "function") return;
    this._stromCache = { ...(c && c.schluessel === schluessel ? c : {}), schluessel, zeit: jetzt, laedt: true };
    let daten = null;
    try {
      const antwort = await q.callWS({
        type: "history/history_during_period",
        start_time: new Date(f.ab).toISOString(),
        end_time: new Date(f.t1).toISOString(),
        entity_ids: [ids.wp, ids.netz, ids.pv, ids.sonne].filter(Boolean),
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      });
      const st = q.states || {};
      const einheit = (id) => (st[id] && st[id].attributes ? st[id].attributes.unit_of_measurement : "");
      const watt = (id) => (id ? verlaufsReihe(antwort, id).map((p) => ({ t: p.t, v: inWatt(p.v, einheit(id)) })) : null);
      const sonne = ids.sonne
        ? verlaufsReihe(antwort, ids.sonne).map((p) => ({ t: p.t, oben: p.s === "above_horizon" ? true : p.s === "below_horizon" ? false : null }))
        : null;
      const s = st["sun.sun"];
      const untergang = s && s.attributes ? Date.parse(s.attributes.next_setting) : NaN;
      daten = this._stromRechne({ wp: watt(ids.wp), netz: watt(ids.netz), pv: watt(ids.pv), sonne, untergang }, f);
    } catch {
      daten = null;
    }
    // Inzwischen anderer Zeitraum oder andere Darstellung: Antwort verwerfen.
    if (!this._stromCache || this._stromCache.schluessel !== schluessel) return;
    this._stromCache = { schluessel, zeit: Date.now(), laedt: false, daten, fehler: !daten };
    if (this._diaArt === "analyse") this._zeichneAnalyse();
  },

  /**
   * Nachgebildete Daten fuer den Demomodus: Leistung wie die Laeufe der
   * Analyse, Sonne von 07:58 bis 16:04, PV bis 5,4 kW, je Tag anders
   * bewoelkt, Haus 400 W, abends deckt eine Batterie bis 18:20.
   */
  _stromDemo(f) {
    const a = this._auswertungDemo(f.ab - TAG, f.t1);
    const wp = summeReihen([a.heizE || [], a.wwE || []]);
    // Bewoelkung je Tag, der letzte Wert ist heute (Beispielwerte).
    const wolken = [0.55, 0.85, 0.35, 0.7, 0.2, 0.9, 1];
    const pv = [];
    const sonne = [];
    const batterie = [];
    let untergang = NaN;
    const heute = tagesbeginn(f.t1);
    for (let tag = tagesbeginn(f.ab); tag < f.t1; tag = tagPlus(tag, 1)) {
      const ta = tag + (7 * 60 + 58) * MINUTE;
      const tu = tag + (16 * 60 + 4) * MINUTE;
      const vor = Math.round((heute - tag) / TAG);
      const faktor = wolken[(((wolken.length - 1 - vor) % wolken.length) + wolken.length) % wolken.length];
      if (ta >= f.ab && ta < f.t1) sonne.push({ t: ta, oben: true });
      if (tu >= f.ab && tu < f.t1) sonne.push({ t: tu, oben: false });
      if (tu >= f.t1 && ta < f.t1) untergang = tu;
      for (let t = Math.ceil(Math.max(tag, f.ab) / FUENF_MINUTEN) * FUENF_MINUTEN; t < Math.min(tagPlus(tag, 1), f.t1); t += FUENF_MINUTEN) {
        const m = t + FUENF_MINUTEN / 2;
        let p = 0;
        if (m > ta && m < tu) {
          p = 5400 * faktor * Math.pow(Math.sin((Math.PI * (m - ta)) / (tu - ta)), 1.6);
          // Kurze Wolke am Nachmittag.
          if (m > tag + 13.15 * STUNDE && m < tag + 13.75 * STUNDE) p *= 0.55;
        }
        pv.push({ t, v: Math.round(p) });
      }
      // Nach sonnigen Tagen deckt die Batterie den Abend bis 18:20.
      if (faktor >= 0.5) batterie.push([tu, tag + (18 * 60 + 20) * MINUTE]);
    }
    // Zustand zu Beginn: oben, wenn als Erstes ein Untergang kommt.
    sonne.unshift({ t: f.ab, oben: sonne.length ? !sonne[0].oben : false });
    const zeiten = [...new Set([...wp.map((p) => p.t), ...pv.map((p) => p.t), ...batterie.flat()])].sort((x, y) => x - y);
    const netz = zeiten.map((t) => {
      const iw = indexBis(wp, t);
      const ip = indexBis(pv, t);
      const w = iw >= 0 ? wp[iw].v : 0;
      const p = ip >= 0 ? pv[ip].v : 0;
      const bat = batterie.some(([b0, b1]) => t >= b0 && t < b1) ? w + 400 : 0;
      return { t, v: Math.round(w + 400 - p - bat) };
    });
    return { wp, netz, pv, sonne, untergang };
  },

  /** Rechnet aus dem Verlauf alles, was Kacheln und Grafiken brauchen. */
  _stromRechne(roh, f) {
    const { t0, t1, ab } = f;
    if (!roh || !roh.wp || !roh.wp.length) return null;
    const r = { wp: roh.wp, netz: roh.netz && roh.netz.length ? roh.netz : null, pv: roh.pv && roh.pv.length ? roh.pv : null };
    const summe = stromSummen(r, [t0, t1])[0] || leer(t0, t1);
    const spanne = t1 - t0;

    // Sonnenverlauf: gleich breite Abschnitte ueber den Zeitraum.
    const breite = spanne <= 1.05 * TAG ? 5 * MINUTE : spanne <= 3.05 * TAG ? 15 * MINUTE : spanne <= 8 * TAG ? STUNDE : 3 * STUNDE;
    const n = Math.max(1, Math.round(spanne / breite));
    const verlauf = stromSummen(r, [...Array(n + 1)].map((_, i) => t0 + (i * spanne) / n));

    // Balken: ganze Stunden, bei bis zu 3 Tagen je 3 Stunden, sonst Tage.
    const art = spanne <= 1.05 * TAG ? "stunde" : spanne <= 3.05 * TAG ? "drei" : "tag";
    const grenzen = [t0];
    if (art === "tag") {
      for (let x = tagPlus(t0, 1); x < t1; x = tagPlus(x, 1)) grenzen.push(x);
    } else {
      const schritt = art === "drei" ? 3 : 1;
      const d = new Date(t0);
      let x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(d.getHours() / schritt) * schritt + schritt).getTime();
      while (x < t1) {
        grenzen.push(x);
        const y = new Date(x);
        x = new Date(y.getFullYear(), y.getMonth(), y.getDate(), y.getHours() + schritt).getTime();
      }
    }
    grenzen.push(t1);
    const balken = { art, bins: stromSummen(r, grenzen) };

    const licht = tageslicht(roh.sonne, roh.untergang);

    // Letzte 7 Tage, wenn der Verlauf so weit reicht.
    const heute = tagesbeginn(t1);
    const tag0 = tagPlus(heute, -6);
    let tage7 = null;
    let raster = null;
    if (ab <= tag0) {
      const tg = [...Array(7)].map((_, i) => tagPlus(tag0, i)).concat([t1]);
      tage7 = stromSummen(r, tg);
      const stunden = [tag0];
      for (let x = tag0; x < t1;) {
        const y = new Date(x);
        x = new Date(y.getFullYear(), y.getMonth(), y.getDate(), y.getHours() + 1).getTime();
        stunden.push(Math.min(x, t1));
      }
      const zellen = stromSummen(r, stunden);
      raster = tg.slice(0, 7).map((tag) => {
        const reihe = [...Array(24)].map(() => null);
        zellen
          .filter((z) => z.von >= tag && z.von < tagPlus(tag, 1))
          .forEach((z) => {
            const s = new Date(z.von).getHours();
            if (!reihe[s]) reihe[s] = leer(z.von, z.bis);
            ["wp", "eigen", "netz", "pv", "dWp", "dBeide", "dPv"].forEach((k) => {
              reihe[s][k] += z[k];
            });
            reihe[s].bis = z.bis;
          });
        return { tag, zellen: reihe };
      });
    }

    // Sonnenbogen: der letzte Tag, an dem die Sonne aufgegangen ist.
    let bogen = null;
    const l = [...licht].reverse().find((x) => !x.angeschnitten && x.auf <= t1 && x.auf >= ab && x.unter && x.unter > x.auf);
    if (l) {
      const tagA = tagesbeginn(l.auf);
      const tagE = Math.min(tagPlus(tagA, 1), t1);
      const bisJetzt = Math.min(l.unter, t1);
      const slots = [];
      for (let x = l.auf; x < bisJetzt; x += 10 * MINUTE) slots.push(x);
      slots.push(bisJetzt);
      const teile = slots.length > 1 ? stromSummen(r, slots) : [];
      const [nacht] = stromSummen(r, [tagA, l.auf]);
      const [tag] = stromSummen(r, [tagA, tagE]);
      const abend = l.unter < tagE ? stromSummen(r, [l.unter, tagE])[0] : null;
      bogen = { auf: l.auf, unter: l.unter, offen: l.unter > t1, tagA, tagE, heute: tagA === heute, teile, nacht, tag, abend };
    }
    return { t0, t1, ab, roh: r, mitNetz: Boolean(r.netz) && summe.dBeide > 0, mitPv: Boolean(r.pv) && summe.dPv > 0,
      mitSonne: Boolean(roh.sonne && roh.sonne.length), summe, verlauf, balken, licht, bogen, tage7, raster };
  },

  /**
   * SG Ready zwischen t0 und t1 aus der Analyse: Dauer je Stufe, Dauer und
   * Strom der Waermepumpe mit Stufe 3 oder 4 und deren Anteil. null ohne
   * beide Kontakte.
   */
  _stromSg(t0, t1) {
    const a = this._auswertung;
    if (!a || !a.sg || !a.sg.length) return null;
    const d = this._stromDaten();
    const merk = this._stromSgMerk;
    if (merk && merk.sg === a.sg && merk.d === d && merk.t0 === t0 && merk.t1 === t1) return merk.wert;
    const abschnitte = sgAbschnitte(a.sg, t0, t1);
    if (!abschnitte.length) return null;
    const dauer = { 1: 0, 2: 0, 3: 0, 4: 0 };
    abschnitte.forEach((x) => {
      dauer[x.stufe] = (dauer[x.stufe] || 0) + (x.bis - x.von);
    });
    const gesamt = abschnitte.reduce((s, x) => s + (x.bis - x.von), 0);
    const aktivMs = dauer[3] + dauer[4];
    let wpWh = null;
    let aktivWh = null;
    if (d && d.roh && d.roh.wp) {
      wpWh = 0;
      aktivWh = 0;
      abschnitte.forEach((x) => {
        const [s] = stromSummen(d.roh, [x.von, x.bis]);
        if (!s) return;
        wpWh += s.wp;
        if (x.stufe === 3 || x.stufe === 4) aktivWh += s.wp;
      });
    }
    const wert = {
      abschnitte, dauer, aktivMs, aktivWh,
      anteilWp: wpWh !== null && wpWh > 1 ? (100 * aktivWh) / wpWh : null,
      anteilZeit: gesamt > 0 ? (100 * aktivMs) / gesamt : null,
    };
    this._stromSgMerk = { sg: a.sg, d, t0, t1, wert };
    return wert;
  },

  /** Strompreis in ct/kWh aus der Integration, sonst null. */
  _stromPreis() {
    const p = [this._int("dhw_cost_per_day"), this._int("dhw_cost_last")]
      .map((w) => (w ? parseFloat(w.attr.preis_ct_kwh) : NaN))
      .find((x) => Number.isFinite(x) && x > 0);
    return p || null;
  },

  /** Grafik des Reiters in der gewaehlten Darstellung. */
  _stromGrafik() {
    const t = (k) => this._t(k);
    let c = this._stromCache;
    const hinweis = (k) => `<div class="lhc-an-box lhc-sp-box"><p class="lhc-sp-hinweis">${e(t(k))}</p></div>`;
    // Andere Darstellung oder anderer Zeitraum, etwa nach einer Aenderung im
    // Editor bei offenem Fenster: neu laden (zeichnet nach dem Laden neu).
    if (!c || c.schluessel !== this._stromSchluessel()) {
      this._ladeStrom();
      c = this._stromCache;
    }
    if (!c || c.schluessel !== this._stromSchluessel()) return this._stromIds().wp ? hinweis("sp_laedt") : hinweis("sp_fehlt_wp");
    if (c.fehlt) return hinweis("sp_fehlt_wp");
    const d = c.daten;
    if (!d) return hinweis(c.laedt ? "sp_laedt" : "sp_fehler");
    const stil = this._stromStil();
    const merk = this._stromHtmlMerk;
    const sg = this._auswertung && this._auswertung.sg;
    if (merk && merk.d === d && merk.sg === sg && merk.stil === stil && merk.sprache === this._sp()) return merk.html;
    let html = stil === "bogen" ? this._stromBogen(d) : stil === "balken" ? this._stromBalken(d) : this._stromVerlauf(d);
    if (!d.mitNetz) html += hinweis("sp_fehlt_netz");
    this._stromHtmlMerk = { d, sg, stil, sprache: this._sp(), html };
    return html;
  },

  /** Legende: [[Farbe, Text, Rahmen]]. */
  _stromLegende(eintraege) {
    return `<div class="lhc-sp-leg">${eintraege
      .map(([farbe, text, rahmen]) => `<span><i style="background:${farbe}${rahmen ? ";border:1px solid var(--c-33415a)" : ""}"></i>${e(text)}</span>`)
      .join("")}</div>`;
  },

  /** Fuenf Zeitmarken unter einer Grafik, die letzte heisst "jetzt". */
  _stromAchse(t0, t1) {
    let out = "";
    for (let i = 0; i <= 4; i++) {
      const text = i === 4 ? this._t("jetzt") : this._zrMarke(t0 + (i * (t1 - t0)) / 4, t1 - t0);
      out += `<span class="${i === 0 ? "a" : i === 4 ? "e" : ""}" style="left:${i * 25}%">${e(text)}</span>`;
    }
    return `<div class="lhc-sp-x">${out}</div>`;
  },

  /** Beschriftung der Hochachse. */
  _stromHochachse(sk, einheit) {
    let out = "";
    const stellen = Number.isInteger(sk.schritt) ? 0 : Number.isInteger(sk.schritt * 10) ? 1 : 2;
    for (let v = sk.schritt; v <= sk.oben + 1e-9; v += sk.schritt) {
      out += `<span style="top:${(100 - (v / sk.oben) * 100).toFixed(2)}%">${e(`${fmt(v, stellen)} ${einheit}`)}</span>`;
    }
    return `<div class="lhc-sp-y">${out}</div>`;
  },

  _stromGitter(sk) {
    let out = "";
    for (let v = sk.schritt; v <= sk.oben + 1e-9; v += sk.schritt) {
      const y = (100 - (v / sk.oben) * 100).toFixed(2);
      out += `<line class="lhc-sp-gl" x1="0" x2="1000" y1="${y}" y2="${y}"/>`;
    }
    return out;
  },

  /** Band mit den Stufen von SG Ready zwischen t0 und t1. */
  _stromSgBand(sg, t0, t1, name) {
    if (!sg) return "";
    const zuP = (t) => ((t - t0) / (t1 - t0)) * 100;
    const teile = sg.abschnitte
      .filter((a) => a.stufe !== 2)
      .map((a) => {
        const info = SG_STATES[a.stufe] || {};
        return `<i style="left:${zuP(a.von).toFixed(2)}%;width:${Math.max(0.3, zuP(a.bis) - zuP(a.von)).toFixed(2)}%;background:${info.farbe || "#7E8CA0"}"
          title="${e(`${this._t(info.lang || "unbekannt")} · ${dauerText(a.bis - a.von)}`)}"></i>`;
      })
      .join("");
    return `<span class="lhc-sp-sgname">${e(name)}</span><div class="lhc-sp-band">${teile}</div>`;
  },

  /** Legende der Stufen von SG Ready, die vorkamen. */
  _stromSgLegende(sg) {
    if (!sg) return [];
    return [3, 4, 1]
      .filter((s) => sg.dauer[s] > 0)
      .map((s) => [SG_STATES[s].farbe, tf(this._t("sp_l_sg"), { z: this._t(SG_STATES[s].lang) })]);
  },

  /** Text fuer einen Abschnitt beim Darueberfahren. */
  _stromTitel(b, zeit) {
    const z = (wh) => fmt(wh / 1000, wh < 10000 ? 2 : 1);
    const teile = [zeit];
    if (b.dPv) teile.push(tf(this._t("sp_tip_pv"), { k: z(b.pv) }));
    if (b.dWp) teile.push(tf(this._t("sp_tip_wp"), { k: z(b.wp) }));
    if (b.dBeide && b.eigen + b.netz > 1) teile.push(tf(this._t("sp_tip_eigen"), { p: fmt((100 * b.eigen) / (b.eigen + b.netz), 0) }));
    return teile.join(" · ");
  },

  /** Zeitangabe eines Abschnitts der Balken. */
  _stromZeit(b, art) {
    const d = new Date(b.von);
    let tagName = "";
    try {
      tagName = d.toLocaleDateString(this._sp(), { weekday: "short" });
    } catch {
      tagName = "";
    }
    if (art === "tag") return `${tagName} ${this._zrDatum(b.von, false)}`.trim();
    const zeit = tf(this._t("sp_zeit_bis"), { a: uhr(b.von), b: uhr(b.bis) });
    return art === "drei" ? `${tagName} ${zeit}`.trim() : zeit;
  },

  /* ---------- A: Sonnenverlauf ---------- */
  _stromVerlauf(d) {
    const t = (k) => this._t(k);
    const { t0, t1 } = d;
    const x = (zeit) => (((zeit - t0) / (t1 - t0)) * 1000).toFixed(1);
    const kwVon = (wh, ms) => (ms > 0 ? wh / (ms / STUNDE) / 1000 : 0);
    const bins = d.verlauf.map((b) => {
      const eigen = d.mitNetz ? kwVon(b.eigen, b.dBeide) : 0;
      const netz = d.mitNetz ? kwVon(b.netz, b.dBeide) : 0;
      return { von: b.von, bis: b.bis, pv: d.mitPv ? kwVon(b.pv, b.dPv) : 0, wp: kwVon(b.wp, b.dWp), eigen, netz };
    });
    const max = Math.max(0.1, ...bins.map((b) => Math.max(b.pv, d.mitNetz ? b.eigen + b.netz : b.wp)));
    const sk = skala(max);
    const y = (v) => (100 - (v / sk.oben) * 100).toFixed(2);
    // Stufenflaeche zwischen unten und oben je Abschnitt.
    const flaeche = (oben, unten) => {
      let p = `M${x(t0)} ${y(unten(bins[0]))}`;
      bins.forEach((b) => {
        p += `L${x(b.von)} ${y(oben(b))}L${x(b.bis)} ${y(oben(b))}`;
      });
      for (let i = bins.length - 1; i >= 0; i--) p += `L${x(bins[i].bis)} ${y(unten(bins[i]))}L${x(bins[i].von)} ${y(unten(bins[i]))}`;
      return `${p}Z`;
    };
    let nacht = "";
    if (d.mitSonne) {
      // Nacht: alles im Zeitraum ausserhalb des Tageslichts.
      let von = t0;
      d.licht
        .filter((l) => (l.unter === null || l.unter > t0) && l.auf < t1)
        .forEach((l) => {
          if (l.auf > von) nacht += `<rect class="lhc-sp-nacht" x="${x(von)}" y="0" width="${(x(l.auf) - x(von)).toFixed(1)}" height="100"/>`;
          von = Math.max(von, l.unter === null ? t1 : l.unter);
        });
      if (von < t1) nacht += `<rect class="lhc-sp-nacht" x="${x(von)}" y="0" width="${(x(t1) - x(von)).toFixed(1)}" height="100"/>`;
    }
    let pv = "";
    if (d.mitPv) {
      const punkte = bins.map((b) => `${x((b.von + b.bis) / 2)} ${y(b.pv)}`);
      pv = `<path class="lhc-sp-pvf" d="M${x(t0)} 100L${punkte.join("L")}L${x(t1)} 100Z"/>
        <path class="lhc-sp-pvl" d="M${punkte.join("L")}"/>`;
    }
    const wp = d.mitNetz
      ? `<path class="lhc-sp-eigen" d="${flaeche((b) => b.eigen, () => 0)}"/><path class="lhc-sp-netz" d="${flaeche((b) => b.eigen + b.netz, (b) => b.eigen)}"/>`
      : `<path class="lhc-sp-netz" d="${flaeche((b) => b.wp, () => 0)}"/>`;
    // Sonne ueber dem hoechsten PV-Wert, Auf- und Untergang nur bei einem Tag.
    let oben = "";
    if (d.mitPv) {
      const spitze = bins.reduce((a, b) => (b.pv > a.pv ? b : a), bins[0]);
      if (spitze.pv > 0.05) {
        oben += `<span class="lhc-sp-sonne" style="left:clamp(15px, ${(x((spitze.von + spitze.bis) / 2) / 10).toFixed(2)}%, calc(100% - 15px));top:${y(spitze.pv)}%">${sonnenBild()}</span>`;
      }
    }
    if (d.mitSonne && t1 - t0 <= 1.05 * TAG) {
      const marke = (zeit, k) => {
        const p = (zeit - t0) / (t1 - t0);
        if (p < 0 || p > 1) return "";
        return `<span class="lhc-sp-zeit${p < 0.08 ? " a" : p > 0.92 ? " e" : ""}" style="left:${(p * 100).toFixed(2)}%">${e(tf(t(k), { z: uhr(zeit) }))}</span>`;
      };
      d.licht.forEach((l) => {
        if (!l.angeschnitten) oben += marke(l.auf, "sp_aufgang");
        if (l.unter !== null) oben += marke(l.unter, "sp_untergang");
      });
    }
    // Felder zum Darueberfahren je Stunde (bzw. 3 Stunden oder Tag).
    const treffer = d.balken.bins
      .map((b) => `<i class="lhc-sp-hit" style="left:${(x(b.von) / 10).toFixed(2)}%;width:${((x(b.bis) - x(b.von)) / 10).toFixed(2)}%"
        title="${e(this._stromTitel(b, this._stromZeit(b, d.balken.art)))}"></i>`)
      .join("");
    const sg = this._stromSg(t0, t1);
    const legende = [];
    if (d.mitPv) legende.push(["rgba(251,191,36,0.55)", t("sp_l_pv")]);
    if (d.mitNetz) legende.push([F.eigen, t("sp_l_eigen")], [NETZ_CSS, t("sp_l_netz")]);
    else legende.push([NETZ_CSS, t("sp_l_wp")]);
    legende.push(...this._stromSgLegende(sg));
    if (d.mitSonne) legende.push(["rgba(0,0,0,0.45)", t("sp_l_nacht"), true]);
    return `<div class="lhc-an-box lhc-sp-box"><b class="lhc-an-boxkopf">${e(t("sp_a_titel"))}</b>
      <div class="lhc-sp-a">${this._stromHochachse(sk, "kW")}
        <div class="lhc-sp-flaeche"><svg class="lhc-sp-svg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">${nacht}${this._stromGitter(sk)}${pv}${wp}
          <line class="lhc-sp-null" x1="0" x2="1000" y1="100" y2="100"/></svg>${treffer}${oben}</div>
        <span></span>${this._stromAchse(t0, t1)}
        ${this._stromSgBand(sg, t0, t1, t("sp_sg"))}</div>
      ${this._stromLegende(legende)}</div>`;
  },

  /* ---------- B: Sonnenbogen ---------- */
  _stromBogen(d) {
    const t = (k) => this._t(k);
    const b = d.bogen;
    const teile = [];
    if (!b) {
      teile.push(`<div class="lhc-an-box lhc-sp-box lhc-sp-breit"><b class="lhc-an-boxkopf">${e(t("sp_b_titel_heute"))}</b>
        <p class="lhc-sp-hinweis">${e(t(d.mitSonne ? "sp_b_ohne_tag" : "sp_fehlt_sonne"))}</p></div>`);
    } else {
      const CX = 200;
      const CY = 192;
      const R = 168;
      const winkel = (zeit) => Math.PI * (1 - (zeit - b.auf) / (b.unter - b.auf));
      const pkt = (zeit) => [CX + R * Math.cos(winkel(zeit)), CY - R * Math.sin(winkel(zeit))];
      const bogen = (von, bis, klasse, breite) => {
        const [x1, y1] = pkt(von);
        const [x2, y2] = pkt(bis);
        return `<path class="${klasse}" d="M${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${breite}"/>`;
      };
      // Gleiche Abschnitte hintereinander zusammenfassen.
      const stuecke = [];
      b.teile.forEach((s) => {
        const ms = s.bis - s.von;
        const laeuft = s.dWp > 0 && s.wp / (s.dWp / STUNDE) >= LAEUFT_W;
        const art = !laeuft ? "" : d.mitNetz && s.dBeide ? (s.eigen >= s.netz ? "lhc-sp-be" : "lhc-sp-bn") : "lhc-sp-bn";
        const letztes = stuecke[stuecke.length - 1];
        if (art && letztes && letztes.art === art && letztes.bis === s.von) letztes.bis = s.bis;
        else if (art && ms > 0) stuecke.push({ art, von: s.von, bis: s.bis });
      });
      const jetzt = d.t1;
      const sonne = jetzt >= b.auf && jetzt <= b.unter
        ? (() => {
          const [sx, sy] = pkt(jetzt);
          return `<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><circle r="12" fill="${F.pv}"/>${[0, 45, 90, 135, 180, 225, 270, 315]
            .map((w) => `<line x1="0" y1="-16" x2="0" y2="-21" stroke="${F.pv}" stroke-width="2.6" stroke-linecap="round" transform="rotate(${w})"/>`).join("")}</g>`;
        })()
        : "";
      const tag = b.tag;
      const gesamt = (tag.eigen + tag.netz) / 1000;
      const anteil = d.mitNetz && gesamt > 0 ? (100 * tag.eigen) / 1000 / gesamt : null;
      const kachel = (titel, s, offen) => {
        const g = s ? (s.eigen + s.netz) / 1000 : 0;
        const wert = offen || !s ? "--" : `${fmt(d.mitNetz ? g : s.wp / 1000, 1)} kWh`;
        const unter = offen ? t("sp_b_offen") : s && d.mitNetz && g > 0.01 ? tf(t("sp_b_anteil"), { p: fmt((100 * s.eigen) / 1000 / g, 0) }) : "";
        return `<div class="lhc-an-kachel"><span>${e(titel)}</span><b>${e(wert)}</b>${unter ? `<small>${e(unter)}</small>` : ""}</div>`;
      };
      const legende = d.mitNetz ? [[F.eigen, t("sp_l_lief_eigen")], [NETZ_CSS, t("sp_l_lief_netz")]] : [[NETZ_CSS, t("sp_l_lief")]];
      legende.push(["var(--c-1c2533)", t("sp_l_aus"), true]);
      teile.push(`<div class="lhc-an-box lhc-sp-box lhc-sp-breit"><b class="lhc-an-boxkopf">${e(t(b.heute ? "sp_b_titel_heute" : "sp_b_titel_gestern"))}</b>
        <div class="lhc-sp-bogen"><svg viewBox="0 0 400 214" aria-hidden="true">
            <line x1="6" x2="394" y1="${CY}" y2="${CY}" stroke="#46536A" stroke-width="2"/>
            ${bogen(b.auf, b.unter, "lhc-sp-bh", 30)}${stuecke.map((s) => bogen(s.von, s.bis + 1000, s.art, 24)).join("")}${sonne}</svg>
          <div class="lhc-sp-mitte">${anteil !== null
    ? `<b>${e(fmt(anteil, 0))} %</b><span>${e(t(b.heute ? "sp_b_eigen_heute" : "sp_b_eigen_gestern"))}</span><small>${e(tf(t("sp_b_von"), { e: fmt(tag.eigen / 1000, 1), g: fmt(gesamt, 1) }))}</small>`
    : `<b class="grau">${e(fmt(tag.wp / 1000, 1))} kWh</b><span>${e(t(b.heute ? "sp_b_wp_heute" : "sp_b_wp_gestern"))}</span>`}</div></div>
        <div class="lhc-sp-zeiten"><span>${e(tf(t("sp_aufgang"), { z: uhr(b.auf) }))}</span><span>${e(tf(t("sp_untergang"), { z: uhr(b.unter) }))}</span></div>
        <div class="lhc-sp-zwei">${kachel(tf(t("sp_b_nacht"), { z: uhr(b.auf) }), b.nacht, false)}${kachel(tf(t("sp_b_abend"), { z: uhr(b.unter) }), b.abend, b.offen)}</div>
        ${this._stromLegende(legende)}</div>`);
    }
    // Rechts: SG Ready des Tages und die letzten 7 Tage.
    const rechts = [this._stromSgRing(d), this._stromSieben(d)].filter(Boolean).join("");
    return `<div class="lhc-sp-reihe">${teile.join("")}${rechts ? `<div class="lhc-sp-spalte">${rechts}</div>` : ""}</div>`;
  },

  /** SG Ready des Bogentages als Ring. */
  _stromSgRing(d) {
    const t = (k) => this._t(k);
    const b = d.bogen;
    const von = b ? b.tagA : tagesbeginn(d.t1);
    const bis = b ? b.tagE : d.t1;
    const heute = !b || b.heute;
    const kopf = `<b class="lhc-an-boxkopf">${e(t(heute ? "sp_sg_titel_heute" : "sp_sg_titel_gestern"))}</b>`;
    const sg = this._stromSg(von, bis);
    if (!sg) {
      const an = typeof this._intZahl === "function" ? this._intZahl("top149") : null;
      const zusatz = an === null ? "" : ` ${t(an > 0 ? "sp_sg_top_an" : "sp_sg_top_aus")}`;
      return `<div class="lhc-an-box lhc-sp-box">${kopf}<p class="lhc-sp-hinweis">${e(t("sp_sg_ohne") + zusatz)}</p></div>`;
    }
    const mitWp = sg.anteilWp !== null;
    const anteil = mitWp ? sg.anteilWp : sg.anteilZeit;
    const RR = 46;
    const U = 2 * Math.PI * RR;
    const farbe = SG_STATES[3].farbe;
    const ring = `<svg class="lhc-sp-ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="${RR}" fill="none" stroke="#26303F" stroke-width="13"/>
      ${anteil > 0 ? `<circle cx="60" cy="60" r="${RR}" fill="none" stroke="${farbe}" stroke-width="13" stroke-linecap="round"
        stroke-dasharray="${((Math.min(100, anteil) / 100) * U).toFixed(1)} ${U.toFixed(1)}" transform="rotate(-90 60 60)"/>` : ""}
      <text x="60" y="61" text-anchor="middle" font-size="22" font-weight="700" fill="${farbe}">${e(fmt(anteil, 0))} %</text>
      <text x="60" y="78" text-anchor="middle" font-size="9.5" fill="#98A6BA">${e(t(mitWp ? "sp_sg_wp" : "sp_sg_zeit"))}</text></svg>`;
    const zeile = !sg.aktivMs
      ? t(heute ? "sp_sg_nie_heute" : "sp_sg_nie_gestern")
      : mitWp
        ? tf(t("sp_sg_aktiv_kwh"), { d: dauerText(sg.aktivMs), k: fmt(sg.aktivWh / 1000, 1) })
        : tf(t("sp_sg_aktiv"), { d: dauerText(sg.aktivMs) });
    const stufen = [3, 4, 1]
      .filter((s) => sg.dauer[s] > 0)
      .map((s) => `<span><i style="background:${SG_STATES[s].farbe}"></i>${e(`${t(SG_STATES[s].lang)} ${dauerText(sg.dauer[s])}`)}</span>`)
      .join("");
    return `<div class="lhc-an-box lhc-sp-box lhc-sp-sgbox">${kopf}${ring}<div class="lhc-sp-sgzeile">${e(zeile)}</div>
      ${stufen ? `<div class="lhc-sp-leg mitte">${stufen}</div>` : ""}</div>`;
  },

  /** Die letzten 7 Tage als Saeulen: Strom der Waermepumpe, gruen der eigene Teil. */
  _stromSieben(d) {
    const t = (k) => this._t(k);
    if (!d.tage7) return "";
    const max = Math.max(0.1, ...d.tage7.map((x) => (d.mitNetz ? x.eigen + x.netz : x.wp) / 1000));
    const heute = tagesbeginn(d.t1);
    const saeulen = d.tage7
      .map((x) => {
        const g = (d.mitNetz ? x.eigen + x.netz : x.wp) / 1000;
        const name = x.von === heute ? t("sp_heute") : (() => {
          try {
            return new Date(x.von).toLocaleDateString(this._sp(), { weekday: "short" });
          } catch {
            return this._zrDatum(x.von, false);
          }
        })();
        if (!x.dWp) {
          return `<div class="lhc-sp-tag"><div class="lhc-sp-platz"><i class="lhc-sp-prozent" style="bottom:0">--</i></div><b>${e(name)}</b></div>`;
        }
        const h = (g / max) * 100;
        const anteil = d.mitNetz && g > 0.01 ? (100 * x.eigen) / 1000 / g : null;
        const titel = `${this._zrDatum(x.von, false)}: ${fmt(g, 1)} kWh${anteil !== null ? `, ${tf(t("sp_tip_eigen"), { p: fmt(anteil, 0) })}` : ""}`;
        return `<div class="lhc-sp-tag${x.von === heute ? " heute" : ""}" title="${e(titel)}"><div class="lhc-sp-platz">
            <div class="lhc-sp-saeule" style="height:${h.toFixed(1)}%">${anteil !== null
    ? `<span class="n" style="height:${(100 - anteil).toFixed(1)}%"></span><span class="g" style="height:${anteil.toFixed(1)}%"></span>`
    : `<span class="n" style="height:100%"></span>`}</div>
            <i class="lhc-sp-prozent${anteil !== null && anteil >= 30 ? " gut" : ""}" style="bottom:calc(${h.toFixed(1)}% + 3px)">${anteil !== null ? `${e(fmt(anteil, 0))} %` : ""}</i></div>
          <b>${e(name)}</b></div>`;
      })
      .join("");
    const legende = d.mitNetz ? [[F.eigen, t("sp_l_eigen_kurz")], [NETZ_CSS, t("sp_l_netz_kurz")]] : [[NETZ_CSS, t("sp_l_wp")]];
    return `<div class="lhc-an-box lhc-sp-box"><b class="lhc-an-boxkopf">${e(t("sp_7_titel"))}</b><div class="lhc-sp-tage">${saeulen}</div>
      ${this._stromLegende(legende)}${d.mitNetz ? `<div class="lhc-sp-fuss">${e(t("sp_7_zahl"))}</div>` : ""}</div>`;
  },

  /* ---------- C: Stundenbalken ---------- */
  _stromBalken(d) {
    const t = (k) => this._t(k);
    const { t0, t1 } = d;
    const bins = d.balken.bins;
    const x = (zeit) => ((zeit - t0) / (t1 - t0)) * 1000;
    const max = Math.max(0.05, ...bins.map((b) => Math.max(d.mitPv ? b.pv / 1000 : 0, (d.mitNetz ? b.eigen + b.netz : b.wp) / 1000)));
    const sk = skala(max);
    const y = (kwh) => 100 - (kwh / sk.oben) * 100;
    // Angebrochen: Rand des Zeitraums oder die laufende Stunde. Blass, ohne PV-Punkt.
    const teil = (b) => {
      if (d.balken.art === "tag") return b.von !== tagesbeginn(b.von) || b.bis !== tagPlus(b.von, 1);
      return b.bis - b.von < (d.balken.art === "drei" ? 3 : 1) * STUNDE - 1000;
    };
    let saeulen = "";
    const pvPunkte = [];
    bins.forEach((b) => {
      const blass = teil(b) ? " teil" : "";
      const breite = x(b.bis) - x(b.von);
      const luecke = Math.min(breite * 0.14, 6);
      const x0 = (x(b.von) + luecke).toFixed(1);
      const w = Math.max(0.5, breite - 2 * luecke).toFixed(1);
      if (d.mitNetz) {
        const ge = b.eigen / 1000;
        const gn = b.netz / 1000;
        if (ge > 0) saeulen += `<rect class="lhc-sp-eigen${blass}" x="${x0}" y="${y(ge).toFixed(2)}" width="${w}" height="${(100 - y(ge)).toFixed(2)}"/>`;
        if (gn > 0) saeulen += `<rect class="lhc-sp-netz${blass}" x="${x0}" y="${y(ge + gn).toFixed(2)}" width="${w}" height="${(y(ge) - y(ge + gn)).toFixed(2)}"/>`;
      } else if (b.wp > 0) {
        saeulen += `<rect class="lhc-sp-netz${blass}" x="${x0}" y="${y(b.wp / 1000).toFixed(2)}" width="${w}" height="${(100 - y(b.wp / 1000)).toFixed(2)}"/>`;
      }
      if (d.mitPv && b.dPv && !blass) pvPunkte.push({ x: x((b.von + b.bis) / 2), v: b.pv / 1000 });
    });
    // PV-Linie nur, wo die Sonne Strom brachte, mit je einem Nachbarn am Rand.
    let pv = "";
    let oben = "";
    if (pvPunkte.length) {
      const zeigen = pvPunkte.map((p, i) => p.v > 0.02 || (pvPunkte[i - 1] && pvPunkte[i - 1].v > 0.02) || (pvPunkte[i + 1] && pvPunkte[i + 1].v > 0.02));
      let pfad = "";
      pvPunkte.forEach((p, i) => {
        if (!zeigen[i]) return;
        pfad += `${pfad && zeigen[i - 1] ? "L" : "M"}${p.x.toFixed(1)} ${y(p.v).toFixed(2)}`;
      });
      if (pfad) pv = `<path class="lhc-sp-pvl dick" d="${pfad}"/>`;
      const spitze = pvPunkte.reduce((a, p) => (p.v > a.v ? p : a), pvPunkte[0]);
      if (spitze.v > 0.02) oben = `<span class="lhc-sp-sonne" style="left:clamp(15px, ${(spitze.x / 10).toFixed(2)}%, calc(100% - 15px));top:${y(spitze.v).toFixed(2)}%">${sonnenBild()}</span>`;
    }
    const treffer = bins
      .map((b) => `<i class="lhc-sp-hit" style="left:${(x(b.von) / 10).toFixed(2)}%;width:${((x(b.bis) - x(b.von)) / 10).toFixed(2)}%"
        title="${e(this._stromTitel(b, this._stromZeit(b, d.balken.art)))}"></i>`)
      .join("");
    // Achse: bei Stunden jede dritte volle Stunde, sonst hoechstens acht Marken.
    const jede = d.balken.art === "stunde" ? 3 : Math.max(1, Math.ceil(bins.length / 8));
    const marken = bins
      .map((b, i) => {
        const dt = new Date(b.von);
        const voll = d.balken.art === "stunde" ? dt.getMinutes() === 0 && dt.getHours() % 3 === 0 : i % jede === 0 && (i > 0 || bins.length < 3);
        if (!voll) return "";
        const mitte = ((x(b.von) + x(b.bis)) / 2 / 10).toFixed(2);
        let text;
        if (d.balken.art === "stunde") text = `${zwei(dt.getHours())}:00`;
        else {
          let wt = "";
          try {
            wt = dt.toLocaleDateString(this._sp(), { weekday: "short" });
          } catch {
            wt = "";
          }
          text = d.balken.art === "drei" ? `${wt} ${zwei(dt.getHours())}`.trim() : bins.length <= 8 ? wt || this._zrDatum(b.von, false) : this._zrDatum(b.von, false);
        }
        return `<span style="left:${mitte}%">${e(text)}</span>`;
      })
      .join("");
    // SG Ready: Marke unter jedem Abschnitt mit Stufe 3 oder 4.
    const sg = this._stromSg(t0, t1);
    let sgZeile = "";
    if (sg) {
      const marken3 = bins
        .map((b) => {
          const teile = sg.abschnitte.filter((a) => (a.stufe === 3 || a.stufe === 4) && a.bis > b.von && a.von < b.bis);
          if (!teile.length) return "";
          const ms = teile.reduce((s, a) => s + Math.min(a.bis, b.bis) - Math.max(a.von, b.von), 0);
          const stufe = teile.some((a) => a.stufe === 4) ? 4 : 3;
          const breite = x(b.bis) - x(b.von);
          const luecke = Math.min(breite * 0.14, 6);
          return `<i style="left:${((x(b.von) + luecke) / 10).toFixed(2)}%;width:${(Math.max(0.5, breite - 2 * luecke) / 10).toFixed(2)}%;background:${SG_STATES[stufe].farbe}"
            title="${e(`${this._stromZeit(b, d.balken.art)} · ${t(SG_STATES[stufe].lang)} ${dauerText(ms)}`)}"></i>`;
        })
        .join("");
      sgZeile = `<span class="lhc-sp-sgname">${e(t("sp_sg"))}</span><div class="lhc-sp-marken">${marken3}</div>`;
    }
    const legende = d.mitNetz ? [[F.eigen, t("sp_l_eigen_kurz")], [NETZ_CSS, t("sp_l_netzstrom")]] : [[NETZ_CSS, t("sp_l_wp")]];
    if (d.mitPv) legende.push([F.pv, t(`sp_l_pv_${d.balken.art}`)]);
    if (sg && (sg.dauer[3] || sg.dauer[4])) legende.push([SG_STATES[3].farbe, t("sp_l_sg_aktiv")]);
    if (bins.some(teil)) legende.push(["rgba(34, 197, 94, 0.4)", t("sp_l_teil")]);
    const kasten1 = `<div class="lhc-an-box lhc-sp-box"><b class="lhc-an-boxkopf">${e(t(`sp_c_titel_${d.balken.art}`))}</b>
      <div class="lhc-sp-a">${this._stromHochachse(sk, "kWh")}
        <div class="lhc-sp-flaeche"><svg class="lhc-sp-svg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">${this._stromGitter(sk)}${saeulen}${pv}
          <line class="lhc-sp-null" x1="0" x2="1000" y1="100" y2="100"/></svg>${treffer}${oben}</div>
        <span></span><div class="lhc-sp-x mitte">${marken}</div>${sgZeile}</div>
      ${this._stromLegende(legende)}</div>`;
    return kasten1 + this._stromRaster(d);
  },

  /** Raster der letzten 7 Tage: je Stunde der Anteil eigener Strom. */
  _stromRaster(d) {
    const t = (k) => this._t(k);
    if (!d.raster || !d.mitNetz) return "";
    const heute = tagesbeginn(d.t1);
    let zeilen = "";
    d.raster.forEach((r) => {
      let name;
      try {
        name = r.tag === heute ? t("sp_heute") : new Date(r.tag).toLocaleDateString(this._sp(), { weekday: "short" });
      } catch {
        name = this._zrDatum(r.tag, false);
      }
      zeilen += `<b class="${r.tag === heute ? "heute" : ""}">${e(name)}</b>`;
      r.zellen.forEach((z, s) => {
        if (!z || !z.dWp) {
          zeilen += `<i class="leer"></i>`;
          return;
        }
        const laeuft = z.wp / (z.dWp / STUNDE) >= LAEUFT_W;
        const zeit = `${this._zrDatum(r.tag, false)} ${zwei(s)}:00`;
        if (!laeuft || !z.dBeide) {
          zeilen += `<i class="aus" title="${e(`${zeit} · ${t("sp_l_aus")}`)}"></i>`;
          return;
        }
        const anteil = z.eigen / (z.eigen + z.netz || 1);
        zeilen += `<i style="background:${mische(anteil)}" title="${e(`${zeit} · ${fmt(z.wp / 1000, 2)} kWh · ${tf(t("sp_tip_eigen"), { p: fmt(anteil * 100, 0) })}`)}"></i>`;
      });
    });
    const fuss = `<span></span>${[0, 6, 12, 18].map((s) => `<span class="lhc-sp-rx">${zwei(s)}:00</span>`).join("")}`;
    return `<div class="lhc-an-box lhc-sp-box"><b class="lhc-an-boxkopf">${e(t("sp_r_titel"))}</b>
      <div class="lhc-sp-raster">${zeilen}${fuss}</div>
      ${this._stromLegende([[F.eigen, t("sp_l_ganz_eigen")], [`linear-gradient(90deg, ${F.netz}, ${F.eigen})`, t("sp_l_gemischt")], [NETZ_CSS, t("sp_l_ganz_netz")], ["transparent", t("sp_l_aus"), true]])}</div>`;
  },
};
