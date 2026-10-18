# Changelog

**English** · [Deutsch](#deutsch) · [Français](#français) · [日本語](#日本語)

## v4.0.0

- English: Behind the door, the "Fault" section is replaced by the seasonal performance factor (JAZ): last 12 months and since 1 January. Heat is the sum of heating and hot water from HeishaMon (TOP15 + TOP40, or XTOP3 + XTOP5 if the heat pump sends the extra data block); cooling is not counted. Electricity comes from HeishaMon (TOP16 + TOP41, or XTOP0 + XTOP2) or, with the new option `jaz_source: zaehler`, from the card's energy meter (e.g. Shelly PM). The values come from the Home Assistant long-term statistics and are recalculated at most once an hour; only days with data on both sides count. If the statistics do not reach back to the start of the period, the row says since when it was calculated. Hovering over the value shows heat and electricity in kWh. The editor field "Reset fault" is removed.
- Deutsch: Hinter der Tür ersetzt die Jahresarbeitszahl (JAZ) den Abschnitt „Störung“: letzte 12 Monate und seit 1. Januar. Die Wärme ist die Summe aus Heizen und Warmwasser von HeishaMon (TOP15 + TOP40, oder XTOP3 + XTOP5, wenn die Wärmepumpe den Zusatzblock sendet); Kühlen zählt nicht mit. Der Strom kommt von HeishaMon (TOP16 + TOP41, oder XTOP0 + XTOP2) oder mit der neuen Option `jaz_source: zaehler` vom Energiezähler der Karte (zum Beispiel Shelly PM). Die Werte stammen aus der Langzeitstatistik von Home Assistant und werden höchstens einmal je Stunde neu berechnet; es zählen nur Tage, an denen beide Seiten Daten haben. Reicht die Statistik nicht bis zum Anfang des Zeitraums, steht in der Zeile, ab wann gerechnet wurde. Fährt man mit der Maus über den Wert, erscheinen Wärme und Strom in kWh. Das Editorfeld „Störung quittieren“ entfällt.
- Français : derrière la porte, la section « Défaut » est remplacée par le coefficient de performance annuel (JAZ) : 12 derniers mois et depuis le 1er janvier. La chaleur est la somme du chauffage et de l'eau chaude de HeishaMon (TOP15 + TOP40, ou XTOP3 + XTOP5 si la pompe envoie le bloc supplémentaire) ; le rafraîchissement n'est pas compté. L'électricité vient de HeishaMon (TOP16 + TOP41, ou XTOP0 + XTOP2) ou, avec la nouvelle option `jaz_source: zaehler`, du compteur d'énergie de la carte (par ex. Shelly PM). Les valeurs viennent des statistiques à long terme de Home Assistant et sont recalculées au plus une fois par heure ; seuls les jours avec des données des deux côtés comptent. Si les statistiques ne remontent pas jusqu'au début de la période, la ligne indique depuis quand le calcul est fait. Au survol, la chaleur et l'électricité s'affichent en kWh. Le champ d'éditeur « Acquitter le défaut » est supprimé.
- 日本語：扉の奥の「異常」セクションを年間性能係数（JAZ）に置き換えました：直近 12 か月と 1 月 1 日から。熱量は HeishaMon の暖房と給湯の合計（TOP15 + TOP40、ヒートポンプが追加データブロックを送る場合は XTOP3 + XTOP5）で、冷房は含みません。電力は HeishaMon（TOP16 + TOP41、または XTOP0 + XTOP2）、または新しいオプション `jaz_source: zaehler` でカードの電力量計（例：Shelly PM）から取得します。値は Home Assistant の長期統計から求め、再計算は最大 1 時間に 1 回です。両方のデータがある日だけを数えます。統計が期間の始めまで遡れない場合は、いつから計算したかを表示します。値にマウスを重ねると熱量と電力量を kWh で表示します。エディターの「異常リセット」欄は削除しました。

## v3.8.0

- English: New options `show_help` and `show_door` (editor, section "Display"): hide the "?" help button and the button for the advanced settings on the heat pump. Both are shown by default.
- Deutsch: Neue Optionen `show_help` und `show_door` (Editor, Abschnitt „Darstellung“): Der Knopf „?“ für die Hilfe und der Knopf für die erweiterten Einstellungen an der Wärmepumpe lassen sich ausblenden. Standardmäßig sind beide sichtbar.
- Français : nouvelles options `show_help` et `show_door` (éditeur, section « Affichage ») : le bouton « ? » de l'aide et le bouton des réglages avancés sur la pompe à chaleur peuvent être masqués. Par défaut, les deux sont visibles.
- 日本語：新しいオプション `show_help` と `show_door`（エディターの「表示」）：ヘルプの「?」ボタンと、ヒートポンプの詳細設定ボタンを非表示にできます。初期設定では両方とも表示されます。

## v3.7.2

- English: Temperature differences are now shown in °C instead of K (kelvin): heating curve shift in the setpoint dialog (for example +3 °C), heating spread behind the door, values with the unit K in the value dialog, and all ranges and texts in the help window. A difference of 1 K is exactly 1 °C. The help entry "Kelvin (K)" is now called "Temperature difference" and explains that Panasonic manuals and Home Assistant often write K for it.
- Deutsch: Temperaturunterschiede stehen jetzt in °C statt in K (Kelvin): die Verschiebung der Heizkurve im Sollwert-Dialog (zum Beispiel +3 °C), die Spreizung hinter der Tür, Werte mit der Einheit K im Wertefenster sowie alle Bereiche und Texte im Hilfefenster. Ein Unterschied von 1 K ist genau 1 °C. Der Hilfeeintrag „Kelvin (K)“ heißt jetzt „Temperaturunterschied“ und erklärt, dass Panasonic-Anleitungen und Home Assistant dafür oft K schreiben.
- Français : les écarts de température s'affichent désormais en °C au lieu de K (kelvin) : décalage de la courbe dans la fenêtre de consigne (par exemple +3 °C), écart de chauffage derrière la porte, valeurs en K dans la fenêtre des valeurs, et toutes les plages et textes de la fenêtre d'aide. Un écart de 1 K vaut exactement 1 °C. L'entrée d'aide « Kelvin (K) » s'appelle désormais « Écart de température » et explique que les notices Panasonic et Home Assistant écrivent souvent K.
- 日本語：温度差を K（ケルビン）ではなく °C で表示するようにしました：設定値ダイアログの暖房曲線シフト（例：+3 °C）、扉の奥の暖房温度差、値ウィンドウの単位 K の値、ヘルプ画面のすべての範囲と説明文。1 K の差はちょうど 1 °C です。ヘルプ項目「ケルビン（K）」は「温度差」に改め、Panasonic の説明書や Home Assistant ではよく K と書かれることを説明しています。

## v3.7.1

- English: Help window: every entry now shows its TOP value or command together with the full Home Assistant entity ID (for example `sensor.heishamon_…_top9`, `number.heishamon_…_top9`). A click copies the ID. The search also finds entity IDs. If no matching entity exists, the entry says so. Translations completed: the demo bar (demo mode, standby, valve), "Consumption today", "max" in the history and the label of the setpoint slider were still in German.
- Deutsch: Hilfefenster: Jeder Eintrag zeigt jetzt neben dem TOP-Wert oder Befehl die vollständige Entität aus Home Assistant (zum Beispiel `sensor.heishamon_…_top9`, `number.heishamon_…_top9`). Ein Klick kopiert die Entität. Die Suche findet auch Entitäten. Gibt es keine passende Entität, steht das im Eintrag. Übersetzungen vervollständigt: Die Demoleiste (Demomodus, Bereitschaft, Ventil), „Verbrauch heute“, „max“ im Verlauf und die Beschriftung des Sollwertreglers waren noch deutsch.
- Français : fenêtre d'aide : chaque entrée affiche désormais, à côté de la valeur TOP ou de la commande, l'ID complet de l'entité Home Assistant (par exemple `sensor.heishamon_…_top9`, `number.heishamon_…_top9`). Un clic copie l'ID. La recherche trouve aussi les entités. S'il n'existe aucune entité correspondante, l'entrée l'indique. Traductions complétées : la barre de démo (mode démo, veille, vanne), « Consommation du jour », « max » dans l'historique et le libellé du curseur de consigne étaient encore en allemand.
- 日本語：ヘルプ画面：各項目に TOP 値または命令と並べて、Home Assistant のエンティティ ID 全体を表示するようにしました（例：`sensor.heishamon_…_top9`、`number.heishamon_…_top9`）。クリックで ID をコピーできます。検索でもエンティティを探せます。該当するエンティティがない場合はその旨を表示します。翻訳を補完：デモバー（デモモード、待機、バルブ）、「本日の消費電力量」、履歴の「最大」、設定値スライダーのラベルがドイツ語のままでした。

## v3.7.0

- English: Help window. The "?" at the bottom right of the card opens a large window explaining everything HeishaMon can read and write in plain language: all values TOP0 to TOP143, the precise values XTOP0 to XTOP5, the optional board values OPT0 to OPT6, every command of the firmware, 1-Wire, S0 and OpenTherm. 207 entries in 16 groups, with search and group filter, in all four languages. Each entry shows whether the value is read, written or both, the command name and the range. Only what the HeishaMon documentation and the Panasonic manual say is stated; where they give no details, the entry says so.
- Deutsch: Hilfefenster. Das „?“ unten rechts in der Karte öffnet ein großes Fenster, das in einfacher Sprache alles erklärt, was HeishaMon lesen und schreiben kann: alle Werte TOP0 bis TOP143, die genauen Werte XTOP0 bis XTOP5, die Werte der Optional-Platine OPT0 bis OPT6, jeden Befehl der Firmware, 1-Wire, S0 und OpenTherm. 207 Einträge in 16 Gruppen, mit Suche und Gruppenfilter, in allen vier Sprachen. Jeder Eintrag zeigt, ob der Wert gelesen, geschrieben oder beides wird, den Befehlsnamen und den Bereich. Behauptet wird nur, was in der HeishaMon-Dokumentation und der Panasonic-Anleitung steht; wo dort nichts Genaues steht, sagt der Eintrag das.
- Français : fenêtre d'aide. Le « ? » en bas à droite de la carte ouvre une grande fenêtre qui explique simplement tout ce que HeishaMon peut lire et écrire : toutes les valeurs TOP0 à TOP143, les valeurs précises XTOP0 à XTOP5, les valeurs de la carte optionnelle OPT0 à OPT6, chaque commande du firmware, 1-Wire, S0 et OpenTherm. 207 entrées en 16 groupes, avec recherche et filtre par groupe, dans les quatre langues. Chaque entrée indique si la valeur est lue, écrite ou les deux, le nom de la commande et la plage. Seul ce que disent la documentation HeishaMon et la notice Panasonic est affirmé ; quand elles ne précisent rien, l'entrée l'indique.
- 日本語：ヘルプ画面。カード右下の「?」で大きな画面が開き、HeishaMon が読み書きできるすべてを分かりやすく説明します：TOP0〜TOP143 の全値、詳細値 XTOP0〜XTOP5、オプション基板の値 OPT0〜OPT6、ファームウェアの全命令、1-Wire、S0、OpenTherm。16 グループ 207 項目、検索とグループ絞り込み付き、4 言語対応。各項目に読み取り・書き込みの別、命令名、範囲を表示します。HeishaMon の説明書と Panasonic の取扱説明書に書かれていることだけを述べ、詳しい記載がない場合はその旨を示します。

## v3.6.0

- English: The door now swings in 3D on its own graphics layer and runs smoothly; before, the whole heat pump drawing was redrawn in every frame. New sections behind the door: Operation (holiday mode, weekly schedule, Smart DHW), Fault (reset with the current error code shown) and Info (operating hours, compressor starts, heater hours for heating and hot water). If the height is not enough, the panel widens to two or three columns instead of scrolling.
- Deutsch: Die Tür schwenkt jetzt räumlich auf einer eigenen Grafikebene und läuft flüssig; bisher wurde die ganze Wärmepumpe in jedem Bild neu gezeichnet. Neue Abschnitte hinter der Tür: Betrieb (Urlaub, Wochenprogramm, Smart DHW), Störung (Quittieren, daneben der aktuelle Fehlercode) und Info (Betriebsstunden, Verdichterstarts, Heizstab-Stunden für Heizen und Warmwasser). Reicht die Höhe nicht, wird das Feld zwei- oder dreispaltig statt zu scrollen.
- Français : la porte pivote désormais en 3D sur son propre calque graphique et s'anime de façon fluide ; auparavant, tout le dessin de la pompe était redessiné à chaque image. Nouvelles sections derrière la porte : Fonctionnement (vacances, programme hebdomadaire, Smart DHW), Défaut (acquittement avec le code d'erreur actuel) et Infos (heures de fonctionnement, démarrages du compresseur, heures d'appoint chauffage et eau chaude). Si la hauteur ne suffit pas, le panneau passe sur deux ou trois colonnes au lieu de défiler.
- 日本語：扉は独立したグラフィックレイヤー上で立体的に回転し、滑らかに動くようになりました。従来はヒートポンプ全体を毎フレーム再描画していました。扉の奥に新しいセクションを追加：運転（休暇、週間スケジュール、スマート給湯）、異常（現在のエラーコードを表示してリセット）、情報（運転時間、圧縮機起動回数、暖房・給湯ヒーターの運転時間）。高さが足りない場合は、スクロールせずに 2 列または 3 列で表示します。

## v3.5.0

- English: Door in the heat pump. A button at the bottom right of the heat pump opens its front like a door to the left. Behind it are advanced settings not shown elsewhere in the card: heating off above outdoor temperature (TOP77), heater on below outdoor temperature (TOP78), heating spread (TOP23), heating control, legionella temperature and hold time (TOP70, TOP71), pump control, max. pump duty (TOP95) and quiet mode priority. Changes are only sent with "Apply", then the door closes; "Cancel" discards them. Ranges follow the entity, otherwise the HeishaMon documentation. Entities are detected automatically; the button only appears if at least one exists.
- Deutsch: Tür in der Wärmepumpe. Ein Knopf unten rechts klappt die Front der Wärmepumpe wie eine Tür nach links auf. Dahinter liegen erweiterte Einstellungen, die die Karte sonst nicht zeigt: Heizen aus ab Außentemperatur (TOP77), Heizstab ein unter Außentemperatur (TOP78), Spreizung Heizen (TOP23), Regelung, Legionellen Temperatur und Haltezeit (TOP70, TOP71), Pumpenregelung, max. Pumpenleistung (TOP95) und Vorrang im Leisemodus. Änderungen werden erst mit „Übernehmen“ gesendet, danach schließt sich die Tür; „Abbrechen“ verwirft sie. Die Bereiche kommen von der Entität, sonst aus der HeishaMon-Dokumentation. Die Entitäten werden automatisch erkannt, der Knopf erscheint nur, wenn mindestens eine vorhanden ist.
- Français : porte dans la pompe à chaleur. Un bouton en bas à droite ouvre la façade comme une porte vers la gauche. Derrière se trouvent des réglages avancés absents du reste de la carte : arrêt du chauffage au-dessus d'une température extérieure (TOP77), appoint actif en dessous (TOP78), écart de chauffage (TOP23), régulation, température et durée anti-légionelles (TOP70, TOP71), régulation de pompe, puissance max. de pompe (TOP95) et priorité du mode silencieux. Les modifications ne sont envoyées qu'avec « Appliquer », puis la porte se referme ; « Annuler » les abandonne. Les plages viennent de l'entité, sinon de la documentation HeishaMon. Les entités sont détectées automatiquement ; le bouton n'apparaît que si au moins une existe.
- 日本語：ヒートポンプの扉。ヒートポンプ右下のボタンで前面が扉のように左へ開きます。奥にはカードの他の場所にない詳細設定があります：暖房停止外気温（TOP77）、ヒーター開始外気温（TOP78）、暖房温度差（TOP23）、暖房制御、レジオネラ対策の温度と保持時間（TOP70、TOP71）、ポンプ制御、ポンプ最大出力（TOP95）、静音モード優先。変更は「適用」で初めて送信され、扉が閉じます。「キャンセル」で破棄します。範囲はエンティティの値、なければ HeishaMon のドキュメントに従います。エンティティは自動検出され、少なくとも 1 つある場合のみボタンを表示します。

## v3.0.8

- English: New options `show_target` and `show_reload` (editor, section "Display"): hide the "Target …" and "Reloads at …" lines in the buffer and hot water tank. The remaining lines move up.
- Deutsch: Neue Optionen `show_target` und `show_reload` (Editor, Abschnitt „Darstellung“): Die Zeilen „Ziel …“ und „Lädt ab …“ im Puffer und im Warmwasserspeicher lassen sich ausblenden. Die übrigen Zeilen rücken nach oben.
- Français : nouvelles options `show_target` et `show_reload` (éditeur, section « Affichage ») : les lignes « Cible … » et « Recharge à … » du ballon tampon et du ballon d'eau chaude peuvent être masquées. Les lignes restantes remontent.
- 日本語：新しいオプション `show_target` と `show_reload`（エディターの「表示」）：バッファーと給湯タンクの「目標 …」と「再加熱 …」の行を非表示にできます。残りの行は上に詰めて表示します。

## v3.0.7

- English: Heating circuit target in heat curve mode (TOP76 = 0): the dialog now sets the curve shift from −5 to +5 K and shows the resulting water target. Previously it showed the water temperature and sent values like 37 that the heat pump only accepts as a shift. Direct mode is unchanged. The "Heater" badge now shows when a heater is actually running (TOP60 internal, TOP61 external), in the tank the three-way valve currently serves; TOP58/TOP59 only mean the heater is allowed, and the buttons now say "allow/block". COP: the separate "measured" entities are gone, the source is chosen in the integration under "COP source". "Show history" is now translated.
- Deutsch: Heizkreis-Sollwert im Heizkurvenbetrieb (TOP76 = 0): Der Dialog stellt jetzt die Verschiebung der Heizkurve von −5 bis +5 K und zeigt die daraus folgende Wassertemperatur. Bisher zeigte er die Wassertemperatur und sendete Werte wie 37, die die Wärmepumpe dort nur als Verschiebung annimmt. Der Direktbetrieb bleibt unverändert. Das Abzeichen „Heizstab“ erscheint jetzt nur, wenn ein Heizstab wirklich heizt (TOP60 intern, TOP61 extern), und zwar in dem Speicher, auf den das Dreiwegeventil gerade stellt; TOP58/TOP59 bedeuten nur „freigegeben“, die Knöpfe heißen jetzt „freigeben/sperren“. COP: Die getrennten Entitäten „gemessen“ entfallen, die Quelle wird in der Integration unter „COP Quelle“ gewählt. „Verlauf anzeigen“ ist jetzt übersetzt.
- Français : consigne de circuit en mode courbe (TOP76 = 0) : la fenêtre règle désormais le décalage de la courbe de −5 à +5 K et affiche la température d'eau qui en résulte. Auparavant elle affichait la température d'eau et envoyait des valeurs comme 37, que la pompe n'accepte ici que comme décalage. Le mode direct est inchangé. Le badge « Appoint » n'apparaît plus que si un appoint chauffe réellement (TOP60 interne, TOP61 externe), dans le ballon desservi par la vanne trois voies ; TOP58/TOP59 signifient seulement « autorisé », les boutons indiquent désormais « autoriser/bloquer ». COP : les entités « mesuré » séparées disparaissent, la source se choisit dans l'intégration sous « Source COP ». « Afficher l'historique » est désormais traduit.
- 日本語：暖房曲線モード（TOP76 = 0）の回路設定値：ダイアログで曲線のシフトを −5〜+5 K で設定し、その結果の目標水温を表示するようにしました。従来は水温を表示し、37 のような値を送信していましたが、このモードではシフト値としてしか受け付けられません。直接モードは変更ありません。「ヒーター」バッジは、ヒーターが実際に運転しているとき（TOP60 内部、TOP61 外部）にのみ、三方弁が切り替わっているタンクに表示します。TOP58/TOP59 は「許可」を意味するだけなので、ボタン表記を「許可/禁止」に変更しました。COP：「実測」用の個別エンティティを廃止し、ソースは統合の「COP ソース」で選択します。「履歴を表示」を翻訳しました。

## v3.0.6

- English: The COP in the buffer and hot water tank is now the average of the current day since midnight, weighted by time. Unknown values and values up to 0 (compressor off) are ignored. The measured value is preferred; if it has no value today, the calculated one is used. Updated every five minutes.
- Deutsch: Der COP im Puffer und im Warmwasserspeicher ist jetzt der Durchschnitt des aktuellen Tages seit Mitternacht, nach Zeit gewichtet. Unbekannte Werte und Werte bis 0 (Verdichter aus) zählen nicht. Bevorzugt wird der gemessene Wert; hat er heute keinen Wert, gilt der berechnete. Aktualisierung alle fünf Minuten.
- Français : le COP du ballon tampon et du ballon d'eau chaude est désormais la moyenne de la journée en cours depuis minuit, pondérée dans le temps. Les valeurs inconnues et celles jusqu'à 0 (compresseur arrêté) sont ignorées. La valeur mesurée est prioritaire ; sans valeur aujourd'hui, la valeur calculée est utilisée. Mise à jour toutes les cinq minutes.
- 日本語：バッファーと給湯タンクの COP を、当日 0 時からの時間加重平均に変更しました。不明な値と 0 以下の値（圧縮機停止）は除外します。実測値を優先し、当日の値がない場合は算出値を使用します。5 分ごとに更新します。

## v3.0.5

- English: The heating buffer now shows the heating COP and the hot water tank the hot water COP from HeishaMon by Lutarym. The measured value (external power meter) is preferred; if it is unknown or unavailable, the calculated value is used. Both entities are detected automatically and can be set in the editor.
- Deutsch: Der Heizungspuffer zeigt jetzt den COP Heizen und der Warmwasserspeicher den COP Warmwasser aus HeishaMon by Lutarym. Bevorzugt wird der gemessene Wert (externer Strommesser); ist er unbekannt oder nicht verfügbar, wird der berechnete genommen. Beide Entitäten werden automatisch erkannt und lassen sich im Editor eintragen.
- Français : le ballon tampon affiche désormais le COP chauffage et le ballon d'eau chaude le COP eau chaude de HeishaMon by Lutarym. La valeur mesurée (compteur externe) est prioritaire ; si elle est inconnue ou indisponible, la valeur calculée est utilisée. Les deux entités sont détectées automatiquement et peuvent être saisies dans l'éditeur.
- 日本語：HeishaMon by Lutarym の COP を表示するようにしました。バッファータンクに暖房 COP、給湯タンクに給湯 COP を表示します。実測値（外部電力計）を優先し、不明または利用不可の場合は算出値を使用します。どちらのエンティティも自動検出され、エディターで設定できます。

## v3.0.4

- English: The display name is now "Heatpump Flow Card by Lutarym" with spaces. Repository, card type, element name and file name keep their hyphens and are unchanged, so no dashboard needs editing.
- Deutsch: Der angezeigte Name lautet jetzt "Heatpump Flow Card by Lutarym" mit Leerzeichen. Repository, Kartentyp, Elementname und Dateiname behalten ihre Bindestriche und bleiben unverändert, es muss also kein Dashboard angepasst werden.
- Français : le nom affiché est désormais « Heatpump Flow Card by Lutarym » avec des espaces. Le dépôt, le type de carte, le nom de l'élément et le nom du fichier conservent leurs tirets et restent inchangés, aucun tableau de bord n'est donc à modifier.
- 日本語：表示名をスペース区切りの「Heatpump Flow Card by Lutarym」に変更しました。リポジトリ、カードタイプ、要素名、ファイル名はハイフンのまま変更していないため、ダッシュボードの修正は不要です。

## v3.0.3

- English: Renamed to Heatpump-Flow-Card-by-Lutarym. Repository, card type, element and file are now called heatpump-flow-card-by-lutarym. **Breaking change:** change `type: custom:lutarym-heatpump-card` to `type: custom:heatpump-flow-card-by-lutarym` in your dashboards.
- Deutsch: Umbenannt in Heatpump-Flow-Card-by-Lutarym. Repository, Kartentyp, Element und Datei heißen jetzt heatpump-flow-card-by-lutarym. **Achtung:** In deinen Dashboards `type: custom:lutarym-heatpump-card` auf `type: custom:heatpump-flow-card-by-lutarym` ändern.
- Français : renommée en Heatpump-Flow-Card-by-Lutarym. Le dépôt, le type, l'élément et le fichier s'appellent désormais heatpump-flow-card-by-lutarym. **Changement incompatible :** remplacez `type: custom:lutarym-heatpump-card` par `type: custom:heatpump-flow-card-by-lutarym`.
- 日本語：Heatpump-Flow-Card-by-Lutarym に改名。リポジトリ、カードタイプ、要素名、ファイル名をすべて heatpump-flow-card-by-lutarym に変更。**互換性のない変更：** ダッシュボードの `type: custom:lutarym-heatpump-card` を `type: custom:heatpump-flow-card-by-lutarym` に変更してください。

## v3.0.2

- English: Links between the README files are relative now, so they no longer depend on the repository name. Only the screenshot uses a full address, otherwise HACS could not show it.
- Deutsch: Die Verweise zwischen den README-Dateien sind jetzt relativ und hängen damit nicht mehr vom Namen des Repositorys ab. Nur der Screenshot nutzt eine vollständige Adresse, sonst könnte HACS ihn nicht anzeigen.
- Français : les liens entre les fichiers README sont désormais relatifs et ne dépendent plus du nom du dépôt. Seule la capture utilise une adresse complète, sinon HACS ne pourrait pas l'afficher.
- 日本語：README 間のリンクを相対パスにし、リポジトリ名に依存しないようにしました。スクリーンショットのみ完全な URL を使用します。そうしないと HACS で表示できないためです。

## v3.0.1

- English: HACS validation added as a GitHub action, required for the default HACS catalogue. Screenshots per language. Repository links corrected. LICENSE now contains the full GPL 3.0 text, so GitHub and HACS recognise the license.
- Deutsch: HACS-Prüfung als GitHub-Action ergänzt, Voraussetzung für den offiziellen HACS-Katalog. Screenshots je Sprache. Repository-Adressen korrigiert. LICENSE enthält jetzt den vollständigen Text der GPL 3.0, damit GitHub und HACS die Lizenz erkennen.
- Français : validation HACS ajoutée comme action GitHub, requise pour le catalogue officiel HACS. Captures par langue. Liens du dépôt corrigés. LICENSE contient désormais le texte complet de la GPL 3.0, afin que GitHub et HACS reconnaissent la licence.
- 日本語：HACS 公式カタログに必要な HACS 検証を GitHub アクションとして追加。言語ごとのスクリーンショット。リポジトリのリンクを修正。GitHub と HACS がライセンスを認識できるよう、LICENSE に GPL 3.0 の全文を収録。

## v3.0.0

### English

First public release. Summary compared with the 2.x series:

- New name: Heat Pump Card by Lutarym. The technical name lutarym-heatpump-card stays, existing configurations keep working
- Four languages: English, German, French and Japanese. Follows the Home Assistant language or can be fixed. Numbers with comma or point depending on the language
- Heat curve for circuit 1 and 2 in its own window, opened from the circuit, with scale, operating point and adjustable corner points. Writes through number entities or the HeishaMon command SetCurves
- Systems without a heating buffer, detected automatically from TOP99 or set manually. The diagram closes the gap, the animation follows the hydraulics
- Circulation automatic, shown or hidden
- Energy chart for the past 24 hours, coloured by heating, hot water and standby, with the SG Ready history below
- Portrait as a layout of its own
- Export and import of the configuration through a text field or a file, with a check of the entities
- Manufacturer profiles prepared, implemented are HeishaMon by Lutarym and HeishaMon via the MQTT naming scheme

### Deutsch

Erste öffentliche Version. Zusammenfassung gegenüber der 2er-Reihe:

- Neuer Name: Heat Pump Card by Lutarym. Der technische Name lutarym-heatpump-card bleibt, bestehende Konfigurationen laufen weiter
- Vier Sprachen: Englisch, Deutsch, Französisch und Japanisch. Folgt der Sprache von Home Assistant oder fest wählbar. Zahlen mit Komma oder Punkt je Sprache
- Heizkurve für Heizkreis 1 und 2 in einem eigenen Fenster, aufrufbar aus dem jeweiligen Heizkreis, mit Skala, Betriebspunkt und einstellbaren Eckwerten. Schreibt über number-Entitäten oder den HeishaMon-Befehl SetCurves
- Anlagen ohne Heizungspuffer, automatisch erkannt über TOP99 oder fest einstellbar. Die Grafik rückt nach, die Animation folgt der Hydraulik
- Zirkulation automatisch, ein- oder ausblendbar
- Verbrauchsverlauf über 24 Stunden, gefärbt nach Heizung, Warmwasser und Standby, darunter der SG-Ready-Verlauf
- Hochformat als eigene Anordnung
- Konfiguration über Textfeld oder Datei aus- und einlesen, mit Prüfung der Entitäten
- Herstellerprofile vorbereitet, umgesetzt sind HeishaMon by Lutarym und HeishaMon über das MQTT-Namensschema

### Français

Première version publique. Résumé par rapport à la série 2.x :

- Nouveau nom : Heat Pump Card by Lutarym. Le nom technique lutarym-heatpump-card reste, les configurations existantes continuent de fonctionner
- Quatre langues : anglais, allemand, français et japonais. Suit la langue de Home Assistant ou peut être fixée. Nombres avec virgule ou point selon la langue
- Courbe de chauffe des circuits 1 et 2 dans une fenêtre dédiée, ouverte depuis le circuit, avec échelle, point de fonctionnement et points réglables. Écrit via des entités number ou la commande HeishaMon SetCurves
- Installations sans ballon tampon, détectées automatiquement via TOP99 ou réglées manuellement. Le schéma se resserre, l'animation suit l'hydraulique
- Circulation automatique, affichée ou masquée
- Graphique de consommation sur 24 heures, coloré selon chauffage, eau chaude et veille, avec l'historique SG Ready en dessous
- Portrait comme disposition à part entière
- Export et import de la configuration par champ de texte ou fichier, avec vérification des entités
- Profils de fabricants préparés, sont disponibles HeishaMon by Lutarym et HeishaMon via le nommage MQTT

### 日本語

最初の公開版です。2.x 系列からの主な変更：

- 新しい名前：Heat Pump Card by Lutarym。技術名 lutarym-heatpump-card はそのままで、既存の設定は引き続き使えます
- 4 言語：英語、ドイツ語、フランス語、日本語。Home Assistant の言語に従うか固定できます。数値の小数点は言語に合わせます
- 回路1と回路2の暖房曲線を専用ウィンドウに表示。各回路から開き、目盛り、運転点、調整可能な基準点つき。number エンティティまたは HeishaMon コマンド SetCurves で書き込み
- 暖房バッファーのないシステムに対応。TOP99 で自動検出、または手動設定。図は詰めて表示され、アニメーションは配管動作に従います
- 循環は自動、表示、非表示から選択
- 過去24時間の使用量グラフ。暖房、給湯、待機で色分けし、その下に SG Ready の履歴
- 縦長を独立したレイアウトとして用意
- テキスト欄またはファイルで設定を書き出しと読み込み。エンティティを確認
- メーカープロファイルを準備。実装済みは HeishaMon by Lutarym と MQTT 命名規則の HeishaMon

## Earlier versions

The entries below are in German. · Die folgenden Einträge sind auf Deutsch. · Les entrées suivantes sont en allemand. · 以下の項目はドイツ語です。

### v2.37.4
- Durchfluss wird bei kleinen Werten nicht mehr gelb. Die Richtwerte für
  Strömungsgeschwindigkeiten betreffen die Auslegung, im Betrieb ist nur
  die Obergrenze relevant: gelb ab 0,8 m/s, rot über 1 m/s wegen
  möglicher Strömungsgeräusche
- Bedienhilfe am Durchflusswert ohne deutschen Text

### v2.37.3
- Die Meldung "Warmwasser hat Vorrang" im Puffer entfällt. Während der
  Warmwasserladung bleibt stattdessen das zuletzt gültige Pufferziel
  stehen, samt Ladeschwelle
- Beschriftung der Ladeschwelle im Englischen und Französischen gekürzt,
  sie reichte bis an den Rand des Speichers

### v2.37.2
- Ohne Heizungspuffer rückt die Anlage vollständig nach: 160 statt 100
  Einheiten. Der erste Heizkreis steht 21 Einheiten neben der
  senkrechten Leitung, der Sekundärkreis beginnt genau dort
- Animation ohne Puffer: durch die Heizkreise fließt es nur, wenn die
  Wärmepumpe gerade in die Heizung fördert und der Kreis offen ist.
  Eine laufende Kreispumpe allein genügt nicht mehr, bei
  Warmwasserladung stehen die Heizkreise. Vor- und Rücklauf tragen
  dann die Temperaturen der Wärmepumpe statt der Puffertemperatur
- Mit Puffer unverändert

### v2.37.1
- Querformat ohne Heizungspuffer: Sekundärkreis, Heizkreise, Zirkulation,
  Warmwasser und Druck rücken um 100 Einheiten nach, die Karte wird
  entsprechend schmaler. Der Sekundärkreis beginnt direkt an der
  senkrechten Leitung
- Verbrauchsverlauf richtet sich am tatsächlichen rechten Rand aus. Mit
  nur einem Heizkreis ragte er bisher über die Karte hinaus
- Breite des Verlaufs so begrenzt, dass er nie an das Umschaltventil stößt

### v2.37.0
- Heizungspuffer wird automatisch aus TOP99 Buffer_Installed erkannt und
  lässt sich im Einstellungsdialog fest auf vorhanden oder nicht
  vorhanden stellen. Ändert sich TOP99, zeichnet die Karte neu
- Zirkulation im Einstellungsdialog: automatisch, anzeigen oder
  ausblenden. Automatisch zeigt sie, sobald eine Zirkulationsentität
  zugeordnet ist

### v2.36.0
- Anlagen ohne Heizungspuffer: neue Einstellung "Heizungspuffer vorhanden".
  Ohne Puffer führen Vor- und Rücklauf direkt in den Sekundärkreis.
  Im Hochformat rückt alles darunter nach oben, die Karte wird kürzer

### v2.35.2
- Verbrauchsverlauf zeigt Standby grau. Rot und blau erscheinen nur,
  solange der Verdichter läuft. Vorher entschied allein das
  Umschaltventil, das auch im Stillstand auf Heizung steht
- Legende um Standby ergänzt

### v2.35.1
- Letzte deutsche Reste übersetzt, die nur in bestimmten Zuständen
  erschienen: Einheit U/min, Zonen unbekannt, Einziger aktiver Heizkreis
  sowie die Titel im Heizkurvenfenster vor dem ersten Zeichnen
- Dezimaltrennzeichen je Sprache: Komma in Deutsch und Französisch,
  Punkt in Englisch und Japanisch

### v2.35.0
- Vollständig übersetzt in Deutsch, Englisch, Französisch und Japanisch:
  Grafik, alle Fenster, Heizkurvenfenster, Einstellungsdialog, die Namen
  und Gruppen aller 62 Entitätsfelder, Meldungen, Betriebsarten, Stufen,
  Demoleiste und Symboltitel
- Standardnamen der Baugruppen folgen der Sprache. Eigene Namen bleiben,
  der frühere deutsche Standardname wird als nicht gesetzt behandelt

### v2.34.0
- Mehrsprachig: Deutsch, Englisch, Französisch und Japanisch. Die Karte
  folgt der Spracheinstellung von Home Assistant, im Einstellungsdialog
  lässt sich eine Sprache fest wählen
- Übersetzt sind die Beschriftungen der Grafik und die SG-Ready-Zustände.
  Der Einstellungsdialog und die Namen der Entitätsfelder folgen
- Fehler behoben: der Aufbau hängte die Karte an, statt den alten Inhalt
  zu ersetzen. Bei einem Neuaufbau entstand eine zweite Kopie im
  Schattenbaum

### v2.33.0
- Karte heißt jetzt "Heat Pump Card by Lutarym", in Kartenauswahl, HACS,
  README und Konsolenmeldung. Beschreibung auf Englisch
- Der technische Name lutarym-heatpump-card bleibt unverändert,
  bestehende Konfigurationen laufen weiter

### v2.32.1
- Fehler behoben: eine alte Stilregel setzte den Bedienbereich der
  Fenster wieder einspaltig und hob damit die Zweispaltigkeit auf, die
  seit v2.22.0 vorgesehen war
- Drei tote Stilregeln aus dem früheren zweizeiligen Zahlenfeld entfernt

### v2.32.0
- Anlage rückt 30 Einheiten nach unten, der Verbrauchsverlauf bleibt oben
  rechts stehen. Der Abstand zwischen beiden wächst von 12 auf 42
  Einheiten. Die Karte wird dadurch rund vier Prozent höher

### v2.31.2
- Polsterung der Karte verringert: oben von 16 auf 6, an den Seiten von
  20 auf 8, unten von 22 auf 12 Punkte. Die Zeichnung nutzt die Karte
  dadurch fast vollständig aus

### v2.31.1
- Kartenausschnitt wieder wie zuvor, die Karte wird nicht höher
- Verbrauchsverlauf sitzt weiter oben und weiter rechts: y 84 statt 88,
  rechter Rand 1640 statt 1600

### v2.31.0
- Verbrauchsverlauf sitzt ganz oben rechts. Der Kartenausschnitt beginnt
  dafür 60 Einheiten höher, der Abstand zur Vorlaufleitung wächst von
  8 auf 64 Einheiten

### v2.30.3
- Unterer Zirkulationsstrang liegt auf y=620, also auf der Höhe des
  Sekundärrücklaufs, auf den auch HK1 und HK2 münden. Der obere Strang
  liegt wie bisher auf 320, der Höhe des Sekundärvorlaufs

### v2.30.2
- Unterer Strang der Zirkulation liegt jetzt auf y=589, auf einer Linie
  mit den Rückläufen von HK1 und HK2. Vorher lag er 29 Einheiten höher

### v2.30.1
- SG-Ready-Band über die volle Breite, die Beschriftung steht darüber
  statt daneben. Vorher fehlten am Ende mehrere Stunden
- Legende Heizung und Warmwasser in dieselbe Zeile wie die Beschriftung
  verschoben
- Verlaufsfeld nach oben gerückt und begrenzt, es überlagerte die
  Warmwasserleitung bei y=240

### v2.30.0
- SG-Ready-Bereich als eigener Abschnitt: Trennlinie darüber, Beschriftung
  SG Ready links und ein umrandetes Feld, in dem das farbige Band liegt
- Breite des Stromverlaufs im Einstellungsdialog einstellbar, 250 bis 700.
  Der rechte Rand bleibt stehen, das Feld wächst nach links in den Platz
  der früheren Heizkurve. Im Hochformat höchstens 360

### v2.29.0
- Vorlauf, Rücklauf und Leistungsaufnahme aus dem Wärmepumpenfenster
  entfernt, die Werte stehen anklickbar in der Hauptansicht
- SG Ready als farbiges Band über 24 Stunden unter dem Verbrauchsverlauf.
  Rot Sperre, grau Normalbetrieb, gelb Einschaltempfehlung, grün
  Anlaufbefehl. Ohne die beiden Kontakte bleibt das Band leer

### v2.28.1
- Regler im Kurvenfenster stehen wieder zweispaltig. Eine Stilregel für
  das Baugruppenfenster hatte auch dort gegriffen und sie untereinander
  gestellt, wodurch das Fenster 60 Pixel zu hoch wurde

### v2.28.0
- Heizkurvenfenster liegt über dem ganzen Bildschirm statt nur über der
  Karte. Vorher war es auf die Kartenhöhe begrenzt, im Querformat rund
  212 Pixel, wodurch Scrollen unvermeidbar war
- Breite passt sich an: zwei Drittel auf großen Bildschirmen, fast die
  volle Breite auf dem Handy

### v2.27.1
- Fenster der Heizkreise braucht rund 40 Pixel weniger: kürzere
  Beschriftungen, dadurch zwei Schaltflächen nebeneinander
- Die Zonenschaltfläche heißt jetzt Zone zu- und abschalten, der
  Kreisschalter Kreis ein- und ausschalten. Vorher hießen beide fast
  gleich, obwohl sie Verschiedenes tun

### v2.27.0
- Warmwasserfenster braucht rund 70 Pixel weniger Höhe: kürzere
  Beschriftungen auf den Schaltflächen, dadurch zwei Spalten statt drei
  Zeilen, einzeiliges Zahlenfeld und eine kleinere Wertanzeige

### v2.26.2
- Aktualisierung deutlich schneller: die Elementzugriffe laufen über den
  vorhandenen Zwischenspeicher, 108 statt 12 Zugriffe je Lauf, rund
  27 Prozent weniger Rechenzeit
- Toter Code entfernt: eine übrig gebliebene Hilfsfunktion aus dem
  früheren Drehansatz und eine ungenutzte Stilklasse

### v2.26.1
- Beim Einlesen einer Konfiguration werden die Entitäten einzeln geprüft:
  unbekannte Felder, unpassender Entitätsbereich und in Home Assistant
  fehlende Entitäten werden gemeldet
- Nach dem Anwenden prüft die Karte gegen, ob alle Werte tatsächlich
  übernommen wurden, und meldet Abweichungen

### v2.26.0
- Herstellerprofil unterscheidet jetzt HeishaMon by Lutarym und HeishaMon
  über das MQTT-Namensschema. Das Profil bestimmt, welcher Erkennungsweg
  zuerst versucht wird
- Auswahlfeld über die volle Breite, die Namen sind vollständig lesbar
- Konfiguration lässt sich zusätzlich als Datei speichern und aus einer
  Datei laden

### v2.25.1
- Bei der automatischen Zuordnung gewinnt die stellbare Entität. Liefert
  die Integration zum selben Wert einen Sensor und eine number-Entität,
  wird die number eingetragen

### v2.25.0
- Verbrauchsverlauf nach Ladeziel eingefärbt: rot für Heizung, blau für
  Warmwasser, abgeleitet aus dem Verlauf des Umschaltventils. Ohne
  Ventilentität bleibt die Linie neutral
- Herstellerprofil im Einstellungsdialog. Umgesetzt ist HeishaMon, die
  übrigen Profile sind vorgemerkt und gesperrt
- Konfiguration lässt sich im Einstellungsdialog ausgeben und einlesen.
  Beim Einlesen werden nur bekannte Schlüssel übernommen

### v2.24.2
- Aktuelle Außentemperatur als grüne senkrechte gestrichelte Linie, der
  Betriebspunkt ebenfalls grün
- Kennlinie und ihre Eckpunkte in Weiß statt Orange, damit Orange
  eindeutig dem Vorlauf gehört

### v2.24.1
- Auch die Regler unter dem Diagramm tragen die Farbe ihrer Achse:
  Außenwerte blau, Vorlaufwerte orange

### v2.24.0
- Heizkurve farblich zugeordnet: Vorlauf orange, Außentemperatur blau.
  Achsenlinie, Teilstriche, Beschriftung, Markierungslinie und der Wert
  daran tragen jeweils dieselbe Farbe

### v2.23.2
- "Vorlauf °C" steht senkrecht links neben dem Diagramm,
  "Außentemperatur °C" mittig darunter
- Beide Achsenbeschriftungen in größerer Schrift

### v2.23.1
- Heizkurvenfenster passt ohne Scrollen: Diagramm von 420 mal 300 auf
  420 mal 230 abgeflacht, Regler in zwei Spalten. Zusammen rund
  126 Pixel weniger Höhe

### v2.23.0
- Die Heizkurve wird nicht mehr über die Wärmepumpe aufgerufen, sondern
  im Popup des jeweiligen Heizkreises. Jeder zeigt nur seine eigene Kurve
- Der Titel nennt den konfigurierten Namen des Heizkreises
- Fenster entsprechend schmaler, da nur noch eine Spalte gezeigt wird

### v2.22.1
- Heizkurvenfenster schließt über ein Kreuz in der Kopfzeile statt über
  eine eigene Schaltfläche am Fuß, das spart rund 48 Pixel Höhe

### v2.22.0
- Regler im Heizkurvenfenster einzeilig, dadurch rund 112 Pixel weniger
  je Heizkreis
- Popup der Wärmepumpe verdichtet: die Auswahlfelder stehen nebeneinander,
  Abstände verringert, rund 72 Pixel weniger

### v2.21.2
- Heizkurve wird durchgehend gerade gezeichnet, über die ganze Skala,
  und dort abgeschnitten, wo sie den Rand verlässt
- Sollwert folgt derselben Geraden, auch außerhalb der Eckpunkte

### v2.21.1
- Heizkurve nutzt die ganze Skala: außerhalb der Eckwerte läuft die Linie
  waagerecht weiter, denn dort bleibt der Sollwert konstant
- Betriebspunkt sitzt bei der tatsächlichen Außentemperatur, auch auf den
  waagerechten Abschnitten

### v2.21.0
- Heizkurve ist nicht mehr auf der Karte, sondern in einem eigenen großen
  Fenster. Es wird über die Wärmepumpe aufgerufen und zeigt HK1 und HK2
  nebeneinander, jeweils mit vollständiger Skala, Betriebspunkt und den
  vier Stellern
- Das Fenster nimmt zwei Drittel der Kartenbreite ein
- Der Verbrauchsverlauf bekommt den frei gewordenen Platz

### v2.20.1
- Achsen der Heizkurve mit Teilstrichen auf runden Werten, die
  Schrittweite richtet sich nach dem Wertebereich
- Gestrichelte Linien markieren die aktuelle Außentemperatur und den
  daraus folgenden Vorlauf

### v2.20.0
- Heizkurve mit Skala: beide Achsen mit je drei Marken, feines Gitter,
  dadurch ist die Kurve ablesbar
- Kopfzeile nennt die aktuelle Außentemperatur und den daraus folgenden
  Sollwert
- Betriebspunkt als weißer Punkt mit dunklem Rand, bleibt auch außerhalb
  der Kurvenenden im Bild

### v2.19.0
- Heizkurve rückt auf den Platz des Verbrauchsdiagramms, wenn dieses
  ausgeblendet ist
- Neues Design der Heizkurve: die Eckwerte stehen in der Fußzeile statt
  in der Zeichenfläche, dort stießen sie an die Kurve
- Pufferziel wird während der Warmwasserladung nicht mehr angezeigt.
  TOP7 gilt in dieser Zeit dem Speicher und sprang auf dessen
  Ladetemperatur, was als Pufferziel irreführend war

### v2.18.0
- Verlaufsdiagramm und Heizkurve ohne Rahmen, stattdessen Trennlinien
  wie im Kennzahlenbereich
- Beide Diagramme lassen sich im Einstellungsdialog ein- und ausblenden
- Kurve nutzt die Fläche besser: 83 Prozent der Breite und 74 der Höhe
  statt vorher 74 und 42

### v2.17.1
- Heizkreise werden dargestellt wie Puffer und Warmwasser: große
  Temperatur, darunter das Ziel. Ohne Fachbegriffe

### v2.17.0
- Heizkreise zeigen statt "Wasser 29 / 35 °C" zwei benannte Zeilen:
  Vorlauf ist und Vorlauf soll, jeweils mit einer Nachkommastelle

### v2.16.1
- Verstellte Werte erscheinen sofort und werden gehalten, bis die Anlage
  sie zurückmeldet. Mehrfaches Drücken zählt weiter, und das gesendete
  JSON enthält alle bisherigen Änderungen
- Beim Überfahren mit der Maus wird nichts mehr unscharf: der CSS-Filter
  zwang den Browser, die Vektorgrafik zu rastern
- Heizkurve füllt den Rahmen aus, die Skala ergibt sich aus den Eckwerten
  beider Heizkreise mit Rand

### v2.16.0
- Heizkurve auch für Heizkreis 2 über TOP82 bis TOP85, im Fenster
  zwischen HK1 und HK2 umschaltbar
- Kurve auf fester Skala von -20 bis 20 Grad außen und 20 bis 60 Grad
  Vorlauf, dadurch ist die Steigung ablesbar und beide Heizkreise
  lassen sich vergleichen
- Beschriftungen der Kurvenenden bleiben auch bei flacher Kurve getrennt

### v2.15.0
- Heizkurve und beide Hysteresewerte lassen sich auch dann verstellen,
  wenn nur lesbare Entitäten vorliegen. Die Karte schickt den Wert dann
  über den Befehlskanal von HeishaMon: SetCurves, SetBufferDelta und
  SetDHWHeatDelta
- Neue Einstellung MQTT Präfix, voreingestellt panasonic_heat_pump

### v2.14.3
- Nur lesbare Entitäten: Bedienelemente bleiben sichtbar, sind aber
  ausgegraut, und die Beschriftung nennt den Grund. Vorher verschwanden
  sie stillschweigend

### v2.14.2
- Nur lesbare Entitäten werden erkannt. Steller und Regler erscheinen nur
  bei number- und input_number-Entitäten, sonst meldete Home Assistant
  "sensor.set_value nicht gefunden"

### v2.14.1
- Heizkurve selbsterklärend: beide Kurvenenden sind direkt beschriftet,
  etwa "-10 °C außen → 45 °C"
- Fenster der Heizkurve nach den beiden Kurvenpunkten gegliedert, die
  zusammengehörenden Werte stehen jetzt beieinander

### v2.14.0
- Verlaufsdiagramm des Stromverbrauchs der letzten 24 Stunden, oben rechts
  in beiden Anordnungen. Die Daten kommen aus dem Verlauf von Home Assistant
- Diagramm der Heizkurve mit dem aktuellen Betriebspunkt. Ein Klick öffnet
  ein Fenster, in dem sich die vier Eckwerte verstellen lassen: TOP29 bis TOP32
- Vorlauf und Rücklauf wieder in Großbuchstaben, als einzige Beschriftungen

### v2.13.1
- Abzeichen und die Schilder Vorlauf und Rücklauf wachsen mit ihrem Text.
  Bei den deutschen Beschriftungen ändert sich nichts, längere Texte
  laufen aber nicht mehr über den Kasten hinaus

### v2.13.0
- Alle Beschriftungen in normaler Schreibweise statt Großbuchstaben,
  Sperrung entsprechend enger, Schriftgrade leicht angehoben
- Durchfluss bleibt bei 0 l/min neutral, stehende Pumpe ist kein Risiko

### v2.12.1
- Ladetemperatur liegt jetzt in jedem Fall unter dem Sollwert. Gerechnet
  wird mit dem Betrag der Hysterese, unabhängig vom gemeldeten Vorzeichen

### v2.12.0
- In den Popups von Puffer und Warmwasser lässt sich die Temperatur
  einstellen, ab der nachgeladen wird. Geschrieben wird dabei die
  Hysterese TOP113 beziehungsweise TOP22
- Plus erhöht in beiden Fällen die angezeigte Temperatur, die Grenzen
  der Hysterese werden eingehalten

### v2.11.1
- Beschriftung Umschaltventil in der Grafik ergänzt
- Feldbezeichnung auf 3-Wege-Umschaltventil geändert, so nennt Panasonic
  das Bauteil selbst

### v2.11.0
- Alle Zahlen mit deutschem Dezimalkomma statt Punkt
- Durchfluss wird eingefärbt, wenn der Rohrinnendurchmesser eingetragen ist:
  grün zwischen 0,2 und 0,8 m/s, gelb darüber oder darunter, rot ab 1 m/s,
  wo Strömungsgeräusche entstehen
- Neue Einstellung Rohrinnendurchmesser in Millimetern

### v2.10.0
- Puffer und Warmwasser zeigen die Temperatur, ab der nachgeladen wird
- Pufferhysterese über TOP113 Buffer_Tank_Delta statt der Spreizung TOP23
- PV Überschuss und Verbrauch immer in Kilowatt, die Einheit springt nicht mehr

### v2.9.1
- Warmwasser zeigt statt des rohen Deltas die Temperatur, ab der
  nachgeladen wird, also Sollwert plus dem negativen Delta
- Heizungswert richtig benannt: TOP23 ist die Spreizung zur
  Pumpensteuerung, nicht die Nachladeschwelle

### v2.9.0
- Delta für Puffer und Warmwasser: ab welcher Abweichung nachgeheizt wird.
  Heizung über TOP23 Heat_Delta, Warmwasser über TOP22 DHW_Heat_Delta
- Hochformat: Vorlauf und Rücklauf sind unten nicht mehr direkt verbunden,
  der Kreis schließt sich über die Speicher
- Hochformat: Zirkulationskreis vergrößert
- Hochformat: Warmwasserspeicher höher, Heizstab im Puffer nach oben

### v2.8.1
- Hochformat: Fließrichtung der Animation korrigiert, Rückläufe liefen
  verkehrt herum
- Hochformat: Pumpe der Heizkreise und Zirkulationskreis versetzt, ihre
  Beschriftungen lagen auf Leitungen
- Hochformat: Symbolreihe, Trennlinie, Werte und Lüfter auf dieselben
  Abstände wie im Querformat gebracht
- Hochformat: Pumpen- und Druckbeschriftung ragte aus der Karte

### v2.8.0
- Hochformat als eigene Anordnung: Wärmepumpe und Kennzahlen oben
  nebeneinander, darunter senkrecht Vorlauf rechts und Rücklauf links,
  liegende Speicher, Heizkörper mit senkrechten Rippen, eigener
  Sekundärkreis
- Umschaltung Quer- und Hochformat im Einstellungsdialog
- Breite und Höhe der Karte im Einstellungsdialog einstellbar
- Trennlinie im Gehäuse zwischen Symbolreihe und den Werten
- Schilder Vorlauf und Rücklauf in der Farbe des zugehörigen Wertes

### v2.7.0
- Zirkulationsleitung: Ecken wie bei den übrigen Leitungen
- Zirkulationsleitung liegt hinter dem Warmwasserspeicher
- Namen der Einheiten in die Behälter verschoben, mit Kontrastbox
- Glow der Wärmepumpe grün, pulsierend, hinter dem Gehäuse
- Glow rot bei Störung
- Abzeichen für Aufheizen und Legionellenschutz im Warmwasserspeicher
- Beschriftung PV Überschuss statt PV Leistung, in der Farbe des SG-Zustands
- SG Ready: PV Überschuss Low und High statt 1 und 2
- Verdichterwert farbig nach Last, grün bei 16 Hz bis rot bei 90 Hz
- Trennlinien deutlicher sichtbar
- Lüfteranimation zuckt nicht mehr bei Drehzahlwechsel
- Heizungsschalter entfernt
- Demomodus: Knopf Bereitschaft, Knopf Zirkulation Schalter entfernt
- Demomodus: Schieberegler zeigen wieder ihren Wert
- Animationsschleife entlastet, toter Code entfernt
- Zustandssymbole im Gehäuse: Betrieb, Abtauen, Automatik, Heizen,
  Warmwasser, Kühlen. Blass, leuchtend oder blinkend je nach Zustand
- Kopfbereich der Wärmepumpe neu aufgeteilt, Betriebsanzeige entfällt
- Vorlauf und Rücklauf beschriftet, als Schild auf der Leitung
- Pumpe und Druck neu angeordnet, Werte darunter
- Pumpenräder in der Farbe des geförderten Wassers
- Wasserdruck grün von 0,5 bis 3 bar, darunter rot blinkend mit Warndreieck
- Werte in der Grafik und im Popup öffnen den Verlauf von Home Assistant
- Popups entlastet, nur noch Werte der jeweiligen Einheit
- Zeile Raum in den Heizkreisen entfernt, TOP56 und TOP57 waren doppelt
- Ohne zweiten Heizkreis rücken die Baugruppen rechts davon auf
- Namensfelder wachsen mit der Textlänge
- Animation läuft nach dem Wiederanhängen der Karte weiter
- Ventilbeschriftung ergänzt, sie hatte kein Ziel im SVG
- Waagerechte Ankerpunkte in benannte Konstanten überführt
  dadurch passen Kasten und Text wieder zusammen
  waagerecht. Wärmepumpe und Kennzahlen stehen aufrecht nebeneinander
  am Kopf, alles Weitere rückt darunter nach. Umschaltung im
  Einstellungsdialog unter Anordnung

### v2.6.4
- RL-Rohr Korrektur
- Version aus Hauptkarte in Einstellungen verschoben

### v2.6.3
- Betriebsart ins Wärmepumpen-Popup verschoben

### v2.6.2
- Demo-Modus Buttons leuchten grün nach Klick

### v2.6.1
- Demo-Buttons Button-IDs Bugfix

### v2.6.0
- Demo-Modus Buttons neu aufgebaut

### v2.5.0
- Animation Engine auf requestAnimationFrame umgestellt
- GData-Virenschutz kompatibel
