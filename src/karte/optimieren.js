/**
 * Bestaetigungsfenster der Analyse: zeigt je Vorschlag die Parameter mit
 * IST- und NEU-Wert und setzt sie erst nach "Parameter setzen".
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Gesetzt wird wie in den anderen Fenstern der Karte: ueber die
 * Entitaet (number.set_value), sonst ueber den Befehlskanal von HeishaMon
 * (MQTT, Befehle laut HeishaMon MQTT-Topics.md). Die Heizkurve geht im
 * Rueckfall als ein SetCurves-Dokument je Heizkreis.
 */
import { ENTITY_FIELDS } from "../felder.js";
import { escapeHtml, fmt, numState, stellbar } from "../hilfsfunktionen.js";
import { feldText, tf } from "../texte.js";

export const optimierenKarte = {
  /** Fenster mit dem Vorschlag eines Pruefpunkts oeffnen. */
  _zeigeVorschlag(punkt) {
    const sr = this.shadowRoot;
    const modal = sr && sr.getElementById("an-modal");
    if (!modal || !punkt || !punkt.aktion) return;
    this._vorschlag = punkt;
    const a = punkt.aktion;
    const zeile = (w) => {
      const f = ENTITY_FIELDS.find((x) => x.key === w.feld);
      const name = f ? feldText(f, this._sp()) : w.feld;
      const top = f && f.hint ? (f.hint.match(/TOP\d+/) || [""])[0] : "";
      const e = w.einheit ? ` ${w.einheit}` : "";
      // Auswahlen (Pumpenregelung) zeigen Texte, Zahlen mit Einheit.
      const ist = w.auswahl ? w.ist : fmt(w.ist, 0) + e;
      const neu = w.auswahl ? w.neu : fmt(w.neu, 0) + e;
      return `<tr><td>${escapeHtml(name)}<small>${escapeHtml([top, w.id].filter(Boolean).join(" · "))}</small></td>
        <td class="ist">${escapeHtml(ist)}</td><td class="pfeil">→</td>
        <td class="neu">${escapeHtml(neu)}</td></tr>`;
    };
    modal.querySelector(".lhc-an-modal-box").innerHTML = `
      <h3 id="an-modal-titel">${escapeHtml(this._t("an_opt_titel"))}</h3>
      <div class="lhc-an-modal-sub">${escapeHtml(tf(this._t("an_opt_sub"), { t: punkt.titel }))}</div>
      <table class="lhc-an-tabelle">
        <thead><tr><th>${escapeHtml(this._t("an_opt_param"))}</th><th>${escapeHtml(this._t("an_opt_ist"))}</th><th></th>
          <th>${escapeHtml(this._t("an_opt_neu"))}</th></tr></thead>
        <tbody>${a.aenderungen.map(zeile).join("")}</tbody>
      </table>
      <p class="lhc-an-modal-text">${escapeHtml(a.grund)}</p>
      ${a.hinweis ? `<p class="lhc-an-modal-text">${escapeHtml(a.hinweis)}</p>` : ""}
      <p class="lhc-an-modal-klein">${escapeHtml(this._t("an_opt_senden"))}</p>
      <div class="lhc-an-modal-knoepfe">
        <button type="button" class="lhc-an-btn" id="an-modal-ab">${escapeHtml(this._t("an_opt_ab"))}</button>
        <button type="button" class="lhc-an-btn prim" id="an-modal-ok">${escapeHtml(this._t("an_opt_ok"))}</button>
      </div>
      <div class="lhc-an-status" id="an-modal-status" hidden></div>`;
    modal.hidden = false;
    this._vorschlagLage();
    sr.getElementById("an-modal-ab").addEventListener("click", () => this._schliesseVorschlag());
    sr.getElementById("an-modal-ok").addEventListener("click", () => this._setzeVorschlag());
    const ok = sr.getElementById("an-modal-ok");
    if (ok) ok.focus({ preventScroll: true });
  },

  /** Das Fenster liegt genau ueber dem Analysefenster, auch wenn dieses rollt. */
  _vorschlagLage() {
    const sr = this.shadowRoot;
    const modal = sr && sr.getElementById("an-modal");
    const box = sr && sr.querySelector(".lhc-dia-box");
    if (!modal || modal.hidden || !box) return;
    const r = box.getBoundingClientRect();
    Object.assign(modal.style, {
      left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`,
    });
  },

  _schliesseVorschlag() {
    const modal = this.shadowRoot && this.shadowRoot.getElementById("an-modal");
    if (modal) modal.hidden = true;
    this._vorschlag = null;
  },

  /** Ist das Bestaetigungsfenster offen? */
  _vorschlagOffen() {
    const modal = this.shadowRoot && this.shadowRoot.getElementById("an-modal");
    return Boolean(modal && !modal.hidden);
  },

  /** Sendet alle Aenderungen des Vorschlags und meldet das Ergebnis. */
  _setzeVorschlag() {
    const p = this._vorschlag;
    if (!p || !p.aktion) return;
    const sr = this.shadowRoot;
    const ok = sr.getElementById("an-modal-ok");
    const ab = sr.getElementById("an-modal-ab");
    const status = sr.getElementById("an-modal-status");
    if (ok) ok.disabled = true;
    const q = this._quelle;
    const praefix = this._config.mqtt_prefix || "panasonic_heat_pump";
    const auftraege = [];
    const kurven = {};
    p.aktion.aenderungen.forEach((w) => {
      if (w.auswahl) {
        const bereich = w.id.split(".")[0];
        if (this._config.demo || bereich === "select" || bereich === "input_select") {
          auftraege.push(() => q.callService(bereich, "select_option", { entity_id: w.id, option: w.option }));
        } else if (w.befehl) {
          auftraege.push(() => q.callService("mqtt", "publish", { topic: `${praefix}/commands/${w.befehl}`, payload: String(w.nutzlast) }));
        }
        return;
      }
      // Neuen Wert sofort anzeigen, bis die Anlage ihn zurueckmeldet.
      this._halte(w.id, w.neu);
      if (this._config.demo || stellbar(w.id)) {
        auftraege.push(() => q.callService(w.id.split(".")[0], "set_value", { entity_id: w.id, value: w.neu }));
      } else if (w.kurve) {
        (kurven[w.kurve] = kurven[w.kurve] || {})[w.feld.replace(/^curve2?_/, "")] = w.neu;
      } else if (w.befehl) {
        auftraege.push(() => q.callService("mqtt", "publish", { topic: `${praefix}/commands/${w.befehl}`, payload: String(w.neu) }));
      }
    });
    // Heizkurve ohne stellbare Entitaeten: ein Dokument mit allen vier
    // Eckwerten je Heizkreis, sonst wuerden die anderen ueberschrieben.
    Object.keys(kurven).forEach((zone) => {
      const pre = zone === "2" ? "curve2_" : "curve_";
      const wert = (b) => {
        if (kurven[zone][b] !== undefined) return kurven[zone][b];
        const id = this._e(`${pre}${b}`);
        const ist = numState(q, id);
        const geh = this._gehaltenerWert(id, ist);
        return geh !== null ? geh : ist;
      };
      const w = { t_high: wert("t_high"), t_low: wert("t_low"), o_high: wert("o_high"), o_low: wert("o_low") };
      if (Object.values(w).some((v) => v === null)) return;
      auftraege.push(() =>
        q.callService("mqtt", "publish", {
          topic: `${praefix}/commands/SetCurves`,
          payload: JSON.stringify({
            [`zone${zone}`]: { heat: { target: { high: w.t_high, low: w.t_low }, outside: { high: w.o_high, low: w.o_low } } },
          }),
        })
      );
    });
    const melde = (fehler) => {
      if (!status) return;
      status.hidden = false;
      status.classList.toggle("fehler", Boolean(fehler));
      status.textContent = fehler
        ? tf(this._t("an_opt_fehler"), { m: String((fehler && fehler.message) || fehler) })
        : this._t("an_opt_gesendet");
      if (!fehler && ab) ab.textContent = this._t("an_opt_zu");
      if (fehler && ok) ok.disabled = false;
    };
    let lauf;
    try {
      lauf = Promise.all(auftraege.map((f) => Promise.resolve(f())));
    } catch (e) {
      lauf = Promise.reject(e);
    }
    lauf.then(() => melde(null)).catch((e) => melde(e || "?"));
  },
};
