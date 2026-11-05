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
 *    Pruefpunkte vorsichtig geschaetzt und blasser gezeichnet (eigene
 *    Festlegung). Ohne Datenblatt oder bei unvollstaendigen Laeufen grau.
 */
import { escapeHtml, fmt, groesster, indexBis, jePixel, kleinster, warmwasserZustand, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { DATENBLAETTER, TOLERANZ, datenblattSchaetzung } from "./datenblatt.js";
import { DW } from "./diagramme.js";
import { zeitRaster } from "./zeitraum.js";

const HOEHE = { cop: 338, takt: 372 };

const FARBE = {
  heiz: "#FF5F52",
  ww: "#4D9BFF",
  aussen: "#6BB7E8",
  kurz: "#F59E0B",
  gut: "#84CC16",
  sehrGut: "#22C55E",
  leer: "#1C2533",
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
  if (!l || l.copQuote === null || l.copQuote === undefined || l.laufend || l.angeschnitten) return null;
  return l.copQuote >= TOLERANZ ? "gut" : "unter";
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

/**
 * Zerlegt einen Zeitraum nach der Stellung des Umschaltventils in
 * Abschnitte mit ww (true = Warmwasser). Ohne Ventilverlauf gilt alles
 * als Heizen. Damit zaehlen bei einem Lauf, der ohne Verdichterstopp von
 * Warmwasser auf Heizen wechselt, die Warmwassertemperaturen nicht zum
 * Heizbetrieb.
 */
export function ventilAbschnitte(ventil, von, bis) {
  if (!ventil || !ventil.length) return [{ von, bis, ww: false }];
  const ist = (p) => warmwasserZustand(p.s) === true;
  let k = indexBis(ventil, von);
  let ww = k >= 0 ? ist(ventil[k]) : false;
  let t = von;
  const out = [];
  for (k += 1; k < ventil.length && ventil[k].t < bis; k++) {
    const neu = ist(ventil[k]);
    if (neu === ww) continue;
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
      "return_temp", "defrost", "heater_internal", "heater_external", "hk1_water", "hk2_water", "compressor_starts", "pump_flow"];
    const ids = felder.map((f) => this._e(f));
    if (!ids[0] || !this._hass || typeof this._hass.callWS !== "function") {
      this._auswertung = null;
      this._zeichneAuswertung();
      return;
    }
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: new Date(t0).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: ids.filter(Boolean),
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        // Inzwischen anderer Zeitraum gewaehlt: Antwort verwerfen.
        if (this._zrSchluessel() !== sp.k) return;
        const reihe = (id) =>
          ((antwort && id && antwort[id]) || [])
            .map((p) => ({
              t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
              s: p.s !== undefined ? p.s : p.state,
            }))
            .filter((p) => !Number.isNaN(p.t))
            .map((p) => ({ ...p, v: parseFloat(p.s) }));
        const [vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, starts, durchfluss] =
          ids.map(reihe);
        // Beginnt der Verlauf spaeter, beginnt auch die Auswertung dort.
        const erster = vd.length ? vd[0].t : t0;
        const t0e = erster - t0 > 3600000 ? Math.min(erster, jetzt - 3600000) : t0;
        this._auswertung = {
          t0: t0e, t1: jetzt, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, starts,
          durchfluss,
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
      ["vd", "ventil", "copH", "copW", "aussen", "vorlauf", "ruecklauf", "abtau", "stabIntern", "stabExtern", "kreis1", "kreis2", "durchfluss"].forEach((f) => {
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
    [3.2, 7.3, 21.2].forEach((s) => {
      abtau.push({ t: t0 + s * h, s: "1", v: 1 }, { t: t0 + s * h + 6 * 60000, s: "0", v: 0 });
    });
    for (let t = t0; t <= t1; t += h / 4) aussen.push({ t, s: "", v: aussenBei(t) });
    [0.5, 1.6, 2.7, 3.9, 5.0, 6.2, 7.0, 8.4, 9.8, 11.5, 13.6, 15.9, 18.1, 19.4, 20.6, 21.7, 22.8].forEach((s, i) => {
      const start = t0 + s * h;
      const dauer = (s > 10 && s < 17 ? 7 + (i % 3) * 2 : 16 + (i % 4) * 4) * 60000;
      const ww = i === 6 || i === 15;
      vd.push({ t: start, s: "40", v: 40 }, { t: start + dauer, s: "0", v: 0 });
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
      // COP im Demomodus: Anteil am Carnot-COP um 0,42 bis 0,46, beim
      // Warmwasser 0,40 (nachgebildete Werte, keine Messung).
      const carnot = (a, w) => (w + 273.15) / (w - a);
      if (ww) {
        ventil.push({ t: start, s: "1", v: 1 }, { t: start + dauer, s: "0", v: 0 });
        ramp(copW, 0.4 * carnot(aussenBei(start), vl));
      } else {
        ramp(copH, (0.44 + (((i * 7) % 5) - 2) * 0.01) * carnot(aussenBei(start), vl));
      }
    });
    return { t0, t1, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern, kreis1, kreis2, durchfluss };
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
    const laeuft = (p) => {
      const n = parseFloat(p.s);
      if (!Number.isNaN(n)) return n > 0;
      return zustandAn(p.s) === true;
    };
    const laeufe = [];
    let start = null;
    let angeschnitten = false;
    d.vd.forEach((p, i) => {
      const an = laeuft(p);
      if (an && start === null) {
        start = Math.max(p.t, d.t0);
        angeschnitten = i === 0 || p.t <= d.t0;
      } else if (!an && start !== null) {
        if (p.t > start) laeufe.push({ von: start, bis: p.t, angeschnitten, laufend: false });
        start = null;
      }
    });
    if (start !== null) laeufe.push({ von: start, bis: d.t1, angeschnitten, laufend: true });
    laeufe.forEach((l) => {
      l.minuten = (l.bis - l.von) / 60000;
      // Warmwasser, wenn das Ventil die meiste Zeit des Laufs dorthin stand.
      const abschnitte = ventilAbschnitte(d.ventil, l.von, l.bis);
      const wwDauer = abschnitte.filter((a) => a.ww).reduce((s, a) => s + (a.bis - a.von), 0);
      l.ww = wwDauer > (l.bis - l.von) / 2;
      l.cop = mittel(l.ww ? d.copW : d.copH, l.von, l.bis, true);
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
      // Ausserhalb der Pruefpunkte vorsichtig geschaetzt und gekennzeichnet.
      const dbl = ref && l.aussen !== null && l.vorlauf !== null ? datenblattSchaetzung(ref, l.aussen, l.vorlauf) : null;
      l.copErwartet = dbl ? dbl.wert : null;
      l.copGeschaetzt = Boolean(dbl && dbl.geschaetzt);
      l.copQuote = l.cop !== null && l.copErwartet ? l.cop / l.copErwartet : null;
      if (l.aussen === null) {
        const s = stand(d.aussen, l.von);
        l.aussen = s && !Number.isNaN(s.v) ? s.v : null;
      }
      l.bewertung = bewertung(l.minuten);
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
    if (art !== "cop" && art !== "takt") return;
    const sr = this.shadowRoot;
    const g = sr && sr.getElementById(`dia-${art}`);
    if (!g) return;
    const liste = sr.getElementById("dia-liste");
    const d = this._auswertung;
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
    const mitCop = laeufe.filter((l) => l.cop !== null);
    const ref = this._copReferenz();
    const gewichtet = (ls, feld) => {
      const auswahl = ls.filter((l) => l[feld] !== null && l[feld] !== undefined);
      const dauer = auswahl.reduce((s, l) => s + l.minuten, 0);
      return dauer ? auswahl.reduce((s, l) => s + l[feld] * l.minuten, 0) / dauer : null;
    };
    const heiz = mitCop.filter((l) => !l.ww);
    const ww = mitCop.filter((l) => l.ww);
    const z = (v) => (v === null ? "--" : fmt(v, 1));
    const minH = heiz.length ? kleinster(heiz.map((l) => l.cop)) : null;
    const maxH = heiz.length ? groesster(heiz.map((l) => l.cop)) : null;

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
      const aussen = gewichtet(bewertet, "aussen");
      const vorlauf = gewichtet(bewertet, "vorlauf");
      const teile = [tf(this._t("a_c_d_quote"), {
        p: fmt(quote * 100, 0), a: aussen === null ? "--" : fmt(aussen, 1), v: vorlauf === null ? "--" : fmt(vorlauf, 0),
      })];
      const geschaetzt = bewertet.filter((l) => l.copGeschaetzt).length;
      if (geschaetzt) teile.push(tf(this._t("a_c_d_geschaetzt"), { n: geschaetzt }));
      if (ohne) teile.push(tf(this._t("a_c_d_ohne"), { n: ohne }));
      urteil = unter.length
        ? this._auswertungUrteil(COP_FARBE.unter, "warn", tf(this._t("a_c_t_unter"), { u: unter.length, n: bewertet.length }), teile.join(" · "))
        : this._auswertungUrteil(COP_FARBE.gut, "ok", tf(this._t("a_c_t_gut"), { n: bewertet.length }), teile.join(" · "));
    }
    let out = urteil;
    out += this._auswertungKacheln(60, [
      [z(gewichtet(heiz, "cop")), this._t("a_cop_heiz"), FARBE.heiz],
      [z(gewichtet(ww, "cop")), this._t("a_cop_ww"), FARBE.ww],
      [z(gewichtet(mitCop, "cop")), this._t("a_cop_gesamt")],
      [minH === null ? "--" : `${fmt(minH, 1)} · ${fmt(maxH, 1)}`, this._t("a_cop_minmax")],
    ]);
    if (!mitCop.length) {
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
    const werte = mitCop.map((l) => l.cop).concat(mitCop.filter((l) => l.copErwartet !== null).map((l) => l.copErwartet));
    const cMax = Math.max(Math.ceil(groesster(werte)), 5);
    const zuY = (v) => unten - (Math.max(0, v) / cMax) * (unten - oben);
    for (let v = 0; v <= cMax; v++) {
      out += `<line x1="${links}" x2="${rechts}" y1="${zuY(v).toFixed(1)}" y2="${zuY(v).toFixed(1)}" stroke="#26303F"${
        v ? ' stroke-dasharray="2 5"' : ""
      }/>
        <text x="${links - 8}" y="${(zuY(v) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="#7E8CA0">${v}</text>`;
    }
    out += `<text x="${links - 8}" y="${oben - 10}" text-anchor="end" font-size="10.5" fill="#7E8CA0">COP</text>`;
    // Bei vielen Laeufen (laengere Zeitraeume) schmale Saeulen ohne Zahlen;
    // die Werte stehen im Tooltip.
    const viele = mitCop.length > 60;
    let zuletztX = -Infinity;
    mitCop.forEach((l) => {
      const xa = zuX(l.von);
      const w = Math.max(viele ? 1.5 : 5, zuX(l.bis) - xa - (viele ? 0 : 2));
      const y = zuY(l.cop);
      const stufe = copStufe(l);
      const mitStrich = l.copErwartet !== null;
      const titel = `${this._t(l.ww ? "warmwasser" : "heizung")} · ${fmt(l.minuten, 0)} min · COP ${fmt(l.cop, 1)}${
        mitStrich ? ` · ${tf(this._t(l.copGeschaetzt ? "a_c_dbl_s" : "a_c_dbl"), { c: fmt(l.copErwartet, 1) })} (${fmt(l.copQuote * 100, 0)} %)` : ""
      }${l.aussen !== null ? ` · ${fmt(l.aussen, 1)} °C` : ""}${l.vorlauf !== null ? ` · VL ${fmt(l.vorlauf, 0)} °C` : ""}`;
      const r = Math.min(3, w / 2, unten - y);
      // Gelbe Saeulen oeffnen per Klick die Analyse des Laufs.
      const klick = stufe === "unter" ? ` data-lauf="${laeufe.indexOf(l)}" class="lhc-cop-klick"` : "";
      out += `<path d="M${xa.toFixed(1)} ${unten}V${(y + r).toFixed(1)}Q${xa.toFixed(1)} ${y.toFixed(1)} ${(xa + r).toFixed(1)} ${y.toFixed(1)}H${(xa + w - r).toFixed(1)}Q${(xa + w).toFixed(1)} ${y.toFixed(1)} ${(xa + w).toFixed(1)} ${(y + r).toFixed(1)}V${unten}Z"
                    fill="${stufe ? COP_FARBE[stufe] : NEUTRAL}"${l.laufend || l.angeschnitten ? ' opacity="0.55"' : stufe && l.copGeschaetzt ? ' fill-opacity="0.55"' : ""}${klick}><title>${escapeHtml(titel)}</title></path>`;
      if (mitStrich) {
        const ye = zuY(l.copErwartet).toFixed(1);
        const ueber = viele ? 0 : 3;
        out += `<line x1="${(xa - ueber).toFixed(1)}" x2="${(xa + w + ueber).toFixed(1)}" y1="${ye}" y2="${ye}"
                      stroke="#E8EDF4" stroke-width="${viele ? 1.5 : 2.5}" stroke-linecap="round" pointer-events="none"/>`;
      }
      // Spur darunter: rot Heizen, blau Warmwasser.
      out += `<rect x="${xa.toFixed(1)}" y="${unten + 5}" width="${w.toFixed(1)}" height="5" rx="2" fill="${l.ww ? FARBE.ww : FARBE.heiz}"/>`;
      // Zahlen ueber Saeule und Vergleichsstrich, solange genug Abstand bleibt.
      if (!viele && xa - zuletztX >= 26) {
        const yText = Math.min(y, mitStrich ? zuY(l.copErwartet) : y) - 6;
        out += `<text x="${(xa + w / 2).toFixed(1)}" y="${yText.toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#E8EDF4" pointer-events="none">${fmt(l.cop, 1)}</text>`;
        zuletztX = xa;
      }
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
      const legende = (ref
        ? [
          `<span class="lhc-dia-farbe" style="background:${COP_FARBE.gut}"></span><span>${escapeHtml(this._t("a_c_l_gut"))}</span>`,
          `<span class="lhc-dia-farbe" style="background:${COP_FARBE.unter}"></span><span>${escapeHtml(this._t("a_c_l_unter"))}</span>`,
          `<span class="lhc-dia-farbe" style="background:${COP_FARBE.gut};opacity:0.55"></span><span>${escapeHtml(this._t("a_c_l_geschaetzt"))}</span>`,
          `<span class="lhc-dia-farbe" style="background:var(--c-6b7a90)"></span><span>${escapeHtml(this._t("a_c_l_ohne"))}</span>`,
          `<span class="lhc-dia-strich"></span><span>${escapeHtml(this._t("a_c_vergleich"))}</span>`,
        ]
        : [`<span class="lhc-dia-farbe" style="background:var(--c-6b7a90)"></span><span>${escapeHtml(this._t("a_c_saeule"))}</span>`])
        .concat(
          `<span class="lhc-dia-farbe flach" style="background:${FARBE.heiz}"></span><span>${escapeHtml(this._t("heizung"))}</span>`,
          `<span class="lhc-dia-farbe flach" style="background:${FARBE.ww}"></span><span>${escapeHtml(this._t("warmwasser"))}</span>`
        )
        .join("");
      // Ein Knopf statt einer Liste: Die Analyse beginnt beim schlechtesten
      // gelben Lauf, im Fenster wird zwischen den gelben Laeufen geblaettert.
      const reihe = unter.slice().sort((x, y) => x.copQuote - y.copQuote);
      this._copReihe = reihe;
      liste.innerHTML = `
        <div class="lhc-takt-legende">${legende}</div>
        ${reihe.length ? `<button type="button" class="lhc-an-knopf lhc-cop-analyse" id="cop-analyse">${escapeHtml(tf(this._t("a_c_analysieren_n"), { n: reihe.length }))}</button>` : ""}
        <p class="lhc-takt-quelle">${escapeHtml(this._t(ref ? "a_c_quelle" : "a_c_quelle_o"))}</p>`;
      const knopf = liste.querySelector("#cop-analyse");
      if (knopf) knopf.addEventListener("click", () => this._zeigeLaufAnalyse(reihe[0]));
    }
  },

  /** Taktband mit Bewertung, Aussentemperatur und Stundenampel. */
  _zeichneTakt(g, liste, d, laeufe) {
    const bewertet = laeufe.filter((l) => !l.laufend && !l.angeschnitten);
    const n = laeufe.filter((l) => !l.angeschnitten).length;
    const kurz = bewertet.filter((l) => l.minuten < 10);
    const mLauf = bewertet.length ? bewertet.reduce((s, l) => s + l.minuten, 0) / bewertet.length : null;
    const pausen = [];
    for (let i = 1; i < laeufe.length; i++) pausen.push((laeufe[i].von - laeufe[i - 1].bis) / 60000);
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
    out += this._auswertungKacheln(60, [
      [tage > 1.5 ? `${n} · ${fmt(jeTag, 0)}/d` : String(n), this._t("a_t_starts_k")],
      [mLauf === null ? "--" : `${fmt(mLauf, 0)} min`, this._t("a_t_lauf")],
      [mPause === null ? "--" : `${fmt(mPause, 0)} min`, this._t("a_t_pause")],
      [String(kurz.length), this._t("a_t_kurz_k"), kurz.length && stufe ? STUFE_FARBE[stufe] : "#E8EDF4"],
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
      }`;
      out += `<rect x="${xa.toFixed(1)}" y="136" width="${w.toFixed(1)}" height="26" rx="4" fill="${f}"${
        l.laufend || l.angeschnitten ? ' opacity="0.55"' : ""
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
    // Laeufe nach Aussentemperatur in vier Bereichen.
    out += `<text x="${links}" y="252" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_baender"))}</text>`;
    const baender = [
      [-Infinity, 0, "a_t_b1"],
      [0, 5, "a_t_b2"],
      [5, 10, "a_t_b3"],
      [10, Infinity, "a_t_b4"],
    ];
    const bAbstand = 8;
    const bBreite = (rechts - links - bAbstand * 3) / 4;
    baender.forEach(([von, bis, text], i) => {
      const im = bewertet.filter((l) => l.aussen !== null && l.aussen >= von && l.aussen < bis);
      // Gleiche Stufen wie oben, je Bereich der Aussentemperatur.
      const tb = taktStufe(im);
      const f = tb ? STUFE_FARBE[tb.stufe] : "#3A4557";
      const x = links + i * (bBreite + bAbstand);
      const zeile = tb
        ? tf(this._t("a_t_b_zeile"), { n: im.length, d: fmt(tb.mittel, 0), k: tb.kurz })
        : this._t("a_t_b_leer");
      out += `<g><rect x="${x.toFixed(1)}" y="258" width="${bBreite.toFixed(1)}" height="42" rx="9" fill="#1C2533"/>
        <rect x="${x.toFixed(1)}" y="258" width="5" height="42" rx="2.5" fill="${f}"/>
        <text x="${(x + 13).toFixed(1)}" y="275" font-size="12" font-weight="700" fill="#E8EDF4">${escapeHtml(this._t(text))}</text>
        <text x="${(x + 13).toFixed(1)}" y="291" font-size="10.5" fill="#98A6BA">${escapeHtml(zeile)}</text></g>`;
    });

    // Starts je Stunde: Farbe nach dem kuerzesten Lauf, der in der Stunde beginnt.
    // Starts je Fach: 24 Stunden je Stunde, laenger je 3 Stunden, Tag, Woche.
    const raster = zeitRaster(d.t0, d.t1);
    const fachText = { stunde: "a_t_stunde", drei: "a_t_f_drei", tag: "a_t_f_tag", woche: "a_t_f_woche", monat: "a_t_f_monat" }[raster.art];
    out += `<text x="${links}" y="322" font-size="11" fill="#98A6BA">${escapeHtml(this._t(fachText))}</text>`;
    const rang = { kurz: 0, gut: 1, sehrGut: 2 };
    const nF = raster.grenzen.length - 1;
    for (let i = 0; i < nF; i++) {
      const von = raster.grenzen[i];
      const bis = raster.grenzen[i + 1];
      const imFach = laeufe.filter((l) => !l.angeschnitten && l.von >= von && l.von < bis);
      let f = FARBE.leer;
      if (imFach.length) {
        const schlecht = imFach.reduce((a, l) => (rang[l.bewertung] < rang[a.bewertung] ? l : a), imFach[0]);
        f = FARBE[schlecht.bewertung];
      }
      const xa = links + ((von - d.t0) / (d.t1 - d.t0 || 1)) * (rechts - links) + 1;
      const xb = links + ((bis - d.t0) / (d.t1 - d.t0 || 1)) * (rechts - links) - 1;
      const w = Math.max(1, xb - xa);
      const zeitText = raster.art === "stunde" ? "" : `${this._zrMarke(von, d.t1 - d.t0)} · `;
      out += `<rect x="${xa.toFixed(1)}" y="328" width="${w.toFixed(1)}" height="14" rx="4" fill="${f}"><title>${escapeHtml(
        zeitText + tf(this._t("a_t_stunde_t"), { n: imFach.length })
      )}</title></rect>`;
      if (imFach.length >= 2 && w >= String(imFach.length).length * 6 + 4) {
        out += `<text x="${(xa + w / 2).toFixed(1)}" y="339" text-anchor="middle" font-size="10" font-weight="700" fill="#0A0E14">${imFach.length}</text>`;
      }
    }
    out += this._auswertungAchse(links, rechts, 362, d.t0, d.t1);
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
      ]
        .map(([k, t]) => `<span class="lhc-dia-farbe" style="background:${FARBE[k]}"></span><span>${escapeHtml(this._t(t))}</span>`)
        .concat(`<span class="lhc-dia-farbe" style="background:${FARBE.ww}"></span><span>${escapeHtml(this._t("warmwasser"))}</span>`)
        .join("");
      liste.innerHTML = `
        <div class="lhc-takt-legende">${legende}</div>
        ${saetze.length ? `<p class="lhc-takt-text">${escapeHtml(saetze.join(" "))}</p>` : ""}
        <p class="lhc-takt-quelle">${escapeHtml(this._t("a_t_quelle"))}</p>`;
    }
  },
};
