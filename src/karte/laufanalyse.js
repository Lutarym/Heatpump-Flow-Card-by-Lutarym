/**
 * Analyse eines COP-Laufs unter 92 % des Datenblatts. Zeigt alle
 * Messwerte des Laufs, Befunde nur mit Messwert und Quelle und Vorschlaege
 * nur, wo die Wirkung eines Parameters belegt ist. Gesetzt wird erst nach
 * Bestaetigung im selben Fenster (optimieren.js).
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Befunde und ihre Grundlagen:
 *  - Laufzeit unter 10 min: Ziel 10 bis 20 min je Start (BWP, 42watt
 *    "Taktung"). Gemessen wird dazu der COP der ersten 5 Minuten gegenueber
 *    danach. Kein Parameter mit belegter Wirkung, darum kein Vorschlag.
 *  - Abtauung im Lauf: Abtauen braucht zusaetzliche Energie (42watt
 *    "Wirkungsgrad"). Die Abtauung steuert die Waermepumpe selbst.
 *  - Heizstab im Lauf: arbeitet immer mit COP 1 (42watt "Wirkungsgrad").
 *    Vorschlag Einschaltgrenze -5 °C wie in der Analyse, nur wenn er im
 *    Heizbetrieb bei ueber -3 °C lief und die Grenze ueber -3 °C steht.
 *  - Spreizung: Grenzen und Vorschlag wie in der Analyse (BWP, Panasonic
 *    Servicehandbuch). Beim Warmwasser nennt der BWP bis 10 K.
 *  - Vorlauf ueber dem Richtwert der Heizflaechen: je Kelvin mehr
 *    Temperaturhub rund 3 % mehr Strom (42watt "Wirkungsgrad"); Vorschlag
 *    Heizkurve -2 K wie in der Analyse.
 * Trifft nichts davon zu, sagt das Fenster das, statt zu raten.
 */
import { ENTITY_FIELDS } from "../felder.js";
import { escapeHtml, fmt, indexBis } from "../hilfsfunktionen.js";
import { feldText, tf } from "../texte.js";
import { AUFFAELLIG, GRENZE, QUELLEN, anZeiten, vlStufe } from "./analyse.js";
import { energie, mittel } from "./auswertung.js";

const MIN = 60000;

/** Groesster Wert einer Reihe im Zeitraum, mit dem Stand zu Beginn. */
function hoechst(reihe, von, bis) {
  if (!reihe || !reihe.length) return null;
  let m = null;
  for (let i = Math.max(0, indexBis(reihe, von)); i < reihe.length && reihe[i].t < bis; i++) {
    const v = reihe[i].v;
    if (Number.isFinite(v) && (m === null || v > m)) m = v;
  }
  return m;
}

/** Kleinster Wert einer Reihe im Zeitraum, mit dem Stand zu Beginn. */
function kleinst(reihe, von, bis) {
  if (!reihe || !reihe.length) return null;
  let m = null;
  for (let i = Math.max(0, indexBis(reihe, von)); i < reihe.length && reihe[i].t < bis; i++) {
    const v = reihe[i].v;
    if (Number.isFinite(v) && (m === null || v < m)) m = v;
  }
  return m;
}

/** Summe der Minuten aus Abschnitten von anZeiten. */
const minuten = (abschnitte) => abschnitte.reduce((s, x) => s + x.minuten, 0);

export const laufanalyseKarte = {
  /** Uhrzeit eines Laufs, bei mehr als einem Tag mit Datum. */
  _laZeit(t) {
    const d = new Date(t);
    const uhr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const a = this._auswertung;
    return a && a.t1 - a.t0 > 1.05 * 86400000 ? `${this._zrDatum(t, false)} ${uhr}` : uhr;
  },

  /** Messwerte, Befunde und Vorschlaege eines Laufs. */
  _laufAnalyse(l) {
    const d = this._auswertung;
    const t = (k) => this._t(k);
    const z = (v, s = 1) => (v === null || v === undefined || !Number.isFinite(v) ? "--" : fmt(v, s));
    const werte = [];
    const befunde = [];
    const ok = [];
    const vorschlaege = [];
    const ohne = [];
    const puffer = this._anMitPuffer();

    /* ---------- Messwerte ---------- */
    werte.push([t("aussentemperatur"), l.aussen !== null ? `${z(l.aussen)} °C` : "--"]);
    werte.push([t("la_w_vlrl"), tf(t("la_w_vlrl_t"), { v: z(l.vorlauf), r: z(l.ruecklauf) })]);
    if (l.ww) {
      werte.push([t("la_w_vl_ww"), tf(t("la_w_von_bis"), { a: z(kleinst(d.vorlauf, l.von, l.bis), 0), b: z(hoechst(d.vorlauf, l.von, l.bis), 0) })]);
    }
    const sp = l.vorlauf !== null && l.ruecklauf !== null ? l.vorlauf - l.ruecklauf : null;
    const dtSoll = this._anWert("heat_delta");
    werte.push([t("la_w_sp"), sp === null ? "--"
      : !l.ww && dtSoll !== null ? tf(t("la_w_sp_soll"), { s: z(sp), e: z(dtSoll, 0) }) : `${z(sp)} K`]);
    if (!l.ww && puffer && (l.kreis1 !== null || l.kreis2 !== null)) {
      werte.push([t("la_w_kreis"), [l.kreis1 !== null ? `HK1 ${z(l.kreis1)} °C` : "", l.kreis2 !== null ? `HK2 ${z(l.kreis2)} °C` : ""]
        .filter(Boolean).join(" · ")]);
    }
    const vdMittel = mittel(d.vd, l.von, l.bis, true);
    werte.push([t("verdichter"), tf(t("la_w_vd_t"), { m: z(vdMittel, 0), x: z(hoechst(d.vd, l.von, l.bis), 0) })]);
    if (d.durchfluss && d.durchfluss.length) {
      werte.push([t("la_w_fluss"), tf(t("la_w_fluss_t"), { m: z(mittel(d.durchfluss, l.von, l.bis, true)) })]);
    }
    const abtau = minuten(anZeiten(d.abtau || [], d.aussen, l.von, l.bis));
    // Beim Heizen zaehlen nur Heizabschnitte: TOP60 meldet auch Warmwasser.
    const stabZeiten = anZeiten(d.stabIntern || [], d.aussen, l.von, l.bis, l.ww ? null : d.ventil)
      .concat(anZeiten(d.stabExtern || [], d.aussen, l.von, l.bis, l.ww ? null : d.ventil));
    const stab = minuten(stabZeiten);
    werte.push([t("an_t_abtauung"), tf(t("la_w_min"), { m: z(abtau, 0) })]);
    werte.push([t("la_w_stab"), tf(t("la_w_min"), { m: z(stab, 0) })]);
    // COP der ersten 5 Minuten und danach: wie der Lauf-COP Waerme durch
    // Strom, ohne Energiewerte der Mittelwert des COP-Sensors.
    const grenze = Math.min(l.von + 5 * MIN, l.bis);
    const nachEnergie = l.copArt === "energie";
    const teilCop = (von, bis) => {
      if (nachEnergie) {
        const w = energie(l.ww ? d.wwW : d.heizW, von, bis);
        const e = energie(l.ww ? d.wwE : d.heizE, von, bis);
        return w !== null && e !== null && e > 0.001 ? w / e : null;
      }
      return mittel(l.ww ? d.copW : d.copH, von, bis, true);
    };
    const copStart = teilCop(l.von, grenze);
    const copDanach = l.bis - grenze >= MIN ? teilCop(grenze, l.bis) : null;
    if (copStart !== null && copDanach !== null) {
      werte.push([t("la_w_start"), tf(t(nachEnergie ? "la_w_start_e" : "la_w_start_t"), { a: z(copStart), b: z(copDanach) })]);
    }

    /* ---------- Befunde ---------- */
    // Laufzeit
    if (l.minuten < 10) {
      let text = tf(t("la_kurz"), { d: z(l.minuten, 0) });
      if (copStart !== null && copDanach !== null && copStart < copDanach) {
        text += ` ${tf(t(nachEnergie ? "la_kurz_start_e" : "la_kurz_start"), { a: z(copStart), b: z(copDanach) })}`;
      }
      befunde.push({ text, quelle: "taktung" });
      ohne.push(t("la_ov_kurz"));
    } else {
      ok.push(tf(t("la_ok_lauf"), { d: z(l.minuten, 0) }));
    }
    // Abtauung
    if (abtau > 0) {
      befunde.push({ text: tf(t("la_abtau"), { m: z(abtau, 0) }), quelle: "wirkungsgrad" });
      ohne.push(t("an_ov_abtauung"));
    } else {
      ok.push(t("la_ok_abtau"));
    }
    // Heizstab
    if (stab > 0) {
      befunde.push({ text: tf(t("la_stab"), { m: z(stab, 0) }), quelle: "wirkungsgrad" });
      // Kein Vorschlag fuer die Einschaltgrenze: Passend ist der
      // Bivalenzpunkt der Anlage (Heizlast, Norm-Aussentemperatur des
      // Standorts, Leistung der Waermepumpe); den kennt die Karte nicht.
      ohne.push(t(l.ww ? "la_ov_stab_ww" : "la_ov_stab_biv"));
    } else {
      ok.push(t("la_ok_stab"));
    }
    // Spreizung
    if (sp !== null && !l.ww) {
      const st = this._anSpStufe(sp);
      if (AUFFAELLIG.includes(st.stufe)) {
        befunde.push({ text: `${tf(t("la_sp"), { s: z(sp) })} ${t(st.text)}`, quelle: ["spreizung", "pumpe"] });
        const v = this._anSpVorschlag(sp);
        if (v.aktion) vorschlaege.push(v.aktion);
        else ohne.push(v.ohne || t("an_ov_allg"));
      } else {
        ok.push(t("la_ok_sp"));
      }
    } else if (sp !== null && l.ww) {
      if (sp > 10) befunde.push({ text: tf(t("la_sp_ww"), { s: z(sp) }), quelle: "spreizung" });
      else ok.push(t("la_ok_sp"));
    }
    // Vorlauf gegen den Richtwert der Heizflaechen (nur Heizen). Mit Puffer
    // zaehlt der Heizkreis, ohne Puffer der Ausgang der Waermepumpe.
    if (!l.ww) {
      const kreise = puffer
        ? this._anZonen()
          .map((n) => ({ n, v: n === 2 ? l.kreis2 : l.kreis1, art: this._anFlaecheVon(n) }))
          .filter((k) => k.v !== null)
        : l.vorlauf !== null
          ? [{ n: 0, v: l.vorlauf, art: this._anHeizflaechen() === "fbh" ? "fbh" : "hk" }]
          : [];
      const hoch = kreise.filter((k) => vlStufe(k.v, GRENZE[k.art]) === "hinweis");
      if (hoch.length) {
        const k = hoch.reduce((a, b) => (b.v - GRENZE[b.art].gut > a.v - GRENZE[a.art].gut ? b : a));
        const richt = t(k.art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk");
        befunde.push({ text: tf(t("la_vl"), { v: z(k.v, 0), r: richt }), quelle: ["vorlauf", "wirkungsgrad"] });
        const zonen = puffer ? hoch.map((x) => x.n) : this._anZonen();
        const aktion = this._anVorschlag(zonen.flatMap((n) => this._anKurvenSchritt(n, "parallel")), tf(t("an_g_vl"), { v: z(k.v, 0), r: richt }));
        if (aktion) vorschlaege.push(aktion);
        else ohne.push(t("an_ov_allg"));
      } else if (kreise.length) {
        ok.push(t("la_ok_vl"));
      }
    }
    return { werte, befunde, ok, vorschlaege, ohne };
  },

  /** Fenster mit der Analyse eines Laufs ueber dem Diagrammfenster. */
  _zeigeLaufAnalyse(l) {
    const sr = this.shadowRoot;
    const modal = sr && sr.getElementById("an-modal");
    if (!modal || !l || !this._auswertung) return;
    const a = this._laufAnalyse(l);
    const t = (k) => this._t(k);
    const zeit = this._laZeit(l.von);
    const titel = tf(t("la_titel"), { z: zeit });
    // Blaettern zwischen den gelben Laeufen, schlechtester zuerst.
    const reihe = (this._copReihe || []).includes(l) ? this._copReihe : [l];
    const nr = reihe.indexOf(l);
    const quellen = (q) =>
      []
        .concat(q || [])
        .map((k) => QUELLEN[k])
        .filter(Boolean)
        .map((x) => `<a href="${escapeHtml(x[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(x[0])}</a>`)
        .join(" · ");
    const sub = tf(t("la_sub"), {
      w: t(l.ww ? "warmwasser" : "heizung"), von: zeit, bis: this._laZeit(l.bis), d: fmt(l.minuten, 0),
      c: fmt(l.cop, 1), e: fmt(l.copErwartet, 1), p: fmt(l.copQuote * 100, 0),
    }) + (l.copGeschaetzt ? ` · ${t("a_c_geschaetzt")}` : "");
    const vorschlagHtml = (v, i) => `<div class="lhc-la-vorschlag">
        <div>${v.aenderungen.map((w) => `<b>${escapeHtml(this._laName(w))}</b>: ${escapeHtml(this._laWert(w, "ist"))} → <b>${escapeHtml(this._laWert(w, "neu"))}</b>`).join("<br>")}
          <small>${escapeHtml(v.grund)}</small></div>
        <button type="button" class="lhc-an-knopf" data-la-vorschlag="${i}">${escapeHtml(t("la_setzen"))}</button>
      </div>`;
    modal.querySelector(".lhc-an-modal-box").innerHTML = `
      <h3 id="an-modal-titel">${escapeHtml(titel)}</h3>
      ${reihe.length > 1 ? `<div class="lhc-la-blaettern">
        <button type="button" class="lhc-an-btn" data-la-gehe="${nr - 1}"${nr === 0 ? " disabled" : ""} aria-label="${escapeHtml(t("la_zurueck"))}">◀</button>
        <span>${escapeHtml(tf(t("la_von"), { i: nr + 1, n: reihe.length }))}</span>
        <button type="button" class="lhc-an-btn" data-la-gehe="${nr + 1}"${nr === reihe.length - 1 ? " disabled" : ""} aria-label="${escapeHtml(t("la_weiter"))}">▶</button>
      </div>` : ""}
      <div class="lhc-an-modal-sub">${escapeHtml(sub)}</div>
      ${l.copGeschaetzt ? `<p class="lhc-la-ohne">${escapeHtml(t("la_geschaetzt"))}</p>` : ""}
      <div class="lhc-la-kopf">${escapeHtml(t("la_werte"))}</div>
      <table class="lhc-la-werte">${a.werte.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("")}</table>
      <div class="lhc-la-kopf">${escapeHtml(t("la_befunde"))}</div>
      ${a.befunde.length
        ? a.befunde.map((b) => `<div class="lhc-la-befund">${escapeHtml(b.text)}${quellen(b.quelle) ? `<small>${escapeHtml(t("an_quelle"))}: ${quellen(b.quelle)}</small>` : ""}</div>`).join("")
        : `<div class="lhc-la-befund leer">${escapeHtml(t("la_nichts"))}</div>`}
      ${a.ok.length ? `<p class="lhc-la-ok">${escapeHtml(tf(t("la_ok"), { l: a.ok.join(", ") }))}</p>` : ""}
      ${a.vorschlaege.length ? `<div class="lhc-la-kopf">${escapeHtml(t("la_vorschlag"))}</div>${a.vorschlaege.map(vorschlagHtml).join("")}` : ""}
      ${a.ohne.map((o) => `<p class="lhc-la-ohne">${escapeHtml(o)}</p>`).join("")}
      <p class="lhc-an-modal-klein">${escapeHtml(t("la_fuss"))}</p>
      <div class="lhc-an-modal-knoepfe">
        <button type="button" class="lhc-an-btn" id="an-modal-ab">${escapeHtml(t("an_opt_zu"))}</button>
      </div>`;
    modal.hidden = false;
    this._vorschlagLage();
    sr.getElementById("an-modal-ab").addEventListener("click", () => this._schliesseVorschlag());
    modal.querySelectorAll("[data-la-gehe]").forEach((b) => {
      b.addEventListener("click", () => this._zeigeLaufAnalyse(reihe[Number(b.dataset.laGehe)]));
    });
    modal.querySelectorAll("[data-la-vorschlag]").forEach((b) => {
      b.addEventListener("click", () => this._zeigeVorschlag({ titel: tf(t("la_lauf"), { z: zeit }), aktion: a.vorschlaege[Number(b.dataset.laVorschlag)] }));
    });
    const zu = sr.getElementById("an-modal-ab");
    if (zu) zu.focus({ preventScroll: true });
  },

  /** Name eines Parameters fuer die Vorschlagszeile. */
  _laName(w) {
    const f = ENTITY_FIELDS.find((x) => x.key === w.feld);
    return f ? feldText(f, this._sp()) : w.feld;
  },

  /** IST- oder NEU-Wert eines Parameters mit Einheit. */
  _laWert(w, art) {
    if (w.auswahl) return w[art];
    return `${fmt(w[art], 0)}${w.einheit ? ` ${w.einheit}` : ""}`;
  },
};
