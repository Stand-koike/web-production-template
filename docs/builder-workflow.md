# Builder Workflow

> **目的:** Pencil.dev からエクスポートした HTML を、再利用可能な Web サイト構造へ変換する工程を標準化する。  
> 本文書は宿泊施設サイト案件（2026）で得られた知見をテンプレートへフィードバックしたものです。

---

## Builder 工程の位置づけ

```
Pencil.dev
    ↓ HTML Export（生 HTML・ページ単位）
Builder Agent  ← 本ドキュメント
    ↓ 構造化 HTML + JSON データ + ビルド基盤
Animation Agent
    ↓ GSAP アニメーション
Reviewer
    ↓ 375/768/1024/1280/1366/1920 目視・dist 確認
Performance
    ↓ 画像/CSS/JS
Deploy
    ↓ dist/ のみ公開（main root 禁止 → Pages 404 防止）
```

**Builder の責務**

- Pencil 生 HTML を **ページシェル + セクション + パターン + コンポーネント** に分解する
- 施設情報・可変コンテンツを **JSON データ** へ切り出す
- 開発時ランタイム（`load-data.js` / `load-sections.js`）と本番ビルド（`build-production.mjs`）を接続する
- 複数ページ間の **リンク・画像パス** を一貫した規約で整える
- **デスクトップ横幅整合**（1366 / 1920）とシェル規約（[page-shell.md](./page-shell.md)）
- セクション分割と**同時に**固定幅 export の流体化
- 各ページに `<h1>` / 固有 `title` / `meta description` の骨組み

**Builder の責務外**

- **375 / 768 の端末幅目視**（Reviewer 必須 — [reviewer-checklist.md](./reviewer-checklist.md)）
- アニメーション実装（Animation Agent）
- デザイン変更・レイアウトの再設計
- dist での最終 QA
- サーバー・DNS・本番ホスティング設定

> **HTML がある ≠ Builder 完了。** レスポンシブ目視 ≠ Builder 責務。

---

## 入力と出力

### 入力（Builder 開始時）

| 種別 | 例 | 状態 |
|------|-----|------|
| Pencil 生 HTML | `pencil/export/*.html` | Header/Footer 直書き・700行超・画像パス混在 |
| 画像素材 | クライアント提供フォルダ | ファイル名・配置がバラバラ |
| 施設情報 | テキスト・電話番号・住所 | 散在 |

### 出力（Builder 完了時）

| 種別 | パス | 説明 |
|------|------|------|
| TOP ページシェル | `src/index.html` | `data-include` のみ |
| 下層ページシェル | `src/pages/*.html` | 同上 + パス用グローバル変数 |
| セクション | `src/sections/*.html` | ページ断片（静的マークアップ） |
| パターン | `src/patterns/*.html` または `data-pattern` | header / footer 等 |
| コンポーネント | `src/components/*.html` | button / nav-link 等 |
| 施設データ | `src/data/facility.json` | ブランド・連絡先・Theme |
| コンテンツ | `src/data/content.json` | ナビ・セクション別テキスト |
| ランタイム | `src/scripts/load-*.js` | fetch 注入・展開 |
| ビルド | `scripts/build-production.mjs` | 静的 HTML 生成 |
| 本番出力 | `dist/*.html` | fetch 不要の完成 HTML |

---

## 工程ステップ

### Phase 1 — 現状分析

各 Pencil エクスポート HTML について以下を確認する。

- [ ] ページ種別（TOP / 下層）と `data-pencil-name`
- [ ] Header / Footer の有無（共通化候補）
- [ ] セクション境界（Hero / Intro / CTA 等）
- [ ] 画像参照パスと実ファイルの対応
- [ ] TOP ティーザーと下層フルページの **同名セクションの区別**

---

### Phase 2 — ページシェル化（横幅規約を先に固定）

Pencil 生 HTML を **50行程度のシェル** に置き換える。  
**セクション分割の前に** シェルをテンプレート規約へ合わせる。export のラッパークラスをそのまま正としない。

詳細: [page-shell.md](./page-shell.md)  
下層雛形: `src/templates/web-production/page.shell.html`

#### シェル横幅の正（TOP / 下層共通）

| 項目 | 正 |
|------|----|
| ページラッパー | 可変幅 + 最大幅 + 中央寄せ（`.container`）。アートボード px 固定幅にしない |
| flex 子 | stretch 前提（内容幅に縮まない） |
| `<main>` | `class="site-main"`（明示的に全幅） |
| `body` | 横 overflow 抑制は CSS 標準（`overflow-x: clip`） |

#### TOP（`src/index.html`）

```html
<body data-page="top">
  <div data-include="sections/header.html"></div>
  <main class="site-main">
    <div data-include="sections/hero.html"></div>
    <!-- ... -->
  </main>
  <div data-include="sections/footer.html"></div>
  <script src="scripts/load-data.js"></script>
  <script src="scripts/load-sections.js"></script>
  <script type="module" src="scripts/animation.js"></script>
</body>
```

#### 下層（`src/pages/{page}.html`）

```html
<body data-page="{page}">
  <div data-include="../sections/header.html"></div>
  <main class="site-main">
    <div data-include="../sections/{page}-hero.html"></div>
  </main>
  <div data-include="../sections/footer.html"></div>
  <script>
    window.__SRC_BASE__ = "../";
    window.__ASSET_BASE__ = "../../assets/";
  </script>
  <script src="../scripts/load-data.js"></script>
  <script src="../scripts/load-sections.js"></script>
  <script type="module" src="../scripts/animation.js"></script>
</body>
```

**命名規則**

| 対象 | 規則 | 例 |
|------|------|-----|
| ページファイル | `{topic}.html` | （下層トピック名） |
| セクション | `{page}-{role}.html` | `{page}-hero.html` |
| 共通 | プレフィックスなし | `header.html`, `footer.html` |

---

### Phase 3 — セクション分割

Pencil HTML から `<main>` 内のブロックを切り出し `src/sections/` へ配置する。

**原則**

- デザイン・色・余白の意図は維持しつつ、**固定 artboard 幅 + absolute** は親基準の full-bleed / `w-full` へ寄せる（[page-shell.md](./page-shell.md)）
- 画像パスを規約に統一（後述）
- 可変テキストは `data-content-bind` / `data-facility-bind` 等のフックを残す
- 繰り返し UI は `data-component` / `data-pattern` へ昇格させる

**固定幅 export 対策（分割と同時に実施 — 後回し禁止）**

| Pencil / Tailwind export | テンプレ正（流体化） |
|--------------------------|---------------------|
| `w-[1440px] items-start` | `w-full max-w-[1440px] mx-auto items-stretch` → CSS: `.container` / `.page-shell` |
| `w-[Npx]` 固定 | `w-full max-w-[Npx] lg:w-[Npx]` |
| `left-[80px]` 固定 | `left-4 md:left-[80px]` |
| 横並び固定 | `flex-col lg:flex-row` |
| `p-[48px]` 固定 | `px-5 py-12 md:p-[48px]` |
| absolute タイムライン | モバイルはフロー縦積み、`lg:` でデスクトップ再現 |
| Hero/CTA `w-[1440px] absolute` | 親 `relative` + 子 `absolute inset-0 w-full h-full`（`.hero__overlay` 等） |

| 用途 | 推奨 |
|------|------|
| Hero / CTA オーバーレイ | 親 relative + 子 full-bleed（固定 artboard 幅を使わない） |
| 複合レイアウト | 容器 max-width + 子 width 100% |
| 全幅帯 | `full-bleed-banner` と同思想 |

**SEO / セマンティクス（Builder 完了条件）**

- ページ主見出しは `<h1>`（下層 Hero: `data-page-hero="true"`）
- Pencil 見出し相当の `div` を h1 として残さない
- 各ページシェルに固有 `<title>` + `meta name="description"`
- コンポーネント `{{VAR}}` は展開時に必ず埋める（dist に残さない）

---

### Phase 4 — データ切り出し

**`facility.json`** — サイト全体で共通・変更頻度が低い情報

- ブランド名・ロゴ
- 電話・住所・予約リンク
- Theme（CSS variables）

**`content.json`** — セクション別コンテンツ・ナビゲーション

- 各セクションの見出し・本文・画像参照
- `navigation.items` — href は **ファイル名のみ**（`pages/` プレフィックスなし）

```json
{ "label": "About", "href": "about.html" }
```

**注入フロー（`initPage`）**

```
loadSections()
  → loadFacilityData() + applyFacilityData()
  → loadContentData() + applyContentData()
  → loadPatterns()
  → loadComponents()
```

---

### Phase 5 — リンク・パス接続

#### リンク解決（`resolvePageHref`）

| コンテキスト | `about.html` の解決結果 |
|--------------|-------------------------|
| TOP 開発（`src/index.html`） | `pages/about.html` |
| 下層開発（`src/pages/*.html`） | `about.html` |
| 本番ビルド（`__SITE_BUILD__`） | `about.html` |

`content.json` の href は常に `about.html` 形式で記述し、解決はランタイムに任せる。

#### 画像パス規約

| 参照元 | 開発時パス | 本番（`dist/`） |
|--------|-----------|----------------|
| TOP セクション / JSON | `../assets/images/...` | `assets/images/...` |
| 下層セクション | `../../assets/images/...` | `assets/images/...` |

**注意:** 本番ビルドでは `../../assets/` を **`../assets/` より先に** 置換する。

#### ホームリンク（`applyHeaderData`）

| コンテキスト | ロゴ href |
|--------------|-----------|
| TOP 開発 | `/` または `index.html` |
| 下層開発 | `../index.html` |
| 本番下層 | `index.html` |

---

### Phase 6 — 画像アセット整理

1. 参照一覧を洗い出す（セクション HTML + JSON）
2. 不足ファイルを `assets/images/` へ配置
3. Pencil 固有パス（エクスポート時の一時パス）を規約パスへ修正
4. 必要に応じて同期スクリプトを案件リポジトリ側で作成

---

### Phase 7 — 本番ビルド接続

```bash
npm install
npm run build
```

**ビルド処理（`build-production.mjs`）**

1. `src/index.html` + `src/pages/*.html` を列挙
2. 各ページで linkedom 上に `initPage()` を実行
3. `load-data.js` / `load-sections.js` の `<script>` を除去
4. アセットパスを `assets/` に書き換え
5. `dist/{filename}.html` として出力
6. `assets/` と `scripts/animation.js` を `dist/` へコピー

**下層ページビルド時の必須設定**

linkedom はインライン `<script>` を実行しないため、ビルドスクリプト側で明示的に設定する。

```javascript
window.__SRC_BASE__ = "../";
window.__ASSET_BASE__ = "../../assets/";
window.__SITE_BUILD__ = true;
```

---

## ディレクトリ構成（テンプレート）

```
project-root/
├── assets/images/
├── dist/
├── docs/
│   ├── builder-workflow.md
│   └── PROJECT_CONTEXT.md
├── scripts/
│   └── build-production.mjs
├── src/
│   ├── components/
│   ├── data/
│   │   ├── facility.json
│   │   └── content.json
│   ├── index.html
│   ├── pages/
│   ├── sections/
│   ├── scripts/
│   │   ├── load-data.js
│   │   ├── load-sections.js
│   │   └── animation.js
│   ├── styles/
│   └── templates/web-production/
│       ├── site.manifest.json
│       └── index.template.html
├── package.json
└── README.md
```

---

## 検証チェックリスト（Builder 完了判定）

### 開発環境

- [ ] プロジェクトルートで `py -m http.server 8080` を起動
- [ ] `http://localhost:8080/src/index.html` — TOP 全セクション表示
- [ ] `http://localhost:8080/src/pages/{page}.html` — 下層各ページ表示
- [ ] ナビリンクが全ページで機能
- [ ] 画像 404 がない
- [ ] `file://` 直開きは **使わない**

### ページシェル・横幅（完了必須）

- [ ] 下層シェルがテンプレート規約どおり（ラッパー / `main.site-main` / body overflow）
- [ ] 代表幅（例: 1366px / 1920px）で Header・main・Footer の横幅が一致
- [ ] セクション内に **absolute + 固定 artboard 幅** の残存がない
- [ ] 横スクロールが発生しない
- [ ] export 由来の固定幅ラッパーをシェルに残していない
- [ ] 全ページシェルに `responsive-fluid.css` を link（[responsive-patterns.md](./responsive-patterns.md)）
- [ ] 1024px / 1280px で横スクロールなし（compact desktop）

**Builder Agent 向け（5行）**

1. セクション分割前にシェルを `page-shell.md` へ合わせる  
2. export ラッパーを正としない（可変幅 + max-width + 中央寄せ）  
3. `main.site-main` と `data-page` を付ける  
4. absolute + 固定 artboard 幅を親基準 full-bleed / w-full へ直す  
5. 完了時に横幅チェックリストを実施する  

### 本番ビルド

- [ ] `npm run build` がエラーなく完了
- [ ] `dist/index.html` + `dist/{page}.html` が出力される
- [ ] `dist/` 内に `../assets/` や `pages/` プレフィックス付きリンクが残っていない
- [ ] `load-data.js` / `load-sections.js` が HTML に含まれていない
- [ ] 各 `dist/*.html` に GSAP（importmap）と `scripts/animation.js` が残っている
- [ ] アニメ確認前に OS の `prefers-reduced-motion`（Windows「アニメーション効果」）を確認

### Animation 向け Builder 引継ぎ

- [ ] TOP / 下層どちらも GSAP + `animation.js` を読み込んでいる
- [ ] 各ページの `body` に `data-page="..."` がある
- [ ] 高さ変化 UI（アコーディオン等）があるページは `data-motion="height-ui"` を付け、Animation にセクション fade オフを伝える
- [ ] Hero コンテナに `data-animate="hero"`
- [ ] カード列の親に `data-animate="stagger-grid"`
- [ ] Header / Footer に animate フックがない

### SEO / コンポーネント（Builder 完了条件）

- [ ] 各ページに `<h1>` が 1 つ（`data-page-hero="true"` 等）
- [ ] 各ページに固有 `title` + `meta description`
- [ ] `npm run build` 後、`dist` に `{{…}}` プレースホルダが残っていない

### Reviewer 引継ぎ

Builder 完了後、**375 / 768 / 1024 / 1280 / 1366 / 1920**（＋短い画面高）の目視は Reviewer 必須。  
チェックリスト: [reviewer-checklist.md](./reviewer-checklist.md) / Hero・compact desktop: [responsive-patterns.md](./responsive-patterns.md)

### ページ固有スクリプトを足すとき（完了条件）

1. `src/scripts/{name}.js`（`page:ready` / `DOMContentLoaded` 両対応。雛形: `page-script.example.js`）
2. 対象ページ HTML に `<script>`
3. `site.manifest.json` の `output.scripts` に追加（dist へコピー）
4. 下層の `../scripts/` → `scripts/` は `build-production.mjs` が一括置換（個別追加は不要）

どれか欠けると dist でスクリプト欠落する。**dist だけに script を足す / manifest のみ / HTML のみは禁止。**

### セクション HTML の文字コード

- UTF-8 **BOM なし**で保存する（BOM は dist に不可視文字として混入する）
- エディタの「UTF-8 with BOM」をオフにするか、保存後に BOM 除去を確認する

---

## テンプレートへのフィードバック（知見）

1. **Pencil 生 HTML をそのまま残さない** — 最初にページシェル化する
2. **ページシェルは TOP / 下層の 2 パターン** — `__SRC_BASE__` / `__ASSET_BASE__` を下層に必ず含める
3. **シェル横幅は可変 + max-width + 中央寄せ** — アートボード固定幅を正にしない（`page-shell.md`）
4. **セクション命名は `{page}-{role}`** — TOP ティーザーと下層フルページは別セクション
5. **JSON の href はファイル名のみ** — `resolvePageHref` を 1 箇所に集約
6. **パス規約を明文化** — TOP: `../assets/` / 下層: `../../assets/` / 本番: `assets/`
7. **本番ビルドは multi-page 対応** — `src/pages/*.html` → `dist/*.html`
8. **linkedom の制約** — インライン script は実行されない、置換は長いパスから
9. **HTTP サーバーはプロジェクトルートから起動**
10. **`body[data-page]`** — アニメ・固有 JS の分岐用。高さ変化 UI は `data-motion="height-ui"`
11. **ページ固有 JS** — HTML + manifest.output.scripts（パス置換は下層一括）
12. **セクションは UTF-8 BOM なし**
13. **レスポンシブ目視は Reviewer** — Builder は 1366/1920 の横幅整合まで
14. **`overflow-x: hidden` は安全網** — クリップで隠した固定幅を Builder 完了としない
15. **コンポーネント `{{VAR}}` は dist に残さない**
16. **`responsive-fluid.css` を全シェルに link** — 768–1439px の流体化（[responsive-patterns.md](./responsive-patterns.md)）
17. **Hero 高さは `clamp(560px, 85svh, 820px)`** — `min(820px, 70vh)` のみ禁止。Overlay hero は `--hero-content-reserve` と `top` を連動
18. **linkedom ビルド時** — Hero 動画の `load()` / `play()` を `__SITE_BUILD__` でスキップ

### 一般化フィードバック（英語 PR 用・参照先）

案件横展開向けの Must / Should / Do not template は [reviewer-checklist.md](./reviewer-checklist.md) 末尾「Feedback」節が正本。  
上記 16–18 はそのうちレスポンシブ・ビルド guard を日本語で要約したもの。実装詳細は [responsive-patterns.md](./responsive-patterns.md)。

---

## 関連ファイル

| ファイル | 役割 |
|----------|------|
| `docs/page-shell.md` | ページシェル・横幅規約 |
| `src/templates/web-production/page.shell.html` | 下層シェル雛形 |
| `src/scripts/load-sections.js` | section / pattern / component 展開 |
| `src/scripts/load-data.js` | JSON 注入・`resolvePageHref` |
| `scripts/build-production.mjs` | 本番静的 HTML 生成 |
| `src/templates/web-production/site.manifest.json` | ビルド設定 |
| `src/styles/responsive-fluid.css` | 768–1439px 流体化 |
| `docs/responsive-patterns.md` | Hero clamp / compact desktop 規約 |
| `package.json` | `build` スクリプト |

---

## 参考事例

宿泊施設案件（ならいの風）では TOP 1 + 下層 6 ページ、40+ セクション、49 画像参照を本構成で運用しました。  
**レスポンシブ知見**（1024–1439px 流体化、Hero 縦クリップ対策、linkedom 動画 guard）は [responsive-patterns.md](./responsive-patterns.md) へフィードバック済み。  
案件固有のコピー・画像・Pencil セレクタは **案件リポジトリ** で行い、テンプレート本体には戻しません。
