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
 *  - Bivalenzpunkt der Anlage: aus Heizlast, Norm-Aussentemperatur des
 *    Standorts und Heizleistung der Waermepumpe (Editor) und der Heizgrenze
 *    TOP77, siehe _anBivalenz (BWP-Leitfaden Waermepumpendimensionierung,
 *    BWP-Klimakarte nach DIN/TS 12831-1, 42watt "Bivalenzpunkt"). Feste
 *    Bereiche wie -3 bis -7 °C sind Planungswerte und werden nicht benutzt.
 *  - Heizleistung, Auslegung: Leistungsanteil nach BWP-Leitfaden (Heizleistung
 *    bei Norm-Aussentemperatur / Norm-Heizlast, empfohlen 50 bis 80 %, mit
 *    dem Wert bei -7 °C 70 bis 90 %); unter 50 % (70 %) Hinweis mit den
 *    fehlenden kW, darueber in Ordnung ohne Hinweis (Vorgabe des Nutzers).
 *    Dazu der Anteil des Heizstabs an der Heizwaerme im Jahr
 *    nach dem Bin-Verfahren der EN 14825 (Heizlastgerade, die Waermepumpe
 *    deckt bis zu ihrer Heizleistung, den Rest der Heizstab mit COP 1;
 *    Energistyrelsen 2011). Statt der Stunden des Referenzklimas zaehlen die
 *    Stundenmittel der Aussentemperatur der letzten 365 Tage aus der
 *    Langzeitstatistik, mindestens 8000 von 8760 (eigene Festlegung). Ein
 *    Hoechstanteil ist keine Norm; bewertet wird nur gegen den Wert im
 *    Editor. Zu klein: Hinweis mit der noetigen Heizleistung.
 *  - Heizstab, Einschaltgrenze (TOP78): in Ordnung, wenn weniger als 1 K vom
 *    Bivalenzpunkt. Zu hoch: Der Heizstab laeuft, wo die Waermepumpe allein
 *    reicht; zu tief: Raeume koennen kuehl werden (42watt "Bivalenzpunkt").
 *    Fehlen Angaben, nur Messwert.
 *  - Heizstab, Laufzeit: Hinweis, wenn er ueber dem Bivalenzpunkt lief;
 *    dort reicht die Waermepumpe laut den Angaben allein, und der Heizstab
 *    macht aus 1 kWh Strom 1 kWh Waerme (42watt "Heizstab"). Fehlen
 *    Angaben, nur Messwert. TOP60 meldet den Heizstab fuer Raum oder
 *    Warmwasser (HeishaMon ProtocolByteDecrypt), darum zaehlen nur Zeiten im
 *    Heizbetrieb.
 *  - Abtauung typischerweise 5 bis 15 min, am haeufigsten bei -5 bis +5 °C
 *    (42watt "Abtauen"). Eine Temperaturgrenze fuer "deutliche Plusgrade"
 *    nennt die Quelle nicht, darum dort nur ein Hinweis ohne Bewertung.
 *  - Warmwasser: Fuer private Ein- und Zweifamilienhaeuser gibt es keine
 *    festen Vorschriften, das Umweltbundesamt empfiehlt 55 bis 60 °C
 *    (Trinkwarmwasserkonzepte, 1.11.2023). Ohne Zirkulation sehen die
 *    technischen Regeln dort eine untere Betriebstemperatur von 50 °C vor
 *    (DVGW, 3/2023). Der Speicher faellt bis Soll plus TOP22 (negativ),
 *    bevor nachgeladen wird. Einzelheiten beim Punkt Warmwasser.
 *  - Anlagendruck: bewertet wird der Verlauf im Zeitraum, Grenzen von
 *    Panasonic und Reflex, Einzelheiten beim Punkt Anlagendruck.
 *    TOP115 gibt es laut HeishaMon nur bei der K- und L-Serie; 0 bar gilt
 *    als kein Messwert (eigene Festlegung).
 *  - JAZ: aus Werten der Waermepumpe seit 1. Januar, nur eingeschraenkt
 *    mit gemessenen Jahreswerten vergleichbar: nur Messwert.
 */
import { fmt, indexBis, numState, rawState, stellbar } from "../hilfsfunktionen.js";
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
  pana_m_ww: ["Panasonic: Aquarea T-CAP M, Katalog 2026, S. 21: Warmwasser (nur All-in-One 185 l)", "https://cdn.aircon.panasonic.eu/uploads/DE/Catalogues/2026/26_0006_DE-LFLTAQM_26-01_V3.pdf"],
  keymark: ["HP KEYMARK, Annex A: Toleranz COP −8 %", "https://www.dincertco.de/media/dincertco/dokumente_1/certification_schemes/w%C3%A4rmepumpen_heat-pump_keymark_annex-a.pdf"],
  wirkungsgrad: ["42watt: Wirkungsgrad (COP, Carnot)", "https://42watt.de/magazin/wirkungsgrad-warmepumpe"],
  bivalenz: ["42watt: Bivalenzpunkt", "https://42watt.de/magazin/bivalenzpunkt-warmepumpe-einfach-erklart"],
  bwp_dim: ["BWP: Leitfaden Wärmepumpendimensionierung", "https://www.waermepumpe.de/fileadmin/user_upload/waermepumpe/07_Publikationen/BWP_LF_WPDimensionierung.pdf"],
  heizstab: ["42watt: Heizstab", "https://42watt.de/magazin/heizstab-warmepumpe"],
  en14825: ["Energistyrelsen: SCOP nach EN 14825 (Bin-Verfahren)", "https://ens.dk/media/718/download"],
  abtauung: ["42watt: Abtauen", "https://42watt.de/magazin/warmepumpe-abtauen"],
  warmwasser: ["Umweltbundesamt: Trinkwarmwasserkonzepte (2023)", "https://www.umweltbundesamt.de/sites/default/files/medien/11850/publikationen/factsheet_trinkwarmwasserkonzepte.pdf"],
  dvgw_ww: ["DVGW: Energieeinsparungen im Warmwasserbereich (2023)", "https://www.dvgw.de/medien/dvgw/leistungen/publikationen/energiesparen-warmwasser-dvgw-langfassung.pdf"],
  legionellen: ["Bundestag WD 8-3000-021/23 (DVGW)","https://bundestag.de/resource/blob/947272/cc7cce64da5a0983382949ac996e72ff/WD-8-021-23-pdf-data.pdf"],
  druck: ["Panasonic Aquarea Bedienungsanleitung (2022), S. 17: Wasserdruck 0,05 bis 0,3 MPa", "https://www.panasonicproclub.com/uploads/GB/catalogues/2023/FINAL%20A2W%20END%20USER_MANUAL_2022.pdf"],
  pana_m_druck: ["Panasonic Servicehandbuch M-Serie (WH-WXG..ME8, 07/2024), S. 99: Normalbetrieb 0,5 bis 4 bar", "https://klimavex.eu/disk/atsubory/85/locked82227/SER-P-A2W-ADC0316_WXG0916_M_E8-0724-EN.pdf"],
  hm_modell: ["HeishaMon: HeatPumpType (TOP92, Modell)", "https://github.com/heishamon/HeishaMon/blob/main/HeatPumpType.md"],
  jaz: ["42watt: Jahresarbeitszahl (BEG, Fraunhofer)", "https://42watt.de/magazin/jahresarbeitszahl"],
  ez_heizkurve: ["EnergieSchweiz, Stadt Zürich: Faktenblatt Wärmepumpe, Heizkurve (2023)", "https://www.ewz.ch/content/dam/stzh/energie/Startseite/beratung-froerderung/Faktenblatt_Waermepumpe-Heizkurve.pdf"],
  uba_raum: ["Umweltbundesamt: Heizen, Raumtemperatur", "https://www.umweltbundesamt.de/umwelttipps-fuer-den-alltag/heizen-bauen/heizen-raumtemperatur"],
  pana_ww: ["Panasonic Servicehandbuch WH-MXC16J9E8: Tank heat up time (max)", "https://www.taloon.com/media/attachments/PANWH-MXC16J9E8_Huolto_1.pdf"],
  hm_topics: ["HeishaMon: MQTT-Topics (TOP144 bis TOP198, Topic-Gruppen)", "https://github.com/heishamon/HeishaMon/blob/main/MQTT-Topics.md"],
  hm_firmware: ["HeishaMon: aktuelle Produktionsversion", "https://github.com/heishamon/HeishaMon/tree/main/binaries"],
  integration: ["HeishaMon by Lutarym: Betriebsanalyse", "https://github.com/Lutarym/Heishamon-by-Lutarym"],
};

/*
 * Stufen mit Zeichen und Text, die Farbe steht nie allein. farbe ist der
 * Hexwert fuer SVG (die Themen ersetzen ihn), css der Wert fuer HTML.
 * Grau fuer "leicht" ist bewusst keine Vorstufe von Rot.
 */
export const STUFEN = {
  ok: { farbe: "#22C55E", css: "#22C55E", zeichen: "✓", text: "an_ok", zahl: "an_z_ok" },
  leicht: { farbe: "#98A6BA", css: "var(--c-98a6ba)", zeichen: "ⓘ", text: "an_leicht", zahl: "an_z_leicht" },
  hinweis: { farbe: "#F59E0B", css: "#F59E0B", zeichen: "!", text: "an_hinweis", zahl: "an_z_hinweis" },
  pruefen: { farbe: "#EF4444", css: "#EF4444", zeichen: "✕", text: "an_pruefen", zahl: "an_z_pruefen" },
  info: { farbe: "#7E8CA0", css: "var(--c-98a6ba)", zeichen: "◦", text: "an_info", neutral: true },
  unbekannt: { farbe: "#7E8CA0", css: "var(--c-7e8ca0)", zeichen: "?", text: "an_unbekannt", neutral: true },
};

/** Stufen mit Bewertung, in der Reihenfolge von gut nach schlecht. */
export const BEWERTET = ["ok", "leicht", "hinweis", "pruefen"];

/** Nur bei diesen Stufen gibt es Tipp und "Kein Vorschlag". */
export const AUFFAELLIG = ["hinweis", "pruefen"];

/**
 * Knopf "Optimieren" bei jeder Abweichung, also auch bei Grau, sofern es
 * eine belegte Einstellung gibt (ab 5.32.3). Grau nennt seinen Schritt im
 * Feld schritt, Gelb und Rot zusaetzlich Tipp oder "Kein Vorschlag".
 */
export const MIT_KNOPF = ["leicht", "hinweis", "pruefen"];

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
export const RANG = { ok: 0, leicht: 1, hinweis: 2, pruefen: 3 };

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

/**
 * Anteil des Heizstabs an der Heizwaerme nach dem Bin-Verfahren der
 * EN 14825: je Stunde die Heizlast aus der Heizlastgeraden (Norm-Heizlast
 * bei Norm-Aussentemperatur, 0 kW an der Heizgrenze); die Waermepumpe deckt
 * bis zu ihrer Heizleistung, den Rest der Heizstab. Gibt 0 bis 1 oder null.
 */
export function stabAnteil(temps, last, nat, grenze, leistung) {
  let waerme = 0;
  let stab = 0;
  temps.forEach((t) => {
    if (!(t < grenze)) return;
    const l = (last * (grenze - t)) / (grenze - nat);
    waerme += l;
    if (l > leistung) stab += l - leistung;
  });
  return waerme > 0 ? stab / waerme : null;
}

/** Heizleistung in kW, bei der der Heizstab genau den Anteil ziel (0 bis 1) liefert. */
export function noetigeLeistung(temps, last, nat, grenze, ziel) {
  let lo = 0;
  let hi = 0;
  temps.forEach((t) => {
    if (t < grenze) hi = Math.max(hi, (last * (grenze - t)) / (grenze - nat));
  });
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    if (stabAnteil(temps, last, nat, grenze, m) > ziel) lo = m;
    else hi = m;
  }
  return hi;
}

/** Stundenwerte, die fuer die Jahresrechnung mindestens vorliegen muessen (eigene Festlegung). */
export const JAHR_MIN_STUNDEN = 8000;

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

  /**
   * Bivalenzpunkt aus den Angaben im Editor: Schnittpunkt der Heizlastgeraden
   * mit der Heizleistung der Waermepumpe. Die Heizlast faellt gerade von der
   * Norm-Heizlast bei Norm-Aussentemperatur auf 0 kW an der Heizgrenze
   * (BWP-Leitfaden Waermepumpendimensionierung, Abb. 5 und Glossar; Formel
   * nach 42watt "Bivalenzpunkt"). Heizleistung: Datenblattwert bei
   * Norm-Aussentemperatur und Vorlauftemperatur der Anlage, sonst bei -7 °C
   * (BWP-Leitfaden S. 14). Eigene Festlegungen: Die Heizleistung gilt als
   * gleichbleibend, und als Heizgrenze dient TOP77 "Heizen aus ab
   * Aussentemperatur".
   */
  _anBivalenz() {
    const zahl = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));
    const last = zahl(this._config.heat_load_kw);
    const nat = zahl(this._config.design_outdoor_temp);
    const wp = zahl(this._config.hp_capacity_kw);
    const grenze = this._anWert("heating_off_temp");
    const fehlt = [];
    if (!(last > 0)) fehlt.push("an_biv_f_last");
    if (!Number.isFinite(nat)) fehlt.push("an_biv_f_nat");
    if (!(wp > 0)) fehlt.push("an_biv_f_wp");
    if (grenze === null || (Number.isFinite(nat) && grenze <= nat)) fehlt.push("an_biv_f_grenze");
    if (fehlt.length) return { fehlt };
    return { punkt: grenze - (wp / last) * (grenze - nat), last, nat, wp, grenze, fehlt };
  },

  /**
   * Stundenmittel der Aussentemperatur der letzten 365 Tage aus der
   * Langzeitstatistik, fuer die Auslegung. Hoechstens einmal je Stunde.
   */
  async _ladeJahrAussen() {
    const id = this._e("outside_temp");
    const q = this._hass;
    if (!id || this._config.demo || !q || typeof q.callWS !== "function" || this._jahrAussenLaeuft) return;
    const jetzt = Date.now();
    if (this._jahrAussen && this._jahrAussen.id === id && jetzt - this._jahrAussen.zeit < 3600000) return;
    this._jahrAussenLaeuft = true;
    // Nur ganze Stunden, die laufende Stunde fehlt in der Statistik noch.
    const ende = Math.floor(jetzt / 3600000) * 3600000;
    let werte = [];
    try {
      const antwort = await q.callWS({
        type: "recorder/statistics_during_period",
        start_time: new Date(ende - 365 * 86400000).toISOString(),
        end_time: new Date(ende).toISOString(),
        statistic_ids: [id],
        period: "hour",
        types: ["mean"],
      });
      werte = ((antwort && antwort[id]) || []).filter((z) => z.mean !== null && Number.isFinite(Number(z.mean))).map((z) => Number(z.mean));
    } catch {
      // Keine Langzeitstatistik: die Auslegung bleibt ohne Jahreswerte.
    } finally {
      this._jahrAussenLaeuft = false;
    }
    this._jahrAussen = { id, zeit: jetzt, werte };
    if (this._diaArt === "analyse") this._zeichneAnalyse();
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
   * Baureihe fuer den Normalbereich des Wasserdrucks. "M" fuer die Aquarea
   * M-Serie: Datenblatt im Editor oder TOP92 (HeishaMon, zehn Bytes) mit
   * den Bytes 12 D7, wie bei allen M-Modellen in HeishaMon HeatPumpType.md
   * (Stand 4.4.1; die Erkennung daran ist eigene Festlegung). "andere" fuer
   * eine andere Panasonic-Baureihe laut TOP92, "unbekannt" fuer Panasonic
   * ohne diese Angaben, null fuer andere Hersteller.
   */
  _anPanaSerie() {
    if (this._copReferenz() === "panasonic_tcap_m_12") return "M";
    const panasonic = Boolean(this._config.demo)
      || ["heishamon_lutarym", "heishamon", "aquarea_heishamon", "aquarea_cloud"].includes(this._aktivesProfil());
    if (!panasonic) return null;
    const m = this._int("top92");
    const roh = m && m.roh ? m.roh.trim().toUpperCase() : "";
    if (/^([0-9A-F]{2} ){9}[0-9A-F]{2}$/.test(roh)) return roh.startsWith("12 D7") ? "M" : "andere";
    return "unbekannt";
  },

  /**
   * Heizkurve eines Heizkreises parallel um 2 K anheben, wenn die Raeume zu
   * kalt sind (EnergieSchweiz: 2 bis 3 °C je Schritt, hoechstens einmal pro
   * Woche). Nie ueber die Obergrenze der Heizflaeche (GRENZE, toleranz) und
   * das warme Ende nie ueber das kalte. Leer, wenn nichts mehr geht.
   */
  _anKurvenAnheben(zone, obergrenze) {
    const pre = zone === 2 ? "curve2_" : "curve_";
    const hoch = this._anWert(`${pre}t_high`);
    const tief = this._anWert(`${pre}t_low`);
    if (hoch === null || hoch >= obergrenze) return [];
    const neuHoch = Math.min(hoch + 2, obergrenze);
    const out = [this._anAenderung(`${pre}t_high`, neuHoch, "SetCurves", "°C", { kurve: zone })];
    if (tief !== null) out.push(this._anAenderung(`${pre}t_low`, Math.min(tief + 2, neuHoch), "SetCurves", "°C", { kurve: zone }));
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

  /**
   * Stufe und Text einer gemessenen Spreizung im Heizbetrieb. Der Richtwert
   * (BWP: 5 bis 7 K, Heizkoerper bis 10 K) ist in ganzen Kelvin angegeben;
   * verglichen wird darum auf ganze Kelvin gerundet (ab 5.32.5, eigene
   * Festlegung). So zaehlen 4,9 K als 5 K.
   */
  _anSpStufe(messung) {
    const sp = Math.round(messung);
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
  _anSpVorschlag(messung) {
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    // Vergleich auf ganze Kelvin wie in _anSpStufe, angezeigt wird die Messung.
    const sp = Math.round(messung);
    const dtSoll = this._anWert("heat_delta");
    const { spMax, toleranz } = this._anSpGrenzen();
    const richt = t(this._anMitPuffer() ? "an_r_sp_p" : toleranz ? "an_r_sp_hk" : "an_r_sp_fbh");
    let neu = null;
    if (dtSoll !== null && sp < 5 && dtSoll < 5) neu = 5;
    if (dtSoll !== null && sp > spMax && dtSoll > spMax) neu = spMax;
    // Grau bei Heizkoerpern (7 bis 10 K, BWP-Toleranz): auf den oberen
    // Richtwert von 7 K, wenn die Einstellung darueber liegt.
    if (dtSoll !== null && toleranz && sp > 7 && sp <= spMax && dtSoll > 7) neu = 7;
    let aktion = null;
    let ohne = "";
    if (neu !== null) {
      aktion = this._anVorschlag(
        [this._anAenderung("heat_delta", neu, "SetFloorHeatDelta", "K")],
        tf(t("an_g_sp"), { m: z(messung), r: richt })
      );
    } else if (sp < 5) {
      const pm = this._anPumpenModus();
      if (pm && pm.modus === "max" && pm.optionDt) {
        aktion = this._anVorschlag(
          [this._anAuswahl("pump_flow_mode", pm.optionDt, this._anPumpenText(pm.zustand), this._anPumpenText(pm.optionDt),
            "SetPumpFlowrateMode", "0")],
          tf(t("an_g_pumpe"), { m: z(messung), s: dtSoll !== null ? z(dtSoll, 0) : "--" })
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
    // Knopf bei Grau, Gelb und Rot, wenn es eine belegte Einstellung gibt.
    // Tipp und "Kein Vorschlag" nur bei Gelb und Rot; hat ein solcher Punkt
    // keinen Vorschlag, steht dort warum.
    const punkt = (p) => {
      const q = { text: "", tipp: "", wertText: "", richt: "", aktion: null, ohne: "", ...p };
      if (!MIT_KNOPF.includes(q.stufe)) {
        q.aktion = null;
        q.laeufe = null;
      }
      if (!AUFFAELLIG.includes(q.stufe)) {
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
      const tippSchluessel = Math.round(sp) < 5 ? (puffer ? "an_tip_sp_klein_p" : "an_tip_sp_klein") : puffer ? "an_tip_sp_gross_p" : "an_tip_sp_gross";
      punkt({
        gruppe: "heiz", id: "spreizung", stufe, titel: t("an_t_spreizung"), wert: `${z(sp)} K`,
        wertText: dtSoll !== null ? tf(t("an_w_sp_soll"), { s: z(dtSoll, 0) }) : t("an_w_sp"),
        richt: richtSp, text: t(text), tipp: t(tippSchluessel), quelle: ["spreizung", "pumpe"],
        aktion, ohne, schritt: stufe === "leicht" && aktion ? tf(t("an_sr_sp_hk"), { s: z(dtSoll, 0) }) : "",
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
      // Gelb, Rot und Grau (Fussbodenheizung 35 bis 40 °C): Heizkurve um
      // 2 K senken und beobachten.
      const zuHoch = vlKreise.filter((k) => MIT_KNOPF.includes(k.stufe));
      punkt({
        gruppe: "heiz", id: "vorlauf", stufe: schlimm.stufe, titel: t(schlimm.art === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"),
        wert: `${z(schlimm.v, 0)} °C`,
        wertText: schlimm.aussen !== null ? tf(t("an_w_vl_kreis"), { n: schlimm.n, a: z(schlimm.aussen) }) : `HK${schlimm.n}`,
        richt: t(schlimm.art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        text: `${t(vlText(schlimm.stufe, schlimm.art))} ${t("an_vl_puffer")}`,
        tipp: t("an_tip_vl"), quelle: "vorlauf", schritt: schlimm.stufe === "leicht" ? t("an_sr_vl_alt") : "",
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
          tipp: t("an_tip_vl"), quelle: "vorlauf", schritt: stufe === "leicht" ? t("an_sr_vl_alt") : "",
          aktion: MIT_KNOPF.includes(stufe)
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
        tipp: t("an_tip_kurve"), quelle: "vorlauf", schritt: stufe === "leicht" ? t("an_sr_kurve_alt") : "",
        aktion: MIT_KNOPF.includes(stufe)
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
        // Laeufe unter 92 %, schlechtester zuerst: Die Analyse je Lauf nennt
        // Ursachen und, wo belegt, einen Vorschlag (wie im Reiter COP).
        const unter = bewertet.filter((l) => copStufe(l) === "unter").sort((a, b) => a.copQuote - b.copQuote);
        const u = unter.length;
        const stufe = q < TOLERANZ ? "hinweis" : u ? "leicht" : "ok";
        punkt({
          gruppe: "heiz", id: "cop", stufe, titel: t("an_t_cop"), wert: z(c),
          wertText: `${copText} · ${tf(t("an_w_cop_dbl"), { p: z(q * 100, 0) })}`, richt: t("an_r_cop"),
          text: tf(t(u ? "an_cop_unter" : "an_cop_ok"), { u, n: bewertet.length }),
          quelle: ["cop", "keymark"], ohne: t("an_ov_cop"),
          schritt: u ? tf(t(u === 1 ? "an_sr_cop1" : "an_sr_cop"), { u }) : "", laeufe: u ? unter : null,
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

    // COP der Warmwasserladungen (ab 5.32.5) gegenueber demselben Datenblatt
    // bei der mittleren Vorlauftemperatur der Ladung, wie im Reiter COP;
    // ueber 55 °C Vorlauf ist der Vergleichswert geschaetzt (datenblatt.js).
    // Einen eigenen Warmwasserwert nennt Panasonic nur fuer das All-in-One
    // mit 185-l-Speicher (SCOP nach EN 16147, Lastprofil L, Katalog 2026,
    // S. 21); er gilt ueber das Jahr samt Speicher, nicht je Ladung.
    const wwCop = laeufe.filter((l) => l.ww && l.cop !== null);
    if (wwCop.length) {
      const summe = copSumme(wwCop, "ww");
      const c = summe !== null ? summe : gewichtet(wwCop, (l) => l.cop);
      const copText = t(summe !== null ? "an_w_cop" : "an_w_cop_zeit");
      const ref = this._copReferenz();
      const bewertet = wwCop.filter((l) => copStufe(l));
      if (ref && bewertet.length) {
        const q = gewichtet(bewertet, (l) => l.copQuote);
        const unter = bewertet.filter((l) => copStufe(l) === "unter").sort((a, b) => a.copQuote - b.copQuote);
        const u = unter.length;
        const stufe = q < TOLERANZ ? "hinweis" : u ? "leicht" : "ok";
        const geschaetzt = bewertet.some((l) => l.copGeschaetzt) ? ` ${t("an_copww_geschaetzt")}` : "";
        punkt({
          gruppe: "heiz", id: "copww", stufe, titel: t("an_t_copww"), wert: z(c),
          wertText: `${copText} · ${tf(t("an_w_cop_dbl"), { p: z(q * 100, 0) })}`, richt: t("an_r_cop"),
          text: tf(t(u ? "an_copww_unter" : "an_copww_ok"), { u, n: bewertet.length }) + geschaetzt,
          quelle: ["cop", "keymark", "pana_m_ww"], ohne: t("an_ov_cop"),
          schritt: u ? tf(t(u === 1 ? "an_sr_copww1" : "an_sr_copww"), { u }) : "", laeufe: u ? unter : null,
        });
      } else {
        punkt({
          gruppe: "heiz", id: "copww", stufe: "info", titel: t("an_t_copww"), wert: z(c), wertText: copText,
          text: t(ref ? "an_copww_ohne_punkte" : "an_cop_ohne_ref"), quelle: "",
        });
      }
    }

    /* ---------- Zusatzheizung und Abtauung ---------- */
    const stabGrenze = this._anWert("heater_on_temp");
    const biv = this._anBivalenz();
    const bivDaten = biv.fehlt.length ? null : { b: z(biv.punkt, 1), l: z(biv.last, 1), n: z(biv.nat, 1), w: z(biv.wp, 1), g: z(biv.grenze, 0) };
    const bivFehlt = () => tf(t("an_biv_fehlt"), { f: biv.fehlt.map((k) => t(k)).join(", ") });
    // Heizleistung, Auslegung. Leistungsanteil nach BWP-Leitfaden
    // Waermepumpendimensionierung (S. 14 bis 16): maximale Heizleistung bei
    // Norm-Aussentemperatur geteilt durch die Norm-Heizlast, empfohlen 50 bis
    // 80 %; ist nur die Herstellerangabe bei -7 °C bekannt, 70 bis 90 %.
    // Darunter ist von Unterdimensionierung auszugehen. Bewertet wird nur
    // diese Untergrenze; nach oben gibt es keinen Hinweis (Vorgabe des
    // Nutzers). Dazu der Anteil des Heizstabs im Jahr (Bin-Verfahren).
    const zahlWert = (v) => (v === "" || v === null || v === undefined ? NaN : Number(v));
    const rund1 = (v) => Math.round(v * 10) / 10;
    const lastH = zahlWert(this._config.heat_load_kw);
    const leistungH = zahlWert(this._config.hp_capacity_kw);
    if (lastH > 0 && leistungH > 0) {
      const bei7 = this._config.hp_capacity_ref === "a7";
      const lo = bei7 ? 70 : 50;
      const la = (leistungH / lastH) * 100;
      const natH = zahlWert(this._config.design_outdoor_temp);
      const bei = bei7 ? t("an_ausl_bei7") : Number.isFinite(natH) ? tf(t("an_ausl_bei_nat"), { n: z(natH, 1) }) : t("an_ausl_bei_norm");
      const pmin = rund1((lo / 100) * lastH);
      const d = { la: z(la, 0), lo: z(lo, 0), l: z(lastH, 1), w: z(leistungH, 1), bei, pmin: z(pmin, 1), f: z(rund1(pmin - rund1(leistungH)), 1) };
      let stufe = la < lo ? "hinweis" : "ok";
      const teile = [tf(t(stufe === "hinweis" ? "an_ausl_bwp_klein" : "an_ausl_bwp_ok"), d)];
      const max = zahlWert(this._config.heater_share_max);
      const mitMax = Number.isFinite(max) && max > 0 && max < 100;
      const x = mitMax ? z(max, Number.isInteger(max) ? 0 : 1) : "";
      let mitJahr = false;
      if (!bivDaten) {
        teile.push(tf(t("an_ausl_jahr_fehlt"), { f: biv.fehlt.map((k) => t(k)).join(", ") }));
      } else {
        const jahr = this._jahrAussen && this._jahrAussen.id === this._e("outside_temp") ? this._jahrAussen.werte : [];
        const d3 = { ...bivDaten, h: z(jahr.length, 0), hm: z(JAHR_MIN_STUNDEN, 0), x };
        if (jahr.length >= JAHR_MIN_STUNDEN) {
          mitJahr = true;
          const anteil = stabAnteil(jahr, biv.last, biv.nat, biv.grenze, biv.wp) || 0;
          const zuKlein = mitMax && anteil * 100 > max;
          const noetig = zuKlein ? rund1(noetigeLeistung(jahr, biv.last, biv.nat, biv.grenze, max / 100)) : null;
          const d4 = { ...d3, a: z(anteil * 100, 1), p: noetig !== null ? z(noetig, 1) : "", f: noetig !== null ? z(rund1(noetig - rund1(biv.wp)), 1) : "" };
          teile.push(tf(t(!mitMax ? "an_ausl_info" : zuKlein ? "an_ausl_klein" : "an_ausl_ok"), d4), tf(t("an_ausl_daten"), d4));
          if (zuKlein) stufe = "hinweis";
        } else {
          teile.push(tf(t("an_ausl_wenig"), d3));
        }
      }
      punkt({
        gruppe: "zusatz", id: "auslegung", stufe, titel: t("an_t_ausl"), wert: `${z(leistungH, 1)} kW`,
        wertText: tf(t("an_w_ausl_la"), d),
        richt: mitMax ? `${tf(t("an_r_ausl_bwp"), d)}, ${tf(t("an_r_ausl_max"), { x })}` : tf(t("an_r_ausl_bwp"), d),
        text: teile.join(" "), quelle: mitJahr ? ["bwp_dim", "en14825"] : "bwp_dim", ohne: t("an_ov_ausl"),
      });
    }
    if (stabGrenze !== null) {
      if (bivDaten) {
        // Der Heizstab soll erst unter dem Bivalenzpunkt freigegeben sein
        // (42watt "Heizstab", "Bivalenzpunkt"). Stellbereich TOP78: -15 bis
        // 20 °C; liegt der Bivalenzpunkt ausserhalb, ist der Rand das Ziel.
        // Passend: weniger als 1 K vom Ziel, die Schrittweite der Einstellung.
        // Vorschlag: das Ziel gerundet. Beides eigene Festlegung.
        const ziel = Math.max(-15, Math.min(20, biv.punkt));
        const rand = ziel !== biv.punkt;
        const abw = stabGrenze - ziel;
        const stufe = Math.abs(abw) < 1 ? "ok" : "hinweis";
        const vorschlag = Math.round(ziel);
        const d2 = { ...bivDaten, k: z(Math.abs(stabGrenze - biv.punkt), 1), v: z(stabGrenze, 0), s: z(vorschlag, 0) };
        punkt({
          gruppe: "zusatz", id: "bivalenz", stufe, titel: t("an_t_bivalenz"), wert: `${z(stabGrenze, 0)} °C`,
          wertText: t("an_w_bivalenz"), richt: tf(t(rand ? "an_r_biv_rand" : "an_r_biv"), d2),
          text: `${tf(t(stufe !== "ok" ? (abw > 0 ? "an_biv_hoch" : "an_biv_tief") : rand ? "an_biv_passt_rand" : "an_biv_passt"), d2)} ${tf(t("an_biv_daten"), d2)}`,
          tipp: stufe === "ok" ? "" : tf(t("an_tip_biv"), d2), quelle: ["bivalenz", "bwp_dim"],
          aktion: stufe === "ok" ? null : this._anVorschlag(
            [this._anAenderung("heater_on_temp", vorschlag, "SetHeaterOnOutdoorTemp", "°C")],
            tf(t("an_g_biv"), d2), t("an_g_biv_h")),
        });
      } else {
        punkt({
          gruppe: "zusatz", id: "bivalenz", stufe: "info", titel: t("an_t_bivalenz"), wert: `${z(stabGrenze, 0)} °C`,
          wertText: t("an_w_bivalenz"), text: `${t("an_biv_info")} ${bivFehlt()}`, quelle: ["bivalenz", "bwp_dim"],
        });
      }
    }
    if (d && (d.stabIntern.length || d.stabExtern.length)) {
      // Nur Heizbetrieb: TOP60 meldet den Heizstab auch beim Warmwasser.
      const zeiten = anZeiten(d.stabIntern, d.aussen, d.t0, d.t1, d.ventil).concat(anZeiten(d.stabExtern, d.aussen, d.t0, d.t1, d.ventil));
      const gesamt = zeiten.reduce((s, x) => s + x.minuten, 0);
      if (bivDaten) {
        // Ueber dem Bivalenzpunkt deckt die Waermepumpe laut den Angaben die
        // Heizlast allein (42watt: Einschaltgrenze zu hoch gesetzt).
        const drueber = zeiten.filter((x) => x.aussen !== null && x.aussen > biv.punkt).reduce((s, x) => s + x.minuten, 0);
        const ohneAussen = zeiten.filter((x) => x.aussen === null).reduce((s, x) => s + x.minuten, 0);
        const stufe = drueber > 0 ? "hinweis" : ohneAussen > 0 ? "info" : "ok";
        const d2 = { ...bivDaten, m: z(drueber, 0) };
        punkt({
          gruppe: "zusatz", id: "heizstab", stufe, titel: t("an_t_heizstab"), wert: `${z(gesamt, 0)} min`,
          wertText: gesamt > 0 ? tf(t("an_w_hs_biv"), d2) : "", richt: tf(t("an_r_hs_biv"), d2),
          text: gesamt === 0 ? t("an_hs_aus") : tf(t(drueber > 0 ? "an_hs_drueber" : ohneAussen > 0 ? "an_hs_ohne_aussen" : "an_hs_drunter"), d2),
          quelle: ["bivalenz", "heizstab"], ohne: t("an_ov_hs_biv"),
        });
      } else {
        punkt({
          gruppe: "zusatz", id: "heizstab", stufe: gesamt === 0 ? "ok" : "info", titel: t("an_t_heizstab"), wert: `${z(gesamt, 0)} min`,
          text: gesamt === 0 ? t("an_hs_aus") : `${t("an_hs_info")} ${bivFehlt()}`,
          quelle: gesamt === 0 ? "heizstab" : ["heizstab", "bwp_dim"],
        });
      }
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
    // erst dann wird nachgeladen. Fuer private Ein- und Zweifamilienhaeuser
    // gibt es keine festen Vorschriften; empfohlen ist, 55 bis 60 °C zu
    // waehlen (UBA, Trinkwarmwasserkonzepte fuer Gebaeude mit einer
    // Waermepumpenheizung, 1.11.2023). Ohne Zirkulation sehen die
    // technischen Regeln dort eine untere Betriebstemperatur von 50 °C vor,
    // mit Zirkulation gelten die Vorgaben fuer Grossanlagen (DVGW,
    // Energieeinsparungen im Warmwasserbereich, 3/2023, Abschnitt 3).
    // Bewertet wird darum (fuer ein Haus ohne Zirkulation; die Grenzen aus
    // den Quellen, die Stufen eigene Festlegung):
    //  - Soll unter 55 °C: Hinweis, Vorschlag 55 °C, nicht hoeher.
    //  - Speicher faellt vor dem Nachladen unter 50 °C: leichte Abweichung,
    //    Schritt: kleinere Schaltdifferenz (TOP22 erlaubt -12 bis -2 K).
    //  - Soll ueber 60 °C: leichte Abweichung. Laut UBA beeintraechtigen
    //    hohe Temperaturen die Effizienz; ueber 60 °C braucht es je nach
    //    Modell eventuell eine Zusatzheizung. UBA-Beispiel, Typ-EFH: die
    //    Jahresarbeitszahl der Trinkwassererwaermung sinkt von 3,22 auf
    //    2,19, wenn von 48 auf 60 °C angehoben und zugleich eine Zirkulation
    //    betrieben wird.
    // Die Legionellenschaltung (TOP70) ersetzt das nicht: Das UBA haelt sie
    // fuer keine sichere Variante, laut DVGW (Abschnitt 5.3) fehlt ein
    // wissenschaftlicher Nachweis, dass sie Legionellen verringert.
    const wwSoll = this._anWert("dhw_setpoint");
    const wwDelta = this._anWert("dhw_heat_delta");
    const steril = this._anWert("steril_temp");
    if (wwSoll !== null) {
      const diff = wwDelta !== null ? Math.abs(wwDelta) : null;
      const tief = diff !== null ? wwSoll - diff : null;
      const sollId = this._e("dhw_setpoint");
      const sollSt = sollId && this._quelle.states ? this._quelle.states[sollId] : null;
      const sollMax = sollSt && sollSt.attributes && Number.isFinite(Number(sollSt.attributes.max)) ? Math.min(Number(sollSt.attributes.max), 65) : 65;
      const lage = wwSoll < 55 ? "unter" : wwSoll > 60 ? "ueber" : "in";
      const unter50 = tief !== null && tief < 50;
      let stufe = "ok";
      if (lage === "unter") stufe = "hinweis";
      else if (unter50 || lage === "ueber") stufe = "leicht";
      const w = { s: z(wwSoll, 0), d: z(-diff, 0), m: z(tief, 0), x: z(50 - wwSoll, 0) };
      const satz = tief !== null ? tf(t("an_ww_satz_tief"), w) : tf(t("an_ww_satz_soll"), { m: z(wwSoll, 0) });
      const urteil = [t("an_ww_q_frei"), t(`an_ww_q_${lage}`)];
      if (tief !== null) urteil.push(t(unter50 ? "an_ww_q_tief_unter" : "an_ww_q_tief_ok"));
      if (steril !== null) urteil.push(tf(t("an_ww_steril"), { s: z(steril, 0) }));
      let aktion = null;
      if (stufe === "hinweis" && sollMax >= 55) {
        // Nur bis zur unteren Empfehlung von 55 °C, nicht hoeher.
        aktion = this._anVorschlag([this._anAenderung("dhw_setpoint", 55, "SetDHWTemp", "°C")], tf(t("an_g_ww"), { s: z(wwSoll, 0), n: "55" }));
      }
      let kurz;
      if (lage === "unter") kurz = tf(t("an_ku_ww_hinweis"), w);
      else if (unter50) kurz = tf(t("an_ku_ww_tief"), w);
      else if (lage === "ueber") kurz = tf(t("an_ku_ww_hoch"), w);
      else kurz = tf(t(tief !== null ? "an_ku_ww_ok" : "an_ku_ww_ok_soll"), w);
      // Schritt nur bei leichter Abweichung. Kleinere Schaltdifferenz statt
      // hoeherem Soll: der Speicher bleibt ueber 50 °C, die Ladungen werden
      // haeufiger und kuerzer. Ueber 60 °C: auf 60 °C senken; faellt der
      // Speicher dann unter 50 °C, dazu die Schaltdifferenz auf -10 K.
      // Bei Grau mit Knopf (ab 5.32.3): die Schaltdifferenz ueber
      // SetDHWHeatDelta (HeishaMon SET20, -12 bis -2 K), das Soll ueber
      // SetDHWTemp.
      let schritt = "";
      if (stufe === "leicht" && unter50 && wwSoll - 50 >= 2) {
        schritt = tf(t("an_sr_ww_tief"), w);
        aktion = this._anVorschlag([this._anAenderung("dhw_heat_delta", 50 - wwSoll, "SetDHWHeatDelta", "K")],
          tf(t("an_g_ww_delta"), w));
      } else if (stufe === "leicht" && !unter50) {
        const mitDiff = diff !== null && 60 - diff < 50;
        schritt = t(mitDiff ? "an_sr_ww_hoch_d" : "an_sr_ww_hoch");
        aktion = this._anVorschlag([
          this._anAenderung("dhw_setpoint", 60, "SetDHWTemp", "°C"),
          mitDiff ? this._anAenderung("dhw_heat_delta", -10, "SetDHWHeatDelta", "K") : null,
        ], tf(t(mitDiff ? "an_g_ww_hoch_d" : "an_g_ww_hoch"), w));
      }
      const teile = [tief !== null ? tf(t("an_w_ww_tief"), { m: z(tief, 0) }) : t("an_w_ww_soll")];
      if (steril !== null) teile.push(tf(t("an_w_steril"), { s: z(steril, 0) }));
      punkt({
        gruppe: "anlage", id: "warmwasser", stufe, titel: t("an_t_warmwasser"), wert: `${z(wwSoll, 0)} °C`,
        wertText: teile.join(" · "), richt: t("an_r_warmwasser"), text: `${satz} ${urteil.join(" ")}`,
        kurz, schritt, tipp: t("an_tip_ww_niedrig"), quelle: ["warmwasser", "dvgw_ww", "legionellen"], aktion,
      });
    }
    // Anlagendruck (TOP115): bewertet wird der Verlauf im Zeitraum gegen den
    // Bereich, den Panasonic fuer den Normalbetrieb nennt. Ab 5.32.4 ohne
    // Gelb: Werte zur Auslegung des Ausdehnungsgefaesses sind keine
    // Betriebsgrenzen. Bereiche:
    //  - M-Serie (Aussengeraet WH-WXG..ME8): 0,5 bis 4 bar
    //    (Servicehandbuch 07/2024, S. 99, 12.1.8 Test Run; das
    //    Sicherheitsventil des Wasserkreises oeffnet bei 400 kPa, S. 13).
    //  - andere Panasonic-Baureihen: 0,05 bis 0,3 MPa, also 0,5 bis 3 bar
    //    (Bedienungsanleitung 2022, S. 17).
    //  - Baureihe unbekannt: bis 3 bar in Ordnung; 3 bis 4 bar nur
    //    Messwert, denn das ist nur bei der M-Serie Normalbetrieb.
    //  - andere Hersteller: nur Messwert, kein Bereich hinterlegt.
    // 0 bar heisst: kein Sensor (TOP115 gibt es nicht bei jeder Serie).
    const druckReihe = d && d.druck ? d.druck.filter((p) => Number.isFinite(p.v) && p.v > 0.05) : [];
    const druckJetzt = this._anWert("water_pressure");
    if (druckReihe.length || (druckJetzt !== null && druckJetzt > 0.05)) {
      const serie = this._anPanaSerie();
      const MIN = 0.5;
      const MAX = serie === "M" || serie === "unbekannt" ? 4.0 : 3.0;
      const werte = druckReihe.length ? druckReihe : [{ t: Date.now(), v: druckJetzt }];
      const tief = werte.reduce((a, p) => (p.v < a.v ? p : a));
      const hoch = werte.reduce((a, p) => (p.v > a.v ? p : a));
      const vl = (p) => {
        const i = d && d.vorlauf && druckReihe.length ? indexBis(d.vorlauf, p.t) : -1;
        return i >= 0 && Number.isFinite(d.vorlauf[i].v) ? d.vorlauf[i].v : null;
      };
      let art = "ok";
      if (serie === null) art = "fremd";
      else if (!druckReihe.length) art = "jetzt";
      else if (tief.v < MIN || hoch.v > MAX) art = "bereich";
      else if (serie === "unbekannt" && hoch.v > 3.0) art = "unklar";
      const stufe = { bereich: "pruefen", jetzt: "info", fremd: "info", unklar: "info", ok: "ok" }[art];
      const bei = (v) => (v === null ? "" : tf(t("an_dr_bei"), { v: z(v, 0) }));
      const wert = druckReihe.length && hoch.v !== tief.v ? tf(t("an_w_druck_bereich"), { min: z(tief.v), max: z(hoch.v) }) : `${z(hoch.v)} bar`;
      const b = serie === null ? "" : t(serie === "M" ? "an_dr_b_m" : serie === "andere" ? "an_dr_b_p" : "an_dr_b_u");
      const w = { min: z(tief.v), max: z(hoch.v), bmin: bei(vl(tief)), bmax: bei(vl(hoch)), b, w: wert };
      punkt({
        gruppe: "anlage", id: "druck", stufe, titel: t("an_t_druck"), wert,
        wertText: druckReihe.length ? t("an_w_druck") : t("an_w_druck_jetzt"),
        richt: serie === null ? "" : tf(t("an_r_druck"), w),
        text: tf(t(`an_dr_${art}`), w), kurz: tf(t(`an_ku_dr_${art}`), w),
        tipp: t("an_tip_dr_bereich"), ohne: t("an_ov_druck"),
        quelle: serie === null ? "" : serie === "M" ? ["pana_m_druck"] : serie === "andere" ? ["druck"] : ["druck", "pana_m_druck", "hm_modell"],
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
    // Neue Punkte, Werte der Integration und Zuordnung zu den Reitern
    // (analysereiter.js). Gezeichnet wird dort.
    this._anErgaenze(punkte, punkt, { d, laeufe, heizLaeufe, tage, puffer });
    return punkte;
  },
};
