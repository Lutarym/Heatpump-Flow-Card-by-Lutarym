/**
 * Verbrauchsverlauf der letzten 24 Stunden.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { clamp, fmt } from "../hilfsfunktionen.js";
import { NEUTRAL, SG_STATES } from "../konstanten.js";
import { tf } from "../texte.js";

export const verlaufKarte = {
  /**
   * Holt den Zaehlerstand von heute null Uhr und merkt ihn.
   * Damit laesst sich der Tagesverbrauch aus dem Gesamtzaehler rechnen,
   * ohne dass ein eigener Zaehler-Helfer noetig ist.
   * Schlaegt die Abfrage fehl, bleibt der Gesamtstand stehen.
   */
  async _ladeTagesstart() {
    const id = this._e("energy_today");
    if (!id || !this._quelle || !this._quelle.callWS) return;

    const jetzt = new Date();
    const mitternacht = new Date(
      jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate()
    ).getTime();

    // Einmal je Tag, danach hoechstens alle fuenf Minuten erneut versuchen.
    if (this._tagStartTag === mitternacht && this._tagStart !== undefined) return;
    if (this._tagVersuch && jetzt.getTime() - this._tagVersuch < 300000) return;
    this._tagVersuch = jetzt.getTime();

    try {
      const antwort = await this._quelle.callWS({
        type: "history/history_during_period",
        start_time: new Date(mitternacht).toISOString(),
        end_time: new Date(mitternacht + 120000).toISOString(),
        entity_ids: [id],
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      });
      const reihe = antwort && antwort[id];
      if (!reihe || !reihe.length) return;
      // Je nach Fassung heisst das Feld "s" oder "state".
      const roh = reihe[0].s !== undefined ? reihe[0].s : reihe[0].state;
      const wert = parseFloat(roh);
      if (!Number.isNaN(wert)) {
        this._tagStart = wert;
        this._tagStartTag = mitternacht;
        this._render();
      }
    } catch (err) {
      // Keine Historie verfuegbar, es bleibt beim Gesamtstand.
    }
  },

  /**
   * Rahmen des Verlaufsdiagramms. Gezeichnet wird spaeter, sobald die
   * Daten aus Home Assistant vorliegen. Die Masse merkt sich die Karte,
   * damit die Kurve in denselben Rahmen passt.
   */
  _verlaufRahmen(x, y, breite, hoehe) {
    if (this._config.show_history === false) {
      this._verlaufMasse = null;
      return "";
    }
    this._verlaufMasse = { x, y, breite, hoehe };
    return `
      <g id="verlauf-group" opacity="0">
        <text class="cap-s verlauf-titel" x="${x}" y="${y + 14}">${this._t("verbrauch_24")}</text>
        <text class="value-s" id="verlauf-max" x="${x + breite}" y="${y + 14}"
              text-anchor="end">--</text>
        <line x1="${x}" y1="${y + 26}" x2="${x + breite}" y2="${y + 26}"
              stroke="#55657F" stroke-width="1"/>
        <path id="verlauf-flaeche" fill="#2E7FD4" opacity="0.2" d=""/>
        <path id="verlauf-linie" fill="none" stroke="#7E8CA0" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-standby" fill="none" stroke="#7E8CA0" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-heiz" fill="none" stroke="#FF5F52" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-ww" fill="none" stroke="#4D9BFF" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <line x1="${x}" y1="${y + hoehe - 50}" x2="${x + breite}"
              y2="${y + hoehe - 50}" stroke="#2A3446" stroke-width="1"/>
        <text class="cap-s" x="${x}" y="${y + hoehe - 36}">SG Ready</text>
        <rect id="verlauf-sg-rahmen" x="${x}" y="${y + hoehe - 32}" width="${breite}" height="12"
              rx="3" fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
        <g id="verlauf-sg"></g>
        <text class="hinweis-s" id="verlauf-sg-leer" x="${x}"
              y="${y + hoehe - 26}" dominant-baseline="middle" opacity="0">${this._t("kein_verlauf")}</text>
        <text class="value-sp verlauf-text" x="${x}" y="${y + hoehe - 4}">${this._t("vor_24h")}</text>
        <text class="value-sp verlauf-text" x="${x + breite}" y="${y + hoehe - 36}"
              text-anchor="end"><tspan fill="#FF5F52">${this._t("heizung")}</tspan><tspan fill="#7E8CA0"> · </tspan><tspan fill="#4D9BFF">${this._t("warmwasser")}</tspan><tspan fill="#7E8CA0"> · ${this._t("standby")}</tspan></text>
        <text class="value-sp verlauf-text" x="${x + breite}" y="${y + hoehe - 4}"
              text-anchor="end">${this._t("jetzt")}</text>
      </g>`;
  },

  /**
   * Holt den Verlauf aus Home Assistant.  /**
   * Holt den Verlauf aus Home Assistant. Hoechstens alle fuenf Minuten,
   * damit die Abfrage die Oberflaeche nicht belastet.
   */
  _holeVerlauf() {
    const jetzt = Date.now();
    if (this._verlaufZeit && jetzt - this._verlaufZeit < 300000) return;
    this._verlaufZeit = jetzt;

    if (this._config.demo) {
      // Im Demomodus ein nachgebildeter Tagesverlauf.
      const punkte = [];
      const start = jetzt - 86400000;
      for (let i = 0; i <= 96; i++) {
        const stunde = (i / 4) % 24;
        const grund = stunde > 5 && stunde < 9 ? 2.4 : stunde > 16 && stunde < 21 ? 1.8 : 0.4;
        punkte.push({ t: start + i * 900000, v: Math.max(0, grund + Math.sin(i / 3) * 0.5) });
      }
      this._verlauf = punkte;
      // Nachgebildeter SG-Ready-Verlauf: meist normal, mittags
      // Einschaltempfehlung und Anlauf, abends kurz gesperrt.
      const h = 3600000;
      this._sgVerlauf = [
        { t: start, stufe: 2 }, { t: start + 10 * h, stufe: 3 }, { t: start + 12 * h, stufe: 4 },
        { t: start + 13.5 * h, stufe: 3 }, { t: start + 15 * h, stufe: 2 },
        { t: start + 18 * h, stufe: 1 }, { t: start + 19 * h, stufe: 2 },
      ];
      this._zeichneVerlauf();
      return;
    }

    const id = this._e("power_now");
    const vid = this._e("three_way_valve");
    const k1 = this._e("sg_k1");
    const k2 = this._e("sg_k2");
    const vd = this._e("compressor");
    if (!id || !this._hass || typeof this._hass.callWS !== "function") {
      this._verlauf = null;
      this._zeichneVerlauf();
      return;
    }
    const ende = new Date();
    const start = new Date(ende.getTime() - 86400000);
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: ende.toISOString(),
        entity_ids: [id, vid, k1, k2, vd].filter(Boolean),
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        // Aus beiden Kontakten ergibt sich der SG-Ready-Zustand. Die
        // Zeitpunkte beider Reihen werden zusammengefuehrt.
        const punkte = (eid) =>
          ((antwort && eid && antwort[eid]) || [])
            .map((pkt) => ({
              t: pkt.lu ? pkt.lu * 1000 : Date.parse(pkt.last_changed),
              an: ["on", "true", "1"].includes(
                String(pkt.s !== undefined ? pkt.s : pkt.state).toLowerCase()
              ),
            }))
            .filter((pkt) => !Number.isNaN(pkt.t));
        const r1 = punkte(k1);
        const r2 = punkte(k2);
        if (r1.length && r2.length) {
          const zeiten = [...new Set([...r1, ...r2].map((pkt) => pkt.t))].sort(
            (x, y) => x - y
          );
          const standBei = (reihe, t) => {
            let s = reihe[0].an;
            for (const pkt of reihe) {
              if (pkt.t > t) break;
              s = pkt.an;
            }
            return s;
          };
          this._sgVerlauf = zeiten.map((t) => {
            const a1 = standBei(r1, t);
            const a2 = standBei(r2, t);
            // Gleiche Zuordnung wie in der Anzeige der Karte.
            let stufe = 2;
            if (a1 && !a2) stufe = 1;
            else if (!a1 && a2) stufe = 3;
            else if (a1 && a2) stufe = 4;
            return { t, stufe };
          });
        } else {
          this._sgVerlauf = null;
        }

        // Laeuft der Verdichter nicht, ist die Anlage im Standby, egal
        // wie das Umschaltventil steht.
        this._verdichterVerlauf = ((antwort && vd && antwort[vd]) || [])
          .map((pkt) => ({
            t: pkt.lu ? pkt.lu * 1000 : Date.parse(pkt.last_changed),
            laeuft: parseFloat(pkt.s !== undefined ? pkt.s : pkt.state) > 0,
          }))
          .filter((pkt) => !Number.isNaN(pkt.t));

        // Der Ventilverlauf sagt, wohin in dieser Zeit geladen wurde.
        this._ventilVerlauf = ((antwort && vid && antwort[vid]) || [])
          .map((p) => ({
            t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
            ww: parseFloat(p.s !== undefined ? p.s : p.state) > 0,
          }))
          .filter((p) => !Number.isNaN(p.t));
        const reihe = (antwort && antwort[id]) || [];
        this._verlauf = reihe
          .map((p) => ({
            t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
            v: parseFloat(p.s !== undefined ? p.s : p.state),
          }))
          .filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
        this._zeichneVerlauf();
      })
      .catch(() => {
        this._verlauf = null;
        this._zeichneVerlauf();
      });
  },

  /** Zeichnet die Kurve in den vorbereiteten Rahmen. */
  _zeichneVerlauf() {
    const sr = this.shadowRoot;
    const gruppe = sr && sr.getElementById("verlauf-group");
    const masse = this._verlaufMasse;
    if (!gruppe || !masse) return;
    const daten = this._verlauf || [];
    if (daten.length < 2) {
      gruppe.setAttribute("opacity", "0");
      this._diaNachVerlauf();
      return;
    }
    const links = masse.x;
    const rechts = masse.x + masse.breite;
    const oben = masse.y + 38;
    const unten = masse.y + masse.hoehe - 56;
    const t0 = daten[0].t;
    const t1 = daten[daten.length - 1].t;
    const spanne = t1 - t0 || 1;
    const hoechst = Math.max(...daten.map((d) => d.v), 0.1);
    const px = (d) => links + ((d.t - t0) / spanne) * (rechts - links);
    const py = (d) => unten - (d.v / hoechst) * (unten - oben);
    let linie = "";
    daten.forEach((d, i) => {
      linie += `${i ? "L" : "M"}${px(d).toFixed(1)} ${py(d).toFixed(1)}`;
    });

    // Abschnitte nach Ladeziel einfaerben. Rot heisst Heizung, blau
    // Warmwasser. Ohne Ventilverlauf bleibt die Linie neutral.
    const ventil = this._ventilVerlauf || [];
    const wwZu = (t) => {
      let stand = false;
      for (const v of ventil) {
        if (v.t > t) break;
        stand = v.ww;
      }
      return stand;
    };
    // Ob der Verdichter zu einem Zeitpunkt lief. Ohne dessen Verlauf
    // entscheidet allein das Ventil, wie bisher.
    const verdichter = this._verdichterVerlauf || [];
    const laeuftZu = (t) => {
      if (!verdichter.length) return true;
      let stand = verdichter[0].laeuft;
      for (const v of verdichter) {
        if (v.t > t) break;
        stand = v.laeuft;
      }
      return stand;
    };
    const pfade = { heiz: "", ww: "", standby: "" };
    if (ventil.length || verdichter.length) {
      let vorher = null;
      daten.forEach((d) => {
        const stueck = `${px(d).toFixed(1)} ${py(d).toFixed(1)}`;
        const ziel = !laeuftZu(d.t) ? "standby" : wwZu(d.t) ? "ww" : "heiz";
        if (vorher && vorher.ziel === ziel) {
          pfade[ziel] += `L${stueck}`;
        } else {
          // Am Wechsel beginnt ein neuer Abschnitt beim vorigen Punkt,
          // damit keine Luecke entsteht.
          pfade[ziel] += vorher ? `M${vorher.stueck}L${stueck}` : `M${stueck}`;
        }
        vorher = { ziel, stueck };
      });
    }
    const heiz = pfade.heiz;
    const ww = pfade.ww;
    // Band mit dem SG-Ready-Zustand, farbig wie in der Anzeige.
    const band = sr.getElementById("verlauf-sg");
    const leer = sr.getElementById("verlauf-sg-leer");
    if (band) {
      const sgr = this._sgVerlauf;
      band.textContent = "";
      const ohne = !(sgr && sgr.length);
      if (leer) leer.setAttribute("opacity", ohne ? "1" : "0");
      // Ohne Daten kein leerer Rahmen, der Hinweis steht an seiner Stelle.
      const rahmen = sr.getElementById("verlauf-sg-rahmen");
      if (rahmen) rahmen.setAttribute("opacity", ohne ? "0" : "1");
      if (sgr && sgr.length) {
        const bandY = masse.y + masse.hoehe - 31;
        const bandLinks = masse.x + 1;
        const bandRechts = masse.x + masse.breite - 1;
        const t0 = daten.length ? daten[0].t : sgr[0].t;
        const t1 = daten.length ? daten[daten.length - 1].t : Date.now();
        const zuX = (t) =>
          bandLinks +
          ((clamp(t, t0, t1) - t0) / (t1 - t0 || 1)) * (bandRechts - bandLinks);
        sgr.forEach((eintrag, i) => {
          const bis = i + 1 < sgr.length ? sgr[i + 1].t : t1;
          if (bis <= t0 || eintrag.t >= t1) return;
          const xa = zuX(eintrag.t);
          const xb = zuX(bis);
          if (xb - xa < 0.4) return;
          const info = SG_STATES[eintrag.stufe];
          const r = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          r.setAttribute("x", xa.toFixed(1));
          r.setAttribute("y", bandY.toFixed(1));
          r.setAttribute("width", (xb - xa).toFixed(1));
          r.setAttribute("height", "10");
          r.setAttribute("fill", info ? info.farbe : NEUTRAL);
          r.setAttribute("opacity", "0.9");
          const titel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          titel.textContent = this._t(info ? info.lang : "unbekannt");
          r.appendChild(titel);
          band.appendChild(r);
        });
      }
    }
    const gefaerbt = ventil.length || verdichter.length;
    sr.getElementById("verlauf-linie").setAttribute("d", gefaerbt ? "" : linie);
    const sb = sr.getElementById("verlauf-standby");
    if (sb) sb.setAttribute("d", pfade.standby);
    sr.getElementById("verlauf-heiz").setAttribute("d", heiz);
    sr.getElementById("verlauf-ww").setAttribute("d", ww);
    sr.getElementById("verlauf-flaeche").setAttribute(
      "d",
      `${linie}L${rechts.toFixed(1)} ${unten}L${links.toFixed(1)} ${unten}Z`
    );
    // Werte kommen in Watt herein, angezeigt wird einheitlich Kilowatt.
    const inKW = hoechst >= 100 ? hoechst / 1000 : hoechst;
    sr.getElementById("verlauf-max").textContent = tf(this._t("s_max"), { v: `${fmt(inKW, 2)} kW` });
    gruppe.setAttribute("opacity", "1");
    this._diaNachVerlauf();
  },
};
