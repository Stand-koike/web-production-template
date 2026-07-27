# Deployment

## 概要

**公開するのは `npm run build` で生成した `dist/` の内容のみ。**

- リポジトリルート（`main` ブランチ直下）には本番用 `index.html` が**ない**
- GitHub Pages を **`main` / (root)** にすると **404** になる
- `dist/` は `.gitignore` 対象（成果物は CI / 手動デプロイで出す）

開発時の `load-data.js` / `load-sections.js` は dist に含まれない。

---

## ビルド

```bash
npm install
npm run build
```

生成物:

```
dist/
├── .nojekyll           # Jekyll 無効化（GitHub Pages）
├── index.html
├── {page}.html
├── assets/             # 毎回 wipe してからコピー（削除済みファイルが残らない）
├── styles/
└── scripts/
    └── animation.js
```

ローカルで公開相当を確認:

```bash
npm run build
npm run preview
# → http://localhost:4173
```

---

## GitHub Pages（推奨）

### 方式 A — `gh-pages` ブランチ root（推奨）

1. Settings → Pages → Source: **Deploy from a branch**
2. Branch: **`gh-pages`** / **`/(root)`**
3. `.github/workflows/deploy-pages.yml` が `main` push 時に `dist/` を `gh-pages` へ push

**禁止:** Source を **`main` / (root)** にしない（ルートに `index.html` が無い → 404）

### 方式 B — GitHub Actions artifact

1. Settings → Pages → Source: **GitHub Actions**
2. 同一 workflow が `actions/deploy-pages` で artifact を公開

---

## その他ホスティング

| 方式 | 手順 |
|------|------|
| 静的ホスティング | `dist/` 全体をアップロード |
| 既存サーバー | `dist/` の中身をドキュメントルートへ |

---

## Deploy 工程のチェックリスト

- [ ] `npm run build` 成功
- [ ] `npm run preview` で TOP / 下層が表示される
- [ ] 公開対象が **`dist/` の中身**（リポジトリ root ではない）
- [ ] Pages 設定が `gh-pages` または GitHub Actions（**main root 禁止**）
- [ ] 本番 URL で 404 がない（CSS / JS / 画像）
- [ ] Reviewer 済み（375/768/1366/1920 — [reviewer-checklist.md](./reviewer-checklist.md)）

---

## 工程上の位置づけ

```
Builder → Animation → Reviewer → Performance → Deploy
                                              ↑
                                    dist/ のみを公開
```

| 工程 | Deploy 関連 |
|------|-------------|
| Builder | ビルドが通る構造 |
| Reviewer | dist で端末幅・リンク確認 |
| Performance | 画像最適化（[performance.md](./performance.md)） |
| **Deploy** | **`dist/` をホストへ。Pages 404 防止** |

---

## 下層ページ追加時

1. `src/pages/{name}.html`（`page.shell.html` から）
2. `src/sections/{name}-*.html`
3. `npm run build` → `dist/{name}.html`

---

## 案件リポジトリ

テンプレでビルド方式と Deploy 規約を固め、コピー・画像・Pages 設定の実値は案件側で行う。

関連: [case-adoption.md](./case-adoption.md) / [build-system.md](./build-system.md)
