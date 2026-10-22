# Changelog

**English** · [Deutsch](#deutsch) · [Français](#français) · [日本語](#日本語)

## v5.6.2

- English: The help (“?”) describes the values and commands of HeishaMon. It now only appears with HeishaMon profiles (HeishaMon by Lutarym, HeishaMon via MQTT, HeishaMon by kamaradclimber) and in demo mode; with other manufacturers the button is hidden.
- Deutsch: Die Hilfe („?“) beschreibt die Werte und Befehle von HeishaMon. Sie erscheint jetzt nur noch bei HeishaMon-Profilen (HeishaMon by Lutarym, HeishaMon über MQTT, HeishaMon von kamaradclimber) und im Demomodus; bei anderen Herstellern ist der Knopf ausgeblendet.
- Français : l'aide (« ? ») décrit les valeurs et commandes de HeishaMon. Elle n'apparaît désormais qu'avec les profils HeishaMon (HeishaMon by Lutarym, HeishaMon via MQTT, HeishaMon de kamaradclimber) et en mode démo ; chez les autres fabricants, le bouton est masqué.
- 日本語：ヘルプ（「?」）は HeishaMon の値とコマンドを説明するものです。HeishaMon のプロファイル（HeishaMon by Lutarym、MQTT 経由の HeishaMon、kamaradclimber の HeishaMon）とデモモードでのみ表示し、ほかのメーカーではボタンを非表示にしました。

## v5.6.1

- English: Fixed: the badges “heater”, “boost” and “legionella” were sized for the German word. In French the text overflowed the badge, now the width follows the displayed text.
- English: Fixed: long histories could make the charts fail in Safari and the Home Assistant iOS app, which only allow about 65,000 values in one call. Minimum and maximum are now computed without that limit.
- English: Fixed: a removed card kept listening to the system setting “reduce motion”. A card without data source no longer remembers an empty assignment.
- English: The assignment of the solar input to the stove applies only to Panasonic; with other manufacturers a solar collector stays a solar collector.
- English: Cleaned up: unused texts, styles and the unused field `fault_reset` removed.
- Deutsch: Behoben: Die Abzeichen „Heizstab“, „Aufheizen“ und „Legionellen“ waren für das deutsche Wort bemessen. Auf Französisch lief der Text über das Abzeichen hinaus, jetzt richtet sich die Breite nach dem angezeigten Text.
- Deutsch: Behoben: Lange Verläufe konnten die Diagramme in Safari und der Home-Assistant-App für iOS scheitern lassen, die nur etwa 65.000 Werte in einem Aufruf erlauben. Kleinster und größter Wert werden jetzt ohne diese Grenze berechnet.
- Deutsch: Behoben: Eine entfernte Karte hörte weiter auf die Systemeinstellung „Bewegung reduzieren“. Eine Karte ohne Datenquelle merkt sich keine leere Zuordnung mehr.
- Deutsch: Die Zuordnung des Solareingangs zum Kamin gilt nur noch für Panasonic; bei anderen Herstellern bleibt ein Solarkollektor ein Solarkollektor.
- Deutsch: Bereinigt: ungenutzte Texte, Stile und das ungenutzte Feld `fault_reset` entfernt.
- Français : corrigé : les badges « appoint », « chauffe » et « légionelles » étaient dimensionnés pour le mot allemand. En français le texte dépassait du badge, la largeur suit maintenant le texte affiché.
- Français : corrigé : de longs historiques pouvaient faire échouer les graphiques dans Safari et l'application iOS de Home Assistant, qui n'acceptent qu'environ 65 000 valeurs par appel. Minimum et maximum sont maintenant calculés sans cette limite.
- Français : corrigé : une carte retirée restait à l'écoute du réglage système « réduire les animations ». Une carte sans source de données ne mémorise plus une affectation vide.
- Français : l'affectation de l'entrée solaire au poêle ne s'applique plus qu'à Panasonic ; chez les autres fabricants, un capteur solaire reste un capteur solaire.
- Français : nettoyage : textes, styles et champ `fault_reset` inutilisés supprimés.
- 日本語：修正：「ヒーター」「加熱」「レジオネラ」のバッジの幅がドイツ語の単語に合わせて計算されていました。フランス語では文字がはみ出していたため、表示する文字に合わせた幅にしました。
- 日本語：修正：長い履歴があると、1 回の呼び出しで約 65,000 個の値しか扱えない Safari と Home Assistant iOS アプリでグラフが失敗することがありました。最小値と最大値をこの制限なしで計算するようにしました。
- 日本語：修正：削除したカードが「視差効果を減らす」のシステム設定を監視し続けていました。データソースがないカードは空の割り当てを保持しなくなりました。
- 日本語：太陽熱入力を薪ストーブに割り当てる処理は Panasonic のみに適用します。ほかのメーカーでは集熱器は集熱器のままです。
- 日本語：整理：使われていないテキスト、スタイル、未使用の項目 `fault_reset` を削除しました。

## v5.6.0

- English: Manufacturer profiles for 32 further integrations from Home Assistant and HACS, among them Viessmann ViCare, NIBE, MELCloud, Luxtronik (three integrations), Lambda, iDM, Daikin (four integrations), Stiebel Eltron (two), Vaillant myPyllant, Kronoterm, Hitachi Yutaki, Waterkotte, Weishaupt, Wolf ISM8 and more. The search rules come from the source code of each integration; apart from HeishaMon by Lutarym they are marked “untested”. The full list with developer and source is in the device profile guide.
- English: The editor now offers two fields: “Manufacturer” and, when a manufacturer has several integrations, “Integration / device” with the developer name. The new default “Detect automatically” searches all profiles. If exactly one integration is found it is used; if several are found, the editor asks which one the card should use.
- English: Values of other integrations are understood: the diverter valve as number, on/off or text (for example “hot water”), the compressor as frequency, percentage or only running/stopped, and states such as “Running” and “Stopped”. The compressor unit now comes from the entity.
- Deutsch: Herstellerprofile für 32 weitere Integrationen aus Home Assistant und HACS, darunter Viessmann ViCare, NIBE, MELCloud, Luxtronik (drei Integrationen), Lambda, iDM, Daikin (vier Integrationen), Stiebel Eltron (zwei), Vaillant myPyllant, Kronoterm, Hitachi Yutaki, Waterkotte, Weishaupt, Wolf ISM8 und weitere. Die Suchregeln stammen aus dem Quelltext der jeweiligen Integration; außer HeishaMon by Lutarym sind sie als „ungetestet“ markiert. Die vollständige Liste mit Entwickler und Quelle steht in der Anleitung Geräteprofile.
- Deutsch: Der Editor bietet jetzt zwei Felder: „Hersteller“ und, wenn ein Hersteller mehrere Integrationen hat, „Integration / Gerät“ mit dem Namen des Entwicklers. Der neue Standard „Automatisch erkennen“ sucht alle Profile ab. Wird genau eine Integration gefunden, gilt sie; werden mehrere gefunden, fragt der Editor, welche die Karte verwenden soll.
- Deutsch: Werte anderer Integrationen werden verstanden: das Umschaltventil als Zahl, an/aus oder Text (zum Beispiel „hot water“), der Verdichter als Frequenz, Prozent oder nur läuft/aus, und Zustände wie „Running“ und „Stopped“. Die Einheit des Verdichters kommt jetzt aus der Entität.
- Français : profils de fabricants pour 32 intégrations supplémentaires de Home Assistant et HACS, dont Viessmann ViCare, NIBE, MELCloud, Luxtronik (trois intégrations), Lambda, iDM, Daikin (quatre intégrations), Stiebel Eltron (deux), Vaillant myPyllant, Kronoterm, Hitachi Yutaki, Waterkotte, Weishaupt, Wolf ISM8 et d'autres. Les règles de recherche proviennent du code source de chaque intégration ; hormis HeishaMon by Lutarym, elles sont marquées « non testé ». La liste complète avec développeur et source se trouve dans le guide des profils.
- Français : l'éditeur propose désormais deux champs : « Fabricant » et, quand un fabricant a plusieurs intégrations, « Intégration / appareil » avec le nom du développeur. La nouvelle valeur par défaut « Détection automatique » parcourt tous les profils. Si une seule intégration est trouvée, elle est utilisée ; si plusieurs sont trouvées, l'éditeur demande laquelle la carte doit utiliser.
- Français : les valeurs d'autres intégrations sont comprises : la vanne d'inversion sous forme de nombre, marche/arrêt ou texte (par exemple « hot water »), le compresseur en fréquence, en pourcentage ou seulement en marche/arrêt, et des états comme « Running » et « Stopped ». L'unité du compresseur provient désormais de l'entité.
- 日本語：Home Assistant と HACS の 32 統合のメーカープロファイルを追加しました。Viessmann ViCare、NIBE、MELCloud、Luxtronik（3 統合）、Lambda、iDM、Daikin（4 統合）、Stiebel Eltron（2）、Vaillant myPyllant、Kronoterm、Hitachi Yutaki、Waterkotte、Weishaupt、Wolf ISM8 などです。検索ルールは各統合のソースコードから作成しました。HeishaMon by Lutarym 以外は「未検証」と表示されます。開発者と出典付きの一覧はデバイスプロファイルの説明にあります。
- 日本語：エディターに 2 つの欄を設けました：「メーカー」と、メーカーに複数の統合がある場合の開発者名付き「統合 / 機器」。新しい既定値「自動検出」はすべてのプロファイルを検索します。統合が 1 つだけ見つかればそれを使い、複数見つかった場合はカードで使う統合をエディターが尋ねます。
- 日本語：ほかの統合の値を解釈できるようにしました：三方弁は数値、オン/オフ、テキスト（例：「hot water」）、圧縮機は周波数、パーセント、運転/停止のみ、さらに「Running」「Stopped」などの状態。圧縮機の単位はエンティティから取得します。

## v5.5.1

- English: Underfloor heating redrawn so that it is recognisable without expert knowledge: a room corner with two walls, in the floor the pipe coil, above it heat rises while water flows through the circuit. Flow and return run along the outside of the walls to the left and right floor corner. The three pictures of v5.5.0 are replaced by this one; `fbh_verteiler` and `fbh_raum` now also show it.
- Deutsch: Fußbodenheizung neu gezeichnet, damit sie auch ohne Fachwissen erkennbar ist: eine Zimmerecke mit zwei Wänden, im Boden die Rohrschlange, darüber steigt Wärme auf, solange Wasser durch den Kreis fließt. Vor- und Rücklauf laufen außen an den Wänden zur linken und rechten Bodenecke. Die drei Bilder aus v5.5.0 sind dadurch ersetzt; `fbh_verteiler` und `fbh_raum` zeigen ebenfalls dieses Bild.
- Français : plancher chauffant redessiné pour être reconnaissable sans connaissances techniques : un coin de pièce avec deux murs, dans le sol le tube en serpentin, au-dessus la chaleur monte tant que l'eau circule. Départ et retour longent l'extérieur des murs jusqu'aux coins gauche et droit du sol. Les trois images de la v5.5.0 sont remplacées ; `fbh_verteiler` et `fbh_raum` affichent aussi cette image.
- 日本語：専門知識がなくても分かるよう床暖房を描き直しました：2 つの壁がある部屋の隅で、床には蛇行配管、回路に水が流れている間は熱が立ち上ります。往きと還りは壁の外側を通って床の左右の角につながります。v5.5.0 の 3 種類の図はこれに置き換わり、`fbh_verteiler` と `fbh_raum` もこの図を表示します。

## v5.5.0

- English: Underfloor heating redrawn, three pictures selectable per heating circuit in the editor: cross-section (`fbh`, screed with pipes, insulation below), with manifold (`fbh_verteiler`, flow and return bar with pipe spiral) and room (`fbh_raum`, floor in perspective with meandering pipe). Cross-section and room show rising heat while water flows through the circuit. Existing cards with `fbh` get the cross-section.
- Deutsch: Fußbodenheizung neu gezeichnet, drei Bilder je Heizkreis im Editor wählbar: Querschnitt (`fbh`, Estrich mit Rohren, darunter Dämmung), mit Verteiler (`fbh_verteiler`, Vor- und Rücklaufbalken mit Rohrschnecke) und Raum (`fbh_raum`, Boden in Perspektive mit Mäanderrohr). Querschnitt und Raum zeigen aufsteigende Wärme, solange Wasser durch den Kreis fließt. Bestehende Karten mit `fbh` bekommen den Querschnitt.
- Français : plancher chauffant redessiné, trois images au choix par circuit dans l'éditeur : coupe (`fbh`, chape avec tubes, isolant dessous), avec collecteur (`fbh_verteiler`, barres départ et retour avec tube en spirale) et pièce (`fbh_raum`, sol en perspective avec tube en serpentin). La coupe et la pièce montrent la chaleur qui monte tant que l'eau circule. Les cartes existantes avec `fbh` reçoivent la coupe.
- 日本語：床暖房を描き直しました。暖房回路ごとにエディターで 3 種類の図を選べます：断面（`fbh`、配管入りのモルタル層と下の断熱材）、ヘッダー付き（`fbh_verteiler`、往き・還りヘッダーと渦巻き配管）、室内（`fbh_raum`、遠近法の床と蛇行配管）。断面と室内では、回路に水が流れている間、熱が立ち上ります。既存の `fbh` 設定は断面になります。

## v5.4.0

- English: Landscape: with one or two heating circuits they stand one below the other and the card ends right after them, without empty space on the right. Only from three heating circuits a second column follows and the card becomes wider. The chart buttons keep enough room on the narrower card.
- Deutsch: Querformat: Bei einem oder zwei Heizkreisen stehen diese untereinander, und die Karte endet direkt dahinter, ohne freie Fläche rechts. Erst ab drei Heizkreisen folgt eine zweite Spalte, und die Karte wird breiter. Die Diagrammknöpfe behalten auf der schmaleren Karte genug Platz.
- Français : paysage : avec un ou deux circuits, ceux-ci sont placés l'un sous l'autre et la carte se termine juste après, sans espace vide à droite. Ce n'est qu'à partir de trois circuits qu'une deuxième colonne apparaît et que la carte s'élargit. Les boutons des graphiques gardent assez de place sur la carte plus étroite.
- 日本語：横レイアウト：暖房回路が 1 つまたは 2 つの場合は縦に並べ、カードはその直後で終わり右側に空白を残しません。3 つ以上の場合のみ 2 列目を追加し、カードの幅が広がります。幅の狭いカードでもグラフのボタンに十分な余白を確保します。

## v5.3.4

- English: The chart window is lower again: the drawing area for energy and temperatures is about a third less tall.
- English: Temperatures are drawn as a step line. Home Assistant stores only changes, each value applies until the next one. Sloped connections suggested intermediate values, and flow and return could appear to cross because they change at different moments.
- Deutsch: Das Diagrammfenster ist wieder flacher: Die Zeichenfläche für Verbrauch und Temperaturen ist etwa ein Drittel niedriger.
- Deutsch: Temperaturen werden als Treppenlinie gezeichnet. Home Assistant speichert nur Wechsel, jeder Wert gilt bis zum nächsten. Schräge Verbindungen täuschten Zwischenwerte vor, und Vor- und Rücklauf konnten sich scheinbar kreuzen, weil sie zu verschiedenen Zeitpunkten wechseln.
- Français : la fenêtre des graphiques est de nouveau plus basse : la zone de tracé de la consommation et des températures est réduite d'environ un tiers.
- Français : les températures sont tracées en escalier. Home Assistant n'enregistre que les changements, chaque valeur reste valable jusqu'à la suivante. Les liaisons obliques suggéraient des valeurs intermédiaires, et départ et retour pouvaient sembler se croiser parce qu'ils changent à des moments différents.
- 日本語：グラフのウィンドウを低くしました。使用量と温度の描画領域の高さを約 3 分の 1 減らしました。
- 日本語：温度を階段状の線で描くようにしました。Home Assistant は変化した時点だけを記録し、各値は次の値まで有効です。斜めの線は存在しない中間値を示し、往きと還りの変化時刻がずれるため交差して見えることがありました。

## v5.3.3

- English: Fixed: the energy chart mixed heating, hot water and standby at the edges of each cycle. Power, compressor and diverter valve come from separate histories and do not report their changes at the same moment. The rising edge was therefore grey (standby) and the falling edge after a hot water charge red (heating). Now a point counts as running as soon as the power is clearly above standby, and each section takes the colour of its higher end point.
- Deutsch: Behoben: Das Verbrauchsdiagramm vermischte an den Flanken jedes Takts Heizung, Warmwasser und Standby. Leistung, Verdichter und Umschaltventil kommen aus getrennten Verläufen und melden ihre Wechsel nicht im selben Augenblick. Dadurch war die steigende Flanke grau (Standby) und die fallende Flanke nach einer Warmwasserladung rot (Heizung). Jetzt gilt ein Punkt als Betrieb, sobald die Leistung deutlich über dem Standby liegt, und jedes Teilstück bekommt die Farbe seines höheren Endpunkts.
- Français : corrigé : le graphique de consommation mélangeait chauffage, eau chaude et veille sur les flancs de chaque cycle. Puissance, compresseur et vanne trois voies proviennent d'historiques séparés et ne signalent pas leurs changements au même instant. Le flanc montant apparaissait donc en gris (veille) et le flanc descendant après une charge d'eau chaude en rouge (chauffage). Désormais un point compte comme fonctionnement dès que la puissance dépasse nettement la veille, et chaque tronçon prend la couleur de son extrémité la plus haute.
- 日本語：修正：使用量グラフで、各運転サイクルの立ち上がりと立ち下がりで暖房・給湯・待機が混在していました。消費電力、圧縮機、三方弁はそれぞれ別の履歴から取得され、変化の記録時刻が一致しないためです。そのため立ち上がりが灰色（待機）、給湯後の立ち下がりが赤（暖房）になっていました。消費電力が待機を明確に上回った時点で運転とみなし、各区間は高い方の端点の色で描くようにしました。

## v5.3.2

- English: Fixed: in portrait without a buffer, the collector pipes ran through the labels of the diverter valve and the primary pump. They now branch off at the height of heating circuit 1, and heating circuit 1 is drawn with one continuous pipe.
- English: Fixed: with 3 or 4 heating circuits, the return of the upper row crossed the vertical flow collector as if both were connected. It now jumps over it with a small arc (with and without buffer).
- English: Code cleanup: all 21 warnings of the code check removed (unused variables). No change in function.
- Deutsch: Behoben: Im Hochformat ohne Puffer liefen die Sammelleitungen durch die Beschriftung von Umschaltventil und Primärpumpe. Sie zweigen jetzt auf Höhe von Heizkreis 1 ab, und Heizkreis 1 wird mit einem durchgehenden Rohr gezeichnet.
- Deutsch: Behoben: Bei 3 oder 4 Heizkreisen kreuzte der Rücklauf der oberen Reihe die senkrechte Vorlauf-Sammelleitung, als wären beide verbunden. Er springt jetzt mit einem kleinen Bogen darüber (mit und ohne Puffer).
- Deutsch: Code bereinigt: alle 21 Warnungen der Codeprüfung entfernt (unbenutzte Variablen). Keine Änderung der Funktion.
- Français : corrigé : en portrait sans ballon tampon, les collecteurs traversaient les libellés de la vanne trois voies et de la pompe primaire. Ils se raccordent désormais à la hauteur du circuit 1, dessiné avec une conduite continue.
- Français : corrigé : avec 3 ou 4 circuits, le retour de la rangée supérieure croisait le collecteur de départ vertical comme s'ils étaient reliés. Il le franchit maintenant par un petit arc (avec et sans ballon tampon).
- Français : code nettoyé : les 21 avertissements de la vérification du code ont été supprimés (variables inutilisées). Aucun changement de fonction.
- 日本語：修正：縦レイアウトでバッファーがない場合、ヘッダー配管が三方弁と一次ポンプの表示を横切っていました。暖房回路 1 の高さで分岐するようにし、回路 1 は 1 本の連続した配管で描きます。
- 日本語：修正：暖房回路が 3 または 4 の場合、上段の戻り配管が縦の往きヘッダーとつながっているように交差していました。小さな弧で飛び越えるようにしました（バッファーの有無を問わず）。
- 日本語：コード整理：コードチェックの警告 21 件（未使用の変数）をすべて解消しました。機能の変更はありません。

## v5.3.1

- English: Fixed: the moving dots of the collector pipes ran along to heating circuits 3 and 4 even when these were off. The collector pipes are now split into sections. In landscape the part to the second row runs only when circuit 3 or 4 runs, the return of each row only with its circuits. In portrait each section between two circuits runs only when a circuit behind it runs.
- English: Stove only: the Aquarea has a single solar input. If only the stove is selected, the card reads the HeishaMon entities TOP47 (temperature) and OPT5 (pump) for the stove. Own stove entities take precedence. With solar thermal alone or both, TOP47 and OPT5 stay with solar thermal.
- Deutsch: Behoben: Die Laufpunkte der Sammelleitungen liefen bis zu Heizkreis 3 und 4 mit, auch wenn diese aus waren. Die Sammelleitungen sind jetzt in Abschnitte geteilt. Im Querformat läuft der Teil zur zweiten Reihe nur, wenn Heizkreis 3 oder 4 läuft, der Rücklauf jeder Reihe nur mit ihren Kreisen. Im Hochformat läuft jeder Abschnitt zwischen zwei Heizkreisen nur, wenn ein Kreis dahinter läuft.
- Deutsch: Kamin allein: Die Aquarea hat nur einen Solareingang. Ist nur der Kamin gewählt, liest die Karte für den Kamin die HeishaMon-Entitäten TOP47 (Temperatur) und OPT5 (Pumpe). Eigene Kamin-Entitäten haben Vorrang. Bei Solarthermie allein oder beidem bleiben TOP47 und OPT5 bei der Solarthermie.
- Français : corrigé : les points animés des collecteurs allaient jusqu'aux circuits 3 et 4 même à l'arrêt. Les collecteurs sont désormais divisés en tronçons. En paysage, la partie vers la deuxième rangée ne s'anime que si le circuit 3 ou 4 tourne, le retour de chaque rangée seulement avec ses circuits. En portrait, chaque tronçon entre deux circuits ne s'anime que si un circuit situé après tourne.
- Français : poêle seul : l'Aquarea n'a qu'une entrée solaire. Si seul le poêle est choisi, la carte lit pour le poêle les entités HeishaMon TOP47 (température) et OPT5 (pompe). Les entités propres du poêle sont prioritaires. Avec le solaire thermique seul ou les deux, TOP47 et OPT5 restent au solaire thermique.
- 日本語：修正：暖房回路 3 と 4 が停止していても、ヘッダー配管の流れの点がそこまで動いていました。ヘッダー配管を区間に分けました。横レイアウトでは 2 段目への区間は回路 3 または 4 の運転時のみ、各段の戻りはその段の回路の運転時のみ動きます。縦レイアウトでは 2 つの回路の間の各区間は、その先の回路が運転しているときのみ動きます。
- 日本語：薪ストーブのみ：Aquarea の太陽熱入力は 1 つだけです。薪ストーブのみを選択した場合、薪ストーブには HeishaMon の TOP47（温度）と OPT5（ポンプ）を使います。独自の薪ストーブ用エンティティが優先されます。太陽熱のみ、または両方の場合、TOP47 と OPT5 は太陽熱に使われます。

## v5.3.0

- English: Solar thermal now offers three styles, selectable in the editor (option `solar_style`): light rays and cell wave (default, rays fall from the sun onto the collector, the cells light up as a wave, heat rises), warming and sparkle (the collector warms from the top, the glass sparkles, heat shimmers above it), tube collector (vacuum tubes in which glowing heat rises). All three appear from the set collector temperature; with animation off they show a still image.
- Deutsch: Die Solarthermie bietet jetzt drei Darstellungen, im Editor wählbar (Option `solar_style`): Lichtstrahlen und Zellenwelle (Standard, Strahlen fallen von der Sonne auf den Kollektor, die Felder leuchten als Welle auf, Wärme steigt auf), Aufwärmen und Funkeln (der Kollektor wird von oben warm, das Glas funkelt, darüber flimmert Hitze), Röhrenkollektor (Vakuumröhren, in denen leuchtende Wärme nach oben steigt). Alle drei erscheinen ab der eingestellten Kollektortemperatur; ohne Animation zeigen sie ein Standbild.
- Français : le solaire thermique propose maintenant trois styles, au choix dans l'éditeur (option `solar_style`) : rayons et vague de cellules (par défaut, les rayons tombent du soleil sur le capteur, les cellules s'allument en vague, la chaleur monte), réchauffement et scintillement (le capteur se réchauffe par le haut, le verre scintille, la chaleur ondule au-dessus), capteur à tubes (tubes sous vide où la chaleur lumineuse monte). Les trois apparaissent à partir de la température réglée du capteur ; sans animation, ils affichent une image fixe.
- 日本語：太陽熱の表示を 3 種類から選べるようになりました（エディター、オプション `solar_style`）：光線とセルの波（既定。太陽から集熱器へ光線が落ち、セルが波のように光り、熱が立ち上ります）、加熱ときらめき（集熱器が上から温まり、ガラスがきらめき、上に陽炎が揺れます）、真空管集熱器（管の中を光る熱が上昇します）。いずれも設定した集熱器温度以上で表示され、アニメーション無効時は静止画になります。

## v5.2.3

- English: Demo mode: with 3 or 4 heating circuits the demo bar offers switches for the pumps and sliders for the water temperature of circuits 3 and 4.
- English: Fixed: in landscape both pipes of the solar thermal collector now reach its slanted edge.
- Deutsch: Demomodus: Bei 3 oder 4 Heizkreisen bietet die Demoleiste Schalter für die Pumpen und Regler für die Wassertemperatur von Heizkreis 3 und 4.
- Deutsch: Behoben: Im Querformat reichen beide Leitungen der Solarthermie jetzt bis an die schräge Kante des Kollektors.
- Français : mode démo : avec 3 ou 4 circuits, la barre de démo propose des interrupteurs pour les pompes et des curseurs pour la température d'eau des circuits 3 et 4.
- Français : corrigé : en paysage, les deux conduites du solaire thermique atteignent désormais le bord oblique du capteur.
- 日本語：デモモード：暖房回路が 3 または 4 の場合、デモバーに回路 3 と 4 のポンプのスイッチと水温のスライダーが表示されます。
- 日本語：修正：横レイアウトで太陽熱集熱器の 2 本の配管が斜めの縁まで届くようにしました。

## v5.2.2

- English: Fixed: in landscape the moving dots of heating circuits 1 and 3 were hidden. The pipe of the circuit next to them lay on top of the shared section. Now all pipes are drawn first and all moving dots above them, for all 4 circuits.
- English: Stove and solar thermal: the pump state now stands directly at the pump and only says "running" or "off".
- Deutsch: Behoben: Im Querformat waren die Laufpunkte von Heizkreis 1 und 3 verdeckt. Das Rohr des Kreises daneben lag über dem gemeinsamen Abschnitt. Jetzt werden erst alle Rohre und darüber alle Laufpunkte gezeichnet, für alle 4 Heizkreise.
- Deutsch: Kamin und Solarthermie: Der Pumpenzustand steht jetzt direkt an der Pumpe und lautet nur noch „läuft“ oder „aus“.
- Français : corrigé : en paysage, les points animés des circuits 1 et 3 étaient masqués. La conduite du circuit voisin recouvrait le tronçon commun. Désormais toutes les conduites sont dessinées d'abord, puis tous les points animés par-dessus, pour les 4 circuits.
- Français : poêle et solaire thermique : l'état de la pompe s'affiche directement à la pompe et indique seulement « en marche » ou « arrêt ».
- 日本語：修正：横レイアウトで暖房回路 1 と 3 の流れの点が隠れていました。隣の回路の配管が共通区間の上に重なっていたためです。すべての配管を先に描き、その上に流れの点を描くようにしました（4 回路すべて）。
- 日本語：薪ストーブと太陽熱：ポンプの状態をポンプのすぐそばに表示し、「運転中」または「停止」のみにしました。

## v5.2.1

- English: Demo mode: when stove or solar thermal is selected, the demo bar offers a switch for its pump and a slider for its temperature. So the fire and the sun can be tried out.
- Deutsch: Demomodus: Ist Kamin oder Solarthermie gewählt, bietet die Demoleiste einen Schalter für die Pumpe und einen Regler für die Temperatur. So lassen sich Feuer und Sonne ausprobieren.
- Français : mode démo : si le poêle ou le solaire thermique est choisi, la barre de démo propose un interrupteur pour sa pompe et un curseur pour sa température. Le feu et le soleil peuvent ainsi être essayés.
- 日本語：デモモード：薪ストーブまたは太陽熱を選択している場合、デモバーにポンプのスイッチと温度のスライダーが表示されます。炎と太陽の表示を試せます。

## v5.2.0

- English: New stove picture: a modern wood stove with a large viewing window, logs, ash drawer and flue pipe. From a set stove temperature (option `kamin_fire_temp`, default 30 °C) a fire burns in the window and flickers when animation is on. Solar thermal works the same way: from a set collector temperature (option `solar_sun_temp`, default 30 °C) the sun shines, its rays turn slowly and a light reflection moves across the collector. Below the limit the sun is grey. Both limits can be set in the editor next to the additional heat.
- Deutsch: Neues Kaminbild: ein moderner Kaminofen mit großem Sichtfenster, Holzscheiten, Aschelade und Rauchrohr. Ab einer einstellbaren Kamintemperatur (Option `kamin_fire_temp`, Standard 30 °C) lodert ein Feuer im Fenster, mit Animation flackert es. Bei der Solarthermie ebenso: ab einer einstellbaren Kollektortemperatur (Option `solar_sun_temp`, Standard 30 °C) scheint die Sonne, ihre Strahlen drehen sich langsam und ein Lichtschein zieht über den Kollektor. Unter der Grenze ist die Sonne grau. Beide Grenzen lassen sich im Editor bei der Zusatzwärme einstellen.
- Français : nouvelle image du poêle : un poêle à bois moderne avec grande vitre, bûches, cendrier et conduit de fumée. À partir d'une température réglable du poêle (option `kamin_fire_temp`, 30 °C par défaut), un feu brûle derrière la vitre et vacille avec l'animation. De même pour le solaire thermique : à partir d'une température réglable du capteur (option `solar_sun_temp`, 30 °C par défaut), le soleil brille, ses rayons tournent lentement et un reflet traverse le capteur. En dessous du seuil, le soleil est gris. Les deux seuils se règlent dans l'éditeur à côté de la chaleur d'appoint.
- 日本語：薪ストーブの図を変更しました：大きな覗き窓、薪、灰受け、煙突を備えたモダンな薪ストーブです。設定した薪ストーブ温度（オプション `kamin_fire_temp`、既定 30 °C）以上で窓の中に炎が燃え、アニメーション有効時は揺らぎます。太陽熱も同様に、設定した集熱器温度（オプション `solar_sun_temp`、既定 30 °C）以上で太陽が輝き、光線がゆっくり回り、集熱器の上を光の反射が流れます。しきい値未満では太陽は灰色です。どちらのしきい値もエディターの追加熱源の項目で設定できます。

## v5.1.7

- English: Landscape: SG Ready, PV surplus, power and energy now stand centred between the heat pump and the hot water tank. The primary pump sits on the common return between the heat pump and the hot water branch, so every return flow passes through it. The circulation label stands vertically to the left of the circulation pump, between the hot water tank and the circulation pipe.
- Deutsch: Querformat: SG Ready, PV Überschuss, Leistung und Zählerstand stehen mittig zwischen Wärmepumpe und Warmwasserspeicher. Die Primärpumpe sitzt auf dem gemeinsamen Rücklauf zwischen Wärmepumpe und Warmwasserabzweig, so fließt jeder Rücklauf durch sie. Die Beschriftung der Zirkulation steht senkrecht links neben der Zirkulationspumpe, zwischen Warmwasserspeicher und Zirkulationsleitung.
- Français : paysage : SG Ready, surplus PV, puissance et compteur sont centrés entre la pompe à chaleur et le ballon d'eau chaude. La pompe primaire se trouve sur le retour commun entre la pompe à chaleur et la dérivation d'eau chaude, tout retour passe donc par elle. Le libellé de la circulation est vertical, à gauche de la pompe de circulation, entre le ballon d'eau chaude et la conduite de circulation.
- 日本語：横レイアウト：SG Ready、PV 余剰、消費電力、積算値をヒートポンプと給湯タンクの中央に配置しました。一次ポンプはヒートポンプと給湯分岐の間の共通戻り配管に移し、すべての戻り水が通るようにしました。循環の表示は循環ポンプの左側、給湯タンクと循環配管の間に縦書きで配置しました。

## v5.1.5

- English: The previous view up to version 4.9 remains selectable as "Landscape classic" (option `layout: klassisch`): buffer, heating circuits 1 and 2, hot water tank on the right. It shows at most 2 heating circuits and no additional heat.
- Deutsch: Die bisherige Ansicht bis Version 4.9 bleibt als „Querformat klassisch“ wählbar (Option `layout: klassisch`): Puffer, Heizkreis 1 und 2, Warmwasserspeicher rechts. Sie zeigt höchstens 2 Heizkreise und keine Zusatzwärme.
- Français : l'ancienne vue jusqu'à la version 4.9 reste disponible sous « Paysage classique » (option `layout: klassisch`) : ballon tampon, circuits 1 et 2, ballon d'eau chaude à droite. Elle affiche au plus 2 circuits et pas de chaleur d'appoint.
- 日本語：バージョン 4.9 までの表示を「横長（クラシック）」として選べます（オプション `layout: klassisch`）：バッファー、暖房回路 1 と 2、右側に給湯タンク。暖房回路は最大 2 系統で、追加熱源は表示しません。

## v5.1.0

- English: New arrangement in landscape: heat pump, hot water tank, additional heat, buffer, heating circuits. The three-way valve sits above the hot water tank: down to the hot water tank, straight on to heating. Circulation runs narrow along the right side of the hot water tank, primary pump and water pressure sit on the return. Up to 4 heating circuits (`hk_count` 1 to 4): circuits 1 and 2 side by side, circuits 3 and 4 one level below. Circuits 3 and 4 use own entities (`hk3_water`, `hk3_pump`, `hk3_switch`, the same for 4), because the Aquarea controls only two zones. New: additional heat at the buffer (`extra_heat`: off, stove, solar thermal or both). Stove and solar thermal stand on the producer side to the left of the buffer, each with its own flow, return and pump; name, temperature and pump state stand below the device. Solar thermal uses TOP47 and OPT5 of HeishaMon by Lutarym, the stove own entities (`kamin_temp`, `kamin_pump`). The stove shows flames while its pump runs, bubbles rise in the buffer while one of them charges it. Heating circuit and additional heat pipes are narrower. The portrait layout gets the additional heat row below the buffer and up to 4 heating circuits. The editor offers 1 to 4 circuits, picture and name for each, and the additional heat; the entity groups for circuits 3 and 4 and for additional heat appear only when used.
- Deutsch: Neue Anordnung im Querformat: Wärmepumpe, Warmwasserspeicher, Zusatzwärme, Puffer, Heizkreise. Das Umschaltventil sitzt über dem Warmwasserspeicher: nach unten zum Warmwasser, geradeaus zur Heizung. Die Zirkulation läuft schmal an der rechten Seite des Warmwasserspeichers, Primärpumpe und Wasserdruck sitzen auf dem Rücklauf. Bis zu 4 Heizkreise (`hk_count` 1 bis 4): Heizkreis 1 und 2 nebeneinander, Heizkreis 3 und 4 eine Ebene darunter. Heizkreis 3 und 4 nutzen eigene Entitäten (`hk3_water`, `hk3_pump`, `hk3_switch`, ebenso für 4), weil die Aquarea nur zwei Zonen regelt. Neu: Zusatzwärme am Puffer (`extra_heat`: aus, Kamin, Solarthermie oder beides). Kamin und Solarthermie stehen auf der Erzeugerseite links vom Puffer, jeweils mit eigenem Vor- und Rücklauf und eigener Pumpe; Name, Temperatur und Pumpenzustand stehen unter dem Gerät. Die Solarthermie nutzt TOP47 und OPT5 von HeishaMon by Lutarym, der Kamin eigene Entitäten (`kamin_temp`, `kamin_pump`). Der Kamin zeigt Flammen, solange seine Pumpe läuft; im Puffer steigen Blasen, solange eine der beiden ihn lädt. Leitungen der Heizkreise und der Zusatzwärme sind schmaler. Das Hochformat bekommt die Zusatzwärme in einer Zeile unter dem Puffer und bis zu 4 Heizkreise. Der Editor bietet 1 bis 4 Heizkreise, für jeden Bild und Name, sowie die Zusatzwärme; die Entitätsgruppen für Heizkreis 3 und 4 und für die Zusatzwärme erscheinen nur, wenn sie genutzt werden.
- Français : nouvelle disposition en paysage : pompe à chaleur, ballon d'eau chaude, chaleur d'appoint, ballon tampon, circuits de chauffage. La vanne trois voies se trouve au-dessus du ballon d'eau chaude : vers le bas vers l'eau chaude, tout droit vers le chauffage. La circulation longe étroitement le côté droit du ballon d'eau chaude, la pompe primaire et la pression d'eau sont sur le retour. Jusqu'à 4 circuits (`hk_count` 1 à 4) : circuits 1 et 2 côte à côte, circuits 3 et 4 un niveau en dessous. Les circuits 3 et 4 utilisent des entités propres (`hk3_water`, `hk3_pump`, `hk3_switch`, de même pour 4), car l'Aquarea ne régule que deux zones. Nouveau : chaleur d'appoint au ballon tampon (`extra_heat` : arrêt, poêle, solaire thermique ou les deux). Le poêle et le solaire thermique se trouvent côté production à gauche du ballon tampon, chacun avec départ, retour et pompe propres ; nom, température et état de la pompe s'affichent sous l'appareil. Le solaire thermique utilise TOP47 et OPT5 de HeishaMon by Lutarym, le poêle des entités propres (`kamin_temp`, `kamin_pump`). Le poêle montre des flammes tant que sa pompe tourne ; des bulles montent dans le ballon tampon tant que l'un d'eux le charge. Les conduites des circuits et de la chaleur d'appoint sont plus fines. Le format vertical reçoit la chaleur d'appoint sur une ligne sous le ballon tampon et jusqu'à 4 circuits. L'éditeur propose 1 à 4 circuits, image et nom pour chacun, ainsi que la chaleur d'appoint ; les groupes d'entités des circuits 3 et 4 et de la chaleur d'appoint n'apparaissent que s'ils sont utilisés.
- 日本語：横レイアウトの配置を変更しました：ヒートポンプ、給湯タンク、追加熱源、バッファー、暖房回路の順です。三方弁は給湯タンクの上にあり、下は給湯、まっすぐは暖房です。循環は給湯タンクの右側に細く配置し、一次ポンプと水圧は戻り配管にあります。暖房回路は最大 4 系統（`hk_count` 1〜4）：回路 1 と 2 は横並び、回路 3 と 4 はその下の段に配置します。回路 3 と 4 は Aquarea が 2 ゾーンしか制御しないため独自エンティティ（`hk3_water`、`hk3_pump`、`hk3_switch`、4 も同様）を使います。新機能：バッファーの追加熱源（`extra_heat`：オフ、薪ストーブ、太陽熱、両方）。薪ストーブと太陽熱はバッファー左側の熱源側に置き、それぞれ独自の往き・還り・ポンプを持ち、名前、温度、ポンプ状態は機器の下に表示します。太陽熱は HeishaMon by Lutarym の TOP47 と OPT5、薪ストーブは独自エンティティ（`kamin_temp`、`kamin_pump`）を使います。薪ストーブはポンプ運転中に炎を表示し、どちらかがバッファーを加熱している間はバッファー内に泡が上がります。暖房回路と追加熱源の配管は細くしました。縦レイアウトでは追加熱源をバッファーの下の行に置き、暖房回路は最大 4 系統です。エディターでは 1〜4 系統の回路、それぞれの図と名前、追加熱源を設定できます。回路 3・4 と追加熱源のエンティティグループは使用する場合のみ表示します。

## v4.9.0

- English: The energy chart at the top right no longer takes up space permanently. Instead there are three buttons: Energy, SG Ready and Temperatures (in the vertical layout one below the other). Each opens a window with the past 24 hours: energy as before; SG Ready as a wide band with clock times and the duration of each state; temperatures with flow, return and outdoor temperature, each with current value, minimum and maximum. Tabs switch between the views. In the editor the option "24 hour charts" (`show_history`) offers: as buttons (default), energy always in the card (as before), off.
- Deutsch: Das Verbrauchsdiagramm oben rechts belegt keinen Platz mehr dauerhaft. Stattdessen gibt es drei Knöpfe: Verbrauch, SG Ready und Temperaturen (im Hochformat untereinander). Jeder öffnet ein Fenster mit den letzten 24 Stunden: Verbrauch wie bisher; SG Ready als breites Band mit Uhrzeiten und der Dauer je Zustand; Temperaturen mit Vorlauf, Rücklauf und Außentemperatur, jeweils mit aktuellem Wert, kleinstem und größtem Wert. Über Reiter lässt sich zwischen den Ansichten wechseln. Im Editor bietet die Option „Diagramme 24 Stunden“ (`show_history`): als Knöpfe (Standard), Verbrauch dauerhaft in der Karte (wie bisher), aus.
- Français : le graphique de consommation en haut à droite n'occupe plus de place en permanence. Il est remplacé par trois boutons : Consommation, SG Ready et Températures (l'un sous l'autre en format vertical). Chacun ouvre une fenêtre sur les dernières 24 heures : consommation comme avant ; SG Ready sous forme de bande avec les heures et la durée de chaque état ; températures avec départ, retour et extérieur, chacune avec valeur actuelle, minimum et maximum. Des onglets permettent de passer d'une vue à l'autre. Dans l'éditeur, l'option « Graphiques 24 heures » (`show_history`) propose : boutons (par défaut), consommation toujours dans la carte (comme avant), désactivé.
- 日本語：右上の使用量グラフが常に場所を占めないようにしました。代わりに「使用量」「SG Ready」「温度」の3つのボタンを表示します（縦レイアウトでは縦に並べます）。それぞれ過去24時間のウィンドウを開きます：使用量は従来どおり、SG Ready は時刻付きの帯と状態ごとの時間、温度は往き・還り・外気温を現在値・最小・最大とともに表示します。タブで表示を切り替えられます。エディターのオプション「24時間グラフ」（`show_history`）で、ボタン（既定）、使用量を常にカードに表示（従来どおり）、オフを選べます。

## v4.8.0

- English: Heating circuits redrawn. For each circuit the editor offers a picture: panel radiator (default), column radiator or underfloor heating (options `hk1_style`, `hk2_style`). Name and temperature now stand freely below the radiator (in the vertical layout next to it) instead of in a dark box on top of it. The line with the target temperature of the heating circuits is removed. The hot water tank now has the same shape and size as the buffer.
- Deutsch: Heizkreise neu gezeichnet. Für jeden Heizkreis bietet der Editor ein Bild an: Plattenheizkörper (Standard), Gliederheizkörper oder Fußbodenheizung (Optionen `hk1_style`, `hk2_style`). Name und Temperatur stehen jetzt frei unter dem Heizkörper (im Hochformat daneben) statt in einem dunklen Kasten darauf. Die Zeile mit der Zieltemperatur der Heizkreise entfällt. Der Warmwasserspeicher hat jetzt dieselbe Form und Größe wie der Puffer.
- Français : circuits de chauffage redessinés. Pour chaque circuit, l'éditeur propose une image : radiateur à panneaux (par défaut), radiateur à éléments ou plancher chauffant (options `hk1_style`, `hk2_style`). Le nom et la température s'affichent désormais librement sous le radiateur (à côté en format vertical) au lieu d'un cadre sombre posé dessus. La ligne de température cible des circuits est supprimée. Le ballon d'eau chaude a désormais la même forme et la même taille que le ballon tampon.
- 日本語：暖房回路を描き直しました。エディターで回路ごとに図を選べます：パネルラジエーター（既定）、セクショナルラジエーター、床暖房（オプション `hk1_style`、`hk2_style`）。名前と温度は、ラジエーターに重ねた暗い枠ではなく、ラジエーターの下（縦レイアウトでは横）に表示します。暖房回路の目標温度の行を削除しました。給湯タンクをバッファーと同じ形と大きさにしました。

## v4.7.1

- English: Animation can be set in the editor to On (default), Automatic or Off (option `animate`: `true`, `"auto"`, `false`). Only with Automatic does the device setting "reduce motion" decide; before, v4.7.0 stopped the animation whenever this setting was on. Fixed: bubbles that are not rising no longer lie visible at the bottom of the tank. Buffer and hot water tank now show their temperature at the same height.
- Deutsch: Die Animation lässt sich im Editor auf Ein (Standard), Automatisch oder Aus stellen (Option `animate`: `true`, `"auto"`, `false`). Nur bei Automatisch entscheidet die Geräteeinstellung „Bewegung reduzieren“; in v4.7.0 hielt die Karte die Animation an, sobald diese Einstellung eingeschaltet war. Behoben: Blasen, die nicht aufsteigen, liegen nicht mehr sichtbar am Boden des Speichers. Puffer und Warmwasserspeicher zeigen ihre Temperatur jetzt auf gleicher Höhe.
- Français : l'animation se règle dans l'éditeur sur Marche (par défaut), Automatique ou Arrêt (option `animate` : `true`, `"auto"`, `false`). Seul le mode Automatique suit le réglage de l'appareil « réduire les animations » ; en v4.7.0, la carte arrêtait l'animation dès que ce réglage était actif. Corrigé : les bulles qui ne montent pas ne restent plus visibles au fond du ballon. Le ballon tampon et le ballon d'eau chaude affichent leur température à la même hauteur.
- 日本語：アニメーションをエディターで「オン」（既定）「自動」「オフ」に設定できるようにしました（オプション `animate`：`true`、`"auto"`、`false`）。端末の「視差効果を減らす」設定に従うのは「自動」の場合だけです。v4.7.0 ではこの設定が有効だと常にアニメーションが止まっていました。修正：上昇していない泡がタンクの底に表示されたままになることがなくなりました。バッファーと給湯タンクの温度を同じ高さに表示します。

## v4.7.0

- English: Readability and operation. When the device asks for reduced motion, the card no longer animates. The operating mode is shown as text below the icons ("Heat and hot water", "Off", "Defrost"). Bubbles only rise in the tank that is being loaded right now. The "?" button is larger (44 px). Energy values are no longer green, only PV surplus stays green. Circulation shows its state in the label ("Circulation · off"), tapping the label opens the dialog. Light theme: labels have more contrast. History: without SG Ready data the empty band is hidden and the note "no history available" no longer overlaps other text. Editor: the section "Display" is divided into subgroups (General, Names, What is shown, Size, Heating curve chart, Colour scales, Technical); Size, diagram, scales and technical settings only appear in Advanced. For maintenance the code is split into modules under `src/`; `npm run build` creates the single file in `dist/` as before (see docs/ENTWICKLUNG.md). Nothing changes for installation via HACS.
- Deutsch: Lesbarkeit und Bedienung. Wenn das Gerät weniger Bewegung wünscht, animiert die Karte nicht mehr. Die Betriebsart steht als Text unter den Symbolen („Heizen und Warmwasser“, „Aus“, „Abtauen“). Blasen steigen nur noch im Speicher, der gerade geladen wird. Der „?“ Knopf ist größer (44 px). Energiewerte sind nicht mehr grün, nur der PV Überschuss bleibt grün. Die Zirkulation zeigt ihren Zustand in der Beschriftung („Zirkulation · aus“), Tippen auf die Beschriftung öffnet den Dialog. Helle Darstellung: Beschriftungen haben mehr Kontrast. Verlauf: Ohne SG Ready Daten wird das leere Band ausgeblendet und der Hinweis „kein Verlauf vorhanden“ überdeckt keinen anderen Text mehr. Editor: Der Abschnitt „Darstellung“ ist in Untergruppen geteilt (Allgemein, Namen, Was angezeigt wird, Größe, Heizkurven-Diagramm, Farbskalen, Technik); Größe, Diagramm, Skalen und Technik erscheinen nur unter Erweitert. Zur Pflege ist der Code in Module unter `src/` aufgeteilt; `npm run build` erzeugt wie bisher die eine Datei in `dist/` (siehe docs/ENTWICKLUNG.de.md). Für die Installation über HACS ändert sich nichts.
- Français : lisibilité et utilisation. Si l'appareil demande moins d'animations, la carte ne s'anime plus. Le mode de fonctionnement s'affiche en texte sous les icônes (« Chauffage et eau chaude », « Arrêt », « Dégivrage »). Les bulles ne montent que dans le ballon en cours de chargement. Le bouton « ? » est plus grand (44 px). Les valeurs d'énergie ne sont plus vertes, seul le surplus PV reste vert. La circulation indique son état dans son libellé (« Circulation · arrêt »), toucher le libellé ouvre la fenêtre. Thème clair : les libellés sont plus contrastés. Historique : sans données SG Ready, la bande vide est masquée et la mention « aucun historique » ne recouvre plus d'autre texte. Éditeur : la section « Affichage » est divisée en sous-groupes (Général, Noms, Ce qui est affiché, Taille, Diagramme de la courbe, Échelles de couleur, Technique) ; taille, diagramme, échelles et technique n'apparaissent qu'en mode Avancé. Pour la maintenance, le code est réparti en modules dans `src/` ; `npm run build` crée comme avant le fichier unique dans `dist/` (voir docs/ENTWICKLUNG.fr.md). Rien ne change pour l'installation via HACS.
- 日本語：見やすさと操作性。端末が「視差効果を減らす」を求める場合、カードはアニメーションしません。運転モードをアイコンの下に文字で表示します（「暖房と給湯」「オフ」「除霜」）。泡は現在加熱中のタンクでのみ上昇します。「?」ボタンを大きくしました（44 px）。エネルギー値は緑色ではなくなり、PV 余剰のみ緑色のままです。循環はラベルに状態を表示し（「循環 · 停止」）、ラベルをタップするとダイアログが開きます。ライト表示：ラベルのコントラストを上げました。履歴：SG Ready のデータがない場合は空の帯を隠し、「履歴なし」の表示が他の文字と重ならなくなりました。エディター：「表示」セクションをサブグループ（全般、名前、表示する内容、サイズ、暖房曲線グラフ、カラースケール、技術設定）に分けました。サイズ・グラフ・スケール・技術設定は「詳細」でのみ表示します。保守のためコードを `src/` 内のモジュールに分割しました。`npm run build` で従来どおり `dist/` に 1 つのファイルを作成します（docs/ENTWICKLUNG.ja.md を参照）。HACS でのインストールは変わりません。

## v4.6.0

- English: Reworked editor. New switch "Simple / Advanced": Simple shows only integration, language and display; Advanced additionally shows the entity mapping, profile selection and tools. Entity groups can be collapsed and show "x of y assigned"; every field shows a status (✓ found, ! entity does not exist, empty = not assigned) and a filter shows only missing fields. Where Home Assistant offers its entity picker (search, names, filtered by entity type), it is used, otherwise the text field stays. A "?" next to many fields shows the explanation from the help window. Import, export, device profiles and languages are bundled in one collapsible section "Import, export and customisation". Open sections and the mode are remembered in this browser. The editor footer now shows the correct card name.
- Deutsch: Editor überarbeitet. Neuer Umschalter „Einfach / Erweitert“: Einfach zeigt nur Integration, Sprache und Darstellung; Erweitert zusätzlich die Zuordnung der Entitäten, die Profilauswahl und die Werkzeuge. Die Entitätsgruppen lassen sich einklappen und zeigen „x von y zugeordnet“; jedes Feld zeigt seinen Zustand (✓ gefunden, ! Entität gibt es nicht, leer = nicht zugeordnet), ein Filter zeigt nur fehlende Felder. Wo Home Assistant sein Auswahlfeld für Entitäten anbietet (Suche, Namen, nach Art gefiltert), wird es verwendet, sonst bleibt das Textfeld. Ein „?“ an vielen Feldern zeigt die Erklärung aus dem Hilfefenster. Import, Export, Geräteprofile und Sprachen sind in einem einklappbaren Abschnitt „Import, Export und Anpassungen“ gebündelt. Offene Abschnitte und der Modus werden in diesem Browser gemerkt. Im Editor steht unten jetzt der richtige Kartenname.
- Français : éditeur remanié. Nouveau sélecteur « Simple / Avancé » : Simple n'affiche que l'intégration, la langue et l'affichage ; Avancé ajoute l'attribution des entités, le choix du profil et les outils. Les groupes d'entités se replient et indiquent « x sur y attribuées » ; chaque champ montre son état (✓ trouvée, ! entité inexistante, vide = non attribuée) et un filtre n'affiche que les champs manquants. Si Home Assistant propose son sélecteur d'entités (recherche, noms, filtré par type), il est utilisé, sinon le champ texte reste. Un « ? » à côté de nombreux champs affiche l'explication de la fenêtre d'aide. Import, export, profils d'appareil et langues sont regroupés dans une section repliable « Import, export et personnalisation ». Les sections ouvertes et le mode sont mémorisés dans ce navigateur. Le pied de l'éditeur affiche désormais le bon nom de la carte.
- 日本語：エディターを改良しました。新しい「シンプル／詳細」切り替え：シンプルは統合・言語・表示のみ、詳細ではエンティティの割り当て、プロファイル選択、ツールも表示します。エンティティのグループは折りたたみでき、「y 件中 x 件割り当て済み」を表示します。各項目に状態（✓ 見つかった、! エンティティが存在しない、空欄 = 未割り当て）を表示し、未設定のみを表示するフィルターがあります。Home Assistant のエンティティ選択欄（検索・名前・種別で絞り込み）が使える場合はそれを使い、使えない場合はテキスト欄のままです。多くの項目の横の「?」でヘルプ画面の説明を表示します。インポート・エクスポート・デバイスプロファイル・言語は、折りたたみ式の「インポート・エクスポートとカスタマイズ」にまとめました。開いたセクションとモードはこのブラウザーに記憶されます。エディター下部に正しいカード名を表示するようにしました。

## v4.5.0

- English: Colour schemes, selectable in the editor (section "Display", option `theme`): Automatic (follows light or dark mode of Home Assistant, default), Dark, Light, High contrast, Night (dimmed) and Colours of the Home Assistant theme. They apply to the card, the door, the dialogs and the help window. The coloured parts (tanks, water temperatures, flow, status colours) keep their colours; the value boxes of the heating circuits stay dark so that the white numbers remain readable. Fixed: in the vertical layout the names of buffer and hot water tank were missing unless an own name was set.
- Deutsch: Farbdarstellungen, wählbar im Editor (Abschnitt „Darstellung“, Option `theme`): Automatisch (folgt hell oder dunkel von Home Assistant, Standard), Dunkel, Hell, Hoher Kontrast, Nacht (gedimmt) und Farben des Home-Assistant-Designs. Sie gelten für die Karte, die Tür, die Dialoge und das Hilfefenster. Die farbigen Teile (Speicher, Wassertemperaturen, Fluss, Zustandsfarben) behalten ihre Farben; die Wertekästen der Heizkreise bleiben dunkel, damit die weißen Zahlen lesbar bleiben. Behoben: Im Hochformat fehlten die Namen von Puffer und Warmwasserspeicher, wenn kein eigener Name eingetragen war.
- Français : jeux de couleurs, au choix dans l'éditeur (section « Affichage », option `theme`) : Automatique (suit le mode clair ou sombre de Home Assistant, par défaut), Sombre, Clair, Contraste élevé, Nuit (atténué) et Couleurs du thème Home Assistant. Ils s'appliquent à la carte, à la porte, aux fenêtres et à l'aide. Les parties colorées (ballons, températures d'eau, flux, couleurs d'état) gardent leurs couleurs ; les cadres de valeurs des circuits restent sombres pour que les chiffres blancs restent lisibles. Corrigé : en format vertical, les noms du ballon tampon et du ballon d'eau chaude manquaient sans nom personnalisé.
- 日本語：配色をエディター（「表示」セクション、オプション `theme`）で選べるようにしました：自動（Home Assistant のライト／ダークに従う、既定）、ダーク、ライト、ハイコントラスト、夜間（減光）、Home Assistant テーマの色。カード、扉、ダイアログ、ヘルプ画面に適用されます。色付きの部分（タンク、水温、流れ、状態色）は元の色のままで、暖房回路の値表示枠は白い数字が読めるよう暗いままです。修正：縦レイアウトで独自名を設定していない場合、バッファーと給湯タンクの名前が表示されていませんでした。

## v4.4.0

- English: The COP is no longer shown in the buffer and hot water tank. It is now behind the door in its own section "Coefficient of performance (COP)", above the JAZ table: "Heating: Today COP x" and "Hot water: Today COP x" (time-weighted mean since midnight, current value in demo mode). The rows update while the door is open.
- Deutsch: Der COP steht nicht mehr im Puffer und im Warmwasserspeicher. Er steht jetzt hinter der Tür in einem eigenen Abschnitt „Leistungszahl (COP)“ über der JAZ-Tabelle: „Heizen: Heute COP x“ und „Warmwasser: Heute COP x“ (zeitgewichteter Mittelwert seit Mitternacht, im Demomodus der aktuelle Wert). Die Zeilen aktualisieren sich, solange die Tür offen ist.
- Français : le COP n'apparaît plus dans le ballon tampon et le ballon d'eau chaude. Il se trouve désormais derrière la porte dans une section « Coefficient de performance (COP) », au-dessus du tableau JAZ : « Chauffage : Aujourd'hui COP x » et « Eau chaude : Aujourd'hui COP x » (moyenne pondérée dans le temps depuis minuit, valeur actuelle en mode démo). Les lignes se mettent à jour tant que la porte est ouverte.
- 日本語：COP をバッファーと給湯タンクに表示しなくなりました。扉の奥、JAZ 表の上の「成績係数（COP）」セクションに「暖房：今日の COP x」「給湯：今日の COP x」として表示します（午前 0 時からの時間加重平均、デモモードでは現在値）。扉を開いている間は自動で更新されます。

## v4.3.3

- English: Help window on phones and tablets: the search field no longer receives the focus on opening, so the on-screen keyboard stays closed. Only devices with a mouse jump directly into the search; on touch devices the window itself gets the focus, Escape still closes it. Before, only the screen width was checked, so the keyboard opened on phones in landscape and on tablets.
- Deutsch: Hilfefenster am Handy und Tablet: Das Suchfeld bekommt beim Öffnen nicht mehr den Fokus, die Bildschirmtastatur bleibt zu. Nur Geräte mit Maus springen direkt in die Suche; auf Touch-Geräten bekommt das Fenster selbst den Fokus, Escape schließt es weiterhin. Bisher wurde nur die Bildschirmbreite geprüft, deshalb ging die Tastatur am Handy im Querformat und am Tablet auf.
- Français : fenêtre d'aide sur téléphone et tablette : le champ de recherche ne reçoit plus le focus à l'ouverture, le clavier virtuel reste fermé. Seuls les appareils avec souris vont directement dans la recherche ; sur les appareils tactiles, la fenêtre elle-même reçoit le focus et Échap la ferme toujours. Auparavant seule la largeur d'écran était vérifiée, d'où le clavier sur téléphone en paysage et sur tablette.
- 日本語：スマートフォンとタブレットのヘルプ画面：開いたときに検索欄へフォーカスしなくなり、画面キーボードが開きません。マウスのある端末だけ検索欄に直接移動し、タッチ端末では画面自体にフォーカスし、Escape で閉じられます。従来は画面幅だけを見ていたため、横向きのスマートフォンやタブレットでキーボードが開いていました。

## v4.3.2

- English: JAZ table behind the door: the "12 months" column is replaced by heat and electricity in kWh since 1 January. Each row (heating, hot water, total) now shows heat, electricity and the resulting JAZ, so it is visible why the total is weighted by the amounts and is not the simple mean of heating and hot water.
- Deutsch: JAZ-Tabelle hinter der Tür: Die Spalte „12 Monate“ ist ersetzt durch Wärme und Strom in kWh seit 1. Januar. Jede Zeile (Heizen, Warmwasser, Gesamt) zeigt jetzt Wärme, Strom und die daraus berechnete JAZ. So ist sichtbar, warum Gesamt nach den Mengen gewichtet ist und nicht der einfache Mittelwert aus Heizen und Warmwasser.
- Français : tableau JAZ derrière la porte : la colonne « 12 mois » est remplacée par la chaleur et l'électricité en kWh depuis le 1er janvier. Chaque ligne (chauffage, eau chaude, total) affiche la chaleur, l'électricité et le JAZ qui en résulte, ce qui montre pourquoi le total est pondéré par les quantités et n'est pas la simple moyenne du chauffage et de l'eau chaude.
- 日本語：扉の奥の JAZ 表：「12 か月」の列を、1 月 1 日からの熱量と電力（kWh）に置き換えました。各行（暖房・給湯・合計）に熱量・電力・算出した JAZ を表示し、合計が暖房と給湯の単純平均ではなく量で重み付けされる理由が分かるようにしました。

## v4.3.1

- English: The seasonal performance factor (JAZ) behind the door is now a small table: rows heating, hot water and total (bold, below a line), columns "12 months" and "Since 1 Jan". The note "data only since …" appears once below the table.
- Deutsch: Die Jahresarbeitszahl (JAZ) hinter der Tür ist jetzt eine kleine Tabelle: Zeilen Heizen, Warmwasser und Gesamt (fett, unter einem Strich), Spalten „12 Monate“ und „Seit 1. Jan.“. Der Hinweis „Daten erst seit …“ steht einmal unter der Tabelle.
- Français : le coefficient annuel (JAZ) derrière la porte est désormais un petit tableau : lignes chauffage, eau chaude et total (en gras, sous un trait), colonnes « 12 mois » et « Depuis 1er janv. ». La mention « données depuis le … seulement » apparaît une fois sous le tableau.
- 日本語：扉の奥の年間性能係数（JAZ）を小さな表にしました：行は暖房・給湯・合計（線の下に太字）、列は「12 か月」と「1月1日から」。「… 以降のデータのみ」の注記は表の下に 1 回だけ表示します。

## v4.3.0

- English: Seasonal performance factor (JAZ) behind the door now only uses HeishaMon values and is shown separately: total, heating (TOP15/TOP16) and hot water (TOP40/TOP41), each for the last 12 months and since 1 January (XTOP3/XTOP0 and XTOP5/XTOP2 if the heat pump sends the extra data block). The option `jaz_source` with an own power meter (Shelly PM) is removed, because a single meter cannot split electricity between heating and hot water. Rows without matching entities are hidden.
- Deutsch: Die Jahresarbeitszahl (JAZ) hinter der Tür rechnet nur noch mit den Werten von HeishaMon und wird getrennt angezeigt: gesamt, Heizen (TOP15/TOP16) und Warmwasser (TOP40/TOP41), jeweils für die letzten 12 Monate und seit 1. Januar (XTOP3/XTOP0 und XTOP5/XTOP2, wenn die Wärmepumpe den Zusatzblock sendet). Die Option `jaz_source` mit eigenem Stromzähler (Shelly PM) entfällt, weil ein einzelner Zähler den Strom nicht nach Heizen und Warmwasser trennen kann. Zeilen ohne passende Entitäten werden ausgeblendet.
- Français : le coefficient annuel (JAZ) derrière la porte n'utilise plus que les valeurs HeishaMon et s'affiche séparément : total, chauffage (TOP15/TOP16) et eau chaude (TOP40/TOP41), chacun sur les 12 derniers mois et depuis le 1er janvier (XTOP3/XTOP0 et XTOP5/XTOP2 si la pompe envoie le bloc supplémentaire). L'option `jaz_source` avec compteur propre (Shelly PM) est supprimée, car un seul compteur ne peut pas séparer l'électricité entre chauffage et eau chaude. Les lignes sans entités correspondantes sont masquées.
- 日本語：扉の奥の年間性能係数（JAZ）は HeishaMon の値だけで計算し、合計・暖房（TOP15/TOP16）・給湯（TOP40/TOP41）を、それぞれ直近 12 か月と 1 月 1 日から個別に表示します（ヒートポンプが追加データブロックを送る場合は XTOP3/XTOP0 と XTOP5/XTOP2）。1 台の電力計では暖房と給湯の電力を分けられないため、独自の電力計（Shelly PM）を使うオプション `jaz_source` を廃止しました。該当するエンティティがない行は表示しません。

## v4.2.1

- English: Code review. Fixed: the bubbles in buffer and hot water tank were always all visible, regardless of fill level, standstill or the option "animate"; now only the intended ones are shown. Faster: the card now only recalculates when one of its own entities, the language or the entity registry changes, instead of on every state change in Home Assistant; the search for the JAZ entities is cached (measured with 3,200 entities: about 2.1 ms down to about 0.35 ms per relevant update, unrelated updates are skipped). The animation pauses while the card is outside the visible area. Language packs: texts with angle brackets, straight double quotes or backticks are rejected, because texts are inserted as HTML; several cards with different own languages no longer overwrite each other. Unused variables removed.
- Deutsch: Codeprüfung. Behoben: Die Blasen in Puffer und Warmwasserspeicher waren immer alle sichtbar, unabhängig von Füllstand, Stillstand oder der Option „Animation“; jetzt erscheinen nur die vorgesehenen. Schneller: Die Karte rechnet nur noch neu, wenn sich eine ihrer eigenen Entitäten, die Sprache oder die Entitätsregistrierung ändert, statt bei jeder Zustandsänderung in Home Assistant; die Suche nach den JAZ-Entitäten wird zwischengespeichert (gemessen mit 3.200 Entitäten: von etwa 2,1 ms auf etwa 0,35 ms je relevanter Änderung, fremde Änderungen werden übersprungen). Die Animation ruht, solange die Karte außerhalb des sichtbaren Bereichs liegt. Sprachpakete: Texte mit spitzen Klammern, geraden Anführungszeichen oder Backticks werden abgelehnt, weil Texte als HTML eingesetzt werden; mehrere Karten mit verschiedenen eigenen Sprachen überschreiben sich nicht mehr gegenseitig. Ungenutzte Variablen entfernt.
- Français : revue du code. Corrigé : les bulles du ballon tampon et du ballon d'eau chaude étaient toujours toutes visibles, quel que soit le niveau, l'arrêt ou l'option « animation » ; seules les bulles prévues apparaissent désormais. Plus rapide : la carte ne recalcule plus que lorsqu'une de ses propres entités, la langue ou le registre des entités change, au lieu de chaque changement d'état dans Home Assistant ; la recherche des entités du JAZ est mise en cache (mesuré avec 3 200 entités : d'environ 2,1 ms à environ 0,35 ms par changement pertinent, les changements étrangers sont ignorés). L'animation est en pause tant que la carte est hors de la zone visible. Packs de langue : les textes avec chevrons, guillemets droits ou accents graves isolés sont refusés, car les textes sont insérés en HTML ; plusieurs cartes avec des langues personnelles différentes ne s'écrasent plus. Variables inutilisées supprimées.
- 日本語：コードレビュー。修正：バッファーと給湯タンクの泡が、水位・停止・「アニメーション」設定に関係なく常にすべて表示されていました。現在は本来の数だけ表示します。高速化：Home Assistant のあらゆる状態変化ではなく、カード自身のエンティティ、言語、エンティティ登録が変わったときだけ再計算します。JAZ 用エンティティの検索結果をキャッシュします（3,200 エンティティで測定：関連する更新 1 回あたり約 2.1 ms から約 0.35 ms、無関係な更新はスキップ）。カードが表示範囲外にある間はアニメーションを停止します。言語パック：テキストは HTML として挿入されるため、山かっこ、半角の二重引用符、バッククォートを含むテキストは拒否します。異なる独自言語を持つ複数のカードが互いに上書きしなくなりました。未使用の変数を削除しました。

## v4.2.0

- English: Language packs. In the editor section "Integration", below "Language", the language currently shown can be exported as a JSON file with all texts of the card, the editor and the help ("Export language"). Translated or adjusted files are imported with "Import language" and selected immediately; "Remove own language" deletes them again. A new language code (for example `nl`) adds a new entry, a built-in code (`de`, `en`, `fr`, `ja`) replaces that translation and is marked "(customised)". Missing texts and texts with wrong placeholders fall back to the base language; unknown keys are ignored. The decimal separator is part of the pack. Imported languages are stored in the card configuration under `language_custom`. New guide in four languages: docs/SPRACHPAKET.md.
- Deutsch: Sprachpakete. Im Editor-Abschnitt „Integration“ unter „Sprache“ lässt sich die angezeigte Sprache als JSON-Datei mit allen Texten der Karte, des Editors und der Hilfe exportieren („Sprache exportieren“). Übersetzte oder angepasste Dateien werden mit „Sprache importieren“ eingelesen und sofort ausgewählt; „Eigene Sprache entfernen“ löscht sie wieder. Ein neuer Sprachcode (zum Beispiel `nl`) ergibt einen neuen Eintrag, ein eingebauter Code (`de`, `en`, `fr`, `ja`) ersetzt diese Übersetzung und wird mit „(angepasst)“ gekennzeichnet. Fehlende Texte und Texte mit falschen Platzhaltern fallen auf die Grundsprache zurück, unbekannte Schlüssel werden ignoriert. Das Dezimalzeichen gehört zum Paket. Importierte Sprachen stehen in der Kartenkonfiguration unter `language_custom`. Neue Anleitung in vier Sprachen: docs/SPRACHPAKET.de.md.
- Français : packs de langue. Dans la section « Intégration » de l'éditeur, sous « Langue », la langue affichée peut être exportée en fichier JSON avec tous les textes de la carte, de l'éditeur et de l'aide (« Exporter la langue »). Les fichiers traduits ou adaptés sont importés avec « Importer une langue » et sélectionnés aussitôt ; « Supprimer la langue personnelle » les retire. Un nouveau code (par exemple `nl`) ajoute une entrée, un code intégré (`de`, `en`, `fr`, `ja`) remplace cette traduction et est marqué « (modifié) ». Les textes manquants et ceux aux espaces réservés incorrects reviennent à la langue de base ; les clés inconnues sont ignorées. Le séparateur décimal fait partie du pack. Les langues importées sont enregistrées dans la configuration de la carte sous `language_custom`. Nouveau guide en quatre langues : docs/SPRACHPAKET.fr.md.
- 日本語：言語パック。エディターの「統合」セクションの「言語」の下で、表示中の言語を、カード・エディター・ヘルプのすべてのテキストを含む JSON ファイルとして書き出せます（「言語を書き出す」）。翻訳・調整したファイルは「言語を読み込む」で読み込むとすぐに選択され、「独自の言語を削除」で削除できます。新しい言語コード（例：`nl`）は項目を追加し、内蔵のコード（`de`、`en`、`fr`、`ja`）はその翻訳を置き換えて「（カスタム）」と表示されます。ないテキストやプレースホルダーが誤ったテキストは基本言語を使い、不明なキーは無視します。小数点記号もパックに含まれます。読み込んだ言語はカード設定の `language_custom` に保存されます。4 言語の新しい説明：docs/SPRACHPAKET.ja.md。

## v4.1.0

- English: Device profiles. In the editor section "Integration", the selected manufacturer profile can be exported as a JSON file and an own or adapted profile can be imported ("Export profile", "Import profile", "Remove own profile"). This also works for both Panasonic profiles: an imported profile with the same id replaces the built-in one and is marked "(customised)"; removing it restores the built-in profile. A profile describes for each card field which entities belong to it: exact entity ID, pattern with `*`, or key (ending of the entity ID or translation_key). Imported profiles are stored in the card configuration under `profile_custom`. The detection status in the editor now follows the selected profile. New guide in four languages: docs/GERAETEPROFIL.md.
- Deutsch: Geräteprofile. Im Editor-Abschnitt „Integration“ lässt sich das gewählte Herstellerprofil als JSON-Datei exportieren und ein eigenes oder angepasstes Profil importieren („Profil exportieren“, „Profil importieren“, „Eigenes Profil entfernen“). Das gilt auch für beide Panasonic-Profile: Ein importiertes Profil mit derselben id ersetzt das eingebaute und wird mit „(angepasst)“ gekennzeichnet; Entfernen stellt das eingebaute wieder her. Ein Profil beschreibt je Feld der Karte, welche Entitäten dazugehören: genaue Entity-ID, Muster mit `*` oder Schlüssel (Endung der Entity-ID oder translation_key). Importierte Profile stehen in der Kartenkonfiguration unter `profile_custom`. Die Erkennungsanzeige im Editor folgt jetzt dem gewählten Profil. Neue Anleitung in vier Sprachen: docs/GERAETEPROFIL.de.md.
- Français : profils d'appareil. Dans la section « Intégration » de l'éditeur, le profil de fabricant choisi peut être exporté en fichier JSON et un profil personnel ou modifié peut être importé (« Exporter le profil », « Importer un profil », « Supprimer le profil personnel »). Cela vaut aussi pour les deux profils Panasonic : un profil importé avec la même id remplace le profil intégré et est marqué « (modifié) » ; le supprimer rétablit le profil intégré. Un profil décrit pour chaque champ de la carte quelles entités lui appartiennent : ID d'entité exact, modèle avec `*` ou clé (fin de l'ID d'entité ou translation_key). Les profils importés sont enregistrés dans la configuration de la carte sous `profile_custom`. L'affichage de détection de l'éditeur suit désormais le profil choisi. Nouveau guide en quatre langues : docs/GERAETEPROFIL.fr.md.
- 日本語：デバイスプロファイル。エディターの「統合」セクションで、選択中のメーカープロファイルを JSON ファイルとして書き出し、独自またはカスタムのプロファイルを読み込めます（「プロファイルを書き出す」「プロファイルを読み込む」「独自プロファイルを削除」）。2 つの Panasonic プロファイルにも対応：同じ id で読み込んだプロファイルは内蔵のものを置き換え「（カスタム）」と表示され、削除すると内蔵に戻ります。プロファイルはカードの各項目について、対応するエンティティを記述します：正確なエンティティ ID、`*` を使ったパターン、またはキー（エンティティ ID の末尾か translation_key）。読み込んだプロファイルはカード設定の `profile_custom` に保存されます。エディターの検出表示は選択中のプロファイルに従うようになりました。4 言語の新しい説明：docs/GERAETEPROFIL.ja.md。

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
