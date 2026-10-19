/**
 * Hilfefenster mit Suche, Gruppen und kopierbaren Entitaeten.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { INTEGRATION_DOMAIN } from "../erkennung.js";
import { HILFE } from "../hilfe-daten.js";
import { escapeHtml } from "../hilfsfunktionen.js";
import { hilfeText } from "../sprachen.js";
import { tf } from "../texte.js";

export const hilfeKarte = {
  /* -------------------- Hilfe -------------------- */
  _buildHilfe() {
    const sr = this.shadowRoot;
    const knopf = sr.getElementById("hilfe-knopf");
    const fenster = sr.getElementById("hilfe");
    if (!knopf || !fenster) return;
    knopf.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._oeffneHilfe();
    });
    sr.getElementById("hilfe-zu").addEventListener("click", () => this._schliesseHilfe());
    fenster.addEventListener("click", (ev) => {
      if (ev.target === fenster) this._schliesseHilfe();
    });
    fenster.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") this._schliesseHilfe();
    });
    const suche = sr.getElementById("hilfe-suche");
    suche.addEventListener("input", () => this._zeigeHilfe());
  },

  _oeffneHilfe() {
    const sr = this.shadowRoot;
    const fenster = sr.getElementById("hilfe");
    if (!fenster) return;
    this._hilfeGruppe = this._hilfeGruppe || "";
    this._hilfeIndex = this._hilfeEntitaeten();
    this._hilfeChips();
    this._zeigeHilfe();
    fenster.hidden = false;
    const suche = sr.getElementById("hilfe-suche");
    // Ins Suchfeld nur mit Maus. Auf Handy und Tablet ginge sonst sofort
    // die Tastatur auf, auch im Querformat oder auf grossen Geraeten.
    // Dort bekommt das Fenster selbst den Fokus, damit Escape weiter geht.
    const maus =
      window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (suche && maus) {
      suche.focus();
    } else {
      const box = fenster.querySelector(".lhc-hilfe-box");
      if (box) box.focus({ preventScroll: true });
    }
  },

  _schliesseHilfe() {
    const fenster = this.shadowRoot.getElementById("hilfe");
    if (fenster) fenster.hidden = true;
  },

  /** Schaltflaechen zum Filtern nach Gruppe. */
  _hilfeChips() {
    const sr = this.shadowRoot;
    const host = sr.getElementById("hilfe-chips");
    if (!host) return;
    const sp = this._sp();
    const chips = [{ id: "", titel: this._t("h_alle") }].concat(
      HILFE.map((g) => ({ id: g.id, titel: hilfeText(sp, g.id, g.titel) }))
    );
    host.innerHTML = chips
      .map(
        (c) => `<button type="button" data-g="${c.id}"
          class="${c.id === this._hilfeGruppe ? "aktiv" : ""}">${escapeHtml(c.titel)}</button>`
      )
      .join("");
    host.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        this._hilfeGruppe = b.dataset.g;
        host.querySelectorAll("button").forEach((x) =>
          x.classList.toggle("aktiv", x === b)
        );
        this._zeigeHilfe();
      })
    );
  },

  /**
   * Sucht zu jeder Kennung (top9, setdhwtemp, xtop3, opt0, 1wire, s0) die
   * Entitaeten in Home Assistant. Zuerst ueber die Registrierung von
   * HeishaMon by Lutarym (translation_key), sonst ueber die Endung der
   * Entity-ID, damit auch umbenannte oder per MQTT angelegte Entitaeten
   * gefunden werden.
   */
  _hilfeEntitaeten() {
    // Immer die echten Entitaeten, auch im Demomodus.
    const q = this._hass || {};
    const index = {};
    const dazu = (schluessel, id) => {
      if (!schluessel || !id) return;
      const k = String(schluessel).toLowerCase();
      if (!index[k]) index[k] = [];
      if (!index[k].includes(id)) index[k].push(id);
    };
    const reg = q.entities || {};
    Object.keys(reg).forEach((id) => {
      const e = reg[id];
      if (!e || e.platform !== INTEGRATION_DOMAIN) return;
      if (e.translation_key) dazu(e.translation_key, id);
      if (/_1wire_[^.]+$/.test(id)) dazu("1-wire", id);
      if (/^s0_/.test(e.translation_key || "")) dazu("s0", id);
    });
    Object.keys(q.states || {}).forEach((id) => {
      if (!/heishamon/i.test(id)) return;
      const m = id.match(/[._]((?:x?top|opt)\d+|set[a-z0-9]+)$/i);
      if (m) dazu(m[1], id);
      if (/_1wire_[^.]+$/.test(id)) dazu("1-wire", id);
      if (/_s0_\d+_(power|energy)$/.test(id)) dazu("s0", id);
    });
    // Sensoren zuerst, dann die stellbaren Entitaeten.
    const reihe = ["sensor", "number", "switch", "select", "button"];
    Object.values(index).forEach((liste) =>
      liste.sort((a, b) => {
        const ra = reihe.indexOf(a.split(".")[0]);
        const rb = reihe.indexOf(b.split(".")[0]);
        return (ra < 0 ? 9 : ra) - (rb < 0 ? 9 : rb) || a.localeCompare(b);
      })
    );
    return index;
  },

  /** Entitaeten zu einem Hilfeeintrag. */
  _hilfeIds(e) {
    const index = this._hilfeIndex || {};
    const ids = [];
    [e.l, e.s].forEach((k) => {
      if (!k || /^OT /.test(k)) return;
      (index[String(k).toLowerCase()] || []).forEach((id) => {
        if (!ids.includes(id)) ids.push(id);
      });
    });
    return ids;
  },

  /** Kopiert Text, auch ohne gesicherte Verbindung (http im Heimnetz). */
  async _kopiere(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // weiter mit dem Ersatzweg
    }
    const feld = document.createElement("textarea");
    feld.value = text;
    feld.setAttribute("readonly", "");
    feld.style.position = "fixed";
    feld.style.opacity = "0";
    document.body.appendChild(feld);
    feld.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    feld.remove();
    return ok;
  },

  /** Liste nach Gruppe und Suchwort. */
  _zeigeHilfe() {
    const sr = this.shadowRoot;
    const liste = sr.getElementById("hilfe-liste");
    const suche = sr.getElementById("hilfe-suche");
    if (!liste) return;
    const sp = this._sp();
    // Gross, klein und Akzente spielen bei der Suche keine Rolle.
    const norm = (x) =>
      String(x || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
    const woerter = norm(suche ? suche.value : "")
      .split(/\s+/)
      .filter(Boolean);
    const lesen = escapeHtml(this._t("h_lesen"));
    const kopierTitel = escapeHtml(this._t("h_kopieren"));
    const keineEntitaet = escapeHtml(this._t("h_keine_entitaet"));
    const schreiben = escapeHtml(this._t("h_schreiben"));
    let anzahl = 0;
    let html = "";
    HILFE.forEach((g) => {
      if (this._hilfeGruppe && g.id !== this._hilfeGruppe) return;
      const treffer = g.e.filter((e) => {
        if (!woerter.length) return true;
        const text = norm(
          [
            hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.n`, e.n),
            hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.t`, e.t),
            e.l,
            e.s,
            hilfeText(sp, g.id, g.titel),
          ].concat(this._hilfeIds(e)).join(" ")
        );
        // Kennungen wie TOP9 nur als ganzes Wort, sonst faende TOP9
        // auch TOP90 bis TOP99.
        return woerter.every((w) =>
          /^(x?top|opt)\d+$/.test(w)
            ? new RegExp(`(^|[^a-z0-9])${w}($|[^a-z0-9])`).test(text)
            : text.includes(w)
        );
      });
      if (!treffer.length) return;
      anzahl += treffer.length;
      html += `<section><h3>${escapeHtml(hilfeText(sp, g.id, g.titel))}</h3>`;
      treffer.forEach((e) => {
        const marken = [];
        if (e.l) marken.push(`<span class="marke lesen">${lesen} · ${escapeHtml(e.l)}</span>`);
        if (e.s) marken.push(`<span class="marke schreiben">${schreiben} · ${escapeHtml(e.s)}</span>`);
        if (e.b) marken.push(`<span class="marke bereich">${escapeHtml(e.b)}</span>`);
        // Zu jeder Kennung die vollstaendige Entitaet, per Klick kopierbar.
        let entitaeten = "";
        if (e.l || e.s) {
          const ids = this._hilfeIds(e);
          entitaeten = ids.length
            ? `<div class="entitaeten">${ids
                .map(
                  (id) => `<button type="button" class="entitaet" data-kopie="${escapeHtml(id)}"
                    title="${kopierTitel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v11h-2V5H8z"/><path d="M5 7h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v11h9V9z"/></svg><span>${escapeHtml(id)}</span></button>`
                )
                .join("")}</div>`
            : `<div class="entitaeten keine-entitaet">${keineEntitaet}</div>`;
        }
        html += `<article>
          <div class="eintrag-kopf"><b>${escapeHtml(hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.n`, e.n))}</b>${marken.join("")}</div>
          <p>${escapeHtml(hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.t`, e.t))}</p>
          ${entitaeten}
        </article>`;
      });
      html += "</section>";
    });
    liste.innerHTML = html || `<p class="keine">${escapeHtml(this._t("h_keine"))}</p>`;
    liste.querySelectorAll("button[data-kopie]").forEach((b) =>
      b.addEventListener("click", async () => {
        const ok = await this._kopiere(b.dataset.kopie);
        if (!ok) return;
        b.classList.add("kopiert");
        b.dataset.hinweis = this._t("h_kopiert");
        setTimeout(() => b.classList.remove("kopiert"), 1500);
      })
    );
    liste.scrollTop = 0;
    const z = sr.getElementById("hilfe-anzahl");
    if (z) z.textContent = anzahl === 1 ? this._t("h_anzahl1") : tf(this._t("h_anzahl"), { n: anzahl });
  },
};
