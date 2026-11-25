/**
 * Diagnose der Animation (Option debug: true). Ein kleines Feld oben links
 * zeigt, was die Karte gerade tut: Kacheln, laufende Animationen, Umbauten,
 * Erneuerungen, ob die Animationsschleife zeichnet und wie viele Bilder je
 * Sekunde der Hauptablauf der Seite schafft. Ein Knopf legt die Animationen
 * neu an (takt.js, _taktErneuern).
 *
 * Das Feld liegt neben ha-card, nicht darin, damit es die Grafik und ihre
 * Ebenen nicht beruehrt.
 */

import { CARD_VERSION } from "../konstanten.js";

const FELD_STIL = [
  "position:absolute", "left:6px", "top:6px", "z-index:50", "max-width:calc(100% - 12px)",
  "padding:4px 6px", "border-radius:6px", "background:rgba(0,0,0,0.78)", "color:#d8e4f0",
  "font:11px/1.35 ui-monospace,'SF Mono',Menlo,monospace", "white-space:pre-line", "pointer-events:auto",
].join(";");
const KNOPF_STIL = [
  "margin-top:3px", "font:inherit", "padding:1px 6px", "border-radius:4px", "border:1px solid #55657f",
  "background:#1b2433", "color:inherit", "cursor:pointer",
].join(";");

export const diagnoseKarte = {
  _diagnoseStart() {
    this._diagnoseStop();
    const huelle = this.shadowRoot && this.shadowRoot.firstElementChild;
    if (!huelle) return;
    huelle.style.position = "relative";
    const feld = document.createElement("div");
    feld.className = "lhc-diagnose";
    feld.setAttribute("style", FELD_STIL);
    const text = document.createElement("div");
    const knopf = document.createElement("button");
    knopf.type = "button";
    knopf.textContent = this._t("dbg_neu");
    knopf.setAttribute("style", KNOPF_STIL);
    knopf.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._taktErneuern();
      this._diagnoseZeigen();
    });
    feld.append(text, knopf);
    huelle.appendChild(feld);
    const d = { feld, text, bilder: 0, rate: 0, seit: performance.now(), raf: 0, uhr: 0 };
    this._diag = d;
    // Bilder je Sekunde des Hauptablaufs: zaehlt requestAnimationFrame.
    const zaehle = () => {
      if (this._diag !== d) return;
      d.bilder++;
      d.raf = requestAnimationFrame(zaehle);
    };
    d.raf = requestAnimationFrame(zaehle);
    d.uhr = setInterval(() => this._diagnoseZeigen(), 1000);
    this._diagnoseZeigen();
  },

  _diagnoseStop() {
    const d = this._diag;
    if (!d) return;
    this._diag = null;
    cancelAnimationFrame(d.raf);
    clearInterval(d.uhr);
    if (d.feld && d.feld.parentNode) d.feld.parentNode.removeChild(d.feld);
  },

  _diagnoseZeigen() {
    const d = this._diag;
    if (!d) return;
    const jetzt = performance.now();
    const dt = (jetzt - d.seit) / 1000;
    if (dt >= 0.9) {
      d.rate = Math.round(d.bilder / dt);
      d.bilder = 0;
      d.seit = jetzt;
    }
    const e = this._ebenen;
    const alle = this.shadowRoot && typeof this.shadowRoot.getAnimations === "function" ? this.shadowRoot.getAnimations() : [];
    const laufen = alle.filter((a) => a.playState === "running").length;
    // Bewegungen ohne Kachel zeichnet die Schleife Bild fuer Bild.
    const ohne = [];
    if (e) for (const [id, s] of this._animState) if (s && !e.komp.has(id)) ohne.push(id);
    const schleife = this._t(this._animLoop ? "dbg_schleife_an" : "dbg_schleife_aus");
    d.text.textContent = [
      `${CARD_VERSION} · ${this._t("dbg_kacheln")} ${e ? e.kacheln.length : 0} · ${this._t("dbg_animationen")} ${laufen}/${alle.length}`,
      `${this._t("dbg_umbauten")} ${this._umbauten || 0} · ${this._t("dbg_erneuert")} ${this._erneuert || 0} · ${schleife}${ohne.length ? ` (${ohne.join(", ")})` : ""}`,
      `${d.rate} ${this._t("dbg_bilder")}${this._unsichtbar ? ` · ${this._t("dbg_unsichtbar")}` : ""}${e ? "" : ` · ${this._t("dbg_ohne_kacheln")}`}`,
    ].join("\n");
  },
};
