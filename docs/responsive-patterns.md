# Responsive Patterns

1440px デザインを崩さず、**768–1439px** と **短い画面高** で収めるための規約。  
宿泊施設案件（ならいの風, 2026）で得られた知見をテンプレートへフィードバックしたもの。

実装の正:

| ファイル | 役割 |
|---------|------|
| `src/styles/tokens.css` | レイアウト token（`--hero-height-fluid` 等） |
| `src/styles/main.css` | 標準 `.hero`（sticky header 案件） |
| `src/styles/responsive-fluid.css` | **768–1439px** 流体化（全案件で link 推奨） |
| `src/styles/header-overlay.css` | **任意** — fixed overlay header + `.page-hero` 案件 |

関連: [page-shell.md](./page-shell.md) / [builder-workflow.md](./builder-workflow.md) / [reviewer-checklist.md](./reviewer-checklist.md)

---

## ブレークポイント帯

| 帯 | 幅 | 担当 CSS |
|----|-----|----------|
| Mobile | &lt; 768px | `main.css` |
| Tablet | 768–1023px | `responsive-fluid.css` 前半 |
| Compact desktop | 1024–1439px | `responsive-fluid.css` 後半 |
| Max design | ≥ 1440px | セクション markup / Pencil 値そのまま |

**Reviewer 追加確認:** 1024px・1280px・**短い画面高**（768×600 等・横向きタブレット）

---

## なぜ崩れるか

1. Pencil export は **1440px アートボード** 前提の固定幅（720+520、padding 80px）
2. 1024–1300px では横並びの合計が viewport を超える
3. Hero を `min(820px, 70vh)` だけ縮め、テキストを `top: 280px` 固定にすると **縦方向にクリップ** される
4. `overflow-x: hidden` で見えなくなるだけ、のまま Builder 完了としない

---

## Hero 高さ（必須パターン）

### 標準テンプレ（`.hero` + sticky header）

`tokens.css`:

```css
--hero-height-min: 560px;
--hero-height-max: 820px;
--hero-height-fluid: clamp(var(--hero-height-min), 85svh, var(--hero-height-max));
```

`main.css`（768px+）:

```css
.hero {
  height: var(--hero-height-fluid);
}
```

**禁止:** `height: min(820px, 70vh)` のみ — 短い viewport で中身が切れる。

### Overlay header 案件（`.page-hero`）

`header-overlay.css` を link し、コンテンツ位置:

```css
top: min(280px, calc(100% - var(--hero-content-reserve)));
```

| ページ種別 | `--hero-content-reserve` |
|-----------|-------------------------|
| TOP（サブ+キャッチ+CTA） | 380px |
| 下層 Hero | 240px |

下層は fixed header 分を加算: `height: calc(var(--hero-height-fluid) + var(--header-overlay-height))`

---

## Compact desktop（1024–1439px）

`responsive-fluid.css` で共通処理:

- `.site-main { overflow-x: clip }`
- padding / gap を `clamp(24px, 5vw, 80px)`（token: `--section-padding-inline`）
- Tailwind export の `lg:w-[560px]` 等 → `max-width: min(560px, 44vw)`

### 案件固有の追記

Pencil `data-pencil-name` 向けルールは **案件リポジトリ** の `responsive-fluid.css` 末尾に追記する。  
テンプレート本体に案件固有セレクタを戻さない（[case-adoption.md](./case-adoption.md)）。

例（ならいの風）:

- `[data-pencil-name="Intro"]` / `Cuisine Split` の gap・flex
- `[data-pencil-name="Hero Catch"]` の `clamp(40px, 4.4vw, 56px)`

---

## ページシェル — stylesheet 順

```html
<link rel="stylesheet" href="styles/tokens.css" />
<link rel="stylesheet" href="styles/theme.css" />
<link rel="stylesheet" href="styles/main.css" />
<link rel="stylesheet" href="styles/responsive-fluid.css" />
<!-- Overlay header 案件のみ -->
<!-- <link rel="stylesheet" href="styles/header-overlay.css" /> -->
```

`site.manifest.json` の `output.styles` に `responsive-fluid.css` を登録する。

---

## 本番ビルド（linkedom）

### `window.__SITE_BUILD__`

ビルド時に `true`。以下をスキップする:

| API | 理由 |
|-----|------|
| `video.load()` / `video.play()` | linkedom に未実装 |
| `window.matchMedia` 依存の再生制御 | 同上 |
| `initPage()` 自動実行 / `page:ready` | ビルド側が await |

`load-data.js` の Hero 動画:

```javascript
if (window.__SITE_BUILD__) {
  return; // src / poster 設定のみ
}
```

Footer / Header の `homeHref` も `__SITE_BUILD__ && __SRC_BASE__` で `index.html` を解決する。

---

## Builder チェックリスト（追加）

- [ ] 全ページシェルに `responsive-fluid.css` を link
- [ ] Hero 768px+ で `--hero-height-fluid` を使用（vh のみ縮小禁止）
- [ ] Overlay hero では `top` と `--hero-content-reserve` を連動
- [ ] 1024–1439px で横スクロールなし（DevTools 目視）
- [ ] 768×600 等の短い高さで Hero テキストが切れない

---

## Reviewer チェックリスト（追加）

- [ ] **1024px / 1280px** — split セクション・Header がはみ出さない
- [ ] **768×600（横向き）** — Hero 下端がクリップされない
- [ ] `overflow-x: hidden` で隠れているだけ、がない

---

## テンプレート vs 案件

| テンプレートに入れる | 案件のみ |
|---------------------|---------|
| tokens / main / responsive-fluid 骨組み | Pencil 固有 `data-pencil-name` ルール |
| header-overlay.css（任意） | mobile-chrome.css（案件 UI） |
| 本ドキュメント | Tailwind CDN + 案件 CSS |

---

## 参考事例

**蒼海の宿 ならいの風**（2026）— TOP + 下層 7 ページ、Pencil export + overlay header。  
案件側 `responsive-fluid.css` にセクション別 clamp を実装済み。本テンプレートへはパターンのみ反映。
