/**
 * Demomodus mit erfundenen Werten.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { escapeHtml } from "../hilfsfunktionen.js";
import { DEMO_PAARE } from "../konstanten.js";
import { wertText } from "../texte.js";

export const demoKarte = {
  /**
   * Baut einen vollstaendigen Satz erfundener Werte auf.
   * Im Demomodus ersetzt er die echten Entitaeten restlos. Es wird
   * nichts an die Waermepumpe gesendet, alle Bedienschritte aendern
   * nur diese Nachbildung.
   */
  _demoAufbauen() {
    const werte = {
      outside_temp: 8.5, heatpump_state: 1, compressor: 42,
      fan1_rpm: 640, fan2_rpm: 620,
      power_now: 1240, energy_today: 8.4,
      flow_temp: 39.2, return_temp: 33.1, pump_speed: 2400, pump_flow: 18.6,
      three_way_valve: 0, water_pressure: 1.8, defrost: 0, error: "0",
      buffer_temp: 38.4, buffer_target: 42, buffer_delta: 5, curve_t_high: 45, curve_t_low: 28, curve_o_high: 15, curve_o_low: -10, curve2_t_high: 38, curve2_t_low: 26, curve2_o_high: 15, curve2_o_low: -10, dhw_heat_delta: -8, room_heater: 0, buffer_installed: 1,
      hk1_water: 34.2, hk1_water_target: 36, hk1_pump: 1,
      hk1_setpoint: 36, hk2_water: 30.1, hk2_water_target: 32,
      hk2_pump: 0, hk2_setpoint: 32, zones_state: 2,
      dhw_temp: 48.3, dhw_setpoint: 50, dhw_heater: 0, dhw_installed: 1,
      dhw_force_state: 0, sterilization_state: 0, circulation_pump: 0, circ_switch: "off", pv_power: 3400,
      sg_k1: "off", sg_k2: "off",
      dhw_force: "off", force_sterilization: "off", force_defrost: "off",
      dhw_heater_switch: "off", room_heater_switch: "off", buffer_switch: "on",
      power_state: "on", hk1_switch: "on", hk2_switch: "off",
      operating_mode: 4,
      hk3_water: 32.8, hk3_pump: 1, hk3_switch: "on", hk4_water: 28.4, hk4_pump: 0, hk4_switch: "off",
      kamin_temp: 72.4, kamin_pump: 1, solar_temp: 41.0, solar_pump: 0,
      cop_heating: 4.3, cop_dhw: 3.1, heater_internal: 0, heater_external: 0,
      operating_hours: 1462, compressor_starts: 2381, room_heater_hours: 3, dhw_heater_hours: 11,
      holiday_mode: "off", main_schedule: "off", fault_reset: "unknown",
      heating_off_temp: 18, heater_on_temp: -8, heat_delta: 5, steril_temp: 65, steril_time: 10, pump_max_duty: 160,
    };
    const states = {};
    Object.keys(werte).forEach((feld) => {
      const attrs = {};
      if (feld.endsWith("_setpoint")) {
        Object.assign(attrs, { min: 15, max: 65, step: 0.5 });
      }
      states[`demo.${feld}`] = { state: String(werte[feld]), attributes: attrs };
    });
    states["demo.mode_select"] = {
      state: "mode_4",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3", "mode_4", "mode_5", "mode_6"] },
    };
    states["demo.powerful_mode"] = {
      state: "mode_0",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] },
    };
    ["heating_control", "pump_flow_mode", "quiet_priority", "smart_dhw"].forEach((feld) => {
      states[`demo.${feld}`] = { state: "mode_0", attributes: { options: ["mode_0", "mode_1"] } };
    });
    states["demo.quiet_mode"] = {
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
          const zielIstSchalter =
            paar.endsWith("_switch") || paar.startsWith("force_") ||
            paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
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
      const zielIstSchalter = paar.endsWith("_switch") || paar.startsWith("force_") ||
        paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
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
      ["power_state", "Wärmepumpe"],
      ["hk1_pump", "Pumpe HK1"],
      ["hk2_pump", "Pumpe HK2"],
      ["heater_internal", "Heizstab läuft"],
      ["defrost", "Abtauung"],
      ["circulation_pump", "Zirkulation Status"],
      ["dhw_force_state", "Aufheizen"],
      ["sterilization_state", "Legionellenschutz"],
    ];
    // Kamin und Solarthermie nur, wenn sie im Editor gewaehlt sind.
    const quellen = this._quellen();
    // Heizkreis 3 und 4 nur, wenn so viele Heizkreise eingestellt sind.
    const hk = this._hkAnzahl();
    if (hk >= 3) schalter.splice(3, 0, ["hk3_pump", "Pumpe HK3"]);
    if (hk >= 4) schalter.splice(4, 0, ["hk4_pump", "Pumpe HK4"]);
    if (quellen.includes("kamin")) schalter.push(["kamin_pump", "Pumpe Kamin"]);
    if (quellen.includes("solar")) schalter.push(["solar_pump", "Pumpe Solarthermie"]);
    const regler = [
      ["pv_power", "PV Leistung", 0, 12000],
      ["outside_temp", "Außen", -20, 40],
      ["flow_temp", "Vorlauf", 15, 70],
      ["return_temp", "Rücklauf", 15, 70],
      ["buffer_temp", "Puffer", 15, 70],
      ["dhw_temp", "Warmwasser", 15, 70],
      ["hk1_water", "HK1 Wasser", 15, 60],
      ["hk2_water", "HK2 Wasser", 15, 60],
      ["compressor", "Verdichter", 0, 90],
      ["pump_flow", "Durchfluss", 0, 40],
    ];
    if (hk >= 3) regler.splice(8, 0, ["hk3_water", "HK3 Wasser", 15, 60]);
    if (hk >= 4) regler.splice(9, 0, ["hk4_water", "HK4 Wasser", 15, 60]);
    if (quellen.includes("kamin")) regler.push(["kamin_temp", "Kamin", 10, 90]);
    if (quellen.includes("solar")) regler.push(["solar_temp", "Solarthermie", 0, 90]);

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
      const arbeitetJetzt = parseFloat(this._demoLies("pump_flow")) > 0;
      if (arbeitetJetzt) {
        this._demoSetze("compressor", 0);
        this._demoSetze("fan1_rpm", 0);
        this._demoSetze("fan2_rpm", 0);
        this._demoSetze("pump_speed", 0);
        this._demoSetze("pump_flow", 0);
        this._demoSetze("power_now", 0);
        this._demoSetze("hk1_pump", 0);
        this._demoSetze("hk2_pump", 0);
        this._demoSetze("hk3_pump", 0);
        this._demoSetze("hk4_pump", 0);
        this._demoSetze("circulation_pump", 0);
      } else {
        this._demoSetze("compressor", 42);
        this._demoSetze("fan1_rpm", 640);
        this._demoSetze("fan2_rpm", 620);
        this._demoSetze("pump_speed", 2400);
        this._demoSetze("pump_flow", 18.6);
        this._demoSetze("power_now", 1240);
        this._demoSetze("hk1_pump", 1);
        this._demoSetze("hk2_pump", 0);
        this._demoSetze("hk3_pump", 1);
        this._demoSetze("hk4_pump", 0);
      }
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-ventil").addEventListener("click", () => {
      this._demoSetze("three_way_valve", this._demoLies("three_way_valve") === "1" ? 0 : 1);
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-sg").addEventListener("click", () => {
      const k1 = this._demoLies("sg_k1") === "on";
      const k2 = this._demoLies("sg_k2") === "on";
      const folge = [[false, false], [true, false], [false, true], [true, true]];
      const jetzt = folge.findIndex((f) => f[0] === k1 && f[1] === k2);
      const naechste = folge[(jetzt + 1) % folge.length];
      this._demoSetze("sg_k1", naechste[0] ? "on" : "off");
      this._demoSetze("sg_k2", naechste[1] ? "on" : "off");
      this._syncDemo();
    });

    this.shadowRoot.getElementById("demo-stoerung").addEventListener("click", () => {
      this._demoSetze("error", this._demoLies("error") === "0" ? "H76" : "0");
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
    const felder = ["pv_power","outside_temp","flow_temp","return_temp","buffer_temp","dhw_temp",
                    "hk1_water","hk2_water","compressor","pump_flow"];
    felder.forEach((feld) => {
      // Die Regler tragen keine id, sondern data-feld. Ebenso die Anzeige.
      const el = this.shadowRoot.querySelector(`input[data-feld="${feld}"]`);
      const anzeige = this.shadowRoot.querySelector(`b[data-regler="${feld}"]`);
      const wert = this._demoLies(feld);
      if (el && el.value !== wert) el.value = wert;
      if (anzeige) anzeige.textContent = wert;
    });
    const schalter = ["power_state","hk1_pump","hk2_pump","heater_internal",
                      "defrost","circulation_pump","dhw_force_state","sterilization_state"];
    schalter.forEach((feld, i) => {
      const el = this.shadowRoot.getElementById(`demo-s${i}`);
      if (!el) return;
      const w = this._demoLies(feld);
      el.classList.toggle("is-on", w === "on" || parseFloat(w) > 0);
    });
  },
};
