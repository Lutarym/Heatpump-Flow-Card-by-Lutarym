/**
 * Zeichenebenen fuer eine fluessige Animation.
 *
 * Browser zeichnen eine SVG-Grafik als eine einzige Flaeche. Bewegt sich
 * darin etwas, wird bei jedem Bild der betroffene Bereich mit allem, was
 * dort liegt, neu gezeichnet: Schrift, Verlaeufe, Glas. WebKit (Safari und
 * alle Browser auf iPhone und iPad) fasst die Bereiche dabei grob
 * zusammen. Gemessen in WebKitGTK 2.52: fast die ganze Karte bei jedem Bild.
 *
 * Darum liegen die bewegten Teile ueber der Grafik, jedes in einer eigenen
 * kleinen Kachel (kacheln.js), deren Bewegung der Browser selbst abspielt
 * (takt.js). Die Reihenfolge beim Zeichnen bleibt dieselbe wie in einer
 * einzigen Grafik:
 *  - Grund: die urspruengliche Grafik mit allem Unbewegten. Sie bleibt das
 *    Original mit allen Kennungen, Klicks und Hinweisen.
 *  - Kacheln, in Zeichenreihenfolge: die bewegten Teile und Unbewegtes, das
 *    in der Grafik ueber einem bewegten Teil liegt, etwa das Glas vor den
 *    Blasen im Speicher.
 * Liegt eine deckende Form (Gehaeuse, Speicher, Pumpe) ueber einem
 * bewegten Teil, wird das bewegte Teil dort ausgeschnitten. Dort war es
 * ohnehin verdeckt, und die Form bleibt im Grund.
 *
 * Wo ein Teil in eine obere Ebene wandert, bleibt im Grund ein
 * unsichtbarer Platzhalter. Er nimmt Klicks und Mauszeiger an, so wie
 * vorher das Teil selbst.
 */

const NS = "http://www.w3.org/2000/svg";

// Nicht gezeichnete Inhalte bleiben, wo sie sind.
const NICHT_GEZEICHNET = new Set([
  "defs", "style", "title", "desc", "clipPath", "mask", "linearGradient",
  "radialGradient", "pattern", "marker", "symbol", "filter", "metadata", "script",
]);

// Alles, was die Animationsschleife bewegt (karte.js, aktualisieren.js,
// solar.js): Laufstriche, Leuchten, Luefter, Rotoren, Blasen, Abzeichen,
// Betriebssymbole, Waerme am Heizkoerper, Feuer, Druckwarnung, Solar.
const BEWEGT_ID = /^(unit-glow|fan\d|.+-rotor|.+-badge|modus-(betrieb|heizen|kuehlen|ww|auto|abtauen)|hk\d-waerme|kamin-feuer|kamin-glut|press-v|press-warn|solar-(strahlen|schein|effekt|effekt2|hell)|.+-bubbles)$/;

// Drehende Teile: ihr Platz ist ein Kreis um den eigenen Ursprung.
const DREHT_ID = /^(fan\d|solar-strahlen)$/;

// Elemente mit :hover-Regeln im Stil. Platzhalter und Schalen bekommen
// stattdessen die Klasse lhc-schwebt (siehe stil.js).
const SCHWEBT = ".klickbar, .dia-knopf, .tuer-knopf";

const istBewegt = (el) =>
  Boolean(el.classList && (el.classList.contains("flowdots") || BEWEGT_ID.test(el.id || "")));

/** Enthaelt das Element etwas Bewegtes? Blasen stecken in einem Ausschnitt. */
const enthaeltBewegtes = (el) =>
  istBewegt(el) || Array.from(el.querySelectorAll ? el.querySelectorAll("[id], .flowdots") : []).some(istBewegt);

/** Farbe deckend? "keine" fuer none. */
function deckendeFarbe(wert, deckkraft, wurzel) {
  if (!wert || wert === "none") return "keine";
  if (parseFloat(deckkraft) < 1) return false;
  const url = /url\(\s*["']?#([^"')\s]+)/.exec(wert);
  if (url) return verlaufDeckt(wurzel, url[1]);
  if (wert === "transparent") return false;
  // rgb(), rgba(), color(srgb ...), oklch() usw.: Deckkraft nach "/" oder als vierter Wert.
  const m = /^[a-z-]+\((.*)\)$/i.exec(String(wert).trim());
  if (!m) return false;
  const innen = m[1];
  let a = "1";
  if (innen.includes("/")) a = innen.split("/").pop().trim();
  else {
    const teile = innen.split(",");
    if (teile.length === 4) a = teile[3].trim();
  }
  const wertA = a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a);
  return Number.isFinite(wertA) && wertA >= 1;
}

/** Ein Farbverlauf deckt, wenn alle Stufen deckend sind. */
function verlaufDeckt(wurzel, id, tiefe = 0) {
  const g = wurzel.getElementById(id);
  if (!g || tiefe > 4) return false;
  if (g.localName !== "linearGradient" && g.localName !== "radialGradient") return false;
  const stufen = Array.from(g.children).filter((s) => s.localName === "stop");
  if (!stufen.length) {
    const ref = (g.getAttribute("href") || g.getAttribute("xlink:href") || "").replace(/^#/, "");
    return ref ? verlaufDeckt(wurzel, ref, tiefe + 1) : false;
  }
  return stufen.every((s) => {
    const cs = getComputedStyle(s);
    return deckendeFarbe(cs.stopColor, cs.stopOpacity, wurzel) === true;
  });
}

export const ueberlappt = (p, q) => !p || !q || (p[0] < q[2] && q[0] < p[2] && p[1] < q[3] && q[1] < p[3]);
const schnitt = (p, q) => [Math.max(p[0], q[0]), Math.max(p[1], q[1]), Math.min(p[2], q[2]), Math.min(p[3], q[3])];

/** Liegt der Punkt in der Form? */
export function punktIn(f, x, y, tol = 1e-6) {
  if (f.art === "ell") {
    const dx = (x - f.cx) / (f.rx + tol);
    const dy = (y - f.cy) / (f.ry + tol);
    return dx * dx + dy * dy <= 1 + 1e-9;
  }
  if (x < f.x0 - tol || x > f.x1 + tol || y < f.y0 - tol || y > f.y1 + tol) return false;
  if (!f.rx || !f.ry) return true;
  const ex = x < f.x0 + f.rx ? f.x0 + f.rx : x > f.x1 - f.rx ? f.x1 - f.rx : x;
  const ey = y < f.y0 + f.ry ? f.y0 + f.ry : y > f.y1 - f.ry ? f.y1 - f.ry : y;
  if (ex === x || ey === y) return true;
  const dx = (x - ex) / (f.rx + tol);
  const dy = (y - ey) / (f.ry + tol);
  return dx * dx + dy * dy <= 1 + 1e-9;
}

/** Liegt das Rechteck ganz in der (konvexen) Form? */
const rechteckIn = (f, r) =>
  r[0] >= r[2] || r[1] >= r[3] ||
  [[r[0], r[1]], [r[2], r[1]], [r[0], r[3]], [r[2], r[3]]].every(([x, y]) => punktIn(f, x, y));

/** Punkte auf dem Umriss einer Form. */
function umriss(f) {
  if (f.art === "ell") {
    return Array.from({ length: 32 }, (_, k) => [f.cx + f.rx * Math.cos((k * Math.PI) / 16), f.cy + f.ry * Math.sin((k * Math.PI) / 16)]);
  }
  const pkt = [];
  const rx = f.rx || 0, ry = f.ry || 0;
  [[f.x1 - rx, f.y0 + ry, -Math.PI / 2], [f.x1 - rx, f.y1 - ry, 0], [f.x0 + rx, f.y1 - ry, Math.PI / 2], [f.x0 + rx, f.y0 + ry, Math.PI]]
    .forEach(([cx, cy, w0]) => {
      for (let k = 0; k <= 8; k++) {
        const w = w0 + (k * Math.PI) / 16;
        pkt.push([cx + rx * Math.cos(w), cy + ry * Math.sin(w)]);
      }
    });
  return pkt;
}

/** Liegt die Form ganz in der (konvexen) Form c? */
const formIn = (f, c) => umriss(f).every(([x, y]) => punktIn(c, x, y, 0.05));

/**
 * Groesster Abstand eines drehenden Teils von seinem Drehpunkt. Aus den
 * Ecken der Teilformen, eher etwas zu gross als zu klein.
 */
function drehRadius(el, m0) {
  const innen = m0.inverse();
  let rad = 0;
  [el, ...el.querySelectorAll("*")].forEach((f) => {
    if (f.localName === "g" || typeof f.getBBox !== "function") return;
    const fm = f.getScreenCTM && f.getScreenCTM();
    if (!fm) return;
    const mm = innen.multiply(fm);
    const b = f.getBBox();
    if (f.localName === "circle") {
      const cx = mm.a * f.cx.baseVal.value + mm.c * f.cy.baseVal.value + mm.e;
      const cy = mm.b * f.cx.baseVal.value + mm.d * f.cy.baseVal.value + mm.f;
      rad = Math.max(rad, Math.hypot(cx, cy) + f.r.baseVal.value * Math.hypot(mm.a, mm.b));
      return;
    }
    [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].forEach(([x, y]) => {
      rad = Math.max(rad, Math.hypot(mm.a * x + mm.c * y + mm.e, mm.b * x + mm.d * y + mm.f));
    });
  });
  return rad;
}

/**
 * Lage eines Elements in Einheiten seiner aeussersten Grafik. Grund,
 * Vorlage und Kacheln rechnen alle in Einheiten der Grundgrafik. Eine
 * Drehung oder Verschiebung der Kachel selbst faellt dabei heraus.
 */
export function relCtm(el) {
  if (!el || typeof el.getScreenCTM !== "function") return null;
  let r = el.ownerSVGElement;
  // Das aeussere SVG selbst: keine Verschiebung.
  if (!r) return typeof el.createSVGMatrix === "function" ? el.createSVGMatrix() : null;
  while (r.ownerSVGElement) r = r.ownerSVGElement;
  const a = r.getScreenCTM();
  const b = el.getScreenCTM();
  if (!a || !b) return null;
  return a.inverse().multiply(b);
}

export const formBox = (f) => (f.art === "ell" ? [f.cx - f.rx, f.cy - f.ry, f.cx + f.rx, f.cy + f.ry] : [f.x0, f.y0, f.x1, f.y1]);

const zahl = (v) => Math.round(v * 100) / 100;

/** Umriss einer Form als Pfad. */
export function formPfad(f) {
  if (f.art === "ell") {
    return `M${zahl(f.cx - f.rx)} ${zahl(f.cy)}A${zahl(f.rx)} ${zahl(f.ry)} 0 1 0 ${zahl(f.cx + f.rx)} ${zahl(f.cy)}` +
      `A${zahl(f.rx)} ${zahl(f.ry)} 0 1 0 ${zahl(f.cx - f.rx)} ${zahl(f.cy)}Z`;
  }
  const { x0, y0, x1, y1 } = f;
  const rx = Math.min(f.rx || 0, (x1 - x0) / 2);
  const ry = Math.min(f.ry || 0, (y1 - y0) / 2);
  if (!rx || !ry) return `M${zahl(x0)} ${zahl(y0)}H${zahl(x1)}V${zahl(y1)}H${zahl(x0)}Z`;
  const b = (x, y) => `A${zahl(rx)} ${zahl(ry)} 0 0 1 ${zahl(x)} ${zahl(y)}`;
  return `M${zahl(x0 + rx)} ${zahl(y0)}H${zahl(x1 - rx)}${b(x1, y0 + ry)}V${zahl(y1 - ry)}${b(x1 - rx, y1)}` +
    `H${zahl(x0 + rx)}${b(x0, y1 - ry)}V${zahl(y0 + ry)}${b(x0 + rx, y0)}Z`;
}

/** Strecken eines Pfads aus M, L, H, V und Z. Sonst null. */
function strecken(d) {
  const teile = String(d || "").match(/[MmLlHhVvZz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi);
  if (!teile || /[^MmLlHhVvZz\d\s,.eE+-]/.test(d)) return null;
  const out = [];
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0;
  const z = () => Number(teile[i++]);
  while (i < teile.length) {
    if (/[a-z]/i.test(teile[i])) cmd = teile[i++];
    if (!cmd) return null;
    const rel = cmd === cmd.toLowerCase();
    const c = cmd.toUpperCase();
    if (c === "Z") { if (x !== sx || y !== sy) out.push([x, y, sx, sy]); x = sx; y = sy; cmd = ""; continue; }
    let nx = x, ny = y;
    if (c === "M" || c === "L") { nx = z() + (rel ? x : 0); ny = z() + (rel ? y : 0); }
    else if (c === "H") nx = z() + (rel ? x : 0);
    else if (c === "V") ny = z() + (rel ? y : 0);
    else return null;
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
    if (c === "M") { sx = nx; sy = ny; cmd = rel ? "l" : "L"; }
    else out.push([x, y, nx, ny]);
    x = nx; y = ny;
  }
  return out;
}

export const ebenenKarte = {
  /** Ebenen anlegen. Nur mit laufender Animation sinnvoll. */
  _ebenenPlanen() {
    if (this._ebenenAus) return false;
    const sr = this.shadowRoot;
    const svg = sr && sr.querySelector(".lhc-scene svg.lhc-svg");
    if (!svg || !svg.isConnected) return false;
    const ctm = svg.getScreenCTM && svg.getScreenCTM();
    const mass = ctm ? this._ebenenMass(svg) : null;
    if (!mass) return false;
    const atome = this._ebenenAtome(svg);
    this._ebenenVermessen(svg, atome);
    this._ebenenVerteilen(atome);
    try {
      this._ebenenBauen(svg, atome, mass);
    } catch (fehler) {
      // Dann eben ohne eigene Ebenen, die Schleife zeichnet alles wie frueher.
      console.warn("Heatpump Flow Card: Ebenen nicht moeglich", fehler);
      this._ebenenAufloesen();
      this._ebenenAus = true;
      return false;
    }
    this._ebenenTakt();
    return true;
  },

  /** Zuruecksetzen. Ohne DOM nur den Zustand vergessen. */
  _ebenenAufloesen(nurZustand) {
    const e = this._ebenen;
    this._ebenen = null;
    if (!e) return;
    if (e.beobachter) e.beobachter.disconnect();
    if (e.groesse) e.groesse.disconnect();
    if (e.aufloesung && e.aufloesungRuf) e.aufloesung.removeEventListener("change", e.aufloesungRuf);
    clearTimeout(e.pruefTimer);
    clearTimeout(e.schwebTimer);
    clearTimeout(e.neuTimer);
    // Erreichte Winkel uebernimmt die Animationsschleife, nichts springt.
    this._taktAus(e);
    if (nurZustand) return;
    e.lauscher.forEach(([el, art, fn, erfassen]) => el.removeEventListener(art, fn, Boolean(erfassen)));
    e.atome.forEach((a) => {
      if (a.platz && a.platz.isConnected) a.platz.replaceWith(a.el);
      // Abblenden gehoert nur zu den Ebenen.
      if (a.el.classList) a.el.classList.remove("lhc-schwebt");
      if (a.el.querySelectorAll) a.el.querySelectorAll(".lhc-schwebt").forEach((x) => x.classList.remove("lhc-schwebt"));
    });
    [e.bewegt, e.vorlage].forEach((s) => s && s.remove());
    // Spaetere Zeichenbefehle sollen wieder das Original treffen.
    if (this._bubbleCache) this._bubbleCache.clear();
  },

  /** Teile in Zeichenreihenfolge. Gruppen werden zerlegt, ausser sie wirken als Ganzes. */
  _ebenenAtome(svg) {
    const atome = [];
    const ganz = (g) => {
      const cs = getComputedStyle(g);
      const op = parseFloat(cs.opacity);
      // Teildeckende Gruppe: Getrennt ergaebe sich an Ueberschneidungen ein anderes Bild.
      // Beim Ueberfahren mit der Maus (0,82) gilt das nicht, siehe lhc-schwebt.
      if (op > 0 && op < 1 && !g.matches(":hover")) return true;
      return g.hasAttribute("clip-path") || cs.clipPath !== "none" || g.hasAttribute("mask") ||
        (cs.mask && cs.mask !== "none") || cs.filter !== "none" || (cs.mixBlendMode && cs.mixBlendMode !== "normal");
    };
    const sammle = (k) => {
      for (const c of Array.from(k.children)) {
        if (NICHT_GEZEICHNET.has(c.localName)) continue;
        const gruppe = c.localName === "g" || c.localName === "a";
        if (gruppe && !istBewegt(c) && !ganz(c)) { sammle(c); continue; }
        atome.push({
          el: c,
          bewegt: enthaeltBewegtes(c),
          // Bedienbares bleibt im Grund, sonst gaebe es zwei Tabstopps.
          fest: c.matches("[tabindex], [role=button], foreignObject") || Boolean(c.querySelector("[tabindex], [role=button], foreignObject")),
        });
      }
    };
    sammle(svg);
    return atome;
  },

  /**
   * Lage jedes Teils in Koordinaten der Grafik, seine Form und ob es
   * darunter liegendes vollstaendig verdeckt. Mit nur werden nur diese
   * Teile neu vermessen.
   */
  _ebenenVermessen(svg, atome, nur) {
    const ecken = (m, x0, y0, x1, y1) => {
      const p = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
      const xs = p.map((q) => q[0]);
      const ys = p.map((q) => q[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    };
    atome.forEach((a) => {
      if (nur && !nur.has(a)) return;
      const el = a.el;
      a.box = null;
      a.kern = null;
      a.form = null;
      a.deck = null;
      let bb = null;
      try { bb = el.getBBox(); } catch { bb = null; }
      // Lage in Einheiten der Grundgrafik, auch fuer Teile in Kacheln.
      const m0 = relCtm(el);
      if (!bb || !m0) return;
      const blatt = !el.children.length;
      let rand = 0;
      let filter = false;
      (blatt ? [el] : [el, ...el.querySelectorAll("*")]).forEach((x) => {
        const cs = getComputedStyle(x);
        if (cs.stroke && cs.stroke !== "none") rand = Math.max(rand, (parseFloat(cs.strokeWidth) || 0) / 2);
        if (cs.filter && cs.filter !== "none") filter = true;
      });
      let m = m0;
      let x0 = bb.x - rand, y0 = bb.y - rand, x1 = bb.x + bb.width + rand, y1 = bb.y + bb.height + rand;
      if (el.classList.contains("rotor") || DREHT_ID.test(el.id)) {
        // Drehung um den eigenen Ursprung: Kreis mit dem groessten Abstand.
        // Die Form aendert sich nie, darum nur einmal rechnen.
        if (a.dreh === undefined) a.dreh = drehRadius(el, el.getScreenCTM()) + rand + 1;
        const pm = relCtm(el.parentNode);
        m = pm;
        const mm = pm.inverse().multiply(m0);
        x0 = mm.e - a.dreh; y0 = mm.f - a.dreh; x1 = mm.e + a.dreh; y1 = mm.f + a.dreh;
      } else if (el.hasAttribute("clip-path") && el.querySelector("[id$='-bubbles']")) {
        // Blasen bleiben im Ausschnitt.
        const id = (/#([^)"'\s]+)/.exec(el.getAttribute("clip-path")) || [])[1];
        const cp = id && svg.getRootNode().getElementById(id);
        const form = cp && cp.firstElementChild;
        if (form && typeof form.getBBox === "function") {
          const b = form.getBBox();
          x0 = b.x; y0 = b.y; x1 = b.x + b.width; y1 = b.y + b.height;
        }
      } else if (/-bubbles$/.test(el.id)) {
        // Blasen ohne Ausschnitt: vom Start unten bis 330 hoeher (karte.js).
        const kreise = Array.from(el.querySelectorAll("circle"));
        if (kreise.length) {
          x0 = Math.min(...kreise.map((k) => k.cx.baseVal.value - k.r.baseVal.value)) - 1;
          x1 = Math.max(...kreise.map((k) => k.cx.baseVal.value + k.r.baseVal.value)) + 1;
          y0 = Math.min(...kreise.map((k) => k.cy.baseVal.value - k.r.baseVal.value)) - 331;
          y1 = Math.max(...kreise.map((k) => k.cy.baseVal.value + k.r.baseVal.value)) + 1;
        }
      } else if (/^solar-(effekt|effekt2|hell)$/.test(el.id)) {
        // Funken, Flimmern und Strahlen bleiben zwischen Sonne und Kollektor (solar.js).
        const q = svg.getRootNode().getElementById("solar-effekt");
        const d = q ? q.dataset : {};
        const x = Number(d.x), u = Number(d.u), o = Number(d.o), sx = Number(d.sx), sy = Number(d.sy);
        if ([x, u, o, sx, sy].every(Number.isFinite)) {
          m = relCtm(q.parentNode);
          x0 = Math.min(x, sx - 30) - 10; x1 = x + 140; y0 = Math.min(o - 30, sy - 30); y1 = u + 15;
        }
      } else if (el.id === "kamin-feuer") {
        // Flackern streckt und neigt die Flammen.
        const dx = (x1 - x0) * 0.25, dy = (y1 - y0) * 0.25;
        x0 -= dx; x1 += dx; y0 -= dy; y1 += dy;
      }
      a.kern = ecken(m, x0, y0, x1, y1);
      // Kantenglaettung und Filterschein.
      const extra = 2 + (filter ? 16 : 0);
      let ex = extra, ey = extra;
      if (el.localName === "text") {
        // Texte aendern ihren Inhalt. Groessere Aenderungen fallen bei der Pruefung auf.
        const fs = parseFloat(getComputedStyle(el).fontSize) || 14;
        ex += fs * 0.6;
        ey += fs * 0.3;
      }
      a.box = [a.kern[0] - ex, a.kern[1] - ey, a.kern[2] + ex, a.kern[3] + ey];
      if (blatt && !a.bewegt) {
        const f = this._ebenenForm(svg, el, m);
        if (f) {
          a.form = f.formen;
          if (f.deckt) a.deck = f.formen;
        }
      }
    });
  },

  /**
   * Umriss einfacher Formen (Rechteck, Kreis, Ellipse, gerade Leitung) in
   * Koordinaten der Grafik und ob die Form alles darunter verdeckt.
   */
  _ebenenForm(svg, el, m) {
    const art = el.localName;
    if (!["rect", "circle", "ellipse", "path", "line"].includes(art)) return null;
    // Nur verschoben und gleichmaessig vergroessert.
    if (Math.abs(m.b) > 1e-6 || Math.abs(m.c) > 1e-6 || m.a <= 0 || Math.abs(m.a - m.d) > 1e-6) return null;
    const wurzel = svg.getRootNode();
    const cs = getComputedStyle(el);
    const s = m.a;
    const fuell = deckendeFarbe(cs.fill, cs.fillOpacity, wurzel);
    const strich = deckendeFarbe(cs.stroke, cs.strokeOpacity, wurzel);
    const sw = (parseFloat(cs.strokeWidth) || 0) * s;
    const mitStrich = strich !== "keine" && sw > 0;
    const halb = mitStrich ? sw / 2 : 0;
    const px = (x) => m.a * x + m.e;
    const py = (y) => m.d * y + m.f;
    let formen = null;
    let deckt = false;
    if (art === "rect" || art === "circle" || art === "ellipse") {
      if (fuell === "keine" && !mitStrich) return null;
      deckt = fuell === true && (!mitStrich || strich === true);
      if (art === "rect") {
        const x = el.x.baseVal.value, y = el.y.baseVal.value;
        const w = el.width.baseVal.value, h = el.height.baseVal.value;
        const rxA = el.getAttribute("rx"), ryA = el.getAttribute("ry");
        let rx = rxA !== null ? parseFloat(rxA) : ryA !== null ? parseFloat(ryA) : 0;
        let ry = ryA !== null ? parseFloat(ryA) : rx;
        rx = Math.min(rx || 0, w / 2);
        ry = Math.min(ry || 0, h / 2);
        formen = [{ art: "rr", x0: px(x) - halb, y0: py(y) - halb, x1: px(x + w) + halb, y1: py(y + h) + halb,
          rx: rx ? rx * s + halb : 0, ry: ry ? ry * s + halb : 0 }];
      } else {
        const cx = px(el.cx.baseVal.value), cy = py(el.cy.baseVal.value);
        const rx = (art === "circle" ? el.r.baseVal.value : el.rx.baseVal.value) * s + halb;
        const ry = (art === "circle" ? el.r.baseVal.value : el.ry.baseVal.value) * s + halb;
        formen = [{ art: "ell", cx, cy, rx, ry }];
      }
    } else {
      // Leitungen: nur Strich, gerade Abschnitte.
      if (fuell !== "keine" || !mitStrich) return null;
      const kappe = cs.strokeLinecap;
      const st = art === "line"
        ? [[el.x1.baseVal.value, el.y1.baseVal.value, el.x2.baseVal.value, el.y2.baseVal.value]]
        : strecken(el.getAttribute("d"));
      if (!st || !st.length) return null;
      if (st.length > 1 && cs.strokeLinejoin !== "round") return null;
      const r = sw / 2;
      formen = [];
      for (const [ax, ay, bx, by] of st) {
        const X0 = px(Math.min(ax, bx)), X1 = px(Math.max(ax, bx));
        const Y0 = py(Math.min(ay, by)), Y1 = py(Math.max(ay, by));
        const waag = Math.abs(Y1 - Y0) < 1e-6;
        const senk = Math.abs(X1 - X0) < 1e-6;
        if (!waag && !senk) return null;
        if (kappe === "round") formen.push({ art: "rr", x0: X0 - r, y0: Y0 - r, x1: X1 + r, y1: Y1 + r, rx: r, ry: r });
        else if (kappe === "square") formen.push({ art: "rr", x0: X0 - r, y0: Y0 - r, x1: X1 + r, y1: Y1 + r, rx: 0, ry: 0 });
        else if (st.length === 1) formen.push(waag
          ? { art: "rr", x0: X0, y0: Y0 - r, x1: X1, y1: Y1 + r, rx: 0, ry: 0 }
          : { art: "rr", x0: X0 - r, y0: Y0, x1: X1 + r, y1: Y1, rx: 0, ry: 0 });
        else return null;
      }
      deckt = strich === true && (!cs.strokeDasharray || cs.strokeDasharray === "none");
    }
    if (deckt) {
      if (cs.visibility !== "visible") deckt = false;
      // Deckkraft und Effekte bis zur Grafik. Das Ueberfahren mit der Maus zaehlt nicht.
      for (let e = el; deckt && e && e.ownerSVGElement; e = e.parentNode) {
        const ce = e === el ? cs : getComputedStyle(e);
        if (ce.display === "none" || (parseFloat(ce.opacity) < 1 && !e.matches(":hover")) ||
            ce.filter !== "none" || ce.clipPath !== "none" || e.hasAttribute("clip-path") || e.hasAttribute("mask") ||
            (ce.mixBlendMode && ce.mixBlendMode !== "normal")) deckt = false;
      }
    }
    return { formen, deckt };
  },

  /**
   * Verteilt die Teile auf Grund (0), Bewegt (1) und Vorn (2).
   * Reihenfolge innerhalb jeder Ebene bleibt die der Grafik.
   */
  _ebenenVerteilen(atome) {
    // Spaetere deckende Formen, die das Teil beruehren: dort ist es verdeckt.
    atome.forEach((a, i) => {
      a.schnitt = [];
      if (!a.box) return;
      for (let j = i + 1; j < atome.length; j++) {
        const c = atome[j];
        if (!c.deck || !ueberlappt(a.box, c.box)) continue;
        c.deck.forEach((f) => { if (ueberlappt(a.box, formBox(f))) a.schnitt.push(f); });
      }
    });
    // b ist dort, wo a liegt, ohnehin verdeckt.
    const verdeckt = (b, a) => {
      if (!a.kern || !b.kern) return false;
      const R = schnitt(a.kern, b.kern);
      // Nur die Raender beruehren sich: Kantenglaettung oder Platz fuer laengere Texte.
      if (R[0] >= R[2] || R[1] >= R[3]) return true;
      if (b.schnitt.some((f) => rechteckIn(f, R))) return true;
      return Boolean(a.form) && b.schnitt.some((f) => a.form.every((g) => formIn(g, f)));
    };
    // Teile, die im Grund bleiben muessen: Bedienbares und was darunter liegt.
    const unten = new Set();
    for (let runde = 0; runde <= atome.length; runde++) {
      const verstoss = [];
      atome.forEach((a, i) => {
        const fest = a.fest || unten.has(a);
        a.ebene = a.bewegt && !fest ? 1 : 0;
        a.wegen = null;
        for (let j = 0; j < i; j++) {
          const b = atome[j];
          if (b.ebene === 0 || !ueberlappt(a.box, b.box)) continue;
          // Deckt a das hoeher liegende b ab, wird b dort ausgeschnitten.
          if (a.deck) continue;
          if (b.ebene === a.ebene && (a.ebene === 2 || a.bewegt)) continue;
          if (verdeckt(b, a)) continue;
          if (fest) verstoss.push(b);
          else if (a.ebene !== 2) { a.ebene = 2; a.wegen = b; }
        }
      });
      if (!verstoss.length) break;
      verstoss.forEach((b) => unten.add(b));
    }
    // Ausschnitte nur fuer Teile ausserhalb des Grunds, ohne doppelte Formen.
    atome.forEach((a) => {
      if (a.ebene === 0) { a.schnitt = []; return; }
      const eigen = [];
      a.schnitt.forEach((f) => {
        const R = schnitt(a.box, formBox(f));
        if (eigen.some((g) => rechteckIn(g, R))) return;
        for (let k = eigen.length - 1; k >= 0; k--) {
          if (rechteckIn(f, schnitt(a.box, formBox(eigen[k])))) eigen.splice(k, 1);
        }
        eigen.push(f);
      });
      a.schnitt = eigen;
    });
  },

  /** Vorlage und Kacheln in den Baum setzen. */
  _ebenenBauen(svg, atome, mass) {
    const szene = svg.parentNode;
    const vb = svg.viewBox.baseVal;
    // Unsichtbare Vorlage: Originale, die nur als Kopie gezeigt werden
    // (Laufstriche, Blasen). Gleiche Einheiten wie die Grundgrafik.
    const vorlage = document.createElementNS(NS, "svg");
    ["viewBox", "preserveAspectRatio"].forEach((n) => {
      if (svg.hasAttribute(n)) vorlage.setAttribute(n, svg.getAttribute(n));
    });
    vorlage.setAttribute("class", "lhc-vorlage");
    vorlage.setAttribute("aria-hidden", "true");
    vorlage.setAttribute("focusable", "false");
    const bewegt = document.createElement("div");
    bewegt.className = "lhc-ebene-kacheln";
    bewegt.setAttribute("aria-hidden", "true");
    const z = {
      svg, atome, vb, vbBox: [vb.x, vb.y, vb.x + vb.width, vb.y + vb.height], mass, aPx: [0, 0, mass.bw, mass.bh],
      bewegt, vorlage, vorlageKarte: new Map([[svg, vorlage]]),
      schalen: new Map(), kopien: new Map(), kacheln: [], komp: new Set(), nr: 0, lauscher: [],
      karte: svg.closest("ha-card"), atomVon: new Map(atome.map((a) => [a.el, a])), ziele: new Set(),
      geaendert: false, neu: false, alles: false, zuletzt: performance.now(),
      signatur: this._ebenenSignatur(atome),
    };
    // Schon jetzt vermerken: Scheitert der Bau, stellt Aufloesen alles zurueck.
    this._ebenen = z;
    // Beide liegen direkt hinter dem Original, so findet getElementById
    // fuer Gruppen weiter das Original.
    szene.insertBefore(bewegt, svg.nextSibling);
    szene.insertBefore(vorlage, bewegt);
    this._kachelnBauen(z);
    this._kachelnLegen();
    atome.forEach((a) => { a.anker = a.platz || a.el; });
    // Mauszeiger: Gruppen mit :hover-Regel geben den Zustand an Huellen
    // und verschobene Teile weiter.
    const spiegel = new Map();
    z.schalen.forEach((liste, orig) => { if (orig.matches(SCHWEBT)) spiegel.set(orig, liste.slice()); });
    atome.forEach((a) => {
      if (!a.platz) return;
      if (a.platz.matches(SCHWEBT)) spiegel.set(a.platz, [a.el]);
      a.platz.querySelectorAll(SCHWEBT).forEach((p) => {
        const pfad = [];
        for (let x = p; x && x !== a.platz; x = x.parentNode) pfad.unshift(Array.prototype.indexOf.call(x.parentNode.children, x));
        let echt = a.el;
        pfad.forEach((i) => { echt = echt && echt.children[i]; });
        if (echt) spiegel.set(p, [echt]);
      });
    });
    // Das Element unter dem Zeiger bestimmt, welche Originale abgeblendet
    // sind: beim Hineinbewegen das Ziel, beim Hinausbewegen das neue Ziel.
    z.spiegel = Array.from(spiegel, ([orig, liste]) => ({ orig, liste, an: false }));
    const abgleich = (ev) => {
      const unter = ev.type === "pointerover" ? ev.target : ev.type === "pointerout" ? ev.relatedTarget : null;
      this._ebenenSchweben(unter && svg.contains(unter) ? unter : null);
    };
    ["pointerover", "pointerout", "pointerleave", "pointercancel"].forEach((art) => {
      svg.addEventListener(art, abgleich);
      z.lauscher.push([svg, art, abgleich]);
    });
    // Klicks auf Platzhalter von Teilen, die selbst klickbar sind (Werte
    // mit eigenem Verlauf), gehen an das echte Teil. Sonst oeffnete sich
    // das Fenster der Baugruppe statt des Verlaufs.
    const weiter = (ev) => {
      const p = ev.target && ev.target.closest ? ev.target.closest("[data-lhc-platz]") : null;
      const a = p && atome[Number(p.getAttribute("data-lhc-platz"))];
      if (!a) return;
      const pfad = [];
      for (let x = ev.target; x && x !== p; x = x.parentNode) pfad.unshift(Array.prototype.indexOf.call(x.parentNode.children, x));
      let echt = a.el;
      pfad.forEach((i) => { echt = echt && echt.children[i]; });
      let k = echt && echt.closest ? echt.closest(".klickbar") : null;
      if (k && !a.el.contains(k)) k = null;
      if (!k) return;
      ev.stopPropagation();
      ev.preventDefault();
      k.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, cancelable: true,
        clientX: ev.clientX, clientY: ev.clientY, button: ev.button }));
    };
    svg.addEventListener("click", weiter, true);
    z.lauscher.push([svg, "click", weiter, true]);
    // Aenderungen am Original an Huellen und Kopien weitergeben.
    z.beobachter = new MutationObserver((liste) => this._ebenenAenderung(liste));
    const alles = { attributes: true, childList: true, subtree: true, characterData: true };
    z.beobachter.observe(svg, alles);
    z.beobachter.observe(vorlage, alles);
    z.beobachter.observe(bewegt, { ...alles, attributeFilter: ["class", "style", "x", "y", "width", "height", "d"] });
    // Wechsel des Farbschemas aendert Farben und damit, was deckt.
    if (z.karte) z.beobachter.observe(z.karte, { attributes: true, attributeFilter: ["class"] });
    // Groesse und Bildschirm: die Kacheln folgen, Fenster werden neu gebaut.
    if (typeof ResizeObserver !== "undefined") {
      z.groesse = new ResizeObserver(() => this._kachelnLegen());
      z.groesse.observe(svg);
    }
    if (window.matchMedia) {
      try {
        z.aufloesung = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        z.aufloesungRuf = () => this._kachelnLegen();
        z.aufloesung.addEventListener("change", z.aufloesungRuf);
      } catch {
        z.aufloesung = null;
      }
    }
  },

  /**
   * Mauszeiger ueber einem Original: Schalen und verschobene Teile
   * abblenden wie das Original. Ohne Ziel (undefined) wird nur geprueft,
   * ob der Zeiger noch ueber den abgeblendeten Originalen ist, falls ein
   * Browser das Verlassen nicht meldet.
   */
  _ebenenSchweben(unter) {
    const e = this._ebenen;
    if (!e || !e.spiegel) return;
    e.spiegel.forEach((s) => {
      const an = unter === undefined ? s.an && s.orig.matches(":hover") : Boolean(unter && s.orig.contains(unter));
      if (an === s.an) return;
      s.an = an;
      s.liste.forEach((x) => x.classList.toggle("lhc-schwebt", an));
    });
    // Solange etwas abgeblendet ist, regelmaessig nachsehen.
    if (!e.schwebTimer && e.spiegel.some((s) => s.an)) {
      e.schwebTimer = setTimeout(() => {
        e.schwebTimer = null;
        if (this._ebenen === e) this._ebenenSchweben();
      }, 500);
    }
  },

  /** Kurzfassung der Verteilung, um Aenderungen zu erkennen. */
  _ebenenSignatur(atome) {
    return atome.map((a) => `${a.ebene}:${a.schnitt.map(formPfad).join("")}`).join("|");
  },

  /** Beobachtete Aenderungen: Huellen und Kopien nachziehen, Pruefung vormerken. */
  _ebenenAenderung(liste) {
    const e = this._ebenen;
    if (!e) return;
    let relevant = false;
    liste.forEach((m) => {
      const ziel = m.type === "characterData" ? m.target.parentElement : m.target;
      if (!ziel) return;
      if (m.type === "attributes" && m.target === e.karte) {
        e.alles = true;
        relevant = true;
        return;
      }
      // Eigene Bausteine und Kachelrahmen veraendert nur der Takt.
      if (ziel.closest && (ziel.closest("[data-lhc-intern]") || (ziel.hasAttribute && ziel.hasAttribute("data-lhc-kachel")))) return;
      if (m.type === "attributes") {
        const name = m.attributeName;
        const wert = m.target.getAttribute(name);
        const schalen = e.schalen.get(m.target);
        if (schalen) {
          schalen.forEach((s) => {
            const ohne = (s.getAttribute("data-lhc-ohne") || "").split(" ");
            if (ohne.includes(name)) return;
            if (name === "class") {
              const schwebt = s.classList.contains("lhc-schwebt");
              if (wert === null) s.removeAttribute("class"); else s.setAttribute("class", wert);
              if (schwebt) s.classList.add("lhc-schwebt");
            } else if (["tabindex", "role", "aria-label", "focusable"].includes(name)) {
              // bleibt am Original
            } else if (wert === null) s.removeAttribute(name);
            else s.setAttribute(name, wert);
          });
        }
        // Laufstriche: Farbe und Zustand an alle Kopien. Den Versatz setzt der Takt.
        const kopien = e.kopien.get(m.target);
        if (kopien) {
          if (name === "d") e.neu = true;
          else if (!["id", "stroke-dashoffset", "transform"].includes(name)) {
            kopien.forEach((k) => {
              if (wert === null) k.removeAttribute(name);
              else k.setAttribute(name, wert);
            });
          }
        }
      } else if (m.type === "childList" && (e.schalen.has(m.target) || m.target === e.svg)) {
        // Aufbau einer zerlegten Gruppe geaendert: neu planen.
        e.neu = true;
      }
      e.ziele.add(ziel);
      relevant = true;
    });
    if (!relevant) return;
    e.geaendert = true;
    // Hoechstens einmal je Sekunde pruefen, ob die Aufteilung noch stimmt.
    if (!e.pruefTimer) {
      const warte = Math.max(50, 1000 - (performance.now() - e.zuletzt));
      e.pruefTimer = setTimeout(() => {
        e.pruefTimer = null;
        if (this._ebenen === e) this._ebenenPruefen();
      }, warte);
    }
  },

  /**
   * Nach Aenderungen pruefen, ob die Verteilung noch stimmt (Texte laenger,
   * Formen verschoben, Deckkraft geaendert). Vermessen werden nur die
   * betroffenen Teile. Stimmt die Verteilung nicht mehr, neu planen.
   */
  _ebenenPruefen() {
    const e = this._ebenen;
    if (!e) return;
    e.geaendert = false;
    e.zuletzt = performance.now();
    const ziele = e.ziele;
    e.ziele = new Set();
    if (!e.neu && e.svg.isConnected) {
      let betroffen = null;
      if (!e.alles) {
        betroffen = new Set();
        ziele.forEach((x) => {
          if (!x || x.hasAttribute?.("data-lhc-platz")) return;
          for (let y = x; y && y !== e.svg && y !== e.bewegt && y !== e.vorlage; y = y.parentNode) {
            const a = e.atomVon.get(y);
            if (a) { betroffen.add(a); return; }
          }
          // Gruppe im Original: alle Teile darin.
          e.atome.forEach((a) => { if (x.contains && x.contains(a.anker)) betroffen.add(a); });
        });
        if (!betroffen.size) return;
      }
      e.alles = false;
      const kopie = e.atome.map((a) => ({ ...a }));
      const neuGemessen = betroffen ? new Set(kopie.filter((k, i) => betroffen.has(e.atome[i]))) : null;
      this._ebenenVermessen(e.svg, kopie, neuGemessen);
      this._ebenenVerteilen(kopie);
      if (this._ebenenSignatur(kopie) === e.signatur) {
        // Gleiche Aufteilung. Passt jede Kachel noch um ihren Inhalt?
        let passt = true;
        kopie.forEach((k, i) => {
          if (neuGemessen && !neuGemessen.has(k)) return;
          const a = e.atome[i];
          a.box = k.box; a.kern = k.kern; a.form = k.form; a.deck = k.deck;
          if (a.kachel && !this._kachelPasst(a.kachel, k.box)) passt = false;
        });
        if (passt) return;
      }
    }
    this._ebenenNeu();
  },

  /** Neu planen. Klappt das gerade nicht, zeichnet die Schleife wie frueher. */
  _ebenenNeu() {
    // Zaehler fuer die Diagnose (diagnose.js).
    this._umbauten = (this._umbauten || 0) + 1;
    this._ebenenAufloesen();
    if (!this._ebenenPlanen()) this._ebenenTakt();
  },

  /**
   * Vollstaendige Kopie eines Teils der Grafik, mit den verschobenen
   * Teilen an ihrem Platz. Fuer die Tuer der Waermepumpe.
   */
  _vollKopie(el) {
    const kopie = el.cloneNode(true);
    const e = this._ebenen;
    if (!e) return kopie;
    kopie.querySelectorAll("[data-lhc-platz]").forEach((p) => {
      const a = e.atome[Number(p.getAttribute("data-lhc-platz"))];
      if (!a) return;
      const echt = a.el.cloneNode(true);
      // Drehen und Pulsieren spielt die Kachel, nicht das Original.
      const k = a.kachel;
      if (k && k.art === "dreh") echt.setAttribute("transform", `rotate(${this._taktWinkel(k).toFixed(2)} 0 0)`);
      if (k && k.art === "puls" && k.anim) echt.setAttribute("opacity", this._taktDeckkraft(k).toFixed(2));
      p.replaceWith(echt);
    });
    return kopie;
  },
};
