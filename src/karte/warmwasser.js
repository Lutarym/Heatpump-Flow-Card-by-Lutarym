/**
 * Warmwasser beobachten: Ladungen, Aussentemperatur und Haltezeit des
 * Speichers aus dem Verlauf von Home Assistant.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Grundsatz: Es wird nur gezeigt und verglichen, was gemessen ist.
 *  - Eine Ladung ist ein zusammenhaengender Verdichterlauf (TOP8 ueber 0),
 *    waehrend das Umschaltventil (TOP20) auf Warmwasser steht. Bleibt das
 *    Ventil nach der Ladung auf Warmwasser (etwa im Betrieb nur
 *    Warmwasser), endet die Ladung trotzdem mit dem Verdichter.
 *  - Strom und Waerme je Ladung sind das Zeitintegral von TOP41 und TOP40,
 *    bei Geraeten mit Zusatzblock XTOP2 und XTOP5 (HeishaMon, MQTT-Topics).
 *    Ohne diese Werte zaehlt der COP Warmwasser der Integration.
 *  - Vergleich nach Aussentemperatur nur zwischen eigenen Ladungen, je
 *    Bereich von 2 K mit mindestens 3 Ladungen (eigene Festlegung).
 *  - Haltezeit: Zeit vom Ladeende bis zur naechsten Ladung und bis der
 *    Speicher (TOP10) unter die im Editor eingestellte Schwelle faellt.
 *    Zapfen und Waermeverlust lassen sich ohne Durchflussmesser am
 *    Warmwasser nicht trennen; darum zaehlt als Abfall in der Nacht nur
 *    00:00 bis 05:00 ohne Ladung (eigene Festlegung).
 *  - SG Ready (sgstufen.js): Ladungen, waehrend denen Stufe 3 oder 4
 *    anlag, zaehlen in keiner Auswertung. Ebenso Haltezeiten nach oder vor
 *    einer solchen Ladung.
 *  - Tag oder Nacht (wwUrteil): gewichtete Regression des Stroms je kWh
 *    Waerme gegen Aussentemperatur und Speichertemperatur beim Start
 *    (statistik.js). Linear, weil der Kehrwert der Carnot-Leistungszahl
 *    Tc / (Tc - To) bei gleichem Guetegrad linear mit To faellt
 *    (Formel: haustechnikdialog.de, SHKwissen "Temperaturhub", Stand
 *    06.11.2026). Ersparnis nur mit 95 %-Bereich; Mindestzahl und die
 *    Grenze "kaum" sind eigene Festlegungen.
 */
import { escapeHtml, fmt, indexBis, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { energie, mittel, ventilAbschnitte } from "./auswertung.js";
import { datenblattSchaetzung, TOLERANZ } from "./datenblatt.js";
import { sgReihe, sgVerstaerkt } from "./sgstufen.js";
import { tQuantil, wls } from "./statistik.js";

const STUNDE = 3600000;
const TAG = 24 * STUNDE;
/** Mindestzahl Ladungen je Temperaturbereich fuer einen Mittelwert. */
export const WW_MIN_N = 3;
/** Breite eines Temperaturbereichs in K. */
const BEREICH = 2;
/** Nachtfenster ohne Ladung fuer den Abfall, Stunden ab Mitternacht. */
const NACHT = [0, 5];

/** Wert einer Reihe zu einem Zeitpunkt (letzter Stand davor). */
function stand(reihe, t) {
  const i = indexBis(reihe || [], t);
  return i >= 0 ? reihe[i].v : null;
}

/** Summe der Zeit in ms, in der eine Reihe "an" meldet. */
function dauerAn(reihe, von, bis) {
  if (!reihe || !reihe.length) return null;
  let summe = 0;
  for (let i = Math.max(0, indexBis(reihe, von)); i < reihe.length && reihe[i].t < bis; i++) {
    const a = Math.max(reihe[i].t, von);
    const b = Math.min(i + 1 < reihe.length ? reihe[i + 1].t : bis, bis);
    if (b > a && zustandAn(reihe[i].s) === true) summe += b - a;
  }
  return summe;
}

/** Zeitintegral einer Leistung in W ueber den Zeitraum, Ergebnis in kWh. */
const kwh = (reihe, von, bis) => energie(reihe, von, bis);

/** Laeuft der Verdichter laut Eintrag (Zahl ueber 0 oder Zustand an)? */
function verdichterAn(p) {
  const n = parseFloat(p.s);
  if (!Number.isNaN(n)) return n > 0;
  return zustandAn(p.s) === true;
}

/** Zusammenhaengende Verdichterlaeufe innerhalb des Zeitraums. */
function verdichterLaeufe(vd, von, bis) {
  const out = [];
  if (!vd || !vd.length) return out;
  let start = null;
  for (let i = Math.max(0, indexBis(vd, von)); i < vd.length && vd[i].t < bis; i++) {
    const t = Math.max(vd[i].t, von);
    const an = verdichterAn(vd[i]);
    if (an && start === null) start = t;
    else if (!an && start !== null) {
      if (t > start) out.push({ von: start, bis: t });
      start = null;
    }
  }
  if (start !== null && bis > start) out.push({ von: start, bis });
  return out;
}

/** Hoechster Wert im Zeitraum mit Zeitpunkt, samt Stand zu Beginn. */
function hoechster(reihe, von, bis) {
  let best = null;
  const s = indexBis(reihe || [], von);
  for (let i = Math.max(0, s); reihe && i < reihe.length && reihe[i].t <= bis; i++) {
    const v = reihe[i].v;
    if (Number.isNaN(v)) continue;
    const t = Math.max(reihe[i].t, von);
    if (!best || v > best.v) best = { v, t };
  }
  return best;
}

/** Beginn des Kalendertags in Ortszeit. */
function tagBeginn(t) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function tagEnde(t) {
  const d = new Date(tagBeginn(t));
  d.setDate(d.getDate() + 1);
  return d.getTime();
}

/** Zerlegt den Verlauf in Ladungen mit allen Messwerten. */
export function wwLadungen(d, ref) {
  // Je Ventilabschnitt Warmwasser die Verdichterlaeufe darin.
  const abschnitte = ventilAbschnitte(d.ventil, d.t0, d.t1)
    .filter((x) => x.ww)
    .flatMap((x) => verdichterLaeufe(d.vd, x.von, x.bis));
  const out = [];
  abschnitte.forEach((a) => {
    const l = { von: a.von, bis: a.bis };
    l.angeschnitten = a.von <= d.t0 + 1000;
    l.laufend = a.bis >= d.t1 - 1000;
    l.minuten = (a.bis - a.von) / 60000;
    l.tStart = stand(d.temp, a.von);
    const max = hoechster(d.temp, a.von, a.bis);
    l.tEnde = max ? max.v : null;
    l.aussen = mittel(d.aussen, a.von, a.bis, false);
    // Vorlauf wie bei den Laeufen im Reiter COP erst ab der fuenften Minute.
    l.vorlauf = mittel(d.vorlauf, Math.min(a.von + 5 * 60000, (a.von + a.bis) / 2), a.bis, true);
    l.strom = kwh(d.e, a.von, a.bis);
    l.waerme = kwh(d.w, a.von, a.bis);
    l.quelleCop = "leistung";
    if (l.strom !== null && l.waerme !== null && l.strom > 0.05) {
      l.cop = l.waerme / l.strom;
    } else {
      l.strom = null;
      l.waerme = null;
      l.cop = mittel(d.cop, a.von, a.bis, true);
      l.quelleCop = l.cop === null ? null : "integration";
    }
    const abtau = dauerAn(d.abtau, a.von, a.bis);
    l.abtau = abtau === null ? null : abtau / 60000;
    const sI = dauerAn(d.stabI, a.von, a.bis);
    const sE = dauerAn(d.stabE, a.von, a.bis);
    l.stab = sI === null && sE === null ? null : ((sI || 0) + (sE || 0)) / 60000;
    l.steril = (dauerAn(d.steril, a.von, a.bis) || 0) > 0;
    l.pv = d.pv && d.pv.length ? mittel(d.pv, a.von, a.bis, false) : null;
    // Hoechste Aussentemperatur des Kalendertags. Liegt der Tag nicht ganz
    // im Verlauf, ist das kein Tageshoechstwert und wird so gekennzeichnet.
    const ta = tagBeginn(a.von);
    const tb = tagEnde(a.von);
    const tm = hoechster(d.aussen, ta, Math.min(tb, d.t1));
    l.tagMax = tm ? tm.v : null;
    l.tagMaxZeit = tm ? tm.t : null;
    l.tagVoll = d.t0 <= ta && d.t1 >= tb;
    // Vergleich mit dem Datenblatt wie im Reiter COP.
    l.copErwartet = null;
    l.copGeschaetzt = false;
    if (ref && l.cop !== null && l.aussen !== null && l.vorlauf !== null) {
      const s = datenblattSchaetzung(ref, l.aussen, l.vorlauf);
      if (s && s.wert) {
        l.copErwartet = s.wert;
        l.copGeschaetzt = s.geschaetzt;
      }
    }
    l.vollstaendig = !l.angeschnitten && !l.laufend;
    // SG Ready: Ladungen mit Stufe 3 oder 4 zaehlen nicht.
    l.sg = Boolean(d.sg && sgVerstaerkt(d.sg, a.von, a.bis));
    l.stufe = l.vollstaendig && !l.sg && l.copErwartet ? (l.cop / l.copErwartet >= TOLERANZ ? "gut" : "unter") : null;
    out.push(l);
  });
  return out;
}

/** Haltezeit nach jeder vollstaendigen Ladung. */
export function wwHaltezeiten(d, laden, schwelle) {
  const out = [];
  laden.forEach((l, i) => {
    if (l.laufend) return;
    const naechste = laden.slice(i + 1).find((x) => x.von > l.bis);
    const ende = l.bis;
    const bis = naechste ? naechste.von : d.t1;
    const h = { ende, tEnde: l.tEnde, naechste: Boolean(naechste) };
    // Nicht gewertet: nach oder vor einer Ladung ueber SG Ready.
    h.sg = Boolean(l.sg || (naechste && naechste.sg));
    h.stunden = (bis - ende) / STUNDE;
    h.tNachladen = naechste ? stand(d.temp, naechste.von) : null;
    // Erster Zeitpunkt unter der Schwelle.
    h.unter = null;
    if (Number.isFinite(schwelle)) {
      const reihe = d.temp || [];
      const beiEnde = stand(reihe, ende);
      if (beiEnde !== null && !Number.isNaN(beiEnde) && beiEnde < schwelle) h.unter = 0;
      for (let k = Math.max(0, indexBis(reihe, ende)); h.unter === null && k < reihe.length && reihe[k].t <= bis; k++) {
        if (reihe[k].t < ende) continue;
        if (!Number.isNaN(reihe[k].v) && reihe[k].v < schwelle) {
          h.unter = (reihe[k].t - ende) / STUNDE;
          break;
        }
      }
    }
    // Abfall in den Naechten ohne Ladung, ganz innerhalb der Haltezeit.
    const raten = [];
    for (let m = tagEnde(ende); m < bis; m = tagEnde(m)) {
      const a = m + NACHT[0] * STUNDE;
      const b = m + NACHT[1] * STUNDE;
      if (b > bis) break;
      const va = stand(d.temp, a);
      const vb = stand(d.temp, b);
      if (va !== null && vb !== null) raten.push((va - vb) / (NACHT[1] - NACHT[0]));
    }
    h.nacht = raten.length ? raten.reduce((s, x) => s + x, 0) / raten.length : null;
    h.naechte = raten.length;
    out.push(h);
  });
  return out;
}

/** Ladungen nach Aussentemperatur in Bereichen von 2 K. */
export function wwBereiche(laden) {
  const gueltig = laden.filter((l) => l.vollstaendig && !l.steril && !l.sg && l.cop !== null && l.aussen !== null);
  const map = new Map();
  gueltig.forEach((l) => {
    const u = Math.floor(l.aussen / BEREICH) * BEREICH;
    if (!map.has(u)) map.set(u, []);
    map.get(u).push(l);
  });
  const avg = (xs, f) => {
    const w = xs.map(f).filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
    return w.length ? w.reduce((s, v) => s + v, 0) / w.length : null;
  };
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([u, xs]) => ({
      von: u,
      bis: u + BEREICH,
      n: xs.length,
      genug: xs.length >= WW_MIN_N,
      // Waerme durch Strom des Bereichs, ohne Energiewerte das Mittel.
      cop: xs.every((l) => l.strom !== null && l.waerme !== null) && xs.reduce((a, l) => a + l.strom, 0) > 0
        ? xs.reduce((a, l) => a + l.waerme, 0) / xs.reduce((a, l) => a + l.strom, 0)
        : avg(xs, (l) => l.cop),
      strom: avg(xs, (l) => l.strom),
      tStart: avg(xs, (l) => l.tStart),
      hub: avg(xs, (l) => (l.tEnde !== null && l.tStart !== null ? l.tEnde - l.tStart : null)),
    }));
}

/** Steht die Sonne zum Zeitpunkt t ueber dem Horizont (sun.sun)? */
function sonneOben(reihe, t) {
  const i = indexBis(reihe || [], t);
  if (i < 0) return null;
  const s = String(reihe[i].s);
  if (s === "above_horizon") return true;
  if (s === "below_horizon") return false;
  return null;
}

/** Uhrzeit (Minuten nach Mitternacht) an einem Tag in Ortszeit. */
function uhrzeit(tagStart, minuten) {
  const d = new Date(tagStart);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, minuten).getTime();
}

/**
 * Beste Startzeit fuer eine Ladung: die Uhrzeit, ab der die folgende
 * Stunde ueber alle ganzen Tage im Mittel am waermsten war. Startzeiten
 * im Abstand von 15 Minuten, die Stunde endet spaetestens um Mitternacht.
 */
export function wwBesteStunde(d) {
  const tage = [];
  for (let m = tagEnde(d.t0); tagEnde(m) <= d.t1; m = tagEnde(m)) tage.push(m);
  if (!tage.length || !d.aussen || !d.aussen.length || d.aussen[0].t > tage[0]) return null;
  let beste = null;
  for (let min = 0; min <= 23 * 60; min += 15) {
    let summe = 0;
    let ok = true;
    tage.forEach((m) => {
      const a = uhrzeit(m, min);
      const v = mittel(d.aussen, a, a + STUNDE, false);
      if (v === null) ok = false;
      else summe += v;
    });
    if (!ok) continue;
    const v = summe / tage.length;
    if (!beste || v > beste.v) beste = { minuten: min, v, tage: tage.length };
  }
  return beste;
}

/** Mindestzahl gewerteter Ladungen fuer ein Urteil (eigene Festlegung). */
export const WW_URTEIL_MIN = 8;
/** Darunter lohnt sich das Laden am Tag kaum, kWh je Monat (eigene Festlegung). */
export const WW_KAUM = 1;

/**
 * Urteil, ob Laden am Tag Strom spart, und wie viel im Monat.
 *  1. Gewertet werden ganze Ladungen ohne SG Ready, Desinfektion und
 *     Heizstab, mit Strom und Waerme aus den Leistungswerten.
 *  2. Gewichtete Regression (Gewicht = Waerme der Ladung): Strom je kWh
 *     Waerme abhaengig von der Aussentemperatur, die Speichertemperatur
 *     beim Start als zweite Groesse. Linear, weil der Kehrwert des
 *     Carnot-COP, (Tc - To) / Tc, bei gleichem Guetegrad und gleicher
 *     Senke linear mit der Quellentemperatur To faellt.
 *  3. Jede Nachtladung (Sonne zur Mitte der Ladung unter dem Horizont)
 *     wird gedanklich in die beste Stunde desselben Tages gelegt; die
 *     Aussentemperatur dort ist das gemessene Stundenmittel, begrenzt auf
 *     den Bereich der gewerteten Ladungen (keine Hochrechnung darueber).
 *  4. Ersparnis = Steigung mal Summe (Waerme mal Temperaturunterschied),
 *     auf 30 Tage gerechnet; 95 %-Bereich aus dem Standardfehler der
 *     Steigung mit der t-Verteilung.
 *  Nicht enthalten: mehr Waermeverlust, wenn das Wasser laenger warm steht.
 */
export function wwUrteil(d, laden) {
  if (!d.sonne || !d.sonne.length) return { art: "sonne" };
  if (!d.aussen || !d.aussen.length) return { art: "aussen" };
  const ganz = laden.filter((l) => l.vollstaendig && !l.steril && !l.sg && !(l.stab > 0));
  if (ganz.length && ganz.every((l) => l.strom === null || l.waerme === null)) return { art: "leistung" };
  const gueltig = ganz.filter((l) => l.strom !== null && l.waerme !== null && l.waerme > 0
    && l.aussen !== null && l.tStart !== null && !Number.isNaN(l.tStart));
  const nacht = gueltig.filter((l) => sonneOben(d.sonne, (l.von + l.bis) / 2) === false);
  const basis = { n: gueltig.length, nNacht: nacht.length, min: WW_URTEIL_MIN };
  if (gueltig.length < WW_URTEIL_MIN) return { art: "zu_wenig", ...basis };
  if (!nacht.length) return { art: "keine_nacht", ...basis };
  const beste = wwBesteStunde(d);
  if (!beste) return { art: "zu_wenig", ...basis };
  basis.beste = beste;
  const gw = gueltig.map((l) => l.waerme);
  const sw = gw.reduce((x, v) => x + v, 0);
  const mT = gueltig.reduce((x, l) => x + l.waerme * l.aussen, 0) / sw;
  const mS = gueltig.reduce((x, l) => x + l.waerme * l.tStart, 0) / sw;
  const y = gueltig.map((l) => l.strom / l.waerme);
  let mitStart = true;
  let fit = wls(gueltig.map((l) => [1, l.aussen - mT, l.tStart - mS]), y, gw);
  if (!fit) {
    mitStart = false;
    fit = wls(gueltig.map((l) => [1, l.aussen - mT]), y, gw);
  }
  if (!fit || !(fit.kov[1][1] >= 0)) return { art: "gleich", ...basis };
  const steigung = fit.beta[1];
  const se = Math.sqrt(fit.kov[1][1]);
  const tq = tQuantil(0.975, fit.df);
  const tMin = Math.min(...gueltig.map((l) => l.aussen));
  const tMax = Math.max(...gueltig.map((l) => l.aussen));
  const gezaehlt = [];
  nacht.forEach((l) => {
    const a = uhrzeit(tagBeginn((l.von + l.bis) / 2), beste.minuten);
    if (a < d.t0 || a + STUNDE > d.t1) return;
    const ziel = mittel(d.aussen, a, a + STUNDE, false);
    if (ziel === null) return;
    gezaehlt.push({ waerme: l.waerme, dT: Math.min(tMax, Math.max(tMin, ziel)) - l.aussen });
  });
  if (!gezaehlt.length) return { art: "zu_wenig", ...basis };
  const k = gezaehlt.reduce((x, g) => x + g.waerme * g.dT, 0);
  const tage = (d.t1 - d.t0) / TAG;
  const faktor = 30 / tage;
  const spar = -steigung * k * faktor;
  const r1 = -(steigung - tq * se) * k * faktor;
  const r2 = -(steigung + tq * se) * k * faktor;
  const lo = Math.min(r1, r2);
  const hi = Math.max(r1, r2);
  let art = "unsicher";
  if (hi < 0) art = "nein";
  else if (hi < WW_KAUM) art = "kaum";
  else if (lo > 0) art = "ja";
  const strom = gueltig.reduce((x, l) => x + l.strom, 0);
  return {
    art, ...basis, spar, lo, hi, tage, mitStart, steigung, se, df: fit.df,
    // Steigung bezogen auf den mittleren Strom je kWh Waerme, in % je K.
    jeK: (-steigung / (strom / sw)) * 100,
    dT: gezaehlt.reduce((x, g) => x + g.dT, 0) / gezaehlt.length,
    nGezaehlt: gezaehlt.length,
  };
}

/**
 * Reicht eine Ladung je Tag? Nur aus gemessenen Haltezeiten: Faellt der
 * Speicher in einem Fall frueher als 24 h nach dem Ladeende unter die
 * Schwelle, reicht sie nicht immer. Hielt er in allen aussagekraeftigen
 * Faellen mindestens 24 h, reichte sie. Faelle, in denen vor Ablauf von
 * 24 h schon nachgeladen wurde, ohne dass die Schwelle erreicht war,
 * sagen dazu nichts.
 */
export function wwNachladen(halte) {
  const erreicht = halte.filter((h) => h.unter !== null);
  const kurz = erreicht.filter((h) => h.unter < 24);
  const lang = halte.filter((h) => (h.unter !== null && h.unter >= 24) || (h.unter === null && h.stunden >= 24));
  const zahlen = erreicht.map((h) => h.unter);
  return {
    erreicht: erreicht.length,
    gesamt: halte.filter((h) => h.unter !== null || h.naechste).length,
    mittel: zahlen.length ? zahlen.reduce((x, v) => x + v, 0) / zahlen.length : null,
    kuerzeste: zahlen.length ? Math.min(...zahlen) : null,
    urteil: kurz.length ? "nein" : lang.length ? "ja" : "offen",
    belege: kurz.length || lang.length,
  };
}

export const warmwasserKarte = {
  /** Nutzbarkeitsschwelle aus dem Editor, sonst keine. */
  _wwSchwelle() {
    const v = parseFloat(this._config.dhw_usable_temp);
    return Number.isFinite(v) ? v : null;
  },

  /** Oeffnet das Fenster und laedt den Verlauf. */
  _wwOeffnen() {
    const sr = this.shadowRoot;
    const fenster = sr && sr.getElementById("ww-fenster");
    if (!fenster) return;
    this._wwReiter = this._wwReiter || "tagnacht";
    fenster.hidden = false;
    this._wwZeigeText(this._t("ww_laedt"));
    this._wwLaden().then(() => this._wwZeichne());
  },

  _wwSchliessen() {
    const f = this.shadowRoot && this.shadowRoot.getElementById("ww-fenster");
    if (f) f.hidden = true;
  },

  /** Nur Text im Fenster, solange geladen wird oder Daten fehlen. */
  _wwZeigeText(text) {
    const box = this.shadowRoot.querySelector("#ww-fenster .lhc-ww-box");
    box.innerHTML = `<h3 id="ww-titel">${escapeHtml(this._t("ww_titel"))}</h3>
      <p class="lhc-an-modal-text">${escapeHtml(text)}</p>
      <div class="lhc-an-modal-knoepfe"><button type="button" class="lhc-an-btn" id="ww-zu">${escapeHtml(this._t("an_opt_zu"))}</button></div>`;
    box.querySelector("#ww-zu").addEventListener("click", () => this._wwSchliessen());
  },

  /** Holt die Verlaeufe, hoechstens 31 Tage zurueck. */
  async _wwLaden() {
    const jetzt = Date.now();
    const t0 = jetzt - 31 * TAG;
    if (this._config.demo) {
      this._wwDaten = this._wwDemo(jetzt - 21 * TAG, jetzt);
      return;
    }
    this._wwDaten = null;
    this._wwFehlt = [];
    const q = this._hass;
    const pflicht = { dhw_temp: "TOP10", three_way_valve: "TOP20", compressor: "TOP8" };
    this._wwFehlt = Object.entries(pflicht).filter(([f]) => !this._e(f)).map(([, t]) => t);
    if (this._wwFehlt.length || !q || typeof q.callWS !== "function") return;
    const quellen = (typeof this._jazQuellen === "function" && this._jazQuellen()) || {};
    const ww = quellen.ww || null;
    const felder = {
      temp: this._e("dhw_temp"),
      ventil: this._e("three_way_valve"),
      vd: this._e("compressor"),
      aussen: this._e("outside_temp"),
      vorlauf: this._e("flow_temp"),
      abtau: this._e("defrost"),
      stabI: this._e("heater_internal"),
      stabE: this._e("heater_external"),
      steril: this._e("sterilization_state"),
      sg1: this._e("sg_k1"),
      sg2: this._e("sg_k2"),
      cop: this._e("cop_dhw"),
      pv: this._e("pv_power"),
      sonne: q.states && q.states["sun.sun"] ? "sun.sun" : null,
      w: ww ? ww.w : null,
      e: ww ? ww.e : null,
    };
    const ids = [...new Set(Object.values(felder).filter(Boolean))];
    try {
      const antwort = await q.callWS({
        type: "history/history_during_period",
        start_time: new Date(t0).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: ids,
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      });
      const reihe = (id) =>
        ((antwort && id && antwort[id]) || [])
          .map((p) => ({ t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed), s: p.s !== undefined ? p.s : p.state }))
          .filter((p) => !Number.isNaN(p.t))
          .map((p) => ({ ...p, v: parseFloat(p.s) }));
      const d = { t1: jetzt, xtop: Boolean(ww && /xtop/i.test(ww.w || "")) };
      Object.entries(felder).forEach(([k, id]) => {
        d[k] = reihe(id);
      });
      // Der Verlauf reicht so weit zurueck, wie der Recorder speichert.
      d.t0 = d.temp.length ? Math.max(t0, d.temp[0].t) : jetzt;
      // SG Ready nur mit beiden Kontakten erkennbar.
      d.sgEingerichtet = Boolean(felder.sg1 && felder.sg2);
      d.sg = d.sgEingerichtet ? sgReihe(d.sg1, d.sg2) : null;
      this._wwDaten = d;
    } catch {
      this._wwDaten = null;
    }
  },

  /** Zeichnet das Fenster mit dem gewaehlten Reiter. */
  _wwZeichne() {
    const sr = this.shadowRoot;
    const fenster = sr && sr.getElementById("ww-fenster");
    if (!fenster || fenster.hidden) return;
    const t = (k) => this._t(k);
    const d = this._wwDaten;
    if (!d) {
      this._wwZeigeText(this._wwFehlt && this._wwFehlt.length
        ? tf(t("ww_fehlt"), { l: this._wwFehlt.join(", ") })
        : t("ww_kein_verlauf"));
      return;
    }
    const laden = wwLadungen(d, this._copReferenz());
    const schwelle = this._wwSchwelle();
    const zeit = (x) => {
      const z = new Date(x);
      return `${this._zrDatum(x, false)} ${String(z.getHours()).padStart(2, "0")}:${String(z.getMinutes()).padStart(2, "0")}`;
    };
    const uhr = (x) => {
      const z = new Date(x);
      return `${String(z.getHours()).padStart(2, "0")}:${String(z.getMinutes()).padStart(2, "0")}`;
    };
    const grad = (v, s = 1) => (v === null ? "--" : `${fmt(v, s)} °C`);
    const sub = [
      d.demo ? t("ww_demo") : t("ww_quelle"),
      tf(t("ww_zeitraum"), { a: this._zrDatum(d.t0, false), b: this._zrDatum(d.t1, false) }),
      laden.some((l) => l.sg)
        ? tf(t("ww_anzahl_sg"), { n: laden.length, s: laden.filter((l) => l.sg).length })
        : tf(t("ww_anzahl"), { n: laden.length }),
    ];
    const soll = this._config.demo ? 58 : parseFloat((this._quelle.states[this._e("dhw_setpoint")] || {}).state);
    const delta = this._config.demo ? -5 : parseFloat((this._quelle.states[this._e("dhw_heat_delta")] || {}).state);
    if (Number.isFinite(soll)) {
      sub.push(Number.isFinite(delta)
        ? tf(t("ww_soll_delta"), { s: fmt(soll, 0), d: fmt(Math.abs(delta), 0) })
        : tf(t("ww_soll"), { s: fmt(soll, 0) }));
    }
    const reiter = (k) => `<button type="button" class="lhc-ww-tab${this._wwReiter === k ? " aktiv" : ""}" data-ww-reiter="${k}">${escapeHtml(t(`ww_r_${k}`))}</button>`;
    let inhalt = "";
    if (this._wwReiter === "aussen") inhalt = this._wwAussenHtml(laden);
    else if (this._wwReiter === "tagnacht") inhalt = this._wwTagNachtHtml(d, laden, schwelle);
    else if (this._wwReiter === "halte") inhalt = this._wwHalteHtml(d, laden, schwelle, zeit, grad);
    else inhalt = this._wwLadenHtml(d, laden, zeit, uhr, grad);
    const box = sr.querySelector("#ww-fenster .lhc-ww-box");
    box.innerHTML = `
      <h3 id="ww-titel">${escapeHtml(t("ww_titel"))}</h3>
      <div class="lhc-an-modal-sub">${escapeHtml(sub.join(" · "))}</div>
      <div class="lhc-ww-tabs" role="tablist">${reiter("tagnacht")}${reiter("ladungen")}${reiter("aussen")}${reiter("halte")}</div>
      ${inhalt}
      <div class="lhc-an-modal-knoepfe"><button type="button" class="lhc-an-btn" id="ww-zu">${escapeHtml(t("an_opt_zu"))}</button></div>`;
    box.querySelector("#ww-zu").addEventListener("click", () => this._wwSchliessen());
    box.querySelectorAll("[data-ww-reiter]").forEach((b) => {
      b.addEventListener("click", () => {
        this._wwReiter = b.dataset.wwReiter;
        this._wwZeichne();
      });
    });
  },

  /** Reiter Ladungen: eine Zeile je Ladung, neueste zuerst. */
  _wwLadenHtml(d, laden, zeit, uhr, grad) {
    const t = (k) => this._t(k);
    if (!laden.length) return `<p class="lhc-an-modal-text">${escapeHtml(t("ww_keine"))}</p>`;
    const mitPv = laden.some((l) => l.pv !== null);
    const kopf = ["ww_k_start", "ww_k_dauer", "ww_k_speicher", "ww_k_aussen", "ww_k_tagmax", "ww_k_vorlauf", "ww_k_strom", "ww_k_waerme", "COP", "ww_k_abtau", "ww_k_stab"]
      .concat(mitPv ? ["ww_k_pv"] : [])
      .map((k) => `<th>${escapeHtml(k === "COP" ? k : t(k))}</th>`)
      .join("");
    const zeilen = laden
      .slice()
      .reverse()
      .map((l) => {
        const zusatz = [];
        if (l.angeschnitten) zusatz.push(t("ww_anfang_fehlt"));
        if (l.laufend) zusatz.push(t("ww_laeuft"));
        if (l.steril) zusatz.push(t("ww_steril"));
        if (l.sg) zusatz.push(t("ww_sg_aktiv"));
        const copKlasse = l.stufe ? ` class="lhc-ww-${l.stufe}${l.copGeschaetzt ? " blass" : ""}"` : "";
        const copTitel = l.copErwartet
          ? ` title="${escapeHtml(tf(t("ww_cop_titel"), { e: fmt(l.copErwartet, 1), p: fmt((l.cop / l.copErwartet) * 100, 0) }) + (l.copGeschaetzt ? ` · ${t("a_c_geschaetzt")}` : ""))}"`
          : "";
        const min = (v) => (v === null ? "--" : `${fmt(v, 0)} min`);
        const k = (v) => (v === null ? "--" : `${fmt(v, 2)} kWh`);
        const tagMax = l.tagMax === null ? "--" : `${grad(l.tagMax)} ${uhr(l.tagMaxZeit)}`;
        return `<tr${l.sg ? ' class="lhc-ww-aus"' : ""}>
          <td>${escapeHtml(zeit(l.von))}${zusatz.length ? `<small>${escapeHtml(zusatz.join(" · "))}</small>` : ""}</td>
          <td>${escapeHtml(fmt(l.minuten, 0))} min</td>
          <td>${escapeHtml(`${l.tStart === null ? "--" : fmt(l.tStart, 1)} → ${grad(l.tEnde)}`)}</td>
          <td>${escapeHtml(grad(l.aussen))}</td>
          <td>${escapeHtml(tagMax)}${l.tagMax !== null && !l.tagVoll ? `<small>${escapeHtml(t("ww_teiltag"))}</small>` : ""}</td>
          <td>${escapeHtml(grad(l.vorlauf))}</td>
          <td>${escapeHtml(k(l.strom))}</td>
          <td>${escapeHtml(k(l.waerme))}</td>
          <td${copKlasse}${copTitel}>${escapeHtml(fmt(l.cop, 1))}</td>
          <td>${escapeHtml(min(l.abtau))}</td>
          <td>${escapeHtml(min(l.stab))}</td>
          ${mitPv ? `<td>${escapeHtml(l.pv === null ? "--" : `${fmt(l.pv / 1000, 1)} kW`)}</td>` : ""}
        </tr>`;
      })
      .join("");
    const leistung = laden.some((l) => l.quelleCop === "leistung");
    const integ = laden.some((l) => l.quelleCop === "integration");
    const fuss = [
      leistung ? tf(t("ww_f_leistung"), { q: d.xtop ? "XTOP2 / XTOP5" : "TOP41 / TOP40" }) : "",
      integ ? t("ww_f_integration") : "",
      t("ww_f_erkennung"),
      this._copReferenz() ? t("ww_f_datenblatt") : "",
      t(d.sgEingerichtet ? "ww_f_sg" : "ww_f_sg_ohne"),
    ].filter(Boolean);
    return `<div class="lhc-ww-scroll"><table class="lhc-ww-tabelle"><thead><tr>${kopf}</tr></thead><tbody>${zeilen}</tbody></table></div>
      ${fuss.map((f) => `<p class="lhc-an-modal-klein">${escapeHtml(f)}</p>`).join("")}`;
  },

  /** Reiter Aussentemperatur: Mittelwerte je Bereich, nur Messung. */
  _wwAussenHtml(laden) {
    const t = (k) => this._t(k);
    const bereiche = wwBereiche(laden);
    if (!bereiche.length) return `<p class="lhc-an-modal-text">${escapeHtml(t("ww_keine_cop"))}</p>`;
    const zeilen = bereiche
      .map((b) => `<tr>
        <td>${escapeHtml(tf(t("ww_bereich"), { a: fmt(b.von, 0), b: fmt(b.bis, 0) }))}</td>
        <td>${b.n}</td>
        <td>${escapeHtml(b.genug ? fmt(b.cop, 2) : t("ww_zu_wenig"))}</td>
        <td>${escapeHtml(b.genug && b.strom !== null ? `${fmt(b.strom, 2)} kWh` : "--")}</td>
        <td>${escapeHtml(b.genug && b.tStart !== null ? `${fmt(b.tStart, 1)} °C` : "--")}</td>
        <td>${escapeHtml(b.genug && b.hub !== null ? `${fmt(b.hub, 1)} K` : "--")}</td>
      </tr>`)
      .join("");
    const genug = bereiche.filter((b) => b.genug);
    const saetze = [];
    if (genug.length >= 2) {
      const k = genug[0];
      const w = genug[genug.length - 1];
      saetze.push(tf(t("ww_vergleich"), {
        wa: fmt(w.von, 0), wb: fmt(w.bis, 0), cw: fmt(w.cop, 2), ka: fmt(k.von, 0), kb: fmt(k.bis, 0), ck: fmt(k.cop, 2),
        d: fmt(Math.abs(w.cop - k.cop), 2), r: t(w.cop >= k.cop ? "ww_hoeher" : "ww_niedriger"),
      }));
    } else {
      saetze.push(tf(t("ww_noch_nicht"), { n: WW_MIN_N }));
    }
    // Abstand zur hoechsten Aussentemperatur des Tages, nur ganze Tage.
    const voll = laden.filter((l) => l.vollstaendig && l.tagVoll && l.tagMax !== null && l.aussen !== null);
    if (voll.length) {
      const m = voll.reduce((s, l) => s + (l.tagMax - l.aussen), 0) / voll.length;
      saetze.push(tf(t("ww_tagmax"), { d: fmt(m, 1), n: voll.length }));
    }
    return `<div class="lhc-ww-scroll"><table class="lhc-ww-tabelle"><thead><tr>
        <th>${escapeHtml(t("ww_k_bereich"))}</th><th>${escapeHtml(t("ww_k_n"))}</th><th>Ø COP</th>
        <th>${escapeHtml(t("ww_k_strom_je"))}</th><th>${escapeHtml(t("ww_k_tstart"))}</th><th>${escapeHtml(t("ww_k_hub"))}</th>
      </tr></thead><tbody>${zeilen}</tbody></table></div>
      ${saetze.map((s) => `<p class="lhc-an-modal-text">${escapeHtml(s)}</p>`).join("")}
      <p class="lhc-an-modal-klein">${escapeHtml(tf(t("ww_f_aussen"), { n: WW_MIN_N }))}</p>`;
  },

  /** Reiter Haltezeit: wie lange haelt der Speicher die Temperatur. */
  _wwHalteHtml(d, laden, schwelle, zeit, grad) {
    const t = (k) => this._t(k);
    const halte = wwHaltezeiten(d, laden, schwelle);
    if (!halte.length) return `<p class="lhc-an-modal-text">${escapeHtml(t("ww_keine"))}</p>`;
    const h = (v) => (v === null ? "--" : `${fmt(v, 1)} h`);
    const zeilen = halte
      .slice()
      .reverse()
      .map((x) => {
        const bisNach = x.naechste
          ? `${h(x.stunden)} (${grad(x.tNachladen)})`
          : `${h(x.stunden)} · ${t("ww_noch_keine")}`;
        let unter = "--";
        if (schwelle !== null) unter = x.unter !== null ? h(x.unter) : t("ww_nicht_unter");
        return `<tr${x.sg ? ' class="lhc-ww-aus"' : ""}>
          <td>${escapeHtml(`${zeit(x.ende)} · ${grad(x.tEnde)}`)}${x.sg ? `<small>${escapeHtml(t("ww_sg_halte"))}</small>` : ""}</td>
          <td>${escapeHtml(bisNach)}</td>
          <td>${escapeHtml(unter)}</td>
          <td>${escapeHtml(x.nacht === null ? "--" : `${fmt(x.nacht, 2)} K/h`)}</td>
        </tr>`;
      })
      .join("");
    // Mittelwerte nur aus Haltezeiten ohne SG Ready.
    const gewertet = halte.filter((x) => !x.sg);
    const mit = gewertet.filter((x) => x.naechste);
    const saetze = [];
    if (mit.length) {
      const m = mit.reduce((s, x) => s + x.stunden, 0) / mit.length;
      saetze.push(tf(t("ww_halte_mittel"), { h: fmt(m, 1), n: mit.length }));
    }
    if (schwelle !== null) {
      const u = gewertet.filter((x) => x.unter !== null);
      if (u.length) saetze.push(tf(t("ww_unter_mittel"), { s: fmt(schwelle, 0), h: fmt(u.reduce((s, x) => s + x.unter, 0) / u.length, 1), n: u.length }));
    }
    const kopfSchwelle = schwelle !== null ? tf(t("ww_k_unter"), { s: fmt(schwelle, 0) }) : t("ww_k_unter_ohne");
    return `<div class="lhc-ww-scroll"><table class="lhc-ww-tabelle"><thead><tr>
        <th>${escapeHtml(t("ww_k_ende"))}</th><th>${escapeHtml(t("ww_k_bis_nach"))}</th>
        <th>${escapeHtml(kopfSchwelle)}</th><th>${escapeHtml(t("ww_k_nacht"))}</th>
      </tr></thead><tbody>${zeilen}</tbody></table></div>
      ${schwelle === null ? `<p class="lhc-la-ohne">${escapeHtml(t("ww_schwelle_fehlt"))}</p>` : ""}
      ${saetze.map((s) => `<p class="lhc-an-modal-text">${escapeHtml(s)}</p>`).join("")}
      <p class="lhc-an-modal-text">${escapeHtml(t("ww_f_zapfen"))}</p>
      ${d.sgEingerichtet ? `<p class="lhc-an-modal-klein">${escapeHtml(t("ww_f_sg_halte"))}</p>` : ""}`;
  },

  /** Reiter Tag oder Nacht: klares Urteil, Ersparnis im Monat, beste Zeit. */
  _wwTagNachtHtml(d, laden, schwelle) {
    const t = (k) => this._t(k);
    const e = escapeHtml;
    const u = wwUrteil(d, laden);
    const kwh = (v) => fmt(v, Math.abs(v) < 1 ? 2 : 1);
    const beste = u.beste || (u.art === "sonne" || u.art === "aussen" ? null : wwBesteStunde(d));
    const zeit = beste ? `${String(Math.floor(beste.minuten / 60)).padStart(2, "0")}:${String(beste.minuten % 60).padStart(2, "0")}` : null;
    const tage = u.tage ? fmt(u.tage, 0) : "";
    let klasse = "grau";
    let icon = "!";
    let satz = t("ww_u_daten");
    let zahl = "";
    let fein = "";
    if (u.art === "ja") {
      klasse = "gruen";
      icon = "✓";
      satz = t("ww_u_ja");
      zahl = `≈ ${kwh(u.spar)} kWh <small>${e(t("ww_u_monat"))}</small>`;
      fein = tf(t("ww_u_bereich"), { a: fmt(u.lo, 1), b: fmt(u.hi, 1), t: tage });
    } else if (u.art === "nein") {
      icon = "✕";
      satz = t("ww_u_nein");
      zahl = `≈ ${kwh(-u.spar)} kWh <small>${e(t("ww_u_mehr_monat"))}</small>`;
      fein = tf(t("ww_u_bereich"), { a: fmt(-u.hi, 1), b: fmt(-u.lo, 1), t: tage });
    } else if (u.art === "kaum") {
      icon = "≈";
      satz = t("ww_u_kaum");
      fein = tf(t("ww_u_kaum_f"), { b: kwh(Math.max(0, u.hi)), t: tage });
    } else if (u.art === "unsicher") {
      klasse = "gelb";
      icon = "?";
      satz = t("ww_u_unsicher");
      fein = tf(t("ww_u_unsicher_f"), { a: fmt(u.lo, 1), b: fmt(u.hi, 1) });
    } else if (u.art === "gleich") {
      klasse = "gelb";
      icon = "?";
      satz = t("ww_u_unsicher");
      fein = t("ww_u_f_gleich");
    } else if (u.art === "keine_nacht") {
      icon = "✓";
      satz = t("ww_u_keine_nacht");
      fein = t("ww_u_keine_nacht_f");
    } else if (u.art === "zu_wenig") {
      icon = "…";
      satz = t("ww_u_zu_wenig");
      fein = tf(t("ww_u_zu_wenig_f"), { n: u.n, m: u.min });
    } else {
      fein = t(`ww_u_f_${u.art}`);
    }
    const kasten = `<div class="lhc-ww-urteil ${klasse}"><div class="lhc-ww-urteil-icon" aria-hidden="true">${e(icon)}</div><div>
      <div class="lhc-ww-urteil-satz">${e(satz)}</div>
      ${zahl ? `<div class="lhc-ww-urteil-zahl">${zahl}</div>` : ""}
      ${fein ? `<div class="lhc-ww-urteil-fein">${e(fein)}</div>` : ""}
    </div></div>`;
    // Drei Zeilen: beste Zeit, Nachtladungen, ob eine Ladung je Tag reicht.
    let reicht = t("ww_u_reicht_ohne");
    if (schwelle !== null) {
      const nl = wwNachladen(wwHaltezeiten(d, laden, schwelle).filter((h) => !h.sg));
      if (nl.urteil === "ja") reicht = t("ww_u_reicht_ja");
      else if (nl.urteil === "nein") reicht = tf(t("ww_u_reicht_nein"), { k: fmt(nl.kuerzeste, 0) });
      else reicht = t("ww_u_reicht_offen");
    }
    const zeile = (k, v) => `<div class="lhc-ww-zeile"><span>${e(t(k))}</span><b>${e(v)}</b></div>`;
    const zeilen = [
      zeile("ww_u_k_zeit", zeit || "--"),
      u.n !== undefined ? zeile("ww_u_k_nacht", tf(t("ww_u_nacht_v"), { n: u.nNacht, g: u.n })) : "",
      zeile("ww_u_k_reicht", reicht),
    ].join("");
    const mitZahl = ["ja", "nein", "kaum", "unsicher"].includes(u.art);
    // Aufklappbar: wie gerechnet.
    const wie = [];
    if (mitZahl) {
      wie.push(tf(t(u.mitStart ? "ww_u_w_k" : "ww_u_w_k_ohne"), {
        p: fmt(Math.abs(u.jeK), 1), r: t(u.jeK >= 0 ? "ww_u_w_weniger" : "ww_u_w_mehr"), n: u.n,
      }));
      wie.push(tf(t("ww_u_w_dt"), { k: fmt(Math.abs(u.dT), 1), r: t(u.dT >= 0 ? "ww_u_w_kaelter" : "ww_u_w_waermer"), z: zeit }));
      wie.push(tf(t("ww_u_w_spar"), { m: u.nGezaehlt, z: zeit }));
    }
    const q = d.xtop ? "XTOP2 / XTOP5" : "TOP41 / TOP40";
    wie.push(tf(t("ww_u_w_basis"), { q }));
    wie.push(tf(t("ww_u_w_methode"), { min: WW_URTEIL_MIN, kaum: fmt(WW_KAUM, 0) }));
    return `${kasten}
      <div class="lhc-ww-zeilen">${zeilen}</div>
      ${mitZahl ? `<p class="lhc-an-modal-klein">${e(t("ww_u_verlust"))}</p>` : ""}
      <details class="lhc-quelle"><summary>${e(t("ww_u_wie"))}</summary><ul class="lhc-ww-wie">${wie.map((x) => `<li>${e(x)}</li>`).join("")}</ul></details>`;
  },

  /**
   * Nachgebildete Daten fuer den Demomodus: eine Ladung je Tag zu
   * wechselnden Zeiten, Zapfen morgens und abends. Keine Messung.
   */
  _wwDemo(t0, t1) {
    const schritt = 5 * 60000;
    const tag0 = tagBeginn(t0);
    const aussenBei = (t) => {
      const k = Math.floor((t - tag0) / TAG);
      const std = (t - tagBeginn(t)) / STUNDE;
      return 2 + (k % 3) + 4 * Math.cos(((std - 14) / 24) * 2 * Math.PI);
    };
    const startStunden = [3.2, 13.7, 6.9, 14.2, 2.5, 12.8, 21.0, 13.2, 4.4];
    const tage = Math.ceil((t1 - tag0) / TAG);
    const starts = Array.from({ length: tage }, (_, k) => tag0 + k * TAG + startStunden[k % startStunden.length] * STUNDE)
      .filter((s) => s > t0 && s < t1);
    const d = { demo: true, t0, t1, xtop: false, sgEingerichtet: true };
    ["temp", "ventil", "vd", "aussen", "vorlauf", "abtau", "stabI", "stabE", "steril", "cop", "pv", "w", "e", "sonne"].forEach((k) => {
      d[k] = [];
    });
    const add = (k, t, v) => d[k].push({ t, s: String(v), v });
    let tank = 50;
    let laden = false;
    let start = 0;
    ["ventil", "vd", "abtau", "stabI", "stabE", "steril", "w", "e"].forEach((k) => add(k, t0, 0));
    add("vorlauf", t0, 30);
    for (let t = t0; t <= t1; t += schritt) {
      const std = (t - tagBeginn(t)) / STUNDE;
      if (!laden && starts.some((s) => s >= t && s < t + schritt)) {
        laden = true;
        start = t;
        const a = aussenBei(t);
        // COP nahe am Datenblatt der T-CAP M 12 kW, 90 bis 99 % davon.
        const db = datenblattSchaetzung("panasonic_tcap_m_12", a, 52);
        const k = Math.floor((t - tag0) / TAG);
        const cop = (db && db.wert ? db.wert : 0.42 * ((55 + 273.15) / (55 - a))) * (0.9 + (k % 4) * 0.03);
        add("ventil", t, 1);
        add("vd", t, 45);
        add("vorlauf", t, 52);
        add("w", t, 6500);
        add("e", t, Math.round(6500 / cop));
        if (a < 2) {
          add("abtau", t + 15 * 60000, 1);
          add("abtau", t + 20 * 60000, 0);
        }
      }
      if (laden) {
        tank += t - start < 20 * 60000 ? 1.3 : 1.6;
        if (tank >= 58) {
          tank = 58;
          laden = false;
          ["ventil", "vd", "w", "e"].forEach((k) => add(k, t, 0));
          add("vorlauf", t, 30);
        }
      } else {
        tank -= 0.15 / 12;
        // Zapfen morgens und abends.
        if (std >= 7 && std < 7.25) tank -= 2;
        if (std >= 19.5 && std < 19.75) tank -= 2.5;
      }
      add("temp", t, Math.round(tank * 2) / 2);
      // Sonne im Demomodus von 07:20 bis 16:40 ueber dem Horizont.
      const oben = std >= 7 + 1 / 3 && std < 16 + 2 / 3;
      const vorher = d.sonne.length ? d.sonne[d.sonne.length - 1].s : null;
      const jetztS = oben ? "above_horizon" : "below_horizon";
      if (vorher !== jetztS) d.sonne.push({ t, s: jetztS, v: NaN });
      if (Math.round(std * 12) % 3 === 0) add("aussen", t, Math.round(aussenBei(t) * 10) / 10);
    }
    // SG Ready im Demomodus: am sechsten Tag 12:30 bis 13:45 Stufe 3, so
    // laeuft die Ladung um 12:48 ueber SG Ready und zaehlt nicht.
    const sgAn = tag0 + 5 * TAG + 12.5 * STUNDE;
    d.sg = [{ t: t0, stufe: 2 }, { t: sgAn, stufe: 3 }, { t: sgAn + 75 * 60000, stufe: 2 }].filter((p, i) => i === 0 || (p.t > t0 && p.t < t1));
    return d;
  },
};
