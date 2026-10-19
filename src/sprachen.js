/**
 * Eigene Sprachpakete: Ablage, Pruefung, Export.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { HILFE } from "./hilfe-daten.js";
import { dezimalFuer } from "./hilfsfunktionen.js";
import { CARD_VERSION } from "./konstanten.js";
import { SPRACHEN, TEXTE, t } from "./texte.js";

/* ------------------------------------------------------------------ *
 *  Eigene Sprachen zum Exportieren und Importieren
 * ------------------------------------------------------------------ */
export const SPRACH_FORMAT = "lutarym-sprachpaket";

export const SPRACH_VERSION = 1;

export const SPRACH_NAMEN = { de: "Deutsch", en: "English", fr: "Français", ja: "日本語" };

/** Eingelesene Sprachpakete je Sprachcode, aus der Kartenkonfiguration. */
export const EIGENE_SPRACHEN = {};

/** Zaehler, damit die Karte nach einem neuen Paket neu zeichnet. */
export let SPRACH_STAND = 0;

/**
 * Texte werden an vielen Stellen als HTML eingesetzt. Zeichen, mit denen
 * ein fremder Text Markup oder Attribute einschleusen koennte, sind in
 * Sprachpaketen deshalb nicht erlaubt.
 */
export const SPRACH_VERBOTEN = /[<>"`]/;

/**
 * Uebernimmt die Pakete einer Kartenkonfiguration in die gemeinsame
 * Ablage. Mehrere Karten teilen sich die Ablage, deshalb wird hier nur
 * ergaenzt; entfernt wird ausdruecklich ueber "entfernen".
 */
export function registriereSprachen(config, entfernen) {
  const liste = config && Array.isArray(config.language_custom) ? config.language_custom : [];
  let geaendert = false;
  if (entfernen && EIGENE_SPRACHEN[entfernen]) {
    delete EIGENE_SPRACHEN[entfernen];
    geaendert = true;
  }
  liste.forEach((p) => {
    if (!p || typeof p.code !== "string" || !p.texte || typeof p.texte !== "object") return;
    if (p.code === entfernen) return;
    const texte = {};
    Object.keys(p.texte).forEach((k) => {
      const w = p.texte[k];
      if (typeof w === "string" && !SPRACH_VERBOTEN.test(w)) texte[k] = w;
    });
    const sauber = { ...p, texte, hilfe: p.hilfe && typeof p.hilfe === "object" ? p.hilfe : {} };
    if (JSON.stringify(EIGENE_SPRACHEN[p.code]) !== JSON.stringify(sauber)) {
      EIGENE_SPRACHEN[p.code] = sauber;
      geaendert = true;
    }
  });
  if (geaendert) SPRACH_STAND++;
}

/** Kennt die Karte diese Sprache, eingebaut oder als Paket? */
export function spracheBekannt(code) {
  return SPRACHEN.includes(code) || Boolean(EIGENE_SPRACHEN[code]);
}

/** Text eines Hilfeeintrags oder Gruppentitels in der Sprache. */
export function hilfeText(sp, schluessel, mehrsprachig) {
  const paket = EIGENE_SPRACHEN[sp];
  const eigen = paket && paket.hilfe && paket.hilfe[schluessel];
  if (typeof eigen === "string" && eigen) return eigen;
  const basis = paket && paket.basis;
  return mehrsprachig[sp] || (basis && mehrsprachig[basis]) || mehrsprachig.en || mehrsprachig.de || "";
}

/** Sprachpaket zum Exportieren: alle Texte und die Hilfe einer Sprache. */
export function sprachpaketFuer(code) {
  const paket = EIGENE_SPRACHEN[code];
  const sp = spracheBekannt(code) ? code : "en";
  const texte = {};
  Object.keys(TEXTE).sort().forEach((k) => {
    texte[k] = t(k, sp);
  });
  const hilfe = {};
  HILFE.forEach((g) => {
    hilfe[g.id] = hilfeText(sp, g.id, g.titel);
    g.e.forEach((e, i) => {
      hilfe[`${g.id}.${i}.n`] = hilfeText(sp, `${g.id}.${i}.n`, e.n);
      hilfe[`${g.id}.${i}.t`] = hilfeText(sp, `${g.id}.${i}.t`, e.t);
    });
  });
  return {
    format: SPRACH_FORMAT,
    version: SPRACH_VERSION,
    karte: CARD_VERSION,
    code: sp,
    name: paket ? paket.name : SPRACH_NAMEN[sp] || sp,
    basis: paket ? paket.basis : sp === "ja" ? "en" : sp,
    dezimal: paket ? paket.dezimal : dezimalFuer(sp),
    texte,
    hilfe,
  };
}

/** Platzhalter wie {v} in einem Text. */
export function platzhalter(text) {
  return (String(text).match(/\{\w+\}/g) || []).sort().join(",");
}

/**
 * Prueft ein eingelesenes Sprachpaket. Unbekannte Schluessel werden
 * verworfen. Fehlt ein Text oder stimmen die Platzhalter nicht, gilt
 * dort der Text der Grundsprache.
 */
export function pruefeSprache(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_s_format" };
  if (roh.format !== SPRACH_FORMAT) return { fehler: "m_s_format" };
  if (Number(roh.version) !== SPRACH_VERSION) return { fehler: "m_s_version" };
  const code = String(roh.code || "").trim();
  if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(code)) return { fehler: "m_s_code" };
  if (!roh.texte || typeof roh.texte !== "object" || Array.isArray(roh.texte)) {
    return { fehler: "m_s_texte" };
  }
  const basis = SPRACHEN.includes(roh.basis) ? roh.basis : SPRACHEN.includes(code) ? code : "en";
  const texte = {};
  const unbekannt = [];
  const platz = [];
  const zeichen = [];
  Object.keys(roh.texte).forEach((k) => {
    const w = roh.texte[k];
    if (!TEXTE[k]) {
      unbekannt.push(k);
      return;
    }
    if (typeof w !== "string" || !w.trim()) return;
    if (SPRACH_VERBOTEN.test(w)) {
      zeichen.push(k);
      return;
    }
    if (platzhalter(w) !== platzhalter(TEXTE[k][basis] || TEXTE[k].en)) {
      platz.push(k);
      return;
    }
    texte[k] = w;
  });
  const hilfe = {};
  const gueltig = new Set();
  HILFE.forEach((g) => {
    gueltig.add(g.id);
    g.e.forEach((e, i) => {
      gueltig.add(`${g.id}.${i}.n`);
      gueltig.add(`${g.id}.${i}.t`);
    });
  });
  if (roh.hilfe && typeof roh.hilfe === "object" && !Array.isArray(roh.hilfe)) {
    Object.keys(roh.hilfe).forEach((k) => {
      const w = roh.hilfe[k];
      if (!gueltig.has(k)) {
        unbekannt.push(k);
        return;
      }
      if (typeof w === "string" && w.trim()) hilfe[k] = w;
    });
  }
  if (!Object.keys(texte).length) return { fehler: "m_s_texte" };
  const fehlen = Object.keys(TEXTE).filter((k) => !texte[k]).length;
  return {
    paket: {
      format: SPRACH_FORMAT,
      version: SPRACH_VERSION,
      code,
      name: String(roh.name || code).trim().slice(0, 40) || code,
      basis,
      dezimal: roh.dezimal === "," || roh.dezimal === "." ? roh.dezimal : dezimalFuer(basis),
      texte,
      hilfe,
    },
    unbekannt,
    platz,
    zeichen,
    fehlen,
  };
}
