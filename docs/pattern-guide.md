# Pattern / Section Guide

## 概要

現行アーキテクチャでは **ページ断片は `src/sections/`** が正である。
共通ブロックは `data-pattern` として `load-sections.js` が展開する。

旧 `src/patterns/*.html`（`{{#each}}` / `{{> partial}}` 構文）は削除済み。

## Pattern（runtime）

| Pattern | 定義場所 | 用途 |
|---------|---------|------|
| header | `load-sections.js` + `sections/header.html` | サイトヘッダー |
| footer | `load-sections.js` + `sections/footer.html` | サイトフッター |
| feature-card | `load-sections.js` | 特徴カード（Stay / Rooms） |
| image-text-section | `load-sections.js` | 画像 + テキスト（About / Access） |
| full-bleed-banner | `load-sections.js` | 全幅バナー（親いっぱいに伸ばす） |

### レイアウト思想（固定幅 export 対策）

デザイン export の absolute + 固定 artboard 幅は親幅とずれやすい。Pattern / Section では次を正とする（詳細: [page-shell.md](./page-shell.md)）。

| 用途 | 推奨 |
|------|------|
| 全幅帯・オーバーレイ | 親 relative + 子 width 100%（full-bleed） |
| 複合列レイアウト | 容器 max-width（`.container`）+ 子 w-full |
| コンテンツ幅 | `.container`（可変幅 + 最大幅 + 中央寄せ） |

アートボード px の直写ラッパーは Pattern に残さない。

### header 利用例

```html
<div data-pattern="header" data-facility-bind="header">
  <template data-slot="nav-items">
    <div data-component="nav-group" data-content-bind="nav-header"></div>
  </template>
</div>
```

## Section

| Section | ファイル | data-content-bind |
|---------|---------|-------------------|
| Hero | `sections/hero.html` | `hero` |
| Intro | `sections/intro.html` | `intro` |
| Stay | `sections/stay.html` | `stay` |
| Bridge | `sections/bridge.html` | `bridge` |
| Gallery | `sections/gallery.html` | `gallery` |
| News | `sections/news.html` | `news` |
| FAQ | `sections/faq.html` | `faq` |
| Final CTA | `sections/final-cta.html` | `final-cta` |
| About | `sections/about-hero.html` | `about` |
| Rooms | `sections/rooms-types.html` | `rooms-page` |
| Access | `sections/access-intro.html` | `access-page` |

## Data 連携

1. `loadSections()` が `data-include` を展開
2. `applyFacilityData()` / `applyContentData()` が JSON を注入
3. `loadPatterns()` → `loadComponents()` で UI を完成

`content.json` の href はファイル名のみ（例: `rooms.html`）。
解決は `resolvePageHref()` に任せる。

## 追加ルール

1. Section はページ固有の hack を含めない
2. 施設固有コピーは `content.json` で差し替える
3. Builder Agent が Section 構造を整理する
4. Animation Agent は HTML 構造を変更しない

## 追加候補（案件要求が出てから）

- Testimonial
- Timeline
- Restaurant Menu
