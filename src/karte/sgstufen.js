/**
 * SG-Ready-Stufe aus dem Verlauf der Kontakte K1 und K2.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Zuordnung wie in der Anzeige der Karte: K1 an und K2 aus = 1 (Sperre),
 * beide aus = 2 (Normalbetrieb), K1 aus und K2 an = 3 (Einschaltempfehlung),
 * beide an = 4 (Anlaufbefehl). Ist ein Kontakt unbekannt, ist die Stufe null.
 *
 * Als "ueber SG Ready" gilt ein Lauf oder eine Ladung, wenn waehrend der
 * Zeit Stufe 3 oder 4 anlag. Sperre und unbekannter Zustand zaehlen nicht
 * als SG Ready (Festlegung des Nutzers).
 */
import { indexBis, zustandAn } from "../hilfsfunktionen.js";

/** Stufenreihe [{ t, stufe }] aus den Reihen [{ t, s }] von K1 und K2. */
export function sgReihe(r1, r2) {
  if (!r1 || !r2 || !r1.length || !r2.length) return [];
  const zeiten = [...new Set([...r1, ...r2].map((p) => p.t))].sort((a, b) => a - b);
  return zeiten.map((t) => {
    const i1 = indexBis(r1, t);
    const i2 = indexBis(r2, t);
    const a = i1 >= 0 ? zustandAn(r1[i1].s) : null;
    const b = i2 >= 0 ? zustandAn(r2[i2].s) : null;
    let stufe = null;
    if (a !== null && b !== null) stufe = a && !b ? 1 : !a && !b ? 2 : !a && b ? 3 : 4;
    return { t, stufe };
  });
}

/** Lag im Zeitraum Stufe 3 oder 4 an? */
export function sgVerstaerkt(sg, von, bis) {
  if (!sg || !sg.length) return false;
  // Ab dem Stand, der zu Beginn gilt, bis zum Ende.
  for (let i = Math.max(0, indexBis(sg, von)); i < sg.length && sg[i].t < bis; i++) {
    if (sg[i].stufe === 3 || sg[i].stufe === 4) return true;
  }
  return false;
}
