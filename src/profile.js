/**
 * Geraeteprofile: Laden aus dem Ordner Profile, Pruefung, eigene Profile.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Die Karte enthaelt selbst kein Profil. Die Profile liegen als Dateien in
 * dist/Profile, eine Datei je Hersteller mit einer Variante je Integration
 * oder Firmware. Die Liste aller Dateien (liste.json) erzeugt der Build.
 * Gewaehlt wird immer eine Variante, ihre Kennung steht in "profil".
 */
import { ARTEN, BISHER, EINHEITEN, istName } from "./namen.js";
import { CARD_VERSION } from "./konstanten.js";

/** Automatisch suchen. */
export const AUTO_PROFIL = "auto";

/** Kein Profil, die Entitaeten traegt der Nutzer selbst ein. */
export const KEIN_PROFIL = "keins";

export const PROFIL_FORMAT = "lutarym-geraeteprofil";
export const PROFIL_VERSION = 2;
const LISTEN_FORMAT = "lutarym-profilliste";

/** Ordner der Profile im Zweig main des Repositorys der Karte. */
export const GITHUB_PROFILE = "https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/dist/Profile/";

const KENNUNG = /^[a-z0-9_-]{2,40}$/;
const SUCHARTEN = ["integration", "core", "firmware"];

/* ------------------------------------------------------------------ *
 *  Laden
 * ------------------------------------------------------------------ */
const speicher = { liste: null, listeLaeuft: null, fehler: false, dateien: {}, laeuft: {}, fertig: {}, kaputt: {} };

/** Adresse einer Datei im Ordner Profile neben der Karte. */
function adresse(datei) {
  return new URL(`./Profile/${datei}?v=${encodeURIComponent(CARD_VERSION)}`, import.meta.url).href;
}

async function holeJson(url, optionen) {
  const antwort = await fetch(url, optionen);
  if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
  return antwort.json();
}

/**
 * Laedt liste.json einmal je Seite. Schlaegt das fehl, bleibt es dabei,
 * bis profileNeuVersuchen() aufgerufen wird.
 */
export function ladeListe() {
  if (speicher.liste) return Promise.resolve(speicher.liste);
  if (!speicher.listeLaeuft) {
    speicher.listeLaeuft = holeJson(adresse("liste.json"))
      .then((roh) => {
        const liste = pruefeListe(roh);
        if (!liste) throw new Error("liste.json");
        speicher.liste = liste;
        speicher.fehler = false;
        return liste;
      })
      .catch((e) => {
        speicher.fehler = true;
        throw e;
      });
  }
  return speicher.listeLaeuft;
}

/** Laedt eine Profildatei einmal je Seite. */
export function ladeDatei(datei) {
  if (speicher.dateien[datei]) return Promise.resolve(speicher.dateien[datei]);
  if (!speicher.laeuft[datei]) {
    speicher.laeuft[datei] = holeJson(adresse(datei))
      .then((roh) => {
        const erg = pruefeDatei(roh);
        if (erg.fehler) throw new Error(erg.fehler);
        speicher.dateien[datei] = erg.datei;
        return erg.datei;
      })
      .catch((e) => {
        speicher.kaputt[datei] = true;
        throw e;
      })
      .finally(() => {
        speicher.fertig[datei] = true;
      });
  }
  return speicher.laeuft[datei];
}

/**
 * Ob die Kennung zu einem eigenen Profil gehoert, das ohne den Ordner
 * Profile auskommt. Eine Kopie von GitHub braucht ihn: Steht die Variante
 * dort gleich oder neuer, gilt die aus dem Ordner (gueltigeEigene).
 */
function nurEigen(config, id) {
  return eigeneVarianten(config).some((v) => v.id === id && v.herkunft !== "github");
}

/**
 * Laedt, was eine Konfiguration braucht: bei "auto" alle Profile, sonst
 * nur die Datei der gewaehlten Variante. Eigene Profile stehen in der
 * Konfiguration, dafuer wird nichts geladen. Eine fehlerhafte Datei
 * haelt bei "auto" die anderen nicht auf.
 */
export async function ladeFuer(config) {
  const id = profilKennung(config);
  if (id === KEIN_PROFIL || nurEigen(config, id)) return;
  const liste = await ladeListe();
  if (id === AUTO_PROFIL) {
    await Promise.all(liste.map((d) => ladeDatei(d.datei).catch(() => null)));
    return;
  }
  const d = liste.find((x) => x.varianten.some((v) => v.id === id));
  if (d) await ladeDatei(d.datei);
}

/**
 * Ob das Laden fuer die Konfiguration abgeschlossen ist, mit Erfolg oder
 * Fehler. Erst dann sucht die Karte nach Entitaeten.
 */
export function bereitFuer(config) {
  const id = profilKennung(config);
  if (id === KEIN_PROFIL || nurEigen(config, id)) return true;
  if (speicher.fehler) return true;
  if (!speicher.liste) return false;
  if (id === AUTO_PROFIL) return speicher.liste.every((d) => speicher.fertig[d.datei]);
  const d = dateiZu(id);
  return !d || Boolean(speicher.fertig[d.datei]);
}

/** Ob beim Laden fuer die Konfiguration etwas fehlgeschlagen ist. */
export function profileFehler(config) {
  if (speicher.fehler) return true;
  if (!speicher.liste) return false;
  const id = profilKennung(config);
  if (id === KEIN_PROFIL || eigeneVarianten(config).some((v) => v.id === id)) return false;
  if (id === AUTO_PROFIL) return speicher.liste.some((d) => speicher.kaputt[d.datei]);
  const d = dateiZu(id);
  return Boolean(d && speicher.kaputt[d.datei]);
}

/** Inhalt von liste.json, leer solange nicht geladen. */
export function profilListe() {
  return speicher.liste || [];
}

/** Erlaubt einen neuen Versuch fuer alles, was beim Laden fehlgeschlagen ist. */
export function profileNeuVersuchen() {
  if (speicher.fehler) {
    speicher.liste = null;
    speicher.listeLaeuft = null;
    speicher.fehler = false;
  }
  Object.keys(speicher.kaputt).forEach((d) => {
    delete speicher.kaputt[d];
    delete speicher.fertig[d];
    delete speicher.laeuft[d];
  });
}

/**
 * Liest liste.json und eine Profildatei aus dem Ordner Profile auf GitHub
 * (Zweig main). Nur auf Knopfdruck im Editor ("Profile aktualisieren").
 * Geprueft wird wie beim Laden aus dem eigenen Ordner.
 */
export async function githubListe() {
  const liste = pruefeListe(await holeJson(`${GITHUB_PROFILE}liste.json`, { cache: "no-store" }));
  if (!liste) throw new Error("liste.json");
  return liste;
}

export async function githubDatei(datei) {
  if (!/^[a-z0-9_-]+\.json$/.test(String(datei || ""))) throw new Error("datei");
  return pruefeDatei(await holeJson(`${GITHUB_PROFILE}${datei}`, { cache: "no-store" }));
}

/* ------------------------------------------------------------------ *
 *  Varianten
 * ------------------------------------------------------------------ */

/** Gewaehlte Kennung, "auto" wenn nichts gesetzt ist. */
export function profilKennung(config) {
  return (config && config.profil) || AUTO_PROFIL;
}

/** Variante einer geladenen Datei mit Angaben zur Datei. */
function mitDatei(v, d) {
  return { ...v, datei: d.id, dateiName: d.name, karte_ab: d.karte_ab, eigen: false };
}

/** Alle geladenen Varianten aus dem Ordner Profile. */
export function eingebauteVarianten() {
  const out = [];
  profilListe().forEach((eintrag) => {
    const d = speicher.dateien[eintrag.datei];
    if (d) d.varianten.forEach((v) => out.push(mitDatei(v, d)));
  });
  return out;
}

/**
 * Eigene Profile aus der Kartenkonfiguration. Eintraege im Format 1 (bis
 * 5.33.8, mit den frueheren Feldnamen) werden uebersetzt.
 */
const EIGENE_GEPRUEFT = new WeakMap();
export function eigeneVarianten(config) {
  const liste = config && Array.isArray(config.profile_custom) ? config.profile_custom : [];
  if (EIGENE_GEPRUEFT.has(liste)) return EIGENE_GEPRUEFT.get(liste);
  const out = [];
  liste.forEach((p) => {
    if (!p || typeof p !== "object") return;
    const roh = p.felder && !p.werte ? vonFormat1(p) : p;
    const erg = pruefeVariante(roh);
    if (erg.variante) {
      out.push({
        ...erg.variante,
        eigen: true,
        datei: "",
        dateiName: text(p.dateiName, 80),
        // Kennung der Datei auf GitHub, nur bei Kopien von dort.
        dateiId: KENNUNG.test(String(p.dateiId || "")) ? p.dateiId : "",
        herkunft: text(p.herkunft, 20),
      });
    }
  });
  EIGENE_GEPRUEFT.set(liste, out);
  return out;
}

/**
 * Ob Stand a neuer ist als Stand b: spaeteres Pruefdatum (abgelesen),
 * spaetere Aenderung der Integration (aktualisiert) oder hoehere Version.
 */
export function istNeuer(a, b) {
  const x = a || {};
  const y = b || {};
  return (x.abgelesen || "") > (y.abgelesen || "") || (x.aktualisiert || "") > (y.aktualisiert || "")
    || versionVergleich(x.version, y.version) > 0;
}

/**
 * Eigene Profile, die gelten. Eine Kopie von GitHub ist ueberholt, sobald
 * dieselbe Variante gleich oder neuer im Ordner Profile steht, etwa nach
 * einem Update ueber HACS. Dann gilt die aus dem Ordner (eigene
 * Festlegung). Verglichen wird mit der geladenen Variante, fehlt die,
 * gilt die Kopie.
 */
export function gueltigeEigene(config) {
  const eigene = eigeneVarianten(config);
  if (!eigene.some((v) => v.herkunft === "github")) return eigene;
  const eingebaut = eingebauteVarianten();
  return eigene.filter((v) => {
    if (v.herkunft !== "github") return true;
    const b = eingebaut.find((x) => x.id === v.id);
    return !b || istNeuer(v.quelle, b.quelle);
  });
}

/** Eigene und geladene Varianten, eigene ersetzen geladene mit derselben Kennung. */
export function alleVarianten(config) {
  const eigene = gueltigeEigene(config);
  const ids = new Set(eigene.map((v) => v.id));
  return eingebauteVarianten().filter((v) => !ids.has(v.id)).concat(eigene);
}

/** Variante zu einer Kennung, eigene zuerst, sonst null. */
export function varianteZu(config, id) {
  if (!id || id === AUTO_PROFIL || id === KEIN_PROFIL) return null;
  return gueltigeEigene(config).find((v) => v.id === id) || eingebauteVarianten().find((v) => v.id === id) || null;
}

/** Datei (Eintrag aus liste.json) zu einer Variante, sonst null. */
export function dateiZu(id) {
  return profilListe().find((d) => d.varianten.some((v) => v.id === id)) || null;
}

/** Regeln eines Werts als Liste, egal ob Kurz- oder Langform. */
export function regelnVon(w) {
  if (Array.isArray(w)) return w;
  if (w && typeof w === "object" && Array.isArray(w.suche)) return w.suche;
  return [];
}

/** Angaben zum Umrechnen eines Werts: { einheit: [...], zustaende: {...} } oder null. */
export function angabenVon(v, name) {
  const w = v && v.werte && v.werte[name];
  if (!w || Array.isArray(w)) return null;
  return { einheit: [].concat(w.einheit || []), zustaende: w.zustaende || null };
}

/* ------------------------------------------------------------------ *
 *  Pruefung
 * ------------------------------------------------------------------ */
function text(w, max) {
  return String(w === undefined || w === null ? "" : w).trim().slice(0, max);
}

/** Prueft liste.json. Liefert die Eintraege oder null. */
export function pruefeListe(roh) {
  if (!roh || roh.format !== LISTEN_FORMAT || !Array.isArray(roh.profile)) return null;
  return roh.profile
    .filter((d) => d && KENNUNG.test(String(d.id || "")) && /^[a-z0-9_-]+\.json$/.test(String(d.datei || "")))
    .map((d) => ({
      id: d.id,
      datei: d.datei,
      name: text(d.name, 80) || d.id,
      karte_ab: text(d.karte_ab, 20),
      hersteller: Array.isArray(d.hersteller) ? d.hersteller.map((h) => text(h, 60)).filter(Boolean) : [],
      varianten: (Array.isArray(d.varianten) ? d.varianten : [])
        .filter((v) => v && KENNUNG.test(String(v.id || "")))
        .map((v) => ({
          id: v.id,
          name: text(v.name, 80) || v.id,
          art: SUCHARTEN.includes(v.art) ? v.art : "integration",
          integration: text(v.integration, 60),
          heishamon: v.heishamon === true,
          getestet: v.getestet === true,
          entwickler: text(v.entwickler, 60),
          version: text(v.version, 30),
          aktualisiert: text(v.aktualisiert, 10),
          abgelesen: text(v.abgelesen, 10),
          modelle: Number(v.modelle) || 0,
          werte: Number(v.werte) || 0,
        })),
    }))
    .filter((d) => d.varianten.length);
}

/**
 * Prueft eine Variante. Unbekannte Namen werden gemeldet und verworfen,
 * Einheiten, die die Karte nicht umrechnen kann, ebenso.
 */
export function pruefeVariante(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_p_format" };
  const id = text(roh.id, 40);
  if (!KENNUNG.test(id)) return { fehler: "m_p_id" };
  if (!roh.werte || typeof roh.werte !== "object" || Array.isArray(roh.werte)) return { fehler: "m_p_felder" };
  const werte = {};
  const unbekannt = [];
  Object.keys(roh.werte).forEach((name) => {
    if (!istName(name)) {
      unbekannt.push(name);
      return;
    }
    const w = roh.werte[name];
    const regeln = regelnVon(w).filter((r) => typeof r === "string" && r.trim()).map((r) => r.trim());
    if (!regeln.length) return;
    if (Array.isArray(w)) {
      werte[name] = regeln;
      return;
    }
    const lang = { suche: regeln };
    const erlaubt = EINHEITEN[name] || [];
    const einheit = [].concat(w.einheit || []).filter((e) => erlaubt.includes(e));
    if (einheit.length) lang.einheit = einheit.length === 1 ? einheit[0] : einheit;
    if (w.zustaende && typeof w.zustaende === "object" && !Array.isArray(w.zustaende)) {
      const z = {};
      Object.keys(w.zustaende).forEach((k) => {
        const zahl = Number(w.zustaende[k]);
        if (Number.isFinite(zahl)) z[String(k).toLowerCase()] = zahl;
      });
      if (Object.keys(z).length) lang.zustaende = z;
    }
    werte[name] = lang.einheit || lang.zustaende ? lang : regeln;
  });
  if (!Object.keys(werte).length) return { fehler: "m_p_felder" };
  const suche = roh.suche && typeof roh.suche === "object" ? roh.suche : {};
  const quelle = roh.quelle && typeof roh.quelle === "object" ? roh.quelle : {};
  const geraete = (Array.isArray(roh.geraete) ? roh.geraete : [])
    .filter((g) => g && typeof g === "object")
    .map((g) => ({
      hersteller: [].concat(g.hersteller || []).map((h) => text(h, 60)).filter(Boolean),
      reihe: text(g.reihe, 60),
      modelle: [].concat(g.modelle || []).map((m) => text(m, 80)).filter(Boolean),
      hinweis: text(g.hinweis, 300),
    }));
  return {
    variante: {
      id,
      name: text(roh.name, 80) || id,
      geraete,
      quelle: {
        entwickler: text(quelle.entwickler, 60),
        adresse: /^https:\/\//.test(String(quelle.adresse || "")) ? text(quelle.adresse, 200) : "",
        version: text(quelle.version, 30),
        aktualisiert: text(quelle.aktualisiert, 10),
        abgelesen: text(quelle.abgelesen, 10),
      },
      suche: {
        art: SUCHARTEN.includes(suche.art) ? suche.art : "integration",
        integration: text(suche.integration, 60),
        namensteil: text(suche.namensteil, 60),
      },
      heishamon: roh.heishamon === true,
      getestet: roh.getestet === true,
      werte,
    },
    unbekannt,
  };
}

/** Prueft eine Profildatei im Format 2. */
export function pruefeDatei(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_p_format" };
  if (roh.format !== PROFIL_FORMAT) return { fehler: "m_p_format" };
  if (Number(roh.version) !== PROFIL_VERSION) return { fehler: "m_p_version" };
  const id = text(roh.id, 40);
  if (!KENNUNG.test(id)) return { fehler: "m_p_id" };
  const varianten = [];
  const unbekannt = [];
  (Array.isArray(roh.varianten) ? roh.varianten : []).forEach((v) => {
    const erg = pruefeVariante(v);
    if (erg.variante) {
      varianten.push(erg.variante);
      erg.unbekannt.forEach((n) => unbekannt.push(n));
    }
  });
  if (!varianten.length) return { fehler: "m_p_felder" };
  return {
    datei: { format: PROFIL_FORMAT, version: PROFIL_VERSION, id, name: text(roh.name, 80) || id, karte_ab: text(roh.karte_ab, 20), varianten },
    unbekannt,
  };
}

/** Vergleicht Versionen wie 6.0.0. Liefert -1, 0 oder 1. */
export function versionVergleich(a, b) {
  const x = String(a || "0").split(".").map((n) => parseInt(n, 10) || 0);
  const y = String(b || "0").split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

/**
 * Uebersetzt ein Profil im Format 1 (bis 5.33.8): Feldnamen nach der
 * Namensliste. Ein Profil fuer HeishaMon behaelt die HeishaMon Funktionen
 * (eigene Festlegung: Integration heishamon_lutarym, Namensteil oder
 * Kennung mit heishamon).
 */
export function vonFormat1(roh) {
  const werte = {};
  Object.keys(roh.felder || {}).forEach((feld) => {
    const name = BISHER[feld] || feld;
    werte[name] = [].concat(roh.felder[feld]);
  });
  const integration = text(roh.integration, 60);
  const namensteil = text(roh.namensteil, 60);
  const heishamon = integration === "heishamon_lutarym" || /heishamon/i.test(namensteil) || /^heishamon/.test(String(roh.id || ""));
  return {
    id: roh.id,
    name: roh.name,
    geraete: roh.hersteller ? [{ hersteller: [String(roh.hersteller)] }] : [],
    quelle: { entwickler: roh.entwickler || "" },
    suche: { art: "integration", integration, namensteil },
    heishamon,
    getestet: false,
    werte,
  };
}

/**
 * Prueft eine eingelesene Datei: Format 2 mit einer oder mehreren
 * Varianten oder ein Profil im Format 1.
 */
export function pruefeProfil(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_p_format" };
  if (roh.format !== PROFIL_FORMAT) return { fehler: "m_p_format" };
  if (Number(roh.version) === 1) {
    if (!roh.felder || typeof roh.felder !== "object") return { fehler: "m_p_felder" };
    const erg = pruefeVariante(vonFormat1(roh));
    if (erg.fehler) return erg;
    return { varianten: [erg.variante], name: erg.variante.name, karte_ab: "", unbekannt: erg.unbekannt };
  }
  const erg = pruefeDatei(roh);
  if (erg.fehler) return erg;
  return { varianten: erg.datei.varianten, name: erg.datei.name, karte_ab: erg.datei.karte_ab, unbekannt: erg.unbekannt };
}

/** Eine Variante als Datei im Format 2, zum Exportieren. */
export function alsDatei(v) {
  const sauber = {
    id: v.id,
    name: v.name,
    geraete: v.geraete || [],
    quelle: v.quelle || {},
    suche: v.suche || {},
    heishamon: v.heishamon === true,
    getestet: v.getestet === true,
    werte: v.werte || {},
  };
  return {
    format: PROFIL_FORMAT,
    version: PROFIL_VERSION,
    id: v.datei || v.id,
    name: v.dateiName || v.name,
    karte_ab: v.karte_ab || "6.0.0",
    varianten: [sauber],
  };
}

/** Erlaubte Entitaetsarten eines Namens, null heisst alle. */
export function feldArten(name) {
  return ARTEN[name] || null;
}

/* ------------------------------------------------------------------ *
 *  Bereiche fuer die Profilinfo
 * ------------------------------------------------------------------ */
const BEREICHE = {
  b_temp: ["TOP5", "TOP6", "TOP10", "TOP14"],
  b_verdichter: ["TOP8", "TOP62", "TOP63"],
  b_ventil: ["TOP20"],
  b_pumpe: ["TOP1", "TOP65", "TOP95", "SET42", "EXT400", "EXT401"],
  b_heizkreise: ["TOP27", "TOP34", "TOP36", "TOP37", "TOP42", "TOP43", "TOP94", "TOP123", "TOP124", "SET17",
    "EXT200", "EXT201", "EXT202", "EXT203", "EXT204", "EXT205", "EXT206", "EXT207", "EXT208", "EXT209"],
  b_puffer: ["TOP7", "TOP46", "TOP99", "TOP113", "SET28"],
  b_warmwasser: ["TOP2", "TOP9", "TOP22", "TOP58", "TOP69", "TOP70", "TOP71", "TOP91", "TOP100", "SET10", "SET13", "SET44",
    "EXT402", "EXT403", "EXT404"],
  b_zusatz: ["TOP47", "TOP59", "TOP60", "TOP61", "TOP78", "TOP90", "OPT5", "SET45", "EXT300", "EXT301"],
  b_energie: ["EXT1", "EXT2", "EXT3", "EXT4", "EXT600", "EXT601"],
  b_zaehler: ["TOP11", "TOP12"],
  b_status: ["TOP0", "TOP4", "TOP26", "TOP44", "TOP115", "SET1", "SET9"],
  b_kurve: ["TOP29", "TOP30", "TOP31", "TOP32", "TOP82", "TOP83", "TOP84", "TOP85"],
  b_sg: ["EXT100", "EXT101"],
  b_analyse: ["TOP15", "TOP16", "TOP40", "TOP41", "TOP92", "TOP147", "TOP149", "TOP154", "TOP155", "TOP156", "TOP157",
    "TOP159", "TOP169", "TOP177", "TOP178", "TOP184", "TOP185", "TOP187", "TOP188", "TOP193", "TOP195", "TOP196",
    "XTOP0", "XTOP2", "XTOP3", "XTOP5", "EXT5", "EXT405", "EXT406", "EXT407", "EXT408", "EXT409", "EXT410", "EXT411",
    "EXT412", "EXT413", "EXT414", "EXT415", "EXT416", "EXT417", "EXT418", "EXT700", "EXT701", "EXT702", "EXT703",
    "EXT704", "EXT705", "EXT706"],
};

/** Liefert die Bereiche (Textschluessel) zu einer Liste von Namen. */
export function profilBereiche(namen) {
  const reihe = Object.keys(BEREICHE).concat("b_sonstige");
  const out = [];
  namen.forEach((n) => {
    const k = Object.keys(BEREICHE).find((b) => BEREICHE[b].includes(n)) || "b_sonstige";
    if (!out.includes(k)) out.push(k);
  });
  return out.sort((a, b) => reihe.indexOf(a) - reihe.indexOf(b));
}
