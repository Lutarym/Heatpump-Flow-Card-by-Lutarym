/**
 * Einstellfenster beim Tippen auf Bauteile.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { ENTITY_FIELDS } from "../felder.js";
import { DEZIMAL, clamp, escapeHtml, fmt, isOn, numState, rawState, stellbar } from "../hilfsfunktionen.js";
import { MODE_LABELS, POWERFUL_LABELS, QUIET_LABELS } from "../konstanten.js";
import { feldText, tf, wertText } from "../texte.js";

export const dialogKarte = {
  _buildDialog() {
    const sr = this.shadowRoot;
    // Ausdruecklich schliessen, nicht nur auf das Attribut im Markup vertrauen.
    sr.getElementById("dialog").hidden = true;
    this._dialogKey = null;
    const range = sr.getElementById("dlg-range");
    const out = sr.getElementById("dlg-value");

    // Die Entitaet wird beim Aufruf festgehalten. Sonst geht der Wert
    // verloren, wenn das Fenster vor dem Absenden geschlossen wird.
    const schreiben = (wert, entitaet) => {
      const id = entitaet || this._e(this._dialogKey);
      // Nur lesbare Entitaeten koennen nicht gestellt werden.
      if (!id || !stellbar(id)) return;
      this._offen = null;
      if (this._offenTimer) {
        clearTimeout(this._offenTimer);
        this._offenTimer = null;
      }
      this._halte("dialog", wert);
      this._quelle.callService(id.split(".")[0], "set_value", {
        entity_id: id,
        value: wert,
      });
    };
    this._schreibeDialog = schreiben;
    const schritt = (richtung) => {
      const neu =
        Math.round(
          (Number(range.value) + richtung * Number(range.step || 1)) * 10
        ) / 10;
      const begrenzt = clamp(neu, Number(range.min), Number(range.max));
      // Am Rand des Bereichs nichts erneut senden.
      if (begrenzt === Number(range.value)) return;
      range.value = begrenzt;
      out.textContent = this._dlgText(begrenzt);
      schreiben(begrenzt);
    };

    range.addEventListener("input", () => {
      this._dialogZieht = true;
      out.textContent = this._dlgText(parseFloat(range.value));
      // Offener Wert, damit er auch ohne Aenderungsereignis ankommt.
      this._offen = {
        wert: parseFloat(range.value),
        entitaet: this._e(this._dialogKey),
      };
      if (this._offenTimer) clearTimeout(this._offenTimer);
      this._offenTimer = setTimeout(() => {
        if (this._offen) schreiben(this._offen.wert, this._offen.entitaet);
      }, 600);
    });
    range.addEventListener("change", () => {
      this._dialogZieht = false;
      schreiben(parseFloat(range.value), this._e(this._dialogKey));
    });
    sr.getElementById("dlg-minus").addEventListener("click", () => schritt(-1));
    sr.getElementById("dlg-plus").addEventListener("click", () => schritt(1));
    sr.getElementById("dlg-close").addEventListener("click", () => this._schliesseDialog());
    sr.getElementById("dialog").addEventListener("click", (ev) => {
      // Klick auf den Hintergrund schliesst, Klick im Kasten nicht.
      if (ev.target && ev.target.id === "dialog") this._schliesseDialog();
    });
  },

  /** Macht Speicher und Heizkörper anklickbar. */
  _buildKlicks() {
    const sr = this.shadowRoot;
    const fenster = [
      {
        gruppe: "unit-group",
        titel: "f_waermepumpe",
        werte: [],
        aktionen: [
          { feld: "power_state", status: "heatpump_state", typ: "schalter", an: "f_laeuft_aus", aus: "f_einschalten" },
          { feld: "force_defrost", status: "defrost", typ: "schalter", an: "f_abtauen_ende", aus: "f_abtauen_start" },
          { feld: "powerful_mode", typ: "auswahl", titel: "f_turbomodus", texte: POWERFUL_LABELS },
          { feld: "quiet_mode", typ: "auswahl", titel: "f_leisemodus", texte: QUIET_LABELS },
          { feld: "mode_select", typ: "auswahl", titel: "f_betriebsart", texte: MODE_LABELS },
        ],
      },
      {
        gruppe: "buffer-group",
        beschriftung: "label_buffer",
        werte: ["buffer_temp", "room_heater"],
        aktionen: [
          { feld: "buffer_switch", status: "buffer_installed", typ: "schalter", an: "f_puffer_aus", aus: "f_puffer_an" },
          { feld: "room_heater_switch", status: "room_heater", typ: "schalter", an: "f_hz_heizstab_ende", aus: "f_hz_heizstab_start" },
          { feld: "buffer_delta", typ: "zahl", befehl: "SetBufferDelta", titel: "f_laedt_ab", bezug: "buffer_target", vorzeichen: -1, min: 0, max: 10, schritt: 1 },
        ],
      },
      {
        gruppe: "dhw-group",
        feld: "dhw_setpoint",
        beschriftung: "label_dhw",
        werte: ["dhw_temp", "dhw_heater"],
        aktionen: [
          { feld: "dhw_force", status: "dhw_force_state", typ: "schalter", schmal: true, an: "f_aufheizen_ende", aus: "f_aufheizen_start" },
          { feld: "force_sterilization", status: "sterilization_state", typ: "schalter", schmal: true, an: "f_legionellen_ende", aus: "f_legionellen_start" },
          { feld: "dhw_heater_switch", status: "dhw_heater", typ: "schalter", schmal: true, an: "f_heizstab_aus", aus: "f_heizstab_an" },
          { feld: "dhw_heat_delta", typ: "zahl", befehl: "SetDHWHeatDelta", titel: "f_laedt_ab", bezug: "dhw_setpoint", vorzeichen: 1, min: -12, max: -2, schritt: 1 },
        ],
      },
      {
        gruppe: "hk1-group",
        feld: "hk1_setpoint",
        beschriftung: "label_hk1",
        werte: ["hk1_water"],
        anzeige: "hk1_water_target",
        aktionen: [
          { feld: "zones_select", typ: "zone", nummer: 1, schmal: true },
          { feld: "hk1_switch", typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" },
          { typ: "kurveknopf", zone: 1, schmal: true, titel: "f_heizkurve_zeigen" },
        ],
      },
      {
        gruppe: "hk2-group",
        feld: "hk2_setpoint",
        beschriftung: "label_hk2",
        werte: ["hk2_water"],
        anzeige: "hk2_water_target",
        aktionen: [
          { feld: "zones_select", typ: "zone", nummer: 2, schmal: true },
          { feld: "hk2_switch", typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" },
          { typ: "kurveknopf", zone: 2, schmal: true, titel: "f_heizkurve_zeigen" },
        ],
      },
      // HK3 und HK4 haben keine Zone der Waermepumpe, nur eigene Entitaeten.
      ...[3, 4].map((n) => ({
        gruppe: `hk${n}-group`,
        beschriftung: `label_hk${n}`,
        werte: [`hk${n}_water`, `hk${n}_pump`],
        aktionen: [
          { feld: `hk${n}_switch`, typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" },
        ],
      })),
    ];

    fenster.forEach((f) => {
      const el = sr.getElementById(f.gruppe);
      if (!el) return;
      // Anklickbar, sobald es dort etwas zu bedienen gibt.
      const hatTemperatur = Boolean(f.feld && this._e(f.feld));
      const hatAktion = (f.aktionen || []).some((a) =>
        this._e(a.feld)
      );
      // Auch reine Anzeigewerte machen die Baugruppe anklickbar, damit
      // man von dort in den Verlauf von Home Assistant springen kann.
      const hatWerte =
        !this._config.demo && (f.werte || []).some((key) => this._e(key));
      if (!hatTemperatur && !hatAktion && !hatWerte) return;
      el.classList.add("klickbar");
      el.addEventListener("click", () => this._oeffneDialog(f));
    });

    // Werte in der Grafik: ein Klick oeffnet den Verlauf von Home
    // Assistant. Im Demomodus entfaellt das, dort gibt es keinen Verlauf.
    if (!this._config.demo) {
      const anzeigen = {
        "outside-v": "outside_temp",
        "comp-v": "compressor",
        "fan1-rpm": "fan1_rpm",
        "fan2-rpm": "fan2_rpm",
        "power-now-v": "power_now",
        "energy-today-v": "energy_today",
        "unit-flow-v": "flow_temp",
        "unit-ret-v": "return_temp",
        "pump-v": "pump_speed",
        "flow-v": "pump_flow",
        "press-v": "water_pressure",
        "valve-v": "three_way_valve",
        "pv-v": "pv_power",
        "buf-v": "buffer_temp",
        "dhw-v": "dhw_temp",
        "zirk-v": "circulation_pump",
        "zirk-name": "circulation_pump",
        "hk1-water-v": "hk1_water",
        "hk1-pump-v": "hk1_pump",
        "hk2-water-v": "hk2_water",
        "hk2-pump-v": "hk2_pump",
        "hk3-water-v": "hk3_water",
        "hk3-pump-v": "hk3_pump",
        "hk4-water-v": "hk4_water",
        "hk4-pump-v": "hk4_pump",
        "kamin-v": "kamin_temp",
        "kamin-pump-v": "kamin_pump",
        "solar-v": "solar_temp",
        "solar-pump-v": "solar_pump",
      };
      Object.entries(anzeigen).forEach(([id, feld]) => {
        const el = sr.getElementById(id);
        if (!el || !this._e(feld)) return;
        el.classList.add("klickbar");
        el.addEventListener("click", (ev) => {
          // Sonst oeffnet zusaetzlich das Fenster der Baugruppe.
          ev.stopPropagation();
          this._mehrInfo(this._e(feld));
        });
      });
    }

    // Zirkulations-Pumpe: Direkter Schalter ohne Dialog
    const zirkEl = sr.getElementById("zirkulation-group");
    if (zirkEl && this._e("circ_switch")) {
      zirkEl.classList.add("klickbar");
      zirkEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._schaltCircSwitch();
      });
    }
  },

  _schaltCircSwitch() {
    const switchId = this._e("circ_switch");
    if (!switchId) return;

    const state = this._hass.states[switchId];
    const currentState = state ? state.state : "off";
    const newState = currentState === "on" ? "off" : "on";

    this._hass.callService("homeassistant", "turn_" + newState, {
      entity_id: switchId,
    });
  },

  _oeffneDialog(f) {
    const sr = this.shadowRoot;
    const tempId = f.feld ? this._e(f.feld) : "";
    this._dialogKey = tempId && this._quelle.states[tempId] ? f.feld : null;
    this._dialogAnzeige = f.anzeige || null;
    // Zwischenueberschriften und die Zonenwahl haben kein Feld und
    // bleiben immer erhalten. Bei der Heizkurve zaehlt der Feldname der
    // gerade gewaehlten Zone.
    this._dialogAktionen = (f.aktionen || []).filter((a) =>
      !a.feld ? true : Boolean(this._e(a.feld))
    );
    this._dialogGruppen = f.werte || [];
    if (this._gehalten) delete this._gehalten["dialog"];

    sr.getElementById("dlg-title").textContent =
      (f.titel && this._t(f.titel)) || this._name(f.beschriftung) || this._t("f_einstellen");
    const reglerFeld = sr.getElementById("dlg-temp");
    reglerFeld.hidden = !this._dialogKey;
    const reglerKann = this._dialogKey && stellbar(this._e(this._dialogKey));
    reglerFeld.classList.toggle("nur-lesbar", !reglerKann);
    sr.querySelectorAll("#dlg-temp input, #dlg-temp button").forEach((e) => {
      e.disabled = !reglerKann;
    });
    this._baueAktionen();
    this._baueWerte();
    sr.getElementById("dialog").hidden = false;
    this._syncDialog();
    this._syncDemo();
  },

  /**
   * Ermittelt den Zustand eines Bedienelements.
   * Die Statusquelle hat Vorrang, denn ein Schaltbefehl meldet seinen
   * Zustand nicht immer zurueck. Liefert sie nichts, gilt der Schalter.
   * Rueckgabe null, wenn beides unbekannt ist.
   */
  _zustand(a) {
    const pruefe = (feld) => {
      if (!feld) return null;
      const id = this._e(feld);
      if (!id) return null;
      const roh = rawState(this._quelle, id);
      if (roh === null || roh === "unknown" || roh === "unavailable") return null;
      return isOn(this._quelle, id);
    };
    // Nur gelesene Werte, nichts wird angenommen.
    // Zuerst das Rueckmeldetopic, danach die Schaltentitaet.
    const ausStatus = pruefe(a.status);
    if (ausStatus !== null) return ausStatus;
    return pruefe(a.feld);
  },

  /** Baut die Bedienelemente des offenen Fensters auf. */
  /**
   * Oeffnet das Verlaufsfenster von Home Assistant zu einer Entitaet.
   * Das Frontend lauscht auf hass-more-info und erwartet die Kennung
   * im Feld entityId. Das Ereignis muss die Schattengrenze verlassen
   * duerfen, daher bubbles und composed.
   */
  _mehrInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  },

  /**
   * Listet unter den Schaltflaechen alle Entitaeten der Baugruppe auf.
   * Ein Klick oeffnet den Verlauf von Home Assistant.
   */
  _baueWerte() {
    const host = this.shadowRoot.getElementById("dlg-werte");
    if (!host) return;
    const gruppen = this._dialogGruppen || [];
    // Im Demomodus zeigen die Felder auf erfundene Entitaeten. Dafuer
    // gibt es in Home Assistant keinen Verlauf, darum entfaellt die Liste.
    // Aufgefuehrt wird nur, was zur jeweiligen Baugruppe gehoert und
    // wovon ein Verlauf etwas aussagt. Die Reihenfolge folgt der Liste.
    const felder = this._config.demo
      ? []
      : gruppen
          .map((key) => ENTITY_FIELDS.find((f) => f.key === key))
          .filter((f) => f && this._quelle.states[this._e(f.key)]);
    if (!felder.length) {
      host.innerHTML = "";
      return;
    }
    host.innerHTML =
      `<div class="lhc-field-label">${escapeHtml(this._t("r_verlauf_zeigen"))}</div>` +
      felder
        .map(
          (f, i) =>
            `<button type="button" class="lhc-wert" id="dlg-w${i}">
               <span>${escapeHtml(feldText(f, this._sp()))}</span>
               <b id="dlg-w${i}-v"></b>
             </button>`
        )
        .join("");
    felder.forEach((f, i) => {
      const el = this.shadowRoot.getElementById(`dlg-w${i}`);
      const wert = this.shadowRoot.getElementById(`dlg-w${i}-v`);
      const id = this._e(f.key);
      const st = this._quelle.states[id];
      if (wert && st) {
        // Temperaturunterschiede in K zeigt die Karte verstaendlicher in °C.
        const rohEinheit = (st.attributes && st.attributes.unit_of_measurement) || "";
        const einheit = rohEinheit === "K" ? "°C" : rohEinheit;
        const zahl = parseFloat(st.state);
        let text = st.state;
        if (!Number.isNaN(zahl) && /^[-\d.,\s]+$/.test(st.state)) {
          // Temperatur und Druck mit einer Nachkommastelle, alles andere
          // ohne. Sonst erscheint etwa 26.788 W, was im Deutschen wie
          // 26788 W gelesen wird.
          const stellen = ["°C", "bar"].includes(einheit) ? 1 : 0;
          text = zahl.toFixed(stellen).replace(".", DEZIMAL);
        }
        wert.textContent = einheit ? `${text} ${einheit}` : text;
      }
      if (el) el.addEventListener("click", () => this._mehrInfo(id));
    });
  },

  _baueAktionen() {
    const host = this.shadowRoot.getElementById("dlg-actions");
    const liste = this._dialogAktionen || [];
    host.innerHTML = liste
      .map((a, i) =>
        a.typ === "auswahl"
          ? `<label class="lhc-dialog-select">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <select id="dlg-a${i}"></select>
             </label>`

          : a.typ === "kurveknopf"
          ? `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">${escapeHtml(this._t(a.titel))}</button>`
          : a.typ === "zahl"
          ? `<div class="lhc-num-kompakt">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-minus"
                       aria-label="${this._t("s_kleiner")}">&minus;</button>
               <output id="dlg-a${i}">--</output>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-plus"
                       aria-label="${this._t("s_groesser")}">+</button>
             </div>`
          : `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">--</button>`
      )
      .join("");

    liste.forEach((a, i) => {
      const el = this.shadowRoot.getElementById(`dlg-a${i}`);
      if (!el) return;
      if (a.typ === "auswahl") {
        el.addEventListener("change", () => {
          const id = this._e(a.feld);
          this._quelle.callService("select", "select_option", {
            entity_id: id,
            option: el.value,
          });
        });
      } else if (a.typ === "kurveknopf") {
        const k = this.shadowRoot.getElementById(`dlg-a${i}`);
        if (k) {
          k.addEventListener("click", () => {
            this.shadowRoot.getElementById("dialog").hidden = true;
            this._oeffneKurve(a.zone || 1);
          });
        }
      } else if (a.typ === "zahl") {
        // Schrittweise verstellen, begrenzt auf den zulaessigen Bereich.
        const stelle = (richtung) => {
          const feld = a.feld;
          const id = this._e(feld);
          if (!id) return;
          const kannEntitaet = stellbar(id);
          if (!kannEntitaet && !a.befehl) return;
          // Ausgangspunkt ist der zuletzt gesendete Wert, sonst zaehlt
          // mehrfaches Druecken nicht weiter, solange die Anlage den
          // alten Wert meldet.
          const ist = numState(this._quelle, id);
          const gehalten = this._gehaltenerWert(id, ist);
          const jetzt = gehalten !== null ? gehalten : ist;
          if (jetzt === null) return;
          const schritt = a.schritt || 1;
          // Das Plus soll immer die angezeigte Temperatur erhoehen.
          // Beim Puffer wird die Hysterese abgezogen, dort dreht sich
          // die Richtung deshalb um.
          const neu = clamp(
            Math.round((jetzt + richtung * (a.vorzeichen || 1) * schritt) * 10) / 10,
            a.min,
            a.max
          );
          if (neu === jetzt) return;
          // Der neue Wert wird sofort angezeigt und gehalten, bis die
          // Anlage ihn zurueckmeldet. Sonst wirkt die Bedienung traege.
          this._halte(id, neu);
          if (kannEntitaet) {
            this._quelle.callService(id.split(".")[0], "set_value", {
              entity_id: id,
              value: neu,
            });
            this._syncAktionen();
            return;
          }
          // Rueckfall: HeishaMon nimmt den Wert ueber seinen Befehlskanal
          // entgegen.
          const praefix = this._config.mqtt_prefix || "panasonic_heat_pump";
          const nutzlast = String(neu);
          this._quelle.callService("mqtt", "publish", {
            topic: `${praefix}/commands/${a.befehl}`,
            payload: nutzlast,
          });
          this._syncAktionen();
        };
        const minus = this.shadowRoot.getElementById(`dlg-a${i}-minus`);
        const plus = this.shadowRoot.getElementById(`dlg-a${i}-plus`);
        if (minus) minus.addEventListener("click", () => stelle(-1));
        if (plus) plus.addEventListener("click", () => stelle(1));
      } else if (a.typ === "zone") {
        el.addEventListener("click", () => this._zoneSchalten(a.nummer));
      } else {
        el.addEventListener("click", () => {
          const id = this._e(a.feld);
          const an = this._zustand(a);
          this._quelle.callService("homeassistant", an === true ? "turn_off" : "turn_on", {
            entity_id: id,
          });
        });
      }
    });
  },

  /** Haelt die Bedienelemente auf dem aktuellen Stand. */
  _syncAktionen() {
    const liste = this._dialogAktionen || [];
    // Gruen bedeutet eingeschaltet, rot ausgeschaltet, grau unbekannt.
    const farbeSetzen = (el, zustand) => {
      el.classList.toggle("is-an", zustand === true);
      el.classList.toggle("is-aus", zustand === false);
    };
    liste.forEach((a, i) => {
      const el = this.shadowRoot.getElementById(`dlg-a${i}`);
      const st = this._quelle.states[this._e(a.feld)];
      if (!el) return;
      if (a.typ === "kurveknopf") return;
      if (a.typ !== "zone" && !st) return;
      if (a.typ === "zahl") {
        // Nur lesbare Entitaeten lassen sich nicht stellen. Die Knoepfe
        // bleiben sichtbar, aber ausgegraut, und die Beschriftung sagt
        // warum. Sonst wirkt es wie ein Fehler der Karte.
        const feldName = a.feld;
        const kann = stellbar(this._e(feldName)) || Boolean(a.befehl);
        [`dlg-a${i}-minus`, `dlg-a${i}-plus`].forEach((kid) => {
          const k = this.shadowRoot.getElementById(kid);
          if (k) k.disabled = !kann;
        });
        const beschriftung = el.parentElement
          ? el.parentElement.querySelector(".lhc-field-label")
          : null;
        if (beschriftung) {
          const hinweis = this._t("f_nur_lesbar");
          const rein = beschriftung.textContent.replace(hinweis, "");
          beschriftung.textContent = kann ? rein : rein + hinweis;
        }
        // Angezeigt wird die Temperatur, ab der geladen wird, nicht die
        // rohe Differenz. Das ist die Angabe, die im Alltag zaehlt.
        const idFeld = this._e(feldName);
        const istWert = numState(this._quelle, idFeld);
        const gehalten = this._gehaltenerWert(idFeld, istWert);
        const roh = gehalten !== null ? gehalten : istWert;
        const ziel = a.bezug ? numState(this._quelle, this._e(a.bezug)) : null;
        el.textContent =
          roh === null
            ? "--"
            : ziel === null
            ? `${fmt(roh, 0)} ${a.einheit || "°C"}`
            : `${fmt(ziel - Math.abs(roh), 0)} °C`;
        return;
      }
      if (a.typ === "auswahl") {
        const optionen = st.attributes.options || [];
        const kennung = optionen.join("|");
        if (el.dataset.kennung !== kennung) {
          el.innerHTML = optionen
            .map(
              (o) =>
                `<option value="${escapeHtml(o)}">${escapeHtml(
                  a.texte[o] !== undefined ? wertText(a.texte[o], this._sp()) : o
                )}</option>`
            )
            .join("");
          el.dataset.kennung = kennung;
        }
        if (el.value !== st.state) el.value = st.state;
      } else if (a.typ === "zone") {
        const aktiv = this._zoneAktiv(a.nummer);
        const andere = this._zoneAktiv(a.nummer === 1 ? 2 : 1);
        el.textContent =
          aktiv === null
            ? this._t("r_zonen_unbekannt")
            : aktiv
            ? this._t("f_zone_aus")
            : this._t("f_zone_an");
        // Der letzte verbleibende Kreis laesst sich nicht abschalten.
        el.disabled = aktiv === true && andere !== true;
        if (el.disabled) el.textContent = this._t("r_einziger_kreis");
        farbeSetzen(el, el.disabled ? null : aktiv);
      } else {
        const an = this._zustand(a);
        el.textContent =
          an === null
            ? `${this._t(a.aus)} (${this._t("unbekannt")})`
            : this._t(an ? a.an : a.aus);
        farbeSetzen(el, an);
      }
    });
  },

  _schliesseDialog() {
    // Noch nicht abgesendeten Wert vor dem Schliessen nachreichen.
    if (this._offen && this._schreibeDialog) {
      this._schreibeDialog(this._offen.wert, this._offen.entitaet);
    }
    this._offen = null;
    if (this._offenTimer) {
      clearTimeout(this._offenTimer);
      this._offenTimer = null;
    }
    this._dialogKey = null;
    this._dialogAnzeige = null;
    this._dialogAktionen = null;
    this._dialogZieht = false;
    this.shadowRoot.getElementById("dialog").hidden = true;
  },

  /** Haelt das offene Fenster auf dem aktuellen Stand. */
  _syncDialog() {
    if (this.shadowRoot.getElementById("dialog").hidden) return;
    this._syncAktionen();
    if (!this._dialogKey) return;
    const sr = this.shadowRoot;
    const st = this._quelle.states[this._e(this._dialogKey)];
    if (!st) return this._schliesseDialog();
    const range = sr.getElementById("dlg-range");

    // Bei den Heizkreisen hat der stellbare Wert (TOP27, TOP34) zwei
    // Bedeutungen. Im Heizkurvenbetrieb (TOP76 = 0) ist er die
    // Verschiebung der Kurve von -5 bis +5 K, im Direktbetrieb die
    // Wassertemperatur. HeishaMon by Lutarym meldet die Betriebsart im
    // Attribut "modus" und passt min und max an.
    const a = st.attributes || {};
    const wert = parseFloat(st.state);
    if (Number.isNaN(wert)) return;
    let lo = Number(a.min !== undefined ? a.min : 15);
    let hi = Number(a.max !== undefined ? a.max : 65);
    const modus = a.modus === undefined || a.modus === null ? null : Number(a.modus);
    let versch = false;
    if (this._dialogAnzeige) {
      if (modus === 0) versch = true;
      else if (modus === null && lo >= -5 && hi <= 5 && lo < 0) versch = true;
      else if (modus === null && lo <= -5 && hi >= 20) {
        // Betriebsart unbekannt: der Wert selbst zeigt, welcher Bereich gilt.
        versch = wert >= -5 && wert <= 5;
      }
      if (versch) {
        lo = Math.max(lo, -5);
        hi = Math.min(hi, 5);
      } else if (lo <= -5 && hi >= 20) {
        // Gemeinsamer Bereich bei unbekannter Betriebsart: direkt ab 20 °C.
        lo = 20;
      }
    }
    this._dialogEinheit = versch ? "K" : "°C";
    range.min = lo;
    range.max = hi;
    range.step = Number(a.step !== undefined ? a.step : 1);
    sr.getElementById("dlg-min").textContent = this._dlgText(lo);
    sr.getElementById("dlg-max").textContent = this._dlgText(hi);
    // Im Heizkurvenbetrieb steht darunter, welche Wassertemperatur sich
    // aus Kurve und Verschiebung ergibt.
    let hinweis = "";
    if (versch) {
      const ziel = numState(this._quelle, this._e(this._dialogAnzeige));
      hinweis = this._t("s_versch") +
        (ziel === null ? "" : ` · ${tf(this._t("s_ziel"), { v: fmt(ziel, 0) })}`);
    }
    sr.getElementById("dlg-hinweis").textContent = hinweis;
    if (this._dialogZieht) return;
    const gehalten = this._gehaltenerWert("dialog", wert);
    const zeigen = clamp(gehalten !== null ? gehalten : wert, lo, hi);
    range.value = zeigen;
    sr.getElementById("dlg-value").textContent = this._dlgText(zeigen);
  },

  /** Wert im Stellfenster mit Einheit. Eine Verschiebung mit Vorzeichen. */
  _dlgText(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "--";
    const zahl = String(v).replace(".", DEZIMAL);
    if (this._dialogEinheit === "K") return `${v > 0 ? "+" : ""}${zahl} °C`;
    return `${zahl} °C`;
  },
};
