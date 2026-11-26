/**
 * Aktualisiert Werte, Farben und Animationen bei jeder Aenderung.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { abtauZustand, animationAn, attr, clamp, drehzahlWert, fmt, inLiterJeMinute, isOn, loadColor, numState, rawState, schreibAttr, schreibStil, schreibText, thermalColor, verdichterWert, warmwasserZustand } from "../hilfsfunktionen.js";
import { BUBBLE_COUNT, COMP_MAX_HZ, COMP_MIN_HZ, DRUCK_MAX, DRUCK_MIN, LUEFTER_UPM_JE_PROZENT, MODE_LABELS, NEUTRAL, PUMP_SECONDS, SG_STATES, VALVE_LABELS } from "../konstanten.js";
import { tf, wertText } from "../texte.js";
import { inKwh, inWatt } from "./netzstrom.js";
import { HK, QUELLE } from "../namen.js";
import { AUTO_PROFIL, bereitFuer, profileFehler, profilKennung } from "../profile.js";

export const aktualisierenKarte = {
  _sgMode() {
    const k1 = this._e("EXT100");
    const k2 = this._e("EXT101");
    if (!k1 || !k2) return null;
    const unklar = [null, "unknown", "unavailable", ""];
    if (unklar.includes(rawState(this._quelle, k1))) return null;
    if (unklar.includes(rawState(this._quelle, k2))) return null;
    const a = isOn(this._quelle, k1);
    const b = isOn(this._quelle, k2);
    if (a === null || b === null) return null;
    if (a && !b) return 1;
    if (!a && !b) return 2;
    if (!a && b) return 3;
    return 4;
  },

  /**
   * Blendet in Puffer und Warmwasser die Zeilen "Ziel" und "Laedt ab"
   * nach der Konfiguration aus. Die verbleibenden Zeilen ruecken nach
   * oben, damit keine Luecke entsteht. Abstand und Startpunkt kommen aus
   * der gezeichneten Grafik, das gilt fuer Quer- und Hochformat.
   */
  _speicherZeilen(name) {
    const zeilen = [
      { el: this._animEl(`${name}-sp`), zeigen: this._config.show_target !== false },
      { el: this._animEl(`${name}-delta`), zeigen: this._config.show_reload !== false },
    ];
    if (zeilen.some((z) => !z.el)) return;
    zeilen.forEach((z) => {
      if (z.el.dataset.y0 === undefined) z.el.dataset.y0 = z.el.getAttribute("y");
    });
    const start = Number(zeilen[0].el.dataset.y0);
    const abstand = Number(zeilen[1].el.dataset.y0) - start;
    let i = 0;
    zeilen.forEach((z) => {
      if (!z.zeigen) {
        schreibText(z.el, "");
        return;
      }
      schreibAttr(z.el, "y", String(start + i * abstand));
      i++;
    });
  },

  /**
   * Rahmen der Heizkurve. Der Klick oeffnet das Fenster mit den vier
   * Eckwerten. Gezeichnet wird die Kurve spaeter aus den Entitaeten.
   */
  /**
   * Ob gerade Warmwasser geladen wird. Das Dreiwegeventil ist die
   * verlaessliche Quelle, ersatzweise die Betriebsart: 3 heisst
   * "Nur Warmwasser".
   */
  _ladtWarmwasser(hass) {
    const v = warmwasserZustand(rawState(hass, this._e("TOP20")));
    if (v !== null) return v;
    return numState(hass, this._e("TOP4")) === 3;
  },

  /* -------------------- Aktualisierung -------------------- */
  /** Werte, Farben und Animationszustaende der Grafik (_update in karte.js). */
  _updateGrafik() {
    const hass = this._quelle;
    if (!hass) return;
    const min = Number(this._config.scale_min);
    const max = Number(this._config.scale_max);
    const col = (v) => thermalColor(v, min, max);
    const animate = animationAn(this._config);

    const set = (id, text) => {
      const el = this._animEl(id);
      if (el) schreibText(el, text);
    };
    const paint = (id, color) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "stop-color", color);
    };
    const zeige = (id, sichtbar) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "opacity", sichtbar ? "1" : "0");
    };
    const abzeichen = (id, aktiv) => {
      const el = this._animEl(id);
      if (!el) return;
      el.classList.toggle("is-on", aktiv);
      if (aktiv && animate) {
        this._animState.set(id, { type: "pulse", duration: 2.2 });
      } else {
        this._animState.delete(id);
      }
    };
    // Schaltet die Laufstriche eines Leitungsabschnitts.
    // Die laufenden Striche tragen die Temperatur des Wassers, das
    // dort gerade fliesst. Animation läuft via requestAnimationFrame.
    const stroemt = (ids, an, farbe) => {
      ids.forEach((id) => {
        const el = this._animEl(id);
        if (!el) return;
        const aktiv = animate && laeuft && an === true;
        el.classList.toggle("is-on", aktiv);
        if (farbe) schreibStil(el, "stroke", farbe);
        if (aktiv) {
          const isRev = el.classList.contains("rev");
          this._animState.set(id, { type: "flow", reverse: isRev });
        } else {
          this._animState.delete(id);
          schreibAttr(el, "stroke-dashoffset", "0");
        }
      });
    };

    /* Sichtbarer Hinweis, wenn ueberhaupt keine Entitaet gefunden wurde.
       Sonst zeigt die Karte nur Striche und man sucht an der falschen Stelle. */
    const pflicht = ["TOP14", "TOP8", "TOP6", "TOP5", "TOP46", "TOP10"];
    const gefunden = pflicht.filter((k) => {
      const id = this._e(k);
      return id && hass.states[id] !== undefined;
    }).length;
    const hinweis = this._animEl("hinweis");
    if (hinweis) {
      // Solange die Profile laden, gibt es noch keinen Hinweis.
      const laedt = !bereitFuer(this._config);
      hinweis.hidden = gefunden > 0 || this._config.demo === true || laedt;
      if (gefunden === 0 && !laedt) {
        // Bei "auto" ohne passendes Profil fragt die Karte nach einem Profil.
        // Konnten die Profile nicht laden, sagt sie das.
        const ohneVariante = !this._variante();
        const auto = profilKennung(this._config) === AUTO_PROFIL;
        const text = ohneVariante && profileFehler(this._config) ? "s_profile_fehler" : ohneVariante && auto ? "s_kein_profil" : "s_keine_ent";
        hinweis.textContent = this._t(text);
      }
    }

    /* Störung */
    const err = rawState(hass, this._e("TOP44"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    const stoerung = err !== null && !harmlos.includes(err);
    const alertEl = this._animEl("alert");
    if (alertEl) {
      alertEl.hidden = !stoerung;
      if (stoerung) schreibText(alertEl, tf(this._t("s_stoerung"), { v: err }));
    }

    /* Außenfühler */
    const outside = numState(hass, this._e("TOP14"));
    const oMin = Number(this._config.outdoor_min);
    const oMax = Number(this._config.outdoor_max);
    const outColor = thermalColor(outside, oMin, oMax);
    set("outside-v", outside === null ? "--" : `${fmt(outside)} °C`);
    const aussenEl = this._animEl("outside-v");
    if (aussenEl) schreibStil(aussenEl, "fill", outColor);

    /* Außengerät */
    const vd = verdichterWert(hass, this._e("TOP8"), this._einheit("TOP8", "Hz", hass));
    const comp = vd.wert;
    let compText = "--";
    if (comp !== null) {
      compText = vd.nurAnAus
        ? wertText(comp > 0 ? "läuft" : "aus", this._sp())
        : `${fmt(comp, 0)}${vd.einheit ? ` ${vd.einheit}` : ""}`;
    }
    set("comp-v", compText);
    const compEl = this._animEl("comp-v");
    if (compEl) {
      const prozent = vd.einheit === "%";
      const last = vd.nurAnAus ? (comp > 0 ? COMP_MAX_HZ : 0) : comp;
      schreibStil(compEl, "fill", loadColor(last, prozent ? 0 : COMP_MIN_HZ, prozent ? 100 : COMP_MAX_HZ));
    }

    // Meldet die Waermepumpe ausdruecklich aus, steht alles still.
    // Bei unbekanntem Zustand wird nichts gesperrt, sonst waere die
    // Karte tot, nur weil ein Topic fehlt.
    const anAus = (() => {
      const ausStatus = (feld) => {
        const id = this._e(feld);
        if (!id) return null;
        const roh = rawState(hass, id);
        if (roh === null || roh === "unknown" || roh === "unavailable") return null;
        return isOn(hass, id);
      };
      const ausTopic = ausStatus("TOP0");
      return ausTopic !== null ? ausTopic : ausStatus("SET1");
    })();
    const laeuft = anAus !== false;

    // Drehzahl in U/min oder, je nach Integration, in Prozent (EMS-ESP).
    // Bei Prozent steht % am Wert, die Bewegung rechnet LUEFTER_UPM_JE_PROZENT.
    const luefter = (rotor, feld, label) => {
      const d = drehzahlWert(hass, this._e(feld), this._einheit(feld, "", hass));
      this._spin(rotor, d.wert, label, d.prozent ? "%" : this._t("r_upm"), 0, laeuft, d.prozent ? LUEFTER_UPM_JE_PROZENT : 1);
    };
    luefter("fan1", "TOP62", "fan1-rpm");
    if (this._config.fan_count === 2) {
      luefter("fan2", "TOP63", "fan2-rpm");
    }
    const glow = this._animEl("unit-glow");
    if (glow) {
      // Eine Stoerung hat Vorrang vor der Betriebsanzeige.
      const glowStoerung = animate && stoerung;
      const glowBetrieb = animate && laeuft && comp !== null && comp > 0;
      const glowAn = glowStoerung || glowBetrieb;
      schreibAttr(glow, "stroke", glowStoerung ? "#EF4444" : "#22C55E");
      if (glowAn) {
        this._animState.set("unit-glow", {
          type: "pulse",
          duration: glowStoerung ? 1.2 : 2.6,
          min: 0.05,
          max: 1,
        });
      } else {
        this._animState.delete("unit-glow");
        schreibAttr(glow, "opacity", "0");
      }
    }

    /* SG Ready */
    const sgGroup = this._animEl("sg-group");
    if (sgGroup) {
      const konfiguriert = Boolean(this._e("EXT100")) && Boolean(this._e("EXT101"));
      schreibAttr(sgGroup, "opacity", konfiguriert ? "1" : "0");
      if (konfiguriert) {
        const sg = this._sgMode();
        const info = SG_STATES[sg];
        const farbe = info ? info.farbe : NEUTRAL;
        set("sg-text", sg === null ? this._t("unbekannt") : this._t(info.kurz));
        const t = this._animEl("sg-text");
        if (t) {
          // Das helle Grau fuer "Normal" folgt der Farbdarstellung.
          const stil = farbe === "#C3D0E0" ? "var(--c-c3d0e0)" : farbe;
          schreibStil(t, "fill", stil);
          schreibStil(t, "color", stil);
        }
        for (let i = 1; i <= 4; i++) {
          const seg = this._animEl(`sg-seg-${i}`);
          if (!seg) continue;
          const aktiv = sg === i;
          // Das zutreffende Segment wird hoeher und leuchtet, die
          // uebrigen bleiben flach und gedaempft.
          schreibAttr(seg, "fill", aktiv ? farbe : "#3A4658");
          schreibAttr(seg, "height", aktiv ? "17" : "11");
          schreibAttr(seg, "y", aktiv ? "-3" : "0");
          schreibStil(seg, "color", farbe);
          seg.classList.toggle("is-active", aktiv);
        }
      }
    }

    /* Stromverbrauch, nur sichtbar wenn ein Wert vorliegt */
    // Einheit der Entitaet beachten: Leistung in W oder kW, Energie in Wh, kWh oder MWh.
    const einheit = (k) => this._einheit(k, "", hass);
    const leistungRoh = numState(hass, this._e("EXT1"));
    const leistung = leistungRoh === null ? null : inWatt(leistungRoh, einheit("EXT1"));
    const energieRoh = numState(hass, this._e("EXT2"));
    const energie = energieRoh === null ? null : inKwh(energieRoh, einheit("EXT2"));
    zeige("verbrauch-group", leistung !== null || energie !== null);
    set("power-now-v", leistung === null ? "--" : `${fmt(leistung / 1000, 2)} kW`);
    // Tagesverbrauch, sofern der Stand von Mitternacht bekannt ist.
    let energieAnzeige = energie;
    if (this._config.energy_daily !== false && energie !== null) {
      this._ladeTagesstart();
      // Nur der Stand von heute null Uhr. Nach Mitternacht gilt bis zum
      // Nachladen der Gesamtstand, sonst stuende dort der Verbrauch seit gestern.
      const heute = new Date();
      heute.setHours(0, 0, 0, 0);
      if (this._tagStart !== undefined && this._tagStartTag === heute.getTime() && energie >= this._tagStart) {
        energieAnzeige = energie - this._tagStart;
      }
    }
    set(
      "energy-today-v",
      energieAnzeige === null ? "--" : `${fmt(energieAnzeige, 1)} kWh`
    );
    // Die Beschriftung sagt, was der Wert wirklich ist. Eigene Angabe
    // hat Vorrang, sonst entscheidet der tatsaechliche Rechenweg.
    const tagesWert = energieAnzeige !== null && energieAnzeige !== energie;
    set(
      "energy-label",
      this._config.label_energy
        ? this._config.label_energy
        : tagesWert
        ? this._t("s_verbrauch_heute")
        : this._t("s_zaehler")
    );

    /* Zirkulationspumpe */
    const zirkId = this._e("EXT400");
    const zirkAn = isOn(hass, zirkId) === true;
    zeige("zirkulation-group", this._zeigtZirkulation(hass));
    set("zirk-v", !zirkId ? "--" : wertText(zirkAn ? "läuft" : "aus", this._sp()));
    // Der Zustand steht im Namen: "Zirkulation · aus". So liegt er nicht
    // links neben der Pumpe, wo bei den Heizkreisen nichts steht.
    set(
      "zirk-name",
      zirkId
        ? `${this._t("zirkulation")} · ${wertText(zirkAn ? "läuft" : "aus", this._sp())}`
        : this._t("zirkulation")
    );
    const zirkRotor = this._animEl("zirk-rotor");
    if (zirkRotor) {
      zirkRotor.classList.toggle("is-still", !zirkAn);
      if (zirkAn && animate && laeuft) {
        // Vorhandenen Eintrag behalten, sonst faengt der Winkel bei jedem
        // Zustandsabgleich wieder bei null an und der Rotor ruckelt.
        const da = this._animState.get("zirk-rotor");
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set("zirk-rotor",
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
      } else {
        this._animState.delete("zirk-rotor");
      }
    }

    /* Netzstrom der Waermepumpe heute (statt PV-Leistung), netzstrom.js */
    this._zeigeNetz();

    /* Temperaturen und Leitungsfarben */
    const flow = numState(hass, this._e("TOP6"));
    const ret = numState(hass, this._e("TOP5"));
    const buf = numState(hass, this._e("TOP46"));
    const dhw = numState(hass, this._e("TOP10"));

    // Beide Temperaturen zusaetzlich als Zahl im Gehaeuse, thermisch gefaerbt.
    set("unit-flow-v", flow === null ? "--" : `${fmt(flow)} °C`);
    set("unit-ret-v", ret === null ? "--" : `${fmt(ret)} °C`);
    // Die Farbe steht fest im Stil, rot fuer Vorlauf und blau fuer Ruecklauf.

    paint("bg-top", col(buf));
    paint("bg-bottom", col(buf === null ? null : buf - 4));
    set("buf-v", buf === null ? "--" : `${fmt(buf)} °C`);
    // TOP7 ist der Vorlaufsollwert der Anlage. Waehrend der
    // Warmwasserladung gilt er dem Speicher, nicht dem Puffer, und
    // springt dann auf dessen Ladetemperatur. In dieser Zeit wird er
    // hier nicht als Pufferziel ausgegeben, das waere irrefuehrend.
    const wwLaeuft = this._ladtWarmwasser(hass);
    // Waehrend der Warmwasserladung gilt TOP7 dem Speicher und springt
    // auf dessen Ladetemperatur. Dann bleibt das zuletzt gueltige
    // Pufferziel stehen, statt eines falschen Wertes oder eines Hinweises.
    let wpSoll = numState(hass, this._e("TOP7"));
    if (wwLaeuft) {
      wpSoll = this._letztesPufferZiel !== undefined ? this._letztesPufferZiel : null;
    } else if (wpSoll !== null) {
      this._letztesPufferZiel = wpSoll;
    }
    // Panasonic: Pufferziel = hoechstes Soll der aktiven Heizkreise plus
    // Puffer-Delta-T (TOP113, 0 bis 10 K). Die Waermepumpe selbst faehrt
    // auf TOP7. Ohne TOP113 zeigt "Ziel" wie bisher den zugeordneten Wert.
    const bDelta = numState(hass, this._e("TOP113"));
    const kreisSoll = this._kreisSoll(hass);
    const pufferZiel = bDelta !== null && kreisSoll !== null ? kreisSoll + bDelta : bDelta === null ? wpSoll : null;
    set("buf-sp", pufferZiel === null ? "" : tf(this._t("s_ziel"), { v: fmt(pufferZiel, 0) }));
    set("buf-delta", bDelta === null || wpSoll === null ? "" : tf(this._t("s_wp_soll"), { v: fmt(wpSoll, 0) }));
    // Der COP steht hinter der Tuer. Abgefragt wird er hier, damit der
    // Wert seit Mitternacht geladen ist, wenn die Tuer aufgeht.
    this._cop(hass, "EXT600");
    // TOP58 und TOP59 sind nur die Freigabe. Ob ein Heizstab heizt,
    // melden TOP60 (intern) und TOP61 (extern). Das Abzeichen erscheint
    // in dem Speicher, auf den das Dreiwegeventil gerade stellt.
    const heizstabLaeuft =
      isOn(hass, this._e("TOP60")) === true ||
      isOn(hass, this._e("TOP61")) === true;
    abzeichen("roomheater-badge", heizstabLaeuft && !wwLaeuft);

    const dhwSp = numState(hass, this._e("TOP9"));
    paint("dhw-top", col(dhw));
    paint("dhw-bottom", col(dhw === null ? null : dhw - 6));
    set("dhw-v", dhw === null ? "--" : `${fmt(dhw)} °C`);
    set("dhw-sp", dhwSp === null ? "" : tf(this._t("s_ziel"), { v: fmt(dhwSp, 0) }));
    this._cop(hass, "EXT601");
    this._tuerCopAuffrischen();
    // TOP22 ist negativ und sagt, wie weit das Warmwasser unter den
    // Sollwert fallen darf. Angezeigt wird daraus die Temperatur, ab
    // der nachgeladen wird, das ist die eigentlich nuetzliche Angabe.
    const wDelta = numState(hass, this._e("TOP22"));
    set(
      "dhw-delta",
      wDelta === null || dhwSp === null
        ? wDelta === null
          ? ""
          : ""
        : tf(this._t("s_laedt_ab"), { v: fmt(dhwSp - Math.abs(wDelta), 0) })
    );
    abzeichen("dhwheater-badge", heizstabLaeuft && wwLaeuft);
    const tuerKnopf = this._animEl("tuer-knopf");
    if (tuerKnopf) {
      tuerKnopf.style.display =
        this._config.show_door !== false && this._tuerFelder().length ? "" : "none";
    }
    const hilfeKnopf = this.shadowRoot.getElementById("hilfe-knopf");
    if (hilfeKnopf) schreibStil(hilfeKnopf, "display", this._config.show_help === false || !this._hilfePasst() ? "none" : "");
    this._speicherZeilen("buf");
    this._speicherZeilen("dhw");
    // TOP2 meldet das einmalige Aufheizen, TOP69 den Legionellenschutz.
    abzeichen("dhwforce-badge", isOn(hass, this._e("TOP2")) === true);
    abzeichen("sterilization-badge", isOn(hass, this._e("TOP69")) === true);

    /* Primärpumpe und Durchfluss */
    // Pumpe in U/min oder Prozent (EMS-ESP hpcircspd), Durchfluss in l/min
    // nach der Einheit der Entitaet (EMS-ESP pc0flow meldet l/h).
    const pumpe = drehzahlWert(hass, this._e("TOP65"), this._einheit("TOP65", "", hass));
    const pumpRpm = pumpe.wert;
    const flowId = this._e("TOP1");
    const flowRate = inLiterJeMinute(numState(hass, flowId), this._einheit("TOP1", "", hass));
    this._spin("pump-rotor", pumpRpm, "pump-v", pumpe.prozent ? "%" : this._t("r_upm"), PUMP_SECONDS, laeuft);
    this._blattFarbe("pump-blade", col(flow), laeuft && pumpRpm !== null && pumpRpm > 0);
    set("flow-v", flowRate === null ? "--" : `${fmt(flowRate)} l/min`);
    // Ist der Rohrinnendurchmesser bekannt, laesst sich aus dem
    // Durchfluss die Stroemungsgeschwindigkeit berechnen. Ueber 1 m/s
    // sind Stroemungsgeraeusche moeglich, ab 0,8 m/s naehert man sich
    // dem. Eine Untergrenze im Betrieb gibt es nicht: kleiner Durchfluss
    // ist bei Teillast und modulierender Pumpe normal.
    const flowEl = this._animEl("flow-v");
    const innen = Number(this._config.pipe_inner_mm) || 0;
    if (flowEl) {
      let farbe = "";
      let hinweis = "";
      // Steht die Pumpe, gibt es keine Stroemung und damit auch kein
      // Risiko. Dann bleibt der Wert neutral.
      if (innen > 0 && flowRate !== null && flowRate > 0) {
        const flaeche = Math.PI * Math.pow(innen / 2000, 2);
        const v = flowRate / 60000 / flaeche;
        hinweis = `${fmt(v, 2)} m/s`;
        if (v > 1) farbe = "#D62B2B";
        else if (v > 0.8) farbe = "#E0A62E";
        else farbe = "#46C07A";
      }
      schreibStil(flowEl, "fill", farbe);
      // Die Geschwindigkeit steht als Beschriftung bereit, ohne den
      // sichtbaren Text zu veraendern.
      if (hinweis) schreibAttr(flowEl, "aria-label", `${flowEl.textContent} = ${hinweis}`);
      else flowEl.removeAttribute("aria-label");
    }

    /* Wasserdruck, nur bei vorhandenem Wert */
    const bar = numState(hass, this._e("TOP115"));
    zeige("press-group", bar !== null);
    if (bar !== null) {
      set("press-v", `${fmt(bar)} bar`);
      // Panasonic nennt fuer Aquarea 0,5 bis 3 bar als Normalbereich.
      const druckOk = bar >= DRUCK_MIN && bar <= DRUCK_MAX;
      const druckfarbe = druckOk ? "#46C07A" : "#D62B2B";
      const needle = this._animEl("press-needle");
      if (needle) {
        schreibAttr(needle, "transform", `rotate(${-120 + 240 * clamp(bar / 4, 0, 1)})`);
        schreibAttr(needle, "stroke", druckfarbe);
      }
      const druckText = this._animEl("press-v");
      if (druckText) schreibStil(druckText, "fill", druckfarbe);
      // Unter dem Mindestdruck blinken Wert und Warndreieck.
      const zuNiedrig = bar < DRUCK_MIN;
      const warn = this._animEl("press-warn");
      if (warn) schreibAttr(warn, "opacity", zuNiedrig ? "1" : "0");
      if (zuNiedrig && animate) {
        this._animState.set("press-v", {
          type: "pulse", duration: 1.1, min: 0.15, max: 1,
        });
        this._animState.set("press-warn", {
          type: "pulse", duration: 1.1, min: 0.15, max: 1,
        });
      } else {
        this._animState.delete("press-v");
        this._animState.delete("press-warn");
        if (druckText) schreibAttr(druckText, "opacity", "1");
      }
    }

    /* Dreiwegeventil, Klartext statt Room und DHW */
    const valveEntity = this._e("TOP20");
    const valveRoh = attr(hass, valveEntity, "beschreibung", null);
    // Bekannt ist das Ventil, wenn sein Zustand als Zahl, an/aus oder
    // Text gedeutet werden kann. Manche Integrationen melden nur Text.
    const valveNum = warmwasserZustand(rawState(hass, valveEntity));
    // Wohin gerade geladen wird. Das Dreiwegeventil ist die verlaessliche
    // Quelle. Fehlt es, hilft die Betriebsart weiter: Wert 3 heisst
    // "Nur Warmwasser". Ohne beides gilt Heizen, sonst laufen beide
    // Stichleitungen gleichzeitig.
    const zuWarmwasser = this._ladtWarmwasser(hass);
    /* Zustandssymbole oben rechts in der Waermepumpe */
    // Auch als Text, eigene Texte einer Integration setzt das Profil um.
    const abtaut = abtauZustand(rawState(hass, this._e("TOP26"))) === true;
    const art = numState(hass, this._e("TOP4"));
    // Welche Betriebsart welche Zustaende umfasst, nach TOP4.
    // Ohne bekannte Betriebsart gelten Heizen und Warmwasser als moeglich.
    const umfasst = {
      heizen: art === null ? true : [0, 2, 4, 6].includes(art),
      kuehlen: art === null ? false : [1, 5, 7, 8].includes(art),
      ww: art === null ? true : [3, 4, 5, 6, 8].includes(art),
      auto: art === null ? false : [2, 6, 7, 8].includes(art),
    };
    const arbeitet = laeuft && comp !== null && comp > 0;
    const blinkt = {
      betrieb: false,
      heizen: arbeitet && !zuWarmwasser && !umfasst.kuehlen && !abtaut,
      kuehlen: arbeitet && !zuWarmwasser && umfasst.kuehlen && !abtaut,
      ww: arbeitet && zuWarmwasser && !abtaut,
      auto: false,
      abtauen: abtaut,
    };
    const modusFarben = {
      // Das Betriebssymbol zeigt nur, ob die Anlage eingeschaltet ist.
      // Es blinkt nie, was sie gerade tut sagen die uebrigen Symbole.
      betrieb: "#46C07A",
      heizen: "#E0762E",
      kuehlen: "#06A6C7",
      ww: "#F2B233",
      auto: "#C3D0E0",
      abtauen: "#3E9BE0",
    };
    // Betriebsart in Worten unter den Symbolen.
    const modusText = this._animEl("modus-text");
    if (modusText) {
      let txt = "";
      if (anAus === false) txt = wertText("Aus", this._sp());
      else if (abtaut) txt = this._t("r_abtauen");
      else if (art !== null && MODE_LABELS[art] !== undefined) txt = wertText(MODE_LABELS[art], this._sp());
      schreibText(modusText, txt);
    }
    Object.keys(modusFarben).forEach((k) => {
      const el = this._animEl(`modus-${k}`);
      if (!el) return;
      const dabei =
        k === "betrieb" ? anAus === true : k === "abtauen" ? abtaut : umfasst[k];
      schreibStil(el, "color", dabei ? modusFarben[k] : "var(--c-2e3847)");
      if (blinkt[k] && animate) {
        this._animState.set(`modus-${k}`, {
          type: "pulse", duration: 1.4, min: 0.3, max: 1,
        });
      } else {
        this._animState.delete(`modus-${k}`);
        schreibAttr(el, "opacity", "1");
      }
    });

    let valveText = "--";
    if (valveRoh !== null && VALVE_LABELS[valveRoh] !== undefined) {
      valveText = wertText(VALVE_LABELS[valveRoh], this._sp());
    } else if (valveNum !== null) {
      valveText = this._t(zuWarmwasser ? "warmwasser" : "heizung");
    }
    set("valve-v", valveText);
    // Sichtbar ist nur der Pfeil in die geoeffnete Richtung.
    const bekannt = valveNum !== null;
    zeige("valve-arrow-heiz", bekannt && !zuWarmwasser);
    zeige("valve-arrow-ww", bekannt && zuWarmwasser);
    const pfeilfarbe = col(flow);
    ["valve-heiz-line", "valve-ww-line"].forEach((id) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "stroke", pfeilfarbe);
    });
    ["valve-heiz-head", "valve-ww-head"].forEach((id) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "fill", pfeilfarbe);
    });

    /* Welche Kreise sind ueberhaupt aktiviert?
       TOP94 kennt drei Zustaende, TOP99 und TOP100 je zwei.
       Ist nichts zugeordnet, wird nichts abgeblendet. */
    const zonen = numState(hass, this._e("TOP94"));
    const zone1 = zonen === null ? true : zonen === 0 || zonen === 2;
    const zone2 = zonen === null ? true : zonen === 1 || zonen === 2;
    const pufferDa = (() => {
      const v = numState(hass, this._e("TOP99"));
      return v === null ? true : v > 0;
    })();
    const wasserDa = (() => {
      const v = numState(hass, this._e("TOP100"));
      return v === null ? true : v > 0;
    })();
    const blende = (id, aktiv) => {
      const el = this._animEl(id);
      if (el) el.classList.toggle("is-inaktiv", !aktiv);
    };
    // Nur der Heizkoerper wird blasser, wenn die Zone nicht freigegeben
    // ist. Rohre und Pumpe sind weiterhin vorhanden und bleiben normal.
    blende("hk1-rad", zone1);
    blende("hk2-rad", zone2);
    blende("buffer-group", pufferDa);
    blende("dhw-group", wasserDa);

    /* Heizkreise */
    // Der gesamte Sekundaerkreis fuehrt Pufferwasser. Damit die Farbe
    // an den Verbindungsstellen nicht springt, tragen Fallrohr,
    // Steigrohr und die waagerechten Leitungen denselben Wert.
    // Ohne Puffer gibt es keinen eigenen Waermespeicher im
    // Sekundaerkreis. Wasser fliesst durch die Heizkreise nur, wenn die
    // Waermepumpe gerade in die Heizung foerdert, nicht schon, weil eine
    // Kreispumpe laeuft. Vor- und Ruecklauf tragen dann die Temperaturen
    // der Waermepumpe statt der Puffertemperatur.
    const foerdertPrimaer =
      (pumpRpm !== null && pumpRpm > 0) || (flowRate !== null && flowRate > 0);
    this._direkt = this._hatPuffer()
      ? null
      : { heizt: foerdertPrimaer && !zuWarmwasser, vl: col(flow), rl: col(ret) };
    const kreisLaeuft = [];
    for (let n = 1; n <= this._hkAnzahl(); n++) {
      kreisLaeuft.push(this._circuitUpdate(n, col, animate, buf, laeuft));
    }

    // Mit Puffer wird der Sekundaerkreis bewegt, sobald eine Kreispumpe
    // foerdert, seine Waerme kommt aus dem Puffer. Ohne Puffer liefern
    // die Heizkreise bereits nur dann Fluss, wenn die Waermepumpe heizt.
    const sekundaer = kreisLaeuft.some(Boolean);
    const d = this._direkt;
    const farbeVL = d ? d.vl : col(buf);
    const farbeRL = d ? d.rl : col(buf);
    // Der Abschnitt zum zweiten Heizkreis nur, wenn dieser Fluss hat.
    stroemt(["dots-sf-a"], sekundaer, farbeVL);
    stroemt(["dots-sr-a"], sekundaer, farbeRL);
    // Hochformat: jeder Abschnitt zwischen zwei Heizkreisen laeuft nur,
    // wenn ein Kreis dahinter laeuft.
    [2, 3, 4].forEach((k) => {
      const id = k === 2 ? "" : String(k);
      const dahinter = kreisLaeuft.slice(k - 1).some(Boolean);
      stroemt([`dots-sf-b${id}`], dahinter, farbeVL);
      stroemt([`dots-sr-b${id}`], dahinter, farbeRL);
    });
    // Querformat: bis zu zwei Heizkreise stehen untereinander, jeder in
    // einer eigenen Reihe. Ab drei bilden HK1 und HK2 die erste Reihe,
    // HK3 und HK4 die zweite. Muss zu _querMasse passen.
    const spalten = kreisLaeuft.length > 2 ? 2 : 1;
    const reihe1 = kreisLaeuft.slice(0, spalten).some(Boolean);
    const reihe2 = kreisLaeuft.slice(spalten).some(Boolean);
    stroemt(["dots-sf-z2"], reihe2, farbeVL);
    stroemt(["dots-sr-z1"], reihe1, farbeRL);
    stroemt(["dots-sr-z2"], reihe2, farbeRL);

    /* Durchflussanimation */
    // Der Primaerkreis foerdert, wenn Pumpe oder Durchfluss das melden.
    // Ohne diese Werte bewegt sich nichts, es wird nichts angenommen.
    const primaer =
      (pumpRpm !== null && pumpRpm > 0) || (flowRate !== null && flowRate > 0);
    // Jeder Abschnitt einzeln, abhaengig nur vom eigenen Kreis.
    // Vor dem Ventil fliesst immer, dahinter nur bei Warmwasserladung.
    stroemt(["dots-vl-a"], primaer, col(flow));
    // Hinter dem Ventil: im Querformat fuehrt der Weg zur Heizung weiter,
    // im Hochformat der Weg zum Warmwasser.
    stroemt(["dots-heiz-vl"], primaer && !zuWarmwasser, col(flow));
    stroemt(["dots-ww-vl"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-rl-a"], primaer, col(ret));
    stroemt(["dots-heiz-rl"], primaer && !zuWarmwasser, col(ret));
    stroemt(["dots-ww-rl"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-buf"], primaer && !zuWarmwasser, col(flow));
    stroemt(["dots-buf2"], primaer && !zuWarmwasser, col(ret));
    stroemt(["dots-dhw"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-dhw2"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-zirk-h1", "dots-zirk-v", "dots-zirk-h2"], zirkAn, col(dhw));
    // Erst hier steht die Warmwassertemperatur fest.
    this._blattFarbe("zirk-blade", col(dhw), zirkAn && laeuft);

    // Blasen: je waermer der Speicher, desto mehr steigen auf.
    // Blasen zeigen, dass gerade Waerme in den Speicher geladen wird:
    // Primaerkreis foerdert und das Ventil steht auf diesen Speicher.
    // Bei Stillstand oder Bereitschaft steigen keine Blasen.
    const blasen = (id, wert, laedt) => {
      const g = this._animEl(id);
      if (!g || !g.children) return;
      const anteil =
        wert === null ? 0 : clamp((wert - min) / ((max - min) || 1), 0, 1);
      const sichtbar = animate && laeuft && laedt ? Math.round(anteil * BUBBLE_COUNT) : 0;
      Array.from(g.children).forEach((el, i) => {
        // Eine pausierte Animation setzt ihre Deckkraft weiter und
        // ueberschreibt dabei jeden Inline-Stil. Ausgeblendete Blasen
        // bekommen deshalb gar keine Animation, sonst blieben sie
        // sichtbar in der Luft stehen.
        schreibStil(el, "animationName", i < sichtbar ? "" : "none");
        // Ausgeblendete Blasen sofort unsichtbar machen. Sonst bleiben
        // sie am Boden liegen, wenn die Animationsschleife nicht laeuft.
        if (i >= sichtbar && el.getAttribute("opacity") !== "0") {
          schreibAttr(el, "opacity", "0");
          el.removeAttribute("transform");
        }
      });
    };
    // Zusatzwaerme: Kamin und Solarthermie laden den Puffer ueber ihre
    // eigene Pumpe, unabhaengig von der Waermepumpe.
    const quelleLaedt = this._quellenUpdate(col, animate, buf);
    blasen("buf-bubbles", buf, (primaer && !zuWarmwasser) || quelleLaedt);
    blasen("dhw-bubbles", dhw, primaer && zuWarmwasser);

    /* Bedienung */
    this._syncDialog();
  },

  /**
   * Kamin und Solarthermie: Temperatur, Pumpe, Fluss in den Puffer.
   * Liefert, ob gerade eine davon den Puffer laedt.
   */
  _quellenUpdate(col, animate, buf) {
    const hass = this._quelle;
    let laedt = false;
    ["kamin", "solar"].forEach((art) => {
      if (!this._animEl(`${art}-group`)) return;
      const temp = numState(hass, this._e(QUELLE[art].temp));
      const pumpe = isOn(hass, this._e(QUELLE[art].pumpe)) === true;
      const tEl = this._animEl(`${art}-v`);
      if (tEl) schreibText(tEl, temp === null ? "--" : `${fmt(temp, 1)} °C`);
      const pEl = this._animEl(`${art}-pump-v`);
      if (pEl) {
        // Wie bei den Heizkreisen nur der Zustand, direkt an der Pumpe.
        schreibText(pEl, this._e(QUELLE[art].pumpe) ? wertText(pumpe ? "läuft" : "aus", this._sp()) : "");
      }
      // Feuer im Kamin und Sonne ueber der Solarthermie haengen an der
      // Temperatur, ab der eingestellten Grenze.
      const grenze = Number(this._config[art === "kamin" ? "kamin_fire_temp" : "solar_sun_temp"]);
      const aktiv = temp !== null && temp >= (Number.isFinite(grenze) ? grenze : 30);
      if (art === "kamin") this._kaminFeuer(aktiv, animate);
      else this._solarSonne(aktiv, animate);
      this._blattFarbe(`${art}-blade`, col(temp), pumpe);
      const rotorId = `${art}-rotor`;
      const rotor = this._animEl(rotorId);
      if (rotor) {
        rotor.classList.remove("is-still");
        if (pumpe && animate) {
          const da = this._animState.get(rotorId);
          if (da && da.type === "spin") da.duration = PUMP_SECONDS;
          else this._animState.set(rotorId, { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
        } else {
          this._animState.delete(rotorId);
        }
      }
      [[`dots-${art}`, col(temp)], [`dots-${art}b`, col(buf)]].forEach(([id, farbe]) => {
        const el = this._animEl(id);
        if (!el) return;
        const aktiv = animate && pumpe;
        el.classList.toggle("is-on", aktiv);
        schreibStil(el, "stroke", farbe);
        if (aktiv) this._animState.set(id, { type: "flow", reverse: false });
        else {
          this._animState.delete(id);
          schreibAttr(el, "stroke-dashoffset", "0");
        }
      });
      if (pumpe) laedt = true;
    });
    return laedt;
  },

  /** Feuer im Kamin: sichtbar ab der Grenze, lodert mit Animation. */
  _kaminFeuer(an, animate) {
    const sichtbar = (id, ja) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "opacity", ja ? "1" : "0");
    };
    sichtbar("kamin-schein", an);
    sichtbar("kamin-flamme", an);
    const feuer = this._animEl("kamin-feuer");
    const glut = this._animEl("kamin-glut");
    if (an && animate) {
      if (!this._animState.has("kamin-feuer")) this._animState.set("kamin-feuer", { type: "flacker" });
      this._animState.set("kamin-glut", { type: "pulse", duration: 1.7, min: 0.15, max: 0.45 });
    } else {
      this._animState.delete("kamin-feuer");
      this._animState.delete("kamin-glut");
      if (feuer) feuer.removeAttribute("transform");
      if (glut) schreibAttr(glut, "opacity", "0.3");
    }
  },

  _circuitUpdate(n, col, animate, buf, laeuft) {
    const hass = this._quelle;
    const water = numState(hass, this._e(HK[n].wasser));
    const pumpOn = isOn(hass, this._e(HK[n].pumpe)) === true;

    const set = (id, text) => {
      const el = this._animEl(id);
      if (el) schreibText(el, text);
    };
    const paint = (id, color) => {
      const el = this._animEl(id);
      if (el) schreibAttr(el, "stop-color", color);
    };

    paint(`rad${n}-top`, col(water));
    paint(`rad${n}-bottom`, col(water === null ? null : water - 6));
    // Wie bei Puffer und Warmwasser: oben die Temperatur, darunter das
    // Ziel. Ohne Fachbegriffe, damit klar ist, was die Zahlen bedeuten.
    set(`hk${n}-water-v`, water === null ? "--" : `${fmt(water, 1)} °C`);

    const rotor = this._animEl(`hk${n}-rotor`);
    if (rotor) {
      // Nur der Heizkoerper wird blasser, wenn der Kreis steht.
      // Pumpe und Rohre behalten ihr normales Aussehen, sie sind
      // schliesslich weiterhin vorhanden.
      rotor.classList.remove("is-still");
      // Die Heizkreise foerdern Pufferwasser, also dessen Farbe.
      this._blattFarbe(`hk${n}-blade`, col(buf), pumpOn && laeuft);
      const rotorId = `hk${n}-rotor`;
      if (pumpOn && animate && laeuft) {
        // Ebenso hier: den erreichten Winkel nicht verwerfen.
        const da = this._animState.get(rotorId);
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set(rotorId,
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
      } else {
        this._animState.delete(rotorId);
      }
    }
    set(`hk${n}-pump-v`, wertText(pumpOn ? "läuft" : "aus", this._sp()));

    // Mit Puffer laufen die beiden Leitungen dieses Heizkreises mit seiner
    // Pumpe. Ohne Puffer nur, wenn die Waermepumpe heizt und der Kreis
    // offen ist. Ist keine Kreispumpe zugeordnet, gilt er als offen.
    const d = this._direkt;
    const kreisOffen = pumpOn || !this._e(HK[n].pumpe);
    const fluss = d ? d.heizt && kreisOffen : laeuft && pumpOn;
    [`dots-hk${n}`, `dots-hk${n}b`].forEach((id, i) => {
      const el = this._animEl(id);
      if (!el) return;
      const aktiv = animate && fluss;
      el.classList.toggle("is-on", aktiv);
      // Mit Puffer tragen beide die Puffertemperatur, ohne Puffer der
      // Zulauf den Vorlauf und der Abgang den Ruecklauf der Waermepumpe.
      schreibStil(el, "stroke", d ? (i === 0 ? d.vl : d.rl) : col(buf));
      if (aktiv) {
        this._animState.set(id, { type: "flow", reverse: false });
      } else {
        this._animState.delete(id);
        schreibAttr(el, "stroke-dashoffset", "0");
      }
    });

    // Aufsteigende Waerme ueber der Fussbodenheizung, solange Wasser fliesst.
    const waerme = this._animEl(`hk${n}-waerme`);
    if (waerme) {
      const sichtbar = fluss && laeuft !== false;
      if (sichtbar && animate) {
        this._animState.set(`hk${n}-waerme`, { type: "pulse", duration: 2.4, min: 0.25, max: 0.85 });
      } else {
        this._animState.delete(`hk${n}-waerme`);
        schreibAttr(waerme, "opacity", sichtbar ? "0.7" : "0");
      }
    }

    // Mit Puffer wie bisher der Pumpenzustand, ohne Puffer der Fluss.
    return d ? fluss : pumpOn;
  },

  /**
   * Dreht einen Rotor.
   * Ohne festeDauer richtet sich das Tempo nach der Drehzahl, das
   * passt zu den Lueftern. Pumpen bekommen eine feste, ruhige Dauer,
   * denn dort soll nur erkennbar sein, dass sie ueberhaupt foerdern.
   */
  _spin(rotorId, rpm, labelId, unit, festeDauer, erlaubt, jeEinheit = 1) {
    const label = this.shadowRoot.getElementById(labelId);
    if (label) schreibText(label, rpm === null ? "--" : `${fmt(rpm, 0)} ${unit}`);
    const el = this.shadowRoot.getElementById(rotorId);
    if (!el) return;
    const animate = animationAn(this._config);
    if (rpm === null || rpm <= 0 || !animate || erlaubt === false) {
      el.classList.toggle("is-still", rpm === null || rpm <= 0);
      this._animState.delete(rotorId);
      return;
    }
    el.classList.remove("is-still");
    // jeEinheit rechnet einen Wert in Prozent in U/min um (Luefter).
    const duration = festeDauer ? festeDauer : clamp(900 / (rpm * jeEinheit), 0.25, 6);
    // Nur die Dauer anpassen. Der erreichte Winkel bleibt erhalten,
    // damit der Rotor bei einer neuen Drehzahl weiterdreht statt zu springen.
    const vorhanden = this._animState.get(rotorId);
    if (vorhanden && vorhanden.type === "spin") {
      vorhanden.duration = duration;
    } else {
      this._animState.set(rotorId, { type: "spin", duration, winkel: 0 });
    }
  },
};
