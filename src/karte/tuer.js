/**
 * Tuer der Waermepumpe mit den erweiterten Einstellungen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { TUER_FELDER } from "../felder.js";
import { clamp, escapeHtml, fmt, rawState, stellbar } from "../hilfsfunktionen.js";
import { feldText, tf } from "../texte.js";

export const tuerKarte = {
  /* -------------------- Tuer der Waermepumpe -------------------- */

  /**
   * Knopf unten rechts in der Waermepumpe. Die Front klappt nach links
   * auf, dahinter liegen Einstellungen, die in der Karte sonst nicht zu
   * sehen sind. Aenderungen werden erst mit "Uebernehmen" gesendet.
   */
  _buildTuer() {
    const sr = this.shadowRoot;
    const knopf = sr.getElementById("tuer-knopf");
    if (knopf) {
      const auf = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        this._oeffneTuer();
      };
      knopf.addEventListener("click", auf);
      knopf.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") auf(ev);
      });
    }
    const ab = sr.getElementById("tuer-abbrechen");
    const ok = sr.getElementById("tuer-ok");
    if (ab) ab.addEventListener("click", () => this._schliesseTuer());
    if (ok) ok.addEventListener("click", () => this._tuerUebernehmen());
  },

  /** Aktualisiert die COP-Zeilen, solange die Tuer offen ist. */
  _tuerCopAuffrischen() {
    if (!this._tuerListe) return;
    const panel = this.shadowRoot.getElementById("tuer-panel");
    if (!panel || panel.hidden) return;
    this._tuerListe.forEach((f, i) => {
      if (f.cop) this._tuerZeige(i);
    });
  },

  /** Einstellungen, zu denen es eine Entitaet gibt. */
  _tuerFelder() {
    const q = this._quelle;
    if (!q) return [];
    const jaz = this._jazQuellen();
    return TUER_FELDER.map((f) =>
      f.jaz ? { ...f, id: jaz ? "jaz.tabelle" : "" } : { ...f, id: this._e(f.key) }
    ).filter((f) => f.id && (f.jaz || q.states[f.id]));
  },

  _oeffneTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (karte.classList.contains("tuer-offen")) return;
    this._tuerNeu = {};
    this._tuerZeilen();
    this._ladeJaz();
    const blatt = this._tuerBlatt();
    karte.classList.add("tuer-offen");
    karte.classList.remove("tuer-zu");
    panel.hidden = false;
    this._tuerLage();
    // Erst zeichnen, dann drehen, sonst springt die Tuer ohne Uebergang.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (blatt) blatt.classList.add("auf");
        panel.classList.add("sichtbar");
      })
    );
  },

  _schliesseTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (!karte.classList.contains("tuer-offen")) return;
    panel.classList.remove("sichtbar");
    this._tuerNeu = {};
    karte.classList.remove("tuer-offen");
    // Die Originalgrafik bleibt verborgen, bis die Tuer ganz zu ist.
    karte.classList.add("tuer-zu");
    const blatt = this.shadowRoot.getElementById("tuer-blatt");
    const fertig = () => {
      if (karte.classList.contains("tuer-offen")) return;
      karte.classList.remove("tuer-zu");
      if (blatt) blatt.remove();
      panel.hidden = true;
    };
    if (blatt) {
      blatt.classList.remove("auf");
      blatt.addEventListener("transitionend", fertig, { once: true });
      // Falls kein Uebergangsende kommt, etwa bei ausgeschalteten Effekten.
      setTimeout(fertig, 900);
    } else {
      fertig();
    }
  },

  /**
   * Legt eine Kopie der Front als eigene Ebene genau ueber die
   * Waermepumpe. Die Kopie ist unbewegt und ohne Weichzeichner, damit
   * das Drehen fluessig bleibt.
   */
  _tuerBlatt() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const gruppe = sr.getElementById("unit-group");
    const innen = sr.getElementById("unit-innen");
    const svg = gruppe && gruppe.ownerSVGElement;
    if (!karte || !gruppe || !innen || !svg) return null;
    const alt = sr.getElementById("tuer-blatt");
    if (alt) alt.remove();
    const rahmen = innen.querySelector("rect");
    const x = Number(rahmen.getAttribute("x"));
    const y = Number(rahmen.getAttribute("y"));
    const w = Number(rahmen.getAttribute("width"));
    const h = Number(rahmen.getAttribute("height"));
    const k = karte.getBoundingClientRect();
    const r = rahmen.getBoundingClientRect();
    const kopie = gruppe.cloneNode(true);
    kopie.removeAttribute("class");
    kopie.querySelectorAll("[id]").forEach((n) => {
      // Der Weichzeichner kostet bei jedem Bild Rechenzeit.
      if (n.id === "unit-glow") n.remove();
      else n.removeAttribute("id");
    });
    kopie.removeAttribute("id");
    const blatt = document.createElement("div");
    blatt.className = "lhc-tuer-blatt";
    blatt.id = "tuer-blatt";
    Object.assign(blatt.style, {
      left: `${r.left - k.left}px`,
      top: `${r.top - k.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
    });
    const ns = "http://www.w3.org/2000/svg";
    const bild = document.createElementNS(ns, "svg");
    bild.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    bild.setAttribute("preserveAspectRatio", "none");
    bild.appendChild(kopie);
    blatt.appendChild(bild);
    karte.appendChild(blatt);
    return blatt;
  },

  /**
   * Legt das Feld genau ueber den Innenraum der Waermepumpe. Ist die
   * Karte klein, wird es breiter und hoeher als der Innenraum, damit die
   * Bedienelemente lesbar bleiben, und bleibt innerhalb der Karte.
   */
  _tuerLage() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const innen = sr.getElementById("unit-innen");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !innen || !panel) return;
    const k = karte.getBoundingClientRect();
    const r = innen.getBoundingClientRect();
    let links = r.left - k.left;
    let oben = r.top - k.top;
    // Ab 230 Pixel passt alles in den Innenraum, darunter wird das Feld
    // breiter als die Waermepumpe.
    let breite = r.width >= 230 ? r.width : 260;
    let hoehe = Math.max(r.height, Math.min(440, k.height - 8));
    if (links + breite > k.width - 4) links = Math.max(4, k.width - 4 - breite);
    if (oben + hoehe > k.height - 4) oben = Math.max(4, k.height - 4 - hoehe);
    hoehe = Math.min(hoehe, k.height - 8);
    panel.classList.remove("zwei");
    Object.assign(panel.style, {
      left: `${links}px`,
      top: `${oben}px`,
      width: `${breite}px`,
      height: `${hoehe}px`,
    });
    // Reicht die Hoehe nicht, wird das Feld breiter und zeigt zwei oder
    // drei Spalten, statt einen Rollbalken zu brauchen. Jede Spalte
    // bleibt mindestens 230 Pixel breit.
    const liste = sr.getElementById("tuer-liste");
    panel.style.removeProperty("--spalten");
    for (let spalten = 2; spalten <= 3; spalten++) {
      if (!liste || liste.scrollHeight <= liste.clientHeight + 1) break;
      const breiteN = Math.max(breite, 230 * spalten + 16 * (spalten - 1) + 20);
      if (breiteN > k.width - 8) break;
      let l = links;
      if (l + breiteN > k.width - 4) l = Math.max(4, k.width - 4 - breiteN);
      panel.classList.add("zwei");
      panel.style.setProperty("--spalten", String(spalten));
      Object.assign(panel.style, { left: `${l}px`, width: `${breiteN}px` });
    }
  },

  /** Baut die Zeilen aus dem aktuellen Stand der Entitaeten. */
  _tuerZeilen() {
    const sr = this.shadowRoot;
    const liste = sr.getElementById("tuer-liste");
    if (!liste) return;
    const q = this._quelle;
    const demo = Boolean(this._config.demo);
    const felder = this._tuerFelder();
    let abschnitt = "";
    let html = "";
    felder.forEach((f, i) => {
      // Jeder Abschnitt ist ein eigener Block, damit er bei zwei Spalten
      // nicht auseinanderbricht.
      if (f.abschnitt !== abschnitt) {
        if (abschnitt) html += "</div>";
        abschnitt = f.abschnitt;
        html += `<div class="lhc-tuer-gruppe"><div class="lhc-tuer-abschnitt">${escapeHtml(this._t(abschnitt))}</div>`;
      }
      // Kurze Beschriftung, der Abschnitt nennt den Zusammenhang. Der
      // volle Name steht im Tooltip und im Editor.
      const titel = escapeHtml(this._t(`k_${f.key}`));
      const lang = escapeHtml(feldText(f, this._sp()));
      const bereich = f.id.split(".")[0];
      if (f.cop) {
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${escapeHtml(this._t(`j_${f.cop}`))}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;
        return;
      }
      if (f.jaz) {
        // Kleine Tabelle: Zeilen Heizen, Warmwasser, Gesamt; Spalten die
        // beiden Zeitraeume. Gesamt nur, wenn es beide Arten gibt.
        const quellen = this._jazQuellen() || {};
        const arten = ["heizen", "ww"].filter((k) => quellen[k]);
        if (arten.length === 2) arten.push("gesamt");
        const zellen = arten
          .map((k) => {
            const kl = k === "gesamt" ? "jaz-gesamt" : "";
            return `<span class="jaz-art ${kl}">${escapeHtml(this._t(`j_${k}`))}</span>
              <output class="${kl}" data-jaz="${k}" data-w="waerme">--</output>
              <output class="${kl}" data-jaz="${k}" data-w="strom">--</output>
              <output class="${kl} jaz-wert" data-jaz="${k}" data-w="jaz">--</output>`;
          })
          .join("");
        html += `<div class="lhc-jaz" id="tuer-z${i}">
            <span></span><span class="jaz-kopf">${escapeHtml(this._t("j_kwaerme"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kstrom"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kjaz"))}</span>
            ${zellen}
          </div><em class="jaz-seit">${escapeHtml(this._t("j_unter"))}</em><em class="jaz-seit" id="tuer-s${i}"></em>`;
        return;
      }
      if (f.info) {
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;
        return;
      }
      if (f.knopf) {
        const kann = demo || bereich === "button" || bereich === "input_button";
        // Daneben der aktuelle Fehlercode aus TOP44, damit klar ist, was
        // quittiert wird.
        const code = rawState(q, this._e("error"));
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${
          code && code !== "unknown" && code !== "unavailable" ? ` <em>${escapeHtml(code)}</em>` : ""
        }</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}"><button type="button" data-i="${i}" data-o="press"
            ${kann ? "" : "disabled"}>${escapeHtml(this._t("t_quittieren"))}</button></div></div>`;
        return;
      }
      if (f.schalter) {
        const kann = demo || bereich === "switch" || bereich === "input_boolean";
        const knoepfe = [["off", "o_aus"], ["on", "o_ein"]]
          .map(([o, t]) => `<button type="button" data-i="${i}" data-o="${o}"
              ${kann ? "" : "disabled"}>${escapeHtml(this._t(t))}</button>`)
          .join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
        return;
      }
      if (f.auswahl) {
        const st = q.states[f.id];
        const optionen = (st.attributes && st.attributes.options) || [];
        const kann = demo || bereich === "select" || bereich === "input_select";
        const intern =
          optionen.length === f.auswahl.length &&
          optionen.every((o, n) => o === `mode_${n}`);
        const knoepfe = optionen
          .map((o, n) => {
            const text = intern ? this._t(f.auswahl[n]) : o;
            return `<button type="button" data-i="${i}" data-o="${escapeHtml(o)}"
              ${kann ? "" : "disabled"}>${escapeHtml(text)}</button>`;
          })
          .join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
      } else {
        const kann = demo || stellbar(f.id);
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${
          kann ? "" : `<em> (${escapeHtml(this._t("t_nur_lesbar"))})</em>`
        }</span>
          <div class="lhc-tuer-stell">
            ${kann ? `<button type="button" class="lhc-step klein" data-i="${i}" data-r="-1">&minus;</button>` : ""}
            <output id="tuer-z${i}">--</output>
            ${kann ? `<button type="button" class="lhc-step klein" data-i="${i}" data-r="1">+</button>` : ""}
          </div></div>`;
      }
    });
    if (abschnitt) html += "</div>";
    liste.innerHTML = html;
    this._tuerListe = felder;
    liste.querySelectorAll("button[data-r]").forEach((b) =>
      b.addEventListener("click", () =>
        this._tuerStelle(Number(b.dataset.i), Number(b.dataset.r))
      )
    );
    liste.querySelectorAll("button[data-o]").forEach((b) =>
      b.addEventListener("click", () => this._tuerWaehle(Number(b.dataset.i), b.dataset.o))
    );
    felder.forEach((f, i) => this._tuerZeige(i));
  },

  /** Grenzen einer Zahl, gemeldete Werte der Entitaet haben Vorrang. */
  _tuerGrenzen(f) {
    const a = (this._quelle.states[f.id] || {}).attributes || {};
    const zahl = (w, ersatz) => (Number.isFinite(Number(w)) && w !== null && w !== "" ? Number(w) : ersatz);
    return { min: zahl(a.min, f.min), max: zahl(a.max, f.max), step: zahl(a.step, f.step) || 1 };
  },

  /** Aktueller Wert einer Zeile, geaendert oder aus Home Assistant. */
  _tuerWert(f) {
    const neu = this._tuerNeu && this._tuerNeu[f.id];
    if (neu) return neu.wert;
    const st = this._quelle.states[f.id];
    if (!st) return null;
    if (f.auswahl || f.schalter) return st.state;
    if (f.knopf) return null;
    const ist = parseFloat(st.state);
    if (Number.isNaN(ist)) return null;
    const gehalten = this._gehaltenerWert(f.id, ist);
    return gehalten !== null ? gehalten : ist;
  },

  _tuerZeige(i) {
    const f = this._tuerListe && this._tuerListe[i];
    const el = this.shadowRoot.getElementById(`tuer-z${i}`);
    if (!f || !el) return;
    if (f.jaz) {
      this._jazZeige(f, el, this.shadowRoot.getElementById(`tuer-s${i}`));
      return;
    }
    if (f.cop) {
      // Tagesmittelwert seit Mitternacht, im Demomodus der aktuelle Wert.
      const v = this._cop(this._quelle, f.key);
      el.textContent = v === null ? "--" : tf(this._t("j_cop_heute"), { v: fmt(v, 1) });
      return;
    }
    const geaendert = Boolean(this._tuerNeu && this._tuerNeu[f.id]);
    const wert = this._tuerWert(f);
    if (f.knopf) {
      el.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("aktiv", geaendert);
        b.classList.toggle("geaendert", geaendert);
      });
      return;
    }
    if (f.info) {
      el.textContent = wert === null ? "--" : `${fmt(wert, 0)}${f.einheit ? ` ${f.einheit}` : ""}`;
      return;
    }
    if (f.auswahl || f.schalter) {
      el.querySelectorAll("button").forEach((b) => {
        const aktiv = b.dataset.o === wert;
        b.classList.toggle("aktiv", aktiv);
        b.classList.toggle("geaendert", aktiv && geaendert);
      });
      return;
    }
    const g = this._tuerGrenzen(f);
    const stellen = g.step < 1 ? 1 : 0;
    el.textContent =
      wert === null ? "--" : `${fmt(wert, stellen)}${f.einheit ? ` ${f.einheit}` : ""}`;
    el.classList.toggle("geaendert", geaendert);
  },

  _tuerStelle(i, richtung) {
    const f = this._tuerListe && this._tuerListe[i];
    if (!f) return;
    const jetzt = this._tuerWert(f);
    if (jetzt === null) return;
    const g = this._tuerGrenzen(f);
    const neu = clamp(Math.round((jetzt + richtung * g.step) * 100) / 100, g.min, g.max);
    if (neu === jetzt) return;
    this._tuerMerke(f, neu);
    this._tuerZeige(i);
  },

  _tuerWaehle(i, option) {
    const f = this._tuerListe && this._tuerListe[i];
    if (!f) return;
    if (f.knopf) {
      // Zweiter Klick nimmt das Quittieren wieder zurueck.
      if (this._tuerNeu && this._tuerNeu[f.id]) delete this._tuerNeu[f.id];
      else this._tuerNeu[f.id] = { wert: "press", art: "knopf" };
      this._tuerZeige(i);
      return;
    }
    this._tuerMerke(f, option);
    this._tuerZeige(i);
  },

  /** Merkt eine Aenderung vor. Zurueck auf den alten Wert hebt sie auf. */
  _tuerMerke(f, wert) {
    if (!this._tuerNeu) this._tuerNeu = {};
    delete this._tuerNeu[f.id];
    const alt = this._tuerWert(f);
    if (wert === alt) return;
    this._tuerNeu[f.id] = { wert, art: f.auswahl ? "auswahl" : f.schalter ? "schalter" : "zahl" };
  },

  /** Sendet alle vorgemerkten Aenderungen und schliesst die Tuer. */
  _tuerUebernehmen() {
    const q = this._quelle;
    const neu = this._tuerNeu || {};
    Object.keys(neu).forEach((id) => {
      const e = neu[id];
      const bereich = id.split(".")[0];
      if (e.art === "auswahl") {
        q.callService(bereich, "select_option", { entity_id: id, option: e.wert });
      } else if (e.art === "schalter") {
        q.callService(bereich, e.wert === "on" ? "turn_on" : "turn_off", { entity_id: id });
      } else if (e.art === "knopf") {
        q.callService(bereich, "press", { entity_id: id });
      } else {
        this._halte(id, e.wert);
        q.callService(bereich, "set_value", { entity_id: id, value: e.wert });
      }
    });
    this._schliesseTuer();
  },
};
