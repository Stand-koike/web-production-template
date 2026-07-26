# Build System

## 概要

`npm run build` で **multi-page 静的 HTML** を生成する。

開発時は `load-data.js` / `load-sections.js` による fetch 注入。  
本番は linkedom 上で `initPage()` を実行し、展開済み HTML を `dist/` へ出力する。

## 設定

`src/templates/web-production/site.manifest.json`

```json
{
  "source": { "index": "index.html" },
  "data": {
    "facility": "data/facility.json",
    "content": "data/content.json"
  },
  "output": {
    "dir": "dist",
    "assetPathFrom": "../assets/",
    "assetPathFromPages": "../../assets/",
    "assetPathTo": "assets/"
  }
}
```

## 入力 → 出力

| 入力 | 出力 |
|------|------|
| `src/index.html` | `dist/index.html` |
| `src/pages/*.html` | `dist/{同名}.html`（フラット） |

例: `src/pages/about.html` → `dist/about.html`

## ビルド処理

1. 各ページ HTML を linkedom で parse
2. `window.__SITE_BUILD__ = true` を設定（下層は `__SRC_BASE__` / `__ASSET_BASE__` も注入）
3. `load-data.js` / `load-sections.js` を実行
4. `initPage()` で section / data / pattern / component を展開
5. ランタイム script を除去
6. アセットパスを `assets/` に統一（`../../assets/` を先に置換）
7. `assets/` / `styles/` / `scripts/` をコピー
8. `facility.json` の `theme` から `dist/styles/theme.css` を生成

失敗時は `Failed to build {page}.html: ...` 形式でページ名付きエラーを出す。

## リンク解決

`content.json` の href は `about.html` 形式。  
`resolvePageHref()` がコンテキストに応じて変換する。

| コンテキスト | 結果 |
|-------------|------|
| TOP 開発 | `pages/about.html` |
| 下層開発 | `about.html` |
| 本番 | `about.html` |

## 実行

```bash
npm install
npm run build
```

## 検証

- [ ] `dist/index.html` + `dist/about.html` が生成される
- [ ] News / FAQ / Gallery が空でない
- [ ] `../assets/` が残っていない
- [ ] `load-data.js` / `load-sections.js` が含まれていない
- [ ] 各 HTML に `scripts/animation.js` が残っている

## ページ固有スクリプトの配線

追加時は次の **3点セット**（パス置換はビルドが下層の `../scripts/` を一括処理）:

1. `src/scripts/{name}.js`（dev/prod 二重起動。雛形: `page-script.example.js`）
2. 対象 `src/**/*.html` に `<script src="...">`
3. `site.manifest.json` → `output.scripts` に `"scripts/{name}.js"`（dist へコピー）

HTML だけ / manifest だけだと dist で欠落する。

## 関連

- [builder-workflow.md](./builder-workflow.md)
- [architecture.md](./architecture.md)
- [animation-system.md](./animation-system.md)
- [content-map-spec.md](./content-map-spec.md)
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
