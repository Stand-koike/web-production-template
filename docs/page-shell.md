# Page Shell Convention

ページシェル（TOP / 下層）の横幅・構造規約。  
Builder で外部デザインツール由来 HTML を分解するとき、**シェル構造の不備が横幅崩れの主因**になりうる。セクション個別の不具合ではなく、ここで防ぐ。

実装の正: `src/index.html` / `src/pages/*.html` / `src/templates/web-production/page.shell.html` / `src/styles/main.css`

---

## 必須ルール（TOP / 下層共通）

| 項目 | 正 | 禁止 |
|------|----|------|
| ページラッパー | 可変幅 + 最大幅 + 中央寄せ（`.container`） | アートボード px の固定幅直写（例: `w-[1440px]`） |
| flex 子 | stretch 前提（内容幅に縮ませない） | 親だけ狭く・子が shrink して横にずれる構成 |
| `<main>` | 明示的に全幅（`.site-main`） | 固定幅で main を囲む |
| `body` | 横方向 overflow 抑制（CSS 標準） | export 由来の巨大 fixed 幅を残したまま |

### CSS（テンプレート標準）

- `body` … `overflow-x: clip`（または `hidden`）
- `.site-main` … `width: 100%` / `display: block`
- `.container` … `width: min(…, calc(100% - …))` + `margin-inline: auto`

---

## 下層シェル雛形

ファイル: `src/templates/web-production/page.shell.html`  
コピー先: `src/pages/{name}.html`

### 必須グローバル

| 変数 | 値 | 用途 |
|------|-----|------|
| `__SRC_BASE__` | `"../"` | sections / scripts / styles の相対基準 |
| `__ASSET_BASE__` | `"../../assets/"` | 開発時の画像パス（本番はビルドで `assets/`） |

### include パス

| 対象 | 下層からのパス |
|------|----------------|
| header / footer / section | `../sections/...` |
| styles | `../styles/...` |
| scripts | `../scripts/...` |
| 画像（section 内） | `../../assets/...` |

### ページ識別

```html
<body data-page="{name}">
<!-- 高さ変化 UI がある場合のみ -->
<body data-page="{name}" data-motion="height-ui">
```

### 骨組み（要約）

```
body[data-page]
  ├─ header include
  ├─ main.site-main
  │    └─ section includes（1 ブロックずつ）
  ├─ footer include
  ├─ __SRC_BASE__ / __ASSET_BASE__
  ├─ GSAP importmap
  └─ load-data / load-sections / animation.js
```

TOP はパスが一段浅いだけで、**ラッパー / main / overflow の規約は同一**。

---

## セクション共通パターン（固定幅 export 対策）

デザイン export の **absolute + 固定 artboard 幅** は、親コンテナ幅と不一致を起こしやすい。

| 用途 | 推奨 | 避ける |
|------|------|--------|
| Hero / CTA オーバーレイ | 親基準の full-bleed（幅 100%、親 relative） | 固定 artboard 幅の absolute レイヤ |
| 複合レイアウト（列・タイムライン等） | 容器 max-width + 子 `width: 100%` | absolute 固定幅スロットの並び |
| 全幅帯 | `full-bleed-banner` と同思想（親いっぱいに伸ばす） | ページ中央の細い箱の中に「全幅風」を絶対配置 |

Builder は **セクション分割の前に** ページシェルを本規約へ合わせる。  
export HTML のラッパークラスをそのまま正としない。

---

## Builder 横幅チェック（完了必須）

- [ ] 下層シェルがテンプレート規約どおり（ラッパー / `main.site-main` / body overflow）
- [ ] 代表ビューポート幅で Header・main・Footer の横幅が一致
- [ ] セクション内に absolute + 固定 artboard 幅の残存がない
- [ ] 横スクロールが発生しない

詳細手順は [builder-workflow.md](./builder-workflow.md) を参照。

---

## 関連

- [case-adoption.md](./case-adoption.md) — 案件への下層追加時
- [pattern-guide.md](./pattern-guide.md) — full-bleed 等
