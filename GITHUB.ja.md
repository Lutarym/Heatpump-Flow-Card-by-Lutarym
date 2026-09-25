# GitHub での公開

[English](GITHUB.md) · [Deutsch](GITHUB.de.md) · [Français](GITHUB.fr.md) · **日本語**

このガイドでは、ZIP ファイルから HACS でインストールできるリリース付きのリポジトリを公開するまでを説明します。

## 1. リポジトリを作成

https://github.com/new で次のように入力します：

| 項目 | 値 |
|---|---|
| Repository name | `Heatpump-Flow-Card-by-Lutarym` |
| Description | Animated plant diagram for Panasonic Aquarea heat pumps via HeishaMon |
| 公開範囲 | Public |
| Add a README file | チェックしない |
| Add .gitignore | チェックしない |
| Choose a license | チェックしない |

`hacs.json` の `filename` で使用するファイルを HACS に指定しているため、リポジトリ名はファイル名と異なっていても構いません。README、ライセンス、.gitignore はプロジェクトに含まれているため、3 つのチェックは不要です。

## 2. アップロード

展開したフォルダー（`README.md` がある場所）で：

```bash
git init
git branch -M main
git add .
git commit -m "v3.0.0"
git remote add origin https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym.git
git push -u origin main
```

Git が認証情報を求めた場合、パスワードは GitHub のパスワードではなく個人アクセストークンです。Settings、Developer settings、Personal access tokens で作成できます。トークンには `repo` の権限が必要です。

## 3. スクリーンショット

言語ごとにカードの画像を `docs/` に配置してください：`screenshot-en.png`、`screenshot-de.png`、`screenshot-fr.png`、`screenshot-ja.png`。各 README はそれぞれの言語の画像を表示します。撮影前に `language` オプションでカードの言語を切り替えてください。

## 4. Topics

リポジトリページの **About** の横にある歯車から **Topics** に入力：

```
home-assistant  lovelace  lovelace-card  hacs  heishamon  panasonic-aquarea  heatpump
```

`home-assistant` と `lovelace` の Topics は、将来 HACS の公式カタログに登録する際に必要です。

## 5. リリース

HACS はリリースでバージョンを認識します。タグだけでは不十分です。

```bash
git tag v3.0.0
git push origin v3.0.0
```

その後 GitHub の **Releases** で **Draft a new release** を選び、タグ `v3.0.0`、タイトル `v3.0.0`、説明には例えば次のように入力します：

```markdown
First public release. See CHANGELOG.md for all changes.
```

## 6. HACS に追加

1. HACS を開き、三点メニューからカスタムリポジトリを選択
2. リポジトリ：`https://github.com/Lutarym/Heatpump-Flow-Card-by-Lutarym`、カテゴリ：**Dashboard**
3. カードを検索してダウンロード

HACS がリソースを自動登録します。その後、ブラウザーをキャッシュなしで再読み込みしてください。

## その後の更新

```bash
git add .
git commit -m "vX.Y.Z"
git push
git tag vX.Y.Z
git push origin vX.Y.Z
```

そのタグに対して新しいリリースを作成してください。`dist/heatpump-flow-card-by-lutarym.js` 冒頭の `CARD_VERSION` とタグは一致させてください。

## HACS 公式カタログ

任意です。カスタムリポジトリを追加しなくても見つけられるようになります。HACS は自動チェックを行い、HACS の GitHub アクション、少なくとも 1 つの正式なリリース、README 内の画像などを確認します。画像は `docs/` のスクリーンショットで満たせます。条件と手順：https://www.hacs.xyz/docs/publish/include/

## プロジェクト構成

```
Heatpump-Flow-Card-by-Lutarym/
├── dist/
│   └── heatpump-flow-card-by-lutarym.js
├── docs/
│   └── screenshot-en.png, screenshot-de.png, screenshot-fr.png, screenshot-ja.png
├── hacs.json
├── README.md, README.de.md, README.fr.md, README.ja.md
├── GITHUB.md, GITHUB.de.md, GITHUB.fr.md, GITHUB.ja.md
├── CHANGELOG.md
├── LICENSE
├── .github/workflows/validate.yml
├── .gitattributes
└── .gitignore
```

ライセンスは GNU GPL v3.0 です。
