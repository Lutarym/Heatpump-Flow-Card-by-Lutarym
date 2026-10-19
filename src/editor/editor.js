/**
 * Der Editor der Karte.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { bedienungEditor } from "./bedienung.js";
import { stilEditor } from "./stil.js";
import { werkzeugeEditor } from "./werkzeuge.js";
import { FIELD_DOMAIN, defaultEntityMap, detectIntegration } from "../erkennung.js";
import { DEFAULT_CONFIG, ENTITY_FIELDS } from "../felder.js";
import { escapeHtml, friendly } from "../hilfsfunktionen.js";
import { CARD_VERSION } from "../konstanten.js";
import { profilFuer } from "../profile.js";
import { EIGENE_SPRACHEN, registriereSprachen, spracheBekannt } from "../sprachen.js";
import { feldText, gruppenText, hinweisText, t, tf } from "../texte.js";

/* ------------------------------------------------------------------ *
 *  Editor
 * ------------------------------------------------------------------ */
export class LutarymHeatpumpCardEditor extends HTMLElement {
  /** Sprache des Dialogs, wie bei der Karte. */
  _sp() {
    const gewaehlt = this._config && this._config.language;
    if (gewaehlt && gewaehlt !== "auto" && spracheBekannt(gewaehlt)) return gewaehlt;
    const ha = String((this._hass && this._hass.language) || "").toLowerCase();
    if (EIGENE_SPRACHEN[ha]) return ha;
    const kurz = ha.slice(0, 2);
    return spracheBekannt(kurz) ? kurz : "en";
  }

  _t(schluessel) {
    return t(schluessel, this._sp());
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
  }

  setConfig(config) {
    registriereSprachen(config);
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...(config.entities || {}) },
    };
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Nur einmal aufbauen, sonst ueberschreibt der Abgleich die Eingabe.
    if (!this._built) {
      this._render();
      return;
    }
    if (this.shadowRoot) {
      this.shadowRoot.querySelectorAll(".ed-picker").forEach((p) => {
        p.hass = hass;
      });
    }
  }

  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }

  _render() {
    if (!this._config || !this._hass) return;
    if (this._built) {
      this._syncValues();
      return;
    }

    const groups = [];
    ENTITY_FIELDS.forEach((f) => {
      let g = groups.find((x) => x.name === f.group);
      if (!g) groups.push((g = { name: f.group, fields: [] }));
      g.fields.push(f);
    });

    const options = Object.keys(this._hass.states)
      .filter((e) =>
        /^(sensor|number|input_number|binary_sensor|switch|input_boolean|select|input_select)\./.test(
          e
        )
      )
      .sort()
      .map((e) => `<option value="${e}">${escapeHtml(friendly(this._hass, e))}</option>`)
      .join("");

    const found = detectIntegration(this._hass, profilFuer(this._config));

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="ed">
        <div class="ed-group ed-detect ${found.found ? "is-found" : "is-absent"}">
          <h3>${this._t("e_integration")}</h3>
          <p class="ed-status">${
            this._erkanntText(found)
          }</p>
          <div class="ed-actions">
            <button type="button" id="btn-adopt" ${
              found.found ? "" : "disabled"
            }>${this._t("e_uebernehmen")}</button>
            <button type="button" id="btn-default" class="nur-erweitert">${this._t("e_standardnamen")}</button>
            <button type="button" id="btn-clear" class="is-quiet nur-erweitert">${this._t("e_alle_leeren")}</button>
          </div>
          <div class="ed-row ed-breit">
            <span>${this._t("e_modus")}<em>${this._t("e_modus_h")}</em></span>
            <div class="ed-seg" id="ed-modus">
              <button type="button" data-modus="einfach">${this._t("e_modus_einfach")}</button>
              <button type="button" data-modus="erweitert">${this._t("e_modus_erweitert")}</button>
            </div>
          </div>
          <label class="ed-row ed-breit">
            <span>${this._t("e_sprache")}${this._sp() === "en" ? "" : " / Language"}<em>${this._t("e_sprache_h")}</em></span>
            <select id="opt-sprache">${this._sprachOptionen()}</select>
          </label>
          <label class="ed-row ed-breit nur-erweitert">
            <span>${this._t("e_profil")}<em>${this._t("e_profil_h")}</em></span>
            <select id="opt-profil">${this._profilOptionen()}</select>
          </label>
        </div>

        <details class="ed-group ed-klapp" data-klapp="darstellung">
          <summary><h3>${this._t("e_darstellung")}</h3></summary>
          <details class="ed-unter ed-klapp" data-klapp="d-allgemein">
            <summary><h4>${this._t("e_d_allgemein")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_thema")}<em>${this._t("e_thema_h")}</em></span>
            <select id="opt-thema">
              ${["auto", "dunkel", "hell", "kontrast", "nacht", "ha"]
                .map((k) => `<option value="${k}">${this._t(`o_th_${k}`)}</option>`)
                .join("")}
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anordnung")}<em>${this._t("e_anordnung_h")}</em></span>
            <select id="opt-layout">
              <option value="quer">${this._t("e_quer")}</option>
              <option value="hoch">${this._t("e_hoch")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anz_luefter")}</span>
            <select id="opt-fans"><option value="1">${this._t("e_1luefter")}</option><option value="2">${this._t("e_2luefter")}</option></select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anz_hk")}</span>
            <select id="opt-hk"><option value="1">${this._t("e_1hk")}</option><option value="2">${this._t("e_2hk")}</option><option value="3">${this._t("e_3hk")}</option><option value="4">${this._t("e_4hk")}</option></select>
          </label>
          ${[1, 2, 3, 4].map((n) => `
          <label class="ed-row" data-hk-zeile="${n}">
            <span>${this._t(`e_hk${n}_bild`)}</span>
            <select id="opt-hk${n}-stil">
              <option value="platte">${this._t("e_rad_platte")}</option>
              <option value="glieder">${this._t("e_rad_glieder")}</option>
              <option value="fbh">${this._t("e_rad_fbh")}</option>
            </select>
          </label>`).join("")}
          <label class="ed-row">
            <span>${this._t("e_puffer")}<em>${this._t("e_puffer_auto_h")}</em></span>
            <select id="opt-puffer">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="ja">${this._t("e_vorhanden")}</option>
              <option value="nein">${this._t("e_nicht_vorhanden")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_zusatz")}<em>${this._t("e_zusatz_h")}</em></span>
            <select id="opt-zusatz">
              <option value="aus">${this._t("o_aus")}</option>
              <option value="kamin">${this._t("kamin")}</option>
              <option value="solar">${this._t("solarthermie")}</option>
              <option value="beide">${this._t("e_zusatz_beide")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_zirk")}<em>${this._t("e_zirk_h")}</em></span>
            <select id="opt-zirk">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="ja">${this._t("e_anzeigen")}</option>
              <option value="nein">${this._t("e_ausblenden")}</option>
            </select>
          </label>
          </details>
          <details class="ed-unter ed-klapp" data-klapp="d-namen">
            <summary><h4>${this._t("e_d_namen")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_l_hk1")}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk1">
          </label>
          ${[2, 3, 4].map((n) => `
          <label class="ed-row" data-hk-zeile="${n}">
            <span>${this._t(`e_l_hk${n}`)}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk${n}">
          </label>`).join("")}
          <label class="ed-row">
            <span>${this._t("e_l_buf")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-lbuf">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_dhw")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-ldhw">
          </label>
          <label class="ed-row nur-erweitert">
            <span>${this._t("e_l_energy")}<em>${this._t("e_l_energy_h")}</em></span>
            <input type="text" id="opt-lenergy">
          </label>
          </details>
          <details class="ed-unter ed-klapp" data-klapp="d-anzeige">
            <summary><h4>${this._t("e_d_anzeige")}</h4></summary>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-ziel">
            <span>${this._t("e_ziel_zeigen")}<em>${this._t("e_ziel_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-laedt">
            <span>${this._t("e_laedt_zeigen")}<em>${this._t("e_laedt_zeigen_h")}</em></span>
          </label>
          <label class="ed-row">
            <span>${this._t("e_verlauf")}<em>${this._t("e_verlauf_h")}</em></span>
            <select id="opt-verlauf">
              <option value="knopf">${this._t("e_verlauf_knopf")}</option>
              <option value="karte">${this._t("e_verlauf_karte")}</option>
              <option value="aus">${this._t("o_aus")}</option>
            </select>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-hilfe">
            <span>${this._t("e_hilfe_zeigen")}<em>${this._t("e_hilfe_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-tuer">
            <span>${this._t("e_tuer_zeigen")}<em>${this._t("e_tuer_zeigen_h")}</em></span>
          </label>
          <label class="ed-row">
            <span>${this._t("e_bewegung")}<em>${this._t("e_bewegung_h")}</em></span>
            <select id="opt-animate">
              <option value="ein">${this._t("o_ein")}</option>
              <option value="auto">${this._t("e_auto")}</option>
              <option value="aus">${this._t("o_aus")}</option>
            </select>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-demo">
            <span>${this._t("e_demo")}<em>${this._t("e_demo_h")}</em></span>
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-groesse">
            <summary><h4>${this._t("e_d_groesse")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_breite")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-breite" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_hoehe")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-hoehe" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_vbreite")}<em>${this._t("e_vbreite_h")}</em></span>
            <input type="number" id="opt-vbreite" min="250" max="700" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_rohr")}<em>${this._t("e_rohr_h")}</em></span>
            <input type="number" id="opt-rohr" min="0" max="80" step="1">
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-kurve">
            <summary><h4>${this._t("e_d_kurve")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_kx_von")}<em>${this._t("e_kx_von_h")}</em></span>
            <input type="number" id="opt-kxmin" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_kx_bis")}<em>${this._t("e_kx_bis_h")}</em></span>
            <input type="number" id="opt-kxmax" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_ky_von")}<em>${this._t("e_ky_von_h")}</em></span>
            <input type="number" id="opt-kymin" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_ky_bis")}<em>${this._t("e_ky_bis_h")}</em></span>
            <input type="number" id="opt-kymax" step="1">
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-skalen">
            <summary><h4>${this._t("e_d_skalen")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_hs_kalt")}<em>${this._t("e_hs_kalt_h")}</em></span>
            <input type="number" id="opt-min">
          </label>
          <label class="ed-row"><span>${this._t("e_hs_heiss")}<em>${this._t("e_grad")}</em></span><input type="number" id="opt-max"></label>
          <label class="ed-row">
            <span>${this._t("e_as_kalt")}<em>${this._t("e_as_kalt_h")}</em></span>
            <input type="number" id="opt-omin">
          </label>
          <label class="ed-row"><span>${this._t("e_as_warm")}<em>${this._t("e_grad")}</em></span><input type="number" id="opt-omax"></label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-technik">
            <summary><h4>${this._t("e_d_technik")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_mqtt")}<em>${this._t("e_mqtt_h")}</em></span>
            <input type="text" id="opt-mqtt" placeholder="panasonic_heat_pump">
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-eday">
            <span>${this._t("e_tagesverbrauch")}</span>
          </label>
          </details>
        </details>

        <div class="ed-block nur-erweitert">
          <div class="ed-block-kopf">
            <h3>${this._t("e_entitaeten")}<em>${this._t("e_entitaeten_h")}</em></h3>
            <label class="ed-schalter"><input type="checkbox" id="ed-nur-fehlende"><span>${this._t("e_nur_fehlende")}</span></label>
          </div>
          <p class="ed-meldung" id="ed-alles-da" hidden>${this._t("e_alles_da")}</p>
          ${groups
            .map(
              (g, gi) => `
          <details class="ed-group ed-klapp" data-klapp="g${gi}" data-gruppe="${gi}" data-gruppe-name="${escapeHtml(g.name)}">
            <summary><h3>${escapeHtml(gruppenText(g.name, this._sp()))}</h3><span class="ed-zahl" id="ed-zahl-${gi}"></span></summary>
            ${g.fields
              .map((f) => {
                const hilfe = this._feldHilfe(f);
                return `
              <div class="ed-row ed-feld" data-feld="${f.key}">
                <span>${escapeHtml(feldText(f, this._sp()))}${
                  hilfe
                    ? ` <button type="button" class="ed-frage" data-frage="${f.key}" title="${escapeHtml(this._t("f_erklaerung"))}" aria-label="${escapeHtml(this._t("f_erklaerung"))}">?</button>`
                    : ""
                }<em>${escapeHtml(hinweisText(f.hint, this._sp()))}</em></span>
                <div class="ed-wahl">
                  <input type="text" list="lhc-entities" data-entity="${f.key}"
                         placeholder="entity_id" autocomplete="off">
                  <span class="ed-zustand" data-zustand="${f.key}"></span>
                </div>
                ${hilfe ? `<p class="ed-erklaerung" data-erklaerung="${f.key}" hidden>${escapeHtml(hilfe)}</p>` : ""}
              </div>`;
              })
              .join("")}
          </details>`
            )
            .join("")}
          <p class="ed-note">${this._t("r_sg_hinweis")}</p>
        </div>

        <datalist id="lhc-entities">${options}</datalist>

        <details class="ed-group ed-klapp nur-erweitert" data-klapp="werkzeuge">
          <summary><h3>${this._t("e_werkzeuge")}<em>${this._t("e_werkzeuge_h")}</em></h3></summary>
          <h4>${this._t("e_w_konfig")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-datei-aus">${this._t("e_datei_speichern")}</button>
            <button type="button" id="btn-datei-ein">${this._t("e_datei_laden")}</button>
            <button type="button" id="btn-export">${this._t("e_feld_schreiben")}</button>
            <button type="button" id="btn-import">${this._t("e_feld_einlesen")}</button>
          </div>
          <input type="file" id="ed-datei" accept=".json,application/json" hidden>
          <textarea id="ed-austausch" rows="4" spellcheck="false"
                    placeholder="${this._t("r_platzhalter")}"></textarea>
          <p class="ed-meldung" id="ed-austausch-hinweis"></p>
          <h4>${this._t("e_w_profil")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-profil-aus">${this._t("e_p_export")}</button>
            <button type="button" id="btn-profil-ein">${this._t("e_p_import")}</button>
            <button type="button" id="btn-profil-weg">${this._t("e_p_entfernen")}</button>
          </div>
          <input type="file" id="ed-profil-datei" accept=".json,application/json" hidden>
          <p class="ed-meldung" id="ed-profil-hinweis"></p>
          <h4>${this._t("e_w_sprache")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-sprache-aus">${this._t("e_s_export")}</button>
            <button type="button" id="btn-sprache-ein">${this._t("e_s_import")}</button>
            <button type="button" id="btn-sprache-weg">${this._t("e_s_entfernen")}</button>
          </div>
          <input type="file" id="ed-sprache-datei" accept=".json,application/json" hidden>
          <p class="ed-meldung" id="ed-sprache-hinweis"></p>
        </details>

        <p class="ed-info">
          <strong>Heatpump Flow Card by Lutarym v${CARD_VERSION}</strong>
        </p>
      </div>
    `;

    const bind = (id, handler) => {
      const el = this.shadowRoot.getElementById(id);
      if (el) el.addEventListener("change", () => handler(el));
    };
    const put = (patch) => {
      this._config = { ...this._config, ...patch };
      this._emit();
    };
    bind("opt-fans", (el) => put({ fan_count: parseInt(el.value, 10) }));
    bind("opt-layout", (el) => put({ layout: el.value }));
    bind("opt-thema", (el) => put({ theme: el.value }));
    bind("opt-breite", (el) => put({ card_width: parseInt(el.value, 10) || 0 }));
    bind("opt-hoehe", (el) => put({ card_height: parseInt(el.value, 10) || 0 }));
    bind("opt-rohr", (el) => put({ pipe_inner_mm: parseInt(el.value, 10) || 0 }));
    bind("opt-mqtt", (el) => put({ mqtt_prefix: el.value.trim() || "panasonic_heat_pump" }));
    bind("opt-sprache", (el) => {
      put({ language: el.value });
      this._zeigeSprachKnoepfe();
    });
    this._bindeSprachen();
    bind("opt-profil", (el) => {
      put({ profil: el.value });
      this._zeigeProfilKnoepfe();
    });
    this._bindeProfile();
    bind("opt-vbreite", (el) => put({ history_width: parseInt(el.value, 10) || 450 }));
    bind("opt-kxmin", (el) => put({ curve_x_min: parseInt(el.value, 10) }));
    bind("opt-kxmax", (el) => put({ curve_x_max: parseInt(el.value, 10) }));
    bind("opt-kymin", (el) => put({ curve_y_min: parseInt(el.value, 10) }));
    bind("opt-kymax", (el) => put({ curve_y_max: parseInt(el.value, 10) }));
    bind("opt-hk", (el) => { put({ hk_count: parseInt(el.value, 10) }); this._syncValues(); });
    bind("opt-min", (el) => put({ scale_min: parseFloat(el.value) }));
    bind("opt-max", (el) => put({ scale_max: parseFloat(el.value) }));
    bind("opt-omin", (el) => put({ outdoor_min: parseFloat(el.value) }));
    bind("opt-omax", (el) => put({ outdoor_max: parseFloat(el.value) }));
    bind("opt-lhk1", (el) => put({ label_hk1: el.value }));
    [2, 3, 4].forEach((n) => bind(`opt-lhk${n}`, (el) => put({ [`label_hk${n}`]: el.value })));
    bind("opt-lbuf", (el) => put({ label_buffer: el.value }));
    bind("opt-ldhw", (el) => put({ label_dhw: el.value }));
    bind("opt-lenergy", (el) => put({ label_energy: el.value }));
    bind("opt-eday", (el) => put({ energy_daily: el.checked }));
    bind("opt-animate", (el) => put({ animate: el.value === "aus" ? false : el.value === "auto" ? "auto" : true }));
    bind("opt-demo", (el) => put({ demo: el.checked }));
    bind("opt-verlauf", (el) => put({ show_history: el.value === "karte" ? true : el.value === "aus" ? false : "knopf" }));
    bind("opt-ziel", (el) => put({ show_target: el.checked }));
    bind("opt-laedt", (el) => put({ show_reload: el.checked }));
    bind("opt-hilfe", (el) => put({ show_help: el.checked }));
    bind("opt-tuer", (el) => put({ show_door: el.checked }));
    [1, 2, 3, 4].forEach((n) => bind(`opt-hk${n}-stil`, (el) => put({ [`hk${n}_style`]: el.value })));
    bind("opt-zusatz", (el) => { put({ extra_heat: el.value }); this._syncValues(); });
    bind("opt-puffer", (el) => put({ buffer_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));
    bind("opt-zirk", (el) => put({ circulation_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));

    const applyMap = (map, merge) => {
      const entities = merge ? { ...this._config.entities, ...map } : { ...map };
      this._config = { ...this._config, entities };
      this._syncValues();
      this._emit();
    };
    // Austausch der Konfiguration. Beim Einlesen werden nur bekannte
    // Schluessel uebernommen, damit fremder Text nichts kaputt macht.
    const feld = this.shadowRoot.getElementById("ed-austausch");
    // Nach dem Einlesen baut sich der Editor neu auf, deshalb wird das
    // Hinweisfeld frisch gesucht statt gemerkt.
    const sagen = (text) => {
      const el = this.shadowRoot.getElementById("ed-austausch-hinweis");
      if (el) el.textContent = text;
    };
    const exp = this.shadowRoot.getElementById("btn-export");
    if (exp) {
      exp.addEventListener("click", () => {
        const kopie = { ...this._config };
        delete kopie.type;
        feld.value = JSON.stringify(kopie, null, 2);
        feld.select();
        sagen(this._t("m_im_feld"));
      });
    }
    // Dieselbe Konfiguration als Datei, fuer die Weitergabe.
    const dateiAus = this.shadowRoot.getElementById("btn-datei-aus");
    if (dateiAus) {
      dateiAus.addEventListener("click", () => {
        const kopie = { ...this._config };
        delete kopie.type;
        const text = JSON.stringify(kopie, null, 2);
        try {
          // Bevorzugt ein Objekt-Verweis, sonst ein eingebetteter Text.
          let url;
          let aufraeumen = null;
          if (typeof URL !== "undefined" && URL.createObjectURL) {
            url = URL.createObjectURL(
              new Blob([text], { type: "application/json" })
            );
            aufraeumen = () => URL.revokeObjectURL(url);
          } else {
            url =
              "data:application/json;charset=utf-8," + encodeURIComponent(text);
          }
          const link = document.createElement("a");
          link.href = url;
          link.download = `heatpump-flow-card-by-lutarym-${CARD_VERSION}.json`;
          link.click();
          if (aufraeumen) setTimeout(aufraeumen, 1000);
          sagen(this._t("m_datei_ok"));
        } catch (e) {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }
    const dateiFeld = this.shadowRoot.getElementById("ed-datei");
    const dateiEin = this.shadowRoot.getElementById("btn-datei-ein");
    if (dateiEin && dateiFeld) {
      dateiEin.addEventListener("click", () => dateiFeld.click());
      dateiFeld.addEventListener("change", () => {
        const datei = dateiFeld.files && dateiFeld.files[0];
        if (!datei) return;
        const leser = new FileReader();
        leser.onload = () => {
          const ziel = this.shadowRoot.getElementById("ed-austausch");
          if (ziel) ziel.value = String(leser.result || "");
          const knopf = this.shadowRoot.getElementById("btn-import");
          if (knopf) knopf.click();
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(datei);
        dateiFeld.value = "";
      });
    }

    const imp = this.shadowRoot.getElementById("btn-import");
    if (imp) {
      imp.addEventListener("click", () => {
        let gelesen;
        try {
          gelesen = JSON.parse(feld.value);
        } catch (e) {
          sagen(this._t("m_json"));
          return;
        }
        if (!gelesen || typeof gelesen !== "object" || Array.isArray(gelesen)) {
          sagen(this._t("m_keine_konfig"));
          return;
        }
        const erlaubt = Object.keys(DEFAULT_CONFIG);
        const felder = ENTITY_FIELDS.map((f) => f.key);
        const uebernommen = {};
        let verworfen = 0;
        Object.keys(gelesen).forEach((k) => {
          if (k === "entities") return;
          if (erlaubt.includes(k) || k.startsWith("label_")) {
            uebernommen[k] = gelesen[k];
          } else {
            verworfen += 1;
          }
        });

        // Entitaeten einzeln pruefen: bekanntes Feld, passender Bereich
        // und in Home Assistant vorhanden.
        const zuordnung = {};
        const unbekannt = [];
        const fehlen = [];
        const falscherBereich = [];
        const quelle = (gelesen.entities && typeof gelesen.entities === "object")
          ? gelesen.entities
          : {};
        Object.keys(quelle).forEach((feld) => {
          const id = quelle[feld];
          if (!felder.includes(feld)) {
            unbekannt.push(feld);
            return;
          }
          if (typeof id !== "string" || !id.includes(".")) return;
          const bereich = FIELD_DOMAIN[feld];
          if (bereich && !bereich.includes(id.split(".")[0])) {
            falscherBereich.push(feld);
            return;
          }
          zuordnung[feld] = id;
          const st = this._hass && this._hass.states;
          if (st && !st[id]) fehlen.push(id);
        });
        uebernommen.entities = zuordnung;

        this._config = { type: this._config.type, ...uebernommen };
        this._emit();
        this.setConfig(this._config);

        // Gegenprobe: steht nach dem Anwenden wirklich alles drin?
        const jetzt = this._config.entities || {};
        const nichtAngekommen = Object.keys(zuordnung).filter(
          (k) => jetzt[k] !== zuordnung[k]
        );
        const teile = [
          tf(this._t("m_einst"), { n: Object.keys(uebernommen).length - 1 }),
          tf(this._t("m_ent"), { n: Object.keys(zuordnung).length }),
        ];
        if (verworfen) teile.push(tf(this._t("m_unb_einst"), { n: verworfen }));
        if (unbekannt.length) teile.push(tf(this._t("m_unb_felder"), { n: unbekannt.length }));
        if (falscherBereich.length)
          teile.push(tf(this._t("m_bereich"), { n: falscherBereich.length }));
        if (fehlen.length)
          teile.push(
            tf(this._t("m_fehlen"), {
              n: fehlen.length,
              liste:
                fehlen.slice(0, 3).join(", ") +
                (fehlen.length > 3 ? this._t("m_weitere") : ""),
            })
          );
        if (nichtAngekommen.length)
          teile.push(tf(this._t("m_nicht_an"), { liste: nichtAngekommen.join(", ") }));
        sagen(teile.join(". ") + ".");
      });
    }

    this.shadowRoot.getElementById("btn-adopt").addEventListener("click", () => {
      const f = detectIntegration(this._hass, profilFuer(this._config));
      if (f.found) applyMap(f.entities, true);
    });
    this.shadowRoot
      .getElementById("btn-default")
      .addEventListener("click", () => applyMap(defaultEntityMap(), true));
    this.shadowRoot
      .getElementById("btn-clear")
      .addEventListener("click", () => applyMap({}, false));

    this.shadowRoot.querySelectorAll("[data-entity]").forEach((input) => {
      input.addEventListener("change", () => {
        const entities = { ...this._config.entities };
        const v = input.value.trim();
        if (v) entities[input.dataset.entity] = v;
        else delete entities[input.dataset.entity];
        this._config = { ...this._config, entities };
        this._emit();
        this._zeigeEntitaetsZustand();
      });
    });

    this._bindeEditorBedienung();
    this._built = true;
    this._syncValues();
    this._entitaetsAuswahl();
  }

  _syncValues() {
    const sr = this.shadowRoot;
    const put = (id, value) => {
      const el = sr.getElementById(id);
      if (el && el !== sr.activeElement) el.value = value;
    };
    const check = (id, value) => {
      const el = sr.getElementById(id);
      if (el) el.checked = value !== false;
    };
    put("opt-fans", String(this._config.fan_count));
    put("opt-layout", this._config.layout || "quer");
    put("opt-thema", this._config.theme || "auto");
    put("opt-breite", String(this._config.card_width || 0));
    put("opt-hoehe", String(this._config.card_height || 0));
    put("opt-rohr", String(this._config.pipe_inner_mm || 0));
    put("opt-mqtt", this._config.mqtt_prefix || "panasonic_heat_pump");
    const sprachWahl = this.shadowRoot.getElementById("opt-sprache");
    if (sprachWahl) sprachWahl.innerHTML = this._sprachOptionen();
    put("opt-sprache", this._config.language || "auto");
    this._zeigeSprachKnoepfe();
    const profilWahl = this.shadowRoot.getElementById("opt-profil");
    if (profilWahl) profilWahl.innerHTML = this._profilOptionen();
    put("opt-profil", this._config.profil || "heishamon");
    this._zeigeProfilKnoepfe();
    put("opt-vbreite", String(this._config.history_width || 450));
    put("opt-kxmin", String(this._config.curve_x_min));
    put("opt-kxmax", String(this._config.curve_x_max));
    put("opt-kymin", String(this._config.curve_y_min));
    put("opt-kymax", String(this._config.curve_y_max));
    put("opt-hk", String(this._config.hk_count));
    put("opt-min", this._config.scale_min);
    put("opt-max", this._config.scale_max);
    put("opt-omin", this._config.outdoor_min);
    put("opt-omax", this._config.outdoor_max);
    put("opt-lhk1", this._config.label_hk1);
    [2, 3, 4].forEach((n) => put(`opt-lhk${n}`, this._config[`label_hk${n}`]));
    put("opt-lbuf", this._config.label_buffer);
    put("opt-ldhw", this._config.label_dhw);
    put("opt-lenergy", this._config.label_energy);
    check("opt-eday", this._config.energy_daily);
    put("opt-animate", this._config.animate === false ? "aus" : this._config.animate === "auto" ? "auto" : "ein");
    check("opt-demo", this._config.demo === true);
    put("opt-verlauf", this._config.show_history === true ? "karte" : this._config.show_history === false ? "aus" : "knopf");
    check("opt-ziel", this._config.show_target !== false);
    check("opt-laedt", this._config.show_reload !== false);
    check("opt-hilfe", this._config.show_help !== false);
    check("opt-tuer", this._config.show_door !== false);
    const anzahlHk = Number(this._config.hk_count) || 2;
    [1, 2, 3, 4].forEach((n) => put(`opt-hk${n}-stil`, this._config[`hk${n}_style`] || "platte"));
    // Nur die Zeilen der vorhandenen Heizkreise zeigen.
    sr.querySelectorAll("[data-hk-zeile]").forEach((z) => {
      z.style.display = Number(z.dataset.hkZeile) <= anzahlHk ? "" : "none";
    });
    put("opt-zusatz", this._config.extra_heat || "aus");
    // Entitaetsgruppen fuer HK3, HK4 und Zusatzwaerme nur, wenn genutzt.
    const zusatz = this._config.extra_heat || "aus";
    sr.querySelectorAll("details[data-gruppe-name]").forEach((d) => {
      const name = d.dataset.gruppeName;
      let zeigen = true;
      if (name === "Heizkreis 3") zeigen = anzahlHk >= 3;
      if (name === "Heizkreis 4") zeigen = anzahlHk >= 4;
      if (name === "Zusatzwärme") zeigen = zusatz !== "aus";
      d.style.display = zeigen ? "" : "none";
    });
    put("opt-puffer", this._config.buffer_present === true ? "ja" : this._config.buffer_present === false ? "nein" : "auto");
    put("opt-zirk", this._config.circulation_present === true ? "ja" : this._config.circulation_present === false ? "nein" : "auto");

    const imFokus = sr.activeElement;
    sr.querySelectorAll("[data-entity]").forEach((input) => {
      const v = (this._config.entities || {})[input.dataset.entity] || "";
      if (input.classList.contains("ed-picker")) {
        if (input.hass !== this._hass) input.hass = this._hass;
        if (input.value !== v) input.value = v;
        return;
      }
      if (input !== imFokus && input.value !== v) input.value = v;
      input.classList.toggle("is-missing", Boolean(v) && !this._hass.states[v]);
    });
    this._zeigeEntitaetsZustand();
  }
}

Object.assign(
  LutarymHeatpumpCardEditor.prototype,
  bedienungEditor,
  werkzeugeEditor,
  stilEditor
);
