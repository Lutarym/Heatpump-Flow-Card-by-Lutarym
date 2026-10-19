/**
 * Modus, Gruppen, Zustand der Felder, Auswahlfeld von Home Assistant.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { FIELD_DOMAIN } from "../erkennung.js";
import { ENTITY_FIELDS } from "../felder.js";
import { HILFE } from "../hilfe-daten.js";
import { hilfeText } from "../sprachen.js";
import { tf } from "../texte.js";

export const bedienungEditor = {
  /* -------------------- Editor-Bedienung -------------------- */

  /** Gespeicherte Bedienzustaende des Editors, nur in diesem Browser. */
  _merke(k, v) {
    try {
      if (v === undefined) return window.localStorage.getItem(`lhc-editor-${k}`);
      window.localStorage.setItem(`lhc-editor-${k}`, v);
    } catch (e) {
      // Speicher nicht verfuegbar, dann eben nur fuer diese Sitzung.
    }
    return null;
  },

  _modus() {
    if (!this._editorModus) this._editorModus = this._merke("modus") === "erweitert" ? "erweitert" : "einfach";
    return this._editorModus;
  },

  /** Erklaerung aus der Hilfe zu einem Feld, ueber TOP-Wert oder Befehl. */
  _feldHilfe(f) {
    const hint = String(f.hint || "");
    const tops = (hint.match(/\b(X?TOP\d+)\b/g) || []).map((x) => x.toUpperCase());
    const befehle = (hint.match(/\bSet\w+\b/g) || []).map((x) => x.toLowerCase());
    if (!tops.length && !befehle.length) return "";
    const sp = this._sp();
    for (const g of HILFE) {
      for (let i = 0; i < g.e.length; i++) {
        const e = g.e[i];
        if ((e.l && tops.includes(e.l.toUpperCase())) || (e.s && befehle.includes(e.s.toLowerCase()))) {
          return hilfeText(sp, `${g.id}.${i}.t`, e.t);
        }
      }
    }
    return "";
  },

  _bindeEditorBedienung() {
    const sr = this.shadowRoot;
    if (!this._offen) {
      this._offen = new Set();
      const gemerkt = this._merke("offen");
      try {
        // Beim ersten Mal ist die Darstellung offen, das ist im einfachen
        // Modus der eigentliche Inhalt.
        JSON.parse(gemerkt || '["darstellung","d-allgemein"]').forEach((k) => this._offen.add(k));
      } catch (e) {
        this._offen.add("darstellung");
        this._offen.add("d-allgemein");
      }
    }
    sr.querySelectorAll("details[data-klapp]").forEach((d) => {
      d.open = this._offen.has(d.dataset.klapp);
      d.addEventListener("toggle", () => {
        if (d.open) this._offen.add(d.dataset.klapp);
        else this._offen.delete(d.dataset.klapp);
        this._merke("offen", JSON.stringify([...this._offen]));
      });
    });
    sr.querySelectorAll("#ed-modus button").forEach((b) =>
      b.addEventListener("click", () => {
        this._editorModus = b.dataset.modus;
        this._merke("modus", this._editorModus);
        this._zeigeModus();
      })
    );
    const filter = sr.getElementById("ed-nur-fehlende");
    if (filter) {
      filter.checked = this._nurFehlende === true;
      filter.addEventListener("change", () => {
        this._nurFehlende = filter.checked;
        this._zeigeEntitaetsZustand();
      });
    }
    sr.querySelectorAll("button[data-frage]").forEach((b) =>
      b.addEventListener("click", (ev) => {
        ev.preventDefault();
        const p = sr.querySelector(`[data-erklaerung="${b.dataset.frage}"]`);
        if (p) p.hidden = !p.hidden;
      })
    );
    this._zeigeModus();
  },

  _zeigeModus() {
    const sr = this.shadowRoot;
    const ed = sr.querySelector(".ed");
    if (ed) ed.classList.toggle("einfach", this._modus() === "einfach");
    sr.querySelectorAll("#ed-modus button").forEach((b) =>
      b.classList.toggle("aktiv", b.dataset.modus === this._modus())
    );
  },

  /** Haken, Warnung, Zaehler je Gruppe und der Filter "nur fehlende". */
  _zeigeEntitaetsZustand() {
    const sr = this.shadowRoot;
    const ent = this._config.entities || {};
    const states = (this._hass && this._hass.states) || {};
    let sichtbarGesamt = 0;
    sr.querySelectorAll("details[data-gruppe]").forEach((d) => {
      let da = 0;
      let alle = 0;
      let sichtbar = 0;
      d.querySelectorAll(".ed-feld").forEach((row) => {
        const k = row.dataset.feld;
        const v = ent[k] || "";
        const ok = Boolean(v) && Boolean(states[v]);
        const zustand = !v ? "leer" : ok ? "ok" : "fehlt";
        alle++;
        if (ok) da++;
        const z = row.querySelector(".ed-zustand");
        if (z) {
          z.dataset.wert = zustand;
          z.textContent = zustand === "ok" ? "✓" : zustand === "fehlt" ? "!" : "";
          z.title = this._t(zustand === "ok" ? "f_ok" : zustand === "fehlt" ? "f_fehlt" : "f_leer");
        }
        const zeigen = !this._nurFehlende || zustand !== "ok";
        row.hidden = !zeigen;
        if (zeigen) sichtbar++;
      });
      const zahl = d.querySelector(".ed-zahl");
      if (zahl) {
        zahl.textContent = tf(this._t("e_zugeordnet"), { a: da, b: alle });
        zahl.classList.toggle("voll", da === alle);
      }
      d.hidden = sichtbar === 0;
      sichtbarGesamt += sichtbar;
    });
    const allesDa = sr.getElementById("ed-alles-da");
    if (allesDa) allesDa.hidden = !(this._nurFehlende && sichtbarGesamt === 0);
  },

  /**
   * Ersetzt die Textfelder durch das Auswahlfeld von Home Assistant, wenn
   * es zur Verfuegung steht. Das Feld ist nicht offiziell dokumentiert,
   * deshalb bleibt bei jedem Problem das Textfeld stehen.
   */
  async _entitaetsAuswahl() {
    const name = "ha-entity-picker";
    try {
      if (!customElements.get(name) && typeof window.loadCardHelpers === "function") {
        // Laedt die Editoren von Home Assistant und damit das Auswahlfeld.
        const helfer = await window.loadCardHelpers();
        const karte = await helfer.createCardElement({ type: "entities", entities: [] });
        if (karte && karte.constructor && karte.constructor.getConfigElement) {
          await karte.constructor.getConfigElement();
        }
      }
      if (!customElements.get(name)) {
        await Promise.race([
          customElements.whenDefined(name),
          new Promise((_, nein) => setTimeout(() => nein(new Error("zeit")), 3000)),
        ]);
      }
    } catch (e) {
      return;
    }
    if (!customElements.get(name) || !this.shadowRoot) return;
    this.shadowRoot.querySelectorAll("input[data-entity]").forEach((input) => {
      const key = input.dataset.entity;
      const feld = ENTITY_FIELDS.find((f) => f.key === key);
      let picker;
      try {
        picker = document.createElement(name);
        picker.hass = this._hass;
        picker.value = (this._config.entities || {})[key] || "";
        const bereiche = feld && FIELD_DOMAIN[key];
        picker.includeDomains = bereiche || [
          "sensor", "number", "input_number", "binary_sensor", "switch",
          "input_boolean", "select", "input_select", "button", "input_button",
        ];
        picker.allowCustomEntity = true;
      } catch (e) {
        return;
      }
      picker.dataset.entity = key;
      picker.classList.add("ed-picker");
      picker.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const v = String((ev.detail && ev.detail.value) || "").trim();
        const entities = { ...this._config.entities };
        if (v) entities[key] = v;
        else delete entities[key];
        this._config = { ...this._config, entities };
        this._emit();
        this._zeigeEntitaetsZustand();
      });
      input.replaceWith(picker);
    });
  },
};
