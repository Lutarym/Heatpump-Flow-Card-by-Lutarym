/**
 * Die Karte: Lebenszyklus, Konfiguration, Aufbau und Animation.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { detectIntegration } from "../erkennung.js";
import { DEFAULT_CONFIG } from "../felder.js";
import { animationAn, bewegungReduziert, bubbleDauer, clamp, dezimalFuer, escapeHtml, numState, setzeDezimal } from "../hilfsfunktionen.js";
import { aktualisierenKarte } from "./aktualisieren.js";
import { demoKarte } from "./demo.js";
import { diagrammeKarte } from "./diagramme.js";
import { dialogKarte } from "./dialog.js";
import { grafikHochKarte } from "./grafik-hoch.js";
import { grafikQuerKarte } from "./grafik-quer.js";
import { heizkurveKarte } from "./heizkurve.js";
import { hilfeKarte } from "./hilfe.js";
import { kennzahlenKarte } from "./kennzahlen.js";
import { stilKarte } from "./stil.js";
import { tuerKarte } from "./tuer.js";
import { verlaufKarte } from "./verlauf.js";
import { HOLD_MS } from "../konstanten.js";
import { eigenesProfil, profilFeldnamen } from "../profile.js";
import { EIGENE_SPRACHEN, SPRACH_STAND, registriereSprachen, spracheBekannt } from "../sprachen.js";
import { gruppenText, t } from "../texte.js";

/* ------------------------------------------------------------------ *
 *  Karte
 * ------------------------------------------------------------------ */
export class LutarymHeatpumpCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._config = null;
    this._hass = null;
    this._auto = null;
    this._dragging = null;

    // Animation Engine (GData-kompatibel)
    this._animLoop = null;
    this._animTime = 0;
    this._animState = new Map();
  }

  disconnectedCallback() {
    if (this._animLoop) cancelAnimationFrame(this._animLoop);
    this._animLoop = null;
    if (this._sichtBeobachter) {
      this._sichtBeobachter.disconnect();
      this._sichtBeobachter = null;
    }
  }

  /**
   * Home Assistant haengt die Karte beim Speichern der Konfiguration
   * kurz ab und wieder an. Ohne diesen Rueckruf bliebe die im
   * disconnectedCallback beendete Animation bis zum Neuladen der Seite
   * stehen.
   */
  connectedCallback() {
    // Ausserhalb des sichtbaren Bereichs ruht die Animation. Das spart
    // Rechenzeit und Akku, etwa auf langen Dashboards am Handy.
    if (!this._sichtBeobachter && typeof IntersectionObserver !== "undefined") {
      this._sichtBeobachter = new IntersectionObserver((eintraege) => {
        const e = eintraege[eintraege.length - 1];
        this._unsichtbar = !e.isIntersecting;
        if (!this._unsichtbar && this._built && !this._animLoop) this._startAnimationLoop();
      });
      this._sichtBeobachter.observe(this);
    }
    // Bei "Automatisch" folgt die Karte der Systemeinstellung
    // "Bewegung reduzieren", auch wenn sie sich spaeter aendert.
    if (!this._bewegungMq && window.matchMedia) {
      try {
        this._bewegungMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        this._bewegungMq.addEventListener("change", () => {
          if (!this._config || this._config.animate !== "auto") return;
          if (this._hass) this._render();
          if (bewegungReduziert()) {
            if (this._animLoop) cancelAnimationFrame(this._animLoop);
            this._animLoop = null;
          } else if (this._built && !this._animLoop) {
            this._startAnimationLoop();
          }
        });
      } catch (e) {
        this._bewegungMq = null;
      }
    }
    if (this._built && !this._animLoop) this._startAnimationLoop();
  }

  static getConfigElement() {
    return document.createElement("heatpump-flow-card-by-lutarym-editor");
  }

  static getStubConfig(hass) {
    const found = detectIntegration(hass, DEFAULT_CONFIG.profil);
    return { ...DEFAULT_CONFIG, entities: found.found ? found.entities : {} };
  }

  setConfig(config) {
    if (!config) throw new Error("Keine Konfiguration angegeben.");
    registriereSprachen(config);
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...(config.entities || {}) },
    };
    this._config.fan_count = this._config.fan_count === 1 ? 1 : 2;
    // 1 bis 4 Heizkreise. HK3 und HK4 kommen aus eigenen Entitaeten,
    // die Aquarea selbst regelt nur zwei Zonen.
    this._config.hk_count = Math.min(4, Math.max(1, parseInt(this._config.hk_count, 10) || 2));
    this._built = false;
    this._auto = null;
    if (this._config.demo) this._demoAufbauen();
    else this._demo = null;
    this._tagStart = undefined;
    this._tagStartTag = undefined;
    this._tagVersuch = 0;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
    if (this._quelle) this._render();
  }

  set hass(hass) {
    const alt = this._hass;
    this._hass = hass;
    if (!this._config) return;
    // Home Assistant ruft das bei jeder Zustandsaenderung im ganzen System
    // auf. Aendert sich keine Entitaet der Karte, bleibt alles stehen.
    if (alt && hass && this._built && !this._config.demo && !this._relevantGeaendert(alt, hass)) {
      return;
    }
    this._render();
  }

  /** Gewaehlte Farbdarstellung, "auto" folgt Home Assistant. */
  _thema() {
    const w = (this._config && this._config.theme) || "auto";
    if (w !== "auto") return w;
    const dm = this._hass && this._hass.themes && this._hass.themes.darkMode;
    if (typeof dm === "boolean") return dm ? "dunkel" : "hell";
    const hell = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return hell ? "hell" : "dunkel";
  }

  /** Setzt die Farbdarstellung an der Karte. */
  _setzeThema() {
    const k = this.shadowRoot && this.shadowRoot.querySelector("ha-card.lhc");
    if (!k) return;
    const t = this._thema();
    if (k.dataset.thema === t) return;
    ["hell", "kontrast", "nacht", "ha"].forEach((n) => k.classList.toggle(`thema-${n}`, n === t));
    k.dataset.thema = t;
  }

  /** Hat sich eine Entitaet der Karte, die Sprache oder die Registrierung geaendert? */
  _relevantGeaendert(alt, neu) {
    if (alt.language !== neu.language || alt.entities !== neu.entities) return true;
    if (alt.themes !== neu.themes) return true;
    if (!alt.states || !neu.states) return true;
    if (this._beobachtetFuer !== this._config || !this._beobachtet) {
      const ids = new Set();
      profilFeldnamen().forEach((k) => {
        const id = this._e(k);
        if (id) ids.add(id);
      });
      this._beobachtet = ids;
      this._beobachtetFuer = this._config;
    }
    for (const id of this._beobachtet) {
      if (alt.states[id] !== neu.states[id]) return true;
    }
    return false;
  }

  getCardSize() {
    return 18;
  }

  /** Liefert die gerade gueltige Datenquelle. */
  get _quelle() {
    return this._config && this._config.demo ? this._demo : this._hass;
  }

  _e(key) {
    // Im Demomodus zeigen alle Felder auf die Nachbildung.
    if (this._config && this._config.demo) return `demo.${key}`;
    const eintraege = this._config.entities || {};
    // Frueherer Feldname bleibt gueltig, damit bestehende Karten weiterlaufen.
    const alias = { power_state: "power_switch", buffer_temp: "buffer_top" };
    const configured = eintraege[key] || eintraege[alias[key]];
    if (configured) return configured;
    if (!this._auto) {
      this._auto = detectIntegration(this._quelle, eigenesProfil(this._config) || undefined).entities;
    }
    return this._auto[key] || "";
  }

  /**
   * Merkt einen gerade gesetzten Wert kurz vor.
   * Ohne das ueberschreibt die naechste Aktualisierung die Eingabe,
   * bevor die Waermepumpe nachgezogen hat, und der Regler springt zurueck.
   */
  _halte(id, wert) {
    if (!this._gehalten) this._gehalten = {};
    this._gehalten[id] = { wert, bis: Date.now() + HOLD_MS };
  }

  /** Liefert den vorgemerkten Wert, solange er gilt. */
  _gehaltenerWert(id, istWert) {
    const eintrag = this._gehalten && this._gehalten[id];
    if (!eintrag) return null;
    if (Date.now() > eintrag.bis || istWert === eintrag.wert) {
      delete this._gehalten[id];
      return null;
    }
    return eintrag.wert;
  }

  /**
   * Schaltet einen Heizkreis zu oder ab.
   * SetZones kennt nur drei Werte: 0 nur Zone 1, 1 nur Zone 2,
   * 2 beide Zonen. Beide gleichzeitig aus ist nicht vorgesehen,
   * ein solcher Versuch wird deshalb nicht ausgefuehrt.
   */
  _zoneSchalten(nummer) {
    const id = this._e("zones_select");
    if (!id) return;
    const jetzt = numState(this._quelle, this._e("zones_state"));
    const zone1 = jetzt === null ? true : jetzt === 0 || jetzt === 2;
    const zone2 = jetzt === null ? true : jetzt === 1 || jetzt === 2;
    const neu1 = nummer === 1 ? !zone1 : zone1;
    const neu2 = nummer === 2 ? !zone2 : zone2;
    if (!neu1 && !neu2) return;
    const wert = neu1 && neu2 ? 2 : neu1 ? 0 : 1;
    this._quelle.callService("select", "select_option", {
      entity_id: id,
      option: `mode_${wert}`,
    });
  }

  /** Ist der genannte Heizkreis aktiv? Rueckgabe null bei Unkenntnis. */
  _zoneAktiv(nummer) {
    if (!this._e("zones_state")) return null;
    const jetzt = numState(this._quelle, this._e("zones_state"));
    if (jetzt === null) return null;
    return nummer === 1 ? jetzt === 0 || jetzt === 2 : jetzt === 1 || jetzt === 2;
  }

  /** Gewaehlte Sprache, sonst die von Home Assistant, sonst Englisch. */
  _sp() {
    const gewaehlt = this._config && this._config.language;
    if (gewaehlt && gewaehlt !== "auto" && spracheBekannt(gewaehlt)) {
      return gewaehlt;
    }
    // Direkt aus Home Assistant, nicht aus der Datenquelle: im
    // Demomodus liefert diese Beispielwerte ohne Sprachangabe.
    const ha = this._hass && this._hass.language;
    if (EIGENE_SPRACHEN[String(ha || "").toLowerCase()]) return String(ha).toLowerCase();
    const kurz = String(ha || "").slice(0, 2).toLowerCase();
    return spracheBekannt(kurz) ? kurz : "en";
  }

  /**
   * Name einer Baugruppe. Ein eigener Name gewinnt. Leer oder noch der
   * fruehere deutsche Standardname bedeutet: Name in der Kartensprache.
   */
  _name(schluessel) {
    const frueher = {
      label_hk1: "Heizkreis 1", label_hk2: "Heizkreis 2",
      label_hk3: "Heizkreis 3", label_hk4: "Heizkreis 4",
      label_dhw: "Warmwasser", label_buffer: "Puffer",
    };
    const eigen = this._config && this._config[schluessel];
    if (eigen && eigen !== frueher[schluessel]) return eigen;
    if (schluessel === "label_hk1") return `${this._t("heizkreis")} 1`;
    const hk = /^label_hk([1-4])$/.exec(schluessel);
    if (hk) return `${this._t("heizkreis")} ${hk[1]}`;
    if (schluessel === "label_dhw") return this._t("warmwasser");
    if (schluessel === "label_buffer") return this._t("puffer");
    return eigen || "";
  }

  /**
   * Ob ein Heizungspuffer gezeichnet wird. Fest eingestellt gewinnt.
   * Bei "auto" entscheidet TOP99 Buffer_Installed, sonst wird er
   * gezeigt, wie bisher.
   */
  _hatPuffer() {
    const e = this._config && this._config.buffer_present;
    if (e === true || e === false) return e;
    const id = this._e("buffer_installed");
    const roh = id && this._hass && this._hass.states && this._hass.states[id];
    if (!roh) return true;
    const s = String(roh.state).toLowerCase();
    if (["on", "true", "1", "enabled", "installed", "yes"].includes(s)) return true;
    if (["off", "false", "0", "disabled", "not installed", "no"].includes(s)) return false;
    return true;
  }

  /**
   * Ob die Zirkulation gezeichnet wird. Fest eingestellt gewinnt, bei
   * "auto" sobald eine Zirkulationsentitaet vorhanden ist.
   */
  _zeigtZirkulation(hass) {
    const e = this._config && this._config.circulation_present;
    if (e === true || e === false) return e;
    const id = this._e("circulation_pump") || this._e("circ_switch");
    return Boolean(id) && Boolean(hass && hass.states && hass.states[id]);
  }

  /** Kurzform fuer einen uebersetzten Text. */
  _t(schluessel) {
    return t(schluessel, this._sp());
  }

  _render() {
    // Beim ersten Aufbau ist die Sprache von Home Assistant noch nicht
    // bekannt. Aendert sie sich, wird die Grafik neu erzeugt, denn die
    // Beschriftungen stecken fest im Markup.
    const sprache = this._sp();
    setzeDezimal(dezimalFuer(sprache));
    // Auch ein anderer Pufferstatus verlangt eine neu gezeichnete Anlage.
    const puffer = this._hatPuffer();
    const sprachStand = `${sprache}#${SPRACH_STAND}`;
    if (this._built && (this._gebautMit !== sprachStand || this._gebautPuffer !== puffer)) {
      this._built = false;
    }
    if (!this._built) {
      this._build();
      this._built = true;
      this._gebautMit = sprachStand;
      this._gebautPuffer = puffer;
    }
    this._setzeThema();
    this._groesse();
    this._update();
    this._holeVerlauf();
    this._diaEinrichten();
    const kd = this.shadowRoot.getElementById("kurve-dialog");
    if (kd && !kd.dataset.fertig) {
      kd.dataset.fertig = "1";
      kd.addEventListener("click", (ev) => {
        if (ev.target === kd) kd.hidden = true;
      });
      const zu = this.shadowRoot.getElementById("kurve-zu");
      if (zu) zu.addEventListener("click", () => { kd.hidden = true; });
    }
    if (kd && !kd.hidden) {
      this._kurveRegler();
      this._zeichneKurveDialog();
    }
  }

  /**
   * Breite und Hoehe aus der Konfiguration anwenden.
   * Null bedeutet automatisch, dann fuellt die Karte ihre Spalte und
   * behaelt ihr Seitenverhaeltnis.
   */
  _groesse() {
    const karte = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    const svg = this.shadowRoot && this.shadowRoot.querySelector("svg");
    if (!karte || !svg) return;
    const b = Number(this._config.card_width) || 0;
    const h = Number(this._config.card_height) || 0;
    karte.style.maxWidth = b > 0 ? `${b}px` : "";
    karte.style.marginInline = b > 0 ? "auto" : "";
    if (h > 0) {
      // Feste Hoehe: das Bild passt sich an und bleibt vollstaendig sichtbar.
      svg.style.height = `${h}px`;
      svg.style.width = "100%";
    } else {
      svg.style.height = "";
      svg.style.width = "";
    }
  }

  /* -------------------- Aufbau -------------------- */
  _build() {
    if (this._animLoop) cancelAnimationFrame(this._animLoop);
    this._animTime = 0;
    this._animState.clear();

    const root = document.createElement("div");
    root.innerHTML = `
      <style>${this._css()}</style>
      <ha-card class="lhc">
        <div class="lhc-alert" id="alert" hidden></div>
        <div class="lhc-hint" id="hinweis" hidden></div>
        <div class="lhc-demo" id="demo-leiste" hidden></div>
        <div class="lhc-scene">${this._svg()}</div>

        ${this._kurveDialogMarkup()}
        ${this._diaDialogMarkup()}
        <button type="button" class="lhc-hilfe-knopf" id="hilfe-knopf"
                title="${escapeHtml(this._t("h_knopf"))}" aria-label="${escapeHtml(this._t("h_knopf"))}">?</button>
        <div class="lhc-hilfe" id="hilfe" hidden>
          <div class="lhc-hilfe-box" role="dialog" aria-modal="true" aria-labelledby="hilfe-titel" tabindex="-1">
            <div class="lhc-hilfe-kopf">
              <span id="hilfe-titel">${escapeHtml(this._t("h_titel"))}</span>
              <button type="button" class="lhc-dialog-close" id="hilfe-zu"
                      aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
            </div>
            <input type="search" class="lhc-hilfe-suche" id="hilfe-suche"
                   placeholder="${escapeHtml(this._t("h_suche"))}" autocomplete="off">
            <div class="lhc-hilfe-chips" id="hilfe-chips"></div>
            <div class="lhc-hilfe-liste" id="hilfe-liste"></div>
            <div class="lhc-hilfe-fuss"><span id="hilfe-anzahl"></span> · ${escapeHtml(this._t("h_quelle"))}</div>
          </div>
        </div>
        <div class="lhc-tuer" id="tuer-panel" hidden>
          <div class="lhc-tuer-kopf">${escapeHtml(gruppenText("Erweiterte Einstellungen", this._sp()))}</div>
          <div class="lhc-tuer-liste" id="tuer-liste"></div>
          <div class="lhc-tuer-fuss">
            <button type="button" class="lhc-tuer-knopf" id="tuer-abbrechen">${escapeHtml(this._t("t_abbrechen"))}</button>
            <button type="button" class="lhc-tuer-knopf primaer" id="tuer-ok">${escapeHtml(this._t("t_uebernehmen"))}</button>
          </div>
        </div>
        <div class="lhc-dialog" id="dialog" hidden>
          <div class="lhc-dialog-box" role="dialog" aria-modal="true">
            <div class="lhc-dialog-head">
              <span class="lhc-dialog-title" id="dlg-title">--</span>
              <button type="button" class="lhc-dialog-close" id="dlg-close"
                      aria-label="${this._t("f_schliessen")}">&times;</button>
            </div>
            <div id="dlg-temp">
              <output class="lhc-dialog-value" id="dlg-value">--</output>
              <div class="lhc-dialog-row">
                <button type="button" class="lhc-step" id="dlg-minus" aria-label="${this._t("s_kleiner")}">&minus;</button>
                <input class="lhc-slider" type="range" id="dlg-range"
                       min="0" max="100" step="1" value="0" aria-label="${this._t("s_temperatur")}">
                <button type="button" class="lhc-step" id="dlg-plus" aria-label="${this._t("s_groesser")}">+</button>
              </div>
              <div class="lhc-ctl-scale">
                <span id="dlg-min">--</span><span id="dlg-max">--</span>
              </div>
              <div class="lhc-dlg-hinweis" id="dlg-hinweis"></div>
            </div>
            <div id="dlg-actions"></div>
            <div id="dlg-werte"></div>
          </div>
        </div>
      </ha-card>
    `;
    // Alten Inhalt ersetzen, nicht anhaengen. Sonst entstuende bei
    // jedem Neuaufbau eine zweite Karte im Schattenbaum.
    this.shadowRoot.replaceChildren(root);
    this._buildDemo();
    this._buildDialog();
    this._buildKlicks();
    this._buildTuer();
    this._buildHilfe();
    this._startAnimationLoop();
  }

  /**
   * Nachschlagen eines Elements mit Zwischenspeicher.
   * Die Animationsschleife sucht sonst bei jedem Bild erneut im DOM.
   * Wird die Karte neu aufgebaut, sind die alten Knoten nicht mehr
   * verbunden. Das faellt hier auf und der Eintrag wird erneuert.
   */
  _animEl(id) {
    if (!this._elCache) this._elCache = new Map();
    let el = this._elCache.get(id);
    if (el && el.isConnected) return el;
    el = this.shadowRoot ? this.shadowRoot.getElementById(id) : null;
    if (el) this._elCache.set(id, el);
    else this._elCache.delete(id);
    return el;
  }

  /**
   * Faerbt das Fluegelrad einer Pumpe in der Farbe des gefoerderten
   * Wassers. Steht die Pumpe, gilt wieder die Farbe aus dem Stylesheet.
   * Inline, weil eine CSS-Regel das fill-Attribut sonst ueberschreibt.
   */
  _blattFarbe(id, farbe, laeuft) {
    const el = this.shadowRoot && this.shadowRoot.getElementById(id);
    if (!el) return;
    if (laeuft && farbe) el.style.fill = farbe;
    else el.style.removeProperty("fill");
  }

  _startAnimationLoop() {
    // Animation aus (Editor oder Geraet bei "Automatisch"): keine Schleife.
    if (!animationAn(this._config)) {
      this._animLoop = null;
      return;
    }
    let lastTime = performance.now();

    const tick = (time) => {
      if (!this.isConnected) return;
      if (this._unsichtbar) {
        // Pausiert, der Beobachter startet die Schleife wieder.
        this._animLoop = null;
        return;
      }

      const deltaTime = (time - lastTime) / 1000; // in Sekunden
      lastTime = time;
      this._animTime += deltaTime;

      const sr = this.shadowRoot;
      if (!sr) {
        this._animLoop = requestAnimationFrame(tick);
        return;
      }

      // Flowdots animieren (stroke-dashoffset)
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "flow") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = this._animTime % 1.2;
        const progress = cycle / 1.2;
        const offset = state.reverse ? 44 * progress : -44 * progress;
        el.setAttribute("stroke-dashoffset", offset.toFixed(1));
      });

      // Bubbles animieren - neu vereinfacht
      const bubbleGroups = ["buf-bubbles", "dhw-bubbles"];
      bubbleGroups.forEach(groupId => {
        const group = this._animEl(groupId);
        if (!group) return;
        // Die Kreise einer Gruppe wechseln nicht, darum einmal merken.
        if (!this._bubbleCache) this._bubbleCache = new Map();
        let bubbles = this._bubbleCache.get(groupId);
        if (!bubbles || !bubbles.length || !bubbles[0].isConnected) {
          bubbles = Array.from(group.querySelectorAll("circle"));
          this._bubbleCache.set(groupId, bubbles);
        }
        bubbles.forEach((bubble, idx) => {
          // Ausgeblendete Blasen (Fuellstand, Stillstand oder Animation
          // aus) bleiben unsichtbar. Vorher setzte die Schleife bei allen
          // die Deckkraft, sodass immer alle Blasen zu sehen waren.
          if (bubble.style.animationName === "none") {
            if (bubble.getAttribute("opacity") !== "0") bubble.setAttribute("opacity", "0");
            return;
          }
          // Dauer und Versatz haengen nur vom Index ab und aendern sich nie.
          // Darum einmal berechnen und merken, statt bei jedem Bild erneut.
          const dur = bubbleDauer(idx);
          const delay = idx * 0.3;

          // Animation: Zeit seit Start
          const time = (this._animTime + delay) % dur;
          const prog = time / dur;

          // translateY: oben nach unten (-330px)
          const moveY = -330 * prog;

          // opacity: Kurve (sichtbar von 15% bis 85%)
          let op = 0;
          if (prog < 0.15) op = (prog / 0.15) * 0.4;
          else if (prog < 0.85) op = 0.4;
          else op = 0.4 * (1 - (prog - 0.85) / 0.15);

          bubble.setAttribute("transform", `translate(0,${moveY.toFixed(1)})`);
          bubble.setAttribute("opacity", op.toFixed(3));
        });
      });

      // Pulse/Glow animieren (opacity)
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "pulse") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = (this._animTime % state.duration) / state.duration;
        const hoch = typeof state.max === "number" ? state.max : 1;
        const tief = typeof state.min === "number" ? state.min : 0.4;
        const spanne = hoch - tief;
        const opacity =
          cycle < 0.5
            ? hoch - (cycle / 0.5) * spanne
            : tief + ((cycle - 0.5) / 0.5) * spanne;
        // Sicherheitshalber begrenzen. Deckkraft ausserhalb 0 bis 1
        // waere ungueltig, falls die Zeitstempel je springen.
        el.setAttribute("opacity", clamp(opacity, 0, 1).toFixed(2));
      });

      // Spin animieren (rotate)
      // Der Winkel laeuft fortlaufend weiter und wird nicht aus der
      // absoluten Zeit berechnet. Sonst springt der Rotor bei jeder
      // Drehzahlaenderung, weil derselbe Zeitpunkt mit neuer Dauer
      // einen ganz anderen Winkel ergibt.
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "spin") return;
        const el = this._animEl(id);
        if (!el) return;
        if (typeof state.winkel !== "number") state.winkel = 0;
        state.winkel = (state.winkel + (deltaTime / state.duration) * 360 + 360) % 360;
        el.setAttribute("transform", `rotate(${state.winkel.toFixed(2)} 0 0)`);
      });

      this._animLoop = requestAnimationFrame(tick);
    };
    this._animLoop = requestAnimationFrame(tick);
  }
}

Object.assign(
  LutarymHeatpumpCard.prototype,
  demoKarte,
  kennzahlenKarte,
  verlaufKarte,
  diagrammeKarte,
  aktualisierenKarte,
  dialogKarte,
  hilfeKarte,
  tuerKarte,
  grafikQuerKarte,
  grafikHochKarte,
  heizkurveKarte,
  stilKarte
);
