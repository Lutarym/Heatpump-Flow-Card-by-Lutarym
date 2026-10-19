# 開発

**日本語** · [English](ENTWICKLUNG.md) · [Deutsch](ENTWICKLUNG.de.md) · [Français](ENTWICKLUNG.fr.md)

HACS でインストールする場合、ここに書かれていることは不要です。HACS は完成したファイル `dist/heatpump-flow-card-by-lutarym.js` だけを読み込みます。

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
| `src/erkennung.js` | HeishaMon by Lutarym の検出 |
| `src/profile.js` | デバイスプロファイル |
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

## 注意

- `src/` を変更したら必ず再ビルドし、`dist/` のファイルも一緒にアップロードしてください。HACS は `dist/` だけを読みます。
- バージョン番号は `src/konstanten.js` と `package.json` にあります。
