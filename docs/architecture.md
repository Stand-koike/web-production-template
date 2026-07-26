# Architecture

## 概要

`web-production-template` は、宿泊施設・観光・コーポレートサイト向けの
**横展開可能な Web 制作システム** である。

個別案件の完成ではなく、Component / Section / Data / Build を分離し、
AI Agent が役割ごとに作業できる構造を目指す。

## レイヤー構成

```
Pencil.dev Export
        ↓
Builder Agent（ページシェル化）
        ↓
┌──────────────────────────────────────┐
│  Page Shell     src/index.html       │
│                 src/pages/*.html     │
│  Section Layer  src/sections/        │
│  Component      src/components/      │
│  Data Layer     src/data/            │
│  Style Layer    src/styles/          │
│  Runtime        src/scripts/load-*.js│
│  Manifest       templates/web-production/ │
└──────────────────────────────────────┘
        ↓
Build System（scripts/build-production.mjs + linkedom）
        ↓
Production HTML（dist/*.html フラット）
```

## 責務分離

| レイヤー | 役割 | 変更者 |
|---------|------|--------|
| Section | ページ断片 + `data-content-bind` | Builder |
| Component | 最小 UI 部品（`data-component`） | Builder |
| Pattern | Header / Footer 共通ブロック | Builder |
| Data | 施設情報・コンテンツ | 案件リポジトリ |
| Style | Token / Theme / Layout | Builder / Performance |
| Script | Animation | Animation Agent |

## Data Flow

```
facility.json  → 施設共通（ブランド、連絡先、Theme）
content.json   → ページコンテンツ（Hero、News、FAQ、Gallery 等）
site.manifest.json → ビルド設定
```

開発時:

```
loadSections → applyFacilityData / applyContentData → loadPatterns → loadComponents
```

本番ビルドは同じ `initPage()` を linkedom 上で実行し、静的 HTML を出力する。

## Theme System

`facility.json` の `theme` から `dist/styles/theme.css` を生成する。

```
tokens.css  → デフォルト Token
theme.css   → 施設ごとの上書き
main.css    → レイアウト / Component スタイル
```

## Asset / Link Strategy

| 参照元 | 開発時 | 本番 |
|--------|--------|------|
| TOP | `../assets/...` | `assets/...` |
| 下層 | `../../assets/...` | `assets/...` |
| href | `about.html`（JSON） | TOP 開発のみ `pages/about.html` |

## Repository 分離

| リポジトリ | 用途 |
|-----------|------|
| web-production-template | 制作システム本体 |
| sotoura 等 | 個別案件（コピー、画像、調整） |

## 関連ドキュメント

- `docs/build-system.md`
- `docs/builder-workflow.md`
- `docs/component-guide.md`
- `docs/pattern-guide.md`
- `docs/PROJECT_CONTEXT.md`
