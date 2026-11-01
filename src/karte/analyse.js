/**
 * Analyse: wertet die bekannten Messwerte und Einstellungen aus und gibt
 * je Pruefpunkt eine Einordnung mit Richtwert, Tipp und Quelle. Liegt die
 * Ursache in einem einstellbaren Parameter, macht sie einen Vorschlag,
 * der erst nach Bestaetigung gesetzt wird (siehe optimieren.js).
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Grundlagen der Richtwerte (Stand 01.11.2026):
 *  - Spreizung 5 bis 7 K, bei Heizkoerpern bis 10 K toleriert:
 *    BWP Leitfaden Hydraulik, zitiert bei 42watt "Spreizung Waermepumpe".
 *    Mit getrenntem Puffer gilt die Spreizung nur fuer den Kreis der
 *    Waermepumpe; die Pumpe regelt im Modus Delta T auf TOP23
 *    (HeishaMon SET18 SetFloorHeatDelta, SET42 Pumpenregelung).
 *  - Vorlauf Fussbodenheizung 30 bis 35 °C (Altbau bis 40 °C), Heizkoerper
 *    45 bis 55 °C, hoechstens 55 °C; bis 2,5 % Strom je Kelvin weniger:
 *    Bosch, Viessmann, Verbraucherzentrale RLP, zitiert bei 42watt.
 *  - Puffer: Pufferziel = hoechstes Heizkreis-Soll + Puffer-Delta-T
 *    (Panasonic Servicehandbuch WH-SDC09H3E8, S. 104), Werkseinstellung
 *    5 °C (Panasonic Bedienungsanleitung, Menue 5.6). Mischverlust eines
 *    Trennpuffers typisch 2 bis 5 K (Fachforen, zusammengefasst bei
 *    elektronik-zeit.de). Die Grenze "Ueberhoehung plus 5 K" ist eine
 *    eigene Festlegung der Karte.
 *  - Taktung 10 bis 20 min je Start (BWP), 90 % der Feldanlagen unter
 *    rund 15 Starts am Tag im Jahresmittel (Fraunhofer), 42watt "Taktung".
 *  - Bivalenzpunkt monoenergetischer Luft-Wasser-Anlagen -3 bis -7 °C
 *    (Stiebel Eltron Planungshandbuch), 42watt "Bivalenzpunkt".
 *  - TOP60 meldet den internen Heizstab fuer Raum oder Warmwasser
 *    (HeishaMon ProtocolByteDecrypt), darum zaehlen fuer den Heizbetrieb
 *    nur Zeiten, in denen das Ventil auf Heizen steht.
 *  - Abtauung 5 bis 15 min, haeufig bei -5 bis +5 °C: 42watt "Abtauen".
 *  - Warmwasser: Umweltbundesamt, Trinkwarmwasserkonzepte (Nov. 2023):
 *    in Ein- und Zweifamilienhaeusern durchgaengig ueber 55 °C, eine
 *    Legionellenschaltung ist kein sicherer Schutz. Der Speicher faellt
 *    bis Soll plus TOP22 (negativ), bevor nachgeladen wird.
 *  - Anlagendruck 1,2 bis 2,0 bar plus 0,3 bar: Vattenfall. TOP115 gibt
 *    es laut HeishaMon nur bei der K- und L-Serie; 0 bar gilt als kein
 *    Messwert, eine laufende Anlage hat nie 0 bar.
 *  - JAZ: Die BEG verlangt eine nach VDI 4650 berechnete JAZ ab 3,0
 *    (Planwert, keine Messung). Feldmittel Luft-Wasser 3,4, gemessen
 *    (Fraunhofer, Messjahr 2024): 42watt "Jahresarbeitszahl".
 * Eigene Festlegungen der Karte sind im Text als solche genannt.
 */
import { escapeHtml, fmt, indexBis, numState, rawState, stellbar, zustandAn } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";
import { copStufe, mittel, ventilAbschnitte } from "./auswertung.js";

const QUELLEN = {
  spreizung: ["42watt: Spreizung (BWP Leitfaden Hydraulik)", "https://42watt.de/magazin/spreizung-warmepumpe"],
  vorlauf: ["42watt: Vorlauftemperatur (Bosch, Viessmann, VZ RLP)", "https://www.42watt.de/magazin/vorlauftemperatur-warmepumpe"],
  puffer: ["Panasonic Servicehandbuch: Pufferziel", "https://www.manualslib.com/manual/1273892/Panasonic-Wh-Sdc09h3e8.html?page=104"],
  mischung: ["elektronik-zeit: Trennpuffer, Mischverlust", "https://elektronik-zeit.de/waermepumpe/reihenpuffer-trennpuffer-vergleich/"],
  taktung: ["42watt: Taktung (BWP, Fraunhofer)", "https://42watt.de/magazin/taktung-warmepumpe"],
  cop: ["Panasonic: Aquarea T-CAP M, technische Daten", "https://www.aircon.panasonic.eu/DE_de/product/t-cap-stand-alone-outdoor-m-series-1-phase-3-phase-r290/"],
  bivalenz: ["42watt: Bivalenzpunkt (Stiebel Eltron)", "https://42watt.de/magazin/bivalenzpunkt-warmepumpe-einfach-erklart"],
  heizstab: ["42watt: Heizstab (Fraunhofer-Feldtests)", "https://42watt.de/magazin/heizstab-warmepumpe"],
  abtauung: ["42watt: Abtauen", "https://42watt.de/magazin/warmepumpe-abtauen"],
  warmwasser: ["Umweltbundesamt: Trinkwarmwasserkonzepte (2023)", "https://www.umweltbundesamt.de/sites/default/files/medien/11850/publikationen/factsheet_trinkwarmwasserkonzepte.pdf"],
  druck: ["Vattenfall: Wasserdruck der Heizung", "https://www.vattenfall.de/infowelt-energie/nachhaltig-heizen/wasserdruck-der-heizung"],
  jaz: ["42watt: Jahresarbeitszahl (BEG, Fraunhofer)", "https://42watt.de/magazin/jahresarbeitszahl"],
};

const STUFEN = {
  ok: { farbe: "#22C55E", text: "an_ok" },
  hinweis: { farbe: "#F59E0B", text: "an_hinweis" },
  pruefen: { farbe: "#EF4444", text: "an_pruefen" },
  unbekannt: { farbe: "#7E8CA0", text: "an_unbekannt" },
};

/** Richtwerte des Vorlaufs je Heizflaeche. */
const GRENZE = { fbh: { gut: 35, max: 40 }, hk: { gut: 55, max: 55 } };

/** Rangfolge der Stufen, um den schlechtesten Heizkreis zu finden. */
const RANG = { ok: 0, hinweis: 1, pruefen: 2 };

/**
 * Zeiten in Minuten, in denen eine Reihe "an" meldet, mit der
 * Aussentemperatur dabei. Mit Ventilverlauf nur die Zeiten, in denen das
 * Ventil auf Heizen steht.
 */
function anZeiten(reihe, aussen, t0, t1, ventil) {
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

  /** Heizflaechen laut Editor: nur Fussbodenheizung, nur Heizkoerper oder gemischt. */
  _anHeizflaechen() {
    const n = Math.max(1, Math.min(4, Number(this._config.hk_count) || 1));
    const arten = [];
    for (let i = 1; i <= n; i++) arten.push(this._anFlaecheVon(i));
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

  /** Alle Pruefpunkte berechnen. */
  _anPruefen() {
    const d = this._auswertung;
    const laeufe = d ? this._auswertungLaeufe(d) : [];
    const heizLaeufe = laeufe.filter((l) => !l.ww && !l.angeschnitten && l.minuten >= 10);
    // Richtwerte je Tag gelten bei laengeren Zeitraeumen im Mittel.
    const tage = d ? Math.max((d.t1 - d.t0) / 86400000, 1) : 1;
    const flaechen = this._anHeizflaechen();
    const puffer = this._anMitPuffer();
    const zonen = this._anZonen();
    const punkte = [];
    const t = (k) => this._t(k);
    const z = (v, s = 1) => fmt(v, s);
    const punkt = (p) => punkte.push({ text: "", tipp: "", wertText: "", richt: "", aktion: null, ...p });
    const gewichtet = (ls, wert) => {
      const dauer = ls.reduce((s, l) => s + l.minuten, 0);
      return dauer ? ls.reduce((s, l) => s + wert(l) * l.minuten, 0) / dauer : null;
    };

    /* ---------- Heizbetrieb ---------- */
    // Spreizung im Heizbetrieb, je Lauf ab der fuenften Minute. Mit Puffer
    // ist das die Spreizung des Waermepumpenkreises.
    const dtSoll = this._anWert("heat_delta");
    const spMax = puffer || flaechen === "fbh" ? 7 : 10;
    const mitSpreizung = heizLaeufe.filter((l) => l.vorlauf !== null && l.ruecklauf !== null);
    const richtSp = t(puffer ? "an_r_sp_p" : flaechen === "fbh" ? "an_r_sp_fbh" : "an_r_sp_hk");
    if (mitSpreizung.length) {
      const sp = gewichtet(mitSpreizung, (l) => l.vorlauf - l.ruecklauf);
      let stufe = "ok";
      let text = "an_sp_ok";
      if (sp < 5) {
        stufe = "hinweis";
        text = puffer ? "an_sp_klein_p" : "an_sp_klein";
      } else if (sp > 10) {
        stufe = "pruefen";
        text = puffer ? "an_sp_gross_p" : "an_sp_gross";
      } else if (sp > 7) {
        if (puffer) {
          stufe = "hinweis";
          text = "an_sp_mittel_p";
        } else {
          stufe = flaechen === "fbh" ? "hinweis" : "ok";
          text = flaechen === "fbh" ? "an_sp_fbh" : "an_sp_hk";
        }
      }
      // Vorschlag nur, wenn Messung und Einstellung in dieselbe Richtung
      // vom Richtwert abweichen. Sonst liegt es nicht an TOP23.
      let neu = null;
      if (dtSoll !== null && sp < 5 && dtSoll < 5) neu = 5;
      if (dtSoll !== null && sp > spMax && dtSoll > spMax) neu = spMax;
      const tippSchluessel = sp < 5 ? (puffer ? "an_tip_sp_klein_p" : "an_tip_sp_klein") : puffer ? "an_tip_sp_gross_p" : "an_tip_sp_gross";
      punkt({
        gruppe: "heiz", id: "spreizung", stufe, titel: t("an_t_spreizung"), wert: `${z(sp)} K`,
        wertText: dtSoll !== null ? tf(t("an_w_sp_soll"), { s: z(dtSoll, 0) }) : t("an_w_sp"),
        richt: richtSp, text: t(text), tipp: stufe === "ok" ? "" : t(tippSchluessel), quelle: "spreizung",
        aktion: neu === null ? null : this._anVorschlag(
          [this._anAenderung("heat_delta", neu, "SetFloorHeatDelta", "K")],
          tf(t("an_g_sp"), { m: z(sp), o: spMax })
        ),
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
          return { n, art, gr, v, aussen: hoechst.aussen, stufe: v <= gr.gut ? "ok" : v <= gr.max ? "hinweis" : "pruefen" };
        })
        .filter(Boolean)
      : [];
    if (vlKreise.length) {
      const schlimm = vlKreise.reduce((a, b) =>
        RANG[b.stufe] > RANG[a.stufe] || (RANG[b.stufe] === RANG[a.stufe] && b.v - b.gr.gut > a.v - a.gr.gut) ? b : a);
      const zuHoch = vlKreise.filter((k) => k.stufe !== "ok");
      punkt({
        gruppe: "heiz", id: "vorlauf", stufe: schlimm.stufe, titel: t(schlimm.art === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"),
        wert: `${z(schlimm.v, 0)} °C`,
        wertText: schlimm.aussen !== null ? tf(t("an_w_vl_kreis"), { n: schlimm.n, a: z(schlimm.aussen) }) : `HK${schlimm.n}`,
        richt: t(schlimm.art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk"),
        text: `${t(schlimm.stufe === "ok" ? "an_vl_ok" : schlimm.art === "fbh" ? "an_vl_fbh" : "an_vl_hk")} ${t("an_vl_puffer")}`,
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
        const stufe = vl <= grenze.gut ? "ok" : vl <= grenze.max ? "hinweis" : "pruefen";
        punkt({
          gruppe: "heiz", id: "vorlauf", stufe, titel: t(flaechen === "fbh" ? "an_t_vl_fbh" : "an_t_vl_hk"), wert: `${z(vl, 0)} °C`,
          wertText: hoechst.aussen !== null ? tf(t("an_w_vl"), { a: z(hoechst.aussen) }) : "",
          richt: richtVl,
          text: t(stufe === "ok" ? "an_vl_ok" : flaechen === "fbh" ? "an_vl_fbh" : "an_vl_hk")
            + (flaechen === "gemischt" ? ` ${t("an_vl_gemischt")}` : ""),
          tipp: t("an_tip_vl"), quelle: "vorlauf",
          aktion: stufe === "ok"
            ? null
            : this._anVorschlag(zonen.flatMap((n) => this._anKurvenSchritt(n, "parallel")), tf(t("an_g_vl"), { v: z(vl, 0), r: richtVl })),
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
      const stufe = kurveVl <= gr.gut ? "ok" : kurveVl <= gr.max ? "hinweis" : "pruefen";
      const richt = t(art === "fbh" ? "an_r_vl_fbh" : "an_r_vl_hk");
      punkt({
        gruppe: "heiz", id: `kurve${n}`, stufe, titel: zonen.length > 1 ? tf(t("an_t_kurve_n"), { n }) : t("an_t_kurve"),
        wert: `${z(kurveVl, 0)} °C`,
        wertText: kurveAussen !== null ? tf(t("an_w_kurve"), { a: z(kurveAussen, 0) }) : "",
        richt, text: t(stufe === "ok" ? "an_kurve_ok" : "an_kurve_hoch"),
        tipp: stufe === "ok" ? "" : t("an_tip_kurve"), quelle: "vorlauf",
        aktion: stufe === "ok"
          ? null
          : this._anVorschlag(this._anKurvenSchritt(n, "kalt", gr.gut), tf(t("an_g_kurve"), { v: z(kurveVl, 0), r: richt })),
      });
    });

    // Puffer: wie weit die Waermepumpe ueber dem Heizkreis faehrt.
    const pufferDt = this._anWert("buffer_delta");
    const mitKreis = heizLaeufe.filter((l) => l.vorlauf !== null && (l.kreis1 !== null || l.kreis2 !== null));
    if (puffer && mitKreis.length) {
      const abstand = gewichtet(mitKreis, (l) => l.vorlauf - Math.max(...[l.kreis1, l.kreis2].filter((v) => v !== null)));
      const rest = abstand - (pufferDt !== null ? pufferDt : 0);
      const stufe = rest <= 5 ? "ok" : "hinweis";
      const tipps = [];
      if (stufe !== "ok") tipps.push(t("an_tip_pu"));
      if (pufferDt !== null && pufferDt > 0) tipps.push(tf(t("an_tip_pu_dt"), { d: z(pufferDt, 0) }));
      punkt({
        gruppe: "heiz", id: "puffer", stufe, titel: t("an_t_puffer"), wert: `${z(abstand)} K`,
        wertText: pufferDt !== null ? tf(t("an_w_puffer"), { d: z(pufferDt, 0) }) : t("an_w_puffer_o"),
        richt: pufferDt !== null ? tf(t("an_r_puffer"), { m: z(pufferDt + 5, 0) }) : t("an_r_puffer_o"),
        text: stufe === "ok" ? tf(t("an_pu_ok"), { g: z(abstand) }) : t("an_pu_hoch"),
        tipp: tipps.join(" "), quelle: ["puffer", "mischung"],
      });
    }

    // Taktung nach den Richtwerten. Der Startzaehler TOP12 dient als Abgleich.
    const bewertet = laeufe.filter((l) => !l.laufend && !l.angeschnitten);
    const zaehler = (() => {
      const r = d && d.starts ? d.starts.filter((p) => Number.isFinite(p.v)) : [];
      if (r.length < 2) return null;
      // Stand zu Beginn des Zeitraums, nicht der erste Wechsel danach.
      const diff = r[r.length - 1].v - r[Math.max(0, indexBis(r, d.t0))].v;
      return diff >= 0 ? diff : null;
    })();
    if (bewertet.length) {
      const n = laeufe.filter((l) => !l.angeschnitten).length;
      const kurz = bewertet.filter((l) => l.minuten < 10).length;
      const sehrKurz = bewertet.filter((l) => l.minuten < 6).length;
      const mLauf = bewertet.reduce((s, l) => s + l.minuten, 0) / bewertet.length;
      const anteil = kurz / bewertet.length;
      // Zwei sehr kurze Laeufe gelten je Tag, ueber mehrere Tage im Mittel.
      const stufe = anteil >= 0.3 || sehrKurz / tage >= 2 ? "pruefen" : kurz || n / tage > 15 ? "hinweis" : "ok";
      punkt({
        gruppe: "heiz", id: "taktung", stufe, titel: t("an_t_taktung"),
        wert: tage > 1.5 ? `${tf(t("an_w_starts"), { n })} · ${fmt(n / tage, 0)}/d` : tf(t("an_w_starts"), { n }),
        wertText: tf(t("an_w_lauf"), { d: z(mLauf, 0) }) + (zaehler !== null ? ` · ${tf(t("an_w_zaehler"), { z: zaehler })}` : ""),
        richt: t("an_r_taktung"),
        text: stufe === "ok" ? t("an_tk_ok") : tf(t("an_tk_kurz"), { k: kurz, n: bewertet.length }),
        tipp: stufe === "ok" ? "" : t(puffer ? "an_tip_taktung_p" : "an_tip_taktung"), quelle: "taktung",
      });
    } else {
      punkt({ gruppe: "heiz", id: "taktung", stufe: "unbekannt", titel: t("an_t_taktung"), wert: "--", richt: t("an_r_taktung"),
        text: t(d ? "a_keine_laeufe" : "an_keine_daten"), quelle: "taktung" });
    }

    // COP gegenueber Erwartung.
    const mitQuote = laeufe.filter((l) => l.copQuote !== null);
    if (mitQuote.length) {
      const q = gewichtet(mitQuote, (l) => l.copQuote);
      const st = copStufe(q);
      const stufe = st === "gut" || st === "rahmen" ? "ok" : st === "unter" ? "hinweis" : "pruefen";
      punkt({
        gruppe: "heiz", id: "cop", stufe, titel: t("an_t_cop"), wert: `${z(q * 100, 0)} %`, wertText: t("an_w_cop"),
        richt: t("an_r_cop"), text: t(stufe === "ok" ? "an_cop_ok" : "an_cop_unter"),
        tipp: stufe === "ok" ? "" : t("an_tip_cop"), quelle: "cop",
      });
    } else {
      punkt({ gruppe: "heiz", id: "cop", stufe: "unbekannt", titel: t("an_t_cop"), wert: "--", richt: t("an_r_cop"),
        text: t("an_cop_ohne"), quelle: "cop" });
    }

    /* ---------- Zusatzheizung und Abtauung ---------- */
    const stabGrenze = this._anWert("heater_on_temp");
    if (stabGrenze !== null) {
      const stufe = stabGrenze <= -3 ? "ok" : "hinweis";
      punkt({
        gruppe: "zusatz", id: "bivalenz", stufe, titel: t("an_t_bivalenz"), wert: `${z(stabGrenze, 0)} °C`,
        wertText: t("an_w_bivalenz"), richt: t("an_r_bivalenz"), text: t(stufe === "ok" ? "an_biv_ok" : "an_biv_hoch"),
        tipp: stufe === "ok" ? "" : t("an_tip_bivalenz"), quelle: "bivalenz",
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
      // 30 Minuten je Tag ueber 0 °C, eigene Grenze der Karte.
      const stufe = warm / tage >= 30 ? "hinweis" : "ok";
      punkt({
        gruppe: "zusatz", id: "heizstab", stufe, titel: t("an_t_heizstab"), wert: `${z(gesamt, 0)} min`,
        wertText: tf(t("an_w_heizstab"), { w: z(warm, 0) }), richt: t("an_r_heizstab"),
        text: t(gesamt === 0 ? "an_hs_aus" : stufe === "ok" ? "an_hs_ok" : "an_hs_warm"),
        tipp: stufe === "ok" ? "" : t("an_tip_heizstab"), quelle: "heizstab",
      });
    }
    if (d && d.abtau.length) {
      const zeiten = anZeiten(d.abtau, d.aussen, d.t0, d.t1);
      if (!zeiten.length) {
        punkt({ gruppe: "zusatz", id: "abtauung", stufe: "ok", titel: t("an_t_abtauung"), wert: "0×", richt: t("an_r_abtauung"),
          text: t("an_ab_keine"), quelle: "abtauung" });
      } else {
        const m = zeiten.reduce((s, x) => s + x.minuten, 0) / zeiten.length;
        const temps = zeiten.filter((x) => x.aussen !== null).map((x) => x.aussen);
        const warm = temps.filter((w) => w >= 10).length;
        const stufe = m > 15 || warm ? "hinweis" : "ok";
        punkt({
          gruppe: "zusatz", id: "abtauung", stufe, titel: t("an_t_abtauung"), wert: `${zeiten.length}×`,
          wertText: temps.length
            ? tf(t("an_w_abtau"), { d: z(m, 0), a: z(Math.min(...temps), 0), b: z(Math.max(...temps), 0) })
            : tf(t("an_w_abtau_d"), { d: z(m, 0) }),
          richt: t("an_r_abtauung"), text: t(m > 15 ? "an_ab_lang" : warm ? "an_ab_warm" : "an_ab_ok"),
          tipp: stufe === "ok" ? "" : t("an_tip_abtauung"), quelle: "abtauung",
        });
      }
    }

    /* ---------- Warmwasser und Anlage ---------- */
    // Der Speicher faellt bis Soll plus Schaltdifferenz (TOP22, negativ),
    // erst dann wird nachgeladen. Empfehlung: durchgaengig ueber 55 °C.
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
      let text = tief !== null ? tf(t("an_ww_ok"), { m: z(tief, 0) }) : tf(t("an_ww_ok"), { m: z(wwSoll, 0) });
      let tipp = "";
      let aktion = null;
      if (basis < 55) {
        stufe = "hinweis";
        text = tief !== null ? tf(t("an_ww_tief"), { s: z(wwSoll, 0), d: z(-schritt, 0), m: z(tief, 0) }) : t("an_ww_niedrig");
        tipp = t(tief !== null ? "an_tip_ww_tief" : "an_tip_ww_niedrig");
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
      } else if (tief !== null && tief > 60) {
        stufe = "hinweis";
        text = tf(t("an_ww_hoch"), { m: z(tief, 0) });
        tipp = t("an_tip_ww_hoch");
        const neuSoll = Math.max(40, 55 + schritt);
        aktion = this._anVorschlag([this._anAenderung("dhw_setpoint", neuSoll, "SetDHWTemp", "°C")],
          tf(t("an_g_ww_hoch"), { m: z(tief, 0), n: z(neuSoll - schritt, 0) }));
      }
      const teile = [tief !== null ? tf(t("an_w_ww_tief"), { m: z(tief, 0) }) : t("an_w_ww_soll")];
      if (steril !== null) teile.push(tf(t("an_w_steril"), { s: z(steril, 0) }));
      punkt({
        gruppe: "anlage", id: "warmwasser", stufe, titel: t("an_t_warmwasser"), wert: `${z(wwSoll, 0)} °C`,
        wertText: teile.join(" · "), richt: t("an_r_warmwasser"), text, tipp, quelle: "warmwasser", aktion,
      });
    }
    // 0 bar heisst: kein Sensor (TOP115 gibt es nur bei K- und L-Serie).
    const druck = this._anWert("water_pressure");
    if (druck !== null && druck > 0.05) {
      const stufe = druck >= 1.2 && druck <= 2.3 ? "ok" : "hinweis";
      punkt({
        gruppe: "anlage", id: "druck", stufe, titel: t("an_t_druck"), wert: `${z(druck)} bar`, richt: t("an_r_druck"),
        text: t(stufe === "ok" ? "an_dr_ok" : druck < 1.2 ? "an_dr_niedrig" : "an_dr_hoch"),
        tipp: stufe === "ok" ? "" : t(druck < 1.2 ? "an_tip_dr_niedrig" : "an_tip_dr_hoch"), quelle: "druck",
      });
    }
    const jaz = this._config.demo ? { jaz: 4.3 } : this._jaz && this._jaz.gesamt;
    if (jaz && Number.isFinite(jaz.jaz)) {
      const j = jaz.jaz;
      const stufe = j >= 3.0 ? "ok" : "hinweis";
      punkt({
        gruppe: "anlage", id: "jaz", stufe, titel: t("an_t_jaz"), wert: z(j), wertText: t("an_w_jaz"), richt: t("an_r_jaz"),
        text: `${t(j >= 3.4 ? "an_jaz_gut" : j >= 3.0 ? "an_jaz_ok" : "an_jaz_niedrig")} ${t("an_jaz_hinweis")}`,
        tipp: stufe === "ok" ? "" : t("an_tip_jaz"), quelle: "jaz",
      });
    }
    const err = rawState(this._quelle, this._e("error"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    if (this._e("error")) {
      const stoerung = err !== null && !harmlos.includes(err);
      punkt({
        gruppe: "anlage", id: "stoerung", stufe: stoerung ? "pruefen" : "ok", titel: t("an_t_stoerung"),
        wert: stoerung ? err : t("an_keine"), text: t(stoerung ? "an_st_ja" : "an_st_nein"),
        tipp: stoerung ? t("an_tip_stoerung") : "", quelle: "",
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
    const zahl = { ok: 0, hinweis: 0, pruefen: 0, unbekannt: 0 };
    punkte.forEach((p) => zahl[p.stufe]++);
    const bewertet = zahl.ok + zahl.hinweis + zahl.pruefen;
    const offen = punkte.filter((p) => p.stufe === "pruefen").concat(punkte.filter((p) => p.stufe === "hinweis"));
    let titel = "an_g_gut";
    if (zahl.pruefen) titel = "an_g_pruefen";
    else if (zahl.hinweis) titel = "an_g_hinweis";
    if (!bewertet) titel = "an_g_leer";
    const potenzial = offen.slice(0, 3).map((p) => p.titel).join(", ");

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
            return `<div class="lhc-an-karte" style="border-left-color:${st.farbe}">
                <div class="lhc-an-kopf"><b>${escapeHtml(p.titel)}</b>
                  <i style="color:${st.farbe};background:${st.farbe}22">${escapeHtml(this._t(st.text))}</i></div>
                <div class="lhc-an-wert"><span><b>${escapeHtml(p.wert)}</b> ${escapeHtml(p.wertText || "")}</span>
                  ${p.richt ? `<span>${escapeHtml(this._t("an_richtwert"))} <b>${escapeHtml(p.richt)}</b></span>` : ""}</div>
                ${p.text ? `<p>${escapeHtml(p.text)}</p>` : ""}
                ${p.tipp ? `<p class="lhc-an-tipp">${escapeHtml(p.tipp)}</p>` : ""}
                ${p.aktion ? `<button type="button" class="lhc-an-knopf" data-vorschlag="${nr}">⚙ ${escapeHtml(this._t("an_opt_knopf"))}</button>` : ""}
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
