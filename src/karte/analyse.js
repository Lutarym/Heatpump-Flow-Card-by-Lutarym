/**
 * Analyse: wertet die bekannten Messwerte und Einstellungen aus und gibt
 * je Pruefpunkt eine Einordnung mit Richtwert, Tipp und Quelle.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Grundlagen der Richtwerte (Stand 25.10.2026):
 *  - Spreizung 5 bis 7 K, bei Heizkoerpern bis 10 K toleriert:
 *    BWP Leitfaden Hydraulik, zitiert bei 42watt "Spreizung Waermepumpe".
 *  - Vorlauf Fussbodenheizung 30 bis 35 °C (Altbau bis 40 °C), Heizkoerper
 *    45 bis 55 °C, hoechstens 55 °C; bis 2,5 % Strom je Kelvin weniger:
 *    Bosch, Viessmann, Verbraucherzentrale RLP, zitiert bei 42watt
 *    "Vorlauftemperatur Waermepumpe".
 *  - Taktung 10 bis 20 min je Start (BWP), bis etwa 15 Starts am Tag im
 *    Jahresmittel (Fraunhofer WP-QS), 42watt "Taktung".
 *  - Bivalenzpunkt monoenergetischer Luft-Wasser-Anlagen -3 bis -7 °C
 *    (Stiebel Eltron Planungshandbuch), Heizstab lange ueber 0 °C ist ein
 *    Pruefzeichen: 42watt "Bivalenzpunkt" und "Heizstab".
 *  - Abtauung 5 bis 15 min, haeufig bei -5 bis +5 °C: 42watt "Abtauen".
 *  - Warmwasser: Legionellenwachstum ab 50 °C gehemmt, ueber 60 °C sterben
 *    sie schnell ab (DVGW), Wissenschaftliche Dienste des Bundestags
 *    WD 8 - 021/23.
 *  - Anlagendruck 1,2 bis 2,0 bar plus 0,3 bar: Vattenfall.
 *  - JAZ ab 3,0 Mindestwert (BEG), Feldmittel Luft-Wasser 3,4: 42watt
 *    "Wirkungsgrad", Fraunhofer.
 * Eigene Festlegungen der Karte sind im Text als solche genannt.
 */
import { escapeHtml, fmt, numState, rawState, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { copStufe, mittel } from "./auswertung.js";

const QUELLEN = {
  spreizung: ["42watt: Spreizung (BWP Leitfaden Hydraulik)", "https://42watt.de/magazin/spreizung-warmepumpe"],
  vorlauf: ["42watt: Vorlauftemperatur (Bosch, Viessmann, VZ RLP)", "https://www.42watt.de/magazin/vorlauftemperatur-warmepumpe"],
  taktung: ["42watt: Taktung (BWP, Fraunhofer WP-QS)", "https://42watt.de/magazin/taktung-warmepumpe"],
  cop: ["Panasonic: Aquarea T-CAP M, technische Daten", "https://www.aircon.panasonic.eu/DE_de/product/t-cap-stand-alone-outdoor-m-series-1-phase-3-phase-r290/"],
  bivalenz: ["42watt: Bivalenzpunkt (Stiebel Eltron)", "https://42watt.de/magazin/bivalenzpunkt-warmepumpe-einfach-erklart"],
  heizstab: ["42watt: Heizstab (Fraunhofer-Feldtests)", "https://42watt.de/magazin/heizstab-warmepumpe"],
  abtauung: ["42watt: Abtauen", "https://42watt.de/magazin/warmepumpe-abtauen"],
  warmwasser: ["Wiss. Dienste Bundestag WD 8 - 021/23 (DVGW, UBA, BWP)", "https://www.bundestag.de/resource/blob/947272/cc7cce64da5a0983382949ac996e72ff/WD-8-021-23-pdf-data.pdf"],
  druck: ["Vattenfall: Wasserdruck der Heizung", "https://www.vattenfall.de/infowelt-energie/nachhaltig-heizen/wasserdruck-der-heizung"],
  jaz: ["42watt: Wirkungsgrad (Fraunhofer, BEG)", "https://42watt.de/magazin/wirkungsgrad-warmepumpe"],
};

const STUFEN = {
  ok: { farbe: "#22C55E", text: "an_ok" },
  hinweis: { farbe: "#F59E0B", text: "an_hinweis" },
  pruefen: { farbe: "#EF4444", text: "an_pruefen" },
  unbekannt: { farbe: "#7E8CA0", text: "an_unbekannt" },
};

/** Zeit in Minuten, in der eine Reihe "an" meldet, und die Aussentemperatur dabei. */
function anZeiten(reihe, aussen, t0, t1) {
  const abschnitte = [];
  for (let i = 0; i < reihe.length; i++) {
    const a = Math.max(reihe[i].t, t0);
    const b = Math.min(i + 1 < reihe.length ? reihe[i + 1].t : t1, t1);
    if (b <= a) continue;
    const n = parseFloat(reihe[i].s);
    const an = Number.isNaN(n) ? zustandAn(reihe[i].s) === true : n > 0;
    if (!an) continue;
    const letzter = abschnitte[abschnitte.length - 1];
    if (letzter && letzter.bis === a) letzter.bis = b;
    else abschnitte.push({ von: a, bis: b });
  }
  abschnitte.forEach((x) => {
    x.minuten = (x.bis - x.von) / 60000;
    x.aussen = aussen ? mittel(aussen, x.von, x.bis, false) : null;
  });
  return abschnitte;
}

export const analyseKarte = {
  /** Heizflaechen laut Editor: nur Fussbodenheizung, nur Heizkoerper oder gemischt. */
  _anHeizflaechen() {
    const n = Math.max(1, Math.min(4, Number(this._config.hk_count) || 1));
    const arten = [];
    for (let i = 1; i <= n; i++) arten.push(this._istFbh(this._heizStil(i)) ? "fbh" : "hk");
    if (arten.every((a) => a === "fbh")) return "fbh";
    if (arten.every((a) => a === "hk")) return "hk";
    return "gemischt";
  },

  /** Wert einer Entitaet als Zahl, oder null. */
  _anWert(feld) {
    const id = this._e(feld);
    return id ? numState(this._quelle, id) : null;
  },

  /** Alle Pruefpunkte berechnen. */
  _anPruefen() {
    const d = this._auswertung;
    const laeufe = d ? this._auswertungLaeufe(d) : [];
    const heizLaeufe = laeufe.filter((l) => !l.ww && !l.angeschnitten && l.minuten >= 10);
    // Richtwerte je Tag gelten bei laengeren Zeitraeumen im Mittel.
    const tage = d ? Math.max((d.t1 - d.t0) / 86400000, 1) : 1;
    const flaechen = this._anHeizflaechen();
    const punkte = [];
    const punkt = (gruppe, id, stufe, titel, wert, wertText, richt, text, tipp, quelle) =>
      punkte.push({ gruppe, id, stufe, titel, wert, wertText, richt, text, tipp, quelle });
    const z = (v, s = 1) => fmt(v, s);

    /* ---------- Heizbetrieb ---------- */
    // Spreizung im Heizbetrieb, je Lauf ab der fuenften Minute.
    const mitSpreizung = heizLaeufe.filter((l) => l.vorlauf !== null && l.ruecklauf !== null);
    if (mitSpreizung.length) {
      const dauer = mitSpreizung.reduce((s, l) => s + l.minuten, 0);
      const sp = mitSpreizung.reduce((s, l) => s + (l.vorlauf - l.ruecklauf) * l.minuten, 0) / dauer;
      let stufe = "ok";
      let text = "an_sp_ok";
      if (sp < 5) {
        stufe = "hinweis";
        text = "an_sp_klein";
      } else if (sp > 10) {
        stufe = "pruefen";
        text = "an_sp_gross";
      } else if (sp > 7) {
        stufe = flaechen === "fbh" ? "hinweis" : "ok";
        text = flaechen === "fbh" ? "an_sp_fbh" : "an_sp_hk";
      }
      punkt("heiz", "spreizung", stufe, "an_t_spreizung", `${z(sp)} K`, this._t("an_w_sp"),
        this._t(flaechen === "fbh" ? "an_r_sp_fbh" : "an_r_sp_hk"), this._t(text),
        stufe === "ok" ? "" : this._t(sp < 5 ? "an_tip_sp_klein" : "an_tip_sp_gross"), "spreizung");
    } else {
      punkt("heiz", "spreizung", "unbekannt", "an_t_spreizung", "--", "", this._t("an_r_sp_hk"),
        this._t("an_kein_heizlauf"), "", "spreizung");
    }

    // Hoechster Vorlauf im Heizbetrieb des Zeitraums.
    const grenze = flaechen === "fbh" ? { gut: 35, max: 40 } : { gut: 55, max: 55 };
    const mitVl = heizLaeufe.filter((l) => l.vorlauf !== null);
    if (mitVl.length) {
      const hoechst = mitVl.reduce((a, l) => (l.vorlauf > a.vorlauf ? l : a), mitVl[0]);
      const vl = hoechst.vorlauf;
      const stufe = vl <= grenze.gut ? "ok" : vl <= grenze.max ? "hinweis" : "pruefen";
      punkt("heiz", "vorlauf", stufe, flaechen === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk", `${z(vl, 0)} °C`,
        hoechst.aussen !== null ? tf(this._t("an_w_vl"), { a: z(hoechst.aussen) }) : "",
        this._t(flaechen === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        this._t(stufe === "ok" ? "an_vl_ok" : flaechen === "fbh" ? "an_vl_fbh" : "an_vl_hk")
          + (flaechen === "gemischt" ? ` ${this._t("an_vl_gemischt")}` : ""),
        this._t("an_tip_vl"), "vorlauf");
    } else {
      punkt("heiz", "vorlauf", "unbekannt", flaechen === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk", "--", "", this._t(flaechen === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        this._t("an_kein_heizlauf"), "", "vorlauf");
    }

    // Heizkurve: eingestellter Vorlauf am kalten Ende.
    const kurveVl = this._anWert("curve_t_high");
    const kurveAussen = this._anWert("curve_o_low");
    if (kurveVl !== null) {
      const stufe = kurveVl <= grenze.gut ? "ok" : kurveVl <= grenze.max ? "hinweis" : "pruefen";
      punkt("heiz", "kurve", stufe, "an_t_kurve", `${z(kurveVl, 0)} °C`,
        kurveAussen !== null ? tf(this._t("an_w_kurve"), { a: z(kurveAussen, 0) }) : "",
        this._t(flaechen === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        this._t(stufe === "ok" ? "an_kurve_ok" : "an_kurve_hoch"),
        stufe === "ok" ? "" : this._t("an_tip_kurve"), "vorlauf");
    }

    // Taktung nach den Richtwerten.
    const bewertet = laeufe.filter((l) => !l.laufend && !l.angeschnitten);
    if (bewertet.length) {
      const n = laeufe.filter((l) => !l.angeschnitten).length;
      const kurz = bewertet.filter((l) => l.minuten < 10).length;
      const sehrKurz = bewertet.filter((l) => l.minuten < 6).length;
      const mLauf = bewertet.reduce((s, l) => s + l.minuten, 0) / bewertet.length;
      const anteil = kurz / bewertet.length;
      // Zwei sehr kurze Laeufe gelten je Tag, ueber mehrere Tage im Mittel.
      const stufe = anteil >= 0.3 || sehrKurz / tage >= 2 ? "pruefen" : kurz || n / tage > 15 ? "hinweis" : "ok";
      punkt("heiz", "taktung", stufe, "an_t_taktung",
        tage > 1.5 ? `${tf(this._t("an_w_starts"), { n })} · ${fmt(n / tage, 0)}/d` : tf(this._t("an_w_starts"), { n }),
        tf(this._t("an_w_lauf"), { d: z(mLauf, 0) }), this._t("an_r_taktung"),
        stufe === "ok" ? this._t("an_tk_ok") : tf(this._t("an_tk_kurz"), { k: kurz, n: bewertet.length }),
        stufe === "ok" ? "" : this._t("an_tip_taktung"), "taktung");
    } else {
      punkt("heiz", "taktung", "unbekannt", "an_t_taktung", "--", "", this._t("an_r_taktung"),
        this._t(d ? "a_keine_laeufe" : "an_keine_daten"), "", "taktung");
    }

    // COP gegenueber Erwartung.
    const mitQuote = laeufe.filter((l) => l.copQuote !== null);
    if (mitQuote.length) {
      const dauer = mitQuote.reduce((s, l) => s + l.minuten, 0);
      const q = mitQuote.reduce((s, l) => s + l.copQuote * l.minuten, 0) / dauer;
      const st = copStufe(q);
      const stufe = st === "gut" || st === "rahmen" ? "ok" : st === "unter" ? "hinweis" : "pruefen";
      punkt("heiz", "cop", stufe, "an_t_cop", `${z(q * 100, 0)} %`, this._t("an_w_cop"), this._t("an_r_cop"),
        this._t(stufe === "ok" ? "an_cop_ok" : "an_cop_unter"), stufe === "ok" ? "" : this._t("an_tip_cop"), "cop");
    } else {
      punkt("heiz", "cop", "unbekannt", "an_t_cop", "--", "", this._t("an_r_cop"), this._t("an_cop_ohne"), "", "cop");
    }

    /* ---------- Zusatzheizung und Abtauung ---------- */
    const stabGrenze = this._anWert("heater_on_temp");
    if (stabGrenze !== null) {
      const stufe = stabGrenze <= -3 ? "ok" : "hinweis";
      punkt("zusatz", "bivalenz", stufe, "an_t_bivalenz", `${z(stabGrenze, 0)} °C`, this._t("an_w_bivalenz"),
        this._t("an_r_bivalenz"), this._t(stufe === "ok" ? "an_biv_ok" : "an_biv_hoch"),
        stufe === "ok" ? "" : this._t("an_tip_bivalenz"), "bivalenz");
    }
    if (d && (d.stabIntern.length || d.stabExtern.length)) {
      const zeiten = anZeiten(d.stabIntern, d.aussen, d.t0, d.t1).concat(anZeiten(d.stabExtern, d.aussen, d.t0, d.t1));
      const gesamt = zeiten.reduce((s, x) => s + x.minuten, 0);
      const warm = zeiten.filter((x) => x.aussen !== null && x.aussen > 0).reduce((s, x) => s + x.minuten, 0);
      // 30 Minuten je Tag ueber 0 °C, eigene Grenze der Karte.
      const stufe = warm / tage >= 30 ? "hinweis" : "ok";
      punkt("zusatz", "heizstab", stufe, "an_t_heizstab", `${z(gesamt, 0)} min`,
        tf(this._t("an_w_heizstab"), { w: z(warm, 0) }), this._t("an_r_heizstab"),
        this._t(gesamt === 0 ? "an_hs_aus" : stufe === "ok" ? "an_hs_ok" : "an_hs_warm"),
        stufe === "ok" ? "" : this._t("an_tip_heizstab"), "heizstab");
    }
    if (d && d.abtau.length) {
      const zeiten = anZeiten(d.abtau, d.aussen, d.t0, d.t1);
      if (!zeiten.length) {
        punkt("zusatz", "abtauung", "ok", "an_t_abtauung", "0×", "", this._t("an_r_abtauung"), this._t("an_ab_keine"), "", "abtauung");
      } else {
        const m = zeiten.reduce((s, x) => s + x.minuten, 0) / zeiten.length;
        const temps = zeiten.filter((x) => x.aussen !== null).map((x) => x.aussen);
        const warm = temps.filter((t) => t >= 10).length;
        const stufe = m > 15 || warm ? "hinweis" : "ok";
        const bereich = temps.length ? tf(this._t("an_w_abtau"), { d: z(m, 0), a: z(Math.min(...temps), 0), b: z(Math.max(...temps), 0) }) : tf(this._t("an_w_abtau_d"), { d: z(m, 0) });
        punkt("zusatz", "abtauung", stufe, "an_t_abtauung", `${zeiten.length}×`, bereich, this._t("an_r_abtauung"),
          this._t(m > 15 ? "an_ab_lang" : warm ? "an_ab_warm" : "an_ab_ok"),
          stufe === "ok" ? "" : this._t("an_tip_abtauung"), "abtauung");
      }
    }

    /* ---------- Warmwasser und Anlage ---------- */
    const wwSoll = this._anWert("dhw_setpoint");
    const steril = this._anWert("steril_temp");
    if (wwSoll !== null) {
      const stufe = wwSoll >= 50 ? "ok" : "hinweis";
      punkt("anlage", "warmwasser", stufe, "an_t_warmwasser", `${z(wwSoll, 0)} °C`,
        steril !== null ? tf(this._t("an_w_steril"), { s: z(steril, 0) }) : this._t("an_w_ww_soll"),
        this._t("an_r_warmwasser"),
        this._t(stufe === "ok" ? (wwSoll > 55 ? "an_ww_hoch" : "an_ww_ok") : "an_ww_niedrig"),
        stufe === "ok" ? (wwSoll > 55 ? this._t("an_tip_ww_hoch") : "") : this._t("an_tip_ww_niedrig"), "warmwasser");
    }
    const druck = this._anWert("water_pressure");
    if (druck !== null) {
      const stufe = druck >= 1.2 && druck <= 2.3 ? "ok" : "hinweis";
      punkt("anlage", "druck", stufe, "an_t_druck", `${z(druck)} bar`, "", this._t("an_r_druck"),
        this._t(stufe === "ok" ? "an_dr_ok" : druck < 1.2 ? "an_dr_niedrig" : "an_dr_hoch"),
        stufe === "ok" ? "" : this._t(druck < 1.2 ? "an_tip_dr_niedrig" : "an_tip_dr_hoch"), "druck");
    }
    const jaz = this._config.demo ? { jaz: 4.3 } : this._jaz && this._jaz.gesamt;
    if (jaz && Number.isFinite(jaz.jaz)) {
      const j = jaz.jaz;
      const stufe = j >= 3.0 ? "ok" : "hinweis";
      punkt("anlage", "jaz", stufe, "an_t_jaz", z(j), this._t("an_w_jaz"), this._t("an_r_jaz"),
        this._t(j >= 3.4 ? "an_jaz_gut" : j >= 3.0 ? "an_jaz_ok" : "an_jaz_niedrig"),
        stufe === "ok" ? "" : this._t("an_tip_jaz"), "jaz");
    }
    const err = rawState(this._quelle, this._e("error"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    if (this._e("error")) {
      const stoerung = err !== null && !harmlos.includes(err);
      punkt("anlage", "stoerung", stoerung ? "pruefen" : "ok", "an_t_stoerung", stoerung ? err : this._t("an_keine"), "",
        "", this._t(stoerung ? "an_st_ja" : "an_st_nein"), stoerung ? this._t("an_tip_stoerung") : "", "");
    }
    return punkte;
  },

  /** Zeichnet die Analyse als Karten in das Fenster. */
  _zeichneAnalyse() {
    if (this._diaArt !== "analyse") return;
    const sr = this.shadowRoot;
    const liste = sr && sr.getElementById("dia-liste");
    if (!liste) return;
    this._diaLeer(false);
    if (this._auswertung) this._auswertungHinweis(this._auswertung);
    const punkte = this._anPruefen();
    const zahl = { ok: 0, hinweis: 0, pruefen: 0, unbekannt: 0 };
    punkte.forEach((p) => zahl[p.stufe]++);
    const bewertet = zahl.ok + zahl.hinweis + zahl.pruefen;
    const offen = punkte.filter((p) => p.stufe === "pruefen").concat(punkte.filter((p) => p.stufe === "hinweis"));
    let titel = "an_g_gut";
    if (zahl.pruefen) titel = "an_g_pruefen";
    else if (zahl.hinweis) titel = "an_g_hinweis";
    if (!bewertet) titel = "an_g_leer";
    const potenzial = offen.slice(0, 3).map((p) => this._t(p.titel)).join(", ");

    // Ring mit den Anteilen der Stufen.
    const umfang = 2 * Math.PI * 34;
    let versatz = 0;
    const ring = ["ok", "hinweis", "pruefen"]
      .map((k) => {
        const anteil = bewertet ? zahl[k] / bewertet : 0;
        if (!anteil) return "";
        const l = anteil * umfang;
        const s = `<circle cx="42" cy="42" r="34" fill="none" stroke="${STUFEN[k].farbe}" stroke-width="10"
          stroke-dasharray="${Math.max(0, l - 2).toFixed(1)} ${umfang.toFixed(1)}" stroke-dashoffset="${(-versatz).toFixed(1)}"
          transform="rotate(-90 42 42)"/>`;
        versatz += l;
        return s;
      })
      .join("");
    const kopf = `<div class="lhc-an-gesamt">
        <svg viewBox="0 0 84 84" class="lhc-an-ring"><circle cx="42" cy="42" r="34" fill="none" stroke="#26303F" stroke-width="10"/>${ring}
          <text x="42" y="48" text-anchor="middle" font-size="18" font-weight="700" fill="#E8EDF4">${zahl.ok}/${bewertet}</text></svg>
        <div class="lhc-an-urteil"><b>${escapeHtml(tf(this._t(titel), { n: zahl.pruefen + zahl.hinweis }))}</b>
          ${potenzial ? `<span>${escapeHtml(tf(this._t("an_g_potenzial"), { p: potenzial }))}</span>` : ""}</div>
        <div class="lhc-an-zahlen">${["ok", "hinweis", "pruefen", "unbekannt"]
          .map((k) => `<div><b style="color:${STUFEN[k].farbe}">${zahl[k]}</b><span>${escapeHtml(this._t(STUFEN[k].text))}</span></div>`)
          .join("")}</div>
      </div>`;

    const gruppen = [["heiz", "an_gr_heiz"], ["zusatz", "an_gr_zusatz"], ["anlage", "an_gr_anlage"]];
    const karten = gruppen
      .map(([g, t]) => {
        const inGruppe = punkte.filter((p) => p.gruppe === g);
        if (!inGruppe.length) return "";
        return `<div class="lhc-an-gruppe">${escapeHtml(this._t(t))}</div><div class="lhc-an-raster">${inGruppe
          .map((p) => {
            const st = STUFEN[p.stufe];
            const q = QUELLEN[p.quelle];
            return `<div class="lhc-an-karte" style="border-left-color:${st.farbe}">
                <div class="lhc-an-kopf"><b>${escapeHtml(this._t(p.titel))}</b>
                  <i style="color:${st.farbe};background:${st.farbe}22">${escapeHtml(this._t(st.text))}</i></div>
                <div class="lhc-an-wert"><span><b>${escapeHtml(p.wert)}</b> ${escapeHtml(p.wertText || "")}</span>
                  ${p.richt ? `<span>${escapeHtml(this._t("an_richtwert"))} <b>${escapeHtml(p.richt)}</b></span>` : ""}</div>
                ${p.text ? `<p>${escapeHtml(p.text)}</p>` : ""}
                ${p.tipp ? `<p class="lhc-an-tipp">${escapeHtml(p.tipp)}</p>` : ""}
                ${q ? `<div class="lhc-an-quelle">${escapeHtml(this._t("an_quelle"))}: <a href="${escapeHtml(q[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(q[0])}</a></div>` : ""}
              </div>`;
          })
          .join("")}</div>`;
      })
      .join("");
    liste.innerHTML = `<div class="lhc-an">${kopf}${karten}
      <p class="lhc-takt-quelle">${escapeHtml(this._t("an_fuss"))}</p></div>`;
  },
};
