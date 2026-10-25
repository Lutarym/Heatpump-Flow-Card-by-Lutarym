/**
 * SG Ready der letzten 24 Stunden im Diagrammfenster, in vier Darstellungen:
 * Spuren je Zustand, Stufenlinie, 24-Stunden-Uhr und breites Band.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { escapeHtml, fmt } from "../hilfsfunktionen.js";
import { SG_STATES } from "../konstanten.js";
import { tf } from "../texte.js";
import { DW } from "./diagramme.js";

const SG_STILE = ["spuren", "stufen", "uhr", "band"];

/** Hoehe der Zeichenflaeche je Darstellung. */
const HOEHE = { spuren: 250, stufen: 214, uhr: 238, band: 206 };

/** Reihenfolge der Zustaende von oben nach unten. */
const REIHE = [4, 3, 2, 1];

/** Text auf farbigen Flaechen bleibt in jedem Thema dunkel. */
const DUNKEL = "#0A0E14";

export const sgStileKarte = {
  /** Gewaehlte Darstellung, unbekannte Werte fallen auf die Spuren zurueck. */
  _sgStil() {
    const s = this._config.sg_style;
    return SG_STILE.includes(s) ? s : "spuren";
  },

  /** Kleine Zeitachse mit fuenf Marken. */
  _sgAchse(links, rechts, y, t0, t1) {
    return this._zrAchse(links, rechts, y, t0, t1, 'font-size="11" fill="#7E8CA0"');
  },

  _sgHoehe() {
    return HOEHE[this._sgStil()];
  },

  /**
   * Abschnitte der letzten 24 Stunden mit Zustand, Beginn und Ende.
   * Gleiche Zustaende hintereinander werden zusammengefasst.
   */
  _sgAbschnitte(t0, t1) {
    const out = [];
    const sgr = this._sgVerlauf || [];
    sgr.forEach((e, i) => {
      const von = Math.max(e.t, t0);
      const bis = Math.min(i + 1 < sgr.length ? sgr[i + 1].t : t1, t1);
      if (bis <= von) return;
      const letzter = out[out.length - 1];
      if (letzter && letzter.stufe === e.stufe && letzter.bis === von) letzter.bis = bis;
      else out.push({ stufe: e.stufe, von, bis });
    });
    return out;
  },

  /** Zeile oben: aktueller Zustand und seit wann. */
  _sgJetzt(abschnitte, t1) {
    const a = abschnitte[abschnitte.length - 1];
    if (!a) return "";
    const info = SG_STATES[a.stufe] || {};
    const farbe = info.farbe || "#7E8CA0";
    const seit = (t1 - a.von) / 3600000;
    return `<g>
        <rect x="20" y="4" width="${DW - 40}" height="32" rx="10" fill="#1C2533"/>
        <circle cx="38" cy="20" r="6" fill="${farbe}"/>
        <circle cx="38" cy="20" r="10" fill="${farbe}" opacity="0.25"/>
        <text x="56" y="25" font-size="14" font-weight="700" fill="#E8EDF4">${escapeHtml(
          tf(this._t("sg_jetzt"), { z: this._t(info.lang || "unbekannt") })
        )}</text>
        <text x="${DW - 32}" y="25" text-anchor="end" font-size="12" fill="#98A6BA">${escapeHtml(
          tf(this._t("sg_seit"), { h: fmt(seit, 1) })
        )}</text>
      </g>`;
  },

  /** Zeichnet SG Ready im gewaehlten Stil und die Liste darunter. */
  _zeichneDiaSg() {
    const sr = this.shadowRoot;
    const g = sr.getElementById("dia-sg");
    if (!g) return;
    const stil = this._sgStil();
    const hoehe = HOEHE[stil];
    if (this._diaArt === "sg") {
      sr.getElementById("dia-svg").setAttribute("viewBox", `0 0 ${DW} ${hoehe}`);
      sr.getElementById("dia-leer").setAttribute("y", String(hoehe / 2));
    }
    const sgr = this._sgVerlauf;
    const liste = sr.getElementById("dia-liste");
    if (!sgr || !sgr.length) {
      g.innerHTML = "";
      if (liste) liste.textContent = "";
      this._diaLeer(true);
      return;
    }
    this._diaLeer(false);
    // Der Zeitraum aus der Auswahl; beginnt der Verlauf spaeter, beginnt
    // die Darstellung mit ihm.
    const sp = this._zrSpanne();
    const t1 = sp.t1;
    const t0 = Math.max(sp.t0, Math.min(sgr[0].t, t1 - 3600000));
    if (this._diaArt === "sg") {
      this._zrHinweis([this._zrLueckeText(sgr[0].t, sp)]);
    }
    const abschnitte = this._sgAbschnitte(t0, t1);
    const dauer = { 1: 0, 2: 0, 3: 0, 4: 0 };
    abschnitte.forEach((a) => {
      dauer[a.stufe] = (dauer[a.stufe] || 0) + (a.bis - a.von);
    });
    const name = (s) => this._t((SG_STATES[s] || {}).lang || "unbekannt");
    const farbe = (s) => (SG_STATES[s] || {}).farbe || "#7E8CA0";
    const std = (s) => fmt(dauer[s] / 3600000, dauer[s] >= 100 * 3600000 ? 0 : 1);
    const daten = { t0, t1, abschnitte, dauer, name, farbe, std };
    const inhalt =
      stil === "stufen"
        ? this._sgStufen(daten)
        : stil === "uhr"
          ? this._sgUhr(daten)
          : stil === "band"
            ? this._sgBand(daten)
            : this._sgSpuren(daten);
    g.innerHTML = this._sgJetzt(abschnitte, t1) + inhalt;
    // Die Stufenlinie hat keine eigene Uebersicht, dort folgt die Liste.
    if (liste) {
      liste.innerHTML =
        stil === "stufen"
          ? [2, 3, 4, 1]
            .map((s) => `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe(s)}"></span>
                <span>${escapeHtml(name(s))}</span><b>${std(s)} h</b></div>`)
            .join("")
          : "";
    }
  },

  /** B: eine Zeile je Zustand, Zeiten als Pillen, rechts die Stunden. */
  _sgSpuren(d) {
    const links = 20;
    const rechts = DW - 72;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    let out = "";
    REIHE.forEach((s, i) => {
      // Name ueber der Spur, so bleibt die Spur auch bei langen Namen breit.
      const y = 68 + i * 44;
      out += `<text x="${links}" y="${y - 6}" font-size="12" fill="#C9D3E0">${escapeHtml(d.name(s))}</text>
        <rect x="${links}" y="${y}" width="${rechts - links}" height="22" rx="11" fill="#1C2533"/>`;
      d.abschnitte
        .filter((a) => a.stufe === s)
        .forEach((a) => {
          const xa = zuX(a.von);
          const w = Math.max(6, zuX(a.bis) - xa - 2);
          out += `<rect x="${xa.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="22" rx="11" fill="${d.farbe(s)}"><title>${escapeHtml(
            `${d.name(s)} · ${fmt((a.bis - a.von) / 3600000, 1)} h`
          )}</title></rect>`;
        });
      out += `<text x="${DW - 20}" y="${y + 16}" text-anchor="end" font-size="13" font-weight="700"
                    fill="${d.farbe(s)}">${d.std(s)} h</text>`;
    });
    out += `<line x1="${rechts}" x2="${rechts}" y1="50" y2="224" stroke="#C9D3E0" stroke-dasharray="3 3" opacity="0.5"/>`;
    out += this._sgAchse(links, rechts, 242, d.t0, d.t1);
    return out;
  },

  /** A: Stufenlinie, jeder Zustand auf seiner Hoehe, darunter Farbflaechen. */
  _sgStufen(d) {
    const links = 20;
    const rechts = DW - 20;
    const oben = 62;
    const unten = 184;
    const stufe = { 4: 0, 3: 1, 2: 2, 1: 3 };
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    const zuY = (s) => oben + ((stufe[s] !== undefined ? stufe[s] : 2) * (unten - oben)) / 3;
    let out = "";
    REIHE.forEach((s) => {
      const y = zuY(s);
      out += `<line x1="${links}" x2="${rechts}" y1="${y}" y2="${y}" stroke="#26303F" stroke-dasharray="2 5"/>
        <text x="${links}" y="${y - 6}" font-size="10.5" fill="${d.farbe(s)}" stroke="#1C2533" stroke-width="3"
              paint-order="stroke">${escapeHtml(d.name(s))}</text>`;
    });
    let pfad = "";
    d.abschnitte.forEach((a, i) => {
      const xa = zuX(a.von);
      const xb = zuX(a.bis);
      const y = zuY(a.stufe);
      out += `<rect x="${xa.toFixed(1)}" y="${y}" width="${(xb - xa).toFixed(1)}" height="${(unten + 8 - y).toFixed(1)}"
                    fill="${d.farbe(a.stufe)}" opacity="0.13"/>`;
      pfad += `${i ? "L" : "M"}${xa.toFixed(1)} ${y}L${xb.toFixed(1)} ${y}`;
    });
    out += `<path d="${pfad}" fill="none" stroke="#3A4557" stroke-width="2"/>`;
    d.abschnitte.forEach((a) => {
      const y = zuY(a.stufe);
      out += `<path d="M${zuX(a.von).toFixed(1)} ${y}L${zuX(a.bis).toFixed(1)} ${y}" stroke="${d.farbe(a.stufe)}"
                    stroke-width="4" stroke-linecap="round"/>`;
    });
    const letzter = d.abschnitte[d.abschnitte.length - 1];
    if (letzter) out += `<circle cx="${rechts}" cy="${zuY(letzter.stufe)}" r="5" fill="${d.farbe(letzter.stufe)}"/>`;
    out += this._sgAchse(links, rechts, 206, d.t0, d.t1);
    return out;
  },

  /** C: der Tag als Ring, oben ist jetzt, rechts Zustaende mit Anteil. */
  _sgUhr(d) {
    const cx = 128;
    const cy = 136;
    const r = 66;
    const spanne = d.t1 - d.t0;
    if (spanne > 1.05 * 86400000) return this._sgUhrMittel(d);
    // Uhrzeigersinn von oben: oben trifft vor 24 Stunden auf jetzt.
    const pol = (t, rr) => {
      const w = ((t - d.t0) / spanne) * Math.PI * 2 - Math.PI / 2;
      return [cx + rr * Math.cos(w), cy + rr * Math.sin(w)];
    };
    let out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1C2533" stroke-width="18"/>`;
    const luecke = spanne * 0.0025;
    d.abschnitte.forEach((a) => {
      const von = a.von + luecke;
      const bis = Math.max(von + spanne * 0.001, a.bis - luecke);
      const [x1, y1] = pol(von, r);
      const [x2, y2] = pol(bis, r);
      const gross = bis - von > spanne / 2 ? 1 : 0;
      out += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${gross} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
                    fill="none" stroke="${d.farbe(a.stufe)}" stroke-width="18" stroke-linecap="round"><title>${escapeHtml(
        `${d.name(a.stufe)} · ${fmt((a.bis - a.von) / 3600000, 1)} h`
      )}</title></path>`;
    });
    [[0, this._t("jetzt")], [0.25, "−18 h"], [0.5, "−12 h"], [0.75, "−6 h"]].forEach(([anteil, text]) => {
      const [x, y] = pol(d.t0 + anteil * spanne, r + 26);
      out += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#7E8CA0">${escapeHtml(text)}</text>`;
    });
    const letzter = d.abschnitte[d.abschnitte.length - 1];
    if (letzter) {
      out += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="12" fill="#98A6BA">${escapeHtml(this._t("jetzt"))}</text>
        <text x="${cx}" y="${cy + 15}" text-anchor="middle" font-size="15" font-weight="700" fill="${d.farbe(letzter.stufe)}">${escapeHtml(
        this._t((SG_STATES[letzter.stufe] || {}).kurz || "unbekannt")
      )}</text>`;
    }
    const lx = 262;
    const lb = DW - 20 - lx;
    [2, 3, 4, 1].forEach((s, i) => {
      const y = 72 + i * 40;
      const anteil = d.dauer[s] / spanne;
      out += `<circle cx="${lx + 6}" cy="${y}" r="6" fill="${d.farbe(s)}"/>
        <text x="${lx + 20}" y="${y + 4}" font-size="13" fill="#C9D3E0">${escapeHtml(d.name(s))}</text>
        <text x="${DW - 20}" y="${y + 4}" text-anchor="end" font-size="13" font-weight="700" fill="${d.farbe(s)}">${d.std(s)} h</text>
        <rect x="${lx + 20}" y="${y + 12}" width="${lb - 20}" height="5" rx="2.5" fill="#1C2533"/>
        <rect x="${lx + 20}" y="${y + 12}" width="${Math.max(0, (lb - 20) * anteil).toFixed(1)}" height="5" rx="2.5" fill="${d.farbe(s)}"/>`;
    });
    return out;
  },

  /**
   * C ueber mehrere Tage: der mittlere Tag. Je Stunde des Tages der
   * Zustand, der dort ueber alle Tage am haeufigsten war; oben ist
   * Mitternacht. Rechts die Anteile im ganzen Zeitraum.
   */
  _sgUhrMittel(d) {
    const cx = 128;
    const cy = 136;
    const r = 66;
    const spanne = d.t1 - d.t0;
    // Zeit je Stunde des Tages und Zustand.
    const fach = [...Array(24)].map(() => ({ 1: 0, 2: 0, 3: 0, 4: 0 }));
    d.abschnitte.forEach((a) => {
      let t = a.von;
      while (t < a.bis) {
        const x = new Date(t);
        const ende = Math.min(a.bis, new Date(x.getFullYear(), x.getMonth(), x.getDate(), x.getHours() + 1).getTime());
        fach[x.getHours()][a.stufe] = (fach[x.getHours()][a.stufe] || 0) + (ende - t);
        t = ende;
      }
    });
    const pol = (stunde, rr) => {
      const w = (stunde / 24) * Math.PI * 2 - Math.PI / 2;
      return [cx + rr * Math.cos(w), cy + rr * Math.sin(w)];
    };
    let out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1C2533" stroke-width="18"/>`;
    fach.forEach((f, h) => {
      const summe = REIHE.reduce((s, k) => s + f[k], 0);
      if (!summe) return;
      const stufe = REIHE.reduce((a, k) => (f[k] > f[a] ? k : a), 2);
      const anteil = f[stufe] / summe;
      const [x1, y1] = pol(h + 0.04, r);
      const [x2, y2] = pol(h + 0.96, r);
      const titel = REIHE.filter((k) => f[k] > 0)
        .map((k) => `${d.name(k)} ${fmt((f[k] / summe) * 100, 0)} %`)
        .join(" · ");
      out += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
                    fill="none" stroke="${d.farbe(stufe)}" stroke-width="18" opacity="${(0.35 + 0.65 * anteil).toFixed(2)}"><title>${escapeHtml(
        `${String(h).padStart(2, "0")}:00 · ${titel}`
      )}</title></path>`;
    });
    [[0, "0:00"], [6, "6:00"], [12, "12:00"], [18, "18:00"]].forEach(([h, text]) => {
      const [x, y] = pol(h, r + 26);
      out += `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#7E8CA0">${escapeHtml(text)}</text>`;
    });
    out += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#C9D3E0">${escapeHtml(this._t("sg_mittel"))}</text>`;
    const lx = 262;
    const lb = DW - 20 - lx;
    [2, 3, 4, 1].forEach((s, i) => {
      const y = 72 + i * 40;
      const anteil = d.dauer[s] / spanne;
      out += `<circle cx="${lx + 6}" cy="${y}" r="6" fill="${d.farbe(s)}"/>
        <text x="${lx + 20}" y="${y + 4}" font-size="13" fill="#C9D3E0">${escapeHtml(d.name(s))}</text>
        <text x="${DW - 20}" y="${y + 4}" text-anchor="end" font-size="13" font-weight="700" fill="${d.farbe(s)}">${d.std(s)} h</text>
        <rect x="${lx + 20}" y="${y + 12}" width="${lb - 20}" height="5" rx="2.5" fill="#1C2533"/>
        <rect x="${lx + 20}" y="${y + 12}" width="${Math.max(0, (lb - 20) * anteil).toFixed(1)}" height="5" rx="2.5" fill="${d.farbe(s)}"/>`;
    });
    return out;
  },

  /** D: breite Bloecke mit der Dauer darin, darunter die Anteile. */
  _sgBand(d) {
    const links = 20;
    const rechts = DW - 20;
    const zuX = (t) => links + ((t - d.t0) / (d.t1 - d.t0)) * (rechts - links);
    let bloecke = "";
    d.abschnitte.forEach((a) => {
      const xa = zuX(a.von) + 1;
      const w = Math.max(3, zuX(a.bis) - zuX(a.von) - 2);
      const std = (a.bis - a.von) / 3600000;
      bloecke += `<rect x="${xa.toFixed(1)}" y="50" width="${w.toFixed(1)}" height="44" rx="10" fill="${d.farbe(a.stufe)}"><title>${escapeHtml(
        `${d.name(a.stufe)} · ${fmt(std, 1)} h`
      )}</title></rect>`;
      if (w > 34) {
        bloecke += `<text x="${(xa + w / 2).toFixed(1)}" y="77" text-anchor="middle" font-size="11.5" font-weight="700"
                          fill="${DUNKEL}">${fmt(std, 1)} h</text>`;
      }
    });
    let out = `<defs><filter id="sg-leuchten" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <g filter="url(#sg-leuchten)" opacity="0.35">${bloecke.replace(/<text[^>]*>[^<]*<\/text>/g, "")}</g>${bloecke}`;
    out += this._sgAchse(links, rechts, 110, d.t0, d.t1);
    out += `<text x="${links}" y="132" font-size="11" fill="#7E8CA0">${escapeHtml(this._t("sg_anteile"))}</text>`;
    let x = links;
    const gesamt = d.t1 - d.t0;
    [2, 3, 4, 1].forEach((s) => {
      const w = ((rechts - links) * d.dauer[s]) / gesamt;
      if (w > 0.5) {
        out += `<rect x="${x.toFixed(1)}" y="140" width="${Math.max(1, w - 2).toFixed(1)}" height="10" rx="5" fill="${d.farbe(s)}"/>`;
      }
      x += w;
    });
    // Legende mit gleichmaessigem Abstand je nach Textlaenge.
    let lx = links;
    let ly = 170;
    [2, 3, 4, 1].forEach((s) => {
      const text = `${d.name(s)} ${d.std(s)} h`;
      const w = 14 + text.length * 6.2 + 16;
      // Passt der Eintrag nicht mehr in die Zeile, beginnt eine neue.
      if (lx > links && lx + w - 16 > rechts) {
        lx = links;
        ly += 22;
      }
      out += `<circle cx="${lx + 5}" cy="${ly}" r="5" fill="${d.farbe(s)}"/>
        <text x="${lx + 14}" y="${ly + 4}" font-size="11.5" fill="#C9D3E0">${escapeHtml(text)}</text>`;
      lx += w;
    });
    return out;
  },
};
