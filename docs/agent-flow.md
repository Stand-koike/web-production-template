# Agent Flow

## Overview

役割ごとに AI Agent を分離する。

## Flow

```
Pencil.dev
    ↓
Builder        … 構造・1366/1920 横幅・SEO 骨組み
    ↓
Animation      … GSAP（dev: page:ready / prod: DOMContentLoaded）
    ↓
Reviewer       … 375/768/1366/1920 目視・dist 確認
    ↓
Performance    … 画像・配信
    ↓
Deploy         … dist/ のみ公開（main root 禁止）
```

## Agent Responsibility

### Builder

- HTML 構造・ページシェル・データ切り出し
- デスクトップ横幅整合（1366/1920）
- **レスポンシブ目視はしない**

### Animation

- GSAP + ScrollTrigger（必要なページのみ）
- `prefers-reduced-motion`

### Reviewer

- **375 / 768 / 1366 / 1920**（src + dist）
- SEO / a11y / `{{…}}` 残存なし
- コード修正禁止（報告のみ）

### Performance

- 画像リサイズ・lazy/async
- 未使用 JS 削減

### Deploy

- **`dist/` のみ**をホスト
- GitHub Pages: **gh-pages** または Actions（**main/(root) → 404**）

## 関連

- [builder-workflow.md](./builder-workflow.md)
- [reviewer-checklist.md](./reviewer-checklist.md)
- [deployment.md](./deployment.md)
- [performance.md](./performance.md)
