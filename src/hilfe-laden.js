/**
 * Laedt die Hilfedaten erst bei Bedarf aus einer eigenen Datei.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Die Hilfe ist gross und wird nur gebraucht, wenn jemand das Hilfefenster
 * oder den Editor oeffnet. Sie liegt deshalb in einer zweiten Datei neben
 * der Karte. HACS laedt alle .js-Dateien aus dist herunter. Die Version
 * im Aufruf sorgt dafuer, dass nach einem Update nicht die alte Datei aus
 * dem Browser-Cache kommt.
 */
import { CARD_VERSION } from "./konstanten.js";

export const HILFE_DATEI = "heatpump-flow-card-by-lutarym-hilfe.js";

let laden = null;
let daten = null;

/** Hilfedaten, falls schon geladen, sonst null. */
export function hilfeDaten() {
  return daten;
}

/** Laedt die Hilfedaten einmal. Schlaegt es fehl, wird spaeter neu versucht. */
export function ladeHilfe() {
  if (daten) return Promise.resolve(daten);
  if (!laden) {
    const url = new URL(`./${HILFE_DATEI}?v=${CARD_VERSION}`, import.meta.url).href;
    laden = import(/* @vite-ignore */ url)
      .then((m) => {
        daten = Array.isArray(m.HILFE) ? m.HILFE : [];
        return daten;
      })
      .catch((fehler) => {
        laden = null;
        throw fehler;
      });
  }
  return laden;
}
