/**
 * Analyse: wertet die bekannten Messwerte und Einstellungen aus und gibt
 * je Pruefpunkt eine Einordnung mit Richtwert, Tipp und Quelle. Liegt die
 * Ursache in einem einstellbaren Parameter, macht sie einen Vorschlag,
 * der erst nach Bestaetigung gesetzt wird (siehe optimieren.js).
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Bewertet wird nur, wo eine fachliche Quelle eine Grenze nennt:
 *  ok        im Richtwert der Quelle
 *  leicht    leichte Abweichung innerhalb einer Toleranz, die die Quelle nennt
 *  hinweis   ausserhalb des Richtwerts oder der Toleranz
 *  pruefen   jenseits einer zweiten belegten Grenze (Hygiene) oder Stoerung
 *  info      nur Messwert: keine belegte Grenze, darum keine Bewertung
 *  unbekannt keine Daten
 * Knopf, Tipp und "Kein Vorschlag" gibt es nur bei hinweis und pruefen.
 *
 * Grundlagen (Stand 01.11.2026):
 *  - Spreizung: Ziel 5 bis 7 K; bei Heizkoerpern toleriert der BWP bis
 *    10 K; unter 5 K hoher Pumpenstrom und haeufiges Takten, ueber 10 K
 *    fehlt Durchfluss (BWP Leitfaden Hydraulik, 42watt "Spreizung").
 *    Mit getrenntem Puffer gilt die Spreizung nur fuer den Kreis der
 *    Waermepumpe; die Pumpe regelt im Modus Delta T auf TOP23
 *    (HeishaMon SET18 SetFloorHeatDelta, SET42 Pumpenregelung).
 *  - Vorlauf bei Normaussentemperatur: Fussbodenheizung meist 30 bis 35 °C,
 *    im Altbau bis 40 °C; Heizkoerper meist 45 bis 55 °C, hoechstens 55 °C
 *    (Verbraucherzentrale Rheinland-Pfalz), 42watt "Vorlauftemperatur".
 *  - Puffer: Pufferziel = hoechstes Heizkreis-Soll + Puffer-Delta-T, Ziel
 *    der Waermepumpe 2 °C darueber (Panasonic Servicehandbuch der
 *    H-Generation, WH-SDC09H3E8, S. 104). Fuer den gemessenen Abstand nennt
 *    keine Quelle eine Grenze: nur Messwert.
 *  - Taktung: Ziel 10 bis 20 min je Start (BWP), 42watt "Taktung"; siehe
 *    taktStufe in auswertung.js. Eine feste Grenze fuer Starts gibt es nicht.
 *  - COP: Vergleich mit dem Datenblatt des im Editor gewaehlten Geraets bei
 *    gleicher Aussen- und Vorlauftemperatur, Toleranz -8 % (HP KEYMARK),
 *    siehe datenblatt.js. Ohne Datenblatt nur Messwert.
 *  - Bivalenzpunkt monoenergetischer Luft-Wasser-Anlagen meist -3 bis
 *    -7 °C (Stiebel Eltron Planungshandbuch), 42watt "Bivalenzpunkt".
 *  - Heizstab: Warnzeichen, wenn er oberhalb von 0 °C ueber laengere Zeit
 *    laeuft (42watt "Heizstab"); eine Grenze in Minuten nennt die Quelle
 *    nicht. TOP60 meldet den Heizstab fuer Raum oder Warmwasser (HeishaMon
 *    ProtocolByteDecrypt), darum zaehlen nur Zeiten im Heizbetrieb.
 *  - Abtauung typischerweise 5 bis 15 min, am haeufigsten bei -5 bis +5 °C
 *    (42watt "Abtauen"). Eine Temperaturgrenze fuer "deutliche Plusgrade"
 *    nennt die Quelle nicht, darum dort nur ein Hinweis ohne Bewertung.
 *  - Warmwasser: Das Umweltbundesamt empfiehlt durchgaengig ueber 55 °C,
 *    fuer Ein- und Zweifamilienhaeuser mindestens 55 bis 60 °C
 *    (Trinkwarmwasserkonzepte, 1.11.2023). DVGW: ab 50 °C wird die
 *    Vermehrung von Legionellen wirksam gehemmt (Wissenschaftliche Dienste
 *    des Bundestags, WD 8-3000-021/23). Der Speicher faellt bis Soll plus
 *    TOP22 (negativ), bevor nachgeladen wird.
 *  - Anlagendruck meist 1,2 bis 2,0 bar (Vattenfall, Richtwert; die dort
 *    genannten etwa 0,3 bar sind ein Zuschlag zur Rechnung nach der Hoehe,
 *    1,0 bar je 10 m, gegen Druckverluste, keine Toleranz nach oben).
 *    TOP115 gibt es laut HeishaMon nur bei der K- und L-Serie; 0 bar gilt
 *    als kein Messwert (eigene Festlegung).
 *  - JAZ: aus Werten der Waermepumpe seit 1. Januar, nur eingeschraenkt
 *    mit gemessenen Jahreswerten vergleichbar: nur Messwert.
 */
import { escapeHtml, fmt, indexBis, numState, rawState, stellbar } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { abtauungen, anAbschnitte, copStufe, copSumme, mittel, taktStufe, ventilAbschnitte } from "./auswertung.js";
import { TOLERANZ } from "./datenblatt.js";

export const QUELLEN = {
  spreizung: ["42watt: Spreizung (BWP Leitfaden Hydraulik)", "https://42watt.de/magazin/spreizung-warmepumpe"],
  pumpe: ["Panasonic Servicehandbuch: Pumpenregelung", "https://www.manualslib.com/manual/3042472/Panasonic-Aquarea-Wh-Adc0912k6e5an.html?page=141"],
  vorlauf: ["42watt: Vorlauftemperatur (Bosch, Viessmann, VZ RLP)", "https://www.42watt.de/magazin/vorlauftemperatur-warmepumpe"],
  puffer: ["Panasonic Servicehandbuch: Pufferziel", "https://www.manualslib.com/manual/1273892/Panasonic-Wh-Sdc09h3e8.html?page=104"],
  taktung: ["42watt: Taktung (BWP, Fraunhofer)", "https://42watt.de/magazin/taktung-warmepumpe"],
  cop: ["Panasonic: Aquarea T-CAP M, Katalog 2025", "https://cdn.aircon.panasonic.eu/uploads/DE/Catalogues/2025/DE-LFLTAQM2501.pdf"],
  keymark: ["HP KEYMARK, Annex A: Toleranz COP −8 %", "https://www.dincertco.de/media/dincertco/dokumente_1/certification_schemes/w%C3%A4rmepumpen_heat-pump_keymark_annex-a.pdf"],
  wirkungsgrad: ["42watt: Wirkungsgrad (COP, Carnot)", "https://42watt.de/magazin/wirkungsgrad-warmepumpe"],
  bivalenz: ["42watt: Bivalenzpunkt (Stiebel Eltron)", "https://42watt.de/magazin/bivalenzpunkt-warmepumpe-einfach-erklart"],
  heizstab: ["42watt: Heizstab (Fraunhofer-Feldtests)", "https://42watt.de/magazin/heizstab-warmepumpe"],
  abtauung: ["42watt: Abtauen", "https://42watt.de/magazin/warmepumpe-abtauen"],
  warmwasser: ["Umweltbundesamt: Trinkwarmwasserkonzepte (2023)", "https://www.umweltbundesamt.de/sites/default/files/medien/11850/publikationen/factsheet_trinkwarmwasserkonzepte.pdf"],
  legionellen: ["Bundestag WD 8-3000-021/23 (DVGW)", "https://bundestag.de/resource/blob/947272/cc7cce64da5a0983382949ac996e72ff/WD-8-021-23-pdf-data.pdf"],
  druck: ["Vattenfall: Wasserdruck der Heizung", "https://www.vattenfall.de/infowelt-energie/nachhaltig-heizen/wasserdruck-der-heizung"],
  jaz: ["42watt: Jahresarbeitszahl (BEG, Fraunhofer)", "https://42watt.de/magazin/jahresarbeitszahl"],
};

/*
 * Stufen mit Zeichen und Text, die Farbe steht nie allein. farbe ist der
 * Hexwert fuer SVG (die Themen ersetzen ihn), css der Wert fuer HTML.
 * Grau fuer "leicht" ist bewusst keine Vorstufe von Rot.
 */
const STUFEN = {
  ok: { farbe: "#22C55E", css: "#22C55E", zeichen: "✓", text: "an_ok", zahl: "an_z_ok" },
  leicht: { farbe: "#98A6BA", css: "var(--c-98a6ba)", zeichen: "ⓘ", text: "an_leicht", zahl: "an_z_leicht" },
  hinweis: { farbe: "#F59E0B", css: "#F59E0B", zeichen: "!", text: "an_hinweis", zahl: "an_z_hinweis" },
  pruefen: { farbe: "#EF4444", css: "#EF4444", zeichen: "✕", text: "an_pruefen", zahl: "an_z_pruefen" },
  info: { farbe: "#7E8CA0", css: "var(--c-98a6ba)", zeichen: "◦", text: "an_info", neutral: true },
  unbekannt: { farbe: "#7E8CA0", css: "var(--c-7e8ca0)", zeichen: "?", text: "an_unbekannt", neutral: true },
};

/** Stufen mit Bewertung, in der Reihenfolge von gut nach schlecht. */
const BEWERTET = ["ok", "leicht", "hinweis", "pruefen"];

/** Nur bei diesen Stufen gibt es Knopf, Tipp und "Kein Vorschlag". */
export const AUFFAELLIG = ["hinweis", "pruefen"];

/**
 * Richtwerte des Vorlaufs je Heizflaeche bei Normaussentemperatur: bis
 * "gut" in Ordnung, bis "toleranz" leichte Abweichung (Fussbodenheizung im
 * Altbau bis 40 °C), darueber ausserhalb.
 */
export const GRENZE = { fbh: { gut: 35, toleranz: 40 }, hk: { gut: 55, toleranz: 55 } };

export function vlStufe(v, gr) {
  if (v <= gr.gut) return "ok";
  return v <= gr.toleranz ? "leicht" : "hinweis";
}

/** Text zur Stufe des Vorlaufs. */
function vlText(stufe, art) {
  if (stufe === "ok") return "an_vl_ok";
  if (stufe === "leicht") return "an_vl_fbh_alt";
  return art === "fbh" ? "an_vl_fbh" : "an_vl_hk";
}

/** Rangfolge der Stufen, um den schlechtesten Heizkreis zu finden. */
const RANG = { ok: 0, leicht: 1, hinweis: 2, pruefen: 3 };

/**
 * Zeiten in Minuten, in denen eine Reihe "an" meldet, mit der
 * Aussentemperatur dabei. Mit Ventilverlauf nur die Zeiten, in denen das
 * Ventil auf Heizen steht.
 */
export function anZeiten(reihe, aussen, t0, t1, ventil) {
  // Unbekannte Werte ("unavailable") aendern den Zustand nicht.
  const abschnitte = anAbschnitte(reihe, t0, t1);
  const raum = ventil
    ? abschnitte.flatMap((x) => ventilAbschnitte(ventil, x.von, x.bis).filter((s) => !s.ww).map((s) => ({ von: s.von, bis: s.bis })))
    : abschnitte;
  raum.forEach((x) => {
    x.minuten = (x.bis - x.von) / 60000;
    x.aussen = aussen ? mittel(aussen, x.von, x.bis, false) : null;
  });
  return raum;
}

export const analyseKarte = {
  /** Heizflaeche eines Heizkreises laut Editor. */
  _anFlaecheVon(n) {
    return this._istFbh(this._heizStil(n)) ? "fbh" : "hk";
  },

  /**
   * Heizflaechen laut Editor: nur Fussbodenheizung, nur Heizkoerper oder
   * gemischt. Meldet die Waermepumpe ihre aktiven Zonen (TOP94), zaehlen
   * nur diese, sonst alle Heizkreise laut Editor.
   */
  _anHeizflaechen() {
    const z = this._anWert("zones_state");
    const n = Math.max(1, Math.min(4, Number(this._config.hk_count) || 1));
    const kreise = z === 0 || z === 1 || z === 2 ? this._anZonen() : Array.from({ length: n }, (_, i) => i + 1);
    const arten = kreise.map((k) => this._anFlaecheVon(k));
    if (arten.every((a) => a === "fbh")) return "fbh";
    if (arten.every((a) => a === "hk")) return "hk";
    return "gemischt";
  },

  /** Wert einer Entitaet als Zahl, oder null. */
  _anWert(feld) {
    const id = this._e(feld);
    return id ? numState(this._quelle, id) : null;
  },

  /**
   * Ob sicher ein Puffer eingebunden ist. Fest eingestellt gewinnt, sonst
   * TOP99. Ohne Angabe gilt: kein Puffer, dann wird wie bisher bewertet.
   */
  _anMitPuffer() {
    const e = this._config.buffer_present;
    if (e === true || e === false) return e;
    const id = this._e("buffer_installed");
    const st = id && this._quelle && this._quelle.states && this._quelle.states[id];
    if (!st) return false;
    const s = String(st.state).toLowerCase();
    return ["on", "true", "enabled", "installed", "yes"].includes(s) || parseFloat(s) > 0;
  },

  /** Aktive Heizkreise (Zonen) laut TOP94, sonst laut Editor. */
  _anZonen() {
    const z = this._anWert("zones_state");
    if (z === 0) return [1];
    if (z === 1) return [2];
    if (z === 2) return [1, 2];
    return Number(this._config.hk_count) >= 2 ? [1, 2] : [1];
  },

  /**
   * Eine Aenderung fuer den Vorschlag. Nur, wenn der Ist-Wert bekannt ist,
   * sich etwas aendert und die Entitaet stellbar ist oder HeishaMon einen
   * Befehl dafuer kennt.
   */
  _anAenderung(feld, neu, befehl, einheit, extra) {
    const id = this._e(feld);
    if (!id || neu === null || neu === undefined) return null;
    const ist = numState(this._quelle, id);
    if (ist === null || Math.abs(ist - neu) < 0.05) return null;
    if (!this._config.demo && !stellbar(id) && !befehl) return null;
    return { feld, id, ist, neu, befehl, einheit, ...extra };
  },

  /**
   * Pumpenregelung (SET42): Delta T regelt die Drehzahl auf die eingestellte
   * Spreizung, "max. Leistung" laeuft fest (Panasonic Servicehandbuch).
   * HeishaMon by Lutarym meldet mode_0 und mode_1, andere Integrationen
   * eigene Texte.
   */
  _anPumpenModus() {
    const id = this._e("pump_flow_mode");
    const st = id && this._quelle.states ? this._quelle.states[id] : null;
    if (!st) return null;
    const optionen = (st.attributes && st.attributes.options) || [];
    const istDt = (o) => o === "mode_0" || o === "0" || /delta|δ|spreiz/i.test(String(o));
    const istMax = (o) => o === "mode_1" || o === "1" || /max/i.test(String(o));
    const zustand = String(st.state);
    return {
      id,
      zustand,
      modus: istDt(zustand) ? "dt" : istMax(zustand) ? "max" : null,
      optionDt: optionen.find(istDt) || null,
    };
  },

  /** Lesbarer Text einer Option der Pumpenregelung. */
  _anPumpenText(o) {
    if (o === "mode_0" || o === "0") return this._t("o_spreizung");
    if (o === "mode_1" || o === "1") return this._t("o_max_leistung");
    return String(o);
  },

  /**
   * Eine Aenderung an einer Auswahl (select). Nur, wenn sich die Option
   * aendert und die Entitaet stellbar ist oder HeishaMon einen Befehl kennt.
   */
  _anAuswahl(feld, option, istText, neuText, befehl, nutzlast) {
    const id = this._e(feld);
    const st = id && this._quelle.states ? this._quelle.states[id] : null;
    if (!st || !option || st.state === option) return null;
    const bereich = id.split(".")[0];
    if (!this._config.demo && bereich !== "select" && bereich !== "input_select" && !befehl) return null;
    return { feld, id, ist: istText, neu: neuText, option, auswahl: true, befehl, nutzlast };
  },

  /** Vorschlag aus mehreren Aenderungen, leer gibt null. */
  _anVorschlag(aenderungen, grund, hinweis) {
    const liste = aenderungen.filter(Boolean);
    return liste.length ? { aenderungen: liste, grund, hinweis: hinweis || "" } : null;
  },

  /**
   * Heizkurve eines Heizkreises um einen Schritt senken. "kalt" senkt nur
   * den Vorlauf am kalten Ende, "parallel" beide Eckwerte. Nie unter 20 °C
   * und das kalte Ende nie unter das warme.
   */
  _anKurvenSchritt(zone, art, untergrenze) {
    const pre = zone === 2 ? "curve2_" : "curve_";
    const hoch = this._anWert(`${pre}t_high`);
    const tief = this._anWert(`${pre}t_low`);
    if (hoch === null) return [];
    const neuHoch = Math.max(hoch - 2, untergrenze !== undefined ? Math.min(untergrenze, hoch) : 20, tief !== null ? tief : 20, 20);
    // Rueckfall ohne stellbare Entitaet: HeishaMon SET16 SetCurves.
    const out = [this._anAenderung(`${pre}t_high`, neuHoch, "SetCurves", "°C", { kurve: zone })];
    if (art === "parallel" && tief !== null) {
      out.push(this._anAenderung(`${pre}t_low`, Math.max(20, Math.min(tief - 2, neuHoch)), "SetCurves", "°C", { kurve: zone }));
    }
    return out;
  },

  /**
   * Grenzen der Spreizung im Heizbetrieb. Die Toleranz bis 10 K nennt der
   * BWP nur fuer Heizkoerper, nicht fuer Fussbodenheizung und nicht fuer den
   * Kreis zum Puffer.
   */
  _anSpGrenzen() {
    const toleranz = !this._anMitPuffer() && this._anHeizflaechen() !== "fbh";
    return { toleranz, spMax: toleranz ? 10 : 7 };
  },

  /** Stufe und Text einer gemessenen Spreizung im Heizbetrieb. */
  _anSpStufe(sp) {
    const puffer = this._anMitPuffer();
    const { toleranz } = this._anSpGrenzen();
    if (sp < 5) return { stufe: "hinweis", text: puffer ? "an_sp_klein_p" : "an_sp_klein" };
    if (sp > 10) return { stufe: "hinweis", text: puffer ? "an_sp_gross_p" : "an_sp_gross" };
    if (sp > 7) {
      return toleranz ? { stufe: "leicht", text: "an_sp_hk" } : { stufe: "hinweis", text: puffer ? "an_sp_mittel_p" : "an_sp_fbh" };
    }
    return { stufe: "ok", text: "an_sp_ok" };
  },

  /**
   * Vorschlag zur Spreizung: TOP23, wenn Messung und Einstellung in dieselbe
   * Richtung vom Richtwert abweichen; sonst die Pumpenregelung auf Delta T,
   * wenn die Pumpe fest auf "max. Leistung" laeuft (Panasonic
   * Servicehandbuch). Ohne Vorschlag steht in "ohne", warum.
   */
  _anSpVorschlag(sp) {
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    const dtSoll = this._anWert("heat_delta");
    const { spMax, toleranz } = this._anSpGrenzen();
    const richt = t(this._anMitPuffer() ? "an_r_sp_p" : toleranz ? "an_r_sp_hk" : "an_r_sp_fbh");
    let neu = null;
    if (dtSoll !== null && sp < 5 && dtSoll < 5) neu = 5;
    if (dtSoll !== null && sp > spMax && dtSoll > spMax) neu = spMax;
    let aktion = null;
    let ohne = "";
    if (neu !== null) {
      aktion = this._anVorschlag(
        [this._anAenderung("heat_delta", neu, "SetFloorHeatDelta", "K")],
        tf(t("an_g_sp"), { m: z(sp), r: richt })
      );
    } else if (sp < 5) {
      const pm = this._anPumpenModus();
      if (pm && pm.modus === "max" && pm.optionDt) {
        aktion = this._anVorschlag(
          [this._anAuswahl("pump_flow_mode", pm.optionDt, this._anPumpenText(pm.zustand), this._anPumpenText(pm.optionDt),
            "SetPumpFlowrateMode", "0")],
          tf(t("an_g_pumpe"), { m: z(sp), s: dtSoll !== null ? z(dtSoll, 0) : "--" })
        );
      }
      // Diese Begruendungen setzen einen bekannten Wert von TOP23 voraus.
      if (!aktion && dtSoll !== null) {
        ohne = pm && pm.modus === "dt" ? tf(t("an_ov_sp_dt"), { s: z(dtSoll, 0) }) : t("an_ov_sp_unbekannt");
      }
    } else if (sp > spMax && dtSoll !== null) {
      ohne = t("an_ov_sp_gross");
    }
    return { aktion, ohne };
  },

  /** Alle Pruefpunkte berechnen. */
  _anPruefen() {
    const d = this._auswertung;
    // Laeufe ueber SG Ready (Stufe 3 oder 4) zaehlen in keiner Bewertung.
    const laeufe = (d ? this._auswertungLaeufe(d) : []).filter((l) => !l.sg);
    const heizLaeufe = laeufe.filter((l) => !l.ww && !l.angeschnitten && !l.luecke && l.minuten >= 10);
    // Richtwerte je Tag gelten bei laengeren Zeitraeumen im Mittel.
    const tage = d ? Math.max((d.t1 - d.t0) / 86400000, 1) : 1;
    const flaechen = this._anHeizflaechen();
    const puffer = this._anMitPuffer();
    const zonen = this._anZonen();
    const punkte = [];
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    // Knopf, Tipp und "Kein Vorschlag" nur bei Gelb und Rot. Hat ein
    // solcher Punkt keinen Vorschlag, steht dort warum.
    const punkt = (p) => {
      const q = { text: "", tipp: "", wertText: "", richt: "", aktion: null, ohne: "", ...p };
      if (!AUFFAELLIG.includes(q.stufe)) {
        q.aktion = null;
        q.ohne = "";
        q.tipp = "";
      } else if (q.aktion) q.ohne = "";
      else if (!q.ohne) q.ohne = t("an_ov_allg");
      punkte.push(q);
    };
    const gewichtet = (ls, wert) => {
      const dauer = ls.reduce((s, l) => s + l.minuten, 0);
      return dauer ? ls.reduce((s, l) => s + wert(l) * l.minuten, 0) / dauer : null;
    };

    /* ---------- Heizbetrieb ---------- */
    // Spreizung im Heizbetrieb, je Lauf ab der fuenften Minute. Mit Puffer
    // ist das die Spreizung des Waermepumpenkreises.
    const dtSoll = this._anWert("heat_delta");
    const { toleranz } = this._anSpGrenzen();
    const mitSpreizung = heizLaeufe.filter((l) => l.vorlauf !== null && l.ruecklauf !== null);
    const richtSp = t(puffer ? "an_r_sp_p" : toleranz ? "an_r_sp_hk" : "an_r_sp_fbh");
    if (mitSpreizung.length) {
      const sp = gewichtet(mitSpreizung, (l) => l.vorlauf - l.ruecklauf);
      const { stufe, text } = this._anSpStufe(sp);
      const { aktion, ohne } = this._anSpVorschlag(sp);
      const tippSchluessel = sp < 5 ? (puffer ? "an_tip_sp_klein_p" : "an_tip_sp_klein") : puffer ? "an_tip_sp_gross_p" : "an_tip_sp_gross";
      punkt({
        gruppe: "heiz", id: "spreizung", stufe, titel: t("an_t_spreizung"), wert: `${z(sp)} K`,
        wertText: dtSoll !== null ? tf(t("an_w_sp_soll"), { s: z(dtSoll, 0) }) : t("an_w_sp"),
        richt: richtSp, text: t(text), tipp: t(tippSchluessel), quelle: ["spreizung", "pumpe"],
        aktion, ohne,
      });
    } else {
      punkt({ gruppe: "heiz", id: "spreizung", stufe: "unbekannt", titel: t("an_t_spreizung"), wert: "--", richt: richtSp,
        text: t("an_kein_heizlauf"), quelle: "spreizung" });
    }

    // Vorlauf: mit Puffer im Heizkreis (TOP36/37), denn die Waermepumpe
    // faehrt absichtlich hoeher; ohne Puffer am Ausgang der Waermepumpe.
    const vlKreise = puffer
      ? zonen
        .map((n) => {
          const feld = n === 2 ? "kreis2" : "kreis1";
          const mit = heizLaeufe.filter((l) => l[feld] !== null);
          if (!mit.length) return null;
          const hoechst = mit.reduce((a, l) => (l[feld] > a[feld] ? l : a), mit[0]);
          const art = this._anFlaecheVon(n);
          const gr = GRENZE[art];
          const v = hoechst[feld];
          return { n, art, gr, v, aussen: hoechst.aussen, stufe: vlStufe(v, gr) };
        })
        .filter(Boolean)
      : [];
    if (vlKreise.length) {
      const schlimm = vlKreise.reduce((a, b) =>
        RANG[b.stufe] > RANG[a.stufe] || (RANG[b.stufe] === RANG[a.stufe] && b.v - b.gr.gut > a.v - a.gr.gut) ? b : a);
      const zuHoch = vlKreise.filter((k) => AUFFAELLIG.includes(k.stufe));
      punkt({
        gruppe: "heiz", id: "vorlauf", stufe: schlimm.stufe, titel: t(schlimm.art === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"),
        wert: `${z(schlimm.v, 0)} °C`,
        wertText: schlimm.aussen !== null ? tf(t("an_w_vl_kreis"), { n: schlimm.n, a: z(schlimm.aussen) }) : `HK${schlimm.n}`,
        richt: t(schlimm.art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        text: `${t(vlText(schlimm.stufe, schlimm.art))} ${t("an_vl_puffer")}`,
        tipp: t("an_tip_vl"), quelle: "vorlauf",
        aktion: zuHoch.length
          ? this._anVorschlag(
            zuHoch.flatMap((k) => this._anKurvenSchritt(k.n, "parallel")),
            tf(t("an_g_vl"), { v: z(schlimm.v, 0), r: t(schlimm.art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk") })
          )
          : null,
      });
    } else {
      const grenze = flaechen === "fbh" ? GRENZE.fbh : GRENZE.hk;
      const mitVl = heizLaeufe.filter((l) => l.vorlauf !== null);
      const richtVl = t(flaechen === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk");
      if (mitVl.length) {
        const hoechst = mitVl.reduce((a, l) => (l.vorlauf > a.vorlauf ? l : a), mitVl[0]);
        const vl = hoechst.vorlauf;
        const stufe = vlStufe(vl, grenze);
        punkt({
          gruppe: "heiz", id: "vorlauf", stufe, titel: t(flaechen === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"), wert: `${z(vl, 0)} °C`,
          wertText: hoechst.aussen !== null ? tf(t("an_w_vl"), { a: z(hoechst.aussen) }) : "",
          richt: richtVl,
          text: t(vlText(stufe, flaechen === "fbh" ? "fbh" : "hk"))
            + (flaechen === "gemischt" ? ` ${t("an_vl_gemischt")}` : ""),
          tipp: t("an_tip_vl"), quelle: "vorlauf",
          aktion: AUFFAELLIG.includes(stufe)
            ? this._anVorschlag(zonen.flatMap((n) => this._anKurvenSchritt(n, "parallel")), tf(t("an_g_vl"), { v: z(vl, 0), r: richtVl }))
            : null,
        });
      } else {
        punkt({ gruppe: "heiz", id: "vorlauf", stufe: "unbekannt", titel: t(flaechen === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"),
          wert: "--", richt: richtVl, text: t("an_kein_heizlauf"), quelle: "vorlauf" });
      }
    }

    // Heizkurve: eingestellter Vorlauf am kalten Ende, je aktivem Heizkreis.
    zonen.forEach((n) => {
      const pre = n === 2 ? "curve2_" : "curve_";
      const kurveVl = this._anWert(`${pre}t_high`);
      const kurveAussen = this._anWert(`${pre}o_low`);
      if (kurveVl === null) return;
      const art = this._anFlaecheVon(n);
      const gr = GRENZE[art];
      const stufe = vlStufe(kurveVl, gr);
      const richt = t(art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk");
      punkt({
        gruppe: "heiz", id: `kurve${n}`, stufe, titel: zonen.length > 1 ? tf(t("an_t_kurve_n"), { n }) : t("an_t_kurve"),
        wert: `${z(kurveVl, 0)} °C`,
        wertText: kurveAussen !== null ? tf(t("an_w_kurve"), { a: z(kurveAussen, 0) }) : "",
        richt, text: t(stufe === "ok" ? "an_kurve_ok" : stufe === "leicht" ? "an_kurve_alt" : "an_kurve_hoch"),
        tipp: t("an_tip_kurve"), quelle: "vorlauf",
        aktion: AUFFAELLIG.includes(stufe)
          ? this._anVorschlag(this._anKurvenSchritt(n, "kalt", gr.gut), tf(t("an_g_kurve"), { v: z(kurveVl, 0), r: richt }))
          : null,
      });
    });

    // Puffer: wie weit die Waermepumpe ueber dem Heizkreis faehrt. Nur
    // Messwert, denn fuer diesen Abstand nennt keine Quelle eine Grenze.
    const pufferDt = this._anWert("buffer_delta");
    const mitKreis = heizLaeufe.filter((l) => l.vorlauf !== null && (l.kreis1 !== null || l.kreis2 !== null));
    if (puffer && mitKreis.length) {
      const abstand = gewichtet(mitKreis, (l) => l.vorlauf - Math.max(...[l.kreis1, l.kreis2].filter((v) => v !== null)));
      punkt({
        gruppe: "heiz", id: "puffer", stufe: "info", titel: t("an_t_puffer"), wert: `${z(abstand)} K`,
        wertText: pufferDt !== null ? tf(t("an_w_puffer"), { d: z(pufferDt, 0) }) : t("an_w_puffer_o"),
        text: tf(t("an_pu_info"), { g: z(abstand) }) + (pufferDt !== null && pufferDt > 0 ? ` ${tf(t("an_pu_dt"), { d: z(pufferDt, 0) })}` : ""),
        quelle: "puffer",
      });
    }

    // Taktung nach dem Ziel von 10 bis 20 Minuten je Start. Der
    // Startzaehler TOP12 dient als Abgleich.
    const bewertet = laeufe.filter((l) => !l.laufend && !l.angeschnitten && !l.luecke);
    const zaehler = (() => {
      const r = d && d.starts ? d.starts.filter((p) => Number.isFinite(p.v)) : [];
      if (r.length < 2) return null;
      // Stand zu Beginn des Zeitraums, nicht der erste Wechsel danach.
      const diff = r[r.length - 1].v - r[Math.max(0, indexBis(r, d.t0))].v;
      return diff >= 0 ? diff : null;
    })();
    const tk = taktStufe(bewertet);
    if (tk) {
      const n = laeufe.filter((l) => !l.angeschnitten).length;
      const werte = { k: tk.kurz, n: bewertet.length, d: z(tk.mittel, 0) };
      punkt({
        gruppe: "heiz", id: "taktung", stufe: tk.stufe, titel: t("an_t_taktung"),
        wert: tage > 1.5 ? `${tf(t("an_w_starts"), { n })} · ${fmt(n / tage, 0)}/d` : tf(t("an_w_starts"), { n }),
        wertText: tf(t("an_w_lauf"), { d: z(tk.mittel, 0) }) + (zaehler !== null ? ` · ${tf(t("an_w_zaehler"), { z: zaehler })}` : ""),
        richt: t("an_r_taktung"),
        text: tk.stufe === "ok" ? t("an_tk_ok") : tf(t(tk.stufe === "leicht" ? "an_tk_einzeln" : "an_tk_kurz"), werte),
        tipp: t(puffer ? "an_tip_taktung_p" : "an_tip_taktung"), quelle: "taktung", ohne: t("an_ov_taktung"),
      });
    } else {
      punkt({ gruppe: "heiz", id: "taktung", stufe: "unbekannt", titel: t("an_t_taktung"), wert: "--", richt: t("an_r_taktung"),
        text: t(d ? "a_keine_laeufe" : "an_keine_daten"), quelle: "taktung" });
    }

    // COP der Heizlaeufe gegenueber dem Datenblatt des im Editor gewaehlten
    // Geraets: alle bewerteten Laeufe ab 92 % in Ordnung; einzelne darunter
    // bei einem Mittel ab 92 % leichte Abweichung, ein Mittel darunter
    // ausserhalb der Toleranz (Aufteilung wie bei der Taktung, eigene
    // Festlegung). Ohne Datenblatt oder Lauf im Bereich der Pruefpunkte nur
    // Messwert.
    const heizCop = laeufe.filter((l) => !l.ww && l.cop !== null);
    if (heizCop.length) {
      // Waerme durch Strom der Heizlaeufe; ohne Energiewerte das Mittel
      // nach Laufzeit.
      const summe = copSumme(heizCop, "heiz");
      const c = summe !== null ? summe : gewichtet(heizCop, (l) => l.cop);
      const copText = t(summe !== null ? "an_w_cop" : "an_w_cop_zeit");
      const ref = this._copReferenz();
      const bewertet = heizCop.filter((l) => copStufe(l));
      if (ref && bewertet.length) {
        const q = gewichtet(bewertet, (l) => l.copQuote);
        const u = bewertet.filter((l) => copStufe(l) === "unter").length;
        const stufe = q < TOLERANZ ? "hinweis" : u ? "leicht" : "ok";
        punkt({
          gruppe: "heiz", id: "cop", stufe, titel: t("an_t_cop"), wert: z(c),
          wertText: `${copText} · ${tf(t("an_w_cop_dbl"), { p: z(q * 100, 0) })}`, richt: t("an_r_cop"),
          text: tf(t(u ? "an_cop_unter" : "an_cop_ok"), { u, n: bewertet.length }),
          quelle: ["cop", "keymark"], ohne: t("an_ov_cop"),
        });
      } else {
        punkt({
          gruppe: "heiz", id: "cop", stufe: "info", titel: t("an_t_cop"), wert: z(c), wertText: copText,
          text: t(ref ? "an_cop_ohne_punkte" : "an_cop_ohne_ref"), quelle: "",
        });
      }
    } else {
      punkt({ gruppe: "heiz", id: "cop", stufe: "unbekannt", titel: t("an_t_cop"), wert: "--", text: t("an_cop_ohne"), quelle: "" });
    }

    /* ---------- Zusatzheizung und Abtauung ---------- */
    const stabGrenze = this._anWert("heater_on_temp");
    if (stabGrenze !== null) {
      const stufe = stabGrenze <= -3 ? "ok" : "hinweis";
      punkt({
        gruppe: "zusatz", id: "bivalenz", stufe, titel: t("an_t_bivalenz"), wert: `${z(stabGrenze, 0)} °C`,
        wertText: t("an_w_bivalenz"), richt: t("an_r_bivalenz"), text: t(stufe === "ok" ? "an_biv_ok" : "an_biv_hoch"),
        tipp: t("an_tip_bivalenz"), quelle: "bivalenz",
        aktion: stufe === "ok"
          ? null
          : this._anVorschlag(
            [this._anAenderung("heater_on_temp", -5, "SetHeaterOnOutdoorTemp", "°C")],
            tf(t("an_g_biv"), { v: z(stabGrenze, 0) }),
            t("an_g_biv_h")
          ),
      });
    }
    if (d && (d.stabIntern.length || d.stabExtern.length)) {
      // Nur Heizbetrieb: TOP60 meldet den Heizstab auch beim Warmwasser.
      const zeiten = anZeiten(d.stabIntern, d.aussen, d.t0, d.t1, d.ventil).concat(anZeiten(d.stabExtern, d.aussen, d.t0, d.t1, d.ventil));
      const gesamt = zeiten.reduce((s, x) => s + x.minuten, 0);
      const warm = zeiten.filter((x) => x.aussen !== null && x.aussen > 0).reduce((s, x) => s + x.minuten, 0);
      const ohneAussen = zeiten.filter((x) => x.aussen === null).reduce((s, x) => s + x.minuten, 0);
      // In Ordnung nur, wenn er sicher nie bei Plusgraden lief. Sonst nur
      // Messwert: Fuer "laengere Zeit" nennt die Quelle keine Minuten.
      const sicher = warm === 0 && ohneAussen === 0;
      punkt({
        gruppe: "zusatz", id: "heizstab", stufe: sicher ? "ok" : "info", titel: t("an_t_heizstab"), wert: `${z(gesamt, 0)} min`,
        wertText: tf(t("an_w_heizstab"), { w: z(warm, 0) }), richt: t("an_r_heizstab"),
        text: gesamt === 0 ? t("an_hs_aus") : sicher ? t("an_hs_ok") : tf(t("an_hs_info"), { w: z(warm, 0) }),
        quelle: "heizstab",
      });
    }
    if (d && d.abtau.length) {
      // Wie im Reiter Abtauen: angeschnittene und laufende Abtauungen zaehlen
      // mit, gehen aber nicht in die mittlere Dauer ein.
      const zeiten = abtauungen(d);
      const ganz = zeiten.filter((x) => !x.vorher && !x.laeuft);
      if (!zeiten.length) {
        punkt({ gruppe: "zusatz", id: "abtauung", stufe: "ok", titel: t("an_t_abtauung"), wert: "0×", richt: t("an_r_abtauung"),
          text: t("an_ab_keine"), quelle: "abtauung" });
      } else if (ganz.length) {
        const m = ganz.reduce((s, x) => s + x.minuten, 0) / ganz.length;
        const temps = zeiten.filter((x) => x.aussen !== null).map((x) => x.aussen);
        // Ueber +5 °C liegt ausserhalb des Bereichs, in dem der Verdampfer
        // am haeufigsten vereist; das ist ein Hinweis, keine Bewertung.
        const plus = temps.some((w) => w > 5);
        const stufe = m > 15 ? "hinweis" : "ok";
        punkt({
          gruppe: "zusatz", id: "abtauung", stufe, titel: t("an_t_abtauung"), wert: `${zeiten.length}×`,
          wertText: temps.length
            ? tf(t("an_w_abtau"), { d: z(m, 0), a: z(Math.min(...temps), 0), b: z(Math.max(...temps), 0) })
            : tf(t("an_w_abtau_d"), { d: z(m, 0) }),
          richt: t("an_r_abtauung"), text: t(m > 15 ? "an_ab_lang" : "an_ab_ok") + (plus ? ` ${t("an_ab_plus")}` : ""),
          tipp: t("an_tip_abtauung"), quelle: "abtauung", ohne: t("an_ov_abtauung"),
        });
      }
    }

    /* ---------- Warmwasser und Anlage ---------- */
    // Der Speicher faellt bis Soll plus Schaltdifferenz (TOP22, negativ),
    // erst dann wird nachgeladen. Ab 55 °C in Ordnung (UBA), darunter
    // ausserhalb der Empfehlung, unter 50 °C pruefen (DVGW).
    const wwSoll = this._anWert("dhw_setpoint");
    const wwDelta = this._anWert("dhw_heat_delta");
    const steril = this._anWert("steril_temp");
    if (wwSoll !== null) {
      const schritt = wwDelta !== null ? Math.abs(wwDelta) : null;
      const tief = schritt !== null ? wwSoll - schritt : null;
      const basis = tief !== null ? tief : wwSoll;
      const sollId = this._e("dhw_setpoint");
      const sollSt = sollId && this._quelle.states ? this._quelle.states[sollId] : null;
      const sollMax = sollSt && sollSt.attributes && Number.isFinite(Number(sollSt.attributes.max)) ? Math.min(Number(sollSt.attributes.max), 65) : 65;
      let stufe = "ok";
      if (basis < 50) stufe = "pruefen";
      else if (basis < 55) stufe = "hinweis";
      const satz = tief !== null
        ? tf(t("an_ww_satz_tief"), { s: z(wwSoll, 0), d: z(-schritt, 0), m: z(tief, 0) })
        : tf(t("an_ww_satz_soll"), { m: z(wwSoll, 0) });
      const urteil = t({ ok: "an_ww_q_ok", hinweis: "an_ww_q_unter", pruefen: "an_ww_q_kritisch" }[stufe]);
      let aktion = null;
      if (stufe !== "ok") {
        // Erst das Soll anheben, hoechstens bis zur Grenze des Speichers;
        // reicht das nicht, die Schaltdifferenz verkleinern (-2 bis -12 K).
        let neuSoll = Math.min(sollMax, Math.max(wwSoll, 55 + (schritt || 0)));
        let neuDelta = wwDelta;
        if (schritt !== null && neuSoll - schritt < 55) neuDelta = -Math.min(12, Math.max(2, neuSoll - 55));
        if (neuSoll < 55) neuSoll = 55;
        const tiefNeu = neuDelta !== null ? neuSoll - Math.abs(neuDelta) : neuSoll;
        aktion = this._anVorschlag(
          [this._anAenderung("dhw_setpoint", neuSoll, "SetDHWTemp", "°C"),
            wwDelta !== null && neuDelta !== wwDelta ? this._anAenderung("dhw_heat_delta", neuDelta, "SetDHWHeatDelta", "K") : null],
          tf(t("an_g_ww"), { m: z(basis, 0), n: z(tiefNeu, 0) })
        );
      }
      const teile = [tief !== null ? tf(t("an_w_ww_tief"), { m: z(tief, 0) }) : t("an_w_ww_soll")];
      if (steril !== null) teile.push(tf(t("an_w_steril"), { s: z(steril, 0) }));
      punkt({
        gruppe: "anlage", id: "warmwasser", stufe, titel: t("an_t_warmwasser"), wert: `${z(wwSoll, 0)} °C`,
        wertText: teile.join(" · "), richt: t("an_r_warmwasser"), text: `${satz} ${urteil}`,
        tipp: t(tief !== null ? "an_tip_ww_tief" : "an_tip_ww_niedrig"), quelle: ["warmwasser", "legionellen"], aktion,
      });
    }
    // 0 bar heisst: kein Sensor (TOP115 gibt es nur bei K- und L-Serie).
    const druck = this._anWert("water_pressure");
    if (druck !== null && druck > 0.05) {
      const stufe = druck >= 1.2 && druck <= 2.0 ? "ok" : "hinweis";
      punkt({
        gruppe: "anlage", id: "druck", stufe, titel: t("an_t_druck"), wert: `${z(druck)} bar`, richt: t("an_r_druck"),
        text: t(stufe === "ok" ? "an_dr_ok" : druck < 1.2 ? "an_dr_niedrig" : "an_dr_hoch"),
        tipp: t(druck < 1.2 ? "an_tip_dr_niedrig" : "an_tip_dr_hoch"), quelle: "druck", ohne: t("an_ov_druck"),
      });
    }
    // JAZ seit 1. Januar: nur Messwert, Vergleichswerte stehen dabei.
    const jaz = this._config.demo ? { jaz: 4.3 } : this._jaz && this._jaz.gesamt;
    if (jaz && Number.isFinite(jaz.jaz)) {
      punkt({
        gruppe: "anlage", id: "jaz", stufe: "info", titel: t("an_t_jaz"), wert: z(jaz.jaz), wertText: t("an_w_jaz"), richt: t("an_r_jaz"),
        text: t("an_jaz_hinweis"), quelle: "jaz",
      });
    }
    const err = rawState(this._quelle, this._e("error"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    if (this._e("error")) {
      const stoerung = err !== null && !harmlos.includes(err);
      punkt({
        gruppe: "anlage", id: "stoerung", stufe: stoerung ? "pruefen" : "ok", titel: t("an_t_stoerung"),
        wert: stoerung ? err : t("an_keine"), text: t(stoerung ? "an_st_ja" : "an_st_nein"),
        tipp: t("an_tip_stoerung"), quelle: "", ohne: t("an_ov_stoerung"),
      });
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
    this._anPunkte = punkte;
    const zahl = { ok: 0, leicht: 0, hinweis: 0, pruefen: 0, info: 0, unbekannt: 0 };
    punkte.forEach((p) => zahl[p.stufe]++);
    const bewertet = BEWERTET.reduce((s, k) => s + zahl[k], 0);
    const offen = punkte.filter((p) => p.stufe === "pruefen").concat(punkte.filter((p) => p.stufe === "hinweis"));
    // Urteil nur aus den bewerteten Punkten, ohne Wertung darueber hinaus.
    let titel = "an_g_gut";
    let n = 0;
    if (!bewertet) titel = "an_g_leer";
    else if (zahl.pruefen) [titel, n] = ["an_g_pruefen", zahl.pruefen + zahl.hinweis];
    else if (zahl.hinweis) [titel, n] = ["an_g_hinweis", zahl.hinweis];
    else if (zahl.leicht) [titel, n] = ["an_g_leicht", zahl.leicht];
    const potenzial = offen.slice(0, 3).map((p) => p.titel).join(", ");

    // Ring mit den Anteilen der bewerteten Stufen; die Zahl in der Mitte
    // zaehlt "in Ordnung" und "leichte Abweichung".
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
    const zaehler = BEWERTET.map((k) => [STUFEN[k].css, zahl[k], STUFEN[k].zahl])
      .concat([["var(--c-7e8ca0)", zahl.info + zahl.unbekannt, "an_z_ohne"]]);
    const kopf = `<div class="lhc-an-gesamt">
        <svg viewBox="0 0 84 84" class="lhc-an-ring"><circle cx="42" cy="42" r="34" fill="none" stroke="#26303F" stroke-width="10"/>${ring}
          <text x="42" y="48" text-anchor="middle" font-size="18" font-weight="700" fill="#E8EDF4">${zahl.ok + zahl.leicht}/${bewertet}</text></svg>
        <div class="lhc-an-urteil"><b>${escapeHtml(tf(this._t(titel), { n: tf(this._t(n === 1 ? "an_n_1" : "an_n_n"), { n }) }))}</b>
          ${potenzial ? `<span>${escapeHtml(tf(this._t("an_g_potenzial"), { p: potenzial }))}</span>` : ""}</div>
        <div class="lhc-an-zahlen">${zaehler
          .map(([farbe, wert, text]) => `<div><b style="color:${farbe}">${wert}</b><span>${escapeHtml(this._t(text))}</span></div>`)
          .join("")}</div>
      </div>`;

    const quellenHtml = (q) =>
      []
        .concat(q || [])
        .map((k) => QUELLEN[k])
        .filter(Boolean)
        .map((x) => `<a href="${escapeHtml(x[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(x[0])}</a>`)
        .join(" · ");
    const gruppen = [["heiz", "an_gr_heiz"], ["zusatz", "an_gr_zusatz"], ["anlage", "an_gr_anlage"]];
    const karten = gruppen
      .map(([g, tt]) => {
        const inGruppe = punkte.filter((p) => p.gruppe === g);
        if (!inGruppe.length) return "";
        return `<div class="lhc-an-gruppe">${escapeHtml(this._t(tt))}</div><div class="lhc-an-raster">${inGruppe
          .map((p) => {
            const st = STUFEN[p.stufe];
            const q = quellenHtml(p.quelle);
            const nr = punkte.indexOf(p);
            // Bewertete Stufen mit Flaeche, "nur Messwert" und "keine Daten"
            // nur umrandet und ohne farbigen Rand an der Karte.
            const chip = st.neutral
              ? `<i class="neutral" style="color:${st.css}">`
              : `<i style="color:${st.css};background:color-mix(in srgb, ${st.css} 14%, transparent)">`;
            return `<div class="lhc-an-karte" data-stufe="${p.stufe}" style="border-left-color:${st.neutral ? "var(--c-3a4557)" : st.css}">
                <div class="lhc-an-kopf"><b>${escapeHtml(p.titel)}</b>
                  ${chip}${st.zeichen} ${escapeHtml(this._t(st.text))}</i></div>
                <div class="lhc-an-wert"><span><b>${escapeHtml(p.wert)}</b> ${escapeHtml(p.wertText || "")}</span>
                  ${p.richt ? `<span>${escapeHtml(this._t(p.stufe === "info" ? "an_vergleich" : "an_richtwert"))} <b>${escapeHtml(p.richt)}</b></span>` : ""}</div>
                ${p.text ? `<p>${escapeHtml(p.text)}</p>` : ""}
                ${p.tipp ? `<p class="lhc-an-tipp">${escapeHtml(p.tipp)}</p>` : ""}
                ${p.aktion ? `<button type="button" class="lhc-an-knopf" data-vorschlag="${nr}">⚙ ${escapeHtml(this._t("an_opt_knopf"))}</button>` : ""}
                ${!p.aktion && p.ohne ? `<p class="lhc-an-ohne">${escapeHtml(p.ohne)}</p>` : ""}
                ${q ? `<div class="lhc-an-quelle">${escapeHtml(this._t("an_quelle"))}: ${q}</div>` : ""}
              </div>`;
          })
          .join("")}</div>`;
      })
      .join("");
    liste.innerHTML = `<div class="lhc-an">${kopf}${karten}
      <p class="lhc-takt-quelle">${escapeHtml(this._t("an_fuss"))}</p></div>`;
    liste.querySelectorAll("[data-vorschlag]").forEach((b) => {
      b.addEventListener("click", () => {
        const p = this._anPunkte && this._anPunkte[Number(b.dataset.vorschlag)];
        if (p && p.aktion) this._zeigeVorschlag(p);
      });
    });
  },
};
