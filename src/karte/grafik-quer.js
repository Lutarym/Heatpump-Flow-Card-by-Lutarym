/**
 * Grafik im Querformat.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { abzeichenBreite, clamp, escapeHtml, schildBreite } from "../hilfsfunktionen.js";
import { BUBBLE_COUNT, L, LUFT, NEUTRAL } from "../konstanten.js";

export const grafikQuerKarte = {
  /* -------------------- Szene -------------------- */

  /**
   * Waehlt zwischen den beiden Anordnungen. Das Hochformat entsteht aus
   * derselben Zeichnung, nur um 90 Grad gedreht.
   */
  _svg() {
    if (this._config.layout === "hoch") return this._svgHoch();
    if (this._config.layout === "klassisch") return this._svgQuerKlassisch();
    return this._svgQuer();
  },

  /** Farbverlaeufe und Filter, von beiden Anordnungen genutzt. */
  _defs() {
    return `      <defs>
        <filter id="unitGlowBlur" x="-30%" y="-15%" width="160%" height="130%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge>
            <feMergeNode in="b"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="casing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#232C3A"/><stop offset="100%" stop-color="#161D28"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
          <stop offset="45%" stop-color="#FFFFFF" stop-opacity="0.02"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.22"/>
        </linearGradient>
        <linearGradient id="bufferFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="bg-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="bg-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
        <linearGradient id="dhwFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="dhw-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="dhw-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
        <linearGradient id="rad1Fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="rad1-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="rad1-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
        <linearGradient id="rad2Fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="rad2-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="rad2-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
        <linearGradient id="rad3Fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="rad3-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="rad3-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
        <linearGradient id="rad4Fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" id="rad4-top" stop-color="${NEUTRAL}"/>
          <stop offset="100%" id="rad4-bottom" stop-color="${NEUTRAL}"/>
        </linearGradient>
      </defs>`;
  },

  /**
   * Masse des Querformats. Von links nach rechts: Waermepumpe, Werte,
   * Warmwasserspeicher mit Zirkulation, Zusatzwaerme, Puffer, Heizkreise.
   * Erzeuger stehen links vom Puffer, Verbraucher rechts davon.
   */
  _querMasse() {
    const puffer = this._hatPuffer();
    const quellen = this._quellen();
    const XW = 615;
    const ZIRK_X = 760;
    let XB = null;
    if (puffer) XB = quellen.length ? 1087 : 900;
    const BL = XB === null ? null : XB - 95;
    const BR = XB === null ? null : XB + 95;
    const ZX0 = puffer ? BR + 45 : 900;
    const PRESS_X = 790;
    return { puffer, quellen, XW, ZIRK_X, XB, BL, BR, ZX0, ZX1: 1640, PRESS_X };
  },

  /** Welche Zusatzwaerme am Puffer haengt. Ohne Puffer gibt es keine. */
  _quellen() {
    if (!this._hatPuffer()) return [];
    const v = this._config.extra_heat;
    if (v === "kamin") return ["kamin"];
    if (v === "solar") return ["solar"];
    if (v === "beide") return ["kamin", "solar"];
    return [];
  },

  /** Anzahl der Heizkreise, 1 bis 4. */
  _hkAnzahl() {
    return clamp(parseInt(this._config.hk_count, 10) || 2, 1, 4);
  },

  _svgQuer() {
    const two = this._config.fan_count === 2;
    // Luefter uebereinander, wie beim echten Aussengeraet.
    const fans = two
      ? `${this._fan("fan1", 190, 360, 96)}${this._fan("fan2", 190, 608, 96)}`
      : this._fan("fan1", 190, 480, 120);

    const F = L.FLOW_Y;
    const R = L.RET_Y;
    const T = L.TANK_TOP;
    const B = L.TANK_BOTTOM;
    const M = this._querMasse();
    const { XW, XB, ZIRK_X } = M;
    const zone = this._heizkreisZone(M);
    // Ende von Vor- und Ruecklauf des Primaerkreises: am Puffer oder,
    // ohne Puffer, an den Sammelleitungen der Heizkreise.
    const vlEnde = M.puffer ? XB : zone.vorl;
    const rlEnde = M.puffer ? XB : zone.rueck;
    const tank = (id, cx, fill, inhalt) => {
      const x = cx - 95;
      return `
        <rect x="${x}" y="${T}" width="190" height="350" rx="26"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <clipPath id="${id}Clip"><rect x="${x + 8}" y="298" width="174" height="334" rx="20"/></clipPath>
        <rect x="${x + 8}" y="298" width="174" height="334" rx="20" fill="url(#${fill})"/>
        <g clip-path="url(#${id}Clip)">${this._bubbles(`${id}-bubbles`, x + 8, 298, 174, 334)}</g>
        <rect x="${x + 8}" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        ${inhalt}`;
    };
    const schild = (cx, schluessel) => {
      const b = schildBreite(this._name(schluessel), 150);
      return `<rect x="${cx - b / 2}" y="305" width="${b}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${cx}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
          this._name(schluessel)
        )}</text>`;
    };
    const badge = (id, cx, y, wort, fill, stroke, text) => `
        <g id="${id}" class="badge" transform="translate(${cx} ${y})">
          <rect x="${-abzeichenBreite(wort) / 2}" y="-15" width="${abzeichenBreite(wort)}" height="30" rx="15"
                fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${text}</text>
        </g>`;

    return `
    <svg viewBox="0 ${80 - LUFT} ${L.W} ${L.H + LUFT}" class="lhc-svg" role="img"
         aria-label="${this._t("s_schema")}">
${this._defs()}

      <!-- Primaerkreis: Vorlauf oben, Ruecklauf unten. Das Ventil ueber dem
           Warmwasserspeicher teilt nach unten zum Speicher oder geradeaus
           zur Heizung. -->
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${F} H ${vlEnde} M${L.X_PIPE_L} ${R} H ${rlEnde}"/>
      <path class="pipe" id="pipe-flow" d="M${L.X_PIPE_L} ${F} H ${vlEnde}"/>
      <path class="pipe" id="pipe-return" d="M${L.X_PIPE_L} ${R} H ${rlEnde}"/>
      <path class="flowdots" id="dots-vl-a" d="M${L.X_PIPE_L} ${F} H ${XW}"/>
      <path class="flowdots" id="dots-heiz-vl" d="M${XW} ${F} H ${vlEnde}"/>
      <path class="flowdots" id="dots-heiz-rl" d="M${rlEnde} ${R} H ${XW}"/>
      <path class="flowdots" id="dots-rl-a" d="M${XW} ${R} H ${L.X_PIPE_L}"/>

      <path class="pipe-shell" d="M${XW} ${F} V ${T} M${XW} ${B} V ${R}"/>
      <path class="pipe" id="pipe-dhw-in" d="M${XW} ${F} V ${T}"/>
      <path class="pipe" id="pipe-dhw-out" d="M${XW} ${B} V ${R}"/>
      <path class="flowdots" id="dots-dhw" d="M${XW} ${F} V ${T}"/>
      <path class="flowdots" id="dots-dhw2" d="M${XW} ${B} V ${R}"/>
      ${M.puffer ? `
      <path class="pipe-shell" d="M${XB} ${F} V ${T} M${XB} ${B} V ${R}"/>
      <path class="pipe" id="pipe-buf-in" d="M${XB} ${F} V ${T}"/>
      <path class="pipe" id="pipe-buf-out" d="M${XB} ${B} V ${R}"/>
      <path class="flowdots" id="dots-buf" d="M${XB} ${F} V ${T}"/>
      <path class="flowdots" id="dots-buf2" d="M${XB} ${B} V ${R}"/>` : ""}

      ${zone.rohre}
      ${this._quellenMarkup(M)}

      <!-- Innenraum hinter der Tuer -->
      <g id="unit-innen">
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="#080C12" stroke="#33415A" stroke-width="2"/>
        <rect x="56" y="${L.UNIT_TOP + 16}" width="268" height="608" rx="10" fill="none" stroke="#1C2533" stroke-width="1.5"/>
      </g>
      <!-- Außengerät -->
      <g class="unit" id="unit-group">
        <rect id="unit-glow" x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16"
              fill="none" stroke="#22C55E" stroke-width="10" opacity="0"
              filter="url(#unitGlowBlur)"/>
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16"
              fill="url(#casing)" stroke="#33415A" stroke-width="2"/>
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="url(#glass)"/>
        ${this._modusSymbole()}
        <text class="modus-zeile" id="modus-text" x="190" y="184" text-anchor="middle"></text>
        <text class="unit-label" x="129" y="202" text-anchor="middle">${this._t("aussentemperatur")}</text>
        <text class="unit-value-s" id="outside-v" x="129" y="228"
              text-anchor="middle">--</text>
        <text class="unit-label" x="273" y="202" text-anchor="middle">${this._t("verdichter")}</text>
        <text class="unit-value-s" id="comp-v" x="273" y="228" text-anchor="middle">--</text>

        ${fans}

        <g id="tuer-knopf" class="tuer-knopf" transform="translate(312 ${L.UNIT_TOP + 612})" role="button" tabindex="0">
          <title>${this._t("t_oeffnen")}</title>
          <circle r="17" fill="#0D1219" stroke="#55657F" stroke-width="1.5"/>
          <g stroke="#98A6BA" stroke-width="1.8" stroke-linecap="round">
            <path d="M-7 -6 H7 M-7 0 H7 M-7 6 H7"/>
          </g>
          <circle cx="-3" cy="-6" r="2.4" fill="#E0762E"/>
          <circle cx="3" cy="0" r="2.4" fill="#E0762E"/>
          <circle cx="-1" cy="6" r="2.4" fill="#E0762E"/>
        </g>
      </g>

      ${(() => {
        const rand = L.W - 10;
        const w = clamp(Number(this._config.history_width) || 450, 250, Math.min(700, rand - 700));
        // Als Knopf stehen oben rechts nur drei kleine Knoepfe, das
        // Diagramm oeffnet sich im Fenster.
        return this._verlaufAlsKnopf()
          ? this._diaKnoepfe(rand - w, 84 - LUFT + 8, w)
          : this._verlaufRahmen(rand - w, 84 - LUFT, w, 144);
      })()}

      ${this._kennzahlenQuer(F)}

      <!-- Vorlauf am Ausgang, Rücklauf am Eingang -->
      <g id="vl-schild">
        <rect x="${410 - schildBreite("Vorlauf", 80) / 2}" y="${F - 13}" width="${schildBreite("Vorlauf", 80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="410" y="${F + 5}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="410" y="${F - 24}"
            text-anchor="middle">--</text>
      <g id="rl-schild">
        <rect x="${410 - schildBreite("Rücklauf", 80) / 2}" y="${R - 13}" width="${schildBreite("Rücklauf", 80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="410" y="${R + 5}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="410" y="${R + 40}"
            text-anchor="middle">--</text>

      <!-- Primärpumpe -->
      <g>
        <text class="cap-s" x="690" y="662" text-anchor="middle">${this._t("pumpe")}</text>
        <text class="value-s" id="pump-v" x="690" y="749" text-anchor="middle">--</text>
        <text class="value-s" id="flow-v" x="690" y="769" text-anchor="middle">--</text>
        <g transform="translate(690 ${R})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="pump-rotor">
            <path id="pump-blade" d="M0 -15 L5 -4 L16 0 L5 4 L0 15 L-5 4 L-16 0 L-5 -4 Z" fill="#55637A"/>
            <circle r="4" fill="#0D1219"/>
          </g>
        </g>
      </g>

      <!-- Zirkulation rechts am Warmwasserspeicher -->
      <g id="zirkulation-group" opacity="0">
        <path class="pipe-shell duenn" fill="none" d="M${XW + 95} 330 H ${ZIRK_X} V 620 H ${XW + 95}"/>
        <path class="pipe duenn" id="pipe-zirk-v" fill="none" d="M${XW + 95} 330 H ${ZIRK_X} V 620 H ${XW + 95}"/>
        <path class="flowdots duenn" id="dots-zirk-h1" fill="none" d="M${XW + 95} 330 H ${ZIRK_X}"/>
        <path class="flowdots duenn" id="dots-zirk-v" fill="none" d="M${ZIRK_X} 330 V 620"/>
        <path class="flowdots duenn" id="dots-zirk-h2" fill="none" d="M${ZIRK_X} 620 H ${XW + 95}"/>
        <g transform="translate(${ZIRK_X} 475)">
          <circle r="16" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="zirk-rotor">
            <path id="zirk-blade" d="M0 -9 L3 -2 L10 0 L3 2 L0 9 L-3 2 L-10 0 L-3 -2 Z" fill="#55637A"/>
            <circle r="3" fill="#0D1219"/>
          </g>
        </g>
        <text class="cap-s" id="zirk-name" x="${XW + 100}" y="280" text-anchor="start">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${ZIRK_X}" y="318" text-anchor="middle" opacity="0">--</text>
      </g>

      <!-- Warmwasserspeicher -->
      <g id="dhw-group">
        ${tank("dhw", XW, "dhwFill", `
        <text class="value-l" id="dhw-v" x="${XW}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="dhw-sp" x="${XW}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="dhw-delta" x="${XW}" y="482" text-anchor="middle"></text>
        ${badge("dhwforce-badge", XW, 536, "Aufheizen", "#08243A", "#3B9BE0", this._t("aufheizen"))}
        ${badge("sterilization-badge", XW, 570, "Legionellen", "#2B1240", "#A855F7", this._t("legionellen"))}
        ${badge("dhwheater-badge", XW, 604, "Heizstab", "#3A1B08", "#E0762E", this._t("heizstab"))}
        <g id="dhw-name">${schild(XW, "label_dhw")}</g>`)}
      </g>

      ${M.puffer ? `
      <!-- Heizungspuffer -->
      <g id="buffer-group">
        ${tank("buf", XB, "bufferFill", `
        <text class="value-l" id="buf-v" x="${XB}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="buf-sp" x="${XB}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="buf-delta" x="${XB}" y="482" text-anchor="middle"></text>
        ${badge("roomheater-badge", XB, 604, "Heizstab", "#3A1B08", "#E0762E", this._t("heizstab"))}
        <g id="buf-name">${schild(XB, "label_buffer")}</g>`)}
      </g>` : ""}

      <!-- Wasserdruck auf dem Ruecklauf -->
      <g id="press-group" opacity="0">
        <text class="cap-s" x="${M.PRESS_X}" y="662" text-anchor="middle">${this._t("druck")}</text>
        <g id="press-warn" opacity="0" transform="translate(${M.PRESS_X + 44} 742)">
          <path d="M0 -13 L13 10 L-13 10 Z" fill="#3A0E0E"
                stroke="#D62B2B" stroke-width="2" stroke-linejoin="round"/>
          <path d="M0 -6 V 3" stroke="#FF6B5E" stroke-width="2.5" stroke-linecap="round"/>
          <circle cy="7" r="1.6" fill="#FF6B5E"/>
        </g>
        <g transform="translate(${M.PRESS_X} ${R})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <circle r="18" fill="none" stroke="#26303F" stroke-width="3"/>
          <line id="press-needle" x1="0" y1="0" x2="0" y2="-15"
                stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round"/>
          <circle r="4" fill="#55637A"/>
        </g>
        <text class="value-s" id="press-v" x="${M.PRESS_X}" y="749" text-anchor="middle">--</text>
      </g>

      ${zone.kreise}

      <!-- Dreiwegeventil ueber dem Warmwasserspeicher -->
      <g>
        <circle cx="${XW}" cy="${F}" r="22" fill="#0D1219"
                stroke="#33415A" stroke-width="2"/>
        <g id="valve-arrow-ww" opacity="0">
          <path id="valve-ww-line" d="M${XW} ${F - 12} V ${F + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-ww-head" d="M${XW - 8} ${F + 2} L ${XW} ${F + 14} L ${XW + 8} ${F + 2} Z"
                fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-heiz" opacity="0">
          <path id="valve-heiz-line" d="M${XW - 12} ${F} H ${XW + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-heiz-head" d="M${XW + 2} ${F - 8} L ${XW + 14} ${F} L ${XW + 2} ${F + 8} Z"
                fill="${NEUTRAL}"/>
        </g>
        <text class="cap-s" x="${XW}" y="${F - 58}" text-anchor="middle">${this._t("umschaltventil")}</text>
        <text class="value-s" id="valve-v" x="${XW}" y="${F - 34}"
              text-anchor="middle">--</text>
      </g>
    </svg>`;
  },

  /** Zustandssymbole oben in der Waermepumpe. */
  _modusSymbole() {
    return `
        <g id="modus-icons">
          <g class="modus" id="modus-betrieb" transform="translate(80 150)">
            <title>${this._t("r_betrieb")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none">
              <path d="M0 -10 V -1"/>
              <path d="M-6.4 -6.4 A 9 9 0 1 0 6.4 -6.4"/>
            </g>
          </g>
          <g class="modus" id="modus-heizen" transform="translate(212 150)">
            <title>${this._t("r_heizen")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <path d="M0 -11 C 6 -4, 8 0, 8 3 A 8 8 0 1 1 -8 3 C -8 -1, -3 -4, 0 -11 Z"
                  fill="currentColor"/>
            <path d="M0 -2 C 3 1, 4 3, 4 4.5 A 4 4 0 1 1 -4 4.5 C -4 3, -2 1.5, 0 -2 Z"
                  fill="#0D1219"/>
          </g>
          <g class="modus" id="modus-kuehlen" transform="translate(300 150)">
            <title>${this._t("r_kuehlen")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
              <path d="M0 -11 V 11 M-9.5 -5.5 L 9.5 5.5 M-9.5 5.5 L 9.5 -5.5"/>
              <path d="M-3 -8 L0 -11 L3 -8 M-3 8 L0 11 L3 8"/>
              <path d="M-9.5 -5.5 L -9 -1.5 M-9.5 -5.5 L -5.5 -6 M9.5 5.5 L 9 1.5 M9.5 5.5 L 5.5 6"/>
              <path d="M-9.5 5.5 L -9 1.5 M-9.5 5.5 L -5.5 6 M9.5 -5.5 L 9 -1.5 M9.5 -5.5 L 5.5 -6"/>
            </g>
          </g>
          <g class="modus" id="modus-ww" transform="translate(256 150)">
            <title>${this._t("warmwasser")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <path d="M0 -11 C 6 -2, 9 2, 9 5 A 9 9 0 0 1 -9 5 C -9 2, -6 -2, 0 -11 Z"
                  fill="currentColor"/>
          </g>
          <g class="modus" id="modus-auto" transform="translate(168 150)">
            <title>${this._t("r_automatik")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <text class="modus-t" x="0" y="7" text-anchor="middle" fill="currentColor">A</text>
          </g>
          <g class="modus" id="modus-abtauen" transform="translate(124 150)">
            <title>${this._t("r_abtauen")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
              <path d="M0 -12 V 1 M-7 -8 L 7 0 M-7 0 L 7 -8"/>
              <path d="M-2.6 -9.5 L0 -12 L2.6 -9.5"/>
            </g>
            <path d="M-5 5 C -2.6 8, -2.6 11, -5 11 C -7.4 11, -7.4 8, -5 5 Z
                     M5 5 C 7.4 8, 7.4 11, 5 11 C 2.6 11, 2.6 8, 5 5 Z"
                  fill="currentColor"/>
          </g>
        </g>`;
  },

  /** SG Ready, PV, Leistung und Zaehler in der Spalte neben der Waermepumpe. */
  _kennzahlenQuer(F) {
    return `
      <g id="kennzahlen">
      <g id="sg-group" opacity="0">
        <text class="sg-label" x="${L.X_COL}" y="${F + 60}" text-anchor="middle">SG Ready</text>
        <g transform="translate(${L.X_COL} ${F + 90})">
          <rect x="-68" y="0" width="32" height="11" rx="5.5" id="sg-seg-1" fill="#3A4658"/>
          <rect x="-34" y="0" width="32" height="11" rx="5.5" id="sg-seg-2" fill="#3A4658"/>
          <rect x="2" y="0" width="32" height="11" rx="5.5" id="sg-seg-3" fill="#3A4658"/>
          <rect x="36" y="0" width="32" height="11" rx="5.5" id="sg-seg-4" fill="#3A4658"/>
        </g>
        <text class="sg-value" id="sg-text" x="${L.X_COL}" y="${F + 130}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F + 150}" x2="510" y2="${F + 150}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="pv-group" opacity="0">
        <text class="sg-label" id="pv-label" x="${L.X_COL}" y="${F + 190}" text-anchor="middle">${this._t("pv_ueberschuss")}</text>
        <text class="pv-value" id="pv-v" x="${L.X_COL}" y="${F + 228}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F + 245}" x2="510" y2="${F + 245}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="verbrauch-group" opacity="0">
        <text class="sg-label" x="${L.X_COL}" y="${F + 285}" text-anchor="middle">${this._t("leistung")}</text>
        <text class="verbrauch-v" id="power-now-v" x="${L.X_COL}" y="${F + 323}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F + 340}" x2="510" y2="${F + 340}" stroke="#55657F" stroke-width="1"/>
        <text class="sg-label" id="energy-label" x="${L.X_COL}" y="${F + 380}"
              text-anchor="middle">--</text>
        <text class="unit-value" id="energy-today-v" x="${L.X_COL}" y="${F + 420}"
              text-anchor="middle">--</text>
      </g>
      </g>`;
  },

  /**
   * Heizkreise rechts vom Puffer. Ein Heizkreis steht allein, mehrere
   * nebeneinander. Mit Zusatzwaerme ist die Zone schmaler, ab drei
   * Heizkreisen stehen sie dann im Raster zwei mal zwei.
   * Der erste Abzweig liegt auf Hoehe des Puffervorlaufs, so fuehrt die
   * Leitung gerade hinein.
   */
  _heizkreisZone(M) {
    const n = this._hkAnzahl();
    // HK1 und HK2 nebeneinander, HK3 und HK4 eine Ebene darunter.
    const spalten = Math.min(n, 2);
    const zeilen = Math.ceil(n / spalten);
    const breite = M.ZX1 - M.ZX0;
    const zw = breite / spalten;
    const w = Math.min(zw - 36, 140);
    const h = Math.round(w * 0.55);
    const zeile = 30 + 40 + h + 96;
    const VLY = 305;
    const vorl = M.ZX0 - 10;
    const rueck = M.ZX0 - 26;
    const F = L.FLOW_Y;
    const R = L.RET_Y;
    let kreise = "";
    const aeste = [];
    const ruecks = [];
    for (let i = 0; i < n; i++) {
      const nr = i + 1;
      const sp = i % spalten;
      const ze = Math.floor(i / spalten);
      const x0 = M.ZX0 + sp * zw;
      const ast = VLY + ze * zeile;
      const a = Math.round(x0 + (zw - w) / 2 + 4);
      const b = a + w;
      const top = ast + 40;
      const unten = top + h;
      const dx = a + 18;
      const bx = b - 18;
      aeste.push(ast);
      ruecks.push(unten + 14);
      const zu = `M${vorl} ${ast} H ${dx} V ${top}`;
      const ab = `M${bx} ${unten} V ${unten + 14} H ${rueck}`;
      const tx = (a + b) / 2;
      kreise += `
      <g class="circuit" id="hk${nr}-group">
        <path class="pipe-shell duenn" d="${zu} ${ab}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-in" d="${zu}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-out" d="${ab}"/>
        <path class="flowdots duenn" id="dots-hk${nr}" d="${zu}"/>
        <path class="flowdots duenn" id="dots-hk${nr}b" d="${ab}"/>
        <g transform="translate(${dx} ${ast + 20})">
          <circle r="15" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="hk${nr}-rotor">
            <path id="hk${nr}-blade" d="M0 -8 L2.5 -2 L9 0 L2.5 2 L0 8 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#55637A"/>
            <circle r="2.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="hk${nr}-pump-v" x="${dx + 22}" y="${ast + 25}" text-anchor="start">--</text>
        <g id="hk${nr}-rad">${this._heizkoerper(nr, a, b, top, unten,
          { x: dx, y: top, seite: "oben" }, { x: bx, y: unten, seite: "unten" })}
        </g>
        <g id="hk${nr}-name">
          <text class="cap" x="${tx}" y="${unten + 36}" text-anchor="middle">${escapeHtml(
            this._name(`label_hk${nr}`)
          )}</text>
        </g>
        <g id="hk${nr}-tag">
          <text class="tag-v hk-wert" id="hk${nr}-water-v" x="${tx}" y="${unten + 62}" text-anchor="middle">--</text>
        </g>
      </g>`;
    }
    const letzterAst = Math.max(...aeste);
    let vlPfad;
    let rlPfad;
    if (M.puffer) {
      // Vorlauf gerade aus dem Puffer, Ruecklauf auf halber Hoehe hinein.
      const RLY = zeilen > 1 ? 600 : 470;
      vlPfad = `M${M.BR} ${VLY} H ${vorl} V ${letzterAst}`;
      const teile = ruecks.map((y) => `M${rueck} ${y} V ${RLY}`);
      rlPfad = `${[...new Set(teile)].join(" ")} M${rueck} ${RLY} H ${M.BR}`;
    } else {
      // Ohne Puffer kommen die Heizkreise direkt an den Primaerkreis.
      vlPfad = `M${vorl} ${F} V ${letzterAst}`;
      rlPfad = `M${rueck} ${Math.min(...ruecks)} V ${R}`;
    }
    const rohre = `
      <!-- Sammelleitungen der Heizkreise -->
      <path class="pipe-shell duenn" d="${vlPfad} ${rlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-flow" d="${vlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-ret" d="${rlPfad}"/>
      <path class="flowdots duenn" id="dots-sf-a" d="${vlPfad}"/>
      <path class="flowdots duenn" id="dots-sr-a" d="${rlPfad}"/>`;
    return { rohre, kreise, vorl, rueck };
  },

  /**
   * Kamin und Solarthermie links am Puffer. Jedes Geraet hat eigenen
   * Vor- und Ruecklauf mit Pumpe, denn es sind getrennte Kreise.
   */
  _quellenMarkup(M) {
    if (!M.quellen.length) return "";
    // Name und Werte stehen unter dem Geraet, darum mehr Abstand.
    const lagen = M.quellen.length === 2 ? [350, 555] : [430];
    const cx = M.BL - 122;
    return M.quellen
      .map((art, i) => {
        const yc = lagen[i];
        const rand = art === "kamin" ? cx + 55 : cx + 58;
        const vl = `M${rand} ${yc - 18} H ${M.BL}`;
        const rl = `M${M.BL} ${yc + 18} H ${rand}`;
        const ly = yc + (art === "kamin" ? 80 : 72);
        return `
      <g class="quelle" id="${art}-group">
        <path class="pipe-shell duenn" d="${vl} ${rl}"/>
        <path class="pipe duenn" id="pipe-${art}-vl" d="${vl}"/>
        <path class="pipe duenn" id="pipe-${art}-rl" d="${rl}"/>
        <path class="flowdots duenn" id="dots-${art}" d="${vl}"/>
        <path class="flowdots duenn" id="dots-${art}b" d="${rl}"/>
        <g transform="translate(${M.BL - 30} ${yc + 18})">
          <circle r="15" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="${art}-rotor">
            <path id="${art}-blade" d="M0 -8 L2.5 -2 L9 0 L2.5 2 L0 8 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#55637A"/>
            <circle r="2.5" fill="#0D1219"/>
          </g>
        </g>
        ${art === "kamin" ? this._kaminBild(cx, yc) : this._solarBild(cx, yc)}
        <text class="cap" id="${art}-name" x="${cx}" y="${ly}" text-anchor="middle">${this._t(art === "kamin" ? "kamin" : "solarthermie")}</text>
        <text class="tag-v hk-wert" id="${art}-v" x="${cx}" y="${ly + 26}" text-anchor="middle">--</text>
        <text class="value-s" id="${art}-pump-v" x="${cx}" y="${ly + 48}" text-anchor="middle">--</text>
      </g>`;
      })
      .join("");
  },

  /** Kaminofen mit Sichtfenster. Die Flammen erscheinen, wenn er heizt. */
  _kaminBild(cx, yc) {
    const x = cx - 55;
    const top = yc - 62;
    return `
        <rect x="${cx - 13}" y="${top}" width="26" height="16" fill="#26303F" stroke="#33415A" stroke-width="2"/>
        <rect x="${x}" y="${top + 16}" width="110" height="104" rx="12" fill="#161D28" stroke="#33415A" stroke-width="2"/>
        <rect x="${x + 14}" y="${top + 30}" width="82" height="60" rx="7" fill="#0B1017" stroke="#46536A" stroke-width="1.5"/>
        <g id="kamin-flamme" opacity="0" transform="translate(${cx} ${top + 86}) scale(1.35)">
          <path d="M0 0 c-16 -6 -14 -20 -4 -32 c0 10 8 12 8 4 c6 8 10 20 -4 28 Z" fill="#FF8A3D"/>
          <path d="M0 0 c-8 -3 -7 -11 -1 -17 c1 6 6 6 5 1 c4 6 4 12 -4 16 Z" fill="#FFC44D"/>
          <path d="M-12 0 c-7 -4 -5 -12 0 -17 c0 6 4 6 4 2 c3 6 3 12 -4 15 Z" fill="#FF6B5E"/>
        </g>
        <rect x="${x + 14}" y="${top + 100}" width="82" height="8" rx="4" fill="#33415A"/>`;
  },

  /** Solarkollektor mit Sonne. */
  _solarBild(cx, yc) {
    const x = cx - 65;
    const u = yc + 50;
    const o = yc - 40;
    const strahlen = [0, 45, 90, 135, 180, 225, 270, 315]
      .map((w) => {
        const r = (w * Math.PI) / 180;
        return `<line x1="${(x + 4 + Math.cos(r) * 14).toFixed(1)}" y1="${(o - 18 + Math.sin(r) * 14).toFixed(1)}"
          x2="${(x + 4 + Math.cos(r) * 20).toFixed(1)}" y2="${(o - 18 + Math.sin(r) * 20).toFixed(1)}"
          stroke="#FFC44D" stroke-width="2.2" stroke-linecap="round"/>`;
      })
      .join("");
    const laengs = [1, 2, 3, 4]
      .map((i) => `<line x1="${x + (94 * i) / 5}" y1="${u}" x2="${x + 36 + (94 * i) / 5}" y2="${o}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`)
      .join("");
    const quer = [1, 2]
      .map((i) => `<line x1="${x + (36 * i) / 3}" y1="${u - (90 * i) / 3}" x2="${x + 94 + (36 * i) / 3}" y2="${u - (90 * i) / 3}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`)
      .join("");
    return `
        <g id="solar-sonne"><circle cx="${x + 4}" cy="${o - 18}" r="10" fill="#FFC44D"/>${strahlen}</g>
        <path d="M${x} ${u} L${x + 36} ${o} L${x + 130} ${o} L${x + 94} ${u} Z" fill="#1E5FA8" stroke="#33415A" stroke-width="2"/>
        ${laengs}${quer}`;
  },

  /** Bildart des Heizkreises: Platte, Glieder oder Fussbodenheizung. */
  _heizStil(n) {
    const v = this._config[`hk${n}_style`];
    return v === "glieder" || v === "fbh" ? v : "platte";
  },

  /** Reihen der Rohrschlange einer Fussbodenheizung, immer ungerade Anzahl. */
  _fbhReihen(top, unten) {
    const r = [];
    for (let y = top + 16; y <= unten - 12; y += 13) r.push(y);
    if (r.length % 2 === 0) r.pop();
    return r;
  },

  /**
   * Zeichnet den Heizkoerper eines Heizkreises in den Rahmen a..b,
   * top..unten. ein und aus sind die Anschluesse von Vor- und
   * Ruecklauf, nur die Fussbodenheizung fuehrt ihr Rohr bis dorthin.
   */
  _heizkoerper(n, a, b, top, unten, ein, aus) {
    const stil = this._heizStil(n);
    const fill = `url(#rad${n}Fill)`;
    if (stil === "glieder") {
      const w = 14, gap = 5;
      const anzahl = Math.floor((b - a - 4 + gap) / (w + gap));
      const off = a + Math.round((b - a - (anzahl * (w + gap) - gap)) / 2);
      let glieder = "";
      for (let i = 0; i < anzahl; i++) {
        glieder += `<rect x="${off + i * (w + gap)}" y="${top + 4}" width="${w}" height="${unten - top - 8}" rx="7"/>`;
      }
      return `
          <rect x="${a - 2}" y="${top + 12}" width="${b - a + 4}" height="8" rx="4" fill="#33415A"/>
          <rect x="${a - 2}" y="${unten - 20}" width="${b - a + 4}" height="8" rx="4" fill="#33415A"/>
          <g fill="${fill}" stroke="#0D1219" stroke-width="1.5">${glieder}</g>`;
    }
    if (stil === "fbh") {
      const li = a + 18, re = b - 18;
      const reihen = this._fbhReihen(top, unten);
      let d, x;
      if (ein.seite === "rechts") {
        d = `M${ein.x} ${reihen[0]} H ${li}`;
        x = li;
      } else {
        d = `M${ein.x} ${ein.y} V ${reihen[0]} H ${li} H ${re}`;
        x = re;
      }
      reihen.slice(1).forEach((y) => {
        x = x === li ? re : li;
        d += ` V ${y} H ${x}`;
      });
      d += aus.seite === "links" ? ` H ${aus.x}` : ` H ${aus.x} V ${aus.y}`;
      return `
          <rect x="${a - 6}" y="${top}" width="${b - a + 12}" height="${unten - top}" rx="8"
                fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <path d="${d}" fill="none" stroke="${fill}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    let profil = "";
    for (let x = a + 8; x < b - 4; x += 9) {
      profil += `<line x1="${x}" y1="${top + 16}" x2="${x}" y2="${unten - 6}"/>`;
    }
    let schlitze = "";
    for (let x = a + 10; x < b - 8; x += 12) {
      schlitze += `<rect x="${x}" y="${top + 4}" width="6" height="5" rx="1"/>`;
    }
    return `
          <rect x="${a}" y="${top}" width="${b - a}" height="${unten - top}" rx="6"
                fill="${fill}" stroke="#33415A" stroke-width="2"/>
          <g stroke="#0D1219" stroke-width="3" opacity="0.28">${profil}</g>
          <rect x="${a + 2}" y="${top + 2}" width="${b - a - 4}" height="11" rx="4" fill="#0D1219" opacity="0.35"/>
          <g fill="#0D1219" opacity="0.5">${schlitze}</g>
          <rect x="${a}" y="${top}" width="${b - a}" height="${unten - top}" rx="6" fill="url(#glass)"/>`;
  },

  /**
   * Aufsteigende Blasen in einem Speicher.
   * Die Lage jeder Blase ist fest vorberechnet, damit das Bild bei
   * jedem Neuaufbau gleich aussieht. Wie viele davon sichtbar sind,
   * entscheidet spaeter die Temperatur.
   */
  _bubbles(id, x, y, w, h, anzahl) {
    const n = anzahl || BUBBLE_COUNT;
    let zufall = 1;
    const naechste = () => {
      zufall = (zufall * 1103515245 + 12345) % 2147483648;
      return zufall / 2147483648;
    };
    let kreise = "";
    for (let i = 0; i < n; i++) {
      const cx = Math.round(x + 10 + naechste() * (w - 20));
      const r = (1.6 + naechste() * 2.4).toFixed(1);
      naechste(); // dauer (wird in loop berechnet)
      naechste(); // start (wird in loop berechnet)
      const bubbleId = `${id}-bubble-${i}`;
      kreise += `<circle class="bubble" id="${bubbleId}" cx="${cx}" cy="${y + h - 4}" r="${r}" opacity="0"/>`;
    }
    return `<g id="${id}">${kreise}</g>`;
  },

  _fan(id, cx, cy, r) {
    const count = 5;
    let blades = "";
    for (let i = 0; i < count; i++) {
      blades += `<path d="M0 0 C ${r * 0.34} ${-r * 0.3}, ${r * 0.8} ${-r * 0.26}, ${
        r * 0.92
      } ${r * 0.06} C ${r * 0.62} ${r * 0.3}, ${r * 0.22} ${r * 0.26}, 0 0 Z"
        transform="rotate(${(360 / count) * i})"/>`;
    }
    return `
      <g transform="translate(${cx} ${cy})">
        <circle r="${r + 10}" fill="#0B1017" stroke="#33415A" stroke-width="2"/>
        <circle r="${r + 2}" fill="none" stroke="#1E2836" stroke-width="6"/>
        <g class="rotor" id="${id}">
          <g class="blades">${blades}</g>
          <circle r="${r * 0.17}" fill="#2B3546"/>
        </g>
        <g stroke="#2A3446" stroke-width="1.5" fill="none" opacity="0.55">
          <circle r="${r * 0.4}"/><circle r="${r * 0.65}"/><circle r="${r * 0.9}"/>
        </g>
        <text class="value-s" id="${id}-rpm" y="${r + 30}" text-anchor="middle">--</text>
      </g>`;
  },
};
