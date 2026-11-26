# 開発

**日本語** · [English](ENTWICKLUNG.md) · [Deutsch](ENTWICKLUNG.de.md) · [Français](ENTWICKLUNG.fr.md)

HACS でインストールする場合、ここに書かれていることは不要です。HACS は `dist` の完成したファイル `heatpump-flow-card-by-lutarym.js`、必要なときにカードが読み込むヘルプ `heatpump-flow-card-by-lutarym-hilfe.js`、デバイスプロファイルの入ったフォルダー `Profile` だけを読み込みます。

## 構成

コードは `src/` 内のモジュールに分かれています。そこから `dist/` の 1 つのファイルを作成します。

| ファイル | 内容 |
|---|---|
| `src/index.js` | 入口。カードとエディターを Home Assistant に登録 |
| `src/konstanten.js` | バージョン、描画グリッド、色スケール、時間 |
| `src/texte.js` | 4 言語のすべてのテキスト |
| `src/sprachen.js` | 独自の言語パック |
| `src/hilfe-daten.js` | ヘルプ画面の内容 |
| `src/hilfsfunktionen.js` | 状態の読み取り、数値の書式、色 |
| `src/namen.js` | 名前リスト（TOP、XTOP、OPT、SET、EXT）、使えるエンティティ種別、単位、以前の項目名の変換 |
| `src/erkennung.js` | デバイスプロファイルによるエンティティの検出 |
| `src/profile.js` | デバイスプロファイルの読み込みと確認、独自プロファイル、GitHub のプロファイル |
| `src/felder.js` | カードの項目と既定の設定 |
| `src/karte/` | カード本体（図、扉、ダイアログ、ヘルプ、履歴、グラフ、暖房曲線、デモ、スタイル） |
| `src/editor/` | エディター（操作、インポートとエクスポート、スタイル） |

## ビルド

Node.js が必要です。

```
npm install
npm run build
```

`npm run watch` は変更のたびに再ビルドします。

ビルドの前に `scripts/profile.mjs` が `dist/Profile` のすべてのファイルを確認し、`dist/Profile/liste.json` を書き出します。プロファイルに誤りがあるとビルドは中止します。[デバイスプロファイル](GERAETEPROFIL.ja.md#フォルダーにプロファイルを追加する) を参照してください。

## 注意

- `src/` または `dist/Profile` を変更したら必ず再ビルドし、`dist/Profile/liste.json` を含む `dist/` も一緒にアップロードしてください。HACS は `dist/` だけを読みます。
- バージョン番号は `src/konstanten.js` と `package.json` にあります。
