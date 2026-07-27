# Reviewer Checklist

品質確認の完了条件。  
**レスポンシブの端末幅目視は Reviewer 必須。** Builder 完了 ≠ 本番公開可。

関連: [builder-workflow.md](./builder-workflow.md) / [page-shell.md](./page-shell.md) / [animation-system.md](./animation-system.md)

---

## Builder vs Reviewer（責務分担）

| 工程 | 担当 | 完了の意味 |
|------|------|------------|
| **Builder** | 構造・リンク・画像パス・デスクトップ横幅整合 | HTML がある ≠ 公開可 |
| **Reviewer** | 端末幅目視・SEO/a11y・dist 成果物・アニメ本番起動 | Critical ゼロ（または修正＋再確認） |
| **Performance** | 画像/CSS/JS 最適化 | Reviewer 後 |
| **Deploy** | **`dist/` のみ公開**・Pages 設定 | Critical ゼロ後 |

### Deploy がやること

- `npm run build` → **`dist/` の中身**をホストへ
- GitHub Pages: **`gh-pages` / (root)** または GitHub Actions（**`main` / (root) 禁止 → 404**）
- 公開 URL でリンク・404 最終確認

詳細: [deployment.md](./deployment.md)

### Builder がやること

- ページシェル規約（`page-shell.md`）
- 固定 artboard 幅の予防・セクション流体化（分割と同時）
- 1366px / 1920px で Header・main・Footer の横幅一致
- 内部リンク・画像 404 なし
- 各ページに `<h1>` / 固有 `title` / `meta description` の骨組み

### Builder がやらないこと

- 375px / 768px の目視 QA
- SEO/a11y の網羅監査
- dist での最終確認（Reviewer が実施）

---

## Reviewer 必須 — レスポンシブ

**375 / 768 / 1366 / 1920** の各幅で **src と dist** を目視する。

- [ ] 横スクロールが発生しない
- [ ] Header・main・Footer の横幅が一致する
- [ ] **`overflow-x: hidden` だけでは不十分** — クリップで隠れた固定幅要素がないか確認
- [ ] 固定幅 + absolute のはみ出し・クリップがない
- [ ] 主要 CTA・ナビがタップ可能（モバイル）
- [ ] テキストが viewport 外に切れていない

### overflow について

`body { overflow-x: hidden }` は**最後の安全網**。  
クリップで見えなくなっただけのレイアウト不具合を見逃さないこと。

---

## Reviewer 必須 — SEO / セマンティクス

- [ ] 各ページに **1 つの `<h1>`**（Pencil 見出し相当の `div` を残していない）
- [ ] セクション見出しは可能な範囲で `<h2>`（Improvement として記録可）
- [ ] 各ページに固有 `<title>`
- [ ] 各ページに `meta name="description"`
- [ ] 画像に意味のある `alt`（装飾のみは空 alt 可）

Tailwind `preflight: false` 利用案件では `<h1>` に `margin: 0` 等で見た目を維持。

---

## Reviewer 必須 — 本番成果物（dist）

- [ ] `npm run build` 成功
- [ ] `dist/*.html` に `load-data.js` / `load-sections.js` が**ない**
- [ ] `dist` に **`{{…}}` プレースホルダ残存がない**
- [ ] GSAP + `scripts/animation.js` が全ページにある
- [ ] **dist でも 375 / 768 / 1366 / 1920 を確認**（src だけ見ない）
- [ ] アニメ: loader なしで `DOMContentLoaded` 起動（`page:ready` のみ待ち禁止）
- [ ] `prefers-reduced-motion: reduce` で抑制される

---

## Reviewer 必須 — リンク / UX

- [ ] TOP / 下層のナビ・ロゴ・CTA リンクが機能
- [ ] 画像・CSS・JS が 404 にならない
- [ ] キーボード操作で主要リンクに到達できる
- [ ] `:focus-visible` が主要操作で視認できる

---

## 報告形式

### Critical

必ず修正してから公開

### Improvement

品質向上（`<h2>` 階層、focus 強化など）

### Good

維持すべき良い点

---

## 任意 — viewport クリップ監査（Playwright 等）

必須 CI にはしない。375px 等で `getBoundingClientRect` が viewport 外にはみ出す要素を列挙する。

手順サンプル: [scripts/check-viewport-overflow.sample.mjs](../scripts/check-viewport-overflow.sample.mjs)

---

## Feedback — review, responsive, assets, deploy (generalized)

### Must

1. **Reviewer owns device checks** (375 / 768 / 1366 / 1920). Builder owns structure, links, desktop width only. `overflow-x: hidden` ≠ fixed-width clip fix.
2. **Page shell defaults:** fluid width + max-width + center; `main` full width; `body { overflow-x: hidden }`. Ban Pencil fixed artboard wrappers and full-bleed fixed-width absolute overlays.
3. **Fluidize sections at split time:** responsive max-width patterns; mobile-first offsets; column-then-row layouts.
4. **SEO gate:** one `<h1>` per page; unique `title` + `meta description`.
5. **Component vars:** every `{{VAR}}` supplied or defaulted; fail if placeholders remain in `dist/`.
6. **Publish `dist/` only.** Keep `dist/` gitignored. Do **not** point GitHub Pages at `main`/(root) (no root `index.html` → **404**). Deploy built `dist/` to **`gh-pages`/(root)** or GitHub Actions. Emit `.nojekyll`. Wipe `dist/assets` before copy.

### Should

- Document Builder / Reviewer / Deploy ownership in workflow docs.
- Animation: `page:ready` in dev; `DOMContentLoaded` in production; `prefers-reduced-motion`; omit unused GSAP plugins per page.
- Image delivery: resize ≈2× display width; `loading="lazy"` + `decoding="async"` below the fold; dedupe asset URLs.
- Treat missing `<h2>` hierarchy and weak `:focus-visible` as Reviewer Improvements.

### Nice

- Optional viewport-clip audit script (not required CI).
- `npm run preview` for local `dist/` check.

### Do not template

- Client copy, brand, contact, page-specific meta text.
- Asset binaries, galleries, page IA.
- Case-specific interaction packs unless optional kits.
