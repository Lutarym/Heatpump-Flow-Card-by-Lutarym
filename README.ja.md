# Heatpump-Flow-Card-by-Lutarym

[English](README.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · **日本語**

![カードのスクリーンショット](https://raw.githubusercontent.com/Lutarym/Heatpump-Flow-Card-by-Lutarym/main/docs/screenshot-ja.png)

Panasonic Aquarea ヒートポンプを HeishaMon 経由で接続し、動くシステム図として表示する Home Assistant 用のアニメーション付き Lovelace カードです。

## 機能

- 室外機、暖房バッファー、1〜2 系統の暖房回路、給湯タンク、循環を含むシステム図
- 三方弁、ポンプ、圧縮機、バッファーの実際の配管動作に従う流れのアニメーション
- タンク、放熱器、配管の温度による色分け
- 回路1と回路2の暖房曲線を専用ウィンドウに表示。目盛り、運転点、調整可能な基準点つき
- 過去24時間の使用量グラフ。暖房、給湯、待機で色分けし、その下に SG Ready の履歴
- 暖房バッファーのないシステムに対応。TOP99 で自動検出、または手動設定
- 横長と縦長のレイアウト
- 統合を自動検出するビジュアルエディター、設定の書き出しと読み込み
- 4 言語：英語、ドイツ語、フランス語、日本語

## 必要なもの

- Home Assistant 2024.1.0 以降
- HeishaMon。統合 HeishaMon by Lutarym または MQTT で接続
- MQTT 経由で暖房曲線を書き込む場合：Home Assistant の MQTT 統合

## インストール

### HACS

1. HACS を開き、三点メニューからカスタムリポジトリを選択
2. リポジトリ：`https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`、カテゴリ：**Dashboard**
3. カードを検索してダウンロード
4. HACS がリソースを自動登録します。ダッシュボードが YAML モードの場合は下記のとおり手動で追加してください
5. ブラウザーをキャッシュなしで再読み込み

### 手動

1. 最新リリースから `heatpump-flow-card-by-lutarym.js` をダウンロード
2. `<config>/www/community/heatpump-flow-card-by-lutarym/` にコピー
3. 設定、ダッシュボード、三点メニュー、リソース、リソースを追加
4. URL `/local/community/heatpump-flow-card-by-lutarym/heatpump-flow-card-by-lutarym.js`、種類 **JavaScript モジュール**

## 設定

ビジュアルエディターを使うのが最も簡単です。カードを追加し、**統合から取り込む** を押してください。カードが HeishaMon by Lutarym のエンティティを自動で検出します。見つからないエンティティは手動で割り当てられます。

### YAML の例

```yaml
type: custom:heatpump-flow-card-by-lutarym
layout: quer
hk_count: 2
language: auto
entities:
  outside_temp: sensor.heishamon_top14
  flow_temp: sensor.heishamon_top6
  return_temp: sensor.heishamon_top5
  compressor: sensor.heishamon_top8
  three_way_valve: sensor.heishamon_top20
  buffer_temp: sensor.heishamon_top46
  dhw_temp: sensor.heishamon_top10
  hk1_water: sensor.heishamon_top36
  hk1_water_target: sensor.heishamon_top42
```

エンティティ ID はカードの標準名です。実際の名前は異なる場合がありますが、エディターが自動で割り当てます。

### オプション

| オプション | 既定値 | 内容 |
|---|---|---|
| `layout` | `quer` | `quer` 横長、`hoch` 縦長 |
| `hk_count` | `2` | 暖房回路の数、1 または 2 |
| `fan_count` | `2` | ファンの数、1 または 2 |
| `language` | `auto` | `auto`、`de`、`en`、`fr`、`ja` |
| `profil` | `heishamon_lutarym` | `heishamon_lutarym`、または MQTT 命名規則の `heishamon` |
| `buffer_present` | `auto` | 暖房バッファー：`auto` は TOP99 に従う、`true` または `false` |
| `circulation_present` | `auto` | 循環：`auto` はエンティティ割り当て時に表示、`true` または `false` |
| `show_history` | `true` | 使用量グラフを表示 |
| `history_width` | `450` | 使用量グラフの幅、250〜700 |
| `card_width` | `0` | 幅（ピクセル）、0 で自動 |
| `card_height` | `0` | 高さ（ピクセル）、0 で自動 |
| `pipe_inner_mm` | `0` | 配管内径（mm）、流量を色分け、0 で無効 |
| `mqtt_prefix` | `panasonic_heat_pump` | HeishaMon の MQTT プレフィックス |
| `curve_x_min / curve_x_max` | `-20 / 20` | 暖房曲線の外気目盛り（°C） |
| `curve_y_min / curve_y_max` | `20 / 75` | 暖房曲線の往き目盛り（°C） |
| `scale_min / scale_max` | `20 / 60` | 暖房の色分け範囲（°C） |
| `outdoor_min / outdoor_max` | `-15 / 35` | 外気センサーの色分け範囲（°C） |
| `label_hk1, label_hk2, label_buffer, label_dhw, label_energy` | | 独自の名前。空欄ならカードの言語 |
| `energy_daily` | `true` | メーター値から当日の使用量を計算 |
| `animate` | `true` | アニメーションを表示 |
| `demo` | `false` | 試用のための仮の値 |

### エンティティ

すべての項目は任意です。エンティティのない項目はカード上に表示されません。コマンド名がある項目は、HeishaMon 経由で値を書き込めます。

| キー | 内容 | 備考 |
|---|---|---|
| **外気センサー** | | |
| `outside_temp` | 外気温 | TOP14 |
| **室外機** | | |
| `power_state` | ヒートポンプ状態、緑LED | SetHeatpump または TOP0 |
| `compressor` | 圧縮機周波数 | TOP8 |
| `fan1_rpm` | ファン1回転数 | TOP62 |
| `fan2_rpm` | ファン2回転数 | TOP63 |
| `defrost` | 除霜中 | TOP26 |
| `error` | エラーコード | TOP44 |
| `heatpump_state` | 運転状態 | TOP0 |
| `force_defrost` | 強制除霜 | SetForceDefrost, switch |
| `powerful_mode` | パワフル運転 | SetPowerfulMode, select |
| `quiet_mode` | 静音運転 | SetQuietMode, select |
| `power_now` | 現在の消費電力 | Shelly PM, Watt |
| `energy_today` | 電力量計 | Shelly PM, kWh |
| **SG Ready** | | |
| `pv_power` | 現在の太陽光出力 | 独自エンティティ、ワット |
| `sg_k1` | 接点K1 停止 | Shelly、リレーまたは入力 |
| `sg_k2` | 接点K2 起動 | Shelly、リレーまたは入力 |
| **一次回路** | | |
| `flow_temp` | 往き温度 | TOP6 |
| `return_temp` | 還り温度 | TOP5 |
| `pump_speed` | 一次ポンプ回転数 | TOP65 |
| `pump_flow` | 流量 | TOP1 |
| `three_way_valve` | 三方弁 | TOP20 |
| `water_pressure` | 水圧 | TOP115 |
| **暖房バッファー** | | |
| `buffer_temp` | バッファー温度 | TOP46 |
| `buffer_installed` | バッファーあり | TOP99 |
| `buffer_switch` | バッファー運転の入切 | SetBuffer, switch |
| **暖房曲線** | | |
| `curve_t_high` | 回路1 暖房曲線 往き 高 | TOP29 |
| `curve_t_low` | 回路1 暖房曲線 往き 低 | TOP30 |
| `curve_o_high` | 回路1 暖房曲線 外気 高 | TOP31 |
| `curve_o_low` | 回路1 暖房曲線 外気 低 | TOP32 |
| `curve2_t_high` | 回路2 暖房曲線 往き 高 | TOP82 |
| `curve2_t_low` | 回路2 暖房曲線 往き 低 | TOP83 |
| `curve2_o_high` | 回路2 暖房曲線 外気 高 | TOP84 |
| `curve2_o_low` | 回路2 暖房曲線 外気 低 | TOP85 |
| **暖房バッファー** | | |
| `buffer_delta` | バッファーのヒステリシス | TOP113 |
| `buffer_target` | バッファー目標温度 | TOP7, 往き目標 |
| `room_heater` | 暖房用ヒーター | TOP59 |
| `room_heater_switch` | 暖房用ヒーターの入切 | SetRoomHeaterState, switch |
| **回路1** | | |
| `zones_state` | 有効なゾーン | TOP94, 両方に適用 |
| `zones_select` | ゾーン切替 | SetZones, 両方に適用 |
| `hk1_water` | 回路1 水温 | TOP36 |
| `hk1_water_target` | 回路1 目標水温 | TOP42 |
| `hk1_pump` | 回路1 ポンプ運転中 | TOP124 |
| `hk1_setpoint` | 回路1 設定温度 | TOP27, number |
| `hk1_switch` | 回路1 入切 | 独自スイッチ、任意 |
| **回路2** | | |
| `hk2_water` | 回路2 水温 | TOP37 |
| `hk2_water_target` | 回路2 目標水温 | TOP43 |
| `hk2_pump` | 回路2 ポンプ運転中 | TOP123 |
| `hk2_setpoint` | 回路2 設定温度 | TOP34, number |
| `hk2_switch` | 回路2 入切 | 独自スイッチ、任意 |
| **給湯** | | |
| `dhw_installed` | 給湯あり | TOP100 |
| `dhw_temp` | 給湯温度 | TOP10 |
| `dhw_heat_delta` | 給湯のヒステリシス | TOP22 |
| `dhw_setpoint` | 給湯設定温度 | TOP9, number |
| `dhw_heater` | 給湯用ヒーター | TOP58 |
| `dhw_force` | 一回だけ加熱 | SetForceDHW, switch |
| `dhw_force_state` | 加熱中 | TOP2 |
| `force_sterilization` | レジオネラ運転を開始 | SetForceSterilization, switch |
| `sterilization_state` | レジオネラ運転中 | TOP69 |
| `dhw_heater_switch` | 給湯用ヒーターの入切 | SetDHWHeaterState, switch |
| `circulation_pump` | 循環ポンプ運転中 | Shellyまたは独自スイッチ |
| `circ_switch` | 循環スイッチ（クリック可） | 循環の入切スイッチ |
| **制御** | | |
| `mode_select` | 運転モード切替 | SetOperationMode, select |

## 言語

カードは Home Assistant の言語に従います。対応していない場合は英語で表示されます。`language` で言語を固定できます。

## 変更履歴

[CHANGELOG.md](CHANGELOG.md) を参照してください。

## ライセンス

GNU General Public License v3.0。[LICENSE](LICENSE) を参照してください。
