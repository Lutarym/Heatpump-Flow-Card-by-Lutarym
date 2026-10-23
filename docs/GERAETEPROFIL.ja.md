# デバイスプロファイル

[English](GERAETEPROFIL.md) · [Deutsch](GERAETEPROFIL.de.md) · [Français](GERAETEPROFIL.fr.md) · **日本語**

デバイスプロファイルは、Home Assistant でヒートポンプのエンティティがどう名付けられているかをカードに伝えます。これによりカードはエンティティを自分で見つけ、各項目に割り当てられます。他メーカーのヒートポンプを接続したり、内蔵の Panasonic プロファイルを調整したりできます。

プロファイルは JSON 形式の小さなテキストファイルです。書き出し、テキストエディターで変更し、再び読み込めます。

## 場所

カードを編集し、エディターを **詳細** に切り替えます。選択は **統合** セクション、ボタンは **インポート・エクスポートとカスタマイズ** セクションにあります：

- **メーカー**：「自動検出」またはメーカー（簡易モードでも表示）
- **統合 / 機器**：メーカーに複数の統合がある場合に開発者名付きで表示
- **複数の統合を検出しました**：「自動検出」で複数が一致した場合に表示
- **このプロファイルについて**：統合、出典リンク付きの開発者、バージョン、最終更新、対象範囲、Home Assistant で見つかったもの、カードから操作できるか、ヘルプの有無、検証済みか。バージョンと最終更新はこのカードのバージョン作成時に確認したもので、自動では更新されません。
- **プロファイルを書き出す**：選択中のプロファイルをファイルとしてダウンロードフォルダに保存
- **プロファイルを読み込む**：プロファイルファイルを読み込んで選択
- **独自プロファイルを削除**：独自またはカスタムのプロファイルの場合のみ表示

## クイックスタート

1. **Panasonic Aquarea, HeishaMon by Lutarym** を選び、**プロファイルを書き出す** を押します。このファイルをひな形にします。
2. Home Assistant でヒートポンプのエンティティを探します：**Developer tools → States**（英語表示のメニュー名）、たとえば機器名で絞り込みます。
3. テキストエディターでファイルを開きます。`id`、`name`、`hersteller`、`integration`、`namensteil` を変更し、`felder` に自分のエンティティを記入します。存在しない項目は削除してかまいません。
4. **プロファイルを読み込む** を押してファイルを選びます。カードは、記述された項目数と Home Assistant で見つかった数を表示します。
5. **統合から取り込む** を押します。ここで初めて、見つかったエンティティが項目に割り当てられます。
6. エディターで各項目を確認し、必要なら手動で修正します。

## ファイルの構成

キーはドイツ語で、このとおりに書く必要があります。

```json
{
  "format": "lutarym-geraeteprofil",
  "version": 1,
  "id": "meine_waermepumpe",
  "name": "Meine Wärmepumpe",
  "hersteller": "Beispiel",
  "integration": "",
  "namensteil": "waermepumpe",
  "felder": {
    "outside_temp": ["sensor.waermepumpe_aussentemperatur"],
    "flow_temp": ["sensor.*_vorlauf"],
    "return_temp": ["ruecklauf"],
    "dhw_temp": ["sensor.waermepumpe_warmwasser_ist"],
    "dhw_target": ["number.waermepumpe_warmwasser_soll"]
  }
}
```

| キー | 必須 | 意味 |
|---|---|---|
| `format` | はい | 常に `"lutarym-geraeteprofil"` |
| `version` | はい | 常に `1` |
| `id` | はい | 識別子。2〜40 文字、小文字 a〜z、数字、`_`、`-` のみ |
| `name` | いいえ | 選択リストに表示する名前 |
| `hersteller` | いいえ | メーカー（参考情報） |
| `integration` | いいえ | Home Assistant の統合名（下記参照） |
| `namensteil` | いいえ | ヒートポンプのすべてのエンティティ ID に含まれる文字列。例：`"vaillant"` |
| `felder` | はい | カードの各項目に対する検索ルールのリスト |

## 組み込みのメーカープロファイル

カードには次の統合用のプロファイルが含まれています。検索ルールは各統合のソースコードから作成しました。実機で検証済みなのは現在 HeishaMon by Lutarym のみで、ほかはすべて「未検証」と表示されます。フィードバックが改善に役立ちます。

**自動検出**（既定）はすべてのプロファイルを検索します。統合が 1 つだけ見つかればそれを使います。複数見つかった場合は、カードで使う統合をエディターが尋ねます。選択するまでは一致する項目が最も多いものを使います。2 項目以上一致すると統合が見つかったとみなします。

| メーカー | 統合 | 開発者 | ドメイン | 項目数 |
|---|---|---|---|---|
| Panasonic Aquarea | [HeishaMon by Lutarym](https://github.com/Lutarym/Heishamon-by-Lutarym) | Lutarym | `heishamon_lutarym` | 76 |
| Panasonic Aquarea | HeishaMon (MQTT) | | | 76 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/BenPru/luxtronik) | BenPru | `luxtronik2` | 22 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik](https://github.com/Bouni/luxtronik) | Bouni | `luxtronik` | 13 |
| Alpha Innotec, Novelan (Luxtronik) | [Luxtronik 2](https://github.com/notDIRK/luxtronik2-hass) | notDIRK | `luxtronik2_hass` | 11 |
| Batavia Heat | [Batavia Heat](https://github.com/RSloot2000/BataviaHeat-Heat-Pump) | RSloot2000 | `batavia_heat` | 8 |
| Bosch, Buderus | [Bosch Buderus Heating](https://github.com/SoftwareSchmied/ha-bosch-buderus-heating) | SoftwareSchmied | `bosch_buderus_heating` | 7 |
| Daikin | [Altherma 4 Modbus](https://github.com/joklee/ha_daikin_altherma4_modbus) | joklee | `ha_daikin_altherma4_modbus` | 10 |
| Daikin | [Altherma EKRHH Modbus](https://github.com/gerione/daikin-ha-ekrhh-modbus) | gerione | `daikin_ha_ekrhh_modbus` | 9 |
| Daikin | [Daikin Altherma](https://github.com/tadasdanielius/daikin_altherma) | tadasdanielius | `daikin_altherma` | 2 |
| Daikin | [Daikin Onecta](https://github.com/jwillemsen/daikin_onecta) | jwillemsen | `daikin_onecta` | 4 |
| DeWarmte | [DeWarmte](https://github.com/ronald-willems/dewarmte-homeassistant) | ronald-willems | `dewarmte` | 4 |
| Heliotherm | [Heliotherm](https://github.com/mbuchber/ha_heliotherm) | mbuchber | `ha_heliotherm` | 10 |
| Hitachi | [Hitachi Yutaki](https://github.com/alepee/hass-hitachi_yutaki) | alepee | `hitachi_yutaki` | 13 |
| iDM | [IDM Heatpump](https://github.com/Xerolux/idm-heatpump-hass) | Xerolux | `idm_heatpump` | 9 |
| KEBA | [KEBA Heat Pump Modbus](https://github.com/johannesWen/KEBA-Heat-Pump-Modbus-Integration) | johannesWen | `keba_heat_pump_modbus` | 5 |
| Kronoterm | [Kronoterm](https://github.com/Favio25/Kronoterm-homeassistant) | Favio25 | `kronoterm` | 15 |
| Lambda | [Lambda Heat Pumps](https://github.com/GuidoJeuken-6512/lambda_heat_pumps) | GuidoJeuken-6512 | `lambda_heat_pumps` | 15 |
| Mitsubishi Electric | [MELCloud](https://www.home-assistant.io/integrations/melcloud/) | Home Assistant Core | `melcloud` | 4 |
| Mitsubishi Electric | [MELCloud Home](https://github.com/andrew-blake/melcloudhome) | andrew-blake | `melcloudhome` | 7 |
| NIBE | [Nibe Heat Pump](https://www.home-assistant.io/integrations/nibe_heatpump/) | Home Assistant Core | `nibe_heatpump` | 13 |
| Panasonic Aquarea | [Aquarea Smart Cloud](https://github.com/wpatrik14/home-assistant-aquarea) | wpatrik14 | `aquarea` | 5 |
| Panasonic Aquarea | [HeishaMon](https://github.com/kamaradclimber/heishamon-homeassistant) | kamaradclimber | `aquarea` | 30 |
| Qube | [Qube Heat Pump](https://github.com/MattieGit/qube_heatpump) | MattieGit | `qube_heatpump` | 9 |
| Remeha | [Remeha Modbus](https://github.com/houthacker/remeha-modbus) | houthacker | `remeha_modbus` | 10 |
| Solarfocus | [Solarfocus](https://github.com/LavermanJJ/home-assistant-solarfocus) | LavermanJJ | `solarfocus` | 13 |
| Stiebel Eltron | [Stiebel Eltron ISG](https://github.com/pail23/stiebel_eltron_isg_component) | pail23 | `stiebel_eltron_isg` | 19 |
| Stiebel Eltron | [Stiebel Eltron ISG (HTTP)](https://github.com/pmq/stiebel-eltron-http) | pmq | `stiebel_eltron_http` | 6 |
| Thermia | [Thermia Heat Pump](https://github.com/klejejs/ha-thermia-heat-pump-integration) | klejejs | `thermia` | 6 |
| Vaillant | [myPyllant](https://github.com/signalkraft/mypyllant-component) | signalkraft | `mypyllant` | 7 |
| Viessmann | [ViCare](https://www.home-assistant.io/integrations/vicare/) | Home Assistant Core | `vicare` | 21 |
| Waterkotte | [Waterkotte Heatpump](https://github.com/marq24/ha-waterkotte) | marq24 | `waterkotte_heatpump` | 15 |
| Weishaupt | [Weishaupt Modbus](https://github.com/OStrama/weishaupt_modbus) | OStrama | `weishaupt_modbus` | 12 |
| Wolf | [Wolf ISM8](https://github.com/marcschmiedchen/home-assistant-wolf_ism8) | marcschmiedchen | `wolf` | 8 |

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

## 検索ルール

各項目にはルールのリストを指定します。ルールが 1 つなら角かっこなしでもかまいません。種類は 4 つです：

| ルール | 例 | 一致するもの |
|---|---|---|
| ピリオドあり | `"sensor.hp_flow"` | このエンティティのみ |
| アスタリスク `*` あり | `"sensor.*_flow"` | このパターンに合うすべてのエンティティ ID。`*` は任意の文字列 |
| ピリオドもアスタリスクもなし | `"flow"` | `_flow` で終わるエンティティ ID、またはこの内部キー（translation_key）を持つ統合のエンティティ |
| ドメインを前に付ける | `"sensor:flow"` | ピリオドもアスタリスクもなしと同じですが、この種類のエンティティのみ（ここでは `sensor`） |

最も確実なのは正確なエンティティ ID です。パターンや末尾指定は、たとえば IP アドレスが異なる他の人の環境でもプロファイルを使えるようにしたい場合に便利です。

その他のルール：

- 各項目には使えるエンティティ種別が決まっています（項目一覧の「使用できるエンティティ種別」列）。種別が合わない場合は割り当てられません。
- 読み取り専用と設定可能なエンティティの両方が一致した場合は、カードで値を設定できるよう、設定可能な方が優先されます。
- 1 つの項目に複数のルールがある場合、最初に見つかったルールが優先されます。完全一致（内部キーまたはエンティティ ID 全体）は末尾一致より優先されます。
- パターンと末尾指定では大文字・小文字を区別しません。

## 検索のしかた

- **`integration` あり**：その統合のエンティティだけを検索します。名前は **Settings → Devices & services**（英語表示のメニュー名） で統合を開いたときのアドレスバーの `/integration/` の後ろの部分です。何も見つからない場合、`namensteil` も指定されているときに限り `integration` なしと同じように検索を続けます。これにより `"outdoor_temperature"` のような一般的なキーが無関係なエンティティに一致しません。
- **`integration` なし**：すべてのエンティティを検索します。`namensteil` を指定すると、エンティティ ID にその文字列を含むものだけが対象です。`namensteil` がないと、`"flow"` のような末尾指定が無関係なエンティティにも一致することがあるため、正確な ID かパターンを使ってください。

## Panasonic の調整

1. **Panasonic Aquarea, HeishaMon by Lutarym** を選び、**プロファイルを書き出す**。
2. ファイルで変更したい項目を書き換えます。`id` は `heishamon_lutarym` のままにします。
3. **プロファイルを読み込む**。選択リストに「（カスタム）」付きで名前が表示されます。
4. **独自プロファイルを削除** で内蔵プロファイルに戻ります。

新しい `id` を付けると、代わりに独自プロファイルが追加されます。

## 保存場所

読み込んだプロファイルは、このカードの設定の `profile_custom` に保存され、このカードにだけ適用されます。インポート・エクスポートとカスタマイズ セクションの **ファイルに保存** でプロファイルも一緒に保存され、別のカードで **ファイルから読み込み** で移せます。または各カードでプロファイルファイルを読み込んでください。

## プロファイルで変わらないもの

- ヘルプ（「?」）は HeishaMon の値を説明しています。他メーカーには当てはまりません。
- 扉の奥の年間性能係数は HeishaMon の電力値で計算します。他メーカーでは空欄のままです。
- カードは HeishaMon と同じ形式の値を前提にしています：温度は °C、電力は W、電力量は kWh、流量は l/min、圧力は bar。

## 読み込み時のメッセージ

| メッセージ | 原因 |
|---|---|
| 有効な JSON ではない | ファイルが JSON ではありません。カンマやかっこの不足がよくある原因です |
| デバイスプロファイルのファイルではない | `format` がないか誤っています |
| バージョンに対応していない | `version` が `1` ではありません |
| 識別子がないか無効 | `id` が上記のルールに反しています |
| 既知の項目がない | `felder` がないか、不明な項目名だけです |
| 不明な項目を無視 | カードにない項目名です。残りは取り込まれました |

## 項目一覧

「Panasonic（HeishaMon）」列は内蔵プロファイルのキーで、割り当ての参考になります。

**外気センサー**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `outside_temp` | 外気温 | すべて | `top14` |

**室外機**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `power_state` | ヒートポンプ状態、緑LED | `switch`, `input_boolean`, `binary_sensor`, `sensor` | `setheatpump` |
| `compressor` | 圧縮機周波数 | すべて | `top8` |
| `fan1_rpm` | ファン1回転数 | すべて | `top62` |
| `fan2_rpm` | ファン2回転数 | すべて | `top63` |
| `defrost` | 除霜中 | すべて | `top26` |
| `error` | エラーコード | すべて | `top44` |
| `heatpump_state` | 運転状態 | すべて | `top0` |
| `force_defrost` | 強制除霜 | `switch`, `input_boolean` | `setforcedefrost` |
| `powerful_mode` | パワフル運転 | `select`, `input_select` | `setpowerfulmode` |
| `quiet_mode` | 静音運転 | `select`, `input_select` | `setquietmode` |
| `power_now` | 現在の消費電力 | すべて | （なし） |
| `energy_today` | 電力量計 | すべて | （なし） |

**SG Ready**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `pv_power` | 現在の太陽光出力 | すべて | （なし） |
| `sg_k1` | 接点K1 停止 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | （なし） |
| `sg_k2` | 接点K2 起動 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | （なし） |

**一次回路**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `flow_temp` | 往き温度 | すべて | `top6` |
| `return_temp` | 還り温度 | すべて | `top5` |
| `pump_speed` | 一次ポンプ回転数 | すべて | `top65` |
| `pump_flow` | 流量 | すべて | `top1` |
| `three_way_valve` | 三方弁 | すべて | `top20` |
| `water_pressure` | 水圧 | すべて | `top115` |
| `heater_internal` | 内部ヒーター運転中 | すべて | `top60` |
| `heater_external` | 外部ヒーター運転中 | すべて | `top61` |

**暖房バッファー**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `buffer_temp` | バッファー温度 | すべて | `top46` |
| `buffer_installed` | バッファーあり | すべて | `top99` |
| `buffer_switch` | バッファー運転の入切 | `switch`, `input_boolean` | `setbuffer` |

**暖房曲線**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `curve_t_high` | 回路1 暖房曲線 往き 高 | すべて | `top29` |
| `curve_t_low` | 回路1 暖房曲線 往き 低 | すべて | `top30` |
| `curve_o_high` | 回路1 暖房曲線 外気 高 | すべて | `top31` |
| `curve_o_low` | 回路1 暖房曲線 外気 低 | すべて | `top32` |
| `curve2_t_high` | 回路2 暖房曲線 往き 高 | すべて | `top82` |
| `curve2_t_low` | 回路2 暖房曲線 往き 低 | すべて | `top83` |
| `curve2_o_high` | 回路2 暖房曲線 外気 高 | すべて | `top84` |
| `curve2_o_low` | 回路2 暖房曲線 外気 低 | すべて | `top85` |

**暖房バッファー**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `buffer_delta` | バッファーのヒステリシス | すべて | `top113` |
| `buffer_target` | バッファー目標温度 | すべて | `top7` |
| `cop_heating` | COP 暖房 | すべて | `cop_heating` |
| `room_heater` | 暖房ヒーター許可 | すべて | `top59` |
| `room_heater_switch` | 暖房ヒーター許可の切替 | `switch`, `input_boolean` | `setroomheaterstate` |

**回路1**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `zones_state` | 有効なゾーン | すべて | `top94` |
| `zones_select` | ゾーン切替 | `select`, `input_select` | `setzones` |
| `hk1_water` | 回路1 水温 | すべて | `top36` |
| `hk1_water_target` | 回路1 目標水温 | すべて | `top42` |
| `hk1_pump` | 回路1 ポンプ運転中 | すべて | `top124` |
| `hk1_setpoint` | 回路1 設定温度 | `number`, `input_number` | `top27` |
| `hk1_switch` | 回路1 入切 | `switch`, `input_boolean` | （なし） |

**回路2**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `hk2_water` | 回路2 水温 | すべて | `top37` |
| `hk2_water_target` | 回路2 目標水温 | すべて | `top43` |
| `hk2_pump` | 回路2 ポンプ運転中 | すべて | `top123` |
| `hk2_setpoint` | 回路2 設定温度 | `number`, `input_number` | `top34` |
| `hk2_switch` | 回路2 入切 | `switch`, `input_boolean` | （なし） |

**給湯**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `dhw_installed` | 給湯あり | すべて | `top100` |
| `dhw_temp` | 給湯温度 | すべて | `top10` |
| `dhw_heat_delta` | 給湯のヒステリシス | すべて | `top22` |
| `dhw_setpoint` | 給湯設定温度 | `number`, `input_number` | `top9` |
| `cop_dhw` | COP 給湯 | すべて | `cop_dhw` |
| `dhw_heater` | 給湯ヒーター許可 | すべて | `top58` |
| `dhw_force` | 一回だけ加熱 | `switch`, `input_boolean` | `setforcedhw` |
| `dhw_force_state` | 加熱中 | すべて | `top2` |
| `force_sterilization` | レジオネラ運転を開始 | `switch`, `input_boolean` | `setforcesterilization` |
| `sterilization_state` | レジオネラ運転中 | すべて | `top69` |
| `dhw_heater_switch` | 給湯ヒーター許可の切替 | `switch`, `input_boolean` | `setdhwheaterstate` |
| `circulation_pump` | 循環ポンプ運転中 | `switch`, `input_boolean`, `binary_sensor`, `sensor` | （なし） |
| `circ_switch` | 循環スイッチ（クリック可） | `switch`, `input_boolean` | （なし） |

**制御**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `mode_select` | 運転モード切替 | `select`, `input_select` | `setoperationmode` |

**詳細設定**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `heating_off_temp` | 暖房停止 外気温 | すべて | `top77` |
| `heater_on_temp` | ヒーター開始 外気温 | すべて | `top78` |
| `heat_delta` | 暖房温度差 (ΔT) | すべて | `top23` |
| `heating_control` | 暖房制御 | `select`, `input_select` | `setheatingcontrol` |
| `steril_temp` | レジオネラ対策温度 | すべて | `top70` |
| `steril_time` | レジオネラ対策保持時間 | すべて | `top71` |
| `pump_flow_mode` | ポンプ制御 | `select`, `input_select` | `setpumpflowratemode` |
| `pump_max_duty` | ポンプ最大出力 | すべて | `top95` |
| `quiet_priority` | 静音モード優先 | `select`, `input_select` | `setquietmodepriority` |
| `holiday_mode` | 休暇モード | `switch`, `input_boolean` | `setholidaymode` |
| `main_schedule` | 週間スケジュール | `switch`, `input_boolean` | `setmainschedule` |
| `smart_dhw` | スマート給湯 | `select`, `input_select` | `setsmartdhw` |
| `operating_hours` | 運転時間 | すべて | `top11` |
| `compressor_starts` | 圧縮機起動回数 | すべて | `top12` |
| `room_heater_hours` | 暖房ヒーター運転時間 | すべて | `top90` |
| `dhw_heater_hours` | 給湯ヒーター運転時間 | すべて | `top91` |

**制御**

| 項目 | 意味 | 使用できるエンティティ種別 | Panasonic（HeishaMon） |
|---|---|---|---|
| `operating_mode` | 運転モード（表示） | すべて | `top4` |
