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

const HOEHE = { cop: 272, takt: 300 };

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

/** Zeitgewichteter Mittelwert einer Reihe im Zeitraum, ohne Werte bis 0. */
function mittel(reihe, von, bis, nurPositiv) {
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
    const felder = ["compressor", "three_way_valve", "cop_heating", "cop_dhw", "outside_temp"];
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
        const [vd, ventil, copH, copW, aussen] = ids.map(reihe);
        this._auswertung = { t0, t1: jetzt, vd, ventil, copH, copW, aussen };
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
    for (let t = t0; t <= t1; t += h / 4) aussen.push({ t, s: "", v: aussenBei(t) });
    [0.5, 1.6, 2.7, 3.9, 5.0, 6.2, 7.0, 8.4, 9.8, 11.5, 13.6, 15.9, 18.1, 19.4, 20.6, 21.7, 22.8].forEach((s, i) => {
      const start = t0 + s * h;
      const dauer = (s > 10 && s < 17 ? 7 + (i % 3) * 2 : 16 + (i % 4) * 4) * 60000;
      const ww = i === 6 || i === 15;
      vd.push({ t: start, s: "40", v: 40 }, { t: start + dauer, s: "0", v: 0 });
      if (ww) {
        ventil.push({ t: start, s: "1", v: 1 }, { t: start + dauer, s: "0", v: 0 });
        copW.push({ t: start, s: "2.6", v: 2.5 + (i % 2) * 0.2 }, { t: start + dauer, s: "0", v: 0 });
      } else {
        const c = 3.1 + aussenBei(start) * 0.17;
        copH.push({ t: start, s: String(c), v: c }, { t: start + dauer, s: "0", v: 0 });
      }
    });
    return { t0, t1, vd, ventil, copH, copW, aussen };
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

  /** COP je Takt mit Aussentemperatur. */
  _zeichneCop(g, liste, d, laeufe) {
    const mitCop = laeufe.filter((l) => l.cop !== null);
    const gewichtet = (ls) => {
      const dauer = ls.reduce((s, l) => s + l.minuten, 0);
      return dauer ? ls.reduce((s, l) => s + l.cop * l.minuten, 0) / dauer : null;
    };
    const heiz = mitCop.filter((l) => !l.ww);
    const ww = mitCop.filter((l) => l.ww);
    const z = (v) => (v === null ? "--" : fmt(v, 1));
    const minH = heiz.length ? kleinster(heiz.map((l) => l.cop)) : null;
    const maxH = heiz.length ? groesster(heiz.map((l) => l.cop)) : null;
    let out = this._auswertungKacheln(0, [
      [z(gewichtet(heiz)), this._t("a_cop_heiz"), FARBE.heiz],
      [z(gewichtet(ww)), this._t("a_cop_ww"), FARBE.ww],
      [z(gewichtet(mitCop)), this._t("a_cop_gesamt")],
      [minH === null ? "--" : `${fmt(minH, 1)} · ${fmt(maxH, 1)}`, this._t("a_cop_minmax")],
    ]);
    if (!mitCop.length) {
      g.innerHTML = `${out}<text x="${DW / 2}" y="140" text-anchor="middle" font-size="13" fill="#98A6BA">${escapeHtml(
        this._t("a_keine_cop")
      )}</text>`;
      if (liste) liste.textContent = "";
      return;
    }
    const links = 44;
    const rechts = DW - 52;
    const oben = 76;
    const unten = 220;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    const werte = mitCop.map((l) => l.cop);
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
    // Punkte je Takt, Groesse nach Laufzeit, Beschriftung ohne Ueberlappung.
    let zuletztX = -Infinity;
    let zuletztY = -Infinity;
    mitCop.forEach((l) => {
      const x = zuX((l.von + l.bis) / 2);
      const y = zuY(l.cop);
      const r = 4 + Math.min(9, l.minuten / 6);
      const farbe = l.ww ? FARBE.ww : FARBE.heiz;
      const titel = `${this._t(l.ww ? "warmwasser" : "heizung")} · ${fmt(l.minuten, 0)} min · COP ${fmt(l.cop, 1)}${
        l.aussen !== null ? ` · ${fmt(l.aussen, 1)} °C` : ""
      }`;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${farbe}" opacity="0.88"><title>${escapeHtml(titel)}</title></circle>`;
      // Beschriften, wenn der Punkt weit genug vom zuletzt beschrifteten liegt.
      if (x - zuletztX >= 26 || Math.abs(y - zuletztY) >= 16) {
        out += `<text x="${x.toFixed(1)}" y="${(y - r - 4).toFixed(1)}" text-anchor="middle" font-size="10" fill="#C9D3E0">${fmt(l.cop, 1)}</text>`;
        zuletztX = x;
        zuletztY = y;
      }
    });
    out += this._auswertungAchse(links, rechts, 242, d.t0);
    out += `<g font-size="11">
        <circle cx="${links}" cy="256" r="4" fill="${FARBE.heiz}"/><text x="${links + 8}" y="260" fill="#C9D3E0">${escapeHtml(this._t("heizung"))}</text>
        <circle cx="${links + 90}" cy="256" r="4" fill="${FARBE.ww}"/><text x="${links + 98}" y="260" fill="#C9D3E0">${escapeHtml(this._t("warmwasser"))}</text>
        <line x1="${links + 200}" x2="${links + 216}" y1="256" y2="256" stroke="${FARBE.aussen}" stroke-dasharray="4 3" stroke-width="1.6"/>
        <text x="${links + 222}" y="260" fill="#C9D3E0">${escapeHtml(this._t("aussentemperatur"))}</text>
        <text x="${rechts}" y="260" text-anchor="end" fill="#7E8CA0">${escapeHtml(this._t("a_cop_groesse"))}</text></g>`;
    g.innerHTML = out;
    if (liste) liste.textContent = "";
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

    // Gesamturteil nach den Richtwerten.
    let stufe = "ok";
    let titel = "a_t_ok";
    if (anteil >= 0.3 || sehrKurz.length >= 2) {
      stufe = "rot";
      titel = "a_t_viele";
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
    let out = `<g>
        <rect x="20" y="0" width="${DW - 40}" height="50" rx="12" fill="${farbe}" fill-opacity="0.12" stroke="${farbe}" stroke-opacity="0.45"/>
        <circle cx="44" cy="25" r="12" fill="none" stroke="${farbe}" stroke-width="2"/>
        ${
          stufe === "ok"
            ? `<path d="M38 25 L42.5 29.5 L50 21" fill="none" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<path d="M44 18 V27" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round"/><circle cx="44" cy="31.5" r="1.6" fill="${farbe}"/>`
        }
        <text x="66" y="21" font-size="14" font-weight="700" fill="${farbe}">${escapeHtml(this._t(titel))}</text>
        <text x="66" y="39" font-size="11.5" fill="#C9D3E0">${escapeHtml(unterzeile)}</text>
      </g>`;
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
    // Starts je Stunde: Farbe nach dem kuerzesten Lauf, der in der Stunde beginnt.
    out += `<text x="${links}" y="250" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_stunde"))}</text>`;
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
      out += `<rect x="${x.toFixed(1)}" y="256" width="${(schritt - 2).toFixed(1)}" height="14" rx="4" fill="${f}"><title>${escapeHtml(
        tf(this._t("a_t_stunde_t"), { n: imFach.length })
      )}</title></rect>`;
      if (imFach.length >= 2) {
        out += `<text x="${(x + (schritt - 2) / 2).toFixed(1)}" y="267" text-anchor="middle" font-size="10" font-weight="700" fill="#0A0E14">${imFach.length}</text>`;
      }
    }
    out += this._auswertungAchse(links, rechts, 290, d.t0);
    g.innerHTML = out;

    // Ausfuehrliche Bewertung mit Begruendung und Quelle unter dem Bild.
    if (liste) {
      const saetze = [];
      if (stufe !== "ok") saetze.push(tf(this._t("a_t_kurz_d"), { k: kurz.length, n: bewertet.length, s: sehrKurz.length }));
      if (n > 15) saetze.push(tf(this._t("a_t_starts_d"), { n }));
      const kurzT = kurz.filter((l) => l.aussen !== null);
      const restT = bewertet.filter((l) => l.minuten >= 10 && l.aussen !== null);
      if (kurzT.length && restT.length) {
        const a = kurzT.reduce((s, l) => s + l.aussen, 0) / kurzT.length;
        const b = restT.reduce((s, l) => s + l.aussen, 0) / restT.length;
        if (a - b >= 2) saetze.push(tf(this._t("a_t_mild"), { a: fmt(a, 1), b: fmt(b, 1) }));
      }
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
