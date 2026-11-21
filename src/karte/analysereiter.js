/**
 * Analyse mit Reitern: Ueberblick und je Optimierung ein Reiter mit
 * "Kurz gesagt", "Deine Werte", "Was du tun kannst", "Warum ist das
 * wichtig?" und "Fuer Fachleute" (die Pruefpunkte aus analyse.js).
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Neue Pruefpunkte (Stand 20.11.2026):
 *  - Vorlauf ueber Soll (Integration HeishaMon by Lutarym ab 1.7.0, 7 Tage):
 *    nur Messwert, keine Quelle nennt eine Grenze.
 *  - Raumtemperatur je Heizkreis gegen die Wunschtemperatur aus dem Editor.
 *    Innerhalb von 0,5 K (Schrittweite der Eingabe, eigene Festlegung) in
 *    Ordnung, sonst leichte Abweichung mit dem Vorgehen nach EnergieSchweiz
 *    (Faktenblatt Waermepumpe Heizkurve, Stadt Zuerich 2023): Vorlauf
 *    hoechstens einmal pro Woche um 2 bis 3 °C aendern.
 *  - Warmwasser-Ladezeit gegen TOP159 (maximale Ladezeit, ab HeishaMon
 *    4.3.0). Laut Panasonic-Servicehandbuch (WH-MXC16J9E8, 12.4.4) kehrt die
 *    Waermepumpe nach dieser Zeit sofort in den Heizbetrieb zurueck, der
 *    Speicher wird dann eventuell nicht voll. Gewertet als Abbruch: Ladung
 *    mindestens so lang wie TOP159 minus 1 min (Abtastung des Verlaufs,
 *    eigene Festlegung) und Speicher am Ende unter seinem Soll.
 *  - Heizkosten pro Tag: Strom der Heizlaeufe mal Strompreis der Integration.
 *  - PV-Anteil, SG-Ready-Einstellungen (TOP149, TOP154 bis TOP157, TOP184
 *    bis TOP190), Firmware, Fuehlerkorrekturen (TOP177, TOP178, TOP193,
 *    TOP195, TOP196): nur Messwerte.
 *  - Fehlende Installateur-Werte (HeishaMon ab 4.4.0, Gruppe ab Werk aus).
 * Werte der Integration haben Vorrang, wenn sie zum gewaehlten Zeitraum
 * passen (Takten 24 h, Spreizung 7 Tage); sonst rechnet die Karte selbst.
 */
import { escapeHtml, fmt } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { AUFFAELLIG, BEWERTET, QUELLEN, RANG, STUFEN } from "./analyse.js";
import { mittel } from "./auswertung.js";
import { wwLadungen } from "./warmwasser.js";

/** Reiter in ihrer Reihenfolge, ohne den Ueberblick. */
export const REITER = ["heizkurve", "takten", "pumpe", "warmwasser", "heizstab", "abtauen", "effizienz", "strom", "anlage"];

/** Pruefpunkt (id ohne Ziffer am Ende) -> Reiter. */
export const REITER_VON = {
  vorlauf: "heizkurve", kurve: "heizkurve", vlsoll: "heizkurve", raum: "heizkurve",
  taktung: "takten",
  spreizung: "pumpe", puffer: "pumpe",
  warmwasser: "warmwasser", wwladezeit: "warmwasser",
  auslegung: "heizstab", bivalenz: "heizstab", heizstab: "heizstab",
  abtauung: "abtauen",
  cop: "effizienz", jaz: "effizienz",
  pv: "strom", kosten: "strom", sgein: "strom",
  druck: "anlage", stoerung: "anlage", firmware: "anlage", fuehler: "anlage", gruppen: "anlage",
};

/** Quellen zu "Warum ist das wichtig?" je Reiter. */
const WARUM_QUELLE = {
  heizkurve: ["ez_heizkurve", "uba_raum", "vorlauf"],
  takten: ["taktung"],
  pumpe: ["spreizung"],
  warmwasser: ["warmwasser", "legionellen", "wirkungsgrad"],
  heizstab: ["heizstab", "bivalenz"],
  abtauen: ["abtauung"],
  effizienz: ["wirkungsgrad", "jaz"],
  strom: ["integration", "hm_topics"],
  anlage: ["druck", "hm_firmware", "hm_topics"],
};

const WOCHENTAGE = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/** Schlechteste bewertete Stufe einer Liste, sonst info oder unbekannt. */
function reiterStufe(punkte) {
  const bewertet = punkte.filter((p) => BEWERTET.includes(p.stufe));
  if (bewertet.length) return bewertet.reduce((a, p) => (RANG[p.stufe] > RANG[a] ? p.stufe : a), "ok");
  return punkte.some((p) => p.stufe === "info") ? "info" : "unbekannt";
}

/** Wichtigster Punkt eines Reiters: schlechteste Stufe zuerst. */
function hauptPunkt(punkte) {
  const ord = (p) => (BEWERTET.includes(p.stufe) ? RANG[p.stufe] : -1);
  return punkte.reduce((a, p) => (!a || ord(p) > ord(a) ? p : a), null);
}

export const analyseReiterKarte = {
  /** Zeitraum der Analyse ("24h", "7d", ...). */
  _anZeitraum() {
    try {
      return this._zrSpanne().k;
    } catch (e) {
      return "";
    }
  },

  /**
   * Ergaenzt die Pruefpunkte: Werte der Integration, neue Punkte und je
   * Punkt der Reiter. Aufgerufen am Ende von _anPruefen.
   */
  _anErgaenze(punkte, punkt, ctx) {
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    const k = this._anZeitraum();
    const { d, laeufe, heizLaeufe, tage, puffer } = ctx;
    const ersetze = (alt, def) => {
      const i = punkte.indexOf(alt);
      punkt(def);
      const neu = punkte.pop();
      if (i >= 0) punkte.splice(i, 1, neu);
      else punkte.push(neu);
      return neu;
    };
    const finde = (id) => punkte.find((p) => p.id === id);

    /* ---- Takten: 24 h aus der Integration ---- */
    const st = this._int("compressor_starts_24h");
    const tk = finde("taktung");
    if (k === "24h" && st && st.zahl !== null && st.zahl > 0 && Number.isFinite(st.attr.mittlere_laufzeit_min)) {
      const n = st.zahl;
      const m = st.attr.mittlere_laufzeit_min;
      const kurz = Number(st.attr.kurze_laeufe_24h) || 0;
      // Regel wie taktStufe in auswertung.js.
      const stufe = m < 10 ? "hinweis" : kurz ? "leicht" : "ok";
      ersetze(tk, {
        gruppe: "heiz", id: "taktung", stufe, titel: t("an_t_taktung"), wert: tf(t("an_w_starts"), { n }),
        wertText: `${tf(t("an_w_lauf"), { d: z(m, 0) })} · ${t("an_w_int24")}`, richt: t("an_r_taktung"),
        text: stufe === "ok" ? t("an_tk_ok") : tf(t(stufe === "leicht" ? "an_tk_einzeln" : "an_tk_kurz"), { k: kurz, n, d: z(m, 0) }),
        tipp: t(puffer ? "an_tip_taktung_p" : "an_tip_taktung"), quelle: ["taktung", "integration"], ohne: t("an_ov_taktung"), ausInt: true,
      });
    }

    /* ---- Spreizung: 7 Tage aus der Integration ---- */
    const spI = this._int("spread_heating");
    const sp0 = finde("spreizung");
    if (k === "7d" && spI && spI.zahl !== null) {
      const sp = spI.zahl;
      const { stufe, text } = this._anSpStufe(sp);
      const { aktion, ohne } = this._anSpVorschlag(sp);
      const dtSoll = this._anWert("heat_delta");
      const tipp = sp < 5 ? (puffer ? "an_tip_sp_klein_p" : "an_tip_sp_klein") : puffer ? "an_tip_sp_gross_p" : "an_tip_sp_gross";
      ersetze(sp0, {
        gruppe: "heiz", id: "spreizung", stufe, titel: t("an_t_spreizung"), wert: `${z(sp)} K`,
        wertText: `${dtSoll !== null ? tf(t("an_w_sp_soll"), { s: z(dtSoll, 0) }) : t("an_w_sp")} · ${t("an_w_int7")}`,
        richt: sp0 ? sp0.richt : "", text: t(text), tipp: t(tipp), quelle: ["spreizung", "pumpe", "integration"], aktion, ohne, ausInt: true,
      });
    }
    const spK = finde("spreizung");
    if (spK && spK.stufe !== "unbekannt") {
      spK.kurz = tf(t(spK.stufe === "ok" ? "an_ku_sp_ok" : "an_ku_sp"), { w: spK.wert, r: spK.richt });
    }

    /* ---- Heizkurve: Vorlauf ueber Soll (Integration, 7 Tage) ---- */
    const vs = this._int("flow_over_target");
    if (vs && vs.zahl !== null) {
      const h = Number(vs.attr.heizstunden_7d);
      punkt({
        gruppe: "heiz", id: "vlsoll", stufe: "info", titel: t("an_t_vlsoll"), wert: `${vs.zahl > 0 ? "+" : ""}${z(vs.zahl)} K`,
        wertText: t("an_w_vlsoll"),
        text: tf(t("an_vlsoll_text"), { x: z(vs.zahl), h: Number.isFinite(h) ? z(h, 0) : "--" }),
        kurz: tf(t("an_ku_vlsoll"), { x: z(vs.zahl) }), quelle: "integration",
      });
    }

    /* ---- Heizkurve: Raumtemperatur je Heizkreis ---- */
    [1, 2].forEach((n) => {
      const reihe = d && d[`raum${n}`];
      const ziel = this._config.demo ? (n === 1 ? 21 : 19) : parseFloat(this._config[`hk${n}_room_target`]);
      if (!reihe || !reihe.length || !Number.isFinite(ziel)) return;
      const titel = tf(t("an_t_raum"), { n });
      const m = mittel(reihe, d.t0, d.t1, false);
      if (m === null || !Number.isFinite(m)) return;
      if (!heizLaeufe.length) {
        punkt({ gruppe: "heiz", id: `raum${n}`, stufe: "unbekannt", titel, wert: `${z(m)} °C`, text: t("an_raum_keinheiz"), quelle: "ez_heizkurve" });
        return;
      }
      const diff = Math.round((m - ziel) * 10) / 10;
      const stufe = Math.abs(diff) <= 0.5 ? "ok" : "leicht";
      const werte = { m: z(m), z: z(ziel), d: z(Math.abs(diff)), n };
      const art = stufe === "ok" ? "ok" : diff > 0 ? "warm" : "kalt";
      punkt({
        gruppe: "heiz", id: `raum${n}`, stufe, titel, wert: `${z(m)} °C`, wertText: tf(t("an_w_raum"), werte),
        richt: tf(t("an_r_raum"), werte), text: tf(t(`an_raum_${art}`), werte), kurz: tf(t(`an_ku_raum_${art}`), werte),
        schritt: art === "ok" ? "" : tf(t(`an_sr_raum_${art}`), werte), quelle: ["ez_heizkurve", "uba_raum"],
      });
    });

    /* ---- Warmwasser: Ladezeit gegen TOP159 ---- */
    const max = this._intZahl("top159");
    const soll = this._anWert("dhw_setpoint");
    if (d && Number.isFinite(max) && max > 0 && d.wwTemp && d.wwTemp.length) {
      const ladungen = wwLadungen(
        {
          t0: d.t0, t1: d.t1, ventil: d.ventil, vd: d.vd, temp: d.wwTemp, aussen: d.aussen || [], vorlauf: d.vorlauf || [], e: [], w: [],
          abtau: d.abtau || [], cop: d.copW || [], pv: [], stabE: d.stabExtern || [], stabI: d.stabIntern || [], steril: [],
        },
        this._copReferenz(),
      ).filter((l) => !l.angeschnitten && !l.laufend && !l.luecke);
      const titel = t("an_t_wwladezeit");
      if (!ladungen.length) {
        punkt({ gruppe: "anlage", id: "wwladezeit", stufe: "unbekannt", titel, wert: "--", richt: tf(t("an_r_wwladezeit"), { m: z(max, 0) }),
          text: t("an_wwl_keine"), quelle: "pana_ww" });
      } else {
        const laengste = Math.max(...ladungen.map((l) => l.minuten));
        const ab = ladungen.filter((l) => l.minuten >= max - 1 && soll !== null && l.tEnde !== null && l.tEnde < soll);
        const werte = { n: ladungen.length, a: ab.length, l: z(laengste, 0), m: z(max, 0), s: soll !== null ? z(soll, 0) : "--" };
        punkt({
          gruppe: "anlage", id: "wwladezeit", stufe: ab.length ? "hinweis" : "ok", titel, wert: `${z(laengste, 0)} min`,
          wertText: tf(t("an_w_wwladezeit"), werte), richt: tf(t("an_r_wwladezeit"), werte),
          text: tf(t(ab.length ? "an_wwl_ab" : ladungen.length === 1 ? "an_wwl_ok1" : "an_wwl_ok"), werte),
          kurz: tf(t(ab.length ? "an_ku_wwl_ab" : ladungen.length === 1 ? "an_ku_wwl_ok1" : "an_ku_wwl_ok"), werte),
          tipp: t("an_tip_wwladezeit"), ohne: t("an_ov_wwladezeit"), quelle: "pana_ww",
        });
      }
    }

    /* ---- Strom & PV: Heizkosten, PV-Anteil, SG Ready ---- */
    const preis = [this._int("dhw_cost_per_day"), this._int("dhw_cost_last")]
      .map((w) => (w ? parseFloat(w.attr.preis_ct_kwh) : NaN))
      .find((x) => Number.isFinite(x) && x > 0);
    const heizStrom = laeufe.filter((l) => !l.ww && Number.isFinite(l.eHeiz)).reduce((s, l) => s + l.eHeiz, 0);
    const mitStrom = laeufe.some((l) => !l.ww && Number.isFinite(l.eHeiz));
    if (preis && mitStrom) {
      const kwhTag = heizStrom / tage;
      const euro = (kwhTag * preis) / 100;
      const werte = { e: z(euro, 2), k: z(kwhTag, 1), p: z(preis, 1) };
      punkt({
        gruppe: "anlage", id: "kosten", stufe: "info", titel: t("an_t_kosten"), wert: `${z(euro, 2)} €`, wertText: tf(t("an_w_kosten"), werte),
        text: tf(t("an_kosten_text"), werte), kurz: tf(t("an_ku_kosten"), werte), quelle: "integration",
      });
    }
    const pv = this._int("pv_share_today");
    // Ohne Wert der Integration rechnet die Karte selbst (netzstrom.js).
    const eigen = typeof this._netzHeute === "function" ? this._netzHeute() : null;
    if ((!pv || pv.zahl === null) && eigen && eigen.quelle === "karte" && Number.isFinite(eigen.anteil)) {
      const werte = { h: z(Math.min(100, Math.max(0, eigen.anteil)), 0), n: z(eigen.netz, 1), g: z(eigen.gesamt, 1) };
      punkt({ gruppe: "anlage", id: "pv", stufe: "info", titel: t("an_t_pv"), wert: `${werte.h} %`, wertText: t("an_w_pv_karte"),
        text: tf(t("an_pv_text_karte"), werte), kurz: tf(t("an_pv_text_karte"), werte) });
    } else if (pv) {
      const sieben = parseFloat(pv.attr.pv_anteil_7_tage);
      if (pv.zahl !== null) {
        const werte = { h: z(pv.zahl, 0), w: Number.isFinite(sieben) ? z(sieben, 0) : "--" };
        punkt({ gruppe: "anlage", id: "pv", stufe: "info", titel: t("an_t_pv"), wert: `${z(pv.zahl, 0)} %`, wertText: tf(t("an_w_pv"), werte),
          text: tf(t("an_pv_text"), werte), kurz: tf(t("an_ku_pv"), werte), quelle: "integration" });
      } else {
        punkt({ gruppe: "anlage", id: "pv", stufe: "unbekannt", titel: t("an_t_pv"), wert: "--", text: t("an_pv_fehlt"), kurz: t("an_pv_fehlt"),
          quelle: "integration" });
      }
    }
    const sgAn = this._intZahl("top149");
    if (sgAn !== null) {
      const pz = (x) => {
        const v = this._intZahl(x);
        return v === null ? "--" : z(v, 0);
      };
      const kw = (x) => {
        const v = this._intZahl(x);
        return v === null ? "--" : z(v, 1);
      };
      const werte = { h1: pz("top154"), w1: pz("top155"), h2: pz("top156"), w2: pz("top157"), ph1: kw("top185"), pw1: kw("top184"), ph2: kw("top188"), pw2: kw("top187") };
      punkt({
        gruppe: "anlage", id: "sgein", stufe: "info", titel: t("an_t_sgein"), wert: t(sgAn > 0 ? "an_an" : "an_aus"),
        text: sgAn > 0 ? tf(t("an_sgein_text"), werte) : t("an_sgein_aus"), kurz: sgAn > 0 ? tf(t("an_ku_sgein"), werte) : t("an_sgein_aus"),
        quelle: "hm_topics",
      });
    }

    /* ---- Anlage: Firmware, Fuehlerkorrekturen, fehlende Werte ---- */
    const fw = this._int("firmware");
    if (fw && fw.attr.installed_version) {
      const neu = fw.attr.latest_version;
      const aktuell = !neu || neu === fw.attr.installed_version;
      const werte = { i: fw.attr.installed_version, l: neu || "--" };
      punkt({
        gruppe: "anlage", id: "firmware", stufe: "info", titel: t("an_t_firmware"), wert: String(fw.attr.installed_version),
        text: tf(t(aktuell ? "an_fw_aktuell" : "an_fw_neu"), werte), kurz: tf(t(aktuell ? "an_fw_aktuell" : "an_fw_neu"), werte), quelle: "hm_firmware",
      });
    }
    const fuehler = [["top178", "an_f_aussen"], ["top196", "an_f_vorlauf"], ["top193", "an_f_ruecklauf"], ["top195", "an_f_speicher"], ["top177", "an_f_raum"]]
      .map(([top, name]) => ({ name, v: this._intZahl(top) }))
      .filter((f) => f.v !== null);
    if (fuehler.length) {
      const gesetzt = fuehler.filter((f) => f.v !== 0);
      const liste = gesetzt.map((f) => `${t(f.name)} ${f.v > 0 ? "+" : ""}${z(f.v)} K`).join(", ");
      punkt({
        gruppe: "anlage", id: "fuehler", stufe: "info", titel: t("an_t_fuehler"), wert: gesetzt.length ? `${gesetzt.length}` : t("an_keine"),
        text: gesetzt.length ? tf(t("an_fuehler_text"), { l: liste }) : t("an_fuehler_keine"), quelle: "hm_topics",
      });
    }
    const fehlt = this._intInstallerFehlt();
    if (fehlt.length) {
      const werte = { l: fehlt.join(", ") };
      punkt({
        gruppe: "anlage", id: "gruppen", stufe: "unbekannt", titel: t("an_t_gruppen"), wert: fehlt.join(", "),
        text: tf(t("an_gruppen_text"), werte), kurz: tf(t("an_ku_gruppen"), werte), schritt: t("an_sr_gruppen"), quelle: "hm_topics",
      });
    }

    // Reiter je Punkt.
    punkte.forEach((p) => {
      p.reiter = REITER_VON[String(p.id).replace(/\d+$/, "")] || "anlage";
    });
  },

  /** Kacheln "Deine Werte" eines Reiters. */
  _anKacheln(r, punkte) {
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    const out = [];
    const k = (n, w, s, warn) => {
      if (w === null || w === undefined || w === "" || w === "--") return;
      out.push({ n, w: String(w), s: s || "", warn: Boolean(warn) });
    };
    const ausPunkt = (id, n) => {
      const p = punkte.find((x) => x.id === id);
      if (p && p.wert && p.wert !== "--") k(n || p.titel, p.wert, p.ausInt ? t("an_w_int") : "", AUFFAELLIG.includes(p.stufe));
    };
    const iv = (key) => this._int(key);
    const intS = t("an_q_int_kurz");
    if (r === "heizkurve") {
      punkte.forEach((p) => k(p.titel, p.wert === "--" ? null : p.wert, p.id === "vlsoll" ? `${intS}, ${t("an_7t")}` : "", AUFFAELLIG.includes(p.stufe)));
    } else if (r === "takten") {
      const s = iv("compressor_starts_24h");
      if (s && s.zahl !== null) {
        k(t("an_k_starts24"), z(s.zahl, 0), intS);
        if (Number.isFinite(s.attr.mittlere_laufzeit_min)) k(t("an_k_laufzeit"), `${z(s.attr.mittlere_laufzeit_min, 0)} min`, intS);
        if (Number.isFinite(s.attr.kurze_laeufe_24h)) k(t("an_k_kurz"), z(s.attr.kurze_laeufe_24h, 0), `${intS}, < 10 min`);
        if (Number.isFinite(s.attr.laengster_lauf_min)) k(t("an_k_laengster"), `${z(s.attr.laengster_lauf_min, 0)} min`, intS);
        if (Number.isFinite(s.attr.starts_je_tag_7d)) k(t("an_k_startstag"), z(s.attr.starts_je_tag_7d, 1), `${intS}, ${t("an_7t")}`);
      } else ausPunkt("taktung");
    } else if (r === "pumpe") {
      ausPunkt("spreizung", t("an_k_sp"));
      const sh = iv("spread_heating");
      if (sh && sh.zahl !== null) k(t("an_k_sp_h"), `${z(sh.zahl)} K`, `${Number.isFinite(sh.attr.durchfluss_l_min) ? `${z(sh.attr.durchfluss_l_min)} l/min, ` : ""}${t("an_7t")}`);
      const sw = iv("spread_dhw");
      if (sw && sw.zahl !== null) k(t("an_k_sp_w"), `${z(sw.zahl)} K`, `${Number.isFinite(sw.attr.durchfluss_l_min) ? `${z(sw.attr.durchfluss_l_min)} l/min, ` : ""}${t("an_7t")}`);
      ausPunkt("puffer", t("an_k_puffer"));
      const ziel = this._intZahl("top169");
      if (ziel !== null && this._anMitPuffer()) k(t("an_k_pufferziel"), `${z(ziel, 0)} °C`, "TOP169");
    } else if (r === "warmwasser") {
      const soll = this._anWert("dhw_setpoint");
      const delta = this._anWert("dhw_heat_delta");
      if (soll !== null) k(t("an_k_soll"), `${z(soll, 0)} °C`, "TOP9");
      if (soll !== null && delta !== null) k(t("an_k_nachladen"), `${z(soll - Math.abs(delta), 0)} °C`, tf(t("an_k_nachladen_s"), { d: z(Math.abs(delta), 0) }),
        soll - Math.abs(delta) < 55);
      const leg = this._anWert("steril_temp");
      if (leg !== null) k(t("an_k_legionellen"), `${z(leg, 0)} °C`, "TOP70");
      const lad = iv("dhw_charges_24h");
      if (lad && lad.zahl !== null) k(t("an_k_ladungen"), z(lad.zahl, 0), Number.isFinite(lad.attr.erzwungen_24h) ? tf(t("an_k_erzwungen"), { n: lad.attr.erzwungen_24h }) : intS);
      const cop = iv("dhw_cop_last");
      if (cop && cop.zahl !== null) k(t("an_k_wwcop"), z(cop.zahl), intS);
      const kost = iv("dhw_cost_per_day");
      if (kost && kost.zahl !== null) k(t("an_k_wwkosten"), `${z(kost.zahl, 2)} €`, `${intS}, ${t("an_7t")}`);
      const halt = iv("dhw_hold_avg");
      if (halt && halt.zahl !== null) k(t("an_k_halte"), `${z(halt.zahl, 0)} h`, intS);
      const nach = iv("dhw_reheat_temp");
      if (nach && nach.zahl !== null) k(t("an_k_nachtemp"), `${z(nach.zahl)} °C`, intS);
      const heute = iv(`dhw_optimal_${WOCHENTAGE[new Date().getDay()]}`);
      if (heute && heute.roh) k(t("an_k_ladestart"), heute.roh, intS);
      const max = this._intZahl("top159");
      if (max !== null) k(t("an_k_maxzeit"), `${z(max, 0)} min`, "TOP159");
    } else if (r === "heizstab") {
      ausPunkt("heizstab", t("an_k_stab_zr"));
      const hs = iv("heater_runtime_today");
      const kw = this._intZahl("top147");
      if (hs && hs.zahl !== null) {
        k(t("an_k_stab_heute"), `${z(hs.zahl, 0)} min`, intS);
        const sieben = parseFloat(hs.attr["7d_min"]);
        if (Number.isFinite(sieben)) {
          k(t("an_k_stab_7"), `${z(sieben, 0)} min`, intS);
          if (kw !== null && kw > 0) k(t("an_k_stab_kwh"), `${z((sieben / 60) * kw, 1)} kWh`, tf(t("an_k_stab_kwh_s"), { k: z(kw, 0) }));
        }
      }
      if (kw !== null && kw > 0) k(t("an_k_stab_kw"), `${z(kw, 0)} kW`, "TOP147");
      ausPunkt("bivalenz", t("an_k_biv"));
      ausPunkt("auslegung", t("an_k_ausl"));
    } else if (r === "abtauen") {
      ausPunkt("abtauung", t("an_k_abtau_zr"));
      const ab = iv("defrost_24h");
      if (ab && ab.zahl !== null) {
        k(t("an_k_abtau24"), z(ab.zahl, 0), intS);
        if (Number.isFinite(ab.attr.mittlere_dauer_min)) k(t("an_k_abtau_dauer"), `${z(ab.attr.mittlere_dauer_min, 0)} min`, intS);
        if (Number.isFinite(ab.attr.strom_kwh_24h)) k(t("an_k_abtau_strom"), `${z(ab.attr.strom_kwh_24h, 2)} kWh`, intS);
        if (Number.isFinite(ab.attr.je_tag_7d)) k(t("an_k_abtau_tag"), z(ab.attr.je_tag_7d, 1), `${intS}, ${t("an_7t")}`);
      }
    } else if (r === "effizienz") {
      ausPunkt("cop", t("an_k_cop"));
      ausPunkt("jaz", t("an_k_jaz"));
    } else if (r === "strom") {
      const netz = typeof this._netzHeute === "function" ? this._netzHeute() : null;
      if (netz) k(t("netzstrom_heute"), `${z(netz.netz, 1)} kWh`, netz.quelle === "integration" ? intS : t("an_q_karte"));
      if (netz && netz.quelle === "karte" && Number.isFinite(netz.anteil)) k(t("an_k_pv_heute"), `${z(Math.min(100, Math.max(0, netz.anteil)), 0)} %`, t("an_q_karte"));
      const pv = iv("pv_share_today");
      if (pv && pv.zahl !== null) {
        k(t("an_k_pv_heute"), `${z(pv.zahl, 0)} %`, intS);
        if (Number.isFinite(parseFloat(pv.attr.pv_anteil_7_tage))) k(t("an_k_pv_7"), `${z(parseFloat(pv.attr.pv_anteil_7_tage), 0)} %`, intS);
      }
      ausPunkt("kosten", t("an_k_heizkosten"));
      const kost = iv("dhw_cost_per_day");
      if (kost && kost.zahl !== null) k(t("an_k_wwkosten"), `${z(kost.zahl, 2)} €`, `${intS}, ${t("an_7t")}`);
      ausPunkt("sgein", t("an_k_sg"));
    } else if (r === "anlage") {
      ausPunkt("druck", t("an_k_druck"));
      ausPunkt("stoerung", t("an_k_stoerung"));
      ausPunkt("firmware", t("an_k_firmware"));
    }
    return out;
  },

  /** Kleine Balkengrafik zu einem Reiter, nur mit Werten der Integration. */
  _anGrafik(r) {
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    let titel = "";
    let paare = [];
    let hervor = null;
    let zweite = null;
    if (r === "warmwasser") {
      const b = this._int("dhw_best_hour");
      const c = b && b.attr.cop_je_startstunde;
      if (!c || typeof c !== "object") return "";
      paare = Object.entries(c).filter(([, v]) => Number.isFinite(Number(v))).map(([s, v]) => [s.slice(0, 2), Number(v), z(Number(v))]);
      hervor = b.roh ? String(b.roh).slice(0, 2) : null;
      titel = t("an_g_wwcop");
    } else if (r === "heizkurve") {
      const v = this._int("flow_over_target");
      const c = v && v.attr.vorlauf_je_aussentemperatur;
      if (!c || typeof c !== "object") return "";
      paare = Object.entries(c)
        .filter(([, w]) => w && Number.isFinite(Number(w.ist)))
        // Zahl ueber dem Balken: Ist minus Soll, die Balken selbst ab 0 °C.
        .map(([s, w]) => {
          const diff = Number(w.ist) - Number(w.soll);
          return [s.replace(" °C", ""), Number(w.ist), Number.isFinite(diff) ? `${diff > 0 ? "+" : ""}${z(diff)}` : "", Number(w.soll)];
        });
      zweite = true;
      titel = t("an_g_vlsoll");
    } else if (r === "abtauen") {
      const a = this._int("defrost_24h");
      const c = a && a.attr.anzahl_7d_je_aussentemperatur;
      if (!c || typeof c !== "object") return "";
      paare = Object.entries(c).filter(([, v]) => Number.isFinite(Number(v))).map(([s, v]) => [s.replace(" °C", ""), Number(v), z(Number(v), 0)]);
      titel = t("an_g_abtau");
    }
    if (!paare.length) return "";
    const werte = paare.flatMap((p) => (zweite ? [p[1], p[3]] : [p[1]])).filter(Number.isFinite);
    const hoch = Math.max(...werte);
    const tief = 0;
    const h = (v) => Math.max(4, Math.round(((v - tief) / Math.max(hoch - tief, 0.001)) * 100));
    const balken = paare
      .map(([s, v, txt, v2]) => `<div class="lhc-an-sp"><i>${escapeHtml(txt)}</i><div class="lhc-an-bal">
          <span class="${hervor === s ? "best" : ""}" style="height:${h(v)}%"></span>${zweite && Number.isFinite(v2) ? `<span class="soll" style="height:${h(v2)}%"></span>` : ""}</div>
          <b>${escapeHtml(s)}</b></div>`)
      .join("");
    const legende = zweite ? `<div class="lhc-an-leg"><span class="ist"></span>${escapeHtml(t("an_g_ist"))} <span class="soll"></span>${escapeHtml(t("an_g_soll"))}</div>` : "";
    return `<div class="lhc-an-box lhc-an-grafik"><b class="lhc-an-boxkopf">${escapeHtml(titel)}</b><div class="lhc-an-balken">${balken}</div>${legende}
      <div class="lhc-an-quelle">${escapeHtml(t(`an_g_${r}_fuss`))}</div></div>`;
  },

  /** Zeichnet die Analyse mit Ueberblick und Reitern in das Fenster. */
  _zeichneAnalyse() {
    if (this._diaArt !== "analyse") return;
    const sr = this.shadowRoot;
    const liste = sr && sr.getElementById("dia-liste");
    if (!liste) return;
    this._diaLeer(false);
    if (this._auswertung) this._auswertungHinweis(this._auswertung);
    const punkte = this._anPruefen();
    this._anPunkte = punkte;
    const t = (k) => this._t(k);
    const e = escapeHtml;
    if (!this._anReiter || (this._anReiter !== "ueberblick" && !REITER.includes(this._anReiter))) this._anReiter = "ueberblick";

    const quellenHtml = (q) =>
      []
        .concat(q || [])
        .map((k) => QUELLEN[k])
        .filter(Boolean)
        .map((x) => `<a href="${e(x[1])}" target="_blank" rel="noopener noreferrer">${e(x[0])}</a>`)
        .join(" · ");
    const chip = (stufe, kurz) => {
      const st = STUFEN[stufe];
      const stil = st.neutral ? "" : `background:color-mix(in srgb, ${st.css} 14%, transparent)`;
      return `<i class="lhc-an-chip${st.neutral ? " neutral" : ""}" style="color:${st.css};${stil}">${st.zeichen} ${e(t(kurz ? STUFEN[stufe].zahl || st.text : st.text))}</i>`;
    };
    const karte = (p) => {
      const st = STUFEN[p.stufe];
      const q = quellenHtml(p.quelle);
      const nr = punkte.indexOf(p);
      return `<div class="lhc-an-karte" data-stufe="${p.stufe}" style="border-left-color:${st.neutral ? "var(--c-3a4557)" : st.css}">
          <div class="lhc-an-kopf"><b>${e(p.titel)}</b>
            ${st.neutral ? `<i class="neutral" style="color:${st.css}">` : `<i style="color:${st.css};background:color-mix(in srgb, ${st.css} 14%, transparent)">`}${st.zeichen} ${e(t(st.text))}</i></div>
          <div class="lhc-an-wert"><span><b>${e(p.wert)}</b> ${e(p.wertText || "")}</span>
            ${p.richt ? `<span>${e(t(p.stufe === "info" ? "an_vergleich" : "an_richtwert"))} <b>${e(p.richt)}</b></span>` : ""}</div>
          ${p.text ? `<p>${e(p.text)}</p>` : ""}
          ${p.tipp ? `<p class="lhc-an-tipp">${e(p.tipp)}</p>` : ""}
          ${p.aktion ? `<button type="button" class="lhc-an-knopf" data-vorschlag="${nr}">⚙ ${e(t("an_opt_knopf"))}</button>` : ""}
          ${!p.aktion && p.ohne ? `<p class="lhc-an-ohne">${e(p.ohne)}</p>` : ""}
          ${q ? `<div class="lhc-an-quelle">${e(t("an_quelle"))}: ${q}</div>` : ""}
        </div>`;
    };

    // Stufe je Reiter und der wichtigste Punkt.
    const reiter = REITER.map((r) => {
      const ps = punkte.filter((p) => p.reiter === r);
      return { r, ps, stufe: ps.length ? reiterStufe(ps) : "unbekannt", haupt: hauptPunkt(ps) };
    });
    const kurzVon = (x) => (x.haupt ? x.haupt.kurz || x.haupt.text || "" : t("an_tun_leer"));

    /* ---------- Ueberblick ---------- */
    const zahl = { ok: 0, leicht: 0, hinweis: 0, pruefen: 0, info: 0, unbekannt: 0 };
    punkte.forEach((p) => zahl[p.stufe]++);
    const bewertet = BEWERTET.reduce((s, k) => s + zahl[k], 0);
    let titel = "an_g_gut";
    let n = 0;
    if (!bewertet) titel = "an_g_leer";
    else if (zahl.pruefen) [titel, n] = ["an_g_pruefen", zahl.pruefen + zahl.hinweis];
    else if (zahl.hinweis) [titel, n] = ["an_g_hinweis", zahl.hinweis];
    else if (zahl.leicht) [titel, n] = ["an_g_leicht", zahl.leicht];
    const zuerst = reiter.filter((x) => ["pruefen", "hinweis", "leicht"].includes(x.stufe)).sort((a, b) => RANG[b.stufe] - RANG[a.stufe]);
    const auffaellig = zuerst.filter((x) => AUFFAELLIG.includes(x.stufe));
    const meist = auffaellig.slice(0, 3).map((x) => t(`an_rt_${x.r}`)).join(", ");
    const umfang = 2 * Math.PI * 34;
    let versatz = 0;
    const ring = BEWERTET
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
    const effizienz = ["cop", "jaz"]
      .map((id) => punkte.find((p) => p.id === id))
      .filter((p) => p && p.wert && p.wert !== "--")
      .map((p) => `<div><b>${e(p.wert)}</b><span>${e(t(p.id === "cop" ? "an_ue_cop" : "an_ue_jaz"))}</span></div>`)
      .join("");
    const fehlt = punkte.find((p) => p.id === "gruppen");
    const banner = fehlt ? `<div class="lhc-an-banner">${e(fehlt.kurz)} ${e(fehlt.schritt)}</div>` : "";
    const zeile = (x) => `<button type="button" class="lhc-an-zeile" data-an-reiter="${x.r}" style="border-left-color:${STUFEN[x.stufe].css}">
        <b>${e(t(`an_rt_${x.r}`))}</b>${chip(x.stufe, true)}<span>${e(kurzVon(x))}</span><em>${e(t("an_ansehen"))}</em></button>`;
    const kachel = (x) => `<button type="button" class="lhc-an-mini" data-an-reiter="${x.r}"><i class="lhc-an-dot ${x.stufe}"></i>
        <b>${e(t(`an_rt_${x.r}`))}</b><span>${e(x.haupt && x.haupt.wert && x.haupt.wert !== "--" && x.stufe === "ok" ? x.haupt.wert : kurzVon(x))}</span></button>`;
    const okListe = reiter.filter((x) => x.stufe === "ok");
    const ohneListe = reiter.filter((x) => ["info", "unbekannt"].includes(x.stufe));
    const ueberblick = `<div class="lhc-an-gesamt">
        <svg viewBox="0 0 84 84" class="lhc-an-ring"><circle cx="42" cy="42" r="34" fill="none" stroke="#26303F" stroke-width="10"/>${ring}
          <text x="42" y="48" text-anchor="middle" font-size="18" font-weight="700" fill="#E8EDF4">${zahl.ok + zahl.leicht}/${bewertet}</text></svg>
        <div class="lhc-an-urteil"><b>${e(tf(t(titel), { n: tf(t(n === 1 ? "an_n_1" : "an_n_n"), { n }) }))}</b>
          ${meist ? `<span>${e(tf(t("an_ue_meist"), { p: meist }))}</span>` : ""}<span>${e(t("an_ue_text"))}</span></div>
        ${effizienz ? `<div class="lhc-an-zahlen">${effizienz}</div>` : ""}
      </div>
      ${zuerst.length ? `<div class="lhc-an-gruppe">${e(t("an_ue_zuerst"))}</div>${zuerst.map(zeile).join("")}` : ""}
      ${okListe.length ? `<div class="lhc-an-gruppe">${e(t("an_ue_ok"))}</div><div class="lhc-an-minis">${okListe.map(kachel).join("")}</div>` : ""}
      ${ohneListe.length ? `<div class="lhc-an-gruppe">${e(t("an_ue_ohne"))}</div><div class="lhc-an-minis">${ohneListe.map(kachel).join("")}</div>` : ""}`;

    /* ---------- Reiter ---------- */
    const panels = reiter.map((x) => {
      const r = x.r;
      const kacheln = this._anKacheln(r, x.ps)
        .map((k) => `<div class="lhc-an-kachel${k.warn ? " warn" : ""}"><span>${e(k.n)}</span><b>${e(k.w)}</b>${k.s ? `<small>${e(k.s)}</small>` : ""}</div>`)
        .join("");
      // Was du tun kannst: auffaellige Punkte mit Schritt, Tipp oder Grund,
      // dazu Schritte leichter Abweichungen, wo es einen belegten gibt.
      const schritte = [];
      x.ps
        .filter((p) => AUFFAELLIG.includes(p.stufe) || ((p.stufe === "leicht" || p.stufe === "unbekannt") && p.schritt))
        .sort((a, b) => (RANG[b.stufe] || 0) - (RANG[a.stufe] || 0))
        .forEach((p) => {
          const text = p.schritt || p.tipp || p.ohne;
          if (!text && !p.aktion) return;
          schritte.push(`<li>${e(text || "")}${p.aktion ? `<br><button type="button" class="lhc-an-knopf" data-vorschlag="${punkte.indexOf(p)}">⚙ ${e(t("an_opt_knopf"))}</button>` : ""}</li>`);
        });
      if (r === "warmwasser") {
        const b = this._int("dhw_best_hour");
        if (b && b.roh) schritte.push(`<li>${e(tf(t("an_sr_wwstunde"), { h: b.roh }))}</li>`);
      }
      const tun = schritte.length
        ? `<ol>${schritte.join("")}</ol>`
        : `<p>${e(t({ ok: "an_tun_ok", leicht: "an_tun_leicht", info: "an_tun_info" }[x.stufe] || "an_tun_leer"))}</p>`;
      const grafik = this._anGrafik(r);
      const warumQ = quellenHtml(WARUM_QUELLE[r]);
      const st = STUFEN[x.stufe];
      return `<div class="lhc-an-panel" data-an-panel="${r}"${this._anReiter === r ? "" : " hidden"}>
          <div class="lhc-an-tkopf"><b>${e(t(`an_rt_${r}`))}</b>${chip(x.stufe, false)}</div>
          <div class="lhc-an-ziel">${e(t(`an_rz_${r}`))}</div>
          <div class="lhc-an-kurz" style="border-color:${st.neutral ? "var(--c-3a4557)" : st.css}"><b>${e(t("an_kurz"))}</b><span>${e(kurzVon(x))}</span></div>
          ${kacheln ? `<div class="lhc-an-gruppe">${e(t("an_deine"))}</div><div class="lhc-an-kacheln">${kacheln}</div>` : ""}
          <div class="lhc-an-zwei${grafik ? "" : " eins"}"><div class="lhc-an-box"><b class="lhc-an-boxkopf">${e(t("an_tun"))}</b>${tun}</div>${grafik}</div>
          <details class="lhc-an-klapp" open><summary>${e(t("an_warum"))}</summary><p>${e(t(`an_rw_${r}`))}</p>
            ${warumQ ? `<div class="lhc-an-quelle">${e(t("an_quelle"))}: ${warumQ}</div>` : ""}</details>
          ${x.ps.length ? `<details class="lhc-an-klapp"><summary>${e(t("an_fach"))}</summary><div class="lhc-an-raster">${x.ps.map(karte).join("")}</div></details>` : ""}
        </div>`;
    });

    const leiste = [["ueberblick", null]].concat(reiter.map((x) => [x.r, x.stufe]))
      .map(([r, stufe]) => `<button type="button" class="lhc-an-reiter${this._anReiter === r ? " aktiv" : ""}" data-an-reiter="${r}" role="tab"
          aria-selected="${this._anReiter === r}">${stufe ? `<i class="lhc-an-dot ${stufe}"></i>` : ""}${e(t(`an_rt_${r}`))}</button>`)
      .join("");
    liste.innerHTML = `<div class="lhc-an">${banner}<div class="lhc-an-leiste" role="tablist">${leiste}</div>
      <div class="lhc-an-panel" data-an-panel="ueberblick"${this._anReiter === "ueberblick" ? "" : " hidden"}>${ueberblick}</div>
      ${panels.join("")}
      <p class="lhc-takt-quelle">${e(t("an_fuss"))}</p></div>`;
    this._anReiterAn(liste);
    liste.querySelectorAll("[data-vorschlag]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = this._anPunkte && this._anPunkte[Number(b.dataset.vorschlag)];
        if (p && p.aktion) this._zeigeVorschlag(p);
      });
    });
  },

  /** Reiter umschalten, ohne neu zu zeichnen (Bildlauf bleibt). */
  _anReiterAn(liste) {
    liste.querySelectorAll("[data-an-reiter]").forEach((b) => {
      b.addEventListener("click", () => {
        const r = b.dataset.anReiter;
        this._anReiter = r;
        liste.querySelectorAll(".lhc-an-reiter").forEach((x) => {
          const an = x.dataset.anReiter === r;
          x.classList.toggle("aktiv", an);
          x.setAttribute("aria-selected", String(an));
        });
        liste.querySelectorAll("[data-an-panel]").forEach((p) => {
          p.hidden = p.dataset.anPanel !== r;
        });
        const leiste = liste.querySelector(".lhc-an-leiste");
        if (leiste && !b.classList.contains("lhc-an-reiter")) leiste.scrollIntoView({ block: "nearest" });
      });
    });
  },
};
