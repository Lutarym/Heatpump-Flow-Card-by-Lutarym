/**
 * Grafik im Hochformat.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { abzeichenBreite, clamp, escapeHtml, schildBreite } from "../hilfsfunktionen.js";
import { NEUTRAL } from "../konstanten.js";

export const grafikHochKarte = {
  /**
   * Hochformat als eigene Anordnung, nicht als Drehung.
   * Oben Waermepumpe und Kennzahlen nebeneinander, darunter senkrecht
   * der Vorlauf rechts und der Ruecklauf links. Dazwischen haengen
   * Puffer, Heizkreise und Warmwasser. Alle Kennungen sind dieselben
   * wie im Querformat, damit die Aktualisierung unveraendert arbeitet.
   */
  _svgHoch() {
    const anzahl = this._hkAnzahl();
    const quellen = this._quellen();
    const P = {
      W: 760,
      X_RL: 80, X_VL: 710,      // Primaerkreis
      S_RL: 170, S_VL: 650,      // Sekundaerkreis vom Puffer
      U1: 260, U2: 580,          // Kanten der liegenden Baugruppen
      OBEN: 740,
    };
    const UM = (P.U1 + P.U2) / 2;

    // Senkrechte Aufteilung. Ohne zweiten Heizkreis ruecken die
    // darunterliegenden Baugruppen nach.
    // Ohne Heizungspuffer entfaellt dessen Zeile, alles darunter
    // rueckt um deren Hoehe nach oben.
    const mitPuffer = this._hatPuffer();
    const ab = mitPuffer ? 0 : 280;
    const PUF = [860, 1080];
    // Kamin und Solarthermie stehen in einer eigenen Zeile direkt unter
    // dem Puffer und schliessen von unten an ihn an.
    const QZ = quellen.length ? [PUF[1] + 60, PUF[1] + 280] : null;
    const QH = quellen.length ? 250 : 0;
    const HKS = Array.from({ length: anzahl }, (_, i) =>
      [1140 - ab + QH + i * 240, 1340 - ab + QH + i * 240]);
    const HK1 = HKS[0];
    const WW = [HKS[anzahl - 1][1] + 20, HKS[anzahl - 1][1] + 280];
    // Hoehe, auf der der Sekundaerkreis abzweigt
    const ABZW = mitPuffer ? PUF[1] - 20 : HK1[0] - 40;
    // Hoehe der Anschluesse von Vor- und Ruecklauf je Heizkreis. Die
    // Fussbodenheizung schliesst an ihrer ersten und letzten Rohrreihe an.
    const anschluss = (n, y1, y2) => {
      if (this._heizStil(n) !== "fbh") return { vy: y1 + 60, ry: y2 - 60 };
      const r = this._fbhReihen(y1 + 10, y2 - 10);
      return { vy: r[0], ry: r[r.length - 1] };
    };
    const an = HKS.map((z, i) => anschluss(i + 1, z[0], z[1]));
    const a1 = an[0];
    const letzt = an[anzahl - 1];
    // Ohne Puffer zweigen Vor- und Ruecklauf erst auf Hoehe der Anschluesse
    // von HK1 ab. Sonst liefen die Sammelleitungen durch die Beschriftung
    // von Umschaltventil und Primaerpumpe.
    const ABZW_VL = mitPuffer ? ABZW : a1.vy;
    const ABZW_RL = mitPuffer ? ABZW : a1.ry;
    const UNTEN = WW[1] + 40;
    const HOEHE = WW[1] + 60;

    const rohr = (d) =>
      `<path class="pipe-shell" d="${d}"/><path class="pipe" d="${d}"/>`;

    // Waagerechter Stutzen von einer senkrechten Leitung zur Baugruppe
    const stutzenVL = (x, y) => rohr(`M${x} ${y} H ${P.U2 + 9}`);
    const stutzenRL = (x, y) => rohr(`M${P.U1 - 9} ${y} H ${x}`);

    /* ---------------- Kopf: Waermepumpe ---------------- */
    const symbole = ["betrieb", "abtauen", "auto", "heizen", "ww", "kuehlen"]
      .map((k, i) => {
        const glyph = {
          betrieb: `<g stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round">
                      <path d="M0 -10 V -1"/><path d="M-6.4 -6.4 A 9 9 0 1 0 6.4 -6.4"/></g>`,
          abtauen: `<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
                      <path d="M0 -12 V 1 M-7 -8 L 7 0 M-7 0 L 7 -8"/>
                      <path d="M-2.6 -9.5 L0 -12 L2.6 -9.5"/></g>
                    <path d="M-5 5 C -2.6 8, -2.6 11, -5 11 C -7.4 11, -7.4 8, -5 5 Z
                             M5 5 C 7.4 8, 7.4 11, 5 11 C 2.6 11, 2.6 8, 5 5 Z" fill="currentColor"/>`,
          auto: `<text class="modus-t" x="0" y="7" text-anchor="middle" fill="currentColor">A</text>`,
          heizen: `<path d="M0 -11 C 6 -4, 8 0, 8 3 A 8 8 0 1 1 -8 3 C -8 -1, -3 -4, 0 -11 Z" fill="currentColor"/>
                   <path d="M0 -2 C 3 1, 4 3, 4 4.5 A 4 4 0 1 1 -4 4.5 C -4 3, -2 1.5, 0 -2 Z" fill="#0D1219"/>`,
          ww: `<path d="M0 -11 C 6 -2, 9 2, 9 5 A 9 9 0 0 1 -9 5 C -9 2, -6 -2, 0 -11 Z" fill="currentColor"/>`,
          kuehlen: `<g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
                      <path d="M0 -11 V 11 M-9.5 -5.5 L 9.5 5.5 M-9.5 5.5 L 9.5 -5.5"/>
                      <path d="M-3 -8 L0 -11 L3 -8 M-3 8 L0 11 L3 8"/></g>`,
        }[k];
        return `<g class="modus" id="modus-${k}" transform="translate(${
          190 + (i - 2.5) * 44
        } 70)">
          <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>${glyph}</g>`;
      })
      .join("");

    const fans =
      this._config.fan_count === 2
        ? `${this._fan("fan1", 190, 280, 96)}${this._fan("fan2", 190, 528, 96)}`
        : this._fan("fan1", 190, 400, 120);

    const kopf = `
      <!-- Innenraum hinter der Tuer -->
      <g id="unit-innen">
        <rect x="40" y="40" width="300" height="640" rx="16" fill="#080C12" stroke="#33415A" stroke-width="2"/>
        <rect x="56" y="56" width="268" height="608" rx="10" fill="none" stroke="#1C2533" stroke-width="1.5"/>
      </g>
      <g class="unit" id="unit-group">
        <rect id="unit-glow" x="40" y="40" width="300" height="640" rx="16"
              fill="none" stroke="#22C55E" stroke-width="10" opacity="0"
              filter="url(#unitGlowBlur)"/>
        <rect x="40" y="40" width="300" height="640" rx="16"
              fill="url(#casing)" stroke="#33415A" stroke-width="2"/>
        <rect x="40" y="40" width="300" height="640" rx="16" fill="url(#glass)"/>
        ${symbole}
        <text class="modus-zeile" id="modus-text" x="190" y="103" text-anchor="middle"></text>
        <text class="unit-label"   x="129" y="122" text-anchor="middle">${this._t("aussentemperatur")}</text>
        <text class="unit-value-s" id="outside-v" x="129" y="148" text-anchor="middle">--</text>
        <text class="unit-label"   x="273" y="122" text-anchor="middle">${this._t("verdichter")}</text>
        <text class="unit-value-s" id="comp-v" x="273" y="148" text-anchor="middle">--</text>
        ${fans}
        <g id="tuer-knopf" class="tuer-knopf" transform="translate(312 652)" role="button" tabindex="0">
          <title>${this._t("t_oeffnen")}</title>
          <circle r="17" fill="#0D1219" stroke="#55657F" stroke-width="1.5"/>
          <g stroke="#98A6BA" stroke-width="1.8" stroke-linecap="round">
            <path d="M-7 -6 H7 M-7 0 H7 M-7 6 H7"/>
          </g>
          <circle cx="-3" cy="-6" r="2.4" fill="#E0762E"/>
          <circle cx="3" cy="0" r="2.4" fill="#E0762E"/>
          <circle cx="-1" cy="6" r="2.4" fill="#E0762E"/>
        </g>
      </g>`;

    /* ---------------- Kopf: Kennzahlen ---------------- */
    const kennzahlen = `
      <g id="kennzahlen">
        <g id="sg-group" opacity="0">
          <text class="sg-label" x="390" y="70">SG Ready</text>
          <text class="sg-value" id="sg-text" x="390" y="98">--</text>
          <g transform="translate(390 112)">
            ${[0, 1, 2, 3]
              .map(
                (i) =>
                  `<rect x="${i * 36}" y="0" width="32" height="11" rx="5.5" id="sg-seg-${
                    i + 1
                  }" fill="#3A4658"/>`
              )
              .join("")}
          </g>
        </g>
        <line x1="384" y1="142" x2="716" y2="142" stroke="#55657F" stroke-width="1"/>
        <g id="pv-group" opacity="0">
          <text class="sg-label" x="390" y="176">${this._t("pv_ueberschuss")}</text>
          <text class="pv-value" id="pv-v" x="390" y="204">--</text>
        </g>
        <line x1="384" y1="232" x2="716" y2="232" stroke="#55657F" stroke-width="1"/>
        <g id="verbrauch-group" opacity="0">
          <text class="sg-label" x="390" y="266">${this._t("verbrauch")}</text>
          <text class="verbrauch-v" id="power-now-v" x="390" y="294">--</text>
        </g>
        <line x1="384" y1="322" x2="716" y2="322" stroke="#55657F" stroke-width="1"/>
        <text class="sg-label" id="energy-label" x="390" y="356">--</text>
        <text class="unit-value" id="energy-today-v" x="390" y="386">--</text>
      </g>`;

    /* ---------------- Hauptleitungen ---------------- */
    const leitungen = `
      ${rohr(`M260 680 V ${P.OBEN} H ${P.X_VL} V ${WW[0] + 40}`)}
      ${rohr(`M${P.X_RL} ${WW[1] - 20} V 680`)}
      <path class="flowdots" id="dots-vl-a" d="M260 680 V ${P.OBEN} H ${P.X_VL} V ${mitPuffer ? PUF[0] + 60 : ABZW_VL}"/>
      <path class="flowdots" id="dots-ww-vl" d="M${P.X_VL} ${mitPuffer ? PUF[0] + 60 : ABZW_VL} V ${WW[0] + 40}"/>
      <path class="flowdots" id="dots-rl-a" d="M${P.X_RL} ${mitPuffer ? PUF[1] - 60 : ABZW_RL} V 680"/>
      <path class="flowdots" id="dots-ww-rl" d="M${P.X_RL} ${WW[1] - 20} V ${mitPuffer ? PUF[1] - 60 : ABZW_RL}"/>

      <g id="vl-schild">
        <rect x="${P.X_VL - schildBreite("Vorlauf", 92) / 2}" y="${P.OBEN + 40}" width="${schildBreite("Vorlauf", 92)}" height="28" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="${P.X_VL}" y="${P.OBEN + 59}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="${P.X_VL - 34}" y="${P.OBEN + 30}"
            text-anchor="end">--</text>
      <g id="rl-schild">
        <rect x="${P.X_RL - schildBreite("Rücklauf", 104) / 2}" y="${P.OBEN + 40}" width="${schildBreite("Rücklauf", 104)}" height="28" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="${P.X_RL}" y="${P.OBEN + 59}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="${P.X_RL + 34}" y="${P.OBEN + 30}"
            text-anchor="start">--</text>

      <g id="ventil" transform="translate(${P.X_VL} 830)">
        <circle r="22" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <g id="valve-arrow-heiz" opacity="1">
          <path id="valve-heiz-line" d="M0 -12 V 4" stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path id="valve-heiz-head" d="M-8 2 L 0 14 L 8 2 Z" fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-ww" opacity="0">
          <path id="valve-ww-line" d="M-12 0 H 4" stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path id="valve-ww-head" d="M2 -8 L 14 0 L 2 8 Z" fill="${NEUTRAL}"/>
        </g>
      </g>
      <text class="cap-s" x="${P.X_VL - 34}" y="854" text-anchor="end">${this._t("umschaltventil")}</text>
      <text class="value-s" id="valve-v" x="${P.X_VL - 34}" y="880" text-anchor="end">--</text>

      <g transform="translate(${P.X_RL} 960)">
        <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <g class="rotor" id="pump-rotor">
          <path id="pump-blade" d="M0 -15 L5 -4 L16 0 L5 4 L0 15 L-5 4 L-16 0 L-5 -4 Z" fill="#55637A"/>
          <circle r="4" fill="#0D1219"/>
        </g>
      </g>
      <text class="cap-s"   x="${P.X_RL + 42}" y="942" text-anchor="start">${this._t("pumpe")}</text>
      <text class="value-s" id="pump-v" x="${P.X_RL + 42}" y="966" text-anchor="start">--</text>
      <text class="value-s" id="flow-v" x="${P.X_RL + 42}" y="988" text-anchor="start">--</text>

      <g id="press-group" opacity="0">
        <g transform="translate(${P.X_RL} ${UNTEN - 120})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <circle r="18" fill="none" stroke="#26303F" stroke-width="3"/>
          <line id="press-needle" x1="0" y1="0" x2="0" y2="-15"
                stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round"/>
          <circle r="4" fill="#55637A"/>
        </g>
        <text class="cap-s"   x="${P.X_RL + 42}" y="${UNTEN - 126}" text-anchor="start">${this._t("druck")}</text>
        <text class="value-s" id="press-v" x="${P.X_RL + 42}" y="${UNTEN - 102}" text-anchor="start">--</text>
        <g id="press-warn" opacity="0" transform="translate(${P.X_RL + 170} ${UNTEN - 114})">
          <path d="M0 -13 L13 10 L-13 10 Z" fill="#3A0E0E"
                stroke="#D62B2B" stroke-width="2" stroke-linejoin="round"/>
          <path d="M0 -6 V 3" stroke="#FF6B5E" stroke-width="2.5" stroke-linecap="round"/>
          <circle cy="7" r="1.6" fill="#FF6B5E"/>
        </g>
      </g>`;

    /* ---------------- Liegender Speicher ---------------- */
    const speicher = (id, y1, y2, name, fuell, mindest, labelKey, badges) => {
      const h = y2 - y1;
      // Eigener Name oder der Standardname in der Kartensprache.
      const breite = schildBreite(this._name(labelKey), mindest);
      return `
        <g class="unit klickbar" id="${id}">
          <rect x="${P.U1}" y="${y1}" width="${P.U2 - P.U1}" height="${h}" rx="26"
                fill="#0E1620" stroke="#33415A" stroke-width="2"/>
          <rect x="${P.U1 + 8}" y="${y1 + 8}" width="${P.U2 - P.U1 - 16}" height="${h - 16}" rx="20"
                fill="url(#${fuell})"/>
          ${this._bubbles(`${name}-bubbles`, P.U1 + 8, y1 + 8, P.U2 - P.U1 - 16, h - 16)}
          <rect x="${P.U1 + 8}" y="${y1 + 8}" width="${P.U2 - P.U1 - 16}" height="${h - 16}" rx="20"
                fill="url(#glass)"/>
          <g id="${name}-name">
            <rect x="${UM - breite / 2}" y="${y1 + 12}" width="${breite}" height="30" rx="8"
                  fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
            <text class="cap" x="${UM}" y="${y1 + 27}" text-anchor="middle"
                  dominant-baseline="middle">${escapeHtml(this._name(labelKey))}</text>
          </g>
          <text class="value-l"  id="${name}-v"  x="${UM}" y="${y1 + h / 2 + 12}" text-anchor="middle">--</text>
          <text class="value-sp" id="${name}-sp" x="${UM}" y="${y1 + h / 2 + 36}" text-anchor="middle"></text>
          <text class="value-sp" id="${name}-delta" x="${UM}" y="${y1 + h / 2 + 60}" text-anchor="middle"></text>
          ${badges || ""}
        </g>`;
    };

    const puffer =
      stutzenVL(P.X_VL, PUF[0] + 60) +
      stutzenRL(P.X_RL, PUF[1] - 60) +
      `<path class="flowdots" id="dots-buf" d="M${P.X_VL} ${PUF[0] + 60} H ${P.U2 + 9}"/>
       <path class="flowdots" id="dots-buf2" d="M${P.U1 - 9} ${PUF[1] - 60} H ${P.X_RL}"/>` +
      speicher("buffer-group", PUF[0], PUF[1], "buf", "bufferFill", 150, "label_buffer", `
        <g id="roomheater-badge" class="badge" transform="translate(${UM} ${PUF[0] + 70})">
          <rect x="${-abzeichenBreite("Heizstab") / 2}" y="-15" width="${abzeichenBreite("Heizstab")}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>`);

    const warmwasser =
      stutzenVL(P.X_VL, WW[0] + 40) +
      stutzenRL(P.X_RL, WW[1] - 20) +
      `<path class="flowdots" id="dots-dhw" d="M${P.X_VL} ${WW[0] + 40} H ${P.U2 + 9}"/>
       <path class="flowdots" id="dots-dhw2" d="M${P.U1 - 9} ${WW[1] - 20} H ${P.X_RL}"/>` +
      speicher("dhw-group", WW[0], WW[1], "dhw", "dhwFill", 134, "label_dhw", `
        <g id="dhwforce-badge" class="badge" transform="translate(${UM - 120} ${WW[0] + 70})">
          <rect x="${-abzeichenBreite("Aufheizen") / 2}" y="-15" width="${abzeichenBreite("Aufheizen")}" height="30" rx="15"
                fill="#08243A" stroke="#3B9BE0" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("aufheizen")}</text>
        </g>
        <g id="sterilization-badge" class="badge" transform="translate(${UM} ${WW[0] + 70})">
          <rect x="${-abzeichenBreite("Legionellen") / 2}" y="-15" width="${abzeichenBreite("Legionellen")}" height="30" rx="15"
                fill="#2B1240" stroke="#A855F7" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("legionellen")}</text>
        </g>
        <g id="dhwheater-badge" class="badge" transform="translate(${UM + 120} ${WW[0] + 70})">
          <rect x="${-abzeichenBreite("Heizstab") / 2}" y="-15" width="${abzeichenBreite("Heizstab")}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>`);

    /* ---------------- Sekundaerkreis und Heizkreise ---------------- */
    const sekundaer = `
      ${mitPuffer ? rohr(`M${P.U2} ${ABZW_VL} H ${P.S_VL} V ${letzt.vy}`) : anzahl > 1 ? rohr(`M${P.S_VL} ${a1.vy} V ${letzt.vy}`) : ""}
      ${mitPuffer ? rohr(`M${P.U1} ${ABZW_RL} H ${P.S_RL} V ${letzt.ry}`) : anzahl > 1 ? rohr(`M${P.S_RL} ${a1.ry} V ${letzt.ry}`) : ""}
      <path class="flowdots" id="dots-sf-a" d="M${mitPuffer ? P.U2 : P.X_VL} ${ABZW_VL} H ${P.S_VL} V ${a1.vy}"/>
      <path class="flowdots" id="dots-sr-a" d="M${P.S_RL} ${a1.ry} V ${ABZW_RL} H ${mitPuffer ? P.U1 : P.X_RL}"/>
      ${an.slice(1).map((z, i) => {
        // Abschnitt vom vorigen zum naechsten Heizkreis. Er laeuft nur,
        // wenn dieser oder ein weiter unten liegender Kreis laeuft.
        const k = i + 2;
        const id = k === 2 ? "" : String(k);
        return `<path class="flowdots" id="dots-sf-b${id}" d="M${P.S_VL} ${an[i].vy} V ${z.vy}"/>
      <path class="flowdots" id="dots-sr-b${id}" d="M${P.S_RL} ${z.ry} V ${an[i].ry}"/>`;
      }).join("")}`;

    const heizkreis = (n, y1, y2) => {
      // Heizkoerper links, Name und Werte rechts daneben frei ohne Kasten.
      const kr = P.U1 + 180;
      const tx = Math.round((kr + P.U2) / 2) + 4;
      // Die Fussbodenheizung bekommt ihre Anschluesse auf Hoehe der
      // ersten und letzten Rohrreihe, sonst laeuft das Rohr doppelt.
      const { vy, ry } = anschluss(n, y1, y2);
      // Ohne Puffer haengt HK1 direkt am Primaerkreis. Ein durchgehendes
      // Rohr vermeidet die Naht zwischen zwei Rohrstuecken.
      const direkt = !mitPuffer && n === 1;
      const koerper = this._heizkoerper(n, P.U1, kr, y1 + 10, y2 - 10,
        { x: kr + 6, y: vy, seite: "rechts" }, { x: P.U1 - 6, y: ry, seite: "links" });
      return `
        ${rohr(`M${direkt ? P.X_VL : P.S_VL} ${vy} H ${kr + 9}`)}
        ${rohr(`M${P.U1 - 9} ${ry} H ${direkt ? P.X_RL : P.S_RL}`)}
        <path class="flowdots" id="dots-hk${n}" d="M${P.S_VL} ${vy} H ${kr + 9}"/>
        <path class="flowdots" id="dots-hk${n}b" d="M${P.U1 - 9} ${ry} H ${P.S_RL}"/>
        <g class="circuit klickbar" id="hk${n}-group">
          <g id="hk${n}-rad">${koerper}
          </g>
          <g id="hk${n}-name">
            <text class="cap" x="${tx}" y="${y1 + 88}" text-anchor="middle">${escapeHtml(
              this._name(`label_hk${n}`)
            )}</text>
          </g>
          <g id="hk${n}-tag">
            <text class="tag-v hk-wert" id="hk${n}-water-v" x="${tx}" y="${y1 + 118}" text-anchor="middle">--</text>
          </g>
          <g transform="translate(${(P.U2 + P.S_VL) / 2} ${vy})">
            <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
            <g class="rotor" id="hk${n}-rotor">
              <path id="hk${n}-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
              <circle r="3.5" fill="#0D1219"/>
            </g>
          </g>
          <text class="value-s" id="hk${n}-pump-v" x="${(P.U2 + P.S_VL) / 2}" y="${vy + 40}"
                text-anchor="middle">--</text>
        </g>`;
    };

    /* ---------------- Zirkulation ---------------- */
    const zirk = `
      <g id="zirkulation-group" opacity="0">
        ${rohr(`M${P.U2} ${WW[0] + 130} H ${P.U2 + 90} M${P.U2 + 90} ${WW[0] + 130} V ${WW[1] - 30} M${P.U2 + 90} ${WW[1] - 30} H ${P.U2}`)}
        <path class="flowdots" id="dots-zirk-h1" d="M${P.U2} ${WW[0] + 130} H ${P.U2 + 90}"/>
        <path class="flowdots" id="dots-zirk-v" d="M${P.U2 + 90} ${WW[0] + 130} V ${WW[1] - 30}"/>
        <path class="flowdots" id="dots-zirk-h2" d="M${P.U2 + 90} ${WW[1] - 30} H ${P.U2}"/>
        <g transform="translate(${P.U2 + 90} ${(WW[0] + WW[1]) / 2 + 50})">
          <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="zirk-rotor">
            <path id="zirk-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
            <circle r="3.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="cap-s" id="zirk-name" x="${P.U2 + 90}" y="${WW[0] + 100}" text-anchor="middle">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${P.U2 + 90}" y="${WW[0] + 118}" text-anchor="middle" opacity="0">--</text>
      </g>`;

    return `
    <svg viewBox="0 0 ${P.W} ${HOEHE}" class="lhc-svg" role="img"
         preserveAspectRatio="xMidYMid meet">
      ${this._defs()}
      ${kopf}
      ${kennzahlen}
      ${(() => {
        const w = clamp(Number(this._config.history_width) || 450, 250, 700);
        const breit = clamp(w, 240, 360);
        return this._verlaufAlsKnopf()
          ? this._diaKnoepfe(740 - breit, 420, breit, true)
          : this._verlaufRahmen(740 - breit, 420, breit, 260);
      })()}

      ${leitungen}
      ${mitPuffer ? puffer : ""}
      ${sekundaer}
      ${QZ ? this._quellenHoch(quellen, UM, PUF[1], QZ) : ""}
      ${HKS.map((z, i) => heizkreis(i + 1, z[0], z[1])).join("")}
      ${warmwasser}
      ${zirk}
    </svg>`;
  },

  /**
   * Kamin und Solarthermie im Hochformat: nebeneinander unter dem Puffer,
   * jeweils mit eigenem Vor- und Ruecklauf von unten in den Puffer.
   */
  _quellenHoch(quellen, mitte, pufferUnten, zeile) {
    const yc = zeile[0] + 92;
    const lagen = quellen.length === 2 ? [mitte - 82, mitte + 82] : [mitte];
    return quellen
      .map((art, i) => {
        const cx = lagen[i];
        const geraetOben = art === "kamin" ? yc - 46 : yc - 40;
        const vl = `M${cx - 18} ${geraetOben} V ${pufferUnten}`;
        const rl = `M${cx + 18} ${pufferUnten} V ${geraetOben}`;
        const pumpY = Math.round((pufferUnten + geraetOben) / 2);
        return `
      <g class="quelle" id="${art}-group">
        <path class="pipe-shell duenn" d="${vl} ${rl}"/>
        <path class="pipe duenn" id="pipe-${art}-vl" d="${vl}"/>
        <path class="pipe duenn" id="pipe-${art}-rl" d="${rl}"/>
        <path class="flowdots duenn" id="dots-${art}" d="${vl}"/>
        <path class="flowdots duenn" id="dots-${art}b" d="${rl}"/>
        <g transform="translate(${cx + 18} ${pumpY})">
          <circle r="13" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="${art}-rotor">
            <path id="${art}-blade" d="M0 -7 L2 -2 L8 0 L2 2 L0 7 L-2 2 L-8 0 L-2 -2 Z" fill="#55637A"/>
            <circle r="2.2" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="${art}-pump-v" x="${cx + 36}" y="${pumpY + 5}" text-anchor="start">--</text>
        ${art === "kamin" ? this._kaminBild(cx, yc) : this._solarBild(cx, yc)}
        <text class="cap" id="${art}-name" x="${cx}" y="${yc + 84}" text-anchor="middle">${this._t(art === "kamin" ? "kamin" : "solarthermie")}</text>
        <text class="tag-v hk-wert" id="${art}-v" x="${cx}" y="${yc + 110}" text-anchor="middle">--</text>

      </g>`;
      })
      .join("");
  },
};
