/**
 * Kacheln: bewegte Teile der Grafik als eigene kleine Flaechen, die der
 * Browser selbst abspielt.
 *
 * Bewegungen, die JavaScript Bild fuer Bild setzt, laufen im Hauptthread
 * der Seite. Rechnet dort Home Assistant oder eine andere Karte, bleibt die
 * Bewegung stehen und springt danach weiter. Animationen von transform und
 * opacity spielt der Browser dagegen selbst ab (Kompositor), auch wenn der
 * Hauptthread beschaeftigt ist. Das gilt aber nur fuer ganze Kaestchen der
 * Seite, nicht fuer Teile innerhalb einer SVG-Grafik.
 *
 * Darum steckt jedes bewegte Teil in einem eigenen kleinen SVG (Kachel),
 * das als Ganzes gedreht, verschoben oder abgeblendet wird (takt.js).
 * Unbewegtes, das in der Grafik darueber liegt, bekommt ebenfalls eine
 * Kachel, damit die Reihenfolge beim Zeichnen erhalten bleibt.
 *
 * Laufstriche aendern stroke-dashoffset, das kann der Kompositor nicht
 * abspielen. Sie werden zerlegt:
 *  - Band: ein gerades Stueck, dessen Strichmuster in einem Umlauf um 44
 *    Einheiten weiterrueckt. Danach sieht es wieder genauso aus.
 *  - Fenster: Ecken, freie Enden und Raender verdeckender Formen. Dort
 *    biegt oder endet ein Strich. Das Fenster enthaelt 72 vorgezeichnete
 *    Bilder je Umlauf (60 je Sekunde), der Kompositor schaltet durch.
 *
 * Jede Kachel beginnt und endet auf ganzen CSS-Pixeln, gemessen ab der
 * Grundgrafik. Browser runden die Lage eines SVG beim Zeichnen auf ganze
 * Pixel (gemessen: Chromium, WebKitGTK). Liegen alle Kacheln um ganze
 * Pixel versetzt zur Grundgrafik, runden alle gleich und nichts verrutscht.
 * Baender und Fenster stossen dort aneinander, so entsteht an der Naht
 * weder eine Luecke noch eine doppelte Deckung.
 */

import { formBox, formPfad, punktIn, relCtm, ueberlappt } from "./ebenen.js";

const NS = "http://www.w3.org/2000/svg";

/** Bilder je Umlauf der Laufstriche: 72 in 1,2 s ergibt 60 je Sekunde. */
export const BILDER = 72;
/** Weg und Dauer eines Umlaufs der Laufstriche (karte.js). */
export const UMLAUF = 44;
export const UMLAUF_MS = 1200;
/** Saum fuer die Kantenglaettung, in CSS-Pixeln. */
const SAUM = 1;

// Elemente, deren Deckkraft karte.js pulsieren laesst.
const PULS_ID = /^(unit-glow|.+-badge|modus-(betrieb|heizen|kuehlen|ww|auto|abtauen)|hk\d-waerme|kamin-glut|press-v|press-warn|solar-schein)$/;
// Drehende Teile, die keine Klasse rotor tragen.
const DREH_ID = /^(fan\d|solar-strahlen)$/;

/** Nur verschoben und gleichmaessig vergroessert. */
const schlicht = (m) => Boolean(m) && Math.abs(m.b) < 1e-9 && Math.abs(m.c) < 1e-9 && m.a > 0 && Math.abs(m.a - m.d) < 1e-9;
/** Verschoben, gedreht und gleichmaessig vergroessert, nicht gespiegelt. */
const winkeltreu = (m) => Boolean(m) && Math.abs(m.a - m.d) < 1e-9 && Math.abs(m.b + m.c) < 1e-9 && m.a * m.d - m.b * m.c > 0;

const zahl = (v) => Math.round(v * 10000) / 10000;
const mod = (x, p) => ((x % p) + p) % p;

/**
 * Lage eines Rechtecks in ganzen Pixeln, relativ zum Bezugsrechteck.
 * Keine Prozentwerte: Der Browser rundet sie beim Umrechnen ab, schon ein
 * 64stel Pixel darunter verschiebt eine Kachel auf dem Retina-Bildschirm
 * um einen Bildpunkt (gemessen in WebKitGTK bei doppelter Aufloesung).
 */
function lage(el, b, bezug) {
  el.style.left = `${b[0] - bezug[0]}px`;
  el.style.top = `${b[1] - bezug[1]}px`;
  el.style.width = `${b[2] - b[0]}px`;
  el.style.height = `${b[3] - b[1]}px`;
}

/** Neues aeusseres SVG, das genau den Ausschnitt b der Grundgrafik zeigt. */
function svgNeu(b, klasse) {
  const s = document.createElementNS(NS, "svg");
  s.setAttribute("viewBox", `${zahl(b[0])} ${zahl(b[1])} ${zahl(b[2] - b[0])} ${zahl(b[3] - b[1])}`);
  s.setAttribute("preserveAspectRatio", "none");
  s.setAttribute("class", klasse);
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("focusable", "false");
  s.setAttribute("data-lhc-kachel", "");
  s.appendChild(document.createElementNS(NS, "defs"));
  return s;
}

const huelleVon = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
const flaeche = (r) => Math.max(0, r[2] - r[0]) * Math.max(0, r[3] - r[1]);
const enthaelt = (aussen, innen, tol = 0.01) =>
  innen[0] >= aussen[0] - tol && innen[1] >= aussen[1] - tol && innen[2] <= aussen[2] + tol && innen[3] <= aussen[3] + tol;

/**
 * Ein offener Zug aus waagerechten und senkrechten Strecken (M, L, H, V),
 * nur ein Teilzug. Gerade weiterlaufende Strecken werden zusammengefasst.
 * Sonst null.
 */
function zugAus(d) {
  const text = String(d || "");
  const teile = text.match(/[MmLlHhVvZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!teile || /[^MmLlHhVvZz\d\s,.eE+-]/.test(text)) return null;
  const pkt = [];
  let i = 0, cmd = "", x = 0, y = 0, anzahlM = 0;
  const z = () => Number(teile[i++]);
  while (i < teile.length) {
    if (/[a-z]/i.test(teile[i])) cmd = teile[i++];
    if (!cmd) return null;
    const rel = cmd === cmd.toLowerCase();
    const c = cmd.toUpperCase();
    if (c === "Z") return null;
    let nx = x, ny = y;
    if (c === "M" || c === "L") { nx = z() + (rel ? x : 0); ny = z() + (rel ? y : 0); }
    else if (c === "H") nx = z() + (rel ? x : 0);
    else if (c === "V") ny = z() + (rel ? y : 0);
    else return null;
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
    if (c === "M") {
      if (anzahlM++ > 0) return null;
      cmd = rel ? "l" : "L";
    } else if (!pkt.length) return null;
    x = nx;
    y = ny;
    pkt.push([x, y]);
  }
  const p = [];
  for (const q of pkt) {
    const l = p[p.length - 1];
    if (l && Math.abs(l[0] - q[0]) < 1e-9 && Math.abs(l[1] - q[1]) < 1e-9) continue;
    if (l && Math.abs(l[0] - q[0]) > 1e-9 && Math.abs(l[1] - q[1]) > 1e-9) return null;
    if (p.length >= 2) {
      const v = p[p.length - 2];
      const waag = Math.abs(v[1] - l[1]) < 1e-9 && Math.abs(l[1] - q[1]) < 1e-9;
      const senk = Math.abs(v[0] - l[0]) < 1e-9 && Math.abs(l[0] - q[0]) < 1e-9;
      if (waag || senk) {
        const gleich = waag ? Math.sign(l[0] - v[0]) === Math.sign(q[0] - l[0]) : Math.sign(l[1] - v[1]) === Math.sign(q[1] - l[1]);
        if (!gleich) return null;
        p[p.length - 1] = q;
        continue;
      }
    }
    p.push(q);
  }
  return p.length >= 2 ? p : null;
}

/** Verdeckende Form aus Einheiten der Grundgrafik in lokale Einheiten. */
function formLokal(f, m) {
  const s = m.a;
  if (f.art === "ell") return { art: "ell", cx: (f.cx - m.e) / s, cy: (f.cy - m.f) / s, rx: f.rx / s, ry: f.ry / s };
  return { art: "rr", x0: (f.x0 - m.e) / s, y0: (f.y0 - m.f) / s, x1: (f.x1 - m.e) / s, y1: (f.y1 - m.f) / s,
    rx: (f.rx || 0) / s, ry: (f.ry || 0) / s };
}

/**
 * Bereiche der Bogenlaenge, deren Striche ein Fenster (lokal) erreichen
 * koennen, samt runder Kappe.
 */
function stromBereiche(plan, W) {
  const aus = [];
  const kappe = plan.h + 1;
  plan.seg.forEach((g) => {
    // Streifen der Strecke, quer um die halbe Strichbreite.
    const S = plan.rechteck(g, -kappe, g.L + kappe, plan.h);
    if (!(W[0] < S[2] && S[0] < W[2] && W[1] < S[3] && S[1] < W[3])) return;
    let ta, tb;
    if (g.u[0] !== 0) { ta = (W[0] - g.x0) * g.u[0]; tb = (W[2] - g.x0) * g.u[0]; }
    else { ta = (W[1] - g.y0) * g.u[1]; tb = (W[3] - g.y0) * g.u[1]; }
    aus.push([g.s0 + Math.min(ta, tb) - kappe, g.s0 + Math.max(ta, tb) + kappe]);
  });
  // Ueberlappende Bereiche (an Ecken) zusammenfassen.
  aus.sort((x, y) => x[0] - y[0]);
  const eins = [];
  aus.forEach((x) => {
    const l = eins[eins.length - 1];
    if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]);
    else eins.push(x.slice());
  });
  return eins;
}

/**
 * Striche eines Bildes als Teilzuege: so, wie das Original mit diesem
 * stroke-dashoffset zeichnet. Ein Strich ueber eine Ecke bleibt ein Zug
 * mit Ecke, am Ende des Pfads wird er abgeschnitten. Ausserhalb der
 * Bereiche wird gekuerzt, die Kappe dort liegt ausserhalb des Fensters.
 */
function stromStriche(plan, bereiche, versatzMuster, [vx, vy]) {
  const seg = plan.seg;
  const gesamt = seg[seg.length - 1].s0 + seg[seg.length - 1].L;
  const P = plan.P;
  // Anfang jedes Strichs im Muster
  const an = [];
  let pos = 0;
  plan.muster.forEach((l, i) => {
    if (i % 2 === 0 && l > 0) an.push([pos, pos + l]);
    pos += l;
  });
  const punkt = (s) => {
    let g = seg[0];
    for (const x of seg) { if (s >= x.s0) g = x; }
    const t = Math.min(Math.max(s - g.s0, 0), g.L);
    return [g.x0 + g.u[0] * t, g.y0 + g.u[1] * t];
  };
  const zug = (a, b) => {
    const pts = [punkt(a)];
    seg.forEach((g, i) => { if (i > 0 && g.s0 > a && g.s0 < b) pts.push([g.x0, g.y0]); });
    pts.push(punkt(b));
    return pts.map(([x, y], i) => `${i ? "L" : "M"}${zahl(x + vx)} ${zahl(y + vy)}`).join("");
  };
  let d = "";
  const gesehen = new Set();
  bereiche.forEach(([A, B]) => {
    // Muster an Bogenlaenge s: (s + versatzMuster) mod P
    const n0 = Math.floor((A + versatzMuster) / P) - 1;
    const n1 = Math.ceil((B + versatzMuster) / P) + 1;
    for (let n = n0; n <= n1; n++) {
      an.forEach(([x0, x1]) => {
        let a = x0 + n * P - versatzMuster;
        let b = x1 + n * P - versatzMuster;
        if (b < A || a > B) return;
        a = Math.max(a, 0, A);
        b = Math.min(b, gesamt, B);
        if (b - a < 1e-6) return;
        const schluessel = `${zahl(a)}|${zahl(b)}`;
        if (gesehen.has(schluessel)) return;
        gesehen.add(schluessel);
        d += zug(a, b);
      });
    }
  });
  return d;
}

/** Umriss einer Form als Vieleck, 16 Punkte je Viertelbogen. */
function formVieleck(f) {
  const n = 16;
  const pkt = [];
  if (f.art === "ell") {
    for (let k = 0; k < 4 * n; k++) {
      const w = (k * Math.PI) / (2 * n);
      pkt.push([f.cx + f.rx * Math.cos(w), f.cy + f.ry * Math.sin(w)]);
    }
    return pkt;
  }
  const rx = Math.min(f.rx || 0, (f.x1 - f.x0) / 2);
  const ry = Math.min(f.ry || 0, (f.y1 - f.y0) / 2);
  if (!rx || !ry) return [[f.x0, f.y0], [f.x1, f.y0], [f.x1, f.y1], [f.x0, f.y1]];
  [[f.x1 - rx, f.y1 - ry, 0], [f.x0 + rx, f.y1 - ry, Math.PI / 2], [f.x0 + rx, f.y0 + ry, Math.PI], [f.x1 - rx, f.y0 + ry, (3 * Math.PI) / 2]]
    .forEach(([cx, cy, w0]) => {
      for (let k = 0; k <= n; k++) {
        const w = w0 + (k * Math.PI) / (2 * n);
        pkt.push([cx + rx * Math.cos(w), cy + ry * Math.sin(w)]);
      }
    });
  return pkt;
}

/** Vieleck auf ein Rechteck beschneiden (Sutherland-Hodgman). */
function vieleckIn(v, R) {
  const kanten = [
    (p) => p[0] >= R[0], (p) => p[0] <= R[2], (p) => p[1] >= R[1], (p) => p[1] <= R[3],
  ];
  const schnittpunkt = (a, b, i) => {
    const t = i < 2 ? ((i === 0 ? R[0] : R[2]) - a[0]) / (b[0] - a[0]) : ((i === 2 ? R[1] : R[3]) - a[1]) / (b[1] - a[1]);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  let aus = v;
  kanten.forEach((innen, i) => {
    const ein = aus;
    aus = [];
    ein.forEach((b, j) => {
      const a = ein[(j + ein.length - 1) % ein.length];
      if (innen(b)) {
        if (!innen(a)) aus.push(schnittpunkt(a, b, i));
        aus.push(b);
      } else if (innen(a)) aus.push(schnittpunkt(a, b, i));
    });
  });
  return aus;
}

/** Bereich [a, b] aus einer Liste von Bereichen herausnehmen. */
function abziehen(liste, a, b) {
  const aus = [];
  liste.forEach(([x, y]) => {
    if (b <= x || a >= y) { aus.push([x, y]); return; }
    if (a > x) aus.push([x, a]);
    if (b < y) aus.push([b, y]);
  });
  return aus;
}

/**
 * Keyframes fuer ein Fenster: Bild j gilt von (j - 0,5)/72 bis (j + 0,5)/72
 * eines Umlaufs. Der Wechsel dauert ein Millionstel, so bleibt es eine
 * gewoehnliche Animation, die der Kompositor abspielt (steps() spielt
 * WebKit nicht selbst ab).
 */
export function fensterSchritte(schritte, rueck) {
  const K = schritte.length;
  const eps = 1e-6;
  const bild = (j) => schritte[rueck ? mod(K - j, K) : mod(j, K)];
  const tf = ([x, y]) => `translate(${zahl(x)}px, ${zahl(y)}px)`;
  const kf = [{ offset: 0, transform: tf(bild(0)) }];
  for (let j = 0; j < K; j++) {
    const ende = (j + 0.5) / K;
    kf.push({ offset: ende - eps, transform: tf(bild(j)) });
    kf.push({ offset: ende, transform: tf(bild(j + 1)) });
  }
  kf.push({ offset: 1, transform: tf(bild(0)) });
  return kf;
}

/**
 * Regeln im Stil der Karte, die opacity setzen. Sie haben Vorrang vor dem
 * opacity-Attribut, mit dem karte.js pulsieren laesst (etwa .badge).
 */
function deckkraftRegeln(wurzel) {
  const sel = [];
  const durch = (liste) => {
    for (const r of Array.from(liste || [])) {
      if (r.cssRules) durch(r.cssRules);
      if (r.style && r.style.opacity && r.selectorText) sel.push(r.selectorText);
    }
  };
  Array.from((wurzel && wurzel.styleSheets) || []).forEach((s) => {
    try {
      durch(s.cssRules);
    } catch {
      // fremdes Stylesheet: nicht lesbar
    }
  });
  return sel;
}

/** Wirkt das opacity-Attribut, also hat karte.js damit je etwas bewirkt? */
function deckkraftWirkt(el, regeln) {
  if (el.style && el.style.opacity) return false;
  return !regeln.some((s) => {
    try {
      return el.matches(s);
    } catch {
      return false;
    }
  });
}

export const kachelnKarte = {
  /**
   * Masse der Grundgrafik in der Szene: wo ihr Bild liegt (CSS-Pixel),
   * Pixel je Einheit und Bildpunkte des Geraets je CSS-Pixel.
   */
  _ebenenMass(svg) {
    const szene = svg.parentNode;
    const vb = svg.viewBox && svg.viewBox.baseVal;
    if (!szene || !vb || !(vb.width > 0) || !(vb.height > 0)) return null;
    const par = svg.getAttribute("preserveAspectRatio");
    if (par && par.trim() !== "xMidYMid meet" && par.trim() !== "xMidYMid") return null;
    const rs = szene.getBoundingClientRect();
    const r = svg.getBoundingClientRect();
    if (r.width < 2 || r.height < 2 || !szene.clientWidth) return null;
    // Vergroesserung durch Vorfahren (transform), sonst 1.
    const k = szene.offsetWidth ? rs.width / szene.offsetWidth || 1 : 1;
    const bx = (r.left - rs.left) / k - szene.clientLeft;
    const by = (r.top - rs.top) / k - szene.clientTop;
    const bw = r.width / k;
    const bh = r.height / k;
    const s = Math.min(bw / vb.width, bh / vb.height);
    if (!(s > 0)) return null;
    // bx, by, bw, bh: Kasten der Grundgrafik in der Szene. ox, oy: Lage
    // ihres viewBox darin. s: CSS-Pixel je Einheit.
    return { bx, by, bw, bh, ox: (bw - vb.width * s) / 2, oy: (bh - vb.height * s) / 2, s, dpr: (window.devicePixelRatio || 1) * k };
  },

  /**
   * Rechteck in Einheiten der Grundgrafik, nach aussen auf ganze CSS-Pixel
   * gerundet (gemessen ab ihrem Kasten). px: in Pixeln, u: in Einheiten.
   */
  _kasten(z, b) {
    const { ox, oy, s } = z.mass;
    const vb = z.vbBox;
    const px = [
      Math.floor(ox + (b[0] - vb[0]) * s + 1e-6),
      Math.floor(oy + (b[1] - vb[1]) * s + 1e-6),
      Math.ceil(ox + (b[2] - vb[0]) * s - 1e-6),
      Math.ceil(oy + (b[3] - vb[1]) * s - 1e-6),
    ];
    if (px[2] <= px[0]) px[2] = px[0] + 1;
    if (px[3] <= px[1]) px[3] = px[1] + 1;
    const u = [vb[0] + (px[0] - ox) / s, vb[1] + (px[1] - oy) / s, vb[0] + (px[2] - ox) / s, vb[1] + (px[3] - oy) / s];
    return { px, u };
  },

  /** Welche Kachel ein Teil bekommt. */
  _kachelArt(a) {
    const el = a.el;
    if (!a.bewegt) return "fest";
    const id = el.id || "";
    if (el.classList && el.classList.contains("flowdots")) return "strom";
    if ((el.classList && el.classList.contains("rotor")) || DREH_ID.test(id)) return "dreh";
    if (id === "kamin-feuer") return "flacker";
    if (PULS_ID.test(id)) return "puls";
    if (/-bubbles$/.test(id) || (el.localName === "g" && el.hasAttribute("clip-path") && el.querySelector("[id$='-bubbles']"))) return "blasen";
    return "js";
  },

  /**
   * Huelle eines Originals: Kopien seiner Vorfahren bis zur Grundgrafik,
   * ohne Kinder. Sie tragen Lage, Klassen und geerbten Stil. ohne nennt
   * Attribute, die die Huelle nicht tragen soll.
   */
  _ebenenSchale(z, karte, orig, ohne) {
    if (karte.has(orig)) return karte.get(orig);
    const eltern = this._ebenenSchale(z, karte, orig.parentNode, ohne);
    const s = orig.cloneNode(false);
    // Huellen sind nur Huelle fuer Lage und Stil, nicht bedienbar.
    ["tabindex", "role", "aria-label", "focusable"].forEach((n) => s.removeAttribute(n));
    if (ohne && ohne.length) {
      ohne.forEach((n) => s.removeAttribute(n));
      s.setAttribute("data-lhc-ohne", ohne.join(" "));
    }
    s.setAttribute("data-lhc-schale", "");
    eltern.appendChild(s);
    karte.set(orig, s);
    if (!z.schalen.has(orig)) z.schalen.set(orig, []);
    z.schalen.get(orig).push(s);
    return s;
  },

  /** Unsichtbarer Platzhalter im Grund: nimmt Klicks und Mauszeiger an. */
  _ebenenPlatzhalter(a) {
    const p = a.el.cloneNode(true);
    p.removeAttribute("id");
    p.querySelectorAll("[id]").forEach((x) => x.removeAttribute("id"));
    p.setAttribute("data-lhc-platz", String(a.index));
    p.style.setProperty("visibility", "hidden");
    p.style.setProperty("pointer-events", "painted");
    a.platz = p;
    a.el.replaceWith(p);
  },

  /** Original in die unsichtbare Vorlage. Gezeigt werden nur Kopien. */
  _ebenenInVorlage(z, a) {
    const eltern = this._ebenenSchale(z, z.vorlageKarte, a.el.parentNode);
    this._ebenenPlatzhalter(a);
    eltern.appendChild(a.el);
    a.schale = eltern;
  },

  /**
   * Ausschnitte fuer verdeckende Formen innerhalb einer Kachel, gerade-
   * ungerade-Regel. Formen, die sich beruehren, kommen in getrennte Stufen.
   * Liefert die Kennungen der Stufen.
   */
  _kachelSchnitte(z, defs, formen, rahmen) {
    if (!formen.length) return [];
    const gross = `M${zahl(rahmen[0] - 1000)} ${zahl(rahmen[1] - 1000)}H${zahl(rahmen[2] + 1000)}V${zahl(rahmen[3] + 1000)}H${zahl(rahmen[0] - 1000)}Z`;
    const stufen = [];
    formen.forEach((f) => {
      const st = stufen.find((s) => s.every((g) => !ueberlappt(formBox(f), formBox(g))));
      if (st) st.push(f); else stufen.push([f]);
    });
    return stufen.map((st) => {
      const id = `lhc-ks-${++z.nr}`;
      const cp = document.createElementNS(NS, "clipPath");
      cp.setAttribute("id", id);
      cp.setAttribute("clipPathUnits", "userSpaceOnUse");
      const p = document.createElementNS(NS, "path");
      p.setAttribute("d", gross + st.map(formPfad).join(""));
      p.setAttribute("clip-rule", "evenodd");
      cp.appendChild(p);
      defs.appendChild(cp);
      return id;
    });
  },

  /**
   * Teile in eine Kachel setzen: Ausschnitte, Huellen, Original hinein,
   * Platzhalter in den Grund. Aufeinander folgende Teile mit denselben
   * Ausschnitten teilen sich die Huellen.
   */
  _kachelAtome(z, s, liste, box, kachel) {
    const defs = s.firstChild;
    let kette = null;
    liste.forEach((a) => {
      const formen = a.schnitt.filter((f) => ueberlappt(box, formBox(f)));
      const schluessel = formen.map(formPfad).join("|");
      if (!kette || kette.schluessel !== schluessel) {
        let oben = s;
        this._kachelSchnitte(z, defs, formen, box).forEach((id) => {
          const g = document.createElementNS(NS, "g");
          g.setAttribute("clip-path", `url(#${id})`);
          oben.appendChild(g);
          oben = g;
        });
        kette = { schluessel, karte: new Map([[z.svg, oben]]) };
      }
      const eltern = this._ebenenSchale(z, kette.karte, a.el.parentNode);
      this._ebenenPlatzhalter(a);
      eltern.appendChild(a.el);
      a.schale = eltern;
      a.kachel = kachel;
    });
  },

  /** Kachel fuer unbewegte oder nur per JavaScript bewegte Teile. */
  _kachelFest(z, liste, art) {
    const { px, u } = this._kasten(z, liste.reduce((b, a) => huelleVon(b, a.box), liste[0].box));
    const s = svgNeu(u, "lhc-kachel");
    lage(s, px, z.aPx);
    const k = { art, el: s, box: u, px, atome: liste };
    this._kachelAtome(z, s, liste, u, k);
    return k;
  },

  /** Pulsieren: die Kachel wird als Ganzes abgeblendet. */
  _kachelPuls(z, a, wirksam) {
    const k = this._kachelFest(z, [a], "puls");
    k.ziel = k.el;
    k.id = a.el.id;
    k.atom = a;
    k.wirksam = wirksam;
    return k;
  },

  /** Drehen: quadratische Kachel um den Drehpunkt. */
  _kachelDreh(z, a, pm) {
    if (a.schnitt.length || !a.box || !winkeltreu(pm)) return null;
    // Winkel, den die Animationsschleife schon erreicht hat.
    const zustand = this._animState.get(a.el.id);
    const k = this._kachelFest(z, [a], "dreh");
    k.ziel = k.el;
    k.id = a.el.id;
    k.atom = a;
    // Drehpunkt: Mitte des Kerns (Kreis um den Ursprung des Rotors).
    const cx = (a.kern[0] + a.kern[2]) / 2;
    const cy = (a.kern[1] + a.kern[3]) / 2;
    k.el.style.transformOrigin = `${zahl(((cx - k.box[0]) / (k.box[2] - k.box[0])) * 100)}% ${zahl(((cy - k.box[1]) / (k.box[3] - k.box[1])) * 100)}%`;
    k.basis = zustand && typeof zustand.winkel === "number" ? zustand.winkel : 0;
    k.dauer = 0;
    k.el.style.transform = `rotate(${zahl(k.basis)}deg)`;
    a.el.removeAttribute("transform");
    return k;
  },

  /**
   * Flackern: drei ineinander liegende Kaesten fuer Neigen, Breite und
   * Hoehe. Zusammen ergibt das skewX() scale() wie in karte.js.
   */
  _kachelFlacker(z, a, pm) {
    if (a.schnitt.length || !a.box || !schlicht(pm)) return null;
    const { px, u: box } = this._kasten(z, a.box);
    const ursprung = `${zahl(((pm.e - box[0]) / (box[2] - box[0])) * 100)}% ${zahl(((pm.f - box[1]) / (box[3] - box[1])) * 100)}%`;
    const aussen = document.createElement("div");
    aussen.className = "lhc-flacker";
    lage(aussen, px, z.aPx);
    const mitte = document.createElement("div");
    mitte.className = "lhc-flacker-innen";
    const s = svgNeu(box, "lhc-kachel lhc-flacker-innen");
    [mitte, s].forEach((x) => lage(x, [0, 0, px[2] - px[0], px[3] - px[1]], [0, 0]));
    [aussen, mitte, s].forEach((x) => { x.style.transformOrigin = ursprung; });
    aussen.appendChild(mitte);
    mitte.appendChild(s);
    const k = { art: "flacker", el: aussen, box, px, atome: [a], ziele: [aussen, mitte, s], id: a.el.id, atom: a };
    this._kachelAtome(z, s, [a], box, k);
    a.el.removeAttribute("transform");
    return k;
  },

  /**
   * Blasen: ein Rahmen in Form des Ausschnitts (abgerundetes Rechteck),
   * darin jede Blase als eigene kleine Kachel, die aufsteigt. Das Original
   * bleibt unsichtbar in der Vorlage, aktualisieren.js schaltet dort.
   */
  _kachelBlasenPlan(z, a) {
    const el = a.el;
    if (!a.box) return null;
    const gruppe = /-bubbles$/.test(el.id || "") ? el : el.querySelector("[id$='-bubbles']");
    if (!gruppe) return null;
    if (el !== gruppe && (el.children.length !== 1 || el.firstElementChild !== gruppe)) return null;
    const kreise = Array.from(gruppe.children);
    if (!kreise.length || kreise.some((c) => c.localName !== "circle")) return null;
    const g = z.mass.s;
    let rahmen = a.box;
    let rund = "";
    if (el !== gruppe) {
      const id = (/#([^)"'\s]+)/.exec(el.getAttribute("clip-path")) || [])[1];
      const cp = id && z.svg.getRootNode().getElementById(id);
      const form = cp && cp.children.length === 1 ? cp.firstElementChild : null;
      if (!form || form.localName !== "rect" || form.hasAttribute("transform") || cp.hasAttribute("transform")) return null;
      if ((cp.getAttribute("clipPathUnits") || "userSpaceOnUse") !== "userSpaceOnUse") return null;
      const m = relCtm(el);
      if (!schlicht(m)) return null;
      const x = form.x.baseVal.value, y = form.y.baseVal.value;
      const w = form.width.baseVal.value, h = form.height.baseVal.value;
      const rxA = form.getAttribute("rx"), ryA = form.getAttribute("ry");
      let rx = rxA !== null ? parseFloat(rxA) : ryA !== null ? parseFloat(ryA) : 0;
      let ry = ryA !== null ? parseFloat(ryA) : rx;
      rx = Math.min(rx || 0, w / 2);
      ry = Math.min(ry || 0, h / 2);
      rahmen = [m.a * x + m.e, m.d * y + m.f, m.a * (x + w) + m.e, m.d * (y + h) + m.f];
      if (rx > 0 && ry > 0) rund = `${zahl((rx / w) * 100)}% / ${zahl((ry / h) * 100)}%`;
    }
    const rk = this._kasten(z, rahmen);
    const kreisDaten = [];
    for (let idx = 0; idx < kreise.length; idx++) {
      const kr = kreise[idx];
      // Ohne die Verschiebung, die die Schleife vielleicht schon gesetzt hat.
      const m = relCtm(kr.parentNode);
      if (!schlicht(m)) return null;
      const cx = kr.cx.baseVal.value, cy = kr.cy.baseVal.value, r = kr.r.baseVal.value;
      const rr = r + SAUM / (m.a * g);
      const { px, u: B } = this._kasten(z, [m.a * (cx - rr) + m.e, m.d * (cy - rr) + m.f, m.a * (cx + rr) + m.e, m.d * (cy + rr) + m.f]);
      kreisDaten.push({ orig: kr, idx, B, px, m });
    }
    // Verdeckende Formen darueber zaehlen nur, wo eine Blase hinkommt: ihr
    // Kasten samt Saum auf dem ganzen Weg nach oben, innerhalb des Rahmens.
    // Liegt eine Form nur im Rand des Kastens (etwa eine Leitung unter dem
    // Puffer), zeichnet dort keine Blase, die Reihenfolge spielt keine Rolle.
    const weg = kreisDaten.map(({ B, m }) => [
      Math.max(B[0], rk.u[0]), Math.max(B[1] - 330 * m.d, rk.u[1]), Math.min(B[2], rk.u[2]), Math.min(B[3], rk.u[3]),
    ]);
    if (a.schnitt.some((f) => weg.some((r) => r[0] < r[2] && r[1] < r[3] && ueberlappt(r, formBox(f))))) return null;
    return { gruppe, rk, rund, kreisDaten, mitRahmen: el !== gruppe };
  },

  /** Blasen bauen (Plan aus _kachelBlasenPlan). */
  _kachelBlasen(z, a, plan) {
    const { gruppe, rk, rund } = plan;
    const huelle = document.createElement("div");
    huelle.className = "lhc-blasen";
    huelle.setAttribute("data-lhc-intern", "");
    lage(huelle, rk.px, z.aPx);
    if (rund) huelle.style.borderRadius = rund;
    const blasen = plan.kreisDaten.map((d) => {
      const s = svgNeu(d.B, "lhc-blase");
      lage(s, d.px, rk.px);
      return { ...d, s };
    });
    blasen.forEach((b) => {
      const karte = new Map([[z.svg, b.s]]);
      const eltern = this._ebenenSchale(z, karte, b.orig.parentNode, plan.mitRahmen ? ["clip-path"] : null);
      // Die Huelle der Ausschnittgruppe traegt keinen Ausschnitt, das macht der Rahmen.
      const kopie = b.orig.cloneNode(false);
      kopie.removeAttribute("id");
      kopie.removeAttribute("transform");
      kopie.removeAttribute("style");
      kopie.setAttribute("opacity", "0");
      eltern.appendChild(kopie);
      b.kopie = kopie;
      b.ziel = b.s;
      // Aufstieg 330 Einheiten (karte.js), in Prozent der eigenen Hoehe.
      b.hoch = ((330 * b.m.a) / (b.B[3] - b.B[1])) * 100;
      huelle.appendChild(b.s);
    });
    this._ebenenInVorlage(z, a);
    return { art: "blasen", el: huelle, box: rk.u, atome: [a], blasen, id: gruppe.id };
  },

  /**
   * Laufstriche zerlegen: Baender fuer gerade Stuecke, Fenster fuer Ecken,
   * freie Enden und Raender verdeckender Formen. Alles in lokalen Einheiten
   * des Pfads. Sonst null.
   */
  _kachelStromPlan(z, a) {
    const el = a.el;
    if (el.localName !== "path") return null;
    const m = relCtm(el);
    if (!schlicht(m)) return null;
    const cs = getComputedStyle(el);
    const sw = parseFloat(cs.strokeWidth);
    const muster = String(cs.strokeDasharray || "").split(/[\s,]+/).map((x) => parseFloat(x)).filter((x) => Number.isFinite(x));
    if (!(sw > 0) || muster.length < 2 || muster.some((x) => x < 0)) return null;
    const P = (muster.length % 2 ? 2 : 1) * muster.reduce((x, y) => x + y, 0);
    if (!(P > 0)) return null;
    const p = zugAus(el.getAttribute("d"));
    if (!p) return null;
    const q = m.a * z.mass.s;
    const h = sw / 2;
    const r = SAUM / q;
    const b = h + r;
    const formen = a.schnitt.map((f) => formLokal(f, m));
    const seg = [];
    let s0 = 0;
    for (let k = 0; k + 1 < p.length; k++) {
      const [x0, y0] = p[k];
      const [x1, y1] = p[k + 1];
      const L = Math.abs(x1 - x0) + Math.abs(y1 - y0);
      seg.push({ x0, y0, x1, y1, L, u: [Math.sign(x1 - x0), Math.sign(y1 - y0)], s0 });
      s0 += L;
    }
    // Rechteck einer Strecke von t0 bis t1 (laengs), quer +-w.
    const rechteck = (g, t0, t1, w) => {
      const ax = g.x0 + g.u[0] * t0, ay = g.y0 + g.u[1] * t0;
      const bx = g.x0 + g.u[0] * t1, by = g.y0 + g.u[1] * t1;
      const qx = g.u[1] !== 0 ? w : 0;
      const qy = g.u[0] !== 0 ? w : 0;
      return [Math.min(ax, bx) - qx, Math.min(ay, by) - qy, Math.max(ax, bx) + qx, Math.max(ay, by) + qy];
    };
    const ecken = (R) => [[R[0], R[1]], [R[2], R[1]], [R[0], R[3]], [R[2], R[3]]];
    const verdeckt = (R) => formen.some((f) => ecken(R).every(([x, y]) => punktIn(f, x, y, 0)));
    const frei = (R) => !formen.some((f) => ueberlappt(R, formBox(f)));
    let fenster = [];
    const freiTeile = seg.map(() => []);
    seg.forEach((g, i) => {
      const d = Math.min(0.5, g.L / 2);
      const n = Math.ceil(g.L / d);
      let lauf = null;
      const schluss = () => {
        if (!lauf) return;
        if (lauf.art === "frei") freiTeile[i].push([lauf.t0, lauf.t1]);
        else if (lauf.art === "rand") fenster.push(rechteck(g, lauf.t0 - r, lauf.t1 + r, b));
        lauf = null;
      };
      for (let j = 0; j <= n; j++) {
        const t = Math.min(g.L, j * d);
        const t0 = Math.max(0, t - d / 2);
        const t1 = Math.min(g.L, t + d / 2);
        if (t1 <= t0) continue;
        const R = rechteck(g, t0 - r, t1 + r, b);
        const art = verdeckt(R) ? "verdeckt" : frei(R) ? "frei" : "rand";
        if (lauf && lauf.art === art) lauf.t1 = t1;
        else { schluss(); lauf = { art, t0, t1 }; }
      }
      schluss();
    });
    // Freie Enden und Ecken: dort endet oder biegt ein Strich.
    const sonder = [rechteck(seg[0], -b, b, b)];
    const l = seg[seg.length - 1];
    sonder.push(rechteck(l, l.L - b, l.L + b, b));
    for (let k = 1; k < p.length - 1; k++) sonder.push([p[k][0] - b, p[k][1] - b, p[k][0] + b, p[k][1] + b]);
    sonder.forEach((R) => { if (!verdeckt(R)) fenster.push(R); });
    // In Einheiten der Grundgrafik, nach aussen auf ganze CSS-Pixel
    // gerundet. Sich beruehrende Fenster werden eins.
    const zuHaupt = (R) => [m.a * R[0] + m.e, m.d * R[1] + m.f, m.a * R[2] + m.e, m.d * R[3] + m.f];
    const zuLokal = (R) => [(R[0] - m.e) / m.a, (R[1] - m.f) / m.d, (R[2] - m.e) / m.a, (R[3] - m.f) / m.d];
    const raste = (R) => this._kasten(z, R).u;
    const haupt = fenster.map((R) => raste(zuHaupt(R)));
    const beruehrt = (A, B) => A[0] <= B[2] + 1e-9 && B[0] <= A[2] + 1e-9 && A[1] <= B[3] + 1e-9 && B[1] <= A[3] + 1e-9;
    for (let weiter = true; weiter;) {
      weiter = false;
      for (let x = 0; x < haupt.length && !weiter; x++) {
        for (let y = x + 1; y < haupt.length; y++) {
          if (beruehrt(haupt[x], haupt[y])) {
            haupt[x] = huelleVon(haupt[x], haupt[y]);
            haupt.splice(y, 1);
            weiter = true;
            break;
          }
        }
      }
    }
    fenster = haupt.map(zuLokal);
    // Baender: freie Stuecke ohne die Fenster.
    const baender = [];
    const E = UMLAUF + b + 1;
    seg.forEach((g, i) => {
      let stuecke = freiTeile[i].map((x) => x.slice());
      const streifen = rechteck(g, 0, g.L, b);
      fenster.forEach((W) => {
        if (!(W[0] < streifen[2] && streifen[0] < W[2] && W[1] < streifen[3] && streifen[1] < W[3])) return;
        let ta, tb;
        if (g.u[0] !== 0) { ta = (W[0] - g.x0) * g.u[0]; tb = (W[2] - g.x0) * g.u[0]; }
        else { ta = (W[1] - g.y0) * g.u[1]; tb = (W[3] - g.y0) * g.u[1]; }
        stuecke = abziehen(stuecke, Math.min(ta, tb), Math.max(ta, tb));
      });
      stuecke.forEach(([t0, t1]) => {
        if (t1 - t0 > 1e-6) baender.push({ g, t0, t1 });
      });
    });
    // Baender derselben Leitung duerfen sich nicht ueberlagern, sonst
    // deckt der Strich dort doppelt.
    for (let x = 0; x < baender.length; x++) {
      for (let y = x + 1; y < baender.length; y++) {
        const A = rechteck(baender[x].g, baender[x].t0, baender[x].t1, b);
        const B = rechteck(baender[y].g, baender[y].t0, baender[y].t1, b);
        if (A[0] < B[2] && B[0] < A[2] && A[1] < B[3] && B[1] < A[3]) return null;
      }
    }
    return { m, P, muster: muster.length % 2 ? muster.concat(muster) : muster, h, b, E, seg, formen, fenster, fensterHaupt: haupt, baender, rechteck, zuHaupt, zuLokal };
  },

  /** Baender und Fenster einer Leitung bauen (Plan aus _kachelStromPlan). */
  _kachelStrom(z, a, plan) {
    const el = a.el;
    const kopien = [];
    const teile = [];
    const s = z.mass.s;
    plan.baender.forEach((bd) => {
      const huelle = document.createElement("div");
      huelle.className = "lhc-band";
      huelle.setAttribute("data-lhc-intern", "");
      // Laengs enden Baender an Fenstern, die schon auf ganzen Pixeln liegen.
      const R = this._kasten(z, plan.zuHaupt(plan.rechteck(bd.g, bd.t0, bd.t1, plan.b)));
      lage(huelle, R.px, z.aPx);
      const C = this._kasten(z, plan.zuHaupt(plan.rechteck(bd.g, bd.t0 - plan.E, bd.t1 + plan.E, plan.b)));
      const inhalt = svgNeu(C.u, "lhc-band-inhalt");
      lage(inhalt, C.px, R.px);
      const karte = new Map([[z.svg, inhalt]]);
      const eltern = this._ebenenSchale(z, karte, el.parentNode);
      const k = el.cloneNode(false);
      k.removeAttribute("id");
      const ta = bd.t0 - plan.E;
      const tb = bd.t1 + plan.E;
      k.setAttribute("d", `M${zahl(bd.g.x0 + bd.g.u[0] * ta)} ${zahl(bd.g.y0 + bd.g.u[1] * ta)}L${zahl(bd.g.x0 + bd.g.u[0] * tb)} ${zahl(bd.g.y0 + bd.g.u[1] * tb)}`);
      // Muster wie im Original an dieser Stelle des Pfads.
      k.setAttribute("stroke-dashoffset", String(zahl(mod(bd.g.s0 + ta, plan.P))));
      eltern.appendChild(k);
      kopien.push(k);
      huelle.appendChild(inhalt);
      // Weg je Umlauf in Prozent der eigenen Breite oder Hoehe.
      const waag = bd.g.u[0] !== 0;
      const weg = ((UMLAUF * plan.m.a) / (waag ? C.u[2] - C.u[0] : C.u[3] - C.u[1])) * 100 * (waag ? bd.g.u[0] : bd.g.u[1]);
      teile.push({ art: "band", el: huelle, ziel: inhalt, waag, weg });
    });
    plan.fensterHaupt.forEach((W) => {
      const { px, u } = this._kasten(z, W);
      const wP = px[2] - px[0];
      const hP = px[3] - px[1];
      // Zelle je Bild: Fenster plus Polster je Seite. Gekuerzte Striche
      // ragen samt Kappe hoechstens so weit hinaus und erreichen nie das
      // Fenster der Nachbarzelle.
      // Reichweite e (Pixel): gekuerzter Strich plus Kappe, 2h + 1 Einheiten.
      // Zwischen zwei Fenstern liegen 2 * Polster - 1 Pixel.
      const polster = Math.ceil(((2 * plan.h + 1) * plan.m.a * s + 1) / 2) + 1;
      const zw = wP + 2 * polster;
      const zh = hP + 2 * polster;
      const spalten = Math.max(1, Math.min(BILDER, Math.round(Math.sqrt((BILDER * zh) / zw))));
      const zeilen = Math.ceil(BILDER / spalten);
      const huelle = document.createElement("div");
      huelle.className = "lhc-fenster";
      huelle.setAttribute("data-lhc-intern", "");
      lage(huelle, px, z.aPx);
      const u1 = 1 / s;
      const vbR = [u[0] - polster * u1, u[1] - polster * u1, u[0] + (spalten * zw - polster) * u1, u[1] + (zeilen * zh - polster) * u1];
      const raster = svgNeu(vbR, "lhc-raster");
      Object.assign(raster.style, { left: `${-polster}px`, top: `${-polster}px`, width: `${spalten * zw}px`, height: `${zeilen * zh}px` });
      const defs = raster.firstChild;
      // Fenster mit einem Pixel Saum, lokal. Darin zaehlen nur Striche, die
      // es samt runder Kappe erreichen.
      const Sl = plan.zuLokal([u[0] - u1, u[1] - u1, u[2] + u1, u[3] + u1]);
      const bereiche = stromBereiche(plan, Sl);
      const versatz = (k) => [((k % spalten) * zw * u1) / plan.m.a, (Math.floor(k / spalten) * zh * u1) / plan.m.d];
      // Alle 72 Bilder in einem Pfad: die Striche jedes Bildes als Teilzuege,
      // um die Zelle des Bildes verschoben. Gestrichelt wird hier nicht mehr.
      let d = "";
      for (let k = 0; k < BILDER; k++) d += stromStriche(plan, bereiche, -(UMLAUF * k) / BILDER, versatz(k));
      // Ausschnitt: die 72 Fenster, darin die verdeckenden Formen ausgespart.
      const nr = ++z.nr;
      const cp = document.createElementNS(NS, "clipPath");
      cp.setAttribute("id", `lhc-sf-${nr}`);
      cp.setAttribute("clipPathUnits", "userSpaceOnUse");
      const zellen = document.createElementNS(NS, "path");
      let zd = "";
      for (let k = 0; k < BILDER; k++) {
        const [vx, vy] = versatz(k);
        zd += `M${zahl(Sl[0] + vx)} ${zahl(Sl[1] + vy)}H${zahl(Sl[2] + vx)}V${zahl(Sl[3] + vy)}H${zahl(Sl[0] + vx)}Z`;
      }
      zellen.setAttribute("d", zd);
      cp.appendChild(zellen);
      defs.appendChild(cp);
      // Verdeckende Formen als Maske: die Formen der 72 Zellen duerfen sich
      // ueberschneiden, schwarz bleibt schwarz.
      const formen = plan.formen.filter((f) => ueberlappt(Sl, formBox(f)));
      const karte = new Map([[z.svg, raster]]);
      let oben = this._ebenenSchale(z, karte, el.parentNode);
      if (formen.length) {
        const gesamt = plan.zuLokal(vbR);
        const maske = document.createElementNS(NS, "mask");
        maske.setAttribute("id", `lhc-sm-${nr}`);
        maske.setAttribute("maskUnits", "userSpaceOnUse");
        maske.setAttribute("maskContentUnits", "userSpaceOnUse");
        ["x", "y", "width", "height"].forEach((n, i) => {
          maske.setAttribute(n, String(zahl(i < 2 ? gesamt[i] - 10 : gesamt[i] - gesamt[i - 2] + 20)));
        });
        const weiss = document.createElementNS(NS, "rect");
        ["x", "y", "width", "height"].forEach((n, i) => {
          weiss.setAttribute(n, String(zahl(i < 2 ? gesamt[i] - 10 : gesamt[i] - gesamt[i - 2] + 20)));
        });
        weiss.setAttribute("fill", "#fff");
        // Jede Form nur innerhalb ihrer Zelle, sonst verdeckte sie Teile
        // des Nachbarbilds.
        const schwarz = document.createElementNS(NS, "path");
        const vielecke = formen.map((f) => vieleckIn(formVieleck(f), Sl)).filter((v) => v.length >= 3);
        let sd = "";
        for (let k = 0; k < BILDER; k++) {
          const [vx, vy] = versatz(k);
          vielecke.forEach((v) => {
            sd += v.map(([x, y], i) => `${i ? "L" : "M"}${zahl(x + vx)} ${zahl(y + vy)}`).join("") + "Z";
          });
        }
        schwarz.setAttribute("d", sd);
        schwarz.setAttribute("fill", "#000");
        maske.appendChild(weiss);
        maske.appendChild(schwarz);
        defs.appendChild(maske);
        const gr = document.createElementNS(NS, "g");
        gr.setAttribute("mask", `url(#lhc-sm-${nr})`);
        oben.appendChild(gr);
        oben = gr;
      }
      const bild = el.cloneNode(false);
      bild.removeAttribute("id");
      bild.removeAttribute("stroke-dashoffset");
      bild.setAttribute("d", d || "M0 0");
      bild.setAttribute("clip-path", `url(#lhc-sf-${nr})`);
      oben.appendChild(bild);
      kopien.push(bild);
      const schritte = [];
      for (let k = 0; k < BILDER; k++) schritte.push([-(k % spalten) * zw, -Math.floor(k / spalten) * zh]);
      huelle.appendChild(raster);
      teile.push({ art: "fenster", el: huelle, ziel: raster, schritte });
    });
    this._ebenenInVorlage(z, a);
    z.kopien.set(el, kopien);
    return { art: "strom", el: null, teile, atome: [a], id: el.id, atom: a };
  },

  /**
   * Alle Kacheln in Zeichenreihenfolge bauen. Erst wird alles vermessen,
   * dann gebaut. Jede Messung nach einer Aenderung am Baum zwingt den
   * Browser, die ganze Seite neu zu berechnen.
   * Aufeinander folgende unbewegte Teile, die nahe beieinander liegen,
   * teilen sich eine Kachel.
   */
  _kachelnBauen(z) {
    const regeln = deckkraftRegeln(z.svg.getRootNode());
    const plaene = [];
    z.atome.forEach((a, index) => {
      a.index = index;
      if (a.ebene === 0 || !a.box) return;
      let art = this._kachelArt(a);
      let plan = null;
      if (art === "strom") plan = this._kachelStromPlan(z, a);
      else if (art === "dreh" || art === "flacker") plan = relCtm(a.el.parentNode);
      else if (art === "blasen") plan = this._kachelBlasenPlan(z, a);
      else if (art === "puls") plan = deckkraftWirkt(a.el, regeln);
      if (!plan && art !== "fest" && art !== "puls") art = "js";
      plaene.push({ a, art, plan });
    });
    let sammel = null;
    const setze = (k) => {
      z.kacheln.push(k);
      if (k.art === "strom") k.teile.forEach((t) => z.bewegt.appendChild(t.el));
      else z.bewegt.appendChild(k.el);
      if (k.id && k.art !== "fest" && k.art !== "js") z.komp.add(k.id);
    };
    const sammelSchluss = () => {
      if (sammel) setze(this._kachelFest(z, sammel, "fest"));
      sammel = null;
    };
    plaene.forEach(({ a, art, plan }) => {
      if (art === "fest") {
        if (sammel) {
          const u = sammel.reduce((b, x) => huelleVon(b, x.box), sammel[0].box);
          const summe = sammel.reduce((s, x) => s + flaeche(x.box), 0) + flaeche(a.box);
          if (ueberlappt(u, a.box) || flaeche(huelleVon(u, a.box)) <= 1.5 * summe) { sammel.push(a); return; }
        }
        sammelSchluss();
        sammel = [a];
        return;
      }
      sammelSchluss();
      let k = null;
      if (art === "strom") k = this._kachelStrom(z, a, plan);
      else if (art === "dreh") k = this._kachelDreh(z, a, plan);
      else if (art === "flacker") k = this._kachelFlacker(z, a, plan);
      else if (art === "blasen") k = this._kachelBlasen(z, a, plan);
      else if (art === "puls") k = this._kachelPuls(z, a, plan);
      setze(k || this._kachelFest(z, [a], "js"));
    });
    sammelSchluss();
  },

  /** Lage der Kachelebene ueber dem Bild der Grundgrafik. */
  _kachelnLegen() {
    const e = this._ebenen;
    if (!e) return;
    const m = this._ebenenMass(e.svg);
    if (!m) return;
    const p = e.mass;
    // Die Kacheln liegen auf ganzen Pixeln des Masses, mit dem sie gebaut
    // wurden. Bis zum Neubau folgt die Ebene einer neuen Groesse als Ganzes.
    const sx = m.bw / p.bw;
    const sy = m.bh / p.bh;
    const gleich = Math.abs(sx - 1) < 1e-4 && Math.abs(sy - 1) < 1e-4;
    Object.assign(e.bewegt.style, {
      left: `${m.bx}px`, top: `${m.by}px`, width: `${p.bw}px`, height: `${p.bh}px`,
      transformOrigin: "0 0", transform: gleich ? "" : `scale(${sx}, ${sy})`,
    });
    const anders = !gleich || Math.abs(m.ox - p.ox) > 0.01 || Math.abs(m.oy - p.oy) > 0.01 || Math.abs(m.dpr - p.dpr) > 1e-6;
    if (anders) {
      clearTimeout(e.neuTimer);
      e.neuTimer = setTimeout(() => {
        if (this._ebenen === e) this._ebenenNeu();
      }, 250);
    }
  },

  /** Passt die Kachel noch um ihren Inhalt? */
  _kachelPasst(k, box) {
    if (!k || !k.box || !box) return true;
    if (k.art === "strom" || k.art === "blasen") return true;
    return enthaelt(k.box, box, 0.5);
  },
};
