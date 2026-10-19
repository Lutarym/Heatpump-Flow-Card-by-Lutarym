/**
 * Heizkurven-Dialog.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
import { clamp, dezimalFuer, escapeHtml, fmt, numState, setzeDezimal, stellbar } from "../hilfsfunktionen.js";
import { tf } from "../texte.js";

export const heizkurveKarte = {
  /**
   * Ein Heizkurvendiagramm fuer das grosse Fenster. Jede Zone bekommt
   * ein eigenes, sie stehen nebeneinander und lassen sich vergleichen.
   */
  _kurveBild(z) {
    const B = 420;
    const H = 230;
    const links = 62;
    const rechts = B - 14;
    const oben = 18;
    const unten = H - 40;
    const striche = (n, pre, waag) =>
      [...Array(n).keys()]
        .map(
          (i) => `
        <line id="kd${z}-g${pre}${i}" ${
            waag
              ? `x1="${links}" x2="${rechts}" y1="0" y2="0"`
              : `y1="${oben}" y2="${unten}" x1="0" x2="0"`
          } stroke="#212B39" stroke-width="1" opacity="0"/>
        <text class="${waag ? "achse-vl" : "achse-aussen"}" id="kd${z}-t${pre}${i}" ${
            waag
              ? `x="${links - 8}" y="0" text-anchor="end"`
              : `y="${H - 22}" x="0" text-anchor="middle"`
          } opacity="0">--</text>`
        )
        .join("");
    return `
      <svg viewBox="0 0 ${B} ${H}" class="lhc-kurve-svg" xmlns="http://www.w3.org/2000/svg">
        ${striche(9, "x", false)}
        ${striche(8, "y", true)}
        <line x1="${links}" y1="${oben}" x2="${links}" y2="${unten}"
              stroke="#FF8A5F" stroke-width="1.5" opacity="0.65"/>
        <line x1="${links}" y1="${unten}" x2="${rechts}" y2="${unten}"
              stroke="#6BB7E8" stroke-width="1.5" opacity="0.65"/>
        <line id="kd${z}-mx" x1="0" y1="${oben}" x2="0" y2="${unten}" stroke="#46C07A"
              stroke-width="2" stroke-dasharray="5 4" opacity="0"/>
        <line id="kd${z}-my" x1="${links}" y1="0" x2="0" y2="0" stroke="#FF8A5F"
              stroke-width="1.5" stroke-dasharray="4 4" opacity="0"/>
        <path id="kd${z}-linie" fill="none" stroke="#E8EDF4" stroke-width="3"
              stroke-linecap="round" d=""/>
        <circle id="kd${z}-e1" r="5" fill="#E8EDF4" opacity="0"/>
        <circle id="kd${z}-e2" r="5" fill="#E8EDF4" opacity="0"/>
        <text class="kurve-marke-t ist-jetzt" id="kd${z}-mxt" x="0" y="${unten - 8}"
              text-anchor="middle" opacity="0">--</text>
        <text class="kurve-marke-t achse-vl" id="kd${z}-myt" x="${links + 8}" y="0"
              opacity="0">--</text>
        <text class="kurve-achse achse-aussen" x="${(links + rechts) / 2}" y="${H - 4}"
              text-anchor="middle">${this._t("aussen_achse")}</text>
        <text class="kurve-achse achse-vl" x="18" y="${(oben + unten) / 2}" text-anchor="middle"
              transform="rotate(-90 18 ${(oben + unten) / 2})">${this._t("vorlauf_achse")}</text>
      </svg>`;
  },

  /** Die vier Eckwerte je Heizkreis als Steller. */
  _kurveRegler() {
    setzeDezimal(dezimalFuer(this._sp()));
    const sr = this.shadowRoot;
    if (!sr) return;
    // Die Farbe entspricht der jeweiligen Achse im Diagramm.
    const zeilen = [
      { basis: "o_low", titel: "f_aussen_kalt", min: -20, max: 15, farbe: "aussen" },
      { basis: "t_high", titel: "f_dann_vorlauf", min: 20, max: 75, farbe: "vl" },
      { basis: "o_high", titel: "f_aussen_warm", min: -20, max: 25, farbe: "aussen" },
      { basis: "t_low", titel: "f_dann_vorlauf", min: 20, max: 75, farbe: "vl" },
    ];
    [1, 2].forEach((z) => {
      const box = sr.getElementById(`kd${z}-regler`);
      if (!box) return;
      if (!box.dataset.fertig) {
        box.innerHTML = zeilen
          .map(
            (r, i) => `
            <div class="lhc-num-kompakt ist-${r.farbe}">
              <span>${escapeHtml(this._t(r.titel))}</span>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-minus">&minus;</button>
              <output id="kd${z}-r${i}">--</output>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-plus">+</button>
            </div>`
          )
          .join("");
        zeilen.forEach((r, i) => {
          const feld = z === 2 ? `curve2_${r.basis}` : `curve_${r.basis}`;
          const stelle = (richtung) => {
            const id = this._e(feld);
            if (!id) return;
            const ist = numState(this._quelle, id);
            const geh = this._gehaltenerWert(id, ist);
            const jetzt = geh !== null ? geh : ist;
            if (jetzt === null) return;
            const neu = clamp(jetzt + richtung, r.min, r.max);
            if (neu === jetzt) return;
            this._halte(id, neu);
            if (stellbar(id)) {
              this._quelle.callService(id.split(".")[0], "set_value", {
                entity_id: id,
                value: neu,
              });
            } else {
              const w = (b2) => {
                const wid = this._e(z === 2 ? `curve2_${b2}` : `curve_${b2}`);
                const wist = numState(this._quelle, wid);
                const wgeh = this._gehaltenerWert(wid, wist);
                return wgeh !== null ? wgeh : wist;
              };
              const werte = {
                t_high: w("t_high"), t_low: w("t_low"),
                o_high: w("o_high"), o_low: w("o_low"),
              };
              werte[r.basis] = neu;
              if (Object.values(werte).some((v) => v === null)) return;
              this._quelle.callService("mqtt", "publish", {
                topic: `${this._config.mqtt_prefix || "panasonic_heat_pump"}/commands/SetCurves`,
                payload: JSON.stringify({
                  [`zone${z}`]: {
                    heat: {
                      target: { high: werte.t_high, low: werte.t_low },
                      outside: { high: werte.o_high, low: werte.o_low },
                    },
                  },
                }),
              });
            }
            this._kurveRegler();
            this._zeichneKurveDialog();
          };
          const m = sr.getElementById(`kd${z}-r${i}-minus`);
          const pl = sr.getElementById(`kd${z}-r${i}-plus`);
          if (m) m.addEventListener("click", () => stelle(-1));
          if (pl) pl.addEventListener("click", () => stelle(1));
        });
        box.dataset.fertig = "1";
      }
      zeilen.forEach((r, i) => {
        const feld = z === 2 ? `curve2_${r.basis}` : `curve_${r.basis}`;
        const id = this._e(feld);
        const ist = numState(this._quelle, id);
        const geh = this._gehaltenerWert(id, ist);
        const wert = geh !== null ? geh : ist;
        const out = sr.getElementById(`kd${z}-r${i}`);
        if (out) out.textContent = wert === null ? "--" : `${fmt(wert, 0)} °C`;
        const kann = Boolean(id);
        [`kd${z}-r${i}-minus`, `kd${z}-r${i}-plus`].forEach((kid) => {
          const k = sr.getElementById(kid);
          if (k) k.disabled = !kann;
        });
      });
    });
  },

  /** Oeffnet das grosse Heizkurvenfenster. */
  _oeffneKurve(zone) {
    const d = this.shadowRoot && this.shadowRoot.getElementById("kurve-dialog");
    if (!d) return;
    // Jeder Heizkreis zeigt nur seine eigene Kurve.
    this._kurveNur = zone || 1;
    const t = this.shadowRoot.getElementById("kurve-haupttitel");
    if (t) {
      const name =
        this._name(`label_hk${this._kurveNur}`);
      t.textContent = `${this._t("f_heizkurve")} ${name}`;
    }
    this._kurveRegler();
    this._zeichneKurveDialog();
    d.hidden = false;
  },

  /** Zeichnet beide Heizkurven im grossen Fenster. */
  _zeichneKurveDialog() {
    setzeDezimal(dezimalFuer(this._sp()));
    const sr = this.shadowRoot;
    if (!sr || !sr.getElementById("kurve-dialog")) return;
    const B = 420, H = 230, links = 62, rechts = B - 14, oben = 18, unten = H - 40;
    const A_MIN = Number(this._config.curve_x_min);
    const A_MAX = Number(this._config.curve_x_max);
    const T_MIN = Number(this._config.curve_y_min);
    const T_MAX = Number(this._config.curve_y_max);
    if (!(A_MAX > A_MIN) || !(T_MAX > T_MIN)) return;
    const px = (a) => links + ((clamp(a, A_MIN, A_MAX) - A_MIN) / (A_MAX - A_MIN)) * (rechts - links);
    const py = (t) => unten - ((clamp(t, T_MIN, T_MAX) - T_MIN) / (T_MAX - T_MIN)) * (unten - oben);
    const schritt = (bereich, hoechstens) =>
      [1, 2, 5, 10, 15, 20, 25].find((s) => s >= bereich / hoechstens) || 25;
    const marken = (min, max, anzahl) => {
      const s = schritt(max - min, anzahl);
      const raus = [];
      for (let v = Math.ceil(min / s) * s; v <= max + 0.001; v += s) raus.push(v);
      return raus;
    };
    const aussen = numState(this._quelle, this._e("outside_temp"));

    [1, 2].forEach((z) => {
      const feld = (basis) => (z === 2 ? `curve2_${basis}` : `curve_${basis}`);
      const lies = (basis) => {
        const id = this._e(feld(basis));
        const ist = numState(this._quelle, id);
        const geh = this._gehaltenerWert(id, ist);
        return geh !== null ? geh : ist;
      };
      const tHoch = lies("t_high");
      const tTief = lies("t_low");
      const aHoch = lies("o_high");
      const aTief = lies("o_low");
      const spalte = sr.getElementById(`kd${z}-linie`).closest(".lhc-kurve-spalte");
      const fehlt = [tHoch, tTief, aHoch, aTief].some((v) => v === null);
      if (spalte)
        spalte.hidden =
          fehlt ||
          (z === 2 && this._config.hk_count < 2) ||
          (this._kurveNur && this._kurveNur !== z);
      if (fehlt) return;

      const setz = (id, attrs, text) => {
        const el = sr.getElementById(id);
        if (!el) return;
        Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
        if (text !== undefined) el.textContent = text;
      };
      const achse = (werte, vorrat, pre, waag) => {
        for (let i = 0; i < vorrat; i++) {
          const li = sr.getElementById(`kd${z}-g${pre}${i}`);
          const tx = sr.getElementById(`kd${z}-t${pre}${i}`);
          if (!li || !tx) continue;
          if (i >= werte.length) {
            li.setAttribute("opacity", "0");
            tx.setAttribute("opacity", "0");
            continue;
          }
          const v = werte[i];
          const pos = waag ? py(v) : px(v);
          if (waag) {
            li.setAttribute("y1", pos.toFixed(1));
            li.setAttribute("y2", pos.toFixed(1));
            tx.setAttribute("y", (pos + 4).toFixed(1));
          } else {
            li.setAttribute("x1", pos.toFixed(1));
            li.setAttribute("x2", pos.toFixed(1));
            tx.setAttribute("x", pos.toFixed(1));
          }
          li.setAttribute("opacity", "1");
          tx.setAttribute("opacity", "1");
          tx.textContent = fmt(v, 0);
        }
      };
      achse(marken(A_MIN, A_MAX, 8), 9, "x", false);
      achse(marken(T_MIN, T_MAX, 7), 8, "y", true);

      // Die Kennlinie ist durchgehend gerade. Sie wird ueber die ganze
      // Skala verlaengert und dort abgeschnitten, wo sie den oberen
      // oder unteren Rand verlaesst.
      const steigung = (tTief - tHoch) / (aHoch - aTief);
      const tBei = (a) => tHoch + steigung * (a - aTief);
      const aBei = (t) => aTief + (t - tHoch) / steigung;
      let a1 = A_MIN;
      let a2 = A_MAX;
      if (steigung !== 0) {
        if (tBei(a1) > T_MAX) a1 = aBei(T_MAX);
        if (tBei(a1) < T_MIN) a1 = aBei(T_MIN);
        if (tBei(a2) < T_MIN) a2 = aBei(T_MIN);
        if (tBei(a2) > T_MAX) a2 = aBei(T_MAX);
      }
      a1 = clamp(a1, A_MIN, A_MAX);
      a2 = clamp(a2, A_MIN, A_MAX);
      setz(`kd${z}-linie`, {
        d:
          `M${px(a1).toFixed(1)} ${py(tBei(a1)).toFixed(1)}` +
          `L${px(a2).toFixed(1)} ${py(tBei(a2)).toFixed(1)}`,
      });
      setz(`kd${z}-e1`, { cx: px(aTief).toFixed(1), cy: py(tHoch).toFixed(1), opacity: "1" });
      setz(`kd${z}-e2`, { cx: px(aHoch).toFixed(1), cy: py(tTief).toFixed(1), opacity: "1" });
      setz(`kd${z}-titel`, {}, `${this._t("heizkreis")} ${z}`);

      if (aussen === null) {
        ["mx", "my", "mxt", "myt"].forEach((s) => setz(`kd${z}-${s}`, { opacity: "0" }));
        setz(`kd${z}-aussen`, {}, "--");
        setz(`kd${z}-soll`, {}, "");
        return;
      }
      // Linear, ohne Begrenzung auf die Eckpunkte.
      const soll = tBei(aussen);
      // Der Punkt sitzt bei der tatsaechlichen Aussentemperatur, auch
      // auf den waagerechten Abschnitten ausserhalb der Eckwerte.
      const mx = px(aussen);
      const my = py(soll);
      // Die Linie der Aussentemperatur laeuft ueber die ganze Hoehe.
      setz(`kd${z}-mx`, {
        x1: mx.toFixed(1), x2: mx.toFixed(1),
        y1: oben, y2: unten, opacity: "0.85",
      });
      setz(`kd${z}-my`, { x2: mx.toFixed(1), y1: my.toFixed(1), y2: my.toFixed(1), opacity: "0.6" });
      setz(`kd${z}-mxt`, { x: mx.toFixed(1), opacity: "1" }, `${fmt(aussen, 1)} °C`);
      setz(`kd${z}-myt`, { y: (my - 8).toFixed(1), opacity: "1" }, `${fmt(soll, 0)} °C`);
      setz(`kd${z}-aussen`, {}, tf(this._t("s_aussen"), { v: fmt(aussen, 1) }));
      setz(`kd${z}-soll`, {}, tf(this._t("s_vorlauf_soll"), { v: fmt(soll, 0) }));
    });
  },

  /** Aufbau des grossen Heizkurvenfensters. */
  _kurveDialogMarkup() {
    const spalte = (z) => `
      <div class="lhc-kurve-spalte">
        <div class="lhc-kurve-kopf">
          <span id="kd${z}-titel">${this._t("heizkreis")} ${z}</span>
          <span class="lhc-kurve-soll">
            <span class="ist-jetzt-html" id="kd${z}-aussen">--</span>
            <span class="vl-html" id="kd${z}-soll">--</span>
          </span>
        </div>
        ${this._kurveBild(z)}
        <div class="lhc-kurve-regler" id="kd${z}-regler"></div>
      </div>`;
    return `
      <div class="lhc-dialog" id="kurve-dialog" hidden>
        <div class="lhc-kurve-box">
          <div class="lhc-kurve-titel">
            <span id="kurve-haupttitel">${this._t("f_heizkurve")}</span>
            <button type="button" class="lhc-dialog-close" id="kurve-zu"
                    aria-label="${this._t("f_schliessen")}">&times;</button>
          </div>
          <div class="lhc-kurve-reihe" id="kurve-reihe">
            ${spalte(1)}${spalte(2)}
          </div>
        </div>
      </div>`;
  },
};
