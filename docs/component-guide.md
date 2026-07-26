# Component Guide

## 概要

Component は **最小単位の UI 部品** である。
`data-component` プレースホルダを `load-sections.js` が展開する。

配置: `src/components/`

## Runtime 接続済み一覧

| Component | ファイル | data-component |
|-----------|---------|----------------|
| Button | `button.html` | `button` |
| PhoneDisplay | `phone-display.html` | `phone-display` |
| SectionHeading | `section-heading.html` | `section-heading` |
| Nav Link | `nav-link.html` | `nav-link` |
| Nav Group | `nav-group.html` | `nav-group` |
| News Card | `news-card.html` | `news-card` |
| FAQ Card | `faq-card.html` | `faq-card` |
| Badge | `badge.html` | `badge` |
| Divider | `divider.html` | `divider` |
| Image | `image.html` | `image` |
| SocialLinks | `social-links.html` | `social-links` |

## テンプレート構文

Component HTML は `{{UPPERCASE}}` プレースホルダを使う。
`data-label` → `{{LABEL}}`、`data-date-iso` → `{{DATE_ISO}}`。

例:

```html
<a class="{{CLASSES}}" href="{{HREF}}">{{LABEL}}</a>
```

## 使用例

### 静的プレースホルダ

```html
<div data-component="button" data-variant="primary" data-label="詳しく見る" data-href="#intro"></div>
```

### JSON から動的生成（load-data.js）

```js
list.innerHTML = items.map((item) =>
  `<div data-component="news-card" data-date="${item.date}" data-title="${item.title}" data-href="${item.href}"></div>`
).join("");
```

`applyContentData()` の後に `loadComponents()` が走るため、動的生成分も展開される。

## 追加ルール

1. デザインは Token（`tokens.css` / `theme.css`）経由で管理
2. 施設固有の class 名を追加しない
3. Builder Agent のみが Component を編集する
4. Animation class（`js-fade-up` 等）は Component または Section に付与
