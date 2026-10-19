/**
 * Kleine Helfer: Zustaende lesen, Zahlen formatieren, Farben, HTML schuetzen.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { BUBBLE_DAUER, LOAD_STOPS, NEUTRAL, THERMAL_STOPS } from "./konstanten.js";
import { EIGENE_SPRACHEN } from "./sprachen.js";

/** Wuenscht das Geraet weniger Bewegung (Systemeinstellung)? */
export function bewegungReduziert() {
  try {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) {
    return false;
  }
}

/**
 * Laeuft die Animation? Option animate: true (Ein, Standard), false (Aus)
 * oder "auto" (das Geraet entscheidet ueber "Bewegung reduzieren").
 */
export function animationAn(config) {
  const a = config ? config.animate : true;
  if (a === false) return false;
  if (a === "auto") return !bewegungReduziert();
  return true;
}

export function loadColor(value, min, max) {
  // Steht der Verdichter, gibt es keine Last und damit keine Farbe.
  if (value === null || value === undefined || Number.isNaN(value)) return NEUTRAL;
  if (value <= 0) return NEUTRAL;
  const span = max - min || 1;
  const p = clamp((value - min) / span, 0, 1);
  let a = LOAD_STOPS[0];
  let b = LOAD_STOPS[LOAD_STOPS.length - 1];
  for (let i = 0; i < LOAD_STOPS.length - 1; i++) {
    if (p >= LOAD_STOPS[i].p && p <= LOAD_STOPS[i + 1].p) {
      a = LOAD_STOPS[i];
      b = LOAD_STOPS[i + 1];
      break;
    }
  }
  const local = (p - a.p) / ((b.p - a.p) || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function bubbleDauer(idx) {
  if (BUBBLE_DAUER[idx] === undefined) {
    let seed = idx + 42;
    seed = (seed * 1103515245 + 12345) % 2147483648;
    BUBBLE_DAUER[idx] = 4 + (seed / 2147483648) * 4;
  }
  return BUBBLE_DAUER[idx];
}

export function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

export function thermalColor(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) return NEUTRAL;
  const span = max - min || 1;
  const p = clamp((value - min) / span, 0, 1);
  let a = THERMAL_STOPS[0];
  let b = THERMAL_STOPS[THERMAL_STOPS.length - 1];
  for (let i = 0; i < THERMAL_STOPS.length - 1; i++) {
    if (p >= THERMAL_STOPS[i].p && p <= THERMAL_STOPS[i + 1].p) {
      a = THERMAL_STOPS[i];
      b = THERMAL_STOPS[i + 1];
      break;
    }
  }
  const local = (p - a.p) / ((b.p - a.p) || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/* ------------------------------------------------------------------ *
 *  Zustandshelfer
 * ------------------------------------------------------------------ */
export function numState(hass, entityId) {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  if (!st) return null;
  const v = parseFloat(st.state);
  return Number.isNaN(v) ? null : v;
}

export function rawState(hass, entityId) {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  return st ? st.state : null;
}

export function attr(hass, entityId, key, fallback) {
  if (!hass || !entityId) return fallback;
  const st = hass.states[entityId];
  if (!st || st.attributes[key] === undefined) return fallback;
  return st.attributes[key];
}

export function isOn(hass, entityId) {
  const s = rawState(hass, entityId);
  if (s === null) return null;
  if (s === "on" || s === "true") return true;
  if (s === "off" || s === "false" || s === "unknown" || s === "unavailable") return false;
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n > 0;
}

/**
 * Dezimaltrennzeichen der gerade angezeigten Sprache. Deutsch und
 * Franzoesisch trennen mit Komma, Englisch und Japanisch mit Punkt.
 * Die Karte setzt den Wert vor jedem Zeichnen.
 */
export let DEZIMAL = ",";

/** Setzt das Dezimalzeichen, Importe sind von aussen nicht beschreibbar. */
export function setzeDezimal(z) {
  DEZIMAL = z;
}

export function dezimalFuer(sprache) {
  const paket = EIGENE_SPRACHEN[sprache];
  if (paket && (paket.dezimal === "," || paket.dezimal === ".")) return paket.dezimal;
  return sprache === "de" || sprache === "fr" ? "," : ".";
}

export function fmt(value, digits) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return value.toFixed(digits === undefined ? 1 : digits).replace(".", DEZIMAL);
}

export function friendly(hass, entityId) {
  return attr(hass, entityId, "friendly_name", entityId || "");
}

/**
 * Breite eines Namensfeldes aus der Textlaenge. Die Namen sind frei
 * konfigurierbar, feste Kastenbreiten wuerden bei langen Namen
 * ueberlaufen. Die Schrift ist 15px in Grossbuchstaben mit Sperrung.
 */
/**
 * Breite eines Abzeichens aus seinem Text. Die Beschriftungen sind
 * unterschiedlich lang, und in anderen Sprachen deutlich laenger als
 * im Deutschen. Ein fester Kasten wuerde dort ueberlaufen.
 */
export function abzeichenBreite(text) {
  const laenge = String(text || "").length;
  return Math.max(112, Math.round(laenge * 13 * 0.57) + 28);
}

/**
 * Nur number- und input_number-Entitaeten lassen sich stellen. Zeigt
 * jemand auf eine sensor-Entitaet, ist der Wert nur lesbar. Ohne diese
 * Pruefung wuerde Home Assistant mit "sensor.set_value nicht gefunden"
 * antworten.
 */
export function stellbar(id) {
  const bereich = String(id || "").split(".")[0];
  return bereich === "number" || bereich === "input_number";
}

export function schildBreite(text, mindest) {
  const laenge = String(text === undefined || text === null ? "" : text).length;
  return Math.max(mindest, Math.round(laenge * 15 * 0.66) + 24);
}

export function escapeHtml(text) {
  return String(text === undefined || text === null ? "" : text).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/**
 * Zeitgewichteter Mittelwert einer Verlaufsreihe zwischen start und ende.
 * Nur Zahlen groesser 0 zaehlen. Ohne gueltige Zeit ergibt sich null.
 */
export function copMittel(reihe, start, ende) {
  const punkte = reihe
    .map((pkt) => {
      const roh = pkt.s !== undefined ? pkt.s : pkt.state;
      let t = pkt.lu !== undefined ? pkt.lu * 1000 : Date.parse(pkt.last_updated || pkt.last_changed);
      if (Number.isNaN(t) || t < start) t = start;
      return { t, v: parseFloat(roh) };
    })
    .sort((a, b) => a.t - b.t);
  let summe = 0;
  let dauer = 0;
  for (let i = 0; i < punkte.length; i++) {
    const von = punkte[i].t;
    const bis = i + 1 < punkte.length ? punkte[i + 1].t : ende;
    const dt = bis - von;
    const v = punkte[i].v;
    if (dt > 0 && !Number.isNaN(v) && v > 0) {
      summe += v * dt;
      dauer += dt;
    }
  }
  return dauer > 0 ? summe / dauer : null;
}
