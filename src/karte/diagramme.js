/**
 * Knoepfe oben rechts und das Fenster mit den 24-Stunden-Diagrammen:
 * Verbrauch, SG Ready und Temperaturen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { escapeHtml, fmt, groesster, jePixel, kleinster } from "../hilfsfunktionen.js";

/** Abmessungen der Zeichenflaeche im Fenster. */
export const DW = 640;
const DH = 200;

/** Kleine Symbole fuer die Knoepfe, gezeichnet um den Nullpunkt. */
const SYMBOLE = {
  verbrauch: `<path d="M2 -9 L-5 1 H0 L-2 9 L5 -1 H0 Z" fill="currentColor"/>`,
  sg: `<rect x="-8" y="-6" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="-3.5" cy="0" r="2" fill="currentColor"/><circle cx="3.5" cy="0" r="2" fill="currentColor"/>`,
  temp: `<path d="M-2 -8 a2 2 0 0 1 4 0 V2.5 a4 4 0 1 1 -4 0 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
         <circle cx="0" cy="5.5" r="2" fill="currentColor"/>`,
  cop: `<path d="M-8 4 A8 8 0 1 1 8 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M0 2 L4 -5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="0" cy="2" r="2" fill="currentColor"/>`,
  takt: `<path d="M-9 2 H-5 L-3 -6 L1 7 L3 -2 H9" fill="none" stroke="currentColor" stroke-width="1.8"
          stroke-linejoin="round" stroke-linecap="round"/>`,
  analyse: `<circle cx="-2" cy="-2" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M2.5 2.5 L8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M-5 -2 H-3.5 L-2.5 -4.5 L-1 0.5 L0 -2 H1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>`,
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
      ["cop", "COP"],
      ["takt", this._t("d_taktung")],
      ["analyse", this._t("d_analyse")],
    ];
    const abstand = 10;
    // Nebeneinander in zwei Zeilen: oben drei, darunter zwei, rechtsbuendig.
    // Im Hochformat zwei Spalten, untereinander waere es zu hoch.
    const spalten = 3;
    const w = untereinander
      ? (breite - abstand) / 2
      : (breite - abstand * (spalten - 1)) / spalten;
    const lage = (i) => {
      if (untereinander) {
        return { bx: x + (i % 2) * (w + abstand), by: y + Math.floor(i / 2) * (40 + abstand) };
      }
      const zeile = i < spalten ? 0 : 1;
      const inZeile = zeile ? arten.length - spalten : spalten;
      const pos = zeile ? i - spalten : i;
      const start = x + breite - inZeile * w - (inZeile - 1) * abstand;
      return { bx: start + pos * (w + abstand), by: y + zeile * (40 + abstand) };
    };
    return `<g id="dia-knoepfe">${arten
      .map(([art, text], i) => {
        const { bx, by } = lage(i);
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
            <span class="lhc-zr-kopf"><span id="dia-titel">--</span><span class="lhc-zr-trenner">·</span>${this._zrAuswahl()}</span>
            <button type="button" class="lhc-dialog-close" id="dia-zu"
                    aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
          </div>
          <div class="lhc-hilfe-chips" id="dia-reiter">
            ${reiter("verbrauch", this._t("verbrauch"))}${reiter("sg", "SG Ready")}${reiter("temp", this._t("d_temperaturen"))}${reiter("cop", "COP")}${reiter("takt", this._t("d_taktung"))}${reiter("analyse", this._t("d_analyse"))}
          </div>
          <div class="lhc-zr-hinweis" id="dia-zr-hinweis" hidden></div>
          <svg viewBox="0 0 ${DW} ${DH}" class="lhc-dia-svg" id="dia-svg" preserveAspectRatio="xMidYMid meet">
            <g id="dia-verbrauch">${this._verlaufRahmen(20, 6, DW - 40, DH - 12)}</g>
            <g id="dia-sg"></g>
            <g id="dia-temp"></g>
            <g id="dia-cop"></g>
            <g id="dia-takt"></g>
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
    const wahl = sr.getElementById("dia-zeitraum");
    if (wahl) wahl.addEventListener("change", () => this._zrWechsel(wahl.value));
  },

  _oeffneDia(art) {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (!dlg) return;
    dlg.hidden = false;
    // Beim Oeffnen frische Daten, beim Wechsel der Reiter gilt die
    // Sperre von fuenf Minuten, sonst fragte jeder Klick ein Jahr neu ab.
    this._verlaufZeit = 0;
    this._auswertungZeit = 0;
    this._zeigeDia(art);
    const box = dlg.querySelector(".lhc-dia-box");
    if (box) {
      box.setAttribute("tabindex", "-1");
      box.focus({ preventScroll: true });
    }
  },

  /**
   * Legt das Analysefenster genau ueber die Karte: gleiche Breite und
   * Lage. Ist die Karte flacher als 560 Pixel (Querformat), waechst das
   * Fenster nach unten, sonst waere der Text nicht lesbar; es bleibt
   * immer im sichtbaren Bereich.
   */
  _diaVollLage(box, voll) {
    const st = box.style;
    // Dreht sich das Handy oder aendert sich die Fenstergroesse, wird die
    // Lage neu berechnet. Der Beobachter lebt nur, solange die Analyse offen ist.
    if (voll && !this._diaGroesseRuf) {
      this._diaGroesseRuf = () => this._diaVollLage(box, this._diaArt === "analyse");
      window.addEventListener("resize", this._diaGroesseRuf);
    } else if (!voll && this._diaGroesseRuf) {
      window.removeEventListener("resize", this._diaGroesseRuf);
      this._diaGroesseRuf = null;
    }
    if (!voll) {
      ["position", "left", "top", "width", "height"].forEach((k) => st.removeProperty(k));
      return;
    }
    const r = this.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const b = Math.min(r.width, vw);
    const h = Math.min(Math.max(r.height, Math.min(560, vh - 24)), vh);
    st.position = "fixed";
    st.width = `${b}px`;
    st.height = `${h}px`;
    st.left = `${Math.max(0, Math.min(r.left, vw - b))}px`;
    st.top = `${Math.max(0, Math.min(r.top, vh - h))}px`;
  },

  _schliesseDia() {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (dlg) dlg.hidden = true;
    const box = dlg && dlg.querySelector(".lhc-dia-box");
    if (box) this._diaVollLage(box, false);
    this._diaArt = null;
  },

  /** Schaltet die Ansicht im Fenster um und zeichnet sie. */
  _zeigeDia(art) {
    const sr = this.shadowRoot;
    this._diaArt = art;
    const titel = {
      verbrauch: this._t("verbrauch"),
      sg: "SG Ready",
      temp: this._t("d_temperaturen"),
      cop: "COP",
      takt: this._t("d_taktung"),
      analyse: this._t("an_titel"),
    };
    const wahl = sr.getElementById("dia-zeitraum");
    if (wahl) wahl.value = this._zrSchluessel();
    this._zrHinweis([]);
    sr.getElementById("dia-titel").textContent = titel[art] || "";
    sr.querySelectorAll("#dia-reiter button").forEach((b) =>
      b.classList.toggle("aktiv", b.dataset.reiter === art)
    );
    ["verbrauch", "sg", "temp", "cop", "takt", "analyse"].forEach((a) => {
      const g = sr.getElementById(`dia-${a}`);
      if (g) g.setAttribute("display", a === art ? "inline" : "none");
    });
    sr.getElementById("dia-liste").textContent = "";
    // Die Analyse braucht Platz: das Fenster fuellt die ganze Karte, die
    // Zeichenflaeche entfaellt, der Inhalt ist Text in Karten.
    const voll = art === "analyse";
    const dlg = sr.getElementById("dia-dialog");
    if (dlg) dlg.classList.toggle("voll", voll);
    const box = sr.querySelector(".lhc-dia-box");
    if (box) {
      box.classList.toggle("voll", voll);
      this._diaVollLage(box, voll);
    }
    sr.getElementById("dia-svg").style.display = voll ? "none" : "";
    const leer = sr.getElementById("dia-leer");
    if (leer) leer.textContent = this._t("kein_verlauf");
    // SG Ready braucht nur ein flaches Band, die anderen die volle Hoehe.
    const hoch = art === "sg" ? this._sgHoehe() : art === "cop" || art === "takt" ? this._auswertungHoehe(art) : DH;
    sr.getElementById("dia-svg").setAttribute("viewBox", `0 0 ${DW} ${hoch}`);
    sr.getElementById("dia-leer").setAttribute("y", String(hoch / 2));
    if (art === "verbrauch") {
      this._holeVerlauf();
      this._diaLeer(!(this._verlauf && this._verlauf.length >= 2));
    } else if (art === "sg") {
      this._holeVerlauf();
      this._zeichneDiaSg();
    } else if (art === "temp") {
      this._holeTemperaturen();
      this._zeichneDiaTemp();
    } else if (art === "cop" || art === "takt") {
      this._holeAuswertung();
      this._zeichneAuswertung();
    } else if (art === "analyse") {
      this._holeAuswertung();
      if (typeof this._ladeJaz === "function") this._ladeJaz();
      this._zeichneAnalyse();
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

  /** Beschriftung der Zeitachse mit fuenf Marken. */
  _diaZeitachse(links, rechts, y, t0, t1) {
    return this._zrAchse(links, rechts, y, t0, t1, 'class="value-sp verlauf-text"');
  },

  /**
   * Holt Vorlauf, Ruecklauf und Aussentemperatur im gewaehlten Zeitraum:
   * bis 3 Tage aus dem Verlauf, darueber Mittelwerte mit Kleinst- und
   * Groesstwert aus der Langzeitstatistik.
   */
  _holeTemperaturen() {
    const jetzt = Date.now();
    const sp = this._zrSpanne();
    if (this._tempZeit && jetzt - this._tempZeit < 300000 && this._tempVerlauf && this._tempVerlauf.k === sp.k) return;
    this._tempZeit = jetzt;
    const felder = ["flow_temp", "return_temp", "outside_temp"];
    if (this._config.demo) {
      const reihen = { k: sp.k, t0: sp.t0, t1: sp.t1, statistik: sp.statistik, periode: sp.periode };
      const schritt = sp.statistik ? (sp.periode === "hour" ? 3600000 : 86400000) : 900000;
      felder.forEach((f, k) => {
        reihen[f] = [];
        for (let t = sp.t0; t <= sp.t1; t += schritt) {
          // Tagesgang und Jahresgang, in sich stimmig.
          const tag = ((t % 86400000) / 86400000) * Math.PI * 2;
          const jahr = Math.cos(((new Date(t).getMonth() + 0.5) / 12) * Math.PI * 2);
          const aussen = 6 + jahr * -6 + (sp.periode === "day" && sp.statistik ? 0 : Math.sin(tag - 1.8) * 4);
          const v = k === 2 ? aussen : (k === 0 ? 38 : 32) - (aussen - 6) * 0.4 + Math.sin(t / 3.6e6 / 1.3) * (sp.statistik ? 0.8 : 3);
          reihen[f].push({ t, v, min: v - (k === 2 ? 3 : 4), max: v + (k === 2 ? 3 : 5) });
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
    const ausVerlauf = (ab) =>
      this._hass
        .callWS({
          type: "history/history_during_period",
          start_time: new Date(ab).toISOString(),
          end_time: new Date(sp.t1).toISOString(),
          entity_ids: ids.filter(Boolean),
          minimal_response: true,
          no_attributes: true,
        })
        .then((antwort) => {
          const reihen = { k: sp.k, t0: sp.t0, t1: sp.t1, statistik: false };
          felder.forEach((f, i) => {
            const id = ids[i];
            reihen[f] = ((antwort && id && antwort[id]) || [])
              .map((p) => ({
                t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
                v: parseFloat(p.s !== undefined ? p.s : p.state),
              }))
              .filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
          });
          return reihen;
        });
    const aktuell = () => this._zrSchluessel() === sp.k;
    const fertig = (reihen) => {
      if (!aktuell()) return;
      this._tempVerlauf = reihen;
      this._zeichneDiaTemp();
    };
    const fehler = () => {
      if (!aktuell()) return;
      this._tempVerlauf = null;
      this._zeichneDiaTemp();
    };
    if (!sp.statistik) {
      ausVerlauf(sp.t0).then(fertig).catch(fehler);
      return;
    }
    this._zrStatistik(ids.filter(Boolean), sp, true)
      .then((stat) => {
        if (!aktuell()) return null;
        // Ohne Langzeitstatistik bleibt der Verlauf, so weit er reicht.
        if (!ids.some((id) => id && stat[id] && stat[id].length)) return ausVerlauf(sp.tVerlauf).then(fertig);
        const reihen = { k: sp.k, t0: sp.t0, t1: sp.t1, statistik: true, periode: sp.periode };
        felder.forEach((f, i) => {
          const id = ids[i];
          reihen[f] = ((id && stat[id]) || []).map((z) => ({
            t: (z.t0 + z.t1) / 2,
            v: z.v,
            min: Number.isFinite(z.min) ? z.min : z.v,
            max: Number.isFinite(z.max) ? z.max : z.v,
          }));
        });
        return fertig(reihen);
      })
      .catch(fehler);
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
    const alle = arten.flatMap(([f]) => reihen[f].flatMap((p) => (reihen.statistik ? [p.v, p.min, p.max] : [p.v])));
    // Runde Schritte von 5, 10 oder 20 Grad, damit die Achse lesbar bleibt.
    const roh = (groesster(alle) - kleinster(alle)) / 4;
    const schritt = roh <= 5 ? 5 : roh <= 10 ? 10 : 20;
    const min = Math.floor(kleinster(alle) / schritt) * schritt;
    let max = Math.ceil(groesster(alle) / schritt) * schritt;
    if (max - min < schritt * 2) max = min + schritt * 2;
    const t1 = reihen.t1 || Date.now();
    // Liegt der Verlauf nicht so weit zurueck, beginnt die Achse mit den Daten.
    const erster = kleinster(arten.map(([f]) => reihen[f][0].t));
    const t0 = reihen.statistik ? reihen.t0 : Math.max(reihen.t0 || t1 - 86400000, Math.min(erster, t1 - 3600000));
    this._zrHinweis([
      reihen.statistik ? this._zrStatText(reihen.periode) : "",
      reihen.statistik ? "" : this._zrLueckeText(erster, this._zrSpanne()),
    ]);
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
        // Treppenlinie: Home Assistant speichert nur Wechsel, ein Wert gilt
        // bis zum naechsten. Eine schraege Verbindung wuerde Zwischenwerte
        // vortaeuschen, und Vor- und Ruecklauf koennten sich scheinbar
        // kreuzen, weil sie zu verschiedenen Zeitpunkten wechseln.
        const pkt = jePixel(reihen[f].filter((p) => p.t >= t0), px);
        // Mittelwerte aus der Statistik als Linie mit Band von Kleinst- bis Groesstwert.
        if (reihen.statistik) {
          const linie = pkt.map((p, i) => `${i ? "L" : "M"}${px(p.t).toFixed(1)} ${py(p.v).toFixed(1)}`).join("");
          const band = pkt.map((p, i) => `${i ? "L" : "M"}${px(p.t).toFixed(1)} ${py(p.max).toFixed(1)}`).join("") +
            pkt.slice().reverse().map((p) => `L${px(p.t).toFixed(1)} ${py(p.min).toFixed(1)}`).join("") + "Z";
          return `<path d="${band}" fill="${farbe}" opacity="0.12"/>
            <path d="${linie}" fill="none" stroke="${farbe}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
        }
        const d = pkt
          .map((p, i) =>
            i ? `H${px(p.t).toFixed(1)}V${py(p.v).toFixed(1)}` : `M${px(p.t).toFixed(1)} ${py(p.v).toFixed(1)}`
          )
          .join("") + (pkt.length ? `H${rechts}` : "");
        return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
      })
      .join("");
    g.innerHTML = `${raster}${linien}${this._diaZeitachse(links, rechts, DH - 12, t0, t1)}`;
    // Liste mit dem aktuellen, kleinsten und groessten Wert je Linie.
    sr.getElementById("dia-liste").innerHTML = arten
      .map(([f, farbe, name]) => {
        const werte = reihen[f].map((p) => p.v);
        const jetzt = werte[werte.length - 1];
        const unten2 = reihen.statistik ? kleinster(reihen[f].map((p) => p.min)) : kleinster(werte);
        const oben2 = reihen.statistik ? groesster(reihen[f].map((p) => p.max)) : groesster(werte);
        return `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe}"></span>
          <span>${escapeHtml(name)}</span>
          <b>${fmt(jetzt, 1)} °C</b>
          <em>${fmt(unten2, 1)} … ${fmt(oben2, 1)} °C</em></div>`;
      })
      .join("");
  },
};
