# Animation System

## Purpose

サイト全体の動きを統一する。

## Philosophy

アニメーションは注目を集めるためではなく、ユーザーの理解を助けるために使用する。
派手さより、自然で高品質な fade-up 系を既定とする。

---

## 初期化（必須）

| 環境 | 条件 | 起動 |
|------|------|------|
| 開発 | `script[src*="load-sections.js"]` あり | `page:ready` 後に init |
| 本番 | loader なし（dist） | `DOMContentLoaded` または即時 init |

- **`page:ready` のみだと dist でアニメが動かない**
- 二重実行防止: `animationsInitialized`
- `prefers-reduced-motion: reduce` のときは **全スキップ**（エラーにしない）
- Windows で「アニメーション効果をオフ」にしていると無言で止まる。QA 時は OS 設定を確認する

### GSAP プラグイン（読み込み最小化）

- **ScrollTrigger** — scroll reveal があるページのみ importmap + `animation.js` で読み込む
- ページで使わないプラグインは **HTML に含めない**（無駄な JS 削減）
- 本番 dist でも importmap が残る場合、全ページ共通 bundle かページ別 bundle を案件で選択

実装: `src/scripts/animation.js`

---

## ページ分岐（body 属性）

| 属性 | 用途 |
|------|------|
| `data-page="top"` 等 | ページ種別の明示（アニメ・固有 JS の分岐） |
| `data-motion="height-ui"` | アコーディオン等で高さが変わるページ |

例:

```html
<body data-page="top">
<body data-page="about">
<body data-page="faq" data-motion="height-ui">
```

- 通常ページ: Hero + main reveal + stagger-grid + label
- `height-ui`: **Hero のみ**（セクション全体の ScrollTrigger fade はオフ）

ページ名を JS にハードコードしない。高さ変化の有無は `data-motion="height-ui"` で明示する。

---

## 高さ変化 UI（アコーディオン等）と ScrollTrigger

### 症状

- ページ下部の CTA などが「消えた」ように見える
- 実体は HTML 欠落ではなく、`gsap.from` の **opacity:0 のまま**トリガーが発火しないこと

### 原因

- ScrollTrigger 計測後にアコーディオンが閉じてページ高さが大きく縮む
- `start` 位置がズレ、要素が画面内なのにトリガーが発火しない

### 回避（推奨順）

1. そのページではセクション全体の scroll reveal を使わない（Hero のみ）→ `data-motion="height-ui"`
2. 回答を CSS で最初から閉じ、高さ確定後に ST を初期化
3. 高さ変更のたびに `ScrollTrigger.refresh()`（`refreshScrollTriggers()` を export 済み）

### 禁止

- アコーディオン初期化後に、閉じる前の高さで測った ScrollTrigger を refresh せず放置する

---

## 標準モーション（MOTION 定数）

| キー | 初期値 | 用途 |
|------|--------|------|
| `duration` | 0.9 | 通常 fade-up |
| `durationSlow` | 1.2 | Hero |
| `y` | 24 | 上昇量 (px) |
| `stagger` | 0.12 | グリッド |
| `staggerHero` | 0.15 | Hero 子要素 |
| `ease` | `power2.out` | 共通 |
| `start` | `top 85%` | ScrollTrigger |
| `once` | `true` | ホテル系推奨 |

数値の編集手順は [animation-spec.md](./animation-spec.md) を参照。

### パターン

1. **Hero** — ロード時 fade-up + stagger
2. **main 直下ブロック** — scroll reveal（`height-ui` ではスキップ）
3. **stagger-grid** — 子要素 stagger
4. **label**（任意） — opacity + scale 0.98→1

グリッドがあるブロックは **見出しだけ reveal**、カードは stagger 関数側。親＋子の二重 opacity を避ける。

---

## フック（data-animate）

| 値 | 用途 |
|----|------|
| `hero` | Hero テキストコンテナ。子を stagger |
| `reveal` | セクション見出しなど明示 reveal |
| `stagger-grid` | カード列の親 |
| `card` | グリッド子（任意。無くても直下子を対象） |
| `label` | 弱い scale |

- Header / Footer は **対象外**（`main` 外）
- Tailwind / `.fade-up` 必須にしない
- 初期状態を CSS で `opacity: 0` 固定しない（JS 未実行時に消える事故を防ぐ）

---

## ScrollTrigger 推奨

| 項目 | 推奨 |
|------|------|
| `start` | `"top 85%"`（80–90% で調整） |
| `once` | `true`（再入場不要なホテル系） |
| markers | 本番禁止 |

---

## ページシェル要件

- **TOP / 下層どちらも** GSAP（importmap）+ `animation.js` を読み込む
- 下層: `../scripts/animation.js`（ビルドで `scripts/animation.js` に置換）
- `body` に `data-page="..."` を付ける
- `site.manifest.json` の `output.scripts` に `scripts/animation.js` を含める

---

## QA

- [ ] `src`（HTTP サーバー）で動く
- [ ] `dist`（loader なし）で動く — `page:ready` 非依存
- [ ] 下層ページにも GSAP + `animation.js` がある
- [ ] prefers-reduced-motion 時はスキップ
- [ ] Header / Footer が動かない
- [ ] 親 reveal + 子 stagger の二重で消えない
- [ ] 高さ変化 UI ページで CTA が opacity:0 残留していない

---

## Rule

1画面に過剰な Animation を入れない。

適用順: Hero → Section → CTA
