/**
 * Zwei Auswertungen im Diagrammfenster: COP je Takt der letzten 24 Stunden
 * und die Taktung der Waermepumpe mit Bewertung.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Beide beruhen auf denselben Verlaeufen: Verdichter, Umschaltventil,
 * COP Heizen, COP Warmwasser und Aussentemperatur.
 *
 * Bewertet wird nur nach Grenzen, die eine fachliche Quelle nennt:
 *  - Taktung: Ziel 10 bis 20 Minuten je Start (Bundesverband Waermepumpe,
 *    zitiert bei 42watt "Taktung der Waermepumpe"). Eine feste Grenze fuer
 *    die Zahl der Starts gibt es nicht (ebenda); im Fraunhofer-Feldtest
 *    blieben 90 % der Anlagen unter 5.500 Starts im Jahr. Bei Invertern ist
 *    der Verlust durch Takten laut Dongellini und Morini (2019) gering,
 *    darum keine rote Stufe.
 *  - COP: Vergleich mit dem Datenblatt des im Editor gewaehlten Geraets bei
 *    gleicher Aussen- und Vorlauftemperatur (42watt: "Ein hoeherer COP ist
 *    nur bei gleicher Messbedingung besser."). Ab 92 % des Datenblatts gruen,
 *    darunter gelb (Toleranz -8 %, HP KEYMARK, siehe datenblatt.js). Eine
 *    zweite belegte Grenze fuer Rot gibt es nicht. Ausserhalb der
 *    Pruefpunkte geschaetzt und blasser gezeichnet (eigene Festlegung).
 *    Ohne Datenblatt oder bei unvollstaendigen Laeufen grau.
 *  - COP je Lauf: Waerme durch Strom, beides als Zeitintegral der
 *    Leistungswerte der Waermepumpe (TOP15/TOP16 beim Heizen, TOP40/TOP41
 *    beim Warmwasser, mit Zusatzblock XTOP3/XTOP0 und XTOP5/XTOP2). Das ist
 *    die Definition der Leistungszahl ueber einen Zeitraum. Ein Mittelwert
 *    des augenblicklichen COP waere es nicht: Phasen mit wenig Strom
 *    zaehlten zu stark, Abtauungen mit COP 0 fielen heraus. Nur ohne diese
 *    Werte gilt der zeitliche Mittelwert des COP-Sensors der Integration.
 *  - Takten bei Invertern: Laut Dongellini und Morini (2019) haben die
 *    Anlaufverluste nur bei Geraeten ohne Leistungsregelung einen
 *    erheblichen Einfluss auf die Jahresarbeitszahl.
 */
import { escapeHtml, fmt, groesster, indexBis, jePixel, kleinster, warmwasserZustand, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { DATENBLAETTER, TOLERANZ, datenblattSchaetzung } from "./datenblatt.js";
import { sgReihe, sgVerstaerkt } from "./sgstufen.js";
import { DW } from "./diagramme.js";

const HOEHE = { cop: 338, takt: 262, abtau: 262 };

const FARBE = {
  heiz: "#FF5F52",
  ww: "#4D9BFF",
  aussen: "#6BB7E8",
  kurz: "#F59E0B",
  gut: "#84CC16",
  sehrGut: "#22C55E",
  leer: "#1C2533",
  // Abtauen wie das Symbol in der Karte, Laeufe blass dahinter.
  abtau: "#3E9BE0",
  lauf: "#2E3A4D",
};

/** Farben der Stufen der Taktung, wie in der Analyse. */
const STUFE_FARBE = { ok: "#22C55E", leicht: "#98A6BA", hinweis: "#F59E0B" };

/** Neutrale Farbe fuer Werte ohne Bewertung. */
const NEUTRAL = "#6B7A90";
const GRAU = "#98A6BA";

/** Einordnung einer Laufzeit in Minuten nach dem Ziel von 10 bis 20 Minuten. */
function bewertung(minuten) {
  if (minuten < 10) return "kurz";
  if (minuten < 20) return "gut";
  return "sehrGut";
}

/**
 * Stufe der Taktung aus abgeschlossenen Laeufen: in Ordnung ohne Lauf unter
 * 10 Minuten, leichte Abweichung bei einzelnen kuerzeren Laeufen, ausserhalb
 * der Toleranz, wenn die Laeufe im Mittel kuerzer als 10 Minuten sind.
 */
export function taktStufe(laeufe) {
  if (!laeufe.length) return null;
  const kurz = laeufe.filter((l) => l.minuten < 10).length;
  const mittelwert = laeufe.reduce((s, l) => s + l.minuten, 0) / laeufe.length;
  return { stufe: mittelwert < 10 ? "hinweis" : kurz ? "leicht" : "ok", kurz, mittel: mittelwert };
}

/** Farben der COP-Stufen: gruen im Rahmen, gelb darunter (geprueft, mit Zeichen). */
const COP_FARBE = { gut: "#16A34A", unter: "#F5B70A" };

/**
 * Stufe eines Laufs gegenueber dem Datenblatt: "gut" ab 92 %, "unter"
 * darunter, null ohne Vergleichswert oder wenn der Lauf nicht vollstaendig
 * im Zeitraum liegt.
 */
export function copStufe(l) {
  // Laeufe ueber SG Ready (Stufe 3 oder 4) werden nicht bewertet.
  if (!l || l.sg || l.copQuote === null || l.copQuote === undefined || l.laufend || l.angeschnitten || l.luecke) return null;
  return l.copQuote >= TOLERANZ ? "gut" : "unter";
}

/**
 * Energie in kWh aus einer Leistungsreihe in W. Jeder Wert gilt bis zum
 * naechsten, so speichert Home Assistant den Verlauf. Negative Werte meldet
 * HeishaMon als ungueltig, sie zaehlen als 0. Deckt die Reihe weniger als
 * 95 % des Zeitraums ab (fehlende oder unbekannte Werte), ist das Ergebnis
 * unbekannt (null) statt zu klein.
 */
export function energie(reihe, von, bis) {
  if (!reihe || !reihe.length || !(bis > von)) return null;
  let summe = 0;
  let gedeckt = 0;
  for (let i = Math.max(0, indexBis(reihe, von)); i < reihe.length && reihe[i].t < bis; i++) {
    const a = Math.max(reihe[i].t, von);
    const b = Math.min(i + 1 < reihe.length ? reihe[i + 1].t : bis, bis);
    if (b <= a) continue;
    const v = reihe[i].v;
    if (v === null || v === undefined || Number.isNaN(v)) continue;
    summe += Math.max(v, 0) * (b - a);
    gedeckt += b - a;
  }
  return gedeckt >= 0.95 * (bis - von) ? summe / 3.6e9 : null;
}

/** Zahlenreihe [{ t, s, v }] einer Entitaet aus einer Antwort des Verlaufs. */
export function verlaufsReihe(antwort, id) {
  return ((antwort && id && antwort[id]) || [])
    .map((p) => ({ t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed), s: p.s !== undefined ? p.s : p.state }))
    .filter((p) => !Number.isNaN(p.t))
    .map((p) => ({ ...p, v: parseFloat(p.s) }));
}

/**
 * Leistungszahl mehrerer Laeufe: Summe Waerme durch Summe Strom, wenn alle
 * Laeufe Energiewerte haben (art "heiz", "ww" oder "gesamt"). Sonst null,
 * dann rechnet der Aufrufer mit dem Mittel nach Laufzeit.
 */
export function copSumme(laeufe, art) {
  if (!laeufe.length || !laeufe.every((l) => l.energieDa)) return null;
  const w = laeufe.reduce((s, l) => s + (art === "heiz" ? l.wHeiz : art === "ww" ? l.wWw : l.wHeiz + l.wWw), 0);
  const e = laeufe.reduce((s, l) => s + (art === "heiz" ? l.eHeiz : art === "ww" ? l.eWw : l.eHeiz + l.eWw), 0);
  return e > 0.01 ? w / e : null;
}

/** Zeitgewichteter Mittelwert einer Reihe im Zeitraum, ohne Werte bis 0. */
export function mittel(reihe, von, bis, nurPositiv) {
  let summe = 0;
  let dauer = 0;
  // Erst ab dem Eintrag, der zu Beginn gilt; danach nur bis zum Ende.
  for (let i = Math.max(0, indexBis(reihe, von)); i < reihe.length && reihe[i].t < bis; i++) {
    const a = Math.max(reihe[i].t, von);
    const b = Math.min(i + 1 < reihe.length ? reihe[i + 1].t : bis, bis);
    if (b <= a) continue;
    const v = reihe[i].v;
    if (v === null || Number.isNaN(v) || (nurPositiv && v <= 0)) continue;
    summe += v * (b - a);
    dauer += b - a;
  }
  return dauer ? summe / dauer : null;
}

/** Eintraege ohne bekannten Zustand, etwa wenn HeishaMon kurz nicht erreichbar ist. */
const UNBEKANNT = ["unknown", "unavailable", "none", ""];

/**
 * Laeuft der Verdichter laut Eintrag (TOP8 in Hz oder an/aus)? true, false
 * oder null, wenn der Zustand unbekannt ist. Unbekannt heisst nicht "aus".
 */
export function verdichterZustand(s) {
  if (s === null || s === undefined) return null;
  const t = String(s).trim().toLowerCase();
  if (UNBEKANNT.includes(t)) return null;
  const n = parseFloat(t);
  if (!Number.isNaN(n)) return n > 0;
  return zustandAn(t);
}

/**
 * Zusammenhaengende Verdichterlaeufe im Zeitraum. Unbekannte Eintraege
 * aendern den Zustand nicht, es gilt der letzte bekannte. Je Lauf: von,
 * bis, anfang (lief schon zu Beginn der Reihe oder des Zeitraums), offen
 * (laeuft am Ende noch), unbekannt (ms ohne bekannten Zustand im Lauf und
 * direkt vor seinem Beginn, dann ist auch der Beginn unsicher).
 */
export function verdichterLaeufe(vd, von, bis) {
  const out = [];
  if (!vd || !vd.length) return out;
  let start = null;
  let anfang = false;
  let unbekannt = 0;
  let seit = null;
  for (let i = Math.max(0, indexBis(vd, von)); i < vd.length && vd[i].t < bis; i++) {
    const t = Math.max(vd[i].t, von);
    const an = verdichterZustand(vd[i].s);
    if (an === null) {
      if (seit === null) seit = t;
      continue;
    }
    const luecke = seit === null ? 0 : t - seit;
    seit = null;
    if (an && start === null) {
      start = t;
      anfang = i === 0 || vd[i].t <= von;
      unbekannt = luecke;
    } else if (start !== null) {
      unbekannt += luecke;
      if (!an) {
        if (t > start) out.push({ von: start, bis: t, anfang, offen: false, unbekannt });
        start = null;
      }
    }
  }
  if (start !== null && bis > start) {
    if (seit !== null) unbekannt += bis - seit;
    out.push({ von: start, bis, anfang, offen: true, unbekannt });
  }
  return out;
}

/**
 * Ein Lauf gilt als lueckenhaft, wenn mehr als 5 % seiner Dauer ohne
 * bekannten Zustand sind (gleiche Grenze wie bei der Energie: mindestens
 * 95 % muessen bekannt sein). Solche Laeufe zaehlen als Start, werden aber
 * nicht bewertet.
 */
export function lueckenhaft(lauf) {
  return lauf.unbekannt > 0.05 * (lauf.bis - lauf.von);
}

/**
 * Abschnitte im Zeitraum, in denen ein Zustand an ist (Zahl ueber 0 oder
 * an). Unbekannte Eintraege aendern den Zustand nicht.
 */
export function anAbschnitte(reihe, t0, t1) {
  const out = [];
  const r = reihe || [];
  let an = false;
  for (let i = 0; i < r.length; i++) {
    const z = verdichterZustand(r[i].s);
    if (z !== null) an = z;
    const a = Math.max(r[i].t, t0);
    const b = Math.min(i + 1 < r.length ? r[i + 1].t : t1, t1);
    if (b <= a || !an) continue;
    const letzter = out[out.length - 1];
    if (letzter && letzter.bis === a) letzter.bis = b;
    else out.push({ von: a, bis: b });
  }
  return out;
}

/**
 * Abtauungen aus TOP26 im Zeitraum: Dauer, Aussentemperatur als Mittel
 * waehrend der Abtauung, Betrieb nach dem Umschaltventil zur Mitte.
 * vorher: begann vor dem Zeitraum, laeuft: dauert noch an. Beide zaehlen
 * mit, gehen aber nicht in die mittlere Dauer ein.
 */
export function abtauungen(d) {
  if (!d || !d.abtau) return [];
  return anAbschnitte(d.abtau, d.t0, d.t1).map((x) => {
    const mitte = (x.von + x.bis) / 2;
    const abschnitt = ventilAbschnitte(d.ventil, mitte, mitte + 1)[0];
    return {
      von: x.von,
      bis: x.bis,
      minuten: (x.bis - x.von) / 60000,
      aussen: d.aussen && d.aussen.length ? mittel(d.aussen, x.von, x.bis, false) : null,
      ww: Boolean(abschnitt && abschnitt.ww),
      vorher: x.von <= d.t0,
      laeuft: x.bis >= d.t1,
    };
  });
}

/**
 * Zerlegt einen Zeitraum nach der Stellung des Umschaltventils in
 * Abschnitte mit ww (true = Warmwasser). Ohne Ventilverlauf gilt alles
 * als Heizen. Damit zaehlen bei einem Lauf, der ohne Verdichterstopp von
 * Warmwasser auf Heizen wechselt, die Warmwassertemperaturen nicht zum
 * Heizbetrieb. Unbekannte Eintraege aendern die Stellung nicht.
 */
export function ventilAbschnitte(ventil, von, bis) {
  if (!ventil || !ventil.length) return [{ von, bis, ww: false }];
  let k = indexBis(ventil, von);
  let ww = false;
  for (let j = k; j >= 0; j--) {
    const z = warmwasserZustand(ventil[j].s);
    if (z !== null) {
      ww = z;
      break;
    }
  }
  let t = von;
  const out = [];
  for (k += 1; k < ventil.length && ventil[k].t < bis; k++) {
    const neu = warmwasserZustand(ventil[k].s);
    if (neu === null || neu === ww) continue;
    if (ventil[k].t > t) out.push({ von: t, bis: ventil[k].t, ww });
    t = Math.max(t, ventil[k].t);
    ww = neu;
  }
  if (bis > t) out.push({ von: t, bis, ww });
  return out;
}

/** Wert einer Reihe zu einem Zeitpunkt (letzter Stand davor). */
function stand(reihe, t) {
  const i = indexBis(reihe, t);
  return i >= 0 ? reihe[i] : null;
}

export const auswertungKarte = {
  _auswertungHoehe(art) {
    return HOEHE[art] || 220;
  },

  /**
   * Datenblatt fuer den COP-Vergleich laut Editor (cop_reference). Ohne
   * Auswahl gibt es keinen Vergleich und keine Bewertung. Der Demomodus
   * zeigt die T-CAP M 12 kW.
   */
  _copReferenz() {
    if (this._config.demo) return "panasonic_tcap_m_12";
    const k = this._config.cop_reference;
    return k && DATENBLAETTER[k] ? k : "";
  },

  /** Holt die Verlaeufe hoechstens alle fuenf Minuten. */
  _holeAuswertung() {
    const jetzt = Date.now();
    const sp = this._zrSpanne();
    if (this._auswertungZeit && jetzt - this._auswertungZeit < 300000 && this._auswertungK === sp.k) return;
    this._auswertungZeit = jetzt;
    this._auswertungK = sp.k;
    // Laeufe brauchen den Verlauf, hoechstens 31 Tage zurueck.
    const t0 = sp.tVerlauf;
    if (this._config.demo) {
      this._auswertung = this._auswertungDemo(t0, jetzt);
      this._zeichneAuswertung();
      return;
    }
    // Dazu die Vorlaeufe der Heizkreise (TOP36, TOP37) fuer Anlagen mit
    // Puffer und der Startzaehler (TOP12) zum Abgleich der gezaehlten Laeufe.
    const felder = ["compressor", "three_way_valve", "cop_heating", "cop_dhw", "outside_temp", "flow_temp",
      "return_temp", "defrost", "heater_internal", "heater_external", "hk1_water", "hk2_water", "compressor_starts", "pump_flow",
      "sg_k1", "sg_k2"];
    const ids = felder.map((f) => this._e(f));
    if (!ids[0] || !this._hass || typeof this._hass.callWS !== "function") {
      this._auswertung = null;
      this._zeichneAuswertung();
      return;
    }
    // Leistungswerte der Waermepumpe fuer den COP je Lauf (wie bei der JAZ).
    const quellen = (typeof this._jazQuellen === "function" && this._jazQuellen()) || {};
    const leistung = [
      quellen.heizen ? quellen.heizen.w : null, quellen.heizen ? quellen.heizen.e : null,
      quellen.ww ? quellen.ww.w : null, quellen.ww ? quellen.ww.e : null,
    ];
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: new Date(t0).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: [...new Set(ids.concat(leistung).filter(Boolean))],
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        // Inzwischen anderer Zeitraum gewaehlt: Antwort verwerfen.
        if (this._zrSchluessel() !== sp.k) return;
        const reihe = (id) => verlaufsReihe(antwort, id);
        const [vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, starts, durchfluss, k1, k2] =
          ids.map(reihe);
        const [heizW, heizE, wwW, wwE] = leistung.map((id) => (id ? reihe(id) : null));
        // Beginnt der Verlauf spaeter, beginnt auch die Auswertung dort.
        const erster = vd.length ? vd[0].t : t0;
        const t0e = erster - t0 > 3600000 ? Math.min(erster, jetzt - 3600000) : t0;
        this._auswertung = {
          t0: t0e, t1: jetzt, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, starts,
          durchfluss,
          heizW, heizE, wwW, wwE,
          // SG Ready nur mit beiden Kontakten erkennbar.
          sg: ids[14] && ids[15] ? sgReihe(k1, k2) : null,
        };
        this._zeichneAuswertung();
      })
      .catch(() => {
        if (this._zrSchluessel() !== sp.k) return;
        this._auswertung = null;
        this._zeichneAuswertung();
      });
  },

  /** Nachgebildete Daten fuer den Demomodus. */
  _auswertungDemo(t0, t1) {
    // Ueber mehrere Tage: jeder Tag nach demselben Muster, etwas kaelter
    // oder milder, aneinandergehaengt.
    if (t1 - t0 > 1.05 * 86400000) {
      const tage = [];
      for (let a = t1 - 86400000; a > t0 - 1; a -= 86400000) tage.unshift(a);
      const teile = tage.map((a, k) => this._auswertungDemoTag(a, a + 86400000, (k % 5) - 2 - (tage.length - k) * 0.05));
      const out = { t0: tage[0], t1 };
      ["vd", "ventil", "copH", "copW", "aussen", "vorlauf", "ruecklauf", "abtau", "stabIntern", "stabExtern", "kreis1", "kreis2", "durchfluss", "sg",
        "heizW", "heizE", "wwW", "wwE"].forEach((f) => {
        out[f] = teile.flatMap((x) => x[f]).sort((x, y) => x.t - y.t);
      });
      out.starts = this._auswertungDemoZaehler(out.vd);
      return out;
    }
    const tag = this._auswertungDemoTag(t0, t1, 0);
    tag.starts = this._auswertungDemoZaehler(tag.vd);
    return tag;
  },

  /** Startzaehler im Demomodus: zaehlt jeden Anlauf des Verdichters. */
  _auswertungDemoZaehler(vd) {
    let n = 41230;
    const out = [];
    vd.forEach((p) => {
      if (p.v > 0) n++;
      out.push({ t: p.t, s: String(n), v: n });
    });
    return out;
  },

  _auswertungDemoTag(t0, t1, versatz) {
    const h = 3600000;
    const aussenBei = (t) => 5.5 + versatz - 3.5 * Math.cos(((t - t0) / h - 14) / 24 * 2 * Math.PI);
    const vd = [{ t: t0, s: "0", v: 0 }];
    const ventil = [{ t: t0, s: "0", v: 0 }];
    const copH = [{ t: t0, s: "0", v: 0 }];
    const copW = [{ t: t0, s: "0", v: 0 }];
    const aussen = [];
    const vorlauf = [{ t: t0, s: "30", v: 30 }];
    const ruecklauf = [{ t: t0, s: "29", v: 29 }];
    const abtau = [{ t: t0, s: "0", v: 0 }];
    const stabIntern = [{ t: t0, s: "0", v: 0 }];
    const stabExtern = [{ t: t0, s: "0", v: 0 }];
    // Heizkreis-Vorlauf hinter dem Puffer: etwas unter dem Vorlauf der
    // Waermepumpe (eingestellte Ueberhoehung plus Mischung im Puffer).
    const kreis1 = [{ t: t0, s: "31", v: 31 }];
    const kreis2 = [{ t: t0, s: "28", v: 28 }];
    const durchfluss = [{ t: t0, s: "0", v: 0 }];
    // Leistungswerte wie TOP15/16 und TOP40/41 (nachgebildet).
    const heizW = [{ t: t0, s: "0", v: 0 }];
    const heizE = [{ t: t0, s: "0", v: 0 }];
    const wwW = [{ t: t0, s: "0", v: 0 }];
    const wwE = [{ t: t0, s: "0", v: 0 }];
    const heizLaeufe = [];
    [3.2, 7.3, 21.2].forEach((s) => {
      abtau.push({ t: t0 + s * h, s: "1", v: 1 }, { t: t0 + s * h + 6 * 60000, s: "0", v: 0 });
    });
    for (let t = t0; t <= t1; t += h / 4) aussen.push({ t, s: "", v: aussenBei(t) });
    [0.5, 1.6, 2.7, 3.9, 5.0, 6.2, 7.0, 8.4, 9.8, 11.5, 13.6, 15.9, 18.1, 19.4, 20.6, 21.7, 22.8].forEach((s, i) => {
      const start = t0 + s * h;
      const dauer = (s > 10 && s < 17 ? 7 + (i % 3) * 2 : 16 + (i % 4) * 4) * 60000;
      const ww = i === 6 || i === 15;
      vd.push({ t: start, s: "40", v: 40 }, { t: start + dauer, s: "0", v: 0 });
      if (!ww) heizLaeufe.push({ start, dauer });
      const vl = ww ? 51 : 35 + Math.max(0, 6 - aussenBei(start)) * 0.6;
      vorlauf.push({ t: start, s: "", v: vl }, { t: start + dauer, s: "", v: 30 });
      ruecklauf.push({ t: start, s: "", v: vl - (ww ? 6 : 3.8) }, { t: start + dauer, s: "", v: 29 });
      if (!ww) {
        kreis1.push({ t: start, s: "", v: vl - 4.2 }, { t: start + dauer, s: "", v: 31 });
        kreis2.push({ t: start, s: "", v: vl - 7.5 }, { t: start + dauer, s: "", v: 28 });
      }
      durchfluss.push({ t: start, s: "", v: ww ? 22 : 31 }, { t: start + dauer, s: "0", v: 0 });
      // In den ersten drei Minuten liegt der COP niedriger (Anlauf).
      const ramp = (reihe, c) => {
        reihe.push({ t: start, s: "", v: c * 0.6 }, { t: start + 3 * 60000, s: "", v: c }, { t: start + dauer, s: "0", v: 0 });
      };
      // Strom im Anlauf 70 % der Leistung, Waerme = COP mal Strom.
      const leistungen = (rw, re, c, p) => {
        re.push({ t: start, s: "", v: p * 0.7 }, { t: start + 3 * 60000, s: "", v: p }, { t: start + dauer, s: "0", v: 0 });
        rw.push({ t: start, s: "", v: c * 0.6 * p * 0.7 }, { t: start + 3 * 60000, s: "", v: c * p }, { t: start + dauer, s: "0", v: 0 });
      };
      // COP im Demomodus: Anteil am Carnot-COP um 0,42 bis 0,46, beim
      // Warmwasser 0,40 (nachgebildete Werte, keine Messung).
      const carnot = (a, w) => (w + 273.15) / (w - a);
      if (ww) {
        ventil.push({ t: start, s: "1", v: 1 }, { t: start + dauer, s: "0", v: 0 });
        ramp(copW, 0.4 * carnot(aussenBei(start), vl));
        leistungen(wwW, wwE, 0.4 * carnot(aussenBei(start), vl), 2200);
      } else {
        const c = (0.44 + (((i * 7) % 5) - 2) * 0.01) * carnot(aussenBei(start), vl);
        ramp(copH, c);
        leistungen(heizW, heizE, c, 1600);
      }
    });
    // SG Ready im Demomodus: Stufe 3 um den ersten Heizlauf zwischen 11 und
    // 15 Uhr Ortszeit (PV-Ueberschuss). Dieser Lauf wird nicht gewertet.
    const sg = [{ t: t0, stufe: 2 }];
    const mittag = heizLaeufe.find((x) => {
      const std = new Date(x.start).getHours();
      return std >= 11 && std < 15;
    });
    if (mittag) sg.push({ t: mittag.start - 6 * 60000, stufe: 3 }, { t: mittag.start + mittag.dauer + 6 * 60000, stufe: 2 });
    return { t0, t1, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, durchfluss, sg,
      heizW, heizE, wwW, wwE };
  },

  /**
   * Zerlegt den Verdichterverlauf in Laeufe mit Dauer, Art, COP und
   * Aussentemperatur. Ein schon zu Beginn laufender oder noch laufender
   * Lauf wird gekennzeichnet und nicht bewertet.
   */
  _auswertungLaeufe(d) {
    // Je Datensatz nur einmal rechnen: Fenster und Analyse fragen mehrfach.
    const ref = this._copReferenz();
    if (this._laeufeCache && this._laeufeCache.d === d && this._laeufeCache.ref === ref) return this._laeufeCache.laeufe;
    const laeufe = this._auswertungLaeufeRechnen(d, ref);
    this._laeufeCache = { d, ref, laeufe };
    return laeufe;
  },

  _auswertungLaeufeRechnen(d, ref) {
    // Unbekannte Werte von TOP8 (etwa "unavailable") beenden keinen Lauf.
    const laeufe = verdichterLaeufe(d.vd, d.t0, d.t1).map((x) => ({
      von: x.von, bis: x.bis, angeschnitten: x.anfang, laufend: x.offen, unbekannt: x.unbekannt,
    }));
    laeufe.forEach((l) => {
      l.luecke = lueckenhaft(l);
      l.minuten = (l.bis - l.von) / 60000;
      // Warmwasser, wenn das Ventil die meiste Zeit des Laufs dorthin stand.
      const abschnitte = ventilAbschnitte(d.ventil, l.von, l.bis);
      const wwDauer = abschnitte.filter((a) => a.ww).reduce((s, a) => s + (a.bis - a.von), 0);
      l.ww = wwDauer > (l.bis - l.von) / 2;
      // COP = Waerme durch Strom der eigenen Betriebsart (Leistungswerte
      // der Waermepumpe). Ohne diese Werte der Mittelwert des COP-Sensors.
      const en = (r) => (r && r.length ? energie(r, l.von, l.bis) : null);
      l.wHeiz = en(d.heizW);
      l.eHeiz = en(d.heizE);
      l.wWw = en(d.wwW);
      l.eWw = en(d.wwE);
      l.energieDa = [l.wHeiz, l.eHeiz, l.wWw, l.eWw].every((x) => x !== null);
      const w = l.ww ? l.wWw : l.wHeiz;
      const e = l.ww ? l.eWw : l.eHeiz;
      if (w !== null && e !== null && e > 0.01) {
        l.cop = w / e;
        l.copArt = "energie";
      } else {
        l.cop = mittel(l.ww ? d.copW : d.copH, l.von, l.bis, true);
        l.copArt = l.cop === null ? null : "sensor";
        l.energieDa = false;
      }
      l.aussen = mittel(d.aussen, l.von, l.bis, false);
      // Temperaturen nur aus den Abschnitten der eigenen Betriebsart und
      // jeweils erst nach den ersten fuenf Minuten: Solange der Vorlauf
      // nach dem Start oder nach dem Umschalten noch steigt oder faellt,
      // waere er fuer den Vergleich falsch.
      const eigene = abschnitte.filter((a) => a.ww === l.ww);
      const mittelEigene = (reihe) => {
        if (!reihe || !reihe.length) return null;
        let summe = 0;
        let dauer = 0;
        eigene.forEach((a) => {
          const ab = Math.min(a.von + 5 * 60000, (a.von + a.bis) / 2);
          const m = mittel(reihe, ab, a.bis, true);
          if (m === null) return;
          summe += m * (a.bis - ab);
          dauer += a.bis - ab;
        });
        return dauer ? summe / dauer : null;
      };
      l.vorlauf = mittelEigene(d.vorlauf);
      l.ruecklauf = mittelEigene(d.ruecklauf);
      l.kreis1 = mittelEigene(d.kreis1);
      l.kreis2 = mittelEigene(d.kreis2);
      // Ausserhalb der Pruefpunkte geschaetzt und gekennzeichnet (siehe datenblatt.js).
      const dbl = ref && l.aussen !== null && l.vorlauf !== null ? datenblattSchaetzung(ref, l.aussen, l.vorlauf) : null;
      l.copErwartet = dbl ? dbl.wert : null;
      l.copGeschaetzt = Boolean(dbl && dbl.geschaetzt);
      l.copQuote = l.cop !== null && l.copErwartet ? l.cop / l.copErwartet : null;
      if (l.aussen === null) {
        const s = stand(d.aussen, l.von);
        l.aussen = s && !Number.isNaN(s.v) ? s.v : null;
      }
      l.bewertung = bewertung(l.minuten);
      // Ueber SG Ready (Stufe 3 oder 4): nicht gewertet.
      l.sg = Boolean(d.sg && sgVerstaerkt(d.sg, l.von, l.bis));
    });
    return laeufe;
  },

  /** Kachel mit grosser Zahl und kleiner Beschriftung. */
  _auswertungKachel(x, y, w, wert, text, farbe) {
    return `<g><rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="44" rx="10" fill="#1C2533"/>
      <text x="${(x + 10).toFixed(1)}" y="${y + 21}" font-size="17" font-weight="700" fill="${farbe || "#E8EDF4"}">${escapeHtml(wert)}</text>
      <text x="${(x + 10).toFixed(1)}" y="${y + 36}" font-size="10.5" fill="#98A6BA">${escapeHtml(text)}</text></g>`;
  },

  _auswertungKacheln(y, eintraege) {
    const links = 20;
    const breite = DW - 40;
    const abstand = 8;
    const w = (breite - abstand * (eintraege.length - 1)) / eintraege.length;
    return eintraege
      .map(([wert, text, farbe], i) => this._auswertungKachel(links + i * (w + abstand), y, w, wert, text, farbe))
      .join("");
  },

  /** Kleine Zeitachse mit fuenf Marken. */
  _auswertungAchse(links, rechts, y, t0, t1) {
    return this._zrAchse(links, rechts, y, t0, t1, 'font-size="11" fill="#7E8CA0"');
  },

  /** Hinweis, ab wann Laeufe vorliegen und dass sie hoechstens 31 Tage reichen. */
  _auswertungHinweis(d) {
    this._zrHinweis([this._zrLueckeText(d.t0, this._zrSpanne())]);
  },

  /** Zeichnet die gerade offene Auswertung neu. */
  _zeichneAuswertung() {
    const art = this._diaArt;
    if (art === "analyse") {
      this._zeichneAnalyse();
      return;
    }
    if (art !== "cop" && art !== "takt" && art !== "abtau") return;
    const sr = this.shadowRoot;
    const g = sr && sr.getElementById(`dia-${art}`);
    if (!g) return;
    const liste = sr.getElementById("dia-liste");
    const d = this._auswertung;
    if (art === "abtau") {
      this._zeichneAbtau(g, liste, d);
      return;
    }
    const laeufe = d ? this._auswertungLaeufe(d) : [];
    if (d) this._auswertungHinweis(d);
    if (!d || !laeufe.length) {
      g.innerHTML = "";
      if (liste) liste.textContent = "";
      const leer = sr.getElementById("dia-leer");
      if (leer) {
        leer.textContent = this._t(d ? "a_keine_laeufe" : "kein_verlauf");
      }
      this._diaLeer(true);
      return;
    }
    const leer = sr.getElementById("dia-leer");
    if (leer) leer.textContent = this._t("kein_verlauf");
    this._diaLeer(false);
    if (art === "cop") this._zeichneCop(g, liste, d, laeufe);
    else this._zeichneTakt(g, liste, d, laeufe);
  },

  /**
   * Kasten oben mit Symbol, Titel und Unterzeile in der Farbe der Stufe.
   * zeichen: "ok" Haken, "info" ein i, sonst Ausrufezeichen.
   */
  _auswertungUrteil(farbe, zeichen, titel, unterzeile) {
    let symbol = `<path d="M44 18 V27" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round"/><circle cx="44" cy="31.5" r="1.6" fill="${farbe}"/>`;
    if (zeichen === "ok") {
      symbol = `<path d="M38 25 L42.5 29.5 L50 21" fill="none" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else if (zeichen === "info") {
      symbol = `<circle cx="44" cy="18.5" r="1.6" fill="${farbe}"/><path d="M44 23.5 V32" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
    return `<g>
        <rect x="20" y="0" width="${DW - 40}" height="50" rx="12" fill="${farbe}" fill-opacity="0.12" stroke="${farbe}" stroke-opacity="0.45"/>
        <circle cx="44" cy="25" r="12" fill="none" stroke="${farbe}" stroke-width="2"/>
        ${symbol}
        <text x="66" y="21" font-size="14" font-weight="700" fill="${farbe}">${escapeHtml(titel)}</text>
        <text x="66" y="39" font-size="11.5" fill="#C9D3E0">${escapeHtml(unterzeile)}</text>
      </g>`;
  },

  /**
   * COP je Lauf gegenueber dem Datenblatt bei gleicher Aussen- und
   * Vorlauftemperatur: gruen ab 92 %, gelb darunter, grau ohne
   * Vergleichswert. Gelbe Laeufe lassen sich analysieren (laufanalyse.js).
   */
  _zeichneCop(g, liste, d, laeufe) {
    // Laeufe ueber SG Ready stehen im Bild, zaehlen aber nirgends mit.
    const alleCop = laeufe.filter((l) => l.cop !== null);
    const mitCop = alleCop.filter((l) => !l.sg);
    const sgCop = alleCop.filter((l) => l.sg);
    const ref = this._copReferenz();
    const gewichtet = (ls, feld) => {
      const auswahl = ls.filter((l) => l[feld] !== null && l[feld] !== undefined);
      const dauer = auswahl.reduce((s, l) => s + l.minuten, 0);
      return dauer ? auswahl.reduce((s, l) => s + l[feld] * l.minuten, 0) / dauer : null;
    };
    const heiz = mitCop.filter((l) => !l.ww);
    const ww = mitCop.filter((l) => l.ww);
    const z = (v) => (v === null ? "--" : fmt(v, 1));

    // Stufen je Lauf und Kopf mit der Zahl der bewerteten Laeufe.
    const bewertet = mitCop.filter((l) => copStufe(l));
    const unter = bewertet.filter((l) => copStufe(l) === "unter");
    const ohne = mitCop.length - bewertet.length;
    const quote = gewichtet(bewertet, "copQuote");
    let urteil;
    if (!mitCop.length) {
      urteil = this._auswertungUrteil(GRAU, "info", this._t("a_keine_cop"), "");
    } else if (!ref) {
      urteil = this._auswertungUrteil(GRAU, "info", this._t("a_c_t_ohne_ref"), this._t("a_c_d_ref"));
    } else if (!bewertet.length) {
      urteil = this._auswertungUrteil(GRAU, "info", this._t("a_c_t_keine"), tf(this._t("a_c_d_ohne"), { n: ohne }));
    } else {
      // Kurz: nur der Anteil am Datenblatt. Geschaetzte und unbewertete
      // Laeufe zeigt das Bild (blass, grau) und die Legende.
      const teile = [tf(this._t("a_c_d_quote_k"), { p: fmt(quote * 100, 0) })];
      urteil = unter.length
        ? this._auswertungUrteil(COP_FARBE.unter, "warn", tf(this._t("a_c_t_unter"), { u: unter.length, n: bewertet.length }), teile.join(" · "))
        : this._auswertungUrteil(COP_FARBE.gut, "ok", tf(this._t("a_c_t_gut"), { n: bewertet.length }), teile.join(" · "));
    }
    let out = urteil;
    // Waerme durch Strom ueber alle Laeufe; nur ohne Energiewerte das
    // Mittel der Laeufe nach Laufzeit.
    const summe = (art, ls) => {
      const c = copSumme(mitCop, art);
      return c !== null ? c : gewichtet(ls, "cop");
    };
    out += this._auswertungKacheln(60, [
      [z(summe("heiz", heiz)), this._t("a_cop_heiz"), FARBE.heiz],
      [z(summe("ww", ww)), this._t("a_cop_ww"), FARBE.ww],
      [z(summe("gesamt", mitCop)), this._t("a_cop_gesamt")],
    ]);
    if (!alleCop.length) {
      g.innerHTML = out;
      if (liste) liste.textContent = "";
      return;
    }
    // Saeulen je Lauf: Hoehe = gemessener COP, Farbe = Stufe gegenueber dem
    // Datenblatt, heller Strich = Datenblattwert. Eine Achse, die
    // Aussentemperatur steht als eigener Streifen darunter.
    const links = 44;
    const rechts = DW - 20;
    const oben = 132;
    const unten = 246;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0 || 1)) * (rechts - links);
    const werte = alleCop.map((l) => l.cop).concat(alleCop.filter((l) => l.copErwartet !== null && !l.sg).map((l) => l.copErwartet));
    const cMax = Math.max(Math.ceil(groesster(werte)), 5);
    const zuY = (v) => unten - (Math.max(0, v) / cMax) * (unten - oben);
    for (let v = 0; v <= cMax; v++) {
      out += `<line x1="${links}" x2="${rechts}" y1="${zuY(v).toFixed(1)}" y2="${zuY(v).toFixed(1)}" stroke="#26303F"${
        v ? ' stroke-dasharray="2 5"' : ""
      }/>
        <text x="${links - 8}" y="${(zuY(v) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="#7E8CA0">${v}</text>`;
    }
    out += `<text x="${links - 8}" y="${oben - 10}" text-anchor="end" font-size="10.5" fill="#7E8CA0">COP</text>`;
    // Bei vielen Laeufen (laengere Zeitraeume) schmale Saeulen. Die Werte
    // stehen im Tooltip, nicht ueber den Saeulen.
    const viele = alleCop.length > 60;
    alleCop.forEach((l) => {
      const xa = zuX(l.von);
      const w = Math.max(viele ? 1.5 : 5, zuX(l.bis) - xa - (viele ? 0 : 2));
      const y = zuY(l.cop);
      const stufe = copStufe(l);
      const mitStrich = l.copErwartet !== null && !l.sg;
      const titel = `${this._t(l.ww ? "warmwasser" : "heizung")} · ${fmt(l.minuten, 0)} min · COP ${fmt(l.cop, 1)}${
        mitStrich ? ` · ${tf(this._t(l.copGeschaetzt ? "a_c_dbl_s" : "a_c_dbl"), { c: fmt(l.copErwartet, 1) })} (${fmt(l.copQuote * 100, 0)} %)` : ""
      }${l.aussen !== null ? ` · ${fmt(l.aussen, 1)} °C` : ""}${l.vorlauf !== null ? ` · VL ${fmt(l.vorlauf, 0)} °C` : ""}${
        l.sg ? ` · ${this._t("a_sg_nicht")}` : ""}`;
      const r = Math.min(3, w / 2, unten - y);
      // Gelbe Saeulen oeffnen per Klick die Analyse des Laufs.
      const klick = stufe === "unter" ? ` data-lauf="${laeufe.indexOf(l)}" class="lhc-cop-klick"` : "";
      const form = `M${xa.toFixed(1)} ${unten}V${(y + r).toFixed(1)}Q${xa.toFixed(1)} ${y.toFixed(1)} ${(xa + r).toFixed(1)} ${y.toFixed(1)}H${(xa + w - r).toFixed(1)}Q${(xa + w).toFixed(1)} ${y.toFixed(1)} ${(xa + w).toFixed(1)} ${(y + r).toFixed(1)}V${unten}Z`;
      // SG Ready: nur gestrichelter Umriss, ohne Bewertung.
      out += l.sg
        ? `<path class="lhc-sg-lauf" d="${form}" fill="none" stroke="#98A6BA" stroke-width="1.4" stroke-dasharray="3 2"><title>${escapeHtml(titel)}</title></path>`
        : `<path d="${form}"
                    fill="${stufe ? COP_FARBE[stufe] : NEUTRAL}"${l.laufend || l.angeschnitten || l.luecke ? ' opacity="0.55"' : stufe && l.copGeschaetzt ? ' fill-opacity="0.55"' : ""}${klick}><title>${escapeHtml(titel)}</title></path>`;
      if (mitStrich) {
        const ye = zuY(l.copErwartet).toFixed(1);
        const ueber = viele ? 0 : 3;
        out += `<line x1="${(xa - ueber).toFixed(1)}" x2="${(xa + w + ueber).toFixed(1)}" y1="${ye}" y2="${ye}"
                      stroke="#E8EDF4" stroke-width="${viele ? 1.5 : 2.5}" stroke-linecap="round" pointer-events="none"/>`;
      }
      // Spur darunter: rot Heizen, blau Warmwasser.
      out += `<rect x="${xa.toFixed(1)}" y="${unten + 5}" width="${w.toFixed(1)}" height="5" rx="2" fill="${l.ww ? FARBE.ww : FARBE.heiz}"/>`;
    });
    out += this._auswertungAchse(links, rechts, unten + 28, d.t0, d.t1);
    // Aussentemperatur als eigener Streifen mit eigener Beschriftung.
    const aw = jePixel(d.aussen.filter((p) => !Number.isNaN(p.v)), zuX);
    if (aw.length >= 2) {
      const so = unten + 50;
      const su = unten + 82;
      const aMin = kleinster(aw.map((p) => p.v));
      const aMax = groesster(aw.map((p) => p.v));
      const zuYa = (v) => su - ((v - aMin) / (aMax - aMin || 1)) * (su - so);
      let pfad = "";
      aw.forEach((p, i) => {
        const x = zuX(Math.max(p.t, d.t0));
        pfad += `${i ? `H${x.toFixed(1)}V` : `M${x.toFixed(1)} `}${zuYa(p.v).toFixed(1)}`;
      });
      pfad += `H${rechts}`;
      out += `<text x="${links}" y="${so - 6}" font-size="10.5" fill="${FARBE.aussen}">${escapeHtml(this._t("aussentemperatur"))}</text>
        <text x="${rechts}" y="${so - 6}" text-anchor="end" font-size="10.5" fill="${FARBE.aussen}">${fmt(aMin, 1)} … ${fmt(aMax, 1)} °C</text>
        <path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="1.8" stroke-linejoin="round"/>`;
    }
    g.innerHTML = out;
    g.querySelectorAll("[data-lauf]").forEach((el) => {
      el.addEventListener("click", () => this._zeigeLaufAnalyse(laeufe[Number(el.dataset.lauf)]));
    });

    if (liste) {
      // Stufen mit Zeichen und Text, Farbe nie allein.
      // Nur Eintraege, die im Bild vorkommen. Zeichen und Farbe bleiben
      // zusammen, damit ein Umbruch sie nicht trennt.
      const eintrag = (zeichen, text) => `<span class="lhc-leg">${zeichen}<span>${escapeHtml(this._t(text))}</span></span>`;
      const farbe = (f, extra = "") => `<span class="lhc-dia-farbe${extra}" style="background:${f}"></span>`;
      const legende = (ref
        ? [
          bewertet.length > unter.length ? eintrag(farbe(COP_FARBE.gut), "a_c_l_gut") : "",
          unter.length ? eintrag(farbe(COP_FARBE.unter), "a_c_l_unter") : "",
          bewertet.some((l) => l.copGeschaetzt) ? eintrag(`<span class="lhc-dia-farbe" style="background:${COP_FARBE.gut};opacity:0.55"></span>`, "a_c_l_geschaetzt_k") : "",
          ohne ? eintrag(farbe("var(--c-6b7a90)"), "a_c_l_ohne") : "",
          eintrag('<span class="lhc-dia-strich"></span>', "a_c_vergleich_k"),
        ]
        : [eintrag(farbe("var(--c-6b7a90)"), "a_c_saeule")])
        .concat(
          sgCop.length ? eintrag('<span class="lhc-dia-farbe sg"></span>', "a_sg_nicht") : "",
          alleCop.some((l) => !l.ww) ? eintrag(farbe(FARBE.heiz, " flach"), "heizung") : "",
          alleCop.some((l) => l.ww) ? eintrag(farbe(FARBE.ww, " flach"), "warmwasser") : ""
        )
        .join("");
      // Ein Knopf statt einer Liste: Die Analyse beginnt beim schlechtesten
      // gelben Lauf, im Fenster wird zwischen den gelben Laeufen geblaettert.
      const reihe = unter.slice().sort((x, y) => x.copQuote - y.copQuote);
      this._copReihe = reihe;
      liste.innerHTML = `
        <div class="lhc-takt-legende">${legende}</div>
        ${reihe.length ? `<button type="button" class="lhc-an-knopf lhc-cop-analyse" id="cop-analyse">${escapeHtml(tf(this._t("a_c_analysieren_n"), { n: reihe.length }))}</button>` : ""}
        <details class="lhc-quelle"><summary>${escapeHtml(this._t("a_quelle_auf"))}</summary>
          <p class="lhc-takt-quelle">${escapeHtml(this._t(ref ? "a_c_quelle" : "a_c_quelle_o"))}</p></details>`;
      const knopf = liste.querySelector("#cop-analyse");
      if (knopf) knopf.addEventListener("click", () => this._zeigeLaufAnalyse(reihe[0]));
    }
  },

  /** Taktband mit Bewertung, Aussentemperatur und Stundenampel. */
  _zeichneTakt(g, liste, d, laeufe) {
    // Laeufe ueber SG Ready stehen im Band, zaehlen aber nicht mit. Pausen
    // vor und nach einem solchen Lauf ebenfalls nicht.
    const normal = laeufe.filter((l) => !l.sg);
    const bewertet = normal.filter((l) => !l.laufend && !l.angeschnitten && !l.luecke);
    const n = normal.filter((l) => !l.angeschnitten).length;
    const kurz = bewertet.filter((l) => l.minuten < 10);
    const mLauf = bewertet.length ? bewertet.reduce((s, l) => s + l.minuten, 0) / bewertet.length : null;
    const pausen = [];
    for (let i = 1; i < laeufe.length; i++) {
      if (!laeufe[i].sg && !laeufe[i - 1].sg) pausen.push((laeufe[i].von - laeufe[i - 1].bis) / 60000);
    }
    const mPause = pausen.length ? pausen.reduce((s, p) => s + p, 0) / pausen.length : null;
    // Starts je Tag nur als Messwert; eine feste Grenze gibt es nicht.
    const tage = Math.max((d.t1 - d.t0) / 86400000, 1);
    const jeTag = n / tage;

    // Kurze Laeufe bei milder Witterung: Dort ist die kleinste Leistung der
    // Waermepumpe hoeher, waehrend das Haus wenig Waerme braucht (42watt).
    const kurzMild = kurz.filter((l) => l.aussen !== null && l.aussen >= 10);

    // Gesamturteil nur nach dem Ziel von 10 bis 20 Minuten je Start.
    const tk = taktStufe(bewertet);
    const stufe = tk ? tk.stufe : null;
    let out;
    if (!tk) {
      out = this._auswertungUrteil(GRAU, "info", this._t("a_t_offen"), "");
    } else {
      const titel = { ok: "a_t_ok", leicht: "a_t_einige", hinweis: "a_t_mittel" }[stufe];
      const unterzeile = stufe === "ok"
        ? tf(this._t("a_t_ok_d"), { n, d: fmt(mLauf, 0) })
        : tf(this._t("a_t_kurz_d"), { k: kurz.length, n: bewertet.length, d: fmt(mLauf, 0) });
      out = this._auswertungUrteil(STUFE_FARBE[stufe], stufe === "ok" ? "ok" : stufe === "leicht" ? "info" : "warn", this._t(titel), unterzeile);
    }
    // Die Zahl kurzer Laeufe steht schon im Kasten oben.
    out += this._auswertungKacheln(60, [
      [tage > 1.5 ? `${n} · ${fmt(jeTag, 0)}/d` : String(n), this._t("a_t_starts_k")],
      [mLauf === null ? "--" : `${fmt(mLauf, 0)} min`, this._t("a_t_lauf")],
      [mPause === null ? "--" : `${fmt(mPause, 0)} min`, this._t("a_t_pause")],
    ]);
    const links = 20;
    const rechts = DW - 20;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    // Laeufe als Bloecke in ihrer Bewertungsfarbe.
    out += `<text x="${links}" y="128" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_laeufe"))}</text>
      <rect x="${links}" y="134" width="${rechts - links}" height="30" rx="7" fill="${FARBE.leer}"/>`;
    laeufe.forEach((l) => {
      const xa = zuX(l.von);
      const w = Math.max(3, zuX(l.bis) - xa);
      const f = l.ww ? FARBE.ww : FARBE[l.bewertung];
      const titelL = `${this._t(l.ww ? "warmwasser" : "heizung")} · ${fmt(l.minuten, 0)} min${
        l.aussen !== null ? ` · ${fmt(l.aussen, 1)} °C` : ""
      }${l.sg ? ` · ${this._t("a_sg_nicht")}` : ""}`;
      out += l.sg
        ? `<rect class="lhc-sg-lauf" x="${(xa + 0.7).toFixed(1)}" y="136.7" width="${Math.max(1.6, w - 1.4).toFixed(1)}" height="24.6" rx="4" fill="none" stroke="#98A6BA" stroke-width="1.4" stroke-dasharray="3 2"><title>${escapeHtml(titelL)}</title></rect>`
        : `<rect x="${xa.toFixed(1)}" y="136" width="${w.toFixed(1)}" height="26" rx="4" fill="${f}"${
          l.laufend || l.angeschnitten || l.luecke ? ' opacity="0.55"' : ""
        }><title>${escapeHtml(titelL)}</title></rect>`;
    });
    // Aussentemperatur als Linie.
    const aw = jePixel(d.aussen.filter((p) => !Number.isNaN(p.v)), zuX);
    out += `<text x="${links}" y="186" font-size="11" fill="${FARBE.aussen}">${escapeHtml(this._t("aussentemperatur"))}</text>`;
    if (aw.length >= 2) {
      const aMin = kleinster(aw.map((p) => p.v));
      const aMax = groesster(aw.map((p) => p.v));
      const zuY = (v) => 228 - ((v - aMin) / (aMax - aMin || 1)) * 34;
      let pfad = "";
      aw.forEach((p, i) => {
        const x = zuX(Math.max(p.t, d.t0));
        pfad += `${i ? `H${x.toFixed(1)}V` : `M${x.toFixed(1)} `}${zuY(p.v).toFixed(1)}`;
      });
      pfad += `H${rechts}`;
      out += `<path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="2" stroke-linejoin="round"/>
        <text x="${rechts}" y="186" text-anchor="end" font-size="10.5" fill="${FARBE.aussen}">${fmt(aMin, 1)} … ${fmt(aMax, 1)} °C</text>`;
    }
    out += this._auswertungAchse(links, rechts, 248, d.t0, d.t1);
    g.innerHTML = out;

    // Ausfuehrliche Bewertung mit Begruendung und Quelle unter dem Bild.
    if (liste) {
      const saetze = [];
      if (kurzMild.length) saetze.push(tf(this._t("a_t_mild_d"), { k: kurzMild.length }));
      if (stufe === "hinweis") saetze.push(this._t("a_t_rat"));
      const legende = [
        ["kurz", "a_t_l_kurz"],
        ["gut", "a_t_l_gut"],
        ["sehrGut", "a_t_l_sehrgut"],
        ["ww", "warmwasser"],
      ]
        .map(([k, t]) => `<span class="lhc-leg"><span class="lhc-dia-farbe" style="background:${FARBE[k]}"></span><span>${escapeHtml(this._t(t))}</span></span>`)
        .concat(laeufe.some((l) => l.sg) ? `<span class="lhc-leg"><span class="lhc-dia-farbe sg"></span><span>${escapeHtml(this._t("a_sg_nicht"))}</span></span>` : "")
        .join("");
      liste.innerHTML = `
        <div class="lhc-takt-legende">${legende}</div>
        ${saetze.length ? `<p class="lhc-takt-text">${escapeHtml(saetze.join(" "))}</p>` : ""}
        <details class="lhc-quelle"><summary>${escapeHtml(this._t("a_quelle_auf"))}</summary>
          <p class="lhc-takt-quelle">${escapeHtml(this._t("a_t_quelle"))}</p></details>`;
    }
  },

  /**
   * Wann abgetaut wurde: Abtauungen als Marken ueber den Laeufen, darunter
   * die Aussentemperatur mit dem Bereich, in dem der Verdampfer am
   * haeufigsten vereist (-5 bis +5 °C, 42watt "Abtauen"), und eine Liste.
   * Bewertet wird wie in der Analyse nur die mittlere Dauer (bis 15 min).
   */
  _zeichneAbtau(g, liste, d) {
    const sr = this.shadowRoot;
    const leer = sr.getElementById("dia-leer");
    if (!d) {
      g.innerHTML = "";
      if (liste) liste.textContent = "";
      if (leer) leer.textContent = this._t("kein_verlauf");
      this._diaLeer(true);
      return;
    }
    this._auswertungHinweis(d);
    this._diaLeer(false);
    const t = (k) => this._t(k);
    if (!this._config.demo && !this._e("defrost")) {
      g.innerHTML = this._auswertungUrteil(GRAU, "info", t("a_ab_t_fehlt"), t("a_ab_d_fehlt"));
      if (liste) liste.textContent = "";
      return;
    }
    const ab = abtauungen(d);
    const ganz = ab.filter((x) => !x.vorher && !x.laeuft);
    const m = ganz.length ? ganz.reduce((s, x) => s + x.minuten, 0) / ganz.length : null;
    const temps = ab.filter((x) => x.aussen !== null).map((x) => x.aussen);
    const aMin = temps.length ? Math.min(...temps) : null;
    const aMax = temps.length ? Math.max(...temps) : null;
    const tage = Math.max((d.t1 - d.t0) / 86400000, 1);
    const unterzeile = m === null ? "" : temps.length
      ? tf(t("a_ab_d"), { n: ab.length, d: fmt(m, 0), a: fmt(aMin, 0), b: fmt(aMax, 0) })
      : tf(t("a_ab_d_ohne"), { n: ab.length, d: fmt(m, 0) });
    let out;
    if (!ab.length) out = this._auswertungUrteil(STUFE_FARBE.ok, "ok", t("a_ab_t_keine"), "");
    else if (m === null) out = this._auswertungUrteil(GRAU, "info", tf(t("a_ab_t_n"), { n: ab.length }), "");
    else if (m > 15) out = this._auswertungUrteil(STUFE_FARBE.hinweis, "warn", t("a_ab_t_lang"), unterzeile);
    else out = this._auswertungUrteil(STUFE_FARBE.ok, "ok", t("a_ab_t_ok"), unterzeile);
    out += this._auswertungKacheln(60, [
      [tage > 1.5 ? `${ab.length} · ${fmt(ab.length / tage, 1)}/d` : String(ab.length), t("a_ab_k_n")],
      [m === null ? "--" : `${fmt(m, 0)} min`, t("a_ab_k_dauer")],
      [aMin === null ? "--" : `${fmt(aMin, 0)} … ${fmt(aMax, 0)} °C`, t("a_ab_k_aussen")],
    ]);
    const links = 20;
    const rechts = DW - 20;
    const zuX = (x) => links + ((x - d.t0) / (d.t1 - d.t0 || 1)) * (rechts - links);
    const zeit = (x) => {
      const dt = new Date(x);
      const uhr = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
      try {
        return `${dt.toLocaleDateString(this._sp(), { weekday: "short", day: "2-digit", month: "2-digit" })} ${uhr}`;
      } catch {
        return `${this._zrDatum(x, false)} ${uhr}`;
      }
    };
    // Band: Verdichterlaeufe blass, Abtauungen als Marken darueber.
    out += `<text x="${links}" y="128" font-size="11" fill="#98A6BA">${escapeHtml(t("a_ab_band"))}</text>
      <rect x="${links}" y="134" width="${rechts - links}" height="30" rx="7" fill="${FARBE.leer}"/>`;
    verdichterLaeufe(d.vd, d.t0, d.t1).forEach((l) => {
      const xa = zuX(l.von);
      out += `<rect x="${xa.toFixed(1)}" y="136" width="${Math.max(1, zuX(l.bis) - xa).toFixed(1)}" height="26" rx="3" fill="${FARBE.lauf}"/>`;
    });
    ab.forEach((x) => {
      const xa = zuX(x.von);
      const titel = `${zeit(x.von)} · ${fmt(x.minuten, 0)} min${x.aussen !== null ? ` · ${fmt(x.aussen, 1)} °C` : ""} · ${t(x.ww ? "warmwasser" : "heizung")}${
        x.laeuft ? ` · ${t("a_ab_laeuft")}` : ""}`;
      out += `<rect x="${(xa - 1).toFixed(1)}" y="136" width="${Math.max(3, zuX(x.bis) - xa + 2).toFixed(1)}" height="26" rx="2" fill="${FARBE.abtau}"><title>${escapeHtml(titel)}</title></rect>`;
    });
    // Aussentemperatur mit dem Bereich -5 bis +5 °C.
    const aw = jePixel((d.aussen || []).filter((p) => !Number.isNaN(p.v)), zuX);
    out += `<text x="${links}" y="186" font-size="11" fill="${FARBE.aussen}">${escapeHtml(t("aussentemperatur"))}</text>`;
    if (aw.length >= 2) {
      const lo = kleinster(aw.map((p) => p.v));
      const hi = groesster(aw.map((p) => p.v));
      const oben = 194;
      const unten = 228;
      const zuY = (v) => unten - ((v - lo) / (hi - lo || 1)) * (unten - oben);
      const bo = Math.min(5, hi);
      const bu = Math.max(-5, lo);
      if (bo > bu) {
        out += `<rect x="${links}" y="${zuY(bo).toFixed(1)}" width="${rechts - links}" height="${Math.max(1, zuY(bu) - zuY(bo)).toFixed(1)}" fill="#98A6BA" fill-opacity="0.12"/>`;
      }
      let pfad = "";
      aw.forEach((p, i) => {
        const x = zuX(Math.max(p.t, d.t0));
        pfad += `${i ? `H${x.toFixed(1)}V` : `M${x.toFixed(1)} `}${zuY(p.v).toFixed(1)}`;
      });
      pfad += `H${rechts}`;
      out += `<path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="2" stroke-linejoin="round"/>
        <text x="${rechts}" y="186" text-anchor="end" font-size="10.5" fill="${FARBE.aussen}">${fmt(lo, 1)} … ${fmt(hi, 1)} °C</text>`;
    }
    out += this._auswertungAchse(links, rechts, 248, d.t0, d.t1);
    g.innerHTML = out;
    if (!liste) return;
    const eintrag = (zeichen, k) => `<span class="lhc-leg">${zeichen}<span>${escapeHtml(t(k))}</span></span>`;
    const legende = [
      eintrag(`<span class="lhc-dia-farbe" style="background:${FARBE.abtau}"></span>`, "a_ab_l_abtau"),
      eintrag(`<span class="lhc-dia-farbe" style="background:${FARBE.lauf}"></span>`, "a_ab_l_lauf"),
      eintrag('<span class="lhc-dia-farbe" style="background:#98A6BA;opacity:0.3"></span>', "a_ab_l_bereich"),
    ].join("");
    const zeilen = ab.slice().reverse().map((x) => {
      const zusatz = x.laeuft ? t("a_ab_laeuft") : x.vorher ? t("a_ab_vorher") : "";
      return `<tr><td>${escapeHtml(zeit(x.von))}${zusatz ? `<small>${escapeHtml(zusatz)}</small>` : ""}</td>
        <td>${fmt(x.minuten, 0)} min</td><td>${x.aussen === null ? "--" : `${fmt(x.aussen, 1)} °C`}</td>
        <td>${escapeHtml(t(x.ww ? "warmwasser" : "heizung"))}</td></tr>`;
    }).join("");
    // Wie in der Analyse: Abtauungen ueber +5 °C nur als Hinweis ohne Bewertung.
    const plus = temps.some((v) => v > 5);
    liste.innerHTML = `
      <div class="lhc-takt-legende">${legende}</div>
      ${plus ? `<p class="lhc-takt-text">${escapeHtml(t("a_ab_plus"))}</p>` : ""}
      ${ab.length ? `<div class="lhc-ww-scroll lhc-ab-liste"><table class="lhc-ww-tabelle"><thead><tr>${["a_ab_s_beginn", "a_ab_s_dauer", "a_ab_s_aussen", "a_ab_s_betrieb"]
        .map((k) => `<th>${escapeHtml(t(k))}</th>`).join("")}</tr></thead><tbody>${zeilen}</tbody></table></div>` : ""}
      <details class="lhc-quelle"><summary>${escapeHtml(t("a_quelle_auf"))}</summary>
        <p class="lhc-takt-quelle">${escapeHtml(t("a_ab_quelle"))}</p></details>`;
  },
};
