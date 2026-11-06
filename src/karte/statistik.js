/**
 * Statistik fuer Auswertungen mit Unsicherheit: gewichtete lineare
 * Regression (WLS) und Quantile der t-Verteilung.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 *
 * Grundlagen (Stand 06.11.2026):
 *  - NIST/SEMATECH e-Handbook of Statistical Methods, 4.1.4.3 "Weighted
 *    Least Squares Regression": Gewichte umgekehrt proportional zur
 *    Varianz der Messung; ein Gewicht gilt nur relativ zu den anderen.
 *  - Wikipedia "Weighted least squares": Die Varianz der Fehler wird ueber
 *    die gewichtete Restquadratsumme durch die Freiheitsgrade n - m
 *    geschaetzt; bei normalverteilten Fehlern folgen die Parameter einer
 *    t-Verteilung mit n - m Freiheitsgraden.
 *  Formeln: beta = (X'WX)^-1 X'Wy, s2 = Summe w*e^2 / (n - m),
 *  Kovarianz = s2 * (X'WX)^-1.
 *  - t-Verteilung ueber die regularisierte unvollstaendige Betafunktion
 *    (Kettenbruch nach Numerical Recipes, Press u. a., Kap. 6.4), die
 *    Gammafunktion nach Lanczos (g = 7).
 */

const LANCZOS = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

/** Natuerlicher Logarithmus der Gammafunktion fuer x > 0. */
function lnGamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  const z = x - 1;
  let a = LANCZOS[0];
  const t = z + 7.5;
  for (let i = 1; i < 9; i++) a += LANCZOS[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Kettenbruch der unvollstaendigen Betafunktion. */
function betaKettenbruch(x, a, b) {
  const KLEIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < KLEIN) d = KLEIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 500; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < KLEIN) d = KLEIN;
    c = 1 + aa / c;
    if (Math.abs(c) < KLEIN) c = KLEIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < KLEIN) d = KLEIN;
    c = 1 + aa / c;
    if (Math.abs(c) < KLEIN) c = KLEIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-15) break;
  }
  return h;
}

/** Regularisierte unvollstaendige Betafunktion I_x(a, b). */
export function betaRegularisiert(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const vor = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return (vor * betaKettenbruch(x, a, b)) / a;
  return 1 - (vor * betaKettenbruch(1 - x, b, a)) / b;
}

/** Verteilungsfunktion der t-Verteilung mit df Freiheitsgraden. */
export function tVerteilung(t, df) {
  const p = 0.5 * betaRegularisiert(df / (df + t * t), df / 2, 0.5);
  return t >= 0 ? 1 - p : p;
}

/** Quantil der t-Verteilung fuer p zwischen 0,5 und 1 (Bisektion). */
export function tQuantil(p, df) {
  if (!(p > 0.5 && p < 1) || !(df > 0)) return NaN;
  let lo = 0;
  let hi = 1;
  while (tVerteilung(hi, df) < p && hi < 1e8) hi *= 2;
  for (let i = 0; i < 200 && hi - lo > 1e-13 * Math.max(1, hi); i++) {
    const m = (lo + hi) / 2;
    if (tVerteilung(m, df) < p) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/** Inverse einer kleinen Matrix (Gauss-Jordan mit Pivotsuche), sonst null. */
function invertiere(a) {
  const n = a.length;
  const m = a.map((zeile, i) => zeile.concat(Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))));
  const skala = Math.max(...a.map((zeile, i) => Math.abs(zeile[i])), 0);
  if (!(skala > 0)) return null;
  for (let s = 0; s < n; s++) {
    let p = s;
    for (let z = s + 1; z < n; z++) if (Math.abs(m[z][s]) > Math.abs(m[p][s])) p = z;
    // Fast singulaer: Spalten haengen (nahezu) voneinander ab.
    if (Math.abs(m[p][s]) < 1e-10 * skala) return null;
    [m[s], m[p]] = [m[p], m[s]];
    const piv = m[s][s];
    for (let k = 0; k < 2 * n; k++) m[s][k] /= piv;
    for (let z = 0; z < n; z++) {
      if (z === s) continue;
      const f = m[z][s];
      if (f === 0) continue;
      for (let k = 0; k < 2 * n; k++) m[z][k] -= f * m[s][k];
    }
  }
  return m.map((zeile) => zeile.slice(n));
}

/**
 * Gewichtete lineare Regression. zeilen: je Messung die Werte der
 * Spalten (erste Spalte 1 fuer den Achsenabschnitt), y: Messwerte,
 * w: Gewichte (nur relativ). Ergebnis { beta, kov, df, s2 } oder null,
 * wenn es zu wenige Messungen gibt oder die Spalten voneinander abhaengen.
 */
export function wls(zeilen, y, w) {
  const n = y.length;
  const m = zeilen.length ? zeilen[0].length : 0;
  if (!m || n <= m) return null;
  const a = Array.from({ length: m }, () => new Array(m).fill(0));
  const b = new Array(m).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      b[j] += w[i] * zeilen[i][j] * y[i];
      for (let k = 0; k < m; k++) a[j][k] += w[i] * zeilen[i][j] * zeilen[i][k];
    }
  }
  const inv = invertiere(a);
  if (!inv) return null;
  const beta = inv.map((zeile) => zeile.reduce((s, v, k) => s + v * b[k], 0));
  let rest = 0;
  for (let i = 0; i < n; i++) {
    const e = y[i] - zeilen[i].reduce((s, v, k) => s + v * beta[k], 0);
    rest += w[i] * e * e;
  }
  const df = n - m;
  const s2 = rest / df;
  return { beta, kov: inv.map((zeile) => zeile.map((v) => v * s2)), df, s2 };
}
