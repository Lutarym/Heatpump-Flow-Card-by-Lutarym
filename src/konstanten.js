/**
 * Feste Werte: Version, Zeichenraster, Farbskalen, Zeiten, Bezeichnungen der Betriebsarten.
 * Teil der Heatpump Flow Card by Lutarym. Gebaut wird mit "npm run build".
 */
/**
 * Heatpump Flow Card by Lutarym (heatpump-flow-card-by-lutarym)
 * https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym
 *
 * Copyright (C) 2026 Lutarym (Stephan Fröbe)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
export const CARD_VERSION = "5.1.0";

/* ------------------------------------------------------------------ *
 *  Zeichenraster
 * ------------------------------------------------------------------ */
export const L = {
  W: 1650,
  H: 700,
  FLOW_Y: 240,
  RET_Y: 700,
  TANK_TOP: 290,
  TANK_BOTTOM: 640,
  RAD_TOP: 400,
  RAD_BOTTOM: 580,
  SEC_FLOW: 320,
  SEC_RET: 620,
  UNIT_TOP: 120,
  UNIT_BOTTOM: 760,
  CAP_Y: 768,
  SG_Y: 104,

  /* Waagerechte Ankerpunkte der Baugruppen. Sie legen fest, wo die
     Einheiten nebeneinander stehen, und sind die Stellschrauben, wenn
     die Karte einmal ein anderes Seitenverhaeltnis bekommen soll. */
  X_PIPE_L: 340,
  X_COL: 445,
  X_BUF: 540,
  X_BUF_C: 635,
  X_HK1_A: 820,
  X_HK1_B: 1040,
  X_HK1_DROP: 870,
  X_HK1_BACK: 990,
  X_HK2_A: 1110,
  X_HK2_B: 1330,
  X_HK2_DROP: 1160,
  X_HK2_BACK: 1280,
  X_ZIRK: 1370,
  X_PRESS: 1390,
  X_DHW: 1430,
  X_DHW_C: 1525,
}

/* ------------------------------------------------------------------ *
 *  Klartexte
 *
 *  Alle englischen Kuerzel der Firmware werden uebersetzt.
 *  DHW steht fuer Domestic Hot Water, also Trinkwarmwasser.
 *  Quelle der Originaltexte: HeishaMon decode.h.
 * ------------------------------------------------------------------ */
export const MODE_LABELS = {
  // Auswahlwerte der Integration
  mode_0: "Nur Heizen",
  mode_1: "Nur Kühlen",
  mode_2: "Automatik Heizen",
  mode_3: "Nur Warmwasser",
  mode_4: "Heizen und Warmwasser",
  mode_5: "Kühlen und Warmwasser",
  mode_6: "Automatik Heizen und Warmwasser",
  // Originaltexte der Firmware
  Heat: "Nur Heizen",
  Cool: "Nur Kühlen",
  "Auto(heat)": "Automatik Heizen",
  DHW: "Nur Warmwasser",
  "Heat+DHW": "Heizen und Warmwasser",
  "Cool+DHW": "Kühlen und Warmwasser",
  "Auto(heat)+DHW": "Automatik Heizen und Warmwasser",
  "Auto(cool)": "Automatik Kühlen",
  "Auto(cool)+DHW": "Automatik Kühlen und Warmwasser",
  // Rohe Zahlenwerte von TOP4
  0: "Nur Heizen",
  1: "Nur Kühlen",
  2: "Automatik Heizen",
  3: "Nur Warmwasser",
  4: "Heizen und Warmwasser",
  5: "Kühlen und Warmwasser",
  6: "Automatik Heizen und Warmwasser",
  7: "Automatik Kühlen",
  8: "Automatik Kühlen und Warmwasser",
};

export const QUIET_LABELS = {
  mode_0: "Aus", mode_1: "Stufe 1", mode_2: "Stufe 2", mode_3: "Stufe 3",
  0: "Aus", 1: "Stufe 1", 2: "Stufe 2", 3: "Stufe 3",
};

export const POWERFUL_LABELS = {
  mode_0: "Aus", mode_1: "30 Minuten", mode_2: "60 Minuten", mode_3: "90 Minuten",
  0: "Aus", 1: "30 Minuten", 2: "60 Minuten", 3: "90 Minuten",
};

export const VALVE_LABELS = { Room: "Heizung", DHW: "Warmwasser", 0: "Heizung", 1: "Warmwasser" };

/* ------------------------------------------------------------------ *
 *  SG Ready
 *
 *  Vier Betriebszustaende nach der Schnittstellenbeschreibung des
 *  Bundesverbands Waermepumpe. Klemmenloesung ueber zwei Kontakte,
 *  K1 Sperre und K2 Anlauf:
 *  1:0 Zustand 1, 0:0 Zustand 2, 0:1 Zustand 3, 1:1 Zustand 4.
 * ------------------------------------------------------------------ */
/**
 * Luft oberhalb der Anlage. Der Ausschnitt beginnt um diesen Betrag
 * hoeher, dadurch ruecken alle Bauteile nach unten. Der Verlauf oben
 * rechts wird um denselben Betrag angehoben und bleibt dort stehen.
 */
export const LUFT = 30;

export const SG_STATES = {
  1: { kurz: "sg1_kurz", lang: "sg1_lang", farbe: "#FF6B5E" },
  2: { kurz: "sg2_kurz", lang: "sg2_lang", farbe: "#C3D0E0" },
  3: { kurz: "sg3_kurz", lang: "sg3_lang", farbe: "#FFC44D" },
  4: { kurz: "sg4_kurz", lang: "sg4_lang", farbe: "#5BE08F" },
};

/* ------------------------------------------------------------------ *
 *  Thermische Farbskala
 * ------------------------------------------------------------------ */
export const THERMAL_STOPS = [
  { p: 0.0, c: [29, 78, 216] },
  { p: 0.3, c: [6, 166, 199] },
  { p: 0.55, c: [242, 178, 51] },
  { p: 0.78, c: [238, 122, 43] },
  { p: 1.0, c: [214, 43, 43] },
];

export const NEUTRAL = "#46536A";

/* ------------------------------------------------------------------ *
 *  Farbskala fuer die Verdichterlast
 *  Gruen bei geringer, rot bei hoher Drehzahl. Die Grenzen stammen
 *  aus der Anlage: 16 Hz ist die kleinste, 90 Hz die groesste Drehzahl.
 * ------------------------------------------------------------------ */
// Normalbereich des Wasserdrucks laut Panasonic fuer Aquarea.
export const DRUCK_MIN = 0.5;

export const DRUCK_MAX = 3.0;

export const COMP_MIN_HZ = 16;

export const COMP_MAX_HZ = 90;

export const LOAD_STOPS = [
  { p: 0.0, c: [91, 224, 143] },
  { p: 0.4, c: [255, 196, 77] },
  { p: 0.7, c: [224, 118, 46] },
  { p: 1.0, c: [255, 107, 94] },
];

// Pumpen drehen bewusst langsam und immer gleich schnell. Sie sollen
// nur zeigen, dass sie foerdern, nicht wie schnell.
export const PUMP_SECONDS = 3;

// Wie lange ein selbst gesetzter Wert stehen bleibt, bis die Anlage nachzieht.
export const HOLD_MS = 12000;

// Vorrat an Blasen je Speicher. Sichtbar ist ein Anteil davon.
export const BUBBLE_COUNT = 14;

// Die Steigdauer einer Blase haengt allein von ihrem Index ab. Sie wird
// beim ersten Zugriff berechnet und danach nur noch nachgeschlagen.
export const BUBBLE_DAUER = [];

// Im Demomodus gehoeren Schaltbefehl und Rueckmeldetopic zusammen.
// Wird das eine gesetzt, folgt das andere.
export const DEMO_PAARE = {
  power_state: "heatpump_state",
  heatpump_state: "power_state",
  dhw_force: "dhw_force_state",
  dhw_force_state: "dhw_force",
  force_defrost: "defrost",
  defrost: "force_defrost",
  force_sterilization: "sterilization_state",
  sterilization_state: "force_sterilization",
  dhw_heater_switch: "dhw_heater",
  dhw_heater: "dhw_heater_switch",
  room_heater_switch: "room_heater",
  room_heater: "room_heater_switch",
  buffer_switch: "buffer_installed",
  buffer_installed: "buffer_switch",
};
