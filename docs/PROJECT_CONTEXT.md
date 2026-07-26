# web-production-template 開発引継ぎ資料

## Repository

対象: `web-production-template`

目的: AI Agent と協働する Web 制作基盤の構築

このリポジトリは、個別案件を完成させる場所ではなく、
宿泊施設・観光サイト・コーポレートサイト制作へ横展開できる
「制作システム」を構築する場所である。

---

## 現状サマリー（2026-07-27）

**骨格〜典型サイト一式は完成。** 案件横展開の準備段階。  
ページシェル横幅規約（固定 artboard 幅の再発防止）を docs / 雛形 / CSS / Builder プロンプトへ反映済み。

| 領域 | 状態 |
|------|------|
| Build（multi-page / linkedom） | ✅ |
| TOP（hero〜CTA） | ✅ |
| 下層（雛形 + sample pages） | ✅ |
| ページシェル横幅規約 | ✅（`docs/page-shell.md`） |
| Component / Pattern runtime | ✅ |
| Theme / Tokens | ✅ |
| Animation（page:ready / height-ui） | ✅ |
| Docs（workflow / deploy / adoption） | ✅ |
| 案件固有作業 | ❌（案件リポ側） |

---

## Core Mission

1. Component Library — runtime 接続済み
2. Section / Pattern — header/footer/feature-card/image-text/full-bleed
3. Data Layer — facility.json / content.json
4. Build System — `npm run build` → `dist/*.html`
5. AI Agent Workflow — prompts / docs 整備済み
6. Page Shell — 可変幅 + max-width + `main.site-main` + overflow 抑制

---

## ページ構成

### TOP (`src/index.html`)

hero → intro → stay → bridge → gallery → news → faq → final-cta

### 下層 (`src/pages/`)

| ページ | 出力 | セクション |
|--------|------|-----------|
| about.html | dist/about.html | about-hero（image-text） |
| rooms.html | dist/rooms.html | rooms-types（feature-card） |
| access.html | dist/access.html | access-intro（image-text reverse） |

各シェル: `body[data-page]` + `main.site-main`。新規下層は `page.shell.html` からコピー。  
高さ変化 UI があるページは `data-motion="height-ui"`。

---

## ディレクトリ構成

```
src/
  index.html
  pages/{about,rooms,access}.html
  sections/
  components/
  data/{facility,content}.json
  scripts/{load-data,load-sections,animation}.js
  styles/{tokens,theme,main}.css
  templates/web-production/
    page.shell.html   ← 下層シェル雛形
scripts/build-production.mjs
docs/
  page-shell.md       ← 横幅・シェル規約
assets/images/
dist/
```

---

## 禁止事項

- 施設固有コピー・画像・デザイン調整をこのリポジトリで行わない
- 案件固有 hack / class を追加しない

---

## 次のタスク

1. 案件横展開時は `docs/case-adoption.md` + `docs/page-shell.md` に従いシェル規約を守る
2. 実デザイン export での Builder フロー検証（横幅チェックリスト含む）
3. Reviewer / Performance Agent の実務プロンプト強化（必要時）
4. Testimonial 等の追加 Pattern（案件要求が出てから）

---

## 関連ドキュメント

- `docs/page-shell.md`
- `docs/builder-workflow.md`
- `docs/build-system.md`
- `docs/deployment.md`
- `docs/case-adoption.md`
- `docs/component-guide.md`
- `docs/pattern-guide.md`
- `docs/architecture.md`
- `docs/animation-system.md`
- `docs/animation-spec.md`
- `docs/content-map-spec.md`
