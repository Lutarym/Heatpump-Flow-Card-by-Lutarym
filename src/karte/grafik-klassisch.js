/**
 * Klassische Ansicht im Querformat, wie bis Version 4.9.0: Waermepumpe,
 * Puffer, Heizkreise 1 und 2, Warmwasserspeicher ganz rechts.
 * Waehlbar im Editor unter Anordnung. Zusatzwaerme und Heizkreis 3 und 4
 * gibt es nur in der neuen Ansicht.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { abzeichenBreite, clamp, escapeHtml, schildBreite } from "../hilfsfunktionen.js";
import { L, LUFT, NEUTRAL } from "../konstanten.js";

export const grafikKlassischKarte = {
  _svgQuerKlassisch() {
    const two = this._config.fan_count === 2;
    const fans = two ? `${this._fan("fan1", 190, 360, 96)}${this._fan("fan2", 190, 608, 96)}` : this._fan("fan1", 190, 480, 120);
    const F = L.FLOW_Y;
    const R = L.RET_Y;
    const SF = L.SEC_FLOW;
    const SR = L.SEC_RET;
    const DX = this._config.hk_count >= 2 ? 0 : 260;
    const PX = this._hatPuffer() ? 0 : 160;
    const SEC_START = this._hatPuffer() ? 730 : 630 + PX;
    const VX = DX + PX;
    const SEC_VL_ENDE = this._config.hk_count >= 2 ? L.X_HK2_DROP : L.X_HK1_DROP;
    const SEC_RL_ENDE = this._config.hk_count >= 2 ? L.X_HK2_BACK : L.X_HK1_BACK;
    const T = L.TANK_TOP;
    const B = L.TANK_BOTTOM;
    const hk2 = this._config.hk_count >= 2;
    return `
    <svg viewBox="0 ${80 - LUFT} ${L.W - VX} ${L.H + LUFT}" class="lhc-svg" role="img"
         aria-label="${this._t("s_schema")}">
${this._defs()}
      <defs>
        <clipPath id="bufClip"><rect x="548" y="298" width="174" height="334" rx="20"/></clipPath>
        <clipPath id="dhwClip"><rect x="1438" y="298" width="174" height="334" rx="20"/></clipPath>
      </defs>

      <!-- Sammelleitungen -->
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C - VX}"/>
      <path class="pipe" id="pipe-return" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C - VX}"/>
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C - VX}"/>
      <path class="pipe" id="pipe-flow" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C - VX}"/>
      <!-- Zwei Abschnitte je Leitung: bis zum Ventil und dahinter.
           Der Teil hinter dem Ventil fuehrt nur zum Warmwasserspeicher. -->
      <path class="flowdots" id="dots-vl-a" d="M${L.X_PIPE_L} ${F} H 630"/>
      <path class="flowdots" id="dots-ww-vl" d="M630 ${F} H ${L.X_DHW_C - VX}"/>
      <path class="flowdots" id="dots-rl-a" d="M630 ${R} H ${L.X_PIPE_L}"/>
      <path class="flowdots" id="dots-ww-rl" d="M${L.X_DHW_C - VX} ${R} H 630"/>

      ${(() => {
      const mit = this._hatPuffer();
      const vl = mit ? `M630 ${F} V ${T}` : `M630 ${F} V ${SF}`;
      const rl = mit ? `M630 ${B} V ${R}` : `M630 ${SR} V ${R}`;
      return `
      <path class="pipe-shell" d="${vl} ${rl}"/>
      <path class="pipe" id="pipe-buf-in" d="${vl}"/>
      <path class="pipe" id="pipe-buf-out" d="${rl}"/>
      <path class="flowdots" id="dots-buf" d="${vl}"/>
      <path class="flowdots" id="dots-buf2" d="${rl}"/>`;
    })()}

      <g transform="translate(${-PX} 0)">
      <!-- Sekundaerkreis: vom Puffer zu den Heizkreisen und zurueck -->
      <path class="pipe-shell" d="M${SEC_START} ${SF} H ${SEC_VL_ENDE} M${SEC_START} ${SR} H ${SEC_RL_ENDE}"/>
      <path class="pipe" id="pipe-sec-flow" d="M${SEC_START} ${SF} H ${SEC_VL_ENDE}"/>
      <path class="pipe" id="pipe-sec-ret" d="M${SEC_START} ${SR} H ${SEC_RL_ENDE}"/>
      <!-- Auch hier abschnittsweise: der Weg zum zweiten Heizkreis
           fuehrt nur Wasser, wenn dessen Pumpe laeuft. -->
      <path class="flowdots" id="dots-sf-a" d="M${SEC_START} ${SF} H ${L.X_HK1_DROP}"/>
      <path class="flowdots rev" id="dots-sr-a" d="M${SEC_START} ${SR} H ${L.X_HK1_BACK}"/>
      ${hk2 ? `<path class="flowdots" id="dots-sf-b" d="M${L.X_HK1_DROP} ${SF} H ${L.X_HK2_DROP}"/>
             <path class="flowdots rev" id="dots-sr-b" d="M${L.X_HK1_BACK} ${SR} H ${L.X_HK2_BACK}"/>` : ""}
      </g>

      <path class="pipe-shell" d="M${L.X_DHW_C - VX} ${F} V ${T} M${L.X_DHW_C - VX} ${B} V ${R}"/>
      <path class="pipe" id="pipe-dhw-in" d="M${L.X_DHW_C - VX} ${F} V ${T}"/>
      <path class="pipe" id="pipe-dhw-out" d="M${L.X_DHW_C - VX} ${B} V ${R}"/>
      <path class="flowdots" id="dots-dhw" d="M${L.X_DHW_C - VX} ${F} V ${T}"/>
      <path class="flowdots" id="dots-dhw2" d="M${L.X_DHW_C - VX} ${B} V ${R}"/>

      <!-- Innenraum hinter der Tuer -->
      <g id="unit-innen">
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="#080C12" stroke="#33415A" stroke-width="2"/>
        <rect x="56" y="${L.UNIT_TOP + 16}" width="268" height="608" rx="10" fill="none" stroke="#1C2533" stroke-width="1.5"/>
      </g>
      <!-- Au\xDFenger\xE4t -->
      <g class="unit" id="unit-group">
        <rect id="unit-glow" x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16"
              fill="none" stroke="#22C55E" stroke-width="10" opacity="0"
              filter="url(#unitGlowBlur)"/>
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16"
              fill="url(#casing)" stroke="#33415A" stroke-width="2"/>
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="url(#glass)"/>

        <!-- Zustand der Waermepumpe. Blass wenn die Betriebsart es nicht
             umfasst, hell wenn sie es umfasst, blinkend wenn die Anlage
             gerade genau das tut. -->
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
        </g>

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
      const rand = L.W - VX - 10;
      const w = clamp(Number(this._config.history_width) || 450, 250, Math.min(700, rand - 700));
      return this._verlaufAlsKnopf() ? this._diaKnoepfe(rand - w, 84 - LUFT + 8, w) : this._verlaufRahmen(rand - w, 84 - LUFT, w, 144);
    })()}


      <!-- SG Ready, PV Leistung, Leistung, Verbrauch - zentriert zwischen VL und RL -->
      <!-- Als Gruppe zusammengefasst, damit sie im Hochformat als Ganzes
           neben die Waermepumpe gestellt werden kann. -->
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

      <!-- PV Leistung -->
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
      </g>

      <!-- Vorlauf am Ausgang, R\xFCcklauf am Eingang -->
      <!-- Die Beschriftung liegt auf der Leitung und unterbricht sie,
           damit sie ohne Suchen der Leitung zugeordnet werden kann. -->
      <g id="vl-schild">
        <rect x="${410 - schildBreite("Vorlauf", 80) / 2}" y="${F - 13}" width="${schildBreite("Vorlauf", 80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="410" y="${F + 5}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="410" y="${F - 24}"
            text-anchor="middle">--</text>
      <g id="rl-schild">
        <rect x="${410 - schildBreite("R\xFCcklauf", 80) / 2}" y="${R - 13}" width="${schildBreite("R\xFCcklauf", 80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="410" y="${R + 5}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="410" y="${R + 40}"
            text-anchor="middle">--</text>

      <!-- Stromverbrauch der W\xE4rmepumpe, aus dem Shelly PM -->
      
      

      <!-- Prim\xE4rpumpe -->
      <g>
        <text class="cap-s" x="580" y="662" text-anchor="middle">${this._t("pumpe")}</text>
        <text class="value-s" id="pump-v" x="580" y="749" text-anchor="middle">--</text>
        <text class="value-s" id="flow-v" x="580" y="769" text-anchor="middle">--</text>
        <g transform="translate(580 ${R})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="pump-rotor">
            <path id="pump-blade" d="M0 -15 L5 -4 L16 0 L5 4 L0 15 L-5 4 L-16 0 L-5 -4 Z" fill="#55637A"/>
            <circle r="4" fill="#0D1219"/>
          </g>
        </g>
      </g>

      ${this._hatPuffer() ? `
      <!-- Heizungspuffer -->
      <g id="buffer-group">
        <rect x="${L.X_BUF}" y="${T}" width="190" height="350" rx="26"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <rect x="548" y="298" width="174" height="334" rx="20" fill="url(#bufferFill)"/>
        <g clip-path="url(#bufClip)">${this._bubbles("buf-bubbles", 548, 298, 174, 334)}</g>
        <rect x="548" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        <text class="value-l" id="buf-v" x="${L.X_BUF_C}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="buf-sp" x="${L.X_BUF_C}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="buf-delta" x="${L.X_BUF_C}" y="482" text-anchor="middle"></text>
        <g id="roomheater-badge" class="badge" transform="translate(${L.X_BUF_C} 604)">
          <rect x="${-abzeichenBreite("Heizstab") / 2}" y="-15" width="${abzeichenBreite("Heizstab")}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>
        <g id="buf-name"><rect x="${L.X_BUF_C - schildBreite(this._name("label_buffer"), 150) / 2}" y="305"
              width="${schildBreite(this._name("label_buffer"), 150)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${L.X_BUF_C}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
      this._name("label_buffer")
    )}</text></g>
      </g>
      ` : ""}

      <!-- Wasserdruck -->
      <g id="press-group" opacity="0" transform="translate(${-VX} 0)">
        <text class="cap-s" x="${L.X_PRESS}" y="662" text-anchor="middle">${this._t("druck")}</text>
        <!-- Warndreieck bei zu niedrigem Wasserdruck. -->
        <g id="press-warn" opacity="0" transform="translate(${L.X_HK2_B} 742)">
          <path d="M0 -13 L13 10 L-13 10 Z" fill="#3A0E0E"
                stroke="#D62B2B" stroke-width="2" stroke-linejoin="round"/>
          <path d="M0 -6 V 3" stroke="#FF6B5E" stroke-width="2.5" stroke-linecap="round"/>
          <circle cy="7" r="1.6" fill="#FF6B5E"/>
        </g>
        <g transform="translate(${L.X_PRESS} ${R})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <circle r="18" fill="none" stroke="#26303F" stroke-width="3"/>
          <line id="press-needle" x1="0" y1="0" x2="0" y2="-15"
                stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round"/>
          <circle r="4" fill="#55637A"/>
        </g>
        <text class="value-s" id="press-v" x="${L.X_PRESS}" y="749" text-anchor="middle">--</text>
      </g>

      <g transform="translate(${-PX} 0)">
      ${this._circuitKlassisch(1, L.X_HK1_A, L.X_HK1_B, L.X_HK1_DROP, L.X_HK1_BACK)}
      ${hk2 ? this._circuitKlassisch(2, L.X_HK2_A, L.X_HK2_B, L.X_HK2_DROP, L.X_HK2_BACK) : ""}
      </g>

      <!-- Dreiwegeventil an der Abzweigung: hier teilt sich der Vorlauf
           nach unten in den Puffer oder weiter nach rechts zum Speicher. -->
      <g>
        <circle cx="630" cy="${F}" r="22" fill="#0D1219"
                stroke="#33415A" stroke-width="2"/>
        <!-- Der Pfeil zeigt, wohin das Ventil geoeffnet ist. -->
        <g id="valve-arrow-heiz" opacity="0">
          <path id="valve-heiz-line" d="M630 ${F - 12} V ${F + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-heiz-head" d="M622 ${F + 2} L 630 ${F + 14} L 638 ${F + 2} Z"
                fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-ww" opacity="0">
          <path id="valve-ww-line" d="M${630 - 12} ${F} H ${630 + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-ww-head" d="M${630 + 2} ${F - 8} L ${630 + 14} ${F} L ${630 + 2} ${F + 8} Z"
                fill="${NEUTRAL}"/>
        </g>
        <text class="cap-s" x="630" y="${F - 58}" text-anchor="middle">${this._t("umschaltventil")}</text>
        <text class="value-s" id="valve-v" x="630" y="${F - 34}"
              text-anchor="middle">--</text>
      </g>

      <!-- Warmwasserspeicher -->
      <!-- Zirkulationskreis am Warmwasserspeicher -->
      <g id="zirkulation-group" opacity="0" transform="translate(${-VX} 0)">
        <path class="pipe-shell" fill="none" d="M${L.X_DHW} 320 H ${L.X_ZIRK} M${L.X_ZIRK} 620 H ${L.X_DHW}"/>
        <path class="pipe" id="pipe-zirk-h1" fill="none" d="M${L.X_DHW} 320 H ${L.X_ZIRK}"/>
        <path class="pipe" id="pipe-zirk-h2" fill="none" d="M${L.X_ZIRK} 620 H ${L.X_DHW}"/>
        <path class="flowdots" id="dots-zirk-h1" fill="none" d="M${L.X_DHW} 320 H ${L.X_ZIRK}"/>
        <path class="flowdots" id="dots-zirk-h2" fill="none" d="M${L.X_ZIRK} 620 H ${L.X_DHW}"/>
        <path class="pipe-shell" fill="none" d="M${L.X_ZIRK} 320 V 620"/>
        <path class="pipe" id="pipe-zirk-v" fill="none" d="M${L.X_ZIRK} 320 V 620"/>
        <path class="flowdots" id="dots-zirk-v" fill="none" d="M${L.X_ZIRK} 320 V 620"/>
        <g transform="translate(${L.X_ZIRK} 360)">
          <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="zirk-rotor">
            <path id="zirk-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
            <circle r="4" fill="#0D1219"/>
          </g>
        </g>
        <text class="cap-s" id="zirk-name" x="${L.X_ZIRK}" y="300" text-anchor="middle">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${L.X_ZIRK}" y="318" text-anchor="middle" opacity="0">--</text>
      </g>

            <g id="dhw-group" transform="translate(${-VX} 0)">
        <rect x="${L.X_DHW}" y="${T}" width="190" height="350" rx="26"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <rect x="1438" y="298" width="174" height="334" rx="20" fill="url(#dhwFill)"/>
        <g clip-path="url(#dhwClip)">${this._bubbles("dhw-bubbles", 1438, 298, 174, 334)}</g>
        <rect x="1438" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        <text class="value-l" id="dhw-v" x="${L.X_DHW_C}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="dhw-sp" x="${L.X_DHW_C}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="dhw-delta" x="${L.X_DHW_C}" y="482" text-anchor="middle"></text>
        <g id="dhwforce-badge" class="badge" transform="translate(${L.X_DHW_C} 536)">
          <rect x="${-abzeichenBreite("Aufheizen") / 2}" y="-15" width="${abzeichenBreite("Aufheizen")}" height="30" rx="15"
                fill="#08243A" stroke="#3B9BE0" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("aufheizen")}</text>
        </g>
        <g id="sterilization-badge" class="badge" transform="translate(${L.X_DHW_C} 570)">
          <rect x="${-abzeichenBreite("Legionellen") / 2}" y="-15" width="${abzeichenBreite("Legionellen")}" height="30" rx="15"
                fill="#2B1240" stroke="#A855F7" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("legionellen")}</text>
        </g>
        <g id="dhwheater-badge" class="badge" transform="translate(${L.X_DHW_C} 604)">
          <rect x="${-abzeichenBreite("Heizstab") / 2}" y="-15" width="${abzeichenBreite("Heizstab")}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>
        <g id="dhw-name"><rect x="${L.X_DHW_C - schildBreite(this._name("label_dhw"), 150) / 2}" y="305"
              width="${schildBreite(this._name("label_dhw"), 150)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${L.X_DHW_C}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
      this._name("label_dhw")
    )}</text></g>
      </g>

    </svg>`;
  },

  _circuitKlassisch(n, x1, x2, dropX, backX) {
    const RT = L.RAD_TOP;
    const BT = RT;
    const BB = RT + 92;
    const tx = Math.round((x1 + backX - 9) / 2);
    const drop = `M${dropX} ${L.SEC_FLOW} V ${BT - 9}`;
    const pumpY = Math.round((L.SEC_FLOW + RT) / 2);
    const back = `M${backX} ${BB} V ${L.SEC_RET}`;
    const koerper = this._heizkoerper(
      n,
      x1 + 14,
      x2 - 14,
      BT,
      BB,
      { x: dropX, y: BT, seite: "oben" },
      { x: backX, y: BB, seite: "unten" }
    );
    return `
      <g class="circuit" id="hk${n}-group">
        <path class="pipe-shell" d="${drop} ${back}"/>
        <path class="pipe" id="pipe-hk${n}-in" d="${drop}"/>
        <path class="pipe" id="pipe-hk${n}-out" d="${back}"/>
        <path class="flowdots" id="dots-hk${n}" d="${drop}"/>
        <path class="flowdots" id="dots-hk${n}b" d="${back}"/>

        <g transform="translate(${dropX} ${pumpY})">
          <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="hk${n}-rotor">
            <path id="hk${n}-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
            <circle r="4" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="hk${n}-pump-v" x="${dropX + 34}" y="${pumpY + 6}"
              text-anchor="start">--</text>

        <g id="hk${n}-rad">${koerper}
        </g>

        <g id="hk${n}-name">
          <text class="cap" x="${tx}" y="${BB + 26}" text-anchor="middle">${escapeHtml(
      this._name(`label_hk${n}`)
    )}</text>
        </g>
        <g id="hk${n}-tag">
          <text class="tag-v hk-wert" id="hk${n}-water-v" x="${tx}" y="${BB + 54}" text-anchor="middle">--</text>
        </g>
      </g>`;
  },
};
