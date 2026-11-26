/**
 * Demomodus mit erfundenen Werten.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { escapeHtml } from "../hilfsfunktionen.js";
import { DEMO_PAARE } from "../konstanten.js";
import { wertText } from "../texte.js";
import { demoIntegration } from "./integration.js";

export const demoKarte = {
  /**
   * Baut einen vollstaendigen Satz erfundener Werte auf.
   * Im Demomodus ersetzt er die echten Entitaeten restlos. Es wird
   * nichts an die Waermepumpe gesendet, alle Bedienschritte aendern
   * nur diese Nachbildung.
   */
  _demoAufbauen() {
    const werte = {
      TOP14: 8.5, TOP0: 1, TOP8: 42,
      TOP62: 640, TOP63: 620,
      EXT1: 1240, EXT2: 8.4,
      TOP6: 39.2, TOP5: 33.1, TOP65: 2400, TOP1: 18.6,
      TOP20: 0, TOP115: 1.8, TOP26: 0, TOP44: "0",
      TOP46: 38.4, TOP7: 40, TOP113: 2, TOP29: 45, TOP30: 28, TOP31: 15, TOP32: -10, TOP82: 38, TOP83: 26, TOP84: 15, TOP85: -10, TOP22: -8, TOP59: 0, TOP99: 1,
      TOP36: 34.2, TOP42: 36, TOP124: 1,
      TOP27: 36, TOP37: 30.1, TOP43: 32,
      TOP123: 0, TOP34: 32, TOP94: 2,
      TOP10: 48.3, TOP9: 50, TOP58: 0, TOP100: 1,
      TOP2: 0, TOP69: 0, EXT400: 0, EXT401: "off", EXT3: 3400,
      EXT100: "off", EXT101: "off",
      SET10: "off", SET13: "off", SET12: "off",
      SET44: "off", SET45: "off", SET28: "on",
      SET1: "on", EXT200: "on", EXT202: "off",
      TOP4: 4,
      EXT204: 32.8, EXT205: 1, EXT206: "on", EXT207: 28.4, EXT208: 0, EXT209: "off",
      EXT300: 72.4, EXT301: 1, TOP47: 41.0, OPT5: 0,
      EXT600: 4.3, EXT601: 3.1, TOP60: 0, TOP61: 0,
      TOP11: 1462, TOP12: 2381, TOP90: 3, TOP91: 11,
      SET2: "off", SET24: "off", EXT402: "on",
      TOP77: 18, TOP78: -8, TOP23: 3, TOP70: 65, TOP71: 10, TOP95: 160,
    };
    const states = {};
    Object.keys(werte).forEach((feld) => {
      const attrs = {};
      if (["TOP27", "TOP34", "TOP9"].includes(feld)) {
        Object.assign(attrs, { min: 15, max: 65, step: 0.5 });
      }
      states[`demo.${feld}`] = { state: String(werte[feld]), attributes: attrs };
    });
    // Warmwasser zur waermsten Tageszeit (EXT402 bis EXT404):
    // vor 15 Uhr fuer heute 14:00 geplant, danach heute erledigt und
    // morgen 13:00 geplant. Erfundene Werte wie alles im Demomodus.
    const jetzt = new Date();
    const um = (tage, std, min) => {
      const z = new Date(jetzt);
      z.setDate(z.getDate() + tage);
      z.setHours(std, min, 0, 0);
      return z;
    };
    const datum = (z) => `${z.getFullYear()}-${String(z.getMonth() + 1).padStart(2, "0")}-${String(z.getDate()).padStart(2, "0")}`;
    const fertig = jetzt.getHours() >= 15;
    states["demo.EXT403"] = {
      state: (fertig ? um(1, 13, 0) : um(0, 14, 0)).toISOString(),
      attributes: {
        status: fertig ? "erledigt" : "geplant", hoechsttemperatur: fertig ? 8 : 9,
        tag_erledigt: datum(fertig ? jetzt : um(-1, 12, 0)), gestartet: null,
        hoechstdauer_min: 120, wetter_entity: "weather.forecast_home", device_class: "timestamp",
      },
    };
    states["demo.EXT404"] = {
      state: (fertig ? um(0, 14, 2) : um(-1, 13, 2)).toISOString(),
      attributes: { device_class: "timestamp" },
    };
    // Werte fuer die Analyse (TOP, XTOP und EXT ohne Editorfeld).
    demoIntegration(states);
    states["demo.SET9"] = {
      state: "mode_4",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3", "mode_4", "mode_5", "mode_6"] },
    };
    states["demo.SET4"] = {
      state: "mode_0",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] },
    };
    ["SET39", "SET42", "SET41", "SET40"].forEach((feld) => {
      states[`demo.${feld}`] = { state: "mode_0", attributes: { options: ["mode_0", "mode_1"] } };
    });
    states["demo.SET3"] = {
      state: "mode_2",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] },
    };

    const karte = this;
    this._demo = {
      states,
      entities: {},
      // Nimmt Befehle entgegen und aendert nur die Nachbildung.
      callService(bereich, dienst, daten) {
        const id = daten.entity_id;
        if (!states[id]) return;
        if (dienst === "set_value") states[id].state = String(daten.value);
        else if (dienst === "select_option") states[id].state = daten.option;
        else if (dienst === "turn_on") states[id].state = "on";
        else if (dienst === "turn_off") states[id].state = "off";
        else if (dienst === "toggle") {
          states[id].state = states[id].state === "on" ? "off" : "on";
        }
        // Auch ein Befehl aus einem Fenster zieht die Rueckmeldung nach.
        const feld = id.slice(5);
        const paar = DEMO_PAARE[feld];
        if (paar && states[`demo.${paar}`]) {
          const an = states[id].state === "on" || parseFloat(states[id].state) > 0;
          const zielIstSchalter = paar.startsWith("SET");
          states[`demo.${paar}`].state = zielIstSchalter
            ? an ? "on" : "off"
            : an ? "1" : "0";
        }
        karte._render();
      },
    };
  },

  /**
   * Setzt einen Wert der Nachbildung.
   * Schaltbefehl und Rueckmeldetopic gehoeren zusammen und werden
   * gemeinsam gesetzt. Sonst schaltet man im Demomodus etwas um,
   * ohne dass die zugehoerige Rueckmeldung folgt.
   */
  _demoSetze(feld, wert) {
    if (!this._demo) return;
    const setze = (name, w) => {
      const eintrag = this._demo.states[`demo.${name}`];
      if (eintrag) eintrag.state = String(w);
    };
    setze(feld, wert);

    const an = wert === "on" || parseFloat(wert) > 0;
    const paar = DEMO_PAARE[feld];
    if (paar) {
      const zielIstSchalter = paar.startsWith("SET");
      setze(paar, zielIstSchalter ? (an ? "on" : "off") : an ? 1 : 0);
    }
    this._render();
  },

  /** Liest einen Wert der Nachbildung. */
  _demoLies(feld) {
    if (!this._demo) return null;
    const eintrag = this._demo.states[`demo.${feld}`];
    return eintrag ? eintrag.state : null;
  },

  /** Verdrahtet das Einstellfenster. */
  /** Baut die Bedienleiste des Demomodus. */
  _buildDemo() {
    const host = this.shadowRoot.getElementById("demo-leiste");
    if (!this._config.demo) {
      host.hidden = true;
      host.innerHTML = "";
      return;
    }
    host.hidden = false;

    const schalter = [
      ["SET1", "Wärmepumpe"],
      ["TOP124", "Pumpe HK1"],
      ["TOP123", "Pumpe HK2"],
      ["TOP60", "Heizstab läuft"],
      ["TOP26", "Abtauung"],
      ["EXT400", "Zirkulation Status"],
      ["TOP2", "Aufheizen"],
      ["TOP69", "Legionellenschutz"],
    ];
    // Kamin und Solarthermie nur, wenn sie im Editor gewaehlt sind.
    const quellen = this._quellen();
    // Heizkreis 3 und 4 nur, wenn so viele Heizkreise eingestellt sind.
    const hk = this._hkAnzahl();
    if (hk >= 3) schalter.splice(3, 0, ["EXT205", "Pumpe HK3"]);
    if (hk >= 4) schalter.splice(4, 0, ["EXT208", "Pumpe HK4"]);
    if (quellen.includes("kamin")) schalter.push(["EXT301", "Pumpe Kamin"]);
    if (quellen.includes("solar")) schalter.push(["OPT5", "Pumpe Solarthermie"]);
    const regler = [
      ["EXT3", "PV Leistung", 0, 12000],
      ["TOP14", "Außen", -20, 40],
      ["TOP6", "Vorlauf", 15, 70],
      ["TOP5", "Rücklauf", 15, 70],
      ["TOP46", "Puffer", 15, 70],
      ["TOP10", "Warmwasser", 15, 70],
      ["TOP36", "HK1 Wasser", 15, 60],
      ["TOP37", "HK2 Wasser", 15, 60],
      ["TOP8", "Verdichter", 0, 90],
      ["TOP1", "Durchfluss", 0, 40],
    ];
    if (hk >= 3) regler.splice(8, 0, ["EXT204", "HK3 Wasser", 15, 60]);
    if (hk >= 4) regler.splice(9, 0, ["EXT207", "HK4 Wasser", 15, 60]);
    if (quellen.includes("kamin")) regler.push(["EXT300", "Kamin", 10, 90]);
    if (quellen.includes("solar")) regler.push(["TOP47", "Solarthermie", 0, 90]);

    host.innerHTML = `
      <div class="lhc-demo-kopf">
        <span class="lhc-field-label">${this._t("e_demo")}</span>
        <span class="lhc-demo-hinweis">${this._t("r_demo_hinweis")}</span>
      </div>
      <div class="lhc-demo-reihe">
        ${schalter.map(([feld, text], i) => `<button type="button" class="lhc-demo-knopf" id="demo-s${i}" data-feld="${feld}">${escapeHtml(wertText(text, this._sp()))}</button>`).join("")}
        <button type="button" class="lhc-demo-knopf" id="demo-bereitschaft">${this._t("r_bereitschaft")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-ventil">${this._t("umschaltventil")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-sg">SG Ready</button>
        <button type="button" class="lhc-demo-knopf" id="demo-stoerung">${this._t("r_stoerung")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-zurueck">${this._t("r_zurueck")}</button>
      </div>
      <div class="lhc-demo-regler">
        ${regler.map(([feld, text, lo, hi]) => `
          <label class="lhc-demo-schieber">
            <span>${escapeHtml(wertText(text, this._sp()))} <b data-regler="${feld}">--</b></span>
            <input type="range" data-feld="${feld}" min="${lo}" max="${hi}" step="0.5">
          </label>`).join("")}
      </div>`;

    // Schalter: einfache Delegation
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-feld]");
      if (!btn) return;
      const feld = btn.getAttribute("data-feld");
      const jetzt = this._demoLies(feld);
      const istAn = jetzt === "on" || parseFloat(jetzt) > 0;
      this._demoSetze(feld, istAn ? "off" : "on");
      this._syncDemo();
    });

    // Regler: einfach Input-Events
    host.addEventListener("input", (e) => {
      const inp = e.target.closest("input[data-feld]");
      if (!inp) return;
      const feld = inp.getAttribute("data-feld");
      this._demoSetze(feld, inp.value);
      this._syncDemo();
    });

    // Spezielle Buttons (Ventil, SG, etc.)
    // Bereitschaft: die Anlage bleibt eingeschaltet, foerdert aber nichts.
    // Weder Heizung noch Warmwasser werden bedient, die gruene LED bleibt an.
    this.shadowRoot.getElementById("demo-bereitschaft").addEventListener("click", () => {
      const arbeitetJetzt = parseFloat(this._demoLies("TOP1")) > 0;
      if (arbeitetJetzt) {
        this._demoSetze("TOP8", 0);
        this._demoSetze("TOP62", 0);
        this._demoSetze("TOP63", 0);
        this._demoSetze("TOP65", 0);
        this._demoSetze("TOP1", 0);
        this._demoSetze("EXT1", 0);
        this._demoSetze("TOP124", 0);
        this._demoSetze("TOP123", 0);
        this._demoSetze("EXT205", 0);
        this._demoSetze("EXT208", 0);
        this._demoSetze("EXT400", 0);
      } else {
        this._demoSetze("TOP8", 42);
        this._demoSetze("TOP62", 640);
        this._demoSetze("TOP63", 620);
        this._demoSetze("TOP65", 2400);
        this._demoSetze("TOP1", 18.6);
        this._demoSetze("EXT1", 1240);
        this._demoSetze("TOP124", 1);
        this._demoSetze("TOP123", 0);
        this._demoSetze("EXT205", 1);
        this._demoSetze("EXT208", 0);
      }
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-ventil").addEventListener("click", () => {
      this._demoSetze("TOP20", this._demoLies("TOP20") === "1" ? 0 : 1);
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-sg").addEventListener("click", () => {
      const k1 = this._demoLies("EXT100") === "on";
      const k2 = this._demoLies("EXT101") === "on";
      const folge = [[false, false], [true, false], [false, true], [true, true]];
      const jetzt = folge.findIndex((f) => f[0] === k1 && f[1] === k2);
      const naechste = folge[(jetzt + 1) % folge.length];
      this._demoSetze("EXT100", naechste[0] ? "on" : "off");
      this._demoSetze("EXT101", naechste[1] ? "on" : "off");
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-stoerung").addEventListener("click", () => {
      this._demoSetze("TOP44", this._demoLies("TOP44") === "0" ? "H76" : "0");
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-zurueck").addEventListener("click", () => {
      this._demoAufbauen();
      this._buildDemo();
      this._render();
    });

    this._syncDemo();
  },

  /** Haelt die Bedienleiste des Demomodus auf Stand. */
  _syncDemo() {
    if (!this._config.demo || !this._demo) return;
    const felder = ["EXT3","TOP14","TOP6","TOP5","TOP46","TOP10",
                    "TOP36","TOP37","TOP8","TOP1"];
    felder.forEach((feld) => {
      // Die Regler tragen keine id, sondern data-feld. Ebenso die Anzeige.
      const el = this.shadowRoot.querySelector(`input[data-feld="${feld}"]`);
      const anzeige = this.shadowRoot.querySelector(`b[data-regler="${feld}"]`);
      const wert = this._demoLies(feld);
      if (el && el.value !== wert) el.value = wert;
      if (anzeige) anzeige.textContent = wert;
    });
    const schalter = ["SET1","TOP124","TOP123","TOP60",
                      "TOP26","EXT400","TOP2","TOP69"];
    schalter.forEach((feld, i) => {
      const el = this.shadowRoot.getElementById(`demo-s${i}`);
      if (!el) return;
      const w = this._demoLies(feld);
      el.classList.toggle("is-on", w === "on" || parseFloat(w) > 0);
    });
  },
};
