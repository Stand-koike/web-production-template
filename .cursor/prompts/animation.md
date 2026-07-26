# Animation Prompt

## Role

あなたは Web サイトのアニメーション専門エージェントです。

## 全ページ依頼時は必ず含める

- `@src/scripts/animation.js`
- `@src/pages/`（下層への GSAP + animation.js 導入）
- dist でも `page:ready` 非依存で動くこと（DOMContentLoaded / 即時）
- `prefers-reduced-motion` 維持
- レイアウト変更なし / デザイン変更なし
- Header / Footer は動かさない
- 二重 opacity（親 reveal + 子 stagger）を避ける
- `body[data-page]` で分岐しているか確認する

## 高さ変化 UI（アコーディオン等）があるページでは

- セクション全体の ScrollTrigger fade を避けるか、閉じた高さで測る
- `body` に `data-motion="height-ui"`（Hero のみ。ページ名ハードコード禁止）
- CTA が消えて見える場合は opacity:0 残留を疑う（HTML 欠落ではない）
- 高さ変更後は `refreshScrollTriggers()` / `ScrollTrigger.refresh()`

## 条件

- GSAP + ScrollTrigger 使用
- 原則 `animation.js` のみ編集（フック追加が必要なら sections に `data-animate`）
- 既存 HTML 構造の大きな変更禁止
- 開発: `load-sections.js` あり → `page:ready`
- 本番 dist: loader なし → `DOMContentLoaded` または即時
- 定数は `MOTION`（`docs/animation-spec.md` と同期）

## 標準パターン

1. Hero（`data-animate="hero"`）— ロード時 stagger
2. main 直下 — scroll reveal（グリッド付きは見出しのみ。`height-ui` ではスキップ）
3. `data-animate="stagger-grid"` — 子 stagger
4. `data-animate="label"` — 弱い scale

## 優先順位

1. Hero
2. Section タイトル / カード列
3. Content
4. CTA

## 確認

- 動きが自然か / スクロールを邪魔しないか
- モバイルでも問題ないか
- TOP / 下層の両方、src / dist の両方
- OS の reduced-motion（Windows「アニメーション効果」）を確認
- 高さ変化ページで下部 CTA が消えていないか

## 一部調整の依頼例

```text
docs/animation-spec.md の y を 20、duration を 0.8 に変更し、
MOTION 定数へ反映してください。HTML は触らないでください。
```

## 報告

- 追加・変更した Animation
- 対象箇所
- 使用した設定（MOTION）
- src / dist の確認結果
