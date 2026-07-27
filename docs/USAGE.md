# テンプレートの使い方

Stand Studio **web-production-template** の実務ガイド。  
「何のためのリポジトリか」「案件では何をどの順番で進めるか」を 1 本にまとめた資料です。

---

## 1. まず理解すること

### 2 つのリポジトリ

| リポジトリ | 役割 | ここでやること |
|-----------|------|----------------|
| **web-production-template** | 制作**システム** | シェル・ビルド・Agent プロンプト・共通規約の改善 |
| **案件リポジトリ**（例: 宿泊施設サイト） | **完成品** | コピー・画像・デザイン調整・公開 |

> **テンプレで宿のサイトを完成させない。**  
> 案件で作り、うまくいった**一般化できる知見だけ**をテンプレへ戻す。

### このテンプレが提供するもの

- ページシェル + セクション + コンポーネントの**構造**
- 開発時ランタイム（`load-data.js` / `load-sections.js`）
- 本番ビルド（`npm run build` → `dist/`）
- GSAP アニメーションの**起動規約**
- Builder / Reviewer / Performance / Deploy 用 **Agent プロンプト**
- 横幅・SEO・Deploy 404 防止などの**チェックリスト**

---

## 2. 制作フロー（案件側の正しい順番）

```
Pencil.dev（デザイン export）
    ↓
① Builder      … HTML をシェル + セクションに分解
    ↓
② Animation    … GSAP（fade-up / stagger 等）
    ↓
③ Reviewer     … 375/768/1366/1920 目視・dist 確認
    ↓
④ Performance  … 画像・配信の最適化
    ↓
⑤ Deploy       … dist/ のみ公開
```

**工程を飛ばさない。** 特に Reviewer 前の Deploy は禁止。

### 誰が何を見るか

| 工程 | 主な確認 | 完了の目安 |
|------|----------|------------|
| Builder | 構造・リンク・**1366/1920** 横幅 | シェル規約 OK・ビルド成功 |
| Animation | 動き・dist でアニメ起動 | src / dist 両方 |
| Reviewer | **375/768/1366/1920**・SEO・a11y | Critical ゼロ |
| Performance | 画像サイズ・lazy 等 | 大きな改善のみ実施 |
| Deploy | **dist/** の公開 | 本番 URL で 404 なし |

---

## 3. 案件を始める（初回セットアップ）

詳細: [case-adoption.md](./case-adoption.md)

1. **案件リポジトリ**を用意（テンプレを fork / コピー / サブツリー）
2. 最低限コピーするもの:
   - `src/` / `scripts/build-production.mjs` / `package.json` / `assets/`
   - `docs/`（workflow・page-shell・reviewer-checklist・deployment 等）
   - `.cursor/prompts/`（Agent 用）
3. `npm install`
4. `src/data/facility.json` / `content.json` を案件値に差し替え
5. `assets/images/` に画像を配置
6. 開発確認:

   ```bash
   py -m http.server 8080
   # http://localhost:8080/src/index.html
   ```

7. 本番確認:

   ```bash
   npm run build
   npm run preview
   # http://localhost:4173
   ```

---

## 4. 各工程の進め方（Agent への投げ方）

Cursor で **案件リポジトリを開き**、該当プロンプトを `@` で参照して依頼します。

### ① Builder

**プロンプト:** `.cursor/prompts/builder.md`  
**参照 doc:** [builder-workflow.md](./builder-workflow.md) / [page-shell.md](./page-shell.md)

**依頼例:**

```text
@.cursor/prompts/builder.md @docs/page-shell.md

Pencil export をページシェル + セクションに分解してください。
デザイン変更禁止。セクション分割前にシェル規約を適用してください。
```

**Builder 完了チェック（抜粋）**

- [ ] `main.site-main` / `body[data-page]` / 下層は `__SRC_BASE__`・`__ASSET_BASE__`
- [ ] 固定 artboard 幅ラッパーなし
- [ ] 各ページ `<h1>` + `title` + `meta description`
- [ ] 1366/1920 で Header・main・Footer 横幅一致
- [ ] **375/768 はまだ Reviewer の仕事**

下層ページ追加: `src/templates/web-production/page.shell.html` をコピー。

---

### ② Animation

**プロンプト:** `.cursor/prompts/animation.md`  
**参照 doc:** [animation-system.md](./animation-system.md) / [animation-spec.md](./animation-spec.md)

**依頼例:**

```text
@.cursor/prompts/animation.md @src/scripts/animation.js

全ページに fade-up / stagger を適用。dist でも page:ready 非依存で動くこと。
Header/Footer は動かさない。
```

**注意:** 本番（dist）は `DOMContentLoaded` で起動。`page:ready` のみだと dist で動かない。

---

### ③ Reviewer

**プロンプト:** `.cursor/prompts/reviewer.md`  
**参照 doc:** [reviewer-checklist.md](./reviewer-checklist.md)

**依頼例:**

```text
@.cursor/prompts/reviewer.md @docs/reviewer-checklist.md @src/ @dist/

375 / 768 / 1366 / 1920 で src と dist をレビュー。コード修正はせず報告のみ。
```

**Reviewer 必須:** 4 幅すべてを **src と dist** で目視。  
`overflow-x: hidden` だけでは不十分（クリップで隠れた崩れを疑う）。

指摘修正後、必要なら Reviewer を再実行。

---

### ④ Performance

**プロンプト:** `.cursor/prompts/performance.md`  
**参照 doc:** [performance.md](./performance.md)

**依頼例:**

```text
@.cursor/prompts/performance.md @docs/performance.md @assets/ @src/ @dist/

Reviewer 完了済み。効果が大きい最適化だけ。見た目は変えない。
```

---

### ⑤ Deploy

**プロンプト:** `.cursor/prompts/deploy.md`  
**参照 doc:** [deployment.md](./deployment.md)

**依頼例:**

```text
@.cursor/prompts/deploy.md @docs/deployment.md @.github/workflows/deploy-pages.yml

Reviewer / Performance 完了済み。GitHub Pages へ dist/ のみ公開。
main/(root) 公開は禁止。
```

**GitHub Pages 設定（重要）**

| 設定 | 正 | 誤（404 になる） |
|------|----|------------------|
| 公開元 | **`gh-pages` / (root)** または GitHub Actions | **`main` / (root)** |
| 公開物 | `npm run build` の **`dist/` 中身** | リポジトリ root |

---

## 5. 日常で使うコマンド

| 目的 | コマンド |
|------|----------|
| 開発サーバー | `py -m http.server 8080` → `/src/index.html` |
| 本番ビルド | `npm run build` |
| 公開相当の確認 | `npm run preview` → http://localhost:4173 |
| 画像一覧（最適化前） | `npm run optimize-images` |

**開発時:** `file://` 直開き不可（fetch が失敗する）。  
**サーバーはプロジェクトルート**から起動。

---

## 6. ディレクトリの読み方

```
src/
  index.html              TOP シェル（data-include のみ）
  pages/*.html            下層シェル
  sections/               ページ断片（Hero / Intro 等）
  components/             再利用 UI（button / nav-link 等）
  data/                   facility.json / content.json
  scripts/
    load-data.js          JSON 注入
    load-sections.js      section / pattern / component 展開
    animation.js          GSAP
dist/                     本番出力（gitignore・公開対象）
assets/                   画像（開発 ../assets/ → 本番 assets/）
```

**データの切り分け**

- `facility.json` … ブランド・連絡先・テーマ色（変更少）
- `content.json` … セクション文言・ナビ（href は `about.html` 形式のみ）

---

## 7. よくある落とし穴

| 症状 | 原因 | 対処 |
|------|------|------|
| GitHub Pages が 404 | `main` / root を公開している | `gh-pages` または Actions + **dist** |
| dist でアニメが動かない | `page:ready` のみ待ち | animation.js の prod 起動規約を確認 |
| 下層だけ横幅が狭い | シェルに固定 artboard 幅 | [page-shell.md](./page-shell.md) |
| CTA が「消えた」 | ScrollTrigger + 高さ変化 UI | `data-motion="height-ui"`（Hero のみ） |
| 画像 404（開発） | サーバーを `src/` から起動 | **ルート**から `py -m http.server` |
| dist に `{{VAR}}` 残存 | コンポーネント未展開 | data-* 属性 or ビルド失敗を確認 |
| 横スクロールは無いがレイアウトがおかしい | overflow でクリップ | Reviewer で固定幅残留を確認 |

---

## 8. テンプレへフィードバックするとき

案件で得た知見のうち、**一般化できるものだけ**をテンプレへ PR / 貼り付け。

**戻す例:** シェル規約・ビルド手順・Reviewer チェック・Deploy 404 防止  
**戻さない例:** 宿名・コピー・写真・下層 IA・案件固有 JS

形式の例は [reviewer-checklist.md](./reviewer-checklist.md) 末尾の「Feedback」節。

---

## 9. ドキュメント早見表

| 知りたいこと | 読むファイル |
|-------------|-------------|
| **全体の使い方（本書）** | **USAGE.md** |
| 案件の初回セットアップ | [case-adoption.md](./case-adoption.md) |
| Builder 手順 | [builder-workflow.md](./builder-workflow.md) |
| 横幅・シェル規約 | [page-shell.md](./page-shell.md) |
| Reviewer 完了条件 | [reviewer-checklist.md](./reviewer-checklist.md) |
| アニメーション | [animation-system.md](./animation-system.md) |
| 画像・Performance | [performance.md](./performance.md) |
| 公開・Pages | [deployment.md](./deployment.md) |
| ビルドの仕組み | [build-system.md](./build-system.md) |
| テンプレ開発状況 | [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) |
| Agent 依頼文 | `.cursor/prompts/*.md` |

---

## 10. 最小チェックリスト（公開直前）

- [ ] `npm run build` 成功
- [ ] `npm run preview` で TOP + 全下層 OK
- [ ] Reviewer: 375/768/1366/1920（**dist 含む**）Critical ゼロ
- [ ] Pages 設定が **dist → gh-pages**（main root 禁止）
- [ ] 本番 URL で CSS / JS / 画像 404 なし

以上で 1 案件の標準フローは完結です。
