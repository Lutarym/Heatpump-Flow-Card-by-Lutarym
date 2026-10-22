// src/konstanten.js
var CARD_VERSION = "5.5.1";
var L = {
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
  X_DHW_C: 1525
};
var MODE_LABELS = {
  // Auswahlwerte der Integration
  mode_0: "Nur Heizen",
  mode_1: "Nur K\xFChlen",
  mode_2: "Automatik Heizen",
  mode_3: "Nur Warmwasser",
  mode_4: "Heizen und Warmwasser",
  mode_5: "K\xFChlen und Warmwasser",
  mode_6: "Automatik Heizen und Warmwasser",
  // Originaltexte der Firmware
  Heat: "Nur Heizen",
  Cool: "Nur K\xFChlen",
  "Auto(heat)": "Automatik Heizen",
  DHW: "Nur Warmwasser",
  "Heat+DHW": "Heizen und Warmwasser",
  "Cool+DHW": "K\xFChlen und Warmwasser",
  "Auto(heat)+DHW": "Automatik Heizen und Warmwasser",
  "Auto(cool)": "Automatik K\xFChlen",
  "Auto(cool)+DHW": "Automatik K\xFChlen und Warmwasser",
  // Rohe Zahlenwerte von TOP4
  0: "Nur Heizen",
  1: "Nur K\xFChlen",
  2: "Automatik Heizen",
  3: "Nur Warmwasser",
  4: "Heizen und Warmwasser",
  5: "K\xFChlen und Warmwasser",
  6: "Automatik Heizen und Warmwasser",
  7: "Automatik K\xFChlen",
  8: "Automatik K\xFChlen und Warmwasser"
};
var QUIET_LABELS = {
  mode_0: "Aus",
  mode_1: "Stufe 1",
  mode_2: "Stufe 2",
  mode_3: "Stufe 3",
  0: "Aus",
  1: "Stufe 1",
  2: "Stufe 2",
  3: "Stufe 3"
};
var POWERFUL_LABELS = {
  mode_0: "Aus",
  mode_1: "30 Minuten",
  mode_2: "60 Minuten",
  mode_3: "90 Minuten",
  0: "Aus",
  1: "30 Minuten",
  2: "60 Minuten",
  3: "90 Minuten"
};
var VALVE_LABELS = { Room: "Heizung", DHW: "Warmwasser", 0: "Heizung", 1: "Warmwasser" };
var LUFT = 30;
var SG_STATES = {
  1: { kurz: "sg1_kurz", lang: "sg1_lang", farbe: "#FF6B5E" },
  2: { kurz: "sg2_kurz", lang: "sg2_lang", farbe: "#C3D0E0" },
  3: { kurz: "sg3_kurz", lang: "sg3_lang", farbe: "#FFC44D" },
  4: { kurz: "sg4_kurz", lang: "sg4_lang", farbe: "#5BE08F" }
};
var THERMAL_STOPS = [
  { p: 0, c: [29, 78, 216] },
  { p: 0.3, c: [6, 166, 199] },
  { p: 0.55, c: [242, 178, 51] },
  { p: 0.78, c: [238, 122, 43] },
  { p: 1, c: [214, 43, 43] }
];
var NEUTRAL = "#46536A";
var DRUCK_MIN = 0.5;
var DRUCK_MAX = 3;
var COMP_MIN_HZ = 16;
var COMP_MAX_HZ = 90;
var LOAD_STOPS = [
  { p: 0, c: [91, 224, 143] },
  { p: 0.4, c: [255, 196, 77] },
  { p: 0.7, c: [224, 118, 46] },
  { p: 1, c: [255, 107, 94] }
];
var PUMP_SECONDS = 3;
var HOLD_MS = 12e3;
var BUBBLE_COUNT = 14;
var BUBBLE_DAUER = [];
var DEMO_PAARE = {
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
  buffer_installed: "buffer_switch"
};

// src/hilfe-daten.js
var HILFE = [{ "id": "grundlagen", "titel": { "de": "Grundlagen", "en": "Basics", "fr": "Notions de base", "ja": "\u57FA\u672C" }, "e": [{ "l": "", "s": "", "b": "", "n": { "de": "Lesen und Schreiben", "en": "Read and write", "fr": "Lecture et \xE9criture", "ja": "\u8AAD\u307F\u53D6\u308A\u3068\u66F8\u304D\u8FBC\u307F" }, "t": { "de": "Jeder Eintrag zeigt, woher der Wert kommt. \u201ELesen\u201C (TOP\u2026) ist ein Wert, den die W\xE4rmepumpe meldet. \u201ESchreiben\u201C (Set\u2026) ist ein Befehl, mit dem HeishaMon etwas an der W\xE4rmepumpe einstellt. Manche Werte kann man nur ansehen, andere auch \xE4ndern.", "en": "Each entry shows where the value comes from. \u201CRead\u201D (TOP\u2026) is a value reported by the heat pump. \u201CWrite\u201D (Set\u2026) is a command HeishaMon uses to change something on the heat pump. Some values can only be viewed, others can also be changed.", "fr": "Chaque entr\xE9e indique l'origine de la valeur. \xAB Lecture \xBB (TOP\u2026) est une valeur transmise par la pompe \xE0 chaleur. \xAB \xC9criture \xBB (Set\u2026) est une commande avec laquelle HeishaMon modifie un r\xE9glage de la pompe. Certaines valeurs sont seulement consultables, d'autres modifiables.", "ja": "\u5404\u9805\u76EE\u306B\u306F\u5024\u306E\u51FA\u3069\u3053\u308D\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u300C\u8AAD\u307F\u53D6\u308A\u300D\uFF08TOP\u2026\uFF09\u306F\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u9001\u3063\u3066\u304F\u308B\u5024\u3067\u3059\u3002\u300C\u66F8\u304D\u8FBC\u307F\u300D\uFF08Set\u2026\uFF09\u306F HeishaMon \u304C\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u8A2D\u5B9A\u3092\u5909\u3048\u308B\u305F\u3081\u306E\u547D\u4EE4\u3067\u3059\u3002\u898B\u308B\u3060\u3051\u306E\u5024\u3068\u3001\u5909\u66F4\u3082\u3067\u304D\u308B\u5024\u304C\u3042\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "", "b": "", "n": { "de": "Vorlauf und R\xFCcklauf", "en": "Flow and return", "fr": "D\xE9part et retour", "ja": "\u5F80\u304D \u3068 \u623B\u308A" }, "t": { "de": "Der Vorlauf ist das warme Wasser, das von der W\xE4rmepumpe zu Heizk\xF6rpern, Fu\xDFbodenheizung oder Speicher flie\xDFt. Der R\xFCcklauf ist das abgek\xFChlte Wasser, das zur\xFCckkommt. Der Unterschied zwischen beiden zeigt, wie viel W\xE4rme abgegeben wurde.", "en": "The flow is the warm water going from the heat pump to radiators, underfloor heating or a tank. The return is the cooled water coming back. The difference between the two shows how much heat was delivered.", "fr": "Le d\xE9part est l'eau chaude qui va de la pompe \xE0 chaleur vers les radiateurs, le plancher chauffant ou le ballon. Le retour est l'eau refroidie qui revient. L'\xE9cart entre les deux montre la quantit\xE9 de chaleur c\xE9d\xE9e.", "ja": "\u5F80\u304D\uFF08\u30D5\u30ED\u30FC\uFF09\u306F\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304B\u3089\u30E9\u30B8\u30A8\u30FC\u30BF\u30FC\u3001\u5E8A\u6696\u623F\u3001\u30BF\u30F3\u30AF\u3078\u6D41\u308C\u308B\u6E29\u6C34\u3067\u3059\u3002\u623B\u308A\uFF08\u30EA\u30BF\u30FC\u30F3\uFF09\u306F\u51B7\u3048\u3066\u623B\u3063\u3066\u304F\u308B\u6C34\u3067\u3059\u3002\u4E21\u8005\u306E\u5DEE\u3067\u3001\u3069\u308C\u3060\u3051\u71B1\u3092\u6E21\u3057\u305F\u304B\u304C\u5206\u304B\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "", "b": "", "n": { "de": "Temperaturunterschied", "en": "Temperature difference", "fr": "\xC9cart de temp\xE9rature", "ja": "\u6E29\u5EA6\u5DEE" }, "t": { "de": "Manche Werte sind keine Temperatur, sondern der Unterschied zwischen zwei Temperaturen. 5 \xB0C Unterschied hei\xDFt zum Beispiel: 40 \xB0C und 35 \xB0C. In Panasonic-Anleitungen und in Home Assistant steht daf\xFCr oft \u201EK\u201C (Kelvin). 1 K ist genau 1 \xB0C Unterschied.", "en": "Some values are not a temperature but the difference between two temperatures. A difference of 5 \xB0C means, for example, 40 \xB0C and 35 \xB0C. Panasonic manuals and Home Assistant often write \u201CK\u201D (kelvin) for this. 1 K is exactly 1 \xB0C of difference.", "fr": "Certaines valeurs ne sont pas une temp\xE9rature mais l'\xE9cart entre deux temp\xE9ratures. Un \xE9cart de 5 \xB0C signifie par exemple 40 \xB0C et 35 \xB0C. Les notices Panasonic et Home Assistant indiquent souvent \xAB K \xBB (kelvin) pour cela. 1 K correspond exactement \xE0 1 \xB0C d'\xE9cart.", "ja": "\u6E29\u5EA6\u305D\u306E\u3082\u306E\u3067\u306F\u306A\u304F\u30012 \u3064\u306E\u6E29\u5EA6\u306E\u5DEE\u3092\u8868\u3059\u5024\u304C\u3042\u308A\u307E\u3059\u30025 \xB0C \u306E\u5DEE\u3068\u306F\u3001\u305F\u3068\u3048\u3070 40 \xB0C \u3068 35 \xB0C \u306E\u3053\u3068\u3067\u3059\u3002Panasonic \u306E\u8AAC\u660E\u66F8\u3084 Home Assistant \u3067\u306F\u300CK\u300D\uFF08\u30B1\u30EB\u30D3\u30F3\uFF09\u3068\u66F8\u304B\u308C\u308B\u3053\u3068\u304C\u3088\u304F\u3042\u308A\u307E\u3059\u30021 K \u306F\u3061\u3087\u3046\u3069 1 \xB0C \u306E\u5DEE\u3067\u3059\u3002" } }, { "l": "", "s": "", "b": "", "n": { "de": "Heizkurve", "en": "Heating curve", "fr": "Courbe de chauffe", "ja": "\u6696\u623F\u66F2\u7DDA" }, "t": { "de": "Die Heizkurve legt fest, wie warm das Heizwasser abh\xE4ngig von der Au\xDFentemperatur sein soll. Ist es drau\xDFen kalt, wird das Wasser w\xE4rmer gemacht, ist es mild, reicht k\xFChleres Wasser. Man stellt sie \xFCber zwei Punkte ein: einen kalten und einen warmen Au\xDFenpunkt mit der jeweils gew\xFCnschten Wassertemperatur.", "en": "The heating curve sets how warm the heating water should be depending on the outdoor temperature. When it is cold outside the water is made warmer, when it is mild cooler water is enough. It is set with two points: a cold and a warm outdoor point, each with the desired water temperature.", "fr": "La courbe de chauffe d\xE9finit la temp\xE9rature de l'eau de chauffage selon la temp\xE9rature ext\xE9rieure. Quand il fait froid, l'eau est plus chaude ; quand il fait doux, une eau moins chaude suffit. Elle se r\xE8gle par deux points : un point ext\xE9rieur froid et un point ext\xE9rieur doux, chacun avec la temp\xE9rature d'eau souhait\xE9e.", "ja": "\u6696\u623F\u66F2\u7DDA\u306F\u3001\u5916\u6C17\u6E29\u306B\u5FDC\u3058\u3066\u6696\u623F\u7528\u306E\u6C34\u3092\u4F55\u5EA6\u306B\u3059\u308B\u304B\u3092\u6C7A\u3081\u307E\u3059\u3002\u5916\u304C\u5BD2\u3044\u3068\u6C34\u3092\u71B1\u304F\u3057\u3001\u7A4F\u3084\u304B\u306A\u3089\u306C\u308B\u3044\u6C34\u3067\u8DB3\u308A\u307E\u3059\u3002\u5BD2\u3044\u5074\u3068\u6696\u304B\u3044\u5074\u306E 2 \u3064\u306E\u5916\u6C17\u6E29\u306E\u70B9\u3068\u3001\u305D\u308C\u305E\u308C\u306E\u6C34\u6E29\u3067\u8A2D\u5B9A\u3057\u307E\u3059\u3002" } }] }, { "id": "betrieb", "titel": { "de": "Betrieb und Betriebsart", "en": "Operation and mode", "fr": "Fonctionnement et mode", "ja": "\u904B\u8EE2\u3068\u904B\u8EE2\u30E2\u30FC\u30C9" }, "e": [{ "l": "TOP0", "s": "SetHeatpump", "b": "0/1", "n": { "de": "W\xE4rmepumpe ein/aus", "en": "Heat pump on/off", "fr": "Pompe \xE0 chaleur marche/arr\xEAt", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7 \u5165/\u5207" }, "t": { "de": "Zeigt, ob die W\xE4rmepumpe eingeschaltet ist, und schaltet sie ein oder aus. Das ist der Hauptschalter, wie die Ein/Aus-Taste an der Fernbedienung.", "en": "Shows whether the heat pump is switched on, and switches it on or off. This is the main switch, like the on/off button on the remote control.", "fr": "Indique si la pompe \xE0 chaleur est en marche et permet de l'allumer ou de l'\xE9teindre. C'est l'interrupteur principal, comme la touche marche/arr\xEAt de la t\xE9l\xE9commande.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u96FB\u6E90\u304C\u5165\u3063\u3066\u3044\u308B\u304B\u3092\u793A\u3057\u3001\u5165\u5207\u3092\u5207\u308A\u66FF\u3048\u307E\u3059\u3002\u30EA\u30E2\u30B3\u30F3\u306E\u904B\u8EE2/\u505C\u6B62\u30DC\u30BF\u30F3\u306B\u3042\u305F\u308B\u4E3B\u30B9\u30A4\u30C3\u30C1\u3067\u3059\u3002" } }, { "l": "TOP4", "s": "SetOperationMode", "b": "0 \u2026 6", "n": { "de": "Betriebsart", "en": "Operating mode", "fr": "Mode de fonctionnement", "ja": "\u904B\u8EE2\u30E2\u30FC\u30C9" }, "t": { "de": "Legt fest, was die W\xE4rmepumpe tun soll: nur Heizen, nur K\xFChlen, Automatik, nur Warmwasser oder Heizen bzw. K\xFChlen zusammen mit Warmwasser. Bei Automatik wechselt sie je nach Au\xDFentemperatur selbst zwischen Heizen und K\xFChlen. Gemeldet werden zus\xE4tzlich 7 und 8, wenn die Automatik gerade k\xFChlt.", "en": "Sets what the heat pump should do: heat only, cool only, automatic, hot water only, or heating or cooling together with hot water. In automatic it switches between heating and cooling by itself depending on the outdoor temperature. Values 7 and 8 are also reported when automatic is currently cooling.", "fr": "D\xE9finit ce que fait la pompe \xE0 chaleur : chauffage seul, rafra\xEEchissement seul, automatique, eau chaude seule, ou chauffage ou rafra\xEEchissement avec eau chaude. En automatique, elle passe d'elle-m\xEAme du chauffage au rafra\xEEchissement selon la temp\xE9rature ext\xE9rieure. Les valeurs 7 et 8 sont aussi transmises quand l'automatique rafra\xEEchit.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u52D5\u4F5C\u3092\u6C7A\u3081\u307E\u3059\uFF1A\u6696\u623F\u306E\u307F\u3001\u51B7\u623F\u306E\u307F\u3001\u81EA\u52D5\u3001\u7D66\u6E6F\u306E\u307F\u3001\u307E\u305F\u306F\u6696\u623F\u30FB\u51B7\u623F\u3068\u7D66\u6E6F\u306E\u7D44\u307F\u5408\u308F\u305B\u3002\u81EA\u52D5\u3067\u306F\u5916\u6C17\u6E29\u306B\u5FDC\u3058\u3066\u6696\u623F\u3068\u51B7\u623F\u3092\u81EA\u52D5\u3067\u5207\u308A\u66FF\u3048\u307E\u3059\u3002\u81EA\u52D5\u3067\u51B7\u623F\u4E2D\u306E\u3068\u304D\u306F 7 \u3068 8 \u3082\u5831\u544A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "TOP94", "s": "SetZones", "b": "0 \u2026 2", "n": { "de": "Aktive Heizkreise (Zonen)", "en": "Active heating circuits (zones)", "fr": "Circuits actifs (zones)", "ja": "\u6709\u52B9\u306A\u6696\u623F\u56DE\u8DEF\uFF08\u30BE\u30FC\u30F3\uFF09" }, "t": { "de": "Eine Zone ist ein Heizkreis, zum Beispiel Erdgeschoss mit Fu\xDFbodenheizung und Obergeschoss mit Heizk\xF6rpern. Hier wird festgelegt, ob nur Zone 1, nur Zone 2 oder beide versorgt werden.", "en": "A zone is a heating circuit, for example the ground floor with underfloor heating and the upper floor with radiators. This sets whether only zone 1, only zone 2 or both are supplied.", "fr": "Une zone est un circuit de chauffage, par exemple le rez-de-chauss\xE9e en plancher chauffant et l'\xE9tage en radiateurs. On choisit ici si seule la zone 1, seule la zone 2 ou les deux sont aliment\xE9es.", "ja": "\u30BE\u30FC\u30F3\u3068\u306F\u6696\u623F\u56DE\u8DEF\u306E\u3053\u3068\u3067\u3001\u305F\u3068\u3048\u3070 1 \u968E\u306F\u5E8A\u6696\u623F\u30012 \u968E\u306F\u30E9\u30B8\u30A8\u30FC\u30BF\u30FC\u3068\u3044\u3063\u305F\u5206\u3051\u65B9\u3067\u3059\u3002\u30BE\u30FC\u30F3 1 \u3060\u3051\u3001\u30BE\u30FC\u30F3 2 \u3060\u3051\u3001\u307E\u305F\u306F\u4E21\u65B9\u306B\u4F9B\u7D66\u3059\u308B\u304B\u3092\u6C7A\u3081\u307E\u3059\u3002" } }, { "l": "TOP17", "s": "SetPowerfulMode", "b": "0 \u2026 3", "n": { "de": "Turbo (Powerful)", "en": "Powerful mode", "fr": "Mode puissant", "ja": "\u30D1\u30EF\u30D5\u30EB\u904B\u8EE2" }, "t": { "de": "L\xE4sst die W\xE4rmepumpe f\xFCr 30, 60 oder 90 Minuten mit mehr Leistung laufen, etwa um nach einer Absenkung schneller warm zu werden. Danach geht sie von selbst in den Normalbetrieb zur\xFCck. Mehr Leistung bedeutet meist auch mehr Stromverbrauch.", "en": "Runs the heat pump with more power for 30, 60 or 90 minutes, for example to warm up faster after a setback. It then returns to normal operation by itself. More power usually also means more electricity use.", "fr": "Fait fonctionner la pompe \xE0 chaleur plus fort pendant 30, 60 ou 90 minutes, par exemple pour r\xE9chauffer plus vite apr\xE8s un abaissement. Elle revient ensuite d'elle-m\xEAme au fonctionnement normal. Plus de puissance signifie en g\xE9n\xE9ral plus de consommation.", "ja": "30\u30FB60\u30FB90 \u5206\u9593\u3001\u51FA\u529B\u3092\u4E0A\u3052\u3066\u904B\u8EE2\u3057\u307E\u3059\u3002\u305F\u3068\u3048\u3070\u6E29\u5EA6\u3092\u4E0B\u3052\u3066\u3044\u305F\u5F8C\u306B\u65E9\u304F\u6696\u3081\u305F\u3044\u3068\u304D\u306B\u4F7F\u3044\u307E\u3059\u3002\u7D42\u308F\u308B\u3068\u81EA\u52D5\u3067\u901A\u5E38\u904B\u8EE2\u306B\u623B\u308A\u307E\u3059\u3002\u51FA\u529B\u304C\u4E0A\u304C\u308B\u3076\u3093\u3001\u901A\u5E38\u306F\u96FB\u6C17\u3082\u591A\u304F\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP18", "s": "SetQuietMode", "b": "0 \u2026 3", "n": { "de": "Leisemodus", "en": "Quiet mode", "fr": "Mode silencieux", "ja": "\u9759\u97F3\u30E2\u30FC\u30C9" }, "t": { "de": "Begrenzt die Leistung, damit das Au\xDFenger\xE4t leiser l\xE4uft, zum Beispiel nachts. Stufe 1 ist etwas leiser, Stufe 3 am leisesten. Je leiser, desto weniger Heizleistung steht zur Verf\xFCgung.", "en": "Limits the power so that the outdoor unit runs more quietly, for example at night. Level 1 is a little quieter, level 3 the quietest. The quieter, the less heating power is available.", "fr": "Limite la puissance pour que l'unit\xE9 ext\xE9rieure soit plus silencieuse, par exemple la nuit. Le niveau 1 est un peu plus silencieux, le niveau 3 le plus silencieux. Plus c'est silencieux, moins la puissance de chauffe est grande.", "ja": "\u51FA\u529B\u3092\u6291\u3048\u3066\u5BA4\u5916\u6A5F\u306E\u97F3\u3092\u5C0F\u3055\u304F\u3057\u307E\u3059\u3002\u591C\u9593\u306A\u3069\u306B\u4F7F\u3044\u307E\u3059\u3002\u30EC\u30D9\u30EB 1 \u306F\u5C11\u3057\u9759\u304B\u3001\u30EC\u30D9\u30EB 3 \u304C\u6700\u3082\u9759\u304B\u3067\u3059\u3002\u9759\u304B\u306B\u3059\u308B\u307B\u3069\u3001\u4F7F\u3048\u308B\u6696\u623F\u80FD\u529B\u306F\u5C0F\u3055\u304F\u306A\u308A\u307E\u3059\u3002" } }, { "l": "TOP3", "s": "", "b": "0/1", "n": { "de": "Leisemodus-Zeitplan", "en": "Quiet mode schedule", "fr": "Programmation du mode silencieux", "ja": "\u9759\u97F3\u30E2\u30FC\u30C9\u306E\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB" }, "t": { "de": "Zeigt, ob gerade ein an der Fernbedienung eingestellter Zeitplan f\xFCr den Leisemodus aktiv ist.", "en": "Shows whether a quiet mode schedule set on the remote control is currently active.", "fr": "Indique si une programmation du mode silencieux r\xE9gl\xE9e sur la t\xE9l\xE9commande est active.", "ja": "\u30EA\u30E2\u30B3\u30F3\u3067\u8A2D\u5B9A\u3057\u305F\u9759\u97F3\u30E2\u30FC\u30C9\u306E\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\u304C\u73FE\u5728\u6709\u52B9\u304B\u3069\u3046\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP141", "s": "SetQuietModePriority", "b": "0/1", "n": { "de": "Leisemodus: Vorrang", "en": "Quiet mode: priority", "fr": "Mode silencieux : priorit\xE9", "ja": "\u9759\u97F3\u30E2\u30FC\u30C9\uFF1A\u512A\u5148" }, "t": { "de": "Legt fest, was im Leisemodus wichtiger ist. \u201ELautst\xE4rke\u201C: Es bleibt leise, auch wenn es dann weniger warm wird. \u201ELeistung\u201C: Bei Bedarf darf die W\xE4rmepumpe lauter werden, damit genug W\xE4rme kommt.", "en": "Sets what matters more in quiet mode. \u201CSound\u201D: it stays quiet even if it gets less warm. \u201CCapacity\u201D: if needed, the heat pump may get louder so that enough heat is delivered.", "fr": "D\xE9finit ce qui compte le plus en mode silencieux. \xAB Son \xBB : cela reste silencieux m\xEAme s'il fait moins chaud. \xAB Puissance \xBB : si n\xE9cessaire, la pompe peut \xEAtre plus bruyante pour fournir assez de chaleur.", "ja": "\u9759\u97F3\u30E2\u30FC\u30C9\u4E2D\u306B\u4F55\u3092\u512A\u5148\u3059\u308B\u304B\u3092\u6C7A\u3081\u307E\u3059\u3002\u300C\u9759\u97F3\u300D\uFF1A\u6696\u307E\u308A\u306B\u304F\u304F\u306A\u3063\u3066\u3082\u9759\u304B\u3055\u3092\u4FDD\u3061\u307E\u3059\u3002\u300C\u80FD\u529B\u300D\uFF1A\u5FC5\u8981\u306A\u3089\u97F3\u304C\u5927\u304D\u304F\u306A\u3063\u3066\u3082\u5341\u5206\u306A\u71B1\u3092\u51FA\u3057\u307E\u3059\u3002" } }, { "l": "TOP13", "s": "SetMainSchedule", "b": "0/1", "n": { "de": "Wochenprogramm", "en": "Weekly schedule", "fr": "Programme hebdomadaire", "ja": "\u9031\u9593\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB" }, "t": { "de": "Schaltet den Zeitplan der Fernbedienung ein oder aus. Mit dem Zeitplan kann die W\xE4rmepumpe zu festen Zeiten andere Temperaturen nutzen oder ruhen.", "en": "Switches the remote control's timetable on or off. With the timetable the heat pump can use other temperatures or rest at fixed times.", "fr": "Active ou d\xE9sactive la programmation de la t\xE9l\xE9commande. Avec elle, la pompe \xE0 chaleur peut utiliser d'autres temp\xE9ratures ou s'arr\xEAter \xE0 heures fixes.", "ja": "\u30EA\u30E2\u30B3\u30F3\u306E\u30BF\u30A4\u30DE\u30FC\uFF08\u9031\u9593\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB\uFF09\u3092\u6709\u52B9\u30FB\u7121\u52B9\u306B\u3057\u307E\u3059\u3002\u6C7A\u307E\u3063\u305F\u6642\u9593\u306B\u5225\u306E\u6E29\u5EA6\u3067\u904B\u8EE2\u3057\u305F\u308A\u3001\u4F11\u6B62\u3057\u305F\u308A\u3067\u304D\u307E\u3059\u3002" } }, { "l": "TOP19", "s": "SetHolidayMode", "b": "0 \u2026 2", "n": { "de": "Urlaubsmodus", "en": "Holiday mode", "fr": "Mode vacances", "ja": "\u4F11\u6687\u30E2\u30FC\u30C9" }, "t": { "de": "F\xFCr l\xE4ngere Abwesenheit: Laut Panasonic schaltet die Anlage dann ab oder senkt die Temperatur. Gemeldet wird, ob der Urlaub aus, nur geplant oder gerade aktiv ist.", "en": "For longer absences: according to Panasonic the system then switches off or lowers the temperature. It reports whether holiday mode is off, only scheduled or currently active.", "fr": "Pour les absences prolong\xE9es : selon Panasonic, l'installation s'arr\xEAte ou baisse la temp\xE9rature. Elle indique si le mode vacances est arr\xEAt\xE9, seulement programm\xE9 ou actif.", "ja": "\u9577\u671F\u4E0D\u5728\u306E\u305F\u3081\u306E\u6A5F\u80FD\u3067\u3059\u3002Panasonic \u306B\u3088\u308B\u3068\u3001\u904B\u8EE2\u3092\u6B62\u3081\u308B\u304B\u6E29\u5EA6\u3092\u4E0B\u3052\u307E\u3059\u3002\u4F11\u6687\u30E2\u30FC\u30C9\u304C\u30AA\u30D5\u304B\u3001\u4E88\u7D04\u4E2D\u304B\u3001\u4F5C\u52D5\u4E2D\u304B\u304C\u5831\u544A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "TOP45", "s": "", "b": "\u221215 \u2026 15 \xB0C", "n": { "de": "Urlaub: Absenkung Heizung", "en": "Holiday: heating shift", "fr": "Vacances : d\xE9calage chauffage", "ja": "\u4F11\u6687\uFF1A\u6696\u623F\u306E\u6E29\u5EA6\u30B7\u30D5\u30C8" }, "t": { "de": "Um wie viel die Heiztemperatur w\xE4hrend des Urlaubs verschoben wird.", "en": "By how much the heating temperature is shifted during the holiday.", "fr": "De combien la temp\xE9rature de chauffage est d\xE9cal\xE9e pendant les vacances.", "ja": "\u4F11\u6687\u4E2D\u306B\u6696\u623F\u6E29\u5EA6\u3092\u3069\u308C\u3060\u3051\u305A\u3089\u3059\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP25", "s": "", "b": "\u221215 \u2026 15 \xB0C", "n": { "de": "Urlaub: Absenkung Warmwasser", "en": "Holiday: hot water shift", "fr": "Vacances : d\xE9calage eau chaude", "ja": "\u4F11\u6687\uFF1A\u7D66\u6E6F\u306E\u6E29\u5EA6\u30B7\u30D5\u30C8" }, "t": { "de": "Um wie viel die Warmwassertemperatur w\xE4hrend des Urlaubs verschoben wird.", "en": "By how much the hot water temperature is shifted during the holiday.", "fr": "De combien la temp\xE9rature de l'eau chaude est d\xE9cal\xE9e pendant les vacances.", "ja": "\u4F11\u6687\u4E2D\u306B\u7D66\u6E6F\u6E29\u5EA6\u3092\u3069\u308C\u3060\u3051\u305A\u3089\u3059\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP79", "s": "", "b": "\xB0C", "n": { "de": "Automatik: von Heizen auf K\xFChlen", "en": "Auto: heating to cooling", "fr": "Auto : du chauffage au rafra\xEEchissement", "ja": "\u81EA\u52D5\uFF1A\u6696\u623F\u304B\u3089\u51B7\u623F\u3078" }, "t": { "de": "In der Betriebsart Automatik: ab dieser Au\xDFentemperatur wechselt die W\xE4rmepumpe vom Heizen ins K\xFChlen.", "en": "In automatic mode: from this outdoor temperature the heat pump switches from heating to cooling.", "fr": "En mode automatique : \xE0 partir de cette temp\xE9rature ext\xE9rieure, la pompe passe du chauffage au rafra\xEEchissement.", "ja": "\u81EA\u52D5\u904B\u8EE2\u3067\u3001\u3053\u306E\u5916\u6C17\u6E29\u304B\u3089\u6696\u623F\u3092\u3084\u3081\u3066\u51B7\u623F\u306B\u5207\u308A\u66FF\u3048\u307E\u3059\u3002" } }, { "l": "TOP80", "s": "", "b": "\xB0C", "n": { "de": "Automatik: von K\xFChlen auf Heizen", "en": "Auto: cooling to heating", "fr": "Auto : du rafra\xEEchissement au chauffage", "ja": "\u81EA\u52D5\uFF1A\u51B7\u623F\u304B\u3089\u6696\u623F\u3078" }, "t": { "de": "In der Betriebsart Automatik: ab dieser Au\xDFentemperatur wechselt die W\xE4rmepumpe vom K\xFChlen zur\xFCck ins Heizen.", "en": "In automatic mode: from this outdoor temperature the heat pump switches from cooling back to heating.", "fr": "En mode automatique : \xE0 partir de cette temp\xE9rature ext\xE9rieure, la pompe repasse du rafra\xEEchissement au chauffage.", "ja": "\u81EA\u52D5\u904B\u8EE2\u3067\u3001\u3053\u306E\u5916\u6C17\u6E29\u304B\u3089\u51B7\u623F\u3092\u3084\u3081\u3066\u6696\u623F\u306B\u623B\u3057\u307E\u3059\u3002" } }, { "l": "TOP139", "s": "SetHeatingControl", "b": "0/1", "n": { "de": "Regelung: Komfort oder Effizienz", "en": "Control: comfort or efficiency", "fr": "R\xE9gulation : confort ou efficacit\xE9", "ja": "\u5236\u5FA1\uFF1A\u5FEB\u9069 \u307E\u305F\u306F \u52B9\u7387" }, "t": { "de": "Laut Panasonic legt diese Einstellung fest, ob die W\xE4rmepumpe die gew\xFCnschte Temperatur schneller erreichen (Komfort, Werkseinstellung) oder Energie sparen soll (Effizienz). Genaueres beschreibt Panasonic nicht.", "en": "According to Panasonic this setting decides whether the heat pump should reach the set temperature faster (comfort, factory default) or save energy (efficiency). Panasonic gives no further detail.", "fr": "Selon Panasonic, ce r\xE9glage d\xE9termine si la pompe doit atteindre plus vite la temp\xE9rature voulue (confort, r\xE9glage d'usine) ou \xE9conomiser l'\xE9nergie (efficacit\xE9). Panasonic n'en dit pas plus.", "ja": "Panasonic \u306B\u3088\u308B\u3068\u3001\u8A2D\u5B9A\u6E29\u5EA6\u306B\u65E9\u304F\u5230\u9054\u3055\u305B\u308B\uFF08\u5FEB\u9069\u3001\u5DE5\u5834\u51FA\u8377\u6642\uFF09\u304B\u3001\u7701\u30A8\u30CD\u3092\u512A\u5148\u3059\u308B\uFF08\u52B9\u7387\uFF09\u304B\u3092\u6C7A\u3081\u307E\u3059\u3002\u8A73\u3057\u3044\u8AAC\u660E\u306F\u3042\u308A\u307E\u305B\u3093\u3002" } }] }, { "id": "temperaturen", "titel": { "de": "Temperaturen", "en": "Temperatures", "fr": "Temp\xE9ratures", "ja": "\u6E29\u5EA6" }, "e": [{ "l": "TOP14", "s": "", "b": "\xB0C", "n": { "de": "Au\xDFentemperatur", "en": "Outdoor temperature", "fr": "Temp\xE9rature ext\xE9rieure", "ja": "\u5916\u6C17\u6E29" }, "t": { "de": "Die Temperatur drau\xDFen, gemessen am Au\xDFenger\xE4t. Danach richtet sich unter anderem die Heizkurve.", "en": "The temperature outside, measured at the outdoor unit. Among other things, the heating curve depends on it.", "fr": "La temp\xE9rature dehors, mesur\xE9e sur l'unit\xE9 ext\xE9rieure. La courbe de chauffe en d\xE9pend notamment.", "ja": "\u5BA4\u5916\u6A5F\u3067\u6E2C\u3063\u305F\u5C4B\u5916\u306E\u6E29\u5EA6\u3067\u3059\u3002\u6696\u623F\u66F2\u7DDA\u306A\u3069\u306F\u3053\u306E\u5024\u3092\u3082\u3068\u306B\u52D5\u304D\u307E\u3059\u3002" } }, { "l": "TOP6", "s": "", "b": "\xB0C", "n": { "de": "Vorlauftemperatur", "en": "Flow temperature", "fr": "Temp\xE9rature de d\xE9part", "ja": "\u5F80\u304D\u6E29\u5EA6" }, "t": { "de": "So warm ist das Wasser, das die W\xE4rmepumpe gerade in die Heizung oder den Speicher schickt.", "en": "How warm the water is that the heat pump is currently sending to the heating or the tank.", "fr": "La temp\xE9rature de l'eau que la pompe \xE0 chaleur envoie actuellement vers le chauffage ou le ballon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u4ECA\u3001\u6696\u623F\u3084\u30BF\u30F3\u30AF\u3078\u9001\u308A\u51FA\u3057\u3066\u3044\u308B\u6C34\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP5", "s": "", "b": "\xB0C", "n": { "de": "R\xFCcklauftemperatur", "en": "Return temperature", "fr": "Temp\xE9rature de retour", "ja": "\u623B\u308A\u6E29\u5EA6" }, "t": { "de": "So warm ist das Wasser, das aus der Heizung zur W\xE4rmepumpe zur\xFCckkommt.", "en": "How warm the water is that comes back from the heating to the heat pump.", "fr": "La temp\xE9rature de l'eau qui revient du chauffage vers la pompe \xE0 chaleur.", "ja": "\u6696\u623F\u304B\u3089\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u623B\u3063\u3066\u304F\u308B\u6C34\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP7", "s": "", "b": "\xB0C", "n": { "de": "Soll-Vorlauftemperatur", "en": "Target flow temperature", "fr": "Temp\xE9rature de d\xE9part vis\xE9e", "ja": "\u76EE\u6A19\u5F80\u304D\u6E29\u5EA6" }, "t": { "de": "Die Wassertemperatur, die die W\xE4rmepumpe gerade anstrebt. Sie ergibt sich aus Heizkurve, Einstellungen und der gerade laufenden Aufgabe, beim Warmwasserladen also aus dem Speicherziel.", "en": "The water temperature the heat pump is currently aiming for. It results from the heating curve, the settings and the current task, so while heating hot water from the tank target.", "fr": "La temp\xE9rature d'eau que la pompe vise actuellement. Elle d\xE9coule de la courbe de chauffe, des r\xE9glages et de la t\xE2che en cours, donc de la consigne du ballon pendant la production d'eau chaude.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u4ECA\u76EE\u6307\u3057\u3066\u3044\u308B\u6C34\u6E29\u3067\u3059\u3002\u6696\u623F\u66F2\u7DDA\u3001\u8A2D\u5B9A\u3001\u3044\u307E\u884C\u3063\u3066\u3044\u308B\u4F5C\u696D\u304B\u3089\u6C7A\u307E\u308A\u3001\u7D66\u6E6F\u4E2D\u306F\u30BF\u30F3\u30AF\u306E\u76EE\u6A19\u3067\u6C7A\u307E\u308A\u307E\u3059\u3002" } }, { "l": "TOP49", "s": "", "b": "\xB0C", "n": { "de": "Wasser nach dem W\xE4rmetauscher", "en": "Water after heat exchanger", "fr": "Eau apr\xE8s l'\xE9changeur", "ja": "\u71B1\u4EA4\u63DB\u5668\u5F8C\u306E\u6C34\u6E29" }, "t": { "de": "Laut HeishaMon die Wassertemperatur direkt nach dem W\xE4rmetauscher (\u201EAustritt 2\u201C). Der W\xE4rmetauscher ist das Bauteil, in dem die W\xE4rme aus dem K\xE4ltemittel ins Heizwasser \xFCbergeht.", "en": "According to HeishaMon the water temperature right after the heat exchanger (\u201Coutlet 2\u201D). The heat exchanger is the part where heat passes from the refrigerant into the heating water.", "fr": "Selon HeishaMon, la temp\xE9rature de l'eau juste apr\xE8s l'\xE9changeur (\xAB sortie 2 \xBB). L'\xE9changeur est la pi\xE8ce o\xF9 la chaleur passe du fluide frigorig\xE8ne \xE0 l'eau de chauffage.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u71B1\u4EA4\u63DB\u5668\u3092\u51FA\u305F\u76F4\u5F8C\u306E\u6C34\u6E29\uFF08\u300C\u51FA\u53E3 2\u300D\uFF09\u3067\u3059\u3002\u71B1\u4EA4\u63DB\u5668\u306F\u3001\u51B7\u5A92\u306E\u71B1\u3092\u6696\u623F\u306E\u6C34\u3078\u6E21\u3059\u90E8\u54C1\u3067\u3059\u3002" } }, { "l": "TOP116", "s": "", "b": "\xB0C", "n": { "de": "Zweiter R\xFCcklauff\xFChler", "en": "Second return sensor", "fr": "Deuxi\xE8me sonde de retour", "ja": "\u7B2C 2 \u623B\u308A\u30BB\u30F3\u30B5\u30FC" }, "t": { "de": "Ein weiterer Temperaturf\xFChler am Wassereingang. Laut HeishaMon nur bei der K- und L-Serie.", "en": "Another temperature sensor at the water inlet. According to HeishaMon only on the K and L series.", "fr": "Une autre sonde de temp\xE9rature \xE0 l'entr\xE9e d'eau. Selon HeishaMon, uniquement sur les s\xE9ries K et L.", "ja": "\u6C34\u306E\u5165\u53E3\u306B\u3042\u308B\u3082\u3046 1 \u3064\u306E\u6E29\u5EA6\u30BB\u30F3\u30B5\u30FC\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 K\u30FBL \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP56", "s": "", "b": "\xB0C", "n": { "de": "Zone 1: Isttemperatur", "en": "Zone 1: actual temperature", "fr": "Zone 1 : temp\xE9rature r\xE9elle", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u5B9F\u6E29\u5EA6" }, "t": { "de": "Die gemessene Temperatur von Zone 1. Je nach Einstellung des Zonenf\xFChlers ist das die Wasser- oder die Raumtemperatur.", "en": "The measured temperature of zone 1. Depending on the zone sensor setting this is the water or the room temperature.", "fr": "La temp\xE9rature mesur\xE9e de la zone 1. Selon le r\xE9glage de la sonde de zone, c'est la temp\xE9rature de l'eau ou de la pi\xE8ce.", "ja": "\u30BE\u30FC\u30F3 1 \u306E\u6E2C\u5B9A\u6E29\u5EA6\u3067\u3059\u3002\u30BE\u30FC\u30F3\u30BB\u30F3\u30B5\u30FC\u306E\u8A2D\u5B9A\u306B\u3088\u3063\u3066\u6C34\u6E29\u304B\u5BA4\u6E29\u306B\u306A\u308A\u307E\u3059\u3002" } }, { "l": "TOP57", "s": "", "b": "\xB0C", "n": { "de": "Zone 2: Isttemperatur", "en": "Zone 2: actual temperature", "fr": "Zone 2 : temp\xE9rature r\xE9elle", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u5B9F\u6E29\u5EA6" }, "t": { "de": "Die gemessene Temperatur von Zone 2. Je nach Einstellung des Zonenf\xFChlers ist das die Wasser- oder die Raumtemperatur.", "en": "The measured temperature of zone 2. Depending on the zone sensor setting this is the water or the room temperature.", "fr": "La temp\xE9rature mesur\xE9e de la zone 2. Selon le r\xE9glage de la sonde de zone, c'est la temp\xE9rature de l'eau ou de la pi\xE8ce.", "ja": "\u30BE\u30FC\u30F3 2 \u306E\u6E2C\u5B9A\u6E29\u5EA6\u3067\u3059\u3002\u30BE\u30FC\u30F3\u30BB\u30F3\u30B5\u30FC\u306E\u8A2D\u5B9A\u306B\u3088\u3063\u3066\u6C34\u6E29\u304B\u5BA4\u6E29\u306B\u306A\u308A\u307E\u3059\u3002" } }, { "l": "TOP33", "s": "", "b": "\xB0C", "n": { "de": "Raumtemperatur Fernbedienung", "en": "Remote control room temperature", "fr": "Temp\xE9rature de la t\xE9l\xE9commande", "ja": "\u30EA\u30E2\u30B3\u30F3\u306E\u5BA4\u6E29" }, "t": { "de": "Die Raumtemperatur, die der F\xFChler in der Fernbedienung misst.", "en": "The room temperature measured by the sensor in the remote control.", "fr": "La temp\xE9rature ambiante mesur\xE9e par la sonde de la t\xE9l\xE9commande.", "ja": "\u30EA\u30E2\u30B3\u30F3\u306B\u5185\u8535\u3055\u308C\u305F\u30BB\u30F3\u30B5\u30FC\u3067\u6E2C\u3063\u305F\u5BA4\u6E29\u3067\u3059\u3002" } }, { "l": "TOP118", "s": "", "b": "\xB0C", "n": { "de": "Raumtemperatur zweite Fernbedienung", "en": "Second remote control temperature", "fr": "Temp\xE9rature de la 2e t\xE9l\xE9commande", "ja": "2 \u53F0\u76EE\u30EA\u30E2\u30B3\u30F3\u306E\u5BA4\u6E29" }, "t": { "de": "Die Raumtemperatur, die eine zweite Fernbedienung misst, falls vorhanden.", "en": "The room temperature measured by a second remote control, if present.", "fr": "La temp\xE9rature ambiante mesur\xE9e par une deuxi\xE8me t\xE9l\xE9commande, si pr\xE9sente.", "ja": "2 \u53F0\u76EE\u306E\u30EA\u30E2\u30B3\u30F3\u304C\u3042\u308B\u5834\u5408\u3001\u305D\u306E\u30EA\u30E2\u30B3\u30F3\u3067\u6E2C\u3063\u305F\u5BA4\u6E29\u3067\u3059\u3002" } }] }, { "id": "heizen", "titel": { "de": "Heizen und Heizkurve", "en": "Heating and heating curve", "fr": "Chauffage et courbe de chauffe", "ja": "\u6696\u623F\u3068\u6696\u623F\u66F2\u7DDA" }, "e": [{ "l": "TOP76", "s": "", "b": "0/1", "n": { "de": "Heizungsregelung Art", "en": "Heating control type", "fr": "Type de r\xE9gulation du chauffage", "ja": "\u6696\u623F\u5236\u5FA1\u65B9\u5F0F" }, "t": { "de": "0 = nach Heizkurve: Die Wassertemperatur folgt automatisch der Au\xDFentemperatur. 1 = direkt: Es gilt eine fest eingestellte Wassertemperatur, egal wie kalt es drau\xDFen ist.", "en": "0 = by heating curve: the water temperature automatically follows the outdoor temperature. 1 = direct: a fixed water temperature applies, no matter how cold it is outside.", "fr": "0 = selon la courbe : la temp\xE9rature de l'eau suit automatiquement la temp\xE9rature ext\xE9rieure. 1 = direct : une temp\xE9rature d'eau fixe s'applique, quel que soit le froid dehors.", "ja": "0 = \u6696\u623F\u66F2\u7DDA\uFF1A\u6C34\u6E29\u304C\u5916\u6C17\u6E29\u306B\u5408\u308F\u305B\u3066\u81EA\u52D5\u3067\u5909\u308F\u308A\u307E\u3059\u30021 = \u76F4\u63A5\u8A2D\u5B9A\uFF1A\u5916\u306E\u5BD2\u3055\u306B\u95A2\u4FC2\u306A\u304F\u3001\u6C7A\u3081\u305F\u6C34\u6E29\u3067\u904B\u8EE2\u3057\u307E\u3059\u3002" } }, { "l": "TOP27", "s": "SetZ1HeatRequestTemperature", "b": "\u22125 \u2026 5 \xB0C / 20 \u2026 \xB0C", "n": { "de": "Zone 1: Wunschtemperatur Heizen", "en": "Zone 1: requested heating temperature", "fr": "Zone 1 : consigne de chauffage", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6696\u623F\u306E\u5E0C\u671B\u6E29\u5EA6" }, "t": { "de": "Hat zwei Bedeutungen. Wird nach Heizkurve geheizt, ist es eine Verschiebung der ganzen Kurve von \u22125 bis +5 \xB0C: +2 macht das Wasser \xFCberall 2 \xB0C w\xE4rmer. Im Direktbetrieb ist es die gew\xFCnschte Wassertemperatur selbst, ab 20 \xB0C. Welcher Fall gilt, zeigt \u201EHeizungsregelung Art\u201C (TOP76).", "en": "Has two meanings. When heating by the heating curve, it shifts the whole curve from \u22125 to +5 \xB0C: +2 makes the water 2 \xB0C warmer everywhere. In direct mode it is the desired water temperature itself, from 20 \xB0C. Which case applies is shown by \u201Cheating control type\u201D (TOP76).", "fr": "A deux significations. En chauffage selon la courbe, c'est un d\xE9calage de toute la courbe de \u22125 \xE0 +5 \xB0C : +2 rend l'eau 2 \xB0C plus chaude partout. En mode direct, c'est la temp\xE9rature d'eau souhait\xE9e elle-m\xEAme, \xE0 partir de 20 \xB0C. Le cas en vigueur est indiqu\xE9 par \xAB type de r\xE9gulation \xBB (TOP76).", "ja": "2 \u3064\u306E\u610F\u5473\u304C\u3042\u308A\u307E\u3059\u3002\u6696\u623F\u66F2\u7DDA\u3067\u904B\u8EE2\u4E2D\u306F\u3001\u66F2\u7DDA\u5168\u4F53\u3092 \u22125\u301C+5 \xB0C \u305A\u3089\u3059\u5024\u3067\u3059\uFF08+2 \u306A\u3089\u6C34\u6E29\u304C\u5168\u4F53\u3067 2 \xB0C \u4E0A\u304C\u308B\uFF09\u3002\u76F4\u63A5\u8A2D\u5B9A\u30E2\u30FC\u30C9\u3067\u306F\u3001\u5E0C\u671B\u3059\u308B\u6C34\u6E29\u305D\u306E\u3082\u306E\uFF0820 \xB0C \u4EE5\u4E0A\uFF09\u3067\u3059\u3002\u3069\u3061\u3089\u304B\u306F\u300C\u6696\u623F\u5236\u5FA1\u65B9\u5F0F\u300D\uFF08TOP76\uFF09\u3067\u5206\u304B\u308A\u307E\u3059\u3002" } }, { "l": "TOP34", "s": "SetZ2HeatRequestTemperature", "b": "\u22125 \u2026 5 \xB0C / 20 \u2026 \xB0C", "n": { "de": "Zone 2: Wunschtemperatur Heizen", "en": "Zone 2: requested heating temperature", "fr": "Zone 2 : consigne de chauffage", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6696\u623F\u306E\u5E0C\u671B\u6E29\u5EA6" }, "t": { "de": "Hat zwei Bedeutungen. Wird nach Heizkurve geheizt, ist es eine Verschiebung der ganzen Kurve von \u22125 bis +5 \xB0C: +2 macht das Wasser \xFCberall 2 \xB0C w\xE4rmer. Im Direktbetrieb ist es die gew\xFCnschte Wassertemperatur selbst, ab 20 \xB0C. Welcher Fall gilt, zeigt \u201EHeizungsregelung Art\u201C (TOP76).", "en": "Has two meanings. When heating by the heating curve, it shifts the whole curve from \u22125 to +5 \xB0C: +2 makes the water 2 \xB0C warmer everywhere. In direct mode it is the desired water temperature itself, from 20 \xB0C. Which case applies is shown by \u201Cheating control type\u201D (TOP76).", "fr": "A deux significations. En chauffage selon la courbe, c'est un d\xE9calage de toute la courbe de \u22125 \xE0 +5 \xB0C : +2 rend l'eau 2 \xB0C plus chaude partout. En mode direct, c'est la temp\xE9rature d'eau souhait\xE9e elle-m\xEAme, \xE0 partir de 20 \xB0C. Le cas en vigueur est indiqu\xE9 par \xAB type de r\xE9gulation \xBB (TOP76).", "ja": "2 \u3064\u306E\u610F\u5473\u304C\u3042\u308A\u307E\u3059\u3002\u6696\u623F\u66F2\u7DDA\u3067\u904B\u8EE2\u4E2D\u306F\u3001\u66F2\u7DDA\u5168\u4F53\u3092 \u22125\u301C+5 \xB0C \u305A\u3089\u3059\u5024\u3067\u3059\uFF08+2 \u306A\u3089\u6C34\u6E29\u304C\u5168\u4F53\u3067 2 \xB0C \u4E0A\u304C\u308B\uFF09\u3002\u76F4\u63A5\u8A2D\u5B9A\u30E2\u30FC\u30C9\u3067\u306F\u3001\u5E0C\u671B\u3059\u308B\u6C34\u6E29\u305D\u306E\u3082\u306E\uFF0820 \xB0C \u4EE5\u4E0A\uFF09\u3067\u3059\u3002\u3069\u3061\u3089\u304B\u306F\u300C\u6696\u623F\u5236\u5FA1\u65B9\u5F0F\u300D\uFF08TOP76\uFF09\u3067\u5206\u304B\u308A\u307E\u3059\u3002" } }, { "l": "TOP42", "s": "", "b": "\xB0C", "n": { "de": "Zone 1: Soll-Wassertemperatur", "en": "Zone 1: target water temperature", "fr": "Zone 1 : temp\xE9rature d'eau vis\xE9e", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u76EE\u6A19\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 1 gerade bekommen soll. Sie ergibt sich aus Heizkurve und Verschiebung oder aus dem Direktwert.", "en": "The water temperature zone 1 should currently get. It results from the heating curve and shift or from the direct value.", "fr": "La temp\xE9rature d'eau que la zone 1 doit recevoir actuellement. Elle d\xE9coule de la courbe et du d\xE9calage ou de la valeur directe.", "ja": "\u30BE\u30FC\u30F3 1 \u306B\u4ECA\u9001\u308B\u3079\u304D\u6C34\u6E29\u3067\u3059\u3002\u6696\u623F\u66F2\u7DDA\u3068\u30B7\u30D5\u30C8\u3001\u307E\u305F\u306F\u76F4\u63A5\u8A2D\u5B9A\u306E\u5024\u304B\u3089\u6C7A\u307E\u308A\u307E\u3059\u3002" } }, { "l": "TOP43", "s": "", "b": "\xB0C", "n": { "de": "Zone 2: Soll-Wassertemperatur", "en": "Zone 2: target water temperature", "fr": "Zone 2 : temp\xE9rature d'eau vis\xE9e", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u76EE\u6A19\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 2 gerade bekommen soll.", "en": "The water temperature zone 2 should currently get.", "fr": "La temp\xE9rature d'eau que la zone 2 doit recevoir actuellement.", "ja": "\u30BE\u30FC\u30F3 2 \u306B\u4ECA\u9001\u308B\u3079\u304D\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP36", "s": "", "b": "\xB0C", "n": { "de": "Zone 1: Wassertemperatur", "en": "Zone 1: water temperature", "fr": "Zone 1 : temp\xE9rature de l'eau", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6C34\u6E29" }, "t": { "de": "Die gemessene Temperatur des Wassers, das in Zone 1 flie\xDFt.", "en": "The measured temperature of the water flowing into zone 1.", "fr": "La temp\xE9rature mesur\xE9e de l'eau qui circule dans la zone 1.", "ja": "\u30BE\u30FC\u30F3 1 \u3078\u6D41\u308C\u3066\u3044\u308B\u6C34\u306E\u6E2C\u5B9A\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP37", "s": "", "b": "\xB0C", "n": { "de": "Zone 2: Wassertemperatur", "en": "Zone 2: water temperature", "fr": "Zone 2 : temp\xE9rature de l'eau", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6C34\u6E29" }, "t": { "de": "Die gemessene Temperatur des Wassers, das in Zone 2 flie\xDFt.", "en": "The measured temperature of the water flowing into zone 2.", "fr": "La temp\xE9rature mesur\xE9e de l'eau qui circule dans la zone 2.", "ja": "\u30BE\u30FC\u30F3 2 \u3078\u6D41\u308C\u3066\u3044\u308B\u6C34\u306E\u6E2C\u5B9A\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP29", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: Heizkurve, Wasser bei K\xE4lte", "en": "Zone 1: heating curve, water when cold", "fr": "Zone 1 : courbe, eau par temps froid", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6696\u623F\u66F2\u7DDA \u5BD2\u3044\u3068\u304D\u306E\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 1 am kalten Ende der Heizkurve bekommt, also bei der tiefsten eingestellten Au\xDFentemperatur. H\xF6her eingestellt wird es bei K\xE4lte w\xE4rmer, kostet aber mehr Strom.", "en": "The water temperature zone 1 gets at the cold end of the heating curve, that is at the lowest set outdoor temperature. A higher value makes it warmer in cold weather but uses more electricity.", "fr": "La temp\xE9rature d'eau que la zone 1 re\xE7oit \xE0 l'extr\xE9mit\xE9 froide de la courbe, donc \xE0 la temp\xE9rature ext\xE9rieure r\xE9gl\xE9e la plus basse. Plus elle est haute, plus il fait chaud par grand froid, mais la consommation augmente.", "ja": "\u30BE\u30FC\u30F3 1 \u306E\u6696\u623F\u66F2\u7DDA\u306E\u5BD2\u3044\u5074\u3001\u3064\u307E\u308A\u8A2D\u5B9A\u3057\u305F\u6700\u3082\u4F4E\u3044\u5916\u6C17\u6E29\u306E\u3068\u304D\u306E\u6C34\u6E29\u3067\u3059\u3002\u9AD8\u304F\u3059\u308B\u3068\u5BD2\u3044\u65E5\u306B\u6696\u304B\u304F\u306A\u308A\u307E\u3059\u304C\u3001\u96FB\u6C17\u3092\u591A\u304F\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP30", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: Heizkurve, Wasser bei mildem Wetter", "en": "Zone 1: heating curve, water when mild", "fr": "Zone 1 : courbe, eau par temps doux", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6696\u623F\u66F2\u7DDA \u7A4F\u3084\u304B\u306A\u3068\u304D\u306E\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 1 am warmen Ende der Heizkurve bekommt, also bei der h\xF6chsten eingestellten Au\xDFentemperatur.", "en": "The water temperature zone 1 gets at the warm end of the heating curve, that is at the highest set outdoor temperature.", "fr": "La temp\xE9rature d'eau que la zone 1 re\xE7oit \xE0 l'extr\xE9mit\xE9 douce de la courbe, donc \xE0 la temp\xE9rature ext\xE9rieure r\xE9gl\xE9e la plus haute.", "ja": "\u30BE\u30FC\u30F3 1 \u306E\u6696\u623F\u66F2\u7DDA\u306E\u6696\u304B\u3044\u5074\u3001\u3064\u307E\u308A\u8A2D\u5B9A\u3057\u305F\u6700\u3082\u9AD8\u3044\u5916\u6C17\u6E29\u306E\u3068\u304D\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP32", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: Heizkurve, kalter Au\xDFenpunkt", "en": "Zone 1: heating curve, cold outdoor point", "fr": "Zone 1 : courbe, point ext\xE9rieur froid", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6696\u623F\u66F2\u7DDA \u5BD2\u3044\u5074\u306E\u5916\u6C17\u6E29" }, "t": { "de": "Die Au\xDFentemperatur, bei der die Heizkurve ihre h\xF6chste Wassertemperatur erreicht. Ist es noch k\xE4lter, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Au\xDFenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: \u201Ehigh\u201C ist der warme Au\xDFenpunkt.", "en": "The outdoor temperature at which the heating curve reaches its highest water temperature. If it gets even colder, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: \u201Chigh\u201D is the warm outdoor point.", "fr": "La temp\xE9rature ext\xE9rieure \xE0 laquelle la courbe atteint sa temp\xE9rature d'eau la plus haute. S'il fait encore plus froid, l'eau reste \xE0 cette valeur. Remarque : la documentation HeishaMon d\xE9crit \xE0 un endroit les points ext\xE9rieurs de la courbe \xE0 l'inverse. La carte et l'int\xE9gration suivent le firmware et l'exemple SetCurves de la documentation : \xAB high \xBB est le point ext\xE9rieur doux.", "ja": "\u6696\u623F\u66F2\u7DDA\u304C\u6700\u3082\u9AD8\u3044\u6C34\u6E29\u306B\u306A\u308B\u5916\u6C17\u6E29\u3067\u3059\u3002\u305D\u308C\u3088\u308A\u5BD2\u304F\u3066\u3082\u6C34\u6E29\u306F\u3053\u306E\u5024\u306E\u307E\u307E\u3067\u3059\u3002 \u6CE8\u610F\uFF1AHeishaMon \u306E\u8AAC\u660E\u66F8\u306B\u306F\u3001\u6696\u623F\u66F2\u7DDA\u306E\u5916\u6C17\u6E29\u306E\u70B9\u3092\u9006\u306B\u66F8\u3044\u3066\u3044\u308B\u7B87\u6240\u304C\u3042\u308A\u307E\u3059\u3002\u30AB\u30FC\u30C9\u3068\u7D71\u5408\u306F\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2\u3068\u8AAC\u660E\u66F8\u306E SetCurves \u306E\u4F8B\u306B\u5F93\u3044\u3001\u300Chigh\u300D\u3092\u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29\u3068\u3057\u3066\u3044\u307E\u3059\u3002" } }, { "l": "TOP31", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: Heizkurve, warmer Au\xDFenpunkt", "en": "Zone 1: heating curve, warm outdoor point", "fr": "Zone 1 : courbe, point ext\xE9rieur doux", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6696\u623F\u66F2\u7DDA \u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29" }, "t": { "de": "Die Au\xDFentemperatur, bei der die Heizkurve ihre niedrigste Wassertemperatur erreicht. Ist es noch w\xE4rmer, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Au\xDFenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: \u201Ehigh\u201C ist der warme Au\xDFenpunkt.", "en": "The outdoor temperature at which the heating curve reaches its lowest water temperature. If it gets even warmer, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: \u201Chigh\u201D is the warm outdoor point.", "fr": "La temp\xE9rature ext\xE9rieure \xE0 laquelle la courbe atteint sa temp\xE9rature d'eau la plus basse. S'il fait encore plus doux, l'eau reste \xE0 cette valeur. Remarque : la documentation HeishaMon d\xE9crit \xE0 un endroit les points ext\xE9rieurs de la courbe \xE0 l'inverse. La carte et l'int\xE9gration suivent le firmware et l'exemple SetCurves de la documentation : \xAB high \xBB est le point ext\xE9rieur doux.", "ja": "\u6696\u623F\u66F2\u7DDA\u304C\u6700\u3082\u4F4E\u3044\u6C34\u6E29\u306B\u306A\u308B\u5916\u6C17\u6E29\u3067\u3059\u3002\u305D\u308C\u3088\u308A\u6696\u304B\u304F\u3066\u3082\u6C34\u6E29\u306F\u3053\u306E\u5024\u306E\u307E\u307E\u3067\u3059\u3002 \u6CE8\u610F\uFF1AHeishaMon \u306E\u8AAC\u660E\u66F8\u306B\u306F\u3001\u6696\u623F\u66F2\u7DDA\u306E\u5916\u6C17\u6E29\u306E\u70B9\u3092\u9006\u306B\u66F8\u3044\u3066\u3044\u308B\u7B87\u6240\u304C\u3042\u308A\u307E\u3059\u3002\u30AB\u30FC\u30C9\u3068\u7D71\u5408\u306F\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2\u3068\u8AAC\u660E\u66F8\u306E SetCurves \u306E\u4F8B\u306B\u5F93\u3044\u3001\u300Chigh\u300D\u3092\u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29\u3068\u3057\u3066\u3044\u307E\u3059\u3002" } }, { "l": "TOP82", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: Heizkurve, Wasser bei K\xE4lte", "en": "Zone 2: heating curve, water when cold", "fr": "Zone 2 : courbe, eau par temps froid", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6696\u623F\u66F2\u7DDA \u5BD2\u3044\u3068\u304D\u306E\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 2 am kalten Ende der Heizkurve bekommt, also bei der tiefsten eingestellten Au\xDFentemperatur. H\xF6her eingestellt wird es bei K\xE4lte w\xE4rmer, kostet aber mehr Strom.", "en": "The water temperature zone 2 gets at the cold end of the heating curve, that is at the lowest set outdoor temperature. A higher value makes it warmer in cold weather but uses more electricity.", "fr": "La temp\xE9rature d'eau que la zone 2 re\xE7oit \xE0 l'extr\xE9mit\xE9 froide de la courbe, donc \xE0 la temp\xE9rature ext\xE9rieure r\xE9gl\xE9e la plus basse. Plus elle est haute, plus il fait chaud par grand froid, mais la consommation augmente.", "ja": "\u30BE\u30FC\u30F3 2 \u306E\u6696\u623F\u66F2\u7DDA\u306E\u5BD2\u3044\u5074\u3001\u3064\u307E\u308A\u8A2D\u5B9A\u3057\u305F\u6700\u3082\u4F4E\u3044\u5916\u6C17\u6E29\u306E\u3068\u304D\u306E\u6C34\u6E29\u3067\u3059\u3002\u9AD8\u304F\u3059\u308B\u3068\u5BD2\u3044\u65E5\u306B\u6696\u304B\u304F\u306A\u308A\u307E\u3059\u304C\u3001\u96FB\u6C17\u3092\u591A\u304F\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP83", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: Heizkurve, Wasser bei mildem Wetter", "en": "Zone 2: heating curve, water when mild", "fr": "Zone 2 : courbe, eau par temps doux", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6696\u623F\u66F2\u7DDA \u7A4F\u3084\u304B\u306A\u3068\u304D\u306E\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die Zone 2 am warmen Ende der Heizkurve bekommt, also bei der h\xF6chsten eingestellten Au\xDFentemperatur.", "en": "The water temperature zone 2 gets at the warm end of the heating curve, that is at the highest set outdoor temperature.", "fr": "La temp\xE9rature d'eau que la zone 2 re\xE7oit \xE0 l'extr\xE9mit\xE9 douce de la courbe, donc \xE0 la temp\xE9rature ext\xE9rieure r\xE9gl\xE9e la plus haute.", "ja": "\u30BE\u30FC\u30F3 2 \u306E\u6696\u623F\u66F2\u7DDA\u306E\u6696\u304B\u3044\u5074\u3001\u3064\u307E\u308A\u8A2D\u5B9A\u3057\u305F\u6700\u3082\u9AD8\u3044\u5916\u6C17\u6E29\u306E\u3068\u304D\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP85", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: Heizkurve, kalter Au\xDFenpunkt", "en": "Zone 2: heating curve, cold outdoor point", "fr": "Zone 2 : courbe, point ext\xE9rieur froid", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6696\u623F\u66F2\u7DDA \u5BD2\u3044\u5074\u306E\u5916\u6C17\u6E29" }, "t": { "de": "Die Au\xDFentemperatur, bei der die Heizkurve ihre h\xF6chste Wassertemperatur erreicht. Ist es noch k\xE4lter, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Au\xDFenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: \u201Ehigh\u201C ist der warme Au\xDFenpunkt.", "en": "The outdoor temperature at which the heating curve reaches its highest water temperature. If it gets even colder, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: \u201Chigh\u201D is the warm outdoor point.", "fr": "La temp\xE9rature ext\xE9rieure \xE0 laquelle la courbe atteint sa temp\xE9rature d'eau la plus haute. S'il fait encore plus froid, l'eau reste \xE0 cette valeur. Remarque : la documentation HeishaMon d\xE9crit \xE0 un endroit les points ext\xE9rieurs de la courbe \xE0 l'inverse. La carte et l'int\xE9gration suivent le firmware et l'exemple SetCurves de la documentation : \xAB high \xBB est le point ext\xE9rieur doux.", "ja": "\u6696\u623F\u66F2\u7DDA\u304C\u6700\u3082\u9AD8\u3044\u6C34\u6E29\u306B\u306A\u308B\u5916\u6C17\u6E29\u3067\u3059\u3002\u305D\u308C\u3088\u308A\u5BD2\u304F\u3066\u3082\u6C34\u6E29\u306F\u3053\u306E\u5024\u306E\u307E\u307E\u3067\u3059\u3002 \u6CE8\u610F\uFF1AHeishaMon \u306E\u8AAC\u660E\u66F8\u306B\u306F\u3001\u6696\u623F\u66F2\u7DDA\u306E\u5916\u6C17\u6E29\u306E\u70B9\u3092\u9006\u306B\u66F8\u3044\u3066\u3044\u308B\u7B87\u6240\u304C\u3042\u308A\u307E\u3059\u3002\u30AB\u30FC\u30C9\u3068\u7D71\u5408\u306F\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2\u3068\u8AAC\u660E\u66F8\u306E SetCurves \u306E\u4F8B\u306B\u5F93\u3044\u3001\u300Chigh\u300D\u3092\u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29\u3068\u3057\u3066\u3044\u307E\u3059\u3002" } }, { "l": "TOP84", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: Heizkurve, warmer Au\xDFenpunkt", "en": "Zone 2: heating curve, warm outdoor point", "fr": "Zone 2 : courbe, point ext\xE9rieur doux", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6696\u623F\u66F2\u7DDA \u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29" }, "t": { "de": "Die Au\xDFentemperatur, bei der die Heizkurve ihre niedrigste Wassertemperatur erreicht. Ist es noch w\xE4rmer, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Au\xDFenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: \u201Ehigh\u201C ist der warme Au\xDFenpunkt.", "en": "The outdoor temperature at which the heating curve reaches its lowest water temperature. If it gets even warmer, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: \u201Chigh\u201D is the warm outdoor point.", "fr": "La temp\xE9rature ext\xE9rieure \xE0 laquelle la courbe atteint sa temp\xE9rature d'eau la plus basse. S'il fait encore plus doux, l'eau reste \xE0 cette valeur. Remarque : la documentation HeishaMon d\xE9crit \xE0 un endroit les points ext\xE9rieurs de la courbe \xE0 l'inverse. La carte et l'int\xE9gration suivent le firmware et l'exemple SetCurves de la documentation : \xAB high \xBB est le point ext\xE9rieur doux.", "ja": "\u6696\u623F\u66F2\u7DDA\u304C\u6700\u3082\u4F4E\u3044\u6C34\u6E29\u306B\u306A\u308B\u5916\u6C17\u6E29\u3067\u3059\u3002\u305D\u308C\u3088\u308A\u6696\u304B\u304F\u3066\u3082\u6C34\u6E29\u306F\u3053\u306E\u5024\u306E\u307E\u307E\u3067\u3059\u3002 \u6CE8\u610F\uFF1AHeishaMon \u306E\u8AAC\u660E\u66F8\u306B\u306F\u3001\u6696\u623F\u66F2\u7DDA\u306E\u5916\u6C17\u6E29\u306E\u70B9\u3092\u9006\u306B\u66F8\u3044\u3066\u3044\u308B\u7B87\u6240\u304C\u3042\u308A\u307E\u3059\u3002\u30AB\u30FC\u30C9\u3068\u7D71\u5408\u306F\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2\u3068\u8AAC\u660E\u66F8\u306E SetCurves \u306E\u4F8B\u306B\u5F93\u3044\u3001\u300Chigh\u300D\u3092\u6696\u304B\u3044\u5074\u306E\u5916\u6C17\u6E29\u3068\u3057\u3066\u3044\u307E\u3059\u3002" } }, { "l": "TOP23", "s": "SetFloorHeatDelta", "b": "1 \u2026 15 \xB0C", "n": { "de": "Spreizung Heizen", "en": "Heating spread", "fr": "\xC9cart de chauffage", "ja": "\u6696\u623F\u6E29\u5EA6\u5DEE" }, "t": { "de": "Der Temperaturunterschied zwischen Vorlauf und R\xFCcklauf, den die W\xE4rmepumpe beim Heizen anstrebt. Panasonic nennt ihn \u201E\u0394T f\xFCr Heizen\u201C, Werkseinstellung 5 \xB0C. Laut Panasonic gilt er nicht, wenn die Pumpe auf \u201Emaximale Leistung\u201C eingestellt ist.", "en": "The temperature difference between flow and return that the heat pump aims for when heating. Panasonic calls it \u201C\u0394T for heating\u201D, factory setting 5 \xB0C. According to Panasonic it does not apply when the pump is set to \u201Cmax. duty\u201D.", "fr": "L'\xE9cart de temp\xE9rature entre d\xE9part et retour que la pompe vise en chauffage. Panasonic l'appelle \xAB \u0394T chauffage \xBB, r\xE9glage d'usine 5 \xB0C. Selon Panasonic, il ne s'applique pas si la pompe est r\xE9gl\xE9e sur \xAB puissance max. \xBB.", "ja": "\u6696\u623F\u6642\u306B\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u76EE\u6307\u3059\u5F80\u304D\u3068\u623B\u308A\u306E\u6E29\u5EA6\u5DEE\u3067\u3059\u3002Panasonic \u3067\u306F\u300C\u6696\u623F \u0394T\u300D\u3068\u547C\u3073\u3001\u5DE5\u5834\u51FA\u8377\u6642\u306F 5 \xB0C \u3067\u3059\u3002Panasonic \u306B\u3088\u308B\u3068\u3001\u30DD\u30F3\u30D7\u3092\u300C\u6700\u5927\u51FA\u529B\u300D\u306B\u8A2D\u5B9A\u3057\u3066\u3044\u308B\u3068\u304D\u306F\u4F7F\u308F\u308C\u307E\u305B\u3093\u3002" } }, { "l": "TOP77", "s": "SetHeatingOffOutdoorTemp", "b": "5 \u2026 35 \xB0C", "n": { "de": "Heizen aus ab Au\xDFentemperatur", "en": "Heating off above outdoor temp.", "fr": "Arr\xEAt du chauffage au-dessus de", "ja": "\u6696\u623F\u505C\u6B62\u5916\u6C17\u6E29" }, "t": { "de": "Ist es drau\xDFen w\xE4rmer als dieser Wert, heizt die W\xE4rmepumpe nicht mehr (Sommerabschaltung). Warmwasser wird weiter bereitet. Panasonic-Werkseinstellung: 24 \xB0C.", "en": "If it is warmer outside than this value, the heat pump stops heating (summer cut-off). Hot water is still produced. Panasonic factory setting: 24 \xB0C.", "fr": "S'il fait plus chaud dehors que cette valeur, la pompe ne chauffe plus (coupure d'\xE9t\xE9). L'eau chaude continue d'\xEAtre produite. R\xE9glage d'usine Panasonic : 24 \xB0C.", "ja": "\u5916\u6C17\u6E29\u304C\u3053\u306E\u5024\u3088\u308A\u9AD8\u3044\u3068\u6696\u623F\u3092\u6B62\u3081\u307E\u3059\uFF08\u590F\u5B63\u505C\u6B62\uFF09\u3002\u7D66\u6E6F\u306F\u7D9A\u3051\u307E\u3059\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F 24 \xB0C \u3067\u3059\u3002" } }, { "l": "TOP111", "s": "", "b": "0 \u2026 3", "n": { "de": "Zone 1: Art des F\xFChlers", "en": "Zone 1: sensor type", "fr": "Zone 1 : type de sonde", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u30BB\u30F3\u30B5\u30FC\u306E\u7A2E\u985E" }, "t": { "de": "Womit Zone 1 geregelt wird: 0 = Wassertemperatur, 1 = externer Raumthermostat, 2 = Raumf\xFChler der Fernbedienung, 3 = separater Raumf\xFChler (Thermistor).", "en": "What zone 1 is controlled by: 0 = water temperature, 1 = external room thermostat, 2 = remote control room sensor, 3 = separate room sensor (thermistor).", "fr": "Ce qui r\xE9gule la zone 1 : 0 = temp\xE9rature de l'eau, 1 = thermostat d'ambiance externe, 2 = sonde de la t\xE9l\xE9commande, 3 = sonde d'ambiance s\xE9par\xE9e (thermistance).", "ja": "\u30BE\u30FC\u30F3 1 \u3092\u4F55\u3067\u5236\u5FA1\u3059\u308B\u304B\uFF1A0 = \u6C34\u6E29\u30011 = \u5916\u90E8\u30EB\u30FC\u30E0\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u30012 = \u30EA\u30E2\u30B3\u30F3\u306E\u5BA4\u6E29\u30BB\u30F3\u30B5\u30FC\u30013 = \u5225\u7F6E\u304D\u306E\u5BA4\u6E29\u30BB\u30F3\u30B5\u30FC\uFF08\u30B5\u30FC\u30DF\u30B9\u30BF\uFF09\u3002" } }, { "l": "TOP112", "s": "", "b": "0 \u2026 3", "n": { "de": "Zone 2: Art des F\xFChlers", "en": "Zone 2: sensor type", "fr": "Zone 2 : type de sonde", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u30BB\u30F3\u30B5\u30FC\u306E\u7A2E\u985E" }, "t": { "de": "Wie bei Zone 1: 0 = Wassertemperatur, 1 = externer Raumthermostat, 2 = Raumf\xFChler der Fernbedienung, 3 = separater Raumf\xFChler.", "en": "As for zone 1: 0 = water temperature, 1 = external room thermostat, 2 = remote control room sensor, 3 = separate room sensor.", "fr": "Comme pour la zone 1 : 0 = temp\xE9rature de l'eau, 1 = thermostat externe, 2 = sonde de la t\xE9l\xE9commande, 3 = sonde d'ambiance s\xE9par\xE9e.", "ja": "\u30BE\u30FC\u30F3 1 \u3068\u540C\u3058\u304F\u30010 = \u6C34\u6E29\u30011 = \u5916\u90E8\u30EB\u30FC\u30E0\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u30012 = \u30EA\u30E2\u30B3\u30F3\u306E\u5BA4\u6E29\u30BB\u30F3\u30B5\u30FC\u30013 = \u5225\u7F6E\u304D\u306E\u5BA4\u6E29\u30BB\u30F3\u30B5\u30FC\u3002" } }] }, { "id": "kuehlen", "titel": { "de": "K\xFChlen", "en": "Cooling", "fr": "Rafra\xEEchissement", "ja": "\u51B7\u623F" }, "e": [{ "l": "TOP81", "s": "", "b": "0/1", "n": { "de": "K\xFChlregelung Art", "en": "Cooling control type", "fr": "Type de r\xE9gulation du froid", "ja": "\u51B7\u623F\u5236\u5FA1\u65B9\u5F0F" }, "t": { "de": "0 = nach K\xFChlkurve, abh\xE4ngig von der Au\xDFentemperatur. 1 = direkt mit fester Wassertemperatur.", "en": "0 = by cooling curve, depending on the outdoor temperature. 1 = direct with a fixed water temperature.", "fr": "0 = selon la courbe, en fonction de la temp\xE9rature ext\xE9rieure. 1 = direct avec une temp\xE9rature d'eau fixe.", "ja": "0 = \u51B7\u623F\u66F2\u7DDA\uFF08\u5916\u6C17\u6E29\u306B\u5FDC\u3058\u308B\uFF09\u30021 = \u76F4\u63A5\u8A2D\u5B9A\uFF08\u56FA\u5B9A\u306E\u6C34\u6E29\uFF09\u3002" } }, { "l": "TOP28", "s": "SetZ1CoolRequestTemperature", "b": "\u22125 \u2026 5 \xB0C / 5 \u2026 20 \xB0C", "n": { "de": "Zone 1: Wunschtemperatur K\xFChlen", "en": "Zone 1: requested cooling temperature", "fr": "Zone 1 : consigne de rafra\xEEchissement", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u51B7\u623F\u306E\u5E0C\u671B\u6E29\u5EA6" }, "t": { "de": "Wie beim Heizen mit zwei Bedeutungen: Bei K\xFChlkurve eine Verschiebung von \u22125 bis +5 \xB0C, im Direktbetrieb die gew\xFCnschte Wassertemperatur von 5 bis 20 \xB0C. Welcher Fall gilt, zeigt TOP81.", "en": "As with heating it has two meanings: with a cooling curve a shift of \u22125 to +5 \xB0C, in direct mode the desired water temperature from 5 to 20 \xB0C. Which case applies is shown by TOP81.", "fr": "Comme pour le chauffage, deux significations : avec courbe, un d\xE9calage de \u22125 \xE0 +5 \xB0C ; en mode direct, la temp\xE9rature d'eau souhait\xE9e de 5 \xE0 20 \xB0C. Le cas en vigueur est indiqu\xE9 par TOP81.", "ja": "\u6696\u623F\u3068\u540C\u3058\u304F 2 \u3064\u306E\u610F\u5473\u304C\u3042\u308A\u307E\u3059\u3002\u51B7\u623F\u66F2\u7DDA\u3067\u306F \u22125\u301C+5 \xB0C \u306E\u30B7\u30D5\u30C8\u3001\u76F4\u63A5\u8A2D\u5B9A\u3067\u306F 5\u301C20 \xB0C \u306E\u5E0C\u671B\u6C34\u6E29\u3067\u3059\u3002\u3069\u3061\u3089\u304B\u306F TOP81 \u3067\u5206\u304B\u308A\u307E\u3059\u3002" } }, { "l": "TOP35", "s": "SetZ2CoolRequestTemperature", "b": "\u22125 \u2026 5 \xB0C / 5 \u2026 20 \xB0C", "n": { "de": "Zone 2: Wunschtemperatur K\xFChlen", "en": "Zone 2: requested cooling temperature", "fr": "Zone 2 : consigne de rafra\xEEchissement", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u51B7\u623F\u306E\u5E0C\u671B\u6E29\u5EA6" }, "t": { "de": "Wie beim Heizen mit zwei Bedeutungen: Bei K\xFChlkurve eine Verschiebung von \u22125 bis +5 \xB0C, im Direktbetrieb die gew\xFCnschte Wassertemperatur von 5 bis 20 \xB0C. Welcher Fall gilt, zeigt TOP81.", "en": "As with heating it has two meanings: with a cooling curve a shift of \u22125 to +5 \xB0C, in direct mode the desired water temperature from 5 to 20 \xB0C. Which case applies is shown by TOP81.", "fr": "Comme pour le chauffage, deux significations : avec courbe, un d\xE9calage de \u22125 \xE0 +5 \xB0C ; en mode direct, la temp\xE9rature d'eau souhait\xE9e de 5 \xE0 20 \xB0C. Le cas en vigueur est indiqu\xE9 par TOP81.", "ja": "\u6696\u623F\u3068\u540C\u3058\u304F 2 \u3064\u306E\u610F\u5473\u304C\u3042\u308A\u307E\u3059\u3002\u51B7\u623F\u66F2\u7DDA\u3067\u306F \u22125\u301C+5 \xB0C \u306E\u30B7\u30D5\u30C8\u3001\u76F4\u63A5\u8A2D\u5B9A\u3067\u306F 5\u301C20 \xB0C \u306E\u5E0C\u671B\u6C34\u6E29\u3067\u3059\u3002\u3069\u3061\u3089\u304B\u306F TOP81 \u3067\u5206\u304B\u308A\u307E\u3059\u3002" } }, { "l": "TOP72", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: K\xFChlkurve, Wasser am oberen Punkt", "en": "Zone 1: cooling curve, water at upper point", "fr": "Zone 1 : courbe de froid, eau au point haut", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u51B7\u623F\u66F2\u7DDA \u4E0A\u5074\u306E\u6C34\u6E29" }, "t": { "de": "Laut HeishaMon die Wassertemperatur am h\xF6chsten Punkt der K\xFChlkurve.", "en": "According to HeishaMon the water temperature at the highest point of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature d'eau au point le plus haut de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u9AD8\u3044\u70B9\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP73", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: K\xFChlkurve, Wasser am unteren Punkt", "en": "Zone 1: cooling curve, water at lower point", "fr": "Zone 1 : courbe de froid, eau au point bas", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u51B7\u623F\u66F2\u7DDA \u4E0B\u5074\u306E\u6C34\u6E29" }, "t": { "de": "Laut HeishaMon die Wassertemperatur am tiefsten Punkt der K\xFChlkurve.", "en": "According to HeishaMon the water temperature at the lowest point of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature d'eau au point le plus bas de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u4F4E\u3044\u70B9\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP74", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: K\xFChlkurve, h\xF6chste Au\xDFentemperatur", "en": "Zone 1: cooling curve, highest outdoor temp.", "fr": "Zone 1 : courbe de froid, ext\xE9rieur le plus chaud", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u51B7\u623F\u66F2\u7DDA \u6700\u9AD8\u5916\u6C17\u6E29" }, "t": { "de": "Laut HeishaMon die h\xF6chste Au\xDFentemperatur der K\xFChlkurve.", "en": "According to HeishaMon the highest outdoor temperature of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature ext\xE9rieure la plus haute de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u9AD8\u3044\u5916\u6C17\u6E29\u3067\u3059\u3002" } }, { "l": "TOP75", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 1: K\xFChlkurve, tiefste Au\xDFentemperatur", "en": "Zone 1: cooling curve, lowest outdoor temp.", "fr": "Zone 1 : courbe de froid, ext\xE9rieur le plus frais", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u51B7\u623F\u66F2\u7DDA \u6700\u4F4E\u5916\u6C17\u6E29" }, "t": { "de": "Laut HeishaMon die tiefste Au\xDFentemperatur der K\xFChlkurve.", "en": "According to HeishaMon the lowest outdoor temperature of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature ext\xE9rieure la plus basse de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u4F4E\u3044\u5916\u6C17\u6E29\u3067\u3059\u3002" } }, { "l": "TOP86", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: K\xFChlkurve, Wasser am oberen Punkt", "en": "Zone 2: cooling curve, water at upper point", "fr": "Zone 2 : courbe de froid, eau au point haut", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u51B7\u623F\u66F2\u7DDA \u4E0A\u5074\u306E\u6C34\u6E29" }, "t": { "de": "Laut HeishaMon die Wassertemperatur am h\xF6chsten Punkt der K\xFChlkurve.", "en": "According to HeishaMon the water temperature at the highest point of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature d'eau au point le plus haut de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u9AD8\u3044\u70B9\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP87", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: K\xFChlkurve, Wasser am unteren Punkt", "en": "Zone 2: cooling curve, water at lower point", "fr": "Zone 2 : courbe de froid, eau au point bas", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u51B7\u623F\u66F2\u7DDA \u4E0B\u5074\u306E\u6C34\u6E29" }, "t": { "de": "Laut HeishaMon die Wassertemperatur am tiefsten Punkt der K\xFChlkurve.", "en": "According to HeishaMon the water temperature at the lowest point of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature d'eau au point le plus bas de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u4F4E\u3044\u70B9\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP88", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: K\xFChlkurve, h\xF6chste Au\xDFentemperatur", "en": "Zone 2: cooling curve, highest outdoor temp.", "fr": "Zone 2 : courbe de froid, ext\xE9rieur le plus chaud", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u51B7\u623F\u66F2\u7DDA \u6700\u9AD8\u5916\u6C17\u6E29" }, "t": { "de": "Laut HeishaMon die h\xF6chste Au\xDFentemperatur der K\xFChlkurve.", "en": "According to HeishaMon the highest outdoor temperature of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature ext\xE9rieure la plus haute de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u9AD8\u3044\u5916\u6C17\u6E29\u3067\u3059\u3002" } }, { "l": "TOP89", "s": "SetCurves", "b": "\xB0C", "n": { "de": "Zone 2: K\xFChlkurve, tiefste Au\xDFentemperatur", "en": "Zone 2: cooling curve, lowest outdoor temp.", "fr": "Zone 2 : courbe de froid, ext\xE9rieur le plus frais", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u51B7\u623F\u66F2\u7DDA \u6700\u4F4E\u5916\u6C17\u6E29" }, "t": { "de": "Laut HeishaMon die tiefste Au\xDFentemperatur der K\xFChlkurve.", "en": "According to HeishaMon the lowest outdoor temperature of the cooling curve.", "fr": "Selon HeishaMon, la temp\xE9rature ext\xE9rieure la plus basse de la courbe de rafra\xEEchissement.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u623F\u66F2\u7DDA\u306E\u6700\u3082\u4F4E\u3044\u5916\u6C17\u6E29\u3067\u3059\u3002" } }, { "l": "TOP24", "s": "SetFloorCoolDelta", "b": "1 \u2026 15 \xB0C", "n": { "de": "Spreizung K\xFChlen", "en": "Cooling spread", "fr": "\xC9cart de rafra\xEEchissement", "ja": "\u51B7\u623F\u6E29\u5EA6\u5DEE" }, "t": { "de": "Der Temperaturunterschied zwischen Vorlauf und R\xFCcklauf, den die W\xE4rmepumpe beim K\xFChlen anstrebt.", "en": "The temperature difference between flow and return that the heat pump aims for when cooling.", "fr": "L'\xE9cart de temp\xE9rature entre d\xE9part et retour vis\xE9 en rafra\xEEchissement.", "ja": "\u51B7\u623F\u6642\u306B\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u76EE\u6307\u3059\u5F80\u304D\u3068\u623B\u308A\u306E\u6E29\u5EA6\u5DEE\u3067\u3059\u3002" } }] }, { "id": "warmwasser", "titel": { "de": "Warmwasser", "en": "Hot water", "fr": "Eau chaude", "ja": "\u7D66\u6E6F" }, "e": [{ "l": "TOP10", "s": "", "b": "\xB0C", "n": { "de": "Warmwasser Isttemperatur", "en": "Hot water temperature", "fr": "Temp\xE9rature de l'eau chaude", "ja": "\u7D66\u6E6F\u6E29\u5EA6" }, "t": { "de": "So warm ist das Wasser im Warmwasserspeicher gerade.", "en": "How warm the water in the hot water tank currently is.", "fr": "La temp\xE9rature actuelle de l'eau dans le ballon d'eau chaude.", "ja": "\u7D66\u6E6F\u30BF\u30F3\u30AF\u306E\u4ECA\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "TOP9", "s": "SetDHWTemp", "b": "40 \u2026 75 \xB0C", "n": { "de": "Warmwasser Solltemperatur", "en": "Hot water target", "fr": "Consigne d'eau chaude", "ja": "\u7D66\u6E6F\u306E\u8A2D\u5B9A\u6E29\u5EA6" }, "t": { "de": "Auf diese Temperatur heizt die W\xE4rmepumpe den Warmwasserspeicher auf. Je h\xF6her, desto mehr warmes Wasser steht bereit, aber desto mehr Strom wird gebraucht.", "en": "The temperature the heat pump heats the hot water tank to. The higher it is, the more hot water is available, but the more electricity is needed.", "fr": "La temp\xE9rature \xE0 laquelle la pompe chauffe le ballon d'eau chaude. Plus elle est haute, plus il y a d'eau chaude disponible, mais plus la consommation augmente.", "ja": "\u7D66\u6E6F\u30BF\u30F3\u30AF\u3092\u3053\u306E\u6E29\u5EA6\u307E\u3067\u6CB8\u304B\u3057\u307E\u3059\u3002\u9AD8\u3044\u307B\u3069\u304A\u6E6F\u306F\u591A\u304F\u4F7F\u3048\u307E\u3059\u304C\u3001\u96FB\u6C17\u3082\u591A\u304F\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP22", "s": "SetDHWHeatDelta", "b": "\u221212 \u2026 \u22122 \xB0C", "n": { "de": "Warmwasser Nachladen ab", "en": "Hot water reheat below", "fr": "Recharge de l'eau chaude sous", "ja": "\u7D66\u6E6F\u306E\u518D\u52A0\u71B1\u958B\u59CB" }, "t": { "de": "Wie weit der Speicher unter die Solltemperatur abk\xFChlen darf, bevor wieder geheizt wird. \u22128 bei 50 \xB0C bedeutet: Nachladen ab 42 \xB0C. Panasonic-Werkseinstellung: \u22128.", "en": "How far the tank may cool below the target before it is heated again. \u22128 at 50 \xB0C means: reheat from 42 \xB0C. Panasonic factory setting: \u22128.", "fr": "De combien le ballon peut descendre sous la consigne avant d'\xEAtre r\xE9chauff\xE9. \u22128 \xE0 50 \xB0C signifie : recharge \xE0 partir de 42 \xB0C. R\xE9glage d'usine Panasonic : \u22128.", "ja": "\u8A2D\u5B9A\u6E29\u5EA6\u304B\u3089\u3069\u308C\u3060\u3051\u4E0B\u304C\u3063\u305F\u3089\u518D\u3073\u6CB8\u304B\u3059\u304B\u3067\u3059\u300250 \xB0C \u3067 \u22128 \u306A\u3089 42 \xB0C \u304B\u3089\u518D\u52A0\u71B1\u3057\u307E\u3059\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F \u22128 \u3067\u3059\u3002" } }, { "l": "TOP2", "s": "SetForceDHW", "b": "0/1", "n": { "de": "Warmwasser einmalig aufheizen", "en": "Heat hot water once", "fr": "Chauffer l'eau chaude une fois", "ja": "\u7D66\u6E6F\u3092 1 \u56DE\u6CB8\u304B\u3059" }, "t": { "de": "Heizt den Speicher sofort einmal auf, unabh\xE4ngig vom Nachladepunkt. Laut HeishaMon muss die Betriebsart daf\xFCr Warmwasser enthalten.", "en": "Heats the tank once right away, regardless of the reheat point. According to HeishaMon the operating mode must include hot water for this.", "fr": "Chauffe le ballon une fois imm\xE9diatement, quel que soit le seuil de recharge. Selon HeishaMon, le mode doit inclure l'eau chaude.", "ja": "\u518D\u52A0\u71B1\u306E\u6761\u4EF6\u306B\u95A2\u4FC2\u306A\u304F\u3001\u3059\u3050\u306B 1 \u56DE\u30BF\u30F3\u30AF\u3092\u6CB8\u304B\u3057\u307E\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068\u3001\u904B\u8EE2\u30E2\u30FC\u30C9\u306B\u7D66\u6E6F\u304C\u542B\u307E\u308C\u3066\u3044\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002" } }, { "l": "TOP69", "s": "SetForceSterilization", "b": "0/1", "n": { "de": "Legionellenschutz", "en": "Legionella protection", "fr": "Protection anti-l\xE9gionelles", "ja": "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56" }, "t": { "de": "Legionellen sind Bakterien, die sich in lauwarmem Wasser vermehren k\xF6nnen. Beim Legionellenschutz wird der Speicher kurz stark aufgeheizt. Der Wert zeigt, ob das gerade l\xE4uft; der Befehl startet es sofort.", "en": "Legionella are bacteria that can multiply in lukewarm water. For protection the tank is briefly heated to a high temperature. The value shows whether this is running; the command starts it right away.", "fr": "Les l\xE9gionelles sont des bact\xE9ries qui peuvent se multiplier dans l'eau ti\xE8de. Pour s'en prot\xE9ger, le ballon est bri\xE8vement chauff\xE9 fortement. La valeur indique si c'est en cours ; la commande le lance imm\xE9diatement.", "ja": "\u30EC\u30B8\u30AA\u30CD\u30E9\u306F\u306C\u308B\u3044\u304A\u6E6F\u306E\u4E2D\u3067\u5897\u3048\u308B\u7D30\u83CC\u3067\u3059\u3002\u5BFE\u7B56\u3068\u3057\u3066\u3001\u30BF\u30F3\u30AF\u3092\u77ED\u6642\u9593\u9AD8\u6E29\u306B\u3057\u307E\u3059\u3002\u5024\u306F\u5B9F\u884C\u4E2D\u304B\u3069\u3046\u304B\u3092\u793A\u3057\u3001\u547D\u4EE4\u3067\u3059\u3050\u958B\u59CB\u3057\u307E\u3059\u3002" } }, { "l": "TOP70", "s": "SetSterilizationTemp", "b": "55 \u2026 75 \xB0C", "n": { "de": "Legionellenschutz: Temperatur", "en": "Legionella protection: temperature", "fr": "Anti-l\xE9gionelles : temp\xE9rature", "ja": "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56\uFF1A\u6E29\u5EA6" }, "t": { "de": "Auf diese Temperatur wird der Speicher beim Legionellenschutz aufgeheizt. Panasonic-Werkseinstellung: 65 \xB0C. Die HeishaMon-Firmware nimmt nur 55 bis 75 an.", "en": "The temperature the tank is heated to for legionella protection. Panasonic factory setting: 65 \xB0C. The HeishaMon firmware only accepts 55 to 75.", "fr": "La temp\xE9rature \xE0 laquelle le ballon est chauff\xE9 pour la protection anti-l\xE9gionelles. R\xE9glage d'usine Panasonic : 65 \xB0C. Le firmware HeishaMon n'accepte que 55 \xE0 75.", "ja": "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56\u3067\u30BF\u30F3\u30AF\u3092\u6CB8\u304B\u3059\u6E29\u5EA6\u3067\u3059\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F 65 \xB0C \u3067\u3059\u3002HeishaMon \u306E\u30D5\u30A1\u30FC\u30E0\u30A6\u30A7\u30A2\u306F 55\u301C75 \u306E\u307F\u53D7\u3051\u4ED8\u3051\u307E\u3059\u3002" } }, { "l": "TOP71", "s": "SetSterilizationMaxTime", "b": "5 \u2026 60 min", "n": { "de": "Legionellenschutz: Haltezeit", "en": "Legionella protection: hold time", "fr": "Anti-l\xE9gionelles : dur\xE9e", "ja": "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56\uFF1A\u4FDD\u6301\u6642\u9593" }, "t": { "de": "Wie lange die hohe Temperatur gehalten wird, nachdem sie erreicht ist. Nur in 5-Minuten-Schritten. Panasonic-Werkseinstellung: 10 Minuten.", "en": "How long the high temperature is held once reached. Only in steps of 5 minutes. Panasonic factory setting: 10 minutes.", "fr": "Combien de temps la temp\xE9rature \xE9lev\xE9e est maintenue une fois atteinte. Par pas de 5 minutes. R\xE9glage d'usine Panasonic : 10 minutes.", "ja": "\u9AD8\u6E29\u306B\u9054\u3057\u3066\u304B\u3089\u4FDD\u3064\u6642\u9593\u3067\u3059\u30025 \u5206\u5358\u4F4D\u306E\u307F\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F 10 \u5206\u3067\u3059\u3002" } }, { "l": "TOP140", "s": "SetSmartDHW", "b": "0/1", "n": { "de": "Smart DHW", "en": "Smart DHW", "fr": "Smart DHW", "ja": "\u30B9\u30DE\u30FC\u30C8\u7D66\u6E6F" }, "t": { "de": "Laut HeishaMon 0 = variabel, 1 = standard. Panasonic beschreibt mit denselben Werten, ob der Speicher mit variabler oder mit fester (standard) Heizleistung geladen wird. Ob HeishaMon genau diese Einstellung meint, steht nicht in der Doku.", "en": "According to HeishaMon 0 = variable, 1 = standard. Panasonic uses the same values to describe whether the tank is heated with variable or fixed (standard) capacity. Whether HeishaMon means exactly this setting is not documented.", "fr": "Selon HeishaMon, 0 = variable, 1 = standard. Panasonic utilise les m\xEAmes valeurs pour indiquer si le ballon est chauff\xE9 avec une puissance variable ou fixe (standard). La documentation ne pr\xE9cise pas si HeishaMon d\xE9signe exactement ce r\xE9glage.", "ja": "HeishaMon \u3067\u306F 0 = \u53EF\u5909\u30011 = \u6A19\u6E96\u3067\u3059\u3002Panasonic \u306F\u540C\u3058\u5024\u3067\u3001\u30BF\u30F3\u30AF\u3092\u53EF\u5909\u306E\u80FD\u529B\u3067\u6CB8\u304B\u3059\u304B\u56FA\u5B9A\uFF08\u6A19\u6E96\uFF09\u306E\u80FD\u529B\u3067\u6CB8\u304B\u3059\u304B\u3092\u8AAC\u660E\u3057\u3066\u3044\u307E\u3059\u3002HeishaMon \u304C\u3053\u306E\u8A2D\u5B9A\u305D\u306E\u3082\u306E\u3092\u6307\u3059\u304B\u306F\u8AAC\u660E\u66F8\u306B\u66F8\u304B\u308C\u3066\u3044\u307E\u305B\u3093\u3002" } }, { "l": "TOP143", "s": "SetDHWSensorSelection", "b": "0/1", "n": { "de": "Warmwasser: F\xFChlerposition", "en": "Hot water: sensor position", "fr": "Eau chaude : position de la sonde", "ja": "\u7D66\u6E6F\uFF1A\u30BB\u30F3\u30B5\u30FC\u4F4D\u7F6E" }, "t": { "de": "Welcher F\xFChler im Speicher z\xE4hlt: 0 = oben, 1 = Mitte. Laut HeishaMon nur bei All-in-One-Ger\xE4ten der K- und L-Serie.", "en": "Which sensor in the tank counts: 0 = top, 1 = middle. According to HeishaMon only on K and L series all-in-one units.", "fr": "Quelle sonde du ballon est prise en compte : 0 = haut, 1 = milieu. Selon HeishaMon, uniquement sur les appareils tout-en-un des s\xE9ries K et L.", "ja": "\u30BF\u30F3\u30AF\u5185\u306E\u3069\u306E\u30BB\u30F3\u30B5\u30FC\u3092\u4F7F\u3046\u304B\uFF1A0 = \u4E0A\u30011 = \u4E2D\u592E\u3002HeishaMon \u306B\u3088\u308B\u3068 K\u30FBL \u30B7\u30EA\u30FC\u30BA\u306E\u30AA\u30FC\u30EB\u30A4\u30F3\u30EF\u30F3\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP100", "s": "", "b": "0/1", "n": { "de": "Warmwasserspeicher vorhanden", "en": "Hot water tank installed", "fr": "Ballon d'eau chaude pr\xE9sent", "ja": "\u7D66\u6E6F\u30BF\u30F3\u30AF\u3042\u308A" }, "t": { "de": "Zeigt, ob in der Anlage ein Warmwasserspeicher eingerichtet ist.", "en": "Shows whether a hot water tank is set up in the system.", "fr": "Indique si un ballon d'eau chaude est configur\xE9 dans l'installation.", "ja": "\u30B7\u30B9\u30C6\u30E0\u306B\u7D66\u6E6F\u30BF\u30F3\u30AF\u304C\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }] }, { "id": "puffer", "titel": { "de": "Puffer, Solar und Pool", "en": "Buffer, solar and pool", "fr": "Ballon tampon, solaire et piscine", "ja": "\u30D0\u30C3\u30D5\u30A1\u30FC\u30FB\u592A\u967D\u71B1\u30FB\u30D7\u30FC\u30EB" }, "e": [{ "l": "TOP46", "s": "", "b": "\xB0C", "n": { "de": "Puffertemperatur", "en": "Buffer temperature", "fr": "Temp\xE9rature du ballon tampon", "ja": "\u30D0\u30C3\u30D5\u30A1\u30FC\u6E29\u5EA6" }, "t": { "de": "Die Temperatur im Heizungspuffer. Ein Puffer ist ein Wassertank, der Heizw\xE4rme zwischenspeichert, damit die W\xE4rmepumpe seltener an- und ausgeht.", "en": "The temperature in the heating buffer tank. A buffer is a water tank that stores heating heat so that the heat pump switches on and off less often.", "fr": "La temp\xE9rature dans le ballon tampon. Un ballon tampon est un r\xE9servoir d'eau qui stocke la chaleur de chauffage pour que la pompe d\xE9marre et s'arr\xEAte moins souvent.", "ja": "\u6696\u623F\u7528\u30D0\u30C3\u30D5\u30A1\u30FC\u30BF\u30F3\u30AF\u306E\u6E29\u5EA6\u3067\u3059\u3002\u30D0\u30C3\u30D5\u30A1\u30FC\u306F\u6696\u623F\u306E\u71B1\u3092\u4E00\u6642\u7684\u306B\u305F\u3081\u308B\u6C34\u306E\u30BF\u30F3\u30AF\u3067\u3001\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u5165\u5207\u306E\u56DE\u6570\u3092\u6E1B\u3089\u3057\u307E\u3059\u3002" } }, { "l": "TOP99", "s": "SetBuffer", "b": "0/1", "n": { "de": "Puffer vorhanden", "en": "Buffer installed", "fr": "Ballon tampon pr\xE9sent", "ja": "\u30D0\u30C3\u30D5\u30A1\u30FC\u3042\u308A" }, "t": { "de": "Teilt der W\xE4rmepumpe mit, ob ein Heizungspuffer eingebaut ist. Nur \xE4ndern, wenn das der tats\xE4chlichen Anlage entspricht.", "en": "Tells the heat pump whether a heating buffer tank is installed. Only change this if it matches the actual system.", "fr": "Indique \xE0 la pompe si un ballon tampon est install\xE9. \xC0 ne modifier que si cela correspond \xE0 l'installation r\xE9elle.", "ja": "\u6696\u623F\u7528\u30D0\u30C3\u30D5\u30A1\u30FC\u304C\u8A2D\u7F6E\u3055\u308C\u3066\u3044\u308B\u304B\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306B\u4F1D\u3048\u307E\u3059\u3002\u5B9F\u969B\u306E\u8A2D\u5099\u3068\u5408\u3063\u3066\u3044\u308B\u5834\u5408\u3060\u3051\u5909\u66F4\u3057\u3066\u304F\u3060\u3055\u3044\u3002" } }, { "l": "TOP113", "s": "SetBufferDelta", "b": "0 \u2026 10 \xB0C", "n": { "de": "Puffer: Delta", "en": "Buffer: delta", "fr": "Ballon tampon : delta", "ja": "\u30D0\u30C3\u30D5\u30A1\u30FC\uFF1A\u30C7\u30EB\u30BF" }, "t": { "de": "Panasonic nennt diesen Wert nur \u201E\u0394T f\xFCr den Pufferspeicher\u201C, Werkseinstellung 5 \xB0C. Wie die W\xE4rmepumpe ihn genau verwendet, beschreiben weder Panasonic noch HeishaMon. Die Card zeigt daraus \u201EL\xE4dt ab\u201C als Soll minus Delta.", "en": "Panasonic only calls this value \u201C\u0394T for buffer tank\u201D, factory setting 5 \xB0C. Neither Panasonic nor HeishaMon describe exactly how the heat pump uses it. The card shows \u201CReloads at\u201D as target minus delta.", "fr": "Panasonic appelle simplement cette valeur \xAB \u0394T du ballon tampon \xBB, r\xE9glage d'usine 5 \xB0C. Ni Panasonic ni HeishaMon ne d\xE9crivent pr\xE9cis\xE9ment son usage. La carte affiche \xAB Recharge \xE0 \xBB comme consigne moins delta.", "ja": "Panasonic \u306F\u3053\u306E\u5024\u3092\u300C\u30D0\u30C3\u30D5\u30A1\u30FC\u30BF\u30F3\u30AF\u306E \u0394T\u300D\u3068\u3060\u3051\u8AAC\u660E\u3057\u3066\u304A\u308A\u3001\u5DE5\u5834\u51FA\u8377\u6642\u306F 5 \xB0C \u3067\u3059\u3002\u3069\u3046\u4F7F\u308F\u308C\u308B\u304B\u306F Panasonic \u3082 HeishaMon \u3082\u8A73\u3057\u304F\u66F8\u3044\u3066\u3044\u307E\u305B\u3093\u3002\u30AB\u30FC\u30C9\u3067\u306F\u300C\u8A2D\u5B9A\u5024 \u2212 \u30C7\u30EB\u30BF\u300D\u3092\u300C\u518D\u52A0\u71B1\u958B\u59CB\u300D\u3068\u3057\u3066\u8868\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP47", "s": "", "b": "\xB0C", "n": { "de": "Solartemperatur", "en": "Solar temperature", "fr": "Temp\xE9rature solaire", "ja": "\u592A\u967D\u71B1\u6E29\u5EA6" }, "t": { "de": "Die Temperatur am Solarkollektor, falls eine Solaranlage f\xFCr W\xE4rme angeschlossen ist.", "en": "The temperature at the solar collector, if a solar thermal system is connected.", "fr": "La temp\xE9rature au capteur solaire, si une installation solaire thermique est raccord\xE9e.", "ja": "\u592A\u967D\u71B1\u6E29\u6C34\u5668\u304C\u63A5\u7D9A\u3055\u308C\u3066\u3044\u308B\u5834\u5408\u306E\u3001\u96C6\u71B1\u5668\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP101", "s": "", "b": "0 \u2026 2", "n": { "de": "Solar: Betriebsart", "en": "Solar: mode", "fr": "Solaire : mode", "ja": "\u592A\u967D\u71B1\uFF1A\u30E2\u30FC\u30C9" }, "t": { "de": "Wohin die Solarw\xE4rme geht: aus, in den Puffer oder in den Warmwasserspeicher.", "en": "Where the solar heat goes: off, to the buffer or to the hot water tank.", "fr": "O\xF9 va la chaleur solaire : arr\xEAt, vers le ballon tampon ou vers le ballon d'eau chaude.", "ja": "\u592A\u967D\u71B1\u306E\u884C\u304D\u5148\uFF1A\u30AA\u30D5\u3001\u30D0\u30C3\u30D5\u30A1\u30FC\u3078\u3001\u307E\u305F\u306F\u7D66\u6E6F\u30BF\u30F3\u30AF\u3078\u3002" } }, { "l": "TOP102", "s": "", "b": "K", "n": { "de": "Solar: Einschaltdifferenz", "en": "Solar: switch-on difference", "fr": "Solaire : \xE9cart de mise en marche", "ja": "\u592A\u967D\u71B1\uFF1A\u904B\u8EE2\u958B\u59CB\u306E\u6E29\u5EA6\u5DEE" }, "t": { "de": "Um wie viel der Kollektor w\xE4rmer sein muss als der Speicher, damit die Solarpumpe anl\xE4uft.", "en": "How much warmer the collector must be than the tank for the solar pump to start.", "fr": "De combien le capteur doit \xEAtre plus chaud que le ballon pour que la pompe solaire d\xE9marre.", "ja": "\u96C6\u71B1\u5668\u304C\u30BF\u30F3\u30AF\u3088\u308A\u3069\u308C\u3060\u3051\u71B1\u304F\u306A\u3063\u305F\u3089\u592A\u967D\u71B1\u30DD\u30F3\u30D7\u3092\u52D5\u304B\u3059\u304B\u3067\u3059\u3002" } }, { "l": "TOP103", "s": "", "b": "K", "n": { "de": "Solar: Ausschaltdifferenz", "en": "Solar: switch-off difference", "fr": "Solaire : \xE9cart d'arr\xEAt", "ja": "\u592A\u967D\u71B1\uFF1A\u904B\u8EE2\u505C\u6B62\u306E\u6E29\u5EA6\u5DEE" }, "t": { "de": "Unterschreitet der Unterschied zwischen Kollektor und Speicher diesen Wert, stoppt die Solarpumpe.", "en": "If the difference between collector and tank falls below this value, the solar pump stops.", "fr": "Si l'\xE9cart entre capteur et ballon descend sous cette valeur, la pompe solaire s'arr\xEAte.", "ja": "\u96C6\u71B1\u5668\u3068\u30BF\u30F3\u30AF\u306E\u6E29\u5EA6\u5DEE\u304C\u3053\u306E\u5024\u3088\u308A\u5C0F\u3055\u304F\u306A\u308B\u3068\u3001\u592A\u967D\u71B1\u30DD\u30F3\u30D7\u3092\u6B62\u3081\u307E\u3059\u3002" } }, { "l": "TOP104", "s": "", "b": "\xB0C", "n": { "de": "Solar: Frostschutz", "en": "Solar: frost protection", "fr": "Solaire : protection antigel", "ja": "\u592A\u967D\u71B1\uFF1A\u51CD\u7D50\u9632\u6B62" }, "t": { "de": "Temperatur, ab der der Solarkreis vor Frost gesch\xFCtzt wird.", "en": "Temperature from which the solar circuit is protected against frost.", "fr": "Temp\xE9rature \xE0 partir de laquelle le circuit solaire est prot\xE9g\xE9 du gel.", "ja": "\u592A\u967D\u71B1\u56DE\u8DEF\u306E\u51CD\u7D50\u9632\u6B62\u3092\u59CB\u3081\u308B\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP105", "s": "", "b": "\xB0C", "n": { "de": "Solar: H\xF6chsttemperatur", "en": "Solar: maximum temperature", "fr": "Solaire : temp\xE9rature maximale", "ja": "\u592A\u967D\u71B1\uFF1A\u4E0A\u9650\u6E29\u5EA6" }, "t": { "de": "H\xF6chste Temperatur, bis zu der Solarw\xE4rme in den Speicher geladen wird.", "en": "Highest temperature up to which solar heat is loaded into the tank.", "fr": "Temp\xE9rature maximale jusqu'\xE0 laquelle la chaleur solaire est stock\xE9e dans le ballon.", "ja": "\u592A\u967D\u71B1\u3067\u30BF\u30F3\u30AF\u3092\u52A0\u71B1\u3059\u308B\u4E0A\u9650\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP48", "s": "", "b": "\xB0C", "n": { "de": "Pooltemperatur", "en": "Pool temperature", "fr": "Temp\xE9rature de la piscine", "ja": "\u30D7\u30FC\u30EB\u6E29\u5EA6" }, "t": { "de": "Die Wassertemperatur eines angeschlossenen Schwimmbeckens.", "en": "The water temperature of a connected swimming pool.", "fr": "La temp\xE9rature de l'eau d'une piscine raccord\xE9e.", "ja": "\u63A5\u7D9A\u3055\u308C\u305F\u30D7\u30FC\u30EB\u306E\u6C34\u6E29\u3067\u3059\u3002" } }] }, { "id": "heizstab", "titel": { "de": "Heizstab und zweiter W\xE4rmeerzeuger", "en": "Heater and second heat source", "fr": "Appoint et second g\xE9n\xE9rateur", "ja": "\u30D2\u30FC\u30BF\u30FC\u3068\u7B2C 2 \u71B1\u6E90" }, "e": [{ "l": "TOP59", "s": "SetRoomHeaterState", "b": "0/1", "n": { "de": "Heizstab Heizen freigegeben", "en": "Heating element for heating allowed", "fr": "Appoint chauffage autoris\xE9", "ja": "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF" }, "t": { "de": "Erlaubt oder sperrt den elektrischen Heizstab f\xFCr die Heizung. Freigegeben hei\xDFt nicht, dass er l\xE4uft: Die W\xE4rmepumpe schaltet ihn nur bei Bedarf zu, etwa bei gro\xDFer K\xE4lte. Ein Heizstab wandelt Strom direkt in W\xE4rme um und ist deutlich teurer als die W\xE4rmepumpe.", "en": "Allows or blocks the electric heater for space heating. Allowed does not mean it is running: the heat pump only adds it when needed, for example in severe cold. A heater turns electricity directly into heat and is much more expensive than the heat pump.", "fr": "Autorise ou bloque la r\xE9sistance \xE9lectrique pour le chauffage. Autoris\xE9 ne veut pas dire en marche : la pompe ne l'ajoute qu'en cas de besoin, par exemple par grand froid. Une r\xE9sistance transforme directement l'\xE9lectricit\xE9 en chaleur et co\xFBte bien plus cher que la pompe.", "ja": "\u6696\u623F\u7528\u306E\u96FB\u6C17\u30D2\u30FC\u30BF\u30FC\u3092\u8A31\u53EF\u307E\u305F\u306F\u7981\u6B62\u3057\u307E\u3059\u3002\u8A31\u53EF\u3057\u3066\u3082\u52D5\u304F\u3068\u306F\u9650\u3089\u305A\u3001\u53B3\u3057\u3044\u5BD2\u3055\u306A\u3069\u5FC5\u8981\u306A\u3068\u304D\u3060\u3051\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u8FFD\u52A0\u3067\u4F7F\u3044\u307E\u3059\u3002\u30D2\u30FC\u30BF\u30FC\u306F\u96FB\u6C17\u3092\u305D\u306E\u307E\u307E\u71B1\u306B\u5909\u3048\u308B\u305F\u3081\u3001\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3088\u308A\u304B\u306A\u308A\u9AD8\u304F\u3064\u304D\u307E\u3059\u3002" } }, { "l": "TOP58", "s": "SetDHWHeaterState", "b": "0/1", "n": { "de": "Heizstab Warmwasser freigegeben", "en": "Heater for hot water allowed", "fr": "Appoint eau chaude autoris\xE9", "ja": "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF" }, "t": { "de": "Erlaubt oder sperrt den Heizstab f\xFCr das Warmwasser. Auch hier gilt: freigegeben hei\xDFt nur, dass er bei Bedarf mitheizen darf.", "en": "Allows or blocks the heater for hot water. Here too, allowed only means it may help when needed.", "fr": "Autorise ou bloque la r\xE9sistance pour l'eau chaude. L\xE0 aussi, autoris\xE9 signifie seulement qu'elle peut aider en cas de besoin.", "ja": "\u7D66\u6E6F\u7528\u30D2\u30FC\u30BF\u30FC\u3092\u8A31\u53EF\u307E\u305F\u306F\u7981\u6B62\u3057\u307E\u3059\u3002\u3053\u3061\u3089\u3082\u3001\u8A31\u53EF\u306F\u5FC5\u8981\u306A\u3068\u304D\u306B\u52A0\u71B1\u3057\u3066\u3088\u3044\u3068\u3044\u3046\u610F\u5473\u3067\u3059\u3002" } }, { "l": "TOP60", "s": "", "b": "0/1", "n": { "de": "Interner Heizstab l\xE4uft", "en": "Internal heater running", "fr": "Appoint interne en marche", "ja": "\u5185\u90E8\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u4E2D" }, "t": { "de": "Zeigt, ob der eingebaute Heizstab gerade heizt.", "en": "Shows whether the built-in heater is currently heating.", "fr": "Indique si la r\xE9sistance int\xE9gr\xE9e chauffe actuellement.", "ja": "\u5185\u8535\u30D2\u30FC\u30BF\u30FC\u304C\u4ECA\u52A0\u71B1\u3057\u3066\u3044\u308B\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP61", "s": "", "b": "0/1", "n": { "de": "Externer Heizstab l\xE4uft", "en": "External heater running", "fr": "Appoint externe en marche", "ja": "\u5916\u90E8\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u4E2D" }, "t": { "de": "Zeigt, ob ein extern angeschlossener Heizstab gerade heizt.", "en": "Shows whether an externally connected heater is currently heating.", "fr": "Indique si une r\xE9sistance externe raccord\xE9e chauffe actuellement.", "ja": "\u5916\u90E8\u306B\u63A5\u7D9A\u3057\u305F\u30D2\u30FC\u30BF\u30FC\u304C\u4ECA\u52A0\u71B1\u3057\u3066\u3044\u308B\u304B\u3092\u793A\u3057\u307E\u3059\u3002" } }, { "l": "TOP78", "s": "SetHeaterOnOutdoorTemp", "b": "\u221215 \u2026 20 \xB0C", "n": { "de": "Heizstab erst unter Au\xDFentemperatur", "en": "Heater only below outdoor temp.", "fr": "Appoint seulement sous", "ja": "\u30D2\u30FC\u30BF\u30FC\u4F7F\u7528\u958B\u59CB\u5916\u6C17\u6E29" }, "t": { "de": "Erst wenn es drau\xDFen k\xE4lter ist als dieser Wert, darf die W\xE4rmepumpe den Heizstab f\xFCr die Heizung nutzen. Panasonic-Werkseinstellung: 0 \xB0C.", "en": "Only when it is colder outside than this value may the heat pump use the heater for space heating. Panasonic factory setting: 0 \xB0C.", "fr": "La pompe ne peut utiliser la r\xE9sistance pour le chauffage que s'il fait plus froid dehors que cette valeur. R\xE9glage d'usine Panasonic : 0 \xB0C.", "ja": "\u5916\u6C17\u6E29\u304C\u3053\u306E\u5024\u3088\u308A\u4F4E\u3044\u3068\u304D\u3060\u3051\u3001\u6696\u623F\u306B\u30D2\u30FC\u30BF\u30FC\u3092\u4F7F\u3048\u307E\u3059\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F 0 \xB0C \u3067\u3059\u3002" } }, { "l": "TOP68", "s": "SetForceHeater", "b": "0/1", "n": { "de": "Notheizung", "en": "Emergency heating", "fr": "Chauffage de secours", "ja": "\u7DCA\u6025\u6696\u623F" }, "t": { "de": "Heizt nur mit dem Heizstab, wie die Heizstab-Taste an der Fernbedienung. Gedacht f\xFCr den Notfall, wenn die W\xE4rmepumpe selbst nicht heizen kann. Verbraucht viel Strom.", "en": "Heats with the heater only, like the heater button on the remote control. Meant for emergencies when the heat pump itself cannot heat. Uses a lot of electricity.", "fr": "Chauffe uniquement avec la r\xE9sistance, comme la touche correspondante de la t\xE9l\xE9commande. Pr\xE9vu pour les urgences quand la pompe ne peut pas chauffer. Consomme beaucoup d'\xE9lectricit\xE9.", "ja": "\u30EA\u30E2\u30B3\u30F3\u306E\u30D2\u30FC\u30BF\u30FC\u30DC\u30BF\u30F3\u3068\u540C\u3058\u304F\u3001\u30D2\u30FC\u30BF\u30FC\u3060\u3051\u3067\u6696\u623F\u3057\u307E\u3059\u3002\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u81EA\u4F53\u304C\u6696\u623F\u3067\u304D\u306A\u3044\u7DCA\u6025\u6642\u7528\u3067\u3059\u3002\u96FB\u6C17\u3092\u591A\u304F\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP90", "s": "", "b": "h", "n": { "de": "Heizstab Heizen: Betriebsstunden", "en": "Heater for heating: hours", "fr": "Appoint chauffage : heures", "ja": "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\uFF1A\u904B\u8EE2\u6642\u9593" }, "t": { "de": "Wie viele Stunden der Heizstab bisher f\xFCr die Heizung gelaufen ist.", "en": "How many hours the heater has run for space heating so far.", "fr": "Nombre d'heures de fonctionnement de la r\xE9sistance pour le chauffage jusqu'ici.", "ja": "\u3053\u308C\u307E\u3067\u306B\u6696\u623F\u3067\u30D2\u30FC\u30BF\u30FC\u304C\u52D5\u3044\u305F\u6642\u9593\u3067\u3059\u3002" } }, { "l": "TOP91", "s": "", "b": "h", "n": { "de": "Heizstab Warmwasser: Betriebsstunden", "en": "Heater for hot water: hours", "fr": "Appoint eau chaude : heures", "ja": "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC\uFF1A\u904B\u8EE2\u6642\u9593" }, "t": { "de": "Wie viele Stunden der Heizstab bisher f\xFCr das Warmwasser gelaufen ist.", "en": "How many hours the heater has run for hot water so far.", "fr": "Nombre d'heures de fonctionnement de la r\xE9sistance pour l'eau chaude jusqu'ici.", "ja": "\u3053\u308C\u307E\u3067\u306B\u7D66\u6E6F\u3067\u30D2\u30FC\u30BF\u30FC\u304C\u52D5\u3044\u305F\u6642\u9593\u3067\u3059\u3002" } }, { "l": "TOP96", "s": "SetHeaterDelayTime", "b": "min", "n": { "de": "Heizstab: Verz\xF6gerung", "en": "Heater: delay", "fr": "Appoint : temporisation", "ja": "\u30D2\u30FC\u30BF\u30FC\uFF1A\u9045\u5EF6" }, "t": { "de": "Wartezeit, bevor der Heizstab zugeschaltet wird. Laut HeishaMon nur J-Serie.", "en": "Waiting time before the heater is added. According to HeishaMon J series only.", "fr": "D\xE9lai avant l'enclenchement de la r\xE9sistance. Selon HeishaMon, s\xE9rie J uniquement.", "ja": "\u30D2\u30FC\u30BF\u30FC\u3092\u8FFD\u52A0\u3059\u308B\u307E\u3067\u306E\u5F85\u3061\u6642\u9593\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 J \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP97", "s": "SetHeaterStartDelta", "b": "K", "n": { "de": "Heizstab: Einschaltdifferenz", "en": "Heater: start difference", "fr": "Appoint : \xE9cart d'enclenchement", "ja": "\u30D2\u30FC\u30BF\u30FC\uFF1A\u5165\u306E\u6E29\u5EA6\u5DEE" }, "t": { "de": "Temperaturunterschied, ab dem der Heizstab einschaltet. Laut HeishaMon nur J-Serie.", "en": "Temperature difference at which the heater switches on. According to HeishaMon J series only.", "fr": "\xC9cart de temp\xE9rature \xE0 partir duquel la r\xE9sistance s'enclenche. Selon HeishaMon, s\xE9rie J uniquement.", "ja": "\u30D2\u30FC\u30BF\u30FC\u304C\u5165\u308B\u6E29\u5EA6\u5DEE\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 J \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP98", "s": "SetHeaterStopDelta", "b": "K", "n": { "de": "Heizstab: Ausschaltdifferenz", "en": "Heater: stop difference", "fr": "Appoint : \xE9cart d'arr\xEAt", "ja": "\u30D2\u30FC\u30BF\u30FC\uFF1A\u5207\u306E\u6E29\u5EA6\u5DEE" }, "t": { "de": "Temperaturunterschied, ab dem der Heizstab wieder ausschaltet. Laut HeishaMon nur J-Serie.", "en": "Temperature difference at which the heater switches off again. According to HeishaMon J series only.", "fr": "\xC9cart de temp\xE9rature \xE0 partir duquel la r\xE9sistance se coupe. Selon HeishaMon, s\xE9rie J uniquement.", "ja": "\u30D2\u30FC\u30BF\u30FC\u304C\u5207\u308C\u308B\u6E29\u5EA6\u5DEE\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 J \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP114", "s": "SetExternalPadHeater", "b": "0 \u2026 2", "n": { "de": "Bodenwannenheizung", "en": "Base pan heater", "fr": "Chauffage du bac", "ja": "\u30D9\u30FC\u30B9\u30D1\u30F3\u30D2\u30FC\u30BF\u30FC" }, "t": { "de": "Eine kleine Heizung in der Wanne unter dem Au\xDFenger\xE4t, damit Tauwasser nicht festfriert. 0 = keine, 1 = Typ A, 2 = Typ B. Laut Panasonic l\xE4uft Typ A nur beim Abtauen, Typ B ab 5 \xB0C Au\xDFentemperatur und k\xE4lter.", "en": "A small heater in the tray under the outdoor unit so that defrost water does not freeze. 0 = none, 1 = type A, 2 = type B. According to Panasonic type A only runs during defrost, type B at an outdoor temperature of 5 \xB0C or below.", "fr": "Un petit chauffage dans le bac sous l'unit\xE9 ext\xE9rieure pour que l'eau de d\xE9givrage ne g\xE8le pas. 0 = aucun, 1 = type A, 2 = type B. Selon Panasonic, le type A ne fonctionne qu'au d\xE9givrage, le type B \xE0 5 \xB0C ext\xE9rieur ou moins.", "ja": "\u5BA4\u5916\u6A5F\u306E\u4E0B\u306E\u53D7\u3051\u76BF\u306B\u3042\u308B\u5C0F\u3055\u306A\u30D2\u30FC\u30BF\u30FC\u3067\u3001\u971C\u53D6\u308A\u306E\u6C34\u304C\u51CD\u3089\u306A\u3044\u3088\u3046\u306B\u3057\u307E\u3059\u30020 = \u306A\u3057\u30011 = \u30BF\u30A4\u30D7 A\u30012 = \u30BF\u30A4\u30D7 B\u3002Panasonic \u306B\u3088\u308B\u3068\u3001\u30BF\u30A4\u30D7 A \u306F\u971C\u53D6\u308A\u4E2D\u306E\u307F\u3001\u30BF\u30A4\u30D7 B \u306F\u5916\u6C17\u6E29 5 \xB0C \u4EE5\u4E0B\u3067\u52D5\u304D\u307E\u3059\u3002" } }, { "l": "TOP129", "s": "SetBivalentControl", "b": "0/1", "n": { "de": "Bivalent: ein/aus", "en": "Bivalent: on/off", "fr": "Bivalent : marche/arr\xEAt", "ja": "\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u5165/\u5207" }, "t": { "de": "Bivalent hei\xDFt: Es gibt einen zweiten W\xE4rmeerzeuger, zum Beispiel einen Gas- oder \xD6lkessel. Hier wird diese Zusammenarbeit ein- oder ausgeschaltet.", "en": "Bivalent means there is a second heat source, for example a gas or oil boiler. This switches that cooperation on or off.", "fr": "Bivalent signifie qu'il existe un second g\xE9n\xE9rateur de chaleur, par exemple une chaudi\xE8re gaz ou fioul. On active ou d\xE9sactive ici cette coop\xE9ration.", "ja": "\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\u3068\u306F\u3001\u30AC\u30B9\u3084\u77F3\u6CB9\u30DC\u30A4\u30E9\u30FC\u306A\u3069\u7B2C 2 \u306E\u71B1\u6E90\u304C\u3042\u308B\u3053\u3068\u3067\u3059\u3002\u305D\u306E\u9023\u643A\u3092\u5165\u5207\u3057\u307E\u3059\u3002" } }, { "l": "TOP130", "s": "SetBivalentMode", "b": "0 \u2026 2", "n": { "de": "Bivalent: Betriebsart", "en": "Bivalent: mode", "fr": "Bivalent : mode", "ja": "\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u30E2\u30FC\u30C9" }, "t": { "de": "0 = alternativ: Unter der Starttemperatur \xFCbernimmt der zweite W\xE4rmeerzeuger anstelle der W\xE4rmepumpe. 1 = parallel: Beide heizen gemeinsam. 2 = erweitert parallel: parallel mit eigenen Ein- und Ausschaltpunkten und Verz\xF6gerungen.", "en": "0 = alternative: below the start temperature the second heat source takes over instead of the heat pump. 1 = parallel: both heat together. 2 = advanced parallel: parallel with its own on and off points and delays.", "fr": "0 = alternatif : sous la temp\xE9rature de d\xE9marrage, le second g\xE9n\xE9rateur remplace la pompe. 1 = parall\xE8le : les deux chauffent ensemble. 2 = parall\xE8le avanc\xE9 : parall\xE8le avec ses propres seuils et temporisations.", "ja": "0 = \u5207\u66FF\uFF1A\u958B\u59CB\u6E29\u5EA6\u3088\u308A\u5BD2\u3044\u3068\u3001\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u4EE3\u308F\u308A\u306B\u7B2C 2 \u71B1\u6E90\u304C\u904B\u8EE2\u3057\u307E\u3059\u30021 = \u4E26\u5217\uFF1A\u4E21\u65B9\u3067\u6696\u623F\u3057\u307E\u3059\u30022 = \u62E1\u5F35\u4E26\u5217\uFF1A\u72EC\u81EA\u306E\u5165\u5207\u6E29\u5EA6\u3068\u9045\u5EF6\u3092\u6301\u3064\u4E26\u5217\u904B\u8EE2\u3067\u3059\u3002" } }, { "l": "TOP131", "s": "SetBivalentStartTemp", "b": "\u221215 \u2026 35 \xB0C", "n": { "de": "Bivalent: Starttemperatur", "en": "Bivalent: start temperature", "fr": "Bivalent : temp\xE9rature de d\xE9marrage", "ja": "\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u958B\u59CB\u6E29\u5EA6" }, "t": { "de": "Unter dieser Au\xDFentemperatur wird der zweite W\xE4rmeerzeuger genutzt. Panasonic-Werkseinstellung: \u22125 \xB0C.", "en": "Below this outdoor temperature the second heat source is used. Panasonic factory setting: \u22125 \xB0C.", "fr": "En dessous de cette temp\xE9rature ext\xE9rieure, le second g\xE9n\xE9rateur est utilis\xE9. R\xE9glage d'usine Panasonic : \u22125 \xB0C.", "ja": "\u3053\u306E\u5916\u6C17\u6E29\u3088\u308A\u5BD2\u3044\u3068\u7B2C 2 \u71B1\u6E90\u3092\u4F7F\u3044\u307E\u3059\u3002Panasonic \u306E\u5DE5\u5834\u51FA\u8377\u6642\u306F \u22125 \xB0C \u3067\u3059\u3002" } }, { "l": "TOP132", "s": "", "b": "0/1", "n": { "de": "Bivalent erweitert: Heizen", "en": "Bivalent advanced: heating", "fr": "Bivalent avanc\xE9 : chauffage", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u6696\u623F" }, "t": { "de": "Ob die erweiterte Parallelsteuerung beim Heizen aktiv ist.", "en": "Whether advanced parallel control is active for heating.", "fr": "Indique si la commande parall\xE8le avanc\xE9e est active pour le chauffage.", "ja": "\u6696\u623F\u3067\u62E1\u5F35\u4E26\u5217\u5236\u5FA1\u304C\u6709\u52B9\u304B\u3069\u3046\u304B\u3067\u3059\u3002" } }, { "l": "TOP133", "s": "", "b": "0/1", "n": { "de": "Bivalent erweitert: Warmwasser", "en": "Bivalent advanced: hot water", "fr": "Bivalent avanc\xE9 : eau chaude", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u7D66\u6E6F" }, "t": { "de": "Ob die erweiterte Parallelsteuerung beim Warmwasser aktiv ist.", "en": "Whether advanced parallel control is active for hot water.", "fr": "Indique si la commande parall\xE8le avanc\xE9e est active pour l'eau chaude.", "ja": "\u7D66\u6E6F\u3067\u62E1\u5F35\u4E26\u5217\u5236\u5FA1\u304C\u6709\u52B9\u304B\u3069\u3046\u304B\u3067\u3059\u3002" } }, { "l": "TOP134", "s": "SetBivalentAPStartTemp", "b": "\u221215 \u2026 35 \xB0C", "n": { "de": "Bivalent erweitert: Starttemperatur", "en": "Bivalent advanced: start temperature", "fr": "Bivalent avanc\xE9 : temp\xE9rature d'enclenchement", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u958B\u59CB\u6E29\u5EA6" }, "t": { "de": "Temperatur, ab der der zweite W\xE4rmeerzeuger im erweiterten Parallelbetrieb zuschaltet.", "en": "Temperature at which the second heat source switches on in advanced parallel mode.", "fr": "Temp\xE9rature \xE0 laquelle le second g\xE9n\xE9rateur s'enclenche en parall\xE8le avanc\xE9.", "ja": "\u62E1\u5F35\u4E26\u5217\u904B\u8EE2\u3067\u7B2C 2 \u71B1\u6E90\u304C\u52A0\u308F\u308B\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP135", "s": "SetBivalentAPStopTemp", "b": "\u221215 \u2026 35 \xB0C", "n": { "de": "Bivalent erweitert: Stopptemperatur", "en": "Bivalent advanced: stop temperature", "fr": "Bivalent avanc\xE9 : temp\xE9rature d'arr\xEAt", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u505C\u6B62\u6E29\u5EA6" }, "t": { "de": "Temperatur, ab der der zweite W\xE4rmeerzeuger im erweiterten Parallelbetrieb wieder abschaltet.", "en": "Temperature at which the second heat source switches off again in advanced parallel mode.", "fr": "Temp\xE9rature \xE0 laquelle le second g\xE9n\xE9rateur se coupe en parall\xE8le avanc\xE9.", "ja": "\u62E1\u5F35\u4E26\u5217\u904B\u8EE2\u3067\u7B2C 2 \u71B1\u6E90\u304C\u6B62\u307E\u308B\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP136", "s": "", "b": "min", "n": { "de": "Bivalent erweitert: Startverz\xF6gerung", "en": "Bivalent advanced: start delay", "fr": "Bivalent avanc\xE9 : d\xE9lai d'enclenchement", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u958B\u59CB\u9045\u5EF6" }, "t": { "de": "Wartezeit, bevor der zweite W\xE4rmeerzeuger zuschaltet.", "en": "Waiting time before the second heat source switches on.", "fr": "D\xE9lai avant l'enclenchement du second g\xE9n\xE9rateur.", "ja": "\u7B2C 2 \u71B1\u6E90\u304C\u52A0\u308F\u308B\u307E\u3067\u306E\u5F85\u3061\u6642\u9593\u3067\u3059\u3002" } }, { "l": "TOP137", "s": "", "b": "min", "n": { "de": "Bivalent erweitert: Stoppverz\xF6gerung", "en": "Bivalent advanced: stop delay", "fr": "Bivalent avanc\xE9 : d\xE9lai d'arr\xEAt", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u505C\u6B62\u9045\u5EF6" }, "t": { "de": "Wartezeit, bevor der zweite W\xE4rmeerzeuger wieder abschaltet.", "en": "Waiting time before the second heat source switches off again.", "fr": "D\xE9lai avant l'arr\xEAt du second g\xE9n\xE9rateur.", "ja": "\u7B2C 2 \u71B1\u6E90\u304C\u6B62\u307E\u308B\u307E\u3067\u306E\u5F85\u3061\u6642\u9593\u3067\u3059\u3002" } }, { "l": "TOP138", "s": "", "b": "min", "n": { "de": "Bivalent erweitert: Verz\xF6gerung Warmwasser", "en": "Bivalent advanced: hot water delay", "fr": "Bivalent avanc\xE9 : d\xE9lai eau chaude", "ja": "\u62E1\u5F35\u30D0\u30A4\u30D0\u30EC\u30F3\u30C8\uFF1A\u7D66\u6E6F\u306E\u9045\u5EF6" }, "t": { "de": "Wartezeit f\xFCr den zweiten W\xE4rmeerzeuger beim Warmwasser.", "en": "Waiting time for the second heat source for hot water.", "fr": "D\xE9lai du second g\xE9n\xE9rateur pour l'eau chaude.", "ja": "\u7D66\u6E6F\u3067\u7B2C 2 \u71B1\u6E90\u3092\u4F7F\u3046\u307E\u3067\u306E\u5F85\u3061\u6642\u9593\u3067\u3059\u3002" } }] }, { "id": "kaeltekreis", "titel": { "de": "Verdichter und K\xE4ltekreis", "en": "Compressor and refrigerant circuit", "fr": "Compresseur et circuit frigorifique", "ja": "\u5727\u7E2E\u6A5F\u3068\u51B7\u5A92\u56DE\u8DEF" }, "e": [{ "l": "", "s": "", "b": "", "n": { "de": "Wie die W\xE4rmepumpe arbeitet", "en": "How the heat pump works", "fr": "Fonctionnement de la pompe", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u3057\u304F\u307F" }, "t": { "de": "Im Au\xDFenger\xE4t l\xE4uft ein K\xE4ltemittel im Kreis. Es nimmt W\xE4rme aus der Au\xDFenluft auf, der Verdichter dr\xFCckt es zusammen und macht es dadurch hei\xDF, und im W\xE4rmetauscher gibt es diese W\xE4rme an das Heizwasser ab. Die Werte in dieser Gruppe beschreiben diesen Kreislauf und sind vor allem f\xFCr die Fehlersuche n\xFCtzlich.", "en": "A refrigerant circulates in the outdoor unit. It takes heat from the outside air, the compressor squeezes it and makes it hot, and in the heat exchanger it passes this heat to the heating water. The values in this group describe this circuit and are mainly useful for troubleshooting.", "fr": "Un fluide frigorig\xE8ne circule dans l'unit\xE9 ext\xE9rieure. Il prend la chaleur de l'air ext\xE9rieur, le compresseur le comprime et le rend chaud, puis l'\xE9changeur c\xE8de cette chaleur \xE0 l'eau de chauffage. Les valeurs de ce groupe d\xE9crivent ce circuit et servent surtout au diagnostic.", "ja": "\u5BA4\u5916\u6A5F\u306E\u4E2D\u3092\u51B7\u5A92\u304C\u5FAA\u74B0\u3057\u3066\u3044\u307E\u3059\u3002\u51B7\u5A92\u306F\u5916\u6C17\u304B\u3089\u71B1\u3092\u53D6\u308A\u8FBC\u307F\u3001\u5727\u7E2E\u6A5F\u3067\u5727\u7E2E\u3055\u308C\u3066\u9AD8\u6E29\u306B\u306A\u308A\u3001\u71B1\u4EA4\u63DB\u5668\u3067\u305D\u306E\u71B1\u3092\u6696\u623F\u306E\u6C34\u3078\u6E21\u3057\u307E\u3059\u3002\u3053\u306E\u30B0\u30EB\u30FC\u30D7\u306E\u5024\u306F\u3053\u306E\u56DE\u8DEF\u306E\u72B6\u614B\u3067\u3001\u4E3B\u306B\u6545\u969C\u306E\u8A3A\u65AD\u306B\u5F79\u7ACB\u3061\u307E\u3059\u3002" } }, { "l": "TOP8", "s": "", "b": "Hz", "n": { "de": "Verdichterdrehzahl", "en": "Compressor speed", "fr": "Vitesse du compresseur", "ja": "\u5727\u7E2E\u6A5F\u306E\u56DE\u8EE2\u6570" }, "t": { "de": "Wie schnell der Verdichter gerade l\xE4uft, in Hertz. 0 hei\xDFt: Er steht. H\xF6here Werte bedeuten mehr Leistung.", "en": "How fast the compressor is currently running, in hertz. 0 means it is stopped. Higher values mean more power.", "fr": "La vitesse actuelle du compresseur, en hertz. 0 signifie qu'il est \xE0 l'arr\xEAt. Une valeur plus haute signifie plus de puissance.", "ja": "\u5727\u7E2E\u6A5F\u306E\u4ECA\u306E\u56DE\u8EE2\u306E\u901F\u3055\uFF08\u30D8\u30EB\u30C4\uFF09\u3067\u3059\u30020 \u306F\u505C\u6B62\u4E2D\u3067\u3001\u5024\u304C\u5927\u304D\u3044\u307B\u3069\u51FA\u529B\u304C\u5927\u304D\u3044\u3067\u3059\u3002" } }, { "l": "TOP26", "s": "SetForceDefrost", "b": "0/1", "n": { "de": "Abtauen", "en": "Defrost", "fr": "D\xE9givrage", "ja": "\u971C\u53D6\u308A" }, "t": { "de": "Bei K\xE4lte kann das Au\xDFenger\xE4t vereisen. Beim Abtauen wird es kurz erw\xE4rmt, damit das Eis schmilzt; in dieser Zeit wird dem Heizwasser etwas W\xE4rme entzogen. Der Wert zeigt, ob gerade abgetaut wird. Der Befehl startet ein Abtauen von Hand.", "en": "In cold weather the outdoor unit can ice up. During defrost it is briefly warmed so that the ice melts; during this time some heat is taken from the heating water. The value shows whether defrost is running. The command starts a defrost manually.", "fr": "Par temps froid, l'unit\xE9 ext\xE9rieure peut givrer. Pendant le d\xE9givrage, elle est bri\xE8vement r\xE9chauff\xE9e pour faire fondre la glace ; un peu de chaleur est alors prise \xE0 l'eau de chauffage. La valeur indique si un d\xE9givrage est en cours. La commande en lance un manuellement.", "ja": "\u5BD2\u3044\u3068\u5BA4\u5916\u6A5F\u306B\u971C\u3084\u6C37\u304C\u4ED8\u304D\u307E\u3059\u3002\u971C\u53D6\u308A\u3067\u306F\u5BA4\u5916\u6A5F\u3092\u4E00\u6642\u7684\u306B\u6E29\u3081\u3066\u6C37\u3092\u6EB6\u304B\u3057\u3001\u305D\u306E\u9593\u306F\u6696\u623F\u306E\u6C34\u304B\u3089\u5C11\u3057\u71B1\u3092\u4F7F\u3044\u307E\u3059\u3002\u5024\u306F\u971C\u53D6\u308A\u4E2D\u304B\u3069\u3046\u304B\u3092\u793A\u3057\u3001\u547D\u4EE4\u3067\u624B\u52D5\u306E\u971C\u53D6\u308A\u3092\u958B\u59CB\u3057\u307E\u3059\u3002" } }, { "l": "TOP62", "s": "", "b": "1/min", "n": { "de": "L\xFCfter 1 Drehzahl", "en": "Fan 1 speed", "fr": "Vitesse du ventilateur 1", "ja": "\u30D5\u30A1\u30F3 1 \u306E\u56DE\u8EE2\u6570" }, "t": { "de": "Wie schnell der Ventilator im Au\xDFenger\xE4t dreht.", "en": "How fast the fan in the outdoor unit is turning.", "fr": "La vitesse de rotation du ventilateur de l'unit\xE9 ext\xE9rieure.", "ja": "\u5BA4\u5916\u6A5F\u306E\u30D5\u30A1\u30F3\u306E\u56DE\u8EE2\u306E\u901F\u3055\u3067\u3059\u3002" } }, { "l": "TOP63", "s": "", "b": "1/min", "n": { "de": "L\xFCfter 2 Drehzahl", "en": "Fan 2 speed", "fr": "Vitesse du ventilateur 2", "ja": "\u30D5\u30A1\u30F3 2 \u306E\u56DE\u8EE2\u6570" }, "t": { "de": "Wie schnell der zweite Ventilator im Au\xDFenger\xE4t dreht, falls vorhanden.", "en": "How fast the second fan in the outdoor unit is turning, if present.", "fr": "La vitesse du deuxi\xE8me ventilateur de l'unit\xE9 ext\xE9rieure, s'il existe.", "ja": "\u5BA4\u5916\u6A5F\u306B 2 \u53F0\u76EE\u306E\u30D5\u30A1\u30F3\u304C\u3042\u308B\u5834\u5408\u3001\u305D\u306E\u56DE\u8EE2\u306E\u901F\u3055\u3067\u3059\u3002" } }, { "l": "TOP67", "s": "", "b": "A", "n": { "de": "Stromst\xE4rke Au\xDFenger\xE4t", "en": "Outdoor unit current", "fr": "Courant de l'unit\xE9 ext\xE9rieure", "ja": "\u5BA4\u5916\u6A5F\u306E\u96FB\u6D41" }, "t": { "de": "Wie viel Strom (Ampere) Verdichter und Au\xDFenger\xE4t gerade aufnehmen.", "en": "How much current (amperes) the compressor and outdoor unit are currently drawing.", "fr": "Le courant (amp\xE8res) absorb\xE9 actuellement par le compresseur et l'unit\xE9 ext\xE9rieure.", "ja": "\u5727\u7E2E\u6A5F\u3068\u5BA4\u5916\u6A5F\u304C\u4ECA\u4F7F\u3063\u3066\u3044\u308B\u96FB\u6D41\uFF08\u30A2\u30F3\u30DA\u30A2\uFF09\u3067\u3059\u3002" } }, { "l": "TOP64", "s": "", "b": "kgf/cm\xB2", "n": { "de": "Hochdruck", "en": "High pressure", "fr": "Haute pression", "ja": "\u9AD8\u5727" }, "t": { "de": "Der Druck des K\xE4ltemittels auf der hei\xDFen Seite, nach dem Verdichter.", "en": "The refrigerant pressure on the hot side, after the compressor.", "fr": "La pression du fluide frigorig\xE8ne c\xF4t\xE9 chaud, apr\xE8s le compresseur.", "ja": "\u5727\u7E2E\u6A5F\u306E\u5F8C\u3001\u9AD8\u6E29\u5074\u306E\u51B7\u5A92\u306E\u5727\u529B\u3067\u3059\u3002" } }, { "l": "TOP66", "s": "", "b": "kgf/cm\xB2", "n": { "de": "Niederdruck", "en": "Low pressure", "fr": "Basse pression", "ja": "\u4F4E\u5727" }, "t": { "de": "Der Druck des K\xE4ltemittels auf der kalten Seite, vor dem Verdichter.", "en": "The refrigerant pressure on the cold side, before the compressor.", "fr": "La pression du fluide frigorig\xE8ne c\xF4t\xE9 froid, avant le compresseur.", "ja": "\u5727\u7E2E\u6A5F\u306E\u524D\u3001\u4F4E\u6E29\u5074\u306E\u51B7\u5A92\u306E\u5727\u529B\u3067\u3059\u3002" } }, { "l": "TOP50", "s": "", "b": "\xB0C", "n": { "de": "Hei\xDFgastemperatur", "en": "Discharge temperature", "fr": "Temp\xE9rature de refoulement", "ja": "\u5410\u51FA\u6E29\u5EA6" }, "t": { "de": "Die Temperatur des K\xE4ltemittels direkt hinter dem Verdichter. Das ist die hei\xDFeste Stelle im Kreislauf.", "en": "The refrigerant temperature right after the compressor. This is the hottest point in the circuit.", "fr": "La temp\xE9rature du fluide frigorig\xE8ne juste apr\xE8s le compresseur. C'est le point le plus chaud du circuit.", "ja": "\u5727\u7E2E\u6A5F\u3092\u51FA\u305F\u76F4\u5F8C\u306E\u51B7\u5A92\u306E\u6E29\u5EA6\u3067\u3001\u56DE\u8DEF\u3067\u6700\u3082\u71B1\u3044\u6240\u3067\u3059\u3002" } }, { "l": "TOP51", "s": "", "b": "\xB0C", "n": { "de": "Leitungstemperatur innen", "en": "Inside pipe temperature", "fr": "Temp\xE9rature tuyau int\xE9rieur", "ja": "\u5BA4\u5185\u5074\u914D\u7BA1\u6E29\u5EA6" }, "t": { "de": "Laut HeishaMon die Temperatur an einer K\xE4ltemittelleitung auf der Innenseite.", "en": "According to HeishaMon the temperature at a refrigerant pipe on the indoor side.", "fr": "Selon HeishaMon, la temp\xE9rature d'un tuyau de fluide frigorig\xE8ne c\xF4t\xE9 int\xE9rieur.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u5BA4\u5185\u5074\u306E\u51B7\u5A92\u914D\u7BA1\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP21", "s": "", "b": "\xB0C", "n": { "de": "Leitungstemperatur au\xDFen", "en": "Outside pipe temperature", "fr": "Temp\xE9rature tuyau ext\xE9rieur", "ja": "\u5BA4\u5916\u5074\u914D\u7BA1\u6E29\u5EA6" }, "t": { "de": "Laut HeishaMon die Temperatur an einer K\xE4ltemittelleitung im Au\xDFenger\xE4t.", "en": "According to HeishaMon the temperature at a refrigerant pipe in the outdoor unit.", "fr": "Selon HeishaMon, la temp\xE9rature d'un tuyau de fluide frigorig\xE8ne dans l'unit\xE9 ext\xE9rieure.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u5BA4\u5916\u6A5F\u306E\u51B7\u5A92\u914D\u7BA1\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP52", "s": "", "b": "\xB0C", "n": { "de": "Abtauf\xFChler", "en": "Defrost sensor", "fr": "Sonde de d\xE9givrage", "ja": "\u971C\u53D6\u308A\u30BB\u30F3\u30B5\u30FC" }, "t": { "de": "Laut HeishaMon die \u201EAbtau-Temperatur\u201C. Wof\xFCr die W\xE4rmepumpe diesen F\xFChler genau verwendet, beschreibt die Doku nicht.", "en": "According to HeishaMon the \u201Cdefrost temperature\u201D. The documentation does not describe exactly what the heat pump uses this sensor for.", "fr": "Selon HeishaMon, la \xAB temp\xE9rature de d\xE9givrage \xBB. La documentation ne pr\xE9cise pas l'usage exact de cette sonde.", "ja": "HeishaMon \u3067\u306F\u300C\u971C\u53D6\u308A\u6E29\u5EA6\u300D\u3068\u3055\u308C\u3066\u3044\u307E\u3059\u3002\u3053\u306E\u30BB\u30F3\u30B5\u30FC\u306E\u6B63\u78BA\u306A\u7528\u9014\u306F\u8AAC\u660E\u66F8\u306B\u66F8\u304B\u308C\u3066\u3044\u307E\u305B\u3093\u3002" } }, { "l": "TOP53", "s": "", "b": "\xB0C", "n": { "de": "Verdampferaustritt", "en": "Evaporator outlet", "fr": "Sortie \xE9vaporateur", "ja": "\u84B8\u767A\u5668\u51FA\u53E3" }, "t": { "de": "Die Temperatur des K\xE4ltemittels nach dem Verdampfer, also nachdem es W\xE4rme aus der Au\xDFenluft aufgenommen hat.", "en": "The refrigerant temperature after the evaporator, that is after it has taken heat from the outside air.", "fr": "La temp\xE9rature du fluide frigorig\xE8ne apr\xE8s l'\xE9vaporateur, donc apr\xE8s avoir pris la chaleur de l'air ext\xE9rieur.", "ja": "\u84B8\u767A\u5668\u3092\u51FA\u305F\u5F8C\u3001\u3064\u307E\u308A\u5916\u6C17\u304B\u3089\u71B1\u3092\u53D6\u308A\u8FBC\u3093\u3060\u5F8C\u306E\u51B7\u5A92\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP54", "s": "", "b": "\xB0C", "n": { "de": "Bypass-Austritt", "en": "Bypass outlet", "fr": "Sortie by-pass", "ja": "\u30D0\u30A4\u30D1\u30B9\u51FA\u53E3" }, "t": { "de": "Laut HeishaMon die Temperatur am Bypass-Austritt im K\xE4ltekreis. Genaueres beschreibt die Doku nicht.", "en": "According to HeishaMon the temperature at the bypass outlet in the refrigerant circuit. The documentation gives no further detail.", "fr": "Selon HeishaMon, la temp\xE9rature \xE0 la sortie by-pass du circuit frigorifique. La documentation n'en dit pas plus.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u51B7\u5A92\u56DE\u8DEF\u306E\u30D0\u30A4\u30D1\u30B9\u51FA\u53E3\u306E\u6E29\u5EA6\u3067\u3059\u3002\u8A73\u3057\u3044\u8AAC\u660E\u306F\u3042\u308A\u307E\u305B\u3093\u3002" } }, { "l": "TOP117", "s": "", "b": "\xB0C", "n": { "de": "Economizer-Austritt", "en": "Economizer outlet", "fr": "Sortie \xE9conomiseur", "ja": "\u30A8\u30B3\u30CE\u30DE\u30A4\u30B6\u30FC\u51FA\u53E3" }, "t": { "de": "Temperatur am Ausgang des Economizers, eines Bauteils im K\xE4ltekreis. Laut HeishaMon nur K- und L-Serie.", "en": "Temperature at the outlet of the economizer, a part of the refrigerant circuit. According to HeishaMon K and L series only.", "fr": "Temp\xE9rature \xE0 la sortie de l'\xE9conomiseur, un \xE9l\xE9ment du circuit frigorifique. Selon HeishaMon, s\xE9ries K et L uniquement.", "ja": "\u51B7\u5A92\u56DE\u8DEF\u306E\u90E8\u54C1\u3067\u3042\u308B\u30A8\u30B3\u30CE\u30DE\u30A4\u30B6\u30FC\u306E\u51FA\u53E3\u6E29\u5EA6\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 K\u30FBL \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP55", "s": "", "b": "\xB0C", "n": { "de": "Elektronik-Temperatur (IPM)", "en": "Electronics temperature (IPM)", "fr": "Temp\xE9rature \xE9lectronique (IPM)", "ja": "\u96FB\u5B50\u90E8\u54C1\u6E29\u5EA6\uFF08IPM\uFF09" }, "t": { "de": "Die Temperatur des Leistungsmoduls, das den Verdichter elektrisch ansteuert.", "en": "The temperature of the power module that electrically drives the compressor.", "fr": "La temp\xE9rature du module de puissance qui pilote \xE9lectriquement le compresseur.", "ja": "\u5727\u7E2E\u6A5F\u3092\u96FB\u6C17\u7684\u306B\u52D5\u304B\u3059\u30D1\u30EF\u30FC\u30E2\u30B8\u30E5\u30FC\u30EB\u306E\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "TOP142", "s": "", "b": "", "n": { "de": "Expansionsventil", "en": "Expansion valve", "fr": "D\xE9tendeur", "ja": "\u81A8\u5F35\u5F01" }, "t": { "de": "Die Stellung des Expansionsventils in Schritten. Dieses Ventil regelt, wie viel K\xE4ltemittel durch den Kreislauf flie\xDFt.", "en": "The position of the expansion valve in steps. This valve controls how much refrigerant flows through the circuit.", "fr": "La position du d\xE9tendeur en pas. Cette vanne r\xE8gle la quantit\xE9 de fluide frigorig\xE8ne qui circule.", "ja": "\u81A8\u5F35\u5F01\u306E\u958B\u5EA6\uFF08\u30B9\u30C6\u30C3\u30D7\uFF09\u3067\u3059\u3002\u3053\u306E\u5F01\u304C\u56DE\u8DEF\u3092\u6D41\u308C\u308B\u51B7\u5A92\u306E\u91CF\u3092\u8ABF\u6574\u3057\u307E\u3059\u3002" } }] }, { "id": "pumpe", "titel": { "de": "Pumpe, Ventile und Wasserkreis", "en": "Pump, valves and water circuit", "fr": "Pompe, vannes et circuit d'eau", "ja": "\u30DD\u30F3\u30D7\u30FB\u5F01\u30FB\u6C34\u56DE\u8DEF" }, "e": [{ "l": "TOP1", "s": "", "b": "l/min", "n": { "de": "Durchfluss", "en": "Flow rate", "fr": "D\xE9bit", "ja": "\u6D41\u91CF" }, "t": { "de": "Wie viel Wasser pro Minute durch die W\xE4rmepumpe flie\xDFt.", "en": "How much water flows through the heat pump per minute.", "fr": "La quantit\xE9 d'eau qui traverse la pompe \xE0 chaleur par minute.", "ja": "1 \u5206\u9593\u306B\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3092\u6D41\u308C\u308B\u6C34\u306E\u91CF\u3067\u3059\u3002" } }, { "l": "TOP65", "s": "", "b": "1/min", "n": { "de": "Pumpendrehzahl", "en": "Pump speed", "fr": "Vitesse de la pompe", "ja": "\u30DD\u30F3\u30D7\u56DE\u8EE2\u6570" }, "t": { "de": "Wie schnell die Umw\xE4lzpumpe der W\xE4rmepumpe dreht.", "en": "How fast the heat pump's circulation pump is turning.", "fr": "La vitesse de rotation du circulateur de la pompe \xE0 chaleur.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u5FAA\u74B0\u30DD\u30F3\u30D7\u306E\u56DE\u8EE2\u306E\u901F\u3055\u3067\u3059\u3002" } }, { "l": "TOP93", "s": "", "b": "", "n": { "de": "Pumpenansteuerung", "en": "Pump duty", "fr": "Commande de la pompe", "ja": "\u30DD\u30F3\u30D7\u51FA\u529B" }, "t": { "de": "Die aktuelle Ansteuerung (Leistungsstufe) der Umw\xE4lzpumpe.", "en": "The current drive level of the circulation pump.", "fr": "Le niveau de commande actuel du circulateur.", "ja": "\u5FAA\u74B0\u30DD\u30F3\u30D7\u306E\u4ECA\u306E\u51FA\u529B\u30EC\u30D9\u30EB\u3067\u3059\u3002" } }, { "l": "TOP95", "s": "SetMaxPumpDuty", "b": "64 \u2026 254", "n": { "de": "Maximale Pumpenleistung", "en": "Maximum pump duty", "fr": "Puissance max. de la pompe", "ja": "\u30DD\u30F3\u30D7\u6700\u5927\u51FA\u529B" }, "t": { "de": "Die h\xF6chste Leistungsstufe, mit der die Umw\xE4lzpumpe laufen darf. H\xF6her bedeutet mehr Durchfluss, aber auch mehr Strom und eventuell Str\xF6mungsger\xE4usche.", "en": "The highest level at which the circulation pump may run. Higher means more flow, but also more electricity and possibly flow noise.", "fr": "Le niveau maximal auquel le circulateur peut fonctionner. Plus haut signifie plus de d\xE9bit, mais aussi plus d'\xE9lectricit\xE9 et parfois des bruits d'\xE9coulement.", "ja": "\u5FAA\u74B0\u30DD\u30F3\u30D7\u3092\u52D5\u304B\u3057\u3066\u3088\u3044\u6700\u5927\u306E\u51FA\u529B\u30EC\u30D9\u30EB\u3067\u3059\u3002\u9AD8\u3044\u307B\u3069\u6D41\u91CF\u306F\u5897\u3048\u307E\u3059\u304C\u3001\u96FB\u6C17\u3082\u591A\u304F\u4F7F\u3044\u3001\u6C34\u306E\u6D41\u308C\u308B\u97F3\u304C\u51FA\u308B\u3053\u3068\u3082\u3042\u308A\u307E\u3059\u3002" } }, { "l": "TOP106", "s": "SetPumpFlowrateMode", "b": "0/1", "n": { "de": "Pumpenregelung", "en": "Pump control", "fr": "R\xE9gulation de la pompe", "ja": "\u30DD\u30F3\u30D7\u5236\u5FA1" }, "t": { "de": "0 = Spreizung (\u0394T): Die Pumpe passt ihre Drehzahl so an, dass der eingestellte Unterschied zwischen Vor- und R\xFCcklauf erreicht wird. 1 = maximale Leistung: Die Pumpe l\xE4uft fest mit der eingestellten H\xF6chstleistung. Laut HeishaMon wird der Wert nur bei der J-Serie gemeldet.", "en": "0 = spread (\u0394T): the pump adjusts its speed to reach the set difference between flow and return. 1 = max. duty: the pump runs fixed at the set maximum. According to HeishaMon the value is only reported on the J series.", "fr": "0 = \xE9cart (\u0394T) : la pompe adapte sa vitesse pour atteindre l'\xE9cart r\xE9gl\xE9 entre d\xE9part et retour. 1 = puissance max. : la pompe tourne en fixe \xE0 la puissance maximale r\xE9gl\xE9e. Selon HeishaMon, la valeur n'est transmise que sur la s\xE9rie J.", "ja": "0 = \u6E29\u5EA6\u5DEE\uFF08\u0394T\uFF09\uFF1A\u5F80\u304D\u3068\u623B\u308A\u306E\u5DEE\u304C\u8A2D\u5B9A\u5024\u306B\u306A\u308B\u3088\u3046\u56DE\u8EE2\u6570\u3092\u8ABF\u6574\u3057\u307E\u3059\u30021 = \u6700\u5927\u51FA\u529B\uFF1A\u8A2D\u5B9A\u3057\u305F\u6700\u5927\u51FA\u529B\u3067\u4E00\u5B9A\u306B\u904B\u8EE2\u3057\u307E\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068\u3001\u3053\u306E\u5024\u306F J \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u5831\u544A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "", "s": "SetPump", "b": "0/1", "n": { "de": "Pumpe Servicebetrieb", "en": "Pump service mode", "fr": "Pompe en mode service", "ja": "\u30DD\u30F3\u30D7 \u30B5\u30FC\u30D3\u30B9\u904B\u8EE2" }, "t": { "de": "L\xE4sst die Umw\xE4lzpumpe im Servicebetrieb mit voller Drehzahl laufen, etwa zum Entl\xFCften der Anlage. Nur f\xFCr Wartungsarbeiten gedacht.", "en": "Runs the circulation pump at full speed in service mode, for example to vent the system. Only meant for maintenance.", "fr": "Fait tourner le circulateur \xE0 pleine vitesse en mode service, par exemple pour purger l'installation. R\xE9serv\xE9 \xE0 l'entretien.", "ja": "\u30B5\u30FC\u30D3\u30B9\u904B\u8EE2\u3068\u3057\u3066\u5FAA\u74B0\u30DD\u30F3\u30D7\u3092\u6700\u9AD8\u56DE\u8EE2\u3067\u52D5\u304B\u3057\u307E\u3059\u3002\u914D\u7BA1\u306E\u30A8\u30A2\u629C\u304D\u306A\u3069\u3001\u4FDD\u5B88\u4F5C\u696D\u5C02\u7528\u3067\u3059\u3002" } }, { "l": "TOP115", "s": "", "b": "bar", "n": { "de": "Wasserdruck", "en": "Water pressure", "fr": "Pression d'eau", "ja": "\u6C34\u5727" }, "t": { "de": "Der Druck im Heizwasser. Ist er zu niedrig, muss meist Wasser nachgef\xFCllt werden; den richtigen Wert kennt der Installateur. Laut HeishaMon nur K- und L-Serie.", "en": "The pressure in the heating water. If it is too low, water usually has to be topped up; the installer knows the correct value. According to HeishaMon K and L series only.", "fr": "La pression de l'eau de chauffage. Si elle est trop basse, il faut g\xE9n\xE9ralement rajouter de l'eau ; l'installateur conna\xEEt la bonne valeur. Selon HeishaMon, s\xE9ries K et L uniquement.", "ja": "\u6696\u623F\u306E\u6C34\u306E\u5727\u529B\u3067\u3059\u3002\u4F4E\u3059\u304E\u308B\u5834\u5408\u306F\u901A\u5E38\u6C34\u306E\u88DC\u7D66\u304C\u5FC5\u8981\u3067\u3059\u3002\u9069\u6B63\u5024\u306F\u65BD\u5DE5\u696D\u8005\u304C\u77E5\u3063\u3066\u3044\u307E\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068 K\u30FBL \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "TOP20", "s": "", "b": "0/1", "n": { "de": "Umschaltventil", "en": "Three-way valve", "fr": "Vanne d'inversion", "ja": "\u4E09\u65B9\u5F01" }, "t": { "de": "Das Ventil, das das warme Wasser entweder in die Heizung (0 = Raum) oder in den Warmwasserspeicher (1 = Warmwasser) leitet. Beides gleichzeitig geht nicht.", "en": "The valve that sends the warm water either to the heating (0 = room) or to the hot water tank (1 = hot water). Both at once is not possible.", "fr": "La vanne qui envoie l'eau chaude soit vers le chauffage (0 = pi\xE8ce), soit vers le ballon d'eau chaude (1 = eau chaude). Les deux \xE0 la fois n'est pas possible.", "ja": "\u6E29\u6C34\u3092\u6696\u623F\uFF080 = \u5BA4\u5185\uFF09\u304B\u7D66\u6E6F\u30BF\u30F3\u30AF\uFF081 = \u7D66\u6E6F\uFF09\u306E\u3069\u3061\u3089\u304B\u3078\u9001\u308B\u5F01\u3067\u3059\u3002\u540C\u6642\u306B\u306F\u9001\u308C\u307E\u305B\u3093\u3002" } }, { "l": "TOP126", "s": "", "b": "0/1", "n": { "de": "Umschaltventil (zweite Meldung)", "en": "Three-way valve (second report)", "fr": "Vanne d'inversion (2e valeur)", "ja": "\u4E09\u65B9\u5F01\uFF082 \u3064\u76EE\u306E\u5024\uFF09" }, "t": { "de": "Laut HeishaMon eine zweite Meldung zum Umschaltventil. Wodurch sie sich von TOP20 unterscheidet, beschreibt die Doku nicht.", "en": "According to HeishaMon a second report of the three-way valve. The documentation does not say how it differs from TOP20.", "fr": "Selon HeishaMon, une deuxi\xE8me valeur de la vanne d'inversion. La documentation ne dit pas en quoi elle diff\xE8re de TOP20.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u4E09\u65B9\u5F01\u306E 2 \u3064\u76EE\u306E\u5024\u3067\u3059\u3002TOP20 \u3068\u306E\u9055\u3044\u306F\u8AAC\u660E\u66F8\u306B\u66F8\u304B\u308C\u3066\u3044\u307E\u305B\u3093\u3002" } }, { "l": "TOP125", "s": "", "b": "0/1", "n": { "de": "Zweiwegeventil", "en": "Two-way valve", "fr": "Vanne deux voies", "ja": "\u4E8C\u65B9\u5F01" }, "t": { "de": "Zustand eines Zweiwegeventils, das einen Wasserweg \xF6ffnet oder schlie\xDFt.", "en": "State of a two-way valve that opens or closes a water path.", "fr": "\xC9tat d'une vanne deux voies qui ouvre ou ferme un passage d'eau.", "ja": "\u6C34\u306E\u901A\u308A\u9053\u3092\u958B\u3051\u9589\u3081\u3059\u308B\u4E8C\u65B9\u5F01\u306E\u72B6\u614B\u3067\u3059\u3002" } }, { "l": "TOP124", "s": "", "b": "0/1", "n": { "de": "Zone 1: Pumpe", "en": "Zone 1: pump", "fr": "Zone 1 : pompe", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u30DD\u30F3\u30D7" }, "t": { "de": "Ob die Pumpe von Heizkreis 1 gerade l\xE4uft.", "en": "Whether the pump of heating circuit 1 is currently running.", "fr": "Indique si la pompe du circuit 1 fonctionne.", "ja": "\u6696\u623F\u56DE\u8DEF 1 \u306E\u30DD\u30F3\u30D7\u304C\u52D5\u3044\u3066\u3044\u308B\u304B\u3069\u3046\u304B\u3067\u3059\u3002" } }, { "l": "TOP123", "s": "", "b": "0/1", "n": { "de": "Zone 2: Pumpe", "en": "Zone 2: pump", "fr": "Zone 2 : pompe", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u30DD\u30F3\u30D7" }, "t": { "de": "Ob die Pumpe von Heizkreis 2 gerade l\xE4uft.", "en": "Whether the pump of heating circuit 2 is currently running.", "fr": "Indique si la pompe du circuit 2 fonctionne.", "ja": "\u6696\u623F\u56DE\u8DEF 2 \u306E\u30DD\u30F3\u30D7\u304C\u52D5\u3044\u3066\u3044\u308B\u304B\u3069\u3046\u304B\u3067\u3059\u3002" } }, { "l": "TOP127", "s": "", "b": "", "n": { "de": "Zone 1: Mischventil", "en": "Zone 1: mixing valve", "fr": "Zone 1 : vanne m\xE9langeuse", "ja": "\u30BE\u30FC\u30F3 1\uFF1A\u6DF7\u5408\u5F01" }, "t": { "de": "Laut HeishaMon der Regelwert (PID) f\xFCr das Mischventil von Zone 1. Ein Mischventil mischt kaltes R\xFCcklaufwasser bei, damit ein Heizkreis k\xFChleres Wasser bekommt.", "en": "According to HeishaMon the control value (PID) for the zone 1 mixing valve. A mixing valve adds cooler return water so that a circuit gets cooler water.", "fr": "Selon HeishaMon, la valeur de r\xE9gulation (PID) de la vanne m\xE9langeuse de la zone 1. Une vanne m\xE9langeuse ajoute de l'eau de retour plus froide pour qu'un circuit re\xE7oive une eau moins chaude.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u30BE\u30FC\u30F3 1 \u306E\u6DF7\u5408\u5F01\u306E\u5236\u5FA1\u5024\uFF08PID\uFF09\u3067\u3059\u3002\u6DF7\u5408\u5F01\u306F\u51B7\u3081\u305F\u623B\u308A\u6C34\u3092\u6DF7\u305C\u3001\u56DE\u8DEF\u306B\u306C\u308B\u3081\u306E\u6C34\u3092\u9001\u308A\u307E\u3059\u3002" } }, { "l": "TOP128", "s": "", "b": "", "n": { "de": "Zone 2: Mischventil", "en": "Zone 2: mixing valve", "fr": "Zone 2 : vanne m\xE9langeuse", "ja": "\u30BE\u30FC\u30F3 2\uFF1A\u6DF7\u5408\u5F01" }, "t": { "de": "Laut HeishaMon der Regelwert (PID) f\xFCr das Mischventil von Zone 2.", "en": "According to HeishaMon the control value (PID) for the zone 2 mixing valve.", "fr": "Selon HeishaMon, la valeur de r\xE9gulation (PID) de la vanne m\xE9langeuse de la zone 2.", "ja": "HeishaMon \u306B\u3088\u308B\u3068\u3001\u30BE\u30FC\u30F3 2 \u306E\u6DF7\u5408\u5F01\u306E\u5236\u5FA1\u5024\uFF08PID\uFF09\u3067\u3059\u3002" } }, { "l": "TOP107", "s": "", "b": "0/1", "n": { "de": "Fl\xFCssigkeit im Kreis", "en": "Liquid in the circuit", "fr": "Liquide du circuit", "ja": "\u56DE\u8DEF\u306E\u6DB2\u4F53" }, "t": { "de": "Ob im Heizkreis Wasser oder ein Frostschutzgemisch (Glykol) eingestellt ist.", "en": "Whether water or an antifreeze mixture (glycol) is set for the heating circuit.", "fr": "Indique si le circuit est r\xE9gl\xE9 sur eau ou sur m\xE9lange antigel (glycol).", "ja": "\u6696\u623F\u56DE\u8DEF\u304C\u6C34\u304B\u4E0D\u51CD\u6DB2\uFF08\u30B0\u30EA\u30B3\u30FC\u30EB\uFF09\u306E\u3069\u3061\u3089\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u304B\u3067\u3059\u3002" } }, { "l": "TOP109", "s": "", "b": "0/1", "n": { "de": "Frostschutz", "en": "Anti-freeze", "fr": "Antigel", "ja": "\u51CD\u7D50\u9632\u6B62" }, "t": { "de": "Laut Panasonic sch\xFCtzt diese Funktion das Wasser vor dem Einfrieren, wenn die Anlage ausgeschaltet ist.", "en": "According to Panasonic this function protects the water from freezing when the system is switched off.", "fr": "Selon Panasonic, cette fonction prot\xE8ge l'eau du gel lorsque l'installation est arr\xEAt\xE9e.", "ja": "Panasonic \u306B\u3088\u308B\u3068\u3001\u30B7\u30B9\u30C6\u30E0\u505C\u6B62\u4E2D\u306B\u6C34\u304C\u51CD\u308B\u306E\u3092\u9632\u3050\u6A5F\u80FD\u3067\u3059\u3002" } }] }, { "id": "energie", "titel": { "de": "Leistung und Energie", "en": "Power and energy", "fr": "Puissance et \xE9nergie", "ja": "\u51FA\u529B\u3068\u30A8\u30CD\u30EB\u30AE\u30FC" }, "e": [{ "l": "", "s": "", "b": "", "n": { "de": "Erzeugt und aufgenommen", "en": "Produced and consumed", "fr": "Produit et absorb\xE9", "ja": "\u751F\u6210\u3068\u6D88\u8CBB" }, "t": { "de": "\u201EErzeugt\u201C ist die W\xE4rme (oder K\xE4lte), die die W\xE4rmepumpe abgibt. \u201EAufgenommen\u201C ist der Strom, den sie daf\xFCr braucht. Teilt man erzeugt durch aufgenommen, erh\xE4lt man den COP: 4 bedeutet, aus 1 kW Strom werden 4 kW W\xE4rme.", "en": "\u201CProduced\u201D is the heat (or cooling) the heat pump delivers. \u201CConsumed\u201D is the electricity it needs for it. Dividing produced by consumed gives the COP: 4 means 1 kW of electricity becomes 4 kW of heat.", "fr": "\xAB Produit \xBB est la chaleur (ou le froid) fournie par la pompe. \xAB Absorb\xE9 \xBB est l'\xE9lectricit\xE9 n\xE9cessaire. Produit divis\xE9 par absorb\xE9 donne le COP : 4 signifie que 1 kW d'\xE9lectricit\xE9 donne 4 kW de chaleur.", "ja": "\u300C\u751F\u6210\u300D\u306F\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u51FA\u3059\u71B1\uFF08\u307E\u305F\u306F\u51B7\u71B1\uFF09\u3001\u300C\u6D88\u8CBB\u300D\u306F\u305D\u306E\u305F\u3081\u306B\u4F7F\u3046\u96FB\u6C17\u3067\u3059\u3002\u751F\u6210\u3092\u6D88\u8CBB\u3067\u5272\u308B\u3068 COP \u306B\u306A\u308A\u30014 \u306A\u3089 1 kW \u306E\u96FB\u6C17\u304B\u3089 4 kW \u306E\u71B1\u3092\u4F5C\u3063\u3066\u3044\u307E\u3059\u3002" } }, { "l": "TOP15", "s": "", "b": "W", "n": { "de": "Heizen: erzeugte W\xE4rme", "en": "Heating: heat produced", "fr": "Chauffage : chaleur produite", "ja": "\u6696\u623F\uFF1A\u751F\u6210\u71B1" }, "t": { "de": "Die Heizleistung, die die W\xE4rmepumpe meldet, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP3.", "en": "The heating power reported by the heat pump, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP3 instead.", "fr": "La puissance de chauffage transmise par la pompe, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP3.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u5831\u544A\u3059\u308B\u6696\u623F\u51FA\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP3 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP16", "s": "", "b": "W", "n": { "de": "Heizen: aufgenommener Strom", "en": "Heating: power consumed", "fr": "Chauffage : puissance absorb\xE9e", "ja": "\u6696\u623F\uFF1A\u6D88\u8CBB\u96FB\u529B" }, "t": { "de": "Der Stromverbrauch beim Heizen laut W\xE4rmepumpe, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP0.", "en": "The electricity used for heating according to the heat pump, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP0 instead.", "fr": "La consommation \xE9lectrique en chauffage selon la pompe, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP0.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306B\u3088\u308B\u6696\u623F\u6642\u306E\u6D88\u8CBB\u96FB\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP0 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP40", "s": "", "b": "W", "n": { "de": "Warmwasser: erzeugte W\xE4rme", "en": "Hot water: heat produced", "fr": "Eau chaude : chaleur produite", "ja": "\u7D66\u6E6F\uFF1A\u751F\u6210\u71B1" }, "t": { "de": "Die Leistung beim Warmwasserbereiten, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP5.", "en": "The power while heating hot water, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP5 instead.", "fr": "La puissance pendant la production d'eau chaude, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP5.", "ja": "\u7D66\u6E6F\u4E2D\u306E\u51FA\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP5 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP41", "s": "", "b": "W", "n": { "de": "Warmwasser: aufgenommener Strom", "en": "Hot water: power consumed", "fr": "Eau chaude : puissance absorb\xE9e", "ja": "\u7D66\u6E6F\uFF1A\u6D88\u8CBB\u96FB\u529B" }, "t": { "de": "Der Stromverbrauch beim Warmwasserbereiten, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP2.", "en": "The electricity used while heating hot water, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP2 instead.", "fr": "La consommation pendant la production d'eau chaude, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP2.", "ja": "\u7D66\u6E6F\u4E2D\u306E\u6D88\u8CBB\u96FB\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP2 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP38", "s": "", "b": "W", "n": { "de": "K\xFChlen: erzeugte K\xE4lte", "en": "Cooling: cooling produced", "fr": "Rafra\xEEchissement : froid produit", "ja": "\u51B7\u623F\uFF1A\u751F\u6210\u51B7\u71B1" }, "t": { "de": "Die K\xFChlleistung, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP4.", "en": "The cooling power, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP4 instead.", "fr": "La puissance de rafra\xEEchissement, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP4.", "ja": "\u51B7\u623F\u51FA\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP4 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "TOP39", "s": "", "b": "W", "n": { "de": "K\xFChlen: aufgenommener Strom", "en": "Cooling: power consumed", "fr": "Rafra\xEEchissement : puissance absorb\xE9e", "ja": "\u51B7\u623F\uFF1A\u6D88\u8CBB\u96FB\u529B" }, "t": { "de": "Der Stromverbrauch beim K\xFChlen, in Schritten von 200 W. Bei Ger\xE4ten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ung\xFCltig, dort gilt XTOP1.", "en": "The electricity used for cooling, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP1 instead.", "fr": "La consommation en rafra\xEEchissement, par pas de 200 W. Sur les appareils avec valeurs suppl\xE9mentaires pr\xE9cises (s\xE9ries K/L et plus r\xE9centes), cette valeur n'est pas valable, utilisez XTOP1.", "ja": "\u51B7\u623F\u6642\u306E\u6D88\u8CBB\u96FB\u529B\u3067\u3001200 W \u5358\u4F4D\u3067\u3059\u3002 \u8A73\u7D30\u306A\u8FFD\u52A0\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u6A5F\u7A2E\uFF08K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\uFF09\u3067\u306F\u3053\u306E\u5024\u306F\u7121\u52B9\u3067\u3001XTOP1 \u3092\u4F7F\u3044\u307E\u3059\u3002" } }, { "l": "XTOP3", "s": "", "b": "W", "n": { "de": "Heizen: erzeugte W\xE4rme (genau)", "en": "Heating: heat produced (precise)", "fr": "Chauffage : chaleur produite (pr\xE9cis)", "ja": "\u6696\u623F\uFF1A\u751F\u6210\u71B1\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Die Heizleistung auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The heating power to the watt. Precise value, only on K/L series and newer units.", "fr": "La puissance de chauffage au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u6696\u623F\u51FA\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }, { "l": "XTOP0", "s": "", "b": "W", "n": { "de": "Heizen: aufgenommener Strom (genau)", "en": "Heating: power consumed (precise)", "fr": "Chauffage : puissance absorb\xE9e (pr\xE9cis)", "ja": "\u6696\u623F\uFF1A\u6D88\u8CBB\u96FB\u529B\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Der Stromverbrauch beim Heizen auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The electricity used for heating, to the watt. Precise value, only on K/L series and newer units.", "fr": "La consommation en chauffage au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u6696\u623F\u6642\u306E\u6D88\u8CBB\u96FB\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }, { "l": "XTOP5", "s": "", "b": "W", "n": { "de": "Warmwasser: erzeugte W\xE4rme (genau)", "en": "Hot water: heat produced (precise)", "fr": "Eau chaude : chaleur produite (pr\xE9cis)", "ja": "\u7D66\u6E6F\uFF1A\u751F\u6210\u71B1\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Die Leistung beim Warmwasserbereiten auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The power while heating hot water, to the watt. Precise value, only on K/L series and newer units.", "fr": "La puissance de production d'eau chaude au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u7D66\u6E6F\u4E2D\u306E\u51FA\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }, { "l": "XTOP2", "s": "", "b": "W", "n": { "de": "Warmwasser: aufgenommener Strom (genau)", "en": "Hot water: power consumed (precise)", "fr": "Eau chaude : puissance absorb\xE9e (pr\xE9cis)", "ja": "\u7D66\u6E6F\uFF1A\u6D88\u8CBB\u96FB\u529B\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Der Stromverbrauch beim Warmwasserbereiten auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The electricity used for hot water, to the watt. Precise value, only on K/L series and newer units.", "fr": "La consommation pour l'eau chaude au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u7D66\u6E6F\u4E2D\u306E\u6D88\u8CBB\u96FB\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }, { "l": "XTOP4", "s": "", "b": "W", "n": { "de": "K\xFChlen: erzeugte K\xE4lte (genau)", "en": "Cooling: cooling produced (precise)", "fr": "Rafra\xEEchissement : froid produit (pr\xE9cis)", "ja": "\u51B7\u623F\uFF1A\u751F\u6210\u51B7\u71B1\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Die K\xFChlleistung auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The cooling power to the watt. Precise value, only on K/L series and newer units.", "fr": "La puissance de rafra\xEEchissement au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u51B7\u623F\u51FA\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }, { "l": "XTOP1", "s": "", "b": "W", "n": { "de": "K\xFChlen: aufgenommener Strom (genau)", "en": "Cooling: power consumed (precise)", "fr": "Rafra\xEEchissement : puissance absorb\xE9e (pr\xE9cis)", "ja": "\u51B7\u623F\uFF1A\u6D88\u8CBB\u96FB\u529B\uFF08\u8A73\u7D30\uFF09" }, "t": { "de": "Der Stromverbrauch beim K\xFChlen auf das Watt genau. Genauer Wert, nur bei Ger\xE4ten der K/L-Serie und neuer.", "en": "The electricity used for cooling, to the watt. Precise value, only on K/L series and newer units.", "fr": "La consommation en rafra\xEEchissement au watt pr\xE8s. Valeur pr\xE9cise, uniquement sur les s\xE9ries K/L et plus r\xE9centes.", "ja": "\u51B7\u623F\u6642\u306E\u6D88\u8CBB\u96FB\u529B\u3092 1 W \u5358\u4F4D\u3067\u793A\u3057\u307E\u3059\u3002 \u8A73\u7D30\u306A\u5024\u3067\u3001K/L \u30B7\u30EA\u30FC\u30BA\u4EE5\u964D\u306E\u6A5F\u7A2E\u306E\u307F\u3067\u3059\u3002" } }] }, { "id": "geraet", "titel": { "de": "St\xF6rung, Z\xE4hler und Ger\xE4t", "en": "Faults, counters and device", "fr": "D\xE9fauts, compteurs et appareil", "ja": "\u7570\u5E38\u30FB\u30AB\u30A6\u30F3\u30BF\u30FC\u30FB\u6A5F\u5668" }, "e": [{ "l": "TOP44", "s": "", "b": "", "n": { "de": "Fehlercode", "en": "Error code", "fr": "Code d'erreur", "ja": "\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9" }, "t": { "de": "Der letzte Fehler, den die W\xE4rmepumpe gemeldet hat, zum Beispiel H72. Was ein Code bedeutet, steht in der Panasonic-Anleitung oder wei\xDF der Installateur.", "en": "The last error reported by the heat pump, for example H72. The Panasonic manual or the installer can tell what a code means.", "fr": "La derni\xE8re erreur signal\xE9e par la pompe, par exemple H72. La signification d'un code figure dans la notice Panasonic ou est connue de l'installateur.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u5831\u544A\u3057\u305F\u6700\u5F8C\u306E\u30A8\u30E9\u30FC\uFF08\u4F8B\uFF1AH72\uFF09\u3067\u3059\u3002\u30B3\u30FC\u30C9\u306E\u610F\u5473\u306F Panasonic \u306E\u8AAC\u660E\u66F8\u304B\u65BD\u5DE5\u696D\u8005\u3067\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002" } }, { "l": "", "s": "SetReset", "b": "1", "n": { "de": "St\xF6rung quittieren", "en": "Reset fault", "fr": "Acquitter le d\xE9faut", "ja": "\u7570\u5E38\u30EA\u30BB\u30C3\u30C8" }, "t": { "de": "Setzt einen anliegenden Fehler zur\xFCck, wie die Taste \u201EReset\u201C an der Fernbedienung. Laut HeishaMon l\xF6scht das auch Fehler, die Aus- und Einschalten nicht l\xF6scht. Die Ursache des Fehlers wird dadurch nicht behoben.", "en": "Resets an active error, like the \u201CReset\u201D button on the remote control. According to HeishaMon this also clears errors that switching off and on does not clear. It does not fix the cause of the error.", "fr": "R\xE9initialise une erreur en cours, comme la touche \xAB Reset \xBB de la t\xE9l\xE9commande. Selon HeishaMon, cela efface aussi les erreurs qu'un arr\xEAt-marche n'efface pas. La cause de l'erreur n'est pas corrig\xE9e pour autant.", "ja": "\u30EA\u30E2\u30B3\u30F3\u306E\u300C\u30EA\u30BB\u30C3\u30C8\u300D\u3068\u540C\u3058\u304F\u3001\u767A\u751F\u4E2D\u306E\u30A8\u30E9\u30FC\u3092\u89E3\u9664\u3057\u307E\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068\u3001\u5165\u5207\u3067\u306F\u6D88\u3048\u306A\u3044\u30A8\u30E9\u30FC\u3082\u6D88\u305B\u307E\u3059\u3002\u30A8\u30E9\u30FC\u306E\u539F\u56E0\u305D\u306E\u3082\u306E\u306F\u76F4\u308A\u307E\u305B\u3093\u3002" } }, { "l": "TOP11", "s": "", "b": "h", "n": { "de": "Betriebsstunden", "en": "Operating hours", "fr": "Heures de fonctionnement", "ja": "\u904B\u8EE2\u6642\u9593" }, "t": { "de": "Wie viele Stunden die W\xE4rmepumpe insgesamt gelaufen ist.", "en": "How many hours the heat pump has run in total.", "fr": "Le nombre total d'heures de fonctionnement de la pompe.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u904B\u8EE2\u3057\u305F\u5408\u8A08\u6642\u9593\u3067\u3059\u3002" } }, { "l": "TOP12", "s": "", "b": "", "n": { "de": "Starts", "en": "Starts", "fr": "D\xE9marrages", "ja": "\u8D77\u52D5\u56DE\u6570" }, "t": { "de": "Wie oft die W\xE4rmepumpe insgesamt gestartet ist. Sehr viele Starts im Verh\xE4ltnis zu den Betriebsstunden k\xF6nnen ein Hinweis auf h\xE4ufiges An- und Ausschalten sein.", "en": "How many times the heat pump has started in total. Very many starts compared with the operating hours can indicate frequent on/off switching.", "fr": "Le nombre total de d\xE9marrages de la pompe. Beaucoup de d\xE9marrages par rapport aux heures peuvent indiquer des marches/arr\xEAts fr\xE9quents.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u8D77\u52D5\u3057\u305F\u5408\u8A08\u56DE\u6570\u3067\u3059\u3002\u904B\u8EE2\u6642\u9593\u306B\u6BD4\u3079\u3066\u8D77\u52D5\u304C\u3068\u3066\u3082\u591A\u3044\u5834\u5408\u3001\u5165\u5207\u304C\u983B\u7E41\u306A\u3053\u3068\u3092\u793A\u3057\u3066\u3044\u308B\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002" } }, { "l": "TOP92", "s": "", "b": "", "n": { "de": "Ger\xE4temodell", "en": "Device model", "fr": "Mod\xE8le de l'appareil", "ja": "\u6A5F\u7A2E" }, "t": { "de": "Das Modell der W\xE4rmepumpe, wie HeishaMon es erkennt.", "en": "The heat pump model as detected by HeishaMon.", "fr": "Le mod\xE8le de pompe \xE0 chaleur reconnu par HeishaMon.", "ja": "HeishaMon \u304C\u8A8D\u8B58\u3057\u305F\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u6A5F\u7A2E\u3067\u3059\u3002" } }] }, { "id": "extern", "titel": { "de": "Externe Steuerung und F\xFChler", "en": "External control and sensors", "fr": "Commande externe et sondes", "ja": "\u5916\u90E8\u5236\u5FA1\u3068\u30BB\u30F3\u30B5\u30FC" }, "e": [{ "l": "TOP108", "s": "SetAltExternalSensor", "b": "0/1", "n": { "de": "Externer Au\xDFenf\xFChler", "en": "External outdoor sensor", "fr": "Sonde ext\xE9rieure externe", "ja": "\u5916\u90E8\u5916\u6C17\u30BB\u30F3\u30B5\u30FC" }, "t": { "de": "Ob statt des F\xFChlers im Au\xDFenger\xE4t ein separat montierter Au\xDFenf\xFChler verwendet wird.", "en": "Whether a separately mounted outdoor sensor is used instead of the sensor in the outdoor unit.", "fr": "Indique si une sonde ext\xE9rieure mont\xE9e s\xE9par\xE9ment remplace celle de l'unit\xE9 ext\xE9rieure.", "ja": "\u5BA4\u5916\u6A5F\u306E\u30BB\u30F3\u30B5\u30FC\u306E\u4EE3\u308F\u308A\u306B\u3001\u5225\u306B\u53D6\u308A\u4ED8\u3051\u305F\u5916\u6C17\u30BB\u30F3\u30B5\u30FC\u3092\u4F7F\u3046\u304B\u3069\u3046\u304B\u3067\u3059\u3002" } }, { "l": "TOP119", "s": "SetExternalControl", "b": "0/1", "n": { "de": "Externer Schalteingang", "en": "External switch input", "fr": "Entr\xE9e commutateur externe", "ja": "\u5916\u90E8\u30B9\u30A4\u30C3\u30C1\u5165\u529B" }, "t": { "de": "Ob der Eingang f\xFCr einen externen Schalter an der W\xE4rmepumpe aktiviert ist. Was ein Signal dort genau bewirkt, beschreiben HeishaMon und Panasonic nicht.", "en": "Whether the input for an external switch on the heat pump is enabled. HeishaMon and Panasonic do not describe exactly what a signal there does.", "fr": "Indique si l'entr\xE9e pour un commutateur externe est activ\xE9e. HeishaMon et Panasonic ne d\xE9crivent pas pr\xE9cis\xE9ment l'effet d'un signal.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u5916\u90E8\u30B9\u30A4\u30C3\u30C1\u7528\u5165\u529B\u304C\u6709\u52B9\u304B\u3069\u3046\u304B\u3067\u3059\u3002\u305D\u3053\u3078\u306E\u4FE1\u53F7\u304C\u4F55\u3092\u3059\u308B\u304B\u306F HeishaMon \u3082 Panasonic \u3082\u8A73\u3057\u304F\u66F8\u3044\u3066\u3044\u307E\u305B\u3093\u3002" } }, { "l": "TOP121", "s": "SetExternalError", "b": "0/1", "n": { "de": "Externes Fehlersignal", "en": "External error signal", "fr": "Signal d'erreur externe", "ja": "\u5916\u90E8\u30A8\u30E9\u30FC\u4FE1\u53F7" }, "t": { "de": "Ob die W\xE4rmepumpe ein Fehlersignal von au\xDFen auswertet. Genaueres beschreibt die Doku nicht.", "en": "Whether the heat pump evaluates an error signal from outside. The documentation gives no further detail.", "fr": "Indique si la pompe prend en compte un signal d'erreur externe. La documentation n'en dit pas plus.", "ja": "\u5916\u90E8\u304B\u3089\u306E\u30A8\u30E9\u30FC\u4FE1\u53F7\u3092\u4F7F\u3046\u304B\u3069\u3046\u304B\u3067\u3059\u3002\u8A73\u3057\u3044\u8AAC\u660E\u306F\u3042\u308A\u307E\u305B\u3093\u3002" } }, { "l": "TOP120", "s": "SetExternalHeatCoolControl", "b": "0/1", "n": { "de": "Externer Heizen/K\xFChlen-Schalter", "en": "External heat/cool switch", "fr": "Commutateur chaud/froid externe", "ja": "\u5916\u90E8 \u6696\u623F/\u51B7\u623F\u30B9\u30A4\u30C3\u30C1" }, "t": { "de": "Ob ein externer Schalter zwischen Heizen und K\xFChlen umschalten darf. Laut HeishaMon eine Einstellung der Optional-Platine.", "en": "Whether an external switch may change between heating and cooling. According to HeishaMon a setting of the optional board.", "fr": "Indique si un commutateur externe peut passer du chauffage au rafra\xEEchissement. Selon HeishaMon, un r\xE9glage de la carte optionnelle.", "ja": "\u5916\u90E8\u30B9\u30A4\u30C3\u30C1\u3067\u6696\u623F\u3068\u51B7\u623F\u3092\u5207\u308A\u66FF\u3048\u3089\u308C\u308B\u304B\u3069\u3046\u304B\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u8A2D\u5B9A\u3067\u3059\u3002" } }, { "l": "TOP122", "s": "SetExternalCompressorControl", "b": "0/1", "n": { "de": "Externe Verdichtersteuerung", "en": "External compressor control", "fr": "Commande externe du compresseur", "ja": "\u5916\u90E8\u5727\u7E2E\u6A5F\u5236\u5FA1" }, "t": { "de": "Ob der Verdichter von au\xDFen freigegeben oder gesperrt werden darf. Laut HeishaMon eine Einstellung der Optional-Platine.", "en": "Whether the compressor may be allowed or blocked from outside. According to HeishaMon a setting of the optional board.", "fr": "Indique si le compresseur peut \xEAtre autoris\xE9 ou bloqu\xE9 de l'ext\xE9rieur. Selon HeishaMon, un r\xE9glage de la carte optionnelle.", "ja": "\u5916\u90E8\u304B\u3089\u5727\u7E2E\u6A5F\u3092\u8A31\u53EF\u30FB\u7981\u6B62\u3067\u304D\u308B\u304B\u3069\u3046\u304B\u3067\u3059\u3002HeishaMon \u306B\u3088\u308B\u3068\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u8A2D\u5B9A\u3067\u3059\u3002" } }, { "l": "TOP110", "s": "", "b": "0/1", "n": { "de": "Optional-Platine aktiv", "en": "Optional board enabled", "fr": "Carte optionnelle active", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u6709\u52B9" }, "t": { "de": "Ob in der W\xE4rmepumpe die Optional-Platine eingeschaltet ist. Diese Zusatzplatine bietet weitere Anschl\xFCsse, etwa f\xFCr SG Ready, Pool oder Solar.", "en": "Whether the optional board is enabled in the heat pump. This extra board provides more connections, for example for SG Ready, pool or solar.", "fr": "Indique si la carte optionnelle est activ\xE9e. Cette carte suppl\xE9mentaire offre d'autres raccordements, par exemple SG Ready, piscine ou solaire.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u304C\u6709\u52B9\u304B\u3069\u3046\u304B\u3067\u3059\u3002SG Ready\u3001\u30D7\u30FC\u30EB\u3001\u592A\u967D\u71B1\u306A\u3069\u306E\u8FFD\u52A0\u63A5\u7D9A\u304C\u3067\u304D\u308B\u57FA\u677F\u3067\u3059\u3002" } }] }, { "id": "optional", "titel": { "de": "Optional-Platine", "en": "Optional board", "fr": "Carte optionnelle", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F" }, "e": [{ "l": "", "s": "", "b": "", "n": { "de": "Was ist die Nachbildung?", "en": "What is the emulation?", "fr": "Qu'est-ce que l'\xE9mulation ?", "ja": "\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3068\u306F" }, "t": { "de": "HeishaMon kann so tun, als w\xE4re die Panasonic-Optional-Platine eingebaut. Dann lassen sich SG Ready, Leistungsbegrenzung und F\xFChlerwerte von Home Assistant aus senden, ohne die Platine zu kaufen. Die Werte unten gibt es nur mit eingeschalteter Nachbildung.", "en": "HeishaMon can pretend that the Panasonic optional board is installed. SG Ready, power limiting and sensor values can then be sent from Home Assistant without buying the board. The values below only exist with emulation enabled.", "fr": "HeishaMon peut faire comme si la carte optionnelle Panasonic \xE9tait install\xE9e. On peut alors envoyer SG Ready, la limitation de puissance et des valeurs de sondes depuis Home Assistant sans acheter la carte. Les valeurs ci-dessous n'existent qu'avec l'\xE9mulation activ\xE9e.", "ja": "HeishaMon \u306F Panasonic \u306E\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u304C\u4ED8\u3044\u3066\u3044\u308B\u304B\u306E\u3088\u3046\u306B\u52D5\u4F5C\u3067\u304D\u307E\u3059\u3002\u57FA\u677F\u3092\u8CB7\u308F\u306A\u304F\u3066\u3082\u3001Home Assistant \u304B\u3089 SG Ready\u3001\u51FA\u529B\u5236\u9650\u3001\u30BB\u30F3\u30B5\u30FC\u5024\u3092\u9001\u308C\u307E\u3059\u3002\u4EE5\u4E0B\u306E\u5024\u306F\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u305F\u5834\u5408\u3060\u3051\u3042\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetSmartGridMode", "b": "0 \u2026 3", "n": { "de": "SG Ready", "en": "SG Ready", "fr": "SG Ready", "ja": "SG Ready" }, "t": { "de": "Ein Signal, mit dem z. B. der Energieversorger oder die eigene PV-Anlage die W\xE4rmepumpe beeinflusst. 0 = normal, 1 = Leistungsstufe 1, 2 = W\xE4rmepumpe und Warmwasser aus, 3 = Leistungsstufe 2. Wie stark die Leistungsstufen wirken, stellt der Installateur in der W\xE4rmepumpe ein.", "en": "A signal with which, for example, the energy supplier or your own solar system influences the heat pump. 0 = normal, 1 = capacity level 1, 2 = heat pump and hot water off, 3 = capacity level 2. How strongly the levels act is set by the installer in the heat pump.", "fr": "Un signal par lequel, par exemple, le fournisseur d'\xE9nergie ou votre installation solaire agit sur la pompe. 0 = normal, 1 = niveau de puissance 1, 2 = pompe et eau chaude arr\xEAt\xE9es, 3 = niveau de puissance 2. L'effet des niveaux est r\xE9gl\xE9 par l'installateur.", "ja": "\u96FB\u529B\u4F1A\u793E\u3084\u81EA\u5B85\u306E\u592A\u967D\u5149\u767A\u96FB\u306A\u3069\u304C\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306B\u5F71\u97FF\u3092\u4E0E\u3048\u308B\u305F\u3081\u306E\u4FE1\u53F7\u3067\u3059\u30020 = \u901A\u5E38\u30011 = \u80FD\u529B\u30EC\u30D9\u30EB 1\u30012 = \u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3068\u7D66\u6E6F\u3092\u505C\u6B62\u30013 = \u80FD\u529B\u30EC\u30D9\u30EB 2\u3002\u5404\u30EC\u30D9\u30EB\u306E\u5F37\u3055\u306F\u65BD\u5DE5\u696D\u8005\u304C\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3067\u8A2D\u5B9A\u3057\u307E\u3059\u3002" } }, { "l": "", "s": "SetDemandControl", "b": "43 \u2026 234", "n": { "de": "Leistungsbegrenzung (Demand Control)", "en": "Power limit (demand control)", "fr": "Limitation de puissance (demand control)", "ja": "\u51FA\u529B\u5236\u9650\uFF08\u30C7\u30DE\u30F3\u30C9\u5236\u5FA1\uFF09" }, "t": { "de": "Begrenzt die Leistung der W\xE4rmepumpe. 43 entspricht etwa 5 %, 234 entspricht 100 %.", "en": "Limits the heat pump's power. 43 corresponds to about 5 %, 234 to 100 %.", "fr": "Limite la puissance de la pompe. 43 correspond \xE0 environ 5 %, 234 \xE0 100 %.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u51FA\u529B\u3092\u5236\u9650\u3057\u307E\u3059\u300243 \u304C\u7D04 5 %\u3001234 \u304C 100 % \u3067\u3059\u3002" } }, { "l": "", "s": "SetHeatCoolMode", "b": "0/1", "n": { "de": "Schalter Heizen/K\xFChlen", "en": "Heat/cool switch", "fr": "Commutateur chaud/froid", "ja": "\u6696\u623F/\u51B7\u623F\u30B9\u30A4\u30C3\u30C1" }, "t": { "de": "Simuliert den Schalteingang Heizen/K\xFChlen der Optional-Platine.", "en": "Simulates the heat/cool switch input of the optional board.", "fr": "Simule l'entr\xE9e chaud/froid de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u6696\u623F/\u51B7\u623F\u5207\u66FF\u5165\u529B\u3092\u6A21\u64EC\u3057\u307E\u3059\u3002" } }, { "l": "", "s": "SetCompressorState", "b": "0/1", "n": { "de": "Schalter Verdichter", "en": "Compressor switch", "fr": "Commutateur compresseur", "ja": "\u5727\u7E2E\u6A5F\u30B9\u30A4\u30C3\u30C1" }, "t": { "de": "Simuliert den Schalteingang f\xFCr den Verdichter der Optional-Platine.", "en": "Simulates the compressor switch input of the optional board.", "fr": "Simule l'entr\xE9e compresseur de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u5727\u7E2E\u6A5F\u7528\u5165\u529B\u3092\u6A21\u64EC\u3057\u307E\u3059\u3002" } }, { "l": "", "s": "SetExternalThermostat1State", "b": "0 \u2026 3", "n": { "de": "Thermostat 1", "en": "Thermostat 1", "fr": "Thermostat 1", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8 1" }, "t": { "de": "Meldet, was ein externer Raumthermostat anfordert: 0 = nichts, 1 = K\xFChlen, 2 = Heizen, 3 = beides. Laut HeishaMon nur H- und J-Serie.", "en": "Reports what an external room thermostat requests: 0 = nothing, 1 = cooling, 2 = heating, 3 = both. According to HeishaMon H and J series only.", "fr": "Indique ce que demande un thermostat d'ambiance externe : 0 = rien, 1 = froid, 2 = chaud, 3 = les deux. Selon HeishaMon, s\xE9ries H et J uniquement.", "ja": "\u5916\u90E8\u30EB\u30FC\u30E0\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306E\u8981\u6C42\u3092\u4F1D\u3048\u307E\u3059\uFF1A0 = \u306A\u3057\u30011 = \u51B7\u623F\u30012 = \u6696\u623F\u30013 = \u4E21\u65B9\u3002HeishaMon \u306B\u3088\u308B\u3068 H\u30FBJ \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "", "s": "SetExternalThermostat2State", "b": "0 \u2026 3", "n": { "de": "Thermostat 2", "en": "Thermostat 2", "fr": "Thermostat 2", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8 2" }, "t": { "de": "Wie Thermostat 1, f\xFCr den zweiten Raumthermostaten: 0 = nichts, 1 = K\xFChlen, 2 = Heizen, 3 = beides.", "en": "Like thermostat 1, for the second room thermostat: 0 = nothing, 1 = cooling, 2 = heating, 3 = both.", "fr": "Comme le thermostat 1, pour le second thermostat : 0 = rien, 1 = froid, 2 = chaud, 3 = les deux.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8 1 \u3068\u540C\u3058\u304F\u30012 \u53F0\u76EE\u306E\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u7528\u3067\u3059\uFF1A0 = \u306A\u3057\u30011 = \u51B7\u623F\u30012 = \u6696\u623F\u30013 = \u4E21\u65B9\u3002" } }, { "l": "", "s": "SetZ1RoomTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Raumtemperatur Zone 1 senden", "en": "Send zone 1 room temperature", "fr": "Envoyer la temp\xE9rature zone 1", "ja": "\u30BE\u30FC\u30F3 1 \u5BA4\u6E29\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine. Laut HeishaMon nur H- und J-Serie.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board. According to HeishaMon H and J series only.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle. Selon HeishaMon, s\xE9ries H et J uniquement.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002 HeishaMon \u306B\u3088\u308B\u3068 H\u30FBJ \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "", "s": "SetZ2RoomTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Raumtemperatur Zone 2 senden", "en": "Send zone 2 room temperature", "fr": "Envoyer la temp\xE9rature zone 2", "ja": "\u30BE\u30FC\u30F3 2 \u5BA4\u6E29\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetZ1WaterTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Wassertemperatur Zone 1 senden", "en": "Send zone 1 water temperature", "fr": "Envoyer l'eau zone 1", "ja": "\u30BE\u30FC\u30F3 1 \u6C34\u6E29\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetZ2WaterTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Wassertemperatur Zone 2 senden", "en": "Send zone 2 water temperature", "fr": "Envoyer l'eau zone 2", "ja": "\u30BE\u30FC\u30F3 2 \u6C34\u6E29\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetBufferTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Puffertemperatur senden", "en": "Send buffer temperature", "fr": "Envoyer la temp\xE9rature du tampon", "ja": "\u30D0\u30C3\u30D5\u30A1\u30FC\u6E29\u5EA6\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine. Laut HeishaMon nur H- und J-Serie.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board. According to HeishaMon H and J series only.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle. Selon HeishaMon, s\xE9ries H et J uniquement.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002 HeishaMon \u306B\u3088\u308B\u3068 H\u30FBJ \u30B7\u30EA\u30FC\u30BA\u306E\u307F\u3067\u3059\u3002" } }, { "l": "", "s": "SetPoolTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Pooltemperatur senden", "en": "Send pool temperature", "fr": "Envoyer la temp\xE9rature piscine", "ja": "\u30D7\u30FC\u30EB\u6E29\u5EA6\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetSolarTemp", "b": "\u221278 \u2026 120 \xB0C", "n": { "de": "Solartemperatur senden", "en": "Send solar temperature", "fr": "Envoyer la temp\xE9rature solaire", "ja": "\u592A\u967D\u71B1\u6E29\u5EA6\u3092\u9001\u308B" }, "t": { "de": "Schickt der W\xE4rmepumpe einen Temperaturwert, als k\xE4me er von einem F\xFChler an der Optional-Platine.", "en": "Sends a temperature value to the heat pump as if it came from a sensor on the optional board.", "fr": "Envoie une temp\xE9rature \xE0 la pompe comme si elle venait d'une sonde de la carte optionnelle.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30BB\u30F3\u30B5\u30FC\u304B\u3089\u6765\u305F\u304B\u306E\u3088\u3046\u306B\u3001\u6E29\u5EA6\u306E\u5024\u3092\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u3078\u9001\u308A\u307E\u3059\u3002" } }, { "l": "", "s": "SetOptPCBByte9", "b": "", "n": { "de": "Optional-Platine Byte 9", "en": "Optional board byte 9", "fr": "Carte optionnelle octet 9", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F \u30D0\u30A4\u30C8 9" }, "t": { "de": "Schreibt ein einzelnes Byte der Optional-Platine. Wof\xFCr es dient, ist in der HeishaMon-Doku nicht bekannt. Nicht verwenden, wenn man es nicht genau wei\xDF.", "en": "Writes a single byte of the optional board. Its purpose is unknown in the HeishaMon documentation. Do not use unless you know exactly what it does.", "fr": "\xC9crit un octet de la carte optionnelle. Son r\xF4le est inconnu dans la documentation HeishaMon. \xC0 ne pas utiliser sans savoir exactement ce qu'il fait.", "ja": "\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E 1 \u30D0\u30A4\u30C8\u3092\u66F8\u304D\u8FBC\u307F\u307E\u3059\u3002\u7528\u9014\u306F HeishaMon \u306E\u8AAC\u660E\u66F8\u3067\u3082\u4E0D\u660E\u3067\u3059\u3002\u3088\u304F\u5206\u304B\u3089\u306A\u3044\u5834\u5408\u306F\u4F7F\u308F\u306A\u3044\u3067\u304F\u3060\u3055\u3044\u3002" } }, { "l": "OPT0", "s": "", "b": "0/1", "n": { "de": "Anforderung Pumpe Zone 1", "en": "Request: zone 1 pump", "fr": "Demande : pompe zone 1", "ja": "\u8981\u6C42\uFF1A\u30BE\u30FC\u30F3 1 \u30DD\u30F3\u30D7" }, "t": { "de": "Die W\xE4rmepumpe m\xF6chte, dass die Pumpe von Zone 1 l\xE4uft (0 = aus, 1 = ein). Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump wants the zone 1 pump to run (0 = off, 1 = on). Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe souhaite que la pompe de la zone 1 fonctionne (0 = arr\xEAt, 1 = marche). Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u30BE\u30FC\u30F3 1 \u306E\u30DD\u30F3\u30D7\u306E\u904B\u8EE2\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\uFF080 = \u505C\u6B62\u30011 = \u904B\u8EE2\uFF09\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT1", "s": "", "b": "0 \u2026 2", "n": { "de": "Anforderung Mischventil Zone 1", "en": "Request: zone 1 mixing valve", "fr": "Demande : vanne m\xE9langeuse zone 1", "ja": "\u8981\u6C42\uFF1A\u30BE\u30FC\u30F3 1 \u6DF7\u5408\u5F01" }, "t": { "de": "Die W\xE4rmepumpe m\xF6chte das Mischventil von Zone 1 bewegen: 0 = nicht, 1 = k\xFChler, 2 = w\xE4rmer. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump wants to move the zone 1 mixing valve: 0 = no, 1 = cooler, 2 = warmer. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe souhaite d\xE9placer la vanne m\xE9langeuse de la zone 1 : 0 = non, 1 = plus froid, 2 = plus chaud. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u30BE\u30FC\u30F3 1 \u306E\u6DF7\u5408\u5F01\u3092\u52D5\u304B\u3057\u305F\u3044\u3068\u304D\uFF1A0 = \u306A\u3057\u30011 = \u4F4E\u304F\u30012 = \u9AD8\u304F\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT2", "s": "", "b": "0/1", "n": { "de": "Anforderung Pumpe Zone 2", "en": "Request: zone 2 pump", "fr": "Demande : pompe zone 2", "ja": "\u8981\u6C42\uFF1A\u30BE\u30FC\u30F3 2 \u30DD\u30F3\u30D7" }, "t": { "de": "Die W\xE4rmepumpe m\xF6chte, dass die Pumpe von Zone 2 l\xE4uft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump wants the zone 2 pump to run. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe souhaite que la pompe de la zone 2 fonctionne. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u30BE\u30FC\u30F3 2 \u306E\u30DD\u30F3\u30D7\u306E\u904B\u8EE2\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT3", "s": "", "b": "0 \u2026 2", "n": { "de": "Anforderung Mischventil Zone 2", "en": "Request: zone 2 mixing valve", "fr": "Demande : vanne m\xE9langeuse zone 2", "ja": "\u8981\u6C42\uFF1A\u30BE\u30FC\u30F3 2 \u6DF7\u5408\u5F01" }, "t": { "de": "Wie bei Zone 1: 0 = nicht, 1 = k\xFChler, 2 = w\xE4rmer. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "As for zone 1: 0 = no, 1 = cooler, 2 = warmer. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "Comme pour la zone 1 : 0 = non, 1 = plus froid, 2 = plus chaud. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30BE\u30FC\u30F3 1 \u3068\u540C\u3058\u304F\u30010 = \u306A\u3057\u30011 = \u4F4E\u304F\u30012 = \u9AD8\u304F\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT4", "s": "", "b": "0/1", "n": { "de": "Anforderung Poolpumpe", "en": "Request: pool pump", "fr": "Demande : pompe piscine", "ja": "\u8981\u6C42\uFF1A\u30D7\u30FC\u30EB\u30DD\u30F3\u30D7" }, "t": { "de": "Die W\xE4rmepumpe m\xF6chte, dass die Poolpumpe l\xE4uft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump wants the pool pump to run. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe souhaite que la pompe de piscine fonctionne. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u30D7\u30FC\u30EB\u30DD\u30F3\u30D7\u306E\u904B\u8EE2\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT5", "s": "", "b": "0/1", "n": { "de": "Anforderung Solarpumpe", "en": "Request: solar pump", "fr": "Demande : pompe solaire", "ja": "\u8981\u6C42\uFF1A\u592A\u967D\u71B1\u30DD\u30F3\u30D7" }, "t": { "de": "Die W\xE4rmepumpe m\xF6chte, dass die Solarpumpe l\xE4uft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump wants the solar pump to run. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe souhaite que la pompe solaire fonctionne. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u592A\u967D\u71B1\u30DD\u30F3\u30D7\u306E\u904B\u8EE2\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "OPT6", "s": "", "b": "0/1", "n": { "de": "Alarm", "en": "Alarm", "fr": "Alarme", "ja": "\u30A2\u30E9\u30FC\u30E0" }, "t": { "de": "Die W\xE4rmepumpe meldet einen Alarm an die Optional-Platine. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.", "en": "The heat pump reports an alarm to the optional board. Only visible if optional board emulation is enabled in HeishaMon.", "fr": "La pompe signale une alarme \xE0 la carte optionnelle. Visible uniquement si l'\xE9mulation de la carte optionnelle est activ\xE9e dans HeishaMon.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u3078\u30A2\u30E9\u30FC\u30E0\u3092\u4F1D\u3048\u3066\u3044\u307E\u3059\u3002 HeishaMon \u3067\u30AA\u30D7\u30B7\u30E7\u30F3\u57FA\u677F\u306E\u30A8\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u3092\u6709\u52B9\u306B\u3057\u3066\u3044\u308B\u5834\u5408\u306E\u307F\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }] }, { "id": "zusatz", "titel": { "de": "HeishaMon-Zus\xE4tze", "en": "HeishaMon extras", "fr": "Compl\xE9ments HeishaMon", "ja": "HeishaMon \u306E\u8FFD\u52A0\u6A5F\u80FD" }, "e": [{ "l": "1-Wire", "s": "", "b": "\xB0C", "n": { "de": "Zus\xE4tzliche Temperaturf\xFChler (1-Wire)", "en": "Extra temperature sensors (1-Wire)", "fr": "Sondes de temp\xE9rature suppl\xE9mentaires (1-Wire)", "ja": "\u8FFD\u52A0\u6E29\u5EA6\u30BB\u30F3\u30B5\u30FC\uFF081-Wire\uFF09" }, "t": { "de": "An die HeishaMon-Platine lassen sich eigene Temperaturf\xFChler vom Typ DS18B20 anschlie\xDFen, zum Beispiel an Rohren oder in R\xE4umen. Jeder F\xFChler erscheint als eigener Wert.", "en": "Your own DS18B20 temperature sensors can be connected to the HeishaMon board, for example on pipes or in rooms. Each sensor appears as its own value.", "fr": "On peut raccorder ses propres sondes DS18B20 \xE0 la carte HeishaMon, par exemple sur des tuyaux ou dans des pi\xE8ces. Chaque sonde appara\xEEt comme une valeur distincte.", "ja": "HeishaMon \u57FA\u677F\u306B\u306F DS18B20 \u578B\u306E\u6E29\u5EA6\u30BB\u30F3\u30B5\u30FC\u3092\u63A5\u7D9A\u3067\u304D\u307E\u3059\uFF08\u914D\u7BA1\u3084\u90E8\u5C4B\u306A\u3069\uFF09\u3002\u30BB\u30F3\u30B5\u30FC\u3054\u3068\u306B\u5225\u306E\u5024\u3068\u3057\u3066\u8868\u793A\u3055\u308C\u307E\u3059\u3002" } }, { "l": "S0", "s": "", "b": "W / Wh", "n": { "de": "Stromz\xE4hler (S0)", "en": "Electricity meter (S0)", "fr": "Compteur \xE9lectrique (S0)", "ja": "\u96FB\u529B\u91CF\u8A08\uFF08S0\uFF09" }, "t": { "de": "An zwei Anschl\xFCssen der HeishaMon-Platine kann je ein Stromz\xE4hler mit S0-Impulsausgang angeschlossen werden. Gemeldet werden die aktuelle Leistung in Watt und der Verbrauch in Wattstunden.", "en": "One electricity meter with S0 pulse output can be connected to each of two inputs on the HeishaMon board. The current power in watts and the consumption in watt-hours are reported.", "fr": "Deux entr\xE9es de la carte HeishaMon acceptent chacune un compteur \xE0 sortie d'impulsions S0. La puissance actuelle en watts et la consommation en wattheures sont transmises.", "ja": "HeishaMon \u57FA\u677F\u306E 2 \u3064\u306E\u5165\u529B\u306B\u3001S0 \u30D1\u30EB\u30B9\u51FA\u529B\u4ED8\u304D\u306E\u96FB\u529B\u91CF\u8A08\u3092 1 \u53F0\u305A\u3064\u63A5\u7D9A\u3067\u304D\u307E\u3059\u3002\u73FE\u5728\u306E\u96FB\u529B\uFF08W\uFF09\u3068\u4F7F\u7528\u91CF\uFF08Wh\uFF09\u304C\u5831\u544A\u3055\u308C\u307E\u3059\u3002" } }] }, { "id": "opentherm", "titel": { "de": "OpenTherm-Thermostat", "en": "OpenTherm thermostat", "fr": "Thermostat OpenTherm", "ja": "OpenTherm \u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8" }, "e": [{ "l": "", "s": "", "b": "", "n": { "de": "Was ist OpenTherm?", "en": "What is OpenTherm?", "fr": "Qu'est-ce qu'OpenTherm ?", "ja": "OpenTherm \u3068\u306F" }, "t": { "de": "OpenTherm ist eine Sprache, mit der Raumthermostate mit Heizger\xE4ten sprechen. Hat die HeishaMon-Platine einen OpenTherm-Anschluss, kann dort ein solcher Thermostat angeschlossen werden. \u201EVom Thermostat\u201C sind Werte, die der Thermostat liefert. \u201EAn den Thermostat\u201C sind Werte, die man ihm zur Anzeige schickt.", "en": "OpenTherm is a language room thermostats use to talk to heating appliances. If the HeishaMon board has an OpenTherm connection, such a thermostat can be connected. \u201CFrom thermostat\u201D values are supplied by the thermostat. \u201CTo thermostat\u201D values are sent to it for display.", "fr": "OpenTherm est un langage permettant aux thermostats d'ambiance de dialoguer avec les appareils de chauffage. Si la carte HeishaMon dispose d'une connexion OpenTherm, un tel thermostat peut y \xEAtre raccord\xE9. Les valeurs \xAB du thermostat \xBB sont fournies par lui ; celles \xAB vers le thermostat \xBB lui sont envoy\xE9es pour affichage.", "ja": "OpenTherm \u306F\u30EB\u30FC\u30E0\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3068\u6696\u623F\u6A5F\u5668\u304C\u901A\u4FE1\u3059\u308B\u305F\u3081\u306E\u65B9\u5F0F\u3067\u3059\u3002HeishaMon \u57FA\u677F\u306B OpenTherm \u63A5\u7D9A\u304C\u3042\u308C\u3070\u3001\u305D\u306E\u3088\u3046\u306A\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3092\u63A5\u7D9A\u3067\u304D\u307E\u3059\u3002\u300C\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304B\u3089\u300D\u306F\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u9001\u308B\u5024\u3001\u300C\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\u300D\u306F\u8868\u793A\u7528\u306B\u9001\u308B\u5024\u3067\u3059\u3002" } }, { "l": "OT chEnable", "s": "", "b": "0/1", "n": { "de": "Heizung gew\xFCnscht", "en": "Heating requested", "fr": "Chauffage demand\xE9", "ja": "\u6696\u623F\u8981\u6C42" }, "t": { "de": "Der Thermostat m\xF6chte, dass geheizt wird.", "en": "The thermostat wants heating.", "fr": "Le thermostat demande du chauffage.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u6696\u623F\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\u3002" } }, { "l": "OT dhwEnable", "s": "", "b": "0/1", "n": { "de": "Warmwasser gew\xFCnscht", "en": "Hot water requested", "fr": "Eau chaude demand\xE9e", "ja": "\u7D66\u6E6F\u8981\u6C42" }, "t": { "de": "Der Thermostat erlaubt das Warmwasserbereiten, etwa nicht im Urlaub.", "en": "The thermostat allows hot water heating, for example not during holidays.", "fr": "Le thermostat autorise la production d'eau chaude, par exemple pas pendant les vacances.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u7D66\u6E6F\u3092\u8A31\u53EF\u3057\u3066\u3044\u307E\u3059\uFF08\u4F11\u6687\u4E2D\u306F\u8A31\u53EF\u3057\u306A\u3044\u3001\u306A\u3069\uFF09\u3002" } }, { "l": "OT coolingEnable", "s": "", "b": "0/1", "n": { "de": "K\xFChlen gew\xFCnscht", "en": "Cooling requested", "fr": "Rafra\xEEchissement demand\xE9", "ja": "\u51B7\u623F\u8981\u6C42" }, "t": { "de": "Der Thermostat m\xF6chte, dass gek\xFChlt wird.", "en": "The thermostat wants cooling.", "fr": "Le thermostat demande du rafra\xEEchissement.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u51B7\u623F\u3092\u6C42\u3081\u3066\u3044\u307E\u3059\u3002" } }, { "l": "OT roomTemp", "s": "", "b": "\xB0C", "n": { "de": "Raumtemperatur", "en": "Room temperature", "fr": "Temp\xE9rature ambiante", "ja": "\u5BA4\u6E29" }, "t": { "de": "Die vom Thermostat gemessene Raumtemperatur.", "en": "The room temperature measured by the thermostat.", "fr": "La temp\xE9rature mesur\xE9e par le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u6E2C\u3063\u305F\u5BA4\u6E29\u3067\u3059\u3002" } }, { "l": "OT roomTempSet", "s": "", "b": "\xB0C", "n": { "de": "Raum-Solltemperatur", "en": "Room setpoint", "fr": "Consigne ambiante", "ja": "\u5BA4\u6E29\u8A2D\u5B9A" }, "t": { "de": "Die am Thermostat eingestellte Wunschtemperatur f\xFCr den Raum.", "en": "The desired room temperature set on the thermostat.", "fr": "La temp\xE9rature souhait\xE9e r\xE9gl\xE9e sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3067\u8A2D\u5B9A\u3057\u305F\u5E0C\u671B\u5BA4\u6E29\u3067\u3059\u3002" } }, { "l": "OT chSetpoint", "s": "", "b": "\xB0C", "n": { "de": "Vom Thermostat berechnete Wassertemperatur", "en": "Water temperature from thermostat", "fr": "Temp\xE9rature d'eau du thermostat", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u7B97\u51FA\u6C34\u6E29" }, "t": { "de": "Die Wassertemperatur, die der Thermostat f\xFCr n\xF6tig h\xE4lt, damit der Raum warm wird, ohne zu \xFCberheizen.", "en": "The water temperature the thermostat thinks is needed to warm the room without overheating.", "fr": "La temp\xE9rature d'eau que le thermostat juge n\xE9cessaire pour chauffer la pi\xE8ce sans d\xE9passer.", "ja": "\u90E8\u5C4B\u3092\u6696\u3081\u3059\u304E\u305A\u306B\u6696\u3081\u308B\u305F\u3081\u306B\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u5FC5\u8981\u3068\u3059\u308B\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "OT maxRelativeModulation", "s": "", "b": "0 \u2026 100 %", "n": { "de": "Erlaubte Leistung", "en": "Allowed power", "fr": "Puissance autoris\xE9e", "ja": "\u8A31\u5BB9\u51FA\u529B" }, "t": { "de": "Wie viel Prozent ihrer Leistung die W\xE4rmepumpe laut Thermostat h\xF6chstens nutzen darf.", "en": "The maximum percentage of its power the heat pump may use according to the thermostat.", "fr": "Le pourcentage maximal de puissance que la pompe peut utiliser selon le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8A31\u3059\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306E\u6700\u5927\u51FA\u529B\uFF08%\uFF09\u3067\u3059\u3002" } }, { "l": "OT coolingControl", "s": "", "b": "0 \u2026 100 %", "n": { "de": "Gew\xFCnschte K\xFChlleistung", "en": "Requested cooling", "fr": "Froid demand\xE9", "ja": "\u51B7\u623F\u8981\u6C42\u91CF" }, "t": { "de": "Wie viel K\xFChlung der Thermostat anfordert, in Prozent.", "en": "How much cooling the thermostat requests, in percent.", "fr": "La quantit\xE9 de froid demand\xE9e par le thermostat, en pourcentage.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u6C42\u3081\u308B\u51B7\u623F\u306E\u91CF\uFF08%\uFF09\u3067\u3059\u3002" } }, { "l": "OT dhwSetpoint", "s": "OT dhwSetpoint", "b": "\xB0C", "n": { "de": "Warmwasser-Sollwert", "en": "Hot water setpoint", "fr": "Consigne d'eau chaude", "ja": "\u7D66\u6E6F\u8A2D\u5B9A\u6E29\u5EA6" }, "t": { "de": "Die Warmwasser-Wunschtemperatur am Thermostat. Kann auch von HeishaMon gesetzt werden, das unterst\xFCtzen aber nicht alle Thermostate.", "en": "The desired hot water temperature on the thermostat. Can also be set by HeishaMon, but not all thermostats support this.", "fr": "La temp\xE9rature d'eau chaude souhait\xE9e sur le thermostat. Peut aussi \xEAtre r\xE9gl\xE9e par HeishaMon, mais pas tous les thermostats le permettent.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306E\u7D66\u6E6F\u306E\u5E0C\u671B\u6E29\u5EA6\u3067\u3059\u3002HeishaMon \u304B\u3089\u8A2D\u5B9A\u3059\u308B\u3053\u3068\u3082\u3067\u304D\u307E\u3059\u304C\u3001\u5BFE\u5FDC\u3057\u306A\u3044\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3082\u3042\u308A\u307E\u3059\u3002" } }, { "l": "OT maxTSet", "s": "OT maxTSet", "b": "\xB0C", "n": { "de": "H\xF6chste Wassertemperatur", "en": "Maximum water temperature", "fr": "Temp\xE9rature d'eau maximale", "ja": "\u6700\u9AD8\u6C34\u6E29" }, "t": { "de": "Die h\xF6chste Wassertemperatur, die der Thermostat anfordern darf.", "en": "The highest water temperature the thermostat may request.", "fr": "La temp\xE9rature d'eau la plus haute que le thermostat peut demander.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8981\u6C42\u3067\u304D\u308B\u6700\u9AD8\u306E\u6C34\u6E29\u3067\u3059\u3002" } }, { "l": "", "s": "OT chPressure", "b": "bar", "n": { "de": "Wasserdruck an Thermostat", "en": "Water pressure to thermostat", "fr": "Pression vers le thermostat", "ja": "\u6C34\u5727\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Der Wasserdruck der Heizung, zur Anzeige am Thermostat.", "en": "The heating water pressure, for display on the thermostat.", "fr": "La pression d'eau du chauffage, pour affichage sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u8868\u793A\u3059\u308B\u305F\u3081\u306E\u6696\u623F\u306E\u6C34\u5727\u3067\u3059\u3002" } }, { "l": "", "s": "OT outsideTemp", "b": "\xB0C", "n": { "de": "Au\xDFentemperatur an Thermostat", "en": "Outdoor temperature to thermostat", "fr": "Temp\xE9rature ext\xE9rieure vers le thermostat", "ja": "\u5916\u6C17\u6E29\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Die Au\xDFentemperatur, zur Anzeige am Thermostat.", "en": "The outdoor temperature, for display on the thermostat.", "fr": "La temp\xE9rature ext\xE9rieure, pour affichage sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u8868\u793A\u3059\u308B\u305F\u3081\u306E\u5916\u6C17\u6E29\u3067\u3059\u3002" } }, { "l": "", "s": "OT inletTemp", "b": "\xB0C", "n": { "de": "R\xFCcklauf an Thermostat", "en": "Return to thermostat", "fr": "Retour vers le thermostat", "ja": "\u623B\u308A\u6E29\u5EA6\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Die R\xFCcklauftemperatur, zur Anzeige am Thermostat.", "en": "The return temperature, for display on the thermostat.", "fr": "La temp\xE9rature de retour, pour affichage sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u8868\u793A\u3059\u308B\u305F\u3081\u306E\u623B\u308A\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "", "s": "OT outletTemp", "b": "\xB0C", "n": { "de": "Vorlauf an Thermostat", "en": "Flow to thermostat", "fr": "D\xE9part vers le thermostat", "ja": "\u5F80\u304D\u6E29\u5EA6\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Die Vorlauftemperatur, zur Anzeige am Thermostat.", "en": "The flow temperature, for display on the thermostat.", "fr": "La temp\xE9rature de d\xE9part, pour affichage sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u8868\u793A\u3059\u308B\u305F\u3081\u306E\u5F80\u304D\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "", "s": "OT dhwTemp", "b": "\xB0C", "n": { "de": "Warmwasser an Thermostat", "en": "Hot water to thermostat", "fr": "Eau chaude vers le thermostat", "ja": "\u7D66\u6E6F\u6E29\u5EA6\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Die Warmwassertemperatur, zur Anzeige am Thermostat.", "en": "The hot water temperature, for display on the thermostat.", "fr": "La temp\xE9rature de l'eau chaude, pour affichage sur le thermostat.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u8868\u793A\u3059\u308B\u305F\u3081\u306E\u7D66\u6E6F\u6E29\u5EA6\u3067\u3059\u3002" } }, { "l": "", "s": "OT relativeModulation", "b": "0 \u2026 100 %", "n": { "de": "Aktuelle Leistung an Thermostat", "en": "Current power to thermostat", "fr": "Puissance actuelle vers le thermostat", "ja": "\u73FE\u5728\u306E\u51FA\u529B\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Mit wie viel Prozent Leistung die W\xE4rmepumpe gerade l\xE4uft. Sollte nicht \xFCber der erlaubten Leistung liegen.", "en": "At what percentage of power the heat pump is currently running. Should not exceed the allowed power.", "fr": "Le pourcentage de puissance actuel de la pompe. Ne doit pas d\xE9passer la puissance autoris\xE9e.", "ja": "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u304C\u4ECA\u4F55 % \u306E\u51FA\u529B\u3067\u52D5\u3044\u3066\u3044\u308B\u304B\u3067\u3059\u3002\u8A31\u5BB9\u51FA\u529B\u3092\u8D85\u3048\u306A\u3044\u3088\u3046\u306B\u3057\u307E\u3059\u3002" } }, { "l": "", "s": "OT flameState", "b": "0/1", "n": { "de": "\u201EBrenner an\u201C an Thermostat", "en": "\u201CBurner on\u201D to thermostat", "fr": "\xAB Br\xFBleur allum\xE9 \xBB vers le thermostat", "ja": "\u300C\u71C3\u713C\u4E2D\u300D\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Teilt dem Thermostat mit, dass gerade W\xE4rme erzeugt wird. Der Name stammt von Gaskesseln.", "en": "Tells the thermostat that heat is currently being produced. The name comes from gas boilers.", "fr": "Indique au thermostat que de la chaleur est produite. Le nom vient des chaudi\xE8res \xE0 gaz.", "ja": "\u4ECA\u71B1\u3092\u4F5C\u3063\u3066\u3044\u308B\u3053\u3068\u3092\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u4F1D\u3048\u307E\u3059\u3002\u540D\u524D\u306F\u30AC\u30B9\u30DC\u30A4\u30E9\u30FC\u306B\u7531\u6765\u3057\u307E\u3059\u3002" } }, { "l": "", "s": "OT chState", "b": "0/1", "n": { "de": "Heizbetrieb an Thermostat", "en": "Heating active to thermostat", "fr": "Chauffage actif vers le thermostat", "ja": "\u6696\u623F\u4E2D\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Teilt dem Thermostat mit, dass gerade die R\xE4ume beheizt werden.", "en": "Tells the thermostat that the rooms are currently being heated.", "fr": "Indique au thermostat que les pi\xE8ces sont chauff\xE9es.", "ja": "\u4ECA\u90E8\u5C4B\u3092\u6696\u623F\u3057\u3066\u3044\u308B\u3053\u3068\u3092\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u4F1D\u3048\u307E\u3059\u3002" } }, { "l": "", "s": "OT dhwState", "b": "0/1", "n": { "de": "Warmwasserbetrieb an Thermostat", "en": "Hot water active to thermostat", "fr": "Eau chaude active vers le thermostat", "ja": "\u7D66\u6E6F\u4E2D\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Teilt dem Thermostat mit, dass gerade Warmwasser bereitet wird.", "en": "Tells the thermostat that hot water is currently being heated.", "fr": "Indique au thermostat que l'eau chaude est en production.", "ja": "\u4ECA\u7D66\u6E6F\u3057\u3066\u3044\u308B\u3053\u3068\u3092\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u4F1D\u3048\u307E\u3059\u3002" } }, { "l": "", "s": "OT coolingState", "b": "0/1", "n": { "de": "K\xFChlbetrieb an Thermostat", "en": "Cooling active to thermostat", "fr": "Rafra\xEEchissement actif vers le thermostat", "ja": "\u51B7\u623F\u4E2D\uFF08\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u3078\uFF09" }, "t": { "de": "Teilt dem Thermostat mit, dass gerade gek\xFChlt wird.", "en": "Tells the thermostat that cooling is currently running.", "fr": "Indique au thermostat que le rafra\xEEchissement est en cours.", "ja": "\u4ECA\u51B7\u623F\u3057\u3066\u3044\u308B\u3053\u3068\u3092\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u306B\u4F1D\u3048\u307E\u3059\u3002" } }, { "l": "", "s": "OT dhwSetUppBound", "b": "0 \u2026 127", "n": { "de": "Warmwasser: Obergrenze", "en": "Hot water: upper limit", "fr": "Eau chaude : limite haute", "ja": "\u7D66\u6E6F\uFF1A\u4E0A\u9650" }, "t": { "de": "H\xF6chste Warmwassertemperatur, die der Thermostat einstellen darf. Standard: 75.", "en": "Highest hot water temperature the thermostat may set. Default: 75.", "fr": "Temp\xE9rature d'eau chaude maximale que le thermostat peut r\xE9gler. Par d\xE9faut : 75.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8A2D\u5B9A\u3067\u304D\u308B\u6700\u9AD8\u306E\u7D66\u6E6F\u6E29\u5EA6\u3067\u3059\u3002\u521D\u671F\u5024 75\u3002" } }, { "l": "", "s": "OT dhwSetLowBound", "b": "0 \u2026 127", "n": { "de": "Warmwasser: Untergrenze", "en": "Hot water: lower limit", "fr": "Eau chaude : limite basse", "ja": "\u7D66\u6E6F\uFF1A\u4E0B\u9650" }, "t": { "de": "Niedrigste Warmwassertemperatur, die der Thermostat einstellen darf. Standard: 40.", "en": "Lowest hot water temperature the thermostat may set. Default: 40.", "fr": "Temp\xE9rature d'eau chaude minimale que le thermostat peut r\xE9gler. Par d\xE9faut : 40.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8A2D\u5B9A\u3067\u304D\u308B\u6700\u4F4E\u306E\u7D66\u6E6F\u6E29\u5EA6\u3067\u3059\u3002\u521D\u671F\u5024 40\u3002" } }, { "l": "", "s": "OT chSetUppBound", "b": "0 \u2026 127", "n": { "de": "Heizwasser: Obergrenze", "en": "Heating water: upper limit", "fr": "Eau de chauffage : limite haute", "ja": "\u6696\u623F\u6C34\uFF1A\u4E0A\u9650" }, "t": { "de": "H\xF6chste Heizwassertemperatur, die der Thermostat anfordern darf. Standard: 65.", "en": "Highest heating water temperature the thermostat may request. Default: 65.", "fr": "Temp\xE9rature d'eau de chauffage maximale que le thermostat peut demander. Par d\xE9faut : 65.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8981\u6C42\u3067\u304D\u308B\u6700\u9AD8\u306E\u6696\u623F\u6C34\u6E29\u3067\u3059\u3002\u521D\u671F\u5024 65\u3002" } }, { "l": "", "s": "OT chSetLowBound", "b": "0 \u2026 127", "n": { "de": "Heizwasser: Untergrenze", "en": "Heating water: lower limit", "fr": "Eau de chauffage : limite basse", "ja": "\u6696\u623F\u6C34\uFF1A\u4E0B\u9650" }, "t": { "de": "Niedrigste Heizwassertemperatur, die der Thermostat anfordern darf. Standard: 20.", "en": "Lowest heating water temperature the thermostat may request. Default: 20.", "fr": "Temp\xE9rature d'eau de chauffage minimale que le thermostat peut demander. Par d\xE9faut : 20.", "ja": "\u30B5\u30FC\u30E2\u30B9\u30BF\u30C3\u30C8\u304C\u8981\u6C42\u3067\u304D\u308B\u6700\u4F4E\u306E\u6696\u623F\u6C34\u6E29\u3067\u3059\u3002\u521D\u671F\u5024 20\u3002" } }] }];

// src/texte.js
var SPRACHEN = ["de", "en", "fr", "ja"];
var TEXTE = {
  // Beschriftungen in der Grafik
  aussentemperatur: { de: "Au\xDFentemperatur", en: "Outdoor temp.", fr: "Temp. ext\xE9rieure", ja: "\u5916\u6C17\u6E29" },
  aussen_achse: { de: "Au\xDFentemperatur \xB0C", en: "Outdoor temperature \xB0C", fr: "Temp\xE9rature ext\xE9rieure \xB0C", ja: "\u5916\u6C17\u6E29 \xB0C" },
  verdichter: { de: "Verdichter", en: "Compressor", fr: "Compresseur", ja: "\u5727\u7E2E\u6A5F" },
  vorlauf: { de: "Vorlauf", en: "Flow", fr: "D\xE9part", ja: "\u5F80\u304D" },
  ruecklauf: { de: "R\xFCcklauf", en: "Return", fr: "Retour", ja: "\u9084\u308A" },
  vorlauf_achse: { de: "Vorlauf \xB0C", en: "Flow \xB0C", fr: "D\xE9part \xB0C", ja: "\u5F80\u304D\u6E29\u5EA6 \xB0C" },
  pumpe: { de: "Pumpe", en: "Pump", fr: "Pompe", ja: "\u30DD\u30F3\u30D7" },
  druck: { de: "Druck", en: "Pressure", fr: "Pression", ja: "\u5727\u529B" },
  umschaltventil: { de: "Umschaltventil", en: "Diverter valve", fr: "Vanne trois voies", ja: "\u4E09\u65B9\u5F01" },
  zirkulation: { de: "Zirkulation", en: "Circulation", fr: "Circulation", ja: "\u5FAA\u74B0" },
  leistung: { de: "Leistung", en: "Power", fr: "Puissance", ja: "\u6D88\u8CBB\u96FB\u529B" },
  verbrauch: { de: "Verbrauch", en: "Energy", fr: "Consommation", ja: "\u4F7F\u7528\u91CF" },
  verbrauch_24: { de: "Verbrauch 24 Stunden", en: "Energy, past 24 hours", fr: "Consommation sur 24 heures", ja: "24\u6642\u9593\u306E\u4F7F\u7528\u91CF" },
  pv_ueberschuss: { de: "PV \xDCberschuss", en: "PV surplus", fr: "Surplus PV", ja: "\u592A\u967D\u5149\u306E\u4F59\u5270" },
  heizstab: { de: "Heizstab", en: "Heater", fr: "Appoint \xE9lectrique", ja: "\u30D2\u30FC\u30BF\u30FC" },
  legionellen: { de: "Legionellen", en: "Legionella", fr: "L\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9" },
  aufheizen: { de: "Aufheizen", en: "Boost", fr: "Chauffe", ja: "\u52A0\u71B1" },
  vor_24h: { de: "vor 24 h", en: "24 h ago", fr: "il y a 24 h", ja: "24\u6642\u9593\u524D" },
  jetzt: { de: "jetzt", en: "now", fr: "maintenant", ja: "\u73FE\u5728" },
  standby: { de: "Standby", en: "Standby", fr: "Veille", ja: "\u5F85\u6A5F" },
  heizung: { de: "Heizung", en: "Heating", fr: "Chauffage", ja: "\u6696\u623F" },
  warmwasser: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "\u7D66\u6E6F" },
  kein_verlauf: { de: "kein Verlauf vorhanden", en: "no history available", fr: "aucun historique", ja: "\u5C65\u6B74\u306A\u3057" },
  heizkreis: { de: "Heizkreis", en: "Circuit", fr: "Circuit", ja: "\u6696\u623F\u56DE\u8DEF" },
  puffer: { de: "Puffer", en: "Buffer", fr: "Ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u30BF\u30F3\u30AF" },
  // SG Ready
  sg1_kurz: { de: "Stopp", en: "Blocked", fr: "Blocage", ja: "\u505C\u6B62" },
  sg1_lang: { de: "Sperre durch den Netzbetreiber", en: "Blocked by the grid operator", fr: "Blocage par le gestionnaire de r\xE9seau", ja: "\u96FB\u529B\u4F1A\u793E\u306B\u3088\u308B\u505C\u6B62\u6307\u4EE4" },
  sg2_kurz: { de: "Normal", en: "Normal", fr: "Normal", ja: "\u901A\u5E38" },
  sg2_lang: { de: "Normalbetrieb", en: "Normal operation", fr: "Fonctionnement normal", ja: "\u901A\u5E38\u904B\u8EE2" },
  sg3_kurz: { de: "PV \xDCberschuss Low", en: "PV surplus, low", fr: "Surplus PV, faible", ja: "\u4F59\u5270\u96FB\u529B \u5C0F" },
  sg3_lang: { de: "Einschaltempfehlung", en: "Switch-on recommendation", fr: "Recommandation de mise en marche", ja: "\u904B\u8EE2\u63A8\u5968" },
  sg4_kurz: { de: "PV \xDCberschuss High", en: "PV surplus, high", fr: "Surplus PV, \xE9lev\xE9", ja: "\u4F59\u5270\u96FB\u529B \u5927" },
  sg4_lang: { de: "Anlaufbefehl, verst\xE4rkter Betrieb", en: "Start command, increased operation", fr: "Ordre de d\xE9marrage, marche renforc\xE9e", ja: "\u904B\u8EE2\u6307\u4EE4\u3001\u51FA\u529B\u5897" },
  unbekannt: { de: "unbekannt", en: "unknown", fr: "inconnu", ja: "\u4E0D\u660E" },
  // Texte in den Fenstern
  f_waermepumpe: { de: "W\xE4rmepumpe", en: "Heat pump", fr: "Pompe \xE0 chaleur", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7" },
  f_betriebsart: { de: "Betriebsart", en: "Operating mode", fr: "Mode de fonctionnement", ja: "\u904B\u8EE2\u30E2\u30FC\u30C9" },
  f_turbomodus: { de: "Turbomodus", en: "Powerful mode", fr: "Mode puissance", ja: "\u30D1\u30EF\u30D5\u30EB\u904B\u8EE2" },
  f_leisemodus: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "\u9759\u97F3\u904B\u8EE2" },
  f_heizkurve: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "\u6696\u623F\u66F2\u7DDA" },
  f_laedt_ab: { de: "L\xE4dt ab", en: "Reheat at", fr: "Relance \xE0", ja: "\u518D\u52A0\u71B1\u958B\u59CB\u6E29\u5EA6" },
  f_aussen_kalt: { de: "Au\xDFen kalt", en: "Outdoor, cold", fr: "Ext\xE9rieur, froid", ja: "\u5916\u6C17 \u4F4E\u6E29" },
  f_aussen_warm: { de: "Au\xDFen warm", en: "Outdoor, warm", fr: "Ext\xE9rieur, doux", ja: "\u5916\u6C17 \u9AD8\u6E29" },
  f_dann_vorlauf: { de: "dann Vorlauf", en: "then flow", fr: "alors d\xE9part", ja: "\u305D\u306E\u6642\u306E\u5F80\u304D\u6E29\u5EA6" },
  f_laeuft_aus: { de: "L\xE4uft, ausschalten", en: "Running, switch off", fr: "En marche, arr\xEAter", ja: "\u904B\u8EE2\u4E2D\u3001\u505C\u6B62\u3059\u308B" },
  f_einschalten: { de: "Einschalten", en: "Switch on", fr: "Mettre en marche", ja: "\u904B\u8EE2\u3059\u308B" },
  f_abtauen_ende: { de: "Abtauen l\xE4uft, beenden", en: "Defrost running, stop", fr: "D\xE9givrage en cours, arr\xEAter", ja: "\u9664\u971C\u4E2D\u3001\u505C\u6B62\u3059\u308B" },
  f_abtauen_start: { de: "Abtauen erzwingen", en: "Force defrost", fr: "Forcer le d\xE9givrage", ja: "\u5F37\u5236\u9664\u971C" },
  f_aufheizen_ende: { de: "Aufheizen beenden", en: "Stop boost", fr: "Arr\xEAter la chauffe", ja: "\u52A0\u71B1\u3092\u505C\u6B62" },
  f_aufheizen_start: { de: "Einmalig aufheizen", en: "Boost once", fr: "Chauffe unique", ja: "\u4E00\u56DE\u3060\u3051\u52A0\u71B1" },
  f_legionellen_ende: { de: "Legionellen beenden", en: "Stop legionella cycle", fr: "Arr\xEAter le cycle l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u904B\u8EE2\u3092\u505C\u6B62" },
  f_legionellen_start: { de: "Legionellen starten", en: "Start legionella cycle", fr: "D\xE9marrer le cycle l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u904B\u8EE2\u3092\u958B\u59CB" },
  f_heizstab_aus: { de: "Heizstab sperren", en: "Block heater", fr: "Bloquer l'appoint", ja: "\u30D2\u30FC\u30BF\u30FC\u7981\u6B62" },
  f_heizstab_an: { de: "Heizstab freigeben", en: "Allow heater", fr: "Autoriser l'appoint", ja: "\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF" },
  f_hz_heizstab_ende: { de: "Heizstab Heizung freigegeben, sperren", en: "Heating element allowed, block", fr: "Appoint chauffage autoris\xE9, bloquer", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF\u4E2D\u3001\u7981\u6B62\u3059\u308B" },
  f_hz_heizstab_start: { de: "Heizstab Heizung freigeben", en: "Allow heating element", fr: "Autoriser l'appoint chauffage", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u3092\u8A31\u53EF" },
  f_kreis_aus: { de: "Kreis ausschalten", en: "Switch circuit off", fr: "Arr\xEAter le circuit", ja: "\u56DE\u8DEF\u3092\u505C\u6B62" },
  f_kreis_an: { de: "Kreis einschalten", en: "Switch circuit on", fr: "Mettre le circuit en marche", ja: "\u56DE\u8DEF\u3092\u904B\u8EE2" },
  f_puffer_aus: { de: "Pufferbetrieb ist an, ausschalten", en: "Buffer mode on, switch off", fr: "Mode tampon actif, arr\xEAter", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u904B\u8EE2\u4E2D\u3001\u505C\u6B62\u3059\u308B" },
  f_puffer_an: { de: "Pufferbetrieb einschalten", en: "Switch on buffer mode", fr: "Activer le mode tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u904B\u8EE2\u3092\u958B\u59CB" },
  f_zone_aus: { de: "Zone abschalten", en: "Switch zone off", fr: "D\xE9sactiver la zone", ja: "\u30BE\u30FC\u30F3\u3092\u505C\u6B62" },
  f_zone_an: { de: "Zone zuschalten", en: "Switch zone on", fr: "Activer la zone", ja: "\u30BE\u30FC\u30F3\u3092\u904B\u8EE2" },
  f_heizkurve_zeigen: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "\u6696\u623F\u66F2\u7DDA" },
  // Einstellungsdialog
  e_sprache: { de: "Sprache", en: "Language", fr: "Langue", ja: "\u8A00\u8A9E" },
  e_sprache_h: { de: "automatisch folgt der Spracheinstellung von Home Assistant", en: "automatic follows the Home Assistant language", fr: "automatique suit la langue de Home Assistant", ja: "\u81EA\u52D5\u306E\u5834\u5408\u306FHome Assistant\u306E\u8A00\u8A9E\u306B\u5F93\u3044\u307E\u3059" },
  e_profil: { de: "Herstellerprofil", en: "Manufacturer profile", fr: "Profil du fabricant", ja: "\u30E1\u30FC\u30AB\u30FC\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB" },
  e_thema: { de: "Farbdarstellung", en: "Colour scheme", fr: "Jeu de couleurs", ja: "\u914D\u8272" },
  e_thema_h: { de: "Automatisch folgt hell oder dunkel von Home Assistant", en: "Automatic follows light or dark mode of Home Assistant", fr: "Automatique suit le mode clair ou sombre de Home Assistant", ja: "\u81EA\u52D5\u306F Home Assistant \u306E\u30E9\u30A4\u30C8\uFF0F\u30C0\u30FC\u30AF\u306B\u5F93\u3044\u307E\u3059" },
  o_th_auto: { de: "Automatisch (wie Home Assistant)", en: "Automatic (like Home Assistant)", fr: "Automatique (comme Home Assistant)", ja: "\u81EA\u52D5\uFF08Home Assistant \u306B\u5408\u308F\u305B\u308B\uFF09" },
  o_th_dunkel: { de: "Dunkel", en: "Dark", fr: "Sombre", ja: "\u30C0\u30FC\u30AF" },
  o_th_hell: { de: "Hell", en: "Light", fr: "Clair", ja: "\u30E9\u30A4\u30C8" },
  o_th_kontrast: { de: "Hoher Kontrast", en: "High contrast", fr: "Contraste \xE9lev\xE9", ja: "\u30CF\u30A4\u30B3\u30F3\u30C8\u30E9\u30B9\u30C8" },
  o_th_nacht: { de: "Nacht (gedimmt)", en: "Night (dimmed)", fr: "Nuit (att\xE9nu\xE9)", ja: "\u591C\u9593\uFF08\u6E1B\u5149\uFF09" },
  o_th_ha: { de: "Farben des Home-Assistant-Designs", en: "Colours of the Home Assistant theme", fr: "Couleurs du th\xE8me Home Assistant", ja: "Home Assistant \u30C6\u30FC\u30DE\u306E\u8272" },
  e_modus: { de: "Editor", en: "Editor", fr: "\xC9diteur", ja: "\u30A8\u30C7\u30A3\u30BF\u30FC" },
  e_modus_h: { de: "Einfach zeigt nur die wichtigsten Einstellungen", en: "Simple shows only the most important settings", fr: "Simple n'affiche que les r\xE9glages essentiels", ja: "\u30B7\u30F3\u30D7\u30EB\u306F\u4E3B\u306A\u8A2D\u5B9A\u306E\u307F\u8868\u793A" },
  e_modus_einfach: { de: "Einfach", en: "Simple", fr: "Simple", ja: "\u30B7\u30F3\u30D7\u30EB" },
  e_modus_erweitert: { de: "Erweitert", en: "Advanced", fr: "Avanc\xE9", ja: "\u8A73\u7D30" },
  e_entitaeten: { de: "Entit\xE4ten", en: "Entities", fr: "Entit\xE9s", ja: "\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3" },
  e_entitaeten_h: { de: "Welche Entit\xE4t aus Home Assistant zu welchem Wert der Karte geh\xF6rt", en: "Which Home Assistant entity belongs to which value of the card", fr: "Quelle entit\xE9 de Home Assistant correspond \xE0 quelle valeur de la carte", ja: "\u3069\u306E Home Assistant \u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u304C\u30AB\u30FC\u30C9\u306E\u3069\u306E\u5024\u306B\u5BFE\u5FDC\u3059\u308B\u304B" },
  e_nur_fehlende: { de: "Nur fehlende anzeigen", en: "Show missing only", fr: "Afficher seulement les manquantes", ja: "\u672A\u8A2D\u5B9A\u306E\u307F\u8868\u793A" },
  e_zugeordnet: { de: "{a} von {b} zugeordnet", en: "{a} of {b} assigned", fr: "{a} sur {b} attribu\xE9es", ja: "{b} \u4EF6\u4E2D {a} \u4EF6\u5272\u308A\u5F53\u3066\u6E08\u307F" },
  e_alles_da: { de: "Alles zugeordnet, nichts fehlt.", en: "Everything assigned, nothing missing.", fr: "Tout est attribu\xE9, rien ne manque.", ja: "\u3059\u3079\u3066\u5272\u308A\u5F53\u3066\u6E08\u307F\u3067\u3059\u3002" },
  e_werkzeuge: { de: "Import, Export und Anpassungen", en: "Import, export and customisation", fr: "Import, export et personnalisation", ja: "\u30A4\u30F3\u30DD\u30FC\u30C8\u30FB\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8\u3068\u30AB\u30B9\u30BF\u30DE\u30A4\u30BA" },
  e_werkzeuge_h: { de: "Konfiguration sichern, Ger\xE4teprofile und Sprachen", en: "Back up the configuration, device profiles and languages", fr: "Sauvegarder la configuration, profils d'appareil et langues", ja: "\u8A2D\u5B9A\u306E\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7\u3001\u30C7\u30D0\u30A4\u30B9\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3001\u8A00\u8A9E" },
  e_w_konfig: { de: "Konfiguration", en: "Configuration", fr: "Configuration", ja: "\u8A2D\u5B9A" },
  e_w_profil: { de: "Ger\xE4teprofil", en: "Device profile", fr: "Profil d'appareil", ja: "\u30C7\u30D0\u30A4\u30B9\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB" },
  e_w_sprache: { de: "Sprache", en: "Language", fr: "Langue", ja: "\u8A00\u8A9E" },
  f_ok: { de: "Gefunden", en: "Found", fr: "Trouv\xE9e", ja: "\u898B\u3064\u304B\u308A\u307E\u3057\u305F" },
  f_fehlt: { de: "Diese Entit\xE4t gibt es in Home Assistant nicht", en: "This entity does not exist in Home Assistant", fr: "Cette entit\xE9 n'existe pas dans Home Assistant", ja: "\u3053\u306E\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u306F Home Assistant \u306B\u3042\u308A\u307E\u305B\u3093" },
  f_leer: { de: "Nicht zugeordnet", en: "Not assigned", fr: "Non attribu\xE9e", ja: "\u672A\u5272\u308A\u5F53\u3066" },
  f_erklaerung: { de: "Erkl\xE4rung anzeigen", en: "Show explanation", fr: "Afficher l'explication", ja: "\u8AAC\u660E\u3092\u8868\u793A" },
  e_d_allgemein: { de: "Allgemein", en: "General", fr: "G\xE9n\xE9ral", ja: "\u5168\u822C" },
  e_d_namen: { de: "Namen", en: "Names", fr: "Noms", ja: "\u540D\u524D" },
  e_d_anzeige: { de: "Was angezeigt wird", en: "What is shown", fr: "Ce qui est affich\xE9", ja: "\u8868\u793A\u3059\u308B\u5185\u5BB9" },
  e_d_groesse: { de: "Gr\xF6\xDFe", en: "Size", fr: "Taille", ja: "\u30B5\u30A4\u30BA" },
  e_d_kurve: { de: "Heizkurven-Diagramm", en: "Heating curve chart", fr: "Diagramme de la courbe", ja: "\u6696\u623F\u66F2\u7DDA\u30B0\u30E9\u30D5" },
  e_d_skalen: { de: "Farbskalen", en: "Colour scales", fr: "\xC9chelles de couleur", ja: "\u30AB\u30E9\u30FC\u30B9\u30B1\u30FC\u30EB" },
  e_d_technik: { de: "Technik", en: "Technical", fr: "Technique", ja: "\u6280\u8853\u8A2D\u5B9A" },
  e_s_export: { de: "Sprache exportieren", en: "Export language", fr: "Exporter la langue", ja: "\u8A00\u8A9E\u3092\u66F8\u304D\u51FA\u3059" },
  e_s_import: { de: "Sprache importieren", en: "Import language", fr: "Importer une langue", ja: "\u8A00\u8A9E\u3092\u8AAD\u307F\u8FBC\u3080" },
  e_s_entfernen: { de: "Eigene Sprache entfernen", en: "Remove own language", fr: "Supprimer la langue personnelle", ja: "\u72EC\u81EA\u306E\u8A00\u8A9E\u3092\u524A\u9664" },
  m_s_export_ok: { de: "Sprache \u201E{n}\u201C wurde als Datei gespeichert und steht im Download-Ordner", en: "Language \u201C{n}\u201D has been saved as a file in your downloads folder", fr: "La langue \xAB {n} \xBB a \xE9t\xE9 enregistr\xE9e dans le dossier des t\xE9l\xE9chargements", ja: "\u8A00\u8A9E\u300C{n}\u300D\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F" },
  m_s_import_ok: { de: "Sprache \u201E{n}\u201C importiert und ausgew\xE4hlt: {z} Texte, {h} Hilfetexte", en: "Language \u201C{n}\u201D imported and selected: {z} texts, {h} help texts", fr: "Langue \xAB {n} \xBB import\xE9e et s\xE9lectionn\xE9e : {z} textes, {h} textes d'aide", ja: "\u8A00\u8A9E\u300C{n}\u300D\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u9078\u629E\u3057\u307E\u3057\u305F\uFF1A\u30C6\u30AD\u30B9\u30C8 {z} \u4EF6\u3001\u30D8\u30EB\u30D7 {h} \u4EF6" },
  m_s_fehlen: { de: "{z} Texte fehlen, dort gilt die Grundsprache", en: "{z} texts are missing, the base language is used there", fr: "{z} textes manquent, la langue de base s'applique", ja: "{z} \u4EF6\u306E\u30C6\u30AD\u30B9\u30C8\u304C\u306A\u304F\u3001\u57FA\u672C\u8A00\u8A9E\u3092\u4F7F\u3044\u307E\u3059" },
  m_s_platz: { de: "Platzhalter in geschweiften Klammern passen nicht, Grundsprache verwendet bei: {liste}", en: "placeholders in curly braces do not match, base language used for: {liste}", fr: "les espaces r\xE9serv\xE9s entre accolades ne correspondent pas, langue de base utilis\xE9e pour : {liste}", ja: "\u6CE2\u304B\u3063\u3053\u306E\u30D7\u30EC\u30FC\u30B9\u30DB\u30EB\u30C0\u30FC\u304C\u4E00\u81F4\u3057\u306A\u3044\u305F\u3081\u57FA\u672C\u8A00\u8A9E\u3092\u4F7F\u7528\uFF1A{liste}" },
  m_s_zeichen: { de: "Spitze Klammern, gerade Anf\xFChrungszeichen und Backticks sind nicht erlaubt, Grundsprache verwendet bei: {liste}", en: "angle brackets, straight double quotes and backticks are not allowed, base language used for: {liste}", fr: "les chevrons, guillemets droits et accents graves isol\xE9s ne sont pas autoris\xE9s, langue de base utilis\xE9e pour : {liste}", ja: "\u5C71\u304B\u3063\u3053\u3001\u534A\u89D2\u306E\u4E8C\u91CD\u5F15\u7528\u7B26\u3001\u30D0\u30C3\u30AF\u30AF\u30A9\u30FC\u30C8\u306F\u4F7F\u3048\u306A\u3044\u305F\u3081\u57FA\u672C\u8A00\u8A9E\u3092\u4F7F\u7528\uFF1A{liste}" },
  m_s_unbekannt: { de: "{z} unbekannte Schl\xFCssel ignoriert", en: "{z} unknown keys ignored", fr: "{z} cl\xE9s inconnues ignor\xE9es", ja: "\u4E0D\u660E\u306A\u30AD\u30FC {z} \u4EF6\u3092\u7121\u8996\u3057\u307E\u3057\u305F" },
  m_s_format: { de: "Das ist keine Sprachdatei (format muss \u201Elutarym-sprachpaket\u201C sein).", en: "This is not a language file (format must be \u201Clutarym-sprachpaket\u201D).", fr: "Ce n'est pas un fichier de langue (format doit \xEAtre \xAB lutarym-sprachpaket \xBB).", ja: "\u8A00\u8A9E\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF08format \u306F\u300Clutarym-sprachpaket\u300D\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\uFF09\u3002" },
  m_s_version: { de: "Diese Version der Sprachdatei wird nicht unterst\xFCtzt (erwartet: version 1).", en: "This language file version is not supported (expected: version 1).", fr: "Cette version du fichier de langue n'est pas prise en charge (attendu : version 1).", ja: "\u3053\u306E\u8A00\u8A9E\u30D5\u30A1\u30A4\u30EB\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306B\u306F\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\uFF08version 1 \u304C\u5FC5\u8981\u3067\u3059\uFF09\u3002" },
  m_s_code: { de: "Der Sprachcode (code) fehlt oder ist ung\xFCltig, zum Beispiel \u201Enl\u201C oder \u201Ept-br\u201C.", en: "The language code (code) is missing or invalid, for example \u201Cnl\u201D or \u201Cpt-br\u201D.", fr: "Le code de langue (code) manque ou n'est pas valide, par exemple \xAB nl \xBB ou \xAB pt-br \xBB.", ja: "\u8A00\u8A9E\u30B3\u30FC\u30C9\uFF08code\uFF09\u304C\u306A\u3044\u304B\u7121\u52B9\u3067\u3059\u3002\u4F8B\uFF1A\u300Cnl\u300D\u300Cpt-br\u300D\u3002" },
  m_s_texte: { de: "Die Datei enth\xE4lt keine bekannten Texte (texte).", en: "The file contains no known texts (texte).", fr: "Le fichier ne contient aucun texte connu (texte).", ja: "\u30D5\u30A1\u30A4\u30EB\u306B\u65E2\u77E5\u306E\u30C6\u30AD\u30B9\u30C8\uFF08texte\uFF09\u304C\u3042\u308A\u307E\u305B\u3093\u3002" },
  m_s_entfernt: { de: "Eigene Sprache entfernt, die Sprache folgt wieder Home Assistant.", en: "Own language removed, the language follows Home Assistant again.", fr: "Langue personnelle supprim\xE9e, la langue suit de nouveau Home Assistant.", ja: "\u72EC\u81EA\u306E\u8A00\u8A9E\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002\u8A00\u8A9E\u306F\u518D\u3073 Home Assistant \u306B\u5F93\u3044\u307E\u3059\u3002" },
  m_s_zurueck: { de: "Anpassung entfernt, die eingebaute \xDCbersetzung gilt wieder.", en: "Customisation removed, the built-in translation applies again.", fr: "Modification supprim\xE9e, la traduction int\xE9gr\xE9e s'applique de nouveau.", ja: "\u30AB\u30B9\u30BF\u30E0\u3092\u524A\u9664\u3057\u3001\u5185\u8535\u306E\u7FFB\u8A33\u306B\u623B\u3057\u307E\u3057\u305F\u3002" },
  e_p_export: { de: "Profil exportieren", en: "Export profile", fr: "Exporter le profil", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u66F8\u304D\u51FA\u3059" },
  e_p_import: { de: "Profil importieren", en: "Import profile", fr: "Importer un profil", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3080" },
  e_p_entfernen: { de: "Eigenes Profil entfernen", en: "Remove own profile", fr: "Supprimer le profil personnel", ja: "\u72EC\u81EA\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664" },
  o_p_eigen: { de: "(eigenes)", en: "(own)", fr: "(personnel)", ja: "\uFF08\u72EC\u81EA\uFF09" },
  o_p_angepasst: { de: "(angepasst)", en: "(customised)", fr: "(modifi\xE9)", ja: "\uFF08\u30AB\u30B9\u30BF\u30E0\uFF09" },
  m_p_export_ok: { de: "Profil \u201E{n}\u201C wurde als Datei gespeichert und steht im Download-Ordner", en: "Profile \u201C{n}\u201D has been saved as a file in your downloads folder", fr: "Le profil \xAB {n} \xBB a \xE9t\xE9 enregistr\xE9 dans le dossier des t\xE9l\xE9chargements", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u300C{n}\u300D\u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A9\u30EB\u30C0\u306B\u4FDD\u5B58\u3057\u307E\u3057\u305F" },
  m_p_import_ok: { de: "Profil \u201E{n}\u201C importiert und ausgew\xE4hlt, {z} Felder beschrieben", en: "Profile \u201C{n}\u201D imported and selected, {z} fields described", fr: "Profil \xAB {n} \xBB import\xE9 et s\xE9lectionn\xE9, {z} champs d\xE9crits", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u300C{n}\u300D\u3092\u8AAD\u307F\u8FBC\u3093\u3067\u9078\u629E\u3057\u307E\u3057\u305F\u3002\u8A18\u8FF0\u3055\u308C\u305F\u9805\u76EE {z} \u4EF6" },
  m_p_gefunden: { de: "{z} davon in Home Assistant gefunden; mit \u201EAus Integration \xFCbernehmen\u201C zuordnen", en: "{z} of them found in Home Assistant; assign them with \u201CTake over from integration\u201D", fr: "{z} trouv\xE9s dans Home Assistant ; les attribuer avec \xAB Reprendre de l'int\xE9gration \xBB", ja: "Home Assistant \u3067 {z} \u4EF6\u898B\u3064\u304B\u308A\u307E\u3057\u305F\u3002\u300C\u7D71\u5408\u304B\u3089\u53D6\u308A\u8FBC\u3080\u300D\u3067\u5272\u308A\u5F53\u3066\u307E\u3059" },
  m_p_unbekannt: { de: "unbekannte Felder ignoriert: {liste}", en: "unknown fields ignored: {liste}", fr: "champs inconnus ignor\xE9s : {liste}", ja: "\u4E0D\u660E\u306A\u9805\u76EE\u3092\u7121\u8996\u3057\u307E\u3057\u305F\uFF1A{liste}" },
  m_p_format: { de: "Das ist keine Ger\xE4teprofil-Datei (format muss \u201Elutarym-geraeteprofil\u201C sein).", en: "This is not a device profile file (format must be \u201Clutarym-geraeteprofil\u201D).", fr: "Ce n'est pas un fichier de profil (format doit \xEAtre \xAB lutarym-geraeteprofil \xBB).", ja: "\u30C7\u30D0\u30A4\u30B9\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306E\u30D5\u30A1\u30A4\u30EB\u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF08format \u306F\u300Clutarym-geraeteprofil\u300D\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\uFF09\u3002" },
  m_p_version: { de: "Diese Profilversion wird nicht unterst\xFCtzt (erwartet: version 1).", en: "This profile version is not supported (expected: version 1).", fr: "Cette version de profil n'est pas prise en charge (attendu : version 1).", ja: "\u3053\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u306B\u306F\u5BFE\u5FDC\u3057\u3066\u3044\u307E\u305B\u3093\uFF08version 1 \u304C\u5FC5\u8981\u3067\u3059\uFF09\u3002" },
  m_p_id: { de: "Die Kennung (id) fehlt oder ist ung\xFCltig: 2 bis 40 Zeichen, nur a\u2013z, 0\u20139, _ und -.", en: "The identifier (id) is missing or invalid: 2 to 40 characters, only a\u2013z, 0\u20139, _ and -.", fr: "L'identifiant (id) manque ou n'est pas valide : 2 \xE0 40 caract\xE8res, seulement a\u2013z, 0\u20139, _ et -.", ja: "\u8B58\u5225\u5B50\uFF08id\uFF09\u304C\u306A\u3044\u304B\u7121\u52B9\u3067\u3059\uFF1A2\u301C40 \u6587\u5B57\u3001a\u2013z\u30010\u20139\u3001_\u3001- \u306E\u307F\u3002" },
  m_p_felder: { de: "Das Profil beschreibt kein bekanntes Feld (felder).", en: "The profile does not describe any known field (felder).", fr: "Le profil ne d\xE9crit aucun champ connu (felder).", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306B\u65E2\u77E5\u306E\u9805\u76EE\uFF08felder\uFF09\u304C\u3042\u308A\u307E\u305B\u3093\u3002" },
  m_p_leer: { de: "F\xFCr dieses Profil gibt es noch keine Beschreibung.", en: "There is no description for this profile yet.", fr: "Ce profil n'a pas encore de description.", ja: "\u3053\u306E\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306B\u306F\u307E\u3060\u8A18\u8FF0\u304C\u3042\u308A\u307E\u305B\u3093\u3002" },
  m_p_entfernt: { de: "Eigenes Profil entfernt.", en: "Own profile removed.", fr: "Profil personnel supprim\xE9.", ja: "\u72EC\u81EA\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002" },
  m_p_zurueck: { de: "Anpassung entfernt, das eingebaute Profil gilt wieder.", en: "Customisation removed, the built-in profile applies again.", fr: "Modification supprim\xE9e, le profil int\xE9gr\xE9 s'applique de nouveau.", ja: "\u30AB\u30B9\u30BF\u30E0\u3092\u524A\u9664\u3057\u3001\u5185\u8535\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306B\u623B\u3057\u307E\u3057\u305F\u3002" },
  e_profil_h: { de: "legt fest, nach welchem Namensschema gesucht wird", en: "defines the entity naming scheme to search for", fr: "d\xE9finit le sch\xE9ma de nommage recherch\xE9", ja: "\u691C\u7D22\u3059\u308B\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u540D\u306E\u898F\u5247" },
  e_anordnung: { de: "Anordnung", en: "Layout", fr: "Disposition", ja: "\u30EC\u30A4\u30A2\u30A6\u30C8" },
  e_anordnung_h: { de: "quer, hochkant oder klassisch wie bis Version 4.9 (2 Heizkreise, ohne Zusatzw\xE4rme)", en: "landscape, portrait or classic as up to version 4.9 (2 circuits, no additional heat)", fr: "paysage, portrait ou classique comme jusqu'\xE0 la version 4.9 (2 circuits, sans chaleur d'appoint)", ja: "\u6A2A\u9577\u3001\u7E26\u9577\u3001\u307E\u305F\u306F\u30D0\u30FC\u30B8\u30E7\u30F3 4.9 \u307E\u3067\u306E\u30AF\u30E9\u30B7\u30C3\u30AF\uFF082 \u56DE\u8DEF\u3001\u8FFD\u52A0\u71B1\u6E90\u306A\u3057\uFF09" },
  e_klassisch: { de: "Querformat klassisch", en: "Landscape classic", fr: "Paysage classique", ja: "\u6A2A\u9577\uFF08\u30AF\u30E9\u30B7\u30C3\u30AF\uFF09" },
  e_breite: { de: "Breite", en: "Width", fr: "Largeur", ja: "\u5E45" },
  e_hoehe: { de: "H\xF6he", en: "Height", fr: "Hauteur", ja: "\u9AD8\u3055" },
  e_pixel_auto: { de: "Pixel, 0 hei\xDFt automatisch", en: "pixels, 0 means automatic", fr: "pixels, 0 = automatique", ja: "\u30D4\u30AF\u30BB\u30EB\u30010\u3067\u81EA\u52D5" },
  e_rohr: { de: "Rohrinnendurchmesser", en: "Pipe inner diameter", fr: "Diam\xE8tre int\xE9rieur du tuyau", ja: "\u914D\u7BA1\u5185\u5F84" },
  e_rohr_h: { de: "Millimeter, f\xE4rbt den Durchfluss, 0 hei\xDFt aus", en: "millimetres, colours the flow rate, 0 means off", fr: "millim\xE8tres, colore le d\xE9bit, 0 = d\xE9sactiv\xE9", ja: "\u30DF\u30EA\u3001\u6D41\u91CF\u3092\u8272\u5206\u3051\u30010\u3067\u7121\u52B9" },
  e_mqtt: { de: "MQTT Pr\xE4fix", en: "MQTT prefix", fr: "Pr\xE9fixe MQTT", ja: "MQTT\u30D7\u30EC\u30D5\u30A3\u30C3\u30AF\u30B9" },
  e_mqtt_h: { de: "f\xFCr Befehle an HeishaMon, falls Werte nur lesbar sind", en: "for commands to HeishaMon when values are read only", fr: "pour les commandes \xE0 HeishaMon si les valeurs sont en lecture seule", ja: "\u5024\u304C\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u306E\u5834\u5408\u306BHeishaMon\u3078\u9001\u308B\u30B3\u30DE\u30F3\u30C9\u7528" },
  e_vbreite: { de: "Breite des Stromverlaufs", en: "Width of the energy chart", fr: "Largeur du graphique de consommation", ja: "\u4F7F\u7528\u91CF\u30B0\u30E9\u30D5\u306E\u5E45" },
  e_vbreite_h: { de: "250 bis 700, im Hochformat h\xF6chstens 360", en: "250 to 700, at most 360 in portrait", fr: "250 \xE0 700, au plus 360 en portrait", ja: "250\u301C700\u3001\u7E26\u9577\u3067\u306F\u6700\u5927360" },
  e_kx_von: { de: "Heizkurve Au\xDFen von", en: "Heat curve outdoor from", fr: "Courbe, ext\xE9rieur de", ja: "\u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u6700\u5C0F" },
  e_kx_von_h: { de: "linker Rand der Skala in Grad", en: "left edge of the scale in degrees", fr: "bord gauche de l'\xE9chelle en degr\xE9s", ja: "\u76EE\u76DB\u308A\u306E\u5DE6\u7AEF\uFF08\u5EA6\uFF09" },
  e_kx_bis: { de: "Heizkurve Au\xDFen bis", en: "Heat curve outdoor to", fr: "Courbe, ext\xE9rieur \xE0", ja: "\u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u6700\u5927" },
  e_kx_bis_h: { de: "rechter Rand der Skala in Grad", en: "right edge of the scale in degrees", fr: "bord droit de l'\xE9chelle en degr\xE9s", ja: "\u76EE\u76DB\u308A\u306E\u53F3\u7AEF\uFF08\u5EA6\uFF09" },
  e_ky_von: { de: "Heizkurve Vorlauf von", en: "Heat curve flow from", fr: "Courbe, d\xE9part de", ja: "\u6696\u623F\u66F2\u7DDA \u5F80\u304D \u6700\u5C0F" },
  e_ky_von_h: { de: "unterer Rand der Skala in Grad", en: "bottom of the scale in degrees", fr: "bas de l'\xE9chelle en degr\xE9s", ja: "\u76EE\u76DB\u308A\u306E\u4E0B\u7AEF\uFF08\u5EA6\uFF09" },
  e_ky_bis: { de: "Heizkurve Vorlauf bis", en: "Heat curve flow to", fr: "Courbe, d\xE9part \xE0", ja: "\u6696\u623F\u66F2\u7DDA \u5F80\u304D \u6700\u5927" },
  e_ky_bis_h: { de: "oberer Rand der Skala in Grad", en: "top of the scale in degrees", fr: "haut de l'\xE9chelle en degr\xE9s", ja: "\u76EE\u76DB\u308A\u306E\u4E0A\u7AEF\uFF08\u5EA6\uFF09" },
  e_hs_kalt: { de: "Heizungsskala kalt", en: "Heating scale, cold", fr: "\xC9chelle chauffage, froid", ja: "\u6696\u623F\u8272 \u4F4E\u6E29" },
  e_hs_kalt_h: { de: "Grad, f\xE4rbt Speicher und Leitungen", en: "degrees, colours tanks and pipes", fr: "degr\xE9s, colore ballons et tuyaux", ja: "\u5EA6\u3001\u30BF\u30F3\u30AF\u3068\u914D\u7BA1\u3092\u8272\u5206\u3051" },
  e_hs_heiss: { de: "Heizungsskala hei\xDF", en: "Heating scale, hot", fr: "\xC9chelle chauffage, chaud", ja: "\u6696\u623F\u8272 \u9AD8\u6E29" },
  e_grad: { de: "Grad", en: "degrees", fr: "degr\xE9s", ja: "\u5EA6" },
  e_as_kalt: { de: "Au\xDFenskala kalt", en: "Outdoor scale, cold", fr: "\xC9chelle ext\xE9rieure, froid", ja: "\u5916\u6C17\u8272 \u4F4E\u6E29" },
  e_as_kalt_h: { de: "Grad, f\xE4rbt den Au\xDFenf\xFChler", en: "degrees, colours the outdoor sensor", fr: "degr\xE9s, colore la sonde ext\xE9rieure", ja: "\u5EA6\u3001\u5916\u6C17\u30BB\u30F3\u30B5\u30FC\u3092\u8272\u5206\u3051" },
  e_as_warm: { de: "Au\xDFenskala warm", en: "Outdoor scale, warm", fr: "\xC9chelle ext\xE9rieure, doux", ja: "\u5916\u6C17\u8272 \u9AD8\u6E29" },
  e_l_hk1: { de: "Beschriftung Heizkreis 1", en: "Label circuit 1", fr: "Nom du circuit 1", ja: "\u56DE\u8DEF1\u306E\u8868\u793A\u540D" },
  e_l_hk2: { de: "Beschriftung Heizkreis 2", en: "Label circuit 2", fr: "Nom du circuit 2", ja: "\u56DE\u8DEF2\u306E\u8868\u793A\u540D" },
  e_l_hk_h: { de: "gilt f\xFCr Schaubild und Regler", en: "used in the diagram and the controls", fr: "utilis\xE9 dans le sch\xE9ma et les commandes", ja: "\u56F3\u3068\u64CD\u4F5C\u90E8\u306B\u8868\u793A" },
  e_l_buf: { de: "Beschriftung Puffer", en: "Label buffer", fr: "Nom du ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u306E\u8868\u793A\u540D" },
  e_l_dhw: { de: "Beschriftung Warmwasser", en: "Label hot water", fr: "Nom de l'eau chaude", ja: "\u7D66\u6E6F\u306E\u8868\u793A\u540D" },
  e_frei: { de: "frei w\xE4hlbar", en: "free text", fr: "texte libre", ja: "\u81EA\u7531\u5165\u529B" },
  e_l_energy: { de: "Beschriftung Energie", en: "Label energy", fr: "Nom de l'\xE9nergie", ja: "\u30A8\u30CD\u30EB\u30AE\u30FC\u306E\u8868\u793A\u540D" },
  e_l_energy_h: { de: "leer lassen, dann w\xE4hlt die Karte selbst", en: "leave empty to let the card choose", fr: "laisser vide pour un choix automatique", ja: "\u7A7A\u6B04\u306A\u3089\u30AB\u30FC\u30C9\u304C\u81EA\u52D5\u3067\u9078\u629E" },
  e_demo: { de: "Demomodus", en: "Demo mode", fr: "Mode d\xE9mo", ja: "\u30C7\u30E2\u30E2\u30FC\u30C9" },
  e_demo_h: { de: "erfundene Werte zum Ausprobieren, die Anlage bleibt unber\xFChrt", en: "sample values for trying out, the system is not touched", fr: "valeurs fictives pour essayer, l'installation n'est pas modifi\xE9e", ja: "\u8A66\u7528\u306E\u305F\u3081\u306E\u4EEE\u306E\u5024\u3001\u6A5F\u5668\u306B\u306F\u5F71\u97FF\u3057\u307E\u305B\u3093" },
  e_ziel_zeigen: { de: "Ziel im Puffer und Warmwasser", en: "Target in buffer and hot water", fr: "Cible dans le ballon tampon et l'eau chaude", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u3068\u7D66\u6E6F\u306E\u76EE\u6A19" },
  e_ziel_zeigen_h: { de: "Zeile \u201EZiel \u2026\u201C anzeigen", en: "show the \u201CTarget \u2026\u201D line", fr: "afficher la ligne \xAB Cible \u2026 \xBB", ja: "\u300C\u76EE\u6A19 \u2026\u300D\u306E\u884C\u3092\u8868\u793A" },
  e_laedt_zeigen: { de: "L\xE4dt ab im Puffer und Warmwasser", en: "Reload temperature in buffer and hot water", fr: "Recharge dans le ballon tampon et l'eau chaude", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u3068\u7D66\u6E6F\u306E\u518D\u52A0\u71B1\u6E29\u5EA6" },
  e_hilfe_zeigen: { de: "Knopf \u201E?\u201C f\xFCr die Hilfe", en: "\u201C?\u201D button for help", fr: "Bouton \xAB ? \xBB pour l'aide", ja: "\u30D8\u30EB\u30D7\u306E\u300C?\u300D\u30DC\u30BF\u30F3" },
  e_hilfe_zeigen_h: { de: "unten rechts in der Karte anzeigen", en: "show at the bottom right of the card", fr: "afficher en bas \xE0 droite de la carte", ja: "\u30AB\u30FC\u30C9\u53F3\u4E0B\u306B\u8868\u793A" },
  e_tuer_zeigen: { de: "Knopf f\xFCr erweiterte Einstellungen", en: "Button for advanced settings", fr: "Bouton des r\xE9glages avanc\xE9s", ja: "\u8A73\u7D30\u8A2D\u5B9A\u306E\u30DC\u30BF\u30F3" },
  e_tuer_zeigen_h: { de: "unten rechts an der W\xE4rmepumpe anzeigen", en: "show at the bottom right of the heat pump", fr: "afficher en bas \xE0 droite de la pompe \xE0 chaleur", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u53F3\u4E0B\u306B\u8868\u793A" },
  e_laedt_zeigen_h: { de: "Zeile \u201EL\xE4dt ab \u2026\u201C anzeigen", en: "show the \u201CReloads at \u2026\u201D line", fr: "afficher la ligne \xAB Recharge \xE0 \u2026 \xBB", ja: "\u300C\u518D\u52A0\u71B1 \u2026\u300D\u306E\u884C\u3092\u8868\u793A" },
  e_verlauf: { de: "Diagramme 24 Stunden", en: "24 hour charts", fr: "Graphiques 24 heures", ja: "24\u6642\u9593\u30B0\u30E9\u30D5" },
  e_verlauf_h: { de: "Verbrauch, SG Ready und Temperaturen", en: "energy, SG Ready and temperatures", fr: "consommation, SG Ready et temp\xE9ratures", ja: "\u4F7F\u7528\u91CF\u3001SG Ready\u3001\u6E29\u5EA6" },
  e_verlauf_knopf: { de: "Als Kn\xF6pfe, Fenster beim Tippen", en: "As buttons, window on tap", fr: "Boutons, fen\xEAtre au toucher", ja: "\u30DC\u30BF\u30F3\uFF08\u30BF\u30C3\u30D7\u3067\u8868\u793A\uFF09" },
  e_verlauf_karte: { de: "Verbrauch dauerhaft in der Karte", en: "Energy always in the card", fr: "Consommation toujours dans la carte", ja: "\u4F7F\u7528\u91CF\u3092\u5E38\u306B\u30AB\u30FC\u30C9\u306B\u8868\u793A" },
  d_temperaturen: { de: "Temperaturen", en: "Temperatures", fr: "Temp\xE9ratures", ja: "\u6E29\u5EA6" },
  d_24h: { de: "24 Stunden", en: "24 hours", fr: "24 heures", ja: "24\u6642\u9593" },
  e_anz_hk: { de: "Anzahl Heizkreise", en: "Number of circuits", fr: "Nombre de circuits", ja: "\u56DE\u8DEF\u6570" },
  e_anz_luefter: { de: "Anzahl L\xFCfter", en: "Number of fans", fr: "Nombre de ventilateurs", ja: "\u30D5\u30A1\u30F3\u6570" },
  e_bewegung: { de: "Animation", en: "Animation", fr: "Animation", ja: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3" },
  e_bewegung_h: { de: "Automatisch: das Ger\xE4t entscheidet (Einstellung \u201EBewegung reduzieren\u201C)", en: "Automatic: the device decides (setting \u201Creduce motion\u201D)", fr: "Automatique : l'appareil d\xE9cide (r\xE9glage \xAB r\xE9duire les animations \xBB)", ja: "\u81EA\u52D5\uFF1A\u7AEF\u672B\u306E\u8A2D\u5B9A\uFF08\u8996\u5DEE\u52B9\u679C\u3092\u6E1B\u3089\u3059\uFF09\u306B\u5F93\u3046" },
  e_tagesverbrauch: { de: "Tagesverbrauch aus dem Z\xE4hlerstand rechnen", en: "Calculate daily energy from the meter reading", fr: "Calculer la consommation du jour \xE0 partir du compteur", ja: "\u30E1\u30FC\u30BF\u30FC\u5024\u304B\u3089\u5F53\u65E5\u306E\u4F7F\u7528\u91CF\u3092\u8A08\u7B97" },
  e_alle_leeren: { de: "Alle leeren", en: "Clear all", fr: "Tout effacer", ja: "\u3059\u3079\u3066\u6D88\u53BB" },
  e_datei_speichern: { de: "Als Datei speichern", en: "Save as file", fr: "Enregistrer dans un fichier", ja: "\u30D5\u30A1\u30A4\u30EB\u306B\u4FDD\u5B58" },
  e_datei_laden: { de: "Aus Datei laden", en: "Load from file", fr: "Charger un fichier", ja: "\u30D5\u30A1\u30A4\u30EB\u304B\u3089\u8AAD\u307F\u8FBC\u307F" },
  e_uebernehmen: { de: "Aus Integration \xFCbernehmen", en: "Take over from integration", fr: "Reprendre de l'int\xE9gration", ja: "\u7D71\u5408\u304B\u3089\u53D6\u308A\u8FBC\u3080" },
  e_feld_einlesen: { de: "Aus dem Feld einlesen", en: "Read from the field", fr: "Lire depuis le champ", ja: "\u6B04\u304B\u3089\u8AAD\u307F\u8FBC\u3080" },
  e_feld_schreiben: { de: "In das Feld schreiben", en: "Write to the field", fr: "\xC9crire dans le champ", ja: "\u6B04\u306B\u66F8\u304D\u51FA\u3059" },
  e_standardnamen: { de: "Standardnamen eintragen", en: "Fill in default names", fr: "Saisir les noms par d\xE9faut", ja: "\u6A19\u6E96\u540D\u3092\u5165\u529B" },
  e_1hk: { de: "1 Heizkreis", en: "1 circuit", fr: "1 circuit", ja: "1\u56DE\u8DEF" },
  e_2hk: { de: "2 Heizkreise", en: "2 circuits", fr: "2 circuits", ja: "2\u56DE\u8DEF" },
  e_1luefter: { de: "1 L\xFCfter", en: "1 fan", fr: "1 ventilateur", ja: "\u30D5\u30A1\u30F31\u57FA" },
  e_2luefter: { de: "2 L\xFCfter", en: "2 fans", fr: "2 ventilateurs", ja: "\u30D5\u30A1\u30F32\u57FA" },
  e_hoch: { de: "Hochformat", en: "Portrait", fr: "Portrait", ja: "\u7E26\u9577" },
  e_quer: { de: "Querformat", en: "Landscape", fr: "Paysage", ja: "\u6A2A\u9577" },
  e_hk1_bild: { de: "Bild Heizkreis 1", en: "Picture heating circuit 1", fr: "Image circuit 1", ja: "\u6696\u623F\u56DE\u8DEF 1 \u306E\u56F3" },
  e_hk2_bild: { de: "Bild Heizkreis 2", en: "Picture heating circuit 2", fr: "Image circuit 2", ja: "\u6696\u623F\u56DE\u8DEF 2 \u306E\u56F3" },
  e_rad_platte: { de: "Plattenheizk\xF6rper", en: "Panel radiator", fr: "Radiateur \xE0 panneaux", ja: "\u30D1\u30CD\u30EB\u30E9\u30B8\u30A8\u30FC\u30BF\u30FC" },
  e_rad_glieder: { de: "Gliederheizk\xF6rper", en: "Column radiator", fr: "Radiateur \xE0 \xE9l\xE9ments", ja: "\u30BB\u30AF\u30B7\u30E7\u30CA\u30EB\u30E9\u30B8\u30A8\u30FC\u30BF\u30FC" },
  e_rad_fbh: { de: "Fu\xDFbodenheizung", en: "Underfloor heating", fr: "Plancher chauffant", ja: "\u5E8A\u6696\u623F" },
  e_auto: { de: "Automatisch", en: "Automatic", fr: "Automatique", ja: "\u81EA\u52D5" },
  e_darstellung: { de: "Darstellung", en: "Display", fr: "Affichage", ja: "\u8868\u793A" },
  e_integration: { de: "Integration", en: "Integration", fr: "Int\xE9gration", ja: "\u7D71\u5408" },
  e_puffer: { de: "Heizungspuffer vorhanden", en: "Heating buffer installed", fr: "Ballon tampon pr\xE9sent", ja: "\u6696\u623F\u30D0\u30C3\u30D5\u30A1\u30FC\u3042\u308A" },
  e_zirk: { de: "Zirkulation", en: "Circulation", fr: "Circulation", ja: "\u5FAA\u74B0" },
  e_zirk_h: { de: "automatisch sobald eine Zirkulationsentit\xE4t zugeordnet ist", en: "automatic as soon as a circulation entity is assigned", fr: "automatique d\xE8s qu'une entit\xE9 de circulation est attribu\xE9e", ja: "\u5FAA\u74B0\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u304C\u5272\u308A\u5F53\u3066\u3089\u308C\u308B\u3068\u81EA\u52D5" },
  e_puffer_auto_h: { de: "automatisch folgt TOP99, der Meldung der W\xE4rmepumpe", en: "automatic follows TOP99, reported by the heat pump", fr: "automatique suit TOP99, signal\xE9 par la pompe \xE0 chaleur", ja: "\u81EA\u52D5\u306E\u5834\u5408\u306F\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u306ETOP99\u306B\u5F93\u3046" },
  e_anzeigen: { de: "Anzeigen", en: "Show", fr: "Afficher", ja: "\u8868\u793A" },
  e_ausblenden: { de: "Ausblenden", en: "Hide", fr: "Masquer", ja: "\u975E\u8868\u793A" },
  e_vorhanden: { de: "Vorhanden", en: "Installed", fr: "Pr\xE9sent", ja: "\u3042\u308A" },
  e_nicht_vorhanden: { de: "Nicht vorhanden", en: "Not installed", fr: "Absent", ja: "\u306A\u3057" },
  // Meldungen
  m_erkannt_p: { de: "Profil \u201E{n}\u201C: {a} Entit\xE4ten gefunden, {b} davon passen zu dieser Karte.", en: "Profile \u201C{n}\u201D: {a} entities found, {b} of them match this card.", fr: "Profil \xAB {n} \xBB : {a} entit\xE9s trouv\xE9es, dont {b} correspondent \xE0 cette carte.", ja: "\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u300C{n}\u300D\uFF1A{a} \u4EF6\u306E\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u306E\u3046\u3061 {b} \u4EF6\u304C\u3053\u306E\u30AB\u30FC\u30C9\u306B\u5BFE\u5FDC\u3057\u307E\u3059\u3002" },
  m_erkannt: { de: "Heishamon by Lutarym erkannt. {a} Entit\xE4ten gefunden, {b} davon passen zu dieser Karte.", en: "Heishamon by Lutarym detected. {a} entities found, {b} of them match this card.", fr: "Heishamon by Lutarym d\xE9tect\xE9. {a} entit\xE9s trouv\xE9es, dont {b} correspondent \xE0 cette carte.", ja: "Heishamon by Lutarym \u3092\u691C\u51FA\u3057\u307E\u3057\u305F\u3002{a} \u4EF6\u306E\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u306E\u3046\u3061 {b} \u4EF6\u304C\u3053\u306E\u30AB\u30FC\u30C9\u306B\u5BFE\u5FDC\u3057\u307E\u3059\u3002" },
  m_nicht_erkannt: { de: "Keine Entit\xE4ten der Integration gefunden. Du kannst die Standardnamen eintragen und danach anpassen.", en: "No entities of the integration found. You can fill in the default names and adjust them afterwards.", fr: "Aucune entit\xE9 de l'int\xE9gration trouv\xE9e. Vous pouvez saisir les noms par d\xE9faut puis les ajuster.", ja: "\u7D71\u5408\u306E\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u6A19\u6E96\u540D\u3092\u5165\u529B\u3057\u3066\u304B\u3089\u8ABF\u6574\u3067\u304D\u307E\u3059\u3002" },
  m_json: { de: "Das ist kein g\xFCltiges JSON. Bitte den exportierten Text einf\xFCgen.", en: "This is not valid JSON. Please paste the exported text.", fr: "Ce n'est pas un JSON valide. Veuillez coller le texte export\xE9.", ja: "\u6709\u52B9\u306AJSON\u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u66F8\u304D\u51FA\u3057\u305F\u30C6\u30AD\u30B9\u30C8\u3092\u8CBC\u308A\u4ED8\u3051\u3066\u304F\u3060\u3055\u3044\u3002" },
  m_datei_ok: { de: "Datei wurde erzeugt und steht im Download-Ordner.", en: "The file has been created and is in your downloads folder.", fr: "Le fichier a \xE9t\xE9 cr\xE9\xE9 et se trouve dans le dossier des t\xE9l\xE9chargements.", ja: "\u30D5\u30A1\u30A4\u30EB\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F\u3002\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u30D5\u30A9\u30EB\u30C0\u306B\u3042\u308A\u307E\u3059\u3002" },
  m_keine_konfig: { de: "Der Text enth\xE4lt keine Konfiguration.", en: "The text contains no configuration.", fr: "Le texte ne contient aucune configuration.", ja: "\u30C6\u30AD\u30B9\u30C8\u306B\u8A2D\u5B9A\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u305B\u3093\u3002" },
  m_datei_fehler: { de: "Die Datei konnte nicht erzeugt werden.", en: "The file could not be created.", fr: "Le fichier n'a pas pu \xEAtre cr\xE9\xE9.", ja: "\u30D5\u30A1\u30A4\u30EB\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002" },
  m_datei_lesen: { de: "Die Datei konnte nicht gelesen werden.", en: "The file could not be read.", fr: "Le fichier n'a pas pu \xEAtre lu.", ja: "\u30D5\u30A1\u30A4\u30EB\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002" },
  m_im_feld: { de: "Konfiguration steht im Feld und ist markiert, zum Kopieren bereit.", en: "The configuration is in the field and selected, ready to copy.", fr: "La configuration est dans le champ et s\xE9lectionn\xE9e, pr\xEAte \xE0 \xEAtre copi\xE9e.", ja: "\u8A2D\u5B9A\u3092\u6B04\u306B\u66F8\u304D\u51FA\u3057\u3066\u9078\u629E\u3057\u307E\u3057\u305F\u3002\u30B3\u30D4\u30FC\u3067\u304D\u307E\u3059\u3002" },
  m_einst: { de: "{n} Einstellungen", en: "{n} settings", fr: "{n} r\xE9glages", ja: "\u8A2D\u5B9A {n} \u4EF6" },
  m_ent: { de: "{n} Entit\xE4ten \xFCbernommen", en: "{n} entities applied", fr: "{n} entit\xE9s appliqu\xE9es", ja: "\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3 {n} \u4EF6\u3092\u9069\u7528" },
  m_unb_einst: { de: "{n} unbekannte Einstellungen \xFCbersprungen", en: "{n} unknown settings skipped", fr: "{n} r\xE9glages inconnus ignor\xE9s", ja: "\u4E0D\u660E\u306A\u8A2D\u5B9A {n} \u4EF6\u3092\u30B9\u30AD\u30C3\u30D7" },
  m_unb_felder: { de: "{n} unbekannte Felder \xFCbersprungen", en: "{n} unknown fields skipped", fr: "{n} champs inconnus ignor\xE9s", ja: "\u4E0D\u660E\u306A\u9805\u76EE {n} \u4EF6\u3092\u30B9\u30AD\u30C3\u30D7" },
  m_bereich: { de: "{n} mit unpassendem Bereich \xFCbersprungen", en: "{n} with an unsuitable domain skipped", fr: "{n} avec un domaine inadapt\xE9 ignor\xE9s", ja: "\u30C9\u30E1\u30A4\u30F3\u304C\u5408\u308F\u306A\u3044 {n} \u4EF6\u3092\u30B9\u30AD\u30C3\u30D7" },
  m_fehlen: { de: "{n} davon gibt es in Home Assistant nicht: {liste}", en: "{n} of them do not exist in Home Assistant: {liste}", fr: "{n} n'existent pas dans Home Assistant : {liste}", ja: "\u305D\u306E\u3046\u3061 {n} \u4EF6\u306FHome Assistant\u306B\u3042\u308A\u307E\u305B\u3093\uFF1A{liste}" },
  m_weitere: { de: " und weitere", en: " and more", fr: " et d'autres", ja: " \u307B\u304B" },
  m_nicht_an: { de: "ACHTUNG, nicht angekommen: {liste}", en: "WARNING, not applied: {liste}", fr: "ATTENTION, non appliqu\xE9 : {liste}", ja: "\u6CE8\u610F\u3001\u9069\u7528\u3055\u308C\u3066\u3044\u307E\u305B\u3093\uFF1A{liste}" },
  // Entitaetsfelder
  fld_outside_temp: { de: "Au\xDFentemperatur", en: "Outdoor temperature", fr: "Temp\xE9rature ext\xE9rieure", ja: "\u5916\u6C17\u6E29" },
  fld_power_state: { de: "W\xE4rmepumpe Status, gr\xFCne LED", en: "Heat pump status, green LED", fr: "\xC9tat de la pompe \xE0 chaleur, LED verte", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u72B6\u614B\u3001\u7DD1LED" },
  fld_compressor: { de: "Verdichterdrehzahl", en: "Compressor frequency", fr: "Fr\xE9quence du compresseur", ja: "\u5727\u7E2E\u6A5F\u5468\u6CE2\u6570" },
  fld_fan1_rpm: { de: "L\xFCfter 1 Drehzahl", en: "Fan 1 speed", fr: "Vitesse ventilateur 1", ja: "\u30D5\u30A1\u30F31\u56DE\u8EE2\u6570" },
  fld_fan2_rpm: { de: "L\xFCfter 2 Drehzahl", en: "Fan 2 speed", fr: "Vitesse ventilateur 2", ja: "\u30D5\u30A1\u30F32\u56DE\u8EE2\u6570" },
  fld_defrost: { de: "Abtauung l\xE4uft", en: "Defrost running", fr: "D\xE9givrage en cours", ja: "\u9664\u971C\u4E2D" },
  fld_error: { de: "Fehlercode", en: "Error code", fr: "Code d'erreur", ja: "\u30A8\u30E9\u30FC\u30B3\u30FC\u30C9" },
  fld_heatpump_state: { de: "Betriebszustand", en: "Operating state", fr: "\xC9tat de fonctionnement", ja: "\u904B\u8EE2\u72B6\u614B" },
  fld_force_defrost: { de: "Abtauen erzwingen", en: "Force defrost", fr: "Forcer le d\xE9givrage", ja: "\u5F37\u5236\u9664\u971C" },
  fld_powerful_mode: { de: "Turbomodus", en: "Powerful mode", fr: "Mode puissance", ja: "\u30D1\u30EF\u30D5\u30EB\u904B\u8EE2" },
  fld_quiet_mode: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "\u9759\u97F3\u904B\u8EE2" },
  fld_power_now: { de: "Aktuelle Leistungsaufnahme", en: "Current power draw", fr: "Puissance absorb\xE9e actuelle", ja: "\u73FE\u5728\u306E\u6D88\u8CBB\u96FB\u529B" },
  fld_energy_today: { de: "Energiez\xE4hler", en: "Energy meter", fr: "Compteur d'\xE9nergie", ja: "\u96FB\u529B\u91CF\u8A08" },
  fld_pv_power: { de: "PV Leistung aktuell", en: "Current PV power", fr: "Puissance PV actuelle", ja: "\u73FE\u5728\u306E\u592A\u967D\u5149\u51FA\u529B" },
  fld_sg_k1: { de: "Kontakt K1 Sperre", en: "Contact K1, block", fr: "Contact K1, blocage", ja: "\u63A5\u70B9K1 \u505C\u6B62" },
  fld_sg_k2: { de: "Kontakt K2 Anlauf", en: "Contact K2, start", fr: "Contact K2, d\xE9marrage", ja: "\u63A5\u70B9K2 \u8D77\u52D5" },
  fld_flow_temp: { de: "Vorlauftemperatur", en: "Flow temperature", fr: "Temp\xE9rature de d\xE9part", ja: "\u5F80\u304D\u6E29\u5EA6" },
  fld_return_temp: { de: "R\xFCcklauftemperatur", en: "Return temperature", fr: "Temp\xE9rature de retour", ja: "\u9084\u308A\u6E29\u5EA6" },
  fld_pump_speed: { de: "Prim\xE4rpumpe Drehzahl", en: "Primary pump speed", fr: "Vitesse de la pompe primaire", ja: "\u4E00\u6B21\u30DD\u30F3\u30D7\u56DE\u8EE2\u6570" },
  fld_pump_flow: { de: "Durchflussmenge", en: "Flow rate", fr: "D\xE9bit", ja: "\u6D41\u91CF" },
  fld_three_way_valve: { de: "3-Wege-Umschaltventil", en: "Three-way diverter valve", fr: "Vanne trois voies", ja: "\u4E09\u65B9\u5F01" },
  fld_water_pressure: { de: "Wasserdruck", en: "Water pressure", fr: "Pression d'eau", ja: "\u6C34\u5727" },
  fld_buffer_temp: { de: "Puffertemperatur", en: "Buffer temperature", fr: "Temp\xE9rature du ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u6E29\u5EA6" },
  fld_buffer_installed: { de: "Puffer vorhanden", en: "Buffer installed", fr: "Ballon tampon pr\xE9sent", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u3042\u308A" },
  fld_buffer_switch: { de: "Pufferbetrieb ein und aus", en: "Buffer mode on and off", fr: "Mode tampon marche et arr\xEAt", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u904B\u8EE2\u306E\u5165\u5207" },
  fld_curve_t_high: { de: "HK1 Heizkurve Vorlauf oben", en: "Circuit 1 heat curve, flow high", fr: "Circuit 1 courbe, d\xE9part haut", ja: "\u56DE\u8DEF1 \u6696\u623F\u66F2\u7DDA \u5F80\u304D \u9AD8" },
  fld_curve_t_low: { de: "HK1 Heizkurve Vorlauf unten", en: "Circuit 1 heat curve, flow low", fr: "Circuit 1 courbe, d\xE9part bas", ja: "\u56DE\u8DEF1 \u6696\u623F\u66F2\u7DDA \u5F80\u304D \u4F4E" },
  fld_curve_o_high: { de: "HK1 Heizkurve Au\xDFen oben", en: "Circuit 1 heat curve, outdoor high", fr: "Circuit 1 courbe, ext\xE9rieur haut", ja: "\u56DE\u8DEF1 \u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u9AD8" },
  fld_curve_o_low: { de: "HK1 Heizkurve Au\xDFen unten", en: "Circuit 1 heat curve, outdoor low", fr: "Circuit 1 courbe, ext\xE9rieur bas", ja: "\u56DE\u8DEF1 \u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u4F4E" },
  fld_curve2_t_high: { de: "HK2 Heizkurve Vorlauf oben", en: "Circuit 2 heat curve, flow high", fr: "Circuit 2 courbe, d\xE9part haut", ja: "\u56DE\u8DEF2 \u6696\u623F\u66F2\u7DDA \u5F80\u304D \u9AD8" },
  fld_curve2_t_low: { de: "HK2 Heizkurve Vorlauf unten", en: "Circuit 2 heat curve, flow low", fr: "Circuit 2 courbe, d\xE9part bas", ja: "\u56DE\u8DEF2 \u6696\u623F\u66F2\u7DDA \u5F80\u304D \u4F4E" },
  fld_curve2_o_high: { de: "HK2 Heizkurve Au\xDFen oben", en: "Circuit 2 heat curve, outdoor high", fr: "Circuit 2 courbe, ext\xE9rieur haut", ja: "\u56DE\u8DEF2 \u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u9AD8" },
  fld_curve2_o_low: { de: "HK2 Heizkurve Au\xDFen unten", en: "Circuit 2 heat curve, outdoor low", fr: "Circuit 2 courbe, ext\xE9rieur bas", ja: "\u56DE\u8DEF2 \u6696\u623F\u66F2\u7DDA \u5916\u6C17 \u4F4E" },
  fld_buffer_delta: { de: "Puffer Hysterese", en: "Buffer hysteresis", fr: "Hyst\xE9r\xE9sis du ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u306E\u30D2\u30B9\u30C6\u30EA\u30B7\u30B9" },
  fld_buffer_target: { de: "Puffer Zieltemperatur", en: "Buffer target temperature", fr: "Temp\xE9rature cible du ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u76EE\u6A19\u6E29\u5EA6" },
  fld_room_heater: { de: "Heizstab Heizung freigegeben", en: "Heating element, heating: allowed", fr: "Appoint chauffage autoris\xE9", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF" },
  fld_heater_internal: { de: "Heizstab intern l\xE4uft", en: "Internal heater running", fr: "Appoint interne en marche", ja: "\u5185\u90E8\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u4E2D" },
  fld_heater_external: { de: "Heizstab extern l\xE4uft", en: "External heater running", fr: "Appoint externe en marche", ja: "\u5916\u90E8\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u4E2D" },
  fld_cop_heating: { de: "COP Heizen", en: "COP heating", fr: "COP chauffage", ja: "COP \u6696\u623F" },
  fld_room_heater_switch: { de: "Heizstab Heizung freigeben", en: "Allow heating element, heating", fr: "Autoriser l'appoint chauffage", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF\u306E\u5207\u66FF" },
  fld_zones_state: { de: "Aktivierte Zonen", en: "Active zones", fr: "Zones actives", ja: "\u6709\u52B9\u306A\u30BE\u30FC\u30F3" },
  fld_zones_select: { de: "Zonen umschalten", en: "Switch zones", fr: "Changer de zones", ja: "\u30BE\u30FC\u30F3\u5207\u66FF" },
  fld_hk1_water: { de: "HK1 Wassertemperatur", en: "Circuit 1 water temperature", fr: "Circuit 1 temp\xE9rature d'eau", ja: "\u56DE\u8DEF1 \u6C34\u6E29" },
  fld_hk1_water_target: { de: "HK1 Wasser Sollwert", en: "Circuit 1 water target", fr: "Circuit 1 consigne d'eau", ja: "\u56DE\u8DEF1 \u76EE\u6A19\u6C34\u6E29" },
  fld_hk1_pump: { de: "HK1 Pumpe l\xE4uft", en: "Circuit 1 pump running", fr: "Circuit 1 pompe en marche", ja: "\u56DE\u8DEF1 \u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_hk1_setpoint: { de: "HK1 Sollwert einstellbar", en: "Circuit 1 adjustable target", fr: "Circuit 1 consigne r\xE9glable", ja: "\u56DE\u8DEF1 \u8A2D\u5B9A\u6E29\u5EA6" },
  fld_hk1_switch: { de: "HK1 ein und aus", en: "Circuit 1 on and off", fr: "Circuit 1 marche et arr\xEAt", ja: "\u56DE\u8DEF1 \u5165\u5207" },
  fld_hk2_water: { de: "HK2 Wassertemperatur", en: "Circuit 2 water temperature", fr: "Circuit 2 temp\xE9rature d'eau", ja: "\u56DE\u8DEF2 \u6C34\u6E29" },
  fld_hk2_water_target: { de: "HK2 Wasser Sollwert", en: "Circuit 2 water target", fr: "Circuit 2 consigne d'eau", ja: "\u56DE\u8DEF2 \u76EE\u6A19\u6C34\u6E29" },
  fld_hk2_pump: { de: "HK2 Pumpe l\xE4uft", en: "Circuit 2 pump running", fr: "Circuit 2 pompe en marche", ja: "\u56DE\u8DEF2 \u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_hk2_setpoint: { de: "HK2 Sollwert einstellbar", en: "Circuit 2 adjustable target", fr: "Circuit 2 consigne r\xE9glable", ja: "\u56DE\u8DEF2 \u8A2D\u5B9A\u6E29\u5EA6" },
  fld_hk2_switch: { de: "HK2 ein und aus", en: "Circuit 2 on and off", fr: "Circuit 2 marche et arr\xEAt", ja: "\u56DE\u8DEF2 \u5165\u5207" },
  fld_dhw_installed: { de: "Warmwasser vorhanden", en: "Hot water installed", fr: "Eau chaude pr\xE9sente", ja: "\u7D66\u6E6F\u3042\u308A" },
  fld_dhw_temp: { de: "Warmwasser Isttemperatur", en: "Hot water temperature", fr: "Temp\xE9rature de l'eau chaude", ja: "\u7D66\u6E6F\u6E29\u5EA6" },
  fld_dhw_heat_delta: { de: "Warmwasser Hysterese", en: "Hot water hysteresis", fr: "Hyst\xE9r\xE9sis de l'eau chaude", ja: "\u7D66\u6E6F\u306E\u30D2\u30B9\u30C6\u30EA\u30B7\u30B9" },
  fld_dhw_setpoint: { de: "Warmwasser Sollwert", en: "Hot water target", fr: "Consigne eau chaude", ja: "\u7D66\u6E6F\u8A2D\u5B9A\u6E29\u5EA6" },
  fld_dhw_heater: { de: "Heizstab Warmwasser freigegeben", en: "Heating element, hot water: allowed", fr: "Appoint eau chaude autoris\xE9", ja: "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF" },
  fld_dhw_force: { de: "Einmalig aufheizen", en: "Boost once", fr: "Chauffe unique", ja: "\u4E00\u56DE\u3060\u3051\u52A0\u71B1" },
  fld_dhw_force_state: { de: "Aufheizen l\xE4uft", en: "Boost running", fr: "Chauffe en cours", ja: "\u52A0\u71B1\u4E2D" },
  fld_force_sterilization: { de: "Legionellenschutz starten", en: "Start legionella cycle", fr: "D\xE9marrer le cycle l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u904B\u8EE2\u3092\u958B\u59CB" },
  fld_sterilization_state: { de: "Legionellenschutz l\xE4uft", en: "Legionella cycle running", fr: "Cycle l\xE9gionelles en cours", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u904B\u8EE2\u4E2D" },
  fld_dhw_heater_switch: { de: "Heizstab Warmwasser freigeben", en: "Allow heating element, hot water", fr: "Autoriser l'appoint eau chaude", ja: "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC\u8A31\u53EF\u306E\u5207\u66FF" },
  fld_circulation_pump: { de: "Zirkulationspumpe l\xE4uft", en: "Circulation pump running", fr: "Pompe de circulation en marche", ja: "\u5FAA\u74B0\u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_cop_dhw: { de: "COP Warmwasser", en: "COP hot water", fr: "COP eau chaude", ja: "COP \u7D66\u6E6F" },
  fld_circ_switch: { de: "Zirkulation Schalter (klickbar)", en: "Circulation switch (clickable)", fr: "Interrupteur de circulation (cliquable)", ja: "\u5FAA\u74B0\u30B9\u30A4\u30C3\u30C1\uFF08\u30AF\u30EA\u30C3\u30AF\u53EF\uFF09" },
  fld_mode_select: { de: "Betriebsart umschalten", en: "Switch operating mode", fr: "Changer de mode", ja: "\u904B\u8EE2\u30E2\u30FC\u30C9\u5207\u66FF" },
  // Gruppen der Entitaetsfelder
  grp_0: { de: "Au\xDFenf\xFChler", en: "Outdoor sensor", fr: "Sonde ext\xE9rieure", ja: "\u5916\u6C17\u30BB\u30F3\u30B5\u30FC" },
  grp_1: { de: "Au\xDFenger\xE4t", en: "Outdoor unit", fr: "Unit\xE9 ext\xE9rieure", ja: "\u5BA4\u5916\u6A5F" },
  grp_2: { de: "Heizkreis 1", en: "Circuit 1", fr: "Circuit 1", ja: "\u56DE\u8DEF1" },
  grp_3: { de: "Heizkreis 2", en: "Circuit 2", fr: "Circuit 2", ja: "\u56DE\u8DEF2" },
  grp_4: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "\u6696\u623F\u66F2\u7DDA" },
  grp_5: { de: "Heizungspuffer", en: "Heating buffer", fr: "Ballon tampon", ja: "\u6696\u623F\u30D0\u30C3\u30D5\u30A1\u30FC" },
  grp_6: { de: "Prim\xE4rkreis", en: "Primary circuit", fr: "Circuit primaire", ja: "\u4E00\u6B21\u56DE\u8DEF" },
  grp_7: { de: "SG Ready", en: "SG Ready", fr: "SG Ready", ja: "SG Ready" },
  grp_8: { de: "Steuerung", en: "Control", fr: "Commande", ja: "\u5236\u5FA1" },
  grp_9: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "\u7D66\u6E6F" },
  // Hinweise zu den Feldern
  hnw_0: { de: "gilt f\xFCr beide", en: "applies to both", fr: "vaut pour les deux", ja: "\u4E21\u65B9\u306B\u9069\u7528" },
  hnw_1: { de: "eigener Schalter, optional", en: "own switch, optional", fr: "interrupteur propre, facultatif", ja: "\u72EC\u81EA\u30B9\u30A4\u30C3\u30C1\u3001\u4EFB\u610F" },
  hnw_2: { de: "Shelly, Relais oder Eingang", en: "Shelly, relay or input", fr: "Shelly, relais ou entr\xE9e", ja: "Shelly\u3001\u30EA\u30EC\u30FC\u307E\u305F\u306F\u5165\u529B" },
  hnw_3: { de: "eigene Entit\xE4t, Watt", en: "own entity, watts", fr: "entit\xE9 propre, watts", ja: "\u72EC\u81EA\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u3001\u30EF\u30C3\u30C8" },
  hnw_4: { de: "Soll Vorlauf", en: "flow target", fr: "consigne d\xE9part", ja: "\u5F80\u304D\u76EE\u6A19" },
  hnw_5: { de: "Shelly oder eigener Schalter", en: "Shelly or own switch", fr: "Shelly ou interrupteur propre", ja: "Shelly\u307E\u305F\u306F\u72EC\u81EA\u30B9\u30A4\u30C3\u30C1" },
  hnw_6: { de: "Switch zum Ein/Ausschalten der Zirkulation", en: "switch to turn circulation on and off", fr: "interrupteur pour la circulation", ja: "\u5FAA\u74B0\u306E\u5165\u5207\u30B9\u30A4\u30C3\u30C1" },
  hnw_7: { de: "SetHeatpump oder TOP0", en: "SetHeatpump or TOP0", fr: "SetHeatpump ou TOP0", ja: "SetHeatpump \u307E\u305F\u306F TOP0" },
  fld_hk3_water: { de: "HK3 Wassertemperatur", en: "Circuit 3 water temperature", fr: "Circuit 3 temp\xE9rature d'eau", ja: "\u56DE\u8DEF3 \u6C34\u6E29" },
  fld_hk3_pump: { de: "HK3 Pumpe l\xE4uft", en: "Circuit 3 pump running", fr: "Circuit 3 pompe en marche", ja: "\u56DE\u8DEF3 \u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_hk3_switch: { de: "HK3 ein und aus", en: "Circuit 3 on and off", fr: "Circuit 3 marche et arr\xEAt", ja: "\u56DE\u8DEF3 \u5165\u5207" },
  fld_hk4_water: { de: "HK4 Wassertemperatur", en: "Circuit 4 water temperature", fr: "Circuit 4 temp\xE9rature d'eau", ja: "\u56DE\u8DEF4 \u6C34\u6E29" },
  fld_hk4_pump: { de: "HK4 Pumpe l\xE4uft", en: "Circuit 4 pump running", fr: "Circuit 4 pompe en marche", ja: "\u56DE\u8DEF4 \u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_hk4_switch: { de: "HK4 ein und aus", en: "Circuit 4 on and off", fr: "Circuit 4 marche et arr\xEAt", ja: "\u56DE\u8DEF4 \u5165\u5207" },
  fld_kamin_temp: { de: "Kamin Temperatur", en: "Stove temperature", fr: "Temp\xE9rature du po\xEAle", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6\u6E29\u5EA6" },
  fld_kamin_pump: { de: "Kamin Pumpe l\xE4uft", en: "Stove pump running", fr: "Pompe du po\xEAle en marche", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6 \u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  fld_solar_temp: { de: "Solarthermie Temperatur", en: "Solar thermal temperature", fr: "Temp\xE9rature solaire thermique", ja: "\u592A\u967D\u71B1\u6E29\u5EA6" },
  fld_solar_pump: { de: "Solarthermie Pumpe l\xE4uft", en: "Solar thermal pump running", fr: "Pompe solaire en marche", ja: "\u592A\u967D\u71B1\u30DD\u30F3\u30D7\u904B\u8EE2\u4E2D" },
  grp_11: { de: "Heizkreis 3", en: "Heating circuit 3", fr: "Circuit de chauffage 3", ja: "\u6696\u623F\u56DE\u8DEF 3" },
  grp_12: { de: "Heizkreis 4", en: "Heating circuit 4", fr: "Circuit de chauffage 4", ja: "\u6696\u623F\u56DE\u8DEF 4" },
  grp_13: { de: "Zusatzw\xE4rme", en: "Additional heat", fr: "Chaleur d'appoint", ja: "\u8FFD\u52A0\u71B1\u6E90" },
  hnw_9: { de: "eigene Entit\xE4t, \xB0C", en: "own entity, \xB0C", fr: "entit\xE9 propre, \xB0C", ja: "\u72EC\u81EA\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u3001\xB0C" },
  hnw_10: { de: "eigener Schalter oder Sensor", en: "own switch or sensor", fr: "interrupteur ou capteur propre", ja: "\u72EC\u81EA\u306E\u30B9\u30A4\u30C3\u30C1\u307E\u305F\u306F\u30BB\u30F3\u30B5\u30FC" },
  hnw_11: { de: "eigene Entit\xE4t, \xB0C; Kamin allein: TOP47", en: "own entity, \xB0C; stove only: TOP47", fr: "entit\xE9 propre, \xB0C ; po\xEAle seul : TOP47", ja: "\u72EC\u81EA\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u3001\xB0C\u3002\u85AA\u30B9\u30C8\u30FC\u30D6\u306E\u307F\uFF1ATOP47" },
  hnw_12: { de: "eigener Schalter oder Sensor; Kamin allein: OPT5", en: "own switch or sensor; stove only: OPT5", fr: "interrupteur ou capteur propre ; po\xEAle seul : OPT5", ja: "\u72EC\u81EA\u306E\u30B9\u30A4\u30C3\u30C1\u307E\u305F\u306F\u30BB\u30F3\u30B5\u30FC\u3002\u85AA\u30B9\u30C8\u30FC\u30D6\u306E\u307F\uFF1AOPT5" },
  kamin: { de: "Kamin", en: "Stove", fr: "Po\xEAle", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6" },
  solarthermie: { de: "Solarthermie", en: "Solar thermal", fr: "Solaire thermique", ja: "\u592A\u967D\u71B1" },
  pumpe_wert: { de: "Pumpe {v}", en: "Pump {v}", fr: "Pompe {v}", ja: "\u30DD\u30F3\u30D7 {v}" },
  e_zusatz: { de: "Zusatzw\xE4rme am Puffer", en: "Additional heat at the buffer", fr: "Chaleur d'appoint au ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u306E\u8FFD\u52A0\u71B1\u6E90" },
  e_zusatz_h: { de: "nur mit Heizungspuffer", en: "only with a heating buffer", fr: "uniquement avec ballon tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC\u304C\u3042\u308B\u5834\u5408\u306E\u307F" },
  e_feuer_ab: { de: "Feuer im Kamin ab", en: "Fire in the stove from", fr: "Feu dans le po\xEAle \xE0 partir de", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6\u306E\u708E\u306E\u8868\u793A\u6E29\u5EA6" },
  e_feuer_ab_h: { de: "\xB0C Kamintemperatur, Standard 30", en: "\xB0C stove temperature, default 30", fr: "\xB0C temp\xE9rature du po\xEAle, 30 par d\xE9faut", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6\u6E29\u5EA6 \xB0C\u3001\u65E2\u5B9A 30" },
  e_sonne_ab: { de: "Sonne \xFCber Solarthermie ab", en: "Sun above solar thermal from", fr: "Soleil sur le solaire thermique \xE0 partir de", ja: "\u592A\u967D\u71B1\u306E\u592A\u967D\u8868\u793A\u6E29\u5EA6" },
  e_sonne_ab_h: { de: "\xB0C Kollektortemperatur, Standard 30", en: "\xB0C collector temperature, default 30", fr: "\xB0C temp\xE9rature du capteur, 30 par d\xE9faut", ja: "\u96C6\u71B1\u5668\u6E29\u5EA6 \xB0C\u3001\u65E2\u5B9A 30" },
  e_solarstil: { de: "Solarthermie Darstellung", en: "Solar thermal style", fr: "Style du solaire thermique", ja: "\u592A\u967D\u71B1\u306E\u8868\u793A" },
  e_solarstil_h: { de: "Bild und Animation, wenn die Sonne scheint", en: "picture and animation while the sun shines", fr: "image et animation quand le soleil brille", ja: "\u592A\u967D\u304C\u51FA\u3066\u3044\u308B\u3068\u304D\u306E\u56F3\u3068\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3" },
  o_solar_strahlen: { de: "Lichtstrahlen und Zellenwelle", en: "Light rays and cell wave", fr: "Rayons et vague de cellules", ja: "\u5149\u7DDA\u3068\u30BB\u30EB\u306E\u6CE2" },
  o_solar_funkeln: { de: "Aufw\xE4rmen und Funkeln", en: "Warming and sparkle", fr: "R\xE9chauffement et scintillement", ja: "\u52A0\u71B1\u3068\u304D\u3089\u3081\u304D" },
  o_solar_roehren: { de: "R\xF6hrenkollektor", en: "Tube collector", fr: "Capteur \xE0 tubes", ja: "\u771F\u7A7A\u7BA1\u96C6\u71B1\u5668" },
  e_zusatz_beide: { de: "Kamin und Solarthermie", en: "Stove and solar thermal", fr: "Po\xEAle et solaire thermique", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6\u3068\u592A\u967D\u71B1" },
  e_3hk: { de: "3 Heizkreise", en: "3 circuits", fr: "3 circuits", ja: "3\u56DE\u8DEF" },
  e_4hk: { de: "4 Heizkreise", en: "4 circuits", fr: "4 circuits", ja: "4\u56DE\u8DEF" },
  e_hk3_bild: { de: "Bild Heizkreis 3", en: "Picture heating circuit 3", fr: "Image circuit 3", ja: "\u6696\u623F\u56DE\u8DEF 3 \u306E\u56F3" },
  e_hk4_bild: { de: "Bild Heizkreis 4", en: "Picture heating circuit 4", fr: "Image circuit 4", ja: "\u6696\u623F\u56DE\u8DEF 4 \u306E\u56F3" },
  e_l_hk3: { de: "Beschriftung Heizkreis 3", en: "Label circuit 3", fr: "Nom du circuit 3", ja: "\u56DE\u8DEF3\u306E\u8868\u793A\u540D" },
  e_l_hk4: { de: "Beschriftung Heizkreis 4", en: "Label circuit 4", fr: "Nom du circuit 4", ja: "\u56DE\u8DEF4\u306E\u8868\u793A\u540D" },
  hnw_8: { de: "Quelle in der Integration unter COP Quelle w\xE4hlbar", en: "source selectable in the integration under COP source", fr: "source r\xE9glable dans l'int\xE9gration sous Source COP", ja: "\u30BD\u30FC\u30B9\u306F\u7D71\u5408\u306E COP \u30BD\u30FC\u30B9\u3067\u9078\u629E" },
  grp_10: { de: "Erweiterte Einstellungen", en: "Advanced settings", fr: "R\xE9glages avanc\xE9s", ja: "\u8A73\u7D30\u8A2D\u5B9A" },
  fld_heating_off_temp: { de: "Heizen aus ab Au\xDFentemperatur", en: "Heating off above outdoor temp.", fr: "Arr\xEAt chauffage au-dessus de", ja: "\u6696\u623F\u505C\u6B62 \u5916\u6C17\u6E29" },
  fld_heater_on_temp: { de: "Heizstab ein unter Au\xDFentemperatur", en: "Heater on below outdoor temp.", fr: "Appoint actif en dessous de", ja: "\u30D2\u30FC\u30BF\u30FC\u958B\u59CB \u5916\u6C17\u6E29" },
  fld_heat_delta: { de: "Spreizung Heizen", en: "Heating spread (\u0394T)", fr: "\xC9cart chauffage (\u0394T)", ja: "\u6696\u623F\u6E29\u5EA6\u5DEE (\u0394T)" },
  fld_heating_control: { de: "Regelung", en: "Heating control", fr: "R\xE9gulation", ja: "\u6696\u623F\u5236\u5FA1" },
  fld_steril_temp: { de: "Legionellen Temperatur", en: "Legionella temperature", fr: "Temp\xE9rature anti-l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56\u6E29\u5EA6" },
  fld_steril_time: { de: "Legionellen Haltezeit", en: "Legionella hold time", fr: "Dur\xE9e anti-l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56\u4FDD\u6301\u6642\u9593" },
  fld_pump_flow_mode: { de: "Pumpenregelung", en: "Pump control", fr: "R\xE9gulation de pompe", ja: "\u30DD\u30F3\u30D7\u5236\u5FA1" },
  fld_pump_max_duty: { de: "Max. Pumpenleistung", en: "Max. pump duty", fr: "Puissance max. pompe", ja: "\u30DD\u30F3\u30D7\u6700\u5927\u51FA\u529B" },
  fld_quiet_priority: { de: "Leisemodus Vorrang", en: "Quiet mode priority", fr: "Priorit\xE9 mode silencieux", ja: "\u9759\u97F3\u30E2\u30FC\u30C9\u512A\u5148" },
  o_komfort: { de: "Komfort", en: "Comfort", fr: "Confort", ja: "\u5FEB\u9069" },
  o_effizienz: { de: "Effizienz", en: "Efficiency", fr: "Efficacit\xE9", ja: "\u52B9\u7387" },
  o_spreizung: { de: "Spreizung", en: "Spread", fr: "\xC9cart", ja: "\u6E29\u5EA6\u5DEE" },
  o_max_leistung: { de: "Max. Leistung", en: "Max. duty", fr: "Puissance max.", ja: "\u6700\u5927\u51FA\u529B" },
  o_lautstaerke: { de: "Lautst\xE4rke", en: "Sound", fr: "Son", ja: "\u9759\u97F3" },
  o_leistung: { de: "Leistung", en: "Capacity", fr: "Puissance", ja: "\u80FD\u529B" },
  k_heating_off_temp: { de: "Heizen aus ab", en: "Heating off above", fr: "Arr\xEAt au-dessus de", ja: "\u6696\u623F\u505C\u6B62" },
  k_heater_on_temp: { de: "Heizstab unter", en: "Heater below", fr: "Appoint sous", ja: "\u30D2\u30FC\u30BF\u30FC\u958B\u59CB" },
  k_heat_delta: { de: "Spreizung", en: "Spread", fr: "\xC9cart", ja: "\u6E29\u5EA6\u5DEE" },
  k_heating_control: { de: "Regelung", en: "Control", fr: "R\xE9gulation", ja: "\u5236\u5FA1" },
  k_steril_temp: { de: "Temperatur", en: "Temperature", fr: "Temp\xE9rature", ja: "\u6E29\u5EA6" },
  k_steril_time: { de: "Haltezeit", en: "Hold time", fr: "Dur\xE9e", ja: "\u4FDD\u6301\u6642\u9593" },
  k_pump_flow_mode: { de: "Regelung", en: "Control", fr: "R\xE9gulation", ja: "\u5236\u5FA1" },
  k_pump_max_duty: { de: "Max. Leistung", en: "Max. duty", fr: "Puissance max.", ja: "\u6700\u5927\u51FA\u529B" },
  k_quiet_priority: { de: "Vorrang", en: "Priority", fr: "Priorit\xE9", ja: "\u512A\u5148" },
  t_legionellen: { de: "Legionellenschutz", en: "Legionella protection", fr: "Anti-l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u5BFE\u7B56" },
  t_leise: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "\u9759\u97F3\u30E2\u30FC\u30C9" },
  fld_holiday_mode: { de: "Urlaubsmodus", en: "Holiday mode", fr: "Mode vacances", ja: "\u4F11\u6687\u30E2\u30FC\u30C9" },
  fld_main_schedule: { de: "Wochenprogramm", en: "Weekly schedule", fr: "Programme hebdomadaire", ja: "\u9031\u9593\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB" },
  fld_smart_dhw: { de: "Smart DHW Warmwasser", en: "Smart DHW", fr: "Smart DHW eau chaude", ja: "\u30B9\u30DE\u30FC\u30C8\u7D66\u6E6F" },
  fld_fault_reset: { de: "St\xF6rung quittieren", en: "Reset fault", fr: "Acquitter le d\xE9faut", ja: "\u7570\u5E38\u30EA\u30BB\u30C3\u30C8" },
  fld_operating_hours: { de: "Betriebsstunden", en: "Operating hours", fr: "Heures de fonctionnement", ja: "\u904B\u8EE2\u6642\u9593" },
  fld_compressor_starts: { de: "Verdichterstarts", en: "Compressor starts", fr: "D\xE9marrages du compresseur", ja: "\u5727\u7E2E\u6A5F\u8D77\u52D5\u56DE\u6570" },
  fld_room_heater_hours: { de: "Heizstab Heizen Betriebsstunden", en: "Heater hours, heating", fr: "Heures appoint chauffage", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u6642\u9593" },
  fld_dhw_heater_hours: { de: "Heizstab Warmwasser Betriebsstunden", en: "Heater hours, hot water", fr: "Heures appoint eau chaude", ja: "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u6642\u9593" },
  k_holiday_mode: { de: "Urlaub", en: "Holiday", fr: "Vacances", ja: "\u4F11\u6687" },
  k_main_schedule: { de: "Wochenprogramm", en: "Weekly schedule", fr: "Programme hebdo", ja: "\u9031\u9593\u30B9\u30B1\u30B8\u30E5\u30FC\u30EB" },
  k_smart_dhw: { de: "Smart DHW", en: "Smart DHW", fr: "Smart DHW", ja: "\u30B9\u30DE\u30FC\u30C8\u7D66\u6E6F" },
  k_fault_reset: { de: "Fehler", en: "Error", fr: "Erreur", ja: "\u30A8\u30E9\u30FC" },
  k_operating_hours: { de: "Betriebsstunden", en: "Operating hours", fr: "Heures", ja: "\u904B\u8EE2\u6642\u9593" },
  k_compressor_starts: { de: "Verdichterstarts", en: "Compressor starts", fr: "D\xE9marrages", ja: "\u8D77\u52D5\u56DE\u6570" },
  k_room_heater_hours: { de: "Heizstab Heizen", en: "Heater, heating", fr: "Appoint chauffage", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC" },
  k_dhw_heater_hours: { de: "Heizstab Warmwasser", en: "Heater, hot water", fr: "Appoint eau chaude", ja: "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC" },
  o_aus: { de: "Aus", en: "Off", fr: "Arr\xEAt", ja: "\u30AA\u30D5" },
  o_ein: { de: "Ein", en: "On", fr: "Marche", ja: "\u30AA\u30F3" },
  o_variabel: { de: "Variabel", en: "Variable", fr: "Variable", ja: "\u53EF\u5909" },
  o_standard: { de: "Standard", en: "Standard", fr: "Standard", ja: "\u6A19\u6E96" },
  t_quittieren: { de: "Quittieren", en: "Reset", fr: "Acquitter", ja: "\u30EA\u30BB\u30C3\u30C8" },
  t_betrieb: { de: "Betrieb", en: "Operation", fr: "Fonctionnement", ja: "\u904B\u8EE2" },
  t_stoerung: { de: "St\xF6rung", en: "Fault", fr: "D\xE9faut", ja: "\u7570\u5E38" },
  t_cop: { de: "Leistungszahl (COP)", en: "Coefficient of performance (COP)", fr: "Coefficient de performance (COP)", ja: "\u6210\u7E3E\u4FC2\u6570\uFF08COP\uFF09" },
  j_cop_heute: { de: "Heute COP {v}", en: "Today COP {v}", fr: "Aujourd'hui COP {v}", ja: "\u4ECA\u65E5\u306E COP {v}" },
  t_jaz: { de: "Jahresarbeitszahl (JAZ)", en: "Seasonal performance (SPF)", fr: "Coefficient annuel (SPF)", ja: "\u5E74\u9593\u6027\u80FD\u4FC2\u6570\uFF08SPF\uFF09" },
  k_jaz_12: { de: "Letzte 12 Monate", en: "Last 12 months", fr: "12 derniers mois", ja: "\u76F4\u8FD1 12 \u304B\u6708" },
  j_gesamt: { de: "Gesamt", en: "Total", fr: "Total", ja: "\u5408\u8A08" },
  j_heizen: { de: "Heizen", en: "Heating", fr: "Chauffage", ja: "\u6696\u623F" },
  j_ww: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "\u7D66\u6E6F" },
  j_kwaerme: { de: "W\xE4rme", en: "Heat", fr: "Chaleur", ja: "\u71B1\u91CF" },
  j_kstrom: { de: "Strom", en: "Electricity", fr: "\xC9lectricit\xE9", ja: "\u96FB\u529B" },
  j_kjaz: { de: "JAZ", en: "SPF", fr: "SPF", ja: "SPF" },
  j_unter: { de: "Seit 1. Januar, W\xE4rme und Strom in kWh", en: "Since 1 January, heat and electricity in kWh", fr: "Depuis le 1er janvier, chaleur et \xE9lectricit\xE9 en kWh", ja: "1 \u6708 1 \u65E5\u304B\u3089\u3001\u71B1\u91CF\u3068\u96FB\u529B\u306F kWh" },
  k_jaz_jahr: { de: "Seit 1. Januar", en: "Since 1 January", fr: "Depuis le 1er janvier", ja: "1 \u6708 1 \u65E5\u304B\u3089" },
  j_seit: { de: "Daten erst seit {v}", en: "data only since {v}", fr: "donn\xE9es depuis le {v} seulement", ja: "{v} \u4EE5\u964D\u306E\u30C7\u30FC\u30BF\u306E\u307F" },
  j_titel: { de: "W\xE4rme {w} kWh geteilt durch Strom {s} kWh", en: "Heat {w} kWh divided by electricity {s} kWh", fr: "Chaleur {w} kWh divis\xE9e par \xE9lectricit\xE9 {s} kWh", ja: "\u71B1 {w} kWh \xF7 \u96FB\u529B {s} kWh" },
  t_info: { de: "Info", en: "Info", fr: "Infos", ja: "\u60C5\u5831" },
  h_knopf: { de: "Hilfe zu allen Werten", en: "Help for all values", fr: "Aide sur toutes les valeurs", ja: "\u3059\u3079\u3066\u306E\u5024\u306E\u30D8\u30EB\u30D7" },
  h_titel: { de: "Was bedeutet welcher Wert?", en: "What does each value mean?", fr: "Que signifie chaque valeur ?", ja: "\u5404\u5024\u306E\u610F\u5473" },
  h_suche: { de: "Suchen, z. B. Warmwasser, Heizkurve, TOP9 \u2026", en: "Search, e.g. hot water, heating curve, TOP9 \u2026", fr: "Rechercher, p. ex. eau chaude, courbe, TOP9 \u2026", ja: "\u691C\u7D22\uFF08\u4F8B\uFF1A\u7D66\u6E6F\u3001\u6696\u623F\u66F2\u7DDA\u3001TOP9 \u2026\uFF09" },
  h_alle: { de: "Alle", en: "All", fr: "Tout", ja: "\u3059\u3079\u3066" },
  h_lesen: { de: "Lesen", en: "Read", fr: "Lecture", ja: "\u8AAD\u307F\u53D6\u308A" },
  h_schreiben: { de: "Schreiben", en: "Write", fr: "\xC9criture", ja: "\u66F8\u304D\u8FBC\u307F" },
  h_anzahl: { de: "{n} Eintr\xE4ge", en: "{n} entries", fr: "{n} entr\xE9es", ja: "{n} \u4EF6" },
  r_bereitschaft: { de: "Bereitschaft", en: "Standby", fr: "Veille", ja: "\u5F85\u6A5F" },
  s_verbrauch_heute: { de: "Verbrauch heute", en: "Consumption today", fr: "Consommation du jour", ja: "\u672C\u65E5\u306E\u6D88\u8CBB\u96FB\u529B\u91CF" },
  s_max: { de: "max {v}", en: "max {v}", fr: "max {v}", ja: "\u6700\u5927 {v}" },
  s_temperatur: { de: "Temperatur", en: "Temperature", fr: "Temp\xE9rature", ja: "\u6E29\u5EA6" },
  h_kopieren: { de: "Klicken zum Kopieren", en: "Click to copy", fr: "Cliquer pour copier", ja: "\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u30B3\u30D4\u30FC" },
  h_kopiert: { de: "Kopiert", en: "Copied", fr: "Copi\xE9", ja: "\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F" },
  h_entitaet: { de: "Entit\xE4t", en: "Entity", fr: "Entit\xE9", ja: "\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3" },
  h_keine_entitaet: { de: "Keine passende Entit\xE4t in Home Assistant gefunden", en: "No matching entity found in Home Assistant", fr: "Aucune entit\xE9 correspondante trouv\xE9e dans Home Assistant", ja: "Home Assistant \u306B\u8A72\u5F53\u3059\u308B\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u304C\u3042\u308A\u307E\u305B\u3093" },
  h_anzahl1: { de: "1 Eintrag", en: "1 entry", fr: "1 entr\xE9e", ja: "1 \u4EF6" },
  h_keine: { de: "Nichts gefunden. Anderes Suchwort versuchen.", en: "Nothing found. Try another search term.", fr: "Aucun r\xE9sultat. Essayez un autre mot.", ja: "\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\u5225\u306E\u8A9E\u3067\u691C\u7D22\u3057\u3066\u304F\u3060\u3055\u3044\u3002" },
  h_quelle: { de: "Grundlage: HeishaMon-Dokumentation und Panasonic-Anleitung. Was dort nicht beschrieben ist, steht hier auch nicht.", en: "Based on: HeishaMon documentation and Panasonic manual. What is not described there is not stated here either.", fr: "Sources : documentation HeishaMon et notice Panasonic. Ce qui n'y est pas d\xE9crit n'est pas affirm\xE9 ici.", ja: "\u51FA\u5178\uFF1AHeishaMon \u306E\u8AAC\u660E\u66F8\u3068 Panasonic \u306E\u53D6\u6271\u8AAC\u660E\u66F8\u3002\u305D\u3053\u306B\u66F8\u304B\u308C\u3066\u3044\u306A\u3044\u3053\u3068\u306F\u3053\u3053\u3067\u3082\u8FF0\u3079\u3066\u3044\u307E\u305B\u3093\u3002" },
  t_oeffnen: { de: "Erweiterte Einstellungen \xF6ffnen", en: "Open advanced settings", fr: "Ouvrir les r\xE9glages avanc\xE9s", ja: "\u8A73\u7D30\u8A2D\u5B9A\u3092\u958B\u304F" },
  t_heizen: { de: "Heizen", en: "Heating", fr: "Chauffage", ja: "\u6696\u623F" },
  t_warmwasser: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "\u7D66\u6E6F" },
  t_pumpe: { de: "Pumpe", en: "Pump", fr: "Pompe", ja: "\u30DD\u30F3\u30D7" },
  t_uebernehmen: { de: "\xDCbernehmen", en: "Apply", fr: "Appliquer", ja: "\u9069\u7528" },
  t_abbrechen: { de: "Abbrechen", en: "Cancel", fr: "Annuler", ja: "\u30AD\u30E3\u30F3\u30BB\u30EB" },
  t_nur_lesbar: { de: "nur lesbar", en: "read only", fr: "lecture seule", ja: "\u8AAD\u307F\u53D6\u308A\u5C02\u7528" },
  s_versch: { de: "Verschiebung der Heizkurve", en: "Heat curve shift", fr: "D\xE9calage de la courbe", ja: "\u6696\u623F\u66F2\u7DDA\u306E\u30B7\u30D5\u30C8" },
  r_verlauf_zeigen: { de: "Verlauf anzeigen", en: "Show history", fr: "Afficher l'historique", ja: "\u5C65\u6B74\u3092\u8868\u793A" },
  s_cop: { de: "\xD8 COP heute {v}", en: "\xD8 COP today {v}", fr: "\xD8 COP jour {v}", ja: "\u672C\u65E5 \xD8 COP {v}" },
  // Auswahl- und Zustandswerte
  w_0: { de: "Nur Heizen", en: "Heat only", fr: "Chauffage seul", ja: "\u6696\u623F\u306E\u307F" },
  w_1: { de: "Nur K\xFChlen", en: "Cool only", fr: "Refroidissement seul", ja: "\u51B7\u623F\u306E\u307F" },
  w_2: { de: "Automatik Heizen", en: "Auto heat", fr: "Chauffage auto", ja: "\u81EA\u52D5\u6696\u623F" },
  w_3: { de: "Nur Warmwasser", en: "Hot water only", fr: "Eau chaude seule", ja: "\u7D66\u6E6F\u306E\u307F" },
  w_4: { de: "Heizen und Warmwasser", en: "Heat and hot water", fr: "Chauffage et eau chaude", ja: "\u6696\u623F\u3068\u7D66\u6E6F" },
  w_5: { de: "K\xFChlen und Warmwasser", en: "Cool and hot water", fr: "Refroidissement et eau chaude", ja: "\u51B7\u623F\u3068\u7D66\u6E6F" },
  w_6: { de: "Automatik Heizen und Warmwasser", en: "Auto heat and hot water", fr: "Chauffage auto et eau chaude", ja: "\u81EA\u52D5\u6696\u623F\u3068\u7D66\u6E6F" },
  w_7: { de: "Automatik K\xFChlen", en: "Auto cool", fr: "Refroidissement auto", ja: "\u81EA\u52D5\u51B7\u623F" },
  w_8: { de: "Automatik K\xFChlen und Warmwasser", en: "Auto cool and hot water", fr: "Refroidissement auto et eau chaude", ja: "\u81EA\u52D5\u51B7\u623F\u3068\u7D66\u6E6F" },
  w_9: { de: "Aus", en: "Off", fr: "Arr\xEAt", ja: "\u30AA\u30D5" },
  w_10: { de: "Stufe 1", en: "Level 1", fr: "Niveau 1", ja: "\u30EC\u30D9\u30EB1" },
  w_11: { de: "Stufe 2", en: "Level 2", fr: "Niveau 2", ja: "\u30EC\u30D9\u30EB2" },
  w_12: { de: "Stufe 3", en: "Level 3", fr: "Niveau 3", ja: "\u30EC\u30D9\u30EB3" },
  w_13: { de: "30 Minuten", en: "30 minutes", fr: "30 minutes", ja: "30\u5206" },
  w_14: { de: "60 Minuten", en: "60 minutes", fr: "60 minutes", ja: "60\u5206" },
  w_15: { de: "90 Minuten", en: "90 minutes", fr: "90 minutes", ja: "90\u5206" },
  w_16: { de: "Heizung", en: "Heating", fr: "Chauffage", ja: "\u6696\u623F" },
  w_17: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "\u7D66\u6E6F" },
  w_18: { de: "l\xE4uft", en: "running", fr: "en marche", ja: "\u904B\u8EE2\u4E2D" },
  w_19: { de: "aus", en: "off", fr: "arr\xEAt", ja: "\u505C\u6B62" },
  w_20: { de: "W\xE4rmepumpe", en: "Heat pump", fr: "Pompe \xE0 chaleur", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7" },
  w_21: { de: "Pumpe HK1", en: "Pump circuit 1", fr: "Pompe circuit 1", ja: "\u56DE\u8DEF1\u30DD\u30F3\u30D7" },
  w_22: { de: "Pumpe HK2", en: "Pump circuit 2", fr: "Pompe circuit 2", ja: "\u56DE\u8DEF2\u30DD\u30F3\u30D7" },
  w_23: { de: "Heizstab Heizung", en: "Heater, heating", fr: "Appoint chauffage", ja: "\u6696\u623F\u30D2\u30FC\u30BF\u30FC" },
  w_43: { de: "Heizstab l\xE4uft", en: "Heater running", fr: "Appoint en marche", ja: "\u30D2\u30FC\u30BF\u30FC\u904B\u8EE2\u4E2D" },
  w_44: { de: "Pumpe Kamin", en: "Stove pump", fr: "Pompe po\xEAle", ja: "\u85AA\u30B9\u30C8\u30FC\u30D6\u30DD\u30F3\u30D7" },
  w_45: { de: "Pumpe Solarthermie", en: "Solar thermal pump", fr: "Pompe solaire thermique", ja: "\u592A\u967D\u71B1\u30DD\u30F3\u30D7" },
  w_46: { de: "Pumpe HK3", en: "Pump circuit 3", fr: "Pompe circuit 3", ja: "\u56DE\u8DEF3\u30DD\u30F3\u30D7" },
  w_47: { de: "Pumpe HK4", en: "Pump circuit 4", fr: "Pompe circuit 4", ja: "\u56DE\u8DEF4\u30DD\u30F3\u30D7" },
  w_48: { de: "HK3 Wasser", en: "Circuit 3 water", fr: "Circuit 3 eau", ja: "\u56DE\u8DEF3 \u6C34\u6E29" },
  w_49: { de: "HK4 Wasser", en: "Circuit 4 water", fr: "Circuit 4 eau", ja: "\u56DE\u8DEF4 \u6C34\u6E29" },
  w_24: { de: "Heizstab Warmwasser", en: "Heater, hot water", fr: "Appoint eau chaude", ja: "\u7D66\u6E6F\u30D2\u30FC\u30BF\u30FC" },
  w_25: { de: "Abtauung", en: "Defrost", fr: "D\xE9givrage", ja: "\u9664\u971C" },
  w_26: { de: "Zirkulation Status", en: "Circulation", fr: "Circulation", ja: "\u5FAA\u74B0" },
  w_27: { de: "Aufheizen", en: "Boost", fr: "Chauffe", ja: "\u52A0\u71B1" },
  w_28: { de: "Legionellenschutz", en: "Legionella cycle", fr: "Cycle l\xE9gionelles", ja: "\u30EC\u30B8\u30AA\u30CD\u30E9\u904B\u8EE2" },
  w_29: { de: "PV Leistung", en: "PV power", fr: "Puissance PV", ja: "\u592A\u967D\u5149\u51FA\u529B" },
  w_30: { de: "Au\xDFen", en: "Outdoor", fr: "Ext\xE9rieur", ja: "\u5916\u6C17" },
  w_31: { de: "Vorlauf", en: "Flow", fr: "D\xE9part", ja: "\u5F80\u304D" },
  w_32: { de: "R\xFCcklauf", en: "Return", fr: "Retour", ja: "\u9084\u308A" },
  w_33: { de: "Puffer", en: "Buffer", fr: "Tampon", ja: "\u30D0\u30C3\u30D5\u30A1\u30FC" },
  w_34: { de: "HK1 Wasser", en: "Circuit 1 water", fr: "Circuit 1 eau", ja: "\u56DE\u8DEF1 \u6C34\u6E29" },
  w_35: { de: "HK2 Wasser", en: "Circuit 2 water", fr: "Circuit 2 eau", ja: "\u56DE\u8DEF2 \u6C34\u6E29" },
  w_36: { de: "Verdichter", en: "Compressor", fr: "Compresseur", ja: "\u5727\u7E2E\u6A5F" },
  w_37: { de: "Durchfluss", en: "Flow rate", fr: "D\xE9bit", ja: "\u6D41\u91CF" },
  w_38: { de: "Panasonic Aquarea, HeishaMon \xFCber MQTT-Namensschema", en: "Panasonic Aquarea, HeishaMon via MQTT naming", fr: "Panasonic Aquarea, HeishaMon via nommage MQTT", ja: "Panasonic Aquarea\u3001MQTT\u547D\u540D\u898F\u5247\u306EHeishaMon" },
  w_39: { de: "Vaillant, in Vorbereitung", en: "Vaillant, in preparation", fr: "Vaillant, en pr\xE9paration", ja: "Vaillant\uFF08\u6E96\u5099\u4E2D\uFF09" },
  w_40: { de: "Bosch, in Vorbereitung", en: "Bosch, in preparation", fr: "Bosch, en pr\xE9paration", ja: "Bosch\uFF08\u6E96\u5099\u4E2D\uFF09" },
  w_41: { de: "Viessmann, in Vorbereitung", en: "Viessmann, in preparation", fr: "Viessmann, en pr\xE9paration", ja: "Viessmann\uFF08\u6E96\u5099\u4E2D\uFF09" },
  w_42: { de: "Stiebel Eltron, in Vorbereitung", en: "Stiebel Eltron, in preparation", fr: "Stiebel Eltron, en pr\xE9paration", ja: "Stiebel Eltron\uFF08\u6E96\u5099\u4E2D\uFF09" },
  r_demo_hinweis: { de: "Erfundene Werte, die Anlage bleibt unber\xFChrt", en: "Sample values, the system is not touched", fr: "Valeurs fictives, l'installation n'est pas modifi\xE9e", ja: "\u4EEE\u306E\u5024\u3067\u3059\u3002\u6A5F\u5668\u306B\u306F\u5F71\u97FF\u3057\u307E\u305B\u3093" },
  r_stoerung: { de: "St\xF6rung", en: "Fault", fr: "D\xE9faut", ja: "\u7570\u5E38" },
  r_zurueck: { de: "Zur\xFCcksetzen", en: "Reset", fr: "R\xE9initialiser", ja: "\u30EA\u30BB\u30C3\u30C8" },
  r_betrieb: { de: "Betrieb", en: "Operation", fr: "Fonctionnement", ja: "\u904B\u8EE2" },
  r_heizen: { de: "Heizen", en: "Heating", fr: "Chauffage", ja: "\u6696\u623F" },
  r_kuehlen: { de: "K\xFChlen", en: "Cooling", fr: "Refroidissement", ja: "\u51B7\u623F" },
  r_automatik: { de: "Automatik", en: "Automatic", fr: "Automatique", ja: "\u81EA\u52D5" },
  r_abtauen: { de: "Abtauen", en: "Defrost", fr: "D\xE9givrage", ja: "\u9664\u971C" },
  r_platzhalter: { de: "Hier erscheint die exportierte Konfiguration. Zum Einlesen eigenen Text einf\xFCgen und auf Einlesen dr\xFCcken.", en: "The exported configuration appears here. To import, paste your own text and press read.", fr: "La configuration export\xE9e appara\xEEt ici. Pour importer, collez votre texte et appuyez sur lire.", ja: "\u66F8\u304D\u51FA\u3057\u305F\u8A2D\u5B9A\u304C\u3053\u3053\u306B\u8868\u793A\u3055\u308C\u307E\u3059\u3002\u8AAD\u307F\u8FBC\u3080\u306B\u306F\u30C6\u30AD\u30B9\u30C8\u3092\u8CBC\u308A\u4ED8\u3051\u3066\u8AAD\u307F\u8FBC\u307F\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002" },
  r_sg_hinweis: { de: "SG Ready liefert HeishaMon nicht. Trage die beiden Kontakte ein, K1 f\xFCr Sperre und K2 f\xFCr Anlauf. Den Betriebszustand 1 bis 4 leitet die Karte daraus selbst ab. Die Kn\xF6pfe oben f\xFChren zusammen und l\xF6schen eigene Eintr\xE4ge nicht.", en: "HeishaMon does not provide SG Ready. Enter the two contacts, K1 for block and K2 for start. The card derives operating states 1 to 4 from them. The buttons above merge and do not delete your own entries.", fr: "HeishaMon ne fournit pas SG Ready. Indiquez les deux contacts, K1 pour le blocage et K2 pour le d\xE9marrage. La carte en d\xE9duit les \xE9tats 1 \xE0 4. Les boutons ci-dessus fusionnent et n'effacent pas vos saisies.", ja: "HeishaMon\u306FSG Ready\u3092\u63D0\u4F9B\u3057\u307E\u305B\u3093\u3002\u505C\u6B62\u7528\u306EK1\u3068\u8D77\u52D5\u7528\u306EK2\u306E2\u3064\u306E\u63A5\u70B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u904B\u8EE2\u72B6\u614B1\u301C4\u306F\u30AB\u30FC\u30C9\u304C\u81EA\u52D5\u3067\u5224\u5B9A\u3057\u307E\u3059\u3002\u4E0A\u306E\u30DC\u30BF\u30F3\u306F\u7D71\u5408\u3059\u308B\u3060\u3051\u3067\u3001\u72EC\u81EA\u306E\u5165\u529B\u306F\u6D88\u3057\u307E\u305B\u3093\u3002" },
  r_zonen_unbekannt: { de: "Zonen unbekannt", en: "Zones unknown", fr: "Zones inconnues", ja: "\u30BE\u30FC\u30F3\u4E0D\u660E" },
  r_einziger_kreis: { de: "Einziger aktiver Heizkreis", en: "Only active circuit", fr: "Seul circuit actif", ja: "\u552F\u4E00\u306E\u7A3C\u50CD\u56DE\u8DEF" },
  r_upm: { de: "U/min", en: "rpm", fr: "tr/min", ja: "rpm" },
  // Statuszeilen
  s_ziel: { de: "Ziel {v} \xB0C", en: "Target {v} \xB0C", fr: "Cible {v} \xB0C", ja: "\u76EE\u6A19 {v} \xB0C" },
  s_laedt_ab: { de: "L\xE4dt ab {v} \xB0C", en: "Reheat at {v} \xB0C", fr: "Relance \xE0 {v} \xB0C", ja: "{v} \xB0C \u4EE5\u4E0B\u3067\u518D\u52A0\u71B1" },
  s_stoerung: { de: "St\xF6rung der W\xE4rmepumpe: {v}", en: "Heat pump fault: {v}", fr: "D\xE9faut de la pompe \xE0 chaleur : {v}", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u7570\u5E38\uFF1A{v}" },
  s_keine_ent: { de: "Keine Entit\xE4ten zugeordnet. Karte bearbeiten und oben auf \u201EAus Integration \xFCbernehmen\u201C dr\xFCcken.", en: "No entities assigned. Edit the card and press \u201CTake over from integration\u201D at the top.", fr: "Aucune entit\xE9 attribu\xE9e. Modifiez la carte et appuyez sur \xAB Reprendre de l'int\xE9gration \xBB en haut.", ja: "\u30A8\u30F3\u30C6\u30A3\u30C6\u30A3\u304C\u5272\u308A\u5F53\u3066\u3089\u308C\u3066\u3044\u307E\u305B\u3093\u3002\u30AB\u30FC\u30C9\u3092\u7DE8\u96C6\u3057\u3001\u4E0A\u90E8\u306E\u300C\u7D71\u5408\u304B\u3089\u53D6\u308A\u8FBC\u3080\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002" },
  s_aussen: { de: "{v} \xB0C au\xDFen", en: "{v} \xB0C outdoor", fr: "{v} \xB0C ext\xE9rieur", ja: "\u5916\u6C17 {v} \xB0C" },
  s_vorlauf_soll: { de: "\u2192 {v} \xB0C Vorlauf", en: "\u2192 {v} \xB0C flow", fr: "\u2192 {v} \xB0C d\xE9part", ja: "\u2192 \u5F80\u304D {v} \xB0C" },
  s_zaehler: { de: "Z\xE4hlerstand gesamt", en: "Meter total", fr: "Index total", ja: "\u7A4D\u7B97\u5024" },
  s_schema: { de: "Schema der W\xE4rmepumpenanlage", en: "Heat pump system diagram", fr: "Sch\xE9ma de l'installation", ja: "\u30D2\u30FC\u30C8\u30DD\u30F3\u30D7\u30B7\u30B9\u30C6\u30E0\u56F3" },
  s_kleiner: { de: "Kleiner", en: "Decrease", fr: "Diminuer", ja: "\u4E0B\u3052\u308B" },
  s_groesser: { de: "Gr\xF6\xDFer", en: "Increase", fr: "Augmenter", ja: "\u4E0A\u3052\u308B" },
  f_einstellen: { de: "Einstellen", en: "Settings", fr: "R\xE9glages", ja: "\u8A2D\u5B9A" },
  f_schliessen: { de: "Schlie\xDFen", en: "Close", fr: "Fermer", ja: "\u9589\u3058\u308B" },
  f_nur_lesbar: { de: " \u2013 nur lesbar", en: " \u2013 read only", fr: " \u2013 lecture seule", ja: "\uFF08\u8AAD\u307F\u53D6\u308A\u5C02\u7528\uFF09" }
};
var GRUPPEN_SCHLUESSEL = { "Au\xDFenf\xFChler": "grp_0", "Au\xDFenger\xE4t": "grp_1", "Heizkreis 1": "grp_2", "Heizkreis 2": "grp_3", "Heizkurve": "grp_4", "Heizungspuffer": "grp_5", "Prim\xE4rkreis": "grp_6", "SG Ready": "grp_7", "Steuerung": "grp_8", "Warmwasser": "grp_9", "Erweiterte Einstellungen": "grp_10", "Heizkreis 3": "grp_11", "Heizkreis 4": "grp_12", "Zusatzw\xE4rme": "grp_13" };
var HINWEIS_SCHLUESSEL = { "gilt f\xFCr beide": "hnw_0", "eigener Schalter, optional": "hnw_1", "Shelly, Relais oder Eingang": "hnw_2", "eigene Entit\xE4t, Watt": "hnw_3", "Soll Vorlauf": "hnw_4", "Shelly oder eigener Schalter": "hnw_5", "Switch zum Ein/Ausschalten der Zirkulation": "hnw_6", "SetHeatpump oder TOP0": "hnw_7", "Quelle in der Integration unter COP Quelle w\xE4hlbar": "hnw_8", "eigene Entit\xE4t, \xB0C": "hnw_9", "eigener Schalter oder Sensor": "hnw_10", "eigene Entit\xE4t, \xB0C; Kamin allein: TOP47": "hnw_11", "eigener Schalter oder Sensor; Kamin allein: OPT5": "hnw_12" };
function tf(text, werte) {
  return String(text).replace(
    /\{(\w+)\}/g,
    (_, k) => werte && werte[k] !== void 0 ? werte[k] : `{${k}}`
  );
}
var WERT_SCHLUESSEL = { "W\xE4rmepumpe": "w_20", "Pumpe HK1": "w_21", "Pumpe HK2": "w_22", "Heizstab Heizung": "w_23", "Heizstab Warmwasser": "w_24", "Heizstab l\xE4uft": "w_43", "Pumpe Kamin": "w_44", "Pumpe Solarthermie": "w_45", "Pumpe HK3": "w_46", "Pumpe HK4": "w_47", "HK3 Wasser": "w_48", "HK4 Wasser": "w_49", "Kamin": "kamin", "Solarthermie": "solarthermie", "Abtauung": "w_25", "Zirkulation Status": "w_26", "Aufheizen": "w_27", "Legionellenschutz": "w_28", "PV Leistung": "w_29", "Au\xDFen": "w_30", "Vorlauf": "w_31", "R\xFCcklauf": "w_32", "Puffer": "w_33", "HK1 Wasser": "w_34", "HK2 Wasser": "w_35", "Verdichter": "w_36", "Durchfluss": "w_37", "Panasonic Aquarea, HeishaMon \xFCber MQTT-Namensschema": "w_38", "Vaillant, in Vorbereitung": "w_39", "Bosch, in Vorbereitung": "w_40", "Viessmann, in Vorbereitung": "w_41", "Stiebel Eltron, in Vorbereitung": "w_42", "Nur Heizen": "w_0", "Nur K\xFChlen": "w_1", "Automatik Heizen": "w_2", "Nur Warmwasser": "w_3", "Heizen und Warmwasser": "w_4", "K\xFChlen und Warmwasser": "w_5", "Automatik Heizen und Warmwasser": "w_6", "Automatik K\xFChlen": "w_7", "Automatik K\xFChlen und Warmwasser": "w_8", "Aus": "w_9", "Stufe 1": "w_10", "Stufe 2": "w_11", "Stufe 3": "w_12", "30 Minuten": "w_13", "60 Minuten": "w_14", "90 Minuten": "w_15", "Heizung": "w_16", "Warmwasser": "w_17", "l\xE4uft": "w_18", "aus": "w_19" };
function wertText(wert, sprache) {
  const k = WERT_SCHLUESSEL[wert];
  return k ? t(k, sprache) : wert;
}
function feldText(feld, sprache) {
  return TEXTE[`fld_${feld.key}`] ? t(`fld_${feld.key}`, sprache) : feld.label;
}
function gruppenText(name, sprache) {
  const k = GRUPPEN_SCHLUESSEL[name];
  return k ? t(k, sprache) : name;
}
function hinweisText(hint, sprache) {
  let s = String(hint || "");
  Object.keys(HINWEIS_SCHLUESSEL).sort((x, y) => y.length - x.length).forEach((de) => {
    if (s.includes(de)) s = s.split(de).join(t(HINWEIS_SCHLUESSEL[de], sprache));
  });
  return s;
}
function t(schluessel, sprache) {
  const paket = EIGENE_SPRACHEN[sprache];
  if (paket && typeof paket.texte[schluessel] === "string" && paket.texte[schluessel]) {
    return paket.texte[schluessel];
  }
  const eintrag = TEXTE[schluessel];
  if (!eintrag) return schluessel;
  const basis = paket && paket.basis;
  return eintrag[sprache] || basis && eintrag[basis] || eintrag.en || eintrag.de;
}

// src/sprachen.js
var SPRACH_FORMAT = "lutarym-sprachpaket";
var SPRACH_VERSION = 1;
var SPRACH_NAMEN = { de: "Deutsch", en: "English", fr: "Fran\xE7ais", ja: "\u65E5\u672C\u8A9E" };
var EIGENE_SPRACHEN = {};
var SPRACH_STAND = 0;
var SPRACH_VERBOTEN = /[<>"`]/;
function registriereSprachen(config, entfernen) {
  const liste = config && Array.isArray(config.language_custom) ? config.language_custom : [];
  let geaendert = false;
  if (entfernen && EIGENE_SPRACHEN[entfernen]) {
    delete EIGENE_SPRACHEN[entfernen];
    geaendert = true;
  }
  liste.forEach((p) => {
    if (!p || typeof p.code !== "string" || !p.texte || typeof p.texte !== "object") return;
    if (p.code === entfernen) return;
    const texte = {};
    Object.keys(p.texte).forEach((k) => {
      const w = p.texte[k];
      if (typeof w === "string" && !SPRACH_VERBOTEN.test(w)) texte[k] = w;
    });
    const sauber = { ...p, texte, hilfe: p.hilfe && typeof p.hilfe === "object" ? p.hilfe : {} };
    if (JSON.stringify(EIGENE_SPRACHEN[p.code]) !== JSON.stringify(sauber)) {
      EIGENE_SPRACHEN[p.code] = sauber;
      geaendert = true;
    }
  });
  if (geaendert) SPRACH_STAND++;
}
function spracheBekannt(code) {
  return SPRACHEN.includes(code) || Boolean(EIGENE_SPRACHEN[code]);
}
function hilfeText(sp, schluessel, mehrsprachig) {
  const paket = EIGENE_SPRACHEN[sp];
  const eigen = paket && paket.hilfe && paket.hilfe[schluessel];
  if (typeof eigen === "string" && eigen) return eigen;
  const basis = paket && paket.basis;
  return mehrsprachig[sp] || basis && mehrsprachig[basis] || mehrsprachig.en || mehrsprachig.de || "";
}
function sprachpaketFuer(code) {
  const paket = EIGENE_SPRACHEN[code];
  const sp = spracheBekannt(code) ? code : "en";
  const texte = {};
  Object.keys(TEXTE).sort().forEach((k) => {
    texte[k] = t(k, sp);
  });
  const hilfe = {};
  HILFE.forEach((g) => {
    hilfe[g.id] = hilfeText(sp, g.id, g.titel);
    g.e.forEach((e, i) => {
      hilfe[`${g.id}.${i}.n`] = hilfeText(sp, `${g.id}.${i}.n`, e.n);
      hilfe[`${g.id}.${i}.t`] = hilfeText(sp, `${g.id}.${i}.t`, e.t);
    });
  });
  return {
    format: SPRACH_FORMAT,
    version: SPRACH_VERSION,
    karte: CARD_VERSION,
    code: sp,
    name: paket ? paket.name : SPRACH_NAMEN[sp] || sp,
    basis: paket ? paket.basis : sp === "ja" ? "en" : sp,
    dezimal: paket ? paket.dezimal : dezimalFuer(sp),
    texte,
    hilfe
  };
}
function platzhalter(text) {
  return (String(text).match(/\{\w+\}/g) || []).sort().join(",");
}
function pruefeSprache(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_s_format" };
  if (roh.format !== SPRACH_FORMAT) return { fehler: "m_s_format" };
  if (Number(roh.version) !== SPRACH_VERSION) return { fehler: "m_s_version" };
  const code = String(roh.code || "").trim();
  if (!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(code)) return { fehler: "m_s_code" };
  if (!roh.texte || typeof roh.texte !== "object" || Array.isArray(roh.texte)) {
    return { fehler: "m_s_texte" };
  }
  const basis = SPRACHEN.includes(roh.basis) ? roh.basis : SPRACHEN.includes(code) ? code : "en";
  const texte = {};
  const unbekannt = [];
  const platz = [];
  const zeichen = [];
  Object.keys(roh.texte).forEach((k) => {
    const w = roh.texte[k];
    if (!TEXTE[k]) {
      unbekannt.push(k);
      return;
    }
    if (typeof w !== "string" || !w.trim()) return;
    if (SPRACH_VERBOTEN.test(w)) {
      zeichen.push(k);
      return;
    }
    if (platzhalter(w) !== platzhalter(TEXTE[k][basis] || TEXTE[k].en)) {
      platz.push(k);
      return;
    }
    texte[k] = w;
  });
  const hilfe = {};
  const gueltig = /* @__PURE__ */ new Set();
  HILFE.forEach((g) => {
    gueltig.add(g.id);
    g.e.forEach((e, i) => {
      gueltig.add(`${g.id}.${i}.n`);
      gueltig.add(`${g.id}.${i}.t`);
    });
  });
  if (roh.hilfe && typeof roh.hilfe === "object" && !Array.isArray(roh.hilfe)) {
    Object.keys(roh.hilfe).forEach((k) => {
      const w = roh.hilfe[k];
      if (!gueltig.has(k)) {
        unbekannt.push(k);
        return;
      }
      if (typeof w === "string" && w.trim()) hilfe[k] = w;
    });
  }
  if (!Object.keys(texte).length) return { fehler: "m_s_texte" };
  const fehlen = Object.keys(TEXTE).filter((k) => !texte[k]).length;
  return {
    paket: {
      format: SPRACH_FORMAT,
      version: SPRACH_VERSION,
      code,
      name: String(roh.name || code).trim().slice(0, 40) || code,
      basis,
      dezimal: roh.dezimal === "," || roh.dezimal === "." ? roh.dezimal : dezimalFuer(basis),
      texte,
      hilfe
    },
    unbekannt,
    platz,
    zeichen,
    fehlen
  };
}

// src/hilfsfunktionen.js
function bewegungReduziert() {
  try {
    return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return false;
  }
}
function animationAn(config) {
  const a = config ? config.animate : true;
  if (a === false) return false;
  if (a === "auto") return !bewegungReduziert();
  return true;
}
function loadColor(value, min, max) {
  if (value === null || value === void 0 || Number.isNaN(value)) return NEUTRAL;
  if (value <= 0) return NEUTRAL;
  const span = max - min || 1;
  const p = clamp((value - min) / span, 0, 1);
  let a = LOAD_STOPS[0];
  let b = LOAD_STOPS[LOAD_STOPS.length - 1];
  for (let i = 0; i < LOAD_STOPS.length - 1; i++) {
    if (p >= LOAD_STOPS[i].p && p <= LOAD_STOPS[i + 1].p) {
      a = LOAD_STOPS[i];
      b = LOAD_STOPS[i + 1];
      break;
    }
  }
  const local = (p - a.p) / (b.p - a.p || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
function bubbleDauer(idx) {
  if (BUBBLE_DAUER[idx] === void 0) {
    let seed = idx + 42;
    seed = (seed * 1103515245 + 12345) % 2147483648;
    BUBBLE_DAUER[idx] = 4 + seed / 2147483648 * 4;
  }
  return BUBBLE_DAUER[idx];
}
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function thermalColor(value, min, max) {
  if (value === null || value === void 0 || Number.isNaN(value)) return NEUTRAL;
  const span = max - min || 1;
  const p = clamp((value - min) / span, 0, 1);
  let a = THERMAL_STOPS[0];
  let b = THERMAL_STOPS[THERMAL_STOPS.length - 1];
  for (let i = 0; i < THERMAL_STOPS.length - 1; i++) {
    if (p >= THERMAL_STOPS[i].p && p <= THERMAL_STOPS[i + 1].p) {
      a = THERMAL_STOPS[i];
      b = THERMAL_STOPS[i + 1];
      break;
    }
  }
  const local = (p - a.p) / (b.p - a.p || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
function numState(hass, entityId) {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  if (!st) return null;
  const v = parseFloat(st.state);
  return Number.isNaN(v) ? null : v;
}
function rawState(hass, entityId) {
  if (!hass || !entityId) return null;
  const st = hass.states[entityId];
  return st ? st.state : null;
}
function attr(hass, entityId, key, fallback) {
  if (!hass || !entityId) return fallback;
  const st = hass.states[entityId];
  if (!st || st.attributes[key] === void 0) return fallback;
  return st.attributes[key];
}
function isOn(hass, entityId) {
  const s = rawState(hass, entityId);
  if (s === null) return null;
  if (s === "on" || s === "true") return true;
  if (s === "off" || s === "false" || s === "unknown" || s === "unavailable") return false;
  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n > 0;
}
var DEZIMAL = ",";
function setzeDezimal(z) {
  DEZIMAL = z;
}
function dezimalFuer(sprache) {
  const paket = EIGENE_SPRACHEN[sprache];
  if (paket && (paket.dezimal === "," || paket.dezimal === ".")) return paket.dezimal;
  return sprache === "de" || sprache === "fr" ? "," : ".";
}
function fmt(value, digits) {
  if (value === null || value === void 0 || Number.isNaN(value)) return "--";
  return value.toFixed(digits === void 0 ? 1 : digits).replace(".", DEZIMAL);
}
function friendly(hass, entityId) {
  return attr(hass, entityId, "friendly_name", entityId || "");
}
function abzeichenBreite(text) {
  const laenge = String(text || "").length;
  return Math.max(112, Math.round(laenge * 13 * 0.57) + 28);
}
function stellbar(id) {
  const bereich = String(id || "").split(".")[0];
  return bereich === "number" || bereich === "input_number";
}
function schildBreite(text, mindest) {
  const laenge = String(text === void 0 || text === null ? "" : text).length;
  return Math.max(mindest, Math.round(laenge * 15 * 0.66) + 24);
}
function escapeHtml(text) {
  return String(text === void 0 || text === null ? "" : text).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
function copMittel(reihe, start, ende) {
  const punkte = reihe.map((pkt) => {
    const roh = pkt.s !== void 0 ? pkt.s : pkt.state;
    let t2 = pkt.lu !== void 0 ? pkt.lu * 1e3 : Date.parse(pkt.last_updated || pkt.last_changed);
    if (Number.isNaN(t2) || t2 < start) t2 = start;
    return { t: t2, v: parseFloat(roh) };
  }).sort((a, b) => a.t - b.t);
  let summe = 0;
  let dauer = 0;
  for (let i = 0; i < punkte.length; i++) {
    const von = punkte[i].t;
    const bis = i + 1 < punkte.length ? punkte[i + 1].t : ende;
    const dt = bis - von;
    const v = punkte[i].v;
    if (dt > 0 && !Number.isNaN(v) && v > 0) {
      summe += v * dt;
      dauer += dt;
    }
  }
  return dauer > 0 ? summe / dauer : null;
}

// src/felder.js
var TUER_FELDER = [
  { abschnitt: "t_betrieb", key: "holiday_mode", schalter: true },
  { abschnitt: "t_betrieb", key: "main_schedule", schalter: true },
  { abschnitt: "t_betrieb", key: "smart_dhw", auswahl: ["o_variabel", "o_standard"] },
  { abschnitt: "t_heizen", key: "heating_off_temp", min: 5, max: 35, step: 1, einheit: "\xB0C" },
  { abschnitt: "t_heizen", key: "heater_on_temp", min: -15, max: 20, step: 1, einheit: "\xB0C" },
  { abschnitt: "t_heizen", key: "heat_delta", min: 1, max: 15, step: 1, einheit: "\xB0C" },
  { abschnitt: "t_heizen", key: "heating_control", auswahl: ["o_komfort", "o_effizienz"] },
  { abschnitt: "t_legionellen", key: "steril_temp", min: 55, max: 75, step: 1, einheit: "\xB0C" },
  { abschnitt: "t_legionellen", key: "steril_time", min: 5, max: 60, step: 5, einheit: "min" },
  { abschnitt: "t_pumpe", key: "pump_flow_mode", auswahl: ["o_spreizung", "o_max_leistung"] },
  { abschnitt: "t_pumpe", key: "pump_max_duty", min: 64, max: 254, step: 1, einheit: "" },
  { abschnitt: "t_leise", key: "quiet_priority", auswahl: ["o_lautstaerke", "o_leistung"] },
  { abschnitt: "t_cop", key: "cop_heating", cop: "heizen" },
  { abschnitt: "t_cop", key: "cop_dhw", cop: "ww" },
  { abschnitt: "t_jaz", key: "jaz", jaz: "tabelle" },
  { abschnitt: "t_info", key: "operating_hours", info: true, einheit: "h" },
  { abschnitt: "t_info", key: "compressor_starts", info: true, einheit: "" },
  { abschnitt: "t_info", key: "room_heater_hours", info: true, einheit: "h" },
  { abschnitt: "t_info", key: "dhw_heater_hours", info: true, einheit: "h" }
];
var ENTITY_FIELDS = [
  { key: "outside_temp", label: "Au\xDFentemperatur", group: "Au\xDFenf\xFChler", hint: "TOP14" },
  { key: "power_state", label: "W\xE4rmepumpe Status, gr\xFCne LED", group: "Au\xDFenger\xE4t", hint: "SetHeatpump oder TOP0" },
  { key: "compressor", label: "Verdichterdrehzahl", group: "Au\xDFenger\xE4t", hint: "TOP8" },
  { key: "fan1_rpm", label: "L\xFCfter 1 Drehzahl", group: "Au\xDFenger\xE4t", hint: "TOP62" },
  { key: "fan2_rpm", label: "L\xFCfter 2 Drehzahl", group: "Au\xDFenger\xE4t", hint: "TOP63" },
  { key: "defrost", label: "Abtauung l\xE4uft", group: "Au\xDFenger\xE4t", hint: "TOP26" },
  { key: "error", label: "Fehlercode", group: "Au\xDFenger\xE4t", hint: "TOP44" },
  { key: "heatpump_state", label: "Betriebszustand", group: "Au\xDFenger\xE4t", hint: "TOP0" },
  { key: "force_defrost", label: "Abtauen erzwingen", group: "Au\xDFenger\xE4t", hint: "SetForceDefrost, switch" },
  { key: "powerful_mode", label: "Turbomodus", group: "Au\xDFenger\xE4t", hint: "SetPowerfulMode, select" },
  { key: "quiet_mode", label: "Leisemodus", group: "Au\xDFenger\xE4t", hint: "SetQuietMode, select" },
  { key: "power_now", label: "Aktuelle Leistungsaufnahme", group: "Au\xDFenger\xE4t", hint: "Shelly PM, Watt" },
  { key: "energy_today", label: "Energiez\xE4hler", group: "Au\xDFenger\xE4t", hint: "Shelly PM, kWh" },
  { key: "pv_power", label: "PV Leistung aktuell", group: "SG Ready", hint: "eigene Entit\xE4t, Watt" },
  { key: "sg_k1", label: "Kontakt K1 Sperre", group: "SG Ready", hint: "Shelly, Relais oder Eingang" },
  { key: "sg_k2", label: "Kontakt K2 Anlauf", group: "SG Ready", hint: "Shelly, Relais oder Eingang" },
  { key: "flow_temp", label: "Vorlauftemperatur", group: "Prim\xE4rkreis", hint: "TOP6" },
  { key: "return_temp", label: "R\xFCcklauftemperatur", group: "Prim\xE4rkreis", hint: "TOP5" },
  { key: "pump_speed", label: "Prim\xE4rpumpe Drehzahl", group: "Prim\xE4rkreis", hint: "TOP65" },
  { key: "pump_flow", label: "Durchflussmenge", group: "Prim\xE4rkreis", hint: "TOP1" },
  { key: "three_way_valve", label: "3-Wege-Umschaltventil", group: "Prim\xE4rkreis", hint: "TOP20" },
  { key: "water_pressure", label: "Wasserdruck", group: "Prim\xE4rkreis", hint: "TOP115" },
  { key: "heater_internal", label: "Heizstab intern l\xE4uft", group: "Prim\xE4rkreis", hint: "TOP60" },
  { key: "heater_external", label: "Heizstab extern l\xE4uft", group: "Prim\xE4rkreis", hint: "TOP61" },
  { key: "buffer_temp", label: "Puffertemperatur", group: "Heizungspuffer", hint: "TOP46" },
  { key: "buffer_installed", label: "Puffer vorhanden", group: "Heizungspuffer", hint: "TOP99" },
  { key: "buffer_switch", label: "Pufferbetrieb ein und aus", group: "Heizungspuffer", hint: "SetBuffer, switch" },
  { key: "curve_t_high", label: "HK1 Heizkurve Vorlauf oben", group: "Heizkurve", hint: "TOP29" },
  { key: "curve_t_low", label: "HK1 Heizkurve Vorlauf unten", group: "Heizkurve", hint: "TOP30" },
  { key: "curve_o_high", label: "HK1 Heizkurve Au\xDFen oben", group: "Heizkurve", hint: "TOP31" },
  { key: "curve_o_low", label: "HK1 Heizkurve Au\xDFen unten", group: "Heizkurve", hint: "TOP32" },
  { key: "curve2_t_high", label: "HK2 Heizkurve Vorlauf oben", group: "Heizkurve", hint: "TOP82" },
  { key: "curve2_t_low", label: "HK2 Heizkurve Vorlauf unten", group: "Heizkurve", hint: "TOP83" },
  { key: "curve2_o_high", label: "HK2 Heizkurve Au\xDFen oben", group: "Heizkurve", hint: "TOP84" },
  { key: "curve2_o_low", label: "HK2 Heizkurve Au\xDFen unten", group: "Heizkurve", hint: "TOP85" },
  { key: "buffer_delta", label: "Puffer Hysterese", group: "Heizungspuffer", hint: "TOP113" },
  { key: "buffer_target", label: "Puffer Zieltemperatur", group: "Heizungspuffer", hint: "TOP7, Soll Vorlauf" },
  { key: "cop_heating", label: "COP Heizen", group: "Heizungspuffer", hint: "HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle w\xE4hlbar" },
  { key: "room_heater", label: "Heizstab Heizung freigegeben", group: "Heizungspuffer", hint: "TOP59" },
  { key: "room_heater_switch", label: "Heizstab Heizung schalten", group: "Heizungspuffer", hint: "SetRoomHeaterState, switch" },
  { key: "zones_state", label: "Aktivierte Zonen", group: "Heizkreis 1", hint: "TOP94, gilt f\xFCr beide" },
  { key: "zones_select", label: "Zonen umschalten", group: "Heizkreis 1", hint: "SetZones, gilt f\xFCr beide" },
  { key: "hk1_water", label: "HK1 Wassertemperatur", group: "Heizkreis 1", hint: "TOP36" },
  { key: "hk1_water_target", label: "HK1 Wasser Sollwert", group: "Heizkreis 1", hint: "TOP42" },
  { key: "hk1_pump", label: "HK1 Pumpe l\xE4uft", group: "Heizkreis 1", hint: "TOP124" },
  { key: "hk1_setpoint", label: "HK1 Sollwert einstellbar", group: "Heizkreis 1", hint: "TOP27, number" },
  { key: "hk1_switch", label: "HK1 ein und aus", group: "Heizkreis 1", hint: "eigener Schalter, optional" },
  { key: "hk2_water", label: "HK2 Wassertemperatur", group: "Heizkreis 2", hint: "TOP37" },
  { key: "hk2_water_target", label: "HK2 Wasser Sollwert", group: "Heizkreis 2", hint: "TOP43" },
  { key: "hk2_pump", label: "HK2 Pumpe l\xE4uft", group: "Heizkreis 2", hint: "TOP123" },
  { key: "hk2_setpoint", label: "HK2 Sollwert einstellbar", group: "Heizkreis 2", hint: "TOP34, number" },
  { key: "hk2_switch", label: "HK2 ein und aus", group: "Heizkreis 2", hint: "eigener Schalter, optional" },
  { key: "hk3_water", label: "HK3 Wassertemperatur", group: "Heizkreis 3", hint: "eigene Entit\xE4t, \xB0C" },
  { key: "hk3_pump", label: "HK3 Pumpe l\xE4uft", group: "Heizkreis 3", hint: "eigener Schalter oder Sensor" },
  { key: "hk3_switch", label: "HK3 ein und aus", group: "Heizkreis 3", hint: "eigener Schalter, optional" },
  { key: "hk4_water", label: "HK4 Wassertemperatur", group: "Heizkreis 4", hint: "eigene Entit\xE4t, \xB0C" },
  { key: "hk4_pump", label: "HK4 Pumpe l\xE4uft", group: "Heizkreis 4", hint: "eigener Schalter oder Sensor" },
  { key: "hk4_switch", label: "HK4 ein und aus", group: "Heizkreis 4", hint: "eigener Schalter, optional" },
  { key: "kamin_temp", label: "Kamin Temperatur", group: "Zusatzw\xE4rme", hint: "eigene Entit\xE4t, \xB0C; Kamin allein: TOP47" },
  { key: "kamin_pump", label: "Kamin Pumpe l\xE4uft", group: "Zusatzw\xE4rme", hint: "eigener Schalter oder Sensor; Kamin allein: OPT5" },
  { key: "solar_temp", label: "Solarthermie Temperatur", group: "Zusatzw\xE4rme", hint: "TOP47" },
  { key: "solar_pump", label: "Solarthermie Pumpe l\xE4uft", group: "Zusatzw\xE4rme", hint: "OPT5" },
  { key: "dhw_installed", label: "Warmwasser vorhanden", group: "Warmwasser", hint: "TOP100" },
  { key: "dhw_temp", label: "Warmwasser Isttemperatur", group: "Warmwasser", hint: "TOP10" },
  { key: "dhw_heat_delta", label: "Warmwasser Hysterese", group: "Warmwasser", hint: "TOP22" },
  { key: "dhw_setpoint", label: "Warmwasser Sollwert", group: "Warmwasser", hint: "TOP9, number" },
  { key: "cop_dhw", label: "COP Warmwasser", group: "Warmwasser", hint: "HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle w\xE4hlbar" },
  { key: "dhw_heater", label: "Heizstab Warmwasser freigegeben", group: "Warmwasser", hint: "TOP58" },
  { key: "dhw_force", label: "Einmalig aufheizen", group: "Warmwasser", hint: "SetForceDHW, switch" },
  { key: "dhw_force_state", label: "Aufheizen l\xE4uft", group: "Warmwasser", hint: "TOP2" },
  { key: "force_sterilization", label: "Legionellenschutz starten", group: "Warmwasser", hint: "SetForceSterilization, switch" },
  { key: "sterilization_state", label: "Legionellenschutz l\xE4uft", group: "Warmwasser", hint: "TOP69" },
  { key: "dhw_heater_switch", label: "Heizstab Warmwasser schalten", group: "Warmwasser", hint: "SetDHWHeaterState, switch" },
  { key: "circulation_pump", label: "Zirkulationspumpe l\xE4uft", group: "Warmwasser", hint: "Shelly oder eigener Schalter" },
  { key: "circ_switch", label: "Zirkulation Schalter (klickbar)", group: "Warmwasser", hint: "Switch zum Ein/Ausschalten der Zirkulation" },
  { key: "mode_select", label: "Betriebsart umschalten", group: "Steuerung", hint: "SetOperationMode, select" },
  { key: "heating_off_temp", label: "Heizen aus ab Au\xDFentemperatur", group: "Erweiterte Einstellungen", hint: "TOP77, number" },
  { key: "heater_on_temp", label: "Heizstab ein unter Au\xDFentemperatur", group: "Erweiterte Einstellungen", hint: "TOP78, number" },
  { key: "heat_delta", label: "Spreizung Heizen", group: "Erweiterte Einstellungen", hint: "TOP23, number" },
  { key: "heating_control", label: "Regelung", group: "Erweiterte Einstellungen", hint: "SetHeatingControl, select" },
  { key: "steril_temp", label: "Legionellen Temperatur", group: "Erweiterte Einstellungen", hint: "TOP70, number" },
  { key: "steril_time", label: "Legionellen Haltezeit", group: "Erweiterte Einstellungen", hint: "TOP71, number" },
  { key: "pump_flow_mode", label: "Pumpenregelung", group: "Erweiterte Einstellungen", hint: "SetPumpFlowrateMode, select" },
  { key: "pump_max_duty", label: "Max. Pumpenleistung", group: "Erweiterte Einstellungen", hint: "TOP95, number" },
  { key: "quiet_priority", label: "Leisemodus Vorrang", group: "Erweiterte Einstellungen", hint: "SetQuietModePriority, select" },
  { key: "holiday_mode", label: "Urlaubsmodus", group: "Erweiterte Einstellungen", hint: "SetHolidayMode, switch" },
  { key: "main_schedule", label: "Wochenprogramm", group: "Erweiterte Einstellungen", hint: "SetMainSchedule, switch" },
  { key: "smart_dhw", label: "Smart DHW Warmwasser", group: "Erweiterte Einstellungen", hint: "SetSmartDHW, select" },
  { key: "operating_hours", label: "Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP11" },
  { key: "compressor_starts", label: "Verdichterstarts", group: "Erweiterte Einstellungen", hint: "TOP12" },
  { key: "room_heater_hours", label: "Heizstab Heizen Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP90" },
  { key: "dhw_heater_hours", label: "Heizstab Warmwasser Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP91" }
];
var DEFAULT_CONFIG = {
  type: "custom:heatpump-flow-card-by-lutarym",
  fan_count: 2,
  hk_count: 2,
  layout: "quer",
  card_width: 0,
  pipe_inner_mm: 0,
  mqtt_prefix: "panasonic_heat_pump",
  profil: "heishamon_lutarym",
  language: "auto",
  show_history: "knopf",
  show_target: true,
  show_reload: true,
  show_help: true,
  show_door: true,
  theme: "auto",
  profile_custom: [],
  language_custom: [],
  buffer_present: "auto",
  circulation_present: "auto",
  history_width: 450,
  curve_x_min: -20,
  curve_x_max: 20,
  curve_y_min: 20,
  curve_y_max: 75,
  card_height: 0,
  scale_min: 20,
  scale_max: 60,
  outdoor_min: -15,
  outdoor_max: 35,
  label_hk1: "",
  label_hk2: "",
  label_dhw: "",
  label_energy: "",
  label_buffer: "",
  energy_daily: true,
  demo: false,
  animate: true,
  hk1_style: "platte",
  hk2_style: "platte",
  hk3_style: "platte",
  hk4_style: "platte",
  label_hk3: "",
  label_hk4: "",
  extra_heat: "aus",
  kamin_fire_temp: 30,
  solar_sun_temp: 30,
  solar_style: "strahlen",
  entities: {}
};

// src/profile.js
var PROFILE = [
  {
    id: "heishamon_lutarym",
    name: "Panasonic Aquarea, HeishaMon by Lutarym",
    fertig: true
  },
  {
    id: "heishamon",
    name: "Panasonic Aquarea, HeishaMon \xFCber MQTT-Namensschema",
    fertig: true
  },
  { id: "vaillant", name: "Vaillant, in Vorbereitung", fertig: false },
  { id: "bosch", name: "Bosch, in Vorbereitung", fertig: false },
  { id: "viessmann", name: "Viessmann, in Vorbereitung", fertig: false },
  { id: "stiebel", name: "Stiebel Eltron, in Vorbereitung", fertig: false }
];
var PROFIL_FORMAT = "lutarym-geraeteprofil";
var PROFIL_VERSION = 1;
function eingebautesProfil(id) {
  const pr = PROFILE.find((x) => x.id === id);
  if (!pr || !pr.fertig) return null;
  const mqtt = id === "heishamon";
  const felder = {};
  const bekannt = profilFeldnamen();
  const dazu = (feld, regel) => {
    if (!bekannt.includes(feld)) return;
    if (!felder[feld]) felder[feld] = [];
    if (!felder[feld].includes(regel)) felder[feld].push(regel);
  };
  [TOPIC_TO_FIELD, COMMAND_TO_FIELD].forEach(
    (tabelle) => Object.keys(tabelle).forEach((k) => dazu(tabelle[k], mqtt ? `*.heishamon_${k}` : k))
  );
  Object.keys(COP_TO_FIELD).forEach(
    (k) => dazu(COP_TO_FIELD[k], mqtt ? `sensor.heishamon*_${k}` : k)
  );
  return {
    format: PROFIL_FORMAT,
    version: PROFIL_VERSION,
    id: pr.id,
    name: pr.name,
    hersteller: "Panasonic",
    integration: mqtt ? "" : INTEGRATION_DOMAIN,
    namensteil: "heishamon",
    felder
  };
}
function profilFeldnamen() {
  return ENTITY_FIELDS.map((f) => f.key).concat(["operating_mode"]);
}
function eigeneProfile(config) {
  const liste = config && Array.isArray(config.profile_custom) ? config.profile_custom : [];
  return liste.filter((p) => p && typeof p === "object" && typeof p.id === "string");
}
function eigenesProfil(config) {
  const id = config && config.profil;
  return eigeneProfile(config).find((p) => p.id === id) || null;
}
function profilFuer(config) {
  return eigenesProfil(config) || config && config.profil;
}
function pruefeProfil(roh) {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return { fehler: "m_p_format" };
  if (roh.format !== PROFIL_FORMAT) return { fehler: "m_p_format" };
  if (Number(roh.version) !== PROFIL_VERSION) return { fehler: "m_p_version" };
  const id = String(roh.id || "").trim();
  if (!/^[a-z0-9_-]{2,40}$/.test(id)) return { fehler: "m_p_id" };
  if (!roh.felder || typeof roh.felder !== "object" || Array.isArray(roh.felder)) {
    return { fehler: "m_p_felder" };
  }
  const bekannt = profilFeldnamen();
  const felder = {};
  const unbekannt = [];
  Object.keys(roh.felder).forEach((feld) => {
    if (!bekannt.includes(feld)) {
      unbekannt.push(feld);
      return;
    }
    const regeln = [].concat(roh.felder[feld]).filter((r) => typeof r === "string" && r.trim()).map((r) => r.trim());
    if (regeln.length) felder[feld] = regeln;
  });
  if (!Object.keys(felder).length) return { fehler: "m_p_felder" };
  const text = (w, max) => String(w === void 0 || w === null ? "" : w).trim().slice(0, max);
  return {
    profil: {
      format: PROFIL_FORMAT,
      version: PROFIL_VERSION,
      id,
      name: text(roh.name, 80) || id,
      hersteller: text(roh.hersteller, 60),
      integration: text(roh.integration, 60),
      namensteil: text(roh.namensteil, 60),
      felder
    },
    unbekannt
  };
}
function erkenneMitProfil(hass, p) {
  const result = { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
  if (!hass || !p || !p.felder) return result;
  const regeln = [];
  Object.keys(p.felder).forEach(
    (feld) => [].concat(p.felder[feld]).forEach((w) => {
      if (typeof w !== "string" || !w.trim()) return;
      const r = { feld, w: w.trim(), klein: w.trim().toLowerCase() };
      if (r.w.includes("*")) {
        r.re = new RegExp(
          "^" + r.w.split("*").map((x) => x.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$",
          "i"
        );
      }
      regeln.push(r);
    })
  );
  const passt = (r, id, eintrag) => {
    if (r.re) return r.re.test(id);
    if (r.w.includes(".")) return id === r.w;
    const klein = id.toLowerCase();
    return Boolean(eintrag && eintrag.translation_key === r.w) || klein.endsWith(`_${r.klein}`) || klein.split(".")[1] === r.klein;
  };
  const assign = (feld, entityId) => {
    const allowed = FIELD_DOMAIN[feld];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    const bisher = result.entities[feld];
    if (bisher && stellbar(bisher) && !stellbar(entityId)) return;
    result.entities[feld] = entityId;
  };
  const pruefe = (id, eintrag) => {
    let treffer = false;
    regeln.forEach((r) => {
      if (passt(r, id, eintrag)) {
        assign(r.feld, id);
        treffer = true;
      }
    });
    return treffer;
  };
  const reg = hass.entities;
  if (p.integration && reg && typeof reg === "object") {
    const geraete = /* @__PURE__ */ new Set();
    let hits2 = 0;
    Object.keys(reg).forEach((id) => {
      const e = reg[id];
      if (!e || e.platform !== p.integration) return;
      hits2++;
      if (e.device_id) geraete.add(e.device_id);
      pruefe(id, e);
    });
    if (hits2 > 0) {
      result.found = true;
      result.source = "register";
      result.count = hits2;
      result.devices = geraete.size;
      return result;
    }
  }
  const teil = String(p.namensteil || "").toLowerCase();
  let hits = 0;
  Object.keys(hass.states || {}).forEach((id) => {
    if (teil && !id.toLowerCase().includes(teil)) return;
    if (pruefe(id, reg && reg[id])) hits++;
  });
  if (hits > 0) {
    result.found = true;
    result.source = "namensschema";
    result.count = hits;
    result.devices = 1;
  }
  return result;
}

// src/erkennung.js
var INTEGRATION_DOMAIN = "heishamon_lutarym";
var TOPIC_TO_FIELD = {
  top0: "heatpump_state",
  top82: "curve2_t_high",
  top83: "curve2_t_low",
  top84: "curve2_o_high",
  top85: "curve2_o_low",
  top29: "curve_t_high",
  top30: "curve_t_low",
  top31: "curve_o_high",
  top32: "curve_o_low",
  top22: "dhw_heat_delta",
  top2: "dhw_force_state",
  top69: "sterilization_state",
  top14: "outside_temp",
  top4: "operating_mode",
  top8: "compressor",
  top1: "pump_flow",
  top44: "error",
  top115: "water_pressure",
  top113: "buffer_delta",
  top62: "fan1_rpm",
  top63: "fan2_rpm",
  top26: "defrost",
  top6: "flow_temp",
  top5: "return_temp",
  top65: "pump_speed",
  top20: "three_way_valve",
  top59: "room_heater",
  top60: "heater_internal",
  top77: "heating_off_temp",
  top78: "heater_on_temp",
  top23: "heat_delta",
  top70: "steril_temp",
  top71: "steril_time",
  top95: "pump_max_duty",
  top11: "operating_hours",
  top12: "compressor_starts",
  top90: "room_heater_hours",
  top91: "dhw_heater_hours",
  top61: "heater_external",
  top46: "buffer_temp",
  top94: "zones_state",
  top99: "buffer_installed",
  top100: "dhw_installed",
  top7: "buffer_target",
  top36: "hk1_water",
  top42: "hk1_water_target",
  top124: "hk1_pump",
  top27: "hk1_setpoint",
  top37: "hk2_water",
  top43: "hk2_water_target",
  top123: "hk2_pump",
  top34: "hk2_setpoint",
  top10: "dhw_temp",
  top9: "dhw_setpoint",
  top58: "dhw_heater",
  top47: "solar_temp",
  opt5: "solar_pump"
};
var COMMAND_TO_FIELD = {
  setheatpump: "power_state",
  setoperationmode: "mode_select",
  setforcedhw: "dhw_force",
  setforcesterilization: "force_sterilization",
  setforcedefrost: "force_defrost",
  setdhwheaterstate: "dhw_heater_switch",
  setroomheaterstate: "room_heater_switch",
  setpowerfulmode: "powerful_mode",
  setquietmode: "quiet_mode",
  setzones: "zones_select",
  setbuffer: "buffer_switch",
  setheatingcontrol: "heating_control",
  setpumpflowratemode: "pump_flow_mode",
  setquietmodepriority: "quiet_priority",
  setholidaymode: "holiday_mode",
  setmainschedule: "main_schedule",
  setsmartdhw: "smart_dhw",
  setreset: "fault_reset"
};
var COP_TO_FIELD = {
  cop_heating: "cop_heating",
  cop_dhw: "cop_dhw"
};
var COP_MUSTER = /_(cop_(?:heating|dhw))$/;
var FIELD_DOMAIN = {
  hk1_setpoint: ["number", "input_number"],
  hk2_setpoint: ["number", "input_number"],
  dhw_setpoint: ["number", "input_number"],
  power_state: ["switch", "input_boolean", "binary_sensor", "sensor"],
  mode_select: ["select", "input_select"],
  dhw_force: ["switch", "input_boolean"],
  hk1_switch: ["switch", "input_boolean"],
  hk2_switch: ["switch", "input_boolean"],
  hk3_switch: ["switch", "input_boolean"],
  hk4_switch: ["switch", "input_boolean"],
  force_sterilization: ["switch", "input_boolean"],
  force_defrost: ["switch", "input_boolean"],
  dhw_heater_switch: ["switch", "input_boolean"],
  room_heater_switch: ["switch", "input_boolean"],
  powerful_mode: ["select", "input_select"],
  quiet_mode: ["select", "input_select"],
  zones_select: ["select", "input_select"],
  buffer_switch: ["switch", "input_boolean"],
  heating_control: ["select", "input_select"],
  pump_flow_mode: ["select", "input_select"],
  quiet_priority: ["select", "input_select"],
  holiday_mode: ["switch", "input_boolean"],
  main_schedule: ["switch", "input_boolean"],
  smart_dhw: ["select", "input_select"],
  fault_reset: ["button", "input_button"],
  circulation_pump: ["switch", "input_boolean", "binary_sensor", "sensor"],
  circ_switch: ["switch", "input_boolean"],
  sg_k1: ["switch", "input_boolean", "binary_sensor", "sensor"],
  sg_k2: ["switch", "input_boolean", "binary_sensor", "sensor"]
};
function detectIntegration(hass, profil) {
  if (profil && typeof profil === "object") return erkenneMitProfil(hass, profil);
  const result = { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
  if (!hass) return result;
  const assign = (key, entityId) => {
    const field = TOPIC_TO_FIELD[key] || COMMAND_TO_FIELD[key] || COP_TO_FIELD[key];
    if (!field || !entityId) return;
    const allowed = FIELD_DOMAIN[field];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    const bisher = result.entities[field];
    if (bisher && stellbar(bisher) && !stellbar(entityId)) return;
    result.entities[field] = entityId;
  };
  const nurNamen = profil === "heishamon";
  const registry = nurNamen ? null : hass.entities;
  if (registry && typeof registry === "object") {
    const deviceIds = /* @__PURE__ */ new Set();
    let hits2 = 0;
    Object.keys(registry).forEach((entityId) => {
      const entry = registry[entityId];
      if (!entry || entry.platform !== INTEGRATION_DOMAIN) return;
      hits2++;
      if (entry.device_id) deviceIds.add(entry.device_id);
      const key = (entityId.match(COP_MUSTER) || [])[1] || entry.translation_key || (entityId.match(/_(top\d+)$/) || [])[1] || (entityId.match(/heishamon_(set\w+)$/) || [])[1] || null;
      if (key) assign(key, entityId);
    });
    if (hits2 > 0) {
      result.found = true;
      result.source = "register";
      result.count = hits2;
      result.devices = deviceIds.size;
      return result;
    }
  }
  let hits = 0;
  Object.keys(hass.states || {}).forEach((entityId) => {
    if (/^sensor\.heishamon_/.test(entityId)) {
      const c = entityId.match(COP_MUSTER);
      if (c) assign(c[1], entityId);
    }
    const m = entityId.match(
      /^(?:sensor|number|switch|select)\.heishamon_((?:top\d+)|(?:set\w+))$/
    );
    if (!m) return;
    hits++;
    assign(m[1], entityId);
  });
  if (hits > 0) {
    result.found = true;
    result.source = "namensschema";
    result.count = hits;
    result.devices = 1;
  }
  return result;
}
function quellenZuordnung(entities, extraHeat) {
  if (extraHeat !== "kamin") return entities;
  const out = { ...entities };
  if (out.solar_temp && !out.kamin_temp) out.kamin_temp = out.solar_temp;
  if (out.solar_pump && !out.kamin_pump) out.kamin_pump = out.solar_pump;
  delete out.solar_temp;
  delete out.solar_pump;
  return out;
}
function defaultEntityMap() {
  const map = {};
  Object.keys(TOPIC_TO_FIELD).forEach((topic) => {
    const field = TOPIC_TO_FIELD[topic];
    const allowed = FIELD_DOMAIN[field];
    map[field] = `${allowed ? allowed[0] : "sensor"}.heishamon_${topic}`;
  });
  Object.keys(COMMAND_TO_FIELD).forEach((cmd) => {
    const field = COMMAND_TO_FIELD[cmd];
    map[field] = `${FIELD_DOMAIN[field][0]}.heishamon_${cmd}`;
  });
  return map;
}

// src/editor/bedienung.js
var bedienungEditor = {
  /* -------------------- Editor-Bedienung -------------------- */
  /** Gespeicherte Bedienzustaende des Editors, nur in diesem Browser. */
  _merke(k, v) {
    try {
      if (v === void 0) return window.localStorage.getItem(`lhc-editor-${k}`);
      window.localStorage.setItem(`lhc-editor-${k}`, v);
    } catch {
    }
    return null;
  },
  _modus() {
    if (!this._editorModus) this._editorModus = this._merke("modus") === "erweitert" ? "erweitert" : "einfach";
    return this._editorModus;
  },
  /** Erklaerung aus der Hilfe zu einem Feld, ueber TOP-Wert oder Befehl. */
  _feldHilfe(f) {
    const hint = String(f.hint || "");
    const tops = (hint.match(/\b(X?TOP\d+)\b/g) || []).map((x) => x.toUpperCase());
    const befehle = (hint.match(/\bSet\w+\b/g) || []).map((x) => x.toLowerCase());
    if (!tops.length && !befehle.length) return "";
    const sp = this._sp();
    for (const g of HILFE) {
      for (let i = 0; i < g.e.length; i++) {
        const e = g.e[i];
        if (e.l && tops.includes(e.l.toUpperCase()) || e.s && befehle.includes(e.s.toLowerCase())) {
          return hilfeText(sp, `${g.id}.${i}.t`, e.t);
        }
      }
    }
    return "";
  },
  _bindeEditorBedienung() {
    const sr = this.shadowRoot;
    if (!this._offen) {
      this._offen = /* @__PURE__ */ new Set();
      const gemerkt = this._merke("offen");
      try {
        JSON.parse(gemerkt || '["darstellung","d-allgemein"]').forEach((k) => this._offen.add(k));
      } catch {
        this._offen.add("darstellung");
        this._offen.add("d-allgemein");
      }
    }
    sr.querySelectorAll("details[data-klapp]").forEach((d) => {
      d.open = this._offen.has(d.dataset.klapp);
      d.addEventListener("toggle", () => {
        if (d.open) this._offen.add(d.dataset.klapp);
        else this._offen.delete(d.dataset.klapp);
        this._merke("offen", JSON.stringify([...this._offen]));
      });
    });
    sr.querySelectorAll("#ed-modus button").forEach(
      (b) => b.addEventListener("click", () => {
        this._editorModus = b.dataset.modus;
        this._merke("modus", this._editorModus);
        this._zeigeModus();
      })
    );
    const filter = sr.getElementById("ed-nur-fehlende");
    if (filter) {
      filter.checked = this._nurFehlende === true;
      filter.addEventListener("change", () => {
        this._nurFehlende = filter.checked;
        this._zeigeEntitaetsZustand();
      });
    }
    sr.querySelectorAll("button[data-frage]").forEach(
      (b) => b.addEventListener("click", (ev) => {
        ev.preventDefault();
        const p = sr.querySelector(`[data-erklaerung="${b.dataset.frage}"]`);
        if (p) p.hidden = !p.hidden;
      })
    );
    this._zeigeModus();
  },
  _zeigeModus() {
    const sr = this.shadowRoot;
    const ed = sr.querySelector(".ed");
    if (ed) ed.classList.toggle("einfach", this._modus() === "einfach");
    sr.querySelectorAll("#ed-modus button").forEach(
      (b) => b.classList.toggle("aktiv", b.dataset.modus === this._modus())
    );
  },
  /** Haken, Warnung, Zaehler je Gruppe und der Filter "nur fehlende". */
  _zeigeEntitaetsZustand() {
    const sr = this.shadowRoot;
    const ent = this._config.entities || {};
    const states = this._hass && this._hass.states || {};
    let sichtbarGesamt = 0;
    sr.querySelectorAll("details[data-gruppe]").forEach((d) => {
      let da = 0;
      let alle = 0;
      let sichtbar = 0;
      d.querySelectorAll(".ed-feld").forEach((row) => {
        const k = row.dataset.feld;
        const v = ent[k] || "";
        const ok = Boolean(v) && Boolean(states[v]);
        const zustand = !v ? "leer" : ok ? "ok" : "fehlt";
        alle++;
        if (ok) da++;
        const z = row.querySelector(".ed-zustand");
        if (z) {
          z.dataset.wert = zustand;
          z.textContent = zustand === "ok" ? "\u2713" : zustand === "fehlt" ? "!" : "";
          z.title = this._t(zustand === "ok" ? "f_ok" : zustand === "fehlt" ? "f_fehlt" : "f_leer");
        }
        const zeigen = !this._nurFehlende || zustand !== "ok";
        row.hidden = !zeigen;
        if (zeigen) sichtbar++;
      });
      const zahl = d.querySelector(".ed-zahl");
      if (zahl) {
        zahl.textContent = tf(this._t("e_zugeordnet"), { a: da, b: alle });
        zahl.classList.toggle("voll", da === alle);
      }
      d.hidden = sichtbar === 0;
      sichtbarGesamt += sichtbar;
    });
    const allesDa = sr.getElementById("ed-alles-da");
    if (allesDa) allesDa.hidden = !(this._nurFehlende && sichtbarGesamt === 0);
  },
  /**
   * Ersetzt die Textfelder durch das Auswahlfeld von Home Assistant, wenn
   * es zur Verfuegung steht. Das Feld ist nicht offiziell dokumentiert,
   * deshalb bleibt bei jedem Problem das Textfeld stehen.
   */
  async _entitaetsAuswahl() {
    const name = "ha-entity-picker";
    try {
      if (!customElements.get(name) && typeof window.loadCardHelpers === "function") {
        const helfer = await window.loadCardHelpers();
        const karte = await helfer.createCardElement({ type: "entities", entities: [] });
        if (karte && karte.constructor && karte.constructor.getConfigElement) {
          await karte.constructor.getConfigElement();
        }
      }
      if (!customElements.get(name)) {
        await Promise.race([
          customElements.whenDefined(name),
          new Promise((_, nein) => setTimeout(() => nein(new Error("zeit")), 3e3))
        ]);
      }
    } catch {
      return;
    }
    if (!customElements.get(name) || !this.shadowRoot) return;
    this.shadowRoot.querySelectorAll("input[data-entity]").forEach((input) => {
      const key = input.dataset.entity;
      const feld = ENTITY_FIELDS.find((f) => f.key === key);
      let picker;
      try {
        picker = document.createElement(name);
        picker.hass = this._hass;
        picker.value = (this._config.entities || {})[key] || "";
        const bereiche = feld && FIELD_DOMAIN[key];
        picker.includeDomains = bereiche || [
          "sensor",
          "number",
          "input_number",
          "binary_sensor",
          "switch",
          "input_boolean",
          "select",
          "input_select",
          "button",
          "input_button"
        ];
        picker.allowCustomEntity = true;
      } catch {
        return;
      }
      picker.dataset.entity = key;
      picker.classList.add("ed-picker");
      picker.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const v = String(ev.detail && ev.detail.value || "").trim();
        const entities = { ...this._config.entities };
        if (v) entities[key] = v;
        else delete entities[key];
        this._config = { ...this._config, entities };
        this._emit();
        this._zeigeEntitaetsZustand();
      });
      input.replaceWith(picker);
    });
  }
};

// src/editor/stil.js
var stilEditor = {
  _css() {
    return `
      .ed { display: flex; flex-direction: column; gap: 18px; padding: 4px 0 8px; }
      .ed-group {
        border: 1px solid var(--divider-color, #3A4757);
        border-radius: 10px; padding: 12px 14px 14px;
      }
      h3 {
        margin: 0 0 10px; font-size: 13px; letter-spacing: 0.02em;
        color: var(--secondary-text-color, #8A94A6);
      }
      .ed-row {
        display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        align-items: center; gap: 12px; padding: 6px 0;
      }
      .ed-row > span {
        font-size: 14px; color: var(--primary-text-color, #E8EDF4);
        display: flex; flex-direction: column;
      }
      .ed-row em {
        font-style: normal; font-size: 11px; color: var(--secondary-text-color, #8A94A6);
      }
      .ed-check { grid-template-columns: auto 1fr; }
      input[type="text"], input[type="number"], select {
        width: 100%; box-sizing: border-box; padding: 8px 10px;
        border-radius: 8px; font-size: 14px;
        border: 1px solid var(--divider-color, #3A4757);
        background: var(--card-background-color, #12181F);
        color: var(--primary-text-color, #E8EDF4);
      }
      input.is-missing { border-color: #D6534A; }
      .ed-detect.is-found { border-color: #3E8E5A; }
      .ed-detect.is-absent { border-color: #B07B2E; }
      .ed-status {
        margin: 0 0 12px; font-size: 13px; line-height: 1.5;
        color: var(--primary-text-color, #E8EDF4);
      }
      .ed-actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .ed-actions button {
        flex: 1 1 auto; padding: 9px 14px; border-radius: 8px; cursor: pointer;
        font-size: 13px; font-weight: 500;
        border: 1px solid var(--divider-color, #3A4757);
        background: var(--primary-color, #03A9F4); color: #FFFFFF;
      }
      .ed-actions button.is-quiet {
        background: transparent; color: var(--secondary-text-color, #8A94A6); flex: 0 0 auto;
      }
      .ed-actions button:disabled { opacity: 0.4; cursor: not-allowed; }
      .ed-actions button:hover:not(:disabled) { filter: brightness(1.1); }
      .ed-note {
        margin: 0; font-size: 12px; line-height: 1.5;
        color: var(--secondary-text-color, #8A94A6);
      }
      .ed-info {
        margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--divider-color, #E0E0E0);
        font-size: 12px; color: var(--secondary-text-color, #8A94A6);
      }
      #ed-austausch {
        width: 100%; box-sizing: border-box; margin-top: 8px; padding: 8px 10px;
        border-radius: 10px; border: 1px solid var(--divider-color, #3A4757);
        background: var(--card-background-color, #12181F); color: var(--primary-text-color, #E8EDF4);
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      .ed.einfach .nur-erweitert { display: none !important; }
      details.ed-klapp > summary {
        list-style: none; cursor: pointer; display: flex; align-items: center; gap: 10px;
      }
      details.ed-klapp > summary::-webkit-details-marker { display: none; }
      details.ed-klapp > summary::before {
        content: ""; flex: 0 0 auto; width: 7px; height: 7px; margin: 0 4px 0 2px;
        border-right: 2px solid var(--secondary-text-color, #8A94A6);
        border-bottom: 2px solid var(--secondary-text-color, #8A94A6);
        transform: rotate(-45deg); transition: transform .15s;
      }
      details.ed-klapp[open] > summary::before { transform: rotate(45deg); }
      details.ed-klapp > summary h3 { margin: 0; flex: 1; display: flex; flex-direction: column; }
      details.ed-klapp[open] > summary { margin-bottom: 10px; }
      h3 em, .ed-block-kopf em { font-style: normal; font-weight: 400; font-size: 11px; color: var(--secondary-text-color, #8A94A6); }
      details.ed-group[hidden], .ed-feld[hidden] { display: none; }
      .ed-zahl { font-size: 12px; color: #B07B2E; white-space: nowrap; }
      .ed-zahl.voll { color: #3E8E5A; }
      .ed-block { display: flex; flex-direction: column; gap: 10px; }
      .ed-block-kopf { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
      .ed-block-kopf h3 { margin: 0; display: flex; flex-direction: column; font-size: 14px; color: var(--primary-text-color, #E8EDF4); }
      .ed-schalter { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--primary-text-color, #E8EDF4); cursor: pointer; }
      h4 { margin: 14px 0 6px; font-size: 12px; font-weight: 600; color: var(--primary-text-color, #E8EDF4); }
      .ed-wahl { display: flex; align-items: center; gap: 8px; min-width: 0; }
      .ed-wahl > input, .ed-wahl > .ed-picker { flex: 1; min-width: 0; }
      .ed-zustand {
        flex: 0 0 22px; height: 22px; border-radius: 50%; display: inline-flex;
        align-items: center; justify-content: center; font-size: 13px; font-weight: 700;
      }
      .ed-zustand[data-wert="ok"] { color: #3E8E5A; border: 1px solid #3E8E5A; }
      .ed-zustand[data-wert="fehlt"] { color: #FFFFFF; background: #D6534A; }
      .ed-zustand[data-wert="leer"] { border: 1px dashed var(--divider-color, #3A4757); }
      .ed-frage {
        display: inline-flex; align-items: center; justify-content: center;
        width: 18px; height: 18px; margin-left: 4px; padding: 0; border-radius: 50%;
        border: 1px solid var(--divider-color, #3A4757); background: transparent;
        color: var(--secondary-text-color, #8A94A6); font-size: 11px; cursor: pointer; vertical-align: middle;
      }
      .ed-frage:hover { color: var(--primary-color, #03A9F4); border-color: var(--primary-color, #03A9F4); }
      .ed-feld > span { display: block; }
      .ed-feld > span em { display: block; }
      .ed-erklaerung {
        grid-column: 1 / -1; margin: 0; padding: 8px 10px; border-radius: 8px; font-size: 12px; line-height: 1.5;
        background: rgba(127,127,127,0.08); color: var(--primary-text-color, #E8EDF4);
      }
      details.ed-unter { border-top: 1px solid var(--divider-color, #3A4757); padding: 8px 0 2px; }
      details.ed-unter:first-of-type { border-top: 0; padding-top: 0; }
      details.ed-unter > summary h4 { margin: 0; flex: 1; font-size: 13px; }
      details.ed-unter[open] > summary { margin-bottom: 4px; }
      .ed-meldung { margin: 4px 0 0; font-size: 12px; color: var(--secondary-text-color, #8A94A6); }
      .ed-meldung:empty { display: none; }
      .ed-seg { display: inline-flex; border: 1px solid var(--divider-color, #3A4757); border-radius: 8px; overflow: hidden; }
      .ed-seg button {
        flex: 1; padding: 8px 14px; border: 0; background: transparent; cursor: pointer;
        font-size: 13px; color: var(--secondary-text-color, #8A94A6);
      }
      .ed-seg button.aktiv { background: var(--primary-color, #03A9F4); color: #FFFFFF; }
      .ed-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
      .ed-buttons button {
        padding: 7px 12px; border-radius: 8px; cursor: pointer; font-size: 12px;
        border: 1px solid var(--divider-color, #3A4757); background: transparent;
        color: var(--primary-text-color, #E8EDF4);
      }
      .ed-buttons button:hover { border-color: var(--primary-color, #03A9F4); }
      /* Lange Auswahlnamen brauchen die ganze Breite. */
      .ed-row.ed-breit { grid-template-columns: 1fr; align-items: stretch; gap: 4px; }
      .ed-row select { width: 100%; min-width: 0; }
      @media (max-width: 600px) { .ed-row { grid-template-columns: 1fr; align-items: stretch; } }
    `;
  }
};

// src/editor/werkzeuge.js
var werkzeugeEditor = {
  /** Auswahlliste der Sprachen: automatisch, eingebaute und eigene. */
  _sprachOptionen() {
    const eigene = Array.isArray(this._config.language_custom) ? this._config.language_custom : [];
    const html = [`<option value="auto">${escapeHtml(this._t("e_auto"))}</option>`];
    SPRACHEN.forEach((code) => {
      const ersetzt = eigene.find((p) => p.code === code);
      const name = ersetzt ? `${ersetzt.name} ${this._t("o_p_angepasst")}` : SPRACH_NAMEN[code];
      html.push(`<option value="${code}">${escapeHtml(name)}</option>`);
    });
    eigene.filter((p) => p && !SPRACHEN.includes(p.code)).forEach((p) => {
      html.push(`<option value="${escapeHtml(p.code)}">${escapeHtml(p.name)} ${escapeHtml(this._t("o_p_eigen"))}</option>`);
    });
    return html.join("");
  },
  /** "Entfernen" nur bei einer eigenen oder angepassten Sprache. */
  _zeigeSprachKnoepfe() {
    const weg = this.shadowRoot.getElementById("btn-sprache-weg");
    const eigene = Array.isArray(this._config.language_custom) ? this._config.language_custom : [];
    if (weg) weg.hidden = !eigene.some((p) => p.code === this._config.language);
  },
  /** Bedienung von Export, Import und Entfernen der Sprachpakete. */
  _bindeSprachen() {
    const sr = this.shadowRoot;
    const sagen = (text) => {
      const el = sr.getElementById("ed-sprache-hinweis");
      if (el) el.textContent = text;
    };
    const neuAufbauen = (hinweis) => {
      this._built = false;
      this._render();
      const el = this.shadowRoot.getElementById("ed-sprache-hinweis");
      if (el) el.textContent = hinweis;
    };
    const speichern = (liste, code, hinweis) => {
      this._config = { ...this._config, language_custom: liste, language: code };
      registriereSprachen(this._config);
      this._emit();
      neuAufbauen(hinweis);
    };
    const aus = sr.getElementById("btn-sprache-aus");
    if (aus) {
      aus.addEventListener("click", () => {
        const paket = sprachpaketFuer(this._sp());
        const text = JSON.stringify(paket, null, 2);
        try {
          const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `sprache-${paket.code}.json`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1e3);
          sagen(tf(this._t("m_s_export_ok"), { n: paket.name }));
        } catch {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }
    const datei = sr.getElementById("ed-sprache-datei");
    const ein = sr.getElementById("btn-sprache-ein");
    if (ein && datei) {
      ein.addEventListener("click", () => datei.click());
      datei.addEventListener("change", () => {
        const f = datei.files && datei.files[0];
        if (!f) return;
        const leser = new FileReader();
        leser.onload = () => {
          let roh;
          try {
            roh = JSON.parse(String(leser.result || ""));
          } catch {
            sagen(this._t("m_json"));
            return;
          }
          const erg = pruefeSprache(roh);
          if (erg.fehler) {
            sagen(this._t(erg.fehler));
            return;
          }
          const neu = erg.paket;
          const liste = (Array.isArray(this._config.language_custom) ? this._config.language_custom : []).filter((p) => p.code !== neu.code);
          liste.push(neu);
          registriereSprachen({ language_custom: liste });
          const teile = [
            tf(t("m_s_import_ok", neu.code), {
              n: neu.name,
              z: Object.keys(neu.texte).length,
              h: Object.keys(neu.hilfe).length
            })
          ];
          if (erg.fehlen) teile.push(tf(t("m_s_fehlen", neu.code), { z: erg.fehlen }));
          if (erg.platz.length) {
            teile.push(tf(t("m_s_platz", neu.code), { liste: erg.platz.slice(0, 5).join(", ") }));
          }
          if (erg.unbekannt.length) {
            teile.push(tf(t("m_s_unbekannt", neu.code), { z: erg.unbekannt.length }));
          }
          if (erg.zeichen.length) {
            teile.push(tf(t("m_s_zeichen", neu.code), { liste: erg.zeichen.slice(0, 5).join(", ") }));
          }
          speichern(liste, neu.code, teile.join(". ") + ".");
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(f);
        datei.value = "";
      });
    }
    const weg = sr.getElementById("btn-sprache-weg");
    if (weg) {
      weg.addEventListener("click", () => {
        const code = this._config.language;
        const liste = (Array.isArray(this._config.language_custom) ? this._config.language_custom : []).filter((p) => p.code !== code);
        const eingebaut = SPRACHEN.includes(code);
        registriereSprachen({ language_custom: liste }, code);
        const ziel = eingebaut ? code : "auto";
        speichern(liste, ziel, "");
        const el = this.shadowRoot.getElementById("ed-sprache-hinweis");
        if (el) el.textContent = this._t(eingebaut ? "m_s_zurueck" : "m_s_entfernt");
      });
    }
    this._zeigeSprachKnoepfe();
  },
  /** Auswahlliste der Profile: eingebaute, angepasste und eigene. */
  _profilOptionen() {
    const eigene = eigeneProfile(this._config);
    const html = PROFILE.map((pr) => {
      const ersetzt = eigene.find((p) => p.id === pr.id);
      const name = ersetzt ? `${ersetzt.name} ${this._t(pr.fertig ? "o_p_angepasst" : "o_p_eigen")}` : wertText(pr.name, this._sp());
      const aktiv = pr.fertig || ersetzt;
      return `<option value="${pr.id}"${aktiv ? "" : " disabled"}>${escapeHtml(name)}</option>`;
    });
    eigene.filter((p) => !PROFILE.some((pr) => pr.id === p.id)).forEach((p) => {
      html.push(`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)} ${escapeHtml(this._t("o_p_eigen"))}</option>`);
    });
    return html.join("");
  },
  /** Bedienung von Export, Import und Entfernen der Geraeteprofile. */
  _bindeProfile() {
    const sr = this.shadowRoot;
    const sagen = (text) => {
      const el = sr.getElementById("ed-profil-hinweis");
      if (el) el.textContent = text;
    };
    const aktuell = () => this._config.profil || DEFAULT_CONFIG.profil;
    const speichern = (liste, profilId) => {
      this._config = { ...this._config, profile_custom: liste, profil: profilId };
      this._emit();
      const auswahl = sr.getElementById("opt-profil");
      if (auswahl) {
        auswahl.innerHTML = this._profilOptionen();
        auswahl.value = profilId;
      }
      this._zeigeProfilKnoepfe();
    };
    const aus = sr.getElementById("btn-profil-aus");
    if (aus) {
      aus.addEventListener("click", () => {
        const id = aktuell();
        const daten = eigenesProfil(this._config) || eingebautesProfil(id);
        if (!daten) {
          sagen(this._t("m_p_leer"));
          return;
        }
        const text = JSON.stringify(daten, null, 2);
        try {
          const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `geraeteprofil-${daten.id}.json`;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1e3);
          sagen(tf(this._t("m_p_export_ok"), { n: daten.name }));
        } catch {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }
    const datei = sr.getElementById("ed-profil-datei");
    const ein = sr.getElementById("btn-profil-ein");
    if (ein && datei) {
      ein.addEventListener("click", () => datei.click());
      datei.addEventListener("change", () => {
        const f = datei.files && datei.files[0];
        if (!f) return;
        const leser = new FileReader();
        leser.onload = () => {
          let roh;
          try {
            roh = JSON.parse(String(leser.result || ""));
          } catch {
            sagen(this._t("m_json"));
            return;
          }
          const ergebnis = pruefeProfil(roh);
          if (ergebnis.fehler) {
            sagen(this._t(ergebnis.fehler));
            return;
          }
          const neu = ergebnis.profil;
          const liste = eigeneProfile(this._config).filter((p) => p.id !== neu.id);
          liste.push(neu);
          speichern(liste, neu.id);
          const erkannt = erkenneMitProfil(this._hass, neu);
          const teile = [
            tf(this._t("m_p_import_ok"), { n: neu.name, z: Object.keys(neu.felder).length }),
            tf(this._t("m_p_gefunden"), { z: Object.keys(erkannt.entities).length })
          ];
          if (ergebnis.unbekannt.length) {
            teile.push(tf(this._t("m_p_unbekannt"), { liste: ergebnis.unbekannt.slice(0, 5).join(", ") }));
          }
          sagen(teile.join(". ") + ".");
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(f);
        datei.value = "";
      });
    }
    const weg = sr.getElementById("btn-profil-weg");
    if (weg) {
      weg.addEventListener("click", () => {
        const id = aktuell();
        const liste = eigeneProfile(this._config).filter((p) => p.id !== id);
        const eingebaut = PROFILE.find((pr) => pr.id === id && pr.fertig);
        speichern(liste, eingebaut ? id : DEFAULT_CONFIG.profil);
        sagen(this._t(eingebaut ? "m_p_zurueck" : "m_p_entfernt"));
      });
    }
    this._zeigeProfilKnoepfe();
  },
  /** Statuszeile der Erkennung, bei eigenem Profil mit dessen Namen. */
  _erkanntText(found) {
    if (!found.found) return this._t("m_nicht_erkannt");
    const eigen = eigenesProfil(this._config);
    const werte = { a: found.count, b: Object.keys(found.entities).length };
    return eigen ? tf(this._t("m_erkannt_p"), { ...werte, n: eigen.name }) : tf(this._t("m_erkannt"), werte);
  },
  /** "Entfernen" nur, wenn das gewaehlte Profil ein eigenes ist. */
  _zeigeProfilKnoepfe() {
    const sr = this.shadowRoot;
    const weg = sr.getElementById("btn-profil-weg");
    if (weg) weg.hidden = !eigenesProfil(this._config);
    if (!this._hass) return;
    const found = detectIntegration(this._hass, profilFuer(this._config));
    const gruppe = sr.querySelector(".ed-detect");
    if (gruppe) {
      gruppe.classList.toggle("is-found", found.found);
      gruppe.classList.toggle("is-absent", !found.found);
    }
    const status = sr.querySelector(".ed-detect .ed-status");
    if (status) {
      status.textContent = this._erkanntText(found);
    }
    const adopt = sr.getElementById("btn-adopt");
    if (adopt) adopt.disabled = !found.found;
  }
};

// src/editor/editor.js
var LutarymHeatpumpCardEditor = class extends HTMLElement {
  /** Sprache des Dialogs, wie bei der Karte. */
  _sp() {
    const gewaehlt = this._config && this._config.language;
    if (gewaehlt && gewaehlt !== "auto" && spracheBekannt(gewaehlt)) return gewaehlt;
    const ha = String(this._hass && this._hass.language || "").toLowerCase();
    if (EIGENE_SPRACHEN[ha]) return ha;
    const kurz = ha.slice(0, 2);
    return spracheBekannt(kurz) ? kurz : "en";
  }
  _t(schluessel) {
    return t(schluessel, this._sp());
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
  }
  setConfig(config) {
    registriereSprachen(config);
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...config.entities || {} }
    };
    if (this._hass) this._render();
  }
  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._render();
      return;
    }
    if (this.shadowRoot) {
      this.shadowRoot.querySelectorAll(".ed-picker").forEach((p) => {
        p.hass = hass;
      });
    }
  }
  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true
      })
    );
  }
  _render() {
    if (!this._config || !this._hass) return;
    if (this._built) {
      this._syncValues();
      return;
    }
    const groups = [];
    ENTITY_FIELDS.forEach((f) => {
      let g = groups.find((x) => x.name === f.group);
      if (!g) groups.push(g = { name: f.group, fields: [] });
      g.fields.push(f);
    });
    const options = Object.keys(this._hass.states).filter(
      (e) => /^(sensor|number|input_number|binary_sensor|switch|input_boolean|select|input_select)\./.test(
        e
      )
    ).sort().map((e) => `<option value="${e}">${escapeHtml(friendly(this._hass, e))}</option>`).join("");
    const found = detectIntegration(this._hass, profilFuer(this._config));
    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="ed">
        <div class="ed-group ed-detect ${found.found ? "is-found" : "is-absent"}">
          <h3>${this._t("e_integration")}</h3>
          <p class="ed-status">${this._erkanntText(found)}</p>
          <div class="ed-actions">
            <button type="button" id="btn-adopt" ${found.found ? "" : "disabled"}>${this._t("e_uebernehmen")}</button>
            <button type="button" id="btn-default" class="nur-erweitert">${this._t("e_standardnamen")}</button>
            <button type="button" id="btn-clear" class="is-quiet nur-erweitert">${this._t("e_alle_leeren")}</button>
          </div>
          <div class="ed-row ed-breit">
            <span>${this._t("e_modus")}<em>${this._t("e_modus_h")}</em></span>
            <div class="ed-seg" id="ed-modus">
              <button type="button" data-modus="einfach">${this._t("e_modus_einfach")}</button>
              <button type="button" data-modus="erweitert">${this._t("e_modus_erweitert")}</button>
            </div>
          </div>
          <label class="ed-row ed-breit">
            <span>${this._t("e_sprache")}${this._sp() === "en" ? "" : " / Language"}<em>${this._t("e_sprache_h")}</em></span>
            <select id="opt-sprache">${this._sprachOptionen()}</select>
          </label>
          <label class="ed-row ed-breit nur-erweitert">
            <span>${this._t("e_profil")}<em>${this._t("e_profil_h")}</em></span>
            <select id="opt-profil">${this._profilOptionen()}</select>
          </label>
        </div>

        <details class="ed-group ed-klapp" data-klapp="darstellung">
          <summary><h3>${this._t("e_darstellung")}</h3></summary>
          <details class="ed-unter ed-klapp" data-klapp="d-allgemein">
            <summary><h4>${this._t("e_d_allgemein")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_thema")}<em>${this._t("e_thema_h")}</em></span>
            <select id="opt-thema">
              ${["auto", "dunkel", "hell", "kontrast", "nacht", "ha"].map((k) => `<option value="${k}">${this._t(`o_th_${k}`)}</option>`).join("")}
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anordnung")}<em>${this._t("e_anordnung_h")}</em></span>
            <select id="opt-layout">
              <option value="quer">${this._t("e_quer")}</option>
              <option value="hoch">${this._t("e_hoch")}</option>
              <option value="klassisch">${this._t("e_klassisch")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anz_luefter")}</span>
            <select id="opt-fans"><option value="1">${this._t("e_1luefter")}</option><option value="2">${this._t("e_2luefter")}</option></select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anz_hk")}</span>
            <select id="opt-hk"><option value="1">${this._t("e_1hk")}</option><option value="2">${this._t("e_2hk")}</option><option value="3">${this._t("e_3hk")}</option><option value="4">${this._t("e_4hk")}</option></select>
          </label>
          ${[1, 2, 3, 4].map((n) => `
          <label class="ed-row" data-hk-zeile="${n}">
            <span>${this._t(`e_hk${n}_bild`)}</span>
            <select id="opt-hk${n}-stil">
              <option value="platte">${this._t("e_rad_platte")}</option>
              <option value="glieder">${this._t("e_rad_glieder")}</option>
              <option value="fbh">${this._t("e_rad_fbh")}</option>
            </select>
          </label>`).join("")}
          <label class="ed-row">
            <span>${this._t("e_puffer")}<em>${this._t("e_puffer_auto_h")}</em></span>
            <select id="opt-puffer">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="ja">${this._t("e_vorhanden")}</option>
              <option value="nein">${this._t("e_nicht_vorhanden")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_zusatz")}<em>${this._t("e_zusatz_h")}</em></span>
            <select id="opt-zusatz">
              <option value="aus">${this._t("o_aus")}</option>
              <option value="kamin">${this._t("kamin")}</option>
              <option value="solar">${this._t("solarthermie")}</option>
              <option value="beide">${this._t("e_zusatz_beide")}</option>
            </select>
          </label>
          <label class="ed-row" data-zusatz-zeile="kamin">
            <span>${this._t("e_feuer_ab")}<em>${this._t("e_feuer_ab_h")}</em></span>
            <input type="number" id="opt-feuer" step="1">
          </label>
          <label class="ed-row" data-zusatz-zeile="solar">
            <span>${this._t("e_sonne_ab")}<em>${this._t("e_sonne_ab_h")}</em></span>
            <input type="number" id="opt-sonne" step="1">
          </label>
          <label class="ed-row" data-zusatz-zeile="solar">
            <span>${this._t("e_solarstil")}<em>${this._t("e_solarstil_h")}</em></span>
            <select id="opt-solarstil">
              <option value="strahlen">${this._t("o_solar_strahlen")}</option>
              <option value="funkeln">${this._t("o_solar_funkeln")}</option>
              <option value="roehren">${this._t("o_solar_roehren")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_zirk")}<em>${this._t("e_zirk_h")}</em></span>
            <select id="opt-zirk">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="ja">${this._t("e_anzeigen")}</option>
              <option value="nein">${this._t("e_ausblenden")}</option>
            </select>
          </label>
          </details>
          <details class="ed-unter ed-klapp" data-klapp="d-namen">
            <summary><h4>${this._t("e_d_namen")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_l_hk1")}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk1">
          </label>
          ${[2, 3, 4].map((n) => `
          <label class="ed-row" data-hk-zeile="${n}">
            <span>${this._t(`e_l_hk${n}`)}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk${n}">
          </label>`).join("")}
          <label class="ed-row">
            <span>${this._t("e_l_buf")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-lbuf">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_dhw")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-ldhw">
          </label>
          <label class="ed-row nur-erweitert">
            <span>${this._t("e_l_energy")}<em>${this._t("e_l_energy_h")}</em></span>
            <input type="text" id="opt-lenergy">
          </label>
          </details>
          <details class="ed-unter ed-klapp" data-klapp="d-anzeige">
            <summary><h4>${this._t("e_d_anzeige")}</h4></summary>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-ziel">
            <span>${this._t("e_ziel_zeigen")}<em>${this._t("e_ziel_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-laedt">
            <span>${this._t("e_laedt_zeigen")}<em>${this._t("e_laedt_zeigen_h")}</em></span>
          </label>
          <label class="ed-row">
            <span>${this._t("e_verlauf")}<em>${this._t("e_verlauf_h")}</em></span>
            <select id="opt-verlauf">
              <option value="knopf">${this._t("e_verlauf_knopf")}</option>
              <option value="karte">${this._t("e_verlauf_karte")}</option>
              <option value="aus">${this._t("o_aus")}</option>
            </select>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-hilfe">
            <span>${this._t("e_hilfe_zeigen")}<em>${this._t("e_hilfe_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-tuer">
            <span>${this._t("e_tuer_zeigen")}<em>${this._t("e_tuer_zeigen_h")}</em></span>
          </label>
          <label class="ed-row">
            <span>${this._t("e_bewegung")}<em>${this._t("e_bewegung_h")}</em></span>
            <select id="opt-animate">
              <option value="ein">${this._t("o_ein")}</option>
              <option value="auto">${this._t("e_auto")}</option>
              <option value="aus">${this._t("o_aus")}</option>
            </select>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-demo">
            <span>${this._t("e_demo")}<em>${this._t("e_demo_h")}</em></span>
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-groesse">
            <summary><h4>${this._t("e_d_groesse")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_breite")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-breite" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_hoehe")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-hoehe" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_vbreite")}<em>${this._t("e_vbreite_h")}</em></span>
            <input type="number" id="opt-vbreite" min="250" max="700" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_rohr")}<em>${this._t("e_rohr_h")}</em></span>
            <input type="number" id="opt-rohr" min="0" max="80" step="1">
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-kurve">
            <summary><h4>${this._t("e_d_kurve")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_kx_von")}<em>${this._t("e_kx_von_h")}</em></span>
            <input type="number" id="opt-kxmin" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_kx_bis")}<em>${this._t("e_kx_bis_h")}</em></span>
            <input type="number" id="opt-kxmax" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_ky_von")}<em>${this._t("e_ky_von_h")}</em></span>
            <input type="number" id="opt-kymin" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_ky_bis")}<em>${this._t("e_ky_bis_h")}</em></span>
            <input type="number" id="opt-kymax" step="1">
          </label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-skalen">
            <summary><h4>${this._t("e_d_skalen")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_hs_kalt")}<em>${this._t("e_hs_kalt_h")}</em></span>
            <input type="number" id="opt-min">
          </label>
          <label class="ed-row"><span>${this._t("e_hs_heiss")}<em>${this._t("e_grad")}</em></span><input type="number" id="opt-max"></label>
          <label class="ed-row">
            <span>${this._t("e_as_kalt")}<em>${this._t("e_as_kalt_h")}</em></span>
            <input type="number" id="opt-omin">
          </label>
          <label class="ed-row"><span>${this._t("e_as_warm")}<em>${this._t("e_grad")}</em></span><input type="number" id="opt-omax"></label>
          </details>
          <details class="ed-unter ed-klapp nur-erweitert" data-klapp="d-technik">
            <summary><h4>${this._t("e_d_technik")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_mqtt")}<em>${this._t("e_mqtt_h")}</em></span>
            <input type="text" id="opt-mqtt" placeholder="panasonic_heat_pump">
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-eday">
            <span>${this._t("e_tagesverbrauch")}</span>
          </label>
          </details>
        </details>

        <div class="ed-block nur-erweitert">
          <div class="ed-block-kopf">
            <h3>${this._t("e_entitaeten")}<em>${this._t("e_entitaeten_h")}</em></h3>
            <label class="ed-schalter"><input type="checkbox" id="ed-nur-fehlende"><span>${this._t("e_nur_fehlende")}</span></label>
          </div>
          <p class="ed-meldung" id="ed-alles-da" hidden>${this._t("e_alles_da")}</p>
          ${groups.map(
      (g, gi) => `
          <details class="ed-group ed-klapp" data-klapp="g${gi}" data-gruppe="${gi}" data-gruppe-name="${escapeHtml(g.name)}">
            <summary><h3>${escapeHtml(gruppenText(g.name, this._sp()))}</h3><span class="ed-zahl" id="ed-zahl-${gi}"></span></summary>
            ${g.fields.map((f) => {
        const hilfe = this._feldHilfe(f);
        return `
              <div class="ed-row ed-feld" data-feld="${f.key}">
                <span>${escapeHtml(feldText(f, this._sp()))}${hilfe ? ` <button type="button" class="ed-frage" data-frage="${f.key}" title="${escapeHtml(this._t("f_erklaerung"))}" aria-label="${escapeHtml(this._t("f_erklaerung"))}">?</button>` : ""}<em>${escapeHtml(hinweisText(f.hint, this._sp()))}</em></span>
                <div class="ed-wahl">
                  <input type="text" list="lhc-entities" data-entity="${f.key}"
                         placeholder="entity_id" autocomplete="off">
                  <span class="ed-zustand" data-zustand="${f.key}"></span>
                </div>
                ${hilfe ? `<p class="ed-erklaerung" data-erklaerung="${f.key}" hidden>${escapeHtml(hilfe)}</p>` : ""}
              </div>`;
      }).join("")}
          </details>`
    ).join("")}
          <p class="ed-note">${this._t("r_sg_hinweis")}</p>
        </div>

        <datalist id="lhc-entities">${options}</datalist>

        <details class="ed-group ed-klapp nur-erweitert" data-klapp="werkzeuge">
          <summary><h3>${this._t("e_werkzeuge")}<em>${this._t("e_werkzeuge_h")}</em></h3></summary>
          <h4>${this._t("e_w_konfig")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-datei-aus">${this._t("e_datei_speichern")}</button>
            <button type="button" id="btn-datei-ein">${this._t("e_datei_laden")}</button>
            <button type="button" id="btn-export">${this._t("e_feld_schreiben")}</button>
            <button type="button" id="btn-import">${this._t("e_feld_einlesen")}</button>
          </div>
          <input type="file" id="ed-datei" accept=".json,application/json" hidden>
          <textarea id="ed-austausch" rows="4" spellcheck="false"
                    placeholder="${this._t("r_platzhalter")}"></textarea>
          <p class="ed-meldung" id="ed-austausch-hinweis"></p>
          <h4>${this._t("e_w_profil")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-profil-aus">${this._t("e_p_export")}</button>
            <button type="button" id="btn-profil-ein">${this._t("e_p_import")}</button>
            <button type="button" id="btn-profil-weg">${this._t("e_p_entfernen")}</button>
          </div>
          <input type="file" id="ed-profil-datei" accept=".json,application/json" hidden>
          <p class="ed-meldung" id="ed-profil-hinweis"></p>
          <h4>${this._t("e_w_sprache")}</h4>
          <div class="ed-buttons">
            <button type="button" id="btn-sprache-aus">${this._t("e_s_export")}</button>
            <button type="button" id="btn-sprache-ein">${this._t("e_s_import")}</button>
            <button type="button" id="btn-sprache-weg">${this._t("e_s_entfernen")}</button>
          </div>
          <input type="file" id="ed-sprache-datei" accept=".json,application/json" hidden>
          <p class="ed-meldung" id="ed-sprache-hinweis"></p>
        </details>

        <p class="ed-info">
          <strong>Heatpump Flow Card by Lutarym v${CARD_VERSION}</strong>
        </p>
      </div>
    `;
    const bind = (id, handler) => {
      const el = this.shadowRoot.getElementById(id);
      if (el) el.addEventListener("change", () => handler(el));
    };
    const put = (patch) => {
      this._config = { ...this._config, ...patch };
      this._emit();
    };
    bind("opt-fans", (el) => put({ fan_count: parseInt(el.value, 10) }));
    bind("opt-layout", (el) => put({ layout: el.value }));
    bind("opt-thema", (el) => put({ theme: el.value }));
    bind("opt-breite", (el) => put({ card_width: parseInt(el.value, 10) || 0 }));
    bind("opt-hoehe", (el) => put({ card_height: parseInt(el.value, 10) || 0 }));
    bind("opt-rohr", (el) => put({ pipe_inner_mm: parseInt(el.value, 10) || 0 }));
    bind("opt-mqtt", (el) => put({ mqtt_prefix: el.value.trim() || "panasonic_heat_pump" }));
    bind("opt-sprache", (el) => {
      put({ language: el.value });
      this._zeigeSprachKnoepfe();
    });
    this._bindeSprachen();
    bind("opt-profil", (el) => {
      put({ profil: el.value });
      this._zeigeProfilKnoepfe();
    });
    this._bindeProfile();
    bind("opt-vbreite", (el) => put({ history_width: parseInt(el.value, 10) || 450 }));
    bind("opt-kxmin", (el) => put({ curve_x_min: parseInt(el.value, 10) }));
    bind("opt-kxmax", (el) => put({ curve_x_max: parseInt(el.value, 10) }));
    bind("opt-kymin", (el) => put({ curve_y_min: parseInt(el.value, 10) }));
    bind("opt-kymax", (el) => put({ curve_y_max: parseInt(el.value, 10) }));
    bind("opt-hk", (el) => {
      put({ hk_count: parseInt(el.value, 10) });
      this._syncValues();
    });
    bind("opt-min", (el) => put({ scale_min: parseFloat(el.value) }));
    bind("opt-max", (el) => put({ scale_max: parseFloat(el.value) }));
    bind("opt-omin", (el) => put({ outdoor_min: parseFloat(el.value) }));
    bind("opt-omax", (el) => put({ outdoor_max: parseFloat(el.value) }));
    bind("opt-lhk1", (el) => put({ label_hk1: el.value }));
    [2, 3, 4].forEach((n) => bind(`opt-lhk${n}`, (el) => put({ [`label_hk${n}`]: el.value })));
    bind("opt-lbuf", (el) => put({ label_buffer: el.value }));
    bind("opt-ldhw", (el) => put({ label_dhw: el.value }));
    bind("opt-lenergy", (el) => put({ label_energy: el.value }));
    bind("opt-eday", (el) => put({ energy_daily: el.checked }));
    bind("opt-animate", (el) => put({ animate: el.value === "aus" ? false : el.value === "auto" ? "auto" : true }));
    bind("opt-demo", (el) => put({ demo: el.checked }));
    bind("opt-verlauf", (el) => put({ show_history: el.value === "karte" ? true : el.value === "aus" ? false : "knopf" }));
    bind("opt-ziel", (el) => put({ show_target: el.checked }));
    bind("opt-laedt", (el) => put({ show_reload: el.checked }));
    bind("opt-hilfe", (el) => put({ show_help: el.checked }));
    bind("opt-tuer", (el) => put({ show_door: el.checked }));
    [1, 2, 3, 4].forEach((n) => bind(`opt-hk${n}-stil`, (el) => put({ [`hk${n}_style`]: el.value })));
    bind("opt-zusatz", (el) => {
      put({ extra_heat: el.value });
      this._syncValues();
    });
    bind("opt-feuer", (el) => {
      const v = parseFloat(el.value);
      if (Number.isFinite(v)) put({ kamin_fire_temp: v });
    });
    bind("opt-solarstil", (el) => put({ solar_style: el.value }));
    bind("opt-sonne", (el) => {
      const v = parseFloat(el.value);
      if (Number.isFinite(v)) put({ solar_sun_temp: v });
    });
    bind("opt-puffer", (el) => put({ buffer_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));
    bind("opt-zirk", (el) => put({ circulation_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));
    const applyMap = (map, merge) => {
      const entities = merge ? { ...this._config.entities, ...map } : { ...map };
      this._config = { ...this._config, entities };
      this._syncValues();
      this._emit();
    };
    const feld = this.shadowRoot.getElementById("ed-austausch");
    const sagen = (text) => {
      const el = this.shadowRoot.getElementById("ed-austausch-hinweis");
      if (el) el.textContent = text;
    };
    const exp = this.shadowRoot.getElementById("btn-export");
    if (exp) {
      exp.addEventListener("click", () => {
        const kopie = { ...this._config };
        delete kopie.type;
        feld.value = JSON.stringify(kopie, null, 2);
        feld.select();
        sagen(this._t("m_im_feld"));
      });
    }
    const dateiAus = this.shadowRoot.getElementById("btn-datei-aus");
    if (dateiAus) {
      dateiAus.addEventListener("click", () => {
        const kopie = { ...this._config };
        delete kopie.type;
        const text = JSON.stringify(kopie, null, 2);
        try {
          let url;
          let aufraeumen = null;
          if (typeof URL !== "undefined" && URL.createObjectURL) {
            url = URL.createObjectURL(
              new Blob([text], { type: "application/json" })
            );
            aufraeumen = () => URL.revokeObjectURL(url);
          } else {
            url = "data:application/json;charset=utf-8," + encodeURIComponent(text);
          }
          const link = document.createElement("a");
          link.href = url;
          link.download = `heatpump-flow-card-by-lutarym-${CARD_VERSION}.json`;
          link.click();
          if (aufraeumen) setTimeout(aufraeumen, 1e3);
          sagen(this._t("m_datei_ok"));
        } catch {
          sagen(this._t("m_datei_fehler"));
        }
      });
    }
    const dateiFeld = this.shadowRoot.getElementById("ed-datei");
    const dateiEin = this.shadowRoot.getElementById("btn-datei-ein");
    if (dateiEin && dateiFeld) {
      dateiEin.addEventListener("click", () => dateiFeld.click());
      dateiFeld.addEventListener("change", () => {
        const datei = dateiFeld.files && dateiFeld.files[0];
        if (!datei) return;
        const leser = new FileReader();
        leser.onload = () => {
          const ziel = this.shadowRoot.getElementById("ed-austausch");
          if (ziel) ziel.value = String(leser.result || "");
          const knopf = this.shadowRoot.getElementById("btn-import");
          if (knopf) knopf.click();
        };
        leser.onerror = () => sagen(this._t("m_datei_lesen"));
        leser.readAsText(datei);
        dateiFeld.value = "";
      });
    }
    const imp = this.shadowRoot.getElementById("btn-import");
    if (imp) {
      imp.addEventListener("click", () => {
        let gelesen;
        try {
          gelesen = JSON.parse(feld.value);
        } catch {
          sagen(this._t("m_json"));
          return;
        }
        if (!gelesen || typeof gelesen !== "object" || Array.isArray(gelesen)) {
          sagen(this._t("m_keine_konfig"));
          return;
        }
        const erlaubt = Object.keys(DEFAULT_CONFIG);
        const felder = ENTITY_FIELDS.map((f) => f.key);
        const uebernommen = {};
        let verworfen = 0;
        Object.keys(gelesen).forEach((k) => {
          if (k === "entities") return;
          if (erlaubt.includes(k) || k.startsWith("label_")) {
            uebernommen[k] = gelesen[k];
          } else {
            verworfen += 1;
          }
        });
        const zuordnung = {};
        const unbekannt = [];
        const fehlen = [];
        const falscherBereich = [];
        const quelle = gelesen.entities && typeof gelesen.entities === "object" ? gelesen.entities : {};
        Object.keys(quelle).forEach((feld2) => {
          const id = quelle[feld2];
          if (!felder.includes(feld2)) {
            unbekannt.push(feld2);
            return;
          }
          if (typeof id !== "string" || !id.includes(".")) return;
          const bereich = FIELD_DOMAIN[feld2];
          if (bereich && !bereich.includes(id.split(".")[0])) {
            falscherBereich.push(feld2);
            return;
          }
          zuordnung[feld2] = id;
          const st = this._hass && this._hass.states;
          if (st && !st[id]) fehlen.push(id);
        });
        uebernommen.entities = zuordnung;
        this._config = { type: this._config.type, ...uebernommen };
        this._emit();
        this.setConfig(this._config);
        const jetzt = this._config.entities || {};
        const nichtAngekommen = Object.keys(zuordnung).filter(
          (k) => jetzt[k] !== zuordnung[k]
        );
        const teile = [
          tf(this._t("m_einst"), { n: Object.keys(uebernommen).length - 1 }),
          tf(this._t("m_ent"), { n: Object.keys(zuordnung).length })
        ];
        if (verworfen) teile.push(tf(this._t("m_unb_einst"), { n: verworfen }));
        if (unbekannt.length) teile.push(tf(this._t("m_unb_felder"), { n: unbekannt.length }));
        if (falscherBereich.length)
          teile.push(tf(this._t("m_bereich"), { n: falscherBereich.length }));
        if (fehlen.length)
          teile.push(
            tf(this._t("m_fehlen"), {
              n: fehlen.length,
              liste: fehlen.slice(0, 3).join(", ") + (fehlen.length > 3 ? this._t("m_weitere") : "")
            })
          );
        if (nichtAngekommen.length)
          teile.push(tf(this._t("m_nicht_an"), { liste: nichtAngekommen.join(", ") }));
        sagen(teile.join(". ") + ".");
      });
    }
    this.shadowRoot.getElementById("btn-adopt").addEventListener("click", () => {
      const f = detectIntegration(this._hass, profilFuer(this._config));
      if (f.found) applyMap(quellenZuordnung(f.entities, this._config.extra_heat), true);
    });
    this.shadowRoot.getElementById("btn-default").addEventListener("click", () => applyMap(quellenZuordnung(defaultEntityMap(), this._config.extra_heat), true));
    this.shadowRoot.getElementById("btn-clear").addEventListener("click", () => applyMap({}, false));
    this.shadowRoot.querySelectorAll("[data-entity]").forEach((input) => {
      input.addEventListener("change", () => {
        const entities = { ...this._config.entities };
        const v = input.value.trim();
        if (v) entities[input.dataset.entity] = v;
        else delete entities[input.dataset.entity];
        this._config = { ...this._config, entities };
        this._emit();
        this._zeigeEntitaetsZustand();
      });
    });
    this._bindeEditorBedienung();
    this._built = true;
    this._syncValues();
    this._entitaetsAuswahl();
  }
  _syncValues() {
    const sr = this.shadowRoot;
    const put = (id, value) => {
      const el = sr.getElementById(id);
      if (el && el !== sr.activeElement) el.value = value;
    };
    const check = (id, value) => {
      const el = sr.getElementById(id);
      if (el) el.checked = value !== false;
    };
    put("opt-fans", String(this._config.fan_count));
    put("opt-layout", this._config.layout || "quer");
    put("opt-thema", this._config.theme || "auto");
    put("opt-breite", String(this._config.card_width || 0));
    put("opt-hoehe", String(this._config.card_height || 0));
    put("opt-rohr", String(this._config.pipe_inner_mm || 0));
    put("opt-mqtt", this._config.mqtt_prefix || "panasonic_heat_pump");
    const sprachWahl = this.shadowRoot.getElementById("opt-sprache");
    if (sprachWahl) sprachWahl.innerHTML = this._sprachOptionen();
    put("opt-sprache", this._config.language || "auto");
    this._zeigeSprachKnoepfe();
    const profilWahl = this.shadowRoot.getElementById("opt-profil");
    if (profilWahl) profilWahl.innerHTML = this._profilOptionen();
    put("opt-profil", this._config.profil || "heishamon");
    this._zeigeProfilKnoepfe();
    put("opt-vbreite", String(this._config.history_width || 450));
    put("opt-kxmin", String(this._config.curve_x_min));
    put("opt-kxmax", String(this._config.curve_x_max));
    put("opt-kymin", String(this._config.curve_y_min));
    put("opt-kymax", String(this._config.curve_y_max));
    put("opt-hk", String(this._config.hk_count));
    put("opt-min", this._config.scale_min);
    put("opt-max", this._config.scale_max);
    put("opt-omin", this._config.outdoor_min);
    put("opt-omax", this._config.outdoor_max);
    put("opt-lhk1", this._config.label_hk1);
    [2, 3, 4].forEach((n) => put(`opt-lhk${n}`, this._config[`label_hk${n}`]));
    put("opt-lbuf", this._config.label_buffer);
    put("opt-ldhw", this._config.label_dhw);
    put("opt-lenergy", this._config.label_energy);
    check("opt-eday", this._config.energy_daily);
    put("opt-animate", this._config.animate === false ? "aus" : this._config.animate === "auto" ? "auto" : "ein");
    check("opt-demo", this._config.demo === true);
    put("opt-verlauf", this._config.show_history === true ? "karte" : this._config.show_history === false ? "aus" : "knopf");
    check("opt-ziel", this._config.show_target !== false);
    check("opt-laedt", this._config.show_reload !== false);
    check("opt-hilfe", this._config.show_help !== false);
    check("opt-tuer", this._config.show_door !== false);
    const anzahlHk = Number(this._config.hk_count) || 2;
    [1, 2, 3, 4].forEach((n) => {
      const v = this._config[`hk${n}_style`] || "platte";
      put(`opt-hk${n}-stil`, v === "fbh_verteiler" || v === "fbh_raum" ? "fbh" : v);
    });
    sr.querySelectorAll("[data-hk-zeile]").forEach((z) => {
      z.style.display = Number(z.dataset.hkZeile) <= anzahlHk ? "" : "none";
    });
    put("opt-zusatz", this._config.extra_heat || "aus");
    const zusatz = this._config.extra_heat || "aus";
    put("opt-feuer", this._config.kamin_fire_temp ?? 30);
    put("opt-sonne", this._config.solar_sun_temp ?? 30);
    put("opt-solarstil", this._config.solar_style || "strahlen");
    sr.querySelectorAll("[data-zusatz-zeile]").forEach((z) => {
      const art = z.dataset.zusatzZeile;
      z.style.display = zusatz === art || zusatz === "beide" ? "" : "none";
    });
    sr.querySelectorAll("details[data-gruppe-name]").forEach((d) => {
      const name = d.dataset.gruppeName;
      let zeigen = true;
      if (name === "Heizkreis 3") zeigen = anzahlHk >= 3;
      if (name === "Heizkreis 4") zeigen = anzahlHk >= 4;
      if (name === "Zusatzw\xE4rme") zeigen = zusatz !== "aus";
      d.style.display = zeigen ? "" : "none";
    });
    put("opt-puffer", this._config.buffer_present === true ? "ja" : this._config.buffer_present === false ? "nein" : "auto");
    put("opt-zirk", this._config.circulation_present === true ? "ja" : this._config.circulation_present === false ? "nein" : "auto");
    const imFokus = sr.activeElement;
    sr.querySelectorAll("[data-entity]").forEach((input) => {
      const v = (this._config.entities || {})[input.dataset.entity] || "";
      if (input.classList.contains("ed-picker")) {
        if (input.hass !== this._hass) input.hass = this._hass;
        if (input.value !== v) input.value = v;
        return;
      }
      if (input !== imFokus && input.value !== v) input.value = v;
      input.classList.toggle("is-missing", Boolean(v) && !this._hass.states[v]);
    });
    this._zeigeEntitaetsZustand();
  }
};
Object.assign(
  LutarymHeatpumpCardEditor.prototype,
  bedienungEditor,
  werkzeugeEditor,
  stilEditor
);

// src/karte/aktualisieren.js
var aktualisierenKarte = {
  _sgMode() {
    const k1 = this._e("sg_k1");
    const k2 = this._e("sg_k2");
    if (!k1 || !k2) return null;
    const unklar = [null, "unknown", "unavailable", ""];
    if (unklar.includes(rawState(this._quelle, k1))) return null;
    if (unklar.includes(rawState(this._quelle, k2))) return null;
    const a = isOn(this._quelle, k1);
    const b = isOn(this._quelle, k2);
    if (a === null || b === null) return null;
    if (a && !b) return 1;
    if (!a && !b) return 2;
    if (!a && b) return 3;
    return 4;
  },
  /**
   * Blendet in Puffer und Warmwasser die Zeilen "Ziel" und "Laedt ab"
   * nach der Konfiguration aus. Die verbleibenden Zeilen ruecken nach
   * oben, damit keine Luecke entsteht. Abstand und Startpunkt kommen aus
   * der gezeichneten Grafik, das gilt fuer Quer- und Hochformat.
   */
  _speicherZeilen(name) {
    const zeilen = [
      { el: this._animEl(`${name}-sp`), zeigen: this._config.show_target !== false },
      { el: this._animEl(`${name}-delta`), zeigen: this._config.show_reload !== false }
    ];
    if (zeilen.some((z) => !z.el)) return;
    zeilen.forEach((z) => {
      if (z.el.dataset.y0 === void 0) z.el.dataset.y0 = z.el.getAttribute("y");
    });
    const start = Number(zeilen[0].el.dataset.y0);
    const abstand = Number(zeilen[1].el.dataset.y0) - start;
    let i = 0;
    zeilen.forEach((z) => {
      if (!z.zeigen) {
        z.el.textContent = "";
        return;
      }
      z.el.setAttribute("y", String(start + i * abstand));
      i++;
    });
  },
  /**
   * Rahmen der Heizkurve. Der Klick oeffnet das Fenster mit den vier
   * Eckwerten. Gezeichnet wird die Kurve spaeter aus den Entitaeten.
   */
  /**
   * Ob gerade Warmwasser geladen wird. Das Dreiwegeventil ist die
   * verlaessliche Quelle, ersatzweise die Betriebsart: 3 heisst
   * "Nur Warmwasser".
   */
  _ladtWarmwasser(hass) {
    const v = numState(hass, this._e("three_way_valve"));
    if (v !== null) return v > 0;
    return numState(hass, this._e("operating_mode")) === 3;
  },
  /* -------------------- Aktualisierung -------------------- */
  _update() {
    const hass = this._quelle;
    if (!hass) return;
    const min = Number(this._config.scale_min);
    const max = Number(this._config.scale_max);
    const col = (v) => thermalColor(v, min, max);
    const animate = animationAn(this._config);
    const set = (id, text) => {
      const el = this._animEl(id);
      if (el) el.textContent = text;
    };
    const paint = (id, color) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("stop-color", color);
    };
    const zeige = (id, sichtbar) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("opacity", sichtbar ? "1" : "0");
    };
    const abzeichen = (id, aktiv) => {
      const el = this._animEl(id);
      if (!el) return;
      el.classList.toggle("is-on", aktiv);
      if (aktiv && animate) {
        this._animState.set(id, { type: "pulse", duration: 2.2 });
      } else {
        this._animState.delete(id);
      }
    };
    const stroemt = (ids, an, farbe) => {
      ids.forEach((id) => {
        const el = this._animEl(id);
        if (!el) return;
        const aktiv = animate && laeuft && an === true;
        el.classList.toggle("is-on", aktiv);
        if (farbe) el.style.stroke = farbe;
        if (aktiv) {
          const isRev = el.classList.contains("rev");
          this._animState.set(id, { type: "flow", reverse: isRev });
        } else {
          this._animState.delete(id);
          el.setAttribute("stroke-dashoffset", "0");
        }
      });
    };
    const pflicht = [
      "outside_temp",
      "compressor",
      "flow_temp",
      "return_temp",
      "buffer_temp",
      "dhw_temp"
    ];
    const gefunden = pflicht.filter((k) => {
      const id = this._e(k);
      return id && hass.states[id] !== void 0;
    }).length;
    const hinweis = this._animEl("hinweis");
    if (hinweis) {
      hinweis.hidden = gefunden > 0 || this._config.demo === true;
      if (gefunden === 0) {
        hinweis.textContent = this._t("s_keine_ent");
      }
    }
    const err = rawState(hass, this._e("error"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    const stoerung = err !== null && !harmlos.includes(err);
    const alertEl = this._animEl("alert");
    if (alertEl) {
      alertEl.hidden = !stoerung;
      if (stoerung) alertEl.textContent = tf(this._t("s_stoerung"), { v: err });
    }
    const outside = numState(hass, this._e("outside_temp"));
    const oMin = Number(this._config.outdoor_min);
    const oMax = Number(this._config.outdoor_max);
    const outColor = thermalColor(outside, oMin, oMax);
    set("outside-v", outside === null ? "--" : `${fmt(outside)} \xB0C`);
    const aussenEl = this._animEl("outside-v");
    if (aussenEl) aussenEl.style.fill = outColor;
    const comp = numState(hass, this._e("compressor"));
    set("comp-v", comp === null ? "--" : `${fmt(comp, 0)} Hz`);
    const compEl = this._animEl("comp-v");
    if (compEl) compEl.style.fill = loadColor(comp, COMP_MIN_HZ, COMP_MAX_HZ);
    const anAus = (() => {
      const ausStatus = (feld) => {
        const id = this._e(feld);
        if (!id) return null;
        const roh = rawState(hass, id);
        if (roh === null || roh === "unknown" || roh === "unavailable") return null;
        return isOn(hass, id);
      };
      const ausTopic = ausStatus("heatpump_state");
      return ausTopic !== null ? ausTopic : ausStatus("power_state");
    })();
    const laeuft = anAus !== false;
    this._spin("fan1", numState(hass, this._e("fan1_rpm")), "fan1-rpm", this._t("r_upm"), 0, laeuft);
    if (this._config.fan_count === 2) {
      this._spin("fan2", numState(hass, this._e("fan2_rpm")), "fan2-rpm", this._t("r_upm"), 0, laeuft);
    }
    const glow = this._animEl("unit-glow");
    if (glow) {
      const glowStoerung = animate && stoerung;
      const glowBetrieb = animate && laeuft && comp !== null && comp > 0;
      const glowAn = glowStoerung || glowBetrieb;
      glow.setAttribute("stroke", glowStoerung ? "#EF4444" : "#22C55E");
      if (glowAn) {
        this._animState.set("unit-glow", {
          type: "pulse",
          duration: glowStoerung ? 1.2 : 2.6,
          min: 0.05,
          max: 1
        });
      } else {
        this._animState.delete("unit-glow");
        glow.setAttribute("opacity", "0");
      }
    }
    const sgGroup = this._animEl("sg-group");
    if (sgGroup) {
      const konfiguriert = Boolean(this._e("sg_k1")) && Boolean(this._e("sg_k2"));
      sgGroup.setAttribute("opacity", konfiguriert ? "1" : "0");
      if (konfiguriert) {
        const sg = this._sgMode();
        const info = SG_STATES[sg];
        const farbe = info ? info.farbe : NEUTRAL;
        set("sg-text", sg === null ? this._t("unbekannt") : this._t(info.kurz));
        const t2 = this._animEl("sg-text");
        if (t2) {
          const stil = farbe === "#C3D0E0" ? "var(--c-c3d0e0)" : farbe;
          t2.style.fill = stil;
          t2.style.color = stil;
        }
        for (let i = 1; i <= 4; i++) {
          const seg = this._animEl(`sg-seg-${i}`);
          if (!seg) continue;
          const aktiv = sg === i;
          seg.setAttribute("fill", aktiv ? farbe : "#3A4658");
          seg.setAttribute("height", aktiv ? "17" : "11");
          seg.setAttribute("y", aktiv ? "-3" : "0");
          seg.style.color = farbe;
          seg.classList.toggle("is-active", aktiv);
        }
      }
    }
    const leistung = numState(hass, this._e("power_now"));
    const energie = numState(hass, this._e("energy_today"));
    zeige("verbrauch-group", leistung !== null || energie !== null);
    set("power-now-v", leistung === null ? "--" : `${fmt(leistung / 1e3, 2)} kW`);
    let energieAnzeige = energie;
    if (this._config.energy_daily !== false && energie !== null) {
      this._ladeTagesstart();
      if (this._tagStart !== void 0 && energie >= this._tagStart) {
        energieAnzeige = energie - this._tagStart;
      }
    }
    set(
      "energy-today-v",
      energieAnzeige === null ? "--" : `${fmt(energieAnzeige, 1)} kWh`
    );
    const tagesWert = energieAnzeige !== null && energieAnzeige !== energie;
    set(
      "energy-label",
      this._config.label_energy ? this._config.label_energy : tagesWert ? this._t("s_verbrauch_heute") : this._t("s_zaehler")
    );
    const zirkId = this._e("circulation_pump");
    const zirkAn = isOn(hass, zirkId) === true;
    zeige("zirkulation-group", this._zeigtZirkulation(hass));
    set("zirk-v", !zirkId ? "--" : wertText(zirkAn ? "l\xE4uft" : "aus", this._sp()));
    set(
      "zirk-name",
      zirkId ? `${this._t("zirkulation")} \xB7 ${wertText(zirkAn ? "l\xE4uft" : "aus", this._sp())}` : this._t("zirkulation")
    );
    const zirkRotor = this._animEl("zirk-rotor");
    if (zirkRotor) {
      zirkRotor.classList.toggle("is-still", !zirkAn);
      if (zirkAn && animate && laeuft) {
        const da = this._animState.get("zirk-rotor");
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set(
          "zirk-rotor",
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 }
        );
      } else {
        this._animState.delete("zirk-rotor");
      }
    }
    const pv = numState(hass, this._e("pv_power"));
    zeige("pv-group", pv !== null);
    set("pv-v", pv === null ? "--" : `${fmt(pv / 1e3, 2)} kW`);
    const flow = numState(hass, this._e("flow_temp"));
    const ret = numState(hass, this._e("return_temp"));
    const buf = numState(hass, this._e("buffer_temp"));
    const dhw = numState(hass, this._e("dhw_temp"));
    set("unit-flow-v", flow === null ? "--" : `${fmt(flow)} \xB0C`);
    set("unit-ret-v", ret === null ? "--" : `${fmt(ret)} \xB0C`);
    paint("bg-top", col(buf));
    paint("bg-bottom", col(buf === null ? null : buf - 4));
    set("buf-v", buf === null ? "--" : `${fmt(buf)} \xB0C`);
    const wwLaeuft = this._ladtWarmwasser(hass);
    let bufSp = numState(hass, this._e("buffer_target"));
    if (wwLaeuft) {
      bufSp = this._letztesPufferZiel !== void 0 ? this._letztesPufferZiel : null;
    } else if (bufSp !== null) {
      this._letztesPufferZiel = bufSp;
    }
    set("buf-sp", bufSp === null ? "" : tf(this._t("s_ziel"), { v: fmt(bufSp, 0) }));
    const bDelta = numState(hass, this._e("buffer_delta"));
    set(
      "buf-delta",
      bDelta === null || bufSp === null ? "" : tf(this._t("s_laedt_ab"), { v: fmt(bufSp - Math.abs(bDelta), 0) })
    );
    void wwLaeuft;
    this._cop(hass, "cop_heating");
    const heizstabLaeuft = isOn(hass, this._e("heater_internal")) === true || isOn(hass, this._e("heater_external")) === true;
    abzeichen("roomheater-badge", heizstabLaeuft && !wwLaeuft);
    const dhwSp = numState(hass, this._e("dhw_setpoint"));
    paint("dhw-top", col(dhw));
    paint("dhw-bottom", col(dhw === null ? null : dhw - 6));
    set("dhw-v", dhw === null ? "--" : `${fmt(dhw)} \xB0C`);
    set("dhw-sp", dhwSp === null ? "" : tf(this._t("s_ziel"), { v: fmt(dhwSp, 0) }));
    this._cop(hass, "cop_dhw");
    this._tuerCopAuffrischen();
    const wDelta = numState(hass, this._e("dhw_heat_delta"));
    set(
      "dhw-delta",
      wDelta === null || dhwSp === null ? wDelta === null ? "" : "" : tf(this._t("s_laedt_ab"), { v: fmt(dhwSp - Math.abs(wDelta), 0) })
    );
    abzeichen("dhwheater-badge", heizstabLaeuft && wwLaeuft);
    const tuerKnopf = this._animEl("tuer-knopf");
    if (tuerKnopf) {
      tuerKnopf.style.display = this._config.show_door !== false && this._tuerFelder().length ? "" : "none";
    }
    const hilfeKnopf = this.shadowRoot.getElementById("hilfe-knopf");
    if (hilfeKnopf) hilfeKnopf.style.display = this._config.show_help === false ? "none" : "";
    this._speicherZeilen("buf");
    this._speicherZeilen("dhw");
    abzeichen("dhwforce-badge", isOn(hass, this._e("dhw_force_state")) === true);
    abzeichen("sterilization-badge", isOn(hass, this._e("sterilization_state")) === true);
    const pumpRpm = numState(hass, this._e("pump_speed"));
    const flowRate = numState(hass, this._e("pump_flow"));
    this._spin("pump-rotor", pumpRpm, "pump-v", this._t("r_upm"), PUMP_SECONDS, laeuft);
    this._blattFarbe("pump-blade", col(flow), laeuft && pumpRpm !== null && pumpRpm > 0);
    set("flow-v", flowRate === null ? "--" : `${fmt(flowRate)} l/min`);
    const flowEl = this._animEl("flow-v");
    const innen = Number(this._config.pipe_inner_mm) || 0;
    if (flowEl) {
      let farbe = "";
      let hinweis2 = "";
      if (innen > 0 && flowRate !== null && flowRate > 0) {
        const flaeche = Math.PI * Math.pow(innen / 2e3, 2);
        const v = flowRate / 6e4 / flaeche;
        hinweis2 = `${fmt(v, 2)} m/s`;
        if (v > 1) farbe = "#D62B2B";
        else if (v > 0.8) farbe = "#E0A62E";
        else farbe = "#46C07A";
      }
      flowEl.style.fill = farbe;
      if (hinweis2) flowEl.setAttribute("aria-label", `${flowEl.textContent} = ${hinweis2}`);
      else flowEl.removeAttribute("aria-label");
    }
    const bar = numState(hass, this._e("water_pressure"));
    zeige("press-group", bar !== null);
    if (bar !== null) {
      set("press-v", `${fmt(bar)} bar`);
      const druckOk = bar >= DRUCK_MIN && bar <= DRUCK_MAX;
      const druckfarbe = druckOk ? "#46C07A" : "#D62B2B";
      const needle = this._animEl("press-needle");
      if (needle) {
        needle.setAttribute("transform", `rotate(${-120 + 240 * clamp(bar / 4, 0, 1)})`);
        needle.setAttribute("stroke", druckfarbe);
      }
      const druckText = this._animEl("press-v");
      if (druckText) druckText.style.fill = druckfarbe;
      const zuNiedrig = bar < DRUCK_MIN;
      const warn = this._animEl("press-warn");
      if (warn) warn.setAttribute("opacity", zuNiedrig ? "1" : "0");
      if (zuNiedrig && animate) {
        this._animState.set("press-v", {
          type: "pulse",
          duration: 1.1,
          min: 0.15,
          max: 1
        });
        this._animState.set("press-warn", {
          type: "pulse",
          duration: 1.1,
          min: 0.15,
          max: 1
        });
      } else {
        this._animState.delete("press-v");
        this._animState.delete("press-warn");
        if (druckText) druckText.setAttribute("opacity", "1");
      }
    }
    const valveEntity = this._e("three_way_valve");
    const valveRoh = attr(hass, valveEntity, "beschreibung", null);
    const valveNum = numState(hass, valveEntity);
    const zuWarmwasser = this._ladtWarmwasser(hass);
    const abtaut = isOn(hass, this._e("defrost")) === true;
    const art = numState(hass, this._e("operating_mode"));
    const umfasst = {
      heizen: art === null ? true : [0, 2, 4, 6].includes(art),
      kuehlen: art === null ? false : [1, 5, 7, 8].includes(art),
      ww: art === null ? true : [3, 4, 5, 6, 8].includes(art),
      auto: art === null ? false : [2, 6, 7, 8].includes(art)
    };
    const arbeitet = laeuft && comp !== null && comp > 0;
    const blinkt = {
      betrieb: false,
      heizen: arbeitet && !zuWarmwasser && !umfasst.kuehlen && !abtaut,
      kuehlen: arbeitet && !zuWarmwasser && umfasst.kuehlen && !abtaut,
      ww: arbeitet && zuWarmwasser && !abtaut,
      auto: false,
      abtauen: abtaut
    };
    const modusFarben = {
      // Das Betriebssymbol zeigt nur, ob die Anlage eingeschaltet ist.
      // Es blinkt nie, was sie gerade tut sagen die uebrigen Symbole.
      betrieb: "#46C07A",
      heizen: "#E0762E",
      kuehlen: "#06A6C7",
      ww: "#F2B233",
      auto: "#C3D0E0",
      abtauen: "#3E9BE0"
    };
    const modusText = this._animEl("modus-text");
    if (modusText) {
      let txt = "";
      if (anAus === false) txt = wertText("Aus", this._sp());
      else if (abtaut) txt = this._t("r_abtauen");
      else if (art !== null && MODE_LABELS[art] !== void 0) txt = wertText(MODE_LABELS[art], this._sp());
      modusText.textContent = txt;
    }
    Object.keys(modusFarben).forEach((k) => {
      const el = this._animEl(`modus-${k}`);
      if (!el) return;
      const dabei = k === "betrieb" ? anAus === true : k === "abtauen" ? abtaut : umfasst[k];
      el.style.color = dabei ? modusFarben[k] : "var(--c-2e3847)";
      if (blinkt[k] && animate) {
        this._animState.set(`modus-${k}`, {
          type: "pulse",
          duration: 1.4,
          min: 0.3,
          max: 1
        });
      } else {
        this._animState.delete(`modus-${k}`);
        el.setAttribute("opacity", "1");
      }
    });
    let valveText = "--";
    if (valveRoh !== null && VALVE_LABELS[valveRoh] !== void 0) {
      valveText = wertText(VALVE_LABELS[valveRoh], this._sp());
    } else if (valveNum !== null) {
      valveText = this._t(zuWarmwasser ? "warmwasser" : "heizung");
    }
    set("valve-v", valveText);
    const bekannt = valveNum !== null;
    zeige("valve-arrow-heiz", bekannt && !zuWarmwasser);
    zeige("valve-arrow-ww", bekannt && zuWarmwasser);
    const pfeilfarbe = col(flow);
    ["valve-heiz-line", "valve-ww-line"].forEach((id) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("stroke", pfeilfarbe);
    });
    ["valve-heiz-head", "valve-ww-head"].forEach((id) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("fill", pfeilfarbe);
    });
    const zonen = numState(hass, this._e("zones_state"));
    const zone1 = zonen === null ? true : zonen === 0 || zonen === 2;
    const zone2 = zonen === null ? true : zonen === 1 || zonen === 2;
    const pufferDa = (() => {
      const v = numState(hass, this._e("buffer_installed"));
      return v === null ? true : v > 0;
    })();
    const wasserDa = (() => {
      const v = numState(hass, this._e("dhw_installed"));
      return v === null ? true : v > 0;
    })();
    const blende = (id, aktiv) => {
      const el = this._animEl(id);
      if (el) el.classList.toggle("is-inaktiv", !aktiv);
    };
    blende("hk1-rad", zone1);
    blende("hk2-rad", zone2);
    blende("buffer-group", pufferDa);
    blende("dhw-group", wasserDa);
    const foerdertPrimaer = pumpRpm !== null && pumpRpm > 0 || flowRate !== null && flowRate > 0;
    this._direkt = this._hatPuffer() ? null : { heizt: foerdertPrimaer && !zuWarmwasser, vl: col(flow), rl: col(ret) };
    const kreisLaeuft = [];
    for (let n = 1; n <= this._hkAnzahl(); n++) {
      kreisLaeuft.push(this._circuitUpdate(n, col, animate, buf, laeuft));
    }
    const sekundaer = kreisLaeuft.some(Boolean);
    const d = this._direkt;
    const farbeVL = d ? d.vl : col(buf);
    const farbeRL = d ? d.rl : col(buf);
    stroemt(["dots-sf-a"], sekundaer, farbeVL);
    stroemt(["dots-sr-a"], sekundaer, farbeRL);
    [2, 3, 4].forEach((k) => {
      const id = k === 2 ? "" : String(k);
      const dahinter = kreisLaeuft.slice(k - 1).some(Boolean);
      stroemt([`dots-sf-b${id}`], dahinter, farbeVL);
      stroemt([`dots-sr-b${id}`], dahinter, farbeRL);
    });
    const spalten = kreisLaeuft.length > 2 ? 2 : 1;
    const reihe1 = kreisLaeuft.slice(0, spalten).some(Boolean);
    const reihe2 = kreisLaeuft.slice(spalten).some(Boolean);
    stroemt(["dots-sf-z2"], reihe2, farbeVL);
    stroemt(["dots-sr-z1"], reihe1, farbeRL);
    stroemt(["dots-sr-z2"], reihe2, farbeRL);
    const primaer = pumpRpm !== null && pumpRpm > 0 || flowRate !== null && flowRate > 0;
    stroemt(["dots-vl-a"], primaer, col(flow));
    stroemt(["dots-heiz-vl"], primaer && !zuWarmwasser, col(flow));
    stroemt(["dots-ww-vl"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-rl-a"], primaer, col(ret));
    stroemt(["dots-heiz-rl"], primaer && !zuWarmwasser, col(ret));
    stroemt(["dots-ww-rl"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-buf"], primaer && !zuWarmwasser, col(flow));
    stroemt(["dots-buf2"], primaer && !zuWarmwasser, col(ret));
    stroemt(["dots-dhw"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-dhw2"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-zirk-h1", "dots-zirk-v", "dots-zirk-h2"], zirkAn, col(dhw));
    this._blattFarbe("zirk-blade", col(dhw), zirkAn && laeuft);
    const blasen = (id, wert, laedt) => {
      const g = this._animEl(id);
      if (!g || !g.children) return;
      const anteil = wert === null ? 0 : clamp((wert - min) / (max - min || 1), 0, 1);
      const sichtbar = animate && laeuft && laedt ? Math.round(anteil * BUBBLE_COUNT) : 0;
      Array.from(g.children).forEach((el, i) => {
        el.style.animationName = i < sichtbar ? "" : "none";
        if (i >= sichtbar && el.getAttribute("opacity") !== "0") {
          el.setAttribute("opacity", "0");
          el.removeAttribute("transform");
        }
      });
    };
    const quelleLaedt = this._quellenUpdate(col, animate, buf);
    blasen("buf-bubbles", buf, primaer && !zuWarmwasser || quelleLaedt);
    blasen("dhw-bubbles", dhw, primaer && zuWarmwasser);
    this._syncDialog();
  },
  /**
   * Kamin und Solarthermie: Temperatur, Pumpe, Fluss in den Puffer.
   * Liefert, ob gerade eine davon den Puffer laedt.
   */
  _quellenUpdate(col, animate, buf) {
    const hass = this._quelle;
    let laedt = false;
    ["kamin", "solar"].forEach((art) => {
      if (!this._animEl(`${art}-group`)) return;
      const temp = numState(hass, this._e(`${art}_temp`));
      const pumpe = isOn(hass, this._e(`${art}_pump`)) === true;
      const tEl = this._animEl(`${art}-v`);
      if (tEl) tEl.textContent = temp === null ? "--" : `${fmt(temp, 1)} \xB0C`;
      const pEl = this._animEl(`${art}-pump-v`);
      if (pEl) {
        pEl.textContent = this._e(`${art}_pump`) ? wertText(pumpe ? "l\xE4uft" : "aus", this._sp()) : "";
      }
      const grenze = Number(this._config[art === "kamin" ? "kamin_fire_temp" : "solar_sun_temp"]);
      const aktiv = temp !== null && temp >= (Number.isFinite(grenze) ? grenze : 30);
      if (art === "kamin") this._kaminFeuer(aktiv, animate);
      else this._solarSonne(aktiv, animate);
      this._blattFarbe(`${art}-blade`, col(temp), pumpe);
      const rotorId = `${art}-rotor`;
      const rotor = this._animEl(rotorId);
      if (rotor) {
        rotor.classList.remove("is-still");
        if (pumpe && animate) {
          const da = this._animState.get(rotorId);
          if (da && da.type === "spin") da.duration = PUMP_SECONDS;
          else this._animState.set(rotorId, { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
        } else {
          this._animState.delete(rotorId);
        }
      }
      [[`dots-${art}`, col(temp)], [`dots-${art}b`, col(buf)]].forEach(([id, farbe]) => {
        const el = this._animEl(id);
        if (!el) return;
        const aktiv2 = animate && pumpe;
        el.classList.toggle("is-on", aktiv2);
        el.style.stroke = farbe;
        if (aktiv2) this._animState.set(id, { type: "flow", reverse: false });
        else {
          this._animState.delete(id);
          el.setAttribute("stroke-dashoffset", "0");
        }
      });
      if (pumpe) laedt = true;
    });
    return laedt;
  },
  /** Feuer im Kamin: sichtbar ab der Grenze, lodert mit Animation. */
  _kaminFeuer(an, animate) {
    const sichtbar = (id, ja) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("opacity", ja ? "1" : "0");
    };
    sichtbar("kamin-schein", an);
    sichtbar("kamin-flamme", an);
    const feuer = this._animEl("kamin-feuer");
    const glut = this._animEl("kamin-glut");
    if (an && animate) {
      if (!this._animState.has("kamin-feuer")) this._animState.set("kamin-feuer", { type: "flacker" });
      this._animState.set("kamin-glut", { type: "pulse", duration: 1.7, min: 0.15, max: 0.45 });
    } else {
      this._animState.delete("kamin-feuer");
      this._animState.delete("kamin-glut");
      if (feuer) feuer.removeAttribute("transform");
      if (glut) glut.setAttribute("opacity", "0.3");
    }
  },
  _circuitUpdate(n, col, animate, buf, laeuft) {
    const hass = this._quelle;
    const water = numState(hass, this._e(`hk${n}_water`));
    const pumpOn = isOn(hass, this._e(`hk${n}_pump`)) === true;
    const set = (id, text) => {
      const el = this._animEl(id);
      if (el) el.textContent = text;
    };
    const paint = (id, color) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("stop-color", color);
    };
    paint(`rad${n}-top`, col(water));
    paint(`rad${n}-bottom`, col(water === null ? null : water - 6));
    set(`hk${n}-water-v`, water === null ? "--" : `${fmt(water, 1)} \xB0C`);
    const rotor = this._animEl(`hk${n}-rotor`);
    if (rotor) {
      rotor.classList.remove("is-still");
      this._blattFarbe(`hk${n}-blade`, col(buf), pumpOn && laeuft);
      const rotorId = `hk${n}-rotor`;
      if (pumpOn && animate && laeuft) {
        const da = this._animState.get(rotorId);
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set(
          rotorId,
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 }
        );
      } else {
        this._animState.delete(rotorId);
      }
    }
    set(`hk${n}-pump-v`, wertText(pumpOn ? "l\xE4uft" : "aus", this._sp()));
    const d = this._direkt;
    const kreisOffen = pumpOn || !this._e(`hk${n}_pump`);
    const fluss = d ? d.heizt && kreisOffen : laeuft && pumpOn;
    [`dots-hk${n}`, `dots-hk${n}b`].forEach((id, i) => {
      const el = this._animEl(id);
      if (!el) return;
      const aktiv = animate && fluss;
      el.classList.toggle("is-on", aktiv);
      el.style.stroke = d ? i === 0 ? d.vl : d.rl : col(buf);
      if (aktiv) {
        this._animState.set(id, { type: "flow", reverse: false });
      } else {
        this._animState.delete(id);
        el.setAttribute("stroke-dashoffset", "0");
      }
    });
    const waerme = this._animEl(`hk${n}-waerme`);
    if (waerme) {
      const sichtbar = fluss && laeuft !== false;
      if (sichtbar && animate) {
        this._animState.set(`hk${n}-waerme`, { type: "pulse", duration: 2.4, min: 0.25, max: 0.85 });
      } else {
        this._animState.delete(`hk${n}-waerme`);
        waerme.setAttribute("opacity", sichtbar ? "0.7" : "0");
      }
    }
    return d ? fluss : pumpOn;
  },
  /**
   * Dreht einen Rotor.
   * Ohne festeDauer richtet sich das Tempo nach der Drehzahl, das
   * passt zu den Lueftern. Pumpen bekommen eine feste, ruhige Dauer,
   * denn dort soll nur erkennbar sein, dass sie ueberhaupt foerdern.
   */
  _spin(rotorId, rpm, labelId, unit, festeDauer, erlaubt) {
    const label = this.shadowRoot.getElementById(labelId);
    if (label) label.textContent = rpm === null ? "--" : `${fmt(rpm, 0)} ${unit}`;
    const el = this.shadowRoot.getElementById(rotorId);
    if (!el) return;
    const animate = animationAn(this._config);
    if (rpm === null || rpm <= 0 || !animate || erlaubt === false) {
      el.classList.toggle("is-still", rpm === null || rpm <= 0);
      this._animState.delete(rotorId);
      return;
    }
    el.classList.remove("is-still");
    const duration = festeDauer ? festeDauer : clamp(900 / rpm, 0.25, 6);
    const vorhanden = this._animState.get(rotorId);
    if (vorhanden && vorhanden.type === "spin") {
      vorhanden.duration = duration;
    } else {
      this._animState.set(rotorId, { type: "spin", duration, winkel: 0 });
    }
  }
};

// src/karte/demo.js
var demoKarte = {
  /**
   * Baut einen vollstaendigen Satz erfundener Werte auf.
   * Im Demomodus ersetzt er die echten Entitaeten restlos. Es wird
   * nichts an die Waermepumpe gesendet, alle Bedienschritte aendern
   * nur diese Nachbildung.
   */
  _demoAufbauen() {
    const werte = {
      outside_temp: 8.5,
      heatpump_state: 1,
      compressor: 42,
      fan1_rpm: 640,
      fan2_rpm: 620,
      power_now: 1240,
      energy_today: 8.4,
      flow_temp: 39.2,
      return_temp: 33.1,
      pump_speed: 2400,
      pump_flow: 18.6,
      three_way_valve: 0,
      water_pressure: 1.8,
      defrost: 0,
      error: "0",
      buffer_temp: 38.4,
      buffer_target: 42,
      buffer_delta: 5,
      curve_t_high: 45,
      curve_t_low: 28,
      curve_o_high: 15,
      curve_o_low: -10,
      curve2_t_high: 38,
      curve2_t_low: 26,
      curve2_o_high: 15,
      curve2_o_low: -10,
      dhw_heat_delta: -8,
      room_heater: 0,
      buffer_installed: 1,
      hk1_water: 34.2,
      hk1_water_target: 36,
      hk1_pump: 1,
      hk1_setpoint: 36,
      hk2_water: 30.1,
      hk2_water_target: 32,
      hk2_pump: 0,
      hk2_setpoint: 32,
      zones_state: 2,
      dhw_temp: 48.3,
      dhw_setpoint: 50,
      dhw_heater: 0,
      dhw_installed: 1,
      dhw_force_state: 0,
      sterilization_state: 0,
      circulation_pump: 0,
      circ_switch: "off",
      pv_power: 3400,
      sg_k1: "off",
      sg_k2: "off",
      dhw_force: "off",
      force_sterilization: "off",
      force_defrost: "off",
      dhw_heater_switch: "off",
      room_heater_switch: "off",
      buffer_switch: "on",
      power_state: "on",
      hk1_switch: "on",
      hk2_switch: "off",
      operating_mode: 4,
      hk3_water: 32.8,
      hk3_pump: 1,
      hk3_switch: "on",
      hk4_water: 28.4,
      hk4_pump: 0,
      hk4_switch: "off",
      kamin_temp: 72.4,
      kamin_pump: 1,
      solar_temp: 41,
      solar_pump: 0,
      cop_heating: 4.3,
      cop_dhw: 3.1,
      heater_internal: 0,
      heater_external: 0,
      operating_hours: 1462,
      compressor_starts: 2381,
      room_heater_hours: 3,
      dhw_heater_hours: 11,
      holiday_mode: "off",
      main_schedule: "off",
      fault_reset: "unknown",
      heating_off_temp: 18,
      heater_on_temp: -8,
      heat_delta: 5,
      steril_temp: 65,
      steril_time: 10,
      pump_max_duty: 160
    };
    const states = {};
    Object.keys(werte).forEach((feld) => {
      const attrs = {};
      if (feld.endsWith("_setpoint")) {
        Object.assign(attrs, { min: 15, max: 65, step: 0.5 });
      }
      states[`demo.${feld}`] = { state: String(werte[feld]), attributes: attrs };
    });
    states["demo.mode_select"] = {
      state: "mode_4",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3", "mode_4", "mode_5", "mode_6"] }
    };
    states["demo.powerful_mode"] = {
      state: "mode_0",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] }
    };
    ["heating_control", "pump_flow_mode", "quiet_priority", "smart_dhw"].forEach((feld) => {
      states[`demo.${feld}`] = { state: "mode_0", attributes: { options: ["mode_0", "mode_1"] } };
    });
    states["demo.quiet_mode"] = {
      state: "mode_2",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] }
    };
    const karte = this;
    this._demo = {
      states,
      entities: {},
      // Nimmt Befehle entgegen und aendert nur die Nachbildung.
      callService(bereich, dienst, daten) {
        const id = daten.entity_id;
        if (!states[id]) return;
        if (dienst === "set_value") states[id].state = String(daten.value);
        else if (dienst === "select_option") states[id].state = daten.option;
        else if (dienst === "turn_on") states[id].state = "on";
        else if (dienst === "turn_off") states[id].state = "off";
        else if (dienst === "toggle") {
          states[id].state = states[id].state === "on" ? "off" : "on";
        }
        const feld = id.slice(5);
        const paar = DEMO_PAARE[feld];
        if (paar && states[`demo.${paar}`]) {
          const an = states[id].state === "on" || parseFloat(states[id].state) > 0;
          const zielIstSchalter = paar.endsWith("_switch") || paar.startsWith("force_") || paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
          states[`demo.${paar}`].state = zielIstSchalter ? an ? "on" : "off" : an ? "1" : "0";
        }
        karte._render();
      }
    };
  },
  /**
   * Setzt einen Wert der Nachbildung.
   * Schaltbefehl und Rueckmeldetopic gehoeren zusammen und werden
   * gemeinsam gesetzt. Sonst schaltet man im Demomodus etwas um,
   * ohne dass die zugehoerige Rueckmeldung folgt.
   */
  _demoSetze(feld, wert) {
    if (!this._demo) return;
    const setze = (name, w) => {
      const eintrag = this._demo.states[`demo.${name}`];
      if (eintrag) eintrag.state = String(w);
    };
    setze(feld, wert);
    const an = wert === "on" || parseFloat(wert) > 0;
    const paar = DEMO_PAARE[feld];
    if (paar) {
      const zielIstSchalter = paar.endsWith("_switch") || paar.startsWith("force_") || paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
      setze(paar, zielIstSchalter ? an ? "on" : "off" : an ? 1 : 0);
    }
    this._render();
  },
  /** Liest einen Wert der Nachbildung. */
  _demoLies(feld) {
    if (!this._demo) return null;
    const eintrag = this._demo.states[`demo.${feld}`];
    return eintrag ? eintrag.state : null;
  },
  /** Verdrahtet das Einstellfenster. */
  /** Baut die Bedienleiste des Demomodus. */
  _buildDemo() {
    const host = this.shadowRoot.getElementById("demo-leiste");
    if (!this._config.demo) {
      host.hidden = true;
      host.innerHTML = "";
      return;
    }
    host.hidden = false;
    const schalter = [
      ["power_state", "W\xE4rmepumpe"],
      ["hk1_pump", "Pumpe HK1"],
      ["hk2_pump", "Pumpe HK2"],
      ["heater_internal", "Heizstab l\xE4uft"],
      ["defrost", "Abtauung"],
      ["circulation_pump", "Zirkulation Status"],
      ["dhw_force_state", "Aufheizen"],
      ["sterilization_state", "Legionellenschutz"]
    ];
    const quellen = this._quellen();
    const hk = this._hkAnzahl();
    if (hk >= 3) schalter.splice(3, 0, ["hk3_pump", "Pumpe HK3"]);
    if (hk >= 4) schalter.splice(4, 0, ["hk4_pump", "Pumpe HK4"]);
    if (quellen.includes("kamin")) schalter.push(["kamin_pump", "Pumpe Kamin"]);
    if (quellen.includes("solar")) schalter.push(["solar_pump", "Pumpe Solarthermie"]);
    const regler = [
      ["pv_power", "PV Leistung", 0, 12e3],
      ["outside_temp", "Au\xDFen", -20, 40],
      ["flow_temp", "Vorlauf", 15, 70],
      ["return_temp", "R\xFCcklauf", 15, 70],
      ["buffer_temp", "Puffer", 15, 70],
      ["dhw_temp", "Warmwasser", 15, 70],
      ["hk1_water", "HK1 Wasser", 15, 60],
      ["hk2_water", "HK2 Wasser", 15, 60],
      ["compressor", "Verdichter", 0, 90],
      ["pump_flow", "Durchfluss", 0, 40]
    ];
    if (hk >= 3) regler.splice(8, 0, ["hk3_water", "HK3 Wasser", 15, 60]);
    if (hk >= 4) regler.splice(9, 0, ["hk4_water", "HK4 Wasser", 15, 60]);
    if (quellen.includes("kamin")) regler.push(["kamin_temp", "Kamin", 10, 90]);
    if (quellen.includes("solar")) regler.push(["solar_temp", "Solarthermie", 0, 90]);
    host.innerHTML = `
      <div class="lhc-demo-kopf">
        <span class="lhc-field-label">${this._t("e_demo")}</span>
        <span class="lhc-demo-hinweis">${this._t("r_demo_hinweis")}</span>
      </div>
      <div class="lhc-demo-reihe">
        ${schalter.map(([feld, text], i) => `<button type="button" class="lhc-demo-knopf" id="demo-s${i}" data-feld="${feld}">${escapeHtml(wertText(text, this._sp()))}</button>`).join("")}
        <button type="button" class="lhc-demo-knopf" id="demo-bereitschaft">${this._t("r_bereitschaft")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-ventil">${this._t("umschaltventil")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-sg">SG Ready</button>
        <button type="button" class="lhc-demo-knopf" id="demo-stoerung">${this._t("r_stoerung")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-zurueck">${this._t("r_zurueck")}</button>
      </div>
      <div class="lhc-demo-regler">
        ${regler.map(([feld, text, lo, hi]) => `
          <label class="lhc-demo-schieber">
            <span>${escapeHtml(wertText(text, this._sp()))} <b data-regler="${feld}">--</b></span>
            <input type="range" data-feld="${feld}" min="${lo}" max="${hi}" step="0.5">
          </label>`).join("")}
      </div>`;
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-feld]");
      if (!btn) return;
      const feld = btn.getAttribute("data-feld");
      const jetzt = this._demoLies(feld);
      const istAn = jetzt === "on" || parseFloat(jetzt) > 0;
      this._demoSetze(feld, istAn ? "off" : "on");
      this._syncDemo();
    });
    host.addEventListener("input", (e) => {
      const inp = e.target.closest("input[data-feld]");
      if (!inp) return;
      const feld = inp.getAttribute("data-feld");
      this._demoSetze(feld, inp.value);
      this._syncDemo();
    });
    this.shadowRoot.getElementById("demo-bereitschaft").addEventListener("click", () => {
      const arbeitetJetzt = parseFloat(this._demoLies("pump_flow")) > 0;
      if (arbeitetJetzt) {
        this._demoSetze("compressor", 0);
        this._demoSetze("fan1_rpm", 0);
        this._demoSetze("fan2_rpm", 0);
        this._demoSetze("pump_speed", 0);
        this._demoSetze("pump_flow", 0);
        this._demoSetze("power_now", 0);
        this._demoSetze("hk1_pump", 0);
        this._demoSetze("hk2_pump", 0);
        this._demoSetze("hk3_pump", 0);
        this._demoSetze("hk4_pump", 0);
        this._demoSetze("circulation_pump", 0);
      } else {
        this._demoSetze("compressor", 42);
        this._demoSetze("fan1_rpm", 640);
        this._demoSetze("fan2_rpm", 620);
        this._demoSetze("pump_speed", 2400);
        this._demoSetze("pump_flow", 18.6);
        this._demoSetze("power_now", 1240);
        this._demoSetze("hk1_pump", 1);
        this._demoSetze("hk2_pump", 0);
        this._demoSetze("hk3_pump", 1);
        this._demoSetze("hk4_pump", 0);
      }
      this._syncDemo();
    });
    this.shadowRoot.getElementById("demo-ventil").addEventListener("click", () => {
      this._demoSetze("three_way_valve", this._demoLies("three_way_valve") === "1" ? 0 : 1);
      this._syncDemo();
    });
    this.shadowRoot.getElementById("demo-sg").addEventListener("click", () => {
      const k1 = this._demoLies("sg_k1") === "on";
      const k2 = this._demoLies("sg_k2") === "on";
      const folge = [[false, false], [true, false], [false, true], [true, true]];
      const jetzt = folge.findIndex((f) => f[0] === k1 && f[1] === k2);
      const naechste = folge[(jetzt + 1) % folge.length];
      this._demoSetze("sg_k1", naechste[0] ? "on" : "off");
      this._demoSetze("sg_k2", naechste[1] ? "on" : "off");
      this._syncDemo();
    });
    this.shadowRoot.getElementById("demo-stoerung").addEventListener("click", () => {
      this._demoSetze("error", this._demoLies("error") === "0" ? "H76" : "0");
      this._syncDemo();
    });
    this.shadowRoot.getElementById("demo-zurueck").addEventListener("click", () => {
      this._demoAufbauen();
      this._buildDemo();
      this._render();
    });
    this._syncDemo();
  },
  /** Haelt die Bedienleiste des Demomodus auf Stand. */
  _syncDemo() {
    if (!this._config.demo || !this._demo) return;
    const felder = [
      "pv_power",
      "outside_temp",
      "flow_temp",
      "return_temp",
      "buffer_temp",
      "dhw_temp",
      "hk1_water",
      "hk2_water",
      "compressor",
      "pump_flow"
    ];
    felder.forEach((feld) => {
      const el = this.shadowRoot.querySelector(`input[data-feld="${feld}"]`);
      const anzeige = this.shadowRoot.querySelector(`b[data-regler="${feld}"]`);
      const wert = this._demoLies(feld);
      if (el && el.value !== wert) el.value = wert;
      if (anzeige) anzeige.textContent = wert;
    });
    const schalter = [
      "power_state",
      "hk1_pump",
      "hk2_pump",
      "heater_internal",
      "defrost",
      "circulation_pump",
      "dhw_force_state",
      "sterilization_state"
    ];
    schalter.forEach((feld, i) => {
      const el = this.shadowRoot.getElementById(`demo-s${i}`);
      if (!el) return;
      const w = this._demoLies(feld);
      el.classList.toggle("is-on", w === "on" || parseFloat(w) > 0);
    });
  }
};

// src/karte/diagramme.js
var DW = 640;
var DH = 200;
var SYMBOLE = {
  verbrauch: `<path d="M2 -9 L-5 1 H0 L-2 9 L5 -1 H0 Z" fill="currentColor"/>`,
  sg: `<rect x="-8" y="-6" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="-3.5" cy="0" r="2" fill="currentColor"/><circle cx="3.5" cy="0" r="2" fill="currentColor"/>`,
  temp: `<path d="M-2 -8 a2 2 0 0 1 4 0 V2.5 a4 4 0 1 1 -4 0 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
         <circle cx="0" cy="5.5" r="2" fill="currentColor"/>`
};
var diagrammeKarte = {
  /** Steht der Verlauf als Knopf statt dauerhaft in der Karte? */
  _verlaufAlsKnopf() {
    const v = this._config.show_history;
    return v !== true && v !== false;
  },
  /**
   * Drei Knoepfe nebeneinander, rechtsbuendig im Bereich x..x+breite.
   * Sie liegen im Bild und wachsen deshalb mit der Karte mit.
   */
  _diaKnoepfe(x, y, breite, untereinander) {
    if (!this._verlaufAlsKnopf()) return "";
    const arten = [
      ["verbrauch", this._t("verbrauch")],
      ["sg", "SG Ready"],
      ["temp", this._t("d_temperaturen")]
    ];
    const abstand = 10;
    const w = untereinander ? breite : (breite - abstand * (arten.length - 1)) / arten.length;
    return `<g id="dia-knoepfe">${arten.map(([art, text], i) => {
      const bx = untereinander ? x : x + i * (w + abstand);
      const by = untereinander ? y + i * (40 + abstand) : y;
      return `
        <g class="dia-knopf klickbar" data-dia="${art}" role="button" tabindex="0"
           aria-label="${escapeHtml(text)}">
          <rect x="${bx}" y="${by}" width="${w}" height="40" rx="20"
                fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
          <g transform="translate(${bx + 24} ${by + 20})" class="dia-symbol">${SYMBOLE[art]}</g>
          <text class="cap dia-text" x="${bx + 42}" y="${by + 21}" dominant-baseline="middle">${escapeHtml(text)}</text>
        </g>`;
    }).join("")}</g>`;
  },
  /** Fenster mit den drei Ansichten. Der Verbrauch nutzt den Verlaufsrahmen. */
  _diaDialogMarkup() {
    if (!this._verlaufAlsKnopf()) return "";
    const reiter = (art, text) => `<button type="button" data-reiter="${art}">${escapeHtml(text)}</button>`;
    return `
      <div class="lhc-dialog" id="dia-dialog" hidden>
        <div class="lhc-kurve-box lhc-dia-box" role="dialog" aria-modal="true" aria-labelledby="dia-titel">
          <div class="lhc-kurve-titel">
            <span id="dia-titel">--</span>
            <button type="button" class="lhc-dialog-close" id="dia-zu"
                    aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
          </div>
          <div class="lhc-hilfe-chips" id="dia-reiter">
            ${reiter("verbrauch", this._t("verbrauch"))}${reiter("sg", "SG Ready")}${reiter("temp", this._t("d_temperaturen"))}
          </div>
          <svg viewBox="0 0 ${DW} ${DH}" class="lhc-dia-svg" id="dia-svg" preserveAspectRatio="xMidYMid meet">
            <g id="dia-verbrauch">${this._verlaufRahmen(20, 6, DW - 40, DH - 12)}</g>
            <g id="dia-sg"></g>
            <g id="dia-temp"></g>
            <text class="value-sp verlauf-text" id="dia-leer" x="${DW / 2}" y="${DH / 2}"
                  text-anchor="middle" opacity="0">${escapeHtml(this._t("kein_verlauf"))}</text>
          </svg>
          <div class="lhc-dia-liste" id="dia-liste"></div>
        </div>
      </div>`;
  },
  /** Knoepfe und Fenster mit Bedienung versehen. Einmal nach dem Aufbau. */
  _diaEinrichten() {
    const sr = this.shadowRoot;
    const dlg = sr && sr.getElementById("dia-dialog");
    if (!dlg || dlg.dataset.fertig) return;
    dlg.dataset.fertig = "1";
    sr.querySelectorAll(".dia-knopf").forEach((k) => {
      const oeffne = (ev) => {
        ev.stopPropagation();
        this._oeffneDia(k.dataset.dia);
      };
      k.addEventListener("click", oeffne);
      k.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          oeffne(ev);
        }
      });
    });
    sr.querySelectorAll("#dia-reiter button").forEach((b) => {
      b.addEventListener("click", () => this._zeigeDia(b.dataset.reiter));
    });
    dlg.addEventListener("click", (ev) => {
      if (ev.target === dlg) this._schliesseDia();
    });
    dlg.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") this._schliesseDia();
    });
    const zu = sr.getElementById("dia-zu");
    if (zu) zu.addEventListener("click", () => this._schliesseDia());
  },
  _oeffneDia(art) {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (!dlg) return;
    dlg.hidden = false;
    this._zeigeDia(art);
    const box = dlg.querySelector(".lhc-dia-box");
    if (box) {
      box.setAttribute("tabindex", "-1");
      box.focus({ preventScroll: true });
    }
  },
  _schliesseDia() {
    const dlg = this.shadowRoot.getElementById("dia-dialog");
    if (dlg) dlg.hidden = true;
    this._diaArt = null;
  },
  /** Schaltet die Ansicht im Fenster um und zeichnet sie. */
  _zeigeDia(art) {
    const sr = this.shadowRoot;
    this._diaArt = art;
    const titel = {
      verbrauch: this._t("verbrauch_24"),
      sg: `SG Ready \xB7 ${this._t("d_24h")}`,
      temp: `${this._t("d_temperaturen")} \xB7 ${this._t("d_24h")}`
    };
    sr.getElementById("dia-titel").textContent = titel[art] || "";
    sr.querySelectorAll("#dia-reiter button").forEach(
      (b) => b.classList.toggle("aktiv", b.dataset.reiter === art)
    );
    ["verbrauch", "sg", "temp"].forEach((a) => {
      const g = sr.getElementById(`dia-${a}`);
      if (g) g.setAttribute("display", a === art ? "inline" : "none");
    });
    sr.getElementById("dia-liste").textContent = "";
    const hoch = art === "sg" ? 130 : DH;
    sr.getElementById("dia-svg").setAttribute("viewBox", `0 0 ${DW} ${hoch}`);
    sr.getElementById("dia-leer").setAttribute("y", String(hoch / 2));
    if (art === "verbrauch") {
      this._verlaufZeit = 0;
      this._holeVerlauf();
      this._diaLeer(!(this._verlauf && this._verlauf.length >= 2));
    } else if (art === "sg") {
      this._verlaufZeit = 0;
      this._holeVerlauf();
      this._zeichneDiaSg();
    } else if (art === "temp") {
      this._holeTemperaturen();
      this._zeichneDiaTemp();
    }
  },
  _diaLeer(leer) {
    const t2 = this.shadowRoot.getElementById("dia-leer");
    if (t2) t2.setAttribute("opacity", leer ? "1" : "0");
  },
  /** Wird nach jedem neuen Verlauf aufgerufen, damit das Fenster mitlaeuft. */
  _diaNachVerlauf() {
    if (this._diaArt === "verbrauch") this._diaLeer(!(this._verlauf && this._verlauf.length >= 2));
    if (this._diaArt === "sg") this._zeichneDiaSg();
  },
  /** SG Ready: breites Band ueber 24 Stunden und die Dauer je Zustand. */
  _zeichneDiaSg() {
    const sr = this.shadowRoot;
    const g = sr.getElementById("dia-sg");
    if (!g) return;
    const sgr = this._sgVerlauf;
    if (!sgr || !sgr.length) {
      g.innerHTML = "";
      this._diaLeer(true);
      return;
    }
    this._diaLeer(false);
    const t1 = Date.now();
    const t0 = t1 - 864e5;
    const links = 20;
    const rechts = DW - 20;
    const oben = 10;
    const hoehe = 70;
    const zuX = (t2) => links + (Math.min(Math.max(t2, t0), t1) - t0) / (t1 - t0) * (rechts - links);
    const dauer = { 1: 0, 2: 0, 3: 0, 4: 0 };
    let rects = "";
    sgr.forEach((e, i) => {
      const von = Math.max(e.t, t0);
      const bis = Math.min(i + 1 < sgr.length ? sgr[i + 1].t : t1, t1);
      if (bis <= von) return;
      dauer[e.stufe] = (dauer[e.stufe] || 0) + (bis - von);
      const info = SG_STATES[e.stufe];
      rects += `<rect x="${zuX(von).toFixed(1)}" y="${oben}" width="${Math.max(0.6, zuX(bis) - zuX(von)).toFixed(1)}"
                 height="${hoehe}" fill="${info ? info.farbe : "#55637A"}" opacity="0.9"/>`;
    });
    g.innerHTML = `
      <rect x="${links}" y="${oben}" width="${rechts - links}" height="${hoehe}" rx="6"
            fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
      ${rects}
      ${this._diaZeitachse(links, rechts, oben + hoehe + 22)}`;
    const liste = sr.getElementById("dia-liste");
    liste.innerHTML = [2, 3, 4, 1].map((s) => {
      const info = SG_STATES[s];
      const std = dauer[s] / 36e5;
      return `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${info.farbe}"></span>
          <span>${escapeHtml(this._t(info.lang))}</span><b>${fmt(std, 1)} h</b></div>`;
    }).join("");
  },
  /** Beschriftung der Zeitachse alle sechs Stunden mit Uhrzeit. */
  _diaZeitachse(links, rechts, y) {
    const t1 = Date.now();
    const t0 = t1 - 864e5;
    let out = "";
    for (let i = 0; i <= 4; i++) {
      const t2 = t0 + i * 864e5 / 4;
      const x = links + i / 4 * (rechts - links);
      const d = new Date(t2);
      const text = i === 4 ? this._t("jetzt") : `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const anker = i === 0 ? "start" : i === 4 ? "end" : "middle";
      out += `<text class="value-sp verlauf-text" x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}">${escapeHtml(text)}</text>`;
    }
    return out;
  },
  /** Holt Vorlauf, Ruecklauf und Aussentemperatur der letzten 24 Stunden. */
  _holeTemperaturen() {
    const jetzt = Date.now();
    if (this._tempZeit && jetzt - this._tempZeit < 3e5) return;
    this._tempZeit = jetzt;
    const felder = ["flow_temp", "return_temp", "outside_temp"];
    if (this._config.demo) {
      const reihen = {};
      felder.forEach((f, k) => {
        reihen[f] = [];
        for (let i = 0; i <= 96; i++) {
          const t2 = jetzt - 864e5 + i * 9e5;
          const basis = k === 0 ? 38 : k === 1 ? 32 : 6;
          const welle = k === 2 ? Math.sin(i / 96 * Math.PI * 2 - 1.8) * 4 : Math.sin(i / 5) * 3;
          reihen[f].push({ t: t2, v: basis + welle });
        }
      });
      this._tempVerlauf = reihen;
      this._zeichneDiaTemp();
      return;
    }
    const ids = felder.map((f) => this._e(f));
    if (!ids.some(Boolean) || !this._hass || typeof this._hass.callWS !== "function") {
      this._tempVerlauf = null;
      this._zeichneDiaTemp();
      return;
    }
    this._hass.callWS({
      type: "history/history_during_period",
      start_time: new Date(jetzt - 864e5).toISOString(),
      end_time: new Date(jetzt).toISOString(),
      entity_ids: ids.filter(Boolean),
      minimal_response: true,
      no_attributes: true
    }).then((antwort) => {
      const reihen = {};
      felder.forEach((f, i) => {
        const id = ids[i];
        reihen[f] = (antwort && id && antwort[id] || []).map((p) => ({
          t: p.lu ? p.lu * 1e3 : Date.parse(p.last_changed),
          v: parseFloat(p.s !== void 0 ? p.s : p.state)
        })).filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
      });
      this._tempVerlauf = reihen;
      this._zeichneDiaTemp();
    }).catch(() => {
      this._tempVerlauf = null;
      this._zeichneDiaTemp();
    });
  },
  /** Drei Linien in einem gemeinsamen Massstab. */
  _zeichneDiaTemp() {
    const sr = this.shadowRoot;
    const g = sr && sr.getElementById("dia-temp");
    if (!g || this._diaArt !== "temp") return;
    const reihen = this._tempVerlauf || {};
    const arten = [
      ["flow_temp", "#FF5F52", this._t("vorlauf")],
      ["return_temp", "#4D9BFF", this._t("ruecklauf")],
      ["outside_temp", "#9FB3C8", this._t("aussentemperatur")]
    ].filter(([f]) => (reihen[f] || []).length >= 2);
    if (!arten.length) {
      g.innerHTML = "";
      this._diaLeer(true);
      return;
    }
    this._diaLeer(false);
    const alle = arten.flatMap(([f]) => reihen[f].map((p) => p.v));
    const roh = (Math.max(...alle) - Math.min(...alle)) / 4;
    const schritt = roh <= 5 ? 5 : roh <= 10 ? 10 : 20;
    const min = Math.floor(Math.min(...alle) / schritt) * schritt;
    let max = Math.ceil(Math.max(...alle) / schritt) * schritt;
    if (max - min < schritt * 2) max = min + schritt * 2;
    const t1 = Date.now();
    const t0 = t1 - 864e5;
    const links = 56;
    const rechts = DW - 20;
    const oben = 16;
    const unten = DH - 40;
    const px = (t2) => links + (Math.min(Math.max(t2, t0), t1) - t0) / (t1 - t0) * (rechts - links);
    const py = (v) => unten - (v - min) / (max - min) * (unten - oben);
    let raster = "";
    for (let v = min; v <= max; v += schritt) {
      const y = py(v).toFixed(1);
      raster += `<line x1="${links}" y1="${y}" x2="${rechts}" y2="${y}" stroke="#2A3446" stroke-width="1"/>
        <text class="value-sp verlauf-text" x="${links - 8}" y="${y}" text-anchor="end" dominant-baseline="middle">${fmt(v, 0)}\xB0</text>`;
    }
    const linien = arten.map(([f, farbe]) => {
      const pkt = reihen[f].filter((p) => p.t >= t0);
      const d = pkt.map(
        (p, i) => i ? `H${px(p.t).toFixed(1)}V${py(p.v).toFixed(1)}` : `M${px(p.t).toFixed(1)} ${py(p.v).toFixed(1)}`
      ).join("") + (pkt.length ? `H${rechts}` : "");
      return `<path d="${d}" fill="none" stroke="${farbe}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    }).join("");
    g.innerHTML = `${raster}${linien}${this._diaZeitachse(links, rechts, DH - 12)}`;
    sr.getElementById("dia-liste").innerHTML = arten.map(([f, farbe, name]) => {
      const werte = reihen[f].map((p) => p.v);
      const jetzt = werte[werte.length - 1];
      return `<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe}"></span>
          <span>${escapeHtml(name)}</span>
          <b>${fmt(jetzt, 1)} \xB0C</b>
          <em>${fmt(Math.min(...werte), 1)} \u2026 ${fmt(Math.max(...werte), 1)} \xB0C</em></div>`;
    }).join("");
  }
};

// src/karte/dialog.js
var dialogKarte = {
  _buildDialog() {
    const sr = this.shadowRoot;
    sr.getElementById("dialog").hidden = true;
    this._dialogKey = null;
    const range = sr.getElementById("dlg-range");
    const out = sr.getElementById("dlg-value");
    const schreiben = (wert, entitaet) => {
      const id = entitaet || this._e(this._dialogKey);
      if (!id || !stellbar(id)) return;
      this._offen = null;
      if (this._offenTimer) {
        clearTimeout(this._offenTimer);
        this._offenTimer = null;
      }
      this._halte("dialog", wert);
      this._quelle.callService(id.split(".")[0], "set_value", {
        entity_id: id,
        value: wert
      });
    };
    this._schreibeDialog = schreiben;
    const schritt = (richtung) => {
      const neu = Math.round(
        (Number(range.value) + richtung * Number(range.step || 1)) * 10
      ) / 10;
      const begrenzt = clamp(neu, Number(range.min), Number(range.max));
      if (begrenzt === Number(range.value)) return;
      range.value = begrenzt;
      out.textContent = this._dlgText(begrenzt);
      schreiben(begrenzt);
    };
    range.addEventListener("input", () => {
      this._dialogZieht = true;
      out.textContent = this._dlgText(parseFloat(range.value));
      this._offen = {
        wert: parseFloat(range.value),
        entitaet: this._e(this._dialogKey)
      };
      if (this._offenTimer) clearTimeout(this._offenTimer);
      this._offenTimer = setTimeout(() => {
        if (this._offen) schreiben(this._offen.wert, this._offen.entitaet);
      }, 600);
    });
    range.addEventListener("change", () => {
      this._dialogZieht = false;
      schreiben(parseFloat(range.value), this._e(this._dialogKey));
    });
    sr.getElementById("dlg-minus").addEventListener("click", () => schritt(-1));
    sr.getElementById("dlg-plus").addEventListener("click", () => schritt(1));
    sr.getElementById("dlg-close").addEventListener("click", () => this._schliesseDialog());
    sr.getElementById("dialog").addEventListener("click", (ev) => {
      if (ev.target && ev.target.id === "dialog") this._schliesseDialog();
    });
  },
  /** Macht Speicher und Heizkörper anklickbar. */
  _buildKlicks() {
    const sr = this.shadowRoot;
    const fenster = [
      {
        gruppe: "unit-group",
        titel: "f_waermepumpe",
        werte: [],
        aktionen: [
          { feld: "power_state", status: "heatpump_state", typ: "schalter", an: "f_laeuft_aus", aus: "f_einschalten" },
          { feld: "force_defrost", status: "defrost", typ: "schalter", an: "f_abtauen_ende", aus: "f_abtauen_start" },
          { feld: "powerful_mode", typ: "auswahl", titel: "f_turbomodus", texte: POWERFUL_LABELS },
          { feld: "quiet_mode", typ: "auswahl", titel: "f_leisemodus", texte: QUIET_LABELS },
          { feld: "mode_select", typ: "auswahl", titel: "f_betriebsart", texte: MODE_LABELS }
        ]
      },
      {
        gruppe: "buffer-group",
        beschriftung: "label_buffer",
        werte: ["buffer_temp", "room_heater"],
        aktionen: [
          { feld: "buffer_switch", status: "buffer_installed", typ: "schalter", an: "f_puffer_aus", aus: "f_puffer_an" },
          { feld: "room_heater_switch", status: "room_heater", typ: "schalter", an: "f_hz_heizstab_ende", aus: "f_hz_heizstab_start" },
          { feld: "buffer_delta", typ: "zahl", befehl: "SetBufferDelta", titel: "f_laedt_ab", bezug: "buffer_target", vorzeichen: -1, min: 0, max: 10, schritt: 1 }
        ]
      },
      {
        gruppe: "dhw-group",
        feld: "dhw_setpoint",
        beschriftung: "label_dhw",
        werte: ["dhw_temp", "dhw_heater"],
        aktionen: [
          { feld: "dhw_force", status: "dhw_force_state", typ: "schalter", schmal: true, an: "f_aufheizen_ende", aus: "f_aufheizen_start" },
          { feld: "force_sterilization", status: "sterilization_state", typ: "schalter", schmal: true, an: "f_legionellen_ende", aus: "f_legionellen_start" },
          { feld: "dhw_heater_switch", status: "dhw_heater", typ: "schalter", schmal: true, an: "f_heizstab_aus", aus: "f_heizstab_an" },
          { feld: "dhw_heat_delta", typ: "zahl", befehl: "SetDHWHeatDelta", titel: "f_laedt_ab", bezug: "dhw_setpoint", vorzeichen: 1, min: -12, max: -2, schritt: 1 }
        ]
      },
      {
        gruppe: "hk1-group",
        feld: "hk1_setpoint",
        beschriftung: "label_hk1",
        werte: ["hk1_water"],
        anzeige: "hk1_water_target",
        aktionen: [
          { feld: "zones_select", typ: "zone", nummer: 1, schmal: true },
          { feld: "hk1_switch", typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" },
          { typ: "kurveknopf", zone: 1, schmal: true, titel: "f_heizkurve_zeigen" }
        ]
      },
      {
        gruppe: "hk2-group",
        feld: "hk2_setpoint",
        beschriftung: "label_hk2",
        werte: ["hk2_water"],
        anzeige: "hk2_water_target",
        aktionen: [
          { feld: "zones_select", typ: "zone", nummer: 2, schmal: true },
          { feld: "hk2_switch", typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" },
          { typ: "kurveknopf", zone: 2, schmal: true, titel: "f_heizkurve_zeigen" }
        ]
      },
      // HK3 und HK4 haben keine Zone der Waermepumpe, nur eigene Entitaeten.
      ...[3, 4].map((n) => ({
        gruppe: `hk${n}-group`,
        beschriftung: `label_hk${n}`,
        werte: [`hk${n}_water`, `hk${n}_pump`],
        aktionen: [
          { feld: `hk${n}_switch`, typ: "schalter", schmal: true, an: "f_kreis_aus", aus: "f_kreis_an" }
        ]
      }))
    ];
    fenster.forEach((f) => {
      const el = sr.getElementById(f.gruppe);
      if (!el) return;
      const hatTemperatur = Boolean(f.feld && this._e(f.feld));
      const hatAktion = (f.aktionen || []).some(
        (a) => this._e(a.feld)
      );
      const hatWerte = !this._config.demo && (f.werte || []).some((key) => this._e(key));
      if (!hatTemperatur && !hatAktion && !hatWerte) return;
      el.classList.add("klickbar");
      el.addEventListener("click", () => this._oeffneDialog(f));
    });
    if (!this._config.demo) {
      const anzeigen = {
        "outside-v": "outside_temp",
        "comp-v": "compressor",
        "fan1-rpm": "fan1_rpm",
        "fan2-rpm": "fan2_rpm",
        "power-now-v": "power_now",
        "energy-today-v": "energy_today",
        "unit-flow-v": "flow_temp",
        "unit-ret-v": "return_temp",
        "pump-v": "pump_speed",
        "flow-v": "pump_flow",
        "press-v": "water_pressure",
        "valve-v": "three_way_valve",
        "pv-v": "pv_power",
        "buf-v": "buffer_temp",
        "dhw-v": "dhw_temp",
        "zirk-v": "circulation_pump",
        "zirk-name": "circulation_pump",
        "hk1-water-v": "hk1_water",
        "hk1-pump-v": "hk1_pump",
        "hk2-water-v": "hk2_water",
        "hk2-pump-v": "hk2_pump",
        "hk3-water-v": "hk3_water",
        "hk3-pump-v": "hk3_pump",
        "hk4-water-v": "hk4_water",
        "hk4-pump-v": "hk4_pump",
        "kamin-v": "kamin_temp",
        "kamin-pump-v": "kamin_pump",
        "solar-v": "solar_temp",
        "solar-pump-v": "solar_pump"
      };
      Object.entries(anzeigen).forEach(([id, feld]) => {
        const el = sr.getElementById(id);
        if (!el || !this._e(feld)) return;
        el.classList.add("klickbar");
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          this._mehrInfo(this._e(feld));
        });
      });
    }
    const zirkEl = sr.getElementById("zirkulation-group");
    if (zirkEl && this._e("circ_switch")) {
      zirkEl.classList.add("klickbar");
      zirkEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._schaltCircSwitch();
      });
    }
  },
  _schaltCircSwitch() {
    const switchId = this._e("circ_switch");
    if (!switchId) return;
    const state = this._hass.states[switchId];
    const currentState = state ? state.state : "off";
    const newState = currentState === "on" ? "off" : "on";
    this._hass.callService("homeassistant", "turn_" + newState, {
      entity_id: switchId
    });
  },
  _oeffneDialog(f) {
    const sr = this.shadowRoot;
    const tempId = f.feld ? this._e(f.feld) : "";
    this._dialogKey = tempId && this._quelle.states[tempId] ? f.feld : null;
    this._dialogAnzeige = f.anzeige || null;
    this._dialogAktionen = (f.aktionen || []).filter(
      (a) => !a.feld ? true : Boolean(this._e(a.feld))
    );
    this._dialogGruppen = f.werte || [];
    if (this._gehalten) delete this._gehalten["dialog"];
    sr.getElementById("dlg-title").textContent = f.titel && this._t(f.titel) || this._name(f.beschriftung) || this._t("f_einstellen");
    const reglerFeld = sr.getElementById("dlg-temp");
    reglerFeld.hidden = !this._dialogKey;
    const reglerKann = this._dialogKey && stellbar(this._e(this._dialogKey));
    reglerFeld.classList.toggle("nur-lesbar", !reglerKann);
    sr.querySelectorAll("#dlg-temp input, #dlg-temp button").forEach((e) => {
      e.disabled = !reglerKann;
    });
    this._baueAktionen();
    this._baueWerte();
    sr.getElementById("dialog").hidden = false;
    this._syncDialog();
    this._syncDemo();
  },
  /**
   * Ermittelt den Zustand eines Bedienelements.
   * Die Statusquelle hat Vorrang, denn ein Schaltbefehl meldet seinen
   * Zustand nicht immer zurueck. Liefert sie nichts, gilt der Schalter.
   * Rueckgabe null, wenn beides unbekannt ist.
   */
  _zustand(a) {
    const pruefe = (feld) => {
      if (!feld) return null;
      const id = this._e(feld);
      if (!id) return null;
      const roh = rawState(this._quelle, id);
      if (roh === null || roh === "unknown" || roh === "unavailable") return null;
      return isOn(this._quelle, id);
    };
    const ausStatus = pruefe(a.status);
    if (ausStatus !== null) return ausStatus;
    return pruefe(a.feld);
  },
  /** Baut die Bedienelemente des offenen Fensters auf. */
  /**
   * Oeffnet das Verlaufsfenster von Home Assistant zu einer Entitaet.
   * Das Frontend lauscht auf hass-more-info und erwartet die Kennung
   * im Feld entityId. Das Ereignis muss die Schattengrenze verlassen
   * duerfen, daher bubbles und composed.
   */
  _mehrInfo(entityId) {
    if (!entityId) return;
    const ev = new Event("hass-more-info", { bubbles: true, composed: true });
    ev.detail = { entityId };
    this.dispatchEvent(ev);
  },
  /**
   * Listet unter den Schaltflaechen alle Entitaeten der Baugruppe auf.
   * Ein Klick oeffnet den Verlauf von Home Assistant.
   */
  _baueWerte() {
    const host = this.shadowRoot.getElementById("dlg-werte");
    if (!host) return;
    const gruppen = this._dialogGruppen || [];
    const felder = this._config.demo ? [] : gruppen.map((key) => ENTITY_FIELDS.find((f) => f.key === key)).filter((f) => f && this._quelle.states[this._e(f.key)]);
    if (!felder.length) {
      host.innerHTML = "";
      return;
    }
    host.innerHTML = `<div class="lhc-field-label">${escapeHtml(this._t("r_verlauf_zeigen"))}</div>` + felder.map(
      (f, i) => `<button type="button" class="lhc-wert" id="dlg-w${i}">
               <span>${escapeHtml(feldText(f, this._sp()))}</span>
               <b id="dlg-w${i}-v"></b>
             </button>`
    ).join("");
    felder.forEach((f, i) => {
      const el = this.shadowRoot.getElementById(`dlg-w${i}`);
      const wert = this.shadowRoot.getElementById(`dlg-w${i}-v`);
      const id = this._e(f.key);
      const st = this._quelle.states[id];
      if (wert && st) {
        const rohEinheit = st.attributes && st.attributes.unit_of_measurement || "";
        const einheit = rohEinheit === "K" ? "\xB0C" : rohEinheit;
        const zahl = parseFloat(st.state);
        let text = st.state;
        if (!Number.isNaN(zahl) && /^[-\d.,\s]+$/.test(st.state)) {
          const stellen = ["\xB0C", "bar"].includes(einheit) ? 1 : 0;
          text = zahl.toFixed(stellen).replace(".", DEZIMAL);
        }
        wert.textContent = einheit ? `${text} ${einheit}` : text;
      }
      if (el) el.addEventListener("click", () => this._mehrInfo(id));
    });
  },
  _baueAktionen() {
    const host = this.shadowRoot.getElementById("dlg-actions");
    const liste = this._dialogAktionen || [];
    host.innerHTML = liste.map(
      (a, i) => a.typ === "auswahl" ? `<label class="lhc-dialog-select">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <select id="dlg-a${i}"></select>
             </label>` : a.typ === "kurveknopf" ? `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">${escapeHtml(this._t(a.titel))}</button>` : a.typ === "zahl" ? `<div class="lhc-num-kompakt">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-minus"
                       aria-label="${this._t("s_kleiner")}">&minus;</button>
               <output id="dlg-a${i}">--</output>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-plus"
                       aria-label="${this._t("s_groesser")}">+</button>
             </div>` : `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">--</button>`
    ).join("");
    liste.forEach((a, i) => {
      const el = this.shadowRoot.getElementById(`dlg-a${i}`);
      if (!el) return;
      if (a.typ === "auswahl") {
        el.addEventListener("change", () => {
          const id = this._e(a.feld);
          this._quelle.callService("select", "select_option", {
            entity_id: id,
            option: el.value
          });
        });
      } else if (a.typ === "kurveknopf") {
        const k = this.shadowRoot.getElementById(`dlg-a${i}`);
        if (k) {
          k.addEventListener("click", () => {
            this.shadowRoot.getElementById("dialog").hidden = true;
            this._oeffneKurve(a.zone || 1);
          });
        }
      } else if (a.typ === "zahl") {
        const stelle = (richtung) => {
          const feld = a.feld;
          const id = this._e(feld);
          if (!id) return;
          const kannEntitaet = stellbar(id);
          if (!kannEntitaet && !a.befehl) return;
          const ist = numState(this._quelle, id);
          const gehalten = this._gehaltenerWert(id, ist);
          const jetzt = gehalten !== null ? gehalten : ist;
          if (jetzt === null) return;
          const schritt = a.schritt || 1;
          const neu = clamp(
            Math.round((jetzt + richtung * (a.vorzeichen || 1) * schritt) * 10) / 10,
            a.min,
            a.max
          );
          if (neu === jetzt) return;
          this._halte(id, neu);
          if (kannEntitaet) {
            this._quelle.callService(id.split(".")[0], "set_value", {
              entity_id: id,
              value: neu
            });
            this._syncAktionen();
            return;
          }
          const praefix = this._config.mqtt_prefix || "panasonic_heat_pump";
          const nutzlast = String(neu);
          this._quelle.callService("mqtt", "publish", {
            topic: `${praefix}/commands/${a.befehl}`,
            payload: nutzlast
          });
          this._syncAktionen();
        };
        const minus = this.shadowRoot.getElementById(`dlg-a${i}-minus`);
        const plus = this.shadowRoot.getElementById(`dlg-a${i}-plus`);
        if (minus) minus.addEventListener("click", () => stelle(-1));
        if (plus) plus.addEventListener("click", () => stelle(1));
      } else if (a.typ === "zone") {
        el.addEventListener("click", () => this._zoneSchalten(a.nummer));
      } else {
        el.addEventListener("click", () => {
          const id = this._e(a.feld);
          const an = this._zustand(a);
          this._quelle.callService("homeassistant", an === true ? "turn_off" : "turn_on", {
            entity_id: id
          });
        });
      }
    });
  },
  /** Haelt die Bedienelemente auf dem aktuellen Stand. */
  _syncAktionen() {
    const liste = this._dialogAktionen || [];
    const farbeSetzen = (el, zustand) => {
      el.classList.toggle("is-an", zustand === true);
      el.classList.toggle("is-aus", zustand === false);
    };
    liste.forEach((a, i) => {
      const el = this.shadowRoot.getElementById(`dlg-a${i}`);
      const st = this._quelle.states[this._e(a.feld)];
      if (!el) return;
      if (a.typ === "kurveknopf") return;
      if (a.typ !== "zone" && !st) return;
      if (a.typ === "zahl") {
        const feldName = a.feld;
        const kann = stellbar(this._e(feldName)) || Boolean(a.befehl);
        [`dlg-a${i}-minus`, `dlg-a${i}-plus`].forEach((kid) => {
          const k = this.shadowRoot.getElementById(kid);
          if (k) k.disabled = !kann;
        });
        const beschriftung = el.parentElement ? el.parentElement.querySelector(".lhc-field-label") : null;
        if (beschriftung) {
          const hinweis = this._t("f_nur_lesbar");
          const rein = beschriftung.textContent.replace(hinweis, "");
          beschriftung.textContent = kann ? rein : rein + hinweis;
        }
        const idFeld = this._e(feldName);
        const istWert = numState(this._quelle, idFeld);
        const gehalten = this._gehaltenerWert(idFeld, istWert);
        const roh = gehalten !== null ? gehalten : istWert;
        const ziel = a.bezug ? numState(this._quelle, this._e(a.bezug)) : null;
        el.textContent = roh === null ? "--" : ziel === null ? `${fmt(roh, 0)} ${a.einheit || "\xB0C"}` : `${fmt(ziel - Math.abs(roh), 0)} \xB0C`;
        return;
      }
      if (a.typ === "auswahl") {
        const optionen = st.attributes.options || [];
        const kennung = optionen.join("|");
        if (el.dataset.kennung !== kennung) {
          el.innerHTML = optionen.map(
            (o) => `<option value="${escapeHtml(o)}">${escapeHtml(
              a.texte[o] !== void 0 ? wertText(a.texte[o], this._sp()) : o
            )}</option>`
          ).join("");
          el.dataset.kennung = kennung;
        }
        if (el.value !== st.state) el.value = st.state;
      } else if (a.typ === "zone") {
        const aktiv = this._zoneAktiv(a.nummer);
        const andere = this._zoneAktiv(a.nummer === 1 ? 2 : 1);
        el.textContent = aktiv === null ? this._t("r_zonen_unbekannt") : aktiv ? this._t("f_zone_aus") : this._t("f_zone_an");
        el.disabled = aktiv === true && andere !== true;
        if (el.disabled) el.textContent = this._t("r_einziger_kreis");
        farbeSetzen(el, el.disabled ? null : aktiv);
      } else {
        const an = this._zustand(a);
        el.textContent = an === null ? `${this._t(a.aus)} (${this._t("unbekannt")})` : this._t(an ? a.an : a.aus);
        farbeSetzen(el, an);
      }
    });
  },
  _schliesseDialog() {
    if (this._offen && this._schreibeDialog) {
      this._schreibeDialog(this._offen.wert, this._offen.entitaet);
    }
    this._offen = null;
    if (this._offenTimer) {
      clearTimeout(this._offenTimer);
      this._offenTimer = null;
    }
    this._dialogKey = null;
    this._dialogAnzeige = null;
    this._dialogAktionen = null;
    this._dialogZieht = false;
    this.shadowRoot.getElementById("dialog").hidden = true;
  },
  /** Haelt das offene Fenster auf dem aktuellen Stand. */
  _syncDialog() {
    if (this.shadowRoot.getElementById("dialog").hidden) return;
    this._syncAktionen();
    if (!this._dialogKey) return;
    const sr = this.shadowRoot;
    const st = this._quelle.states[this._e(this._dialogKey)];
    if (!st) return this._schliesseDialog();
    const range = sr.getElementById("dlg-range");
    const a = st.attributes || {};
    const wert = parseFloat(st.state);
    if (Number.isNaN(wert)) return;
    let lo = Number(a.min !== void 0 ? a.min : 15);
    let hi = Number(a.max !== void 0 ? a.max : 65);
    const modus = a.modus === void 0 || a.modus === null ? null : Number(a.modus);
    let versch = false;
    if (this._dialogAnzeige) {
      if (modus === 0) versch = true;
      else if (modus === null && lo >= -5 && hi <= 5 && lo < 0) versch = true;
      else if (modus === null && lo <= -5 && hi >= 20) {
        versch = wert >= -5 && wert <= 5;
      }
      if (versch) {
        lo = Math.max(lo, -5);
        hi = Math.min(hi, 5);
      } else if (lo <= -5 && hi >= 20) {
        lo = 20;
      }
    }
    this._dialogEinheit = versch ? "K" : "\xB0C";
    range.min = lo;
    range.max = hi;
    range.step = Number(a.step !== void 0 ? a.step : 1);
    sr.getElementById("dlg-min").textContent = this._dlgText(lo);
    sr.getElementById("dlg-max").textContent = this._dlgText(hi);
    let hinweis = "";
    if (versch) {
      const ziel = numState(this._quelle, this._e(this._dialogAnzeige));
      hinweis = this._t("s_versch") + (ziel === null ? "" : ` \xB7 ${tf(this._t("s_ziel"), { v: fmt(ziel, 0) })}`);
    }
    sr.getElementById("dlg-hinweis").textContent = hinweis;
    if (this._dialogZieht) return;
    const gehalten = this._gehaltenerWert("dialog", wert);
    const zeigen = clamp(gehalten !== null ? gehalten : wert, lo, hi);
    range.value = zeigen;
    sr.getElementById("dlg-value").textContent = this._dlgText(zeigen);
  },
  /** Wert im Stellfenster mit Einheit. Eine Verschiebung mit Vorzeichen. */
  _dlgText(v) {
    if (v === null || v === void 0 || Number.isNaN(v)) return "--";
    const zahl = String(v).replace(".", DEZIMAL);
    if (this._dialogEinheit === "K") return `${v > 0 ? "+" : ""}${zahl} \xB0C`;
    return `${zahl} \xB0C`;
  }
};

// src/karte/grafik-hoch.js
var grafikHochKarte = {
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
      X_RL: 80,
      X_VL: 710,
      // Primaerkreis
      S_RL: 170,
      S_VL: 650,
      // Sekundaerkreis vom Puffer
      U1: 260,
      U2: 580,
      // Kanten der liegenden Baugruppen
      OBEN: 740
    };
    const UM = (P.U1 + P.U2) / 2;
    const mitPuffer = this._hatPuffer();
    const ab = mitPuffer ? 0 : 280;
    const PUF = [860, 1080];
    const QZ = quellen.length ? [PUF[1] + 60, PUF[1] + 280] : null;
    const QH = quellen.length ? 250 : 0;
    const HKS = Array.from({ length: anzahl }, (_, i) => [1140 - ab + QH + i * 240, 1340 - ab + QH + i * 240]);
    const HK1 = HKS[0];
    const WW = [HKS[anzahl - 1][1] + 20, HKS[anzahl - 1][1] + 280];
    const ABZW = mitPuffer ? PUF[1] - 20 : HK1[0] - 40;
    const anschluss = (n, y1, y2) => {
      const stil = this._heizStil(n);
      if (!this._istFbh(stil)) return { vy: y1 + 60, ry: y2 - 60 };
      const g = this._fbhLage(stil, P.U1, P.U1 + 180, y1 + 10, y2 - 10);
      return { vy: Math.round(g.vy), ry: Math.round(g.ry) };
    };
    const an = HKS.map((z, i) => anschluss(i + 1, z[0], z[1]));
    const a1 = an[0];
    const letzt = an[anzahl - 1];
    const ABZW_VL = mitPuffer ? ABZW : a1.vy;
    const ABZW_RL = mitPuffer ? ABZW : a1.ry;
    const UNTEN = WW[1] + 40;
    const HOEHE = WW[1] + 60;
    const rohr = (d) => `<path class="pipe-shell" d="${d}"/><path class="pipe" d="${d}"/>`;
    const stutzenVL = (x, y) => rohr(`M${x} ${y} H ${P.U2 + 9}`);
    const stutzenRL = (x, y) => rohr(`M${P.U1 - 9} ${y} H ${x}`);
    const symbole = ["betrieb", "abtauen", "auto", "heizen", "ww", "kuehlen"].map((k, i) => {
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
                      <path d="M-3 -8 L0 -11 L3 -8 M-3 8 L0 11 L3 8"/></g>`
      }[k];
      return `<g class="modus" id="modus-${k}" transform="translate(${190 + (i - 2.5) * 44} 70)">
          <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>${glyph}</g>`;
    }).join("");
    const fans = this._config.fan_count === 2 ? `${this._fan("fan1", 190, 280, 96)}${this._fan("fan2", 190, 528, 96)}` : this._fan("fan1", 190, 400, 120);
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
    const kennzahlen = `
      <g id="kennzahlen">
        <g id="sg-group" opacity="0">
          <text class="sg-label" x="390" y="70">SG Ready</text>
          <text class="sg-value" id="sg-text" x="390" y="98">--</text>
          <g transform="translate(390 112)">
            ${[0, 1, 2, 3].map(
      (i) => `<rect x="${i * 36}" y="0" width="32" height="11" rx="5.5" id="sg-seg-${i + 1}" fill="#3A4658"/>`
    ).join("")}
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
        <rect x="${P.X_RL - schildBreite("R\xFCcklauf", 104) / 2}" y="${P.OBEN + 40}" width="${schildBreite("R\xFCcklauf", 104)}" height="28" rx="8"
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
    const speicher = (id, y1, y2, name, fuell, mindest, labelKey, badges) => {
      const h = y2 - y1;
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
    const puffer = stutzenVL(P.X_VL, PUF[0] + 60) + stutzenRL(P.X_RL, PUF[1] - 60) + `<path class="flowdots" id="dots-buf" d="M${P.X_VL} ${PUF[0] + 60} H ${P.U2 + 9}"/>
       <path class="flowdots" id="dots-buf2" d="M${P.U1 - 9} ${PUF[1] - 60} H ${P.X_RL}"/>` + speicher("buffer-group", PUF[0], PUF[1], "buf", "bufferFill", 150, "label_buffer", `
        <g id="roomheater-badge" class="badge" transform="translate(${UM} ${PUF[0] + 70})">
          <rect x="${-abzeichenBreite("Heizstab") / 2}" y="-15" width="${abzeichenBreite("Heizstab")}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>`);
    const warmwasser = stutzenVL(P.X_VL, WW[0] + 40) + stutzenRL(P.X_RL, WW[1] - 20) + `<path class="flowdots" id="dots-dhw" d="M${P.X_VL} ${WW[0] + 40} H ${P.U2 + 9}"/>
       <path class="flowdots" id="dots-dhw2" d="M${P.U1 - 9} ${WW[1] - 20} H ${P.X_RL}"/>` + speicher("dhw-group", WW[0], WW[1], "dhw", "dhwFill", 134, "label_dhw", `
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
    const sekundaer = `
      ${mitPuffer ? rohr(`M${P.U2} ${ABZW_VL} H ${P.S_VL} V ${letzt.vy}`) : anzahl > 1 ? rohr(`M${P.S_VL} ${a1.vy} V ${letzt.vy}`) : ""}
      ${mitPuffer ? rohr(`M${P.U1} ${ABZW_RL} H ${P.S_RL} V ${letzt.ry}`) : anzahl > 1 ? rohr(`M${P.S_RL} ${a1.ry} V ${letzt.ry}`) : ""}
      <path class="flowdots" id="dots-sf-a" d="M${mitPuffer ? P.U2 : P.X_VL} ${ABZW_VL} H ${P.S_VL} V ${a1.vy}"/>
      <path class="flowdots" id="dots-sr-a" d="M${P.S_RL} ${a1.ry} V ${ABZW_RL} H ${mitPuffer ? P.U1 : P.X_RL}"/>
      ${an.slice(1).map((z, i) => {
      const k = i + 2;
      const id = k === 2 ? "" : String(k);
      return `<path class="flowdots" id="dots-sf-b${id}" d="M${P.S_VL} ${an[i].vy} V ${z.vy}"/>
      <path class="flowdots" id="dots-sr-b${id}" d="M${P.S_RL} ${z.ry} V ${an[i].ry}"/>`;
    }).join("")}`;
    const heizkreis = (n, y1, y2) => {
      const kr = P.U1 + 180;
      const tx = Math.round((kr + P.U2) / 2) + 4;
      const { vy, ry } = anschluss(n, y1, y2);
      const direkt = !mitPuffer && n === 1;
      const koerper = this._heizkoerper(
        n,
        P.U1,
        kr,
        y1 + 10,
        y2 - 10,
        { x: kr + 6, y: vy, seite: "rechts" },
        { x: P.U1 - 6, y: ry, seite: "links" }
      );
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
      return this._verlaufAlsKnopf() ? this._diaKnoepfe(740 - breit, 420, breit, true) : this._verlaufRahmen(740 - breit, 420, breit, 260);
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
    return quellen.map((art, i) => {
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
    }).join("");
  }
};

// src/karte/grafik-klassisch.js
var grafikKlassischKarte = {
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
  }
};

// src/karte/grafik-quer.js
var grafikQuerKarte = {
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
    const spalten = this._hkAnzahl() > 2 ? 2 : 1;
    const ZX1 = spalten === 2 ? 1640 : ZX0 + 200;
    const W = ZX1 + 10;
    return { puffer, quellen, XW, ZIRK_X, XB, BL, BR, ZX0, ZX1, W, spalten, PRESS_X };
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
    const fans = two ? `${this._fan("fan1", 190, 360, 96)}${this._fan("fan2", 190, 608, 96)}` : this._fan("fan1", 190, 480, 120);
    const F = L.FLOW_Y;
    const R = L.RET_Y;
    const T = L.TANK_TOP;
    const B = L.TANK_BOTTOM;
    const M = this._querMasse();
    const { XW, XB, ZIRK_X } = M;
    const PUMP_X = Math.round((450 + XW) / 2);
    const zone = this._heizkreisZone(M);
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
    <svg viewBox="0 ${80 - LUFT} ${M.W} ${L.H + LUFT}" class="lhc-svg" role="img"
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
      <!-- Au\xDFenger\xE4t -->
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
      const rand = M.W - 10;
      const links = this._verlaufAlsKnopf() ? 450 : 700;
      const w = clamp(Number(this._config.history_width) || 450, 250, Math.min(700, rand - links));
      return this._verlaufAlsKnopf() ? this._diaKnoepfe(rand - w, 84 - LUFT + 8, w) : this._verlaufRahmen(rand - w, 84 - LUFT, w, 144);
    })()}

      ${this._kennzahlenQuer(F)}

      <!-- Vorlauf am Ausgang, R\xFCcklauf am Eingang -->
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

      <!-- Prim\xE4rpumpe -->
      <g>
        <text class="cap-s" x="${PUMP_X}" y="662" text-anchor="middle">${this._t("pumpe")}</text>
        <text class="value-s" id="pump-v" x="${PUMP_X}" y="749" text-anchor="middle">--</text>
        <text class="value-s" id="flow-v" x="${PUMP_X}" y="769" text-anchor="middle">--</text>
        <g transform="translate(${PUMP_X} ${R})">
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
        <text class="cap-s" id="zirk-name" x="${ZIRK_X - 26}" y="475" text-anchor="middle"
              dominant-baseline="middle" transform="rotate(-90 ${ZIRK_X - 26} 475)">${this._t("zirkulation")}</text>
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
    const MX = (340 + this._querMasse().XW - 95) / 2;
    return `
      <g id="kennzahlen">
      <g id="sg-group" opacity="0">
        <text class="sg-label" x="${MX}" y="${F + 60}" text-anchor="middle">SG Ready</text>
        <g transform="translate(${MX} ${F + 90})">
          <rect x="-68" y="0" width="32" height="11" rx="5.5" id="sg-seg-1" fill="#3A4658"/>
          <rect x="-34" y="0" width="32" height="11" rx="5.5" id="sg-seg-2" fill="#3A4658"/>
          <rect x="2" y="0" width="32" height="11" rx="5.5" id="sg-seg-3" fill="#3A4658"/>
          <rect x="36" y="0" width="32" height="11" rx="5.5" id="sg-seg-4" fill="#3A4658"/>
        </g>
        <text class="sg-value" id="sg-text" x="${MX}" y="${F + 130}"
              text-anchor="middle">--</text>
        <line x1="${MX - 65}" y1="${F + 150}" x2="${MX + 65}" y2="${F + 150}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="pv-group" opacity="0">
        <text class="sg-label" id="pv-label" x="${MX}" y="${F + 190}" text-anchor="middle">${this._t("pv_ueberschuss")}</text>
        <text class="pv-value" id="pv-v" x="${MX}" y="${F + 228}"
              text-anchor="middle">--</text>
        <line x1="${MX - 65}" y1="${F + 245}" x2="${MX + 65}" y2="${F + 245}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="verbrauch-group" opacity="0">
        <text class="sg-label" x="${MX}" y="${F + 285}" text-anchor="middle">${this._t("leistung")}</text>
        <text class="verbrauch-v" id="power-now-v" x="${MX}" y="${F + 323}"
              text-anchor="middle">--</text>
        <line x1="${MX - 65}" y1="${F + 340}" x2="${MX + 65}" y2="${F + 340}" stroke="#55657F" stroke-width="1"/>
        <text class="sg-label" id="energy-label" x="${MX}" y="${F + 380}"
              text-anchor="middle">--</text>
        <text class="unit-value" id="energy-today-v" x="${MX}" y="${F + 420}"
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
    const spalten = M.spalten;
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
    let leitungen = "";
    let punkte = "";
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
      const fbh = this._heizStil(nr) === "fbh";
      const dx = fbh ? a - 6 : a + 18;
      const bx = fbh ? b + 6 : b - 18;
      aeste.push(ast);
      ruecks.push(unten + 14);
      const zu = `M${vorl} ${ast} H ${dx} V ${top}`;
      const kreuzt = zeilen > 1 && ze === 0;
      const ab = kreuzt ? `M${bx} ${unten} V ${unten + 14} H ${vorl + 7} A 7 7 0 0 0 ${vorl - 7} ${unten + 14} H ${rueck}` : `M${bx} ${unten} V ${unten + 14} H ${rueck}`;
      const tx = (a + b) / 2;
      leitungen += `
        <path class="pipe-shell duenn" d="${zu} ${ab}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-in" d="${zu}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-out" d="${ab}"/>`;
      punkte += `
        <path class="flowdots duenn" id="dots-hk${nr}" d="${zu}"/>
        <path class="flowdots duenn" id="dots-hk${nr}b" d="${ab}"/>`;
      kreise += `
      <g class="circuit" id="hk${nr}-group">
        <g transform="translate(${dx} ${ast + 20})">
          <circle r="15" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="hk${nr}-rotor">
            <path id="hk${nr}-blade" d="M0 -8 L2.5 -2 L9 0 L2.5 2 L0 8 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#55637A"/>
            <circle r="2.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="hk${nr}-pump-v" x="${dx + 22}" y="${ast + 25}" text-anchor="start">--</text>
        <g id="hk${nr}-rad">${this._heizkoerper(
        nr,
        a,
        b,
        top,
        unten,
        { x: dx, y: top, seite: "oben" },
        { x: bx, y: unten, seite: "unten" }
      )}
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
    const r1 = ruecks[0];
    const r2 = zeilen > 1 ? ruecks[spalten] : null;
    let punkteSammel;
    let vlPfad;
    let rlPfad;
    if (M.puffer) {
      const RLY = zeilen > 1 ? 600 : 470;
      vlPfad = `M${M.BR} ${VLY} H ${vorl} V ${letzterAst}`;
      const teile = ruecks.map((y) => `M${rueck} ${y} V ${RLY}`);
      rlPfad = `${[...new Set(teile)].join(" ")} M${rueck} ${RLY} H ${M.BR}`;
      punkteSammel = `
      <path class="flowdots duenn" id="dots-sf-a" d="M${M.BR} ${VLY} H ${vorl}"/>
      ${zeilen > 1 ? `<path class="flowdots duenn" id="dots-sf-z2" d="M${vorl} ${VLY} V ${letzterAst}"/>` : ""}
      <path class="flowdots duenn" id="dots-sr-z1" d="M${rueck} ${r1} V ${RLY}"/>
      ${zeilen > 1 ? `<path class="flowdots duenn" id="dots-sr-z2" d="M${rueck} ${r2} V ${RLY}"/>` : ""}
      <path class="flowdots duenn" id="dots-sr-a" d="M${rueck} ${RLY} H ${M.BR}"/>`;
    } else {
      vlPfad = `M${vorl} ${F} V ${letzterAst}`;
      rlPfad = `M${rueck} ${Math.min(...ruecks)} V ${R}`;
      punkteSammel = `
      <path class="flowdots duenn" id="dots-sf-a" d="M${vorl} ${F} V ${VLY}"/>
      ${zeilen > 1 ? `<path class="flowdots duenn" id="dots-sf-z2" d="M${vorl} ${VLY} V ${letzterAst}"/>` : ""}
      ${zeilen > 1 ? `<path class="flowdots duenn" id="dots-sr-z1" d="M${rueck} ${r1} V ${r2}"/>` : ""}
      <path class="flowdots duenn" id="dots-sr-a" d="M${rueck} ${zeilen > 1 ? r2 : r1} V ${R}"/>`;
    }
    const rohre = `
      <!-- Sammelleitungen der Heizkreise -->
      <path class="pipe-shell duenn" d="${vlPfad} ${rlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-flow" d="${vlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-ret" d="${rlPfad}"/>`;
    kreise = `
      <!-- Leitungen der Heizkreise -->${leitungen}
      <!-- Laufpunkte der Sammelleitungen und Heizkreise -->${punkteSammel}${punkte}
${kreise}`;
    return { rohre, kreise, vorl, rueck };
  },
  /**
   * Kamin und Solarthermie links am Puffer. Jedes Geraet hat eigenen
   * Vor- und Ruecklauf mit Pumpe, denn es sind getrennte Kreise.
   */
  _quellenMarkup(M) {
    if (!M.quellen.length) return "";
    const lagen = M.quellen.length === 2 ? [350, 555] : [430];
    const cx = M.BL - 122;
    return M.quellen.map((art, i) => {
      const yc = lagen[i];
      const kante = (y) => art === "kamin" ? cx + 40 : this._solarKante(cx, yc, y);
      const vl = `M${kante(yc - 18)} ${yc - 18} H ${M.BL}`;
      const rl = `M${M.BL} ${yc + 18} H ${kante(yc + 18)}`;
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
        <text class="value-s" id="${art}-pump-v" x="${M.BL - 30}" y="${yc + 52}" text-anchor="middle">--</text>
        ${art === "kamin" ? this._kaminBild(cx, yc) : this._solarBild(cx, yc)}
        <text class="cap" id="${art}-name" x="${cx}" y="${ly}" text-anchor="middle">${this._t(art === "kamin" ? "kamin" : "solarthermie")}</text>
        <text class="tag-v hk-wert" id="${art}-v" x="${cx}" y="${ly + 26}" text-anchor="middle">--</text>
      </g>`;
    }).join("");
  },
  /**
   * Moderner Kaminofen: schmal, grosses Sichtfenster, Holzscheite,
   * Aschelade, Rauchrohr oben. Ab der eingestellten Temperatur lodert
   * ein Feuer im Fenster.
   */
  _kaminBild(cx, yc) {
    const x = cx - 40;
    const t2 = yc - 46;
    const fx = x + 9;
    const fy = t2 + 9;
    const boden = fy + 56;
    return `
        <rect x="${cx - 9}" y="${t2 - 16}" width="18" height="18" fill="#26303F" stroke="#33415A" stroke-width="2"/>
        <rect x="${x}" y="${t2}" width="80" height="106" rx="10" fill="#161D28" stroke="#33415A" stroke-width="2"/>
        <rect x="${fx}" y="${fy}" width="62" height="58" rx="6" fill="#0B1017" stroke="#46536A" stroke-width="1.5"/>
        <g id="kamin-schein" opacity="0">
          <rect x="${fx + 1}" y="${fy + 1}" width="60" height="56" rx="5" fill="#2A1408"/>
          <ellipse id="kamin-glut" cx="${cx}" cy="${boden - 14}" rx="26" ry="18" fill="#FF8A3D" opacity="0.3"/>
        </g>
        <rect x="${cx - 24}" y="${boden - 9}" width="48" height="8" rx="4" fill="#6B4A2E" stroke="#3E2A1A" stroke-width="1"/>
        <rect x="${cx - 18}" y="${boden - 16}" width="36" height="8" rx="4" fill="#7A5534" stroke="#3E2A1A" stroke-width="1"
              transform="rotate(-8 ${cx} ${boden - 12})"/>
        <circle cx="${cx - 24}" cy="${boden - 5}" r="3.6" fill="#A47B52"/>
        <circle cx="${cx + 24}" cy="${boden - 5}" r="3.6" fill="#A47B52"/>
        <g id="kamin-flamme" opacity="0" transform="translate(${cx} ${boden - 7}) scale(0.82)">
          <g id="kamin-feuer">
            <path d="M-2 0 c-20 -6 -20 -26 -6 -42 c0 12 10 14 9 3 c10 10 16 28 -3 39 Z" fill="#FF6B2E"/>
            <path d="M12 0 c-10 -4 -10 -16 -2 -26 c0 8 7 8 6 1 c6 8 8 18 -4 25 Z" fill="#FF8A3D"/>
            <path d="M-16 0 c-8 -4 -7 -14 0 -21 c0 7 5 7 5 2 c4 7 4 14 -5 19 Z" fill="#FF8A3D"/>
            <path d="M0 0 c-9 -3 -9 -14 -1 -22 c1 7 6 7 5 1 c5 7 5 15 -4 21 Z" fill="#FFC44D"/>
            <path d="M0 0 c-4 -2 -4 -7 0 -11 c1 4 3 4 3 0 c2 4 2 8 -3 11 Z" fill="#FFF1B8"/>
          </g>
        </g>
        <rect x="${fx}" y="${t2 + 74}" width="62" height="24" rx="5" fill="#0F151E" stroke="#26303F" stroke-width="1.5"/>
        <line x1="${fx + 10}" y1="${t2 + 86}" x2="${fx + 52}" y2="${t2 + 86}" stroke="#33415A" stroke-width="3" stroke-linecap="round"/>`;
  },
  /**
   * Bildart des Heizkreises: Platte, Glieder oder Fussbodenheizung.
   * Fruehere Werte fbh_verteiler und fbh_raum zeigen die Fussbodenheizung.
   */
  _heizStil(n) {
    const v = this._config[`hk${n}_style`];
    if (v === "fbh_verteiler" || v === "fbh_raum") return "fbh";
    return v === "glieder" || v === "fbh" ? v : "platte";
  },
  /** Ist die Bildart eine Fussbodenheizung? */
  _istFbh(stil) {
    return stil === "fbh";
  },
  /**
   * Lage der Fussbodenheizung im Rahmen a..b, top..unten: eine Zimmerecke
   * mit zwei Waenden und dem Boden davor. Liefert die Eckpunkte und die
   * Hoehe der Anschluesse an der linken und rechten Bodenecke.
   */
  _fbhLage(stil, a, b, top, unten) {
    const L2 = a - 6;
    const R = b + 6;
    const cx = (L2 + R) / 2;
    top = Math.max(top, unten - (R - L2) * 0.55);
    const H = unten - top;
    const d1 = Math.min((R - L2) * 0.22, H * 0.26);
    const yC = unten - 2 * d1;
    const C = [cx, yC];
    const Lp = [L2, yC + d1];
    const Rp = [R, yC + d1];
    const Fp = [cx, unten];
    const pt = (u, v) => [C[0] + u * (Rp[0] - C[0]) + v * (Lp[0] - C[0]), C[1] + u * (Rp[1] - C[1]) + v * (Lp[1] - C[1])];
    return { L: L2, R, cx, top, d1, C, Lp, Rp, Fp, pt, vy: Rp[1], ry: Lp[1] };
  },
  /** Aufsteigende Waerme ueber dem Boden, sichtbar wenn der Kreis laeuft. */
  _fbhWaerme(n, x0, x1, y, anzahl) {
    let w = "";
    for (let i = 0; i < anzahl; i++) {
      const x = x0 + (i + 0.5) * (x1 - x0) / anzahl;
      w += `<path d="M${x.toFixed(1)} ${y} q4 -5 0 -10 q-4 -5 0 -10" fill="none" stroke="#FFB070" stroke-width="2" stroke-linecap="round"/>`;
    }
    return `<g id="hk${n}-waerme" opacity="0">${w}</g>`;
  },
  /**
   * Fussbodenheizung als Zimmerecke: zwei Waende, davor der Boden mit der
   * Rohrschlange, darueber steigt Waerme auf, solange Wasser fliesst.
   */
  _fbhBild(n, stil, a, b, top, unten, ein, aus) {
    const fill = `url(#rad${n}Fill)`;
    const g = this._fbhLage(stil, a, b, top, unten);
    const { L: L2, R, cx, C, Lp, Rp, Fp, pt, d1 } = g;
    top = g.top;
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const wandL = `M${f([cx, top])} L${f(C)} L${f(Lp)} L${f([L2, top + d1])} Z`;
    const wandR = `M${f([cx, top])} L${f(C)} L${f(Rp)} L${f([R, top + d1])} Z`;
    const boden = `M${f(C)} L${f(Rp)} L${f(Fp)} L${f(Lp)} Z`;
    const bahnen = 5;
    let schlange = `M${f(Lp)} L${f(pt(0.1, 0.9))}`;
    for (let i = 0; i < bahnen; i++) {
      const u = 0.1 + i * 0.8 / (bahnen - 1);
      const [v0, v1] = i % 2 ? [0.12, 0.9] : [0.9, 0.12];
      schlange += ` L${f(pt(u, v0))} L${f(pt(u, v1))}`;
    }
    schlange += ` L${f(Rp)}`;
    const vonRechts = ein.seite === "rechts";
    const S = vonRechts ? Rp : Lp;
    const E = vonRechts ? Lp : Rp;
    const zu = ein.seite === "oben" ? `M${ein.x} ${top} H ${S[0].toFixed(1)} V ${S[1].toFixed(1)}` : `M${ein.x} ${S[1].toFixed(1)} H ${S[0].toFixed(1)}`;
    const ab = aus.seite === "unten" ? `M${f(E)} H ${aus.x} V ${unten}` : `M${f(E)} H ${aus.x}`;
    const rohr = (d, breite) => `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${breite}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const mitte = pt(0.5, 0.5);
    return `
          <path d="${wandL}" fill="#1E2836" stroke="#33415A" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="${wandR}" fill="#232C3A" stroke="#33415A" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="${boden}" fill="#3A4658" stroke="#55637A" stroke-width="1.5" stroke-linejoin="round"/>
          ${rohr(`${zu} ${schlange} ${ab}`, 2.6)}
          ${this._fbhWaerme(n, mitte[0] - 26, mitte[0] + 26, mitte[1] - 2, 3)}`;
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
    if (this._istFbh(stil)) return this._fbhBild(n, stil, a, b, top, unten, ein, aus);
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
      naechste();
      naechste();
      const bubbleId = `${id}-bubble-${i}`;
      kreise += `<circle class="bubble" id="${bubbleId}" cx="${cx}" cy="${y + h - 4}" r="${r}" opacity="0"/>`;
    }
    return `<g id="${id}">${kreise}</g>`;
  },
  _fan(id, cx, cy, r) {
    const count = 5;
    let blades = "";
    for (let i = 0; i < count; i++) {
      blades += `<path d="M0 0 C ${r * 0.34} ${-r * 0.3}, ${r * 0.8} ${-r * 0.26}, ${r * 0.92} ${r * 0.06} C ${r * 0.62} ${r * 0.3}, ${r * 0.22} ${r * 0.26}, 0 0 Z"
        transform="rotate(${360 / count * i})"/>`;
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
  }
};

// src/karte/heizkurve.js
var heizkurveKarte = {
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
    const striche = (n, pre, waag) => [...Array(n).keys()].map(
      (i) => `
        <line id="kd${z}-g${pre}${i}" ${waag ? `x1="${links}" x2="${rechts}" y1="0" y2="0"` : `y1="${oben}" y2="${unten}" x1="0" x2="0"`} stroke="#212B39" stroke-width="1" opacity="0"/>
        <text class="${waag ? "achse-vl" : "achse-aussen"}" id="kd${z}-t${pre}${i}" ${waag ? `x="${links - 8}" y="0" text-anchor="end"` : `y="${H - 22}" x="0" text-anchor="middle"`} opacity="0">--</text>`
    ).join("");
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
    const zeilen = [
      { basis: "o_low", titel: "f_aussen_kalt", min: -20, max: 15, farbe: "aussen" },
      { basis: "t_high", titel: "f_dann_vorlauf", min: 20, max: 75, farbe: "vl" },
      { basis: "o_high", titel: "f_aussen_warm", min: -20, max: 25, farbe: "aussen" },
      { basis: "t_low", titel: "f_dann_vorlauf", min: 20, max: 75, farbe: "vl" }
    ];
    [1, 2].forEach((z) => {
      const box = sr.getElementById(`kd${z}-regler`);
      if (!box) return;
      if (!box.dataset.fertig) {
        box.innerHTML = zeilen.map(
          (r, i) => `
            <div class="lhc-num-kompakt ist-${r.farbe}">
              <span>${escapeHtml(this._t(r.titel))}</span>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-minus">&minus;</button>
              <output id="kd${z}-r${i}">--</output>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-plus">+</button>
            </div>`
        ).join("");
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
                value: neu
              });
            } else {
              const w = (b2) => {
                const wid = this._e(z === 2 ? `curve2_${b2}` : `curve_${b2}`);
                const wist = numState(this._quelle, wid);
                const wgeh = this._gehaltenerWert(wid, wist);
                return wgeh !== null ? wgeh : wist;
              };
              const werte = {
                t_high: w("t_high"),
                t_low: w("t_low"),
                o_high: w("o_high"),
                o_low: w("o_low")
              };
              werte[r.basis] = neu;
              if (Object.values(werte).some((v) => v === null)) return;
              this._quelle.callService("mqtt", "publish", {
                topic: `${this._config.mqtt_prefix || "panasonic_heat_pump"}/commands/SetCurves`,
                payload: JSON.stringify({
                  [`zone${z}`]: {
                    heat: {
                      target: { high: werte.t_high, low: werte.t_low },
                      outside: { high: werte.o_high, low: werte.o_low }
                    }
                  }
                })
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
        if (out) out.textContent = wert === null ? "--" : `${fmt(wert, 0)} \xB0C`;
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
    this._kurveNur = zone || 1;
    const t2 = this.shadowRoot.getElementById("kurve-haupttitel");
    if (t2) {
      const name = this._name(`label_hk${this._kurveNur}`);
      t2.textContent = `${this._t("f_heizkurve")} ${name}`;
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
    const px = (a) => links + (clamp(a, A_MIN, A_MAX) - A_MIN) / (A_MAX - A_MIN) * (rechts - links);
    const py = (t2) => unten - (clamp(t2, T_MIN, T_MAX) - T_MIN) / (T_MAX - T_MIN) * (unten - oben);
    const schritt = (bereich, hoechstens) => [1, 2, 5, 10, 15, 20, 25].find((s) => s >= bereich / hoechstens) || 25;
    const marken = (min, max, anzahl) => {
      const s = schritt(max - min, anzahl);
      const raus = [];
      for (let v = Math.ceil(min / s) * s; v <= max + 1e-3; v += s) raus.push(v);
      return raus;
    };
    const aussen = numState(this._quelle, this._e("outside_temp"));
    [1, 2].forEach((z) => {
      const feld = (basis) => z === 2 ? `curve2_${basis}` : `curve_${basis}`;
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
        spalte.hidden = fehlt || z === 2 && this._config.hk_count < 2 || this._kurveNur && this._kurveNur !== z;
      if (fehlt) return;
      const setz = (id, attrs, text) => {
        const el = sr.getElementById(id);
        if (!el) return;
        Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
        if (text !== void 0) el.textContent = text;
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
      const steigung = (tTief - tHoch) / (aHoch - aTief);
      const tBei = (a) => tHoch + steigung * (a - aTief);
      const aBei = (t2) => aTief + (t2 - tHoch) / steigung;
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
        d: `M${px(a1).toFixed(1)} ${py(tBei(a1)).toFixed(1)}L${px(a2).toFixed(1)} ${py(tBei(a2)).toFixed(1)}`
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
      const soll = tBei(aussen);
      const mx = px(aussen);
      const my = py(soll);
      setz(`kd${z}-mx`, {
        x1: mx.toFixed(1),
        x2: mx.toFixed(1),
        y1: oben,
        y2: unten,
        opacity: "0.85"
      });
      setz(`kd${z}-my`, { x2: mx.toFixed(1), y1: my.toFixed(1), y2: my.toFixed(1), opacity: "0.6" });
      setz(`kd${z}-mxt`, { x: mx.toFixed(1), opacity: "1" }, `${fmt(aussen, 1)} \xB0C`);
      setz(`kd${z}-myt`, { y: (my - 8).toFixed(1), opacity: "1" }, `${fmt(soll, 0)} \xB0C`);
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
  }
};

// src/karte/hilfe.js
var hilfeKarte = {
  /* -------------------- Hilfe -------------------- */
  _buildHilfe() {
    const sr = this.shadowRoot;
    const knopf = sr.getElementById("hilfe-knopf");
    const fenster = sr.getElementById("hilfe");
    if (!knopf || !fenster) return;
    knopf.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this._oeffneHilfe();
    });
    sr.getElementById("hilfe-zu").addEventListener("click", () => this._schliesseHilfe());
    fenster.addEventListener("click", (ev) => {
      if (ev.target === fenster) this._schliesseHilfe();
    });
    fenster.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") this._schliesseHilfe();
    });
    const suche = sr.getElementById("hilfe-suche");
    suche.addEventListener("input", () => this._zeigeHilfe());
  },
  _oeffneHilfe() {
    const sr = this.shadowRoot;
    const fenster = sr.getElementById("hilfe");
    if (!fenster) return;
    this._hilfeGruppe = this._hilfeGruppe || "";
    this._hilfeIndex = this._hilfeEntitaeten();
    this._hilfeChips();
    this._zeigeHilfe();
    fenster.hidden = false;
    const suche = sr.getElementById("hilfe-suche");
    const maus = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (suche && maus) {
      suche.focus();
    } else {
      const box = fenster.querySelector(".lhc-hilfe-box");
      if (box) box.focus({ preventScroll: true });
    }
  },
  _schliesseHilfe() {
    const fenster = this.shadowRoot.getElementById("hilfe");
    if (fenster) fenster.hidden = true;
  },
  /** Schaltflaechen zum Filtern nach Gruppe. */
  _hilfeChips() {
    const sr = this.shadowRoot;
    const host = sr.getElementById("hilfe-chips");
    if (!host) return;
    const sp = this._sp();
    const chips = [{ id: "", titel: this._t("h_alle") }].concat(
      HILFE.map((g) => ({ id: g.id, titel: hilfeText(sp, g.id, g.titel) }))
    );
    host.innerHTML = chips.map(
      (c) => `<button type="button" data-g="${c.id}"
          class="${c.id === this._hilfeGruppe ? "aktiv" : ""}">${escapeHtml(c.titel)}</button>`
    ).join("");
    host.querySelectorAll("button").forEach(
      (b) => b.addEventListener("click", () => {
        this._hilfeGruppe = b.dataset.g;
        host.querySelectorAll("button").forEach(
          (x) => x.classList.toggle("aktiv", x === b)
        );
        this._zeigeHilfe();
      })
    );
  },
  /**
   * Sucht zu jeder Kennung (top9, setdhwtemp, xtop3, opt0, 1wire, s0) die
   * Entitaeten in Home Assistant. Zuerst ueber die Registrierung von
   * HeishaMon by Lutarym (translation_key), sonst ueber die Endung der
   * Entity-ID, damit auch umbenannte oder per MQTT angelegte Entitaeten
   * gefunden werden.
   */
  _hilfeEntitaeten() {
    const q = this._hass || {};
    const index = {};
    const dazu = (schluessel, id) => {
      if (!schluessel || !id) return;
      const k = String(schluessel).toLowerCase();
      if (!index[k]) index[k] = [];
      if (!index[k].includes(id)) index[k].push(id);
    };
    const reg = q.entities || {};
    Object.keys(reg).forEach((id) => {
      const e = reg[id];
      if (!e || e.platform !== INTEGRATION_DOMAIN) return;
      if (e.translation_key) dazu(e.translation_key, id);
      if (/_1wire_[^.]+$/.test(id)) dazu("1-wire", id);
      if (/^s0_/.test(e.translation_key || "")) dazu("s0", id);
    });
    Object.keys(q.states || {}).forEach((id) => {
      if (!/heishamon/i.test(id)) return;
      const m = id.match(/[._]((?:x?top|opt)\d+|set[a-z0-9]+)$/i);
      if (m) dazu(m[1], id);
      if (/_1wire_[^.]+$/.test(id)) dazu("1-wire", id);
      if (/_s0_\d+_(power|energy)$/.test(id)) dazu("s0", id);
    });
    const reihe = ["sensor", "number", "switch", "select", "button"];
    Object.values(index).forEach(
      (liste) => liste.sort((a, b) => {
        const ra = reihe.indexOf(a.split(".")[0]);
        const rb = reihe.indexOf(b.split(".")[0]);
        return (ra < 0 ? 9 : ra) - (rb < 0 ? 9 : rb) || a.localeCompare(b);
      })
    );
    return index;
  },
  /** Entitaeten zu einem Hilfeeintrag. */
  _hilfeIds(e) {
    const index = this._hilfeIndex || {};
    const ids = [];
    [e.l, e.s].forEach((k) => {
      if (!k || /^OT /.test(k)) return;
      (index[String(k).toLowerCase()] || []).forEach((id) => {
        if (!ids.includes(id)) ids.push(id);
      });
    });
    return ids;
  },
  /** Kopiert Text, auch ohne gesicherte Verbindung (http im Heimnetz). */
  async _kopiere(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
    }
    const feld = document.createElement("textarea");
    feld.value = text;
    feld.setAttribute("readonly", "");
    feld.style.position = "fixed";
    feld.style.opacity = "0";
    document.body.appendChild(feld);
    feld.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    feld.remove();
    return ok;
  },
  /** Liste nach Gruppe und Suchwort. */
  _zeigeHilfe() {
    const sr = this.shadowRoot;
    const liste = sr.getElementById("hilfe-liste");
    const suche = sr.getElementById("hilfe-suche");
    if (!liste) return;
    const sp = this._sp();
    const norm = (x) => String(x || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const woerter = norm(suche ? suche.value : "").split(/\s+/).filter(Boolean);
    const lesen = escapeHtml(this._t("h_lesen"));
    const kopierTitel = escapeHtml(this._t("h_kopieren"));
    const keineEntitaet = escapeHtml(this._t("h_keine_entitaet"));
    const schreiben = escapeHtml(this._t("h_schreiben"));
    let anzahl = 0;
    let html = "";
    HILFE.forEach((g) => {
      if (this._hilfeGruppe && g.id !== this._hilfeGruppe) return;
      const treffer = g.e.filter((e) => {
        if (!woerter.length) return true;
        const text = norm(
          [
            hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.n`, e.n),
            hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.t`, e.t),
            e.l,
            e.s,
            hilfeText(sp, g.id, g.titel)
          ].concat(this._hilfeIds(e)).join(" ")
        );
        return woerter.every(
          (w) => /^(x?top|opt)\d+$/.test(w) ? new RegExp(`(^|[^a-z0-9])${w}($|[^a-z0-9])`).test(text) : text.includes(w)
        );
      });
      if (!treffer.length) return;
      anzahl += treffer.length;
      html += `<section><h3>${escapeHtml(hilfeText(sp, g.id, g.titel))}</h3>`;
      treffer.forEach((e) => {
        const marken = [];
        if (e.l) marken.push(`<span class="marke lesen">${lesen} \xB7 ${escapeHtml(e.l)}</span>`);
        if (e.s) marken.push(`<span class="marke schreiben">${schreiben} \xB7 ${escapeHtml(e.s)}</span>`);
        if (e.b) marken.push(`<span class="marke bereich">${escapeHtml(e.b)}</span>`);
        let entitaeten = "";
        if (e.l || e.s) {
          const ids = this._hilfeIds(e);
          entitaeten = ids.length ? `<div class="entitaeten">${ids.map(
            (id) => `<button type="button" class="entitaet" data-kopie="${escapeHtml(id)}"
                    title="${kopierTitel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v11h-2V5H8z"/><path d="M5 7h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v11h9V9z"/></svg><span>${escapeHtml(id)}</span></button>`
          ).join("")}</div>` : `<div class="entitaeten keine-entitaet">${keineEntitaet}</div>`;
        }
        html += `<article>
          <div class="eintrag-kopf"><b>${escapeHtml(hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.n`, e.n))}</b>${marken.join("")}</div>
          <p>${escapeHtml(hilfeText(sp, `${g.id}.${g.e.indexOf(e)}.t`, e.t))}</p>
          ${entitaeten}
        </article>`;
      });
      html += "</section>";
    });
    liste.innerHTML = html || `<p class="keine">${escapeHtml(this._t("h_keine"))}</p>`;
    liste.querySelectorAll("button[data-kopie]").forEach(
      (b) => b.addEventListener("click", async () => {
        const ok = await this._kopiere(b.dataset.kopie);
        if (!ok) return;
        b.classList.add("kopiert");
        b.dataset.hinweis = this._t("h_kopiert");
        setTimeout(() => b.classList.remove("kopiert"), 1500);
      })
    );
    liste.scrollTop = 0;
    const z = sr.getElementById("hilfe-anzahl");
    if (z) z.textContent = anzahl === 1 ? this._t("h_anzahl1") : tf(this._t("h_anzahl"), { n: anzahl });
  }
};

// src/karte/kennzahlen.js
var kennzahlenKarte = {
  /**
   * Tagesdurchschnitt der Leistungszahl seit Mitternacht. Ob der Wert
   * von der Waermepumpe oder vom externen Strommesser stammt, waehlt die
   * Integration ueber "COP Quelle". Im Demomodus gibt es keine Historie,
   * dort wird der aktuelle Wert gezeigt.
   */
  _cop(hass, basis) {
    const ids = [this._e(basis)];
    if (this._config && this._config.demo) {
      for (const id of ids) {
        const v = numState(hass, id);
        if (v !== null && v > 0) return v;
      }
      return null;
    }
    this._ladeCopTag();
    const tag = this._copTag || {};
    for (const id of ids) {
      if (id && typeof tag[id] === "number") return tag[id];
    }
    return null;
  },
  /**
   * Holt den Verlauf beider Leistungszahlen ab Mitternacht und bildet
   * je Entitaet den zeitgewichteten Mittelwert. Jeder Wert zaehlt so lange,
   * wie er galt. Unbekannt, nicht verfuegbar und Werte bis 0 bleiben
   * draussen, das sind Zeiten ohne Verdichterbetrieb.
   * Abgefragt wird hoechstens alle fuenf Minuten und sofort nach
   * Tageswechsel.
   */
  async _ladeCopTag() {
    const q = this._quelle;
    if (!q || typeof q.callWS !== "function" || this._copLaeuft) return;
    const ids = ["cop_heating", "cop_dhw"].map((k) => this._e(k)).filter(Boolean);
    if (!ids.length) return;
    const jetzt = Date.now();
    const d = new Date(jetzt);
    const mitternacht = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const schluessel = ids.join("|");
    if (this._copTagStart === mitternacht && this._copTagIds === schluessel && this._copTagZeit && jetzt - this._copTagZeit < 3e5) return;
    this._copLaeuft = true;
    this._copTagZeit = jetzt;
    try {
      const antwort = await q.callWS({
        type: "history/history_during_period",
        start_time: new Date(mitternacht).toISOString(),
        end_time: new Date(jetzt).toISOString(),
        entity_ids: ids,
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true
      });
      const ergebnis = {};
      ids.forEach((id) => {
        ergebnis[id] = copMittel(antwort && antwort[id] || [], mitternacht, jetzt);
      });
      this._copTag = ergebnis;
      this._copTagStart = mitternacht;
      this._copTagIds = schluessel;
      this._update();
    } catch {
    } finally {
      this._copLaeuft = false;
    }
  },
  /* -------------------- Jahresarbeitszahl -------------------- */
  /**
   * Entitaeten fuer die JAZ, ausschliesslich von HeishaMon: Heizen
   * (TOP15 Waerme, TOP16 Strom) und Warmwasser (TOP40, TOP41), Kuehlen
   * zaehlt nicht mit. Meldet die Waermepumpe den Zusatzblock (XTOP),
   * sind diese Werte laut HeishaMon ungueltig, dann gelten XTOP3/XTOP0
   * und XTOP5/XTOP2.
   */
  _jazQuellen() {
    if (this._config && this._config.demo) return { demo: true, heizen: true, ww: true };
    const q = this._hass;
    if (!q || !q.states) return null;
    const anzahl = q.entities ? -1 : Object.keys(q.states).length;
    const c = this._jazCache;
    if (c && c.reg === q.entities && c.cfg === this._config && c.anzahl === anzahl) return c.wert;
    const wert = this._jazQuellenSuchen();
    this._jazCache = { reg: q.entities, cfg: this._config, anzahl, wert };
    return wert;
  },
  _jazQuellenSuchen() {
    const index = this._hilfeEntitaeten();
    const sensor = (k) => (index[k] || []).find((id) => id.startsWith("sensor."));
    const xtop = Boolean(sensor("xtop3") && sensor("xtop0"));
    const paar = (w, e) => sensor(w) && sensor(e) ? { w: sensor(w), e: sensor(e) } : null;
    const heizen = xtop ? paar("xtop3", "xtop0") : paar("top15", "top16");
    const ww = xtop ? paar("xtop5", "xtop2") : paar("top40", "top41");
    if (!heizen && !ww) return null;
    return { heizen, ww };
  },
  /** Holt die Tageswerte seit dem 1. Januar aus der Langzeitstatistik. */
  async _ladeJaz() {
    const quellen = this._jazQuellen();
    if (!quellen || quellen.demo) return;
    const q = this._hass;
    if (typeof q.callWS !== "function" || this._jazLaeuft) return;
    const schluessel = JSON.stringify(quellen);
    const jetzt = Date.now();
    if (this._jazSchluessel === schluessel && this._jazZeit && jetzt - this._jazZeit < 36e5) return;
    this._jazLaeuft = true;
    const heute = new Date(jetzt);
    const startJahr = new Date(heute.getFullYear(), 0, 1).getTime();
    const ende = Math.floor(jetzt / 36e5) * 36e5;
    const zeit = (w) => typeof w === "number" ? w : Date.parse(w);
    const ids = [];
    ["heizen", "ww"].forEach((k) => {
      if (quellen[k]) ids.push(quellen[k].w, quellen[k].e);
    });
    try {
      const antwort = await q.callWS({
        type: "recorder/statistics_during_period",
        start_time: new Date(startJahr).toISOString(),
        end_time: new Date(ende).toISOString(),
        statistic_ids: ids,
        period: "day",
        types: ["mean"]
      });
      const tage = (id) => {
        const m = /* @__PURE__ */ new Map();
        (antwort && antwort[id] || []).forEach((z) => {
          const a = zeit(z.start);
          const w = Number(z.mean);
          if (!Number.isFinite(a) || z.mean === null || !Number.isFinite(w)) return;
          const b = Math.min(Number.isFinite(zeit(z.end)) ? zeit(z.end) : a + 864e5, ende);
          m.set(a, Math.max(w, 0) * (b - a) / 36e5 / 1e3);
        });
        return m;
      };
      const reihen = {};
      ["heizen", "ww"].forEach((k) => {
        if (quellen[k]) reihen[k] = { w: tage(quellen[k].w), e: tage(quellen[k].e) };
      });
      const rechne = (arten, ab) => {
        const da = arten.filter((k) => reihen[k]);
        if (!da.length) return null;
        const tageListe = [...reihen[da[0]].w.keys()].filter((t2) => t2 >= ab && da.every((k) => reihen[k].w.has(t2) && reihen[k].e.has(t2))).sort((x, y) => x - y);
        if (!tageListe.length) return null;
        let w = 0;
        let e = 0;
        tageListe.forEach(
          (t2) => da.forEach((k) => {
            w += reihen[k].w.get(t2);
            e += reihen[k].e.get(t2);
          })
        );
        if (e <= 0) return null;
        return { jaz: w / e, waerme: w, strom: e, erster: tageListe[0], ab };
      };
      const ergebnis = {
        gesamt: rechne(["heizen", "ww"], startJahr),
        heizen: rechne(["heizen"], startJahr),
        ww: rechne(["ww"], startJahr)
      };
      this._jaz = ergebnis;
      this._jazSchluessel = schluessel;
      this._jazZeit = jetzt;
      if (this._tuerListe) this._tuerListe.forEach((f, i) => f.jaz && this._tuerZeige(i));
    } catch {
      this._jaz = null;
    } finally {
      this._jazLaeuft = false;
    }
  },
  /** Fuellt die JAZ-Tabelle hinter der Tuer. */
  _jazZeige(f, el, seit) {
    const demo = {
      heizen: { waerme: 17600, strom: 4e3 },
      ww: { waerme: 3900, strom: 1e3 },
      gesamt: { waerme: 21500, strom: 5e3 }
    };
    let ganz;
    try {
      ganz = new Intl.NumberFormat(this._sp(), { maximumFractionDigits: 0 });
    } catch {
      ganz = { format: (v) => fmt(v, 0) };
    }
    let frueh = null;
    el.querySelectorAll("output[data-jaz]").forEach((o) => {
      const r = this._config.demo ? demo[o.dataset.jaz] : this._jaz && this._jaz[o.dataset.jaz];
      if (!r) {
        o.textContent = "--";
        return;
      }
      const w = o.dataset.w;
      o.textContent = w === "jaz" ? fmt(r.waerme / r.strom, 1) : ganz.format(r[w]);
      if (r.erster && r.erster - r.ab > 864e5 && (frueh === null || r.erster < frueh)) frueh = r.erster;
    });
    if (seit) {
      seit.textContent = frueh === null ? "" : tf(this._t("j_seit"), {
        v: new Date(frueh).toLocaleDateString(this._sp(), { day: "2-digit", month: "2-digit", year: "numeric" })
      });
    }
  }
};

// src/karte/solar.js
var STILE = ["strahlen", "funkeln", "roehren"];
var ZELLEN = 15;
var FUNKEN = [[0.2, 0.3], [0.55, 0.7], [0.8, 0.25], [0.4, 0.55], [0.7, 0.45]];
var ROEHREN = 6;
var solarKarte = {
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
    const kante = cx + 65 - 36 * (y - (yc - 40)) / 90;
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
    const strahlen = (farbe) => [0, 45, 90, 135, 180, 225, 270, 315].map((w) => {
      const r = w * Math.PI / 180;
      return `<line x1="${(Math.cos(r) * 14).toFixed(1)}" y1="${(Math.sin(r) * 14).toFixed(1)}"
          x2="${(Math.cos(r) * 20).toFixed(1)}" y2="${(Math.sin(r) * 20).toFixed(1)}"
          stroke="${farbe}" stroke-width="2.2" stroke-linecap="round"/>`;
    }).join("");
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
    const laengs = [1, 2, 3, 4].map((i) => `<line x1="${x + 94 * i / 5}" y1="${u}" x2="${x + 36 + 94 * i / 5}" y2="${o}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`).join("");
    const quer = [1, 2].map((i) => `<line x1="${x + 36 * i / 3}" y1="${u - 90 * i / 3}" x2="${x + 94 + 36 * i / 3}" y2="${u - 90 * i / 3}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`).join("");
    if (stil === "funkeln") {
      const funken = FUNKEN.map(
        (_, i) => `<path id="solar-b-funke${i}" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#FFFFFF" opacity="0"/>`
      ).join("");
      const flimmer = [0, 1, 2, 3].map(
        (k) => `<path id="solar-b-flimmer${k}" d="M0 0 q3 -4 0 -8 q-3 -4 0 -8" fill="none" stroke="#FFC44D" stroke-width="1.8" stroke-linecap="round" opacity="0"/>`
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
    let zellen = "";
    for (let i = 0; i < ZELLEN; i++) {
      const r = Math.floor(i / 5);
      const s = i % 5;
      const yy = u - 90 * (r + 0.5) / 3;
      const xx = x + 36 * (r + 0.5) / 3 + 94 * (s + 0.5) / 5;
      zellen += `<path id="solar-a-zelle${i}" d="M${(xx - 9).toFixed(1)} ${(yy + 13).toFixed(1)} l7 -26 h12 l-7 26 Z" fill="#9FD3FF" opacity="0"/>`;
    }
    const strahl = [0, 1, 2].map(
      (k) => `<line id="solar-a-strahl${k}" x1="${sx + 10}" y1="${sy + 10}" x2="${sx + 10}" y2="${sy + 10}" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>
        <circle id="solar-a-punkt${k}" r="3" fill="#FFF1B8" cx="${sx + 10}" cy="${sy + 10}"/>`
    ).join("");
    const hitze = [0, 1, 2].map(
      (k) => `<path id="solar-a-hitze${k}" d="M0 0 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#FFB070" stroke-width="2" stroke-linecap="round" opacity="0"/>`
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
      if (an) this._solarBildFrame(0.35);
    }
  },
  /** Zeichnet einen Zeitpunkt der Solaranimation. */
  _solarBildFrame(t2) {
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
          const p = (t2 * 0.8 + k / 3 + i * 0.11) % 1;
          setze(`solar-c-${i}-${k}`, {
            cx: (bx + (tx - bx) * p).toFixed(1),
            cy: (u + (o - u) * p).toFixed(1),
            opacity: (0.3 + 0.7 * p).toFixed(2)
          });
        }
      }
      return;
    }
    if (stil === "funkeln") {
      const w = 0.5 + 0.5 * Math.sin(t2 * 1.5);
      setze("solar-b-stop", { offset: (0.3 + 0.4 * w).toFixed(3) });
      FUNKEN.forEach(([a, b], i) => {
        const ph = (t2 * 1.3 + i * 0.37) % 1;
        const s = Math.max(0, Math.sin(ph * Math.PI));
        const yy = u - 90 * b;
        const xx = x + 36 * b + 94 * a;
        setze(`solar-b-funke${i}`, {
          transform: `translate(${xx.toFixed(1)} ${yy.toFixed(1)}) scale(${Math.max(s, 0.01).toFixed(2)})`,
          opacity: s.toFixed(2)
        });
      });
      for (let k = 0; k < 4; k++) {
        const p = (t2 * 0.6 + k / 4) % 1;
        const wx = x + 45 + k * 22 + 2 * Math.sin(t2 * 6 + k);
        setze(`solar-b-flimmer${k}`, {
          transform: `translate(${wx.toFixed(1)} ${(o - 4 - p * 20).toFixed(1)})`,
          opacity: (0.6 * Math.sin(p * Math.PI)).toFixed(2)
        });
      }
      return;
    }
    for (let k = 0; k < 3; k++) {
      const p = (t2 * 0.9 + k / 3) % 1;
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
      const ph = ((t2 * 1.2 - (s + r) * 0.12) % 1 + 1) % 1;
      setze(`solar-a-zelle${i}`, { opacity: (Math.max(0, Math.sin(ph * Math.PI)) * 0.55).toFixed(2) });
    }
    for (let k = 0; k < 3; k++) {
      const p = (t2 * 0.7 + k / 3) % 1;
      setze(`solar-a-hitze${k}`, {
        transform: `translate(${x + 60 + k * 25} ${(o - 6 - p * 18).toFixed(1)})`,
        opacity: (0.8 * Math.sin(p * Math.PI)).toFixed(2)
      });
    }
  }
};

// src/karte/stil.js
var stilKarte = {
  /**
   * Aktualisiert einen Sollwertregler.
   * key      ist die stellbare Entitaet, auf die geschrieben wird.
   * anzeige  ist optional die Entitaet, deren Wert angezeigt wird.
   *          Damit steht am Regler der tatsaechliche Sollwert des
   *          Kreises, auch wenn die stellbare Entitaet etwas
   *          anderes fuehrt.
   */
  /* -------------------- Styles -------------------- */
  _css() {
    return `
      :host { display: block; }
      .lhc { --c-080c12: #080C12; --c-0b1017: #0B1017; --c-0d1219: #0D1219; --c-0d131b: #0D131B; --c-0e1620: #0E1620; --c-0f151e: #0F151E; --c-0f1826: #0F1826; --c-131a24: #131A24; --c-161d28: #161D28; --c-1b2431: #1B2431; --c-1c2533: #1C2533; --c-1e2836: #1E2836; --c-212b39: #212B39; --c-222c3a: #222C3A; --c-232c3a: #232C3A; --c-26303f: #26303F; --c-2a3446: #2A3446; --c-2a3b52: #2A3B52; --c-2b3546: #2B3546; --c-2e3847: #2E3847; --c-2e4661: #2E4661; --c-33415a: #33415A; --c-3a4557: #3A4557; --c-3a4658: #3A4658; --c-3a4757: #3A4757; --c-3e4c61: #3E4C61; --c-46536a: #46536A; --c-55637a: #55637A; --c-55657f: #55657F; --c-6b7a90: #6B7A90; --c-7e8ca0: #7E8CA0; --c-8fa8c8: #8FA8C8; --c-98a6ba: #98A6BA; --c-c3d0e0: #C3D0E0; --c-c9d3e0: #C9D3E0; --c-ddebfa: #DDEBFA; --c-e8edf4: #E8EDF4; }
      .lhc.thema-hell { --c-080c12: #EEF1F5; --c-0b1017: #EEF1F5; --c-0d1219: #EEF1F5; --c-0d131b: #EEF1F5; --c-0e1620: #EBEEF2; --c-0f151e: #ECEFF3; --c-0f1826: #E8EBF0; --c-131a24: #E7EAEE; --c-161d28: #E4E7EB; --c-1b2431: #DDE0E5; --c-1c2533: #DCDFE4; --c-1e2836: #D9DDE1; --c-212b39: #D6DADF; --c-222c3a: #D5D9DE; --c-232c3a: #D5D8DE; --c-26303f: #D1D5DA; --c-2a3446: #CCD0D5; --c-2a3b52: #C6CAD0; --c-2b3546: #CBCFD5; --c-2e3847: #C9CDD3; --c-2e4661: #BCC0C7; --c-33415a: #BFC3C9; --c-3a4557: #BCC0C6; --c-3a4658: #BBC0C6; --c-3a4757: #BBC0C6; --c-3e4c61: #B5BAC0; --c-46536a: #ADB2B9; --c-55637a: #9EA3AB; --c-55657f: #9CA1A8; --c-6b7a90: #898E96; --c-7e8ca0: #787D86; --c-8fa8c8: #5C636D; --c-98a6ba: #5E656F; --c-c3d0e0: #373E4A; --c-c9d3e0: #343B47; --c-ddebfa: #1D2532; --c-e8edf4: #1B2330; }
      .lhc.thema-kontrast { --c-080c12: #000000; --c-0b1017: #000000; --c-0d1219: #000000; --c-0d131b: #000000; --c-0e1620: #131313; --c-0f151e: #111111; --c-0f1826: #1E1E1E; --c-131a24: #212121; --c-161d28: #2A2A2A; --c-1b2431: #383838; --c-1c2533: #3B3B3B; --c-1e2836: #404040; --c-212b39: #454545; --c-222c3a: #474747; --c-232c3a: #474747; --c-26303f: #4E4E4E; --c-2a3446: #555555; --c-2a3b52: #5E5E5E; --c-2b3546: #565656; --c-2e3847: #595959; --c-2e4661: #6B6B6B; --c-33415a: #686868; --c-3a4557: #6B6B6B; --c-3a4658: #6C6C6C; --c-3a4757: #6C6C6C; --c-3e4c61: #747474; --c-46536a: #7D7D7D; --c-55637a: #8E8E8E; --c-55657f: #919191; --c-6b7a90: #A4A4A4; --c-7e8ca0: #B4B4B4; --c-8fa8c8: #CCCCCC; --c-98a6ba: #CACACA; --c-c3d0e0: #EAEAEA; --c-c9d3e0: #EDEDED; --c-ddebfa: #FDFDFD; --c-e8edf4: #FFFFFF; }
      .lhc.thema-nacht { --c-080c12: #030507; --c-0b1017: #030507; --c-0d1219: #030507; --c-0d131b: #030507; --c-0e1620: #040709; --c-0f151e: #040608; --c-0f1826: #06080B; --c-131a24: #07090B; --c-161d28: #080B0D; --c-1b2431: #0C0E11; --c-1c2533: #0C0F12; --c-1e2836: #0E1014; --c-212b39: #0F1216; --c-222c3a: #101316; --c-232c3a: #101316; --c-26303f: #121519; --c-2a3446: #14171C; --c-2a3b52: #171B1F; --c-2b3546: #15181C; --c-2e3847: #16191D; --c-2e4661: #1C2025; --c-33415a: #1B1F24; --c-3a4557: #1C2026; --c-3a4658: #1D2126; --c-3a4757: #1D2126; --c-3e4c61: #20242A; --c-46536a: #24282E; --c-55637a: #2B3038; --c-55657f: #2D3239; --c-6b7a90: #363C45; --c-7e8ca0: #3F464F; --c-8fa8c8: #4D5460; --c-98a6ba: #4C535F; --c-c3d0e0: #606977; --c-c9d3e0: #616A79; --c-ddebfa: #6D7787; --c-e8edf4: #6E7888; }
      .lhc.thema-ha { --c-080c12: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0b1017: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0d1219: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0d131b: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 0%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0e1620: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 1%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0f151e: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 1%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-0f1826: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 3%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-131a24: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 3%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-161d28: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 5%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1b2431: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 8%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1c2533: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 9%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-1e2836: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 10%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-212b39: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 11%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-222c3a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 12%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-232c3a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 12%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-26303f: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 14%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2a3446: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 16%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2a3b52: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 19%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2b3546: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 16%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2e3847: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 17%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-2e4661: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-33415a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 22%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4557: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4658: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3a4757: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 24%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-3e4c61: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 27%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-46536a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 31%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-55637a: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 38%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-55657f: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 39%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-6b7a90: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 48%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-7e8ca0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 56%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-8fa8c8: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 69%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-98a6ba: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 68%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-c3d0e0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 87%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-c9d3e0: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 88%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-ddebfa: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 99%, var(--ha-card-background, var(--card-background-color, #0D131B))); --c-e8edf4: color-mix(in srgb, var(--primary-text-color, #E8EDF4) 100%, var(--ha-card-background, var(--card-background-color, #0D131B))); }
      [fill="#080C12" i] { fill: var(--c-080c12); }
      [stroke="#080C12" i] { stroke: var(--c-080c12); }
      [stop-color="#080C12" i] { stop-color: var(--c-080c12); }
      [fill="#0B1017" i] { fill: var(--c-0b1017); }
      [stroke="#0B1017" i] { stroke: var(--c-0b1017); }
      [stop-color="#0B1017" i] { stop-color: var(--c-0b1017); }
      [fill="#0D1219" i] { fill: var(--c-0d1219); }
      [stroke="#0D1219" i] { stroke: var(--c-0d1219); }
      [stop-color="#0D1219" i] { stop-color: var(--c-0d1219); }
      [fill="#0D131B" i] { fill: var(--c-0d131b); }
      [stroke="#0D131B" i] { stroke: var(--c-0d131b); }
      [stop-color="#0D131B" i] { stop-color: var(--c-0d131b); }
      [fill="#0E1620" i] { fill: var(--c-0e1620); }
      [stroke="#0E1620" i] { stroke: var(--c-0e1620); }
      [stop-color="#0E1620" i] { stop-color: var(--c-0e1620); }
      [fill="#0F151E" i] { fill: var(--c-0f151e); }
      [stroke="#0F151E" i] { stroke: var(--c-0f151e); }
      [stop-color="#0F151E" i] { stop-color: var(--c-0f151e); }
      [fill="#0F1826" i] { fill: var(--c-0f1826); }
      [stroke="#0F1826" i] { stroke: var(--c-0f1826); }
      [stop-color="#0F1826" i] { stop-color: var(--c-0f1826); }
      [fill="#131A24" i] { fill: var(--c-131a24); }
      [stroke="#131A24" i] { stroke: var(--c-131a24); }
      [stop-color="#131A24" i] { stop-color: var(--c-131a24); }
      [fill="#161D28" i] { fill: var(--c-161d28); }
      [stroke="#161D28" i] { stroke: var(--c-161d28); }
      [stop-color="#161D28" i] { stop-color: var(--c-161d28); }
      [fill="#1B2431" i] { fill: var(--c-1b2431); }
      [stroke="#1B2431" i] { stroke: var(--c-1b2431); }
      [stop-color="#1B2431" i] { stop-color: var(--c-1b2431); }
      [fill="#1C2533" i] { fill: var(--c-1c2533); }
      [stroke="#1C2533" i] { stroke: var(--c-1c2533); }
      [stop-color="#1C2533" i] { stop-color: var(--c-1c2533); }
      [fill="#1E2836" i] { fill: var(--c-1e2836); }
      [stroke="#1E2836" i] { stroke: var(--c-1e2836); }
      [stop-color="#1E2836" i] { stop-color: var(--c-1e2836); }
      [fill="#212B39" i] { fill: var(--c-212b39); }
      [stroke="#212B39" i] { stroke: var(--c-212b39); }
      [stop-color="#212B39" i] { stop-color: var(--c-212b39); }
      [fill="#222C3A" i] { fill: var(--c-222c3a); }
      [stroke="#222C3A" i] { stroke: var(--c-222c3a); }
      [stop-color="#222C3A" i] { stop-color: var(--c-222c3a); }
      [fill="#232C3A" i] { fill: var(--c-232c3a); }
      [stroke="#232C3A" i] { stroke: var(--c-232c3a); }
      [stop-color="#232C3A" i] { stop-color: var(--c-232c3a); }
      [fill="#26303F" i] { fill: var(--c-26303f); }
      [stroke="#26303F" i] { stroke: var(--c-26303f); }
      [stop-color="#26303F" i] { stop-color: var(--c-26303f); }
      [fill="#2A3446" i] { fill: var(--c-2a3446); }
      [stroke="#2A3446" i] { stroke: var(--c-2a3446); }
      [stop-color="#2A3446" i] { stop-color: var(--c-2a3446); }
      [fill="#2A3B52" i] { fill: var(--c-2a3b52); }
      [stroke="#2A3B52" i] { stroke: var(--c-2a3b52); }
      [stop-color="#2A3B52" i] { stop-color: var(--c-2a3b52); }
      [fill="#2B3546" i] { fill: var(--c-2b3546); }
      [stroke="#2B3546" i] { stroke: var(--c-2b3546); }
      [stop-color="#2B3546" i] { stop-color: var(--c-2b3546); }
      [fill="#2E3847" i] { fill: var(--c-2e3847); }
      [stroke="#2E3847" i] { stroke: var(--c-2e3847); }
      [stop-color="#2E3847" i] { stop-color: var(--c-2e3847); }
      [fill="#2E4661" i] { fill: var(--c-2e4661); }
      [stroke="#2E4661" i] { stroke: var(--c-2e4661); }
      [stop-color="#2E4661" i] { stop-color: var(--c-2e4661); }
      [fill="#33415A" i] { fill: var(--c-33415a); }
      [stroke="#33415A" i] { stroke: var(--c-33415a); }
      [stop-color="#33415A" i] { stop-color: var(--c-33415a); }
      [fill="#3A4557" i] { fill: var(--c-3a4557); }
      [stroke="#3A4557" i] { stroke: var(--c-3a4557); }
      [stop-color="#3A4557" i] { stop-color: var(--c-3a4557); }
      [fill="#3A4658" i] { fill: var(--c-3a4658); }
      [stroke="#3A4658" i] { stroke: var(--c-3a4658); }
      [stop-color="#3A4658" i] { stop-color: var(--c-3a4658); }
      [fill="#3A4757" i] { fill: var(--c-3a4757); }
      [stroke="#3A4757" i] { stroke: var(--c-3a4757); }
      [stop-color="#3A4757" i] { stop-color: var(--c-3a4757); }
      [fill="#3E4C61" i] { fill: var(--c-3e4c61); }
      [stroke="#3E4C61" i] { stroke: var(--c-3e4c61); }
      [stop-color="#3E4C61" i] { stop-color: var(--c-3e4c61); }
      [fill="#46536A" i] { fill: var(--c-46536a); }
      [stroke="#46536A" i] { stroke: var(--c-46536a); }
      [stop-color="#46536A" i] { stop-color: var(--c-46536a); }
      [fill="#55637A" i] { fill: var(--c-55637a); }
      [stroke="#55637A" i] { stroke: var(--c-55637a); }
      [stop-color="#55637A" i] { stop-color: var(--c-55637a); }
      [fill="#55657F" i] { fill: var(--c-55657f); }
      [stroke="#55657F" i] { stroke: var(--c-55657f); }
      [stop-color="#55657F" i] { stop-color: var(--c-55657f); }
      [fill="#6B7A90" i] { fill: var(--c-6b7a90); }
      [stroke="#6B7A90" i] { stroke: var(--c-6b7a90); }
      [stop-color="#6B7A90" i] { stop-color: var(--c-6b7a90); }
      [fill="#7E8CA0" i] { fill: var(--c-7e8ca0); }
      [stroke="#7E8CA0" i] { stroke: var(--c-7e8ca0); }
      [stop-color="#7E8CA0" i] { stop-color: var(--c-7e8ca0); }
      [fill="#8FA8C8" i] { fill: var(--c-8fa8c8); }
      [stroke="#8FA8C8" i] { stroke: var(--c-8fa8c8); }
      [stop-color="#8FA8C8" i] { stop-color: var(--c-8fa8c8); }
      [fill="#98A6BA" i] { fill: var(--c-98a6ba); }
      [stroke="#98A6BA" i] { stroke: var(--c-98a6ba); }
      [stop-color="#98A6BA" i] { stop-color: var(--c-98a6ba); }
      [fill="#C3D0E0" i] { fill: var(--c-c3d0e0); }
      [stroke="#C3D0E0" i] { stroke: var(--c-c3d0e0); }
      [stop-color="#C3D0E0" i] { stop-color: var(--c-c3d0e0); }
      [fill="#C9D3E0" i] { fill: var(--c-c9d3e0); }
      [stroke="#C9D3E0" i] { stroke: var(--c-c9d3e0); }
      [stop-color="#C9D3E0" i] { stop-color: var(--c-c9d3e0); }
      [fill="#DDEBFA" i] { fill: var(--c-ddebfa); }
      [stroke="#DDEBFA" i] { stroke: var(--c-ddebfa); }
      [stop-color="#DDEBFA" i] { stop-color: var(--c-ddebfa); }
      [fill="#E8EDF4" i] { fill: var(--c-e8edf4); }
      [stroke="#E8EDF4" i] { stroke: var(--c-e8edf4); }
      [stop-color="#E8EDF4" i] { stop-color: var(--c-e8edf4); }
      .lhc {
        --ink: var(--c-e8edf4); --muted: var(--c-7e8ca0); --line: var(--c-26303f); --panel: var(--c-131a24);
        background: linear-gradient(180deg, var(--c-131a24) 0%, var(--c-0d131b) 100%);
        /* Knappe Polsterung, damit die Zeichnung die Karte ausfuellt. */
        color: var(--ink); padding: 6px 8px 12px; overflow: hidden;
        position: relative;
      }
      .lhc-alert {
        margin-bottom: 14px; padding: 12px 16px; border-radius: 10px;
        background: #3A1214; border: 1px solid #D6534A; color: #FFD9D6;
        font-size: 14px; font-weight: 500;
      }
      .lhc-alert[hidden] { display: none; }
      .lhc-hint {
        margin-bottom: 14px; padding: 12px 16px; border-radius: 10px;
        background: #2A2313; border: 1px solid #B07B2E; color: #F2DFB0;
        font-size: 14px;
      }
      .lhc-hint[hidden] { display: none; }

      /* Bedienleiste des Demomodus. */
      .lhc-demo {
        margin-bottom: 14px; padding: 12px 14px; border-radius: 10px;
        background: #16233A; border: 1px solid #3E6EA8;
      }
      .lhc-demo[hidden] { display: none; }
      .lhc-demo-kopf {
        display: flex; align-items: baseline; gap: 12px; margin-bottom: 10px;
        flex-wrap: wrap;
      }
      .lhc-demo-hinweis { font-size: 12px; color: var(--c-8fa8c8); }
      .lhc-demo-reihe { display: flex; flex-wrap: wrap; gap: 8px; }
      .lhc-demo-knopf {
        padding: 7px 12px; border-radius: 8px; cursor: pointer; font: inherit;
        font-size: 13px; background: var(--c-0f1826); color: var(--ink);
        border: 1px solid var(--c-2e4661);
      }
      .lhc-demo-knopf.is-on {
        background: #1E3A5C; border-color: #5A9BD8; color: var(--c-ddebfa);
      }
      .lhc-demo-knopf:hover { border-color: #5A9BD8; }
      .lhc-demo-regler {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px 18px; margin-top: 12px;
      }
      .lhc-demo-schieber { display: flex; flex-direction: column; gap: 4px; }
      .lhc-demo-schieber span { font-size: 12px; color: var(--c-8fa8c8); }
      .lhc-demo-schieber b { color: var(--ink); font-weight: 700; }
      .lhc-demo-schieber input {
        -webkit-appearance: none; appearance: none; width: 100%; height: 5px;
        border-radius: 3px; background: var(--c-2a3b52); outline: none;
      }
      .lhc-demo-schieber input::-webkit-slider-thumb {
        -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
        background: #5A9BD8; border: 2px solid var(--c-0f1826); cursor: pointer;
      }
      .lhc-svg { width: 100%; height: auto; display: block; }

      .pipe-shell {
        fill: none; stroke: var(--c-0b1017); stroke-width: 18;
        stroke-linecap: round; stroke-linejoin: round;
      }
      .pipe {
        fill: none; stroke: ${NEUTRAL}; stroke-width: 9;
        stroke-linecap: round; stroke-linejoin: round; transition: stroke 900ms ease;
      }
      /* Signalleitung des Au\xDFenf\xFChlers, bewusst keine Rohrleitung */
      /* Laufende Striche zeigen an, dass in genau dieser Leitung
         gerade Wasser stroemt. Kurze Punkte verschwinden beim
         Herunterskalieren, daher bewusst lang und kraeftig. */
      .flowdots {
        fill: none; stroke: #FFFFFF; stroke-width: 7;
        stroke-linecap: round; stroke-dasharray: 14 30;
        opacity: 0;
      }
      .flowdots.is-on { opacity: 0.9; }
      /* Schmalere Leitungen fuer Heizkreise, Zusatzwaerme und Zirkulation,
         damit die Geraete und nicht die Rohre das Bild praegen. Die
         Strichlaenge ergibt wie oben 44, sonst springt die Bewegung. */
      .pipe-shell.duenn { stroke-width: 12; }
      .pipe.duenn { stroke-width: 6; }
      .flowdots.duenn { stroke-width: 4; stroke-dasharray: 12 32; }

      .unit-label {
        /* 11px mit engerer Sperrung, sonst passt "Au\xDFentemperatur"
           nicht in die halbe Gehaeusebreite. */
        fill: var(--c-7e8ca0); font-size: 12px; letter-spacing: 0.02em;
      }
      /* Eigene Groesse fuer die beiden Werte im Gehaeuse. Die gemeinsame
         Klasse wird auch ausserhalb verwendet und bleibt unveraendert. */
      .unit-value-s {
        fill: var(--c-e8edf4); font-size: 22px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .verbrauch-v {
        fill: var(--c-e8edf4); font-size: 26px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      #verbrauch-group, #zirkulation-group { transition: opacity 300ms ease; }
      .unit-value {
        fill: var(--c-e8edf4); font-size: 26px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      /* Nicht aktivierte Kreise werden abgeblendet, nicht ausgeblendet.
         So bleibt erkennbar, dass es sie gibt. */
      .is-inaktiv { opacity: 0.28; transition: opacity 600ms ease; }
      #valve-arrow-heiz, #valve-arrow-ww { transition: opacity 400ms ease; }
      .cap { fill: var(--c-98a6ba); font-size: 15px; letter-spacing: 0.02em; }
      .cap-s { fill: var(--c-7e8ca0); font-size: 13px; letter-spacing: 0.02em; }
      .value-l {
        fill: #FFFFFF; font-size: 30px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
        paint-order: stroke; stroke: rgba(0,0,0,0.45); stroke-width: 5px;
      }
      .value-s {
        fill: var(--c-98a6ba); font-size: 14px;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      /* Rot gehoert zum Vorlauf, blau zur Aussentemperatur. Achse,
         Teilstriche, Beschriftung und Markierung teilen sich die Farbe. */
      .kurve-achse { font-size: 15px; letter-spacing: 0.02em; }
      .achse-vl { fill: #FF8A5F; font-size: 13px; }
      .achse-aussen { fill: #6BB7E8; font-size: 13px; }
      /* Gruen kennzeichnet den aktuellen Betriebspunkt. */
      .ist-jetzt { fill: #46C07A; font-size: 13px; }
      .kurve-achse.achse-vl, .kurve-achse.achse-aussen { font-size: 15px; }
      /* Die Farbe kommt von der Achsenklasse, hier nur Groesse und Schnitt. */
      .kurve-marke-t {
        font-size: 14px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .hinweis-s { fill: var(--c-6b7a90); font-size: 11px; }
      .value-sp { fill: rgba(255,255,255,0.85); font-size: 17px; }
      /* Werte der Heizkreise stehen frei unter dem Heizkoerper. */
      .lhc .hk-wert { fill: var(--c-e8edf4); font-size: 22px; }
      .lhc .value-sp.verlauf-text { fill: var(--c-e8edf4); }
      .lhc rect.fest-dunkel { fill: #0B1017; }
      /* Namensschilder liegen auf farbigen Flaechen, nachts nicht zu dunkel. */
      .lhc.thema-nacht .cap { fill: #A3ADBD; }
      /* Auf hellem Grund sind gelbe und hellgruene Werte zu blass. Farbige
         Texte werden dort dunkler, weisse Texte auf den Speichern nicht. */
      .lhc.thema-hell svg text:not(.value-l):not(.value-sp):not(.tag-v):not(.cap) {
        filter: brightness(0.72) saturate(1.25);
      }
      /* Weiss mit dunklem Rand wie die Temperatur, damit der Wert auf
         jeder Speicherfarbe lesbar bleibt. */
      .value-cop {
        fill: #FFFFFF; font-size: 17px; font-weight: 700;
        paint-order: stroke; stroke: rgba(0,0,0,0.5); stroke-width: 4px;
      }
      /* Aufsteigende Blasen. Je waermer der Speicher, desto mehr
         davon werden sichtbar geschaltet. */
      .bubble {
        fill: #FFFFFF;
      }
      /* Vorlauf rot, Ruecklauf blau, unabhaengig von der Temperatur. */
      .vl-value, .rl-value {
        font-size: 22px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .vl-value { fill: #FF5F52; }
      .rl-value { fill: #4D9BFF; }
      /* Die Schilder tragen die Farbe des zugehoerigen Wertes und
         stehen als einzige in Grossbuchstaben, das hebt die beiden
         Hauptleitungen hervor. */
      .vl-cap { fill: #FF5F52; text-transform: uppercase; letter-spacing: 0.08em; }
      .rl-cap { fill: #4D9BFF; text-transform: uppercase; letter-spacing: 0.08em; }
      .tag-v {
        fill: #FFFFFF; font-size: 19px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .badge-t { fill: var(--c-e8edf4); font-size: 13px; }
      .modus-t { font-size: 22px; font-weight: 700; }
      .modus-zeile { fill: var(--c-c3d0e0); font-size: 13px; letter-spacing: 0.02em; }
      .modus { transition: color 400ms ease; }
      .badge { opacity: 0; transition: opacity 300ms ease; }
      .badge.is-on { opacity: 1; }

      .pv-value {
        fill: #7BD88F; font-size: 26px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      #pv-group { transition: opacity 300ms ease; }
      .sg-label {
        fill: var(--c-c3d0e0); font-size: 13px; letter-spacing: 0.02em;
      }
      .sg-value {
        /* 13px, damit auch der laengste Zustand "PV Ueberschuss High"
           innerhalb der Trennlinie darunter bleibt. */
        fill: ${NEUTRAL}; font-size: 13px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums; transition: fill 400ms ease;
      }
      #sg-group { transition: opacity 300ms ease; }
      #sg-group rect { transition: all 400ms ease; }
      /* Der aktive Balken leuchtet, damit er sich klar abhebt. */
      #sg-group rect.is-active { filter: drop-shadow(0 0 5px currentColor); }
      #unit-glow { transition: none; }
      #press-group { transition: opacity 300ms ease; }
      #press-needle { transition: all 900ms ease; }

      /* Die Rotoren tragen selbst kein transform-Attribut, sonst wuerde
         die Animation es ueberschreiben und sie an den Nullpunkt werfen. */
      .rotor {
        transform-origin: 0 0;
      }
      .rotor .blades path { fill: var(--c-55637a); }
      .rotor.is-still .blades path, .rotor.is-still > path { fill: var(--c-3a4557); }

      .lhc-wert {
        display: flex; justify-content: space-between; align-items: center;
        width: 100%; gap: 12px; margin-top: 3px; padding: 5px 12px;
        background: var(--c-0d131b); color: var(--ink); font: inherit; font-size: 14px;
        border: 1px solid var(--line); border-radius: 8px;
        cursor: pointer; text-align: left;
      }
      .lhc-wert:hover { border-color: var(--c-55657f); }
      .lhc-wert b {
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums; white-space: nowrap;
      }
      #dlg-werte .lhc-field-label { display: block; margin-top: 8px; }

      .lhc-field-label {
        font-size: 12px; letter-spacing: 0.02em; color: var(--muted);
      }
      .lhc-dlg-hinweis {
        text-align: center; font-size: 12px; color: var(--muted); min-height: 0;
      }
      .lhc-dlg-hinweis:empty { display: none; }
      .lhc-ctl-scale {
        display: flex; justify-content: space-between; margin-top: 6px;
        font-size: 11px; color: var(--muted);
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-slider {
        -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
        border-radius: 3px; background: var(--c-26303f); outline: none;
      }
      .lhc-slider:disabled { opacity: 0.4; }
      .lhc-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid var(--c-0d131b);
        cursor: pointer; box-shadow: 0 0 0 1px var(--c-3a4757);
      }
      .lhc-slider::-moz-range-thumb {
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid var(--c-0d131b); cursor: pointer;
      }
      .lhc-slider:focus-visible { box-shadow: 0 0 0 3px rgba(224,118,46,0.4); }
      /* Anklickbare Baugruppen und das Einstellfenster. */
      .klickbar { cursor: pointer; }
      /* Kein filter: der zwingt den Browser, die Vektorgrafik zu rastern,
         dadurch werden Linien und Schrift beim Ueberfahren unscharf. */
      .klickbar:hover { opacity: 0.82; }
      .lhc-dialog {
        position: absolute; inset: 0; z-index: 5;
        display: flex; align-items: center; justify-content: center;
        padding: 12px; background: rgba(6, 10, 16, 0.72);
      }
      .lhc-dialog[hidden] { display: none; }
      .lhc-dialog-box {
        /* Die Karte schneidet Ueberstehendes ab. Darum wird der Kasten
           auf die Kartenhoehe begrenzt und bekommt bei Bedarf einen
           eigenen Rollbalken. */
        box-sizing: border-box;
        width: min(360px, 100%); max-height: 100%; overflow-y: auto;
        padding: 12px 16px; border-radius: 16px;
        background: var(--c-161d28); border: 1px solid var(--line);
        box-shadow: 0 18px 48px rgba(0,0,0,0.55);
      }
      .lhc-dialog-head {
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
      }
      .lhc-dialog-title {
        font-size: 13px; letter-spacing: 0.02em;
        color: var(--muted);
      }
      .lhc-dialog-close {
        background: none; border: none; color: var(--muted); cursor: pointer;
        font-size: 26px; line-height: 1; padding: 0 4px;
      }
      .lhc-dialog-close:hover { color: var(--ink); }
      .lhc-dialog-value {
        display: block; margin: 4px 0 8px; text-align: center;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums;
      }
      .lhc-dialog-row { display: flex; align-items: center; gap: 14px; }
      .lhc-step {
        width: 44px; height: 44px; flex: 0 0 auto; border-radius: 12px;
        background: var(--c-1b2431); border: 1px solid var(--line); color: var(--ink);
        font-size: 24px; line-height: 1; cursor: pointer;
      }
      .lhc-step:hover { border-color: var(--c-3e4c61); }
      .lhc-step:focus-visible { outline: 2px solid #E0762E; outline-offset: 2px; }
      /* Zwei Spalten: die Auswahlfelder stehen nebeneinander, die
         Schaltflaechen laufen ueber die volle Breite. Das spart Hoehe. */
      #dlg-actions {
        display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 8px;
      }
      /* Nur im Fenster der Baugruppen ueber die volle Breite. Im
         Kurvenfenster sollen die Regler zweispaltig bleiben. */
      #dlg-actions > .lhc-num-kompakt { grid-column: 1 / -1; }
      .lhc-dialog-action {
        width: 100%; margin-top: 0; padding: 8px 14px; border-radius: 12px;
        grid-column: 1 / -1;
        /* Kurze Beschriftungen duerfen sich eine Zeile teilen. */
        font: inherit; font-size: 15px; font-weight: 500; cursor: pointer;
        background: var(--c-1b2431); border: 1px solid var(--line); color: var(--ink);
      }
      .lhc-dialog-action[hidden] { display: none; }
      .lhc-dialog-action:hover { border-color: var(--c-3e4c61); }
      .lhc-dialog-action.is-an {
        background: #0E2E1C; border-color: #46C07A; color: #BFEFD2;
      }
      .lhc-dialog-action.is-aus {
        background: #2E1112; border-color: #D6534A; color: #F3C6C3;
      }
      .lhc-dialog-action.schmal { grid-column: auto; }
      .lhc-dialog-action:disabled {
        opacity: 0.45; cursor: not-allowed;
        background: var(--c-1b2431); border-color: var(--line); color: var(--muted);
      }
      .lhc-dialog-action:focus-visible { outline: 2px solid #E0762E; outline-offset: 2px; }
      #dlg-temp[hidden] { display: none; }
      #dlg-temp.nur-lesbar { opacity: 0.45; }
      /* Das Kurvenfenster liegt ueber dem ganzen Bildschirm, nicht nur
         ueber der Karte. Sonst waere es auf die Kartenhoehe begrenzt,
         die im Querformat nur gut 200 Pixel betraegt. */
      #kurve-dialog {
        position: fixed; inset: 0; z-index: 99;
      }
      /* Diagrammfenster: wie die Heizkurve ueber dem ganzen Bildschirm. */
      #dia-dialog { position: fixed; inset: 0; z-index: 99; }
      .lhc-kurve-box.lhc-dia-box { width: min(94vw, 680px); }
      /* Im Fenster steht der Titel schon oben. */
      #dia-verbrauch .verlauf-titel { display: none; }
      .lhc-dia-box:focus { outline: none; }
      .lhc-dia-svg { display: block; width: 100%; height: auto; margin-top: 10px; }
      .lhc-dia-liste { margin-top: 8px; }
      .lhc-dia-zeile {
        display: grid; grid-template-columns: 14px 1fr auto auto; gap: 10px; align-items: center;
        padding: 6px 2px; border-top: 1px solid var(--line); font-size: 14px; color: var(--c-c3d0e0);
      }
      .lhc-dia-zeile b { font-variant-numeric: tabular-nums; color: var(--c-e8edf4); }
      .lhc-dia-zeile em { font-style: normal; color: var(--c-7e8ca0); font-size: 13px; }
      .lhc-dia-farbe { width: 14px; height: 14px; border-radius: 4px; }
      .dia-knopf { cursor: pointer; }
      .dia-knopf .dia-symbol { color: var(--c-98a6ba); }
      .dia-knopf:hover rect, .dia-knopf:focus-visible rect { stroke: #E0762E; }
      .dia-knopf:hover .dia-symbol, .dia-knopf:focus-visible .dia-symbol { color: #E0762E; }
      .dia-knopf:focus { outline: none; }
      .lhc-kurve-box {
        /* Eine Spalte braucht weniger Platz als zwei. */
        /* Auf grossen Bildschirmen zwei Drittel, auf dem Handy fast die
           ganze Breite, sonst waere das Diagramm zu schmal. */
        box-sizing: border-box; width: min(94vw, 560px); max-height: 92vh;
        overflow-y: auto; padding: 16px 18px 14px; border-radius: 16px;
        background: var(--c-161d28); border: 1px solid var(--line);
        box-shadow: 0 18px 48px rgba(0,0,0,0.55);
      }
      .lhc-kurve-titel {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 16px; font-weight: 600; color: var(--c-e8edf4); margin-bottom: 8px;
      }
      .lhc-kurve-reihe { display: flex; gap: 18px; align-items: flex-start; }
      .lhc-kurve-spalte { flex: 1; min-width: 0; }
      .lhc-kurve-spalte[hidden] { display: none; }
      .lhc-kurve-kopf {
        display: flex; justify-content: space-between; align-items: baseline;
        font-size: 13px; color: var(--c-98a6ba); margin-bottom: 4px;
        border-bottom: 1px solid var(--line); padding-bottom: 4px;
      }
      .lhc-kurve-soll {
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: var(--c-c3d0e0);
      }
      .ist-jetzt-html { color: #46C07A; }
      .vl-html { color: #FF8A5F; }
      .lhc-kurve-svg { width: 100%; height: auto; display: block; }
      .lhc-kurve-regler {
        margin-top: 4px; display: grid; grid-template-columns: 1fr 1fr;
        gap: 4px 14px;
      }
      .lhc-num-kompakt {
        display: flex; align-items: center; gap: 6px; padding: 2px 0;
        font-size: 12px; color: var(--c-98a6ba);
      }
      .lhc-num-kompakt span { flex: 1; min-width: 0; }
      /* Dieselbe Zuordnung wie im Diagramm: orange Vorlauf, blau au\xDFen. */
      .lhc-num-kompakt.ist-vl span, .lhc-num-kompakt.ist-vl output { color: #FF8A5F; }
      .lhc-num-kompakt.ist-aussen span, .lhc-num-kompakt.ist-aussen output { color: #6BB7E8; }
      .lhc-num-kompakt output {
        min-width: 58px; text-align: right; font-size: 13px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: var(--c-e8edf4);
      }
      /* Die Tuer ist eine eigene Ebene ueber der Waermepumpe. Gedreht wird
         nur diese Ebene, das uebernimmt die Grafikkarte. Die SVG-Gruppe
         selbst bleibt unbewegt und ist waehrenddessen ausgeblendet. */
      .tuer-zu #unit-group, .tuer-offen #unit-group { visibility: hidden; }
      .lhc-tuer-blatt {
        position: absolute; z-index: 3; pointer-events: none;
        transform-origin: 0% 50%; will-change: transform;
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        transform: perspective(1400px) rotateY(0deg);
        transition: transform 700ms cubic-bezier(0.45, 0.05, 0.2, 1);
      }
      .lhc-tuer-blatt.auf { transform: perspective(1400px) rotateY(-100deg); }
      .lhc-tuer-blatt svg { display: block; width: 100%; height: 100%; overflow: visible; }
      .tuer-knopf { cursor: pointer; outline: none; }
      .tuer-knopf:hover > circle:first-of-type,
      .tuer-knopf:focus-visible > circle:first-of-type { stroke: #E0762E; }
      .lhc-tuer {
        position: absolute; z-index: 4; box-sizing: border-box;
        display: flex; flex-direction: column; gap: 6px; padding: 10px 10px;
        background: var(--c-080c12); border: 1px solid var(--c-33415a); border-radius: 14px;
        color: var(--ink); opacity: 0; transition: opacity 260ms ease 520ms;
      }
      .lhc-tuer[hidden] { display: none; }
      .lhc-tuer.sichtbar { opacity: 1; }
      /* Beim Schliessen sofort ausblenden, dann klappt die Tuer zu. */
      .lhc-tuer:not(.sichtbar) { transition-delay: 0ms; }
      .lhc-tuer-kopf { font-size: 14px; font-weight: 600; text-align: center; color: var(--c-e8edf4); }
      .lhc-tuer-liste {
        flex: 1; min-height: 0; overflow-y: auto;
        display: flex; flex-direction: column; gap: 3px;
      }
      .lhc-hilfe-knopf {
        position: absolute; right: 14px; bottom: 14px; z-index: 2;
        width: 44px; height: 44px; border-radius: 50%; padding: 0;
        border: 1px solid var(--c-55657f); background: var(--c-0d1219); color: var(--c-c3d0e0);
        font-size: 20px; font-weight: 700; line-height: 1; cursor: pointer;
      }
      .lhc-hilfe-box:focus { outline: none; }
      .lhc-hilfe-knopf:hover, .lhc-hilfe-knopf:focus-visible { border-color: #E0762E; color: #E0762E; outline: none; }
      .lhc-hilfe {
        position: fixed; inset: 0; z-index: 100;
        display: flex; align-items: center; justify-content: center;
        padding: 12px; background: rgba(6, 10, 16, 0.72);
      }
      .lhc-hilfe[hidden] { display: none; }
      .lhc-hilfe-box {
        box-sizing: border-box; width: min(96vw, 920px); height: min(92vh, 900px);
        display: flex; flex-direction: column; gap: 10px; padding: 16px 18px 12px;
        background: var(--c-161d28); border: 1px solid var(--line); border-radius: 16px;
        box-shadow: 0 18px 48px rgba(0,0,0,0.55); color: var(--c-e8edf4);
      }
      .lhc-hilfe-kopf {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 17px; font-weight: 600;
      }
      .lhc-hilfe-suche {
        box-sizing: border-box; width: 100%; padding: 10px 12px; border-radius: 10px;
        border: 1px solid var(--c-33415a); background: var(--c-0d1219); color: var(--c-e8edf4); font-size: 15px;
      }
      .lhc-hilfe-suche:focus { outline: none; border-color: #E0762E; }
      .lhc-hilfe-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .lhc-hilfe-chips button {
        border: 1px solid var(--c-33415a); background: transparent; color: var(--c-98a6ba);
        border-radius: 999px; padding: 4px 10px; font-size: 12.5px; cursor: pointer;
      }
      /* Auf schmalen Bildschirmen eine Zeile zum Wischen statt vieler Zeilen. */
      @media (max-width: 700px) {
        .lhc-hilfe-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
        .lhc-hilfe-chips button { flex: 0 0 auto; }
        .lhc-hilfe-box { padding: 12px 12px 10px; }
      }
      .lhc-hilfe-chips button.aktiv { background: var(--c-26303f); color: var(--c-e8edf4); border-color: var(--c-55657f); }
      .lhc-hilfe-liste { flex: 1; min-height: 0; overflow-y: auto; padding-right: 4px; }
      .lhc-hilfe-liste h3 {
        margin: 14px 0 6px; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: #E0762E;
      }
      .lhc-hilfe-liste section:first-child h3 { margin-top: 2px; }
      .lhc-hilfe-liste article {
        padding: 9px 11px; margin-bottom: 6px; border-radius: 10px;
        background: var(--c-0f151e); border: 1px solid var(--c-222c3a);
      }
      .lhc-hilfe-liste .eintrag-kopf { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .lhc-hilfe-liste .eintrag-kopf b { font-size: 14.5px; margin-right: 4px; }
      .lhc-hilfe-liste .marke {
        font-size: 11px; padding: 2px 7px; border-radius: 6px; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-hilfe-liste .marke.lesen { background: #12304A; color: #8CC4F0; }
      .lhc-hilfe-liste .marke.schreiben { background: #3A2410; color: #F2A86A; }
      .lhc-hilfe-liste .marke.bereich { background: var(--c-1c2533); color: var(--c-c3d0e0); }
      .lhc-hilfe-liste p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--c-c9d3e0); }
      .lhc-hilfe-liste .keine { color: var(--c-98a6ba); text-align: center; margin-top: 30px; }
      .lhc-hilfe-liste .entitaeten { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .lhc-hilfe-liste .entitaet {
        position: relative; display: inline-flex; align-items: center; gap: 6px;
        max-width: 100%; padding: 4px 8px; border-radius: 7px; cursor: pointer;
        border: 1px solid var(--c-33415a); background: var(--c-0d1219); color: var(--c-c3d0e0);
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      .lhc-hilfe-liste .entitaet span { overflow-wrap: anywhere; text-align: left; }
      .lhc-hilfe-liste .entitaet svg { width: 13px; height: 13px; flex: 0 0 auto; fill: currentColor; opacity: 0.7; }
      .lhc-hilfe-liste .entitaet:hover { border-color: #E0762E; color: var(--c-e8edf4); }
      .lhc-hilfe-liste .entitaet.kopiert { border-color: #46C07A; color: #46C07A; }
      .lhc-hilfe-liste .entitaet.kopiert::after {
        content: attr(data-hinweis); position: absolute; right: 6px; top: -22px;
        background: #46C07A; color: var(--c-0d131b); font-family: inherit; font-size: 11px;
        font-weight: 700; padding: 2px 6px; border-radius: 5px;
      }
      .lhc-hilfe-liste .keine-entitaet { font-size: 12px; color: var(--c-6b7a90); font-style: italic; }
      .lhc-hilfe-fuss { font-size: 11.5px; color: var(--c-7e8ca0); line-height: 1.4; }
      .lhc-tuer-gruppe { display: flex; flex-direction: column; gap: 3px; break-inside: avoid; }
      .lhc-tuer.zwei .lhc-tuer-liste { display: block; column-count: var(--spalten, 2); column-gap: 16px; }
      .lhc-tuer.zwei .lhc-tuer-gruppe { margin-bottom: 4px; }
      .lhc-tuer-abschnitt {
        font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
        color: var(--muted); margin-top: 5px;
      }
      .lhc-tuer-zeile {
        display: flex; align-items: center; justify-content: space-between;
        gap: 6px; font-size: 12.5px; line-height: 1.2; min-height: 28px;
      }
      .lhc-tuer-zeile > span { flex: 1; min-width: 0; }
      .lhc-tuer-zeile.spalte { flex-direction: column; align-items: stretch; gap: 4px; }
      .lhc-tuer-zeile.spalte .lhc-tuer-seg button { flex: 1; }
      .lhc-tuer-zeile em { color: var(--muted); font-style: normal; font-size: 11px; }
      .lhc-tuer-gruppe em.jaz-seit { display: block; color: var(--muted); font-style: normal; font-size: 11px; margin: 2px 0 4px; }
      .lhc-jaz {
        display: grid; grid-template-columns: minmax(0, 1fr) auto auto auto; column-gap: 10px; row-gap: 6px;
        align-items: baseline; font-size: 12px; padding: 4px 12px 2px 0;
      }
      .lhc-jaz .jaz-wert { color: var(--c-e8edf4); }
      .lhc-jaz .jaz-kopf { color: var(--muted); font-size: 11px; text-align: right; white-space: nowrap; }
      .lhc-jaz .jaz-art { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .lhc-jaz output {
        text-align: right; min-width: 0; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-jaz .jaz-gesamt { font-weight: 700; border-top: 1px solid var(--c-33415a); padding-top: 5px; }
      .lhc-tuer-stell { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
      .lhc-tuer-stell output {
        min-width: 50px; text-align: center; font-size: 13px; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-tuer-stell output.geaendert, .lhc-tuer-seg button.geaendert { color: #E0762E; font-weight: 700; }
      .lhc-tuer-seg {
        display: flex; flex: 0 0 auto; border: 1px solid var(--line);
        border-radius: 8px; overflow: hidden;
      }
      .lhc-tuer-seg button {
        background: transparent; color: var(--muted); border: 0;
        padding: 5px 6px; font-size: 11.5px; cursor: pointer; white-space: nowrap;
      }
      .lhc-tuer-seg button.aktiv { background: var(--c-26303f); color: var(--c-e8edf4); }
      .lhc-tuer-seg button:disabled { cursor: default; }
      .lhc-tuer-fuss { display: flex; gap: 8px; }
      .lhc-tuer-knopf {
        flex: 1; padding: 8px; border-radius: 9px; border: 1px solid var(--line);
        background: var(--c-131a24); color: var(--c-e8edf4); font-size: 13px; cursor: pointer;
      }
      .lhc-tuer-knopf.primaer { background: #E0762E; border-color: #E0762E; color: var(--c-0d131b); font-weight: 600; }
      .lhc-step.klein {
        width: 26px; height: 26px; padding: 0; font-size: 15px; line-height: 1;
      }
      .lhc-step:disabled { opacity: 0.3; cursor: default; }
      .lhc-dialog-select {
        display: flex; flex-direction: column; gap: 2px; margin-top: 0;
      }
      .lhc-dialog-select select {
        background: var(--c-0d131b); color: var(--ink); font: inherit; font-size: 15px;
        border: 1px solid var(--line); border-radius: 12px; padding: 7px 10px; width: 100%;
      }

      }
    `;
  }
};

// src/karte/tuer.js
var tuerKarte = {
  /* -------------------- Tuer der Waermepumpe -------------------- */
  /**
   * Knopf unten rechts in der Waermepumpe. Die Front klappt nach links
   * auf, dahinter liegen Einstellungen, die in der Karte sonst nicht zu
   * sehen sind. Aenderungen werden erst mit "Uebernehmen" gesendet.
   */
  _buildTuer() {
    const sr = this.shadowRoot;
    const knopf = sr.getElementById("tuer-knopf");
    if (knopf) {
      const auf = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        this._oeffneTuer();
      };
      knopf.addEventListener("click", auf);
      knopf.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") auf(ev);
      });
    }
    const ab = sr.getElementById("tuer-abbrechen");
    const ok = sr.getElementById("tuer-ok");
    if (ab) ab.addEventListener("click", () => this._schliesseTuer());
    if (ok) ok.addEventListener("click", () => this._tuerUebernehmen());
  },
  /** Aktualisiert die COP-Zeilen, solange die Tuer offen ist. */
  _tuerCopAuffrischen() {
    if (!this._tuerListe) return;
    const panel = this.shadowRoot.getElementById("tuer-panel");
    if (!panel || panel.hidden) return;
    this._tuerListe.forEach((f, i) => {
      if (f.cop) this._tuerZeige(i);
    });
  },
  /** Einstellungen, zu denen es eine Entitaet gibt. */
  _tuerFelder() {
    const q = this._quelle;
    if (!q) return [];
    const jaz = this._jazQuellen();
    return TUER_FELDER.map(
      (f) => f.jaz ? { ...f, id: jaz ? "jaz.tabelle" : "" } : { ...f, id: this._e(f.key) }
    ).filter((f) => f.id && (f.jaz || q.states[f.id]));
  },
  _oeffneTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (karte.classList.contains("tuer-offen")) return;
    this._tuerNeu = {};
    this._tuerZeilen();
    this._ladeJaz();
    const blatt = this._tuerBlatt();
    karte.classList.add("tuer-offen");
    karte.classList.remove("tuer-zu");
    panel.hidden = false;
    this._tuerLage();
    requestAnimationFrame(
      () => requestAnimationFrame(() => {
        if (blatt) blatt.classList.add("auf");
        panel.classList.add("sichtbar");
      })
    );
  },
  _schliesseTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (!karte.classList.contains("tuer-offen")) return;
    panel.classList.remove("sichtbar");
    this._tuerNeu = {};
    karte.classList.remove("tuer-offen");
    karte.classList.add("tuer-zu");
    const blatt = this.shadowRoot.getElementById("tuer-blatt");
    const fertig = () => {
      if (karte.classList.contains("tuer-offen")) return;
      karte.classList.remove("tuer-zu");
      if (blatt) blatt.remove();
      panel.hidden = true;
    };
    if (blatt) {
      blatt.classList.remove("auf");
      blatt.addEventListener("transitionend", fertig, { once: true });
      setTimeout(fertig, 900);
    } else {
      fertig();
    }
  },
  /**
   * Legt eine Kopie der Front als eigene Ebene genau ueber die
   * Waermepumpe. Die Kopie ist unbewegt und ohne Weichzeichner, damit
   * das Drehen fluessig bleibt.
   */
  _tuerBlatt() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const gruppe = sr.getElementById("unit-group");
    const innen = sr.getElementById("unit-innen");
    const svg = gruppe && gruppe.ownerSVGElement;
    if (!karte || !gruppe || !innen || !svg) return null;
    const alt = sr.getElementById("tuer-blatt");
    if (alt) alt.remove();
    const rahmen = innen.querySelector("rect");
    const x = Number(rahmen.getAttribute("x"));
    const y = Number(rahmen.getAttribute("y"));
    const w = Number(rahmen.getAttribute("width"));
    const h = Number(rahmen.getAttribute("height"));
    const k = karte.getBoundingClientRect();
    const r = rahmen.getBoundingClientRect();
    const kopie = gruppe.cloneNode(true);
    kopie.removeAttribute("class");
    kopie.querySelectorAll("[id]").forEach((n) => {
      if (n.id === "unit-glow") n.remove();
      else n.removeAttribute("id");
    });
    kopie.removeAttribute("id");
    const blatt = document.createElement("div");
    blatt.className = "lhc-tuer-blatt";
    blatt.id = "tuer-blatt";
    Object.assign(blatt.style, {
      left: `${r.left - k.left}px`,
      top: `${r.top - k.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`
    });
    const ns = "http://www.w3.org/2000/svg";
    const bild = document.createElementNS(ns, "svg");
    bild.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    bild.setAttribute("preserveAspectRatio", "none");
    bild.appendChild(kopie);
    blatt.appendChild(bild);
    karte.appendChild(blatt);
    return blatt;
  },
  /**
   * Legt das Feld genau ueber den Innenraum der Waermepumpe. Ist die
   * Karte klein, wird es breiter und hoeher als der Innenraum, damit die
   * Bedienelemente lesbar bleiben, und bleibt innerhalb der Karte.
   */
  _tuerLage() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const innen = sr.getElementById("unit-innen");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !innen || !panel) return;
    const k = karte.getBoundingClientRect();
    const r = innen.getBoundingClientRect();
    let links = r.left - k.left;
    let oben = r.top - k.top;
    let breite = r.width >= 230 ? r.width : 260;
    let hoehe = Math.max(r.height, Math.min(440, k.height - 8));
    if (links + breite > k.width - 4) links = Math.max(4, k.width - 4 - breite);
    if (oben + hoehe > k.height - 4) oben = Math.max(4, k.height - 4 - hoehe);
    hoehe = Math.min(hoehe, k.height - 8);
    panel.classList.remove("zwei");
    Object.assign(panel.style, {
      left: `${links}px`,
      top: `${oben}px`,
      width: `${breite}px`,
      height: `${hoehe}px`
    });
    const liste = sr.getElementById("tuer-liste");
    panel.style.removeProperty("--spalten");
    for (let spalten = 2; spalten <= 3; spalten++) {
      if (!liste || liste.scrollHeight <= liste.clientHeight + 1) break;
      const breiteN = Math.max(breite, 230 * spalten + 16 * (spalten - 1) + 20);
      if (breiteN > k.width - 8) break;
      let l = links;
      if (l + breiteN > k.width - 4) l = Math.max(4, k.width - 4 - breiteN);
      panel.classList.add("zwei");
      panel.style.setProperty("--spalten", String(spalten));
      Object.assign(panel.style, { left: `${l}px`, width: `${breiteN}px` });
    }
  },
  /** Baut die Zeilen aus dem aktuellen Stand der Entitaeten. */
  _tuerZeilen() {
    const sr = this.shadowRoot;
    const liste = sr.getElementById("tuer-liste");
    if (!liste) return;
    const q = this._quelle;
    const demo = Boolean(this._config.demo);
    const felder = this._tuerFelder();
    let abschnitt = "";
    let html = "";
    felder.forEach((f, i) => {
      if (f.abschnitt !== abschnitt) {
        if (abschnitt) html += "</div>";
        abschnitt = f.abschnitt;
        html += `<div class="lhc-tuer-gruppe"><div class="lhc-tuer-abschnitt">${escapeHtml(this._t(abschnitt))}</div>`;
      }
      const titel = escapeHtml(this._t(`k_${f.key}`));
      const lang = escapeHtml(feldText(f, this._sp()));
      const bereich = f.id.split(".")[0];
      if (f.cop) {
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${escapeHtml(this._t(`j_${f.cop}`))}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;
        return;
      }
      if (f.jaz) {
        const quellen = this._jazQuellen() || {};
        const arten = ["heizen", "ww"].filter((k) => quellen[k]);
        if (arten.length === 2) arten.push("gesamt");
        const zellen = arten.map((k) => {
          const kl = k === "gesamt" ? "jaz-gesamt" : "";
          return `<span class="jaz-art ${kl}">${escapeHtml(this._t(`j_${k}`))}</span>
              <output class="${kl}" data-jaz="${k}" data-w="waerme">--</output>
              <output class="${kl}" data-jaz="${k}" data-w="strom">--</output>
              <output class="${kl} jaz-wert" data-jaz="${k}" data-w="jaz">--</output>`;
        }).join("");
        html += `<div class="lhc-jaz" id="tuer-z${i}">
            <span></span><span class="jaz-kopf">${escapeHtml(this._t("j_kwaerme"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kstrom"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kjaz"))}</span>
            ${zellen}
          </div><em class="jaz-seit">${escapeHtml(this._t("j_unter"))}</em><em class="jaz-seit" id="tuer-s${i}"></em>`;
        return;
      }
      if (f.info) {
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;
        return;
      }
      if (f.knopf) {
        const kann = demo || bereich === "button" || bereich === "input_button";
        const code = rawState(q, this._e("error"));
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${code && code !== "unknown" && code !== "unavailable" ? ` <em>${escapeHtml(code)}</em>` : ""}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}"><button type="button" data-i="${i}" data-o="press"
            ${kann ? "" : "disabled"}>${escapeHtml(this._t("t_quittieren"))}</button></div></div>`;
        return;
      }
      if (f.schalter) {
        const kann = demo || bereich === "switch" || bereich === "input_boolean";
        const knoepfe = [["off", "o_aus"], ["on", "o_ein"]].map(([o, t2]) => `<button type="button" data-i="${i}" data-o="${o}"
              ${kann ? "" : "disabled"}>${escapeHtml(this._t(t2))}</button>`).join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
        return;
      }
      if (f.auswahl) {
        const st = q.states[f.id];
        const optionen = st.attributes && st.attributes.options || [];
        const kann = demo || bereich === "select" || bereich === "input_select";
        const intern = optionen.length === f.auswahl.length && optionen.every((o, n) => o === `mode_${n}`);
        const knoepfe = optionen.map((o, n) => {
          const text = intern ? this._t(f.auswahl[n]) : o;
          return `<button type="button" data-i="${i}" data-o="${escapeHtml(o)}"
              ${kann ? "" : "disabled"}>${escapeHtml(text)}</button>`;
        }).join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
      } else {
        const kann = demo || stellbar(f.id);
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${kann ? "" : `<em> (${escapeHtml(this._t("t_nur_lesbar"))})</em>`}</span>
          <div class="lhc-tuer-stell">
            ${kann ? `<button type="button" class="lhc-step klein" data-i="${i}" data-r="-1">&minus;</button>` : ""}
            <output id="tuer-z${i}">--</output>
            ${kann ? `<button type="button" class="lhc-step klein" data-i="${i}" data-r="1">+</button>` : ""}
          </div></div>`;
      }
    });
    if (abschnitt) html += "</div>";
    liste.innerHTML = html;
    this._tuerListe = felder;
    liste.querySelectorAll("button[data-r]").forEach(
      (b) => b.addEventListener(
        "click",
        () => this._tuerStelle(Number(b.dataset.i), Number(b.dataset.r))
      )
    );
    liste.querySelectorAll("button[data-o]").forEach(
      (b) => b.addEventListener("click", () => this._tuerWaehle(Number(b.dataset.i), b.dataset.o))
    );
    felder.forEach((f, i) => this._tuerZeige(i));
  },
  /** Grenzen einer Zahl, gemeldete Werte der Entitaet haben Vorrang. */
  _tuerGrenzen(f) {
    const a = (this._quelle.states[f.id] || {}).attributes || {};
    const zahl = (w, ersatz) => Number.isFinite(Number(w)) && w !== null && w !== "" ? Number(w) : ersatz;
    return { min: zahl(a.min, f.min), max: zahl(a.max, f.max), step: zahl(a.step, f.step) || 1 };
  },
  /** Aktueller Wert einer Zeile, geaendert oder aus Home Assistant. */
  _tuerWert(f) {
    const neu = this._tuerNeu && this._tuerNeu[f.id];
    if (neu) return neu.wert;
    const st = this._quelle.states[f.id];
    if (!st) return null;
    if (f.auswahl || f.schalter) return st.state;
    if (f.knopf) return null;
    const ist = parseFloat(st.state);
    if (Number.isNaN(ist)) return null;
    const gehalten = this._gehaltenerWert(f.id, ist);
    return gehalten !== null ? gehalten : ist;
  },
  _tuerZeige(i) {
    const f = this._tuerListe && this._tuerListe[i];
    const el = this.shadowRoot.getElementById(`tuer-z${i}`);
    if (!f || !el) return;
    if (f.jaz) {
      this._jazZeige(f, el, this.shadowRoot.getElementById(`tuer-s${i}`));
      return;
    }
    if (f.cop) {
      const v = this._cop(this._quelle, f.key);
      el.textContent = v === null ? "--" : tf(this._t("j_cop_heute"), { v: fmt(v, 1) });
      return;
    }
    const geaendert = Boolean(this._tuerNeu && this._tuerNeu[f.id]);
    const wert = this._tuerWert(f);
    if (f.knopf) {
      el.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("aktiv", geaendert);
        b.classList.toggle("geaendert", geaendert);
      });
      return;
    }
    if (f.info) {
      el.textContent = wert === null ? "--" : `${fmt(wert, 0)}${f.einheit ? ` ${f.einheit}` : ""}`;
      return;
    }
    if (f.auswahl || f.schalter) {
      el.querySelectorAll("button").forEach((b) => {
        const aktiv = b.dataset.o === wert;
        b.classList.toggle("aktiv", aktiv);
        b.classList.toggle("geaendert", aktiv && geaendert);
      });
      return;
    }
    const g = this._tuerGrenzen(f);
    const stellen = g.step < 1 ? 1 : 0;
    el.textContent = wert === null ? "--" : `${fmt(wert, stellen)}${f.einheit ? ` ${f.einheit}` : ""}`;
    el.classList.toggle("geaendert", geaendert);
  },
  _tuerStelle(i, richtung) {
    const f = this._tuerListe && this._tuerListe[i];
    if (!f) return;
    const jetzt = this._tuerWert(f);
    if (jetzt === null) return;
    const g = this._tuerGrenzen(f);
    const neu = clamp(Math.round((jetzt + richtung * g.step) * 100) / 100, g.min, g.max);
    if (neu === jetzt) return;
    this._tuerMerke(f, neu);
    this._tuerZeige(i);
  },
  _tuerWaehle(i, option) {
    const f = this._tuerListe && this._tuerListe[i];
    if (!f) return;
    if (f.knopf) {
      if (this._tuerNeu && this._tuerNeu[f.id]) delete this._tuerNeu[f.id];
      else this._tuerNeu[f.id] = { wert: "press", art: "knopf" };
      this._tuerZeige(i);
      return;
    }
    this._tuerMerke(f, option);
    this._tuerZeige(i);
  },
  /** Merkt eine Aenderung vor. Zurueck auf den alten Wert hebt sie auf. */
  _tuerMerke(f, wert) {
    if (!this._tuerNeu) this._tuerNeu = {};
    delete this._tuerNeu[f.id];
    const alt = this._tuerWert(f);
    if (wert === alt) return;
    this._tuerNeu[f.id] = { wert, art: f.auswahl ? "auswahl" : f.schalter ? "schalter" : "zahl" };
  },
  /** Sendet alle vorgemerkten Aenderungen und schliesst die Tuer. */
  _tuerUebernehmen() {
    const q = this._quelle;
    const neu = this._tuerNeu || {};
    Object.keys(neu).forEach((id) => {
      const e = neu[id];
      const bereich = id.split(".")[0];
      if (e.art === "auswahl") {
        q.callService(bereich, "select_option", { entity_id: id, option: e.wert });
      } else if (e.art === "schalter") {
        q.callService(bereich, e.wert === "on" ? "turn_on" : "turn_off", { entity_id: id });
      } else if (e.art === "knopf") {
        q.callService(bereich, "press", { entity_id: id });
      } else {
        this._halte(id, e.wert);
        q.callService(bereich, "set_value", { entity_id: id, value: e.wert });
      }
    });
    this._schliesseTuer();
  }
};

// src/karte/verlauf.js
var verlaufKarte = {
  /**
   * Holt den Zaehlerstand von heute null Uhr und merkt ihn.
   * Damit laesst sich der Tagesverbrauch aus dem Gesamtzaehler rechnen,
   * ohne dass ein eigener Zaehler-Helfer noetig ist.
   * Schlaegt die Abfrage fehl, bleibt der Gesamtstand stehen.
   */
  async _ladeTagesstart() {
    const id = this._e("energy_today");
    if (!id || !this._quelle || !this._quelle.callWS) return;
    const jetzt = /* @__PURE__ */ new Date();
    const mitternacht = new Date(
      jetzt.getFullYear(),
      jetzt.getMonth(),
      jetzt.getDate()
    ).getTime();
    if (this._tagStartTag === mitternacht && this._tagStart !== void 0) return;
    if (this._tagVersuch && jetzt.getTime() - this._tagVersuch < 3e5) return;
    this._tagVersuch = jetzt.getTime();
    try {
      const antwort = await this._quelle.callWS({
        type: "history/history_during_period",
        start_time: new Date(mitternacht).toISOString(),
        end_time: new Date(mitternacht + 12e4).toISOString(),
        entity_ids: [id],
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true
      });
      const reihe = antwort && antwort[id];
      if (!reihe || !reihe.length) return;
      const roh = reihe[0].s !== void 0 ? reihe[0].s : reihe[0].state;
      const wert = parseFloat(roh);
      if (!Number.isNaN(wert)) {
        this._tagStart = wert;
        this._tagStartTag = mitternacht;
        this._render();
      }
    } catch {
    }
  },
  /**
   * Rahmen des Verlaufsdiagramms. Gezeichnet wird spaeter, sobald die
   * Daten aus Home Assistant vorliegen. Die Masse merkt sich die Karte,
   * damit die Kurve in denselben Rahmen passt.
   */
  _verlaufRahmen(x, y, breite, hoehe) {
    if (this._config.show_history === false) {
      this._verlaufMasse = null;
      return "";
    }
    this._verlaufMasse = { x, y, breite, hoehe };
    return `
      <g id="verlauf-group" opacity="0">
        <text class="cap-s verlauf-titel" x="${x}" y="${y + 14}">${this._t("verbrauch_24")}</text>
        <text class="value-s" id="verlauf-max" x="${x + breite}" y="${y + 14}"
              text-anchor="end">--</text>
        <line x1="${x}" y1="${y + 26}" x2="${x + breite}" y2="${y + 26}"
              stroke="#55657F" stroke-width="1"/>
        <path id="verlauf-flaeche" fill="#2E7FD4" opacity="0.2" d=""/>
        <path id="verlauf-linie" fill="none" stroke="#7E8CA0" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-standby" fill="none" stroke="#7E8CA0" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-heiz" fill="none" stroke="#FF5F52" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <path id="verlauf-ww" fill="none" stroke="#4D9BFF" stroke-width="2.5"
              stroke-linejoin="round" stroke-linecap="round" d=""/>
        <line x1="${x}" y1="${y + hoehe - 50}" x2="${x + breite}"
              y2="${y + hoehe - 50}" stroke="#2A3446" stroke-width="1"/>
        <text class="cap-s" x="${x}" y="${y + hoehe - 36}">SG Ready</text>
        <rect id="verlauf-sg-rahmen" x="${x}" y="${y + hoehe - 32}" width="${breite}" height="12"
              rx="3" fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
        <g id="verlauf-sg"></g>
        <text class="hinweis-s" id="verlauf-sg-leer" x="${x}"
              y="${y + hoehe - 26}" dominant-baseline="middle" opacity="0">${this._t("kein_verlauf")}</text>
        <text class="value-sp verlauf-text" x="${x}" y="${y + hoehe - 4}">${this._t("vor_24h")}</text>
        <text class="value-sp verlauf-text" x="${x + breite}" y="${y + hoehe - 36}"
              text-anchor="end"><tspan fill="#FF5F52">${this._t("heizung")}</tspan><tspan fill="#7E8CA0"> \xB7 </tspan><tspan fill="#4D9BFF">${this._t("warmwasser")}</tspan><tspan fill="#7E8CA0"> \xB7 ${this._t("standby")}</tspan></text>
        <text class="value-sp verlauf-text" x="${x + breite}" y="${y + hoehe - 4}"
              text-anchor="end">${this._t("jetzt")}</text>
      </g>`;
  },
  /**
   * Holt den Verlauf aus Home Assistant.  /**
   * Holt den Verlauf aus Home Assistant. Hoechstens alle fuenf Minuten,
   * damit die Abfrage die Oberflaeche nicht belastet.
   */
  _holeVerlauf() {
    const jetzt = Date.now();
    if (this._verlaufZeit && jetzt - this._verlaufZeit < 3e5) return;
    this._verlaufZeit = jetzt;
    if (this._config.demo) {
      const punkte = [];
      const start2 = jetzt - 864e5;
      for (let i = 0; i <= 96; i++) {
        const stunde = i / 4 % 24;
        const grund = stunde > 5 && stunde < 9 ? 2.4 : stunde > 16 && stunde < 21 ? 1.8 : 0.4;
        punkte.push({ t: start2 + i * 9e5, v: Math.max(0, grund + Math.sin(i / 3) * 0.5) });
      }
      this._verlauf = punkte;
      const h = 36e5;
      this._sgVerlauf = [
        { t: start2, stufe: 2 },
        { t: start2 + 10 * h, stufe: 3 },
        { t: start2 + 12 * h, stufe: 4 },
        { t: start2 + 13.5 * h, stufe: 3 },
        { t: start2 + 15 * h, stufe: 2 },
        { t: start2 + 18 * h, stufe: 1 },
        { t: start2 + 19 * h, stufe: 2 }
      ];
      this._zeichneVerlauf();
      return;
    }
    const id = this._e("power_now");
    const vid = this._e("three_way_valve");
    const k1 = this._e("sg_k1");
    const k2 = this._e("sg_k2");
    const vd = this._e("compressor");
    if (!id || !this._hass || typeof this._hass.callWS !== "function") {
      this._verlauf = null;
      this._zeichneVerlauf();
      return;
    }
    const ende = /* @__PURE__ */ new Date();
    const start = new Date(ende.getTime() - 864e5);
    this._hass.callWS({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: ende.toISOString(),
      entity_ids: [id, vid, k1, k2, vd].filter(Boolean),
      minimal_response: true,
      no_attributes: true
    }).then((antwort) => {
      const punkte = (eid) => (antwort && eid && antwort[eid] || []).map((pkt) => ({
        t: pkt.lu ? pkt.lu * 1e3 : Date.parse(pkt.last_changed),
        an: ["on", "true", "1"].includes(
          String(pkt.s !== void 0 ? pkt.s : pkt.state).toLowerCase()
        )
      })).filter((pkt) => !Number.isNaN(pkt.t));
      const r1 = punkte(k1);
      const r2 = punkte(k2);
      if (r1.length && r2.length) {
        const zeiten = [...new Set([...r1, ...r2].map((pkt) => pkt.t))].sort(
          (x, y) => x - y
        );
        const standBei = (reihe2, t2) => {
          let s = reihe2[0].an;
          for (const pkt of reihe2) {
            if (pkt.t > t2) break;
            s = pkt.an;
          }
          return s;
        };
        this._sgVerlauf = zeiten.map((t2) => {
          const a1 = standBei(r1, t2);
          const a2 = standBei(r2, t2);
          let stufe = 2;
          if (a1 && !a2) stufe = 1;
          else if (!a1 && a2) stufe = 3;
          else if (a1 && a2) stufe = 4;
          return { t: t2, stufe };
        });
      } else {
        this._sgVerlauf = null;
      }
      this._verdichterVerlauf = (antwort && vd && antwort[vd] || []).map((pkt) => ({
        t: pkt.lu ? pkt.lu * 1e3 : Date.parse(pkt.last_changed),
        laeuft: parseFloat(pkt.s !== void 0 ? pkt.s : pkt.state) > 0
      })).filter((pkt) => !Number.isNaN(pkt.t));
      this._ventilVerlauf = (antwort && vid && antwort[vid] || []).map((p) => ({
        t: p.lu ? p.lu * 1e3 : Date.parse(p.last_changed),
        ww: parseFloat(p.s !== void 0 ? p.s : p.state) > 0
      })).filter((p) => !Number.isNaN(p.t));
      const reihe = antwort && antwort[id] || [];
      this._verlauf = reihe.map((p) => ({
        t: p.lu ? p.lu * 1e3 : Date.parse(p.last_changed),
        v: parseFloat(p.s !== void 0 ? p.s : p.state)
      })).filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
      this._zeichneVerlauf();
    }).catch(() => {
      this._verlauf = null;
      this._zeichneVerlauf();
    });
  },
  /** Zeichnet die Kurve in den vorbereiteten Rahmen. */
  _zeichneVerlauf() {
    const sr = this.shadowRoot;
    const gruppe = sr && sr.getElementById("verlauf-group");
    const masse = this._verlaufMasse;
    if (!gruppe || !masse) return;
    const daten = this._verlauf || [];
    if (daten.length < 2) {
      gruppe.setAttribute("opacity", "0");
      this._diaNachVerlauf();
      return;
    }
    const links = masse.x;
    const rechts = masse.x + masse.breite;
    const oben = masse.y + 38;
    const unten = masse.y + masse.hoehe - 56;
    const t0 = daten[0].t;
    const t1 = daten[daten.length - 1].t;
    const spanne = t1 - t0 || 1;
    const hoechst = Math.max(...daten.map((d) => d.v), 0.1);
    const px = (d) => links + (d.t - t0) / spanne * (rechts - links);
    const py = (d) => unten - d.v / hoechst * (unten - oben);
    let linie = "";
    daten.forEach((d, i) => {
      linie += `${i ? "L" : "M"}${px(d).toFixed(1)} ${py(d).toFixed(1)}`;
    });
    const ventil = this._ventilVerlauf || [];
    const wwZu = (t2) => {
      let stand = false;
      for (const v of ventil) {
        if (v.t > t2) break;
        stand = v.ww;
      }
      return stand;
    };
    const verdichter = this._verdichterVerlauf || [];
    const laeuftZu = (t2) => {
      if (!verdichter.length) return true;
      let stand = verdichter[0].laeuft;
      for (const v of verdichter) {
        if (v.t > t2) break;
        stand = v.laeuft;
      }
      return stand;
    };
    const grund = Math.min(...daten.map((d) => d.v));
    const schwelle = grund + Math.max((hoechst - grund) * 0.08, hoechst * 0.02);
    const pfade = { heiz: "", ww: "", standby: "" };
    if (ventil.length || verdichter.length) {
      const ziele = daten.map(
        (d) => !laeuftZu(d.t) && d.v <= schwelle ? "standby" : wwZu(d.t) ? "ww" : "heiz"
      );
      let letztes = null;
      for (let i = 1; i < daten.length; i++) {
        const a = daten[i - 1];
        const b = daten[i];
        const ziel = b.v > a.v ? ziele[i] : ziele[i - 1];
        const von = `${px(a).toFixed(1)} ${py(a).toFixed(1)}`;
        const bis = `${px(b).toFixed(1)} ${py(b).toFixed(1)}`;
        if (letztes === ziel) pfade[ziel] += `L${bis}`;
        else pfade[ziel] += `M${von}L${bis}`;
        letztes = ziel;
      }
    }
    const heiz = pfade.heiz;
    const ww = pfade.ww;
    const band = sr.getElementById("verlauf-sg");
    const leer = sr.getElementById("verlauf-sg-leer");
    if (band) {
      const sgr = this._sgVerlauf;
      band.textContent = "";
      const ohne = !(sgr && sgr.length);
      if (leer) leer.setAttribute("opacity", ohne ? "1" : "0");
      const rahmen = sr.getElementById("verlauf-sg-rahmen");
      if (rahmen) rahmen.setAttribute("opacity", ohne ? "0" : "1");
      if (sgr && sgr.length) {
        const bandY = masse.y + masse.hoehe - 31;
        const bandLinks = masse.x + 1;
        const bandRechts = masse.x + masse.breite - 1;
        const t02 = daten.length ? daten[0].t : sgr[0].t;
        const t12 = daten.length ? daten[daten.length - 1].t : Date.now();
        const zuX = (t2) => bandLinks + (clamp(t2, t02, t12) - t02) / (t12 - t02 || 1) * (bandRechts - bandLinks);
        sgr.forEach((eintrag, i) => {
          const bis = i + 1 < sgr.length ? sgr[i + 1].t : t12;
          if (bis <= t02 || eintrag.t >= t12) return;
          const xa = zuX(eintrag.t);
          const xb = zuX(bis);
          if (xb - xa < 0.4) return;
          const info = SG_STATES[eintrag.stufe];
          const r = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          r.setAttribute("x", xa.toFixed(1));
          r.setAttribute("y", bandY.toFixed(1));
          r.setAttribute("width", (xb - xa).toFixed(1));
          r.setAttribute("height", "10");
          r.setAttribute("fill", info ? info.farbe : NEUTRAL);
          r.setAttribute("opacity", "0.9");
          const titel = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          titel.textContent = this._t(info ? info.lang : "unbekannt");
          r.appendChild(titel);
          band.appendChild(r);
        });
      }
    }
    const gefaerbt = ventil.length || verdichter.length;
    sr.getElementById("verlauf-linie").setAttribute("d", gefaerbt ? "" : linie);
    const sb = sr.getElementById("verlauf-standby");
    if (sb) sb.setAttribute("d", pfade.standby);
    sr.getElementById("verlauf-heiz").setAttribute("d", heiz);
    sr.getElementById("verlauf-ww").setAttribute("d", ww);
    sr.getElementById("verlauf-flaeche").setAttribute(
      "d",
      `${linie}L${rechts.toFixed(1)} ${unten}L${links.toFixed(1)} ${unten}Z`
    );
    const inKW = hoechst >= 100 ? hoechst / 1e3 : hoechst;
    sr.getElementById("verlauf-max").textContent = tf(this._t("s_max"), { v: `${fmt(inKW, 2)} kW` });
    gruppe.setAttribute("opacity", "1");
    this._diaNachVerlauf();
  }
};

// src/karte/karte.js
var LutarymHeatpumpCard = class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._config = null;
    this._hass = null;
    this._auto = null;
    this._dragging = null;
    this._animLoop = null;
    this._animTime = 0;
    this._animState = /* @__PURE__ */ new Map();
  }
  disconnectedCallback() {
    if (this._animLoop) cancelAnimationFrame(this._animLoop);
    this._animLoop = null;
    if (this._sichtBeobachter) {
      this._sichtBeobachter.disconnect();
      this._sichtBeobachter = null;
    }
  }
  /**
   * Home Assistant haengt die Karte beim Speichern der Konfiguration
   * kurz ab und wieder an. Ohne diesen Rueckruf bliebe die im
   * disconnectedCallback beendete Animation bis zum Neuladen der Seite
   * stehen.
   */
  connectedCallback() {
    if (!this._sichtBeobachter && typeof IntersectionObserver !== "undefined") {
      this._sichtBeobachter = new IntersectionObserver((eintraege) => {
        const e = eintraege[eintraege.length - 1];
        this._unsichtbar = !e.isIntersecting;
        if (!this._unsichtbar && this._built && !this._animLoop) this._startAnimationLoop();
      });
      this._sichtBeobachter.observe(this);
    }
    if (!this._bewegungMq && window.matchMedia) {
      try {
        this._bewegungMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        this._bewegungMq.addEventListener("change", () => {
          if (!this._config || this._config.animate !== "auto") return;
          if (this._hass) this._render();
          if (bewegungReduziert()) {
            if (this._animLoop) cancelAnimationFrame(this._animLoop);
            this._animLoop = null;
          } else if (this._built && !this._animLoop) {
            this._startAnimationLoop();
          }
        });
      } catch {
        this._bewegungMq = null;
      }
    }
    if (this._built && !this._animLoop) this._startAnimationLoop();
  }
  static getConfigElement() {
    return document.createElement("heatpump-flow-card-by-lutarym-editor");
  }
  static getStubConfig(hass) {
    const found = detectIntegration(hass, DEFAULT_CONFIG.profil);
    return { ...DEFAULT_CONFIG, entities: found.found ? found.entities : {} };
  }
  setConfig(config) {
    if (!config) throw new Error("Keine Konfiguration angegeben.");
    registriereSprachen(config);
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...config.entities || {} }
    };
    this._config.fan_count = this._config.fan_count === 1 ? 1 : 2;
    this._config.hk_count = Math.min(4, Math.max(1, parseInt(this._config.hk_count, 10) || 2));
    this._built = false;
    this._auto = null;
    if (this._config.demo) this._demoAufbauen();
    else this._demo = null;
    this._tagStart = void 0;
    this._tagStartTag = void 0;
    this._tagVersuch = 0;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
    if (this._quelle) this._render();
  }
  set hass(hass) {
    const alt = this._hass;
    this._hass = hass;
    if (!this._config) return;
    if (alt && hass && this._built && !this._config.demo && !this._relevantGeaendert(alt, hass)) {
      return;
    }
    this._render();
  }
  /** Gewaehlte Farbdarstellung, "auto" folgt Home Assistant. */
  _thema() {
    const w = this._config && this._config.theme || "auto";
    if (w !== "auto") return w;
    const dm = this._hass && this._hass.themes && this._hass.themes.darkMode;
    if (typeof dm === "boolean") return dm ? "dunkel" : "hell";
    const hell = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    return hell ? "hell" : "dunkel";
  }
  /** Setzt die Farbdarstellung an der Karte. */
  _setzeThema() {
    const k = this.shadowRoot && this.shadowRoot.querySelector("ha-card.lhc");
    if (!k) return;
    const t2 = this._thema();
    if (k.dataset.thema === t2) return;
    ["hell", "kontrast", "nacht", "ha"].forEach((n) => k.classList.toggle(`thema-${n}`, n === t2));
    k.dataset.thema = t2;
  }
  /** Hat sich eine Entitaet der Karte, die Sprache oder die Registrierung geaendert? */
  _relevantGeaendert(alt, neu) {
    if (alt.language !== neu.language || alt.entities !== neu.entities) return true;
    if (alt.themes !== neu.themes) return true;
    if (!alt.states || !neu.states) return true;
    if (this._beobachtetFuer !== this._config || !this._beobachtet) {
      const ids = /* @__PURE__ */ new Set();
      profilFeldnamen().forEach((k) => {
        const id = this._e(k);
        if (id) ids.add(id);
      });
      this._beobachtet = ids;
      this._beobachtetFuer = this._config;
    }
    for (const id of this._beobachtet) {
      if (alt.states[id] !== neu.states[id]) return true;
    }
    return false;
  }
  getCardSize() {
    return 18;
  }
  /** Liefert die gerade gueltige Datenquelle. */
  get _quelle() {
    return this._config && this._config.demo ? this._demo : this._hass;
  }
  _e(key) {
    if (this._config && this._config.demo) return `demo.${key}`;
    const eintraege = this._config.entities || {};
    const alias = { power_state: "power_switch", buffer_temp: "buffer_top" };
    const configured = eintraege[key] || eintraege[alias[key]];
    if (configured) return configured;
    if (!this._auto) {
      this._auto = quellenZuordnung(
        detectIntegration(this._quelle, eigenesProfil(this._config) || void 0).entities,
        this._config.extra_heat
      );
    }
    return this._auto[key] || "";
  }
  /**
   * Merkt einen gerade gesetzten Wert kurz vor.
   * Ohne das ueberschreibt die naechste Aktualisierung die Eingabe,
   * bevor die Waermepumpe nachgezogen hat, und der Regler springt zurueck.
   */
  _halte(id, wert) {
    if (!this._gehalten) this._gehalten = {};
    this._gehalten[id] = { wert, bis: Date.now() + HOLD_MS };
  }
  /** Liefert den vorgemerkten Wert, solange er gilt. */
  _gehaltenerWert(id, istWert) {
    const eintrag = this._gehalten && this._gehalten[id];
    if (!eintrag) return null;
    if (Date.now() > eintrag.bis || istWert === eintrag.wert) {
      delete this._gehalten[id];
      return null;
    }
    return eintrag.wert;
  }
  /**
   * Schaltet einen Heizkreis zu oder ab.
   * SetZones kennt nur drei Werte: 0 nur Zone 1, 1 nur Zone 2,
   * 2 beide Zonen. Beide gleichzeitig aus ist nicht vorgesehen,
   * ein solcher Versuch wird deshalb nicht ausgefuehrt.
   */
  _zoneSchalten(nummer) {
    const id = this._e("zones_select");
    if (!id) return;
    const jetzt = numState(this._quelle, this._e("zones_state"));
    const zone1 = jetzt === null ? true : jetzt === 0 || jetzt === 2;
    const zone2 = jetzt === null ? true : jetzt === 1 || jetzt === 2;
    const neu1 = nummer === 1 ? !zone1 : zone1;
    const neu2 = nummer === 2 ? !zone2 : zone2;
    if (!neu1 && !neu2) return;
    const wert = neu1 && neu2 ? 2 : neu1 ? 0 : 1;
    this._quelle.callService("select", "select_option", {
      entity_id: id,
      option: `mode_${wert}`
    });
  }
  /** Ist der genannte Heizkreis aktiv? Rueckgabe null bei Unkenntnis. */
  _zoneAktiv(nummer) {
    if (!this._e("zones_state")) return null;
    const jetzt = numState(this._quelle, this._e("zones_state"));
    if (jetzt === null) return null;
    return nummer === 1 ? jetzt === 0 || jetzt === 2 : jetzt === 1 || jetzt === 2;
  }
  /** Gewaehlte Sprache, sonst die von Home Assistant, sonst Englisch. */
  _sp() {
    const gewaehlt = this._config && this._config.language;
    if (gewaehlt && gewaehlt !== "auto" && spracheBekannt(gewaehlt)) {
      return gewaehlt;
    }
    const ha = this._hass && this._hass.language;
    if (EIGENE_SPRACHEN[String(ha || "").toLowerCase()]) return String(ha).toLowerCase();
    const kurz = String(ha || "").slice(0, 2).toLowerCase();
    return spracheBekannt(kurz) ? kurz : "en";
  }
  /**
   * Name einer Baugruppe. Ein eigener Name gewinnt. Leer oder noch der
   * fruehere deutsche Standardname bedeutet: Name in der Kartensprache.
   */
  _name(schluessel) {
    const frueher = {
      label_hk1: "Heizkreis 1",
      label_hk2: "Heizkreis 2",
      label_hk3: "Heizkreis 3",
      label_hk4: "Heizkreis 4",
      label_dhw: "Warmwasser",
      label_buffer: "Puffer"
    };
    const eigen = this._config && this._config[schluessel];
    if (eigen && eigen !== frueher[schluessel]) return eigen;
    if (schluessel === "label_hk1") return `${this._t("heizkreis")} 1`;
    const hk = /^label_hk([1-4])$/.exec(schluessel);
    if (hk) return `${this._t("heizkreis")} ${hk[1]}`;
    if (schluessel === "label_dhw") return this._t("warmwasser");
    if (schluessel === "label_buffer") return this._t("puffer");
    return eigen || "";
  }
  /**
   * Ob ein Heizungspuffer gezeichnet wird. Fest eingestellt gewinnt.
   * Bei "auto" entscheidet TOP99 Buffer_Installed, sonst wird er
   * gezeigt, wie bisher.
   */
  _hatPuffer() {
    const e = this._config && this._config.buffer_present;
    if (e === true || e === false) return e;
    const id = this._e("buffer_installed");
    const roh = id && this._hass && this._hass.states && this._hass.states[id];
    if (!roh) return true;
    const s = String(roh.state).toLowerCase();
    if (["on", "true", "1", "enabled", "installed", "yes"].includes(s)) return true;
    if (["off", "false", "0", "disabled", "not installed", "no"].includes(s)) return false;
    return true;
  }
  /**
   * Ob die Zirkulation gezeichnet wird. Fest eingestellt gewinnt, bei
   * "auto" sobald eine Zirkulationsentitaet vorhanden ist.
   */
  _zeigtZirkulation(hass) {
    const e = this._config && this._config.circulation_present;
    if (e === true || e === false) return e;
    const id = this._e("circulation_pump") || this._e("circ_switch");
    return Boolean(id) && Boolean(hass && hass.states && hass.states[id]);
  }
  /** Kurzform fuer einen uebersetzten Text. */
  _t(schluessel) {
    return t(schluessel, this._sp());
  }
  _render() {
    const sprache = this._sp();
    setzeDezimal(dezimalFuer(sprache));
    const puffer = this._hatPuffer();
    const sprachStand = `${sprache}#${SPRACH_STAND}`;
    if (this._built && (this._gebautMit !== sprachStand || this._gebautPuffer !== puffer)) {
      this._built = false;
    }
    if (!this._built) {
      this._build();
      this._built = true;
      this._gebautMit = sprachStand;
      this._gebautPuffer = puffer;
    }
    this._setzeThema();
    this._groesse();
    this._update();
    this._holeVerlauf();
    this._diaEinrichten();
    const kd = this.shadowRoot.getElementById("kurve-dialog");
    if (kd && !kd.dataset.fertig) {
      kd.dataset.fertig = "1";
      kd.addEventListener("click", (ev) => {
        if (ev.target === kd) kd.hidden = true;
      });
      const zu = this.shadowRoot.getElementById("kurve-zu");
      if (zu) zu.addEventListener("click", () => {
        kd.hidden = true;
      });
    }
    if (kd && !kd.hidden) {
      this._kurveRegler();
      this._zeichneKurveDialog();
    }
  }
  /**
   * Breite und Hoehe aus der Konfiguration anwenden.
   * Null bedeutet automatisch, dann fuellt die Karte ihre Spalte und
   * behaelt ihr Seitenverhaeltnis.
   */
  _groesse() {
    const karte = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    const svg = this.shadowRoot && this.shadowRoot.querySelector("svg");
    if (!karte || !svg) return;
    const b = Number(this._config.card_width) || 0;
    const h = Number(this._config.card_height) || 0;
    karte.style.maxWidth = b > 0 ? `${b}px` : "";
    karte.style.marginInline = b > 0 ? "auto" : "";
    if (h > 0) {
      svg.style.height = `${h}px`;
      svg.style.width = "100%";
    } else {
      svg.style.height = "";
      svg.style.width = "";
    }
  }
  /* -------------------- Aufbau -------------------- */
  _build() {
    if (this._animLoop) cancelAnimationFrame(this._animLoop);
    this._animTime = 0;
    this._animState.clear();
    const root = document.createElement("div");
    root.innerHTML = `
      <style>${this._css()}</style>
      <ha-card class="lhc">
        <div class="lhc-alert" id="alert" hidden></div>
        <div class="lhc-hint" id="hinweis" hidden></div>
        <div class="lhc-demo" id="demo-leiste" hidden></div>
        <div class="lhc-scene">${this._svg()}</div>

        ${this._kurveDialogMarkup()}
        ${this._diaDialogMarkup()}
        <button type="button" class="lhc-hilfe-knopf" id="hilfe-knopf"
                title="${escapeHtml(this._t("h_knopf"))}" aria-label="${escapeHtml(this._t("h_knopf"))}">?</button>
        <div class="lhc-hilfe" id="hilfe" hidden>
          <div class="lhc-hilfe-box" role="dialog" aria-modal="true" aria-labelledby="hilfe-titel" tabindex="-1">
            <div class="lhc-hilfe-kopf">
              <span id="hilfe-titel">${escapeHtml(this._t("h_titel"))}</span>
              <button type="button" class="lhc-dialog-close" id="hilfe-zu"
                      aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
            </div>
            <input type="search" class="lhc-hilfe-suche" id="hilfe-suche"
                   placeholder="${escapeHtml(this._t("h_suche"))}" autocomplete="off">
            <div class="lhc-hilfe-chips" id="hilfe-chips"></div>
            <div class="lhc-hilfe-liste" id="hilfe-liste"></div>
            <div class="lhc-hilfe-fuss"><span id="hilfe-anzahl"></span> \xB7 ${escapeHtml(this._t("h_quelle"))}</div>
          </div>
        </div>
        <div class="lhc-tuer" id="tuer-panel" hidden>
          <div class="lhc-tuer-kopf">${escapeHtml(gruppenText("Erweiterte Einstellungen", this._sp()))}</div>
          <div class="lhc-tuer-liste" id="tuer-liste"></div>
          <div class="lhc-tuer-fuss">
            <button type="button" class="lhc-tuer-knopf" id="tuer-abbrechen">${escapeHtml(this._t("t_abbrechen"))}</button>
            <button type="button" class="lhc-tuer-knopf primaer" id="tuer-ok">${escapeHtml(this._t("t_uebernehmen"))}</button>
          </div>
        </div>
        <div class="lhc-dialog" id="dialog" hidden>
          <div class="lhc-dialog-box" role="dialog" aria-modal="true">
            <div class="lhc-dialog-head">
              <span class="lhc-dialog-title" id="dlg-title">--</span>
              <button type="button" class="lhc-dialog-close" id="dlg-close"
                      aria-label="${this._t("f_schliessen")}">&times;</button>
            </div>
            <div id="dlg-temp">
              <output class="lhc-dialog-value" id="dlg-value">--</output>
              <div class="lhc-dialog-row">
                <button type="button" class="lhc-step" id="dlg-minus" aria-label="${this._t("s_kleiner")}">&minus;</button>
                <input class="lhc-slider" type="range" id="dlg-range"
                       min="0" max="100" step="1" value="0" aria-label="${this._t("s_temperatur")}">
                <button type="button" class="lhc-step" id="dlg-plus" aria-label="${this._t("s_groesser")}">+</button>
              </div>
              <div class="lhc-ctl-scale">
                <span id="dlg-min">--</span><span id="dlg-max">--</span>
              </div>
              <div class="lhc-dlg-hinweis" id="dlg-hinweis"></div>
            </div>
            <div id="dlg-actions"></div>
            <div id="dlg-werte"></div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.replaceChildren(root);
    this._buildDemo();
    this._buildDialog();
    this._buildKlicks();
    this._buildTuer();
    this._buildHilfe();
    this._startAnimationLoop();
  }
  /**
   * Nachschlagen eines Elements mit Zwischenspeicher.
   * Die Animationsschleife sucht sonst bei jedem Bild erneut im DOM.
   * Wird die Karte neu aufgebaut, sind die alten Knoten nicht mehr
   * verbunden. Das faellt hier auf und der Eintrag wird erneuert.
   */
  _animEl(id) {
    if (!this._elCache) this._elCache = /* @__PURE__ */ new Map();
    let el = this._elCache.get(id);
    if (el && el.isConnected) return el;
    el = this.shadowRoot ? this.shadowRoot.getElementById(id) : null;
    if (el) this._elCache.set(id, el);
    else this._elCache.delete(id);
    return el;
  }
  /**
   * Faerbt das Fluegelrad einer Pumpe in der Farbe des gefoerderten
   * Wassers. Steht die Pumpe, gilt wieder die Farbe aus dem Stylesheet.
   * Inline, weil eine CSS-Regel das fill-Attribut sonst ueberschreibt.
   */
  _blattFarbe(id, farbe, laeuft) {
    const el = this.shadowRoot && this.shadowRoot.getElementById(id);
    if (!el) return;
    if (laeuft && farbe) el.style.fill = farbe;
    else el.style.removeProperty("fill");
  }
  _startAnimationLoop() {
    if (!animationAn(this._config)) {
      this._animLoop = null;
      return;
    }
    let lastTime = performance.now();
    const tick = (time) => {
      if (!this.isConnected) return;
      if (this._unsichtbar) {
        this._animLoop = null;
        return;
      }
      const deltaTime = (time - lastTime) / 1e3;
      lastTime = time;
      this._animTime += deltaTime;
      const sr = this.shadowRoot;
      if (!sr) {
        this._animLoop = requestAnimationFrame(tick);
        return;
      }
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "flow") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = this._animTime % 1.2;
        const progress = cycle / 1.2;
        const offset = state.reverse ? 44 * progress : -44 * progress;
        el.setAttribute("stroke-dashoffset", offset.toFixed(1));
      });
      const bubbleGroups = ["buf-bubbles", "dhw-bubbles"];
      bubbleGroups.forEach((groupId) => {
        const group = this._animEl(groupId);
        if (!group) return;
        if (!this._bubbleCache) this._bubbleCache = /* @__PURE__ */ new Map();
        let bubbles = this._bubbleCache.get(groupId);
        if (!bubbles || !bubbles.length || !bubbles[0].isConnected) {
          bubbles = Array.from(group.querySelectorAll("circle"));
          this._bubbleCache.set(groupId, bubbles);
        }
        bubbles.forEach((bubble, idx) => {
          if (bubble.style.animationName === "none") {
            if (bubble.getAttribute("opacity") !== "0") bubble.setAttribute("opacity", "0");
            return;
          }
          const dur = bubbleDauer(idx);
          const delay = idx * 0.3;
          const time2 = (this._animTime + delay) % dur;
          const prog = time2 / dur;
          const moveY = -330 * prog;
          let op = 0;
          if (prog < 0.15) op = prog / 0.15 * 0.4;
          else if (prog < 0.85) op = 0.4;
          else op = 0.4 * (1 - (prog - 0.85) / 0.15);
          bubble.setAttribute("transform", `translate(0,${moveY.toFixed(1)})`);
          bubble.setAttribute("opacity", op.toFixed(3));
        });
      });
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "pulse") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = this._animTime % state.duration / state.duration;
        const hoch = typeof state.max === "number" ? state.max : 1;
        const tief = typeof state.min === "number" ? state.min : 0.4;
        const spanne = hoch - tief;
        const opacity = cycle < 0.5 ? hoch - cycle / 0.5 * spanne : tief + (cycle - 0.5) / 0.5 * spanne;
        el.setAttribute("opacity", clamp(opacity, 0, 1).toFixed(2));
      });
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "spin") return;
        const el = this._animEl(id);
        if (!el) return;
        if (typeof state.winkel !== "number") state.winkel = 0;
        state.winkel = (state.winkel + deltaTime / state.duration * 360 + 360) % 360;
        el.setAttribute("transform", `rotate(${state.winkel.toFixed(2)} 0 0)`);
      });
      this._animState.forEach((state, id) => {
        if (!state) return;
        if (state.type === "solar") {
          this._solarBildFrame(this._animTime);
          return;
        }
        if (state.type !== "flacker") return;
        const el = this._animEl(id);
        if (!el) return;
        const t2 = this._animTime;
        const sy = 1 + 0.09 * Math.sin(t2 * 9.1) + 0.05 * Math.sin(t2 * 14.3 + 1.3);
        const sx = 1 - 0.05 * Math.sin(t2 * 11.7 + 0.7);
        const kipp = 3 * Math.sin(t2 * 6.3);
        el.setAttribute("transform", `skewX(${kipp.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
      });
      this._animLoop = requestAnimationFrame(tick);
    };
    this._animLoop = requestAnimationFrame(tick);
  }
};
Object.assign(
  LutarymHeatpumpCard.prototype,
  demoKarte,
  kennzahlenKarte,
  verlaufKarte,
  diagrammeKarte,
  aktualisierenKarte,
  dialogKarte,
  hilfeKarte,
  tuerKarte,
  grafikQuerKarte,
  grafikKlassischKarte,
  solarKarte,
  grafikHochKarte,
  heizkurveKarte,
  stilKarte
);

// src/index.js
customElements.define("heatpump-flow-card-by-lutarym", LutarymHeatpumpCard);
customElements.define("heatpump-flow-card-by-lutarym-editor", LutarymHeatpumpCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "heatpump-flow-card-by-lutarym",
  name: "Heatpump Flow Card by Lutarym",
  description: "Animated plant diagram with two heating circuits, pumps, tanks, heat curve, SG Ready and flow animation.",
  preview: true,
  documentationURL: "https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym"
});
console.info(
  `%c HEATPUMP FLOW CARD BY LUTARYM %c ${CARD_VERSION} `,
  "background:#0D131B;color:#E0762E;font-weight:600;padding:2px 6px;border-radius:3px 0 0 3px",
  "background:#E0762E;color:#0D131B;font-weight:600;padding:2px 6px;border-radius:0 3px 3px 0"
);
