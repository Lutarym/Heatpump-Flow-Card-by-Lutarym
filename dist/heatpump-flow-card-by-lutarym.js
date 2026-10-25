/*! Heatpump Flow Card by Lutarym 5.13.0 | GPL-3.0-or-later | https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym */
var CARD_VERSION="5.13.0",L={W:1650,H:700,FLOW_Y:240,RET_Y:700,TANK_TOP:290,TANK_BOTTOM:640,RAD_TOP:400,RAD_BOTTOM:580,SEC_FLOW:320,SEC_RET:620,UNIT_TOP:120,UNIT_BOTTOM:760,CAP_Y:768,SG_Y:104,X_PIPE_L:340,X_COL:445,X_BUF:540,X_BUF_C:635,X_HK1_A:820,X_HK1_B:1040,X_HK1_DROP:870,X_HK1_BACK:990,X_HK2_A:1110,X_HK2_B:1330,X_HK2_DROP:1160,X_HK2_BACK:1280,X_ZIRK:1370,X_PRESS:1390,X_DHW:1430,X_DHW_C:1525},MODE_LABELS={mode_0:"Nur Heizen",mode_1:"Nur Kühlen",mode_2:"Automatik Heizen",mode_3:"Nur Warmwasser",mode_4:"Heizen und Warmwasser",mode_5:"Kühlen und Warmwasser",mode_6:"Automatik Heizen und Warmwasser",Heat:"Nur Heizen",Cool:"Nur Kühlen","Auto(heat)":"Automatik Heizen",DHW:"Nur Warmwasser","Heat+DHW":"Heizen und Warmwasser","Cool+DHW":"Kühlen und Warmwasser","Auto(heat)+DHW":"Automatik Heizen und Warmwasser","Auto(cool)":"Automatik Kühlen","Auto(cool)+DHW":"Automatik Kühlen und Warmwasser",0:"Nur Heizen",1:"Nur Kühlen",2:"Automatik Heizen",3:"Nur Warmwasser",4:"Heizen und Warmwasser",5:"Kühlen und Warmwasser",6:"Automatik Heizen und Warmwasser",7:"Automatik Kühlen",8:"Automatik Kühlen und Warmwasser"},QUIET_LABELS={mode_0:"Aus",mode_1:"Stufe 1",mode_2:"Stufe 2",mode_3:"Stufe 3",0:"Aus",1:"Stufe 1",2:"Stufe 2",3:"Stufe 3"},POWERFUL_LABELS={mode_0:"Aus",mode_1:"30 Minuten",mode_2:"60 Minuten",mode_3:"90 Minuten",0:"Aus",1:"30 Minuten",2:"60 Minuten",3:"90 Minuten"},VALVE_LABELS={Room:"Heizung",DHW:"Warmwasser",0:"Heizung",1:"Warmwasser"},LUFT=30,SG_STATES={1:{kurz:"sg1_kurz",lang:"sg1_lang",farbe:"#FF6B5E"},2:{kurz:"sg2_kurz",lang:"sg2_lang",farbe:"#C3D0E0"},3:{kurz:"sg3_kurz",lang:"sg3_lang",farbe:"#FFC44D"},4:{kurz:"sg4_kurz",lang:"sg4_lang",farbe:"#5BE08F"}},THERMAL_STOPS=[{p:0,c:[29,78,216]},{p:.3,c:[6,166,199]},{p:.55,c:[242,178,51]},{p:.78,c:[238,122,43]},{p:1,c:[214,43,43]}],NEUTRAL="#46536A",DRUCK_MIN=.5,DRUCK_MAX=3,COMP_MIN_HZ=16,COMP_MAX_HZ=90,LOAD_STOPS=[{p:0,c:[91,224,143]},{p:.4,c:[255,196,77]},{p:.7,c:[224,118,46]},{p:1,c:[255,107,94]}],PUMP_SECONDS=3,HOLD_MS=12e3,BUBBLE_COUNT=14,BUBBLE_DAUER=[],DEMO_PAARE={power_state:"heatpump_state",heatpump_state:"power_state",dhw_force:"dhw_force_state",dhw_force_state:"dhw_force",force_defrost:"defrost",defrost:"force_defrost",force_sterilization:"sterilization_state",sterilization_state:"force_sterilization",dhw_heater_switch:"dhw_heater",dhw_heater:"dhw_heater_switch",room_heater_switch:"room_heater",room_heater:"room_heater_switch",buffer_switch:"buffer_installed",buffer_installed:"buffer_switch"};var HILFE_DATEI="heatpump-flow-card-by-lutarym-hilfe.js",laden=null,daten=null;function hilfeDaten(){return daten}function ladeHilfe(){return daten?Promise.resolve(daten):(laden||(laden=import(new URL(`./${HILFE_DATEI}?v=${CARD_VERSION}`,import.meta.url).href).then(m=>(daten=Array.isArray(m.HILFE)?m.HILFE:[],daten)).catch(fehler=>{throw laden=null,fehler})),laden)}var SPRACHEN=["de","en","fr","ja"],TEXTE={aussentemperatur:{de:"Außentemperatur",en:"Outdoor temp.",fr:"Temp. extérieure",ja:"外気温"},aussen_achse:{de:"Außentemperatur °C",en:"Outdoor temperature °C",fr:"Température extérieure °C",ja:"外気温 °C"},verdichter:{de:"Verdichter",en:"Compressor",fr:"Compresseur",ja:"圧縮機"},vorlauf:{de:"Vorlauf",en:"Flow",fr:"Départ",ja:"往き"},ruecklauf:{de:"Rücklauf",en:"Return",fr:"Retour",ja:"還り"},vorlauf_achse:{de:"Vorlauf °C",en:"Flow °C",fr:"Départ °C",ja:"往き温度 °C"},pumpe:{de:"Pumpe",en:"Pump",fr:"Pompe",ja:"ポンプ"},druck:{de:"Druck",en:"Pressure",fr:"Pression",ja:"圧力"},umschaltventil:{de:"Umschaltventil",en:"Diverter valve",fr:"Vanne trois voies",ja:"三方弁"},zirkulation:{de:"Zirkulation",en:"Circulation",fr:"Circulation",ja:"循環"},leistung:{de:"Leistung",en:"Power",fr:"Puissance",ja:"消費電力"},verbrauch:{de:"Verbrauch",en:"Energy",fr:"Consommation",ja:"使用量"},verbrauch_24:{de:"Verbrauch 24 Stunden",en:"Energy, past 24 hours",fr:"Consommation sur 24 heures",ja:"24時間の使用量"},pv_ueberschuss:{de:"PV Überschuss",en:"PV surplus",fr:"Surplus PV",ja:"太陽光の余剰"},heizstab:{de:"Heizstab",en:"Heater",fr:"Appoint électrique",ja:"ヒーター"},legionellen:{de:"Legionellen",en:"Legionella",fr:"Légionelles",ja:"レジオネラ"},aufheizen:{de:"Aufheizen",en:"Boost",fr:"Chauffe",ja:"加熱"},vor_24h:{de:"vor 24 h",en:"24 h ago",fr:"il y a 24 h",ja:"24時間前"},jetzt:{de:"jetzt",en:"now",fr:"maintenant",ja:"現在"},betrieb:{de:"Betrieb",en:"Running",fr:"Marche",ja:"運転"},v_takte:{de:"{n} Takte · Ø {d} min · {w}× Warmwasser",en:"{n} cycles · avg {d} min · {w}× hot water",fr:"{n} cycles · moy. {d} min · {w}× eau chaude",ja:"{n} サイクル・平均 {d} 分・給湯 {w} 回"},v_takte_ohne:{de:"{n} Takte · Ø {d} min",en:"{n} cycles · avg {d} min",fr:"{n} cycles · moy. {d} min",ja:"{n} サイクル・平均 {d} 分"},sg_jetzt:{de:"Jetzt: {z}",en:"Now: {z}",fr:"Maintenant : {z}",ja:"現在：{z}"},sg_seit:{de:"seit {h} h",en:"for {h} h",fr:"depuis {h} h",ja:"{h} 時間前から"},sg_anteile:{de:"Anteile 24 h",en:"Shares 24 h",fr:"Parts sur 24 h",ja:"24時間の割合"},e_sgstil:{de:"Darstellung SG Ready",en:"SG Ready chart style",fr:"Style du graphique SG Ready",ja:"SG Ready の表示"},e_sgstil_h:{de:"wie SG Ready der letzten 24 Stunden gezeichnet wird",en:"how SG Ready of the last 24 hours is drawn",fr:"façon de dessiner SG Ready des 24 dernières heures",ja:"過去24時間の SG Ready の描き方"},o_sgstil_spuren:{de:"Spuren je Zustand",en:"Lane per state",fr:"Une ligne par état",ja:"状態ごとの行"},o_sgstil_stufen:{de:"Stufenlinie",en:"Step line",fr:"Ligne en escalier",ja:"階段状の線"},o_sgstil_uhr:{de:"24-Stunden-Uhr",en:"24-hour clock",fr:"Horloge 24 heures",ja:"24時間時計"},o_sgstil_band:{de:"Breites Band mit Anteilsleiste",en:"Wide band with share bar",fr:"Large bande avec barre des parts",ja:"幅広の帯と割合バー"},e_vstil:{de:"Darstellung Verbrauch",en:"Energy chart style",fr:"Style du graphique de consommation",ja:"使用量グラフの表示"},e_vstil_h:{de:"wie der Verbrauch der letzten 24 Stunden gezeichnet wird",en:"how the energy of the last 24 hours is drawn",fr:"façon de dessiner la consommation des 24 dernières heures",ja:"過去24時間の使用量の描き方"},o_vstil_balken:{de:"Balken je Stunde",en:"Bars per hour",fr:"Barres par heure",ja:"1時間ごとの棒グラフ"},o_vstil_takte:{de:"Ring und Taktband",en:"Ring and cycle band",fr:"Anneau et bande des cycles",ja:"リングとサイクル帯"},o_vstil_leuchten:{de:"Leuchtende Linie mit Taktmarken",en:"Glowing line with cycle marks",fr:"Ligne lumineuse avec repères de cycles",ja:"光る線とサイクル表示"},o_vstil_linie:{de:"Linie (bisherige Darstellung)",en:"Line (previous style)",fr:"Ligne (style précédent)",ja:"線（従来の表示）"},standby:{de:"Standby",en:"Standby",fr:"Veille",ja:"待機"},heizung:{de:"Heizung",en:"Heating",fr:"Chauffage",ja:"暖房"},warmwasser:{de:"Warmwasser",en:"Hot water",fr:"Eau chaude",ja:"給湯"},kein_verlauf:{de:"kein Verlauf vorhanden",en:"no history available",fr:"aucun historique",ja:"履歴なし"},heizkreis:{de:"Heizkreis",en:"Circuit",fr:"Circuit",ja:"暖房回路"},puffer:{de:"Puffer",en:"Buffer",fr:"Ballon tampon",ja:"バッファータンク"},sg1_kurz:{de:"Stopp",en:"Blocked",fr:"Blocage",ja:"停止"},sg1_lang:{de:"Sperre durch den Netzbetreiber",en:"Blocked by the grid operator",fr:"Blocage par le gestionnaire de réseau",ja:"電力会社による停止指令"},sg2_kurz:{de:"Normal",en:"Normal",fr:"Normal",ja:"通常"},sg2_lang:{de:"Normalbetrieb",en:"Normal operation",fr:"Fonctionnement normal",ja:"通常運転"},sg3_kurz:{de:"PV Überschuss Low",en:"PV surplus, low",fr:"Surplus PV, faible",ja:"余剰電力 小"},sg3_lang:{de:"Einschaltempfehlung",en:"Switch-on recommendation",fr:"Recommandation de mise en marche",ja:"運転推奨"},sg4_kurz:{de:"PV Überschuss High",en:"PV surplus, high",fr:"Surplus PV, élevé",ja:"余剰電力 大"},sg4_lang:{de:"Anlaufbefehl, verstärkter Betrieb",en:"Start command, increased operation",fr:"Ordre de démarrage, marche renforcée",ja:"運転指令、出力増"},unbekannt:{de:"unbekannt",en:"unknown",fr:"inconnu",ja:"不明"},f_waermepumpe:{de:"Wärmepumpe",en:"Heat pump",fr:"Pompe à chaleur",ja:"ヒートポンプ"},f_betriebsart:{de:"Betriebsart",en:"Operating mode",fr:"Mode de fonctionnement",ja:"運転モード"},f_turbomodus:{de:"Turbomodus",en:"Powerful mode",fr:"Mode puissance",ja:"パワフル運転"},f_leisemodus:{de:"Leisemodus",en:"Quiet mode",fr:"Mode silencieux",ja:"静音運転"},f_heizkurve:{de:"Heizkurve",en:"Heat curve",fr:"Courbe de chauffe",ja:"暖房曲線"},f_laedt_ab:{de:"Lädt ab",en:"Reheat at",fr:"Relance à",ja:"再加熱開始温度"},f_aussen_kalt:{de:"Außen kalt",en:"Outdoor, cold",fr:"Extérieur, froid",ja:"外気 低温"},f_aussen_warm:{de:"Außen warm",en:"Outdoor, warm",fr:"Extérieur, doux",ja:"外気 高温"},f_dann_vorlauf:{de:"dann Vorlauf",en:"then flow",fr:"alors départ",ja:"その時の往き温度"},f_laeuft_aus:{de:"Läuft, ausschalten",en:"Running, switch off",fr:"En marche, arrêter",ja:"運転中、停止する"},f_einschalten:{de:"Einschalten",en:"Switch on",fr:"Mettre en marche",ja:"運転する"},f_abtauen_ende:{de:"Abtauen läuft, beenden",en:"Defrost running, stop",fr:"Dégivrage en cours, arrêter",ja:"除霜中、停止する"},f_abtauen_start:{de:"Abtauen erzwingen",en:"Force defrost",fr:"Forcer le dégivrage",ja:"強制除霜"},f_aufheizen_ende:{de:"Aufheizen beenden",en:"Stop boost",fr:"Arrêter la chauffe",ja:"加熱を停止"},f_aufheizen_start:{de:"Einmalig aufheizen",en:"Boost once",fr:"Chauffe unique",ja:"一回だけ加熱"},f_legionellen_ende:{de:"Legionellen beenden",en:"Stop legionella cycle",fr:"Arrêter le cycle légionelles",ja:"レジオネラ運転を停止"},f_legionellen_start:{de:"Legionellen starten",en:"Start legionella cycle",fr:"Démarrer le cycle légionelles",ja:"レジオネラ運転を開始"},f_heizstab_aus:{de:"Heizstab sperren",en:"Block heater",fr:"Bloquer l'appoint",ja:"ヒーター禁止"},f_heizstab_an:{de:"Heizstab freigeben",en:"Allow heater",fr:"Autoriser l'appoint",ja:"ヒーター許可"},f_hz_heizstab_ende:{de:"Heizstab Heizung freigegeben, sperren",en:"Heating element allowed, block",fr:"Appoint chauffage autorisé, bloquer",ja:"暖房ヒーター許可中、禁止する"},f_hz_heizstab_start:{de:"Heizstab Heizung freigeben",en:"Allow heating element",fr:"Autoriser l'appoint chauffage",ja:"暖房ヒーターを許可"},f_kreis_aus:{de:"Kreis ausschalten",en:"Switch circuit off",fr:"Arrêter le circuit",ja:"回路を停止"},f_kreis_an:{de:"Kreis einschalten",en:"Switch circuit on",fr:"Mettre le circuit en marche",ja:"回路を運転"},f_puffer_aus:{de:"Pufferbetrieb ist an, ausschalten",en:"Buffer mode on, switch off",fr:"Mode tampon actif, arrêter",ja:"バッファー運転中、停止する"},f_puffer_an:{de:"Pufferbetrieb einschalten",en:"Switch on buffer mode",fr:"Activer le mode tampon",ja:"バッファー運転を開始"},f_zone_aus:{de:"Zone abschalten",en:"Switch zone off",fr:"Désactiver la zone",ja:"ゾーンを停止"},f_zone_an:{de:"Zone zuschalten",en:"Switch zone on",fr:"Activer la zone",ja:"ゾーンを運転"},f_heizkurve_zeigen:{de:"Heizkurve",en:"Heat curve",fr:"Courbe de chauffe",ja:"暖房曲線"},e_sprache:{de:"Sprache",en:"Language",fr:"Langue",ja:"言語"},e_sprache_h:{de:"automatisch folgt der Spracheinstellung von Home Assistant",en:"automatic follows the Home Assistant language",fr:"automatique suit la langue de Home Assistant",ja:"自動の場合はHome Assistantの言語に従います"},e_profil:{de:"Hersteller",en:"Manufacturer",fr:"Fabricant",ja:"メーカー"},e_thema:{de:"Farbdarstellung",en:"Colour scheme",fr:"Jeu de couleurs",ja:"配色"},e_thema_h:{de:"Automatisch folgt hell oder dunkel von Home Assistant",en:"Automatic follows light or dark mode of Home Assistant",fr:"Automatique suit le mode clair ou sombre de Home Assistant",ja:"自動は Home Assistant のライト／ダークに従います"},o_th_auto:{de:"Automatisch (wie Home Assistant)",en:"Automatic (like Home Assistant)",fr:"Automatique (comme Home Assistant)",ja:"自動（Home Assistant に合わせる）"},o_th_dunkel:{de:"Dunkel",en:"Dark",fr:"Sombre",ja:"ダーク"},o_th_hell:{de:"Hell",en:"Light",fr:"Clair",ja:"ライト"},o_th_kontrast:{de:"Hoher Kontrast",en:"High contrast",fr:"Contraste élevé",ja:"ハイコントラスト"},o_th_nacht:{de:"Nacht (gedimmt)",en:"Night (dimmed)",fr:"Nuit (atténué)",ja:"夜間（減光）"},o_th_ha:{de:"Farben des Home-Assistant-Designs",en:"Colours of the Home Assistant theme",fr:"Couleurs du thème Home Assistant",ja:"Home Assistant テーマの色"},e_modus:{de:"Editor",en:"Editor",fr:"Éditeur",ja:"エディター"},e_modus_h:{de:"Einfach zeigt nur die wichtigsten Einstellungen",en:"Simple shows only the most important settings",fr:"Simple n'affiche que les réglages essentiels",ja:"シンプルは主な設定のみ表示"},e_modus_einfach:{de:"Einfach",en:"Simple",fr:"Simple",ja:"シンプル"},e_modus_erweitert:{de:"Erweitert",en:"Advanced",fr:"Avancé",ja:"詳細"},e_entitaeten:{de:"Entitäten",en:"Entities",fr:"Entités",ja:"エンティティ"},e_entitaeten_h:{de:"Welche Entität aus Home Assistant zu welchem Wert der Karte gehört",en:"Which Home Assistant entity belongs to which value of the card",fr:"Quelle entité de Home Assistant correspond à quelle valeur de la carte",ja:"どの Home Assistant エンティティがカードのどの値に対応するか"},e_nur_fehlende:{de:"Nur fehlende anzeigen",en:"Show missing only",fr:"Afficher seulement les manquantes",ja:"未設定のみ表示"},e_zugeordnet:{de:"{a} von {b} zugeordnet",en:"{a} of {b} assigned",fr:"{a} sur {b} attribuées",ja:"{b} 件中 {a} 件割り当て済み"},e_alles_da:{de:"Alles zugeordnet, nichts fehlt.",en:"Everything assigned, nothing missing.",fr:"Tout est attribué, rien ne manque.",ja:"すべて割り当て済みです。"},e_werkzeuge:{de:"Import, Export und Anpassungen",en:"Import, export and customisation",fr:"Import, export et personnalisation",ja:"インポート・エクスポートとカスタマイズ"},e_werkzeuge_h:{de:"Konfiguration sichern, Geräteprofile und Sprachen",en:"Back up the configuration, device profiles and languages",fr:"Sauvegarder la configuration, profils d'appareil et langues",ja:"設定のバックアップ、デバイスプロファイル、言語"},e_w_konfig:{de:"Konfiguration",en:"Configuration",fr:"Configuration",ja:"設定"},e_w_profil:{de:"Geräteprofil",en:"Device profile",fr:"Profil d'appareil",ja:"デバイスプロファイル"},e_w_sprache:{de:"Sprache",en:"Language",fr:"Langue",ja:"言語"},f_ok:{de:"Gefunden",en:"Found",fr:"Trouvée",ja:"見つかりました"},f_fehlt:{de:"Diese Entität gibt es in Home Assistant nicht",en:"This entity does not exist in Home Assistant",fr:"Cette entité n'existe pas dans Home Assistant",ja:"このエンティティは Home Assistant にありません"},f_leer:{de:"Nicht zugeordnet",en:"Not assigned",fr:"Non attribuée",ja:"未割り当て"},f_erklaerung:{de:"Erklärung anzeigen",en:"Show explanation",fr:"Afficher l'explication",ja:"説明を表示"},e_d_allgemein:{de:"Allgemein",en:"General",fr:"Général",ja:"全般"},e_d_namen:{de:"Namen",en:"Names",fr:"Noms",ja:"名前"},e_d_anzeige:{de:"Was angezeigt wird",en:"What is shown",fr:"Ce qui est affiché",ja:"表示する内容"},e_d_groesse:{de:"Größe",en:"Size",fr:"Taille",ja:"サイズ"},e_d_kurve:{de:"Heizkurven-Diagramm",en:"Heating curve chart",fr:"Diagramme de la courbe",ja:"暖房曲線グラフ"},e_d_skalen:{de:"Farbskalen",en:"Colour scales",fr:"Échelles de couleur",ja:"カラースケール"},e_d_technik:{de:"Technik",en:"Technical",fr:"Technique",ja:"技術設定"},e_s_export:{de:"Sprache exportieren",en:"Export language",fr:"Exporter la langue",ja:"言語を書き出す"},e_s_import:{de:"Sprache importieren",en:"Import language",fr:"Importer une langue",ja:"言語を読み込む"},e_s_entfernen:{de:"Eigene Sprache entfernen",en:"Remove own language",fr:"Supprimer la langue personnelle",ja:"独自の言語を削除"},m_s_export_ok:{de:"Sprache „{n}“ wurde als Datei gespeichert und steht im Download-Ordner",en:"Language “{n}” has been saved as a file in your downloads folder",fr:"La langue « {n} » a été enregistrée dans le dossier des téléchargements",ja:"言語「{n}」をダウンロードフォルダに保存しました"},m_s_import_ok:{de:"Sprache „{n}“ importiert und ausgewählt: {z} Texte, {h} Hilfetexte",en:"Language “{n}” imported and selected: {z} texts, {h} help texts",fr:"Langue « {n} » importée et sélectionnée : {z} textes, {h} textes d'aide",ja:"言語「{n}」を読み込んで選択しました：テキスト {z} 件、ヘルプ {h} 件"},m_s_fehlen:{de:"{z} Texte fehlen, dort gilt die Grundsprache",en:"{z} texts are missing, the base language is used there",fr:"{z} textes manquent, la langue de base s'applique",ja:"{z} 件のテキストがなく、基本言語を使います"},m_s_platz:{de:"Platzhalter in geschweiften Klammern passen nicht, Grundsprache verwendet bei: {liste}",en:"placeholders in curly braces do not match, base language used for: {liste}",fr:"les espaces réservés entre accolades ne correspondent pas, langue de base utilisée pour : {liste}",ja:"波かっこのプレースホルダーが一致しないため基本言語を使用：{liste}"},m_s_zeichen:{de:"Spitze Klammern, gerade Anführungszeichen und Backticks sind nicht erlaubt, Grundsprache verwendet bei: {liste}",en:"angle brackets, straight double quotes and backticks are not allowed, base language used for: {liste}",fr:"les chevrons, guillemets droits et accents graves isolés ne sont pas autorisés, langue de base utilisée pour : {liste}",ja:"山かっこ、半角の二重引用符、バッククォートは使えないため基本言語を使用：{liste}"},m_s_unbekannt:{de:"{z} unbekannte Schlüssel ignoriert",en:"{z} unknown keys ignored",fr:"{z} clés inconnues ignorées",ja:"不明なキー {z} 件を無視しました"},m_s_format:{de:"Das ist keine Sprachdatei (format muss „lutarym-sprachpaket“ sein).",en:"This is not a language file (format must be “lutarym-sprachpaket”).",fr:"Ce n'est pas un fichier de langue (format doit être « lutarym-sprachpaket »).",ja:"言語ファイルではありません（format は「lutarym-sprachpaket」である必要があります）。"},m_s_version:{de:"Diese Version der Sprachdatei wird nicht unterstützt (erwartet: version 1).",en:"This language file version is not supported (expected: version 1).",fr:"Cette version du fichier de langue n'est pas prise en charge (attendu : version 1).",ja:"この言語ファイルのバージョンには対応していません（version 1 が必要です）。"},m_s_code:{de:"Der Sprachcode (code) fehlt oder ist ungültig, zum Beispiel „nl“ oder „pt-br“.",en:"The language code (code) is missing or invalid, for example “nl” or “pt-br”.",fr:"Le code de langue (code) manque ou n'est pas valide, par exemple « nl » ou « pt-br ».",ja:"言語コード（code）がないか無効です。例：「nl」「pt-br」。"},m_s_texte:{de:"Die Datei enthält keine bekannten Texte (texte).",en:"The file contains no known texts (texte).",fr:"Le fichier ne contient aucun texte connu (texte).",ja:"ファイルに既知のテキスト（texte）がありません。"},m_s_entfernt:{de:"Eigene Sprache entfernt, die Sprache folgt wieder Home Assistant.",en:"Own language removed, the language follows Home Assistant again.",fr:"Langue personnelle supprimée, la langue suit de nouveau Home Assistant.",ja:"独自の言語を削除しました。言語は再び Home Assistant に従います。"},m_s_zurueck:{de:"Anpassung entfernt, die eingebaute Übersetzung gilt wieder.",en:"Customisation removed, the built-in translation applies again.",fr:"Modification supprimée, la traduction intégrée s'applique de nouveau.",ja:"カスタムを削除し、内蔵の翻訳に戻しました。"},e_p_export:{de:"Profil exportieren",en:"Export profile",fr:"Exporter le profil",ja:"プロファイルを書き出す"},e_p_import:{de:"Profil importieren",en:"Import profile",fr:"Importer un profil",ja:"プロファイルを読み込む"},e_p_entfernen:{de:"Eigenes Profil entfernen",en:"Remove own profile",fr:"Supprimer le profil personnel",ja:"独自プロファイルを削除"},e_geraet:{de:"Integration / Gerät",en:"Integration / device",fr:"Intégration / appareil",ja:"統合 / 機器"},e_geraet_h:{de:"dieser Hersteller hat mehrere Integrationen",en:"this manufacturer has several integrations",fr:"ce fabricant a plusieurs intégrations",ja:"このメーカーには複数の統合があります"},e_mehrere:{de:"Mehrere Integrationen erkannt",en:"Several integrations detected",fr:"Plusieurs intégrations détectées",ja:"複数の統合を検出しました"},e_mehrere_h:{de:"bitte wählen, welche die Karte verwenden soll",en:"please choose which one the card should use",fr:"veuillez choisir celle que la carte doit utiliser",ja:"カードで使用する統合を選択してください"},o_p_auto:{de:"Automatisch erkennen",en:"Detect automatically",fr:"Détection automatique",ja:"自動検出"},o_p_ungetestet:{de:"(ungetestet)",en:"(untested)",fr:"(non testé)",ja:"（未検証）"},o_p_eigene_gruppe:{de:"Eigene Profile",en:"Own profiles",fr:"Profils personnels",ja:"独自プロファイル"},o_p_von:{de:"von {n}",en:"by {n}",fr:"par {n}",ja:"作成者 {n}"},o_p_bitte:{de:"Bitte wählen",en:"Please choose",fr:"Veuillez choisir",ja:"選択してください"},o_p_kandidat:{de:"{n}, {z} passende Felder",en:"{n}, {z} matching fields",fr:"{n}, {z} champs correspondants",ja:"{n}、一致する項目 {z} 件"},m_erkannt_mehrere:{de:"{z} Integrationen erkannt. Bis zur Auswahl wird „{n}“ verwendet.",en:"{z} integrations detected. Until you choose, “{n}” is used.",fr:"{z} intégrations détectées. En attendant votre choix, « {n} » est utilisé.",ja:"{z} 件の統合を検出しました。選択するまで「{n}」を使用します。"},m_auto:{de:"Automatisch:",en:"Automatic:",fr:"Automatique :",ja:"自動："},pi_titel:{de:"Über dieses Profil",en:"About this profile",fr:"À propos de ce profil",ja:"このプロファイルについて"},pi_titel_auto:{de:"Über das erkannte Profil",en:"About the detected profile",fr:"À propos du profil détecté",ja:"検出されたプロファイルについて"},pi_integration:{de:"Integration",en:"Integration",fr:"Intégration",ja:"統合"},pi_entwickler:{de:"Entwickler, Quelle",en:"Developer, source",fr:"Développeur, source",ja:"開発者・出典"},pi_version:{de:"Version",en:"Version",fr:"Version",ja:"バージョン"},pi_aenderung:{de:"Letzte Änderung",en:"Last change",fr:"Dernière modification",ja:"最終更新"},pi_stand:{de:"Stand der Prüfung {d}",en:"checked on {d}",fr:"vérifié le {d}",ja:"{d} 時点"},pi_eigen:{de:"eigenes Profil, unbekannt",en:"own profile, unknown",fr:"profil personnel, inconnue",ja:"独自プロファイルのため不明"},pi_core:{de:"Bestandteil von Home Assistant Core",en:"Part of Home Assistant Core",fr:"Fait partie de Home Assistant Core",ja:"Home Assistant Core に含まれる"},pi_mqtt:{de:"HeishaMon-Firmware über MQTT, keine Integration",en:"HeishaMon firmware via MQTT, no integration",fr:"Firmware HeishaMon via MQTT, sans intégration",ja:"MQTT 経由の HeishaMon ファームウェア（統合なし）"},pi_beschreibt:{de:"Profil beschreibt",en:"Profile covers",fr:"Le profil couvre",ja:"プロファイルの内容"},pi_felder:{de:"{z} Felder",en:"{z} fields",fr:"{z} champs",ja:"{z} 項目"},pi_ha:{de:"In Home Assistant",en:"In Home Assistant",fr:"Dans Home Assistant",ja:"Home Assistant 内"},pi_ha_text:{de:"{a} Entitäten der Integration, {b} von {c} Feldern zugeordnet",en:"{a} entities of the integration, {b} of {c} fields assigned",fr:"{a} entités de l'intégration, {b} champs sur {c} attribués",ja:"統合のエンティティ {a} 件、{c} 項目中 {b} 項目を割り当て"},pi_ha_keine:{de:"nicht gefunden",en:"not found",fr:"introuvable",ja:"見つかりません"},pi_steuern:{de:"Steuern aus der Karte",en:"Control from the card",fr:"Commande depuis la carte",ja:"カードから操作"},pi_steuern_ja:{de:"ja, stellbar: {z}",en:"yes, settable: {z}",fr:"oui, réglables : {z}",ja:"可能（操作項目 {z}）"},pi_steuern_nein:{de:"nein, nur Anzeige",en:"no, display only",fr:"non, affichage seul",ja:"不可（表示のみ）"},pi_hilfe:{de:"Hilfe in der Karte",en:"Help in the card",fr:"Aide dans la carte",ja:"カード内のヘルプ"},pi_hilfe_nein:{de:"nein, nur bei HeishaMon",en:"no, only with HeishaMon",fr:"non, seulement avec HeishaMon",ja:"なし（HeishaMon のみ）"},pi_getestet:{de:"Getestet",en:"Tested",fr:"Testé",ja:"検証"},pi_getestet_nein:{de:"nein, aus dem Quelltext abgeleitet",en:"no, derived from the source code",fr:"non, déduit du code source",ja:"未検証（ソースコードから作成）"},pi_getestet_eigen:{de:"eigenes Profil",en:"own profile",fr:"profil personnel",ja:"独自プロファイル"},pi_ja:{de:"ja",en:"yes",fr:"oui",ja:"あり"},b_temp:{de:"Temperaturen",en:"Temperatures",fr:"Températures",ja:"温度"},b_verdichter:{de:"Verdichter",en:"Compressor",fr:"Compresseur",ja:"圧縮機"},b_ventil:{de:"Umschaltventil",en:"Diverter valve",fr:"Vanne d'inversion",ja:"三方弁"},b_pumpe:{de:"Pumpe, Durchfluss",en:"Pump, flow",fr:"Pompe, débit",ja:"ポンプ・流量"},b_heizkreise:{de:"Heizkreise",en:"Heating circuits",fr:"Circuits de chauffage",ja:"暖房回路"},b_puffer:{de:"Puffer",en:"Buffer tank",fr:"Ballon tampon",ja:"バッファタンク"},b_warmwasser:{de:"Warmwasser",en:"Hot water",fr:"Eau chaude",ja:"給湯"},b_zusatz:{de:"Zusatzwärme",en:"Additional heat",fr:"Chaleur d'appoint",ja:"補助熱源"},b_energie:{de:"Leistung, Energie, COP",en:"Power, energy, COP",fr:"Puissance, énergie, COP",ja:"電力・エネルギー・COP"},b_zaehler:{de:"Zähler",en:"Counters",fr:"Compteurs",ja:"カウンター"},b_status:{de:"Status, Störung",en:"Status, fault",fr:"État, défaut",ja:"状態・異常"},b_kurve:{de:"Heizkurve",en:"Heating curve",fr:"Courbe de chauffe",ja:"暖房曲線"},b_sg:{de:"SG Ready",en:"SG Ready",fr:"SG Ready",ja:"SG Ready"},b_sonstige:{de:"Einstellungen",en:"Settings",fr:"Réglages",ja:"設定"},pr_github:{de:"Rückmeldung auf GitHub",en:"Feedback on GitHub",fr:"Retour sur GitHub",ja:"GitHub でフィードバック"},pr_kopieren:{de:"Bericht kopieren",en:"Copy report",fr:"Copier le rapport",ja:"レポートをコピー"},pr_hinweis:{de:"Der Bericht enthält Entity-IDs und aktuelle Werte deiner Anlage. Du siehst ihn auf GitHub vor dem Absenden und kannst ihn dort ändern.",en:"The report contains entity IDs and current values of your system. You see it on GitHub before submitting and can edit it there.",fr:"Le rapport contient les ID d'entités et les valeurs actuelles de votre installation. Vous le voyez sur GitHub avant l'envoi et pouvez le modifier.",ja:"レポートにはエンティティ ID と現在の値が含まれます。送信前に GitHub で確認・編集できます。"},pr_titel:{de:"Profil-Rückmeldung: {n}",en:"Profile feedback: {n}",fr:"Retour sur le profil : {n}",ja:"プロファイルのフィードバック：{n}"},pr_kopiert:{de:"Bericht kopiert.",en:"Report copied.",fr:"Rapport copié.",ja:"レポートをコピーしました。"},pr_gekuerzt:{de:"Der Bericht war für den Link zu lang und wurde gekürzt. Mit „Bericht kopieren“ lässt sich der vollständige Bericht ins Issue einfügen.",en:"The report was too long for the link and has been shortened. Use “Copy report” to paste the full report into the issue.",fr:"Le rapport était trop long pour le lien et a été raccourci. Avec « Copier le rapport », collez le rapport complet dans le ticket.",ja:"レポートがリンクには長すぎたため短縮しました。「レポートをコピー」で全文を Issue に貼り付けられます。"},o_p_eigen:{de:"(eigenes)",en:"(own)",fr:"(personnel)",ja:"（独自）"},o_p_angepasst:{de:"(angepasst)",en:"(customised)",fr:"(modifié)",ja:"（カスタム）"},m_p_export_ok:{de:"Profil „{n}“ wurde als Datei gespeichert und steht im Download-Ordner",en:"Profile “{n}” has been saved as a file in your downloads folder",fr:"Le profil « {n} » a été enregistré dans le dossier des téléchargements",ja:"プロファイル「{n}」をダウンロードフォルダに保存しました"},m_p_import_ok:{de:"Profil „{n}“ importiert und ausgewählt, {z} Felder beschrieben",en:"Profile “{n}” imported and selected, {z} fields described",fr:"Profil « {n} » importé et sélectionné, {z} champs décrits",ja:"プロファイル「{n}」を読み込んで選択しました。記述された項目 {z} 件"},m_p_gefunden:{de:"{z} davon in Home Assistant gefunden; mit „Aus Integration übernehmen“ zuordnen",en:"{z} of them found in Home Assistant; assign them with “Take over from integration”",fr:"{z} trouvés dans Home Assistant ; les attribuer avec « Reprendre de l'intégration »",ja:"Home Assistant で {z} 件見つかりました。「統合から取り込む」で割り当てます"},m_p_unbekannt:{de:"unbekannte Felder ignoriert: {liste}",en:"unknown fields ignored: {liste}",fr:"champs inconnus ignorés : {liste}",ja:"不明な項目を無視しました：{liste}"},m_p_format:{de:"Das ist keine Geräteprofil-Datei (format muss „lutarym-geraeteprofil“ sein).",en:"This is not a device profile file (format must be “lutarym-geraeteprofil”).",fr:"Ce n'est pas un fichier de profil (format doit être « lutarym-geraeteprofil »).",ja:"デバイスプロファイルのファイルではありません（format は「lutarym-geraeteprofil」である必要があります）。"},m_p_version:{de:"Diese Profilversion wird nicht unterstützt (erwartet: version 1).",en:"This profile version is not supported (expected: version 1).",fr:"Cette version de profil n'est pas prise en charge (attendu : version 1).",ja:"このプロファイルのバージョンには対応していません（version 1 が必要です）。"},m_p_id:{de:"Die Kennung (id) fehlt oder ist ungültig: 2 bis 40 Zeichen, nur a–z, 0–9, _ und -.",en:"The identifier (id) is missing or invalid: 2 to 40 characters, only a–z, 0–9, _ and -.",fr:"L'identifiant (id) manque ou n'est pas valide : 2 à 40 caractères, seulement a–z, 0–9, _ et -.",ja:"識別子（id）がないか無効です：2〜40 文字、a–z、0–9、_、- のみ。"},m_p_felder:{de:"Das Profil beschreibt kein bekanntes Feld (felder).",en:"The profile does not describe any known field (felder).",fr:"Le profil ne décrit aucun champ connu (felder).",ja:"プロファイルに既知の項目（felder）がありません。"},m_p_leer:{de:"Für dieses Profil gibt es noch keine Beschreibung.",en:"There is no description for this profile yet.",fr:"Ce profil n'a pas encore de description.",ja:"このプロファイルにはまだ記述がありません。"},m_p_entfernt:{de:"Eigenes Profil entfernt.",en:"Own profile removed.",fr:"Profil personnel supprimé.",ja:"独自プロファイルを削除しました。"},m_p_zurueck:{de:"Anpassung entfernt, das eingebaute Profil gilt wieder.",en:"Customisation removed, the built-in profile applies again.",fr:"Modification supprimée, le profil intégré s'applique de nouveau.",ja:"カスタムを削除し、内蔵プロファイルに戻しました。"},e_profil_h:{de:"Automatisch sucht alle bekannten Integrationen ab",en:"Automatic searches all known integrations",fr:"Automatique recherche toutes les intégrations connues",ja:"自動は既知のすべての統合を検索します"},e_anordnung:{de:"Anordnung",en:"Layout",fr:"Disposition",ja:"レイアウト"},e_anordnung_h:{de:"quer, hochkant oder klassisch wie bis Version 4.9 (2 Heizkreise, ohne Zusatzwärme)",en:"landscape, portrait or classic as up to version 4.9 (2 circuits, no additional heat)",fr:"paysage, portrait ou classique comme jusqu'à la version 4.9 (2 circuits, sans chaleur d'appoint)",ja:"横長、縦長、またはバージョン 4.9 までのクラシック（2 回路、追加熱源なし）"},e_klassisch:{de:"Querformat klassisch",en:"Landscape classic",fr:"Paysage classique",ja:"横長（クラシック）"},e_breite:{de:"Breite",en:"Width",fr:"Largeur",ja:"幅"},e_hoehe:{de:"Höhe",en:"Height",fr:"Hauteur",ja:"高さ"},e_pixel_auto:{de:"Pixel, 0 heißt automatisch",en:"pixels, 0 means automatic",fr:"pixels, 0 = automatique",ja:"ピクセル、0で自動"},e_rohr:{de:"Rohrinnendurchmesser",en:"Pipe inner diameter",fr:"Diamètre intérieur du tuyau",ja:"配管内径"},e_rohr_h:{de:"Millimeter, färbt den Durchfluss, 0 heißt aus",en:"millimetres, colours the flow rate, 0 means off",fr:"millimètres, colore le débit, 0 = désactivé",ja:"ミリ、流量を色分け、0で無効"},e_mqtt:{de:"MQTT Präfix",en:"MQTT prefix",fr:"Préfixe MQTT",ja:"MQTTプレフィックス"},e_mqtt_h:{de:"für Befehle an HeishaMon, falls Werte nur lesbar sind",en:"for commands to HeishaMon when values are read only",fr:"pour les commandes à HeishaMon si les valeurs sont en lecture seule",ja:"値が読み取り専用の場合にHeishaMonへ送るコマンド用"},e_vbreite:{de:"Breite des Stromverlaufs",en:"Width of the energy chart",fr:"Largeur du graphique de consommation",ja:"使用量グラフの幅"},e_vbreite_h:{de:"250 bis 700, im Hochformat höchstens 360",en:"250 to 700, at most 360 in portrait",fr:"250 à 700, au plus 360 en portrait",ja:"250〜700、縦長では最大360"},e_kx_von:{de:"Heizkurve Außen von",en:"Heat curve outdoor from",fr:"Courbe, extérieur de",ja:"暖房曲線 外気 最小"},e_kx_von_h:{de:"linker Rand der Skala in Grad",en:"left edge of the scale in degrees",fr:"bord gauche de l'échelle en degrés",ja:"目盛りの左端（度）"},e_kx_bis:{de:"Heizkurve Außen bis",en:"Heat curve outdoor to",fr:"Courbe, extérieur à",ja:"暖房曲線 外気 最大"},e_kx_bis_h:{de:"rechter Rand der Skala in Grad",en:"right edge of the scale in degrees",fr:"bord droit de l'échelle en degrés",ja:"目盛りの右端（度）"},e_ky_von:{de:"Heizkurve Vorlauf von",en:"Heat curve flow from",fr:"Courbe, départ de",ja:"暖房曲線 往き 最小"},e_ky_von_h:{de:"unterer Rand der Skala in Grad",en:"bottom of the scale in degrees",fr:"bas de l'échelle en degrés",ja:"目盛りの下端（度）"},e_ky_bis:{de:"Heizkurve Vorlauf bis",en:"Heat curve flow to",fr:"Courbe, départ à",ja:"暖房曲線 往き 最大"},e_ky_bis_h:{de:"oberer Rand der Skala in Grad",en:"top of the scale in degrees",fr:"haut de l'échelle en degrés",ja:"目盛りの上端（度）"},e_hs_kalt:{de:"Heizungsskala kalt",en:"Heating scale, cold",fr:"Échelle chauffage, froid",ja:"暖房色 低温"},e_hs_kalt_h:{de:"Grad, färbt Speicher und Leitungen",en:"degrees, colours tanks and pipes",fr:"degrés, colore ballons et tuyaux",ja:"度、タンクと配管を色分け"},e_hs_heiss:{de:"Heizungsskala heiß",en:"Heating scale, hot",fr:"Échelle chauffage, chaud",ja:"暖房色 高温"},e_grad:{de:"Grad",en:"degrees",fr:"degrés",ja:"度"},e_as_kalt:{de:"Außenskala kalt",en:"Outdoor scale, cold",fr:"Échelle extérieure, froid",ja:"外気色 低温"},e_as_kalt_h:{de:"Grad, färbt den Außenfühler",en:"degrees, colours the outdoor sensor",fr:"degrés, colore la sonde extérieure",ja:"度、外気センサーを色分け"},e_as_warm:{de:"Außenskala warm",en:"Outdoor scale, warm",fr:"Échelle extérieure, doux",ja:"外気色 高温"},e_l_hk1:{de:"Beschriftung Heizkreis 1",en:"Label circuit 1",fr:"Nom du circuit 1",ja:"回路1の表示名"},e_l_hk2:{de:"Beschriftung Heizkreis 2",en:"Label circuit 2",fr:"Nom du circuit 2",ja:"回路2の表示名"},e_l_hk_h:{de:"gilt für Schaubild und Regler",en:"used in the diagram and the controls",fr:"utilisé dans le schéma et les commandes",ja:"図と操作部に表示"},e_l_buf:{de:"Beschriftung Puffer",en:"Label buffer",fr:"Nom du ballon tampon",ja:"バッファーの表示名"},e_l_dhw:{de:"Beschriftung Warmwasser",en:"Label hot water",fr:"Nom de l'eau chaude",ja:"給湯の表示名"},e_frei:{de:"frei wählbar",en:"free text",fr:"texte libre",ja:"自由入力"},e_l_energy:{de:"Beschriftung Energie",en:"Label energy",fr:"Nom de l'énergie",ja:"エネルギーの表示名"},e_l_energy_h:{de:"leer lassen, dann wählt die Karte selbst",en:"leave empty to let the card choose",fr:"laisser vide pour un choix automatique",ja:"空欄ならカードが自動で選択"},e_demo:{de:"Demomodus",en:"Demo mode",fr:"Mode démo",ja:"デモモード"},e_demo_h:{de:"erfundene Werte zum Ausprobieren, die Anlage bleibt unberührt",en:"sample values for trying out, the system is not touched",fr:"valeurs fictives pour essayer, l'installation n'est pas modifiée",ja:"試用のための仮の値、機器には影響しません"},e_ziel_zeigen:{de:"Ziel im Puffer und Warmwasser",en:"Target in buffer and hot water",fr:"Cible dans le ballon tampon et l'eau chaude",ja:"バッファーと給湯の目標"},e_ziel_zeigen_h:{de:"Zeile „Ziel …“ anzeigen",en:"show the “Target …” line",fr:"afficher la ligne « Cible … »",ja:"「目標 …」の行を表示"},e_laedt_zeigen:{de:"Lädt ab im Puffer und Warmwasser",en:"Reload temperature in buffer and hot water",fr:"Recharge dans le ballon tampon et l'eau chaude",ja:"バッファーと給湯の再加熱温度"},e_hilfe_zeigen:{de:"Knopf „?“ für die Hilfe",en:"“?” button for help",fr:"Bouton « ? » pour l'aide",ja:"ヘルプの「?」ボタン"},e_hilfe_zeigen_h:{de:"unten rechts in der Karte anzeigen",en:"show at the bottom right of the card",fr:"afficher en bas à droite de la carte",ja:"カード右下に表示"},e_tuer_zeigen:{de:"Knopf für erweiterte Einstellungen",en:"Button for advanced settings",fr:"Bouton des réglages avancés",ja:"詳細設定のボタン"},e_tuer_zeigen_h:{de:"unten rechts an der Wärmepumpe anzeigen",en:"show at the bottom right of the heat pump",fr:"afficher en bas à droite de la pompe à chaleur",ja:"ヒートポンプ右下に表示"},e_laedt_zeigen_h:{de:"Zeile „Lädt ab …“ anzeigen",en:"show the “Reloads at …” line",fr:"afficher la ligne « Recharge à … »",ja:"「再加熱 …」の行を表示"},e_verlauf:{de:"Diagramme 24 Stunden",en:"24 hour charts",fr:"Graphiques 24 heures",ja:"24時間グラフ"},e_verlauf_h:{de:"Verbrauch, SG Ready und Temperaturen",en:"energy, SG Ready and temperatures",fr:"consommation, SG Ready et températures",ja:"使用量、SG Ready、温度"},e_verlauf_knopf:{de:"Als Knöpfe, Fenster beim Tippen",en:"As buttons, window on tap",fr:"Boutons, fenêtre au toucher",ja:"ボタン（タップで表示）"},e_verlauf_karte:{de:"Verbrauch dauerhaft in der Karte",en:"Energy always in the card",fr:"Consommation toujours dans la carte",ja:"使用量を常にカードに表示"},d_taktung:{de:"Taktung",en:"Cycling",fr:"Cycles",ja:"運転サイクル"},a_keine_laeufe:{de:"keine Verdichterläufe in den letzten 24 Stunden",en:"no compressor runs in the last 24 hours",fr:"aucun cycle du compresseur sur les 24 dernières heures",ja:"過去24時間に圧縮機の運転はありません"},a_keine_cop:{de:"Keine COP-Werte vorhanden. COP Heizen und COP Warmwasser im Editor zuordnen.",en:"No COP values available. Assign COP heating and COP hot water in the editor.",fr:"Aucune valeur de COP. Attribuez COP chauffage et COP eau chaude dans l'éditeur.",ja:"COP の値がありません。エディターで暖房 COP と給湯 COP を割り当ててください。"},a_cop_heiz:{de:"Ø COP Heizen 24 h",en:"avg COP heating 24 h",fr:"COP moy. chauffage 24 h",ja:"暖房 平均 COP 24時間"},a_cop_ww:{de:"Ø COP Warmwasser 24 h",en:"avg COP hot water 24 h",fr:"COP moy. eau chaude 24 h",ja:"給湯 平均 COP 24時間"},a_cop_gesamt:{de:"Ø COP gesamt",en:"avg COP overall",fr:"COP moy. global",ja:"全体 平均 COP"},a_cop_minmax:{de:"min · max Heizen",en:"min · max heating",fr:"min · max chauffage",ja:"暖房 最小・最大"},a_cop_groesse:{de:"Punktgröße = Laufzeit",en:"dot size = run time",fr:"taille du point = durée",ja:"点の大きさ＝運転時間"},a_t_ok:{de:"Taktung unauffällig",en:"Cycling looks fine",fr:"Cycles normaux",ja:"運転サイクルは正常"},a_t_einige:{de:"Einige kurze Läufe",en:"Some short runs",fr:"Quelques cycles courts",ja:"短い運転が少しあります"},a_t_viele:{de:"Viele kurze Läufe, Optimierung prüfen",en:"Many short runs, consider optimising",fr:"Nombreux cycles courts, optimisation à vérifier",ja:"短い運転が多く、最適化を検討してください"},a_t_starts:{de:"Viele Starts",en:"Many starts",fr:"Nombreux démarrages",ja:"起動回数が多い"},a_t_ok_d:{de:"{n} Starts, Ø {d} min Laufzeit, keine Läufe unter 10 min",en:"{n} starts, avg {d} min run time, no runs under 10 min",fr:"{n} démarrages, durée moy. {d} min, aucun cycle de moins de 10 min",ja:"起動 {n} 回、平均運転 {d} 分、10分未満の運転なし"},a_t_kurz_d:{de:"{k} von {n} Läufen unter 10 min, davon {s} unter 6 min.",en:"{k} of {n} runs under 10 min, {s} of them under 6 min.",fr:"{k} cycles sur {n} de moins de 10 min, dont {s} de moins de 6 min.",ja:"{n} 回中 {k} 回が10分未満、そのうち {s} 回が6分未満。"},a_t_starts_d:{de:"{n} Starts in 24 Stunden liegen über rund 15 Starts pro Tag, ab denen der Fraunhofer-Feldtest im Jahresmittel eine Prüfung nahelegt.",en:"{n} starts in 24 hours are above about 15 starts per day, the annual average from which the Fraunhofer field test suggests a check.",fr:"{n} démarrages en 24 heures dépassent environ 15 démarrages par jour, moyenne annuelle à partir de laquelle l'essai de terrain Fraunhofer conseille une vérification.",ja:"24時間で {n} 回の起動は、Fraunhofer の実地試験で年間平均として点検が勧められる1日約15回を超えています。"},a_t_rat:{de:"Hinweis: Heizkurve oder Schaltdifferenz (Hysterese) prüfen, im Zweifel mit dem Fachbetrieb.",en:"Note: check the heating curve or the switching differential (hysteresis), if in doubt with your installer.",fr:"Conseil : vérifier la courbe de chauffe ou le différentiel de commutation (hystérésis), en cas de doute avec l'installateur.",ja:"ヒント：暖房曲線やスイッチング差（ヒステリシス）を確認してください。不明な場合は施工業者にご相談ください。"},a_t_quelle:{de:"Richtwerte: 10 bis 20 min Laufzeit je Start (Bundesverband Wärmepumpe), unter etwa 6 min sinkt die Effizienz; bis etwa 15 Starts pro Tag im Jahresmittel unauffällig (Fraunhofer WP-QS). Praxiswerte, keine Norm. Die Bewertung ist ein Hinweis, keine Diagnose.",en:"Guide values: 10 to 20 min run time per start (German Heat Pump Association), efficiency drops below about 6 min; up to about 15 starts per day on annual average is unremarkable (Fraunhofer WP-QS). Practical values, not a standard. The assessment is a hint, not a diagnosis.",fr:"Valeurs indicatives : 10 à 20 min de fonctionnement par démarrage (association allemande des pompes à chaleur), l'efficacité baisse en dessous d'environ 6 min ; jusqu'à environ 15 démarrages par jour en moyenne annuelle, rien d'anormal (Fraunhofer WP-QS). Valeurs pratiques, pas une norme. L'évaluation est une indication, pas un diagnostic.",ja:"目安：起動1回あたり運転10〜20分（ドイツヒートポンプ協会）、約6分未満では効率が低下。年間平均で1日約15回までの起動は問題なし（Fraunhofer WP-QS）。実務上の目安で規格ではありません。評価はヒントであり診断ではありません。"},a_t_starts_k:{de:"Starts 24 h",en:"starts 24 h",fr:"démarrages 24 h",ja:"起動 24時間"},a_t_lauf:{de:"Ø Laufzeit",en:"avg run time",fr:"durée moy.",ja:"平均運転時間"},a_t_pause:{de:"Ø Pause",en:"avg pause",fr:"pause moy.",ja:"平均停止時間"},a_t_kurz_k:{de:"Läufe unter 10 min",en:"runs under 10 min",fr:"cycles < 10 min",ja:"10分未満の運転"},a_t_laeufe:{de:"Läufe",en:"Runs",fr:"Cycles",ja:"運転"},a_t_stunde:{de:"Starts je Stunde, Farbe nach dem kürzesten Lauf",en:"Starts per hour, colour by the shortest run",fr:"Démarrages par heure, couleur selon le cycle le plus court",ja:"1時間あたりの起動回数（色は最短の運転）"},a_t_stunde_t:{de:"{n} Starts",en:"{n} starts",fr:"{n} démarrages",ja:"起動 {n} 回"},a_t_l_sehrkurz:{de:"unter 6 min",en:"under 6 min",fr:"moins de 6 min",ja:"6分未満"},a_t_l_kurz:{de:"6 bis 10 min",en:"6 to 10 min",fr:"6 à 10 min",ja:"6〜10分"},a_t_l_gut:{de:"10 bis 20 min",en:"10 to 20 min",fr:"10 à 20 min",ja:"10〜20分"},a_t_l_sehrgut:{de:"über 20 min",en:"over 20 min",fr:"plus de 20 min",ja:"20分超"},a_c_gut:{de:"COP besser als erwartet",en:"COP better than expected",fr:"COP meilleur que prévu",ja:"COP は想定より良好"},a_c_rahmen:{de:"COP im erwarteten Bereich",en:"COP within the expected range",fr:"COP dans la plage attendue",ja:"COP は想定の範囲内"},a_c_unter:{de:"COP unter Erwartung",en:"COP below expectation",fr:"COP inférieur aux attentes",ja:"COP は想定を下回る"},a_c_schlecht:{de:"COP deutlich unter Erwartung",en:"COP clearly below expectation",fr:"COP nettement inférieur aux attentes",ja:"COP は想定を大きく下回る"},a_c_unter_d:{de:"Ø {p} % des erwarteten COP bei Ø {a} °C außen und Ø {v} °C Vorlauf",en:"avg {p} % of the expected COP at avg {a} °C outdoor and {v} °C flow",fr:"moy. {p} % du COP attendu à {a} °C extérieur et {v} °C départ en moyenne",ja:"平均外気温 {a} °C・往き温度 {v} °C で想定 COP の平均 {p} %"},a_c_ohne_t:{de:"Keine Bewertung möglich",en:"No assessment possible",fr:"Évaluation impossible",ja:"評価できません"},a_c_ohne_d:{de:"Für die Bewertung werden Außen- und Vorlauftemperatur gebraucht.",en:"The assessment needs outdoor and flow temperature.",fr:"L'évaluation nécessite la température extérieure et la température de départ.",ja:"評価には外気温と往き温度が必要です。"},a_c_erwartet:{de:"erwartet {c}",en:"expected {c}",fr:"attendu {c}",ja:"想定 {c}"},a_c_erwartung:{de:"erwarteter COP",en:"expected COP",fr:"COP attendu",ja:"想定 COP"},a_c_l_gut:{de:"ab 100 % der Erwartung",en:"100 % of expectation or more",fr:"100 % de l'attendu ou plus",ja:"想定の100%以上"},a_c_l_rahmen:{de:"85 bis 100 %",en:"85 to 100 %",fr:"85 à 100 %",ja:"85〜100%"},a_c_l_unter:{de:"70 bis 85 %",en:"70 to 85 %",fr:"70 à 85 %",ja:"70〜85%"},a_c_l_schlecht:{de:"unter 70 %",en:"under 70 %",fr:"moins de 70 %",ja:"70%未満"},a_c_zaehl:{de:"{k} von {n} Läufen erreichen mindestens 85 % des bei ihrer Außen- und Vorlauftemperatur erwarteten COP.",en:"{k} of {n} runs reach at least 85 % of the COP expected at their outdoor and flow temperature.",fr:"{k} cycles sur {n} atteignent au moins 85 % du COP attendu à leur température extérieure et de départ.",ja:"{n} 回中 {k} 回の運転が、その外気温と往き温度での想定 COP の85%以上に達しています。"},a_c_nur_ww:{de:"Schwächer sind nur Warmwasserläufe. Beim Aufheizen des Speichers steigt der Vorlauf während des Laufs, das senkt den COP.",en:"Only hot water runs are weaker. While the tank heats up, the flow temperature rises during the run, which lowers the COP.",fr:"Seuls les cycles d'eau chaude sont plus faibles. Pendant la chauffe du ballon, la température de départ monte au cours du cycle, ce qui baisse le COP.",ja:"低いのは給湯運転のみです。タンク加熱中は運転中に往き温度が上がるため COP が下がります。"},a_c_rat:{de:"Hinweis: Ein niedrigerer Vorlauf (Heizkurve) hebt den COP; kurze Läufe und häufiges Abtauen senken ihn.",en:"Note: a lower flow temperature (heating curve) raises the COP; short runs and frequent defrosting lower it.",fr:"Conseil : une température de départ plus basse (courbe de chauffe) augmente le COP ; les cycles courts et les dégivrages fréquents le réduisent.",ja:"ヒント：往き温度を下げる（暖房曲線）と COP は上がり、短い運転や頻繁な霜取りは COP を下げます。"},a_c_quelle:{de:"Erwartung: Carnot-COP aus Außen- und Vorlauftemperatur mal Gütegrad 0,42. Der Gütegrad ist der Mittelwert, der sich aus den Datenblattwerten der Panasonic Aquarea T-CAP M 12 kW an den Prüfpunkten A7, A2 und A-7 mit W35 und W55 ergibt (0,38 bis 0,47); für reale Geräte werden rund 0,45 genannt (42watt). Die Stufen 85 % und 70 % sind eigene Festlegungen. Hinweis, keine Diagnose.",en:"Expectation: Carnot COP from outdoor and flow temperature times an efficiency factor of 0.42. This is the average derived from the datasheet values of the Panasonic Aquarea T-CAP M 12 kW at the rating points A7, A2 and A-7 with W35 and W55 (0.38 to 0.47); about 0.45 is quoted for real devices (42watt). The 85 % and 70 % levels are the card's own choice. A hint, not a diagnosis.",fr:"Attendu : COP de Carnot à partir des températures extérieure et de départ, multiplié par un rendement de 0,42. C'est la moyenne déduite des valeurs de la fiche technique de la Panasonic Aquarea T-CAP M 12 kW aux points A7, A2 et A-7 avec W35 et W55 (0,38 à 0,47) ; environ 0,45 est cité pour les appareils réels (42watt). Les seuils de 85 % et 70 % sont un choix propre à la carte. Indication, pas un diagnostic.",ja:"想定値：外気温と往き温度から求めたカルノー COP に効率係数 0.42 を掛けたもの。この係数は Panasonic Aquarea T-CAP M 12 kW のデータシート（A7・A2・A-7、W35・W55）から求めた平均値です（0.38〜0.47）。実機では約0.45とされています（42watt）。85%と70%の区切りはカード独自の設定です。診断ではなくヒントです。"},a_t_kalt:{de:"Kurze Läufe auch bei Kälte, Optimierung prüfen",en:"Short runs even in cold weather, consider optimising",fr:"Cycles courts même par temps froid, optimisation à vérifier",ja:"低温時にも短い運転があり、最適化を検討してください"},a_t_mild_t:{de:"Kurze Läufe in der Übergangszeit",en:"Short runs in mild weather",fr:"Cycles courts en mi-saison",ja:"中間期の短い運転"},a_t_kalt_d:{de:"{k} kurze Läufe bei unter 5 °C außen: Dort ist die Heizlast hoch und mit geringer Last nicht zu erklären, Schaltdifferenz, Heizkurve und Durchfluss prüfen.",en:"{k} short runs below 5 °C outdoor: the heat load is high there and cannot explain them, check switching differential, heating curve and flow rate.",fr:"{k} cycles courts sous 5 °C extérieur : la charge de chauffage y est élevée et ne les explique pas, vérifier différentiel, courbe de chauffe et débit.",ja:"外気温5 °C未満での短い運転が {k} 回：この温度では暖房負荷が高く負荷不足では説明できません。スイッチング差、暖房曲線、流量を確認してください。"},a_t_mild_d:{de:"{k} kurze Läufe ab 10 °C außen: In der Übergangszeit liegt die Heizlast oft unter der kleinsten Leistung der Wärmepumpe, kurze Läufe sind dort häufiger.",en:"{k} short runs from 10 °C outdoor: in mild weather the heat load is often below the heat pump's minimum output, short runs are more common there.",fr:"{k} cycles courts à partir de 10 °C extérieur : en mi-saison, la charge est souvent inférieure à la puissance minimale de la pompe à chaleur, les cycles courts y sont plus fréquents.",ja:"外気温10 °C以上での短い運転が {k} 回：中間期は暖房負荷がヒートポンプの最小出力を下回ることが多く、短い運転が増えます。"},a_t_baender:{de:"Nach Außentemperatur",en:"By outdoor temperature",fr:"Selon la température extérieure",ja:"外気温別"},a_t_b1:{de:"unter 0 °C",en:"below 0 °C",fr:"sous 0 °C",ja:"0 °C未満"},a_t_b2:{de:"0 bis 5 °C",en:"0 to 5 °C",fr:"0 à 5 °C",ja:"0〜5 °C"},a_t_b3:{de:"5 bis 10 °C",en:"5 to 10 °C",fr:"5 à 10 °C",ja:"5〜10 °C"},a_t_b4:{de:"ab 10 °C",en:"from 10 °C",fr:"dès 10 °C",ja:"10 °C以上"},a_t_b_zeile:{de:"{n} Läufe · Ø {d} min · {k} kurz",en:"{n} runs · avg {d} min · {k} short",fr:"{n} cycles · moy. {d} min · {k} courts",ja:"{n} 回・平均 {d} 分・短い {k} 回"},a_t_b_leer:{de:"keine Läufe",en:"no runs",fr:"aucun cycle",ja:"運転なし"},d_analyse:{de:"Analyse",en:"Analysis",fr:"Analyse",ja:"分析"},an_titel:{de:"Analyse · 24 Stunden und Einstellungen",en:"Analysis · 24 hours and settings",fr:"Analyse · 24 heures et réglages",ja:"分析・24時間と設定"},an_ok:{de:"in Ordnung",en:"fine",fr:"correct",ja:"良好"},an_hinweis:{de:"Hinweis",en:"hint",fr:"remarque",ja:"注意"},an_pruefen:{de:"prüfen",en:"check",fr:"à vérifier",ja:"要確認"},an_unbekannt:{de:"keine Daten",en:"no data",fr:"pas de données",ja:"データなし"},an_g_gut:{de:"Die Anlage läuft gut",en:"The system is running well",fr:"L'installation fonctionne bien",ja:"システムは良好に動作しています"},an_g_hinweis:{de:"Läuft überwiegend gut, {n} Punkte ansehen",en:"Mostly fine, {n} points worth a look",fr:"Fonctionne globalement bien, {n} points à regarder",ja:"おおむね良好、{n} 件を確認してください"},an_g_pruefen:{de:"{n} Punkte prüfen",en:"{n} points to check",fr:"{n} points à vérifier",ja:"{n} 件を確認してください"},an_g_leer:{de:"Noch zu wenig Daten für eine Bewertung",en:"Not enough data for an assessment yet",fr:"Pas encore assez de données pour une évaluation",ja:"評価に必要なデータがまだ不足しています"},an_g_potenzial:{de:"Ansatzpunkte: {p}",en:"Starting points: {p}",fr:"Pistes : {p}",ja:"改善の候補：{p}"},an_gr_heiz:{de:"Heizbetrieb",en:"Heating",fr:"Chauffage",ja:"暖房運転"},an_gr_zusatz:{de:"Zusatzheizung und Abtauung",en:"Backup heater and defrosting",fr:"Appoint et dégivrage",ja:"補助ヒーターと霜取り"},an_gr_anlage:{de:"Warmwasser und Anlage",en:"Hot water and system",fr:"Eau chaude et installation",ja:"給湯とシステム"},an_richtwert:{de:"Richtwert",en:"Guide value",fr:"Valeur indicative",ja:"目安"},an_quelle:{de:"Quelle",en:"Source",fr:"Source",ja:"出典"},an_keine:{de:"keine",en:"none",fr:"aucune",ja:"なし"},an_keine_daten:{de:"Kein Verlauf vorhanden.",en:"No history available.",fr:"Aucun historique disponible.",ja:"履歴がありません。"},an_kein_heizlauf:{de:"Keine Heizläufe von mindestens 10 Minuten in den letzten 24 Stunden, oder Vorlauf und Rücklauf fehlen.",en:"No heating runs of at least 10 minutes in the last 24 hours, or flow and return are missing.",fr:"Aucun cycle de chauffage d'au moins 10 minutes sur les 24 dernières heures, ou départ et retour manquent.",ja:"過去24時間に10分以上の暖房運転がないか、往き・還り温度がありません。"},an_fuss:{de:"Die Analyse vergleicht Messwerte der letzten 24 Stunden und Einstellungen mit veröffentlichten Richtwerten. Sie ist ein Hinweis, keine Diagnose; Änderungen an der Anlage im Zweifel mit dem Fachbetrieb abstimmen.",en:"The analysis compares measurements of the last 24 hours and settings with published guide values. It is a hint, not a diagnosis; if in doubt, agree changes to the system with your installer.",fr:"L'analyse compare les mesures des 24 dernières heures et les réglages à des valeurs indicatives publiées. C'est une indication, pas un diagnostic ; en cas de doute, convenez des modifications avec l'installateur.",ja:"この分析は過去24時間の測定値と設定を公開されている目安と比較するもので、診断ではなくヒントです。変更する場合は必要に応じて施工業者にご相談ください。"},an_t_spreizung:{de:"Spreizung Vorlauf zu Rücklauf",en:"Flow to return spread",fr:"Écart départ / retour",ja:"往き・還りの温度差"},an_w_sp:{de:"Ø im Heizbetrieb",en:"avg while heating",fr:"moy. en chauffage",ja:"暖房運転中の平均"},an_r_sp_fbh:{de:"5 bis 7 K",en:"5 to 7 K",fr:"5 à 7 K",ja:"5〜7 K"},an_r_sp_hk:{de:"5 bis 7 K, Heizkörper bis 10 K",en:"5 to 7 K, radiators up to 10 K",fr:"5 à 7 K, radiateurs jusqu'à 10 K",ja:"5〜7 K、放熱器は10 Kまで"},an_sp_ok:{de:"Die Spreizung liegt im Richtwert.",en:"The spread is within the guide value.",fr:"L'écart est dans la valeur indicative.",ja:"温度差は目安の範囲内です。"},an_sp_klein:{de:"Die Spreizung liegt unter 5 K. Häufige Ursachen sind eine zu stark eingestellte Pumpe oder ein fehlender hydraulischer Abgleich. Folgen: mehr Pumpenstrom und häufigeres Takten.",en:"The spread is below 5 K. Common causes are a pump set too high or a missing hydraulic balance. Consequences: more pump power and more frequent cycling.",fr:"L'écart est inférieur à 5 K. Causes fréquentes : pompe réglée trop fort ou équilibrage hydraulique manquant. Conséquences : plus d'électricité pour la pompe et cycles plus fréquents.",ja:"温度差が5 K未満です。ポンプ設定が強すぎる、または水力バランス調整がないことがよくある原因です。ポンプ電力の増加と短いサイクルの増加につながります。"},an_sp_gross:{de:"Die Spreizung liegt über 10 K. Meist ist der Durchfluss zu gering, etwa durch einen verschmutzten Filter oder geschlossene Ventile. Folgen: höherer Druck im Kältekreis, schlechterer COP, Räume können kalt bleiben.",en:"The spread is above 10 K. The flow rate is usually too low, for example due to a clogged filter or closed valves. Consequences: higher refrigerant pressure, lower COP, rooms may stay cold.",fr:"L'écart dépasse 10 K. Le débit est généralement trop faible, par exemple filtre encrassé ou vannes fermées. Conséquences : pression plus élevée dans le circuit frigorifique, COP plus faible, pièces parfois froides.",ja:"温度差が10 Kを超えています。フィルターの詰まりやバルブの閉止などで流量が少なすぎることが多いです。冷媒圧力の上昇、COP の低下、部屋が暖まらない原因になります。"},an_sp_fbh:{de:"Die Spreizung liegt über 7 K. Für eine Fußbodenheizung ist das mehr als der Richtwert.",en:"The spread is above 7 K, more than the guide value for underfloor heating.",fr:"L'écart dépasse 7 K, plus que la valeur indicative pour un plancher chauffant.",ja:"温度差が7 Kを超えており、床暖房の目安を上回っています。"},an_sp_hk:{de:"Die Spreizung liegt zwischen 7 und 10 K. Bei Heizkörpern wird das noch toleriert, bei großer Kälte kann der Komfort sinken.",en:"The spread is between 7 and 10 K. This is still tolerated with radiators, comfort may drop in very cold weather.",fr:"L'écart est entre 7 et 10 K. C'est encore toléré avec des radiateurs, le confort peut baisser par grand froid.",ja:"温度差は7〜10 Kです。放熱器では許容範囲ですが、厳寒時には快適性が下がることがあります。"},an_tip_sp_klein:{de:"Tipp: Pumpendrehzahl bzw. Durchfluss senken und den hydraulischen Abgleich prüfen lassen.",en:"Tip: lower the pump speed or flow rate and have the hydraulic balance checked.",fr:"Conseil : baisser la vitesse de la pompe ou le débit et faire vérifier l'équilibrage hydraulique.",ja:"ヒント：ポンプ回転数または流量を下げ、水力バランス調整を点検してもらってください。"},an_tip_sp_gross:{de:"Tipp: Filter und Schmutzfänger reinigen, Ventile und Thermostatköpfe prüfen, Pumpenleistung kontrollieren.",en:"Tip: clean filters and dirt traps, check valves and thermostatic heads, check the pump output.",fr:"Conseil : nettoyer filtres et pots à boues, vérifier vannes et têtes thermostatiques, contrôler la puissance de la pompe.",ja:"ヒント：フィルターとストレーナーを清掃し、バルブとサーモスタットヘッド、ポンプ出力を確認してください。"},an_t_vl_fbh:{de:"Vorlauftemperatur bei Fußbodenheizung",en:"Flow temperature with underfloor heating",fr:"Température de départ (plancher chauffant)",ja:"床暖房の往き温度"},an_t_vl_hk:{de:"Vorlauftemperatur bei Heizkörpern",en:"Flow temperature with radiators",fr:"Température de départ (radiateurs)",ja:"放熱器の往き温度"},an_w_vl:{de:"höchster Ø eines Heizlaufs, bei {a} °C außen",en:"highest run average, at {a} °C outdoor",fr:"moyenne de cycle la plus haute, à {a} °C extérieur",ja:"運転平均の最高値（外気温 {a} °C）"},an_r_vl_fbh:{de:"30 bis 35 °C, Altbau bis 40 °C",en:"30 to 35 °C, older buildings up to 40 °C",fr:"30 à 35 °C, bâti ancien jusqu'à 40 °C",ja:"30〜35 °C、既存住宅は40 °Cまで"},an_r_vl_hk:{de:"45 bis 55 °C, höchstens 55 °C",en:"45 to 55 °C, at most 55 °C",fr:"45 à 55 °C, au plus 55 °C",ja:"45〜55 °C、最大55 °C"},an_vl_ok:{de:"Der Vorlauf liegt im Rahmen. Die Richtwerte gelten für die kälteste Auslegungstemperatur; an milden Tagen sollte er deutlich darunter liegen.",en:"The flow temperature is within range. The guide values apply to the coldest design temperature; on mild days it should be clearly lower.",fr:"La température de départ est dans la plage. Les valeurs indicatives valent pour la température de base la plus froide ; par temps doux, elle devrait être nettement plus basse.",ja:"往き温度は範囲内です。目安は最も寒い設計温度での値で、穏やかな日はそれより明らかに低いのが望ましいです。"},an_vl_fbh:{de:"Für eine Fußbodenheizung ist der Vorlauf hoch. Die Richtwerte gelten schon für die kälteste Auslegungstemperatur.",en:"The flow temperature is high for underfloor heating. The guide values already apply to the coldest design temperature.",fr:"La température de départ est élevée pour un plancher chauffant. Les valeurs indicatives valent déjà pour la température de base la plus froide.",ja:"床暖房としては往き温度が高めです。目安は最も寒い設計温度での値です。"},an_vl_hk:{de:"Der Vorlauf liegt über 55 °C. Die Verbraucherzentrale Rheinland-Pfalz empfiehlt höchstens 55 °C.",en:"The flow temperature is above 55 °C. The Verbraucherzentrale Rheinland-Pfalz recommends at most 55 °C.",fr:"La température de départ dépasse 55 °C. La Verbraucherzentrale Rhénanie-Palatinat recommande au plus 55 °C.",ja:"往き温度が55 °Cを超えています。ラインラント＝プファルツ消費者センターは最大55 °Cを推奨しています。"},an_vl_gemischt:{de:"Es gibt Fußbodenheizung und Heizkörper; bewertet wird nach den Heizkörpern.",en:"There is underfloor heating and radiators; the assessment uses the radiators.",fr:"Il y a plancher chauffant et radiateurs ; l'évaluation se base sur les radiateurs.",ja:"床暖房と放熱器があるため、放熱器を基準に評価しています。"},an_tip_vl:{de:"Tipp: Jedes Kelvin weniger Vorlauf spart nach Herstellerangaben bis zu 2,5 % Strom. Heizkurve schrittweise um 1 bis 2 K senken und einige Tage beobachten, ob alle Räume warm bleiben.",en:"Tip: according to manufacturers, each Kelvin less flow temperature saves up to 2.5 % electricity. Lower the heating curve step by step by 1 to 2 K and watch for a few days whether all rooms stay warm.",fr:"Conseil : selon les fabricants, chaque kelvin de moins au départ économise jusqu'à 2,5 % d'électricité. Baisser la courbe de chauffe par paliers de 1 à 2 K et observer quelques jours si toutes les pièces restent chaudes.",ja:"ヒント：メーカーによると往き温度を1 K下げるごとに電力を最大2.5%節約できます。暖房曲線を1〜2 Kずつ下げ、数日間すべての部屋が暖かいか確認してください。"},an_t_kurve:{de:"Heizkurve, Vorlauf am kalten Ende",en:"Heating curve, flow at the cold end",fr:"Courbe de chauffe, départ au point froid",ja:"暖房曲線（低温側の往き温度）"},an_w_kurve:{de:"eingestellt für {a} °C außen",en:"set for {a} °C outdoor",fr:"réglé pour {a} °C extérieur",ja:"外気温 {a} °C 用の設定"},an_kurve_ok:{de:"Die Heizkurve endet im Richtwert der Heizflächen.",en:"The heating curve ends within the guide value of the heating surfaces.",fr:"La courbe de chauffe se termine dans la valeur indicative des émetteurs.",ja:"暖房曲線は放熱面の目安内に収まっています。"},an_kurve_hoch:{de:"Die Heizkurve ist am kalten Ende höher als der Richtwert der Heizflächen.",en:"At the cold end the heating curve is higher than the guide value of the heating surfaces.",fr:"Au point froid, la courbe de chauffe dépasse la valeur indicative des émetteurs.",ja:"暖房曲線の低温側が放熱面の目安より高くなっています。"},an_tip_kurve:{de:"Tipp: Den Vorlauf am kalten Ende in kleinen Schritten senken, solange alle Räume warm werden.",en:"Tip: lower the flow at the cold end in small steps as long as all rooms get warm.",fr:"Conseil : baisser le départ au point froid par petits paliers tant que toutes les pièces chauffent.",ja:"ヒント：すべての部屋が暖まる範囲で、低温側の往き温度を少しずつ下げてください。"},an_t_taktung:{de:"Taktung",en:"Cycling",fr:"Cycles",ja:"運転サイクル"},an_w_starts:{de:"{n} Starts",en:"{n} starts",fr:"{n} démarrages",ja:"起動 {n} 回"},an_w_lauf:{de:"Ø {d} min Laufzeit",en:"avg {d} min run time",fr:"durée moy. {d} min",ja:"平均運転 {d} 分"},an_r_taktung:{de:"10 bis 20 min je Start, bis etwa 15 Starts am Tag",en:"10 to 20 min per start, up to about 15 starts a day",fr:"10 à 20 min par démarrage, jusqu'à environ 15 démarrages par jour",ja:"起動1回10〜20分、1日約15回まで"},an_tk_ok:{de:"Keine Läufe unter 10 Minuten. Details im Reiter Taktung.",en:"No runs under 10 minutes. Details in the Cycling tab.",fr:"Aucun cycle de moins de 10 minutes. Détails dans l'onglet Cycles.",ja:"10分未満の運転はありません。詳細は「運転サイクル」タブにあります。"},an_tk_kurz:{de:"{k} von {n} Läufen unter 10 Minuten. Details und Bewertung nach Außentemperatur im Reiter Taktung.",en:"{k} of {n} runs under 10 minutes. Details and assessment by outdoor temperature in the Cycling tab.",fr:"{k} cycles sur {n} de moins de 10 minutes. Détails et évaluation selon la température extérieure dans l'onglet Cycles.",ja:"{n} 回中 {k} 回が10分未満です。外気温別の詳細と評価は「運転サイクル」タブにあります。"},an_tip_taktung:{de:"Tipp: Schaltdifferenz (Hysterese) erhöhen, Heizkurve prüfen; in der Übergangszeit hilft oft auch ein Pufferspeicher.",en:"Tip: increase the switching differential (hysteresis) and check the heating curve; in mild weather a buffer tank often helps too.",fr:"Conseil : augmenter le différentiel de commutation (hystérésis) et vérifier la courbe de chauffe ; en mi-saison, un ballon tampon aide souvent aussi.",ja:"ヒント：スイッチング差（ヒステリシス）を大きくし、暖房曲線を確認してください。中間期にはバッファタンクも有効なことが多いです。"},an_t_cop:{de:"COP gegenüber Erwartung",en:"COP compared with expectation",fr:"COP par rapport à l'attendu",ja:"想定に対する COP"},an_w_cop:{de:"des erwarteten COP, Ø nach Laufzeit",en:"of the expected COP, run-time weighted",fr:"du COP attendu, pondéré par la durée",ja:"想定 COP に対する割合（運転時間で加重）"},an_r_cop:{de:"ab 85 %",en:"from 85 %",fr:"à partir de 85 %",ja:"85%以上"},an_cop_ok:{de:"Die Anlage erreicht den bei ihren Außen- und Vorlauftemperaturen zu erwartenden Wirkungsgrad. Details im Reiter COP.",en:"The system reaches the efficiency expected at its outdoor and flow temperatures. Details in the COP tab.",fr:"L'installation atteint le rendement attendu à ses températures extérieure et de départ. Détails dans l'onglet COP.",ja:"外気温と往き温度から想定される効率に達しています。詳細は COP タブにあります。"},an_cop_unter:{de:"Der COP liegt unter dem bei diesen Temperaturen zu erwartenden Wert. Details je Lauf im Reiter COP.",en:"The COP is below the value expected at these temperatures. Details per run in the COP tab.",fr:"Le COP est inférieur à la valeur attendue à ces températures. Détails par cycle dans l'onglet COP.",ja:"この温度条件で想定される値より COP が低くなっています。運転ごとの詳細は COP タブにあります。"},an_cop_ohne:{de:"COP, Außen- oder Vorlauftemperatur fehlen.",en:"COP, outdoor or flow temperature missing.",fr:"COP, température extérieure ou de départ manquante.",ja:"COP、外気温または往き温度がありません。"},an_tip_cop:{de:"Tipp: Vorlauf senken hebt den COP am stärksten; kurze Läufe und häufiges Abtauen senken ihn.",en:"Tip: lowering the flow temperature raises the COP the most; short runs and frequent defrosting lower it.",fr:"Conseil : baisser le départ augmente le plus le COP ; les cycles courts et les dégivrages fréquents le réduisent.",ja:"ヒント：往き温度を下げると COP が最も上がります。短い運転や頻繁な霜取りは COP を下げます。"},an_t_bivalenz:{de:"Heizstab, Einschaltgrenze",en:"Backup heater, switch-on limit",fr:"Appoint, seuil d'enclenchement",ja:"補助ヒーターの作動開始温度"},an_w_bivalenz:{de:"Heizstab ein unter",en:"heater on below",fr:"appoint en dessous de",ja:"この温度未満でヒーター作動"},an_r_bivalenz:{de:"−3 bis −7 °C",en:"−3 to −7 °C",fr:"−3 à −7 °C",ja:"−3〜−7 °C"},an_biv_ok:{de:"Die Einschaltgrenze liegt im üblichen Bereich des Bivalenzpunkts.",en:"The switch-on limit is within the usual range of the bivalent point.",fr:"Le seuil d'enclenchement est dans la plage habituelle du point de bivalence.",ja:"作動開始温度はバイバレントポイントの一般的な範囲内です。"},an_biv_hoch:{de:"Die Einschaltgrenze liegt über dem üblichen Bivalenzpunkt. Der Heizstab kann dann laufen, obwohl die Wärmepumpe allein reicht, und er liefert je kWh Strom nur 1 kWh Wärme.",en:"The switch-on limit is above the usual bivalent point. The heater may then run although the heat pump alone would be enough, and it delivers only 1 kWh of heat per kWh of electricity.",fr:"Le seuil est au-dessus du point de bivalence habituel. L'appoint peut alors fonctionner alors que la pompe à chaleur suffirait, et il ne fournit que 1 kWh de chaleur par kWh d'électricité.",ja:"作動開始温度が一般的なバイバレントポイントより高いため、ヒートポンプだけで足りる場合にもヒーターが動くことがあります。ヒーターは電力1 kWhあたり1 kWhの熱しか出しません。"},an_tip_bivalenz:{de:"Tipp: „Heizstab ein unter“ in Richtung −5 °C setzen.",en:"Tip: set “heater on below” towards −5 °C.",fr:"Conseil : régler « appoint en dessous de » vers −5 °C.",ja:"ヒント：「この温度未満でヒーター作動」を−5 °C付近に設定してください。"},an_t_heizstab:{de:"Heizstab, Laufzeit 24 h",en:"Backup heater, run time 24 h",fr:"Appoint, durée 24 h",ja:"補助ヒーター運転時間（24時間）"},an_w_heizstab:{de:"davon {w} min über 0 °C außen",en:"{w} min of it above 0 °C outdoor",fr:"dont {w} min au-dessus de 0 °C extérieur",ja:"うち外気温0 °C超で {w} 分"},an_r_heizstab:{de:"über 0 °C möglichst nicht",en:"ideally not above 0 °C",fr:"idéalement pas au-dessus de 0 °C",ja:"0 °C超ではできるだけ動かない"},an_hs_aus:{de:"Der Heizstab lief in den letzten 24 Stunden nicht.",en:"The backup heater did not run in the last 24 hours.",fr:"L'appoint n'a pas fonctionné ces dernières 24 heures.",ja:"過去24時間、補助ヒーターは作動していません。"},an_hs_ok:{de:"Der Heizstab lief nur kurz oder bei Frost.",en:"The backup heater ran only briefly or in frost.",fr:"L'appoint n'a fonctionné que brièvement ou par gel.",ja:"補助ヒーターの作動は短時間か氷点下のみです。"},an_hs_warm:{de:"Der Heizstab lief länger bei Plusgraden. Das nennen Auswertungen von Feldtests als Prüfzeichen; im Mittel liegt sein Anteil bei Luft-Wasser-Anlagen nur bei 1 bis 2 % des Stroms. (30 Minuten sind eine eigene Grenze der Karte.)",en:"The backup heater ran longer above freezing. Evaluations of field tests name this as a warning sign; on average its share in air-water systems is only 1 to 2 % of the electricity. (30 minutes is the card's own limit.)",fr:"L'appoint a fonctionné longtemps au-dessus de zéro. Les analyses d'essais de terrain y voient un signe d'alerte ; en moyenne sa part n'est que de 1 à 2 % de l'électricité des systèmes air-eau. (30 minutes est un seuil propre à la carte.)",ja:"補助ヒーターが0 °C超で長く作動しました。実地試験の分析では点検の目安とされ、空気熱源では電力の平均1〜2%にすぎません（30分はカード独自の基準）。"},an_tip_heizstab:{de:"Tipp: Einschaltgrenze und Freigabe des Heizstabs prüfen, auch die Warmwasserbereitung per Heizstab.",en:"Tip: check the switch-on limit and enable setting of the heater, including hot water heating by the heater.",fr:"Conseil : vérifier le seuil et l'autorisation de l'appoint, y compris pour l'eau chaude.",ja:"ヒント：ヒーターの作動開始温度と許可設定（給湯でのヒーター使用も含む）を確認してください。"},an_t_abtauung:{de:"Abtauung",en:"Defrosting",fr:"Dégivrage",ja:"霜取り"},an_w_abtau:{de:"Ø {d} min, bei {a} bis {b} °C",en:"avg {d} min, at {a} to {b} °C",fr:"moy. {d} min, entre {a} et {b} °C",ja:"平均 {d} 分、{a}〜{b} °C"},an_w_abtau_d:{de:"Ø {d} min",en:"avg {d} min",fr:"moy. {d} min",ja:"平均 {d} 分"},an_r_abtauung:{de:"5 bis 15 min, meist bei −5 bis +5 °C",en:"5 to 15 min, mostly at −5 to +5 °C",fr:"5 à 15 min, surtout entre −5 et +5 °C",ja:"5〜15分、主に−5〜+5 °C"},an_ab_keine:{de:"Keine Abtauung in den letzten 24 Stunden.",en:"No defrosting in the last 24 hours.",fr:"Aucun dégivrage ces dernières 24 heures.",ja:"過去24時間に霜取りはありません。"},an_ab_ok:{de:"Abtauungen in typischer Dauer.",en:"Defrosts of typical duration.",fr:"Dégivrages de durée habituelle.",ja:"霜取りは一般的な時間です。"},an_ab_lang:{de:"Die Abtauungen dauern im Mittel länger als 15 Minuten.",en:"On average the defrosts take longer than 15 minutes.",fr:"Les dégivrages durent en moyenne plus de 15 minutes.",ja:"霜取りの平均時間が15分を超えています。"},an_ab_warm:{de:"Es gab Abtauungen ab 10 °C außen. Vereisung bei Plusgraden gilt als Fehlerzeichen. (10 °C ist eine eigene Grenze der Karte.)",en:"There were defrosts from 10 °C outdoor. Icing at temperatures above freezing is considered a fault sign. (10 °C is the card's own limit.)",fr:"Il y a eu des dégivrages à partir de 10 °C extérieur. Le givrage par températures positives est considéré comme un signe de défaut. (10 °C est un seuil propre à la carte.)",ja:"外気温10 °C以上で霜取りがありました。プラスの気温での着霜は不具合の兆候とされます（10 °Cはカード独自の基準）。"},an_tip_abtauung:{de:"Tipp: Verdampfer auf Verschmutzung prüfen, Luftansaugung freihalten, Abtausteuerung vom Fachbetrieb prüfen lassen.",en:"Tip: check the evaporator for dirt, keep the air intake clear, have the defrost control checked.",fr:"Conseil : vérifier l'encrassement de l'évaporateur, dégager l'entrée d'air, faire vérifier la régulation du dégivrage.",ja:"ヒント：蒸発器の汚れを確認し、吸気口をふさがないようにし、霜取り制御を点検してもらってください。"},an_t_warmwasser:{de:"Warmwasser und Legionellenschutz",en:"Hot water and legionella protection",fr:"Eau chaude et protection anti-légionelles",ja:"給湯とレジオネラ対策"},an_w_steril:{de:"Soll, Legionellenschutz {s} °C",en:"setpoint, legionella cycle {s} °C",fr:"consigne, cycle anti-légionelles {s} °C",ja:"設定値、レジオネラ対策 {s} °C"},an_w_ww_soll:{de:"Soll",en:"setpoint",fr:"consigne",ja:"設定値"},an_r_warmwasser:{de:"ab 50 °C, regelmäßig über 60 °C",en:"from 50 °C, regularly above 60 °C",fr:"dès 50 °C, régulièrement au-dessus de 60 °C",ja:"50 °C以上、定期的に60 °C超"},an_ww_ok:{de:"Ab 50 °C wird das Wachstum von Legionellen laut DVGW praktisch gehemmt.",en:"According to DVGW, legionella growth is practically inhibited from 50 °C.",fr:"Selon le DVGW, la croissance des légionelles est pratiquement inhibée à partir de 50 °C.",ja:"DVGW によると50 °C以上でレジオネラの増殖はほぼ抑えられます。"},an_ww_hoch:{de:"Ab 50 °C wird das Wachstum von Legionellen gehemmt. Ein Soll über 55 °C kostet Effizienz, weil der Vorlauf beim Laden höher sein muss.",en:"Legionella growth is inhibited from 50 °C. A setpoint above 55 °C costs efficiency because the flow must be higher while charging.",fr:"La croissance des légionelles est inhibée dès 50 °C. Une consigne au-dessus de 55 °C coûte du rendement, car le départ doit être plus élevé pendant la charge.",ja:"50 °C以上でレジオネラの増殖は抑えられます。55 °Cを超える設定では加熱時の往き温度が高くなるため効率が下がります。"},an_ww_niedrig:{de:"Unter 50 °C können Legionellen wachsen; das Umweltbundesamt empfiehlt für Wohngebäude 55 bis 60 °C.",en:"Below 50 °C legionella can grow; the German Environment Agency recommends 55 to 60 °C for residential buildings.",fr:"En dessous de 50 °C, les légionelles peuvent se développer ; l'Agence fédérale de l'environnement recommande 55 à 60 °C pour les logements.",ja:"50 °C未満ではレジオネラが増殖する可能性があり、ドイツ連邦環境庁は住宅で55〜60 °Cを推奨しています。"},an_tip_ww_hoch:{de:"Tipp: Soll auf 50 bis 55 °C senken und den Legionellenschutz regelmäßig über 60 °C laufen lassen.",en:"Tip: lower the setpoint to 50 to 55 °C and run the legionella cycle regularly above 60 °C.",fr:"Conseil : baisser la consigne à 50-55 °C et lancer régulièrement le cycle anti-légionelles au-dessus de 60 °C.",ja:"ヒント：設定値を50〜55 °Cに下げ、レジオネラ対策を定期的に60 °C超で実行してください。"},an_tip_ww_niedrig:{de:"Tipp: Soll auf mindestens 50 °C stellen oder den Legionellenschutz regelmäßig über 60 °C laufen lassen.",en:"Tip: set at least 50 °C or run the legionella cycle regularly above 60 °C.",fr:"Conseil : régler au moins 50 °C ou lancer régulièrement le cycle anti-légionelles au-dessus de 60 °C.",ja:"ヒント：50 °C以上に設定するか、レジオネラ対策を定期的に60 °C超で実行してください。"},an_t_druck:{de:"Anlagendruck",en:"System pressure",fr:"Pression de l'installation",ja:"システム水圧"},an_r_druck:{de:"1,2 bis 2,0 bar plus 0,3 bar",en:"1.2 to 2.0 bar plus 0.3 bar",fr:"1,2 à 2,0 bar plus 0,3 bar",ja:"1.2〜2.0 bar＋0.3 bar"},an_dr_ok:{de:"Der Druck liegt im üblichen Bereich für Einfamilienhäuser.",en:"The pressure is within the usual range for single-family homes.",fr:"La pression est dans la plage habituelle des maisons individuelles.",ja:"戸建て住宅の一般的な範囲内です。"},an_dr_niedrig:{de:"Der Druck ist niedrig.",en:"The pressure is low.",fr:"La pression est basse.",ja:"水圧が低めです。"},an_dr_hoch:{de:"Der Druck ist hoch.",en:"The pressure is high.",fr:"La pression est élevée.",ja:"水圧が高めです。"},an_tip_dr_niedrig:{de:"Tipp: Wasser nachfüllen; fällt der Druck wiederholt, auf Undichtigkeit und Ausdehnungsgefäß prüfen lassen.",en:"Tip: top up water; if the pressure keeps dropping, have leaks and the expansion vessel checked.",fr:"Conseil : rajouter de l'eau ; si la pression baisse à nouveau, faire vérifier fuites et vase d'expansion.",ja:"ヒント：水を補充してください。繰り返し下がる場合は漏れと膨張タンクを点検してもらってください。"},an_tip_dr_hoch:{de:"Tipp: Druck im kalten Zustand prüfen; bleibt er hoch, Ausdehnungsgefäß prüfen lassen.",en:"Tip: check the pressure when cold; if it stays high, have the expansion vessel checked.",fr:"Conseil : vérifier la pression à froid ; si elle reste élevée, faire vérifier le vase d'expansion.",ja:"ヒント：冷えた状態で水圧を確認し、高いままなら膨張タンクを点検してもらってください。"},an_t_jaz:{de:"Jahresarbeitszahl seit 1. Januar",en:"Seasonal performance since 1 January",fr:"Performance annuelle depuis le 1er janvier",ja:"1月1日からの年間性能係数"},an_w_jaz:{de:"aus Wärme und Strom",en:"from heat and electricity",fr:"à partir de chaleur et électricité",ja:"熱量と電力量から"},an_r_jaz:{de:"ab 3,0, Feldmittel Luft-Wasser 3,4",en:"from 3.0, field average air-water 3.4",fr:"dès 3,0, moyenne terrain air-eau 3,4",ja:"3.0以上、空気熱源の実測平均3.4"},an_jaz_gut:{de:"Die Jahresarbeitszahl liegt über dem Mittel der Luft-Wasser-Wärmepumpen im Feldtest.",en:"The seasonal performance is above the average of air-water heat pumps in the field test.",fr:"La performance annuelle dépasse la moyenne des pompes à chaleur air-eau de l'essai de terrain.",ja:"年間性能係数は実地試験の空気熱源ヒートポンプの平均を上回っています。"},an_jaz_ok:{de:"Die Jahresarbeitszahl liegt über dem Mindestwert von 3,0, aber unter dem Feldmittel von 3,4.",en:"The seasonal performance is above the minimum of 3.0 but below the field average of 3.4.",fr:"La performance annuelle dépasse le minimum de 3,0 mais reste sous la moyenne terrain de 3,4.",ja:"年間性能係数は最低値3.0を上回っていますが、実測平均3.4を下回っています。"},an_jaz_niedrig:{de:"Die Jahresarbeitszahl liegt unter 3,0, dem Mindestwert der Förderung (BEG).",en:"The seasonal performance is below 3.0, the funding minimum (BEG).",fr:"La performance annuelle est inférieure à 3,0, le minimum de l'aide (BEG).",ja:"年間性能係数が補助金（BEG）の最低値3.0を下回っています。"},an_tip_jaz:{de:"Tipp: Vorlauf, Taktung und Heizstab-Anteil zuerst prüfen, sie haben den größten Einfluss.",en:"Tip: check flow temperature, cycling and backup heater share first, they have the biggest influence.",fr:"Conseil : vérifier d'abord la température de départ, les cycles et la part de l'appoint, ils ont le plus d'influence.",ja:"ヒント：影響の大きい往き温度、運転サイクル、補助ヒーターの割合をまず確認してください。"},an_t_stoerung:{de:"Störungen",en:"Faults",fr:"Défauts",ja:"異常"},an_st_ja:{de:"Die Wärmepumpe meldet einen Fehler.",en:"The heat pump reports an error.",fr:"La pompe à chaleur signale une erreur.",ja:"ヒートポンプがエラーを報告しています。"},an_st_nein:{de:"Keine Störung gemeldet.",en:"No fault reported.",fr:"Aucun défaut signalé.",ja:"異常の報告はありません。"},an_tip_stoerung:{de:"Tipp: Fehlercode in der Anleitung nachschlagen und bei Bedarf den Fachbetrieb informieren.",en:"Tip: look up the error code in the manual and inform your installer if needed.",fr:"Conseil : rechercher le code d'erreur dans la notice et prévenir l'installateur si nécessaire.",ja:"ヒント：取扱説明書でエラーコードを確認し、必要に応じて施工業者に連絡してください。"},d_temperaturen:{de:"Temperaturen",en:"Temperatures",fr:"Températures",ja:"温度"},d_24h:{de:"24 Stunden",en:"24 hours",fr:"24 heures",ja:"24時間"},e_anz_hk:{de:"Anzahl Heizkreise",en:"Number of circuits",fr:"Nombre de circuits",ja:"回路数"},e_anz_luefter:{de:"Anzahl Lüfter",en:"Number of fans",fr:"Nombre de ventilateurs",ja:"ファン数"},e_bewegung:{de:"Animation",en:"Animation",fr:"Animation",ja:"アニメーション"},e_bewegung_h:{de:"Automatisch: das Gerät entscheidet (Einstellung „Bewegung reduzieren“)",en:"Automatic: the device decides (setting “reduce motion”)",fr:"Automatique : l'appareil décide (réglage « réduire les animations »)",ja:"自動：端末の設定（視差効果を減らす）に従う"},e_tagesverbrauch:{de:"Tagesverbrauch aus dem Zählerstand rechnen",en:"Calculate daily energy from the meter reading",fr:"Calculer la consommation du jour à partir du compteur",ja:"メーター値から当日の使用量を計算"},e_alle_leeren:{de:"Alle leeren",en:"Clear all",fr:"Tout effacer",ja:"すべて消去"},e_datei_speichern:{de:"Als Datei speichern",en:"Save as file",fr:"Enregistrer dans un fichier",ja:"ファイルに保存"},e_datei_laden:{de:"Aus Datei laden",en:"Load from file",fr:"Charger un fichier",ja:"ファイルから読み込み"},e_uebernehmen:{de:"Aus Integration übernehmen",en:"Take over from integration",fr:"Reprendre de l'intégration",ja:"統合から取り込む"},e_feld_einlesen:{de:"Aus dem Feld einlesen",en:"Read from the field",fr:"Lire depuis le champ",ja:"欄から読み込む"},e_feld_schreiben:{de:"In das Feld schreiben",en:"Write to the field",fr:"Écrire dans le champ",ja:"欄に書き出す"},e_standardnamen:{de:"Standardnamen eintragen",en:"Fill in default names",fr:"Saisir les noms par défaut",ja:"標準名を入力"},e_1hk:{de:"1 Heizkreis",en:"1 circuit",fr:"1 circuit",ja:"1回路"},e_2hk:{de:"2 Heizkreise",en:"2 circuits",fr:"2 circuits",ja:"2回路"},e_1luefter:{de:"1 Lüfter",en:"1 fan",fr:"1 ventilateur",ja:"ファン1基"},e_2luefter:{de:"2 Lüfter",en:"2 fans",fr:"2 ventilateurs",ja:"ファン2基"},e_hoch:{de:"Hochformat",en:"Portrait",fr:"Portrait",ja:"縦長"},e_quer:{de:"Querformat",en:"Landscape",fr:"Paysage",ja:"横長"},e_hk1_bild:{de:"Bild Heizkreis 1",en:"Picture heating circuit 1",fr:"Image circuit 1",ja:"暖房回路 1 の図"},e_hk2_bild:{de:"Bild Heizkreis 2",en:"Picture heating circuit 2",fr:"Image circuit 2",ja:"暖房回路 2 の図"},e_rad_platte:{de:"Plattenheizkörper",en:"Panel radiator",fr:"Radiateur à panneaux",ja:"パネルラジエーター"},e_rad_glieder:{de:"Gliederheizkörper",en:"Column radiator",fr:"Radiateur à éléments",ja:"セクショナルラジエーター"},e_rad_fbh:{de:"Fußbodenheizung",en:"Underfloor heating",fr:"Plancher chauffant",ja:"床暖房"},e_auto:{de:"Automatisch",en:"Automatic",fr:"Automatique",ja:"自動"},e_darstellung:{de:"Darstellung",en:"Display",fr:"Affichage",ja:"表示"},e_integration:{de:"Integration",en:"Integration",fr:"Intégration",ja:"統合"},e_puffer:{de:"Heizungspuffer vorhanden",en:"Heating buffer installed",fr:"Ballon tampon présent",ja:"暖房バッファーあり"},e_zirk:{de:"Zirkulation",en:"Circulation",fr:"Circulation",ja:"循環"},e_zirk_h:{de:"automatisch sobald eine Zirkulationsentität zugeordnet ist",en:"automatic as soon as a circulation entity is assigned",fr:"automatique dès qu'une entité de circulation est attribuée",ja:"循環エンティティが割り当てられると自動"},e_puffer_auto_h:{de:"automatisch folgt TOP99, der Meldung der Wärmepumpe",en:"automatic follows TOP99, reported by the heat pump",fr:"automatique suit TOP99, signalé par la pompe à chaleur",ja:"自動の場合はヒートポンプのTOP99に従う"},e_anzeigen:{de:"Anzeigen",en:"Show",fr:"Afficher",ja:"表示"},e_ausblenden:{de:"Ausblenden",en:"Hide",fr:"Masquer",ja:"非表示"},e_vorhanden:{de:"Vorhanden",en:"Installed",fr:"Présent",ja:"あり"},e_nicht_vorhanden:{de:"Nicht vorhanden",en:"Not installed",fr:"Absent",ja:"なし"},m_erkannt_p:{de:"Profil „{n}“: {a} Entitäten gefunden, {b} davon passen zu dieser Karte.",en:"Profile “{n}”: {a} entities found, {b} of them match this card.",fr:"Profil « {n} » : {a} entités trouvées, dont {b} correspondent à cette carte.",ja:"プロファイル「{n}」：{a} 件のエンティティのうち {b} 件がこのカードに対応します。"},m_erkannt:{de:"Heishamon by Lutarym erkannt. {a} Entitäten gefunden, {b} davon passen zu dieser Karte.",en:"Heishamon by Lutarym detected. {a} entities found, {b} of them match this card.",fr:"Heishamon by Lutarym détecté. {a} entités trouvées, dont {b} correspondent à cette carte.",ja:"Heishamon by Lutarym を検出しました。{a} 件のエンティティのうち {b} 件がこのカードに対応します。"},m_nicht_erkannt:{de:"Keine Entitäten der Integration gefunden. Du kannst die Standardnamen eintragen und danach anpassen.",en:"No entities of the integration found. You can fill in the default names and adjust them afterwards.",fr:"Aucune entité de l'intégration trouvée. Vous pouvez saisir les noms par défaut puis les ajuster.",ja:"統合のエンティティが見つかりません。標準名を入力してから調整できます。"},m_json:{de:"Das ist kein gültiges JSON. Bitte den exportierten Text einfügen.",en:"This is not valid JSON. Please paste the exported text.",fr:"Ce n'est pas un JSON valide. Veuillez coller le texte exporté.",ja:"有効なJSONではありません。書き出したテキストを貼り付けてください。"},m_datei_ok:{de:"Datei wurde erzeugt und steht im Download-Ordner.",en:"The file has been created and is in your downloads folder.",fr:"Le fichier a été créé et se trouve dans le dossier des téléchargements.",ja:"ファイルを作成しました。ダウンロードフォルダにあります。"},m_keine_konfig:{de:"Der Text enthält keine Konfiguration.",en:"The text contains no configuration.",fr:"Le texte ne contient aucune configuration.",ja:"テキストに設定が含まれていません。"},m_datei_fehler:{de:"Die Datei konnte nicht erzeugt werden.",en:"The file could not be created.",fr:"Le fichier n'a pas pu être créé.",ja:"ファイルを作成できませんでした。"},m_datei_lesen:{de:"Die Datei konnte nicht gelesen werden.",en:"The file could not be read.",fr:"Le fichier n'a pas pu être lu.",ja:"ファイルを読み込めませんでした。"},m_im_feld:{de:"Konfiguration steht im Feld und ist markiert, zum Kopieren bereit.",en:"The configuration is in the field and selected, ready to copy.",fr:"La configuration est dans le champ et sélectionnée, prête à être copiée.",ja:"設定を欄に書き出して選択しました。コピーできます。"},m_einst:{de:"{n} Einstellungen",en:"{n} settings",fr:"{n} réglages",ja:"設定 {n} 件"},m_ent:{de:"{n} Entitäten übernommen",en:"{n} entities applied",fr:"{n} entités appliquées",ja:"エンティティ {n} 件を適用"},m_unb_einst:{de:"{n} unbekannte Einstellungen übersprungen",en:"{n} unknown settings skipped",fr:"{n} réglages inconnus ignorés",ja:"不明な設定 {n} 件をスキップ"},m_unb_felder:{de:"{n} unbekannte Felder übersprungen",en:"{n} unknown fields skipped",fr:"{n} champs inconnus ignorés",ja:"不明な項目 {n} 件をスキップ"},m_bereich:{de:"{n} mit unpassendem Bereich übersprungen",en:"{n} with an unsuitable domain skipped",fr:"{n} avec un domaine inadapté ignorés",ja:"ドメインが合わない {n} 件をスキップ"},m_fehlen:{de:"{n} davon gibt es in Home Assistant nicht: {liste}",en:"{n} of them do not exist in Home Assistant: {liste}",fr:"{n} n'existent pas dans Home Assistant : {liste}",ja:"そのうち {n} 件はHome Assistantにありません：{liste}"},m_weitere:{de:" und weitere",en:" and more",fr:" et d'autres",ja:" ほか"},m_nicht_an:{de:"ACHTUNG, nicht angekommen: {liste}",en:"WARNING, not applied: {liste}",fr:"ATTENTION, non appliqué : {liste}",ja:"注意、適用されていません：{liste}"},fld_outside_temp:{de:"Außentemperatur",en:"Outdoor temperature",fr:"Température extérieure",ja:"外気温"},fld_power_state:{de:"Wärmepumpe Status, grüne LED",en:"Heat pump status, green LED",fr:"État de la pompe à chaleur, LED verte",ja:"ヒートポンプ状態、緑LED"},fld_compressor:{de:"Verdichterdrehzahl",en:"Compressor frequency",fr:"Fréquence du compresseur",ja:"圧縮機周波数"},fld_fan1_rpm:{de:"Lüfter 1 Drehzahl",en:"Fan 1 speed",fr:"Vitesse ventilateur 1",ja:"ファン1回転数"},fld_fan2_rpm:{de:"Lüfter 2 Drehzahl",en:"Fan 2 speed",fr:"Vitesse ventilateur 2",ja:"ファン2回転数"},fld_defrost:{de:"Abtauung läuft",en:"Defrost running",fr:"Dégivrage en cours",ja:"除霜中"},fld_error:{de:"Fehlercode",en:"Error code",fr:"Code d'erreur",ja:"エラーコード"},fld_heatpump_state:{de:"Betriebszustand",en:"Operating state",fr:"État de fonctionnement",ja:"運転状態"},fld_force_defrost:{de:"Abtauen erzwingen",en:"Force defrost",fr:"Forcer le dégivrage",ja:"強制除霜"},fld_powerful_mode:{de:"Turbomodus",en:"Powerful mode",fr:"Mode puissance",ja:"パワフル運転"},fld_quiet_mode:{de:"Leisemodus",en:"Quiet mode",fr:"Mode silencieux",ja:"静音運転"},fld_power_now:{de:"Aktuelle Leistungsaufnahme",en:"Current power draw",fr:"Puissance absorbée actuelle",ja:"現在の消費電力"},fld_energy_today:{de:"Energiezähler",en:"Energy meter",fr:"Compteur d'énergie",ja:"電力量計"},fld_pv_power:{de:"PV Leistung aktuell",en:"Current PV power",fr:"Puissance PV actuelle",ja:"現在の太陽光出力"},fld_sg_k1:{de:"Kontakt K1 Sperre",en:"Contact K1, block",fr:"Contact K1, blocage",ja:"接点K1 停止"},fld_sg_k2:{de:"Kontakt K2 Anlauf",en:"Contact K2, start",fr:"Contact K2, démarrage",ja:"接点K2 起動"},fld_flow_temp:{de:"Vorlauftemperatur",en:"Flow temperature",fr:"Température de départ",ja:"往き温度"},fld_return_temp:{de:"Rücklauftemperatur",en:"Return temperature",fr:"Température de retour",ja:"還り温度"},fld_pump_speed:{de:"Primärpumpe Drehzahl",en:"Primary pump speed",fr:"Vitesse de la pompe primaire",ja:"一次ポンプ回転数"},fld_pump_flow:{de:"Durchflussmenge",en:"Flow rate",fr:"Débit",ja:"流量"},fld_three_way_valve:{de:"3-Wege-Umschaltventil",en:"Three-way diverter valve",fr:"Vanne trois voies",ja:"三方弁"},fld_water_pressure:{de:"Wasserdruck",en:"Water pressure",fr:"Pression d'eau",ja:"水圧"},fld_buffer_temp:{de:"Puffertemperatur",en:"Buffer temperature",fr:"Température du ballon tampon",ja:"バッファー温度"},fld_buffer_installed:{de:"Puffer vorhanden",en:"Buffer installed",fr:"Ballon tampon présent",ja:"バッファーあり"},fld_buffer_switch:{de:"Pufferbetrieb ein und aus",en:"Buffer mode on and off",fr:"Mode tampon marche et arrêt",ja:"バッファー運転の入切"},fld_curve_t_high:{de:"HK1 Heizkurve Vorlauf oben",en:"Circuit 1 heat curve, flow high",fr:"Circuit 1 courbe, départ haut",ja:"回路1 暖房曲線 往き 高"},fld_curve_t_low:{de:"HK1 Heizkurve Vorlauf unten",en:"Circuit 1 heat curve, flow low",fr:"Circuit 1 courbe, départ bas",ja:"回路1 暖房曲線 往き 低"},fld_curve_o_high:{de:"HK1 Heizkurve Außen oben",en:"Circuit 1 heat curve, outdoor high",fr:"Circuit 1 courbe, extérieur haut",ja:"回路1 暖房曲線 外気 高"},fld_curve_o_low:{de:"HK1 Heizkurve Außen unten",en:"Circuit 1 heat curve, outdoor low",fr:"Circuit 1 courbe, extérieur bas",ja:"回路1 暖房曲線 外気 低"},fld_curve2_t_high:{de:"HK2 Heizkurve Vorlauf oben",en:"Circuit 2 heat curve, flow high",fr:"Circuit 2 courbe, départ haut",ja:"回路2 暖房曲線 往き 高"},fld_curve2_t_low:{de:"HK2 Heizkurve Vorlauf unten",en:"Circuit 2 heat curve, flow low",fr:"Circuit 2 courbe, départ bas",ja:"回路2 暖房曲線 往き 低"},fld_curve2_o_high:{de:"HK2 Heizkurve Außen oben",en:"Circuit 2 heat curve, outdoor high",fr:"Circuit 2 courbe, extérieur haut",ja:"回路2 暖房曲線 外気 高"},fld_curve2_o_low:{de:"HK2 Heizkurve Außen unten",en:"Circuit 2 heat curve, outdoor low",fr:"Circuit 2 courbe, extérieur bas",ja:"回路2 暖房曲線 外気 低"},fld_buffer_delta:{de:"Puffer Hysterese",en:"Buffer hysteresis",fr:"Hystérésis du ballon tampon",ja:"バッファーのヒステリシス"},fld_buffer_target:{de:"Puffer Zieltemperatur",en:"Buffer target temperature",fr:"Température cible du ballon tampon",ja:"バッファー目標温度"},fld_room_heater:{de:"Heizstab Heizung freigegeben",en:"Heating element, heating: allowed",fr:"Appoint chauffage autorisé",ja:"暖房ヒーター許可"},fld_heater_internal:{de:"Heizstab intern läuft",en:"Internal heater running",fr:"Appoint interne en marche",ja:"内部ヒーター運転中"},fld_heater_external:{de:"Heizstab extern läuft",en:"External heater running",fr:"Appoint externe en marche",ja:"外部ヒーター運転中"},fld_cop_heating:{de:"COP Heizen",en:"COP heating",fr:"COP chauffage",ja:"COP 暖房"},fld_room_heater_switch:{de:"Heizstab Heizung freigeben",en:"Allow heating element, heating",fr:"Autoriser l'appoint chauffage",ja:"暖房ヒーター許可の切替"},fld_zones_state:{de:"Aktivierte Zonen",en:"Active zones",fr:"Zones actives",ja:"有効なゾーン"},fld_zones_select:{de:"Zonen umschalten",en:"Switch zones",fr:"Changer de zones",ja:"ゾーン切替"},fld_hk1_water:{de:"HK1 Wassertemperatur",en:"Circuit 1 water temperature",fr:"Circuit 1 température d'eau",ja:"回路1 水温"},fld_hk1_water_target:{de:"HK1 Wasser Sollwert",en:"Circuit 1 water target",fr:"Circuit 1 consigne d'eau",ja:"回路1 目標水温"},fld_hk1_pump:{de:"HK1 Pumpe läuft",en:"Circuit 1 pump running",fr:"Circuit 1 pompe en marche",ja:"回路1 ポンプ運転中"},fld_hk1_setpoint:{de:"HK1 Sollwert einstellbar",en:"Circuit 1 adjustable target",fr:"Circuit 1 consigne réglable",ja:"回路1 設定温度"},fld_hk1_switch:{de:"HK1 ein und aus",en:"Circuit 1 on and off",fr:"Circuit 1 marche et arrêt",ja:"回路1 入切"},fld_hk2_water:{de:"HK2 Wassertemperatur",en:"Circuit 2 water temperature",fr:"Circuit 2 température d'eau",ja:"回路2 水温"},fld_hk2_water_target:{de:"HK2 Wasser Sollwert",en:"Circuit 2 water target",fr:"Circuit 2 consigne d'eau",ja:"回路2 目標水温"},fld_hk2_pump:{de:"HK2 Pumpe läuft",en:"Circuit 2 pump running",fr:"Circuit 2 pompe en marche",ja:"回路2 ポンプ運転中"},fld_hk2_setpoint:{de:"HK2 Sollwert einstellbar",en:"Circuit 2 adjustable target",fr:"Circuit 2 consigne réglable",ja:"回路2 設定温度"},fld_hk2_switch:{de:"HK2 ein und aus",en:"Circuit 2 on and off",fr:"Circuit 2 marche et arrêt",ja:"回路2 入切"},fld_dhw_installed:{de:"Warmwasser vorhanden",en:"Hot water installed",fr:"Eau chaude présente",ja:"給湯あり"},fld_dhw_temp:{de:"Warmwasser Isttemperatur",en:"Hot water temperature",fr:"Température de l'eau chaude",ja:"給湯温度"},fld_dhw_heat_delta:{de:"Warmwasser Hysterese",en:"Hot water hysteresis",fr:"Hystérésis de l'eau chaude",ja:"給湯のヒステリシス"},fld_dhw_setpoint:{de:"Warmwasser Sollwert",en:"Hot water target",fr:"Consigne eau chaude",ja:"給湯設定温度"},fld_dhw_heater:{de:"Heizstab Warmwasser freigegeben",en:"Heating element, hot water: allowed",fr:"Appoint eau chaude autorisé",ja:"給湯ヒーター許可"},fld_dhw_force:{de:"Einmalig aufheizen",en:"Boost once",fr:"Chauffe unique",ja:"一回だけ加熱"},fld_dhw_force_state:{de:"Aufheizen läuft",en:"Boost running",fr:"Chauffe en cours",ja:"加熱中"},fld_force_sterilization:{de:"Legionellenschutz starten",en:"Start legionella cycle",fr:"Démarrer le cycle légionelles",ja:"レジオネラ運転を開始"},fld_sterilization_state:{de:"Legionellenschutz läuft",en:"Legionella cycle running",fr:"Cycle légionelles en cours",ja:"レジオネラ運転中"},fld_dhw_heater_switch:{de:"Heizstab Warmwasser freigeben",en:"Allow heating element, hot water",fr:"Autoriser l'appoint eau chaude",ja:"給湯ヒーター許可の切替"},fld_circulation_pump:{de:"Zirkulationspumpe läuft",en:"Circulation pump running",fr:"Pompe de circulation en marche",ja:"循環ポンプ運転中"},fld_cop_dhw:{de:"COP Warmwasser",en:"COP hot water",fr:"COP eau chaude",ja:"COP 給湯"},fld_circ_switch:{de:"Zirkulation Schalter (klickbar)",en:"Circulation switch (clickable)",fr:"Interrupteur de circulation (cliquable)",ja:"循環スイッチ（クリック可）"},fld_mode_select:{de:"Betriebsart umschalten",en:"Switch operating mode",fr:"Changer de mode",ja:"運転モード切替"},grp_0:{de:"Außenfühler",en:"Outdoor sensor",fr:"Sonde extérieure",ja:"外気センサー"},grp_1:{de:"Außengerät",en:"Outdoor unit",fr:"Unité extérieure",ja:"室外機"},grp_2:{de:"Heizkreis 1",en:"Circuit 1",fr:"Circuit 1",ja:"回路1"},grp_3:{de:"Heizkreis 2",en:"Circuit 2",fr:"Circuit 2",ja:"回路2"},grp_4:{de:"Heizkurve",en:"Heat curve",fr:"Courbe de chauffe",ja:"暖房曲線"},grp_5:{de:"Heizungspuffer",en:"Heating buffer",fr:"Ballon tampon",ja:"暖房バッファー"},grp_6:{de:"Primärkreis",en:"Primary circuit",fr:"Circuit primaire",ja:"一次回路"},grp_7:{de:"SG Ready",en:"SG Ready",fr:"SG Ready",ja:"SG Ready"},grp_8:{de:"Steuerung",en:"Control",fr:"Commande",ja:"制御"},grp_9:{de:"Warmwasser",en:"Hot water",fr:"Eau chaude",ja:"給湯"},hnw_0:{de:"gilt für beide",en:"applies to both",fr:"vaut pour les deux",ja:"両方に適用"},hnw_1:{de:"eigener Schalter, optional",en:"own switch, optional",fr:"interrupteur propre, facultatif",ja:"独自スイッチ、任意"},hnw_2:{de:"Shelly, Relais oder Eingang",en:"Shelly, relay or input",fr:"Shelly, relais ou entrée",ja:"Shelly、リレーまたは入力"},hnw_3:{de:"eigene Entität, Watt",en:"own entity, watts",fr:"entité propre, watts",ja:"独自エンティティ、ワット"},hnw_4:{de:"Soll Vorlauf",en:"flow target",fr:"consigne départ",ja:"往き目標"},hnw_5:{de:"Shelly oder eigener Schalter",en:"Shelly or own switch",fr:"Shelly ou interrupteur propre",ja:"Shellyまたは独自スイッチ"},hnw_6:{de:"Switch zum Ein/Ausschalten der Zirkulation",en:"switch to turn circulation on and off",fr:"interrupteur pour la circulation",ja:"循環の入切スイッチ"},hnw_7:{de:"SetHeatpump oder TOP0",en:"SetHeatpump or TOP0",fr:"SetHeatpump ou TOP0",ja:"SetHeatpump または TOP0"},fld_hk3_water:{de:"HK3 Wassertemperatur",en:"Circuit 3 water temperature",fr:"Circuit 3 température d'eau",ja:"回路3 水温"},fld_hk3_pump:{de:"HK3 Pumpe läuft",en:"Circuit 3 pump running",fr:"Circuit 3 pompe en marche",ja:"回路3 ポンプ運転中"},fld_hk3_switch:{de:"HK3 ein und aus",en:"Circuit 3 on and off",fr:"Circuit 3 marche et arrêt",ja:"回路3 入切"},fld_hk4_water:{de:"HK4 Wassertemperatur",en:"Circuit 4 water temperature",fr:"Circuit 4 température d'eau",ja:"回路4 水温"},fld_hk4_pump:{de:"HK4 Pumpe läuft",en:"Circuit 4 pump running",fr:"Circuit 4 pompe en marche",ja:"回路4 ポンプ運転中"},fld_hk4_switch:{de:"HK4 ein und aus",en:"Circuit 4 on and off",fr:"Circuit 4 marche et arrêt",ja:"回路4 入切"},fld_kamin_temp:{de:"Kamin Temperatur",en:"Stove temperature",fr:"Température du poêle",ja:"薪ストーブ温度"},fld_kamin_pump:{de:"Kamin Pumpe läuft",en:"Stove pump running",fr:"Pompe du poêle en marche",ja:"薪ストーブ ポンプ運転中"},fld_solar_temp:{de:"Solarthermie Temperatur",en:"Solar thermal temperature",fr:"Température solaire thermique",ja:"太陽熱温度"},fld_solar_pump:{de:"Solarthermie Pumpe läuft",en:"Solar thermal pump running",fr:"Pompe solaire en marche",ja:"太陽熱ポンプ運転中"},grp_11:{de:"Heizkreis 3",en:"Heating circuit 3",fr:"Circuit de chauffage 3",ja:"暖房回路 3"},grp_12:{de:"Heizkreis 4",en:"Heating circuit 4",fr:"Circuit de chauffage 4",ja:"暖房回路 4"},grp_13:{de:"Zusatzwärme",en:"Additional heat",fr:"Chaleur d'appoint",ja:"追加熱源"},hnw_9:{de:"eigene Entität, °C",en:"own entity, °C",fr:"entité propre, °C",ja:"独自エンティティ、°C"},hnw_10:{de:"eigener Schalter oder Sensor",en:"own switch or sensor",fr:"interrupteur ou capteur propre",ja:"独自のスイッチまたはセンサー"},hnw_11:{de:"eigene Entität, °C; Kamin allein: TOP47",en:"own entity, °C; stove only: TOP47",fr:"entité propre, °C ; poêle seul : TOP47",ja:"独自エンティティ、°C。薪ストーブのみ：TOP47"},hnw_12:{de:"eigener Schalter oder Sensor; Kamin allein: OPT5",en:"own switch or sensor; stove only: OPT5",fr:"interrupteur ou capteur propre ; poêle seul : OPT5",ja:"独自のスイッチまたはセンサー。薪ストーブのみ：OPT5"},kamin:{de:"Kamin",en:"Stove",fr:"Poêle",ja:"薪ストーブ"},solarthermie:{de:"Solarthermie",en:"Solar thermal",fr:"Solaire thermique",ja:"太陽熱"},e_zusatz:{de:"Zusatzwärme am Puffer",en:"Additional heat at the buffer",fr:"Chaleur d'appoint au ballon tampon",ja:"バッファーの追加熱源"},e_zusatz_h:{de:"nur mit Heizungspuffer",en:"only with a heating buffer",fr:"uniquement avec ballon tampon",ja:"バッファーがある場合のみ"},e_feuer_ab:{de:"Feuer im Kamin ab",en:"Fire in the stove from",fr:"Feu dans le poêle à partir de",ja:"薪ストーブの炎の表示温度"},e_feuer_ab_h:{de:"°C Kamintemperatur, Standard 30",en:"°C stove temperature, default 30",fr:"°C température du poêle, 30 par défaut",ja:"薪ストーブ温度 °C、既定 30"},e_sonne_ab:{de:"Sonne über Solarthermie ab",en:"Sun above solar thermal from",fr:"Soleil sur le solaire thermique à partir de",ja:"太陽熱の太陽表示温度"},e_sonne_ab_h:{de:"°C Kollektortemperatur, Standard 30",en:"°C collector temperature, default 30",fr:"°C température du capteur, 30 par défaut",ja:"集熱器温度 °C、既定 30"},e_solarstil:{de:"Solarthermie Darstellung",en:"Solar thermal style",fr:"Style du solaire thermique",ja:"太陽熱の表示"},e_solarstil_h:{de:"Bild und Animation, wenn die Sonne scheint",en:"picture and animation while the sun shines",fr:"image et animation quand le soleil brille",ja:"太陽が出ているときの図とアニメーション"},o_solar_strahlen:{de:"Lichtstrahlen und Zellenwelle",en:"Light rays and cell wave",fr:"Rayons et vague de cellules",ja:"光線とセルの波"},o_solar_funkeln:{de:"Aufwärmen und Funkeln",en:"Warming and sparkle",fr:"Réchauffement et scintillement",ja:"加熱ときらめき"},o_solar_roehren:{de:"Röhrenkollektor",en:"Tube collector",fr:"Capteur à tubes",ja:"真空管集熱器"},e_zusatz_beide:{de:"Kamin und Solarthermie",en:"Stove and solar thermal",fr:"Poêle et solaire thermique",ja:"薪ストーブと太陽熱"},e_3hk:{de:"3 Heizkreise",en:"3 circuits",fr:"3 circuits",ja:"3回路"},e_4hk:{de:"4 Heizkreise",en:"4 circuits",fr:"4 circuits",ja:"4回路"},e_hk3_bild:{de:"Bild Heizkreis 3",en:"Picture heating circuit 3",fr:"Image circuit 3",ja:"暖房回路 3 の図"},e_hk4_bild:{de:"Bild Heizkreis 4",en:"Picture heating circuit 4",fr:"Image circuit 4",ja:"暖房回路 4 の図"},e_l_hk3:{de:"Beschriftung Heizkreis 3",en:"Label circuit 3",fr:"Nom du circuit 3",ja:"回路3の表示名"},e_l_hk4:{de:"Beschriftung Heizkreis 4",en:"Label circuit 4",fr:"Nom du circuit 4",ja:"回路4の表示名"},hnw_8:{de:"Quelle in der Integration unter COP Quelle wählbar",en:"source selectable in the integration under COP source",fr:"source réglable dans l'intégration sous Source COP",ja:"ソースは統合の COP ソースで選択"},grp_10:{de:"Erweiterte Einstellungen",en:"Advanced settings",fr:"Réglages avancés",ja:"詳細設定"},fld_heating_off_temp:{de:"Heizen aus ab Außentemperatur",en:"Heating off above outdoor temp.",fr:"Arrêt chauffage au-dessus de",ja:"暖房停止 外気温"},fld_heater_on_temp:{de:"Heizstab ein unter Außentemperatur",en:"Heater on below outdoor temp.",fr:"Appoint actif en dessous de",ja:"ヒーター開始 外気温"},fld_heat_delta:{de:"Spreizung Heizen",en:"Heating spread (ΔT)",fr:"Écart chauffage (ΔT)",ja:"暖房温度差 (ΔT)"},fld_heating_control:{de:"Regelung",en:"Heating control",fr:"Régulation",ja:"暖房制御"},fld_steril_temp:{de:"Legionellen Temperatur",en:"Legionella temperature",fr:"Température anti-légionelles",ja:"レジオネラ対策温度"},fld_steril_time:{de:"Legionellen Haltezeit",en:"Legionella hold time",fr:"Durée anti-légionelles",ja:"レジオネラ対策保持時間"},fld_pump_flow_mode:{de:"Pumpenregelung",en:"Pump control",fr:"Régulation de pompe",ja:"ポンプ制御"},fld_pump_max_duty:{de:"Max. Pumpenleistung",en:"Max. pump duty",fr:"Puissance max. pompe",ja:"ポンプ最大出力"},fld_quiet_priority:{de:"Leisemodus Vorrang",en:"Quiet mode priority",fr:"Priorité mode silencieux",ja:"静音モード優先"},o_komfort:{de:"Komfort",en:"Comfort",fr:"Confort",ja:"快適"},o_effizienz:{de:"Effizienz",en:"Efficiency",fr:"Efficacité",ja:"効率"},o_spreizung:{de:"Spreizung",en:"Spread",fr:"Écart",ja:"温度差"},o_max_leistung:{de:"Max. Leistung",en:"Max. duty",fr:"Puissance max.",ja:"最大出力"},o_lautstaerke:{de:"Lautstärke",en:"Sound",fr:"Son",ja:"静音"},o_leistung:{de:"Leistung",en:"Capacity",fr:"Puissance",ja:"能力"},k_heating_off_temp:{de:"Heizen aus ab",en:"Heating off above",fr:"Arrêt au-dessus de",ja:"暖房停止"},k_heater_on_temp:{de:"Heizstab unter",en:"Heater below",fr:"Appoint sous",ja:"ヒーター開始"},k_heat_delta:{de:"Spreizung",en:"Spread",fr:"Écart",ja:"温度差"},k_heating_control:{de:"Regelung",en:"Control",fr:"Régulation",ja:"制御"},k_steril_temp:{de:"Temperatur",en:"Temperature",fr:"Température",ja:"温度"},k_steril_time:{de:"Haltezeit",en:"Hold time",fr:"Durée",ja:"保持時間"},k_pump_flow_mode:{de:"Regelung",en:"Control",fr:"Régulation",ja:"制御"},k_pump_max_duty:{de:"Max. Leistung",en:"Max. duty",fr:"Puissance max.",ja:"最大出力"},k_quiet_priority:{de:"Vorrang",en:"Priority",fr:"Priorité",ja:"優先"},t_legionellen:{de:"Legionellenschutz",en:"Legionella protection",fr:"Anti-légionelles",ja:"レジオネラ対策"},t_leise:{de:"Leisemodus",en:"Quiet mode",fr:"Mode silencieux",ja:"静音モード"},fld_holiday_mode:{de:"Urlaubsmodus",en:"Holiday mode",fr:"Mode vacances",ja:"休暇モード"},fld_main_schedule:{de:"Wochenprogramm",en:"Weekly schedule",fr:"Programme hebdomadaire",ja:"週間スケジュール"},fld_smart_dhw:{de:"Smart DHW Warmwasser",en:"Smart DHW",fr:"Smart DHW eau chaude",ja:"スマート給湯"},fld_operating_hours:{de:"Betriebsstunden",en:"Operating hours",fr:"Heures de fonctionnement",ja:"運転時間"},fld_compressor_starts:{de:"Verdichterstarts",en:"Compressor starts",fr:"Démarrages du compresseur",ja:"圧縮機起動回数"},fld_room_heater_hours:{de:"Heizstab Heizen Betriebsstunden",en:"Heater hours, heating",fr:"Heures appoint chauffage",ja:"暖房ヒーター運転時間"},fld_dhw_heater_hours:{de:"Heizstab Warmwasser Betriebsstunden",en:"Heater hours, hot water",fr:"Heures appoint eau chaude",ja:"給湯ヒーター運転時間"},k_holiday_mode:{de:"Urlaub",en:"Holiday",fr:"Vacances",ja:"休暇"},k_main_schedule:{de:"Wochenprogramm",en:"Weekly schedule",fr:"Programme hebdo",ja:"週間スケジュール"},k_smart_dhw:{de:"Smart DHW",en:"Smart DHW",fr:"Smart DHW",ja:"スマート給湯"},k_operating_hours:{de:"Betriebsstunden",en:"Operating hours",fr:"Heures",ja:"運転時間"},k_compressor_starts:{de:"Verdichterstarts",en:"Compressor starts",fr:"Démarrages",ja:"起動回数"},k_room_heater_hours:{de:"Heizstab Heizen",en:"Heater, heating",fr:"Appoint chauffage",ja:"暖房ヒーター"},k_dhw_heater_hours:{de:"Heizstab Warmwasser",en:"Heater, hot water",fr:"Appoint eau chaude",ja:"給湯ヒーター"},o_aus:{de:"Aus",en:"Off",fr:"Arrêt",ja:"オフ"},o_ein:{de:"Ein",en:"On",fr:"Marche",ja:"オン"},o_variabel:{de:"Variabel",en:"Variable",fr:"Variable",ja:"可変"},o_standard:{de:"Standard",en:"Standard",fr:"Standard",ja:"標準"},t_quittieren:{de:"Quittieren",en:"Reset",fr:"Acquitter",ja:"リセット"},t_betrieb:{de:"Betrieb",en:"Operation",fr:"Fonctionnement",ja:"運転"},t_cop:{de:"Leistungszahl (COP)",en:"Coefficient of performance (COP)",fr:"Coefficient de performance (COP)",ja:"成績係数（COP）"},j_cop_heute:{de:"Heute COP {v}",en:"Today COP {v}",fr:"Aujourd'hui COP {v}",ja:"今日の COP {v}"},t_jaz:{de:"Jahresarbeitszahl (JAZ)",en:"Seasonal performance (SPF)",fr:"Coefficient annuel (SPF)",ja:"年間性能係数（SPF）"},j_gesamt:{de:"Gesamt",en:"Total",fr:"Total",ja:"合計"},j_heizen:{de:"Heizen",en:"Heating",fr:"Chauffage",ja:"暖房"},j_ww:{de:"Warmwasser",en:"Hot water",fr:"Eau chaude",ja:"給湯"},j_kwaerme:{de:"Wärme",en:"Heat",fr:"Chaleur",ja:"熱量"},j_kstrom:{de:"Strom",en:"Electricity",fr:"Électricité",ja:"電力"},j_kjaz:{de:"JAZ",en:"SPF",fr:"SPF",ja:"SPF"},j_unter:{de:"Seit 1. Januar, Wärme und Strom in kWh",en:"Since 1 January, heat and electricity in kWh",fr:"Depuis le 1er janvier, chaleur et électricité en kWh",ja:"1 月 1 日から、熱量と電力は kWh"},j_seit:{de:"Daten erst seit {v}",en:"data only since {v}",fr:"données depuis le {v} seulement",ja:"{v} 以降のデータのみ"},j_titel:{de:"Wärme {w} kWh geteilt durch Strom {s} kWh",en:"Heat {w} kWh divided by electricity {s} kWh",fr:"Chaleur {w} kWh divisée par électricité {s} kWh",ja:"熱 {w} kWh ÷ 電力 {s} kWh"},t_info:{de:"Info",en:"Info",fr:"Infos",ja:"情報"},h_knopf:{de:"Hilfe zu allen Werten",en:"Help for all values",fr:"Aide sur toutes les valeurs",ja:"すべての値のヘルプ"},h_titel:{de:"Was bedeutet welcher Wert?",en:"What does each value mean?",fr:"Que signifie chaque valeur ?",ja:"各値の意味"},h_suche:{de:"Suchen, z. B. Warmwasser, Heizkurve, TOP9 …",en:"Search, e.g. hot water, heating curve, TOP9 …",fr:"Rechercher, p. ex. eau chaude, courbe, TOP9 …",ja:"検索（例：給湯、暖房曲線、TOP9 …）"},h_alle:{de:"Alle",en:"All",fr:"Tout",ja:"すべて"},h_lesen:{de:"Lesen",en:"Read",fr:"Lecture",ja:"読み取り"},h_schreiben:{de:"Schreiben",en:"Write",fr:"Écriture",ja:"書き込み"},h_anzahl:{de:"{n} Einträge",en:"{n} entries",fr:"{n} entrées",ja:"{n} 件"},r_bereitschaft:{de:"Bereitschaft",en:"Standby",fr:"Veille",ja:"待機"},s_verbrauch_heute:{de:"Verbrauch heute",en:"Consumption today",fr:"Consommation du jour",ja:"本日の消費電力量"},s_max:{de:"max {v}",en:"max {v}",fr:"max {v}",ja:"最大 {v}"},s_temperatur:{de:"Temperatur",en:"Temperature",fr:"Température",ja:"温度"},h_kopieren:{de:"Klicken zum Kopieren",en:"Click to copy",fr:"Cliquer pour copier",ja:"クリックしてコピー"},h_kopiert:{de:"Kopiert",en:"Copied",fr:"Copié",ja:"コピーしました"},h_keine_entitaet:{de:"Keine passende Entität in Home Assistant gefunden",en:"No matching entity found in Home Assistant",fr:"Aucune entité correspondante trouvée dans Home Assistant",ja:"Home Assistant に該当するエンティティがありません"},h_anzahl1:{de:"1 Eintrag",en:"1 entry",fr:"1 entrée",ja:"1 件"},h_laedt:{de:"Hilfe wird geladen …",en:"Loading help …",fr:"Chargement de l'aide …",ja:"ヘルプを読み込み中…"},h_fehler:{de:"Die Hilfe konnte nicht geladen werden. Bitte die Seite neu laden.",en:"The help could not be loaded. Please reload the page.",fr:"Impossible de charger l'aide. Veuillez recharger la page.",ja:"ヘルプを読み込めませんでした。ページを再読み込みしてください。"},h_keine:{de:"Nichts gefunden. Anderes Suchwort versuchen.",en:"Nothing found. Try another search term.",fr:"Aucun résultat. Essayez un autre mot.",ja:"見つかりません。別の語で検索してください。"},h_quelle:{de:"Grundlage: HeishaMon-Dokumentation und Panasonic-Anleitung. Was dort nicht beschrieben ist, steht hier auch nicht.",en:"Based on: HeishaMon documentation and Panasonic manual. What is not described there is not stated here either.",fr:"Sources : documentation HeishaMon et notice Panasonic. Ce qui n'y est pas décrit n'est pas affirmé ici.",ja:"出典：HeishaMon の説明書と Panasonic の取扱説明書。そこに書かれていないことはここでも述べていません。"},t_oeffnen:{de:"Erweiterte Einstellungen öffnen",en:"Open advanced settings",fr:"Ouvrir les réglages avancés",ja:"詳細設定を開く"},t_heizen:{de:"Heizen",en:"Heating",fr:"Chauffage",ja:"暖房"},t_pumpe:{de:"Pumpe",en:"Pump",fr:"Pompe",ja:"ポンプ"},t_uebernehmen:{de:"Übernehmen",en:"Apply",fr:"Appliquer",ja:"適用"},t_abbrechen:{de:"Abbrechen",en:"Cancel",fr:"Annuler",ja:"キャンセル"},t_nur_lesbar:{de:"nur lesbar",en:"read only",fr:"lecture seule",ja:"読み取り専用"},s_versch:{de:"Verschiebung der Heizkurve",en:"Heat curve shift",fr:"Décalage de la courbe",ja:"暖房曲線のシフト"},r_verlauf_zeigen:{de:"Verlauf anzeigen",en:"Show history",fr:"Afficher l'historique",ja:"履歴を表示"},w_0:{de:"Nur Heizen",en:"Heat only",fr:"Chauffage seul",ja:"暖房のみ"},w_1:{de:"Nur Kühlen",en:"Cool only",fr:"Refroidissement seul",ja:"冷房のみ"},w_2:{de:"Automatik Heizen",en:"Auto heat",fr:"Chauffage auto",ja:"自動暖房"},w_3:{de:"Nur Warmwasser",en:"Hot water only",fr:"Eau chaude seule",ja:"給湯のみ"},w_4:{de:"Heizen und Warmwasser",en:"Heat and hot water",fr:"Chauffage et eau chaude",ja:"暖房と給湯"},w_5:{de:"Kühlen und Warmwasser",en:"Cool and hot water",fr:"Refroidissement et eau chaude",ja:"冷房と給湯"},w_6:{de:"Automatik Heizen und Warmwasser",en:"Auto heat and hot water",fr:"Chauffage auto et eau chaude",ja:"自動暖房と給湯"},w_7:{de:"Automatik Kühlen",en:"Auto cool",fr:"Refroidissement auto",ja:"自動冷房"},w_8:{de:"Automatik Kühlen und Warmwasser",en:"Auto cool and hot water",fr:"Refroidissement auto et eau chaude",ja:"自動冷房と給湯"},w_9:{de:"Aus",en:"Off",fr:"Arrêt",ja:"オフ"},w_10:{de:"Stufe 1",en:"Level 1",fr:"Niveau 1",ja:"レベル1"},w_11:{de:"Stufe 2",en:"Level 2",fr:"Niveau 2",ja:"レベル2"},w_12:{de:"Stufe 3",en:"Level 3",fr:"Niveau 3",ja:"レベル3"},w_13:{de:"30 Minuten",en:"30 minutes",fr:"30 minutes",ja:"30分"},w_14:{de:"60 Minuten",en:"60 minutes",fr:"60 minutes",ja:"60分"},w_15:{de:"90 Minuten",en:"90 minutes",fr:"90 minutes",ja:"90分"},w_16:{de:"Heizung",en:"Heating",fr:"Chauffage",ja:"暖房"},w_17:{de:"Warmwasser",en:"Hot water",fr:"Eau chaude",ja:"給湯"},w_18:{de:"läuft",en:"running",fr:"en marche",ja:"運転中"},w_19:{de:"aus",en:"off",fr:"arrêt",ja:"停止"},w_20:{de:"Wärmepumpe",en:"Heat pump",fr:"Pompe à chaleur",ja:"ヒートポンプ"},w_21:{de:"Pumpe HK1",en:"Pump circuit 1",fr:"Pompe circuit 1",ja:"回路1ポンプ"},w_22:{de:"Pumpe HK2",en:"Pump circuit 2",fr:"Pompe circuit 2",ja:"回路2ポンプ"},w_43:{de:"Heizstab läuft",en:"Heater running",fr:"Appoint en marche",ja:"ヒーター運転中"},w_44:{de:"Pumpe Kamin",en:"Stove pump",fr:"Pompe poêle",ja:"薪ストーブポンプ"},w_45:{de:"Pumpe Solarthermie",en:"Solar thermal pump",fr:"Pompe solaire thermique",ja:"太陽熱ポンプ"},w_46:{de:"Pumpe HK3",en:"Pump circuit 3",fr:"Pompe circuit 3",ja:"回路3ポンプ"},w_47:{de:"Pumpe HK4",en:"Pump circuit 4",fr:"Pompe circuit 4",ja:"回路4ポンプ"},w_48:{de:"HK3 Wasser",en:"Circuit 3 water",fr:"Circuit 3 eau",ja:"回路3 水温"},w_49:{de:"HK4 Wasser",en:"Circuit 4 water",fr:"Circuit 4 eau",ja:"回路4 水温"},w_25:{de:"Abtauung",en:"Defrost",fr:"Dégivrage",ja:"除霜"},w_26:{de:"Zirkulation Status",en:"Circulation",fr:"Circulation",ja:"循環"},w_27:{de:"Aufheizen",en:"Boost",fr:"Chauffe",ja:"加熱"},w_28:{de:"Legionellenschutz",en:"Legionella cycle",fr:"Cycle légionelles",ja:"レジオネラ運転"},w_29:{de:"PV Leistung",en:"PV power",fr:"Puissance PV",ja:"太陽光出力"},w_30:{de:"Außen",en:"Outdoor",fr:"Extérieur",ja:"外気"},w_31:{de:"Vorlauf",en:"Flow",fr:"Départ",ja:"往き"},w_32:{de:"Rücklauf",en:"Return",fr:"Retour",ja:"還り"},w_33:{de:"Puffer",en:"Buffer",fr:"Tampon",ja:"バッファー"},w_34:{de:"HK1 Wasser",en:"Circuit 1 water",fr:"Circuit 1 eau",ja:"回路1 水温"},w_35:{de:"HK2 Wasser",en:"Circuit 2 water",fr:"Circuit 2 eau",ja:"回路2 水温"},w_36:{de:"Verdichter",en:"Compressor",fr:"Compresseur",ja:"圧縮機"},w_37:{de:"Durchfluss",en:"Flow rate",fr:"Débit",ja:"流量"},w_38:{de:"Panasonic Aquarea, HeishaMon über MQTT-Namensschema",en:"Panasonic Aquarea, HeishaMon via MQTT naming",fr:"Panasonic Aquarea, HeishaMon via nommage MQTT",ja:"Panasonic Aquarea、MQTT命名規則のHeishaMon"},r_demo_hinweis:{de:"Erfundene Werte, die Anlage bleibt unberührt",en:"Sample values, the system is not touched",fr:"Valeurs fictives, l'installation n'est pas modifiée",ja:"仮の値です。機器には影響しません"},r_stoerung:{de:"Störung",en:"Fault",fr:"Défaut",ja:"異常"},r_zurueck:{de:"Zurücksetzen",en:"Reset",fr:"Réinitialiser",ja:"リセット"},r_betrieb:{de:"Betrieb",en:"Operation",fr:"Fonctionnement",ja:"運転"},r_heizen:{de:"Heizen",en:"Heating",fr:"Chauffage",ja:"暖房"},r_kuehlen:{de:"Kühlen",en:"Cooling",fr:"Refroidissement",ja:"冷房"},r_automatik:{de:"Automatik",en:"Automatic",fr:"Automatique",ja:"自動"},r_abtauen:{de:"Abtauen",en:"Defrost",fr:"Dégivrage",ja:"除霜"},r_platzhalter:{de:"Hier erscheint die exportierte Konfiguration. Zum Einlesen eigenen Text einfügen und auf Einlesen drücken.",en:"The exported configuration appears here. To import, paste your own text and press read.",fr:"La configuration exportée apparaît ici. Pour importer, collez votre texte et appuyez sur lire.",ja:"書き出した設定がここに表示されます。読み込むにはテキストを貼り付けて読み込みを押してください。"},r_sg_hinweis:{de:"SG Ready liefert HeishaMon nicht. Trage die beiden Kontakte ein, K1 für Sperre und K2 für Anlauf. Den Betriebszustand 1 bis 4 leitet die Karte daraus selbst ab. Die Knöpfe oben führen zusammen und löschen eigene Einträge nicht.",en:"HeishaMon does not provide SG Ready. Enter the two contacts, K1 for block and K2 for start. The card derives operating states 1 to 4 from them. The buttons above merge and do not delete your own entries.",fr:"HeishaMon ne fournit pas SG Ready. Indiquez les deux contacts, K1 pour le blocage et K2 pour le démarrage. La carte en déduit les états 1 à 4. Les boutons ci-dessus fusionnent et n'effacent pas vos saisies.",ja:"HeishaMonはSG Readyを提供しません。停止用のK1と起動用のK2の2つの接点を入力してください。運転状態1〜4はカードが自動で判定します。上のボタンは統合するだけで、独自の入力は消しません。"},r_zonen_unbekannt:{de:"Zonen unbekannt",en:"Zones unknown",fr:"Zones inconnues",ja:"ゾーン不明"},r_einziger_kreis:{de:"Einziger aktiver Heizkreis",en:"Only active circuit",fr:"Seul circuit actif",ja:"唯一の稼働回路"},r_upm:{de:"U/min",en:"rpm",fr:"tr/min",ja:"rpm"},s_ziel:{de:"Ziel {v} °C",en:"Target {v} °C",fr:"Cible {v} °C",ja:"目標 {v} °C"},s_laedt_ab:{de:"Lädt ab {v} °C",en:"Reheat at {v} °C",fr:"Relance à {v} °C",ja:"{v} °C 以下で再加熱"},s_stoerung:{de:"Störung der Wärmepumpe: {v}",en:"Heat pump fault: {v}",fr:"Défaut de la pompe à chaleur : {v}",ja:"ヒートポンプ異常：{v}"},s_keine_ent:{de:"Keine Entitäten zugeordnet. Karte bearbeiten und oben auf „Aus Integration übernehmen“ drücken.",en:"No entities assigned. Edit the card and press “Take over from integration” at the top.",fr:"Aucune entité attribuée. Modifiez la carte et appuyez sur « Reprendre de l'intégration » en haut.",ja:"エンティティが割り当てられていません。カードを編集し、上部の「統合から取り込む」を押してください。"},s_aussen:{de:"{v} °C außen",en:"{v} °C outdoor",fr:"{v} °C extérieur",ja:"外気 {v} °C"},s_vorlauf_soll:{de:"→ {v} °C Vorlauf",en:"→ {v} °C flow",fr:"→ {v} °C départ",ja:"→ 往き {v} °C"},s_zaehler:{de:"Zählerstand gesamt",en:"Meter total",fr:"Index total",ja:"積算値"},s_schema:{de:"Schema der Wärmepumpenanlage",en:"Heat pump system diagram",fr:"Schéma de l'installation",ja:"ヒートポンプシステム図"},s_kleiner:{de:"Kleiner",en:"Decrease",fr:"Diminuer",ja:"下げる"},s_groesser:{de:"Größer",en:"Increase",fr:"Augmenter",ja:"上げる"},f_einstellen:{de:"Einstellen",en:"Settings",fr:"Réglages",ja:"設定"},f_schliessen:{de:"Schließen",en:"Close",fr:"Fermer",ja:"閉じる"},f_nur_lesbar:{de:" – nur lesbar",en:" – read only",fr:" – lecture seule",ja:"（読み取り専用）"}},GRUPPEN_SCHLUESSEL={Außenfühler:"grp_0",Außengerät:"grp_1","Heizkreis 1":"grp_2","Heizkreis 2":"grp_3",Heizkurve:"grp_4",Heizungspuffer:"grp_5",Primärkreis:"grp_6","SG Ready":"grp_7",Steuerung:"grp_8",Warmwasser:"grp_9","Erweiterte Einstellungen":"grp_10","Heizkreis 3":"grp_11","Heizkreis 4":"grp_12",Zusatzwärme:"grp_13"},HINWEIS_SCHLUESSEL={"gilt für beide":"hnw_0","eigener Schalter, optional":"hnw_1","Shelly, Relais oder Eingang":"hnw_2","eigene Entität, Watt":"hnw_3","Soll Vorlauf":"hnw_4","Shelly oder eigener Schalter":"hnw_5","Switch zum Ein/Ausschalten der Zirkulation":"hnw_6","SetHeatpump oder TOP0":"hnw_7","Quelle in der Integration unter COP Quelle wählbar":"hnw_8","eigene Entität, °C":"hnw_9","eigener Schalter oder Sensor":"hnw_10","eigene Entität, °C; Kamin allein: TOP47":"hnw_11","eigener Schalter oder Sensor; Kamin allein: OPT5":"hnw_12"};function tf(text,werte){return String(text).replace(/\{(\w+)\}/g,(_,k)=>werte&&werte[k]!==void 0?werte[k]:`{${k}}`)}var WERT_SCHLUESSEL={Wärmepumpe:"w_20","Pumpe HK1":"w_21","Pumpe HK2":"w_22","Heizstab läuft":"w_43","Pumpe Kamin":"w_44","Pumpe Solarthermie":"w_45","Pumpe HK3":"w_46","Pumpe HK4":"w_47","HK3 Wasser":"w_48","HK4 Wasser":"w_49",Kamin:"kamin",Solarthermie:"solarthermie",Abtauung:"w_25","Zirkulation Status":"w_26",Aufheizen:"w_27",Legionellenschutz:"w_28","PV Leistung":"w_29",Außen:"w_30",Vorlauf:"w_31",Rücklauf:"w_32",Puffer:"w_33","HK1 Wasser":"w_34","HK2 Wasser":"w_35",Verdichter:"w_36",Durchfluss:"w_37","Panasonic Aquarea, HeishaMon über MQTT-Namensschema":"w_38","Nur Heizen":"w_0","Nur Kühlen":"w_1","Automatik Heizen":"w_2","Nur Warmwasser":"w_3","Heizen und Warmwasser":"w_4","Kühlen und Warmwasser":"w_5","Automatik Heizen und Warmwasser":"w_6","Automatik Kühlen":"w_7","Automatik Kühlen und Warmwasser":"w_8",Aus:"w_9","Stufe 1":"w_10","Stufe 2":"w_11","Stufe 3":"w_12","30 Minuten":"w_13","60 Minuten":"w_14","90 Minuten":"w_15",Heizung:"w_16",Warmwasser:"w_17",läuft:"w_18",aus:"w_19"};function wertText(wert,sprache){let k=WERT_SCHLUESSEL[wert];return k?t(k,sprache):wert}function feldText(feld,sprache){return TEXTE[`fld_${feld.key}`]?t(`fld_${feld.key}`,sprache):feld.label}function gruppenText(name,sprache){let k=GRUPPEN_SCHLUESSEL[name];return k?t(k,sprache):name}function hinweisText(hint,sprache){let s=String(hint||"");return Object.keys(HINWEIS_SCHLUESSEL).sort((x,y)=>y.length-x.length).forEach(de=>{s.includes(de)&&(s=s.split(de).join(t(HINWEIS_SCHLUESSEL[de],sprache)))}),s}function t(schluessel,sprache){let paket=EIGENE_SPRACHEN[sprache];if(paket&&typeof paket.texte[schluessel]=="string"&&paket.texte[schluessel])return paket.texte[schluessel];let eintrag=TEXTE[schluessel];if(!eintrag)return schluessel;let basis=paket&&paket.basis;return eintrag[sprache]||basis&&eintrag[basis]||eintrag.en||eintrag.de}var SPRACH_FORMAT="lutarym-sprachpaket",SPRACH_VERSION=1,SPRACH_NAMEN={de:"Deutsch",en:"English",fr:"Français",ja:"日本語"},EIGENE_SPRACHEN={},SPRACH_STAND=0,SPRACH_VERBOTEN=/[<>"`]/;function registriereSprachen(config,entfernen){let liste=config&&Array.isArray(config.language_custom)?config.language_custom:[],geaendert=!1;entfernen&&EIGENE_SPRACHEN[entfernen]&&(delete EIGENE_SPRACHEN[entfernen],geaendert=!0),liste.forEach(p=>{if(!p||typeof p.code!="string"||!p.texte||typeof p.texte!="object"||p.code===entfernen)return;let texte={};Object.keys(p.texte).forEach(k=>{let w=p.texte[k];typeof w=="string"&&!SPRACH_VERBOTEN.test(w)&&(texte[k]=w)});let sauber={...p,texte,hilfe:p.hilfe&&typeof p.hilfe=="object"?p.hilfe:{}};JSON.stringify(EIGENE_SPRACHEN[p.code])!==JSON.stringify(sauber)&&(EIGENE_SPRACHEN[p.code]=sauber,geaendert=!0)}),geaendert&&SPRACH_STAND++}function spracheBekannt(code){return SPRACHEN.includes(code)||!!EIGENE_SPRACHEN[code]}function hilfeText(sp,schluessel,mehrsprachig){let paket=EIGENE_SPRACHEN[sp],eigen=paket&&paket.hilfe&&paket.hilfe[schluessel];if(typeof eigen=="string"&&eigen)return eigen;let basis=paket&&paket.basis;return mehrsprachig[sp]||basis&&mehrsprachig[basis]||mehrsprachig.en||mehrsprachig.de||""}function sprachpaketFuer(code){let paket=EIGENE_SPRACHEN[code],sp=spracheBekannt(code)?code:"en",texte={};Object.keys(TEXTE).sort().forEach(k=>{texte[k]=t(k,sp)});let hilfe={};return(hilfeDaten()||[]).forEach(g=>{hilfe[g.id]=hilfeText(sp,g.id,g.titel),g.e.forEach((e,i)=>{hilfe[`${g.id}.${i}.n`]=hilfeText(sp,`${g.id}.${i}.n`,e.n),hilfe[`${g.id}.${i}.t`]=hilfeText(sp,`${g.id}.${i}.t`,e.t)})}),{format:SPRACH_FORMAT,version:SPRACH_VERSION,karte:CARD_VERSION,code:sp,name:paket?paket.name:SPRACH_NAMEN[sp]||sp,basis:paket?paket.basis:sp==="ja"?"en":sp,dezimal:paket?paket.dezimal:dezimalFuer(sp),texte,hilfe}}function platzhalter(text){return(String(text).match(/\{\w+\}/g)||[]).sort().join(",")}function pruefeSprache(roh){if(!roh||typeof roh!="object"||Array.isArray(roh))return{fehler:"m_s_format"};if(roh.format!==SPRACH_FORMAT)return{fehler:"m_s_format"};if(Number(roh.version)!==SPRACH_VERSION)return{fehler:"m_s_version"};let code=String(roh.code||"").trim();if(!/^[a-z]{2,3}(-[a-z0-9]{2,8})?$/.test(code))return{fehler:"m_s_code"};if(!roh.texte||typeof roh.texte!="object"||Array.isArray(roh.texte))return{fehler:"m_s_texte"};let basis=SPRACHEN.includes(roh.basis)?roh.basis:SPRACHEN.includes(code)?code:"en",texte={},unbekannt=[],platz=[],zeichen=[];Object.keys(roh.texte).forEach(k=>{let w=roh.texte[k];if(!TEXTE[k]){unbekannt.push(k);return}if(!(typeof w!="string"||!w.trim())){if(SPRACH_VERBOTEN.test(w)){zeichen.push(k);return}if(platzhalter(w)!==platzhalter(TEXTE[k][basis]||TEXTE[k].en)){platz.push(k);return}texte[k]=w}});let hilfe={},gueltig=new Set;if((hilfeDaten()||[]).forEach(g=>{gueltig.add(g.id),g.e.forEach((e,i)=>{gueltig.add(`${g.id}.${i}.n`),gueltig.add(`${g.id}.${i}.t`)})}),roh.hilfe&&typeof roh.hilfe=="object"&&!Array.isArray(roh.hilfe)&&Object.keys(roh.hilfe).forEach(k=>{let w=roh.hilfe[k];if(!gueltig.has(k)){unbekannt.push(k);return}typeof w=="string"&&w.trim()&&(hilfe[k]=w)}),!Object.keys(texte).length)return{fehler:"m_s_texte"};let fehlen=Object.keys(TEXTE).filter(k=>!texte[k]).length;return{paket:{format:SPRACH_FORMAT,version:SPRACH_VERSION,code,name:String(roh.name||code).trim().slice(0,40)||code,basis,dezimal:roh.dezimal===","||roh.dezimal==="."?roh.dezimal:dezimalFuer(basis),texte,hilfe},unbekannt,platz,zeichen,fehlen}}function bewegungReduziert(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)}catch{return!1}}function animationAn(config){let a=config?config.animate:!0;return a===!1?!1:a==="auto"?!bewegungReduziert():!0}function loadColor(value,min,max){if(value==null||Number.isNaN(value))return NEUTRAL;if(value<=0)return NEUTRAL;let span=max-min||1,p=clamp((value-min)/span,0,1),a=LOAD_STOPS[0],b=LOAD_STOPS[LOAD_STOPS.length-1];for(let i=0;i<LOAD_STOPS.length-1;i++)if(p>=LOAD_STOPS[i].p&&p<=LOAD_STOPS[i+1].p){a=LOAD_STOPS[i],b=LOAD_STOPS[i+1];break}let local=(p-a.p)/(b.p-a.p||1),rgb=a.c.map((ch,i)=>Math.round(ch+(b.c[i]-ch)*local));return`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}function bubbleDauer(idx){if(BUBBLE_DAUER[idx]===void 0){let seed=idx+42;seed=(seed*1103515245+12345)%2147483648,BUBBLE_DAUER[idx]=4+seed/2147483648*4}return BUBBLE_DAUER[idx]}function clamp(v,lo,hi){return Math.min(hi,Math.max(lo,v))}function thermalColor(value,min,max){if(value==null||Number.isNaN(value))return NEUTRAL;let span=max-min||1,p=clamp((value-min)/span,0,1),a=THERMAL_STOPS[0],b=THERMAL_STOPS[THERMAL_STOPS.length-1];for(let i=0;i<THERMAL_STOPS.length-1;i++)if(p>=THERMAL_STOPS[i].p&&p<=THERMAL_STOPS[i+1].p){a=THERMAL_STOPS[i],b=THERMAL_STOPS[i+1];break}let local=(p-a.p)/(b.p-a.p||1),rgb=a.c.map((ch,i)=>Math.round(ch+(b.c[i]-ch)*local));return`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}function numState(hass,entityId){if(!hass||!entityId)return null;let st=hass.states[entityId];if(!st)return null;let v=parseFloat(st.state);return Number.isNaN(v)?null:v}function rawState(hass,entityId){if(!hass||!entityId)return null;let st=hass.states[entityId];return st?st.state:null}function attr(hass,entityId,key,fallback){if(!hass||!entityId)return fallback;let st=hass.states[entityId];return!st||st.attributes[key]===void 0?fallback:st.attributes[key]}var AN_TEXTE=["on","true","running","run","an","ein","läuft","laeuft","active","aktiv","open","yes","ja"],AUS_TEXTE=["off","false","stopped","stop","aus","inactive","inaktiv","closed","no","nein","idle","standby","unknown","unavailable","none",""];function zustandAn(s){if(s==null)return null;let t2=String(s).trim().toLowerCase();if(AN_TEXTE.includes(t2))return!0;if(AUS_TEXTE.includes(t2))return!1;let n=parseFloat(t2);return Number.isNaN(n)?null:n>0}function isOn(hass,entityId){let s=rawState(hass,entityId);return s===null?null:zustandAn(s)}function warmwasserZustand(s){if(s==null)return null;let t2=String(s).trim().toLowerCase();if(t2==="unknown"||t2==="unavailable"||t2==="")return null;let n=parseFloat(t2);if(!Number.isNaN(n))return n>0;if(/buffer|puffer|pool/.test(t2))return!1;if(/dhw|hot.?water|domestic|warmwasser|brauchwasser|trinkwasser|sanitary|tank|boiler|eau chaude|給湯/.test(t2))return!0;let an=zustandAn(t2);return an===null?!1:an}function verdichterWert(hass,entityId){let s=rawState(hass,entityId);if(s===null)return{wert:null,einheit:"",nurAnAus:!1};let n=parseFloat(s);if(!Number.isNaN(n)){let einheit=attr(hass,entityId,"unit_of_measurement","Hz")||"";return{wert:n,einheit,nurAnAus:!1}}let an=zustandAn(s);return an===null?{wert:null,einheit:"",nurAnAus:!1}:{wert:an?1:0,einheit:"",nurAnAus:!0}}var DEZIMAL=",";function setzeDezimal(z){DEZIMAL=z}function dezimalFuer(sprache){let paket=EIGENE_SPRACHEN[sprache];return paket&&(paket.dezimal===","||paket.dezimal===".")?paket.dezimal:sprache==="de"||sprache==="fr"?",":"."}function fmt(value,digits){return value==null||Number.isNaN(value)?"--":value.toFixed(digits===void 0?1:digits).replace(".",DEZIMAL)}function friendly(hass,entityId){return attr(hass,entityId,"friendly_name",entityId||"")}function abzeichenBreite(text){let laenge=String(text||"").length;return Math.max(112,Math.round(laenge*13*.57)+28)}function stellbar(id){let bereich=String(id||"").split(".")[0];return bereich==="number"||bereich==="input_number"}function schildBreite(text,mindest){let laenge=String(text??"").length;return Math.max(mindest,Math.round(laenge*15*.66)+24)}function escapeHtml(text){return String(text??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}function copMittel(reihe,start,ende){let punkte=reihe.map(pkt=>{let roh=pkt.s!==void 0?pkt.s:pkt.state,t2=pkt.lu!==void 0?pkt.lu*1e3:Date.parse(pkt.last_updated||pkt.last_changed);return(Number.isNaN(t2)||t2<start)&&(t2=start),{t:t2,v:parseFloat(roh)}}).sort((a,b)=>a.t-b.t),summe=0,dauer=0;for(let i=0;i<punkte.length;i++){let von=punkte[i].t,dt=(i+1<punkte.length?punkte[i+1].t:ende)-von,v=punkte[i].v;dt>0&&!Number.isNaN(v)&&v>0&&(summe+=v*dt,dauer+=dt)}return dauer>0?summe/dauer:null}function kleinster(liste){let m=1/0;for(let v of liste)v<m&&(m=v);return m}function groesster(liste){let m=-1/0;for(let v of liste)v>m&&(m=v);return m}async function kopiereText(text){try{if(navigator.clipboard&&window.isSecureContext)return await navigator.clipboard.writeText(text),!0}catch{}let feld=document.createElement("textarea");feld.value=text,feld.setAttribute("readonly",""),feld.style.position="fixed",feld.style.opacity="0",document.body.appendChild(feld),feld.select();let ok=!1;try{ok=document.execCommand("copy")}catch{ok=!1}return feld.remove(),ok}var TUER_FELDER=[{abschnitt:"t_betrieb",key:"holiday_mode",schalter:!0},{abschnitt:"t_betrieb",key:"main_schedule",schalter:!0},{abschnitt:"t_betrieb",key:"smart_dhw",auswahl:["o_variabel","o_standard"]},{abschnitt:"t_heizen",key:"heating_off_temp",min:5,max:35,step:1,einheit:"°C"},{abschnitt:"t_heizen",key:"heater_on_temp",min:-15,max:20,step:1,einheit:"°C"},{abschnitt:"t_heizen",key:"heat_delta",min:1,max:15,step:1,einheit:"°C"},{abschnitt:"t_heizen",key:"heating_control",auswahl:["o_komfort","o_effizienz"]},{abschnitt:"t_legionellen",key:"steril_temp",min:55,max:75,step:1,einheit:"°C"},{abschnitt:"t_legionellen",key:"steril_time",min:5,max:60,step:5,einheit:"min"},{abschnitt:"t_pumpe",key:"pump_flow_mode",auswahl:["o_spreizung","o_max_leistung"]},{abschnitt:"t_pumpe",key:"pump_max_duty",min:64,max:254,step:1,einheit:""},{abschnitt:"t_leise",key:"quiet_priority",auswahl:["o_lautstaerke","o_leistung"]},{abschnitt:"t_cop",key:"cop_heating",cop:"heizen"},{abschnitt:"t_cop",key:"cop_dhw",cop:"ww"},{abschnitt:"t_jaz",key:"jaz",jaz:"tabelle"},{abschnitt:"t_info",key:"operating_hours",info:!0,einheit:"h"},{abschnitt:"t_info",key:"compressor_starts",info:!0,einheit:""},{abschnitt:"t_info",key:"room_heater_hours",info:!0,einheit:"h"},{abschnitt:"t_info",key:"dhw_heater_hours",info:!0,einheit:"h"}],ENTITY_FIELDS=[{key:"outside_temp",label:"Außentemperatur",group:"Außenfühler",hint:"TOP14"},{key:"power_state",label:"Wärmepumpe Status, grüne LED",group:"Außengerät",hint:"SetHeatpump oder TOP0"},{key:"compressor",label:"Verdichterdrehzahl",group:"Außengerät",hint:"TOP8"},{key:"fan1_rpm",label:"Lüfter 1 Drehzahl",group:"Außengerät",hint:"TOP62"},{key:"fan2_rpm",label:"Lüfter 2 Drehzahl",group:"Außengerät",hint:"TOP63"},{key:"defrost",label:"Abtauung läuft",group:"Außengerät",hint:"TOP26"},{key:"error",label:"Fehlercode",group:"Außengerät",hint:"TOP44"},{key:"heatpump_state",label:"Betriebszustand",group:"Außengerät",hint:"TOP0"},{key:"force_defrost",label:"Abtauen erzwingen",group:"Außengerät",hint:"SetForceDefrost, switch"},{key:"powerful_mode",label:"Turbomodus",group:"Außengerät",hint:"SetPowerfulMode, select"},{key:"quiet_mode",label:"Leisemodus",group:"Außengerät",hint:"SetQuietMode, select"},{key:"power_now",label:"Aktuelle Leistungsaufnahme",group:"Außengerät",hint:"Shelly PM, Watt"},{key:"energy_today",label:"Energiezähler",group:"Außengerät",hint:"Shelly PM, kWh"},{key:"pv_power",label:"PV Leistung aktuell",group:"SG Ready",hint:"eigene Entität, Watt"},{key:"sg_k1",label:"Kontakt K1 Sperre",group:"SG Ready",hint:"Shelly, Relais oder Eingang"},{key:"sg_k2",label:"Kontakt K2 Anlauf",group:"SG Ready",hint:"Shelly, Relais oder Eingang"},{key:"flow_temp",label:"Vorlauftemperatur",group:"Primärkreis",hint:"TOP6"},{key:"return_temp",label:"Rücklauftemperatur",group:"Primärkreis",hint:"TOP5"},{key:"pump_speed",label:"Primärpumpe Drehzahl",group:"Primärkreis",hint:"TOP65"},{key:"pump_flow",label:"Durchflussmenge",group:"Primärkreis",hint:"TOP1"},{key:"three_way_valve",label:"3-Wege-Umschaltventil",group:"Primärkreis",hint:"TOP20"},{key:"water_pressure",label:"Wasserdruck",group:"Primärkreis",hint:"TOP115"},{key:"heater_internal",label:"Heizstab intern läuft",group:"Primärkreis",hint:"TOP60"},{key:"heater_external",label:"Heizstab extern läuft",group:"Primärkreis",hint:"TOP61"},{key:"buffer_temp",label:"Puffertemperatur",group:"Heizungspuffer",hint:"TOP46"},{key:"buffer_installed",label:"Puffer vorhanden",group:"Heizungspuffer",hint:"TOP99"},{key:"buffer_switch",label:"Pufferbetrieb ein und aus",group:"Heizungspuffer",hint:"SetBuffer, switch"},{key:"curve_t_high",label:"HK1 Heizkurve Vorlauf oben",group:"Heizkurve",hint:"TOP29"},{key:"curve_t_low",label:"HK1 Heizkurve Vorlauf unten",group:"Heizkurve",hint:"TOP30"},{key:"curve_o_high",label:"HK1 Heizkurve Außen oben",group:"Heizkurve",hint:"TOP31"},{key:"curve_o_low",label:"HK1 Heizkurve Außen unten",group:"Heizkurve",hint:"TOP32"},{key:"curve2_t_high",label:"HK2 Heizkurve Vorlauf oben",group:"Heizkurve",hint:"TOP82"},{key:"curve2_t_low",label:"HK2 Heizkurve Vorlauf unten",group:"Heizkurve",hint:"TOP83"},{key:"curve2_o_high",label:"HK2 Heizkurve Außen oben",group:"Heizkurve",hint:"TOP84"},{key:"curve2_o_low",label:"HK2 Heizkurve Außen unten",group:"Heizkurve",hint:"TOP85"},{key:"buffer_delta",label:"Puffer Hysterese",group:"Heizungspuffer",hint:"TOP113"},{key:"buffer_target",label:"Puffer Zieltemperatur",group:"Heizungspuffer",hint:"TOP7, Soll Vorlauf"},{key:"cop_heating",label:"COP Heizen",group:"Heizungspuffer",hint:"HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle wählbar"},{key:"room_heater",label:"Heizstab Heizung freigegeben",group:"Heizungspuffer",hint:"TOP59"},{key:"room_heater_switch",label:"Heizstab Heizung schalten",group:"Heizungspuffer",hint:"SetRoomHeaterState, switch"},{key:"zones_state",label:"Aktivierte Zonen",group:"Heizkreis 1",hint:"TOP94, gilt für beide"},{key:"zones_select",label:"Zonen umschalten",group:"Heizkreis 1",hint:"SetZones, gilt für beide"},{key:"hk1_water",label:"HK1 Wassertemperatur",group:"Heizkreis 1",hint:"TOP36"},{key:"hk1_water_target",label:"HK1 Wasser Sollwert",group:"Heizkreis 1",hint:"TOP42"},{key:"hk1_pump",label:"HK1 Pumpe läuft",group:"Heizkreis 1",hint:"TOP124"},{key:"hk1_setpoint",label:"HK1 Sollwert einstellbar",group:"Heizkreis 1",hint:"TOP27, number"},{key:"hk1_switch",label:"HK1 ein und aus",group:"Heizkreis 1",hint:"eigener Schalter, optional"},{key:"hk2_water",label:"HK2 Wassertemperatur",group:"Heizkreis 2",hint:"TOP37"},{key:"hk2_water_target",label:"HK2 Wasser Sollwert",group:"Heizkreis 2",hint:"TOP43"},{key:"hk2_pump",label:"HK2 Pumpe läuft",group:"Heizkreis 2",hint:"TOP123"},{key:"hk2_setpoint",label:"HK2 Sollwert einstellbar",group:"Heizkreis 2",hint:"TOP34, number"},{key:"hk2_switch",label:"HK2 ein und aus",group:"Heizkreis 2",hint:"eigener Schalter, optional"},{key:"hk3_water",label:"HK3 Wassertemperatur",group:"Heizkreis 3",hint:"eigene Entität, °C"},{key:"hk3_pump",label:"HK3 Pumpe läuft",group:"Heizkreis 3",hint:"eigener Schalter oder Sensor"},{key:"hk3_switch",label:"HK3 ein und aus",group:"Heizkreis 3",hint:"eigener Schalter, optional"},{key:"hk4_water",label:"HK4 Wassertemperatur",group:"Heizkreis 4",hint:"eigene Entität, °C"},{key:"hk4_pump",label:"HK4 Pumpe läuft",group:"Heizkreis 4",hint:"eigener Schalter oder Sensor"},{key:"hk4_switch",label:"HK4 ein und aus",group:"Heizkreis 4",hint:"eigener Schalter, optional"},{key:"kamin_temp",label:"Kamin Temperatur",group:"Zusatzwärme",hint:"eigene Entität, °C; Kamin allein: TOP47"},{key:"kamin_pump",label:"Kamin Pumpe läuft",group:"Zusatzwärme",hint:"eigener Schalter oder Sensor; Kamin allein: OPT5"},{key:"solar_temp",label:"Solarthermie Temperatur",group:"Zusatzwärme",hint:"TOP47"},{key:"solar_pump",label:"Solarthermie Pumpe läuft",group:"Zusatzwärme",hint:"OPT5"},{key:"dhw_installed",label:"Warmwasser vorhanden",group:"Warmwasser",hint:"TOP100"},{key:"dhw_temp",label:"Warmwasser Isttemperatur",group:"Warmwasser",hint:"TOP10"},{key:"dhw_heat_delta",label:"Warmwasser Hysterese",group:"Warmwasser",hint:"TOP22"},{key:"dhw_setpoint",label:"Warmwasser Sollwert",group:"Warmwasser",hint:"TOP9, number"},{key:"cop_dhw",label:"COP Warmwasser",group:"Warmwasser",hint:"HeishaMon by Lutarym, Quelle in der Integration unter COP Quelle wählbar"},{key:"dhw_heater",label:"Heizstab Warmwasser freigegeben",group:"Warmwasser",hint:"TOP58"},{key:"dhw_force",label:"Einmalig aufheizen",group:"Warmwasser",hint:"SetForceDHW, switch"},{key:"dhw_force_state",label:"Aufheizen läuft",group:"Warmwasser",hint:"TOP2"},{key:"force_sterilization",label:"Legionellenschutz starten",group:"Warmwasser",hint:"SetForceSterilization, switch"},{key:"sterilization_state",label:"Legionellenschutz läuft",group:"Warmwasser",hint:"TOP69"},{key:"dhw_heater_switch",label:"Heizstab Warmwasser schalten",group:"Warmwasser",hint:"SetDHWHeaterState, switch"},{key:"circulation_pump",label:"Zirkulationspumpe läuft",group:"Warmwasser",hint:"Shelly oder eigener Schalter"},{key:"circ_switch",label:"Zirkulation Schalter (klickbar)",group:"Warmwasser",hint:"Switch zum Ein/Ausschalten der Zirkulation"},{key:"mode_select",label:"Betriebsart umschalten",group:"Steuerung",hint:"SetOperationMode, select"},{key:"heating_off_temp",label:"Heizen aus ab Außentemperatur",group:"Erweiterte Einstellungen",hint:"TOP77, number"},{key:"heater_on_temp",label:"Heizstab ein unter Außentemperatur",group:"Erweiterte Einstellungen",hint:"TOP78, number"},{key:"heat_delta",label:"Spreizung Heizen",group:"Erweiterte Einstellungen",hint:"TOP23, number"},{key:"heating_control",label:"Regelung",group:"Erweiterte Einstellungen",hint:"SetHeatingControl, select"},{key:"steril_temp",label:"Legionellen Temperatur",group:"Erweiterte Einstellungen",hint:"TOP70, number"},{key:"steril_time",label:"Legionellen Haltezeit",group:"Erweiterte Einstellungen",hint:"TOP71, number"},{key:"pump_flow_mode",label:"Pumpenregelung",group:"Erweiterte Einstellungen",hint:"SetPumpFlowrateMode, select"},{key:"pump_max_duty",label:"Max. Pumpenleistung",group:"Erweiterte Einstellungen",hint:"TOP95, number"},{key:"quiet_priority",label:"Leisemodus Vorrang",group:"Erweiterte Einstellungen",hint:"SetQuietModePriority, select"},{key:"holiday_mode",label:"Urlaubsmodus",group:"Erweiterte Einstellungen",hint:"SetHolidayMode, switch"},{key:"main_schedule",label:"Wochenprogramm",group:"Erweiterte Einstellungen",hint:"SetMainSchedule, switch"},{key:"smart_dhw",label:"Smart DHW Warmwasser",group:"Erweiterte Einstellungen",hint:"SetSmartDHW, select"},{key:"operating_hours",label:"Betriebsstunden",group:"Erweiterte Einstellungen",hint:"TOP11"},{key:"compressor_starts",label:"Verdichterstarts",group:"Erweiterte Einstellungen",hint:"TOP12"},{key:"room_heater_hours",label:"Heizstab Heizen Betriebsstunden",group:"Erweiterte Einstellungen",hint:"TOP90"},{key:"dhw_heater_hours",label:"Heizstab Warmwasser Betriebsstunden",group:"Erweiterte Einstellungen",hint:"TOP91"}],DEFAULT_CONFIG={type:"custom:heatpump-flow-card-by-lutarym",fan_count:2,hk_count:2,layout:"quer",card_width:0,pipe_inner_mm:0,mqtt_prefix:"panasonic_heat_pump",profil:"auto",language:"auto",show_history:"knopf",show_target:!0,show_reload:!0,show_help:!0,show_door:!0,theme:"auto",profile_custom:[],language_custom:[],buffer_present:"auto",circulation_present:"auto",history_width:450,history_style:"takte",sg_style:"spuren",curve_x_min:-20,curve_x_max:20,curve_y_min:20,curve_y_max:75,card_height:0,scale_min:20,scale_max:60,outdoor_min:-15,outdoor_max:35,label_hk1:"",label_hk2:"",label_dhw:"",label_energy:"",label_buffer:"",energy_daily:!0,demo:!1,animate:!0,hk1_style:"platte",hk2_style:"platte",hk3_style:"platte",hk4_style:"platte",label_hk3:"",label_hk4:"",extra_heat:"aus",kamin_fire_temp:30,solar_sun_temp:30,solar_style:"strahlen",entities:{}};var PROFIL_STAND="2026-10-22",HERSTELLER_PROFILE=[{id:"vicare",core:!0,hersteller:"Viessmann",name:"ViCare",entwickler:"Home Assistant Core",quelle:"https://www.home-assistant.io/integrations/vicare/",integration:"vicare",felder:{outside_temp:["outside_temperature"],flow_temp:["secondary_circuit_supply_temperature","supply_temperature"],return_temp:["secondary_circuit_return_temperature","return_temperature"],dhw_temp:["dhw_storage_temperature","dhw_storage_top_temperature"],dhw_setpoint:["number:dhw_temperature"],compressor:["compressor_modulation"],three_way_valve:["domestic_hot_water_charging"],pump_flow:["volumetric_flow"],pump_speed:["primary_circuit_pump_rotation"],power_now:["inverter_power","compressor_power"],energy_today:["power_consumption_today"],buffer_temp:["buffer_main_temperature","buffer_top_temperature"],solar_temp:["collector_temperature"],solar_pump:["solar_pump"],hk1_pump:["circulation_pump"],circulation_pump:["domestic_hot_water_circulation_pump"],compressor_starts:["compressor_starts"],operating_hours:["compressor_hours"],cop_heating:["cop_heating"],cop_dhw:["cop_dhw"],water_pressure:["supply_pressure"]}},{id:"nibe_heatpump",core:!0,hersteller:"NIBE",name:"Nibe Heat Pump",entwickler:"Home Assistant Core",quelle:"https://www.home-assistant.io/integrations/nibe_heatpump/",integration:"nibe_heatpump",felder:{outside_temp:["bt1_outdoor_temperature_40004"],flow_temp:["bt2_supply_temp_s1_40008","eb100_ep14_bt12_condensor_out_40017"],return_temp:["eb100_ep14_bt3_return_temp_40012"],dhw_temp:["bt7_hw_top_40013","bt6_hw_load_40014"],compressor:["compressor_frequency_actual_43136"],three_way_valve:["prio_43086"],pump_flow:["bf1_ep14_flow_40072"],pump_speed:["supply_pump_speed_ep14_43437"],hk1_water:["bt2_supply_temp_s1_40008"],hk2_water:["ep21_bt2_supply_temp_s2_40007"],hk3_water:["ep22_bt2_supply_temp_s3_40006"],compressor_starts:["compressor_starts_eb100_ep14_43416"],operating_hours:["tot_op_time_compr_eb100_ep14_43420"]}},{id:"melcloud",core:!0,hersteller:"Mitsubishi Electric",name:"MELCloud",entwickler:"Home Assistant Core",quelle:"https://www.home-assistant.io/integrations/melcloud/",integration:"melcloud",felder:{outside_temp:["outside_temperature"],flow_temp:["sensor:flow_temperature"],return_temp:["return_temperature"],dhw_temp:["tank_temperature"]}},{id:"melcloudhome",version:"2.6.1",aktualisiert:"2026-10-19",hersteller:"Mitsubishi Electric",name:"MELCloud Home",entwickler:"andrew-blake",quelle:"https://github.com/andrew-blake/melcloudhome",integration:"melcloudhome",felder:{outside_temp:["outdoor_temperature"],flow_temp:["flow_temperature"],return_temp:["return_temperature"],dhw_temp:["tank_temperature"],hk1_water:["flow_temperature_zone1"],hk2_water:["flow_temperature_zone2"],error:["error_state"]}},{id:"luxtronik2",version:"2026.10.18",aktualisiert:"2026-10-22",hersteller:"Alpha Innotec, Novelan (Luxtronik)",name:"Luxtronik",entwickler:"BenPru",quelle:"https://github.com/BenPru/luxtronik",integration:"luxtronik2",felder:{outside_temp:["outdoor_temperature"],flow_temp:["flow_in_temperature"],return_temp:["flow_out_temperature"],dhw_temp:["dhw_temperature"],dhw_setpoint:["number:dhw_target_temperature"],compressor:["binary_sensor:compressor"],three_way_valve:["dhw_charging_pump"],defrost:["defrost_valve"],error:["error_reason"],power_now:["current_power_consumption"],pump_flow:["heat_amount_flow_rate"],operating_hours:["operation_hours"],compressor_starts:["compressor1_impulses"],solar_temp:["solar_collector_temperature"],solar_pump:["solar_pump"],hk1_water:["flow_in_circuit1_temperature"],hk2_water:["flow_in_circuit2_temperature"],hk3_water:["flow_in_circuit3_temperature"],hk1_pump:["circulation_pump_heating"],circulation_pump:["dhw_circulation_pump"],cop_heating:["cop_heating"],cop_dhw:["cop_dhw"]}},{id:"luxtronik",version:"2022.12.01",aktualisiert:"2023-09-11",hersteller:"Alpha Innotec, Novelan (Luxtronik)",name:"Luxtronik",entwickler:"Bouni",quelle:"https://github.com/Bouni/luxtronik",integration:"luxtronik",felder:{outside_temp:["id_web_temperatur_ta"],flow_temp:["id_web_temperatur_tvl"],return_temp:["id_web_temperatur_trl"],dhw_temp:["id_web_temperatur_tbw"],solar_temp:["id_web_temperatur_tsk"],hk1_water:["id_web_temperatur_tfb1"],compressor:["id_web_freq_vd","id_web_vd1out"],three_way_valve:["id_web_bupout"],circulation_pump:["id_web_zipout"],hk1_pump:["id_web_hupout"],pump_flow:["id_web_wmz_durchfluss"],operating_hours:["id_web_zaehler_betrzeitvd1"],compressor_starts:["id_web_zaehler_betrzeitimpvd1"]}},{id:"luxtronik2_hass",version:"1.2.7",aktualisiert:"2026-10-08",hersteller:"Alpha Innotec, Novelan (Luxtronik)",name:"Luxtronik 2",entwickler:"notDIRK",quelle:"https://github.com/notDIRK/luxtronik2-hass",integration:"luxtronik2_hass",felder:{outside_temp:["luxtronik_outside_temperature"],flow_temp:["luxtronik_flow_temperature"],return_temp:["luxtronik_return_temperature"],dhw_temp:["luxtronik_hot_water_temperature"],dhw_setpoint:["number:luxtronik_hot_water_setpoint"],compressor:["luxtronik_compressor"],three_way_valve:["luxtronik_hot_water_pump"],hk1_pump:["luxtronik_circulation_pump"],circulation_pump:["luxtronik_circulation_pump_zip"],power_now:["luxtronik_heat_pump_power"],operating_hours:["luxtronik_compressor_operating_hours","luxtronik_heat_pump_operating_hours"]}},{id:"lambda_heat_pumps",version:"2.8.6",aktualisiert:"2026-10-17",hersteller:"Lambda",name:"Lambda Heat Pumps",entwickler:"GuidoJeuken-6512",quelle:"https://github.com/GuidoJeuken-6512/lambda_heat_pumps",integration:"lambda_heat_pumps",felder:{outside_temp:["sensor.*ambient_temperature"],flow_temp:["sensor.*_hp1_flow_line_temperature"],return_temp:["sensor.*_hp1_return_line_temperature"],compressor:["sensor.*_hp1_compressor_unit_rating"],power_now:["sensor.*_hp1_inverter_power_consumption"],pump_flow:["sensor.*_hp1_volume_flow_heat_sink"],error:["sensor.*_hp1_error_number"],three_way_valve:["sensor.*_hp1_request_type"],dhw_temp:["sensor.*_boil1_actual_high_temperature"],buffer_temp:["sensor.*_buff1_actual_high_temperature"],solar_temp:["sensor.*_sol1_collector_temperature"],hk1_water:["sensor.*_hc1_flow_line_temperature"],hk2_water:["sensor.*_hc2_flow_line_temperature"],hk3_water:["sensor.*_hc3_flow_line_temperature"],hk4_water:["sensor.*_hc4_flow_line_temperature"]}},{id:"idm_heatpump",version:"0.23.1",aktualisiert:"2026-10-22",hersteller:"iDM",name:"IDM Heatpump",entwickler:"Xerolux",quelle:"https://github.com/Xerolux/idm-heatpump-hass",integration:"idm_heatpump",felder:{outside_temp:["outdoor_temp"],flow_temp:["hp_flow_temp"],return_temp:["hp_return_temp"],dhw_temp:["dhw_temp"],three_way_valve:["valve_heat_dhw"],power_now:["power_consumption_hp"],pump_flow:["heat_sink_flow_rate"],solar_temp:["solar_collector_temp"],circulation_pump:["circulation_pump"]}},{id:"aquarea_heishamon",version:"2.11.7",aktualisiert:"2026-10-22",hersteller:"Panasonic Aquarea",name:"HeishaMon",entwickler:"kamaradclimber",quelle:"https://github.com/kamaradclimber/heishamon-homeassistant",integration:"aquarea",felder:{outside_temp:["main_outside_temp"],compressor:["main_compressor_freq"],pump_flow:["main_pump_flow"],error:["main_error"],water_pressure:["main_water_pressure"],buffer_delta:["main_buffer_tank_delta"],fan1_rpm:["main_fan1_motor_speed"],fan2_rpm:["main_fan2_motor_speed"],flow_temp:["main_main_outlet_temp"],return_temp:["main_main_inlet_temp"],pump_speed:["main_pump_speed"],three_way_valve:["main_threeway_valve_state"],room_heater:["main_room_heater_state"],heater_internal:["main_internal_heater_state"],heater_external:["main_external_heater_state"],operating_hours:["main_operations_hours"],compressor_starts:["main_operations_counter"],room_heater_hours:["main_room_heater_operations_hours"],dhw_heater_hours:["main_dhw_heater_operations_hours"],buffer_temp:["main_buffer_temp"],buffer_target:["main_main_target_temp"],hk1_water:["main_z1_water_temp"],hk1_water_target:["main_z1_water_target_temp"],hk2_water:["main_z2_water_temp"],hk2_water_target:["main_z2_water_target_temp"],hk1_pump:["main_z2_pump_state"],hk2_pump:["main_z1_pump_state"],dhw_temp:["main_dhw_temp"],dhw_heater:["main_dhw_heater_state"],solar_temp:["main_solar_temp"]}},{id:"aquarea_cloud",version:"1.8.2",aktualisiert:"2026-10-22",hersteller:"Panasonic Aquarea",name:"Aquarea Smart Cloud",entwickler:"wpatrik14",quelle:"https://github.com/wpatrik14/home-assistant-aquarea",integration:"aquarea",felder:{outside_temp:["outdoor_temperature"],dhw_temp:["tank_temperature"],water_pressure:["water_pressure"],error:["error_code"],defrost:["defrost"]}},{id:"kronoterm",version:"1.7.2",aktualisiert:"2026-08-05",hersteller:"Kronoterm",name:"Kronoterm",entwickler:"Favio25",quelle:"https://github.com/Favio25/Kronoterm-homeassistant",integration:"kronoterm",felder:{outside_temp:["temperature_outside"],flow_temp:["hp_outlet_temperature"],return_temp:["hp_inlet_temperature"],dhw_temp:["dhw_current_temperature"],power_now:["calculated_current_power"],operating_hours:["operating_hours_compressor_heating"],compressor_starts:["compressor_activations_heating"],water_pressure:["heating_system_pressure"],hk1_water:["loop_1_inlet_temperature"],hk2_water:["loop_2_inlet_temperature"],hk3_water:["loop_3_inlet_temperature"],hk4_water:["loop_4_inlet_temperature"],circulation_pump:["dhw_circulation_pump"],defrost:["binary_sensor:defrost_status"],error:["error_status"]}},{id:"hitachi_yutaki",version:"2.2.0-beta.13",aktualisiert:"2026-10-22",hersteller:"Hitachi",name:"Hitachi Yutaki",entwickler:"alepee",quelle:"https://github.com/alepee/hass-hitachi_yutaki",integration:"hitachi_yutaki",felder:{outside_temp:["outdoor_temp"],flow_temp:["water_outlet_temp"],return_temp:["water_inlet_temp"],compressor:["compressor_frequency"],pump_flow:["water_flow"],pump_speed:["pump_speed"],power_now:["electrical_power"],defrost:["defrost"],error:["alarm"],hk1_pump:["pump1"],hk2_pump:["pump2"],cop_heating:["cop_heating"],cop_dhw:["cop_dhw"]}},{id:"daikin_onecta",version:"5.0.2",aktualisiert:"2026-10-14",hersteller:"Daikin",name:"Daikin Onecta",entwickler:"jwillemsen",quelle:"https://github.com/jwillemsen/daikin_onecta",integration:"daikin_onecta",felder:{outside_temp:["outdoortemperature"],flow_temp:["leavingwatertemperature"],dhw_temp:["tanktemperature"],error:["isinerrorstate"]}},{id:"ha_daikin_altherma4_modbus",version:"0.7.2",aktualisiert:"2026-10-22",hersteller:"Daikin",name:"Altherma 4 Modbus",entwickler:"joklee",quelle:"https://github.com/joklee/ha_daikin_altherma4_modbus",integration:"ha_daikin_altherma4_modbus",felder:{flow_temp:["input_40"],return_temp:["input_42"],dhw_temp:["input_43"],outside_temp:["input_44"],compressor:["input_31"],three_way_valve:["input_37"],defrost:["input_35"],pump_flow:["input_49"],power_now:["input_51"],water_pressure:["input_79"]}},{id:"daikin_ha_ekrhh_modbus",version:"1.0.7",aktualisiert:"2026-10-07",hersteller:"Daikin",name:"Altherma EKRHH Modbus",entwickler:"gerione",quelle:"https://github.com/gerione/daikin-ha-ekrhh-modbus",integration:"daikin_ha_ekrhh_modbus",felder:{flow_temp:["leaving_water_temperature_phe","leaving_water_temperature_pre_phe"],return_temp:["return_water_temperature"],dhw_temp:["domestic_hot_water_temperature"],outside_temp:["outside_air_temperature"],pump_flow:["flow_rate"],power_now:["heat_pump_power_consumption"],compressor:["compressor_run","compressor_running"],three_way_valve:["3_way_valve"],defrost:["defrost_startup","defrost"]}},{id:"daikin_altherma",version:"1.5.3",aktualisiert:"2024-10-30",hersteller:"Daikin",name:"Daikin Altherma",entwickler:"tadasdanielius",quelle:"https://github.com/tadasdanielius/daikin_altherma",integration:"daikin_altherma",felder:{flow_temp:["leaving_water_temperature"],outside_temp:["outdoor_temperature"]}},{id:"qube_heatpump",version:"2026.10.11",aktualisiert:"2026-10-21",hersteller:"Qube",name:"Qube Heat Pump",entwickler:"MattieGit",quelle:"https://github.com/MattieGit/qube_heatpump",integration:"qube_heatpump",felder:{outside_temp:["temp_outside"],flow_temp:["temp_supply"],return_temp:["temp_return"],dhw_temp:["temp_dhw"],compressor:["compressor_speed"],three_way_valve:["threeway_valve_status","dout_threewayvlv_val"],pump_flow:["flow_rate"],power_now:["power_electric"],hk1_pump:["dout_usrpmp_val"]}},{id:"solarfocus",version:"7.0.1",aktualisiert:"2026-10-11",hersteller:"Solarfocus",name:"Solarfocus",entwickler:"LavermanJJ",quelle:"https://github.com/LavermanJJ/home-assistant-solarfocus",integration:"solarfocus",felder:{outside_temp:["hp_outdoor_temperature","bb_outdoor_temperature"],flow_temp:["hp_supply_temperature"],return_temp:["hp_return_temperature"],compressor:["hp_compressor_speed"],pump_flow:["hp_flow_rate"],power_now:["hp_electrical_power"],cop_heating:["hp_cop_heating"],defrost:["hp_defrost_active"],three_way_valve:["hp_boiler_charge"],solar_temp:["so_collector_temperature_1"],hk1_water:["hc_supply_temperature"],hk1_pump:["hc_circulator_pump"],circulation_pump:["ci_pump"]}},{id:"weishaupt_modbus",version:"1.0.20",aktualisiert:"2026-10-08",hersteller:"Weishaupt",name:"Weishaupt Modbus",entwickler:"OStrama",quelle:"https://github.com/OStrama/weishaupt_modbus",integration:"weishaupt_modbus",felder:{outside_temp:["aussentemp"],flow_temp:["vl_temp"],return_temp:["rl_temp"],dhw_temp:["ww_temp"],dhw_setpoint:["number:ww_normal"],buffer_temp:["puffer_temp"],hk1_water:["hz_vl_temp"],hk2_water:["hz_vl_temp2"],hk3_water:["hz_vl_temp3"],hk4_water:["hz_vl_temp4"],three_way_valve:["wp_betrieb"],error:["wp_stoermeldung"]}},{id:"stiebel_eltron_isg",version:"2025.10.0",aktualisiert:"2026-10-21",hersteller:"Stiebel Eltron",name:"Stiebel Eltron ISG",entwickler:"pail23",quelle:"https://github.com/pail23/stiebel_eltron_isg_component",integration:"stiebel_eltron_isg",felder:{outside_temp:["outdoor_temperature"],flow_temp:["flow_temperature_wp","flow_temperature"],return_temp:["return_temperature"],dhw_temp:["actual_temperature_water"],dhw_setpoint:["number:comfort_water_temperature_target"],compressor:["compressor_speed","compressor_on"],three_way_valve:["is_heating_water"],buffer_temp:["actual_temperature_buffer"],solar_temp:["solar_collector_temperature"],hk1_pump:["heating_circuit_1_pump","pump_on_hk1"],hk2_pump:["heating_circuit_2_pump","pump_on_hk2"],hk3_pump:["heating_circuit_3_pump"],hk4_pump:["heating_circuit_4_pump"],circulation_pump:["circulation_pump"],defrost:["evaporator_defrost"],error:["error_status"],power_now:["current_power_consumption"],water_pressure:["heater_pressure"],compressor_starts:["compressor_starts"]}},{id:"stiebel_eltron_http",version:"0.1.0",aktualisiert:"2026-10-04",hersteller:"Stiebel Eltron",name:"Stiebel Eltron ISG (HTTP)",entwickler:"pmq",quelle:"https://github.com/pmq/stiebel-eltron-http",integration:"stiebel_eltron_http",felder:{outside_temp:["outside_temperature"],flow_temp:["flow_temperature"],dhw_temp:["dhw_temperature"],compressor:["compressor_status"],defrost:["defrost_status"],compressor_starts:["compressor_starts"]}},{id:"waterkotte_heatpump",version:"2026.10.2",aktualisiert:"2026-10-18",hersteller:"Waterkotte",name:"Waterkotte Heatpump",entwickler:"marq24",quelle:"https://github.com/marq24/ha-waterkotte",integration:"waterkotte_heatpump",felder:{outside_temp:["temperature_outside"],flow_temp:["temperature_flow"],return_temp:["temperature_return"],dhw_temp:["temperature_water"],dhw_setpoint:["number:temperature_water_setpoint"],compressor:["percent_compressor","state_compressor"],three_way_valve:["state_water"],buffer_temp:["temperature_buffertank"],solar_temp:["temperature_solar"],power_now:["power_electric"],cop_heating:["cop_heating"],hk1_pump:["state_heating_circulation_pump_d425"],operating_hours:["operating_hours_compressor_1"],water_pressure:["pressure_water"],error:["state_alarm"]}},{id:"batavia_heat",version:"0.5.5",aktualisiert:"2026-10-18",hersteller:"Batavia Heat",name:"Batavia Heat",entwickler:"RSloot2000",quelle:"https://github.com/RSloot2000/BataviaHeat-Heat-Pump",integration:"batavia_heat",felder:{outside_temp:["ambient_temperature"],flow_temp:["total_water_outlet_temperature","water_outlet_temperature"],return_temp:["plate_hx_water_inlet_temperature"],dhw_temp:["hot_water_tank_temperature"],dhw_setpoint:["number:hot_water_setpoint"],compressor:["compressor_speed","compressor_running"],pump_flow:["pump_flow_rate"],buffer_temp:["buffer_top_temperature"]}},{id:"bosch_buderus_heating",version:"0.8.2-beta.4",aktualisiert:"2026-10-22",hersteller:"Bosch, Buderus",name:"Bosch Buderus Heating",entwickler:"SoftwareSchmied",quelle:"https://github.com/SoftwareSchmied/ha-bosch-buderus-heating",integration:"bosch_buderus_heating",felder:{outside_temp:["outdoor_temperature"],flow_temp:["supply_temperature"],return_temp:["return_temperature"],dhw_temp:["hot_water_temperature"],compressor:["compressor_status"],water_pressure:["system_pressure"],error:["active_faults"]}},{id:"remeha_modbus",version:"2.2.3",aktualisiert:"2026-10-22",hersteller:"Remeha",name:"Remeha Modbus",entwickler:"houthacker",quelle:"https://github.com/houthacker/remeha-modbus",integration:"remeha_modbus",felder:{outside_temp:["outside_temperature"],flow_temp:["heat_pump_flow_temperature","flow_temperature"],return_temp:["heat_pump_return_temperature","return_temperature"],dhw_temp:["dhw_tank_temperature_top"],pump_flow:["flow_rate"],pump_speed:["pump_speed"],operating_hours:["generator_hours_total"],compressor_starts:["generator_starts_total"],water_pressure:["actual_water_pressure"],error:["current_error"]}},{id:"dewarmte",version:"2.3.4",aktualisiert:"2026-10-02",hersteller:"DeWarmte",name:"DeWarmte",entwickler:"ronald-willems",quelle:"https://github.com/ronald-willems/dewarmte-homeassistant",integration:"dewarmte",felder:{outside_temp:["outdoor_temperature"],flow_temp:["supply_temperature"],dhw_temp:["top_boiler_temperature","top_boiler_temp"],pump_flow:["water_flow"]}},{id:"keba_heat_pump_modbus",version:"1.5.0",aktualisiert:"2026-10-09",hersteller:"KEBA",name:"KEBA Heat Pump Modbus",entwickler:"johannesWen",quelle:"https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration",integration:"keba_heat_pump_modbus",felder:{flow_temp:["flow_temperature"],return_temp:["reflux_temperature"],dhw_temp:["top_temperature"],power_now:["heat_power_consumption"],pump_flow:["flow_rate"]}},{id:"thermia",version:"1.0",aktualisiert:"2025-12-04",hersteller:"Thermia",name:"Thermia Heat Pump",entwickler:"klejejs",quelle:"https://github.com/klejejs/ha-thermia-heat-pump-integration",integration:"thermia",felder:{outside_temp:["outdoor_temperature"],flow_temp:["supply_line_temperature"],return_temp:["return_line_temperature"],dhw_temp:["hot_water_temperature"],buffer_temp:["buffer_tank_temperature"],operating_hours:["compressor_operational_time"]}},{id:"wolf_ism8",version:"4.6",aktualisiert:"2026-10-12",hersteller:"Wolf",name:"Wolf ISM8",entwickler:"marcschmiedchen",quelle:"https://github.com/marcschmiedchen/home-assistant-wolf_ism8",integration:"wolf",felder:{outside_temp:["sensor.*waermepumpe*_aussentemperatur"],return_temp:["sensor.*waermepumpe*_ruecklauftemperatur"],dhw_temp:["sensor.*waermepumpe*_warmwassertemperatur"],three_way_valve:["*waermepumpe*_3w_umschaltventil_hz_ww"],hk1_pump:["*waermepumpe*_status_heizkreispumpe"],power_now:["sensor.*waermepumpe*_leistungsaufnahme"],water_pressure:["sensor.*waermepumpe*_anlagendruck"],error:["*waermepumpe*_stoerung"]}},{id:"mypyllant",version:"v0.9.19",aktualisiert:"2026-07-22",hersteller:"Vaillant",name:"myPyllant",entwickler:"signalkraft",quelle:"https://github.com/signalkraft/mypyllant-component",integration:"mypyllant",felder:{outside_temp:["outdoor_temperature"],flow_temp:["system_flow_temperature"],dhw_temp:["sensor.*_domestic_hot_water_0_tank_temperature"],hk1_water:["sensor.*_circuit_0_current_flow_temperature"],hk2_water:["sensor.*_circuit_1_current_flow_temperature"],hk3_water:["sensor.*_circuit_2_current_flow_temperature"],water_pressure:["system_water_pressure"]}},{id:"ha_heliotherm",version:"v1.0.43",aktualisiert:"2025-09-07",hersteller:"Heliotherm",name:"Heliotherm",entwickler:"mbuchber",quelle:"https://github.com/mbuchber/ha_heliotherm",integration:"ha_heliotherm",felder:{outside_temp:["temp_aussen"],flow_temp:["temp_vorlauf"],return_temp:["temp_rucklauf","temp_ruecklauf"],dhw_temp:["temp_brauchwasser"],buffer_temp:["temp_pufferspeicher"],compressor:["on_off_verdichter"],hk1_pump:["on_off_heizkreispumpe"],power_now:["stromz_leistung"],pump_flow:["wmz_durchfluss"],error:["on_off_stoerung"]}}];var AUTO_PROFIL="auto",PROFILE=[{id:"heishamon_lutarym",hersteller:"Panasonic Aquarea",name:"Panasonic Aquarea, HeishaMon by Lutarym",integrationName:"HeishaMon by Lutarym",entwickler:"Lutarym",quelle:"https://github.com/Lutarym/Heishamon-by-Lutarym",integration:"heishamon_lutarym",version:"1.3.1",aktualisiert:"2026-10-18",fertig:!0,getestet:!0,hilfe:!0},{id:"heishamon",hersteller:"Panasonic Aquarea",name:"Panasonic Aquarea, HeishaMon über MQTT-Namensschema",integrationName:"HeishaMon (MQTT)",entwickler:"",quelle:"https://github.com/heishamon/HeishaMon",mqtt:!0,fertig:!0,getestet:!0,hilfe:!0}].concat(HERSTELLER_PROFILE.map(p=>({id:p.id,hersteller:p.hersteller,name:`${p.hersteller}, ${p.name}`,integrationName:p.name,entwickler:p.entwickler,quelle:p.quelle,integration:p.integration,version:p.version||"",aktualisiert:p.aktualisiert||"",core:!!p.core,fertig:!0,getestet:!1,hilfe:p.id==="aquarea_heishamon"}))),PROFIL_FORMAT="lutarym-geraeteprofil",PROFIL_VERSION=1;function eingebautesProfil(id){let hp=HERSTELLER_PROFILE.find(x=>x.id===id);if(hp)return{format:PROFIL_FORMAT,version:PROFIL_VERSION,id:hp.id,name:`${hp.hersteller}, ${hp.name}`,hersteller:hp.hersteller,entwickler:hp.entwickler,integration:hp.integration,namensteil:hp.namensteil||"",felder:JSON.parse(JSON.stringify(hp.felder))};let pr=PROFILE.find(x=>x.id===id);if(!pr||!pr.fertig)return null;let mqtt=id==="heishamon",felder={},bekannt=profilFeldnamen(),dazu=(feld,regel)=>{bekannt.includes(feld)&&(felder[feld]||(felder[feld]=[]),felder[feld].includes(regel)||felder[feld].push(regel))};return[TOPIC_TO_FIELD,COMMAND_TO_FIELD].forEach(tabelle=>Object.keys(tabelle).forEach(k=>dazu(tabelle[k],mqtt?`*.heishamon_${k}`:k))),Object.keys(COP_TO_FIELD).forEach(k=>dazu(COP_TO_FIELD[k],mqtt?`sensor.heishamon*_${k}`:k)),{format:PROFIL_FORMAT,version:PROFIL_VERSION,id:pr.id,name:pr.name,hersteller:"Panasonic",integration:mqtt?"":INTEGRATION_DOMAIN,namensteil:"heishamon",felder}}function profilFeldnamen(){return ENTITY_FIELDS.map(f=>f.key).concat(["operating_mode"])}function eigeneProfile(config){return(config&&Array.isArray(config.profile_custom)?config.profile_custom:[]).filter(p=>p&&typeof p=="object"&&typeof p.id=="string")}function eigenesProfil(config){let id=config&&config.profil;return eigeneProfile(config).find(p=>p.id===id)||null}function pruefeProfil(roh){if(!roh||typeof roh!="object"||Array.isArray(roh))return{fehler:"m_p_format"};if(roh.format!==PROFIL_FORMAT)return{fehler:"m_p_format"};if(Number(roh.version)!==PROFIL_VERSION)return{fehler:"m_p_version"};let id=String(roh.id||"").trim();if(!/^[a-z0-9_-]{2,40}$/.test(id))return{fehler:"m_p_id"};if(!roh.felder||typeof roh.felder!="object"||Array.isArray(roh.felder))return{fehler:"m_p_felder"};let bekannt=profilFeldnamen(),felder={},unbekannt=[];if(Object.keys(roh.felder).forEach(feld=>{if(!bekannt.includes(feld)){unbekannt.push(feld);return}let regeln=[].concat(roh.felder[feld]).filter(r=>typeof r=="string"&&r.trim()).map(r=>r.trim());regeln.length&&(felder[feld]=regeln)}),!Object.keys(felder).length)return{fehler:"m_p_felder"};let text=(w,max)=>String(w??"").trim().slice(0,max);return{profil:{format:PROFIL_FORMAT,version:PROFIL_VERSION,id,name:text(roh.name,80)||id,hersteller:text(roh.hersteller,60),entwickler:text(roh.entwickler,60),integration:text(roh.integration,60),namensteil:text(roh.namensteil,60),felder},unbekannt}}function erkenneMitProfil(hass,p){let result={found:!1,source:"keine",entities:{},count:0,devices:0};if(!hass||!p||!p.felder)return result;let regeln=[],rangZaehler={};Object.keys(p.felder).forEach(feld=>[].concat(p.felder[feld]).forEach(w=>{if(typeof w!="string"||!w.trim())return;let text=w.trim(),domain="",m=text.match(/^([a-z_]+):(.+)$/);m&&(domain=m[1],text=m[2]);let r={feld,w:text,klein:text.toLowerCase(),domain,rang:rangZaehler[feld]=(rangZaehler[feld]||0)+1};r.w.includes("*")&&(r.re=new RegExp("^"+r.w.split("*").map(x=>x.replace(/[.+?^${}()|[\]\\]/g,"\\$&")).join(".*")+"$","i")),regeln.push(r)}));let passt=(r,id,eintrag)=>{if(r.domain&&id.split(".")[0]!==r.domain)return 0;if(r.re)return r.re.test(id)?1:0;if(r.w.includes("."))return id===r.w?2:0;let klein=id.toLowerCase();return eintrag&&eintrag.translation_key===r.w||klein.split(".")[1]===r.klein?2:klein.endsWith(`_${r.klein}`)?1:0},guete={},assign=(feld,entityId,rang,art)=>{let allowed=FIELD_DOMAIN[feld];if(allowed&&!allowed.includes(entityId.split(".")[0]))return;let bisher=result.entities[feld];if(bisher){let sb=stellbar(bisher),sn=stellbar(entityId);if(sb&&!sn)return;if(sb===sn){let g=guete[feld];if(rang>g.rang||rang===g.rang&&art<=g.art)return}}result.entities[feld]=entityId,guete[feld]={rang,art}},pruefe=(id,eintrag)=>{let treffer=!1;return regeln.forEach(r=>{let art=passt(r,id,eintrag);art&&(assign(r.feld,id,r.rang,art),treffer=!0)}),treffer},reg=hass.entities;if(p.integration&&reg&&typeof reg=="object"){let geraete=new Set,hits2=0;if(Object.keys(reg).forEach(id=>{let e=reg[id];!e||e.platform!==p.integration||(hits2++,e.device_id&&geraete.add(e.device_id),pruefe(id,e))}),hits2>0)return result.found=!0,result.source="register",result.count=hits2,result.devices=geraete.size,result}let teil=String(p.namensteil||"").toLowerCase();if(p.integration&&!teil)return result;let hits=0;return Object.keys(hass.states||{}).forEach(id=>{teil&&!id.toLowerCase().includes(teil)||pruefe(id,reg&&reg[id])&&hits++}),hits>0&&(result.found=!0,result.source="namensschema",result.count=hits,result.devices=1),result}var BEREICHE=[["b_temp",/^(outside_temp|flow_temp|return_temp|dhw_temp)$/],["b_verdichter",/^(compressor|fan\d_rpm)$/],["b_ventil",/^three_way_valve$/],["b_pumpe",/^(pump_flow|pump_speed|circulation_pump|circ_switch|pump_flow_mode|pump_max_duty)$/],["b_heizkreise",/^(hk\d_|zones_)/],["b_puffer",/^buffer_/],["b_warmwasser",/^(dhw_|sterilization|force_sterilization|steril_)/],["b_zusatz",/^(solar_|kamin_|heater_|room_heater)/],["b_energie",/^(power_now|energy_today|pv_power|cop_|jaz)/],["b_zaehler",/(_hours|_starts)$/],["b_status",/^(error|defrost|water_pressure|heatpump_state|operating_mode|power_state|mode_select)$/],["b_kurve",/^curve/],["b_sg",/^sg_/]];function profilBereiche(felder){let out=[];felder.forEach(f=>{let b=BEREICHE.find(([,re])=>re.test(f)),k=b?b[0]:"b_sonstige";out.includes(k)||out.push(k)});let reihe=BEREICHE.map(b=>b[0]).concat("b_sonstige");return out.sort((a,b)=>reihe.indexOf(a)-reihe.indexOf(b))}var INTEGRATION_DOMAIN="heishamon_lutarym",TOPIC_TO_FIELD={top0:"heatpump_state",top82:"curve2_t_high",top83:"curve2_t_low",top84:"curve2_o_high",top85:"curve2_o_low",top29:"curve_t_high",top30:"curve_t_low",top31:"curve_o_high",top32:"curve_o_low",top22:"dhw_heat_delta",top2:"dhw_force_state",top69:"sterilization_state",top14:"outside_temp",top4:"operating_mode",top8:"compressor",top1:"pump_flow",top44:"error",top115:"water_pressure",top113:"buffer_delta",top62:"fan1_rpm",top63:"fan2_rpm",top26:"defrost",top6:"flow_temp",top5:"return_temp",top65:"pump_speed",top20:"three_way_valve",top59:"room_heater",top60:"heater_internal",top77:"heating_off_temp",top78:"heater_on_temp",top23:"heat_delta",top70:"steril_temp",top71:"steril_time",top95:"pump_max_duty",top11:"operating_hours",top12:"compressor_starts",top90:"room_heater_hours",top91:"dhw_heater_hours",top61:"heater_external",top46:"buffer_temp",top94:"zones_state",top99:"buffer_installed",top100:"dhw_installed",top7:"buffer_target",top36:"hk1_water",top42:"hk1_water_target",top124:"hk1_pump",top27:"hk1_setpoint",top37:"hk2_water",top43:"hk2_water_target",top123:"hk2_pump",top34:"hk2_setpoint",top10:"dhw_temp",top9:"dhw_setpoint",top58:"dhw_heater",top47:"solar_temp",opt5:"solar_pump"},COMMAND_TO_FIELD={setheatpump:"power_state",setoperationmode:"mode_select",setforcedhw:"dhw_force",setforcesterilization:"force_sterilization",setforcedefrost:"force_defrost",setdhwheaterstate:"dhw_heater_switch",setroomheaterstate:"room_heater_switch",setpowerfulmode:"powerful_mode",setquietmode:"quiet_mode",setzones:"zones_select",setbuffer:"buffer_switch",setheatingcontrol:"heating_control",setpumpflowratemode:"pump_flow_mode",setquietmodepriority:"quiet_priority",setholidaymode:"holiday_mode",setmainschedule:"main_schedule",setsmartdhw:"smart_dhw"},COP_TO_FIELD={cop_heating:"cop_heating",cop_dhw:"cop_dhw"},COP_MUSTER=/_(cop_(?:heating|dhw))$/,FIELD_DOMAIN={hk1_setpoint:["number","input_number"],hk2_setpoint:["number","input_number"],dhw_setpoint:["number","input_number"],power_state:["switch","input_boolean","binary_sensor","sensor"],mode_select:["select","input_select"],dhw_force:["switch","input_boolean"],hk1_switch:["switch","input_boolean"],hk2_switch:["switch","input_boolean"],hk3_switch:["switch","input_boolean"],hk4_switch:["switch","input_boolean"],force_sterilization:["switch","input_boolean"],force_defrost:["switch","input_boolean"],dhw_heater_switch:["switch","input_boolean"],room_heater_switch:["switch","input_boolean"],powerful_mode:["select","input_select"],quiet_mode:["select","input_select"],zones_select:["select","input_select"],buffer_switch:["switch","input_boolean"],heating_control:["select","input_select"],pump_flow_mode:["select","input_select"],quiet_priority:["select","input_select"],holiday_mode:["switch","input_boolean"],main_schedule:["switch","input_boolean"],smart_dhw:["select","input_select"],circulation_pump:["switch","input_boolean","binary_sensor","sensor"],circ_switch:["switch","input_boolean"],sg_k1:["switch","input_boolean","binary_sensor","sensor"],sg_k2:["switch","input_boolean","binary_sensor","sensor"]};function detectIntegration(hass,profil){if(profil&&typeof profil=="object")return erkenneMitProfil(hass,profil);let result={found:!1,source:"keine",entities:{},count:0,devices:0};if(!hass)return result;let assign=(key,entityId)=>{let field=TOPIC_TO_FIELD[key]||COMMAND_TO_FIELD[key]||COP_TO_FIELD[key];if(!field||!entityId)return;let allowed=FIELD_DOMAIN[field];if(allowed&&!allowed.includes(entityId.split(".")[0]))return;let bisher=result.entities[field];bisher&&stellbar(bisher)&&!stellbar(entityId)||(result.entities[field]=entityId)},registry=profil==="heishamon"?null:hass.entities;if(registry&&typeof registry=="object"){let deviceIds=new Set,hits2=0;if(Object.keys(registry).forEach(entityId=>{let entry=registry[entityId];if(!entry||entry.platform!==INTEGRATION_DOMAIN)return;hits2++,entry.device_id&&deviceIds.add(entry.device_id);let key=(entityId.match(COP_MUSTER)||[])[1]||entry.translation_key||(entityId.match(/_(top\d+)$/)||[])[1]||(entityId.match(/heishamon_(set\w+)$/)||[])[1]||null;key&&assign(key,entityId)}),hits2>0)return result.found=!0,result.source="register",result.count=hits2,result.devices=deviceIds.size,result}let hits=0;return Object.keys(hass.states||{}).forEach(entityId=>{if(/^sensor\.heishamon_/.test(entityId)){let c=entityId.match(COP_MUSTER);c&&assign(c[1],entityId)}let m=entityId.match(/^(?:sensor|number|switch|select)\.heishamon_((?:top\d+)|(?:set\w+))$/);m&&(hits++,assign(m[1],entityId))}),hits>0&&(result.found=!0,result.source="namensschema",result.count=hits,result.devices=1),result}function profilFuer(config,hass){let eigen=eigenesProfil(config);if(eigen)return eigen;let id=config&&config.profil||AUTO_PROFIL;if(id===AUTO_PROFIL){let liste=erkenneAlle(hass);return liste.length?profilFuer({...config,profil:liste[0].id}):"heishamon_lutarym"}return HERSTELLER_PROFILE.some(p=>p.id===id)?eingebautesProfil(id):id}var MIN_FELDER=2;function erkenneAlle(hass){if(!hass)return[];let treffer=[],hm=detectIntegration(hass,"heishamon_lutarym");if(hm&&hm.found&&Object.keys(hm.entities).length>=MIN_FELDER){let id=hm.source==="register"?"heishamon_lutarym":"heishamon";treffer.push({id,felder:Object.keys(hm.entities).length,count:hm.count})}return HERSTELLER_PROFILE.forEach(p=>{let r=erkenneMitProfil(hass,eingebautesProfil(p.id)),n=Object.keys(r.entities).length;r.found&&n>=MIN_FELDER&&treffer.push({id:p.id,felder:n,count:r.count})}),treffer.sort((a,b)=>b.felder-a.felder)}function quellenZuordnung(entities,extraHeat,profil){if(extraHeat!=="kamin"||profil&&typeof profil=="object"&&HERSTELLER_PROFILE.some(p=>p.id===profil.id))return entities;let out={...entities};return out.solar_temp&&!out.kamin_temp&&(out.kamin_temp=out.solar_temp),out.solar_pump&&!out.kamin_pump&&(out.kamin_pump=out.solar_pump),delete out.solar_temp,delete out.solar_pump,out}function defaultEntityMap(){let map={};return Object.keys(TOPIC_TO_FIELD).forEach(topic=>{let field=TOPIC_TO_FIELD[topic],allowed=FIELD_DOMAIN[field];map[field]=`${allowed?allowed[0]:"sensor"}.heishamon_${topic}`}),Object.keys(COMMAND_TO_FIELD).forEach(cmd=>{let field=COMMAND_TO_FIELD[cmd];map[field]=`${FIELD_DOMAIN[field][0]}.heishamon_${cmd}`}),map}var bedienungEditor={_merke(k,v){try{if(v===void 0)return window.localStorage.getItem(`lhc-editor-${k}`);window.localStorage.setItem(`lhc-editor-${k}`,v)}catch{}return null},_modus(){return this._editorModus||(this._editorModus=this._merke("modus")==="erweitert"?"erweitert":"einfach"),this._editorModus},_feldHilfe(f){let hint=String(f.hint||""),tops=(hint.match(/\b(X?TOP\d+)\b/g)||[]).map(x=>x.toUpperCase()),befehle=(hint.match(/\bSet\w+\b/g)||[]).map(x=>x.toLowerCase());if(!tops.length&&!befehle.length)return"";let sp=this._sp();for(let g of hilfeDaten()||[])for(let i=0;i<g.e.length;i++){let e=g.e[i];if(e.l&&tops.includes(e.l.toUpperCase())||e.s&&befehle.includes(e.s.toLowerCase()))return hilfeText(sp,`${g.id}.${i}.t`,e.t)}return""},_bindeEditorBedienung(){let sr=this.shadowRoot;if(!this._offen){this._offen=new Set;let gemerkt=this._merke("offen");try{JSON.parse(gemerkt||'["darstellung","d-allgemein"]').forEach(k=>this._offen.add(k))}catch{this._offen.add("darstellung"),this._offen.add("d-allgemein")}}sr.querySelectorAll("details[data-klapp]").forEach(d=>{d.open=this._offen.has(d.dataset.klapp),d.addEventListener("toggle",()=>{d.open?this._offen.add(d.dataset.klapp):this._offen.delete(d.dataset.klapp),this._merke("offen",JSON.stringify([...this._offen]))})}),sr.querySelectorAll("#ed-modus button").forEach(b=>b.addEventListener("click",()=>{this._editorModus=b.dataset.modus,this._merke("modus",this._editorModus),this._zeigeModus()}));let filter=sr.getElementById("ed-nur-fehlende");filter&&(filter.checked=this._nurFehlende===!0,filter.addEventListener("change",()=>{this._nurFehlende=filter.checked,this._zeigeEntitaetsZustand()})),sr.querySelectorAll("button[data-frage]").forEach(b=>b.addEventListener("click",ev=>{ev.preventDefault();let p=sr.querySelector(`[data-erklaerung="${b.dataset.frage}"]`);p&&(p.hidden=!p.hidden)})),this._zeigeModus()},_zeigeModus(){let sr=this.shadowRoot,ed=sr.querySelector(".ed");ed&&ed.classList.toggle("einfach",this._modus()==="einfach"),sr.querySelectorAll("#ed-modus button").forEach(b=>b.classList.toggle("aktiv",b.dataset.modus===this._modus()))},_zeigeEntitaetsZustand(){let sr=this.shadowRoot,ent=this._config.entities||{},states=this._hass&&this._hass.states||{},sichtbarGesamt=0;sr.querySelectorAll("details[data-gruppe]").forEach(d=>{let da=0,alle=0,sichtbar=0;d.querySelectorAll(".ed-feld").forEach(row=>{let k=row.dataset.feld,v=ent[k]||"",ok=!!v&&!!states[v],zustand=v?ok?"ok":"fehlt":"leer";alle++,ok&&da++;let z=row.querySelector(".ed-zustand");z&&(z.dataset.wert=zustand,z.textContent=zustand==="ok"?"✓":zustand==="fehlt"?"!":"",z.title=this._t(zustand==="ok"?"f_ok":zustand==="fehlt"?"f_fehlt":"f_leer"));let zeigen=!this._nurFehlende||zustand!=="ok";row.hidden=!zeigen,zeigen&&sichtbar++});let zahl=d.querySelector(".ed-zahl");zahl&&(zahl.textContent=tf(this._t("e_zugeordnet"),{a:da,b:alle}),zahl.classList.toggle("voll",da===alle)),d.hidden=sichtbar===0,sichtbarGesamt+=sichtbar});let allesDa=sr.getElementById("ed-alles-da");allesDa&&(allesDa.hidden=!(this._nurFehlende&&sichtbarGesamt===0))},async _entitaetsAuswahl(){let name="ha-entity-picker";try{if(!customElements.get(name)&&typeof window.loadCardHelpers=="function"){let karte=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]});karte&&karte.constructor&&karte.constructor.getConfigElement&&await karte.constructor.getConfigElement()}customElements.get(name)||await Promise.race([customElements.whenDefined(name),new Promise((_,nein)=>{setTimeout(()=>nein(new Error("zeit")),3e3)})])}catch{return}!customElements.get(name)||!this.shadowRoot||this.shadowRoot.querySelectorAll("input[data-entity]").forEach(input=>{let key=input.dataset.entity,feld=ENTITY_FIELDS.find(f=>f.key===key),picker;try{picker=document.createElement(name),picker.hass=this._hass,picker.value=(this._config.entities||{})[key]||"";let bereiche=feld&&FIELD_DOMAIN[key];picker.includeDomains=bereiche||["sensor","number","input_number","binary_sensor","switch","input_boolean","select","input_select","button","input_button"],picker.allowCustomEntity=!0}catch{return}picker.dataset.entity=key,picker.classList.add("ed-picker"),picker.addEventListener("value-changed",ev=>{ev.stopPropagation();let v=String(ev.detail&&ev.detail.value||"").trim(),entities={...this._config.entities};v?entities[key]=v:delete entities[key],this._config={...this._config,entities},this._emit(),this._zeigeEntitaetsZustand()}),input.replaceWith(picker)})}};var stilEditor={_css(){return`
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
      details.ed-group[hidden], .ed-feld[hidden], .ed-row[hidden] { display: none; }
      .ed-profilinfo { border: 1px solid var(--divider-color, #33415A); border-radius: 10px; padding: 10px 12px; margin-top: 6px; font-size: 13px; }
      .ed-profilinfo[hidden] { display: none; }
      .ed-profilinfo h5 { margin: 0 0 8px; font-size: 14px; color: var(--primary-color, #9FC6FF); }
      .ed-profilinfo dl { display: grid; grid-template-columns: minmax(110px, 38%) 1fr; gap: 5px 10px; margin: 0; }
      .ed-profilinfo dt { color: var(--secondary-text-color, #9AA6B8); }
      .ed-profilinfo dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
      .ed-profilinfo .grau { color: var(--secondary-text-color, #9AA6B8); }
      .ed-profilinfo .ja { color: var(--success-color, #4ADE80); }
      .ed-profilinfo .nein { color: var(--warning-color, #F59E0B); }
      .ed-profilinfo .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
      .ed-profilinfo .chips b { font-weight: 400; font-size: 12px; border-radius: 10px; padding: 2px 8px; background: rgba(127, 140, 160, 0.18); }
      .ed-profilinfo .ed-bericht { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .ed-profilinfo .ed-meldung { margin: 6px 0 0; font-size: 12px; color: var(--secondary-text-color, #9AA6B8); }
      .ed-profilinfo a { color: var(--primary-color, #7CC4FF); }
      .ed-profilwahl { border: 1px solid var(--warning-color, #F59E0B); border-radius: 8px; padding: 6px 8px; }
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
    `}};var werkzeugeEditor={_sprachOptionen(){let eigene=Array.isArray(this._config.language_custom)?this._config.language_custom:[],html=[`<option value="auto">${escapeHtml(this._t("e_auto"))}</option>`];return SPRACHEN.forEach(code=>{let ersetzt=eigene.find(p=>p.code===code),name=ersetzt?`${ersetzt.name} ${this._t("o_p_angepasst")}`:SPRACH_NAMEN[code];html.push(`<option value="${code}">${escapeHtml(name)}</option>`)}),eigene.filter(p=>p&&!SPRACHEN.includes(p.code)).forEach(p=>{html.push(`<option value="${escapeHtml(p.code)}">${escapeHtml(p.name)} ${escapeHtml(this._t("o_p_eigen"))}</option>`)}),html.join("")},_zeigeSprachKnoepfe(){let weg=this.shadowRoot.getElementById("btn-sprache-weg"),eigene=Array.isArray(this._config.language_custom)?this._config.language_custom:[];weg&&(weg.hidden=!eigene.some(p=>p.code===this._config.language))},_bindeSprachen(){let sr=this.shadowRoot,sagen=text=>{let el=sr.getElementById("ed-sprache-hinweis");el&&(el.textContent=text)},neuAufbauen=hinweis=>{this._built=!1,this._render();let el=this.shadowRoot.getElementById("ed-sprache-hinweis");el&&(el.textContent=hinweis)},speichern=(liste,code,hinweis)=>{this._config={...this._config,language_custom:liste,language:code},registriereSprachen(this._config),this._emit(),neuAufbauen(hinweis)},aus=sr.getElementById("btn-sprache-aus");aus&&aus.addEventListener("click",()=>{let paket=sprachpaketFuer(this._sp()),text=JSON.stringify(paket,null,2);try{let url=URL.createObjectURL(new Blob([text],{type:"application/json"})),link=document.createElement("a");link.href=url,link.download=`sprache-${paket.code}.json`,link.click(),setTimeout(()=>URL.revokeObjectURL(url),1e3),sagen(tf(this._t("m_s_export_ok"),{n:paket.name}))}catch{sagen(this._t("m_datei_fehler"))}});let datei=sr.getElementById("ed-sprache-datei"),ein=sr.getElementById("btn-sprache-ein");ein&&datei&&(ein.addEventListener("click",()=>datei.click()),datei.addEventListener("change",()=>{let f=datei.files&&datei.files[0];if(!f)return;let leser=new FileReader;leser.onload=()=>{let roh;try{roh=JSON.parse(String(leser.result||""))}catch{sagen(this._t("m_json"));return}let erg=pruefeSprache(roh);if(erg.fehler){sagen(this._t(erg.fehler));return}let neu=erg.paket,liste=(Array.isArray(this._config.language_custom)?this._config.language_custom:[]).filter(p=>p.code!==neu.code);liste.push(neu),registriereSprachen({language_custom:liste});let teile=[tf(t("m_s_import_ok",neu.code),{n:neu.name,z:Object.keys(neu.texte).length,h:Object.keys(neu.hilfe).length})];erg.fehlen&&teile.push(tf(t("m_s_fehlen",neu.code),{z:erg.fehlen})),erg.platz.length&&teile.push(tf(t("m_s_platz",neu.code),{liste:erg.platz.slice(0,5).join(", ")})),erg.unbekannt.length&&teile.push(tf(t("m_s_unbekannt",neu.code),{z:erg.unbekannt.length})),erg.zeichen.length&&teile.push(tf(t("m_s_zeichen",neu.code),{liste:erg.zeichen.slice(0,5).join(", ")})),speichern(liste,neu.code,teile.join(". ")+".")},leser.onerror=()=>sagen(this._t("m_datei_lesen")),leser.readAsText(f),datei.value=""}));let weg=sr.getElementById("btn-sprache-weg");weg&&weg.addEventListener("click",()=>{let code=this._config.language,liste=(Array.isArray(this._config.language_custom)?this._config.language_custom:[]).filter(p=>p.code!==code),eingebaut=SPRACHEN.includes(code);registriereSprachen({language_custom:liste},code),speichern(liste,eingebaut?code:"auto","");let el=this.shadowRoot.getElementById("ed-sprache-hinweis");el&&(el.textContent=this._t(eingebaut?"m_s_zurueck":"m_s_entfernt"))}),this._zeigeSprachKnoepfe()},_eigeneGruppe(){return"__eigen"},_herstellerVon(id){if(!id||id===AUTO_PROFIL)return AUTO_PROFIL;let pr=PROFILE.find(x=>x.id===id);return pr?pr.hersteller:eigeneProfile(this._config).some(p=>p.id===id)?this._eigeneGruppe():AUTO_PROFIL},_profileVon(hersteller){return hersteller===this._eigeneGruppe()?eigeneProfile(this._config).filter(p=>!PROFILE.some(pr=>pr.id===p.id)).map(p=>({id:p.id,name:p.name,integrationName:p.name,entwickler:p.entwickler||"",eigen:!0})):PROFILE.filter(pr=>pr.hersteller===hersteller)},_erstesProfilVon(hersteller){if(hersteller===AUTO_PROFIL)return AUTO_PROFIL;let liste=this._profileVon(hersteller);return liste.length?liste[0].id:AUTO_PROFIL},_herstellerOptionen(){let namen=[...new Set(PROFILE.map(pr=>pr.hersteller))].sort((x,y)=>x.localeCompare(y)),html=[`<option value="${AUTO_PROFIL}">${escapeHtml(this._t("o_p_auto"))}</option>`];return namen.forEach(n=>{let zusatz=PROFILE.filter(pr=>pr.hersteller===n).every(pr=>!pr.getestet)?` ${this._t("o_p_ungetestet")}`:"";html.push(`<option value="${escapeHtml(n)}">${escapeHtml(n+zusatz)}</option>`)}),this._profileVon(this._eigeneGruppe()).length&&html.push(`<option value="${this._eigeneGruppe()}">${escapeHtml(this._t("o_p_eigene_gruppe"))}</option>`),html.join("")},_profilBeschriftung(pr){let eigene=eigeneProfile(this._config),ersetzt=!pr.eigen&&eigene.find(p=>p.id===pr.id),text=pr.integrationName||pr.name;return pr.entwickler&&(text+=` · ${tf(this._t("o_p_von"),{n:pr.entwickler})}`),ersetzt?text+=` ${this._t("o_p_angepasst")}`:pr.eigen?text+=` ${this._t("o_p_eigen")}`:pr.getestet||(text+=` ${this._t("o_p_ungetestet")}`),text},_profilOptionen(){let hersteller=this._herstellerVon(this._config.profil);return hersteller===AUTO_PROFIL?`<option value="${AUTO_PROFIL}">${escapeHtml(this._t("o_p_auto"))}</option>`:this._profileVon(hersteller).map(pr=>`<option value="${escapeHtml(pr.id)}">${escapeHtml(this._profilBeschriftung(pr))}</option>`).join("")},_profilName(id){let eigen=eigeneProfile(this._config).find(p=>p.id===id);if(eigen)return eigen.name;let pr=PROFILE.find(x=>x.id===id);return pr?pr.entwickler?`${pr.name} (${pr.entwickler})`:wertText(pr.name,this._sp()):id},_zeigeProfilAuswahl(){let sr=this.shadowRoot,id=this._config.profil||AUTO_PROFIL,hersteller=this._herstellerVon(id),hWahl=sr.getElementById("opt-hersteller");hWahl&&(hWahl.innerHTML=this._herstellerOptionen(),hWahl.value=hersteller);let pWahl=sr.getElementById("opt-profil");pWahl&&(pWahl.innerHTML=this._profilOptionen(),pWahl.value=hersteller===AUTO_PROFIL?AUTO_PROFIL:id);let zeile=sr.getElementById("ed-geraet-zeile");zeile&&(zeile.hidden=hersteller===AUTO_PROFIL||this._profileVon(hersteller).length<2);let wahlBox=sr.getElementById("ed-profil-wahl"),wahl=sr.getElementById("opt-profil-wahl"),kandidaten=id===AUTO_PROFIL&&this._hass?erkenneAlle(this._hass):[];wahlBox&&wahl&&(wahlBox.hidden=kandidaten.length<2,wahl.innerHTML=[`<option value="">${escapeHtml(this._t("o_p_bitte"))}</option>`].concat(kandidaten.map(k=>`<option value="${escapeHtml(k.id)}">${escapeHtml(tf(this._t("o_p_kandidat"),{n:this._profilName(k.id),z:k.felder}))}</option>`)).join(""),wahl.value=""),this._zeigeProfilInfo(id===AUTO_PROFIL?kandidaten[0]&&kandidaten[0].id||"":id,id===AUTO_PROFIL),this._zeigeProfilKnoepfe()},_datum(text){let m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(text||""));if(!m)return"";try{return new Intl.DateTimeFormat(this._sp(),{dateStyle:"medium",timeZone:"UTC"}).format(new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]))))}catch{return text}},_zeigeProfilInfo(id,auto){let box=this.shadowRoot.getElementById("ed-profil-info");if(!box)return;if(!id){box.hidden=!0,box.innerHTML="";return}let e=escapeHtml,eigen=eigeneProfile(this._config).find(p=>p.id===id),pr=PROFILE.find(x=>x.id===id),daten2=eigen||eingebautesProfil(id),felder=daten2?Object.keys(daten2.felder):[],zeilen=[],zeile=(titel,inhalt)=>zeilen.push(`<dt>${e(this._t(titel))}</dt><dd>${inhalt}</dd>`),jaNein=(ja,textJa,textNein)=>`<span class="${ja?"ja":"nein"}">${e(this._t(ja?textJa:textNein))}</span>`,integration=eigen&&eigen.integration||pr&&pr.integration||"",name=eigen?eigen.name:pr?pr.integrationName||pr.name:id;zeile("pi_integration",`${e(name)}${integration?` <span class="grau">(${e(integration)})</span>`:""}`);let entwickler=eigen&&eigen.entwickler||pr&&pr.entwickler||"",quelle=!eigen&&pr&&pr.quelle&&/^https:\/\//.test(pr.quelle)?pr.quelle:"";if(entwickler||quelle){let link=quelle?`<a href="${e(quelle)}" target="_blank" rel="noopener noreferrer">${e(quelle.replace(/^https:\/\//,""))}</a>`:"";zeile("pi_entwickler",[e(entwickler),link].filter(Boolean).join(" · "))}eigen?zeile("pi_version",`<span class="grau">${e(this._t("pi_eigen"))}</span>`):pr&&pr.core?zeile("pi_version",e(this._t("pi_core"))):pr&&pr.mqtt?zeile("pi_version",e(this._t("pi_mqtt"))):pr&&(pr.version&&zeile("pi_version",`${e(pr.version)} <span class="grau">(manifest.json)</span>`),pr.aktualisiert&&zeile("pi_aenderung",`${e(this._datum(pr.aktualisiert))} <span class="grau">· ${e(tf(this._t("pi_stand"),{d:this._datum(PROFIL_STAND)}))}</span>`));let bereiche=profilBereiche(felder);if(zeile("pi_beschreibt",`${e(tf(this._t("pi_felder"),{z:felder.length}))}<div class="chips">${bereiche.map(b=>`<b>${e(this._t(b))}</b>`).join("")}</div>`),this._hass&&daten2){let gefunden=detectIntegration(this._hass,eigen||pr&&!pr.mqtt&&id!=="heishamon_lutarym"?daten2:id),anzahl=0;if(integration){let reg=this._hass.entities||{};anzahl=Object.keys(reg).filter(k=>reg[k]&&reg[k].platform===integration).length}else anzahl=gefunden.count||0;let zugeordnet=Object.keys(gefunden.entities||{}).filter(f=>felder.includes(f)).length;zeile("pi_ha",anzahl?e(tf(this._t("pi_ha_text"),{a:anzahl,b:zugeordnet,c:felder.length})):`<span class="nein">${e(this._t("pi_ha_keine"))}</span>`)}let steuerArten=["number","input_number","switch","input_boolean","select","input_select","button","input_button"],steuerbar=felder.filter(f=>FIELD_DOMAIN[f]&&FIELD_DOMAIN[f].every(d=>steuerArten.includes(d))).length;zeile("pi_steuern",steuerbar?`<span class="ja">${e(tf(this._t("pi_steuern_ja"),{z:steuerbar}))}</span>`:`<span class="nein">${e(this._t("pi_steuern_nein"))}</span>`);let hilfe=!!(pr&&pr.hilfe);zeile("pi_hilfe",jaNein(hilfe,"pi_ja","pi_hilfe_nein"));let getestet=!!(pr&&pr.getestet&&!eigen);zeile("pi_getestet",jaNein(getestet,"pi_ja",eigen?"pi_getestet_eigen":"pi_getestet_nein")),box.innerHTML=`<h5>${e(this._t(auto?"pi_titel_auto":"pi_titel"))}</h5><dl>${zeilen.join("")}</dl>
      <div class="ed-bericht">
        <button type="button" id="btn-bericht-github">${e(this._t("pr_github"))}</button>
        <button type="button" id="btn-bericht-kopie" class="is-quiet">${e(this._t("pr_kopieren"))}</button>
      </div>
      <p class="ed-meldung" id="ed-bericht-hinweis">${e(this._t("pr_hinweis"))}</p>`,box.hidden=!1;let hinweis=box.querySelector("#ed-bericht-hinweis");box.querySelector("#btn-bericht-github").addEventListener("click",()=>{let r=this._profilBericht(id,auto),titel=tf(this._t("pr_titel"),{n:this._profilName(id)}),{url,gekuerzt}=this._berichtUrl(titel,r);window.open(url,"_blank","noopener,noreferrer"),gekuerzt&&(hinweis.textContent=this._t("pr_gekuerzt"))}),box.querySelector("#btn-bericht-kopie").addEventListener("click",async()=>{let ok=await kopiereText(this._berichtText(this._profilBericht(id,auto),1/0));hinweis.textContent=this._t(ok?"pr_kopiert":"m_datei_fehler")})},_profilBericht(id,auto){let hass=this._hass||{},eigen=eigeneProfile(this._config).find(p=>p.id===id),pr=PROFILE.find(x=>x.id===id),daten2=eigen||eingebautesProfil(id),felder=daten2?Object.keys(daten2.felder):[],integration=eigen&&eigen.integration||pr&&pr.integration||"",gefunden=daten2?detectIntegration(hass,eigen||pr&&!pr.mqtt&&id!=="heishamon_lutarym"?daten2:id).entities||{}:{},wert=eid=>{let st=rawState(hass,eid);return st===null?"":String(st).slice(0,40)},einheit=eid=>String(attr(hass,eid,"unit_of_measurement","")||""),zugeordnet=felder.filter(f=>gefunden[f]).map(f=>({feld:f,id:gefunden[f],wert:wert(gefunden[f]),einheit:einheit(gefunden[f])})),fehlt=felder.filter(f=>!gefunden[f]),konfig=this._config.entities||{},vonHand=Object.keys(konfig).filter(f=>konfig[f]&&konfig[f]!==gefunden[f]).map(f=>({feld:f,id:konfig[f],vorschlag:gefunden[f]||""})),benutzt=new Set(Object.values(gefunden).concat(Object.values(konfig))),reg=hass.entities||{},uebrig=integration?Object.keys(reg).filter(k=>reg[k]&&reg[k].platform===integration&&!benutzt.has(k)).sort().map(k=>({id:k,schluessel:reg[k].translation_key||"",wert:wert(k),einheit:einheit(k)})):[];return{karte:CARD_VERSION,ha:hass.config&&hass.config.version||"",sprache:this._sp(),id,name:this._profilName(id),integration,getestet:!!(pr&&pr.getestet&&!eigen),eigen:!!eigen,auto,anzahl:integration?Object.keys(reg).filter(k=>reg[k]&&reg[k].platform===integration).length:0,felder:felder.length,zugeordnet,fehlt,vonHand,uebrig}},_berichtText(r,grenze,stufe=0){let z=t2=>String(t2).replace(/\|/g,"\\|").replace(/[\r\n]+/g," "),teile=["### Profile report","",`- Card version: ${r.karte}`,`- Home Assistant: ${r.ha||"unknown"}`,`- Language: ${r.sprache}`,`- Profile: \`${r.id}\` (${z(r.name)})${r.eigen?", own profile":""}`,`- Selected: ${r.auto?"automatically":"manually"}`,`- Tested: ${r.getestet?"yes":"no"}`,`- Integration: ${r.integration?`\`${r.integration}\`, ${r.anzahl} entities`:"none (MQTT naming)"}`,"",`### Assigned fields (${r.zugeordnet.length} of ${r.felder})`,""];if(r.zugeordnet.length?stufe>=2?teile.push("_List left out because the link would be too long. Please paste the copied report._"):stufe===1?r.zugeordnet.forEach(a=>teile.push(`- ${a.feld}: ${z(a.id)}`)):(teile.push("| Field | Entity | State | Unit |","|---|---|---|---|"),r.zugeordnet.forEach(a=>teile.push(`| ${a.feld} | ${z(a.id)} | ${z(a.wert)} | ${z(a.einheit)} |`))):teile.push("none"),teile.push("","### Fields not found","",r.fehlt.length?r.fehlt.join(", "):"none"),r.vonHand.length&&(teile.push("","### Changed by hand in the card","","| Field | Entity set by user | Profile suggestion |","|---|---|---|"),r.vonHand.forEach(a=>teile.push(`| ${a.feld} | ${z(a.id)} | ${z(a.vorschlag||"-")} |`))),r.uebrig.length){let liste=r.uebrig.slice(0,grenze);teile.push("",`### Unused entities of the integration (${r.uebrig.length})`,""),liste.length&&teile.push("| Entity | translation_key | State | Unit |","|---|---|---|---|"),liste.forEach(a=>teile.push(`| ${z(a.id)} | ${z(a.schluessel)} | ${z(a.wert)} | ${z(a.einheit)} |`)),liste.length<r.uebrig.length&&teile.push("",`_${r.uebrig.length-liste.length} more not listed (shortened)._`)}return teile.push("","### What is wrong or missing?","","<!-- Which values are wrong, missing or assigned to the wrong field? Which heat pump model? -->",""),teile.join(`
`)},_berichtUrl(titel,r){let basis="https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/issues/new",bau=(grenze2,stufe2)=>`${basis}?title=${encodeURIComponent(titel)}&body=${encodeURIComponent(this._berichtText(r,grenze2,stufe2))}`,grenze=r.uebrig.length,stufe=0,url=bau(grenze,stufe);for(;url.length>7500&&grenze>0;)grenze=Math.max(0,grenze-10),url=bau(grenze,stufe);for(;url.length>7500&&stufe<2;)stufe++,url=bau(grenze,stufe);return{url,gekuerzt:grenze<r.uebrig.length||stufe>0}},_bindeProfile(){let sr=this.shadowRoot,sagen=text=>{let el=sr.getElementById("ed-profil-hinweis");el&&(el.textContent=text)},aktuell=()=>{let id=this._config.profil||DEFAULT_CONFIG.profil;if(id!==AUTO_PROFIL)return id;let gefunden=erkenneAlle(this._hass);return gefunden.length?gefunden[0].id:"heishamon_lutarym"},speichern=(liste,profilId)=>{this._config={...this._config,profile_custom:liste,profil:profilId},this._emit(),this._zeigeProfilAuswahl()},aus=sr.getElementById("btn-profil-aus");aus&&aus.addEventListener("click",()=>{let id=aktuell(),daten2=eigenesProfil(this._config)||eingebautesProfil(id);if(!daten2){sagen(this._t("m_p_leer"));return}let text=JSON.stringify(daten2,null,2);try{let url=URL.createObjectURL(new Blob([text],{type:"application/json"})),link=document.createElement("a");link.href=url,link.download=`geraeteprofil-${daten2.id}.json`,link.click(),setTimeout(()=>URL.revokeObjectURL(url),1e3),sagen(tf(this._t("m_p_export_ok"),{n:daten2.name}))}catch{sagen(this._t("m_datei_fehler"))}});let datei=sr.getElementById("ed-profil-datei"),ein=sr.getElementById("btn-profil-ein");ein&&datei&&(ein.addEventListener("click",()=>datei.click()),datei.addEventListener("change",()=>{let f=datei.files&&datei.files[0];if(!f)return;let leser=new FileReader;leser.onload=()=>{let roh;try{roh=JSON.parse(String(leser.result||""))}catch{sagen(this._t("m_json"));return}let ergebnis=pruefeProfil(roh);if(ergebnis.fehler){sagen(this._t(ergebnis.fehler));return}let neu=ergebnis.profil,liste=eigeneProfile(this._config).filter(p=>p.id!==neu.id);liste.push(neu),speichern(liste,neu.id);let erkannt=erkenneMitProfil(this._hass,neu),teile=[tf(this._t("m_p_import_ok"),{n:neu.name,z:Object.keys(neu.felder).length}),tf(this._t("m_p_gefunden"),{z:Object.keys(erkannt.entities).length})];ergebnis.unbekannt.length&&teile.push(tf(this._t("m_p_unbekannt"),{liste:ergebnis.unbekannt.slice(0,5).join(", ")})),sagen(teile.join(". ")+".")},leser.onerror=()=>sagen(this._t("m_datei_lesen")),leser.readAsText(f),datei.value=""}));let weg=sr.getElementById("btn-profil-weg");weg&&weg.addEventListener("click",()=>{let id=aktuell(),liste=eigeneProfile(this._config).filter(p=>p.id!==id),eingebaut=PROFILE.find(pr=>pr.id===id&&pr.fertig);speichern(liste,eingebaut?id:DEFAULT_CONFIG.profil),sagen(this._t(eingebaut?"m_p_zurueck":"m_p_entfernt"))}),this._zeigeProfilKnoepfe()},_erkanntText(found){if(!found.found)return this._t("m_nicht_erkannt");let werte={a:found.count,b:Object.keys(found.entities).length},id=this._config.profil||AUTO_PROFIL,auto=!1;if(id===AUTO_PROFIL){let gefunden=erkenneAlle(this._hass);if(id=gefunden.length?gefunden[0].id:"heishamon_lutarym",auto=!0,gefunden.length>1)return tf(this._t("m_erkannt_mehrere"),{z:gefunden.length,n:this._profilName(id)})}if(id==="heishamon_lutarym"&&!eigenesProfil(this._config))return(auto?`${this._t("m_auto")} `:"")+tf(this._t("m_erkannt"),werte);let text=tf(this._t("m_erkannt_p"),{...werte,n:this._profilName(id)});return(auto?`${this._t("m_auto")} `:"")+text},_zeigeProfilKnoepfe(){let sr=this.shadowRoot,weg=sr.getElementById("btn-profil-weg");if(weg&&(weg.hidden=!eigenesProfil(this._config)),!this._hass)return;let found=detectIntegration(this._hass,profilFuer(this._config,this._hass)),gruppe=sr.querySelector(".ed-detect");gruppe&&(gruppe.classList.toggle("is-found",found.found),gruppe.classList.toggle("is-absent",!found.found));let status=sr.querySelector(".ed-detect .ed-status");status&&(status.textContent=this._erkanntText(found));let adopt=sr.getElementById("btn-adopt");adopt&&(adopt.disabled=!found.found)}};var LutarymHeatpumpCardEditor=class extends HTMLElement{_sp(){let gewaehlt=this._config&&this._config.language;if(gewaehlt&&gewaehlt!=="auto"&&spracheBekannt(gewaehlt))return gewaehlt;let ha=String(this._hass&&this._hass.language||"").toLowerCase();if(EIGENE_SPRACHEN[ha])return ha;let kurz=ha.slice(0,2);return spracheBekannt(kurz)?kurz:"en"}_t(schluessel){return t(schluessel,this._sp())}constructor(){super(),this.attachShadow({mode:"open"}),this._built=!1}setConfig(config){registriereSprachen(config),this._config={...DEFAULT_CONFIG,...config,entities:{...config.entities||{}}},this._hass&&this._render()}set hass(hass){if(this._hass=hass,!this._built){this._render();return}this.shadowRoot&&this.shadowRoot.querySelectorAll(".ed-picker").forEach(p=>{p.hass=hass})}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_render(){if(!this._config||!this._hass)return;if(!hilfeDaten()&&this._hilfeStand!=="fertig"){this._hilfeStand!=="laedt"&&(this._hilfeStand="laedt",ladeHilfe().catch(()=>null).then(()=>{this._hilfeStand="fertig",this._render()}));return}if(this._built){this._syncValues();return}let groups=[];ENTITY_FIELDS.forEach(f=>{let g=groups.find(x=>x.name===f.group);g||groups.push(g={name:f.group,fields:[]}),g.fields.push(f)});let options=Object.keys(this._hass.states).filter(e=>/^(sensor|number|input_number|binary_sensor|switch|input_boolean|select|input_select)\./.test(e)).sort().map(e=>`<option value="${e}">${escapeHtml(friendly(this._hass,e))}</option>`).join(""),found=detectIntegration(this._hass,profilFuer(this._config,this._hass));this.shadowRoot.innerHTML=`
      <style>${this._css()}</style>
      <div class="ed">
        <div class="ed-group ed-detect ${found.found?"is-found":"is-absent"}">
          <h3>${this._t("e_integration")}</h3>
          <p class="ed-status">${this._erkanntText(found)}</p>
          <div class="ed-actions">
            <button type="button" id="btn-adopt" ${found.found?"":"disabled"}>${this._t("e_uebernehmen")}</button>
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
            <span>${this._t("e_sprache")}${this._sp()==="en"?"":" / Language"}<em>${this._t("e_sprache_h")}</em></span>
            <select id="opt-sprache">${this._sprachOptionen()}</select>
          </label>
          <label class="ed-row ed-breit">
            <span>${this._t("e_profil")}<em>${this._t("e_profil_h")}</em></span>
            <select id="opt-hersteller">${this._herstellerOptionen()}</select>
          </label>
          <label class="ed-row ed-breit" id="ed-geraet-zeile">
            <span>${this._t("e_geraet")}<em>${this._t("e_geraet_h")}</em></span>
            <select id="opt-profil">${this._profilOptionen()}</select>
          </label>
          <label class="ed-row ed-breit ed-profilwahl" id="ed-profil-wahl" hidden>
            <span>${this._t("e_mehrere")}<em>${this._t("e_mehrere_h")}</em></span>
            <select id="opt-profil-wahl"></select>
          </label>
          <div class="ed-breit ed-profilinfo" id="ed-profil-info" hidden></div>
        </div>

        <details class="ed-group ed-klapp" data-klapp="darstellung">
          <summary><h3>${this._t("e_darstellung")}</h3></summary>
          <details class="ed-unter ed-klapp" data-klapp="d-allgemein">
            <summary><h4>${this._t("e_d_allgemein")}</h4></summary>
          <label class="ed-row">
            <span>${this._t("e_thema")}<em>${this._t("e_thema_h")}</em></span>
            <select id="opt-thema">
              ${["auto","dunkel","hell","kontrast","nacht","ha"].map(k=>`<option value="${k}">${this._t(`o_th_${k}`)}</option>`).join("")}
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
          ${[1,2,3,4].map(n=>`
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
          ${[2,3,4].map(n=>`
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
          <label class="ed-row">
            <span>${this._t("e_vstil")}<em>${this._t("e_vstil_h")}</em></span>
            <select id="opt-vstil">
              ${["takte","balken","leuchten","linie"].map(v=>`<option value="${v}">${this._t(`o_vstil_${v}`)}</option>`).join("")}
            </select>
          </label>
          <label class="ed-row">
            <span>${this._t("e_sgstil")}<em>${this._t("e_sgstil_h")}</em></span>
            <select id="opt-sgstil">
              ${["spuren","stufen","uhr","band"].map(v=>`<option value="${v}">${this._t(`o_sgstil_${v}`)}</option>`).join("")}
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
          ${groups.map((g,gi)=>`
          <details class="ed-group ed-klapp" data-klapp="g${gi}" data-gruppe="${gi}" data-gruppe-name="${escapeHtml(g.name)}">
            <summary><h3>${escapeHtml(gruppenText(g.name,this._sp()))}</h3><span class="ed-zahl" id="ed-zahl-${gi}"></span></summary>
            ${g.fields.map(f=>{let hilfe=this._feldHilfe(f);return`
              <div class="ed-row ed-feld" data-feld="${f.key}">
                <span>${escapeHtml(feldText(f,this._sp()))}${hilfe?` <button type="button" class="ed-frage" data-frage="${f.key}" title="${escapeHtml(this._t("f_erklaerung"))}" aria-label="${escapeHtml(this._t("f_erklaerung"))}">?</button>`:""}<em>${escapeHtml(hinweisText(f.hint,this._sp()))}</em></span>
                <div class="ed-wahl">
                  <input type="text" list="lhc-entities" data-entity="${f.key}"
                         placeholder="entity_id" autocomplete="off">
                  <span class="ed-zustand" data-zustand="${f.key}"></span>
                </div>
                ${hilfe?`<p class="ed-erklaerung" data-erklaerung="${f.key}" hidden>${escapeHtml(hilfe)}</p>`:""}
              </div>`}).join("")}
          </details>`).join("")}
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
    `;let bind=(id,handler)=>{let el=this.shadowRoot.getElementById(id);el&&el.addEventListener("change",()=>handler(el))},put=patch=>{this._config={...this._config,...patch},this._emit()};bind("opt-fans",el=>put({fan_count:parseInt(el.value,10)})),bind("opt-layout",el=>put({layout:el.value})),bind("opt-thema",el=>put({theme:el.value})),bind("opt-breite",el=>put({card_width:parseInt(el.value,10)||0})),bind("opt-hoehe",el=>put({card_height:parseInt(el.value,10)||0})),bind("opt-rohr",el=>put({pipe_inner_mm:parseInt(el.value,10)||0})),bind("opt-mqtt",el=>put({mqtt_prefix:el.value.trim()||"panasonic_heat_pump"})),bind("opt-sprache",el=>{put({language:el.value}),this._zeigeSprachKnoepfe()}),this._bindeSprachen(),bind("opt-hersteller",el=>{put({profil:this._erstesProfilVon(el.value)}),this._zeigeProfilAuswahl()}),bind("opt-profil",el=>{put({profil:el.value}),this._zeigeProfilAuswahl()}),bind("opt-profil-wahl",el=>{el.value&&(put({profil:el.value}),this._zeigeProfilAuswahl())}),this._bindeProfile(),bind("opt-vbreite",el=>put({history_width:parseInt(el.value,10)||450})),bind("opt-vstil",el=>put({history_style:el.value})),bind("opt-sgstil",el=>put({sg_style:el.value})),bind("opt-kxmin",el=>put({curve_x_min:parseInt(el.value,10)})),bind("opt-kxmax",el=>put({curve_x_max:parseInt(el.value,10)})),bind("opt-kymin",el=>put({curve_y_min:parseInt(el.value,10)})),bind("opt-kymax",el=>put({curve_y_max:parseInt(el.value,10)})),bind("opt-hk",el=>{put({hk_count:parseInt(el.value,10)}),this._syncValues()}),bind("opt-min",el=>put({scale_min:parseFloat(el.value)})),bind("opt-max",el=>put({scale_max:parseFloat(el.value)})),bind("opt-omin",el=>put({outdoor_min:parseFloat(el.value)})),bind("opt-omax",el=>put({outdoor_max:parseFloat(el.value)})),bind("opt-lhk1",el=>put({label_hk1:el.value})),[2,3,4].forEach(n=>bind(`opt-lhk${n}`,el=>put({[`label_hk${n}`]:el.value}))),bind("opt-lbuf",el=>put({label_buffer:el.value})),bind("opt-ldhw",el=>put({label_dhw:el.value})),bind("opt-lenergy",el=>put({label_energy:el.value})),bind("opt-eday",el=>put({energy_daily:el.checked})),bind("opt-animate",el=>put({animate:el.value==="aus"?!1:el.value==="auto"?"auto":!0})),bind("opt-demo",el=>put({demo:el.checked})),bind("opt-verlauf",el=>put({show_history:el.value==="karte"?!0:el.value==="aus"?!1:"knopf"})),bind("opt-ziel",el=>put({show_target:el.checked})),bind("opt-laedt",el=>put({show_reload:el.checked})),bind("opt-hilfe",el=>put({show_help:el.checked})),bind("opt-tuer",el=>put({show_door:el.checked})),[1,2,3,4].forEach(n=>bind(`opt-hk${n}-stil`,el=>put({[`hk${n}_style`]:el.value}))),bind("opt-zusatz",el=>{put({extra_heat:el.value}),this._syncValues()}),bind("opt-feuer",el=>{let v=parseFloat(el.value);Number.isFinite(v)&&put({kamin_fire_temp:v})}),bind("opt-solarstil",el=>put({solar_style:el.value})),bind("opt-sonne",el=>{let v=parseFloat(el.value);Number.isFinite(v)&&put({solar_sun_temp:v})}),bind("opt-puffer",el=>put({buffer_present:el.value==="ja"?!0:el.value==="nein"?!1:"auto"})),bind("opt-zirk",el=>put({circulation_present:el.value==="ja"?!0:el.value==="nein"?!1:"auto"}));let applyMap=(map,merge)=>{let entities=merge?{...this._config.entities,...map}:{...map};this._config={...this._config,entities},this._syncValues(),this._emit()},feld=this.shadowRoot.getElementById("ed-austausch"),sagen=text=>{let el=this.shadowRoot.getElementById("ed-austausch-hinweis");el&&(el.textContent=text)},exp=this.shadowRoot.getElementById("btn-export");exp&&exp.addEventListener("click",()=>{let kopie={...this._config};delete kopie.type,feld.value=JSON.stringify(kopie,null,2),feld.select(),sagen(this._t("m_im_feld"))});let dateiAus=this.shadowRoot.getElementById("btn-datei-aus");dateiAus&&dateiAus.addEventListener("click",()=>{let kopie={...this._config};delete kopie.type;let text=JSON.stringify(kopie,null,2);try{let url,aufraeumen=null;typeof URL<"u"&&URL.createObjectURL?(url=URL.createObjectURL(new Blob([text],{type:"application/json"})),aufraeumen=()=>URL.revokeObjectURL(url)):url="data:application/json;charset=utf-8,"+encodeURIComponent(text);let link=document.createElement("a");link.href=url,link.download=`heatpump-flow-card-by-lutarym-${CARD_VERSION}.json`,link.click(),aufraeumen&&setTimeout(aufraeumen,1e3),sagen(this._t("m_datei_ok"))}catch{sagen(this._t("m_datei_fehler"))}});let dateiFeld=this.shadowRoot.getElementById("ed-datei"),dateiEin=this.shadowRoot.getElementById("btn-datei-ein");dateiEin&&dateiFeld&&(dateiEin.addEventListener("click",()=>dateiFeld.click()),dateiFeld.addEventListener("change",()=>{let datei=dateiFeld.files&&dateiFeld.files[0];if(!datei)return;let leser=new FileReader;leser.onload=()=>{let ziel=this.shadowRoot.getElementById("ed-austausch");ziel&&(ziel.value=String(leser.result||""));let knopf=this.shadowRoot.getElementById("btn-import");knopf&&knopf.click()},leser.onerror=()=>sagen(this._t("m_datei_lesen")),leser.readAsText(datei),dateiFeld.value=""}));let imp=this.shadowRoot.getElementById("btn-import");imp&&imp.addEventListener("click",()=>{let gelesen;try{gelesen=JSON.parse(feld.value)}catch{sagen(this._t("m_json"));return}if(!gelesen||typeof gelesen!="object"||Array.isArray(gelesen)){sagen(this._t("m_keine_konfig"));return}let erlaubt=Object.keys(DEFAULT_CONFIG),felder=ENTITY_FIELDS.map(f=>f.key),uebernommen={},verworfen=0;Object.keys(gelesen).forEach(k=>{k!=="entities"&&(erlaubt.includes(k)||k.startsWith("label_")?uebernommen[k]=gelesen[k]:verworfen+=1)});let zuordnung={},unbekannt=[],fehlen=[],falscherBereich=[],quelle=gelesen.entities&&typeof gelesen.entities=="object"?gelesen.entities:{};Object.keys(quelle).forEach(feld2=>{let id=quelle[feld2];if(!felder.includes(feld2)){unbekannt.push(feld2);return}if(typeof id!="string"||!id.includes("."))return;let bereich=FIELD_DOMAIN[feld2];if(bereich&&!bereich.includes(id.split(".")[0])){falscherBereich.push(feld2);return}zuordnung[feld2]=id;let st=this._hass&&this._hass.states;st&&!st[id]&&fehlen.push(id)}),uebernommen.entities=zuordnung,this._config={type:this._config.type,...uebernommen},this._emit(),this.setConfig(this._config);let jetzt=this._config.entities||{},nichtAngekommen=Object.keys(zuordnung).filter(k=>jetzt[k]!==zuordnung[k]),teile=[tf(this._t("m_einst"),{n:Object.keys(uebernommen).length-1}),tf(this._t("m_ent"),{n:Object.keys(zuordnung).length})];verworfen&&teile.push(tf(this._t("m_unb_einst"),{n:verworfen})),unbekannt.length&&teile.push(tf(this._t("m_unb_felder"),{n:unbekannt.length})),falscherBereich.length&&teile.push(tf(this._t("m_bereich"),{n:falscherBereich.length})),fehlen.length&&teile.push(tf(this._t("m_fehlen"),{n:fehlen.length,liste:fehlen.slice(0,3).join(", ")+(fehlen.length>3?this._t("m_weitere"):"")})),nichtAngekommen.length&&teile.push(tf(this._t("m_nicht_an"),{liste:nichtAngekommen.join(", ")})),sagen(teile.join(". ")+".")}),this.shadowRoot.getElementById("btn-adopt").addEventListener("click",()=>{let profil=profilFuer(this._config,this._hass),f=detectIntegration(this._hass,profil);f.found&&applyMap(quellenZuordnung(f.entities,this._config.extra_heat,profil),!0)}),this.shadowRoot.getElementById("btn-default").addEventListener("click",()=>applyMap(quellenZuordnung(defaultEntityMap(),this._config.extra_heat),!0)),this.shadowRoot.getElementById("btn-clear").addEventListener("click",()=>applyMap({},!1)),this.shadowRoot.querySelectorAll("[data-entity]").forEach(input=>{input.addEventListener("change",()=>{let entities={...this._config.entities},v=input.value.trim();v?entities[input.dataset.entity]=v:delete entities[input.dataset.entity],this._config={...this._config,entities},this._emit(),this._zeigeEntitaetsZustand()})}),this._bindeEditorBedienung(),this._built=!0,this._syncValues(),this._entitaetsAuswahl()}_syncValues(){let sr=this.shadowRoot,put=(id,value)=>{let el=sr.getElementById(id);el&&el!==sr.activeElement&&(el.value=value)},check=(id,value)=>{let el=sr.getElementById(id);el&&(el.checked=value!==!1)};put("opt-fans",String(this._config.fan_count)),put("opt-layout",this._config.layout||"quer"),put("opt-thema",this._config.theme||"auto"),put("opt-breite",String(this._config.card_width||0)),put("opt-hoehe",String(this._config.card_height||0)),put("opt-rohr",String(this._config.pipe_inner_mm||0)),put("opt-mqtt",this._config.mqtt_prefix||"panasonic_heat_pump");let sprachWahl=this.shadowRoot.getElementById("opt-sprache");sprachWahl&&(sprachWahl.innerHTML=this._sprachOptionen()),put("opt-sprache",this._config.language||"auto"),this._zeigeSprachKnoepfe(),this._zeigeProfilAuswahl(),put("opt-vbreite",String(this._config.history_width||450)),put("opt-vstil",this._config.history_style||"takte"),put("opt-sgstil",this._config.sg_style||"spuren"),put("opt-kxmin",String(this._config.curve_x_min)),put("opt-kxmax",String(this._config.curve_x_max)),put("opt-kymin",String(this._config.curve_y_min)),put("opt-kymax",String(this._config.curve_y_max)),put("opt-hk",String(this._config.hk_count)),put("opt-min",this._config.scale_min),put("opt-max",this._config.scale_max),put("opt-omin",this._config.outdoor_min),put("opt-omax",this._config.outdoor_max),put("opt-lhk1",this._config.label_hk1),[2,3,4].forEach(n=>put(`opt-lhk${n}`,this._config[`label_hk${n}`])),put("opt-lbuf",this._config.label_buffer),put("opt-ldhw",this._config.label_dhw),put("opt-lenergy",this._config.label_energy),check("opt-eday",this._config.energy_daily),put("opt-animate",this._config.animate===!1?"aus":this._config.animate==="auto"?"auto":"ein"),check("opt-demo",this._config.demo===!0),put("opt-verlauf",this._config.show_history===!0?"karte":this._config.show_history===!1?"aus":"knopf"),check("opt-ziel",this._config.show_target!==!1),check("opt-laedt",this._config.show_reload!==!1),check("opt-hilfe",this._config.show_help!==!1),check("opt-tuer",this._config.show_door!==!1);let anzahlHk=Number(this._config.hk_count)||2;[1,2,3,4].forEach(n=>{let v=this._config[`hk${n}_style`]||"platte";put(`opt-hk${n}-stil`,v==="fbh_verteiler"||v==="fbh_raum"?"fbh":v)}),sr.querySelectorAll("[data-hk-zeile]").forEach(z=>{z.style.display=Number(z.dataset.hkZeile)<=anzahlHk?"":"none"}),put("opt-zusatz",this._config.extra_heat||"aus");let zusatz=this._config.extra_heat||"aus";put("opt-feuer",this._config.kamin_fire_temp??30),put("opt-sonne",this._config.solar_sun_temp??30),put("opt-solarstil",this._config.solar_style||"strahlen"),sr.querySelectorAll("[data-zusatz-zeile]").forEach(z=>{let art=z.dataset.zusatzZeile;z.style.display=zusatz===art||zusatz==="beide"?"":"none"}),sr.querySelectorAll("details[data-gruppe-name]").forEach(d=>{let name=d.dataset.gruppeName,zeigen=!0;name==="Heizkreis 3"&&(zeigen=anzahlHk>=3),name==="Heizkreis 4"&&(zeigen=anzahlHk>=4),name==="Zusatzwärme"&&(zeigen=zusatz!=="aus"),d.style.display=zeigen?"":"none"}),put("opt-puffer",this._config.buffer_present===!0?"ja":this._config.buffer_present===!1?"nein":"auto"),put("opt-zirk",this._config.circulation_present===!0?"ja":this._config.circulation_present===!1?"nein":"auto");let imFokus=sr.activeElement;sr.querySelectorAll("[data-entity]").forEach(input=>{let v=(this._config.entities||{})[input.dataset.entity]||"";if(input.classList.contains("ed-picker")){input.hass!==this._hass&&(input.hass=this._hass),input.value!==v&&(input.value=v);return}input!==imFokus&&input.value!==v&&(input.value=v),input.classList.toggle("is-missing",!!v&&!this._hass.states[v])}),this._zeigeEntitaetsZustand()}};Object.assign(LutarymHeatpumpCardEditor.prototype,bedienungEditor,werkzeugeEditor,stilEditor);var aktualisierenKarte={_sgMode(){let k1=this._e("sg_k1"),k2=this._e("sg_k2");if(!k1||!k2)return null;let unklar=[null,"unknown","unavailable",""];if(unklar.includes(rawState(this._quelle,k1))||unklar.includes(rawState(this._quelle,k2)))return null;let a=isOn(this._quelle,k1),b=isOn(this._quelle,k2);return a===null||b===null?null:a&&!b?1:!a&&!b?2:!a&&b?3:4},_speicherZeilen(name){let zeilen=[{el:this._animEl(`${name}-sp`),zeigen:this._config.show_target!==!1},{el:this._animEl(`${name}-delta`),zeigen:this._config.show_reload!==!1}];if(zeilen.some(z=>!z.el))return;zeilen.forEach(z=>{z.el.dataset.y0===void 0&&(z.el.dataset.y0=z.el.getAttribute("y"))});let start=Number(zeilen[0].el.dataset.y0),abstand=Number(zeilen[1].el.dataset.y0)-start,i=0;zeilen.forEach(z=>{if(!z.zeigen){z.el.textContent="";return}z.el.setAttribute("y",String(start+i*abstand)),i++})},_ladtWarmwasser(hass){let v=warmwasserZustand(rawState(hass,this._e("three_way_valve")));return v!==null?v:numState(hass,this._e("operating_mode"))===3},_update(){let hass=this._quelle;if(!hass)return;let min=Number(this._config.scale_min),max=Number(this._config.scale_max),col=v=>thermalColor(v,min,max),animate=animationAn(this._config),set=(id,text)=>{let el=this._animEl(id);el&&(el.textContent=text)},paint=(id,color)=>{let el=this._animEl(id);el&&el.setAttribute("stop-color",color)},zeige=(id,sichtbar)=>{let el=this._animEl(id);el&&el.setAttribute("opacity",sichtbar?"1":"0")},abzeichen=(id,aktiv)=>{let el=this._animEl(id);el&&(el.classList.toggle("is-on",aktiv),aktiv&&animate?this._animState.set(id,{type:"pulse",duration:2.2}):this._animState.delete(id))},stroemt=(ids,an,farbe)=>{ids.forEach(id=>{let el=this._animEl(id);if(!el)return;let aktiv=animate&&laeuft&&an===!0;if(el.classList.toggle("is-on",aktiv),farbe&&(el.style.stroke=farbe),aktiv){let isRev=el.classList.contains("rev");this._animState.set(id,{type:"flow",reverse:isRev})}else this._animState.delete(id),el.setAttribute("stroke-dashoffset","0")})},gefunden=["outside_temp","compressor","flow_temp","return_temp","buffer_temp","dhw_temp"].filter(k=>{let id=this._e(k);return id&&hass.states[id]!==void 0}).length,hinweis=this._animEl("hinweis");hinweis&&(hinweis.hidden=gefunden>0||this._config.demo===!0,gefunden===0&&(hinweis.textContent=this._t("s_keine_ent")));let err=rawState(hass,this._e("error")),stoerung=err!==null&&![null,"","OK","ok","0","No error","unknown","unavailable"].includes(err),alertEl=this._animEl("alert");alertEl&&(alertEl.hidden=!stoerung,stoerung&&(alertEl.textContent=tf(this._t("s_stoerung"),{v:err})));let outside=numState(hass,this._e("outside_temp")),oMin=Number(this._config.outdoor_min),oMax=Number(this._config.outdoor_max),outColor=thermalColor(outside,oMin,oMax);set("outside-v",outside===null?"--":`${fmt(outside)} °C`);let aussenEl=this._animEl("outside-v");aussenEl&&(aussenEl.style.fill=outColor);let vd=verdichterWert(hass,this._e("compressor")),comp=vd.wert,compText="--";comp!==null&&(compText=vd.nurAnAus?wertText(comp>0?"läuft":"aus",this._sp()):`${fmt(comp,0)}${vd.einheit?` ${vd.einheit}`:""}`),set("comp-v",compText);let compEl=this._animEl("comp-v");if(compEl){let prozent=vd.einheit==="%",last=vd.nurAnAus?comp>0?COMP_MAX_HZ:0:comp;compEl.style.fill=loadColor(last,prozent?0:COMP_MIN_HZ,prozent?100:COMP_MAX_HZ)}let anAus=(()=>{let ausStatus=feld=>{let id=this._e(feld);if(!id)return null;let roh=rawState(hass,id);return roh===null||roh==="unknown"||roh==="unavailable"?null:isOn(hass,id)},ausTopic=ausStatus("heatpump_state");return ausTopic!==null?ausTopic:ausStatus("power_state")})(),laeuft=anAus!==!1;this._spin("fan1",numState(hass,this._e("fan1_rpm")),"fan1-rpm",this._t("r_upm"),0,laeuft),this._config.fan_count===2&&this._spin("fan2",numState(hass,this._e("fan2_rpm")),"fan2-rpm",this._t("r_upm"),0,laeuft);let glow=this._animEl("unit-glow");if(glow){let glowStoerung=animate&&stoerung,glowBetrieb=animate&&laeuft&&comp!==null&&comp>0,glowAn=glowStoerung||glowBetrieb;glow.setAttribute("stroke",glowStoerung?"#EF4444":"#22C55E"),glowAn?this._animState.set("unit-glow",{type:"pulse",duration:glowStoerung?1.2:2.6,min:.05,max:1}):(this._animState.delete("unit-glow"),glow.setAttribute("opacity","0"))}let sgGroup=this._animEl("sg-group");if(sgGroup){let konfiguriert=!!this._e("sg_k1")&&!!this._e("sg_k2");if(sgGroup.setAttribute("opacity",konfiguriert?"1":"0"),konfiguriert){let sg=this._sgMode(),info=SG_STATES[sg],farbe=info?info.farbe:NEUTRAL;set("sg-text",sg===null?this._t("unbekannt"):this._t(info.kurz));let t2=this._animEl("sg-text");if(t2){let stil=farbe==="#C3D0E0"?"var(--c-c3d0e0)":farbe;t2.style.fill=stil,t2.style.color=stil}for(let i=1;i<=4;i++){let seg=this._animEl(`sg-seg-${i}`);if(!seg)continue;let aktiv=sg===i;seg.setAttribute("fill",aktiv?farbe:"#3A4658"),seg.setAttribute("height",aktiv?"17":"11"),seg.setAttribute("y",aktiv?"-3":"0"),seg.style.color=farbe,seg.classList.toggle("is-active",aktiv)}}}let leistung=numState(hass,this._e("power_now")),energie=numState(hass,this._e("energy_today"));zeige("verbrauch-group",leistung!==null||energie!==null),set("power-now-v",leistung===null?"--":`${fmt(leistung/1e3,2)} kW`);let energieAnzeige=energie;this._config.energy_daily!==!1&&energie!==null&&(this._ladeTagesstart(),this._tagStart!==void 0&&energie>=this._tagStart&&(energieAnzeige=energie-this._tagStart)),set("energy-today-v",energieAnzeige===null?"--":`${fmt(energieAnzeige,1)} kWh`);let tagesWert=energieAnzeige!==null&&energieAnzeige!==energie;set("energy-label",this._config.label_energy?this._config.label_energy:tagesWert?this._t("s_verbrauch_heute"):this._t("s_zaehler"));let zirkId=this._e("circulation_pump"),zirkAn=isOn(hass,zirkId)===!0;zeige("zirkulation-group",this._zeigtZirkulation(hass)),set("zirk-v",zirkId?wertText(zirkAn?"läuft":"aus",this._sp()):"--"),set("zirk-name",zirkId?`${this._t("zirkulation")} · ${wertText(zirkAn?"läuft":"aus",this._sp())}`:this._t("zirkulation"));let zirkRotor=this._animEl("zirk-rotor");if(zirkRotor)if(zirkRotor.classList.toggle("is-still",!zirkAn),zirkAn&&animate&&laeuft){let da=this._animState.get("zirk-rotor");da&&da.type==="spin"?da.duration=PUMP_SECONDS:this._animState.set("zirk-rotor",{type:"spin",duration:PUMP_SECONDS,winkel:0})}else this._animState.delete("zirk-rotor");let pv=numState(hass,this._e("pv_power"));zeige("pv-group",pv!==null),set("pv-v",pv===null?"--":`${fmt(pv/1e3,2)} kW`);let flow=numState(hass,this._e("flow_temp")),ret=numState(hass,this._e("return_temp")),buf=numState(hass,this._e("buffer_temp")),dhw=numState(hass,this._e("dhw_temp"));set("unit-flow-v",flow===null?"--":`${fmt(flow)} °C`),set("unit-ret-v",ret===null?"--":`${fmt(ret)} °C`),paint("bg-top",col(buf)),paint("bg-bottom",col(buf===null?null:buf-4)),set("buf-v",buf===null?"--":`${fmt(buf)} °C`);let wwLaeuft=this._ladtWarmwasser(hass),bufSp=numState(hass,this._e("buffer_target"));wwLaeuft?bufSp=this._letztesPufferZiel!==void 0?this._letztesPufferZiel:null:bufSp!==null&&(this._letztesPufferZiel=bufSp),set("buf-sp",bufSp===null?"":tf(this._t("s_ziel"),{v:fmt(bufSp,0)}));let bDelta=numState(hass,this._e("buffer_delta"));set("buf-delta",bDelta===null||bufSp===null?"":tf(this._t("s_laedt_ab"),{v:fmt(bufSp-Math.abs(bDelta),0)})),this._cop(hass,"cop_heating");let heizstabLaeuft=isOn(hass,this._e("heater_internal"))===!0||isOn(hass,this._e("heater_external"))===!0;abzeichen("roomheater-badge",heizstabLaeuft&&!wwLaeuft);let dhwSp=numState(hass,this._e("dhw_setpoint"));paint("dhw-top",col(dhw)),paint("dhw-bottom",col(dhw===null?null:dhw-6)),set("dhw-v",dhw===null?"--":`${fmt(dhw)} °C`),set("dhw-sp",dhwSp===null?"":tf(this._t("s_ziel"),{v:fmt(dhwSp,0)})),this._cop(hass,"cop_dhw"),this._tuerCopAuffrischen();let wDelta=numState(hass,this._e("dhw_heat_delta"));set("dhw-delta",wDelta===null||dhwSp===null?"":tf(this._t("s_laedt_ab"),{v:fmt(dhwSp-Math.abs(wDelta),0)})),abzeichen("dhwheater-badge",heizstabLaeuft&&wwLaeuft);let tuerKnopf=this._animEl("tuer-knopf");tuerKnopf&&(tuerKnopf.style.display=this._config.show_door!==!1&&this._tuerFelder().length?"":"none");let hilfeKnopf=this.shadowRoot.getElementById("hilfe-knopf");hilfeKnopf&&(hilfeKnopf.style.display=this._config.show_help===!1||!this._hilfePasst()?"none":""),this._speicherZeilen("buf"),this._speicherZeilen("dhw"),abzeichen("dhwforce-badge",isOn(hass,this._e("dhw_force_state"))===!0),abzeichen("sterilization-badge",isOn(hass,this._e("sterilization_state"))===!0);let pumpRpm=numState(hass,this._e("pump_speed")),flowRate=numState(hass,this._e("pump_flow"));this._spin("pump-rotor",pumpRpm,"pump-v",this._t("r_upm"),PUMP_SECONDS,laeuft),this._blattFarbe("pump-blade",col(flow),laeuft&&pumpRpm!==null&&pumpRpm>0),set("flow-v",flowRate===null?"--":`${fmt(flowRate)} l/min`);let flowEl=this._animEl("flow-v"),innen=Number(this._config.pipe_inner_mm)||0;if(flowEl){let farbe="",hinweis2="";if(innen>0&&flowRate!==null&&flowRate>0){let flaeche=Math.PI*Math.pow(innen/2e3,2),v=flowRate/6e4/flaeche;hinweis2=`${fmt(v,2)} m/s`,v>1?farbe="#D62B2B":v>.8?farbe="#E0A62E":farbe="#46C07A"}flowEl.style.fill=farbe,hinweis2?flowEl.setAttribute("aria-label",`${flowEl.textContent} = ${hinweis2}`):flowEl.removeAttribute("aria-label")}let bar=numState(hass,this._e("water_pressure"));if(zeige("press-group",bar!==null),bar!==null){set("press-v",`${fmt(bar)} bar`);let druckfarbe=bar>=DRUCK_MIN&&bar<=DRUCK_MAX?"#46C07A":"#D62B2B",needle=this._animEl("press-needle");needle&&(needle.setAttribute("transform",`rotate(${-120+240*clamp(bar/4,0,1)})`),needle.setAttribute("stroke",druckfarbe));let druckText=this._animEl("press-v");druckText&&(druckText.style.fill=druckfarbe);let zuNiedrig=bar<DRUCK_MIN,warn=this._animEl("press-warn");warn&&warn.setAttribute("opacity",zuNiedrig?"1":"0"),zuNiedrig&&animate?(this._animState.set("press-v",{type:"pulse",duration:1.1,min:.15,max:1}),this._animState.set("press-warn",{type:"pulse",duration:1.1,min:.15,max:1})):(this._animState.delete("press-v"),this._animState.delete("press-warn"),druckText&&druckText.setAttribute("opacity","1"))}let valveEntity=this._e("three_way_valve"),valveRoh=attr(hass,valveEntity,"beschreibung",null),valveNum=warmwasserZustand(rawState(hass,valveEntity)),zuWarmwasser=this._ladtWarmwasser(hass),abtaut=isOn(hass,this._e("defrost"))===!0,art=numState(hass,this._e("operating_mode")),umfasst={heizen:art===null?!0:[0,2,4,6].includes(art),kuehlen:art===null?!1:[1,5,7,8].includes(art),ww:art===null?!0:[3,4,5,6,8].includes(art),auto:art===null?!1:[2,6,7,8].includes(art)},arbeitet=laeuft&&comp!==null&&comp>0,blinkt={betrieb:!1,heizen:arbeitet&&!zuWarmwasser&&!umfasst.kuehlen&&!abtaut,kuehlen:arbeitet&&!zuWarmwasser&&umfasst.kuehlen&&!abtaut,ww:arbeitet&&zuWarmwasser&&!abtaut,auto:!1,abtauen:abtaut},modusFarben={betrieb:"#46C07A",heizen:"#E0762E",kuehlen:"#06A6C7",ww:"#F2B233",auto:"#C3D0E0",abtauen:"#3E9BE0"},modusText=this._animEl("modus-text");if(modusText){let txt="";anAus===!1?txt=wertText("Aus",this._sp()):abtaut?txt=this._t("r_abtauen"):art!==null&&MODE_LABELS[art]!==void 0&&(txt=wertText(MODE_LABELS[art],this._sp())),modusText.textContent=txt}Object.keys(modusFarben).forEach(k=>{let el=this._animEl(`modus-${k}`);if(!el)return;let dabei=k==="betrieb"?anAus===!0:k==="abtauen"?abtaut:umfasst[k];el.style.color=dabei?modusFarben[k]:"var(--c-2e3847)",blinkt[k]&&animate?this._animState.set(`modus-${k}`,{type:"pulse",duration:1.4,min:.3,max:1}):(this._animState.delete(`modus-${k}`),el.setAttribute("opacity","1"))});let valveText="--";valveRoh!==null&&VALVE_LABELS[valveRoh]!==void 0?valveText=wertText(VALVE_LABELS[valveRoh],this._sp()):valveNum!==null&&(valveText=this._t(zuWarmwasser?"warmwasser":"heizung")),set("valve-v",valveText);let bekannt=valveNum!==null;zeige("valve-arrow-heiz",bekannt&&!zuWarmwasser),zeige("valve-arrow-ww",bekannt&&zuWarmwasser);let pfeilfarbe=col(flow);["valve-heiz-line","valve-ww-line"].forEach(id=>{let el=this._animEl(id);el&&el.setAttribute("stroke",pfeilfarbe)}),["valve-heiz-head","valve-ww-head"].forEach(id=>{let el=this._animEl(id);el&&el.setAttribute("fill",pfeilfarbe)});let zonen=numState(hass,this._e("zones_state")),zone1=zonen===null?!0:zonen===0||zonen===2,zone2=zonen===null?!0:zonen===1||zonen===2,pufferDa=(()=>{let v=numState(hass,this._e("buffer_installed"));return v===null?!0:v>0})(),wasserDa=(()=>{let v=numState(hass,this._e("dhw_installed"));return v===null?!0:v>0})(),blende=(id,aktiv)=>{let el=this._animEl(id);el&&el.classList.toggle("is-inaktiv",!aktiv)};blende("hk1-rad",zone1),blende("hk2-rad",zone2),blende("buffer-group",pufferDa),blende("dhw-group",wasserDa);let foerdertPrimaer=pumpRpm!==null&&pumpRpm>0||flowRate!==null&&flowRate>0;this._direkt=this._hatPuffer()?null:{heizt:foerdertPrimaer&&!zuWarmwasser,vl:col(flow),rl:col(ret)};let kreisLaeuft=[];for(let n=1;n<=this._hkAnzahl();n++)kreisLaeuft.push(this._circuitUpdate(n,col,animate,buf,laeuft));let sekundaer=kreisLaeuft.some(Boolean),d=this._direkt,farbeVL=d?d.vl:col(buf),farbeRL=d?d.rl:col(buf);stroemt(["dots-sf-a"],sekundaer,farbeVL),stroemt(["dots-sr-a"],sekundaer,farbeRL),[2,3,4].forEach(k=>{let id=k===2?"":String(k),dahinter=kreisLaeuft.slice(k-1).some(Boolean);stroemt([`dots-sf-b${id}`],dahinter,farbeVL),stroemt([`dots-sr-b${id}`],dahinter,farbeRL)});let spalten=kreisLaeuft.length>2?2:1,reihe1=kreisLaeuft.slice(0,spalten).some(Boolean),reihe2=kreisLaeuft.slice(spalten).some(Boolean);stroemt(["dots-sf-z2"],reihe2,farbeVL),stroemt(["dots-sr-z1"],reihe1,farbeRL),stroemt(["dots-sr-z2"],reihe2,farbeRL);let primaer=pumpRpm!==null&&pumpRpm>0||flowRate!==null&&flowRate>0;stroemt(["dots-vl-a"],primaer,col(flow)),stroemt(["dots-heiz-vl"],primaer&&!zuWarmwasser,col(flow)),stroemt(["dots-ww-vl"],primaer&&zuWarmwasser,col(flow)),stroemt(["dots-rl-a"],primaer,col(ret)),stroemt(["dots-heiz-rl"],primaer&&!zuWarmwasser,col(ret)),stroemt(["dots-ww-rl"],primaer&&zuWarmwasser,col(ret)),stroemt(["dots-buf"],primaer&&!zuWarmwasser,col(flow)),stroemt(["dots-buf2"],primaer&&!zuWarmwasser,col(ret)),stroemt(["dots-dhw"],primaer&&zuWarmwasser,col(flow)),stroemt(["dots-dhw2"],primaer&&zuWarmwasser,col(ret)),stroemt(["dots-zirk-h1","dots-zirk-v","dots-zirk-h2"],zirkAn,col(dhw)),this._blattFarbe("zirk-blade",col(dhw),zirkAn&&laeuft);let blasen=(id,wert,laedt)=>{let g=this._animEl(id);if(!g||!g.children)return;let anteil=wert===null?0:clamp((wert-min)/(max-min||1),0,1),sichtbar=animate&&laeuft&&laedt?Math.round(anteil*BUBBLE_COUNT):0;Array.from(g.children).forEach((el,i)=>{el.style.animationName=i<sichtbar?"":"none",i>=sichtbar&&el.getAttribute("opacity")!=="0"&&(el.setAttribute("opacity","0"),el.removeAttribute("transform"))})},quelleLaedt=this._quellenUpdate(col,animate,buf);blasen("buf-bubbles",buf,primaer&&!zuWarmwasser||quelleLaedt),blasen("dhw-bubbles",dhw,primaer&&zuWarmwasser),this._syncDialog()},_quellenUpdate(col,animate,buf){let hass=this._quelle,laedt=!1;return["kamin","solar"].forEach(art=>{if(!this._animEl(`${art}-group`))return;let temp=numState(hass,this._e(`${art}_temp`)),pumpe=isOn(hass,this._e(`${art}_pump`))===!0,tEl=this._animEl(`${art}-v`);tEl&&(tEl.textContent=temp===null?"--":`${fmt(temp,1)} °C`);let pEl=this._animEl(`${art}-pump-v`);pEl&&(pEl.textContent=this._e(`${art}_pump`)?wertText(pumpe?"läuft":"aus",this._sp()):"");let grenze=Number(this._config[art==="kamin"?"kamin_fire_temp":"solar_sun_temp"]),aktiv=temp!==null&&temp>=(Number.isFinite(grenze)?grenze:30);art==="kamin"?this._kaminFeuer(aktiv,animate):this._solarSonne(aktiv,animate),this._blattFarbe(`${art}-blade`,col(temp),pumpe);let rotorId=`${art}-rotor`,rotor=this._animEl(rotorId);if(rotor)if(rotor.classList.remove("is-still"),pumpe&&animate){let da=this._animState.get(rotorId);da&&da.type==="spin"?da.duration=PUMP_SECONDS:this._animState.set(rotorId,{type:"spin",duration:PUMP_SECONDS,winkel:0})}else this._animState.delete(rotorId);[[`dots-${art}`,col(temp)],[`dots-${art}b`,col(buf)]].forEach(([id,farbe])=>{let el=this._animEl(id);if(!el)return;let aktiv2=animate&&pumpe;el.classList.toggle("is-on",aktiv2),el.style.stroke=farbe,aktiv2?this._animState.set(id,{type:"flow",reverse:!1}):(this._animState.delete(id),el.setAttribute("stroke-dashoffset","0"))}),pumpe&&(laedt=!0)}),laedt},_kaminFeuer(an,animate){let sichtbar=(id,ja)=>{let el=this._animEl(id);el&&el.setAttribute("opacity",ja?"1":"0")};sichtbar("kamin-schein",an),sichtbar("kamin-flamme",an);let feuer=this._animEl("kamin-feuer"),glut=this._animEl("kamin-glut");an&&animate?(this._animState.has("kamin-feuer")||this._animState.set("kamin-feuer",{type:"flacker"}),this._animState.set("kamin-glut",{type:"pulse",duration:1.7,min:.15,max:.45})):(this._animState.delete("kamin-feuer"),this._animState.delete("kamin-glut"),feuer&&feuer.removeAttribute("transform"),glut&&glut.setAttribute("opacity","0.3"))},_circuitUpdate(n,col,animate,buf,laeuft){let hass=this._quelle,water=numState(hass,this._e(`hk${n}_water`)),pumpOn=isOn(hass,this._e(`hk${n}_pump`))===!0,set=(id,text)=>{let el=this._animEl(id);el&&(el.textContent=text)},paint=(id,color)=>{let el=this._animEl(id);el&&el.setAttribute("stop-color",color)};paint(`rad${n}-top`,col(water)),paint(`rad${n}-bottom`,col(water===null?null:water-6)),set(`hk${n}-water-v`,water===null?"--":`${fmt(water,1)} °C`);let rotor=this._animEl(`hk${n}-rotor`);if(rotor){rotor.classList.remove("is-still"),this._blattFarbe(`hk${n}-blade`,col(buf),pumpOn&&laeuft);let rotorId=`hk${n}-rotor`;if(pumpOn&&animate&&laeuft){let da=this._animState.get(rotorId);da&&da.type==="spin"?da.duration=PUMP_SECONDS:this._animState.set(rotorId,{type:"spin",duration:PUMP_SECONDS,winkel:0})}else this._animState.delete(rotorId)}set(`hk${n}-pump-v`,wertText(pumpOn?"läuft":"aus",this._sp()));let d=this._direkt,kreisOffen=pumpOn||!this._e(`hk${n}_pump`),fluss=d?d.heizt&&kreisOffen:laeuft&&pumpOn;[`dots-hk${n}`,`dots-hk${n}b`].forEach((id,i)=>{let el=this._animEl(id);if(!el)return;let aktiv=animate&&fluss;el.classList.toggle("is-on",aktiv),el.style.stroke=d?i===0?d.vl:d.rl:col(buf),aktiv?this._animState.set(id,{type:"flow",reverse:!1}):(this._animState.delete(id),el.setAttribute("stroke-dashoffset","0"))});let waerme=this._animEl(`hk${n}-waerme`);if(waerme){let sichtbar=fluss&&laeuft!==!1;sichtbar&&animate?this._animState.set(`hk${n}-waerme`,{type:"pulse",duration:2.4,min:.25,max:.85}):(this._animState.delete(`hk${n}-waerme`),waerme.setAttribute("opacity",sichtbar?"0.7":"0"))}return d?fluss:pumpOn},_spin(rotorId,rpm,labelId,unit,festeDauer,erlaubt){let label=this.shadowRoot.getElementById(labelId);label&&(label.textContent=rpm===null?"--":`${fmt(rpm,0)} ${unit}`);let el=this.shadowRoot.getElementById(rotorId);if(!el)return;let animate=animationAn(this._config);if(rpm===null||rpm<=0||!animate||erlaubt===!1){el.classList.toggle("is-still",rpm===null||rpm<=0),this._animState.delete(rotorId);return}el.classList.remove("is-still");let duration=festeDauer||clamp(900/rpm,.25,6),vorhanden=this._animState.get(rotorId);vorhanden&&vorhanden.type==="spin"?vorhanden.duration=duration:this._animState.set(rotorId,{type:"spin",duration,winkel:0})}};var demoKarte={_demoAufbauen(){let werte={outside_temp:8.5,heatpump_state:1,compressor:42,fan1_rpm:640,fan2_rpm:620,power_now:1240,energy_today:8.4,flow_temp:39.2,return_temp:33.1,pump_speed:2400,pump_flow:18.6,three_way_valve:0,water_pressure:1.8,defrost:0,error:"0",buffer_temp:38.4,buffer_target:42,buffer_delta:5,curve_t_high:45,curve_t_low:28,curve_o_high:15,curve_o_low:-10,curve2_t_high:38,curve2_t_low:26,curve2_o_high:15,curve2_o_low:-10,dhw_heat_delta:-8,room_heater:0,buffer_installed:1,hk1_water:34.2,hk1_water_target:36,hk1_pump:1,hk1_setpoint:36,hk2_water:30.1,hk2_water_target:32,hk2_pump:0,hk2_setpoint:32,zones_state:2,dhw_temp:48.3,dhw_setpoint:50,dhw_heater:0,dhw_installed:1,dhw_force_state:0,sterilization_state:0,circulation_pump:0,circ_switch:"off",pv_power:3400,sg_k1:"off",sg_k2:"off",dhw_force:"off",force_sterilization:"off",force_defrost:"off",dhw_heater_switch:"off",room_heater_switch:"off",buffer_switch:"on",power_state:"on",hk1_switch:"on",hk2_switch:"off",operating_mode:4,hk3_water:32.8,hk3_pump:1,hk3_switch:"on",hk4_water:28.4,hk4_pump:0,hk4_switch:"off",kamin_temp:72.4,kamin_pump:1,solar_temp:41,solar_pump:0,cop_heating:4.3,cop_dhw:3.1,heater_internal:0,heater_external:0,operating_hours:1462,compressor_starts:2381,room_heater_hours:3,dhw_heater_hours:11,holiday_mode:"off",main_schedule:"off",heating_off_temp:18,heater_on_temp:-8,heat_delta:5,steril_temp:65,steril_time:10,pump_max_duty:160},states={};Object.keys(werte).forEach(feld=>{let attrs={};feld.endsWith("_setpoint")&&Object.assign(attrs,{min:15,max:65,step:.5}),states[`demo.${feld}`]={state:String(werte[feld]),attributes:attrs}}),states["demo.mode_select"]={state:"mode_4",attributes:{options:["mode_0","mode_1","mode_2","mode_3","mode_4","mode_5","mode_6"]}},states["demo.powerful_mode"]={state:"mode_0",attributes:{options:["mode_0","mode_1","mode_2","mode_3"]}},["heating_control","pump_flow_mode","quiet_priority","smart_dhw"].forEach(feld=>{states[`demo.${feld}`]={state:"mode_0",attributes:{options:["mode_0","mode_1"]}}}),states["demo.quiet_mode"]={state:"mode_2",attributes:{options:["mode_0","mode_1","mode_2","mode_3"]}};let karte=this;this._demo={states,entities:{},callService(bereich,dienst,daten2){let id=daten2.entity_id;if(!states[id])return;dienst==="set_value"?states[id].state=String(daten2.value):dienst==="select_option"?states[id].state=daten2.option:dienst==="turn_on"?states[id].state="on":dienst==="turn_off"?states[id].state="off":dienst==="toggle"&&(states[id].state=states[id].state==="on"?"off":"on");let feld=id.slice(5),paar=DEMO_PAARE[feld];if(paar&&states[`demo.${paar}`]){let an=states[id].state==="on"||parseFloat(states[id].state)>0,zielIstSchalter=paar.endsWith("_switch")||paar.startsWith("force_")||paar==="power_state"||paar==="dhw_force"||paar==="buffer_switch";states[`demo.${paar}`].state=zielIstSchalter?an?"on":"off":an?"1":"0"}karte._render()}}},_demoSetze(feld,wert){if(!this._demo)return;let setze=(name,w)=>{let eintrag=this._demo.states[`demo.${name}`];eintrag&&(eintrag.state=String(w))};setze(feld,wert);let an=wert==="on"||parseFloat(wert)>0,paar=DEMO_PAARE[feld];if(paar){let zielIstSchalter=paar.endsWith("_switch")||paar.startsWith("force_")||paar==="power_state"||paar==="dhw_force"||paar==="buffer_switch";setze(paar,zielIstSchalter?an?"on":"off":an?1:0)}this._render()},_demoLies(feld){if(!this._demo)return null;let eintrag=this._demo.states[`demo.${feld}`];return eintrag?eintrag.state:null},_buildDemo(){let host=this.shadowRoot.getElementById("demo-leiste");if(!this._config.demo){host.hidden=!0,host.innerHTML="";return}host.hidden=!1;let schalter=[["power_state","Wärmepumpe"],["hk1_pump","Pumpe HK1"],["hk2_pump","Pumpe HK2"],["heater_internal","Heizstab läuft"],["defrost","Abtauung"],["circulation_pump","Zirkulation Status"],["dhw_force_state","Aufheizen"],["sterilization_state","Legionellenschutz"]],quellen=this._quellen(),hk=this._hkAnzahl();hk>=3&&schalter.splice(3,0,["hk3_pump","Pumpe HK3"]),hk>=4&&schalter.splice(4,0,["hk4_pump","Pumpe HK4"]),quellen.includes("kamin")&&schalter.push(["kamin_pump","Pumpe Kamin"]),quellen.includes("solar")&&schalter.push(["solar_pump","Pumpe Solarthermie"]);let regler=[["pv_power","PV Leistung",0,12e3],["outside_temp","Außen",-20,40],["flow_temp","Vorlauf",15,70],["return_temp","Rücklauf",15,70],["buffer_temp","Puffer",15,70],["dhw_temp","Warmwasser",15,70],["hk1_water","HK1 Wasser",15,60],["hk2_water","HK2 Wasser",15,60],["compressor","Verdichter",0,90],["pump_flow","Durchfluss",0,40]];hk>=3&&regler.splice(8,0,["hk3_water","HK3 Wasser",15,60]),hk>=4&&regler.splice(9,0,["hk4_water","HK4 Wasser",15,60]),quellen.includes("kamin")&&regler.push(["kamin_temp","Kamin",10,90]),quellen.includes("solar")&&regler.push(["solar_temp","Solarthermie",0,90]),host.innerHTML=`
      <div class="lhc-demo-kopf">
        <span class="lhc-field-label">${this._t("e_demo")}</span>
        <span class="lhc-demo-hinweis">${this._t("r_demo_hinweis")}</span>
      </div>
      <div class="lhc-demo-reihe">
        ${schalter.map(([feld,text],i)=>`<button type="button" class="lhc-demo-knopf" id="demo-s${i}" data-feld="${feld}">${escapeHtml(wertText(text,this._sp()))}</button>`).join("")}
        <button type="button" class="lhc-demo-knopf" id="demo-bereitschaft">${this._t("r_bereitschaft")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-ventil">${this._t("umschaltventil")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-sg">SG Ready</button>
        <button type="button" class="lhc-demo-knopf" id="demo-stoerung">${this._t("r_stoerung")}</button>
        <button type="button" class="lhc-demo-knopf" id="demo-zurueck">${this._t("r_zurueck")}</button>
      </div>
      <div class="lhc-demo-regler">
        ${regler.map(([feld,text,lo,hi])=>`
          <label class="lhc-demo-schieber">
            <span>${escapeHtml(wertText(text,this._sp()))} <b data-regler="${feld}">--</b></span>
            <input type="range" data-feld="${feld}" min="${lo}" max="${hi}" step="0.5">
          </label>`).join("")}
      </div>`,host.addEventListener("click",e=>{let btn=e.target.closest("button[data-feld]");if(!btn)return;let feld=btn.getAttribute("data-feld"),jetzt=this._demoLies(feld),istAn=jetzt==="on"||parseFloat(jetzt)>0;this._demoSetze(feld,istAn?"off":"on"),this._syncDemo()}),host.addEventListener("input",e=>{let inp=e.target.closest("input[data-feld]");if(!inp)return;let feld=inp.getAttribute("data-feld");this._demoSetze(feld,inp.value),this._syncDemo()}),this.shadowRoot.getElementById("demo-bereitschaft").addEventListener("click",()=>{parseFloat(this._demoLies("pump_flow"))>0?(this._demoSetze("compressor",0),this._demoSetze("fan1_rpm",0),this._demoSetze("fan2_rpm",0),this._demoSetze("pump_speed",0),this._demoSetze("pump_flow",0),this._demoSetze("power_now",0),this._demoSetze("hk1_pump",0),this._demoSetze("hk2_pump",0),this._demoSetze("hk3_pump",0),this._demoSetze("hk4_pump",0),this._demoSetze("circulation_pump",0)):(this._demoSetze("compressor",42),this._demoSetze("fan1_rpm",640),this._demoSetze("fan2_rpm",620),this._demoSetze("pump_speed",2400),this._demoSetze("pump_flow",18.6),this._demoSetze("power_now",1240),this._demoSetze("hk1_pump",1),this._demoSetze("hk2_pump",0),this._demoSetze("hk3_pump",1),this._demoSetze("hk4_pump",0)),this._syncDemo()}),this.shadowRoot.getElementById("demo-ventil").addEventListener("click",()=>{this._demoSetze("three_way_valve",this._demoLies("three_way_valve")==="1"?0:1),this._syncDemo()}),this.shadowRoot.getElementById("demo-sg").addEventListener("click",()=>{let k1=this._demoLies("sg_k1")==="on",k2=this._demoLies("sg_k2")==="on",folge=[[!1,!1],[!0,!1],[!1,!0],[!0,!0]],jetzt=folge.findIndex(f=>f[0]===k1&&f[1]===k2),naechste=folge[(jetzt+1)%folge.length];this._demoSetze("sg_k1",naechste[0]?"on":"off"),this._demoSetze("sg_k2",naechste[1]?"on":"off"),this._syncDemo()}),this.shadowRoot.getElementById("demo-stoerung").addEventListener("click",()=>{this._demoSetze("error",this._demoLies("error")==="0"?"H76":"0"),this._syncDemo()}),this.shadowRoot.getElementById("demo-zurueck").addEventListener("click",()=>{this._demoAufbauen(),this._buildDemo(),this._render()}),this._syncDemo()},_syncDemo(){if(!this._config.demo||!this._demo)return;["pv_power","outside_temp","flow_temp","return_temp","buffer_temp","dhw_temp","hk1_water","hk2_water","compressor","pump_flow"].forEach(feld=>{let el=this.shadowRoot.querySelector(`input[data-feld="${feld}"]`),anzeige=this.shadowRoot.querySelector(`b[data-regler="${feld}"]`),wert=this._demoLies(feld);el&&el.value!==wert&&(el.value=wert),anzeige&&(anzeige.textContent=wert)}),["power_state","hk1_pump","hk2_pump","heater_internal","defrost","circulation_pump","dhw_force_state","sterilization_state"].forEach((feld,i)=>{let el=this.shadowRoot.getElementById(`demo-s${i}`);if(!el)return;let w=this._demoLies(feld);el.classList.toggle("is-on",w==="on"||parseFloat(w)>0)})}};var DW=640,DH=200,SYMBOLE={verbrauch:'<path d="M2 -9 L-5 1 H0 L-2 9 L5 -1 H0 Z" fill="currentColor"/>',sg:`<rect x="-8" y="-6" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/>
       <circle cx="-3.5" cy="0" r="2" fill="currentColor"/><circle cx="3.5" cy="0" r="2" fill="currentColor"/>`,temp:`<path d="M-2 -8 a2 2 0 0 1 4 0 V2.5 a4 4 0 1 1 -4 0 Z" fill="none" stroke="currentColor" stroke-width="1.8"/>
         <circle cx="0" cy="5.5" r="2" fill="currentColor"/>`,cop:`<path d="M-8 4 A8 8 0 1 1 8 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M0 2 L4 -5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="0" cy="2" r="2" fill="currentColor"/>`,takt:`<path d="M-9 2 H-5 L-3 -6 L1 7 L3 -2 H9" fill="none" stroke="currentColor" stroke-width="1.8"
          stroke-linejoin="round" stroke-linecap="round"/>`,analyse:`<circle cx="-2" cy="-2" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/>
            <path d="M2.5 2.5 L8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M-5 -2 H-3.5 L-2.5 -4.5 L-1 0.5 L0 -2 H1" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>`},diagrammeKarte={_verlaufAlsKnopf(){let v=this._config.show_history;return v!==!0&&v!==!1},_diaKnoepfe(x,y,breite,untereinander){if(!this._verlaufAlsKnopf())return"";let arten=[["verbrauch",this._t("verbrauch")],["sg","SG Ready"],["temp",this._t("d_temperaturen")],["cop","COP"],["takt",this._t("d_taktung")],["analyse",this._t("d_analyse")]],abstand=10,spalten=3,w=untereinander?(breite-abstand)/2:(breite-abstand*(spalten-1))/spalten,lage=i=>{if(untereinander)return{bx:x+i%2*(w+abstand),by:y+Math.floor(i/2)*(40+abstand)};let zeile=i<spalten?0:1,inZeile=zeile?arten.length-spalten:spalten,pos=zeile?i-spalten:i;return{bx:x+breite-inZeile*w-(inZeile-1)*abstand+pos*(w+abstand),by:y+zeile*(40+abstand)}};return`<g id="dia-knoepfe">${arten.map(([art,text],i)=>{let{bx,by}=lage(i);return`
        <g class="dia-knopf klickbar" data-dia="${art}" role="button" tabindex="0"
           aria-label="${escapeHtml(text)}">
          <rect x="${bx}" y="${by}" width="${w}" height="40" rx="20"
                fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>
          <g transform="translate(${bx+24} ${by+20})" class="dia-symbol">${SYMBOLE[art]}</g>
          <text class="cap dia-text" x="${bx+42}" y="${by+21}" dominant-baseline="middle">${escapeHtml(text)}</text>
        </g>`}).join("")}</g>`},_diaDialogMarkup(){if(!this._verlaufAlsKnopf())return"";let reiter=(art,text)=>`<button type="button" data-reiter="${art}">${escapeHtml(text)}</button>`;return`
      <div class="lhc-dialog" id="dia-dialog" hidden>
        <div class="lhc-kurve-box lhc-dia-box" role="dialog" aria-modal="true" aria-labelledby="dia-titel">
          <div class="lhc-kurve-titel">
            <span id="dia-titel">--</span>
            <button type="button" class="lhc-dialog-close" id="dia-zu"
                    aria-label="${escapeHtml(this._t("f_schliessen"))}">&times;</button>
          </div>
          <div class="lhc-hilfe-chips" id="dia-reiter">
            ${reiter("verbrauch",this._t("verbrauch"))}${reiter("sg","SG Ready")}${reiter("temp",this._t("d_temperaturen"))}${reiter("cop","COP")}${reiter("takt",this._t("d_taktung"))}${reiter("analyse",this._t("d_analyse"))}
          </div>
          <svg viewBox="0 0 ${DW} ${DH}" class="lhc-dia-svg" id="dia-svg" preserveAspectRatio="xMidYMid meet">
            <g id="dia-verbrauch">${this._verlaufRahmen(20,6,DW-40,DH-12)}</g>
            <g id="dia-sg"></g>
            <g id="dia-temp"></g>
            <g id="dia-cop"></g>
            <g id="dia-takt"></g>
            <text class="value-sp verlauf-text" id="dia-leer" x="${DW/2}" y="${DH/2}"
                  text-anchor="middle" opacity="0">${escapeHtml(this._t("kein_verlauf"))}</text>
          </svg>
          <div class="lhc-dia-liste" id="dia-liste"></div>
        </div>
      </div>`},_diaEinrichten(){let sr=this.shadowRoot,dlg=sr&&sr.getElementById("dia-dialog");if(!dlg||dlg.dataset.fertig)return;dlg.dataset.fertig="1",sr.querySelectorAll(".dia-knopf").forEach(k=>{let oeffne=ev=>{ev.stopPropagation(),this._oeffneDia(k.dataset.dia)};k.addEventListener("click",oeffne),k.addEventListener("keydown",ev=>{(ev.key==="Enter"||ev.key===" ")&&(ev.preventDefault(),oeffne(ev))})}),sr.querySelectorAll("#dia-reiter button").forEach(b=>{b.addEventListener("click",()=>this._zeigeDia(b.dataset.reiter))}),dlg.addEventListener("click",ev=>{ev.target===dlg&&this._schliesseDia()}),dlg.addEventListener("keydown",ev=>{ev.key==="Escape"&&this._schliesseDia()});let zu=sr.getElementById("dia-zu");zu&&zu.addEventListener("click",()=>this._schliesseDia())},_oeffneDia(art){let dlg=this.shadowRoot.getElementById("dia-dialog");if(!dlg)return;dlg.hidden=!1,this._zeigeDia(art);let box=dlg.querySelector(".lhc-dia-box");box&&(box.setAttribute("tabindex","-1"),box.focus({preventScroll:!0}))},_diaVollLage(box,voll){let st=box.style;if(!voll){["position","left","top","width","height"].forEach(k=>st.removeProperty(k));return}let r=this.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight,b=Math.min(r.width,vw),h=Math.min(Math.max(r.height,Math.min(560,vh-24)),vh);st.position="fixed",st.width=`${b}px`,st.height=`${h}px`,st.left=`${Math.max(0,Math.min(r.left,vw-b))}px`,st.top=`${Math.max(0,Math.min(r.top,vh-h))}px`},_schliesseDia(){let dlg=this.shadowRoot.getElementById("dia-dialog");dlg&&(dlg.hidden=!0),this._diaArt=null},_zeigeDia(art){let sr=this.shadowRoot;this._diaArt=art;let titel={verbrauch:this._t("verbrauch_24"),sg:`SG Ready · ${this._t("d_24h")}`,temp:`${this._t("d_temperaturen")} · ${this._t("d_24h")}`,cop:`COP · ${this._t("d_24h")}`,takt:`${this._t("d_taktung")} · ${this._t("d_24h")}`,analyse:this._t("an_titel")};sr.getElementById("dia-titel").textContent=titel[art]||"",sr.querySelectorAll("#dia-reiter button").forEach(b=>b.classList.toggle("aktiv",b.dataset.reiter===art)),["verbrauch","sg","temp","cop","takt","analyse"].forEach(a=>{let g=sr.getElementById(`dia-${a}`);g&&g.setAttribute("display",a===art?"inline":"none")}),sr.getElementById("dia-liste").textContent="";let voll=art==="analyse",dlg=sr.getElementById("dia-dialog");dlg&&dlg.classList.toggle("voll",voll);let box=sr.querySelector(".lhc-dia-box");box&&(box.classList.toggle("voll",voll),this._diaVollLage(box,voll)),sr.getElementById("dia-svg").style.display=voll?"none":"";let leer=sr.getElementById("dia-leer");leer&&(leer.textContent=this._t("kein_verlauf"));let hoch=art==="sg"?this._sgHoehe():art==="cop"||art==="takt"?this._auswertungHoehe(art):DH;sr.getElementById("dia-svg").setAttribute("viewBox",`0 0 ${DW} ${hoch}`),sr.getElementById("dia-leer").setAttribute("y",String(hoch/2)),art==="verbrauch"?(this._verlaufZeit=0,this._holeVerlauf(),this._diaLeer(!(this._verlauf&&this._verlauf.length>=2))):art==="sg"?(this._verlaufZeit=0,this._holeVerlauf(),this._zeichneDiaSg()):art==="temp"?(this._holeTemperaturen(),this._zeichneDiaTemp()):art==="cop"||art==="takt"?(this._auswertungZeit=0,this._holeAuswertung(),this._zeichneAuswertung()):art==="analyse"&&(this._auswertungZeit=0,this._holeAuswertung(),typeof this._ladeJaz=="function"&&this._ladeJaz(),this._zeichneAnalyse())},_diaLeer(leer){let t2=this.shadowRoot.getElementById("dia-leer");t2&&t2.setAttribute("opacity",leer?"1":"0")},_diaNachVerlauf(){this._diaArt==="verbrauch"&&this._diaLeer(!(this._verlauf&&this._verlauf.length>=2)),this._diaArt==="sg"&&this._zeichneDiaSg()},_diaZeitachse(links,rechts,y){let t0=Date.now()-864e5,out="";for(let i=0;i<=4;i++){let t2=t0+i*864e5/4,x=links+i/4*(rechts-links),d=new Date(t2),text=i===4?this._t("jetzt"):`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,anker=i===0?"start":i===4?"end":"middle";out+=`<text class="value-sp verlauf-text" x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}">${escapeHtml(text)}</text>`}return out},_holeTemperaturen(){let jetzt=Date.now();if(this._tempZeit&&jetzt-this._tempZeit<3e5)return;this._tempZeit=jetzt;let felder=["flow_temp","return_temp","outside_temp"];if(this._config.demo){let reihen={};felder.forEach((f,k)=>{reihen[f]=[];for(let i=0;i<=96;i++){let t2=jetzt-864e5+i*9e5,basis=k===0?38:k===1?32:6,welle=k===2?Math.sin(i/96*Math.PI*2-1.8)*4:Math.sin(i/5)*3;reihen[f].push({t:t2,v:basis+welle})}}),this._tempVerlauf=reihen,this._zeichneDiaTemp();return}let ids=felder.map(f=>this._e(f));if(!ids.some(Boolean)||!this._hass||typeof this._hass.callWS!="function"){this._tempVerlauf=null,this._zeichneDiaTemp();return}this._hass.callWS({type:"history/history_during_period",start_time:new Date(jetzt-864e5).toISOString(),end_time:new Date(jetzt).toISOString(),entity_ids:ids.filter(Boolean),minimal_response:!0,no_attributes:!0}).then(antwort=>{let reihen={};felder.forEach((f,i)=>{let id=ids[i];reihen[f]=(antwort&&id&&antwort[id]||[]).map(p=>({t:p.lu?p.lu*1e3:Date.parse(p.last_changed),v:parseFloat(p.s!==void 0?p.s:p.state)})).filter(p=>!Number.isNaN(p.v)&&!Number.isNaN(p.t))}),this._tempVerlauf=reihen,this._zeichneDiaTemp()}).catch(()=>{this._tempVerlauf=null,this._zeichneDiaTemp()})},_zeichneDiaTemp(){let sr=this.shadowRoot,g=sr&&sr.getElementById("dia-temp");if(!g||this._diaArt!=="temp")return;let reihen=this._tempVerlauf||{},arten=[["flow_temp","#FF5F52",this._t("vorlauf")],["return_temp","#4D9BFF",this._t("ruecklauf")],["outside_temp","#9FB3C8",this._t("aussentemperatur")]].filter(([f])=>(reihen[f]||[]).length>=2);if(!arten.length){g.innerHTML="",this._diaLeer(!0);return}this._diaLeer(!1);let alle=arten.flatMap(([f])=>reihen[f].map(p=>p.v)),roh=(groesster(alle)-kleinster(alle))/4,schritt=roh<=5?5:roh<=10?10:20,min=Math.floor(kleinster(alle)/schritt)*schritt,max=Math.ceil(groesster(alle)/schritt)*schritt;max-min<schritt*2&&(max=min+schritt*2);let t1=Date.now(),t0=t1-864e5,links=56,rechts=DW-20,oben=16,unten=DH-40,px=t2=>links+(Math.min(Math.max(t2,t0),t1)-t0)/(t1-t0)*(rechts-links),py=v=>unten-(v-min)/(max-min)*(unten-oben),raster="";for(let v=min;v<=max;v+=schritt){let y=py(v).toFixed(1);raster+=`<line x1="${links}" y1="${y}" x2="${rechts}" y2="${y}" stroke="#2A3446" stroke-width="1"/>
        <text class="value-sp verlauf-text" x="${links-8}" y="${y}" text-anchor="end" dominant-baseline="middle">${fmt(v,0)}°</text>`}let linien=arten.map(([f,farbe])=>{let pkt=reihen[f].filter(p=>p.t>=t0);return`<path d="${pkt.map((p,i)=>i?`H${px(p.t).toFixed(1)}V${py(p.v).toFixed(1)}`:`M${px(p.t).toFixed(1)} ${py(p.v).toFixed(1)}`).join("")+(pkt.length?`H${rechts}`:"")}" fill="none" stroke="${farbe}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`}).join("");g.innerHTML=`${raster}${linien}${this._diaZeitachse(links,rechts,DH-12)}`,sr.getElementById("dia-liste").innerHTML=arten.map(([f,farbe,name])=>{let werte=reihen[f].map(p=>p.v),jetzt=werte[werte.length-1];return`<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe}"></span>
          <span>${escapeHtml(name)}</span>
          <b>${fmt(jetzt,1)} °C</b>
          <em>${fmt(kleinster(werte),1)} … ${fmt(groesster(werte),1)} °C</em></div>`}).join("")}};var dialogKarte={_buildDialog(){let sr=this.shadowRoot;sr.getElementById("dialog").hidden=!0,this._dialogKey=null;let range=sr.getElementById("dlg-range"),out=sr.getElementById("dlg-value"),schreiben=(wert,entitaet)=>{let id=entitaet||this._e(this._dialogKey);!id||!stellbar(id)||(this._offen=null,this._offenTimer&&(clearTimeout(this._offenTimer),this._offenTimer=null),this._halte("dialog",wert),this._quelle.callService(id.split(".")[0],"set_value",{entity_id:id,value:wert}))};this._schreibeDialog=schreiben;let schritt=richtung=>{let neu=Math.round((Number(range.value)+richtung*Number(range.step||1))*10)/10,begrenzt=clamp(neu,Number(range.min),Number(range.max));begrenzt!==Number(range.value)&&(range.value=begrenzt,out.textContent=this._dlgText(begrenzt),schreiben(begrenzt))};range.addEventListener("input",()=>{this._dialogZieht=!0,out.textContent=this._dlgText(parseFloat(range.value)),this._offen={wert:parseFloat(range.value),entitaet:this._e(this._dialogKey)},this._offenTimer&&clearTimeout(this._offenTimer),this._offenTimer=setTimeout(()=>{this._offen&&schreiben(this._offen.wert,this._offen.entitaet)},600)}),range.addEventListener("change",()=>{this._dialogZieht=!1,schreiben(parseFloat(range.value),this._e(this._dialogKey))}),sr.getElementById("dlg-minus").addEventListener("click",()=>schritt(-1)),sr.getElementById("dlg-plus").addEventListener("click",()=>schritt(1)),sr.getElementById("dlg-close").addEventListener("click",()=>this._schliesseDialog()),sr.getElementById("dialog").addEventListener("click",ev=>{ev.target&&ev.target.id==="dialog"&&this._schliesseDialog()})},_buildKlicks(){let sr=this.shadowRoot;[{gruppe:"unit-group",titel:"f_waermepumpe",werte:[],aktionen:[{feld:"power_state",status:"heatpump_state",typ:"schalter",an:"f_laeuft_aus",aus:"f_einschalten"},{feld:"force_defrost",status:"defrost",typ:"schalter",an:"f_abtauen_ende",aus:"f_abtauen_start"},{feld:"powerful_mode",typ:"auswahl",titel:"f_turbomodus",texte:POWERFUL_LABELS},{feld:"quiet_mode",typ:"auswahl",titel:"f_leisemodus",texte:QUIET_LABELS},{feld:"mode_select",typ:"auswahl",titel:"f_betriebsart",texte:MODE_LABELS}]},{gruppe:"buffer-group",beschriftung:"label_buffer",werte:["buffer_temp","room_heater"],aktionen:[{feld:"buffer_switch",status:"buffer_installed",typ:"schalter",an:"f_puffer_aus",aus:"f_puffer_an"},{feld:"room_heater_switch",status:"room_heater",typ:"schalter",an:"f_hz_heizstab_ende",aus:"f_hz_heizstab_start"},{feld:"buffer_delta",typ:"zahl",befehl:"SetBufferDelta",titel:"f_laedt_ab",bezug:"buffer_target",vorzeichen:-1,min:0,max:10,schritt:1}]},{gruppe:"dhw-group",feld:"dhw_setpoint",beschriftung:"label_dhw",werte:["dhw_temp","dhw_heater"],aktionen:[{feld:"dhw_force",status:"dhw_force_state",typ:"schalter",schmal:!0,an:"f_aufheizen_ende",aus:"f_aufheizen_start"},{feld:"force_sterilization",status:"sterilization_state",typ:"schalter",schmal:!0,an:"f_legionellen_ende",aus:"f_legionellen_start"},{feld:"dhw_heater_switch",status:"dhw_heater",typ:"schalter",schmal:!0,an:"f_heizstab_aus",aus:"f_heizstab_an"},{feld:"dhw_heat_delta",typ:"zahl",befehl:"SetDHWHeatDelta",titel:"f_laedt_ab",bezug:"dhw_setpoint",vorzeichen:1,min:-12,max:-2,schritt:1}]},{gruppe:"hk1-group",feld:"hk1_setpoint",beschriftung:"label_hk1",werte:["hk1_water"],anzeige:"hk1_water_target",aktionen:[{feld:"zones_select",typ:"zone",nummer:1,schmal:!0},{feld:"hk1_switch",typ:"schalter",schmal:!0,an:"f_kreis_aus",aus:"f_kreis_an"},{typ:"kurveknopf",zone:1,schmal:!0,titel:"f_heizkurve_zeigen"}]},{gruppe:"hk2-group",feld:"hk2_setpoint",beschriftung:"label_hk2",werte:["hk2_water"],anzeige:"hk2_water_target",aktionen:[{feld:"zones_select",typ:"zone",nummer:2,schmal:!0},{feld:"hk2_switch",typ:"schalter",schmal:!0,an:"f_kreis_aus",aus:"f_kreis_an"},{typ:"kurveknopf",zone:2,schmal:!0,titel:"f_heizkurve_zeigen"}]},...[3,4].map(n=>({gruppe:`hk${n}-group`,beschriftung:`label_hk${n}`,werte:[`hk${n}_water`,`hk${n}_pump`],aktionen:[{feld:`hk${n}_switch`,typ:"schalter",schmal:!0,an:"f_kreis_aus",aus:"f_kreis_an"}]}))].forEach(f=>{let el=sr.getElementById(f.gruppe);if(!el)return;let hatTemperatur=!!(f.feld&&this._e(f.feld)),hatAktion=(f.aktionen||[]).some(a=>this._e(a.feld)),hatWerte=!this._config.demo&&(f.werte||[]).some(key=>this._e(key));!hatTemperatur&&!hatAktion&&!hatWerte||(el.classList.add("klickbar"),el.addEventListener("click",()=>this._oeffneDialog(f)))}),this._config.demo||Object.entries({"outside-v":"outside_temp","comp-v":"compressor","fan1-rpm":"fan1_rpm","fan2-rpm":"fan2_rpm","power-now-v":"power_now","energy-today-v":"energy_today","unit-flow-v":"flow_temp","unit-ret-v":"return_temp","pump-v":"pump_speed","flow-v":"pump_flow","press-v":"water_pressure","valve-v":"three_way_valve","pv-v":"pv_power","buf-v":"buffer_temp","dhw-v":"dhw_temp","zirk-v":"circulation_pump","zirk-name":"circulation_pump","hk1-water-v":"hk1_water","hk1-pump-v":"hk1_pump","hk2-water-v":"hk2_water","hk2-pump-v":"hk2_pump","hk3-water-v":"hk3_water","hk3-pump-v":"hk3_pump","hk4-water-v":"hk4_water","hk4-pump-v":"hk4_pump","kamin-v":"kamin_temp","kamin-pump-v":"kamin_pump","solar-v":"solar_temp","solar-pump-v":"solar_pump"}).forEach(([id,feld])=>{let el=sr.getElementById(id);!el||!this._e(feld)||(el.classList.add("klickbar"),el.addEventListener("click",ev=>{ev.stopPropagation(),this._mehrInfo(this._e(feld))}))});let zirkEl=sr.getElementById("zirkulation-group");zirkEl&&this._e("circ_switch")&&(zirkEl.classList.add("klickbar"),zirkEl.addEventListener("click",ev=>{ev.stopPropagation(),this._schaltCircSwitch()}))},_schaltCircSwitch(){let switchId=this._e("circ_switch");if(!switchId)return;let state=this._hass.states[switchId],newState=(state?state.state:"off")==="on"?"off":"on";this._hass.callService("homeassistant","turn_"+newState,{entity_id:switchId})},_oeffneDialog(f){let sr=this.shadowRoot,tempId=f.feld?this._e(f.feld):"";this._dialogKey=tempId&&this._quelle.states[tempId]?f.feld:null,this._dialogAnzeige=f.anzeige||null,this._dialogAktionen=(f.aktionen||[]).filter(a=>a.feld?!!this._e(a.feld):!0),this._dialogGruppen=f.werte||[],this._gehalten&&delete this._gehalten.dialog,sr.getElementById("dlg-title").textContent=f.titel&&this._t(f.titel)||this._name(f.beschriftung)||this._t("f_einstellen");let reglerFeld=sr.getElementById("dlg-temp");reglerFeld.hidden=!this._dialogKey;let reglerKann=this._dialogKey&&stellbar(this._e(this._dialogKey));reglerFeld.classList.toggle("nur-lesbar",!reglerKann),sr.querySelectorAll("#dlg-temp input, #dlg-temp button").forEach(e=>{e.disabled=!reglerKann}),this._baueAktionen(),this._baueWerte(),sr.getElementById("dialog").hidden=!1,this._syncDialog(),this._syncDemo()},_zustand(a){let pruefe=feld=>{if(!feld)return null;let id=this._e(feld);if(!id)return null;let roh=rawState(this._quelle,id);return roh===null||roh==="unknown"||roh==="unavailable"?null:isOn(this._quelle,id)},ausStatus=pruefe(a.status);return ausStatus!==null?ausStatus:pruefe(a.feld)},_mehrInfo(entityId){if(!entityId)return;let ev=new Event("hass-more-info",{bubbles:!0,composed:!0});ev.detail={entityId},this.dispatchEvent(ev)},_baueWerte(){let host=this.shadowRoot.getElementById("dlg-werte");if(!host)return;let gruppen=this._dialogGruppen||[],felder=this._config.demo?[]:gruppen.map(key=>ENTITY_FIELDS.find(f=>f.key===key)).filter(f=>f&&this._quelle.states[this._e(f.key)]);if(!felder.length){host.innerHTML="";return}host.innerHTML=`<div class="lhc-field-label">${escapeHtml(this._t("r_verlauf_zeigen"))}</div>`+felder.map((f,i)=>`<button type="button" class="lhc-wert" id="dlg-w${i}">
               <span>${escapeHtml(feldText(f,this._sp()))}</span>
               <b id="dlg-w${i}-v"></b>
             </button>`).join(""),felder.forEach((f,i)=>{let el=this.shadowRoot.getElementById(`dlg-w${i}`),wert=this.shadowRoot.getElementById(`dlg-w${i}-v`),id=this._e(f.key),st=this._quelle.states[id];if(wert&&st){let rohEinheit=st.attributes&&st.attributes.unit_of_measurement||"",einheit=rohEinheit==="K"?"°C":rohEinheit,zahl=parseFloat(st.state),text=st.state;if(!Number.isNaN(zahl)&&/^[-\d.,\s]+$/.test(st.state)){let stellen=["°C","bar"].includes(einheit)?1:0;text=zahl.toFixed(stellen).replace(".",DEZIMAL)}wert.textContent=einheit?`${text} ${einheit}`:text}el&&el.addEventListener("click",()=>this._mehrInfo(id))})},_baueAktionen(){let host=this.shadowRoot.getElementById("dlg-actions"),liste=this._dialogAktionen||[];host.innerHTML=liste.map((a,i)=>a.typ==="auswahl"?`<label class="lhc-dialog-select">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <select id="dlg-a${i}"></select>
             </label>`:a.typ==="kurveknopf"?`<button type="button" class="lhc-dialog-action${a.schmal?" schmal":""}" id="dlg-a${i}">${escapeHtml(this._t(a.titel))}</button>`:a.typ==="zahl"?`<div class="lhc-num-kompakt">
               <span class="lhc-field-label">${escapeHtml(this._t(a.titel))}</span>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-minus"
                       aria-label="${this._t("s_kleiner")}">&minus;</button>
               <output id="dlg-a${i}">--</output>
               <button type="button" class="lhc-step klein" id="dlg-a${i}-plus"
                       aria-label="${this._t("s_groesser")}">+</button>
             </div>`:`<button type="button" class="lhc-dialog-action${a.schmal?" schmal":""}" id="dlg-a${i}">--</button>`).join(""),liste.forEach((a,i)=>{let el=this.shadowRoot.getElementById(`dlg-a${i}`);if(el)if(a.typ==="auswahl")el.addEventListener("change",()=>{let id=this._e(a.feld);this._quelle.callService("select","select_option",{entity_id:id,option:el.value})});else if(a.typ==="kurveknopf"){let k=this.shadowRoot.getElementById(`dlg-a${i}`);k&&k.addEventListener("click",()=>{this.shadowRoot.getElementById("dialog").hidden=!0,this._oeffneKurve(a.zone||1)})}else if(a.typ==="zahl"){let stelle=richtung=>{let feld=a.feld,id=this._e(feld);if(!id)return;let kannEntitaet=stellbar(id);if(!kannEntitaet&&!a.befehl)return;let ist=numState(this._quelle,id),gehalten=this._gehaltenerWert(id,ist),jetzt=gehalten!==null?gehalten:ist;if(jetzt===null)return;let schritt=a.schritt||1,neu=clamp(Math.round((jetzt+richtung*(a.vorzeichen||1)*schritt)*10)/10,a.min,a.max);if(neu===jetzt)return;if(this._halte(id,neu),kannEntitaet){this._quelle.callService(id.split(".")[0],"set_value",{entity_id:id,value:neu}),this._syncAktionen();return}let praefix=this._config.mqtt_prefix||"panasonic_heat_pump",nutzlast=String(neu);this._quelle.callService("mqtt","publish",{topic:`${praefix}/commands/${a.befehl}`,payload:nutzlast}),this._syncAktionen()},minus=this.shadowRoot.getElementById(`dlg-a${i}-minus`),plus=this.shadowRoot.getElementById(`dlg-a${i}-plus`);minus&&minus.addEventListener("click",()=>stelle(-1)),plus&&plus.addEventListener("click",()=>stelle(1))}else a.typ==="zone"?el.addEventListener("click",()=>this._zoneSchalten(a.nummer)):el.addEventListener("click",()=>{let id=this._e(a.feld),an=this._zustand(a);this._quelle.callService("homeassistant",an===!0?"turn_off":"turn_on",{entity_id:id})})})},_syncAktionen(){let liste=this._dialogAktionen||[],farbeSetzen=(el,zustand)=>{el.classList.toggle("is-an",zustand===!0),el.classList.toggle("is-aus",zustand===!1)};liste.forEach((a,i)=>{let el=this.shadowRoot.getElementById(`dlg-a${i}`),st=this._quelle.states[this._e(a.feld)];if(el&&a.typ!=="kurveknopf"&&!(a.typ!=="zone"&&!st)){if(a.typ==="zahl"){let feldName=a.feld,kann=stellbar(this._e(feldName))||!!a.befehl;[`dlg-a${i}-minus`,`dlg-a${i}-plus`].forEach(kid=>{let k=this.shadowRoot.getElementById(kid);k&&(k.disabled=!kann)});let beschriftung=el.parentElement?el.parentElement.querySelector(".lhc-field-label"):null;if(beschriftung){let hinweis=this._t("f_nur_lesbar"),rein=beschriftung.textContent.replace(hinweis,"");beschriftung.textContent=kann?rein:rein+hinweis}let idFeld=this._e(feldName),istWert=numState(this._quelle,idFeld),gehalten=this._gehaltenerWert(idFeld,istWert),roh=gehalten!==null?gehalten:istWert,ziel=a.bezug?numState(this._quelle,this._e(a.bezug)):null;el.textContent=roh===null?"--":ziel===null?`${fmt(roh,0)} ${a.einheit||"°C"}`:`${fmt(ziel-Math.abs(roh),0)} °C`;return}if(a.typ==="auswahl"){let optionen=st.attributes.options||[],kennung=optionen.join("|");el.dataset.kennung!==kennung&&(el.innerHTML=optionen.map(o=>`<option value="${escapeHtml(o)}">${escapeHtml(a.texte[o]!==void 0?wertText(a.texte[o],this._sp()):o)}</option>`).join(""),el.dataset.kennung=kennung),el.value!==st.state&&(el.value=st.state)}else if(a.typ==="zone"){let aktiv=this._zoneAktiv(a.nummer),andere=this._zoneAktiv(a.nummer===1?2:1);el.textContent=aktiv===null?this._t("r_zonen_unbekannt"):aktiv?this._t("f_zone_aus"):this._t("f_zone_an"),el.disabled=aktiv===!0&&andere!==!0,el.disabled&&(el.textContent=this._t("r_einziger_kreis")),farbeSetzen(el,el.disabled?null:aktiv)}else{let an=this._zustand(a);el.textContent=an===null?`${this._t(a.aus)} (${this._t("unbekannt")})`:this._t(an?a.an:a.aus),farbeSetzen(el,an)}}})},_schliesseDialog(){this._offen&&this._schreibeDialog&&this._schreibeDialog(this._offen.wert,this._offen.entitaet),this._offen=null,this._offenTimer&&(clearTimeout(this._offenTimer),this._offenTimer=null),this._dialogKey=null,this._dialogAnzeige=null,this._dialogAktionen=null,this._dialogZieht=!1,this.shadowRoot.getElementById("dialog").hidden=!0},_syncDialog(){if(this.shadowRoot.getElementById("dialog").hidden||(this._syncAktionen(),!this._dialogKey))return;let sr=this.shadowRoot,st=this._quelle.states[this._e(this._dialogKey)];if(!st)return this._schliesseDialog();let range=sr.getElementById("dlg-range"),a=st.attributes||{},wert=parseFloat(st.state);if(Number.isNaN(wert))return;let lo=Number(a.min!==void 0?a.min:15),hi=Number(a.max!==void 0?a.max:65),modus=a.modus===void 0||a.modus===null?null:Number(a.modus),versch=!1;this._dialogAnzeige&&(modus===0||modus===null&&lo>=-5&&hi<=5&&lo<0?versch=!0:modus===null&&lo<=-5&&hi>=20&&(versch=wert>=-5&&wert<=5),versch?(lo=Math.max(lo,-5),hi=Math.min(hi,5)):lo<=-5&&hi>=20&&(lo=20)),this._dialogEinheit=versch?"K":"°C",range.min=lo,range.max=hi,range.step=Number(a.step!==void 0?a.step:1),sr.getElementById("dlg-min").textContent=this._dlgText(lo),sr.getElementById("dlg-max").textContent=this._dlgText(hi);let hinweis="";if(versch){let ziel=numState(this._quelle,this._e(this._dialogAnzeige));hinweis=this._t("s_versch")+(ziel===null?"":` · ${tf(this._t("s_ziel"),{v:fmt(ziel,0)})}`)}if(sr.getElementById("dlg-hinweis").textContent=hinweis,this._dialogZieht)return;let gehalten=this._gehaltenerWert("dialog",wert),zeigen=clamp(gehalten!==null?gehalten:wert,lo,hi);range.value=zeigen,sr.getElementById("dlg-value").textContent=this._dlgText(zeigen)},_dlgText(v){if(v==null||Number.isNaN(v))return"--";let zahl=String(v).replace(".",DEZIMAL);return this._dialogEinheit==="K"?`${v>0?"+":""}${zahl} °C`:`${zahl} °C`}};var grafikHochKarte={_svgHoch(){let anzahl=this._hkAnzahl(),quellen=this._quellen(),P={W:760,X_RL:80,X_VL:710,S_RL:170,S_VL:650,U1:260,U2:580,OBEN:740},UM=(P.U1+P.U2)/2,mitPuffer=this._hatPuffer(),ab=mitPuffer?0:280,PUF=[860,1080],QZ=quellen.length?[PUF[1]+60,PUF[1]+280]:null,QH=quellen.length?250:0,HKS=Array.from({length:anzahl},(_,i)=>[1140-ab+QH+i*240,1340-ab+QH+i*240]),HK1=HKS[0],WW=[HKS[anzahl-1][1]+20,HKS[anzahl-1][1]+280],ABZW=mitPuffer?PUF[1]-20:HK1[0]-40,anschluss=(n,y1,y2)=>{let stil=this._heizStil(n);if(!this._istFbh(stil))return{vy:y1+60,ry:y2-60};let g=this._fbhLage(stil,P.U1,P.U1+180,y1+10,y2-10);return{vy:Math.round(g.vy),ry:Math.round(g.ry)}},an=HKS.map((z,i)=>anschluss(i+1,z[0],z[1])),a1=an[0],letzt=an[anzahl-1],ABZW_VL=mitPuffer?ABZW:a1.vy,ABZW_RL=mitPuffer?ABZW:a1.ry,UNTEN=WW[1]+40,HOEHE3=WW[1]+60,rohr=d=>`<path class="pipe-shell" d="${d}"/><path class="pipe" d="${d}"/>`,stutzenVL=(x,y)=>rohr(`M${x} ${y} H ${P.U2+9}`),stutzenRL=(x,y)=>rohr(`M${P.U1-9} ${y} H ${x}`),symbole=["betrieb","abtauen","auto","heizen","ww","kuehlen"].map((k,i)=>{let glyph={betrieb:`<g stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round">
                      <path d="M0 -10 V -1"/><path d="M-6.4 -6.4 A 9 9 0 1 0 6.4 -6.4"/></g>`,abtauen:`<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
                      <path d="M0 -12 V 1 M-7 -8 L 7 0 M-7 0 L 7 -8"/>
                      <path d="M-2.6 -9.5 L0 -12 L2.6 -9.5"/></g>
                    <path d="M-5 5 C -2.6 8, -2.6 11, -5 11 C -7.4 11, -7.4 8, -5 5 Z
                             M5 5 C 7.4 8, 7.4 11, 5 11 C 2.6 11, 2.6 8, 5 5 Z" fill="currentColor"/>`,auto:'<text class="modus-t" x="0" y="7" text-anchor="middle" fill="currentColor">A</text>',heizen:`<path d="M0 -11 C 6 -4, 8 0, 8 3 A 8 8 0 1 1 -8 3 C -8 -1, -3 -4, 0 -11 Z" fill="currentColor"/>
                   <path d="M0 -2 C 3 1, 4 3, 4 4.5 A 4 4 0 1 1 -4 4.5 C -4 3, -2 1.5, 0 -2 Z" fill="#0D1219"/>`,ww:'<path d="M0 -11 C 6 -2, 9 2, 9 5 A 9 9 0 0 1 -9 5 C -9 2, -6 -2, 0 -11 Z" fill="currentColor"/>',kuehlen:`<g stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none">
                      <path d="M0 -11 V 11 M-9.5 -5.5 L 9.5 5.5 M-9.5 5.5 L 9.5 -5.5"/>
                      <path d="M-3 -8 L0 -11 L3 -8 M-3 8 L0 11 L3 8"/></g>`}[k];return`<g class="modus" id="modus-${k}" transform="translate(${190+(i-2.5)*44} 70)">
          <circle r="18" fill="#0D1219" stroke="#33415A" stroke-width="1.5"/>${glyph}</g>`}).join(""),fans=this._config.fan_count===2?`${this._fan("fan1",190,280,96)}${this._fan("fan2",190,528,96)}`:this._fan("fan1",190,400,120),kopf=`
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
      </g>`,kennzahlen=`
      <g id="kennzahlen">
        <g id="sg-group" opacity="0">
          <text class="sg-label" x="390" y="70">SG Ready</text>
          <text class="sg-value" id="sg-text" x="390" y="98">--</text>
          <g transform="translate(390 112)">
            ${[0,1,2,3].map(i=>`<rect x="${i*36}" y="0" width="32" height="11" rx="5.5" id="sg-seg-${i+1}" fill="#3A4658"/>`).join("")}
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
      </g>`,leitungen=`
      ${rohr(`M260 680 V ${P.OBEN} H ${P.X_VL} V ${WW[0]+40}`)}
      ${rohr(`M${P.X_RL} ${WW[1]-20} V 680`)}
      <path class="flowdots" id="dots-vl-a" d="M260 680 V ${P.OBEN} H ${P.X_VL} V ${mitPuffer?PUF[0]+60:ABZW_VL}"/>
      <path class="flowdots" id="dots-ww-vl" d="M${P.X_VL} ${mitPuffer?PUF[0]+60:ABZW_VL} V ${WW[0]+40}"/>
      <path class="flowdots" id="dots-rl-a" d="M${P.X_RL} ${mitPuffer?PUF[1]-60:ABZW_RL} V 680"/>
      <path class="flowdots" id="dots-ww-rl" d="M${P.X_RL} ${WW[1]-20} V ${mitPuffer?PUF[1]-60:ABZW_RL}"/>

      <g id="vl-schild">
        <rect x="${P.X_VL-schildBreite("Vorlauf",92)/2}" y="${P.OBEN+40}" width="${schildBreite("Vorlauf",92)}" height="28" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="${P.X_VL}" y="${P.OBEN+59}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="${P.X_VL-34}" y="${P.OBEN+30}"
            text-anchor="end">--</text>
      <g id="rl-schild">
        <rect x="${P.X_RL-schildBreite("Rücklauf",104)/2}" y="${P.OBEN+40}" width="${schildBreite("Rücklauf",104)}" height="28" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="${P.X_RL}" y="${P.OBEN+59}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="${P.X_RL+34}" y="${P.OBEN+30}"
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
      <text class="cap-s" x="${P.X_VL-34}" y="854" text-anchor="end">${this._t("umschaltventil")}</text>
      <text class="value-s" id="valve-v" x="${P.X_VL-34}" y="880" text-anchor="end">--</text>

      <g transform="translate(${P.X_RL} 960)">
        <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <g class="rotor" id="pump-rotor">
          <path id="pump-blade" d="M0 -15 L5 -4 L16 0 L5 4 L0 15 L-5 4 L-16 0 L-5 -4 Z" fill="#55637A"/>
          <circle r="4" fill="#0D1219"/>
        </g>
      </g>
      <text class="cap-s"   x="${P.X_RL+42}" y="942" text-anchor="start">${this._t("pumpe")}</text>
      <text class="value-s" id="pump-v" x="${P.X_RL+42}" y="966" text-anchor="start">--</text>
      <text class="value-s" id="flow-v" x="${P.X_RL+42}" y="988" text-anchor="start">--</text>

      <g id="press-group" opacity="0">
        <g transform="translate(${P.X_RL} ${UNTEN-120})">
          <circle r="26" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <circle r="18" fill="none" stroke="#26303F" stroke-width="3"/>
          <line id="press-needle" x1="0" y1="0" x2="0" y2="-15"
                stroke="${NEUTRAL}" stroke-width="3" stroke-linecap="round"/>
          <circle r="4" fill="#55637A"/>
        </g>
        <text class="cap-s"   x="${P.X_RL+42}" y="${UNTEN-126}" text-anchor="start">${this._t("druck")}</text>
        <text class="value-s" id="press-v" x="${P.X_RL+42}" y="${UNTEN-102}" text-anchor="start">--</text>
        <g id="press-warn" opacity="0" transform="translate(${P.X_RL+170} ${UNTEN-114})">
          <path d="M0 -13 L13 10 L-13 10 Z" fill="#3A0E0E"
                stroke="#D62B2B" stroke-width="2" stroke-linejoin="round"/>
          <path d="M0 -6 V 3" stroke="#FF6B5E" stroke-width="2.5" stroke-linecap="round"/>
          <circle cy="7" r="1.6" fill="#FF6B5E"/>
        </g>
      </g>`,speicher=(id,y1,y2,name,fuell,mindest,labelKey,badges)=>{let h=y2-y1,breite=schildBreite(this._name(labelKey),mindest);return`
        <g class="unit klickbar" id="${id}">
          <rect x="${P.U1}" y="${y1}" width="${P.U2-P.U1}" height="${h}" rx="26"
                fill="#0E1620" stroke="#33415A" stroke-width="2"/>
          <rect x="${P.U1+8}" y="${y1+8}" width="${P.U2-P.U1-16}" height="${h-16}" rx="20"
                fill="url(#${fuell})"/>
          ${this._bubbles(`${name}-bubbles`,P.U1+8,y1+8,P.U2-P.U1-16,h-16)}
          <rect x="${P.U1+8}" y="${y1+8}" width="${P.U2-P.U1-16}" height="${h-16}" rx="20"
                fill="url(#glass)"/>
          <g id="${name}-name">
            <rect x="${UM-breite/2}" y="${y1+12}" width="${breite}" height="30" rx="8"
                  fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
            <text class="cap" x="${UM}" y="${y1+27}" text-anchor="middle"
                  dominant-baseline="middle">${escapeHtml(this._name(labelKey))}</text>
          </g>
          <text class="value-l"  id="${name}-v"  x="${UM}" y="${y1+h/2+12}" text-anchor="middle">--</text>
          <text class="value-sp" id="${name}-sp" x="${UM}" y="${y1+h/2+36}" text-anchor="middle"></text>
          <text class="value-sp" id="${name}-delta" x="${UM}" y="${y1+h/2+60}" text-anchor="middle"></text>
          ${badges||""}
        </g>`},puffer=stutzenVL(P.X_VL,PUF[0]+60)+stutzenRL(P.X_RL,PUF[1]-60)+`<path class="flowdots" id="dots-buf" d="M${P.X_VL} ${PUF[0]+60} H ${P.U2+9}"/>
       <path class="flowdots" id="dots-buf2" d="M${P.U1-9} ${PUF[1]-60} H ${P.X_RL}"/>`+speicher("buffer-group",PUF[0],PUF[1],"buf","bufferFill",150,"label_buffer",`
        <g id="roomheater-badge" class="badge" transform="translate(${UM} ${PUF[0]+70})">
          <rect x="${-abzeichenBreite(this._t("heizstab"))/2}" y="-15" width="${abzeichenBreite(this._t("heizstab"))}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>`),warmwasser=stutzenVL(P.X_VL,WW[0]+40)+stutzenRL(P.X_RL,WW[1]-20)+`<path class="flowdots" id="dots-dhw" d="M${P.X_VL} ${WW[0]+40} H ${P.U2+9}"/>
       <path class="flowdots" id="dots-dhw2" d="M${P.U1-9} ${WW[1]-20} H ${P.X_RL}"/>`+speicher("dhw-group",WW[0],WW[1],"dhw","dhwFill",134,"label_dhw",`
        <g id="dhwforce-badge" class="badge" transform="translate(${UM-120} ${WW[0]+70})">
          <rect x="${-abzeichenBreite(this._t("aufheizen"))/2}" y="-15" width="${abzeichenBreite(this._t("aufheizen"))}" height="30" rx="15"
                fill="#08243A" stroke="#3B9BE0" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("aufheizen")}</text>
        </g>
        <g id="sterilization-badge" class="badge" transform="translate(${UM} ${WW[0]+70})">
          <rect x="${-abzeichenBreite(this._t("legionellen"))/2}" y="-15" width="${abzeichenBreite(this._t("legionellen"))}" height="30" rx="15"
                fill="#2B1240" stroke="#A855F7" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("legionellen")}</text>
        </g>
        <g id="dhwheater-badge" class="badge" transform="translate(${UM+120} ${WW[0]+70})">
          <rect x="${-abzeichenBreite(this._t("heizstab"))/2}" y="-15" width="${abzeichenBreite(this._t("heizstab"))}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>`),sekundaer=`
      ${mitPuffer?rohr(`M${P.U2} ${ABZW_VL} H ${P.S_VL} V ${letzt.vy}`):anzahl>1?rohr(`M${P.S_VL} ${a1.vy} V ${letzt.vy}`):""}
      ${mitPuffer?rohr(`M${P.U1} ${ABZW_RL} H ${P.S_RL} V ${letzt.ry}`):anzahl>1?rohr(`M${P.S_RL} ${a1.ry} V ${letzt.ry}`):""}
      <path class="flowdots" id="dots-sf-a" d="M${mitPuffer?P.U2:P.X_VL} ${ABZW_VL} H ${P.S_VL} V ${a1.vy}"/>
      <path class="flowdots" id="dots-sr-a" d="M${P.S_RL} ${a1.ry} V ${ABZW_RL} H ${mitPuffer?P.U1:P.X_RL}"/>
      ${an.slice(1).map((z,i)=>{let k=i+2,id=k===2?"":String(k);return`<path class="flowdots" id="dots-sf-b${id}" d="M${P.S_VL} ${an[i].vy} V ${z.vy}"/>
      <path class="flowdots" id="dots-sr-b${id}" d="M${P.S_RL} ${z.ry} V ${an[i].ry}"/>`}).join("")}`,heizkreis=(n,y1,y2)=>{let kr=P.U1+180,tx=Math.round((kr+P.U2)/2)+4,{vy,ry}=anschluss(n,y1,y2),direkt=!mitPuffer&&n===1,koerper=this._heizkoerper(n,P.U1,kr,y1+10,y2-10,{x:kr+6,y:vy,seite:"rechts"},{x:P.U1-6,y:ry,seite:"links"});return`
        ${rohr(`M${direkt?P.X_VL:P.S_VL} ${vy} H ${kr+9}`)}
        ${rohr(`M${P.U1-9} ${ry} H ${direkt?P.X_RL:P.S_RL}`)}
        <path class="flowdots" id="dots-hk${n}" d="M${P.S_VL} ${vy} H ${kr+9}"/>
        <path class="flowdots" id="dots-hk${n}b" d="M${P.U1-9} ${ry} H ${P.S_RL}"/>
        <g class="circuit klickbar" id="hk${n}-group">
          <g id="hk${n}-rad">${koerper}
          </g>
          <g id="hk${n}-name">
            <text class="cap" x="${tx}" y="${y1+88}" text-anchor="middle">${escapeHtml(this._name(`label_hk${n}`))}</text>
          </g>
          <g id="hk${n}-tag">
            <text class="tag-v hk-wert" id="hk${n}-water-v" x="${tx}" y="${y1+118}" text-anchor="middle">--</text>
          </g>
          <g transform="translate(${(P.U2+P.S_VL)/2} ${vy})">
            <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
            <g class="rotor" id="hk${n}-rotor">
              <path id="hk${n}-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
              <circle r="3.5" fill="#0D1219"/>
            </g>
          </g>
          <text class="value-s" id="hk${n}-pump-v" x="${(P.U2+P.S_VL)/2}" y="${vy+40}"
                text-anchor="middle">--</text>
        </g>`},zirk=`
      <g id="zirkulation-group" opacity="0">
        ${rohr(`M${P.U2} ${WW[0]+130} H ${P.U2+90} M${P.U2+90} ${WW[0]+130} V ${WW[1]-30} M${P.U2+90} ${WW[1]-30} H ${P.U2}`)}
        <path class="flowdots" id="dots-zirk-h1" d="M${P.U2} ${WW[0]+130} H ${P.U2+90}"/>
        <path class="flowdots" id="dots-zirk-v" d="M${P.U2+90} ${WW[0]+130} V ${WW[1]-30}"/>
        <path class="flowdots" id="dots-zirk-h2" d="M${P.U2+90} ${WW[1]-30} H ${P.U2}"/>
        <g transform="translate(${P.U2+90} ${(WW[0]+WW[1])/2+50})">
          <circle r="24" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="zirk-rotor">
            <path id="zirk-blade" d="M0 -13 L4 -3 L14 0 L4 3 L0 13 L-4 3 L-14 0 L-4 -3 Z" fill="#55637A"/>
            <circle r="3.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="cap-s" id="zirk-name" x="${P.U2+90}" y="${WW[0]+100}" text-anchor="middle">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${P.U2+90}" y="${WW[0]+118}" text-anchor="middle" opacity="0">--</text>
      </g>`;return`
    <svg viewBox="0 0 ${P.W} ${HOEHE3}" class="lhc-svg" role="img"
         preserveAspectRatio="xMidYMid meet">
      ${this._defs()}
      ${kopf}
      ${kennzahlen}
      ${(()=>{let w=clamp(Number(this._config.history_width)||450,250,700),breit=clamp(w,240,360);return this._verlaufAlsKnopf()?this._diaKnoepfe(740-breit,420,breit,!0):this._verlaufRahmen(740-breit,420,breit,260)})()}

      ${leitungen}
      ${mitPuffer?puffer:""}
      ${sekundaer}
      ${QZ?this._quellenHoch(quellen,UM,PUF[1],QZ):""}
      ${HKS.map((z,i)=>heizkreis(i+1,z[0],z[1])).join("")}
      ${warmwasser}
      ${zirk}
    </svg>`},_quellenHoch(quellen,mitte,pufferUnten,zeile){let yc=zeile[0]+92,lagen=quellen.length===2?[mitte-82,mitte+82]:[mitte];return quellen.map((art,i)=>{let cx=lagen[i],geraetOben=art==="kamin"?yc-46:yc-40,vl=`M${cx-18} ${geraetOben} V ${pufferUnten}`,rl=`M${cx+18} ${pufferUnten} V ${geraetOben}`,pumpY=Math.round((pufferUnten+geraetOben)/2);return`
      <g class="quelle" id="${art}-group">
        <path class="pipe-shell duenn" d="${vl} ${rl}"/>
        <path class="pipe duenn" id="pipe-${art}-vl" d="${vl}"/>
        <path class="pipe duenn" id="pipe-${art}-rl" d="${rl}"/>
        <path class="flowdots duenn" id="dots-${art}" d="${vl}"/>
        <path class="flowdots duenn" id="dots-${art}b" d="${rl}"/>
        <g transform="translate(${cx+18} ${pumpY})">
          <circle r="13" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="${art}-rotor">
            <path id="${art}-blade" d="M0 -7 L2 -2 L8 0 L2 2 L0 7 L-2 2 L-8 0 L-2 -2 Z" fill="#55637A"/>
            <circle r="2.2" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="${art}-pump-v" x="${cx+36}" y="${pumpY+5}" text-anchor="start">--</text>
        ${art==="kamin"?this._kaminBild(cx,yc):this._solarBild(cx,yc)}
        <text class="cap" id="${art}-name" x="${cx}" y="${yc+84}" text-anchor="middle">${this._t(art==="kamin"?"kamin":"solarthermie")}</text>
        <text class="tag-v hk-wert" id="${art}-v" x="${cx}" y="${yc+110}" text-anchor="middle">--</text>

      </g>`}).join("")}};var grafikKlassischKarte={_svgQuerKlassisch(){let fans=this._config.fan_count===2?`${this._fan("fan1",190,360,96)}${this._fan("fan2",190,608,96)}`:this._fan("fan1",190,480,120),F=L.FLOW_Y,R=L.RET_Y,SF=L.SEC_FLOW,SR=L.SEC_RET,DX=this._config.hk_count>=2?0:260,PX=this._hatPuffer()?0:160,SEC_START=this._hatPuffer()?730:630+PX,VX=DX+PX,SEC_VL_ENDE=this._config.hk_count>=2?L.X_HK2_DROP:L.X_HK1_DROP,SEC_RL_ENDE=this._config.hk_count>=2?L.X_HK2_BACK:L.X_HK1_BACK,T=L.TANK_TOP,B=L.TANK_BOTTOM,hk2=this._config.hk_count>=2;return`
    <svg viewBox="0 ${80-LUFT} ${L.W-VX} ${L.H+LUFT}" class="lhc-svg" role="img"
         aria-label="${this._t("s_schema")}">
${this._defs()}
      <defs>
        <clipPath id="bufClip"><rect x="548" y="298" width="174" height="334" rx="20"/></clipPath>
        <clipPath id="dhwClip"><rect x="1438" y="298" width="174" height="334" rx="20"/></clipPath>
      </defs>

      <!-- Sammelleitungen -->
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C-VX}"/>
      <path class="pipe" id="pipe-return" d="M${L.X_PIPE_L} ${R} H ${L.X_DHW_C-VX}"/>
      <path class="pipe-shell" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C-VX}"/>
      <path class="pipe" id="pipe-flow" d="M${L.X_PIPE_L} ${F} H ${L.X_DHW_C-VX}"/>
      <!-- Zwei Abschnitte je Leitung: bis zum Ventil und dahinter.
           Der Teil hinter dem Ventil fuehrt nur zum Warmwasserspeicher. -->
      <path class="flowdots" id="dots-vl-a" d="M${L.X_PIPE_L} ${F} H 630"/>
      <path class="flowdots" id="dots-ww-vl" d="M630 ${F} H ${L.X_DHW_C-VX}"/>
      <path class="flowdots" id="dots-rl-a" d="M630 ${R} H ${L.X_PIPE_L}"/>
      <path class="flowdots" id="dots-ww-rl" d="M${L.X_DHW_C-VX} ${R} H 630"/>

      ${(()=>{let mit=this._hatPuffer(),vl=mit?`M630 ${F} V ${T}`:`M630 ${F} V ${SF}`,rl=mit?`M630 ${B} V ${R}`:`M630 ${SR} V ${R}`;return`
      <path class="pipe-shell" d="${vl} ${rl}"/>
      <path class="pipe" id="pipe-buf-in" d="${vl}"/>
      <path class="pipe" id="pipe-buf-out" d="${rl}"/>
      <path class="flowdots" id="dots-buf" d="${vl}"/>
      <path class="flowdots" id="dots-buf2" d="${rl}"/>`})()}

      <g transform="translate(${-PX} 0)">
      <!-- Sekundaerkreis: vom Puffer zu den Heizkreisen und zurueck -->
      <path class="pipe-shell" d="M${SEC_START} ${SF} H ${SEC_VL_ENDE} M${SEC_START} ${SR} H ${SEC_RL_ENDE}"/>
      <path class="pipe" id="pipe-sec-flow" d="M${SEC_START} ${SF} H ${SEC_VL_ENDE}"/>
      <path class="pipe" id="pipe-sec-ret" d="M${SEC_START} ${SR} H ${SEC_RL_ENDE}"/>
      <!-- Auch hier abschnittsweise: der Weg zum zweiten Heizkreis
           fuehrt nur Wasser, wenn dessen Pumpe laeuft. -->
      <path class="flowdots" id="dots-sf-a" d="M${SEC_START} ${SF} H ${L.X_HK1_DROP}"/>
      <path class="flowdots rev" id="dots-sr-a" d="M${SEC_START} ${SR} H ${L.X_HK1_BACK}"/>
      ${hk2?`<path class="flowdots" id="dots-sf-b" d="M${L.X_HK1_DROP} ${SF} H ${L.X_HK2_DROP}"/>
             <path class="flowdots rev" id="dots-sr-b" d="M${L.X_HK1_BACK} ${SR} H ${L.X_HK2_BACK}"/>`:""}
      </g>

      <path class="pipe-shell" d="M${L.X_DHW_C-VX} ${F} V ${T} M${L.X_DHW_C-VX} ${B} V ${R}"/>
      <path class="pipe" id="pipe-dhw-in" d="M${L.X_DHW_C-VX} ${F} V ${T}"/>
      <path class="pipe" id="pipe-dhw-out" d="M${L.X_DHW_C-VX} ${B} V ${R}"/>
      <path class="flowdots" id="dots-dhw" d="M${L.X_DHW_C-VX} ${F} V ${T}"/>
      <path class="flowdots" id="dots-dhw2" d="M${L.X_DHW_C-VX} ${B} V ${R}"/>

      <!-- Innenraum hinter der Tuer -->
      <g id="unit-innen">
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="#080C12" stroke="#33415A" stroke-width="2"/>
        <rect x="56" y="${L.UNIT_TOP+16}" width="268" height="608" rx="10" fill="none" stroke="#1C2533" stroke-width="1.5"/>
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

        <g id="tuer-knopf" class="tuer-knopf" transform="translate(312 ${L.UNIT_TOP+612})" role="button" tabindex="0">
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

      ${(()=>{let rand=L.W-VX-10,w=clamp(Number(this._config.history_width)||450,250,Math.min(700,rand-700));return this._verlaufAlsKnopf()?this._diaKnoepfe(rand-w,84-LUFT+8,w):this._verlaufRahmen(rand-w,84-LUFT,w,144)})()}


      <!-- SG Ready, PV Leistung, Leistung, Verbrauch - zentriert zwischen VL und RL -->
      <!-- Als Gruppe zusammengefasst, damit sie im Hochformat als Ganzes
           neben die Waermepumpe gestellt werden kann. -->
      <g id="kennzahlen">
      <g id="sg-group" opacity="0">
        <text class="sg-label" x="${L.X_COL}" y="${F+60}" text-anchor="middle">SG Ready</text>
        <g transform="translate(${L.X_COL} ${F+90})">
          <rect x="-68" y="0" width="32" height="11" rx="5.5" id="sg-seg-1" fill="#3A4658"/>
          <rect x="-34" y="0" width="32" height="11" rx="5.5" id="sg-seg-2" fill="#3A4658"/>
          <rect x="2" y="0" width="32" height="11" rx="5.5" id="sg-seg-3" fill="#3A4658"/>
          <rect x="36" y="0" width="32" height="11" rx="5.5" id="sg-seg-4" fill="#3A4658"/>
        </g>
        <text class="sg-value" id="sg-text" x="${L.X_COL}" y="${F+130}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F+150}" x2="510" y2="${F+150}" stroke="#55657F" stroke-width="1"/>
      </g>

      <!-- PV Leistung -->
      <g id="pv-group" opacity="0">
        <text class="sg-label" id="pv-label" x="${L.X_COL}" y="${F+190}" text-anchor="middle">${this._t("pv_ueberschuss")}</text>
        <text class="pv-value" id="pv-v" x="${L.X_COL}" y="${F+228}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F+245}" x2="510" y2="${F+245}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="verbrauch-group" opacity="0">
        <text class="sg-label" x="${L.X_COL}" y="${F+285}" text-anchor="middle">${this._t("leistung")}</text>
        <text class="verbrauch-v" id="power-now-v" x="${L.X_COL}" y="${F+323}"
              text-anchor="middle">--</text>
        <line x1="380" y1="${F+340}" x2="510" y2="${F+340}" stroke="#55657F" stroke-width="1"/>
        <text class="sg-label" id="energy-label" x="${L.X_COL}" y="${F+380}"
              text-anchor="middle">--</text>
        <text class="unit-value" id="energy-today-v" x="${L.X_COL}" y="${F+420}"
              text-anchor="middle">--</text>
      </g>
      </g>

      <!-- Vorlauf am Ausgang, Rücklauf am Eingang -->
      <!-- Die Beschriftung liegt auf der Leitung und unterbricht sie,
           damit sie ohne Suchen der Leitung zugeordnet werden kann. -->
      <g id="vl-schild">
        <rect x="${410-schildBreite("Vorlauf",80)/2}" y="${F-13}" width="${schildBreite("Vorlauf",80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="410" y="${F+5}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="410" y="${F-24}"
            text-anchor="middle">--</text>
      <g id="rl-schild">
        <rect x="${410-schildBreite("Rücklauf",80)/2}" y="${R-13}" width="${schildBreite("Rücklauf",80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="410" y="${R+5}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="410" y="${R+40}"
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

      ${this._hatPuffer()?`
      <!-- Heizungspuffer -->
      <g id="buffer-group">
        <rect x="${L.X_BUF}" y="${T}" width="190" height="350" rx="26"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <rect x="548" y="298" width="174" height="334" rx="20" fill="url(#bufferFill)"/>
        <g clip-path="url(#bufClip)">${this._bubbles("buf-bubbles",548,298,174,334)}</g>
        <rect x="548" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        <text class="value-l" id="buf-v" x="${L.X_BUF_C}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="buf-sp" x="${L.X_BUF_C}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="buf-delta" x="${L.X_BUF_C}" y="482" text-anchor="middle"></text>
        <g id="roomheater-badge" class="badge" transform="translate(${L.X_BUF_C} 604)">
          <rect x="${-abzeichenBreite(this._t("heizstab"))/2}" y="-15" width="${abzeichenBreite(this._t("heizstab"))}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>
        <g id="buf-name"><rect x="${L.X_BUF_C-schildBreite(this._name("label_buffer"),150)/2}" y="305"
              width="${schildBreite(this._name("label_buffer"),150)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${L.X_BUF_C}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(this._name("label_buffer"))}</text></g>
      </g>
      `:""}

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
      ${this._circuitKlassisch(1,L.X_HK1_A,L.X_HK1_B,L.X_HK1_DROP,L.X_HK1_BACK)}
      ${hk2?this._circuitKlassisch(2,L.X_HK2_A,L.X_HK2_B,L.X_HK2_DROP,L.X_HK2_BACK):""}
      </g>

      <!-- Dreiwegeventil an der Abzweigung: hier teilt sich der Vorlauf
           nach unten in den Puffer oder weiter nach rechts zum Speicher. -->
      <g>
        <circle cx="630" cy="${F}" r="22" fill="#0D1219"
                stroke="#33415A" stroke-width="2"/>
        <!-- Der Pfeil zeigt, wohin das Ventil geoeffnet ist. -->
        <g id="valve-arrow-heiz" opacity="0">
          <path id="valve-heiz-line" d="M630 ${F-12} V ${F+4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-heiz-head" d="M622 ${F+2} L 630 ${F+14} L 638 ${F+2} Z"
                fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-ww" opacity="0">
          <path id="valve-ww-line" d="M618 ${F} H 634"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-ww-head" d="M632 ${F-8} L 644 ${F} L 632 ${F+8} Z"
                fill="${NEUTRAL}"/>
        </g>
        <text class="cap-s" x="630" y="${F-58}" text-anchor="middle">${this._t("umschaltventil")}</text>
        <text class="value-s" id="valve-v" x="630" y="${F-34}"
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
        <g clip-path="url(#dhwClip)">${this._bubbles("dhw-bubbles",1438,298,174,334)}</g>
        <rect x="1438" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        <text class="value-l" id="dhw-v" x="${L.X_DHW_C}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="dhw-sp" x="${L.X_DHW_C}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="dhw-delta" x="${L.X_DHW_C}" y="482" text-anchor="middle"></text>
        <g id="dhwforce-badge" class="badge" transform="translate(${L.X_DHW_C} 536)">
          <rect x="${-abzeichenBreite(this._t("aufheizen"))/2}" y="-15" width="${abzeichenBreite(this._t("aufheizen"))}" height="30" rx="15"
                fill="#08243A" stroke="#3B9BE0" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("aufheizen")}</text>
        </g>
        <g id="sterilization-badge" class="badge" transform="translate(${L.X_DHW_C} 570)">
          <rect x="${-abzeichenBreite(this._t("legionellen"))/2}" y="-15" width="${abzeichenBreite(this._t("legionellen"))}" height="30" rx="15"
                fill="#2B1240" stroke="#A855F7" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("legionellen")}</text>
        </g>
        <g id="dhwheater-badge" class="badge" transform="translate(${L.X_DHW_C} 604)">
          <rect x="${-abzeichenBreite(this._t("heizstab"))/2}" y="-15" width="${abzeichenBreite(this._t("heizstab"))}" height="30" rx="15"
                fill="#3A1B08" stroke="#E0762E" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${this._t("heizstab")}</text>
        </g>
        <g id="dhw-name"><rect x="${L.X_DHW_C-schildBreite(this._name("label_dhw"),150)/2}" y="305"
              width="${schildBreite(this._name("label_dhw"),150)}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${L.X_DHW_C}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(this._name("label_dhw"))}</text></g>
      </g>

    </svg>`},_circuitKlassisch(n,x1,x2,dropX,backX){let RT=L.RAD_TOP,BT=RT,BB=RT+92,tx=Math.round((x1+backX-9)/2),drop=`M${dropX} ${L.SEC_FLOW} V ${BT-9}`,pumpY=Math.round((L.SEC_FLOW+RT)/2),back=`M${backX} ${BB} V ${L.SEC_RET}`,koerper=this._heizkoerper(n,x1+14,x2-14,BT,BB,{x:dropX,y:BT,seite:"oben"},{x:backX,y:BB,seite:"unten"});return`
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
        <text class="value-s" id="hk${n}-pump-v" x="${dropX+34}" y="${pumpY+6}"
              text-anchor="start">--</text>

        <g id="hk${n}-rad">${koerper}
        </g>

        <g id="hk${n}-name">
          <text class="cap" x="${tx}" y="${BB+26}" text-anchor="middle">${escapeHtml(this._name(`label_hk${n}`))}</text>
        </g>
        <g id="hk${n}-tag">
          <text class="tag-v hk-wert" id="hk${n}-water-v" x="${tx}" y="${BB+54}" text-anchor="middle">--</text>
        </g>
      </g>`}};var grafikQuerKarte={_svg(){return this._config.layout==="hoch"?this._svgHoch():this._config.layout==="klassisch"?this._svgQuerKlassisch():this._svgQuer()},_defs(){return`      <defs>
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
      </defs>`},_querMasse(){let puffer=this._hatPuffer(),quellen=this._quellen(),XW=615,ZIRK_X=760,XB=null;puffer&&(XB=quellen.length?1087:900);let BL=XB===null?null:XB-95,BR=XB===null?null:XB+95,ZX0=puffer?BR+45:900,PRESS_X=790,spalten=this._hkAnzahl()>2?2:1,ZX1=spalten===2?1640:ZX0+200,W=ZX1+10;return{puffer,quellen,XW,ZIRK_X,XB,BL,BR,ZX0,ZX1,W,spalten,PRESS_X}},_quellen(){if(!this._hatPuffer())return[];let v=this._config.extra_heat;return v==="kamin"?["kamin"]:v==="solar"?["solar"]:v==="beide"?["kamin","solar"]:[]},_hkAnzahl(){return clamp(parseInt(this._config.hk_count,10)||2,1,4)},_svgQuer(){let fans=this._config.fan_count===2?`${this._fan("fan1",190,360,96)}${this._fan("fan2",190,608,96)}`:this._fan("fan1",190,480,120),F=L.FLOW_Y,R=L.RET_Y,T=L.TANK_TOP,B=L.TANK_BOTTOM,M=this._querMasse(),{XW,XB,ZIRK_X}=M,PUMP_X=Math.round((450+XW)/2),zone=this._heizkreisZone(M),vlEnde=M.puffer?XB:zone.vorl,rlEnde=M.puffer?XB:zone.rueck,tank=(id,cx,fill,inhalt)=>{let x=cx-95;return`
        <rect x="${x}" y="${T}" width="190" height="350" rx="26"
              fill="#0D1219" stroke="#33415A" stroke-width="2"/>
        <clipPath id="${id}Clip"><rect x="${x+8}" y="298" width="174" height="334" rx="20"/></clipPath>
        <rect x="${x+8}" y="298" width="174" height="334" rx="20" fill="url(#${fill})"/>
        <g clip-path="url(#${id}Clip)">${this._bubbles(`${id}-bubbles`,x+8,298,174,334)}</g>
        <rect x="${x+8}" y="298" width="174" height="334" rx="20" fill="url(#glass)"/>
        ${inhalt}`},schild=(cx,schluessel)=>{let b=schildBreite(this._name(schluessel),150);return`<rect x="${cx-b/2}" y="305" width="${b}" height="30" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1" opacity="0.5"/>
        <text class="cap" x="${cx}" y="320" text-anchor="middle" dominant-baseline="middle">${escapeHtml(this._name(schluessel))}</text>`},badge=(id,cx,y,fill,stroke,text)=>`
        <g id="${id}" class="badge" transform="translate(${cx} ${y})">
          <rect x="${-abzeichenBreite(text)/2}" y="-15" width="${abzeichenBreite(text)}" height="30" rx="15"
                fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
          <text class="badge-t" x="0" y="5" text-anchor="middle">${text}</text>
        </g>`;return`
    <svg viewBox="0 ${80-LUFT} ${M.W} ${L.H+LUFT}" class="lhc-svg" role="img"
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
      ${M.puffer?`
      <path class="pipe-shell" d="M${XB} ${F} V ${T} M${XB} ${B} V ${R}"/>
      <path class="pipe" id="pipe-buf-in" d="M${XB} ${F} V ${T}"/>
      <path class="pipe" id="pipe-buf-out" d="M${XB} ${B} V ${R}"/>
      <path class="flowdots" id="dots-buf" d="M${XB} ${F} V ${T}"/>
      <path class="flowdots" id="dots-buf2" d="M${XB} ${B} V ${R}"/>`:""}

      ${zone.rohre}
      ${this._quellenMarkup(M)}

      <!-- Innenraum hinter der Tuer -->
      <g id="unit-innen">
        <rect x="40" y="${L.UNIT_TOP}" width="300" height="640" rx="16" fill="#080C12" stroke="#33415A" stroke-width="2"/>
        <rect x="56" y="${L.UNIT_TOP+16}" width="268" height="608" rx="10" fill="none" stroke="#1C2533" stroke-width="1.5"/>
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

        <g id="tuer-knopf" class="tuer-knopf" transform="translate(312 ${L.UNIT_TOP+612})" role="button" tabindex="0">
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

      ${(()=>{let rand=M.W-10,links=this._verlaufAlsKnopf()?450:700,w=clamp(Number(this._config.history_width)||450,250,Math.min(700,rand-links));return this._verlaufAlsKnopf()?this._diaKnoepfe(rand-w,84-LUFT+8,w):this._verlaufRahmen(rand-w,84-LUFT,w,144)})()}

      ${this._kennzahlenQuer(F)}

      <!-- Vorlauf am Ausgang, Rücklauf am Eingang -->
      <g id="vl-schild">
        <rect x="${410-schildBreite("Vorlauf",80)/2}" y="${F-13}" width="${schildBreite("Vorlauf",80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s vl-cap" x="410" y="${F+5}" text-anchor="middle">${this._t("vorlauf")}</text>
      </g>
      <text class="vl-value" id="unit-flow-v" x="410" y="${F-24}"
            text-anchor="middle">--</text>
      <g id="rl-schild">
        <rect x="${410-schildBreite("Rücklauf",80)/2}" y="${R-13}" width="${schildBreite("Rücklauf",80)}" height="26" rx="8"
              fill="#0D1219" stroke="#33415A" stroke-width="1"/>
        <text class="cap-s rl-cap" x="410" y="${R+5}" text-anchor="middle">${this._t("ruecklauf")}</text>
      </g>
      <text class="rl-value" id="unit-ret-v" x="410" y="${R+40}"
            text-anchor="middle">--</text>

      <!-- Primärpumpe -->
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
        <path class="pipe-shell duenn" fill="none" d="M${XW+95} 330 H ${ZIRK_X} V 620 H ${XW+95}"/>
        <path class="pipe duenn" id="pipe-zirk-v" fill="none" d="M${XW+95} 330 H ${ZIRK_X} V 620 H ${XW+95}"/>
        <path class="flowdots duenn" id="dots-zirk-h1" fill="none" d="M${XW+95} 330 H ${ZIRK_X}"/>
        <path class="flowdots duenn" id="dots-zirk-v" fill="none" d="M${ZIRK_X} 330 V 620"/>
        <path class="flowdots duenn" id="dots-zirk-h2" fill="none" d="M${ZIRK_X} 620 H ${XW+95}"/>
        <g transform="translate(${ZIRK_X} 475)">
          <circle r="16" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="zirk-rotor">
            <path id="zirk-blade" d="M0 -9 L3 -2 L10 0 L3 2 L0 9 L-3 2 L-10 0 L-3 -2 Z" fill="#55637A"/>
            <circle r="3" fill="#0D1219"/>
          </g>
        </g>
        <text class="cap-s" id="zirk-name" x="${ZIRK_X-26}" y="475" text-anchor="middle"
              dominant-baseline="middle" transform="rotate(-90 ${ZIRK_X-26} 475)">${this._t("zirkulation")}</text>
        <text class="value-s" id="zirk-v" x="${ZIRK_X}" y="318" text-anchor="middle" opacity="0">--</text>
      </g>

      <!-- Warmwasserspeicher -->
      <g id="dhw-group">
        ${tank("dhw",XW,"dhwFill",`
        <text class="value-l" id="dhw-v" x="${XW}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="dhw-sp" x="${XW}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="dhw-delta" x="${XW}" y="482" text-anchor="middle"></text>
        ${badge("dhwforce-badge",XW,536,"#08243A","#3B9BE0",this._t("aufheizen"))}
        ${badge("sterilization-badge",XW,570,"#2B1240","#A855F7",this._t("legionellen"))}
        ${badge("dhwheater-badge",XW,604,"#3A1B08","#E0762E",this._t("heizstab"))}
        <g id="dhw-name">${schild(XW,"label_dhw")}</g>`)}
      </g>

      ${M.puffer?`
      <!-- Heizungspuffer -->
      <g id="buffer-group">
        ${tank("buf",XB,"bufferFill",`
        <text class="value-l" id="buf-v" x="${XB}" y="430" text-anchor="middle">--</text>
        <text class="value-sp" id="buf-sp" x="${XB}" y="458" text-anchor="middle"></text>
        <text class="value-sp" id="buf-delta" x="${XB}" y="482" text-anchor="middle"></text>
        ${badge("roomheater-badge",XB,604,"#3A1B08","#E0762E",this._t("heizstab"))}
        <g id="buf-name">${schild(XB,"label_buffer")}</g>`)}
      </g>`:""}

      <!-- Wasserdruck auf dem Ruecklauf -->
      <g id="press-group" opacity="0">
        <text class="cap-s" x="${M.PRESS_X}" y="662" text-anchor="middle">${this._t("druck")}</text>
        <g id="press-warn" opacity="0" transform="translate(${M.PRESS_X+44} 742)">
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
          <path id="valve-ww-line" d="M${XW} ${F-12} V ${F+4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-ww-head" d="M${XW-8} ${F+2} L ${XW} ${F+14} L ${XW+8} ${F+2} Z"
                fill="${NEUTRAL}"/>
        </g>
        <g id="valve-arrow-heiz" opacity="0">
          <path id="valve-heiz-line" d="M${XW-12} ${F} H ${XW+4}"
                stroke="${NEUTRAL}" stroke-width="5" stroke-linecap="round" fill="none"/>
          <path id="valve-heiz-head" d="M${XW+2} ${F-8} L ${XW+14} ${F} L ${XW+2} ${F+8} Z"
                fill="${NEUTRAL}"/>
        </g>
        <text class="cap-s" x="${XW}" y="${F-58}" text-anchor="middle">${this._t("umschaltventil")}</text>
        <text class="value-s" id="valve-v" x="${XW}" y="${F-34}"
              text-anchor="middle">--</text>
      </g>
    </svg>`},_modusSymbole(){return`
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
        </g>`},_kennzahlenQuer(F){let MX=(340+this._querMasse().XW-95)/2;return`
      <g id="kennzahlen">
      <g id="sg-group" opacity="0">
        <text class="sg-label" x="${MX}" y="${F+60}" text-anchor="middle">SG Ready</text>
        <g transform="translate(${MX} ${F+90})">
          <rect x="-68" y="0" width="32" height="11" rx="5.5" id="sg-seg-1" fill="#3A4658"/>
          <rect x="-34" y="0" width="32" height="11" rx="5.5" id="sg-seg-2" fill="#3A4658"/>
          <rect x="2" y="0" width="32" height="11" rx="5.5" id="sg-seg-3" fill="#3A4658"/>
          <rect x="36" y="0" width="32" height="11" rx="5.5" id="sg-seg-4" fill="#3A4658"/>
        </g>
        <text class="sg-value" id="sg-text" x="${MX}" y="${F+130}"
              text-anchor="middle">--</text>
        <line x1="${MX-65}" y1="${F+150}" x2="${MX+65}" y2="${F+150}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="pv-group" opacity="0">
        <text class="sg-label" id="pv-label" x="${MX}" y="${F+190}" text-anchor="middle">${this._t("pv_ueberschuss")}</text>
        <text class="pv-value" id="pv-v" x="${MX}" y="${F+228}"
              text-anchor="middle">--</text>
        <line x1="${MX-65}" y1="${F+245}" x2="${MX+65}" y2="${F+245}" stroke="#55657F" stroke-width="1"/>
      </g>
      <g id="verbrauch-group" opacity="0">
        <text class="sg-label" x="${MX}" y="${F+285}" text-anchor="middle">${this._t("leistung")}</text>
        <text class="verbrauch-v" id="power-now-v" x="${MX}" y="${F+323}"
              text-anchor="middle">--</text>
        <line x1="${MX-65}" y1="${F+340}" x2="${MX+65}" y2="${F+340}" stroke="#55657F" stroke-width="1"/>
        <text class="sg-label" id="energy-label" x="${MX}" y="${F+380}"
              text-anchor="middle">--</text>
        <text class="unit-value" id="energy-today-v" x="${MX}" y="${F+420}"
              text-anchor="middle">--</text>
      </g>
      </g>`},_heizkreisZone(M){let n=this._hkAnzahl(),spalten=M.spalten,zeilen=Math.ceil(n/spalten),zw=(M.ZX1-M.ZX0)/spalten,w=Math.min(zw-36,140),h=Math.round(w*.55),zeile=70+h+96,VLY=305,vorl=M.ZX0-10,rueck=M.ZX0-26,F=L.FLOW_Y,R=L.RET_Y,kreise="",leitungen="",punkte="",aeste=[],ruecks=[];for(let i=0;i<n;i++){let nr=i+1,sp=i%spalten,ze=Math.floor(i/spalten),x0=M.ZX0+sp*zw,ast=VLY+ze*zeile,a=Math.round(x0+(zw-w)/2+4),b=a+w,top=ast+40,unten=top+h,fbh=this._heizStil(nr)==="fbh",dx=fbh?a-6:a+18,bx=fbh?b+6:b-18;aeste.push(ast),ruecks.push(unten+14);let zu=`M${vorl} ${ast} H ${dx} V ${top}`,ab=zeilen>1&&ze===0?`M${bx} ${unten} V ${unten+14} H ${vorl+7} A 7 7 0 0 0 ${vorl-7} ${unten+14} H ${rueck}`:`M${bx} ${unten} V ${unten+14} H ${rueck}`,tx=(a+b)/2;leitungen+=`
        <path class="pipe-shell duenn" d="${zu} ${ab}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-in" d="${zu}"/>
        <path class="pipe duenn" id="pipe-hk${nr}-out" d="${ab}"/>`,punkte+=`
        <path class="flowdots duenn" id="dots-hk${nr}" d="${zu}"/>
        <path class="flowdots duenn" id="dots-hk${nr}b" d="${ab}"/>`,kreise+=`
      <g class="circuit" id="hk${nr}-group">
        <g transform="translate(${dx} ${ast+20})">
          <circle r="15" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="hk${nr}-rotor">
            <path id="hk${nr}-blade" d="M0 -8 L2.5 -2 L9 0 L2.5 2 L0 8 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#55637A"/>
            <circle r="2.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="hk${nr}-pump-v" x="${dx+22}" y="${ast+25}" text-anchor="start">--</text>
        <g id="hk${nr}-rad">${this._heizkoerper(nr,a,b,top,unten,{x:dx,y:top,seite:"oben"},{x:bx,y:unten,seite:"unten"})}
        </g>
        <g id="hk${nr}-name">
          <text class="cap" x="${tx}" y="${unten+36}" text-anchor="middle">${escapeHtml(this._name(`label_hk${nr}`))}</text>
        </g>
        <g id="hk${nr}-tag">
          <text class="tag-v hk-wert" id="hk${nr}-water-v" x="${tx}" y="${unten+62}" text-anchor="middle">--</text>
        </g>
      </g>`}let letzterAst=Math.max(...aeste),r1=ruecks[0],r2=zeilen>1?ruecks[spalten]:null,punkteSammel,vlPfad,rlPfad;if(M.puffer){let RLY=zeilen>1?600:470;vlPfad=`M${M.BR} ${VLY} H ${vorl} V ${letzterAst}`;let teile=ruecks.map(y=>`M${rueck} ${y} V ${RLY}`);rlPfad=`${[...new Set(teile)].join(" ")} M${rueck} ${RLY} H ${M.BR}`,punkteSammel=`
      <path class="flowdots duenn" id="dots-sf-a" d="M${M.BR} ${VLY} H ${vorl}"/>
      ${zeilen>1?`<path class="flowdots duenn" id="dots-sf-z2" d="M${vorl} ${VLY} V ${letzterAst}"/>`:""}
      <path class="flowdots duenn" id="dots-sr-z1" d="M${rueck} ${r1} V ${RLY}"/>
      ${zeilen>1?`<path class="flowdots duenn" id="dots-sr-z2" d="M${rueck} ${r2} V ${RLY}"/>`:""}
      <path class="flowdots duenn" id="dots-sr-a" d="M${rueck} ${RLY} H ${M.BR}"/>`}else vlPfad=`M${vorl} ${F} V ${letzterAst}`,rlPfad=`M${rueck} ${Math.min(...ruecks)} V ${R}`,punkteSammel=`
      <path class="flowdots duenn" id="dots-sf-a" d="M${vorl} ${F} V ${VLY}"/>
      ${zeilen>1?`<path class="flowdots duenn" id="dots-sf-z2" d="M${vorl} ${VLY} V ${letzterAst}"/>`:""}
      ${zeilen>1?`<path class="flowdots duenn" id="dots-sr-z1" d="M${rueck} ${r1} V ${r2}"/>`:""}
      <path class="flowdots duenn" id="dots-sr-a" d="M${rueck} ${zeilen>1?r2:r1} V ${R}"/>`;let rohre=`
      <!-- Sammelleitungen der Heizkreise -->
      <path class="pipe-shell duenn" d="${vlPfad} ${rlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-flow" d="${vlPfad}"/>
      <path class="pipe duenn" id="pipe-sec-ret" d="${rlPfad}"/>`;return kreise=`
      <!-- Leitungen der Heizkreise -->${leitungen}
      <!-- Laufpunkte der Sammelleitungen und Heizkreise -->${punkteSammel}${punkte}
${kreise}`,{rohre,kreise,vorl,rueck}},_quellenMarkup(M){if(!M.quellen.length)return"";let lagen=M.quellen.length===2?[350,555]:[430],cx=M.BL-122;return M.quellen.map((art,i)=>{let yc=lagen[i],kante=y=>art==="kamin"?cx+40:this._solarKante(cx,yc,y),vl=`M${kante(yc-18)} ${yc-18} H ${M.BL}`,rl=`M${M.BL} ${yc+18} H ${kante(yc+18)}`,ly=yc+(art==="kamin"?80:72);return`
      <g class="quelle" id="${art}-group">
        <path class="pipe-shell duenn" d="${vl} ${rl}"/>
        <path class="pipe duenn" id="pipe-${art}-vl" d="${vl}"/>
        <path class="pipe duenn" id="pipe-${art}-rl" d="${rl}"/>
        <path class="flowdots duenn" id="dots-${art}" d="${vl}"/>
        <path class="flowdots duenn" id="dots-${art}b" d="${rl}"/>
        <g transform="translate(${M.BL-30} ${yc+18})">
          <circle r="15" fill="#0D1219" stroke="#33415A" stroke-width="2"/>
          <g class="rotor" id="${art}-rotor">
            <path id="${art}-blade" d="M0 -8 L2.5 -2 L9 0 L2.5 2 L0 8 L-2.5 2 L-9 0 L-2.5 -2 Z" fill="#55637A"/>
            <circle r="2.5" fill="#0D1219"/>
          </g>
        </g>
        <text class="value-s" id="${art}-pump-v" x="${M.BL-30}" y="${yc+52}" text-anchor="middle">--</text>
        ${art==="kamin"?this._kaminBild(cx,yc):this._solarBild(cx,yc)}
        <text class="cap" id="${art}-name" x="${cx}" y="${ly}" text-anchor="middle">${this._t(art==="kamin"?"kamin":"solarthermie")}</text>
        <text class="tag-v hk-wert" id="${art}-v" x="${cx}" y="${ly+26}" text-anchor="middle">--</text>
      </g>`}).join("")},_kaminBild(cx,yc){let x=cx-40,t2=yc-46,fx=x+9,fy=t2+9,boden=fy+56;return`
        <rect x="${cx-9}" y="${t2-16}" width="18" height="18" fill="#26303F" stroke="#33415A" stroke-width="2"/>
        <rect x="${x}" y="${t2}" width="80" height="106" rx="10" fill="#161D28" stroke="#33415A" stroke-width="2"/>
        <rect x="${fx}" y="${fy}" width="62" height="58" rx="6" fill="#0B1017" stroke="#46536A" stroke-width="1.5"/>
        <g id="kamin-schein" opacity="0">
          <rect x="${fx+1}" y="${fy+1}" width="60" height="56" rx="5" fill="#2A1408"/>
          <ellipse id="kamin-glut" cx="${cx}" cy="${boden-14}" rx="26" ry="18" fill="#FF8A3D" opacity="0.3"/>
        </g>
        <rect x="${cx-24}" y="${boden-9}" width="48" height="8" rx="4" fill="#6B4A2E" stroke="#3E2A1A" stroke-width="1"/>
        <rect x="${cx-18}" y="${boden-16}" width="36" height="8" rx="4" fill="#7A5534" stroke="#3E2A1A" stroke-width="1"
              transform="rotate(-8 ${cx} ${boden-12})"/>
        <circle cx="${cx-24}" cy="${boden-5}" r="3.6" fill="#A47B52"/>
        <circle cx="${cx+24}" cy="${boden-5}" r="3.6" fill="#A47B52"/>
        <g id="kamin-flamme" opacity="0" transform="translate(${cx} ${boden-7}) scale(0.82)">
          <g id="kamin-feuer">
            <path d="M-2 0 c-20 -6 -20 -26 -6 -42 c0 12 10 14 9 3 c10 10 16 28 -3 39 Z" fill="#FF6B2E"/>
            <path d="M12 0 c-10 -4 -10 -16 -2 -26 c0 8 7 8 6 1 c6 8 8 18 -4 25 Z" fill="#FF8A3D"/>
            <path d="M-16 0 c-8 -4 -7 -14 0 -21 c0 7 5 7 5 2 c4 7 4 14 -5 19 Z" fill="#FF8A3D"/>
            <path d="M0 0 c-9 -3 -9 -14 -1 -22 c1 7 6 7 5 1 c5 7 5 15 -4 21 Z" fill="#FFC44D"/>
            <path d="M0 0 c-4 -2 -4 -7 0 -11 c1 4 3 4 3 0 c2 4 2 8 -3 11 Z" fill="#FFF1B8"/>
          </g>
        </g>
        <rect x="${fx}" y="${t2+74}" width="62" height="24" rx="5" fill="#0F151E" stroke="#26303F" stroke-width="1.5"/>
        <line x1="${fx+10}" y1="${t2+86}" x2="${fx+52}" y2="${t2+86}" stroke="#33415A" stroke-width="3" stroke-linecap="round"/>`},_heizStil(n){let v=this._config[`hk${n}_style`];return v==="fbh_verteiler"||v==="fbh_raum"?"fbh":v==="glieder"||v==="fbh"?v:"platte"},_istFbh(stil){return stil==="fbh"},_fbhLage(stil,a,b,top,unten){let L2=a-6,R=b+6,cx=(L2+R)/2;top=Math.max(top,unten-(R-L2)*.55);let H=unten-top,d1=Math.min((R-L2)*.22,H*.26),yC=unten-2*d1,C=[cx,yC],Lp=[L2,yC+d1],Rp=[R,yC+d1];return{L:L2,R,cx,top,d1,C,Lp,Rp,Fp:[cx,unten],pt:(u,v)=>[C[0]+u*(Rp[0]-C[0])+v*(Lp[0]-C[0]),C[1]+u*(Rp[1]-C[1])+v*(Lp[1]-C[1])],vy:Rp[1],ry:Lp[1]}},_fbhWaerme(n,x0,x1,y,anzahl){let w="";for(let i=0;i<anzahl;i++){let x=x0+(i+.5)*(x1-x0)/anzahl;w+=`<path d="M${x.toFixed(1)} ${y} q4 -5 0 -10 q-4 -5 0 -10" fill="none" stroke="#FFB070" stroke-width="2" stroke-linecap="round"/>`}return`<g id="hk${n}-waerme" opacity="0">${w}</g>`},_fbhBild(n,stil,a,b,top,unten,ein,aus){let fill=`url(#rad${n}Fill)`,g=this._fbhLage(stil,a,b,top,unten),{L:L2,R,cx,C,Lp,Rp,Fp,pt,d1}=g;top=g.top;let f=p=>`${p[0].toFixed(1)} ${p[1].toFixed(1)}`,wandL=`M${f([cx,top])} L${f(C)} L${f(Lp)} L${f([L2,top+d1])} Z`,wandR=`M${f([cx,top])} L${f(C)} L${f(Rp)} L${f([R,top+d1])} Z`,boden=`M${f(C)} L${f(Rp)} L${f(Fp)} L${f(Lp)} Z`,bahnen=5,schlange=`M${f(Lp)} L${f(pt(.1,.9))}`;for(let i=0;i<bahnen;i++){let u=.1+i*.8/(bahnen-1),[v0,v1]=i%2?[.12,.9]:[.9,.12];schlange+=` L${f(pt(u,v0))} L${f(pt(u,v1))}`}schlange+=` L${f(Rp)}`;let vonRechts=ein.seite==="rechts",S=vonRechts?Rp:Lp,E=vonRechts?Lp:Rp,zu=ein.seite==="oben"?`M${ein.x} ${top} H ${S[0].toFixed(1)} V ${S[1].toFixed(1)}`:`M${ein.x} ${S[1].toFixed(1)} H ${S[0].toFixed(1)}`,ab=aus.seite==="unten"?`M${f(E)} H ${aus.x} V ${unten}`:`M${f(E)} H ${aus.x}`,rohr=(d,breite)=>`<path d="${d}" fill="none" stroke="${fill}" stroke-width="${breite}" stroke-linecap="round" stroke-linejoin="round"/>`,mitte=pt(.5,.5);return`
          <path d="${wandL}" fill="#1E2836" stroke="#33415A" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="${wandR}" fill="#232C3A" stroke="#33415A" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="${boden}" fill="#3A4658" stroke="#55637A" stroke-width="1.5" stroke-linejoin="round"/>
          ${rohr(`${zu} ${schlange} ${ab}`,2.6)}
          ${this._fbhWaerme(n,mitte[0]-26,mitte[0]+26,mitte[1]-2,3)}`},_heizkoerper(n,a,b,top,unten,ein,aus){let stil=this._heizStil(n),fill=`url(#rad${n}Fill)`;if(stil==="glieder"){let anzahl=Math.floor((b-a-4+5)/19),off=a+Math.round((b-a-(anzahl*19-5))/2),glieder="";for(let i=0;i<anzahl;i++)glieder+=`<rect x="${off+i*19}" y="${top+4}" width="14" height="${unten-top-8}" rx="7"/>`;return`
          <rect x="${a-2}" y="${top+12}" width="${b-a+4}" height="8" rx="4" fill="#33415A"/>
          <rect x="${a-2}" y="${unten-20}" width="${b-a+4}" height="8" rx="4" fill="#33415A"/>
          <g fill="${fill}" stroke="#0D1219" stroke-width="1.5">${glieder}</g>`}if(this._istFbh(stil))return this._fbhBild(n,stil,a,b,top,unten,ein,aus);let profil="";for(let x=a+8;x<b-4;x+=9)profil+=`<line x1="${x}" y1="${top+16}" x2="${x}" y2="${unten-6}"/>`;let schlitze="";for(let x=a+10;x<b-8;x+=12)schlitze+=`<rect x="${x}" y="${top+4}" width="6" height="5" rx="1"/>`;return`
          <rect x="${a}" y="${top}" width="${b-a}" height="${unten-top}" rx="6"
                fill="${fill}" stroke="#33415A" stroke-width="2"/>
          <g stroke="#0D1219" stroke-width="3" opacity="0.28">${profil}</g>
          <rect x="${a+2}" y="${top+2}" width="${b-a-4}" height="11" rx="4" fill="#0D1219" opacity="0.35"/>
          <g fill="#0D1219" opacity="0.5">${schlitze}</g>
          <rect x="${a}" y="${top}" width="${b-a}" height="${unten-top}" rx="6" fill="url(#glass)"/>`},_bubbles(id,x,y,w,h,anzahl){let n=anzahl||BUBBLE_COUNT,zufall=1,naechste=()=>(zufall=(zufall*1103515245+12345)%2147483648,zufall/2147483648),kreise="";for(let i=0;i<n;i++){let cx=Math.round(x+10+naechste()*(w-20)),r=(1.6+naechste()*2.4).toFixed(1);naechste(),naechste();let bubbleId=`${id}-bubble-${i}`;kreise+=`<circle class="bubble" id="${bubbleId}" cx="${cx}" cy="${y+h-4}" r="${r}" opacity="0"/>`}return`<g id="${id}">${kreise}</g>`},_fan(id,cx,cy,r){let blades="";for(let i=0;i<5;i++)blades+=`<path d="M0 0 C ${r*.34} ${-r*.3}, ${r*.8} ${-r*.26}, ${r*.92} ${r*.06} C ${r*.62} ${r*.3}, ${r*.22} ${r*.26}, 0 0 Z"
        transform="rotate(${360/5*i})"/>`;return`
      <g transform="translate(${cx} ${cy})">
        <circle r="${r+10}" fill="#0B1017" stroke="#33415A" stroke-width="2"/>
        <circle r="${r+2}" fill="none" stroke="#1E2836" stroke-width="6"/>
        <g class="rotor" id="${id}">
          <g class="blades">${blades}</g>
          <circle r="${r*.17}" fill="#2B3546"/>
        </g>
        <g stroke="#2A3446" stroke-width="1.5" fill="none" opacity="0.55">
          <circle r="${r*.4}"/><circle r="${r*.65}"/><circle r="${r*.9}"/>
        </g>
        <text class="value-s" id="${id}-rpm" y="${r+30}" text-anchor="middle">--</text>
      </g>`}};var heizkurveKarte={_kurveBild(z){let striche=(n,pre,waag)=>[...Array(n).keys()].map(i=>`
        <line id="kd${z}-g${pre}${i}" ${waag?'x1="62" x2="406" y1="0" y2="0"':'y1="18" y2="190" x1="0" x2="0"'} stroke="#212B39" stroke-width="1" opacity="0"/>
        <text class="${waag?"achse-vl":"achse-aussen"}" id="kd${z}-t${pre}${i}" ${waag?'x="54" y="0" text-anchor="end"':'y="208" x="0" text-anchor="middle"'} opacity="0">--</text>`).join("");return`
      <svg viewBox="0 0 420 230" class="lhc-kurve-svg" xmlns="http://www.w3.org/2000/svg">
        ${striche(9,"x",!1)}
        ${striche(8,"y",!0)}
        <line x1="62" y1="18" x2="62" y2="190"
              stroke="#FF8A5F" stroke-width="1.5" opacity="0.65"/>
        <line x1="62" y1="190" x2="406" y2="190"
              stroke="#6BB7E8" stroke-width="1.5" opacity="0.65"/>
        <line id="kd${z}-mx" x1="0" y1="18" x2="0" y2="190" stroke="#46C07A"
              stroke-width="2" stroke-dasharray="5 4" opacity="0"/>
        <line id="kd${z}-my" x1="62" y1="0" x2="0" y2="0" stroke="#FF8A5F"
              stroke-width="1.5" stroke-dasharray="4 4" opacity="0"/>
        <path id="kd${z}-linie" fill="none" stroke="#E8EDF4" stroke-width="3"
              stroke-linecap="round" d=""/>
        <circle id="kd${z}-e1" r="5" fill="#E8EDF4" opacity="0"/>
        <circle id="kd${z}-e2" r="5" fill="#E8EDF4" opacity="0"/>
        <text class="kurve-marke-t ist-jetzt" id="kd${z}-mxt" x="0" y="182"
              text-anchor="middle" opacity="0">--</text>
        <text class="kurve-marke-t achse-vl" id="kd${z}-myt" x="70" y="0"
              opacity="0">--</text>
        <text class="kurve-achse achse-aussen" x="${468/2}" y="226"
              text-anchor="middle">${this._t("aussen_achse")}</text>
        <text class="kurve-achse achse-vl" x="18" y="${208/2}" text-anchor="middle"
              transform="rotate(-90 18 ${208/2})">${this._t("vorlauf_achse")}</text>
      </svg>`},_kurveRegler(){setzeDezimal(dezimalFuer(this._sp()));let sr=this.shadowRoot;if(!sr)return;let zeilen=[{basis:"o_low",titel:"f_aussen_kalt",min:-20,max:15,farbe:"aussen"},{basis:"t_high",titel:"f_dann_vorlauf",min:20,max:75,farbe:"vl"},{basis:"o_high",titel:"f_aussen_warm",min:-20,max:25,farbe:"aussen"},{basis:"t_low",titel:"f_dann_vorlauf",min:20,max:75,farbe:"vl"}];[1,2].forEach(z=>{let box=sr.getElementById(`kd${z}-regler`);box&&(box.dataset.fertig||(box.innerHTML=zeilen.map((r,i)=>`
            <div class="lhc-num-kompakt ist-${r.farbe}">
              <span>${escapeHtml(this._t(r.titel))}</span>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-minus">&minus;</button>
              <output id="kd${z}-r${i}">--</output>
              <button type="button" class="lhc-step klein" id="kd${z}-r${i}-plus">+</button>
            </div>`).join(""),zeilen.forEach((r,i)=>{let feld=z===2?`curve2_${r.basis}`:`curve_${r.basis}`,stelle=richtung=>{let id=this._e(feld);if(!id)return;let ist=numState(this._quelle,id),geh=this._gehaltenerWert(id,ist),jetzt=geh!==null?geh:ist;if(jetzt===null)return;let neu=clamp(jetzt+richtung,r.min,r.max);if(neu!==jetzt){if(this._halte(id,neu),stellbar(id))this._quelle.callService(id.split(".")[0],"set_value",{entity_id:id,value:neu});else{let w=b2=>{let wid=this._e(z===2?`curve2_${b2}`:`curve_${b2}`),wist=numState(this._quelle,wid),wgeh=this._gehaltenerWert(wid,wist);return wgeh!==null?wgeh:wist},werte={t_high:w("t_high"),t_low:w("t_low"),o_high:w("o_high"),o_low:w("o_low")};if(werte[r.basis]=neu,Object.values(werte).some(v=>v===null))return;this._quelle.callService("mqtt","publish",{topic:`${this._config.mqtt_prefix||"panasonic_heat_pump"}/commands/SetCurves`,payload:JSON.stringify({[`zone${z}`]:{heat:{target:{high:werte.t_high,low:werte.t_low},outside:{high:werte.o_high,low:werte.o_low}}}})})}this._kurveRegler(),this._zeichneKurveDialog()}},m=sr.getElementById(`kd${z}-r${i}-minus`),pl=sr.getElementById(`kd${z}-r${i}-plus`);m&&m.addEventListener("click",()=>stelle(-1)),pl&&pl.addEventListener("click",()=>stelle(1))}),box.dataset.fertig="1"),zeilen.forEach((r,i)=>{let feld=z===2?`curve2_${r.basis}`:`curve_${r.basis}`,id=this._e(feld),ist=numState(this._quelle,id),geh=this._gehaltenerWert(id,ist),wert=geh!==null?geh:ist,out=sr.getElementById(`kd${z}-r${i}`);out&&(out.textContent=wert===null?"--":`${fmt(wert,0)} °C`);let kann=!!id;[`kd${z}-r${i}-minus`,`kd${z}-r${i}-plus`].forEach(kid=>{let k=sr.getElementById(kid);k&&(k.disabled=!kann)})}))})},_oeffneKurve(zone){let d=this.shadowRoot&&this.shadowRoot.getElementById("kurve-dialog");if(!d)return;this._kurveNur=zone||1;let t2=this.shadowRoot.getElementById("kurve-haupttitel");if(t2){let name=this._name(`label_hk${this._kurveNur}`);t2.textContent=`${this._t("f_heizkurve")} ${name}`}this._kurveRegler(),this._zeichneKurveDialog(),d.hidden=!1},_zeichneKurveDialog(){setzeDezimal(dezimalFuer(this._sp()));let sr=this.shadowRoot;if(!sr||!sr.getElementById("kurve-dialog"))return;let B=420,H=230,links=62,rechts=B-14,oben=18,unten=H-40,A_MIN=Number(this._config.curve_x_min),A_MAX=Number(this._config.curve_x_max),T_MIN=Number(this._config.curve_y_min),T_MAX=Number(this._config.curve_y_max);if(!(A_MAX>A_MIN)||!(T_MAX>T_MIN))return;let px=a=>links+(clamp(a,A_MIN,A_MAX)-A_MIN)/(A_MAX-A_MIN)*(rechts-links),py=t2=>unten-(clamp(t2,T_MIN,T_MAX)-T_MIN)/(T_MAX-T_MIN)*(unten-oben),schritt=(bereich,hoechstens)=>[1,2,5,10,15,20,25].find(s=>s>=bereich/hoechstens)||25,marken=(min,max,anzahl)=>{let s=schritt(max-min,anzahl),raus=[];for(let v=Math.ceil(min/s)*s;v<=max+.001;v+=s)raus.push(v);return raus},aussen=numState(this._quelle,this._e("outside_temp"));[1,2].forEach(z=>{let feld=basis=>z===2?`curve2_${basis}`:`curve_${basis}`,lies=basis=>{let id=this._e(feld(basis)),ist=numState(this._quelle,id),geh=this._gehaltenerWert(id,ist);return geh!==null?geh:ist},tHoch=lies("t_high"),tTief=lies("t_low"),aHoch=lies("o_high"),aTief=lies("o_low"),spalte=sr.getElementById(`kd${z}-linie`).closest(".lhc-kurve-spalte"),fehlt=[tHoch,tTief,aHoch,aTief].some(v=>v===null);if(spalte&&(spalte.hidden=fehlt||z===2&&this._config.hk_count<2||this._kurveNur&&this._kurveNur!==z),fehlt)return;let setz=(id,attrs,text)=>{let el=sr.getElementById(id);el&&(Object.entries(attrs||{}).forEach(([k,v])=>el.setAttribute(k,v)),text!==void 0&&(el.textContent=text))},achse=(werte,vorrat,pre,waag)=>{for(let i=0;i<vorrat;i++){let li=sr.getElementById(`kd${z}-g${pre}${i}`),tx=sr.getElementById(`kd${z}-t${pre}${i}`);if(!li||!tx)continue;if(i>=werte.length){li.setAttribute("opacity","0"),tx.setAttribute("opacity","0");continue}let v=werte[i],pos=waag?py(v):px(v);waag?(li.setAttribute("y1",pos.toFixed(1)),li.setAttribute("y2",pos.toFixed(1)),tx.setAttribute("y",(pos+4).toFixed(1))):(li.setAttribute("x1",pos.toFixed(1)),li.setAttribute("x2",pos.toFixed(1)),tx.setAttribute("x",pos.toFixed(1))),li.setAttribute("opacity","1"),tx.setAttribute("opacity","1"),tx.textContent=fmt(v,0)}};achse(marken(A_MIN,A_MAX,8),9,"x",!1),achse(marken(T_MIN,T_MAX,7),8,"y",!0);let steigung=(tTief-tHoch)/(aHoch-aTief),tBei=a=>tHoch+steigung*(a-aTief),aBei=t2=>aTief+(t2-tHoch)/steigung,a1=A_MIN,a2=A_MAX;if(steigung!==0&&(tBei(a1)>T_MAX&&(a1=aBei(T_MAX)),tBei(a1)<T_MIN&&(a1=aBei(T_MIN)),tBei(a2)<T_MIN&&(a2=aBei(T_MIN)),tBei(a2)>T_MAX&&(a2=aBei(T_MAX))),a1=clamp(a1,A_MIN,A_MAX),a2=clamp(a2,A_MIN,A_MAX),setz(`kd${z}-linie`,{d:`M${px(a1).toFixed(1)} ${py(tBei(a1)).toFixed(1)}L${px(a2).toFixed(1)} ${py(tBei(a2)).toFixed(1)}`}),setz(`kd${z}-e1`,{cx:px(aTief).toFixed(1),cy:py(tHoch).toFixed(1),opacity:"1"}),setz(`kd${z}-e2`,{cx:px(aHoch).toFixed(1),cy:py(tTief).toFixed(1),opacity:"1"}),setz(`kd${z}-titel`,{},`${this._t("heizkreis")} ${z}`),aussen===null){["mx","my","mxt","myt"].forEach(s=>setz(`kd${z}-${s}`,{opacity:"0"})),setz(`kd${z}-aussen`,{},"--"),setz(`kd${z}-soll`,{},"");return}let soll=tBei(aussen),mx=px(aussen),my=py(soll);setz(`kd${z}-mx`,{x1:mx.toFixed(1),x2:mx.toFixed(1),y1:oben,y2:unten,opacity:"0.85"}),setz(`kd${z}-my`,{x2:mx.toFixed(1),y1:my.toFixed(1),y2:my.toFixed(1),opacity:"0.6"}),setz(`kd${z}-mxt`,{x:mx.toFixed(1),opacity:"1"},`${fmt(aussen,1)} °C`),setz(`kd${z}-myt`,{y:(my-8).toFixed(1),opacity:"1"},`${fmt(soll,0)} °C`),setz(`kd${z}-aussen`,{},tf(this._t("s_aussen"),{v:fmt(aussen,1)})),setz(`kd${z}-soll`,{},tf(this._t("s_vorlauf_soll"),{v:fmt(soll,0)}))})},_kurveDialogMarkup(){let spalte=z=>`
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
      </div>`;return`
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
      </div>`}};var hilfeKarte={_buildHilfe(){let sr=this.shadowRoot,knopf=sr.getElementById("hilfe-knopf"),fenster=sr.getElementById("hilfe");if(!knopf||!fenster)return;knopf.addEventListener("click",ev=>{ev.stopPropagation(),this._oeffneHilfe()}),sr.getElementById("hilfe-zu").addEventListener("click",()=>this._schliesseHilfe()),fenster.addEventListener("click",ev=>{ev.target===fenster&&this._schliesseHilfe()}),fenster.addEventListener("keydown",ev=>{ev.key==="Escape"&&this._schliesseHilfe()}),sr.getElementById("hilfe-suche").addEventListener("input",()=>this._zeigeHilfe())},_oeffneHilfe(){let sr=this.shadowRoot,fenster=sr.getElementById("hilfe");if(!fenster)return;if(this._hilfeGruppe=this._hilfeGruppe||"",this._hilfeIndex=this._hilfeEntitaeten(),fenster.hidden=!1,hilfeDaten())this._hilfeChips(),this._zeigeHilfe();else{let liste=sr.getElementById("hilfe-liste");liste&&(liste.innerHTML=`<p class="keine">${escapeHtml(this._t("h_laedt"))}</p>`),ladeHilfe().then(()=>{fenster.hidden||(this._hilfeChips(),this._zeigeHilfe())}).catch(()=>{liste&&(liste.innerHTML=`<p class="keine">${escapeHtml(this._t("h_fehler"))}</p>`)})}let suche=sr.getElementById("hilfe-suche"),maus=window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches;if(suche&&maus)suche.focus();else{let box=fenster.querySelector(".lhc-hilfe-box");box&&box.focus({preventScroll:!0})}},_schliesseHilfe(){let fenster=this.shadowRoot.getElementById("hilfe");fenster&&(fenster.hidden=!0)},_hilfeChips(){let host=this.shadowRoot.getElementById("hilfe-chips");if(!host)return;let sp=this._sp(),chips=[{id:"",titel:this._t("h_alle")}].concat((hilfeDaten()||[]).map(g=>({id:g.id,titel:hilfeText(sp,g.id,g.titel)})));host.innerHTML=chips.map(c=>`<button type="button" data-g="${c.id}"
          class="${c.id===this._hilfeGruppe?"aktiv":""}">${escapeHtml(c.titel)}</button>`).join(""),host.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{this._hilfeGruppe=b.dataset.g,host.querySelectorAll("button").forEach(x=>x.classList.toggle("aktiv",x===b)),this._zeigeHilfe()}))},_hilfeEntitaeten(){let q=this._hass||{},index={},dazu=(schluessel,id)=>{if(!schluessel||!id)return;let k=String(schluessel).toLowerCase();index[k]||(index[k]=[]),index[k].includes(id)||index[k].push(id)},reg=q.entities||{};Object.keys(reg).forEach(id=>{let e=reg[id];!e||e.platform!==INTEGRATION_DOMAIN||(e.translation_key&&dazu(e.translation_key,id),/_1wire_[^.]+$/.test(id)&&dazu("1-wire",id),/^s0_/.test(e.translation_key||"")&&dazu("s0",id))}),Object.keys(q.states||{}).forEach(id=>{if(!/heishamon/i.test(id))return;let m=id.match(/[._]((?:x?top|opt)\d+|set[a-z0-9]+)$/i);m&&dazu(m[1],id),/_1wire_[^.]+$/.test(id)&&dazu("1-wire",id),/_s0_\d+_(power|energy)$/.test(id)&&dazu("s0",id)});let reihe=["sensor","number","switch","select","button"];return Object.values(index).forEach(liste=>liste.sort((a,b)=>{let ra=reihe.indexOf(a.split(".")[0]),rb=reihe.indexOf(b.split(".")[0]);return(ra<0?9:ra)-(rb<0?9:rb)||a.localeCompare(b)})),index},_hilfeIds(e){let index=this._hilfeIndex||{},ids=[];return[e.l,e.s].forEach(k=>{!k||/^OT /.test(k)||(index[String(k).toLowerCase()]||[]).forEach(id=>{ids.includes(id)||ids.push(id)})}),ids},_kopiere(text){return kopiereText(text)},_zeigeHilfe(){let sr=this.shadowRoot,liste=sr.getElementById("hilfe-liste"),suche=sr.getElementById("hilfe-suche");if(!liste)return;let sp=this._sp(),norm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""),woerter=norm(suche?suche.value:"").split(/\s+/).filter(Boolean),lesen=escapeHtml(this._t("h_lesen")),kopierTitel=escapeHtml(this._t("h_kopieren")),keineEntitaet=escapeHtml(this._t("h_keine_entitaet")),schreiben=escapeHtml(this._t("h_schreiben")),anzahl=0,html="";(hilfeDaten()||[]).forEach(g=>{if(this._hilfeGruppe&&g.id!==this._hilfeGruppe)return;let treffer=g.e.filter(e=>{if(!woerter.length)return!0;let text=norm([hilfeText(sp,`${g.id}.${g.e.indexOf(e)}.n`,e.n),hilfeText(sp,`${g.id}.${g.e.indexOf(e)}.t`,e.t),e.l,e.s,hilfeText(sp,g.id,g.titel)].concat(this._hilfeIds(e)).join(" "));return woerter.every(w=>/^(x?top|opt)\d+$/.test(w)?new RegExp(`(^|[^a-z0-9])${w}($|[^a-z0-9])`).test(text):text.includes(w))});treffer.length&&(anzahl+=treffer.length,html+=`<section><h3>${escapeHtml(hilfeText(sp,g.id,g.titel))}</h3>`,treffer.forEach(e=>{let marken=[];e.l&&marken.push(`<span class="marke lesen">${lesen} · ${escapeHtml(e.l)}</span>`),e.s&&marken.push(`<span class="marke schreiben">${schreiben} · ${escapeHtml(e.s)}</span>`),e.b&&marken.push(`<span class="marke bereich">${escapeHtml(e.b)}</span>`);let entitaeten="";if(e.l||e.s){let ids=this._hilfeIds(e);entitaeten=ids.length?`<div class="entitaeten">${ids.map(id=>`<button type="button" class="entitaet" data-kopie="${escapeHtml(id)}"
                    title="${kopierTitel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h9a2 2 0 0 1 2 2v11h-2V5H8z"/><path d="M5 7h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zm0 2v11h9V9z"/></svg><span>${escapeHtml(id)}</span></button>`).join("")}</div>`:`<div class="entitaeten keine-entitaet">${keineEntitaet}</div>`}html+=`<article>
          <div class="eintrag-kopf"><b>${escapeHtml(hilfeText(sp,`${g.id}.${g.e.indexOf(e)}.n`,e.n))}</b>${marken.join("")}</div>
          <p>${escapeHtml(hilfeText(sp,`${g.id}.${g.e.indexOf(e)}.t`,e.t))}</p>
          ${entitaeten}
        </article>`}),html+="</section>")}),liste.innerHTML=html||`<p class="keine">${escapeHtml(this._t("h_keine"))}</p>`,liste.querySelectorAll("button[data-kopie]").forEach(b=>b.addEventListener("click",async()=>{await this._kopiere(b.dataset.kopie)&&(b.classList.add("kopiert"),b.dataset.hinweis=this._t("h_kopiert"),setTimeout(()=>b.classList.remove("kopiert"),1500))})),liste.scrollTop=0;let z=sr.getElementById("hilfe-anzahl");z&&(z.textContent=anzahl===1?this._t("h_anzahl1"):tf(this._t("h_anzahl"),{n:anzahl}))}};var kennzahlenKarte={_cop(hass,basis){let ids=[this._e(basis)];if(this._config&&this._config.demo){for(let id of ids){let v=numState(hass,id);if(v!==null&&v>0)return v}return null}this._ladeCopTag();let tag=this._copTag||{};for(let id of ids)if(id&&typeof tag[id]=="number")return tag[id];return null},async _ladeCopTag(){let q=this._quelle;if(!q||typeof q.callWS!="function"||this._copLaeuft)return;let ids=["cop_heating","cop_dhw"].map(k=>this._e(k)).filter(Boolean);if(!ids.length)return;let jetzt=Date.now(),d=new Date(jetzt),mitternacht=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(),schluessel=ids.join("|");if(!(this._copTagStart===mitternacht&&this._copTagIds===schluessel&&this._copTagZeit&&jetzt-this._copTagZeit<3e5)){this._copLaeuft=!0,this._copTagZeit=jetzt;try{let antwort=await q.callWS({type:"history/history_during_period",start_time:new Date(mitternacht).toISOString(),end_time:new Date(jetzt).toISOString(),entity_ids:ids,include_start_time_state:!0,significant_changes_only:!1,minimal_response:!0,no_attributes:!0}),ergebnis={};ids.forEach(id=>{ergebnis[id]=copMittel(antwort&&antwort[id]||[],mitternacht,jetzt)}),this._copTag=ergebnis,this._copTagStart=mitternacht,this._copTagIds=schluessel,this._update()}catch{}finally{this._copLaeuft=!1}}},_jazQuellen(){if(this._config&&this._config.demo)return{demo:!0,heizen:!0,ww:!0};let q=this._hass;if(!q||!q.states)return null;let anzahl=q.entities?-1:Object.keys(q.states).length,c=this._jazCache;if(c&&c.reg===q.entities&&c.cfg===this._config&&c.anzahl===anzahl)return c.wert;let wert=this._jazQuellenSuchen();return this._jazCache={reg:q.entities,cfg:this._config,anzahl,wert},wert},_jazQuellenSuchen(){let index=this._hilfeEntitaeten(),sensor=k=>(index[k]||[]).find(id=>id.startsWith("sensor.")),xtop=!!(sensor("xtop3")&&sensor("xtop0")),paar=(w,e)=>sensor(w)&&sensor(e)?{w:sensor(w),e:sensor(e)}:null,heizen=xtop?paar("xtop3","xtop0"):paar("top15","top16"),ww=xtop?paar("xtop5","xtop2"):paar("top40","top41");return!heizen&&!ww?null:{heizen,ww}},async _ladeJaz(){let quellen=this._jazQuellen();if(!quellen||quellen.demo)return;let q=this._hass;if(typeof q.callWS!="function"||this._jazLaeuft)return;let schluessel=JSON.stringify(quellen),jetzt=Date.now();if(this._jazSchluessel===schluessel&&this._jazZeit&&jetzt-this._jazZeit<36e5)return;this._jazLaeuft=!0;let heute=new Date(jetzt),startJahr=new Date(heute.getFullYear(),0,1).getTime(),ende=Math.floor(jetzt/36e5)*36e5,zeit=w=>typeof w=="number"?w:Date.parse(w),ids=[];["heizen","ww"].forEach(k=>{quellen[k]&&ids.push(quellen[k].w,quellen[k].e)});try{let antwort=await q.callWS({type:"recorder/statistics_during_period",start_time:new Date(startJahr).toISOString(),end_time:new Date(ende).toISOString(),statistic_ids:ids,period:"day",types:["mean"]}),tage=id=>{let m=new Map;return(antwort&&antwort[id]||[]).forEach(z=>{let a=zeit(z.start),w=Number(z.mean);if(!Number.isFinite(a)||z.mean===null||!Number.isFinite(w))return;let b=Math.min(Number.isFinite(zeit(z.end))?zeit(z.end):a+864e5,ende);m.set(a,Math.max(w,0)*(b-a)/36e5/1e3)}),m},reihen={};["heizen","ww"].forEach(k=>{quellen[k]&&(reihen[k]={w:tage(quellen[k].w),e:tage(quellen[k].e)})});let rechne=(arten,ab)=>{let da=arten.filter(k=>reihen[k]);if(!da.length)return null;let tageListe=[...reihen[da[0]].w.keys()].filter(t2=>t2>=ab&&da.every(k=>reihen[k].w.has(t2)&&reihen[k].e.has(t2))).sort((x,y)=>x-y);if(!tageListe.length)return null;let w=0,e=0;return tageListe.forEach(t2=>da.forEach(k=>{w+=reihen[k].w.get(t2),e+=reihen[k].e.get(t2)})),e<=0?null:{jaz:w/e,waerme:w,strom:e,erster:tageListe[0],ab}},ergebnis={gesamt:rechne(["heizen","ww"],startJahr),heizen:rechne(["heizen"],startJahr),ww:rechne(["ww"],startJahr)};this._jaz=ergebnis,this._jazSchluessel=schluessel,this._jazZeit=jetzt,this._tuerListe&&this._tuerListe.forEach((f,i)=>f.jaz&&this._tuerZeige(i)),this._diaArt==="analyse"&&this._zeichneAnalyse()}catch{this._jaz=null}finally{this._jazLaeuft=!1}},_jazZeige(f,el,seit){let demo={heizen:{waerme:17600,strom:4e3},ww:{waerme:3900,strom:1e3},gesamt:{waerme:21500,strom:5e3}},ganz;try{ganz=new Intl.NumberFormat(this._sp(),{maximumFractionDigits:0})}catch{ganz={format:v=>fmt(v,0)}}let frueh=null;el.querySelectorAll("output[data-jaz]").forEach(o=>{let r=this._config.demo?demo[o.dataset.jaz]:this._jaz&&this._jaz[o.dataset.jaz];if(!r){o.textContent="--";return}let w=o.dataset.w;o.textContent=w==="jaz"?fmt(r.waerme/r.strom,1):ganz.format(r[w]),r.erster&&r.erster-r.ab>864e5&&(frueh===null||r.erster<frueh)&&(frueh=r.erster)}),seit&&(seit.textContent=frueh===null?"":tf(this._t("j_seit"),{v:new Date(frueh).toLocaleDateString(this._sp(),{day:"2-digit",month:"2-digit",year:"numeric"})}))}};var STILE=["strahlen","funkeln","roehren"];var FUNKEN=[[.2,.3],[.55,.7],[.8,.25],[.4,.55],[.7,.45]],ROEHREN=6,solarKarte={_solarStil(){let s=this._config.solar_style;return STILE.includes(s)?s:"strahlen"},_solarKante(cx,yc,y){let kante=cx+65-36*(y-(yc-40))/90;return Math.round(this._solarStil()==="roehren"?kante-4:kante)},_solarBild(cx,yc){let stil=this._solarStil(),x=cx-65,u=yc+50,o=yc-40,sx=x+4,sy=o-18,strahlen=farbe=>[0,45,90,135,180,225,270,315].map(w=>{let r=w*Math.PI/180;return`<line x1="${(Math.cos(r)*14).toFixed(1)}" y1="${(Math.sin(r)*14).toFixed(1)}"
          x2="${(Math.cos(r)*20).toFixed(1)}" y2="${(Math.sin(r)*20).toFixed(1)}"
          stroke="${farbe}" stroke-width="2.2" stroke-linecap="round"/>`}).join(""),sonne=`
        <g transform="translate(${sx} ${sy})">
          <circle id="solar-schein" r="28" fill="#FFC44D" opacity="0"/>
          <g id="solar-sonne-aus"><circle r="10" fill="#3A4658"/>${strahlen("#55637A")}</g>
          <g id="solar-sonne" opacity="0">
            <circle r="10" fill="#FFD966"/>
            <g id="solar-strahlen">${strahlen("#FFC44D")}</g>
          </g>
        </g>`,daten2=`data-x="${x}" data-u="${u}" data-o="${o}" data-sx="${sx}" data-sy="${sy}"`;if(stil==="roehren"){let roehren="",hell="",punkte="";for(let i=0;i<ROEHREN;i++){let bx=x+8+i*15.5,tx=bx+36;roehren+=`<line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#1E5FA8" stroke-width="11" stroke-linecap="round"/>
          <line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#16324F" stroke-width="5" stroke-linecap="round"/>`,hell+=`<line x1="${bx}" y1="${u}" x2="${tx}" y2="${o}" stroke="#3A8FE0" stroke-width="5" stroke-linecap="round"/>`;for(let k=0;k<3;k++)punkte+=`<circle id="solar-c-${i}-${k}" r="2.6" fill="#FFB070" cx="${bx}" cy="${u}"/>`}return`${sonne}
        <rect x="${x+38}" y="${o-8}" width="100" height="10" rx="4" fill="#26303F" stroke="#33415A" stroke-width="2"/>
        ${roehren}
        <g id="solar-hell" opacity="0">${hell}</g>
        <g id="solar-effekt" opacity="0" ${daten2}>${punkte}</g>
        <rect x="${x}" y="${u}" width="100" height="6" rx="3" fill="#26303F"/>`}let flaeche=`M${x} ${u} L${x+36} ${o} L${x+130} ${o} L${x+94} ${u} Z`,laengs=[1,2,3,4].map(i=>`<line x1="${x+94*i/5}" y1="${u}" x2="${x+36+94*i/5}" y2="${o}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`).join(""),quer=[1,2].map(i=>`<line x1="${x+36*i/3}" y1="${u-90*i/3}" x2="${x+94+36*i/3}" y2="${u-90*i/3}" stroke="#8FA8C8" stroke-width="1" opacity="0.6"/>`).join("");if(stil==="funkeln"){let funken=FUNKEN.map((_,i)=>`<path id="solar-b-funke${i}" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#FFFFFF" opacity="0"/>`).join(""),flimmer=[0,1,2,3].map(k=>`<path id="solar-b-flimmer${k}" d="M0 0 q3 -4 0 -8 q-3 -4 0 -8" fill="none" stroke="#FFC44D" stroke-width="1.8" stroke-linecap="round" opacity="0"/>`).join("");return`${sonne}
        <linearGradient id="solar-verlauf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#2470C2"/>
          <stop id="solar-b-stop" offset="0.5" stop-color="#3A8FE0"/>
          <stop offset="1" stop-color="#FF9A4D"/>
        </linearGradient>
        <path d="${flaeche}" fill="#1B3F66" stroke="#33415A" stroke-width="2"/>
        <path id="solar-hell" d="${flaeche}" fill="url(#solar-verlauf)" opacity="0"/>
        <path d="${flaeche}" fill="none" stroke="#33415A" stroke-width="2"/>
        ${laengs}${quer}
        <g id="solar-effekt" opacity="0" ${daten2}>${funken}${flimmer}</g>`}let zellen="";for(let i=0;i<15;i++){let r=Math.floor(i/5),s=i%5,yy=u-90*(r+.5)/3,xx=x+36*(r+.5)/3+94*(s+.5)/5;zellen+=`<path id="solar-a-zelle${i}" d="M${(xx-9).toFixed(1)} ${(yy+13).toFixed(1)} l7 -26 h12 l-7 26 Z" fill="#9FD3FF" opacity="0"/>`}let strahl=[0,1,2].map(k=>`<line id="solar-a-strahl${k}" x1="${sx+10}" y1="${sy+10}" x2="${sx+10}" y2="${sy+10}" stroke="#FFE08A" stroke-width="3" stroke-linecap="round"/>
        <circle id="solar-a-punkt${k}" r="3" fill="#FFF1B8" cx="${sx+10}" cy="${sy+10}"/>`).join(""),hitze=[0,1,2].map(k=>`<path id="solar-a-hitze${k}" d="M0 0 q5 -6 0 -12 q-5 -6 0 -12" fill="none" stroke="#FFB070" stroke-width="2" stroke-linecap="round" opacity="0"/>`).join("");return`${sonne}
        <clipPath id="solar-clip"><path d="${flaeche}"/></clipPath>
        <path d="${flaeche}" fill="#1B3F66" stroke="#33415A" stroke-width="2"/>
        <path id="solar-hell" d="${flaeche}" fill="#2470C2" opacity="0"/>
        <g id="solar-effekt" opacity="0" ${daten2}>
          <g clip-path="url(#solar-clip)">${zellen}</g>
        </g>
        <path d="${flaeche}" fill="none" stroke="#33415A" stroke-width="2"/>
        ${laengs}${quer}
        <g id="solar-effekt2" opacity="0">${strahl}${hitze}</g>`},_solarSonne(an,animate){let deck=(id,wert)=>{let el=this._animEl(id);el&&el.setAttribute("opacity",wert)};if(deck("solar-sonne",an?"1":"0"),deck("solar-sonne-aus",an?"0":"1"),deck("solar-hell",an?"1":"0"),deck("solar-effekt",an?"1":"0"),deck("solar-effekt2",an?"1":"0"),an&&animate){let da=this._animState.get("solar-strahlen");(!da||da.type!=="spin")&&this._animState.set("solar-strahlen",{type:"spin",duration:14,winkel:0}),this._animState.set("solar-schein",{type:"pulse",duration:2.2,min:.1,max:.3}),this._animState.set("solar-effekt",{type:"solar"})}else{["solar-strahlen","solar-schein","solar-effekt"].forEach(id=>this._animState.delete(id));let str=this._animEl("solar-strahlen");str&&str.removeAttribute("transform"),deck("solar-schein",an?"0.2":"0"),an&&this._solarBildFrame(.35)}},_solarBildFrame(t2){let g=this._animEl("solar-effekt");if(!g)return;let x=Number(g.dataset.x),u=Number(g.dataset.u),o=Number(g.dataset.o),sx=Number(g.dataset.sx),sy=Number(g.dataset.sy),setze=(id,werte)=>{let el=this._animEl(id);el&&Object.entries(werte).forEach(([k,v])=>el.setAttribute(k,v))},stil=this._solarStil();if(stil==="roehren"){for(let i=0;i<ROEHREN;i++){let bx=x+8+i*15.5,tx=bx+36;for(let k=0;k<3;k++){let p=(t2*.8+k/3+i*.11)%1;setze(`solar-c-${i}-${k}`,{cx:(bx+(tx-bx)*p).toFixed(1),cy:(u+(o-u)*p).toFixed(1),opacity:(.3+.7*p).toFixed(2)})}}return}if(stil==="funkeln"){let w=.5+.5*Math.sin(t2*1.5);setze("solar-b-stop",{offset:(.3+.4*w).toFixed(3)}),FUNKEN.forEach(([a,b],i)=>{let ph=(t2*1.3+i*.37)%1,s=Math.max(0,Math.sin(ph*Math.PI)),yy=u-90*b,xx=x+36*b+94*a;setze(`solar-b-funke${i}`,{transform:`translate(${xx.toFixed(1)} ${yy.toFixed(1)}) scale(${Math.max(s,.01).toFixed(2)})`,opacity:s.toFixed(2)})});for(let k=0;k<4;k++){let p=(t2*.6+k/4)%1,wx=x+45+k*22+2*Math.sin(t2*6+k);setze(`solar-b-flimmer${k}`,{transform:`translate(${wx.toFixed(1)} ${(o-4-p*20).toFixed(1)})`,opacity:(.6*Math.sin(p*Math.PI)).toFixed(2)})}return}for(let k=0;k<3;k++){let p=(t2*.9+k/3)%1,x1=sx+10,y1=sy+10,x2=x+50+k*28,y2=o+30,xa=x1+(x2-x1)*p,ya=y1+(y2-y1)*p;setze(`solar-a-strahl${k}`,{x2:xa.toFixed(1),y2:ya.toFixed(1),opacity:(.7*(1-p)).toFixed(2)}),setze(`solar-a-punkt${k}`,{cx:xa.toFixed(1),cy:ya.toFixed(1),opacity:(1-p*.6).toFixed(2)})}for(let i=0;i<15;i++){let r=Math.floor(i/5),s=i%5,ph=((t2*1.2-(s+r)*.12)%1+1)%1;setze(`solar-a-zelle${i}`,{opacity:(Math.max(0,Math.sin(ph*Math.PI))*.55).toFixed(2)})}for(let k=0;k<3;k++){let p=(t2*.7+k/3)%1;setze(`solar-a-hitze${k}`,{transform:`translate(${x+60+k*25} ${(o-6-p*18).toFixed(1)})`,opacity:(.8*Math.sin(p*Math.PI)).toFixed(2)})}}};var VERBRAUCH_FARBEN={heiz:"#FF5F52",ww:"#4D9BFF",lauf:"#98A6BA",standby:"#3A4557"},ARTEN=["standby","lauf","heiz","ww"],VERBRAUCH_STILE=["balken","takte","leuchten","linie"];function obenRund(x,y,b,h,r){let rr=Math.max(0,Math.min(r,b/2,h));return`M${x.toFixed(1)} ${(y+h).toFixed(1)}V${(y+rr).toFixed(1)}Q${x.toFixed(1)} ${y.toFixed(1)} ${(x+rr).toFixed(1)} ${y.toFixed(1)}H${(x+b-rr).toFixed(1)}Q${(x+b).toFixed(1)} ${y.toFixed(1)} ${(x+b).toFixed(1)} ${(y+rr).toFixed(1)}V${(y+h).toFixed(1)}Z`}var verbrauchStileKarte={_verbrauchStil(){let s=this._config.history_style;return VERBRAUCH_STILE.includes(s)?s:"takte"},_verbrauchAuswerten(daten2,ziele,faktor){let summe={heiz:0,ww:0,lauf:0,standby:0},stuecke=[];for(let i=1;i<daten2.length;i++){let a=daten2[i-1],b=daten2[i],art=b.v>a.v?ziele[i]:ziele[i-1],kwh=(a.v+b.v)/2*faktor*(b.t-a.t)/36e5;summe[art]+=kwh,stuecke.push({t0:a.t,t1:b.t,art,kwh})}let takte=[],lauf=null;return stuecke.forEach(s=>{if(s.art==="standby"){lauf=null;return}lauf||(lauf={t0:s.t0,t1:s.t1,kwh:0,ww:0,heiz:0,spitze:0,tSpitze:s.t0},takte.push(lauf)),lauf.t1=s.t1,lauf.kwh+=s.kwh,s.art==="ww"&&(lauf.ww+=s.kwh),s.art==="heiz"&&(lauf.heiz+=s.kwh),s.kwh>0&&s.kwh/((s.t1-s.t0)/36e5||1)>lauf.spitze&&(lauf.spitze=s.kwh/((s.t1-s.t0)/36e5||1),lauf.tSpitze=(s.t0+s.t1)/2)}),takte.forEach(t2=>{t2.art=t2.ww>t2.kwh/2?"ww":t2.heiz>0?"heiz":"lauf"}),{summe,stuecke,takte}},_verbrauchKennzahlen(summe,x,y,breite){let gesamt=ARTEN.reduce((s,a)=>s+summe[a],0),knapp=breite<340,teile=[{text:`${fmt(gesamt,1)} kWh`,farbe:"#E8EDF4",stark:!0}];[["heiz","heizung"],["ww","warmwasser"],["lauf","betrieb"],["standby","standby"]].forEach(([a,k])=>{if(summe[a]<.05&&a!=="standby")return;let zahl=fmt(summe[a],1);teile.push({text:knapp?zahl:`${this._t(k)} ${zahl}`,farbe:a==="standby"?"#7E8CA0":VERBRAUCH_FARBEN[a]})});let rechts=x+breite,out="";for(let i=teile.length-1;i>=0;i--){let t2=teile[i],w=Math.round(t2.text.length*(t2.stark?7.6:6.6))+16,links=rechts-w;out=`<g><rect x="${links}" y="${y}" width="${w}" height="20" rx="10" fill="#1C2533"/>
        <text x="${links+w/2}" y="${y+14}" text-anchor="middle" font-size="${t2.stark?12.5:11.5}"
              font-weight="${t2.stark?700:500}" fill="${t2.farbe}">${escapeHtml(t2.text)}</text></g>`+out,rechts=links-6}return out},_verbrauchBalken(ausw,f){let{links,rechts,oben,unten,t0,t1}=f,n=24,spanne=t1-t0||1,fach=[...Array(n)].map(()=>({heiz:0,ww:0,lauf:0,standby:0}));ausw.stuecke.forEach(s=>{let i=Math.min(n-1,Math.max(0,Math.floor(((s.t0+s.t1)/2-t0)/spanne*n)));fach[i][s.art]+=s.kwh});let hoechst=Math.max(groesster(fach.map(h=>ARTEN.reduce((s,a)=>s+h[a],0))),.01),schritt=(rechts-links)/n,b=Math.max(2,schritt-Math.max(2,schritt*.28)),skala=(unten-oben)/hoechst,out=`<line x1="${links}" x2="${rechts}" y1="${((oben+unten)/2).toFixed(1)}" y2="${((oben+unten)/2).toFixed(1)}"
                     stroke="#26303F" stroke-dasharray="2 5"/>`;return fach.forEach((h,i)=>{let x=links+i*schritt+(schritt-b)/2,y=unten,teile=ARTEN.filter(a=>h[a]*skala>.3);if(!teile.length){out+=`<rect x="${x.toFixed(1)}" y="${(unten-2).toFixed(1)}" width="${b.toFixed(1)}" height="2" rx="1" fill="#26303F"/>`;return}teile.forEach((a,k)=>{let hh=h[a]*skala;y-=hh;let oberstes=k===teile.length-1;out+=oberstes?`<path d="${obenRund(x,y,b,hh,4)}" fill="${VERBRAUCH_FARBEN[a]}"/>`:`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${b.toFixed(1)}" height="${hh.toFixed(1)}" fill="${VERBRAUCH_FARBEN[a]}"/>`});let summe=ARTEN.reduce((s,a)=>s+h[a],0);out+=`<title>${escapeHtml(`${fmt(summe,2)} kWh`)}</title>`}),out},_verbrauchTakte(ausw,f,daten2){let{links,rechts,oben,unten,t0,t1}=f,hoehe=unten-oben,r=Math.max(14,Math.min(hoehe/2-4,52)),cx=links+r+6,cy=oben+hoehe/2,dicke=Math.max(5,r*.26),gesamt=ARTEN.reduce((s,a)=>s+ausw.summe[a],0)||1,a0=-Math.PI/2,ring=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1C2533" stroke-width="${dicke}"/>`;["heiz","ww","lauf","standby"].forEach(a=>{let anteil=ausw.summe[a]/gesamt;if(anteil<=.002)return;let a1=a0+anteil*Math.PI*2,luecke=anteil<.999?.04:0,ende=Math.max(a0+.001,a1-luecke),gross=ende-a0>Math.PI?1:0;ring+=`<path d="M${(cx+r*Math.cos(a0)).toFixed(1)} ${(cy+r*Math.sin(a0)).toFixed(1)}
               A${r} ${r} 0 ${gross} 1 ${(cx+r*Math.cos(ende)).toFixed(1)} ${(cy+r*Math.sin(ende)).toFixed(1)}"
               fill="none" stroke="${VERBRAUCH_FARBEN[a]}" stroke-width="${dicke}" stroke-linecap="round"/>`,a0=a1}),ring+=`<text x="${cx}" y="${cy+(r>30?2:4)}" text-anchor="middle" font-size="${r>30?17:11}" font-weight="700"
                   fill="#E8EDF4">${escapeHtml(fmt(gesamt,1))}</text>`,r>30&&(ring+=`<text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="10" fill="#7E8CA0">kWh</text>`);let bl=cx+r+dicke+14,br=rechts,zuX=t2=>bl+(t2-t0)/(t1-t0||1)*(br-bl),bandH=Math.max(10,Math.min(26,hoehe*.34)),textH=hoehe>70?16:0,bandY=oben+textH,rechts2=`<rect x="${bl}" y="${bandY}" width="${br-bl}" height="${bandH}" rx="6" fill="#1C2533"/>`;if(ausw.takte.forEach(t2=>{let xa=zuX(t2.t0),w=Math.max(3,zuX(t2.t1)-xa),minuten=Math.round((t2.t1-t2.t0)/6e4);rechts2+=`<rect x="${xa.toFixed(1)}" y="${bandY+2}" width="${w.toFixed(1)}" height="${bandH-4}" rx="3"
                        fill="${VERBRAUCH_FARBEN[t2.art]}"><title>${escapeHtml(`${minuten} min · ${fmt(t2.kwh,2)} kWh`)}</title></rect>`}),textH){let n=ausw.takte.length,dauer=n?ausw.takte.reduce((s,t2)=>s+(t2.t1-t2.t0),0)/n/6e4:0,ww=ausw.takte.filter(t2=>t2.art==="ww").length;rechts2+=`<text x="${bl}" y="${oben+11}" font-size="11.5" fill="#98A6BA">${escapeHtml(tf(this._t(ausw.summe.heiz+ausw.summe.ww>0?"v_takte":"v_takte_ohne"),{n,d:fmt(dauer,0),w:ww}))}</text>`}let ko=bandY+bandH+6,ku=unten;if(ku-ko>8){let hoechst=Math.max(groesster(daten2.map(d=>d.v)),.01),pfad="";daten2.forEach((d,i)=>{let y=ku-d.v/hoechst*(ku-ko);pfad+=`${i?"L":"M"}${zuX(d.t).toFixed(1)} ${y.toFixed(1)}`}),rechts2+=`<path d="${pfad}" fill="none" stroke="#7E8CA0" stroke-width="1.4" stroke-linejoin="round" opacity="0.85"/>`}return ring+rechts2},_verbrauchLeuchten(ausw,f,daten2,ziele){let{links,rechts,oben,unten,px}=f,markenH=unten-oben>70?20:0,o2=oben+markenH,hoechst=Math.max(groesster(daten2.map(d=>d.v)),.01),y=d=>unten-d.v/hoechst*(unten-o2),linie="";daten2.forEach((d,i)=>{linie+=`${i?"L":"M"}${px(d).toFixed(1)} ${y(d).toFixed(1)}`});let pfade={heiz:"",ww:"",lauf:"",standby:""},letztes=null;for(let i=1;i<daten2.length;i++){let a=daten2[i-1],b=daten2[i],art=b.v>a.v?ziele[i]:ziele[i-1],von=`${px(a).toFixed(1)} ${y(a).toFixed(1)}`,bis=`${px(b).toFixed(1)} ${y(b).toFixed(1)}`;pfade[art]+=letztes===art?`L${bis}`:`M${von}L${bis}`,letztes=art}let out=`<defs>
        <filter id="vl-leuchten" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="2.6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="vl-flaeche" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FF5F52" stop-opacity="0.22"/>
          <stop offset="1" stop-color="#FF5F52" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${linie}L${rechts.toFixed(1)} ${unten}L${links.toFixed(1)} ${unten}Z" fill="url(#vl-flaeche)"/>`;if(["standby","lauf","heiz","ww"].forEach(a=>{pfade[a]&&(out+=`<path d="${pfade[a]}" fill="none" stroke="${VERBRAUCH_FARBEN[a==="standby"?"lauf":a]}"
                    stroke-width="${a==="standby"?1.6:2.4}" stroke-linejoin="round" stroke-linecap="round"
                    ${a==="standby"?'opacity="0.55"':'filter="url(#vl-leuchten)"'}/>`)}),markenH){let zuletzt=-1/0;ausw.takte.forEach(t2=>{let x=px({t:t2.tSpitze,v:0});if(x-zuletzt<44)return;zuletzt=x;let text=fmt(t2.kwh,1),w=text.length*6.5+14;out+=`<g><rect x="${(x-w/2).toFixed(1)}" y="${oben}" width="${w.toFixed(1)}" height="17" rx="8.5"
                     fill="#1C2533" stroke="${VERBRAUCH_FARBEN[t2.art]}" stroke-opacity="0.7"/>
                 <text x="${x.toFixed(1)}" y="${oben+12}" text-anchor="middle" font-size="10.5" fill="#C9D3E0">${escapeHtml(text)}</text></g>`})}return out}};var SG_STILE=["spuren","stufen","uhr","band"],HOEHE={spuren:250,stufen:214,uhr:238,band:206},REIHE=[4,3,2,1],DUNKEL="#0A0E14",sgStileKarte={_sgStil(){let s=this._config.sg_style;return SG_STILE.includes(s)?s:"spuren"},_sgAchse(links,rechts,y,t0){let out="";for(let i=0;i<=4;i++){let x=links+i/4*(rechts-links),d=new Date(t0+i*864e5/4),text=i===4?this._t("jetzt"):`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,anker=i===0?"start":i===4?"end":"middle";out+=`<text x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}" font-size="11" fill="#7E8CA0">${escapeHtml(text)}</text>`}return out},_sgHoehe(){return HOEHE[this._sgStil()]},_sgAbschnitte(t0,t1){let out=[],sgr=this._sgVerlauf||[];return sgr.forEach((e,i)=>{let von=Math.max(e.t,t0),bis=Math.min(i+1<sgr.length?sgr[i+1].t:t1,t1);if(bis<=von)return;let letzter=out[out.length-1];letzter&&letzter.stufe===e.stufe&&letzter.bis===von?letzter.bis=bis:out.push({stufe:e.stufe,von,bis})}),out},_sgJetzt(abschnitte,t1){let a=abschnitte[abschnitte.length-1];if(!a)return"";let info=SG_STATES[a.stufe]||{},farbe=info.farbe||"#7E8CA0",seit=(t1-a.von)/36e5;return`<g>
        <rect x="20" y="4" width="${DW-40}" height="32" rx="10" fill="#1C2533"/>
        <circle cx="38" cy="20" r="6" fill="${farbe}"/>
        <circle cx="38" cy="20" r="10" fill="${farbe}" opacity="0.25"/>
        <text x="56" y="25" font-size="14" font-weight="700" fill="#E8EDF4">${escapeHtml(tf(this._t("sg_jetzt"),{z:this._t(info.lang||"unbekannt")}))}</text>
        <text x="${DW-32}" y="25" text-anchor="end" font-size="12" fill="#98A6BA">${escapeHtml(tf(this._t("sg_seit"),{h:fmt(seit,1)}))}</text>
      </g>`},_zeichneDiaSg(){let sr=this.shadowRoot,g=sr.getElementById("dia-sg");if(!g)return;let stil=this._sgStil(),hoehe=HOEHE[stil];this._diaArt==="sg"&&(sr.getElementById("dia-svg").setAttribute("viewBox",`0 0 ${DW} ${hoehe}`),sr.getElementById("dia-leer").setAttribute("y",String(hoehe/2)));let sgr=this._sgVerlauf,liste=sr.getElementById("dia-liste");if(!sgr||!sgr.length){g.innerHTML="",liste&&(liste.textContent=""),this._diaLeer(!0);return}this._diaLeer(!1);let t1=Date.now(),t0=t1-864e5,abschnitte=this._sgAbschnitte(t0,t1),dauer={1:0,2:0,3:0,4:0};abschnitte.forEach(a=>{dauer[a.stufe]=(dauer[a.stufe]||0)+(a.bis-a.von)});let name=s=>this._t((SG_STATES[s]||{}).lang||"unbekannt"),farbe=s=>(SG_STATES[s]||{}).farbe||"#7E8CA0",std=s=>fmt(dauer[s]/36e5,1),daten2={t0,t1,abschnitte,dauer,name,farbe,std},inhalt=stil==="stufen"?this._sgStufen(daten2):stil==="uhr"?this._sgUhr(daten2):stil==="band"?this._sgBand(daten2):this._sgSpuren(daten2);g.innerHTML=this._sgJetzt(abschnitte,t1)+inhalt,liste&&(liste.innerHTML=stil==="stufen"?[2,3,4,1].map(s=>`<div class="lhc-dia-zeile"><span class="lhc-dia-farbe" style="background:${farbe(s)}"></span>
                <span>${escapeHtml(name(s))}</span><b>${std(s)} h</b></div>`).join(""):"")},_sgSpuren(d){let rechts=DW-72,zuX=t2=>20+(t2-d.t0)/(d.t1-d.t0)*(rechts-20),out="";return REIHE.forEach((s,i)=>{let y=68+i*44;out+=`<text x="20" y="${y-6}" font-size="12" fill="#C9D3E0">${escapeHtml(d.name(s))}</text>
        <rect x="20" y="${y}" width="${rechts-20}" height="22" rx="11" fill="#1C2533"/>`,d.abschnitte.filter(a=>a.stufe===s).forEach(a=>{let xa=zuX(a.von),w=Math.max(6,zuX(a.bis)-xa-2);out+=`<rect x="${xa.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="22" rx="11" fill="${d.farbe(s)}"><title>${escapeHtml(`${d.name(s)} · ${fmt((a.bis-a.von)/36e5,1)} h`)}</title></rect>`}),out+=`<text x="${DW-20}" y="${y+16}" text-anchor="end" font-size="13" font-weight="700"
                    fill="${d.farbe(s)}">${d.std(s)} h</text>`}),out+=`<line x1="${rechts}" x2="${rechts}" y1="50" y2="224" stroke="#C9D3E0" stroke-dasharray="3 3" opacity="0.5"/>`,out+=this._sgAchse(20,rechts,242,d.t0),out},_sgStufen(d){let rechts=DW-20,oben=62,unten=184,stufe={4:0,3:1,2:2,1:3},zuX=t2=>20+(t2-d.t0)/(d.t1-d.t0)*(rechts-20),zuY=s=>oben+(stufe[s]!==void 0?stufe[s]:2)*(unten-oben)/3,out="";REIHE.forEach(s=>{let y=zuY(s);out+=`<line x1="20" x2="${rechts}" y1="${y}" y2="${y}" stroke="#26303F" stroke-dasharray="2 5"/>
        <text x="20" y="${y-6}" font-size="10.5" fill="${d.farbe(s)}" stroke="#1C2533" stroke-width="3"
              paint-order="stroke">${escapeHtml(d.name(s))}</text>`});let pfad="";d.abschnitte.forEach((a,i)=>{let xa=zuX(a.von),xb=zuX(a.bis),y=zuY(a.stufe);out+=`<rect x="${xa.toFixed(1)}" y="${y}" width="${(xb-xa).toFixed(1)}" height="${(unten+8-y).toFixed(1)}"
                    fill="${d.farbe(a.stufe)}" opacity="0.13"/>`,pfad+=`${i?"L":"M"}${xa.toFixed(1)} ${y}L${xb.toFixed(1)} ${y}`}),out+=`<path d="${pfad}" fill="none" stroke="#3A4557" stroke-width="2"/>`,d.abschnitte.forEach(a=>{let y=zuY(a.stufe);out+=`<path d="M${zuX(a.von).toFixed(1)} ${y}L${zuX(a.bis).toFixed(1)} ${y}" stroke="${d.farbe(a.stufe)}"
                    stroke-width="4" stroke-linecap="round"/>`});let letzter=d.abschnitte[d.abschnitte.length-1];return letzter&&(out+=`<circle cx="${rechts}" cy="${zuY(letzter.stufe)}" r="5" fill="${d.farbe(letzter.stufe)}"/>`),out+=this._sgAchse(20,rechts,206,d.t0),out},_sgUhr(d){let spanne=d.t1-d.t0,pol=(t2,rr)=>{let w=(t2-d.t0)/spanne*Math.PI*2-Math.PI/2;return[128+rr*Math.cos(w),136+rr*Math.sin(w)]},out='<circle cx="128" cy="136" r="66" fill="none" stroke="#1C2533" stroke-width="18"/>',luecke=spanne*.0025;d.abschnitte.forEach(a=>{let von=a.von+luecke,bis=Math.max(von+spanne*.001,a.bis-luecke),[x1,y1]=pol(von,66),[x2,y2]=pol(bis,66),gross=bis-von>spanne/2?1:0;out+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}A66 66 0 ${gross} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"
                    fill="none" stroke="${d.farbe(a.stufe)}" stroke-width="18" stroke-linecap="round"><title>${escapeHtml(`${d.name(a.stufe)} · ${fmt((a.bis-a.von)/36e5,1)} h`)}</title></path>`}),[[0,this._t("jetzt")],[.25,"−18 h"],[.5,"−12 h"],[.75,"−6 h"]].forEach(([anteil,text])=>{let[x,y]=pol(d.t0+anteil*spanne,92);out+=`<text x="${x.toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="middle" font-size="10.5" fill="#7E8CA0">${escapeHtml(text)}</text>`});let letzter=d.abschnitte[d.abschnitte.length-1];letzter&&(out+=`<text x="128" y="132" text-anchor="middle" font-size="12" fill="#98A6BA">${escapeHtml(this._t("jetzt"))}</text>
        <text x="128" y="151" text-anchor="middle" font-size="15" font-weight="700" fill="${d.farbe(letzter.stufe)}">${escapeHtml(this._t((SG_STATES[letzter.stufe]||{}).kurz||"unbekannt"))}</text>`);let lx=262,lb=DW-20-lx;return[2,3,4,1].forEach((s,i)=>{let y=72+i*40,anteil=d.dauer[s]/spanne;out+=`<circle cx="${lx+6}" cy="${y}" r="6" fill="${d.farbe(s)}"/>
        <text x="${lx+20}" y="${y+4}" font-size="13" fill="#C9D3E0">${escapeHtml(d.name(s))}</text>
        <text x="${DW-20}" y="${y+4}" text-anchor="end" font-size="13" font-weight="700" fill="${d.farbe(s)}">${d.std(s)} h</text>
        <rect x="${lx+20}" y="${y+12}" width="${lb-20}" height="5" rx="2.5" fill="#1C2533"/>
        <rect x="${lx+20}" y="${y+12}" width="${Math.max(0,(lb-20)*anteil).toFixed(1)}" height="5" rx="2.5" fill="${d.farbe(s)}"/>`}),out},_sgBand(d){let rechts=DW-20,zuX=t2=>20+(t2-d.t0)/(d.t1-d.t0)*(rechts-20),bloecke="";d.abschnitte.forEach(a=>{let xa=zuX(a.von)+1,w=Math.max(3,zuX(a.bis)-zuX(a.von)-2),std=(a.bis-a.von)/36e5;bloecke+=`<rect x="${xa.toFixed(1)}" y="50" width="${w.toFixed(1)}" height="44" rx="10" fill="${d.farbe(a.stufe)}"><title>${escapeHtml(`${d.name(a.stufe)} · ${fmt(std,1)} h`)}</title></rect>`,w>34&&(bloecke+=`<text x="${(xa+w/2).toFixed(1)}" y="77" text-anchor="middle" font-size="11.5" font-weight="700"
                          fill="${DUNKEL}">${fmt(std,1)} h</text>`)});let out=`<defs><filter id="sg-leuchten" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <g filter="url(#sg-leuchten)" opacity="0.35">${bloecke.replace(/<text[^>]*>[^<]*<\/text>/g,"")}</g>${bloecke}`;out+=this._sgAchse(20,rechts,110,d.t0),out+=`<text x="20" y="132" font-size="11" fill="#7E8CA0">${escapeHtml(this._t("sg_anteile"))}</text>`;let x=20,gesamt=d.t1-d.t0;[2,3,4,1].forEach(s=>{let w=(rechts-20)*d.dauer[s]/gesamt;w>.5&&(out+=`<rect x="${x.toFixed(1)}" y="140" width="${Math.max(1,w-2).toFixed(1)}" height="10" rx="5" fill="${d.farbe(s)}"/>`),x+=w});let lx=20,ly=170;return[2,3,4,1].forEach(s=>{let text=`${d.name(s)} ${d.std(s)} h`,w=14+text.length*6.2+16;lx>20&&lx+w-16>rechts&&(lx=20,ly+=22),out+=`<circle cx="${lx+5}" cy="${ly}" r="5" fill="${d.farbe(s)}"/>
        <text x="${lx+14}" y="${ly+4}" font-size="11.5" fill="#C9D3E0">${escapeHtml(text)}</text>`,lx+=w}),out}};var HOEHE2={cop:326,takt:372},FARBE={heiz:"#FF5F52",ww:"#4D9BFF",aussen:"#6BB7E8",sehrKurz:"#EF4444",kurz:"#F59E0B",gut:"#84CC16",sehrGut:"#22C55E",leer:"#1C2533"};function bewertung(minuten){return minuten<6?"sehrKurz":minuten<10?"kurz":minuten<20?"gut":"sehrGut"}var GUETEGRAD=.42;function erwarteterCop(aussen,vorlauf){if(aussen===null||vorlauf===null)return null;let hub=vorlauf-aussen;return hub<5?null:GUETEGRAD*(vorlauf+273.15)/hub}function copStufe(quote){return quote===null?null:quote>=1?"gut":quote>=.85?"rahmen":quote>=.7?"unter":"schlecht"}var COP_FARBE={gut:"#22C55E",rahmen:"#84CC16",unter:"#F59E0B",schlecht:"#EF4444"};function mittel(reihe,von,bis,nurPositiv){let summe=0,dauer=0;for(let i=0;i<reihe.length;i++){let a=Math.max(reihe[i].t,von),b=Math.min(i+1<reihe.length?reihe[i+1].t:bis,bis);if(b<=a)continue;let v=reihe[i].v;v===null||Number.isNaN(v)||nurPositiv&&v<=0||(summe+=v*(b-a),dauer+=b-a)}return dauer?summe/dauer:null}function stand(reihe,t2){let s=null;for(let p of reihe){if(p.t>t2)break;s=p}return s}var auswertungKarte={_auswertungHoehe(art){return HOEHE2[art]||220},_holeAuswertung(){let jetzt=Date.now();if(this._auswertungZeit&&jetzt-this._auswertungZeit<3e5)return;this._auswertungZeit=jetzt;let t0=jetzt-864e5;if(this._config.demo){this._auswertung=this._auswertungDemo(t0,jetzt),this._zeichneAuswertung();return}let ids=["compressor","three_way_valve","cop_heating","cop_dhw","outside_temp","flow_temp","return_temp","defrost","heater_internal","heater_external"].map(f=>this._e(f));if(!ids[0]||!this._hass||typeof this._hass.callWS!="function"){this._auswertung=null,this._zeichneAuswertung();return}this._hass.callWS({type:"history/history_during_period",start_time:new Date(t0).toISOString(),end_time:new Date(jetzt).toISOString(),entity_ids:ids.filter(Boolean),include_start_time_state:!0,significant_changes_only:!1,minimal_response:!0,no_attributes:!0}).then(antwort=>{let reihe=id=>(antwort&&id&&antwort[id]||[]).map(p=>({t:p.lu?p.lu*1e3:Date.parse(p.last_changed),s:p.s!==void 0?p.s:p.state})).filter(p=>!Number.isNaN(p.t)).map(p=>({...p,v:parseFloat(p.s)})),[vd,ventil,copH,copW,aussen,vorlauf,ruecklauf,abtau,stabIntern,stabExtern]=ids.map(reihe);this._auswertung={t0,t1:jetzt,vd,ventil,copH,copW,aussen,vorlauf,ruecklauf,abtau,stabIntern,stabExtern},this._zeichneAuswertung()}).catch(()=>{this._auswertung=null,this._zeichneAuswertung()})},_auswertungDemo(t0,t1){let aussenBei=t2=>5.5-3.5*Math.cos(((t2-t0)/36e5-14)/24*2*Math.PI),vd=[{t:t0,s:"0",v:0}],ventil=[{t:t0,s:"0",v:0}],copH=[{t:t0,s:"0",v:0}],copW=[{t:t0,s:"0",v:0}],aussen=[],vorlauf=[{t:t0,s:"30",v:30}],ruecklauf=[{t:t0,s:"29",v:29}],abtau=[{t:t0,s:"0",v:0}],stabIntern=[{t:t0,s:"0",v:0}],stabExtern=[{t:t0,s:"0",v:0}];[3.2,7.3,21.2].forEach(s=>{abtau.push({t:t0+s*36e5,s:"1",v:1},{t:t0+s*36e5+6*6e4,s:"0",v:0})});for(let t2=t0;t2<=t1;t2+=36e5/4)aussen.push({t:t2,s:"",v:aussenBei(t2)});return[.5,1.6,2.7,3.9,5,6.2,7,8.4,9.8,11.5,13.6,15.9,18.1,19.4,20.6,21.7,22.8].forEach((s,i)=>{let start=t0+s*36e5,dauer=(s>10&&s<17?7+i%3*2:16+i%4*4)*6e4,ww=i===6||i===15;vd.push({t:start,s:"40",v:40},{t:start+dauer,s:"0",v:0});let vl=ww?51:35+Math.max(0,6-aussenBei(start))*.6;if(vorlauf.push({t:start,s:"",v:vl},{t:start+dauer,s:"",v:30}),ruecklauf.push({t:start,s:"",v:vl-(ww?6:3.8)},{t:start+dauer,s:"",v:29}),ww)ventil.push({t:start,s:"1",v:1},{t:start+dauer,s:"0",v:0}),copW.push({t:start,s:"2.6",v:2.5+i%2*.2},{t:start+dauer,s:"0",v:0});else{let c=3.1+aussenBei(start)*.17;copH.push({t:start,s:String(c),v:c},{t:start+dauer,s:"0",v:0})}}),{t0,t1,vd,ventil,copH,copW,aussen,vorlauf,ruecklauf,abtau,stabIntern,stabExtern}},_auswertungLaeufe(d){let laeuft=p=>{let n=parseFloat(p.s);return Number.isNaN(n)?zustandAn(p.s)===!0:n>0},laeufe=[],start=null,angeschnitten=!1;return d.vd.forEach((p,i)=>{let an=laeuft(p);an&&start===null?(start=Math.max(p.t,d.t0),angeschnitten=i===0||p.t<=d.t0):!an&&start!==null&&(p.t>start&&laeufe.push({von:start,bis:p.t,angeschnitten,laufend:!1}),start=null)}),start!==null&&laeufe.push({von:start,bis:d.t1,angeschnitten,laufend:!0}),laeufe.forEach(l=>{l.minuten=(l.bis-l.von)/6e4;let ww=0,schritte=12;for(let k=0;k<schritte;k++){let t2=l.von+(k+.5)/schritte*(l.bis-l.von),s=stand(d.ventil,t2);s&&warmwasserZustand(s.s)===!0&&ww++}l.ww=ww>schritte/2,l.cop=mittel(l.ww?d.copW:d.copH,l.von,l.bis,!0),l.aussen=mittel(d.aussen,l.von,l.bis,!1);let ab=Math.min(l.von+5*6e4,(l.von+l.bis)/2);if(l.vorlauf=d.vorlauf?mittel(d.vorlauf,ab,l.bis,!0):null,l.ruecklauf=d.ruecklauf?mittel(d.ruecklauf,ab,l.bis,!0):null,l.copErwartet=erwarteterCop(l.aussen,l.vorlauf),l.copQuote=l.cop!==null&&l.copErwartet?l.cop/l.copErwartet:null,l.aussen===null){let s=stand(d.aussen,l.von);l.aussen=s&&!Number.isNaN(s.v)?s.v:null}l.bewertung=bewertung(l.minuten)}),laeufe},_auswertungKachel(x,y,w,wert,text,farbe){return`<g><rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="44" rx="10" fill="#1C2533"/>
      <text x="${(x+10).toFixed(1)}" y="${y+21}" font-size="17" font-weight="700" fill="${farbe||"#E8EDF4"}">${escapeHtml(wert)}</text>
      <text x="${(x+10).toFixed(1)}" y="${y+36}" font-size="10.5" fill="#98A6BA">${escapeHtml(text)}</text></g>`},_auswertungKacheln(y,eintraege){let breite=DW-40,abstand=8,w=(breite-abstand*(eintraege.length-1))/eintraege.length;return eintraege.map(([wert,text,farbe],i)=>this._auswertungKachel(20+i*(w+abstand),y,w,wert,text,farbe)).join("")},_auswertungAchse(links,rechts,y,t0){let out="";for(let i=0;i<=4;i++){let x=links+i/4*(rechts-links),d=new Date(t0+i*864e5/4),text=i===4?this._t("jetzt"):`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,anker=i===0?"start":i===4?"end":"middle";out+=`<text x="${x.toFixed(1)}" y="${y}" text-anchor="${anker}" font-size="11" fill="#7E8CA0">${escapeHtml(text)}</text>`}return out},_zeichneAuswertung(){let art=this._diaArt;if(art==="analyse"){this._zeichneAnalyse();return}if(art!=="cop"&&art!=="takt")return;let sr=this.shadowRoot,g=sr&&sr.getElementById(`dia-${art}`);if(!g)return;let liste=sr.getElementById("dia-liste"),d=this._auswertung,laeufe=d?this._auswertungLaeufe(d):[];if(!d||!laeufe.length){g.innerHTML="",liste&&(liste.textContent="");let leer2=sr.getElementById("dia-leer");leer2&&(leer2.textContent=this._t(d?"a_keine_laeufe":"kein_verlauf")),this._diaLeer(!0);return}let leer=sr.getElementById("dia-leer");leer&&(leer.textContent=this._t("kein_verlauf")),this._diaLeer(!1),art==="cop"?this._zeichneCop(g,liste,d,laeufe):this._zeichneTakt(g,liste,d,laeufe)},_auswertungUrteil(farbe,gut,titel,unterzeile){return`<g>
        <rect x="20" y="0" width="${DW-40}" height="50" rx="12" fill="${farbe}" fill-opacity="0.12" stroke="${farbe}" stroke-opacity="0.45"/>
        <circle cx="44" cy="25" r="12" fill="none" stroke="${farbe}" stroke-width="2"/>
        ${gut?`<path d="M38 25 L42.5 29.5 L50 21" fill="none" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`:`<path d="M44 18 V27" stroke="${farbe}" stroke-width="2.4" stroke-linecap="round"/><circle cx="44" cy="31.5" r="1.6" fill="${farbe}"/>`}
        <text x="66" y="21" font-size="14" font-weight="700" fill="${farbe}">${escapeHtml(titel)}</text>
        <text x="66" y="39" font-size="11.5" fill="#C9D3E0">${escapeHtml(unterzeile)}</text>
      </g>`},_zeichneCop(g,liste,d,laeufe){let mitCop=laeufe.filter(l=>l.cop!==null),gewichtet=(ls,feld)=>{let auswahl=ls.filter(l=>l[feld]!==null&&l[feld]!==void 0),dauer=auswahl.reduce((s,l)=>s+l.minuten,0);return dauer?auswahl.reduce((s,l)=>s+l[feld]*l.minuten,0)/dauer:null},heiz=mitCop.filter(l=>!l.ww),ww=mitCop.filter(l=>l.ww),z=v=>v===null?"--":fmt(v,1),minH=heiz.length?kleinster(heiz.map(l=>l.cop)):null,maxH=heiz.length?groesster(heiz.map(l=>l.cop)):null,bewertbar=mitCop.filter(l=>l.copQuote!==null),quote=gewichtet(bewertbar,"copQuote"),urteil;if(!mitCop.length)urteil=this._auswertungUrteil("#7E8CA0",!1,this._t("a_keine_cop"),"");else if(quote===null)urteil=this._auswertungUrteil("#7E8CA0",!1,this._t("a_c_ohne_t"),this._t("a_c_ohne_d"));else{let stufe=copStufe(quote),aussen=gewichtet(bewertbar,"aussen"),vorlauf=gewichtet(bewertbar,"vorlauf");urteil=this._auswertungUrteil(COP_FARBE[stufe],stufe==="gut"||stufe==="rahmen",this._t(`a_c_${stufe}`),tf(this._t("a_c_unter_d"),{p:fmt(quote*100,0),a:aussen===null?"--":fmt(aussen,1),v:vorlauf===null?"--":fmt(vorlauf,0)}))}let out=urteil;if(out+=this._auswertungKacheln(60,[[z(gewichtet(heiz,"cop")),this._t("a_cop_heiz"),FARBE.heiz],[z(gewichtet(ww,"cop")),this._t("a_cop_ww"),FARBE.ww],[z(gewichtet(mitCop,"cop")),this._t("a_cop_gesamt")],[minH===null?"--":`${fmt(minH,1)} · ${fmt(maxH,1)}`,this._t("a_cop_minmax")]]),!mitCop.length){g.innerHTML=out,liste&&(liste.textContent="");return}let links=44,rechts=DW-52,oben=136,unten=274,zuX=t2=>links+(t2-d.t0)/(d.t1-d.t0)*(rechts-links),werte=mitCop.map(l=>l.cop).concat(bewertbar.map(l=>l.copErwartet)),cMin=Math.min(Math.floor(kleinster(werte)),2),cMax=Math.max(Math.ceil(groesster(werte)),5),zuY=v=>unten-(v-cMin)/(cMax-cMin||1)*(unten-oben);for(let v=cMin;v<=cMax;v++)out+=`<line x1="${links}" x2="${rechts}" y1="${zuY(v).toFixed(1)}" y2="${zuY(v).toFixed(1)}" stroke="#26303F" stroke-dasharray="2 5"/>
        <text x="${links-8}" y="${(zuY(v)+4).toFixed(1)}" text-anchor="end" font-size="10.5" fill="#7E8CA0">${v}</text>`;out+=`<text x="${links-8}" y="${oben-10}" text-anchor="end" font-size="10.5" fill="#7E8CA0">COP</text>`;let aw=d.aussen.filter(p=>!Number.isNaN(p.v));if(aw.length>=2){let aMin=Math.floor(kleinster(aw.map(p=>p.v)))-1,aMax=Math.ceil(groesster(aw.map(p=>p.v)))+1,zuYa=v=>unten-(v-aMin)/(aMax-aMin||1)*(unten-oben),pfad="";aw.forEach((p,i)=>{let x=zuX(Math.max(p.t,d.t0));pfad+=`${i?`H${x.toFixed(1)}V`:`M${x.toFixed(1)} `}${zuYa(p.v).toFixed(1)}`}),pfad+=`H${rechts}`,out+=`<path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="1.6" stroke-dasharray="4 4" opacity="0.75"/>
        <text x="${rechts+8}" y="${(zuYa(aMax)+4).toFixed(1)}" font-size="10.5" fill="${FARBE.aussen}">${aMax} °C</text>
        <text x="${rechts+8}" y="${(zuYa(aMin)+4).toFixed(1)}" font-size="10.5" fill="${FARBE.aussen}">${aMin} °C</text>`}let zuletztX=-1/0,zuletztY=-1/0;if(mitCop.forEach(l=>{let x=zuX((l.von+l.bis)/2),y=zuY(l.cop),r=4+Math.min(9,l.minuten/6),farbe=l.ww?FARBE.ww:FARBE.heiz,stufe=copStufe(l.copQuote);if(l.copErwartet!==null){let ye=zuY(l.copErwartet);out+=`<line x1="${(x-r-3).toFixed(1)}" x2="${(x+r+3).toFixed(1)}" y1="${ye.toFixed(1)}" y2="${ye.toFixed(1)}"
                      stroke="#C9D3E0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
          <line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${ye.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#C9D3E0" stroke-width="1" opacity="0.35"/>`}let titel=`${this._t(l.ww?"warmwasser":"heizung")} · ${fmt(l.minuten,0)} min · COP ${fmt(l.cop,1)}${l.copErwartet!==null?` · ${tf(this._t("a_c_erwartet"),{c:fmt(l.copErwartet,1)})}`:""}${l.aussen!==null?` · ${fmt(l.aussen,1)} °C`:""}${l.vorlauf!==null?` · VL ${fmt(l.vorlauf,0)} °C`:""}`;out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${farbe}" opacity="0.88"
                      ${stufe?`stroke="${COP_FARBE[stufe]}" stroke-width="2.5"`:""}><title>${escapeHtml(titel)}</title></circle>`,(x-zuletztX>=26||Math.abs(y-zuletztY)>=16)&&(out+=`<text x="${x.toFixed(1)}" y="${(y-r-5).toFixed(1)}" text-anchor="middle" font-size="10" fill="#C9D3E0">${fmt(l.cop,1)}</text>`,zuletztX=x,zuletztY=y)}),out+=this._auswertungAchse(links,rechts,296,d.t0),out+=`<g font-size="11">
        <circle cx="${links}" cy="312" r="4" fill="${FARBE.heiz}"/><text x="${links+8}" y="316" fill="#C9D3E0">${escapeHtml(this._t("heizung"))}</text>
        <circle cx="${links+86}" cy="312" r="4" fill="${FARBE.ww}"/><text x="${links+94}" y="316" fill="#C9D3E0">${escapeHtml(this._t("warmwasser"))}</text>
        <line x1="${links+190}" x2="${links+206}" y1="312" y2="312" stroke="#C9D3E0" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <text x="${links+212}" y="316" fill="#C9D3E0">${escapeHtml(this._t("a_c_erwartung"))}</text>
        <line x1="${links+320}" x2="${links+336}" y1="312" y2="312" stroke="${FARBE.aussen}" stroke-dasharray="4 3" stroke-width="1.6"/>
        <text x="${links+342}" y="316" fill="#C9D3E0">${escapeHtml(this._t("aussentemperatur"))}</text></g>`,g.innerHTML=out,liste){let legende=[["gut","a_c_l_gut"],["rahmen","a_c_l_rahmen"],["unter","a_c_l_unter"],["schlecht","a_c_l_schlecht"]].map(([k,t2])=>`<span class="lhc-dia-farbe" style="background:${COP_FARBE[k]}"></span><span>${escapeHtml(this._t(t2))}</span>`).join(""),saetze=[],schwach=bewertbar.filter(l=>l.copQuote<.85);if(bewertbar.length){saetze.push(tf(this._t("a_c_zaehl"),{k:bewertbar.length-schwach.length,n:bewertbar.length}));let schwachWw=schwach.filter(l=>l.ww).length;schwach.length&&schwachWw===schwach.length?saetze.push(this._t("a_c_nur_ww")):schwach.length&&saetze.push(this._t("a_c_rat"))}mitCop.length>bewertbar.length&&saetze.push(this._t("a_c_ohne_d")),liste.innerHTML=`
        <div class="lhc-takt-legende">${legende}</div>
        ${saetze.length?`<p class="lhc-takt-text">${escapeHtml(saetze.join(" "))}</p>`:""}
        <p class="lhc-takt-quelle">${escapeHtml(this._t("a_c_quelle"))}</p>`}},_zeichneTakt(g,liste,d,laeufe){let bewertet=laeufe.filter(l=>!l.laufend&&!l.angeschnitten),n=laeufe.filter(l=>!l.angeschnitten).length,kurz=bewertet.filter(l=>l.minuten<10),sehrKurz=bewertet.filter(l=>l.minuten<6),mLauf=bewertet.length?bewertet.reduce((s,l)=>s+l.minuten,0)/bewertet.length:null,pausen=[];for(let i=1;i<laeufe.length;i++)pausen.push((laeufe[i].von-laeufe[i-1].bis)/6e4);let mPause=pausen.length?pausen.reduce((s,p)=>s+p,0)/pausen.length:null,anteil=bewertet.length?kurz.length/bewertet.length:0,kurzKalt=kurz.filter(l=>l.aussen!==null&&l.aussen<5),kurzMild=kurz.filter(l=>l.aussen!==null&&l.aussen>=10),stufe="ok",titel="a_t_ok";anteil>=.3||sehrKurz.length>=2?kurzKalt.length>=Math.ceil(kurz.length/2)?(stufe="rot",titel="a_t_kalt"):kurzMild.length>=Math.ceil(kurz.length/2)?(stufe="gelb",titel="a_t_mild_t"):(stufe="rot",titel="a_t_viele"):n>15?(stufe="gelb",titel="a_t_starts"):kurz.length&&(stufe="gelb",titel="a_t_einige");let farbe=stufe==="rot"?"#EF4444":stufe==="gelb"?"#F59E0B":"#22C55E",unterzeile=stufe==="ok"?tf(this._t("a_t_ok_d"),{n,d:fmt(mLauf||0,0)}):tf(this._t("a_t_kurz_d"),{k:kurz.length,n:bewertet.length,s:sehrKurz.length}),out=this._auswertungUrteil(farbe,stufe==="ok",this._t(titel),unterzeile);out+=this._auswertungKacheln(60,[[String(n),this._t("a_t_starts_k")],[mLauf===null?"--":`${fmt(mLauf,0)} min`,this._t("a_t_lauf")],[mPause===null?"--":`${fmt(mPause,0)} min`,this._t("a_t_pause")],[String(kurz.length),this._t("a_t_kurz_k"),kurz.length?"#F59E0B":"#E8EDF4"]]);let links=20,rechts=DW-20,zuX=t2=>links+(t2-d.t0)/(d.t1-d.t0)*(rechts-links);out+=`<text x="${links}" y="128" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_laeufe"))}</text>
      <rect x="${links}" y="134" width="${rechts-links}" height="30" rx="7" fill="${FARBE.leer}"/>`,laeufe.forEach(l=>{let xa=zuX(l.von),w=Math.max(3,zuX(l.bis)-xa),f=l.ww?FARBE.ww:FARBE[l.bewertung],titelL=`${this._t(l.ww?"warmwasser":"heizung")} · ${fmt(l.minuten,0)} min${l.aussen!==null?` · ${fmt(l.aussen,1)} °C`:""}`;out+=`<rect x="${xa.toFixed(1)}" y="136" width="${w.toFixed(1)}" height="26" rx="4" fill="${f}"${l.laufend||l.angeschnitten?' opacity="0.55"':""}><title>${escapeHtml(titelL)}</title></rect>`});let aw=d.aussen.filter(p=>!Number.isNaN(p.v));if(out+=`<text x="${links}" y="186" font-size="11" fill="${FARBE.aussen}">${escapeHtml(this._t("aussentemperatur"))}</text>`,aw.length>=2){let aMin=kleinster(aw.map(p=>p.v)),aMax=groesster(aw.map(p=>p.v)),zuY=v=>228-(v-aMin)/(aMax-aMin||1)*34,pfad="";aw.forEach((p,i)=>{let x=zuX(Math.max(p.t,d.t0));pfad+=`${i?`H${x.toFixed(1)}V`:`M${x.toFixed(1)} `}${zuY(p.v).toFixed(1)}`}),pfad+=`H${rechts}`,out+=`<path d="${pfad}" fill="none" stroke="${FARBE.aussen}" stroke-width="2" stroke-linejoin="round"/>
        <text x="${rechts}" y="186" text-anchor="end" font-size="10.5" fill="${FARBE.aussen}">${fmt(aMin,1)} … ${fmt(aMax,1)} °C</text>`}out+=`<text x="${links}" y="252" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_baender"))}</text>`;let baender=[[-1/0,0,"a_t_b1"],[0,5,"a_t_b2"],[5,10,"a_t_b3"],[10,1/0,"a_t_b4"]],bAbstand=8,bBreite=(rechts-links-bAbstand*3)/4;baender.forEach(([von,bis,text],i)=>{let im=bewertet.filter(l=>l.aussen!==null&&l.aussen>=von&&l.aussen<bis),kurzIm=im.filter(l=>l.minuten<10).length,mittelIm=im.length?im.reduce((s2,l)=>s2+l.minuten,0)/im.length:null,anteilIm=im.length?kurzIm/im.length:0,f="#3A4557";im.length&&(kurzIm?anteilIm>=.3?f=von>=10?FARBE.kurz:FARBE.sehrKurz:f=FARBE.kurz:f=FARBE.sehrGut);let x=links+i*(bBreite+bAbstand),zeile=im.length?tf(this._t("a_t_b_zeile"),{n:im.length,d:fmt(mittelIm,0),k:kurzIm}):this._t("a_t_b_leer");out+=`<g><rect x="${x.toFixed(1)}" y="258" width="${bBreite.toFixed(1)}" height="42" rx="9" fill="#1C2533"/>
        <rect x="${x.toFixed(1)}" y="258" width="5" height="42" rx="2.5" fill="${f}"/>
        <text x="${(x+13).toFixed(1)}" y="275" font-size="12" font-weight="700" fill="#E8EDF4">${escapeHtml(this._t(text))}</text>
        <text x="${(x+13).toFixed(1)}" y="291" font-size="10.5" fill="#98A6BA">${escapeHtml(zeile)}</text></g>`}),out+=`<text x="${links}" y="322" font-size="11" fill="#98A6BA">${escapeHtml(this._t("a_t_stunde"))}</text>`;let schritt=(rechts-links)/24,rang={sehrKurz:0,kurz:1,gut:2,sehrGut:3};for(let i=0;i<24;i++){let von=d.t0+i*36e5,imFach=laeufe.filter(l=>!l.angeschnitten&&l.von>=von&&l.von<von+36e5),f=FARBE.leer;if(imFach.length){let schlecht=imFach.reduce((a,l)=>rang[l.bewertung]<rang[a.bewertung]?l:a,imFach[0]);f=FARBE[schlecht.bewertung]}let x=links+i*schritt+1;out+=`<rect x="${x.toFixed(1)}" y="328" width="${(schritt-2).toFixed(1)}" height="14" rx="4" fill="${f}"><title>${escapeHtml(tf(this._t("a_t_stunde_t"),{n:imFach.length}))}</title></rect>`,imFach.length>=2&&(out+=`<text x="${(x+(schritt-2)/2).toFixed(1)}" y="339" text-anchor="middle" font-size="10" font-weight="700" fill="#0A0E14">${imFach.length}</text>`)}if(out+=this._auswertungAchse(links,rechts,362,d.t0),g.innerHTML=out,liste){let saetze=[];stufe!=="ok"&&saetze.push(tf(this._t("a_t_kurz_d"),{k:kurz.length,n:bewertet.length,s:sehrKurz.length})),n>15&&saetze.push(tf(this._t("a_t_starts_d"),{n})),kurzKalt.length&&saetze.push(tf(this._t("a_t_kalt_d"),{k:kurzKalt.length})),kurzMild.length&&saetze.push(tf(this._t("a_t_mild_d"),{k:kurzMild.length})),stufe!=="ok"&&saetze.push(this._t("a_t_rat"));let legende=[["sehrKurz","a_t_l_sehrkurz"],["kurz","a_t_l_kurz"],["gut","a_t_l_gut"],["sehrGut","a_t_l_sehrgut"]].map(([k,t2])=>`<span class="lhc-dia-farbe" style="background:${FARBE[k]}"></span><span>${escapeHtml(this._t(t2))}</span>`).concat(`<span class="lhc-dia-farbe" style="background:${FARBE.ww}"></span><span>${escapeHtml(this._t("warmwasser"))}</span>`).join("");liste.innerHTML=`
        <div class="lhc-takt-legende">${legende}</div>
        ${saetze.length?`<p class="lhc-takt-text">${escapeHtml(saetze.join(" "))}</p>`:""}
        <p class="lhc-takt-quelle">${escapeHtml(this._t("a_t_quelle"))}</p>`}}};var QUELLEN={spreizung:["42watt: Spreizung (BWP Leitfaden Hydraulik)","https://42watt.de/magazin/spreizung-warmepumpe"],vorlauf:["42watt: Vorlauftemperatur (Bosch, Viessmann, VZ RLP)","https://www.42watt.de/magazin/vorlauftemperatur-warmepumpe"],taktung:["42watt: Taktung (BWP, Fraunhofer WP-QS)","https://42watt.de/magazin/taktung-warmepumpe"],cop:["Panasonic: Aquarea T-CAP M, technische Daten","https://www.aircon.panasonic.eu/DE_de/product/t-cap-stand-alone-outdoor-m-series-1-phase-3-phase-r290/"],bivalenz:["42watt: Bivalenzpunkt (Stiebel Eltron)","https://42watt.de/magazin/bivalenzpunkt-warmepumpe-einfach-erklart"],heizstab:["42watt: Heizstab (Fraunhofer-Feldtests)","https://42watt.de/magazin/heizstab-warmepumpe"],abtauung:["42watt: Abtauen","https://42watt.de/magazin/warmepumpe-abtauen"],warmwasser:["Wiss. Dienste Bundestag WD 8 - 021/23 (DVGW, UBA, BWP)","https://www.bundestag.de/resource/blob/947272/cc7cce64da5a0983382949ac996e72ff/WD-8-021-23-pdf-data.pdf"],druck:["Vattenfall: Wasserdruck der Heizung","https://www.vattenfall.de/infowelt-energie/nachhaltig-heizen/wasserdruck-der-heizung"],jaz:["42watt: Wirkungsgrad (Fraunhofer, BEG)","https://42watt.de/magazin/wirkungsgrad-warmepumpe"]},STUFEN={ok:{farbe:"#22C55E",text:"an_ok"},hinweis:{farbe:"#F59E0B",text:"an_hinweis"},pruefen:{farbe:"#EF4444",text:"an_pruefen"},unbekannt:{farbe:"#7E8CA0",text:"an_unbekannt"}};function anZeiten(reihe,aussen,t0,t1){let abschnitte=[];for(let i=0;i<reihe.length;i++){let a=Math.max(reihe[i].t,t0),b=Math.min(i+1<reihe.length?reihe[i+1].t:t1,t1);if(b<=a)continue;let n=parseFloat(reihe[i].s);if(!(Number.isNaN(n)?zustandAn(reihe[i].s)===!0:n>0))continue;let letzter=abschnitte[abschnitte.length-1];letzter&&letzter.bis===a?letzter.bis=b:abschnitte.push({von:a,bis:b})}return abschnitte.forEach(x=>{x.minuten=(x.bis-x.von)/6e4,x.aussen=aussen?mittel(aussen,x.von,x.bis,!1):null}),abschnitte}var analyseKarte={_anHeizflaechen(){let n=Math.max(1,Math.min(4,Number(this._config.hk_count)||1)),arten=[];for(let i=1;i<=n;i++)arten.push(this._istFbh(this._heizStil(i))?"fbh":"hk");return arten.every(a=>a==="fbh")?"fbh":arten.every(a=>a==="hk")?"hk":"gemischt"},_anWert(feld){let id=this._e(feld);return id?numState(this._quelle,id):null},_anPruefen(){let d=this._auswertung,laeufe=d?this._auswertungLaeufe(d):[],heizLaeufe=laeufe.filter(l=>!l.ww&&!l.angeschnitten&&l.minuten>=10),flaechen=this._anHeizflaechen(),punkte=[],punkt=(gruppe,id,stufe,titel,wert,wertText2,richt,text,tipp,quelle)=>punkte.push({gruppe,id,stufe,titel,wert,wertText:wertText2,richt,text,tipp,quelle}),z=(v,s=1)=>fmt(v,s),mitSpreizung=heizLaeufe.filter(l=>l.vorlauf!==null&&l.ruecklauf!==null);if(mitSpreizung.length){let dauer=mitSpreizung.reduce((s,l)=>s+l.minuten,0),sp=mitSpreizung.reduce((s,l)=>s+(l.vorlauf-l.ruecklauf)*l.minuten,0)/dauer,stufe="ok",text="an_sp_ok";sp<5?(stufe="hinweis",text="an_sp_klein"):sp>10?(stufe="pruefen",text="an_sp_gross"):sp>7&&(stufe=flaechen==="fbh"?"hinweis":"ok",text=flaechen==="fbh"?"an_sp_fbh":"an_sp_hk"),punkt("heiz","spreizung",stufe,"an_t_spreizung",`${z(sp)} K`,this._t("an_w_sp"),this._t(flaechen==="fbh"?"an_r_sp_fbh":"an_r_sp_hk"),this._t(text),stufe==="ok"?"":this._t(sp<5?"an_tip_sp_klein":"an_tip_sp_gross"),"spreizung")}else punkt("heiz","spreizung","unbekannt","an_t_spreizung","--","",this._t("an_r_sp_hk"),this._t("an_kein_heizlauf"),"","spreizung");let grenze=flaechen==="fbh"?{gut:35,max:40}:{gut:55,max:55},mitVl=heizLaeufe.filter(l=>l.vorlauf!==null);if(mitVl.length){let hoechst=mitVl.reduce((a,l)=>l.vorlauf>a.vorlauf?l:a,mitVl[0]),vl=hoechst.vorlauf,stufe=vl<=grenze.gut?"ok":vl<=grenze.max?"hinweis":"pruefen";punkt("heiz","vorlauf",stufe,flaechen==="fbh"?"an_t_vl_fbh":"an_t_vl_hk",`${z(vl,0)} °C`,hoechst.aussen!==null?tf(this._t("an_w_vl"),{a:z(hoechst.aussen)}):"",this._t(flaechen==="fbh"?"an_r_vl_fbh":"an_r_vl_hk"),this._t(stufe==="ok"?"an_vl_ok":flaechen==="fbh"?"an_vl_fbh":"an_vl_hk")+(flaechen==="gemischt"?` ${this._t("an_vl_gemischt")}`:""),this._t("an_tip_vl"),"vorlauf")}else punkt("heiz","vorlauf","unbekannt","an_t_vl_hk","--","",this._t(flaechen==="fbh"?"an_r_vl_fbh":"an_r_vl_hk"),this._t("an_kein_heizlauf"),"","vorlauf");let kurveVl=this._anWert("curve_t_high"),kurveAussen=this._anWert("curve_o_low");if(kurveVl!==null){let stufe=kurveVl<=grenze.gut?"ok":kurveVl<=grenze.max?"hinweis":"pruefen";punkt("heiz","kurve",stufe,"an_t_kurve",`${z(kurveVl,0)} °C`,kurveAussen!==null?tf(this._t("an_w_kurve"),{a:z(kurveAussen,0)}):"",this._t(flaechen==="fbh"?"an_r_vl_fbh":"an_r_vl_hk"),this._t(stufe==="ok"?"an_kurve_ok":"an_kurve_hoch"),stufe==="ok"?"":this._t("an_tip_kurve"),"vorlauf")}let bewertet=laeufe.filter(l=>!l.laufend&&!l.angeschnitten);if(bewertet.length){let n=laeufe.filter(l=>!l.angeschnitten).length,kurz=bewertet.filter(l=>l.minuten<10).length,sehrKurz=bewertet.filter(l=>l.minuten<6).length,mLauf=bewertet.reduce((s,l)=>s+l.minuten,0)/bewertet.length,stufe=kurz/bewertet.length>=.3||sehrKurz>=2?"pruefen":kurz||n>15?"hinweis":"ok";punkt("heiz","taktung",stufe,"an_t_taktung",tf(this._t("an_w_starts"),{n}),tf(this._t("an_w_lauf"),{d:z(mLauf,0)}),this._t("an_r_taktung"),stufe==="ok"?this._t("an_tk_ok"):tf(this._t("an_tk_kurz"),{k:kurz,n:bewertet.length}),stufe==="ok"?"":this._t("an_tip_taktung"),"taktung")}else punkt("heiz","taktung","unbekannt","an_t_taktung","--","",this._t("an_r_taktung"),this._t(d?"a_keine_laeufe":"an_keine_daten"),"","taktung");let mitQuote=laeufe.filter(l=>l.copQuote!==null);if(mitQuote.length){let dauer=mitQuote.reduce((s,l)=>s+l.minuten,0),q=mitQuote.reduce((s,l)=>s+l.copQuote*l.minuten,0)/dauer,st=copStufe(q),stufe=st==="gut"||st==="rahmen"?"ok":st==="unter"?"hinweis":"pruefen";punkt("heiz","cop",stufe,"an_t_cop",`${z(q*100,0)} %`,this._t("an_w_cop"),this._t("an_r_cop"),this._t(stufe==="ok"?"an_cop_ok":"an_cop_unter"),stufe==="ok"?"":this._t("an_tip_cop"),"cop")}else punkt("heiz","cop","unbekannt","an_t_cop","--","",this._t("an_r_cop"),this._t("an_cop_ohne"),"","cop");let stabGrenze=this._anWert("heater_on_temp");if(stabGrenze!==null){let stufe=stabGrenze<=-3?"ok":"hinweis";punkt("zusatz","bivalenz",stufe,"an_t_bivalenz",`${z(stabGrenze,0)} °C`,this._t("an_w_bivalenz"),this._t("an_r_bivalenz"),this._t(stufe==="ok"?"an_biv_ok":"an_biv_hoch"),stufe==="ok"?"":this._t("an_tip_bivalenz"),"bivalenz")}if(d&&(d.stabIntern.length||d.stabExtern.length)){let zeiten=anZeiten(d.stabIntern,d.aussen,d.t0,d.t1).concat(anZeiten(d.stabExtern,d.aussen,d.t0,d.t1)),gesamt=zeiten.reduce((s,x)=>s+x.minuten,0),warm=zeiten.filter(x=>x.aussen!==null&&x.aussen>0).reduce((s,x)=>s+x.minuten,0),stufe=warm>=30?"hinweis":"ok";punkt("zusatz","heizstab",stufe,"an_t_heizstab",`${z(gesamt,0)} min`,tf(this._t("an_w_heizstab"),{w:z(warm,0)}),this._t("an_r_heizstab"),this._t(gesamt===0?"an_hs_aus":stufe==="ok"?"an_hs_ok":"an_hs_warm"),stufe==="ok"?"":this._t("an_tip_heizstab"),"heizstab")}if(d&&d.abtau.length){let zeiten=anZeiten(d.abtau,d.aussen,d.t0,d.t1);if(!zeiten.length)punkt("zusatz","abtauung","ok","an_t_abtauung","0×","",this._t("an_r_abtauung"),this._t("an_ab_keine"),"","abtauung");else{let m=zeiten.reduce((s,x)=>s+x.minuten,0)/zeiten.length,temps=zeiten.filter(x=>x.aussen!==null).map(x=>x.aussen),warm=temps.filter(t2=>t2>=10).length,stufe=m>15||warm?"hinweis":"ok",bereich=temps.length?tf(this._t("an_w_abtau"),{d:z(m,0),a:z(Math.min(...temps),0),b:z(Math.max(...temps),0)}):tf(this._t("an_w_abtau_d"),{d:z(m,0)});punkt("zusatz","abtauung",stufe,"an_t_abtauung",`${zeiten.length}×`,bereich,this._t("an_r_abtauung"),this._t(m>15?"an_ab_lang":warm?"an_ab_warm":"an_ab_ok"),stufe==="ok"?"":this._t("an_tip_abtauung"),"abtauung")}}let wwSoll=this._anWert("dhw_setpoint"),steril=this._anWert("steril_temp");if(wwSoll!==null){let stufe=wwSoll>=50?"ok":"hinweis";punkt("anlage","warmwasser",stufe,"an_t_warmwasser",`${z(wwSoll,0)} °C`,steril!==null?tf(this._t("an_w_steril"),{s:z(steril,0)}):this._t("an_w_ww_soll"),this._t("an_r_warmwasser"),this._t(stufe==="ok"?wwSoll>55?"an_ww_hoch":"an_ww_ok":"an_ww_niedrig"),stufe==="ok"?wwSoll>55?this._t("an_tip_ww_hoch"):"":this._t("an_tip_ww_niedrig"),"warmwasser")}let druck=this._anWert("water_pressure");if(druck!==null){let stufe=druck>=1.2&&druck<=2.3?"ok":"hinweis";punkt("anlage","druck",stufe,"an_t_druck",`${z(druck)} bar`,"",this._t("an_r_druck"),this._t(stufe==="ok"?"an_dr_ok":druck<1.2?"an_dr_niedrig":"an_dr_hoch"),stufe==="ok"?"":this._t(druck<1.2?"an_tip_dr_niedrig":"an_tip_dr_hoch"),"druck")}let jaz=this._config.demo?{jaz:4.3}:this._jaz&&this._jaz.gesamt;if(jaz&&Number.isFinite(jaz.jaz)){let j=jaz.jaz,stufe=j>=3?"ok":"hinweis";punkt("anlage","jaz",stufe,"an_t_jaz",z(j),this._t("an_w_jaz"),this._t("an_r_jaz"),this._t(j>=3.4?"an_jaz_gut":j>=3?"an_jaz_ok":"an_jaz_niedrig"),stufe==="ok"?"":this._t("an_tip_jaz"),"jaz")}let err=rawState(this._quelle,this._e("error")),harmlos=[null,"","OK","ok","0","No error","unknown","unavailable"];if(this._e("error")){let stoerung=err!==null&&!harmlos.includes(err);punkt("anlage","stoerung",stoerung?"pruefen":"ok","an_t_stoerung",stoerung?err:this._t("an_keine"),"","",this._t(stoerung?"an_st_ja":"an_st_nein"),stoerung?this._t("an_tip_stoerung"):"","")}return punkte},_zeichneAnalyse(){if(this._diaArt!=="analyse")return;let sr=this.shadowRoot,liste=sr&&sr.getElementById("dia-liste");if(!liste)return;this._diaLeer(!1);let punkte=this._anPruefen(),zahl={ok:0,hinweis:0,pruefen:0,unbekannt:0};punkte.forEach(p=>zahl[p.stufe]++);let bewertet=zahl.ok+zahl.hinweis+zahl.pruefen,offen=punkte.filter(p=>p.stufe==="pruefen").concat(punkte.filter(p=>p.stufe==="hinweis")),titel="an_g_gut";zahl.pruefen?titel="an_g_pruefen":zahl.hinweis&&(titel="an_g_hinweis"),bewertet||(titel="an_g_leer");let potenzial=offen.slice(0,3).map(p=>this._t(p.titel)).join(", "),umfang=2*Math.PI*34,versatz=0,kopf=`<div class="lhc-an-gesamt">
        <svg viewBox="0 0 84 84" class="lhc-an-ring"><circle cx="42" cy="42" r="34" fill="none" stroke="#26303F" stroke-width="10"/>${["ok","hinweis","pruefen"].map(k=>{let anteil=bewertet?zahl[k]/bewertet:0;if(!anteil)return"";let l=anteil*umfang,s=`<circle cx="42" cy="42" r="34" fill="none" stroke="${STUFEN[k].farbe}" stroke-width="10"
          stroke-dasharray="${Math.max(0,l-2).toFixed(1)} ${umfang.toFixed(1)}" stroke-dashoffset="${(-versatz).toFixed(1)}"
          transform="rotate(-90 42 42)"/>`;return versatz+=l,s}).join("")}
          <text x="42" y="48" text-anchor="middle" font-size="18" font-weight="700" fill="#E8EDF4">${zahl.ok}/${bewertet}</text></svg>
        <div class="lhc-an-urteil"><b>${escapeHtml(tf(this._t(titel),{n:zahl.pruefen+zahl.hinweis}))}</b>
          ${potenzial?`<span>${escapeHtml(tf(this._t("an_g_potenzial"),{p:potenzial}))}</span>`:""}</div>
        <div class="lhc-an-zahlen">${["ok","hinweis","pruefen","unbekannt"].map(k=>`<div><b style="color:${STUFEN[k].farbe}">${zahl[k]}</b><span>${escapeHtml(this._t(STUFEN[k].text))}</span></div>`).join("")}</div>
      </div>`,karten=[["heiz","an_gr_heiz"],["zusatz","an_gr_zusatz"],["anlage","an_gr_anlage"]].map(([g,t2])=>{let inGruppe=punkte.filter(p=>p.gruppe===g);return inGruppe.length?`<div class="lhc-an-gruppe">${escapeHtml(this._t(t2))}</div><div class="lhc-an-raster">${inGruppe.map(p=>{let st=STUFEN[p.stufe],q=QUELLEN[p.quelle];return`<div class="lhc-an-karte" style="border-left-color:${st.farbe}">
                <div class="lhc-an-kopf"><b>${escapeHtml(this._t(p.titel))}</b>
                  <i style="color:${st.farbe};background:${st.farbe}22">${escapeHtml(this._t(st.text))}</i></div>
                <div class="lhc-an-wert"><span><b>${escapeHtml(p.wert)}</b> ${escapeHtml(p.wertText||"")}</span>
                  ${p.richt?`<span>${escapeHtml(this._t("an_richtwert"))} <b>${escapeHtml(p.richt)}</b></span>`:""}</div>
                ${p.text?`<p>${escapeHtml(p.text)}</p>`:""}
                ${p.tipp?`<p class="lhc-an-tipp">${escapeHtml(p.tipp)}</p>`:""}
                ${q?`<div class="lhc-an-quelle">${escapeHtml(this._t("an_quelle"))}: <a href="${escapeHtml(q[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(q[0])}</a></div>`:""}
              </div>`}).join("")}</div>`:""}).join("");liste.innerHTML=`<div class="lhc-an">${kopf}${karten}
      <p class="lhc-takt-quelle">${escapeHtml(this._t("an_fuss"))}</p></div>`}};var stilKarte={_css(){return`
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
      /* Schmalere Leitungen fuer Heizkreise, Zusatzwaerme und Zirkulation,
         damit die Geraete und nicht die Rohre das Bild praegen. Die
         Strichlaenge ergibt wie oben 44, sonst springt die Bewegung. */
      .pipe-shell.duenn { stroke-width: 12; }
      .pipe.duenn { stroke-width: 6; }
      .flowdots.duenn { stroke-width: 4; stroke-dasharray: 12 32; }

      .unit-label {
        /* 11px mit engerer Sperrung, sonst passt "Außentemperatur"
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
      /* Namensschilder liegen auf farbigen Flaechen, nachts nicht zu dunkel. */
      .lhc.thema-nacht .cap { fill: #A3ADBD; }
      /* Auf hellem Grund sind gelbe und hellgruene Werte zu blass. Farbige
         Texte werden dort dunkler, weisse Texte auf den Speichern nicht. */
      .lhc.thema-hell svg text:not(.value-l):not(.value-sp):not(.tag-v):not(.cap) {
        filter: brightness(0.72) saturate(1.25);
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
      .lhc-takt-legende { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; font-size: 12.5px; color: var(--c-c9d3e0); }
      .lhc-takt-legende span:not(.lhc-dia-farbe) { margin-right: 8px; }
      .lhc-takt-text { margin: 10px 0 0; font-size: 13.5px; line-height: 1.45; color: var(--c-e8edf4); }
      /* Analyse: Fenster so gross wie die Karte, Inhalt rollt. */
      .lhc-dialog.voll { padding: 0; }
      .lhc-kurve-box.lhc-dia-box.voll { max-width: none; max-height: none; border-radius: 12px; }
      .lhc-an { padding-bottom: 6px; }
      .lhc-an-gesamt { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 18px; padding: 14px 16px;
        border-radius: 16px; background: var(--c-1c2533); margin: 4px 0 6px; }
      .lhc-an-ring { width: 84px; height: 84px; flex: 0 0 auto; }
      .lhc-an-urteil { flex: 1 1 260px; min-width: 0; }
      .lhc-an-urteil b { display: block; font-size: 17px; color: var(--c-e8edf4); }
      .lhc-an-urteil span { display: block; margin-top: 4px; font-size: 13px; line-height: 1.4; color: var(--c-c9d3e0); }
      .lhc-an-zahlen { display: flex; flex-wrap: wrap; gap: 8px; }
      .lhc-an-zahlen div { min-width: 70px; padding: 7px 10px; border-radius: 12px; background: var(--c-131a24); text-align: center; }
      .lhc-an-zahlen b { display: block; font-size: 20px; }
      .lhc-an-zahlen span { font-size: 11.5px; color: var(--c-98a6ba); }
      .lhc-an-gruppe { margin: 16px 0 8px; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-98a6ba); }
      .lhc-an-raster { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
      .lhc-an-karte { min-width: 0; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--c-26303f);
        border-left: 5px solid; background: var(--c-131a24); }
      .lhc-an-kopf { display: flex; align-items: center; gap: 8px; }
      .lhc-an-kopf b { font-size: 14.5px; color: var(--c-e8edf4); }
      .lhc-an-kopf i { margin-left: auto; padding: 1px 9px; border-radius: 9px; font-style: normal; font-size: 11.5px; white-space: nowrap; }
      .lhc-an-wert { display: flex; flex-wrap: wrap; gap: 4px 16px; margin: 8px 0 6px; font-size: 12.5px; color: var(--c-98a6ba); }
      .lhc-an-wert b { color: var(--c-e8edf4); font-size: 13.5px; }
      .lhc-an-wert span:first-child b { font-size: 17px; }
      .lhc-an-karte p { margin: 4px 0; font-size: 13px; line-height: 1.45; color: var(--c-c9d3e0); }
      .lhc-an-karte p.lhc-an-tipp { padding: 6px 9px; border-radius: 8px; background: rgba(59, 130, 246, 0.12); }
      .lhc-an-quelle { margin-top: 6px; font-size: 11px; color: var(--c-7e8ca0); }
      .lhc-an-quelle a { color: inherit; }
      .lhc-takt-quelle { margin: 8px 0 0; font-size: 11.5px; line-height: 1.4; color: var(--c-7e8ca0); }
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
      /* Dieselbe Zuordnung wie im Diagramm: orange Vorlauf, blau außen. */
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
    `}};var tuerKarte={_buildTuer(){let sr=this.shadowRoot,knopf=sr.getElementById("tuer-knopf");if(knopf){let auf=ev=>{ev.stopPropagation(),ev.preventDefault(),this._oeffneTuer()};knopf.addEventListener("click",auf),knopf.addEventListener("keydown",ev=>{(ev.key==="Enter"||ev.key===" ")&&auf(ev)})}let ab=sr.getElementById("tuer-abbrechen"),ok=sr.getElementById("tuer-ok");ab&&ab.addEventListener("click",()=>this._schliesseTuer()),ok&&ok.addEventListener("click",()=>this._tuerUebernehmen())},_tuerCopAuffrischen(){if(!this._tuerListe)return;let panel=this.shadowRoot.getElementById("tuer-panel");!panel||panel.hidden||this._tuerListe.forEach((f,i)=>{f.cop&&this._tuerZeige(i)})},_tuerFelder(){let q=this._quelle;if(!q)return[];let jaz=this._jazQuellen();return TUER_FELDER.map(f=>f.jaz?{...f,id:jaz?"jaz.tabelle":""}:{...f,id:this._e(f.key)}).filter(f=>f.id&&(f.jaz||q.states[f.id]))},_oeffneTuer(){let sr=this.shadowRoot,karte=sr.querySelector("ha-card"),panel=sr.getElementById("tuer-panel");if(!karte||!panel||karte.classList.contains("tuer-offen"))return;this._tuerNeu={},this._tuerZeilen(),this._ladeJaz();let blatt=this._tuerBlatt();karte.classList.add("tuer-offen"),karte.classList.remove("tuer-zu"),panel.hidden=!1,this._tuerLage(),requestAnimationFrame(()=>requestAnimationFrame(()=>{blatt&&blatt.classList.add("auf"),panel.classList.add("sichtbar")}))},_schliesseTuer(){let sr=this.shadowRoot,karte=sr.querySelector("ha-card"),panel=sr.getElementById("tuer-panel");if(!karte||!panel||!karte.classList.contains("tuer-offen"))return;panel.classList.remove("sichtbar"),this._tuerNeu={},karte.classList.remove("tuer-offen"),karte.classList.add("tuer-zu");let blatt=this.shadowRoot.getElementById("tuer-blatt"),fertig=()=>{karte.classList.contains("tuer-offen")||(karte.classList.remove("tuer-zu"),blatt&&blatt.remove(),panel.hidden=!0)};blatt?(blatt.classList.remove("auf"),blatt.addEventListener("transitionend",fertig,{once:!0}),setTimeout(fertig,900)):fertig()},_tuerBlatt(){let sr=this.shadowRoot,karte=sr.querySelector("ha-card"),gruppe=sr.getElementById("unit-group"),innen=sr.getElementById("unit-innen"),svg=gruppe&&gruppe.ownerSVGElement;if(!karte||!gruppe||!innen||!svg)return null;let alt=sr.getElementById("tuer-blatt");alt&&alt.remove();let rahmen=innen.querySelector("rect"),x=Number(rahmen.getAttribute("x")),y=Number(rahmen.getAttribute("y")),w=Number(rahmen.getAttribute("width")),h=Number(rahmen.getAttribute("height")),k=karte.getBoundingClientRect(),r=rahmen.getBoundingClientRect(),kopie=gruppe.cloneNode(!0);kopie.removeAttribute("class"),kopie.querySelectorAll("[id]").forEach(n=>{n.id==="unit-glow"?n.remove():n.removeAttribute("id")}),kopie.removeAttribute("id");let blatt=document.createElement("div");blatt.className="lhc-tuer-blatt",blatt.id="tuer-blatt",Object.assign(blatt.style,{left:`${r.left-k.left}px`,top:`${r.top-k.top}px`,width:`${r.width}px`,height:`${r.height}px`});let bild=document.createElementNS("http://www.w3.org/2000/svg","svg");return bild.setAttribute("viewBox",`${x} ${y} ${w} ${h}`),bild.setAttribute("preserveAspectRatio","none"),bild.appendChild(kopie),blatt.appendChild(bild),karte.appendChild(blatt),blatt},_tuerLage(){let sr=this.shadowRoot,karte=sr.querySelector("ha-card"),innen=sr.getElementById("unit-innen"),panel=sr.getElementById("tuer-panel");if(!karte||!innen||!panel)return;let k=karte.getBoundingClientRect(),r=innen.getBoundingClientRect(),links=r.left-k.left,oben=r.top-k.top,breite=r.width>=230?r.width:260,hoehe=Math.max(r.height,Math.min(440,k.height-8));links+breite>k.width-4&&(links=Math.max(4,k.width-4-breite)),oben+hoehe>k.height-4&&(oben=Math.max(4,k.height-4-hoehe)),hoehe=Math.min(hoehe,k.height-8),panel.classList.remove("zwei"),Object.assign(panel.style,{left:`${links}px`,top:`${oben}px`,width:`${breite}px`,height:`${hoehe}px`});let liste=sr.getElementById("tuer-liste");panel.style.removeProperty("--spalten");for(let spalten=2;spalten<=3&&!(!liste||liste.scrollHeight<=liste.clientHeight+1);spalten++){let breiteN=Math.max(breite,230*spalten+16*(spalten-1)+20);if(breiteN>k.width-8)break;let l=links;l+breiteN>k.width-4&&(l=Math.max(4,k.width-4-breiteN)),panel.classList.add("zwei"),panel.style.setProperty("--spalten",String(spalten)),Object.assign(panel.style,{left:`${l}px`,width:`${breiteN}px`})}},_tuerZeilen(){let liste=this.shadowRoot.getElementById("tuer-liste");if(!liste)return;let q=this._quelle,demo=!!this._config.demo,felder=this._tuerFelder(),abschnitt="",html="";felder.forEach((f,i)=>{f.abschnitt!==abschnitt&&(abschnitt&&(html+="</div>"),abschnitt=f.abschnitt,html+=`<div class="lhc-tuer-gruppe"><div class="lhc-tuer-abschnitt">${escapeHtml(this._t(abschnitt))}</div>`);let titel=escapeHtml(this._t(`k_${f.key}`)),lang=escapeHtml(feldText(f,this._sp())),bereich=f.id.split(".")[0];if(f.cop){html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${escapeHtml(this._t(`j_${f.cop}`))}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;return}if(f.jaz){let quellen=this._jazQuellen()||{},arten=["heizen","ww"].filter(k=>quellen[k]);arten.length===2&&arten.push("gesamt");let zellen=arten.map(k=>{let kl=k==="gesamt"?"jaz-gesamt":"";return`<span class="jaz-art ${kl}">${escapeHtml(this._t(`j_${k}`))}</span>
              <output class="${kl}" data-jaz="${k}" data-w="waerme">--</output>
              <output class="${kl}" data-jaz="${k}" data-w="strom">--</output>
              <output class="${kl} jaz-wert" data-jaz="${k}" data-w="jaz">--</output>`}).join("");html+=`<div class="lhc-jaz" id="tuer-z${i}">
            <span></span><span class="jaz-kopf">${escapeHtml(this._t("j_kwaerme"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kstrom"))}</span><span class="jaz-kopf">${escapeHtml(this._t("j_kjaz"))}</span>
            ${zellen}
          </div><em class="jaz-seit">${escapeHtml(this._t("j_unter"))}</em><em class="jaz-seit" id="tuer-s${i}"></em>`;return}if(f.info){html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-stell"><output id="tuer-z${i}">--</output></div></div>`;return}if(f.knopf){let kann=demo||bereich==="button"||bereich==="input_button",code=rawState(q,this._e("error"));html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${code&&code!=="unknown"&&code!=="unavailable"?` <em>${escapeHtml(code)}</em>`:""}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}"><button type="button" data-i="${i}" data-o="press"
            ${kann?"":"disabled"}>${escapeHtml(this._t("t_quittieren"))}</button></div></div>`;return}if(f.schalter){let kann=demo||bereich==="switch"||bereich==="input_boolean",knoepfe=[["off","o_aus"],["on","o_ein"]].map(([o,t2])=>`<button type="button" data-i="${i}" data-o="${o}"
              ${kann?"":"disabled"}>${escapeHtml(this._t(t2))}</button>`).join("");html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`;return}if(f.auswahl){let st=q.states[f.id],optionen=st.attributes&&st.attributes.options||[],kann=demo||bereich==="select"||bereich==="input_select",intern=optionen.length===f.auswahl.length&&optionen.every((o,n)=>o===`mode_${n}`),knoepfe=optionen.map((o,n)=>{let text=intern?this._t(f.auswahl[n]):o;return`<button type="button" data-i="${i}" data-o="${escapeHtml(o)}"
              ${kann?"":"disabled"}>${escapeHtml(text)}</button>`}).join("");html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}</span>
          <div class="lhc-tuer-seg" id="tuer-z${i}">${knoepfe}</div></div>`}else{let kann=demo||stellbar(f.id);html+=`<div class="lhc-tuer-zeile" title="${lang}"><span>${titel}${kann?"":`<em> (${escapeHtml(this._t("t_nur_lesbar"))})</em>`}</span>
          <div class="lhc-tuer-stell">
            ${kann?`<button type="button" class="lhc-step klein" data-i="${i}" data-r="-1">&minus;</button>`:""}
            <output id="tuer-z${i}">--</output>
            ${kann?`<button type="button" class="lhc-step klein" data-i="${i}" data-r="1">+</button>`:""}
          </div></div>`}}),abschnitt&&(html+="</div>"),liste.innerHTML=html,this._tuerListe=felder,liste.querySelectorAll("button[data-r]").forEach(b=>b.addEventListener("click",()=>this._tuerStelle(Number(b.dataset.i),Number(b.dataset.r)))),liste.querySelectorAll("button[data-o]").forEach(b=>b.addEventListener("click",()=>this._tuerWaehle(Number(b.dataset.i),b.dataset.o))),felder.forEach((f,i)=>this._tuerZeige(i))},_tuerGrenzen(f){let a=(this._quelle.states[f.id]||{}).attributes||{},zahl=(w,ersatz)=>Number.isFinite(Number(w))&&w!==null&&w!==""?Number(w):ersatz;return{min:zahl(a.min,f.min),max:zahl(a.max,f.max),step:zahl(a.step,f.step)||1}},_tuerWert(f){let neu=this._tuerNeu&&this._tuerNeu[f.id];if(neu)return neu.wert;let st=this._quelle.states[f.id];if(!st)return null;if(f.auswahl||f.schalter)return st.state;if(f.knopf)return null;let ist=parseFloat(st.state);if(Number.isNaN(ist))return null;let gehalten=this._gehaltenerWert(f.id,ist);return gehalten!==null?gehalten:ist},_tuerZeige(i){let f=this._tuerListe&&this._tuerListe[i],el=this.shadowRoot.getElementById(`tuer-z${i}`);if(!f||!el)return;if(f.jaz){this._jazZeige(f,el,this.shadowRoot.getElementById(`tuer-s${i}`));return}if(f.cop){let v=this._cop(this._quelle,f.key);el.textContent=v===null?"--":tf(this._t("j_cop_heute"),{v:fmt(v,1)});return}let geaendert=!!(this._tuerNeu&&this._tuerNeu[f.id]),wert=this._tuerWert(f);if(f.knopf){el.querySelectorAll("button").forEach(b=>{b.classList.toggle("aktiv",geaendert),b.classList.toggle("geaendert",geaendert)});return}if(f.info){el.textContent=wert===null?"--":`${fmt(wert,0)}${f.einheit?` ${f.einheit}`:""}`;return}if(f.auswahl||f.schalter){el.querySelectorAll("button").forEach(b=>{let aktiv=b.dataset.o===wert;b.classList.toggle("aktiv",aktiv),b.classList.toggle("geaendert",aktiv&&geaendert)});return}let stellen=this._tuerGrenzen(f).step<1?1:0;el.textContent=wert===null?"--":`${fmt(wert,stellen)}${f.einheit?` ${f.einheit}`:""}`,el.classList.toggle("geaendert",geaendert)},_tuerStelle(i,richtung){let f=this._tuerListe&&this._tuerListe[i];if(!f)return;let jetzt=this._tuerWert(f);if(jetzt===null)return;let g=this._tuerGrenzen(f),neu=clamp(Math.round((jetzt+richtung*g.step)*100)/100,g.min,g.max);neu!==jetzt&&(this._tuerMerke(f,neu),this._tuerZeige(i))},_tuerWaehle(i,option){let f=this._tuerListe&&this._tuerListe[i];if(f){if(f.knopf){this._tuerNeu&&this._tuerNeu[f.id]?delete this._tuerNeu[f.id]:this._tuerNeu[f.id]={wert:"press",art:"knopf"},this._tuerZeige(i);return}this._tuerMerke(f,option),this._tuerZeige(i)}},_tuerMerke(f,wert){this._tuerNeu||(this._tuerNeu={}),delete this._tuerNeu[f.id];let alt=this._tuerWert(f);wert!==alt&&(this._tuerNeu[f.id]={wert,art:f.auswahl?"auswahl":f.schalter?"schalter":"zahl"})},_tuerUebernehmen(){let q=this._quelle,neu=this._tuerNeu||{};Object.keys(neu).forEach(id=>{let e=neu[id],bereich=id.split(".")[0];e.art==="auswahl"?q.callService(bereich,"select_option",{entity_id:id,option:e.wert}):e.art==="schalter"?q.callService(bereich,e.wert==="on"?"turn_on":"turn_off",{entity_id:id}):e.art==="knopf"?q.callService(bereich,"press",{entity_id:id}):(this._halte(id,e.wert),q.callService(bereich,"set_value",{entity_id:id,value:e.wert}))}),this._schliesseTuer()}};var verlaufKarte={async _ladeTagesstart(){let id=this._e("energy_today");if(!id||!this._quelle||!this._quelle.callWS)return;let jetzt=new Date,mitternacht=new Date(jetzt.getFullYear(),jetzt.getMonth(),jetzt.getDate()).getTime();if(!(this._tagStartTag===mitternacht&&this._tagStart!==void 0)&&!(this._tagVersuch&&jetzt.getTime()-this._tagVersuch<3e5)){this._tagVersuch=jetzt.getTime();try{let antwort=await this._quelle.callWS({type:"history/history_during_period",start_time:new Date(mitternacht).toISOString(),end_time:new Date(mitternacht+12e4).toISOString(),entity_ids:[id],include_start_time_state:!0,significant_changes_only:!1,minimal_response:!0,no_attributes:!0}),reihe=antwort&&antwort[id];if(!reihe||!reihe.length)return;let roh=reihe[0].s!==void 0?reihe[0].s:reihe[0].state,wert=parseFloat(roh);Number.isNaN(wert)||(this._tagStart=wert,this._tagStartTag=mitternacht,this._render())}catch{}}},_verlaufRahmen(x,y,breite,hoehe){return this._config.show_history===!1?(this._verlaufMasse=null,""):(this._verlaufMasse={x,y,breite,hoehe},`
      <g id="verlauf-group" opacity="0">
        <text class="cap-s verlauf-titel" x="${x}" y="${y+14}">${this._t("verbrauch_24")}</text>
        <text class="value-s" id="verlauf-max" x="${x+breite}" y="${y+14}"
              text-anchor="end">--</text>
        <line x1="${x}" y1="${y+26}" x2="${x+breite}" y2="${y+26}"
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
        <g id="verlauf-inhalt"></g>
        <g id="verlauf-kpi"></g>
        <line x1="${x}" y1="${y+hoehe-50}" x2="${x+breite}"
              y2="${y+hoehe-50}" stroke="#2A3446" stroke-width="1"/>
        <text class="cap-s" x="${x}" y="${y+hoehe-36}">SG Ready</text>
        <rect id="verlauf-sg-rahmen" x="${x}" y="${y+hoehe-32}" width="${breite}" height="12"
              rx="3" fill="#0D1219" stroke="#2A3446" stroke-width="1"/>
        <g id="verlauf-sg"></g>
        <text class="hinweis-s" id="verlauf-sg-leer" x="${x}"
              y="${y+hoehe-26}" dominant-baseline="middle" opacity="0">${this._t("kein_verlauf")}</text>
        <text class="value-sp verlauf-text" x="${x}" y="${y+hoehe-4}">${this._t("vor_24h")}</text>
        <text class="value-sp verlauf-text" x="${x+breite}" y="${y+hoehe-36}"
              text-anchor="end"><tspan fill="#FF5F52">${this._t("heizung")}</tspan><tspan fill="#7E8CA0"> · </tspan><tspan fill="#4D9BFF">${this._t("warmwasser")}</tspan><tspan fill="#7E8CA0"> · ${this._t("standby")}</tspan></text>
        <text class="value-sp verlauf-text" x="${x+breite}" y="${y+hoehe-4}"
              text-anchor="end">${this._t("jetzt")}</text>
      </g>`)},_holeVerlauf(){let jetzt=Date.now();if(this._verlaufZeit&&jetzt-this._verlaufZeit<3e5)return;if(this._verlaufZeit=jetzt,this._config.demo){let punkte=[],start2=jetzt-864e5;for(let i=0;i<=96;i++){let stunde=i/4%24,grund=stunde>5&&stunde<9?2.4:stunde>16&&stunde<21?1.8:.4;punkte.push({t:start2+i*9e5,v:Math.max(0,grund+Math.sin(i/3)*.5)})}this._verlauf=punkte;let h=36e5;this._sgVerlauf=[{t:start2,stufe:2},{t:start2+10*h,stufe:3},{t:start2+12*h,stufe:4},{t:start2+13.5*h,stufe:3},{t:start2+15*h,stufe:2},{t:start2+18*h,stufe:1},{t:start2+19*h,stufe:2}],this._zeichneVerlauf();return}let id=this._e("power_now"),vid=this._e("three_way_valve"),k1=this._e("sg_k1"),k2=this._e("sg_k2"),vd=this._e("compressor");if(!id||!this._hass||typeof this._hass.callWS!="function"){this._verlauf=null,this._zeichneVerlauf();return}let ende=new Date,start=new Date(ende.getTime()-864e5);this._hass.callWS({type:"history/history_during_period",start_time:start.toISOString(),end_time:ende.toISOString(),entity_ids:[id,vid,k1,k2,vd].filter(Boolean),minimal_response:!0,no_attributes:!0}).then(antwort=>{let punkte=eid=>(antwort&&eid&&antwort[eid]||[]).map(pkt=>({t:pkt.lu?pkt.lu*1e3:Date.parse(pkt.last_changed),an:["on","true","1"].includes(String(pkt.s!==void 0?pkt.s:pkt.state).toLowerCase())})).filter(pkt=>!Number.isNaN(pkt.t)),r1=punkte(k1),r2=punkte(k2);if(r1.length&&r2.length){let zeiten=[...new Set([...r1,...r2].map(pkt=>pkt.t))].sort((x,y)=>x-y),standBei=(reihe2,t2)=>{let s=reihe2[0].an;for(let pkt of reihe2){if(pkt.t>t2)break;s=pkt.an}return s};this._sgVerlauf=zeiten.map(t2=>{let a1=standBei(r1,t2),a2=standBei(r2,t2),stufe=2;return a1&&!a2?stufe=1:!a1&&a2?stufe=3:a1&&a2&&(stufe=4),{t:t2,stufe}})}else this._sgVerlauf=null;this._verdichterVerlauf=(antwort&&vd&&antwort[vd]||[]).map(pkt=>({t:pkt.lu?pkt.lu*1e3:Date.parse(pkt.last_changed),laeuft:zustandAn(pkt.s!==void 0?pkt.s:pkt.state)===!0})).filter(pkt=>!Number.isNaN(pkt.t)),this._ventilVerlauf=(antwort&&vid&&antwort[vid]||[]).map(p=>({t:p.lu?p.lu*1e3:Date.parse(p.last_changed),ww:warmwasserZustand(p.s!==void 0?p.s:p.state)===!0})).filter(p=>!Number.isNaN(p.t));let reihe=antwort&&antwort[id]||[];this._verlauf=reihe.map(p=>({t:p.lu?p.lu*1e3:Date.parse(p.last_changed),v:parseFloat(p.s!==void 0?p.s:p.state)})).filter(p=>!Number.isNaN(p.v)&&!Number.isNaN(p.t)),this._zeichneVerlauf()}).catch(()=>{this._verlauf=null,this._zeichneVerlauf()})},_zeichneVerlauf(){let sr=this.shadowRoot,gruppe=sr&&sr.getElementById("verlauf-group"),masse=this._verlaufMasse;if(!gruppe||!masse)return;let daten2=this._verlauf||[];if(daten2.length<2){gruppe.setAttribute("opacity","0"),this._diaNachVerlauf();return}let links=masse.x,rechts=masse.x+masse.breite,oben=masse.y+38,unten=masse.y+masse.hoehe-56,t0=daten2[0].t,t1=daten2[daten2.length-1].t,spanne=t1-t0||1,hoechst=Math.max(groesster(daten2.map(d=>d.v)),.1),px=d=>links+(d.t-t0)/spanne*(rechts-links),py=d=>unten-d.v/hoechst*(unten-oben),linie="";daten2.forEach((d,i)=>{linie+=`${i?"L":"M"}${px(d).toFixed(1)} ${py(d).toFixed(1)}`});let ventil=this._ventilVerlauf||[],wwZu=t2=>{let stand2=!1;for(let v of ventil){if(v.t>t2)break;stand2=v.ww}return stand2},verdichter=this._verdichterVerlauf||[],laeuftZu=t2=>{if(!verdichter.length)return!0;let stand2=verdichter[0].laeuft;for(let v of verdichter){if(v.t>t2)break;stand2=v.laeuft}return stand2},grund=kleinster(daten2.map(d=>d.v)),schwelle=grund+Math.max((hoechst-grund)*.08,hoechst*.02),pfade={heiz:"",ww:"",standby:""},mitArt=ventil.length||verdichter.length,ziele=daten2.map(d=>mitArt?!laeuftZu(d.t)&&d.v<=schwelle?"standby":wwZu(d.t)?"ww":"heiz":d.v<=schwelle?"standby":"lauf");if(mitArt){let letztes=null;for(let i=1;i<daten2.length;i++){let a=daten2[i-1],b=daten2[i],ziel=b.v>a.v?ziele[i]:ziele[i-1],von=`${px(a).toFixed(1)} ${py(a).toFixed(1)}`,bis=`${px(b).toFixed(1)} ${py(b).toFixed(1)}`;letztes===ziel?pfade[ziel]+=`L${bis}`:pfade[ziel]+=`M${von}L${bis}`,letztes=ziel}}let heiz=pfade.heiz,ww=pfade.ww,band=sr.getElementById("verlauf-sg"),leer=sr.getElementById("verlauf-sg-leer");if(band){let sgr=this._sgVerlauf;band.textContent="";let ohne=!(sgr&&sgr.length);leer&&leer.setAttribute("opacity",ohne?"1":"0");let rahmen=sr.getElementById("verlauf-sg-rahmen");if(rahmen&&rahmen.setAttribute("opacity",ohne?"0":"1"),sgr&&sgr.length){let bandY=masse.y+masse.hoehe-31,bandLinks=masse.x+1,bandRechts=masse.x+masse.breite-1,t02=daten2.length?daten2[0].t:sgr[0].t,t12=daten2.length?daten2[daten2.length-1].t:Date.now(),zuX=t2=>bandLinks+(clamp(t2,t02,t12)-t02)/(t12-t02||1)*(bandRechts-bandLinks);sgr.forEach((eintrag,i)=>{let bis=i+1<sgr.length?sgr[i+1].t:t12;if(bis<=t02||eintrag.t>=t12)return;let xa=zuX(eintrag.t),xb=zuX(bis);if(xb-xa<.4)return;let info=SG_STATES[eintrag.stufe],r=document.createElementNS("http://www.w3.org/2000/svg","rect");r.setAttribute("x",xa.toFixed(1)),r.setAttribute("y",bandY.toFixed(1)),r.setAttribute("width",(xb-xa).toFixed(1)),r.setAttribute("height","10"),r.setAttribute("fill",info?info.farbe:NEUTRAL),r.setAttribute("opacity","0.9");let titel=document.createElementNS("http://www.w3.org/2000/svg","title");titel.textContent=this._t(info?info.lang:"unbekannt"),r.appendChild(titel),band.appendChild(r)})}}let stil=this._verbrauchStil(),klassisch=stil==="linie",setze=(id,d)=>{let el=sr.getElementById(id);el&&el.setAttribute("d",d)};setze("verlauf-linie",klassisch&&!mitArt?linie:""),setze("verlauf-standby",klassisch?pfade.standby:""),setze("verlauf-heiz",klassisch?heiz:""),setze("verlauf-ww",klassisch?ww:""),setze("verlauf-flaeche",klassisch?`${linie}L${rechts.toFixed(1)} ${unten}L${links.toFixed(1)} ${unten}Z`:"");let einheit=String(attr(this._quelle,this._e("power_now"),"unit_of_measurement","")||""),faktor=/^w$/i.test(einheit)?.001:/^kw$/i.test(einheit)?1:hoechst>=100?.001:1,inKW=hoechst*faktor;sr.getElementById("verlauf-max").textContent=klassisch?tf(this._t("s_max"),{v:`${fmt(inKW,2)} kW`}):"";let inhalt=sr.getElementById("verlauf-inhalt"),kpi=sr.getElementById("verlauf-kpi");if(inhalt&&kpi)if(klassisch)inhalt.innerHTML="",kpi.innerHTML="";else{let ausw=this._verbrauchAuswerten(daten2,ziele,faktor),rahmen={links,rechts,oben,unten,t0,t1,px,py};inhalt.innerHTML=stil==="takte"?this._verbrauchTakte(ausw,rahmen,daten2):stil==="leuchten"?this._verbrauchLeuchten(ausw,rahmen,daten2,ziele):this._verbrauchBalken(ausw,rahmen);let titelBreite=Math.min(masse.breite*.45,190);kpi.innerHTML=this._verbrauchKennzahlen(ausw.summe,masse.x+titelBreite,masse.y+2,masse.breite-titelBreite)}gruppe.setAttribute("opacity","1"),this._diaNachVerlauf()}};var LutarymHeatpumpCard=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._built=!1,this._config=null,this._hass=null,this._auto=null,this._profilId=null,this._dragging=null,this._animLoop=null,this._animTime=0,this._animState=new Map}disconnectedCallback(){this._animLoop&&cancelAnimationFrame(this._animLoop),this._animLoop=null,this._sichtBeobachter&&(this._sichtBeobachter.disconnect(),this._sichtBeobachter=null),this._bewegungMq&&this._bewegungRuf&&this._bewegungMq.removeEventListener("change",this._bewegungRuf),this._bewegungMq=null,this._bewegungRuf=null}connectedCallback(){if(!this._sichtBeobachter&&typeof IntersectionObserver<"u"&&(this._sichtBeobachter=new IntersectionObserver(eintraege=>{let e=eintraege[eintraege.length-1];this._unsichtbar=!e.isIntersecting,!this._unsichtbar&&this._built&&!this._animLoop&&this._startAnimationLoop()}),this._sichtBeobachter.observe(this)),!this._bewegungMq&&window.matchMedia)try{this._bewegungMq=window.matchMedia("(prefers-reduced-motion: reduce)"),this._bewegungRuf=()=>{!this._config||this._config.animate!=="auto"||(this._hass&&this._render(),bewegungReduziert()?(this._animLoop&&cancelAnimationFrame(this._animLoop),this._animLoop=null):this._built&&!this._animLoop&&this._startAnimationLoop())},this._bewegungMq.addEventListener("change",this._bewegungRuf)}catch{this._bewegungMq=null}this._built&&!this._animLoop&&this._startAnimationLoop()}static getConfigElement(){return document.createElement("heatpump-flow-card-by-lutarym-editor")}static getStubConfig(hass){let found=detectIntegration(hass,profilFuer(DEFAULT_CONFIG,hass));return{...DEFAULT_CONFIG,entities:found.found?found.entities:{}}}setConfig(config){if(!config)throw new Error("Keine Konfiguration angegeben.");registriereSprachen(config),this._config={...DEFAULT_CONFIG,...config,entities:{...config.entities||{}}},this._config.fan_count=this._config.fan_count===1?1:2,this._config.hk_count=Math.min(4,Math.max(1,parseInt(this._config.hk_count,10)||2)),this._built=!1,this._auto=null,this._profilId=null,this._config.demo?this._demoAufbauen():this._demo=null,this._tagStart=void 0,this._tagStartTag=void 0,this._tagVersuch=0,this.shadowRoot&&(this.shadowRoot.innerHTML=""),this._quelle&&this._render()}set hass(hass){let alt=this._hass;this._hass=hass,this._config&&(hass&&alt&&hass.entities!==alt.entities&&(this._auto=null,this._profilId=null,this._beobachtet=null),!(alt&&hass&&this._built&&!this._config.demo&&!this._relevantGeaendert(alt,hass))&&this._render())}_thema(){let w=this._config&&this._config.theme||"auto";if(w!=="auto")return w;let dm=this._hass&&this._hass.themes&&this._hass.themes.darkMode;return typeof dm=="boolean"?dm?"dunkel":"hell":window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"hell":"dunkel"}_setzeThema(){let k=this.shadowRoot&&this.shadowRoot.querySelector("ha-card.lhc");if(!k)return;let t2=this._thema();k.dataset.thema!==t2&&(["hell","kontrast","nacht","ha"].forEach(n=>k.classList.toggle(`thema-${n}`,n===t2)),k.dataset.thema=t2)}_relevantGeaendert(alt,neu){if(alt.language!==neu.language||alt.entities!==neu.entities||alt.themes!==neu.themes||!alt.states||!neu.states)return!0;if(this._beobachtetFuer!==this._config||!this._beobachtet){let ids=new Set;profilFeldnamen().forEach(k=>{let id=this._e(k);id&&ids.add(id)}),this._beobachtet=ids,this._beobachtetFuer=this._config}for(let id of this._beobachtet)if(alt.states[id]!==neu.states[id])return!0;return!1}getCardSize(){return 18}get _quelle(){return this._config&&this._config.demo?this._demo:this._hass}_e(key){if(this._config&&this._config.demo)return`demo.${key}`;let eintraege=this._config.entities||{},alias={power_state:"power_switch",buffer_temp:"buffer_top"},configured=eintraege[key]||eintraege[alias[key]];if(configured)return configured;if(!this._quelle)return"";if(!this._auto){let profil=profilFuer(this._config,this._quelle);this._auto=quellenZuordnung(detectIntegration(this._quelle,profil).entities,this._config.extra_heat,profil)}return this._auto[key]||""}_aktivesProfil(){if(this._profilId)return this._profilId;if(!this._hass)return"";let p=profilFuer(this._config,this._hass);return this._profilId=typeof p=="object"&&p?p.id:String(p||""),this._profilId}_hilfePasst(){if(this._config.demo)return!0;let pr=PROFILE.find(x=>x.id===this._aktivesProfil());return!!(pr&&pr.hilfe)}_halte(id,wert){this._gehalten||(this._gehalten={}),this._gehalten[id]={wert,bis:Date.now()+HOLD_MS}}_gehaltenerWert(id,istWert){let eintrag=this._gehalten&&this._gehalten[id];return eintrag?Date.now()>eintrag.bis||istWert===eintrag.wert?(delete this._gehalten[id],null):eintrag.wert:null}_zoneSchalten(nummer){let id=this._e("zones_select");if(!id)return;let jetzt=numState(this._quelle,this._e("zones_state")),zone1=jetzt===null?!0:jetzt===0||jetzt===2,zone2=jetzt===null?!0:jetzt===1||jetzt===2,neu1=nummer===1?!zone1:zone1,neu2=nummer===2?!zone2:zone2;if(!neu1&&!neu2)return;let wert=neu1&&neu2?2:neu1?0:1;this._quelle.callService("select","select_option",{entity_id:id,option:`mode_${wert}`})}_zoneAktiv(nummer){if(!this._e("zones_state"))return null;let jetzt=numState(this._quelle,this._e("zones_state"));return jetzt===null?null:nummer===1?jetzt===0||jetzt===2:jetzt===1||jetzt===2}_sp(){let gewaehlt=this._config&&this._config.language;if(gewaehlt&&gewaehlt!=="auto"&&spracheBekannt(gewaehlt))return gewaehlt;let ha=this._hass&&this._hass.language;if(EIGENE_SPRACHEN[String(ha||"").toLowerCase()])return String(ha).toLowerCase();let kurz=String(ha||"").slice(0,2).toLowerCase();return spracheBekannt(kurz)?kurz:"en"}_name(schluessel){let frueher={label_hk1:"Heizkreis 1",label_hk2:"Heizkreis 2",label_hk3:"Heizkreis 3",label_hk4:"Heizkreis 4",label_dhw:"Warmwasser",label_buffer:"Puffer"},eigen=this._config&&this._config[schluessel];if(eigen&&eigen!==frueher[schluessel])return eigen;if(schluessel==="label_hk1")return`${this._t("heizkreis")} 1`;let hk=/^label_hk([1-4])$/.exec(schluessel);return hk?`${this._t("heizkreis")} ${hk[1]}`:schluessel==="label_dhw"?this._t("warmwasser"):schluessel==="label_buffer"?this._t("puffer"):eigen||""}_hatPuffer(){let e=this._config&&this._config.buffer_present;if(e===!0||e===!1)return e;let id=this._e("buffer_installed"),roh=id&&this._hass&&this._hass.states&&this._hass.states[id];if(!roh)return!0;let s=String(roh.state).toLowerCase();return["on","true","1","enabled","installed","yes"].includes(s)?!0:!["off","false","0","disabled","not installed","no"].includes(s)}_zeigtZirkulation(hass){let e=this._config&&this._config.circulation_present;if(e===!0||e===!1)return e;let id=this._e("circulation_pump")||this._e("circ_switch");return!!id&&!!(hass&&hass.states&&hass.states[id])}_t(schluessel){return t(schluessel,this._sp())}_render(){let sprache=this._sp();setzeDezimal(dezimalFuer(sprache));let puffer=this._hatPuffer(),sprachStand=`${sprache}#${SPRACH_STAND}`;this._built&&(this._gebautMit!==sprachStand||this._gebautPuffer!==puffer)&&(this._built=!1);let neuGebaut=!this._built;this._built||(this._build(),this._built=!0,this._gebautMit=sprachStand,this._gebautPuffer=puffer),this._setzeThema(),this._groesse(),this._update(),this._holeVerlauf(),neuGebaut&&this._verlauf&&this._verlauf.length>=2&&this._zeichneVerlauf(),this._diaEinrichten();let kd=this.shadowRoot.getElementById("kurve-dialog");if(kd&&!kd.dataset.fertig){kd.dataset.fertig="1",kd.addEventListener("click",ev=>{ev.target===kd&&(kd.hidden=!0)});let zu=this.shadowRoot.getElementById("kurve-zu");zu&&zu.addEventListener("click",()=>{kd.hidden=!0})}kd&&!kd.hidden&&(this._kurveRegler(),this._zeichneKurveDialog())}_groesse(){let karte=this.shadowRoot&&this.shadowRoot.querySelector("ha-card"),svg=this.shadowRoot&&this.shadowRoot.querySelector("svg");if(!karte||!svg)return;let b=Number(this._config.card_width)||0,h=Number(this._config.card_height)||0;karte.style.maxWidth=b>0?`${b}px`:"",karte.style.marginInline=b>0?"auto":"",h>0?(svg.style.height=`${h}px`,svg.style.width="100%"):(svg.style.height="",svg.style.width="")}_build(){this._animLoop&&cancelAnimationFrame(this._animLoop),this._animTime=0,this._animState.clear();let root=document.createElement("div");root.innerHTML=`
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
            <div class="lhc-hilfe-fuss"><span id="hilfe-anzahl"></span> · ${escapeHtml(this._t("h_quelle"))}</div>
          </div>
        </div>
        <div class="lhc-tuer" id="tuer-panel" hidden>
          <div class="lhc-tuer-kopf">${escapeHtml(gruppenText("Erweiterte Einstellungen",this._sp()))}</div>
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
    `,this.shadowRoot.replaceChildren(root),this._buildDemo(),this._buildDialog(),this._buildKlicks(),this._buildTuer(),this._buildHilfe(),this._startAnimationLoop()}_animEl(id){this._elCache||(this._elCache=new Map);let el=this._elCache.get(id);return el&&el.isConnected||(el=this.shadowRoot?this.shadowRoot.getElementById(id):null,el?this._elCache.set(id,el):this._elCache.delete(id)),el}_blattFarbe(id,farbe,laeuft){let el=this.shadowRoot&&this.shadowRoot.getElementById(id);el&&(laeuft&&farbe?el.style.fill=farbe:el.style.removeProperty("fill"))}_startAnimationLoop(){if(!animationAn(this._config)){this._animLoop=null;return}let lastTime=performance.now(),tick=time=>{if(!this.isConnected)return;if(this._unsichtbar){this._animLoop=null;return}let deltaTime=(time-lastTime)/1e3;if(lastTime=time,this._animTime+=deltaTime,!this.shadowRoot){this._animLoop=requestAnimationFrame(tick);return}this._animState.forEach((state,id)=>{if(!state||state.type!=="flow")return;let el=this._animEl(id);if(!el)return;let progress=this._animTime%1.2/1.2,offset=state.reverse?44*progress:-44*progress;el.setAttribute("stroke-dashoffset",offset.toFixed(1))}),["buf-bubbles","dhw-bubbles"].forEach(groupId=>{let group=this._animEl(groupId);if(!group)return;this._bubbleCache||(this._bubbleCache=new Map);let bubbles=this._bubbleCache.get(groupId);(!bubbles||!bubbles.length||!bubbles[0].isConnected)&&(bubbles=Array.from(group.querySelectorAll("circle")),this._bubbleCache.set(groupId,bubbles)),bubbles.forEach((bubble,idx)=>{if(bubble.style.animationName==="none"){bubble.getAttribute("opacity")!=="0"&&bubble.setAttribute("opacity","0");return}let dur=bubbleDauer(idx),delay=idx*.3,prog=(this._animTime+delay)%dur/dur,moveY=-330*prog,op=0;prog<.15?op=prog/.15*.4:prog<.85?op=.4:op=.4*(1-(prog-.85)/.15),bubble.setAttribute("transform",`translate(0,${moveY.toFixed(1)})`),bubble.setAttribute("opacity",op.toFixed(3))})}),this._animState.forEach((state,id)=>{if(!state||state.type!=="pulse")return;let el=this._animEl(id);if(!el)return;let cycle=this._animTime%state.duration/state.duration,hoch=typeof state.max=="number"?state.max:1,tief=typeof state.min=="number"?state.min:.4,spanne=hoch-tief,opacity=cycle<.5?hoch-cycle/.5*spanne:tief+(cycle-.5)/.5*spanne;el.setAttribute("opacity",clamp(opacity,0,1).toFixed(2))}),this._animState.forEach((state,id)=>{if(!state||state.type!=="spin")return;let el=this._animEl(id);el&&(typeof state.winkel!="number"&&(state.winkel=0),state.winkel=(state.winkel+deltaTime/state.duration*360+360)%360,el.setAttribute("transform",`rotate(${state.winkel.toFixed(2)} 0 0)`))}),this._animState.forEach((state,id)=>{if(!state)return;if(state.type==="solar"){this._solarBildFrame(this._animTime);return}if(state.type!=="flacker")return;let el=this._animEl(id);if(!el)return;let t2=this._animTime,sy=1+.09*Math.sin(t2*9.1)+.05*Math.sin(t2*14.3+1.3),sx=1-.05*Math.sin(t2*11.7+.7),kipp=3*Math.sin(t2*6.3);el.setAttribute("transform",`skewX(${kipp.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`)}),this._animLoop=requestAnimationFrame(tick)};this._animLoop=requestAnimationFrame(tick)}};Object.assign(LutarymHeatpumpCard.prototype,demoKarte,kennzahlenKarte,verlaufKarte,diagrammeKarte,aktualisierenKarte,dialogKarte,hilfeKarte,tuerKarte,grafikQuerKarte,grafikKlassischKarte,solarKarte,verbrauchStileKarte,sgStileKarte,auswertungKarte,analyseKarte,grafikHochKarte,heizkurveKarte,stilKarte);customElements.define("heatpump-flow-card-by-lutarym",LutarymHeatpumpCard);customElements.define("heatpump-flow-card-by-lutarym-editor",LutarymHeatpumpCardEditor);window.customCards=window.customCards||[];window.customCards.push({type:"heatpump-flow-card-by-lutarym",name:"Heatpump Flow Card by Lutarym",description:"Animated plant diagram with two heating circuits, pumps, tanks, heat curve, SG Ready and flow animation.",preview:!0,documentationURL:"https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym"});console.info(`%c HEATPUMP FLOW CARD BY LUTARYM %c ${CARD_VERSION} `,"background:#0D131B;color:#E0762E;font-weight:600;padding:2px 6px;border-radius:3px 0 0 3px","background:#E0762E;color:#0D131B;font-weight:600;padding:2px 6px;border-radius:0 3px 3px 0");
