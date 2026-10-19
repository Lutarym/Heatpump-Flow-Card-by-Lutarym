/**
 * Knoepfe oben rechts und das Fenster mit den 24-Stunden-Diagrammen:
 * Verbrauch, SG Ready und Temperaturen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { escapeHtml, fmt } from "../hilfsfunktionen.js";
import { SG_STATES } from "../konstanten.js";

/** Abmessungen der Zeichenflaeche im Fenster. */
const DW = 640;
const DH = 300;

/** Kleine Symbole fuer die Knoepfe, gezeichnet um den Nullpunkt. */
const SYMBOLE = {
  verbrauch: `<path d="M2 -9 L-5 1 H0 L-2 9 L5 -1 H0 Z" fill="currentColor"/>`,
  sg: `<rect x="-8" y="-6" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="-3.5" cy="0" r="2" fill="currentColor"/><circle cx="3.5" cy="0" r="2" fill="currentColor"/>`,
  temp: `<path d="M-2 -8 a2 2 0 0 1 4 0 V2.5 a4 4 0 1 1 -4 0 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
         <circle cx="0" cy="5.5" r="2" fill="currentColor"/>`,
};

export const diagrammeKarte = {
  /** Steht der Verlauf als Knopf statt dauerhaft in der Karte? */
  _verlaufAlsKnopf() {
    const v = this._config.show_history;
    return v !== true && v !== false;
  },

  /**
   * Drei Knoepfe nebeneinander, rechtsbuendig im Bereich x..x+breite.
   * Sie liegen im Bild und wachsen deshalb mit der Karte mit.
   */
  _diaKnoepfe(x, y, breite, untereinander) {
    if (!this._verlaufAlsKnopf()) return "";
    const arten = [
      ["verbrauch", this._t("verbrauch")],
      ["sg", "SG Ready"],
      ["temp", this._t("d_temperaturen")],
    ];
    const abstand = 10;
    // Im Hochformat untereinander, nebeneinander waere die Spalte zu schmal.
    const w = untereinander ? breite : (breite - abstand * (arten.length - 1)) / arten.length;
    return `<g id="dia-knoepfe">${arten
      .map(([art, text], i) => {
        const bx = untereinander ? x : x + i * (w + abstand);
        const by = untereinander ? y + i * (40 + abstand) : y;
        return `
        <g class="dia-knopf klickbar" data-dia="${art}" role="button" tabindex="0"
           aria-label="${escapeHtml(text)}">
          <rect x="${bx}" y="${by}" width="${w}" height="40" rx="20"
                fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
          <g transform="translate(${bx + 24} ${by + 20})" class="dia-symbol">${SYMBOLE[art]}</g>
          <text class="cap dia-text" x="${bx + 42}" y="${by + 21}" dominant-baseline="middle">${escapeHtml(text)}</text>
        </g>`;
      })
      .join("")}</g>`;
  },

  /** Fenster mit den drei Ansichten. Der Verbrauch nutzt den Verlaufsrahmen. */
  _diaDialogMarkup() {
    if (!this._verlaufAlsKnopf()) return "";
    const reiter = (art, text) =>
      `<button type="button" data-reiter="${art}">${escapeHtml(text)}</button>`;
    return `
      <div class="lhc-dialog" id="dia-dialog" hidden>
        <div class="lhc-kurve-box lhc-dia-box" role="dialog" aria-modal="true" aria-labelledby="dia-titel">
          <div class="lhc-kurve-titel">
            <span id="dia-titel">--</span>
            <button type="button" class="lhc-dialog-close" id="dia-zu"
                    aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
          </div>
          <div class="lhc-hilfe-chips" id="dia-reiter">
            ${reiter("verbrauch", this._t("verbrauch"))}${reiter("sg", "SG Ready")}${reiter("temp", this._t("d_temperaturen"))}
          </div>
          <svg viewBox="0 0 ${DW} ${DH}" class="lhc-dia-svg" id="dia-svg" preserveAspectRatio="xMidYMid meet">
            <g id="dia-verbrauch">${this._verlaufRahmen(20, 6, DW - 40, DH - 12)}</g>
            <g id="dia-sg"></g>
            <g id="dia-temp"></g>
            <text class="value-sp verlauf-text" id="dia-leer" x="${DW / 2}" y="${DH / 2}"
                  text-anchor="middle" opacity="0">${escapeHtml(this._t("kein_verlauf"))}</text>
          </svg>
          <div class="lhc-dia-liste" id="dia-liste"></div>
        </div>
      </div>`;
  },

  /** Knoepfe und Fenster mit Bedienung versehen. Einmal nach dem Aufbau. */
  _diaEinrichten() {
    const sr = this.shadowRoot;
    const dlg = sr && sr.getElementById("dia-dialog");
    if (!dlg || dlg.dataset.fertig) return;
    dlg.dataset.fertig = "1";
    sr.querySelectorAll(".dia-knopf").forEach((k) => {
      const oeffne = (ev) => {
        ev.stopPropagation();
        this._oeffneDia(k.dataset.dia);
      };
      k.addEventListener("click", oeffne);
      k.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          oeffne(ev);
        }
      });
    });
    sr.querySelectorAll("#dia-reiter button").forEach((b) => {
      b.addEventListener("click", () => this._zeigeDia(b.dataset.reiter));
    });
    dlg.addEventListener("click", (ev) => {
      if (ev.target === dlg) this._schliesseDia();
    });
    dlg.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") this._schliesseDia();
    });
    const zu = sr.getElementById("dia-zu");
    if (zu) zu.addEventListener("click", () => this._schliesseDia());
  },

  _oeffneDia(art) {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (!dlg) return;
    dlg.hidden = false;
    this._zeigeDia(art);
    const box = dlg.querySelector(".lhc-dia-box");
    if (box) {
      box.setAttribute("tabindex", "-1");
      box.focus({ preventScroll: true });
    }
  },

  _schliesseDia() {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (dlg) dlg.hidden = true;
    this._diaArt = null;
  },

  /** Schaltet die Ansicht im Fenster um und zeichnet sie. */
  _zeigeDia(art) {
    const sr = this.shadowRoot;
    this._diaArt = art;
    const titel = {
      verbrauch: this._t("verbrauch_24"),
      sg: `SG Ready · ${this._t("d_24h")}`,
      temp: `${this._t("d_temperaturen")} · ${this._t("d_24h")}`,
    };
    sr.getElementById("dia-titel").textContent = titel[art] || "";
    sr.querySelectorAll("#dia-reiter button").forEach((b) =>
      b.classList.toggle("aktiv", b.dataset.reiter === art)
    );
    ["verbrauch", "sg", "temp"].forEach((a) => {
      const g = sr.getElementById(`dia-${a}`);
      if (g) g.setAttribute("display", a === art ? "inline" : "none");
    });
    sr.getElementById("dia-liste").textContent = "";
    // SG Ready braucht nur ein flaches Band, die anderen die volle Hoehe.
    const hoch = art === "sg" ? 130 : DH;
    sr.getElementById("dia-svg").setAttribute("viewBox", `0 0 ${DW} ${hoch}`);
    sr.getElementById("dia-leer").setAttribute("y", String(hoch / 2));
    if (art === "verbrauch") {
      this._verlaufZeit = 0;
      this._holeVerlauf();
      this._diaLeer(!(this._verlauf && this._verlauf.length >= 2));
    } else if (art === "sg") {
      this._verlaufZeit = 0;
      this._holeVerlauf();
      this._zeichneDiaSg();
    } else if (art === "temp") {
      this._holeTemperaturen();
      this._zeichneDiaTemp();
    }
  },

  _diaLeer(leer) {
    const t = this.shadowRoot.getElementById("dia-leer");
    if (t) t.setAttribute("opacity", leer ? "1" : "0");
  },

  /** Wird nach jedem neuen Verlauf aufgerufen, damit das Fenster mitlaeuft. */
  _diaNachVerlauf() {
    if (this._diaArt === "verbrauch") this._diaLeer(!(this._verlauf && this._verlauf.length >= 2));
    if (this._diaArt === "sg") this._zeichneDiaSg();
  },

  /** SG Ready: breites Band ueber 24 Stunden und die Dauer je Zustand. */
  _zeichneDiaSg() {
    const sr = this.shadowRoot;
    const g = sr.getElementById("dia-sg");
    if (!g) return;
    const sgr = this._sgVerlauf;
    if (!sgr || !sgr.length) {
      g.innerHTML = "";
      this._diaLeer(true);
      return;
    }
    this._diaLeer(false);
    const t1 = Date.now();
    const t0 = t1 - 86400000;
    const links = 20;
    const rechts = DW - 20;
    const oben = 10;
    const hoehe = 70;
    const zuX = (t) => links + ((Math.min(Math.max(t, t0), t1) - t0) / (t1 - t0)) * (rechts - links);
    const dauer = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let rects = "";
    sgr.forEach((e, i) => {
      const von = Math.max(e.t, t0);
      const bis = Math.min(i + 1 < sgr.length ? sgr[i + 1].t : t1, t1);
      if (bis <= von) return;
      dauer[e.stufe] = (dauer[e.stufe] || 0) + (bis - von);
      const info = SG_STATES[e.stufe];
      rects += `<rect x="${zuX(von).toFixed(1)}" y="${oben}" width="${Math.max(0.6, zuX(bis) - zuX(von)).toFixed(1)}"
                 height="${hoehe}" fill="${info ? info.farbe : "#55637A"}" opacity="0.9"/>`;
    });
    g.innerHTML = `
      <rect x="${links}" y="${oben}" width="${rechts - links}" height="${hoehe}" rx="6"
            fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
      ${rects}
      ${this._diaZeitachse(links, rechts, oben + hoehe + 22)}`;
    // Darunter die Zustaende mit ihrer Dauer, als Liste zum Lesen.
    const liste = sr.getElementById("dia-liste");
    liste.innerHTML = [2, 3, 4, 1]
      .map((s) => {
        const info = SG_STATES[s];
        const std = dauer[s] / 3600000;
        return `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${info.farbe}"></span>
          <span>${escapeHtml(this._t(info.lang))}</span><b>${fmt(std, 1)} h</b></div>`;
      })
      .join("");
  },

  /** Beschriftung der Zeitachse alle sechs Stunden mit Uhrzeit. */
  _diaZeitachse(links, rechts, y) {
    const t1 = Date.now();
    const t0 = t1 - 86400000;
    let out = "";
    for (let i = 0; i <= 4; i++) {
      const t = t0 + (i * 86400000) / 4;
      const x = links + (i / 4) * (rechts - links);
      const d = new Date(t);
      const text = i === 4 ? this._t("jetzt") : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const anker = i === 0 ? "start" : i === 4 ? "end" : "middle";
      out += `<text class="value-sp verlauf-text" x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}">${escapeHtml(text)}</text>`;
    }
    return out;
  },

  /** Holt Vorlauf, Ruecklauf und Aussentemperatur der letzten 24 Stunden. */
  _holeTemperaturen() {
    const jetzt = Date.now();
    if (this._tempZeit && jetzt - this._tempZeit < 300000) return;
    this._tempZeit = jetzt;
    const felder = ["flow_temp", "return_temp", "outside_temp"];
    if (this._config.demo) {
      const reihen = {};
      felder.forEach((f, k) => {
        reihen[f] = [];
        for (let i = 0; i <= 96; i++) {
          const t = jetzt - 86400000 + i * 900000;
          const basis = k === 0 ? 38 : k === 1 ? 32 : 6;
          const welle = k === 2 ? Math.sin((i / 96) * Math.PI * 2 - 1.8) * 4 : Math.sin(i / 5) * 3;
          reihen[f].push({ t, v: basis + welle });
        }
      });
      this._tempVerlauf = reihen;
      this._zeichneDiaTemp();
      return;
    }
    const ids = felder.map((f) => this._e(f));
    if (!ids.some(Boolean) || !this._hass || typeof this._hass.callWS !== "function") {
      this._tempVerlauf = null;
      this._zeichneDiaTemp();
      return;
    }
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: new Date(jetzt - 86400000).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: ids.filter(Boolean),
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        const reihen = {};
        felder.forEach((f, i) => {
          const id = ids[i];
          reihen[f] = ((antwort && id && antwort[id]) || [])
            .map((p) => ({
              t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
              v: parseFloat(p.s !== undefined ? p.s : p.state),
            }))
            .filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
        });
        this._tempVerlauf = reihen;
        this._zeichneDiaTemp();
      })
      .catch(() => {
        this._tempVerlauf = null;
        this._zeichneDiaTemp();
      });
  },

  /** Drei Linien in einem gemeinsamen Massstab. */
  _zeichneDiaTemp() {
    const sr = this.shadowRoot;
    const g = sr && sr.getElementById("dia-temp");
    if (!g || this._diaArt !== "temp") return;
    const reihen = this._tempVerlauf || {};
    const arten = [
      ["flow_temp", "#FF5F52", this._t("vorlauf")],
      ["return_temp", "#4D9BFF", this._t("ruecklauf")],
      ["outside_temp", "#9FB3C8", this._t("aussentemperatur")],
    ].filter(([f]) => (reihen[f] || []).length >= 2);
    if (!arten.length) {
      g.innerHTML = "";
      this._diaLeer(true);
      return;
    }
    this._diaLeer(false);
    const alle = arten.flatMap(([f]) => reihen[f].map((p) => p.v));
    // Runde Schritte von 5, 10 oder 20 Grad, damit die Achse lesbar bleibt.
    const roh = (Math.max(...alle) - Math.min(...alle)) / 4;
    const schritt = roh <= 5 ? 5 : roh <= 10 ? 10 : 20;
    const min = Math.floor(Math.min(...alle) / schritt) * schritt;
    let max = Math.ceil(Math.max(...alle) / schritt) * schritt;
    if (max - min < schritt * 2) max = min + schritt * 2;
    const t1 = Date.now();
    const t0 = t1 - 86400000;
    const links = 56;
    const rechts = DW - 20;
    const oben = 16;
    const unten = DH - 40;
    const px = (t) => links + ((Math.min(Math.max(t, t0), t1) - t0) / (t1 - t0)) * (rechts - links);
    const py = (v) => unten - ((v - min) / (max - min)) * (unten - oben);
    // Hilfslinien mit Beschriftung in Grad.
    let raster = "";
    for (let v = min; v <= max; v += schritt) {
      const y = py(v).toFixed(1);
      raster += `<line x1="${links}" y1="${y}" x2="${rechts}" y2="${y}" stroke="#2A3446" stroke-width="1"/>
        <text class="value-sp verlauf-text" x="${links - 8}" y="${y}" text-anchor="end" dominant-baseline="middle">${fmt(v, 0)}°</text>`;
    }
    const linien = arten
      .map(([f, farbe]) => {
        const d = reihen[f]
          .filter((p) => p.t >= t0)
          .map((p, i) => `${i ? "L" : "M"}${px(p.t).toFixed(1)} ${py(p.v).toFixed(1)}`)
          .join("");
        return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      })
      .join("");
    g.innerHTML = `${raster}${linien}${this._diaZeitachse(links, rechts, DH - 12)}`;
    // Liste mit dem aktuellen, kleinsten und groessten Wert je Linie.
    sr.getElementById("dia-liste").innerHTML = arten
      .map(([f, farbe, name]) => {
        const werte = reihen[f].map((p) => p.v);
        const jetzt = werte[werte.length - 1];
        return `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe}"></span>
          <span>${escapeHtml(name)}</span>
          <b>${fmt(jetzt, 1)} °C</b>
          <em>${fmt(Math.min(...werte), 1)} … ${fmt(Math.max(...werte), 1)} °C</em></div>`;
      })
      .join("");
  },
};
