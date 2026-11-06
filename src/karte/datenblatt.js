/**
 * Datenblaetter fuer den COP-Vergleich: je Geraet die COP-Werte der
 * Pruefpunkte nach EN 14511 aus dem Datenblatt des Herstellers.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Panasonic Aquarea T-CAP M 12 kW (WH-WXG12ME5, WH-WXG12ME8), Katalog
 * "Neue Aquarea T-CAP M-Serie" 2025 (DE-LFLTAQM2501), gleich im
 * EU-Katalog 2024; Heizleistung an allen Punkten 12,00 kW:
 *   Vorlauf 35 °C: A+7 5,06 · A+2 3,54 · A-7 3,00
 *   Vorlauf 55 °C: A+7 3,23 · A+2 2,42 · A-7 2,17
 *
 * Zwischen den Pruefpunkten wird linear ueber den Guetegrad gerechnet
 * (gemessener COP geteilt durch den Carnot-COP), erst nach Aussen-, dann
 * nach Vorlauftemperatur. An den Pruefpunkten ergibt das genau den
 * Datenblattwert; die Rechenweise dazwischen ist eine eigene Festlegung
 * der Karte. datenblattCop liefert nur innerhalb der Pruefpunkte einen Wert.
 *
 * Ausserhalb der Pruefpunkte schaetzt die Karte (eigene Festlegung, in der
 * Karte als Schaetzung gekennzeichnet):
 *  - waermer als +7 °C oder Vorlauf unter 35 °C: es gilt der Wert am Rand
 *    der Pruefpunkte. Die Karte nimmt also keinen hoeheren COP an, als das
 *    Datenblatt fuer +7 °C und 35 °C nennt, obwohl eine waermere Quelle und
 *    ein tieferer Vorlauf den COP physikalisch heben. Eine Bewertung
 *    beruht dort so nie auf einem hochgerechneten Wert.
 *  - kaelter als -7 °C oder Vorlauf ueber 55 °C: der Guetegrad am Rand mal
 *    dem Carnot-COP der tatsaechlichen Temperaturen; der Wert sinkt so mit
 *    dem groesseren Temperaturhub. Ob der Guetegrad dort gleich bleibt,
 *    belegt das Datenblatt nicht; darum nur Schaetzung.
 *
 * Toleranz: HP KEYMARK, Annex A (Rev. 11, 06.12.2023), A.4.2.1: Die
 * Toleranz auf Heizleistung und COP an Normpunkten nach EN 14511-2 ist
 * -8 % des erklaerten Werts. Ab 92 % des Datenblatts liegt ein Lauf
 * darum im Rahmen.
 */

export const DATENBLAETTER = {
  panasonic_tcap_m_12: {
    name: "Panasonic Aquarea T-CAP M 12 kW (WH-WXG12ME5/ME8)",
    aussen: [-7, 2, 7],
    vorlauf: [35, 55],
    cop: { 35: [3.0, 3.54, 5.06], 55: [2.17, 2.42, 3.23] },
  },
};

/** Anteil des Datenblattwerts, ab dem ein Lauf im Rahmen liegt (HP KEYMARK). */
export const TOLERANZ = 0.92;

const K = 273.15;

/** Carnot-COP fuer Heizen aus Aussen- und Vorlauftemperatur in °C. */
function carnot(aussen, vorlauf) {
  return (vorlauf + K) / (vorlauf - aussen);
}

/**
 * Vergleichswert aus dem Datenblatt fuer einen Lauf, oder null, wenn kein
 * Datenblatt gewaehlt ist oder der Lauf ausserhalb der Pruefpunkte liegt.
 */
export function datenblattCop(kennung, aussen, vorlauf) {
  const db = DATENBLAETTER[kennung];
  if (!db || !Number.isFinite(aussen) || !Number.isFinite(vorlauf)) return null;
  const a = db.aussen;
  const [w0, w1] = db.vorlauf;
  if (aussen < a[0] || aussen > a[a.length - 1] || vorlauf < w0 || vorlauf > w1) return null;
  // Guetegrad an der Aussentemperatur fuer eine Vorlaufstufe des Datenblatts.
  const guete = (w) => {
    const g = db.cop[w].map((c, i) => c / carnot(a[i], w));
    let i = 0;
    while (i < a.length - 2 && aussen > a[i + 1]) i++;
    const t = (aussen - a[i]) / (a[i + 1] - a[i]);
    return g[i] + t * (g[i + 1] - g[i]);
  };
  const s = (vorlauf - w0) / (w1 - w0);
  const g = guete(w0) + s * (guete(w1) - guete(w0));
  return g * carnot(aussen, vorlauf);
}

/**
 * Vergleichswert auch ausserhalb der Pruefpunkte, dort nur geschaetzt
 * (siehe oben). Ergebnis { wert, geschaetzt } oder null ohne Datenblatt.
 */
export function datenblattSchaetzung(kennung, aussen, vorlauf) {
  const db = DATENBLAETTER[kennung];
  if (!db || !Number.isFinite(aussen) || !Number.isFinite(vorlauf)) return null;
  const genau = datenblattCop(kennung, aussen, vorlauf);
  if (genau !== null) return { wert: genau, geschaetzt: false };
  const a = db.aussen;
  const [w0, w1] = db.vorlauf;
  // Leichtere Bedingungen auf den Rand begrenzen, schwerere behalten.
  const aEff = Math.min(aussen, a[a.length - 1]);
  const wEff = Math.max(vorlauf, w0);
  const aRand = Math.max(aEff, a[0]);
  const wRand = Math.min(wEff, w1);
  const rand = datenblattCop(kennung, aRand, wRand);
  if (rand === null) return null;
  const guete = rand / carnot(aRand, wRand);
  return { wert: guete * carnot(aEff, wEff), geschaetzt: true };
}
