# Page Shell Convention

ページシェル（TOP / 下層）の横幅・構造規約。  
Builder で外部デザインツール由来 HTML を分解するとき、**シェル構造の不備が横幅崩れの主因**になりうる。

実装の正: `src/index.html` / `src/pages/*.html` / `src/templates/web-production/page.shell.html` / `src/styles/main.css`

Reviewer 必須チェック: [reviewer-checklist.md](./reviewer-checklist.md)

---

## 必須ルール（TOP / 下層共通）

| 項目 | 正 | 禁止 |
|------|----|------|
| ページラッパー | 可変幅 + 最大幅 + 中央寄せ | アートボード px 固定（`w-[1440px]`） |
| flex ラッパー | `items-stretch` 前提 | `items-start` + 固定幅 |
| `<main>` | `class="site-main"`（全幅） | 固定幅で main を囲む |
| `body` | `overflow-x: hidden` | クリップだけで不具合を隠す |

### Pencil export → テンプレ CSS 対応

| Tailwind export（禁止） | テンプレ正 |
|-------------------------|-----------|
| `w-[1440px] mx-auto items-start` | `.container` / `.page-shell`（`--layout-max-width: 1440px`） |
| `main` 固定幅 | `main.site-main`（`width: 100%`） |
| Hero `w-[1440px] absolute` | `.hero__overlay` — `absolute inset-0 w-full h-full` |
| CTA オーバーレイ固定幅 | `.full-bleed-banner__overlay` 同思想 |

### CSS（テンプレート標準）

- `body` … `overflow-x: hidden`
- `.site-main` … `width: 100%`
- `.container` … `min(var(--layout-max-width), calc(100% - 2rem))` + 中央寄せ
- `.page-shell` … flex column + `align-items: stretch` + max-width
- `h1` … `margin: 0`（preflight off 案件でも見た目維持）

---

## SEO / セマンティクス（シェル必須）

- 各ページ **1 つの `<h1>`**（下層 Hero: `data-page-hero="true"`）
- 固有 `<title>` + `<meta name="description">`
- セクション見出しは `<h2>` を推奨（Reviewer Improvement）

---

## 下層シェル雛形

ファイル: `src/templates/web-production/page.shell.html`

### 必須

| 項目 | 内容 |
|------|------|
| `__SRC_BASE__` | `"../"` |
| `__ASSET_BASE__` | `"../../assets/"` |
| `data-page` | ページ ID |
| `main.site-main` | 全幅 |
| GSAP + animation.js | TOP と同様 |

---

## セクション流体化（分割と同時）

| パターン | 置換 |
|----------|------|
| `w-[Npx]` | `w-full max-w-[Npx] lg:w-[Npx]` |
| `left-[80px]` | `left-4 md:left-[80px]` |
| 横並び | `flex-col lg:flex-row` |
| 余白 | `px-5 py-12 md:p-[…]` |
| absolute タイムライン | モバイル縦積み → `lg:` で再現 |

**後回しにしない。**

---

## Builder vs Reviewer

| | Builder | Reviewer |
|---|---------|----------|
| 375 / 768 | — | **必須** |
| 1366 / 1920 | **必須** | **必須** |
| dist 確認 | ビルド成功 | **目視必須** |
| overflow hidden | 設定する | **クリップ残存を疑う** |

---

## 関連

- [builder-workflow.md](./builder-workflow.md)
- [reviewer-checklist.md](./reviewer-checklist.md)
- [case-adoption.md](./case-adoption.md)
