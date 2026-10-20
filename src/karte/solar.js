/**
 * Solarthermie: Bild, Zustand und Animation.
 * Drei Darstellungen sind waehlbar (Option solar_style):
 *   strahlen  Lichtstrahlen fallen auf den Kollektor, die Felder leuchten
 *             als Welle auf, Waerme steigt auf.
 *   funkeln   Der Kollektor waermt sich von oben auf, das Glas funkelt,
 *             darueber flimmert die Hitze.
 *   roehren   Roehrenkollektor, in den Roehren steigt Waerme nach oben.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */

const STILE = ["strahlen", "funkeln", "roehren"];
const ZELLEN = 15;
const FUNKEN = [[0.2, 0.3], [0.55, 0.7], [0.8, 0.25], [0.4, 0.55], [0.7, 0.45]];
const ROEHREN = 6;

export const solarKarte = {
  /** Gewaehlte Darstellung der Solarthermie. */
  _solarStil() {
    const s = this._config.solar_style;
    return STILE.includes(s) ? s : "strahlen";
  },

  /**
   * Rechte Kante des Kollektors auf Hoehe y, fuer den Anschluss der
   * Leitungen. Der Kollektor ist schraeg, unten liegt die Kante weiter links.
   */
  _solarKante(cx, yc, y) {
    const kante = cx + 65 - (36 * (y - (yc - 40))) / 90;
    return Math.round(this._solarStil() === "roehren" ? kante - 4 : kante);
  },

  /** Kollektor mit Sonne. Die Effekte liegen unsichtbar bereit. */
  _solarBild(cx, yc) {
    const stil = this._solarStil();
    const x = cx - 65;
    const u = yc + 50;
    const o = yc - 40;
    const sx = x + 4;
    const sy = o - 18;
    const strahlen = (farbe) =>
      [0, 45, 90, 135, 180, 225, 270, 315]
        .map((w) => {
          const r = (w * Math.PI) / 180;
          return `<line x1="${(Math.cos(r) * 14).toFixed(1)}" y1="${(Math.sin(r) * 14).toFixed(1)}"
          x2="${(Math.cos(r) * 20).toFixed(1)}" y2="${(Math.sin(r) * 20).toFixed(1)}"
          stroke="${farbe}" stroke-width="2.2" stroke-linecap="round"/>`;
        })
        .join("");
    const sonne = `
        <g transform="translate(${sx} ${sy})">
          <circle id="solar-schein" r="28" fill="#FFC44D" opacity="0"/>
          <g id="solar-sonne-aus"><circle r="10" fill="#3A4658"/>${strahlen("#55637A")}</g>
          <g id="solar-sonne" opacity="0">
            <circle r="10" fill="#FFD966"/>
            <g id="solar-strahlen">${strahlen("#FFC44D")}</g>
          </g>
        </g>`;
    const daten = `data-x="${x}" data-u="${u}" data-o="${o}" data-sx="${sx}" data-sy="${sy}"`;

    if (stil === "roehren") {
      let roehren = "";
      let hell = "";
      let punkte = "";
      for (let i = 0; i < ROEHREN; i++) {
        const bx = x + 8 + i * 15.5;
        const tx = bx + 36;
        roehren += `<line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#1E5FA8" stroke-width="11" stroke-linecap="round"/>
          <line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#16324F" stroke-width="5" stroke-linecap="round"/>`;
        hell += `<line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#3A8FE0" stroke-width="5" stroke-linecap="round"/>`;
        for (let k = 0; k < 3; k++) {
          punkte += `<circle id="solar-c-${i}-${k}" r="2.6" fill="#FFB070" cx="${bx}" cy="${u}"/>`;
        }
      }
      return `${sonne}
        <rect x="${x + 38}" y="${o - 8}" width="100" height="10" rx="4" fill="#26303F" stroke="#33415A" stroke-width="2"/>
        ${roehren}
        <g id="solar-hell" opacity="0">${hell}</g>
        <g id="solar-effekt" opacity="0" ${daten}>${punkte}</g>
        <rect x="${x}" y="${u}" width="100" height="6" rx="3" fill="#26303F"/>`;
    }

    const flaeche = `M${x} ${u} L${x + 36} ${o} L${x + 130} ${o} L${x + 94} ${u} Z`;
    const laengs = [1, 2, 3, 4]
      .map((i) => `<line x1="${x + (94 * i) / 5}" y1="${u}" x2="${x + 36 + (94 * i) / 5}" y2="${o}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`)
      .join("");
    const quer = [1, 2]
      .map((i) => `<line x1="${x + (36 * i) / 3}" y1="${u - (90 * i) / 3}" x2="${x + 94 + (36 * i) / 3}" y2="${u - (90 * i) / 3}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`)
      .join("");

    if (stil === "funkeln") {
      const funken = FUNKEN.map((_, i) =>
        `<path id="solar-b-funke${i}" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#FFFFFF" opacity="0"/>`
      ).join("");
      const flimmer = [0, 1, 2, 3].map((k) =>
        `<path id="solar-b-flimmer${k}" d="M0 0 q3 -4 0 -8 q-3 -4 0 -8" fill="none" stroke="#FFC44D" stroke-width="1.8" stroke-linecap="round" opacity="0"/>`
      ).join("");
      return `${sonne}
        <linearGradient id="solar-verlauf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#2470C2"/>
          <stop id="solar-b-stop" offset="0.5" stop-color="#3A8FE0"/>
          <stop offset="1" stop-color="#FF9A4D"/>
        </linearGradient>
        <path d="${flaeche}" fill="#1B3F66" stroke="#33415A" stroke-width="2"/>
        <path id="solar-hell" d="${flaeche}" fill="url(#solar-verlauf)" opacity="0"/>
        <path d="${flaeche}" fill="none" stroke="#33415A" stroke-width="2"/>
        ${laengs}${quer}
        <g id="solar-effekt" opacity="0" ${daten}>${funken}${flimmer}</g>`;
    }

    // strahlen
    let zellen = "";
    for (let i = 0; i < ZELLEN; i++) {
      const r = Math.floor(i / 5);
      const s = i % 5;
      const yy = u - (90 * (r + 0.5)) / 3;
      const xx = x + (36 * (r + 0.5)) / 3 + (94 * (s + 0.5)) / 5;
      zellen += `<path id="solar-a-zelle${i}" d="M${(xx - 9).toFixed(1)} ${(yy + 13).toFixed(1)} l7 -26 h12 l-7 26 Z" fill="#9FD3FF" opacity="0"/>`;
    }
    const strahl = [0, 1, 2].map((k) =>
      `<line id="solar-a-strahl${k}" x1="${sx + 10}" y1="${sy + 10}" x2="${sx + 10}" y2="${sy + 10}" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>
        <circle id="solar-a-punkt${k}" r="3" fill="#FFF1B8" cx="${sx + 10}" cy="${sy + 10}"/>`
    ).join("");
    const hitze = [0, 1, 2].map((k) =>
      `<path id="solar-a-hitze${k}" d="M0 0 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#FFB070" stroke-width="2" stroke-linecap="round" opacity="0"/>`
    ).join("");
    return `${sonne}
        <clipPath id="solar-clip"><path d="${flaeche}"/></clipPath>
        <path d="${flaeche}" fill="#1B3F66" stroke="#33415A" stroke-width="2"/>
        <path id="solar-hell" d="${flaeche}" fill="#2470C2" opacity="0"/>
        <g id="solar-effekt" opacity="0" ${daten}>
          <g clip-path="url(#solar-clip)">${zellen}</g>
        </g>
        <path d="${flaeche}" fill="none" stroke="#33415A" stroke-width="2"/>
        ${laengs}${quer}
        <g id="solar-effekt2" opacity="0">${strahl}${hitze}</g>`;
  },

  /** Sonne und Kollektor: scheint ab der eingestellten Temperatur. */
  _solarSonne(an, animate) {
    const deck = (id, wert) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("opacity", wert);
    };
    deck("solar-sonne", an ? "1" : "0");
    deck("solar-sonne-aus", an ? "0" : "1");
    deck("solar-hell", an ? "1" : "0");
    deck("solar-effekt", an ? "1" : "0");
    deck("solar-effekt2", an ? "1" : "0");
    if (an && animate) {
      const da = this._animState.get("solar-strahlen");
      if (!da || da.type !== "spin") this._animState.set("solar-strahlen", { type: "spin", duration: 14, winkel: 0 });
      this._animState.set("solar-schein", { type: "pulse", duration: 2.2, min: 0.1, max: 0.3 });
      this._animState.set("solar-effekt", { type: "solar" });
    } else {
      ["solar-strahlen", "solar-schein", "solar-effekt"].forEach((id) => this._animState.delete(id));
      const str = this._animEl("solar-strahlen");
      if (str) str.removeAttribute("transform");
      deck("solar-schein", an ? "0.2" : "0");
      // Ohne Animation ein ruhiges Standbild der Effekte.
      if (an) this._solarBildFrame(0.35);
    }
  },

  /** Zeichnet einen Zeitpunkt der Solaranimation. */
  _solarBildFrame(t) {
    const g = this._animEl("solar-effekt");
    if (!g) return;
    const x = Number(g.dataset.x);
    const u = Number(g.dataset.u);
    const o = Number(g.dataset.o);
    const sx = Number(g.dataset.sx);
    const sy = Number(g.dataset.sy);
    const setze = (id, werte) => {
      const el = this._animEl(id);
      if (el) Object.entries(werte).forEach(([k, v]) => el.setAttribute(k, v));
    };
    const stil = this._solarStil();

    if (stil === "roehren") {
      for (let i = 0; i < ROEHREN; i++) {
        const bx = x + 8 + i * 15.5;
        const tx = bx + 36;
        for (let k = 0; k < 3; k++) {
          const p = (t * 0.8 + k / 3 + i * 0.11) % 1;
          setze(`solar-c-${i}-${k}`, {
            cx: (bx + (tx - bx) * p).toFixed(1),
            cy: (u + (o - u) * p).toFixed(1),
            opacity: (0.3 + 0.7 * p).toFixed(2),
          });
        }
      }
      return;
    }

    if (stil === "funkeln") {
      const w = 0.5 + 0.5 * Math.sin(t * 1.5);
      setze("solar-b-stop", { offset: (0.3 + 0.4 * w).toFixed(3) });
      FUNKEN.forEach(([a, b], i) => {
        const ph = (t * 1.3 + i * 0.37) % 1;
        const s = Math.max(0, Math.sin(ph * Math.PI));
        const yy = u - 90 * b;
        const xx = x + 36 * b + 94 * a;
        setze(`solar-b-funke${i}`, {
          transform: `translate(${xx.toFixed(1)} ${yy.toFixed(1)}) scale(${Math.max(s, 0.01).toFixed(2)})`,
          opacity: s.toFixed(2),
        });
      });
      for (let k = 0; k < 4; k++) {
        const p = (t * 0.6 + k / 4) % 1;
        const wx = x + 45 + k * 22 + 2 * Math.sin(t * 6 + k);
        setze(`solar-b-flimmer${k}`, {
          transform: `translate(${wx.toFixed(1)} ${(o - 4 - p * 20).toFixed(1)})`,
          opacity: (0.6 * Math.sin(p * Math.PI)).toFixed(2),
        });
      }
      return;
    }

    // strahlen
    for (let k = 0; k < 3; k++) {
      const p = (t * 0.9 + k / 3) % 1;
      const x1 = sx + 10;
      const y1 = sy + 10;
      const x2 = x + 50 + k * 28;
      const y2 = o + 30;
      const xa = x1 + (x2 - x1) * p;
      const ya = y1 + (y2 - y1) * p;
      setze(`solar-a-strahl${k}`, { x2: xa.toFixed(1), y2: ya.toFixed(1), opacity: (0.7 * (1 - p)).toFixed(2) });
      setze(`solar-a-punkt${k}`, { cx: xa.toFixed(1), cy: ya.toFixed(1), opacity: (1 - p * 0.6).toFixed(2) });
    }
    for (let i = 0; i < ZELLEN; i++) {
      const r = Math.floor(i / 5);
      const s = i % 5;
      const ph = (((t * 1.2 - (s + r) * 0.12) % 1) + 1) % 1;
      setze(`solar-a-zelle${i}`, { opacity: (Math.max(0, Math.sin(ph * Math.PI)) * 0.55).toFixed(2) });
    }
    for (let k = 0; k < 3; k++) {
      const p = (t * 0.7 + k / 3) % 1;
      setze(`solar-a-hitze${k}`, {
        transform: `translate(${x + 60 + k * 25} ${(o - 6 - p * 18).toFixed(1)})`,
        opacity: (0.8 * Math.sin(p * Math.PI)).toFixed(2),
      });
    }
  },
};
