# Case Adoption Guide

案件リポジトリへ本テンプレートを横展開する手順。

## 原則

| リポジトリ | 担当 |
|-----------|------|
| `web-production-template` | 制作システム（シェル / runtime / build / docs） |
| 案件リポジトリ | 施設固有コピー・画像・デザイン調整・公開 |

案件側でテンプレートのコア（`load-*.js` / `build-production.mjs`）を改変しない。
不足機能はテンプレートへフィードバックしてから案件へ取り込む。

## 初期セットアップ

1. 案件リポジトリを作成（または既存を用意）
2. 本テンプレートの以下をコピー／サブツリー導入する

```
src/
scripts/build-production.mjs
package.json（scripts / linkedom / gsap）
docs/builder-workflow.md
docs/page-shell.md
```

3. `npm install`
4. `facility.json` / `content.json` を案件値に差し替え
5. `assets/images/` に案件画像を配置
6. `src/pages/` に下層を追加（必要数）— 雛形は `src/templates/web-production/page.shell.html`
7. `npm run build` で `dist/` を確認

## 差し替えチェックリスト

- [ ] `facility.brand.name` / logo / phone / address / booking
- [ ] `facility.theme`（ブランドカラー）
- [ ] `content.navigation.items`（href はファイル名のみ）
- [ ] TOP 各セクションのコピー・画像
- [ ] 下層ページ（必要トピック分）
- [ ] 各ページシェルが [page-shell.md](./page-shell.md) 準拠（`main.site-main` / `data-page` / 固定幅ラッパーなし）

## 下層ページ追加テンプレ

1. `src/templates/web-production/page.shell.html` を `src/pages/{name}.html` にコピー
2. `data-page="{name}"` と title を差し替え
3. `main.site-main` 内に `data-include="../sections/{name}-{role}.html"` を追加
4. グローバルは雛形どおり（変更しない）:

```html
<script>
  window.__SRC_BASE__ = "../";
  window.__ASSET_BASE__ = "../../assets/";
</script>
```

セクション命名: `{name}-{role}.html`

**横幅:** アートボード固定幅のラッパーを付けない。詳細は [page-shell.md](./page-shell.md)。

## 検証

```bash
py -m http.server 8080
# 開発: /src/index.html , /src/pages/{name}.html
npm run build
# 本番: /dist/index.html , /dist/{name}.html
```

横幅: Header / main / Footer が一致し、横スクロールがないこと。

## やってはいけないこと

- 案件固有 class / CSS hack をテンプレートへ戻す
- Pencil 生 HTML をページシェル化せず残す
- export の固定 artboard 幅ラッパーをシェルの正として残す
- `content.json` の href に `pages/` プレフィックスを付ける
