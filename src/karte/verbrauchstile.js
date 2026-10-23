/**
 * Darstellungen des Verbrauchs der letzten 24 Stunden: Balken je Stunde,
 * Ring mit Taktband und leuchtende Linie mit Taktmarken.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Alle drei bekommen dieselben Daten: die Punkte des Leistungsverlaufs und
 * je Punkt die Betriebsart (heiz, ww, standby oder lauf, wenn ohne
 * Ventilverlauf nicht klar ist, wofuer gearbeitet wurde).
 */
import { escapeHtml, fmt, groesster } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";

/** Farben je Betriebsart, wie in der bisherigen Linie. */
export const VERBRAUCH_FARBEN = {
  heiz: "#FF5F52",
  ww: "#4D9BFF",
  lauf: "#98A6BA",
  standby: "#3A4557",
};

/** Reihenfolge beim Stapeln und in den Kennzahlen. */
const ARTEN = ["standby", "lauf", "heiz", "ww"];

export const VERBRAUCH_STILE = ["balken", "takte", "leuchten", "linie"];

/** Rechteck mit oben abgerundeten Ecken als Pfad. */
function obenRund(x, y, b, h, r) {
  const rr = Math.max(0, Math.min(r, b / 2, h));
  return `M${x.toFixed(1)} ${(y + h).toFixed(1)}V${(y + rr).toFixed(1)}` +
    `Q${x.toFixed(1)} ${y.toFixed(1)} ${(x + rr).toFixed(1)} ${y.toFixed(1)}` +
    `H${(x + b - rr).toFixed(1)}Q${(x + b).toFixed(1)} ${y.toFixed(1)} ${(x + b).toFixed(1)} ${(y + rr).toFixed(1)}` +
    `V${(y + h).toFixed(1)}Z`;
}

export const verbrauchStileKarte = {
  /** Gewaehlter Stil, unbekannte Werte fallen auf die Balken zurueck. */
  _verbrauchStil() {
    const s = this._config.history_style;
    return VERBRAUCH_STILE.includes(s) ? s : "balken";
  },

  /**
   * Zerlegt den Verlauf in Teilstuecke mit Energie und Betriebsart und
   * fasst zusammenhaengenden Betrieb zu Takten zusammen.
   * faktor rechnet die Leistung in Kilowatt um.
   */
  _verbrauchAuswerten(daten, ziele, faktor) {
    const summe = { heiz: 0, ww: 0, lauf: 0, standby: 0 };
    const stuecke = [];
    for (let i = 1; i < daten.length; i++) {
      const a = daten[i - 1];
      const b = daten[i];
      // Wie bei der Linie: die Farbe des hoeheren Endpunkts.
      const art = b.v > a.v ? ziele[i] : ziele[i - 1];
      const kwh = (((a.v + b.v) / 2) * faktor * (b.t - a.t)) / 3600000;
      summe[art] += kwh;
      stuecke.push({ t0: a.t, t1: b.t, art, kwh });
    }
    const takte = [];
    let lauf = null;
    stuecke.forEach((s) => {
      if (s.art === "standby") {
        lauf = null;
        return;
      }
      if (!lauf) {
        lauf = { t0: s.t0, t1: s.t1, kwh: 0, ww: 0, heiz: 0, spitze: 0, tSpitze: s.t0 };
        takte.push(lauf);
      }
      lauf.t1 = s.t1;
      lauf.kwh += s.kwh;
      if (s.art === "ww") lauf.ww += s.kwh;
      if (s.art === "heiz") lauf.heiz += s.kwh;
      if (s.kwh > 0 && s.kwh / ((s.t1 - s.t0) / 3600000 || 1) > lauf.spitze) {
        lauf.spitze = s.kwh / ((s.t1 - s.t0) / 3600000 || 1);
        lauf.tSpitze = (s.t0 + s.t1) / 2;
      }
    });
    takte.forEach((t) => {
      // Ueberwiegt Warmwasser, ist es ein Warmwassertakt. Ohne Ventilverlauf
      // ist weder Heizen noch Warmwasser bekannt, dann nur "Betrieb".
      t.art = t.ww > t.kwh / 2 ? "ww" : t.heiz > 0 ? "heiz" : "lauf";
    });
    return { summe, stuecke, takte };
  },

  /**
   * Kennzahlen oben rechts im Rahmen: Gesamt und je Betriebsart in kWh.
   * Bei wenig Platz ohne Beschriftung, nur farbige Zahlen.
   */
  _verbrauchKennzahlen(summe, x, y, breite) {
    const gesamt = ARTEN.reduce((s, a) => s + summe[a], 0);
    const knapp = breite < 340;
    const teile = [
      { text: `${fmt(gesamt, 1)} kWh`, farbe: "#E8EDF4", stark: true },
    ];
    [["heiz", "heizung"], ["ww", "warmwasser"], ["lauf", "betrieb"], ["standby", "standby"]].forEach(([a, k]) => {
      if (summe[a] < 0.05 && a !== "standby") return;
      const zahl = fmt(summe[a], 1);
      teile.push({ text: knapp ? zahl : `${this._t(k)} ${zahl}`, farbe: a === "standby" ? "#7E8CA0" : VERBRAUCH_FARBEN[a] });
    });
    // Von rechts nach links setzen, damit alles rechtsbuendig endet.
    let rechts = x + breite;
    let out = "";
    for (let i = teile.length - 1; i >= 0; i--) {
      const t = teile[i];
      const w = Math.round(t.text.length * (t.stark ? 7.6 : 6.6)) + 16;
      const links = rechts - w;
      out = `<g><rect x="${links}" y="${y}" width="${w}" height="20" rx="10" fill="#1C2533"/>
        <text x="${links + w / 2}" y="${y + 14}" text-anchor="middle" font-size="${t.stark ? 12.5 : 11.5}"
              font-weight="${t.stark ? 700 : 500}" fill="${t.farbe}">${escapeHtml(t.text)}</text></g>` + out;
      rechts = links - 6;
    }
    return out;
  },

  /** B: Balken je Stunde, gestapelt nach Betriebsart. */
  _verbrauchBalken(ausw, f) {
    const { links, rechts, oben, unten, t0, t1 } = f;
    const n = 24;
    const spanne = t1 - t0 || 1;
    const fach = [...Array(n)].map(() => ({ heiz: 0, ww: 0, lauf: 0, standby: 0 }));
    ausw.stuecke.forEach((s) => {
      const i = Math.min(n - 1, Math.max(0, Math.floor((((s.t0 + s.t1) / 2 - t0) / spanne) * n)));
      fach[i][s.art] += s.kwh;
    });
    const hoechst = Math.max(groesster(fach.map((h) => ARTEN.reduce((s, a) => s + h[a], 0))), 0.01);
    const schritt = (rechts - links) / n;
    const b = Math.max(2, schritt - Math.max(2, schritt * 0.28));
    const skala = (unten - oben) / hoechst;
    let out = `<line x1="${links}" x2="${rechts}" y1="${((oben + unten) / 2).toFixed(1)}" y2="${((oben + unten) / 2).toFixed(1)}"
                     stroke="#26303F" stroke-dasharray="2 5"/>`;
    fach.forEach((h, i) => {
      const x = links + i * schritt + (schritt - b) / 2;
      let y = unten;
      const teile = ARTEN.filter((a) => h[a] * skala > 0.3);
      if (!teile.length) {
        out += `<rect x="${x.toFixed(1)}" y="${(unten - 2).toFixed(1)}" width="${b.toFixed(1)}" height="2" rx="1" fill="#26303F"/>`;
        return;
      }
      teile.forEach((a, k) => {
        const hh = h[a] * skala;
        y -= hh;
        const oberstes = k === teile.length - 1;
        out += oberstes
          ? `<path d="${obenRund(x, y, b, hh, 4)}" fill="${VERBRAUCH_FARBEN[a]}"/>`
          : `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${b.toFixed(1)}" height="${hh.toFixed(1)}" fill="${VERBRAUCH_FARBEN[a]}"/>`;
      });
      const summe = ARTEN.reduce((s, a) => s + h[a], 0);
      out += `<title>${escapeHtml(`${fmt(summe, 2)} kWh`)}</title>`;
    });
    return out;
  },

  /** C: Ring mit den Anteilen, daneben jeder Takt als Block und die Leistungskurve. */
  _verbrauchTakte(ausw, f, daten) {
    const { links, rechts, oben, unten, t0, t1 } = f;
    const hoehe = unten - oben;
    const r = Math.max(14, Math.min(hoehe / 2 - 4, 52));
    const cx = links + r + 6;
    const cy = oben + hoehe / 2;
    const dicke = Math.max(5, r * 0.26);
    const gesamt = ARTEN.reduce((s, a) => s + ausw.summe[a], 0) || 1;
    let a0 = -Math.PI / 2;
    let ring = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1C2533" stroke-width="${dicke}"/>`;
    ["heiz", "ww", "lauf", "standby"].forEach((a) => {
      const anteil = ausw.summe[a] / gesamt;
      if (anteil <= 0.002) return;
      const a1 = a0 + anteil * Math.PI * 2;
      const luecke = anteil < 0.999 ? 0.04 : 0;
      const ende = Math.max(a0 + 0.001, a1 - luecke);
      const gross = ende - a0 > Math.PI ? 1 : 0;
      ring += `<path d="M${(cx + r * Math.cos(a0)).toFixed(1)} ${(cy + r * Math.sin(a0)).toFixed(1)}
               A${r} ${r} 0 ${gross} 1 ${(cx + r * Math.cos(ende)).toFixed(1)} ${(cy + r * Math.sin(ende)).toFixed(1)}"
               fill="none" stroke="${VERBRAUCH_FARBEN[a]}" stroke-width="${dicke}" stroke-linecap="round"/>`;
      a0 = a1;
    });
    ring += `<text x="${cx}" y="${cy + (r > 30 ? 2 : 4)}" text-anchor="middle" font-size="${r > 30 ? 17 : 11}" font-weight="700"
                   fill="#E8EDF4">${escapeHtml(fmt(gesamt, 1))}</text>`;
    if (r > 30) {
      ring += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="#7E8CA0">kWh</text>`;
    }
    // Rechts das Taktband und darunter die Leistungskurve.
    const bl = cx + r + dicke + 14;
    const br = rechts;
    const zuX = (t) => bl + ((t - t0) / (t1 - t0 || 1)) * (br - bl);
    const bandH = Math.max(10, Math.min(26, hoehe * 0.34));
    const textH = hoehe > 70 ? 16 : 0;
    const bandY = oben + textH;
    let rechts2 = `<rect x="${bl}" y="${bandY}" width="${br - bl}" height="${bandH}" rx="6" fill="#1C2533"/>`;
    ausw.takte.forEach((t) => {
      const xa = zuX(t.t0);
      const w = Math.max(3, zuX(t.t1) - xa);
      const minuten = Math.round((t.t1 - t.t0) / 60000);
      rechts2 += `<rect x="${xa.toFixed(1)}" y="${bandY + 2}" width="${w.toFixed(1)}" height="${bandH - 4}" rx="3"
                        fill="${VERBRAUCH_FARBEN[t.art]}"><title>${escapeHtml(`${minuten} min · ${fmt(t.kwh, 2)} kWh`)}</title></rect>`;
    });
    if (textH) {
      const n = ausw.takte.length;
      const dauer = n ? ausw.takte.reduce((s, t) => s + (t.t1 - t.t0), 0) / n / 60000 : 0;
      const ww = ausw.takte.filter((t) => t.art === "ww").length;
      rechts2 += `<text x="${bl}" y="${oben + 11}" font-size="11.5" fill="#98A6BA">${escapeHtml(
        tf(this._t(ausw.summe.heiz + ausw.summe.ww > 0 ? "v_takte" : "v_takte_ohne"), { n, d: fmt(dauer, 0), w: ww })
      )}</text>`;
    }
    // Leistungskurve klein unter dem Band.
    const ko = bandY + bandH + 6;
    const ku = unten;
    if (ku - ko > 8) {
      const hoechst = Math.max(groesster(daten.map((d) => d.v)), 0.01);
      let pfad = "";
      daten.forEach((d, i) => {
        const y = ku - (d.v / hoechst) * (ku - ko);
        pfad += `${i ? "L" : "M"}${zuX(d.t).toFixed(1)} ${y.toFixed(1)}`;
      });
      rechts2 += `<path d="${pfad}" fill="none" stroke="#7E8CA0" stroke-width="1.4" stroke-linejoin="round" opacity="0.85"/>`;
    }
    return ring + rechts2;
  },

  /** D: leuchtende Linie, gefaerbt nach Betriebsart, ueber jedem Takt die kWh. */
  _verbrauchLeuchten(ausw, f, daten, ziele) {
    const { links, rechts, oben, unten, px } = f;
    const markenH = unten - oben > 70 ? 20 : 0;
    // Die Linie beginnt unter den Marken.
    const o2 = oben + markenH;
    const hoechst = Math.max(groesster(daten.map((d) => d.v)), 0.01);
    const y = (d) => unten - (d.v / hoechst) * (unten - o2);
    let linie = "";
    daten.forEach((d, i) => {
      linie += `${i ? "L" : "M"}${px(d).toFixed(1)} ${y(d).toFixed(1)}`;
    });
    const pfade = { heiz: "", ww: "", lauf: "", standby: "" };
    let letztes = null;
    for (let i = 1; i < daten.length; i++) {
      const a = daten[i - 1];
      const b = daten[i];
      const art = b.v > a.v ? ziele[i] : ziele[i - 1];
      const von = `${px(a).toFixed(1)} ${y(a).toFixed(1)}`;
      const bis = `${px(b).toFixed(1)} ${y(b).toFixed(1)}`;
      pfade[art] += letztes === art ? `L${bis}` : `M${von}L${bis}`;
      letztes = art;
    }
    let out = `<defs>
        <filter id="vl-leuchten" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="vl-flaeche" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FF5F52" stop-opacity="0.22"/>
          <stop offset="1" stop-color="#FF5F52" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${linie}L${rechts.toFixed(1)} ${unten}L${links.toFixed(1)} ${unten}Z" fill="url(#vl-flaeche)"/>`;
    ["standby", "lauf", "heiz", "ww"].forEach((a) => {
      if (!pfade[a]) return;
      out += `<path d="${pfade[a]}" fill="none" stroke="${VERBRAUCH_FARBEN[a === "standby" ? "lauf" : a]}"
                    stroke-width="${a === "standby" ? 1.6 : 2.4}" stroke-linejoin="round" stroke-linecap="round"
                    ${a === "standby" ? 'opacity="0.55"' : 'filter="url(#vl-leuchten)"'}/>`;
    });
    if (markenH) {
      // Marken mit Abstand, damit sie sich nicht ueberdecken.
      let zuletzt = -Infinity;
      ausw.takte.forEach((t) => {
        const x = px({ t: t.tSpitze, v: 0 });
        if (x - zuletzt < 44) return;
        zuletzt = x;
        const text = fmt(t.kwh, 1);
        const w = text.length * 6.5 + 14;
        out += `<g><rect x="${(x - w / 2).toFixed(1)}" y="${oben}" width="${w.toFixed(1)}" height="17" rx="8.5"
                     fill="#1C2533" stroke="${VERBRAUCH_FARBEN[t.art]}" stroke-opacity="0.7"/>
                 <text x="${x.toFixed(1)}" y="${oben + 12}" text-anchor="middle" font-size="10.5" fill="#C9D3E0">${escapeHtml(text)}</text></g>`;
      });
    }
    return out;
  },
};
