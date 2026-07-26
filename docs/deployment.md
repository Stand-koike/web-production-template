# Deployment

## 概要

本番公開は `npm run build` で生成した `dist/` をホスティングする。

開発時の `load-data.js` / `load-sections.js` は dist に含まれない。

## 手順

```bash
npm install
npm run build
```

生成物:

```
dist/
├── index.html          # TOP
├── about.html          # 下層（src/pages/*.html と同名でフラット）
├── assets/
├── styles/
└── scripts/
    └── animation.js
```

## 公開

`dist/` の内容を Web サーバーのドキュメントルートへ配置する。

例:

- GitHub Pages: `dist` を publish ディレクトリに指定
- 静的ホスティング: `dist/` をアップロード
- 既存サーバー: `index.html` と下層 HTML を同一ディレクトリに配置

## 確認

```bash
py -m http.server 8080
```

| ページ | URL |
|--------|-----|
| TOP | http://localhost:8080/dist/index.html |
| About | http://localhost:8080/dist/about.html |

チェック:

- [ ] TOP / 下層のナビ・ロゴリンクが機能する
- [ ] 画像が `assets/images/` で表示される
- [ ] CSS / JS が 404 にならない（下層でも `styles/` `scripts/` 相対）
- [ ] `load-data.js` / `load-sections.js` が含まれていない

## 下層ページ追加時

1. `src/pages/{name}.html` を追加（`__SRC_BASE__` / `__ASSET_BASE__` 必須）
2. `src/sections/{name}-*.html` を追加
3. 必要なら `content.json` / `facility.json` を拡張
4. `npm run build` → `dist/{name}.html` が出力される

## 案件リポジトリとの関係

テンプレートでビルド方式を固め、宿固有のコピー・画像・公開設定は
案件リポジトリ（例: sotoura）側で行う。
