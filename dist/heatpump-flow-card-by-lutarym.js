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

const CARD_VERSION = "3.7.2";

/* ------------------------------------------------------------------ *
 *  Zeichenraster
 * ------------------------------------------------------------------ */
const L = {
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
  X_DHW: 1440,
  X_DHW_C: 1525,
}

/* ------------------------------------------------------------------ *
 *  Klartexte
 *
 *  Alle englischen Kuerzel der Firmware werden uebersetzt.
 *  DHW steht fuer Domestic Hot Water, also Trinkwarmwasser.
 *  Quelle der Originaltexte: HeishaMon decode.h.
 * ------------------------------------------------------------------ */
const MODE_LABELS = {
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

const QUIET_LABELS = {
  mode_0: "Aus", mode_1: "Stufe 1", mode_2: "Stufe 2", mode_3: "Stufe 3",
  0: "Aus", 1: "Stufe 1", 2: "Stufe 2", 3: "Stufe 3",
};

const POWERFUL_LABELS = {
  mode_0: "Aus", mode_1: "30 Minuten", mode_2: "60 Minuten", mode_3: "90 Minuten",
  0: "Aus", 1: "30 Minuten", 2: "60 Minuten", 3: "90 Minuten",
};

const VALVE_LABELS = { Room: "Heizung", DHW: "Warmwasser", 0: "Heizung", 1: "Warmwasser" };

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
const LUFT = 30;

/* ------------------------------------------------------------------ *
 *  Sprachen
 *  Die Karte spricht Deutsch, Englisch, Franzoesisch und Japanisch.
 *  Ohne Einstellung richtet sie sich nach der Sprache von Home
 *  Assistant, ersatzweise Englisch.
 * ------------------------------------------------------------------ */
const SPRACHEN = ["de", "en", "fr", "ja"];

const TEXTE = {
  // Beschriftungen in der Grafik
  aussentemperatur: { de: "Außentemperatur", en: "Outdoor temp.", fr: "Temp. extérieure", ja: "外気温" },
  aussen_achse: { de: "Außentemperatur °C", en: "Outdoor temperature °C", fr: "Température extérieure °C", ja: "外気温 °C" },
  verdichter: { de: "Verdichter", en: "Compressor", fr: "Compresseur", ja: "圧縮機" },
  vorlauf: { de: "Vorlauf", en: "Flow", fr: "Départ", ja: "往き" },
  ruecklauf: { de: "Rücklauf", en: "Return", fr: "Retour", ja: "還り" },
  vorlauf_achse: { de: "Vorlauf °C", en: "Flow °C", fr: "Départ °C", ja: "往き温度 °C" },
  pumpe: { de: "Pumpe", en: "Pump", fr: "Pompe", ja: "ポンプ" },
  druck: { de: "Druck", en: "Pressure", fr: "Pression", ja: "圧力" },
  umschaltventil: { de: "Umschaltventil", en: "Diverter valve", fr: "Vanne trois voies", ja: "三方弁" },
  zirkulation: { de: "Zirkulation", en: "Circulation", fr: "Circulation", ja: "循環" },
  leistung: { de: "Leistung", en: "Power", fr: "Puissance", ja: "消費電力" },
  verbrauch: { de: "Verbrauch", en: "Energy", fr: "Consommation", ja: "使用量" },
  verbrauch_24: { de: "Verbrauch 24 Stunden", en: "Energy, past 24 hours", fr: "Consommation sur 24 heures", ja: "24時間の使用量" },
  pv_ueberschuss: { de: "PV Überschuss", en: "PV surplus", fr: "Surplus PV", ja: "太陽光の余剰" },
  heizstab: { de: "Heizstab", en: "Heater", fr: "Appoint électrique", ja: "ヒーター" },
  legionellen: { de: "Legionellen", en: "Legionella", fr: "Légionelles", ja: "レジオネラ" },
  aufheizen: { de: "Aufheizen", en: "Boost", fr: "Chauffe", ja: "加熱" },
  vor_24h: { de: "vor 24 h", en: "24 h ago", fr: "il y a 24 h", ja: "24時間前" },
  jetzt: { de: "jetzt", en: "now", fr: "maintenant", ja: "現在" },
  standby: { de: "Standby", en: "Standby", fr: "Veille", ja: "待機" },
  heizung: { de: "Heizung", en: "Heating", fr: "Chauffage", ja: "暖房" },
  warmwasser: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "給湯" },
  kein_verlauf: { de: "kein Verlauf vorhanden", en: "no history available", fr: "aucun historique", ja: "履歴なし" },
  heizkreis: { de: "Heizkreis", en: "Circuit", fr: "Circuit", ja: "暖房回路" },
  puffer: { de: "Puffer", en: "Buffer", fr: "Ballon tampon", ja: "バッファータンク" },

  // SG Ready
  sg1_kurz: { de: "Stopp", en: "Blocked", fr: "Blocage", ja: "停止" },
  sg1_lang: { de: "Sperre durch den Netzbetreiber", en: "Blocked by the grid operator", fr: "Blocage par le gestionnaire de réseau", ja: "電力会社による停止指令" },
  sg2_kurz: { de: "Normal", en: "Normal", fr: "Normal", ja: "通常" },
  sg2_lang: { de: "Normalbetrieb", en: "Normal operation", fr: "Fonctionnement normal", ja: "通常運転" },
  sg3_kurz: { de: "PV Überschuss Low", en: "PV surplus, low", fr: "Surplus PV, faible", ja: "余剰電力 小" },
  sg3_lang: { de: "Einschaltempfehlung", en: "Switch-on recommendation", fr: "Recommandation de mise en marche", ja: "運転推奨" },
  sg4_kurz: { de: "PV Überschuss High", en: "PV surplus, high", fr: "Surplus PV, élevé", ja: "余剰電力 大" },
  sg4_lang: { de: "Anlaufbefehl, verstärkter Betrieb", en: "Start command, increased operation", fr: "Ordre de démarrage, marche renforcée", ja: "運転指令、出力増" },
  unbekannt: { de: "unbekannt", en: "unknown", fr: "inconnu", ja: "不明" },

  // Texte in den Fenstern
  f_waermepumpe: { de: "Wärmepumpe", en: "Heat pump", fr: "Pompe à chaleur", ja: "ヒートポンプ" },
  f_betriebsart: { de: "Betriebsart", en: "Operating mode", fr: "Mode de fonctionnement", ja: "運転モード" },
  f_turbomodus: { de: "Turbomodus", en: "Powerful mode", fr: "Mode puissance", ja: "パワフル運転" },
  f_leisemodus: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "静音運転" },
  f_heizkurve: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "暖房曲線" },
  f_laedt_ab: { de: "Lädt ab", en: "Reheat at", fr: "Relance à", ja: "再加熱開始温度" },
  f_aussen_kalt: { de: "Außen kalt", en: "Outdoor, cold", fr: "Extérieur, froid", ja: "外気 低温" },
  f_aussen_warm: { de: "Außen warm", en: "Outdoor, warm", fr: "Extérieur, doux", ja: "外気 高温" },
  f_dann_vorlauf: { de: "dann Vorlauf", en: "then flow", fr: "alors départ", ja: "その時の往き温度" },
  f_laeuft_aus: { de: "Läuft, ausschalten", en: "Running, switch off", fr: "En marche, arrêter", ja: "運転中、停止する" },
  f_einschalten: { de: "Einschalten", en: "Switch on", fr: "Mettre en marche", ja: "運転する" },
  f_abtauen_ende: { de: "Abtauen läuft, beenden", en: "Defrost running, stop", fr: "Dégivrage en cours, arrêter", ja: "除霜中、停止する" },
  f_abtauen_start: { de: "Abtauen erzwingen", en: "Force defrost", fr: "Forcer le dégivrage", ja: "強制除霜" },
  f_aufheizen_ende: { de: "Aufheizen beenden", en: "Stop boost", fr: "Arrêter la chauffe", ja: "加熱を停止" },
  f_aufheizen_start: { de: "Einmalig aufheizen", en: "Boost once", fr: "Chauffe unique", ja: "一回だけ加熱" },
  f_legionellen_ende: { de: "Legionellen beenden", en: "Stop legionella cycle", fr: "Arrêter le cycle légionelles", ja: "レジオネラ運転を停止" },
  f_legionellen_start: { de: "Legionellen starten", en: "Start legionella cycle", fr: "Démarrer le cycle légionelles", ja: "レジオネラ運転を開始" },
  f_heizstab_aus: { de: "Heizstab sperren", en: "Block heater", fr: "Bloquer l'appoint", ja: "ヒーター禁止" },
  f_heizstab_an: { de: "Heizstab freigeben", en: "Allow heater", fr: "Autoriser l'appoint", ja: "ヒーター許可" },
  f_hz_heizstab_ende: { de: "Heizstab Heizung freigegeben, sperren", en: "Heating element allowed, block", fr: "Appoint chauffage autorisé, bloquer", ja: "暖房ヒーター許可中、禁止する" },
  f_hz_heizstab_start: { de: "Heizstab Heizung freigeben", en: "Allow heating element", fr: "Autoriser l'appoint chauffage", ja: "暖房ヒーターを許可" },
  f_kreis_aus: { de: "Kreis ausschalten", en: "Switch circuit off", fr: "Arrêter le circuit", ja: "回路を停止" },
  f_kreis_an: { de: "Kreis einschalten", en: "Switch circuit on", fr: "Mettre le circuit en marche", ja: "回路を運転" },
  f_puffer_aus: { de: "Pufferbetrieb ist an, ausschalten", en: "Buffer mode on, switch off", fr: "Mode tampon actif, arrêter", ja: "バッファー運転中、停止する" },
  f_puffer_an: { de: "Pufferbetrieb einschalten", en: "Switch on buffer mode", fr: "Activer le mode tampon", ja: "バッファー運転を開始" },
  f_zone_aus: { de: "Zone abschalten", en: "Switch zone off", fr: "Désactiver la zone", ja: "ゾーンを停止" },
  f_zone_an: { de: "Zone zuschalten", en: "Switch zone on", fr: "Activer la zone", ja: "ゾーンを運転" },
  f_heizkurve_zeigen: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "暖房曲線" },
  // Einstellungsdialog
  e_sprache: { de: "Sprache", en: "Language", fr: "Langue", ja: "言語" },
  e_sprache_h: { de: "automatisch folgt der Spracheinstellung von Home Assistant", en: "automatic follows the Home Assistant language", fr: "automatique suit la langue de Home Assistant", ja: "自動の場合はHome Assistantの言語に従います" },
  e_profil: { de: "Herstellerprofil", en: "Manufacturer profile", fr: "Profil du fabricant", ja: "メーカープロファイル" },
  e_profil_h: { de: "legt fest, nach welchem Namensschema gesucht wird", en: "defines the entity naming scheme to search for", fr: "définit le schéma de nommage recherché", ja: "検索するエンティティ名の規則" },
  e_anordnung: { de: "Anordnung", en: "Layout", fr: "Disposition", ja: "レイアウト" },
  e_anordnung_h: { de: "quer oder hochkant", en: "landscape or portrait", fr: "paysage ou portrait", ja: "横長または縦長" },
  e_breite: { de: "Breite", en: "Width", fr: "Largeur", ja: "幅" },
  e_hoehe: { de: "Höhe", en: "Height", fr: "Hauteur", ja: "高さ" },
  e_pixel_auto: { de: "Pixel, 0 heißt automatisch", en: "pixels, 0 means automatic", fr: "pixels, 0 = automatique", ja: "ピクセル、0で自動" },
  e_rohr: { de: "Rohrinnendurchmesser", en: "Pipe inner diameter", fr: "Diamètre intérieur du tuyau", ja: "配管内径" },
  e_rohr_h: { de: "Millimeter, färbt den Durchfluss, 0 heißt aus", en: "millimetres, colours the flow rate, 0 means off", fr: "millimètres, colore le débit, 0 = désactivé", ja: "ミリ、流量を色分け、0で無効" },
  e_mqtt: { de: "MQTT Präfix", en: "MQTT prefix", fr: "Préfixe MQTT", ja: "MQTTプレフィックス" },
  e_mqtt_h: { de: "für Befehle an HeishaMon, falls Werte nur lesbar sind", en: "for commands to HeishaMon when values are read only", fr: "pour les commandes à HeishaMon si les valeurs sont en lecture seule", ja: "値が読み取り専用の場合にHeishaMonへ送るコマンド用" },
  e_vbreite: { de: "Breite des Stromverlaufs", en: "Width of the energy chart", fr: "Largeur du graphique de consommation", ja: "使用量グラフの幅" },
  e_vbreite_h: { de: "250 bis 700, im Hochformat höchstens 360", en: "250 to 700, at most 360 in portrait", fr: "250 à 700, au plus 360 en portrait", ja: "250〜700、縦長では最大360" },
  e_kx_von: { de: "Heizkurve Außen von", en: "Heat curve outdoor from", fr: "Courbe, extérieur de", ja: "暖房曲線 外気 最小" },
  e_kx_von_h: { de: "linker Rand der Skala in Grad", en: "left edge of the scale in degrees", fr: "bord gauche de l'échelle en degrés", ja: "目盛りの左端（度）" },
  e_kx_bis: { de: "Heizkurve Außen bis", en: "Heat curve outdoor to", fr: "Courbe, extérieur à", ja: "暖房曲線 外気 最大" },
  e_kx_bis_h: { de: "rechter Rand der Skala in Grad", en: "right edge of the scale in degrees", fr: "bord droit de l'échelle en degrés", ja: "目盛りの右端（度）" },
  e_ky_von: { de: "Heizkurve Vorlauf von", en: "Heat curve flow from", fr: "Courbe, départ de", ja: "暖房曲線 往き 最小" },
  e_ky_von_h: { de: "unterer Rand der Skala in Grad", en: "bottom of the scale in degrees", fr: "bas de l'échelle en degrés", ja: "目盛りの下端（度）" },
  e_ky_bis: { de: "Heizkurve Vorlauf bis", en: "Heat curve flow to", fr: "Courbe, départ à", ja: "暖房曲線 往き 最大" },
  e_ky_bis_h: { de: "oberer Rand der Skala in Grad", en: "top of the scale in degrees", fr: "haut de l'échelle en degrés", ja: "目盛りの上端（度）" },
  e_hs_kalt: { de: "Heizungsskala kalt", en: "Heating scale, cold", fr: "Échelle chauffage, froid", ja: "暖房色 低温" },
  e_hs_kalt_h: { de: "Grad, färbt Speicher und Leitungen", en: "degrees, colours tanks and pipes", fr: "degrés, colore ballons et tuyaux", ja: "度、タンクと配管を色分け" },
  e_hs_heiss: { de: "Heizungsskala heiß", en: "Heating scale, hot", fr: "Échelle chauffage, chaud", ja: "暖房色 高温" },
  e_grad: { de: "Grad", en: "degrees", fr: "degrés", ja: "度" },
  e_as_kalt: { de: "Außenskala kalt", en: "Outdoor scale, cold", fr: "Échelle extérieure, froid", ja: "外気色 低温" },
  e_as_kalt_h: { de: "Grad, färbt den Außenfühler", en: "degrees, colours the outdoor sensor", fr: "degrés, colore la sonde extérieure", ja: "度、外気センサーを色分け" },
  e_as_warm: { de: "Außenskala warm", en: "Outdoor scale, warm", fr: "Échelle extérieure, doux", ja: "外気色 高温" },
  e_l_hk1: { de: "Beschriftung Heizkreis 1", en: "Label circuit 1", fr: "Nom du circuit 1", ja: "回路1の表示名" },
  e_l_hk2: { de: "Beschriftung Heizkreis 2", en: "Label circuit 2", fr: "Nom du circuit 2", ja: "回路2の表示名" },
  e_l_hk_h: { de: "gilt für Schaubild und Regler", en: "used in the diagram and the controls", fr: "utilisé dans le schéma et les commandes", ja: "図と操作部に表示" },
  e_l_buf: { de: "Beschriftung Puffer", en: "Label buffer", fr: "Nom du ballon tampon", ja: "バッファーの表示名" },
  e_l_dhw: { de: "Beschriftung Warmwasser", en: "Label hot water", fr: "Nom de l'eau chaude", ja: "給湯の表示名" },
  e_frei: { de: "frei wählbar", en: "free text", fr: "texte libre", ja: "自由入力" },
  e_l_energy: { de: "Beschriftung Energie", en: "Label energy", fr: "Nom de l'énergie", ja: "エネルギーの表示名" },
  e_l_energy_h: { de: "leer lassen, dann wählt die Karte selbst", en: "leave empty to let the card choose", fr: "laisser vide pour un choix automatique", ja: "空欄ならカードが自動で選択" },
  e_demo: { de: "Demomodus", en: "Demo mode", fr: "Mode démo", ja: "デモモード" },
  e_demo_h: { de: "erfundene Werte zum Ausprobieren, die Anlage bleibt unberührt", en: "sample values for trying out, the system is not touched", fr: "valeurs fictives pour essayer, l'installation n'est pas modifiée", ja: "試用のための仮の値、機器には影響しません" },
  e_ziel_zeigen: { de: "Ziel im Puffer und Warmwasser", en: "Target in buffer and hot water", fr: "Cible dans le ballon tampon et l'eau chaude", ja: "バッファーと給湯の目標" },
  e_ziel_zeigen_h: { de: "Zeile „Ziel …“ anzeigen", en: "show the “Target …” line", fr: "afficher la ligne « Cible … »", ja: "「目標 …」の行を表示" },
  e_laedt_zeigen: { de: "Lädt ab im Puffer und Warmwasser", en: "Reload temperature in buffer and hot water", fr: "Recharge dans le ballon tampon et l'eau chaude", ja: "バッファーと給湯の再加熱温度" },
  e_laedt_zeigen_h: { de: "Zeile „Lädt ab …“ anzeigen", en: "show the “Reloads at …” line", fr: "afficher la ligne « Recharge à … »", ja: "「再加熱 …」の行を表示" },
  e_verlauf: { de: "Verbrauchsverlauf", en: "Energy chart", fr: "Graphique de consommation", ja: "使用量グラフ" },
  e_verlauf_h: { de: "Diagramm der letzten 24 Stunden anzeigen", en: "show the chart of the past 24 hours", fr: "afficher le graphique des dernières 24 heures", ja: "過去24時間のグラフを表示" },
  e_anz_hk: { de: "Anzahl Heizkreise", en: "Number of circuits", fr: "Nombre de circuits", ja: "回路数" },
  e_anz_luefter: { de: "Anzahl Lüfter", en: "Number of fans", fr: "Nombre de ventilateurs", ja: "ファン数" },
  e_bewegung: { de: "Bewegung anzeigen", en: "Show animation", fr: "Afficher l'animation", ja: "アニメーションを表示" },
  e_tagesverbrauch: { de: "Tagesverbrauch aus dem Zählerstand rechnen", en: "Calculate daily energy from the meter reading", fr: "Calculer la consommation du jour à partir du compteur", ja: "メーター値から当日の使用量を計算" },
  e_alle_leeren: { de: "Alle leeren", en: "Clear all", fr: "Tout effacer", ja: "すべて消去" },
  e_datei_speichern: { de: "Als Datei speichern", en: "Save as file", fr: "Enregistrer dans un fichier", ja: "ファイルに保存" },
  e_datei_laden: { de: "Aus Datei laden", en: "Load from file", fr: "Charger un fichier", ja: "ファイルから読み込み" },
  e_uebernehmen: { de: "Aus Integration übernehmen", en: "Take over from integration", fr: "Reprendre de l'intégration", ja: "統合から取り込む" },
  e_feld_einlesen: { de: "Aus dem Feld einlesen", en: "Read from the field", fr: "Lire depuis le champ", ja: "欄から読み込む" },
  e_feld_schreiben: { de: "In das Feld schreiben", en: "Write to the field", fr: "Écrire dans le champ", ja: "欄に書き出す" },
  e_standardnamen: { de: "Standardnamen eintragen", en: "Fill in default names", fr: "Saisir les noms par défaut", ja: "標準名を入力" },
  e_1hk: { de: "1 Heizkreis", en: "1 circuit", fr: "1 circuit", ja: "1回路" },
  e_2hk: { de: "2 Heizkreise", en: "2 circuits", fr: "2 circuits", ja: "2回路" },
  e_1luefter: { de: "1 Lüfter", en: "1 fan", fr: "1 ventilateur", ja: "ファン1基" },
  e_2luefter: { de: "2 Lüfter", en: "2 fans", fr: "2 ventilateurs", ja: "ファン2基" },
  e_hoch: { de: "Hochformat", en: "Portrait", fr: "Portrait", ja: "縦長" },
  e_quer: { de: "Querformat", en: "Landscape", fr: "Paysage", ja: "横長" },
  e_auto: { de: "Automatisch", en: "Automatic", fr: "Automatique", ja: "自動" },
  e_darstellung: { de: "Darstellung", en: "Display", fr: "Affichage", ja: "表示" },
  e_integration: { de: "Integration", en: "Integration", fr: "Intégration", ja: "統合" },
  e_puffer: { de: "Heizungspuffer vorhanden", en: "Heating buffer installed", fr: "Ballon tampon présent", ja: "暖房バッファーあり" },
  e_zirk: { de: "Zirkulation", en: "Circulation", fr: "Circulation", ja: "循環" },
  e_zirk_h: { de: "automatisch sobald eine Zirkulationsentität zugeordnet ist", en: "automatic as soon as a circulation entity is assigned", fr: "automatique dès qu'une entité de circulation est attribuée", ja: "循環エンティティが割り当てられると自動" },
  e_puffer_auto_h: { de: "automatisch folgt TOP99, der Meldung der Wärmepumpe", en: "automatic follows TOP99, reported by the heat pump", fr: "automatique suit TOP99, signalé par la pompe à chaleur", ja: "自動の場合はヒートポンプのTOP99に従う" },
  e_anzeigen: { de: "Anzeigen", en: "Show", fr: "Afficher", ja: "表示" },
  e_ausblenden: { de: "Ausblenden", en: "Hide", fr: "Masquer", ja: "非表示" },
  e_vorhanden: { de: "Vorhanden", en: "Installed", fr: "Présent", ja: "あり" },
  e_nicht_vorhanden: { de: "Nicht vorhanden", en: "Not installed", fr: "Absent", ja: "なし" },
  // Meldungen
  m_erkannt: { de: "Heishamon by Lutarym erkannt. {a} Entitäten gefunden, {b} davon passen zu dieser Karte.", en: "Heishamon by Lutarym detected. {a} entities found, {b} of them match this card.", fr: "Heishamon by Lutarym détecté. {a} entités trouvées, dont {b} correspondent à cette carte.", ja: "Heishamon by Lutarym を検出しました。{a} 件のエンティティのうち {b} 件がこのカードに対応します。" },
  m_nicht_erkannt: { de: "Keine Entitäten der Integration gefunden. Du kannst die Standardnamen eintragen und danach anpassen.", en: "No entities of the integration found. You can fill in the default names and adjust them afterwards.", fr: "Aucune entité de l'intégration trouvée. Vous pouvez saisir les noms par défaut puis les ajuster.", ja: "統合のエンティティが見つかりません。標準名を入力してから調整できます。" },
  m_json: { de: "Das ist kein gültiges JSON. Bitte den exportierten Text einfügen.", en: "This is not valid JSON. Please paste the exported text.", fr: "Ce n'est pas un JSON valide. Veuillez coller le texte exporté.", ja: "有効なJSONではありません。書き出したテキストを貼り付けてください。" },
  m_datei_ok: { de: "Datei wurde erzeugt und steht im Download-Ordner.", en: "The file has been created and is in your downloads folder.", fr: "Le fichier a été créé et se trouve dans le dossier des téléchargements.", ja: "ファイルを作成しました。ダウンロードフォルダにあります。" },
  m_keine_konfig: { de: "Der Text enthält keine Konfiguration.", en: "The text contains no configuration.", fr: "Le texte ne contient aucune configuration.", ja: "テキストに設定が含まれていません。" },
  m_datei_fehler: { de: "Die Datei konnte nicht erzeugt werden.", en: "The file could not be created.", fr: "Le fichier n'a pas pu être créé.", ja: "ファイルを作成できませんでした。" },
  m_datei_lesen: { de: "Die Datei konnte nicht gelesen werden.", en: "The file could not be read.", fr: "Le fichier n'a pas pu être lu.", ja: "ファイルを読み込めませんでした。" },
  m_im_feld: { de: "Konfiguration steht im Feld und ist markiert, zum Kopieren bereit.", en: "The configuration is in the field and selected, ready to copy.", fr: "La configuration est dans le champ et sélectionnée, prête à être copiée.", ja: "設定を欄に書き出して選択しました。コピーできます。" },
  m_einst: { de: "{n} Einstellungen", en: "{n} settings", fr: "{n} réglages", ja: "設定 {n} 件" },
  m_ent: { de: "{n} Entitäten übernommen", en: "{n} entities applied", fr: "{n} entités appliquées", ja: "エンティティ {n} 件を適用" },
  m_unb_einst: { de: "{n} unbekannte Einstellungen übersprungen", en: "{n} unknown settings skipped", fr: "{n} réglages inconnus ignorés", ja: "不明な設定 {n} 件をスキップ" },
  m_unb_felder: { de: "{n} unbekannte Felder übersprungen", en: "{n} unknown fields skipped", fr: "{n} champs inconnus ignorés", ja: "不明な項目 {n} 件をスキップ" },
  m_bereich: { de: "{n} mit unpassendem Bereich übersprungen", en: "{n} with an unsuitable domain skipped", fr: "{n} avec un domaine inadapté ignorés", ja: "ドメインが合わない {n} 件をスキップ" },
  m_fehlen: { de: "{n} davon gibt es in Home Assistant nicht: {liste}", en: "{n} of them do not exist in Home Assistant: {liste}", fr: "{n} n'existent pas dans Home Assistant : {liste}", ja: "そのうち {n} 件はHome Assistantにありません：{liste}" },
  m_weitere: { de: " und weitere", en: " and more", fr: " et d'autres", ja: " ほか" },
  m_nicht_an: { de: "ACHTUNG, nicht angekommen: {liste}", en: "WARNING, not applied: {liste}", fr: "ATTENTION, non appliqué : {liste}", ja: "注意、適用されていません：{liste}" },
  // Entitaetsfelder
  fld_outside_temp: { de: "Außentemperatur", en: "Outdoor temperature", fr: "Température extérieure", ja: "外気温" },
  fld_power_state: { de: "Wärmepumpe Status, grüne LED", en: "Heat pump status, green LED", fr: "État de la pompe à chaleur, LED verte", ja: "ヒートポンプ状態、緑LED" },
  fld_compressor: { de: "Verdichterdrehzahl", en: "Compressor frequency", fr: "Fréquence du compresseur", ja: "圧縮機周波数" },
  fld_fan1_rpm: { de: "Lüfter 1 Drehzahl", en: "Fan 1 speed", fr: "Vitesse ventilateur 1", ja: "ファン1回転数" },
  fld_fan2_rpm: { de: "Lüfter 2 Drehzahl", en: "Fan 2 speed", fr: "Vitesse ventilateur 2", ja: "ファン2回転数" },
  fld_defrost: { de: "Abtauung läuft", en: "Defrost running", fr: "Dégivrage en cours", ja: "除霜中" },
  fld_error: { de: "Fehlercode", en: "Error code", fr: "Code d'erreur", ja: "エラーコード" },
  fld_heatpump_state: { de: "Betriebszustand", en: "Operating state", fr: "État de fonctionnement", ja: "運転状態" },
  fld_force_defrost: { de: "Abtauen erzwingen", en: "Force defrost", fr: "Forcer le dégivrage", ja: "強制除霜" },
  fld_powerful_mode: { de: "Turbomodus", en: "Powerful mode", fr: "Mode puissance", ja: "パワフル運転" },
  fld_quiet_mode: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "静音運転" },
  fld_power_now: { de: "Aktuelle Leistungsaufnahme", en: "Current power draw", fr: "Puissance absorbée actuelle", ja: "現在の消費電力" },
  fld_energy_today: { de: "Energiezähler", en: "Energy meter", fr: "Compteur d'énergie", ja: "電力量計" },
  fld_pv_power: { de: "PV Leistung aktuell", en: "Current PV power", fr: "Puissance PV actuelle", ja: "現在の太陽光出力" },
  fld_sg_k1: { de: "Kontakt K1 Sperre", en: "Contact K1, block", fr: "Contact K1, blocage", ja: "接点K1 停止" },
  fld_sg_k2: { de: "Kontakt K2 Anlauf", en: "Contact K2, start", fr: "Contact K2, démarrage", ja: "接点K2 起動" },
  fld_flow_temp: { de: "Vorlauftemperatur", en: "Flow temperature", fr: "Température de départ", ja: "往き温度" },
  fld_return_temp: { de: "Rücklauftemperatur", en: "Return temperature", fr: "Température de retour", ja: "還り温度" },
  fld_pump_speed: { de: "Primärpumpe Drehzahl", en: "Primary pump speed", fr: "Vitesse de la pompe primaire", ja: "一次ポンプ回転数" },
  fld_pump_flow: { de: "Durchflussmenge", en: "Flow rate", fr: "Débit", ja: "流量" },
  fld_three_way_valve: { de: "3-Wege-Umschaltventil", en: "Three-way diverter valve", fr: "Vanne trois voies", ja: "三方弁" },
  fld_water_pressure: { de: "Wasserdruck", en: "Water pressure", fr: "Pression d'eau", ja: "水圧" },
  fld_buffer_temp: { de: "Puffertemperatur", en: "Buffer temperature", fr: "Température du ballon tampon", ja: "バッファー温度" },
  fld_buffer_installed: { de: "Puffer vorhanden", en: "Buffer installed", fr: "Ballon tampon présent", ja: "バッファーあり" },
  fld_buffer_switch: { de: "Pufferbetrieb ein und aus", en: "Buffer mode on and off", fr: "Mode tampon marche et arrêt", ja: "バッファー運転の入切" },
  fld_curve_t_high: { de: "HK1 Heizkurve Vorlauf oben", en: "Circuit 1 heat curve, flow high", fr: "Circuit 1 courbe, départ haut", ja: "回路1 暖房曲線 往き 高" },
  fld_curve_t_low: { de: "HK1 Heizkurve Vorlauf unten", en: "Circuit 1 heat curve, flow low", fr: "Circuit 1 courbe, départ bas", ja: "回路1 暖房曲線 往き 低" },
  fld_curve_o_high: { de: "HK1 Heizkurve Außen oben", en: "Circuit 1 heat curve, outdoor high", fr: "Circuit 1 courbe, extérieur haut", ja: "回路1 暖房曲線 外気 高" },
  fld_curve_o_low: { de: "HK1 Heizkurve Außen unten", en: "Circuit 1 heat curve, outdoor low", fr: "Circuit 1 courbe, extérieur bas", ja: "回路1 暖房曲線 外気 低" },
  fld_curve2_t_high: { de: "HK2 Heizkurve Vorlauf oben", en: "Circuit 2 heat curve, flow high", fr: "Circuit 2 courbe, départ haut", ja: "回路2 暖房曲線 往き 高" },
  fld_curve2_t_low: { de: "HK2 Heizkurve Vorlauf unten", en: "Circuit 2 heat curve, flow low", fr: "Circuit 2 courbe, départ bas", ja: "回路2 暖房曲線 往き 低" },
  fld_curve2_o_high: { de: "HK2 Heizkurve Außen oben", en: "Circuit 2 heat curve, outdoor high", fr: "Circuit 2 courbe, extérieur haut", ja: "回路2 暖房曲線 外気 高" },
  fld_curve2_o_low: { de: "HK2 Heizkurve Außen unten", en: "Circuit 2 heat curve, outdoor low", fr: "Circuit 2 courbe, extérieur bas", ja: "回路2 暖房曲線 外気 低" },
  fld_buffer_delta: { de: "Puffer Hysterese", en: "Buffer hysteresis", fr: "Hystérésis du ballon tampon", ja: "バッファーのヒステリシス" },
  fld_buffer_target: { de: "Puffer Zieltemperatur", en: "Buffer target temperature", fr: "Température cible du ballon tampon", ja: "バッファー目標温度" },
  fld_room_heater: { de: "Heizstab Heizung freigegeben", en: "Heating element, heating: allowed", fr: "Appoint chauffage autorisé", ja: "暖房ヒーター許可" },
  fld_heater_internal: { de: "Heizstab intern läuft", en: "Internal heater running", fr: "Appoint interne en marche", ja: "内部ヒーター運転中" },
  fld_heater_external: { de: "Heizstab extern läuft", en: "External heater running", fr: "Appoint externe en marche", ja: "外部ヒーター運転中" },
  fld_cop_heating: { de: "COP Heizen", en: "COP heating", fr: "COP chauffage", ja: "COP 暖房" },
  fld_room_heater_switch: { de: "Heizstab Heizung freigeben", en: "Allow heating element, heating", fr: "Autoriser l'appoint chauffage", ja: "暖房ヒーター許可の切替" },
  fld_zones_state: { de: "Aktivierte Zonen", en: "Active zones", fr: "Zones actives", ja: "有効なゾーン" },
  fld_zones_select: { de: "Zonen umschalten", en: "Switch zones", fr: "Changer de zones", ja: "ゾーン切替" },
  fld_hk1_water: { de: "HK1 Wassertemperatur", en: "Circuit 1 water temperature", fr: "Circuit 1 température d'eau", ja: "回路1 水温" },
  fld_hk1_water_target: { de: "HK1 Wasser Sollwert", en: "Circuit 1 water target", fr: "Circuit 1 consigne d'eau", ja: "回路1 目標水温" },
  fld_hk1_pump: { de: "HK1 Pumpe läuft", en: "Circuit 1 pump running", fr: "Circuit 1 pompe en marche", ja: "回路1 ポンプ運転中" },
  fld_hk1_setpoint: { de: "HK1 Sollwert einstellbar", en: "Circuit 1 adjustable target", fr: "Circuit 1 consigne réglable", ja: "回路1 設定温度" },
  fld_hk1_switch: { de: "HK1 ein und aus", en: "Circuit 1 on and off", fr: "Circuit 1 marche et arrêt", ja: "回路1 入切" },
  fld_hk2_water: { de: "HK2 Wassertemperatur", en: "Circuit 2 water temperature", fr: "Circuit 2 température d'eau", ja: "回路2 水温" },
  fld_hk2_water_target: { de: "HK2 Wasser Sollwert", en: "Circuit 2 water target", fr: "Circuit 2 consigne d'eau", ja: "回路2 目標水温" },
  fld_hk2_pump: { de: "HK2 Pumpe läuft", en: "Circuit 2 pump running", fr: "Circuit 2 pompe en marche", ja: "回路2 ポンプ運転中" },
  fld_hk2_setpoint: { de: "HK2 Sollwert einstellbar", en: "Circuit 2 adjustable target", fr: "Circuit 2 consigne réglable", ja: "回路2 設定温度" },
  fld_hk2_switch: { de: "HK2 ein und aus", en: "Circuit 2 on and off", fr: "Circuit 2 marche et arrêt", ja: "回路2 入切" },
  fld_dhw_installed: { de: "Warmwasser vorhanden", en: "Hot water installed", fr: "Eau chaude présente", ja: "給湯あり" },
  fld_dhw_temp: { de: "Warmwasser Isttemperatur", en: "Hot water temperature", fr: "Température de l'eau chaude", ja: "給湯温度" },
  fld_dhw_heat_delta: { de: "Warmwasser Hysterese", en: "Hot water hysteresis", fr: "Hystérésis de l'eau chaude", ja: "給湯のヒステリシス" },
  fld_dhw_setpoint: { de: "Warmwasser Sollwert", en: "Hot water target", fr: "Consigne eau chaude", ja: "給湯設定温度" },
  fld_dhw_heater: { de: "Heizstab Warmwasser freigegeben", en: "Heating element, hot water: allowed", fr: "Appoint eau chaude autorisé", ja: "給湯ヒーター許可" },
  fld_dhw_force: { de: "Einmalig aufheizen", en: "Boost once", fr: "Chauffe unique", ja: "一回だけ加熱" },
  fld_dhw_force_state: { de: "Aufheizen läuft", en: "Boost running", fr: "Chauffe en cours", ja: "加熱中" },
  fld_force_sterilization: { de: "Legionellenschutz starten", en: "Start legionella cycle", fr: "Démarrer le cycle légionelles", ja: "レジオネラ運転を開始" },
  fld_sterilization_state: { de: "Legionellenschutz läuft", en: "Legionella cycle running", fr: "Cycle légionelles en cours", ja: "レジオネラ運転中" },
  fld_dhw_heater_switch: { de: "Heizstab Warmwasser freigeben", en: "Allow heating element, hot water", fr: "Autoriser l'appoint eau chaude", ja: "給湯ヒーター許可の切替" },
  fld_circulation_pump: { de: "Zirkulationspumpe läuft", en: "Circulation pump running", fr: "Pompe de circulation en marche", ja: "循環ポンプ運転中" },
  fld_cop_dhw: { de: "COP Warmwasser", en: "COP hot water", fr: "COP eau chaude", ja: "COP 給湯" },
  fld_circ_switch: { de: "Zirkulation Schalter (klickbar)", en: "Circulation switch (clickable)", fr: "Interrupteur de circulation (cliquable)", ja: "循環スイッチ（クリック可）" },
  fld_mode_select: { de: "Betriebsart umschalten", en: "Switch operating mode", fr: "Changer de mode", ja: "運転モード切替" },
  // Gruppen der Entitaetsfelder
  grp_0: { de: "Außenfühler", en: "Outdoor sensor", fr: "Sonde extérieure", ja: "外気センサー" },
  grp_1: { de: "Außengerät", en: "Outdoor unit", fr: "Unité extérieure", ja: "室外機" },
  grp_2: { de: "Heizkreis 1", en: "Circuit 1", fr: "Circuit 1", ja: "回路1" },
  grp_3: { de: "Heizkreis 2", en: "Circuit 2", fr: "Circuit 2", ja: "回路2" },
  grp_4: { de: "Heizkurve", en: "Heat curve", fr: "Courbe de chauffe", ja: "暖房曲線" },
  grp_5: { de: "Heizungspuffer", en: "Heating buffer", fr: "Ballon tampon", ja: "暖房バッファー" },
  grp_6: { de: "Primärkreis", en: "Primary circuit", fr: "Circuit primaire", ja: "一次回路" },
  grp_7: { de: "SG Ready", en: "SG Ready", fr: "SG Ready", ja: "SG Ready" },
  grp_8: { de: "Steuerung", en: "Control", fr: "Commande", ja: "制御" },
  grp_9: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "給湯" },
  // Hinweise zu den Feldern
  hnw_0: { de: "gilt für beide", en: "applies to both", fr: "vaut pour les deux", ja: "両方に適用" },
  hnw_1: { de: "eigener Schalter, optional", en: "own switch, optional", fr: "interrupteur propre, facultatif", ja: "独自スイッチ、任意" },
  hnw_2: { de: "Shelly, Relais oder Eingang", en: "Shelly, relay or input", fr: "Shelly, relais ou entrée", ja: "Shelly、リレーまたは入力" },
  hnw_3: { de: "eigene Entität, Watt", en: "own entity, watts", fr: "entité propre, watts", ja: "独自エンティティ、ワット" },
  hnw_4: { de: "Soll Vorlauf", en: "flow target", fr: "consigne départ", ja: "往き目標" },
  hnw_5: { de: "Shelly oder eigener Schalter", en: "Shelly or own switch", fr: "Shelly ou interrupteur propre", ja: "Shellyまたは独自スイッチ" },
  hnw_6: { de: "Switch zum Ein/Ausschalten der Zirkulation", en: "switch to turn circulation on and off", fr: "interrupteur pour la circulation", ja: "循環の入切スイッチ" },
  hnw_7: { de: "SetHeatpump oder TOP0", en: "SetHeatpump or TOP0", fr: "SetHeatpump ou TOP0", ja: "SetHeatpump または TOP0" },
  hnw_8: { de: "Quelle in der Integration unter COP Quelle wählbar", en: "source selectable in the integration under COP source", fr: "source réglable dans l'intégration sous Source COP", ja: "ソースは統合の COP ソースで選択" },
  grp_10: { de: "Erweiterte Einstellungen", en: "Advanced settings", fr: "Réglages avancés", ja: "詳細設定" },
  fld_heating_off_temp: { de: "Heizen aus ab Außentemperatur", en: "Heating off above outdoor temp.", fr: "Arrêt chauffage au-dessus de", ja: "暖房停止 外気温" },
  fld_heater_on_temp: { de: "Heizstab ein unter Außentemperatur", en: "Heater on below outdoor temp.", fr: "Appoint actif en dessous de", ja: "ヒーター開始 外気温" },
  fld_heat_delta: { de: "Spreizung Heizen", en: "Heating spread (ΔT)", fr: "Écart chauffage (ΔT)", ja: "暖房温度差 (ΔT)" },
  fld_heating_control: { de: "Regelung", en: "Heating control", fr: "Régulation", ja: "暖房制御" },
  fld_steril_temp: { de: "Legionellen Temperatur", en: "Legionella temperature", fr: "Température anti-légionelles", ja: "レジオネラ対策温度" },
  fld_steril_time: { de: "Legionellen Haltezeit", en: "Legionella hold time", fr: "Durée anti-légionelles", ja: "レジオネラ対策保持時間" },
  fld_pump_flow_mode: { de: "Pumpenregelung", en: "Pump control", fr: "Régulation de pompe", ja: "ポンプ制御" },
  fld_pump_max_duty: { de: "Max. Pumpenleistung", en: "Max. pump duty", fr: "Puissance max. pompe", ja: "ポンプ最大出力" },
  fld_quiet_priority: { de: "Leisemodus Vorrang", en: "Quiet mode priority", fr: "Priorité mode silencieux", ja: "静音モード優先" },
  o_komfort: { de: "Komfort", en: "Comfort", fr: "Confort", ja: "快適" },
  o_effizienz: { de: "Effizienz", en: "Efficiency", fr: "Efficacité", ja: "効率" },
  o_spreizung: { de: "Spreizung", en: "Spread", fr: "Écart", ja: "温度差" },
  o_max_leistung: { de: "Max. Leistung", en: "Max. duty", fr: "Puissance max.", ja: "最大出力" },
  o_lautstaerke: { de: "Lautstärke", en: "Sound", fr: "Son", ja: "静音" },
  o_leistung: { de: "Leistung", en: "Capacity", fr: "Puissance", ja: "能力" },
  k_heating_off_temp: { de: "Heizen aus ab", en: "Heating off above", fr: "Arrêt au-dessus de", ja: "暖房停止" },
  k_heater_on_temp: { de: "Heizstab unter", en: "Heater below", fr: "Appoint sous", ja: "ヒーター開始" },
  k_heat_delta: { de: "Spreizung", en: "Spread", fr: "Écart", ja: "温度差" },
  k_heating_control: { de: "Regelung", en: "Control", fr: "Régulation", ja: "制御" },
  k_steril_temp: { de: "Temperatur", en: "Temperature", fr: "Température", ja: "温度" },
  k_steril_time: { de: "Haltezeit", en: "Hold time", fr: "Durée", ja: "保持時間" },
  k_pump_flow_mode: { de: "Regelung", en: "Control", fr: "Régulation", ja: "制御" },
  k_pump_max_duty: { de: "Max. Leistung", en: "Max. duty", fr: "Puissance max.", ja: "最大出力" },
  k_quiet_priority: { de: "Vorrang", en: "Priority", fr: "Priorité", ja: "優先" },
  t_legionellen: { de: "Legionellenschutz", en: "Legionella protection", fr: "Anti-légionelles", ja: "レジオネラ対策" },
  t_leise: { de: "Leisemodus", en: "Quiet mode", fr: "Mode silencieux", ja: "静音モード" },
  fld_holiday_mode: { de: "Urlaubsmodus", en: "Holiday mode", fr: "Mode vacances", ja: "休暇モード" },
  fld_main_schedule: { de: "Wochenprogramm", en: "Weekly schedule", fr: "Programme hebdomadaire", ja: "週間スケジュール" },
  fld_smart_dhw: { de: "Smart DHW Warmwasser", en: "Smart DHW", fr: "Smart DHW eau chaude", ja: "スマート給湯" },
  fld_fault_reset: { de: "Störung quittieren", en: "Reset fault", fr: "Acquitter le défaut", ja: "異常リセット" },
  fld_operating_hours: { de: "Betriebsstunden", en: "Operating hours", fr: "Heures de fonctionnement", ja: "運転時間" },
  fld_compressor_starts: { de: "Verdichterstarts", en: "Compressor starts", fr: "Démarrages du compresseur", ja: "圧縮機起動回数" },
  fld_room_heater_hours: { de: "Heizstab Heizen Betriebsstunden", en: "Heater hours, heating", fr: "Heures appoint chauffage", ja: "暖房ヒーター運転時間" },
  fld_dhw_heater_hours: { de: "Heizstab Warmwasser Betriebsstunden", en: "Heater hours, hot water", fr: "Heures appoint eau chaude", ja: "給湯ヒーター運転時間" },
  k_holiday_mode: { de: "Urlaub", en: "Holiday", fr: "Vacances", ja: "休暇" },
  k_main_schedule: { de: "Wochenprogramm", en: "Weekly schedule", fr: "Programme hebdo", ja: "週間スケジュール" },
  k_smart_dhw: { de: "Smart DHW", en: "Smart DHW", fr: "Smart DHW", ja: "スマート給湯" },
  k_fault_reset: { de: "Fehler", en: "Error", fr: "Erreur", ja: "エラー" },
  k_operating_hours: { de: "Betriebsstunden", en: "Operating hours", fr: "Heures", ja: "運転時間" },
  k_compressor_starts: { de: "Verdichterstarts", en: "Compressor starts", fr: "Démarrages", ja: "起動回数" },
  k_room_heater_hours: { de: "Heizstab Heizen", en: "Heater, heating", fr: "Appoint chauffage", ja: "暖房ヒーター" },
  k_dhw_heater_hours: { de: "Heizstab Warmwasser", en: "Heater, hot water", fr: "Appoint eau chaude", ja: "給湯ヒーター" },
  o_aus: { de: "Aus", en: "Off", fr: "Arrêt", ja: "オフ" },
  o_ein: { de: "Ein", en: "On", fr: "Marche", ja: "オン" },
  o_variabel: { de: "Variabel", en: "Variable", fr: "Variable", ja: "可変" },
  o_standard: { de: "Standard", en: "Standard", fr: "Standard", ja: "標準" },
  t_quittieren: { de: "Quittieren", en: "Reset", fr: "Acquitter", ja: "リセット" },
  t_betrieb: { de: "Betrieb", en: "Operation", fr: "Fonctionnement", ja: "運転" },
  t_stoerung: { de: "Störung", en: "Fault", fr: "Défaut", ja: "異常" },
  t_info: { de: "Info", en: "Info", fr: "Infos", ja: "情報" },
  h_knopf: { de: "Hilfe zu allen Werten", en: "Help for all values", fr: "Aide sur toutes les valeurs", ja: "すべての値のヘルプ" },
  h_titel: { de: "Was bedeutet welcher Wert?", en: "What does each value mean?", fr: "Que signifie chaque valeur ?", ja: "各値の意味" },
  h_suche: { de: "Suchen, z. B. Warmwasser, Heizkurve, TOP9 …", en: "Search, e.g. hot water, heating curve, TOP9 …", fr: "Rechercher, p. ex. eau chaude, courbe, TOP9 …", ja: "検索（例：給湯、暖房曲線、TOP9 …）" },
  h_alle: { de: "Alle", en: "All", fr: "Tout", ja: "すべて" },
  h_lesen: { de: "Lesen", en: "Read", fr: "Lecture", ja: "読み取り" },
  h_schreiben: { de: "Schreiben", en: "Write", fr: "Écriture", ja: "書き込み" },
  h_anzahl: { de: "{n} Einträge", en: "{n} entries", fr: "{n} entrées", ja: "{n} 件" },
  r_bereitschaft: { de: "Bereitschaft", en: "Standby", fr: "Veille", ja: "待機" },
  s_verbrauch_heute: { de: "Verbrauch heute", en: "Consumption today", fr: "Consommation du jour", ja: "本日の消費電力量" },
  s_max: { de: "max {v}", en: "max {v}", fr: "max {v}", ja: "最大 {v}" },
  s_temperatur: { de: "Temperatur", en: "Temperature", fr: "Température", ja: "温度" },
  h_kopieren: { de: "Klicken zum Kopieren", en: "Click to copy", fr: "Cliquer pour copier", ja: "クリックしてコピー" },
  h_kopiert: { de: "Kopiert", en: "Copied", fr: "Copié", ja: "コピーしました" },
  h_entitaet: { de: "Entität", en: "Entity", fr: "Entité", ja: "エンティティ" },
  h_keine_entitaet: { de: "Keine passende Entität in Home Assistant gefunden", en: "No matching entity found in Home Assistant", fr: "Aucune entité correspondante trouvée dans Home Assistant", ja: "Home Assistant に該当するエンティティがありません" },
  h_anzahl1: { de: "1 Eintrag", en: "1 entry", fr: "1 entrée", ja: "1 件" },
  h_keine: { de: "Nichts gefunden. Anderes Suchwort versuchen.", en: "Nothing found. Try another search term.", fr: "Aucun résultat. Essayez un autre mot.", ja: "見つかりません。別の語で検索してください。" },
  h_quelle: { de: "Grundlage: HeishaMon-Dokumentation und Panasonic-Anleitung. Was dort nicht beschrieben ist, steht hier auch nicht.", en: "Based on: HeishaMon documentation and Panasonic manual. What is not described there is not stated here either.", fr: "Sources : documentation HeishaMon et notice Panasonic. Ce qui n'y est pas décrit n'est pas affirmé ici.", ja: "出典：HeishaMon の説明書と Panasonic の取扱説明書。そこに書かれていないことはここでも述べていません。" },
  t_oeffnen: { de: "Erweiterte Einstellungen öffnen", en: "Open advanced settings", fr: "Ouvrir les réglages avancés", ja: "詳細設定を開く" },
  t_heizen: { de: "Heizen", en: "Heating", fr: "Chauffage", ja: "暖房" },
  t_warmwasser: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "給湯" },
  t_pumpe: { de: "Pumpe", en: "Pump", fr: "Pompe", ja: "ポンプ" },
  t_uebernehmen: { de: "Übernehmen", en: "Apply", fr: "Appliquer", ja: "適用" },
  t_abbrechen: { de: "Abbrechen", en: "Cancel", fr: "Annuler", ja: "キャンセル" },
  t_nur_lesbar: { de: "nur lesbar", en: "read only", fr: "lecture seule", ja: "読み取り専用" },
  s_versch: { de: "Verschiebung der Heizkurve", en: "Heat curve shift", fr: "Décalage de la courbe", ja: "暖房曲線のシフト" },
  r_verlauf_zeigen: { de: "Verlauf anzeigen", en: "Show history", fr: "Afficher l'historique", ja: "履歴を表示" },
  s_cop: { de: "Ø COP heute {v}", en: "Ø COP today {v}", fr: "Ø COP jour {v}", ja: "本日 Ø COP {v}" },
  // Auswahl- und Zustandswerte
  w_0: { de: "Nur Heizen", en: "Heat only", fr: "Chauffage seul", ja: "暖房のみ" },
  w_1: { de: "Nur Kühlen", en: "Cool only", fr: "Refroidissement seul", ja: "冷房のみ" },
  w_2: { de: "Automatik Heizen", en: "Auto heat", fr: "Chauffage auto", ja: "自動暖房" },
  w_3: { de: "Nur Warmwasser", en: "Hot water only", fr: "Eau chaude seule", ja: "給湯のみ" },
  w_4: { de: "Heizen und Warmwasser", en: "Heat and hot water", fr: "Chauffage et eau chaude", ja: "暖房と給湯" },
  w_5: { de: "Kühlen und Warmwasser", en: "Cool and hot water", fr: "Refroidissement et eau chaude", ja: "冷房と給湯" },
  w_6: { de: "Automatik Heizen und Warmwasser", en: "Auto heat and hot water", fr: "Chauffage auto et eau chaude", ja: "自動暖房と給湯" },
  w_7: { de: "Automatik Kühlen", en: "Auto cool", fr: "Refroidissement auto", ja: "自動冷房" },
  w_8: { de: "Automatik Kühlen und Warmwasser", en: "Auto cool and hot water", fr: "Refroidissement auto et eau chaude", ja: "自動冷房と給湯" },
  w_9: { de: "Aus", en: "Off", fr: "Arrêt", ja: "オフ" },
  w_10: { de: "Stufe 1", en: "Level 1", fr: "Niveau 1", ja: "レベル1" },
  w_11: { de: "Stufe 2", en: "Level 2", fr: "Niveau 2", ja: "レベル2" },
  w_12: { de: "Stufe 3", en: "Level 3", fr: "Niveau 3", ja: "レベル3" },
  w_13: { de: "30 Minuten", en: "30 minutes", fr: "30 minutes", ja: "30分" },
  w_14: { de: "60 Minuten", en: "60 minutes", fr: "60 minutes", ja: "60分" },
  w_15: { de: "90 Minuten", en: "90 minutes", fr: "90 minutes", ja: "90分" },
  w_16: { de: "Heizung", en: "Heating", fr: "Chauffage", ja: "暖房" },
  w_17: { de: "Warmwasser", en: "Hot water", fr: "Eau chaude", ja: "給湯" },
  w_18: { de: "läuft", en: "running", fr: "en marche", ja: "運転中" },
  w_19: { de: "aus", en: "off", fr: "arrêt", ja: "停止" },
  w_20: { de: "Wärmepumpe", en: "Heat pump", fr: "Pompe à chaleur", ja: "ヒートポンプ" },
  w_21: { de: "Pumpe HK1", en: "Pump circuit 1", fr: "Pompe circuit 1", ja: "回路1ポンプ" },
  w_22: { de: "Pumpe HK2", en: "Pump circuit 2", fr: "Pompe circuit 2", ja: "回路2ポンプ" },
  w_23: { de: "Heizstab Heizung", en: "Heater, heating", fr: "Appoint chauffage", ja: "暖房ヒーター" },
  w_43: { de: "Heizstab läuft", en: "Heater running", fr: "Appoint en marche", ja: "ヒーター運転中" },
  w_24: { de: "Heizstab Warmwasser", en: "Heater, hot water", fr: "Appoint eau chaude", ja: "給湯ヒーター" },
  w_25: { de: "Abtauung", en: "Defrost", fr: "Dégivrage", ja: "除霜" },
  w_26: { de: "Zirkulation Status", en: "Circulation", fr: "Circulation", ja: "循環" },
  w_27: { de: "Aufheizen", en: "Boost", fr: "Chauffe", ja: "加熱" },
  w_28: { de: "Legionellenschutz", en: "Legionella cycle", fr: "Cycle légionelles", ja: "レジオネラ運転" },
  w_29: { de: "PV Leistung", en: "PV power", fr: "Puissance PV", ja: "太陽光出力" },
  w_30: { de: "Außen", en: "Outdoor", fr: "Extérieur", ja: "外気" },
  w_31: { de: "Vorlauf", en: "Flow", fr: "Départ", ja: "往き" },
  w_32: { de: "Rücklauf", en: "Return", fr: "Retour", ja: "還り" },
  w_33: { de: "Puffer", en: "Buffer", fr: "Tampon", ja: "バッファー" },
  w_34: { de: "HK1 Wasser", en: "Circuit 1 water", fr: "Circuit 1 eau", ja: "回路1 水温" },
  w_35: { de: "HK2 Wasser", en: "Circuit 2 water", fr: "Circuit 2 eau", ja: "回路2 水温" },
  w_36: { de: "Verdichter", en: "Compressor", fr: "Compresseur", ja: "圧縮機" },
  w_37: { de: "Durchfluss", en: "Flow rate", fr: "Débit", ja: "流量" },
  w_38: { de: "Panasonic Aquarea, HeishaMon über MQTT-Namensschema", en: "Panasonic Aquarea, HeishaMon via MQTT naming", fr: "Panasonic Aquarea, HeishaMon via nommage MQTT", ja: "Panasonic Aquarea、MQTT命名規則のHeishaMon" },
  w_39: { de: "Vaillant, in Vorbereitung", en: "Vaillant, in preparation", fr: "Vaillant, en préparation", ja: "Vaillant（準備中）" },
  w_40: { de: "Bosch, in Vorbereitung", en: "Bosch, in preparation", fr: "Bosch, en préparation", ja: "Bosch（準備中）" },
  w_41: { de: "Viessmann, in Vorbereitung", en: "Viessmann, in preparation", fr: "Viessmann, en préparation", ja: "Viessmann（準備中）" },
  w_42: { de: "Stiebel Eltron, in Vorbereitung", en: "Stiebel Eltron, in preparation", fr: "Stiebel Eltron, en préparation", ja: "Stiebel Eltron（準備中）" },
  r_demo_hinweis: { de: "Erfundene Werte, die Anlage bleibt unberührt", en: "Sample values, the system is not touched", fr: "Valeurs fictives, l'installation n'est pas modifiée", ja: "仮の値です。機器には影響しません" },
  r_stoerung: { de: "Störung", en: "Fault", fr: "Défaut", ja: "異常" },
  r_zurueck: { de: "Zurücksetzen", en: "Reset", fr: "Réinitialiser", ja: "リセット" },
  r_betrieb: { de: "Betrieb", en: "Operation", fr: "Fonctionnement", ja: "運転" },
  r_heizen: { de: "Heizen", en: "Heating", fr: "Chauffage", ja: "暖房" },
  r_kuehlen: { de: "Kühlen", en: "Cooling", fr: "Refroidissement", ja: "冷房" },
  r_automatik: { de: "Automatik", en: "Automatic", fr: "Automatique", ja: "自動" },
  r_abtauen: { de: "Abtauen", en: "Defrost", fr: "Dégivrage", ja: "除霜" },
  r_platzhalter: { de: "Hier erscheint die exportierte Konfiguration. Zum Einlesen eigenen Text einfügen und auf Einlesen drücken.", en: "The exported configuration appears here. To import, paste your own text and press read.", fr: "La configuration exportée apparaît ici. Pour importer, collez votre texte et appuyez sur lire.", ja: "書き出した設定がここに表示されます。読み込むにはテキストを貼り付けて読み込みを押してください。" },
  r_sg_hinweis: { de: "SG Ready liefert HeishaMon nicht. Trage die beiden Kontakte ein, K1 für Sperre und K2 für Anlauf. Den Betriebszustand 1 bis 4 leitet die Karte daraus selbst ab. Die Knöpfe oben führen zusammen und löschen eigene Einträge nicht.", en: "HeishaMon does not provide SG Ready. Enter the two contacts, K1 for block and K2 for start. The card derives operating states 1 to 4 from them. The buttons above merge and do not delete your own entries.", fr: "HeishaMon ne fournit pas SG Ready. Indiquez les deux contacts, K1 pour le blocage et K2 pour le démarrage. La carte en déduit les états 1 à 4. Les boutons ci-dessus fusionnent et n'effacent pas vos saisies.", ja: "HeishaMonはSG Readyを提供しません。停止用のK1と起動用のK2の2つの接点を入力してください。運転状態1〜4はカードが自動で判定します。上のボタンは統合するだけで、独自の入力は消しません。" },
  r_zonen_unbekannt: { de: "Zonen unbekannt", en: "Zones unknown", fr: "Zones inconnues", ja: "ゾーン不明" },
  r_einziger_kreis: { de: "Einziger aktiver Heizkreis", en: "Only active circuit", fr: "Seul circuit actif", ja: "唯一の稼働回路" },
  r_upm: { de: "U/min", en: "rpm", fr: "tr/min", ja: "rpm" },
  // Statuszeilen
  s_ziel: { de: "Ziel {v} °C", en: "Target {v} °C", fr: "Cible {v} °C", ja: "目標 {v} °C" },
  s_laedt_ab: { de: "Lädt ab {v} °C", en: "Reheat at {v} °C", fr: "Relance à {v} °C", ja: "{v} °C 以下で再加熱" },
  s_stoerung: { de: "Störung der Wärmepumpe: {v}", en: "Heat pump fault: {v}", fr: "Défaut de la pompe à chaleur : {v}", ja: "ヒートポンプ異常：{v}" },
  s_keine_ent: { de: "Keine Entitäten zugeordnet. Karte bearbeiten und oben auf „Aus Integration übernehmen“ drücken.", en: "No entities assigned. Edit the card and press “Take over from integration” at the top.", fr: "Aucune entité attribuée. Modifiez la carte et appuyez sur « Reprendre de l'intégration » en haut.", ja: "エンティティが割り当てられていません。カードを編集し、上部の「統合から取り込む」を押してください。" },
  s_aussen: { de: "{v} °C außen", en: "{v} °C outdoor", fr: "{v} °C extérieur", ja: "外気 {v} °C" },
  s_vorlauf_soll: { de: "→ {v} °C Vorlauf", en: "→ {v} °C flow", fr: "→ {v} °C départ", ja: "→ 往き {v} °C" },
  s_zaehler: { de: "Zählerstand gesamt", en: "Meter total", fr: "Index total", ja: "積算値" },
  s_schema: { de: "Schema der Wärmepumpenanlage", en: "Heat pump system diagram", fr: "Schéma de l'installation", ja: "ヒートポンプシステム図" },
  s_kleiner: { de: "Kleiner", en: "Decrease", fr: "Diminuer", ja: "下げる" },
  s_groesser: { de: "Größer", en: "Increase", fr: "Augmenter", ja: "上げる" },
  f_einstellen: { de: "Einstellen", en: "Settings", fr: "Réglages", ja: "設定" },
  f_schliessen: { de: "Schließen", en: "Close", fr: "Fermer", ja: "閉じる" },
  f_nur_lesbar: { de: " – nur lesbar", en: " – read only", fr: " – lecture seule", ja: "（読み取り専用）" },
};

/** Zuordnung deutscher Gruppen und Hinweise zu Sprachschluesseln. */
const GRUPPEN_SCHLUESSEL = { "Außenfühler": "grp_0", "Außengerät": "grp_1", "Heizkreis 1": "grp_2", "Heizkreis 2": "grp_3", "Heizkurve": "grp_4", "Heizungspuffer": "grp_5", "Primärkreis": "grp_6", "SG Ready": "grp_7", "Steuerung": "grp_8", "Warmwasser": "grp_9", "Erweiterte Einstellungen": "grp_10" };
const HINWEIS_SCHLUESSEL = { "gilt für beide": "hnw_0", "eigener Schalter, optional": "hnw_1", "Shelly, Relais oder Eingang": "hnw_2", "eigene Entität, Watt": "hnw_3", "Soll Vorlauf": "hnw_4", "Shelly oder eigener Schalter": "hnw_5", "Switch zum Ein/Ausschalten der Zirkulation": "hnw_6", "SetHeatpump oder TOP0": "hnw_7", "Quelle in der Integration unter COP Quelle wählbar": "hnw_8" };

/** Setzt Werte in Platzhalter wie {n} ein. */
function tf(text, werte) {
  return String(text).replace(/\{(\w+)\}/g, (_, k) =>
    werte && werte[k] !== undefined ? werte[k] : `{${k}}`
  );
}

/** Zuordnung deutscher Auswahl- und Zustandswerte zu Sprachschluesseln. */
const WERT_SCHLUESSEL = { "Wärmepumpe": "w_20", "Pumpe HK1": "w_21", "Pumpe HK2": "w_22", "Heizstab Heizung": "w_23", "Heizstab Warmwasser": "w_24", "Heizstab läuft": "w_43", "Abtauung": "w_25", "Zirkulation Status": "w_26", "Aufheizen": "w_27", "Legionellenschutz": "w_28", "PV Leistung": "w_29", "Außen": "w_30", "Vorlauf": "w_31", "Rücklauf": "w_32", "Puffer": "w_33", "HK1 Wasser": "w_34", "HK2 Wasser": "w_35", "Verdichter": "w_36", "Durchfluss": "w_37", "Panasonic Aquarea, HeishaMon über MQTT-Namensschema": "w_38", "Vaillant, in Vorbereitung": "w_39", "Bosch, in Vorbereitung": "w_40", "Viessmann, in Vorbereitung": "w_41", "Stiebel Eltron, in Vorbereitung": "w_42", "Nur Heizen": "w_0", "Nur Kühlen": "w_1", "Automatik Heizen": "w_2", "Nur Warmwasser": "w_3", "Heizen und Warmwasser": "w_4", "Kühlen und Warmwasser": "w_5", "Automatik Heizen und Warmwasser": "w_6", "Automatik Kühlen": "w_7", "Automatik Kühlen und Warmwasser": "w_8", "Aus": "w_9", "Stufe 1": "w_10", "Stufe 2": "w_11", "Stufe 3": "w_12", "30 Minuten": "w_13", "60 Minuten": "w_14", "90 Minuten": "w_15", "Heizung": "w_16", "Warmwasser": "w_17", "läuft": "w_18", "aus": "w_19" };

/** Auswahl- oder Zustandswert in der gewuenschten Sprache. */
function wertText(wert, sprache) {
  const k = WERT_SCHLUESSEL[wert];
  return k ? t(k, sprache) : wert;
}

/** Beschriftung eines Entitaetsfeldes in der gewuenschten Sprache. */
function feldText(feld, sprache) {
  return TEXTE[`fld_${feld.key}`] ? t(`fld_${feld.key}`, sprache) : feld.label;
}

/** Gruppenname in der gewuenschten Sprache. */
function gruppenText(name, sprache) {
  const k = GRUPPEN_SCHLUESSEL[name];
  return k ? t(k, sprache) : name;
}

/** Hinweis zu einem Feld. Deutsche Teile werden uebersetzt, technische
 *  Angaben wie TOP-Nummern oder Befehlsnamen bleiben stehen. */
function hinweisText(hint, sprache) {
  let s = String(hint || "");
  Object.keys(HINWEIS_SCHLUESSEL)
    .sort((x, y) => y.length - x.length)
    .forEach((de) => {
      if (s.includes(de)) s = s.split(de).join(t(HINWEIS_SCHLUESSEL[de], sprache));
    });
  return s;
}

/** Liefert einen Text in der gewuenschten Sprache. */
function t(schluessel, sprache) {
  const eintrag = TEXTE[schluessel];
  if (!eintrag) return schluessel;
  return eintrag[sprache] || eintrag.en || eintrag.de;
}

const SG_STATES = {
  1: { kurz: "sg1_kurz", lang: "sg1_lang", farbe: "#FF6B5E" },
  2: { kurz: "sg2_kurz", lang: "sg2_lang", farbe: "#C3D0E0" },
  3: { kurz: "sg3_kurz", lang: "sg3_lang", farbe: "#FFC44D" },
  4: { kurz: "sg4_kurz", lang: "sg4_lang", farbe: "#5BE08F" },
};

/* ------------------------------------------------------------------ *
 *  Thermische Farbskala
 * ------------------------------------------------------------------ */
const THERMAL_STOPS = [
  { p: 0.0, c: [29, 78, 216] },
  { p: 0.3, c: [6, 166, 199] },
  { p: 0.55, c: [242, 178, 51] },
  { p: 0.78, c: [238, 122, 43] },
  { p: 1.0, c: [214, 43, 43] },
];

const NEUTRAL = "#46536A";

/* ------------------------------------------------------------------ *
 *  Farbskala fuer die Verdichterlast
 *  Gruen bei geringer, rot bei hoher Drehzahl. Die Grenzen stammen
 *  aus der Anlage: 16 Hz ist die kleinste, 90 Hz die groesste Drehzahl.
 * ------------------------------------------------------------------ */
// Normalbereich des Wasserdrucks laut Panasonic fuer Aquarea.
const DRUCK_MIN = 0.5;
const DRUCK_MAX = 3.0;

const COMP_MIN_HZ = 16;
const COMP_MAX_HZ = 90;
const LOAD_STOPS = [
  { p: 0.0, c: [91, 224, 143] },
  { p: 0.4, c: [255, 196, 77] },
  { p: 0.7, c: [224, 118, 46] },
  { p: 1.0, c: [255, 107, 94] },
];

function loadColor(value, min, max) {
  // Steht der Verdichter, gibt es keine Last und damit keine Farbe.
  if (value === null || value === undefined || Number.isNaN(value)) return NEUTRAL;
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
  const local = (p - a.p) / ((b.p - a.p) || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// Pumpen drehen bewusst langsam und immer gleich schnell. Sie sollen
// nur zeigen, dass sie foerdern, nicht wie schnell.
const PUMP_SECONDS = 3;

// Wie lange ein selbst gesetzter Wert stehen bleibt, bis die Anlage nachzieht.
const HOLD_MS = 12000;

// Vorrat an Blasen je Speicher. Sichtbar ist ein Anteil davon.
const BUBBLE_COUNT = 14;

// Die Steigdauer einer Blase haengt allein von ihrem Index ab. Sie wird
// beim ersten Zugriff berechnet und danach nur noch nachgeschlagen.
const BUBBLE_DAUER = [];
function bubbleDauer(idx) {
  if (BUBBLE_DAUER[idx] === undefined) {
    let seed = idx + 42;
    seed = (seed * 1103515245 + 12345) % 2147483648;
    BUBBLE_DAUER[idx] = 4 + (seed / 2147483648) * 4;
  }
  return BUBBLE_DAUER[idx];
}

// Im Demomodus gehoeren Schaltbefehl und Rueckmeldetopic zusammen.
// Wird das eine gesetzt, folgt das andere.
const DEMO_PAARE = {
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

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}

function thermalColor(value, min, max) {
  if (value === null || value === undefined || Number.isNaN(value)) return NEUTRAL;
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
  const local = (p - a.p) / ((b.p - a.p) || 1);
  const rgb = a.c.map((ch, i) => Math.round(ch + (b.c[i] - ch) * local));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/* ------------------------------------------------------------------ *
 *  Zustandshelfer
 * ------------------------------------------------------------------ */
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
  if (!st || st.attributes[key] === undefined) return fallback;
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

/**
 * Dezimaltrennzeichen der gerade angezeigten Sprache. Deutsch und
 * Franzoesisch trennen mit Komma, Englisch und Japanisch mit Punkt.
 * Die Karte setzt den Wert vor jedem Zeichnen.
 */
let DEZIMAL = ",";

function dezimalFuer(sprache) {
  return sprache === "de" || sprache === "fr" ? "," : ".";
}

function fmt(value, digits) {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return value.toFixed(digits === undefined ? 1 : digits).replace(".", DEZIMAL);
}

function friendly(hass, entityId) {
  return attr(hass, entityId, "friendly_name", entityId || "");
}

/**
 * Breite eines Namensfeldes aus der Textlaenge. Die Namen sind frei
 * konfigurierbar, feste Kastenbreiten wuerden bei langen Namen
 * ueberlaufen. Die Schrift ist 15px in Grossbuchstaben mit Sperrung.
 */
/**
 * Breite eines Abzeichens aus seinem Text. Die Beschriftungen sind
 * unterschiedlich lang, und in anderen Sprachen deutlich laenger als
 * im Deutschen. Ein fester Kasten wuerde dort ueberlaufen.
 */
function abzeichenBreite(text) {
  const laenge = String(text || "").length;
  return Math.max(112, Math.round(laenge * 13 * 0.57) + 28);
}

/**
 * Nur number- und input_number-Entitaeten lassen sich stellen. Zeigt
 * jemand auf eine sensor-Entitaet, ist der Wert nur lesbar. Ohne diese
 * Pruefung wuerde Home Assistant mit "sensor.set_value nicht gefunden"
 * antworten.
 */
function stellbar(id) {
  const bereich = String(id || "").split(".")[0];
  return bereich === "number" || bereich === "input_number";
}

function schildBreite(text, mindest) {
  const laenge = String(text === undefined || text === null ? "" : text).length;
  return Math.max(mindest, Math.round(laenge * 15 * 0.66) + 24);
}

function escapeHtml(text) {
  return String(text === undefined || text === null ? "" : text).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/**
 * Zeitgewichteter Mittelwert einer Verlaufsreihe zwischen start und ende.
 * Nur Zahlen groesser 0 zaehlen. Ohne gueltige Zeit ergibt sich null.
 */
function copMittel(reihe, start, ende) {
  const punkte = reihe
    .map((pkt) => {
      const roh = pkt.s !== undefined ? pkt.s : pkt.state;
      let t = pkt.lu !== undefined ? pkt.lu * 1000 : Date.parse(pkt.last_updated || pkt.last_changed);
      if (Number.isNaN(t) || t < start) t = start;
      return { t, v: parseFloat(roh) };
    })
    .sort((a, b) => a.t - b.t);
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

/* ------------------------------------------------------------------ *
 *  Erkennung der Integration "Heishamon by Lutarym"
 * ------------------------------------------------------------------ */
const INTEGRATION_DOMAIN = "heishamon_lutarym";

const TOPIC_TO_FIELD = {
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
};

const COMMAND_TO_FIELD = {
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
  setreset: "fault_reset",
};

/**
 * Leistungszahlen aus HeishaMon by Lutarym. Die Integration liefert je
 * Betriebsart einen berechneten und einen gemessenen Wert. Gemessen
 * nutzt einen externen Strommesser und ist genauer.
 */
const COP_TO_FIELD = {
  cop_heating: "cop_heating",
  cop_dhw: "cop_dhw",
};
const COP_MUSTER = /_(cop_(?:heating|dhw))$/;

const FIELD_DOMAIN = {
  hk1_setpoint: ["number", "input_number"],
  hk2_setpoint: ["number", "input_number"],
  dhw_setpoint: ["number", "input_number"],
  power_state: ["switch", "input_boolean", "binary_sensor", "sensor"],
  mode_select: ["select", "input_select"],
  dhw_force: ["switch", "input_boolean"],
  hk1_switch: ["switch", "input_boolean"],
  hk2_switch: ["switch", "input_boolean"],
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
  sg_k2: ["switch", "input_boolean", "binary_sensor", "sensor"],
};

function detectIntegration(hass, profil) {
  const result = { found: false, source: "keine", entities: {}, count: 0, devices: 0 };
  if (!hass) return result;

  const assign = (key, entityId) => {
    const field = TOPIC_TO_FIELD[key] || COMMAND_TO_FIELD[key] || COP_TO_FIELD[key];
    if (!field || !entityId) return;
    const allowed = FIELD_DOMAIN[field];
    if (allowed && !allowed.includes(entityId.split(".")[0])) return;
    // Liefert die Integration zum selben Wert einen Sensor und eine
    // stellbare Entitaet, gewinnt die stellbare. Sonst waere der Wert
    // nur lesbar, obwohl er sich einstellen liesse.
    const bisher = result.entities[field];
    if (bisher && stellbar(bisher) && !stellbar(entityId)) return;
    result.entities[field] = entityId;
  };

  // Das Profil entscheidet, welcher Weg zuerst versucht wird. Findet er
  // nichts, wird der andere trotzdem probiert.
  const nurNamen = profil === "heishamon";
  const registry = nurNamen ? null : hass.entities;
  if (registry && typeof registry === "object") {
    const deviceIds = new Set();
    let hits = 0;
    Object.keys(registry).forEach((entityId) => {
      const entry = registry[entityId];
      if (!entry || entry.platform !== INTEGRATION_DOMAIN) return;
      hits++;
      if (entry.device_id) deviceIds.add(entry.device_id);
      const key =
        (entityId.match(COP_MUSTER) || [])[1] ||
        entry.translation_key ||
        (entityId.match(/_(top\d+)$/) || [])[1] ||
        (entityId.match(/heishamon_(set\w+)$/) || [])[1] ||
        null;
      if (key) assign(key, entityId);
    });
    if (hits > 0) {
      result.found = true;
      result.source = "register";
      result.count = hits;
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

/**
 * Herstellerprofile. Jedes Profil beschreibt, wie die Entitaeten einer
 * Integration heissen. Umgesetzt ist bisher HeishaMon, die uebrigen
 * sind vorgemerkt und werden ergaenzt, sobald die Namensschemata
 * geklaert sind.
 */
const PROFILE = [
  {
    id: "heishamon_lutarym",
    name: "Panasonic Aquarea, HeishaMon by Lutarym",
    fertig: true,
  },
  {
    id: "heishamon",
    name: "Panasonic Aquarea, HeishaMon über MQTT-Namensschema",
    fertig: true,
  },
  { id: "vaillant", name: "Vaillant, in Vorbereitung", fertig: false },
  { id: "bosch", name: "Bosch, in Vorbereitung", fertig: false },
  { id: "viessmann", name: "Viessmann, in Vorbereitung", fertig: false },
  { id: "stiebel", name: "Stiebel Eltron, in Vorbereitung", fertig: false },
];

/**
 * Erklaerungen zu allen Werten und Befehlen, die HeishaMon lesen und
 * schreiben kann, in Gruppen und vier Sprachen. Je Eintrag:
 * l = gelesenes Topic, s = Befehl zum Schreiben, b = Bereich,
 * n = Name, t = Erklaerung. Grundlage sind MQTT-Topics.md,
 * OptionalPCB.md und README.md von HeishaMon sowie die
 * Panasonic-Installationsanleitung der L-Generation.
 */
const HILFE = [{"id":"grundlagen","titel":{"de":"Grundlagen","en":"Basics","fr":"Notions de base","ja":"基本"},"e":[{"l":"","s":"","b":"","n":{"de":"Lesen und Schreiben","en":"Read and write","fr":"Lecture et écriture","ja":"読み取りと書き込み"},"t":{"de":"Jeder Eintrag zeigt, woher der Wert kommt. „Lesen“ (TOP…) ist ein Wert, den die Wärmepumpe meldet. „Schreiben“ (Set…) ist ein Befehl, mit dem HeishaMon etwas an der Wärmepumpe einstellt. Manche Werte kann man nur ansehen, andere auch ändern.","en":"Each entry shows where the value comes from. “Read” (TOP…) is a value reported by the heat pump. “Write” (Set…) is a command HeishaMon uses to change something on the heat pump. Some values can only be viewed, others can also be changed.","fr":"Chaque entrée indique l'origine de la valeur. « Lecture » (TOP…) est une valeur transmise par la pompe à chaleur. « Écriture » (Set…) est une commande avec laquelle HeishaMon modifie un réglage de la pompe. Certaines valeurs sont seulement consultables, d'autres modifiables.","ja":"各項目には値の出どころが表示されます。「読み取り」（TOP…）はヒートポンプが送ってくる値です。「書き込み」（Set…）は HeishaMon がヒートポンプの設定を変えるための命令です。見るだけの値と、変更もできる値があります。"}},{"l":"","s":"","b":"","n":{"de":"Vorlauf und Rücklauf","en":"Flow and return","fr":"Départ et retour","ja":"往き と 戻り"},"t":{"de":"Der Vorlauf ist das warme Wasser, das von der Wärmepumpe zu Heizkörpern, Fußbodenheizung oder Speicher fließt. Der Rücklauf ist das abgekühlte Wasser, das zurückkommt. Der Unterschied zwischen beiden zeigt, wie viel Wärme abgegeben wurde.","en":"The flow is the warm water going from the heat pump to radiators, underfloor heating or a tank. The return is the cooled water coming back. The difference between the two shows how much heat was delivered.","fr":"Le départ est l'eau chaude qui va de la pompe à chaleur vers les radiateurs, le plancher chauffant ou le ballon. Le retour est l'eau refroidie qui revient. L'écart entre les deux montre la quantité de chaleur cédée.","ja":"往き（フロー）はヒートポンプからラジエーター、床暖房、タンクへ流れる温水です。戻り（リターン）は冷えて戻ってくる水です。両者の差で、どれだけ熱を渡したかが分かります。"}},{"l":"","s":"","b":"","n":{"de":"Temperaturunterschied","en":"Temperature difference","fr":"Écart de température","ja":"温度差"},"t":{"de":"Manche Werte sind keine Temperatur, sondern der Unterschied zwischen zwei Temperaturen. 5 °C Unterschied heißt zum Beispiel: 40 °C und 35 °C. In Panasonic-Anleitungen und in Home Assistant steht dafür oft „K“ (Kelvin). 1 K ist genau 1 °C Unterschied.","en":"Some values are not a temperature but the difference between two temperatures. A difference of 5 °C means, for example, 40 °C and 35 °C. Panasonic manuals and Home Assistant often write “K” (kelvin) for this. 1 K is exactly 1 °C of difference.","fr":"Certaines valeurs ne sont pas une température mais l'écart entre deux températures. Un écart de 5 °C signifie par exemple 40 °C et 35 °C. Les notices Panasonic et Home Assistant indiquent souvent « K » (kelvin) pour cela. 1 K correspond exactement à 1 °C d'écart.","ja":"温度そのものではなく、2 つの温度の差を表す値があります。5 °C の差とは、たとえば 40 °C と 35 °C のことです。Panasonic の説明書や Home Assistant では「K」（ケルビン）と書かれることがよくあります。1 K はちょうど 1 °C の差です。"}},{"l":"","s":"","b":"","n":{"de":"Heizkurve","en":"Heating curve","fr":"Courbe de chauffe","ja":"暖房曲線"},"t":{"de":"Die Heizkurve legt fest, wie warm das Heizwasser abhängig von der Außentemperatur sein soll. Ist es draußen kalt, wird das Wasser wärmer gemacht, ist es mild, reicht kühleres Wasser. Man stellt sie über zwei Punkte ein: einen kalten und einen warmen Außenpunkt mit der jeweils gewünschten Wassertemperatur.","en":"The heating curve sets how warm the heating water should be depending on the outdoor temperature. When it is cold outside the water is made warmer, when it is mild cooler water is enough. It is set with two points: a cold and a warm outdoor point, each with the desired water temperature.","fr":"La courbe de chauffe définit la température de l'eau de chauffage selon la température extérieure. Quand il fait froid, l'eau est plus chaude ; quand il fait doux, une eau moins chaude suffit. Elle se règle par deux points : un point extérieur froid et un point extérieur doux, chacun avec la température d'eau souhaitée.","ja":"暖房曲線は、外気温に応じて暖房用の水を何度にするかを決めます。外が寒いと水を熱くし、穏やかならぬるい水で足ります。寒い側と暖かい側の 2 つの外気温の点と、それぞれの水温で設定します。"}}]},{"id":"betrieb","titel":{"de":"Betrieb und Betriebsart","en":"Operation and mode","fr":"Fonctionnement et mode","ja":"運転と運転モード"},"e":[{"l":"TOP0","s":"SetHeatpump","b":"0/1","n":{"de":"Wärmepumpe ein/aus","en":"Heat pump on/off","fr":"Pompe à chaleur marche/arrêt","ja":"ヒートポンプ 入/切"},"t":{"de":"Zeigt, ob die Wärmepumpe eingeschaltet ist, und schaltet sie ein oder aus. Das ist der Hauptschalter, wie die Ein/Aus-Taste an der Fernbedienung.","en":"Shows whether the heat pump is switched on, and switches it on or off. This is the main switch, like the on/off button on the remote control.","fr":"Indique si la pompe à chaleur est en marche et permet de l'allumer ou de l'éteindre. C'est l'interrupteur principal, comme la touche marche/arrêt de la télécommande.","ja":"ヒートポンプの電源が入っているかを示し、入切を切り替えます。リモコンの運転/停止ボタンにあたる主スイッチです。"}},{"l":"TOP4","s":"SetOperationMode","b":"0 … 6","n":{"de":"Betriebsart","en":"Operating mode","fr":"Mode de fonctionnement","ja":"運転モード"},"t":{"de":"Legt fest, was die Wärmepumpe tun soll: nur Heizen, nur Kühlen, Automatik, nur Warmwasser oder Heizen bzw. Kühlen zusammen mit Warmwasser. Bei Automatik wechselt sie je nach Außentemperatur selbst zwischen Heizen und Kühlen. Gemeldet werden zusätzlich 7 und 8, wenn die Automatik gerade kühlt.","en":"Sets what the heat pump should do: heat only, cool only, automatic, hot water only, or heating or cooling together with hot water. In automatic it switches between heating and cooling by itself depending on the outdoor temperature. Values 7 and 8 are also reported when automatic is currently cooling.","fr":"Définit ce que fait la pompe à chaleur : chauffage seul, rafraîchissement seul, automatique, eau chaude seule, ou chauffage ou rafraîchissement avec eau chaude. En automatique, elle passe d'elle-même du chauffage au rafraîchissement selon la température extérieure. Les valeurs 7 et 8 sont aussi transmises quand l'automatique rafraîchit.","ja":"ヒートポンプの動作を決めます：暖房のみ、冷房のみ、自動、給湯のみ、または暖房・冷房と給湯の組み合わせ。自動では外気温に応じて暖房と冷房を自動で切り替えます。自動で冷房中のときは 7 と 8 も報告されます。"}},{"l":"TOP94","s":"SetZones","b":"0 … 2","n":{"de":"Aktive Heizkreise (Zonen)","en":"Active heating circuits (zones)","fr":"Circuits actifs (zones)","ja":"有効な暖房回路（ゾーン）"},"t":{"de":"Eine Zone ist ein Heizkreis, zum Beispiel Erdgeschoss mit Fußbodenheizung und Obergeschoss mit Heizkörpern. Hier wird festgelegt, ob nur Zone 1, nur Zone 2 oder beide versorgt werden.","en":"A zone is a heating circuit, for example the ground floor with underfloor heating and the upper floor with radiators. This sets whether only zone 1, only zone 2 or both are supplied.","fr":"Une zone est un circuit de chauffage, par exemple le rez-de-chaussée en plancher chauffant et l'étage en radiateurs. On choisit ici si seule la zone 1, seule la zone 2 ou les deux sont alimentées.","ja":"ゾーンとは暖房回路のことで、たとえば 1 階は床暖房、2 階はラジエーターといった分け方です。ゾーン 1 だけ、ゾーン 2 だけ、または両方に供給するかを決めます。"}},{"l":"TOP17","s":"SetPowerfulMode","b":"0 … 3","n":{"de":"Turbo (Powerful)","en":"Powerful mode","fr":"Mode puissant","ja":"パワフル運転"},"t":{"de":"Lässt die Wärmepumpe für 30, 60 oder 90 Minuten mit mehr Leistung laufen, etwa um nach einer Absenkung schneller warm zu werden. Danach geht sie von selbst in den Normalbetrieb zurück. Mehr Leistung bedeutet meist auch mehr Stromverbrauch.","en":"Runs the heat pump with more power for 30, 60 or 90 minutes, for example to warm up faster after a setback. It then returns to normal operation by itself. More power usually also means more electricity use.","fr":"Fait fonctionner la pompe à chaleur plus fort pendant 30, 60 ou 90 minutes, par exemple pour réchauffer plus vite après un abaissement. Elle revient ensuite d'elle-même au fonctionnement normal. Plus de puissance signifie en général plus de consommation.","ja":"30・60・90 分間、出力を上げて運転します。たとえば温度を下げていた後に早く暖めたいときに使います。終わると自動で通常運転に戻ります。出力が上がるぶん、通常は電気も多く使います。"}},{"l":"TOP18","s":"SetQuietMode","b":"0 … 3","n":{"de":"Leisemodus","en":"Quiet mode","fr":"Mode silencieux","ja":"静音モード"},"t":{"de":"Begrenzt die Leistung, damit das Außengerät leiser läuft, zum Beispiel nachts. Stufe 1 ist etwas leiser, Stufe 3 am leisesten. Je leiser, desto weniger Heizleistung steht zur Verfügung.","en":"Limits the power so that the outdoor unit runs more quietly, for example at night. Level 1 is a little quieter, level 3 the quietest. The quieter, the less heating power is available.","fr":"Limite la puissance pour que l'unité extérieure soit plus silencieuse, par exemple la nuit. Le niveau 1 est un peu plus silencieux, le niveau 3 le plus silencieux. Plus c'est silencieux, moins la puissance de chauffe est grande.","ja":"出力を抑えて室外機の音を小さくします。夜間などに使います。レベル 1 は少し静か、レベル 3 が最も静かです。静かにするほど、使える暖房能力は小さくなります。"}},{"l":"TOP3","s":"","b":"0/1","n":{"de":"Leisemodus-Zeitplan","en":"Quiet mode schedule","fr":"Programmation du mode silencieux","ja":"静音モードのスケジュール"},"t":{"de":"Zeigt, ob gerade ein an der Fernbedienung eingestellter Zeitplan für den Leisemodus aktiv ist.","en":"Shows whether a quiet mode schedule set on the remote control is currently active.","fr":"Indique si une programmation du mode silencieux réglée sur la télécommande est active.","ja":"リモコンで設定した静音モードのスケジュールが現在有効かどうかを示します。"}},{"l":"TOP141","s":"SetQuietModePriority","b":"0/1","n":{"de":"Leisemodus: Vorrang","en":"Quiet mode: priority","fr":"Mode silencieux : priorité","ja":"静音モード：優先"},"t":{"de":"Legt fest, was im Leisemodus wichtiger ist. „Lautstärke“: Es bleibt leise, auch wenn es dann weniger warm wird. „Leistung“: Bei Bedarf darf die Wärmepumpe lauter werden, damit genug Wärme kommt.","en":"Sets what matters more in quiet mode. “Sound”: it stays quiet even if it gets less warm. “Capacity”: if needed, the heat pump may get louder so that enough heat is delivered.","fr":"Définit ce qui compte le plus en mode silencieux. « Son » : cela reste silencieux même s'il fait moins chaud. « Puissance » : si nécessaire, la pompe peut être plus bruyante pour fournir assez de chaleur.","ja":"静音モード中に何を優先するかを決めます。「静音」：暖まりにくくなっても静かさを保ちます。「能力」：必要なら音が大きくなっても十分な熱を出します。"}},{"l":"TOP13","s":"SetMainSchedule","b":"0/1","n":{"de":"Wochenprogramm","en":"Weekly schedule","fr":"Programme hebdomadaire","ja":"週間スケジュール"},"t":{"de":"Schaltet den Zeitplan der Fernbedienung ein oder aus. Mit dem Zeitplan kann die Wärmepumpe zu festen Zeiten andere Temperaturen nutzen oder ruhen.","en":"Switches the remote control's timetable on or off. With the timetable the heat pump can use other temperatures or rest at fixed times.","fr":"Active ou désactive la programmation de la télécommande. Avec elle, la pompe à chaleur peut utiliser d'autres températures ou s'arrêter à heures fixes.","ja":"リモコンのタイマー（週間スケジュール）を有効・無効にします。決まった時間に別の温度で運転したり、休止したりできます。"}},{"l":"TOP19","s":"SetHolidayMode","b":"0 … 2","n":{"de":"Urlaubsmodus","en":"Holiday mode","fr":"Mode vacances","ja":"休暇モード"},"t":{"de":"Für längere Abwesenheit: Laut Panasonic schaltet die Anlage dann ab oder senkt die Temperatur. Gemeldet wird, ob der Urlaub aus, nur geplant oder gerade aktiv ist.","en":"For longer absences: according to Panasonic the system then switches off or lowers the temperature. It reports whether holiday mode is off, only scheduled or currently active.","fr":"Pour les absences prolongées : selon Panasonic, l'installation s'arrête ou baisse la température. Elle indique si le mode vacances est arrêté, seulement programmé ou actif.","ja":"長期不在のための機能です。Panasonic によると、運転を止めるか温度を下げます。休暇モードがオフか、予約中か、作動中かが報告されます。"}},{"l":"TOP45","s":"","b":"−15 … 15 °C","n":{"de":"Urlaub: Absenkung Heizung","en":"Holiday: heating shift","fr":"Vacances : décalage chauffage","ja":"休暇：暖房の温度シフト"},"t":{"de":"Um wie viel die Heiztemperatur während des Urlaubs verschoben wird.","en":"By how much the heating temperature is shifted during the holiday.","fr":"De combien la température de chauffage est décalée pendant les vacances.","ja":"休暇中に暖房温度をどれだけずらすかを示します。"}},{"l":"TOP25","s":"","b":"−15 … 15 °C","n":{"de":"Urlaub: Absenkung Warmwasser","en":"Holiday: hot water shift","fr":"Vacances : décalage eau chaude","ja":"休暇：給湯の温度シフト"},"t":{"de":"Um wie viel die Warmwassertemperatur während des Urlaubs verschoben wird.","en":"By how much the hot water temperature is shifted during the holiday.","fr":"De combien la température de l'eau chaude est décalée pendant les vacances.","ja":"休暇中に給湯温度をどれだけずらすかを示します。"}},{"l":"TOP79","s":"","b":"°C","n":{"de":"Automatik: von Heizen auf Kühlen","en":"Auto: heating to cooling","fr":"Auto : du chauffage au rafraîchissement","ja":"自動：暖房から冷房へ"},"t":{"de":"In der Betriebsart Automatik: ab dieser Außentemperatur wechselt die Wärmepumpe vom Heizen ins Kühlen.","en":"In automatic mode: from this outdoor temperature the heat pump switches from heating to cooling.","fr":"En mode automatique : à partir de cette température extérieure, la pompe passe du chauffage au rafraîchissement.","ja":"自動運転で、この外気温から暖房をやめて冷房に切り替えます。"}},{"l":"TOP80","s":"","b":"°C","n":{"de":"Automatik: von Kühlen auf Heizen","en":"Auto: cooling to heating","fr":"Auto : du rafraîchissement au chauffage","ja":"自動：冷房から暖房へ"},"t":{"de":"In der Betriebsart Automatik: ab dieser Außentemperatur wechselt die Wärmepumpe vom Kühlen zurück ins Heizen.","en":"In automatic mode: from this outdoor temperature the heat pump switches from cooling back to heating.","fr":"En mode automatique : à partir de cette température extérieure, la pompe repasse du rafraîchissement au chauffage.","ja":"自動運転で、この外気温から冷房をやめて暖房に戻します。"}},{"l":"TOP139","s":"SetHeatingControl","b":"0/1","n":{"de":"Regelung: Komfort oder Effizienz","en":"Control: comfort or efficiency","fr":"Régulation : confort ou efficacité","ja":"制御：快適 または 効率"},"t":{"de":"Laut Panasonic legt diese Einstellung fest, ob die Wärmepumpe die gewünschte Temperatur schneller erreichen (Komfort, Werkseinstellung) oder Energie sparen soll (Effizienz). Genaueres beschreibt Panasonic nicht.","en":"According to Panasonic this setting decides whether the heat pump should reach the set temperature faster (comfort, factory default) or save energy (efficiency). Panasonic gives no further detail.","fr":"Selon Panasonic, ce réglage détermine si la pompe doit atteindre plus vite la température voulue (confort, réglage d'usine) ou économiser l'énergie (efficacité). Panasonic n'en dit pas plus.","ja":"Panasonic によると、設定温度に早く到達させる（快適、工場出荷時）か、省エネを優先する（効率）かを決めます。詳しい説明はありません。"}}]},{"id":"temperaturen","titel":{"de":"Temperaturen","en":"Temperatures","fr":"Températures","ja":"温度"},"e":[{"l":"TOP14","s":"","b":"°C","n":{"de":"Außentemperatur","en":"Outdoor temperature","fr":"Température extérieure","ja":"外気温"},"t":{"de":"Die Temperatur draußen, gemessen am Außengerät. Danach richtet sich unter anderem die Heizkurve.","en":"The temperature outside, measured at the outdoor unit. Among other things, the heating curve depends on it.","fr":"La température dehors, mesurée sur l'unité extérieure. La courbe de chauffe en dépend notamment.","ja":"室外機で測った屋外の温度です。暖房曲線などはこの値をもとに動きます。"}},{"l":"TOP6","s":"","b":"°C","n":{"de":"Vorlauftemperatur","en":"Flow temperature","fr":"Température de départ","ja":"往き温度"},"t":{"de":"So warm ist das Wasser, das die Wärmepumpe gerade in die Heizung oder den Speicher schickt.","en":"How warm the water is that the heat pump is currently sending to the heating or the tank.","fr":"La température de l'eau que la pompe à chaleur envoie actuellement vers le chauffage ou le ballon.","ja":"ヒートポンプが今、暖房やタンクへ送り出している水の温度です。"}},{"l":"TOP5","s":"","b":"°C","n":{"de":"Rücklauftemperatur","en":"Return temperature","fr":"Température de retour","ja":"戻り温度"},"t":{"de":"So warm ist das Wasser, das aus der Heizung zur Wärmepumpe zurückkommt.","en":"How warm the water is that comes back from the heating to the heat pump.","fr":"La température de l'eau qui revient du chauffage vers la pompe à chaleur.","ja":"暖房からヒートポンプへ戻ってくる水の温度です。"}},{"l":"TOP7","s":"","b":"°C","n":{"de":"Soll-Vorlauftemperatur","en":"Target flow temperature","fr":"Température de départ visée","ja":"目標往き温度"},"t":{"de":"Die Wassertemperatur, die die Wärmepumpe gerade anstrebt. Sie ergibt sich aus Heizkurve, Einstellungen und der gerade laufenden Aufgabe, beim Warmwasserladen also aus dem Speicherziel.","en":"The water temperature the heat pump is currently aiming for. It results from the heating curve, the settings and the current task, so while heating hot water from the tank target.","fr":"La température d'eau que la pompe vise actuellement. Elle découle de la courbe de chauffe, des réglages et de la tâche en cours, donc de la consigne du ballon pendant la production d'eau chaude.","ja":"ヒートポンプが今目指している水温です。暖房曲線、設定、いま行っている作業から決まり、給湯中はタンクの目標で決まります。"}},{"l":"TOP49","s":"","b":"°C","n":{"de":"Wasser nach dem Wärmetauscher","en":"Water after heat exchanger","fr":"Eau après l'échangeur","ja":"熱交換器後の水温"},"t":{"de":"Laut HeishaMon die Wassertemperatur direkt nach dem Wärmetauscher („Austritt 2“). Der Wärmetauscher ist das Bauteil, in dem die Wärme aus dem Kältemittel ins Heizwasser übergeht.","en":"According to HeishaMon the water temperature right after the heat exchanger (“outlet 2”). The heat exchanger is the part where heat passes from the refrigerant into the heating water.","fr":"Selon HeishaMon, la température de l'eau juste après l'échangeur (« sortie 2 »). L'échangeur est la pièce où la chaleur passe du fluide frigorigène à l'eau de chauffage.","ja":"HeishaMon によると、熱交換器を出た直後の水温（「出口 2」）です。熱交換器は、冷媒の熱を暖房の水へ渡す部品です。"}},{"l":"TOP116","s":"","b":"°C","n":{"de":"Zweiter Rücklauffühler","en":"Second return sensor","fr":"Deuxième sonde de retour","ja":"第 2 戻りセンサー"},"t":{"de":"Ein weiterer Temperaturfühler am Wassereingang. Laut HeishaMon nur bei der K- und L-Serie.","en":"Another temperature sensor at the water inlet. According to HeishaMon only on the K and L series.","fr":"Une autre sonde de température à l'entrée d'eau. Selon HeishaMon, uniquement sur les séries K et L.","ja":"水の入口にあるもう 1 つの温度センサーです。HeishaMon によると K・L シリーズのみです。"}},{"l":"TOP56","s":"","b":"°C","n":{"de":"Zone 1: Isttemperatur","en":"Zone 1: actual temperature","fr":"Zone 1 : température réelle","ja":"ゾーン 1：実温度"},"t":{"de":"Die gemessene Temperatur von Zone 1. Je nach Einstellung des Zonenfühlers ist das die Wasser- oder die Raumtemperatur.","en":"The measured temperature of zone 1. Depending on the zone sensor setting this is the water or the room temperature.","fr":"La température mesurée de la zone 1. Selon le réglage de la sonde de zone, c'est la température de l'eau ou de la pièce.","ja":"ゾーン 1 の測定温度です。ゾーンセンサーの設定によって水温か室温になります。"}},{"l":"TOP57","s":"","b":"°C","n":{"de":"Zone 2: Isttemperatur","en":"Zone 2: actual temperature","fr":"Zone 2 : température réelle","ja":"ゾーン 2：実温度"},"t":{"de":"Die gemessene Temperatur von Zone 2. Je nach Einstellung des Zonenfühlers ist das die Wasser- oder die Raumtemperatur.","en":"The measured temperature of zone 2. Depending on the zone sensor setting this is the water or the room temperature.","fr":"La température mesurée de la zone 2. Selon le réglage de la sonde de zone, c'est la température de l'eau ou de la pièce.","ja":"ゾーン 2 の測定温度です。ゾーンセンサーの設定によって水温か室温になります。"}},{"l":"TOP33","s":"","b":"°C","n":{"de":"Raumtemperatur Fernbedienung","en":"Remote control room temperature","fr":"Température de la télécommande","ja":"リモコンの室温"},"t":{"de":"Die Raumtemperatur, die der Fühler in der Fernbedienung misst.","en":"The room temperature measured by the sensor in the remote control.","fr":"La température ambiante mesurée par la sonde de la télécommande.","ja":"リモコンに内蔵されたセンサーで測った室温です。"}},{"l":"TOP118","s":"","b":"°C","n":{"de":"Raumtemperatur zweite Fernbedienung","en":"Second remote control temperature","fr":"Température de la 2e télécommande","ja":"2 台目リモコンの室温"},"t":{"de":"Die Raumtemperatur, die eine zweite Fernbedienung misst, falls vorhanden.","en":"The room temperature measured by a second remote control, if present.","fr":"La température ambiante mesurée par une deuxième télécommande, si présente.","ja":"2 台目のリモコンがある場合、そのリモコンで測った室温です。"}}]},{"id":"heizen","titel":{"de":"Heizen und Heizkurve","en":"Heating and heating curve","fr":"Chauffage et courbe de chauffe","ja":"暖房と暖房曲線"},"e":[{"l":"TOP76","s":"","b":"0/1","n":{"de":"Heizungsregelung Art","en":"Heating control type","fr":"Type de régulation du chauffage","ja":"暖房制御方式"},"t":{"de":"0 = nach Heizkurve: Die Wassertemperatur folgt automatisch der Außentemperatur. 1 = direkt: Es gilt eine fest eingestellte Wassertemperatur, egal wie kalt es draußen ist.","en":"0 = by heating curve: the water temperature automatically follows the outdoor temperature. 1 = direct: a fixed water temperature applies, no matter how cold it is outside.","fr":"0 = selon la courbe : la température de l'eau suit automatiquement la température extérieure. 1 = direct : une température d'eau fixe s'applique, quel que soit le froid dehors.","ja":"0 = 暖房曲線：水温が外気温に合わせて自動で変わります。1 = 直接設定：外の寒さに関係なく、決めた水温で運転します。"}},{"l":"TOP27","s":"SetZ1HeatRequestTemperature","b":"−5 … 5 °C / 20 … °C","n":{"de":"Zone 1: Wunschtemperatur Heizen","en":"Zone 1: requested heating temperature","fr":"Zone 1 : consigne de chauffage","ja":"ゾーン 1：暖房の希望温度"},"t":{"de":"Hat zwei Bedeutungen. Wird nach Heizkurve geheizt, ist es eine Verschiebung der ganzen Kurve von −5 bis +5 °C: +2 macht das Wasser überall 2 °C wärmer. Im Direktbetrieb ist es die gewünschte Wassertemperatur selbst, ab 20 °C. Welcher Fall gilt, zeigt „Heizungsregelung Art“ (TOP76).","en":"Has two meanings. When heating by the heating curve, it shifts the whole curve from −5 to +5 °C: +2 makes the water 2 °C warmer everywhere. In direct mode it is the desired water temperature itself, from 20 °C. Which case applies is shown by “heating control type” (TOP76).","fr":"A deux significations. En chauffage selon la courbe, c'est un décalage de toute la courbe de −5 à +5 °C : +2 rend l'eau 2 °C plus chaude partout. En mode direct, c'est la température d'eau souhaitée elle-même, à partir de 20 °C. Le cas en vigueur est indiqué par « type de régulation » (TOP76).","ja":"2 つの意味があります。暖房曲線で運転中は、曲線全体を −5〜+5 °C ずらす値です（+2 なら水温が全体で 2 °C 上がる）。直接設定モードでは、希望する水温そのもの（20 °C 以上）です。どちらかは「暖房制御方式」（TOP76）で分かります。"}},{"l":"TOP34","s":"SetZ2HeatRequestTemperature","b":"−5 … 5 °C / 20 … °C","n":{"de":"Zone 2: Wunschtemperatur Heizen","en":"Zone 2: requested heating temperature","fr":"Zone 2 : consigne de chauffage","ja":"ゾーン 2：暖房の希望温度"},"t":{"de":"Hat zwei Bedeutungen. Wird nach Heizkurve geheizt, ist es eine Verschiebung der ganzen Kurve von −5 bis +5 °C: +2 macht das Wasser überall 2 °C wärmer. Im Direktbetrieb ist es die gewünschte Wassertemperatur selbst, ab 20 °C. Welcher Fall gilt, zeigt „Heizungsregelung Art“ (TOP76).","en":"Has two meanings. When heating by the heating curve, it shifts the whole curve from −5 to +5 °C: +2 makes the water 2 °C warmer everywhere. In direct mode it is the desired water temperature itself, from 20 °C. Which case applies is shown by “heating control type” (TOP76).","fr":"A deux significations. En chauffage selon la courbe, c'est un décalage de toute la courbe de −5 à +5 °C : +2 rend l'eau 2 °C plus chaude partout. En mode direct, c'est la température d'eau souhaitée elle-même, à partir de 20 °C. Le cas en vigueur est indiqué par « type de régulation » (TOP76).","ja":"2 つの意味があります。暖房曲線で運転中は、曲線全体を −5〜+5 °C ずらす値です（+2 なら水温が全体で 2 °C 上がる）。直接設定モードでは、希望する水温そのもの（20 °C 以上）です。どちらかは「暖房制御方式」（TOP76）で分かります。"}},{"l":"TOP42","s":"","b":"°C","n":{"de":"Zone 1: Soll-Wassertemperatur","en":"Zone 1: target water temperature","fr":"Zone 1 : température d'eau visée","ja":"ゾーン 1：目標水温"},"t":{"de":"Die Wassertemperatur, die Zone 1 gerade bekommen soll. Sie ergibt sich aus Heizkurve und Verschiebung oder aus dem Direktwert.","en":"The water temperature zone 1 should currently get. It results from the heating curve and shift or from the direct value.","fr":"La température d'eau que la zone 1 doit recevoir actuellement. Elle découle de la courbe et du décalage ou de la valeur directe.","ja":"ゾーン 1 に今送るべき水温です。暖房曲線とシフト、または直接設定の値から決まります。"}},{"l":"TOP43","s":"","b":"°C","n":{"de":"Zone 2: Soll-Wassertemperatur","en":"Zone 2: target water temperature","fr":"Zone 2 : température d'eau visée","ja":"ゾーン 2：目標水温"},"t":{"de":"Die Wassertemperatur, die Zone 2 gerade bekommen soll.","en":"The water temperature zone 2 should currently get.","fr":"La température d'eau que la zone 2 doit recevoir actuellement.","ja":"ゾーン 2 に今送るべき水温です。"}},{"l":"TOP36","s":"","b":"°C","n":{"de":"Zone 1: Wassertemperatur","en":"Zone 1: water temperature","fr":"Zone 1 : température de l'eau","ja":"ゾーン 1：水温"},"t":{"de":"Die gemessene Temperatur des Wassers, das in Zone 1 fließt.","en":"The measured temperature of the water flowing into zone 1.","fr":"La température mesurée de l'eau qui circule dans la zone 1.","ja":"ゾーン 1 へ流れている水の測定温度です。"}},{"l":"TOP37","s":"","b":"°C","n":{"de":"Zone 2: Wassertemperatur","en":"Zone 2: water temperature","fr":"Zone 2 : température de l'eau","ja":"ゾーン 2：水温"},"t":{"de":"Die gemessene Temperatur des Wassers, das in Zone 2 fließt.","en":"The measured temperature of the water flowing into zone 2.","fr":"La température mesurée de l'eau qui circule dans la zone 2.","ja":"ゾーン 2 へ流れている水の測定温度です。"}},{"l":"TOP29","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Heizkurve, Wasser bei Kälte","en":"Zone 1: heating curve, water when cold","fr":"Zone 1 : courbe, eau par temps froid","ja":"ゾーン 1：暖房曲線 寒いときの水温"},"t":{"de":"Die Wassertemperatur, die Zone 1 am kalten Ende der Heizkurve bekommt, also bei der tiefsten eingestellten Außentemperatur. Höher eingestellt wird es bei Kälte wärmer, kostet aber mehr Strom.","en":"The water temperature zone 1 gets at the cold end of the heating curve, that is at the lowest set outdoor temperature. A higher value makes it warmer in cold weather but uses more electricity.","fr":"La température d'eau que la zone 1 reçoit à l'extrémité froide de la courbe, donc à la température extérieure réglée la plus basse. Plus elle est haute, plus il fait chaud par grand froid, mais la consommation augmente.","ja":"ゾーン 1 の暖房曲線の寒い側、つまり設定した最も低い外気温のときの水温です。高くすると寒い日に暖かくなりますが、電気を多く使います。"}},{"l":"TOP30","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Heizkurve, Wasser bei mildem Wetter","en":"Zone 1: heating curve, water when mild","fr":"Zone 1 : courbe, eau par temps doux","ja":"ゾーン 1：暖房曲線 穏やかなときの水温"},"t":{"de":"Die Wassertemperatur, die Zone 1 am warmen Ende der Heizkurve bekommt, also bei der höchsten eingestellten Außentemperatur.","en":"The water temperature zone 1 gets at the warm end of the heating curve, that is at the highest set outdoor temperature.","fr":"La température d'eau que la zone 1 reçoit à l'extrémité douce de la courbe, donc à la température extérieure réglée la plus haute.","ja":"ゾーン 1 の暖房曲線の暖かい側、つまり設定した最も高い外気温のときの水温です。"}},{"l":"TOP32","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Heizkurve, kalter Außenpunkt","en":"Zone 1: heating curve, cold outdoor point","fr":"Zone 1 : courbe, point extérieur froid","ja":"ゾーン 1：暖房曲線 寒い側の外気温"},"t":{"de":"Die Außentemperatur, bei der die Heizkurve ihre höchste Wassertemperatur erreicht. Ist es noch kälter, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Außenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: „high“ ist der warme Außenpunkt.","en":"The outdoor temperature at which the heating curve reaches its highest water temperature. If it gets even colder, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: “high” is the warm outdoor point.","fr":"La température extérieure à laquelle la courbe atteint sa température d'eau la plus haute. S'il fait encore plus froid, l'eau reste à cette valeur. Remarque : la documentation HeishaMon décrit à un endroit les points extérieurs de la courbe à l'inverse. La carte et l'intégration suivent le firmware et l'exemple SetCurves de la documentation : « high » est le point extérieur doux.","ja":"暖房曲線が最も高い水温になる外気温です。それより寒くても水温はこの値のままです。 注意：HeishaMon の説明書には、暖房曲線の外気温の点を逆に書いている箇所があります。カードと統合はファームウェアと説明書の SetCurves の例に従い、「high」を暖かい側の外気温としています。"}},{"l":"TOP31","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Heizkurve, warmer Außenpunkt","en":"Zone 1: heating curve, warm outdoor point","fr":"Zone 1 : courbe, point extérieur doux","ja":"ゾーン 1：暖房曲線 暖かい側の外気温"},"t":{"de":"Die Außentemperatur, bei der die Heizkurve ihre niedrigste Wassertemperatur erreicht. Ist es noch wärmer, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Außenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: „high“ ist der warme Außenpunkt.","en":"The outdoor temperature at which the heating curve reaches its lowest water temperature. If it gets even warmer, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: “high” is the warm outdoor point.","fr":"La température extérieure à laquelle la courbe atteint sa température d'eau la plus basse. S'il fait encore plus doux, l'eau reste à cette valeur. Remarque : la documentation HeishaMon décrit à un endroit les points extérieurs de la courbe à l'inverse. La carte et l'intégration suivent le firmware et l'exemple SetCurves de la documentation : « high » est le point extérieur doux.","ja":"暖房曲線が最も低い水温になる外気温です。それより暖かくても水温はこの値のままです。 注意：HeishaMon の説明書には、暖房曲線の外気温の点を逆に書いている箇所があります。カードと統合はファームウェアと説明書の SetCurves の例に従い、「high」を暖かい側の外気温としています。"}},{"l":"TOP82","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Heizkurve, Wasser bei Kälte","en":"Zone 2: heating curve, water when cold","fr":"Zone 2 : courbe, eau par temps froid","ja":"ゾーン 2：暖房曲線 寒いときの水温"},"t":{"de":"Die Wassertemperatur, die Zone 2 am kalten Ende der Heizkurve bekommt, also bei der tiefsten eingestellten Außentemperatur. Höher eingestellt wird es bei Kälte wärmer, kostet aber mehr Strom.","en":"The water temperature zone 2 gets at the cold end of the heating curve, that is at the lowest set outdoor temperature. A higher value makes it warmer in cold weather but uses more electricity.","fr":"La température d'eau que la zone 2 reçoit à l'extrémité froide de la courbe, donc à la température extérieure réglée la plus basse. Plus elle est haute, plus il fait chaud par grand froid, mais la consommation augmente.","ja":"ゾーン 2 の暖房曲線の寒い側、つまり設定した最も低い外気温のときの水温です。高くすると寒い日に暖かくなりますが、電気を多く使います。"}},{"l":"TOP83","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Heizkurve, Wasser bei mildem Wetter","en":"Zone 2: heating curve, water when mild","fr":"Zone 2 : courbe, eau par temps doux","ja":"ゾーン 2：暖房曲線 穏やかなときの水温"},"t":{"de":"Die Wassertemperatur, die Zone 2 am warmen Ende der Heizkurve bekommt, also bei der höchsten eingestellten Außentemperatur.","en":"The water temperature zone 2 gets at the warm end of the heating curve, that is at the highest set outdoor temperature.","fr":"La température d'eau que la zone 2 reçoit à l'extrémité douce de la courbe, donc à la température extérieure réglée la plus haute.","ja":"ゾーン 2 の暖房曲線の暖かい側、つまり設定した最も高い外気温のときの水温です。"}},{"l":"TOP85","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Heizkurve, kalter Außenpunkt","en":"Zone 2: heating curve, cold outdoor point","fr":"Zone 2 : courbe, point extérieur froid","ja":"ゾーン 2：暖房曲線 寒い側の外気温"},"t":{"de":"Die Außentemperatur, bei der die Heizkurve ihre höchste Wassertemperatur erreicht. Ist es noch kälter, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Außenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: „high“ ist der warme Außenpunkt.","en":"The outdoor temperature at which the heating curve reaches its highest water temperature. If it gets even colder, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: “high” is the warm outdoor point.","fr":"La température extérieure à laquelle la courbe atteint sa température d'eau la plus haute. S'il fait encore plus froid, l'eau reste à cette valeur. Remarque : la documentation HeishaMon décrit à un endroit les points extérieurs de la courbe à l'inverse. La carte et l'intégration suivent le firmware et l'exemple SetCurves de la documentation : « high » est le point extérieur doux.","ja":"暖房曲線が最も高い水温になる外気温です。それより寒くても水温はこの値のままです。 注意：HeishaMon の説明書には、暖房曲線の外気温の点を逆に書いている箇所があります。カードと統合はファームウェアと説明書の SetCurves の例に従い、「high」を暖かい側の外気温としています。"}},{"l":"TOP84","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Heizkurve, warmer Außenpunkt","en":"Zone 2: heating curve, warm outdoor point","fr":"Zone 2 : courbe, point extérieur doux","ja":"ゾーン 2：暖房曲線 暖かい側の外気温"},"t":{"de":"Die Außentemperatur, bei der die Heizkurve ihre niedrigste Wassertemperatur erreicht. Ist es noch wärmer, bleibt das Wasser auf diesem Wert. Hinweis: Die HeishaMon-Doku beschreibt die Außenpunkte der Heizkurve an einer Stelle umgekehrt. Card und Integration folgen der Firmware und dem SetCurves-Beispiel der Doku: „high“ ist der warme Außenpunkt.","en":"The outdoor temperature at which the heating curve reaches its lowest water temperature. If it gets even warmer, the water stays at that value. Note: the HeishaMon documentation describes the outdoor points of the heating curve the other way round in one place. The card and the integration follow the firmware and the SetCurves example in the documentation: “high” is the warm outdoor point.","fr":"La température extérieure à laquelle la courbe atteint sa température d'eau la plus basse. S'il fait encore plus doux, l'eau reste à cette valeur. Remarque : la documentation HeishaMon décrit à un endroit les points extérieurs de la courbe à l'inverse. La carte et l'intégration suivent le firmware et l'exemple SetCurves de la documentation : « high » est le point extérieur doux.","ja":"暖房曲線が最も低い水温になる外気温です。それより暖かくても水温はこの値のままです。 注意：HeishaMon の説明書には、暖房曲線の外気温の点を逆に書いている箇所があります。カードと統合はファームウェアと説明書の SetCurves の例に従い、「high」を暖かい側の外気温としています。"}},{"l":"TOP23","s":"SetFloorHeatDelta","b":"1 … 15 °C","n":{"de":"Spreizung Heizen","en":"Heating spread","fr":"Écart de chauffage","ja":"暖房温度差"},"t":{"de":"Der Temperaturunterschied zwischen Vorlauf und Rücklauf, den die Wärmepumpe beim Heizen anstrebt. Panasonic nennt ihn „ΔT für Heizen“, Werkseinstellung 5 °C. Laut Panasonic gilt er nicht, wenn die Pumpe auf „maximale Leistung“ eingestellt ist.","en":"The temperature difference between flow and return that the heat pump aims for when heating. Panasonic calls it “ΔT for heating”, factory setting 5 °C. According to Panasonic it does not apply when the pump is set to “max. duty”.","fr":"L'écart de température entre départ et retour que la pompe vise en chauffage. Panasonic l'appelle « ΔT chauffage », réglage d'usine 5 °C. Selon Panasonic, il ne s'applique pas si la pompe est réglée sur « puissance max. ».","ja":"暖房時にヒートポンプが目指す往きと戻りの温度差です。Panasonic では「暖房 ΔT」と呼び、工場出荷時は 5 °C です。Panasonic によると、ポンプを「最大出力」に設定しているときは使われません。"}},{"l":"TOP77","s":"SetHeatingOffOutdoorTemp","b":"5 … 35 °C","n":{"de":"Heizen aus ab Außentemperatur","en":"Heating off above outdoor temp.","fr":"Arrêt du chauffage au-dessus de","ja":"暖房停止外気温"},"t":{"de":"Ist es draußen wärmer als dieser Wert, heizt die Wärmepumpe nicht mehr (Sommerabschaltung). Warmwasser wird weiter bereitet. Panasonic-Werkseinstellung: 24 °C.","en":"If it is warmer outside than this value, the heat pump stops heating (summer cut-off). Hot water is still produced. Panasonic factory setting: 24 °C.","fr":"S'il fait plus chaud dehors que cette valeur, la pompe ne chauffe plus (coupure d'été). L'eau chaude continue d'être produite. Réglage d'usine Panasonic : 24 °C.","ja":"外気温がこの値より高いと暖房を止めます（夏季停止）。給湯は続けます。Panasonic の工場出荷時は 24 °C です。"}},{"l":"TOP111","s":"","b":"0 … 3","n":{"de":"Zone 1: Art des Fühlers","en":"Zone 1: sensor type","fr":"Zone 1 : type de sonde","ja":"ゾーン 1：センサーの種類"},"t":{"de":"Womit Zone 1 geregelt wird: 0 = Wassertemperatur, 1 = externer Raumthermostat, 2 = Raumfühler der Fernbedienung, 3 = separater Raumfühler (Thermistor).","en":"What zone 1 is controlled by: 0 = water temperature, 1 = external room thermostat, 2 = remote control room sensor, 3 = separate room sensor (thermistor).","fr":"Ce qui régule la zone 1 : 0 = température de l'eau, 1 = thermostat d'ambiance externe, 2 = sonde de la télécommande, 3 = sonde d'ambiance séparée (thermistance).","ja":"ゾーン 1 を何で制御するか：0 = 水温、1 = 外部ルームサーモスタット、2 = リモコンの室温センサー、3 = 別置きの室温センサー（サーミスタ）。"}},{"l":"TOP112","s":"","b":"0 … 3","n":{"de":"Zone 2: Art des Fühlers","en":"Zone 2: sensor type","fr":"Zone 2 : type de sonde","ja":"ゾーン 2：センサーの種類"},"t":{"de":"Wie bei Zone 1: 0 = Wassertemperatur, 1 = externer Raumthermostat, 2 = Raumfühler der Fernbedienung, 3 = separater Raumfühler.","en":"As for zone 1: 0 = water temperature, 1 = external room thermostat, 2 = remote control room sensor, 3 = separate room sensor.","fr":"Comme pour la zone 1 : 0 = température de l'eau, 1 = thermostat externe, 2 = sonde de la télécommande, 3 = sonde d'ambiance séparée.","ja":"ゾーン 1 と同じく、0 = 水温、1 = 外部ルームサーモスタット、2 = リモコンの室温センサー、3 = 別置きの室温センサー。"}}]},{"id":"kuehlen","titel":{"de":"Kühlen","en":"Cooling","fr":"Rafraîchissement","ja":"冷房"},"e":[{"l":"TOP81","s":"","b":"0/1","n":{"de":"Kühlregelung Art","en":"Cooling control type","fr":"Type de régulation du froid","ja":"冷房制御方式"},"t":{"de":"0 = nach Kühlkurve, abhängig von der Außentemperatur. 1 = direkt mit fester Wassertemperatur.","en":"0 = by cooling curve, depending on the outdoor temperature. 1 = direct with a fixed water temperature.","fr":"0 = selon la courbe, en fonction de la température extérieure. 1 = direct avec une température d'eau fixe.","ja":"0 = 冷房曲線（外気温に応じる）。1 = 直接設定（固定の水温）。"}},{"l":"TOP28","s":"SetZ1CoolRequestTemperature","b":"−5 … 5 °C / 5 … 20 °C","n":{"de":"Zone 1: Wunschtemperatur Kühlen","en":"Zone 1: requested cooling temperature","fr":"Zone 1 : consigne de rafraîchissement","ja":"ゾーン 1：冷房の希望温度"},"t":{"de":"Wie beim Heizen mit zwei Bedeutungen: Bei Kühlkurve eine Verschiebung von −5 bis +5 °C, im Direktbetrieb die gewünschte Wassertemperatur von 5 bis 20 °C. Welcher Fall gilt, zeigt TOP81.","en":"As with heating it has two meanings: with a cooling curve a shift of −5 to +5 °C, in direct mode the desired water temperature from 5 to 20 °C. Which case applies is shown by TOP81.","fr":"Comme pour le chauffage, deux significations : avec courbe, un décalage de −5 à +5 °C ; en mode direct, la température d'eau souhaitée de 5 à 20 °C. Le cas en vigueur est indiqué par TOP81.","ja":"暖房と同じく 2 つの意味があります。冷房曲線では −5〜+5 °C のシフト、直接設定では 5〜20 °C の希望水温です。どちらかは TOP81 で分かります。"}},{"l":"TOP35","s":"SetZ2CoolRequestTemperature","b":"−5 … 5 °C / 5 … 20 °C","n":{"de":"Zone 2: Wunschtemperatur Kühlen","en":"Zone 2: requested cooling temperature","fr":"Zone 2 : consigne de rafraîchissement","ja":"ゾーン 2：冷房の希望温度"},"t":{"de":"Wie beim Heizen mit zwei Bedeutungen: Bei Kühlkurve eine Verschiebung von −5 bis +5 °C, im Direktbetrieb die gewünschte Wassertemperatur von 5 bis 20 °C. Welcher Fall gilt, zeigt TOP81.","en":"As with heating it has two meanings: with a cooling curve a shift of −5 to +5 °C, in direct mode the desired water temperature from 5 to 20 °C. Which case applies is shown by TOP81.","fr":"Comme pour le chauffage, deux significations : avec courbe, un décalage de −5 à +5 °C ; en mode direct, la température d'eau souhaitée de 5 à 20 °C. Le cas en vigueur est indiqué par TOP81.","ja":"暖房と同じく 2 つの意味があります。冷房曲線では −5〜+5 °C のシフト、直接設定では 5〜20 °C の希望水温です。どちらかは TOP81 で分かります。"}},{"l":"TOP72","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Kühlkurve, Wasser am oberen Punkt","en":"Zone 1: cooling curve, water at upper point","fr":"Zone 1 : courbe de froid, eau au point haut","ja":"ゾーン 1：冷房曲線 上側の水温"},"t":{"de":"Laut HeishaMon die Wassertemperatur am höchsten Punkt der Kühlkurve.","en":"According to HeishaMon the water temperature at the highest point of the cooling curve.","fr":"Selon HeishaMon, la température d'eau au point le plus haut de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も高い点の水温です。"}},{"l":"TOP73","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Kühlkurve, Wasser am unteren Punkt","en":"Zone 1: cooling curve, water at lower point","fr":"Zone 1 : courbe de froid, eau au point bas","ja":"ゾーン 1：冷房曲線 下側の水温"},"t":{"de":"Laut HeishaMon die Wassertemperatur am tiefsten Punkt der Kühlkurve.","en":"According to HeishaMon the water temperature at the lowest point of the cooling curve.","fr":"Selon HeishaMon, la température d'eau au point le plus bas de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も低い点の水温です。"}},{"l":"TOP74","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Kühlkurve, höchste Außentemperatur","en":"Zone 1: cooling curve, highest outdoor temp.","fr":"Zone 1 : courbe de froid, extérieur le plus chaud","ja":"ゾーン 1：冷房曲線 最高外気温"},"t":{"de":"Laut HeishaMon die höchste Außentemperatur der Kühlkurve.","en":"According to HeishaMon the highest outdoor temperature of the cooling curve.","fr":"Selon HeishaMon, la température extérieure la plus haute de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も高い外気温です。"}},{"l":"TOP75","s":"SetCurves","b":"°C","n":{"de":"Zone 1: Kühlkurve, tiefste Außentemperatur","en":"Zone 1: cooling curve, lowest outdoor temp.","fr":"Zone 1 : courbe de froid, extérieur le plus frais","ja":"ゾーン 1：冷房曲線 最低外気温"},"t":{"de":"Laut HeishaMon die tiefste Außentemperatur der Kühlkurve.","en":"According to HeishaMon the lowest outdoor temperature of the cooling curve.","fr":"Selon HeishaMon, la température extérieure la plus basse de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も低い外気温です。"}},{"l":"TOP86","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Kühlkurve, Wasser am oberen Punkt","en":"Zone 2: cooling curve, water at upper point","fr":"Zone 2 : courbe de froid, eau au point haut","ja":"ゾーン 2：冷房曲線 上側の水温"},"t":{"de":"Laut HeishaMon die Wassertemperatur am höchsten Punkt der Kühlkurve.","en":"According to HeishaMon the water temperature at the highest point of the cooling curve.","fr":"Selon HeishaMon, la température d'eau au point le plus haut de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も高い点の水温です。"}},{"l":"TOP87","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Kühlkurve, Wasser am unteren Punkt","en":"Zone 2: cooling curve, water at lower point","fr":"Zone 2 : courbe de froid, eau au point bas","ja":"ゾーン 2：冷房曲線 下側の水温"},"t":{"de":"Laut HeishaMon die Wassertemperatur am tiefsten Punkt der Kühlkurve.","en":"According to HeishaMon the water temperature at the lowest point of the cooling curve.","fr":"Selon HeishaMon, la température d'eau au point le plus bas de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も低い点の水温です。"}},{"l":"TOP88","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Kühlkurve, höchste Außentemperatur","en":"Zone 2: cooling curve, highest outdoor temp.","fr":"Zone 2 : courbe de froid, extérieur le plus chaud","ja":"ゾーン 2：冷房曲線 最高外気温"},"t":{"de":"Laut HeishaMon die höchste Außentemperatur der Kühlkurve.","en":"According to HeishaMon the highest outdoor temperature of the cooling curve.","fr":"Selon HeishaMon, la température extérieure la plus haute de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も高い外気温です。"}},{"l":"TOP89","s":"SetCurves","b":"°C","n":{"de":"Zone 2: Kühlkurve, tiefste Außentemperatur","en":"Zone 2: cooling curve, lowest outdoor temp.","fr":"Zone 2 : courbe de froid, extérieur le plus frais","ja":"ゾーン 2：冷房曲線 最低外気温"},"t":{"de":"Laut HeishaMon die tiefste Außentemperatur der Kühlkurve.","en":"According to HeishaMon the lowest outdoor temperature of the cooling curve.","fr":"Selon HeishaMon, la température extérieure la plus basse de la courbe de rafraîchissement.","ja":"HeishaMon によると、冷房曲線の最も低い外気温です。"}},{"l":"TOP24","s":"SetFloorCoolDelta","b":"1 … 15 °C","n":{"de":"Spreizung Kühlen","en":"Cooling spread","fr":"Écart de rafraîchissement","ja":"冷房温度差"},"t":{"de":"Der Temperaturunterschied zwischen Vorlauf und Rücklauf, den die Wärmepumpe beim Kühlen anstrebt.","en":"The temperature difference between flow and return that the heat pump aims for when cooling.","fr":"L'écart de température entre départ et retour visé en rafraîchissement.","ja":"冷房時にヒートポンプが目指す往きと戻りの温度差です。"}}]},{"id":"warmwasser","titel":{"de":"Warmwasser","en":"Hot water","fr":"Eau chaude","ja":"給湯"},"e":[{"l":"TOP10","s":"","b":"°C","n":{"de":"Warmwasser Isttemperatur","en":"Hot water temperature","fr":"Température de l'eau chaude","ja":"給湯温度"},"t":{"de":"So warm ist das Wasser im Warmwasserspeicher gerade.","en":"How warm the water in the hot water tank currently is.","fr":"La température actuelle de l'eau dans le ballon d'eau chaude.","ja":"給湯タンクの今の水温です。"}},{"l":"TOP9","s":"SetDHWTemp","b":"40 … 75 °C","n":{"de":"Warmwasser Solltemperatur","en":"Hot water target","fr":"Consigne d'eau chaude","ja":"給湯の設定温度"},"t":{"de":"Auf diese Temperatur heizt die Wärmepumpe den Warmwasserspeicher auf. Je höher, desto mehr warmes Wasser steht bereit, aber desto mehr Strom wird gebraucht.","en":"The temperature the heat pump heats the hot water tank to. The higher it is, the more hot water is available, but the more electricity is needed.","fr":"La température à laquelle la pompe chauffe le ballon d'eau chaude. Plus elle est haute, plus il y a d'eau chaude disponible, mais plus la consommation augmente.","ja":"給湯タンクをこの温度まで沸かします。高いほどお湯は多く使えますが、電気も多く使います。"}},{"l":"TOP22","s":"SetDHWHeatDelta","b":"−12 … −2 °C","n":{"de":"Warmwasser Nachladen ab","en":"Hot water reheat below","fr":"Recharge de l'eau chaude sous","ja":"給湯の再加熱開始"},"t":{"de":"Wie weit der Speicher unter die Solltemperatur abkühlen darf, bevor wieder geheizt wird. −8 bei 50 °C bedeutet: Nachladen ab 42 °C. Panasonic-Werkseinstellung: −8.","en":"How far the tank may cool below the target before it is heated again. −8 at 50 °C means: reheat from 42 °C. Panasonic factory setting: −8.","fr":"De combien le ballon peut descendre sous la consigne avant d'être réchauffé. −8 à 50 °C signifie : recharge à partir de 42 °C. Réglage d'usine Panasonic : −8.","ja":"設定温度からどれだけ下がったら再び沸かすかです。50 °C で −8 なら 42 °C から再加熱します。Panasonic の工場出荷時は −8 です。"}},{"l":"TOP2","s":"SetForceDHW","b":"0/1","n":{"de":"Warmwasser einmalig aufheizen","en":"Heat hot water once","fr":"Chauffer l'eau chaude une fois","ja":"給湯を 1 回沸かす"},"t":{"de":"Heizt den Speicher sofort einmal auf, unabhängig vom Nachladepunkt. Laut HeishaMon muss die Betriebsart dafür Warmwasser enthalten.","en":"Heats the tank once right away, regardless of the reheat point. According to HeishaMon the operating mode must include hot water for this.","fr":"Chauffe le ballon une fois immédiatement, quel que soit le seuil de recharge. Selon HeishaMon, le mode doit inclure l'eau chaude.","ja":"再加熱の条件に関係なく、すぐに 1 回タンクを沸かします。HeishaMon によると、運転モードに給湯が含まれている必要があります。"}},{"l":"TOP69","s":"SetForceSterilization","b":"0/1","n":{"de":"Legionellenschutz","en":"Legionella protection","fr":"Protection anti-légionelles","ja":"レジオネラ対策"},"t":{"de":"Legionellen sind Bakterien, die sich in lauwarmem Wasser vermehren können. Beim Legionellenschutz wird der Speicher kurz stark aufgeheizt. Der Wert zeigt, ob das gerade läuft; der Befehl startet es sofort.","en":"Legionella are bacteria that can multiply in lukewarm water. For protection the tank is briefly heated to a high temperature. The value shows whether this is running; the command starts it right away.","fr":"Les légionelles sont des bactéries qui peuvent se multiplier dans l'eau tiède. Pour s'en protéger, le ballon est brièvement chauffé fortement. La valeur indique si c'est en cours ; la commande le lance immédiatement.","ja":"レジオネラはぬるいお湯の中で増える細菌です。対策として、タンクを短時間高温にします。値は実行中かどうかを示し、命令ですぐ開始します。"}},{"l":"TOP70","s":"SetSterilizationTemp","b":"55 … 75 °C","n":{"de":"Legionellenschutz: Temperatur","en":"Legionella protection: temperature","fr":"Anti-légionelles : température","ja":"レジオネラ対策：温度"},"t":{"de":"Auf diese Temperatur wird der Speicher beim Legionellenschutz aufgeheizt. Panasonic-Werkseinstellung: 65 °C. Die HeishaMon-Firmware nimmt nur 55 bis 75 an.","en":"The temperature the tank is heated to for legionella protection. Panasonic factory setting: 65 °C. The HeishaMon firmware only accepts 55 to 75.","fr":"La température à laquelle le ballon est chauffé pour la protection anti-légionelles. Réglage d'usine Panasonic : 65 °C. Le firmware HeishaMon n'accepte que 55 à 75.","ja":"レジオネラ対策でタンクを沸かす温度です。Panasonic の工場出荷時は 65 °C です。HeishaMon のファームウェアは 55〜75 のみ受け付けます。"}},{"l":"TOP71","s":"SetSterilizationMaxTime","b":"5 … 60 min","n":{"de":"Legionellenschutz: Haltezeit","en":"Legionella protection: hold time","fr":"Anti-légionelles : durée","ja":"レジオネラ対策：保持時間"},"t":{"de":"Wie lange die hohe Temperatur gehalten wird, nachdem sie erreicht ist. Nur in 5-Minuten-Schritten. Panasonic-Werkseinstellung: 10 Minuten.","en":"How long the high temperature is held once reached. Only in steps of 5 minutes. Panasonic factory setting: 10 minutes.","fr":"Combien de temps la température élevée est maintenue une fois atteinte. Par pas de 5 minutes. Réglage d'usine Panasonic : 10 minutes.","ja":"高温に達してから保つ時間です。5 分単位のみ。Panasonic の工場出荷時は 10 分です。"}},{"l":"TOP140","s":"SetSmartDHW","b":"0/1","n":{"de":"Smart DHW","en":"Smart DHW","fr":"Smart DHW","ja":"スマート給湯"},"t":{"de":"Laut HeishaMon 0 = variabel, 1 = standard. Panasonic beschreibt mit denselben Werten, ob der Speicher mit variabler oder mit fester (standard) Heizleistung geladen wird. Ob HeishaMon genau diese Einstellung meint, steht nicht in der Doku.","en":"According to HeishaMon 0 = variable, 1 = standard. Panasonic uses the same values to describe whether the tank is heated with variable or fixed (standard) capacity. Whether HeishaMon means exactly this setting is not documented.","fr":"Selon HeishaMon, 0 = variable, 1 = standard. Panasonic utilise les mêmes valeurs pour indiquer si le ballon est chauffé avec une puissance variable ou fixe (standard). La documentation ne précise pas si HeishaMon désigne exactement ce réglage.","ja":"HeishaMon では 0 = 可変、1 = 標準です。Panasonic は同じ値で、タンクを可変の能力で沸かすか固定（標準）の能力で沸かすかを説明しています。HeishaMon がこの設定そのものを指すかは説明書に書かれていません。"}},{"l":"TOP143","s":"SetDHWSensorSelection","b":"0/1","n":{"de":"Warmwasser: Fühlerposition","en":"Hot water: sensor position","fr":"Eau chaude : position de la sonde","ja":"給湯：センサー位置"},"t":{"de":"Welcher Fühler im Speicher zählt: 0 = oben, 1 = Mitte. Laut HeishaMon nur bei All-in-One-Geräten der K- und L-Serie.","en":"Which sensor in the tank counts: 0 = top, 1 = middle. According to HeishaMon only on K and L series all-in-one units.","fr":"Quelle sonde du ballon est prise en compte : 0 = haut, 1 = milieu. Selon HeishaMon, uniquement sur les appareils tout-en-un des séries K et L.","ja":"タンク内のどのセンサーを使うか：0 = 上、1 = 中央。HeishaMon によると K・L シリーズのオールインワンのみです。"}},{"l":"TOP100","s":"","b":"0/1","n":{"de":"Warmwasserspeicher vorhanden","en":"Hot water tank installed","fr":"Ballon d'eau chaude présent","ja":"給湯タンクあり"},"t":{"de":"Zeigt, ob in der Anlage ein Warmwasserspeicher eingerichtet ist.","en":"Shows whether a hot water tank is set up in the system.","fr":"Indique si un ballon d'eau chaude est configuré dans l'installation.","ja":"システムに給湯タンクが設定されているかを示します。"}}]},{"id":"puffer","titel":{"de":"Puffer, Solar und Pool","en":"Buffer, solar and pool","fr":"Ballon tampon, solaire et piscine","ja":"バッファー・太陽熱・プール"},"e":[{"l":"TOP46","s":"","b":"°C","n":{"de":"Puffertemperatur","en":"Buffer temperature","fr":"Température du ballon tampon","ja":"バッファー温度"},"t":{"de":"Die Temperatur im Heizungspuffer. Ein Puffer ist ein Wassertank, der Heizwärme zwischenspeichert, damit die Wärmepumpe seltener an- und ausgeht.","en":"The temperature in the heating buffer tank. A buffer is a water tank that stores heating heat so that the heat pump switches on and off less often.","fr":"La température dans le ballon tampon. Un ballon tampon est un réservoir d'eau qui stocke la chaleur de chauffage pour que la pompe démarre et s'arrête moins souvent.","ja":"暖房用バッファータンクの温度です。バッファーは暖房の熱を一時的にためる水のタンクで、ヒートポンプの入切の回数を減らします。"}},{"l":"TOP99","s":"SetBuffer","b":"0/1","n":{"de":"Puffer vorhanden","en":"Buffer installed","fr":"Ballon tampon présent","ja":"バッファーあり"},"t":{"de":"Teilt der Wärmepumpe mit, ob ein Heizungspuffer eingebaut ist. Nur ändern, wenn das der tatsächlichen Anlage entspricht.","en":"Tells the heat pump whether a heating buffer tank is installed. Only change this if it matches the actual system.","fr":"Indique à la pompe si un ballon tampon est installé. À ne modifier que si cela correspond à l'installation réelle.","ja":"暖房用バッファーが設置されているかをヒートポンプに伝えます。実際の設備と合っている場合だけ変更してください。"}},{"l":"TOP113","s":"SetBufferDelta","b":"0 … 10 °C","n":{"de":"Puffer: Delta","en":"Buffer: delta","fr":"Ballon tampon : delta","ja":"バッファー：デルタ"},"t":{"de":"Panasonic nennt diesen Wert nur „ΔT für den Pufferspeicher“, Werkseinstellung 5 °C. Wie die Wärmepumpe ihn genau verwendet, beschreiben weder Panasonic noch HeishaMon. Die Card zeigt daraus „Lädt ab“ als Soll minus Delta.","en":"Panasonic only calls this value “ΔT for buffer tank”, factory setting 5 °C. Neither Panasonic nor HeishaMon describe exactly how the heat pump uses it. The card shows “Reloads at” as target minus delta.","fr":"Panasonic appelle simplement cette valeur « ΔT du ballon tampon », réglage d'usine 5 °C. Ni Panasonic ni HeishaMon ne décrivent précisément son usage. La carte affiche « Recharge à » comme consigne moins delta.","ja":"Panasonic はこの値を「バッファータンクの ΔT」とだけ説明しており、工場出荷時は 5 °C です。どう使われるかは Panasonic も HeishaMon も詳しく書いていません。カードでは「設定値 − デルタ」を「再加熱開始」として表示します。"}},{"l":"TOP47","s":"","b":"°C","n":{"de":"Solartemperatur","en":"Solar temperature","fr":"Température solaire","ja":"太陽熱温度"},"t":{"de":"Die Temperatur am Solarkollektor, falls eine Solaranlage für Wärme angeschlossen ist.","en":"The temperature at the solar collector, if a solar thermal system is connected.","fr":"La température au capteur solaire, si une installation solaire thermique est raccordée.","ja":"太陽熱温水器が接続されている場合の、集熱器の温度です。"}},{"l":"TOP101","s":"","b":"0 … 2","n":{"de":"Solar: Betriebsart","en":"Solar: mode","fr":"Solaire : mode","ja":"太陽熱：モード"},"t":{"de":"Wohin die Solarwärme geht: aus, in den Puffer oder in den Warmwasserspeicher.","en":"Where the solar heat goes: off, to the buffer or to the hot water tank.","fr":"Où va la chaleur solaire : arrêt, vers le ballon tampon ou vers le ballon d'eau chaude.","ja":"太陽熱の行き先：オフ、バッファーへ、または給湯タンクへ。"}},{"l":"TOP102","s":"","b":"K","n":{"de":"Solar: Einschaltdifferenz","en":"Solar: switch-on difference","fr":"Solaire : écart de mise en marche","ja":"太陽熱：運転開始の温度差"},"t":{"de":"Um wie viel der Kollektor wärmer sein muss als der Speicher, damit die Solarpumpe anläuft.","en":"How much warmer the collector must be than the tank for the solar pump to start.","fr":"De combien le capteur doit être plus chaud que le ballon pour que la pompe solaire démarre.","ja":"集熱器がタンクよりどれだけ熱くなったら太陽熱ポンプを動かすかです。"}},{"l":"TOP103","s":"","b":"K","n":{"de":"Solar: Ausschaltdifferenz","en":"Solar: switch-off difference","fr":"Solaire : écart d'arrêt","ja":"太陽熱：運転停止の温度差"},"t":{"de":"Unterschreitet der Unterschied zwischen Kollektor und Speicher diesen Wert, stoppt die Solarpumpe.","en":"If the difference between collector and tank falls below this value, the solar pump stops.","fr":"Si l'écart entre capteur et ballon descend sous cette valeur, la pompe solaire s'arrête.","ja":"集熱器とタンクの温度差がこの値より小さくなると、太陽熱ポンプを止めます。"}},{"l":"TOP104","s":"","b":"°C","n":{"de":"Solar: Frostschutz","en":"Solar: frost protection","fr":"Solaire : protection antigel","ja":"太陽熱：凍結防止"},"t":{"de":"Temperatur, ab der der Solarkreis vor Frost geschützt wird.","en":"Temperature from which the solar circuit is protected against frost.","fr":"Température à partir de laquelle le circuit solaire est protégé du gel.","ja":"太陽熱回路の凍結防止を始める温度です。"}},{"l":"TOP105","s":"","b":"°C","n":{"de":"Solar: Höchsttemperatur","en":"Solar: maximum temperature","fr":"Solaire : température maximale","ja":"太陽熱：上限温度"},"t":{"de":"Höchste Temperatur, bis zu der Solarwärme in den Speicher geladen wird.","en":"Highest temperature up to which solar heat is loaded into the tank.","fr":"Température maximale jusqu'à laquelle la chaleur solaire est stockée dans le ballon.","ja":"太陽熱でタンクを加熱する上限の温度です。"}},{"l":"TOP48","s":"","b":"°C","n":{"de":"Pooltemperatur","en":"Pool temperature","fr":"Température de la piscine","ja":"プール温度"},"t":{"de":"Die Wassertemperatur eines angeschlossenen Schwimmbeckens.","en":"The water temperature of a connected swimming pool.","fr":"La température de l'eau d'une piscine raccordée.","ja":"接続されたプールの水温です。"}}]},{"id":"heizstab","titel":{"de":"Heizstab und zweiter Wärmeerzeuger","en":"Heater and second heat source","fr":"Appoint et second générateur","ja":"ヒーターと第 2 熱源"},"e":[{"l":"TOP59","s":"SetRoomHeaterState","b":"0/1","n":{"de":"Heizstab Heizen freigegeben","en":"Heating element for heating allowed","fr":"Appoint chauffage autorisé","ja":"暖房ヒーター許可"},"t":{"de":"Erlaubt oder sperrt den elektrischen Heizstab für die Heizung. Freigegeben heißt nicht, dass er läuft: Die Wärmepumpe schaltet ihn nur bei Bedarf zu, etwa bei großer Kälte. Ein Heizstab wandelt Strom direkt in Wärme um und ist deutlich teurer als die Wärmepumpe.","en":"Allows or blocks the electric heater for space heating. Allowed does not mean it is running: the heat pump only adds it when needed, for example in severe cold. A heater turns electricity directly into heat and is much more expensive than the heat pump.","fr":"Autorise ou bloque la résistance électrique pour le chauffage. Autorisé ne veut pas dire en marche : la pompe ne l'ajoute qu'en cas de besoin, par exemple par grand froid. Une résistance transforme directement l'électricité en chaleur et coûte bien plus cher que la pompe.","ja":"暖房用の電気ヒーターを許可または禁止します。許可しても動くとは限らず、厳しい寒さなど必要なときだけヒートポンプが追加で使います。ヒーターは電気をそのまま熱に変えるため、ヒートポンプよりかなり高くつきます。"}},{"l":"TOP58","s":"SetDHWHeaterState","b":"0/1","n":{"de":"Heizstab Warmwasser freigegeben","en":"Heater for hot water allowed","fr":"Appoint eau chaude autorisé","ja":"給湯ヒーター許可"},"t":{"de":"Erlaubt oder sperrt den Heizstab für das Warmwasser. Auch hier gilt: freigegeben heißt nur, dass er bei Bedarf mitheizen darf.","en":"Allows or blocks the heater for hot water. Here too, allowed only means it may help when needed.","fr":"Autorise ou bloque la résistance pour l'eau chaude. Là aussi, autorisé signifie seulement qu'elle peut aider en cas de besoin.","ja":"給湯用ヒーターを許可または禁止します。こちらも、許可は必要なときに加熱してよいという意味です。"}},{"l":"TOP60","s":"","b":"0/1","n":{"de":"Interner Heizstab läuft","en":"Internal heater running","fr":"Appoint interne en marche","ja":"内部ヒーター運転中"},"t":{"de":"Zeigt, ob der eingebaute Heizstab gerade heizt.","en":"Shows whether the built-in heater is currently heating.","fr":"Indique si la résistance intégrée chauffe actuellement.","ja":"内蔵ヒーターが今加熱しているかを示します。"}},{"l":"TOP61","s":"","b":"0/1","n":{"de":"Externer Heizstab läuft","en":"External heater running","fr":"Appoint externe en marche","ja":"外部ヒーター運転中"},"t":{"de":"Zeigt, ob ein extern angeschlossener Heizstab gerade heizt.","en":"Shows whether an externally connected heater is currently heating.","fr":"Indique si une résistance externe raccordée chauffe actuellement.","ja":"外部に接続したヒーターが今加熱しているかを示します。"}},{"l":"TOP78","s":"SetHeaterOnOutdoorTemp","b":"−15 … 20 °C","n":{"de":"Heizstab erst unter Außentemperatur","en":"Heater only below outdoor temp.","fr":"Appoint seulement sous","ja":"ヒーター使用開始外気温"},"t":{"de":"Erst wenn es draußen kälter ist als dieser Wert, darf die Wärmepumpe den Heizstab für die Heizung nutzen. Panasonic-Werkseinstellung: 0 °C.","en":"Only when it is colder outside than this value may the heat pump use the heater for space heating. Panasonic factory setting: 0 °C.","fr":"La pompe ne peut utiliser la résistance pour le chauffage que s'il fait plus froid dehors que cette valeur. Réglage d'usine Panasonic : 0 °C.","ja":"外気温がこの値より低いときだけ、暖房にヒーターを使えます。Panasonic の工場出荷時は 0 °C です。"}},{"l":"TOP68","s":"SetForceHeater","b":"0/1","n":{"de":"Notheizung","en":"Emergency heating","fr":"Chauffage de secours","ja":"緊急暖房"},"t":{"de":"Heizt nur mit dem Heizstab, wie die Heizstab-Taste an der Fernbedienung. Gedacht für den Notfall, wenn die Wärmepumpe selbst nicht heizen kann. Verbraucht viel Strom.","en":"Heats with the heater only, like the heater button on the remote control. Meant for emergencies when the heat pump itself cannot heat. Uses a lot of electricity.","fr":"Chauffe uniquement avec la résistance, comme la touche correspondante de la télécommande. Prévu pour les urgences quand la pompe ne peut pas chauffer. Consomme beaucoup d'électricité.","ja":"リモコンのヒーターボタンと同じく、ヒーターだけで暖房します。ヒートポンプ自体が暖房できない緊急時用です。電気を多く使います。"}},{"l":"TOP90","s":"","b":"h","n":{"de":"Heizstab Heizen: Betriebsstunden","en":"Heater for heating: hours","fr":"Appoint chauffage : heures","ja":"暖房ヒーター：運転時間"},"t":{"de":"Wie viele Stunden der Heizstab bisher für die Heizung gelaufen ist.","en":"How many hours the heater has run for space heating so far.","fr":"Nombre d'heures de fonctionnement de la résistance pour le chauffage jusqu'ici.","ja":"これまでに暖房でヒーターが動いた時間です。"}},{"l":"TOP91","s":"","b":"h","n":{"de":"Heizstab Warmwasser: Betriebsstunden","en":"Heater for hot water: hours","fr":"Appoint eau chaude : heures","ja":"給湯ヒーター：運転時間"},"t":{"de":"Wie viele Stunden der Heizstab bisher für das Warmwasser gelaufen ist.","en":"How many hours the heater has run for hot water so far.","fr":"Nombre d'heures de fonctionnement de la résistance pour l'eau chaude jusqu'ici.","ja":"これまでに給湯でヒーターが動いた時間です。"}},{"l":"TOP96","s":"SetHeaterDelayTime","b":"min","n":{"de":"Heizstab: Verzögerung","en":"Heater: delay","fr":"Appoint : temporisation","ja":"ヒーター：遅延"},"t":{"de":"Wartezeit, bevor der Heizstab zugeschaltet wird. Laut HeishaMon nur J-Serie.","en":"Waiting time before the heater is added. According to HeishaMon J series only.","fr":"Délai avant l'enclenchement de la résistance. Selon HeishaMon, série J uniquement.","ja":"ヒーターを追加するまでの待ち時間です。HeishaMon によると J シリーズのみです。"}},{"l":"TOP97","s":"SetHeaterStartDelta","b":"K","n":{"de":"Heizstab: Einschaltdifferenz","en":"Heater: start difference","fr":"Appoint : écart d'enclenchement","ja":"ヒーター：入の温度差"},"t":{"de":"Temperaturunterschied, ab dem der Heizstab einschaltet. Laut HeishaMon nur J-Serie.","en":"Temperature difference at which the heater switches on. According to HeishaMon J series only.","fr":"Écart de température à partir duquel la résistance s'enclenche. Selon HeishaMon, série J uniquement.","ja":"ヒーターが入る温度差です。HeishaMon によると J シリーズのみです。"}},{"l":"TOP98","s":"SetHeaterStopDelta","b":"K","n":{"de":"Heizstab: Ausschaltdifferenz","en":"Heater: stop difference","fr":"Appoint : écart d'arrêt","ja":"ヒーター：切の温度差"},"t":{"de":"Temperaturunterschied, ab dem der Heizstab wieder ausschaltet. Laut HeishaMon nur J-Serie.","en":"Temperature difference at which the heater switches off again. According to HeishaMon J series only.","fr":"Écart de température à partir duquel la résistance se coupe. Selon HeishaMon, série J uniquement.","ja":"ヒーターが切れる温度差です。HeishaMon によると J シリーズのみです。"}},{"l":"TOP114","s":"SetExternalPadHeater","b":"0 … 2","n":{"de":"Bodenwannenheizung","en":"Base pan heater","fr":"Chauffage du bac","ja":"ベースパンヒーター"},"t":{"de":"Eine kleine Heizung in der Wanne unter dem Außengerät, damit Tauwasser nicht festfriert. 0 = keine, 1 = Typ A, 2 = Typ B. Laut Panasonic läuft Typ A nur beim Abtauen, Typ B ab 5 °C Außentemperatur und kälter.","en":"A small heater in the tray under the outdoor unit so that defrost water does not freeze. 0 = none, 1 = type A, 2 = type B. According to Panasonic type A only runs during defrost, type B at an outdoor temperature of 5 °C or below.","fr":"Un petit chauffage dans le bac sous l'unité extérieure pour que l'eau de dégivrage ne gèle pas. 0 = aucun, 1 = type A, 2 = type B. Selon Panasonic, le type A ne fonctionne qu'au dégivrage, le type B à 5 °C extérieur ou moins.","ja":"室外機の下の受け皿にある小さなヒーターで、霜取りの水が凍らないようにします。0 = なし、1 = タイプ A、2 = タイプ B。Panasonic によると、タイプ A は霜取り中のみ、タイプ B は外気温 5 °C 以下で動きます。"}},{"l":"TOP129","s":"SetBivalentControl","b":"0/1","n":{"de":"Bivalent: ein/aus","en":"Bivalent: on/off","fr":"Bivalent : marche/arrêt","ja":"バイバレント：入/切"},"t":{"de":"Bivalent heißt: Es gibt einen zweiten Wärmeerzeuger, zum Beispiel einen Gas- oder Ölkessel. Hier wird diese Zusammenarbeit ein- oder ausgeschaltet.","en":"Bivalent means there is a second heat source, for example a gas or oil boiler. This switches that cooperation on or off.","fr":"Bivalent signifie qu'il existe un second générateur de chaleur, par exemple une chaudière gaz ou fioul. On active ou désactive ici cette coopération.","ja":"バイバレントとは、ガスや石油ボイラーなど第 2 の熱源があることです。その連携を入切します。"}},{"l":"TOP130","s":"SetBivalentMode","b":"0 … 2","n":{"de":"Bivalent: Betriebsart","en":"Bivalent: mode","fr":"Bivalent : mode","ja":"バイバレント：モード"},"t":{"de":"0 = alternativ: Unter der Starttemperatur übernimmt der zweite Wärmeerzeuger anstelle der Wärmepumpe. 1 = parallel: Beide heizen gemeinsam. 2 = erweitert parallel: parallel mit eigenen Ein- und Ausschaltpunkten und Verzögerungen.","en":"0 = alternative: below the start temperature the second heat source takes over instead of the heat pump. 1 = parallel: both heat together. 2 = advanced parallel: parallel with its own on and off points and delays.","fr":"0 = alternatif : sous la température de démarrage, le second générateur remplace la pompe. 1 = parallèle : les deux chauffent ensemble. 2 = parallèle avancé : parallèle avec ses propres seuils et temporisations.","ja":"0 = 切替：開始温度より寒いと、ヒートポンプの代わりに第 2 熱源が運転します。1 = 並列：両方で暖房します。2 = 拡張並列：独自の入切温度と遅延を持つ並列運転です。"}},{"l":"TOP131","s":"SetBivalentStartTemp","b":"−15 … 35 °C","n":{"de":"Bivalent: Starttemperatur","en":"Bivalent: start temperature","fr":"Bivalent : température de démarrage","ja":"バイバレント：開始温度"},"t":{"de":"Unter dieser Außentemperatur wird der zweite Wärmeerzeuger genutzt. Panasonic-Werkseinstellung: −5 °C.","en":"Below this outdoor temperature the second heat source is used. Panasonic factory setting: −5 °C.","fr":"En dessous de cette température extérieure, le second générateur est utilisé. Réglage d'usine Panasonic : −5 °C.","ja":"この外気温より寒いと第 2 熱源を使います。Panasonic の工場出荷時は −5 °C です。"}},{"l":"TOP132","s":"","b":"0/1","n":{"de":"Bivalent erweitert: Heizen","en":"Bivalent advanced: heating","fr":"Bivalent avancé : chauffage","ja":"拡張バイバレント：暖房"},"t":{"de":"Ob die erweiterte Parallelsteuerung beim Heizen aktiv ist.","en":"Whether advanced parallel control is active for heating.","fr":"Indique si la commande parallèle avancée est active pour le chauffage.","ja":"暖房で拡張並列制御が有効かどうかです。"}},{"l":"TOP133","s":"","b":"0/1","n":{"de":"Bivalent erweitert: Warmwasser","en":"Bivalent advanced: hot water","fr":"Bivalent avancé : eau chaude","ja":"拡張バイバレント：給湯"},"t":{"de":"Ob die erweiterte Parallelsteuerung beim Warmwasser aktiv ist.","en":"Whether advanced parallel control is active for hot water.","fr":"Indique si la commande parallèle avancée est active pour l'eau chaude.","ja":"給湯で拡張並列制御が有効かどうかです。"}},{"l":"TOP134","s":"SetBivalentAPStartTemp","b":"−15 … 35 °C","n":{"de":"Bivalent erweitert: Starttemperatur","en":"Bivalent advanced: start temperature","fr":"Bivalent avancé : température d'enclenchement","ja":"拡張バイバレント：開始温度"},"t":{"de":"Temperatur, ab der der zweite Wärmeerzeuger im erweiterten Parallelbetrieb zuschaltet.","en":"Temperature at which the second heat source switches on in advanced parallel mode.","fr":"Température à laquelle le second générateur s'enclenche en parallèle avancé.","ja":"拡張並列運転で第 2 熱源が加わる温度です。"}},{"l":"TOP135","s":"SetBivalentAPStopTemp","b":"−15 … 35 °C","n":{"de":"Bivalent erweitert: Stopptemperatur","en":"Bivalent advanced: stop temperature","fr":"Bivalent avancé : température d'arrêt","ja":"拡張バイバレント：停止温度"},"t":{"de":"Temperatur, ab der der zweite Wärmeerzeuger im erweiterten Parallelbetrieb wieder abschaltet.","en":"Temperature at which the second heat source switches off again in advanced parallel mode.","fr":"Température à laquelle le second générateur se coupe en parallèle avancé.","ja":"拡張並列運転で第 2 熱源が止まる温度です。"}},{"l":"TOP136","s":"","b":"min","n":{"de":"Bivalent erweitert: Startverzögerung","en":"Bivalent advanced: start delay","fr":"Bivalent avancé : délai d'enclenchement","ja":"拡張バイバレント：開始遅延"},"t":{"de":"Wartezeit, bevor der zweite Wärmeerzeuger zuschaltet.","en":"Waiting time before the second heat source switches on.","fr":"Délai avant l'enclenchement du second générateur.","ja":"第 2 熱源が加わるまでの待ち時間です。"}},{"l":"TOP137","s":"","b":"min","n":{"de":"Bivalent erweitert: Stoppverzögerung","en":"Bivalent advanced: stop delay","fr":"Bivalent avancé : délai d'arrêt","ja":"拡張バイバレント：停止遅延"},"t":{"de":"Wartezeit, bevor der zweite Wärmeerzeuger wieder abschaltet.","en":"Waiting time before the second heat source switches off again.","fr":"Délai avant l'arrêt du second générateur.","ja":"第 2 熱源が止まるまでの待ち時間です。"}},{"l":"TOP138","s":"","b":"min","n":{"de":"Bivalent erweitert: Verzögerung Warmwasser","en":"Bivalent advanced: hot water delay","fr":"Bivalent avancé : délai eau chaude","ja":"拡張バイバレント：給湯の遅延"},"t":{"de":"Wartezeit für den zweiten Wärmeerzeuger beim Warmwasser.","en":"Waiting time for the second heat source for hot water.","fr":"Délai du second générateur pour l'eau chaude.","ja":"給湯で第 2 熱源を使うまでの待ち時間です。"}}]},{"id":"kaeltekreis","titel":{"de":"Verdichter und Kältekreis","en":"Compressor and refrigerant circuit","fr":"Compresseur et circuit frigorifique","ja":"圧縮機と冷媒回路"},"e":[{"l":"","s":"","b":"","n":{"de":"Wie die Wärmepumpe arbeitet","en":"How the heat pump works","fr":"Fonctionnement de la pompe","ja":"ヒートポンプのしくみ"},"t":{"de":"Im Außengerät läuft ein Kältemittel im Kreis. Es nimmt Wärme aus der Außenluft auf, der Verdichter drückt es zusammen und macht es dadurch heiß, und im Wärmetauscher gibt es diese Wärme an das Heizwasser ab. Die Werte in dieser Gruppe beschreiben diesen Kreislauf und sind vor allem für die Fehlersuche nützlich.","en":"A refrigerant circulates in the outdoor unit. It takes heat from the outside air, the compressor squeezes it and makes it hot, and in the heat exchanger it passes this heat to the heating water. The values in this group describe this circuit and are mainly useful for troubleshooting.","fr":"Un fluide frigorigène circule dans l'unité extérieure. Il prend la chaleur de l'air extérieur, le compresseur le comprime et le rend chaud, puis l'échangeur cède cette chaleur à l'eau de chauffage. Les valeurs de ce groupe décrivent ce circuit et servent surtout au diagnostic.","ja":"室外機の中を冷媒が循環しています。冷媒は外気から熱を取り込み、圧縮機で圧縮されて高温になり、熱交換器でその熱を暖房の水へ渡します。このグループの値はこの回路の状態で、主に故障の診断に役立ちます。"}},{"l":"TOP8","s":"","b":"Hz","n":{"de":"Verdichterdrehzahl","en":"Compressor speed","fr":"Vitesse du compresseur","ja":"圧縮機の回転数"},"t":{"de":"Wie schnell der Verdichter gerade läuft, in Hertz. 0 heißt: Er steht. Höhere Werte bedeuten mehr Leistung.","en":"How fast the compressor is currently running, in hertz. 0 means it is stopped. Higher values mean more power.","fr":"La vitesse actuelle du compresseur, en hertz. 0 signifie qu'il est à l'arrêt. Une valeur plus haute signifie plus de puissance.","ja":"圧縮機の今の回転の速さ（ヘルツ）です。0 は停止中で、値が大きいほど出力が大きいです。"}},{"l":"TOP26","s":"SetForceDefrost","b":"0/1","n":{"de":"Abtauen","en":"Defrost","fr":"Dégivrage","ja":"霜取り"},"t":{"de":"Bei Kälte kann das Außengerät vereisen. Beim Abtauen wird es kurz erwärmt, damit das Eis schmilzt; in dieser Zeit wird dem Heizwasser etwas Wärme entzogen. Der Wert zeigt, ob gerade abgetaut wird. Der Befehl startet ein Abtauen von Hand.","en":"In cold weather the outdoor unit can ice up. During defrost it is briefly warmed so that the ice melts; during this time some heat is taken from the heating water. The value shows whether defrost is running. The command starts a defrost manually.","fr":"Par temps froid, l'unité extérieure peut givrer. Pendant le dégivrage, elle est brièvement réchauffée pour faire fondre la glace ; un peu de chaleur est alors prise à l'eau de chauffage. La valeur indique si un dégivrage est en cours. La commande en lance un manuellement.","ja":"寒いと室外機に霜や氷が付きます。霜取りでは室外機を一時的に温めて氷を溶かし、その間は暖房の水から少し熱を使います。値は霜取り中かどうかを示し、命令で手動の霜取りを開始します。"}},{"l":"TOP62","s":"","b":"1/min","n":{"de":"Lüfter 1 Drehzahl","en":"Fan 1 speed","fr":"Vitesse du ventilateur 1","ja":"ファン 1 の回転数"},"t":{"de":"Wie schnell der Ventilator im Außengerät dreht.","en":"How fast the fan in the outdoor unit is turning.","fr":"La vitesse de rotation du ventilateur de l'unité extérieure.","ja":"室外機のファンの回転の速さです。"}},{"l":"TOP63","s":"","b":"1/min","n":{"de":"Lüfter 2 Drehzahl","en":"Fan 2 speed","fr":"Vitesse du ventilateur 2","ja":"ファン 2 の回転数"},"t":{"de":"Wie schnell der zweite Ventilator im Außengerät dreht, falls vorhanden.","en":"How fast the second fan in the outdoor unit is turning, if present.","fr":"La vitesse du deuxième ventilateur de l'unité extérieure, s'il existe.","ja":"室外機に 2 台目のファンがある場合、その回転の速さです。"}},{"l":"TOP67","s":"","b":"A","n":{"de":"Stromstärke Außengerät","en":"Outdoor unit current","fr":"Courant de l'unité extérieure","ja":"室外機の電流"},"t":{"de":"Wie viel Strom (Ampere) Verdichter und Außengerät gerade aufnehmen.","en":"How much current (amperes) the compressor and outdoor unit are currently drawing.","fr":"Le courant (ampères) absorbé actuellement par le compresseur et l'unité extérieure.","ja":"圧縮機と室外機が今使っている電流（アンペア）です。"}},{"l":"TOP64","s":"","b":"kgf/cm²","n":{"de":"Hochdruck","en":"High pressure","fr":"Haute pression","ja":"高圧"},"t":{"de":"Der Druck des Kältemittels auf der heißen Seite, nach dem Verdichter.","en":"The refrigerant pressure on the hot side, after the compressor.","fr":"La pression du fluide frigorigène côté chaud, après le compresseur.","ja":"圧縮機の後、高温側の冷媒の圧力です。"}},{"l":"TOP66","s":"","b":"kgf/cm²","n":{"de":"Niederdruck","en":"Low pressure","fr":"Basse pression","ja":"低圧"},"t":{"de":"Der Druck des Kältemittels auf der kalten Seite, vor dem Verdichter.","en":"The refrigerant pressure on the cold side, before the compressor.","fr":"La pression du fluide frigorigène côté froid, avant le compresseur.","ja":"圧縮機の前、低温側の冷媒の圧力です。"}},{"l":"TOP50","s":"","b":"°C","n":{"de":"Heißgastemperatur","en":"Discharge temperature","fr":"Température de refoulement","ja":"吐出温度"},"t":{"de":"Die Temperatur des Kältemittels direkt hinter dem Verdichter. Das ist die heißeste Stelle im Kreislauf.","en":"The refrigerant temperature right after the compressor. This is the hottest point in the circuit.","fr":"La température du fluide frigorigène juste après le compresseur. C'est le point le plus chaud du circuit.","ja":"圧縮機を出た直後の冷媒の温度で、回路で最も熱い所です。"}},{"l":"TOP51","s":"","b":"°C","n":{"de":"Leitungstemperatur innen","en":"Inside pipe temperature","fr":"Température tuyau intérieur","ja":"室内側配管温度"},"t":{"de":"Laut HeishaMon die Temperatur an einer Kältemittelleitung auf der Innenseite.","en":"According to HeishaMon the temperature at a refrigerant pipe on the indoor side.","fr":"Selon HeishaMon, la température d'un tuyau de fluide frigorigène côté intérieur.","ja":"HeishaMon によると、室内側の冷媒配管の温度です。"}},{"l":"TOP21","s":"","b":"°C","n":{"de":"Leitungstemperatur außen","en":"Outside pipe temperature","fr":"Température tuyau extérieur","ja":"室外側配管温度"},"t":{"de":"Laut HeishaMon die Temperatur an einer Kältemittelleitung im Außengerät.","en":"According to HeishaMon the temperature at a refrigerant pipe in the outdoor unit.","fr":"Selon HeishaMon, la température d'un tuyau de fluide frigorigène dans l'unité extérieure.","ja":"HeishaMon によると、室外機の冷媒配管の温度です。"}},{"l":"TOP52","s":"","b":"°C","n":{"de":"Abtaufühler","en":"Defrost sensor","fr":"Sonde de dégivrage","ja":"霜取りセンサー"},"t":{"de":"Laut HeishaMon die „Abtau-Temperatur“. Wofür die Wärmepumpe diesen Fühler genau verwendet, beschreibt die Doku nicht.","en":"According to HeishaMon the “defrost temperature”. The documentation does not describe exactly what the heat pump uses this sensor for.","fr":"Selon HeishaMon, la « température de dégivrage ». La documentation ne précise pas l'usage exact de cette sonde.","ja":"HeishaMon では「霜取り温度」とされています。このセンサーの正確な用途は説明書に書かれていません。"}},{"l":"TOP53","s":"","b":"°C","n":{"de":"Verdampferaustritt","en":"Evaporator outlet","fr":"Sortie évaporateur","ja":"蒸発器出口"},"t":{"de":"Die Temperatur des Kältemittels nach dem Verdampfer, also nachdem es Wärme aus der Außenluft aufgenommen hat.","en":"The refrigerant temperature after the evaporator, that is after it has taken heat from the outside air.","fr":"La température du fluide frigorigène après l'évaporateur, donc après avoir pris la chaleur de l'air extérieur.","ja":"蒸発器を出た後、つまり外気から熱を取り込んだ後の冷媒の温度です。"}},{"l":"TOP54","s":"","b":"°C","n":{"de":"Bypass-Austritt","en":"Bypass outlet","fr":"Sortie by-pass","ja":"バイパス出口"},"t":{"de":"Laut HeishaMon die Temperatur am Bypass-Austritt im Kältekreis. Genaueres beschreibt die Doku nicht.","en":"According to HeishaMon the temperature at the bypass outlet in the refrigerant circuit. The documentation gives no further detail.","fr":"Selon HeishaMon, la température à la sortie by-pass du circuit frigorifique. La documentation n'en dit pas plus.","ja":"HeishaMon によると、冷媒回路のバイパス出口の温度です。詳しい説明はありません。"}},{"l":"TOP117","s":"","b":"°C","n":{"de":"Economizer-Austritt","en":"Economizer outlet","fr":"Sortie économiseur","ja":"エコノマイザー出口"},"t":{"de":"Temperatur am Ausgang des Economizers, eines Bauteils im Kältekreis. Laut HeishaMon nur K- und L-Serie.","en":"Temperature at the outlet of the economizer, a part of the refrigerant circuit. According to HeishaMon K and L series only.","fr":"Température à la sortie de l'économiseur, un élément du circuit frigorifique. Selon HeishaMon, séries K et L uniquement.","ja":"冷媒回路の部品であるエコノマイザーの出口温度です。HeishaMon によると K・L シリーズのみです。"}},{"l":"TOP55","s":"","b":"°C","n":{"de":"Elektronik-Temperatur (IPM)","en":"Electronics temperature (IPM)","fr":"Température électronique (IPM)","ja":"電子部品温度（IPM）"},"t":{"de":"Die Temperatur des Leistungsmoduls, das den Verdichter elektrisch ansteuert.","en":"The temperature of the power module that electrically drives the compressor.","fr":"La température du module de puissance qui pilote électriquement le compresseur.","ja":"圧縮機を電気的に動かすパワーモジュールの温度です。"}},{"l":"TOP142","s":"","b":"","n":{"de":"Expansionsventil","en":"Expansion valve","fr":"Détendeur","ja":"膨張弁"},"t":{"de":"Die Stellung des Expansionsventils in Schritten. Dieses Ventil regelt, wie viel Kältemittel durch den Kreislauf fließt.","en":"The position of the expansion valve in steps. This valve controls how much refrigerant flows through the circuit.","fr":"La position du détendeur en pas. Cette vanne règle la quantité de fluide frigorigène qui circule.","ja":"膨張弁の開度（ステップ）です。この弁が回路を流れる冷媒の量を調整します。"}}]},{"id":"pumpe","titel":{"de":"Pumpe, Ventile und Wasserkreis","en":"Pump, valves and water circuit","fr":"Pompe, vannes et circuit d'eau","ja":"ポンプ・弁・水回路"},"e":[{"l":"TOP1","s":"","b":"l/min","n":{"de":"Durchfluss","en":"Flow rate","fr":"Débit","ja":"流量"},"t":{"de":"Wie viel Wasser pro Minute durch die Wärmepumpe fließt.","en":"How much water flows through the heat pump per minute.","fr":"La quantité d'eau qui traverse la pompe à chaleur par minute.","ja":"1 分間にヒートポンプを流れる水の量です。"}},{"l":"TOP65","s":"","b":"1/min","n":{"de":"Pumpendrehzahl","en":"Pump speed","fr":"Vitesse de la pompe","ja":"ポンプ回転数"},"t":{"de":"Wie schnell die Umwälzpumpe der Wärmepumpe dreht.","en":"How fast the heat pump's circulation pump is turning.","fr":"La vitesse de rotation du circulateur de la pompe à chaleur.","ja":"ヒートポンプの循環ポンプの回転の速さです。"}},{"l":"TOP93","s":"","b":"","n":{"de":"Pumpenansteuerung","en":"Pump duty","fr":"Commande de la pompe","ja":"ポンプ出力"},"t":{"de":"Die aktuelle Ansteuerung (Leistungsstufe) der Umwälzpumpe.","en":"The current drive level of the circulation pump.","fr":"Le niveau de commande actuel du circulateur.","ja":"循環ポンプの今の出力レベルです。"}},{"l":"TOP95","s":"SetMaxPumpDuty","b":"64 … 254","n":{"de":"Maximale Pumpenleistung","en":"Maximum pump duty","fr":"Puissance max. de la pompe","ja":"ポンプ最大出力"},"t":{"de":"Die höchste Leistungsstufe, mit der die Umwälzpumpe laufen darf. Höher bedeutet mehr Durchfluss, aber auch mehr Strom und eventuell Strömungsgeräusche.","en":"The highest level at which the circulation pump may run. Higher means more flow, but also more electricity and possibly flow noise.","fr":"Le niveau maximal auquel le circulateur peut fonctionner. Plus haut signifie plus de débit, mais aussi plus d'électricité et parfois des bruits d'écoulement.","ja":"循環ポンプを動かしてよい最大の出力レベルです。高いほど流量は増えますが、電気も多く使い、水の流れる音が出ることもあります。"}},{"l":"TOP106","s":"SetPumpFlowrateMode","b":"0/1","n":{"de":"Pumpenregelung","en":"Pump control","fr":"Régulation de la pompe","ja":"ポンプ制御"},"t":{"de":"0 = Spreizung (ΔT): Die Pumpe passt ihre Drehzahl so an, dass der eingestellte Unterschied zwischen Vor- und Rücklauf erreicht wird. 1 = maximale Leistung: Die Pumpe läuft fest mit der eingestellten Höchstleistung. Laut HeishaMon wird der Wert nur bei der J-Serie gemeldet.","en":"0 = spread (ΔT): the pump adjusts its speed to reach the set difference between flow and return. 1 = max. duty: the pump runs fixed at the set maximum. According to HeishaMon the value is only reported on the J series.","fr":"0 = écart (ΔT) : la pompe adapte sa vitesse pour atteindre l'écart réglé entre départ et retour. 1 = puissance max. : la pompe tourne en fixe à la puissance maximale réglée. Selon HeishaMon, la valeur n'est transmise que sur la série J.","ja":"0 = 温度差（ΔT）：往きと戻りの差が設定値になるよう回転数を調整します。1 = 最大出力：設定した最大出力で一定に運転します。HeishaMon によると、この値は J シリーズのみ報告されます。"}},{"l":"","s":"SetPump","b":"0/1","n":{"de":"Pumpe Servicebetrieb","en":"Pump service mode","fr":"Pompe en mode service","ja":"ポンプ サービス運転"},"t":{"de":"Lässt die Umwälzpumpe im Servicebetrieb mit voller Drehzahl laufen, etwa zum Entlüften der Anlage. Nur für Wartungsarbeiten gedacht.","en":"Runs the circulation pump at full speed in service mode, for example to vent the system. Only meant for maintenance.","fr":"Fait tourner le circulateur à pleine vitesse en mode service, par exemple pour purger l'installation. Réservé à l'entretien.","ja":"サービス運転として循環ポンプを最高回転で動かします。配管のエア抜きなど、保守作業専用です。"}},{"l":"TOP115","s":"","b":"bar","n":{"de":"Wasserdruck","en":"Water pressure","fr":"Pression d'eau","ja":"水圧"},"t":{"de":"Der Druck im Heizwasser. Ist er zu niedrig, muss meist Wasser nachgefüllt werden; den richtigen Wert kennt der Installateur. Laut HeishaMon nur K- und L-Serie.","en":"The pressure in the heating water. If it is too low, water usually has to be topped up; the installer knows the correct value. According to HeishaMon K and L series only.","fr":"La pression de l'eau de chauffage. Si elle est trop basse, il faut généralement rajouter de l'eau ; l'installateur connaît la bonne valeur. Selon HeishaMon, séries K et L uniquement.","ja":"暖房の水の圧力です。低すぎる場合は通常水の補給が必要です。適正値は施工業者が知っています。HeishaMon によると K・L シリーズのみです。"}},{"l":"TOP20","s":"","b":"0/1","n":{"de":"Umschaltventil","en":"Three-way valve","fr":"Vanne d'inversion","ja":"三方弁"},"t":{"de":"Das Ventil, das das warme Wasser entweder in die Heizung (0 = Raum) oder in den Warmwasserspeicher (1 = Warmwasser) leitet. Beides gleichzeitig geht nicht.","en":"The valve that sends the warm water either to the heating (0 = room) or to the hot water tank (1 = hot water). Both at once is not possible.","fr":"La vanne qui envoie l'eau chaude soit vers le chauffage (0 = pièce), soit vers le ballon d'eau chaude (1 = eau chaude). Les deux à la fois n'est pas possible.","ja":"温水を暖房（0 = 室内）か給湯タンク（1 = 給湯）のどちらかへ送る弁です。同時には送れません。"}},{"l":"TOP126","s":"","b":"0/1","n":{"de":"Umschaltventil (zweite Meldung)","en":"Three-way valve (second report)","fr":"Vanne d'inversion (2e valeur)","ja":"三方弁（2 つ目の値）"},"t":{"de":"Laut HeishaMon eine zweite Meldung zum Umschaltventil. Wodurch sie sich von TOP20 unterscheidet, beschreibt die Doku nicht.","en":"According to HeishaMon a second report of the three-way valve. The documentation does not say how it differs from TOP20.","fr":"Selon HeishaMon, une deuxième valeur de la vanne d'inversion. La documentation ne dit pas en quoi elle diffère de TOP20.","ja":"HeishaMon によると三方弁の 2 つ目の値です。TOP20 との違いは説明書に書かれていません。"}},{"l":"TOP125","s":"","b":"0/1","n":{"de":"Zweiwegeventil","en":"Two-way valve","fr":"Vanne deux voies","ja":"二方弁"},"t":{"de":"Zustand eines Zweiwegeventils, das einen Wasserweg öffnet oder schließt.","en":"State of a two-way valve that opens or closes a water path.","fr":"État d'une vanne deux voies qui ouvre ou ferme un passage d'eau.","ja":"水の通り道を開け閉めする二方弁の状態です。"}},{"l":"TOP124","s":"","b":"0/1","n":{"de":"Zone 1: Pumpe","en":"Zone 1: pump","fr":"Zone 1 : pompe","ja":"ゾーン 1：ポンプ"},"t":{"de":"Ob die Pumpe von Heizkreis 1 gerade läuft.","en":"Whether the pump of heating circuit 1 is currently running.","fr":"Indique si la pompe du circuit 1 fonctionne.","ja":"暖房回路 1 のポンプが動いているかどうかです。"}},{"l":"TOP123","s":"","b":"0/1","n":{"de":"Zone 2: Pumpe","en":"Zone 2: pump","fr":"Zone 2 : pompe","ja":"ゾーン 2：ポンプ"},"t":{"de":"Ob die Pumpe von Heizkreis 2 gerade läuft.","en":"Whether the pump of heating circuit 2 is currently running.","fr":"Indique si la pompe du circuit 2 fonctionne.","ja":"暖房回路 2 のポンプが動いているかどうかです。"}},{"l":"TOP127","s":"","b":"","n":{"de":"Zone 1: Mischventil","en":"Zone 1: mixing valve","fr":"Zone 1 : vanne mélangeuse","ja":"ゾーン 1：混合弁"},"t":{"de":"Laut HeishaMon der Regelwert (PID) für das Mischventil von Zone 1. Ein Mischventil mischt kaltes Rücklaufwasser bei, damit ein Heizkreis kühleres Wasser bekommt.","en":"According to HeishaMon the control value (PID) for the zone 1 mixing valve. A mixing valve adds cooler return water so that a circuit gets cooler water.","fr":"Selon HeishaMon, la valeur de régulation (PID) de la vanne mélangeuse de la zone 1. Une vanne mélangeuse ajoute de l'eau de retour plus froide pour qu'un circuit reçoive une eau moins chaude.","ja":"HeishaMon によると、ゾーン 1 の混合弁の制御値（PID）です。混合弁は冷めた戻り水を混ぜ、回路にぬるめの水を送ります。"}},{"l":"TOP128","s":"","b":"","n":{"de":"Zone 2: Mischventil","en":"Zone 2: mixing valve","fr":"Zone 2 : vanne mélangeuse","ja":"ゾーン 2：混合弁"},"t":{"de":"Laut HeishaMon der Regelwert (PID) für das Mischventil von Zone 2.","en":"According to HeishaMon the control value (PID) for the zone 2 mixing valve.","fr":"Selon HeishaMon, la valeur de régulation (PID) de la vanne mélangeuse de la zone 2.","ja":"HeishaMon によると、ゾーン 2 の混合弁の制御値（PID）です。"}},{"l":"TOP107","s":"","b":"0/1","n":{"de":"Flüssigkeit im Kreis","en":"Liquid in the circuit","fr":"Liquide du circuit","ja":"回路の液体"},"t":{"de":"Ob im Heizkreis Wasser oder ein Frostschutzgemisch (Glykol) eingestellt ist.","en":"Whether water or an antifreeze mixture (glycol) is set for the heating circuit.","fr":"Indique si le circuit est réglé sur eau ou sur mélange antigel (glycol).","ja":"暖房回路が水か不凍液（グリコール）のどちらに設定されているかです。"}},{"l":"TOP109","s":"","b":"0/1","n":{"de":"Frostschutz","en":"Anti-freeze","fr":"Antigel","ja":"凍結防止"},"t":{"de":"Laut Panasonic schützt diese Funktion das Wasser vor dem Einfrieren, wenn die Anlage ausgeschaltet ist.","en":"According to Panasonic this function protects the water from freezing when the system is switched off.","fr":"Selon Panasonic, cette fonction protège l'eau du gel lorsque l'installation est arrêtée.","ja":"Panasonic によると、システム停止中に水が凍るのを防ぐ機能です。"}}]},{"id":"energie","titel":{"de":"Leistung und Energie","en":"Power and energy","fr":"Puissance et énergie","ja":"出力とエネルギー"},"e":[{"l":"","s":"","b":"","n":{"de":"Erzeugt und aufgenommen","en":"Produced and consumed","fr":"Produit et absorbé","ja":"生成と消費"},"t":{"de":"„Erzeugt“ ist die Wärme (oder Kälte), die die Wärmepumpe abgibt. „Aufgenommen“ ist der Strom, den sie dafür braucht. Teilt man erzeugt durch aufgenommen, erhält man den COP: 4 bedeutet, aus 1 kW Strom werden 4 kW Wärme.","en":"“Produced” is the heat (or cooling) the heat pump delivers. “Consumed” is the electricity it needs for it. Dividing produced by consumed gives the COP: 4 means 1 kW of electricity becomes 4 kW of heat.","fr":"« Produit » est la chaleur (ou le froid) fournie par la pompe. « Absorbé » est l'électricité nécessaire. Produit divisé par absorbé donne le COP : 4 signifie que 1 kW d'électricité donne 4 kW de chaleur.","ja":"「生成」はヒートポンプが出す熱（または冷熱）、「消費」はそのために使う電気です。生成を消費で割ると COP になり、4 なら 1 kW の電気から 4 kW の熱を作っています。"}},{"l":"TOP15","s":"","b":"W","n":{"de":"Heizen: erzeugte Wärme","en":"Heating: heat produced","fr":"Chauffage : chaleur produite","ja":"暖房：生成熱"},"t":{"de":"Die Heizleistung, die die Wärmepumpe meldet, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP3.","en":"The heating power reported by the heat pump, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP3 instead.","fr":"La puissance de chauffage transmise par la pompe, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP3.","ja":"ヒートポンプが報告する暖房出力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP3 を使います。"}},{"l":"TOP16","s":"","b":"W","n":{"de":"Heizen: aufgenommener Strom","en":"Heating: power consumed","fr":"Chauffage : puissance absorbée","ja":"暖房：消費電力"},"t":{"de":"Der Stromverbrauch beim Heizen laut Wärmepumpe, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP0.","en":"The electricity used for heating according to the heat pump, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP0 instead.","fr":"La consommation électrique en chauffage selon la pompe, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP0.","ja":"ヒートポンプによる暖房時の消費電力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP0 を使います。"}},{"l":"TOP40","s":"","b":"W","n":{"de":"Warmwasser: erzeugte Wärme","en":"Hot water: heat produced","fr":"Eau chaude : chaleur produite","ja":"給湯：生成熱"},"t":{"de":"Die Leistung beim Warmwasserbereiten, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP5.","en":"The power while heating hot water, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP5 instead.","fr":"La puissance pendant la production d'eau chaude, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP5.","ja":"給湯中の出力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP5 を使います。"}},{"l":"TOP41","s":"","b":"W","n":{"de":"Warmwasser: aufgenommener Strom","en":"Hot water: power consumed","fr":"Eau chaude : puissance absorbée","ja":"給湯：消費電力"},"t":{"de":"Der Stromverbrauch beim Warmwasserbereiten, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP2.","en":"The electricity used while heating hot water, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP2 instead.","fr":"La consommation pendant la production d'eau chaude, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP2.","ja":"給湯中の消費電力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP2 を使います。"}},{"l":"TOP38","s":"","b":"W","n":{"de":"Kühlen: erzeugte Kälte","en":"Cooling: cooling produced","fr":"Rafraîchissement : froid produit","ja":"冷房：生成冷熱"},"t":{"de":"Die Kühlleistung, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP4.","en":"The cooling power, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP4 instead.","fr":"La puissance de rafraîchissement, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP4.","ja":"冷房出力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP4 を使います。"}},{"l":"TOP39","s":"","b":"W","n":{"de":"Kühlen: aufgenommener Strom","en":"Cooling: power consumed","fr":"Rafraîchissement : puissance absorbée","ja":"冷房：消費電力"},"t":{"de":"Der Stromverbrauch beim Kühlen, in Schritten von 200 W. Bei Geräten mit genauen Zusatzwerten (K/L-Serie und neuer) ist dieser Wert ungültig, dort gilt XTOP1.","en":"The electricity used for cooling, in steps of 200 W. On units with precise extra values (K/L series and newer) this value is invalid, use XTOP1 instead.","fr":"La consommation en rafraîchissement, par pas de 200 W. Sur les appareils avec valeurs supplémentaires précises (séries K/L et plus récentes), cette valeur n'est pas valable, utilisez XTOP1.","ja":"冷房時の消費電力で、200 W 単位です。 詳細な追加値に対応する機種（K/L シリーズ以降）ではこの値は無効で、XTOP1 を使います。"}},{"l":"XTOP3","s":"","b":"W","n":{"de":"Heizen: erzeugte Wärme (genau)","en":"Heating: heat produced (precise)","fr":"Chauffage : chaleur produite (précis)","ja":"暖房：生成熱（詳細）"},"t":{"de":"Die Heizleistung auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The heating power to the watt. Precise value, only on K/L series and newer units.","fr":"La puissance de chauffage au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"暖房出力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}},{"l":"XTOP0","s":"","b":"W","n":{"de":"Heizen: aufgenommener Strom (genau)","en":"Heating: power consumed (precise)","fr":"Chauffage : puissance absorbée (précis)","ja":"暖房：消費電力（詳細）"},"t":{"de":"Der Stromverbrauch beim Heizen auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The electricity used for heating, to the watt. Precise value, only on K/L series and newer units.","fr":"La consommation en chauffage au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"暖房時の消費電力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}},{"l":"XTOP5","s":"","b":"W","n":{"de":"Warmwasser: erzeugte Wärme (genau)","en":"Hot water: heat produced (precise)","fr":"Eau chaude : chaleur produite (précis)","ja":"給湯：生成熱（詳細）"},"t":{"de":"Die Leistung beim Warmwasserbereiten auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The power while heating hot water, to the watt. Precise value, only on K/L series and newer units.","fr":"La puissance de production d'eau chaude au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"給湯中の出力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}},{"l":"XTOP2","s":"","b":"W","n":{"de":"Warmwasser: aufgenommener Strom (genau)","en":"Hot water: power consumed (precise)","fr":"Eau chaude : puissance absorbée (précis)","ja":"給湯：消費電力（詳細）"},"t":{"de":"Der Stromverbrauch beim Warmwasserbereiten auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The electricity used for hot water, to the watt. Precise value, only on K/L series and newer units.","fr":"La consommation pour l'eau chaude au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"給湯中の消費電力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}},{"l":"XTOP4","s":"","b":"W","n":{"de":"Kühlen: erzeugte Kälte (genau)","en":"Cooling: cooling produced (precise)","fr":"Rafraîchissement : froid produit (précis)","ja":"冷房：生成冷熱（詳細）"},"t":{"de":"Die Kühlleistung auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The cooling power to the watt. Precise value, only on K/L series and newer units.","fr":"La puissance de rafraîchissement au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"冷房出力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}},{"l":"XTOP1","s":"","b":"W","n":{"de":"Kühlen: aufgenommener Strom (genau)","en":"Cooling: power consumed (precise)","fr":"Rafraîchissement : puissance absorbée (précis)","ja":"冷房：消費電力（詳細）"},"t":{"de":"Der Stromverbrauch beim Kühlen auf das Watt genau. Genauer Wert, nur bei Geräten der K/L-Serie und neuer.","en":"The electricity used for cooling, to the watt. Precise value, only on K/L series and newer units.","fr":"La consommation en rafraîchissement au watt près. Valeur précise, uniquement sur les séries K/L et plus récentes.","ja":"冷房時の消費電力を 1 W 単位で示します。 詳細な値で、K/L シリーズ以降の機種のみです。"}}]},{"id":"geraet","titel":{"de":"Störung, Zähler und Gerät","en":"Faults, counters and device","fr":"Défauts, compteurs et appareil","ja":"異常・カウンター・機器"},"e":[{"l":"TOP44","s":"","b":"","n":{"de":"Fehlercode","en":"Error code","fr":"Code d'erreur","ja":"エラーコード"},"t":{"de":"Der letzte Fehler, den die Wärmepumpe gemeldet hat, zum Beispiel H72. Was ein Code bedeutet, steht in der Panasonic-Anleitung oder weiß der Installateur.","en":"The last error reported by the heat pump, for example H72. The Panasonic manual or the installer can tell what a code means.","fr":"La dernière erreur signalée par la pompe, par exemple H72. La signification d'un code figure dans la notice Panasonic ou est connue de l'installateur.","ja":"ヒートポンプが報告した最後のエラー（例：H72）です。コードの意味は Panasonic の説明書か施工業者で確認できます。"}},{"l":"","s":"SetReset","b":"1","n":{"de":"Störung quittieren","en":"Reset fault","fr":"Acquitter le défaut","ja":"異常リセット"},"t":{"de":"Setzt einen anliegenden Fehler zurück, wie die Taste „Reset“ an der Fernbedienung. Laut HeishaMon löscht das auch Fehler, die Aus- und Einschalten nicht löscht. Die Ursache des Fehlers wird dadurch nicht behoben.","en":"Resets an active error, like the “Reset” button on the remote control. According to HeishaMon this also clears errors that switching off and on does not clear. It does not fix the cause of the error.","fr":"Réinitialise une erreur en cours, comme la touche « Reset » de la télécommande. Selon HeishaMon, cela efface aussi les erreurs qu'un arrêt-marche n'efface pas. La cause de l'erreur n'est pas corrigée pour autant.","ja":"リモコンの「リセット」と同じく、発生中のエラーを解除します。HeishaMon によると、入切では消えないエラーも消せます。エラーの原因そのものは直りません。"}},{"l":"TOP11","s":"","b":"h","n":{"de":"Betriebsstunden","en":"Operating hours","fr":"Heures de fonctionnement","ja":"運転時間"},"t":{"de":"Wie viele Stunden die Wärmepumpe insgesamt gelaufen ist.","en":"How many hours the heat pump has run in total.","fr":"Le nombre total d'heures de fonctionnement de la pompe.","ja":"ヒートポンプが運転した合計時間です。"}},{"l":"TOP12","s":"","b":"","n":{"de":"Starts","en":"Starts","fr":"Démarrages","ja":"起動回数"},"t":{"de":"Wie oft die Wärmepumpe insgesamt gestartet ist. Sehr viele Starts im Verhältnis zu den Betriebsstunden können ein Hinweis auf häufiges An- und Ausschalten sein.","en":"How many times the heat pump has started in total. Very many starts compared with the operating hours can indicate frequent on/off switching.","fr":"Le nombre total de démarrages de la pompe. Beaucoup de démarrages par rapport aux heures peuvent indiquer des marches/arrêts fréquents.","ja":"ヒートポンプが起動した合計回数です。運転時間に比べて起動がとても多い場合、入切が頻繁なことを示している可能性があります。"}},{"l":"TOP92","s":"","b":"","n":{"de":"Gerätemodell","en":"Device model","fr":"Modèle de l'appareil","ja":"機種"},"t":{"de":"Das Modell der Wärmepumpe, wie HeishaMon es erkennt.","en":"The heat pump model as detected by HeishaMon.","fr":"Le modèle de pompe à chaleur reconnu par HeishaMon.","ja":"HeishaMon が認識したヒートポンプの機種です。"}}]},{"id":"extern","titel":{"de":"Externe Steuerung und Fühler","en":"External control and sensors","fr":"Commande externe et sondes","ja":"外部制御とセンサー"},"e":[{"l":"TOP108","s":"SetAltExternalSensor","b":"0/1","n":{"de":"Externer Außenfühler","en":"External outdoor sensor","fr":"Sonde extérieure externe","ja":"外部外気センサー"},"t":{"de":"Ob statt des Fühlers im Außengerät ein separat montierter Außenfühler verwendet wird.","en":"Whether a separately mounted outdoor sensor is used instead of the sensor in the outdoor unit.","fr":"Indique si une sonde extérieure montée séparément remplace celle de l'unité extérieure.","ja":"室外機のセンサーの代わりに、別に取り付けた外気センサーを使うかどうかです。"}},{"l":"TOP119","s":"SetExternalControl","b":"0/1","n":{"de":"Externer Schalteingang","en":"External switch input","fr":"Entrée commutateur externe","ja":"外部スイッチ入力"},"t":{"de":"Ob der Eingang für einen externen Schalter an der Wärmepumpe aktiviert ist. Was ein Signal dort genau bewirkt, beschreiben HeishaMon und Panasonic nicht.","en":"Whether the input for an external switch on the heat pump is enabled. HeishaMon and Panasonic do not describe exactly what a signal there does.","fr":"Indique si l'entrée pour un commutateur externe est activée. HeishaMon et Panasonic ne décrivent pas précisément l'effet d'un signal.","ja":"ヒートポンプの外部スイッチ用入力が有効かどうかです。そこへの信号が何をするかは HeishaMon も Panasonic も詳しく書いていません。"}},{"l":"TOP121","s":"SetExternalError","b":"0/1","n":{"de":"Externes Fehlersignal","en":"External error signal","fr":"Signal d'erreur externe","ja":"外部エラー信号"},"t":{"de":"Ob die Wärmepumpe ein Fehlersignal von außen auswertet. Genaueres beschreibt die Doku nicht.","en":"Whether the heat pump evaluates an error signal from outside. The documentation gives no further detail.","fr":"Indique si la pompe prend en compte un signal d'erreur externe. La documentation n'en dit pas plus.","ja":"外部からのエラー信号を使うかどうかです。詳しい説明はありません。"}},{"l":"TOP120","s":"SetExternalHeatCoolControl","b":"0/1","n":{"de":"Externer Heizen/Kühlen-Schalter","en":"External heat/cool switch","fr":"Commutateur chaud/froid externe","ja":"外部 暖房/冷房スイッチ"},"t":{"de":"Ob ein externer Schalter zwischen Heizen und Kühlen umschalten darf. Laut HeishaMon eine Einstellung der Optional-Platine.","en":"Whether an external switch may change between heating and cooling. According to HeishaMon a setting of the optional board.","fr":"Indique si un commutateur externe peut passer du chauffage au rafraîchissement. Selon HeishaMon, un réglage de la carte optionnelle.","ja":"外部スイッチで暖房と冷房を切り替えられるかどうかです。HeishaMon によるとオプション基板の設定です。"}},{"l":"TOP122","s":"SetExternalCompressorControl","b":"0/1","n":{"de":"Externe Verdichtersteuerung","en":"External compressor control","fr":"Commande externe du compresseur","ja":"外部圧縮機制御"},"t":{"de":"Ob der Verdichter von außen freigegeben oder gesperrt werden darf. Laut HeishaMon eine Einstellung der Optional-Platine.","en":"Whether the compressor may be allowed or blocked from outside. According to HeishaMon a setting of the optional board.","fr":"Indique si le compresseur peut être autorisé ou bloqué de l'extérieur. Selon HeishaMon, un réglage de la carte optionnelle.","ja":"外部から圧縮機を許可・禁止できるかどうかです。HeishaMon によるとオプション基板の設定です。"}},{"l":"TOP110","s":"","b":"0/1","n":{"de":"Optional-Platine aktiv","en":"Optional board enabled","fr":"Carte optionnelle active","ja":"オプション基板有効"},"t":{"de":"Ob in der Wärmepumpe die Optional-Platine eingeschaltet ist. Diese Zusatzplatine bietet weitere Anschlüsse, etwa für SG Ready, Pool oder Solar.","en":"Whether the optional board is enabled in the heat pump. This extra board provides more connections, for example for SG Ready, pool or solar.","fr":"Indique si la carte optionnelle est activée. Cette carte supplémentaire offre d'autres raccordements, par exemple SG Ready, piscine ou solaire.","ja":"ヒートポンプでオプション基板が有効かどうかです。SG Ready、プール、太陽熱などの追加接続ができる基板です。"}}]},{"id":"optional","titel":{"de":"Optional-Platine","en":"Optional board","fr":"Carte optionnelle","ja":"オプション基板"},"e":[{"l":"","s":"","b":"","n":{"de":"Was ist die Nachbildung?","en":"What is the emulation?","fr":"Qu'est-ce que l'émulation ?","ja":"エミュレーションとは"},"t":{"de":"HeishaMon kann so tun, als wäre die Panasonic-Optional-Platine eingebaut. Dann lassen sich SG Ready, Leistungsbegrenzung und Fühlerwerte von Home Assistant aus senden, ohne die Platine zu kaufen. Die Werte unten gibt es nur mit eingeschalteter Nachbildung.","en":"HeishaMon can pretend that the Panasonic optional board is installed. SG Ready, power limiting and sensor values can then be sent from Home Assistant without buying the board. The values below only exist with emulation enabled.","fr":"HeishaMon peut faire comme si la carte optionnelle Panasonic était installée. On peut alors envoyer SG Ready, la limitation de puissance et des valeurs de sondes depuis Home Assistant sans acheter la carte. Les valeurs ci-dessous n'existent qu'avec l'émulation activée.","ja":"HeishaMon は Panasonic のオプション基板が付いているかのように動作できます。基板を買わなくても、Home Assistant から SG Ready、出力制限、センサー値を送れます。以下の値はエミュレーションを有効にした場合だけあります。"}},{"l":"","s":"SetSmartGridMode","b":"0 … 3","n":{"de":"SG Ready","en":"SG Ready","fr":"SG Ready","ja":"SG Ready"},"t":{"de":"Ein Signal, mit dem z. B. der Energieversorger oder die eigene PV-Anlage die Wärmepumpe beeinflusst. 0 = normal, 1 = Leistungsstufe 1, 2 = Wärmepumpe und Warmwasser aus, 3 = Leistungsstufe 2. Wie stark die Leistungsstufen wirken, stellt der Installateur in der Wärmepumpe ein.","en":"A signal with which, for example, the energy supplier or your own solar system influences the heat pump. 0 = normal, 1 = capacity level 1, 2 = heat pump and hot water off, 3 = capacity level 2. How strongly the levels act is set by the installer in the heat pump.","fr":"Un signal par lequel, par exemple, le fournisseur d'énergie ou votre installation solaire agit sur la pompe. 0 = normal, 1 = niveau de puissance 1, 2 = pompe et eau chaude arrêtées, 3 = niveau de puissance 2. L'effet des niveaux est réglé par l'installateur.","ja":"電力会社や自宅の太陽光発電などがヒートポンプに影響を与えるための信号です。0 = 通常、1 = 能力レベル 1、2 = ヒートポンプと給湯を停止、3 = 能力レベル 2。各レベルの強さは施工業者がヒートポンプで設定します。"}},{"l":"","s":"SetDemandControl","b":"43 … 234","n":{"de":"Leistungsbegrenzung (Demand Control)","en":"Power limit (demand control)","fr":"Limitation de puissance (demand control)","ja":"出力制限（デマンド制御）"},"t":{"de":"Begrenzt die Leistung der Wärmepumpe. 43 entspricht etwa 5 %, 234 entspricht 100 %.","en":"Limits the heat pump's power. 43 corresponds to about 5 %, 234 to 100 %.","fr":"Limite la puissance de la pompe. 43 correspond à environ 5 %, 234 à 100 %.","ja":"ヒートポンプの出力を制限します。43 が約 5 %、234 が 100 % です。"}},{"l":"","s":"SetHeatCoolMode","b":"0/1","n":{"de":"Schalter Heizen/Kühlen","en":"Heat/cool switch","fr":"Commutateur chaud/froid","ja":"暖房/冷房スイッチ"},"t":{"de":"Simuliert den Schalteingang Heizen/Kühlen der Optional-Platine.","en":"Simulates the heat/cool switch input of the optional board.","fr":"Simule l'entrée chaud/froid de la carte optionnelle.","ja":"オプション基板の暖房/冷房切替入力を模擬します。"}},{"l":"","s":"SetCompressorState","b":"0/1","n":{"de":"Schalter Verdichter","en":"Compressor switch","fr":"Commutateur compresseur","ja":"圧縮機スイッチ"},"t":{"de":"Simuliert den Schalteingang für den Verdichter der Optional-Platine.","en":"Simulates the compressor switch input of the optional board.","fr":"Simule l'entrée compresseur de la carte optionnelle.","ja":"オプション基板の圧縮機用入力を模擬します。"}},{"l":"","s":"SetExternalThermostat1State","b":"0 … 3","n":{"de":"Thermostat 1","en":"Thermostat 1","fr":"Thermostat 1","ja":"サーモスタット 1"},"t":{"de":"Meldet, was ein externer Raumthermostat anfordert: 0 = nichts, 1 = Kühlen, 2 = Heizen, 3 = beides. Laut HeishaMon nur H- und J-Serie.","en":"Reports what an external room thermostat requests: 0 = nothing, 1 = cooling, 2 = heating, 3 = both. According to HeishaMon H and J series only.","fr":"Indique ce que demande un thermostat d'ambiance externe : 0 = rien, 1 = froid, 2 = chaud, 3 = les deux. Selon HeishaMon, séries H et J uniquement.","ja":"外部ルームサーモスタットの要求を伝えます：0 = なし、1 = 冷房、2 = 暖房、3 = 両方。HeishaMon によると H・J シリーズのみです。"}},{"l":"","s":"SetExternalThermostat2State","b":"0 … 3","n":{"de":"Thermostat 2","en":"Thermostat 2","fr":"Thermostat 2","ja":"サーモスタット 2"},"t":{"de":"Wie Thermostat 1, für den zweiten Raumthermostaten: 0 = nichts, 1 = Kühlen, 2 = Heizen, 3 = beides.","en":"Like thermostat 1, for the second room thermostat: 0 = nothing, 1 = cooling, 2 = heating, 3 = both.","fr":"Comme le thermostat 1, pour le second thermostat : 0 = rien, 1 = froid, 2 = chaud, 3 = les deux.","ja":"サーモスタット 1 と同じく、2 台目のサーモスタット用です：0 = なし、1 = 冷房、2 = 暖房、3 = 両方。"}},{"l":"","s":"SetZ1RoomTemp","b":"−78 … 120 °C","n":{"de":"Raumtemperatur Zone 1 senden","en":"Send zone 1 room temperature","fr":"Envoyer la température zone 1","ja":"ゾーン 1 室温を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine. Laut HeishaMon nur H- und J-Serie.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board. According to HeishaMon H and J series only.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle. Selon HeishaMon, séries H et J uniquement.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。 HeishaMon によると H・J シリーズのみです。"}},{"l":"","s":"SetZ2RoomTemp","b":"−78 … 120 °C","n":{"de":"Raumtemperatur Zone 2 senden","en":"Send zone 2 room temperature","fr":"Envoyer la température zone 2","ja":"ゾーン 2 室温を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。"}},{"l":"","s":"SetZ1WaterTemp","b":"−78 … 120 °C","n":{"de":"Wassertemperatur Zone 1 senden","en":"Send zone 1 water temperature","fr":"Envoyer l'eau zone 1","ja":"ゾーン 1 水温を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。"}},{"l":"","s":"SetZ2WaterTemp","b":"−78 … 120 °C","n":{"de":"Wassertemperatur Zone 2 senden","en":"Send zone 2 water temperature","fr":"Envoyer l'eau zone 2","ja":"ゾーン 2 水温を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。"}},{"l":"","s":"SetBufferTemp","b":"−78 … 120 °C","n":{"de":"Puffertemperatur senden","en":"Send buffer temperature","fr":"Envoyer la température du tampon","ja":"バッファー温度を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine. Laut HeishaMon nur H- und J-Serie.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board. According to HeishaMon H and J series only.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle. Selon HeishaMon, séries H et J uniquement.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。 HeishaMon によると H・J シリーズのみです。"}},{"l":"","s":"SetPoolTemp","b":"−78 … 120 °C","n":{"de":"Pooltemperatur senden","en":"Send pool temperature","fr":"Envoyer la température piscine","ja":"プール温度を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。"}},{"l":"","s":"SetSolarTemp","b":"−78 … 120 °C","n":{"de":"Solartemperatur senden","en":"Send solar temperature","fr":"Envoyer la température solaire","ja":"太陽熱温度を送る"},"t":{"de":"Schickt der Wärmepumpe einen Temperaturwert, als käme er von einem Fühler an der Optional-Platine.","en":"Sends a temperature value to the heat pump as if it came from a sensor on the optional board.","fr":"Envoie une température à la pompe comme si elle venait d'une sonde de la carte optionnelle.","ja":"オプション基板のセンサーから来たかのように、温度の値をヒートポンプへ送ります。"}},{"l":"","s":"SetOptPCBByte9","b":"","n":{"de":"Optional-Platine Byte 9","en":"Optional board byte 9","fr":"Carte optionnelle octet 9","ja":"オプション基板 バイト 9"},"t":{"de":"Schreibt ein einzelnes Byte der Optional-Platine. Wofür es dient, ist in der HeishaMon-Doku nicht bekannt. Nicht verwenden, wenn man es nicht genau weiß.","en":"Writes a single byte of the optional board. Its purpose is unknown in the HeishaMon documentation. Do not use unless you know exactly what it does.","fr":"Écrit un octet de la carte optionnelle. Son rôle est inconnu dans la documentation HeishaMon. À ne pas utiliser sans savoir exactement ce qu'il fait.","ja":"オプション基板の 1 バイトを書き込みます。用途は HeishaMon の説明書でも不明です。よく分からない場合は使わないでください。"}},{"l":"OPT0","s":"","b":"0/1","n":{"de":"Anforderung Pumpe Zone 1","en":"Request: zone 1 pump","fr":"Demande : pompe zone 1","ja":"要求：ゾーン 1 ポンプ"},"t":{"de":"Die Wärmepumpe möchte, dass die Pumpe von Zone 1 läuft (0 = aus, 1 = ein). Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump wants the zone 1 pump to run (0 = off, 1 = on). Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe souhaite que la pompe de la zone 1 fonctionne (0 = arrêt, 1 = marche). Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプがゾーン 1 のポンプの運転を求めています（0 = 停止、1 = 運転）。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT1","s":"","b":"0 … 2","n":{"de":"Anforderung Mischventil Zone 1","en":"Request: zone 1 mixing valve","fr":"Demande : vanne mélangeuse zone 1","ja":"要求：ゾーン 1 混合弁"},"t":{"de":"Die Wärmepumpe möchte das Mischventil von Zone 1 bewegen: 0 = nicht, 1 = kühler, 2 = wärmer. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump wants to move the zone 1 mixing valve: 0 = no, 1 = cooler, 2 = warmer. Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe souhaite déplacer la vanne mélangeuse de la zone 1 : 0 = non, 1 = plus froid, 2 = plus chaud. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプがゾーン 1 の混合弁を動かしたいとき：0 = なし、1 = 低く、2 = 高く。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT2","s":"","b":"0/1","n":{"de":"Anforderung Pumpe Zone 2","en":"Request: zone 2 pump","fr":"Demande : pompe zone 2","ja":"要求：ゾーン 2 ポンプ"},"t":{"de":"Die Wärmepumpe möchte, dass die Pumpe von Zone 2 läuft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump wants the zone 2 pump to run. Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe souhaite que la pompe de la zone 2 fonctionne. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプがゾーン 2 のポンプの運転を求めています。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT3","s":"","b":"0 … 2","n":{"de":"Anforderung Mischventil Zone 2","en":"Request: zone 2 mixing valve","fr":"Demande : vanne mélangeuse zone 2","ja":"要求：ゾーン 2 混合弁"},"t":{"de":"Wie bei Zone 1: 0 = nicht, 1 = kühler, 2 = wärmer. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"As for zone 1: 0 = no, 1 = cooler, 2 = warmer. Only visible if optional board emulation is enabled in HeishaMon.","fr":"Comme pour la zone 1 : 0 = non, 1 = plus froid, 2 = plus chaud. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ゾーン 1 と同じく、0 = なし、1 = 低く、2 = 高く。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT4","s":"","b":"0/1","n":{"de":"Anforderung Poolpumpe","en":"Request: pool pump","fr":"Demande : pompe piscine","ja":"要求：プールポンプ"},"t":{"de":"Die Wärmepumpe möchte, dass die Poolpumpe läuft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump wants the pool pump to run. Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe souhaite que la pompe de piscine fonctionne. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプがプールポンプの運転を求めています。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT5","s":"","b":"0/1","n":{"de":"Anforderung Solarpumpe","en":"Request: solar pump","fr":"Demande : pompe solaire","ja":"要求：太陽熱ポンプ"},"t":{"de":"Die Wärmepumpe möchte, dass die Solarpumpe läuft. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump wants the solar pump to run. Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe souhaite que la pompe solaire fonctionne. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプが太陽熱ポンプの運転を求めています。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}},{"l":"OPT6","s":"","b":"0/1","n":{"de":"Alarm","en":"Alarm","fr":"Alarme","ja":"アラーム"},"t":{"de":"Die Wärmepumpe meldet einen Alarm an die Optional-Platine. Nur sichtbar, wenn in HeishaMon die Nachbildung der Optional-Platine eingeschaltet ist.","en":"The heat pump reports an alarm to the optional board. Only visible if optional board emulation is enabled in HeishaMon.","fr":"La pompe signale une alarme à la carte optionnelle. Visible uniquement si l'émulation de la carte optionnelle est activée dans HeishaMon.","ja":"ヒートポンプがオプション基板へアラームを伝えています。 HeishaMon でオプション基板のエミュレーションを有効にしている場合のみ表示されます。"}}]},{"id":"zusatz","titel":{"de":"HeishaMon-Zusätze","en":"HeishaMon extras","fr":"Compléments HeishaMon","ja":"HeishaMon の追加機能"},"e":[{"l":"1-Wire","s":"","b":"°C","n":{"de":"Zusätzliche Temperaturfühler (1-Wire)","en":"Extra temperature sensors (1-Wire)","fr":"Sondes de température supplémentaires (1-Wire)","ja":"追加温度センサー（1-Wire）"},"t":{"de":"An die HeishaMon-Platine lassen sich eigene Temperaturfühler vom Typ DS18B20 anschließen, zum Beispiel an Rohren oder in Räumen. Jeder Fühler erscheint als eigener Wert.","en":"Your own DS18B20 temperature sensors can be connected to the HeishaMon board, for example on pipes or in rooms. Each sensor appears as its own value.","fr":"On peut raccorder ses propres sondes DS18B20 à la carte HeishaMon, par exemple sur des tuyaux ou dans des pièces. Chaque sonde apparaît comme une valeur distincte.","ja":"HeishaMon 基板には DS18B20 型の温度センサーを接続できます（配管や部屋など）。センサーごとに別の値として表示されます。"}},{"l":"S0","s":"","b":"W / Wh","n":{"de":"Stromzähler (S0)","en":"Electricity meter (S0)","fr":"Compteur électrique (S0)","ja":"電力量計（S0）"},"t":{"de":"An zwei Anschlüssen der HeishaMon-Platine kann je ein Stromzähler mit S0-Impulsausgang angeschlossen werden. Gemeldet werden die aktuelle Leistung in Watt und der Verbrauch in Wattstunden.","en":"One electricity meter with S0 pulse output can be connected to each of two inputs on the HeishaMon board. The current power in watts and the consumption in watt-hours are reported.","fr":"Deux entrées de la carte HeishaMon acceptent chacune un compteur à sortie d'impulsions S0. La puissance actuelle en watts et la consommation en wattheures sont transmises.","ja":"HeishaMon 基板の 2 つの入力に、S0 パルス出力付きの電力量計を 1 台ずつ接続できます。現在の電力（W）と使用量（Wh）が報告されます。"}}]},{"id":"opentherm","titel":{"de":"OpenTherm-Thermostat","en":"OpenTherm thermostat","fr":"Thermostat OpenTherm","ja":"OpenTherm サーモスタット"},"e":[{"l":"","s":"","b":"","n":{"de":"Was ist OpenTherm?","en":"What is OpenTherm?","fr":"Qu'est-ce qu'OpenTherm ?","ja":"OpenTherm とは"},"t":{"de":"OpenTherm ist eine Sprache, mit der Raumthermostate mit Heizgeräten sprechen. Hat die HeishaMon-Platine einen OpenTherm-Anschluss, kann dort ein solcher Thermostat angeschlossen werden. „Vom Thermostat“ sind Werte, die der Thermostat liefert. „An den Thermostat“ sind Werte, die man ihm zur Anzeige schickt.","en":"OpenTherm is a language room thermostats use to talk to heating appliances. If the HeishaMon board has an OpenTherm connection, such a thermostat can be connected. “From thermostat” values are supplied by the thermostat. “To thermostat” values are sent to it for display.","fr":"OpenTherm est un langage permettant aux thermostats d'ambiance de dialoguer avec les appareils de chauffage. Si la carte HeishaMon dispose d'une connexion OpenTherm, un tel thermostat peut y être raccordé. Les valeurs « du thermostat » sont fournies par lui ; celles « vers le thermostat » lui sont envoyées pour affichage.","ja":"OpenTherm はルームサーモスタットと暖房機器が通信するための方式です。HeishaMon 基板に OpenTherm 接続があれば、そのようなサーモスタットを接続できます。「サーモスタットから」はサーモスタットが送る値、「サーモスタットへ」は表示用に送る値です。"}},{"l":"OT chEnable","s":"","b":"0/1","n":{"de":"Heizung gewünscht","en":"Heating requested","fr":"Chauffage demandé","ja":"暖房要求"},"t":{"de":"Der Thermostat möchte, dass geheizt wird.","en":"The thermostat wants heating.","fr":"Le thermostat demande du chauffage.","ja":"サーモスタットが暖房を求めています。"}},{"l":"OT dhwEnable","s":"","b":"0/1","n":{"de":"Warmwasser gewünscht","en":"Hot water requested","fr":"Eau chaude demandée","ja":"給湯要求"},"t":{"de":"Der Thermostat erlaubt das Warmwasserbereiten, etwa nicht im Urlaub.","en":"The thermostat allows hot water heating, for example not during holidays.","fr":"Le thermostat autorise la production d'eau chaude, par exemple pas pendant les vacances.","ja":"サーモスタットが給湯を許可しています（休暇中は許可しない、など）。"}},{"l":"OT coolingEnable","s":"","b":"0/1","n":{"de":"Kühlen gewünscht","en":"Cooling requested","fr":"Rafraîchissement demandé","ja":"冷房要求"},"t":{"de":"Der Thermostat möchte, dass gekühlt wird.","en":"The thermostat wants cooling.","fr":"Le thermostat demande du rafraîchissement.","ja":"サーモスタットが冷房を求めています。"}},{"l":"OT roomTemp","s":"","b":"°C","n":{"de":"Raumtemperatur","en":"Room temperature","fr":"Température ambiante","ja":"室温"},"t":{"de":"Die vom Thermostat gemessene Raumtemperatur.","en":"The room temperature measured by the thermostat.","fr":"La température mesurée par le thermostat.","ja":"サーモスタットが測った室温です。"}},{"l":"OT roomTempSet","s":"","b":"°C","n":{"de":"Raum-Solltemperatur","en":"Room setpoint","fr":"Consigne ambiante","ja":"室温設定"},"t":{"de":"Die am Thermostat eingestellte Wunschtemperatur für den Raum.","en":"The desired room temperature set on the thermostat.","fr":"La température souhaitée réglée sur le thermostat.","ja":"サーモスタットで設定した希望室温です。"}},{"l":"OT chSetpoint","s":"","b":"°C","n":{"de":"Vom Thermostat berechnete Wassertemperatur","en":"Water temperature from thermostat","fr":"Température d'eau du thermostat","ja":"サーモスタット算出水温"},"t":{"de":"Die Wassertemperatur, die der Thermostat für nötig hält, damit der Raum warm wird, ohne zu überheizen.","en":"The water temperature the thermostat thinks is needed to warm the room without overheating.","fr":"La température d'eau que le thermostat juge nécessaire pour chauffer la pièce sans dépasser.","ja":"部屋を暖めすぎずに暖めるためにサーモスタットが必要とする水温です。"}},{"l":"OT maxRelativeModulation","s":"","b":"0 … 100 %","n":{"de":"Erlaubte Leistung","en":"Allowed power","fr":"Puissance autorisée","ja":"許容出力"},"t":{"de":"Wie viel Prozent ihrer Leistung die Wärmepumpe laut Thermostat höchstens nutzen darf.","en":"The maximum percentage of its power the heat pump may use according to the thermostat.","fr":"Le pourcentage maximal de puissance que la pompe peut utiliser selon le thermostat.","ja":"サーモスタットが許すヒートポンプの最大出力（%）です。"}},{"l":"OT coolingControl","s":"","b":"0 … 100 %","n":{"de":"Gewünschte Kühlleistung","en":"Requested cooling","fr":"Froid demandé","ja":"冷房要求量"},"t":{"de":"Wie viel Kühlung der Thermostat anfordert, in Prozent.","en":"How much cooling the thermostat requests, in percent.","fr":"La quantité de froid demandée par le thermostat, en pourcentage.","ja":"サーモスタットが求める冷房の量（%）です。"}},{"l":"OT dhwSetpoint","s":"OT dhwSetpoint","b":"°C","n":{"de":"Warmwasser-Sollwert","en":"Hot water setpoint","fr":"Consigne d'eau chaude","ja":"給湯設定温度"},"t":{"de":"Die Warmwasser-Wunschtemperatur am Thermostat. Kann auch von HeishaMon gesetzt werden, das unterstützen aber nicht alle Thermostate.","en":"The desired hot water temperature on the thermostat. Can also be set by HeishaMon, but not all thermostats support this.","fr":"La température d'eau chaude souhaitée sur le thermostat. Peut aussi être réglée par HeishaMon, mais pas tous les thermostats le permettent.","ja":"サーモスタットの給湯の希望温度です。HeishaMon から設定することもできますが、対応しないサーモスタットもあります。"}},{"l":"OT maxTSet","s":"OT maxTSet","b":"°C","n":{"de":"Höchste Wassertemperatur","en":"Maximum water temperature","fr":"Température d'eau maximale","ja":"最高水温"},"t":{"de":"Die höchste Wassertemperatur, die der Thermostat anfordern darf.","en":"The highest water temperature the thermostat may request.","fr":"La température d'eau la plus haute que le thermostat peut demander.","ja":"サーモスタットが要求できる最高の水温です。"}},{"l":"","s":"OT chPressure","b":"bar","n":{"de":"Wasserdruck an Thermostat","en":"Water pressure to thermostat","fr":"Pression vers le thermostat","ja":"水圧（サーモスタットへ）"},"t":{"de":"Der Wasserdruck der Heizung, zur Anzeige am Thermostat.","en":"The heating water pressure, for display on the thermostat.","fr":"La pression d'eau du chauffage, pour affichage sur le thermostat.","ja":"サーモスタットに表示するための暖房の水圧です。"}},{"l":"","s":"OT outsideTemp","b":"°C","n":{"de":"Außentemperatur an Thermostat","en":"Outdoor temperature to thermostat","fr":"Température extérieure vers le thermostat","ja":"外気温（サーモスタットへ）"},"t":{"de":"Die Außentemperatur, zur Anzeige am Thermostat.","en":"The outdoor temperature, for display on the thermostat.","fr":"La température extérieure, pour affichage sur le thermostat.","ja":"サーモスタットに表示するための外気温です。"}},{"l":"","s":"OT inletTemp","b":"°C","n":{"de":"Rücklauf an Thermostat","en":"Return to thermostat","fr":"Retour vers le thermostat","ja":"戻り温度（サーモスタットへ）"},"t":{"de":"Die Rücklauftemperatur, zur Anzeige am Thermostat.","en":"The return temperature, for display on the thermostat.","fr":"La température de retour, pour affichage sur le thermostat.","ja":"サーモスタットに表示するための戻り温度です。"}},{"l":"","s":"OT outletTemp","b":"°C","n":{"de":"Vorlauf an Thermostat","en":"Flow to thermostat","fr":"Départ vers le thermostat","ja":"往き温度（サーモスタットへ）"},"t":{"de":"Die Vorlauftemperatur, zur Anzeige am Thermostat.","en":"The flow temperature, for display on the thermostat.","fr":"La température de départ, pour affichage sur le thermostat.","ja":"サーモスタットに表示するための往き温度です。"}},{"l":"","s":"OT dhwTemp","b":"°C","n":{"de":"Warmwasser an Thermostat","en":"Hot water to thermostat","fr":"Eau chaude vers le thermostat","ja":"給湯温度（サーモスタットへ）"},"t":{"de":"Die Warmwassertemperatur, zur Anzeige am Thermostat.","en":"The hot water temperature, for display on the thermostat.","fr":"La température de l'eau chaude, pour affichage sur le thermostat.","ja":"サーモスタットに表示するための給湯温度です。"}},{"l":"","s":"OT relativeModulation","b":"0 … 100 %","n":{"de":"Aktuelle Leistung an Thermostat","en":"Current power to thermostat","fr":"Puissance actuelle vers le thermostat","ja":"現在の出力（サーモスタットへ）"},"t":{"de":"Mit wie viel Prozent Leistung die Wärmepumpe gerade läuft. Sollte nicht über der erlaubten Leistung liegen.","en":"At what percentage of power the heat pump is currently running. Should not exceed the allowed power.","fr":"Le pourcentage de puissance actuel de la pompe. Ne doit pas dépasser la puissance autorisée.","ja":"ヒートポンプが今何 % の出力で動いているかです。許容出力を超えないようにします。"}},{"l":"","s":"OT flameState","b":"0/1","n":{"de":"„Brenner an“ an Thermostat","en":"“Burner on” to thermostat","fr":"« Brûleur allumé » vers le thermostat","ja":"「燃焼中」（サーモスタットへ）"},"t":{"de":"Teilt dem Thermostat mit, dass gerade Wärme erzeugt wird. Der Name stammt von Gaskesseln.","en":"Tells the thermostat that heat is currently being produced. The name comes from gas boilers.","fr":"Indique au thermostat que de la chaleur est produite. Le nom vient des chaudières à gaz.","ja":"今熱を作っていることをサーモスタットに伝えます。名前はガスボイラーに由来します。"}},{"l":"","s":"OT chState","b":"0/1","n":{"de":"Heizbetrieb an Thermostat","en":"Heating active to thermostat","fr":"Chauffage actif vers le thermostat","ja":"暖房中（サーモスタットへ）"},"t":{"de":"Teilt dem Thermostat mit, dass gerade die Räume beheizt werden.","en":"Tells the thermostat that the rooms are currently being heated.","fr":"Indique au thermostat que les pièces sont chauffées.","ja":"今部屋を暖房していることをサーモスタットに伝えます。"}},{"l":"","s":"OT dhwState","b":"0/1","n":{"de":"Warmwasserbetrieb an Thermostat","en":"Hot water active to thermostat","fr":"Eau chaude active vers le thermostat","ja":"給湯中（サーモスタットへ）"},"t":{"de":"Teilt dem Thermostat mit, dass gerade Warmwasser bereitet wird.","en":"Tells the thermostat that hot water is currently being heated.","fr":"Indique au thermostat que l'eau chaude est en production.","ja":"今給湯していることをサーモスタットに伝えます。"}},{"l":"","s":"OT coolingState","b":"0/1","n":{"de":"Kühlbetrieb an Thermostat","en":"Cooling active to thermostat","fr":"Rafraîchissement actif vers le thermostat","ja":"冷房中（サーモスタットへ）"},"t":{"de":"Teilt dem Thermostat mit, dass gerade gekühlt wird.","en":"Tells the thermostat that cooling is currently running.","fr":"Indique au thermostat que le rafraîchissement est en cours.","ja":"今冷房していることをサーモスタットに伝えます。"}},{"l":"","s":"OT dhwSetUppBound","b":"0 … 127","n":{"de":"Warmwasser: Obergrenze","en":"Hot water: upper limit","fr":"Eau chaude : limite haute","ja":"給湯：上限"},"t":{"de":"Höchste Warmwassertemperatur, die der Thermostat einstellen darf. Standard: 75.","en":"Highest hot water temperature the thermostat may set. Default: 75.","fr":"Température d'eau chaude maximale que le thermostat peut régler. Par défaut : 75.","ja":"サーモスタットが設定できる最高の給湯温度です。初期値 75。"}},{"l":"","s":"OT dhwSetLowBound","b":"0 … 127","n":{"de":"Warmwasser: Untergrenze","en":"Hot water: lower limit","fr":"Eau chaude : limite basse","ja":"給湯：下限"},"t":{"de":"Niedrigste Warmwassertemperatur, die der Thermostat einstellen darf. Standard: 40.","en":"Lowest hot water temperature the thermostat may set. Default: 40.","fr":"Température d'eau chaude minimale que le thermostat peut régler. Par défaut : 40.","ja":"サーモスタットが設定できる最低の給湯温度です。初期値 40。"}},{"l":"","s":"OT chSetUppBound","b":"0 … 127","n":{"de":"Heizwasser: Obergrenze","en":"Heating water: upper limit","fr":"Eau de chauffage : limite haute","ja":"暖房水：上限"},"t":{"de":"Höchste Heizwassertemperatur, die der Thermostat anfordern darf. Standard: 65.","en":"Highest heating water temperature the thermostat may request. Default: 65.","fr":"Température d'eau de chauffage maximale que le thermostat peut demander. Par défaut : 65.","ja":"サーモスタットが要求できる最高の暖房水温です。初期値 65。"}},{"l":"","s":"OT chSetLowBound","b":"0 … 127","n":{"de":"Heizwasser: Untergrenze","en":"Heating water: lower limit","fr":"Eau de chauffage : limite basse","ja":"暖房水：下限"},"t":{"de":"Niedrigste Heizwassertemperatur, die der Thermostat anfordern darf. Standard: 20.","en":"Lowest heating water temperature the thermostat may request. Default: 20.","fr":"Température d'eau de chauffage minimale que le thermostat peut demander. Par défaut : 20.","ja":"サーモスタットが要求できる最低の暖房水温です。初期値 20。"}}]}];

/**
 * Einstellungen hinter der Tuer der Waermepumpe. Bereiche laut
 * HeishaMon MQTT-Topics.md, gemeldete min, max und step der Entitaet
 * haben Vorrang. Auswahlwerte laut Doku: 0 und 1.
 */
const TUER_FELDER = [
  { abschnitt: "t_betrieb", key: "holiday_mode", schalter: true },
  { abschnitt: "t_betrieb", key: "main_schedule", schalter: true },
  { abschnitt: "t_betrieb", key: "smart_dhw", auswahl: ["o_variabel", "o_standard"] },
  { abschnitt: "t_heizen", key: "heating_off_temp", min: 5, max: 35, step: 1, einheit: "°C" },
  { abschnitt: "t_heizen", key: "heater_on_temp", min: -15, max: 20, step: 1, einheit: "°C" },
  { abschnitt: "t_heizen", key: "heat_delta", min: 1, max: 15, step: 1, einheit: "°C" },
  { abschnitt: "t_heizen", key: "heating_control", auswahl: ["o_komfort", "o_effizienz"] },
  { abschnitt: "t_legionellen", key: "steril_temp", min: 55, max: 75, step: 1, einheit: "°C" },
  { abschnitt: "t_legionellen", key: "steril_time", min: 5, max: 60, step: 5, einheit: "min" },
  { abschnitt: "t_pumpe", key: "pump_flow_mode", auswahl: ["o_spreizung", "o_max_leistung"] },
  { abschnitt: "t_pumpe", key: "pump_max_duty", min: 64, max: 254, step: 1, einheit: "" },
  { abschnitt: "t_leise", key: "quiet_priority", auswahl: ["o_lautstaerke", "o_leistung"] },
  { abschnitt: "t_stoerung", key: "fault_reset", knopf: true },
  { abschnitt: "t_info", key: "operating_hours", info: true, einheit: "h" },
  { abschnitt: "t_info", key: "compressor_starts", info: true, einheit: "" },
  { abschnitt: "t_info", key: "room_heater_hours", info: true, einheit: "h" },
  { abschnitt: "t_info", key: "dhw_heater_hours", info: true, einheit: "h" },
];

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

/* ------------------------------------------------------------------ *
 *  Konfiguration
 * ------------------------------------------------------------------ */
const ENTITY_FIELDS = [
  { key: "outside_temp", label: "Außentemperatur", group: "Außenfühler", hint: "TOP14" },

  { key: "power_state", label: "Wärmepumpe Status, grüne LED", group: "Außengerät", hint: "SetHeatpump oder TOP0" },
  { key: "compressor", label: "Verdichterdrehzahl", group: "Außengerät", hint: "TOP8" },
  { key: "fan1_rpm", label: "Lüfter 1 Drehzahl", group: "Außengerät", hint: "TOP62" },
  { key: "fan2_rpm", label: "Lüfter 2 Drehzahl", group: "Außengerät", hint: "TOP63" },
  { key: "defrost", label: "Abtauung läuft", group: "Außengerät", hint: "TOP26" },
  { key: "error", label: "Fehlercode", group: "Außengerät", hint: "TOP44" },
  { key: "heatpump_state", label: "Betriebszustand", group: "Außengerät", hint: "TOP0" },
  { key: "force_defrost", label: "Abtauen erzwingen", group: "Außengerät", hint: "SetForceDefrost, switch" },
  { key: "powerful_mode", label: "Turbomodus", group: "Außengerät", hint: "SetPowerfulMode, select" },
  { key: "quiet_mode", label: "Leisemodus", group: "Außengerät", hint: "SetQuietMode, select" },
  { key: "power_now", label: "Aktuelle Leistungsaufnahme", group: "Außengerät", hint: "Shelly PM, Watt" },
  { key: "energy_today", label: "Energiezähler", group: "Außengerät", hint: "Shelly PM, kWh" },

  { key: "pv_power", label: "PV Leistung aktuell", group: "SG Ready", hint: "eigene Entität, Watt" },
  { key: "sg_k1", label: "Kontakt K1 Sperre", group: "SG Ready", hint: "Shelly, Relais oder Eingang" },
  { key: "sg_k2", label: "Kontakt K2 Anlauf", group: "SG Ready", hint: "Shelly, Relais oder Eingang" },

  { key: "flow_temp", label: "Vorlauftemperatur", group: "Primärkreis", hint: "TOP6" },
  { key: "return_temp", label: "Rücklauftemperatur", group: "Primärkreis", hint: "TOP5" },
  { key: "pump_speed", label: "Primärpumpe Drehzahl", group: "Primärkreis", hint: "TOP65" },
  { key: "pump_flow", label: "Durchflussmenge", group: "Primärkreis", hint: "TOP1" },
  { key: "three_way_valve", label: "3-Wege-Umschaltventil", group: "Primärkreis", hint: "TOP20" },
  { key: "water_pressure", label: "Wasserdruck", group: "Primärkreis", hint: "TOP115" },
  { key: "heater_internal", label: "Heizstab intern läuft", group: "Primärkreis", hint: "TOP60" },
  { key: "heater_external", label: "Heizstab extern läuft", group: "Primärkreis", hint: "TOP61" },

  { key: "buffer_temp", label: "Puffertemperatur", group: "Heizungspuffer", hint: "TOP46" },
  { key: "buffer_installed", label: "Puffer vorhanden", group: "Heizungspuffer", hint: "TOP99" },
  { key: "buffer_switch", label: "Pufferbetrieb ein und aus", group: "Heizungspuffer", hint: "SetBuffer, switch" },
  { key: "curve_t_high", label: "HK1 Heizkurve Vorlauf oben", group: "Heizkurve", hint: "TOP29" },
  { key: "curve_t_low", label: "HK1 Heizkurve Vorlauf unten", group: "Heizkurve", hint: "TOP30" },
  { key: "curve_o_high", label: "HK1 Heizkurve Außen oben", group: "Heizkurve", hint: "TOP31" },
  { key: "curve_o_low", label: "HK1 Heizkurve Außen unten", group: "Heizkurve", hint: "TOP32" },
  { key: "curve2_t_high", label: "HK2 Heizkurve Vorlauf oben", group: "Heizkurve", hint: "TOP82" },
  { key: "curve2_t_low", label: "HK2 Heizkurve Vorlauf unten", group: "Heizkurve", hint: "TOP83" },
  { key: "curve2_o_high", label: "HK2 Heizkurve Außen oben", group: "Heizkurve", hint: "TOP84" },
  { key: "curve2_o_low", label: "HK2 Heizkurve Außen unten", group: "Heizkurve", hint: "TOP85" },
  { key: "buffer_delta", label: "Puffer Hysterese", group: "Heizungspuffer", hint: "TOP113" },
  { key: "buffer_target", label: "Puffer Zieltemperatur", group: "Heizungspuffer", hint: "TOP7, Soll Vorlauf" },
  { key: "cop_heating", label: "COP Heizen", group: "Heizungspuffer", hint: "HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle wählbar" },
  { key: "room_heater", label: "Heizstab Heizung freigegeben", group: "Heizungspuffer", hint: "TOP59" },
  { key: "room_heater_switch", label: "Heizstab Heizung schalten", group: "Heizungspuffer", hint: "SetRoomHeaterState, switch" },

  { key: "zones_state", label: "Aktivierte Zonen", group: "Heizkreis 1", hint: "TOP94, gilt für beide" },
  { key: "zones_select", label: "Zonen umschalten", group: "Heizkreis 1", hint: "SetZones, gilt für beide" },
  { key: "hk1_water", label: "HK1 Wassertemperatur", group: "Heizkreis 1", hint: "TOP36" },
  { key: "hk1_water_target", label: "HK1 Wasser Sollwert", group: "Heizkreis 1", hint: "TOP42" },
  { key: "hk1_pump", label: "HK1 Pumpe läuft", group: "Heizkreis 1", hint: "TOP124" },
  { key: "hk1_setpoint", label: "HK1 Sollwert einstellbar", group: "Heizkreis 1", hint: "TOP27, number" },
  { key: "hk1_switch", label: "HK1 ein und aus", group: "Heizkreis 1", hint: "eigener Schalter, optional" },

  { key: "hk2_water", label: "HK2 Wassertemperatur", group: "Heizkreis 2", hint: "TOP37" },
  { key: "hk2_water_target", label: "HK2 Wasser Sollwert", group: "Heizkreis 2", hint: "TOP43" },
  { key: "hk2_pump", label: "HK2 Pumpe läuft", group: "Heizkreis 2", hint: "TOP123" },
  { key: "hk2_setpoint", label: "HK2 Sollwert einstellbar", group: "Heizkreis 2", hint: "TOP34, number" },
  { key: "hk2_switch", label: "HK2 ein und aus", group: "Heizkreis 2", hint: "eigener Schalter, optional" },

  { key: "dhw_installed", label: "Warmwasser vorhanden", group: "Warmwasser", hint: "TOP100" },
  { key: "dhw_temp", label: "Warmwasser Isttemperatur", group: "Warmwasser", hint: "TOP10" },
  { key: "dhw_heat_delta", label: "Warmwasser Hysterese", group: "Warmwasser", hint: "TOP22" },
  { key: "dhw_setpoint", label: "Warmwasser Sollwert", group: "Warmwasser", hint: "TOP9, number" },
  { key: "cop_dhw", label: "COP Warmwasser", group: "Warmwasser", hint: "HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle wählbar" },
  { key: "dhw_heater", label: "Heizstab Warmwasser freigegeben", group: "Warmwasser", hint: "TOP58" },
  { key: "dhw_force", label: "Einmalig aufheizen", group: "Warmwasser", hint: "SetForceDHW, switch" },
  { key: "dhw_force_state", label: "Aufheizen läuft", group: "Warmwasser", hint: "TOP2" },
  { key: "force_sterilization", label: "Legionellenschutz starten", group: "Warmwasser", hint: "SetForceSterilization, switch" },
  { key: "sterilization_state", label: "Legionellenschutz läuft", group: "Warmwasser", hint: "TOP69" },
  { key: "dhw_heater_switch", label: "Heizstab Warmwasser schalten", group: "Warmwasser", hint: "SetDHWHeaterState, switch" },
  { key: "circulation_pump", label: "Zirkulationspumpe läuft", group: "Warmwasser", hint: "Shelly oder eigener Schalter" },
  { key: "circ_switch", label: "Zirkulation Schalter (klickbar)", group: "Warmwasser", hint: "Switch zum Ein/Ausschalten der Zirkulation" },

  { key: "mode_select", label: "Betriebsart umschalten", group: "Steuerung", hint: "SetOperationMode, select" },

  { key: "heating_off_temp", label: "Heizen aus ab Außentemperatur", group: "Erweiterte Einstellungen", hint: "TOP77, number" },
  { key: "heater_on_temp", label: "Heizstab ein unter Außentemperatur", group: "Erweiterte Einstellungen", hint: "TOP78, number" },
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
  { key: "fault_reset", label: "Störung quittieren", group: "Erweiterte Einstellungen", hint: "SetReset, button" },
  { key: "operating_hours", label: "Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP11" },
  { key: "compressor_starts", label: "Verdichterstarts", group: "Erweiterte Einstellungen", hint: "TOP12" },
  { key: "room_heater_hours", label: "Heizstab Heizen Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP90" },
  { key: "dhw_heater_hours", label: "Heizstab Warmwasser Betriebsstunden", group: "Erweiterte Einstellungen", hint: "TOP91" },
];

const DEFAULT_CONFIG = {
  type: "custom:heatpump-flow-card-by-lutarym",
  fan_count: 2,
  hk_count: 2,
  layout: "quer",
  card_width: 0,
  pipe_inner_mm: 0,
  mqtt_prefix: "panasonic_heat_pump",
  profil: "heishamon_lutarym",
  language: "auto",
  show_history: true,
  show_target: true,
  show_reload: true,
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
  entities: {},
};

/* ------------------------------------------------------------------ *
 *  Karte
 * ------------------------------------------------------------------ */
class LutarymHeatpumpCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._built = false;
    this._config = null;
    this._hass = null;
    this._auto = null;
    this._dragging = null;

    // Animation Engine (GData-kompatibel)
    this._animLoop = null;
    this._animTime = 0;
    this._animState = new Map();
  }

  disconnectedCallback() {
    if (this._animLoop) cancelAnimationFrame(this._animLoop);
    this._animLoop = null;
  }

  /**
   * Home Assistant haengt die Karte beim Speichern der Konfiguration
   * kurz ab und wieder an. Ohne diesen Rueckruf bliebe die im
   * disconnectedCallback beendete Animation bis zum Neuladen der Seite
   * stehen.
   */
  connectedCallback() {
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
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...(config.entities || {}) },
    };
    this._config.fan_count = this._config.fan_count === 1 ? 1 : 2;
    this._config.hk_count = this._config.hk_count === 1 ? 1 : 2;
    this._built = false;
    this._auto = null;
    if (this._config.demo) this._demoAufbauen();
    else this._demo = null;
    this._tagStart = undefined;
    this._tagStartTag = undefined;
    this._tagVersuch = 0;
    if (this.shadowRoot) this.shadowRoot.innerHTML = "";
    if (this._quelle) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    this._render();
  }

  getCardSize() {
    return 18;
  }

  /** Liefert die gerade gueltige Datenquelle. */
  get _quelle() {
    return this._config && this._config.demo ? this._demo : this._hass;
  }

  /**
   * Baut einen vollstaendigen Satz erfundener Werte auf.
   * Im Demomodus ersetzt er die echten Entitaeten restlos. Es wird
   * nichts an die Waermepumpe gesendet, alle Bedienschritte aendern
   * nur diese Nachbildung.
   */
  _demoAufbauen() {
    const werte = {
      outside_temp: 8.5, heatpump_state: 1, compressor: 42,
      fan1_rpm: 640, fan2_rpm: 620,
      power_now: 1240, energy_today: 8.4,
      flow_temp: 39.2, return_temp: 33.1, pump_speed: 2400, pump_flow: 18.6,
      three_way_valve: 0, water_pressure: 1.8, defrost: 0, error: "0",
      buffer_temp: 38.4, buffer_target: 42, buffer_delta: 5, curve_t_high: 45, curve_t_low: 28, curve_o_high: 15, curve_o_low: -10, curve2_t_high: 38, curve2_t_low: 26, curve2_o_high: 15, curve2_o_low: -10, dhw_heat_delta: -8, room_heater: 0, buffer_installed: 1,
      hk1_water: 34.2, hk1_water_target: 36, hk1_pump: 1,
      hk1_setpoint: 36, hk2_water: 30.1, hk2_water_target: 32,
      hk2_pump: 0, hk2_setpoint: 32, zones_state: 2,
      dhw_temp: 48.3, dhw_setpoint: 50, dhw_heater: 0, dhw_installed: 1,
      dhw_force_state: 0, sterilization_state: 0, circulation_pump: 0, circ_switch: "off", pv_power: 3400,
      sg_k1: "off", sg_k2: "off",
      dhw_force: "off", force_sterilization: "off", force_defrost: "off",
      dhw_heater_switch: "off", room_heater_switch: "off", buffer_switch: "on",
      power_state: "on", hk1_switch: "on", hk2_switch: "off",
      operating_mode: 4,
      cop_heating: 4.3, cop_dhw: 3.1, heater_internal: 0, heater_external: 0,
      operating_hours: 1462, compressor_starts: 2381, room_heater_hours: 3, dhw_heater_hours: 11,
      holiday_mode: "off", main_schedule: "off", fault_reset: "unknown",
      heating_off_temp: 18, heater_on_temp: -8, heat_delta: 5, steril_temp: 65, steril_time: 10, pump_max_duty: 160,
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
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3", "mode_4", "mode_5", "mode_6"] },
    };
    states["demo.powerful_mode"] = {
      state: "mode_0",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] },
    };
    ["heating_control", "pump_flow_mode", "quiet_priority", "smart_dhw"].forEach((feld) => {
      states[`demo.${feld}`] = { state: "mode_0", attributes: { options: ["mode_0", "mode_1"] } };
    });
    states["demo.quiet_mode"] = {
      state: "mode_2",
      attributes: { options: ["mode_0", "mode_1", "mode_2", "mode_3"] },
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
        // Auch ein Befehl aus einem Fenster zieht die Rueckmeldung nach.
        const feld = id.slice(5);
        const paar = DEMO_PAARE[feld];
        if (paar && states[`demo.${paar}`]) {
          const an = states[id].state === "on" || parseFloat(states[id].state) > 0;
          const zielIstSchalter =
            paar.endsWith("_switch") || paar.startsWith("force_") ||
            paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
          states[`demo.${paar}`].state = zielIstSchalter
            ? an ? "on" : "off"
            : an ? "1" : "0";
        }
        karte._render();
      },
    };
  }

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
      const zielIstSchalter = paar.endsWith("_switch") || paar.startsWith("force_") ||
        paar === "power_state" || paar === "dhw_force" || paar === "buffer_switch";
      setze(paar, zielIstSchalter ? (an ? "on" : "off") : an ? 1 : 0);
    }
    this._render();
  }

  /** Liest einen Wert der Nachbildung. */
  _demoLies(feld) {
    if (!this._demo) return null;
    const eintrag = this._demo.states[`demo.${feld}`];
    return eintrag ? eintrag.state : null;
  }

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
  }

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
    const ids = ["cop_heating", "cop_dhw"]
      .map((k) => this._e(k))
      .filter(Boolean);
    if (!ids.length) return;
    const jetzt = Date.now();
    const d = new Date(jetzt);
    const mitternacht = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const schluessel = ids.join("|");
    if (
      this._copTagStart === mitternacht &&
      this._copTagIds === schluessel &&
      this._copTagZeit &&
      jetzt - this._copTagZeit < 300000
    ) return;
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
        no_attributes: true,
      });
      const ergebnis = {};
      ids.forEach((id) => {
        ergebnis[id] = copMittel((antwort && antwort[id]) || [], mitternacht, jetzt);
      });
      this._copTag = ergebnis;
      this._copTagStart = mitternacht;
      this._copTagIds = schluessel;
      this._update();
    } catch (err) {
      // Keine Historie verfuegbar, die Zeile bleibt leer.
    } finally {
      this._copLaeuft = false;
    }
  }

  _e(key) {
    // Im Demomodus zeigen alle Felder auf die Nachbildung.
    if (this._config && this._config.demo) return `demo.${key}`;
    const eintraege = this._config.entities || {};
    // Frueherer Feldname bleibt gueltig, damit bestehende Karten weiterlaufen.
    const alias = { power_state: "power_switch", buffer_temp: "buffer_top" };
    const configured = eintraege[key] || eintraege[alias[key]];
    if (configured) return configured;
    if (!this._auto) this._auto = detectIntegration(this._quelle).entities;
    return this._auto[key] || "";
  }

  /**
   * Holt den Zaehlerstand von heute null Uhr und merkt ihn.
   * Damit laesst sich der Tagesverbrauch aus dem Gesamtzaehler rechnen,
   * ohne dass ein eigener Zaehler-Helfer noetig ist.
   * Schlaegt die Abfrage fehl, bleibt der Gesamtstand stehen.
   */
  async _ladeTagesstart() {
    const id = this._e("energy_today");
    if (!id || !this._quelle || !this._quelle.callWS) return;

    const jetzt = new Date();
    const mitternacht = new Date(
      jetzt.getFullYear(), jetzt.getMonth(), jetzt.getDate()
    ).getTime();

    // Einmal je Tag, danach hoechstens alle fuenf Minuten erneut versuchen.
    if (this._tagStartTag === mitternacht && this._tagStart !== undefined) return;
    if (this._tagVersuch && jetzt.getTime() - this._tagVersuch < 300000) return;
    this._tagVersuch = jetzt.getTime();

    try {
      const antwort = await this._quelle.callWS({
        type: "history/history_during_period",
        start_time: new Date(mitternacht).toISOString(),
        end_time: new Date(mitternacht + 120000).toISOString(),
        entity_ids: [id],
        include_start_time_state: true,
        significant_changes_only: false,
        minimal_response: true,
        no_attributes: true,
      });
      const reihe = antwort && antwort[id];
      if (!reihe || !reihe.length) return;
      // Je nach Fassung heisst das Feld "s" oder "state".
      const roh = reihe[0].s !== undefined ? reihe[0].s : reihe[0].state;
      const wert = parseFloat(roh);
      if (!Number.isNaN(wert)) {
        this._tagStart = wert;
        this._tagStartTag = mitternacht;
        this._render();
      }
    } catch (err) {
      // Keine Historie verfuegbar, es bleibt beim Gesamtstand.
    }
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
      option: `mode_${wert}`,
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
    if (gewaehlt && gewaehlt !== "auto" && SPRACHEN.includes(gewaehlt)) {
      return gewaehlt;
    }
    // Direkt aus Home Assistant, nicht aus der Datenquelle: im
    // Demomodus liefert diese Beispielwerte ohne Sprachangabe.
    const ha = this._hass && this._hass.language;
    const kurz = String(ha || "").slice(0, 2).toLowerCase();
    return SPRACHEN.includes(kurz) ? kurz : "en";
  }

  /**
   * Name einer Baugruppe. Ein eigener Name gewinnt. Leer oder noch der
   * fruehere deutsche Standardname bedeutet: Name in der Kartensprache.
   */
  _name(schluessel) {
    const frueher = {
      label_hk1: "Heizkreis 1", label_hk2: "Heizkreis 2",
      label_dhw: "Warmwasser", label_buffer: "Puffer",
    };
    const eigen = this._config && this._config[schluessel];
    if (eigen && eigen !== frueher[schluessel]) return eigen;
    if (schluessel === "label_hk1") return `${this._t("heizkreis")} 1`;
    if (schluessel === "label_hk2") return `${this._t("heizkreis")} 2`;
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
  }

  _render() {
    // Beim ersten Aufbau ist die Sprache von Home Assistant noch nicht
    // bekannt. Aendert sie sich, wird die Grafik neu erzeugt, denn die
    // Beschriftungen stecken fest im Markup.
    const sprache = this._sp();
    DEZIMAL = dezimalFuer(sprache);
    // Auch ein anderer Pufferstatus verlangt eine neu gezeichnete Anlage.
    const puffer = this._hatPuffer();
    if (this._built && (this._gebautMit !== sprache || this._gebautPuffer !== puffer)) {
      this._built = false;
    }
    if (!this._built) {
      this._build();
      this._built = true;
      this._gebautMit = sprache;
      this._gebautPuffer = puffer;
    }
    this._groesse();
    this._update();
    this._holeVerlauf();
    const kd = this.shadowRoot.getElementById("kurve-dialog");
    if (kd && !kd.dataset.fertig) {
      kd.dataset.fertig = "1";
      kd.addEventListener("click", (ev) => {
        if (ev.target === kd) kd.hidden = true;
      });
      const zu = this.shadowRoot.getElementById("kurve-zu");
      if (zu) zu.addEventListener("click", () => { kd.hidden = true; });
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
      // Feste Hoehe: das Bild passt sich an und bleibt vollstaendig sichtbar.
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
        <button type="button" class="lhc-hilfe-knopf" id="hilfe-knopf"
                title="${escapeHtml(this._t("h_knopf"))}" aria-label="${escapeHtml(this._t("h_knopf"))}">?</button>
        <div class="lhc-hilfe" id="hilfe" hidden>
          <div class="lhc-hilfe-box" role="dialog" aria-modal="true" aria-labelledby="hilfe-titel">
            <div class="lhc-hilfe-kopf">
              <span id="hilfe-titel">${escapeHtml(this._t("h_titel"))}</span>
              <button type="button" class="lhc-dialog-close" id="hilfe-zu"
                      aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
            </div>
            <input type="search" class="lhc-hilfe-suche" id="hilfe-suche"
                   placeholder="${escapeHtml(this._t("h_suche"))}" autocomplete="off">
            <div class="lhc-hilfe-chips" id="hilfe-chips"></div>
            <div class="lhc-hilfe-liste" id="hilfe-liste"></div>
            <div class="lhc-hilfe-fuss"><span id="hilfe-anzahl"></span> · ${escapeHtml(this._t("h_quelle"))}</div>
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
    // Alten Inhalt ersetzen, nicht anhaengen. Sonst entstuende bei
    // jedem Neuaufbau eine zweite Karte im Schattenbaum.
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
    if (!this._elCache) this._elCache = new Map();
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
    let lastTime = performance.now();

    const tick = (time) => {
      if (!this.isConnected) return;

      const deltaTime = (time - lastTime) / 1000; // in Sekunden
      lastTime = time;
      this._animTime += deltaTime;

      const sr = this.shadowRoot;
      if (!sr) {
        this._animLoop = requestAnimationFrame(tick);
        return;
      }

      // Flowdots animieren (stroke-dashoffset)
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "flow") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = this._animTime % 1.2;
        const progress = cycle / 1.2;
        const offset = state.reverse ? 44 * progress : -44 * progress;
        el.setAttribute("stroke-dashoffset", offset.toFixed(1));
      });

      // Bubbles animieren - neu vereinfacht
      const bubbleGroups = ["buf-bubbles", "dhw-bubbles"];
      bubbleGroups.forEach(groupId => {
        const group = this._animEl(groupId);
        if (!group) return;
        // Die Kreise einer Gruppe wechseln nicht, darum einmal merken.
        if (!this._bubbleCache) this._bubbleCache = new Map();
        let bubbles = this._bubbleCache.get(groupId);
        if (!bubbles || !bubbles.length || !bubbles[0].isConnected) {
          bubbles = Array.from(group.querySelectorAll("circle"));
          this._bubbleCache.set(groupId, bubbles);
        }
        bubbles.forEach((bubble, idx) => {
          // Dauer und Versatz haengen nur vom Index ab und aendern sich nie.
          // Darum einmal berechnen und merken, statt bei jedem Bild erneut.
          const dur = bubbleDauer(idx);
          const delay = idx * 0.3;

          // Animation: Zeit seit Start
          const time = (this._animTime + delay) % dur;
          const prog = time / dur;

          // translateY: oben nach unten (-330px)
          const moveY = -330 * prog;

          // opacity: Kurve (sichtbar von 15% bis 85%)
          let op = 0;
          if (prog < 0.15) op = (prog / 0.15) * 0.4;
          else if (prog < 0.85) op = 0.4;
          else op = 0.4 * (1 - (prog - 0.85) / 0.15);

          bubble.setAttribute("transform", `translate(0,${moveY.toFixed(1)})`);
          bubble.setAttribute("opacity", op.toFixed(3));
        });
      });

      // Pulse/Glow animieren (opacity)
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "pulse") return;
        const el = this._animEl(id);
        if (!el) return;
        const cycle = (this._animTime % state.duration) / state.duration;
        const hoch = typeof state.max === "number" ? state.max : 1;
        const tief = typeof state.min === "number" ? state.min : 0.4;
        const spanne = hoch - tief;
        const opacity =
          cycle < 0.5
            ? hoch - (cycle / 0.5) * spanne
            : tief + ((cycle - 0.5) / 0.5) * spanne;
        // Sicherheitshalber begrenzen. Deckkraft ausserhalb 0 bis 1
        // waere ungueltig, falls die Zeitstempel je springen.
        el.setAttribute("opacity", clamp(opacity, 0, 1).toFixed(2));
      });

      // Spin animieren (rotate)
      // Der Winkel laeuft fortlaufend weiter und wird nicht aus der
      // absoluten Zeit berechnet. Sonst springt der Rotor bei jeder
      // Drehzahlaenderung, weil derselbe Zeitpunkt mit neuer Dauer
      // einen ganz anderen Winkel ergibt.
      this._animState.forEach((state, id) => {
        if (!state || state.type !== "spin") return;
        const el = this._animEl(id);
        if (!el) return;
        if (typeof state.winkel !== "number") state.winkel = 0;
        state.winkel = (state.winkel + (deltaTime / state.duration) * 360 + 360) % 360;
        el.setAttribute("transform", `rotate(${state.winkel.toFixed(2)} 0 0)`);
      });

      this._animLoop = requestAnimationFrame(tick);
    };
    this._animLoop = requestAnimationFrame(tick);
  }

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
      ["power_state", "Wärmepumpe"],
      ["hk1_pump", "Pumpe HK1"],
      ["hk2_pump", "Pumpe HK2"],
      ["heater_internal", "Heizstab läuft"],
      ["defrost", "Abtauung"],
      ["circulation_pump", "Zirkulation Status"],
      ["dhw_force_state", "Aufheizen"],
      ["sterilization_state", "Legionellenschutz"],
    ];
    const regler = [
      ["pv_power", "PV Leistung", 0, 12000],
      ["outside_temp", "Außen", -20, 40],
      ["flow_temp", "Vorlauf", 15, 70],
      ["return_temp", "Rücklauf", 15, 70],
      ["buffer_temp", "Puffer", 15, 70],
      ["dhw_temp", "Warmwasser", 15, 70],
      ["hk1_water", "HK1 Wasser", 15, 60],
      ["hk2_water", "HK2 Wasser", 15, 60],
      ["compressor", "Verdichter", 0, 90],
      ["pump_flow", "Durchfluss", 0, 40],
    ];

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
        ${regler.map(([feld, text, lo, hi], i) => `
          <label class="lhc-demo-schieber">
            <span>${escapeHtml(wertText(text, this._sp()))} <b data-regler="${feld}">--</b></span>
            <input type="range" data-feld="${feld}" min="${lo}" max="${hi}" step="0.5">
          </label>`).join("")}
      </div>`;

    // Schalter: einfache Delegation
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-feld]");
      if (!btn) return;
      const feld = btn.getAttribute("data-feld");
      const jetzt = this._demoLies(feld);
      const istAn = jetzt === "on" || parseFloat(jetzt) > 0;
      this._demoSetze(feld, istAn ? "off" : "on");
      this._syncDemo();
    });

    // Regler: einfach Input-Events
    host.addEventListener("input", (e) => {
      const inp = e.target.closest("input[data-feld]");
      if (!inp) return;
      const feld = inp.getAttribute("data-feld");
      this._demoSetze(feld, inp.value);
      this._syncDemo();
    });

    // Spezielle Buttons (Ventil, SG, etc.)
    // Bereitschaft: die Anlage bleibt eingeschaltet, foerdert aber nichts.
    // Weder Heizung noch Warmwasser werden bedient, die gruene LED bleibt an.
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
  }

  /** Haelt die Bedienleiste des Demomodus auf Stand. */
  _syncDemo() {
    if (!this._config.demo || !this._demo) return;
    const felder = ["pv_power","outside_temp","flow_temp","return_temp","buffer_temp","dhw_temp",
                    "hk1_water","hk2_water","compressor","pump_flow"];
    felder.forEach((feld) => {
      // Die Regler tragen keine id, sondern data-feld. Ebenso die Anzeige.
      const el = this.shadowRoot.querySelector(`input[data-feld="${feld}"]`);
      const anzeige = this.shadowRoot.querySelector(`b[data-regler="${feld}"]`);
      const wert = this._demoLies(feld);
      if (el && el.value !== wert) el.value = wert;
      if (anzeige) anzeige.textContent = wert;
    });
    const schalter = ["power_state","hk1_pump","hk2_pump","heater_internal",
                      "defrost","circulation_pump","dhw_force_state","sterilization_state"];
    schalter.forEach((feld, i) => {
      const el = this.shadowRoot.getElementById(`demo-s${i}`);
      if (!el) return;
      const w = this._demoLies(feld);
      el.classList.toggle("is-on", w === "on" || parseFloat(w) > 0);
    });
  }

  _buildDialog() {
    const sr = this.shadowRoot;
    // Ausdruecklich schliessen, nicht nur auf das Attribut im Markup vertrauen.
    sr.getElementById("dialog").hidden = true;
    this._dialogKey = null;
    const range = sr.getElementById("dlg-range");
    const out = sr.getElementById("dlg-value");

    // Die Entitaet wird beim Aufruf festgehalten. Sonst geht der Wert
    // verloren, wenn das Fenster vor dem Absenden geschlossen wird.
    const schreiben = (wert, entitaet) => {
      const id = entitaet || this._e(this._dialogKey);
      // Nur lesbare Entitaeten koennen nicht gestellt werden.
      if (!id || !stellbar(id)) return;
      this._offen = null;
      if (this._offenTimer) {
        clearTimeout(this._offenTimer);
        this._offenTimer = null;
      }
      this._halte("dialog", wert);
      this._quelle.callService(id.split(".")[0], "set_value", {
        entity_id: id,
        value: wert,
      });
    };
    this._schreibeDialog = schreiben;
    const schritt = (richtung) => {
      const neu =
        Math.round(
          (Number(range.value) + richtung * Number(range.step || 1)) * 10
        ) / 10;
      const begrenzt = clamp(neu, Number(range.min), Number(range.max));
      // Am Rand des Bereichs nichts erneut senden.
      if (begrenzt === Number(range.value)) return;
      range.value = begrenzt;
      out.textContent = this._dlgText(begrenzt);
      schreiben(begrenzt);
    };

    range.addEventListener("input", () => {
      this._dialogZieht = true;
      out.textContent = this._dlgText(parseFloat(range.value));
      // Offener Wert, damit er auch ohne Aenderungsereignis ankommt.
      this._offen = {
        wert: parseFloat(range.value),
        entitaet: this._e(this._dialogKey),
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
      // Klick auf den Hintergrund schliesst, Klick im Kasten nicht.
      if (ev.target && ev.target.id === "dialog") this._schliesseDialog();
    });
  }

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
  }

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
    // Auf dem Handy wuerde die Tastatur sofort aufgehen, darum nur am
    // grossen Bildschirm direkt ins Suchfeld.
    if (suche && window.matchMedia && window.matchMedia("(min-width: 700px)").matches) {
      suche.focus();
    }
  }

  _schliesseHilfe() {
    const fenster = this.shadowRoot.getElementById("hilfe");
    if (fenster) fenster.hidden = true;
  }

  /** Schaltflaechen zum Filtern nach Gruppe. */
  _hilfeChips() {
    const sr = this.shadowRoot;
    const host = sr.getElementById("hilfe-chips");
    if (!host) return;
    const sp = this._sp();
    const chips = [{ id: "", titel: this._t("h_alle") }].concat(
      HILFE.map((g) => ({ id: g.id, titel: g.titel[sp] || g.titel.en }))
    );
    host.innerHTML = chips
      .map(
        (c) => `<button type="button" data-g="${c.id}"
          class="${c.id === this._hilfeGruppe ? "aktiv" : ""}">${escapeHtml(c.titel)}</button>`
      )
      .join("");
    host.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        this._hilfeGruppe = b.dataset.g;
        host.querySelectorAll("button").forEach((x) =>
          x.classList.toggle("aktiv", x === b)
        );
        this._zeigeHilfe();
      })
    );
  }

  /**
   * Sucht zu jeder Kennung (top9, setdhwtemp, xtop3, opt0, 1wire, s0) die
   * Entitaeten in Home Assistant. Zuerst ueber die Registrierung von
   * HeishaMon by Lutarym (translation_key), sonst ueber die Endung der
   * Entity-ID, damit auch umbenannte oder per MQTT angelegte Entitaeten
   * gefunden werden.
   */
  _hilfeEntitaeten() {
    // Immer die echten Entitaeten, auch im Demomodus.
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
    // Sensoren zuerst, dann die stellbaren Entitaeten.
    const reihe = ["sensor", "number", "switch", "select", "button"];
    Object.values(index).forEach((liste) =>
      liste.sort((a, b) => {
        const ra = reihe.indexOf(a.split(".")[0]);
        const rb = reihe.indexOf(b.split(".")[0]);
        return (ra < 0 ? 9 : ra) - (rb < 0 ? 9 : rb) || a.localeCompare(b);
      })
    );
    return index;
  }

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
  }

  /** Kopiert Text, auch ohne gesicherte Verbindung (http im Heimnetz). */
  async _kopiere(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      // weiter mit dem Ersatzweg
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
    } catch (err) {
      ok = false;
    }
    feld.remove();
    return ok;
  }

  /** Liste nach Gruppe und Suchwort. */
  _zeigeHilfe() {
    const sr = this.shadowRoot;
    const liste = sr.getElementById("hilfe-liste");
    const suche = sr.getElementById("hilfe-suche");
    if (!liste) return;
    const sp = this._sp();
    // Gross, klein und Akzente spielen bei der Suche keine Rolle.
    const norm = (x) =>
      String(x || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");
    const woerter = norm(suche ? suche.value : "")
      .split(/\s+/)
      .filter(Boolean);
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
          [e.n[sp], e.t[sp], e.l, e.s, g.titel[sp]].concat(this._hilfeIds(e)).join(" ")
        );
        // Kennungen wie TOP9 nur als ganzes Wort, sonst faende TOP9
        // auch TOP90 bis TOP99.
        return woerter.every((w) =>
          /^(x?top|opt)\d+$/.test(w)
            ? new RegExp(`(^|[^a-z0-9])${w}($|[^a-z0-9])`).test(text)
            : text.includes(w)
        );
      });
      if (!treffer.length) return;
      anzahl += treffer.length;
      html += `<section><h3>${escapeHtml(g.titel[sp] || g.titel.en)}</h3>`;
      treffer.forEach((e) => {
        const marken = [];
        if (e.l) marken.push(`<span class="marke lesen">${lesen} · ${escapeHtml(e.l)}</span>`);
        if (e.s) marken.push(`<span class="marke schreiben">${schreiben} · ${escapeHtml(e.s)}</span>`);
        if (e.b) marken.push(`<span class="marke bereich">${escapeHtml(e.b)}</span>`);
        // Zu jeder Kennung die vollstaendige Entitaet, per Klick kopierbar.
        let entitaeten = "";
        if (e.l || e.s) {
          const ids = this._hilfeIds(e);
          entitaeten = ids.length
            ? `<div class="entitaeten">${ids
                .map(
                  (id) => `<button type="button" class="entitaet" data-kopie="${escapeHtml(id)}"
                    title="${kopierTitel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v11h-2V5H8z"/><path d="M5 7h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v11h9V9z"/></svg><span>${escapeHtml(id)}</span></button>`
                )
                .join("")}</div>`
            : `<div class="entitaeten keine-entitaet">${keineEntitaet}</div>`;
        }
        html += `<article>
          <div class="eintrag-kopf"><b>${escapeHtml(e.n[sp] || e.n.en)}</b>${marken.join("")}</div>
          <p>${escapeHtml(e.t[sp] || e.t.en)}</p>
          ${entitaeten}
        </article>`;
      });
      html += "</section>";
    });
    liste.innerHTML = html || `<p class="keine">${escapeHtml(this._t("h_keine"))}</p>`;
    liste.querySelectorAll("button[data-kopie]").forEach((b) =>
      b.addEventListener("click", async () => {
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
  }

  /** Einstellungen, zu denen es eine Entitaet gibt. */
  _tuerFelder() {
    const q = this._quelle;
    if (!q) return [];
    return TUER_FELDER.map((f) => ({ ...f, id: this._e(f.key) })).filter(
      (f) => f.id && q.states[f.id]
    );
  }

  _oeffneTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (karte.classList.contains("tuer-offen")) return;
    this._tuerNeu = {};
    this._tuerZeilen();
    const blatt = this._tuerBlatt();
    karte.classList.add("tuer-offen");
    karte.classList.remove("tuer-zu");
    panel.hidden = false;
    this._tuerLage();
    // Erst zeichnen, dann drehen, sonst springt die Tuer ohne Uebergang.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (blatt) blatt.classList.add("auf");
        panel.classList.add("sichtbar");
      })
    );
  }

  _schliesseTuer() {
    const sr = this.shadowRoot;
    const karte = sr.querySelector("ha-card");
    const panel = sr.getElementById("tuer-panel");
    if (!karte || !panel) return;
    if (!karte.classList.contains("tuer-offen")) return;
    panel.classList.remove("sichtbar");
    this._tuerNeu = {};
    karte.classList.remove("tuer-offen");
    // Die Originalgrafik bleibt verborgen, bis die Tuer ganz zu ist.
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
      // Falls kein Uebergangsende kommt, etwa bei ausgeschalteten Effekten.
      setTimeout(fertig, 900);
    } else {
      fertig();
    }
  }

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
      // Der Weichzeichner kostet bei jedem Bild Rechenzeit.
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
      height: `${r.height}px`,
    });
    const ns = "http://www.w3.org/2000/svg";
    const bild = document.createElementNS(ns, "svg");
    bild.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    bild.setAttribute("preserveAspectRatio", "none");
    bild.appendChild(kopie);
    blatt.appendChild(bild);
    karte.appendChild(blatt);
    return blatt;
  }

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
    // Ab 230 Pixel passt alles in den Innenraum, darunter wird das Feld
    // breiter als die Waermepumpe.
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
      height: `${hoehe}px`,
    });
    // Reicht die Hoehe nicht, wird das Feld breiter und zeigt zwei oder
    // drei Spalten, statt einen Rollbalken zu brauchen. Jede Spalte
    // bleibt mindestens 230 Pixel breit.
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
  }

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
      // Jeder Abschnitt ist ein eigener Block, damit er bei zwei Spalten
      // nicht auseinanderbricht.
      if (f.abschnitt !== abschnitt) {
        if (abschnitt) html += "</div>";
        abschnitt = f.abschnitt;
        html += `<div class="lhc-tuer-gruppe"><div class="lhc-tuer-abschnitt">${escapeHtml(this._t(abschnitt))}</div>`;
      }
      // Kurze Beschriftung, der Abschnitt nennt den Zusammenhang. Der
      // volle Name steht im Tooltip und im Editor.
      const titel = escapeHtml(this._t(`k_${f.key}`));
      const lang = escapeHtml(feldText(f, this._sp()));
      const bereich = f.id.split(".")[0];
      if (f.info) {
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;
        return;
      }
      if (f.knopf) {
        const kann = demo || bereich === "button" || bereich === "input_button";
        // Daneben der aktuelle Fehlercode aus TOP44, damit klar ist, was
        // quittiert wird.
        const code = rawState(q, this._e("error"));
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${
          code && code !== "unknown" && code !== "unavailable" ? ` <em>${escapeHtml(code)}</em>` : ""
        }</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}"><button type="button" data-i="${i}" data-o="press"
            ${kann ? "" : "disabled"}>${escapeHtml(this._t("t_quittieren"))}</button></div></div>`;
        return;
      }
      if (f.schalter) {
        const kann = demo || bereich === "switch" || bereich === "input_boolean";
        const knoepfe = [["off", "o_aus"], ["on", "o_ein"]]
          .map(([o, t]) => `<button type="button" data-i="${i}" data-o="${o}"
              ${kann ? "" : "disabled"}>${escapeHtml(this._t(t))}</button>`)
          .join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
        return;
      }
      if (f.auswahl) {
        const st = q.states[f.id];
        const optionen = (st.attributes && st.attributes.options) || [];
        const kann = demo || bereich === "select" || bereich === "input_select";
        const intern =
          optionen.length === f.auswahl.length &&
          optionen.every((o, n) => o === `mode_${n}`);
        const knoepfe = optionen
          .map((o, n) => {
            const text = intern ? this._t(f.auswahl[n]) : o;
            return `<button type="button" data-i="${i}" data-o="${escapeHtml(o)}"
              ${kann ? "" : "disabled"}>${escapeHtml(text)}</button>`;
          })
          .join("");
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;
      } else {
        const kann = demo || stellbar(f.id);
        html += `<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${
          kann ? "" : `<em> (${escapeHtml(this._t("t_nur_lesbar"))})</em>`
        }</span>
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
    liste.querySelectorAll("button[data-r]").forEach((b) =>
      b.addEventListener("click", () =>
        this._tuerStelle(Number(b.dataset.i), Number(b.dataset.r))
      )
    );
    liste.querySelectorAll("button[data-o]").forEach((b) =>
      b.addEventListener("click", () => this._tuerWaehle(Number(b.dataset.i), b.dataset.o))
    );
    felder.forEach((f, i) => this._tuerZeige(i));
  }

  /** Grenzen einer Zahl, gemeldete Werte der Entitaet haben Vorrang. */
  _tuerGrenzen(f) {
    const a = (this._quelle.states[f.id] || {}).attributes || {};
    const zahl = (w, ersatz) => (Number.isFinite(Number(w)) && w !== null && w !== "" ? Number(w) : ersatz);
    return { min: zahl(a.min, f.min), max: zahl(a.max, f.max), step: zahl(a.step, f.step) || 1 };
  }

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
  }

  _tuerZeige(i) {
    const f = this._tuerListe && this._tuerListe[i];
    const el = this.shadowRoot.getElementById(`tuer-z${i}`);
    if (!f || !el) return;
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
    el.textContent =
      wert === null ? "--" : `${fmt(wert, stellen)}${f.einheit ? ` ${f.einheit}` : ""}`;
    el.classList.toggle("geaendert", geaendert);
  }

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
  }

  _tuerWaehle(i, option) {
    const f = this._tuerListe && this._tuerListe[i];
    if (!f) return;
    if (f.knopf) {
      // Zweiter Klick nimmt das Quittieren wieder zurueck.
      if (this._tuerNeu && this._tuerNeu[f.id]) delete this._tuerNeu[f.id];
      else this._tuerNeu[f.id] = { wert: "press", art: "knopf" };
      this._tuerZeige(i);
      return;
    }
    this._tuerMerke(f, option);
    this._tuerZeige(i);
  }

  /** Merkt eine Aenderung vor. Zurueck auf den alten Wert hebt sie auf. */
  _tuerMerke(f, wert) {
    if (!this._tuerNeu) this._tuerNeu = {};
    delete this._tuerNeu[f.id];
    const alt = this._tuerWert(f);
    if (wert === alt) return;
    this._tuerNeu[f.id] = { wert, art: f.auswahl ? "auswahl" : f.schalter ? "schalter" : "zahl" };
  }

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
          { feld: "mode_select", typ: "auswahl", titel: "f_betriebsart", texte: MODE_LABELS },
        ],
      },
      {
        gruppe: "buffer-group",
        beschriftung: "label_buffer",
        werte: ["buffer_temp", "room_heater"],
        aktionen: [
          { feld: "buffer_switch", status: "buffer_installed", typ: "schalter", an: "f_puffer_aus", aus: "f_puffer_an" },
          { feld: "room_heater_switch", status: "room_heater", typ: "schalter", an: "f_hz_heizstab_ende", aus: "f_hz_heizstab_start" },
          { feld: "buffer_delta", typ: "zahl", befehl: "SetBufferDelta", titel: "f_laedt_ab", bezug: "buffer_target", vorzeichen: -1, min: 0, max: 10, schritt: 1 },
        ],
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
          { feld: "dhw_heat_delta", typ: "zahl", befehl: "SetDHWHeatDelta", titel: "f_laedt_ab", bezug: "dhw_setpoint", vorzeichen: 1, min: -12, max: -2, schritt: 1 },
        ],
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
          { typ: "kurveknopf", zone: 1, schmal: true, titel: "f_heizkurve_zeigen" },
        ],
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
          { typ: "kurveknopf", zone: 2, schmal: true, titel: "f_heizkurve_zeigen" },
        ],
      },
    ];

    fenster.forEach((f) => {
      const el = sr.getElementById(f.gruppe);
      if (!el) return;
      // Anklickbar, sobald es dort etwas zu bedienen gibt.
      const hatTemperatur = Boolean(f.feld && this._e(f.feld));
      const hatAktion = (f.aktionen || []).some((a) =>
        this._e(a.feld)
      );
      // Auch reine Anzeigewerte machen die Baugruppe anklickbar, damit
      // man von dort in den Verlauf von Home Assistant springen kann.
      const hatWerte =
        !this._config.demo && (f.werte || []).some((key) => this._e(key));
      if (!hatTemperatur && !hatAktion && !hatWerte) return;
      el.classList.add("klickbar");
      el.addEventListener("click", () => this._oeffneDialog(f));
    });

    // Werte in der Grafik: ein Klick oeffnet den Verlauf von Home
    // Assistant. Im Demomodus entfaellt das, dort gibt es keinen Verlauf.
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
        "hk1-water-v": "hk1_water",
        "hk1-pump-v": "hk1_pump",
        "hk2-water-v": "hk2_water",
        "hk2-pump-v": "hk2_pump",
      };
      Object.entries(anzeigen).forEach(([id, feld]) => {
        const el = sr.getElementById(id);
        if (!el || !this._e(feld)) return;
        el.classList.add("klickbar");
        el.addEventListener("click", (ev) => {
          // Sonst oeffnet zusaetzlich das Fenster der Baugruppe.
          ev.stopPropagation();
          this._mehrInfo(this._e(feld));
        });
      });
    }

    // Zirkulations-Pumpe: Direkter Schalter ohne Dialog
    const zirkEl = sr.getElementById("zirkulation-group");
    if (zirkEl && this._e("circ_switch")) {
      zirkEl.classList.add("klickbar");
      zirkEl.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._schaltCircSwitch();
      });
    }
  }

  _schaltCircSwitch() {
    const switchId = this._e("circ_switch");
    if (!switchId) return;

    const state = this._hass.states[switchId];
    const currentState = state ? state.state : "off";
    const newState = currentState === "on" ? "off" : "on";

    this._hass.callService("homeassistant", "turn_" + newState, {
      entity_id: switchId,
    });
  }

  _oeffneDialog(f) {
    const sr = this.shadowRoot;
    const tempId = f.feld ? this._e(f.feld) : "";
    this._dialogKey = tempId && this._quelle.states[tempId] ? f.feld : null;
    this._dialogAnzeige = f.anzeige || null;
    // Zwischenueberschriften und die Zonenwahl haben kein Feld und
    // bleiben immer erhalten. Bei der Heizkurve zaehlt der Feldname der
    // gerade gewaehlten Zone.
    this._dialogAktionen = (f.aktionen || []).filter((a) =>
      !a.feld ? true : Boolean(this._e(a.feld))
    );
    this._dialogGruppen = f.werte || [];
    if (this._gehalten) delete this._gehalten["dialog"];

    sr.getElementById("dlg-title").textContent =
      (f.titel && this._t(f.titel)) || this._name(f.beschriftung) || this._t("f_einstellen");
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
  }

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
    // Nur gelesene Werte, nichts wird angenommen.
    // Zuerst das Rueckmeldetopic, danach die Schaltentitaet.
    const ausStatus = pruefe(a.status);
    if (ausStatus !== null) return ausStatus;
    return pruefe(a.feld);
  }

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
  }

  /**
   * Listet unter den Schaltflaechen alle Entitaeten der Baugruppe auf.
   * Ein Klick oeffnet den Verlauf von Home Assistant.
   */
  _baueWerte() {
    const host = this.shadowRoot.getElementById("dlg-werte");
    if (!host) return;
    const gruppen = this._dialogGruppen || [];
    // Im Demomodus zeigen die Felder auf erfundene Entitaeten. Dafuer
    // gibt es in Home Assistant keinen Verlauf, darum entfaellt die Liste.
    // Aufgefuehrt wird nur, was zur jeweiligen Baugruppe gehoert und
    // wovon ein Verlauf etwas aussagt. Die Reihenfolge folgt der Liste.
    const felder = this._config.demo
      ? []
      : gruppen
          .map((key) => ENTITY_FIELDS.find((f) => f.key === key))
          .filter((f) => f && this._quelle.states[this._e(f.key)]);
    if (!felder.length) {
      host.innerHTML = "";
      return;
    }
    host.innerHTML =
      `<div class="lhc-field-label">${escapeHtml(this._t("r_verlauf_zeigen"))}</div>` +
      felder
        .map(
          (f, i) =>
            `<button type="button" class="lhc-wert" id="dlg-w${i}">
               <span>${escapeHtml(feldText(f, this._sp()))}</span>
               <b id="dlg-w${i}-v"></b>
             </button>`
        )
        .join("");
    felder.forEach((f, i) => {
      const el = this.shadowRoot.getElementById(`dlg-w${i}`);
      const wert = this.shadowRoot.getElementById(`dlg-w${i}-v`);
      const id = this._e(f.key);
      const st = this._quelle.states[id];
      if (wert && st) {
        // Temperaturunterschiede in K zeigt die Karte verstaendlicher in °C.
        const rohEinheit = (st.attributes && st.attributes.unit_of_measurement) || "";
        const einheit = rohEinheit === "K" ? "°C" : rohEinheit;
        const zahl = parseFloat(st.state);
        let text = st.state;
        if (!Number.isNaN(zahl) && /^[-\d.,\s]+$/.test(st.state)) {
          // Temperatur und Druck mit einer Nachkommastelle, alles andere
          // ohne. Sonst erscheint etwa 26.788 W, was im Deutschen wie
          // 26788 W gelesen wird.
          const stellen = ["°C", "bar"].includes(einheit) ? 1 : 0;
          text = zahl.toFixed(stellen).replace(".", DEZIMAL);
        }
        wert.textContent = einheit ? `${text} ${einheit}` : text;
      }
      if (el) el.addEventListener("click", () => this._mehrInfo(id));
    });
  }

  _baueAktionen() {
    const host = this.shadowRoot.getElementById("dlg-actions");
    const liste = this._dialogAktionen || [];
    host.innerHTML = liste
      .map((a, i) =>
        a.typ === "auswahl"
          ? `<label class="lhc-dialog-select">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <select id="dlg-a${i}"></select>
             </label>`

          : a.typ === "kurveknopf"
          ? `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">${escapeHtml(this._t(a.titel))}</button>`
          : a.typ === "zahl"
          ? `<div class="lhc-num-kompakt">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-minus"
                       aria-label="${this._t("s_kleiner")}">&minus;</button>
               <output id="dlg-a${i}">--</output>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-plus"
                       aria-label="${this._t("s_groesser")}">+</button>
             </div>`
          : `<button type="button" class="lhc-dialog-action${a.schmal ? " schmal" : ""}" id="dlg-a${i}">--</button>`
      )
      .join("");

    liste.forEach((a, i) => {
      const el = this.shadowRoot.getElementById(`dlg-a${i}`);
      if (!el) return;
      if (a.typ === "auswahl") {
        el.addEventListener("change", () => {
          const id = this._e(a.feld);
          this._quelle.callService("select", "select_option", {
            entity_id: id,
            option: el.value,
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
        // Schrittweise verstellen, begrenzt auf den zulaessigen Bereich.
        const stelle = (richtung) => {
          const feld = a.feld;
          const id = this._e(feld);
          if (!id) return;
          const kannEntitaet = stellbar(id);
          if (!kannEntitaet && !a.befehl) return;
          // Ausgangspunkt ist der zuletzt gesendete Wert, sonst zaehlt
          // mehrfaches Druecken nicht weiter, solange die Anlage den
          // alten Wert meldet.
          const ist = numState(this._quelle, id);
          const gehalten = this._gehaltenerWert(id, ist);
          const jetzt = gehalten !== null ? gehalten : ist;
          if (jetzt === null) return;
          const schritt = a.schritt || 1;
          // Das Plus soll immer die angezeigte Temperatur erhoehen.
          // Beim Puffer wird die Hysterese abgezogen, dort dreht sich
          // die Richtung deshalb um.
          const neu = clamp(
            Math.round((jetzt + richtung * (a.vorzeichen || 1) * schritt) * 10) / 10,
            a.min,
            a.max
          );
          if (neu === jetzt) return;
          // Der neue Wert wird sofort angezeigt und gehalten, bis die
          // Anlage ihn zurueckmeldet. Sonst wirkt die Bedienung traege.
          this._halte(id, neu);
          if (kannEntitaet) {
            this._quelle.callService(id.split(".")[0], "set_value", {
              entity_id: id,
              value: neu,
            });
            this._syncAktionen();
            return;
          }
          // Rueckfall: HeishaMon nimmt den Wert ueber seinen Befehlskanal
          // entgegen.
          const praefix = this._config.mqtt_prefix || "panasonic_heat_pump";
          const nutzlast = String(neu);
          this._quelle.callService("mqtt", "publish", {
            topic: `${praefix}/commands/${a.befehl}`,
            payload: nutzlast,
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
            entity_id: id,
          });
        });
      }
    });
  }

  /** Haelt die Bedienelemente auf dem aktuellen Stand. */
  _syncAktionen() {
    const liste = this._dialogAktionen || [];
    // Gruen bedeutet eingeschaltet, rot ausgeschaltet, grau unbekannt.
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
        // Nur lesbare Entitaeten lassen sich nicht stellen. Die Knoepfe
        // bleiben sichtbar, aber ausgegraut, und die Beschriftung sagt
        // warum. Sonst wirkt es wie ein Fehler der Karte.
        const feldName = a.feld;
        const kann = stellbar(this._e(feldName)) || Boolean(a.befehl);
        [`dlg-a${i}-minus`, `dlg-a${i}-plus`].forEach((kid) => {
          const k = this.shadowRoot.getElementById(kid);
          if (k) k.disabled = !kann;
        });
        const beschriftung = el.parentElement
          ? el.parentElement.querySelector(".lhc-field-label")
          : null;
        if (beschriftung) {
          const hinweis = this._t("f_nur_lesbar");
          const rein = beschriftung.textContent.replace(hinweis, "");
          beschriftung.textContent = kann ? rein : rein + hinweis;
        }
        // Angezeigt wird die Temperatur, ab der geladen wird, nicht die
        // rohe Differenz. Das ist die Angabe, die im Alltag zaehlt.
        const idFeld = this._e(feldName);
        const istWert = numState(this._quelle, idFeld);
        const gehalten = this._gehaltenerWert(idFeld, istWert);
        const roh = gehalten !== null ? gehalten : istWert;
        const ziel = a.bezug ? numState(this._quelle, this._e(a.bezug)) : null;
        el.textContent =
          roh === null
            ? "--"
            : ziel === null
            ? `${fmt(roh, 0)} ${a.einheit || "°C"}`
            : `${fmt(ziel - Math.abs(roh), 0)} °C`;
        return;
      }
      if (a.typ === "auswahl") {
        const optionen = st.attributes.options || [];
        const kennung = optionen.join("|");
        if (el.dataset.kennung !== kennung) {
          el.innerHTML = optionen
            .map(
              (o) =>
                `<option value="${escapeHtml(o)}">${escapeHtml(
                  a.texte[o] !== undefined ? wertText(a.texte[o], this._sp()) : o
                )}</option>`
            )
            .join("");
          el.dataset.kennung = kennung;
        }
        if (el.value !== st.state) el.value = st.state;
      } else if (a.typ === "zone") {
        const aktiv = this._zoneAktiv(a.nummer);
        const andere = this._zoneAktiv(a.nummer === 1 ? 2 : 1);
        el.textContent =
          aktiv === null
            ? this._t("r_zonen_unbekannt")
            : aktiv
            ? this._t("f_zone_aus")
            : this._t("f_zone_an");
        // Der letzte verbleibende Kreis laesst sich nicht abschalten.
        el.disabled = aktiv === true && andere !== true;
        if (el.disabled) el.textContent = this._t("r_einziger_kreis");
        farbeSetzen(el, el.disabled ? null : aktiv);
      } else {
        const an = this._zustand(a);
        el.textContent =
          an === null
            ? `${this._t(a.aus)} (${this._t("unbekannt")})`
            : this._t(an ? a.an : a.aus);
        farbeSetzen(el, an);
      }
    });
  }

  _schliesseDialog() {
    // Noch nicht abgesendeten Wert vor dem Schliessen nachreichen.
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
  }

  /** Haelt das offene Fenster auf dem aktuellen Stand. */
  _syncDialog() {
    if (this.shadowRoot.getElementById("dialog").hidden) return;
    this._syncAktionen();
    if (!this._dialogKey) return;
    const sr = this.shadowRoot;
    const st = this._quelle.states[this._e(this._dialogKey)];
    if (!st) return this._schliesseDialog();
    const range = sr.getElementById("dlg-range");

    // Bei den Heizkreisen hat der stellbare Wert (TOP27, TOP34) zwei
    // Bedeutungen. Im Heizkurvenbetrieb (TOP76 = 0) ist er die
    // Verschiebung der Kurve von -5 bis +5 K, im Direktbetrieb die
    // Wassertemperatur. HeishaMon by Lutarym meldet die Betriebsart im
    // Attribut "modus" und passt min und max an.
    const a = st.attributes || {};
    const wert = parseFloat(st.state);
    if (Number.isNaN(wert)) return;
    let lo = Number(a.min !== undefined ? a.min : 15);
    let hi = Number(a.max !== undefined ? a.max : 65);
    const modus = a.modus === undefined || a.modus === null ? null : Number(a.modus);
    let versch = false;
    if (this._dialogAnzeige) {
      if (modus === 0) versch = true;
      else if (modus === null && lo >= -5 && hi <= 5 && lo < 0) versch = true;
      else if (modus === null && lo <= -5 && hi >= 20) {
        // Betriebsart unbekannt: der Wert selbst zeigt, welcher Bereich gilt.
        versch = wert >= -5 && wert <= 5;
      }
      if (versch) {
        lo = Math.max(lo, -5);
        hi = Math.min(hi, 5);
      } else if (lo <= -5 && hi >= 20) {
        // Gemeinsamer Bereich bei unbekannter Betriebsart: direkt ab 20 °C.
        lo = 20;
      }
    }
    this._dialogEinheit = versch ? "K" : "°C";
    range.min = lo;
    range.max = hi;
    range.step = Number(a.step !== undefined ? a.step : 1);
    sr.getElementById("dlg-min").textContent = this._dlgText(lo);
    sr.getElementById("dlg-max").textContent = this._dlgText(hi);
    // Im Heizkurvenbetrieb steht darunter, welche Wassertemperatur sich
    // aus Kurve und Verschiebung ergibt.
    let hinweis = "";
    if (versch) {
      const ziel = numState(this._quelle, this._e(this._dialogAnzeige));
      hinweis = this._t("s_versch") +
        (ziel === null ? "" : ` · ${tf(this._t("s_ziel"), { v: fmt(ziel, 0) })}`);
    }
    sr.getElementById("dlg-hinweis").textContent = hinweis;
    if (this._dialogZieht) return;
    const gehalten = this._gehaltenerWert("dialog", wert);
    const zeigen = clamp(gehalten !== null ? gehalten : wert, lo, hi);
    range.value = zeigen;
    sr.getElementById("dlg-value").textContent = this._dlgText(zeigen);
  }

  /**
   * Blendet in Puffer und Warmwasser die Zeilen "Ziel" und "Laedt ab"
   * nach der Konfiguration aus. Die verbleibenden Zeilen ruecken nach
   * oben, damit keine Luecke entsteht. Abstand und Startpunkt kommen aus
   * der gezeichneten Grafik, das gilt fuer Quer- und Hochformat.
   */
  _speicherZeilen(name) {
    const zeilen = [
      { el: this._animEl(`${name}-sp`), zeigen: this._config.show_target !== false },
      { el: this._animEl(`${name}-delta`), zeigen: this._config.show_reload !== false },
      { el: this._animEl(`${name}-cop`), zeigen: true },
    ];
    if (zeilen.some((z) => !z.el)) return;
    zeilen.forEach((z) => {
      if (z.el.dataset.y0 === undefined) z.el.dataset.y0 = z.el.getAttribute("y");
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
  }

  /** Wert im Stellfenster mit Einheit. Eine Verschiebung mit Vorzeichen. */
  _dlgText(v) {
    if (v === null || v === undefined || Number.isNaN(v)) return "--";
    const zahl = String(v).replace(".", DEZIMAL);
    if (this._dialogEinheit === "K") return `${v > 0 ? "+" : ""}${zahl} °C`;
    return `${zahl} °C`;
  }

  /* -------------------- Szene -------------------- */

  /**
   * Waehlt zwischen den beiden Anordnungen. Das Hochformat entsteht aus
   * derselben Zeichnung, nur um 90 Grad gedreht.
   */
  _svg() {
    return this._config.layout === "hoch" ? this._svgHoch() : this._svgQuer();
  }

  /**
   * Hochformat als eigene Anordnung, nicht als Drehung.
   * Oben Waermepumpe und Kennzahlen nebeneinander, darunter senkrecht
   * der Vorlauf rechts und der Ruecklauf links. Dazwischen haengen
   * Puffer, Heizkreise und Warmwasser. Alle Kennungen sind dieselben
   * wie im Querformat, damit die Aktualisierung unveraendert arbeitet.
   */
  _svgHoch() {
    const hk2 = this._config.hk_count === 2;
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
    const HK1 = [1140 - ab, 1340 - ab];
    const HK2 = [1380 - ab, 1580 - ab];
    const WW = hk2 ? [1600 - ab, 1860 - ab] : [1360 - ab, 1620 - ab];
    // Hoehe, auf der der Sekundaerkreis abzweigt
    const ABZW = mitPuffer ? PUF[1] - 20 : HK1[0] - 40;
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
        } 78)">
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
        <line x1="70" y1="105" x2="310" y2="105" stroke="#55657F" stroke-width="1"/>
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
      <path class="flowdots" id="dots-vl-a" d="M260 680 V ${P.OBEN} H ${P.X_VL} V ${mitPuffer ? PUF[0] + 60 : ABZW}"/>
      <path class="flowdots" id="dots-vl-b" d="M${P.X_VL} ${mitPuffer ? PUF[0] + 60 : ABZW} V ${WW[0] + 40}"/>
      <path class="flowdots" id="dots-rl-a" d="M${P.X_RL} ${mitPuffer ? PUF[1] - 60 : ABZW} V 680"/>
      <path class="flowdots" id="dots-rl-b" d="M${P.X_RL} ${WW[1] - 20} V ${mitPuffer ? PUF[1] - 60 : ABZW}"/>

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
        <g id="valve-arrow-down" opacity="1">
          <path id="valve-down-line" d="M0 -12 V 4" stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path id="valve-down-head" d="M-8 2 L 0 14 L 8 2 Z" fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-right" opacity="0">
          <path id="valve-right-line" d="M-12 0 H 4" stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round" fill="none"/>
          <path id="valve-right-head" d="M2 -8 L 14 0 L 2 8 Z" fill="${NEUTRAL}"/>
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
      const breite = schildBreite(this._config[labelKey], mindest);
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
                  dominant-baseline="middle">${escapeHtml(this._config[labelKey])}</text>
          </g>
          <text class="value-l"  id="${name}-v"  x="${UM}" y="${y1 + h / 2 + 12}" text-anchor="middle">--</text>
          <text class="value-sp" id="${name}-sp" x="${UM}" y="${y1 + h / 2 + 36}" text-anchor="middle"></text>
          <text class="value-sp" id="${name}-delta" x="${UM}" y="${y1 + h / 2 + 60}" text-anchor="middle"></text>
          <text class="value-cop" id="${name}-cop" x="${UM}" y="${y1 + h / 2 + 84}" text-anchor="middle"></text>
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
    const sekEnde = hk2 ? HK2[1] - 60 : HK1[1] - 60;
    const sekundaer = `
      ${rohr(`M${mitPuffer ? P.U2 : P.X_VL} ${ABZW} H ${P.S_VL} V ${hk2 ? HK2[0] + 60 : HK1[0] + 60}`)}
      ${rohr(`M${mitPuffer ? P.U1 : P.X_RL} ${ABZW} H ${P.S_RL} V ${sekEnde}`)}
      <path class="flowdots" id="dots-sf-a" d="M${mitPuffer ? P.U2 : P.X_VL} ${ABZW} H ${P.S_VL} V ${HK1[0] + 60}"/>
      <path class="flowdots" id="dots-sf-b" d="M${P.S_VL} ${HK1[0] + 60} V ${hk2 ? HK2[0] + 60 : HK1[0] + 60}"/>
      <path class="flowdots" id="dots-sr-a" d="M${P.S_RL} ${HK1[1] - 60} V ${ABZW} H ${mitPuffer ? P.U1 : P.X_RL}"/>
      <path class="flowdots" id="dots-sr-b" d="M${P.S_RL} ${sekEnde} V ${HK1[1] - 60}"/>`;

    const heizkreis = (n, y1, y2) => {
      const h = y2 - y1;
      const breite = schildBreite(
        this._name(`label_hk${n}`),
        180
      );
      let rippen = "";
      for (let x = P.U1 + 34; x < P.U2 - 20; x += 34) {
        rippen += `<line x1="${x}" y1="${y1 + 14}" x2="${x}" y2="${y2 - 14}"/>`;
      }
      return `
        ${rohr(`M${P.S_VL} ${y1 + 60} H ${P.U2 + 9}`)}
        ${rohr(`M${P.U1 - 9} ${y2 - 60} H ${P.S_RL}`)}
        <path class="flowdots" id="dots-hk${n}" d="M${P.S_VL} ${y1 + 60} H ${P.U2 + 9}"/>
        <path class="flowdots" id="dots-hk${n}b" d="M${P.U1 - 9} ${y2 - 60} H ${P.S_RL}"/>
        <g class="circuit klickbar" id="hk${n}-group">
          <g id="hk${n}-rad">
            <rect x="${P.U1}" y="${y1}" width="${P.U2 - P.U1}" height="${h}" rx="18"
                  fill="url(#rad${n}Fill)" stroke="#33415A" stroke-width="2"/>
            <g stroke="#0D1219" stroke-width="7" opacity="0.5">${rippen}</g>
            <rect x="${P.U1}" y="${y1}" width="${P.U2 - P.U1}" height="${h}" rx="18" fill="url(#glass)"/>
          </g>
          <g id="hk${n}-name">
            <rect x="${UM - breite / 2}" y="${y1 + 10}" width="${breite}" height="30" rx="8"
                  fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
            <text class="cap" x="${UM}" y="${y1 + 25}" text-anchor="middle"
                  dominant-baseline="middle">${escapeHtml(
                    this._name(`label_hk${n}`)
                  )}</text>
          </g>
          <g id="hk${n}-tag" transform="translate(${UM} ${y1 + h / 2 + 18})">
            <rect x="-100" y="-30" width="200" height="60" rx="10" fill="#0B1017" opacity="0.9"/>
            <text class="tag-v" id="hk${n}-water-v" x="0" y="0" text-anchor="middle">--</text>
            <text class="value-sp" id="hk${n}-target-v" x="0" y="22" text-anchor="middle"></text>
          </g>
          <g transform="translate(${(P.U2 + P.S_VL) / 2} ${y1 + 60})">
            <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
            <g class="rotor" id="hk${n}-rotor">
              <path id="hk${n}-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
              <circle r="3.5" fill="#0D1219"/>
            </g>
          </g>
          <text class="value-s" id="hk${n}-pump-v" x="${(P.U2 + P.S_VL) / 2}" y="${y1 + 100}"
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
        <text class="cap-s" x="${P.U2 + 90}" y="${WW[0] + 100}" text-anchor="middle">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${P.U2 + 46}" y="${(WW[0] + WW[1]) / 2 + 56}"
              text-anchor="end">--</text>
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
        return this._verlaufRahmen(740 - breit, 420, breit, 260);
      })()}

      ${leitungen}
      ${mitPuffer ? puffer : ""}
      ${sekundaer}
      ${heizkreis(1, HK1[0], HK1[1])}
      ${hk2 ? heizkreis(2, HK2[0], HK2[1]) : ""}
      ${warmwasser}
      ${zirk}
    </svg>`;
  }

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
        <text class="cap-s" x="${x}" y="${y + 14}">${this._t("verbrauch_24")}</text>
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
        <rect x="${x}" y="${y + hoehe - 32}" width="${breite}" height="12"
              rx="3" fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
        <g id="verlauf-sg"></g>
        <text class="hinweis-s" id="verlauf-sg-leer" x="${x + 8}"
              y="${y + hoehe - 23}" opacity="0">${this._t("kein_verlauf")}</text>
        <text class="value-sp" x="${x}" y="${y + hoehe - 4}">${this._t("vor_24h")}</text>
        <text class="value-sp" x="${x + breite}" y="${y + hoehe - 36}"
              text-anchor="end"><tspan fill="#FF5F52">${this._t("heizung")}</tspan><tspan fill="#7E8CA0"> · </tspan><tspan fill="#4D9BFF">${this._t("warmwasser")}</tspan><tspan fill="#7E8CA0"> · ${this._t("standby")}</tspan></text>
        <text class="value-sp" x="${x + breite}" y="${y + hoehe - 4}"
              text-anchor="end">${this._t("jetzt")}</text>
      </g>`;
  }

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
  }

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
  }

  /** Die vier Eckwerte je Heizkreis als Steller. */
  _kurveRegler() {
    DEZIMAL = dezimalFuer(this._sp());
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
  }

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
  }

  /** Zeichnet beide Heizkurven im grossen Fenster. */
  _zeichneKurveDialog() {
    DEZIMAL = dezimalFuer(this._sp());
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
          (z === 2 && this._config.hk_count !== 2) ||
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
  }

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

  /**
   * Holt den Verlauf aus Home Assistant.  /**
   * Holt den Verlauf aus Home Assistant. Hoechstens alle fuenf Minuten,
   * damit die Abfrage die Oberflaeche nicht belastet.
   */
  _holeVerlauf() {
    const jetzt = Date.now();
    if (this._verlaufZeit && jetzt - this._verlaufZeit < 300000) return;
    this._verlaufZeit = jetzt;

    if (this._config.demo) {
      // Im Demomodus ein nachgebildeter Tagesverlauf.
      const punkte = [];
      for (let i = 0; i <= 96; i++) {
        const stunde = (i / 4) % 24;
        const grund = stunde > 5 && stunde < 9 ? 2.4 : stunde > 16 && stunde < 21 ? 1.8 : 0.4;
        punkte.push({ t: i, v: Math.max(0, grund + Math.sin(i / 3) * 0.5) });
      }
      this._verlauf = punkte;
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
    const ende = new Date();
    const start = new Date(ende.getTime() - 86400000);
    this._hass
      .callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: ende.toISOString(),
        entity_ids: [id, vid, k1, k2, vd].filter(Boolean),
        minimal_response: true,
        no_attributes: true,
      })
      .then((antwort) => {
        // Aus beiden Kontakten ergibt sich der SG-Ready-Zustand. Die
        // Zeitpunkte beider Reihen werden zusammengefuehrt.
        const punkte = (eid) =>
          ((antwort && eid && antwort[eid]) || [])
            .map((pkt) => ({
              t: pkt.lu ? pkt.lu * 1000 : Date.parse(pkt.last_changed),
              an: ["on", "true", "1"].includes(
                String(pkt.s !== undefined ? pkt.s : pkt.state).toLowerCase()
              ),
            }))
            .filter((pkt) => !Number.isNaN(pkt.t));
        const r1 = punkte(k1);
        const r2 = punkte(k2);
        if (r1.length && r2.length) {
          const zeiten = [...new Set([...r1, ...r2].map((pkt) => pkt.t))].sort(
            (x, y) => x - y
          );
          const standBei = (reihe, t) => {
            let s = reihe[0].an;
            for (const pkt of reihe) {
              if (pkt.t > t) break;
              s = pkt.an;
            }
            return s;
          };
          this._sgVerlauf = zeiten.map((t) => {
            const a1 = standBei(r1, t);
            const a2 = standBei(r2, t);
            // Gleiche Zuordnung wie in der Anzeige der Karte.
            let stufe = 2;
            if (a1 && !a2) stufe = 1;
            else if (!a1 && a2) stufe = 3;
            else if (a1 && a2) stufe = 4;
            return { t, stufe };
          });
        } else {
          this._sgVerlauf = null;
        }

        // Laeuft der Verdichter nicht, ist die Anlage im Standby, egal
        // wie das Umschaltventil steht.
        this._verdichterVerlauf = ((antwort && vd && antwort[vd]) || [])
          .map((pkt) => ({
            t: pkt.lu ? pkt.lu * 1000 : Date.parse(pkt.last_changed),
            laeuft: parseFloat(pkt.s !== undefined ? pkt.s : pkt.state) > 0,
          }))
          .filter((pkt) => !Number.isNaN(pkt.t));

        // Der Ventilverlauf sagt, wohin in dieser Zeit geladen wurde.
        this._ventilVerlauf = ((antwort && vid && antwort[vid]) || [])
          .map((p) => ({
            t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
            ww: parseFloat(p.s !== undefined ? p.s : p.state) > 0,
          }))
          .filter((p) => !Number.isNaN(p.t));
        const reihe = (antwort && antwort[id]) || [];
        this._verlauf = reihe
          .map((p) => ({
            t: p.lu ? p.lu * 1000 : Date.parse(p.last_changed),
            v: parseFloat(p.s !== undefined ? p.s : p.state),
          }))
          .filter((p) => !Number.isNaN(p.v) && !Number.isNaN(p.t));
        this._zeichneVerlauf();
      })
      .catch(() => {
        this._verlauf = null;
        this._zeichneVerlauf();
      });
  }

  /** Zeichnet die Kurve in den vorbereiteten Rahmen. */
  _zeichneVerlauf() {
    const sr = this.shadowRoot;
    const gruppe = sr && sr.getElementById("verlauf-group");
    const masse = this._verlaufMasse;
    if (!gruppe || !masse) return;
    const daten = this._verlauf || [];
    if (daten.length < 2) {
      gruppe.setAttribute("opacity", "0");
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
    const px = (d) => links + ((d.t - t0) / spanne) * (rechts - links);
    const py = (d) => unten - (d.v / hoechst) * (unten - oben);
    let linie = "";
    daten.forEach((d, i) => {
      linie += `${i ? "L" : "M"}${px(d).toFixed(1)} ${py(d).toFixed(1)}`;
    });

    // Abschnitte nach Ladeziel einfaerben. Rot heisst Heizung, blau
    // Warmwasser. Ohne Ventilverlauf bleibt die Linie neutral.
    const ventil = this._ventilVerlauf || [];
    const wwZu = (t) => {
      let stand = false;
      for (const v of ventil) {
        if (v.t > t) break;
        stand = v.ww;
      }
      return stand;
    };
    // Ob der Verdichter zu einem Zeitpunkt lief. Ohne dessen Verlauf
    // entscheidet allein das Ventil, wie bisher.
    const verdichter = this._verdichterVerlauf || [];
    const laeuftZu = (t) => {
      if (!verdichter.length) return true;
      let stand = verdichter[0].laeuft;
      for (const v of verdichter) {
        if (v.t > t) break;
        stand = v.laeuft;
      }
      return stand;
    };
    const pfade = { heiz: "", ww: "", standby: "" };
    if (ventil.length || verdichter.length) {
      let vorher = null;
      daten.forEach((d) => {
        const stueck = `${px(d).toFixed(1)} ${py(d).toFixed(1)}`;
        const ziel = !laeuftZu(d.t) ? "standby" : wwZu(d.t) ? "ww" : "heiz";
        if (vorher && vorher.ziel === ziel) {
          pfade[ziel] += `L${stueck}`;
        } else {
          // Am Wechsel beginnt ein neuer Abschnitt beim vorigen Punkt,
          // damit keine Luecke entsteht.
          pfade[ziel] += vorher ? `M${vorher.stueck}L${stueck}` : `M${stueck}`;
        }
        vorher = { ziel, stueck };
      });
    }
    const heiz = pfade.heiz;
    const ww = pfade.ww;
    // Band mit dem SG-Ready-Zustand, farbig wie in der Anzeige.
    const band = sr.getElementById("verlauf-sg");
    const leer = sr.getElementById("verlauf-sg-leer");
    if (band) {
      const sgr = this._sgVerlauf;
      band.textContent = "";
      if (leer) leer.setAttribute("opacity", sgr && sgr.length ? "0" : "1");
      if (sgr && sgr.length) {
        const bandY = masse.y + masse.hoehe - 31;
        const bandLinks = masse.x + 1;
        const bandRechts = masse.x + masse.breite - 1;
        const t0 = daten.length ? daten[0].t : sgr[0].t;
        const t1 = daten.length ? daten[daten.length - 1].t : Date.now();
        const zuX = (t) =>
          bandLinks +
          ((clamp(t, t0, t1) - t0) / (t1 - t0 || 1)) * (bandRechts - bandLinks);
        sgr.forEach((eintrag, i) => {
          const bis = i + 1 < sgr.length ? sgr[i + 1].t : t1;
          if (bis <= t0 || eintrag.t >= t1) return;
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
    // Werte kommen in Watt herein, angezeigt wird einheitlich Kilowatt.
    const inKW = hoechst >= 100 ? hoechst / 1000 : hoechst;
    sr.getElementById("verlauf-max").textContent = tf(this._t("s_max"), { v: `${fmt(inKW, 2)} kW` });
    gruppe.setAttribute("opacity", "1");
  }

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
        <clipPath id="bufClip">
          <rect x="548" y="298" width="174" height="334" rx="20"/>
        </clipPath>
        <clipPath id="dhwClip">
          <rect x="1448" y="298" width="154" height="334" rx="28"/>
        </clipPath>
      </defs>`;
  }

  _svgQuer() {
    const two = this._config.fan_count === 2;
    // Luefter uebereinander, wie beim echten Aussengeraet.
    const fans = two
      ? `${this._fan("fan1", 190, 360, 96)}${this._fan("fan2", 190, 608, 96)}`
      : this._fan("fan1", 190, 480, 120);

    const F = L.FLOW_Y;
    const R = L.RET_Y;
    const SF = L.SEC_FLOW;
    const SR = L.SEC_RET;
    // Jede Sekundaerleitung endet an ihrem letzten Anschluss:
    // der Vorlauf am letzten Abgang, der Ruecklauf am letzten Zulauf.
    // Fehlt der zweite Heizkreis, ruecken alle Baugruppen rechts davon
    // nach links auf dessen Platz. Sonst klafft dort eine Luecke.
    const DX = this._config.hk_count === 2 ? 0 : 260;
    // Ohne Heizungspuffer ruecken Sekundaerkreis, Heizkreise und alles
    // rechts davon um dessen Breite nach links. Der Sekundaerkreis
    // beginnt dann direkt an der senkrechten Leitung bei x=630.
    const PX = this._hatPuffer() ? 0 : 160;
    // Beginn der Sekundaerleitungen innerhalb der verschobenen Gruppe.
    // Ohne Puffer liegt er nach dem Verschieben genau auf der
    // senkrechten Leitung bei x=630.
    const SEC_START = this._hatPuffer() ? 730 : 630 + PX;
    const VX = DX + PX;
    const SEC_VL_ENDE = this._config.hk_count === 2 ? L.X_HK2_DROP : L.X_HK1_DROP;
    const SEC_RL_ENDE = this._config.hk_count === 2 ? L.X_HK2_BACK : L.X_HK1_BACK;
    const T = L.TANK_TOP;
    const B = L.TANK_BOTTOM;
    const C = L.CAP_Y;
    const SG = L.SG_Y;
    const hk2 = this._config.hk_count === 2;

    return `
    <svg viewBox="0 ${80 - LUFT} ${L.W - VX} ${L.H + LUFT}" class="lhc-svg" role="img"
         aria-label="${this._t("s_schema")}">
${this._defs()}

      <!-- Sammelleitungen -->
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C - VX}"/>
      <path class="pipe" id="pipe-return" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C - VX}"/>
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C - VX}"/>
      <path class="pipe" id="pipe-flow" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C - VX}"/>
      <!-- Zwei Abschnitte je Leitung: bis zum Ventil und dahinter.
           Der Teil hinter dem Ventil fuehrt nur zum Warmwasserspeicher. -->
      <path class="flowdots" id="dots-vl-a" d="M${L.X_PIPE_L} ${F} H 630"/>
      <path class="flowdots" id="dots-vl-b" d="M630 ${F} H ${L.X_DHW_C - VX}"/>
      <path class="flowdots" id="dots-rl-a" d="M630 ${R} H ${L.X_PIPE_L}"/>
      <path class="flowdots" id="dots-rl-b" d="M${L.X_DHW_C - VX} ${R} H 630"/>

      ${(() => {
        // Ohne Heizungspuffer fuehren Vor- und Ruecklauf direkt in den
        // Sekundaerkreis: senkrecht auf dessen Hoehe, dann waagerecht
        // bis zum Beginn der Sekundaerleitungen.
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
      ${
        hk2
          ? `<path class="flowdots" id="dots-sf-b" d="M${L.X_HK1_DROP} ${SF} H ${L.X_HK2_DROP}"/>
             <path class="flowdots rev" id="dots-sr-b" d="M${L.X_HK1_BACK} ${SR} H ${L.X_HK2_BACK}"/>`
          : ""
      }
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
      <!-- Außengerät -->
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
          <g class="modus" id="modus-betrieb" transform="translate(80 158)">
            <title>${this._t("r_betrieb")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none">
              <path d="M0 -10 V -1"/>
              <path d="M-6.4 -6.4 A 9 9 0 1 0 6.4 -6.4"/>
            </g>
          </g>
          <g class="modus" id="modus-heizen" transform="translate(212 158)">
            <title>${this._t("r_heizen")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <path d="M0 -11 C 6 -4, 8 0, 8 3 A 8 8 0 1 1 -8 3 C -8 -1, -3 -4, 0 -11 Z"
                  fill="currentColor"/>
            <path d="M0 -2 C 3 1, 4 3, 4 4.5 A 4 4 0 1 1 -4 4.5 C -4 3, -2 1.5, 0 -2 Z"
                  fill="#0D1219"/>
          </g>
          <g class="modus" id="modus-kuehlen" transform="translate(300 158)">
            <title>${this._t("r_kuehlen")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
              <path d="M0 -11 V 11 M-9.5 -5.5 L 9.5 5.5 M-9.5 5.5 L 9.5 -5.5"/>
              <path d="M-3 -8 L0 -11 L3 -8 M-3 8 L0 11 L3 8"/>
              <path d="M-9.5 -5.5 L -9 -1.5 M-9.5 -5.5 L -5.5 -6 M9.5 5.5 L 9 1.5 M9.5 5.5 L 5.5 6"/>
              <path d="M-9.5 5.5 L -9 1.5 M-9.5 5.5 L -5.5 6 M9.5 -5.5 L 9 -1.5 M9.5 -5.5 L 5.5 -6"/>
            </g>
          </g>
          <g class="modus" id="modus-ww" transform="translate(256 158)">
            <title>${this._t("warmwasser")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <path d="M0 -11 C 6 -2, 9 2, 9 5 A 9 9 0 0 1 -9 5 C -9 2, -6 -2, 0 -11 Z"
                  fill="currentColor"/>
          </g>
          <g class="modus" id="modus-auto" transform="translate(168 158)">
            <title>${this._t("r_automatik")}</title>
            <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
            <text class="modus-t" x="0" y="7" text-anchor="middle" fill="currentColor">A</text>
          </g>
          <g class="modus" id="modus-abtauen" transform="translate(124 158)">
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

        <line x1="70" y1="185" x2="310" y2="185" stroke="#55657F" stroke-width="1"/>
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
        // Der rechte Rand bleibt stehen, das Feld waechst nach links in
        // den Platz, den frueher die Heizkurve belegte.
        // Rechts buendig am tatsaechlichen Rand des Ausschnitts. Der ist
        // schmaler, wenn der zweite Heizkreis oder der Puffer fehlt.
        const rand = L.W - VX - 10;
        // Links endet der Verlauf spaetestens bei x=700, rechts vom
        // Umschaltventil und seiner Beschriftung.
        const w = clamp(Number(this._config.history_width) || 450, 250, Math.min(700, rand - 700));
        return this._verlaufRahmen(rand - w, 84 - LUFT, w, 144);
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

      <!-- Vorlauf am Ausgang, Rücklauf am Eingang -->
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
        <rect x="${410 - schildBreite("Rücklauf", 80) / 2}" y="${R - 13}" width="${schildBreite("Rücklauf", 80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="410" y="${R + 5}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="410" y="${R + 40}"
            text-anchor="middle">--</text>

      <!-- Stromverbrauch der Wärmepumpe, aus dem Shelly PM -->
      
      

      <!-- Primärpumpe -->
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
        <text class="value-l" id="buf-v" x="${L.X_BUF_C}" y="460" text-anchor="middle">--</text>
        <text class="value-sp" id="buf-sp" x="${L.X_BUF_C}" y="488" text-anchor="middle"></text>
        <text class="value-sp" id="buf-delta" x="${L.X_BUF_C}" y="512" text-anchor="middle"></text>
        <text class="value-cop" id="buf-cop" x="${L.X_BUF_C}" y="536" text-anchor="middle"></text>
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
      ${this._circuit(1, L.X_HK1_A, L.X_HK1_B, L.X_HK1_DROP, L.X_HK1_BACK)}
      ${hk2 ? this._circuit(2, L.X_HK2_A, L.X_HK2_B, L.X_HK2_DROP, L.X_HK2_BACK) : ""}
      </g>

      <!-- Dreiwegeventil an der Abzweigung: hier teilt sich der Vorlauf
           nach unten in den Puffer oder weiter nach rechts zum Speicher. -->
      <g>
        <circle cx="630" cy="${F}" r="22" fill="#0D1219"
                stroke="#33415A" stroke-width="2"/>
        <!-- Der Pfeil zeigt, wohin das Ventil geoeffnet ist. -->
        <g id="valve-arrow-down" opacity="0">
          <path id="valve-down-line" d="M630 ${F - 12} V ${F + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-down-head" d="M622 ${F + 2} L 630 ${F + 14} L 638 ${F + 2} Z"
                fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-right" opacity="0">
          <path id="valve-right-line" d="M${630 - 12} ${F} H ${630 + 4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-right-head" d="M${630 + 2} ${F - 8} L ${630 + 14} ${F} L ${630 + 2} ${F + 8} Z"
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
        <text class="cap-s" x="${L.X_ZIRK}" y="300" text-anchor="middle">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="1335" y="366" text-anchor="end">--</text>
      </g>

            <g id="dhw-group" transform="translate(${-VX} 0)">
        <rect x="${L.X_DHW}" y="${T}" width="170" height="350" rx="34"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <rect x="1448" y="298" width="154" height="334" rx="28" fill="url(#dhwFill)"/>
        <g clip-path="url(#dhwClip)">${this._bubbles("dhw-bubbles", 1448, 298, 154, 334)}</g>
        <rect x="1448" y="298" width="154" height="334" rx="28" fill="url(#glass)"/>
        <text class="value-l" id="dhw-v" x="${L.X_DHW_C}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="dhw-sp" x="${L.X_DHW_C}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="dhw-delta" x="${L.X_DHW_C}" y="482" text-anchor="middle"></text>
        <text class="value-cop" id="dhw-cop" x="${L.X_DHW_C}" y="505" text-anchor="middle"></text>
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
        <g id="dhw-name"><rect x="${L.X_DHW_C - schildBreite(this._name("label_dhw"), 134) / 2}" y="305"
              width="${schildBreite(this._name("label_dhw"), 134)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${L.X_DHW_C}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
          this._name("label_dhw")
        )}</text></g>
      </g>

    </svg>`;
  }

  _circuit(n, x1, x2, dropX, backX) {
    const F = L.FLOW_Y;
    const R = L.RET_Y;
    const RT = L.RAD_TOP;
    const RB = L.RAD_BOTTOM;
    const mid = (x1 + x2) / 2;
    // Die Heizkreise haengen am Puffer, nicht an der Waermepumpe.
    // Neun Einheiten vor dem Heizkoerper enden lassen. Die runde Kappe
    // der 18 breiten Rohrschale reicht dann genau bis an dessen Kante
    // und ragt nicht mehr hinein.
    const drop = `M${dropX} ${L.SEC_FLOW} V ${RT - 9}`;
    // Die Pumpe sitzt in der Mitte der Stichleitung, rechnerisch aus
    // Vorlauf und Heizkoerper. So verrutscht sie bei Rasteraenderungen nicht.
    const pumpY = Math.round((L.SEC_FLOW + RT) / 2);
    const back = `M${backX} ${RB + 9} V ${L.SEC_RET}`;

    let fins = "";
    for (let x = x1 + 26; x < x2 - 10; x += 30) {
      fins += `<line x1="${x}" y1="${RT + 10}" x2="${x}" y2="${RB - 10}"/>`;
    }

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

        <g id="hk${n}-rad">
          <rect x="${x1}" y="${RT}" width="${x2 - x1}" height="${RB - RT}" rx="10"
                fill="url(#rad${n}Fill)" stroke="#33415A" stroke-width="2"/>
          <g stroke="#0D1219" stroke-width="7" opacity="0.5">${fins}</g>
          <rect x="${x1}" y="${RT}" width="${x2 - x1}" height="${RB - RT}" rx="10" fill="url(#glass)"/>
        </g>

        <g id="hk${n}-tag" transform="translate(${mid} ${RT + 100})">
          <rect x="-100" y="-30" width="200" height="60" rx="10"
                fill="#0B1017" opacity="0.9"/>
          <text class="tag-v" id="hk${n}-water-v" x="0" y="0" text-anchor="middle">--</text>
          <text class="value-sp" id="hk${n}-target-v" x="0" y="22" text-anchor="middle"></text>
        </g>

        <g id="hk${n}-name"><rect x="${mid - schildBreite(this._name(`label_hk${n}`), 180) / 2}" y="405"
              width="${schildBreite(this._name(`label_hk${n}`), 180)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${mid}" y="420" text-anchor="middle" dominant-baseline="middle">${escapeHtml(
          this._name(`label_hk${n}`)
        )}</text></g>
      </g>`;
  }

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
      kreise += `<circle class="bubble" id="${bubbleId}" cx="${cx}" cy="${y + h - 4}" r="${r}"/>`;
    }
    return `<g id="${id}">${kreise}</g>`;
  }

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
  }

  /* -------------------- Aktualisierung -------------------- */

  _update() {
    const hass = this._quelle;
    if (!hass) return;
    const sr = this.shadowRoot;
    const min = Number(this._config.scale_min);
    const max = Number(this._config.scale_max);
    const col = (v) => thermalColor(v, min, max);
    const animate = this._config.animate !== false;

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
    // Schaltet die Laufstriche eines Leitungsabschnitts.
    // Die laufenden Striche tragen die Temperatur des Wassers, das
    // dort gerade fliesst. Animation läuft via requestAnimationFrame.
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

    /* Sichtbarer Hinweis, wenn ueberhaupt keine Entitaet gefunden wurde.
       Sonst zeigt die Karte nur Striche und man sucht an der falschen Stelle. */
    const pflicht = ["outside_temp", "compressor", "flow_temp", "return_temp",
                     "buffer_temp", "dhw_temp"];
    const gefunden = pflicht.filter((k) => {
      const id = this._e(k);
      return id && hass.states[id] !== undefined;
    }).length;
    const hinweis = this._animEl("hinweis");
    if (hinweis) {
      hinweis.hidden = gefunden > 0 || this._config.demo === true;
      if (gefunden === 0) {
        hinweis.textContent =
          this._t("s_keine_ent");
      }
    }

    /* Störung */
    const err = rawState(hass, this._e("error"));
    const harmlos = [null, "", "OK", "ok", "0", "No error", "unknown", "unavailable"];
    const stoerung = err !== null && !harmlos.includes(err);
    const alertEl = this._animEl("alert");
    if (alertEl) {
      alertEl.hidden = !stoerung;
      if (stoerung) alertEl.textContent = tf(this._t("s_stoerung"), { v: err });
    }

    /* Außenfühler */
    const outside = numState(hass, this._e("outside_temp"));
    const oMin = Number(this._config.outdoor_min);
    const oMax = Number(this._config.outdoor_max);
    const outColor = thermalColor(outside, oMin, oMax);
    set("outside-v", outside === null ? "--" : `${fmt(outside)} °C`);
    const aussenEl = this._animEl("outside-v");
    if (aussenEl) aussenEl.style.fill = outColor;

    /* Außengerät */
    const comp = numState(hass, this._e("compressor"));
    set("comp-v", comp === null ? "--" : `${fmt(comp, 0)} Hz`);
    const compEl = this._animEl("comp-v");
    if (compEl) compEl.style.fill = loadColor(comp, COMP_MIN_HZ, COMP_MAX_HZ);

    // Meldet die Waermepumpe ausdruecklich aus, steht alles still.
    // Bei unbekanntem Zustand wird nichts gesperrt, sonst waere die
    // Karte tot, nur weil ein Topic fehlt.
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
      // Eine Stoerung hat Vorrang vor der Betriebsanzeige.
      const glowStoerung = animate && stoerung;
      const glowBetrieb = animate && laeuft && comp !== null && comp > 0;
      const glowAn = glowStoerung || glowBetrieb;
      glow.setAttribute("stroke", glowStoerung ? "#EF4444" : "#22C55E");
      if (glowAn) {
        this._animState.set("unit-glow", {
          type: "pulse",
          duration: glowStoerung ? 1.2 : 2.6,
          min: 0.05,
          max: 1,
        });
      } else {
        this._animState.delete("unit-glow");
        glow.setAttribute("opacity", "0");
      }
    }

    /* SG Ready */
    const sgGroup = this._animEl("sg-group");
    if (sgGroup) {
      const konfiguriert = Boolean(this._e("sg_k1")) && Boolean(this._e("sg_k2"));
      sgGroup.setAttribute("opacity", konfiguriert ? "1" : "0");
      if (konfiguriert) {
        const sg = this._sgMode();
        const info = SG_STATES[sg];
        const farbe = info ? info.farbe : NEUTRAL;
        set("sg-text", sg === null ? this._t("unbekannt") : this._t(info.kurz));
        const t = this._animEl("sg-text");
        if (t) {
          t.style.fill = farbe;
          t.style.color = farbe;
        }
        for (let i = 1; i <= 4; i++) {
          const seg = this._animEl(`sg-seg-${i}`);
          if (!seg) continue;
          const aktiv = sg === i;
          // Das zutreffende Segment wird hoeher und leuchtet, die
          // uebrigen bleiben flach und gedaempft.
          seg.setAttribute("fill", aktiv ? farbe : "#3A4658");
          seg.setAttribute("height", aktiv ? "17" : "11");
          seg.setAttribute("y", aktiv ? "-3" : "0");
          seg.style.color = farbe;
          seg.classList.toggle("is-active", aktiv);
        }
      }
    }

    /* Stromverbrauch, nur sichtbar wenn ein Wert vorliegt */
    const leistung = numState(hass, this._e("power_now"));
    const energie = numState(hass, this._e("energy_today"));
    zeige("verbrauch-group", leistung !== null || energie !== null);
    set("power-now-v", leistung === null ? "--" : `${fmt(leistung / 1000, 2)} kW`);
    // Tagesverbrauch, sofern der Stand von Mitternacht bekannt ist.
    let energieAnzeige = energie;
    if (this._config.energy_daily !== false && energie !== null) {
      this._ladeTagesstart();
      if (this._tagStart !== undefined && energie >= this._tagStart) {
        energieAnzeige = energie - this._tagStart;
      }
    }
    set(
      "energy-today-v",
      energieAnzeige === null ? "--" : `${fmt(energieAnzeige, 1)} kWh`
    );
    // Die Beschriftung sagt, was der Wert wirklich ist. Eigene Angabe
    // hat Vorrang, sonst entscheidet der tatsaechliche Rechenweg.
    const tagesWert = energieAnzeige !== null && energieAnzeige !== energie;
    set(
      "energy-label",
      this._config.label_energy
        ? this._config.label_energy
        : tagesWert
        ? this._t("s_verbrauch_heute")
        : this._t("s_zaehler")
    );

    /* Zirkulationspumpe */
    const zirkId = this._e("circulation_pump");
    const zirkAn = isOn(hass, zirkId) === true;
    zeige("zirkulation-group", this._zeigtZirkulation(hass));
    set("zirk-v", !zirkId ? "--" : wertText(zirkAn ? "läuft" : "aus", this._sp()));
    const zirkRotor = this._animEl("zirk-rotor");
    if (zirkRotor) {
      zirkRotor.classList.toggle("is-still", !zirkAn);
      if (zirkAn && animate && laeuft) {
        // Vorhandenen Eintrag behalten, sonst faengt der Winkel bei jedem
        // Zustandsabgleich wieder bei null an und der Rotor ruckelt.
        const da = this._animState.get("zirk-rotor");
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set("zirk-rotor",
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
      } else {
        this._animState.delete("zirk-rotor");
      }
    }

    /* Leistung der Photovoltaik */
    const pv = numState(hass, this._e("pv_power"));
    zeige("pv-group", pv !== null);
    // Immer in Kilowatt, damit die Einheit nicht springt.
    set("pv-v", pv === null ? "--" : `${fmt(pv / 1000, 2)} kW`);

    /* Temperaturen und Leitungsfarben */
    const flow = numState(hass, this._e("flow_temp"));
    const ret = numState(hass, this._e("return_temp"));
    const buf = numState(hass, this._e("buffer_temp"));
    const dhw = numState(hass, this._e("dhw_temp"));

    // Beide Temperaturen zusaetzlich als Zahl im Gehaeuse, thermisch gefaerbt.
    set("unit-flow-v", flow === null ? "--" : `${fmt(flow)} °C`);
    set("unit-ret-v", ret === null ? "--" : `${fmt(ret)} °C`);
    // Die Farbe steht fest im Stil, rot fuer Vorlauf und blau fuer Ruecklauf.

    paint("bg-top", col(buf));
    paint("bg-bottom", col(buf === null ? null : buf - 4));
    set("buf-v", buf === null ? "--" : `${fmt(buf)} °C`);
    // TOP7 ist der Vorlaufsollwert der Anlage. Waehrend der
    // Warmwasserladung gilt er dem Speicher, nicht dem Puffer, und
    // springt dann auf dessen Ladetemperatur. In dieser Zeit wird er
    // hier nicht als Pufferziel ausgegeben, das waere irrefuehrend.
    const wwLaeuft = this._ladtWarmwasser(hass);
    // Waehrend der Warmwasserladung gilt TOP7 dem Speicher und springt
    // auf dessen Ladetemperatur. Dann bleibt das zuletzt gueltige
    // Pufferziel stehen, statt eines falschen Wertes oder eines Hinweises.
    let bufSp = numState(hass, this._e("buffer_target"));
    if (wwLaeuft) {
      bufSp = this._letztesPufferZiel !== undefined ? this._letztesPufferZiel : null;
    } else if (bufSp !== null) {
      this._letztesPufferZiel = bufSp;
    }
    set("buf-sp", bufSp === null ? "" : tf(this._t("s_ziel"), { v: fmt(bufSp, 0) }));
    // TOP113 ist die Hysterese des Puffers, 0 bis 10 K. Angezeigt wird
    // daraus die Temperatur, ab der nachgeladen wird.
    const bDelta = numState(hass, this._e("buffer_delta"));
    // Der Betrag wird abgezogen. Die Ladetemperatur liegt immer unter
    // dem Sollwert, unabhaengig davon, mit welchem Vorzeichen die
    // Anlage die Hysterese meldet.
    set(
      "buf-delta",
      bDelta === null || bufSp === null
        ? ""
        : tf(this._t("s_laedt_ab"), { v: fmt(bufSp - Math.abs(bDelta), 0) })
    );
    void wwLaeuft;
    const copH = this._cop(hass, "cop_heating");
    set("buf-cop", copH === null ? "" : tf(this._t("s_cop"), { v: fmt(copH, 1) }));
    // TOP58 und TOP59 sind nur die Freigabe. Ob ein Heizstab heizt,
    // melden TOP60 (intern) und TOP61 (extern). Das Abzeichen erscheint
    // in dem Speicher, auf den das Dreiwegeventil gerade stellt.
    const heizstabLaeuft =
      isOn(hass, this._e("heater_internal")) === true ||
      isOn(hass, this._e("heater_external")) === true;
    abzeichen("roomheater-badge", heizstabLaeuft && !wwLaeuft);

    const dhwSp = numState(hass, this._e("dhw_setpoint"));
    paint("dhw-top", col(dhw));
    paint("dhw-bottom", col(dhw === null ? null : dhw - 6));
    set("dhw-v", dhw === null ? "--" : `${fmt(dhw)} °C`);
    set("dhw-sp", dhwSp === null ? "" : tf(this._t("s_ziel"), { v: fmt(dhwSp, 0) }));
    const copW = this._cop(hass, "cop_dhw");
    set("dhw-cop", copW === null ? "" : tf(this._t("s_cop"), { v: fmt(copW, 1) }));
    // TOP22 ist negativ und sagt, wie weit das Warmwasser unter den
    // Sollwert fallen darf. Angezeigt wird daraus die Temperatur, ab
    // der nachgeladen wird, das ist die eigentlich nuetzliche Angabe.
    const wDelta = numState(hass, this._e("dhw_heat_delta"));
    set(
      "dhw-delta",
      wDelta === null || dhwSp === null
        ? wDelta === null
          ? ""
          : ""
        : tf(this._t("s_laedt_ab"), { v: fmt(dhwSp - Math.abs(wDelta), 0) })
    );
    abzeichen("dhwheater-badge", heizstabLaeuft && wwLaeuft);
    const tuerKnopf = this._animEl("tuer-knopf");
    if (tuerKnopf) tuerKnopf.style.display = this._tuerFelder().length ? "" : "none";
    this._speicherZeilen("buf");
    this._speicherZeilen("dhw");
    // TOP2 meldet das einmalige Aufheizen, TOP69 den Legionellenschutz.
    abzeichen("dhwforce-badge", isOn(hass, this._e("dhw_force_state")) === true);
    abzeichen("sterilization-badge", isOn(hass, this._e("sterilization_state")) === true);

    /* Primärpumpe und Durchfluss */
    const pumpRpm = numState(hass, this._e("pump_speed"));
    const flowRate = numState(hass, this._e("pump_flow"));
    this._spin("pump-rotor", pumpRpm, "pump-v", this._t("r_upm"), PUMP_SECONDS, laeuft);
    this._blattFarbe("pump-blade", col(flow), laeuft && pumpRpm !== null && pumpRpm > 0);
    set("flow-v", flowRate === null ? "--" : `${fmt(flowRate)} l/min`);
    // Ist der Rohrinnendurchmesser bekannt, laesst sich aus dem
    // Durchfluss die Stroemungsgeschwindigkeit berechnen. Ueber 1 m/s
    // sind Stroemungsgeraeusche moeglich, ab 0,8 m/s naehert man sich
    // dem. Eine Untergrenze im Betrieb gibt es nicht: kleiner Durchfluss
    // ist bei Teillast und modulierender Pumpe normal.
    const flowEl = this._animEl("flow-v");
    const innen = Number(this._config.pipe_inner_mm) || 0;
    if (flowEl) {
      let farbe = "";
      let hinweis = "";
      // Steht die Pumpe, gibt es keine Stroemung und damit auch kein
      // Risiko. Dann bleibt der Wert neutral.
      if (innen > 0 && flowRate !== null && flowRate > 0) {
        const flaeche = Math.PI * Math.pow(innen / 2000, 2);
        const v = flowRate / 60000 / flaeche;
        hinweis = `${fmt(v, 2)} m/s`;
        if (v > 1) farbe = "#D62B2B";
        else if (v > 0.8) farbe = "#E0A62E";
        else farbe = "#46C07A";
      }
      flowEl.style.fill = farbe;
      // Die Geschwindigkeit steht als Beschriftung bereit, ohne den
      // sichtbaren Text zu veraendern.
      if (hinweis) flowEl.setAttribute("aria-label", `${flowEl.textContent} = ${hinweis}`);
      else flowEl.removeAttribute("aria-label");
    }

    /* Wasserdruck, nur bei vorhandenem Wert */
    const bar = numState(hass, this._e("water_pressure"));
    zeige("press-group", bar !== null);
    if (bar !== null) {
      set("press-v", `${fmt(bar)} bar`);
      // Panasonic nennt fuer Aquarea 0,5 bis 3 bar als Normalbereich.
      const druckOk = bar >= DRUCK_MIN && bar <= DRUCK_MAX;
      const druckfarbe = druckOk ? "#46C07A" : "#D62B2B";
      const needle = this._animEl("press-needle");
      if (needle) {
        needle.setAttribute("transform", `rotate(${-120 + 240 * clamp(bar / 4, 0, 1)})`);
        needle.setAttribute("stroke", druckfarbe);
      }
      const druckText = this._animEl("press-v");
      if (druckText) druckText.style.fill = druckfarbe;
      // Unter dem Mindestdruck blinken Wert und Warndreieck.
      const zuNiedrig = bar < DRUCK_MIN;
      const warn = this._animEl("press-warn");
      if (warn) warn.setAttribute("opacity", zuNiedrig ? "1" : "0");
      if (zuNiedrig && animate) {
        this._animState.set("press-v", {
          type: "pulse", duration: 1.1, min: 0.15, max: 1,
        });
        this._animState.set("press-warn", {
          type: "pulse", duration: 1.1, min: 0.15, max: 1,
        });
      } else {
        this._animState.delete("press-v");
        this._animState.delete("press-warn");
        if (druckText) druckText.setAttribute("opacity", "1");
      }
    }

    /* Dreiwegeventil, Klartext statt Room und DHW */
    const valveEntity = this._e("three_way_valve");
    const valveRoh = attr(hass, valveEntity, "beschreibung", null);
    const valveNum = numState(hass, valveEntity);
    // Wohin gerade geladen wird. Das Dreiwegeventil ist die verlaessliche
    // Quelle. Fehlt es, hilft die Betriebsart weiter: Wert 3 heisst
    // "Nur Warmwasser". Ohne beides gilt Heizen, sonst laufen beide
    // Stichleitungen gleichzeitig.
    const zuWarmwasser = this._ladtWarmwasser(hass);
    /* Zustandssymbole oben rechts in der Waermepumpe */
    const abtaut = isOn(hass, this._e("defrost")) === true;
    const art = numState(hass, this._e("operating_mode"));
    // Welche Betriebsart welche Zustaende umfasst, nach TOP4.
    // Ohne bekannte Betriebsart gelten Heizen und Warmwasser als moeglich.
    const umfasst = {
      heizen: art === null ? true : [0, 2, 4, 6].includes(art),
      kuehlen: art === null ? false : [1, 5, 7, 8].includes(art),
      ww: art === null ? true : [3, 4, 5, 6, 8].includes(art),
      auto: art === null ? false : [2, 6, 7, 8].includes(art),
    };
    const arbeitet = laeuft && comp !== null && comp > 0;
    const blinkt = {
      betrieb: false,
      heizen: arbeitet && !zuWarmwasser && !umfasst.kuehlen && !abtaut,
      kuehlen: arbeitet && !zuWarmwasser && umfasst.kuehlen && !abtaut,
      ww: arbeitet && zuWarmwasser && !abtaut,
      auto: false,
      abtauen: abtaut,
    };
    const modusFarben = {
      // Das Betriebssymbol zeigt nur, ob die Anlage eingeschaltet ist.
      // Es blinkt nie, was sie gerade tut sagen die uebrigen Symbole.
      betrieb: "#46C07A",
      heizen: "#E0762E",
      kuehlen: "#06A6C7",
      ww: "#F2B233",
      auto: "#C3D0E0",
      abtauen: "#3E9BE0",
    };
    Object.keys(modusFarben).forEach((k) => {
      const el = this._animEl(`modus-${k}`);
      if (!el) return;
      const dabei =
        k === "betrieb" ? anAus === true : k === "abtauen" ? abtaut : umfasst[k];
      el.style.color = dabei ? modusFarben[k] : "#2E3847";
      if (blinkt[k] && animate) {
        this._animState.set(`modus-${k}`, {
          type: "pulse", duration: 1.4, min: 0.3, max: 1,
        });
      } else {
        this._animState.delete(`modus-${k}`);
        el.setAttribute("opacity", "1");
      }
    });

    let valveText = "--";
    if (valveRoh !== null && VALVE_LABELS[valveRoh] !== undefined) {
      valveText = wertText(VALVE_LABELS[valveRoh], this._sp());
    } else if (valveNum !== null) {
      valveText = this._t(zuWarmwasser ? "warmwasser" : "heizung");
    }
    set("valve-v", valveText);
    // Sichtbar ist nur der Pfeil in die geoeffnete Richtung.
    const bekannt = valveNum !== null;
    zeige("valve-arrow-down", bekannt && !zuWarmwasser);
    zeige("valve-arrow-right", bekannt && zuWarmwasser);
    const pfeilfarbe = col(flow);
    ["valve-down-line", "valve-right-line"].forEach((id) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("stroke", pfeilfarbe);
    });
    ["valve-down-head", "valve-right-head"].forEach((id) => {
      const el = this._animEl(id);
      if (el) el.setAttribute("fill", pfeilfarbe);
    });

    /* Welche Kreise sind ueberhaupt aktiviert?
       TOP94 kennt drei Zustaende, TOP99 und TOP100 je zwei.
       Ist nichts zugeordnet, wird nichts abgeblendet. */
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
    // Nur der Heizkoerper wird blasser, wenn die Zone nicht freigegeben
    // ist. Rohre und Pumpe sind weiterhin vorhanden und bleiben normal.
    blende("hk1-rad", zone1);
    blende("hk2-rad", zone2);
    blende("buffer-group", pufferDa);
    blende("dhw-group", wasserDa);

    /* Heizkreise */
    // Der gesamte Sekundaerkreis fuehrt Pufferwasser. Damit die Farbe
    // an den Verbindungsstellen nicht springt, tragen Fallrohr,
    // Steigrohr und die waagerechten Leitungen denselben Wert.
    // Ohne Puffer gibt es keinen eigenen Waermespeicher im
    // Sekundaerkreis. Wasser fliesst durch die Heizkreise nur, wenn die
    // Waermepumpe gerade in die Heizung foerdert, nicht schon, weil eine
    // Kreispumpe laeuft. Vor- und Ruecklauf tragen dann die Temperaturen
    // der Waermepumpe statt der Puffertemperatur.
    const foerdertPrimaer =
      (pumpRpm !== null && pumpRpm > 0) || (flowRate !== null && flowRate > 0);
    this._direkt = this._hatPuffer()
      ? null
      : { heizt: foerdertPrimaer && !zuWarmwasser, vl: col(flow), rl: col(ret) };
    const hk1Laeuft = this._circuitUpdate(1, col, animate, buf, laeuft);
    const hk2Laeuft =
      this._config.hk_count === 2
        ? this._circuitUpdate(2, col, animate, buf, laeuft)
        : false;

    // Mit Puffer wird der Sekundaerkreis bewegt, sobald eine Kreispumpe
    // foerdert, seine Waerme kommt aus dem Puffer. Ohne Puffer liefern
    // die Heizkreise bereits nur dann Fluss, wenn die Waermepumpe heizt.
    const sekundaer = hk1Laeuft || hk2Laeuft;
    const d = this._direkt;
    const farbeVL = d ? d.vl : col(buf);
    const farbeRL = d ? d.rl : col(buf);
    // Der Abschnitt zum zweiten Heizkreis nur, wenn dieser Fluss hat.
    stroemt(["dots-sf-a"], sekundaer, farbeVL);
    stroemt(["dots-sr-a"], sekundaer, farbeRL);
    stroemt(["dots-sf-b"], hk2Laeuft, farbeVL);
    stroemt(["dots-sr-b"], hk2Laeuft, farbeRL);

    /* Durchflussanimation */
    // Der Primaerkreis foerdert, wenn Pumpe oder Durchfluss das melden.
    // Ohne diese Werte bewegt sich nichts, es wird nichts angenommen.
    const primaer =
      (pumpRpm !== null && pumpRpm > 0) || (flowRate !== null && flowRate > 0);
    // Jeder Abschnitt einzeln, abhaengig nur vom eigenen Kreis.
    // Vor dem Ventil fliesst immer, dahinter nur bei Warmwasserladung.
    stroemt(["dots-vl-a"], primaer, col(flow));
    stroemt(["dots-vl-b"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-rl-a"], primaer, col(ret));
    stroemt(["dots-rl-b"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-buf"], primaer && !zuWarmwasser, col(flow));
    stroemt(["dots-buf2"], primaer && !zuWarmwasser, col(ret));
    stroemt(["dots-dhw"], primaer && zuWarmwasser, col(flow));
    stroemt(["dots-dhw2"], primaer && zuWarmwasser, col(ret));
    stroemt(["dots-zirk-h1", "dots-zirk-v", "dots-zirk-h2"], zirkAn, col(dhw));
    // Erst hier steht die Warmwassertemperatur fest.
    this._blattFarbe("zirk-blade", col(dhw), zirkAn && laeuft);

    // Blasen: je waermer der Speicher, desto mehr steigen auf.
    const blasen = (id, wert) => {
      const g = this._animEl(id);
      if (!g || !g.children) return;
      const anteil =
        wert === null ? 0 : clamp((wert - min) / ((max - min) || 1), 0, 1);
      const sichtbar = animate && laeuft ? Math.round(anteil * BUBBLE_COUNT) : 0;
      Array.from(g.children).forEach((el, i) => {
        // Eine pausierte Animation setzt ihre Deckkraft weiter und
        // ueberschreibt dabei jeden Inline-Stil. Ausgeblendete Blasen
        // bekommen deshalb gar keine Animation, sonst blieben sie
        // sichtbar in der Luft stehen.
        el.style.animationName = i < sichtbar ? "" : "none";
      });
    };
    blasen("buf-bubbles", buf);
    blasen("dhw-bubbles", dhw);

    /* Bedienung */
    this._syncDialog();
  }

  _circuitUpdate(n, col, animate, buf, laeuft) {
    const hass = this._quelle;
    const sr = this.shadowRoot;
    const water = numState(hass, this._e(`hk${n}_water`));
    const target = numState(hass, this._e(`hk${n}_water_target`));
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
    // Wie bei Puffer und Warmwasser: oben die Temperatur, darunter das
    // Ziel. Ohne Fachbegriffe, damit klar ist, was die Zahlen bedeuten.
    set(`hk${n}-water-v`, water === null ? "--" : `${fmt(water, 1)} °C`);
    set(`hk${n}-target-v`, target === null ? "" : tf(this._t("s_ziel"), { v: fmt(target, 0) }));

    const rotor = this._animEl(`hk${n}-rotor`);
    if (rotor) {
      // Nur der Heizkoerper wird blasser, wenn der Kreis steht.
      // Pumpe und Rohre behalten ihr normales Aussehen, sie sind
      // schliesslich weiterhin vorhanden.
      rotor.classList.remove("is-still");
      // Die Heizkreise foerdern Pufferwasser, also dessen Farbe.
      this._blattFarbe(`hk${n}-blade`, col(buf), pumpOn && laeuft);
      const rotorId = `hk${n}-rotor`;
      if (pumpOn && animate && laeuft) {
        // Ebenso hier: den erreichten Winkel nicht verwerfen.
        const da = this._animState.get(rotorId);
        if (da && da.type === "spin") da.duration = PUMP_SECONDS;
        else this._animState.set(rotorId,
          { type: "spin", duration: PUMP_SECONDS, winkel: 0 });
      } else {
        this._animState.delete(rotorId);
      }
    }
    set(`hk${n}-pump-v`, wertText(pumpOn ? "läuft" : "aus", this._sp()));

    // Mit Puffer laufen die beiden Leitungen dieses Heizkreises mit seiner
    // Pumpe. Ohne Puffer nur, wenn die Waermepumpe heizt und der Kreis
    // offen ist. Ist keine Kreispumpe zugeordnet, gilt er als offen.
    const d = this._direkt;
    const kreisOffen = pumpOn || !this._e(`hk${n}_pump`);
    const fluss = d ? d.heizt && kreisOffen : laeuft && pumpOn;
    [`dots-hk${n}`, `dots-hk${n}b`].forEach((id, i) => {
      const el = this._animEl(id);
      if (!el) return;
      const aktiv = animate && fluss;
      el.classList.toggle("is-on", aktiv);
      // Mit Puffer tragen beide die Puffertemperatur, ohne Puffer der
      // Zulauf den Vorlauf und der Abgang den Ruecklauf der Waermepumpe.
      el.style.stroke = d ? (i === 0 ? d.vl : d.rl) : col(buf);
      if (aktiv) {
        this._animState.set(id, { type: "flow", reverse: false });
      } else {
        this._animState.delete(id);
        el.setAttribute("stroke-dashoffset", "0");
      }
    });

    // Mit Puffer wie bisher der Pumpenzustand, ohne Puffer der Fluss.
    return d ? fluss : pumpOn;
  }

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
    const animate = this._config.animate !== false;
    if (rpm === null || rpm <= 0 || !animate || erlaubt === false) {
      el.classList.toggle("is-still", rpm === null || rpm <= 0);
      this._animState.delete(rotorId);
      return;
    }
    el.classList.remove("is-still");
    const duration = festeDauer ? festeDauer : clamp(900 / rpm, 0.25, 6);
    // Nur die Dauer anpassen. Der erreichte Winkel bleibt erhalten,
    // damit der Rotor bei einer neuen Drehzahl weiterdreht statt zu springen.
    const vorhanden = this._animState.get(rotorId);
    if (vorhanden && vorhanden.type === "spin") {
      vorhanden.duration = duration;
    } else {
      this._animState.set(rotorId, { type: "spin", duration, winkel: 0 });
    }
  }

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
      .lhc {
        --ink: #E8EDF4; --muted: #7E8CA0; --line: #26303F; --panel: #131A24;
        background: linear-gradient(180deg, #131A24 0%, #0D131B 100%);
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
      .lhc-demo-hinweis { font-size: 12px; color: #8FA8C8; }
      .lhc-demo-reihe { display: flex; flex-wrap: wrap; gap: 8px; }
      .lhc-demo-knopf {
        padding: 7px 12px; border-radius: 8px; cursor: pointer; font: inherit;
        font-size: 13px; background: #0F1826; color: var(--ink);
        border: 1px solid #2E4661;
      }
      .lhc-demo-knopf.is-on {
        background: #1E3A5C; border-color: #5A9BD8; color: #DDEBFA;
      }
      .lhc-demo-knopf:hover { border-color: #5A9BD8; }
      .lhc-demo-regler {
        display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px 18px; margin-top: 12px;
      }
      .lhc-demo-schieber { display: flex; flex-direction: column; gap: 4px; }
      .lhc-demo-schieber span { font-size: 12px; color: #8FA8C8; }
      .lhc-demo-schieber b { color: var(--ink); font-weight: 700; }
      .lhc-demo-schieber input {
        -webkit-appearance: none; appearance: none; width: 100%; height: 5px;
        border-radius: 3px; background: #2A3B52; outline: none;
      }
      .lhc-demo-schieber input::-webkit-slider-thumb {
        -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
        background: #5A9BD8; border: 2px solid #0F1826; cursor: pointer;
      }
      .lhc-svg { width: 100%; height: auto; display: block; }

      .pipe-shell {
        fill: none; stroke: #0B1017; stroke-width: 18;
        stroke-linecap: round; stroke-linejoin: round;
      }
      .pipe {
        fill: none; stroke: ${NEUTRAL}; stroke-width: 9;
        stroke-linecap: round; stroke-linejoin: round; transition: stroke 900ms ease;
      }
      /* Signalleitung des Außenfühlers, bewusst keine Rohrleitung */
      /* Laufende Striche zeigen an, dass in genau dieser Leitung
         gerade Wasser stroemt. Kurze Punkte verschwinden beim
         Herunterskalieren, daher bewusst lang und kraeftig. */
      .flowdots {
        fill: none; stroke: #FFFFFF; stroke-width: 7;
        stroke-linecap: round; stroke-dasharray: 14 30;
        opacity: 0;
      }
      .flowdots.is-on { opacity: 0.9; }

      .unit-label {
        /* 11px mit engerer Sperrung, sonst passt "Außentemperatur"
           nicht in die halbe Gehaeusebreite. */
        fill: #7E8CA0; font-size: 12px; letter-spacing: 0.02em;
      }
      /* Eigene Groesse fuer die beiden Werte im Gehaeuse. Die gemeinsame
         Klasse wird auch ausserhalb verwendet und bleibt unveraendert. */
      .unit-value-s {
        fill: #E8EDF4; font-size: 22px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      .verbrauch-v {
        fill: #E0762E; font-size: 26px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      #verbrauch-group, #zirkulation-group { transition: opacity 300ms ease; }
      .unit-value {
        fill: #E8EDF4; font-size: 26px; font-weight: 700;
        transition: fill 600ms ease;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
      }
      /* Nicht aktivierte Kreise werden abgeblendet, nicht ausgeblendet.
         So bleibt erkennbar, dass es sie gibt. */
      .is-inaktiv { opacity: 0.28; transition: opacity 600ms ease; }
      #valve-arrow-down, #valve-arrow-right { transition: opacity 400ms ease; }
      .cap { fill: #98A6BA; font-size: 15px; letter-spacing: 0.02em; }
      .cap-s { fill: #7E8CA0; font-size: 13px; letter-spacing: 0.02em; }
      .value-l {
        fill: #FFFFFF; font-size: 30px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
        font-variant-numeric: tabular-nums;
        paint-order: stroke; stroke: rgba(0,0,0,0.45); stroke-width: 5px;
      }
      .value-s {
        fill: #98A6BA; font-size: 14px;
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
      .hinweis-s { fill: #6B7A90; font-size: 11px; }
      .value-sp { fill: rgba(255,255,255,0.85); font-size: 17px; }
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
      .badge-t { fill: #E8EDF4; font-size: 13px; }
      .modus-t { font-size: 22px; font-weight: 700; }
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
        fill: #C3D0E0; font-size: 13px; letter-spacing: 0.02em;
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
      .rotor .blades path { fill: #55637A; }
      .rotor.is-still .blades path, .rotor.is-still > path { fill: #3A4557; }

      .lhc-wert {
        display: flex; justify-content: space-between; align-items: center;
        width: 100%; gap: 12px; margin-top: 3px; padding: 5px 12px;
        background: #0D131B; color: var(--ink); font: inherit; font-size: 14px;
        border: 1px solid var(--line); border-radius: 8px;
        cursor: pointer; text-align: left;
      }
      .lhc-wert:hover { border-color: #55657F; }
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
        border-radius: 3px; background: #26303F; outline: none;
      }
      .lhc-slider:disabled { opacity: 0.4; }
      .lhc-slider::-webkit-slider-thumb {
        -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid #0D131B;
        cursor: pointer; box-shadow: 0 0 0 1px #3A4757;
      }
      .lhc-slider::-moz-range-thumb {
        width: 18px; height: 18px; border-radius: 50%;
        background: var(--thumb, #E0762E); border: 3px solid #0D131B; cursor: pointer;
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
        background: #161D28; border: 1px solid var(--line);
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
        background: #1B2431; border: 1px solid var(--line); color: var(--ink);
        font-size: 24px; line-height: 1; cursor: pointer;
      }
      .lhc-step:hover { border-color: #3E4C61; }
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
        background: #1B2431; border: 1px solid var(--line); color: var(--ink);
      }
      .lhc-dialog-action[hidden] { display: none; }
      .lhc-dialog-action:hover { border-color: #3E4C61; }
      .lhc-dialog-action.is-an {
        background: #0E2E1C; border-color: #46C07A; color: #BFEFD2;
      }
      .lhc-dialog-action.is-aus {
        background: #2E1112; border-color: #D6534A; color: #F3C6C3;
      }
      .lhc-dialog-action.schmal { grid-column: auto; }
      .lhc-dialog-action:disabled {
        opacity: 0.45; cursor: not-allowed;
        background: #1B2431; border-color: var(--line); color: var(--muted);
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
      .lhc-kurve-box {
        /* Eine Spalte braucht weniger Platz als zwei. */
        /* Auf grossen Bildschirmen zwei Drittel, auf dem Handy fast die
           ganze Breite, sonst waere das Diagramm zu schmal. */
        box-sizing: border-box; width: min(94vw, 560px); max-height: 92vh;
        overflow-y: auto; padding: 16px 18px 14px; border-radius: 16px;
        background: #161D28; border: 1px solid var(--line);
        box-shadow: 0 18px 48px rgba(0,0,0,0.55);
      }
      .lhc-kurve-titel {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 16px; font-weight: 600; color: #E8EDF4; margin-bottom: 8px;
      }
      .lhc-kurve-reihe { display: flex; gap: 18px; align-items: flex-start; }
      .lhc-kurve-spalte { flex: 1; min-width: 0; }
      .lhc-kurve-spalte[hidden] { display: none; }
      .lhc-kurve-kopf {
        display: flex; justify-content: space-between; align-items: baseline;
        font-size: 13px; color: #98A6BA; margin-bottom: 4px;
        border-bottom: 1px solid var(--line); padding-bottom: 4px;
      }
      .lhc-kurve-soll {
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: #C3D0E0;
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
        font-size: 12px; color: #98A6BA;
      }
      .lhc-num-kompakt span { flex: 1; min-width: 0; }
      /* Dieselbe Zuordnung wie im Diagramm: orange Vorlauf, blau außen. */
      .lhc-num-kompakt.ist-vl span, .lhc-num-kompakt.ist-vl output { color: #FF8A5F; }
      .lhc-num-kompakt.ist-aussen span, .lhc-num-kompakt.ist-aussen output { color: #6BB7E8; }
      .lhc-num-kompakt output {
        min-width: 58px; text-align: right; font-size: 13px; font-weight: 700;
        font-family: ui-monospace, "SF Mono", Menlo, monospace; color: #E8EDF4;
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
        background: #080C12; border: 1px solid #33415A; border-radius: 14px;
        color: var(--ink); opacity: 0; transition: opacity 260ms ease 520ms;
      }
      .lhc-tuer[hidden] { display: none; }
      .lhc-tuer.sichtbar { opacity: 1; }
      /* Beim Schliessen sofort ausblenden, dann klappt die Tuer zu. */
      .lhc-tuer:not(.sichtbar) { transition-delay: 0ms; }
      .lhc-tuer-kopf { font-size: 14px; font-weight: 600; text-align: center; color: #E8EDF4; }
      .lhc-tuer-liste {
        flex: 1; min-height: 0; overflow-y: auto;
        display: flex; flex-direction: column; gap: 3px;
      }
      .lhc-hilfe-knopf {
        position: absolute; right: 10px; bottom: 10px; z-index: 2;
        width: 30px; height: 30px; border-radius: 50%; padding: 0;
        border: 1px solid #55657F; background: #0D1219; color: #C3D0E0;
        font-size: 17px; font-weight: 700; line-height: 1; cursor: pointer;
      }
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
        background: #161D28; border: 1px solid var(--line); border-radius: 16px;
        box-shadow: 0 18px 48px rgba(0,0,0,0.55); color: #E8EDF4;
      }
      .lhc-hilfe-kopf {
        display: flex; align-items: center; justify-content: space-between;
        font-size: 17px; font-weight: 600;
      }
      .lhc-hilfe-suche {
        box-sizing: border-box; width: 100%; padding: 10px 12px; border-radius: 10px;
        border: 1px solid #33415A; background: #0D1219; color: #E8EDF4; font-size: 15px;
      }
      .lhc-hilfe-suche:focus { outline: none; border-color: #E0762E; }
      .lhc-hilfe-chips { display: flex; flex-wrap: wrap; gap: 6px; }
      .lhc-hilfe-chips button {
        border: 1px solid #33415A; background: transparent; color: #98A6BA;
        border-radius: 999px; padding: 4px 10px; font-size: 12.5px; cursor: pointer;
      }
      /* Auf schmalen Bildschirmen eine Zeile zum Wischen statt vieler Zeilen. */
      @media (max-width: 700px) {
        .lhc-hilfe-chips { flex-wrap: nowrap; overflow-x: auto; padding-bottom: 4px; }
        .lhc-hilfe-chips button { flex: 0 0 auto; }
        .lhc-hilfe-box { padding: 12px 12px 10px; }
      }
      .lhc-hilfe-chips button.aktiv { background: #26303F; color: #E8EDF4; border-color: #55657F; }
      .lhc-hilfe-liste { flex: 1; min-height: 0; overflow-y: auto; padding-right: 4px; }
      .lhc-hilfe-liste h3 {
        margin: 14px 0 6px; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: #E0762E;
      }
      .lhc-hilfe-liste section:first-child h3 { margin-top: 2px; }
      .lhc-hilfe-liste article {
        padding: 9px 11px; margin-bottom: 6px; border-radius: 10px;
        background: #0F151E; border: 1px solid #222C3A;
      }
      .lhc-hilfe-liste .eintrag-kopf { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
      .lhc-hilfe-liste .eintrag-kopf b { font-size: 14.5px; margin-right: 4px; }
      .lhc-hilfe-liste .marke {
        font-size: 11px; padding: 2px 7px; border-radius: 6px; white-space: nowrap;
        font-family: ui-monospace, "SF Mono", Menlo, monospace;
      }
      .lhc-hilfe-liste .marke.lesen { background: #12304A; color: #8CC4F0; }
      .lhc-hilfe-liste .marke.schreiben { background: #3A2410; color: #F2A86A; }
      .lhc-hilfe-liste .marke.bereich { background: #1C2533; color: #C3D0E0; }
      .lhc-hilfe-liste p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.5; color: #C9D3E0; }
      .lhc-hilfe-liste .keine { color: #98A6BA; text-align: center; margin-top: 30px; }
      .lhc-hilfe-liste .entitaeten { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
      .lhc-hilfe-liste .entitaet {
        position: relative; display: inline-flex; align-items: center; gap: 6px;
        max-width: 100%; padding: 4px 8px; border-radius: 7px; cursor: pointer;
        border: 1px solid #33415A; background: #0D1219; color: #C3D0E0;
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      .lhc-hilfe-liste .entitaet span { overflow-wrap: anywhere; text-align: left; }
      .lhc-hilfe-liste .entitaet svg { width: 13px; height: 13px; flex: 0 0 auto; fill: currentColor; opacity: 0.7; }
      .lhc-hilfe-liste .entitaet:hover { border-color: #E0762E; color: #E8EDF4; }
      .lhc-hilfe-liste .entitaet.kopiert { border-color: #46C07A; color: #46C07A; }
      .lhc-hilfe-liste .entitaet.kopiert::after {
        content: attr(data-hinweis); position: absolute; right: 6px; top: -22px;
        background: #46C07A; color: #0D131B; font-family: inherit; font-size: 11px;
        font-weight: 700; padding: 2px 6px; border-radius: 5px;
      }
      .lhc-hilfe-liste .keine-entitaet { font-size: 12px; color: #6B7A90; font-style: italic; }
      .lhc-hilfe-fuss { font-size: 11.5px; color: #7E8CA0; line-height: 1.4; }
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
      .lhc-tuer-seg button.aktiv { background: #26303F; color: #E8EDF4; }
      .lhc-tuer-seg button:disabled { cursor: default; }
      .lhc-tuer-fuss { display: flex; gap: 8px; }
      .lhc-tuer-knopf {
        flex: 1; padding: 8px; border-radius: 9px; border: 1px solid var(--line);
        background: #131A24; color: #E8EDF4; font-size: 13px; cursor: pointer;
      }
      .lhc-tuer-knopf.primaer { background: #E0762E; border-color: #E0762E; color: #0D131B; font-weight: 600; }
      .lhc-step.klein {
        width: 26px; height: 26px; padding: 0; font-size: 15px; line-height: 1;
      }
      .lhc-step:disabled { opacity: 0.3; cursor: default; }
      .lhc-dialog-select {
        display: flex; flex-direction: column; gap: 2px; margin-top: 0;
      }
      .lhc-dialog-select select {
        background: #0D131B; color: var(--ink); font: inherit; font-size: 15px;
        border: 1px solid var(--line); border-radius: 12px; padding: 7px 10px; width: 100%;
      }

      @media (prefers-reduced-motion: reduce) {
        .rotor, .bubble, .flowdots, .badge, .lhc-alert, #unit-glow, #sg-group {
          animation: none !important;
        }
      }
    `;
  }
}

/* ------------------------------------------------------------------ *
 *  Editor
 * ------------------------------------------------------------------ */
class LutarymHeatpumpCardEditor extends HTMLElement {
  /** Sprache des Dialogs, wie bei der Karte. */
  _sp() {
    const gewaehlt = this._config && this._config.language;
    if (gewaehlt && gewaehlt !== "auto" && SPRACHEN.includes(gewaehlt)) return gewaehlt;
    const kurz = String((this._hass && this._hass.language) || "").slice(0, 2).toLowerCase();
    return SPRACHEN.includes(kurz) ? kurz : "en";
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
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      entities: { ...(config.entities || {}) },
    };
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    // Nur einmal aufbauen, sonst ueberschreibt der Abgleich die Eingabe.
    if (!this._built) this._render();
  }

  _emit() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
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
      if (!g) groups.push((g = { name: f.group, fields: [] }));
      g.fields.push(f);
    });

    const options = Object.keys(this._hass.states)
      .filter((e) =>
        /^(sensor|number|input_number|binary_sensor|switch|input_boolean|select|input_select)\./.test(
          e
        )
      )
      .sort()
      .map((e) => `<option value="${e}">${escapeHtml(friendly(this._hass, e))}</option>`)
      .join("");

    const found = detectIntegration(this._hass, this._config.profil);

    this.shadowRoot.innerHTML = `
      <style>${this._css()}</style>
      <div class="ed">
        <div class="ed-group ed-detect ${found.found ? "is-found" : "is-absent"}">
          <h3>${this._t("e_integration")}</h3>
          <p class="ed-status">${
            found.found
              ? tf(this._t("m_erkannt"), {
                  a: found.count,
                  b: Object.keys(found.entities).length,
                })
              : this._t("m_nicht_erkannt")
          }</p>
          <div class="ed-actions">
            <button type="button" id="btn-adopt" ${
              found.found ? "" : "disabled"
            }>${this._t("e_uebernehmen")}</button>
            <button type="button" id="btn-default">${this._t("e_standardnamen")}</button>
            <button type="button" id="btn-clear" class="is-quiet">${this._t("e_alle_leeren")}</button>
          </div>
          <label class="ed-row ed-breit">
            <span>${this._t("e_sprache")}${this._sp() === "en" ? "" : " / Language"}<em>${this._t("e_sprache_h")}</em></span>
            <select id="opt-sprache">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ja">日本語</option>
            </select>
          </label>
          <label class="ed-row ed-breit">
            <span>${this._t("e_profil")}<em>${this._t("e_profil_h")}</em></span>
            <select id="opt-profil">
              ${PROFILE.map(
                (pr) =>
                  `<option value="${pr.id}"${pr.fertig ? "" : " disabled"}>${escapeHtml(wertText(pr.name, this._sp()))}</option>`
              ).join("")}
            </select>
          </label>
          <div class="ed-buttons">
            <button type="button" id="btn-export">${this._t("e_feld_schreiben")}</button>
            <button type="button" id="btn-import">${this._t("e_feld_einlesen")}</button>
            <button type="button" id="btn-datei-aus">${this._t("e_datei_speichern")}</button>
            <button type="button" id="btn-datei-ein">${this._t("e_datei_laden")}</button>
          </div>
          <input type="file" id="ed-datei" accept=".json,application/json" hidden>
          <textarea id="ed-austausch" rows="4" spellcheck="false"
                    placeholder="${this._t("r_platzhalter")}"></textarea>
          <p class="ed-info" id="ed-austausch-hinweis"></p>
        </div>

        <div class="ed-group">
          <h3>${this._t("e_darstellung")}</h3>
          <label class="ed-row">
            <span>${this._t("e_anz_luefter")}</span>
            <select id="opt-fans"><option value="1">${this._t("e_1luefter")}</option><option value="2">${this._t("e_2luefter")}</option></select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_anordnung")}<em>${this._t("e_anordnung_h")}</em></span>
            <select id="opt-layout">
              <option value="quer">${this._t("e_quer")}</option>
              <option value="hoch">${this._t("e_hoch")}</option>
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_breite")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-breite" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_hoehe")}<em>${this._t("e_pixel_auto")}</em></span>
            <input type="number" id="opt-hoehe" min="0" step="10">
          </label>
          <label class="ed-row">
            <span>${this._t("e_rohr")}<em>${this._t("e_rohr_h")}</em></span>
            <input type="number" id="opt-rohr" min="0" max="80" step="1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_mqtt")}<em>${this._t("e_mqtt_h")}</em></span>
            <input type="text" id="opt-mqtt" placeholder="panasonic_heat_pump">
          </label>
          <label class="ed-row">
            <span>${this._t("e_vbreite")}<em>${this._t("e_vbreite_h")}</em></span>
            <input type="number" id="opt-vbreite" min="250" max="700" step="10">
          </label>
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
          <label class="ed-row">
            <span>${this._t("e_anz_hk")}</span>
            <select id="opt-hk"><option value="1">${this._t("e_1hk")}</option><option value="2">${this._t("e_2hk")}</option></select>
          </label>
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
          <label class="ed-row">
            <span>${this._t("e_l_hk1")}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk1">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_hk2")}<em>${this._t("e_l_hk_h")}</em></span>
            <input type="text" id="opt-lhk2">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_buf")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-lbuf">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_dhw")}<em>${this._t("e_frei")}</em></span>
            <input type="text" id="opt-ldhw">
          </label>
          <label class="ed-row">
            <span>${this._t("e_l_energy")}<em>${this._t("e_l_energy_h")}</em></span>
            <input type="text" id="opt-lenergy">
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-eday">
            <span>${this._t("e_tagesverbrauch")}</span>
          </label>
          <label class="ed-row ed-check"><input type="checkbox" id="opt-animate"><span>${this._t("e_bewegung")}</span></label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-demo">
            <span>${this._t("e_demo")}<em>${this._t("e_demo_h")}</em></span>
          </label>
          <label class="ed-row">
            <span>${this._t("e_puffer")}<em>${this._t("e_puffer_auto_h")}</em></span>
            <select id="opt-puffer">
              <option value="auto">${this._t("e_auto")}</option>
              <option value="ja">${this._t("e_vorhanden")}</option>
              <option value="nein">${this._t("e_nicht_vorhanden")}</option>
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
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-ziel">
            <span>${this._t("e_ziel_zeigen")}<em>${this._t("e_ziel_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-laedt">
            <span>${this._t("e_laedt_zeigen")}<em>${this._t("e_laedt_zeigen_h")}</em></span>
          </label>
          <label class="ed-row ed-check">
            <input type="checkbox" id="opt-verlauf">
            <span>${this._t("e_verlauf")}<em>${this._t("e_verlauf_h")}</em></span>
          </label>
        </div>

        ${groups
          .map(
            (g) => `
          <div class="ed-group">
            <h3>${escapeHtml(gruppenText(g.name, this._sp()))}</h3>
            ${g.fields
              .map(
                (f) => `
              <label class="ed-row">
                <span>${escapeHtml(feldText(f, this._sp()))}<em>${escapeHtml(hinweisText(f.hint, this._sp()))}</em></span>
                <input type="text" list="lhc-entities" data-entity="${f.key}"
                       placeholder="entity_id" autocomplete="off">
              </label>`
              )
              .join("")}
          </div>`
          )
          .join("")}

        <datalist id="lhc-entities">${options}</datalist>

        <p class="ed-note">${this._t("r_sg_hinweis")}</p>

        <p class="ed-info">
          <strong>Lutarym Heatpump Card v${CARD_VERSION}</strong>
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
    bind("opt-breite", (el) => put({ card_width: parseInt(el.value, 10) || 0 }));
    bind("opt-hoehe", (el) => put({ card_height: parseInt(el.value, 10) || 0 }));
    bind("opt-rohr", (el) => put({ pipe_inner_mm: parseInt(el.value, 10) || 0 }));
    bind("opt-mqtt", (el) => put({ mqtt_prefix: el.value.trim() || "panasonic_heat_pump" }));
    bind("opt-sprache", (el) => put({ language: el.value }));
    bind("opt-profil", (el) => put({ profil: el.value }));
    bind("opt-vbreite", (el) => put({ history_width: parseInt(el.value, 10) || 450 }));
    bind("opt-kxmin", (el) => put({ curve_x_min: parseInt(el.value, 10) }));
    bind("opt-kxmax", (el) => put({ curve_x_max: parseInt(el.value, 10) }));
    bind("opt-kymin", (el) => put({ curve_y_min: parseInt(el.value, 10) }));
    bind("opt-kymax", (el) => put({ curve_y_max: parseInt(el.value, 10) }));
    bind("opt-hk", (el) => put({ hk_count: parseInt(el.value, 10) }));
    bind("opt-min", (el) => put({ scale_min: parseFloat(el.value) }));
    bind("opt-max", (el) => put({ scale_max: parseFloat(el.value) }));
    bind("opt-omin", (el) => put({ outdoor_min: parseFloat(el.value) }));
    bind("opt-omax", (el) => put({ outdoor_max: parseFloat(el.value) }));
    bind("opt-lhk1", (el) => put({ label_hk1: el.value }));
    bind("opt-lhk2", (el) => put({ label_hk2: el.value }));
    bind("opt-lbuf", (el) => put({ label_buffer: el.value }));
    bind("opt-ldhw", (el) => put({ label_dhw: el.value }));
    bind("opt-lenergy", (el) => put({ label_energy: el.value }));
    bind("opt-eday", (el) => put({ energy_daily: el.checked }));
    bind("opt-animate", (el) => put({ animate: el.checked }));
    bind("opt-demo", (el) => put({ demo: el.checked }));
    bind("opt-verlauf", (el) => put({ show_history: el.checked }));
    bind("opt-ziel", (el) => put({ show_target: el.checked }));
    bind("opt-laedt", (el) => put({ show_reload: el.checked }));
    bind("opt-puffer", (el) => put({ buffer_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));
    bind("opt-zirk", (el) => put({ circulation_present: el.value === "ja" ? true : el.value === "nein" ? false : "auto" }));

    const applyMap = (map, merge) => {
      const entities = merge ? { ...this._config.entities, ...map } : { ...map };
      this._config = { ...this._config, entities };
      this._syncValues();
      this._emit();
    };
    // Austausch der Konfiguration. Beim Einlesen werden nur bekannte
    // Schluessel uebernommen, damit fremder Text nichts kaputt macht.
    const feld = this.shadowRoot.getElementById("ed-austausch");
    // Nach dem Einlesen baut sich der Editor neu auf, deshalb wird das
    // Hinweisfeld frisch gesucht statt gemerkt.
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
    // Dieselbe Konfiguration als Datei, fuer die Weitergabe.
    const dateiAus = this.shadowRoot.getElementById("btn-datei-aus");
    if (dateiAus) {
      dateiAus.addEventListener("click", () => {
        const kopie = { ...this._config };
        delete kopie.type;
        const text = JSON.stringify(kopie, null, 2);
        try {
          // Bevorzugt ein Objekt-Verweis, sonst ein eingebetteter Text.
          let url;
          let aufraeumen = null;
          if (typeof URL !== "undefined" && URL.createObjectURL) {
            url = URL.createObjectURL(
              new Blob([text], { type: "application/json" })
            );
            aufraeumen = () => URL.revokeObjectURL(url);
          } else {
            url =
              "data:application/json;charset=utf-8," + encodeURIComponent(text);
          }
          const link = document.createElement("a");
          link.href = url;
          link.download = `heatpump-flow-card-by-lutarym-${CARD_VERSION}.json`;
          link.click();
          if (aufraeumen) setTimeout(aufraeumen, 1000);
          sagen(this._t("m_datei_ok"));
        } catch (e) {
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
        } catch (e) {
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

        // Entitaeten einzeln pruefen: bekanntes Feld, passender Bereich
        // und in Home Assistant vorhanden.
        const zuordnung = {};
        const unbekannt = [];
        const fehlen = [];
        const falscherBereich = [];
        const quelle = (gelesen.entities && typeof gelesen.entities === "object")
          ? gelesen.entities
          : {};
        Object.keys(quelle).forEach((feld) => {
          const id = quelle[feld];
          if (!felder.includes(feld)) {
            unbekannt.push(feld);
            return;
          }
          if (typeof id !== "string" || !id.includes(".")) return;
          const bereich = FIELD_DOMAIN[feld];
          if (bereich && !bereich.includes(id.split(".")[0])) {
            falscherBereich.push(feld);
            return;
          }
          zuordnung[feld] = id;
          const st = this._hass && this._hass.states;
          if (st && !st[id]) fehlen.push(id);
        });
        uebernommen.entities = zuordnung;

        this._config = { type: this._config.type, ...uebernommen };
        this._emit();
        this.setConfig(this._config);

        // Gegenprobe: steht nach dem Anwenden wirklich alles drin?
        const jetzt = this._config.entities || {};
        const nichtAngekommen = Object.keys(zuordnung).filter(
          (k) => jetzt[k] !== zuordnung[k]
        );
        const teile = [
          tf(this._t("m_einst"), { n: Object.keys(uebernommen).length - 1 }),
          tf(this._t("m_ent"), { n: Object.keys(zuordnung).length }),
        ];
        if (verworfen) teile.push(tf(this._t("m_unb_einst"), { n: verworfen }));
        if (unbekannt.length) teile.push(tf(this._t("m_unb_felder"), { n: unbekannt.length }));
        if (falscherBereich.length)
          teile.push(tf(this._t("m_bereich"), { n: falscherBereich.length }));
        if (fehlen.length)
          teile.push(
            tf(this._t("m_fehlen"), {
              n: fehlen.length,
              liste:
                fehlen.slice(0, 3).join(", ") +
                (fehlen.length > 3 ? this._t("m_weitere") : ""),
            })
          );
        if (nichtAngekommen.length)
          teile.push(tf(this._t("m_nicht_an"), { liste: nichtAngekommen.join(", ") }));
        sagen(teile.join(". ") + ".");
      });
    }

    this.shadowRoot.getElementById("btn-adopt").addEventListener("click", () => {
      const f = detectIntegration(this._hass, this._config.profil);
      if (f.found) applyMap(f.entities, true);
    });
    this.shadowRoot
      .getElementById("btn-default")
      .addEventListener("click", () => applyMap(defaultEntityMap(), true));
    this.shadowRoot
      .getElementById("btn-clear")
      .addEventListener("click", () => applyMap({}, false));

    this.shadowRoot.querySelectorAll("[data-entity]").forEach((input) => {
      input.addEventListener("change", () => {
        const entities = { ...this._config.entities };
        const v = input.value.trim();
        if (v) entities[input.dataset.entity] = v;
        else delete entities[input.dataset.entity];
        this._config = { ...this._config, entities };
        this._emit();
      });
    });

    this._built = true;
    this._syncValues();
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
    put("opt-breite", String(this._config.card_width || 0));
    put("opt-hoehe", String(this._config.card_height || 0));
    put("opt-rohr", String(this._config.pipe_inner_mm || 0));
    put("opt-mqtt", this._config.mqtt_prefix || "panasonic_heat_pump");
    put("opt-sprache", this._config.language || "auto");
    put("opt-profil", this._config.profil || "heishamon");
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
    put("opt-lhk2", this._config.label_hk2);
    put("opt-lbuf", this._config.label_buffer);
    put("opt-ldhw", this._config.label_dhw);
    put("opt-lenergy", this._config.label_energy);
    check("opt-eday", this._config.energy_daily);
    check("opt-animate", this._config.animate);
    check("opt-demo", this._config.demo === true);
    check("opt-verlauf", this._config.show_history !== false);
    check("opt-ziel", this._config.show_target !== false);
    check("opt-laedt", this._config.show_reload !== false);
    put("opt-puffer", this._config.buffer_present === true ? "ja" : this._config.buffer_present === false ? "nein" : "auto");
    put("opt-zirk", this._config.circulation_present === true ? "ja" : this._config.circulation_present === false ? "nein" : "auto");

    const imFokus = sr.activeElement;
    sr.querySelectorAll("[data-entity]").forEach((input) => {
      const v = (this._config.entities || {})[input.dataset.entity] || "";
      if (input !== imFokus && input.value !== v) input.value = v;
      input.classList.toggle("is-missing", Boolean(v) && !this._hass.states[v]);
    });
  }

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
        border-radius: 10px; border: 1px solid var(--line);
        background: #0D1219; color: var(--ink);
        font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px;
      }
      /* Lange Auswahlnamen brauchen die ganze Breite. */
      .ed-row.ed-breit { grid-template-columns: 1fr; align-items: stretch; gap: 4px; }
      .ed-row select { width: 100%; min-width: 0; }
      @media (max-width: 600px) { .ed-row { grid-template-columns: 1fr; align-items: stretch; } }
    `;
  }
}

customElements.define("heatpump-flow-card-by-lutarym", LutarymHeatpumpCard);
customElements.define("heatpump-flow-card-by-lutarym-editor", LutarymHeatpumpCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "heatpump-flow-card-by-lutarym",
  name: "Heatpump Flow Card by Lutarym",
  description:
    "Animated plant diagram with two heating circuits, pumps, tanks, heat curve, SG Ready and flow animation.",
  preview: true,
  documentationURL: "https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym",
});

console.info(
  `%c HEATPUMP FLOW CARD BY LUTARYM %c ${CARD_VERSION} `,
  "background:#0D131B;color:#E0762E;font-weight:600;padding:2px 6px;border-radius:3px 0 0 3px",
  "background:#E0762E;color:#0D131B;font-weight:600;padding:2px 6px;border-radius:0 3px 3px 0"
);
