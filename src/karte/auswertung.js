/**
 * Zwei Auswertungen im Diagrammfenster: COP je Takt der letzten 24 Stunden
 * und die Taktung der Waermepumpe mit Bewertung.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Beide beruhen auf denselben Verlaeufen: Verdichter, Umschaltventil,
 * COP Heizen, COP Warmwasser und Aussentemperatur.
 *
 * Richtwerte der Taktung:
 *  - Laufzeit je Start 10 bis 20 Minuten (Bundesverband Waermepumpe),
 *    unter etwa 6 Minuten sinkt die Effizienz messbar.
 *  - Feldtest Fraunhofer WP-QS: bis etwa 2.000 Starts im Jahr unauffaellig,
 *    ab 5.500 pruefen, das sind im Mittel rund 15 Starts am Tag.
 * Quelle der Zusammenstellung: 42watt.de, "Taktung der Waermepumpe".
 * Die Schwellen fuer "einige" und "viele" kurze Laeufe (30 Prozent, zwei
 * Laeufe unter 6 Minuten) sind eigene Festlegungen der Karte.
 */
import { escapeHtml, fmt, groesster, kleinster, warmwasserZustand, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { DW } from "./diagramme.js";

const HOEHE = { cop: 326, takt: 372 };

const FARBE = {
  heiz: "#FF5F52",
  ww: "#4D9BFF",
  aussen: "#6BB7E8",
  sehrKurz: "#EF4444",
  kurz: "#F59E0B",
  gut: "#84CC16",
  sehrGut: "#22C55E",
  leer: "#1C2533",
};

/** Bewertung einer Laufzeit in Minuten nach den Richtwerten. */
function bewertung(minuten) {
  if (minuten < 6) return "sehrKurz";
  if (minuten < 10) return "kurz";
  if (minuten < 20) return "gut";
  return "sehrGut";
}

/**
 * Erwarteter COP aus Aussen- und Vorlauftemperatur: Carnot-COP mal Guetegrad.
 * 0,42 ist der Mittelwert, der sich aus dem Datenblatt der Panasonic
 * Aquarea T-CAP M 12 kW (WH-WXG12ME5/ME8) an den Pruefpunkten A7, A2, A-7
 * mit W35 und W55 ergibt (0,38 bis 0,47). 42watt nennt fuer reale Geraete
 * rund 0,45.
 */
const GUETEGRAD = 0.42;

export function erwarteterCop(aussen, vorlauf) {
  if (aussen === null || vorlauf === null) return null;
  const hub = vorlauf - aussen;
  if (hub < 5) return null;
  return (GUETEGRAD * (vorlauf + 273.15)) / hub;
}

/** Einordnung des gemessenen COP gegenueber dem erwarteten. */
export function copStufe(quote) {
  if (quote === null) return null;
  if (quote >= 1) return "gut";
  if (quote >= 0.85) return "rahmen";
  if (quote >= 0.7) return "unter";
  return "schlecht";
}

const COP_FARBE = { gut: "#22C55E", rahmen: "#84CC16", unter: "#F59E0B", schlecht: "#EF4444" };

/** Zeitgewichteter Mittelwert einer Reihe im Zeitraum, ohne Werte bis 0. */
export function mittel(reihe, von, bis, nurPositiv) {
  let summe = 0;
  let dauer = 0;
  for (let i = 0; i < reihe.length; i++) {
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

/** Wert einer Reihe zu einem Zeitpunkt (letzter Stand davor). */
function stand(reihe, t) {
  let s = null;
  for (const p of reihe) {
    if (p.t > t) break;
    s = p;
  }
  return s;
}

export const auswertungKarte = {
  _auswertungHoehe(art) {
    return HOEHE[art] || 220;
  },

  /** Holt die Verlaeufe hoechstens alle fuenf Minuten. */
  _holeAuswertung() {
    const jetzt = Date.now();
    if (this._auswertungZeit && jetzt - this._auswertungZeit < 300000) return;
    this._auswertungZeit = jetzt;
    const t0 = jetzt - 86400000;
    if (this._config.demo) {
      this._auswertung = this._auswertungDemo(t0, jetzt);
      this._zeichneAuswertung();
      return;
    }
    const felder = ["compressor", "three_way_valve", "cop_heating", "cop_dhw", "outside_temp", "flow_temp",
      "return_temp", "defrost", "heater_internal", "heater_external"];
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
        const reihe = (id) =>
          ((antwort && id && antwort[id]) || [])
            .map((p) => ({
              t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
              s: p.s !== undefined ? p.s : p.state,
            }))
            .filter((p) => !Number.isNaN(p.t))
            .map((p) => ({ ...p, v: parseFloat(p.s) }));
        const [vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern] = ids.map(reihe);
        this._auswertung = { t0, t1: jetzt, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern };
        this._zeichneAuswertung();
      })
      .catch(() => {
        this._auswertung = null;
        this._zeichneAuswertung();
      });
  },

  /** Nachgebildete Daten fuer den Demomodus. */
  _auswertungDemo(t0, t1) {
    const h = 3600000;
    const aussenBei = (t) => 5.5 - 3.5 * Math.cos(((t - t0) / h - 14) / 24 * 2 * Math.PI);
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
      if (ww) {
        ventil.push({ t: start, s: "1", v: 1 }, { t: start + dauer, s: "0", v: 0 });
        copW.push({ t: start, s: "2.6", v: 2.5 + (i % 2) * 0.2 }, { t: start + dauer, s: "0", v: 0 });
      } else {
        const c = 3.1 + aussenBei(start) * 0.17;
        copH.push({ t: start, s: String(c), v: c }, { t: start + dauer, s: "0", v: 0 });
      }
    });
    return { t0, t1, vd, ventil, copH, copW, aussen, vorlauf, ruecklauf, abtau, stabIntern, stabExtern };
  },

  /**
   * Zerlegt den Verdichterverlauf in Laeufe mit Dauer, Art, COP und
   * Aussentemperatur. Ein schon zu Beginn laufender oder noch laufender
   * Lauf wird gekennzeichnet und nicht bewertet.
   */
  _auswertungLaeufe(d) {
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
      let ww = 0;
      const schritte = 12;
      for (let k = 0; k < schritte; k++) {
        const t = l.von + ((k + 0.5) / schritte) * (l.bis - l.von);
        const s = stand(d.ventil, t);
        if (s && warmwasserZustand(s.s) === true) ww++;
      }
      l.ww = ww > schritte / 2;
      l.cop = mittel(l.ww ? d.copW : d.copH, l.von, l.bis, true);
      l.aussen = mittel(d.aussen, l.von, l.bis, false);
      // Vorlauf erst nach den ersten Minuten, solange er noch steigt,
      // waere er zu niedrig fuer den Vergleich.
      const ab = Math.min(l.von + 5 * 60000, (l.von + l.bis) / 2);
      l.vorlauf = d.vorlauf ? mittel(d.vorlauf, ab, l.bis, true) : null;
      l.ruecklauf = d.ruecklauf ? mittel(d.ruecklauf, ab, l.bis, true) : null;
      l.copErwartet = erwarteterCop(l.aussen, l.vorlauf);
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

  /** Kleine Zeitachse mit Uhrzeiten. */
  _auswertungAchse(links, rechts, y, t0) {
    let out = "";
    for (let i = 0; i <= 4; i++) {
      const x = links + (i / 4) * (rechts - links);
      const d = new Date(t0 + (i * 86400000) / 4);
      const text = i === 4 ? this._t("jetzt") : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const anker = i === 0 ? "start" : i === 4 ? "end" : "middle";
      out += `<text x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}" font-size="11" fill="#7E8CA0">${escapeHtml(text)}</text>`;
    }
    return out;
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

  /** Kasten oben mit Symbol, Titel und Unterzeile in der Farbe der Stufe. */
  _auswertungUrteil(farbe, gut, titel, unterzeile) {
    return `<g>
        <rect x="20" y="0" width="${DW - 40}" height="50" rx="12" fill="${farbe}" fill-opacity="0.12" stroke="${farbe}" stroke-opacity="0.45"/>
        <circle cx="44" cy="25" r="12" fill="none" stroke="${farbe}" stroke-width="2"/>
        ${
          gut
            ? `<path d="M38 25 L42.5 29.5 L50 21" fill="none" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<path d="M44 18 V27" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round"/><circle cx="44" cy="31.5" r="1.6" fill="${farbe}"/>`
        }
        <text x="66" y="21" font-size="14" font-weight="700" fill="${farbe}">${escapeHtml(titel)}</text>
        <text x="66" y="39" font-size="11.5" fill="#C9D3E0">${escapeHtml(unterzeile)}</text>
      </g>`;
  },

  /**
   * COP je Takt mit Aussentemperatur und Bewertung: Jeder Lauf wird mit
   * dem COP verglichen, der bei seiner Aussen- und Vorlauftemperatur zu
   * erwarten ist.
   */
  _zeichneCop(g, liste, d, laeufe) {
    const mitCop = laeufe.filter((l) => l.cop !== null);
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

    // Gesamturteil aus dem nach Laufzeit gewichteten Verhaeltnis.
    const bewertbar = mitCop.filter((l) => l.copQuote !== null);
    const quote = gewichtet(bewertbar, "copQuote");
    let urteil;
    if (!mitCop.length) {
      urteil = this._auswertungUrteil("#7E8CA0", false, this._t("a_keine_cop"), "");
    } else if (quote === null) {
      urteil = this._auswertungUrteil("#7E8CA0", false, this._t("a_c_ohne_t"), this._t("a_c_ohne_d"));
    } else {
      const stufe = copStufe(quote);
      const aussen = gewichtet(bewertbar, "aussen");
      const vorlauf = gewichtet(bewertbar, "vorlauf");
      urteil = this._auswertungUrteil(
        COP_FARBE[stufe],
        stufe === "gut" || stufe === "rahmen",
        this._t(`a_c_${stufe}`),
        tf(this._t("a_c_unter_d"), {
          p: fmt(quote * 100, 0),
          a: aussen === null ? "--" : fmt(aussen, 1),
          v: vorlauf === null ? "--" : fmt(vorlauf, 0),
        })
      );
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
    const links = 44;
    const rechts = DW - 52;
    const oben = 136;
    const unten = 274;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    const werte = mitCop.map((l) => l.cop).concat(bewertbar.map((l) => l.copErwartet));
    const cMin = Math.min(Math.floor(kleinster(werte)), 2);
    const cMax = Math.max(Math.ceil(groesster(werte)), 5);
    const zuY = (v) => unten - ((v - cMin) / (cMax - cMin || 1)) * (unten - oben);
    for (let v = cMin; v <= cMax; v++) {
      out += `<line x1="${links}" x2="${rechts}" y1="${zuY(v).toFixed(1)}" y2="${zuY(v).toFixed(1)}" stroke="#26303F" stroke-dasharray="2 5"/>
        <text x="${links - 8}" y="${(zuY(v) + 4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="#7E8CA0">${v}</text>`;
    }
    out += `<text x="${links - 8}" y="${oben - 10}" text-anchor="end" font-size="10.5" fill="#7E8CA0">COP</text>`;
    // Aussentemperatur gestrichelt mit eigener Skala rechts.
    const aw = d.aussen.filter((p) => !Number.isNaN(p.v));
    if (aw.length >= 2) {
      const aMin = Math.floor(kleinster(aw.map((p) => p.v))) - 1;
      const aMax = Math.ceil(groesster(aw.map((p) => p.v))) + 1;
      const zuYa = (v) => unten - ((v - aMin) / (aMax - aMin || 1)) * (unten - oben);
      let pfad = "";
      aw.forEach((p, i) => {
        const x = zuX(Math.max(p.t, d.t0));
        pfad += `${i ? `H${x.toFixed(1)}V` : `M${x.toFixed(1)} `}${zuYa(p.v).toFixed(1)}`;
      });
      pfad += `H${rechts}`;
      out += `<path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="1.6" stroke-dasharray="4 4" opacity="0.75"/>
        <text x="${rechts + 8}" y="${(zuYa(aMax) + 4).toFixed(1)}" font-size="10.5" fill="${FARBE.aussen}">${aMax} °C</text>
        <text x="${rechts + 8}" y="${(zuYa(aMin) + 4).toFixed(1)}" font-size="10.5" fill="${FARBE.aussen}">${aMin} °C</text>`;
    }
    // Je Lauf: erwarteter COP als kurzer Strich, gemessener als Punkt mit
    // Ring in der Farbe der Bewertung.
    let zuletztX = -Infinity;
    let zuletztY = -Infinity;
    mitCop.forEach((l) => {
      const x = zuX((l.von + l.bis) / 2);
      const y = zuY(l.cop);
      const r = 4 + Math.min(9, l.minuten / 6);
      const farbe = l.ww ? FARBE.ww : FARBE.heiz;
      const stufe = copStufe(l.copQuote);
      if (l.copErwartet !== null) {
        const ye = zuY(l.copErwartet);
        out += `<line x1="${(x - r - 3).toFixed(1)}" x2="${(x + r + 3).toFixed(1)}" y1="${ye.toFixed(1)}" y2="${ye.toFixed(1)}"
                      stroke="#C9D3E0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
          <line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${ye.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#C9D3E0" stroke-width="1" opacity="0.35"/>`;
      }
      const titel = `${this._t(l.ww ? "warmwasser" : "heizung")} · ${fmt(l.minuten, 0)} min · COP ${fmt(l.cop, 1)}${
        l.copErwartet !== null ? ` · ${tf(this._t("a_c_erwartet"), { c: fmt(l.copErwartet, 1) })}` : ""
      }${l.aussen !== null ? ` · ${fmt(l.aussen, 1)} °C` : ""}${l.vorlauf !== null ? ` · VL ${fmt(l.vorlauf, 0)} °C` : ""}`;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${farbe}" opacity="0.88"
                      ${stufe ? `stroke="${COP_FARBE[stufe]}" stroke-width="2.5"` : ""}><title>${escapeHtml(titel)}</title></circle>`;
      if (x - zuletztX >= 26 || Math.abs(y - zuletztY) >= 16) {
        out += `<text x="${x.toFixed(1)}" y="${(y - r - 5).toFixed(1)}" text-anchor="middle" font-size="10" fill="#C9D3E0">${fmt(l.cop, 1)}</text>`;
        zuletztX = x;
        zuletztY = y;
      }
    });
    out += this._auswertungAchse(links, rechts, 296, d.t0);
    out += `<g font-size="11">
        <circle cx="${links}" cy="312" r="4" fill="${FARBE.heiz}"/><text x="${links + 8}" y="316" fill="#C9D3E0">${escapeHtml(this._t("heizung"))}</text>
        <circle cx="${links + 86}" cy="312" r="4" fill="${FARBE.ww}"/><text x="${links + 94}" y="316" fill="#C9D3E0">${escapeHtml(this._t("warmwasser"))}</text>
        <line x1="${links + 190}" x2="${links + 206}" y1="312" y2="312" stroke="#C9D3E0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <text x="${links + 212}" y="316" fill="#C9D3E0">${escapeHtml(this._t("a_c_erwartung"))}</text>
        <line x1="${links + 320}" x2="${links + 336}" y1="312" y2="312" stroke="${FARBE.aussen}" stroke-dasharray="4 3" stroke-width="1.6"/>
        <text x="${links + 342}" y="316" fill="#C9D3E0">${escapeHtml(this._t("aussentemperatur"))}</text></g>`;
    g.innerHTML = out;

    if (liste) {
      const stufen = [
        ["gut", "a_c_l_gut"],
        ["rahmen", "a_c_l_rahmen"],
        ["unter", "a_c_l_unter"],
        ["schlecht", "a_c_l_schlecht"],
      ];
      const legende = stufen
        .map(([k, t]) => `<span class="lhc-dia-farbe" style="background:${COP_FARBE[k]}"></span><span>${escapeHtml(this._t(t))}</span>`)
        .join("");
      // Je Stufe zaehlen, wie viele Laeufe dort liegen, getrennt nach Art.
      const saetze = [];
      const schwach = bewertbar.filter((l) => l.copQuote < 0.85);
      if (bewertbar.length) {
        saetze.push(tf(this._t("a_c_zaehl"), { k: bewertbar.length - schwach.length, n: bewertbar.length }));
        const schwachWw = schwach.filter((l) => l.ww).length;
        if (schwach.length && schwachWw === schwach.length) saetze.push(this._t("a_c_nur_ww"));
        else if (schwach.length) saetze.push(this._t("a_c_rat"));
      }
      if (mitCop.length > bewertbar.length) saetze.push(this._t("a_c_ohne_d"));
      liste.innerHTML = `
        <div class="lhc-takt-legende">${legende}</div>
        ${saetze.length ? `<p class="lhc-takt-text">${escapeHtml(saetze.join(" "))}</p>` : ""}
        <p class="lhc-takt-quelle">${escapeHtml(this._t("a_c_quelle"))}</p>`;
    }
  },

  /** Taktband mit Bewertung, Aussentemperatur und Stundenampel. */
  _zeichneTakt(g, liste, d, laeufe) {
    const bewertet = laeufe.filter((l) => !l.laufend && !l.angeschnitten);
    const n = laeufe.filter((l) => !l.angeschnitten).length;
    const kurz = bewertet.filter((l) => l.minuten < 10);
    const sehrKurz = bewertet.filter((l) => l.minuten < 6);
    const mLauf = bewertet.length ? bewertet.reduce((s, l) => s + l.minuten, 0) / bewertet.length : null;
    const pausen = [];
    for (let i = 1; i < laeufe.length; i++) pausen.push((laeufe[i].von - laeufe[i - 1].bis) / 60000);
    const mPause = pausen.length ? pausen.reduce((s, p) => s + p, 0) / pausen.length : null;
    const anteil = bewertet.length ? kurz.length / bewertet.length : 0;

    // Kurze Laeufe nach Aussentemperatur: unter 5 °C ist die Heizlast hoch,
    // ab 10 °C liegt sie oft unter der kleinsten Leistung der Waermepumpe.
    const kurzKalt = kurz.filter((l) => l.aussen !== null && l.aussen < 5);
    const kurzMild = kurz.filter((l) => l.aussen !== null && l.aussen >= 10);

    // Gesamturteil nach den Richtwerten.
    let stufe = "ok";
    let titel = "a_t_ok";
    if (anteil >= 0.3 || sehrKurz.length >= 2) {
      if (kurzKalt.length >= Math.ceil(kurz.length / 2)) {
        stufe = "rot";
        titel = "a_t_kalt";
      } else if (kurzMild.length >= Math.ceil(kurz.length / 2)) {
        stufe = "gelb";
        titel = "a_t_mild_t";
      } else {
        stufe = "rot";
        titel = "a_t_viele";
      }
    } else if (n > 15) {
      stufe = "gelb";
      titel = "a_t_starts";
    } else if (kurz.length) {
      stufe = "gelb";
      titel = "a_t_einige";
    }
    const farbe = stufe === "rot" ? "#EF4444" : stufe === "gelb" ? "#F59E0B" : "#22C55E";
    const unterzeile =
      stufe === "ok"
        ? tf(this._t("a_t_ok_d"), { n, d: fmt(mLauf || 0, 0) })
        : tf(this._t("a_t_kurz_d"), { k: kurz.length, n: bewertet.length, s: sehrKurz.length });
    let out = this._auswertungUrteil(farbe, stufe === "ok", this._t(titel), unterzeile);
    out += this._auswertungKacheln(60, [
      [String(n), this._t("a_t_starts_k")],
      [mLauf === null ? "--" : `${fmt(mLauf, 0)} min`, this._t("a_t_lauf")],
      [mPause === null ? "--" : `${fmt(mPause, 0)} min`, this._t("a_t_pause")],
      [String(kurz.length), this._t("a_t_kurz_k"), kurz.length ? "#F59E0B" : "#E8EDF4"],
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
    const aw = d.aussen.filter((p) => !Number.isNaN(p.v));
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
      const kurzIm = im.filter((l) => l.minuten < 10).length;
      const mittelIm = im.length ? im.reduce((s2, l) => s2 + l.minuten, 0) / im.length : null;
      const anteilIm = im.length ? kurzIm / im.length : 0;
      let f = "#3A4557";
      if (im.length) {
        if (!kurzIm) f = FARBE.sehrGut;
        else if (anteilIm >= 0.3) f = von >= 10 ? FARBE.kurz : FARBE.sehrKurz;
        else f = FARBE.kurz;
      }
      const x = links + i * (bBreite + bAbstand);
      const zeile = im.length
        ? tf(this._t("a_t_b_zeile"), { n: im.length, d: fmt(mittelIm, 0), k: kurzIm })
        : this._t("a_t_b_leer");
      out += `<g><rect x="${x.toFixed(1)}" y="258" width="${bBreite.toFixed(1)}" height="42" rx="9" fill="#1C2533"/>
        <rect x="${x.toFixed(1)}" y="258" width="5" height="42" rx="2.5" fill="${f}"/>
        <text x="${(x + 13).toFixed(1)}" y="275" font-size="12" font-weight="700" fill="#E8EDF4">${escapeHtml(this._t(text))}</text>
        <text x="${(x + 13).toFixed(1)}" y="291" font-size="10.5" fill="#98A6BA">${escapeHtml(zeile)}</text></g>`;
    });

    // Starts je Stunde: Farbe nach dem kuerzesten Lauf, der in der Stunde beginnt.
    out += `<text x="${links}" y="322" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_stunde"))}</text>`;
    const schritt = (rechts - links) / 24;
    const rang = { sehrKurz: 0, kurz: 1, gut: 2, sehrGut: 3 };
    for (let i = 0; i < 24; i++) {
      const von = d.t0 + i * 3600000;
      const imFach = laeufe.filter((l) => !l.angeschnitten && l.von >= von && l.von < von + 3600000);
      let f = FARBE.leer;
      if (imFach.length) {
        const schlecht = imFach.reduce((a, l) => (rang[l.bewertung] < rang[a.bewertung] ? l : a), imFach[0]);
        f = FARBE[schlecht.bewertung];
      }
      const x = links + i * schritt + 1;
      out += `<rect x="${x.toFixed(1)}" y="328" width="${(schritt - 2).toFixed(1)}" height="14" rx="4" fill="${f}"><title>${escapeHtml(
        tf(this._t("a_t_stunde_t"), { n: imFach.length })
      )}</title></rect>`;
      if (imFach.length >= 2) {
        out += `<text x="${(x + (schritt - 2) / 2).toFixed(1)}" y="339" text-anchor="middle" font-size="10" font-weight="700" fill="#0A0E14">${imFach.length}</text>`;
      }
    }
    out += this._auswertungAchse(links, rechts, 362, d.t0);
    g.innerHTML = out;

    // Ausfuehrliche Bewertung mit Begruendung und Quelle unter dem Bild.
    if (liste) {
      const saetze = [];
      if (stufe !== "ok") saetze.push(tf(this._t("a_t_kurz_d"), { k: kurz.length, n: bewertet.length, s: sehrKurz.length }));
      if (n > 15) saetze.push(tf(this._t("a_t_starts_d"), { n }));
      if (kurzKalt.length) saetze.push(tf(this._t("a_t_kalt_d"), { k: kurzKalt.length }));
      if (kurzMild.length) saetze.push(tf(this._t("a_t_mild_d"), { k: kurzMild.length }));
      if (stufe !== "ok") saetze.push(this._t("a_t_rat"));
      const legende = [
        ["sehrKurz", "a_t_l_sehrkurz"],
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
