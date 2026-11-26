# デバイスプロファイル

[English](GERAETEPROFIL.md) · [Deutsch](GERAETEPROFIL.de.md) · [Français](GERAETEPROFIL.fr.md) · **日本語**

デバイスプロファイルは、Home Assistant のどのエンティティがどの値に対応するかをカードに伝えます。値の名前は [名前リスト](NAMENSLISTE.ja.md) のとおりで、たとえば外気温は TOP14 です。プロファイルがあれば、カードはエンティティを自分で見つけます。

バージョン 6.0.0 以降、カード自体にはプロファイルが含まれていません。すべてのプロファイルはフォルダー `dist/Profile` 内のファイルで、メーカーごとに 1 ファイルです。各統合またはファームウェアはその中のバリエーションで、Panasonic Aquarea ならたとえば HeishaMon by Lutarym、HeishaMon (MQTT)、kamaradclimber の HeishaMon、Aquarea Smart Cloud です。HACS はこのフォルダーをカードと一緒にインストールします。独自のプロファイルは読み込みで追加します。

## 場所

カードを編集します。**統合** セクション：

- **メーカー**：「自動検出」、Profile フォルダーのメーカー、「独自プロファイル」（ある場合）、または「プロファイルなし（エンティティを自分で入力）」
- **統合 / 機器**：メーカーに複数のバリエーションがある場合に開発者名付きで表示
- **複数の統合を検出しました**：「自動検出」で複数のバリエーションが一致した場合に表示
- **特定のプロファイルを読み込みますか？**：「自動検出」でどのバリエーションも一致しない場合に表示。メーカーと統合を選び、**プロファイルを読み込む** を押します。**いいえ、エンティティを自分で入力します** を押すと「プロファイルなし（エンティティを自分で入力）」になり、エディターにエンティティの項目が表示されます。
- **統合から取り込む**：見つかったエンティティを項目に固定で記入します
- **再検索**：「自動検出」に切り替え、すべてのプロファイルを検索し直します。以前にプロファイルを読み込めなかった場合は、読み込み直します。
- **標準名を入力**（エディターを **詳細** に設定）：プロファイルが正確に、またはパターン `*.name` で示すエンティティ ID を記入します（例：`sensor.heishamon_top14`）
- **このプロファイルについて**：統合、出典リンク付きの開発者、バージョン、統合の最終更新と確認日、対象範囲、Home Assistant で見つかったもの、カードから操作できるか、ヘルプの有無、検証済みか。バージョンと日付はプロファイルファイルに記載され、自動では変わりません。その下に **GitHub でフィードバック** と **レポートをコピー**：割り当て済み・未検出・手動変更の値と、統合の未使用エンティティを含むレポートで、プロファイルの改善に役立ちます。エンティティ ID と現在の値を含みます。GitHub で送信前に確認・編集できます。

**インポート・エクスポートとカスタマイズ** セクション（エディターを **詳細** に設定）：

- **プロファイルを書き出す**：選択中または検出されたバリエーションをファイルとしてダウンロードフォルダーに保存
- **プロファイルを読み込む**：プロファイルファイルを読み込み、（最初の）バリエーションを選択
- **GitHub でプロファイルを検索**：[GitHub からプロファイルを読み込む](#github-からプロファイルを読み込む) を参照
- **独自プロファイルを削除**：独自、カスタム、または GitHub から読み込んだプロファイルの場合のみ表示

## カードの読み込みと検索

1. カード設定の `profil` にバリエーションの識別子が入ります（例：`heishamon_lutarym`）。5.33.8 までの識別子も引き続き使えます。
2. バリエーションを選択した場合：カードは `liste.json` と、そのバリエーションのファイルだけを読み込みます。
3. `auto`（「自動検出」、既定）：カードは `liste.json` とすべてのファイルを 1 回読み込みます。すべてのバリエーションを調べ、一致する値が最も多いものを使います。少なくとも 2 つの値が一致すれば見つかったとみなします。バリエーションがエンティティ ID で検索する場合（統合なし）、登録上ほかのバリエーションの統合に属するエンティティは数えません。
4. どのバリエーションも一致しない場合：カードは「一致するプロファイルが見つかりません。特定のプロファイルを読み込みますか？カードを編集し、上部でメーカーと統合を選択してください。」と表示します。プロファイルがなければ、カードはメーカーを仮定しません。
5. `keins`：プロファイルなし。カードは記入したエンティティだけを使います。
6. ブラウザーはファイルをページごとに 1 回読み込みます。カードは要求にバージョンを付けるので、更新後はブラウザーが新しいファイルを取得します。
7. プロファイルを読み込めなかった場合、カードは「デバイスプロファイルを読み込めませんでした。ページを再読み込みしてください。」と表示します。
8. Home Assistant に同じ統合の機器が複数ある場合（たとえばヒートポンプ 2 台）、カードは記入されていない値を、記入済みエンティティの機器で探します。

## クイックスタート：独自プロファイル

1. 合うか似ているバリエーション（例：**Panasonic Aquarea, HeishaMon by Lutarym**）を選び、**プロファイルを書き出す** を押します。このファイルをひな形にします。
2. Home Assistant でヒートポンプのエンティティを探します：**Developer tools → States**（英語表示のメニュー名）、たとえば機器名で絞り込みます。
3. テキストエディターでファイルを開きます。識別子（ファイルとバリエーションの `id`）、名前、`suche` を変更し、`werte` に自分のエンティティを記入します。存在しない値は削除してかまいません。
4. **プロファイルを読み込む** を押してファイルを選びます。カードは、記述された値の数と Home Assistant で見つかった数を表示します。
5. 見つかったエンティティを項目に固定したい場合は **統合から取り込む** を押します。
6. エディターで各項目を確認し、必要なら手動で修正します。

## ファイルの構成

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 2,
  "id": "beispiel",
  "name": "Beispiel",
  "karte_ab": "6.0.0",
  "varianten": [
    {
      "id": "beispiel_wp",
      "name": "Beispiel WP",
      "geraete": [{ "hersteller": ["Beispiel"], "reihe": "", "modelle": [], "hinweis": "" }],
      "quelle": {
        "entwickler": "jemand",
        "adresse": "https://github.com/jemand/beispiel-wp",
        "version": "1.0.0",
        "aktualisiert": "2026-11-20",
        "abgelesen": "2026-11-26"
      },
      "suche": { "art": "integration", "integration": "beispiel_wp", "namensteil": "" },
      "werte": {
        "TOP14": ["outdoor_temperature"],
        "TOP6": ["sensor.*_vorlauf"],
        "TOP1": { "suche": ["sensor.*_durchfluss"], "einheit": "l/h" },
        "TOP26": { "suche": ["sensor.*_betrieb"], "zustaende": { "abtauen": 1, "*": 0 } }
      }
    }
  ]
}
```

ファイル：

| 項目 | 必須 | 意味 |
|---|---|---|
| `format`、`version` | はい | 常に `"lutarym-geraeteprofil"` と `2` |
| `id` | はい | ファイルの識別子で、`.json` を除いたファイル名と同じ。2〜40 文字、小文字 a〜z、数字、`_`、`-` のみ。`liste` は使用済み。 |
| `name` | はい | エディターに表示されるメーカー名 |
| `karte_ab` | はい | このファイルを理解できる最小のカードバージョン（例：`6.0.0`）。カードより新しい場合、カードはファイルを拒否します。 |
| `varianten` | はい | 1 つ以上のバリエーション |

各バリエーション：

| 項目 | 必須 | 意味 |
|---|---|---|
| `id` | はい | バリエーションの識別子で、すべてのファイルで一意。5.33.8 までの識別子はそのまま。 |
| `name` | はい | 統合またはファームウェアの名前 |
| `geraete` | はい | `hersteller`（リスト）、`reihe`、`modelle`（リスト）、`hinweis` を持つリスト |
| `quelle` | Profile フォルダーでは必須 | `entwickler`、`adresse`（https:// 付き）、`version`、`aktualisiert`（統合の最終更新）、`abgelesen`（確認日） |
| `suche` | はい | `art`：`integration`、`core`、`firmware`。`integration`：Home Assistant の登録のドメイン。`namensteil`：登録なしで検索する場合のエンティティ ID の一部。 |
| `heishamon` | いいえ | 値が HeishaMon から来る場合は `true`（[heishamon の指定](#heishamon-の指定)） |
| `getestet` | いいえ | 実機で確認した場合は `true` |
| `werte` | はい | 名前リストの名前と、カードがそのエンティティを見つける方法 |

短い形式の値は検索ルールのリストです（例：`"TOP14": ["outdoor_temperature"]`）。長い形式には換算の指定が加わります：`"TOP1": { "suche": [...], "einheit": "l/h" }`。

## 検索ルール

| ルール | 例 | 一致するもの |
|---|---|---|
| キー | `"top14"` | この内部キー（translation_key）を持つ統合のエンティティ、または `_top14` で終わるエンティティ ID |
| ドメインとキー | `"number:top27"` | 上と同じですが、この種類のエンティティのみ |
| アスタリスク付きパターン | `"sensor.*boiler_fanspd"` | このパターンに合うすべてのエンティティ ID。`*` は任意の文字列 |
| 正確なエンティティ | `"sensor.outdoor"` | このエンティティのみ |

その他のルール：

- 1 つの名前に 1 つのエンティティ。複数のルールは代替で、カードは 2 つのエンティティの値を組み合わせません。
- 各名前には使えるエンティティ種別が決まっています（[名前リスト](NAMENSLISTE.ja.md) の「エンティティ種別」列）。種別が合わない場合は記入されません。
- 読み取り専用と設定可能なエンティティの両方が一致した場合は、カードで値を設定できるよう、設定可能な方が優先されます。
- 1 つの名前に複数のルールがある場合、最初に見つかったルールが優先されます。完全一致（内部キーまたはエンティティ ID 全体）は末尾一致やパターンより優先されます。
- パターンと末尾指定では大文字・小文字を区別しません。

## 検索のしかた

- **`integration` あり**：その統合のエンティティだけを検索します。名前は **Settings → Devices & services**（英語表示のメニュー名）で統合を開いたときのアドレスバーの `/integration/` の後ろの部分です。何も見つからない場合、`namensteil` も指定されているときに限り `integration` なしと同じように検索を続けます。これにより `"outdoor_temperature"` のような一般的なキーが無関係なエンティティに一致しません。
- **`integration` なし**：すべてのエンティティを検索します。`namensteil` を指定すると、エンティティ ID にその文字列を含むものだけが対象です。`namensteil` がないと末尾指定が無関係なエンティティにも一致することがあるため、正確な ID かパターンを使ってください。

## 単位と状態

- `einheit`：HeishaMon の単位でない場合に統合が提供する単位。ルールによって異なる場合は単位をリストで書きます。エンティティ自身が単位を報告する場合はそれが優先されます。そうでない場合はプロファイルの単位が使われますが、プロファイル自身が見つけたエンティティに限り、かつプロファイルが単位を 1 つだけ示す場合に限ります（独自の決定）。
- `zustaende`：HeishaMon と同じく文字とその値。`"*"` はそれ以外のすべての文字です。数値や on、off などの語は、この指定がなくてもカードが理解します。カードはプロファイル自身が見つけたエンティティに限り、履歴も含めて文字を変換します。指定がなくても、文字に「defrost」または「abtau」を含めば除霜と判断します。EMS-ESP では、除霜を表す語を EMS-ESP の 12 言語すべてでプロファイルに記載しています。

| 名前 | カードの換算先 | プロファイルで指定できるもの |
|---|---|---|
| TOP62、TOP63、TOP65（ファン、ポンプ） | rpm | rpm または %。% の場合：0 % は停止、100 % が最速（900 rpm 相当。独自の決定で、動きにのみ使用）。 |
| TOP11、TOP90、TOP91（運転時間） | h | h、min、s、ms、d |
| TOP1（流量） | l/min | l/min、l/h、l/s、ml/s、m3/h、gal/min、ft3/min |
| EXT1、EXT3、EXT4（電力） | W | W、kW、MW |
| EXT2（電力量） | kWh | Wh、kWh、MWh |
| TOP8（圧縮機） | Hz | Hz または %。カードは受け取った単位で表示します。 |
| TOP26 とすべてのオン／オフの値 | 0 と 1 | 数値、オンとオフ、`zustaende` による独自の文字 |
| TOP20（三方弁） | 0 暖房、1 給湯 | 数値、オンとオフ、給湯を表す語を含む文字、`zustaende` による独自の文字 |

表にない単位はビルドがエラーとして報告します。カードは温度を °C、圧力を bar で前提にしています。

## heishamon の指定

バリエーションに `"heishamon": true` がある場合：

1. HeishaMon の値とコマンドを説明するヘルプウィンドウが使えます。
2. 値が本来読み取り専用の場合、カードは MQTT でコマンドを HeishaMon に送ります（例：暖房曲線の SET16）。
3. HeishaMon がデータを送っているのに TOP95、TOP99、TOP100 に値がない場合、カードはグループ「Installer settings」についての案内を表示します。
4. ソーラー入力の暖炉：暖炉だけを選択している場合、TOP47 と OPT5 は暖炉（EXT300 と EXT301）に属します。

TOP92 による Panasonic のシリーズは、`geraete` のメーカーに従います。

## 組み込みのプロファイル

検索ルールは各統合のソースコードに基づき、`abgelesen` の日に確認しています。実機で検証済みなのは今のところ HeishaMon by Lutarym と HeishaMon (MQTT) だけで、ほかはすべて「未検証」です。フィードバックが改善に役立ちます。機種は今のところ HeishaMon（HeishaMon の HeatPumpType.md）と EMS-ESP（EMS-ESP の device_library.h）にのみ記載しています。

| ファイル | メーカー | バリエーション | 開発者 | ドメイン | 値 |
|---|---|---|---|---|---|
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| `alpha_innotec_novelan.json` | Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| `batavia_heat.json` | Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| `bosch_buderus.json` | Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| `bosch_buderus.json` | Bosch, Buderus | [EMS-ESP (MQTT)](https://github.com/emsesp/EMS-ESP32) | emsesp |  | 41 |
| `daikin.json` | Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| `daikin.json` | Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| `daikin.json` | Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| `daikin.json` | Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| `dewarmte.json` | DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| `heliotherm.json` | Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| `hitachi.json` | Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| `idm.json` | iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| `keba.json` | KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| `kronoterm.json` | Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| `lambda.json` | Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| `mitsubishi_electric.json` | Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| `nibe.json` | NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 127 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon (MQTT)](https://github.com/heishamon/HeishaMon) |  |  | 105 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| `panasonic_aquarea.json` | Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| `qube.json` | Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| `remeha.json` | Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| `solarfocus.json` | Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| `stiebel_eltron.json` | Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| `thermia.json` | Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| `vaillant.json` | Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| `viessmann.json` | Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| `waterkotte.json` | Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| `weishaupt.json` | Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| `wolf.json` | Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

EMS-ESP には統合は不要です。ファームウェアが MQTT Discovery で Home Assistant にエンティティを作成します。ルールは EMS-ESP の設定「Entity ID format」の短い名前（単一または複数インスタンス、最新または v3.5）に対応し、「Single instance, long name (v3.4)」には対応しません。

プロファイルなし（理由）：

- `myuplink`: エンティティ名が機器から動的に決まる
- `wolflink`: エンティティ名が機器から動的に決まる
- `ebusd`: 名前が各自の ebusd 設定に依存する
- `stiebel_eltron`: climate エンティティのみ
- `bosch`: エンティティ名が機器から動的に決まる
- `tuya_heat_pump`: データポイントが機器ごとに異なる
- `toshiba_modbus`: ルームエアコン
- `midea_heatpump_hws`: 給湯専用ヒートポンプ
- `dimplex`: 往き・還り・圧縮機などのヒートポンプ値がない

## フォルダーにプロファイルを追加する

1. ファイル `dist/Profile/<id>.json` を作成します。メーカーごとに 1 ファイルです。メーカーがすでにある場合、新しいバリエーションはそのファイルに入れます。
2. `npm run build`：ビルドはフォルダー内のすべてのファイルを読み込んで確認し、`dist/Profile/liste.json` を書き出します。プロファイルを追加するには、ファイルを置いてビルドするだけです。
3. ビルドは次を確認します：`format` と `version`、`id` とファイル名の一致、必須項目、すべての識別子がすべてのファイルで一意か、各名前が名前リストにあるか、検索ルールが空でないか、単位（上の表）、`zustaende`（数値のみ）、`karte_ab` がカードより新しくないか、`quelle` に https のアドレスと確認日があるか。エラーがあると中止し、その箇所を示します。

## GitHub からプロファイルを読み込む

1. **インポート・エクスポートとカスタマイズ** セクションのボタン **GitHub でプロファイルを検索**。カードが GitHub に問い合わせるのはボタンを押したときだけで、ダッシュボードを開くたびではありません。
2. カードはカードのリポジトリの main ブランチにあるフォルダー `dist/Profile` の `liste.json` を読み、インストール済みより新しいか新規のバリエーションを表示します。新しいとは、確認日（`abgelesen`）が後、統合の更新（`aktualisiert`）が後、またはバージョンが高いことです。
3. **読み込む** はファイルを取得し、自分のフォルダーから読み込むときと同じように確認します。`karte_ab` がカードより新しい場合、カードは案内とともに拒否します。
4. カードはバリエーションを読み込んだプロファイルと同じようにカード設定に保存し、選択します。その後はインターネットなしでも動作します。選択リストでは「（GitHub から）」付きで表示されます。
5. カードが読み込むのはデータだけで、プログラムコードは読み込みません。

## 組み込みのプロファイルを調整する

1. バリエーションを選び、**プロファイルを書き出す**。
2. ファイルで変更したい値を書き換えます。バリエーションの `id` はそのままにします。
3. **プロファイルを読み込む**。選択リストに「（カスタム）」付きでバリエーションが表示されます。
4. **独自プロファイルを削除** で Profile フォルダーのバリエーションに戻ります。

新しい `id` を付けると、代わりに「独自プロファイル」に独自プロファイルが追加されます。

## 独自プロファイルの保存場所

読み込んだプロファイルと GitHub から読み込んだプロファイルは、このカードの設定の `profile_custom` に保存され、このカードにだけ適用されます。インポート・エクスポートとカスタマイズ セクションの **ファイルに保存** でプロファイルも一緒に保存され、別のカードで **ファイルから読み込み** で移せます。または各カードでプロファイルファイルを読み込んでください。

## 以前のプロファイルファイル

読み込みでは、形式 1（5.33.8 まで、`felder` と以前の項目名）のプロファイルファイルも引き続き読めます。カードは項目名を [名前リスト](NAMENSLISTE.ja.md) に従って変換します。HeishaMon 用のプロファイルは heishamon の指定を保ちます（独自の決定：統合 `heishamon_lutarym`、名前の一部または識別子に `heishamon` を含む場合）。書き出しは常に形式 2 です。

## プロファイルで変わらないもの

- ヘルプ（「?」）は HeishaMon の値を説明しています。heishamon の指定があるバリエーションとデモモードでのみ表示されます。
- 扉の奥の年間性能係数は HeishaMon の電力値（TOP15、TOP16、TOP40、TOP41 または XTOP0、XTOP2、XTOP3、XTOP5）で計算します。プロファイルがそれらを提供しない場合は空欄のままです。

## 読み込み時のメッセージ

| メッセージ | 原因 |
|---|---|
| 有効なJSONではありません。書き出したテキストを貼り付けてください。 | ファイルが JSON ではありません。カンマやかっこの不足がよくある原因です |
| デバイスプロファイルのファイルではありません（format は「lutarym-geraeteprofil」である必要があります）。 | `format` がないか誤っています |
| このプロファイルのバージョンには対応していません（version 2 または 1 が必要です）。 | `version` が `2` でも `1` でもありません |
| 識別子（id）がないか無効です：2〜40 文字、a〜z、0〜9、_、- のみ。 | `id` が上記のルールに反しています |
| プロファイルに既知の値（werte）がありません。 | `werte`（形式 1：`felder`）がないか、不明な名前だけです |
| 不明な名前を無視しました：… | これらの名前は名前リストにありません。ほかは取り込みました |
| このプロファイルにはカードのバージョン x.y.z 以降が必要です。先にカードを更新してください。 | `karte_ab` がカードより新しい |
