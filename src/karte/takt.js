/**
 * Takt: gleicht die Animationszustaende (this._animState, gesetzt in
 * aktualisieren.js und solar.js) mit Animationen der Kacheln ab
 * (kacheln.js). Diese Animationen spielt der Browser selbst ab, ohne den
 * Hauptthread der Seite. Sie laufen darum gleichmaessig weiter, auch wenn
 * Home Assistant oder eine andere Karte gerade rechnet.
 *
 * Bewegungen, die keine Kachel haben (Solareffekte, Sonderfaelle), zeichnet
 * weiter die Animationsschleife in karte.js.
 *
 * Alle Bewegungen mit fester Dauer rechnen ab demselben Zeitpunkt wie die
 * Schleife (this._animUrsprung, beim Aufbau gesetzt). So laufen etwa alle
 * Laufstriche im Gleichtakt.
 */

import { animationAn, bubbleDauer, clamp } from "../hilfsfunktionen.js";
import { fensterSchritte, UMLAUF_MS } from "./kacheln.js";

// Flackern des Kaminfeuers wie in karte.js:
//   Neigung  3 * sin(6,3 t) Grad
//   Breite   1 - 0,05 * sin(11,7 t + 0,7)
//   Hoehe    1 + 0,09 * sin(9,1 t) + 0,05 * sin(14,3 t + 1,3)
// Jede Groesse wiederholt sich genau: 2 pi / 6,3 s, 2 pi / 11,7 s und
// 2 pi / 1,3 s (9,1 und 14,3 sind 7 und 11 mal 1,3). Abgetastet mit 48
// und 240 Stuetzstellen, dazwischen gerade. Die Abweichung bleibt unter
// 0,01 Grad und 0,1 Prozent.
const ZWEI_PI = 2 * Math.PI;
let flackerKf = null;
function flacker() {
  if (flackerKf) return flackerKf;
  const reihe = (n, f) => Array.from({ length: n + 1 }, (_, j) => f((ZWEI_PI * j) / n));
  flackerKf = [
    { dauer: (ZWEI_PI / 6.3) * 1000, kf: reihe(48, (w) => ({ transform: `skewX(${(3 * Math.sin(w)).toFixed(4)}deg)` })) },
    { dauer: (ZWEI_PI / 11.7) * 1000, kf: reihe(48, (w) => ({ transform: `scaleX(${(1 - 0.05 * Math.sin(w + 0.7)).toFixed(5)})` })) },
    { dauer: (ZWEI_PI / 1.3) * 1000, kf: reihe(240, (w) => ({ transform: `scaleY(${(1 + 0.09 * Math.sin(7 * w) + 0.05 * Math.sin(11 * w + 1.3)).toFixed(5)})` })) },
  ];
  return flackerKf;
}

/** Zeitpunkt der Animationen jetzt. */
const jetzt = () => (document.timeline && typeof document.timeline.currentTime === "number" ? document.timeline.currentTime : performance.now());

/**
 * Startet eine Animation mit festem Startzeitpunkt. Sie wird ueber
 * new Animation(new KeyframeEffect(...)) angelegt und allein durch
 * startTime gestartet. element.animate() spielt sofort ab, ein danach
 * gesetztes startTime bricht dieses Abspielen wieder ab. Die Entwickler
 * von Motion fanden in WebKit auf dem Mac: Mit dieser Folge springt eine
 * beschleunigte Animation beim Tempowechsel, mit new Animation und
 * startTime nicht (github.com/motiondivision/motion, Pull Request 4021).
 */
const MIT_EFFEKT = typeof Animation === "function" && typeof KeyframeEffect === "function";
function starte(ziel, kf, zeit, start) {
  if (!MIT_EFFEKT) {
    const a = ziel.animate(kf, zeit);
    a.startTime = start;
    return a;
  }
  const a = new Animation(new KeyframeEffect(ziel, kf, zeit), document.timeline);
  a.startTime = start;
  return a;
}

/**
 * Lueftertempo: Kleine Aenderungen der Drehzahl lassen die laufende
 * Drehung unveraendert. Neu angelegt wird sie erst, wenn sich die Dauer
 * einer Umdrehung um mehr als diesen Anteil aendert (eigene Festlegung).
 * So wird die Drehung nicht bei jeder neuen Drehzahl ersetzt.
 */
const DREH_SPIEL = 0.15;

export const taktKarte = {
  /** Abgleich nach jeder Aktualisierung, nach dem Bau und bei Sichtwechsel. */
  _ebenenTakt() {
    const e = this._ebenen;
    if (e) {
      const aus = Boolean(this._unsichtbar) || !animationAn(this._config);
      e.kacheln.forEach((k) => this._taktKachel(k, aus));
    }
    if (!this._animLoop && !this._unsichtbar && this._built && this._jsBraucht()) this._startAnimationLoop();
  },

  /** Muss die Schleife in karte.js noch etwas Bild fuer Bild zeichnen? */
  _jsBraucht() {
    if (!this._config || !animationAn(this._config)) return false;
    const e = this._ebenen;
    // Noch nicht geplant oder ohne Ebenen: die Schleife zeichnet alles.
    if (!e) return true;
    for (const [id, s] of this._animState) if (s && !e.komp.has(id)) return true;
    for (const g of ["buf-bubbles", "dhw-bubbles"]) {
      if (e.komp.has(g)) continue;
      const el = this._animEl(g);
      if (el && Array.from(el.children).some((c) => c.style && c.style.animationName !== "none")) return true;
    }
    return false;
  },

  _taktKachel(k, aus) {
    if (k.art === "puls") this._taktPuls(k, aus);
    else if (k.art === "dreh") this._taktDreh(k, aus);
    else if (k.art === "blasen") this._taktBlasen(k, aus);
    else if (k.art === "flacker") this._taktFlacker(k, aus);
    else if (k.art === "strom") this._taktStrom(k, aus);
  },

  _taktPuls(k, aus) {
    const s = aus ? null : this._animState.get(k.id);
    const an = Boolean(s && s.type === "pulse");
    const hoch = an ? clamp(typeof s.max === "number" ? s.max : 1, 0, 1) : 1;
    const tief = an ? clamp(typeof s.min === "number" ? s.min : 0.4, 0, 1) : 1;
    const soll = an ? `${s.duration}|${tief}|${hoch}` : "";
    if (soll === (k.stand || "")) return;
    k.stand = soll;
    if (k.anim) {
      k.anim.cancel();
      k.anim = null;
    }
    if (!an) return;
    const el = k.atom.el;
    // Hat das Attribut nie gewirkt (Regel im Stil hat Vorrang), pulsiert nichts.
    if (!k.wirksam) return;
    // Das Element selbst bleibt voll sichtbar, abgeblendet wird die Kachel.
    el.setAttribute("opacity", "1");
    k.puls = { hoch, tief, dauer: s.duration * 1000 };
    k.anim = starte(k.ziel, [{ opacity: hoch }, { opacity: tief, offset: 0.5 }, { opacity: hoch }],
      { duration: k.puls.dauer, iterations: Infinity }, this._animUrsprung);
  },

  /** Aktuelle Deckkraft einer pulsierenden Kachel (fuer die Tuer). */
  _taktDeckkraft(k) {
    if (!k.anim || !k.puls) return 1;
    const p = (((jetzt() - this._animUrsprung) % k.puls.dauer) + k.puls.dauer) % k.puls.dauer / k.puls.dauer;
    const spanne = k.puls.hoch - k.puls.tief;
    return p < 0.5 ? k.puls.hoch - (p / 0.5) * spanne : k.puls.tief + ((p - 0.5) / 0.5) * spanne;
  },

  /** Aktueller Winkel einer Drehkachel. */
  _taktWinkel(k, zeit) {
    if (!k.anim || !(k.dauer > 0) || typeof k.anim.startTime !== "number") return k.basis || 0;
    const t = typeof zeit === "number" ? zeit : jetzt();
    return (k.basis + (360 * (t - k.anim.startTime)) / (k.dauer * 1000)) % 360;
  },

  /**
   * Drehen. Aendert sich die Drehzahl deutlich (DREH_SPIEL), geht es vom
   * erreichten Winkel mit der neuen Dauer weiter. Die Geschwindigkeit steckt in der Dauer, nicht
   * in playbackRate: WebKit spielt Animationen mit anderer Rate als 1
   * nicht selbst ab.
   */
  _taktDreh(k, aus) {
    const s = aus ? null : this._animState.get(k.id);
    const dauer = s && s.type === "spin" && s.duration > 0 ? s.duration : 0;
    if (dauer === k.dauer && Boolean(k.anim) === dauer > 0) return;
    // Dreht schon und das Tempo aendert sich nur wenig: weiterdrehen.
    if (k.anim && dauer > 0 && k.dauer > 0 && Math.abs(dauer / k.dauer - 1) <= DREH_SPIEL) return;
    const t = jetzt();
    const w = this._taktWinkel(k, t);
    const lief = Boolean(k.anim);
    if (k.anim) {
      k.anim.cancel();
      k.anim = null;
    }
    k.basis = ((w % 360) + 360) % 360;
    k.dauer = dauer;
    if (s && s.type === "spin") s.winkel = k.basis;
    // Der feste Winkel gilt, solange nichts dreht. Wird nur das Tempo
    // gewechselt, bleibt der Stil unberuehrt, es dreht ohne Pause weiter.
    if (!(dauer > 0) || !lief) k.ziel.style.transform = `rotate(${k.basis.toFixed(3)}deg)`;
    if (!(dauer > 0)) return;
    k.anim = starte(k.ziel, [{ transform: `rotate(${k.basis.toFixed(3)}deg)` }, { transform: `rotate(${(k.basis + 360).toFixed(3)}deg)` }],
      { duration: dauer * 1000, iterations: Infinity }, t);
  },

  /** Blasen: jede steigt mit eigener Dauer und Versatz auf (karte.js). */
  _taktBlasen(k, aus) {
    k.blasen.forEach((b) => {
      const soll = !aus && b.orig.style.animationName !== "none";
      if (soll === Boolean(b.anim)) return;
      if (b.anim) {
        b.anim.cancel();
        b.anim = null;
      }
      b.kopie.setAttribute("opacity", soll ? "1" : "0");
      if (!soll) return;
      const h = b.hoch;
      b.anim = starte(b.ziel, [
        { transform: "translateY(0%)", opacity: 0 },
        { transform: `translateY(${(-h * 0.15).toFixed(4)}%)`, opacity: 0.4, offset: 0.15 },
        { transform: `translateY(${(-h * 0.85).toFixed(4)}%)`, opacity: 0.4, offset: 0.85 },
        { transform: `translateY(${(-h).toFixed(4)}%)`, opacity: 0 },
      ], { duration: bubbleDauer(b.idx) * 1000, iterations: Infinity }, this._animUrsprung - b.idx * 300);
    });
  },

  _taktFlacker(k, aus) {
    const s = aus ? null : this._animState.get(k.id);
    const soll = Boolean(s && s.type === "flacker");
    if (soll === Boolean(k.anims)) return;
    if (k.anims) {
      k.anims.forEach((x) => x.cancel());
      k.anims = null;
    }
    if (!soll) return;
    k.anims = flacker().map((f, i) => starte(k.ziele[i], f.kf, { duration: f.dauer, iterations: Infinity }, this._animUrsprung));
  },

  /** Laufstriche: Baender ruecken weiter, Fenster schalten ihre Bilder durch. */
  _taktStrom(k, aus) {
    const s = aus ? null : this._animState.get(k.id);
    const soll = s && s.type === "flow" ? (s.reverse ? "r" : "v") : "";
    if (soll === (k.stand || "")) return;
    k.stand = soll;
    k.teile.forEach((t) => {
      if (t.anim) {
        t.anim.cancel();
        t.anim = null;
      }
    });
    if (!soll) return;
    const rueck = soll === "r";
    k.teile.forEach((t) => {
      let kf;
      if (t.art === "band") {
        const weg = (rueck ? -t.weg : t.weg).toFixed(4);
        kf = t.waag
          ? [{ transform: "translateX(0%)" }, { transform: `translateX(${weg}%)` }]
          : [{ transform: "translateY(0%)" }, { transform: `translateY(${weg}%)` }];
      } else {
        kf = fensterSchritte(t.schritte, rueck);
      }
      t.anim = starte(t.ziel, kf, { duration: UMLAUF_MS, iterations: Infinity }, this._animUrsprung);
    });
  },

  /**
   * Alle Animationen der Kacheln beenden. Erreichte Winkel gehen an die
   * Animationsschleife und an die Rotoren selbst, damit nichts springt.
   */
  _taktAus(e) {
    if (!e) return;
    e.kacheln.forEach((k) => {
      if (k.art === "dreh") {
        const w = this._taktWinkel(k);
        const s = this._animState.get(k.id);
        if (s && s.type === "spin") s.winkel = w;
        if (k.atom && k.atom.el) k.atom.el.setAttribute("transform", `rotate(${w.toFixed(2)} 0 0)`);
      }
      if (k.anim) k.anim.cancel();
      k.anim = null;
      if (k.anims) k.anims.forEach((x) => x.cancel());
      k.anims = null;
      if (k.teile) k.teile.forEach((t) => { if (t.anim) t.anim.cancel(); t.anim = null; });
      if (k.blasen) k.blasen.forEach((b) => { if (b.anim) b.anim.cancel(); b.anim = null; });
      k.stand = "";
    });
  },
};
